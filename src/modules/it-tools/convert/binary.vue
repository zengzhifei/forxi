<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      </span>
      文本与二进制转换
    </h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
        <textarea 
          v-model="text" 
          class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono text-sm"
          rows="3"
          placeholder="请输入文本..."
        ></textarea>
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="textToBinary" class="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors">文本转二进制</button>
        <button @click="binaryToText" class="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors">二进制转文本</button>
        <button @click="copy(result)" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">复制</button>
      </div>
      <div v-if="result">
        <label class="block text-sm font-medium text-gray-700 mb-2">结果：</label>
        <textarea 
          :value="result" 
          readonly
          class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
          rows="3"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const toast = inject('toast')

const text = ref('')
const result = ref('')

function textToBinary() {
  result.value = text.value.split('').map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, '0')
  }).join(' ')
}

function binaryToText() {
  try {
    result.value = text.value.trim().split(/\s+/).map(binary => {
      return String.fromCharCode(parseInt(binary, 2))
    }).join('')
  } catch (e) {
    toast.error('二进制格式不正确')
  }
}

async function copy(content) {
  try {
    await navigator.clipboard.writeText(content)
    toast.success('复制成功！')
  } catch (e) {
    toast.error('复制失败')
  }
}
</script>
