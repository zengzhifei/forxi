<template>
  <div class="min-h-screen bg-gray-100">
    <AppHeader />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex gap-6">
        <aside class="hidden lg:block w-64 flex-shrink-0">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
            <h3 class="text-sm font-semibold text-gray-500 mb-3">文章分类</h3>
            <nav class="space-y-1">
              <button
                @click="selectCategory('')"
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                :class="selectedCategory === '' ? 'bg-zinc-100 text-zinc-700 font-medium' : 'text-gray-600 hover:bg-gray-50'"
              >
                全部
              </button>
              <button
                v-for="cat in categories"
                :key="cat.code"
                @click="selectCategory(cat.code)"
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between"
                :class="selectedCategory === cat.code ? 'bg-zinc-100 text-zinc-700 font-medium' : 'text-gray-600 hover:bg-gray-50'"
              >
                <span>{{ cat.name }}</span>
                <span v-if="cat.count !== undefined" class="text-xs text-gray-400">{{ cat.count }}</span>
              </button>
            </nav>
          </div>
        </aside>

        <main class="flex-1 min-w-0">
          <div v-if="!isDetailView" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div class="hidden lg:flex items-center gap-4 mb-4">
              <h2 class="text-lg font-semibold text-gray-800">{{ currentCategoryName }}</h2>
              <div class="flex-1"></div>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索文章..."
                  class="w-64 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent"
                  @keyup.enter="handleSearch"
                />
                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <button
              @click="showMobileCategory = true"
              class="lg:hidden flex items-center gap-2 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-4"
            >
              <span class="text-gray-500">{{ currentCategoryName }}</span>
              <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div class="lg:hidden relative mb-4">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索文章..."
                class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent"
                @keyup.enter="handleSearch"
              />
              <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div v-if="articles.length === 0 && !loading" class="text-center text-gray-400 py-8">
              暂无文章
            </div>

            <div class="space-y-3">
              <div
                v-for="article in articles"
                :key="article.id"
                @click="viewArticle(article)"
                class="p-4 rounded-lg border border-gray-100 hover:border-zinc-300 hover:bg-zinc-50 transition-all cursor-pointer"
              >
                <h3 class="font-medium text-gray-800 mb-1">{{ article.title }}</h3>
                <p v-if="article.summary" class="text-sm text-gray-500 mb-2 line-clamp-2">{{ article.summary }}</p>
                <div class="mt-auto text-xs text-gray-400 flex items-center gap-2">
                  <span v-if="article.category">{{ getCategoryName(article.category) }}</span>
                  <span v-if="article.category">·</span>
                  {{ article.author_name }} · {{ formatDate(article.updated_at) }}
                  <span class="ml-auto flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {{ articleStats[article.id]?.view_count || 0 }}
                    <span class="ml-2 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {{ articleStats[article.id]?.like_count || 0 }}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex justify-center mt-6">
              <Pagination
                :meta="meta"
                @page-change="handlePageChange"
              />
            </div>
          </div>

          <div v-else-if="selectedArticle" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <button
              @click="goBack"
              class="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              返回列表
            </button>

            <article>
              <h1 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{{ selectedArticle.title }}</h1>
              <div class="text-sm text-gray-400 mb-4 flex items-center gap-2">
                <span v-if="selectedArticle.category">{{ getCategoryName(selectedArticle.category) }}</span>
                <span v-if="selectedArticle.category">·</span>
                {{ selectedArticle.author_name }} · {{ formatDate(selectedArticle.updated_at) }}
              </div>
              <div class="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div class="flex items-center gap-1.5 text-sm text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{{ viewCount }}</span>
                </div>
                <button
                  @click="toggleLike"
                  :disabled="isLiking"
                  class="flex items-center gap-1.5 text-sm transition-colors"
                  :class="isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'"
                >
                  <svg class="w-4 h-4" :fill="isLiked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{{ likeCount }}</span>
                </button>
              </div>
              <div class="prose prose-zinc max-w-none article-content" v-html="renderedContent"></div>
            </article>
          </div>

          <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div class="text-center text-gray-400 py-8">加载中...</div>
          </div>
        </main>
      </div>
    </div>

    <div v-if="showMobileCategory" class="fixed inset-0 z-50 lg:hidden" @click.self="showMobileCategory = false">
      <div class="absolute inset-0 bg-black/50" @click="showMobileCategory = false"></div>
      <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">选择分类</h3>
          <button @click="showMobileCategory = false" class="p-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav class="space-y-1">
          <button
            @click="selectCategory(''); showMobileCategory = false"
            class="w-full text-left px-3 py-3 rounded-lg text-sm transition-colors"
            :class="selectedCategory === '' ? 'bg-zinc-100 text-zinc-700 font-medium' : 'text-gray-600 hover:bg-gray-50'"
          >
            全部
          </button>
          <button
            v-for="cat in categories"
            :key="cat.code"
            @click="selectCategory(cat.code); showMobileCategory = false"
            class="w-full text-left px-3 py-3 rounded-lg text-sm transition-colors flex items-center justify-between"
            :class="selectedCategory === cat.code ? 'bg-zinc-100 text-zinc-700 font-medium' : 'text-gray-600 hover:bg-gray-50'"
          >
            <span>{{ cat.name }}</span>
            <span v-if="cat.count !== undefined" class="text-xs text-gray-400">{{ cat.count }}</span>
          </button>
        </nav>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import Pagination from '../components/Pagination.vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/common'
