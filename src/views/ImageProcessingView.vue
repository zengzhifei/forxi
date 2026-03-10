<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-6 sm:mb-8">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">在线图片处理</h2>
          <p class="text-sm sm:text-base text-gray-600">调整下方参数实时预览效果，支持多种图片处理功能</p>
        </div>

        <div v-if="!selectedImage" class="max-w-xl mx-auto">
          <div 
            class="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
            @click="triggerFileInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            :class="{ 'border-blue-500 bg-blue-50': isDragging }"
          >
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-4 text-lg font-medium text-gray-900">点击或拖拽图片到此处</p>
            <p class="mt-2 text-sm text-gray-500">支持 JPG、PNG、WebP、GIF 等常见格式</p>
            <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileSelect">
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-700">预览</span>
                <span v-if="hasModifications" class="text-xs text-gray-500">(已修改)</span>
              </div>
              <div class="flex items-center space-x-2">
                <button @click="showDownloadModal = true" :disabled="!previewUrl" class="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span>下载</span>
                </button>
                <button @click="confirmResetAll" :disabled="!hasModifications" class="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  <span>重置全部</span>
                </button>
                <button @click="resetImage" class="px-3 py-1.5 text-gray-500 text-sm hover:text-gray-700">
                  更换图片
                </button>
              </div>
            </div>
            <div class="p-4 bg-gray-100 flex items-center justify-center" :style="{ minHeight: previewHeight + 'px' }">
              <img ref="previewImage" :src="previewUrl || imagePreviewUrl" class="max-w-full max-h-[400px] object-contain">
            </div>
            <div class="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-between text-sm text-gray-500">
              <span>尺寸: {{ displayWidth }} × {{ displayHeight }}</span>
              <span>大小: {{ formatFileSize(displayFileSize) }}</span>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-4">
            <div class="flex flex-wrap gap-1 mb-4 bg-gray-100 rounded-lg p-1">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="switchTab(tab.id)"
                class="relative py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap"
                :class="activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
              >
                {{ tab.name }}
                <span v-if="isTabModified(tab.id)" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>
            </div>

            <div class="min-h-[200px]">
              <!-- 压缩 -->
              <div v-if="activeTab === 'compress'" class="space-y-4">
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <label class="text-sm font-medium text-gray-700">压缩质量</label>
                    <span class="text-sm text-blue-600">{{ compressQuality }}%</span>
                  </div>
                  <input type="range" v-model.number="compressQuality" min="10" max="100" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" @input="applyAllEffects">
                </div>
                <button @click="resetCompress" class="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm">
                  恢复默认
                </button>
              </div>

              <!-- 旋转 -->
              <div v-if="activeTab === 'rotate'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">旋转角度: {{ realRotation }}°</label>
                  <div class="grid grid-cols-4 gap-2 mb-3">
                    <button @click="rotateImage(-90)" class="py-2 px-2 bg-gray-100 rounded-lg hover:bg-gray-200">↺</button>
                    <button @click="rotateImage(90)" class="py-2 px-2 bg-gray-100 rounded-lg hover:bg-gray-200">↻</button>
                    <button @click="rotateImage(-15)" class="py-2 px-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-xs">-15°</button>
                    <button @click="rotateImage(15)" class="py-2 px-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-xs">+15°</button>
                  </div>
                  <input type="range" v-model.number="rotation" min="-180" max="180" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" @input="applyAllEffects">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">翻转</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button @click="toggleFlip('horizontal')" class="py-2 px-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm" :class="flipH ? 'bg-blue-100 border-blue-500' : ''">水平翻转 {{ flipH ? '✓' : '' }}</button>
                    <button @click="toggleFlip('vertical')" class="py-2 px-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm" :class="flipV ? 'bg-blue-100 border-blue-500' : ''">垂直翻转 {{ flipV ? '✓' : '' }}</button>
                  </div>
                </div>
                <button @click="resetRotate" class="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm">
                  恢复默认
                </button>
              </div>

              <!-- 尺寸 -->
              <div v-if="activeTab === 'resize'" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">宽度 (px)</label>
                    <input type="number" v-model.number="resizeWidth" class="w-full px-3 py-2 border border-gray-300 rounded-lg" @input="applyAllEffects">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">高度 (px)</label>
                    <input type="number" v-model.number="resizeHeight" class="w-full px-3 py-2 border border-gray-300 rounded-lg" @input="applyAllEffects">
                  </div>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" id="maintainAspect" v-model="maintainAspectRatio" class="h-4 w-4" @change="applyAllEffects">
                  <label for="maintainAspect" class="ml-2 text-sm text-gray-600">保持宽高比</label>
                </div>
                <div class="text-sm text-gray-500 text-center">
                  原始尺寸: {{ originalWidth }} × {{ originalHeight }}
                </div>
                <button @click="resetResize" class="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm">
                  恢复原始尺寸
                </button>
              </div>

              <!-- 格式转换 -->
              <div v-if="activeTab === 'convert'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">目标格式</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button v-for="format in outputFormats" :key="format" @click="targetFormat = format; applyAllEffects()" class="py-2 px-2 text-sm font-medium border rounded-lg" :class="targetFormat === format ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300'">{{ format.toUpperCase() }}</button>
                  </div>
                </div>
              </div>

              <!-- 水印 -->
              <div v-if="activeTab === 'watermark'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">水印文字</label>
                  <input type="text" v-model="watermarkText" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="输入水印文字" @input="applyAllEffects">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">字体大小</label>
                    <input type="number" v-model.number="watermarkSize" min="12" max="200" class="w-full px-3 py-2 border border-gray-300 rounded-lg" @input="applyAllEffects">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">透明度</label>
                    <input type="number" v-model.number="watermarkOpacity" min="0.1" max="1" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-lg" @input="applyAllEffects">
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">X位置 (%)</label>
                    <input type="number" v-model.number="watermarkX" min="0" max="100" class="w-full px-3 py-2 border border-gray-300 rounded-lg" @input="applyAllEffects">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Y位置 (%)</label>
                    <input type="number" v-model.number="watermarkY" min="0" max="100" class="w-full px-3 py-2 border border-gray-300 rounded-lg" @input="applyAllEffects">
                  </div>
                </div>
                <button @click="resetWatermark" class="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm">
                  清除水印
                </button>
              </div>

              <!-- 文字 -->
              <div v-if="activeTab === 'text'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">文字内容</label>
                  <input type="text" v-model="imageText" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="输入文字" @input="applyAllEffects">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">字体大小</label>
                    <input type="number" v-model.number="textSize" min="12" max="200" class="w-full px-3 py-2 border border-gray-300 rounded-lg" @input="applyAllEffects">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">颜色</label>
                    <input type="color" v-model="textColor" class="w-full h-10 border border-gray-300 rounded-lg">
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">X位置 (%)</label>
                    <input type="number" v-model.number="textX" min="0" max="100" class="w-full px-3 py-2 border border-gray-300 rounded-lg" @input="applyAllEffects">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Y位置 (%)</label>
                    <input type="number" v-model.number="textY" min="0" max="100" class="w-full px-3 py-2 border border-gray-300 rounded-lg" @input="applyAllEffects">
                  </div>
                </div>
                <button @click="resetText" class="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm">
                  清除文字
                </button>
              </div>

              <!-- 拼接 -->
              <div v-if="activeTab === 'merge'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">拼接方向</label>
                  <select v-model="mergeDirection" class="w-full px-3 py-2 border border-gray-300 rounded-lg" @change="markModified('merge'); applyAllEffects()">
                    <option value="horizontal">水平拼接</option>
                    <option value="vertical">垂直拼接</option>
                  </select>
                </div>
                <div v-if="!secondImageUrl">
                  <label class="block text-sm font-medium text-gray-700 mb-1">选择第二张图片</label>
                  <div 
                    class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400"
                    @click="triggerSecondFileInput"
                  >
                    <p class="text-sm text-gray-500">点击选择第二张图片</p>
                    <input ref="secondFileInput" type="file" class="hidden" accept="image/*" @change="handleSecondFileSelect">
                  </div>
                </div>
                <div v-else class="space-y-2">
                  <p class="text-sm text-gray-700">已选择第二张图片</p>
                  <img :src="secondImageUrl" class="w-full h-20 object-contain border rounded-lg">
                </div>
                <button @click="resetMerge" class="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm">
                  恢复默认
                </button>
              </div>

              <!-- 九宫格 -->
              <div v-if="activeTab === 'grid'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">宫格数量</label>
                  <select v-model="gridCount" class="w-full px-3 py-2 border border-gray-300 rounded-lg" @change="markModified('grid'); applyAllEffects()">
                    <option :value="1">原图 (1×1)</option>
                    <option :value="3">九宫格 (3×3)</option>
                    <option :value="4">四宫格 (2×2)</option>
                    <option :value="6">六宫格 (2×3)</option>
                    <option :value="2">二宫格 (1×2)</option>
                  </select>
                </div>
                <button @click="resetGrid" class="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm">
                  恢复原图
                </button>
              </div>

              <!-- 圆形裁剪 -->
              <div v-if="activeTab === 'circle'" class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700">启用圆形裁剪</label>
                  <div class="relative inline-block w-12 mr-2 align-middle select-none cursor-pointer" @click="enableCircleCrop = !enableCircleCrop; markModified('circle'); applyAllEffects()">
                    <input type="checkbox" v-model="enableCircleCrop" class="sr-only">
                    <div class="block bg-gray-300 w-12 h-6 rounded-full"></div>
                    <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                  </div>
                </div>
                <button @click="resetCircle" class="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm">
                  恢复默认
                </button>
              </div>

              <!-- 证件照 -->
              <div v-if="activeTab === 'idphoto'" class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700">启用证件照模式</label>
                  <div class="relative inline-block w-12 mr-2 align-middle select-none cursor-pointer" @click="enableIdPhoto = !enableIdPhoto; markModified('idphoto'); applyAllEffects()">
                    <input type="checkbox" v-model="enableIdPhoto" class="sr-only">
                    <div class="block bg-gray-300 w-12 h-6 rounded-full"></div>
                    <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">证件照尺寸</label>
                  <select v-model="idPhotoSize" class="w-full px-3 py-2 border border-gray-300 rounded-lg" @change="markModified('idphoto'); applyAllEffects()">
                    <option value="35x25mm">一寸 (35×25mm)</option>
                    <option value="45x35mm">二寸 (45×35mm)</option>
                    <option value="33x48mm">小二寸 (33×48mm)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">背景颜色</label>
                  <div class="flex gap-2">
                    <button @click="idPhotoBg = 'white'; markModified('idphoto'); applyAllEffects()" class="flex-1 py-2 border rounded-lg" :class="idPhotoBg === 'white' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">白底</button>
                    <button @click="idPhotoBg = 'blue'; markModified('idphoto'); applyAllEffects()" class="flex-1 py-2 border rounded-lg" :class="idPhotoBg === 'blue' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">蓝底</button>
                    <button @click="idPhotoBg = 'red'; markModified('idphoto'); applyAllEffects()" class="flex-1 py-2 border rounded-lg" :class="idPhotoBg === 'red' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">红底</button>
                  </div>
                </div>
                <button @click="resetIdPhoto" class="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm">
                  恢复默认
                </button>
              </div>

              <!-- 滤镜 -->
              <div v-if="activeTab === 'filter'" class="space-y-4">
                <div class="grid grid-cols-2 gap-2">
                  <button v-for="f in filters" :key="f.id" @click="currentFilter = f.id; markModified('filter'); applyAllEffects()" class="py-2 px-2 text-xs font-medium border rounded-lg" :class="currentFilter === f.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"> {{ f.name }}</button>
                </div>
                <button @click="resetFilter" class="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm">
                  恢复默认
                </button>
              </div>

              <!-- 马赛克 -->
              <div v-if="activeTab === 'mosaic'" class="space-y-4">
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <label class="text-sm font-medium text-gray-700">马赛克强度</label>
                    <span class="text-sm text-blue-600">{{ mosaicLevel }}</span>
                  </div>
                  <input type="range" v-model.number="mosaicLevel" min="5" max="50" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" @input="markModified('mosaic'); applyAllEffects()">
                </div>
                <button @click="resetMosaic" class="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm">
                  恢复原图
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 mt-6 max-w-3xl mx-auto">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">功能说明</h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>所有图片处理在客户端完成，保护您的隐私安全</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />

    <div v-if="showDownloadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showDownloadModal = false">
      <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">下载图片</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">保存格式</label>
            <div class="grid grid-cols-3 gap-2">
              <button v-for="fmt in downloadFormats" :key="fmt" @click="downloadFormat = fmt" class="py-2 px-2 text-sm font-medium border rounded-lg" :class="downloadFormat === fmt ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300'">{{ fmt.toUpperCase() }}</button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">文件名</label>
            <input type="text" v-model="downloadFileName" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="输入文件名">
          </div>
        </div>
        <div class="flex space-x-3 mt-6">
          <button @click="showDownloadModal = false" class="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
            取消
          </button>
          <button @click="confirmDownload" class="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
            下载
          </button>
        </div>
      </div>
    </div>

    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showConfirmModal = false">
      <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">确认重置</h3>
        <p class="text-gray-600 mb-6">确定要将所有配置恢复为默认状态吗？此操作不可撤销。</p>
        <div class="flex space-x-3">
          <button @click="showConfirmModal = false" class="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
            取消
          </button>
          <button @click="executeResetAll" class="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700">
            确认重置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import imageCompression from 'browser-image-compression'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const fileInput = ref(null)
