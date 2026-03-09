<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
      番茄钟
    </h3>
    <div class="text-center py-8">
      <div class="mb-8">
        <div class="text-7xl font-bold text-gray-800 font-mono mb-4">
          {{ formatTime(timeLeft) }}
        </div>
        <div class="flex justify-center gap-4">
          <button 
            v-if="!isRunning"
            @click="start"
            class="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-medium"
          >
            开始
          </button>
          <button 
            v-else
            @click="pause"
            class="px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-lg font-medium"
          >
            暂停
          </button>
          <button 
            @click="reset"
            class="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-lg font-medium"
          >
            重置
          </button>
        </div>
      </div>
      <div class="flex justify-center gap-2">
        <button 
          v-for="preset in presets" 
          :key="preset.minutes"
          @click="setPreset(preset.minutes)"
          class="px-4 py-2 rounded-lg transition-colors"
          :class="timeLeft === preset.minutes * 60 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const presets = [
  { label: '25 分钟', minutes: 25 },
  { label: '15 分钟', minutes: 15 },
  { label: '5 分钟', minutes: 5 },
  { label: '1 分钟', minutes: 1 }
]

const timeLeft = ref(25 * 60)
const isRunning = ref(false)
let timer = null

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function start() {
  if (isRunning.value) return
  isRunning.value = true
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      pause()
      new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleT4uAKrF').play()
    }
  }, 1000)
}

function pause() {
  isRunning.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function reset() {
  pause()
  timeLeft.value = 25 * 60
}

function setPreset(minutes) {
  pause()
  timeLeft.value = minutes * 60
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