import api from '../utils/api'

const route = useRoute()
const router = useRouter()

let mermaid = null

const initMermaid = async () => {
  if (!mermaid) {
    const Mermaid = (await import('mermaid')).default
    Mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose'
    })
    mermaid = Mermaid
  }
  return mermaid
}

const copyCode = async (btn) => {
  const wrapper = btn.closest('.code-block-wrapper')
  const code = wrapper ? wrapper.querySelector('code') : null
  if (code) {
    try {
      await navigator.clipboard.writeText(code.textContent)
      btn.textContent = '已复制'
      setTimeout(() => {
        btn.textContent = '复制'
      }, 2000)
    } catch {
      btn.textContent = '复制失败'
    }
  }
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang === 'mermaid') {
      return `<pre class="mermaid">${md.utils.escapeHtml(str)}</pre>`
    }
    const langClass = lang ? `language-${lang}` : ''
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value
        return `<pre class="hljs"><code class="${langClass}">${highlighted}</code></pre>`
      } catch (__) {}
    }
    const escaped = md.utils.escapeHtml(str)
    return `<pre class="hljs"><code class="${langClass}">${escaped}</code></pre>`
  }
})

const categories = ref([])
const selectedCategory = ref('')
const selectedArticle = ref(null)
const articles = ref([])
const articleStats = ref({})
const page = ref(1)
const pageSize = ref(20)
const meta = ref({ page: 1, page_size: 20, total: 0, total_pages: 1 })
const loading = ref(false)
const searchQuery = ref('')
const showMobileCategory = ref(false)

const renderedMermaidIds = ref(new Set())

const likeCount = ref(0)
const viewCount = ref(0)
const isLiked = ref(false)
const isLiking = ref(false)

const isDetailView = computed(() => {
  return route.params.category && route.params.id
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const addCopyButtons = () => {
  const articleContent = document.querySelector('.article-content')
  if (!articleContent) return

  articleContent.querySelectorAll('pre.hljs').forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return

    const code = pre.querySelector('code')
    if (!code) return

    const wrapper = document.createElement('div')
    wrapper.className = 'code-block-wrapper'
    wrapper.style.position = 'relative'
    wrapper.style.margin = '1rem 0'

    pre.parentNode.insertBefore(wrapper, pre)
    wrapper.appendChild(pre)

    const btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.textContent = '复制'
    btn.onclick = () => copyCode(btn)
    wrapper.appendChild(btn)
  })
}

const currentCategoryName = computed(() => {
  if (selectedCategory.value === '') return '全部'
  const cat = categories.value.find(c => c.code === selectedCategory.value)
  return cat ? cat.name : ''
})

const getCategoryName = (code) => {
  if (!code) return ''
  const cat = categories.value.find(c => c.code === code)
  return cat ? cat.name : ''
}

async function loadCategories() {
  try {
    const res = await api.getArticleCategories()
    categories.value = Array.isArray(res) ? res : (res.data || [])
  } catch (e) {
    console.error('Failed to load categories:', e.message || e)
    categories.value = []
  }
}

