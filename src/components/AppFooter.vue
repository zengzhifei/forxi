<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
      <div class="flex justify-center items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
        <a href="https://beian.miit.gov.cn" target="_blank" class="hover:text-gray-500">{{ icpNumber }}</a>
        <span class="cursor-default">·</span>
        <router-link to="/terms" class="hover:text-gray-500">服务条款</router-link>
        <span class="cursor-default">·</span>
        <router-link to="/privacy" class="hover:text-gray-500">隐私协议</router-link>
        <span class="cursor-default">·</span>
        <button @click="openFeedback" class="hover:text-gray-500 cursor-pointer">反馈</button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { inject } from 'vue'

const icpNumber = '陕ICP备2026004216号'

const feedback = inject('feedback', null)

function openFeedback() {
  if (feedback?.open) {
    feedback.open()
  }
}
</script>
