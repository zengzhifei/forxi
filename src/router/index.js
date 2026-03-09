/**
 * 路由配置文件
 * 定义应用的所有路由
 */
import { createRouter, createWebHashHistory } from 'vue-router'

// 懒加载页面组件
const HomeView = () => import('../views/HomeView.vue')
const FilePreviewView = () => import('../views/FilePreviewView.vue')

// 路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Forxi - 首页'
    }
  },
  {
    path: '/file-preview',
    name: 'file-preview',
    component: FilePreviewView,
    meta: {
      title: 'Forxi - 在线文件预览'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫，设置页面标题
router.beforeEach((to, from) => {
  // 设置页面标题
  document.title = to.meta.title || 'Forxi - 工具集合'
  // 返回true允许导航
  return true
})

export default router