const previewImage = ref(null)
const secondFileInput = ref(null)
const selectedImage = ref(null)
const secondImageFile = ref(null)
const imagePreviewUrl = ref('')
const secondImageUrl = ref('')
const previewUrl = ref('')
const displayFileSize = ref(0)
const displayWidth = ref(0)
const displayHeight = ref(0)
const originalFileSize = ref(0)
const originalWidth = ref(0)
const originalHeight = ref(0)
const processing = ref(false)
const isDragging = ref(false)
const activeTab = ref('compress')
const modifiedTabs = ref(new Set())

const showDownloadModal = ref(false)
const showConfirmModal = ref(false)
const downloadFormat = ref('jpg')
const downloadFileName = ref('processed')

const downloadFormats = ['jpg', 'png', 'webp']

const tabs = [
  { id: 'compress', name: '压缩' },
  { id: 'rotate', name: '旋转' },
  { id: 'resize', name: '尺寸' },
  { id: 'watermark', name: '水印' },
  { id: 'text', name: '文字' },
  { id: 'merge', name: '拼接' },
  { id: 'grid', name: '九宫格' },
  { id: 'circle', name: '圆形' },
  { id: 'idphoto', name: '证件照' },
  { id: 'filter', name: '滤镜' },
  { id: 'mosaic', name: '马赛克' }
]

