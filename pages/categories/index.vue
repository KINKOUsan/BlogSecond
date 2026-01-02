<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-morandi-text mb-4">文章分类</h1>
      <p class="text-morandi-subtext max-w-2xl mx-auto">探索不同的主题，发现更多有趣的内容。</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-500">加载分类失败，请重试。</p>
      <button @click="refresh" class="mt-4 px-4 py-2 bg-morandi-accent text-white rounded-lg">重试</button>
    </div>

    <!-- 正常显示 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <NuxtLink 
        v-for="cat in categories" 
        :key="cat.name" 
        :to="`/categories/${encodeURIComponent(cat.name)}`" 
        class="group relative bg-morandi-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block h-64"
      >
        <div :class="`absolute inset-0 bg-gradient-to-br ${cat.gradient} z-0 group-hover:opacity-100 transition-opacity`"></div>
        <img :src="cat.image" class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700" :alt="cat.name">
        <div class="relative z-10 p-8 flex flex-col h-full justify-center items-center text-center">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-morandi-accent">
            <Icon :name="cat.icon" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-morandi-text mb-1">{{ cat.name }}</h3>
          <p class="text-morandi-subtext text-sm line-clamp-2">{{ cat.desc }}</p>
          <span class="mt-4 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs text-morandi-text font-medium">{{ cat.count }} 篇文章</span>
        </div>
      </NuxtLink>
    </div>

    <!-- 空状态 -->
    <div v-if="!pending && categories.length === 0" class="text-center py-20 bg-morandi-card rounded-2xl">
      <p class="text-morandi-subtext">暂无分类数据</p>
    </div>
  </div>
</template>

<script setup>
const { data: response, pending, error, refresh } = await useFetch('/api/categories');

const categories = computed(() => response.value?.data || []);

// 简单的图标组件，如果没安装专门的图标库，这里用 SVG 占位
const Icon = defineComponent({
  props: ['name'],
  setup(props) {
    const icons = {
      code: '<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />',
      coffee: '<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.077-.873 1.95-1.95 1.95h-11.5c-1.077 0-1.95-.873-1.95-1.95v-4.25m15.4-4.25c1.077 0 1.95.873 1.95 1.95v4.25c0 1.077-.873 1.95-1.95 1.95H4.85c-1.077 0-1.95-.873-1.95-1.95v-4.25c0-1.077.873-1.95 1.95-1.95h15.4ZM12 4.5v3m0 0V12m0-4.5h4.5M12 7.5H7.5" />',
      map: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-10.5v8.25m.503 3.446 1.995-1.852a1.125 1.125 0 0 0 0-1.664L15.497 11.25m0 0-2.493-2.315a1.125 1.125 0 0 0-1.503 0L9 11.25m0 0-2.493-2.315a1.125 1.125 0 0 0-1.503 0L3 11.25m0 0 1.995 1.852a1.125 1.125 0 0 0 1.503 0L9 11.25" />',
      book: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />',
      camera: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />',
      utensils: '<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21V10.5m0 10.5h4.5m-4.5 0H9m4.5-10.5h4.5m-4.5 0H9M9 3.75h6m-6 0a2.25 2.25 0 0 0-2.25 2.25v13.5M15 3.75a2.25 2.25 0 0 1 2.25 2.25v13.5" />',
      folder: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.06-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.31c-.199 0-.393-.079-.53-.217Z" />'
    };
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      'stroke-width': '1.5',
      stroke: 'currentColor',
      innerHTML: icons[props.name] || icons.folder
    });
  }
});
</script>
