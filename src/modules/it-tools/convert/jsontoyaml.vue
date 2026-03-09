<script setup>
import { ref, computed, inject } from 'vue'

const toast = inject('toast')
const activeMode = ref('jsonToYaml')

const jsonInput = ref('{\n  "name": "张三",\n  "age": 25,\n  "email": "test@example.com"\n}')
const yamlInput = ref('')
const output = ref('')

const jsonError = computed(() => {
  try {
    JSON.parse(jsonInput.value)
    return ''
  } catch (e) {
    return e.message
  }
})

function jsonToYaml(obj, indent = 0) {
  const spaces = '  '.repeat(indent)
  let result = ''
  
  if (obj === null) return 'null\n'
  if (obj === undefined) return ''
  
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        result += `${spaces}- ${jsonToYaml(item, indent + 1)}`
      }
    } else {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          result += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`
        } else {
          result += `${spaces}${key}: ${jsonToYaml(value, indent)}\n`
        }
      }
    }
  } else {
    result = String(obj) + '\n'
  }
  
  return result
}

function yamlToJson(yaml) {
  const lines = yaml.split('\n')
  const result = {}
  const stack = [{ obj: result, indent: -1 }]
  
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    
    const indent = line.search(/\S/)
    const keyValue = line.trim()
    
    if (keyValue.includes(':')) {
      const [key, ...valueParts] = keyValue.split(':')
      const value = valueParts.join(':').trim()
      
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop()
      }
      
      const current = stack[stack.length - 1].obj
      
      if (value) {
        current[key.trim()] = parseValue(value)
      } else {
        current[key.trim()] = {}
        stack.push({ obj: current[key.trim()], indent })
      }
    } else if (keyValue.startsWith('-')) {
      const value = keyValue.substring(1).trim()
      const current = stack[stack.length - 1].obj
      
      if (!Array.isArray(current)) {
        const arr = []
        stack[stack.length - 1].obj = arr
        stack.push({ obj: arr, indent: indent + 2 })
      }
      stack[stack.length - 1].obj.push(parseValue(value))
    }
  }
  
  return result
}

function parseValue(value) {
  if (value === 'null' || value === '~') return null
  if (value === 'true') return true
  if (value === 'false') return false
  if (!isNaN(value) && value !== '') return Number(value)
  return value
}

function convert() {
  if (activeMode.value === 'jsonToYaml') {
    try {
      const obj = JSON.parse(jsonInput.value)
      output.value = jsonToYaml(obj).trim()
    } catch (e) {
      toast.error('JSON 格式不正确')
    }
  } else {
    try {
      const obj = yamlToJson(yamlInput.value)
      output.value = JSON.stringify(obj, null, 2)
    } catch (e) {
      toast.error('YAML 格式不正确')
    }
  }
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('复制成功！')
  } catch (e) {
    toast.error('复制失败')
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex gap-2 mb-4">
      <button
        @click="activeMode = 'jsonToYaml'; convert()"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          activeMode === 'jsonToYaml'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        JSON → YAML
      </button>
      <button
        @click="activeMode = 'yamlToJson'; convert()"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          activeMode === 'yamlToJson'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        YAML → JSON
      </button>
    </div>

    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col min-h-[300px]">
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700">
            {{ activeMode === 'jsonToYaml' ? 'JSON 输入' : 'YAML 输入' }}
          </label>
          <span v-if="activeMode === 'jsonToYaml' && jsonError" class="text-xs text-red-500">JSON 格式错误</span>
        </div>
        <textarea
          v-if="activeMode === 'jsonToYaml'"
          v-model="jsonInput"
          @input="convert"
          class="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
          :class="{ 'border-red-300': jsonError }"
          placeholder="输入 JSON..."
        />
        <textarea
          v-else
          v-model="yamlInput"
          @input="convert"
          class="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
          placeholder="输入 YAML..."
        />
      </div>
      <div class="flex flex-col min-h-[300px]">
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700">
            {{ activeMode === 'jsonToYaml' ? 'YAML 输出' : 'JSON 输出' }}
          </label>
        </div>
        <div class="relative flex-1">
          <textarea
            v-model="output"
            readonly
            class="w-full h-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
            placeholder="转换结果..."
          />
          <button
            @click="copy(output)"
            class="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            复制
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
