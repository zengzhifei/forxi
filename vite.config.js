import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, join } from 'path'
import { createRequire } from 'module'
import { existsSync } from 'fs'

const require = createRequire(import.meta.url)
const vitePrerender = require('vite-plugin-prerender')
const Renderer = vitePrerender.PuppeteerRenderer

// 自动检测系统 Chrome/Chromium 路径，支持环境变量覆盖
function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  const candidates = {
    darwin: [
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    ],
    linux: [
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome'
    ],
    win32: [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ]
  }
  for (const p of candidates[process.platform] || []) {
    if (existsSync(p)) return p
  }
  return undefined // 回退到 puppeteer 内置 Chromium
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      vitePrerender({
        staticDir: join(__dirname, 'dist'),
        routes: [
          '/',  '/privacy', '/terms',
          '/hub/', '/hub/file-preview', '/hub/image-processing', '/hub/ocr', '/hub/it-tools', '/hub/file-converter', '/hub/flow-factory', '/hub/calculator', '/hub/ip-query', '/hub/inbox',
          '/ai/', '/ai/chat', '/ai/text2image', '/ai/image2image',
          '/idea/','/idea/articles','/idea/coldknowledge',
          '/explore/', '/explore/jetbra', '/explore/onthisday', '/explore/mbti',
         ],
        renderer: new Renderer({
          maxConcurrentRoutes: 2,
          renderAfterDocumentEvent: 'app-rendered',
          headless: true,
          executablePath: findChrome(),
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }),
        postProcess(renderedRoute) {
          renderedRoute.route = renderedRoute.originalRoute
          // 移除预渲染时注入的百度统计脚本，避免运行时重复
          renderedRoute.html = renderedRoute.html.replace(
            /<script[^>]*hm\.baidu\.com[^>]*><\/script>/gi,
            ''
          )
          // 移除预渲染时注入的 Google Analytics 脚本，避免运行时重复
          renderedRoute.html = renderedRoute.html.replace(
            /<script[^>]*googletagmanager\.com[^>]*><\/script>/gi,
            ''
          )
          return renderedRoute
        }
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    define: {
      __BAIDU_TONGJI__: JSON.stringify(mode === 'production'),
      __GOOGLE_ANALYTICS__: JSON.stringify(mode === 'production')
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-md': ['markdown-it'],
            'vendor-hljs': ['highlight.js/lib/common']
          }
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true
        },
        '/sso': {
          target: 'http://localhost:8080',
          changeOrigin: true
        }
      }
    }
  }
})
