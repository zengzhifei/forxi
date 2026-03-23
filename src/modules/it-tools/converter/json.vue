<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </span>
      JSON 格式化
    </h3>
    <textarea 
      v-model="input" 
      class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono text-sm"
      rows="8"
      placeholder="请输入 JSON 字符串..."
    ></textarea>
    <div class="mt-4 flex gap-3 flex-wrap">
      <button @click="format" class="px-5 py-2.5 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-all font-medium">格式化</button>
      <button @click="compress" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium">压缩</button>
      <button @click="copy(output)" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium" :disabled="!output">复制</button>
    </div>
    <div v-if="output" class="mt-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">结果：</label>
      <textarea 
        :value="output" 
        readonly
        class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
        rows="8"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const toast = inject('toast')

const input = ref('')
const output = ref('')

function format() {
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed, null, 2)
  } catch (e) {
    output.value = 'JSON 格式错误'
  }
}

function compress() {
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed)
  } catch (e) {
    output.value = 'JSON 格式错误'
  }
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
