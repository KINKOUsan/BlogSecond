<template>
  <div class="bg-morandi-bg min-h-screen pb-20">
    <!-- 加载状态 -->
    <div v-if="pending" class="container mx-auto px-4 pt-12">
      <div class="max-w-4xl mx-auto">
        <div class="h-10 w-2/3 bg-gray-200 animate-pulse rounded mb-6"></div>
        <div class="h-6 w-1/4 bg-gray-200 animate-pulse rounded mb-10"></div>
        <div class="h-[400px] bg-gray-200 animate-pulse rounded-2xl mb-10"></div>
        <div class="space-y-4">
          <div v-for="i in 10" :key="i" class="h-4 bg-gray-200 animate-pulse rounded" :style="{ width: Math.random() * 40 + 60 + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="container mx-auto px-4 pt-20 text-center">
      <div class="inline-block p-8 bg-white rounded-2xl shadow-sm border border-red-100">
        <h2 class="text-2xl font-bold text-red-600 mb-4">文章加载失败</h2>
        <p class="text-gray-500 mb-6">抱歉，我们无法找到这篇文章或加载过程中出现了错误。</p>
        <NuxtLink to="/" class="px-6 py-2 bg-morandi-accent text-white rounded-lg hover:bg-opacity-90 transition-all">
          返回首页
        </NuxtLink>
      </div>
    </div>

    <!-- 文章内容 -->
    <div v-else-if="post" class="container mx-auto px-4">
      <article class="max-w-4xl mx-auto">
        <!-- 返回按钮 -->
        <div class="pt-8 mb-8">
          <NuxtLink to="/" class="inline-flex items-center text-morandi-subtext hover:text-morandi-accent transition-colors group">
            <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            返回列表
          </NuxtLink>
        </div>

        <!-- 文章头部 -->
        <header class="mb-10 text-center">
          <div class="flex justify-center items-center space-x-3 mb-4">
            <span class="px-3 py-1 bg-white text-morandi-accent text-xs font-medium rounded-full shadow-sm">{{ post.category }}</span>
            <span class="text-morandi-subtext text-sm">{{ formatDate(post.date) }}</span>
          </div>
          <h1 class="text-3xl md:text-5xl font-bold text-morandi-text mb-6 leading-tight">{{ post.title }}</h1>
          
          <div class="flex items-center justify-center space-x-4 text-morandi-subtext">
            <div class="flex items-center">
              <img src="/images/koharu.jpg" class="w-6 h-6 rounded-full mr-2 object-cover" alt="Author">
              <span class="text-sm font-medium">KINKOUsan</span>
            </div>
            <span class="text-gray-300">|</span>
            <div class="flex items-center space-x-2">
              <span v-for="tag in post.tags" :key="tag" class="text-xs">#{{ tag }}</span>
            </div>
          </div>
        </header>

        <!-- 封面图 -->
        <div v-if="post.cover" class="mb-12 rounded-2xl overflow-hidden shadow-xl aspect-video">
          <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover">
        </div>

        <!-- 正文渲染 -->
        <div class="prose prose-lg max-w-none prose-morandi">
          <template v-for="block in post.content" :key="block.id">
            <!-- 标题 -->
            <h1 v-if="block.type === 'heading_1'" class="text-3xl font-bold mt-12 mb-6 text-morandi-text">
              <NotionText :text="block.heading_1.rich_text" />
            </h1>
            <h2 v-else-if="block.type === 'heading_2'" class="text-2xl font-bold mt-10 mb-4 text-morandi-text border-l-4 border-morandi-accent pl-4">
              <NotionText :text="block.heading_2.rich_text" />
            </h2>
            <h3 v-else-if="block.type === 'heading_3'" class="text-xl font-bold mt-8 mb-3 text-morandi-text">
              <NotionText :text="block.heading_3.rich_text" />
            </h3>

            <!-- 段落 -->
            <p v-else-if="block.type === 'paragraph'" class="mb-6 leading-relaxed text-morandi-text/90">
              <NotionText :text="block.paragraph.rich_text" />
            </p>

            <!-- 列表 -->
            <ul v-else-if="block.type === 'bulleted_list_item'" class="list-disc list-inside mb-4 space-y-2 pl-4">
              <li class="text-morandi-text/90">
                <NotionText :text="block.bulleted_list_item.rich_text" />
              </li>
            </ul>
            <ol v-else-if="block.type === 'numbered_list_item'" class="list-decimal list-inside mb-4 space-y-2 pl-4">
              <li class="text-morandi-text/90">
                <NotionText :text="block.numbered_list_item.rich_text" />
              </li>
            </ol>

            <!-- 引用 -->
            <blockquote v-else-if="block.type === 'quote'" class="border-l-4 border-morandi-subtext/30 bg-white/50 p-6 my-8 rounded-r-xl italic text-morandi-subtext">
              <NotionText :text="block.quote.rich_text" />
            </blockquote>

            <!-- 代码块 -->
            <div v-else-if="block.type === 'code'" class="my-8 rounded-xl overflow-hidden shadow-sm">
              <div class="bg-[#2d2d2d] px-4 py-2 text-gray-400 text-xs flex justify-between items-center">
                <span>{{ block.code.language }}</span>
                <button @click="copyCode(block.code.rich_text[0]?.plain_text)" class="hover:text-white transition-colors">复制代码</button>
              </div>
              <pre class="p-6 bg-[#1e1e1e] overflow-x-auto text-sm text-gray-300"><code>{{ block.code.rich_text[0]?.plain_text }}</code></pre>
            </div>

            <!-- 图片 -->
            <figure v-else-if="block.type === 'image'" class="my-10">
              <div class="rounded-xl overflow-hidden shadow-md">
                <img :src="block.image.type === 'external' ? block.image.external.url : block.image.file.url" class="w-full">
              </div>
              <figcaption v-if="block.image.caption?.length" class="text-center text-sm text-morandi-subtext mt-3">
                <NotionText :text="block.image.caption" />
              </figcaption>
            </figure>

            <!-- 表格 -->
            <div v-else-if="block.type === 'table'" class="my-10 overflow-x-auto">
              <table class="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                <tbody>
                  <tr v-for="(row, rowIndex) in block.table_rows" :key="row.id" :class="rowIndex === 0 && block.table.has_column_header ? 'bg-morandi-bg font-bold' : ''">
                    <td v-for="(cell, cellIndex) in row.table_row.cells" :key="cellIndex" class="border border-gray-100 p-4 text-sm text-morandi-text">
                      <NotionText :text="cell" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 分割线 -->
            <hr v-else-if="block.type === 'divider'" class="my-12 border-t border-gray-200">
          </template>
        </div>

        <!-- 文章脚部：分享与标签 -->
        <footer class="mt-16 pt-8 border-t border-gray-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in post.tags" :key="tag" class="px-3 py-1 bg-white text-morandi-subtext text-xs rounded-full border border-gray-100">
                #{{ tag }}
              </span>
            </div>
            <div class="flex items-center space-x-4">
              <button @click="sharePost" class="inline-flex items-center px-4 py-2 bg-morandi-accent text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium shadow-sm">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                分享文章
              </button>
            </div>
          </div>
        </footer>

        <!-- 上一篇/下一篇 -->
        <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink v-if="post.navigation.prev" :to="`/posts/${post.navigation.prev.id}`" class="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <span class="text-xs text-morandi-subtext mb-2 block">上一篇</span>
            <span class="text-morandi-text font-bold group-hover:text-morandi-accent transition-colors">{{ post.navigation.prev.title }}</span>
          </NuxtLink>
          <div v-else></div>
          
          <NuxtLink v-if="post.navigation.next" :to="`/posts/${post.navigation.next.id}`" class="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-right group">
            <span class="text-xs text-morandi-subtext mb-2 block">下一篇</span>
            <span class="text-morandi-text font-bold group-hover:text-morandi-accent transition-colors">{{ post.navigation.next.title }}</span>
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const id = route.params.id;

