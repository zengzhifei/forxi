<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-8">用户中心</h1>
      
      <div class="space-y-6">
        <!-- 用户信息 -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {{ userInitial }}
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ user?.nickname || '未设置昵称' }}</p>
              <p class="text-sm text-gray-500">{{ user?.email }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">昵称</label>
              <input
                v-model="profileForm.nickname"
                type="text"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
              <input
                v-model="profileForm.bio"
                type="text"
                placeholder="介绍一下自己"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            @click="handleUpdateProfile"
            :disabled="loading"
            class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {{ loading ? '保存中...' : '保存修改' }}
          </button>
        </div>
        
        <!-- 修改密码 -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">修改密码</h2>
          
          <div class="space-y-4 max-w-md">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
              <input
                v-model="passwordForm.oldPassword"
                type="password"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">密码长度8-20位，需包含大写、小写、数字、特殊符号中至少3种</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              @click="handleChangePassword"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {{ loading ? '修改中...' : '修改密码' }}
            </button>
          </div>
        </div>
        
        <!-- 登录日志 -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">登录日志</h2>
          
          <div v-if="loginLogs.length === 0" class="text-gray-500 text-center py-4">
            暂无登录记录
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="log in loginLogs"
              :key="log.id"
              class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg v-if="log.status === 'success'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ log.device_type || '未知设备' }}</p>
                  <p class="text-xs text-gray-500">{{ log.ip_address || '未知IP' }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-900">{{ formatDate(log.login_at) }}</p>
                <p class="text-xs text-gray-500">{{ log.login_method || '邮箱' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 退出登录 -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <button
            @click="handleLogout"
            class="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>
      
      <!-- 消息提示 -->
      <div
        v-if="message"
        :class="['fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg', messageType === 'success' ? 'bg-green-500' : 'bg-red-500']"
      >
        <p class="text-white">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composable/useAuth'

const router = useRouter()
const { user, fetchProfile, updateProfile, changePassword, logout, getLoginLogs, loading } = useAuth()

const message = ref('')
const messageType = ref('success')
const loginLogs = ref([])

const profileForm = reactive({
  nickname: '',
  bio: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const userInitial = computed(() => {
  if (!user.value) return '?'
  if (user.value.nickname) return user.value.nickname.charAt(0).toUpperCase()
  if (user.value.email) return user.value.email.charAt(0).toUpperCase()
  return '?'
})

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
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

const handleUpdateProfile = async () => {
  try {
    await updateProfile({
      nickname: profileForm.nickname,
      bio: profileForm.bio
    })
    showMessage('个人信息更新成功')
    await fetchProfile()
  } catch (err) {
    showMessage(err.message, 'error')
  }
}

const handleChangePassword = async () => {
  if (!passwordForm.oldPassword) {
    showMessage('请输入当前密码', 'error')
    return
  }
  if (!passwordForm.newPassword) {
    showMessage('请输入新密码', 'error')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showMessage('两次输入的密码不一致', 'error')
    return
  }
  
  const pwdError = validatePassword(passwordForm.newPassword)
  if (pwdError) {
    showMessage(pwdError, 'error')
    return
  }
  
  try {
    await changePassword(passwordForm.oldPassword, passwordForm.newPassword)
    showMessage('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (err) {
    showMessage(err.message, 'error')
  }
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}

onMounted(async () => {
  await fetchProfile()
  if (user.value) {
    profileForm.nickname = user.value.nickname || ''
    profileForm.bio = user.value.bio || ''
  }
  
  try {
    const logs = await getLoginLogs(1, 10)
    loginLogs.value = logs || []
  } catch (err) {
    console.error('获取登录日志失败:', err)
  }
})
</script>
