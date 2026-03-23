<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      </span>
      IP 地址转换
    </h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">IPv4 地址</label>
        <input 
          type="text" 
          v-model="ipv4" 
          @input="ipv4ToInt"
          class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono"
          placeholder="例如: 192.168.1.1"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">整数</label>
        <input 
          type="number" 
          v-model="intValue" 
          @input="intToIpv4"
          class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono"
          placeholder="例如: 3232235777"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ipv4 = ref('')
const intValue = ref('')

function ipv4ToInt() {
  if (!ipv4.value) {
    intValue.value = ''
    return
  }
  const parts = ipv4.value.split('.')
  if (parts.length !== 4 || parts.some(p => isNaN(parseInt(p)) || parseInt(p) < 0 || parseInt(p) > 255)) {
    return
  }
  intValue.value = parts.reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0
}

function intToIpv4() {
  if (!intValue.value) {
    ipv4.value = ''
    return
  }
  const num = parseInt(intValue.value)
  if (isNaN(num) || num < 0 || num > 4294967295) {
    return
  }
  ipv4.value = [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255
  ].join('.')
}
</script>
