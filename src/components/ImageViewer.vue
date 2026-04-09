<template>
  <Teleport to="body">
    <Transition name="viewer-fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
        @click="handleClose"
      >
        <div class="relative max-w-[90vw] max-h-[90vh]" @click.stop>
          <img
            ref="imgRef"
            :src="src"
            :alt="alt"
            class="max-w-full max-h-[90vh] object-contain cursor-zoom-out select-none"
            :class="{ 'cursor-grab': scale > 1, 'cursor-grabbing': isDragging }"
            @load="handleLoad"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
            @wheel="handleWheel"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            @dblclick="handleDoubleClick"
          />
        </div>

        <button
          @click="handleClose"
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4">
          <button
            @click.stop="handleZoomOut"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            :class="{ 'opacity-30 cursor-not-allowed': scale <= 0.5 }"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="text-white/70 text-xs sm:text-sm min-w-[50px] sm:min-w-[60px] text-center">{{ Math.round(scale * 100) }}%</span>
          <button
            @click.stop="handleZoomIn"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            :class="{ 'opacity-30 cursor-not-allowed': scale >= 4 }"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            @click.stop="handleReset"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
          <div class="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['update:visible'])

const imgRef = ref(null)
const scale = ref(1)
const loading = ref(true)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const handleClose = () => {
  emit('update:visible', false)
}

const handleLoad = () => {
  loading.value = false
}

const handleZoomIn = () => {
  if (scale.value < 4) {
    scale.value = Math.min(4, scale.value + 0.25)
    applyScale()
  }
}

const handleZoomOut = () => {
  if (scale.value > 0.25) {
    scale.value = Math.max(0.25, scale.value - 0.25)
    applyScale()
  }
}

const handleReset = () => {
  scale.value = 1
  position.value = { x: 0, y: 0 }
  if (imgRef.value) {
    imgRef.value.style.transform = 'scale(1) translate(0, 0)'
  }
}

const applyScale = () => {
  if (imgRef.value) {
    imgRef.value.style.transform = `scale(${scale.value}) translate(${position.value.x / scale.value}px, ${position.value.y / scale.value}px)`
  }
}

const handleMouseDown = (e) => {
  if (scale.value > 1) {
    isDragging.value = true
    dragStart.value = { x: e.clientX - position.value.x, y: e.clientY - position.value.y }
  }
}

const handleMouseMove = (e) => {
  if (isDragging.value) {
    position.value = {
      x: e.clientX - dragStart.value.x,
      y: e.clientY - dragStart.value.y
    }
    applyScale()
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

const handleDoubleClick = (e) => {
  if (scale.value > 1) {
    handleReset()
  } else {
    scale.value = 2
    applyScale()
  }
}

const handleWheel = (e) => {
  e.preventDefault()
  if (e.deltaY < 0) {
    handleZoomIn()
  } else {
    handleZoomOut()
  }
}

let lastTouchDistance = 0
const handleTouchStart = (e) => {
  if (e.touches.length === 1 && scale.value > 1) {
    isDragging.value = true
    dragStart.value = { x: e.touches[0].clientX - position.value.x, y: e.touches[0].clientY - position.value.y }
  } else if (e.touches.length === 2) {
    lastTouchDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
  }
}

const handleTouchMove = (e) => {
  e.preventDefault()
  if (e.touches.length === 1 && isDragging.value) {
    position.value = {
      x: e.touches[0].clientX - dragStart.value.x,
      y: e.touches[0].clientY - dragStart.value.y
    }
    applyScale()
  } else if (e.touches.length === 2) {
    const distance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    const delta = distance - lastTouchDistance
    if (delta > 10) {
      handleZoomIn()
      lastTouchDistance = distance
    } else if (delta < -10) {
      handleZoomOut()
      lastTouchDistance = distance
    }
  }
}

const handleTouchEnd = () => {
  isDragging.value = false
  lastTouchDistance = 0
}

const handleKeyDown = (e) => {
  if (!props.visible) return
  if (e.key === 'Escape') handleClose()
  if (e.key === '+' || e.key === '=') handleZoomIn()
  if (e.key === '-') handleZoomOut()
  if (e.key === '0') handleReset()
}

watch(() => props.visible, (val) => {
  if (val) {
    scale.value = 1
    position.value = { x: 0, y: 0 }
    loading.value = true
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.viewer-fade-enter-active,
.viewer-fade-leave-active {
  transition: opacity 0.2s ease;
}

.viewer-fade-enter-from,
.viewer-fade-leave-to {
  opacity: 0;
}
</style>
