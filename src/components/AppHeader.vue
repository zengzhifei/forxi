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
              class="inline-flex items-center gap-1 px-3 py-1 border-b-2 text-sm font-medium transition-colors"
              :class="isToolboxActive ? 'border-zinc-500 text-zinc-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
              @mouseenter="toolboxOpen = true"
            >
              百宝箱
              <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="toolboxOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- 鼠标桥接层，防止移入面板时意外关闭 -->
            <div v-show="toolboxOpen" class="absolute top-full left-1/2 -translate-x-1/2 w-48 h-2" @mouseenter="toolboxOpen = true"></div>

            <!-- 下拉面板 -->
            <Transition name="dropdown">
              <div
                v-if="toolboxOpen"
                class="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 py-1.5 z-50 overflow-hidden"
                @mouseenter="toolboxOpen = true"
              >
                <router-link
                  v-for="item in toolboxItems"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                  :class="$route.path === item.path ? 'text-zinc-800 bg-zinc-50' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'"
                >
                  <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center" v-html="item.icon"></span>
                  {{ item.name }}
                </router-link>
              </div>
            </Transition>
          </div>

          <!-- AI 趣玩 -->
          <router-link
            to="/ai"
            class="inline-flex items-center px-3 py-1 border-b-2 text-sm font-medium"
            :class="$route.path === '/ai' ? 'border-zinc-500 text-zinc-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
          >
            AI 趣玩
          </router-link>

          <!-- 内容集下拉 -->
          <div class="relative" @mouseleave="contentOpen = false">
            <button
              class="inline-flex items-center gap-1 px-3 py-1 border-b-2 text-sm font-medium transition-colors"
              :class="isContentActive ? 'border-zinc-500 text-zinc-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
              @mouseenter="contentOpen = true"
            >
              内容集
              <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="contentOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- 鼠标桥接层 -->
            <div v-show="contentOpen" class="absolute top-full left-1/2 -translate-x-1/2 w-48 h-2" @mouseenter="contentOpen = true"></div>

            <!-- 下拉面板 -->
            <Transition name="dropdown">
              <div
                v-if="contentOpen"
                class="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 py-1.5 z-50 overflow-hidden"
                @mouseenter="contentOpen = true"
              >
                <router-link
                  v-for="item in contentItems"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                  :class="$route.path === item.path ? 'text-zinc-800 bg-zinc-50' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'"
                >
                  <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center" v-html="item.icon"></span>
                  {{ item.name }}
                </router-link>
              </div>
            </Transition>
          </div>

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

          <!-- 内容集分组 -->
          <div class="px-3">
            <div class="px-3 py-1.5 text-xs font-semibold text-zinc-400 tracking-wider">内容集</div>
            <router-link
              v-for="item in contentItems"
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
  {
    name: '文件预览',
    path: '/file-preview',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
  },
  {
    name: '图片处理',
    path: '/image-processing',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
  },
  {
    name: 'IT 工具箱',
    path: '/it-tools',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
  },
]

const isToolboxActive = computed(() =>
  toolboxItems.some(item => item.path === route.path)
)

const contentItems = [
  {
    name: '文章',
    path: '/articles',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>`
  }
]

const isContentActive = computed(() =>
  contentItems.some(item => item.path === route.path)
)

const menuOpen = ref(false)
const toolboxOpen = ref(false)
const contentOpen = ref(false)

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

.dropdown-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
}
</style>