const filters = [
  { id: 'none', name: '原图' },
  { id: 'grayscale', name: '灰度' },
  { id: 'sepia', name: '复古' },
  { id: 'brightness', name: '提亮' },
  { id: 'contrast', name: '对比' },
  { id: 'blur', name: '模糊' }
]

const previewHeight = computed(() => window.innerWidth < 768 ? 300 : 400)

const compressQuality = ref(100)
const resizeWidth = ref(0)
const resizeHeight = ref(0)
const maintainAspectRatio = ref(true)

const watermarkText = ref('')
const watermarkSize = ref(24)
const watermarkOpacity = ref(0.5)
const watermarkX = ref(50)
const watermarkY = ref(50)

const imageText = ref('')
const textSize = ref(32)
const textColor = ref('#000000')
const textX = ref(50)
const textY = ref(50)

const mergeDirection = ref('horizontal')
const gridCount = ref(1)
const idPhotoSize = ref('35x25mm')
const idPhotoBg = ref('white')
const currentFilter = ref('none')
const mosaicLevel = ref(20)
const enableCircleCrop = ref(false)
const enableIdPhoto = ref(false)

const rotation = ref(0)
const flipH = ref(false)
const flipV = ref(false)

const realRotation = computed(() => {
  let r = rotation.value % 360
  if (r < 0) r += 360
  return r
})

