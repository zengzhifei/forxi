<template>
  <div class="space-y-3 sm:space-y-4">
    <div>
      <label class="block text-xs sm:text-sm font-medium text-zinc-600 mb-1.5 sm:mb-2">表格数据 (JSON 格式)</label>
      <textarea v-model="jsonData" rows="6" class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-zinc-200 rounded-lg sm:rounded-xl text-xs sm:text-sm resize-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:outline-none font-mono" placeholder='[{"姓名":"张三","年龄":25},{"姓名":"李四","年龄":30}]'></textarea>
      <p v-if="jsonError" class="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-500">{{ jsonError }}</p>
    </div>
    <div v-if="tableData.length > 0" class="border border-zinc-200 rounded-lg sm:rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm">
          <thead class="bg-zinc-50">
            <tr>
              <th v-for="header in tableHeaders" :key="header" class="px-2 sm:px-4 py-1.5 sm:py-2 text-left font-medium text-zinc-600 whitespace-nowrap">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData" :key="index" class="border-t border-zinc-100">
              <td v-for="header in tableHeaders" :key="header" class="px-2 sm:px-4 py-1.5 sm:py-2 text-zinc-600 whitespace-nowrap">{{ row[header] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button @click="generatePdf" :disabled="isGenerating || tableData.length === 0" class="w-full px-4 sm:px-6 py-2.5 text-white text-sm font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)">
      <svg v-if="isGenerating" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      预览下载
    </button>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const emit = defineEmits(['preview'])
const toast = inject('toast')

const isGenerating = ref(false)
const jsonData = ref('')
const jsonError = ref('')

const tableData = computed(() => {
  try {
    if (!jsonData.value.trim()) {
      jsonError.value = ''
      return []
    }
    const data = JSON.parse(jsonData.value)
    if (!Array.isArray(data)) {
      jsonError.value = 'JSON 格式错误：需要是数组格式'
      return []
    }
    jsonError.value = ''
    return data
  } catch (e) {
    jsonError.value = 'JSON 格式错误：' + e.message
    return []
  }
})

const tableHeaders = computed(() => {
  if (tableData.value.length === 0) return []
  return Object.keys(tableData.value[0])
})

const generatePdf = async () => {
  if (tableData.value.length === 0) return

  isGenerating.value = true
  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ])
    const tableEl = document.createElement('div')
    tableEl.style.cssText = 'background:white;padding:20px;font-family:Arial,sans-serif'

    let html = `<table style="width:100%;border-collapse:collapse;font-size:12px;">
      <thead style="background:#f5f5f5;"><tr>${tableHeaders.value.map(h => `<th style="border:1px solid #ddd;padding:8px;text-align:left;">${h}</th>`).join('')}</tr></thead>
      <tbody>${tableData.value.map((row, i) => `<tr style="background:${i % 2 === 1 ? '#fafafa' : 'white'};">${tableHeaders.value.map(h => `<td style="border:1px solid #ddd;padding:8px;">${row[h] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>`
    tableEl.innerHTML = html

    document.body.appendChild(tableEl)
    const canvas = await html2canvas(tableEl, { scale: 2, useCORS: true, backgroundColor: 'white' })
    document.body.removeChild(tableEl)

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
