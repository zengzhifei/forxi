<template>
  <div class="min-h-screen bg-gray-100 text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <h1 class="sr-only">免费在线图片OCR文字识别 - 图片转文字</h1>
        <div class="text-center mb-6" data-snippet>
          <h2 class="text-2xl font-semibold text-zinc-700 mb-2">图片OCR</h2>
          <p class="text-sm text-zinc-400">上传图片自动识别文字</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-6 items-stretch">
          <div class="flex-1 min-w-0 flex flex-col min-h-[400px] sm:min-h-[500px]">
            <div class="bg-white border border-zinc-100 shadow-sm rounded-xl overflow-hidden flex flex-col flex-1">
              <div class="p-3 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between flex-shrink-0">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-zinc-600">图片预览</span>
                  <span v-if="imageInfo" class="text-xs text-zinc-400">{{ imageInfo }}</span>
                </div>
                <button v-if="selectedImage" @click="resetImage" class="px-3 py-1.5 border border-zinc-200 text-zinc-500 hover:bg-zinc-50 rounded-xl text-sm flex items-center space-x-1 transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>更换</span>
                </button>
              </div>

              <div v-if="!selectedImage"
                class="border-2 border-dashed border-zinc-200 m-4 rounded-xl p-8 text-center hover:border-zinc-300 transition-colors cursor-pointer"
                @click="triggerFileInput"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleFileDrop"
                :class="{ 'border-zinc-400 bg-zinc-50': isDragging }"
              >
                <svg class="mx-auto h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="mt-4 text-base font-medium text-zinc-600">点击或拖拽图片到此处</p>
                <p class="mt-2 text-sm text-zinc-400">支持 JPG、PNG、WebP、BMP</p>
                <p class="mt-1 text-xs text-zinc-300">也可直接粘贴（Ctrl+V / Cmd+V）</p>
                <input ref="fileInput" type="file" class="hidden" accept="image/jpeg,image/png,image/gif,image/webp,image/bmp" @change="handleFileSelect">
              </div>

              <div v-else class="p-4 bg-zinc-100 flex flex-col items-center justify-center" :style="{ minHeight: previewHeight + 'px' }">
                <img
                  :src="displayUrl"
                  class="max-w-full max-h-[400px] object-contain select-none block transition-all duration-300"
                  alt="预览图"
                >
                <div class="flex items-center justify-center space-x-3 mt-4">
                  <button
                    @click="rotateImage(-30)"
                    class="px-3 py-1.5 border border-zinc-200 text-zinc-500 hover:bg-zinc-50 rounded-lg text-xs flex items-center space-x-1 transition-colors"
                    :disabled="isRecognizing"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span>-30°</span>
                  </button>
                  <button
                    @click="rotateImage(30)"
                    class="px-3 py-1.5 border border-zinc-200 text-zinc-500 hover:bg-zinc-50 rounded-lg text-xs flex items-center space-x-1 transition-colors"
                    :disabled="isRecognizing"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                    </svg>
                    <span>+30°</span>
                  </button>
                  <button
                    @click="resetRotation"
                    v-if="hasRotated"
                    class="px-3 py-1.5 border border-zinc-200 text-zinc-400 hover:bg-zinc-50 rounded-lg text-xs flex items-center space-x-1 transition-colors"
                    :disabled="isRecognizing"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>复位</span>
                  </button>
                </div>
                <p class="mt-3 text-xs text-zinc-400">文字倒置时请先旋转至正常方向再识别</p>
                <div class="flex items-center justify-between w-full mt-4 px-4">
                  <span class="text-xs text-zinc-500">语言设置</span>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="setAutoLanguage(true)"
                      class="px-3 py-1 text-xs rounded-lg transition-colors"
                      :class="autoLanguage ? 'bg-zinc-700 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'"
                    >
                      自动
                    </button>
                    <button
                      @click="setAutoLanguage(false)"
                      class="px-3 py-1 text-xs rounded-lg transition-colors"
                      :class="!autoLanguage ? 'bg-zinc-700 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'"
                    >
                      手动
                    </button>
                  </div>
                </div>
                <div v-if="!autoLanguage" class="w-full mt-2 px-4">
                  <select
                    v-model="selectedLanguage"
                    class="w-full px-3 py-1.5 text-xs border border-zinc-200 rounded-lg focus:border-zinc-400 focus:outline-none"
                  >
                    <option value="chi_sim+eng">简体中文+英文</option>
                    <option value="chi_sim">简体中文</option>
                    <option value="eng">英文</option>
                    <option value="chi_tra+eng">繁体中文+英文</option>
                    <option value="jpn">日语</option>
                    <option value="kor">韩语</option>
                  </select>
                </div>
              </div>

              <div class="p-3 bg-zinc-50 border-t border-zinc-100">
                <button
                  @click="startRecognition"
                  :disabled="isRecognizing || !selectedImage"
                  class="w-full px-6 py-2.5 text-white text-sm font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center space-x-2"
                  style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
                >
                  <svg v-if="isRecognizing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{{ isRecognizing ? `识别中 ${progress}%` : '开始识别' }}</span>
                </button>
                <div v-if="isRecognizing" class="mt-3">
                  <div class="h-2 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-zinc-400 to-zinc-500 transition-all duration-300 rounded-full"
                      :style="{ width: progress + '%' }"
                    ></div>
                  </div>
                  <p class="mt-1 text-xs text-zinc-400 text-center">{{ statusText }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1 min-w-0 flex flex-col min-h-[400px] sm:min-h-[500px]">
            <div class="bg-white border border-zinc-100 shadow-sm rounded-xl overflow-hidden flex flex-col flex-1">
              <div class="p-3 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between flex-shrink-0">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-zinc-600">识别结果</span>
                  <span v-if="recognitionConfidence > 0 && !isRecognizing" class="text-xs text-zinc-400">准确率 {{ recognitionConfidence }}%</span>
                  <span v-if="detectedLanguage && !isRecognizing" class="text-xs px-2 py-0.5 bg-zinc-100 rounded">{{ detectedLanguage }}</span>
                </div>
                <div v-if="recognizedText && !isRecognizing">
                  <button
                    @click="copyText"
                    class="px-3 py-1 text-white text-xs rounded-lg transition-all hover:opacity-90 flex items-center space-x-1"
                    style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>{{ copySuccess ? '已复制' : '复制' }}</span>
                  </button>
                </div>
              </div>
              <div class="p-4 flex-1 flex items-stretch">
                <div v-if="isRecognizing" class="flex-1 flex items-center justify-center">
                  <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-zinc-300 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p class="mt-2 text-sm text-zinc-400">正在识别中...</p>
                  </div>
                </div>
                <div v-else-if="recognitionError" class="flex-1 flex items-center justify-center">
                  <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p class="mt-2 text-sm text-red-500">{{ recognitionError }}</p>
                  </div>
                </div>
                <div v-else-if="recognizedText || (!isRecognizing && !recognitionError)" class="flex-1 flex items-stretch">
                  <textarea
                    v-model="recognizedText"
                    class="w-full h-full p-3 border border-zinc-200 rounded-xl text-sm text-zinc-600 resize-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:outline-none"
                    placeholder="识别结果将显示在这里，支持手动编辑..."
                  ></textarea>
                </div>
                <div v-else class="flex-1 flex items-center justify-center">
                  <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="mt-2 text-sm text-zinc-400">点击上方按钮开始识别</p>
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
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const toast = inject('toast')

const fileInput = ref(null)
const resultTextarea = ref(null)
const selectedImage = ref(null)
const previewUrl = ref('')
const displayUrl = ref('')
const hasRotated = ref(false)
const isDragging = ref(false)
const isRecognizing = ref(false)
const progress = ref(0)
const statusText = ref('')
const recognizedText = ref('')
const recognitionError = ref('')
const recognitionConfidence = ref(0)
const detectedLanguage = ref('')
const copySuccess = ref(false)
const imageWidth = ref(0)
const imageHeight = ref(0)

const previewHeight = computed(() => 300)

const imageInfo = computed(() => {
  if (!imageWidth.value || !imageHeight.value) return ''
  return `${imageWidth.value} × ${imageHeight.value}`
})

const autoLanguage = ref(true)
const selectedLanguage = ref('chi_sim+eng')

const languageNames = {
  'chi_sim+eng': '简体中文+英文',
  'chi_sim': '简体中文',
  'chi_tra+eng': '繁体中文+英文',
  'eng': '英文',
  'jpn': '日语',
  'kor': '韩语'
}

const setAutoLanguage = (auto) => {
  autoLanguage.value = auto
}

const languages = [
  { code: 'chi_sim+eng', name: '简体中文+英文' },
  { code: 'chi_sim', name: '简体中文' },
  { code: 'eng', name: '英文' },
  { code: 'chi_tra+eng', name: '繁体中文+英文' },
  { code: 'jpn', name: '日语' },
  { code: 'kor', name: '韩语' }
]

const triggerFileInput = () => fileInput.value?.click()

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) loadImage(file)
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    loadImage(file)
  } else {
    toast.error('请上传图片文件')
  }
}

