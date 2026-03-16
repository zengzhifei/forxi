<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- 左侧菜单 -->
          <div class="w-full lg:w-64 flex-shrink-0">
            <div class="bg-white rounded-xl shadow-lg p-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">AI趣玩</h3>
              <div class="space-y-1">
                <button 
                  v-for="item in menuItems" 
                  :key="item.id"
                  @click="activeMenu = item.id"
                  class="w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors"
                  :class="activeMenu === item.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'"
                >
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>

          <!-- 右侧内容区 -->
          <div class="flex-1">
            <!-- 在线文生图 -->
            <div v-if="activeMenu === 'text2image'" class="space-y-6">
              <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">在线文生图</h3>
                <p class="text-sm text-gray-500 mb-6">输入文字描述，AI将为你生成对应的图片</p>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">提示词</label>
                    <textarea 
                      v-model="prompt" 
                      rows="4"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="描述你想要的图片内容，如：一只可爱的猫咪"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">模型</label>
                      <select v-model="selectedModel" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option v-for="model in models" :key="model.id" :value="model.id" :title="model.display_name + (model.description ? ' - ' + model.description : '')">
                          {{ model.display_name }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">尺寸</label>
                      <select v-model="size" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="1024x1024">1:1 1024×1024</option>
                        <option value="1152x864">4:3 1152×864</option>
                        <option value="1216x832">3:2 1216×832</option>
                        <option value="1344x768">16:9 1344×768</option>
                        <option value="832x1216">2:3 832×1216</option>
                        <option value="768x1344">9:16 768×1344</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">负面提示词（可选）</label>
                    <input 
                      v-model="negativePrompt" 
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="不想出现的内容"
                    >
                  </div>

                  <button 
                    @click="generateImage" 
                    :disabled="!prompt || generating"
                    class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <svg v-if="generating" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ generating ? '生成中...' : '生成图片' }}</span>
                  </button>
                </div>
              </div>

              <div v-if="generatedImage" class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">生成结果</h3>
                <div class="flex justify-center">
                  <img :src="generatedImage" class="max-w-full rounded-lg shadow-md" />
                </div>
                <div class="mt-4 flex justify-center">
                  <button 
                    @click="downloadImage" 
                    class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>下载图片</span>
                  </button>
                </div>
              </div>

              <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                {{ error }}
              </div>
            </div>

            <!-- 其他功能 Coming Soon -->
            <div v-else class="bg-white rounded-xl shadow-lg p-6">
              <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">即将上线</h3>
                <p class="mt-2 text-sm text-gray-500">更多AI功能正在开发中，敬请期待...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { api } from '@/utils/api'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const toast = inject('toast')

const menuItems = [
  { id: 'text2image', name: '在线文生图' }
]

const activeMenu = ref('text2image')
const prompt = ref('')
const selectedModel = ref('')
const size = ref('1024x1024')
const negativePrompt = ref('')
const generating = ref(false)
const generatedImage = ref(null)
const error = ref(null)
const models = ref([])

const fetchModels = async () => {
  try {
    const result = await api.getAiModels('text-to-image-synthesis')
    if (result.models && result.models.length > 0) {
      models.value = result.models
      selectedModel.value = result.models[0].id
    }
  } catch (err) {
    console.error('获取模型列表失败:', err)
  }
}

const generateImage = async () => {
  if (!prompt.value.trim()) {
    toast.error('请输入提示词')
    return
  }

  if (!selectedModel.value) {
    toast.error('请选择模型')
    return
  }

  generating.value = true
  error.value = null
  generatedImage.value = null

  try {
    const result = await api.text2image({
      prompt: prompt.value,
      model: selectedModel.value,
      size: size.value,
      negative_prompt: negativePrompt.value
    })

    if (result.url) {
      generatedImage.value = result.url
      toast.success('图片生成成功！')
    }  else {
      error.value = '未生成图片'
    }
  } catch (err) {
    error.value = err.message || '生成失败，请重试'
    toast.error(error.value)
  } finally {
    generating.value = false
  }
}

const downloadImage = () => {
  if (!generatedImage.value) return

  const link = document.createElement('a')
  link.href = generatedImage.value
  link.download = `ai-image-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  fetchModels()
})
</script>
