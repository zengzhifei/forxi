<template>
  <div class="relative" ref="containerRef">
    <button
      type="button"
      @click="toggle"
      class="w-full px-4 py-3 border border-zinc-200 rounded-xl bg-white text-zinc-700 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 transition-all"
    >
      <span :class="modelValue ? 'text-zinc-700' : 'text-zinc-400'">
        {{ selectedLabel || placeholder }}
      </span>
      <svg class="w-4 h-4 text-zinc-400 transition-transform" :class="{ 'rotate-180': open }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="open"
      class="absolute z-50 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden"
    >
      <div class="p-2 border-b border-zinc-100">
        <input
          ref="searchRef"
          v-model="search"
          type="text"
          class="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-300 focus:border-zinc-400 bg-zinc-50 text-zinc-700 placeholder-zinc-300"
          placeholder="搜索模型..."
          @keydown.esc="close"
        />
      </div>
      <ul class="max-h-60 overflow-y-auto py-1">
        <li
          v-for="option in filtered"
          :key="option.id"
          @click="select(option)"
          class="px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between"
          :class="option.id === modelValue ? 'bg-zinc-100 text-zinc-700 font-medium' : 'text-zinc-600 hover:bg-zinc-50'"
        >
          <span>{{ option.display_name }}</span>
          <svg v-if="option.id === modelValue" class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </li>
        <li v-if="filtered.length === 0" class="px-4 py-3 text-sm text-zinc-400 text-center">
          无匹配结果
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: String,
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '请选择' }
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const search = ref('')
const containerRef = ref(null)
const searchRef = ref(null)

const selectedLabel = computed(() => {
  const found = props.options.find(o => o.id === props.modelValue)
  return found ? found.display_name : ''
})

const filtered = computed(() => {
  if (!search.value.trim()) return props.options
  const q = search.value.trim().toLowerCase()
  return props.options.filter(o =>
    o.display_name.toLowerCase().includes(q) ||
    o.id.toLowerCase().includes(q)
  )
})

const toggle = () => {
  open.value = !open.value
  if (open.value) {
    search.value = ''
    nextTick(() => searchRef.value?.focus())
  }
}

const close = () => {
  open.value = false
}

const select = (option) => {
  emit('update:modelValue', option.id)
  close()
}

const onClickOutside = (e) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    close()
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>
