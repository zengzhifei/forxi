import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import './plugins/baidu-tongji.js'

if (import.meta.env.DEV) {
  import('vconsole').then(({ default: VConsole }) => {
    new VConsole()
  })
}

/**
 * 初始化Vue应用
 * 加载路由配置并挂载到DOM
 */
const app = createApp(App)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')
