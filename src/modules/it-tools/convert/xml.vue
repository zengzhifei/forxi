<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </span>
      XML 格式化
    </h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">输入 XML</label>
        <textarea 
          v-model="input" 
          class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
          rows="8"
          placeholder="请输入 XML..."
        ></textarea>
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="format" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">格式化</button>
        <button @click="minify" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">压缩</button>
        <button @click="copy(output)" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">复制</button>
      </div>
      <div v-if="output">
        <label class="block text-sm font-medium text-gray-700 mb-2">结果：</label>
        <textarea 
          :value="output" 
          readonly
          class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
          rows="8"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const toast = inject('toast')

const input = ref('')
const output = ref('')

function format() {
  if (!input.value.trim()) {
    toast.warning('请输入 XML')
    return
  }
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input.value, 'text/xml')
    const error = doc.querySelector('parsererror')
    if (error) {
      toast.error('XML 格式不正确')
      return
    }
    const serializer = new XMLSerializer()
    let xml = serializer.serializeToString(doc)
    xml = xml.replace(/(>)(<)(\/*)/g, '$1\n$2$3')
    xml = xml.replace(/^\s+/gm, '')
    output.value = formatXml(xml)
  } catch (e) {
    toast.error('XML 格式不正确')
  }
}

function formatXml(xml) {
  let formatted = ''
  let indent = ''
  xml.split(/>\s*</).forEach(node => {
    if (node.match(/^\/\w/)) {
      indent = indent.replace(/^/, '')
    } else if (node.match(/^<?\w[^>]*[^\/]$/)) {
    } else {
    }
    formatted += indent + '<' + node + '>\n'
    if (node.match(/^<?\w[^>]*[^\/]$/)) {
      indent += '  '
    }
  })
  return formatted.replace(/^\n/, '').replace(/\n$/, '')
}

function minify() {
  if (!input.value.trim()) {
    toast.warning('请输入 XML')
    return
  }
  output.value = input.value.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim()
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('复制成功！')
  } catch (e) {
    toast.error('复制失败')
  }
}
</script>
