import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
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
    server: {
      port: 5173,
      strictPort: true
    }
  }
})
