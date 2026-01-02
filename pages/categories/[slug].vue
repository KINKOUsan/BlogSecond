<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- 面包屑导航 -->
    <nav class="flex mb-8 text-sm text-morandi-subtext" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <NuxtLink to="/" class="hover:text-morandi-accent transition-colors flex items-center">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
            首页
          </NuxtLink>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
            <NuxtLink to="/categories" class="ml-1 md:ml-2 hover:text-morandi-accent transition-colors">文章分类</NuxtLink>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
            <span class="ml-1 md:ml-2 font-medium text-morandi-text">{{ categoryName }}</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- 顶部标题和描述 -->
    <div class="mb-12 bg-morandi-card p-8 rounded-3xl shadow-sm border border-gray-50">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-4xl font-bold text-morandi-text mb-4">{{ categoryName }}</h1>
          <p class="text-morandi-subtext text-lg max-w-2xl leading-relaxed">
            {{ categoryInfo?.desc || `探索关于 ${categoryName} 的所有精彩内容，共收录 ${posts.length} 篇文章。` }}
          </p>
        </div>
        <div class="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
          <div class="w-12 h-12 rounded-full bg-morandi-accent/10 flex items-center justify-center text-morandi-accent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-morandi-text">{{ posts.length }}</div>
            <div class="text-xs text-morandi-subtext uppercase tracking-wider">文章数量</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="bg-morandi-card rounded-2xl h-96 animate-pulse"></div>
    </div>

    <div v-else-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <NuxtLink 
        v-for="post in posts" 
        :key="post.id" 
        :to="`/posts/${post.id}`"
        class="group bg-morandi-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
      >
        <div class="relative aspect-video overflow-hidden">
          <img :src="post.cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" :alt="post.title">
          <div class="absolute top-4 left-4">
            <span class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-morandi-accent shadow-sm">
              {{ post.category }}
            </span>
          </div>
        </div>
        
        <div class="p-6 flex flex-col flex-grow">
          <div class="flex items-center text-xs text-morandi-subtext mb-3">
            <span>{{ post.date }}</span>
            <span class="mx-2">•</span>
            <span v-if="post.pinned" class="text-morandi-accent font-medium">置顶</span>
          </div>
          
          <h3 class="text-xl font-bold text-morandi-text mb-3 group-hover:text-morandi-accent transition-colors line-clamp-2">
            {{ post.title }}
          </h3>
          
          <p class="text-morandi-subtext text-sm line-clamp-3 mb-6 flex-grow">
            {{ post.excerpt }}
          </p>
          
          <div class="flex flex-wrap gap-2 mt-auto">
            <span v-for="tag in post.tags" :key="tag" class="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
              #{{ tag }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- 分页 -->
    <div v-if="hasMore || cursors.length > 1" class="mt-16 flex justify-center items-center gap-4">
      <button 
        @click="prevPage" 
        :disabled="cursors.length <= 1 || pending"
        class="flex items-center px-6 py-3 bg-white border border-gray-100 rounded-xl text-morandi-text font-medium shadow-sm hover:shadow-md hover:border-morandi-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        上一页
      </button>
      
      <span class="text-morandi-subtext font-medium px-4">
        第 {{ cursors.length }} 页
      </span>

      <button 
        @click="nextPage" 
        :disabled="!hasMore || pending"
        class="flex items-center px-6 py-3 bg-white border border-gray-100 rounded-xl text-morandi-text font-medium shadow-sm hover:shadow-md hover:border-morandi-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        下一页
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>

    <!-- 空状态 -->
    <div v-if="!pending && posts.length === 0" class="text-center py-32 bg-morandi-card rounded-3xl">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-morandi-text mb-2">该分类下暂无文章</h3>
      <p class="text-morandi-subtext mb-8">博主正在努力创作中，请稍后再来。</p>
      <NuxtLink to="/categories" class="px-6 py-3 bg-morandi-accent text-white rounded-xl hover:shadow-lg transition-all">
        探索其他分类
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const categoryName = computed(() => decodeURIComponent(route.params.slug));

// 分页状态
const pageSize = 9;
const cursors = ref([undefined]); // 存储每一页的起始 cursor
const currentCursorIndex = ref(0);

const { data: categoriesResponse } = await useFetch('/api/categories');
const categoryInfo = computed(() => {
  return categoriesResponse.value?.data?.find(c => c.name === categoryName.value);
});

const { data: response, pending, refresh } = await useFetch('/api/posts', {
  query: {
    category: categoryName.value,
    pageSize: pageSize,
    cursor: computed(() => cursors.value[currentCursorIndex.value])
  }
});

const posts = computed(() => response.value?.data || []);
const hasMore = computed(() => response.value?.has_more || false);
const nextCursor = computed(() => response.value?.next_cursor);

const nextPage = () => {
  if (hasMore.value && nextCursor.value) {
    cursors.value.push(nextCursor.value);
    currentCursorIndex.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevPage = () => {
  if (currentCursorIndex.value > 0) {
    cursors.value.pop();
    currentCursorIndex.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

useHead({
  title: `${categoryName.value} - 文章分类`,
  meta: [
    { name: 'description', content: categoryInfo.value?.desc || `查看关于 ${categoryName.value} 的所有文章` }
  ]
});
</script>
