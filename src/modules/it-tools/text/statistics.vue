<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </span>
      文本统计
    </h3>
    <textarea 
      v-model="input" 
      class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent"
      rows="6"
      placeholder="请输入要统计的文本..."
    ></textarea>
    <div v-if="stats" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="p-3 bg-gray-50 rounded-lg text-center">
        <p class="text-2xl font-bold text-blue-600">{{ stats.characters }}</p>
        <p class="text-sm text-gray-500">字符数</p>
      </div>
      <div class="p-3 bg-gray-50 rounded-lg text-center">
        <p class="text-2xl font-bold text-green-600">{{ stats.charactersNoSpaces }}</p>
        <p class="text-sm text-gray-500">字符数(无空格)</p>
      </div>
      <div class="p-3 bg-gray-50 rounded-lg text-center">
        <p class="text-2xl font-bold text-purple-600">{{ stats.words }}</p>
        <p class="text-sm text-gray-500">单词数</p>
      </div>
      <div class="p-3 bg-gray-50 rounded-lg text-center">
        <p class="text-2xl font-bold text-orange-600">{{ stats.lines }}</p>
        <p class="text-sm text-gray-500">行数</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const input = ref('')

const stats = computed(() => {
  if (!input.value) return null
  const text = input.value
  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text.split('\n').length
  }
})
</script>
