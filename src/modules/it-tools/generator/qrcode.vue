<script setup>
import { ref, watch } from 'vue'

const text = ref('https://forxi.cn')
const foreground = ref('#000000')
const background = ref('#ffffff')
const errorCorrectionLevel = ref('medium')
const qrCodeUrl = ref('')

const errorCorrectionLevels = [
  { label: '低 (7%)', value: 'low' },
  { label: '中 (15%)', value: 'medium' },
  { label: '四分位 (25%)', value: 'quartile' },
  { label: '高 (30%)', value: 'high' },
]

async function generateQRCode() {
  try {
    const QRCode = await import('qrcode').then(m => m.default || m)
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, text.value, {
      width: 300,
      margin: 2,
      color: {
        dark: foreground.value,
        light: background.value,
      },
      errorCorrectionLevel: errorCorrectionLevel.value,
    })
    qrCodeUrl.value = canvas.toDataURL('image/png')
  } catch (e) {
    console.error('QR Code generation error:', e)
  }
}

watch([text, foreground, background, errorCorrectionLevel], () => {
  generateQRCode()
}, { immediate: true })

function downloadQRCode() {
  if (!qrCodeUrl.value) return
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = qrCodeUrl.value
  link.click()
}
</script>

<template>
  <div class="h-full flex flex-col md:flex-row gap-6">
    <div class="flex-1 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">文本内容</label>
        <textarea
          v-model="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 resize-none"
          rows="3"
          placeholder="请输入文本或链接..."
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">前景色</label>
          <div class="flex items-center gap-2">
            <input
              type="color"
              v-model="foreground"
              class="w-10 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              v-model="foreground"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">背景色</label>
          <div class="flex items-center gap-2">
            <input
              type="color"
              v-model="background"
              class="w-10 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              v-model="background"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">纠错级别</label>
        <select
          v-model="errorCorrectionLevel"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
        >
          <option v-for="level in errorCorrectionLevels" :key="level.value" :value="level.value">
            {{ level.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center">
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
        <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" class="max-w-[250px]" />
        <div v-else class="w-[250px] h-[250px] flex items-center justify-center text-gray-400">
          生成中...
        </div>
      </div>
      <button
        @click="downloadQRCode"
        :disabled="!qrCodeUrl"
        class="px-6 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        下载二维码
      </button>
    </div>
  </div>
</template>
