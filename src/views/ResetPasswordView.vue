<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- 左侧装饰区 -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden" :style="{ height: '100vh', position: 'fixed', left: 0, top: 0, background: 'linear-gradient(135deg, #f5f5f7 0%, #ffffff 50%, #fafafa 100%)' }">
      <div class="absolute inset-0">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-50" style="background: radial-gradient(circle, rgba(161,161,170,0.2) 0%, transparent 70%);"></div>
        <div class="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-40" style="background: radial-gradient(circle, rgba(113,113,122,0.15) 0%, transparent 70%);"></div>
      </div>

      <div class="relative z-10 flex flex-col justify-center items-center px-12 xl:px-20 w-full text-center">
        <router-link to="/" class="flex items-center mb-16">
          <img src="/logo.svg" alt="Forxi" class="h-10 w-10" />
          <span class="ml-3 text-2xl font-semibold text-zinc-700">Forxi</span>
        </router-link>

        <!-- 装饰线 -->
        <div class="flex items-center gap-4 mb-8">
          <div class="h-px w-10 bg-gradient-to-r from-transparent to-zinc-300"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
          <div class="h-px w-10 bg-gradient-to-l from-transparent to-zinc-300"></div>
        </div>

        <h1 class="font-serif leading-loose mb-4" style="font-size: clamp(1.6rem, 2.5vw, 2.2rem);">
          <span class="block" style="font-size: 0.9rem; letter-spacing: 0.35em; color: #a1a1aa; font-weight: 400; margin-bottom: 0.5rem;">旧忆未散</span>
          <span class="block" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 35%, #71717a 65%, #52525b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 500; letter-spacing: 0.15em;">归途可寻。</span>
        </h1>

        <div class="flex items-center gap-4 mt-6 mb-12">
          <div class="h-px w-6 bg-gradient-to-r from-transparent to-zinc-200"></div>
          <div class="w-1 h-1 rounded-full bg-zinc-200"></div>
          <div class="h-px w-16 bg-zinc-200"></div>
          <div class="w-1 h-1 rounded-full bg-zinc-200"></div>
          <div class="h-px w-6 bg-gradient-to-l from-transparent to-zinc-200"></div>
        </div>
      </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-12 bg-white lg:ml-[50%]" :style="{ minHeight: '100vh' }">
      <div class="w-full max-w-md">
        <!-- 移动端Logo -->
        <div class="lg:hidden flex flex-col items-center mb-8">
          <div class="flex items-center mb-5">
            <img src="/logo.svg" alt="Forxi" class="h-9 w-9" />
            <span class="ml-2 text-xl font-semibold text-zinc-700">Forxi</span>
          </div>
        </div>

        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="h-8 w-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-semibold text-zinc-700">
            {{ step === 'email' ? '找回密码' : '重置密码' }}
          </h2>
          <p class="mt-2 text-zinc-400 text-sm">
            {{ step === 'email' ? '旧忆未散，归途可寻。' : '设置新的登录密码' }}
          </p>
        </div>

        <!-- 步骤1：输入邮箱 -->
        <form v-if="step === 'email'" @submit.prevent="handleSendResetEmail" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-300/50 focus:border-zinc-400 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 px-4 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? '发送中...' : '发送重置邮件' }}
          </button>

          <!-- 错误提示 -->
          <div v-if="error" class="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ error }}
          </div>

          <!-- 成功提示 -->
          <div v-if="successMessage" class="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ successMessage }}
          </div>

          <div class="mt-6 pt-5 border-t border-zinc-100">
            <router-link
              to="/auth"
              class="w-full py-3 text-zinc-400 hover:text-zinc-600 text-sm transition-colors flex items-center justify-center"
            >
              ← 返回登录
            </router-link>
          </div>
        </form>

        <!-- 步骤2：重置密码 -->
        <form v-else-if="step === 'reset'" @submit.prevent="handleResetPassword" class="space-y-5">
          <!-- 显示邮箱 -->
          <div v-if="form.email" class="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <svg class="h-5 w-5 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="text-sm text-zinc-600">重置账号：{{ form.email }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">新密码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                v-model="form.newPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入新密码"
                class="w-full pl-12 pr-14 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-300/50 focus:border-zinc-400 focus:bg-white transition-all"
                required
                @focus="showPasswordRules = true"
                @blur="showPasswordRules = false"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            <div v-if="form.newPassword" class="mt-2">
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
                <span class="text-xs px-2 py-0.5 rounded" :class="form.newPassword.length >= 8 && form.newPassword.length <= 20 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">8-20位</span>
                <span class="text-xs px-2 py-0.5 rounded" :class="/[A-Z]/.test(form.newPassword) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">大写字母</span>
                <span class="text-xs px-2 py-0.5 rounded" :class="/[a-z]/.test(form.newPassword) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">小写字母</span>
                <span class="text-xs px-2 py-0.5 rounded" :class="/[0-9]/.test(form.newPassword) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">数字</span>
                <span class="text-xs px-2 py-0.5 rounded" :class="/[^a-zA-Z0-9]/.test(form.newPassword) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">特殊符号</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="请再次输入新密码"
                class="w-full pl-12 pr-14 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-300/50 focus:border-zinc-400 focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 px-4 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? '处理中...' : '重置密码' }}
          </button>

          <!-- 错误提示 -->
          <div v-if="error" class="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ error }}
          </div>

          <!-- 成功提示 -->
          <div v-if="successMessage" class="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ successMessage }}
          </div>

          <div class="mt-6 pt-5 border-t border-zinc-100">
            <router-link
              to="/auth"
              class="w-full py-3 text-zinc-400 hover:text-zinc-600 text-sm transition-colors flex items-center justify-center"
            >
              ← 返回登录
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import sso from '../utils/sso'
import { validatePassword, PASSWORD_RULES, getPasswordStrength } from '../utils/validate'

const router = useRouter()
const route = useRoute()

const step = ref('email')
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showPasswordRules = ref(false)

const passwordStrength = computed(() => getPasswordStrength(form.newPassword))

const form = reactive({
  email: '',
  token: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  if (route.query.token && route.query.email) {
    step.value = 'reset'
    form.token = route.query.token
    form.email = route.query.email
  }
})

const handleSendResetEmail = async () => {
  error.value = ''
  successMessage.value = ''
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    error.value = '请输入有效的邮箱地址'
    return
  }
  
  loading.value = true
  
  try {
    await sso.requestPasswordReset(form.email)
    successMessage.value = '如果邮箱存在，我们将发送重置链接到您的邮箱'
    setTimeout(() => {
      router.push('/auth')
    }, 3000)
  } catch (err) {
    error.value = err.message || '发送失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  error.value = ''
  
  const pwdValidation = validatePassword(form.newPassword)
  if (!pwdValidation.valid) {
    error.value = pwdValidation.message
    return
  }
  
  if (form.newPassword !== form.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }
  
  loading.value = true
  
  try {
    await sso.confirmPasswordReset(form.token, form.newPassword)
    successMessage.value = '密码重置成功！正在跳转到登录页面...'
    setTimeout(() => {
      router.push('/auth')
    }, 2000)
  } catch (err) {
    error.value = err.message || '重置失败，请检查链接是否有效'
  } finally {
    loading.value = false
  }
}
</script>
