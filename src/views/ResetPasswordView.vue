<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">重置密码</h1>
        <p class="mt-2 text-gray-500">{{ step === 1 ? '请输入您的邮箱地址' : '请输入新密码' }}</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm p-8">
        <!-- 步骤1：输入邮箱 -->
        <form v-if="step === 1" @submit.prevent="handleRequestReset">
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
          >
            {{ loading ? '发送中...' : '发送验证码' }}
          </button>
        </form>
        
        <!-- 步骤2：输入新密码 -->
        <form v-else @submit.prevent="handleConfirmReset">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">新密码</label>
            <input
              v-model="password"
              type="password"
              placeholder="请输入新密码"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
            <p class="text-xs text-gray-500 mt-1">密码长度8-20位，需包含大写、小写、数字、特殊符号中至少3种</p>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
          >
            {{ loading ? '处理中...' : '确认重置' }}
          </button>
        </form>
        
        <!-- 错误提示 -->
        <div v-if="error" class="mt-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
          {{ error }}
        </div>
        
        <!-- 成功提示 -->
        <div v-if="success" class="mt-4 bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-sm">
          {{ success }}
        </div>
        
        <!-- 返回登录 -->
        <div class="mt-6 text-center">
          <router-link to="/auth" class="text-blue-600 hover:text-blue-700 text-sm">
            返回登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composable/useAuth'

const router = useRouter()
const route = useRoute()
const { requestPasswordReset, confirmPasswordReset, loading } = useAuth()

const step = ref(1)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

const validatePassword = (pwd) => {
  if (pwd.length < 8 || pwd.length > 20) {
    return '密码长度需在8-20位之间'
  }
  const hasLower = /[a-z]/.test(pwd)
  const hasUpper = /[A-Z]/.test(pwd)
  const hasNumber = /[0-9]/.test(pwd)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
  const types = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length
  if (types < 3) {
    return '密码需包含大写、小写、数字、特殊符号中至少3种'
  }
  return ''
}

const handleRequestReset = async () => {
  error.value = ''
  success.value = ''
  
  try {
    await requestPasswordReset(email.value)
    success.value = '重置链接已发送到您的邮箱，请查收'
    step.value = 2
  } catch (err) {
    error.value = err.message
  }
}

const handleConfirmReset = async () => {
  error.value = ''
  
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }
  
  const pwdError = validatePassword(password.value)
  if (pwdError) {
    error.value = pwdError
    return
  }
  
  const token = route.query.token
  if (!token) {
    error.value = '无效的重置链接'
    return
  }
  
  try {
    await confirmPasswordReset(token, password.value)
    success.value = '密码重置成功，即将跳转到登录页面...'
    setTimeout(() => {
      router.push('/auth')
    }, 2000)
  } catch (err) {
    error.value = err.message
  }
}
</script>
