<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </span>
      SQL 格式化
    </h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">输入 SQL</label>
        <textarea 
          v-model="input" 
          class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono text-sm"
          rows="8"
          placeholder="请输入 SQL 语句..."
        ></textarea>
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="format" class="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors">格式化</button>
        <button @click="copy(output)" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">复制</button>
      </div>
      <div v-if="output">
        <label class="block text-sm font-medium text-gray-700 mb-2">结果：</label>
        <textarea 
          :value="output" 
          readonly
          class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
          rows="8"
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

function format() {
  if (!input.value.trim()) {
    toast.warning('请输入 SQL 语句')
    return
  }
  
  let sql = input.value
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ',\n  ')
    .replace(/\s*\(\s*/g, '(\n  ')
    .replace(/\s*\)\s*/g, '\n)')
    .replace(/\s+AND\s+/gi, '\nAND ')
    .replace(/\s+OR\s+/gi, '\nOR ')
    .replace(/\s+WHERE\s+/gi, '\nWHERE ')
    .replace(/\s+FROM\s+/gi, '\nFROM ')
    .replace(/\s+SELECT\s+/gi, 'SELECT ')
    .replace(/\s+JOIN\s+/gi, '\nJOIN ')
    .replace(/\s+LEFT\s+JOIN\s+/gi, '\nLEFT JOIN ')
    .replace(/\s+RIGHT\s+JOIN\s+/gi, '\nRIGHT JOIN ')
    .replace(/\s+INNER\s+JOIN\s+/gi, '\nINNER JOIN ')
    .replace(/\s+ON\s+/gi, ' ON ')
    .replace(/\s+ORDER\s+BY\s+/gi, '\nORDER BY ')
    .replace(/\s+GROUP\s+BY\s+/gi, '\nGROUP BY ')
    .replace(/\s+HAVING\s+/gi, '\nHAVING ')
    .replace(/\s+LIMIT\s+/gi, '\nLIMIT ')
  
  output.value = sql.trim()
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
