<template>
  <div class="min-h-screen bg-[#fafafa] text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div class="space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 sm:p-8">
            <div class="hidden lg:flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-100">
                <svg class="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-zinc-700">图生图</h2>
                <p class="text-sm text-zinc-400">上传图片并描述变化，AI 帮你改造图片</p>
              </div>
            </div>

            <div class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-zinc-600 mb-2">
                  输入图片 <span class="text-red-500">*</span>
                </label>

                <div
                  class="border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer"
                  :class="isDragging ? 'border-zinc-400 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                  @click="fileInput?.click()"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileChange"
                  />
                  <div v-if="!inputImageFile && !previewInputImage">
                    <svg class="mx-auto h-12 w-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="mt-2 text-sm text-zinc-500">点击或拖拽图片到这里</p>
                    <p class="text-xs text-zinc-400 mt-1">支持 JPG、PNG 格式，最大 5MB</p>
                  </div>
                  <div v-else class="flex items-center justify-center gap-4">
                    <img :src="previewInputImage" class="max-w-[200px] max-h-[150px] rounded-lg object-contain" />
                    <button
                      @click.stop="clearInputImage"
                      class="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-zinc-600 mb-2">
                  提示词 <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="prompt"
                  rows="4"
                  maxlength="2000"
                  class="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:outline-none resize-none transition-all bg-zinc-50 focus:bg-white text-zinc-700 placeholder-zinc-300"
                  placeholder="描述你想要的图片变化，如：将背景换成蓝天白云，给衣服添加花纹..."
                ></textarea>
                <div class="text-right text-xs text-zinc-400 mt-1">{{ prompt?.length || 0 }}/2000</div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-zinc-600 mb-2">
                  负面提示词
                  <span class="text-zinc-400 font-normal">(可选)</span>
                </label>
                <input
                  v-model="negativePrompt"
                  type="text"
                  maxlength="2000"
                  class="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:outline-none transition-all bg-zinc-50 focus:bg-white text-zinc-700 placeholder-zinc-300"
                  placeholder="不想出现的元素，如：模糊、变形、低质量..."
                >
                <div class="text-right text-xs text-zinc-400 mt-1">{{ negativePrompt?.length || 0 }}/2000</div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-zinc-600 mb-2">模型</label>
                  <SearchSelect
                    v-model="selectedModel"
                    :options="models"
                    placeholder="选择模型"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-zinc-600 mb-2">尺寸</label>
                  <select v-model="size" class="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:outline-none bg-white text-zinc-700">
                    <option value="1024x1024">1024×1024</option>
                    <option value="1152x864">1152×864</option>
                    <option value="1216x832">1216×832</option>
                    <option value="1344x768">1344×768</option>
                    <option value="832x1216">832×1216</option>
                    <option value="768x1344">768×1344</option>
                  </select>
                </div>
              </div>

              <button
                @click="generateImage"
                :disabled="!prompt?.trim() || !inputImageFile || !selectedModel || generating"
                class="w-full py-4 px-6 bg-zinc-500 hover:bg-zinc-600 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-zinc-300/40 hover:scale-[1.01]"
              >
                <span v-if="generating">AI 处理中...</span>
                <span v-else>✨ 开始改造</span>
              </button>
            </div>
          </div>

          <div v-if="generating" id="result-section" class="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
            <div class="p-6">
              <div class="flex justify-center items-center min-h-[400px] bg-zinc-50 rounded-xl">
                <div class="text-center">
                  <div class="relative w-32 h-32 mx-auto mb-4">
                    <svg class="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="#e4e4e7" stroke-width="8" fill="none"/>
                      <circle cx="64" cy="64" r="56" stroke="#52525b" stroke-width="8" fill="none" stroke-linecap="round"
                        :stroke-dasharray="351.86" :stroke-dashoffset="351.86 - (351.86 * progress / 100)"
                        class="transition-all duration-500"/>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span class="text-2xl font-bold text-zinc-600">{{ progress }}%</span>
                    </div>
                  </div>
                  <p class="text-zinc-500">正在生成中，请稍后...</p>
                </div>
              </div>
            </div>
          </div>

          <transition name="fade-slide">
            <div v-if="generatedImage" class="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
              <div class="bg-zinc-50 px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                <h3 class="font-semibold text-zinc-700 flex items-center gap-2">
                  <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  生成完成
                </h3>
                <span class="text-sm text-zinc-400">{{ currentTime }}</span>
              </div>
              <div class="p-6">
                <div class="flex flex-col md:flex-row gap-6 items-center justify-center">
                  <div v-if="previewInputImage" class="text-center">
                    <p class="text-sm font-medium text-zinc-500 mb-2">原图</p>
                    <img :src="previewInputImage" class="max-w-[250px] max-h-[250px] rounded-lg shadow-md object-contain" />
                  </div>
                  <div v-if="previewInputImage" class="hidden md:block text-zinc-300">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <div class="relative group">
                    <img :src="generatedImage" class="max-w-full max-h-[400px] rounded-xl shadow-md" />
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-4">
                      <a
                        :href="generatedImage"
                        target="_blank"
                        class="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                      >
                        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <button @click="downloadImage" class="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30">
                        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-center">
                  <button
                    @click="generateImage"
                    class="px-6 py-3 bg-zinc-500 hover:bg-zinc-600 text-white font-medium rounded-xl flex items-center gap-2 transition-all hover:shadow-md hover:shadow-zinc-300/40 hover:scale-[1.01]"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    重新生成
                  </button>
                </div>
              </div>
            </div>
          </transition>

          <transition name="fade-slide">
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-red-800">生成失败</h4>
                <p class="text-sm text-red-600 mt-1">{{ error }}</p>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { api } from '@/utils/api'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import SearchSelect from '../components/SearchSelect.vue'

