import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import './plugins/baidu-tongji.js'

/**
 * 初始化Vue应用
 * 加载路由配置并挂载到DOM
 */
const app = createApp(App)

// 使用路由
app.use(router)

// 等待路由就绪后挂载，确保预渲染时 meta 标签已设置
router.isReady().then(() => {
  app.mount('#app')
  document.dispatchEvent(new Event('app-rendered'))
})
