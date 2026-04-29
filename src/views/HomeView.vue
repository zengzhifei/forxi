<template>
  <div class="min-h-screen bg-gray-100 text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <section class="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-zinc-100">
      <div class="absolute inset-0 bg-zinc-100"></div>

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

    <section id="tools" class="pt-16 pb-24 bg-white" data-snippet>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-xl sm:text-2xl font-bold text-zinc-600 mb-4">此中有真意</h2>
        </div>

        <div v-for="(category, ci) in categories" :key="category.label" class="max-w-5xl mx-auto" :class="ci > 0 ? 'mt-20' : ''">
          <div class="flex items-end justify-between mb-10">
            <div class="flex items-stretch gap-4">
              <div class="w-0.5 rounded-full" :style="category.accentStyle"></div>
              <div>
                <p class="text-[10px] tracking-[0.3em] uppercase mb-1" :style="category.subStyle">{{ category.en }}</p>
                <h3 class="font-serif text-2xl tracking-wide text-zinc-700 leading-none">{{ category.label }}</h3>
              </div>
            </div>
            <router-link :to="category.path" class="group flex items-center gap-1.5 text-xs tracking-widest text-zinc-300 hover:text-zinc-500 transition-colors duration-300 pb-0.5">
              <span>查看全部</span>
              <svg class="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </router-link>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
            <div
              v-for="(tool, index) in category.tools"
              :key="tool.title"
              :ref="el => { if (el) bookRefs[flatIndex(ci, index)] = el }"
              class="book group relative w-full cursor-pointer transition-all duration-700 hover:shadow-lg hover:shadow-zinc-300/30 hover:-translate-y-2 opacity-0 animate-fade-in-up"
              :style="{ animationDelay: `${flatIndex(ci, index) * 0.1}s`, perspective: '1400px' }"
              :class="[activeBook === flatIndex(ci, index) ? 'is-in-view' : '']"
              @click="tool.onClick"
            >
              <div class="absolute top-0 right-0 w-12 h-full rounded-r-xl bg-gradient-to-r from-zinc-300 to-zinc-200 shadow-inner"></div>
              <div class="page" style="z-index: 5;">
                <div class="front">
                  <div class="cover h-full flex flex-col overflow-hidden rounded-xl">
                    <div class="cover-top flex-1 flex items-center justify-center transition-colors duration-300" :class="[activeBook === flatIndex(ci, index) ? tool.bgActive : tool.bgDefault, tool.bgHover]">
                      <component :is="tool.icon" class="w-12 h-12 transition-colors duration-300" :class="[activeBook === flatIndex(ci, index) ? tool.iconActive : tool.iconDefault, tool.iconHover]" />
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
      </div>
    </section>

    <AppFooter />

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, h } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
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

const OcrIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2zM9 4h6v6H9V4z' })
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

const ChatIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' })
    ])
  }
}

const Text2ImageIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' })
    ])
  }
}

const Image2ImageIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' })
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

const FlowIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.8', d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' })
    ])
  }
}

const CalculatorIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' })
    ])
  }
}

const IpQueryIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' })
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

const TimeMachineIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 2v2' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 20v2' })
    ])
  }
}

const SnowflakeIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' })
    ])
  }
}

const MailIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
    ])
  }
}

const BookIcon = {
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' })
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
    onClick: () => navigateTo('/hub/file-preview')
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
    onClick: () => navigateTo('/hub/image-processing')
  },
  {
    title: '图片 OCR',
    description: '一键提取图片中的文字，支持多语言自动识别',
    icon: OcrIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-teal-100',
    bgActive: 'bg-teal-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-teal-600',
    iconActive: 'text-teal-600',
    buttonText: '图文转换',
    onClick: () => navigateTo('/hub/ocr')
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
    onClick: () => navigateTo('/hub/it-tools')
  },
  {
    title: '文件转换',
    description: '支持多种文件格式互转，简单好用高效',
    icon: FileIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-cyan-100',
    bgActive: 'bg-cyan-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-cyan-600',
    iconActive: 'text-cyan-600',
    buttonText: '格式无忧',
    onClick: () => navigateTo('/hub/file-converter')
  },
  {
    title: '流程工厂',
    description: '可视化流程图编辑器，支持拖拽、连线和批量编辑',
    icon: FlowIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-rose-100',
    bgActive: 'bg-rose-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-rose-600',
    iconActive: 'text-rose-600',
    buttonText: '流程自如',
    onClick: () => navigateTo('/hub/flow-factory')
  },
  {
    title: '超级计算器',
    description: '数学计算、科学计算、金融计算、进制转换、单位换算、亲戚称呼',
    icon: CalculatorIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-amber-100',
    bgActive: 'bg-amber-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-amber-600',
    iconActive: 'text-amber-600',
    buttonText: '全能计算',
    onClick: () => navigateTo('/hub/calculator')
  },
  {
    title: 'IP查询',
    description: '查询全球IP地址的地理位置、网络运营商和实时天气信息',
    icon: IpQueryIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-blue-100',
    bgActive: 'bg-blue-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-blue-600',
    iconActive: 'text-blue-600',
    buttonText: 'IP定位',
    onClick: () => navigateTo('/hub/ip-query')
  },
  {
    title: '临时邮箱',
    description: '创建临时邮箱接收邮件，保护您的真实邮箱隐私',
    icon: MailIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-amber-100',
    bgActive: 'bg-amber-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-amber-600',
    iconActive: 'text-amber-600',
    buttonText: '匿名邮件',
    onClick: () => navigateTo('/hub/inbox')
  },
]

