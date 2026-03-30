<template>
  <router-view />
  <Toast ref="toastRef" />
  <ConfirmDialog ref="confirmRef" />
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import Toast from './components/Toast.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import { setToastFunction } from './utils/api'

const toastRef = ref(null)
const confirmRef = ref(null)

function showToast(message, type = 'info', duration = 3000) {
  if (toastRef.value) {
    toastRef.value.show(message, type, duration)
  }
}

onMounted(() => {
  setToastFunction(showToast)
})

provide('toast', {
  show: showToast,
  success: (msg, dur) => showToast(msg, 'success', dur),
  error: (msg, dur) => showToast(msg, 'error', dur),
  warning: (msg, dur) => showToast(msg, 'warning', dur),
  info: (msg, dur) => showToast(msg, 'info', dur)
})

provide('confirm', {
  show: (message, confirmText, cancelText, title) => {
    if (confirmRef.value) {
      return confirmRef.value.show(message, confirmText, cancelText, title)
    }
    return Promise.resolve(false)
  }
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
