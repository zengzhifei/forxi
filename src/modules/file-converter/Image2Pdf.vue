<template>
  <div class="space-y-3 sm:space-y-4">
    <div
      class="border-2 border-dashed border-zinc-200 rounded-xl p-4 sm:p-8 text-center hover:border-zinc-300 transition-colors cursor-pointer"
      @click="triggerImageInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'border-zinc-400 bg-zinc-50': isDragging }"
    >
      <svg class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="mt-3 text-sm sm:text-base font-medium text-zinc-600">点击或拖拽图片到此处</p>
      <p class="mt-1 sm:mt-2 text-xs sm:text-sm text-zinc-400">支持 JPG、PNG、WebP，可多选</p>
      <input ref="imageInput" type="file" class="hidden" accept="image/jpeg,image/png,image/webp" multiple @change="handleSelect">
    </div>

    <div v-if="images.length > 0" class="space-y-3 sm:space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-zinc-600">已选择 {{ images.length }} 张图片</span>
        <button @click="clearImages" class="text-xs text-zinc-400 hover:text-zinc-600">清空全部</button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        <div v-for="(img, index) in images" :key="index" class="relative border border-zinc-200 rounded-xl p-2 sm:p-3 bg-zinc-50">
          <img :src="img.preview" class="w-full h-24 sm:h-32 object-contain rounded-lg bg-white" alt="预览图">
          <div class="flex flex-wrap items-center justify-center gap-1 mt-2">
            <button @click="rotate(index, -90)" class="px-2 py-1 border border-zinc-200 text-zinc-500 hover:bg-zinc-100 rounded text-xs">↺</button>
            <button @click="rotate(index, 90)" class="px-2 py-1 border border-zinc-200 text-zinc-500 hover:bg-zinc-100 rounded text-xs">↻</button>
            <button @click="remove(index)" class="px-2 py-1 border border-zinc-200 text-red-500 hover:bg-red-50 rounded text-xs">×</button>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <label class="text-xs sm:text-sm text-zinc-500 whitespace-nowrap">图片质量</label>
        <input type="range" v-model="quality" min="0.1" max="1" step="0.1" class="flex-1">
        <span class="text-xs sm:text-sm text-zinc-500 whitespace-nowrap">{{ Math.round(quality * 100) }}%</span>
      </div>
    </div>

    <button @click="generatePdf" :disabled="isGenerating || images.length === 0" class="w-full px-4 sm:px-6 py-2.5 text-white text-sm font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)">
      <svg v-if="isGenerating" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      预览下载
    </button>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const emit = defineEmits(['preview'])
const toast = inject('toast')

const isGenerating = ref(false)
const imageInput = ref(null)
const images = ref([])
const isDragging = ref(false)
const quality = ref(0.8)

const triggerImageInput = () => imageInput.value?.click()

const handleSelect = (e) => {
  addFiles(Array.from(e.target.files))
}

const handleDrop = (e) => {
  isDragging.value = false
  addFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')))
}

const addFiles = (files) => {
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      images.value.push({ preview: e.target.result, rotation: 0 })
    }
    reader.readAsDataURL(file)
  })
}

const rotate = async (index, degrees) => {
  const img = images.value[index]
  img.rotation = (img.rotation || 0) + degrees

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const imgEl = new Image()
  imgEl.src = img.preview

  await new Promise(resolve => { imgEl.onload = resolve })

  if (Math.abs(img.rotation) === 90 || Math.abs(img.rotation) === 270) {
    canvas.width = imgEl.height
    canvas.height = imgEl.width
  } else {
    canvas.width = imgEl.width
    canvas.height = imgEl.height
  }

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((img.rotation * Math.PI) / 180)
  ctx.drawImage(imgEl, -imgEl.width / 2, -imgEl.height / 2)

  img.preview = canvas.toDataURL('image/jpeg', quality.value)
}

const remove = (index) => images.value.splice(index, 1)
const clearImages = () => images.value = []

const generatePdf = async () => {
  if (images.value.length === 0) return

  isGenerating.value = true
  try {
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px' })

    for (let i = 0; i < images.value.length; i++) {
      if (i > 0) pdf.addPage()

      const imgData = images.value[i].preview
      const img = new Image()
      await new Promise(resolve => { img.onload = resolve; img.src = imgData })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height)

      pdf.addImage(imgData, 'JPEG', (pdfWidth - img.width * ratio) / 2, (pdfHeight - img.height * ratio) / 2, img.width * ratio, img.height * ratio)
    }

    emit('preview', URL.createObjectURL(pdf.output('blob')))
    toast.success('PDF 生成成功！')
  } catch (err) {
    toast.error('生成 PDF 失败')
  } finally {
    isGenerating.value = false
  }
}
</script>
