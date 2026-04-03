<template>
  <div class="space-y-3 sm:space-y-4">
    <div>
      <label class="block text-xs sm:text-sm font-medium text-zinc-600 mb-1.5 sm:mb-2">PDF 标题</label>
      <input v-model="title" type="text" class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-zinc-200 rounded-lg sm:rounded-xl text-sm focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:outline-none" placeholder="请输入文档标题">
    </div>
    <div>
      <label class="block text-xs sm:text-sm font-medium text-zinc-600 mb-1.5 sm:mb-2">内容</label>
      <textarea v-model="content" rows="6" class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-zinc-200 rounded-lg sm:rounded-xl text-sm resize-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:outline-none" placeholder="请输入要转换为 PDF 的文本内容"></textarea>
    </div>
    <div class="flex items-center gap-3">
      <label class="text-xs sm:text-sm text-zinc-500 whitespace-nowrap">字体大小</label>
      <input type="range" v-model="fontSize" min="10" max="20" step="1" class="flex-1">
      <span class="text-xs sm:text-sm text-zinc-500 whitespace-nowrap">{{ fontSize }}px</span>
    </div>
    <button @click="generatePdf" :disabled="isGenerating || !content" class="w-full px-4 sm:px-6 py-2.5 text-white text-sm font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)">
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
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const emit = defineEmits(['preview'])
const toast = inject('toast')

const isGenerating = ref(false)
const title = ref('')
const content = ref('')
const fontSize = ref(12)

const generatePdf = async () => {
  if (!content.value) return

  isGenerating.value = true
  try {
    const textEl = document.createElement('div')
    textEl.style.cssText = 'background:white;padding:40px;font-family:Arial,sans-serif;line-height:1.6;font-size:' + fontSize.value + 'px;max-width:800px;margin:0 auto'
    if (title.value) {
      const h1 = document.createElement('h1')
      h1.style.cssText = 'font-size:24px;font-weight:bold;margin-bottom:20px'
      h1.textContent = title.value
      textEl.appendChild(h1)
    }
    const div = document.createElement('div')
    div.style.cssText = 'white-space:pre-wrap;word-wrap:break-word'
    div.textContent = content.value
    textEl.appendChild(div)

    document.body.appendChild(textEl)
    const canvas = await html2canvas(textEl, { scale: 2, useCORS: true, backgroundColor: 'white' })
    document.body.removeChild(textEl)

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
