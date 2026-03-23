<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </span>
      HTML 实体编码/解码
    </h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">输入</label>
        <textarea 
          v-model="input" 
          class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono text-sm"
          rows="4"
          placeholder="请输入要编码/解码的文本..."
        ></textarea>
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="encode" class="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors">编码</button>
        <button @click="decode" class="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors">解码</button>
        <button @click="copy(output)" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">复制</button>
      </div>
      <div v-if="output">
        <label class="block text-sm font-medium text-gray-700 mb-2">结果：</label>
        <textarea 
          :value="output" 
          readonly
          class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
          rows="4"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const toast = inject('toast')

const input = ref('')
const output = ref('')

function encode() {
  const div = document.createElement('div')
  div.textContent = input.value
  output.value = div.innerHTML
}

function decode() {
  const div = document.createElement('div')
  div.innerHTML = input.value
  output.value = div.textContent || ''
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('复制成功！')
  } catch (e) {
    toast.error('复制失败')
  }
}
</script>
