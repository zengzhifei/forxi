<template>
  <div class="min-h-screen bg-gray-100 text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <section class="relative overflow-hidden bg-white border-b border-zinc-100">
        <div class="absolute inset-0" style="background: linear-gradient(135deg, #fef3c7 0%, #ffffff 40%, #fef9c3 100%);"></div>
        <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-16 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-medium rounded-full mb-3 sm:mb-5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            临时邮箱
          </div>
          <h1 class="text-2xl sm:text-5xl font-bold text-zinc-800 mb-2 sm:mb-4 tracking-tight">临时邮箱</h1>
          <p class="text-zinc-400 text-xs sm:text-lg max-w-2xl mx-auto leading-relaxed">创建临时邮箱接收邮件，保护您的真实邮箱隐私</p>
        </div>
      </section>

      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div v-if="!isLoggedIn" class="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h3 class="text-lg font-semibold text-zinc-700 mb-2">需要登录</h3>
          <p class="text-zinc-500 text-sm mb-4">此功能需要登录后才能使用</p>
          <router-link to="/auth" class="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors">
            前往登录
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </router-link>
        </div>

        <template v-else>
          <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 p-4 sm:p-6 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-zinc-700">我的邮箱</h3>
                <p class="text-sm text-zinc-500 mt-1">每个邮箱有效期30分钟，最多创建10个邮箱，每个邮箱最多接收20封邮件</p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="createMailbox"
                  :disabled="loading.create || mailboxes.length >= 10"
                  class="px-5 py-2.5 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg v-if="loading.create" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  <span>{{ loading.create ? '创建中...' : '创建邮箱' }}</span>
                </button>
              </div>
            </div>

            <div v-if="error.create" class="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
              <div class="flex items-center gap-2 text-red-600 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ error.create }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 flex items-center justify-between">
                  <h3 class="text-white font-semibold flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    邮箱列表
                  </h3>
                  <span class="text-white/80 text-sm">({{ mailboxes.length }}/10)</span>
                </div>
                <div class="p-3 max-h-[400px] overflow-y-auto">
                  <div v-if="loading.list" class="text-center py-8">
                    <svg class="w-8 h-8 animate-spin text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p class="text-sm text-zinc-500 mt-2">加载中...</p>
                  </div>
                  <div v-else-if="mailboxes.length === 0" class="text-center py-8">
                    <svg class="w-12 h-12 text-zinc-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <p class="text-sm text-zinc-500">暂无邮箱</p>
                    <p class="text-xs text-zinc-400 mt-1">点击上方按钮创建</p>
                  </div>
                  <div v-else class="space-y-2">
                    <div
                      v-for="mailbox in mailboxes"
                      :key="mailbox.address"
                      @click="selectMailbox(mailbox)"
                      class="p-3 rounded-xl cursor-pointer transition-all"
                      :class="selectedMailbox?.address === mailbox.address ? 'bg-amber-50 border border-amber-200' : 'bg-zinc-50 hover:bg-zinc-100 border border-transparent'"
                    >
                      <div class="flex items-start justify-between gap-2">
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-zinc-700 truncate">{{ mailbox.address }}</p>
                          <p class="text-xs mt-1" :class="isExpired(mailbox.expires_at) ? 'text-red-500' : 'text-zinc-400'">
                            {{ isExpired(mailbox.expires_at) ? '已过期' : formatCountdown(mailbox.expires_at) }}
                          </p>
                        </div>
                        <div class="flex items-center gap-1 flex-shrink-0">
                          <button
                            @click.stop="refreshMailboxEmails(mailbox)"
                            :disabled="loading.emails"
                            class="p-1.5 text-zinc-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition-colors"
                            title="刷新邮件"
                          >
                            <svg class="w-4 h-4" :class="{ 'animate-spin': loading.emails && selectedMailbox?.address === mailbox.address }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          </button>
                          <button
                            @click.stop="copyEmail(mailbox.address)"
                            class="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                            title="复制邮箱"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                          <button
                            @click.stop="deleteMailboxHandle(mailbox.address)"
                            class="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="删除邮箱"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-2">
              <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                <div class="bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-4">
                  <h3 class="text-white font-semibold flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    邮件列表
                  </h3>
                </div>
                <div class="p-4">
                  <div v-if="!selectedMailbox" class="text-center py-12">
                    <svg class="w-16 h-16 text-zinc-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <p class="text-zinc-500">选择邮箱查看邮件</p>
                  </div>
                  <div v-else-if="loading.emails" class="text-center py-12">
                    <svg class="w-8 h-8 animate-spin text-violet-500 mx-auto" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p class="text-sm text-zinc-500 mt-2">加载中...</p>
                  </div>
                  <div v-else-if="emails.length === 0" class="text-center py-12">
                    <svg class="w-16 h-16 text-zinc-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    <p class="text-zinc-500">暂无邮件</p>
                    <p class="text-xs text-zinc-400 mt-1">等待发送邮件到此邮箱</p>
                  </div>
                  <div v-else class="space-y-3">
                    <div
                      v-for="email in emails"
                      :key="email.id"
                      @click="viewEmail(email)"
                      class="p-4 bg-zinc-50 hover:bg-zinc-100 rounded-xl cursor-pointer transition-all border border-transparent hover:border-zinc-200"
                    >
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0 font-medium text-sm">
                          {{ getAvatarText(email) }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center gap-2 min-w-0 flex-1">
                              <p class="text-sm font-medium text-zinc-700 truncate">{{ email.from_name || email.from }}</p>
                              <span v-if="email.from_name" class="text-xs text-zinc-400 truncate flex-shrink-0">{{ email.from }}</span>
                            </div>
                            <p class="text-xs text-zinc-400 flex-shrink-0">{{ formatEmailTime(email.received_at) }}</p>
                          </div>
                          <p class="text-sm text-zinc-600 mt-1 truncate">{{ email.subject || '(无主题)' }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </section>
    </main>

    <AppFooter />

    <div v-if="showEmailDetail" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeEmailDetail">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div class="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4 flex items-center justify-between">
          <h3 class="text-white font-semibold">邮件详情</h3>
          <button @click="closeEmailDetail" class="p-1 text-white/80 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(80vh-70px)]">
          <div class="mb-4">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-medium text-sm">
                {{ getAvatarText(emailDetail) }}
              </div>
              <div>
                <p class="font-medium text-zinc-700">{{ emailDetail.from_name || emailDetail.from }}</p>
                <p class="text-sm text-zinc-500">{{ emailDetail.from }}</p>
              </div>
            </div>
            <div class="text-xs text-zinc-400">
              收件人: {{ emailDetail.to }} | 收件时间: {{ formatFullTime(emailDetail.received_at) }}
            </div>
          </div>
          <div class="h-px bg-zinc-100 my-4"></div>
          <div class="mb-4">
            <h4 class="text-sm font-medium text-zinc-700 mb-2">主题</h4>
            <p class="text-zinc-600">{{ emailDetail.subject || '(无主题)' }}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-zinc-700 mb-2">正文</h4>
            <div v-if="emailDetail.html_body && emailDetail.html_body !== emailDetail.body" class="text-zinc-600 prose prose-sm max-w-none" v-html="emailDetail.html_body"></div>
            <pre v-else class="text-zinc-600 whitespace-pre-wrap text-sm bg-zinc-50 p-4 rounded-xl">{{ emailDetail.body || '(空)' }}</pre>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="cancelDelete">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div class="text-center">
          <div class="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 class="text-lg font-semibold text-zinc-700 mb-2">确认删除</h3>
          <p class="text-sm text-zinc-500 mb-6">确定要删除邮箱 <span class="font-medium text-zinc-700">{{ deleteTarget }}</span> 吗？删除后该邮箱及其所有邮件将无法恢复。</p>
          <div class="flex gap-3">
            <button @click="cancelDelete" class="flex-1 px-4 py-2.5 bg-zinc-100 text-zinc-700 font-medium rounded-xl hover:bg-zinc-200 transition-colors">
              取消
            </button>
            <button @click="confirmDelete" :disabled="loading.delete" class="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <svg v-if="loading.delete" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading.delete ? '删除中...' : '确认删除' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { api } from '../utils/api.js'
import sso from '../utils/sso.js'

const toast = inject('toast')

const isLoggedIn = ref(false)
const mailboxes = ref([])
const selectedMailbox = ref(null)
const emails = ref([])
const emailDetail = ref(null)
const showEmailDetail = ref(false)
const showDeleteConfirm = ref(false)
const deleteTarget = ref('')

const loading = ref({
  create: false,
  list: false,
  emails: false,
  delete: false
})

const error = ref({
  create: ''
})

let countdownInterval = null

const checkLogin = async () => {
  try {
    await sso.getProfile()
    isLoggedIn.value = true
  } catch {
    isLoggedIn.value = false
  }
}

const fetchMailboxes = async () => {
  loading.value.list = true
  try {
    const data = await api.getMailboxList()
    mailboxes.value = Array.isArray(data) ? data : []
    if (selectedMailbox.value) {
      const stillExists = mailboxes.value.find(m => m.address === selectedMailbox.value.address)
      if (!stillExists) {
        selectedMailbox.value = null
        emails.value = []
      }
    }
  } catch (e) {
    console.error('获取邮箱列表失败:', e)
  } finally {
    loading.value.list = false
  }
}

const refreshMailboxes = async () => {
  await fetchMailboxes()
}

const createMailbox = async () => {
  error.value.create = ''
  loading.value.create = true
  try {
    const data = await api.createMailbox()
    mailboxes.value.push(data)
    selectedMailbox.value = data
    emails.value = []
  } catch (e) {
    error.value.create = e.message || '创建邮箱失败'
  } finally {
    loading.value.create = false
  }
}

const selectMailbox = async (mailbox) => {
  selectedMailbox.value = mailbox
  await fetchEmails()
}

const fetchEmails = async () => {
  if (!selectedMailbox.value) return
  loading.value.emails = true
  try {
    const data = await api.getMailboxPool(selectedMailbox.value.address)
    emails.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('获取邮件列表失败:', e)
    emails.value = []
  } finally {
    loading.value.emails = false
  }
}

const refreshEmails = async () => {
  await fetchEmails()
}

const refreshMailboxEmails = async (mailbox) => {
  selectedMailbox.value = mailbox
  await fetchEmails()
}

const viewEmail = (email) => {
  emailDetail.value = email
  showEmailDetail.value = true
}

const closeEmailDetail = () => {
  showEmailDetail.value = false
  emailDetail.value = null
}

const deleteMailboxHandle = (address) => {
  deleteTarget.value = address
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  deleteTarget.value = ''
}

const confirmDelete = async () => {
  loading.value.delete = true
  try {
    await api.deleteMailbox(deleteTarget.value)
    mailboxes.value = mailboxes.value.filter(m => m.address !== deleteTarget.value)
    if (selectedMailbox.value?.address === deleteTarget.value) {
      selectedMailbox.value = null
      emails.value = []
    }
    showDeleteConfirm.value = false
    deleteTarget.value = ''
  } catch (e) {
    console.error('删除邮箱失败:', e)
  } finally {
    loading.value.delete = false
  }
}

const copyEmail = (address) => {
  navigator.clipboard.writeText(address).then(() => {
    toast.success('邮箱地址已复制')
  })
}

const isExpired = (isoString) => {
  if (!isoString) return false
  return new Date(isoString) <= new Date()
}

const formatCountdown = (isoString) => {
  if (!isoString) return '-'
  const date = new Date(isoString)
  const now = new Date()
  const diff = date - now
  if (diff <= 0) return '已过期'
  const minutes = Math.floor(diff / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return `${minutes}分${seconds}秒`
}

const updateCountdowns = () => {
  mailboxes.value = [...mailboxes.value]
}

const getAvatarText = (email) => {
  if (!email) return '?'
  const name = email.from_name || email.from
  return name.charAt(0).toUpperCase()
}

const formatEmailTime = (isoString) => {
  if (!isoString) return '-'
  const date = new Date(isoString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

const formatFullTime = (isoString) => {
  if (!isoString) return '-'
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(async () => {
  await checkLogin()
  if (isLoggedIn.value) {
    await fetchMailboxes()
    countdownInterval = setInterval(updateCountdowns, 1000)
  }
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>
