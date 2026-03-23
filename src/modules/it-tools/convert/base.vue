<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      </span>
      进制转换
    </h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">十进制 (Decimal)</label>
        <input 
          type="text" 
          v-model="decimal" 
          @input="convertFromDecimal"
          class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono"
          placeholder="输入十进制数..."
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">二进制 (Binary)</label>
        <input 
          type="text" 
          v-model="binary" 
          @input="convertFromBinary"
          class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono"
          placeholder="输入二进制数..."
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">十六进制 (Hex)</label>
        <input 
          type="text" 
          v-model="hex" 
          @input="convertFromHex"
          class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono"
          placeholder="输入十六进制数..."
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">八进制 (Octal)</label>
        <input 
          type="text" 
          v-model="octal" 
          @input="convertFromOctal"
          class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono"
          placeholder="输入八进制数..."
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const decimal = ref('')
const binary = ref('')
const hex = ref('')
const octal = ref('')

function convertFromDecimal() {
  if (!decimal.value) {
    binary.value = ''
    hex.value = ''
    octal.value = ''
    return
  }
  const num = parseInt(decimal.value, 10)
  if (isNaN(num)) return
  binary.value = num.toString(2)
  hex.value = num.toString(16).toUpperCase()
  octal.value = num.toString(8)
}

function convertFromBinary() {
  if (!binary.value) {
    decimal.value = ''
    hex.value = ''
    octal.value = ''
    return
  }
  const num = parseInt(binary.value, 2)
  if (isNaN(num)) return
  decimal.value = num.toString(10)
  hex.value = num.toString(16).toUpperCase()
  octal.value = num.toString(8)
}

function convertFromHex() {
  if (!hex.value) {
    decimal.value = ''
    binary.value = ''
    octal.value = ''
    return
  }
  const num = parseInt(hex.value, 16)
  if (isNaN(num)) return
  decimal.value = num.toString(10)
  binary.value = num.toString(2)
  octal.value = num.toString(8)
}

function convertFromOctal() {
  if (!octal.value) {
    decimal.value = ''
    binary.value = ''
    hex.value = ''
    return
  }
  const num = parseInt(octal.value, 8)
  if (isNaN(num)) return
  decimal.value = num.toString(10)
  binary.value = num.toString(2)
  hex.value = num.toString(16).toUpperCase()
}
</script>
