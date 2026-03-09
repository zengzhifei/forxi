<script setup>
import { ref, computed } from 'vue'

const activeMode = ref('jsonToJava')

const jsonInput = ref('{\n  "userId": 1,\n  "userName": "张三",\n  "email": "test@example.com",\n  "age": 25,\n  "isActive": true\n}')
const javaInput = ref('')
const output = ref('')

const className = ref('User')

const jsonError = computed(() => {
  try {
    JSON.parse(jsonInput.value)
    return ''
  } catch (e) {
    return e.message
  }
})

function toJavaType(jsonValue, fieldName) {
  if (jsonValue === null) return 'Object'
  if (Array.isArray(jsonValue)) {
    if (jsonValue.length > 0) {
      const firstItem = jsonValue[0]
      if (typeof firstItem === 'object' && firstItem !== null) {
        return `List<${capitalize(fieldName)}Item>`
      }
      return `List<${toJavaType(firstItem, fieldName)}>`
    }
    return 'List<Object>'
  }
  if (typeof jsonValue === 'object') {
    return capitalize(fieldName)
  }
  if (typeof jsonValue === 'string') return 'String'
  if (typeof jsonValue === 'number') {
    return Number.isInteger(jsonValue) ? 'Integer' : 'Double'
  }
  if (typeof jsonValue === 'boolean') return 'Boolean'
  return 'Object'
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function toJavaFieldName(str) {
  if (!str) return ''
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function jsonToJava(jsonStr, classNameStr) {
  try {
    const obj = JSON.parse(jsonStr)
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return '// 请输入 JSON 对象'
    }

    const fields = []
    const nestedClasses = []

    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toJavaFieldName(key)
      const javaType = toJavaType(value, key)
      fields.push({ name: fieldName, type: javaType, originalKey: key, value })

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nestedClassName = capitalize(key)
        const nestedCode = generateClass(nestedClassName, value)
        nestedClasses.push(nestedCode)
      }

      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const itemClassName = capitalize(key) + 'Item'
        const nestedCode = generateClass(itemClassName, value[0])
        nestedClasses.push(nestedCode)
      }
    }

    let result = `import lombok.Data;\n\n`
    result += `@Data\n`
    result += `public class ${classNameStr} {\n`
    for (const field of fields) {
      result += `    private ${field.type} ${field.name};\n`
    }
    result += '}'

    for (const nested of nestedClasses.reverse()) {
      result = nested + '\n\n' + result
    }

    return result
  } catch (e) {
    return '// JSON 解析错误: ' + e.message
  }
}

function generateClass(classNameStr, obj) {
  const fields = []
  for (const [key, value] of Object.entries(obj)) {
    const fieldName = toJavaFieldName(key)
    const javaType = toJavaType(value, key)
    fields.push({ name: fieldName, type: javaType })
  }

  return `@Data\nclass ${classNameStr} {\n${fields.map(f => `    private ${f.type} ${f.name};`).join('\n')}\n}`
}

function javaToJson(javaCode) {
  try {
    const classMatch = javaCode.match(/class\s+(\w+)/)
    if (!classMatch) {
      return '// 无法解析 Java 类，请确保包含 class 声明'
    }

    const classNameStr = classMatch[1]
    const fieldMatches = javaCode.matchAll(/private\s+(\w+)\s+(\w+)\s*;/g)
    const fields = []
    for (const match of fieldMatches) {
      const type = match[1]
      const name = match[2]
      fields.push({ type, name })
    }

    const jsonObj = {}
    for (const field of fields) {
      const jsonKey = field.name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
      const defaultValue = getDefaultJsonValue(field.type)
      jsonObj[jsonKey] = defaultValue
    }

    return JSON.stringify(jsonObj, null, 2)
  } catch (e) {
    return '// 解析错误: ' + e.message
  }
}

function getDefaultJsonValue(javaType) {
  const type = javaType.replace(/<[^>]+>/g, '')
  switch (type) {
    case 'String':
    case 'Date':
    case 'LocalDateTime':
      return 'string'
    case 'Integer':
    case 'Long':
    case 'Short':
    case 'Byte':
      return 0
    case 'Double':
    case 'Float':
    case 'BigDecimal':
      return 0.0
    case 'Boolean':
      return true
    case 'List':
    case 'Set':
      return []
    case 'Map':
      return {}
    default:
      return null
  }
}

function convert() {
  if (activeMode.value === 'jsonToJava') {
    output.value = jsonToJava(jsonInput.value, className.value || 'User')
  } else {
    output.value = javaToJson(javaInput.value)
  }
}

function copyToClipboard() {
  navigator.clipboard.writeText(output.value)
}

const isJsonValid = computed(() => !jsonError.value)
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex gap-2 mb-4">
      <button
        @click="activeMode = 'jsonToJava'; convert()"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          activeMode === 'jsonToJava'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        JSON → Java
      </button>
      <button
        @click="activeMode = 'javaToJson'; convert()"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          activeMode === 'javaToJson'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        Java → JSON
      </button>
    </div>

    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col min-h-[300px]">
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700">
            {{ activeMode === 'jsonToJava' ? 'JSON 输入' : 'Java 代码' }}
          </label>
          <span v-if="activeMode === 'jsonToJava' && jsonError" class="text-xs text-red-500">JSON 格式错误</span>
        </div>
        <textarea
          v-if="activeMode === 'jsonToJava'"
          v-model="jsonInput"
          @input="convert"
          class="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
          :class="{ 'border-red-300': jsonError }"
          placeholder="输入 JSON..."
        />
        <textarea
          v-else
          v-model="javaInput"
          @input="convert"
          class="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
          placeholder="输入 Java 代码..."
        />
      </div>
      <div class="flex flex-col min-h-[300px]">
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700">
            {{ activeMode === 'jsonToJava' ? 'Java 代码' : 'JSON 输出' }}
          </label>
          <div v-if="activeMode === 'jsonToJava'" class="flex gap-2">
            <input
              v-model="className"
              @input="convert"
              type="text"
              class="px-2 py-1 border border-gray-300 rounded text-sm font-mono w-24"
              placeholder="类名"
            />
          </div>
        </div>
        <div class="relative flex-1">
          <textarea
            v-model="output"
            readonly
            class="w-full h-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
            placeholder="转换结果..."
          />
          <button
            @click="copyToClipboard"
            class="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            复制
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
