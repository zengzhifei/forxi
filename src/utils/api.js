const API_DOMAIN = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const BASE_URL = API_DOMAIN + '/api'

export const API_DOMAIN_CONST = API_DOMAIN

let isRefreshing = false

const request = async (endpoint, options = {}, retry = true) => {
  const token = localStorage.getItem('access_token')
  
  const isFormData = options.body instanceof FormData
  
  const config = {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)
  
  if (response.status === 401 && retry && !isRefreshing) {
    isRefreshing = true
    try {
      await api.refreshToken()
      isRefreshing = false
      return request(endpoint, options, false)
    } catch (err) {
      isRefreshing = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/auth'
      throw err
    }
  }

  const data = await response.json()

  if (data.code !== 0) {
    throw new Error(data.message || '请求失败')
  }

  return data
}

export const api = {
  // ==================== 认证接口 ====================

  /**
   * 发送验证码
   * 场景：用户注册时发送邮箱验证码
   * 路由：POST /api/auth/send-code
   */
  async sendVerificationCode(email) {
    const data = await request('/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
    return data.data
  },

  /**
   * 用户注册
   * 场景：用户通过邮箱密码注册账号
   * 路由：POST /api/auth/register
   */
  async register(email, password, nickname, verificationCode) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password, 
        nickname,
        verification_code: verificationCode 
      })
    })
    
    if (data.data.tokens) {
      localStorage.setItem('access_token', data.data.tokens.access_token)
      localStorage.setItem('refresh_token', data.data.tokens.refresh_token)
    }
    
    return data.data
  },

  /**
   * 用户登录
   * 场景：用户通过邮箱密码登录
   * 路由：POST /api/auth/login
   */
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    
    if (data.data.tokens) {
      localStorage.setItem('access_token', data.data.tokens.access_token)
      localStorage.setItem('refresh_token', data.data.tokens.refresh_token)
    }
    
    return data.data
  },

  /**
   * 刷新令牌
   * 场景：access_token 过期时，使用 refresh_token 获取新的 access_token
   * 路由：POST /api/auth/refresh
   */
  async refreshToken() {
    const refresh_token = localStorage.getItem('refresh_token')
    if (!refresh_token) {
      throw new Error('No refresh token')
    }
    
    const data = await request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token })
    })
    
    if (data.data.access_token) {
      localStorage.setItem('access_token', data.data.access_token)
      if (data.data.refresh_token) {
        localStorage.setItem('refresh_token', data.data.refresh_token)
      }
    }
    
    return data.data
  },

  /**
   * 请求密码重置
   * 场景：用户忘记密码，请求发送密码重置邮件
   * 路由：POST /api/auth/password/reset
   */
  async requestPasswordReset(email) {
    const data = await request('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
    return data.data
  },

  /**
   * 确认密码重置
   * 场景：用户点击邮件中的链接，设置新密码
   * 路由：POST /api/auth/password/reset/confirm
   */
  async confirmPasswordReset(token, email, password) {
    const data = await request('/auth/password/reset/confirm', {
      method: 'POST',
      body: JSON.stringify({ token, email, new_password: password })
    })
    return data.data
  },

  // ==================== OAuth 接口 ====================

  /**
   * 获取 GitHub 授权 URL
   * 场景：用户点击 GitHub 登录按钮，获取授权页面地址
   * 路由：GET /api/auth/oauth/github/authorize
   */
  async getGithubAuthUrl() {
    const data = await request('/auth/oauth/github/authorize')
    return data.data.auth_url
  },

  // ==================== 用户接口 ====================

  /**
   * 获取用户信息
   * 场景：获取当前登录用户的详细信息
   * 路由：GET /api/users/profile
   */
  async getProfile() {
    const data = await request('/users/profile')
    return data.data
  },

  /**
   * 更新用户资料
   * 场景：用户修改昵称、头像、个人简介
   * 路由：PUT /api/users/profile
   */
  async updateProfile(profileData) {
    const data = await request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
    return data.data
  },

  /**
   * 修改密码
   * 场景：已登录用户修改登录密码
   * 路由：PUT /api/users/password
   */
  async changePassword(oldPassword, newPassword) {
    const data = await request('/users/password', {
      method: 'PUT',
      body: JSON.stringify({ 
        old_password: oldPassword, 
        new_password: newPassword 
      })
    })
    return data.data
  },

  /**
   * 用户登出
   * 场景：用户退出登录，清除 token
   * 路由：POST /api/users/logout
   */
  async logout() {
    try {
      await request('/users/logout', { method: 'POST' })
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  },

  /**
   * 获取登录日志
   * 场景：用户查看自己的登录历史记录
   * 路由：GET /api/users/login-logs
   */
  async getLoginLogs(page = 1, pageSize = 10) {
    const data = await request(`/users/login-logs?page=${page}&pageSize=${pageSize}`)
    return data.data
  },

  /**
   * GitHub 绑定邮箱（首次登录）
   * 场景：GitHub 登录但未获取到邮箱，需要用户绑定邮箱完成注册
   * 路由：POST /api/users/oauth/github/bind-email
   */
  async bindEmail(params) {
    const data = await request('/users/oauth/github/bind-email', {
      method: 'POST',
      body: JSON.stringify(params)
    })
    
    if (data.data.tokens) {
      localStorage.setItem('access_token', data.data.tokens.access_token)
      localStorage.setItem('refresh_token', data.data.tokens.refresh_token)
    }
    
    return data.data
  },

  /**
   * 获取 OAuth 账号列表
   * 场景：用户查看已绑定的第三方账号（GitHub、微信）
   * 路由：GET /api/users/oauth/accounts
   */
  async getOauthAccounts() {
    const data = await request('/users/oauth/accounts')
    return data.data
  },

  /**
   * 解绑第三方账号
   * 场景：已登录用户解绑 GitHub 或微信账号
   * 路由：POST /api/users/oauth/unbind
   */
  async unbindOAuth(provider) {
    const data = await request('/users/oauth/unbind', {
      method: 'POST',
      body: JSON.stringify({ provider })
    })
    return data.data
  },

  // ==================== 文件预览接口 ====================

  /**
   * 在线预览文件
   * 场景：通过URL在线预览文件
   * 路由：GET /api/filereview/online
   */
  async previewOnline(fileUrl) {
    const data = await request(`/filereview/online?url=${encodeURIComponent(fileUrl)}`, {
      method: 'GET'
    })
    return data.data
  },

  /**
   * 本地预览文件
   * 场景：上传本地文件进行预览，文件会上传到存储并返回URL
   * 路由：POST /api/filereview/local
   */
  async previewLocal(file) {
    const formData = new FormData()
    formData.append('file', file)

    const data = await request('/filereview/local', {
      method: 'POST',
      body: formData,
      headers: {}
    })
    return data.data
  },

  // ==================== 图片处理接口 ====================

  /**
   * 去除图片背景
   * 场景：AI智能去除图片背景
   * 路由：POST /api/image/remove-background
   */
  async removeBackground(file) {
    const formData = new FormData()
    formData.append('file', file)

    const data = await request('/image/remove-background', {
      method: 'POST',
      body: formData,
      headers: {}
    })
    return data.data
  },

  /**
   * 图片抠图（背景透明）
   * 场景：AI智能抠图，使背景透明
   * 路由：POST /api/image/transparent
   */
  async imageTransparent(file) {
    const formData = new FormData()
    formData.append('file', file)

    const data = await request('/image/transparent', {
      method: 'POST',
      body: formData,
      headers: {}
    })
    return data.data
  },

  /**
   * AI智能裁剪图片
   * 场景：AI智能裁剪图片
   * 路由：POST /api/image/crop
   */
  async imageCrop(file, options = {}) {
    const formData = new FormData()
    formData.append('file', file)
    if (options.x) formData.append('x', options.x)
    if (options.y) formData.append('y', options.y)
    if (options.width) formData.append('width', options.width)
    if (options.height) formData.append('height', options.height)

    const data = await request('/image/crop', {
      method: 'POST',
      body: formData,
      headers: {}
    })
    return data.data
  },

  /**
   * 生成证件照
   * 场景：AI生成标准证件照
   * 路由：POST /api/image/photo
   */
  async imagePhoto(file, options = {}) {
    const formData = new FormData()
    formData.append('file', file)
    if (options.bg_color) formData.append('bg_color', options.bg_color)
    if (options.width) formData.append('width', options.width)
    if (options.height) formData.append('height', options.height)

    const data = await request('/image/photo', {
      method: 'POST',
      body: formData,
      headers: {}
    })
    return data.data
  },

  // ==================== AI 接口 ====================

  /**
   * 获取可用的AI模型列表
   * 场景：获取可用的AI绘图模型列表
   * 路由：GET /api/ai/models
   */
  async getAiModels(task) {
    const data = await request(`/ai/models?task=${encodeURIComponent(task)}`)
    return data.data
  },

  /**
   * 文本生成图片
   * 场景：根据文本提示词生成图片
   * 路由：POST /api/ai/text2image
   */
  async text2image(options = {}) {
    const formData = new FormData()
    formData.append('prompt', options.prompt)
    formData.append('model', options.model)
    formData.append('size', options.size || '1024x1024')
    if (options.negative_prompt) {
      formData.append('negative_prompt', options.negative_prompt)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000)

    try {
      const data = await request('/ai/text2image', {
        method: 'POST',
        body: formData,
        headers: {},
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return data.data
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  },

  /**
   * 图生图
   */
  async image2image(options = {}) {
    const formData = new FormData()
    formData.append('prompt', options.prompt)
    formData.append('model', options.model)
    if (options.file) {
      formData.append('file', options.file)
    }
    if (options.negative_prompt) {
      formData.append('negative_prompt', options.negative_prompt)
    }
    if (options.size) {
      formData.append('size', options.size)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000)

    try {
      const data = await request('/ai/image2image', {
        method: 'POST',
        body: formData,
        headers: {},
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return data.data
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  },

  /**
   * 查询任务状态
   */
  async queryTask(taskId) {
    const data = await request(`/ai/query/task?taskId=${encodeURIComponent(taskId)}`, {
      method: 'GET'
    })
    return data.data
  },

  // ==================== 文件上传接口 ====================

  /**
   * 上传文件到存储
   * 场景：上传用户头像、文件等到云存储
   * 路由：POST /api/common/upload
   */
  async uploadFile(file, scene = 'avatar') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('scene', scene)

    const data = await request('/common/upload', {
      method: 'POST',
      body: formData,
      headers: {}
    })
    return data.data
  },

  // ==================== 工具方法 ====================

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  }
}

export default api