const hasModifications = computed(() => modifiedTabs.value.size > 0)

const isTabModified = (tabId) => {
  return modifiedTabs.value.has(tabId)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const markModified = (tabId) => {
  const newSet = new Set(modifiedTabs.value)
  newSet.add(tabId)
  modifiedTabs.value = newSet
}

const clearModified = (tabId) => {
  const newSet = new Set(modifiedTabs.value)
  newSet.delete(tabId)
  modifiedTabs.value = newSet
}

const clearAllModified = () => {
  modifiedTabs.value = new Set()
}

const switchTab = (tabId) => {
  activeTab.value = tabId
  // 不再自动初始化裁剪器，等待用户点击"应用裁剪"按钮时再初始化
}

const triggerFileInput = () => fileInput.value.click()
const triggerSecondFileInput = () => secondFileInput.value.click()

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  loadImage(file)
}

const handleSecondFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  secondImageFile.value = file
  secondImageUrl.value = URL.createObjectURL(file)
  markModified('merge')
  applyAllEffects()
}

const clearSecondImage = () => {
  secondImageFile.value = null
  secondImageUrl.value = ''
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (!file || !file.type.startsWith('image/')) return
  loadImage(file)
}

const loadImage = (file) => {
  selectedImage.value = file
  originalFileSize.value = file.size
  displayFileSize.value = file.size
  imagePreviewUrl.value = URL.createObjectURL(file)
  previewUrl.value = imagePreviewUrl.value
  secondImageUrl.value = ''
  secondImageFile.value = null
  
  resetAllSettings()
  
  const img = new Image()
  img.onload = () => {
    originalWidth.value = img.width
    originalHeight.value = img.height
    displayWidth.value = img.width
    displayHeight.value = img.height
    resizeWidth.value = img.width
    resizeHeight.value = img.height
  }
  img.src = imagePreviewUrl.value
}

