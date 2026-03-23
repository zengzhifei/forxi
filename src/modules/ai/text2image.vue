<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 sm:p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-zinc-700">文生图</h2>
          <p class="text-sm text-zinc-400">输入文字描述，AI 为你生成精美图片</p>
        </div>
      </div>
      
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-zinc-600 mb-2">
            提示词 <span class="text-red-500">*</span>
          </label>
          <textarea
            :value="prompt"
            @input="emit('update:prompt', $event.target.value)"
            rows="4"
            maxlength="2000"
            class="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:outline-none resize-none transition-all bg-zinc-50 focus:bg-white text-zinc-700 placeholder-zinc-300"
            placeholder="描述你想要的图片，如：一只可爱的橘猫，萌萌的大眼睛，毛茸茸的耳朵，温暖的光线..."
          ></textarea>
          <div class="text-right text-xs text-zinc-400 mt-1">{{ prompt?.length || 0 }}/2000</div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-zinc-600 mb-2">
            负面提示词
            <span class="text-zinc-400 font-normal">(可选)</span>
          </label>
          <input
            :value="negativePrompt"
            @input="emit('update:negativePrompt', $event.target.value)"
            type="text"
            maxlength="2000"
            class="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:outline-none transition-all bg-zinc-50 focus:bg-white text-zinc-700 placeholder-zinc-300"
            placeholder="不想出现的元素，如：模糊、变形、低质量..."
          >
          <div class="text-right text-xs text-zinc-400 mt-1">{{ negativePrompt?.length || 0 }}/2000</div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-zinc-600 mb-2">模型</label>
            <select :value="selectedModel" @change="emit('update:selectedModel', $event.target.value)" class="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:outline-none bg-white text-zinc-700">
              <option value="" disabled>选择模型</option>
              <option v-for="model in models" :key="model.id" :value="model.id" :title="'使用量：' + formatNumber(model.downloads) + (model.description ? '，描述：' + model.description : '')">
                {{ model.display_name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-zinc-600 mb-2">尺寸</label>
            <select :value="size" @change="emit('update:size', $event.target.value)" class="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:outline-none bg-white text-zinc-700">
              <option value="1024x1024">1024×1024</option>
              <option value="1152x864">1152×864</option>
              <option value="1216x832">1216×832</option>
              <option value="1344x768">1344×768</option>
              <option value="832x1216">832×1216</option>
              <option value="768x1344">768×1344</option>
            </select>
          </div>
        </div>

        <button
          @click="emit('generate')"
          :disabled="!prompt.trim() || !selectedModel || generating"
          class="w-full py-4 px-6 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-zinc-300/40 hover:scale-[1.01]"
          style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
        >
          <span v-if="generating">AI 创作中...</span>
          <span v-else>🎨 开始创作</span>
        </button>
      </div>
    </div>

    <div v-if="generating" id="result-section" class="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
      <div class="p-6">
        <div class="flex justify-center items-center min-h-[400px] bg-zinc-50 rounded-xl">
          <div class="text-center">
            <div class="relative w-32 h-32 mx-auto mb-4">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e4e4e7" stroke-width="8" fill="none"/>
                <circle cx="64" cy="64" r="56" stroke="#52525b" stroke-width="8" fill="none" stroke-linecap="round"
                  :stroke-dasharray="351.86" :stroke-dashoffset="351.86 - (351.86 * progress / 100)"
                  class="transition-all duration-500"/>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl font-bold text-zinc-600">{{ progress }}%</span>
              </div>
            </div>
            <p class="text-zinc-500">正在生成中，请稍后...</p>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade-slide">
      <div v-if="generatedImage" class="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div class="bg-zinc-50 px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 class="font-semibold text-zinc-700 flex items-center gap-2">
            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            生成完成
          </h3>
          <span class="text-sm text-zinc-400">{{ currentTime }}</span>
        </div>
        <div class="p-6">
          <div class="flex justify-center">
            <div class="relative group">
              <img :src="generatedImage" class="max-w-full max-h-[600px] rounded-xl shadow-md" />
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-4">
                <a
                  :href="generatedImage"
                  target="_blank"
                  class="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  title="在新窗口打开"
                >
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  @click="emit('download')"
                  class="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  title="下载图片"
                >
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-center">
            <button
              @click="emit('regenerate')"
              class="px-6 py-3 text-white font-medium rounded-xl flex items-center gap-2 transition-all hover:shadow-md hover:shadow-zinc-300/40 hover:scale-[1.01]"
              style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重新生成
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade-slide">
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
        <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 class="font-semibold text-red-800">生成失败</h4>
          <p class="text-sm text-red-600 mt-1">{{ error }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  models: Array,
  prompt: String,
  negativePrompt: String,
  selectedModel: String,
  size: String,
  generating: Boolean,
  generatedImage: String,
  error: String,
  progress: Number
})

const emit = defineEmits(['update:prompt', 'update:negativePrompt', 'update:selectedModel', 'update:size', 'generate', 'download', 'regenerate'])

const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const currentTime = computed(() => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
