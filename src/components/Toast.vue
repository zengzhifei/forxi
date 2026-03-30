<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" class="fixed top-[72px] right-4 z-50 w-72 lg:top-4">
        <div class="bg-white rounded-xl shadow-md border border-zinc-200 overflow-hidden flex flex-col">

          <div class="flex items-center gap-3 px-4 py-3">
            <div
              class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
              :class="iconBgClass"
            >
              <svg v-if="type === 'success'" class="w-3.5 h-3.5" :class="iconColorClass" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else-if="type === 'error'" class="w-3.5 h-3.5" :class="iconColorClass" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <svg v-else-if="type === 'warning'" class="w-3.5 h-3.5" :class="iconColorClass" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 3.5h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <svg v-else class="w-3.5 h-3.5" :class="iconColorClass" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <p class="flex-1 min-w-0 text-sm text-zinc-700 break-words">{{ message }}</p>

            <button
              @click="close"
              class="flex-shrink-0 text-zinc-300 hover:text-zinc-500 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="h-0.5 w-full" :class="progressTrackClass">
            <div
              class="h-full toast-progress"
              :class="progressBarClass"
              :key="animKey"
              :style="{ animationDuration: animDuration + 'ms' }"
            ></div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('info')
const animKey = ref(0)
const animDuration = ref(3000)

const config = {
  success: {
    iconBg:        'bg-green-50',
    iconColor:     'text-green-500',
    progressTrack: 'bg-zinc-100',
    progressBar:   'bg-green-400'
  },
  error: {
    iconBg:        'bg-red-50',
    iconColor:     'text-red-500',
    progressTrack: 'bg-zinc-100',
    progressBar:   'bg-red-400'
  },
  warning: {
    iconBg:        'bg-amber-50',
    iconColor:     'text-amber-500',
    progressTrack: 'bg-zinc-100',
    progressBar:   'bg-amber-400'
  },
  info: {
    iconBg:        'bg-zinc-100',
    iconColor:     'text-zinc-500',
    progressTrack: 'bg-zinc-100',
    progressBar:   'bg-zinc-400'
  }
}

const iconBgClass        = computed(() => (config[type.value] ?? config.info).iconBg)
const iconColorClass     = computed(() => (config[type.value] ?? config.info).iconColor)
const progressTrackClass = computed(() => (config[type.value] ?? config.info).progressTrack)
const progressBarClass   = computed(() => (config[type.value] ?? config.info).progressBar)

let timer = null

function show(msg, msgType = 'info', duration = 3000) {
  if (timer) clearTimeout(timer)
  message.value = msg
  type.value = msgType
  animDuration.value = duration
  animKey.value++
  visible.value = true
  if (duration > 0) {
    timer = setTimeout(close, duration)
  }
}

function close() {
  visible.value = false
  if (timer) clearTimeout(timer)
}

defineExpose({ show, close })
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 0.18s ease-in;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(calc(100% + 1rem));
}

@keyframes toast-shrink {
  from { width: 100%; }
  to   { width: 0%; }
}

.toast-progress {
  width: 100%;
  animation-name: toast-shrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
</style>
