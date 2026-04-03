<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
    <AppHeader />

    <div class="flex-grow flex">
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

      <aside v-if="!isMobile" class="w-56 bg-white border-r border-gray-200 flex-shrink-0 fixed top-16 bottom-0 left-0 overflow-hidden">
        <div class="h-full flex flex-col">
          <div class="px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">文件转换</h2>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索功能..."
                class="w-full px-3 py-2 pl-9 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <nav class="flex-1 overflow-y-auto p-2">
            <ul class="space-y-1">
              <li v-for="item in filteredMenuItems" :key="item.hash">
                <a
                  href="javascript:void(0)"
                  @click="selectItem(item)"
                  class="flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200"
                  :class="activeTab === item.hash ? 'bg-zinc-100 text-zinc-700' : 'text-gray-600 hover:bg-gray-50'"
                >
                  <span
                    class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors"
                    :class="activeTab === item.hash ? 'bg-zinc-200' : 'bg-gray-100 text-gray-500'"
                  >
                    <span v-html="item.icon"></span>
                  </span>
                  <span class="font-medium">{{ item.name }}</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <aside
        v-if="isMobile"
        class="fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-200 flex-shrink-0 transform transition-transform duration-300"
        :class="menuOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="sticky top-0 h-full overflow-y-auto">
          <div class="px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">文件转换</h2>
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
                placeholder="搜索功能..."
                class="w-full px-3 py-2 pl-9 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <nav class="p-2">
            <ul class="space-y-1">
              <li v-for="item in filteredMenuItems" :key="item.hash">
                <a
                  href="javascript:void(0)"
                  @click="selectItem(item)"
                  class="flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200"
                  :class="activeTab === item.hash ? 'bg-zinc-100 text-zinc-700' : 'text-gray-600 hover:bg-gray-50'"
                >
                  <span
                    class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors flex-shrink-0"
                    :class="activeTab === item.hash ? 'bg-zinc-200' : 'bg-gray-100 text-gray-500'"
                  >
                    <span v-html="item.icon"></span>
                  </span>
                  <span class="font-medium truncate">{{ item.name }}</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <div
        v-if="isMobile && menuOpen"
        @click="toggleMenu"
        class="fixed inset-0 bg-black/50 z-30"
      ></div>

      <main class="flex-1 p-4 lg:p-8" :class="!isMobile ? 'ml-56' : ''">
        <div class="max-w-4xl mx-auto">
          <div v-if="currentComponent" class="space-y-4 lg:space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <div class="flex items-center gap-3 lg:gap-4">
                <div class="w-10 lg:w-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-xl lg:text-2xl">
                  <span v-html="currentTabItem?.icon"></span>
                </div>
                <div>
                  <h1 class="text-lg lg:text-2xl font-bold text-gray-900">{{ currentTabItem?.name }}</h1>
                  <p class="text-gray-500 text-sm lg:text-base mt-0.5">{{ currentTabItem?.description }}</p>
                </div>
              </div>
            </div>
            <component :is="currentComponent" @preview="showPdf" />
          </div>
        </div>
      </main>
    </div>

    <PdfPreviewModal ref="pdfPreviewModal" />

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import PdfPreviewModal from '../modules/file-converter/PdfPreviewModal.vue'
import Image2Pdf from '../modules/file-converter/Image2Pdf.vue'
import Text2Pdf from '../modules/file-converter/Text2Pdf.vue'
import Word2Pdf from '../modules/file-converter/Word2Pdf.vue'
import Table2Pdf from '../modules/file-converter/Table2Pdf.vue'

const menuItems = [
  { hash: '#image2pdf', name: '图片 -> PDF', shortName: '图片', icon: '🖼️', description: '将图片转换为 PDF 文档', component: markRaw(Image2Pdf) },
  { hash: '#text2pdf', name: '文本 -> PDF', shortName: '文本', icon: '📝', description: '将文本内容转换为 PDF 文档', component: markRaw(Text2Pdf) },
  { hash: '#word2pdf', name: 'Word -> PDF', shortName: 'Word', icon: '📄', description: '将 Word 文档转换为 PDF', component: markRaw(Word2Pdf) },
  { hash: '#table2pdf', name: '表格 -> PDF', shortName: '表格', icon: '📊', description: '将表格数据转换为 PDF 文档', component: markRaw(Table2Pdf) }
]

const isMobile = ref(false)
const menuOpen = ref(false)
const searchQuery = ref('')
const activeTab = ref('#image2pdf')

const updateMobile = () => {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  updateMobile()
  window.addEventListener('resize', updateMobile)

  const hash = window.location.hash
  if (hash && menuItems.some(m => m.hash === hash)) {
    activeTab.value = hash
  }

  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash
    if (menuItems.some(m => m.hash === newHash)) {
      activeTab.value = newHash
    }
  })
})

const filteredMenuItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return menuItems
  return menuItems.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.shortName.toLowerCase().includes(query)
  )
})

const currentTabItem = computed(() => menuItems.find(m => m.hash === activeTab.value))
const currentComponent = computed(() => currentTabItem.value?.component)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const selectItem = (item) => {
  activeTab.value = item.hash
  window.location.hash = item.hash
  menuOpen.value = false
}

const pdfPreviewModal = ref(null)
const showPdf = (url) => {
  pdfPreviewModal.value?.showPdf(url)
}
</script>
