<script setup>
import { ref, computed } from 'vue'

const mimeTypesData = {
  'text/plain': ['txt', 'text', 'conf', 'def', 'list', 'log', 'in'],
  'text/html': ['html', 'htm', 'shtml'],
  'text/css': ['css'],
  'text/javascript': ['js', 'mjs'],
  'text/xml': ['xml', 'xsl', 'xsd'],
  'text/markdown': ['md', 'markdown'],
  'text/csv': ['csv'],
  'application/json': ['json', 'map'],
  'application/javascript': ['js'],
  'application/xml': ['xml'],
  'application/pdf': ['pdf'],
  'application/zip': ['zip'],
  'application/gzip': ['gz', 'gzip'],
  'application/x-tar': ['tar'],
  'application/x-rar-compressed': ['rar'],
  'application/x-7z-compressed': ['7z'],
  'application/x-bzip2': ['bz2'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'application/vnd.ms-excel': ['xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
  'application/vnd.ms-powerpoint': ['ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['pptx'],
  'application/octet-stream': ['bin', 'exe', 'dll', 'so', 'dmg'],
  'application/x-iso9660-image': ['iso'],
  'image/jpeg': ['jpg', 'jpeg', 'jfif'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'image/bmp': ['bmp'],
  'image/webp': ['webp'],
  'image/svg+xml': ['svg'],
  'image/x-icon': ['ico'],
  'audio/mpeg': ['mp3', 'mpga', 'mpega'],
  'audio/wav': ['wav'],
  'audio/ogg': ['ogg'],
  'audio/flac': ['flac'],
  'video/mp4': ['mp4', 'm4v'],
  'video/mpeg': ['mpeg', 'mpg'],
  'video/webm': ['webm'],
  'video/avi': ['avi'],
  'video/quicktime': ['mov'],
  'video/x-msvideo': ['avi'],
  'video/x-matroska': ['mkv'],
  'font/ttf': ['ttf'],
  'font/otf': ['otf'],
  'font/woff': ['woff'],
  'font/woff2': ['woff2'],
  'application/atom+xml': ['atom'],
  'application/rss+xml': ['rss'],
}

const mimeTypeOptions = Object.keys(mimeTypesData).map(mime => ({
  label: mime,
  value: mime,
}))

const extensionOptions = []
for (const [mime, exts] of Object.entries(mimeTypesData)) {
  for (const ext of exts) {
    extensionOptions.push({
      label: `.${ext}`,
      value: ext,
      mime,
    })
  }
}

const selectedMime = ref('')
const selectedExtension = ref('')

const extensionsForMime = computed(() => {
  if (!selectedMime.value) return []
  return mimeTypesData[selectedMime.value] || []
})

const mimeForExtension = computed(() => {
  if (!selectedExtension.value) return ''
  for (const [mime, exts] of Object.entries(mimeTypesData)) {
    if (exts.includes(selectedExtension.value)) {
      return mime
    }
  }
  return ''
})

const allMimeTypes = computed(() => {
  return Object.entries(mimeTypesData).map(([mime, exts]) => ({
    mime,
    extensions: exts,
  }))
})

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="h-full flex flex-col overflow-auto">
    <div class="grid md:grid-cols-2 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">MIME 类型 → 扩展名</h3>
        <p class="text-sm text-gray-500 mb-3">查找 MIME 类型对应的文件扩展名</p>
        <select
          v-model="selectedMime"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
        >
          <option value="">选择 MIME 类型...</option>
          <option v-for="opt in mimeTypeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <div v-if="extensionsForMime.length > 0" class="mt-3">
          <span class="text-sm text-gray-600">扩展名: </span>
          <span v-for="ext in extensionsForMime" :key="ext" class="inline-block px-2 py-1 mr-1 mb-1 bg-zinc-100 text-zinc-700 rounded text-sm">
            .{{ ext }}
          </span>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">扩展名 → MIME 类型</h3>
        <p class="text-sm text-gray-500 mb-3">查找文件扩展名对应的 MIME 类型</p>
        <select
          v-model="selectedExtension"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
        >
          <option value="">选择扩展名...</option>
          <option v-for="opt in extensionOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <div v-if="mimeForExtension" class="mt-3">
          <span class="text-sm text-gray-600">MIME 类型: </span>
          <span class="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-sm font-mono">
            {{ mimeForExtension }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-auto">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">常用 MIME 类型对照表</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left font-medium text-gray-500">MIME 类型</th>
              <th class="px-4 py-2 text-left font-medium text-gray-500">文件扩展名</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in allMimeTypes" :key="item.mime" class="border-t border-gray-100">
              <td class="px-4 py-2 font-mono text-zinc-600">{{ item.mime }}</td>
              <td class="px-4 py-2">
                <span v-for="ext in item.extensions" :key="ext" class="inline-block px-1.5 py-0.5 mr-1 mb-1 bg-gray-100 text-gray-700 rounded text-xs">
                  .{{ ext }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
