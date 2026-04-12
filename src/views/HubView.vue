<template>
  <div class="min-h-screen bg-gray-100 text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-white border-b border-zinc-100">
        <div class="absolute inset-0" style="background: linear-gradient(135deg, #eff6ff 0%, #ffffff 40%, #f0fdf4 100%);"></div>
        <div class="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-24 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full mb-4 sm:mb-6">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            免费工具，打开即用
          </div>
          <h1 class="text-3xl sm:text-5xl font-bold text-zinc-800 mb-3 sm:mb-5 tracking-tight">应用</h1>
          <p class="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">精选实用工具集合，文件预览、图片处理、文字识别、开发利器——让效率翻倍。</p>
        </div>
      </section>

      <!-- Feature Sections -->
      <section class="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-20">

        <!-- 文件预览 -->
        <div class="flex flex-col md:flex-row items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-blue-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">文件预览</span>
              <router-link to="/hub/file-preview" class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                立即使用
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-blue-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <h3 class="text-lg font-semibold text-zinc-700 mb-2">文件预览</h3>
              <router-link to="/hub/file-preview" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                立即使用
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">在线预览多种文件格式</h3>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">支持 PDF、Word、Excel、PPT、图片、视频等多种常见文件格式的在线预览。无需在本地安装对应软件，直接在浏览器中查看文件内容，适合快速审阅文档或分享文件给他人。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">使用说明</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>点击上传或拖拽文件到预览区域</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>系统会自动识别文件类型并渲染预览</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>支持翻页、缩放等操作，获得接近原生的浏览体验</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">PDF</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">Word</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">Excel</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">PPT</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">图片</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">视频</span>
            </div>
          </div>
        </div>

        <div class="h-px bg-zinc-200"></div>

        <!-- 图片处理 -->
        <div class="flex flex-col md:flex-row-reverse items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-emerald-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">图片处理</span>
              <router-link to="/hub/image-processing" class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                立即使用
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-emerald-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <h3 class="text-lg font-semibold text-zinc-700 mb-2">图片处理</h3>
              <router-link to="/hub/image-processing" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors">
                立即使用
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">一站式图片编辑工具</h3>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">集成图片压缩、裁剪、旋转、加水印、格式转换、滤镜调整等常用功能。适合日常工作中的图片处理需求，告别繁重的专业软件，轻松完成图片编辑。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">使用说明</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>上传需要处理的图片</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>选择所需的处理功能（压缩、裁剪、水印等）并调整参数</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>预览效果满意后，下载处理后的图片</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">压缩</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">裁剪</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">水印</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">格式转换</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">滤镜</span>
            </div>
          </div>
        </div>

        <div class="h-px bg-zinc-200"></div>

        <!-- 图片 OCR -->
        <div class="flex flex-col md:flex-row items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-teal-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-teal-100 text-teal-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2zM9 4h6v6H9V4z"/></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">图片 OCR</span>
              <router-link to="/hub/ocr" class="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                立即使用
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-teal-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-teal-100 text-teal-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2zM9 4h6v6H9V4z"/></svg>
              </div>
              <h3 class="text-lg font-semibold text-zinc-700 mb-2">图片 OCR</h3>
              <router-link to="/hub/ocr" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors">
                立即使用
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">图片文字智能识别</h3>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">一键提取图片中的文字内容，支持中文、英文等多种语言的自动识别。可用于截图文字提取、扫描件电子化、证件信息录入等场景，识别结果支持一键复制。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">使用说明</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>上传包含文字的图片，支持 JPG、PNG 等格式</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>系统自动识别图片中的文字并显示在结果区</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>点击复制即可将识别结果粘贴到其他应用中使用</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">中文</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">英文</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">多语言</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">批量识别</span>
            </div>
          </div>
        </div>

        <div class="h-px bg-zinc-200"></div>

        <!-- IT 工具箱 -->
        <div class="flex flex-col md:flex-row-reverse items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-orange-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">IT 工具箱</span>
              <router-link to="/hub/it-tools" class="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                立即使用
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-orange-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <h3 class="text-lg font-semibold text-zinc-700 mb-2">IT 工具箱</h3>
              <router-link to="/hub/it-tools" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
                立即使用
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">开发者常用工具集</h3>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">汇集 40+ 款开发者日常工具，涵盖编解码、格式化、转换、加密、生成器等多个类别。从 Base64 编码到 JSON 格式化，从 UUID 生成到正则测试，一站式解决开发中的各种小需求。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">使用说明</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>从左侧分类菜单中选择需要的工具，或使用搜索快速定位</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>在工具界面中输入数据，结果会实时计算显示</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>常用工具可以收藏到"常用"列表，方便下次快速访问</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">Base64</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">JSON</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">UUID</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">正则</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">时间戳</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">40+ 工具</span>
            </div>
          </div>
        </div>

        <div class="h-px bg-zinc-200"></div>

        <!-- 流程工厂 -->
        <div class="flex flex-col md:flex-row items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-violet-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-violet-100 text-violet-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">流程工厂</span>
              <router-link to="/hub/flow-factory" class="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                立即使用
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-violet-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-violet-100 text-violet-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
              </div>
              <h3 class="text-lg font-semibold text-zinc-700 mb-2">流程工厂</h3>
              <router-link to="/hub/flow-factory" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-violet-500 text-white text-sm font-medium rounded-lg hover:bg-violet-600 transition-colors">
                立即使用
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">可视化流程图制作</h3>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">在线制作流程图，支持开始、结束、流程、判断、输入、输出等多种节点类型。拖拽连接即可完成流程设计，支持导出 PNG、JPEG 等图片格式，方便嵌入文档或演示文稿。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">使用说明</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>从右侧属性面板选择要添加的节点类型</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>拖拽节点到画布中，并调整位置</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>点击节点边缘拖拽连接到其他节点，完成流程设计</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">拖拽连接</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">6种节点</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">导出图片</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">在线编辑</span>
            </div>
          </div>
        </div>

        <div class="h-px bg-zinc-200"></div>

        <!-- 文件转换 -->
        <div class="flex flex-col md:flex-row-reverse items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-pink-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-pink-100 text-pink-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">文件转换</span>
              <router-link to="/hub/file-converter#image2pdf" class="inline-flex items-center gap-1 px-3 py-1.5 bg-pink-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                立即使用
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-pink-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
              <h3 class="text-lg font-semibold text-zinc-700 mb-2">文件转换</h3>
              <router-link to="/hub/file-converter#image2pdf" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600 transition-colors">
                立即使用
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">多格式文件转换</h3>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">支持将图片、文本、Word、表格数据等多种格式转换为 PDF 文档。适合制作报告、归档资料等场景，无需安装软件，纯浏览器端处理。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">使用说明</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>选择要转换的类型（图片、文本、Word 或表格）</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>上传文件或输入内容</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>点击预览下载按钮，预览并保存文件</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">图片转PDF</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">文本转PDF</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">Word转PDF</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">表格转PDF</span>
            </div>
          </div>
        </div>

        <div class="h-px bg-zinc-200"></div>

        <!-- 超级计算器 -->
        <div class="flex flex-col md:flex-row items-start gap-4 md:gap-10">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <!-- Mobile: compact -->
            <div class="flex md:hidden items-center gap-3 p-3.5 bg-amber-50 rounded-xl">
              <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
              <span class="font-semibold text-zinc-700 text-sm flex-1">超级计算器</span>
              <router-link to="/hub/calculator" class="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                立即使用
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
            <!-- Desktop: full card -->
            <div class="hidden md:flex bg-amber-50 rounded-2xl p-8 flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
              <h3 class="text-lg font-semibold text-zinc-700 mb-2">超级计算器</h3>
              <router-link to="/hub/calculator" class="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors">
                立即使用
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-2xl font-bold text-zinc-800 mb-2 sm:mb-3">一站式多功能计算平台</h3>
            <p class="text-zinc-500 text-sm leading-relaxed mb-3 sm:mb-4">集成数学计算、科学计算、金融计算、进制转换、字节换算、单位换算、亲戚称呼、星座生肖、血型计算等十余种计算功能，满足学习、工作、生活中的各种计算需求。</p>
            <div class="space-y-2 text-sm text-zinc-500">
              <h4 class="font-medium text-zinc-600 mb-2">功能列表</h4>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>数学计算：基础四则运算，支持括号和快捷计算</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>科学计算：三角函数、对数、幂运算、阶乘等高级运算</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>金融计算：复利计算器、等额本息还款、理财收益分析</span>
              </div>
            </div>
            <div class="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">进制转换</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">单位换算</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">亲戚称呼</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">星座生肖</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">血型计算</span>
            </div>
          </div>
        </div>

      </section>

      <!-- Highlights -->
      <section class="bg-white border-t border-zinc-100">
        <div class="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div class="grid grid-cols-3 gap-4 sm:gap-8">
            <div class="text-center">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 class="text-xs sm:text-sm font-medium text-zinc-700 mb-1">即开即用</h3>
              <p class="text-xs text-zinc-400 hidden sm:block">无需安装任何软件，打开浏览器即可使用</p>
            </div>
            <div class="text-center">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              </div>
              <h3 class="text-xs sm:text-sm font-medium text-zinc-700 mb-1">完全免费</h3>
              <p class="text-xs text-zinc-400 hidden sm:block">所有工具免费使用</p>
            </div>
            <div class="text-center">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 class="text-xs sm:text-sm font-medium text-zinc-700 mb-1">多端兼容</h3>
              <p class="text-xs text-zinc-400 hidden sm:block">手机、平板、电脑均可流畅使用</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>
