import { ref, computed } from 'vue'
import api from '../utils/api'
import sso from '../utils/sso'

const user = ref(null)
const loading = ref(false)

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)

  const sendVerificationCode = async (email) => {
    loading.value = true
    try {
      const data = await sso.sendVerificationCode(email)
      return data
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    loading.value = true
    try {
      await sso.login(email, password)
      const profile = await api.getProfile()
      user.value = profile
      return profile
    } finally {
      loading.value = false
    }
  }

  const register = async (email, password, nickname, verificationCode) => {
    loading.value = true
    try {
      const data = await sso.register(email, password, nickname, verificationCode)
      return data
    } finally {
      loading.value = false
    }
  }

  const fetchProfile = async () => {
    loading.value = true
    try {
      const data = await api.getProfile()
      user.value = data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await sso.logout()
    } finally {
      user.value = null
      loading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    try {
      const data = await api.updateProfile(profileData)
      user.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (oldPassword, newPassword) => {
    loading.value = true
    try {
      const data = await sso.changePassword(oldPassword, newPassword)
      return data
    } finally {
      loading.value = false
    }
  }

  const requestPasswordReset = async (email) => {
    loading.value = true
    try {
      const data = await sso.requestPasswordReset(email)
      return data
    } finally {
      loading.value = false
    }
  }

  const confirmPasswordReset = async (token, password) => {
    loading.value = true
    try {
      const data = await sso.confirmPasswordReset(token, password)
      return data
    } finally {
      loading.value = false
    }
  }

  const getLoginLogs = async (page, pageSize) => {
    loading.value = true
    try {
      const data = await sso.getLoginLogs(page, pageSize)
      return data
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    sendVerificationCode,
    login,
    register,
    fetchProfile,
    fetchUserInfo: fetchProfile,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    confirmPasswordReset,
    getLoginLogs
  }
}
