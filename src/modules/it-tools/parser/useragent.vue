<script setup>
import { ref, computed, onMounted } from 'vue'

const ua = ref('')

onMounted(() => {
  ua.value = navigator.userAgent
})

function parseUserAgent(userAgent) {
  const info = {
    browser: { name: 'Unknown', version: '' },
    os: { name: 'Unknown', version: '' },
    device: { type: '', model: '', vendor: '' },
    engine: { name: 'Unknown', version: '' },
    cpu: { architecture: 'Unknown' },
  }

  if (!userAgent) return info

  // Browser detection
  if (userAgent.includes('Firefox')) {
    const match = userAgent.match(/Firefox\/(\d+)/)
    info.browser = { name: 'Firefox', version: match ? match[1] : '' }
  } else if (userAgent.includes('Edg/')) {
    const match = userAgent.match(/Edg\/(\d+)/)
    info.browser = { name: 'Microsoft Edge', version: match ? match[1] : '' }
  } else if (userAgent.includes('Chrome')) {
    const match = userAgent.match(/Chrome\/(\d+)/)
    info.browser = { name: 'Chrome', version: match ? match[1] : '' }
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    const match = userAgent.match(/Version\/(\d+)/)
    info.browser = { name: 'Safari', version: match ? match[1] : '' }
  } else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
    const match = userAgent.match(/OPR\/(\d+)/)
    info.browser = { name: 'Opera', version: match ? match[1] : '' }
  }

  // OS detection
  if (userAgent.includes('Windows')) {
    info.os.name = 'Windows'
    if (userAgent.includes('Windows NT 10.0')) info.os.version = '10/11'
    else if (userAgent.includes('Windows NT 6.3')) info.os.version = '8.1'
    else if (userAgent.includes('Windows NT 6.2')) info.os.version = '8'
    else if (userAgent.includes('Windows NT 6.1')) info.os.version = '7'
  } else if (userAgent.includes('Mac OS X')) {
    const match = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/)
    info.os.name = 'macOS'
    info.os.version = match ? match[1].replace(/_/g, '.') : ''
  } else if (userAgent.includes('Linux')) {
    info.os.name = 'Linux'
    if (userAgent.includes('Ubuntu')) info.os.name = 'Ubuntu'
    else if (userAgent.includes('Fedora')) info.os.name = 'Fedora'
    else if (userAgent.includes('Debian')) info.os.name = 'Debian'
  } else if (userAgent.includes('Android')) {
    const match = userAgent.match(/Android (\d+)/)
    info.os.name = 'Android'
    info.os.version = match ? match[1] : ''
    info.device.type = 'Mobile'
  } else if (userAgent.includes('iPhone')) {
    const match = userAgent.match(/OS (\d+[._]\d+)/)
    info.os.name = 'iOS'
    info.os.version = match ? match[1].replace(/_/g, '.') : ''
    info.device.type = 'Mobile'
    info.device.model = 'iPhone'
  } else if (userAgent.includes('iPad')) {
    const match = userAgent.match(/OS (\d+[._]\d+)/)
    info.os.name = 'iPadOS'
    info.os.version = match ? match[1].replace(/_/g, '.') : ''
    info.device.type = 'Tablet'
    info.device.model = 'iPad'
  }

  // Device detection
  if (userAgent.includes('Mobile')) {
    info.device.type = 'Mobile'
  }
  if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
    info.device.type = 'Tablet'
  }

  // Engine detection
  if (userAgent.includes('AppleWebKit')) {
    info.engine.name = 'WebKit'
    const match = userAgent.match(/AppleWebKit\/(\d+)/)
    info.engine.version = match ? match[1] : ''
  } else if (userAgent.includes('Gecko')) {
    info.engine.name = 'Gecko'
  } else if (userAgent.includes('Presto')) {
    info.engine.name = 'Presto'
  }

  // CPU architecture
  if (userAgent.includes('x64') || userAgent.includes('Win64') || userAgent.includes('amd64')) {
    info.cpu.architecture = 'x86_64'
  } else if (userAgent.includes('x86') || userAgent.includes('i686')) {
    info.cpu.architecture = 'x86'
  } else if (userAgent.includes('ARM')) {
    info.cpu.architecture = 'ARM'
  }

  return info
}

const userAgentInfo = computed(() => parseUserAgent(ua.value))

const sections = [
  {
    heading: '浏览器',
    items: [
      { label: '名称', key: 'name', getValue: (b) => b?.browser.name },
      { label: '版本', key: 'version', getValue: (b) => b?.browser.version },
    ],
  },
  {
    heading: '操作系统',
    items: [
      { label: '名称', key: 'name', getValue: (b) => b?.os.name },
      { label: '版本', key: 'version', getValue: (b) => b?.os.version },
    ],
  },
  {
    heading: '设备',
    items: [
      { label: '类型', key: 'type', getValue: (b) => b?.device.type || 'Desktop' },
      { label: '型号', key: 'model', getValue: (b) => b?.device.model || '-' },
      { label: '厂商', key: 'vendor', getValue: (b) => b?.device.vendor || '-' },
    ],
  },
  {
    heading: '引擎',
    items: [
      { label: '名称', key: 'name', getValue: (b) => b?.engine.name },
      { label: '版本', key: 'version', getValue: (b) => b?.engine.version },
    ],
  },
  {
    heading: 'CPU',
    items: [
      { label: '架构', key: 'architecture', getValue: (b) => b?.cpu.architecture },
    ],
  },
]

function getValue(item, info) {
  const value = item.getValue(info)
  return value && value !== '' ? value : '-'
}
</script>

<template>
  <div class="h-full flex flex-col overflow-auto">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">User Agent</label>
      <textarea
        v-model="ua"
        class="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
        placeholder="输入 User Agent 字符串..."
      />
    </div>

    <div class="flex-1 overflow-auto">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="section in sections"
          :key="section.heading"
          class="bg-white border border-gray-200 rounded-lg p-4"
        >
          <h3 class="text-base font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">
            {{ section.heading }}
          </h3>
          <div class="space-y-2">
            <div v-for="item in section.items" :key="item.key" class="flex justify-between">
              <span class="text-sm text-gray-500">{{ item.label }}</span>
              <span class="text-sm font-medium text-gray-800">{{ getValue(item, userAgentInfo) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
