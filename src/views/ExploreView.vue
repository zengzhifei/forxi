<template>
  <div class="min-h-screen bg-[#fafafa] text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-white border-b border-zinc-100">
        <div class="absolute inset-0" style="background: linear-gradient(135deg, #faf5ff 0%, #ffffff 40%, #ede9fe 100%);"></div>
        <div class="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-24 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 text-violet-600 text-xs font-medium rounded-full mb-4 sm:mb-6">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            开发者资源精选
          </div>
          <h1 class="text-3xl sm:text-5xl font-bold text-zinc-800 mb-3 sm:mb-5 tracking-tight">探索</h1>
          <p class="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">精选开发者工具与资源，助你提升效率、拓宽视野。</p>
        </div>
      </section>

      <!-- Feature Sections -->
      <section class="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-20">

        <!-- JetBrains -->
        <div class="flex flex-col md:flex-row items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-violet-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-violet-100 text-violet-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">JetBrains</span>
              <router-link to="/explore/jetbra" class="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                立即使用
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-violet-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-violet-100 text-violet-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <h3 class="text-lg font-semibold text-zinc-700 mb-2">JetBrains</h3>
              <router-link to="/explore/jetbra" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-violet-500 text-white text-sm font-medium rounded-lg hover:bg-violet-600 transition-colors">
                立即使用
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">JetBrains IDE 激活</h3>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">为开发者提供 JetBrains 全系列 IDE 的激活服务，支持 IntelliJ IDEA、PyCharm、WebStorm、GoLand、Rider、CLion 等主流开发工具，让你专注于编写代码，而不是为工具授权烦恼。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">支持产品</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>IntelliJ IDEA — Java / Kotlin 全能 IDE</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>PyCharm / WebStorm / GoLand — 各语言专属 IDE</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>Rider / CLion / DataGrip 等其他 JetBrains 产品</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">IntelliJ IDEA</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">PyCharm</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">WebStorm</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">GoLand</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">Rider</span>
            </div>
          </div>
        </div>

      </section>

      <!-- Coming Soon -->
      <section class="bg-white border-t border-zinc-100">
        <div class="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-16 text-center">
          <div class="w-12 h-12 rounded-xl bg-zinc-50 text-zinc-300 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </div>
          <h3 class="text-sm font-medium text-zinc-500 mb-2">更多资源即将上线</h3>
          <p class="text-xs text-zinc-400">持续收录优质开发者资源，敬请期待</p>
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
