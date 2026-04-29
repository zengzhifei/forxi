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
const CalculatorView = () => import('../views/CalculatorView.vue')
const IpQueryView = () => import('../views/IpQueryView.vue')
const InboxView = () => import('../views/InboxView.vue')
const AboutView = () => import('../views/AboutView.vue')

// 路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: '福兮 Forxi - 免费内容平台 | 应用 · AI · 创意 · 探索',
      description: '福兮 Forxi 是一个免费内容平台，提供文件预览、图片处理、AI 创作、IT 开发工具箱等40多款实用在线工具，无需安装，打开即用，完全免费。',
      keywords: 'Forxi,福兮,免费在线工具,文件预览,图片处理,AI绘画,AI对话,IT工具箱,流程图,OCR文字识别,文件转换,超级计算器,IP查询,临时邮箱,MBTI测试,冷知识,JetBrains激活',
      ogImage: 'https://forxi.cn/logo.jpg'
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
    meta: {
      title: '登录 / 注册 - 福兮 Forxi',
      description: '登录或注册福兮 Forxi 账号，享受文件预览、图片处理、AI 创作等40多款在线工具服务，支持邮箱和 GitHub 账号登录。',
      keywords: '福兮,Forxi,登录,注册,账号,GitHub登录',
      robots: 'noindex,nofollow'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: '个人中心 - 福兮 Forxi',
      description: '管理您的福兮 Forxi 账户信息、修改密码、绑定第三方账号。',
      keywords: '福兮,Forxi,个人中心,账户管理,修改密码',
      robots: 'noindex,nofollow',
      requiresAuth: true
    }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    meta: {
      title: '找回密码 - 福兮 Forxi',
      description: '通过绑定邮箱找回并重置您的福兮 Forxi 账户密码。',
      keywords: '福兮,Forxi,找回密码,重置密码',
      robots: 'noindex,nofollow'
    }
  },
  {
    path: '/oauth/callback',
    name: 'oauth-callback',
    component: GithubCallbackView,
    meta: {
      title: '登录中 - 福兮 Forxi',
      description: '正在处理登录请求，请稍候...',
      keywords: '福兮,Forxi,登录',
      robots: 'noindex,nofollow'
    }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyView,
    meta: {
      title: '隐私政策 - 福兮 Forxi',
      description: '福兮 Forxi 隐私政策，详细说明我们如何收集、使用、存储和保护您的个人信息，最后更新于2026年3月。',
      keywords: '福兮,Forxi,隐私政策,个人信息保护,数据安全'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      title: '关于我们 - 福兮 Forxi',
      description: '关于福兮 Forxi：一个提供40多款免费在线工具的内容平台，包含文件处理、AI 创作、开发工具等，了解我们的故事和支持方式。',
      keywords: '福兮,Forxi,关于,关于我们,免费工具平台,支持,打赏,捐赠'
    }
  },
  {
    path: '/terms',
    name: 'terms',
    component: TermsView,
    meta: {
      title: '服务条款 - 福兮 Forxi',
      description: '福兮 Forxi 服务条款，规定了用户使用本服务的权利和义务，最后更新于2026年3月。',
      keywords: '福兮,Forxi,服务条款,用户协议,使用规范'
    }
  },
  {
    path: '/hub/',
    name: 'hub',
    component: HubView,
    meta: {
      title: '应用工具箱 - 福兮 Forxi | 在线文件处理与开发工具',
      description: '福兮 Forxi 应用工具箱：文件预览（PDF/Word/Excel）、图片处理与压缩、图片OCR文字识别、IT开发工具箱、流程图制作、文件格式转换、超级计算器、IP查询、临时邮箱，全部免费使用。',
      keywords: '福兮,应用工具箱,在线工具,文件预览,图片处理,图片压缩,OCR文字识别,IT工具箱,流程图,文件转换,计算器,IP查询,临时邮箱'
    }
  },
  {
    path: '/hub/file-preview',
    name: 'file-preview',
    component: FilePreviewView,
    meta: {
      title: '免费在线文件预览 - PDF/Word/Excel/PPT/图片/视频 | 福兮 Forxi',
      description: '免费在线预览 PDF、Word（docx）、Excel（xlsx）、PPT（pptx）、图片、视频等多种文件格式，无需下载安装，打开即览，纯浏览器本地处理，保护文件隐私。',
      keywords: '在线文件预览,PDF预览,Word预览,Excel预览,PPT预览,图片预览,视频预览,免费文件预览,在线文档查看,docx预览,xlsx预览,pptx预览,福兮'
    }
  },
  {
    path: '/hub/image-processing',
    name: 'image-processing',
    component: ImageProcessingView,
    meta: {
      title: '免费在线图片处理 - 压缩/裁剪/旋转/水印/格式转换 | 福兮 Forxi',
      description: '免费在线图片处理工具，支持图片压缩、裁剪、旋转、加水印、调滤镜、格式转换（JPG/PNG/WebP/GIF），纯浏览器本地处理，不上传服务器，完全保护隐私。',
      keywords: '在线图片处理,图片压缩,图片裁剪,图片旋转,图片加水印,图片滤镜,图片格式转换,JPG转PNG,图片转WebP,免费图片编辑,图片处理工具,福兮'
    }
  },
  {
    path: '/hub/ocr',
    name: 'ocr',
    component: OcrView,
    meta: {
      title: '免费在线图片OCR文字识别 - 图片转文字 | 福兮 Forxi',
      description: '免费在线图片OCR文字识别工具，支持中文、英文、日文等多种语言，可识别截图、扫描件、照片中的文字，纯浏览器处理，无需上传，保护隐私。',
      keywords: '图片OCR,文字识别,图片转文字,在线OCR,中文OCR,英文OCR,截图识别,扫描识别,免费OCR工具,tesseract,福兮'
    }
  },
  {
    path: '/hub/it-tools',
    name: 'it-tools',
    component: ItToolsView,
    meta: {
      title: 'IT开发工具箱 - Base64/JSON/UUID/颜色/正则/时间戳 | 福兮 Forxi',
      description: '开发者常用工具集合，包含 Base64 编解码、JSON 格式化与压缩、UUID 生成、颜色格式转换（HEX/RGB/HSL）、正则表达式测试、时间戳转换、URL 编解码、MD5 哈希、字符统计等40多种实用工具。',
      keywords: 'IT工具箱,开发工具,Base64编码,JSON格式化,UUID生成,颜色转换,正则表达式,时间戳转换,URL编码,MD5哈希,字符统计,前端工具,程序员工具,开发者工具,福兮'
    }
  },
  {
    path: '/hub/flow-factory',
    name: 'flow-factory',
    component: FlowFactoryView,
    meta: {
      title: '免费在线流程图制作 - 拖拽式流程设计工具 | 福兮 Forxi',
      description: '免费在线流程图制作工具，支持拖拽添加节点、连线、编辑属性、删除节点，可导出 PNG、JPEG 图片格式，适合绘制业务流程图、系统架构图、思维导图。',
      keywords: '在线流程图,流程图制作,流程图工具,拖拽流程图,在线画流程图,flowchart,流程设计,业务流程图,架构图,免费流程图,福兮'
    }
  },
  {
    path: '/hub/file-converter',
    name: 'file-converter',
    component: FileConverterView,
    meta: {
      title: '免费在线文件转PDF - 图片/文本/Word/表格转PDF | 福兮 Forxi',
      description: '免费在线文件转换工具，支持图片（JPG/PNG）、文本、Word（docx）、表格等多种格式转换为 PDF，纯浏览器处理，无需上传，安全便捷。',
      keywords: '文件转PDF,图片转PDF,文本转PDF,Word转PDF,Excel转PDF,在线文件转换,格式转换,免费PDF转换,福兮'
    }
  },
  {
    path: '/ai/',
    name: 'ai',
    component: AIView,
    meta: {
      title: 'AI 创作工具 - 文生图/图生图/AI对话 | 福兮 Forxi',
      description: '福兮 Forxi AI 创作工具集：免费在线 AI 文生图（文字生成图片）、图生图（AI 改造图片）、AI 智能对话聊天，让创意轻松落地，无需下载，立即体验。',
      keywords: 'AI工具,AI绘画,文生图,图生图,AI对话,AI聊天,AI创作,免费AI,在线AI,人工智能绘画,AI生成图片,福兮'
    }
  },
  {
    path: '/ai/chat',
    name: 'chat',
    component: ChatView,
    meta: {
      title: 'AI 智能对话聊天 - 解答问题/写代码/创作文案 | 福兮 Forxi',
      description: '免费在线 AI 智能对话助手，支持多轮上下文对话、Markdown 渲染、代码高亮，可解答各类问题、辅助编程开发、生成创意文案，流式响应体验流畅。',
      keywords: 'AI对话,AI聊天,智能助手,AI助手,免费AI聊天,在线AI对话,AI写代码,AI问答,ChatAI,福兮'
    }
  },
  {
    path: '/ai/text2image',
    name: 'text2image',
    component: Text2ImageView,
    meta: {
      title: '免费在线AI文生图 - 文字生成图片 | 福兮 Forxi',
      description: '免费在线 AI 文字生成图片工具，输入文字描述，选择尺寸和风格，AI 即刻为你生成精美图片，支持下载，创意无限。',
      keywords: 'AI文生图,文字生成图片,AI绘画,AI画图,在线AI生图,免费文生图,AI图片生成,text to image,AI创作,福兮'
    }
  },
  {
    path: '/ai/image2image',
    name: 'image2image',
    component: Image2ImageView,
    meta: {
      title: '免费在线AI图生图 - AI图片风格转换 | 福兮 Forxi',
      description: '免费在线 AI 图生图工具，上传原始图片并描述变化方向，AI 帮你改造图片风格，支持人像、风景、动漫等多种风格转换。',
      keywords: 'AI图生图,图片风格转换,AI改图,AI图片处理,image to image,AI图片变换,在线AI改图,免费图生图,福兮'
    }
  },
  {
    path: '/idea/',
    name: 'idea',
    component: IdeaView,
    meta: {
      title: '创意空间 - 技术文章与冷知识 | 福兮 Forxi',
      description: '福兮 Forxi 创意空间：涵盖前端开发、后端技术、DevOps 等领域技术文章和随笔杂谈，以及有趣的冷知识科普，探索知识的边界。',
      keywords: '福兮,创意,技术文章,前端开发,后端技术,DevOps,随笔,冷知识,趣味知识'
    }
  },
  {
    path: '/idea/articles/',
    name: 'articles',
    component: ArticlesView,
    meta: {
      title: '技术文章 - 前端/后端/DevOps | 福兮 Forxi',
      description: '福兮 Forxi 技术文章栏目，涵盖前端开发（Vue/React/JavaScript）、后端技术（Java/Go/Python）、DevOps 运维部署、随笔杂谈等多个领域的原创技术文章和经验总结。',
      keywords: '技术文章,前端开发,后端技术,DevOps,Vue教程,React教程,JavaScript,Java,Go,Python,运维,随笔,福兮'
    }
  },
  {
    path: '/idea/coldknowledge',
    name: 'coldknowledge',
    component: ColdKnowledgeView,
    meta: {
      title: '冷知识大全 - 有趣的冷知识科普 | 福兮 Forxi',
      description: '福兮 Forxi 冷知识科普：探索那些你不知道的有趣冷知识，发现世界的奇妙之处，涵盖科学、历史、动物、自然、社会等各类趣味知识。',
      keywords: '冷知识,趣味知识,冷知识大全,有趣事实,科普知识,冷知识科普,奇妙知识,百科冷知识,福兮'
    }
  },
  {
    path: '/idea/articles/:category/',
    name: 'articles-category',
    component: ArticlesView,
    meta: {
      title: '技术文章 - 前端/后端/DevOps | 福兮 Forxi',
      description: '福兮 Forxi 技术文章栏目，涵盖前端开发（Vue/React/JavaScript）、后端技术（Java/Go/Python）、DevOps 运维部署、随笔杂谈等多个领域的原创技术文章和经验总结。',
      keywords: '技术文章,前端开发,后端技术,DevOps,Vue教程,React教程,JavaScript,Java,Go,Python,运维,随笔,福兮'
    }
  },
  {
    path: '/idea/articles/:category/:id',
    name: 'article-detail',
    component: ArticlesView,
    meta: {
      title: '技术文章 - 前端/后端/DevOps | 福兮 Forxi',
      description: '福兮 Forxi 技术文章栏目，涵盖前端开发（Vue/React/JavaScript）、后端技术（Java/Go/Python）、DevOps 运维部署、随笔杂谈等多个领域的原创技术文章和经验总结。',
      keywords: '技术文章,前端开发,后端技术,DevOps,Vue教程,React教程,JavaScript,Java,Go,Python,运维,随笔,福兮'
    }
  },
  {
    path: '/explore/',
    name: 'explore',
    component: ExploreView,
    meta: {
      title: '探索 - JetBrains激活/历史上的今天/MBTI测试 | 福兮 Forxi',
      description: '福兮 Forxi 探索频道：JetBrains 系列 IDE 激活服务、历史上的今天重大事件、MBTI 16型人格测试，探索更多有趣内容。',
      keywords: '福兮,探索,JetBrains激活,历史上的今天,MBTI测试,开发者资源,人格测试'
    }
  },
  {
    path: '/explore/jetbra',
    name: 'jetbrains',
    component: JetbrainsView,
    meta: {
      title: 'JetBrains IDE 激活 - IntelliJ IDEA/PyCharm/WebStorm | 福兮 Forxi',
      description: '免费 JetBrains 系列 IDE 激活服务，支持 IntelliJ IDEA、PyCharm、WebStorm、GoLand、Rider、CLion、DataGrip、PhpStorm 等全系 JetBrains 产品激活。',
      keywords: 'JetBrains激活,IntelliJ IDEA激活,PyCharm激活,WebStorm激活,GoLand激活,Rider激活,CLion激活,DataGrip激活,PhpStorm激活,IDE激活,JetBrains破解,福兮'
    }
  },
  {
    path: '/explore/onthisday',
    name: 'onthisday',
    component: OnThisDayView,
    meta: {
      title: '历史上的今天 - 查看历史重大事件 | 福兮 Forxi',
      description: '穿越时光隧道，查看历史上今天发生了哪些重大事件，涵盖政治变迁、科学发现、文化盛事、体育突破等各类历史瞬间，支持选择任意日期查看。',
      keywords: '历史上的今天,历史事件,历史回顾,今日历史,历史大事件,科学发现历史,文化历史,体育历史,福兮'
    }
  },
  {
    path: '/explore/mbti',
    name: 'mbti',
    component: MbtiView,
    meta: {
      title: '免费在线MBTI人格测试 - 探索16型人格 | 福兮 Forxi',
      description: '免费在线 MBTI 人格类型测试，精选题目带你深入了解自己的性格密码，测试后获得 16 种人格类型详细分析报告，包含性格特征、职业发展建议和人际关系指南。',
      keywords: 'MBTI测试,MBTI人格测试,16型人格,性格测试,人格类型,MBTI免费测试,在线MBTI,职业性格测试,INFJ,INTJ,ENFP,ENTP,福兮'
    }
  },
  {
    path: '/hub/calculator',
    name: 'calculator',
    component: CalculatorView,
    meta: {
      title: '免费在线超级计算器 - 科学/金融/进制/单位换算 | 福兮 Forxi',
      description: '免费在线超级计算器，支持数学计算、科学计算、复利/贷款金融计算、二进制/八进制/十六进制进制转换、字节换算、长度/重量/温度等单位换算，还有中文亲戚称谓计算器和生肖血型工具。',
      keywords: '在线计算器,超级计算器,科学计算器,复利计算器,贷款计算器,进制转换,二进制转换,单位换算,温度换算,亲戚称谓,生肖计算,免费计算器,福兮'
    }
  },
  {
    path: '/hub/ip-query',
    name: 'ip-query',
    component: IpQueryView,
    meta: {
      title: '免费在线IP查询 - IP地址归属地/地理位置/天气 | 福兮 Forxi',
      description: '免费在线IP地址查询工具，查询全球任意IP地址的归属地（国家/城市）、经纬度、时区、运营商（ISP）信息，还可查看该地点实时天气状况。',
      keywords: 'IP查询,IP地址查询,IP归属地查询,IP地理位置,查IP,全球IP查询,ISP查询,IP天气,在线IP查询,免费IP查询,福兮'
    }
  },
  {
    path: '/hub/inbox',
    name: 'inbox',
    component: InboxView,
    meta: {
      title: '免费在线临时邮箱 - 一次性匿名邮箱 | 福兮 Forxi',
      description: '免费在线临时邮箱服务，即时创建一次性匿名邮箱地址，30分钟内接收邮件，无需注册，有效保护真实邮箱隐私，防止垃圾邮件骚扰。',
      keywords: '临时邮箱,一次性邮箱,匿名邮箱,免费临时邮箱,在线临时邮箱,disposable email,临时邮件,垃圾邮件防护,注册用邮箱,福兮'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      title: '页面不存在 (404) - 福兮 Forxi',
      description: '您访问的页面不存在，请返回首页继续探索福兮 Forxi 在线工具。',
      keywords: '福兮,Forxi,404,页面不存在',
      robots: 'noindex,follow'
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
  document.title = to.meta.title || '福兮 Forxi - 免费内容平台'

  // 动态设置 meta 标签
  if (to.meta.description) {
    updateMetaTag('description', to.meta.description)
    updateOgTag('og:description', to.meta.description)
    updateMetaTag('twitter:description', to.meta.description)
  }
  if (to.meta.keywords) {
    updateMetaTag('keywords', to.meta.keywords)
  }

  // robots 控制（noindex 页面单独设置）
  updateMetaTag('robots', to.meta.robots || 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1')

  // 更新 og:title、og:url 和 Twitter Card
  const title = to.meta.title || '福兮 Forxi - 免费内容平台'
  updateOgTag('og:title', title)
  updateMetaTag('twitter:title', title)
  updateOgTag('og:url', `https://forxi.cn${to.path}`)

  // 更新 og:image 和 twitter:image（使用路由自定义或默认图）
  const image = to.meta.ogImage || 'https://forxi.cn/logo.jpg'
  updateOgTag('og:image', image)
  updateMetaTag('twitter:image', image)

  // 更新 canonical
  updateCanonical(`https://forxi.cn${to.path}`)

  // 注入 JSON-LD 结构化数据
  const jsonLd = jsonLdMap[to.name]
  if (jsonLd) {
    updateJsonLd(jsonLd)
  }

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

// 注入或更新 JSON-LD 结构化数据
function updateJsonLd(data) {
  let script = document.querySelector('script[data-jsonld="page"]')
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-jsonld', 'page')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

// 各路由的 JSON-LD 结构化数据配置
const jsonLdMap = {
  home: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '福兮 Forxi',
    url: 'https://forxi.cn/',
    description: '福兮 Forxi 是一个免费内容平台，提供文件预览、图片处理、AI 创作、IT 开发工具箱等40多款实用在线工具。',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://forxi.cn/hub/it-tools?q={search_term_string}' },
      'query-input': 'required name=search_term_string'
    }
  },
  hub: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '应用工具箱 - 福兮 Forxi',
    url: 'https://forxi.cn/hub/',
    description: '文件预览、图片处理、OCR、IT工具箱、流程图、文件转换、计算器、IP查询、临时邮箱等免费在线工具。',
    isPartOf: { '@type': 'WebSite', name: '福兮 Forxi', url: 'https://forxi.cn/' }
  },
  'file-preview': {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '免费在线文件预览',
    url: 'https://forxi.cn/hub/file-preview',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '免费在线预览 PDF、Word、Excel、PPT、图片、视频等多种文件格式，无需下载安装。'
  },
  'image-processing': {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '免费在线图片处理',
    url: 'https://forxi.cn/hub/image-processing',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '免费在线图片处理，支持压缩、裁剪、旋转、加水印、调滤镜、格式转换，纯本地处理保护隐私。'
  },
  ocr: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '免费在线图片OCR文字识别',
    url: 'https://forxi.cn/hub/ocr',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '免费在线图片OCR文字识别，支持中文、英文等多种语言，纯浏览器处理，保护隐私。'
  },
  'it-tools': {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'IT开发工具箱',
    url: 'https://forxi.cn/hub/it-tools',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '开发者常用工具集合，包含 Base64、JSON格式化、UUID生成、颜色转换、正则测试、时间戳转换等40多种实用工具。'
  },
  'flow-factory': {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '免费在线流程图制作',
    url: 'https://forxi.cn/hub/flow-factory',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '免费在线流程图制作工具，支持拖拽添加节点、连线、编辑，可导出 PNG、JPEG 图片。'
  },
  'file-converter': {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '免费在线文件转PDF',
    url: 'https://forxi.cn/hub/file-converter',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '免费在线文件转PDF，支持图片、文本、Word、表格等多种格式，纯浏览器处理，无需上传。'
  },
  calculator: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '免费在线超级计算器',
    url: 'https://forxi.cn/hub/calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '免费在线超级计算器，支持数学、科学、金融、进制转换、单位换算等多种计算功能。'
  },
  'ip-query': {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '免费在线IP查询',
    url: 'https://forxi.cn/hub/ip-query',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '免费在线IP地址查询，查询全球IP地址的归属地、地理位置、ISP信息和实时天气。'
  },
  inbox: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '免费在线临时邮箱',
    url: 'https://forxi.cn/hub/inbox',
    applicationCategory: 'CommunicationApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '免费在线临时邮箱，即时创建一次性匿名邮箱，30分钟内接收邮件，保护真实邮箱隐私。'
  },
  ai: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI 创作工具 - 福兮 Forxi',
    url: 'https://forxi.cn/ai/',
    description: '免费在线 AI 工具：文生图、图生图、AI智能对话，让创意轻松落地。',
    isPartOf: { '@type': 'WebSite', name: '福兮 Forxi', url: 'https://forxi.cn/' }
  },
  chat: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI 智能对话聊天',
    url: 'https://forxi.cn/ai/chat',
    applicationCategory: 'SocialNetworkingApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '免费在线 AI 智能对话助手，支持多轮对话、Markdown 渲染，可解答问题、辅助编程、生成创意文案。'
  },
  text2image: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '免费在线AI文生图',
    url: 'https://forxi.cn/ai/text2image',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '免费在线 AI 文字生成图片，输入文字描述，AI 即刻生成精美图片，支持多种风格和尺寸。'
  },
  image2image: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '免费在线AI图生图',
    url: 'https://forxi.cn/ai/image2image',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '免费在线 AI 图生图，上传图片并描述变化，AI 帮你改造图片风格。'
  },
  articles: {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '技术文章 - 福兮 Forxi',
    url: 'https://forxi.cn/idea/articles/',
    description: '涵盖前端开发、后端技术、DevOps 等领域的原创技术文章和经验总结。',
    isPartOf: { '@type': 'WebSite', name: '福兮 Forxi', url: 'https://forxi.cn/' }
  },
  coldknowledge: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '冷知识大全 - 福兮 Forxi',
    url: 'https://forxi.cn/idea/coldknowledge',
    description: '探索有趣的冷知识，发现世界的奇妙之处，涵盖科学、历史、动物等各类趣味知识。',
    isPartOf: { '@type': 'WebSite', name: '福兮 Forxi', url: 'https://forxi.cn/' }
  },
  jetbrains: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JetBrains IDE 激活',
    url: 'https://forxi.cn/explore/jetbra',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: 'JetBrains 系列 IDE 激活服务，支持 IntelliJ IDEA、PyCharm、WebStorm、GoLand 等全系产品。'
  },
  onthisday: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '历史上的今天 - 福兮 Forxi',
    url: 'https://forxi.cn/explore/onthisday',
    description: '查看历史上今天发生的重大事件，涵盖政治、科学、文化、体育等各类历史瞬间。',
    isPartOf: { '@type': 'WebSite', name: '福兮 Forxi', url: 'https://forxi.cn/' }
  },
  mbti: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '免费在线MBTI人格测试',
    url: 'https://forxi.cn/explore/mbti',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    description: '免费在线 MBTI 16型人格测试，获得详细的性格分析报告，包含职业发展建议。'
  },
  about: {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: '关于我们 - 福兮 Forxi',
    url: 'https://forxi.cn/about/',
    description: '关于福兮 Forxi：一个提供40多款免费在线工具的内容平台。',
    isPartOf: { '@type': 'WebSite', name: '福兮 Forxi', url: 'https://forxi.cn/' }
  },
  privacy: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '隐私政策 - 福兮 Forxi',
    url: 'https://forxi.cn/privacy',
    description: '福兮 Forxi 隐私政策，说明如何收集、使用、保护您的个人信息。',
    isPartOf: { '@type': 'WebSite', name: '福兮 Forxi', url: 'https://forxi.cn/' }
  },
  terms: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '服务条款 - 福兮 Forxi',
    url: 'https://forxi.cn/terms',
    description: '福兮 Forxi 服务条款，规定用户使用本服务的权利和义务。',
    isPartOf: { '@type': 'WebSite', name: '福兮 Forxi', url: 'https://forxi.cn/' }
  }
}

export default router
