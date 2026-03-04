<template>
  <div class="min-h-screen text-white flex flex-col items-center justify-center font-sans overflow-hidden relative" :style="pageStyle">
    
    <!-- Background: Sophisticated Animated Mesh -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-blob" :style="blobStyle1"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-blob animation-delay-2000" :style="blobStyle2"></div>
      <div class="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full blur-[100px] animate-blob animation-delay-4000" :style="blobStyle3"></div>
      
      <!-- Subtle Grid Overlay -->
      <div class="absolute inset-0 opacity-[0.12]" 
           :style="gridOverlayStyle">
      </div>
    </div>

    <!-- Main Content: Glassmorphism Card -->
    <main class="relative z-10 flex flex-col items-center px-6 py-12 md:px-24 md:py-20 rounded-[40px] border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-2xl transition-all duration-700 hover:bg-white/[0.04] hover:border-white/20 group">
      
      <!-- Time Display -->
      <div class="relative mb-6">
        <h1 class="text-[14vw] md:text-[10vw] font-extralight tracking-tight leading-none tabular-nums text-white drop-shadow-2xl flex gap-1">
          <span class="transition-colors duration-500" :style="{ color: theme.accentSoft }">{{ timeParts.h }}</span>
          <span class="animate-pulse opacity-60" :style="{ color: theme.accent }">:</span>
          <span class="transition-colors duration-500" :style="{ color: theme.accentSoft }">{{ timeParts.m }}</span>
          <span class="animate-pulse opacity-60" :style="{ color: theme.accent }">:</span>
          <span class="transition-colors duration-500" :style="{ color: theme.accentSoft }">{{ timeParts.s }}</span>
        </h1>
        
        <!-- Animated underline -->
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] group-hover:w-full transition-all duration-1000 ease-out" :style="underlineStyle"></div>
      </div>

      <!-- Date Display -->
      <div class="flex flex-col items-center">
        <div class="text-lg md:text-2xl font-light text-gray-400 tracking-[0.4em] uppercase mb-1">
          {{ dateParts.weekday }}
        </div>
        <div class="text-sm md:text-lg font-medium tracking-[0.2em] uppercase" :style="{ color: theme.accentSoft }">
          {{ dateParts.rest }}
        </div>
      </div>

    <!-- Bottom Status (Very Subtle) -->
    <div class="absolute bottom-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div class="flex gap-1">
        <div v-for="i in 3" :key="i" class="w-1 h-1 rounded-full animate-bounce" :style="{ backgroundColor: theme.accent, animationDelay: `${i * 0.2}s` }"></div>
      </div>
      <span class="text-[10px] text-gray-500 tracking-widest uppercase">Live Matrix Sync</span>
    </div>


    </main>

    <!-- Edge Decorative Elements -->
    <div class="absolute top-12 left-12 border-l border-t border-white/10 w-8 h-8 opacity-50"></div>
    <div class="absolute bottom-12 right-12 border-r border-b border-white/10 w-8 h-8 opacity-50"></div>
    
    <!-- Theme Selector -->
    <div class="absolute top-6 right-6 z-50 pointer-events-auto theme-selector">
      <button
        v-for="(key, index) in themeKeys.slice(0, 3)"
        :key="key"
        class="theme-chip"
        :class="manualTheme === key ? 'selected' : ''"
        :style="[
          chipStyle(key),
          { '--chip-index': index }
        ]"
        :aria-pressed="manualTheme === key"
        :title="key.toUpperCase()"
        :data-theme="key"
        :data-index="index"
        @click.stop="handleThemeSelect(key)"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const currentTime = ref(new Date())
const timer = ref(null)
const manualTheme = ref('dawn')

// Split time into parts for separate styling/interaction
const timeParts = computed(() => ({
  h: currentTime.value.getHours().toString().padStart(2, '0'),
  m: currentTime.value.getMinutes().toString().padStart(2, '0'),
  s: currentTime.value.getSeconds().toString().padStart(2, '0')
}))

// Split date for hierarchy
const dateParts = computed(() => {
  const weekday = currentTime.value.toLocaleDateString('en-US', { weekday: 'long' })
  const rest = currentTime.value.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return { weekday, rest }
})

