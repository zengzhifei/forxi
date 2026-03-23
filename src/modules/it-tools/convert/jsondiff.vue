<script setup>
import { ref, computed } from 'vue'

const json1 = ref('{\n  "name": "张三",\n  "age": 30\n}')
const json2 = ref('{\n  "name": "李四",\n  "age": 25,\n  "city": "北京"\n}')

const parsed1 = computed(() => {
  try {
    return JSON.parse(json1.value)
  } catch {
    return null
  }
})

const parsed2 = computed(() => {
  try {
    return JSON.parse(json2.value)
  } catch {
    return null
  }
})

const diff = computed(() => {
  if (!parsed1.value || !parsed2.value) return []

  const differences = []
  const allKeys = new Set([...Object.keys(parsed1.value || {}), ...Object.keys(parsed2.value || {})])

  for (const key of allKeys) {
    const val1 = parsed1.value?.[key]
    const val2 = parsed2.value?.[key]

    if (JSON.stringify(val1) !== JSON.stringify(val2)) {
      if (val1 === undefined) {
        differences.push({ type: 'added', key, value1: null, value2: val2 })
      } else if (val2 === undefined) {
        differences.push({ type: 'removed', key, value1: val1, value2: null })
      } else {
        differences.push({ type: 'changed', key, value1: val1, value2: val2 })
      }
    }
  }

  return differences
})

const error1 = computed(() => {
  try {
    JSON.parse(json1.value)
    return ''
  } catch (e) {
    return e.message
  }
})

const error2 = computed(() => {
  try {
    JSON.parse(json2.value)
    return ''
  } catch (e) {
    return e.message
  }
})

function formatJson(value) {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}
</script>

<template>
  <div class="h-full flex flex-col overflow-auto">
    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700">JSON 1</label>
          <span v-if="error1" class="text-xs text-red-500">JSON 格式错误</span>
        </div>
        <textarea
          v-model="json1"
          class="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 resize-none font-mono text-sm"
          :class="{ 'border-red-300': error1 }"
          placeholder="输入第一个 JSON..."
        />
      </div>
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700">JSON 2</label>
          <span v-if="error2" class="text-xs text-red-500">JSON 格式错误</span>
        </div>
        <textarea
          v-model="json2"
          class="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 resize-none font-mono text-sm"
          :class="{ 'border-red-300': error2 }"
          placeholder="输入第二个 JSON..."
        />
      </div>
    </div>

    <div class="flex-1 overflow-auto">
      <h3 class="text-sm font-medium text-gray-700 mb-2">差异结果</h3>
      <div v-if="diff.length > 0" class="space-y-2">
        <div
          v-for="(item, idx) in diff"
          :key="idx"
          class="p-3 rounded-lg border"
          :class="{
            'bg-green-50 border-green-200': item.type === 'added',
            'bg-red-50 border-red-200': item.type === 'removed',
            'bg-yellow-50 border-yellow-200': item.type === 'changed'
          }"
        >
          <div class="flex items-center gap-2 mb-2">
            <span
              class="px-2 py-0.5 text-xs font-medium rounded"
              :class="{
                'bg-green-200 text-green-700': item.type === 'added',
                'bg-red-200 text-red-700': item.type === 'removed',
                'bg-yellow-200 text-yellow-700': item.type === 'changed'
              }"
            >
              {{ item.type === 'added' ? '新增' : item.type === 'removed' ? '删除' : '修改' }}
            </span>
            <span class="font-mono font-medium text-gray-800">{{ item.key }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="font-mono text-gray-600">
              <span v-if="item.value1 !== null">旧值: {{ formatJson(item.value1) }}</span>
              <span v-else class="text-gray-400">(无)</span>
            </div>
            <div class="font-mono text-gray-600">
              <span v-if="item.value2 !== null">新值: {{ formatJson(item.value2) }}</span>
              <span v-else class="text-gray-400">(无)</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-400 text-center py-8 border border-gray-200 rounded-lg">
        {{ parsed1 && parsed2 ? '两个 JSON 完全相同' : '请输入有效的 JSON' }}
      </div>
    </div>
  </div>
</template>
