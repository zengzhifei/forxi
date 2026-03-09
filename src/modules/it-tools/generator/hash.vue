<script setup>
import { ref, computed } from 'vue'

const clearText = ref('')
const encoding = ref('Hex')

const algos = [
  { label: 'MD5', value: 'MD5' },
  { label: 'SHA-1', value: 'SHA1' },
  { label: 'SHA-256', value: 'SHA256' },
  { label: 'SHA-384', value: 'SHA384' },
  { label: 'SHA-512', value: 'SHA512' },
  { label: 'RIPEMD160', value: 'RIPEMD160' },
]

const encodings = [
  { label: '十六进制', value: 'Hex' },
  { label: 'Base64', value: 'Base64' },
]

async function computeHash(text, algo) {
  if (!text) return ''
  
  try {
    const cryptoJS = await import('crypto-js').then(m => m.default || m)
    let result
    
    switch (algo) {
      case 'MD5':
        result = cryptoJS.MD5(text)
        break
      case 'SHA1':
        result = cryptoJS.SHA1(text)
        break
      case 'SHA256':
        result = cryptoJS.SHA256(text)
        break
      case 'SHA384':
        result = cryptoJS.SHA384(text)
        break
      case 'SHA512':
        result = cryptoJS.SHA512(text)
        break
      case 'RIPEMD160':
        result = cryptoJS.RIPEMD160(text)
        break
      default:
        result = cryptoJS.SHA256(text)
    }

    if (encoding.value === 'Base64') {
      return result.toString(cryptoJS.enc.Base64)
    }
    return result.toString(cryptoJS.enc.Hex)
  } catch (e) {
    console.error('Hash computation error:', e)
    return ''
  }
}

const hashes = ref({})

async function updateHashes() {
  const results = {}
  for (const algo of algos) {
    results[algo.value] = await computeHash(clearText.value, algo.value)
  }
  hashes.value = results
}

function copyToClipboard(text) {
  if (!text) return
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="h-full flex flex-col overflow-auto">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
      <textarea
        v-model="clearText"
        @input="updateHashes"
        class="w-full h-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
        placeholder="输入要哈希的文本..."
      />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">输出编码</label>
      <select
        v-model="encoding"
        @change="updateHashes"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option v-for="enc in encodings" :key="enc.value" :value="enc.value">
          {{ enc.label }}
        </option>
      </select>
    </div>

    <div class="flex-1 overflow-auto space-y-3">
      <div v-for="algo in algos" :key="algo.value">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ algo.label }}</label>
        <div class="relative">
          <input
            :value="hashes[algo.value] || ''"
            readonly
            type="text"
            class="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
            placeholder="..."
          />
          <button
            @click="copyToClipboard(hashes[algo.value])"
            :disabled="!hashes[algo.value]"
            class="absolute top-1/2 right-2 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            复制
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
