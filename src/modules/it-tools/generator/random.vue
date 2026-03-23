<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </span>
      随机字符串生成
    </h3>
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">长度</label>
          <input 
            type="number" 
            v-model="length" 
            min="1"
            max="100"
            class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">生成数量</label>
          <input 
            type="number" 
            v-model="count" 
            min="1"
            max="100"
            class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent"
          />
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <label class="flex items-center">
          <input type="checkbox" v-model="options.uppercase" class="mr-2 w-4 h-4 text-indigo-600 rounded" />
          <span class="text-sm text-gray-700">大写字母 (A-Z)</span>
        </label>
        <label class="flex items-center">
          <input type="checkbox" v-model="options.lowercase" class="mr-2 w-4 h-4 text-indigo-600 rounded" />
          <span class="text-sm text-gray-700">小写字母 (a-z)</span>
        </label>
        <label class="flex items-center">
          <input type="checkbox" v-model="options.numbers" class="mr-2 w-4 h-4 text-indigo-600 rounded" />
          <span class="text-sm text-gray-700">数字 (0-9)</span>
        </label>
        <label class="flex items-center">
          <input type="checkbox" v-model="options.special" class="mr-2 w-4 h-4 text-indigo-600 rounded" />
          <span class="text-sm text-gray-700">特殊字符 (!@#$%)</span>
        </label>
      </div>
      <button @click="generate" class="w-full py-3 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-all font-medium">
        生成随机字符串
      </button>
      <div v-if="results.length" class="space-y-2">
        <div v-for="(result, index) in results" :key="index" class="flex gap-2">
          <input 
            type="text" 
            :value="result" 
            readonly
            class="flex-1 p-3 border border-gray-200 rounded-lg bg-gray-50 font-mono"
          />
          <button @click="copy(result)" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">复制</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'

const toast = inject('toast')

const length = ref(16)
const count = ref(1)
const results = ref([])
const options = reactive({
  uppercase: true,
  lowercase: true,
  numbers: true,
  special: false
})

function generate() {
  let chars = ''
  if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (options.numbers) chars += '0123456789'
  if (options.special) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  if (!chars) {
    toast.warning('请至少选择一种字符类型')
    return
  }
  
  results.value = []
  for (let i = 0; i < count.value; i++) {
    let result = ''
    for (let j = 0; j < length.value; j++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    results.value.push(result)
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
