<script setup>
import { ref, watch } from 'vue'

const text = ref('https://forxi.cn')
const foreground = ref('#000000')
const background = ref('#ffffff')
const errorCorrectionLevel = ref('medium')
const qrCodeUrl = ref('')

const centerType = ref('none')
const centerText = ref('')
const centerImageUrl = ref('')
const centerImageFile = ref(null)

const errorCorrectionLevels = [
  { label: '低 (7%)', value: 'low' },
  { label: '中 (15%)', value: 'medium' },
  { label: '四分位 (25%)', value: 'quartile' },
  { label: '高 (30%)', value: 'high' },
]

const centerTypes = [
  { label: '无', value: 'none' },
  { label: '文字', value: 'text' },
  { label: '图片', value: 'image' },
]

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  centerImageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    centerImageUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

async function generateQRCode() {
  try {
    const QRCode = await import('qrcode').then(m => m.default || m)
    const canvas = document.createElement('canvas')

    const ecLevel = centerType.value !== 'none' ? 'high' : errorCorrectionLevel.value

    await QRCode.toCanvas(canvas, text.value, {
      width: 300,
      margin: 2,
      color: {
        dark: foreground.value,
        light: background.value,
      },
      errorCorrectionLevel: ecLevel,
    })

    if (centerType.value === 'text' && centerText.value) {
      const ctx = canvas.getContext('2d')
      const centerSize = Math.floor(canvas.width * 0.3)
      const centerX = (canvas.width - centerSize) / 2
      const centerY = (canvas.height - centerSize) / 2

      ctx.fillStyle = background.value
      ctx.fillRect(centerX, centerY, centerSize, centerSize)

      ctx.fillStyle = foreground.value
      ctx.font = `bold ${Math.floor(centerSize * 0.15)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(centerText.value, canvas.width / 2, canvas.height / 2, centerSize * 0.9)
    } else if (centerType.value === 'image' && centerImageUrl.value) {
      const ctx = canvas.getContext('2d')
      const centerSize = Math.floor(canvas.width * 0.25)
      const centerX = (canvas.width - centerSize) / 2
      const centerY = (canvas.height - centerSize) / 2

      ctx.fillStyle = background.value
      ctx.fillRect(centerX, centerY, centerSize, centerSize)

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, centerX + 4, centerY + 4, centerSize - 8, centerSize - 8)
        qrCodeUrl.value = canvas.toDataURL('image/png')
      }
      img.src = centerImageUrl.value
      return
    }

    qrCodeUrl.value = canvas.toDataURL('image/png')
  } catch (e) {
    console.error('QR Code generation error:', e)
  }
}

watch([text, foreground, background, errorCorrectionLevel, centerType, centerText, centerImageUrl], () => {
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
        <label class="block text-sm font-medium text-gray-700 mb-2">中间内容</label>
        <select
          v-model="centerType"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
        >
          <option v-for="type in centerTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>

      <div v-if="centerType === 'text'">
        <label class="block text-sm font-medium text-gray-700 mb-2">中间文字</label>
        <input
          v-model="centerText"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
          placeholder="例如：扫码关注"
          maxlength="6"
        />
      </div>

      <div v-if="centerType === 'image'">
        <label class="block text-sm font-medium text-gray-700 mb-2">中间图片</label>
        <input
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
        />
        <div v-if="centerImageUrl" class="mt-2 flex items-center gap-2">
          <img :src="centerImageUrl" class="w-12 h-12 object-contain border rounded" />
          <button @click="centerImageUrl = ''" class="text-sm text-red-500 hover:text-red-700">移除</button>
        </div>
      </div>

      <div v-if="centerType !== 'none'" class="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
        已自动切换至高纠错级别以确保二维码可扫描
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
