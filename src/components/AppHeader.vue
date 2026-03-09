<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center">
              <img src="/logo.svg" alt="Forxi Logo" class="h-8 w-8" />
              <h1 class="ml-2 text-xl font-semibold text-gray-900">Forxi</h1>
            </router-link>
          </div>
          <nav class="ml-10 flex space-x-4 sm:space-x-8 overflow-x-auto whitespace-nowrap py-2">
            <router-link 
              v-for="item in menuItems" 
              :key="item.path" 
              :to="item.path" 
              class="inline-flex items-center px-2 py-1 border-b-2 text-sm font-medium"
              :class="$route.path === item.path ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
            >
              {{ item.name }}
            </router-link>
            <div class="inline-flex items-center px-2 py-1 border-b-2 border-transparent text-sm font-medium text-gray-400 cursor-default">敬请期待</div>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const menuItems = [
  { name: '首页', path: '/' },
  { name: '在线文件预览', path: '/file-preview' }
]
</script>
