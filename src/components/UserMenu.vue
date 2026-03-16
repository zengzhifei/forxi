<template>
  <div class="relative" v-if="isAuthenticated" ref="dropdownRef">
    <button
      @click="showDropdown = !showDropdown"
      class="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
    >
      <img
        v-if="userAvatar"
        :src="userAvatar"
        :alt="user.nickname || user.email"
        class="w-8 h-8 rounded-full object-cover"
        @error="handleAvatarError"
      />
      <div v-else class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
        {{ userInitial }}
      </div>
      <span class="text-sm font-medium text-gray-700 hidden sm:inline">{{ user?.nickname || user?.email }}</span>
      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-if="showDropdown"
        class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
      >
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-sm font-medium text-gray-900">{{ user?.nickname || '用户' }}</p>
          <p class="text-xs text-gray-500">{{ user?.email }}</p>
        </div>

        <div class="py-1">
          <router-link
            to="/profile"
            @click="showDropdown = false"
            class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            用户中心
          </router-link>
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            退出登录
          </button>
        </div>
      </div>
    </Transition>
  </div>

  <!-- 未登录状态 -->
  <div v-else class="flex items-center">
    <router-link
      to="/auth"
      class="flex items-center gap-2 px-3 sm:px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-md hover:shadow-lg hover:shadow-blue-500/30 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      <span class="hidden sm:inline">登录 / 注册</span>
      <span class="sm:hidden">登录</span>
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composable/useAuth'

const router = useRouter()
const { user, isAuthenticated, fetchProfile, logout } = useAuth()

const showDropdown = ref(false)
const dropdownRef = ref(null)

const userInitial = computed(() => {
  if (!user.value) return '?'
  if (user.value.nickname) return user.value.nickname.charAt(0).toUpperCase()
  if (user.value.email) return user.value.email.charAt(0).toUpperCase()
  return '?'
})

const userAvatar = computed(() => {
  const avatar = user.value?.avatar || ''
  return avatar.trim().replace(/`/g, '')
})

const handleAvatarError = (e) => {
  e.target.style.display = 'none'
}

const handleLogout = async () => {
  await logout()
  showDropdown.value = false
  router.push('/')
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  fetchProfile()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
