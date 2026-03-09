<template>
  <router-view />
  <Toast ref="toastRef" />
</template>

<script setup>
import { ref } from 'vue'
import Toast from './components/Toast.vue'

const toastRef = ref(null)

// 提供全局 toast 方法
import { provide } from 'vue'

function showToast(message, type = 'info', duration = 3000) {
  if (toastRef.value) {
    toastRef.value.show(message, type, duration)
  }
}

provide('toast', {
  show: showToast,
  success: (msg, dur) => showToast(msg, 'success', dur),
  error: (msg, dur) => showToast(msg, 'error', dur),
  warning: (msg, dur) => showToast(msg, 'warning', dur),
  info: (msg, dur) => showToast(msg, 'info', dur)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  color: #333;
  background-color: #f9fafb;
}

html {
  scroll-behavior: smooth;
}
</style>
