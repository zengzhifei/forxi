<template>
  <div class="min-h-screen text-white flex flex-col items-center justify-center font-sans overflow-hidden relative" :style="pageStyle">
    
    <!-- Particle Background -->
    <canvas ref="particleCanvas" class="absolute inset-0 z-0"></canvas>
    
    <!-- Animated Gradient Background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full blur-[150px] animate-blob" :style="blobStyle1"></div>
      <div class="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full blur-[150px] animate-blob animation-delay-2000" :style="blobStyle2"></div>
      <div class="absolute top-[30%] right-[15%] w-[35%] h-[35%] rounded-full blur-[120px] animate-blob animation-delay-4000" :style="blobStyle3"></div>
      <div class="absolute bottom-[25%] left-[20%] w-[25%] h-[25%] rounded-full blur-[100px] animate-blob animation-delay-6000" :style="blobStyle4"></div>
    </div>

    <!-- Grid Overlay -->
    <div class="absolute inset-0 z-1 opacity-[0.08]" :style="gridOverlayStyle"></div>

    <!-- Main Content -->
    <main class="relative z-10 flex flex-col items-center px-8 py-16 md:px-32 md:py-24 rounded-[50px] border border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-2xl transition-all duration-700 hover:bg-white/[0.05] hover:border-white/25 hover:shadow-[0_0_60px_rgba(0,0,0,0.5)] group">
      
      <!-- Glowing Ring -->
      <div class="absolute inset-0 rounded-[50px] pointer-events-none" :style="ringStyle"></div>
      
      <!-- Time Display -->
      <div class="relative mb-8">
        <!-- Background Glow -->
        <div class="absolute inset-0 blur-[40px] opacity-50" :style="{ background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)` }"></div>
        
        <h1 class="relative text-[18vw] md:text-[12vw] font-extralight tracking-tight leading-none tabular-nums text-white drop-shadow-2xl flex gap-2 md:gap-3">
          <span class="digit-container" :style="{ '--accent': theme.accent }">
            <span class="digit" :style="{ color: theme.accentSoft, textShadow: `0 0 30px ${theme.accent}` }">{{ timeParts.h }}</span>
          </span>
          <span class="animate-pulse opacity-70" :style="{ color: theme.accent, textShadow: `0 0 20px ${theme.accent}` }">:</span>
          <span class="digit-container" :style="{ '--accent': theme.accent }">
            <span class="digit" :style="{ color: theme.accentSoft, textShadow: `0 0 30px ${theme.accent}` }">{{ timeParts.m }}</span>
          </span>
          <span class="animate-pulse opacity-70" :style="{ color: theme.accent, textShadow: `0 0 20px ${theme.accent}` }">:</span>
          <span class="digit-container" :style="{ '--accent': theme.accent }">
            <span class="digit" :style="{ color: theme.accentSoft, textShadow: `0 0 30px ${theme.accent}` }">{{ timeParts.s }}</span>
          </span>
        </h1>
        
        <!-- Animated Underline -->
        <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-[2px] group-hover:w-full transition-all duration-1000 ease-out" :style="underlineStyle"></div>
      </div>

      <!-- Date Display -->
      <div class="flex flex-col items-center mb-6">
        <div class="text-xl md:text-3xl font-light text-gray-300 tracking-[0.5em] uppercase mb-2 drop-shadow-lg">
          {{ dateParts.weekday }}
        </div>
        <div class="text-base md:text-xl font-medium tracking-[0.3em] uppercase" :style="{ color: theme.accentSoft, textShadow: `0 0 20px ${theme.accent}` }">
          {{ dateParts.rest }}
        </div>
      </div>

      <!-- Animated Progress Bar -->
      <div class="w-full max-w-md h-1 bg-white/10 rounded-full overflow-hidden mb-6">
        <div class="h-full rounded-full transition-all duration-1000 ease-linear" :style="progressBarStyle"></div>
      </div>

      <!-- Bottom Status -->
      <div class="absolute bottom-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div class="flex gap-1">
          <div v-for="i in 4" :key="i" class="w-1.5 h-1.5 rounded-full animate-bounce" :style="{ backgroundColor: theme.accent, animationDelay: `${i * 0.15}s`, boxShadow: `0 0 10px ${theme.accent}` }"></div>
        </div>
        <span class="text-[11px] text-gray-400 tracking-widest uppercase font-light">Quantum Time Sync</span>
      </div>

      <!-- Corner Decorations -->
      <div class="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/20 rounded-tl-lg"></div>
      <div class="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/20 rounded-tr-lg"></div>
      <div class="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/20 rounded-bl-lg"></div>
      <div class="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/20 rounded-br-lg"></div>
    </main>

    <!-- Floating Elements -->
    <div class="absolute top-20 left-20 w-2 h-2 rounded-full animate-float opacity-50" :style="{ backgroundColor: theme.accent, boxShadow: `0 0 15px ${theme.accent}` }"></div>
    <div class="absolute top-40 right-32 w-1.5 h-1.5 rounded-full animate-float animation-delay-1000 opacity-40" :style="{ backgroundColor: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }"></div>
    <div class="absolute bottom-32 left-32 w-2.5 h-2.5 rounded-full animate-float animation-delay-2000 opacity-30" :style="{ backgroundColor: theme.accent, boxShadow: `0 0 20px ${theme.accent}` }"></div>
    <div class="absolute bottom-20 right-20 w-1.5 h-1.5 rounded-full animate-float animation-delay-3000 opacity-40" :style="{ backgroundColor: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }"></div>

    <!-- Theme Selector -->
    <div class="absolute top-8 right-8 z-50 pointer-events-auto theme-selector">
      <div class="theme-selector-container">
        <button
          v-for="(key, index) in themeKeys"
          :key="key"
          class="theme-chip"
          :class="manualTheme === key ? 'selected' : ''"
          :style="chipStyle(key)"
          :aria-pressed="manualTheme === key"
          :title="THEMES[key].name"
          @click.stop="handleThemeSelect(key)"
        >
          <span v-if="manualTheme === key" class="theme-chip-dot"></span>
        </button>
      </div>
    </div>

    <!-- Clock Ring Animation -->
    <div class="absolute inset-0 pointer-events-none z-5">
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          :stroke="theme.accent"
          stroke-width="0.1"
          opacity="0.1"
          class="animate-spin-slow"
        />
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          :stroke="theme.accent"
          stroke-width="0.05"
          opacity="0.05"
          class="animate-spin-reverse"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

