<template>
  <header class="bg-white relative">
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
          <img src="/logo.jpg" alt="Forxi Logo" class="h-12" />
        </router-link>

        <UserMenu />
      </div>

      <!-- PC端 -->
      <div v-else class="flex justify-between h-14 items-center">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img src="/logo.jpg" alt="Forxi Logo" class="h-12" />
          </router-link>
        </div>

        <!-- PC端菜单 -->
        <nav class="flex-1 flex justify-center items-center gap-4">
          <!-- 首页 -->
          <router-link
            to="/"
            class="inline-flex items-center px-5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
            :class="$route.path === '/' ? 'bg-zinc-100 text-zinc-800' : 'text-gray-500 hover:bg-zinc-50 hover:text-gray-700'"
          >
            首页
          </router-link>

          <!-- 应用下拉 - 二级菜单 -->
          <div class="relative" @mouseleave="closeAllToolbox">
            <router-link
              to="/hub/"
              class="inline-flex items-center px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
              :class="isToolboxActive ? 'bg-zinc-100 text-zinc-800' : 'text-gray-500 hover:bg-zinc-50 hover:text-gray-700'"
              @mouseenter="toolboxOpen = true"
            >
              应用
            </router-link>

            <div v-show="toolboxOpen" class="absolute top-full left-1/2 -translate-x-1/2 w-48 h-2" @mouseenter="toolboxOpen = true"></div>

            <Transition name="dropdown">
              <div
                v-if="toolboxOpen"
                class="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-52 bg-white rounded-xl shadow-lg shadow-zinc-200/50 border border-zinc-100 py-2 z-50"
                style="overflow: visible"
              >
                <template v-for="item in toolboxFirstLevel" :key="item.name">
                  <div
                    v-if="item.children"
                    class="group relative"
                    @mouseenter="activeSubmenu = item.name"
                    @mouseleave="activeSubmenu = null"
                  >
                    <div class="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 cursor-pointer">
                      <span class="flex items-center gap-3">
                        <span class="flex-shrink-0 w-6 h-6 rounded-md bg-zinc-50 flex items-center justify-center" v-html="item.icon"></span>
                        {{ item.name }}
                      </span>
                      <svg class="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </div>
                    <div
                      v-if="activeSubmenu === item.name"
                      class="absolute left-full top-0 ml-0.5 w-48 bg-white rounded-xl shadow-lg shadow-zinc-200/50 border border-zinc-100 py-2 z-50"
                      style="animation: submenuIn 0.15s ease"
                    >
                      <router-link
                        v-for="child in item.children"
                        :key="child.path"
                        :to="child.path"
                        class="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                      >
                        <span class="flex-shrink-0 w-6 h-6 rounded-md bg-zinc-50 flex items-center justify-center" v-html="child.icon"></span>
                        {{ child.name }}
                      </router-link>
                    </div>
                  </div>
                  <router-link
                    v-else
                    :to="item.path"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150"
                    :class="$route.path === item.path ? 'text-zinc-800 bg-zinc-50' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'"
                  >
                    <span class="flex-shrink-0 w-6 h-6 rounded-md bg-zinc-50 flex items-center justify-center" v-html="item.icon"></span>
                    {{ item.name }}
                  </router-link>
                </template>
              </div>
            </Transition>
          </div>

          <div class="relative" @mouseleave="aiOpen = false">
            <router-link
              to="/ai/"
              class="inline-flex items-center px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
              :class="isAiActive ? 'bg-zinc-100 text-zinc-800' : 'text-gray-500 hover:bg-zinc-50 hover:text-gray-700'"
              @mouseenter="aiOpen = true"
            >
              AI
            </router-link>

            <div v-show="aiOpen" class="absolute top-full left-1/2 -translate-x-1/2 w-48 h-2" @mouseenter="aiOpen = true"></div>

            <Transition name="dropdown">
              <div
                v-if="aiOpen"
                class="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-52 bg-white rounded-xl shadow-lg shadow-zinc-200/50 border border-zinc-100 py-2 z-50 overflow-hidden"
                @mouseenter="aiOpen = true"
              >
                <router-link
                  v-for="item in aiItems"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150"
                  :class="$route.path === item.path ? 'text-zinc-800 bg-zinc-50' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'"
                >
                  <span class="flex-shrink-0 w-6 h-6 rounded-md bg-zinc-50 flex items-center justify-center" v-html="item.icon"></span>
                  {{ item.name }}
                </router-link>
              </div>
            </Transition>
          </div>

          <!-- 创意下拉 -->
          <div class="relative" @mouseleave="contentOpen = false">
            <router-link
              to="/idea/"
              class="inline-flex items-center px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
              :class="isContentActive ? 'bg-zinc-100 text-zinc-800' : 'text-gray-500 hover:bg-zinc-50 hover:text-gray-700'"
              @mouseenter="contentOpen = true"
            >
              创意
            </router-link>

            <div v-show="contentOpen" class="absolute top-full left-1/2 -translate-x-1/2 w-48 h-2" @mouseenter="contentOpen = true"></div>

            <Transition name="dropdown">
              <div
                v-if="contentOpen"
                class="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-52 bg-white rounded-xl shadow-lg shadow-zinc-200/50 border border-zinc-100 py-2 z-50 overflow-hidden"
                @mouseenter="contentOpen = true"
              >
                <router-link
                  v-for="item in contentItems"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150"
                  :class="$route.path === item.path ? 'text-zinc-800 bg-zinc-50' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'"
                >
                  <span class="flex-shrink-0 w-6 h-6 rounded-md bg-zinc-50 flex items-center justify-center" v-html="item.icon"></span>
                  {{ item.name }}
                </router-link>
              </div>
            </Transition>
          </div>

          <!-- 探索下拉 -->
          <div class="relative" @mouseleave="exploreOpen = false">
            <router-link
              to="/explore/"
              class="inline-flex items-center px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
              :class="isExploreActive ? 'bg-zinc-100 text-zinc-800' : 'text-gray-500 hover:bg-zinc-50 hover:text-gray-700'"
              @mouseenter="exploreOpen = true"
            >
              探索
            </router-link>

            <div v-show="exploreOpen" class="absolute top-full left-1/2 -translate-x-1/2 w-48 h-2" @mouseenter="exploreOpen = true"></div>

            <Transition name="dropdown">
              <div
                v-if="exploreOpen"
                class="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-52 bg-white rounded-xl shadow-lg shadow-zinc-200/50 border border-zinc-100 py-2 z-50 overflow-hidden"
                @mouseenter="exploreOpen = true"
              >
                <router-link
                  v-for="item in exploreItems"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150"
                  :class="$route.path === item.path ? 'text-zinc-800 bg-zinc-50' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'"
                >
                  <span class="flex-shrink-0 w-6 h-6 rounded-md bg-zinc-50 flex items-center justify-center" v-html="item.icon"></span>
                  {{ item.name }}
                </router-link>
              </div>
            </Transition>
          </div>
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
        class="fixed top-0 left-0 h-full w-60 bg-white z-50 flex flex-col shadow-xl"
      >
        <!-- 抽屉顶部 -->
        <div class="flex items-center justify-between px-5 h-16 border-b border-zinc-100 flex-shrink-0">
          <div class="flex items-center">
            <img src="/logo.jpg" alt="Forxi Logo" class="h-10" />
          </div>
          <button @click="menuOpen = false" class="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 菜单内容 -->
        <nav class="flex-1 overflow-y-auto py-3">
          <div class="px-3 mb-1">
            <router-link
              to="/"
              @click="menuOpen = false"
              class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="$route.path === '/' ? 'bg-zinc-100 text-zinc-700' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-700'"
            >
              首页
            </router-link>
          </div>

          <!-- 应用分组 -->
          <div class="mt-2">
            <div class="mx-3 h-px bg-zinc-100"></div>
            <div class="px-3 pt-3 pb-1">
              <router-link
                to="/hub/"
                @click="menuOpen = false"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                :class="$route.path === '/hub/' ? 'text-zinc-800' : 'text-zinc-500 hover:text-zinc-800'"
              >
                应用
                <svg class="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </router-link>
            </div>

            <template v-for="item in toolboxFirstLevel" :key="item.name">
              <template v-if="item.children">
                <router-link
                  v-for="child in item.children"
                  :key="child.path"
                  :to="child.path"
                  @click="menuOpen = false"
                  class="flex items-center gap-2.5 pl-6 pr-3 py-2 rounded-lg text-sm transition-colors"
                  :class="$route.path === child.path ? 'bg-zinc-100 text-zinc-700 font-medium' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-600'"
                >
                  <span class="flex-shrink-0 w-4 h-4 flex items-center justify-center opacity-70" v-html="child.icon"></span>
                  {{ child.name }}
                </router-link>
              </template>
              <router-link
                v-else
                :to="item.path"
                @click="menuOpen = false"
                class="flex items-center gap-2.5 pl-6 pr-3 py-2 rounded-lg text-sm transition-colors"
                :class="$route.path === item.path ? 'bg-zinc-100 text-zinc-700 font-medium' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-600'"
              >
                <span class="flex-shrink-0 w-4 h-4 flex items-center justify-center opacity-70" v-html="item.icon"></span>
                {{ item.name }}
              </router-link>
            </template>
          </div>

          <!-- AI分组 -->
          <div class="mt-1">
            <div class="mx-3 h-px bg-zinc-100"></div>
            <div class="px-3 pt-3 pb-1">
              <router-link
                to="/ai/"
                @click="menuOpen = false"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                :class="$route.path === '/ai/' ? 'text-zinc-800' : 'text-zinc-500 hover:text-zinc-800'"
              >
                AI
                <svg class="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </router-link>
            </div>
            <div class="px-3 pb-2">
              <router-link
                v-for="item in aiItems"
                :key="item.path"
                :to="item.path"
                @click="menuOpen = false"
                class="flex items-center gap-2.5 pl-8 pr-3 py-2 rounded-lg text-sm transition-colors"
                :class="$route.path === item.path ? 'bg-zinc-100 text-zinc-700 font-medium' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-600'"
              >
                <span class="flex-shrink-0 w-4 h-4 flex items-center justify-center opacity-70" v-html="item.icon"></span>
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <!-- 创意分组 -->
          <div class="mt-1">
            <div class="mx-3 h-px bg-zinc-100"></div>
            <div class="px-3 pt-3 pb-1">
              <router-link
                to="/idea/"
                @click="menuOpen = false"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                :class="$route.path === '/idea/' ? 'text-zinc-800' : 'text-zinc-500 hover:text-zinc-800'"
              >
                创意
                <svg class="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </router-link>
            </div>
            <div class="px-3 pb-2">
              <router-link
                v-for="item in contentItems"
                :key="item.path"
                :to="item.path"
                @click="menuOpen = false"
                class="flex items-center gap-2.5 pl-8 pr-3 py-2 rounded-lg text-sm transition-colors"
                :class="$route.path === item.path ? 'bg-zinc-100 text-zinc-700 font-medium' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-600'"
              >
                <span class="flex-shrink-0 w-4 h-4 flex items-center justify-center opacity-70" v-html="item.icon"></span>
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <!-- 探索分组 -->
          <div class="mt-1">
            <div class="mx-3 h-px bg-zinc-100"></div>
            <div class="px-3 pt-3 pb-1">
              <router-link
                to="/explore/"
                @click="menuOpen = false"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                :class="isExploreActive ? 'text-zinc-800' : 'text-zinc-500 hover:text-zinc-800'"
              >
                探索
                <svg class="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </router-link>
            </div>
            <div class="px-3 pb-2">
              <router-link
                v-for="item in exploreItems"
                :key="item.path"
                :to="item.path"
                @click="menuOpen = false"
                class="flex items-center gap-2.5 pl-8 pr-3 py-2 rounded-lg text-sm transition-colors"
                :class="$route.path === item.path ? 'bg-zinc-100 text-zinc-700 font-medium' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-600'"
              >
                <span class="flex-shrink-0 w-4 h-4 flex items-center justify-center opacity-70" v-html="item.icon"></span>
                {{ item.name }}
              </router-link>
            </div>
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

