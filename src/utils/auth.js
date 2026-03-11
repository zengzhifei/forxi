const BASE_URL = 'http://localhost:8080/api'

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token')
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)
  const data = await response.json()

  if (data.code !== 0) {
    throw new Error(data.message || '请求失败')
  }

  return data
}

export const authApi = {
  async sendVerificationCode(email) {
    const data = await request('/users/send-code', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
    return data.data
  },

  async register(email, password, nickname, verificationCode) {
    const data = await request('/users/register', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password, 
        nickname,
        verification_code: verificationCode 
      })
    })
    return data.data
  },

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

  async getProfile() {
    const data = await request('/users/profile')
    return data.data
  },

  async updateProfile(profileData) {
    const data = await request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
    return data.data
  },

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
      localStorage.setItem('refresh_token', data.data.refresh_token)
    }
    
    return data.data
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' })
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  },

  async requestPasswordReset(email) {
    const data = await request('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
    return data.data
  },

  async confirmPasswordReset(token, password) {
    const data = await request('/auth/password/reset/confirm', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    })
    return data.data
  },

  async getLoginLogs(page = 1, pageSize = 10) {
    const data = await request(`/auth/login-logs?page=${page}&pageSize=${pageSize}`)
    return data.data
  },

  async getGithubAuthUrl() {
    const data = await request('/oauth/github/authorize')
    if (data.data.state) {
      localStorage.setItem('oauth_state', data.data.state)
    }
    return data.data.auth_url
  },

  getSavedState() {
    return localStorage.getItem('oauth_state')
  },

  clearOAuthState() {
    localStorage.removeItem('oauth_state')
  },

  saveTokens(tokens) {
    if (tokens.access_token) {
      localStorage.setItem('access_token', tokens.access_token)
    }
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token)
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },

  getToken() {
    return localStorage.getItem('access_token')
  }
}

export default authApi
