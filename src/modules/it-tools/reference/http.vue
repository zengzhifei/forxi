<script setup>
import { ref, computed } from 'vue'

const search = ref('')

const codesByCategories = [
  {
    category: '1xx 信息响应',
    codes: [
      { code: 100, name: 'Continue', description: '等待客户端发送请求体', type: 'HTTP' },
      { code: 101, name: 'Switching Protocols', description: '服务器同意切换协议', type: 'HTTP' },
      { code: 102, name: 'Processing', description: '服务器正在处理请求', type: 'WebDav' },
      { code: 103, name: 'Early Hints', description: '服务器返回部分响应头', type: 'HTTP' },
    ],
  },
  {
    category: '2xx 成功响应',
    codes: [
      { code: 200, name: 'OK', description: '请求成功', type: 'HTTP' },
      { code: 201, name: 'Created', description: '资源创建成功', type: 'HTTP' },
      { code: 202, name: 'Accepted', description: '请求已接受，等待处理', type: 'HTTP' },
      { code: 203, name: 'Non-Authoritative Information', description: '代理修改了内容', type: 'HTTP' },
      { code: 204, name: 'No Content', description: '请求成功，无返回内容', type: 'HTTP' },
      { code: 205, name: 'Reset Content', description: '重置文档视图', type: 'HTTP' },
      { code: 206, name: 'Partial Content', description: '部分内容响应', type: 'HTTP' },
      { code: 207, name: 'Multi-Status', description: '多状态响应', type: 'WebDav' },
      { code: 208, name: 'Already Reported', description: '已报告', type: 'WebDav' },
      { code: 226, name: 'IM Used', description: 'IM 已使用', type: 'HTTP' },
    ],
  },
  {
    category: '3xx 重定向',
    codes: [
      { code: 300, name: 'Multiple Choices', description: '多个选项可供选择', type: 'HTTP' },
      { code: 301, name: 'Moved Permanently', description: '永久重定向', type: 'HTTP' },
      { code: 302, name: 'Found', description: '临时重定向', type: 'HTTP' },
      { code: 303, name: 'See Other', description: '查看其他位置', type: 'HTTP' },
      { code: 304, name: 'Not Modified', description: '未修改，使用缓存', type: 'HTTP' },
      { code: 305, name: 'Use Proxy', description: '使用代理', type: 'HTTP' },
      { code: 307, name: 'Temporary Redirect', description: '临时重定向', type: 'HTTP' },
      { code: 308, name: 'Permanent Redirect', description: '永久重定向', type: 'HTTP' },
    ],
  },
  {
    category: '4xx 客户端错误',
    codes: [
      { code: 400, name: 'Bad Request', description: '请求语法错误', type: 'HTTP' },
      { code: 401, name: 'Unauthorized', description: '需要认证', type: 'HTTP' },
      { code: 402, name: 'Payment Required', description: '需要付款', type: 'HTTP' },
      { code: 403, name: 'Forbidden', description: '拒绝访问', type: 'HTTP' },
      { code: 404, name: 'Not Found', description: '资源未找到', type: 'HTTP' },
      { code: 405, name: 'Method Not Allowed', description: '方法不允许', type: 'HTTP' },
      { code: 406, name: 'Not Acceptable', description: '不可接受', type: 'HTTP' },
      { code: 407, name: 'Proxy Authentication Required', description: '需要代理认证', type: 'HTTP' },
      { code: 408, name: 'Request Timeout', description: '请求超时', type: 'HTTP' },
      { code: 409, name: 'Conflict', description: '冲突', type: 'HTTP' },
      { code: 410, name: 'Gone', description: '资源已永久删除', type: 'HTTP' },
      { code: 411, name: 'Length Required', description: '需要 Content-Length', type: 'HTTP' },
      { code: 412, name: 'Precondition Failed', description: '前置条件失败', type: 'HTTP' },
      { code: 413, name: 'Payload Too Large', description: '请求体过大', type: 'HTTP' },
      { code: 414, name: 'URI Too Long', description: 'URI 过长', type: 'HTTP' },
      { code: 415, name: 'Unsupported Media Type', description: '不支持的媒体类型', type: 'HTTP' },
      { code: 416, name: 'Range Not Satisfiable', description: '范围不可满足', type: 'HTTP' },
      { code: 417, name: 'Expectation Failed', description: '期望失败', type: 'HTTP' },
      { code: 418, name: "I'm a teapot", description: '我是茶壶，不能煮咖啡', type: 'HTTP' },
      { code: 421, name: 'Misdirected Request', description: '错误路由', type: 'HTTP' },
      { code: 422, name: 'Unprocessable Entity', description: '无法处理的实体', type: 'HTTP' },
      { code: 423, name: 'Locked', description: '已锁定', type: 'HTTP' },
      { code: 424, name: 'Failed Dependency', description: '依赖失败', type: 'HTTP' },
      { code: 425, name: 'Too Early', description: '请求过早', type: 'HTTP' },
      { code: 426, name: 'Upgrade Required', description: '需要升级', type: 'HTTP' },
      { code: 428, name: 'Precondition Required', description: '需要条件请求', type: 'HTTP' },
      { code: 429, name: 'Too Many Requests', description: '请求过多', type: 'HTTP' },
      { code: 431, name: 'Request Header Fields Too Large', description: '请求头过大', type: 'HTTP' },
      { code: 451, name: 'Unavailable For Legal Reasons', description: '因法律原因不可用', type: 'HTTP' },
    ],
  },
  {
    category: '5xx 服务器错误',
    codes: [
      { code: 500, name: 'Internal Server Error', description: '内部服务器错误', type: 'HTTP' },
      { code: 501, name: 'Not Implemented', description: '未实现', type: 'HTTP' },
      { code: 502, name: 'Bad Gateway', description: '网关错误', type: 'HTTP' },
      { code: 503, name: 'Service Unavailable', description: '服务不可用', type: 'HTTP' },
      { code: 504, name: 'Gateway Timeout', description: '网关超时', type: 'HTTP' },
      { code: 505, name: 'HTTP Version Not Supported', description: 'HTTP 版本不支持', type: 'HTTP' },
      { code: 506, name: 'Variant Also Negotiates', description: '变体协商失败', type: 'HTTP' },
      { code: 507, name: 'Insufficient Storage', description: '存储不足', type: 'HTTP' },
      { code: 508, name: 'Loop Detected', description: '检测到循环', type: 'HTTP' },
      { code: 510, name: 'Not Extended', description: '未扩展', type: 'HTTP' },
      { code: 511, name: 'Network Authentication Required', description: '需要网络认证', type: 'HTTP' },
    ],
  },
]