const loadImage = (file) => {
  selectedImage.value = file
  previewUrl.value = URL.createObjectURL(file)
  displayUrl.value = previewUrl.value
  hasRotated.value = false
  recognizedText.value = ''
  recognitionError.value = ''
  recognitionConfidence.value = 0
  detectedLanguage.value = ''
  statusText.value = ''

  const img = new Image()
  img.onload = () => {
    imageWidth.value = img.width
    imageHeight.value = img.height
  }
  img.src = previewUrl.value
}

const resetImage = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  selectedImage.value = null
  previewUrl.value = ''
  displayUrl.value = ''
  imageWidth.value = 0
  imageHeight.value = 0
  hasRotated.value = false
  recognizedText.value = ''
  recognitionError.value = ''
  recognitionConfidence.value = 0
  detectedLanguage.value = ''
  progress.value = 0
  statusText.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const currentRotation = ref(0)

const rotateImageData = (imageUrl, degrees, imgWidth, imgHeight) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      const absDegrees = Math.abs(degrees)
      if (absDegrees === 90 || absDegrees === 270 || absDegrees === 180) {
        canvas.width = img.height
        canvas.height = img.width
      } else {
        canvas.width = img.width
        canvas.height = img.height
      }

      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((degrees * Math.PI) / 180)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      resolve(canvas.toDataURL('image/png'))
    }
    img.src = imageUrl
  })
}

