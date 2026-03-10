<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">在线图片处理</h2>
          <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">支持图片压缩、裁剪、尺寸修改、格式转换，纯前端处理保护隐私</p>
        </div>

        <div v-if="!selectedImage" class="max-w-xl mx-auto">
          <div 
            class="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
            @click="triggerFileInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            :class="{ 'border-blue-500 bg-blue-50': isDragging }"
          >
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-4 text-lg font-medium text-gray-900">点击或拖拽图片到此处</p>
            <p class="mt-2 text-sm text-gray-500">支持 JPG、PNG、WebP、GIF 等常见格式</p>
            <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileSelect">
          </div>
        </div>

        <div v-else class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
              <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 class="font-semibold text-gray-900">预览</h3>
                  <button @click="resetImage" class="text-sm text-gray-500 hover:text-gray-700">更换图片</button>
                </div>
                <div class="p-4 bg-gray-100 relative" :style="{ height: previewHeight + 'px' }">
                  <img 
                    v-if="activeTab === 'crop'" 
                    ref="cropperImage" 
                    :src="imagePreviewUrl" 
                    class="max-w-full max-h-full"
                  >
                  <img 
                    v-else 
                    :src="processedImageUrl || imagePreviewUrl" 
                    class="max-w-full max-h-full mx-auto object-contain"
                  >
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="bg-white rounded-xl shadow-lg p-4">
                <div class="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
                  <button 
                    v-for="tab in tabs" 
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    class="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors"
                    :class="activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                  >
                    {{ tab.name }}
                  </button>
                </div>

                <div v-if="activeTab === 'compress'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">压缩质量: {{ compressQuality }}%</label>
                    <input 
                      type="range" 
                      v-model.number="compressQuality" 
                      min="10" 
                      max="100" 
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    >
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                      <span>高压缩</span>
                      <span>低压缩</span>
                    </div>
                  </div>
                  <button 
                    @click="compressImage" 
                    :disabled="processing"
                    class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ processing ? '处理中...' : '压缩图片' }}
                  </button>
                </div>

                <div v-if="activeTab === 'crop'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">裁剪比例</label>
                    <div class="grid grid-cols-3 gap-2">
                      <button 
                        v-for="ratio in cropRatios" 
                        :key="ratio.label"
                        @click="setCropRatio(ratio.value)"
                        class="py-2 px-2 text-xs font-medium border rounded-lg transition-colors"
                        :class="cropAspectRatio === ratio.value ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 text-gray-600 hover:border-gray-400'"
                      >
                        {{ ratio.label }}
                      </button>
                    </div>
                  </div>
                  <button 
                    @click="cropImage" 
                    :disabled="processing"
                    class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ processing ? '处理中...' : '裁剪图片' }}
                  </button>
                </div>

                <div v-if="activeTab === 'resize'" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">宽度 (px)</label>
                      <input 
                        type="number" 
                        v-model.number="resizeWidth" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="宽度"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">高度 (px)</label>
                      <input 
                        type="number" 
                        v-model.number="resizeHeight" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="高度"
                      >
                    </div>
                  </div>
                  <div class="flex items-center">
                    <input 
                      type="checkbox" 
                      id="maintainAspect" 
                      v-model="maintainAspectRatio"
                      class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    >
                    <label for="maintainAspect" class="ml-2 text-sm text-gray-600">保持宽高比</label>
                  </div>
                  <button 
                    @click="resizeImage" 
                    :disabled="processing"
                    class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ processing ? '处理中...' : '修改尺寸' }}
                  </button>
                </div>

                <div v-if="activeTab === 'convert'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">目标格式</label>
                    <div class="grid grid-cols-3 gap-2">
                      <button 
                        v-for="format in outputFormats" 
                        :key="format"
                        @click="targetFormat = format"
                        class="py-2 px-2 text-sm font-medium border rounded-lg transition-colors"
                        :class="targetFormat === format ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 text-gray-600 hover:border-gray-400'"
                      >
                        {{ format.toUpperCase() }}
                      </button>
                    </div>
                  </div>
                  <button 
                    @click="convertImage" 
                    :disabled="processing"
                    class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ processing ? '处理中...' : '转换格式' }}
                  </button>
                </div>
              </div>

              <div v-if="processedImageUrl" class="bg-white rounded-xl shadow-lg p-4">
                <div class="space-y-3 mb-4">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">原始大小:</span>
                    <span class="font-medium">{{ formatFileSize(originalFileSize) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">处理后:</span>
                    <span class="font-medium text-green-600">{{ formatFileSize(processedFileSize) }}</span>
                  </div>
                  <div v-if="originalFileSize > processedFileSize" class="flex justify-between text-sm">
                    <span class="text-gray-500">压缩比:</span>
                    <span class="font-medium text-blue-600">{{ Math.round((1 - processedFileSize / originalFileSize) * 100) }}%</span>
                  </div>
                </div>
                <button 
                  @click="downloadImage"
                  class="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>下载图片</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 mt-8 max-w-3xl mx-auto">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">功能说明</h3>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>图片压缩：</strong>调整压缩质量，减少文件大小</li>
                  <li><strong>图片裁剪：</strong>自由裁剪或选择固定比例</li>
                  <li><strong>尺寸修改：</strong>精确调整图片宽高</li>
                  <li><strong>格式转换：</strong>JPG、PNG、WebP格式互转</li>
                  <li>所有处理在客户端完成，保护您的隐私</li>
                </ul>
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
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import imageCompression from 'browser-image-compression'
import Cropper from 'cropperjs'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const fileInput = ref(null)
const cropperImage = ref(null)
const selectedImage = ref(null)
const imagePreviewUrl = ref('')
const processedImageUrl = ref('')
const processedFileSize = ref(0)
const originalFileSize = ref(0)
const processing = ref(false)
const isDragging = ref(false)
const activeTab = ref('compress')
const cropper = ref(null)

const tabs = [
  { id: 'compress', name: '压缩' },
  { id: 'crop', name: '裁剪' },
  { id: 'resize', name: '尺寸' },
  { id: 'convert', name: '格式' }
]

const cropRatios = [
  { label: '自由', value: NaN },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4/3 },
  { label: '16:9', value: 16/9 },
  { label: '3:2', value: 3/2 },
  { label: '2:3', value: 2/3 }
]

const outputFormats = ['jpg', 'png', 'webp']

const compressQuality = ref(80)
const cropAspectRatio = ref(NaN)
const resizeWidth = ref(0)
const resizeHeight = ref(0)
const maintainAspectRatio = ref(true)
const targetFormat = ref('jpg')

const previewHeight = computed(() => {
  if (window.innerWidth < 768) return 300
  return 500
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  loadImage(file)
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (!file || !file.type.startsWith('image/')) return
  loadImage(file)
}

const loadImage = (file) => {
  selectedImage.value = file
  originalFileSize.value = file.size
  processedFileSize.value = 0
  processedImageUrl.value = ''
  imagePreviewUrl.value = URL.createObjectURL(file)
  resizeWidth.value = 0
  resizeHeight.value = 0
  
  const img = new Image()
  img.onload = () => {
    resizeWidth.value = img.width
    resizeHeight.value = img.height
  }
  img.src = imagePreviewUrl.value
}

const resetImage = () => {
  selectedImage.value = null
  imagePreviewUrl.value = ''
  processedImageUrl.value = ''
  processedFileSize.value = 0
  originalFileSize.value = 0
  if (cropper.value) {
    cropper.value.destroy()
    cropper.value = null
  }
}

const compressImage = async () => {
  if (!selectedImage.value) return
  processing.value = true
  
  try {
    const options = {
      maxSizeMB: 10,
      maxWidthOrHeight: 4096,
      useWebWorker: true,
      initialQuality: compressQuality.value / 100
    }
    
    const compressedFile = await imageCompression(selectedImage.value, options)
    processedFileSize.value = compressedFile.size
    processedImageUrl.value = URL.createObjectURL(compressedFile)
  } catch (error) {
    console.error('压缩失败:', error)
    alert('图片压缩失败，请重试')
  } finally {
    processing.value = false
  }
}

const setCropRatio = (ratio) => {
  cropAspectRatio.value = ratio
  if (cropper.value) {
    cropper.value.setAspectRatio(ratio)
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'crop' && cropperImage.value && !cropper.value) {
    setTimeout(() => {
      cropper.value = new Cropper(cropperImage.value, {
        aspectRatio: cropAspectRatio.value,
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true
      })
    }, 100)
  }
})

const cropImage = () => {
  if (!cropper.value) return
  processing.value = true
  
  try {
    const canvas = cropper.value.getCroppedCanvas({
      maxWidth: 4096,
      maxHeight: 4096
    })
    
    const format = targetFormat.value === 'jpg' ? 'image/jpeg' : 
                  targetFormat.value === 'png' ? 'image/png' : 'image/webp'
    
    canvas.toBlob((blob) => {
      processedFileSize.value = blob.size
      processedImageUrl.value = URL.createObjectURL(blob)
      processing.value = false
    }, format, 0.92)
  } catch (error) {
    console.error('裁剪失败:', error)
    alert('图片裁剪失败，请重试')
    processing.value = false
  }
}

const resizeImage = async () => {
  if (!selectedImage.value) return
  processing.value = true
  
  try {
    const options = {
      maxSizeMB: 10,
      maxWidthOrHeight: Math.max(resizeWidth.value, resizeHeight.value),
      useWebWorker: true
    }
    
    const compressedFile = await imageCompression(selectedImage.value, options)
    
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = resizeWidth.value
      canvas.height = resizeHeight.value
      
      const ctx = canvas.getContext('2d')
      
      if (maintainAspectRatio.value) {
        const scale = Math.min(
          resizeWidth.value / img.width,
          resizeHeight.value / img.height
        )
        const x = (resizeWidth.value - img.width * scale) / 2
        const y = (resizeHeight.value - img.height * scale) / 2
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
      } else {
        ctx.drawImage(img, 0, 0, resizeWidth.value, resizeHeight.value)
      }
      
      const format = targetFormat.value === 'jpg' ? 'image/jpeg' : 
                    targetFormat.value === 'png' ? 'image/png' : 'image/webp'
      
      canvas.toBlob((blob) => {
        processedFileSize.value = blob.size
        processedImageUrl.value = URL.createObjectURL(blob)
        processing.value = false
      }, format, 0.92)
    }
    img.src = URL.createObjectURL(compressedFile)
  } catch (error) {
    console.error('调整尺寸失败:', error)
    alert('调整尺寸失败，请重试')
    processing.value = false
  }
}

