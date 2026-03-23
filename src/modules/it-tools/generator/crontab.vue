<script setup>
import { ref, computed } from 'vue'

const crontab = ref('* * * * *')

const scheduleDescriptions = [
  { pattern: '* * * * *', description: '每分钟' },
  { pattern: '0 * * * *', description: '每小时整点' },
  { pattern: '0 0 * * *', description: '每天午夜 (00:00)' },
  { pattern: '0 0 * * 0', description: '每周日午夜' },
  { pattern: '0 0 1 * *', description: '每月第一天午夜' },
  { pattern: '*/5 * * * *', description: '每 5 分钟' },
  { pattern: '0 */2 * * *', description: '每 2 小时' },
  { pattern: '0 9 * * 1-5', description: '工作日上午 9 点' },
]

const currentTime = ref(new Date())

setInterval(() => {
  currentTime.value = new Date()
}, 1000)

function parseCrontab(cron) {
  const parts = cron.trim().split(/\s+/)
  if (parts.length < 5) return null

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

  const nextRuns = []
  const now = currentTime.value

  for (let i = 0; i < 5; i++) {
    const next = getNextRun(new Date(now.getTime() + i * 60000 * 60 * 24), parts)
    if (next) nextRuns.push(next)
  }

  return {
    minute,
    hour,
    dayOfMonth,
    month,
    dayOfWeek,
    nextRuns,
  }
}

function getNextRun(date, parts) {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

  const result = new Date(date)
  result.setSeconds(0, 0)

  if (minute !== '*') {
    const mins = parseValues(minute, 0, 59)
    if (!mins.includes(result.getMinutes())) {
      result.setMinutes(mins.find(m => m > result.getMinutes()) || mins[0])
      if (result <= date) {
        result.setHours(result.getHours() + 1)
        result.setMinutes(mins[0])
      }
    }
  }

  if (hour !== '*') {
    const hours = parseValues(hour, 0, 23)
    if (!hours.includes(result.getHours())) {
      result.setHours(hours.find(h => h > result.getHours()) || hours[0])
      result.setMinutes(0)
    }
  }

  return result
}

function parseValues(value, min, max) {
  if (value === '*') {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i)
  }

  const values = []
  const parts = value.split(',')

  for (const part of parts) {
    if (part.includes('/')) {
      const [range, step] = part.split('/')
      const stepNum = parseInt(step)
      const start = range === '*' ? min : parseInt(range)
      for (let i = start; i <= max; i += stepNum) {
        values.push(i)
      }
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      for (let i = start; i <= end; i++) {
        values.push(i)
      }
    } else {
      values.push(parseInt(part))
    }
  }

  return [...new Set(values)].filter(v => v >= min && v <= max)
}

function describeCrontab(cron) {
  const parts = cron.trim().split(/\s+/)
  if (parts.length < 5) return '无效的 Cron 表达式'

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

  let desc = ''

  if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return '每分钟执行'
  }

  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

  if (minute !== '*') {
    if (minute.includes('/')) {
      desc += `每 ${minute.split('/')[1]} 分钟`
    } else {
      desc += `第 ${minute} 分钟`
    }
  }

  if (hour !== '*') {
    if (hour.includes('/')) {
      desc += `, 每 ${hour.split('/')[1]} 小时`
    } else {
      desc += hour ? `, ${hour} 点` : ''
    }
  }

  if (dayOfMonth !== '*') {
    desc += `, 每月 ${dayOfMonth} 日`
  }

  if (month !== '*') {
    const monthNum = parseInt(month)
    if (!isNaN(monthNum)) {
      desc += `, ${monthNames[monthNum - 1]}`
    }
  }

  if (dayOfWeek !== '*') {
    const dayNum = parseInt(dayOfWeek)
    if (!isNaN(dayNum)) {
      desc += `, ${dayNames[dayNum]}`
    }
  }

  return desc || '每分钟执行'
}

const parsedCrontab = computed(() => parseCrontab(crontab.value))
const description = computed(() => describeCrontab(crontab.value))

function formatDate(date) {
  if (!date) return ''
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const cronHelp = [
  { symbol: '*', meaning: '任意值' },
  { symbol: ',', meaning: '值列表分隔符，如 1,3,5' },
  { symbol: '-', meaning: '值范围，如 1-5 表示 1 到 5' },
  { symbol: '/', meaning: '步进值，如 */5 表示每 5 个值' },
]

const timeFields = [
  { label: '分钟 (0-59)', key: 'minute' },
  { label: '小时 (0-23)', key: 'hour' },
  { label: '日期 (1-31)', key: 'dayOfMonth' },
  { label: '月份 (1-12)', key: 'month' },
  { label: '星期 (0-6)', key: 'dayOfWeek' },
]
</script>

<template>
  <div class="h-full flex flex-col overflow-auto">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Crontab 表达式</label>
      <input
        v-model="crontab"
        type="text"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 font-mono text-lg"
        placeholder="* * * * *"
      />
      <p class="mt-2 text-sm text-gray-600">格式: 分钟 小时 日期 月份 星期</p>
    </div>

    <div class="mb-4 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
      <p class="text-zinc-700 font-medium">{{ description }}</p>
    </div>

    <div class="mb-4">
      <h3 class="text-sm font-medium text-gray-700 mb-2">常用示例</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in scheduleDescriptions"
          :key="item.pattern"
          @click="crontab = item.pattern"
          class="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
        >
          <span class="font-mono text-zinc-600">{{ item.pattern }}</span>
          <span class="ml-2 text-gray-500">{{ item.description }}</span>
        </button>
      </div>
    </div>

    <div class="mb-4">
      <h3 class="text-sm font-medium text-gray-700 mb-2">表达式说明</h3>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div v-for="item in cronHelp" :key="item.symbol" class="flex items-center gap-2">
          <code class="px-2 py-1 bg-gray-100 rounded font-mono text-zinc-600">{{ item.symbol }}</code>
          <span class="text-gray-600">{{ item.meaning }}</span>
        </div>
      </div>
    </div>

    <div v-if="parsedCrontab" class="flex-1 overflow-auto">
      <h3 class="text-sm font-medium text-gray-700 mb-2">解析结果</h3>
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
        <table class="w-full text-sm">
          <tbody>
            <tr v-for="field in timeFields" :key="field.key" class="border-b border-gray-100">
              <td class="px-3 py-2 text-gray-500 w-32">{{ field.label }}</td>
              <td class="px-3 py-2 font-mono text-gray-800">{{ parsedCrontab[field.key] }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-sm font-medium text-gray-700 mb-2">接下来 5 次执行时间</h3>
      <div class="space-y-2">
        <div
          v-for="(run, idx) in parsedCrontab.nextRuns"
          :key="idx"
          class="px-3 py-2 bg-gray-50 rounded font-mono text-sm"
        >
          {{ formatDate(run) }}
        </div>
      </div>
    </div>
  </div>
</template>
