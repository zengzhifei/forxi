<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 lg:hidden">
        <h1 class="text-xl font-bold text-gray-800">AI趣玩</h1>
      </div>
      <div class="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-6">
          <div class="w-full lg:w-64 flex-shrink-0">
            <div class="bg-white rounded-2xl shadow-lg p-2 lg:p-4 sticky top-16 lg:top-20 z-10">
              <h3 class="hidden lg:block text-lg font-bold text-gray-800 mb-4 px-3">AI趣玩</h3>
              <div class="flex lg:flex-col gap-1 lg:space-y-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                <button 
                  v-for="item in menuItems" 
                  :key="item.id"
                  @click="activeMenu = item.id"
                  class="flex-shrink-0 text-left px-4 py-2 lg:py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                  :class="activeMenu === item.id ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
                >
                  <span v-html="item.icon" class="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0"></span>
                  <span>{{ item.name }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <Text2Image 
              v-if="activeMenu === 'text2image'"
              v-model:prompt="prompt"
              v-model:negativePrompt="negativePrompt"
              v-model:selectedModel="selectedModel"
              v-model:size="size"
              :models="models"
              :generating="generating"
              :generatedImage="generatedImage"
              :error="error"
              :progress="progress"
              @generate="generateImage"
              @download="downloadImage"
              @regenerate="generateNewSamePrompt"
            />

            <Image2Image 
              v-if="activeMenu === 'image2image'"
              v-model:prompt="prompt"
              v-model:negativePrompt="negativePrompt"
              v-model:selectedModel="selectedModel"
              v-model:size="size"
              v-model:inputImageFile="inputImageFile"
              v-model:previewInputImage="previewInputImage"
              v-model:isDragging="isDragging"
              :models="models"
              :generating="generating"
              :generatedImage="generatedImage"
              :error="error"
              :progress="progress"
              @generate="generateImage"
              @download="downloadImage"
              @regenerate="generateNewSamePrompt"
              @fileChange="handleFileChange"
              @fileInputRef="(el) => fileInput = el"
              @drop="handleDrop"
              @clickUpload="fileInput?.click()"
              @clearImage="clearInputImage"
            />

            <div v-if="activeMenu === 'chat'" class="space-y-6">
              <Chat 
                v-model:model="chatModel"
                v-model:input="chatInput"
                :models="models"
                :messages="chatMessages"
                :loading="chatLoading"
                @send="sendChatMessage"
                @clearChat="clearChat"
                @resend="resendMessage"
                ref="chatComponentRef"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <button 
      v-if="activeMenu !== 'chat'"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
      :class="{ 'opacity-100': showBackToTop, 'opacity-0 pointer-events-none': !showBackToTop }"
    >
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, watch } from 'vue'
import { api } from '@/utils/api'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { Text2Image, Image2Image, Chat } from '../modules/ai'

const toast = inject('toast')

const menuItems = [
  { 
    id: 'chat', 
    name: '聊一聊', 
    icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>'
  },
  { 
    id: 'text2image', 
    name: '文生图', 
    icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>'
  },
  { 
    id: 'image2image', 
    name: '图生图', 
    icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
  }
]

const activeMenu = ref('chat')
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
const taskStatus = ref('')
const progress = ref(0)
const showBackToTop = ref(false)

const chatMessages = ref([])
const chatInput = ref('')
const chatLoading = ref(false)
const chatModel = ref('')
const chatSummary = ref('')
const chatRoundCount = ref(0)
const chatComponentRef = ref(null)

