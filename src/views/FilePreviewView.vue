<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">在线文件预览</h2>
          <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">支持预览多种文件格式，简单易用</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">
          <!-- 左侧：上传表单 -->
          <div class="w-full lg:w-5/12">
            <div class="bg-white shadow-xl rounded-lg overflow-hidden h-[600px] lg:h-[calc(100vh-200px)] flex flex-col">
              <div class="p-4 sm:p-6 md:p-8 overflow-y-auto">
                <div class="space-y-8">
                  <div>
                    <label for="fileUrl" class="block text-sm font-medium text-gray-700 mb-2">远程文件</label>
                    <div class="flex flex-col space-y-2">
                      <input id="fileUrl" v-model="fileUrl" type="url" class="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3" placeholder="请输入可访问的文件地址（http://或https://开头）" />
                      <button @click="previewByUrl" :disabled="loading" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap disabled:opacity-50">
                        {{ loading ? '预览中...' : '预览' }}
                      </button>
                    </div>
                  </div>

                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-gray-200"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                      <span class="px-4 bg-white text-gray-500 font-medium">或</span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">本地文件</label>
                    <div 
                      class="mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-dashed rounded-lg transition-colors"
                      :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'"
                      @dragover.prevent="isDragging = true"
                      @dragleave.prevent="isDragging = false"
                      @drop.prevent="handleFileDrop"
                    >
                      <div class="space-y-3 text-center w-full">
                        <div v-if="!selectedFile">
                          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                          <div class="mt-4 flex text-sm text-gray-600 justify-center">
                            <label for="file-upload" class="relative cursor-pointer bg-blue-50 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none px-4 py-2">
                              <span>选择文件</span>
                              <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileSelect">
                            </label>
                          </div>
                          <p class="text-xs text-gray-500 mt-2">支持拖拽文件到此处</p>
                        </div>
                        
                        <div v-if="selectedFile" class="bg-gray-50 rounded-lg p-4">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center flex-1 min-w-0">
                              <svg class="h-10 w-10 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div class="ml-3 flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">{{ selectedFile.name }}</p>
                                <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                              </div>
                            </div>
                            <button @click="cancelFileSelect" class="ml-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              取消
                            </button>
                          </div>
                          <button @click="uploadAndPreview" :disabled="uploading" class="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg v-if="uploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ uploading ? '上传中...' : '上传并预览' }}
                          </button>
                        </div>
                        
                        <p v-if="!selectedFile" class="text-xs text-gray-500">支持 docx、excel、ppt、pdf、jpg、png 等常见文件格式</p>
                        <p v-if="uploadStatus" :class="uploadStatus.type === 'success' ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">{{ uploadStatus.message }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-blue-800">使用说明</h3>
                        <div class="mt-2 text-sm text-blue-700">
                          <ul class="list-disc list-inside space-y-1">
                            <li><strong>远程文件：</strong>输入可公开访问的文件URL地址，点击预览按钮</li>
                            <li><strong>本地文件：</strong>选择电脑中的文件，上传后自动预览</li>
                            <li>预览内容将在下方显示</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：预览区域 -->
          <div class="w-full lg:w-7/12">
            <div class="bg-white shadow-xl rounded-lg overflow-hidden h-[600px] lg:h-[calc(100vh-200px)] flex flex-col">
              <!-- 文件信息栏 -->
              <div v-if="processedPreviewData" class="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                <div class="flex items-center space-x-3 min-w-0">
                  <div class="flex-shrink-0">
                    <span :class="getFileTypeClass(processedPreviewData.type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ getFileTypeText(processedPreviewData.type) }}
                    </span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ processedPreviewData.name || '未知文件' }}</p>
                    <p v-if="processedPreviewData.size" class="text-xs text-gray-500">{{ formatFileSize(processedPreviewData.size) }}</p>
                  </div>
                </div>
                <button @click="downloadFile" class="flex-shrink-0 ml-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span>下载</span>
                </button>
              </div>
              <!-- 预览内容区域 -->
              <!-- 空状态 -->
              <div v-if="!processedPreviewData" class="h-full flex items-center justify-center text-gray-400">
                <div class="text-center">
                  <svg class="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>预览内容将显示在此处</p>
                </div>
              </div>

              <!-- 图片预览（Base64） -->
              <div v-else-if="processedPreviewData.type === 'image'" class="h-full overflow-auto p-4 flex items-center justify-center">
                <img :src="processedPreviewData.content" class="max-w-full max-h-full object-contain" alt="预览图片" />
              </div>

              <!-- 文本预览 -->
              <div v-else-if="processedPreviewData.type === 'text'" class="h-full overflow-auto p-4">
                <pre class="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded">{{ processedPreviewData.content }}</pre>
              </div>

              <!-- PDF预览 -->
              <div v-else-if="processedPreviewData.type === 'pdf'" class="h-full">
                <embed :src="processedPreviewData.content" type="application/pdf" class="w-full h-full" />
              </div>

              <!-- 视频预览 -->
              <div v-else-if="processedPreviewData.type === 'video'" class="h-full flex items-center justify-center bg-black">
                <video :src="processedPreviewData.content" controls class="max-w-full max-h-full"></video>
              </div>

              <!-- Office预览 -->
              <div v-else-if="processedPreviewData.type === 'office'" class="h-full">
                <iframe 
                  :src="'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(API_DOMAIN_CONST + '/api/filereview/cache?file=' + processedPreviewData.file)" 
                  class="w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import api, { API_DOMAIN_CONST } from '../utils/api'
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

