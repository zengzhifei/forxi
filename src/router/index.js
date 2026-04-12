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
const ChatView = () => import('../views/ChatView.vue')
const Text2ImageView = () => import('../views/Text2ImageView.vue')
const Image2ImageView = () => import('../views/Image2ImageView.vue')
const OcrView = () => import('../views/OcrView.vue')
const ItToolsView = () => import('../views/ItToolsView.vue')
const JetbrainsView = () => import('../views/JetbrainsView.vue')
const FlowFactoryView = () => import('../views/FlowFactoryView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')
const AuthView = () => import('../views/AuthView.vue')
const ProfileView = () => import('../views/ProfileView.vue')
const ResetPasswordView = () => import('../views/ResetPasswordView.vue')
const GithubCallbackView = () => import('../views/OauthCallbackView.vue')
const ArticlesView = () => import('../views/ArticlesView.vue')
const TermsView = () => import('../views/TermsView.vue')
const PrivacyView = () => import('../views/PrivacyView.vue')
const HubView = () => import('../views/HubView.vue')
const FileConverterView = () => import('../views/FileConverterView.vue')
const IdeaView = () => import('../views/IdeaView.vue')
const ExploreView = () => import('../views/ExploreView.vue')
const OnThisDayView = () => import('../views/OnThisDayView.vue')
const MbtiView = () => import('../views/MbtiView.vue')
const ColdKnowledgeView = () => import('../views/ColdKnowledgeView.vue')

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
    path: '/hub/',
    name: 'hub',
    component: HubView,
    meta: {
      title: 'Forxi - 应用',
      description: '应用精选工具集合，包含文件预览、图片处理、图片OCR、IT工具箱等实用工具。',
      keywords: '应用,工具箱,文件预览,图片处理,OCR'
    }
  },
  {
    path: '/hub/file-preview',
    name: 'file-preview',
    component: FilePreviewView,
    meta: {
      title: 'Forxi - 应用 - 文件预览',
      description: '免费在线预览 PDF、Word、Excel、PPT、图片、视频等多种文件格式，无需下载，打开即览。',
      keywords: '在线文件预览,PDF预览,Word预览,Excel预览,PPT预览,图片预览,免费文件预览'
    }
  },
  {
    path: '/hub/image-processing',
    name: 'image-processing',
    component: ImageProcessingView,
    meta: {
      title: 'Forxi - 应用 - 图片处理',
      description: '免费在线图片处理，支持压缩、裁剪、旋转、加水印、调滤镜、格式转换，纯本地处理保护隐私。',
      keywords: '在线图片处理,图片压缩,图片裁剪,图片旋转,图片水印,图片格式转换,免费图片编辑'
    }
  },
  {
    path: '/hub/ocr',
    name: 'ocr',
    component: OcrView,
    meta: {
      title: 'Forxi - 应用 - 图片OCR',
      description: '免费在线图片文字识别工具，支持中文、英文等多种语言识别，纯前端处理，保护隐私。',
      keywords: '图片OCR,文字识别,图片转文字,在线OCR,中文识别'
    }
  },
  {
    path: '/hub/it-tools',
    name: 'it-tools',
    component: ItToolsView,
    meta: {
      title: 'Forxi - 应用 - IT 工具箱',
      description: '开发者常用工具集合，包含 Base64 编解码、JSON 格式化、UUID 生成、颜色转换、正则测试、时间戳转换等实用工具。',
      keywords: 'IT工具箱,开发工具,Base64编码,JSON格式化,UUID生成,颜色转换,正则表达式,时间戳转换,URL编码,MD5'
    }
  },
  {
    path: '/hub/flow-factory',
    name: 'flow-factory',
    component: FlowFactoryView,
    meta: {
      title: 'Forxi - 应用 - 流程工厂',
      description: '免费在线流程图制作工具，支持节点添加、连接、拖拽、删除、属性编辑，可导出 PNG、JPEG 图片格式。',
      keywords: '流程图,流程工厂,在线流程图,flowchart,流程制作'
    }
  },
  {
    path: '/hub/file-converter',
    name: 'file-converter',
    component: FileConverterView,
    meta: {
      title: 'Forxi - 应用 - 文件转换',
      description: '免费在线文件转换工具，支持图片、文本、Word、表格等多种格式转换为 PDF。',
      keywords: '文件转换,PDF转换,图片转PDF,文本转PDF,Word转PDF,表格转PDF'
    }
  },
  {
    path: '/ai/',
    name: 'ai',
    component: AIView,
    meta: {
      title: 'Forxi - AI',
      description: '免费在线 AI 工具，支持文生图、图生图、AI 智能对话，让创意轻松落地。',
      keywords: 'AI,文生图,图生图,AI绘画,AI对话,AI创作,免费AI工具'
    }
  },
  {
    path: '/ai/chat',
    name: 'chat',
    component: ChatView,
    meta: {
      title: 'Forxi - AI - 聊一聊',
      description: '与 AI 智能对话，解答问题、编写代码、创作文案。',
      keywords: 'AI对话,AI聊天,智能助手'
    }
  },
  {
    path: '/ai/text2image',
    name: 'text2image',
    component: Text2ImageView,
    meta: {
      title: 'Forxi - AI - 文生图',
      description: '输入文字描述，AI 为你生成精美图片。',
      keywords: '文生图,AI绘画,AI生成图片'
    }
  },
  {
    path: '/ai/image2image',
    name: 'image2image',
    component: Image2ImageView,
    meta: {
      title: 'Forxi - AI - 图生图',
      description: '上传图片并描述变化，AI 帮你改造图片。',
      keywords: '图生图,AI改图,AI图片处理'
    }
  },
  {
    path: '/idea/',
    name: 'idea',
    component: IdeaView,
    meta: {
      title: 'Forxi - 创意',
      description: '探索创意空间，发现更多精彩内容。',
      keywords: '创意,文章,探索'
    }
  },
  {
    path: '/idea/articles/',
    name: 'articles',
    component: ArticlesView,
    meta: {
      title: 'Forxi - 创意 - 文章',
      description: '技术文章、随笔杂谈、经验总结，涵盖前端开发、后端技术、DevOps 等领域。',
      keywords: '技术文章,随笔,经验总结,前端,后端,DevOps'
    }
  },
  {
    path: '/idea/coldknowledge',
    name: 'coldknowledge',
    component: ColdKnowledgeView,
    meta: {
      title: 'Forxi - 创意 - 冷知识',
      description: '探索有趣的小知识，发现世界的奇妙之处。',
      keywords: '冷知识,趣味知识,有趣事实'
    }
  },
  {
    path: '/idea/articles/:category/',
    name: 'articles-category',
    component: ArticlesView,
    meta: {
      title: 'Forxi - 创意 - 文章',
      description: '技术文章、随笔杂谈、经验总结，涵盖前端开发、后端技术、DevOps 等领域。',
      keywords: '技术文章,随笔,经验总结,前端,后端,DevOps'
    }
  },
  {
    path: '/idea/articles/:category/:id',
    name: 'article-detail',
    component: ArticlesView,
    meta: {
      title: 'Forxi - 创意 - 文章',
      description: '技术文章、随笔杂谈、经验总结，涵盖前端开发、后端技术、DevOps 等领域。',
      keywords: '技术文章,随笔,经验总结,前端,后端,DevOps'
    }
  },
  {
    path: '/explore/',
    name: 'explore',
    component: ExploreView,
    meta: {
      title: 'Forxi - 探索',
      description: '探索开发者资源，JetBrains IDE 激活等精选工具。',
      keywords: '探索,JetBrains,开发者资源'
    }
  },
  {
    path: '/explore/jetbra',
    name: 'jetbrains',
    component: JetbrainsView,
    meta: {
      title: 'Forxi - 探索 - JetBrains 激活',
      description: 'JetBrains 系列 IDE 激活服务，支持 IntelliJ IDEA、PyCharm、WebStorm、GoLand 等。',
      keywords: 'JetBrains激活,IntelliJ IDEA,PyCharm,WebStorm,GoLand,Rider,CLion,IDE激活'
    }
  },
  {
    path: '/explore/onthisday',
    name: 'onthisday',
    component: OnThisDayView,
    meta: {
      title: 'Forxi - 探索 - 历史上的今天',
      description: '穿越时光隧道，看看历史上今天发生了什么重大事件。收集政治变迁、科学发现、文化盛事、体育突破等历史瞬间。',
      keywords: '历史上的今天，历史回顾，时光隧道，历史事件'
    }
  },
  {
    path: '/explore/mbti',
    name: 'mbti',
    component: MbtiView,
    meta: {
      title: 'Forxi - 探索 - MBTI 人格测试',
      description: '免费在线 MBTI 人格类型测试，精选题目带你发现真实的自己，探索你的性格密码。',
      keywords: 'MBTI，人格测试，性格测试，16 型人格，职业测试'
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
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
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
