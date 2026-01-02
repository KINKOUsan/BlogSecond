<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:pt-32">
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-morandi-text/40 backdrop-blur-sm" @click="close"></div>
      
      <!-- 搜索框容器 -->
      <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        <!-- 搜索输入区域 -->
        <div class="p-4 border-b border-gray-100 flex items-center gap-3">
          <div class="text-morandi-subtext">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            ref="searchInput"
            v-model="query"
            type="text"
            placeholder="搜索文章标题或内容..."
            class="flex-grow bg-transparent border-none focus:ring-0 text-sm text-morandi-text placeholder:text-gray-300"
            @input="handleInput"
            @keydown.esc="close"
          >
          <button @click="close" class="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 内容区域 -->
        <div class="flex-grow overflow-y-auto custom-scrollbar p-6">
          <!-- 加载中 -->
          <div v-if="pending" class="flex flex-col items-center py-12 text-morandi-subtext">
            <div class="animate-spin mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p>正在搜索...</p>
          </div>

          <!-- 搜索历史 -->
          <div v-else-if="!query && history.length > 0" class="space-y-4">
            <div class="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>最近搜索</span>
              <button @click="clearHistory" class="hover:text-morandi-accent transition-colors">清空全部</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="item in history" 
                :key="item" 
                class="px-4 py-2 bg-gray-50 hover:bg-morandi-hover rounded-xl text-sm text-morandi-text transition-all flex items-center gap-2 group"
                @click="query = item; handleSearch(item)"
              >
                <span>{{ item }}</span>
                <span class="text-gray-300 group-hover:text-gray-500" @click.stop="removeHistory(item)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <!-- 搜索结果 -->
          <div v-else-if="results.length > 0" class="space-y-4">
            <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              找到 {{ results.length }} 篇相关文章
            </div>
            <NuxtLink 
              v-for="post in results" 
              :key="post.id" 
              :to="`/posts/${post.id}`"
              class="group flex gap-4 p-4 hover:bg-morandi-hover rounded-2xl transition-all"
              @click="close"
            >
              <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                <img :src="post.cover" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="">
              </div>
              <div class="flex-grow min-w-0">
                <h4 class="text-morandi-text font-bold mb-1 group-hover:text-morandi-accent transition-colors line-clamp-1" v-html="highlight(post.title)"></h4>
                <p class="text-sm text-morandi-subtext line-clamp-2" v-html="highlight(post.excerpt)"></p>
                <div class="mt-2 flex items-center text-[10px] text-gray-400 gap-3">
                  <span class="px-2 py-0.5 bg-white rounded-full border border-gray-100">{{ post.category }}</span>
                  <span>{{ post.date }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- 空状态 -->
          <div v-else-if="query && !pending" class="py-20 text-center">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-morandi-text font-bold mb-1">未找到相关结果</h3>
            <p class="text-sm text-morandi-subtext">换个关键词试试吧？</p>
          </div>

          <!-- 初始状态提示 -->
          <div v-else-if="!query" class="py-20 text-center">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-morandi-text font-bold mb-1">开始搜索</h3>
            <p class="text-sm text-morandi-subtext">输入关键词寻找你感兴趣的文章</p>
          </div>
        </div>

        <!-- 底部快捷键提示 -->
        <div class="px-6 py-4 bg-gray-50 flex items-center gap-6 text-[10px] text-gray-400 border-t border-gray-100">
          <div class="flex items-center gap-1.5">
            <kbd class="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] font-sans">ESC</kbd>
            <span>关闭</span>
          </div>
          <div class="flex items-center gap-1.5">
            <kbd class="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] font-sans">ENTER</kbd>
            <span>选择</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const query = ref('');
const results = ref([]);
const pending = ref(false);
const searchInput = ref(null);
const history = ref([]);

// 聚焦输入框
watch(() => props.isOpen, (val) => {
  if (val) {
    nextTick(() => {
      searchInput.value?.focus();
    });
    loadHistory();
  }
});

// 加载历史记录
const loadHistory = () => {
  const saved = localStorage.getItem('search_history');
  if (saved) {
    history.value = JSON.parse(saved);
  }
};

// 保存历史记录
const saveHistory = (q) => {
  if (!q.trim()) return;
  const newHistory = [q, ...history.value.filter(item => item !== q)].slice(0, 10);
  history.value = newHistory;
  localStorage.setItem('search_history', JSON.stringify(newHistory));
};

// 移除单个历史记录
const removeHistory = (item) => {
  history.value = history.value.filter(i => i !== item);
  localStorage.setItem('search_history', JSON.stringify(history.value));
};

// 清空历史记录
const clearHistory = () => {
  history.value = [];
  localStorage.removeItem('search_history');
};

// 高亮关键词
const highlight = (text) => {
  if (!query.value || !text) return text;
  const regex = new RegExp(`(${query.value})`, 'gi');
  return text.replace(regex, '<mark class="bg-morandi-accent/20 text-morandi-accent font-bold px-0.5 rounded">$1</mark>');
};

// 搜索逻辑
let debounceTimer;
const handleInput = () => {
  clearTimeout(debounceTimer);
  if (!query.value.trim()) {
    results.value = [];
    return;
  }
  
  debounceTimer = setTimeout(() => {
    handleSearch(query.value);
  }, 500);
};

const handleSearch = async (q) => {
  if (!q.trim()) return;
  
  pending.value = true;
  try {
    const data = await $fetch('/api/search', {
      query: { q }
    });
    if (data?.success) {
      results.value = data.data;
      if (results.value.length > 0) {
        saveHistory(q);
      }
    }
  } catch (err) {
    console.error('Search failed:', err);
  } finally {
    pending.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}

:deep(mark) {
  background-color: rgba(155, 168, 168, 0.2);
  color: #9BA8A8;
  border-radius: 2px;
  padding: 0 1px;
}
</style>
