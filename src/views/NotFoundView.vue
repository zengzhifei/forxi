<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    
    <div class="flex-1 flex items-center justify-center p-4">
      <div class="text-center">
        <div class="mb-8">
          <span class="text-8xl">🔍</span>
        </div>
        
        <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-2">页面未找到</p>
        <p class="text-gray-500 mb-8">
          您访问的页面不存在或已被移除
        </p>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">您可能想要访问：</h2>
          <div class="space-y-3">
            <router-link 
              to="/"
              class="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
            >
              <span class="text-2xl mr-3">🏠</span>
              <div class="text-left">
                <div class="font-medium text-gray-900">首页</div>
                <div class="text-sm text-gray-500">回到主页面</div>
              </div>
            </router-link>
            
            <router-link 
              to="/it-tools"
              class="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
            >
              <span class="text-2xl mr-3">🛠️</span>
              <div class="text-left">
                <div class="font-medium text-gray-900">IT 工具集合</div>
                <div class="text-sm text-gray-500">实用的开发者工具</div>
              </div>
            </router-link>
            
            <router-link 
              to="/file-preview"
              class="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
            >
              <span class="text-2xl mr-3">📁</span>
              <div class="text-left">
                <div class="font-medium text-gray-900">在线文件预览</div>
                <div class="text-sm text-gray-500">在线预览各种文件</div>
              </div>
            </router-link>
          </div>
        </div>
        
        <p class="text-gray-400 text-sm">
          如果您认为这是一个错误，请联系网站管理员
        </p>
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>
