<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </span>
      Markdown 转 HTML
    </h3>
    <textarea 
      v-model="input" 
      class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
      rows="6"
      placeholder="请输入 Markdown 文本..."
    ></textarea>
    <div class="mt-4 flex gap-3">
      <button @click="convert" class="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg shadow-pink-500/25 font-medium">转换</button>
      <button @click="copy(output)" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium">复制 HTML</button>
    </div>
    <div v-if="output" class="mt-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">HTML 结果：</label>
      <textarea 
        :value="output" 
        readonly
        class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
        rows="6"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const toast = inject('toast')

const input = ref('')
const output = ref('')

function convert() {
  let text = input.value
  
  // 标题
  text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  
  // 粗体
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // 斜体
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // 删除线
  text = text.replace(/~~(.*?)~~/g, '<del>$1</del>')
  
  // 链接
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
  
  // 图片
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">')
  
  // 代码块
  text = text.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
  
  // 行内代码
  text = text.replace(/`(.*?)`/g, '<code>$1</code>')
  
  // 引用
  text = text.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
  
  // 无序列表
  text = text.replace(/^\* (.*$)/gim, '<li>$1</li>')
  text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  
  // 有序列表
  text = text.replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
  
  // 换行
  text = text.replace(/\n/g, '<br>')
  
  output.value = text
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
