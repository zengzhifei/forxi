<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <div class="max-w-4xl mx-auto py-8 px-4">
      <h1 class="text-2xl font-bold text-gray-900 mb-8">个人中心</h1>
      
      <!-- 用户信息卡片 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex items-center gap-4 mb-6">
          <img
            v-if="currentAvatar"
            :src="currentAvatar"
            class="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            @error="handleAvatarError"
          />
          <div v-else class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {{ userInfo.nickname?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ userInfo.nickname }}</h2>
            <p class="text-gray-500">{{ userInfo.email }}</p>
            <span 
              class="inline-block mt-1 px-2 py-0.5 text-xs rounded-full"
              :class="{
                'bg-green-100 text-green-700': userInfo.role === 'user',
                'bg-blue-100 text-blue-700': userInfo.role === 'admin',
                'bg-purple-100 text-purple-700': userInfo.role === 'super_admin'
              }"
            >
              {{ userInfo.role === 'user' ? '普通用户' : userInfo.role === 'admin' ? '管理员' : '超级管理员' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 标签页 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-6 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- 基本资料 -->
        <div v-if="activeTab === 'profile'" class="p-6">
          <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">昵称</label>
              <input
                v-model="profileForm.nickname"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入昵称"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">头像</label>
              <div class="flex items-center gap-4">
                <div class="relative cursor-pointer" @click="triggerFileInput">
                  <img 
                    v-if="currentAvatar" 
                    :src="currentAvatar" 
                    class="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    @error="handleAvatarError"
                  />
                  <div v-else class="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {{ userInitial }}
                  </div>
                  <div class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-gray-500">支持 JPG、PNG、GIF、WebP 格式，最大 2MB</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  class="hidden" 
                  ref="fileInput"
                  @change="handleAvatarUpload"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
              <textarea
                v-model="profileForm.bio"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="介绍一下你自己..."
                maxlength="500"
              ></textarea>
              <p class="mt-1 text-xs text-gray-500">{{ profileForm.bio?.length || 0 }}/500</p>
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading ? '保存中...' : '保存修改' }}
            </button>
          </form>
        </div>

        <!-- 修改密码 -->
        <div v-if="activeTab === 'password'" class="p-6">
          <form @submit.prevent="handleChangePassword" class="space-y-6 max-w-md">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
              <div class="relative">
                <input
                  v-model="passwordForm.oldPassword"
                  :type="showOldPassword ? 'text' : 'password'"
                  class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入当前密码"
                  required
                />
                <button
                  type="button"
                  @click="showOldPassword = !showOldPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="!showOldPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">新密码</label>
              <div class="relative">
                <input
                  v-model="passwordForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入新密码"
                  required
                  @focus="showPasswordRules = true"
                  @blur="showPasswordRules = false"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <!-- 密码强度 -->
              <div v-if="passwordForm.newPassword" class="mt-2">
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
                  <span class="text-xs px-2 py-0.5 rounded" :class="passwordForm.newPassword.length >= 8 && passwordForm.newPassword.length <= 20 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">8-20位</span>
                  <span class="text-xs px-2 py-0.5 rounded" :class="/[A-Z]/.test(passwordForm.newPassword) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">大写字母</span>
                  <span class="text-xs px-2 py-0.5 rounded" :class="/[a-z]/.test(passwordForm.newPassword) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">小写字母</span>
                  <span class="text-xs px-2 py-0.5 rounded" :class="/[0-9]/.test(passwordForm.newPassword) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">数字</span>
                  <span class="text-xs px-2 py-0.5 rounded" :class="/[^a-zA-Z0-9]/.test(passwordForm.newPassword) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">特殊符号</span>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
              <div class="relative">
                <input
                  v-model="passwordForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请再次输入新密码"
                  required
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
            <button
              type="submit"
              :disabled="loading || passwordForm.newPassword !== passwordForm.confirmPassword"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading ? '修改中...' : '修改密码' }}
            </button>
          </form>
        </div>

        <!-- 第三方账号绑定 -->
        <div v-if="activeTab === 'oauth'" class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-start gap-3 group relative">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <div>
                  <div class="font-medium text-gray-900">GitHub</div>
                  <div class="text-sm text-gray-500">
                    {{ oauthAccounts.some(a => a.provider === 'github') ? '已绑定' : '未绑定' }}
                  </div>
                </div>
                <div v-if="githubAccount" class="absolute left-full top-0 ml-2 p-3 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                  <div class="font-medium">{{ githubAccount.name }}</div>
                  <a v-if="githubAccount.html_url" :href="githubAccount.html_url" target="_blank" class="text-blue-300 hover:text-blue-200" @click.stop>主页</a>
                </div>
              </div>
              <button
                v-if="!oauthAccounts.some(a => a.provider === 'github')"
                @click="handleBindGithub"
                class="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
              >
                绑定
              </button>
              <button
                v-else
                @click="handleUnbindGithub"
                class="px-4 py-2 text-red-600 text-sm hover:text-red-700"
              >
                解绑
              </button>
            </div>
          </div>
        </div>

        <!-- 登录日志 -->
        <div v-if="activeTab === 'logs'" class="p-6">
          <div v-if="loginLogs.length === 0" class="text-center py-8 text-gray-500">
            暂无登录记录
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(log, index) in loginLogs"
              :key="index"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="log.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
                >
                  <svg v-if="log.status === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ log.login_method === 'email' ? '邮箱登录' : 'GitHub 登录' }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ log.ip_address }} · {{ log.device_type }} · {{ formatDate(log.login_at) }}
                  </div>
                </div>
              </div>
              <span 
                class="px-2 py-1 text-xs rounded-full"
                :class="log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ log.status === 'success' ? '成功' : '失败' }}
              </span>
            </div>
          </div>
          
          <!-- 分页 -->
          <div v-if="logsMeta.total > logsMeta.pageSize" class="flex justify-center mt-6 gap-2">
            <button
              @click="fetchLoginLogs(logsMeta.page - 1)"
              :disabled="logsMeta.page <= 1"
              class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              上一页
            </button>
            <span class="px-4 py-2 text-gray-600">
              {{ logsMeta.page }} / {{ logsMeta.totalPages }}
            </span>
            <button
              @click="fetchLoginLogs(logsMeta.page + 1)"
              :disabled="logsMeta.page >= logsMeta.totalPages"
              class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composable/useAuth'
