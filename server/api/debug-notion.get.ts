import { useNotionConfig, useNotionFetch } from '../utils/notion'

export default defineEventHandler(async (event) => {
  const { token, dbId } = useNotionConfig()
  const cleanId = dbId.replace(/-/g, '')
  
  let databaseInfo = null
  let firstPageProperties = null
  let error = null

  try {
    // 尝试获取数据库元数据
    const db: any = await useNotionFetch(`databases/${dbId}`)
    databaseInfo = {
      title: db.title?.[0]?.plain_text,
      properties: Object.keys(db.properties)
    }

    // 尝试查询一篇文章
    const query: any = await useNotionFetch(`databases/${dbId}/query`, {
      method: 'POST',
      body: { page_size: 1 }
    })

    if (query.results.length > 0) {
      const page = query.results[0]
      firstPageProperties = {}
      for (const key of Object.keys(page.properties)) {
        const prop = page.properties[key]
        firstPageProperties[key] = {
          type: prop.type,
          // 简单显示内容
          value: prop[prop.type]
        }
      }
    }
  } catch (e: any) {
    error = e.data || e.message
  }
  
  return {
    status: error ? 'Error' : 'Success',
    error,
    config: {
      dbId,
      cleanedId: cleanId,
      tokenExists: !!token
    },
    database: databaseInfo,
    samplePageProperties: firstPageProperties,
    recommendations: [
      '1. 检查数据库列名是否与代码匹配（如：标题、状态、发布日期）',
      '2. 确保文章的“状态”列确实被设为了 "Published"',
      '3. 如果列名不同，请修改 server/api/posts.get.ts 中的映射逻辑'
    ]
  }
})
