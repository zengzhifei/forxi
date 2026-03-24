<template>
  <div class="min-h-screen bg-[#fafafa] text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <section class="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-white">
      <div class="absolute inset-0" style="background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 50%, #fafafa 100%);">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.9) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(245,245,250,0.7) 0%, transparent 50%);"></div>
      </div>

      <div class="relative z-10 max-w-5xl mx-auto px-6 text-center">

        <div class="relative inline-block opacity-0 animate-fade-in-up" style="animation-delay: 0.1s;">
          <!-- 背景光晕 -->
          <div class="absolute -inset-16 rounded-3xl blur-3xl opacity-40" style="background: radial-gradient(ellipse at center, rgba(161,161,170,0.3) 0%, transparent 70%);"></div>
          <!-- 装饰线 -->
          <div class="flex items-center gap-4 mb-6 justify-center">
            <div class="h-px w-12 bg-gradient-to-r from-transparent to-zinc-300"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
            <div class="h-px w-12 bg-gradient-to-l from-transparent to-zinc-300"></div>
          </div>
          <h1 class="relative font-serif tracking-[0.2em] leading-loose" style="font-size: clamp(1.4rem, 3.5vw, 2.5rem);">
            <span class="block text-hero-sub" style="font-size: clamp(0.85rem, 1.8vw, 1.1rem); letter-spacing: 0.35em; color: #a1a1aa; margin-bottom: 0.6rem; font-weight: 400;">愿你我</span>
            <span class="block text-hero-main" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 35%, #71717a 65%, #52525b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 500; letter-spacing: 0.18em; line-height: 1.8;">皆可成为自己的指路明灯</span>
          </h1>
          <!-- 底部装饰线 -->
          <div class="flex items-center gap-4 mt-6 justify-center">
            <div class="h-px w-8 bg-gradient-to-r from-transparent to-zinc-200"></div>
            <div class="w-1 h-1 rounded-full bg-zinc-200"></div>
            <div class="h-px w-20 bg-zinc-200"></div>
            <div class="w-1 h-1 rounded-full bg-zinc-200"></div>
            <div class="h-px w-8 bg-gradient-to-l from-transparent to-zinc-200"></div>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center gap-4 mt-12 opacity-0 animate-fade-in-up" style="animation-delay: 0.2s;">
          <button @click="scrollToTools" class="group relative px-8 py-4 rounded-full font-medium text-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-zinc-400/30 hover:scale-105 text-white" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)">
            <span class="relative z-10">
              求索
            </span>
          </button>
        </div>

      </div>

      <div class="absolute bottom-8 inset-x-0 flex justify-center animate-bounce z-20">
        <button @click="scrollToTools" class="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors duration-300">
          <svg class="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </button>
      </div>
    </section>

    <section id="tools" class="pt-16 pb-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-xl sm:text-2xl font-bold text-zinc-600 mb-4">此中有真意</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8 max-w-5xl mx-auto">
          <div
            v-for="(tool, index) in tools"
            :key="tool.title"
            :ref="el => { if (el) bookRefs[index] = el }"
            class="book group relative w-full cursor-pointer transition-all duration-700 hover:shadow-lg hover:shadow-zinc-300/30 hover:-translate-y-2"
            :style="{ animationDelay: `${index * 0.1}s`, perspective: '1400px' }"
            :class="[index >= 3 ? 'opacity-0 animate-fade-in-up' : '', activeBook === index ? 'is-in-view' : '']"
            @click="tool.onClick"
          >
            <!-- 书页厚度 -->
            <div class="absolute top-0 right-0 w-12 h-full rounded-r-xl bg-gradient-to-r from-zinc-300 to-zinc-200 shadow-inner"></div>
            
            <!-- 封面 -->
            <div class="page" style="z-index: 5;">
              <div class="front">
                <div class="cover h-full flex flex-col overflow-hidden rounded-xl">
                  <div class="cover-top flex-1 flex items-center justify-center transition-colors duration-300" :class="[activeBook === index ? tool.bgActive : tool.bgDefault, tool.bgHover]">
                    <component :is="tool.icon" class="w-12 h-12 transition-colors duration-300" :class="[activeBook === index ? tool.iconActive : tool.iconDefault, tool.iconHover]" />
                  </div>
                  <div class="cover-bottom flex-1 bg-white p-6 sm:p-8 flex flex-col">
                    <h3 class="text-xl font-semibold text-zinc-700 mb-3">{{ tool.title }}</h3>
                    <p class="text-zinc-400 mb-4 leading-relaxed text-sm">{{ tool.description }}</p>
                    <span class="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 mt-auto">
                      {{ tool.buttonText }}
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </div>
                </div>
              </div>
              <div class="back bg-zinc-100 rounded-xl"></div>
            </div>
            
            <!-- 内页 -->
            <div class="page" style="z-index: 4;">
              <div class="front bg-white rounded-xl border-r border-zinc-100 p-4"></div>
              <div class="back bg-zinc-100 rounded-xl"></div>
            </div>
            
            <div class="page" style="z-index: 3;">
              <div class="front bg-white rounded-xl border-r border-zinc-100 p-4"></div>
              <div class="back bg-zinc-100 rounded-xl"></div>
            </div>
            
            <div class="page" style="z-index: 2;">
              <div class="front bg-white rounded-xl border-r border-zinc-100 p-4"></div>
              <div class="back bg-zinc-100 rounded-xl"></div>
            </div>
            
            <div class="page" style="z-index: 1;">
              <div class="front bg-white rounded-xl border-r border-zinc-100 p-4"></div>
              <div class="back bg-zinc-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />

    <Transition name="fade-slide">
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 w-14 h-14 bg-zinc-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-zinc-700 transition-all duration-300 hover:scale-110 z-50 group"
      >
        <svg class="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, h } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const showBackToTop = ref(false)
