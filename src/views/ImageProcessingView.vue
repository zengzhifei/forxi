<template>
  <div class="min-h-screen bg-gray-100 text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 class="sr-only">免费在线图片处理 - 图片压缩、裁剪、旋转、水印、格式转换</h1>
        <div class="text-center mb-8" data-snippet>
          <h2 class="text-2xl font-semibold text-zinc-700 mb-2">图片处理</h2>
          <p class="text-sm text-zinc-400">支持在线图片压缩、裁剪、滤镜、拼接等多种处理功能</p>
        </div>

        <div v-if="!selectedImage" class="max-w-xl mx-auto">
          <div
            class="border-2 border-dashed border-zinc-200 rounded-xl p-12 text-center hover:border-zinc-300 transition-colors cursor-pointer"
            @click="triggerFileInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            :class="{ 'border-zinc-400 bg-zinc-50': isDragging }"
          >
            <svg class="mx-auto h-16 w-16 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-4 text-lg font-medium text-zinc-600">点击或拖拽图片到此处</p>
            <p class="mt-2 text-sm text-zinc-400">支持 JPG、PNG、GIF、WebP、BMP 等常见格式</p>
            <input ref="fileInput" type="file" class="hidden" accept="image/jpeg,image/png,image/gif,image/webp,image/bmp" @change="handleFileSelect">
          </div>
        </div>

        <div v-else class="space-y-4 max-w-4xl mx-auto">
          <div class="bg-white border border-zinc-100 shadow-sm rounded-xl overflow-hidden">
            <div class="p-3 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-zinc-600">预览</span>
              </div>
              <div class="flex items-center space-x-2">
                <button @click="openDownloadModal" :disabled="!previewUrl" class="px-3 py-1.5 text-white text-sm rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center space-x-1" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span>下载</span>
                </button>
                <button @click="confirmResetAll" :disabled="!hasModifications" class="px-3 py-1.5 border border-zinc-200 text-zinc-400 hover:bg-zinc-50 rounded-xl text-sm disabled:opacity-50 flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  <span>重置全部</span>
                </button>
                <button @click="resetImage" class="px-3 py-1.5 border border-zinc-200 text-zinc-500 hover:bg-zinc-50 rounded-xl text-sm flex items-center space-x-1 transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>更换图片</span>
                </button>
              </div>
            </div>
            <div class="p-4 bg-zinc-100 flex items-center justify-center relative" :style="{ minHeight: previewHeight + 'px' }">
              <!-- 抠图双图预览 -->
              <div v-if="activeTab === 'ai-remove-bg' && cutoutBgUrl" class="w-full grid grid-cols-2 gap-3">
                <div class="flex flex-col items-center gap-2">
                  <div class="bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAH0lEQVQ4T2NkYGD4z8BQDwAAAQ8AAXwkMp8AAAAASUVORK5CYII=')] rounded-lg overflow-hidden">
                    <img :src="previewUrl" class="max-w-full max-h-[320px] object-contain block" alt="前景图（透明背景）" />
                  </div>
                  <span class="text-xs text-zinc-400">前景图（透明）</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <div class="rounded-lg overflow-hidden">
                    <img :src="cutoutBgUrl" class="max-w-full max-h-[320px] object-contain block" alt="修复背景图" />
                  </div>
                  <span class="text-xs text-zinc-400">修复背景图</span>
                </div>
              </div>
              <!-- 普通单图预览 -->
              <div v-else class="relative inline-block" ref="imageContainer">
                <img
                  ref="previewImage"
                  :src="previewUrl || imagePreviewUrl"
                  class="max-w-full max-h-[400px] object-contain select-none block"
                  :class="{ 'cursor-move': activeTab === 'ai-crop' && enableAICrop }"
                  alt="图片处理预览"
                  @mousedown="handleCropMouseDown"
                >
                <div
                  v-if="activeTab === 'ai-crop' && enableAICrop && !isCropped"
                  class="absolute inset-0 pointer-events-none"
                >
                  <div
                    class="absolute border-2 border-white bg-black/30 pointer-events-auto"
                    :style="cropBoxStyle"
                    @mousedown.stop="startDrag"
                    @touchstart.stop="startDrag"
                  >
                    <div class="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                      <div v-for="i in 9" :key="i" class="border border-white/30"></div>
                    </div>
                    <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-white -translate-y-1/2 pointer-events-auto cursor-row-resize" @mousedown.stop="startResize($event, 'top')" @touchstart.stop="startResize($event, 'top')"></div>
                    <div class="absolute top-0 left-1/2 w-0.5 bg-white -translate-x-1/2 pointer-events-auto cursor-col-resize" @mousedown.stop="startResize($event, 'right')" @touchstart.stop="startResize($event, 'right')"></div>
                    <div class="absolute bottom-1/2 left-0 right-0 h-0.5 bg-white translate-y-1/2 pointer-events-auto cursor-row-resize" @mousedown.stop="startResize($event, 'bottom')" @touchstart.stop="startResize($event, 'bottom')"></div>
                    <div class="absolute top-0 left-1/2 w-0.5 bg-white -translate-x-1/2 pointer-events-auto cursor-col-resize" @mousedown.stop="startResize($event, 'left')" @touchstart.stop="startResize($event, 'left')"></div>
                    <div class="absolute top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-auto cursor-nw-resize" @mousedown.stop="startResize($event, 'nw')" @touchstart.stop="startResize($event, 'nw')"></div>
                    <div class="absolute top-0 right-0 w-3 h-3 bg-white rounded-full pointer-events-auto cursor-ne-resize" @mousedown.stop="startResize($event, 'ne')" @touchstart.stop="startResize($event, 'ne')"></div>
                    <div class="absolute bottom-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-auto cursor-sw-resize" @mousedown.stop="startResize($event, 'sw')" @touchstart.stop="startResize($event, 'sw')"></div>
                    <div class="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full pointer-events-auto cursor-se-resize" @mousedown.stop="startResize($event, 'se')" @touchstart.stop="startResize($event, 'se')"></div>
                  </div>
                </div>
                <!-- 颜色涂抹画布 -->
                <canvas
                  v-if="activeTab === 'mosaic'"
                  ref="brushCanvas"
                  class="absolute pointer-events-auto"
                  :style="brushCanvasStyle"
                  @mousedown="startBrushDrawing"
                  @mousemove="handleBrushDrawing"
                  @mouseup="stopBrushDrawing"
                  @mouseleave="stopBrushDrawing"
                  @touchstart.prevent="startBrushDrawing"
                  @touchmove.prevent="handleBrushDrawing"
                  @touchend.prevent="stopBrushDrawing"
                ></canvas>
              </div>
            </div>
            <div class="px-4 py-2 bg-zinc-50 border-t border-zinc-100 flex justify-between text-sm text-zinc-400">
              <span>尺寸: {{ displayWidth }} × {{ displayHeight }}</span>
              <span>大小: {{ formatFileSize(displayFileSize) }}</span>
            </div>
          </div>

          <div class="bg-white border border-zinc-100 shadow-sm rounded-xl p-4">
            <div class="flex flex-wrap gap-1 mb-4 bg-zinc-100 rounded-xl p-1">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="switchTab(tab.id)"
                class="relative py-2 px-3 text-xs font-medium rounded-xl transition-colors whitespace-nowrap"
                :class="activeTab === tab.id ? 'bg-white text-zinc-700 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'"
              >
                <span v-if="tab.isAi" class="text-[10px] text-zinc-400 mr-1">AI</span>{{ tab.name }}
                <span v-if="isTabModified(tab.id)" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>
            </div>

            <div class="min-h-[200px]">
              <!-- 压缩 -->
              <div v-if="activeTab === 'compress'" class="space-y-4">
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <label class="text-sm font-medium text-zinc-600">压缩质量</label>
                    <span class="text-sm text-zinc-400">{{ compressQuality }}%</span>
                  </div>
                  <input type="range" v-model.number="compressQuality" min="10" max="100" class="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer" @input="applyAllEffects">
                </div>
                <button @click="resetCompress" class="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
                  恢复默认
                </button>
              </div>

              <!-- 旋转 -->
              <div v-if="activeTab === 'rotate'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-zinc-600 mb-2">旋转角度: {{ realRotation }}°</label>
                  <div class="grid grid-cols-4 gap-2 mb-3">
                    <button @click="rotateImage(-90)" class="py-2 px-2 bg-zinc-100 rounded-xl hover:bg-zinc-200">↺</button>
                    <button @click="rotateImage(90)" class="py-2 px-2 bg-zinc-100 rounded-xl hover:bg-zinc-200">↻</button>
                    <button @click="rotateImage(-15)" class="py-2 px-2 bg-zinc-100 rounded-xl hover:bg-zinc-200 text-xs">-15°</button>
                    <button @click="rotateImage(15)" class="py-2 px-2 bg-zinc-100 rounded-xl hover:bg-zinc-200 text-xs">+15°</button>
                  </div>
                  <input type="range" v-model.number="rotation" min="-180" max="180" class="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer" @input="applyAllEffects">
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-600 mb-2">翻转</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button @click="toggleFlip('horizontal')" class="py-2 px-2 bg-zinc-100 rounded-xl hover:bg-zinc-200 text-sm" :class="flipH ? 'bg-zinc-200 text-zinc-700' : ''">水平翻转 {{ flipH ? '✓' : '' }}</button>
                    <button @click="toggleFlip('vertical')" class="py-2 px-2 bg-zinc-100 rounded-xl hover:bg-zinc-200 text-sm" :class="flipV ? 'bg-zinc-200 text-zinc-700' : ''">垂直翻转 {{ flipV ? '✓' : '' }}</button>
                  </div>
                </div>
                <button @click="resetRotate" class="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
                  恢复默认
                </button>
              </div>

              <!-- 尺寸 -->
              <div v-if="activeTab === 'resize'" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">宽度 (px)</label>
                    <input type="number" v-model.number="resizeWidth" class="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 text-zinc-700 placeholder-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:bg-white rounded-xl outline-none transition-all" @input="applyAllEffects">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">高度 (px)</label>
                    <input type="number" v-model.number="resizeHeight" class="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 text-zinc-700 placeholder-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:bg-white rounded-xl outline-none transition-all" @input="applyAllEffects">
                  </div>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" id="maintainAspect" v-model="maintainAspectRatio" class="h-4 w-4" @change="applyAllEffects">
                  <label for="maintainAspect" class="ml-2 text-sm text-zinc-600">保持宽高比</label>
                </div>
                <div class="text-sm text-zinc-400 text-center">
                  原始尺寸: {{ originalWidth }} × {{ originalHeight }}
                </div>
                <button @click="resetResize" class="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
                  恢复默认
                </button>
              </div>

              <!-- 水印 -->
              <div v-if="activeTab === 'watermark'" class="space-y-4">
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">水印文字</label>
                    <input type="text" v-model="watermarkText" class="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 text-zinc-700 placeholder-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:bg-white rounded-xl outline-none transition-all" placeholder="输入水印文字" @input="applyAllEffects">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">颜色</label>
                    <input type="color" v-model="watermarkColor" class="w-full h-10 border border-zinc-200 rounded-xl cursor-pointer" @input="applyAllEffects">
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">字体大小</label>
                    <input type="number" v-model.number="watermarkSize" min="12" max="200" class="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 text-zinc-700 placeholder-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:bg-white rounded-xl outline-none transition-all" @input="applyAllEffects">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">透明度</label>
                    <input type="number" v-model.number="watermarkOpacity" min="0.1" max="1" step="0.1" class="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 text-zinc-700 placeholder-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:bg-white rounded-xl outline-none transition-all" @input="applyAllEffects">
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">X位置 (%)</label>
                    <input type="number" v-model.number="watermarkX" min="0" max="100" class="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 text-zinc-700 placeholder-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:bg-white rounded-xl outline-none transition-all" @input="applyAllEffects">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">Y位置 (%)</label>
                    <input type="number" v-model.number="watermarkY" min="0" max="100" class="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 text-zinc-700 placeholder-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:bg-white rounded-xl outline-none transition-all" @input="applyAllEffects">
                  </div>
                </div>
                <button @click="resetWatermark" class="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
                  恢复默认
                </button>
              </div>

              <!-- 拼接 -->
              <div v-if="activeTab === 'merge'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-zinc-600 mb-1">拼接方向</label>
                  <select v-model="mergeDirection" class="border border-zinc-200 bg-zinc-50 text-zinc-700 rounded-xl px-3 py-2 w-full" @change="markModified('merge'); applyAllEffects()">
                    <option value="horizontal">水平拼接</option>
                    <option value="vertical">垂直拼接</option>
                  </select>
                </div>
                <div v-if="!secondImageUrl">
                  <label class="block text-sm font-medium text-zinc-600 mb-1">选择第二张图片</label>
                  <div
                    class="border-2 border-dashed border-zinc-200 rounded-xl p-4 text-center cursor-pointer hover:border-zinc-300"
                    @click="triggerSecondFileInput"
                  >
                    <p class="text-sm text-zinc-400">点击选择第二张图片</p>
                    <input ref="secondFileInput" type="file" class="hidden" accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/x-icon" @change="handleSecondFileSelect">
                  </div>
                </div>
                <div v-else class="space-y-2">
                  <p class="text-sm text-zinc-600">已选择第二张图片</p>
                  <img :src="secondImageUrl" class="w-full h-20 object-contain border border-zinc-100 rounded-xl" alt="第二张图片预览">
                </div>
                <button @click="resetMerge" class="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
                  恢复默认
                </button>
              </div>

              <!-- 九宫格 -->
              <div v-if="activeTab === 'grid'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-zinc-600 mb-1">宫格数量</label>
                  <select v-model="gridCount" class="border border-zinc-200 bg-zinc-50 text-zinc-700 rounded-xl px-3 py-2 w-full" @change="markModified('grid'); applyAllEffects()">
                    <option :value="1">原图 (1×1)</option>
                    <option :value="3">九宫格 (3×3)</option>
                    <option :value="4">四宫格 (2×2)</option>
                    <option :value="6">六宫格 (2×3)</option>
                    <option :value="2">二宫格 (1×2)</option>
                  </select>
                </div>
                <button @click="resetGrid" class="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
                  恢复默认
                </button>
              </div>

              <!-- 圆形裁剪 -->
              <div v-if="activeTab === 'circle'" class="space-y-4">
                <div class="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                  <div class="flex items-start">
                    <svg class="w-5 h-5 text-zinc-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="text-sm text-zinc-600 font-medium">圆形裁剪</p>
                      <p class="text-xs text-zinc-400 mt-1">将图片裁剪为圆形形状，适合头像、图标等场景</p>
                    </div>
                  </div>
                </div>
                <button @click="enableCircleCrop = true; markModified('circle'); applyAllEffects()" class="w-full py-2 px-4 text-white rounded-xl transition-all hover:opacity-90 text-sm" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)">
                  开始处理
                </button>
                <button @click="resetCircle" class="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
                  恢复默认
                </button>
              </div>

              <!-- 滤镜 -->
              <div v-if="activeTab === 'filter'" class="space-y-4">
                <div class="grid grid-cols-2 gap-2">
                  <button v-for="f in filters" :key="f.id" @click="currentFilter = f.id; markModified('filter'); applyAllEffects()" class="py-2 px-2 text-xs font-medium border rounded-xl" :class="currentFilter === f.id ? 'border-zinc-500 bg-zinc-100' : 'border-zinc-200'"> {{ f.name }}</button>
                </div>
                <button @click="resetFilter" class="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
                  恢复默认
                </button>
              </div>

              <!-- 颜色涂抹 -->
              <div v-if="activeTab === 'mosaic'" class="space-y-3">
                <!-- 模式切换 -->
                <div class="flex items-center bg-zinc-100 rounded-xl p-1 gap-1">
                  <button
                    @click="brushMode = 'pick'"
                    class="flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5"
                    :class="brushMode === 'pick' ? 'bg-white text-zinc-700 shadow-sm' : 'text-zinc-400 hover:text-zinc-500'"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    取色
                  </button>
                  <button
                    @click="brushMode = 'paint'"
                    class="flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5"
                    :class="brushMode === 'paint' ? 'bg-white text-zinc-700 shadow-sm' : 'text-zinc-400 hover:text-zinc-500'"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    涂抹
                  </button>
                </div>

                <!-- 取色模式提示 -->
                <div v-if="brushMode === 'pick'" class="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-500">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  点击图片任意位置吸取颜色
                </div>

                <!-- 颜色选择区 -->
                <div class="p-3 bg-zinc-50 border border-zinc-100 rounded-xl space-y-2.5">
                  <div class="flex items-center gap-3">
                    <label class="text-xs font-medium text-zinc-500 w-12 flex-shrink-0">当前色</label>
                    <div class="relative flex-shrink-0">
                      <input type="color" v-model="brushColor" class="w-8 h-8 rounded-lg border-2 border-zinc-200 cursor-pointer appearance-none p-0.5 bg-white">
                    </div>
                    <span class="text-xs font-mono text-zinc-400 uppercase">{{ brushColor }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <label class="text-xs font-medium text-zinc-500 w-12 flex-shrink-0">预设色</label>
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        v-for="color in presetColors" :key="color"
                        @click="brushColor = color"
                        class="w-6 h-6 rounded-md transition-all flex-shrink-0"
                        :style="{ backgroundColor: color }"
                        :class="brushColor === color ? 'ring-2 ring-offset-1 ring-zinc-500 scale-110' : 'ring-1 ring-zinc-200 hover:scale-105'"
                      ></button>
                    </div>
                  </div>
                </div>

                <!-- 画笔大小 -->
                <div class="p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-xs font-medium text-zinc-500">画笔大小</label>
                    <div class="flex items-center gap-2">
                      <div class="flex items-center justify-center" style="width:24px;height:24px">
                        <div class="rounded-full flex-shrink-0" :style="{ width: Math.min(brushSize * 0.4, 20) + 'px', height: Math.min(brushSize * 0.4, 20) + 'px', backgroundColor: brushColor }"></div>
                      </div>
                      <span class="text-xs text-zinc-400 w-10 text-right">{{ brushSize }}px</span>
                    </div>
                  </div>
                  <input type="range" v-model.number="brushSize" min="5" max="100" class="w-full h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-500">
                </div>

                <!-- 操作按钮 -->
                <div class="flex gap-2">
                  <button @click="undoBrushStroke" :disabled="brushHistory.length === 0" class="flex-1 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-xs transition-colors disabled:opacity-40 flex items-center justify-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                    撤销
                  </button>
                  <button @click="clearAllBrushStrokes" :disabled="brushStrokes.length === 0" class="flex-1 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-xs transition-colors disabled:opacity-40 flex items-center justify-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    清空
                  </button>
                  <button @click="resetMosaic" class="flex-1 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-xs transition-colors flex items-center justify-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    重置
                  </button>
                </div>
              </div>

              <!-- AI抠图 -->
              <div v-if="activeTab === 'ai-remove-bg'" class="space-y-4">
                <div class="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                  <div class="flex items-start">
                    <svg class="w-5 h-5 text-zinc-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="text-sm text-zinc-600 font-medium">AI智能抠图</p>
                      <p class="text-xs text-zinc-400 mt-1">智能识别主体，同时生成透明前景图与修复背景图</p>
                    </div>
                  </div>
                </div>
                <button
                  @click="handleAICutout"
                  :disabled="aiProcessing"
                  class="w-full py-2 px-4 text-white rounded-xl transition-all hover:opacity-90 text-sm disabled:opacity-50"
                  style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
                >
                  {{ aiProcessing ? '处理中...' : '开始处理' }}
                </button>
                <div v-if="previewUrl && cutoutBgUrl" class="grid grid-cols-2 gap-2">
                  <a :href="previewUrl" download="cutout_fg.png" class="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl text-xs transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    前景图
                  </a>
                  <a :href="cutoutBgUrl" download="cutout_bg.png" class="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl text-xs transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    背景图
                  </a>
                </div>
                <button @click="resetAICutout" class="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
                  恢复默认
                </button>
              </div>

              <!-- 背景透明 -->
              <div v-if="activeTab === 'ai-transparent'" class="space-y-4">
                <div class="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                  <div class="flex items-start">
                    <svg class="w-5 h-5 text-zinc-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="text-sm text-zinc-600 font-medium">AI智能背景透明</p>
                      <p class="text-xs text-zinc-400 mt-1">移除图片背景，输出透明 PNG 格式</p>
                    </div>
                  </div>
                </div>
                <button
                  @click="handleAIRemoveBackground"
                  :disabled="aiProcessing"
                  class="w-full py-2 px-4 text-white rounded-xl transition-all hover:opacity-90 text-sm disabled:opacity-50"
                  style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
                >
                  {{ aiProcessing ? '处理中...' : '开始处理' }}
                </button>
                <button @click="resetAIRemoveBackground" class="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
                  恢复默认
                </button>
              </div>

              <!-- AI裁剪 -->
              <div v-if="activeTab === 'ai-crop'" class="space-y-4">
                <div class="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                  <div class="flex items-start">
                    <svg class="w-5 h-5 text-zinc-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="text-sm text-zinc-600 font-medium">AI智能裁剪</p>
                      <p class="text-xs text-zinc-400 mt-1">拖动裁剪框调整位置，拉动边角调整大小</p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-zinc-600">手动裁剪</label>
                  <div v-if="!isCropped" class="relative inline-block w-12 mr-2 align-middle select-none cursor-pointer" @click="enableAICrop = !enableAICrop">
                    <input type="checkbox" v-model="enableAICrop" class="sr-only">
                    <div class="block bg-zinc-300 w-12 h-6 rounded-full" :class="{ 'bg-zinc-500': enableAICrop }"></div>
                    <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform" :class="{ 'translate-x-6': enableAICrop }"></div>
                  </div>
                  <span v-else class="text-sm text-zinc-400">已完成</span>
                </div>
                <div class="mt-3 p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
                  <div class="flex items-center mb-2">
                    <svg class="w-4 h-4 text-zinc-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm font-medium text-zinc-600">手动输入目标尺寸</span>
                  </div>
                  <div class="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <label class="block text-xs text-zinc-400 mb-1">目标宽度</label>
                      <input type="number" v-model.number="manualCropWidth" min="1" :max="originalWidth" class="w-full px-3 py-2 border border-zinc-200 bg-white text-zinc-700 placeholder-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 rounded-xl outline-none transition-all text-sm" placeholder="自动" @input="applyManualCropSize">
                    </div>
                    <div>
                      <label class="block text-xs text-zinc-400 mb-1">目标高度</label>
                      <input type="number" v-model.number="manualCropHeight" min="1" :max="originalHeight" class="w-full px-3 py-2 border border-zinc-200 bg-white text-zinc-700 placeholder-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 rounded-xl outline-none transition-all text-sm" placeholder="自动" @input="applyManualCropSize">
                    </div>
                  </div>
                  <div class="flex items-center">
                    <input type="checkbox" id="maintainCropAspect" v-model="maintainCropAspectRatio" class="h-4 w-4">
                    <label for="maintainCropAspect" class="ml-2 text-xs text-zinc-500">保持宽高比</label>
                  </div>
                </div>
                <p class="text-sm text-zinc-600">
                  X: {{ Math.round(cropBox.x) }} Y: {{ Math.round(cropBox.y) }} 宽度: {{ Math.round(cropBox.width) }} 高度: {{ Math.round(cropBox.height) }}
                </p>
                <div v-if="!isCropped" class="space-y-2">
                  <button
                    @click="handleAICrop"
                    :disabled="aiProcessing"
                    class="w-full py-2 px-4 text-white rounded-xl transition-all hover:opacity-90 text-sm"
                    style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
                  >
                    {{ aiProcessing ? '处理中...' : '开始处理' }}
                  </button>
                </div>
                <div v-else class="text-sm text-green-600 text-center py-2">
                  ✓ 裁剪完成
                </div>
                <button @click="clearCropSelection" class="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
                  恢复默认
                </button>
              </div>

              <!-- AI证件照 -->
              <div v-if="activeTab === 'ai-photo'" class="space-y-4">
                <div class="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                  <div class="flex items-start">
                    <svg class="w-5 h-5 text-zinc-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="text-sm text-zinc-600 font-medium">AI证件照</p>
                      <p class="text-xs text-zinc-400 mt-1">AI自动生成标准证件照，支持多种尺寸和背景色</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-600 mb-1">证件照尺寸</label>
                  <select v-model="aiPhotoSize" class="border border-zinc-200 bg-zinc-50 text-zinc-700 rounded-xl px-3 py-2 w-full">
                    <option value="一寸">一寸 (295×413)</option>
                    <option value="二寸">二寸 (413×579)</option>
                    <option value="小二寸">小二寸 (390×567)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-600 mb-1">背景颜色</label>
                  <div class="flex gap-2">
                    <button @click="aiPhotoBg = '#FFFFFF'" class="flex-1 py-2 border rounded-xl" :class="aiPhotoBg === '#FFFFFF' ? 'border-zinc-500 bg-zinc-50' : 'border-zinc-200'">白色</button>
                    <button @click="aiPhotoBg = '#438EDB'" class="flex-1 py-2 border rounded-xl" :class="aiPhotoBg === '#438EDB' ? 'border-zinc-500 bg-zinc-50' : 'border-zinc-200'">蓝色</button>
                    <button @click="aiPhotoBg = '#E60000'" class="flex-1 py-2 border rounded-xl" :class="aiPhotoBg === '#E60000' ? 'border-zinc-500 bg-zinc-50' : 'border-zinc-200'">红色</button>
                  </div>
                </div>
                <button
                  @click="handleAIPhoto"
                  :disabled="aiProcessing"
                  class="w-full py-2 px-4 text-white rounded-xl transition-all hover:opacity-90 text-sm disabled:opacity-50"
                  style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
                >
                  {{ aiProcessing ? '处理中...' : '开始处理' }}
                </button>
                <button @click="resetAIPhoto" class="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
                  恢复默认
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 功能说明 -->
        <div class="mt-8 max-w-4xl mx-auto">
          <div class="flex items-center gap-4 mb-6">
            <div class="h-px flex-1 bg-zinc-100"></div>
            <span class="text-sm text-zinc-400 tracking-wider">功能一览</span>
            <div class="h-px flex-1 bg-zinc-100"></div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div v-for="feat in featureList" :key="feat.name" class="flex items-start gap-3 bg-white border border-zinc-100 rounded-xl p-3 hover:border-zinc-200 transition-colors">
              <span class="text-lg leading-none mt-0.5">{{ feat.icon }}</span>
              <div>
                <div class="text-sm font-medium text-zinc-600">{{ feat.name }}</div>
                <div class="text-xs text-zinc-400 mt-0.5 leading-relaxed">{{ feat.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />

    <div v-if="showDownloadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showDownloadModal = false">
      <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold text-zinc-700 mb-4">下载图片</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-zinc-600 mb-2">文件名</label>
            <input type="text" v-model="downloadFileName" class="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 text-zinc-700 placeholder-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:bg-white rounded-xl outline-none transition-all" placeholder="图片名称_processed">
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-600 mb-2">保存格式</label>
            <select v-model="downloadFormat" class="border border-zinc-200 bg-zinc-50 text-zinc-700 rounded-xl px-3 py-2 w-full">
              <option v-for="fmt in downloadFormats" :key="fmt" :value="fmt">{{ fmt.toUpperCase() }}</option>
            </select>
          </div>
        </div>
        <div class="flex space-x-3 mt-6">
          <button @click="showDownloadModal = false" class="flex-1 py-2 px-4 border border-zinc-200 text-zinc-500 bg-white hover:bg-zinc-50 rounded-xl transition-colors">
            取消
          </button>
          <button @click="confirmDownload" class="flex-1 py-2 px-4 text-white rounded-xl transition-all hover:opacity-90" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)">
            下载
          </button>
        </div>
      </div>
    </div>

    <div v-if="showConfirmModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showConfirmModal = false">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-zinc-700">确认重置</h3>
        </div>
        <p class="text-sm text-zinc-400 mb-6 pl-12">所有调整将恢复为默认状态，此操作不可撤销。</p>
        <div class="flex gap-3">
          <button @click="showConfirmModal = false" class="flex-1 py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-xl text-sm transition-colors">
            取消
          </button>
          <button @click="executeResetAll" class="flex-1 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 rounded-xl text-sm transition-colors">
            确认重置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, computed, onMounted, inject } from 'vue'
import imageCompression from 'browser-image-compression'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import api from '../utils/api'

const toast = inject('toast')

const featureList = [
  { icon: '📦', name: '图片压缩', desc: '调整压缩质量，减小文件大小' },
  { icon: '🔄', name: '旋转翻转', desc: '任意角度旋转，支持水平/垂直翻转' },
  { icon: '📐', name: '尺寸调整', desc: '自由调整宽高，支持保持比例' },
  { icon: '💧', name: '添加水印', desc: '自定义文字、颜色、位置和透明度' },
  { icon: '🖼️', name: '图片拼接', desc: '水平或垂直拼接多张图片' },
  { icon: '⬜', name: '九宫格', desc: '将图片分割成多宫格形式' },
  { icon: '⭕', name: '圆形裁剪', desc: '将图片裁剪为圆形形状' },
  { icon: '🎨', name: '图片滤镜', desc: '灰度、复古、提亮、对比、模糊' },
  { icon: '🎯', name: '颜色涂抹', desc: '选择颜色手动涂抹覆盖指定区域' },
  { icon: '🔃', name: '格式转换', desc: '支持 JPG、PNG、WebP 格式互转' },
  { icon: '✨', name: 'AI 抠图', desc: 'AI 智能抠图，生成透明前景图与修复背景图' },
  { icon: '🔮', name: 'AI 背景透明', desc: 'AI 移除图片背景，输出透明前景图' },
  { icon: '✂️', name: 'AI 裁剪', desc: 'AI 智能识别主体裁剪' },
  { icon: '📇', name: 'AI 证件照', desc: 'AI 生成标准证件照' },
]
const fileInput = ref(null)
const previewImage = ref(null)
const secondFileInput = ref(null)
const selectedImage = ref(null)
const selectedImageOriginal = ref(null)
const secondImageFile = ref(null)
const imagePreviewUrl = ref('')
const secondImageUrl = ref('')
const previewUrl = ref('')
const cutoutBgUrl = ref('')
const displayFileSize = ref(0)
const displayWidth = ref(0)
const displayHeight = ref(0)
const originalFileSize = ref(0)
const originalFileType = ref('')
const originalFileName = ref('')
const originalWidth = ref(0)
const originalHeight = ref(0)
const processing = ref(false)
const aiProcessing = ref(false)
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
  { id: 'merge', name: '拼接' },
  { id: 'grid', name: '九宫格' },
  { id: 'circle', name: '圆形' },
  { id: 'filter', name: '滤镜' },
  { id: 'mosaic', name: '涂抹' },
  { id: 'ai-remove-bg', name: '抠图', isAi: true },
  { id: 'ai-transparent', name: '背景透明', isAi: true },
  { id: 'ai-crop', name: '裁剪', isAi: true },
  { id: 'ai-photo', name: '证件照', isAi: true }
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
const watermarkColor = ref('#ffffff')
const watermarkX = ref(50)
const watermarkY = ref(50)

const mergeDirection = ref('horizontal')
const gridCount = ref(1)
const idPhotoSize = ref('35x25mm')
const idPhotoBg = ref('white')
const currentFilter = ref('none')
const brushColor = ref('#000000')
const brushSize = ref(80)
const isBrushDrawing = ref(false)
const brushMode = ref('paint')
const brushStrokes = ref([])
const brushHistory = ref([])
const presetColors = ['#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#a16207', '#166534']
const brushCanvas = ref(null)
const brushCtx = ref(null)
const enableCircleCrop = ref(false)
const enableIdPhoto = ref(false)

const aiPhotoSize = ref('一寸')
const aiPhotoBg = ref('#FFFFFF')
const enableAICrop = ref(false)
const isCropped = ref(false)
const imageContainer = ref(null)
const cropBox = ref({ x: 50, y: 50, width: 200, height: 200 })
const isResizing = ref(false)
const resizeDir = ref('')
const dragStart = ref({ x: 0, y: 0 })
const cropStart = ref({ x: 0, y: 0, width: 0, height: 0 })
const manualCropWidth = ref(0)
const manualCropHeight = ref(0)
const maintainCropAspectRatio = ref(true)

const cropBoxStyle = computed(() => {
  if (!imageContainer.value) return {}
  const img = previewImage.value
  if (!img) return {}
  
  const containerRect = imageContainer.value.getBoundingClientRect()
  const imgRect = img.getBoundingClientRect()
  
  const scaleX = imgRect.width / originalWidth.value
  const scaleY = imgRect.height / originalHeight.value
  
  const displayX = imgRect.left - containerRect.left
  const displayY = imgRect.top - containerRect.top
  const displayWidth = imgRect.width
  const displayHeight = imgRect.height
  
  return {
    left: `${displayX + cropBox.value.x * scaleX}px`,
    top: `${displayY + cropBox.value.y * scaleY}px`,
    width: `${cropBox.value.width * scaleX}px`,
    height: `${cropBox.value.height * scaleY}px`
  }
})

const brushCanvasStyle = computed(() => {
  if (!previewImage.value) return {}
  const img = previewImage.value
  const containerRect = imageContainer.value.getBoundingClientRect()
  const imgRect = img.getBoundingClientRect()
  
  return {
    left: `${imgRect.left - containerRect.left}px`,
    top: `${imgRect.top - containerRect.top}px`,
    width: `${imgRect.width}px`,
    height: `${imgRect.height}px`,
    cursor: brushMode.value === 'pick' ? 'crosshair' : 'cell'
  }
})

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
  if (tabId === 'mosaic' && selectedImage.value) {
    setTimeout(() => initBrushCanvas(), 100)
  }
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
  selectedImageOriginal.value = file
  originalFileSize.value = file.size
  originalFileType.value = file.type
  originalFileName.value = file.name.replace(/\.[^/.]+$/, '')
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
    if (activeTab.value === 'mosaic') {
      setTimeout(() => initBrushCanvas(), 100)
    }
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
  gridCount.value = 1
  idPhotoSize.value = '35x25mm'
  idPhotoBg.value = 'white'
  currentFilter.value = 'none'
  brushColor.value = '#000000'
  brushSize.value = 80
  brushMode.value = 'paint'
  brushStrokes.value = []
  brushHistory.value = []
  mergeDirection.value = 'horizontal'
  enableCircleCrop.value = false
  enableIdPhoto.value = false
  aiPhotoSize.value = '一寸'
  aiPhotoBg.value = '#FFFFFF'
  enableAICrop.value = false
  isCropped.value = false
  cropBox.value = { x: 50, y: 50, width: 200, height: 200 }
  manualCropWidth.value = 0
  manualCropHeight.value = 0
  maintainCropAspectRatio.value = true
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
    
    if (currentFilter.value !== 'none' || brushStrokes.value.length > 0 || gridCount.value !== 1 || 
        watermarkText.value || mergeDirection.value !== 'horizontal' || secondImageUrl.value ||
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
        ctx.font = `${watermarkSize.value || 24}px Arial`
        const opacity = watermarkOpacity.value
        const color = watermarkColor.value || '#ffffff'
        const r = parseInt(color.slice(1, 3), 16)
        const g = parseInt(color.slice(3, 5), 16)
        const b = parseInt(color.slice(5, 7), 16)
        ctx.fillStyle = `rgba(${r},${g},${b},${opacity === '' || opacity === null || opacity === undefined ? 0.5 : Number(opacity)})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const x = ((watermarkX.value || 50) - 50) / 50 * width / 2
        const y = ((watermarkY.value || 50) - 50) / 50 * height / 2
        ctx.fillText(watermarkText.value, x, y)
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
      
      if (brushStrokes.value.length > 0) {
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        
        const offsetX = width / 2
        const offsetY = height / 2
        
        brushStrokes.value.forEach(stroke => {
          ctx.fillStyle = stroke.color
          stroke.points.forEach(point => {
            ctx.beginPath()
            ctx.arc(point.x + offsetX, point.y + offsetY, stroke.size / 2, 0, Math.PI * 2)
            ctx.fill()
          })
        })
        
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

const processWithCompression = async (file, forceFormat = null) => {
  const formatMap = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp'
  }
  
  let fileType
  if (forceFormat) {
    fileType = formatMap[forceFormat] || 'image/jpeg'
  } else if (compressQuality.value === 100 && originalFileType.value) {
    fileType = originalFileType.value
  } else {
    fileType = formatMap[downloadFormat.value] || 'image/jpeg'
  }
  
  const options = { 
    maxSizeMB: 10, 
    maxWidthOrHeight: Math.max(resizeWidth.value, resizeHeight.value), 
    useWebWorker: true,
    fileType: fileType,
    initialQuality: compressQuality.value / 100
  }
  return await imageCompression(file, options)
}

const rotateImage = (angle) => {
  rotation.value = (rotation.value + angle) % 360
  markModified('rotate')
  applyAllEffects()
}

const toggleFlip = (direction) => {
  if (direction === 'horizontal') flipH.value = !flipH.value
  else flipV.value = !flipV.value
  markModified('rotate')
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
  watermarkColor.value = '#ffffff'
  clearModified('watermark')
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
  brushColor.value = '#000000'
  brushSize.value = 80
  clearAllBrushStrokes()
  clearModified('mosaic')
}

const undoBrushStroke = () => {
  if (brushHistory.value.length > 0) {
    brushStrokes.value = brushHistory.value.pop()
    redrawBrushCanvas()
  }
}

const clearAllBrushStrokes = () => {
  brushStrokes.value = []
  brushHistory.value = []
  redrawBrushCanvas()
}

const redrawBrushCanvas = () => {
  if (!brushCanvas.value || !previewImage.value) return
  
  const canvas = brushCanvas.value
  canvas.width = originalWidth.value
  canvas.height = originalHeight.value
  
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  brushStrokes.value.forEach(stroke => {
    ctx.fillStyle = stroke.color
    stroke.points.forEach(point => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, stroke.size / 2, 0, Math.PI * 2)
      ctx.fill()
    })
  })
}

const initBrushCanvas = () => {
  if (!brushCanvas.value || !previewImage.value) return
  
  const canvas = brushCanvas.value
  canvas.width = originalWidth.value
  canvas.height = originalHeight.value
  
  brushCtx.value = canvas.getContext('2d')
  redrawBrushCanvas()
}

const startBrushDrawing = (e) => {
  if (activeTab.value !== 'mosaic') return
  
  const canvas = brushCanvas.value
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  
  const scaleX = originalWidth.value / rect.width
  const scaleY = originalHeight.value / rect.height
  
  const x = (clientX - rect.left) * scaleX
  const y = (clientY - rect.top) * scaleY
  
  if (brushMode.value === 'pick') {
    pickColorFromImage(x, y)
    return
  }
  
  isBrushDrawing.value = true
  brushHistory.value.push([...brushStrokes.value.map(s => ({...s, points: [...s.points]}))])
  
  const currentStroke = {
    color: brushColor.value,
    size: brushSize.value,
    points: [{ x, y }]
  }
  
  brushStrokes.value.push(currentStroke)
  
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = brushColor.value
  ctx.beginPath()
  ctx.arc(x, y, brushSize.value / 2, 0, Math.PI * 2)
  ctx.fill()
}

const pickColorFromImage = (x, y) => {
  const img = previewImage.value
  if (!img) return
  
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = originalWidth.value
  tempCanvas.height = originalHeight.value
  const tempCtx = tempCanvas.getContext('2d')
  
  const imgRatio = img.naturalWidth / img.width
  tempCtx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, originalWidth.value, originalHeight.value)
  
  const pixel = tempCtx.getImageData(Math.round(x), Math.round(y), 1, 1).data
  const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, '0')).join('')
  brushColor.value = hex
}

const handleBrushDrawing = (e) => {
  if (!isBrushDrawing.value || activeTab.value !== 'mosaic') return
  
  const canvas = brushCanvas.value
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  
  const scaleX = originalWidth.value / rect.width
  const scaleY = originalHeight.value / rect.height
  
  const x = (clientX - rect.left) * scaleX
  const y = (clientY - rect.top) * scaleY
  
  const currentStroke = brushStrokes.value[brushStrokes.value.length - 1]
  if (currentStroke) {
    currentStroke.points.push({ x, y })
    
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = brushColor.value
    ctx.beginPath()
    ctx.arc(x, y, brushSize.value / 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

const stopBrushDrawing = () => {
  if (isBrushDrawing.value) {
    mergeBrushToPreview()
  }
  isBrushDrawing.value = false
}

const mergeBrushToPreview = async () => {
  if (brushStrokes.value.length === 0) return
  if (!previewImage.value) return
  
  const img = previewImage.value
  const canvas = document.createElement('canvas')
  canvas.width = originalWidth.value
  canvas.height = originalHeight.value
  const ctx = canvas.getContext('2d')
  
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  brushStrokes.value.forEach(stroke => {
    ctx.fillStyle = stroke.color
    stroke.points.forEach(point => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, stroke.size / 2, 0, Math.PI * 2)
      ctx.fill()
    })
  })
  
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
  const url = URL.createObjectURL(blob)
  
  if (previewUrl.value && previewUrl.value !== imagePreviewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  
  previewUrl.value = url
  displayFileSize.value = blob.size
  markModified('mosaic')
}

const resetAICutout = async () => {
  isCropped.value = false
  clearModified('ai-remove-bg')
  if (previewUrl.value && previewUrl.value !== imagePreviewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  if (cutoutBgUrl.value) {
    URL.revokeObjectURL(cutoutBgUrl.value)
    cutoutBgUrl.value = ''
  }
  previewUrl.value = imagePreviewUrl.value
  displayFileSize.value = originalFileSize.value
  displayWidth.value = originalWidth.value
  displayHeight.value = originalHeight.value
}

const resetAIRemoveBackground = async () => {
  isCropped.value = false
  clearModified('ai-transparent')
  if (previewUrl.value && previewUrl.value !== imagePreviewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = imagePreviewUrl.value
  displayFileSize.value = originalFileSize.value
  displayWidth.value = originalWidth.value
  displayHeight.value = originalHeight.value
}

const resetAIPhoto = async () => {
  isCropped.value = false
  clearModified('ai-photo')
  aiPhotoSize.value = '一寸'
  aiPhotoBg.value = '#FFFFFF'
  if (previewUrl.value && previewUrl.value !== imagePreviewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = imagePreviewUrl.value
  displayFileSize.value = originalFileSize.value
  displayWidth.value = originalWidth.value
  displayHeight.value = originalHeight.value
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

const openDownloadModal = () => {
  const baseName = originalFileName.value || 'image'
  downloadFileName.value = `${baseName}_processed`
  showDownloadModal.value = true
}

const confirmDownload = async () => {
  const fileName = downloadFileName.value || 'image_processed'
  const ext = downloadFormat.value
  const url = previewUrl.value || imagePreviewUrl.value
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
  if (isMobile && url.startsWith('data:')) {
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileName}.${ext}`
    link.click()
  } else if (isMobile) {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `${fileName}.${ext}`
      link.click()
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    } catch (err) {
      const link = document.createElement('a')
      link.href = url
      link.download = `${fileName}.${ext}`
      link.click()
    }
  } else {
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileName}.${ext}`
    link.click()
  }
  showDownloadModal.value = false
}

const handleAICutout = async () => {
  if (!selectedImage.value) return
  aiProcessing.value = true
  try {
    const result = await api.cutout(selectedImage.value)
    if (result.base64) {
      const blob = base64ToBlob(result.base64, 'image/png')
      const url = URL.createObjectURL(blob)
      if (previewUrl.value && previewUrl.value !== imagePreviewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
      }
      previewUrl.value = url
      displayFileSize.value = blob.size
      markModified('ai-remove-bg')
    }
    if (result.base64Bg) {
      if (cutoutBgUrl.value) URL.revokeObjectURL(cutoutBgUrl.value)
      const bgBlob = base64ToBlob(result.base64Bg, 'image/png')
      cutoutBgUrl.value = URL.createObjectURL(bgBlob)
    }
  } catch (error) {
    console.error('AI抠图失败:', error)
  } finally {
    aiProcessing.value = false
  }
}

const handleAIRemoveBackground = async () => {
  if (!selectedImage.value) return
  aiProcessing.value = true
  try {
    const result = await api.removeBackground(selectedImage.value)
    if (result.base64) {
      const blob = base64ToBlob(result.base64, 'image/png')
      const url = URL.createObjectURL(blob)
      if (previewUrl.value && previewUrl.value !== imagePreviewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
      }
      previewUrl.value = url
      displayFileSize.value = blob.size
      markModified('ai-transparent')
    }
  } catch (error) {
    console.error('背景透明化失败:', error)
  } finally {
    aiProcessing.value = false
  }
}

const handleAICrop = async () => {
  if (!selectedImage.value) return
  aiProcessing.value = true
  try {
    const options = {
      x: Math.round(cropBox.value.x),
      y: Math.round(cropBox.value.y),
      width: Math.round(cropBox.value.width),
      height: Math.round(cropBox.value.height)
    }
    
    const result = await api.imageCrop(selectedImage.value, options)
    if (result.base64) {
      const blob = base64ToBlob(result.base64, 'image/png')
      const url = URL.createObjectURL(blob)
      if (previewUrl.value && previewUrl.value !== imagePreviewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
      }
      previewUrl.value = url
      displayFileSize.value = blob.size
      if (result.width) displayWidth.value = result.width
      if (result.height) displayHeight.value = result.height
      markModified('ai-crop')
      isCropped.value = true
    }
  } catch (error) {
    console.error('AI裁剪失败:', error)
  } finally {
    aiProcessing.value = false
  }
}

const applyManualCropSize = () => {
  if (!manualCropWidth.value && !manualCropHeight.value) return
  
  const currentAspectRatio = cropBox.value.width / cropBox.value.height
  let newWidth = manualCropWidth.value || cropBox.value.width
  let newHeight = manualCropHeight.value || cropBox.value.height
  
  if (maintainCropAspectRatio.value) {
    if (manualCropWidth.value && !manualCropHeight.value) {
      newHeight = Math.round(manualCropWidth.value / currentAspectRatio)
    } else if (!manualCropWidth.value && manualCropHeight.value) {
      newWidth = Math.round(manualCropHeight.value * currentAspectRatio)
    }
  }
  
  newWidth = Math.min(newWidth, originalWidth.value)
  newHeight = Math.min(newHeight, originalHeight.value)
  
  let newX = cropBox.value.x
  let newY = cropBox.value.y
  
  if (newX + newWidth > originalWidth.value) {
    newX = Math.max(0, originalWidth.value - newWidth)
  }
  if (newY + newHeight > originalHeight.value) {
    newY = Math.max(0, originalHeight.value - newHeight)
  }
  
  cropBox.value = { x: newX, y: newY, width: newWidth, height: newHeight }
}

const clearCropSelection = async () => {
  cropBox.value = { x: 50, y: 50, width: 200, height: 200 }
  isCropped.value = false
  enableAICrop.value = false
  clearModified('ai-crop')
  selectedImage.value = selectedImageOriginal.value
  
  if (previewUrl.value && previewUrl.value !== imagePreviewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = imagePreviewUrl.value
  displayFileSize.value = originalFileSize.value
  displayWidth.value = originalWidth.value
  displayHeight.value = originalHeight.value
}

const handleCropMouseDown = (e) => {
  if (!enableAICrop.value) return
  e.preventDefault()
}

const startDrag = (e) => {
  if (!enableAICrop.value) return
  e.preventDefault()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  isDragging.value = true
  dragStart.value = { x: clientX, y: clientY }
  cropStart.value = { ...cropBox.value }
  window.addEventListener('mousemove', handleDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', handleDrag)
  window.addEventListener('touchend', stopDrag)
}

const handleDrag = (e) => {
  if (!isDragging.value || !previewImage.value) return
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const imgRect = previewImage.value.getBoundingClientRect()
  const scaleX = originalWidth.value / imgRect.width
  const scaleY = originalHeight.value / imgRect.height
  
  const dx = (clientX - dragStart.value.x) * scaleX
  const dy = (clientY - dragStart.value.y) * scaleY
  
  let newX = cropStart.value.x + dx
  let newY = cropStart.value.y + dy
  
  newX = Math.max(0, Math.min(newX, originalWidth.value - cropBox.value.width))
  newY = Math.max(0, Math.min(newY, originalHeight.value - cropBox.value.height))
  
  cropBox.value.x = newX
  cropBox.value.y = newY
}

const stopDrag = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', handleDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', handleDrag)
  window.removeEventListener('touchend', stopDrag)
}

const startResize = (e, dir) => {
  if (!enableAICrop.value) return
  e.preventDefault()
  e.stopPropagation()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  isResizing.value = true
  resizeDir.value = dir
  dragStart.value = { x: clientX, y: clientY }
  cropStart.value = { ...cropBox.value }
  window.addEventListener('mousemove', handleResize)
  window.addEventListener('mouseup', stopResize)
  window.addEventListener('touchmove', handleResize)
  window.addEventListener('touchend', stopResize)
}

const handleResize = (e) => {
  if (!isResizing.value || !previewImage.value) return
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const imgRect = previewImage.value.getBoundingClientRect()
  const scaleX = originalWidth.value / imgRect.width
  const scaleY = originalHeight.value / imgRect.height
  
  const dx = (clientX - dragStart.value.x) * scaleX
  const dy = (clientY - dragStart.value.y) * scaleY
  
  let { x, y, width, height } = cropStart.value
  const minSize = 50
  
  switch (resizeDir.value) {
    case 'se':
      width = Math.max(minSize, cropStart.value.width + dx)
      height = Math.max(minSize, cropStart.value.height + dy)
      break
    case 'sw':
      x = cropStart.value.x + dx
      width = Math.max(minSize, cropStart.value.width - dx)
      height = Math.max(minSize, cropStart.value.height + dy)
      break
    case 'ne':
      y = cropStart.value.y + dy
      width = Math.max(minSize, cropStart.value.width + dx)
      height = Math.max(minSize, cropStart.value.height - dy)
      break
    case 'nw':
      x = cropStart.value.x + dx
      y = cropStart.value.y + dy
      width = Math.max(minSize, cropStart.value.width - dx)
      height = Math.max(minSize, cropStart.value.height - dy)
      break
    case 'right':
      width = Math.max(minSize, cropStart.value.width + dx)
      break
    case 'left':
      x = cropStart.value.x + dx
      width = Math.max(minSize, cropStart.value.width - dx)
      break
    case 'bottom':
      height = Math.max(minSize, cropStart.value.height + dy)
      break
    case 'top':
      y = cropStart.value.y + dy
      height = Math.max(minSize, cropStart.value.height - dy)
      break
  }
  
  x = Math.max(0, x)
  y = Math.max(0, y)
  if (x + width > originalWidth.value) width = originalWidth.value - x
  if (y + height > originalHeight.value) height = originalHeight.value - y
  
  cropBox.value = { x, y, width, height }
}

const stopResize = () => {
  isResizing.value = false
  resizeDir.value = ''
  window.removeEventListener('mousemove', handleResize)
  window.removeEventListener('mouseup', stopResize)
  window.removeEventListener('touchmove', handleResize)
  window.removeEventListener('touchend', stopResize)
}

onBeforeUnmount(() => {
  if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value)
  if (previewUrl.value && previewUrl.value !== imagePreviewUrl.value) URL.revokeObjectURL(previewUrl.value)
  if (secondImageUrl.value) URL.revokeObjectURL(secondImageUrl.value)
})

const handleAIPhoto = async () => {
  if (!selectedImage.value) return
  aiProcessing.value = true
  try {
    const sizeMap = { 
      '一寸': { width: 295, height: 413 },
      '二寸': { width: 413, height: 579 },
      '小二寸': { width: 390, height: 567 }
    }
    const result = await api.imagePhoto(selectedImage.value, {
      bg_color: aiPhotoBg.value,
      width: sizeMap[aiPhotoSize.value]?.width,
      height: sizeMap[aiPhotoSize.value]?.height
    })
    if (result.base64) {
      const blob = base64ToBlob(result.base64, 'image/jpeg')
      const url = URL.createObjectURL(blob)
      if (previewUrl.value && previewUrl.value !== imagePreviewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
      }
      previewUrl.value = url
      displayFileSize.value = blob.size
      if (result.width) displayWidth.value = result.width
      if (result.height) displayHeight.value = result.height
      markModified('ai-photo')
    }
  } catch (error) {
    console.error('AI证件照失败:', error)
  } finally {
    aiProcessing.value = false
  }
}

const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}
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
