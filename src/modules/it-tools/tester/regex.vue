<script setup>
import { ref, computed } from 'vue'

const regex = ref('')
const text = ref('')
const global = ref(true)
const ignoreCase = ref(false)
const multiline = ref(false)
const dotAll = ref(true)

const regexError = computed(() => {
  if (!regex.value) return ''
  try {
    new RegExp(regex.value)
    return ''
  } catch (e) {
    return e.message
  }
})

const results = computed(() => {
  if (!regex.value || !text.value || regexError.value) {
    return []
  }

  let flags = ''
  if (global.value) flags += 'g'
  if (ignoreCase.value) flags += 'i'
  if (multiline.value) flags += 'm'
  if (dotAll.value) flags += 's'

  try {
    const re = new RegExp(regex.value, flags)
    const matches = []
    let match

    if (global.value) {
      while ((match = re.exec(text.value)) !== null) {
        if (match[0] === '') {
          re.lastIndex++
          continue
        }
        matches.push({
          index: match.index,
          value: match[0],
          length: match[0].length,
          groups: match.groups || {},
          captures: match.slice(1),
        })
        if (re.lastIndex === match.index) {
          re.lastIndex++
        }
      }
    } else {
      match = re.exec(text.value)
      if (match) {
        matches.push({
          index: match.index,
          value: match[0],
          length: match[0].length,
          groups: match.groups || {},
          captures: match.slice(1),
        })
      }
    }

    return matches
  } catch (e) {
    return []
  }
})

const highlightedText = computed(() => {
  if (!results.value.length || !text.value) {
    return text.value
  }

  let result = ''
  let lastIndex = 0

  const sortedResults = [...results.value].sort((a, b) => a.index - b.index)

  for (const match of sortedResults) {
    result += escapeHtml(text.value.slice(lastIndex, match.index))
    result += `<mark class="bg-yellow-200 px-0.5 rounded">${escapeHtml(match.value)}</mark>`
    lastIndex = match.index + match.length
  }
  result += escapeHtml(text.value.slice(lastIndex))

  return result
})

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
</script>

<template>
  <div class="h-full flex flex-col overflow-auto">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">正则表达式</label>
      <div class="flex gap-2">
        <span class="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">/</span>
        <input
          v-model="regex"
          type="text"
          class="flex-1 px-2 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
          placeholder="输入正则表达式..."
        />
        <span class="inline-flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-500">
          /{{ global ? 'g' : '' }}{{ ignoreCase ? 'i' : '' }}{{ multiline ? 'm' : '' }}{{ dotAll ? 's' : '' }}
        </span>
      </div>
      <p v-if="regexError" class="mt-1 text-sm text-red-500">{{ regexError }}</p>
    </div>

    <div class="mb-4">
      <div class="flex flex-wrap gap-3">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="global" class="rounded text-blue-500" />
          <span class="text-sm text-gray-700">全局匹配 (g)</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="ignoreCase" class="rounded text-blue-500" />
          <span class="text-sm text-gray-700">忽略大小写 (i)</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="multiline" class="rounded text-blue-500" />
          <span class="text-sm text-gray-700">多行模式 (m)</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="dotAll" class="rounded text-blue-500" />
          <span class="text-sm text-gray-700">单行模式 (s)</span>
        </label>
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">测试文本</label>
      <textarea
        v-model="text"
        class="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
        placeholder="输入要测试的文本..."
      />
    </div>

    <div class="flex-1 overflow-auto">
      <div class="mb-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">匹配结果</h3>
        <div v-if="results.length > 0" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-gray-500">位置</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500">匹配内容</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500">长度</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(match, idx) in results" :key="idx" class="border-t border-gray-100">
                <td class="px-3 py-2 text-gray-600">{{ match.index }}</td>
                <td class="px-3 py-2 font-mono text-blue-600">{{ match.value }}</td>
                <td class="px-3 py-2 text-gray-600">{{ match.length }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-gray-400 text-sm p-4 text-center border border-gray-200 rounded-lg">
          {{ regex && text ? '无匹配结果' : '请输入正则表达式和测试文本' }}
        </div>
      </div>

      <div v-if="results.length > 0">
        <h3 class="text-sm font-medium text-gray-700 mb-2">高亮预览</h3>
        <div class="p-3 bg-white border border-gray-200 rounded-lg font-mono text-sm whitespace-pre-wrap break-all">
          <span v-html="highlightedText"></span>
        </div>
      </div>
    </div>
  </div>
</template>