const bookRefs = ref([])
const activeBook = ref(-1)
let rafId = null
let bookObserver = null

const FileIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
    ])
  }
}

const ImageIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' })
    ])
  }
}

const AIIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' })
    ])
  }
}

const ToolsIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' })
    ])
  }
}

const JetbrainsIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '32', height: '32', fill: 'none', viewBox: '0 0 32 32' }, [
      h('defs', null, [
        h('linearGradient', { id: 'a', x1: '.425', x2: '31.31', y1: '31.36', y2: '.905', gradientUnits: 'userSpaceOnUse' }, [
          h('stop', { 'stop-color': 'currentColor' }),
          h('stop', { offset: '.43', 'stop-color': 'currentColor' }),
          h('stop', { offset: '.99', 'stop-color': 'currentColor' })
        ])
      ]),
      h('path', { fill: 'currentColor', d: 'm10.17 1.83-8.34 8.34C.66 11.34 0 12.93 0 14.59V29.5C0 30.88 1.12 32 2.5 32h14.91c1.66 0 3.245-.66 4.42-1.83l8.34-8.34c1.17-1.17 1.83-2.76 1.83-4.42V2.5C32 1.12 30.88 0 29.5 0H14.59c-1.66 0-3.245.66-4.42 1.83Z' }),
      h('path', { fill: '#666', d: 'M24 8H4v20h20V8Z' }),
      h('path', { fill: '#fff', d: 'M15 24H6v2h9v-2Z' })
    ])
  }
}

const ComingIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' })
    ])
  }
}


const tools = [
  {
    title: '文件预览',
    description: 'Word、Excel、PPT、PDF、图片……无需安装，打开即览',
    icon: FileIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-blue-100',
    bgActive: 'bg-blue-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-blue-600',
    iconActive: 'text-blue-600',
    buttonText: '未展知意',
    onClick: () => navigateTo('/file-preview')
  },
  {
    title: '图片处理',
    description: '压缩、裁剪、转格式，一切处理在本地完成，文件从不离手',
    icon: ImageIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-emerald-100',
    bgActive: 'bg-emerald-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-emerald-600',
    iconActive: 'text-emerald-600',
    buttonText: '所见皆新',
    onClick: () => navigateTo('/image-processing')
  },
  {
    title: 'AI 趣玩',
    description: '文生图、图生图、AI 对话，让想象力找到出口',
    icon: AIIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-violet-100',
    bgActive: 'bg-violet-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-violet-600',
    iconActive: 'text-violet-600',
    buttonText: '妙想成趣',
    onClick: () => navigateTo('/ai')
  },
  {
    title: 'IT 工具',
    description: 'Base64、JSON、UUID、颜色转换……日常开发的那些小事，一站搞定',
    icon: ToolsIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-orange-100',
    bgActive: 'bg-orange-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-orange-600',
    iconActive: 'text-orange-600',
    buttonText: '执简驭繁',
    onClick: () => navigateTo('/it-tools')
  },
  {
    title: 'JetBrains',
    description: '懂的都懂 😏',
    icon: JetbrainsIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-yellow-100',
    bgActive: 'bg-yellow-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-yellow-600',
    iconActive: 'text-yellow-600',
    buttonText: '巧用魔法',
    onClick: () => navigateTo('/jetbra')
  },
  {
    title: '更多工具开发中',
    description: '更多工具正在路上，总有一款在等你',
    icon: ComingIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-zinc-100',
    bgActive: 'bg-zinc-100',
    iconDefault: 'text-zinc-300',
    iconHover: '',
    iconActive: '',
    buttonText: '未来即来',
    onClick: () => {}
  }
]




