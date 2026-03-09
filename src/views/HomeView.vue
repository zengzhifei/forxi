<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
    <AppHeader />

    <section class="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6">Forxi 工具集合</h1>
        <p class="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-6 sm:mb-8">为您提供一系列实用的在线工具，简化工作流程，提高效率</p>
        <a href="javascript:void(0)" @click="scrollToTools" class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">立即体验</a>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-4">我们的优势</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">为您提供高质量的在线工具，满足各种需求</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">简单易用</h3>
            <p class="text-gray-600">界面简洁直观，操作方便快捷，无需复杂的学习过程</p>
          </div>
          <div class="text-center">
            <div class="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">功能强大</h3>
            <p class="text-gray-600">提供多种实用工具，满足您的各种需求</p>
          </div>
          <div class="text-center">
            <div class="mx-auto h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">安全可靠</h3>
            <p class="text-gray-600">所有操作均在本地完成，保护您的隐私和数据安全</p>
          </div>
        </div>
      </div>
    </section>

    <section id="tools" class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">工具中心</h2>
          <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">选择适合您的工具，开始使用</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <!-- 在线文件预览 -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden transition-transform hover:transform hover:scale-105 cursor-pointer" @click="navigateToFilePreview">
            <div class="h-40 sm:h-48 bg-blue-100 flex items-center justify-center">
              <svg class="h-12 sm:h-16 w-12 sm:w-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div class="p-4 sm:p-6">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">在线文件预览</h3>
              <p class="text-sm sm:text-base text-gray-600 mb-4">支持预览 docx、excel、ppt、jpg 等多种文件格式，无需安装额外软件</p>
              <span class="inline-flex items-center text-sm font-medium text-blue-600">立即使用 →</span>
            </div>
          </div>
          
          <!-- IT 工具集合 -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden transition-transform hover:transform hover:scale-105 cursor-pointer" @click="navigateToItTools">
            <div class="h-40 sm:h-48 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <svg class="h-12 sm:h-16 w-12 sm:w-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <div class="p-4 sm:p-6">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">IT 工具集合</h3>
              <p class="text-sm sm:text-base text-gray-600 mb-4">Base64、JSON、URL 编码、颜色转换、UUID 生成等多种实用工具</p>
              <span class="inline-flex items-center text-sm font-medium text-purple-600">立即使用 →</span>
            </div>
          </div>
          
          <!-- 更多工具开发中 -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
              <svg class="h-12 sm:h-16 w-12 sm:w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <div class="p-4 sm:p-6">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">更多工具开发中</h3>
              <p class="text-sm sm:text-base text-gray-600 mb-4">新工具正在开发中，敬请期待</p>
              <span class="inline-flex items-center text-sm font-medium text-gray-400">即将上线 →</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()

onMounted(() => {
  window.scrollTo(0, 0)
})

const navigateToFilePreview = () => {
  router.push('/file-preview').then(() => {
    window.scrollTo(0, 0)
  })
}

const navigateToItTools = () => {
  router.push('/it-tools').then(() => {
    window.scrollTo(0, 0)
  })
}

const scrollToTools = () => {
  const element = document.getElementById('tools')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
