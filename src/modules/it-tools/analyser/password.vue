<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </span>
      密码强度分析
    </h3>
    <input 
      type="text" 
      v-model="password" 
      class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent text-lg"
      placeholder="请输入密码..."
    />
    <div v-if="strength.score !== null" class="mt-6 space-y-4">
      <div class="space-y-2">
        <div class="flex gap-1">
          <div 
            v-for="i in 4" 
            :key="i"
            class="h-2 flex-1 rounded-full transition-all duration-300"
            :class="i <= strength.score ? strength.color : 'bg-gray-200'"
          ></div>
        </div>
      </div>
      <p class="text-lg font-semibold text-center" :class="strength.textColor">{{ strength.label }}</p>
      <div class="grid grid-cols-2 gap-3 pt-2">
        <div class="flex items-center gap-2 p-3 rounded-lg" :class="strength.hasLength ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'">
          <svg v-if="strength.hasLength" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="text-sm font-medium">长度至少 8 位</span>
        </div>
        <div class="flex items-center gap-2 p-3 rounded-lg" :class="strength.hasUpper ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'">
          <svg v-if="strength.hasUpper" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="text-sm font-medium">包含大写字母</span>
        </div>
        <div class="flex items-center gap-2 p-3 rounded-lg" :class="strength.hasLower ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'">
          <svg v-if="strength.hasLower" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="text-sm font-medium">包含小写字母</span>
        </div>
        <div class="flex items-center gap-2 p-3 rounded-lg" :class="strength.hasNumber ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'">
          <svg v-if="strength.hasNumber" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="text-sm font-medium">包含数字</span>
        </div>
        <div class="flex items-center gap-2 p-3 rounded-lg" :class="strength.hasSpecial ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'">
          <svg v-if="strength.hasSpecial" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="text-sm font-medium">包含特殊字符</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const password = ref('')

const strength = computed(() => {
  const pwd = password.value
  if (!pwd) {
    return { score: null, label: '', color: '', textColor: '', hasLength: false, hasUpper: false, hasLower: false, hasNumber: false, hasSpecial: false }
  }
  
  let score = 0
  const hasLength = pwd.length >= 8
  const hasUpper = /[A-Z]/.test(pwd)
  const hasLower = /[a-z]/.test(pwd)
  const hasNumber = /[0-9]/.test(pwd)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
  
  if (hasLength) score++
  if (hasUpper) score++
  if (hasLower) score++
  if (hasNumber) score++
  if (hasSpecial) score++
  
  let label = '非常弱'
  let color = 'bg-red-500'
  let textColor = 'text-red-600'
  
  if (score >= 5) {
    label = '非常强'
    color = 'bg-green-500'
    textColor = 'text-green-600'
  } else if (score >= 4) {
    label = '强'
    color = 'bg-green-400'
    textColor = 'text-green-600'
  } else if (score >= 3) {
    label = '中等'
    color = 'bg-yellow-400'
    textColor = 'text-yellow-600'
  } else if (score >= 2) {
    label = '弱'
    color = 'bg-orange-400'
    textColor = 'text-orange-600'
  }
  
  return { score, label, color, textColor, hasLength, hasUpper, hasLower, hasNumber, hasSpecial }
})
</script>
