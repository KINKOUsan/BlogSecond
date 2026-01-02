// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            morandi: {
              bg: '#F7F5F2',      // 极浅的暖灰背景
              text: '#4A403A',    // 深咖色文字
              subtext: '#8C8580', // 浅咖色辅助文字
              accent: '#9BA8A8',  // 莫兰迪绿/蓝 (用于按钮、高亮)
              card: '#FFFFFF',    // 卡片背景
              hover: '#E8E6E3',   // 悬停背景
              tag: '#D4D0C8'      // 标签背景
            }
          },
          fontFamily: {
            sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
          }
        }
      }
    }
  },
  app: {
    head: {
      title: '我的个人博客',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  runtimeConfig: {
    notionToken: process.env.NOTION_TOKEN,
    notionDatabaseId: process.env.NOTION_DATABASE_ID,
    public: {
      // 这里的配置会暴露给客户端
    }
  }
})