const toolboxFirstLevel = [
  {
    name: '文件工具',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>`,
    children: [
      {
        name: '文件预览',
        path: '/hub/file-preview',
        icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
      },
      {
        name: '文件转换',
        path: '/hub/file-converter#image2pdf',
        icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`
      }
    ]
  },
  {
    name: '图片工具',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
    children: [
      {
        name: '图片处理',
        path: '/hub/image-processing',
        icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
      },
      {
        name: '图片OCR',
        path: '/hub/ocr',
        icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2zM9 4h6v6H9V4z"/></svg>`
      }
    ]
  },
  {
    name: 'IT 工具箱',
    path: '/hub/it-tools',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
  },
  {
    name: '流程工厂',
    path: '/hub/flow-factory',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>`
  },
  {
    name: '超级计算器',
    path: '/hub/calculator',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`
  },
  {
    name: 'IP查询',
    path: '/hub/ip-query',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0 3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>`
  },
  {
    name: '临时邮箱',
    path: '/hub/inbox',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`
  }
]

const activeSubmenu = ref(null)
const closeAllToolbox = () => {
  toolboxOpen.value = false
  activeSubmenu.value = null
}

const isToolboxActive = computed(() =>
  route.path.startsWith('/hub')
)

const contentItems = [
  {
    name: '文章',
    path: '/idea/articles/',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>`
  },
  {
    name: '冷知识',
    path: '/idea/coldknowledge',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
  }
]

const isContentActive = computed(() =>
  route.path.startsWith('/idea')
)

const exploreItems = [
  {
    name: 'JetBrains',
    path: '/explore/jetbra',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
  },
  {
    name: '历史上的今天',
    path: '/explore/onthisday',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`
  },
  {
    name: 'MBTI 性格测试',
    path: '/explore/mbti',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`
  }
]

const isExploreActive = computed(() =>
  route.path.startsWith('/explore')
)

const aiItems = [
  {
    name: '聊一聊',
    path: '/ai/chat',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>`
  },
  {
    name: '文生图',
    path: '/ai/text2image',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>`
  },
  {
    name: '图生图',
    path: '/ai/image2image',
    icon: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
  }
]

const isAiActive = computed(() =>
  route.path.startsWith('/ai')
)

const menuOpen = ref(false)
const toolboxOpen = ref(false)
const aiOpen = ref(false)
const contentOpen = ref(false)
const exploreOpen = ref(false)

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

.submenu-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.submenu-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

@keyframes submenuIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
