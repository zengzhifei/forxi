<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </span>
      文本到 NATO 字母
    </h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
        <textarea 
          v-model="input" 
          class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          rows="3"
          placeholder="请输入要转换的文本..."
        ></textarea>
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="toNato" class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">转换为 NATO 字母</button>
        <button @click="copy(output)" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">复制</button>
      </div>
      <div v-if="output">
        <label class="block text-sm font-medium text-gray-700 mb-2">结果：</label>
        <textarea 
          :value="output" 
          readonly
          class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50"
          rows="3"
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

const natoAlphabet = {
  'a': 'Alfa', 'b': 'Bravo', 'c': 'Charlie', 'd': 'Delta',
  'e': 'Echo', 'f': 'Foxtrot', 'g': 'Golf', 'h': 'Hotel',
  'i': 'India', 'j': 'Juliet', 'k': 'Kilo', 'l': 'Lima',
  'm': 'Mike', 'n': 'November', 'o': 'Oscar', 'p': 'Papa',
  'q': 'Quebec', 'r': 'Romeo', 's': 'Sierra', 't': 'Tango',
  'u': 'Uniform', 'v': 'Victor', 'w': 'Whiskey', 'x': 'X-ray',
  'y': 'Yankee', 'z': 'Zulu',
  '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three',
  '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven',
  '8': 'Eight', '9': 'Nine'
}

function toNato() {
  output.value = input.value.toLowerCase().split('').map(char => {
    if (char.match(/[a-z0-9]/)) {
      return natoAlphabet[char] || char
    }
    return char
  }).join(' ')
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
