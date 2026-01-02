export const useNotionConfig = () => {
  const config = useRuntimeConfig()
  
  // 优先从 runtimeConfig 取，如果没有则尝试 process.env
  const token = (config.notionToken || process.env.NOTION_TOKEN || '').trim()
  const dbId = (config.notionDatabaseId || process.env.NOTION_DATABASE_ID || '')
    .trim()
    .replace(/-/g, '') // 统一转为无横杠格式，Notion API 有时对带横杠的 ID 敏感

  return {
    token,
    dbId
  }
}

export const useNotionFetch = async (path: string, options: any = {}) => {
  const { token } = useNotionConfig()
  
  if (!token) {
    throw new Error('NOTION_TOKEN is missing')
  }

  const url = `https://api.notion.com/v1/${path.replace(/^\//, '')}`
  
  console.log(`[Notion API Fetch] Requesting: ${url}`)

  return await $fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: options.body,
    query: options.query
  })
}
