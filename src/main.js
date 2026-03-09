import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

/**
 * 初始化Vue应用
 * 加载路由配置并挂载到DOM
 */
const app = createApp(App)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')
