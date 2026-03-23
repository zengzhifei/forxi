<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span class="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        Unix 时间戳
      </h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">当前时间戳</label>
          <div class="flex gap-2">
            <input 
              type="text" 
              :value="currentTimestamp" 
              readonly
              class="flex-1 p-3 border border-gray-200 rounded-lg bg-gray-50 font-mono text-lg text-center"
            />
            <button @click="refresh" class="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">时间戳转时间</label>
            <input 
              type="text" 
              v-model="timestampInput" 
              class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono"
              placeholder="输入时间戳..."
            />
            <button @click="timestampToDate" class="mt-2 w-full px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700">转换</button>
            <p v-if="dateOutput" class="mt-2 p-3 bg-gray-50 rounded-lg font-mono text-sm">{{ dateOutput }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">时间转时间戳</label>
            <input 
              type="datetime-local" 
              v-model="dateInput" 
              class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent"
            />
            <button @click="dateToTimestamp" class="mt-2 w-full px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700">转换</button>
            <p v-if="timestampOutput" class="mt-2 p-3 bg-gray-50 rounded-lg font-mono text-sm">{{ timestampOutput }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTimestamp = ref('')
const timestampInput = ref('')
const dateOutput = ref('')
const dateInput = ref('')
const timestampOutput = ref('')

let interval

onMounted(() => {
  updateTimestamp()
  interval = setInterval(updateTimestamp, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})

function updateTimestamp() {
  currentTimestamp.value = Math.floor(Date.now() / 1000).toString()
}

function refresh() {
  updateTimestamp()
}

function timestampToDate() {
  if (!timestampInput.value) return
  const timestamp = parseInt(timestampInput.value)
  if (isNaN(timestamp)) {
    dateOutput.value = '无效的时间戳'
    return
  }
  const date = new Date(timestamp * 1000)
  dateOutput.value = date.toLocaleString('zh-CN')
}

function dateToTimestamp() {
  if (!dateInput.value) return
  const date = new Date(dateInput.value)
  timestampOutput.value = Math.floor(date.getTime() / 1000).toString()
}
</script>
