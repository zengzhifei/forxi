<template>
  <div class="min-h-screen bg-[#fafafa]">
    <AppHeader />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex gap-6">
        <aside class="w-64 flex-shrink-0">
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
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                :class="selectedCategory === cat.code ? 'bg-zinc-100 text-zinc-700 font-medium' : 'text-gray-600 hover:bg-gray-50'"
              >
                {{ cat.name }}
              </button>
            </nav>
          </div>
        </aside>

        <main class="flex-1 min-w-0">
          <div v-if="!isDetailView" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center gap-4 mb-4">
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
                <div class="mt-auto text-xs text-gray-400">
                  {{ article.author_name }} · {{ formatDate(article.updated_at) }}
                </div>
              </div>
            </div>

            <div ref="loadMoreTrigger" class="h-10 flex items-center justify-center mt-4">
              <span v-if="loading" class="text-gray-400 text-sm">加载中...</span>
              <span v-else-if="noMore" class="text-gray-400 text-sm">没有更多文章了</span>
            </div>
          </div>

          <div v-else-if="selectedArticle" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
              <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ selectedArticle.title }}</h1>
              <div class="text-sm text-gray-400 mb-6">{{ selectedArticle.author_name }} · {{ formatDate(selectedArticle.updated_at) }}</div>
              <div class="prose prose-zinc max-w-none article-content" v-html="renderedContent"></div>
            </article>
          </div>

          <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div class="text-center text-gray-400 py-8">加载中...</div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/common'
import { useIntersectionObserver } from '@vueuse/core'
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
const page = ref(1)
const pageSize = 10
const total = ref(0)
const loading = ref(false)
const noMore = ref(false)
const loadMoreTrigger = ref(null)
const searchQuery = ref('')

const renderedMermaidIds = ref(new Set())

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

async function loadCategories() {
  try {
    const res = await api.getArticleCategories()
    categories.value = Array.isArray(res) ? res : (res.data || [])
  } catch (e) {
    console.error('Failed to load categories:', e.message || e)
    categories.value = []
  }
}

async function loadArticles(reset = false) {
  if (loading.value || (noMore.value && !reset)) return

  loading.value = true

  if (reset) {
    page.value = 1
    articles.value = []
    noMore.value = false
  }

  try {
    const res = await api.getArticleList({
      page: page.value,
      pageSize: pageSize,
      category: selectedCategory.value,
      query: searchQuery.value
    })

    const newArticles = Array.isArray(res) ? res : (res.data || [])
    const meta = Array.isArray(res) ? {} : (res.meta || {})

    if (reset) {
      articles.value = newArticles
      total.value = meta.total || 0
    } else {
      articles.value.push(...newArticles)
    }

    if (newArticles.length < pageSize || articles.value.length >= total.value) {
      noMore.value = true
    } else {
      page.value++
    }
  } catch (e) {
    console.error('Failed to load articles:', e.message || e)
    noMore.value = true
  } finally {
    loading.value = false
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
    }
  } catch (e) {
    console.error('Failed to load article:', e.message || e)
  }
}

function selectCategory(category) {
  selectedCategory.value = category
  selectedArticle.value = null
  noMore.value = false
  searchQuery.value = ''
  if (route.params.category && route.params.id) {
    router.push('/articles')
  } else {
    loadArticles(true)
  }
}

function handleSearch() {
  noMore.value = false
  loadArticles(true)
}

function viewArticle(article) {
  const category = article.category || selectedCategory.value || 'all'
  router.push(`/articles/${category}/${article.id}`)
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

watch(() => route.params, async (newParams) => {
  if (newParams.category && newParams.id) {
    await loadArticleDetail(newParams.id)
  } else {
    selectedArticle.value = null
    noMore.value = false
    loadArticles(true)
  }
}, { immediate: true })

useIntersectionObserver(loadMoreTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting && !isDetailView.value && !loading.value && !noMore.value) {
    loadArticles()
  }
}, { threshold: 0.1 })

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
</style>
