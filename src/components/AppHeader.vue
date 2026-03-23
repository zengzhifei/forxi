<template>
  <header class="bg-white shadow-sm relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 移动端：左侧菜单 + 中间Logo + 右侧用户菜单 -->
      <div v-if="isMobile" class="flex justify-between h-16 items-center">
        <button
          @click="toggleMenu"
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
        >
          <svg v-if="!menuOpen" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <router-link to="/" class="flex items-center">
          <img src="/logo.svg" alt="Forxi Logo" class="h-8 w-8" />
          <h1 class="ml-2 text-lg font-semibold text-gray-900">Forxi</h1>
        </router-link>

        <UserMenu />
      </div>

      <!-- PC端 -->
      <div v-else class="flex justify-between h-16 items-center">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img src="/logo.svg" alt="Forxi Logo" class="h-8 w-8" />
            <h1 class="ml-2 text-xl font-semibold text-gray-900">Forxi</h1>
          </router-link>
        </div>

        <!-- PC端菜单 -->
        <nav class="flex-1 flex justify-center space-x-1 items-center">
          <!-- 首页 -->
          <router-link
            to="/"
            class="inline-flex items-center px-3 py-1 border-b-2 text-sm font-medium"
            :class="$route.path === '/' ? 'border-zinc-500 text-zinc-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
          >
            首页
          </router-link>

          <!-- 百宝箱下拉 -->
          <div class="relative" @mouseleave="toolboxOpen = false">
            <button
              class="inline-flex items-center px-3 py-1 border-b-2 text-sm font-medium transition-colors"
              :class="isToolboxActive ? 'border-zinc-500 text-zinc-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
              @mouseenter="toolboxOpen = true"
            >
              百宝箱
            </button>

            <!-- 下拉面板 -->
            <div
              v-show="toolboxOpen"
              class="absolute top-full left-1/2 -translate-x-1/2 w-36 bg-white rounded-xl shadow-lg border border-zinc-100 py-1.5 z-50"
              @mouseenter="toolboxOpen = true"
            >
              <router-link
                v-for="item in toolboxItems"
                :key="item.path"
                :to="item.path"
                class="flex items-center px-4 py-2.5 text-sm transition-colors"
                :class="$route.path === item.path ? 'text-zinc-700 bg-zinc-50' : 'text-gray-500 hover:text-zinc-700 hover:bg-zinc-50'"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <!-- AI 趣玩 -->
          <router-link
            to="/ai"
            class="inline-flex items-center px-3 py-1 border-b-2 text-sm font-medium"
            :class="$route.path === '/ai' ? 'border-zinc-500 text-zinc-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
          >
            AI 趣玩
          </router-link>

          <!-- JetBrains -->
          <router-link
            to="/jetbra"
            class="inline-flex items-center px-3 py-1 border-b-2 text-sm font-medium"
            :class="$route.path === '/jetbra' ? 'border-zinc-500 text-zinc-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
          >
            JetBrains
          </router-link>
        </nav>

        <!-- 用户菜单 -->
        <div class="flex items-center">
          <UserMenu />
        </div>
      </div>
    </div>

    <!-- 移动端抽屉遮罩 -->
    <transition name="fade">
      <div
        v-if="isMobile && menuOpen"
        class="fixed inset-0 bg-black/30 z-40"
        @click="menuOpen = false"
      ></div>
    </transition>

    <!-- 移动端抽屉菜单 -->
    <transition name="slide">
      <div
        v-if="isMobile && menuOpen"
        class="fixed top-0 left-0 h-full w-64 bg-white z-50 flex flex-col shadow-xl"
      >
        <!-- 抽屉顶部 -->
        <div class="flex items-center justify-between px-5 h-16 border-b border-zinc-100 flex-shrink-0">
          <div class="flex items-center">
            <img src="/logo.svg" alt="Forxi Logo" class="h-7 w-7" />
            <span class="ml-2 text-base font-semibold text-zinc-700">Forxi</span>
          </div>
          <button @click="menuOpen = false" class="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 菜单内容 -->
        <nav class="flex-1 overflow-y-auto py-3 space-y-1">
          <div class="px-3">
            <router-link
              to="/"
              @click="menuOpen = false"
              class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="$route.path === '/' ? 'bg-zinc-100 text-zinc-700' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-700'"
            >
              首页
            </router-link>
          </div>

          <div class="mx-3 h-px bg-zinc-100"></div>

          <!-- 百宝箱分组 -->
          <div class="px-3">
            <div class="px-3 py-1.5 text-xs font-semibold text-zinc-400 tracking-wider">百宝箱</div>
            <router-link
              v-for="item in toolboxItems"
              :key="item.path"
              :to="item.path"
              @click="menuOpen = false"
              class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="$route.path === item.path ? 'bg-zinc-100 text-zinc-700' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-700'"
            >
              {{ item.name }}
            </router-link>
          </div>

          <div class="mx-3 h-px bg-zinc-100"></div>

          <div class="px-3">
            <router-link
              to="/ai"
              @click="menuOpen = false"
              class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="$route.path === '/ai' ? 'bg-zinc-100 text-zinc-700' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-700'"
            >
              AI 趣玩
            </router-link>
          </div>

          <div class="mx-3 h-px bg-zinc-100"></div>

          <div class="px-3">
            <router-link
              to="/jetbra"
              @click="menuOpen = false"
              class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="$route.path === '/jetbra' ? 'bg-zinc-100 text-zinc-700' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-700'"
            >
              JetBrains
            </router-link>
          </div>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBreakpoint } from '../composable/useBreakpoint'
import UserMenu from './UserMenu.vue'

const { isMobile } = useBreakpoint()
const route = useRoute()

const toolboxItems = [
  { name: '文件预览', path: '/file-preview' },
  { name: '图片处理', path: '/image-processing' },
  { name: 'IT 工具箱', path: '/it-tools' },
]

const isToolboxActive = computed(() =>
  toolboxItems.some(item => item.path === route.path)
)

const menuOpen = ref(false)
const toolboxOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
