<template>
  <div class="min-h-screen flex bg-[#fafafa]">
    <!-- 左侧装饰区 -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden" :style="{ height: '100vh', position: 'fixed', left: 0, top: 0, background: 'linear-gradient(135deg, #f5f5f7 0%, #ffffff 50%, #fafafa 100%)' }">
      <!-- 背景光晕 -->
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
          <span class="block" style="font-size: 0.9rem; letter-spacing: 0.35em; color: #a1a1aa; font-weight: 400; margin-bottom: 0.5rem;">{{ activeTab === 'login' ? '山水一程' : '与君初相识' }}</span>
          <span class="block" style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 35%, #71717a 65%, #52525b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 500; letter-spacing: 0.15em;">{{ activeTab === 'login' ? '再度相逢。' : '犹如故人归。' }}</span>
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
        <!-- 移动端 Logo -->
        <div class="lg:hidden flex flex-col items-center mb-8">
          <div class="flex items-center mb-5">
            <img src="/logo.svg" alt="Forxi" class="h-9 w-9" />
            <span class="ml-2 text-xl font-semibold text-zinc-700">Forxi</span>
          </div>
        </div>

        <div class="text-center mb-8">
          <h2 class="text-2xl sm:text-3xl font-semibold text-zinc-700">
            {{ activeTab === 'login' ? '欢迎回来' : '创建账号' }}
          </h2>
          <p class="lg:hidden mt-2 text-zinc-400 text-sm">
            {{ activeTab === 'login' ? '山水一程，再度相逢。' : '与君初相识，犹如故人归。' }}
          </p>
        </div>

        <!-- 标签切换 -->
        <div class="flex p-1 bg-zinc-100 rounded-xl mb-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="switchTab(tab.id)"
            class="flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200"
            :class="activeTab === tab.id
              ? 'bg-white text-zinc-700 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-600'"
          >
            {{ tab.name }}
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- 注册：昵称 -->
          <template v-if="activeTab === 'register'">
            <div>
              <label class="block text-sm font-medium text-zinc-600 mb-2">昵称</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  v-model="form.nickname"
                  type="text"
                  placeholder="请输入昵称"
                  class="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>
          </template>

          <!-- 邮箱 -->
          <div>
            <label class="block text-sm font-medium text-zinc-600 mb-2">邮箱</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                class="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <!-- 密码 -->
          <div>
            <label class="block text-sm font-medium text-zinc-600 mb-2">密码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="w-full pl-12 pr-14 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:bg-white transition-all"
                required
                @focus="showPasswordRules = true"
                @blur="showPasswordRules = false"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors"
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
            <div v-if="activeTab === 'register' && form.password" class="mt-2">
              <div class="flex gap-1 mb-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors"
                  :class="i <= passwordStrength.level ? passwordStrength.color : 'bg-zinc-100'"
                ></div>
              </div>
              <p class="text-xs" :class="{
                'text-red-400': passwordStrength.level === 1,
                'text-yellow-500': passwordStrength.level === 2,
                'text-emerald-500': passwordStrength.level >= 3
              }">{{ passwordStrength.text }}</p>
            </div>
            <!-- 密码规则提示 -->
            <div v-if="showPasswordRules && activeTab === 'register'" class="mt-2 p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
              <p class="text-xs text-zinc-400 mb-2">密码要求：{{ PASSWORD_RULES.description }}</p>
              <div class="flex flex-wrap gap-2">
                <span class="text-xs px-2 py-0.5 rounded" :class="form.password.length >= 8 && form.password.length <= 20 ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'">8-20位</span>
                <span class="text-xs px-2 py-0.5 rounded" :class="/[A-Z]/.test(form.password) ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'">大写字母</span>
                <span class="text-xs px-2 py-0.5 rounded" :class="/[a-z]/.test(form.password) ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'">小写字母</span>
                <span class="text-xs px-2 py-0.5 rounded" :class="/[0-9]/.test(form.password) ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'">数字</span>
                <span class="text-xs px-2 py-0.5 rounded" :class="/[^a-zA-Z0-9]/.test(form.password) ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'">特殊符号</span>
              </div>
            </div>
          </div>

          <!-- 验证码（注册时显示） -->
          <div v-if="activeTab === 'register'">
            <label class="block text-sm font-medium text-zinc-600 mb-2">验证码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                v-model="form.verificationCode"
                type="text"
                placeholder="请输入6位验证码"
                maxlength="6"
                class="w-full pl-12 pr-28 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                @click="handleSendCode"
                :disabled="countdown > 0"
                class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-700 disabled:text-zinc-300 disabled:cursor-not-allowed transition-colors"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
            </div>
          </div>

          <!-- 忘记密码（登录时显示） -->
          <div v-if="activeTab === 'login'" class="flex items-center justify-end">
            <router-link to="/reset-password" class="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
              忘记密码？
            </router-link>
          </div>

          <!-- 提交按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 px-4 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-zinc-300/40 hover:scale-[1.01]"
            style="background: linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #52525b 100%)"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? '处理中...' : (activeTab === 'login' ? '登 录' : '注 册') }}
          </button>

          <!-- 错误提示 -->
          <div v-if="error" class="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ error }}
          </div>
        </form>

        <!-- GitHub 登录 -->
        <div class="mt-6 pt-6 border-t border-zinc-100">
          <p class="text-center text-sm text-zinc-400 mb-4">或使用第三方登录</p>
          <button
            @click="handleGithubLogin"
            class="w-full py-3.5 px-4 bg-zinc-50 border border-zinc-200 text-zinc-600 font-medium rounded-xl hover:bg-zinc-100 hover:border-zinc-300 focus:outline-none transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg class="h-5 w-5 text-zinc-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub 快捷登录
          </button>
        </div>

        <p class="text-center mt-6 text-xs text-zinc-300">
          登录即表示同意我们的
          <a href="#" class="text-zinc-400 hover:text-zinc-600 transition-colors">服务条款</a>
          和
          <a href="#" class="text-zinc-400 hover:text-zinc-600 transition-colors">隐私政策</a>
        </p>

        <!-- 暂不登录 -->
        <div class="mt-6 pt-5 border-t border-zinc-100">
          <button
            @click="$router.push('/')"
            class="w-full py-3 text-zinc-400 hover:text-zinc-600 text-sm transition-colors"
          >
            {{ activeTab === 'login' ? '暂不登录，直接使用' : '暂不注册，直接使用' }} →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composable/useAuth'
