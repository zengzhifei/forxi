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
    if (error.response?.status === 401) {
      window.location.href = '/auth'
    }
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : error
  }
)

export const sso = {
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
   * 路由：POST /sso/user/register
   */
  async register(email, password, nickname, verificationCode) {
    const res = await ssoClient.post('/user/register', {
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
   * 路由：POST /sso/password/change
   */
  async changePassword(oldPassword, newPassword) {
    const res = await ssoClient.post('/password/change', {
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
   * 路由：POST /sso/oauth/github/bind-email (Form Data)
   */
  async bindEmail(params) {
    const formData = new URLSearchParams()
    formData.append('bind_token', params.bind_token)
    formData.append('email', params.email)
    formData.append('email_code', params.email_code)
    formData.append('password', params.password)
    formData.append('confirm_password', params.confirm_password)
    if (params.nickname) {
      formData.append('nickname', params.nickname)
    }

    const res = await ssoClient.post('/oauth/github/bind-email', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    return res.data
  },

  /**
   * 获取 OAuth 账号列表
   * 路由：GET /sso/oauth/accounts
   */
  async getOauthAccounts() {
    const res = await ssoClient.get('/oauth/accounts')
    return res.data
  },

  /**
   * 解绑 OAuth 账号
   * 路由：POST /sso/oauth/unbind
   */
  async unbindOAuth(provider) {
    const res = await ssoClient.post('/oauth/unbind', { provider })
    return res.data
  },

  /**
   * 获取登录日志
   * 路由：GET /sso/login/logs
   */
  async getLoginLogs(page = 1, pageSize = 10) {
    const res = await ssoClient.get('/login/logs', {
      params: { page, page_size: pageSize }
    })
    return res.data
  }
}

export default sso
