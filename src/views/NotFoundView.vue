<template>
  <div class="min-h-screen bg-[#fafafa] flex flex-col">
    <AppHeader />

    <div class="flex-1 flex items-center justify-center p-4">
      <div class="text-center max-w-sm mx-auto">

        <!-- 404 数字 -->
        <div class="mb-6">
          <span class="text-[8rem] font-bold leading-none select-none" style="background: linear-gradient(135deg, #d4d4d8 0%, #a1a1aa 50%, #d4d4d8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">404</span>
        </div>

        <!-- 文案 -->
        <p class="text-sm text-zinc-400 mb-1">山重水复疑无路，</p>
        <p class="text-sm text-zinc-400 mb-10">柳暗花明又一村。</p>

        <!-- 快捷导航 -->
        <div class="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-zinc-50">
            <p class="text-xs font-semibold text-zinc-400 tracking-wider">也许你在找</p>
          </div>
          <div class="divide-y divide-zinc-50">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3.5 px-5 py-3.5 hover:bg-zinc-50 transition-colors group"
            >
              <div class="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-200 transition-colors">
                <component :is="item.icon" class="w-4 h-4 text-zinc-500" />
              </div>
              <div class="text-left">
                <div class="text-sm font-medium text-zinc-700">{{ item.name }}</div>
                <div class="text-xs text-zinc-400">{{ item.desc }}</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { h } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const icon = (d) => ({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-4 h-4 text-zinc-500' },
    [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d })]
  )
})

const navItems = [
  {
    name: '首页', path: '/', desc: '回到起点',
    icon: icon('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6')
  },
  {
    name: '百宝箱', path: '/hub/', desc: '文件预览、图片处理、 图片OCR、IT 工具箱',
    icon: icon('M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z')
  },
  {
    name: 'AI 趣玩', path: '/ai/', desc: '聊一聊、文生图、图生图',
    icon: icon('M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z')
  },
  {
    name: '内容集', path: '/idea/', desc: '技术文章与随笔杂谈',
    icon: icon('M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253')
  },
  {
    name: '探索', path: '/explore/', desc: '探索未知事物',
    icon: icon('M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z')
  },
]
</script>
