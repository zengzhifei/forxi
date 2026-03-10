/**
 * 路由配置文件
 * 定义应用的所有路由
 */
import { createRouter, createWebHashHistory } from 'vue-router'

// 懒加载页面组件
const HomeView = () => import('../views/HomeView.vue')
const FilePreviewView = () => import('../views/FilePreviewView.vue')
const ImageProcessingView = () => import('../views/ImageProcessingView.vue')
const ItToolsView = () => import('../views/ItToolsView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

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
  },
  {
    path: '/image-processing',
    name: 'image-processing',
    component: ImageProcessingView,
    meta: {
      title: 'Forxi - 在线图片处理'
    }
  },
  {
    path: '/it-tools',
    name: 'it-tools',
    component: ItToolsView,
    meta: {
      title: 'Forxi - IT 工具集合'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      title: 'Forxi - 页面未找到'
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
