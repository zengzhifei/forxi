<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
    <AppHeader />

    <div class="flex-grow flex">
      <!-- 移动端菜单切换按钮 -->
      <button 
        v-if="isMobile"
        @click="toggleMenu"
        class="fixed bottom-6 right-6 z-50 w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center"
        style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
      >
        <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- PC端左侧菜单 - 固定不滚动 -->
      <aside v-if="!isMobile" class="w-56 bg-white border-r border-gray-200 flex-shrink-0 fixed top-16 bottom-0 left-0 overflow-hidden">
        <div class="h-full flex flex-col">
          <div class="px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">IT 工具集合</h2>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索工具..."
                class="w-full px-3 py-2 pl-9 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <nav class="flex-1 overflow-y-auto p-2">
            <!-- 常用工具 - 收藏的工具 -->
            <div v-if="favoriteTools.length > 0" class="mb-4">
              <h3 class="px-3 py-2 text-xs font-semibold text-amber-500 uppercase tracking-wider flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                常用工具
              </h3>
              <ul class="space-y-1">
                <li v-for="tool in favoriteTools" :key="tool.id">
                  <a 
                    href="javascript:void(0)" 
                    @click="selectTool(tool)"
                    class="flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group"
                    :class="isSelected(tool.id) ? 'bg-zinc-100 text-zinc-700' : 'text-gray-600 hover:bg-gray-50'"
                  >
                    <span
                      class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors"
                      :class="isSelected(tool.id) ? 'bg-zinc-200' : 'bg-gray-100 text-gray-500'"
                    >
                      {{ tool.icon }}
                    </span>
                    <span class="font-medium">{{ tool.name }}</span>
                  </a>
                </li>
              </ul>
            </div>

            <div v-for="category in filteredCategories" :key="category.key" class="mb-4">
              <h3 class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {{ category.name }}
              </h3>
              <ul class="space-y-1">
                <li v-for="tool in category.tools" :key="tool.id">
                  <a
                    href="javascript:void(0)"
                    @click="selectTool(tool)"
                    class="flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group"
                    :class="isSelected(tool.id)
                      ? 'bg-zinc-100 text-zinc-700'
                      : 'text-gray-600 hover:bg-gray-50'"
                  >
                    <span
                      class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors"
                      :class="isSelected(tool.id)
                        ? 'bg-zinc-200'
                        : 'bg-gray-100 text-gray-500'"
                    >
                      {{ tool.icon }}
                    </span>
                    <span class="font-medium">{{ tool.name }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      <!-- 移动端侧边菜单 -->
      <aside 
        v-if="isMobile"
        class="fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-200 flex-shrink-0 transform transition-transform duration-300"
        :class="menuOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="sticky top-0 h-full overflow-y-auto">
          <div class="px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">IT 工具集合</h2>
              <button @click="toggleMenu" class="p-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索工具..."
                class="w-full px-3 py-2 pl-9 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <nav class="p-2">
            <!-- 常用工具 - 收藏的工具 -->
            <div v-if="favoriteTools.length > 0" class="mb-4">
              <h3 class="px-3 py-2 text-xs font-semibold text-amber-500 uppercase tracking-wider flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                常用工具
              </h3>
              <ul class="space-y-1">
                <li v-for="tool in favoriteTools" :key="tool.id">
                  <a 
                    href="javascript:void(0)" 
                    @click="selectTool(tool)"
                    class="flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group"
                    :class="isSelected(tool.id)
                      ? 'bg-zinc-100 text-zinc-700'
                      : 'text-gray-600 hover:bg-gray-50'"
                  >
                    <span
                      class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors flex-shrink-0"
                      :class="isSelected(tool.id)
                        ? 'bg-zinc-200'
                        : 'bg-gray-100 text-gray-500'"
                    >
                      {{ tool.icon }}
                    </span>
                    <span class="font-medium truncate">{{ tool.name }}</span>
                  </a>
                </li>
              </ul>
            </div>

            <div v-for="category in filteredCategories" :key="category.key" class="mb-4">
              <h3 class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {{ category.name }}
              </h3>
              <ul class="space-y-1">
                <li v-for="tool in category.tools" :key="tool.id">
                  <a
                    href="javascript:void(0)"
                    @click="selectTool(tool)"
                    class="flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group"
                    :class="isSelected(tool.id)
                      ? 'bg-zinc-100 text-zinc-700'
                      : 'text-gray-600 hover:bg-gray-50'"
                  >
                    <span
                      class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors flex-shrink-0"
                      :class="isSelected(tool.id)
                        ? 'bg-zinc-200'
                        : 'bg-gray-100 text-gray-500'"
                    >
                      {{ tool.icon }}
                    </span>
                    <span class="font-medium truncate">{{ tool.name }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      <!-- 遮罩层 -->
      <div 
        v-if="isMobile && menuOpen" 
        @click="toggleMenu"
        class="fixed inset-0 bg-black/50 z-30"
      ></div>
      
      <!-- 右侧内容区域 - PC端需要左边距 -->
      <main class="flex-1 p-4 lg:p-8" :class="!isMobile ? 'ml-56' : ''">
        <div class="max-w-4xl mx-auto">
          <div v-if="selectedTool" class="space-y-4 lg:space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <div class="flex items-center justify-between gap-3 lg:gap-4">
                <div class="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
                  <div class="w-10 lg:w-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-xl lg:text-2xl flex-shrink-0">
                    {{ selectedTool.icon }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <h1 class="text-lg lg:text-2xl font-bold text-gray-900 truncate">{{ selectedTool.name }}</h1>
                    <p class="text-gray-500 text-sm lg:text-base mt-0.5 lg:mt-1 truncate">{{ selectedTool.description }}</p>
                  </div>
                </div>
                <button
                  @click="toggleFav(selectedTool.id)"
                  class="flex-shrink-0 p-2 rounded-lg transition-colors"
                  :class="isFavorite(selectedTool.id)
                    ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500'"
                  :title="isFavorite(selectedTool.id) ? '取消收藏' : '收藏'"
                >
                  <svg v-if="isFavorite(selectedTool.id)" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 lg:h-6 lg:w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
              </div>
            </div>
            <component :is="selectedTool.component" />
          </div>
          
          <div v-else class="flex flex-col items-center justify-center h-[60vh] lg:h-96 text-gray-400">
            <div class="w-16 lg:w-24 h-16 lg:h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 lg:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 lg:h-12 w-8 lg:w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-lg lg:text-xl font-medium text-gray-500 mb-2">请选择一个工具</h3>
            <p class="text-gray-400 text-center text-sm lg:text-base px-4">
              <span v-if="isMobile">点击右下角菜单按钮选择工具</span>
              <span v-else>从左侧菜单中选择一个工具开始使用</span>
            </p>
          </div>
        </div>
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, markRaw, onMounted, onUnmounted, watch } from 'vue'
import { categories, tools } from '../modules/it-tools/index.js'
import { useBreakpoint } from '../composable/useBreakpoint'
import { useFavorites } from '../composable/useFavorites'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const { isMobile } = useBreakpoint()
const { favorites, isFavorite, toggleFavorite: toggleFav } = useFavorites()

const selectedTool = ref(null)
let isInitializing = true

const updateHash = () => {
  const hash = location.hash.slice(1)
  if (hash && tools[hash]) {
    const tool = tools[hash]
    selectedTool.value = markRaw({ id: hash, ...tool })
  }
}

onMounted(() => {
  updateHash()
  isInitializing = false
  window.addEventListener('hashchange', updateHash)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updateHash)
})

watch(selectedTool, (val) => {
  if (isInitializing) return
  if (val && val.id) {
    location.hash = val.id
  } else if (val) {
    selectedTool.value = null
  } else {
    history.replaceState(null, '', location.pathname)
  }
})
const menuOpen = ref(false)
const searchQuery = ref('')

const favoriteTools = computed(() => {
  const arr = favorites.value
  return arr.map(id => {
    const tool = tools[id]
    if (tool) {
      return { ...tool, id }
    }
    return null
  }).filter(Boolean)
})

const filteredCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return categories
  }
  
  const result = []
  for (const category of categories) {
    const matchedTools = category.tools.filter(tool => 
      tool.name.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query)
    )
    if (matchedTools.length > 0) {
      result.push({
        ...category,
        tools: matchedTools
      })
    }
  }
  return result
})

function selectTool(tool) {
  if (tool && tool.id) {
    selectedTool.value = markRaw(tool)
  }
  menuOpen.value = false
}

function isSelected(toolId) {
  return selectedTool.value && selectedTool.value.id === toolId
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
</script>
