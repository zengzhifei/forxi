<template>
  <div class="min-h-screen bg-[#fafafa] text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div
          class="bg-white rounded-2xl shadow-sm border border-zinc-100 p-4 sm:p-8 overflow-hidden flex flex-col"
          :class="{ 'fixed inset-0 z-50 rounded-none': isFullscreen }"
          :style="{ height: isFullscreen ? '100dvh' : 'auto', minHeight: isMobile ? '60vh' : '500px' }"
        >
          <div class="hidden lg:flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-100">
              <svg class="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-zinc-700">聊一聊</h2>
              <p class="text-sm text-zinc-400">智能对话，解答你的问题</p>
            </div>
          </div>

          <div class="space-y-5">
            <div class="flex gap-3 items-end">
              <div class="flex-1">
                <label class="block text-sm font-semibold text-zinc-600 mb-2">模型</label>
                <SearchSelect
                  v-model="chatModel"
                  :options="models"
                  placeholder="选择模型"
                />
              </div>
              <button
                v-if="isMobile"
                @click="toggleFullscreen"
                class="px-3 py-3 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
                :title="isFullscreen ? '退出全屏' : '全屏'"
              >
                <svg v-if="!isFullscreen" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              </button>
              <button @click="clearChat" class="px-4 py-3 bg-zinc-500 hover:bg-zinc-600 text-white text-sm font-medium rounded-xl transition-all hover:shadow-md hover:shadow-zinc-300/40">
                新对话
              </button>
            </div>
          </div>

          <div ref="scrollContainer" class="flex-1 overflow-y-auto py-6 space-y-4">
            <div v-if="chatMessages.length === 0" class="flex flex-col items-center justify-center h-full text-zinc-300 py-20">
              <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p class="text-base text-zinc-400">开始一段对话吧</p>
            </div>

            <div v-for="(msg, index) in chatMessages" :key="index" class="flex gap-3 group">
              <template v-if="msg.role === 'user'">
                <div class="ml-auto max-w-[70%]">
                  <div class="relative inline-block">
                    <button
                      @click="resendMessage(msg.content)"
                      class="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-zinc-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="重发"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </button>
                    <div class="px-4 py-2.5 rounded-2xl whitespace-pre-wrap text-white text-sm" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
                      {{ msg.content }}
                    </div>
                  </div>
                </div>
                <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
                  <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </template>
              <template v-else>
                <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100">
                  <svg class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="px-4 py-2.5 rounded-2xl max-w-[70%] bg-white text-zinc-700 text-sm border border-zinc-100 shadow-none">
                  <div class="markdown-content" v-html="parseMarkdown(msg.content)" contenteditable="false"></div><span v-if="chatLoading && index === chatMessages.length - 1" class="inline-block w-0.5 h-4 bg-zinc-400 animate-pulse ml-0.5"></span>
                </div>
              </template>
            </div>
          </div>

          <div class="pt-4 border-t border-zinc-100 pb-safe">
            <div class="flex gap-3 min-w-0">
              <input
                v-model="chatInput"
                @keydown.enter="handleEnterKey"
                type="text"
                placeholder="输入消息..."
                class="flex-1 px-4 py-2 text-base border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 bg-zinc-50 focus:bg-white text-zinc-700 placeholder-zinc-300"
                :disabled="chatLoading"
                ref="inputRef"
              />
              <button
                @click="sendChatMessage"
                :disabled="!chatModel || !chatInput?.trim() || chatLoading"
                class="px-4 py-1.5 bg-zinc-500 hover:bg-zinc-600 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center hover:shadow-md hover:shadow-zinc-300/40"
              >
                <svg v-if="chatLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-else>发送</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted, inject } from 'vue'
import { api } from '@/utils/api'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import SearchSelect from '../components/SearchSelect.vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/common'

const toast = inject('toast')

const chatMessages = ref([])
const chatInput = ref('')
const chatLoading = ref(false)
const chatModel = ref('')
const chatSummary = ref('')
const chatRoundCount = ref(0)

const models = ref([])
const scrollContainer = ref(null)
const inputRef = ref(null)
const isMobile = ref(false)
const isFullscreen = ref(false)

const copyCode = async (btn) => {
  const wrapper = btn.closest('.code-block-wrapper')
  const code = wrapper.querySelector('code')
  if (code) {
    const text = code.textContent
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    btn.textContent = '已复制'
    setTimeout(() => btn.textContent = '复制', 2000)
  }
}

window.copyCode = copyCode

const md = new MarkdownIt({
  breaks: true,
  html: false,
  linkify: true,
  highlight: (str, lang) => {
    let highlighted
    if (lang && hljs.getLanguage(lang)) {
      try {
        highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
      } catch (_) {
        highlighted = md.utils.escapeHtml(str)
      }
    } else {
      try {
        highlighted = hljs.highlightAuto(str).value
      } catch (_) {
        highlighted = md.utils.escapeHtml(str)
      }
    }
    return `<div class="code-block-wrapper"><pre class="hljs"><code class="language-${lang || ''}">${highlighted}</code></pre><button class="copy-btn" onclick="copyCode(this)">复制</button></div>`
  }
})

const parseMarkdown = (content) => {
  if (!content) return ''
  return md.render(content)
}

const handleEnterKey = (e) => {
  if (e.isComposing) return
  sendChatMessage()
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 640
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  document.body.style.overflow = isFullscreen.value ? 'hidden' : ''
}

const loadModels = () => {
  api.getAiModels('text-generation').then(data => {
    models.value = data.models || []
    if (models.value.length > 0) {
      chatModel.value = models.value[0].id
    }
  }).catch(err => {
    console.error('获取模型列表失败:', err)
  })
}

onMounted(() => {
  loadModels()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.body.style.overflow = ''
})

watch(chatMessages, async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}, { deep: true })

const resendMessage = (content) => {
  chatInput.value = content
  inputRef.value?.focus()
}

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

    if (!response.ok) {
      const data = await response.json()
      chatMessages.value[chatMessages.value.length - 1].content = data.message || '请求失败'
      chatLoading.value = false
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let currentEvent = ''
    let dataLines = []
    let isDone = false

    while (!isDone) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim() === '') {
          if (currentEvent === 'done') {
            isDone = true
            break
          }
          if (dataLines.length > 0 && currentEvent === 'message') {
            const text = dataLines.join('\n')
            chatMessages.value[chatMessages.value.length - 1].content += text
          }
          currentEvent = ''
          dataLines = []
          continue
        }

        if (line.startsWith('event:')) {
          currentEvent = line.slice(6).trim()
        } else if (line.startsWith('data:')) {
          dataLines.push(line.slice(5))
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

    if (response.status === 429) throw new Error('请求过于频繁，请稍后再试。')
    if (!response.ok) throw new Error('请求失败')

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
</script>
