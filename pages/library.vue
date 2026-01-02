<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-morandi-text mb-4">我的图书馆</h1>
      <p class="text-morandi-subtext max-w-2xl mx-auto">阅读是灵魂的避难所。这里展示了我读过或正在阅读的书籍。</p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div v-for="book in books" :key="book.title" class="group relative aspect-[2/3] bg-morandi-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
        <img :src="book.cover" :alt="book.title" class="w-full h-full object-cover">
        <!-- 悬停遮罩 -->
        <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center text-white">
          <h3 class="font-bold text-lg mb-2">{{ book.title }}</h3>
          <p class="text-xs text-gray-300 mb-3">{{ book.author }}</p>
          <div class="flex text-yellow-400 text-xs">{{ '★'.repeat(book.rating) }}{{ '☆'.repeat(5 - book.rating) }}</div>
          <p class="text-xs mt-3 line-clamp-3 text-gray-200">{{ book.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const books = [
  { title: '百年孤独', author: '加西亚·马尔克斯', rating: 5, desc: '魔幻现实主义的巅峰之作，讲述布恩迪亚家族七代人的传奇故事。', cover: '/images/119896322_p0.png' },
  { title: '设计心理学', author: '唐纳德·诺曼', rating: 4, desc: '日常用品设计的经典之作，设计师必读。', cover: '/images/110257210_p0.jpg' },
  { title: '深入浅出Node.js', author: '朴灵', rating: 5, desc: 'Node.js 进阶必读，深入理解异步I/O和事件循环。', cover: '/images/110486537_p0.jpg' },
  { title: '瓦尔登湖', author: '梭罗', rating: 4, desc: '宁静致远，回归自然，寻找内心的平静。', cover: '/images/113612055_p0.jpg' },
  { title: 'JavaScript高级程序设计', author: '马特·弗里斯比', rating: 5, desc: '红宝书，前端开发者的圣经。', cover: '/images/119896322_p0.png' }
];
</script>
