import { ref, computed } from 'vue'
import authApi from '../utils/auth'

const user = ref(null)
const loading = ref(false)

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)
  
  const sendVerificationCode = async (email) => {
    loading.value = true
    try {
      const data = await authApi.sendVerificationCode(email)
      return data
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    loading.value = true
    try {
      const data = await authApi.login(email, password)
      user.value = data.user
      return data
    } finally {
      loading.value = false
    }
  }

  const register = async (email, password, nickname, verificationCode) => {
    loading.value = true
    try {
      const data = await authApi.register(email, password, nickname, verificationCode)
      return data
    } finally {
      loading.value = false
    }
  }

  const fetchProfile = async () => {
    if (!authApi.isAuthenticated()) {
      user.value = null
      return
    }
    
    loading.value = true
    try {
      const data = await authApi.getProfile()
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
      await authApi.logout()
    } finally {
      user.value = null
      loading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    try {
      const data = await authApi.updateProfile(profileData)
      user.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (oldPassword, newPassword) => {
    loading.value = true
    try {
      const data = await authApi.changePassword(oldPassword, newPassword)
      return data
    } finally {
      loading.value = false
    }
  }

  const requestPasswordReset = async (email) => {
    loading.value = true
    try {
      const data = await authApi.requestPasswordReset(email)
      return data
    } finally {
      loading.value = false
    }
  }

  const confirmPasswordReset = async (token, password) => {
    loading.value = true
    try {
      const data = await authApi.confirmPasswordReset(token, password)
      return data
    } finally {
      loading.value = false
    }
  }

  const getLoginLogs = async (page, pageSize) => {
    loading.value = true
    try {
      const data = await authApi.getLoginLogs(page, pageSize)
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
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    confirmPasswordReset,
    getLoginLogs
  }
}
