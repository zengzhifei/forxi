<template>
  <div class="space-y-3 sm:space-y-4">
    <div
      class="border-2 border-dashed border-zinc-200 rounded-xl p-4 sm:p-8 text-center hover:border-zinc-300 transition-colors cursor-pointer"
      @click="triggerInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'border-zinc-400 bg-zinc-50': isDragging }"
    >
      <svg class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2zM7 21h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="mt-3 text-sm sm:text-base font-medium text-zinc-600">点击或拖拽 Word 文档到此处</p>
      <p class="mt-1 sm:mt-2 text-xs sm:text-sm text-zinc-400">支持 .docx 格式</p>
      <input ref="wordInput" type="file" class="hidden" accept=".docx" @change="handleSelect">
    </div>

    <div v-if="fileName" class="border border-zinc-200 rounded-xl p-3 sm:p-4 bg-zinc-50">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-zinc-600 truncate flex-1">{{ fileName }}</span>
        <button @click="clearFile" class="text-xs text-zinc-400 hover:text-zinc-600 ml-2">清除</button>
      </div>
      <div class="bg-white rounded-lg p-2 sm:p-3 border border-zinc-100 max-h-48 sm:max-h-64 overflow-auto">
        <div ref="docPreview" class="text-xs sm:text-sm"></div>
      </div>
    </div>
    <button @click="generatePdf" :disabled="isGenerating || !fileName" class="w-full px-4 sm:px-6 py-2.5 text-white text-sm font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)">
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
const wordInput = ref(null)
const fileName = ref('')
const docPreview = ref(null)
const isDragging = ref(false)

const triggerInput = () => wordInput.value?.click()

const handleSelect = (e) => {
  const file = e.target.files[0]
  if (file) loadFile(file)
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    loadFile(file)
  }
}

const loadFile = async (file) => {
  fileName.value = file.name
  const buffer = await file.arrayBuffer()
  const { renderAsync } = await import('docx-preview')
  if (docPreview.value) {
    docPreview.value.innerHTML = ''
    await renderAsync(buffer, docPreview.value, undefined, { className: 'docx-wrapper', inlinedStyles: true })
  }
}

const clearFile = () => {
  fileName.value = ''
  if (docPreview.value) docPreview.value.innerHTML = ''
}

const generatePdf = async () => {
  if (!fileName.value || !docPreview.value) return

  isGenerating.value = true
  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ])
    const canvas = await html2canvas(docPreview.value, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
    const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait', unit: 'px' })
    const ratio = Math.min(pdf.internal.pageSize.getWidth() / canvas.width, pdf.internal.pageSize.getHeight() / canvas.height)
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, canvas.width * ratio, canvas.height * ratio)

    emit('preview', URL.createObjectURL(pdf.output('blob')))
    toast.success('PDF 生成成功！')
  } catch (err) {
    toast.error('生成 PDF 失败')
  } finally {
    isGenerating.value = false
  }
}
</script>
