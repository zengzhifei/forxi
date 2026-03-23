<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </span>
      代码美化
    </h3>
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="lang in languages" 
          :key="lang.id"
          @click="selectedLang = lang.id"
          class="px-3 py-1.5 text-sm rounded-lg transition-colors"
          :class="selectedLang === lang.id ? 'bg-zinc-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ lang.name }}
        </button>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">输入代码</label>
        <textarea 
          v-model="input" 
          class="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent font-mono text-sm"
          :rows="10"
          :placeholder="'请输入 ' + currentLangName + ' 代码...'"
        ></textarea>
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="format" class="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors">格式化</button>
        <button @click="minify" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">压缩</button>
        <button @click="copy(output)" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">复制</button>
        <button @click="clear" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">清空</button>
      </div>
      <div v-if="output">
        <label class="block text-sm font-medium text-gray-700 mb-2">结果：</label>
        <textarea 
          :value="output" 
          readonly
          class="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
          :rows="10"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const toast = inject('toast')

const languages = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'json', name: 'JSON' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'sql', name: 'SQL' },
  { id: 'xml', name: 'XML' },
  { id: 'yaml', name: 'YAML' }
]

const selectedLang = ref('javascript')
const input = ref('')
const output = ref('')

const currentLangName = computed(() => {
  const lang = languages.find(l => l.id === selectedLang.value)
  return lang ? lang.name : ''
})

function format() {
  if (!input.value.trim()) {
    toast.warning('请输入代码')
    return
  }
  
  try {
    output.value = formatCode(input.value, selectedLang.value)
  } catch (e) {
    toast.error('格式化失败: ' + e.message)
  }
}

function minify() {
  if (!input.value.trim()) {
    toast.warning('请输入代码')
    return
  }
  
  try {
    output.value = minifyCode(input.value, selectedLang.value)
  } catch (e) {
    toast.error('压缩失败: ' + e.message)
  }
}

function clear() {
  input.value = ''
  output.value = ''
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('复制成功！')
  } catch (e) {
    toast.error('复制失败')
  }
}

function formatCode(code, lang) {
  switch (lang) {
    case 'javascript':
    case 'typescript':
      return jsFormat(code)
    case 'json':
      return JSON.stringify(JSON.parse(code), null, 2)
    case 'html':
      return htmlFormat(code)
    case 'css':
      return cssFormat(code)
    case 'sql':
      return sqlFormat(code)
    case 'xml':
      return xmlFormat(code)
    case 'yaml':
      return code
    default:
      return code
  }
}

function minifyCode(code, lang) {
  switch (lang) {
    case 'javascript':
    case 'typescript':
      return jsMinify(code)
    case 'json':
      return JSON.stringify(JSON.parse(code))
    case 'html':
      return htmlMinify(code)
    case 'css':
      return cssMinify(code)
    case 'sql':
      return sqlMinify(code)
    case 'xml':
      return xmlMinify(code)
    case 'yaml':
      return code
    default:
      return code
  }
}

function jsFormat(code) {
  let formatted = ''
  let indent = 0
  let inString = false
  let stringChar = ''
  let inComment = false
  let inBlockComment = false
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i]
    const prevChar = code[i - 1] || ''
    
    if (inBlockComment) {
      if (char === '*' && code[i + 1] === '/') {
        inBlockComment = false
        formatted += '*/'
        i++
      } else {
        formatted += char
      }
      continue
    }
    
    if (inComment) {
      if (char === '\n') {
        inComment = false
        formatted += '\n' + '  '.repeat(indent)
      } else {
        formatted += char
      }
      continue
    }
    
    if (!inString) {
      if (char === '"' || char === "'" || char === '`') {
        inString = true
        stringChar = char
        formatted += char
        continue
      }
      
      if (char === '/' && code[i + 1] === '/') {
        inComment = true
        formatted += '//'
        i++
        continue
      }
      
      if (char === '/' && code[i + 1] === '*') {
        inBlockComment = true
        formatted += '/*'
        i++
        continue
      }
    } else {
      if (char === stringChar && prevChar !== '\\') {
        inString = false
      }
      formatted += char
      continue
    }
    
    if (char === '{' || char === '[' || char === '(') {
      formatted += char
      indent++
      formatted += '\n' + '  '.repeat(indent)
    } else if (char === '}' || char === ']' || char === ')') {
      indent--
      formatted += '\n' + '  '.repeat(indent) + char
    } else if (char === ',') {
      formatted += ',\n' + '  '.repeat(indent)
    } else if (char === ';') {
      formatted += ';\n' + '  '.repeat(indent)
    } else if (char === '\n') {
      formatted += '\n' + '  '.repeat(indent)
    } else if (char === ' ' && prevChar === ' ') {
      continue
    } else {
      formatted += char
    }
  }
  
  return formatted.trim()
}

