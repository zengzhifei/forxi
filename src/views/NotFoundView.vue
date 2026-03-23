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
    name: '文件预览', path: '/file-preview', desc: '在线预览各类文件',
    icon: icon('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z')
  },
  {
    name: '图片处理', path: '/image-processing', desc: '在线图片编辑与转换',
    icon: icon('M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z')
  },
  {
    name: 'IT 工具箱', path: '/it-tools', desc: '实用的开发者工具集合',
    icon: icon('M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z')
  },
  {
    name: 'AI 趣玩', path: '/ai', desc: 'AI 创作与智能对话',
    icon: icon('M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z')
  },
  {
    name: 'JetBrains', path: '/jetbra', desc: 'JetBrains 激活服务',
    icon: icon('M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4')
  },
]
</script>