import api from '../utils/api'
import { validatePassword, PASSWORD_RULES, getPasswordStrength } from '../utils/validate'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const toast = inject('toast')
const confirm = inject('confirm')
const { user, fetchUserInfo, loading: authLoading } = useAuth()
const route = useRoute()

const activeTab = ref('profile')

const updateHash = () => {
  if (location.hash) {
    activeTab.value = location.hash.slice(1)
  }
}

onMounted(async () => {
  updateHash()
  window.addEventListener('hashchange', updateHash)
  await fetchUserInfo()
  if (user.value) {
    userInfo.value = { ...user.value }
    profileForm.nickname = user.value.nickname || ''
    profileForm.avatar = user.value.avatar ? user.value.avatar.trim() : ''
    profileForm.bio = user.value.bio || ''
  }
  await fetchOauthAccounts()
  await fetchLoginLogs(1)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updateHash)
})

watch(activeTab, (val) => {
  if (val !== 'profile') {
    location.hash = val
  } else {
    history.replaceState(null, '', location.pathname)
  }
})

const loading = ref(false)
const uploading = ref(false)
const fileInput = ref(null)

const tabs = [
  { id: 'profile', name: '基本资料' },
  { id: 'password', name: '修改密码' },
  { id: 'oauth', name: '账号绑定' },
  { id: 'logs', name: '登录日志' }
]

