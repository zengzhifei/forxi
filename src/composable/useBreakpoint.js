import { ref, onMounted, onUnmounted } from 'vue'

export function useBreakpoint() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
  
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  }
  
  const isMobile = ref(width.value < breakpoints.lg)
  
  function handleResize() {
    width.value = window.innerWidth
    isMobile.value = width.value < breakpoints.lg
  }
  
  onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
  
  return {
    width,
    isMobile,
    breakpoints
  }
}
