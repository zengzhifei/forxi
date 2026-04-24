<template>
  <div class="min-h-screen bg-gray-100 text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <section class="relative overflow-hidden bg-white border-b border-zinc-100">
        <div class="absolute inset-0" style="background: linear-gradient(135deg, #dbeafe 0%, #ffffff 40%, #e0f2-fe 100%);"></div>
        <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-16 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full mb-3 sm:mb-5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9"/></svg>
            IP查询
          </div>
          <h1 class="text-2xl sm:text-5xl font-bold text-zinc-800 mb-2 sm:mb-4 tracking-tight">查询全球地理信息</h1>
          <p class="text-zinc-400 text-xs sm:text-lg max-w-2xl mx-auto leading-relaxed">查询全球IP地址的地理位置与实时天气</p>
        </div>
      </section>

      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 p-4 sm:p-8">
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1 relative">
              <input
                v-model="ipInput"
                type="text"
                placeholder="输入IP地址（默认查询本机IP）"
                class="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                @keyup.enter="queryIp"
              >
            </div>
            <button
              @click="queryIp"
              :disabled="loading"
              class="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? '查询中...' : '查询' }}</span>
            </button>
          </div>
        </div>

        <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl">
          <div class="flex items-center gap-2 text-red-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>{{ error }}</span>
          </div>
        </div>

        <div v-if="ipData" class="mt-6 space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-4">
                <h3 class="text-white font-semibold flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  地理位置信息
                </h3>
              </div>
              <div class="p-5 space-y-4">
                <div class="flex items-center justify-center py-4">
                  <div class="text-center">
                    <template v-if="['HK', 'MO', 'TW'].includes(ipData.geo.country_code?.toUpperCase())">
                      <div class="text-4xl mb-1">🇨🇳{{ getCountryEmoji(ipData.geo.country_code) }}</div>
                      <div class="text-lg font-semibold text-zinc-800">{{ getRegionName(ipData.geo.country_code) }}（China）</div>
                      <div class="text-sm text-zinc-500">{{ ipData.geo.country_code }}（CN）</div>
                    </template>
                    <template v-else>
                      <div class="text-4xl mb-2">{{ ipData.geo.flag?.emoji || getCountryEmoji(ipData.geo.country_code) }}</div>
                      <div class="text-lg font-semibold text-zinc-800">{{ ipData.geo.country || '-' }}</div>
                      <div class="text-sm text-zinc-500">{{ ipData.geo.country_code || '-' }}</div>
                    </template>
                  </div>
                </div>
                <div class="h-px bg-zinc-100"></div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-3">
                    <InfoCard label="查询状态" :value="ipData.geo.success ? '成功' : '失败'" icon="status" />
                    <InfoCard label="IP类型" :value="ipData.geo.type || '-'" icon="type" />
                    <InfoCard label="大洲" :value="ipData.geo.continent || '-'" icon="globe" />
                    <InfoCard label="地区/省" :value="ipData.geo.region || '-'" icon="map" />
                    <InfoCard label="地区代码" :value="ipData.geo.region_code || '-'" icon="region" />
                  </div>
                  <div class="space-y-3">
                    <InfoCard label="查询IP" :value="ipData.geo.ip || '-'" icon="ip" copyable />
                    <InfoCard label="欧盟成员" :value="ipData.geo.is_eu ? '是' : '否'" icon="eu" />
                    <InfoCard label="大洲代码" :value="ipData.geo.continent_code || '-'" icon="globe" /> 
                    <InfoCard label="城市" :value="ipData.geo.city || '-'" icon="city" />
                    <InfoCard label="邮政编码" :value="ipData.geo.postal || '-'" icon="zip" />
                  </div>
                </div>
                <div class="h-px bg-zinc-100"></div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-3">
                    <InfoCard label="国际区号" :value="ipData.geo.calling_code ? '+' + ipData.geo.calling_code : '-'" icon="phone" />
                    <InfoCard label="邻国" :value="ipData.geo.borders || '-'" icon="borders" />
                  </div>
                  <div class="space-y-3">
                    <InfoCard label="首都/首府" :value="ipData.geo.capital || '-'" icon="capital" />
                    <div class="bg-zinc-50 rounded-lg p-3">
                      <div class="text-xs text-zinc-500 mb-1">国旗</div>
                      <template v-if="ipData.geo.flag?.img">
                        <div class="flex items-center gap-1">
                          <img v-if="['HK', 'MO', 'TW'].includes(ipData.geo.country_code?.toUpperCase())" src="https://cdn.ipwhois.io/flags/cn.svg" alt="中国国旗" class="h-6 rounded shadow-sm object-contain" />
                          <img :src="ipData.geo.flag.img" :alt="ipData.geo.country + '国旗'" class="h-6 rounded shadow-sm object-contain" />
                        </div>
                      </template>
                      <span v-else class="text-sm text-zinc-400">-</span>
                    </div>
                  </div>
                </div>
                <div class="h-px bg-zinc-100"></div>
                <div class="space-y-3">
                  <div class="text-xs text-zinc-500 mb-2">时区信息</div>
                  <div class="grid grid-cols-2 gap-3">
                    <InfoCard label="时区ID" :value="ipData.geo.timezone?.id || '-'" icon="timezone" />
                    <InfoCard label="时区缩写" :value="ipData.geo.timezone?.abbr || '-'" icon="timezone" />
                    <InfoCard label="UTC偏移" :value="ipData.geo.timezone?.utc || '-'" icon="timezone" />
                    <InfoCard label="UTC秒偏移" :value="ipData.geo.timezone?.offset?.toString() || '-'" icon="timezone" />
                    <InfoCard label="夏令时" :value="ipData.geo.timezone?.is_dst ? '是' : '否'" icon="timezone" />
                    <InfoCard label="当地时间" :value="getLocalTime(ipData.geo.timezone?.id)" icon="clock" />
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
              <div class="bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-4">
                <h3 class="text-white font-semibold flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
                  网络信息
                </h3>
              </div>
              <div class="p-5 space-y-4">
                <div class="bg-zinc-50 rounded-xl p-4">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>
                    </div>
                    <div>
                      <div class="text-xs text-zinc-500">网络运营商</div>
                      <div class="font-medium text-zinc-800">{{ ipData.geo.connection?.isp || '-' }}</div>
                    </div>
                  </div>
                  <div class="text-xs text-zinc-400 truncate">{{ ipData.geo.connection?.org || '-' }}</div>
                </div>
                <div class="h-px bg-zinc-100"></div>
                <div class="space-y-3">
                  <InfoCard label="组织/公司" :value="ipData.geo.connection?.org || '-'" icon="org" />
                  <InfoCard label="AS号码" :value="ipData.geo.connection?.asn?.toString() || '-'" icon="as" />
                  <InfoCard label="ISP服务商" :value="ipData.geo.connection?.isp || '-'" icon="isp" />
                  <InfoCard label="域名" :value="ipData.geo.connection?.domain || '-'" icon="domain" />
                  <InfoCard label="IP类型" :value="getIpType(ipData.geo.connection?.isp)" icon="type" />
                </div>
              </div>
            </div>
          </div>

          <div v-if="ipData.weather" class="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
            <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4">
              <h3 class="text-white font-semibold flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                实时天气
              </h3>
            </div>
            <div class="p-5">
              <div class="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-6">
                <div class="text-center sm:flex-shrink-0 py-4">
                  <div class="text-6xl sm:text-7xl mb-2">{{ getWeatherEmoji(ipData.weather.current_weather?.weathercode) }}</div>
                  <div class="text-xl font-bold text-zinc-800">{{ ipData.weather.current_weather?.temperature ?? '-' }}°C</div>
                  <div class="text-sm text-zinc-500">{{ getWeatherDescription(ipData.weather.current_weather?.weathercode) }}</div>
                </div>
                <div class="hidden sm:block w-px bg-zinc-100 self-stretch"></div>
                <div class="hidden sm:flex w-px bg-zinc-100"></div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 flex-1">
                  <div class="text-center">
                    <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </div>
                    <div class="text-xs text-zinc-500 mb-1">风速</div>
                    <div class="font-semibold text-zinc-800">{{ ipData.weather.current_weather?.windspeed ?? '-' }} km/h</div>
                  </div>
                  <div class="text-center">
                    <div class="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-500 flex items-center justify-center mx-auto mb-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div class="text-xs text-zinc-500 mb-1">风向</div>
                    <div class="font-semibold text-zinc-800">{{ getWindDirection(ipData.weather.current_weather?.winddirection) }}</div>
                    <div class="text-xs text-zinc-400">{{ ipData.weather.current_weather?.winddirection ?? '-' }}°</div>
                  </div>
                  <div class="text-center">
                    <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-2">
                      <span class="text-lg">{{ getWeatherEmoji(ipData.weather.current_weather?.weathercode) }}</span>
                    </div>
                    <div class="text-xs text-zinc-500 mb-1">天气</div>
                    <div class="font-semibold text-zinc-800 text-xs">{{ getWeatherDescription(ipData.weather.current_weather?.weathercode) }}</div>
                    <div class="text-xs text-zinc-400">({{ ipData.weather.current_weather?.weathercode ?? '-' }})</div>
                  </div>
                  <div class="text-center">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2" :class="ipData.weather.current_weather?.is_day == 1 ? 'bg-yellow-50 text-yellow-500' : 'bg-indigo-50 text-indigo-500'">
                      <svg v-if="ipData.weather.current_weather?.is_day == 1" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                    </div>
                    <div class="text-xs text-zinc-500 mb-1">昼夜</div>
                    <div class="font-semibold text-zinc-800">{{ ipData.weather.current_weather?.is_day == 1 ? '白天' : '夜晚' }}</div>
                  </div>
                </div>
              </div>
              <div class="mt-5 pt-5 border-t border-zinc-100">
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-full">当地时间: {{ getLocalTime(ipData.geo.timezone?.id) }}</span>
                  <span class="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs rounded-full">UTC时间: {{ ipData.weather.current_weather?.time || '-' }}</span>
                  <span class="px-3 py-1.5 bg-violet-50 text-violet-600 text-xs rounded-full">时区: {{ ipData.weather.timezone || '-' }}</span>
                  <span class="px-3 py-1.5 bg-cyan-50 text-cyan-600 text-xs rounded-full">坐标: {{ ipData.weather.latitude ?? '-' }}, {{ ipData.weather.longitude ?? '-' }}</span>
                  <span class="px-3 py-1.5 bg-amber-50 text-amber-600 text-xs rounded-full">更新间隔: {{ ipData.weather.current_weather?.interval ?? '-' }}秒</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!ipData && !loading && !error" class="mt-12 text-center">
          <div class="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9"/></svg>
          </div>
          <h3 class="text-lg font-medium text-zinc-600 mb-2">输入IP即可查询</h3>
          <p class="text-sm text-zinc-400">支持查询任意IPv4地址的地理位置与天气信息</p>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { api } from '../utils/api.js'
