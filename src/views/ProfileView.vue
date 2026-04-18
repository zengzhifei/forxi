<template>
  <div class="min-h-screen bg-gray-100">
    <AppHeader />

    <div class="max-w-4xl mx-auto py-8 px-4">
      <h1 class="text-2xl font-semibold text-zinc-700 mb-8">个人中心</h1>

      <!-- 用户信息卡片 -->
      <div class="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 mb-6">
        <div class="flex items-center gap-4 mb-6">
          <img
            v-if="currentAvatar"
            :src="currentAvatar"
            class="w-20 h-20 rounded-full object-cover border-2 border-zinc-100"
            @error="handleAvatarError"
          />
          <div v-else class="w-20 h-20 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-500 text-2xl font-bold">
            {{ userInfo.nickname?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
          <div>
            <h2 class="text-xl font-semibold text-zinc-700">{{ userInfo.nickname }}</h2>
            <p class="text-zinc-400">{{ userInfo.email }}</p>
          </div>
        </div>
      </div>

      <!-- 标签页 -->
      <div class="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
        <div class="border-b border-zinc-100">
          <nav class="flex -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-6 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === tab.id
                ? 'border-zinc-500 text-zinc-700'
                : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:border-zinc-200'"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- 基本资料 -->
        <div v-if="activeTab === 'profile'" class="p-6">
          <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-zinc-600 mb-2">昵称</label>
              <input
                v-model="profileForm.nickname"
                type="text"
                class="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:bg-white transition-all"
                placeholder="请输入昵称"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-600 mb-2">头像</label>
              <div class="flex items-center gap-4">
                <div class="relative cursor-pointer" @click="triggerFileInput">
                  <img
                    v-if="currentAvatar"
                    :src="currentAvatar"
                    class="w-20 h-20 rounded-full object-cover border-2 border-zinc-100"
                    @error="handleAvatarError"
                  />
                  <div v-else class="w-20 h-20 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-500 text-2xl font-bold">
                    {{ userInitial }}
                  </div>
                  <div class="absolute bottom-0 right-0 bg-zinc-600 text-white rounded-full p-1 hover:bg-zinc-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-zinc-400">支持 JPG、PNG、GIF、WebP 格式，最大 2MB</p>
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
              <label class="block text-sm font-medium text-zinc-600 mb-2">个人简介</label>
              <textarea
                v-model="profileForm.bio"
                rows="3"
                class="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:bg-white transition-all"
                placeholder="介绍一下你自己..."
                maxlength="500"
              ></textarea>
              <p class="mt-1 text-xs text-zinc-400">{{ profileForm.bio?.length || 0 }}/500</p>
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2.5 bg-zinc-500 hover:bg-zinc-600 text-white text-sm font-medium rounded-xl disabled:opacity-50 transition-all"
            >
              {{ loading ? '保存中...' : '保存修改' }}
            </button>
          </form>
        </div>

        <!-- 修改密码 -->
        <div v-if="activeTab === 'password'" class="p-6">
          <form @submit.prevent="handleChangePassword" class="space-y-6 max-w-md">
            <div>
              <label class="block text-sm font-medium text-zinc-600 mb-2">当前密码</label>
              <div class="relative">
                <input
                  v-model="passwordForm.oldPassword"
                  :type="showOldPassword ? 'text' : 'password'"
                  class="w-full px-4 py-2.5 pr-12 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:bg-white transition-all"
                  placeholder="请输入当前密码"
                  required
                />
                <button
                  type="button"
                  @click="showOldPassword = !showOldPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors"
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
              <label class="block text-sm font-medium text-zinc-600 mb-2">新密码</label>
              <div class="relative">
                <input
                  v-model="passwordForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="w-full px-4 py-2.5 pr-12 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:bg-white transition-all"
                  placeholder="请输入新密码"
                  required
                  @focus="showPasswordRules = true"
                  @blur="showPasswordRules = false"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors"
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
                    :class="i <= passwordStrength.level ? passwordStrength.color : 'bg-zinc-100'"
                  ></div>
                </div>
                <p class="text-xs" :class="{
                  'text-red-500': passwordStrength.level === 1,
                  'text-yellow-500': passwordStrength.level === 2,
                  'text-green-500': passwordStrength.level >= 3
                }">{{ passwordStrength.text }}</p>
              </div>
              <!-- 密码规则提示 -->
              <div v-if="showPasswordRules" class="mt-2 p-3 bg-zinc-50 rounded-lg">
                <p class="text-xs text-zinc-400 mb-1">密码要求：{{ PASSWORD_RULES.description }}</p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span class="text-xs px-2 py-0.5 rounded" :class="passwordForm.newPassword.length >= 8 && passwordForm.newPassword.length <= 20 ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-400'">8-20位</span>
                  <span class="text-xs px-2 py-0.5 rounded" :class="/[A-Z]/.test(passwordForm.newPassword) ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-400'">大写字母</span>
                  <span class="text-xs px-2 py-0.5 rounded" :class="/[a-z]/.test(passwordForm.newPassword) ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-400'">小写字母</span>
                  <span class="text-xs px-2 py-0.5 rounded" :class="/[0-9]/.test(passwordForm.newPassword) ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-400'">数字</span>
                  <span class="text-xs px-2 py-0.5 rounded" :class="/[^a-zA-Z0-9]/.test(passwordForm.newPassword) ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-400'">特殊符号</span>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-600 mb-2">确认新密码</label>
              <div class="relative">
                <input
                  v-model="passwordForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="w-full px-4 py-2.5 pr-12 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 focus:bg-white transition-all"
                  placeholder="请再次输入新密码"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors"
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
              class="px-6 py-2.5 bg-zinc-500 hover:bg-zinc-600 text-white text-sm font-medium rounded-xl disabled:opacity-50 transition-all"
            >
              {{ loading ? '修改中...' : '修改密码' }}
            </button>
          </form>
        </div>

        <!-- 第三方账号绑定 -->
        <div v-if="activeTab === 'oauth'" class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
              <div class="flex items-start gap-3 group relative">
                <svg class="w-8 h-8 text-zinc-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <div>
                  <div class="font-medium text-zinc-700">GitHub</div>
                  <div class="text-sm text-zinc-400">
                    {{ oauthAccounts.some(a => a.provider === 'github') ? '已绑定' : '未绑定' }}
                  </div>
                </div>
                <div v-if="githubAccount" class="absolute left-full top-0 ml-2 p-3 bg-zinc-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                  <div class="font-medium">{{ githubAccount.name }}</div>
                  <a v-if="githubAccount.html_url" :href="githubAccount.html_url" target="_blank" class="text-zinc-300 hover:text-white" @click.stop>主页</a>
                </div>
              </div>
              <button
                v-if="!oauthAccounts.some(a => a.provider === 'github')"
                @click="handleBindGithub"
                class="px-4 py-2 bg-zinc-800 text-white text-sm rounded-lg hover:bg-zinc-700 transition-colors"
              >
                绑定
              </button>
              <button
                v-else
                @click="handleUnbindGithub"
                class="px-4 py-2 text-red-500 text-sm hover:text-red-600 transition-colors"
              >
                解绑
              </button>
            </div>
          </div>
        </div>

        <!-- 登录日志 -->
        <div v-if="activeTab === 'logs'" class="p-6">
          <div v-if="loginLogs.length === 0" class="text-center py-8 text-zinc-400">
            暂无登录记录
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(log, index) in loginLogs"
              :key="index"
              class="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="log.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'"
                >
                  <svg v-if="log.status === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-zinc-700">
                    {{ log.login_method === 'email' ? '邮箱登录' : 'GitHub 登录' }}
                  </div>
                  <div class="text-xs text-zinc-400">
                    {{ log.ip_address }} · {{ log.device_type }} · {{ formatDate(log.login_at) }}
                  </div>
                </div>
              </div>
              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
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
              class="px-4 py-2 border border-zinc-200 rounded-lg text-zinc-500 hover:border-zinc-300 disabled:opacity-40 transition-colors"
            >
              上一页
            </button>
            <span class="px-4 py-2 text-zinc-500">
              {{ logsMeta.page }} / {{ logsMeta.totalPages }}
            </span>
            <button
              @click="fetchLoginLogs(logsMeta.page + 1)"
              :disabled="logsMeta.page >= logsMeta.totalPages"
              class="px-4 py-2 border border-zinc-200 rounded-lg text-zinc-500 hover:border-zinc-300 disabled:opacity-40 transition-colors"
            >
              下一页
            </button>
          </div>
        </div>

        <!-- 我的反馈 -->
        <div v-if="activeTab === 'feedback'" class="p-6">
          <div v-if="feedbackLoading" class="text-center py-8 text-zinc-400">
            加载中...
          </div>
          <div v-else-if="myFeedback.length === 0" class="text-center py-8 text-zinc-400">
            暂无反馈记录
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="item in myFeedback"
              :key="item.id"
              class="p-4 bg-zinc-50 rounded-xl border border-zinc-100"
            >
              <div class="flex items-start justify-between mb-2">
                <p class="text-sm text-zinc-700 flex-1 pr-4">{{ item.content }}</p>
                <span class="text-xs text-zinc-400 whitespace-nowrap">
                  {{ formatDate(item.created_at) }}
                </span>
              </div>
              <div v-if="item.images && item.images.length > 0" class="flex gap-2 mb-2 flex-wrap">
                <img
                  v-for="(img, idx) in item.images"
                  :key="idx"
                  :src="img"
                  class="w-16 h-16 object-cover rounded-lg"
                />
              </div>
              <div class="flex items-center gap-4 text-xs text-zinc-400">
                <button
                  v-if="item.reply_count > 0"
                  @click="toggleReplies(item)"
                  class="hover:text-zinc-600 transition-colors"
                >
                  {{ expandedReplies[item.id] ? '收起回复' : `查看 ${item.reply_count} 条回复` }}
                </button>
              </div>

              <!-- 回复列表 -->
              <div v-if="expandedReplies[item.id]" class="mt-3 space-y-2 pl-4 border-l-2 border-zinc-200">
                <div v-if="repliesLoading[item.id]" class="text-center py-2 text-xs text-zinc-400">
                  加载中...
                </div>
                <div v-else-if="!itemReplies[item.id] || itemReplies[item.id].length === 0" class="text-center py-2 text-xs text-zinc-400">
                  暂无回复
                </div>
                <div
                  v-else
                  v-for="reply in itemReplies[item.id]"
                  :key="reply.id"
                  class="p-3 bg-white rounded-lg border border-zinc-100"
                >
                  <div class="flex items-start gap-2">
                    <img
                      v-if="reply.user?.avatar"
                      :src="reply.user.avatar.trim().replace(/`/g, '')"
                      class="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      @error="(e) => e.target.style.display = 'none'"
                    />
                    <div v-else class="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                      {{ (reply.user?.nickname || '用户').charAt(0).toUpperCase() }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-sm font-medium text-zinc-700">{{ reply.user?.nickname || '用户' }}</span>
                        <span class="text-xs text-zinc-400">▶</span>
                        <span class="text-sm font-medium text-zinc-700">{{ getReplyToWhom(reply, item) }}</span>
                      </div>
                      <p class="text-sm text-zinc-600 mt-1">{{ reply.content }}</p>
                      <p class="text-xs text-zinc-400 mt-1">{{ formatDate(reply.created_at) }}</p>
                    </div>
                  </div>
                </div>
                <!-- 回复分页 -->
                <Pagination
                  v-if="replyMeta[item.id] && replyMeta[item.id].total_pages > 1"
                  :meta="replyMeta[item.id]"
                  @page-change="(page) => fetchReplies(item, page)"
                />
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="flex justify-center mt-6">
            <Pagination
              v-if="feedbackMeta.total > 0"
              :key="feedbackMeta.page"
              :meta="{page: feedbackMeta.page, page_size: feedbackMeta.pageSize, total: feedbackMeta.total, total_pages: feedbackMeta.totalPages}"
              @page-change="(page) => fetchMyFeedback(page)"
            />
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composable/useAuth'
import api from '../utils/api'
import sso from '../utils/sso'
import { validatePassword, PASSWORD_RULES, getPasswordStrength } from '../utils/validate'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import Pagination from '../components/Pagination.vue'

const toast = inject('toast')
const confirm = inject('confirm')
const { user, fetchUserInfo, loading: authLoading } = useAuth()
const route = useRoute()
const router = useRouter()

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
  if (!user.value) {
    router.replace({ path: '/auth', query: { redirect: '/profile' } })
    return
  }
  userInfo.value = { ...user.value }
  profileForm.nickname = user.value.nickname || ''
  profileForm.avatar = user.value.avatar ? user.value.avatar.trim() : ''
  profileForm.bio = user.value.bio || ''
  await fetchOauthAccounts()
  await fetchLoginLogs(1)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updateHash)
})

