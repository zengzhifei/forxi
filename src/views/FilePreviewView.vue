<template>
  <div class="min-h-screen bg-[#fafafa] text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-semibold text-zinc-700 mb-2">文件预览</h2>
          <p class="text-sm text-zinc-400">支持在线预览多种文件格式，简单易用</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">
          <!-- 左侧：上传表单 -->
          <div class="w-full lg:w-4/12">
            <div class="bg-white border border-zinc-100 shadow-sm rounded-xl overflow-hidden h-[600px] lg:h-[calc(100vh-200px)] flex flex-col">
              <div class="p-6 sm:p-8 overflow-y-auto flex-1">
                <div class="space-y-6">
                  <div>
                    <label for="fileUrl" class="block text-sm font-medium text-zinc-600 mb-2">远程文件</label>
                    <div class="flex flex-col space-y-2">
                      <div class="relative">
                        <input id="fileUrl" v-model="fileUrl" @input="previewData = null; textContent = ''" type="url" class="flex-1 block w-full rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 placeholder-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:bg-white outline-none sm:text-sm px-4 py-3 pr-10 transition-all" placeholder="输入文件地址（http 或 https 开头）" />
                        <button
                          v-if="fileUrl"
                          @click="fileUrl = ''; previewData = null; textContent = ''"
                          class="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-300 hover:text-zinc-500 transition-colors"
                        >
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <button @click="previewByUrl" :disabled="loading" class="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-xl text-white transition-all duration-200 disabled:opacity-50 hover:shadow-lg hover:shadow-zinc-300/40 hover:scale-[1.01]" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)">
                        {{ loading ? '预览中...' : '预览' }}
                      </button>
                    </div>
                  </div>

                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-zinc-100"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                      <span class="px-4 bg-white text-zinc-400 font-medium">或</span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-2">本地文件</label>
                    <div
                      class="mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-dashed rounded-xl transition-colors"
                      :class="isDragging ? 'border-zinc-400 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'"
                      @dragover.prevent="isDragging = true"
                      @dragleave.prevent="isDragging = false"
                      @drop.prevent="handleFileDrop"
                    >
                      <div class="space-y-3 text-center w-full">
                        <div v-if="!selectedFile">
                          <svg class="mx-auto h-12 w-12 text-zinc-300" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                          <div class="mt-4 flex text-sm text-zinc-500 justify-center">
                            <label for="file-upload" class="relative cursor-pointer bg-zinc-50 border border-zinc-200 rounded-lg font-medium text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 transition-colors px-4 py-2">
                              <span>选择文件</span>
                              <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileSelect">
                            </label>
                          </div>
                          <p class="text-xs text-zinc-400 mt-2">支持拖拽文件到此处</p>
                        </div>

                        <div v-if="selectedFile" class="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center flex-1 min-w-0">
                              <svg class="h-10 w-10 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div class="ml-3 flex-1 min-w-0">
                                <p class="text-sm font-medium text-zinc-700 truncate">{{ selectedFile.name }}</p>
                                <p class="text-xs text-zinc-400">{{ formatFileSize(selectedFile.size) }}</p>
                              </div>
                            </div>
                            <button @click="cancelFileSelect" class="ml-3 inline-flex items-center px-3 py-1.5 border border-zinc-200 text-sm font-medium rounded-lg text-zinc-500 bg-white hover:bg-zinc-50 transition-colors">
                              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              取消
                            </button>
                          </div>
                          <button @click="uploadAndPreview" :disabled="uploading" class="mt-3 w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-zinc-300/40" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)">
                            <svg v-if="uploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ uploading ? '上传中...' : '上传并预览' }}
                          </button>
                        </div>

                        <p v-if="!selectedFile" class="text-xs text-zinc-400">支持 docx、excel、ppt、pdf、jpg、png 等格式</p>
                        <p v-if="uploadStatus" :class="uploadStatus.type === 'success' ? 'text-emerald-500' : 'text-red-400'" class="text-sm font-medium">{{ uploadStatus.message }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：预览区域 -->
          <div id="preview-area" class="w-full lg:w-8/12">
            <div class="bg-white border border-zinc-100 shadow-sm rounded-xl overflow-hidden h-[600px] lg:h-[calc(100vh-200px)] flex flex-col">
              <!-- 文件信息栏 -->
              <div v-if="processedPreviewData" class="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50">
                <div class="flex items-center space-x-3 min-w-0">
                  <div class="flex-shrink-0">
                    <span :class="getFileTypeClass(processedPreviewData.type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ getFileTypeText(processedPreviewData.type) }}
                    </span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-zinc-700 truncate">{{ processedPreviewData.name || '未知文件' }}</p>
                    <p v-if="processedPreviewData.size" class="text-xs text-zinc-400">{{ formatFileSize(processedPreviewData.size) }}</p>
                  </div>
                </div>
                <button @click="downloadFile" class="flex-shrink-0 ml-2 px-3 py-1.5 text-white text-sm rounded-lg flex items-center space-x-1 transition-all hover:shadow-md hover:shadow-zinc-300/40" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span>下载</span>
                </button>
              </div>
              <!-- 加载状态 -->
              <div v-if="loading && !processedPreviewData" class="h-full flex items-center justify-center text-zinc-400">
                <div class="text-center">
                  <svg class="animate-spin mx-auto h-10 w-10 text-zinc-300 mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p class="text-sm">预览资源正在加载中...</p>
                </div>
              </div>

              <!-- 空状态 -->
              <div v-else-if="!processedPreviewData" class="h-full flex items-center justify-center text-zinc-300">
                <div class="text-center">
                  <svg class="mx-auto h-16 w-16 text-zinc-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-sm">预览内容将显示在此处</p>
                </div>
              </div>

              <!-- 图片预览 -->
              <div v-else-if="processedPreviewData.type === 'image'" class="h-full overflow-auto p-4 flex items-center justify-center">
                <img :src="processedPreviewData.url" class="max-w-full max-h-full object-contain" alt="预览图片" />
              </div>

              <!-- 文本预览 -->
              <div v-else-if="processedPreviewData.type === 'text'" class="h-full overflow-auto p-4">
                <pre class="whitespace-pre-wrap text-sm font-mono bg-zinc-50 p-4 rounded-xl text-zinc-600">{{ textContent }}</pre>
              </div>

              <!-- PDF预览 -->
              <div v-else-if="processedPreviewData.type === 'pdf'" class="h-full">
                <iframe :src="processedPreviewData.url" class="w-full h-full border-0"></iframe>
              </div>

              <!-- 视频预览 -->
              <div v-else-if="processedPreviewData.type === 'video'" class="h-full flex items-center justify-center bg-zinc-900">
                <video :src="processedPreviewData.url" controls class="max-w-full max-h-full"></video>
              </div>

              <!-- 音频预览 -->
              <div v-else-if="processedPreviewData.type === 'audio'" class="h-full flex items-center justify-center">
                <audio :src="processedPreviewData.url" controls class="w-full max-w-md"></audio>
              </div>

              <!-- Office预览 -->
              <div v-else-if="processedPreviewData.type === 'office'" class="h-full">
                <iframe
                  :src="'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(processedPreviewData.url)"
                  class="w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 回到顶部按钮 -->
    <button
      v-show="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 w-14 h-14 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-zinc-300/50"
      style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
    >
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import api from '../utils/api'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const toast = inject('toast')

const fileUrl = ref('')
const selectedFile = ref(null)
const uploading = ref(false)
const loading = ref(false)
const uploadStatus = ref(null)
const isDragging = ref(false)
const previewData = ref(null)
const showBackToTop = ref(false)

// API_DOMAIN 从 api.js 导入

// 回到顶部功能
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听滚动事件
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const processedPreviewData = computed(() => {
  if (!previewData.value) return null
  return { ...previewData.value }
})

const textContent = ref('')

const fetchTextContent = async (url) => {
  try {
    const response = await fetch(url)
    textContent.value = await response.text()
  } catch (error) {
    console.error('获取文本内容失败:', error)
    textContent.value = '无法加载文本内容'
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileTypeClass = (type) => {
  const typeClasses = {
    image: 'bg-emerald-50 text-emerald-600',
    text: 'bg-zinc-100 text-zinc-600',
    pdf: 'bg-red-50 text-red-500',
    video: 'bg-violet-50 text-violet-600',
    audio: 'bg-pink-50 text-pink-500',
    office: 'bg-orange-50 text-orange-500'
  }
  return typeClasses[type] || 'bg-zinc-100 text-zinc-500'
}

const getFileTypeText = (type) => {
  const typeTexts = {
    image: '图片',
    text: '文本',
    pdf: 'PDF',
    video: '视频',
    audio: '音频',
    office: 'Office文档'
  }
  return typeTexts[type] || '未知类型'
}

const downloadFile = async () => {
  if (!processedPreviewData.value) return
  
  const { name, url, type } = processedPreviewData.value
  const fileName = name || 'downloaded_file'
  
  if (!url) {
    toast.error('无法下载该文件')
    return
  }
  
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('下载失败:', error)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  selectedFile.value = file
  uploadStatus.value = null
  previewData.value = null
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (!file) return
  selectedFile.value = file
  uploadStatus.value = null
  previewData.value = null
}

const cancelFileSelect = () => {
  selectedFile.value = null
  uploadStatus.value = null
  previewData.value = null
  textContent.value = ''
  const fileInput = document.getElementById('file-upload')
  if (fileInput) {
    fileInput.value = ''
  }
}

const uploadAndPreview = async () => {
  if (!selectedFile.value || uploading.value) return
  
  uploading.value = true
  uploadStatus.value = { type: 'info', message: '正在上传文件...' }
  
  // 立即滚动到预览区域并显示加载状态
  const previewArea = document.getElementById('preview-area')
  if (previewArea) {
    previewArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  
  try {
    const result = await api.previewLocal(selectedFile.value)
    previewData.value = result
    uploadStatus.value = { type: 'success', message: '预览已显示' }
    
    // text类型需要获取文本内容
    if (result.type === 'text' && result.url) {
      await fetchTextContent(result.url)
    }
  } catch (error) {
    console.error('上传或预览失败:', error)
    uploadStatus.value = { type: 'error', message: error.message || '操作失败，请重试' }
  } finally {
    uploading.value = false
  }
}

const previewByUrl = async () => {
  if (!fileUrl.value) {
    toast.warning('请输入文件URL')
    return
  }
  
  loading.value = true
  
  // 立即滚动到预览区域并显示加载状态
  const previewArea = document.getElementById('preview-area')
  if (previewArea) {
    previewArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  
  try {
    const result = await api.previewOnline(fileUrl.value)
    previewData.value = result
    
    // text类型需要获取文本内容
    if (result.type === 'text' && result.url) {
      await fetchTextContent(result.url)
    }
  } catch (error) {
    console.error('预览失败:', error)
    toast.error(error.message || '预览失败，请检查URL是否正确')
  } finally {
    loading.value = false
  }
}
</script>
