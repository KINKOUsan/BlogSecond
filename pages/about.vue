<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex flex-col lg:flex-row gap-12">
      <!-- 左侧：个人信息卡片 -->
      <aside class="lg:w-1/3">
        <div class="bg-morandi-card rounded-2xl p-8 shadow-sm sticky top-24 text-center">
          <div class="relative w-32 h-32 mx-auto mb-6">
            <img src="/images/koharu.jpg" alt="Avatar" class="w-32 h-32 rounded-full object-cover border-4 border-morandi-bg shadow-md">
            <div class="absolute bottom-1 right-1 w-8 h-8 bg-green-400 rounded-full border-4 border-white"></div>
          </div>
          <h2 class="text-2xl font-bold text-morandi-text mb-2">KINKOUsan</h2>
          <p class="text-morandi-accent font-medium mb-6">Full Stack Developer</p>
          
          <div class="space-y-4 text-left px-4">
            <div class="flex items-center text-morandi-subtext">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span>Guangzhou, China</span>
            </div>
            <div class="flex items-center text-morandi-subtext">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <span>2856832901@qq.com</span>
            </div>
          </div>

          <!-- <div class="mt-8 flex justify-center space-x-4">
            <a href="#" class="p-2 bg-gray-100 rounded-full text-morandi-subtext hover:bg-morandi-accent hover:text-white transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
          </div> -->
        </div>
      </aside>

      <!-- 右侧：详细内容 -->
      <div class="lg:w-2/3 space-y-8">
        <section class="bg-morandi-card rounded-2xl p-8 shadow-sm">
          <h3 class="text-xl font-bold text-morandi-text mb-4 flex items-center">
            <span class="w-1 h-6 bg-morandi-accent rounded-full mr-3"></span>
            关于我
          </h3>
          <div class="text-morandi-text space-y-4 leading-relaxed">
            <p>你好！我是KINKOUsan，一名热爱技术与生活的全栈工程师。我热衷于探索前沿技术，致力于构建优雅、高性能的界面。</p>
            <p>除了编程，我也是一名音乐爱好者。我相信技术服务于生活，而生活赋予技术灵感。</p>
          </div>
        </section>

        <section class="bg-morandi-card rounded-2xl p-8 shadow-sm">
          <h3 class="text-xl font-bold text-morandi-text mb-6 flex items-center">
            <span class="w-1 h-6 bg-morandi-accent rounded-full mr-3"></span>
            技术栈
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="skill in skills" :key="skill.name">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-morandi-text">{{ skill.name }}</span>
                <span class="text-sm font-medium text-morandi-subtext">{{ skill.level }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-morandi-accent h-2 rounded-full" :style="{ width: skill.level + '%' }"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const skills = [
  { name: 'Java', level: 78 },
  { name: 'Spring Boot', level: 40 },
  { name: 'C++', level: 60 },
  { name: 'Vue', level: 30 },
  { name: 'Python', level: 50 },
];
</script>
