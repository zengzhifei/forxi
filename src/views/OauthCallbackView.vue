<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <svg class="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p class="text-gray-600">正在处理{{ providerName }}登录...</p>
    </div>

    <!-- 需要绑定邮箱 -->
    <div v-else-if="needsEmailBind" class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
      <div class="text-center mb-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">绑定邮箱</h2>
        <p class="text-gray-500 mt-2">为了完成账号绑定，请完善以下信息</p>
      </div>

      <form @submit.prevent="handleBindEmail" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
          <div class="flex gap-2">
            <input
              v-model="email"
              type="email"
              required
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入邮箱地址"
            />
            <button
              type="button"
              @click="sendEmailCode"
              :disabled="sendingCode || countdown > 0"
              class="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
          <input
            v-model="emailCode"
            type="text"
            required
            maxlength="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入6位验证码"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">登录密码</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入密码"
              @focus="showPasswordRules = true"
              @blur="showPasswordRules = false"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          <!-- 密码强度 -->
          <div v-if="password" class="mt-2">
            <div class="flex gap-1 mb-1">
              <div 
                v-for="i in 4" 
                :key="i" 
                class="h-1 flex-1 rounded-full transition-colors"
                :class="i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200'"
              ></div>
            </div>
            <p class="text-xs" :class="{
              'text-red-500': passwordStrength.level === 1,
              'text-yellow-500': passwordStrength.level === 2,
              'text-green-500': passwordStrength.level >= 3
            }">{{ passwordStrength.text }}</p>
          </div>
          <!-- 密码规则提示 -->
          <div v-if="showPasswordRules" class="mt-2 p-3 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-500 mb-1">密码要求：{{ PASSWORD_RULES.description }}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <span class="text-xs px-2 py-0.5 rounded" :class="password.length >= 8 && password.length <= 20 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">8-20位</span>
              <span class="text-xs px-2 py-0.5 rounded" :class="/[A-Z]/.test(password) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">大写字母</span>
              <span class="text-xs px-2 py-0.5 rounded" :class="/[a-z]/.test(password) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">小写字母</span>
              <span class="text-xs px-2 py-0.5 rounded" :class="/[0-9]/.test(password) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">数字</span>
              <span class="text-xs px-2 py-0.5 rounded" :class="/[^a-zA-Z0-9]/.test(password) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">特殊符号</span>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请再次输入密码"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="bindError" class="text-red-500 text-sm text-center">
          {{ bindError }}
        </div>

        <button
          type="submit"
          :disabled="binding"
          class="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {{ binding ? '绑定中...' : '确认绑定' }}
        </button>
      </form>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <p class="text-red-600">{{ errorMessage }}</p>
      <button
        @click="router.push('/auth')"
        class="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        返回登录
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import sso from '../utils/sso'
import { validatePassword, PASSWORD_RULES, getPasswordStrength } from '../utils/validate'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const needsEmailBind = ref(false)
const error = ref(false)
const errorMessage = ref('')

const bindToken = ref('')
const email = ref('')
const emailCode = ref('')
const password = ref('')
const confirmPassword = ref('')
const binding = ref(false)
const bindError = ref('')
const sendingCode = ref(false)
const countdown = ref(0)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showPasswordRules = ref(false)

const passwordStrength = computed(() => getPasswordStrength(password.value))

const providerName = 'GitHub'

onMounted(async () => {
  const errorParam = route.query.error
  const needsBind = route.query.needs_email_bind
  bindToken.value = route.query.bind_token || ''

  if (errorParam) {
    error.value = true
    errorMessage.value = '授权失败'
    loading.value = false
    return
  }

  if (needsBind === 'true' && bindToken.value) {
    needsEmailBind.value = true
    loading.value = false
    return
  }

  // Cookie已由服务端设置，直接验证登录状态
  try {
    await sso.getProfile()

    const from = route.query.from
    if (from === 'bind') {
      router.push('/profile')
    } else {
      router.push('/')
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
    error.value = true
    errorMessage.value = '登录状态验证失败'
    loading.value = false
  }
})

const handleBindEmail = async () => {
  if (!email.value) {
    bindError.value = '请输入邮箱地址'
    return
  }
  if (!emailCode.value) {
    bindError.value = '请输入验证码'
    return
  }
  if (emailCode.value.length !== 6) {
    bindError.value = '验证码格式错误'
    return
  }
  
  const pwdValidation = validatePassword(password.value)
  if (!pwdValidation.valid) {
    bindError.value = pwdValidation.message
    return
  }
  
  if (password.value !== confirmPassword.value) {
    bindError.value = '两次密码输入不一致'
    return
  }

  binding.value = true
  bindError.value = ''

  try {
    await sso.bindEmail({
      bind_token: bindToken.value,
      email: email.value,
      email_code: emailCode.value,
      password: password.value,
      confirm_password: confirmPassword.value
    })

    router.push('/')
  } catch (err) {
    bindError.value = err.message || '绑定失败，请重试'
  } finally {
    binding.value = false
  }
}

const sendEmailCode = async () => {
  if (!email.value) {
    bindError.value = '请先输入邮箱地址'
    return
  }

  sendingCode.value = true
  bindError.value = ''

  try {
    await sso.sendVerificationCode(email.value)
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (err) {
    bindError.value = err.message || '发送失败，请重试'
  } finally {
    sendingCode.value = false
  }
}
</script>
