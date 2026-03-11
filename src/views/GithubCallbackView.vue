<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <svg class="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p class="text-gray-600">正在处理GitHub登录...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authApi from '../utils/auth'

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  const accessToken = route.query.access_token
  const refreshToken = route.query.refresh_token
  const error = route.query.error
  
  console.log('回调参数:', { accessToken: !!accessToken, refreshToken: !!refreshToken, error })
  
  if (error) {
    console.error('GitHub授权失败:', error)
    router.push('/auth?error=github_auth_failed')
    return
  }
  
  if (accessToken) {
    localStorage.setItem('access_token', accessToken)
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    }
    console.log('Tokens已保存')
    
    try {
      const user = await authApi.getProfile()
      console.log('用户信息:', user)
      authApi.clearOAuthState()
      router.push('/')
    } catch (err) {
      console.error('获取用户信息失败:', err)
      router.push('/auth?error=github_login_failed')
    }
  } else {
    console.error('没有access_token')
    router.push('/auth')
  }
})
</script>
