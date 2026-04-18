<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="closeModal"
        ></div>

        <div class="relative bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
          <div class="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <h3 class="text-lg font-semibold text-zinc-800">反馈</h3>
            <button
              @click="closeModal"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
            >
              <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-5">
            <div v-if="!isAuthenticated" class="text-center py-8">
              <div class="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p class="text-zinc-500 mb-4">登录后可提交反馈</p>
              <button
                @click="goToLogin"
                class="px-6 py-2 bg-violet-500 text-white font-medium rounded-lg hover:bg-violet-600 transition-colors"
              >
                去登录
              </button>
            </div>

            <div v-else class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-zinc-700 mb-2">
                  反馈模块 <span class="text-red-500">*</span>
                </label>
                <SearchSelect
                  v-model="selectedModule"
                  :options="moduleOptions"
                  placeholder="请选择反馈模块"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-zinc-700 mb-2">
                  反馈内容 <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="feedbackContent"
                  rows="5"
                  maxlength="2000"
                  placeholder="请描述您遇到的问题或建议..."
                  class="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl text-sm text-zinc-700 placeholder-zinc-400 focus:border-violet-500 focus:outline-none resize-none transition-colors"
                ></textarea>
                <div class="text-right text-xs text-zinc-400 mt-1">
                  {{ feedbackContent.length }} / 2000
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-zinc-700 mb-2">
                  上传图片 <span class="text-xs text-zinc-400">(最多9张)</span>
                </label>
                <div class="border-2 border-dashed border-zinc-200 rounded-xl p-4">
                  <div v-if="previewImages.length > 0" class="grid grid-cols-4 gap-2 mb-3">
                    <div v-for="(preview, index) in previewImages" :key="index" class="relative aspect-square rounded-lg overflow-hidden bg-zinc-100">
                      <img :src="preview" class="w-full h-full object-cover" />
                      <button
                        @click="removeImage(index)"
                        class="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div v-if="previewImages.length < 9" class="flex justify-center">
                    <label class="cursor-pointer flex flex-col items-center gap-1 text-zinc-400 hover:text-violet-500 transition-colors">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span class="text-xs">添加图片</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        @change="handleImageSelect"
                        class="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div v-if="submitError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">{{ submitError }}</p>
              </div>
            </div>
          </div>

          <div v-if="isAuthenticated" class="px-5 py-4 border-t border-zinc-100 bg-zinc-50">
            <button
              @click="submitFeedback"
              :disabled="isSubmitting || !feedbackContent.trim() || !selectedModule"
              class="w-full py-3 bg-violet-500 text-white font-medium rounded-xl hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? '提交中...' : '提交反馈' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composable/useAuth'
import SearchSelect from './SearchSelect.vue'
import api from '../utils/api'

const router = useRouter()
const { isAuthenticated } = useAuth()
const toast = inject('toast')

const isModalOpen = ref(false)
const selectedModule = ref('')
const feedbackContent = ref('')
const selectedImages = ref([])
const previewImages = ref([])
const uploadedImageUrls = ref([])
const isSubmitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)
const commentTypes = ref([])

const feedbackTypes = computed(() => {
  const feedback = commentTypes.value.find(t => t.value === 'feedback')
  return feedback?.minor_types || []
})

const moduleOptions = computed(() => {
  return feedbackTypes.value.map(m => ({ id: m.value, display_name: m.label }))
})

watch(isModalOpen, (newVal) => {
  if (newVal) {
    resetForm()
    loadCommentTypes()
  }
})

async function loadCommentTypes() {
  if (commentTypes.value.length > 0) return
  try {
    const data = await api.getCommentTypes()
    commentTypes.value = data || []
  } catch (err) {
    console.error('获取评论类型失败:', err)
  }
}

function resetForm() {
  selectedModule.value = ''
  feedbackContent.value = ''
  selectedImages.value = []
  previewImages.value = []
  uploadedImageUrls.value = []
  submitError.value = ''
  submitSuccess.value = false
}

function openModal() {
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function goToLogin() {
  closeModal()
  router.push('/auth')
}

function handleImageSelect(event) {
  const files = Array.from(event.target.files)
  const remainingSlots = 9 - selectedImages.value.length

  if (files.length > remainingSlots) {
    submitError.value = '最多只能上传9张图片'
    files.splice(remainingSlots)
  }

  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      submitError.value = `${file.name} 超过5MB限制`
      return
    }

    selectedImages.value.push(file)
    uploadedImageUrls.value.push('')
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImages.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })

  event.target.value = ''
}

function removeImage(index) {
  selectedImages.value.splice(index, 1)
  previewImages.value.splice(index, 1)
  uploadedImageUrls.value.splice(index, 1)
}

async function submitFeedback() {
  if (!feedbackContent.value.trim() || !selectedModule.value || isSubmitting.value) return

  submitError.value = ''
  submitSuccess.value = false
  isSubmitting.value = true

  try {
    const imagesToUpload = selectedImages.value.filter((_, i) => !uploadedImageUrls.value[i])
    if (imagesToUpload.length > 0) {
      for (let i = 0; i < selectedImages.value.length; i++) {
        if (!uploadedImageUrls.value[i]) {
          const uploadResult = await api.uploadFile(selectedImages.value[i], 'feedback')
          uploadedImageUrls.value[i] = uploadResult.url
        }
      }
    }

    const finalImageUrls = uploadedImageUrls.value.filter(url => url)

    await api.submitComment({
      majorType: 'feedback',
      minorType: selectedModule.value,
      content: feedbackContent.value.trim(),
      images: finalImageUrls
    })

    submitSuccess.value = true
    toast?.success('反馈提交成功，感谢您的支持！')
    closeModal()
  } catch (err) {
    submitError.value = err.message || '提交失败，请稍后重试'
  } finally {
    isSubmitting.value = false
  }
}

defineExpose({ openModal })
</script>

<style scoped>
.modal-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-leave-active {
  transition: all 0.2s ease-in;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>