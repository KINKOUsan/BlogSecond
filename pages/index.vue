<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 加载状态 -->
    <div v-if="pending" class="space-y-12">
      <!-- Hero Skeleton -->
      <div class="h-[400px] md:h-[500px] bg-gray-200 animate-pulse rounded-2xl"></div>
      
      <div class="flex flex-col lg:flex-row gap-10">
        <div class="lg:w-3/4">
          <div class="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="h-80 bg-gray-200 animate-pulse rounded-xl"></div>
          </div>
        </div>
        <aside class="lg:w-1/4 space-y-8">
          <div class="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
          <div class="h-48 bg-gray-200 animate-pulse rounded-xl"></div>
        </aside>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="py-20 text-center">
      <div class="inline-block p-6 bg-red-50 rounded-xl border border-red-100">
        <h2 class="text-xl font-bold text-red-600 mb-2">获取文章失败</h2>
        <p class="text-red-500 text-sm">{{ error.statusMessage || '请检查 Notion 配置或网络连接' }}</p>
        <button @click="refresh" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          重试
        </button>
      </div>
    </div>

    <!-- 正常显示内容 -->
    <div v-else>
      <!-- 英雄区 (Hero Section) -->
      <section v-if="featuredPost" class="mb-12 rounded-2xl overflow-hidden shadow-lg relative group h-[400px] md:h-[500px]">
        <img :src="featuredPost.cover || '/images/119896322_p0.png'" :alt="featuredPost.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3 lg:w-1/2 text-white">
          <span class="inline-block px-3 py-1 bg-morandi-accent text-white text-xs font-semibold tracking-wide uppercase rounded-full mb-3">
            {{ featuredPost.pinned ? '置顶推荐' : '最新文章' }}
          </span>
          <h1 class="text-3xl md:text-4xl font-bold mb-3 leading-tight">{{ featuredPost.title }}</h1>
          <p class="text-gray-200 text-sm md:text-base line-clamp-2 mb-4">{{ featuredPost.excerpt }}</p>
          <NuxtLink :to="`/posts/${featuredPost.id}`" class="inline-flex items-center text-white font-medium hover:underline">
            阅读全文 
            <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </NuxtLink>
        </div>
      </section>

      <div class="flex flex-col lg:flex-row gap-10">
        <!-- 左侧文章列表 -->
        <div class="lg:w-3/4">
          <div class="flex justify-between items-end mb-6">
            <h2 class="text-2xl font-bold text-morandi-text relative pl-4">
              <span class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-morandi-accent rounded-full"></span>
              最新文章
            </h2>
            <NuxtLink to="/categories" class="text-sm text-morandi-subtext hover:text-morandi-accent">查看更多 &rarr;</NuxtLink>
          </div>

          <!-- 文章网格 -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <article v-for="post in posts" :key="post.id" class="bg-morandi-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full">
              <NuxtLink :to="`/posts/${post.id}`" class="block h-48 overflow-hidden">
                <img :src="post.cover || '/images/110257210_p0.jpg'" :alt="post.title" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
              </NuxtLink>
              <div class="p-5 flex flex-col flex-grow">
                <div class="flex items-center space-x-2 mb-3">
                  <span class="px-2 py-1 bg-gray-100 text-morandi-subtext text-xs rounded-md">{{ post.category }}</span>
                  <span class="text-morandi-subtext text-xs">{{ formatDate(post.date) }}</span>
                </div>
                <h3 class="text-lg font-bold mb-2 hover:text-morandi-accent transition-colors line-clamp-2">
                  <NuxtLink :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
                </h3>
                <p class="text-morandi-subtext text-sm line-clamp-3 mb-4 flex-grow">
                  {{ post.excerpt }}
                </p>
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in post.tags" :key="tag" class="text-[10px] px-1.5 py-0.5 bg-morandi-bg text-morandi-subtext rounded">#{{ tag }}</span>
                </div>
              </div>
            </article>
          </div>

          <!-- 空状态 -->
          <div v-if="posts.length === 0" class="text-center py-12 bg-morandi-card rounded-xl">
            <p class="text-morandi-subtext">暂无文章发布</p>
          </div>
        </div>

        <!-- 右侧侧边栏 -->
        <aside class="lg:w-1/4 space-y-8">
          <!-- 个人简介 -->
          <div class="bg-morandi-card rounded-xl p-6 shadow-sm text-center">
            <div class="relative w-24 h-24 mx-auto mb-4">
              <img src="/images/koharu.jpg" alt="Avatar" class="w-24 h-24 rounded-full object-cover border-4 border-morandi-bg">
              <div class="absolute bottom-0 right-0 w-6 h-6 bg-morandi-accent rounded-full border-2 border-white flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
              </div>
            </div>
            <h3 class="text-xl font-bold text-morandi-text mb-1">KINKOUsan</h3>
            <p class="text-morandi-subtext text-sm mb-4">全栈开发 / 音乐、ACG爱好者</p>
            <!-- <div class="flex justify-center space-x-3 mb-6">
              <a href="#" class="text-morandi-subtext hover:text-morandi-accent"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
              <a href="#" class="text-morandi-subtext hover:text-morandi-accent"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
            </div> -->
            <button class="w-full bg-morandi-text text-white py-2 rounded-lg hover:bg-morandi-accent transition-colors">关注我</button>
          </div>

          <!-- 热门标签云 -->
          <div class="bg-morandi-card rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold text-morandi-text mb-4 border-b pb-2 border-gray-100">热门标签</h3>
            <div class="flex flex-wrap gap-2">
              <a v-for="tag in allTags" :key="tag" href="#" class="px-3 py-1 bg-gray-100 hover:bg-morandi-accent hover:text-white rounded-full text-sm text-morandi-subtext transition-colors">{{ tag }}</a>
            </div>
          </div>

          <!-- 邮件订阅 -->
          <!-- <div class="bg-morandi-accent/10 rounded-xl p-6 shadow-sm border border-morandi-accent/20">
            <h3 class="text-lg font-bold text-morandi-text mb-2">订阅更新</h3>
            <p class="text-sm text-morandi-subtext mb-4">每周精选文章，直接发送到您的邮箱。</p>
            <form class="space-y-3">
              <input type="email" placeholder="您的邮箱地址" class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-morandi-accent focus:border-transparent bg-white">
              <button type="submit" class="w-full bg-morandi-accent text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors shadow-md">
                立即订阅
              </button>
            </form>
          </div> -->
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: response, pending, error, refresh } = await useFetch('/api/posts', {
  query: { pageSize: 12 }
});

const posts = computed(() => response.value?.data || []);

// 提取置顶文章，如果没有置顶则取第一篇
const featuredPost = computed(() => {
  if (posts.value.length === 0) return null;
  return posts.value.find(p => p.pinned) || posts.value[0];
});

// 提取所有标签并去重
const allTags = computed(() => {
  const tags = new Set();
  posts.value.forEach(post => {
    post.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).slice(0, 10); // 只取前10个
});

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
</script>
