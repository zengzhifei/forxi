<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </span>
      颜色转换
    </h3>
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">输入颜色（HEX）</label>
      <div class="flex gap-3">
        <div class="relative flex-1">
          <input 
            type="text" 
            v-model="colorInput" 
            class="w-full p-4 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
            placeholder="#FF5733"
          />
          <div class="absolute left-4 top-1/2 -translate-y-1/2">
            <div 
              class="w-5 h-5 rounded border border-gray-300"
              :style="{ backgroundColor: colorInput || '#ccc' }"
            ></div>
          </div>
        </div>
        <button @click="convert" class="px-6 py-3 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-all font-medium">转换</button>
      </div>
    </div>
    <div v-if="output" class="space-y-4">
      <div class="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
        <div 
          class="w-24 h-24 rounded-2xl shadow-lg border-4 border-white"
          :style="{ backgroundColor: output.hex }"
        ></div>
        <div class="space-y-2">
          <p class="text-sm text-gray-500">HEX</p>
          <p class="font-mono font-semibold text-lg">{{ output.hex }}</p>
          <p class="text-sm text-gray-500 mt-2">RGB</p>
          <p class="font-mono text-gray-700">{{ output.rgb }}</p>
          <p class="text-sm text-gray-500 mt-2">HSL</p>
          <p class="font-mono text-gray-700">{{ output.hsl }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const colorInput = ref('')
const output = ref(null)

function convert() {
  try {
    let hex = colorInput.value
    if (!hex.startsWith('#')) {
      hex = '#' + hex
    }
    
    let r, g, b
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16)
      g = parseInt(hex[2] + hex[2], 16)
      b = parseInt(hex[3] + hex[3], 16)
    } else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16)
      g = parseInt(hex.slice(3, 5), 16)
      b = parseInt(hex.slice(5, 7), 16)
    } else {
      return
    }
    
    const rgb = `rgb(${r}, ${g}, ${b})`
    
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2
    
    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    
    const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
    
    output.value = {
      hex: hex.toUpperCase(),
      rgb,
      hsl
    }
  } catch (e) {
    output.value = null
  }
}
</script>
