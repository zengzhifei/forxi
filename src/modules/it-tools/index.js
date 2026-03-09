// JSON 工具
import json from './converter/json.vue'
import jsondiff from './convert/jsondiff.vue'
import jsonToJava from './converter/jsonToJava.vue'
import jsonToGo from './converter/jsonToGo.vue'
import jsontoyaml from './convert/jsontoyaml.vue'

// 转换工具
import base64 from './converter/base64.vue'
import color from './converter/color.vue'

// 编码工具
import url from './encoder/url.vue'
import html from './encoder/html.vue'

// 生成工具
import uuid from './generator/uuid.vue'
import random from './generator/random.vue'
import pomodoro from './generator/pomodoro.vue'
import qrcode from './generator/qrcode.vue'
import hmac from './generator/hmac.vue'
import hash from './generator/hash.vue'
import crontab from './generator/crontab.vue'
import lorem from './generator/lorem.vue'

// 分析工具
import password from './analyser/password.vue'

// 测试工具
import regex from './tester/regex.vue'

// 解析工具
import jwt from './parser/jwt.vue'
import useragent from './parser/useragent.vue'
import urlParser from './parser/url.vue'

// 文本工具
import statistics from './text/statistics.vue'
import caseConverter from './text/case.vue'
import markdown from './text/markdown.vue'
import slugify from './text/slugify.vue'
import nato from './text/nato.vue'
import reverse from './text/reverse.vue'
import sql from './text/sql.vue'
import list from './text/list.vue'
import sort from './text/sort.vue'

// 进制与计算
import base from './convert/base.vue'
import timestamp from './convert/timestamp.vue'
import binary from './convert/binary.vue'
import math from './convert/math.vue'
import temperature from './convert/temperature.vue'
import xml from './convert/xml.vue'
import ipv4 from './convert/ipv4.vue'

// 参考工具
import http from './reference/http.vue'
import mime from './reference/mime.vue'

// 加密工具
import simpleEncrypt from './encrypt/simple.vue'

// 工具定义
export const tools = {
  'json': { component: json, name: 'JSON 格式化', description: 'JSON 数据的格式化与压缩', category: 'json', icon: '📋' },
  'jsondiff': { component: jsondiff, name: 'JSON 对比', description: '比较两个 JSON 对象的差异', category: 'json', icon: '🔍' },
  'jsonToJava': { component: jsonToJava, name: 'JSON ↔ Java', description: 'JSON 与 Java 实体类互转', category: 'json', icon: '☕' },
  'jsonToGo': { component: jsonToGo, name: 'JSON ↔ Go', description: 'JSON 与 Go 结构体互转', category: 'json', icon: '🐹' },
  'jsontoyaml': { component: jsontoyaml, name: 'JSON ↔ YAML', description: 'JSON 与 YAML 格式互转', category: 'json', icon: '📄' },
  'base64': { component: base64, name: 'Base64 转换', description: '字符串与 Base64 之间的编码转换', category: 'converter', icon: '🔐' },
  'color': { component: color, name: '颜色转换', description: 'HEX、RGB、HSL 颜色格式转换', category: 'converter', icon: '🎨' },
  'url': { component: url, name: 'URL 编码', description: 'URL 编码与解码', category: 'encoder', icon: '🔗' },
  'html': { component: html, name: 'HTML 实体编码', description: 'HTML 实体编码与解码', category: 'encoder', icon: '📄' },
  'uuid': { component: uuid, name: 'UUID 生成', description: '生成唯一标识符', category: 'generator', icon: '🆔' },
  'random': { component: random, name: '随机字符串', description: '生成随机字符串', category: 'generator', icon: '🎲' },
  'pomodoro': { component: pomodoro, name: '番茄钟', description: '简单的时间管理工具', category: 'generator', icon: '🍅' },
  'qrcode': { component: qrcode, name: '二维码生成', description: '生成二维码图片', category: 'generator', icon: '📱' },
  'hmac': { component: hmac, name: 'HMAC 生成', description: 'HMAC 哈希生成', category: 'generator', icon: '🔑' },
  'hash': { component: hash, name: '文本哈希', description: '生成多种哈希值', category: 'generator', icon: '#️⃣' },
  'crontab': { component: crontab, name: 'Crontab 生成', description: 'Crontab 表达式生成和解析', category: 'generator', icon: '⏰' },
  'lorem': { component: lorem, name: 'Lorem Ipsum', description: '生成随机占位文本', category: 'generator', icon: '📝' },
  'password': { component: password, name: '密码强度', description: '分析密码强度和安全等级', category: 'analyser', icon: '🔒' },
  'regex': { component: regex, name: '正则测试', description: '正则表达式测试工具', category: 'tester', icon: '✋' },
  'jwt': { component: jwt, name: 'JWT 解析', description: '解析 JWT Token', category: 'parser', icon: '🎫' },
  'useragent': { component: useragent, name: 'User Agent 解析', description: '解析浏览器 User Agent', category: 'parser', icon: '🌐' },
  'urlParser': { component: urlParser, name: 'URL 解析', description: '解析 URL 各组成部分', category: 'parser', icon: '🔗' },
  'statistics': { component: statistics, name: '文本统计', description: '统计字符数、单词数、行数', category: 'text', icon: '📊' },
  'case': { component: caseConverter, name: '大小写转换', description: '文本大小写转换', category: 'text', icon: 'Aa' },
  'markdown': { component: markdown, name: 'Markdown 转 HTML', description: '将 Markdown 转换为 HTML', category: 'text', icon: '📝' },
  'slugify': { component: slugify, name: 'Slugify 转换', description: '将文本转换为 URL 友好的 slug', category: 'text', icon: '🔗' },
  'nato': { component: nato, name: 'NATO 字母', description: '将文本转换为 NATO 字母 phonetic alphabet', category: 'text', icon: '📡' },
  'reverse': { component: reverse, name: '文本反转', description: '反转文本或单词顺序', category: 'text', icon: '↔️' },
  'sql': { component: sql, name: 'SQL 格式化', description: 'SQL 语句格式化', category: 'text', icon: '🗄️' },
  'list': { component: list, name: '列表转换', description: '文本与 JSON/CSV 格式互转', category: 'text', icon: '📝' },
  'sort': { component: sort, name: '字母排序', description: '对文本进行排序', category: 'text', icon: '🔢' },
  'base': { component: base, name: '进制转换', description: '十进制、二进制、十六进制、八进制互相转换', category: 'convert', icon: '🔢' },
  'timestamp': { component: timestamp, name: '时间戳转换', description: 'Unix 时间戳与日期时间互转', category: 'convert', icon: '⏰' },
  'binary': { component: binary, name: '文本转二进制', description: '文本与二进制互相转换', category: 'convert', icon: '01' },
  'math': { component: math, name: '数学计算器', description: '简单的数学表达式计算', category: 'convert', icon: '➕' },
  'temperature': { component: temperature, name: '温度转换', description: '摄氏度、华氏度、开尔文互相转换', category: 'convert', icon: '🌡️' },
  'xml': { component: xml, name: 'XML 格式化', description: 'XML 格式化和压缩', category: 'convert', icon: '📰' },
  'ipv4': { component: ipv4, name: 'IP 地址转换', description: 'IPv4 地址与整数互转', category: 'convert', icon: '🌐' },
  'http': { component: http, name: 'HTTP 状态码', description: 'HTTP 状态码参考', category: 'reference', icon: '📡' },
  'mime': { component: mime, name: 'MIME 类型', description: 'MIME 类型与文件扩展名对照', category: 'reference', icon: '📁' },
  'simpleEncrypt': { component: simpleEncrypt, name: '文本加密', description: '简单的文本加密和解密', category: 'encrypt', icon: '🔐' },
}

