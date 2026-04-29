<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <AppHeader />

    <div class="flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <div class="relative bg-gradient-to-br from-zinc-800 to-zinc-900 px-8 py-12 text-center">
            <div class="absolute inset-0 opacity-10">
              <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div class="absolute bottom-10 right-10 w-40 h-40 bg-emerald-400 rounded-full blur-3xl"></div>
            </div>
            <div class="relative">
              <img src="/icon.jpg" alt="Forxi Logo" class="w-20 h-20 mx-auto rounded-2xl shadow-lg mb-4" />
              <h1 class="text-3xl font-bold text-white mb-2">福兮 Forxi</h1>
              <p class="text-zinc-400 text-sm max-w-md mx-auto">汇集开发者常用工具，支持文件预览、图片处理、AI 创作等功能</p>
              <div class="flex justify-center gap-4 mt-6">
                <span class="px-3 py-1 text-xs bg-white/10 text-white/80 rounded-full">免费使用</span>
                <span class="px-3 py-1 text-xs bg-white/10 text-white/80 rounded-full">纯前端处理</span>
                <span class="px-3 py-1 text-xs bg-white/10 text-white/80 rounded-full">保护隐私</span>
              </div>
            </div>
          </div>

          <div class="px-8 py-8" data-snippet>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-emerald-600">40+</div>
                <div class="text-xs text-emerald-600/70 mt-1">在线工具</div>
              </div>
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">100%</div>
                <div class="text-xs text-blue-600/70 mt-1">免费使用</div>
              </div>
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-purple-600">本地</div>
                <div class="text-xs text-purple-600/70 mt-1">数据处理</div>
              </div>
              <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-orange-600">随时</div>
                <div class="text-xs text-orange-600/70 mt-1">随地访问</div>
              </div>
            </div>

            <section class="mb-10">
              <h2 class="text-lg font-semibold text-zinc-700 mb-1 flex items-center gap-2">
                <span class="w-6 h-6 rounded-md bg-emerald-100 text-emerald-500 flex items-center justify-center text-sm">☕</span>
                打赏支持
              </h2>
              <p class="text-zinc-400 text-sm mb-6">如果觉得好用，可以请作者喝杯咖啡</p>
              <div class="flex justify-center gap-6 sm:gap-10">
                <div class="text-center">
                  <div
                    class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200 mb-3 transition-transform hover:scale-105 cursor-zoom-in"
                    @click="openViewer('/wx_tip.jpg', '微信打赏')"
                  >
                    <img src="/wx_tip.jpg" alt="微信打赏" class="w-36 sm:w-44 h-auto rounded-lg" />
                  </div>
                  <div class="flex items-center justify-center gap-1.5 text-zinc-600">
                    <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89l-.406-.032zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                    </svg>
                    <span class="text-sm font-medium">微信</span>
                  </div>
                </div>
                <div class="text-center">
                  <div
                    class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200 mb-3 transition-transform hover:scale-105 cursor-zoom-in"
                    @click="openViewer('/zfb_tip.jpg', '支付宝打赏')"
                  >
                    <img src="/zfb_tip.jpg" alt="支付宝打赏" class="w-36 sm:w-44 h-auto rounded-lg" />
                  </div>
                  <div class="flex items-center justify-center gap-1.5 text-zinc-600">
                    <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.317 1.316l7.073 3.467c.206.1.44.1.646 0l7.073-3.467c.274-.134.422-.416.37-.703l-.37-2.077C17.938.36 17.68.15 17.37.015c-.31-.135-.668-.057-.903.196L12 4.537 8.033.21c-.234-.252-.593-.33-.903-.196-.31.135-.568.345-.627.636l-.37 2.077c-.052.287.096.57.37.703z"/>
                    </svg>
                    <span class="text-sm font-medium">支付宝</span>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-10">
              <h2 class="text-lg font-semibold text-zinc-700 mb-1 flex items-center gap-2">
                <span class="w-6 h-6 rounded-md bg-blue-100 text-blue-500 flex items-center justify-center text-sm">📢</span>
                关注公众号
              </h2>
              <p class="text-zinc-400 text-sm mb-6">扫码关注公众号，获取最新资讯</p>
              <div class="flex justify-center">
                <div
                  class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200 transition-transform hover:scale-105 cursor-zoom-in"
                  @click="openViewer('/wx_open.jpg', '微信公众号')"
                >
                  <img src="/wx_open.jpg" alt="微信公众号" class="w-48 h-auto rounded-lg" />
                </div>
              </div>
            </section>

            <section class="mb-4">
              <h2 class="text-lg font-semibold text-zinc-700 mb-1 flex items-center gap-2">
                <span class="w-6 h-6 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center text-sm">💻</span>
                GitHub
              </h2>
              <p class="text-zinc-400 text-sm mb-6">欢迎 Star 和 Fork</p>
              <div class="flex justify-center">
                <a
                  href="https://github.com/zengzhifei/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group inline-flex items-center gap-3 px-6 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-200"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
                  </svg>
                  <div class="text-left">
                    <div class="font-medium">github.com/zengzhifei</div>
                    <div class="text-xs text-gray-400 group-hover:text-gray-300">View on GitHub →</div>
                  </div>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />

    <ImageViewer
      :src="viewerSrc"
      :visible="viewerVisible"
      @update:visible="viewerVisible = $event"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import ImageViewer from '../components/ImageViewer.vue'

const viewerVisible = ref(false)
const viewerSrc = ref('')

const openViewer = (url) => {
  viewerSrc.value = url
  viewerVisible.value = true
}
</script>