const userInfo = ref({
  user_id: '',
  email: '',
  nickname: '',
  avatar: '',
  bio: '',
  role: 'user',
  email_verified: false,
  status: 'active'
})

const profileForm = reactive({
  nickname: '',
  avatar: '',
  bio: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const showPasswordRules = ref(false)

const currentAvatar = computed(() => {
  const avatar = profileForm.avatar || user.value?.avatar || ''
  return avatar.trim().replace(/`/g, '')
})

const passwordStrength = computed(() => getPasswordStrength(passwordForm.newPassword))

const userInitial = computed(() => {
  const nickname = profileForm.nickname || user.value?.nickname || ''
  if (nickname) return nickname.charAt(0).toUpperCase()
  const email = user.value?.email || ''
  if (email) return email.charAt(0).toUpperCase()
  return '?'
})

const handleAvatarError = (e) => {
  e.target.style.display = 'none'
}

const oauthAccounts = ref([])

const githubAccount = computed(() => oauthAccounts.value.find(a => a.provider === 'github'))

const loginLogs = ref([])
const logsMeta = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

const fetchOauthAccounts = async () => {
  try {
    const res = await api.getOauthAccounts()
    oauthAccounts.value = Array.isArray(res) ? res : (res.data || [])
  } catch (err) {
    console.error('获取OAuth账号失败:', err)
  }
}

const fetchLoginLogs = async (page) => {
  try {
    const res = await api.getLoginLogs(page, logsMeta.value.pageSize)
    const logs = Array.isArray(res) ? res : (res.data || [])
    loginLogs.value = logs
    logsMeta.value = { page, pageSize: logsMeta.value.pageSize, total: logs.length, totalPages: 1 }
  } catch (err) {
    console.error('获取登录日志失败:', err)
  }
}

const handleUpdateProfile = async () => {
  loading.value = true
  try {
    await api.updateProfile({
      nickname: profileForm.nickname,
      avatar: profileForm.avatar,
      bio: profileForm.bio
    })
    await fetchUserInfo()
    userInfo.value = { ...user.value }
    toast.success('资料更新成功')
  } catch (err) {
    toast.error(err.message || '更新失败')
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error('两次输入的密码不一致')
    return
  }
  
  const pwdValidation = validatePassword(passwordForm.newPassword)
  if (!pwdValidation.valid) {
    toast.error(pwdValidation.message)
    return
  }
  
  loading.value = true
  try {
    await api.changePassword(passwordForm.oldPassword, passwordForm.newPassword)
    toast.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (err) {
    toast.error(err.message || '修改失败')
  } finally {
    loading.value = false
  }
}

const handleBindGithub = async () => {
  try {
    const authUrl = await api.getGithubAuthUrl()
    if (authUrl) {
      window.location.href = authUrl
    }
  } catch (err) {
    toast.error('获取授权链接失败')
  }
}

const handleUnbindGithub = async () => {
  const ok = await confirm.show('确定要解绑GitHub账号吗？解绑后将无法通过GitHub登录。', '确认解绑', '取消', '确认解绑')
  if (!ok) return
  
  try {
    await api.unbindOAuth('github')
    toast.success('解绑成功')
    fetchOauthAccounts()
  } catch (err) {
    toast.error(err.message || '解绑失败')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 验证文件大小
  if (file.size > 2 * 1024 * 1024) {
    toast.error('文件大小不能超过2MB')
    return
  }
  
  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    toast.error('只支持 JPG、PNG、GIF、WebP 格式')
    return
  }
  
  uploading.value = true
  try {
    // 上传文件获取URL
    const uploadResult = await api.uploadFile(file, 'avatar')
    if (uploadResult?.url) {
      // 只更新表单，不自动保存到服务器
      profileForm.avatar = uploadResult.url
      // 不显示提示信息，直接显示新头像
    }
  } catch (err) {
    toast.error(err.message || '上传失败')
  } finally {
    uploading.value = false
    // 清除文件输入
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>