import api from '../utils/api'
import { validatePassword, PASSWORD_RULES, getPasswordStrength } from '../utils/validate'

const router = useRouter()
const route = useRoute()
const { login, register, sendVerificationCode, loading } = useAuth()

const handleGithubLogin = async () => {
  try {
    const authUrl = await api.getGithubAuthUrl()
    if (authUrl) {
      window.location.href = authUrl
    } else {
      error.value = '获取授权链接失败'
    }
  } catch (err) {
    error.value = '获取GitHub授权链接失败: ' + err.message
  }
}

const tabs = [
  { id: 'login', name: '登录' },
  { id: 'register', name: '注册' }
]

const activeTab = ref('login')
const showPassword = ref(false)
const showPasswordRules = ref(false)
const error = ref('')
const countdown = ref(0)

const passwordStrength = computed(() => getPasswordStrength(form.password))

let countdownTimer = null

const form = reactive({
  email: '',
  password: '',
  nickname: '',
  verificationCode: ''
})

onMounted(() => {
  if (route.query.type === 'register') {
    activeTab.value = 'register'
  } else if (route.query.type === 'login') {
    activeTab.value = 'login'
  }
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})

const switchTab = (tabId) => {
  activeTab.value = tabId
  error.value = ''
}

const handleSendCode = async () => {
  if (!form.email) {
    error.value = '请先输入邮箱地址'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    error.value = '请输入有效的邮箱地址'
    return
  }

  error.value = ''

  try {
    await sendVerificationCode(form.email)
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer)
      }
    }, 1000)
  } catch (err) {
    error.value = err.message
  }
}

const handleSubmit = async () => {
  error.value = ''

  try {
    if (activeTab.value === 'login') {
      await login(form.email, form.password)
      router.push('/')
    } else {
      if (!form.nickname) {
        error.value = '请输入昵称'
        return
      }
      if (!form.verificationCode) {
        error.value = '请输入验证码'
        return
      }
      if (form.verificationCode.length !== 6) {
        error.value = '请输入6位验证码'
        return
      }
      const pwdValidation = validatePassword(form.password)
      if (!pwdValidation.valid) {
        error.value = pwdValidation.message
        return
      }

      await register(form.email, form.password, form.nickname, form.verificationCode)
      activeTab.value = 'login'
      error.value = '注册成功，请登录'
      form.password = ''
      form.verificationCode = ''
    }
  } catch (err) {
    error.value = err.message
  }
}
</script>