function jsMinify(code) {
  return code
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,:])\s*/g, '$1')
    .replace(/;\s*;/g, ';')
    .trim()
}

function htmlFormat(code) {
  let formatted = ''
  let indent = 0
  let inTag = false
  let inString = false
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i]
    
    if (char === '<') {
      inTag = true
      if (code[i + 1] === '/') {
        indent = Math.max(0, indent - 1)
      }
      formatted += '\n' + '  '.repeat(indent) + '<'
      continue
    }
    
    if (char === '>') {
      inTag = false
      formatted += '>'
      if (code[i + 1] && code[i + 1] !== '<' && !code[i + 1].match(/[a-zA-Z]/)) {
        indent++
      }
      continue
    }
    
    if (inTag) {
      formatted += char
    } else {
      if (char === '\n' || char === '\r') continue
      if (char === ' ' && formatted.endsWith(' ')) continue
      formatted += char
    }
  }
  
  return formatted.trim()
}

function htmlMinify(code) {
  return code
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()
}

function cssFormat(code) {
  let formatted = ''
  let indent = 0
  
  const tokens = code.match(/[^{}]+|[{}]/g) || []
  
  for (const token of tokens) {
    const t = token.trim()
    if (!t) continue
    
    if (t === '{') {
      formatted += ' {\n' + '  '.repeat(++indent)
    } else if (t === '}') {
      formatted = formatted.trimEnd()
      formatted += '\n' + '  '.repeat(--indent) + '}\n'
    } else if (t === ';') {
      formatted += ';\n' + '  '.repeat(indent)
    } else {
      formatted += t + ' '
    }
  }
  
  return formatted.trim()
}

function cssMinify(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()
}

function sqlFormat(code) {
  let sql = code
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ',\n  ')
    .replace(/\s*\(\s*/g, '(\n  ')
    .replace(/\s*\)\s*/g, '\n)')
    .replace(/\s+AND\s+/gi, '\nAND ')
    .replace(/\s+OR\s+/gi, '\nOR ')
    .replace(/\s+WHERE\s+/gi, '\nWHERE ')
    .replace(/\s+SELECT\s+/gi, 'SELECT ')
    .replace(/\s+FROM\s+/gi, '\nFROM ')
    .replace(/\s+JOIN\s+/gi, '\nJOIN ')
    .replace(/\s+LEFT\s+JOIN\s+/gi, '\nLEFT JOIN ')
    .replace(/\s+RIGHT\s+JOIN\s+/gi, '\nRIGHT JOIN ')
    .replace(/\s+INNER\s+JOIN\s+/gi, '\nINNER JOIN ')
    .replace(/\s+ON\s+/gi, ' ON ')
    .replace(/\s+ORDER\s+BY\s+/gi, '\nORDER BY ')
    .replace(/\s+GROUP\s+BY\s+/gi, '\nGROUP BY ')
    .replace(/\s+HAVING\s+/gi, '\nHAVING ')
    .replace(/\s+LIMIT\s+/gi, '\nLIMIT ')
  
  return sql.trim()
}

function sqlMinify(code) {
  return code
    .replace(/\s+/g, ' ')
    .replace(/\s*([,()])\s*/g, '$1')
    .trim()
}

function xmlFormat(code) {
  let formatted = ''
  let indent = 0
  let inTag = false
  let inContent = false
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i]
    
    if (char === '<') {
      if (inContent) {
        formatted = formatted.trimEnd()
        inContent = false
      }
      inTag = true
      if (code[i + 1] === '?') {
        formatted += '<?'
        i++
      } else if (code[i + 1] === '!') {
        formatted += '<!'
        i++
      } else if (code[i + 1] === '/') {
        indent = Math.max(0, indent - 1)
        formatted += '\n' + '  '.repeat(indent) + '</'
        i++
      } else {
        if (formatted.endsWith('\n')) {
          formatted += '  '.repeat(indent)
        }
        formatted += '<'
      }
      continue
    }
    
    if (char === '>') {
      inTag = false
      if (code[i - 1] === '/' || code[i - 1] === '?') {
        formatted += '>'
      } else {
        formatted += '>'
        if (code[i + 1] && code[i + 1] !== '<' && code[i + 1] !== '\n') {
          inContent = true
        }
      }
      continue
    }
    
    if (inTag || inContent) {
      formatted += char
    } else if (char === '\n' || char === '\r') {
      continue
    } else if (char === ' ') {
      if (!formatted.endsWith(' ')) {
        formatted += ' '
      }
    } else {
      formatted += char
    }
  }
  
  return formatted.trim()
}

function xmlMinify(code) {
  return code
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim()
}
</script>
