<script setup>
import { ref, computed } from 'vue'

const activeMode = ref('jsonToGo')

const jsonInput = ref('{\n  "user_id": 1,\n  "user_name": "张三",\n  "email": "test@example.com",\n  "age": 25,\n  "is_active": true\n}')
const goInput = ref('')
const output = ref('')

const structName = ref('User')
const useJsonTag = ref(true)
const useOmitempty = ref(true)

const jsonError = computed(() => {
  try {
    JSON.parse(jsonInput.value)
    return ''
  } catch (e) {
    return e.message
  }
})

function toGoType(jsonValue) {
  if (jsonValue === null) return 'interface{}'
  if (Array.isArray(jsonValue)) {
    if (jsonValue.length > 0) {
      const firstItem = jsonValue[0]
      if (typeof firstItem === 'object' && firstItem !== null) {
        return '[]interface{}'
      }
      return `[]${toGoType(firstItem)}`
    }
    return '[]interface{}'
  }
  if (typeof jsonValue === 'object') {
    return 'interface{}'
  }
  if (typeof jsonValue === 'string') return 'string'
  if (typeof jsonValue === 'number') {
    return Number.isInteger(jsonValue) ? 'int' : 'float64'
  }
  if (typeof jsonValue === 'boolean') return 'bool'
  return 'interface{}'
}

function toGoFieldName(str) {
  if (!str) return ''
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
        .replace(/^[a-z]/, c => c.toUpperCase())
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function jsonToGo(jsonStr, structNameStr) {
  try {
    const obj = JSON.parse(jsonStr)
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return '// 请输入 JSON 对象'
    }

    const structs = []
    
    function generateStruct(name, data, isRoot = false) {
      const fields = []
      
      for (const [key, value] of Object.entries(data)) {
        const fieldName = toGoFieldName(key)
        let goType = toGoType(value)
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const nestedStructName = capitalize(key)
          goType = nestedStructName
          const nestedCode = generateStruct(nestedStructName, value)
          structs.push(nestedCode)
        }
        
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          const nestedStructName = capitalize(key) + 'Item'
          goType = `[]${nestedStructName}`
          const nestedCode = generateStruct(nestedStructName, value[0])
          structs.push(nestedCode)
        }

        let tag = ''
        if (useJsonTag.value) {
          tag = ` \`json:"${key}${useOmitempty.value ? ',omitempty' : ''}"\``
        }
        
        fields.push({ name: fieldName, type: goType, tag })
      }
      
      const structDef = `type ${name} struct {${fields.map(f => `\n${f.name.padEnd(20)} ${f.type.padEnd(15)}${f.tag}`).join('')}\n}`
      return structDef
    }

    const rootStruct = generateStruct(structNameStr, obj, true)
    
    let result = rootStruct
    for (const s of structs.reverse()) {
      result += '\n\n' + s
    }

    return result
  } catch (e) {
    return '// JSON 解析错误: ' + e.message
  }
}

function goToJson(goCode) {
  try {
    const structMatches = goCode.matchAll(/type\s+(\w+)\s+struct\s*\{([^}]+)\}/g)
    const structs = {}
    
    for (const match of structMatches) {
      const structName = match[1]
      const body = match[2]
      
      const fieldMatches = body.matchAll(/(\w+)\s+(\w+)(?:\s+\`[^`]*\`)?/g)
      const fields = []
      
      for (const fieldMatch of fieldMatches) {
        const fieldType = fieldMatch[2]
        const fieldName = fieldMatch[1]
        fields.push({ type: fieldType, name: fieldName })
      }
      
      structs[structName] = fields
    }

    if (Object.keys(structs).length === 0) {
      return '// 未找到 Go 结构体定义'
    }

    function getJsonValue(goType) {
      const baseType = goType.replace(/^\[\]/, '')
      switch (baseType) {
        case 'string': return '"string"'
        case 'int': 
        case 'int8':
        case 'int16':
        case 'int32':
        case 'int64':
        case 'uint':
        case 'uint8':
        case 'uint16':
        case 'uint32':
        case 'uint64':
          return 0
        case 'float32':
        case 'float64':
          return 0.0
        case 'bool':
          return true
        default:
          if (goType.startsWith('[]')) {
            return []
          }
          return {}
      }
    }

    const rootStructName = Object.keys(structs)[0]
    const fields = structs[rootStructName]
    const jsonObj = {}
    
    for (const field of fields) {
      const jsonKey = field.name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
      jsonObj[jsonKey] = getJsonValue(field.type)
    }

    return JSON.stringify(jsonObj, null, 2)
  } catch (e) {
    return '// 解析错误: ' + e.message
  }
}

function convert() {
  if (activeMode.value === 'jsonToGo') {
    output.value = jsonToGo(jsonInput.value, structName.value || 'User')
  } else {
    output.value = goToJson(goInput.value)
  }
}

function copyToClipboard() {
  navigator.clipboard.writeText(output.value)
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex gap-2 mb-4">
      <button
        @click="activeMode = 'jsonToGo'; convert()"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          activeMode === 'jsonToGo'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        JSON → Go
      </button>
      <button
        @click="activeMode = 'goToJson'; convert()"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          activeMode === 'goToJson'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        Go → JSON
      </button>
    </div>

    <div class="grid md:grid-cols-2 gap-4 mb-4 flex-1 min-h-0">
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700">
            {{ activeMode === 'jsonToGo' ? 'JSON 输入' : 'Go 代码' }}
          </label>
          <span v-if="activeMode === 'jsonToGo' && jsonError" class="text-xs text-red-500">JSON 格式错误</span>
        </div>
        <textarea
          v-if="activeMode === 'jsonToGo'"
          v-model="jsonInput"
          @input="convert"
          class="w-full h-full min-h-[300px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
          :class="{ 'border-red-300': jsonError }"
          placeholder="输入 JSON..."
        />
        <textarea
          v-else
          v-model="goInput"
          @input="convert"
          class="w-full h-full min-h-[300px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
          placeholder="输入 Go 结构体代码..."
        />
      </div>
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700">
            {{ activeMode === 'jsonToGo' ? 'Go 代码' : 'JSON 输出' }}
          </label>
          <div v-if="activeMode === 'jsonToGo'" class="flex gap-2">
            <input
              v-model="structName"
              @input="convert"
              type="text"
              class="px-2 py-1 border border-gray-300 rounded text-sm font-mono w-24"
              placeholder="结构体名"
            />
          </div>
        </div>
        <div class="flex gap-2 mb-2" v-if="activeMode === 'jsonToGo'">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="useJsonTag" @change="convert" class="rounded text-blue-500" />
            <span class="text-sm text-gray-700">json标签</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="useOmitempty" @change="convert" class="rounded text-blue-500" />
            <span class="text-sm text-gray-700">omitempty</span>
          </label>
        </div>
        <div class="relative h-full min-h-[300px]">
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
