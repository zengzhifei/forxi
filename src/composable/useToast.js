import { createApp, ref } from 'vue'
import Toast from '../components/Toast.vue'

let toastInstance = null
const toastRef = ref(null)

export function useToast() {
  function show(message, type = 'info', duration = 3000) {
    if (toastRef.value) {
      toastRef.value.show(message, type, duration)
    }
  }
  
  function success(message, duration = 3000) {
    show(message, 'success', duration)
  }
  
  function error(message, duration = 3000) {
    show(message, 'error', duration)
  }
  
  function warning(message, duration = 3000) {
    show(message, 'warning', duration)
  }
  
  function info(message, duration = 3000) {
    show(message, 'info', duration)
  }
  
  return {
    show,
    success,
    error,
    warning,
    info
  }
}

export function registerToast(ref) {
  toastRef.value = ref
}