import { useCopy } from '../composable/copy'

const { copy } = useCopy()

const ipInput = ref('')
const ipData = ref(null)
const loading = ref(false)
const error = ref('')

const queryIp = async () => {
  error.value = ''
  ipData.value = null
  loading.value = true

  try {
    const data = await api.getIpInfo(ipInput.value.trim() || undefined)
    if (data.geo && !data.geo.success) {
      error.value = 'IP查询失败，请检查IP地址是否有效'
      return
    }
    ipData.value = data
  } catch (e) {
    error.value = e.message || '查询失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const getCountryEmoji = (countryCode) => {
  if (!countryCode) return '🌍'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}

const getRegionDisplay = (countryCode, country) => {
  if (!countryCode) return '🌍'
  return getCountryEmoji(countryCode)
}

const getRegionName = (countryCode) => {
  const nameMap = { HK: 'Hong Kong', MO: 'Macau', TW: 'Taiwan' }
  return nameMap[countryCode?.toUpperCase()] || countryCode || '-'
}

const getWeatherEmoji = (code) => {
  if (code == null) return '🌤️'
  if (code === 0) return '☀️'
  if (code >= 1 && code <= 3) return '⛅'
  if (code === 45 || code === 48) return '🌫️'
  if (code >= 51 && code <= 55) return '🌦️'
  if (code >= 61 && code <= 65) return '🌧️'
  if (code >= 71 && code <= 75) return '❄️'
  if (code >= 80 && code <= 82) return '🌦️'
  if (code === 95) return '⛈️'
  return '🌤️'
}

const getWeatherDescription = (code) => {
  if (code == null) return '未知'
  if (code === 0) return '晴朗'
  if (code === 1) return '大致晴朗'
  if (code === 2) return '多云'
  if (code === 3) return '阴天'
  if (code === 45 || code === 48) return '雾'
  if (code >= 51 && code <= 55) return '毛毛雨'
  if (code >= 61 && code <= 65) return '雨'
  if (code >= 71 && code <= 75) return '雪'
  if (code >= 80 && code <= 82) return '阵雨'
  if (code === 95) return '雷暴'
  return '未知'
}

const getLocalTime = (timezoneId) => {
  if (!timezoneId) return '-'
  try {
    const now = new Date()
    const options = { timeZone: timezoneId, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
    return new Intl.DateTimeFormat('zh-CN', options).format(now)
  } catch {
    return '-'
  }
}

const getIpType = (isp) => {
  if (!isp) return '-'
  const datacenterKeywords = ['tencent', 'alibaba', 'aliyun', 'aws', 'azure', 'google cloud', 'huawei', '腾讯云', '阿里云', '华为云', '云服务器', 'cloud', 'idc', '数据中心', 'baidu', '字节', 'bytedance', '快手', 'kuaishou']
  const lowerIsp = isp.toLowerCase()
  for (const keyword of datacenterKeywords) {
    if (lowerIsp.includes(keyword)) return '数据中心/机房'
  }
  return '住宅/家庭宽带'
}

const getWindDirection = (degrees) => {
  if (degrees == null) return '未知'
  if (degrees >= 337.5 || degrees < 22.5) return '北风'
  if (degrees >= 22.5 && degrees < 67.5) return '东北风'
  if (degrees >= 67.5 && degrees < 112.5) return '东风'
  if (degrees >= 112.5 && degrees < 157.5) return '东南风'
  if (degrees >= 157.5 && degrees < 202.5) return '南风'
  if (degrees >= 202.5 && degrees < 247.5) return '西南风'
  if (degrees >= 247.5 && degrees < 292.5) return '西风'
  if (degrees >= 292.5 && degrees < 337.5) return '西北风'
  return '未知'
}

const copyValue = (value) => {
  copy(value)
}
</script>

<script>
import { h } from 'vue'
import { useCopy } from '../composable/copy'

const { copy } = useCopy()

const InfoCard = {
  props: ['label', 'value', 'icon', 'copyable'],
  render() {
    return h('div', { class: 'bg-zinc-50 rounded-lg p-3' }, [
      h('div', { class: 'text-xs text-zinc-500 mb-1' }, this.label),
      h('div', { class: 'flex items-center justify-between gap-2' }, [
        h('span', { class: 'font-medium text-zinc-800 text-sm break-all' }, this.value || '-'),
        this.copyable ? h('button', {
          class: 'ml-2 text-zinc-400 hover:text-blue-500 transition-colors flex-shrink-0',
          onClick: () => copy(this.value)
        }, [
          h('svg', {
            class: 'w-4 h-4',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          }, [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': '2',
              d: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
            })
          ])
        ]) : null
      ])
    ])
  }
}

export default {
  components: { InfoCard }
}
</script>