let pollTimer = null
const models = ref([])

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const resendMessage = async (content) => {
  chatInput.value = content
  if (chatComponentRef.value?.inputRef) {
    chatComponentRef.value.inputRef.focus()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  const hash = window.location.hash.slice(1)
  const initialMenu = hash && menuItems.some(item => item.id === hash) ? hash : 'chat'
  activeMenu.value = initialMenu
  loadModelsForMenu(initialMenu)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const loadModelsForMenu = (menu) => {
  const taskMap = {
    'chat': 'text-generation',
    'text2image': 'text-to-image-synthesis',
    'image2image': 'image-to-image'
  }
  const task = taskMap[menu]
  if (!task) return
  
  api.getAiModels(task).then(data => {
    models.value = data.models || []
    if (models.value.length > 0) {
      if (menu === 'chat') {
        chatModel.value = models.value[0].id
      } else {
        selectedModel.value = models.value[0].id
      }
    }
  }).catch(err => {
    console.error('获取模型列表失败:', err)
  })
}

watch(activeMenu, (newVal, oldVal) => {
  if (!oldVal) return
  
  window.location.hash = newVal
  generatedImage.value = null
  error.value = null
  prompt.value = ''
  negativePrompt.value = ''
  selectedModel.value = ''
  size.value = '1024x1024'
  previewInputImage.value = ''
  inputImageFile.value = null
  cancelGeneration(false)
  
  if (newVal === 'chat') {
    clearChat()
  }
  
  loadModelsForMenu(newVal)
})

const sendChatMessage = async () => {
  if (!chatModel.value) {
    toast.error('请先选择模型')
    return
  }
  if (!chatInput.value.trim() || chatLoading.value) return
  
  const userMessage = chatInput.value.trim()
  chatInput.value = ''
  
  chatMessages.value.push({ role: 'user', content: userMessage })
  chatMessages.value.push({ role: 'assistant', content: '' })
  
  chatLoading.value = true
  chatRoundCount.value++
  
  const systemPrompt = `
你是一个 AI 技术助理。
- 回答问题时使用简明、专业的中文
- 输出示例代码时使用 Markdown 代码块，并指定语言
- 多行代码必须保留换行，不要用空格代替
- 请在回答中，用 <NL> 表示换行，不要直接换行
- 如果回答涉及列表，保证每一项单独占一行
- 不要在 JSON 或代码块里加入解释文字
- 如果无法准确回答，说明原因，不要编造内容
`
  
  let messages = []
  if (chatSummary.value) {
    const recentMessages = chatMessages.value.slice(-chatRoundCount.value * 2).slice(0, -1)
    messages = [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: `历史对话摘要：${chatSummary.value}` },
      ...recentMessages.map(m => ({ role: m.role, content: m.content }))
    ]
  } else {
    const prevMessages = chatMessages.value.slice(0, -1)
    messages = [
      { role: 'system', content: systemPrompt },
      ...prevMessages.map(m => ({ role: m.role, content: m.content }))
    ]
  }
  
  try {
    const response = await api.chat({
      model: chatModel.value,
      messages
    })
    
    if (response.status === 429) {
      chatMessages.value[chatMessages.value.length - 1].content = '模型配额已用完，请更换模型重试'
      chatLoading.value = false
      return
    }
    if (!response.ok) {
      throw new Error('请求失败')
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let currentEvent = ''
    let currentData = ''
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const text = decoder.decode(value, { stream: true })
      const lines = text.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('event:')) {
          currentEvent = line.slice(6).trim()
        } else if (line.startsWith('data:')) {
          currentData = line.slice(5).replace(/<NL>/g, "\n")
          if (currentData === "") {
            currentData = "\n"
          }
          if (currentEvent === 'message') {
            try {
              const parsed = JSON.parse(currentData)
              chatMessages.value[chatMessages.value.length - 1].content += parsed.message || parsed.content || ''
            } catch (e) {
              chatMessages.value[chatMessages.value.length - 1].content += currentData
            }
          } else if (currentEvent === 'done') {
            break
          }
        }
      }
    }
  } catch (err) {
    chatMessages.value[chatMessages.value.length - 1].content = '抱歉，发生错误，请重试。'
    console.error('聊天错误:', err)
  } finally {
    chatLoading.value = false
    
    if (chatRoundCount.value >= 15) {
      let tempCurrentChatRound = chatRoundCount.value
      chatRoundCount.value = 0
      await summarizeChat(tempCurrentChatRound)
    }
  }
}

const summarizeChat = async (currentChatRound) => {
  if (!chatModel.value) return
  
  const historyText = chatMessages.value
    .slice(-currentChatRound * 2)
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'user' ? '用户' : '助手'}: ${m.content}`)
    .join('\n')
  
  const prompt = `你是一个对话摘要助手。
任务：
请总结用户和助手之间的历史对话。
总结要求：
1. 必须包含用户的目标和需求
2. 必须包含助手(AI)已经给出的关键方案、结论
3. 删除无关寒暄、重复解释和无价值内容
4. 禁止编造对话中不存在的信息
5. 保持客观、简洁
6.后续对话遗忘本次总结对话摘要的请求记忆

输出格式(必须严格按照以下结构):
用户目标:
关键需求:
AI已提供方案:
当前进展:
未解决问题:

以下是对话内容：\n${chatSummary.value ? '【上一次摘要】\n' + chatSummary.value + '\n【新对话】\n' : ''}${historyText}
`

  try {
    const response = await api.chat({
      model: chatModel.value,
      messages: [
        { role: 'system', content: '你是一个对话摘要助手。' },
        { role: 'user', content: prompt }
      ]
    })
    
    if (response.status === 429) {
      throw new Error('请求过于频繁，请稍后再试。')
    }
    if (!response.ok) {
      throw new Error('请求失败')
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let summary = ''
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const text = decoder.decode(value)
      const lines = text.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('event:')) continue
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          if (data === '[DONE]' || !data) continue
          try {
            const parsed = JSON.parse(data)
            summary += parsed.message || parsed.content || ''
          } catch (e) {
            summary += data
          }
        }
      }
    }
    
    chatSummary.value = summary.trim()
  } catch (err) {
    console.error('摘要生成失败:', err)
  }
}

const clearChat = () => {
  chatMessages.value = []
  chatSummary.value = ''
  chatRoundCount.value = 0
}

const generateImage = async () => {
  if (!prompt.value.trim()) {
    toast.error('请输入提示词')
    return
  }

  if (!selectedModel.value) {
    toast.error('请选择模型')
    return
  }

  if (activeMenu.value === 'image2image' && !inputImageFile.value) {
    toast.error('请上传图片')
    return
  }

  generating.value = true
  error.value = null
  generatedImage.value = null
  progress.value = 0
  taskStatus.value = 'PROCESSING'

  try {
    let result
    if (activeMenu.value === 'text2image') {
      result = await api.text2image({
        prompt: prompt.value,
        model: selectedModel.value,
        size: size.value,
        negative_prompt: negativePrompt.value
      })
    } else {
      result = await api.image2image({
        prompt: prompt.value,
        model: selectedModel.value,
        file: inputImageFile.value,
        negative_prompt: negativePrompt.value,
        size: size.value
      })
    }

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
    toast.error(error.value)
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

const cancelGeneration = (showToast = true) => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
  taskId.value = null
  taskStatus.value = ''
  progress.value = 0
  generating.value = false
  if (showToast) {
    toast.info('已取消生成')
  }
}

const generateNewSamePrompt = async () => {
  await generateImage()
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
