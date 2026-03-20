import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    define: {
      __BAIDU_TONGJI__: JSON.stringify(mode === 'production')
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-md': ['markdown-it'],
            'vendor-hljs': ['highlight.js/lib/core', 'highlight.js/lib/languages/javascript', 'highlight.js/lib/languages/python', 'highlight.js/lib/languages/css', 'highlight.js/lib/languages/xml', 'highlight.js/lib/languages/json', 'highlight.js/lib/languages/sql', 'highlight.js/lib/languages/bash', 'highlight.js/lib/languages/java', 'highlight.js/lib/languages/go']
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
        }
      }
    }
  }
})
