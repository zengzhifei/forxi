<template>
  <div v-if="previewUrl" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4" @click.self="close">
    <div class="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between p-3 sm:p-4 border-b border-zinc-200">
        <h3 class="text-base sm:text-lg font-medium text-zinc-700">PDF 预览</h3>
        <button @click="close" class="p-1.5 sm:p-2 hover:bg-zinc-100 rounded-lg">
          <svg class="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="flex-1 p-2 sm:p-4 overflow-auto">
        <iframe :src="previewUrl" class="w-full h-[50vh] sm:h-[70vh]" title="PDF Preview"></iframe>
      </div>
      <div class="p-3 sm:p-4 border-t border-zinc-200 flex justify-end gap-2 sm:gap-3">
        <button @click="close" class="px-3 sm:px-4 py-1.5 sm:py-2 border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-50 text-sm">关闭</button>
        <a :href="previewUrl" download class="px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 text-sm">下载 PDF</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const previewUrl = ref('')

const showPdf = (url) => {
  previewUrl.value = url
}

const close = () => {
  previewUrl.value = ''
}

defineExpose({
  showPdf
})
</script>
