import axios from 'axios'

const ssoClient = axios.create({
  baseURL: '/sso',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

ssoClient.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data.code !== 0) {
      throw new Error(data.message || '请求失败')
    }
    return data
  },
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      window.location.href = '/auth'
    }
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : error
  }
)

export const sso = {
  // ==================== 用户接口 ====================

  /**
   * 获取用户信息
   * 路由：GET /sso/user/profile
   */
  async getProfile() {
    const res = await ssoClient.get('/user/profile', { skipAuthRedirect: true })
    return res.data
  },

  /**
   * 更新用户资料
   * 路由：PUT /sso/user/profile
   */
  async updateProfile(profileData) {
    const res = await ssoClient.put('/user/profile', profileData)
    return res.data
  },

  // ==================== 认证接口 ====================

  /**
   * 统一授权登录（邮箱）
   * 路由：POST /sso/authorize
   */
  async login(email, password) {
    const res = await ssoClient.post('/authorize', {
      login_type: 'email',
      email,
      password
    })
    return res.data
  },

  /**
   * 统一授权登录（OAuth）
   * 路由：POST /sso/authorize
   */
  async getOAuthUrl(provider = 'github') {
    const res = await ssoClient.post('/authorize', {
      login_type: 'oauth',
      provider
    })
    return res.data?.auth_url
  },

  /**
   * 用户注册
   * 路由：POST /sso/register
   */
  async register(email, password, nickname, verificationCode) {
    const res = await ssoClient.post('/register', {
      email,
      password,
      nickname,
      verification_code: verificationCode
    })
    return res.data
  },

  /**
   * 发送验证码
   * 路由：POST /sso/send-code
   */
  async sendVerificationCode(email) {
    const res = await ssoClient.post('/send-code', { email })
    return res.data
  },

  /**
   * 请求密码重置
   * 路由：POST /sso/password/reset
   */
  async requestPasswordReset(email) {
    const res = await ssoClient.post('/password/reset', { email })
    return res.data
  },

  /**
   * 确认密码重置
   * 路由：POST /sso/password/reset/confirm
   */
  async confirmPasswordReset(token, newPassword) {
    const res = await ssoClient.post('/password/reset/confirm', {
      token,
      new_password: newPassword
    })
    return res.data
  },

  /**
   * 修改密码
   * 路由：POST /sso/user/password/change
   */
  async changePassword(oldPassword, newPassword) {
    const res = await ssoClient.post('/user/password/change', {
      old_password: oldPassword,
      new_password: newPassword
    })
    return res.data
  },

  /**
   * 用户登出
   * 路由：POST /sso/logout
   */
  async logout() {
    await ssoClient.post('/logout')
  },

  /**
   * GitHub 绑定邮箱
   * 路由：POST /sso/oauth/github/bind-email (JSON)
   */
  async bindEmail(params) {
    const res = await ssoClient.post('/oauth/github/bind-email', {
      bind_token: params.bind_token,
      email: params.email,
      email_code: params.email_code,
      password: params.password,
      confirm_password: params.confirm_password
    })
    return res.data
  },

  /**
   * 获取 OAuth 账号列表
   * 路由：GET /sso/user/oauth/accounts
   */
  async getOauthAccounts() {
    const res = await ssoClient.get('/user/oauth/accounts')
    return res.data
  },

  /**
   * 解绑 OAuth 账号
   * 路由：POST /sso/user/oauth/unbind
   */
  async unbindOAuth(provider) {
    const res = await ssoClient.post('/user/oauth/unbind', { provider })
    return res.data
  },

  /**
   * 获取登录日志
   * 路由：GET /sso/user/login/logs
   */
  async getLoginLogs(page = 1, pageSize = 10) {
    const res = await ssoClient.get('/user/login/logs', {
      params: { page, page_size: pageSize }
    })
    return res.data
  }
}

export default sso
