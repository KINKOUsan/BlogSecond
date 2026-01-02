import { useNotionConfig, useNotionFetch } from '../utils/notion'

export default defineEventHandler(async (event) => {
  const { dbId } = useNotionConfig()
  const query = getQuery(event)
  const q = query.q as string

  if (!q) {
    return {
      success: true,
      data: []
    }
  }

  if (!dbId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NOTION_DATABASE_ID is missing',
    })
  }

  try {
    // 1. 获取数据库定义以进行状态过滤
    const dbInfo: any = await useNotionFetch(`databases/${dbId}`)
    const properties = dbInfo.properties

    // 获取状态过滤逻辑 (与 posts.get.ts 保持一致)
    const statusProp = properties['状态'] || properties['Status']
    let targetStatusName = ''
    let targetStatusValue = ''

    if (statusProp) {
      targetStatusName = Object.keys(properties).find(k => k.trim() === '状态' || k.trim() === 'Status')!
      const options = statusProp.status?.options || statusProp.select?.options || []
      const hasPublished = options.some((o: any) => o.name === 'Published')
      const hasDone = options.some((o: any) => o.name === 'Done')
      const hasFinished = options.some((o: any) => o.name === '已发布' || o.name === '已完成')
      targetStatusValue = hasPublished ? 'Published' : (hasDone ? 'Done' : (hasFinished ? options.find((o: any) => o.name === '已发布' || o.name === '已完成').name : ''))
    }

    // 2. 执行搜索
    const response: any = await useNotionFetch('search', {
      method: 'POST',
      body: {
        query: q,
        filter: {
          value: 'page',
          property: 'object'
        },
        page_size: 20
      }
    })

    const currentDbId = dbId.replace(/-/g, '').toLowerCase()

    const results = response.results
      .filter((page: any) => {
        // A. 基础过滤：必须属于当前数据库
        const parentId = page.parent?.database_id?.replace(/-/g, '').toLowerCase()
        const isFromDb = page.parent?.type === 'database_id' && parentId === currentDbId
        if (!isFromDb) return false

        // B. 状态过滤：如果是发布状态才显示
        if (targetStatusName && targetStatusValue) {
          const pageStatusProp = page.properties[targetStatusName]
          const pageStatus = pageStatusProp?.status?.name || pageStatusProp?.select?.name
          if (pageStatus !== targetStatusValue) return false
        }

        // C. 标题过滤：确保有标题
        const title = page.properties['标题']?.title?.[0]?.plain_text || page.properties['Title']?.title?.[0]?.plain_text
        if (!title || title === '无标题') return false

        return true
      })
      .map((page: any) => {
        const props = page.properties
        
        const getProp = (name: string) => {
          const key = Object.keys(props).find(k => k.trim() === name.trim())
          return key ? props[key] : null
        }

        // 提取摘要
        const excerptProp = getProp('摘要')
        let excerpt = ''
        if (excerptProp) {
          if (excerptProp.type === 'rich_text') {
            excerpt = excerptProp.rich_text?.[0]?.plain_text || ''
          } else if (excerptProp.type === 'formula') {
            excerpt = excerptProp.formula?.string || excerptProp.formula?.number?.toString() || ''
          }
        }

        // 提取封面图
        let cover = ''
        const coverProp = getProp('封面图')
        if (coverProp?.files?.length > 0) {
          const file = coverProp.files[0]
          cover = file.type === 'external' ? file.external.url : file.file.url
        } else if (page.cover) {
          cover = page.cover.type === 'external' ? page.cover.external.url : page.cover.file.url
        }

        return {
          id: page.id,
          title: getProp('标题')?.title?.[0]?.plain_text || getProp('Title')?.title?.[0]?.plain_text || '无标题',
          excerpt: excerpt,
          date: getProp('发布日期')?.date?.start || getProp('日期')?.date?.start || getProp('Date')?.date?.start || '',
          category: getProp('分类')?.select?.name || '未分类',
          cover: cover,
        }
      })

    return {
      success: true,
      data: results
    }

  } catch (error: any) {
    console.error('[Search API Error]:', error.data || error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to search posts from Notion',
    })
  }
})
