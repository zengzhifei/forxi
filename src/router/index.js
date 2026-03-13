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
const JetbrainsView = () => import('../views/JetbrainsView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')
const AuthView = () => import('../views/AuthView.vue')
const ProfileView = () => import('../views/ProfileView.vue')
const ResetPasswordView = () => import('../views/ResetPasswordView.vue')
const GithubCallbackView = () => import('../views/OauthCallbackView.vue')

// 路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Forxi - 首页',
      description: 'Forxi提供多种在线工具，包括文件预览、图片处理、IT工具集合等，免费在线使用，无需安装。',
      keywords: 'Forxi,在线工具,文件预览,图片处理,IT工具,JetBrains'
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
    meta: {
      title: 'Forxi - 登录注册',
      description: '登录Forxi账号，享受更多在线工具服务，保存您的工作记录。',
      keywords: 'Forxi,登录,注册,账号'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'Forxi - 用户中心',
      description: '管理您的Forxi账户信息，查看使用记录和偏好设置。',
      keywords: 'Forxi,用户中心,账户管理',
      requiresAuth: true
    }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    meta: {
      title: 'Forxi - 重置密码',
      description: '重置您的Forxi账户密码，快速找回账户访问权限。',
      keywords: 'Forxi,重置密码,找回密码'
    }
  },
  {
    path: '/oauth/callback',
    name: 'oauth-callback',
    component: GithubCallbackView,
    meta: {
      title: 'Forxi - 登录中',
      description: '正在处理您的登录请求，请稍候...',
      keywords: 'Forxi,OAuth,登录'
    }
  },
  {
    path: '/file-preview',
    name: 'file-preview',
    component: FilePreviewView,
    meta: {
      title: 'Forxi - 在线文件预览',
      description: '支持PDF、图片、Office文档、视频等多种文件格式的在线预览，无需下载即可查看。',
      keywords: '在线文件预览,PDF预览,图片预览,Office预览,视频预览,文件查看'
    }
  },
  {
    path: '/image-processing',
    name: 'image-processing',
    component: ImageProcessingView,
    meta: {
      title: 'Forxi - 在线图片处理',
      description: '免费在线图片处理工具，支持压缩、裁剪、旋转、水印、滤镜等功能，操作简单。',
      keywords: '在线图片处理,图片压缩,图片裁剪,图片旋转,图片水印,图片滤镜,图片编辑'
    }
  },
  {
    path: '/it-tools',
    name: 'it-tools',
    component: ItToolsView,
    meta: {
      title: 'Forxi - IT 工具集合',
      description: '提供多种IT开发常用工具，包括MIME类型查询、编码转换、正则表达式测试等。',
      keywords: 'IT工具,开发工具,MIME类型,编码转换,正则表达式,JSON格式化,Base64编码'
    }
  },
  {
    path: '/jetbra',
    name: 'jetbrains',
    component: JetbrainsView,
    meta: {
      title: 'Forxi - JetBrains 工具',
      description: 'JetBrains IDE激活码生成工具，支持IntelliJ IDEA、PyCharm、WebStorm等。',
      keywords: 'JetBrains,激活码,IntelliJ IDEA,PyCharm,WebStorm,IDE激活'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      title: 'Forxi - 页面未找到',
      description: '抱歉，您访问的页面不存在。',
      keywords: 'Forxi,404,页面未找到'
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
  
  // 动态设置 meta 标签
  if (to.meta.description) {
    updateMetaTag('description', to.meta.description)
  }
  if (to.meta.keywords) {
    updateMetaTag('keywords', to.meta.keywords)
  }
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('access_token')
    if (!token) {
      return { path: '/auth', query: { redirect: to.fullPath } }
    }
  }
  
  return true
})

// 更新或创建 meta 标签
function updateMetaTag(name, content) {
  let metaTag = document.querySelector(`meta[name="${name}"]`)
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.name = name
    document.head.appendChild(metaTag)
  }
  metaTag.content = content
}

export default router
