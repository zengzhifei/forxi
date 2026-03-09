<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </span>
        URL 编码
      </h3>
      <textarea 
        v-model="input.text" 
        class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        rows="4"
        placeholder="请输入要编码的 URL..."
      ></textarea>
      <div class="mt-4 flex gap-3">
        <button @click="encode" class="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/25 font-medium">编码</button>
        <button @click="copy(output.encoded)" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium" :disabled="!output.encoded">复制结果</button>
      </div>
      <div v-if="output.encoded" class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">编码结果：</label>
        <textarea 
          :value="output.encoded" 
          readonly
          class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50"
          rows="4"
        ></textarea>
      </div>
    </div>
    
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span class="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </span>
        URL 解码
      </h3>
      <textarea 
        v-model="input.encoded" 
        class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        rows="4"
        placeholder="请输入要解码的 URL..."
      ></textarea>
      <div class="mt-4 flex gap-3">
        <button @click="decode" class="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg shadow-pink-500/25 font-medium">解码</button>
        <button @click="copy(output.decoded)" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium" :disabled="!output.decoded">复制结果</button>
      </div>
      <div v-if="output.decoded" class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">解码结果：</label>
        <textarea 
          :value="output.decoded" 
          readonly
          class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50"
          rows="4"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, inject } from 'vue'

const toast = inject('toast')

const input = reactive({ text: '', encoded: '' })
const output = reactive({ encoded: '', decoded: '' })

function encode() {
  try {
    output.encoded = encodeURIComponent(input.text)
  } catch (e) {
    output.encoded = '编码错误'
  }
}

function decode() {
  try {
    output.decoded = decodeURIComponent(input.encoded)
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