async function loadArticles() {
  if (loading.value) return

  loading.value = true

  try {
    const res = await api.getArticleList({
      page: page.value,
      pageSize: pageSize.value,
      category: selectedCategory.value,
      query: searchQuery.value
    })

    const newArticles = res.data || []
    const resMeta = res.meta || {}

    articles.value = newArticles
    pageSize.value = resMeta.page_size || pageSize.value
    meta.value = { ...resMeta }

    await loadArticlesStats()
  } catch (e) {
    console.error('Failed to load articles:', e.message || e)
  } finally {
    loading.value = false
  }
}

async function loadArticlesStats() {
  try {
    const ids = articles.value.map(a => Number(a.id))
    if (ids.length === 0) return

    const res = await api.getInteractStats('article', ids)
    const stats = Array.isArray(res) ? res : (res.data || [])

    const statsMap = {}
    stats.forEach(s => {
      statsMap[s.target_id] = s
    })
    articleStats.value = statsMap
  } catch (e) {
    console.error('Failed to load articles stats:', e.message || e)
  }
}

async function loadArticleDetail(id) {
  try {
    const res = await api.getArticleList({
      page: 1,
      pageSize: 1,
      id: id
    })

    const articles = Array.isArray(res) ? res : (res.data || [])
    const article = articles.find(a => String(a.id) === String(id))

    if (article) {
      selectedArticle.value = article
      selectedCategory.value = article.category || ''
      renderedMermaidIds.value.clear()
      nextTick(() => {
        addCopyButtons()
        renderMermaidCharts()
      })
      await loadArticleStats(id)
      await recordArticleView(id)
    }
  } catch (e) {
    console.error('Failed to load article:', e.message || e)
  }
}

async function loadArticleStats(id) {
  try {
    const res = await api.getInteractStats('article', Number(id))
    const stats = Array.isArray(res) ? res : (res.data || [])
    const stat = stats.find(s => s.target_id === Number(id))
    if (stat) {
      likeCount.value = stat.like_count || 0
      viewCount.value = stat.view_count || 0
      isLiked.value = stat.is_liked || false
    }
  } catch (e) {
    console.error('Failed to load stats:', e.message || e)
  }
}

async function recordArticleView(id) {
  try {
    const res = await api.view('article', Number(id))
    if (res && res.view_count !== undefined) {
      viewCount.value = res.view_count
    }
  } catch (e) {
    console.error('Failed to record view:', e.message || e)
  }
}

async function toggleLike() {
  if (isLiking.value || !selectedArticle.value) return

  isLiking.value = true
  try {
    const res = await api.like('article', Number(selectedArticle.value.id))
    if (res) {
      isLiked.value = res.liked
      likeCount.value = res.like_count
    }
  } catch (e) {
    console.error('Failed to toggle like:', e.message || e)
  } finally {
    isLiking.value = false
  }
}

function selectCategory(category) {
  selectedArticle.value = null
  searchQuery.value = ''
  if (category === '') {
    router.push('/idea/articles/')
  } else {
    router.push(`/idea/articles/${category}/`)
  }
}

function handlePageChange(newPage) {
  page.value = newPage
  loadArticles()
}

function handleSearch() {
  page.value = 1
  loadArticles()
}

function viewArticle(article) {
  const category = article.category || selectedCategory.value || 'all'
  router.push(`/idea/articles/${category}/${article.id}`)
}

function goBack() {
  router.back()
}

const renderedContent = computed(() => {
  if (!selectedArticle.value) return ''
  return md.render(selectedArticle.value.content || '')
})

const renderMermaidCharts = async () => {
  const articleContent = document.querySelector('.article-content')
  if (!articleContent) return

  const mermaidElements = articleContent.querySelectorAll('.mermaid')
  if (mermaidElements.length === 0) return

  const mermaidLib = await initMermaid()

  const currentIds = new Set()

  for (let i = 0; i < mermaidElements.length; i++) {
    const element = mermaidElements[i]
    const graphDefinition = element.textContent.trim()
    if (!graphDefinition) continue

    const elementId = `mermaid-${i}-${graphDefinition.slice(0, 50).replace(/\s/g, '')}`
    currentIds.add(elementId)

    if (renderedMermaidIds.value.has(elementId)) continue

    try {
      const renderId = `mermaid-render-${Date.now()}-${i}`
      const { svg } = await mermaidLib.render(renderId, graphDefinition)
      element.innerHTML = svg
      renderedMermaidIds.value.add(elementId)
    } catch (err) {
      console.error('Mermaid render error:', err)
    }
  }

  renderedMermaidIds.value = new Set([...renderedMermaidIds.value].filter(id => currentIds.has(id)))
}

