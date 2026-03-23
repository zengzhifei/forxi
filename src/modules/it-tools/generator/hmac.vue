<script setup>
import { ref, computed } from 'vue'

const plainText = ref('')
const secret = ref('')
const hashFunction = ref('SHA256')
const encoding = ref('Hex')

const algos = {
  MD5: 'MD5',
  SHA1: 'SHA-1',
  SHA256: 'SHA-256',
  SHA384: 'SHA-384',
  SHA512: 'SHA-512',
}

const encodings = [
  { label: '十六进制', value: 'Hex' },
  { label: 'Base64', value: 'Base64' },
]

async function computeHmac() {
  if (!plainText.value || !secret.value) return ''

  try {
    const cryptoJS = await import('crypto-js').then(m => m.default || m)
    let result

    switch (hashFunction.value) {
      case 'MD5':
        result = cryptoJS.HmacMD5(plainText.value, secret.value)
        break
      case 'SHA1':
        result = cryptoJS.HmacSHA1(plainText.value, secret.value)
        break
      case 'SHA256':
        result = cryptoJS.HmacSHA256(plainText.value, secret.value)
        break
      case 'SHA384':
        result = cryptoJS.HmacSHA384(plainText.value, secret.value)
        break
      case 'SHA512':
        result = cryptoJS.HmacSHA512(plainText.value, secret.value)
        break
      default:
        result = cryptoJS.HmacSHA256(plainText.value, secret.value)
    }

    if (encoding.value === 'Base64') {
      return result.toString(cryptoJS.enc.Base64)
    }
    return result.toString(cryptoJS.enc.Hex)
  } catch (e) {
    console.error('HMAC computation error:', e)
    return ''
  }
}

const hmac = computed(() => computeHmac())
const hmacValue = ref('')

async function updateHmac() {
  hmacValue.value = await computeHmac()
}

function copyToClipboard() {
  if (!hmacValue.value) return
  navigator.clipboard.writeText(hmacValue.value)
}
</script>

<template>
  <div class="h-full flex flex-col overflow-auto">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">明文</label>
      <textarea
        v-model="plainText"
        @input="updateHmac"
        class="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 resize-none font-mono text-sm"
        placeholder="输入要计算 HMAC 的文本..."
      />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">密钥 (Secret Key)</label>
      <input
        v-model="secret"
        @input="updateHmac"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 font-mono"
        placeholder="输入密钥..."
      />
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">哈希算法</label>
        <select
          v-model="hashFunction"
          @change="updateHmac"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
        >
          <option v-for="(label, value) in algos" :key="value" :value="value">
            {{ label }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">输出编码</label>
        <select
          v-model="encoding"
          @change="updateHmac"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
        >
          <option v-for="enc in encodings" :key="enc.value" :value="enc.value">
            {{ enc.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex-1">
      <label class="block text-sm font-medium text-gray-700 mb-2">HMAC 结果</label>
      <div class="relative">
        <textarea
          v-model="hmacValue"
          readonly
          class="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
          placeholder="HMAC 结果将显示在这里..."
        />
        <button
          @click="copyToClipboard"
          :disabled="!hmacValue"
          class="absolute top-2 right-2 px-3 py-1 bg-zinc-600 text-white text-sm rounded hover:bg-zinc-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          复制
        </button>
      </div>
    </div>
  </div>
</template>