const currentTime = ref(new Date())
const timer = ref(null)
const manualTheme = ref('dawn')
const particleCanvas = ref(null)
const particles = ref([])
const animationFrame = ref(null)

const timeParts = computed(() => ({
  h: currentTime.value.getHours().toString().padStart(2, '0'),
  m: currentTime.value.getMinutes().toString().padStart(2, '0'),
  s: currentTime.value.getSeconds().toString().padStart(2, '0')
}))

const dateParts = computed(() => {
  const weekday = currentTime.value.toLocaleDateString('en-US', { weekday: 'long' })
  const rest = currentTime.value.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return { weekday, rest }
})

const THEMES = {
  dawn: {
    name: 'Dawn',
    bg: '#0a0a1a',
    accent: '#ff6b9d',
    accentSoft: 'rgba(255, 107, 157, 0.9)',
    blob1: 'rgba(255, 107, 157, 0.3)',
    blob2: 'rgba(255, 154, 108, 0.25)',
    blob3: 'rgba(255, 206, 86, 0.2)',
    blob4: 'rgba(255, 107, 157, 0.15)',
    grid: '#ff6b9d'
  },
  day: {
    name: 'Day',
    bg: '#0a0f1e',
    accent: '#4f46e5',
    accentSoft: 'rgba(79, 70, 229, 0.9)',
    blob1: 'rgba(79, 70, 229, 0.3)',
    blob2: 'rgba(59, 130, 246, 0.25)',
    blob3: 'rgba(99, 102, 241, 0.2)',
    blob4: 'rgba(79, 70, 229, 0.15)',
    grid: '#4f46e5'
  },
  dusk: {
    name: 'Dusk',
    bg: '#0a0a18',
    accent: '#ff4081',
    accentSoft: 'rgba(255, 64, 129, 0.9)',
    blob1: 'rgba(255, 64, 129, 0.3)',
    blob2: 'rgba(236, 64, 122, 0.25)',
    blob3: 'rgba(255, 112, 67, 0.2)',
    blob4: 'rgba(255, 64, 129, 0.15)',
    grid: '#ff4081'
  },
  night: {
    name: 'Night',
    bg: '#050510',
    accent: '#00bcd4',
    accentSoft: 'rgba(0, 188, 212, 0.9)',
    blob1: 'rgba(0, 188, 212, 0.3)',
    blob2: 'rgba(0, 150, 136, 0.25)',
    blob3: 'rgba(0, 229, 255, 0.2)',
    blob4: 'rgba(0, 188, 212, 0.15)',
    grid: '#00bcd4'
  },
  neon: {
    name: 'Neon',
    bg: '#0a0a0a',
    accent: '#00ff88',
    accentSoft: 'rgba(0, 255, 136, 0.9)',
    blob1: 'rgba(0, 255, 136, 0.3)',
    blob2: 'rgba(0, 255, 204, 0.25)',
    blob3: 'rgba(0, 204, 255, 0.2)',
    blob4: 'rgba(0, 255, 136, 0.15)',
    grid: '#00ff88'
  }
}