const convertImage = async () => {
  if (!selectedImage.value) return
  processing.value = true
  
  try {
    const options = {
      maxSizeMB: 10,
      maxWidthOrHeight: 4096,
      useWebWorker: true,
      fileType: targetFormat.value === 'jpg' ? 'image/jpeg' : 
                targetFormat.value === 'png' ? 'image/png' : 'image/webp'
    }
    
    const convertedFile = await imageCompression(selectedImage.value, options)
    processedFileSize.value = convertedFile.size
    processedImageUrl.value = URL.createObjectURL(convertedFile)
  } catch (error) {
    console.error('格式转换失败:', error)
    alert('格式转换失败，请重试')
  } finally {
    processing.value = false
  }
}

const downloadImage = () => {
  if (!processedImageUrl.value) return
  
  const link = document.createElement('a')
  link.href = processedImageUrl.value
  
  const ext = targetFormat.value === 'jpg' ? 'jpg' : targetFormat.value
  const originalName = selectedImage.value.name.replace(/\.[^/.]+$/, '')
  link.download = `${originalName}_processed.${ext}`
  
  link.click()
}

onBeforeUnmount(() => {
  if (cropper.value) {
    cropper.value.destroy()
  }
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
  }
  if (processedImageUrl.value) {
    URL.revokeObjectURL(processedImageUrl.value)
  }
})
</script>