// 分类定义
export const categories = [
  {
    name: 'JSON 工具',
    key: 'json',
    tools: [
      { id: 'json', ...tools.json },
      { id: 'jsondiff', ...tools.jsondiff },
      { id: 'jsonToJava', ...tools.jsonToJava },
      { id: 'jsonToGo', ...tools.jsonToGo },
      { id: 'jsontoyaml', ...tools.jsontoyaml },
    ]
  },
  {
    name: '转换工具',
    key: 'converter',
    tools: [
      { id: 'base64', ...tools.base64 },
      { id: 'color', ...tools.color },
    ]
  },
  {
    name: '编码工具',
    key: 'encoder',
    tools: [
      { id: 'url', ...tools.url },
      { id: 'html', ...tools.html }
    ]
  },
  {
    name: '生成工具',
    key: 'generator',
    tools: [
      { id: 'uuid', ...tools.uuid },
      { id: 'random', ...tools.random },
      { id: 'pomodoro', ...tools.pomodoro },
      { id: 'qrcode', ...tools.qrcode },
      { id: 'hmac', ...tools.hmac },
      { id: 'hash', ...tools.hash },
      { id: 'crontab', ...tools.crontab },
      { id: 'lorem', ...tools.lorem }
    ]
  },
  {
    name: '分析工具',
    key: 'analyser',
    tools: [
      { id: 'password', ...tools.password }
    ]
  },
  {
    name: '测试工具',
    key: 'tester',
    tools: [
      { id: 'regex', ...tools.regex }
    ]
  },
  {
    name: '解析工具',
    key: 'parser',
    tools: [
      { id: 'jwt', ...tools.jwt },
      { id: 'useragent', ...tools.useragent },
      { id: 'urlParser', ...tools.urlParser }
    ]
  },
  {
    name: '文本处理',
    key: 'text',
    tools: [
      { id: 'statistics', ...tools.statistics },
      { id: 'case', ...tools.case },
      { id: 'markdown', ...tools.markdown },
      { id: 'slugify', ...tools.slugify },
      { id: 'nato', ...tools.nato },
      { id: 'reverse', ...tools.reverse },
      { id: 'sql', ...tools.sql },
      { id: 'list', ...tools.list },
      { id: 'sort', ...tools.sort }
    ]
  },
  {
    name: '进制与计算',
    key: 'convert',
    tools: [
      { id: 'base', ...tools.base },
      { id: 'timestamp', ...tools.timestamp },
      { id: 'binary', ...tools.binary },
      { id: 'math', ...tools.math },
      { id: 'temperature', ...tools.temperature },
      { id: 'xml', ...tools.xml },
      { id: 'ipv4', ...tools.ipv4 }
    ]
  },
  {
    name: '参考资料',
    key: 'reference',
    tools: [
      { id: 'http', ...tools.http },
      { id: 'mime', ...tools.mime }
    ]
  },
  {
    name: '加密工具',
    key: 'encrypt',
    tools: [
      { id: 'simpleEncrypt', ...tools.simpleEncrypt }
    ]
  }
]

// 获取所有工具
export function getAllTools() {
  return categories.flatMap(cat => cat.tools)
}

// 根据 ID 获取工具
export function getToolById(id) {
  return tools[id] || null
}