const resetAllSettings = () => {
  compressQuality.value = 100
  rotation.value = 0
  flipH.value = false
  flipV.value = false
  watermarkText.value = ''
  watermarkSize.value = 24
  watermarkOpacity.value = 0.5
  watermarkX.value = 50
  watermarkY.value = 50
  imageText.value = ''
  textSize.value = 32
  textColor.value = '#000000'
  textX.value = 50
  textY.value = 50
  gridCount.value = 1
  idPhotoSize.value = '35x25mm'
  idPhotoBg.value = 'white'
  currentFilter.value = 'none'
  mosaicLevel.value = 20
  mergeDirection.value = 'horizontal'
  enableCircleCrop.value = false
  enableIdPhoto.value = false
  clearAllModified()
  previewUrl.value = imagePreviewUrl.value
  displayFileSize.value = originalFileSize.value
  displayWidth.value = originalWidth.value
  displayHeight.value = originalHeight.value
}

const resetImage = () => {
  selectedImage.value = null
  imagePreviewUrl.value = ''
  previewUrl.value = ''
  displayFileSize.value = 0
  originalFileSize.value = 0
  originalWidth.value = 0
  originalHeight.value = 0
  displayWidth.value = 0
  displayHeight.value = 0
  secondImageUrl.value = ''
  secondImageFile.value = null
  resetAllSettings()
}

const applyAllEffects = async (forceMark = false) => {
  if (forceMark) {
    markModified(activeTab.value)
  }
  processing.value = true
  
  try {
    let currentImg = selectedImage.value
    
    if (currentFilter.value !== 'none' || mosaicLevel.value !== 20 || gridCount.value !== 1 || 
        watermarkText.value || imageText.value || mergeDirection.value !== 'horizontal' || secondImageUrl.value ||
        rotation.value !== 0 || flipH.value || flipV.value ||
        resizeWidth.value !== originalWidth.value || resizeHeight.value !== originalHeight.value ||
        enableCircleCrop.value || enableIdPhoto.value) {
      currentImg = await processWithEffects()
    }
    
    if (compressQuality.value !== 100) {
      currentImg = await processWithCompression(currentImg)
    }
    
    if (currentImg) {
      const url = URL.createObjectURL(currentImg)
      if (previewUrl.value && previewUrl.value !== imagePreviewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
      }
      previewUrl.value = url
      displayFileSize.value = currentImg.size
      
      const img = new Image()
      img.onload = () => {
        displayWidth.value = img.width
        displayHeight.value = img.height
      }
      img.src = url
    }
  } catch (e) {
    console.error(e)
  }
  
  processing.value = false
}

