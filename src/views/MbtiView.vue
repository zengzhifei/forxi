<template>
  <div class="min-h-screen bg-gray-100 text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <section class="relative overflow-hidden bg-white border-b border-zinc-100">
        <div class="absolute inset-0" style="background: linear-gradient(135deg, #faf5ff 0%, #ffffff 40%, #ede9fe 100%);"></div>
        <div class="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-24 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 text-violet-600 text-xs font-medium rounded-full mb-4 sm:mb-6">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            MBTI 人格测试
          </div>
          <h1 class="text-3xl sm:text-5xl font-bold text-zinc-800 mb-3 sm:mb-5 tracking-tight">探索你的性格密码</h1>
          <p class="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">精选题目，带你发现真实的自己</p>
        </div>
      </section>

      <section class="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div v-if="!started && !finished" class="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
          <div class="text-center mb-8">
            <div class="w-16 h-16 rounded-full bg-violet-100 text-violet-500 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <h2 class="text-2xl font-bold text-zinc-800 mb-3">MBTI 人格类型测试</h2>
            <p class="text-zinc-500 text-sm leading-relaxed">
              MBTI（Myers-Briggs Type Indicator）是一种广泛使用的人格类型测试工具，
              将人格分为 16 种类型。
            </p>
          </div>

          <div class="space-y-4 mb-8">
            <div @click="selectMode('quick')" class="p-4 border-2 rounded-xl cursor-pointer transition-all duration-200" :class="testMode === 'quick' ? 'border-violet-500 bg-violet-50' : 'border-zinc-200 hover:border-violet-300'">
              <div class="flex items-center gap-3 mb-2">
                <span class="px-2.5 py-1 text-xs rounded-md bg-amber-100 text-amber-600 font-medium">快速</span>
                <h3 class="font-semibold text-zinc-800">快速测试</h3>
              </div>
              <p class="text-sm text-zinc-500">约 5 分钟，共 {{ quickQuestionCount }} 题，快速了解你的性格类型</p>
            </div>
            <div @click="selectMode('deep')" class="p-4 border-2 rounded-xl cursor-pointer transition-all duration-200" :class="testMode === 'deep' ? 'border-violet-500 bg-violet-50' : 'border-zinc-200 hover:border-violet-300'">
              <div class="flex items-center gap-3 mb-2">
                <span class="px-2.5 py-1 text-xs rounded-md bg-emerald-100 text-emerald-600 font-medium">深度</span>
                <h3 class="font-semibold text-zinc-800">深度测试</h3>
              </div>
              <p class="text-sm text-zinc-500">约 10 分钟，共 {{ deepQuestionCount }} 题，获得更精确的性格分析</p>
            </div>
          </div>

          <button @click="startTest" :disabled="!testMode" class="w-full py-3 bg-violet-500 text-white font-medium rounded-lg hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            开始测试
          </button>
        </div>

        <div v-if="started && !finished && questions.length > 0" class="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-zinc-500">进度</span>
              <span class="text-xs font-medium text-zinc-500">{{ currentIndex + 1 }} / {{ questions.length }}</span>
            </div>
            <div class="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div class="h-full bg-violet-500 transition-all duration-300" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-medium text-zinc-400">总用时：{{ formatTime(totalTime) }}</span>
              <span class="text-xs font-medium text-zinc-400">本题倒计时：{{ formatTime(countdown) }}</span>
            </div>
          </div>

          <div class="mb-8">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-2.5 py-1 text-xs rounded-md bg-violet-50 text-violet-600 font-medium">{{ getDimensionName(currentQuestion.dimension) }}</span>
            </div>
            <div class="space-y-3">
              <button
                v-for="(option, index) in [currentQuestion.option_a, currentQuestion.option_b, currentQuestion.option_c, currentQuestion.option_d]"
                :key="index"
                @click="selectAnswer(String.fromCharCode(65 + index))"
                class="w-full p-4 text-left border-2 rounded-xl transition-all duration-200"
                :class="[
                  selectedAnswer === String.fromCharCode(65 + index)
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-zinc-200 hover:border-violet-300 hover:bg-zinc-50'
                ]"
              >
                <span class="text-sm sm:text-base">{{ option }}</span>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <button
              @click="retakeTest"
              class="px-4 py-2 bg-zinc-500 text-white font-medium rounded-lg hover:bg-zinc-600 transition-colors"
            >
              重新测试
            </button>
            <div class="flex gap-3">
              <button
                @click="goToPrevious"
                :disabled="currentIndex === 0"
                class="px-6 py-2.5 border-2 border-zinc-200 text-zinc-600 font-medium rounded-lg hover:border-zinc-300 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一题
              </button>
              <button
                @click="goToNext"
                :disabled="!selectedAnswer"
                class="px-6 py-2.5 bg-violet-500 text-white font-medium rounded-lg hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ currentIndex === questions.length - 1 ? '提交答案' : '下一题' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="finished && result" class="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
          <div class="text-center mb-8">
            <div class="w-20 h-20 rounded-full bg-violet-100 text-violet-500 flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <h2 class="text-3xl font-bold text-zinc-800 mb-2">{{ result.result_type }}</h2>
            <p class="text-lg text-zinc-600 mb-3">{{ result.type_name }}</p>
            <p class="text-sm text-zinc-500">总用时：{{ formatTime(totalTime) }}</p>
          </div>

          <div class="p-4 bg-violet-50 rounded-xl mb-6">
            <p class="text-sm text-zinc-700 leading-relaxed">{{ result.description }}</p>
          </div>

          <div class="mb-6">
            <h3 class="text-sm font-semibold text-zinc-700 mb-3">各维度解读</h3>
            <div class="space-y-3">
              <div class="p-3 bg-zinc-50 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-zinc-600">内外向 (EI)</span>
                  <span class="text-xs text-zinc-500">E: {{ result.percentage.e }}% / I: {{ result.percentage.i }}%</span>
                </div>
                <p class="text-xs text-zinc-600 leading-relaxed">{{ result.dimension_desc.ei }}</p>
              </div>
              <div class="p-3 bg-zinc-50 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-zinc-600">感觉直觉 (SN)</span>
                  <span class="text-xs text-zinc-500">S: {{ result.percentage.s }}% / N: {{ result.percentage.n }}%</span>
                </div>
                <p class="text-xs text-zinc-600 leading-relaxed">{{ result.dimension_desc.sn }}</p>
              </div>
              <div class="p-3 bg-zinc-50 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-zinc-600">思维情感 (TF)</span>
                  <span class="text-xs text-zinc-500">T: {{ result.percentage.t }}% / F: {{ result.percentage.f }}%</span>
                </div>
                <p class="text-xs text-zinc-600 leading-relaxed">{{ result.dimension_desc.tf }}</p>
              </div>
              <div class="p-3 bg-zinc-50 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-zinc-600">判断知觉 (JP)</span>
                  <span class="text-xs text-zinc-500">J: {{ result.percentage.j }}% / P: {{ result.percentage.p }}%</span>
                </div>
                <p class="text-xs text-zinc-600 leading-relaxed">{{ result.dimension_desc.jp }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-emerald-50 rounded-xl">
              <h4 class="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                优势
              </h4>
              <ul class="space-y-1">
                <li v-for="strength in result.strengths" :key="strength" class="text-xs text-emerald-600">• {{ strength }}</li>
              </ul>
            </div>
            <div class="p-4 bg-amber-50 rounded-xl">
              <h4 class="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                弱势
              </h4>
              <ul class="space-y-1">
                <li v-for="weakness in result.weaknesses" :key="weakness" class="text-xs text-amber-600">• {{ weakness }}</li>
              </ul>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-sm font-semibold text-zinc-700 mb-3">适合职业</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="career in result.careers" :key="career" class="px-3 py-1.5 text-xs rounded-lg bg-zinc-100 text-zinc-600">
                {{ career }}
              </span>
            </div>
          </div>

          <div class="p-4 bg-zinc-50 rounded-xl mb-6">
            <h4 class="text-sm font-semibold text-zinc-700 mb-2">人际关系</h4>
            <p class="text-xs text-zinc-600 leading-relaxed">{{ result.relationships }}</p>
          </div>

          <div class="p-4 bg-zinc-50 rounded-xl mb-6">
            <h4 class="text-sm font-semibold text-zinc-700 mb-2">工作风格</h4>
            <p class="text-xs text-zinc-600 leading-relaxed">{{ result.work_style }}</p>
          </div>

          <div class="flex gap-3">
            <button @click="retakeTest" class="flex-1 py-3 border-2 border-zinc-200 text-zinc-600 font-medium rounded-lg hover:border-zinc-300 hover:bg-zinc-50 transition-colors">
              重新测试
            </button>
          </div>
        </div>

        <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-6 sm:p-10 text-center">
          <div class="w-12 h-12 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-zinc-600">加载中...</p>
        </div>

        <div v-if="error" class="bg-white rounded-2xl shadow-lg p-6 sm:p-10 text-center">
          <div class="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <p class="text-zinc-600 mb-4">{{ error }}</p>
          <button @click="initTest" class="px-6 py-2 bg-violet-500 text-white font-medium rounded-lg hover:bg-violet-600 transition-colors">
            重试
          </button>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import api from '../utils/api'

const router = useRouter()

const started = ref(false)
const finished = ref(false)
const allQuestions = ref([])
const testMode = ref(null)
const answers = ref([])
const currentIndex = ref(0)
const selectedAnswer = ref(null)
const result = ref(null)
const loading = ref(false)
const error = ref(null)

const totalTime = ref(0)
const countdown = ref(30)
let timerInterval = null
let countdownInterval = null

const STORAGE_KEY = 'mbti_test_data'

const questions = computed(() => {
  if (testMode.value === 'quick') {
    return allQuestions.value.filter(q => q.is_quick === 1)
  }
  return allQuestions.value
})

const quickQuestionCount = computed(() => {
  return allQuestions.value.filter(q => q.is_quick === 1).length
})

const deepQuestionCount = computed(() => {
  return allQuestions.value.length
})

const currentQuestion = computed(() => {
  return questions.value[currentIndex.value] || {}
})

const progressPercent = computed(() => {
  if (questions.value.length === 0) return 0
  return Math.round(((currentIndex.value + 1) / questions.value.length) * 100)
})

function getDimensionName(dimension) {
  const map = {
    'EI': '内外向',
    'SN': '感觉 - 直觉',
    'TF': '思维 - 情感',
    'JP': '判断 - 知觉'
  }
  return map[dimension] || dimension
}

function selectMode(mode) {
  testMode.value = mode
  answers.value = new Array(questions.value.length).fill(null)
  saveToStorage()
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      if (data.allQuestions && data.answers && data.currentIndex !== undefined && data.testMode) {
        allQuestions.value = data.allQuestions
        testMode.value = data.testMode
        answers.value = data.answers
        currentIndex.value = data.currentIndex
        started.value = true
        selectedAnswer.value = data.selectedAnswer || null
        totalTime.value = data.totalTime || 0
        return true
      }
    }
  } catch (e) {
    console.error('Failed to load from storage:', e)
  }
  return false
}

