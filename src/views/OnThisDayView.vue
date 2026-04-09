<template>
  <div class="min-h-screen bg-zinc-100 text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <section class="relative overflow-hidden bg-white border-b border-zinc-100">
        <div class="absolute inset-0" style="background: linear-gradient(135deg, #fafafa 0%, #ffffff 50%, #f5f5f5 100%);"></div>
        <div class="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-20 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-medium rounded-full mb-4 sm:mb-6">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            时光机
          </div>
          <h1 class="text-3xl sm:text-5xl font-bold text-zinc-800 mb-3 sm:mb-5 tracking-tight">历史上的今天</h1>
          <p class="text-zinc-500 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            穿越时光隧道，看看 {{ currentMonth }} 月 {{ currentDay }} 日这天，人类历史上都发生了什么
          </p>
        </div>
      </section>

      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div v-if="loading" class="space-y-6">
          <div v-for="i in 5" :key="i" class="bg-white rounded-xl p-6 animate-pulse">
            <div class="flex gap-4">
              <div class="h-16 w-16 bg-zinc-200 rounded-xl flex-shrink-0"></div>
              <div class="flex-1 space-y-3">
                <div class="h-5 bg-zinc-200 rounded w-20"></div>
                <div class="h-4 bg-zinc-100 rounded w-full"></div>
                <div class="h-4 bg-zinc-100 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="error" class="bg-white rounded-xl p-8 text-center">
          <div class="w-12 h-12 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 class="text-lg font-medium text-zinc-700 mb-2">加载失败</h3>
          <p class="text-sm text-zinc-400 mb-4">{{ error }}</p>
          <button @click="loadData" class="px-4 py-2 bg-zinc-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors">
            重试
          </button>
        </div>

        <div v-else-if="events.length === 0" class="bg-white rounded-xl p-8 text-center">
          <div class="w-12 h-12 rounded-full bg-zinc-100 text-zinc-300 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h3 class="text-lg font-medium text-zinc-700 mb-2">暂无数据</h3>
          <p class="text-sm text-zinc-400">这一天似乎没有记录在案的历史事件</p>
        </div>

        <div v-else class="lg:flex lg:gap-6">
          <div class="flex-1 space-y-6">
            <div
              v-for="(event, index) in events"
              :key="index"
              class="bg-white rounded-xl p-5 sm:p-6"
            >
              <div class="flex items-start gap-4 mb-4">
                <div class="flex-shrink-0 w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                  <span class="text-lg sm:text-xl font-bold text-zinc-600">{{ event.year }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm sm:text-base text-zinc-700 leading-relaxed">{{ event.text }}</p>
                </div>
              </div>

              <div v-if="event.pages && event.pages.length > 0" class="border-t border-zinc-100 pt-4">
                <div class="text-xs text-zinc-400 mb-3 font-medium">相关条目</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="(page, pageIndex) in event.pages"
                    :key="pageIndex"
                    class="flex gap-3 p-3 bg-zinc-50 rounded-lg cursor-pointer hover:bg-zinc-100 transition-colors"
                    :class="{ 'ring-2 ring-zinc-800': selectedPage && selectedPage.title === page.title }"
                    @click="selectPage(page)"
                  >
                    <div class="w-14 h-14 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        v-if="getThumbnailUrl(page)"
                        :src="getThumbnailUrl(page)"
                        :alt="page.title || '图片'"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <template v-else>
                        <div class="text-center">
                          <svg class="w-5 h-5 mx-auto text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span class="text-[10px] text-zinc-300 mt-0.5 block">暂无图片</span>
                        </div>
                      </template>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-zinc-700 line-clamp-2">{{ page.title || '无标题' }}</div>
                      <div v-if="page.extract" class="text-xs text-zinc-400 line-clamp-2 mt-1">{{ page.extract }}</div>
                      <div v-else class="text-xs text-zinc-300 mt-1">暂无介绍</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedPage" class="hidden lg:block w-72 flex-shrink-0">
            <div class="bg-white rounded-xl p-5 shadow-lg border border-zinc-100 sticky top-8">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-zinc-500">详情</h3>
                <button @click="selectedPage = null" class="text-zinc-400 hover:text-zinc-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div v-if="getThumbnailUrl(selectedPage)" class="w-full h-40 rounded-lg overflow-hidden bg-zinc-100 mb-4">
                <img
                  :src="getThumbnailUrl(selectedPage)"
                  :alt="selectedPage.title || '图片'"
                  class="w-full h-full object-contain"
                />
              </div>

              <h4 class="text-base font-semibold text-zinc-800 mb-2">{{ selectedPage.title || '无标题' }}</h4>

              <p class="text-sm text-zinc-600 whitespace-pre-wrap break-words leading-relaxed max-h-64 overflow-y-auto">{{ selectedPage.extract || '暂无介绍' }}</p>
            </div>
          </div>
        </div>
      </div>

      <section class="bg-zinc-50 border-t border-zinc-100">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-zinc-100">
            <div class="flex flex-col lg:flex-row lg:items-center gap-6">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-zinc-800 mb-1">随机穿越</h3>
                  <p class="text-sm text-zinc-500">探索任意一天的历史足迹，发现更多精彩故事</p>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center gap-3 lg:ml-auto">
                <div v-if="!isToday" class="flex items-center justify-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 text-xs rounded-full">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {{ month }} 月 {{ day }} 日
                </div>

                <button
                  v-if="!isToday"
                  @click="goToToday"
                  class="px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  回到今天
                </button>

                <button
                  @click="randomTravel"
                  class="group relative w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white rounded-full overflow-hidden transition-all duration-500 hover:scale-105"
                  style="background: radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 50%, #000000 100%); box-shadow: 0 0 20px rgba(138, 43, 226, 0.3), 0 0 40px rgba(138, 43, 226, 0.1);"
                >
                  <span class="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-spin-slow"></span>
                  <span class="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 opacity-50 blur-md group-hover:opacity-80 transition-opacity duration-500"></span>

                  <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-purple-900/50 to-transparent animate-pulse-slow"></span>
                  <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-pink-900/30 to-transparent animate-pulse"></span>
                  <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-purple-400/50 to-transparent"></span>

                  <span class="relative z-10 flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span class="drop-shadow-lg">穿越历史</span>
                  </span>
                </button>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-zinc-100">
              <p class="text-xs text-zinc-400 leading-relaxed">
                本页面内容来源自维基百科，仅供学习参考使用。如有侵权或内容有误，请联系平台处理，我们会及时删除。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />

    <Transition name="slide-up">
      <div v-if="selectedPage" class="lg:hidden fixed inset-0 z-50 bg-black/50" @click.self="selectedPage = null">
        <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[70vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-zinc-500">详情</h3>
            <button @click="selectedPage = null" class="text-zinc-400 hover:text-zinc-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div v-if="getThumbnailUrl(selectedPage)" class="w-full h-48 rounded-lg overflow-hidden bg-zinc-100 mb-4">
            <img
              :src="getThumbnailUrl(selectedPage)"
              :alt="selectedPage.title || '图片'"
              class="w-full h-full object-cover"
            />
          </div>

          <h4 class="text-lg font-semibold text-zinc-800 mb-2">{{ selectedPage.title || '无标题' }}</h4>

          <p class="text-sm text-zinc-600 whitespace-pre-wrap break-words leading-relaxed">{{ selectedPage.extract || '暂无介绍' }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import api from '../utils/api'

const loading = ref(true)
const error = ref('')
const events = ref([])
const selectedPage = ref(null)
const month = ref(new Date().getMonth() + 1)
const day = ref(new Date().getDate())

const currentMonth = computed(() => month.value)
const currentDay = computed(() => day.value)

const isToday = computed(() => {
  const today = new Date()
  return month.value === today.getMonth() + 1 && day.value === today.getDate()
})

function goToToday() {
  const today = new Date()
  month.value = today.getMonth() + 1
  day.value = today.getDate()
  loadData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function randomTravel() {
  month.value = Math.floor(Math.random() * 12) + 1
  const maxDay = new Date(2024, month.value, 0).getDate()
  day.value = Math.floor(Math.random() * maxDay) + 1
  loadData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function getThumbnailUrl(page) {
  if (!page) return null
  if (typeof page.thumbnail === 'object') {
    return page.thumbnail.source || page.thumbnail.url || null
  }
  if (typeof page.thumbnail === 'string') {
    return page.thumbnail
  }
  if (page.url) return page.url
  if (page.source) return page.source
  return null
}

function selectPage(page) {
  if (selectedPage.value && selectedPage.value.title === page.title) {
    selectedPage.value = null
  } else {
    selectedPage.value = page
  }
}

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const res = await api.getOnThisDay({ month: month.value, day: day.value })
    if (res && res.events) {
      events.value = res.events
      month.value = res.month || month.value
      day.value = res.day || day.value
    } else {
      events.value = []
    }
  } catch (e) {
    error.value = e.message || '加载失败，请稍后重试'
    console.error('Failed to load on this day:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from .absolute,
.slide-up-leave-to .absolute {
  transform: translateY(100%);
}

.slide-up-enter-to .absolute,
.slide-up-leave-from .absolute {
  transform: translateY(0);
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