const processWithEffects = async () => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let width = img.width
      let height = img.height
      
      if (resizeWidth.value !== originalWidth.value || resizeHeight.value !== originalHeight.value) {
        width = resizeWidth.value
        height = resizeHeight.value
      } else if (Math.abs(rotation.value) === 90 || Math.abs(rotation.value) === 270) {
        [width, height] = [height, width]
      }
      
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      
      ctx.translate(width / 2, height / 2)
      ctx.rotate(rotation.value * Math.PI / 180)
      ctx.scale(flipH.value ? -1 : 1, flipV.value ? -1 : 1)
      
      if (resizeWidth.value !== originalWidth.value || resizeHeight.value !== originalHeight.value) {
        const scale = Math.min(width / img.width, height / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        ctx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight)
      } else {
        ctx.drawImage(img, -img.width / 2, -img.height / 2)
      }
      
      if (watermarkText.value) {
        ctx.font = `${watermarkSize.value}px Arial`
        ctx.fillStyle = `rgba(255,255,255,${watermarkOpacity.value})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        // 由于坐标系已经平移到中心，直接使用百分比位置
        const x = (watermarkX.value - 50) / 50 * width / 2
        const y = (watermarkY.value - 50) / 50 * height / 2
        ctx.fillText(watermarkText.value, x, y)
      }
      
      if (imageText.value) {
        ctx.font = `${textSize.value}px Arial`
        ctx.fillStyle = textColor.value
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        // 由于坐标系已经平移到中心，直接使用百分比位置
        const x = (textX.value - 50) / 50 * width / 2
        const y = (textY.value - 50) / 50 * height / 2
        ctx.fillText(imageText.value, x, y)
      }
      
      if (currentFilter.value === 'grayscale') {
        // 保存当前状态
        ctx.save()
        // 重置坐标系到原始状态
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2]
          data[i] = data[i+1] = data[i+2] = gray
        }
        ctx.putImageData(imageData, 0, 0)
        
        // 恢复之前的状态
        ctx.restore()
      } else if (currentFilter.value === 'sepia') {
        // 保存当前状态
        ctx.save()
        // 重置坐标系到原始状态
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, 0.393 * data[i] + 0.769 * data[i+1] + 0.189 * data[i+2])
          data[i+1] = Math.min(255, 0.349 * data[i] + 0.686 * data[i+1] + 0.168 * data[i+2])
          data[i+2] = Math.min(255, 0.272 * data[i] + 0.534 * data[i+1] + 0.131 * data[i+2])
        }
        ctx.putImageData(imageData, 0, 0)
        
        // 恢复之前的状态
        ctx.restore()
      } else if (currentFilter.value === 'brightness') {
        // 保存当前状态
        ctx.save()
        // 重置坐标系到原始状态
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] + 30)
          data[i+1] = Math.min(255, data[i+1] + 30)
          data[i+2] = Math.min(255, data[i+2] + 30)
        }
        ctx.putImageData(imageData, 0, 0)
        
        // 恢复之前的状态
        ctx.restore()
      } else if (currentFilter.value === 'contrast') {
        // 保存当前状态
        ctx.save()
        // 重置坐标系到原始状态
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        const factor = 1.5
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, (data[i] - 128) * factor + 128))
          data[i+1] = Math.min(255, Math.max(0, (data[i+1] - 128) * factor + 128))
          data[i+2] = Math.min(255, Math.max(0, (data[i+2] - 128) * factor + 128))
        }
        ctx.putImageData(imageData, 0, 0)
        
        // 恢复之前的状态
        ctx.restore()
      }
      
      if (mosaicLevel.value !== 20) {
        // 保存当前状态
        ctx.save()
        // 重置坐标系到原始状态
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        
        const size = mosaicLevel.value
        for (let y = 0; y < height; y += size) {
          for (let x = 0; x < width; x += size) {
            const pixel = ctx.getImageData(x, y, 1, 1).data
            ctx.fillStyle = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`
            ctx.fillRect(x, y, size, size)
          }
        }
        
        // 恢复之前的状态
        ctx.restore()
      }
      
      if (gridCount.value !== 1) {
        // 保存当前状态
        ctx.save()
        // 重置坐标系到原始状态
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        
        let rows, cols
        switch (gridCount.value) {
          case 2: // 二宫格 (1×2)
            rows = 1
            cols = 2
            break
          case 4: // 四宫格 (2×2)
            rows = 2
            cols = 2
            break
          case 6: // 六宫格 (2×3)
            rows = 2
            cols = 3
            break
          default:
            rows = 3
            cols = 3
        }
        
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = width
        tempCanvas.height = height
        const tempCtx = tempCanvas.getContext('2d')
        tempCtx.drawImage(canvas, 0, 0)
        
        ctx.clearRect(0, 0, width, height)
        const cellWidth = width / cols
        const cellHeight = height / rows
        
        let index = 0
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            ctx.drawImage(tempCanvas, 0, 0, width, height, j * cellWidth, i * cellHeight, cellWidth, cellHeight)
            index++
          }
        }
        
        // 恢复之前的状态
        ctx.restore()
      }
      
      if (enableCircleCrop.value) {
        // 保存当前状态
        ctx.save()
        // 重置坐标系到原始状态
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        
        const circleCanvas = document.createElement('canvas')
        const circleCtx = circleCanvas.getContext('2d', { willReadFrequently: true })
        const size = Math.min(width, height)
        circleCanvas.width = size
        circleCanvas.height = size
        
        circleCtx.beginPath()
        circleCtx.arc(size/2, size/2, size/2, 0, Math.PI * 2)
        circleCtx.closePath()
        circleCtx.clip()
        
        const x = (size - width) / 2
        const y = (size - height) / 2
        circleCtx.drawImage(canvas, x, y)
        
        circleCanvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/png', 1)
        return
      } else if (enableIdPhoto.value) {
        // 保存当前状态
        ctx.save()
        // 重置坐标系到原始状态
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        
        const sizes = { '35x25mm': [413, 295], '45x35mm': [531, 413], '33x48mm': [390, 567] }
        const [idWidth, idHeight] = sizes[idPhotoSize.value]
        const bgColors = { white: '#ffffff', blue: '#0066cc', red: '#cc0000' }
        
        const idCanvas = document.createElement('canvas')
        const idCtx = idCanvas.getContext('2d', { willReadFrequently: true })
        idCanvas.width = idWidth
        idCanvas.height = idHeight
        
        idCtx.fillStyle = bgColors[idPhotoBg.value]
        idCtx.fillRect(0, 0, idWidth, idHeight)
        
        const scale = Math.min(idWidth / width, idHeight / height)
        const w = width * scale
        const h = height * scale
        const x = (idWidth - w) / 2
        const y = (idHeight - h) / 2
        
        idCtx.drawImage(canvas, x, y, w, h)
        
        idCanvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/jpeg', 0.92)
        return
      } else if (secondImageUrl.value) {
        const img2 = new Image()
        img2.onload = () => {
          const mergeCanvas = document.createElement('canvas')
          const ctx2 = mergeCanvas.getContext('2d')
          let mWidth, mHeight
          
          if (mergeDirection.value === 'horizontal') {
            mWidth = width + img2.width
            mHeight = Math.max(height, img2.height)
          } else {
            mWidth = Math.max(width, img2.width)
            mHeight = height + img2.height
          }
          
          mergeCanvas.width = mWidth
          mergeCanvas.height = mHeight
          
          if (mergeDirection.value === 'horizontal') {
            ctx2.drawImage(canvas, 0, (mHeight - height) / 2)
            ctx2.drawImage(img2, width, (mHeight - img2.height) / 2)
          } else {
            ctx2.drawImage(canvas, (mWidth - width) / 2, 0)
            ctx2.drawImage(img2, (mWidth - img2.width) / 2, height)
          }
          
          mergeCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92)
        }
        img2.src = secondImageUrl.value
      } else {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92)
      }
    }
    img.src = imagePreviewUrl.value
  })
}