// Beautiful themes
const THEMES = {
  dawn: {
    name: 'Dawn',
    bg: '#0b0a12',
    accent: '#ff9acd',
    accentSoft: 'rgba(255, 154, 205, 0.85)',
    blob1: 'rgba(255, 183, 77, 0.22)',
    blob2: 'rgba(255, 99, 71, 0.2)',
    blob3: 'rgba(255, 255, 153, 0.12)',
    grid: '#ff9acd'
  },
  day: {
    name: 'Day',
    bg: '#0b0e1a',
    accent: '#4f46e5',
    accentSoft: 'rgba(79, 70, 229, 0.85)',
    blob1: 'rgba(79, 70, 229, 0.22)',
    blob2: 'rgba(59, 130, 246, 0.2)',
    blob3: 'rgba(99, 102, 241, 0.12)',
    grid: '#4f46e5'
  },
  dusk: {
    name: 'Dusk',
    bg: '#090814',
    accent: '#ff6ad5',
    accentSoft: 'rgba(255, 106, 213, 0.85)',
    blob1: 'rgba(255, 105, 180, 0.22)',
    blob2: 'rgba(186, 85, 211, 0.2)',
    blob3: 'rgba(255, 140, 0, 0.12)',
    grid: '#ff6ad5'
  },
  night: {
    name: 'Night',
    bg: '#05060b',
    accent: '#00e5ff',
    accentSoft: 'rgba(0, 229, 255, 0.85)',
    blob1: 'rgba(0, 229, 255, 0.22)',
    blob2: 'rgba(0, 195, 255, 0.2)',
    blob3: 'rgba(0, 147, 233, 0.12)',
    grid: '#00e5ff'
  }
}

const theme = computed(() => THEMES[manualTheme.value])

// Styles derived from theme
const pageStyle = computed(() => ({
  background: `radial-gradient(1200px 800px at 50% 50%, ${theme.value.bg}, #000)`
}))
const themeKeys = computed(() => Object.keys(THEMES))
const chipStyle = (key) => {
  const t = THEMES[key]
  return {
    background: `linear-gradient(135deg, ${t.blob1}, ${t.blob2})`,
    boxShadow: `0 0 0 1px ${t.accentSoft}`,
  }
}
const blobStyle1 = computed(() => ({ backgroundColor: theme.value.blob1 }))
const blobStyle2 = computed(() => ({ backgroundColor: theme.value.blob2 }))
const blobStyle3 = computed(() => ({ backgroundColor: theme.value.blob3 }))
const gridOverlayStyle = computed(() => ({
  backgroundImage: `radial-gradient(${theme.value.grid} 0.5px, transparent 0.5px)`,
  backgroundSize: '24px 24px'
}))
const underlineStyle = computed(() => ({
  backgroundImage: `linear-gradient(to right, transparent, ${theme.value.accent}, transparent)`
}))

import { watch } from 'vue'

const updateTime = () => {
  currentTime.value = new Date()
}

const handleThemeSelect = (themeKey) => {
  manualTheme.value = themeKey
  expanded.value = false
}

onMounted(() => {
  timer.value = setInterval(updateTime, 1000)
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
  expanded.value = false
})

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
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
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}

/* Base resets if not already globally applied */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Theme Selector Styles */
.theme-selector {
  position: relative;
  width: auto;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

/* Theme Chip Styles */
.theme-chip {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
}

.theme-chip:hover {
  transform: scale(1.15);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.theme-chip.selected {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
  transform: scale(1.15);
}

.theme-chip.selected::after {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .theme-selector {
    height: 20px;
    gap: 6px;
  }
  
  .theme-chip {
    width: 14px;
    height: 14px;
  }
  
  /* Ensure hover effects work on mobile */
  main {
    /* Simulate hover effect on mobile */
    @media (hover: none) and (pointer: coarse) {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }
  
  /* Ensure underline and status elements are visible on mobile */
  @media (hover: none) and (pointer: coarse) {
    .group-hover\:w-full {
      width: 100%;
    }
    
    .group-hover\:opacity-100 {
      opacity: 1;
    }
  }
}
</style>
