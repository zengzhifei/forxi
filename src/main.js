import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import './plugins/baidu-tongji.js'

const app = createApp(App)

app.use(router)

router.isReady().then(() => {
  app.mount('#app')
  document.dispatchEvent(new Event('app-rendered'))
})