const theme = computed(() => THEMES[manualTheme.value])

const pageStyle = computed(() => ({
  background: `radial-gradient(ellipse at center, ${theme.value.bg} 0%, #000000 100%)`
}))

const themeKeys = computed(() => Object.keys(THEMES))

const chipStyle = (key) => {
  const t = THEMES[key]
  return {
    background: `linear-gradient(135deg, ${t.blob1}, ${t.blob2})`,
    boxShadow: `0 0 0 1px ${t.accentSoft}, 0 0 10px ${t.accent}`,
  }
}

const blobStyle1 = computed(() => ({ backgroundColor: theme.value.blob1 }))
const blobStyle2 = computed(() => ({ backgroundColor: theme.value.blob2 }))
const blobStyle3 = computed(() => ({ backgroundColor: theme.value.blob3 }))
const blobStyle4 = computed(() => ({ backgroundColor: theme.value.blob4 }))

const gridOverlayStyle = computed(() => ({
  backgroundImage: `radial-gradient(${theme.value.grid} 0.8px, transparent 0.8px)`,
  backgroundSize: '30px 30px'
}))

const underlineStyle = computed(() => ({
  backgroundImage: `linear-gradient(to right, transparent, ${theme.value.accent}, transparent)`,
  boxShadow: `0 0 10px ${theme.value.accent}`
}))

const ringStyle = computed(() => ({
  boxShadow: `inset 0 0 60px ${theme.value.accent}20`
}))

const progressBarStyle = computed(() => {
  const seconds = currentTime.value.getSeconds()
  const progress = (seconds / 60) * 100
  return {
    width: `${progress}%`,
    background: `linear-gradient(90deg, ${theme.value.accent}20, ${theme.value.accent}, ${theme.value.accent}20)`,
    boxShadow: `0 0 10px ${theme.value.accent}`
  }
})

const updateTime = () => {
  currentTime.value = new Date()
}

const handleThemeSelect = (themeKey) => {
  manualTheme.value = themeKey
}

const initParticles = () => {
  const canvas = particleCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  particles.value = []
  const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000))

  for (let i = 0; i < particleCount; i++) {
    particles.value.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2
    })
  }

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.value.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fillStyle = theme.value.accent
      ctx.globalAlpha = particle.opacity
      ctx.fill()
    })

    animationFrame.value = requestAnimationFrame(animateParticles)
  }

  animateParticles()
}

const handleResize = () => {
  const canvas = particleCanvas.value
  if (canvas) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    initParticles()
  }
}

onMounted(() => {
  timer.value = setInterval(updateTime, 1000)
  initParticles()
  window.addEventListener('resize', handleResize)

  try {
    const saved = localStorage.getItem('manualTheme')
    if (saved && THEMES[saved]) {
      manualTheme.value = saved
    }
  } catch (e) {}
})

watch(manualTheme, (val) => {
  try {
    localStorage.setItem('manualTheme', val)
  } catch (e) {}
})

watch(theme, () => {
  if (particleCanvas.value) {
    initParticles()
  }
})

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
  if (animationFrame.value) cancelAnimationFrame(animationFrame.value)
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 10s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-6000 {
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 60s linear infinite;
}

@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

.animate-spin-reverse {
  animation: spin-reverse 45s linear infinite;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.theme-selector {
  position: relative;
  z-index: 50;
}

.theme-selector-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.theme-selector-container:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.theme-chip {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-chip:hover {
  transform: scale(1.2);
}

.theme-chip.selected {
  transform: scale(1.3);
}

.theme-chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.digit-container {
  display: inline-block;
  position: relative;
}

.digit {
  display: inline-block;
  transition: all 0.3s ease;
}

.digit-container:hover .digit {
  transform: scale(1.05);
  text-shadow: 0 0 40px var(--accent);
}

@media (max-width: 768px) {
  .theme-selector-container {
    gap: 8px;
    padding: 6px 12px;
  }

  .theme-chip {
    width: 16px;
    height: 16px;
  }

  .theme-chip-dot {
    width: 5px;
    height: 5px;
  }

  main {
    padding: 3rem 1.5rem;
    border-radius: 30px;
  }

  @media (hover: none) and (pointer: coarse) {
    main {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.25);
    }

    .group-hover\:w-full {
      width: 100%;
    }

    .group-hover\:opacity-100 {
      opacity: 1;
    }
  }
}
</style>