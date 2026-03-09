<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </span>
      温度转换
    </h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">摄氏度 (°C)</label>
        <input 
          type="number" 
          v-model="celsius" 
          @input="convertFromCelsius"
          class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="输入摄氏度..."
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">华氏度 (°F)</label>
        <input 
          type="number" 
          v-model="fahrenheit" 
          @input="convertFromFahrenheit"
          class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="输入华氏度..."
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">开尔文 (K)</label>
        <input 
          type="number" 
          v-model="kelvin" 
          @input="convertFromKelvin"
          class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="输入开尔文..."
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const celsius = ref('')
const fahrenheit = ref('')
const kelvin = ref('')

function convertFromCelsius() {
  if (celsius.value === '') {
    fahrenheit.value = ''
    kelvin.value = ''
    return
  }
  const c = parseFloat(celsius.value)
  if (isNaN(c)) return
  fahrenheit.value = (c * 9/5 + 32).toFixed(2)
  kelvin.value = (c + 273.15).toFixed(2)
}

function convertFromFahrenheit() {
  if (fahrenheit.value === '') {
    celsius.value = ''
    kelvin.value = ''
    return
  }
  const f = parseFloat(fahrenheit.value)
  if (isNaN(f)) return
  celsius.value = ((f - 32) * 5/9).toFixed(2)
  kelvin.value = ((f - 32) * 5/9 + 273.15).toFixed(2)
}

function convertFromKelvin() {
  if (kelvin.value === '') {
    celsius.value = ''
    fahrenheit.value = ''
    return
  }
  const k = parseFloat(kelvin.value)
  if (isNaN(k)) return
  celsius.value = (k - 273.15).toFixed(2)
  fahrenheit.value = ((k - 273.15) * 9/5 + 32).toFixed(2)
}
</script>