watch(renderedContent, () => {
  nextTick(() => {
    addCopyButtons()
    renderMermaidCharts()
  })
})

function updateSeoMeta({ title, description, keywords }) {
  document.title = title
  const setMeta = (name, content) => {
    let tag = document.querySelector(`meta[name="${name}"]`)
    if (!tag) { tag = document.createElement('meta'); tag.name = name; document.head.appendChild(tag) }
    tag.content = content
  }
  const setOg = (property, content) => {
    let tag = document.querySelector(`meta[property="${property}"]`)
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag) }
    tag.content = content
  }
  setMeta('description', description)
  setMeta('keywords', keywords)
  setOg('og:title', title)
  setOg('og:description', description)
}

watch(() => route.params, async (newParams) => {
  if (newParams.category && newParams.id) {
    await loadArticleDetail(newParams.id)
  } else {
    selectedArticle.value = null
    selectedCategory.value = newParams.category || ''
    page.value = 1
    loadArticles()
  }
}, { immediate: true })

watch([selectedArticle, categories], () => {
  if (selectedArticle.value) {
    const article = selectedArticle.value
    const catName = getCategoryName(article.category)
    const titleParts = ['Forxi', '创意', '文章']
    if (catName) titleParts.push(catName)
    if (article.title) titleParts.push(article.title)
    const title = titleParts.join(' - ')
    const description = article.summary || article.title || '阅读文章详情'
    const keywords = [article.title, catName, '文章', 'Forxi'].filter(Boolean).join(',')
    updateSeoMeta({ title, description, keywords })
  } else if (route.params.category) {
    const catName = getCategoryName(route.params.category)
    const title = catName ? `Forxi - 创意 - 文章 - ${catName}` : 'Forxi - 创意 - 文章'
    const description = catName
      ? `${catName}分类文章列表，技术文章、随笔杂谈、经验总结。`
      : '技术文章、随笔杂谈、经验总结，涵盖前端开发、后端技术、DevOps 等领域。'
    const keywords = [catName, '技术文章', '随笔', 'Forxi'].filter(Boolean).join(',')
    updateSeoMeta({ title, description, keywords })
  }
})

onMounted(async () => {
  await loadCategories()
})

onUnmounted(() => {
  if (mermaid) {
    mermaid.cleanup()
  }
})
</script>

<style>
.hljs {
  background-color: #f6f8fa;
  color: #334155;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0;
  border: 1px solid #e2e8f0;
}

.hljs code {
  background-color: transparent;
  padding: 0;
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
}

.code-block-wrapper {
  position: relative;
  margin: 1rem 0;
}

.code-block-wrapper .copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: #e5e5e5;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.code-block-wrapper:hover .copy-btn {
  opacity: 1;
}

.code-block-wrapper .copy-btn:hover {
  background: #d5d5d5;
}

.mermaid {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  background: #fafafa;
  border-radius: 0.5rem;
  padding: 1rem;
}

.article-content {
  color: #374151;
}

.article-content h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 1.5rem 0 1rem;
  color: #18181b;
}

.article-content h2 {
  font-size: 1.375rem;
  font-weight: 600;
  margin: 1.25rem 0 0.75rem;
  color: #27272a;
}

.article-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  color: #3f3f46;
}

.article-content p {
  margin: 0.75rem 0;
  line-height: 1.75;
  color: #52525b;
}

.article-content ul, .article-content ol {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.article-content ul {
  list-style-type: disc;
}

.article-content ol {
  list-style-type: decimal;
}

.article-content li {
  margin: 0.25rem 0;
  color: #52525b;
}

.article-content blockquote {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-left: 4px solid #e5e5e5;
  background: #fafafa;
  color: #71717a;
}

.article-content code {
  padding: 0.125rem 0.375rem;
  background: #f4f4f5;
  border-radius: 0.25rem;
  font-size: 0.875em;
  color: #a1a1aa;
}

.article-content a {
  color: #6366f1;
  text-decoration: underline;
}

.article-content a:hover {
  color: #4f46e5;
}

.article-content img {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.article-content hr {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid #e5e5e5;
}

.article-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.article-content th, .article-content td {
  padding: 0.5rem;
  border: 1px solid #e5e5e5;
  text-align: left;
}

.article-content th {
  background: #fafafa;
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