const processWithCompression = async (file) => {
  const options = { 
    maxSizeMB: 10, 
    maxWidthOrHeight: Math.max(resizeWidth.value, resizeHeight.value), 
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: compressQuality.value / 100
  }
  return await imageCompression(file, options)
}

const rotateImage = (angle) => {
  rotation.value = (rotation.value + angle) % 360
  applyAllEffects()
}

const toggleFlip = (direction) => {
  if (direction === 'horizontal') flipH.value = !flipH.value
  else flipV.value = !flipV.value
  applyAllEffects()
}

const resetRotate = () => {
  rotation.value = 0
  flipH.value = false
  flipV.value = false
  clearModified('rotate')
  applyAllEffects()
}

const resetResize = () => {
  resizeWidth.value = originalWidth.value
  resizeHeight.value = originalHeight.value
  clearModified('resize')
  applyAllEffects()
}

const resetWatermark = () => {
  watermarkText.value = ''
  clearModified('watermark')
  applyAllEffects()
}

const resetText = () => {
  imageText.value = ''
  clearModified('text')
  applyAllEffects()
}

const applyMerge = async () => {
  if (!secondImageUrl.value) return
  processing.value = true
  await applyAllEffects()
  processing.value = false
}

const resetGrid = () => {
  gridCount.value = 1
  clearModified('grid')
  applyAllEffects()
}

