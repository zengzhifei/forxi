<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </span>
      UUID 生成
    </h3>
    <div class="flex gap-3 mb-4">
      <button @click="generate" class="flex-1 py-3 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-all font-medium flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        生成 UUID
      </button>
      <button @click="copy" :disabled="!output" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium disabled:opacity-50">复制</button>
    </div>
    <div v-if="output" class="mt-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">生成的 UUID：</label>
      <input 
        type="text" 
        :value="output" 
        readonly
        class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-lg tracking-wider text-center"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const toast = inject('toast')

const output = ref('')

function generate() {
  output.value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

async function copy() {
  try {
    await navigator.clipboard.writeText(output.value)
    toast.success('复制成功！')
  } catch (e) {
    toast.error('复制失败')
  }
}
</script>
