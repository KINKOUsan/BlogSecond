import { useNotionConfig, useNotionFetch } from '../utils/notion'

export default defineEventHandler(async (event) => {
  const { dbId } = useNotionConfig()
  const query = getQuery(event)

  const pageSize = parseInt(query.pageSize as string) || 12
  const startCursor = query.cursor as string | undefined

  if (!dbId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NOTION_DATABASE_ID is missing',
    })
  }

  try {
    // 步骤 1: 获取数据库定义
    const dbInfo: any = await useNotionFetch(`databases/${dbId}`)
    const properties = dbInfo.properties

    // 步骤 2: 构建查询
    const queryBody: any = {
      page_size: pageSize,
      start_cursor: startCursor
    }

    // 智能状态过滤逻辑
    const statusProp = properties['状态'] || properties['Status']
    const filters: any[] = []

    if (statusProp) {
      const propName = Object.keys(properties).find(k => k.trim() === '状态' || k.trim() === 'Status')!
      
      const options = statusProp.status?.options || statusProp.select?.options || []
      const hasPublished = options.some((o: any) => o.name === 'Published')
      const hasDone = options.some((o: any) => o.name === 'Done')
      const hasFinished = options.some((o: any) => o.name === '已发布' || o.name === '已完成')

      const targetStatus = hasPublished ? 'Published' : (hasDone ? 'Done' : (hasFinished ? options.find((o: any) => o.name === '已发布' || o.name === '已完成').name : null))

      if (targetStatus) {
        if (statusProp.type === 'status') {
          filters.push({ property: propName, status: { equals: targetStatus } })
        } else if (statusProp.type === 'select') {
          filters.push({ property: propName, select: { equals: targetStatus } })
        }
      }
    }

    // 分类过滤逻辑
    const categoryFilter = query.category as string
    if (categoryFilter) {
      const categoryPropName = Object.keys(properties).find(k => k.trim() === '分类')
      if (categoryPropName) {
        filters.push({ property: categoryPropName, select: { equals: categoryFilter } })
      }
    }

    if (filters.length > 0) {
      if (filters.length === 1) {
        queryBody.filter = filters[0]
      } else {
        queryBody.filter = { and: filters }
      }
    }

    // 排序逻辑
    const dateProp = properties['发布日期'] || properties['日期'] || properties['Date']
    if (dateProp) {
      const propName = Object.keys(properties).find(k => k.trim() === '发布日期' || k.trim() === '日期' || k.trim() === 'Date')!
      queryBody.sorts = [{ property: propName, direction: 'descending' }]
    }

    console.log('[Notion API] Final Query Body:', JSON.stringify(queryBody, null, 2))

    let response: any = await useNotionFetch(`databases/${dbId}/query`, {
      method: 'POST',
      body: queryBody
    })

    // 如果启用了过滤但没找到结果，尝试无过滤查询（兜底方案）
    if (response.results.length === 0 && queryBody.filter) {
      console.warn('[Notion API] No results with filter, trying without filter...')
      delete queryBody.filter
      response = await useNotionFetch(`databases/${dbId}/query`, {
        method: 'POST',
        body: queryBody
      })
    }

    console.log(`[Notion API] Found ${response.results?.length || 0} items.`)

    const posts = response.results.map((page: any) => {
      const props = page.properties
      
      const getProp = (name: string) => {
        const key = Object.keys(props).find(k => k.trim() === name.trim())
        return key ? props[key] : null
      }

      // 提取摘要 (支持 formula)
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
        title: getProp('标题')?.title?.[0]?.plain_text || '无标题',
        slug: getProp('Slug')?.rich_text?.[0]?.plain_text || '',
        excerpt: excerpt,
        date: getProp('发布日期')?.date?.start || '',
        category: getProp('分类')?.select?.name || '未分类',
        tags: getProp('标签')?.multi_select?.map((tag: any) => tag.name) || [],
        cover: cover,
        pinned: getProp('置顶')?.checkbox || false,
      }
    })

    return {
      success: true,
      data: posts,
      next_cursor: response.next_cursor,
      has_more: response.has_more,
    }

  } catch (error: any) {
    console.error('[Notion API Error]:', error.data || error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch posts from Notion',
    })
  }
})
