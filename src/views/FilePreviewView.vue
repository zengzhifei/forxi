<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">在线文件预览</h2>
          <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">支持预览多种文件格式，简单易用</p>
        </div>

        <div class="bg-white shadow-xl rounded-lg overflow-hidden max-w-3xl mx-auto">
          <div class="p-4 sm:p-6 md:p-8">
            <div class="space-y-8">
              <div>
                <label for="fileUrl" class="block text-sm font-medium text-gray-700 mb-2">远程文件</label>
                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input id="fileUrl" v-model="fileUrl" type="url" class="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3" placeholder="请输入可访问的文件地址（http://或https://开头）" />
                  <button @click="previewByUrl" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap">预览</button>
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
                        <li>预览文件将在新窗口中打开</li>
                        <li>本地文件仅保留30分钟，超时、刷新/关闭页面或重新选择文件时自动删除，保护您的隐私</li>
                      </ul>
                    </div>
                  </div>
                </div>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { base64Encode } from '../utils/encoders'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const isDev = import.meta.env.DEV
const currentDomain = window.location.origin
const FILE_PREVIEW_DOMAIN = isDev ? 'https://test.forxi.cn' : currentDomain + '/filepreview'

const fileUrl = ref('')
const selectedFile = ref(null)
const uploading = ref(false)
const uploadStatus = ref(null)
const isDragging = ref(false)
let currentFileName = null
let inactivityTimer = null

const INACTIVITY_TIMEOUT = 30 * 60 * 1000

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const deleteFile = async (fileName) => {
  if (!fileName) return
  try {
    const deleteResponse = await fetch(FILE_PREVIEW_DOMAIN + '/deleteFile?fileName=demo/' + fileName, {
      method: 'GET',
      mode: 'cors'
    })
    if (deleteResponse.ok) {
      console.log('文件已删除:', fileName)
    }
  } catch (deleteError) {
    console.error('删除文件失败:', deleteError)
  }
}

const resetInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
  if (currentFileName) {
    inactivityTimer = setTimeout(() => {
      deleteFile(currentFileName)
      currentFileName = null
    }, INACTIVITY_TIMEOUT)
  }
}

const cleanupCurrentFile = () => {
  if (currentFileName) {
    deleteFile(currentFileName)
    currentFileName = null
  }
  resetInactivityTimer()
}

onMounted(() => {
  window.addEventListener('beforeunload', () => {
    if (currentFileName) {
      deleteFile(currentFileName)
    }
  })
  
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
  events.forEach(event => {
    window.addEventListener(event, resetInactivityTimer)
  })
})

onBeforeUnmount(() => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
  window.removeEventListener('beforeunload', () => {})
})

const handleFileSelect = (event) => {
  cleanupCurrentFile()
  const file = event.target.files[0]
  if (!file) return
  selectedFile.value = file
  uploadStatus.value = null
}

const handleFileDrop = (event) => {
  isDragging.value = false
  cleanupCurrentFile()
  const file = event.dataTransfer.files[0]
  if (!file) return
  selectedFile.value = file
  uploadStatus.value = null
}

const cancelFileSelect = () => {
  if (!selectedFile.value) return
  cleanupCurrentFile()
  selectedFile.value = null
  uploadStatus.value = null
  const fileInput = document.getElementById('file-upload')
  if (fileInput) {
    fileInput.value = ''
  }
}

const uploadAndPreview = async () => {
  if (!selectedFile.value || uploading.value) return
  
  cleanupCurrentFile()
  
  uploading.value = true
  uploadStatus.value = { type: 'info', message: '正在上传文件...' }
  
  try {
    const formData = new FormData()
    const originalName = selectedFile.value.name
    const timestamp = Date.now()
    const newFileName = timestamp + '_' + originalName
    formData.append('file', selectedFile.value, newFileName)
    
    const uploadResponse = await fetch(FILE_PREVIEW_DOMAIN + '/fileUpload', {
      method: 'POST',
      mode: 'cors',
      body: formData
    })
    
    if (!uploadResponse.ok) {
      throw new Error('文件上传失败：HTTP错误')
    }
    
    const uploadResult = await uploadResponse.json()
    if (uploadResult.code !== 0) {
      throw new Error(uploadResult.msg || '文件上传失败')
    }
    
    currentFileName = newFileName
    resetInactivityTimer()
    
    uploadStatus.value = { type: 'success', message: '文件上传成功，正在打开预览...' }
    
    const fullUrl = FILE_PREVIEW_DOMAIN + '/demo/' + newFileName
    const encodedUrl = base64Encode(fullUrl)
    const previewUrl = FILE_PREVIEW_DOMAIN + '/onlinePreview?url=' + encodeURIComponent(encodedUrl)
    
    uploadStatus.value = { type: 'success', message: '准备就绪，正在打开预览...' }
    
    setTimeout(() => {
      window.open(previewUrl, '_blank')
      uploadStatus.value = { type: 'success', message: '预览已在新窗口打开，文件将在页面刷新或30分钟无操作后删除' }
    }, 500)
    
  } catch (error) {
    console.error('上传或预览失败:', error)
    uploadStatus.value = { type: 'error', message: error.message || '操作失败，请重试' }
  } finally {
    uploading.value = false
  }
}

const previewByUrl = () => {
  if (!fileUrl.value) {
    alert('请输入文件URL')
    return
  }
  try {
    const encodedUrl = base64Encode(encodeURIComponent(fileUrl.value))
    const previewUrl = FILE_PREVIEW_DOMAIN + '/onlinePreview?url=' + encodeURIComponent(encodedUrl)
    window.open(previewUrl, '_blank')
  } catch (error) {
    console.error('预览失败:', error)
    alert('预览失败，请检查URL是否正确')
  }
}
</script>
