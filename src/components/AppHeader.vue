<template>
  <header class="bg-white shadow-sm relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo 和标题 -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img src="/logo.svg" alt="Forxi Logo" class="h-8 w-8" />
            <h1 class="ml-2 text-xl font-semibold text-gray-900">Forxi</h1>
          </router-link>
        </div>

        <!-- PC端菜单 -->
        <nav v-if="!isMobile" class="flex space-x-8 items-center absolute left-1/2 transform -translate-x-1/2">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path" 
            :to="item.path" 
            class="inline-flex items-center px-1 py-1 border-b-2 text-sm font-medium"
            :class="$route.path === item.path ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
          >
            {{ item.name }}
          </router-link>
          <span class="inline-flex items-center px-1 py-1 border-b-2 border-transparent text-sm font-medium text-gray-400">敬请期待</span>
        </nav>

        <!-- 移动端菜单按钮 -->
        <div v-if="isMobile" class="flex items-center">
          <button 
            @click="toggleMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <svg v-if="!menuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <div 
      v-if="isMobile && menuOpen" 
      class="absolute w-full bg-white border-t border-gray-200 shadow-lg z-50"
    >
      <div class="px-4 pt-2 pb-4 space-y-1">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path" 
          :to="item.path" 
          @click="menuOpen = false"
          class="block px-3 py-3 rounded-md text-base font-medium"
          :class="$route.path === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
        >
          {{ item.name }}
        </router-link>
        <div class="px-3 py-3 text-base font-medium text-gray-400">敬请期待</div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useBreakpoint } from '../composable/useBreakpoint'

const { isMobile } = useBreakpoint()

const menuItems = [
  { name: '首页', path: '/' },
  { name: '在线文件预览', path: '/file-preview' },
  { name: 'IT 工具集合', path: '/it-tools' }
]

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
</script>
