import { useNotionConfig, useNotionFetch } from '../../utils/notion'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { dbId } = useNotionConfig()

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required',
    })
  }

  try {
    console.log(`[Notion API] Fetching detailed post: ${id}`)

    // 1. 获取页面属性
    const page: any = await useNotionFetch(`pages/${id}`)
    const props = page.properties

    // 2. 获取页面所有块内容
    const blocksResponse: any = await useNotionFetch(`blocks/${id}/children`)
    let blocks = blocksResponse.results

    // 3. 特殊处理：如果块是表格，需要递归获取它的行
    for (const block of blocks) {
      if (block.type === 'table' && block.has_children) {
        const tableRows: any = await useNotionFetch(`blocks/${block.id}/children`)
        block.table_rows = tableRows.results
      }
    }

    // 4. 获取相邻文章 (上一篇/下一篇)
    let prevPost = null
    let nextPost = null
    
    if (dbId) {
      const allPostsResponse: any = await useNotionFetch(`databases/${dbId}/query`, {
        method: 'POST',
        body: {
          sorts: [{ property: '发布日期', direction: 'descending' }],
          filter: { property: '状态', status: { equals: 'Published' } }
        }
      })
      
      const allPosts = allPostsResponse.results
      const currentIndex = allPosts.findIndex((p: any) => p.id === id)
      
      if (currentIndex > 0) {
        const next = allPosts[currentIndex - 1]
        nextPost = {
          id: next.id,
          title: next.properties['标题']?.title?.[0]?.plain_text || '下一篇'
        }
      }
      
      if (currentIndex < allPosts.length - 1 && currentIndex !== -1) {
        const prev = allPosts[currentIndex + 1]
        prevPost = {
          id: prev.id,
          title: prev.properties['标题']?.title?.[0]?.plain_text || '上一篇'
        }
      }
    }

    const getProp = (name: string) => {
      const key = Object.keys(props).find(k => k.trim() === name.trim())
      return key ? props[key] : null
    }

    // 获取封面
    let cover = ''
    const coverProp = getProp('封面图')
    if (coverProp?.files?.length > 0) {
      const file = coverProp.files[0]
      cover = file.type === 'external' ? file.external.url : file.file.url
    } else if (page.cover) {
      cover = page.cover.type === 'external' ? page.cover.external.url : page.cover.file.url
    }

    // 获取作者信息
    const authorProp = getProp('作者')
    const author = authorProp?.people?.[0]?.name || authorProp?.rich_text?.[0]?.plain_text || '博主小明'

    return {
      success: true,
      data: {
        id: page.id,
        title: getProp('标题')?.title?.[0]?.plain_text || '无标题',
        date: getProp('发布日期')?.date?.start || '',
        category: getProp('分类')?.select?.name || '未分类',
        tags: getProp('标签')?.multi_select?.map((tag: any) => tag.name) || [],
        author: author,
        cover: cover,
        content: blocks,
        navigation: {
          prev: prevPost,
          next: nextPost
        }
      }
    }

  } catch (error: any) {
    console.error('[Notion API Error]:', error.data || error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch post details',
    })
  }
})