const filteredCategories = computed(() => {
  if (!search.value) {
    return codesByCategories
  }

  const query = search.value.toLowerCase()
  const results = []

  for (const category of codesByCategories) {
    const matchingCodes = category.codes.filter(
      c =>
        c.code.toString().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
    )
    if (matchingCodes.length > 0) {
      results.push({
        category: `搜索结果 (${matchingCodes.length})`,
        codes: matchingCodes,
      })
    }
  }

  return results
})

function getCodeColor(code) {
  if (code >= 100 && code < 200) return 'bg-blue-100 text-blue-700 border-blue-200'
  if (code >= 200 && code < 300) return 'bg-green-100 text-green-700 border-green-200'
  if (code >= 300 && code < 400) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
  if (code >= 400 && code < 500) return 'bg-orange-100 text-orange-700 border-orange-200'
  if (code >= 500) return 'bg-red-100 text-red-700 border-red-200'
  return 'bg-gray-100 text-gray-700 border-gray-200'
}
</script>

<template>
  <div class="h-full flex flex-col overflow-auto">
    <div class="mb-4">
      <input
        v-model="search"
        type="text"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
        placeholder="搜索 HTTP 状态码..."
      />
    </div>

    <div class="flex-1 overflow-auto">
      <div v-for="{ category, codes } in filteredCategories" :key="category" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ category }}</h3>
        <div class="grid gap-2">
          <div
            v-for="item in codes"
            :key="item.code"
            :class="['p-3 rounded-lg border', getCodeColor(item.code)]"
          >
            <div class="font-bold text-lg">
              {{ item.code }} - {{ item.name }}
            </div>
            <div class="text-sm opacity-80 mt-1">
              {{ item.description }}
              <span v-if="item.type !== 'HTTP'" class="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">
                {{ item.type }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredCategories.length === 0" class="text-center text-gray-400 py-8">
        未找到匹配的状态码
      </div>
    </div>
  </div>
</template>