// API_DOMAIN 从 api.js 导入

const processedPreviewData = computed(() => {
  if (!previewData.value) return null
  const data = { ...previewData.value }
  
  if (data.type === 'image' && data.content && !data.content.startsWith('data:')) {
    const mime = data.mime || 'image/png'
    data.content = `data:${mime};base64,${data.content}`
  }
  if (data.type === 'pdf' && data.content && !data.content.startsWith('data:')) {
    data.content = `data:application/pdf;base64,${data.content}`
  }
  return data
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileTypeClass = (type) => {
  const typeClasses = {
    image: 'bg-green-100 text-green-800',
    image_url: 'bg-green-100 text-green-800',
    text: 'bg-blue-100 text-blue-800',
    pdf: 'bg-red-100 text-red-800',
    video: 'bg-purple-100 text-purple-800',
    office: 'bg-orange-100 text-orange-800'
  }
  return typeClasses[type] || 'bg-gray-100 text-gray-800'
}

const getFileTypeText = (type) => {
  const typeTexts = {
    image: '图片',
    image_url: '图片',
    text: '文本',
    pdf: 'PDF',
    video: '视频',
    office: 'Office文档'
  }
  return typeTexts[type] || '未知类型'
}

const downloadFile = () => {
  if (!processedPreviewData.value) return
  
  const { name, content, file, type } = processedPreviewData.value
  const fileName = name || 'downloaded_file'
  
  try {
    if (type === 'image' || type === 'text' || type === 'pdf' || type === 'video') {
      const link = document.createElement('a')
      link.href = content
      link.download = fileName
      link.click()
    } else if (type === 'office' && file) {
      const link = document.createElement('a')
      link.href = API_DOMAIN_CONST + '/api/filereview/cache?file=' + file
      link.download = fileName
      link.click()
    } else {
      toast.error('无法下载该文件')
    }
  } catch (error) {
    console.error('下载失败:', error)
    toast.error('下载失败，请重试')
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  selectedFile.value = file
  uploadStatus.value = null
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (!file) return
  selectedFile.value = file
  uploadStatus.value = null
}

const cancelFileSelect = () => {
  selectedFile.value = null
  uploadStatus.value = null
  const fileInput = document.getElementById('file-upload')
  if (fileInput) {
    fileInput.value = ''
  }
}

const uploadAndPreview = async () => {
  if (!selectedFile.value || uploading.value) return
  
  uploading.value = true
  uploadStatus.value = { type: 'info', message: '正在上传文件...' }
  
  try {
    const result = await api.previewLocal(selectedFile.value)
    previewData.value = result
    uploadStatus.value = { type: 'success', message: '预览已显示' }
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
  try {
    const result = await api.previewOnline(fileUrl.value)
    previewData.value = result
  } catch (error) {
    console.error('预览失败:', error)
    toast.error(error.message || '预览失败，请检查URL是否正确')
  } finally {
    loading.value = false
  }
}
</script>
