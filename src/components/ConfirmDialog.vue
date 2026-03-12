<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" @click.self="handleCancel">
        <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
          <p class="text-gray-600 mb-6">{{ message }}</p>
          <div class="flex gap-3 justify-end">
            <button @click="handleCancel" class="px-4 py-2 text-gray-600 hover:text-gray-800">{{ cancelText }}</button>
            <button @click="handleConfirm" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const title = ref('确认操作')
const message = ref('')
const confirmText = ref('确认')
const cancelText = ref('取消')

let resolveFn = null

const show = (msg, confirmBtnText = '确认', cancelBtnText = '取消', titleText = '确认操作') => {
  message.value = msg
  confirmText.value = confirmBtnText
  cancelText.value = cancelBtnText
  title.value = titleText
  visible.value = true
  
  return new Promise((resolve) => {
    resolveFn = resolve
  })
}

const handleConfirm = () => {
  visible.value = false
  if (resolveFn) {
    resolveFn(true)
    resolveFn = null
  }
}

const handleCancel = () => {
  visible.value = false
  if (resolveFn) {
    resolveFn(false)
    resolveFn = null
  }
}

defineExpose({ show })
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