const aiTools = [
  {
    title: '聊一聊',
    description: '与 AI 智能对话，解答问题、编写代码、创作文案',
    icon: ChatIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-violet-100',
    bgActive: 'bg-violet-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-violet-600',
    iconActive: 'text-violet-600',
    buttonText: '妙想成趣',
    onClick: () => navigateTo('/ai/chat')
  },
  {
    title: '文生图',
    description: '输入文字描述，AI 为你生成精美图片',
    icon: Text2ImageIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-indigo-100',
    bgActive: 'bg-indigo-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-indigo-600',
    iconActive: 'text-indigo-600',
    buttonText: '以文绘图',
    onClick: () => navigateTo('/ai/text2image')
  },
  {
    title: '图生图',
    description: '上传图片并描述变化，AI 帮你改造图片',
    icon: Image2ImageIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-pink-100',
    bgActive: 'bg-pink-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-pink-600',
    iconActive: 'text-pink-600',
    buttonText: '以图换图',
    onClick: () => navigateTo('/ai/image2image')
  },
]

const otherTools = [
  {
    title: 'JetBrains',
    description: '懂的都懂',
    icon: JetbrainsIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-yellow-100',
    bgActive: 'bg-yellow-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-yellow-600',
    iconActive: 'text-yellow-600',
    buttonText: '巧用魔法',
    onClick: () => navigateTo('/explore/jetbra')
  },
  {
    title: '历史上的今天',
    description: '穿越历史长河，探索任意一天的人类足迹',
    icon: TimeMachineIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-violet-100',
    bgActive: 'bg-violet-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-violet-600',
    iconActive: 'text-violet-600',
    buttonText: '穿越历史',
    onClick: () => navigateTo('/explore/onthisday')
  },
  {
    title: 'MBTI 性格测试',
    description: '精选题目，探索你的性格密码，发现真实的自己',
    icon: AIIcon,
    bgDefault: 'bg-zinc-50',
    bgHover: 'group-hover:bg-violet-100',
    bgActive: 'bg-violet-100',
    iconDefault: 'text-zinc-300',
    iconHover: 'group-hover:text-violet-600',
    iconActive: 'text-violet-600',
    buttonText: '探索自我',
    onClick: () => navigateTo('/explore/mbti')
  },
]

const contentTools = [
  {
    title: '文章',
    description: '整理日常输出，分享所学所得',
    icon: BookIcon,
    bgDefault: 'bg-emerald-50',
    bgHover: 'group-hover:bg-emerald-100',
    bgActive: 'bg-emerald-100',
    iconDefault: 'text-emerald-500',
    iconHover: '',
    iconActive: '',
    buttonText: '与你分享',
    onClick: () => navigateTo('/idea/articles/')
  },
  {
    title: '冷知识',
    description: '探索有趣的小知识，发现世界的奇妙之处',
    icon: SnowflakeIcon,
    bgDefault: 'bg-cyan-50',
    bgHover: 'group-hover:bg-cyan-100',
    bgActive: 'bg-cyan-100',
    iconDefault: 'text-cyan-500',
    iconHover: '',
    iconActive: '',
    buttonText: '探索发现',
    onClick: () => navigateTo('/idea/coldknowledge')
  }
]

const categories = [
  {
    label: '应用', en: 'hub', path: '/hub/', tools,
    accentStyle: 'background: linear-gradient(180deg, #93c5fd 0%, #3b82f6 100%)',
    subStyle: 'color: #93c5fd',
  },
  {
    label: 'AI', en: 'ai', path: '/ai/', tools: aiTools,
    accentStyle: 'background: linear-gradient(180deg, #c4b5fd 0%, #8b5cf6 100%)',
    subStyle: 'color: #c4b5fd',
  },
  {
    label: '创意', en: 'Idea', path: '/idea/', tools: contentTools,
    accentStyle: 'background: linear-gradient(180deg, #6ee7b7 0%, #10b981 100%)',
    subStyle: 'color: #6ee7b7',
  },
  {
    label: '探索', en: 'Explore', path: '/explore/', tools: otherTools,
    accentStyle: 'background: linear-gradient(180deg, #fcd34d 0%, #f59e0b 100%)',
    subStyle: 'color: #fcd34d',
  },
]

const flatIndex = (ci, index) => {
  let offset = 0
  for (let i = 0; i < ci; i++) offset += categories[i].tools.length
  return offset + index
}


const totalBooks = categories.reduce((sum, c) => sum + c.tools.length, 0)

const navigateTo = (path) => {
  router.push(path)
}

const scrollToTools = () => {
  const element = document.getElementById('tools')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  window.scrollTo(0, 0)

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
