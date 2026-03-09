<script setup>
import { ref, computed } from 'vue'

const urlToParse = ref('https://user:password@example.com:8080/path?key1=value1&key2=value2#hash')

const urlParsed = computed(() => {
  try {
    return new URL(urlToParse.value)
  } catch {
    return null
  }
})

const isValid = computed(() => urlParsed.value !== null)

const properties = [
  { title: '协议 (Protocol)', key: 'protocol' },
  { title: '用户名 (Username)', key: 'username' },
  { title: '密码 (Password)', key: 'password' },
  { title: '主机名 (Hostname)', key: 'hostname' },
  { title: '端口 (Port)', key: 'port' },
  { title: '路径 (Path)', key: 'pathname' },
  { title: '查询参数 (Search)', key: 'search' },
  { title: '锚点 (Hash)', key: 'hash' },
  { title: '完整主机 (Host)', key: 'host' },
  { title: '来源 (Origin)', key: 'origin' },
]

const searchParams = computed(() => {
  if (!urlParsed.value) return []
  return Array.from(urlParsed.value.searchParams.entries()).map(([key, value]) => ({ key, value }))
})

function copyToClipboard(text) {
  if (!text) return
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="h-full flex flex-col overflow-auto">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">URL 地址</label>
      <input
        v-model="urlToParse"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        placeholder="输入要解析的 URL..."
      />
      <p v-if="!isValid && urlToParse" class="mt-1 text-sm text-red-500">无效的 URL 格式</p>
    </div>

    <div v-if="isValid" class="flex-1 overflow-auto">
      <div class="mb-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">URL 组成部分</h3>
        <div class="space-y-2">
          <div v-for="prop in properties" :key="prop.key" class="flex items-center">
            <label class="w-36 flex-shrink-0 text-sm text-gray-600">{{ prop.title }}</label>
            <div class="flex-1 flex items-center gap-2">
              <input
                :value="urlParsed[prop.key]"
                readonly
                type="text"
                class="flex-1 px-3 py-1.5 border border-gray-200 rounded bg-gray-50 font-mono text-sm"
              />
              <button
                @click="copyToClipboard(urlParsed[prop.key])"
                class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                复制
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="searchParams.length > 0">
        <h3 class="text-sm font-medium text-gray-700 mb-2">查询参数</h3>
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-gray-500">参数名</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500">参数值</th>
                <th class="px-3 py-2 text-right w-20">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="param in searchParams" :key="param.key" class="border-t border-gray-100">
                <td class="px-3 py-2 font-mono text-blue-600">{{ param.key }}</td>
                <td class="px-3 py-2 font-mono text-gray-600 break-all">{{ param.value }}</td>
                <td class="px-3 py-2 text-right">
                  <button
                    @click="copyToClipboard(param.value)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    复制
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="flex-1 flex items-center justify-center text-gray-400">
      <p>请输入有效的 URL 地址</p>
    </div>
  </div>
</template>
