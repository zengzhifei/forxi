/**
 * 路由配置文件
 * 定义应用的所有路由
 */
import { createRouter, createWebHistory } from 'vue-router'

// 懒加载页面组件
const HomeView = () => import('../views/HomeView.vue')
const FilePreviewView = () => import('../views/FilePreviewView.vue')
const ImageProcessingView = () => import('../views/ImageProcessingView.vue')
const ItToolsView = () => import('../views/ItToolsView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')
const AuthView = () => import('../views/AuthView.vue')
const ProfileView = () => import('../views/ProfileView.vue')
const ResetPasswordView = () => import('../views/ResetPasswordView.vue')
const GithubCallbackView = () => import('../views/GithubCallbackView.vue')

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
    path: '/auth',
    name: 'auth',
    component: AuthView,
    meta: {
      title: 'Forxi - 登录注册'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'Forxi - 用户中心',
      requiresAuth: true
    }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    meta: {
      title: 'Forxi - 重置密码'
    }
  },
  {
    path: '/oauth/github/callback',
    name: 'github-callback',
    component: GithubCallbackView,
    meta: {
      title: 'Forxi - GitHub登录中'
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
  history: createWebHistory(),
  routes
})

// 路由守卫，设置页面标题和登录验证
router.beforeEach((to) => {
  // 设置页面标题
  document.title = to.meta.title || 'Forxi - 工具集合'
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('access_token')
    if (!token) {
      return { path: '/auth', query: { redirect: to.fullPath } }
    }
  }
  
  return true
})

export default router
