<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </span>
        字符串转 Base64
      </h3>
      <textarea 
        v-model="input.text" 
        class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono text-sm"
        rows="4"
        placeholder="请输入要转换的字符串..."
      ></textarea>
      <div class="mt-4 flex gap-3">
        <button @click="encode" class="px-5 py-2.5 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-all font-medium">编码</button>
        <button @click="copy(output.text)" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium" :disabled="!output.text">复制结果</button>
      </div>
      <div v-if="output.text" class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">编码结果：</label>
        <textarea 
          :value="output.text" 
          readonly
          class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
          rows="4"
        ></textarea>
      </div>
    </div>
    
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </span>
        Base64 转字符串
      </h3>
      <textarea 
        v-model="input.base64" 
        class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono text-sm"
        rows="4"
        placeholder="请输入 Base64 字符串..."
      ></textarea>
      <div class="mt-4 flex gap-3">
        <button @click="decode" class="px-5 py-2.5 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-all font-medium">解码</button>
        <button @click="copy(output.decoded)" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium" :disabled="!output.decoded">复制结果</button>
      </div>
      <div v-if="output.decoded" class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">解码结果：</label>
        <textarea 
          :value="output.decoded" 
          readonly
          class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
          rows="4"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, inject } from 'vue'

const toast = inject('toast')

const input = reactive({ text: '', base64: '' })
const output = reactive({ text: '', decoded: '' })

function encode() {
  try {
    output.text = btoa(unescape(encodeURIComponent(input.text)))
  } catch (e) {
    output.text = '编码错误'
  }
}

function decode() {
  try {
    output.decoded = decodeURIComponent(escape(atob(input.base64)))
  } catch (e) {
    output.decoded = '解码错误'
  }
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