const rotateImage = async (degrees) => {
  hasRotated.value = true
  currentRotation.value += degrees
  const rotatedUrl = await rotateImageData(previewUrl.value, currentRotation.value)
  displayUrl.value = rotatedUrl
}

const resetRotation = async () => {
  hasRotated.value = false
  currentRotation.value = 0
  displayUrl.value = previewUrl.value
}

const recognizeWithLanguage = async (imageSource, lang) => {
  const Tesseract = await import('tesseract.js')
  const result = await Tesseract.recognize(imageSource, lang, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        statusText.value = languageNames[lang] || lang
      }
    }
  })
  return result
}

const startRecognition = async () => {
  if (!selectedImage.value) return

  isRecognizing.value = true
  progress.value = 0
  statusText.value = '识别中...'
  recognizedText.value = ''
  recognitionError.value = ''
  detectedLanguage.value = ''
  recognitionConfidence.value = 0

  try {
    if (autoLanguage.value) {
      progress.value = 0
      statusText.value = '自动检测语言...'

      let bestResult = null
      let bestConfidence = 0
      let bestLang = ''

      for (let i = 0; i < languages.length; i++) {
        const lang = languages[i]
        progress.value = Math.round((i / languages.length) * 90)
        statusText.value = `检测: ${lang.name}...`

        try {
          const result = await recognizeWithLanguage(displayUrl.value, lang.code)
          const confidence = Math.round(result.data.confidence)
          const text = result.data.text.trim()

          if (confidence > bestConfidence && text.length > 0) {
            bestConfidence = confidence
            bestResult = text
            bestLang = lang.name
          }
        } catch (e) {
          console.warn(`语言 ${lang.code} 识别失败:`, e)
        }
      }

      progress.value = 100
      statusText.value = '完成'

      if (bestResult) {
        recognizedText.value = bestResult
        recognitionConfidence.value = bestConfidence
        detectedLanguage.value = bestLang
        toast.success('识别成功！')
      } else {
        recognitionError.value = '未能识别到文字，请尝试旋转至正确方向或更换图片'
      }
    } else {
      const Tesseract = await import('tesseract.js')

      progress.value = 10
      statusText.value = '加载模型...'

      const result = await Tesseract.recognize(displayUrl.value, selectedLanguage.value, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            progress.value = Math.round(10 + m.progress * 80)
            statusText.value = '识别中...'
          } else if (m.status === 'loading language traineddata') {
            statusText.value = '加载语言包...'
          } else if (m.status === 'initializing api') {
            statusText.value = '初始化...'
          }
        }
      })

      progress.value = 100
      statusText.value = '完成'

      recognizedText.value = result.data.text.trim()
      recognitionConfidence.value = Math.round(result.data.confidence)
      detectedLanguage.value = languageNames[selectedLanguage.value]

      if (!recognizedText.value) {
        recognitionError.value = '未能识别到文字，请尝试旋转至正确方向或更换图片'
      } else {
        toast.success('识别成功！')
      }
    }
  } catch (err) {
    console.error('OCR 识别失败:', err)
    recognitionError.value = `识别失败: ${err.message || '请重试'}`
    toast.error('识别失败')
  } finally {
    isRecognizing.value = false
  }
}

const copyText = async () => {
  if (!recognizedText.value) return

  try {
    await navigator.clipboard.writeText(recognizedText.value)
    copySuccess.value = true
    toast.success('已复制到剪贴板')
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    resultTextarea.value?.select()
    document.execCommand('copy')
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
}

const handlePaste = async (event) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      event.preventDefault()
      const file = item.getAsFile()
      if (file) {
        loadImage(file)
      }
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('paste', handlePaste)
})

onBeforeUnmount(() => {
  window.removeEventListener('paste', handlePaste)
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>
