<template>
  <div class="min-h-screen bg-gray-100 text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-white border-b border-zinc-100">
        <div class="absolute inset-0" style="background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 40%, #ede9fe 100%);"></div>
        <div class="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-24 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 text-violet-600 text-xs font-medium rounded-full mb-4 sm:mb-6">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            免费使用，无需注册
          </div>
          <h1 class="text-3xl sm:text-5xl font-bold text-zinc-800 mb-3 sm:mb-5 tracking-tight">AI 趣玩</h1>
          <p class="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">释放创意，与 AI 一起探索无限可能。从智能对话到图片生成，让你的想法瞬间变为现实。</p>
        </div>
      </section>

      <!-- Feature Sections -->
      <section class="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-20">

        <!-- 聊一聊 -->
        <div class="flex flex-col md:flex-row items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-blue-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">聊一聊</span>
              <router-link to="/ai/chat" class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                开始对话
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-blue-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h3 class="text-lg font-semibold text-zinc-700 mb-2">聊一聊</h3>
              <router-link to="/ai/chat" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                开始对话
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">与 AI 智能对话</h3>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">与 AI 进行自然语言对话，获取各类问题的解答和创意灵感。无论是知识问答、文案创作、代码编写还是头脑风暴，AI 都能为你提供高质量的回复。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">使用说明</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>在对话框中输入你的问题或需求描述</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>AI 将实时生成回复，支持 Markdown 格式的富文本内容</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>可以持续追问，AI 会根据上下文给出连贯的回复</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">知识问答</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">文案创作</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">代码辅助</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">Markdown 渲染</span>
            </div>
          </div>
        </div>

        <div class="h-px bg-zinc-200"></div>

        <!-- 文生图 -->
        <div class="flex flex-col md:flex-row-reverse items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-violet-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-violet-100 text-violet-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">文生图</span>
              <router-link to="/ai/text2image" class="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                开始创作
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-violet-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-violet-100 text-violet-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </div>
              <h3 class="text-lg font-semibold text-zinc-700 mb-2">文生图</h3>
              <router-link to="/ai/text2image" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-violet-500 text-white text-sm font-medium rounded-lg hover:bg-violet-600 transition-colors">
                开始创作
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">用文字描绘画面</h3>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">输入一段文字描述，AI 将根据你的描述生成精美的图片。支持各种风格，从写实摄影到动漫插画，从水彩画到油画，满足你的多样化创作需求。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">使用说明</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>在输入框中描述你想要的图片内容，越详细效果越好</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>可以选择图片尺寸和风格偏好</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>点击生成后等待片刻，即可获得 AI 创作的图片并下载保存</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">写实摄影</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">动漫插画</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">多种尺寸</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">高清下载</span>
            </div>
          </div>
        </div>

        <div class="h-px bg-zinc-200"></div>

        <!-- 图生图 -->
        <div class="flex flex-col md:flex-row items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-emerald-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">图生图</span>
              <router-link to="/ai/image2image" class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                开始改造
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-emerald-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 class="text-lg font-semibold text-zinc-700 mb-2">图生图</h3>
              <router-link to="/ai/image2image" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors">
                开始改造
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">以图改图，创造新视觉</h3>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">上传一张图片并描述你希望的变化，AI 会在保留原图结构的基础上进行创意改造。可用于风格转换、场景重绘、元素替换等多种图片编辑场景。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">使用说明</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>上传你想要改造的原始图片</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>输入文字描述，告诉 AI 你想要的改变方向</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>生成后可对比原图与新图，满意即可下载</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">风格转换</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">场景重绘</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">元素替换</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">原图参考</span>
            </div>
          </div>
        </div>

      </section>

      <!-- Bottom CTA -->
      <section class="bg-white border-t border-zinc-100">
        <div class="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div class="grid grid-cols-3 gap-4 sm:gap-8">
            <div class="text-center">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 class="text-xs sm:text-sm font-medium text-zinc-700 mb-1">即开即用</h3>
              <p class="text-xs text-zinc-400 leading-relaxed hidden sm:block">无需安装或配置，打开浏览器就能使用</p>
            </div>
            <div class="text-center">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              </div>
              <h3 class="text-xs sm:text-sm font-medium text-zinc-700 mb-1">完全免费</h3>
              <p class="text-xs text-zinc-400 leading-relaxed hidden sm:block">所有 AI 功能免费使用</p>
            </div>
            <div class="text-center">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 class="text-xs sm:text-sm font-medium text-zinc-700 mb-1">多端兼容</h3>
              <p class="text-xs text-zinc-400 leading-relaxed hidden sm:block">手机、平板、电脑均可流畅使用</p>
            </div>
          </div>
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