const { data: response, pending, error } = await useFetch(`/api/posts/${id}`);
const post = computed(() => response.value?.data);

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 复制功能
const copyCode = (text) => {
  navigator.clipboard.writeText(text);
  alert('代码已复制到剪贴板');
};

const sharePost = () => {
  navigator.clipboard.writeText(window.location.href);
  alert('文章链接已复制，快去分享吧！');
};

// 子组件：用于处理 Notion 的富文本渲染（包括加粗、颜色、链接等）
const NotionText = defineComponent({
  props: ['text'],
  render() {
    if (!this.text || !Array.isArray(this.text)) return null;
    return this.text.map((item, index) => {
      if (!item) return null;
      const { annotations, href, plain_text } = item;
      
      let el = h('span', {
        key: index,
        class: [
          annotations?.bold ? 'font-bold' : '',
          annotations?.italic ? 'italic' : '',
          annotations?.strikethrough ? 'line-through' : '',
          annotations?.underline ? 'underline' : '',
          annotations?.code ? 'px-1 py-0.5 bg-gray-100 text-red-500 rounded text-sm font-mono' : '',
        ],
        style: annotations?.color && annotations.color !== 'default' ? { color: annotations.color } : {}
      }, plain_text || '');

      if (href) {
        return h('a', { href, target: '_blank', class: 'text-morandi-accent hover:underline' }, el);
      }
      return el;
    });
  }
});
</script>

<style>
/* 自定义莫兰迪色系的 Prose 样式 */
.prose-morandi {
  --tw-prose-body: #4A403A;
  --tw-prose-headings: #4A403A;
  --tw-prose-links: #9BA8A8;
  --tw-prose-bold: #4A403A;
  --tw-prose-quotes: #8C8580;
  --tw-prose-quote-borders: #D4D0C8;
}

.prose pre {
  margin: 0 !important;
  border-radius: 0 !important;
}
</style>