function saveToStorage() {
  try {
    const data = {
      allQuestions: allQuestions.value,
      testMode: testMode.value,
      answers: answers.value,
      currentIndex: currentIndex.value,
      selectedAnswer: selectedAnswer.value,
      totalTime: totalTime.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save to storage:', e)
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear storage:', e)
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    totalTime.value++
  }, 1000)
}

function startCountdown() {
  countdown.value = 30
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval)
  if (countdownInterval) clearInterval(countdownInterval)
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

watch(currentIndex, () => {
  startCountdown()
})

async function initTest() {
  loading.value = true
  error.value = null
  try {
    const res = await api.getMbtiQuestions()
    allQuestions.value = res || []
    answers.value = new Array(questions.value.length).fill(null)
    started.value = false
    finished.value = false
    currentIndex.value = 0
    selectedAnswer.value = null
    result.value = null
    totalTime.value = 0
    testMode.value = null
    clearStorage()
  } catch (err) {
    error.value = '加载题目失败，请稍后重试'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function startTest() {
  if (!testMode.value) return
  started.value = true
  answers.value = new Array(questions.value.length).fill(null)
  currentIndex.value = 0
  selectedAnswer.value = null
  startTimer()
  startCountdown()
}

function selectAnswer(option) {
  selectedAnswer.value = option
  answers.value[currentIndex.value] = option
  saveToStorage()
}

function goToPrevious() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedAnswer.value = answers.value[currentIndex.value]
    saveToStorage()
  }
}

function goToNext() {
  if (!selectedAnswer.value) return

  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    selectedAnswer.value = answers.value[currentIndex.value]
    saveToStorage()
  } else {
    submitAnswers()
  }
}

async function submitAnswers() {
  loading.value = true
  error.value = null
  stopTimer()

  try {
    const payload = questions.value.map((q, index) => ({
      question_id: q.id,
      answer: answers.value[index]
    }))

    const res = await api.submitMbtiAnswers(payload)
    result.value = res
    finished.value = true
    clearStorage()
  } catch (err) {
    error.value = '提交答案失败，请稍后重试'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function retakeTest() {
  stopTimer()
  clearStorage()
  testMode.value = null
  started.value = false
  finished.value = false
  currentIndex.value = 0
  selectedAnswer.value = null
  result.value = null
  totalTime.value = 0
  answers.value = []
}

function backToHome() {
  router.push('/explore/')
}

onMounted(() => {
  const loaded = loadFromStorage()
  if (loaded) {
    startTimer()
    startCountdown()
  } else {
    initTest()
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>