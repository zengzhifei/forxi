<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </span>
        大小写转换
      </h3>
      <textarea 
        v-model="input" 
        class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono text-sm"
        rows="4"
        placeholder="请输入要转换的文本..."
      ></textarea>
      <div class="mt-4 flex flex-wrap gap-2">
        <button @click="toUpperCase" class="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors">转大写</button>
        <button @click="toLowerCase" class="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors">转小写</button>
        <button @click="toCapitalCase" class="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors">首字母大写</button>
        <button @click="toSwapCase" class="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors">大小写互换</button>
        <button @click="copy(output)" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">复制</button>
      </div>
      <div v-if="output" class="mt-4">
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

function toUpperCase() {
  output.value = input.value.toUpperCase()
}

function toLowerCase() {
  output.value = input.value.toLowerCase()
}

function toCapitalCase() {
  output.value = input.value.replace(/\b\w/g, c => c.toUpperCase())
}

function toSwapCase() {
  output.value = input.value.replace(/[a-zA-Z]/g, c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())
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
