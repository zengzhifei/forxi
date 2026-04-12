<template>
  <div class="min-h-screen bg-zinc-100 text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <section class="bg-zinc-600 text-white">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div class="text-center mb-5">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 class="text-lg sm:text-xl font-bold mb-0.5">每天一个冷知识</h2>
            <p class="text-xs sm:text-sm text-zinc-400">让知识变得有趣，让学习变得轻松</p>
          </div>

          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-2 sm:gap-3">
              <div class="bg-zinc-800 rounded-lg p-2 sm:p-3 text-center">
                <div class="text-lg sm:text-xl font-bold text-cyan-400">{{ meta.total || 0 }}</div>
                <div class="text-[10px] sm:text-xs text-zinc-500">冷知识</div>
              </div>
              <div class="bg-zinc-800 rounded-lg p-2 sm:p-3 text-center">
                <div class="text-lg sm:text-xl font-bold text-cyan-400">∞</div>
                <div class="text-[10px] sm:text-xs text-zinc-500">无边界</div>
              </div>
              <div class="bg-zinc-800 rounded-lg p-2 sm:p-3 text-center">
                <div class="text-lg sm:text-xl font-bold text-cyan-400">24/7</div>
                <div class="text-[10px] sm:text-xs text-zinc-500">更新中</div>
              </div>
            </div>

            <div class="bg-white rounded-xl p-3">
              <div class="relative">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  v-model="searchKeyword"
                  type="text"
                  placeholder="搜索冷知识..."
                  class="w-full h-11 pl-12 pr-4 bg-zinc-100 text-zinc-800 text-sm rounded-lg placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  @keyup.enter="handleSearch"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 5" :key="i" class="bg-white rounded-xl p-5 animate-pulse">
            <div class="flex gap-4">
              <div class="h-12 w-12 bg-zinc-200 rounded-xl flex-shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-zinc-200 rounded w-1/3"></div>
                <div class="h-3 bg-zinc-100 rounded w-full"></div>
                <div class="h-3 bg-zinc-100 rounded w-2/3"></div>
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

        <div v-else-if="coldKnowledgeList.length === 0" class="bg-white rounded-xl p-8 text-center">
          <div class="w-12 h-12 rounded-full bg-zinc-100 text-zinc-300 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <h3 class="text-lg font-medium text-zinc-700 mb-2">暂无数据</h3>
          <p class="text-sm text-zinc-400">没有找到相关的冷知识</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(item, index) in coldKnowledgeList"
            :key="item.id"
            class="bg-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all duration-300"
            @click="viewDetail(item)"
          >
            <div class="flex items-start gap-4">
              <div :class="isToday(item.created_at) ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-cyan-400 to-cyan-600'" class="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white shadow-md">
                <span class="text-[10px] font-medium opacity-80">{{ item.created_at ? item.created_at.slice(5, 7) : '01' }}月</span>
                <span class="text-lg font-bold leading-none">{{ item.created_at ? item.created_at.slice(8, 10) : '01' }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span class="px-2 py-0.5 text-xs font-medium rounded-md bg-cyan-50 text-cyan-600">冷知识</span>
                  <span
                    v-for="(tag, idx) in (item.tags || '').split(',').filter(t => t.trim())"
                    :key="idx"
                    class="px-2 py-0.5 text-xs rounded-md bg-zinc-100 text-zinc-500"
                  >
                    {{ tag.trim() }}
                  </span>
                </div>
                <h3 class="text-base font-semibold text-zinc-800 mb-2">{{ item.title }}</h3>
                <p class="text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-3">{{ item.content }}</p>
                <div class="flex items-center gap-4 text-xs text-zinc-400">
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {{ itemStats[item.id]?.view_count || 0 }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" :class="itemStats[item.id]?.is_liked ? 'text-red-500 fill-current' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {{ itemStats[item.id]?.like_count || 0 }}
                  </span>
                  <span>{{ item.created_at }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!loading && coldKnowledgeList.length > 0" class="flex justify-center mt-8">
          <Pagination :meta="meta" @page-change="handlePageChange" />
        </div>
      </div>
    </main>

    <AppFooter />

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedItem" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="selectedItem = null">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div class="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div class="h-1.5 bg-gradient-to-r from-cyan-400 to-cyan-600"></div>
            <div class="p-5 sm:p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold shadow-md">?</div>
                  <div>
                    <span class="px-2 py-0.5 text-xs font-medium rounded-md bg-cyan-50 text-cyan-600">冷知识</span>
                    <p class="text-xs text-zinc-400 mt-0.5">{{ selectedItem.created_at }}</p>
                  </div>
                </div>
                <button @click="selectedItem = null" class="w-8 h-8 rounded-full bg-zinc-100 text-zinc-400 hover:bg-zinc-200 flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <h2 class="text-xl font-bold text-zinc-800 mb-3">{{ selectedItem.title }}</h2>
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="(tag, idx) in (selectedItem.tags || '').split(',').filter(t => t.trim())"
                  :key="idx"
                  class="px-2.5 py-1 text-xs rounded-full bg-zinc-100 text-zinc-500"
                >
                  #{{ tag.trim() }}
                </span>
              </div>
              <div class="bg-zinc-50 rounded-xl p-4 mb-4">
                <p class="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{{ selectedItem.content }}</p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-zinc-100">
                <div class="flex items-center gap-4">
                  <span class="flex items-center gap-1 text-zinc-500 text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {{ currentViewCount }}
                  </span>
                  <button @click="toggleLike" :disabled="isLiking" class="flex items-center gap-1 text-sm transition-colors" :class="currentIsLiked ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'">
                    <svg class="w-4 h-4" :fill="currentIsLiked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {{ currentLikeCount }}
                  </button>
                </div>
                <button @click="selectedItem = null" class="px-5 py-2 bg-zinc-800 text-white text-sm font-medium rounded-full hover:bg-zinc-700">关闭</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import Pagination from '../components/Pagination.vue'
import api from '../utils/api'

const loading = ref(true)
const error = ref('')
const coldKnowledgeList = ref([])
const itemStats = ref({})
const page = ref(1)
const pageSize = ref(10)
const meta = ref({ page: 1, page_size: 10, total: 0, totalPages: 1 })
const searchKeyword = ref('')

const selectedItem = ref(null)
const currentViewCount = ref(0)
const currentLikeCount = ref(0)
const currentIsLiked = ref(false)
const isLiking = ref(false)

const today = new Date().toISOString().slice(0, 10)

function isToday(dateStr) {
  return dateStr && dateStr.slice(0, 10) === today
}

watch(selectedItem, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const res = await api.getColdKnowledgeList({
      page: page.value,
      pageSize: pageSize.value,
      query: searchKeyword.value
    })

    coldKnowledgeList.value = res.data || []
    meta.value = res.meta || { page: 1, page_size: 10, total: 0, totalPages: 1 }

    await loadStats()
  } catch (e) {
    error.value = e.message || '加载失败，请稍后重试'
    console.error('Failed to load cold knowledge:', e)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  loadData()
}

async function loadStats() {
  try {
    const ids = coldKnowledgeList.value.map(item => Number(item.id))
    if (ids.length === 0) return

    const res = await api.getInteractStats('cold_knowledge', ids)
    const stats = Array.isArray(res) ? res : (res.data || [])

    const statsMap = {}
    stats.forEach(s => {
      statsMap[s.target_id] = s
    })
    itemStats.value = statsMap
  } catch (e) {
    console.error('Failed to load stats:', e.message || e)
  }
}

function viewDetail(item) {
  selectedItem.value = item
  currentViewCount.value = itemStats.value[item.id]?.view_count || 0
  currentLikeCount.value = itemStats.value[item.id]?.like_count || 0
  currentIsLiked.value = itemStats.value[item.id]?.is_liked || false
  recordView(item.id)
}

async function recordView(id) {
  try {
    const res = await api.view('cold_knowledge', Number(id))
    if (res && res.view_count !== undefined) {
      currentViewCount.value = res.view_count
      if (itemStats.value[id]) {
        itemStats.value[id].view_count = res.view_count
      }
    }
  } catch (e) {
    console.error('Failed to record view:', e.message || e)
  }
}

async function toggleLike() {
  if (isLiking.value || !selectedItem.value) return

  isLiking.value = true
  try {
    const res = await api.like('cold_knowledge', Number(selectedItem.value.id))
    if (res) {
      currentIsLiked.value = res.liked
      currentLikeCount.value = res.like_count
      if (itemStats.value[selectedItem.value.id]) {
        itemStats.value[selectedItem.value.id].is_liked = res.liked
        itemStats.value[selectedItem.value.id].like_count = res.like_count
      }
    }
  } catch (e) {
    console.error('Failed to toggle like:', e.message || e)
  } finally {
    isLiking.value = false
  }
}

function handlePageChange(newPage) {
  page.value = newPage
  loadData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