watch(activeTab, (val) => {
  if (val === 'feedback' && myFeedback.value.length === 0) {
    fetchMyFeedback(1)
  }
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
  { id: 'feedback', name: '我的反馈' },
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

const expandedReplies = ref({})
const repliesLoading = ref({})
const itemReplies = ref({})
const replyMeta = ref({})

const toggleReplies = async (item) => {
  const isExpanded = !!expandedReplies.value[item.id]
  expandedReplies.value[item.id] = !isExpanded

  if (!isExpanded && !itemReplies.value[item.id]) {
    repliesLoading.value[item.id] = true
    try {
      const res = await api.getCommentReplies(item.id)
      let data = []
      let meta = null

      if (Array.isArray(res)) {
        data = res
        meta = null
      } else if (res?.data && Array.isArray(res.data)) {
        data = res.data
        meta = res.meta || null
      } else if (res?.data?.comments) {
        data = res.data.comments
        meta = res.data.meta || null
      }

      const replies = data
      itemReplies.value[item.id] = replies
      const userMap = {}
      replies.forEach(r => {
        if (r.user) {
          userMap[r.id] = r.user.nickname || '用户'
        }
      })
      replyUserMap[item.id] = userMap

      if (meta) {
        replyMeta.value[item.id] = meta
      } else {
        replyMeta.value[item.id] = { page: 1, page_size: 10, total: replies.length, total_pages: 1 }
      }
    } catch (err) {
      console.error('获取回复失败:', err)
      itemReplies.value[item.id] = []
      replyMeta.value[item.id] = { page: 1, page_size: 10, total: 0, total_pages: 1 }
    } finally {
      repliesLoading.value[item.id] = false
    }
  }
}

const replyUserMap = {}

const fetchReplies = async (item, page = 1) => {
  repliesLoading.value[item.id] = true
  try {
    const res = await api.getCommentReplies(item.id, page)
    let data = []
    let meta = null

    if (Array.isArray(res)) {
      data = res
      meta = null
    } else if (res?.data && Array.isArray(res.data)) {
      data = res.data
      meta = res.meta || null
    } else if (res?.data?.comments) {
      data = res.data.comments
      meta = res.data.meta || null
    }

    itemReplies.value[item.id] = data

    const userMap = {}
    data.forEach(r => {
      if (r.user) {
        userMap[r.id] = r.user.nickname || '用户'
      }
    })
    replyUserMap[item.id] = userMap

    if (meta) {
      replyMeta.value[item.id] = meta
    } else {
      replyMeta.value[item.id] = { page: 1, page_size: 10, total: data.length, total_pages: 1 }
    }
  } catch (err) {
    console.error('获取回复失败:', err)
    itemReplies.value[item.id] = []
  } finally {
    repliesLoading.value[item.id] = false
  }
}

const getReplyToWhom = (reply, item) => {
  if (reply.parent_id === item.id) {
    return item.user?.nickname || user.value?.nickname || '用户'
  }
  const map = replyUserMap[item.id]
  return map ? (map[reply.parent_id] || '用户') : '用户'
}

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

const myFeedback = ref([])
const feedbackMeta = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})
const feedbackMetaForPagination = computed(() => ({
  page: feedbackMeta.value.page,
  page_size: feedbackMeta.value.pageSize,
  total: feedbackMeta.value.total,
  total_pages: feedbackMeta.value.totalPages
}))
const feedbackLoading = ref(false)

