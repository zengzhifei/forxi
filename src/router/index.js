/**
 * 路由配置文件
 * 定义应用的所有路由
 */
import { createRouter, createWebHistory } from 'vue-router'
import sso from '../utils/sso'

// 懒加载页面组件
const HomeView = () => import('../views/HomeView.vue')
const FilePreviewView = () => import('../views/FilePreviewView.vue')
const ImageProcessingView = () => import('../views/ImageProcessingView.vue')
const AIView = () => import('../views/AIView.vue')
const ItToolsView = () => import('../views/ItToolsView.vue')
const JetbrainsView = () => import('../views/JetbrainsView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')
const AuthView = () => import('../views/AuthView.vue')
const ProfileView = () => import('../views/ProfileView.vue')
const ResetPasswordView = () => import('../views/ResetPasswordView.vue')
const GithubCallbackView = () => import('../views/OauthCallbackView.vue')
const ArticlesView = () => import('../views/ArticlesView.vue')
const TermsView = () => import('../views/TermsView.vue')
const PrivacyView = () => import('../views/PrivacyView.vue')

// 路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Forxi - 免费内容平台',
      description: 'Forxi 提供文件预览、图片处理、AI 创作、IT 开发工具箱等免费在线工具，无需安装，打开即用。',
      keywords: 'Forxi,在线工具,文件预览,图片处理,AI绘画,IT工具箱,免费工具,开发工具'
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
    meta: {
      title: 'Forxi - 登录 / 注册',
      description: '登录或注册 Forxi 账号，享受文件预览、图片处理、AI 创作等在线工具服务。',
      keywords: 'Forxi,登录,注册,账号'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'Forxi - 个人中心',
      description: '管理您的 Forxi 账户信息、修改密码、绑定第三方账号。',
      keywords: 'Forxi,个人中心,账户管理,修改密码',
      requiresAuth: true
    }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    meta: {
      title: 'Forxi - 找回密码',
      description: '通过绑定邮箱找回并重置您的 Forxi 账户密码。',
      keywords: 'Forxi,找回密码,重置密码'
    }
  },
  {
    path: '/oauth/callback',
    name: 'oauth-callback',
    component: GithubCallbackView,
    meta: {
      title: 'Forxi - 登录中',
      description: '正在处理登录请求，请稍候...',
      keywords: 'Forxi,登录'
    }
  },
  {
    path: '/file-preview',
    name: 'file-preview',
    component: FilePreviewView,
    meta: {
      title: 'Forxi - 文件预览',
      description: '免费在线预览 PDF、Word、Excel、PPT、图片、视频等多种文件格式，无需下载，打开即览。',
      keywords: '在线文件预览,PDF预览,Word预览,Excel预览,PPT预览,图片预览,免费文件预览'
    }
  },
  {
    path: '/image-processing',
    name: 'image-processing',
    component: ImageProcessingView,
    meta: {
      title: 'Forxi - 图片处理',
      description: '免费在线图片处理，支持压缩、裁剪、旋转、加水印、调滤镜、格式转换，纯本地处理保护隐私。',
      keywords: '在线图片处理,图片压缩,图片裁剪,图片旋转,图片水印,图片格式转换,免费图片编辑'
    }
  },
  {
    path: '/ai',
    name: 'ai',
    component: AIView,
    meta: {
      title: 'Forxi - AI 趣玩',
      description: '免费在线 AI 工具，支持文生图、图生图、AI 智能对话，让创意轻松落地。',
      keywords: 'AI趣玩,文生图,图生图,AI绘画,AI对话,AI创作,免费AI工具'
    }
  },
  {
    path: '/it-tools',
    name: 'it-tools',
    component: ItToolsView,
    meta: {
      title: 'Forxi - IT 工具箱',
      description: '开发者常用工具集合，包含 Base64 编解码、JSON 格式化、UUID 生成、颜色转换、正则测试、时间戳转换等实用工具。',
      keywords: 'IT工具箱,开发工具,Base64编码,JSON格式化,UUID生成,颜色转换,正则表达式,时间戳转换,URL编码,MD5'
    }
  },
  {
    path: '/jetbra',
    name: 'jetbrains',
    component: JetbrainsView,
    meta: {
      title: 'Forxi - JetBrains 激活',
      description: 'JetBrains 系列 IDE 激活服务，支持 IntelliJ IDEA、PyCharm、WebStorm、GoLand 等。',
      keywords: 'JetBrains激活,IntelliJ IDEA,PyCharm,WebStorm,GoLand,Rider,CLion,IDE激活'
    }
  },
  {
    path: '/articles',
    name: 'articles',
    component: ArticlesView,
    meta: {
      title: 'Forxi - 文章',
      description: '技术文章、随笔杂谈、经验总结，涵盖前端开发、后端技术、DevOps 等领域。',
      keywords: '技术文章,随笔,经验总结,前端,后端,DevOps'
    }
  },
  {
    path: '/articles/:category/:id',
    name: 'article-detail',
    component: ArticlesView,
    meta: {
      title: 'Forxi - 文章',
      description: '技术文章、随笔杂谈、经验总结，涵盖前端开发、后端技术、DevOps 等领域。',
      keywords: '技术文章,随笔,经验总结,前端,后端,DevOps'
    }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyView,
    meta: {
      title: 'Forxi - 隐私政策',
      description: 'Forxi 隐私政策，说明我们如何收集、使用、保护您的个人信息。',
      keywords: 'Forxi,隐私政策,个人信息保护'
    }
  },
  {
    path: '/terms',
    name: 'terms',
    component: TermsView,
    meta: {
      title: 'Forxi - 服务条款',
      description: 'Forxi 服务条款，规定了用户使用本服务的权利和义务。',
      keywords: 'Forxi,服务条款,用户协议'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      title: 'Forxi - 页面不存在',
      description: '您访问的页面不存在，请返回首页继续探索 Forxi 在线工具。',
      keywords: 'Forxi,404'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫，设置页面标题和登录验证
router.beforeEach(async (to) => {
  // 设置页面标题
  document.title = to.meta.title || 'Forxi - 免费内容平台'

  // 动态设置 meta 标签
  if (to.meta.description) {
    updateMetaTag('description', to.meta.description)
    updateOgTag('og:description', to.meta.description)
  }
  if (to.meta.keywords) {
    updateMetaTag('keywords', to.meta.keywords)
  }

  // 更新 og:title 和 og:url
  updateOgTag('og:title', to.meta.title || 'Forxi - 免费内容平台')
  updateOgTag('og:url', `https://forxi.cn${to.path}`)

  // 更新 canonical
  updateCanonical(`https://forxi.cn${to.path}`)

  // 需要登录的页面，未登录则跳转到登录页
  if (to.meta.requiresAuth) {
    try {
      await sso.getProfile()
    } catch {
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

// 更新或创建 og 标签
function updateOgTag(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.content = content
}

// 更新 canonical 链接
function updateCanonical(href) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

export default router
