<template>
  <div class="bg-morandi-bg text-morandi-text font-sans antialiased min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <nav class="bg-morandi-card/90 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/" class="text-2xl font-bold tracking-wider text-morandi-text">KINKOU Blog</NuxtLink>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:flex space-x-8 items-center">
            <NuxtLink to="/" class="text-morandi-text hover:text-morandi-accent transition-colors font-medium" active-class="text-morandi-accent">首页</NuxtLink>
            <NuxtLink to="/categories" class="text-morandi-text hover:text-morandi-accent transition-colors font-medium" active-class="text-morandi-accent">文章分类</NuxtLink>
            <NuxtLink to="/about" class="text-morandi-text hover:text-morandi-accent transition-colors font-medium" active-class="text-morandi-accent">关于我</NuxtLink>
            <!-- <NuxtLink to="/library" class="text-morandi-text hover:text-morandi-accent transition-colors font-medium" active-class="text-morandi-accent">图书馆</NuxtLink> -->
          </div>

          <!-- Icons -->
          <div class="flex items-center space-x-4">
            <button 
              @click="isSearchOpen = true"
              class="text-morandi-text hover:text-morandi-accent transition-colors p-2 rounded-full hover:bg-morandi-hover"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button class="md:hidden text-morandi-text hover:text-morandi-accent p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 搜索模态框 -->
    <SearchModal :is-open="isSearchOpen" @close="isSearchOpen = false" />

    <!-- 主内容区 -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="bg-white border-t border-gray-100 py-8">
      <div class="container mx-auto px-4 text-center">
        <p class="text-morandi-subtext text-sm">© 2026 MyBlog. All rights reserved.</p>
        <div class="mt-4 flex justify-center space-x-6 text-sm text-morandi-subtext">
          <!-- <NuxtLink to="#" class="hover:text-morandi-text">隐私政策</NuxtLink>
          <NuxtLink to="#" class="hover:text-morandi-text">服务条款</NuxtLink>
          <NuxtLink to="#" class="hover:text-morandi-text">联系我们</NuxtLink> -->
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const isSearchOpen = ref(false);

// 快捷键支持 (Ctrl/Cmd + K)
onMounted(() => {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      isSearchOpen.value = true;
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
});
</script>

<style>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background: #F7F5F2;
}
::-webkit-scrollbar-thumb {
    background: #D4D0C8;
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: #9BA8A8;
}
</style>
