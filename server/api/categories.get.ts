import { useNotionConfig, useNotionFetch } from '../utils/notion'

export default defineEventHandler(async (event) => {
  const { dbId } = useNotionConfig()

  if (!dbId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NOTION_DATABASE_ID is missing',
    })
  }

  try {
    // 步骤 1: 获取数据库定义以确定正确的状态过滤
    const dbInfo: any = await useNotionFetch(`databases/${dbId}`)
    const properties = dbInfo.properties

    const queryBody: any = {
      page_size: 100 // 假设分类不会超过 100 个
    }

    // 智能状态过滤逻辑 (与 posts.get.ts 保持一致)
    const statusProp = properties['状态'] || properties['Status']
    if (statusProp) {
      const propName = Object.keys(properties).find(k => k.trim() === '状态' || k.trim() === 'Status')!
      
      const options = statusProp.status?.options || statusProp.select?.options || []
      const hasPublished = options.some((o: any) => o.name === 'Published')
      const hasDone = options.some((o: any) => o.name === 'Done')
      const hasFinished = options.some((o: any) => o.name === '已发布' || o.name === '已完成')

      const targetStatus = hasPublished ? 'Published' : (hasDone ? 'Done' : (hasFinished ? options.find((o: any) => o.name === '已发布' || o.name === '已完成').name : null))

      if (targetStatus) {
        if (statusProp.type === 'status') {
          queryBody.filter = { property: propName, status: { equals: targetStatus } }
        } else if (statusProp.type === 'select') {
          queryBody.filter = { property: propName, select: { equals: targetStatus } }
        }
      }
    }

    // 获取文章以统计分类
    let response: any = await useNotionFetch(`databases/${dbId}/query`, {
      method: 'POST',
      body: queryBody
    })

    // 兜底方案：如果没找到结果，尝试无过滤查询
    if (response.results.length === 0 && queryBody.filter) {
      delete queryBody.filter
      response = await useNotionFetch(`databases/${dbId}/query`, {
        method: 'POST',
        body: queryBody
      })
    }

    const categoryMap = new Map()

    response.results.forEach((page: any) => {
      const props = page.properties
      // 兼容多种可能的分类属性名
      const categoryKey = Object.keys(props).find(k => {
        const name = k.trim();
        return name === '分类' || name === 'Category' || name === '类别';
      })
      const categoryName = categoryKey ? props[categoryKey]?.select?.name : null

      if (categoryName) {
        if (!categoryMap.has(categoryName)) {
          categoryMap.set(categoryName, {
            name: categoryName,
            count: 0,
            image: '', // 后续可从该分类的第一篇文章获取封面
          })
        }
        const cat = categoryMap.get(categoryName)
        cat.count++
        
        // 如果该分类还没有封面图，尝试获取当前文章的封面
        if (!cat.image) {
          const coverPropKey = Object.keys(props).find(k => {
            const name = k.trim();
            return name === '封面图' || name === 'Cover' || name === '图片';
          })
          const coverProp = coverPropKey ? props[coverPropKey] : null
          if (coverProp?.files?.length > 0) {
            const file = coverProp.files[0]
            cat.image = file.type === 'external' ? file.external.url : file.file.url
          } else if (page.cover) {
            cat.image = page.cover.type === 'external' ? page.cover.external.url : page.cover.file.url
          }
        }
      }
    })

    // 预定义的样式配置
    const styleConfigs: Record<string, { gradient: string, icon: string, desc: string }> = {
      '技术分享': { gradient: 'from-blue-100 to-transparent', icon: 'code', desc: '前端开发与编程心得' },
      '生活随笔': { gradient: 'from-morandi-accent/20 to-transparent', icon: 'coffee', desc: '记录生活的点滴与感悟' },
      '旅行日记': { gradient: 'from-green-100 to-transparent', icon: 'map', desc: '足迹遍布山川湖海' },
      '读书笔记': { gradient: 'from-purple-100 to-transparent', icon: 'book', desc: '阅读与思考的结晶' },
      '摄影作品': { gradient: 'from-yellow-100 to-transparent', icon: 'camera', desc: '用镜头捕捉美好瞬间' },
      '美食探店': { gradient: 'from-pink-100 to-transparent', icon: 'utensils', desc: '味蕾的奇妙冒险' },
    }

    const categories = Array.from(categoryMap.values()).map(cat => {
      const style = styleConfigs[cat.name] || {
        gradient: 'from-gray-100 to-transparent',
        icon: 'folder',
        desc: `关于 ${cat.name} 的精彩文章`
      }
      return {
        ...cat,
        ...style,
        image: cat.image || '/images/110257210_p0.jpg' // 兜底图
      }
    })

    return {
      success: true,
      data: categories
    }

  } catch (error: any) {
    console.error('[Notion API Error]:', error.data || error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch categories from Notion',
    })
  }
})
