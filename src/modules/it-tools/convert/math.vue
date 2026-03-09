<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </span>
      数学计算器
    </h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">输入数学表达式</label>
        <input 
          type="text" 
          v-model="expression" 
          class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono"
          placeholder="例如: 2+2, sin(3.14), sqrt(16)..."
          @keyup.enter="calculate"
        />
      </div>
      <button @click="calculate" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">计算</button>
      <div v-if="result !== null" class="p-4 bg-gray-50 rounded-lg">
        <label class="block text-sm font-medium text-gray-700 mb-2">结果：</label>
        <p class="text-2xl font-bold text-yellow-600">{{ result }}</p>
      </div>
      <div v-if="error" class="p-4 bg-red-50 rounded-lg text-red-600">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const toast = inject('toast')

const expression = ref('')
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''
  result.value = null
  
  if (!expression.value.trim()) {
    error.value = '请输入数学表达式'
    return
  }
  
  try {
    let expr = expression.value
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/log/g, 'Math.log10')
      .replace(/ln/g, 'Math.log')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/abs/g, 'Math.abs')
      .replace(/pow/g, 'Math.pow')
      .replace(/PI/g, 'Math.PI')
      .replace(/E/g, 'Math.E')
      .replace(/\^/g, '**')
    
    result.value = eval(expr)
    
    if (typeof result.value === 'number' && !isFinite(result.value)) {
      result.value = null
      error.value = '结果是无穷大'
    }
  } catch (e) {
    error.value = '表达式格式不正确'
    toast.error('计算表达式错误')
  }
}
</script>