const handleScroll = () => {
  showBackToTop.value = window.scrollY > 500
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const navigateTo = (path) => {
  router.push(path).then(() => {
    window.scrollTo(0, 0)
  })
}

const scrollToTools = () => {
  const element = document.getElementById('tools')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('scroll', handleScroll)

  // 移动端：用 scroll + rAF 实时计算离屏幕中心最近的卡片并激活
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (isTouchDevice) {
    let scrollEndTimer = null

    const updateActiveBook = (forceClose = false) => {
      if (forceClose) {
        activeBook.value = -1
        return
      }
      const centerY = window.innerHeight / 2
      let minDist = Infinity
      let nearest = -1
      bookRefs.value.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const cardCenter = rect.top + rect.height / 2
        const dist = Math.abs(cardCenter - centerY)
        if (dist < minDist && rect.top < window.innerHeight && rect.bottom > 0) {
          minDist = dist
          nearest = i
        }
      })
      activeBook.value = minDist < window.innerHeight * 0.35 ? nearest : -1
    }

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => updateActiveBook())

      // 滚动停止后 300ms 重算一次，确保惯性滚动结束后状态正确
      clearTimeout(scrollEndTimer)
      scrollEndTimer = setTimeout(() => updateActiveBook(), 300)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // scrollend 原生事件支持时直接用（更精准）
    window.addEventListener('scrollend', () => updateActiveBook(), { passive: true })
    // 初始执行一次
    setTimeout(() => updateActiveBook(), 150)

    bookObserver = {
      disconnect: () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('scrollend', updateActiveBook)
        clearTimeout(scrollEndTimer)
        if (rafId) cancelAnimationFrame(rafId)
      }
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (bookObserver) bookObserver.disconnect()
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 翻书效果样式 */
.book {
  position: relative;
  width: 100%;
  height: 320px;
  perspective: 1400px;
}

/* 页面 */
.page {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  transform-style: preserve-3d;
  transition: transform 1.2s cubic-bezier(0.25, 0.9, 0.3, 1);
}

/* 正反面 */
.front, .back {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  backface-visibility: hidden;
}

/* 封面 */
.cover {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* 上半部分（Logo区） */
.cover-top {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: bold;
}

/* 下半部分（文字区） */
.cover-bottom {
  flex: 1;
  background: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

/* 普通页 */
.front {
  background: linear-gradient(to right, #fafafa, #f5f5f7);
  border-right: 1px solid #e5e5e7;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  transition: box-shadow 1.2s;
}

/* 第一页覆盖为封面 */
.page:first-child .front {
  padding: 0;
}

/* 背面 */
.back {
  background: #f5f5f7;
  transform: rotateY(180deg);
  box-shadow: inset 5px 0 10px rgba(0,0,0,0.05);
}

/* 多页翻 */
.book:hover .page:nth-child(1),
.book.is-in-view .page:nth-child(1) {
  transform: rotateY(-30deg);
  transition-delay: 0s;
}
.book:hover .page:nth-child(2),
.book.is-in-view .page:nth-child(2) {
  transform: rotateY(-30deg);
  transition-delay: 0.08s;
}
.book:hover .page:nth-child(3),
.book.is-in-view .page:nth-child(3) {
  transform: rotateY(-30deg);
  transition-delay: 0.16s;
}

/* 阴影层级 */
.book:hover .page:nth-child(1) .front,
.book.is-in-view .page:nth-child(1) .front {
  box-shadow: -15px 10px 30px rgba(0,0,0,0.15);
}
.book:hover .page:nth-child(2) .front,
.book.is-in-view .page:nth-child(2) .front {
  box-shadow: -10px 8px 20px rgba(0,0,0,0.12);
}
.book:hover .page:nth-child(3) .front,
.book.is-in-view .page:nth-child(3) .front {
  box-shadow: -5px 6px 15px rgba(0,0,0,0.1);
}
</style>
