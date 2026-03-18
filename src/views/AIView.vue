<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <!-- 页面标题 -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 lg:hidden">
        <h1 class="text-xl font-bold text-gray-800">AI趣玩</h1>
      </div>
      <div class="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- 左侧菜单 - 移动端横向排列 -->
          <div class="w-full lg:w-64 flex-shrink-0">
            <div class="bg-white rounded-2xl shadow-lg p-2 lg:p-4 sticky top-16 lg:top-20 z-10">
              <h3 class="hidden lg:block text-lg font-bold text-gray-800 mb-4 px-3">AI趣玩</h3>
              <div class="flex lg:flex-col gap-1 lg:space-y-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                <button 
                  v-for="item in menuItems" 
                  :key="item.id"
                  @click="activeMenu = item.id"
                  class="flex-shrink-0 text-left px-4 py-2 lg:py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                  :class="activeMenu === item.id ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
                >
                  <span v-html="item.icon" class="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0"></span>
                  <span>{{ item.name }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 右侧内容区 -->
          <div class="flex-1 min-w-0">
            <!-- 在线文生图 -->
            <div v-if="activeMenu === 'text2image'" class="space-y-6">
              <!-- 输入卡片 -->
              <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-gray-800">文生图</h2>
                    <p class="text-sm text-gray-500">输入文字描述，AI 为你生成精美图片</p>
                  </div>
                </div>
                
                <div class="space-y-5">
                  <!-- 提示词 -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      提示词 <span class="text-red-500">*</span>
                    </label>
                    <textarea 
                      v-model="prompt" 
                      rows="4"
                      maxlength="2000"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                      placeholder="描述你想要的图片，如：一只可爱的橘猫，萌萌的大眼睛，毛茸茸的耳朵，温暖的光线..."
                    ></textarea>
                    <div class="text-right text-xs text-gray-400 mt-1">{{ prompt.length }}/2000</div>
                  </div>

                  <!-- 负面提示词 -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      负面提示词
                      <span class="text-gray-400 font-normal">(可选)</span>
                    </label>
                    <input 
                      v-model="negativePrompt" 
                      type="text"
                      maxlength="2000"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="不想出现的元素，如：模糊、变形、低质量..."
                    >
                    <div class="text-right text-xs text-gray-400 mt-1">{{ negativePrompt.length }}/2000</div>
                  </div>

                  <!-- 模型和尺寸 -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">模型</label>
                      <select v-model="selectedModel" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option value="" disabled>选择模型</option>
                        <option v-for="model in models" :key="model.id" :value="model.id" :title="'使用量：' + formatNumber(model.downloads) + (model.description ? '，描述：' + model.description : '')">
                          {{ model.display_name }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">尺寸</label>
                      <select v-model="size" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option value="1024x1024">1024×1024</option>
                        <option value="1152x864">1152×864</option>
                        <option value="1216x832">1216×832</option>
                        <option value="1344x768">1344×768</option>
                        <option value="832x1216">832×1216</option>
                        <option value="768x1344">768×1344</option>
                      </select>
                    </div>
                  </div>

                  <!-- 生成按钮 -->
                  <button 
                    @click="generateImage" 
                    :disabled="!prompt.trim() || !selectedModel || generating"
                    class="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-40 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span v-if="generating">AI 创作中...</span>
                    <span v-else>🎨 开始创作</span>
                  </button>
                </div>
              </div>

              <!-- 生成中蒙层 -->
              <div v-if="generating" id="result-section" class="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div class="p-6">
                  <div class="flex justify-center items-center min-h-[400px] bg-gray-100 rounded-xl">
                    <div class="text-center">
                      <div class="relative w-32 h-32 mx-auto mb-4">
                        <svg class="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="56" stroke="#e5e7eb" stroke-width="8" fill="none"/>
                          <circle cx="64" cy="64" r="56" stroke="#3b82f6" stroke-width="8" fill="none" stroke-linecap="round"
                            :stroke-dasharray="351.86" :stroke-dashoffset="351.86 - (351.86 * progress / 100)"
                            class="transition-all duration-500"/>
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center">
                          <span class="text-2xl font-bold text-blue-500">{{ progress }}%</span>
                        </div>
                      </div>
                      <p class="text-gray-600">正在生成中，请稍后...</p>
                    </div>
                  </div>
                </div>
              </div>
              <transition name="fade-slide">
                <div v-if="generatedImage" class="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                      <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      生成完成
                    </h3>
                    <span class="text-sm text-gray-500">{{ currentTime }}</span>
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
                            @click="downloadImage" 
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
                        @click="generateNewSamePrompt" 
                        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 transition-all"
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

              <!-- 错误提示 -->
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

            <!-- 在线图生图 -->
            <div v-if="activeMenu === 'image2image'" class="space-y-6">
              <!-- 输入卡片 -->
              <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-gray-800">图生图</h2>
                    <p class="text-sm text-gray-500">上传图片并描述变化，AI 帮你改造图片</p>
                  </div>
                </div>
                
                <div class="space-y-5">
                  <!-- 输入图片 -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      输入图片 <span class="text-red-500">*</span>
                    </label>
                    
                    <!-- 文件上传 -->
                    <div 
                      class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors cursor-pointer"
                      :class="{ 'border-green-500 bg-green-50': isDragging }"
                      @dragover.prevent="isDragging = true"
                      @dragleave.prevent="isDragging = false"
                      @drop.prevent="handleDrop"
                      @click="$refs.fileInput.click()"
                    >
                      <input 
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleFileChange"
                      />
                      <div v-if="!inputImageFile && !previewInputImage">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="mt-2 text-sm text-gray-600">点击或拖拽图片到这里</p>
                        <p class="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式，最大 5MB</p>
                      </div>
                      <div v-else class="flex items-center justify-center gap-4">
                        <img :src="previewInputImage" class="max-w-[200px] max-h-[150px] rounded-lg object-contain" />
                        <button 
                          @click.stop="clearInputImage"
                          class="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- 提示词 -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      提示词 <span class="text-red-500">*</span>
                    </label>
                    <textarea 
                      v-model="prompt" 
                      rows="4"
                      maxlength="2000"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all"
                      placeholder="描述你想要的图片变化，如：将背景换成蓝天白云，给衣服添加花纹..."
                    ></textarea>
                    <div class="text-right text-xs text-gray-400 mt-1">{{ prompt.length }}/2000</div>
                  </div>

                  <!-- 负面提示词 -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      负面提示词
                      <span class="text-gray-400 font-normal">(可选)</span>
                    </label>
                    <input 
                      v-model="negativePrompt" 
                      type="text"
                      maxlength="2000"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="不想出现的元素，如：模糊、变形、低质量..."
                    >
                    <div class="text-right text-xs text-gray-400 mt-1">{{ negativePrompt.length }}/2000</div>
                  </div>

                  <!-- 模型和尺寸 -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">模型</label>
                      <select v-model="selectedModel" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white">
                        <option value="" disabled>选择模型</option>
                        <option v-for="model in models" :key="model.id" :value="model.id" :title="'使用量：' + formatNumber(model.downloads) + (model.description ? '，描述：' + model.description : '')">
                          {{ model.display_name }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">尺寸</label>
                      <select v-model="size" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white">
                        <option value="1024x1024">1024×1024</option>
                        <option value="1152x864">1152×864</option>
                        <option value="1216x832">1216×832</option>
                        <option value="1344x768">1344×768</option>
                        <option value="832x1216">832×1216</option>
                        <option value="768x1344">768×1344</option>
                      </select>
                    </div>
                  </div>

                  <!-- 生成按钮 -->
                  <button 
                    @click="generateImage" 
                    :disabled="!prompt.trim() || !inputImageFile || !selectedModel || generating"
                    class="w-full py-4 px-6 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-green-700 hover:via-teal-700 hover:to-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span v-if="generating">AI 处理中...</span>
                    <span v-else>✨ 开始改造</span>
                  </button>
                </div>
              </div>

              <!-- 生成中蒙层 -->
              <div v-if="generating" id="result-section" class="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div class="p-6">
                  <div class="flex justify-center items-center min-h-[400px] bg-gray-100 rounded-xl">
                    <div class="text-center">
                      <div class="relative w-32 h-32 mx-auto mb-4">
                        <svg class="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="56" stroke="#e5e7eb" stroke-width="8" fill="none"/>
                          <circle cx="64" cy="64" r="56" stroke="#10b981" stroke-width="8" fill="none" stroke-linecap="round"
                            :stroke-dasharray="351.86" :stroke-dashoffset="351.86 - (351.86 * progress / 100)"
                            class="transition-all duration-500"/>
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center">
                          <span class="text-2xl font-bold text-green-500">{{ progress }}%</span>
                        </div>
                      </div>
                      <p class="text-gray-600">正在生成中，请稍后...</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 生成结果 -->
              <transition name="fade-slide">
                <div v-if="generatedImage" class="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                      <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      生成完成
                    </h3>
                    <span class="text-sm text-gray-500">{{ currentTime }}</span>
                  </div>
                  <div class="p-6">
                    <div class="flex flex-col md:flex-row gap-6 items-center justify-center">
                      <!-- 原图 -->
                      <div v-if="previewInputImage" class="text-center">
                        <p class="text-sm font-medium text-gray-600 mb-2">原图</p>
                        <img :src="previewInputImage" class="max-w-[250px] max-h-[250px] rounded-lg shadow-md object-contain" />
                      </div>
                      <!-- 箭头 -->
                      <div v-if="previewInputImage" class="hidden md:block text-gray-400">
                        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                      <!-- 结果图 -->
                      <div class="relative group">
                        <img :src="generatedImage" class="max-w-full max-h-[400px] rounded-xl shadow-md" />
                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-4">
                          <a 
                            :href="generatedImage" 
                            target="_blank"
                            class="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                          >
                            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <button @click="downloadImage" class="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30">
                            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div class="mt-6 flex justify-center">
                      <button 
                        @click="generateNewSamePrompt" 
                        class="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-teal-700 flex items-center gap-2 transition-all"
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

              <!-- 错误提示 -->
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
          </div>
        </div>
      </div>
    </main>

    <!-- 回到顶部按钮 -->
    <button 
      @click="scrollToTop"
      class="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
      :class="{ 'opacity-100': showBackToTop, 'opacity-0 pointer-events-none': !showBackToTop }"
    >
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject, watch } from 'vue'
import { api } from '@/utils/api'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const toast = inject('toast')

const menuItems = [
  { 
    id: 'text2image', 
    name: '文生图', 
    icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>'
  },
  { 
    id: 'image2image', 
    name: '图生图', 
    icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
  }
]

const activeMenu = ref('text2image')
const prompt = ref('')
const negativePrompt = ref('')
const selectedModel = ref('')
const size = ref('1024x1024')
const inputImageFile = ref(null)
const previewInputImage = ref('')
const isDragging = ref(false)
const fileInput = ref(null)
const generating = ref(false)
const generatedImage = ref(null)
const error = ref(null)
const taskId = ref(null)
const taskStatus = ref('')
const progress = ref(0)
const showBackToTop = ref(false)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}
let pollTimer = null
const models = ref([])

const currentTime = computed(() => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

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

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  const hash = window.location.hash.slice(1)
  if (hash && menuItems.some(item => item.id === hash)) {
    activeMenu.value = hash
  }
  const task = activeMenu.value === 'text2image' ? 'text-to-image-synthesis' : 'image-to-image'
  api.getAiModels(task).then(data => {
    models.value = data.models || []
    if (models.value.length > 0) {
      selectedModel.value = models.value[0].id
    }
  }).catch(err => {
    console.error('获取模型列表失败:', err)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(activeMenu, (newVal) => {
  window.location.hash = newVal
  generatedImage.value = null
  error.value = null
  prompt.value = ''
  negativePrompt.value = ''
  selectedModel.value = ''
  size.value = '1024x1024'
  previewInputImage.value = ''
  inputImageFile.value = null
  clearInputImage()
  cancelGeneration(false)
  
  const task = newVal === 'text2image' ? 'text-to-image-synthesis' : 'image-to-image'
  api.getAiModels(task).then(data => {
    models.value = data.models || []
    if (models.value.length > 0) {
      selectedModel.value = models.value[0].id
    }
  }).catch(err => {
    console.error('获取模型列表失败:', err)
  })
})

const generateImage = async () => {
  if (!prompt.value.trim()) {
    toast.error('请输入提示词')
    return
  }

  if (!selectedModel.value) {
    toast.error('请选择模型')
    return
  }

  if (activeMenu.value === 'image2image' && !inputImageFile.value) {
    toast.error('请上传图片')
    return
  }

  generating.value = true
  error.value = null
  generatedImage.value = null
  progress.value = 0
  taskStatus.value = 'PROCESSING'

  try {
    let result
    if (activeMenu.value === 'text2image') {
      result = await api.text2image({
        prompt: prompt.value,
        model: selectedModel.value,
        size: size.value,
        negative_prompt: negativePrompt.value
      })
    } else {
      result = await api.image2image({
        prompt: prompt.value,
        model: selectedModel.value,
        file: inputImageFile.value,
        negative_prompt: negativePrompt.value,
        size: size.value
      })
    }

    if (result.taskId) {
      taskId.value = result.taskId
      toast.info('任务已提交，开始生成...')
      startPolling()
      setTimeout(() => {
        const resultSection = document.getElementById('result-section')
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      error.value = '任务提交失败'
      toast.error('任务提交失败')
      generating.value = false
    }
  } catch (err) {
    error.value = err.message || '生成失败，请重试'
    toast.error(error.value)
    generating.value = false
  }
}

const startPolling = () => {
  if (pollTimer) clearInterval(pollTimer)
  
  progress.value = 1
  
  pollTimer = setInterval(async () => {
    if (!taskId.value) {
      clearInterval(pollTimer)
      return
    }

    try {
      const result = await api.queryTask(taskId.value)
      if (result.task_status === 'SUCCEED') {
        progress.value = 100
        clearInterval(pollTimer)
        if (result.output_images && result.output_images.length > 0) {
          generatedImage.value = result.output_images[0]
          toast.success('图片生成成功！')
        } else {
          error.value = '未生成图片'
        }
        generating.value = false
      } else if (result.task_status === 'FAILED') {
        clearInterval(pollTimer)
        error.value = result.message || '生成失败'
        toast.error(error.value)
        generating.value = false
      } else {
        if (progress.value < 90) {
          const randomIncrement = Math.floor(Math.random() * 4) + 3
          progress.value = Math.min(progress.value + randomIncrement, 90)
        } else if (progress.value < 99) {
          const slowIncrement = Math.floor(Math.random() * 2) + 1
          progress.value = Math.min(progress.value + slowIncrement, 99)
        }
      }
    } catch (err) {
      clearInterval(pollTimer)
      error.value = err.message || '查询任务状态失败'
      generating.value = false
    }
  }, 5000)
}

const cancelGeneration = (showToast = true) => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
  taskId.value = null
  taskStatus.value = ''
  progress.value = 0
  generating.value = false
  if (showToast) {
    toast.info('已取消生成')
  }
}

const generateNewSamePrompt = async () => {
  await generateImage()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB')
      return
    }
    inputImageFile.value = file
    previewInputImage.value = URL.createObjectURL(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB')
      return
    }
    inputImageFile.value = file
    previewInputImage.value = URL.createObjectURL(file)
  } else {
    toast.error('请上传图片文件')
  }
}

const clearInputImage = () => {
  if (previewInputImage.value && previewInputImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewInputImage.value)
  }
  inputImageFile.value = null
  previewInputImage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const downloadImage = async () => {
  if (!generatedImage.value) return
  
  try {
    const response = await fetch(generatedImage.value)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = `ai-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (err) {
    const link = document.createElement('a')
    link.href = generatedImage.value
    link.download = `ai-image-${Date.now()}.png`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
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