const toast = inject('toast')

const prompt = ref('')
const negativePrompt = ref('')
const selectedModel = ref('')
const size = ref('1024x1024')
const inputImageFile = ref(null)
const previewInputImage = ref('')
const isDragging = ref(false)
const fileInput = ref(null)
const generating = ref(false)
const generatedImage = ref(null)
const error = ref(null)
const taskId = ref(null)
const progress = ref(0)

const models = ref([])

let pollTimer = null

const currentTime = computed(() => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const loadModels = () => {
  api.getAiModels('image-to-image').then(data => {
    models.value = data.models || []
    if (models.value.length > 0) {
      selectedModel.value = models.value[0].id
    }
  }).catch(err => {
    console.error('获取模型列表失败:', err)
  })
}

onMounted(() => {
  loadModels()
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

const generateImage = async () => {
  if (!prompt.value.trim()) {
    toast.error('请输入提示词')
    return
  }

  if (!selectedModel.value) {
    toast.error('请选择模型')
    return
  }

  if (!inputImageFile.value) {
    toast.error('请上传图片')
    return
  }

  generating.value = true
  error.value = null
  generatedImage.value = null
  progress.value = 0

  try {
    const result = await api.image2image({
      prompt: prompt.value,
      model: selectedModel.value,
      file: inputImageFile.value,
      negative_prompt: negativePrompt.value,
      size: size.value
    })

    if (result.taskId) {
      taskId.value = result.taskId
      toast.info('任务已提交，开始生成...')
      startPolling()
      setTimeout(() => {
        const resultSection = document.getElementById('result-section')
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      error.value = '任务提交失败'
      toast.error('任务提交失败')
      generating.value = false
    }
  } catch (err) {
    error.value = err.message || '生成失败，请重试'
    generating.value = false
  }
}

const startPolling = () => {
  if (pollTimer) clearInterval(pollTimer)

  progress.value = 1

  pollTimer = setInterval(async () => {
    if (!taskId.value) {
      clearInterval(pollTimer)
      return
    }

    try {
      const result = await api.queryTask(taskId.value)
      if (result.task_status === 'SUCCEED') {
        progress.value = 100
        clearInterval(pollTimer)
        if (result.output_images && result.output_images.length > 0) {
          generatedImage.value = result.output_images[0]
          toast.success('图片生成成功！')
        } else {
          error.value = '未生成图片'
        }
        generating.value = false
      } else if (result.task_status === 'FAILED') {
        clearInterval(pollTimer)
        error.value = result.message || '生成失败'
        toast.error(error.value)
        generating.value = false
      } else {
        if (progress.value < 90) {
          const randomIncrement = Math.floor(Math.random() * 4) + 3
          progress.value = Math.min(progress.value + randomIncrement, 90)
        } else if (progress.value < 99) {
          const slowIncrement = Math.floor(Math.random() * 2) + 1
          progress.value = Math.min(progress.value + slowIncrement, 99)
        }
      }
    } catch (err) {
      clearInterval(pollTimer)
      error.value = err.message || '查询任务状态失败'
      generating.value = false
    }
  }, 5000)
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB')
      return
    }
    inputImageFile.value = file
    previewInputImage.value = URL.createObjectURL(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB')
      return
    }
    inputImageFile.value = file
    previewInputImage.value = URL.createObjectURL(file)
  } else {
    toast.error('请上传图片文件')
  }
}

const clearInputImage = () => {
  if (previewInputImage.value && previewInputImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewInputImage.value)
  }
  inputImageFile.value = null
  previewInputImage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const downloadImage = async () => {
  if (!generatedImage.value) return

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const fileName = `ai-image-${Date.now()}.png`

  if (isMobile) {
    try {
      const response = await fetch(generatedImage.value)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fileName
      link.click()

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl)
      }, 1000)
    } catch (err) {
      window.open(generatedImage.value, '_blank')
    }
  } else {
    try {
      const response = await fetch(generatedImage.value)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      const link = document.createElement('a')
      link.href = generatedImage.value
      link.download = fileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
