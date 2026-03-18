<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col" :style="{ height: isMobile ? 'calc(100vh - 280px)' : 'calc(100vh - 200px)', minHeight: isMobile ? '400px' : '500px' }">
    <div class="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div class="hidden sm:block">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800">AI 对话</h2>
          <p class="text-sm text-gray-500">智能对话，解答你的问题</p>
        </div>
        <div class="sm:hidden">
          <span class="text-base font-bold text-gray-800">AI</span>
        </div>
      </div>
      <button @click="emit('clearChat')" class="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        新对话
      </button>
    </div>
    
    <div class="px-2 sm:px-4 py-2 bg-gray-50 border-b border-gray-100">
      <div class="flex items-center gap-2">
        <span class="text-xs sm:text-sm text-gray-600 whitespace-nowrap">模型:</span>
        <select 
          :value="model" 
          @change="emit('update:model', $event.target.value)"
          class="flex-1 min-w-0 px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white truncate"
        >
          <option value="" disabled>选择模型</option>
          <option v-for="m in models" :key="m.id" :value="m.id" class="truncate">
            {{ m.display_name }}
          </option>
        </select>
      </div>
    </div>
    
    <div ref="scrollContainer" class="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
      <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-sm sm:text-base">开始一段对话吧</p>
      </div>
      
      <div v-for="(msg, index) in messages" :key="index" class="flex gap-2 sm:gap-3 group">
        <template v-if="msg.role === 'user'">
          <div class="ml-auto max-w-[75%] sm:max-w-[70%]">
            <div class="relative inline-block">
              <button 
                @click="emit('resend', msg.content)"
                class="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
                title="重发"
              >
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <div class="px-3 py-2 sm:px-4 sm:py-2 rounded-2xl whitespace-pre-wrap bg-blue-500 text-white text-sm sm:text-base">
                {{ msg.content }}
              </div>
            </div>
          </div>
          <div class="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-blue-500">
            <svg class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </template>
        <template v-else>
          <div class="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-purple-500">
            <svg class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="px-3 py-2 sm:px-4 sm:py-2 rounded-2xl whitespace-pre-wrap max-w-[75%] sm:max-w-[70%] bg-gray-100 text-gray-800 text-sm sm:text-base">
            {{ msg.content }}<span v-if="loading && index === messages.length - 1" class="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1"></span>
          </div>
        </template>
      </div>
    </div>
    
    <div class="p-2 sm:p-4 border-t border-gray-100">
      <div class="flex gap-2">
        <input 
          :value="input"
          @input="emit('update:input', $event.target.value)"
          @keyup.enter="emit('send')"
          type="text"
          placeholder="输入消息..."
          class="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          :disabled="loading"
          ref="inputRef"
        />
        <button 
          @click="emit('send')"
          :disabled="!model || !input?.trim() || loading"
          class="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <svg v-if="loading" class="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-else class="text-sm sm:text-base">发送</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  models: Array,
  model: String,
  messages: Array,
  input: String,
  loading: Boolean
})

const emit = defineEmits([
  'update:model',
  'update:input',
  'send',
  'clearChat',
  'resend',
  'scrollToBottom'
])

const scrollContainer = ref(null)
const inputRef = ref(null)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

watch(() => props.messages, async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}, { deep: true })

defineExpose({
  inputRef
})
</script>
