<template>
  <Transition name="backtop">
    <button
      v-if="visible"
      @click="scrollToTop"
      class="fixed bottom-8 right-6 z-50 w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-md text-zinc-400 hover:text-zinc-600 hover:shadow-lg hover:border-zinc-300 transition-all duration-200 flex items-center justify-center"
      aria-label="回到顶部"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  threshold: {
    type: Number,
    default: 300
  }
})

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > props.threshold
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.backtop-enter-active,
.backtop-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.backtop-enter-from,
.backtop-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
