<template>
  <div class="min-h-screen bg-gray-100 text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-white border-b border-zinc-100">
        <div class="absolute inset-0" style="background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 40%, #f0fdf4 100%);"></div>
        <div class="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-24 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full mb-4 sm:mb-6">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            持续更新中
          </div>
          <h1 class="text-3xl sm:text-5xl font-bold text-zinc-800 mb-3 sm:mb-5 tracking-tight">创意</h1>
          <p class="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">探索知识，分享心得。记录技术学习与日常思考，在这里找到灵感与共鸣。</p>
        </div>
      </section>

      <!-- Feature Sections -->
      <section class="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-20">

        <!-- 文章 -->
        <div class="flex flex-col md:flex-row items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-emerald-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">文章</span>
              <router-link to="/idea/articles/" class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                开始阅读
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-emerald-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
              </div>
              <h2 class="text-lg font-semibold text-zinc-700 mb-2">文章</h2>
              <router-link to="/idea/articles/" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors">
                开始阅读
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h2 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">技术文章与随笔杂谈</h2>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">涵盖前端开发、后端技术、DevOps 等技术领域的实战经验和学习心得。同时也有日常思考与生活感悟，记录成长路上的点滴收获。文章支持按分类浏览和关键词搜索，方便快速找到感兴趣的内容。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">内容涵盖</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>前端开发：Vue、React、CSS、性能优化等技术分享</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>后端技术：Java、Go、数据库、微服务架构等实战经验</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>DevOps 与工程化：CI/CD、容器化、监控运维等最佳实践</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>
                <span>随笔杂谈：日常思考、读书笔记、职业成长感悟</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">前端开发</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">后端技术</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">DevOps</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">随笔杂谈</span>
            </div>
          </div>
        </div>

        <!-- 冷知识 -->
        <div class="flex flex-col md:flex-row-reverse items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-cyan-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-cyan-100 text-cyan-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">冷知识</span>
              <router-link to="/idea/coldknowledge" class="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                探索发现
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-cyan-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-cyan-100 text-cyan-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </div>
              <h2 class="text-lg font-semibold text-zinc-700 mb-2">冷知识</h2>
              <router-link to="/idea/coldknowledge" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-cyan-500 text-white text-sm font-medium rounded-lg hover:bg-cyan-600 transition-colors">
                探索发现
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h2 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">有趣的小知识</h2>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">探索生活中那些你可能不知道的有趣事实，从动物习性到科学原理，从历史趣闻到自然奥秘。每一条冷知识都能让你对这个世界多一份好奇，发现平凡生活中隐藏的惊喜与乐趣。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">内容涵盖</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>动物世界：昆虫、哺乳动物、海洋生物的神奇习性</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>人体奥秘：大脑、感官、睡眠等有趣的生理现象</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>科学原理：物理、化学、数学中的神奇现象</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>
                <span>历史趣闻：那些你可能不知道的历史小故事</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">趣味知识</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">科普</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">探索</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">发现</span>
            </div>
          </div>
        </div>

      </section>

      <!-- Coming Soon Hint -->
      <section class="bg-white border-t border-zinc-100">
        <div class="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-16 text-center">
          <div class="w-12 h-12 rounded-xl bg-zinc-50 text-zinc-300 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </div>
          <h3 class="text-sm font-medium text-zinc-500 mb-2">更多内容即将上线</h3>
          <p class="text-xs text-zinc-400">我们正在准备更多精彩内容，敬请期待</p>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>