const fetchMyFeedback = async (page = 1) => {
  feedbackLoading.value = true
  try {
    const res = await api.getMyFeedback(page, feedbackMeta.value.pageSize)
    let data = []
    let meta = null

    if (Array.isArray(res)) {
      data = res
      meta = null
    } else if (res?.data && Array.isArray(res.data)) {
      data = res.data
      meta = res.meta || null
    } else if (res?.data?.comments) {
      data = res.data.comments
      meta = res.data.meta || null
    }

    myFeedback.value = data

    if (meta) {
      feedbackMeta.value = {
        page: meta.page || page,
        pageSize: meta.page_size || 10,
        total: meta.total || data.length,
        totalPages: meta.total_pages || 1
      }
    } else {
      const totalItems = data.length
      const totalPages = Math.ceil(totalItems / feedbackMeta.value.pageSize) || 1
      feedbackMeta.value = { ...feedbackMeta.value, page, pageSize: feedbackMeta.value.pageSize, total: totalItems, totalPages }
    }
  } catch (err) {
    console.error('获取我的反馈失败:', err)
    toast.error('获取反馈列表失败')
  } finally {
    feedbackLoading.value = false
  }
}

const fetchOauthAccounts = async () => {
  try {
    const res = await sso.getOauthAccounts()
    oauthAccounts.value = Array.isArray(res) ? res : (res.data || [])
  } catch (err) {
    console.error('获取OAuth账号失败:', err)
  }
}

const fetchLoginLogs = async (page) => {
  try {
    const res = await sso.getLoginLogs(page, logsMeta.value.pageSize)
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
    await sso.updateProfile({
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
    await sso.changePassword(passwordForm.oldPassword, passwordForm.newPassword)
    toast.success('密码修改成功，请重新登录')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    setTimeout(() => {
      router.push('/auth')
    }, 1500)
  } catch (err) {
    toast.error(err.message || '修改失败')
  } finally {
    loading.value = false
  }
}

const handleBindGithub = async () => {
  try {
    const authUrl = await sso.getOAuthUrl('github')
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
    await sso.unbindOAuth('github')
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
    console.error('头像上传失败:', err)
  } finally {
    uploading.value = false
    // 清除文件输入
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>