const resetMerge = () => {
  secondImageFile.value = null
  secondImageUrl.value = ''
  clearModified('merge')
  applyAllEffects()
}

const applyCircleCrop = async () => {
  processing.value = true
  const img = new Image()
  img.onload = () => {
    const size = Math.min(img.width, img.height)
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    
    ctx.beginPath()
    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    
    const x = (size - img.width) / 2
    const y = (size - img.height) / 2
    ctx.drawImage(img, x, y)
    
    canvas.toBlob((blob) => {
      previewUrl.value = URL.createObjectURL(blob)
      displayFileSize.value = blob.size
      displayWidth.value = size
      displayHeight.value = size
      markModified('circle')
      processing.value = false
    }, 'image/png', 1)
  }
  img.src = previewUrl.value || imagePreviewUrl.value
}

const applyIdPhoto = async () => {
  processing.value = true
  const sizes = { '35x25mm': [413, 295], '45x35mm': [531, 413], '33x48mm': [390, 567] }
  const [width, height] = sizes[idPhotoSize.value]
  const bgColors = { white: '#ffffff', blue: '#0066cc', red: '#cc0000' }
  
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    
    ctx.fillStyle = bgColors[idPhotoBg.value]
    ctx.fillRect(0, 0, width, height)
    
    const scale = Math.min(width / img.width, height / img.height)
    const w = img.width * scale
    const h = img.height * scale
    const x = (width - w) / 2
    const y = (height - h) / 2
    
    ctx.drawImage(img, x, y, w, h)
    
    canvas.toBlob((blob) => {
      previewUrl.value = URL.createObjectURL(blob)
      displayFileSize.value = blob.size
      displayWidth.value = width
      displayHeight.value = height
      markModified('idphoto')
      processing.value = false
    }, 'image/jpeg', 0.92)
  }
  img.src = previewUrl.value || imagePreviewUrl.value
}

const resetCompress = () => {
  compressQuality.value = 100
  clearModified('compress')
  applyAllEffects()
}

const resetMosaic = () => {
  mosaicLevel.value = 20
  clearModified('mosaic')
  applyAllEffects()
}

const resetCircle = () => {
  enableCircleCrop.value = false
  clearModified('circle')
  applyAllEffects()
}

const resetIdPhoto = () => {
  enableIdPhoto.value = false
  idPhotoSize.value = '35x25mm'
  idPhotoBg.value = 'white'
  clearModified('idphoto')
  applyAllEffects()
}

const resetFilter = () => {
  currentFilter.value = 'none'
  clearModified('filter')
  applyAllEffects()
}

const resetAll = () => {
  resetAllSettings()
}

const confirmResetAll = () => {
  if (!hasModifications.value) return
  showConfirmModal.value = true
}

const executeResetAll = () => {
  showConfirmModal.value = false
  resetAll()
}

const confirmDownload = () => {
  const link = document.createElement('a')
  link.href = previewUrl.value || imagePreviewUrl.value
  const ext = downloadFormat.value
  link.download = `${downloadFileName.value || 'processed'}.${ext}`
  link.click()
  showDownloadModal.value = false
}

onBeforeUnmount(() => {
  if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value)
  if (previewUrl.value && previewUrl.value !== imagePreviewUrl.value) URL.revokeObjectURL(previewUrl.value)
  if (secondImageUrl.value) URL.revokeObjectURL(secondImageUrl.value)
})
</script>

<style scoped>
.dot {
  transition: all 0.3s ease;
}

input:checked + div {
  background-color: #3b82f6;
}

input:checked + div + .dot {
  transform: translateX(100%);
}
</style>
