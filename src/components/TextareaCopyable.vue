<template>
  <div class="relative">
    <textarea
      :value="value"
      class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      :rows="rows"
      :placeholder="placeholder"
      readonly
    ></textarea>
    <button
      @click="handleCopy"
      class="absolute top-2 right-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
      title="复制到剪贴板"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { copy } from '../composable/copy'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 4
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['copy'])

async function handleCopy() {
  const success = await copy(props.value)
  if (success) {
    emit('copy')
  }
}
</script>