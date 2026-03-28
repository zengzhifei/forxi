<template>
  <div class="min-h-screen bg-[#fafafa] flex flex-col">
    <AppHeader />

    <div class="flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <div class="px-6 sm:px-8 py-6 border-b border-zinc-100">
            <h1 class="text-2xl font-semibold text-zinc-700">服务条款</h1>
            <p class="mt-1 text-sm text-zinc-400">最后更新：2026年3月26日</p>
          </div>

          <div class="px-6 sm:px-8 py-6 sm:py-8 prose prose-zinc max-w-none text-sm sm:text-base">
            <section class="mb-8">
              <h2 class="text-lg font-semibold text-zinc-700 mb-3">一、接受条款</h2>
              <p class="text-zinc-500 leading-relaxed">
                欢迎使用 Forxi（以下简称"本服务"）。通过访问或使用本服务，您表示同意并接受本服务条款的所有条件和规定。如果您不同意本条款的任何内容，请立即停止使用本服务。
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-lg font-semibold text-zinc-700 mb-3">二、服务说明</h2>
              <p class="text-zinc-500 leading-relaxed mb-3">
                Forxi 提供以下免费在线工具服务：
              </p>
              <ul class="list-disc list-inside text-zinc-500 space-y-2 pl-4">
                <li>文件预览 - 支持 PDF、Word、Excel、PPT、图片、视频等多种格式</li>
                <li>图片处理 - 支持压缩、裁剪、旋转、加水印、调滤镜、格式转换</li>
                <li>AI 工具 - 支持文生图、图生图、AI 智能对话</li>
                <li>IT 工具箱 - Base64 编解码、JSON 格式化、UUID 生成、颜色转换等</li>
                <li>JetBrains 激活服务</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-lg font-semibold text-zinc-700 mb-3">三、用户责任</h2>
              <p class="text-zinc-500 leading-relaxed mb-3">
                您同意在使用本服务时：
              </p>
              <ul class="list-disc list-inside text-zinc-500 space-y-2 pl-4">
                <li>遵守适用的法律法规</li>
                <li>不从事任何违法或侵权行为</li>
                <li>不尝试非法访问、干扰或破坏本服务</li>
                <li>不对本服务进行反向工程、反汇编或修改</li>
                <li>不上传或传播恶意软件、病毒或其他有害代码</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-lg font-semibold text-zinc-700 mb-3">四、知识产权</h2>
              <p class="text-zinc-500 leading-relaxed">
                本服务及其包含的所有内容（包括但不限于文本、图形、标识、按钮图标、图像、音频剪辑、数字下载、数据编译和软件）均受版权法和其他知识产权法律保护。未经授权，您不得复制、修改、传播、展示、许可或出售本服务的任何部分。
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-lg font-semibold text-zinc-700 mb-3">五、服务变更和终止</h2>
              <p class="text-zinc-500 leading-relaxed">
                我们保留随时修改、暂停或终止本服务（或其任何部分）的权利，恕不另行通知。对于本服务的任何修改、暂停或终止，我们不对您或任何第三方承担责任。
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-lg font-semibold text-zinc-700 mb-3">六、免责声明</h2>
              <p class="text-zinc-500 leading-relaxed">
                本服务按"现状"和"可用"提供，不提供任何明示或暗示的保证。在法律允许的最大范围内，我们明确否认任何保证，包括但不限于对适销性、特定用途适用性和非侵权的保证。我们不保证本服务将满足您的要求，或本服务将不受干扰、及时、安全或无错误。
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-lg font-semibold text-zinc-700 mb-3">七、责任限制</h2>
              <p class="text-zinc-500 leading-relaxed">
                在任何情况下，我们均不对任何间接、附带、特殊、后果性或惩罚性损害负责，包括但不限于利润损失、数据丢失、业务中断或其他损失，即使我们已经意识到可能发生此类损害。
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-lg font-semibold text-zinc-700 mb-3">八、赔偿</h2>
              <p class="text-zinc-500 leading-relaxed">
                您同意赔偿、辩护并使我们免受因您使用本服务、违反本条款或侵犯任何第三方权利而导致的任何索赔、损害、损失、责任、费用和支出（包括合理的律师费）。
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-lg font-semibold text-zinc-700 mb-3">九、适用法律</h2>
              <p class="text-zinc-500 leading-relaxed">
                本条款应受中华人民共和国法律管辖并按其解释。因本条款引起的任何争议应提交有管辖权的法院管辖。
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-zinc-700 mb-3">十、联系我们</h2>
              <p class="text-zinc-500 leading-relaxed">
                如果您对本服务条款有任何疑问，请通过以下方式联系我们：
              </p>
              <p class="text-zinc-500 leading-relaxed mt-2">
                邮箱：support@forxi.cn
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>
