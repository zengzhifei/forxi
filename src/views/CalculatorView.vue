<template>
  <div class="min-h-screen bg-gray-100 text-zinc-600 font-sans flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <section class="relative overflow-hidden bg-white border-b border-zinc-100">
        <div class="absolute inset-0" style="background: linear-gradient(135deg, #fef3c7 0%, #ffffff 40%, #fef9c3 100%);"></div>
        <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-16 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-medium rounded-full mb-3 sm:mb-5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            超级计算器
          </div>
          <h1 class="text-2xl sm:text-5xl font-bold text-zinc-800 mb-2 sm:mb-4 tracking-tight">一站式计算解决方案</h1>
          <p class="text-zinc-400 text-xs sm:text-lg max-w-2xl mx-auto leading-relaxed">数学 · 科学 · 金融 · 进制 · 单位换算</p>
        </div>
      </section>

      <section class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-safe">
        <div class="mb-4">
          <div class="flex gap-1 p-1 bg-white rounded-xl shadow-sm border border-zinc-100 overflow-x-auto scrollbar-hide">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 active:scale-95"
              :class="activeTab === tab.id ? 'bg-amber-500 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700'"
            >
              <span v-html="tab.icon" class="w-3.5 h-3.5 flex-shrink-0 hidden sm:block"></span>
              {{ tab.name }}
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 p-3 sm:p-8">
          <div v-if="activeTab === 'basic'" class="space-y-3">
            <div class="bg-zinc-50 rounded-xl p-2 sm:p-5">
              <div class="relative text-right mb-2 px-1 cursor-pointer select-none" @click="copyResult" title="点击复制结果">
                <div class="text-xs text-zinc-400 h-5 truncate">{{ expression || '0' }}</div>
                <div class="text-3xl sm:text-4xl font-bold text-zinc-800 truncate leading-tight">{{ display || '0' }}</div>
                <div class="text-xs mt-0.5" :class="copyToast ? 'text-emerald-500 font-medium' : 'text-zinc-300'">
                  {{ copyToast ? '已复制 ✓' : '点击复制' }}
                </div>
              </div>
              <!-- 键盘：4列，每行3个数字+1个运算符 -->
              <div class="grid grid-cols-4 gap-1.5 sm:gap-2">
                <button @click="clear" class="py-3 rounded-xl text-sm font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">C</button>
                <button @click="backspace" class="py-3 rounded-xl text-sm font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">⌫</button>
                <button @click="inputPercent" class="py-3 rounded-xl text-sm font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">%</button>
                <button @click="inputVal('/')" class="py-3 rounded-xl text-lg font-medium bg-amber-100 text-amber-600 active:bg-amber-200 transition-colors">÷</button>

                <button @click="inputVal('7')" class="py-4 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">7</button>
                <button @click="inputVal('8')" class="py-4 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">8</button>
                <button @click="inputVal('9')" class="py-4 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">9</button>
                <button @click="inputVal('*')" class="py-4 rounded-xl text-lg font-medium bg-amber-100 text-amber-600 active:bg-amber-200 transition-colors">×</button>

                <button @click="inputVal('4')" class="py-4 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">4</button>
                <button @click="inputVal('5')" class="py-4 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">5</button>
                <button @click="inputVal('6')" class="py-4 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">6</button>
                <button @click="inputVal('-')" class="py-4 rounded-xl text-lg font-medium bg-amber-100 text-amber-600 active:bg-amber-200 transition-colors">−</button>

                <button @click="inputVal('1')" class="py-4 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">1</button>
                <button @click="inputVal('2')" class="py-4 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">2</button>
                <button @click="inputVal('3')" class="py-4 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">3</button>
                <button @click="inputVal('+')" class="py-4 rounded-xl text-lg font-medium bg-amber-100 text-amber-600 active:bg-amber-200 transition-colors">+</button>

                <button @click="inputVal('00')" class="py-4 rounded-xl text-base font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">00</button>
                <button @click="inputVal('0')" class="py-4 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">0</button>
                <button @click="inputVal('.')" class="py-4 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">.</button>
                <button @click="calculate" class="py-4 rounded-xl text-lg font-bold bg-amber-500 text-white active:bg-amber-600 transition-colors">=</button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'scientific'" class="space-y-3">
            <div class="bg-zinc-50 rounded-xl p-2 sm:p-5">
              <div class="text-right mb-2 px-1 cursor-pointer select-none" @click="copyResult" title="点击复制结果">
                <div class="text-xs text-zinc-400 h-5 truncate">{{ expression || '0' }}</div>
                <div class="text-3xl sm:text-4xl font-bold text-zinc-800 truncate leading-tight">{{ display || '0' }}</div>
                <div class="text-xs mt-0.5" :class="copyToast ? 'text-emerald-500 font-medium' : 'text-zinc-400'">
                  {{ angleMode === 'deg' ? 'DEG' : 'RAD' }} · {{ copyToast ? '已复制 ✓' : '点击复制' }}
                </div>
              </div>
              <div class="space-y-1.5">
                <!-- 科学函数行 -->
                <div class="grid grid-cols-5 gap-1 sm:gap-1.5">
                  <button @click="scientificCalc('sin')" class="py-2 rounded-lg text-xs font-medium bg-violet-100 text-violet-600 active:bg-violet-200 transition-colors">sin</button>
                  <button @click="scientificCalc('cos')" class="py-2 rounded-lg text-xs font-medium bg-violet-100 text-violet-600 active:bg-violet-200 transition-colors">cos</button>
                  <button @click="scientificCalc('tan')" class="py-2 rounded-lg text-xs font-medium bg-violet-100 text-violet-600 active:bg-violet-200 transition-colors">tan</button>
                  <button @click="scientificCalc('log')" class="py-2 rounded-lg text-xs font-medium bg-violet-100 text-violet-600 active:bg-violet-200 transition-colors">log</button>
                  <button @click="scientificCalc('ln')" class="py-2 rounded-lg text-xs font-medium bg-violet-100 text-violet-600 active:bg-violet-200 transition-colors">ln</button>
                </div>
                <div class="grid grid-cols-5 gap-1 sm:gap-1.5">
                  <button @click="scientificCalc('asin')" class="py-2 rounded-lg text-xs font-medium bg-violet-100 text-violet-600 active:bg-violet-200 transition-colors">sin⁻¹</button>
                  <button @click="scientificCalc('acos')" class="py-2 rounded-lg text-xs font-medium bg-violet-100 text-violet-600 active:bg-violet-200 transition-colors">cos⁻¹</button>
                  <button @click="scientificCalc('atan')" class="py-2 rounded-lg text-xs font-medium bg-violet-100 text-violet-600 active:bg-violet-200 transition-colors">tan⁻¹</button>
                  <button @click="scientificCalc('sqrt')" class="py-2 rounded-lg text-xs font-medium bg-violet-100 text-violet-600 active:bg-violet-200 transition-colors">√</button>
                  <button @click="scientificCalc('cbrt')" class="py-2 rounded-lg text-xs font-medium bg-violet-100 text-violet-600 active:bg-violet-200 transition-colors">∛</button>
                </div>
                <div class="grid grid-cols-5 gap-1 sm:gap-1.5">
                  <button @click="inputPow" class="py-2 rounded-lg text-xs font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">xʸ</button>
                  <button @click="inputSquare" class="py-2 rounded-lg text-xs font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">x²</button>
                  <button @click="inputVal('Math.PI')" class="py-2 rounded-lg text-xs font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">π</button>
                  <button @click="inputVal('Math.E')" class="py-2 rounded-lg text-xs font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">e</button>
                  <button @click="scientificCalc('factorial')" class="py-2 rounded-lg text-xs font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">n!</button>
                </div>
                <div class="grid grid-cols-5 gap-1 sm:gap-1.5">
                  <button @click="toggleAngleMode" class="py-2 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-600 active:bg-emerald-200 transition-colors">{{ angleMode === 'deg' ? 'DEG' : 'RAD' }}</button>
                  <button @click="inputVal('(')" class="py-2 rounded-lg text-xs font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">(</button>
                  <button @click="inputVal(')')" class="py-2 rounded-lg text-xs font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">)</button>
                  <button @click="scientificCalc('floor')" class="py-2 rounded-lg text-xs font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">⌊x⌋</button>
                  <button @click="scientificCalc('ceil')" class="py-2 rounded-lg text-xs font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">⌈x⌉</button>
                </div>
                <!-- 数字键盘：4列，每行3个数字+1个运算符 -->
                <div class="grid grid-cols-4 gap-1 sm:gap-1.5 pt-0.5">
                  <button @click="inputVal('Math.abs')" class="py-2.5 rounded-lg text-xs font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">|x|</button>
                  <button @click="inputReciprocal" class="py-2.5 rounded-lg text-xs font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">1/x</button>
                  <button @click="clear" class="py-2.5 rounded-lg text-xs font-medium bg-red-100 text-red-600 active:bg-red-200 transition-colors">C</button>
                  <button @click="inputVal('/')" class="py-2.5 rounded-lg text-base font-medium bg-amber-100 text-amber-600 active:bg-amber-200 transition-colors">÷</button>

                  <button @click="inputVal('7')" class="py-3.5 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">7</button>
                  <button @click="inputVal('8')" class="py-3.5 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">8</button>
                  <button @click="inputVal('9')" class="py-3.5 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">9</button>
                  <button @click="inputVal('*')" class="py-3.5 rounded-xl text-lg font-medium bg-amber-100 text-amber-600 active:bg-amber-200 transition-colors">×</button>

                  <button @click="inputVal('4')" class="py-3.5 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">4</button>
                  <button @click="inputVal('5')" class="py-3.5 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">5</button>
                  <button @click="inputVal('6')" class="py-3.5 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">6</button>
                  <button @click="inputVal('-')" class="py-3.5 rounded-xl text-lg font-medium bg-amber-100 text-amber-600 active:bg-amber-200 transition-colors">−</button>

                  <button @click="inputVal('1')" class="py-3.5 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">1</button>
                  <button @click="inputVal('2')" class="py-3.5 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">2</button>
                  <button @click="inputVal('3')" class="py-3.5 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">3</button>
                  <button @click="inputVal('+')" class="py-3.5 rounded-xl text-lg font-medium bg-amber-100 text-amber-600 active:bg-amber-200 transition-colors">+</button>

                  <button @click="inputVal('0')" class="py-3.5 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">0</button>
                  <button @click="inputVal('.')" class="py-3.5 rounded-xl text-lg font-medium bg-white text-zinc-800 active:bg-zinc-100 transition-colors shadow-sm">.</button>
                  <button @click="backspace" class="py-3.5 rounded-xl text-base font-medium bg-zinc-200 text-zinc-700 active:bg-zinc-300 transition-colors">⌫</button>
                  <button @click="calculate" class="py-3.5 rounded-xl text-lg font-bold bg-amber-500 text-white active:bg-amber-600 transition-colors">=</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'financial'" class="space-y-5">
            <div class="grid sm:grid-cols-2 gap-5">
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-zinc-800 flex items-center gap-2">
                  <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  复利计算器
                </h3>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">本金（元）</label>
                    <input v-model.number="financial.principal" type="number" min="0" class="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="如：10000">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">年利率（%）</label>
                    <input v-model.number="financial.rate" type="number" step="0.01" min="0" max="100" class="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="如：3.5">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">存款期限</label>
                    <div class="flex gap-2">
                      <input v-model.number="financial.years" type="number" min="0" class="flex-1 px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="数值，如：3">
                      <select v-model="financial.termUnit" class="px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all">
                        <option value="year">年</option>
                        <option value="month">月</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">计息频率<span class="text-zinc-400 font-normal ml-1">（每年计息几次）</span></label>
                    <select v-model="financial.compoundFrequency" class="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all">
                      <option :value="1">每年（1次/年）</option>
                      <option :value="2">每半年（2次/年）</option>
                      <option :value="4">每季度（4次/年）</option>
                      <option :value="12">每月（12次/年）</option>
                      <option :value="365">每天（365次/年）</option>
                    </select>
                  </div>
                  <button @click="calculateCompound" class="w-full py-2.5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors">计算</button>
                </div>
                <div v-if="compoundResult" class="p-4 bg-emerald-50 rounded-xl space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-zinc-600">本息合计</span>
                    <span class="font-semibold text-emerald-600">¥{{ formatNumber(compoundResult.total) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-zinc-600">利息收益</span>
                    <span class="font-semibold text-emerald-600">¥{{ formatNumber(compoundResult.interest) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-zinc-600">收益率</span>
                    <span class="font-semibold text-emerald-600">{{ compoundResult.yieldRate }}%</span>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-zinc-800 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  等额本息还款计算器
                </h3>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">贷款金额（元）</label>
                    <input v-model.number="loan.principal" type="number" min="0" class="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="如：500000">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">年利率（%）</label>
                    <input v-model.number="loan.rate" type="number" step="0.01" min="0" class="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="如：4.1（商业贷）/ 3.1（公积金）">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-zinc-600 mb-1">
                      贷款期限
                      <span v-if="loanTotalMonths > 0" class="text-blue-500 font-normal ml-1">= 共 {{ loanTotalMonths }} 个月</span>
                    </label>
                    <div class="flex gap-2">
                      <div class="flex-1 relative">
                        <input v-model.number="loan.years" type="number" min="0" class="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10" placeholder="0">
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">年</span>
                      </div>
                      <div class="flex-1 relative">
                        <input v-model.number="loan.months" type="number" min="0" max="11" class="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10" placeholder="0">
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">月</span>
                      </div>
                    </div>
                    <p class="text-xs text-zinc-400 mt-1">两栏可单独填写，总期限 = 年 × 12 + 月。常见：30年 / 20年 / 10年</p>
                  </div>
                  <button @click="calculateLoan" class="w-full py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">计算还款</button>
                </div>
                <div v-if="loanResult" class="p-4 bg-blue-50 rounded-xl space-y-2">
                  <div class="flex justify-between text-sm font-medium border-b border-blue-100 pb-2 mb-1">
                    <span class="text-zinc-700">每月还款额</span>
                    <span class="text-lg font-bold text-blue-600">¥{{ formatNumber(loanResult.monthlyPayment) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-zinc-500">其中：每月还本金（等额）</span>
                    <span class="font-medium text-blue-500">¥{{ formatNumber(loanResult.monthlyPrincipal) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-zinc-500">其中：首月还利息</span>
                    <span class="font-medium text-blue-500">¥{{ formatNumber(loanResult.firstMonthInterest) }}</span>
                  </div>
                  <div class="flex justify-between text-sm border-t border-blue-100 pt-2 mt-1">
                    <span class="text-zinc-600">还款总额</span>
                    <span class="font-semibold text-blue-600">¥{{ formatNumber(loanResult.totalPayment) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-zinc-600">利息总额</span>
                    <span class="font-semibold text-blue-600">¥{{ formatNumber(loanResult.totalInterest) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-zinc-600">贷款期限</span>
                    <span class="font-medium text-zinc-500">{{ loanResult.termText }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-zinc-100 pt-6">
              <h3 class="text-lg font-semibold text-zinc-800 flex items-center gap-2 mb-1">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                理财收益计算器
              </h3>
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="text-sm text-zinc-400 shrink-0">计算方式：</span>
                <div class="flex gap-1 p-0.5 bg-zinc-100 rounded-lg shrink-0">
                  <button @click="investment.mode = 'simple'" class="px-3 py-1 rounded-md text-sm font-medium transition-all" :class="investment.mode === 'simple' ? 'bg-white text-amber-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'">单利</button>
                  <button @click="investment.mode = 'compound'" class="px-3 py-1 rounded-md text-sm font-medium transition-all" :class="investment.mode === 'compound' ? 'bg-white text-amber-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'">复利</button>
                </div>
                <span class="text-xs text-zinc-400">{{ investment.mode === 'simple' ? '适合货币基金、短期理财' : '适合长期投资、定期存款' }}</span>
              </div>
              <div class="grid sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-zinc-600 mb-1">投资金额（元）</label>
                  <input v-model.number="investment.amount" type="number" min="0" class="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="如：10000">
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-600 mb-1">年化收益率（%）</label>
                  <input v-model.number="investment.rate" type="number" step="0.01" min="0" class="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="如：3.5">
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-600 mb-1">投资天数</label>
                  <input v-model.number="investment.days" type="number" min="1" class="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="如：90">
                </div>
                <div class="flex items-end">
                  <button @click="calculateInvestment" class="w-full py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 active:bg-amber-600 transition-colors">计算收益</button>
                </div>
              </div>
              <div v-if="investmentResult" class="mt-4 p-4 bg-amber-50 rounded-xl">
                <div class="text-xs text-amber-600 text-center mb-3 font-medium">{{ investmentResult.modeLabel }}</div>
                <div class="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div class="text-sm text-zinc-500">到期总金额</div>
                    <div class="text-xl font-bold text-amber-600">¥{{ formatNumber(investmentResult.total) }}</div>
                  </div>
                  <div>
                    <div class="text-sm text-zinc-500">利息收益</div>
                    <div class="text-xl font-bold text-amber-600">¥{{ formatNumber(investmentResult.interest) }}</div>
                  </div>
                  <div>
                    <div class="text-sm text-zinc-500">日收益率</div>
                    <div class="text-xl font-bold text-amber-600">{{ investmentResult.dailyRate }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'binary'" class="space-y-4">
            <div class="bg-zinc-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-violet-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                进制转换器
              </h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-zinc-600 mb-1.5">输入数值</label>
                  <input v-model="binary.input" @input="convertBinary" class="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all text-lg font-mono" placeholder="输入任意进制数值（如 0x1F、0b1010、255）">
                </div>
                <div class="grid grid-cols-2 gap-2 sm:gap-4">
                  <div class="p-3 bg-white rounded-lg border border-zinc-200">
                    <div class="text-xs text-zinc-400 mb-1">二进制 (BIN)</div>
                    <div class="text-base sm:text-lg font-mono font-semibold text-violet-600 break-all leading-snug">{{ binaryResults.bin }}</div>
                  </div>
                  <div class="p-3 bg-white rounded-lg border border-zinc-200">
                    <div class="text-xs text-zinc-400 mb-1">八进制 (OCT)</div>
                    <div class="text-base sm:text-lg font-mono font-semibold text-emerald-600 break-all leading-snug">{{ binaryResults.oct }}</div>
                  </div>
                  <div class="p-3 bg-white rounded-lg border border-zinc-200">
                    <div class="text-xs text-zinc-400 mb-1">十进制 (DEC)</div>
                    <div class="text-base sm:text-lg font-mono font-semibold text-blue-600 break-all leading-snug">{{ binaryResults.dec }}</div>
                  </div>
                  <div class="p-3 bg-white rounded-lg border border-zinc-200">
                    <div class="text-xs text-zinc-400 mb-1">十六进制 (HEX)</div>
                    <div class="text-base sm:text-lg font-mono font-semibold text-amber-600 break-all leading-snug">{{ binaryResults.hex }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-zinc-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>
                字节转换器
              </h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-zinc-600 mb-1.5">字节数值</label>
                  <div class="flex gap-2">
                    <input v-model.number="byte.value" type="number" @input="convertByte" class="flex-1 min-w-0 px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-lg">
                    <select v-model="byte.unit" @change="convertByte" class="shrink-0 w-[72px] px-2 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-sm">
                      <option value="B">B</option>
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                      <option value="GB">GB</option>
                      <option value="TB">TB</option>
                      <option value="PB">PB</option>
                    </select>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2 sm:gap-3">
                  <div v-for="(value, unit) in byteResults" :key="unit" class="p-2.5 bg-white rounded-lg border border-zinc-200 text-center">
                    <div class="text-xs text-zinc-400 mb-0.5">{{ unit }}</div>
                    <div class="text-sm font-mono font-semibold text-cyan-600 truncate">{{ formatByteValue(value) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'unit'" class="space-y-4">
            <div class="bg-zinc-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                长度转换
              </h3>
              <div class="flex gap-2 mb-3">
                <input v-model.number="unit.length.value" @input="convertUnit('length')" type="number" class="flex-1 min-w-0 px-3 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all" placeholder="数值">
                <select v-model="unit.length.from" @change="convertUnit('length')" class="shrink-0 w-[90px] px-2 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-sm">
                  <option value="mm">毫米</option>
                  <option value="cm">厘米</option>
                  <option value="m">米</option>
                  <option value="km">千米</option>
                  <option value="in">英寸</option>
                  <option value="ft">英尺</option>
                  <option value="yd">码</option>
                  <option value="mi">英里</option>
                </select>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div v-for="(value, unit_name) in unitResults.length" :key="unit_name" class="p-2.5 bg-white rounded-lg border border-zinc-200 text-center">
                  <div class="text-xs text-zinc-400 mb-0.5">{{ unit_name }}</div>
                  <div class="text-sm font-semibold text-rose-600 truncate">{{ value }}</div>
                </div>
              </div>
            </div>

            <div class="bg-zinc-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                重量转换
              </h3>
              <div class="flex gap-2 mb-3">
                <input v-model.number="unit.weight.value" @input="convertUnit('weight')" type="number" class="flex-1 min-w-0 px-3 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="数值">
                <select v-model="unit.weight.from" @change="convertUnit('weight')" class="shrink-0 w-[90px] px-2 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm">
                  <option value="mg">毫克</option>
                  <option value="g">克</option>
                  <option value="kg">千克</option>
                  <option value="t">吨</option>
                  <option value="oz">盎司</option>
                  <option value="lb">磅</option>
                </select>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div v-for="(value, unit_name) in unitResults.weight" :key="unit_name" class="p-2.5 bg-white rounded-lg border border-zinc-200 text-center">
                  <div class="text-xs text-zinc-400 mb-0.5">{{ unit_name }}</div>
                  <div class="text-sm font-semibold text-blue-600 truncate">{{ value }}</div>
                </div>
              </div>
            </div>

            <div class="bg-zinc-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                时间转换
              </h3>
              <div class="flex gap-2 mb-3">
                <input v-model.number="unit.time.value" @input="convertUnit('time')" type="number" class="flex-1 min-w-0 px-3 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="数值">
                <select v-model="unit.time.from" @change="convertUnit('time')" class="shrink-0 w-[90px] px-2 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm">
                  <option value="s">秒</option>
                  <option value="ms">毫秒</option>
                  <option value="min">分钟</option>
                  <option value="h">小时</option>
                  <option value="d">天</option>
                </select>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div v-for="(value, unit_name) in unitResults.time" :key="unit_name" class="p-2.5 bg-white rounded-lg border border-zinc-200 text-center">
                  <div class="text-xs text-zinc-400 mb-0.5">{{ unit_name }}</div>
                  <div class="text-sm font-semibold text-amber-600 truncate">{{ value }}</div>
                </div>
              </div>
            </div>

            <div class="bg-zinc-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                面积转换
              </h3>
              <div class="flex gap-2 mb-3">
                <input v-model.number="unit.area.value" @input="convertUnit('area')" type="number" class="flex-1 min-w-0 px-3 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="数值">
                <select v-model="unit.area.from" @change="convertUnit('area')" class="shrink-0 w-[90px] px-2 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm">
                  <option value="mm2">mm²</option>
                  <option value="cm2">cm²</option>
                  <option value="m2">m²</option>
                  <option value="km2">km²</option>
                  <option value="ha">公顷</option>
                  <option value="acre">英亩</option>
                  <option value="ft2">ft²</option>
                  <option value="in2">in²</option>
                </select>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div v-for="(value, unit_name) in unitResults.area" :key="unit_name" class="p-2.5 bg-white rounded-lg border border-zinc-200 text-center">
                  <div class="text-xs text-zinc-400 mb-0.5">{{ unit_name }}</div>
                  <div class="text-sm font-semibold text-emerald-600 truncate">{{ value }}</div>
                </div>
              </div>
            </div>

            <div class="bg-zinc-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                温度转换
              </h3>
              <div class="flex gap-2 mb-3">
                <input v-model.number="unit.temp.value" @input="convertUnit('temp')" type="number" class="flex-1 min-w-0 px-3 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all" placeholder="数值">
                <select v-model="unit.temp.from" @change="convertUnit('temp')" class="shrink-0 w-[100px] px-2 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-sm">
                  <option value="C">摄氏 °C</option>
                  <option value="F">华氏 °F</option>
                  <option value="K">开尔文 K</option>
                </select>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div class="p-2.5 bg-white rounded-lg border border-zinc-200 text-center">
                  <div class="text-xs text-zinc-400 mb-0.5">摄氏度 °C</div>
                  <div class="text-sm font-semibold text-cyan-600">{{ unitResults.temp.C }}°C</div>
                </div>
                <div class="p-2.5 bg-white rounded-lg border border-zinc-200 text-center">
                  <div class="text-xs text-zinc-400 mb-0.5">华氏度 °F</div>
                  <div class="text-sm font-semibold text-cyan-600">{{ unitResults.temp.F }}°F</div>
                </div>
                <div class="p-2.5 bg-white rounded-lg border border-zinc-200 text-center">
                  <div class="text-xs text-zinc-400 mb-0.5">开尔文 K</div>
                  <div class="text-sm font-semibold text-cyan-600">{{ unitResults.temp.K }} K</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'relative'" class="space-y-4">
            <div class="bg-zinc-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-1 flex items-center gap-2">
                <svg class="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                亲戚称呼计算器
              </h3>
              <p class="text-xs sm:text-sm text-zinc-400 mb-4">逐步选择关系路径，如「我 → 父亲 → 哥哥 → 儿子」，自动计算汉语称谓</p>

              <!-- 路径展示 -->
              <div class="flex items-center flex-wrap gap-1.5 mb-4 p-2.5 sm:p-3 bg-white rounded-xl border border-zinc-200 min-h-[48px]">
                <span class="px-2.5 py-1 bg-rose-100 text-rose-600 rounded-lg text-sm font-semibold">我</span>
                <template v-for="(step, i) in relativeChain" :key="i">
                  <svg class="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  <span class="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium">{{ step }}</span>
                </template>
                <span v-if="relativeChain.length === 0" class="text-xs text-zinc-300 ml-1">点击下方关系词开始...</span>
              </div>

              <!-- 关系词选择 -->
              <div class="space-y-2.5 mb-4">
                <div>
                  <div class="text-xs font-medium text-zinc-400 mb-1.5">长辈</div>
                  <div class="flex flex-wrap gap-1.5">
                    <button v-for="rel in relativeOptions.elder" :key="rel"
                      @click="addRelativeStep(rel)"
                      :disabled="relativeChain.length >= 5"
                      class="px-2.5 py-1.5 rounded-lg text-sm border transition-all active:scale-95"
                      :class="relativeChain.length >= 5 ? 'border-zinc-100 text-zinc-300 cursor-not-allowed' : 'border-zinc-200 text-zinc-600 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 active:bg-rose-100'">
                      {{ rel }}
                    </button>
                  </div>
                </div>
                <div>
                  <div class="text-xs font-medium text-zinc-400 mb-1.5">平辈</div>
                  <div class="flex flex-wrap gap-1.5">
                    <button v-for="rel in relativeOptions.same" :key="rel"
                      @click="addRelativeStep(rel)"
                      :disabled="relativeChain.length >= 5"
                      class="px-2.5 py-1.5 rounded-lg text-sm border transition-all active:scale-95"
                      :class="relativeChain.length >= 5 ? 'border-zinc-100 text-zinc-300 cursor-not-allowed' : 'border-zinc-200 text-zinc-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 active:bg-blue-100'">
                      {{ rel }}
                    </button>
                  </div>
                </div>
                <div>
                  <div class="text-xs font-medium text-zinc-400 mb-1.5">晚辈</div>
                  <div class="flex flex-wrap gap-1.5">
                    <button v-for="rel in relativeOptions.younger" :key="rel"
                      @click="addRelativeStep(rel)"
                      :disabled="relativeChain.length >= 5"
                      class="px-2.5 py-1.5 rounded-lg text-sm border transition-all active:scale-95"
                      :class="relativeChain.length >= 5 ? 'border-zinc-100 text-zinc-300 cursor-not-allowed' : 'border-zinc-200 text-zinc-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 active:bg-emerald-100'">
                      {{ rel }}
                    </button>
                  </div>
                </div>
                <div>
                  <div class="text-xs font-medium text-zinc-400 mb-1.5">配偶</div>
                  <div class="flex flex-wrap gap-1.5">
                    <button v-for="rel in relativeOptions.spouse" :key="rel"
                      @click="addRelativeStep(rel)"
                      :disabled="relativeChain.length >= 5"
                      class="px-2.5 py-1.5 rounded-lg text-sm border transition-all active:scale-95"
                      :class="relativeChain.length >= 5 ? 'border-zinc-100 text-zinc-300 cursor-not-allowed' : 'border-zinc-200 text-zinc-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 active:bg-purple-100'">
                      {{ rel }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-2 mb-4">
                <button @click="removeLastRelativeStep" :disabled="relativeChain.length === 0"
                  class="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all active:scale-95"
                  :class="relativeChain.length === 0 ? 'border-zinc-100 text-zinc-300 cursor-not-allowed' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"/></svg>
                  退一步
                </button>
                <button @click="clearRelativeChain" :disabled="relativeChain.length === 0"
                  class="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all active:scale-95"
                  :class="relativeChain.length === 0 ? 'border-zinc-100 text-zinc-300 cursor-not-allowed' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  重置
                </button>
              </div>

              <!-- 结果展示 -->
              <div v-if="relativeChain.length > 0" class="p-3 sm:p-4 rounded-xl text-center"
                :class="relativeChainResult.found ? 'bg-rose-50' : 'bg-zinc-100'">
                <div class="text-xs sm:text-sm mb-1.5" :class="relativeChainResult.found ? 'text-zinc-500' : 'text-zinc-400'">
                  {{ relativeChainResult.found ? '对方是我的' : '路径描述' }}
                </div>
                <div class="text-xl sm:text-2xl font-bold" :class="relativeChainResult.found ? 'text-rose-600' : 'text-zinc-400'">
                  {{ relativeChainResult.name }}
                </div>
                <div v-if="!relativeChainResult.found" class="text-xs text-zinc-400 mt-1">
                  该称谓较复杂，可参考下方称呼表
                </div>
              </div>
            </div>

            <div class="bg-zinc-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-violet-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                常用亲戚称呼表
              </h3>
              <div class="grid sm:grid-cols-2 gap-3 text-sm">
                <div class="space-y-1.5">
                  <h4 class="font-medium text-zinc-700 border-b border-zinc-200 pb-1 text-xs sm:text-sm">父系亲属</h4>
                  <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs sm:text-sm text-zinc-600">
                    <div><span class="text-rose-500">爷爷</span> - 父亲的父亲</div>
                    <div><span class="text-rose-500">奶奶</span> - 父亲的母亲</div>
                    <div><span class="text-rose-500">伯父</span> - 父亲的哥哥</div>
                    <div><span class="text-rose-500">伯母</span> - 父亲的嫂子</div>
                    <div><span class="text-rose-500">叔叔</span> - 父亲的弟弟</div>
                    <div><span class="text-rose-500">姑姑</span> - 父亲的姐妹</div>
                    <div><span class="text-rose-500">堂兄</span> - 父亲的侄子</div>
                    <div><span class="text-rose-500">堂姐</span> - 父亲的侄女</div>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <h4 class="font-medium text-zinc-700 border-b border-zinc-200 pb-1 text-xs sm:text-sm">母系亲属</h4>
                  <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs sm:text-sm text-zinc-600">
                    <div><span class="text-violet-500">外公</span> - 母亲的父亲</div>
                    <div><span class="text-violet-500">外婆</span> - 母亲的母亲</div>
                    <div><span class="text-violet-500">舅舅</span> - 母亲的哥哥/弟弟</div>
                    <div><span class="text-violet-500">舅妈</span> - 母亲的嫂子</div>
                    <div><span class="text-violet-500">姨</span> - 母亲的姐妹</div>
                    <div><span class="text-violet-500">姨父</span> - 母亲的姐夫/妹夫</div>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <h4 class="font-medium text-zinc-700 border-b border-zinc-200 pb-1 text-xs sm:text-sm">兄弟姐妹</h4>
                  <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs sm:text-sm text-zinc-600">
                    <div><span class="text-blue-500">哥哥</span> - 兄</div>
                    <div><span class="text-blue-500">弟弟</span> - 弟</div>
                    <div><span class="text-blue-500">姐姐</span> - 姐</div>
                    <div><span class="text-blue-500">妹妹</span> - 妹</div>
                    <div><span class="text-blue-500">嫂子</span> - 兄之妻</div>
                    <div><span class="text-blue-500">弟媳</span> - 弟之妻</div>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <h4 class="font-medium text-zinc-700 border-b border-zinc-200 pb-1 text-xs sm:text-sm">子女晚辈</h4>
                  <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs sm:text-sm text-zinc-600">
                    <div><span class="text-emerald-500">儿子</span> - 男孩子</div>
                    <div><span class="text-emerald-500">女儿</span> - 女孩子</div>
                    <div><span class="text-emerald-500">孙子</span> - 儿子的儿子</div>
                    <div><span class="text-emerald-500">孙女</span> - 儿子的女儿</div>
                    <div><span class="text-emerald-500">外孙</span> - 女儿的儿子</div>
                    <div><span class="text-emerald-500">外孙女</span> - 女儿的女儿</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'lifestyle'" class="space-y-4">
            <div class="bg-zinc-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                生日信息
              </h3>
              <div class="grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-zinc-600 mb-1.5">出生年份</label>
                  <input v-model.number="lifestyle.birthYear" type="number" min="1900" max="2100" class="w-full px-2.5 sm:px-4 py-2.5 sm:py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm">
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-zinc-600 mb-1.5">出生月份</label>
                  <select v-model="lifestyle.birthMonth" class="w-full px-2.5 sm:px-4 py-2.5 sm:py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm">
                    <option v-for="m in 12" :key="m" :value="m">{{ m }} 月</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-zinc-600 mb-1.5">出生日期</label>
                  <select v-model="lifestyle.birthDay" class="w-full px-2.5 sm:px-4 py-2.5 sm:py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm">
                    <option v-for="d in 31" :key="d" :value="d">{{ d }} 日</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-3 sm:p-6">
                <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                  <span class="text-xl sm:text-2xl">♈</span>
                  星座查询
                </h3>
                <div class="text-center mb-3">
                  <div class="text-2xl sm:text-3xl font-bold text-orange-600 mb-0.5">{{ getZodiac() }}</div>
                  <div class="text-xs sm:text-sm text-zinc-500">{{ getZodiacEmoji() }} {{ getZodiacDateRange() }}</div>
                </div>
                <div class="space-y-1.5 text-xs sm:text-sm">
                  <div class="flex justify-between"><span class="text-zinc-600">星座符号</span><span class="font-medium">{{ getZodiacSymbol() }}</span></div>
                  <div class="flex justify-between"><span class="text-zinc-600">元素属性</span><span class="font-medium">{{ getZodiacElement() }}</span></div>
                  <div class="flex justify-between"><span class="text-zinc-600">宫位</span><span class="font-medium">{{ getZodiacHouse() }}</span></div>
                  <div class="flex justify-between"><span class="text-zinc-600">守护星</span><span class="font-medium">{{ getZodiacRuler() }}</span></div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-3 sm:p-6">
                <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                  <span class="text-xl sm:text-2xl">🐉</span>
                  生肖查询
                </h3>
                <div class="text-center mb-3">
                  <div class="text-2xl sm:text-3xl font-bold text-amber-600 mb-0.5">{{ getChineseZodiac() }}</div>
                  <div class="text-xs sm:text-sm text-zinc-500">{{ getChineseZodiacEmoji() }} {{ getChineseZodiacYear() }}</div>
                </div>
                <div class="space-y-1.5 text-xs sm:text-sm">
                  <div class="flex justify-between"><span class="text-zinc-600">五行属性</span><span class="font-medium">{{ getWuXing() }}</span></div>
                  <div class="flex justify-between"><span class="text-zinc-600">相配生肖</span><span class="font-medium">{{ getBestMatch() }}</span></div>
                  <div class="flex justify-between"><span class="text-zinc-600">今年运势</span><span class="font-medium">{{ getYearFortune() }}</span></div>
                  <div class="flex justify-between"><span class="text-zinc-600">幸运数字</span><span class="font-medium">{{ getLuckyNumbers() }}</span></div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                命理综合分析
              </h3>
              <div class="grid grid-cols-3 gap-2 sm:gap-4">
                <div class="bg-white/60 rounded-xl p-2.5 sm:p-4 text-center">
                  <div class="text-xs text-zinc-500 mb-0.5">星座</div>
                  <div class="text-lg sm:text-xl font-bold text-purple-600">{{ getZodiac() }}</div>
                </div>
                <div class="bg-white/60 rounded-xl p-2.5 sm:p-4 text-center">
                  <div class="text-xs text-zinc-500 mb-0.5">生肖</div>
                  <div class="text-lg sm:text-xl font-bold text-amber-600">{{ getChineseZodiac() }}</div>
                </div>
                <div class="bg-white/60 rounded-xl p-2.5 sm:p-4 text-center">
                  <div class="text-xs text-zinc-500 mb-0.5">五行</div>
                  <div class="text-lg sm:text-xl font-bold text-emerald-600">{{ getWuXing() }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'bloodtype'" class="space-y-4">
            <div class="bg-zinc-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                血型遗传计算器
              </h3>
              <div class="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-zinc-600 mb-1.5">父亲血型</label>
                  <div class="grid grid-cols-4 gap-1.5 sm:gap-2">
                    <button v-for="type in ['A', 'B', 'AB', 'O']" :key="type" @click="bloodTypeParent.father = type" class="py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-all active:scale-95" :class="bloodTypeParent.father === type ? 'bg-red-500 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 active:bg-zinc-100'">
                      {{ type }}
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-zinc-600 mb-1.5">母亲血型</label>
                  <div class="grid grid-cols-4 gap-1.5 sm:gap-2">
                    <button v-for="type in ['A', 'B', 'AB', 'O']" :key="type" @click="bloodTypeParent.mother = type" class="py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-all active:scale-95" :class="bloodTypeParent.mother === type ? 'bg-red-500 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 active:bg-zinc-100'">
                      {{ type }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="p-3 sm:p-4 bg-red-50 rounded-xl">
                <div class="text-center mb-2">
                  <span class="text-xs sm:text-sm text-zinc-500">子女可能血型概率</span>
                </div>
                <div class="grid grid-cols-4 gap-2 sm:gap-3">
                  <div v-for="(prob, type) in getBloodTypeChildResult()" :key="type" class="text-center p-2 sm:p-3 bg-white rounded-lg">
                    <div class="text-base sm:text-lg font-bold text-red-600">{{ type }}</div>
                    <div class="text-xs text-zinc-500">{{ prob }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-zinc-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3">血型遗传规则表</h3>
              <div class="overflow-x-auto -mx-1">
                <table class="w-full text-xs sm:text-sm">
                  <thead>
                    <tr class="border-b border-zinc-200">
                      <th class="text-left py-2 px-2 sm:px-3 font-medium text-zinc-600">父亲</th>
                      <th class="text-left py-2 px-2 sm:px-3 font-medium text-zinc-600">母亲</th>
                      <th class="text-left py-2 px-2 sm:px-3 font-medium text-zinc-600">子女可能血型</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="rule in bloodTypeRules" :key="rule.parents" class="border-b border-zinc-100 hover:bg-zinc-50">
                      <td class="py-1.5 px-2 sm:px-3">{{ rule.parents }}</td>
                      <td class="py-1.5 px-2 sm:px-3">{{ rule.mother }}</td>
                      <td class="py-1.5 px-2 sm:px-3 text-red-600 font-medium">{{ rule.children }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                血型知识小科普
              </h3>
              <div class="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-zinc-600">
                <div class="space-y-1.5">
                  <div><span class="font-medium text-zinc-800">A型：</span>红细胞表面有A抗原，血浆中有抗B抗体</div>
                  <div><span class="font-medium text-zinc-800">B型：</span>红细胞表面有B抗原，血浆中有抗A抗体</div>
                  <div><span class="font-medium text-zinc-800">AB型：</span>红细胞表面有A和B抗原，血浆中无抗体</div>
                  <div><span class="font-medium text-zinc-800">O型：</span>红细胞表面无抗原，血浆中有抗A和抗B抗体</div>
                </div>
                <div class="space-y-1.5">
                  <div><span class="font-medium text-zinc-800">Rh阳性：</span>红细胞表面有Rh抗原，中国约99%人为Rh阳性</div>
                  <div><span class="font-medium text-zinc-800">Rh阴性：</span>红细胞表面无Rh抗原，俗称"熊猫血"，中国约1%</div>
                  <div class="pt-1.5 border-t border-zinc-200"><span class="font-medium text-zinc-800">输血原则：</span>同型相输，紧急情况O型可输给任意血型</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const tabs = [
  { id: 'basic', name: '数学计算', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>` },
  { id: 'scientific', name: '科学计算', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>` },
  { id: 'financial', name: '金融计算', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` },
  { id: 'binary', name: '进制计算', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>` },
  { id: 'unit', name: '单位计算', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>` },
  { id: 'relative', name: '亲戚计算', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>` },
  { id: 'lifestyle', name: '生辰计算', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>` },
  { id: 'bloodtype', name: '血型计算', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>` }
]

const activeTab = ref('basic')
const display = ref('')
const expression = ref('')
const angleMode = ref('deg')
const copyToast = ref(false)

const financial = reactive({
  principal: null,
  rate: null,
  years: null,
  termUnit: 'year',
  compoundFrequency: 12
})

const loan = reactive({
  principal: null,
  rate: null,
  years: null,
  months: null
})

const investment = reactive({
  amount: null,
  rate: null,
  days: null,
  mode: 'simple'
})

const binary = reactive({
  input: ''
})

const byte = reactive({
  value: null,
  unit: 'MB'
})

const unit = reactive({
  length: { value: 1, from: 'm' },
  weight: { value: 1, from: 'kg' },
  time: { value: 1, from: 's' },
  area: { value: 1, from: 'm2' },
  temp: { value: 0, from: 'C' }
})

const compoundResult = ref(null)
const loanResult = ref(null)
const investmentResult = ref(null)

const loanTotalMonths = computed(() => {
  return (loan.years || 0) * 12 + (loan.months || 0)
})

const relative = reactive({
  myGender: 'male',
  theirGender: 'female',
  relationType: 'elder',
  level: 1,
  directRelation: 'father'
})

// 链式路径模式
const relativeChain = ref([])

const relativeOptions = {
  elder: ['父亲', '母亲', '爷爷', '奶奶', '外公', '外婆'],
  same: ['哥哥', '弟弟', '姐姐', '妹妹'],
  younger: ['儿子', '女儿', '孙子', '孙女'],
  spouse: ['丈夫', '妻子']
}

// 关系路径 → 汉语称谓映射表（key 为路径字符串，以>分隔）
const relativeTitles = {
  '父亲': '父亲（爸爸）',
  '母亲': '母亲（妈妈）',
  '哥哥': '哥哥',
  '弟弟': '弟弟',
  '姐姐': '姐姐',
  '妹妹': '妹妹',
  '儿子': '儿子',
  '女儿': '女儿',
  '丈夫': '丈夫',
  '妻子': '妻子',
  '爷爷': '爷爷（父亲的父亲）',
  '奶奶': '奶奶（父亲的母亲）',
  '外公': '外公（母亲的父亲）',
  '外婆': '外婆（母亲的母亲）',
  '孙子': '孙子（儿子的儿子）',
  '孙女': '孙女（儿子的女儿）',
  // 父系长辈
  '父亲>父亲': '爷爷',
  '父亲>母亲': '奶奶',
  '父亲>哥哥': '伯父（大爷）',
  '父亲>弟弟': '叔叔',
  '父亲>姐姐': '姑姑',
  '父亲>妹妹': '姑姑',
  '父亲>父亲>父亲': '曾祖父（太爷爷）',
  '父亲>父亲>母亲': '曾祖母（太奶奶）',
  '父亲>父亲>哥哥': '伯祖父',
  '父亲>父亲>弟弟': '叔祖父',
  '父亲>父亲>姐姐': '姑祖母',
  '父亲>父亲>妹妹': '姑祖母',
  // 母系长辈
  '母亲>父亲': '外公',
  '母亲>母亲': '外婆',
  '母亲>哥哥': '舅舅',
  '母亲>弟弟': '舅舅',
  '母亲>姐姐': '姨（姨妈）',
  '母亲>妹妹': '姨（姨妈）',
  '母亲>父亲>父亲': '外曾祖父（太外公）',
  '母亲>父亲>母亲': '外曾祖母（太外婆）',
  // 父系平辈
  '父亲>哥哥>儿子': '堂兄弟（堂哥/堂弟）',
  '父亲>哥哥>女儿': '堂姐妹（堂姐/堂妹）',
  '父亲>弟弟>儿子': '堂兄弟（堂哥/堂弟）',
  '父亲>弟弟>女儿': '堂姐妹（堂姐/堂妹）',
  '父亲>姐姐>儿子': '表兄弟（表哥/表弟）',
  '父亲>姐姐>女儿': '表姐妹（表姐/表妹）',
  '父亲>妹妹>儿子': '表兄弟（表哥/表弟）',
  '父亲>妹妹>女儿': '表姐妹（表姐/表妹）',
  // 母系平辈
  '母亲>哥哥>儿子': '表兄弟（表哥/表弟）',
  '母亲>哥哥>女儿': '表姐妹（表姐/表妹）',
  '母亲>弟弟>儿子': '表兄弟（表哥/表弟）',
  '母亲>弟弟>女儿': '表姐妹（表姐/表妹）',
  '母亲>姐姐>儿子': '表兄弟（表哥/表弟）',
  '母亲>姐姐>女儿': '表姐妹（表姐/表妹）',
  '母亲>妹妹>儿子': '表兄弟（表哥/表弟）',
  '母亲>妹妹>女儿': '表姐妹（表姐/表妹）',
  // 晚辈
  '儿子>儿子': '孙子',
  '儿子>女儿': '孙女',
  '女儿>儿子': '外孙',
  '女儿>女儿': '外孙女',
  '儿子>儿子>儿子': '曾孙',
  '儿子>儿子>女儿': '曾孙女',
  '女儿>儿子>儿子': '外曾孙',
  '女儿>儿子>女儿': '外曾孙女',
  // 兄弟姐妹的子女
  '哥哥>儿子': '侄子',
  '哥哥>女儿': '侄女',
  '弟弟>儿子': '侄子',
  '弟弟>女儿': '侄女',
  '姐姐>儿子': '外甥',
  '姐姐>女儿': '外甥女',
  '妹妹>儿子': '外甥',
  '妹妹>女儿': '外甥女',
  // 配偶的亲属
  '丈夫>父亲': '公公（公爹）',
  '丈夫>母亲': '婆婆',
  '丈夫>哥哥': '大伯子',
  '丈夫>弟弟': '小叔子',
  '丈夫>姐姐': '大姑子',
  '丈夫>妹妹': '小姑子',
  '妻子>父亲': '岳父（老丈人）',
  '妻子>母亲': '岳母（丈母娘）',
  '妻子>哥哥': '大舅子',
  '妻子>弟弟': '小舅子',
  '妻子>姐姐': '大姨子',
  '妻子>妹妹': '小姨子',
  // 父亲兄弟姐妹的配偶
  '父亲>哥哥>妻子': '伯母',
  '父亲>弟弟>妻子': '婶婶',
  '父亲>姐姐>丈夫': '姑父',
  '父亲>妹妹>丈夫': '姑父',
  '母亲>哥哥>妻子': '舅妈',
  '母亲>弟弟>妻子': '舅妈',
  '母亲>姐姐>丈夫': '姨父',
  '母亲>妹妹>丈夫': '姨父',
  // 兄弟配偶
  '哥哥>妻子': '嫂子',
  '弟弟>妻子': '弟媳',
  '姐姐>丈夫': '姐夫',
  '妹妹>丈夫': '妹夫',
  // 儿女配偶
  '儿子>妻子': '儿媳（媳妇）',
  '女儿>丈夫': '女婿',
}

const relativeChainResult = computed(() => {
  if (relativeChain.value.length === 0) return { found: false, name: '' }
  const key = relativeChain.value.join('>')
  const title = relativeTitles[key]
  if (title) return { found: true, name: title }
  // 给出路径描述
  const pathDesc = '我的' + relativeChain.value.join('的')
  return { found: false, name: pathDesc }
})

function addRelativeStep(rel) {
  if (relativeChain.value.length < 5) {
    relativeChain.value.push(rel)
  }
}

function removeLastRelativeStep() {
  relativeChain.value.pop()
}

function clearRelativeChain() {
  relativeChain.value = []
}

const relativeResult = ref(null)

const lifestyle = reactive({
  birthDate: '',
  birthYear: 2000,
  birthMonth: 1,
  birthDay: 1
})

const selectedBloodType = ref(null)

const bloodTypeParent = reactive({
  father: 'O',
  mother: 'O'
})

const binaryResults = reactive({
  bin: '0',
  oct: '0',
  dec: '0',
  hex: '0'
})

const byteResults = reactive({
  B: 0,
  KB: 0,
  MB: 0,
  GB: 0,
  TB: 0,
  PB: 0
})

const unitResults = reactive({
  length: {},
  weight: {},
  time: {},
  area: {},
  temp: { C: 0, F: 32, K: 273.15 }
})

function inputPercent() {
  expression.value += '/100'
  try {
    let evalExpr = expression.value
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/e(?![xp])/g, 'Math.E')
    display.value = eval(evalExpr).toString()
  } catch {
    display.value = ''
  }
}

function inputPow() {
  expression.value += '**'
  try {
    let evalExpr = expression.value
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/e(?![xp])/g, 'Math.E')
    display.value = eval(evalExpr).toString()
  } catch {
    display.value = ''
  }
}

function inputSquare() {
  expression.value += '**2'
  try {
    let evalExpr = expression.value
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/e(?![xp])/g, 'Math.E')
    display.value = eval(evalExpr).toString()
  } catch {
    display.value = ''
  }
}


function inputReciprocal() {
  expression.value += '1/'
  try {
    let evalExpr = expression.value
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/e(?![xp])/g, 'Math.E')
    display.value = eval(evalExpr).toString()
  } catch {
    display.value = ''
  }
}

function inputVal(val) {
  expression.value += val
  try {
    let evalExpr = expression.value
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/e(?![xp])/g, 'Math.E')
    display.value = eval(evalExpr).toString()
  } catch {
    display.value = ''
  }
}

function input(val) {
  expression.value += val
  try {
    let evalExpr = expression.value
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/e(?![xp])/g, 'Math.E')
    display.value = eval(evalExpr).toString()
  } catch {
    display.value = ''
  }
}

function clear() {
  display.value = ''
  expression.value = ''
}

function backspace() {
  expression.value = expression.value.slice(0, -1)
  try {
    let evalExpr = expression.value
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/e(?![xp])/g, 'Math.E')
    display.value = eval(evalExpr).toString()
  } catch {
    display.value = ''
  }
}

function copyResult() {
  const val = display.value
  if (!val || val === 'Error') return
  const doToast = () => {
    copyToast.value = true
    setTimeout(() => { copyToast.value = false }, 1500)
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(val).then(doToast).catch(() => {
      // fallback for non-HTTPS
      const el = document.createElement('textarea')
      el.value = val
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      doToast()
    })
  } else {
    const el = document.createElement('textarea')
    el.value = val
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    doToast()
  }
}

function calculate() {
  try {
    let evalExpr = expression.value
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/e(?![xp])/g, 'Math.E')
    const result = eval(evalExpr)
    if (!isFinite(result) || isNaN(result)) {
      display.value = 'Error'
      expression.value = ''
      return
    }
    display.value = result.toString()
    expression.value = display.value
  } catch {
    display.value = 'Error'
  }
}

function toggleAngleMode() {
  angleMode.value = angleMode.value === 'deg' ? 'rad' : 'deg'
}

function scientificCalc(fn) {
  let val = parseFloat(display.value)
  if (isNaN(val)) {
    display.value = 'Error'
    expression.value = ''
    return
  }

  let inputVal = val
  // 正弦/余弦/正切：角度模式下把输入的度数转为弧度再计算
  if (angleMode.value === 'deg' && ['sin', 'cos', 'tan'].includes(fn)) {
    inputVal = val * Math.PI / 180
  }
  // 反三角函数：输入是比值（[-1,1] 或任意实数），不做任何转换
  // asin/acos/atan 的输入是数值本身，不是角度

  let result
  switch(fn) {
    case 'sin': result = Math.sin(inputVal); break
    case 'cos': result = Math.cos(inputVal); break
    case 'tan': {
      // tan(90°) / tan(270°) 等趋于无穷，给出提示
      const deg = angleMode.value === 'deg' ? val : val * 180 / Math.PI
      const normalizedDeg = ((deg % 180) + 180) % 180
      if (Math.abs(normalizedDeg - 90) < 1e-9) {
        display.value = 'Error'
        expression.value = ''
        return
      }
      result = Math.tan(inputVal)
      break
    }
    case 'asin': {
      if (val < -1 || val > 1) { display.value = 'Error'; expression.value = ''; return }
      result = Math.asin(val)
      if (angleMode.value === 'deg') result = result * 180 / Math.PI
      break
    }
    case 'acos': {
      if (val < -1 || val > 1) { display.value = 'Error'; expression.value = ''; return }
      result = Math.acos(val)
      if (angleMode.value === 'deg') result = result * 180 / Math.PI
      break
    }
    case 'atan': {
      result = Math.atan(val)
      if (angleMode.value === 'deg') result = result * 180 / Math.PI
      break
    }
    case 'log': {
      if (val <= 0) { display.value = 'Error'; expression.value = ''; return }
      result = Math.log10(val)
      break
    }
    case 'ln': {
      if (val <= 0) { display.value = 'Error'; expression.value = ''; return }
      result = Math.log(val)
      break
    }
    case 'sqrt': {
      if (val < 0) { display.value = 'Error'; expression.value = ''; return }
      result = Math.sqrt(val)
      break
    }
    case 'cbrt': result = Math.cbrt(val); break
    case 'floor': result = Math.floor(val); break
    case 'ceil': result = Math.ceil(val); break
    case 'factorial': {
      const n = Math.floor(val)
      if (n < 0 || n > 170) { display.value = 'Error'; expression.value = ''; return }
      result = factorial(n)
      break
    }
    default: return
  }

  if (!isFinite(result) || isNaN(result)) {
    display.value = 'Error'
    expression.value = ''
    return
  }

  display.value = parseFloat(result.toPrecision(12)).toString()
  expression.value = display.value
}

function factorial(n) {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  return n * factorial(n - 1)
}

function calculateCompound() {
  const { principal, rate, years, termUnit, compoundFrequency } = financial
  if (!principal || principal <= 0 || !rate || rate < 0 || !years || years <= 0) return

  const r = rate / 100
  const n = compoundFrequency
  // 将期限统一转换为年
  const t = termUnit === 'month' ? years / 12 : years

  const total = principal * Math.pow(1 + r / n, n * t)
  const interest = total - principal

  compoundResult.value = {
    total,
    interest,
    yieldRate: ((interest / principal) * 100).toFixed(4)
  }
}

function calculateLoan() {
  const { principal, rate } = loan
  if (!principal || principal <= 0 || rate == null || rate < 0) return

  const totalMonths = loanTotalMonths.value
  if (totalMonths === 0) return

  const monthlyRate = rate / 100 / 12
  let monthlyPayment, firstMonthInterest

  if (monthlyRate === 0) {
    // 零利率：直接等额还本金，无利息
    monthlyPayment = principal / totalMonths
    firstMonthInterest = 0
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths)
    monthlyPayment = principal * (monthlyRate * factor) / (factor - 1)
    firstMonthInterest = principal * monthlyRate
  }

  const totalPayment = monthlyPayment * totalMonths
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const termText = years > 0 && months > 0
    ? `${years}年${months}个月`
    : years > 0 ? `${years}年` : `${months}个月`

  loanResult.value = {
    monthlyPayment,
    monthlyPrincipal: principal / totalMonths,
    firstMonthInterest,
    totalPayment,
    totalInterest: totalPayment - principal,
    termText
  }
}

function calculateInvestment() {
  const { amount, rate, days, mode } = investment
  if (!amount || amount <= 0 || !rate || rate < 0 || !days || days <= 0) return

  const annualRate = rate / 100
  const dailyRate = annualRate / 365
  let total

  if (mode === 'compound') {
    total = amount * Math.pow(1 + dailyRate, days)
  } else {
    total = amount * (1 + dailyRate * days)
  }

  const interest = total - amount

  investmentResult.value = {
    total,
    interest,
    dailyRate: (dailyRate * 100).toFixed(4),
    modeLabel: mode === 'compound' ? '复利计算（日复利）' : '单利计算（按天计息）'
  }
}

function getZodiac() {
  const month = lifestyle.birthMonth
  const day = lifestyle.birthDay
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座'
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '巨蟹座'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '狮子座'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '处女座'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return '天秤座'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return '天蝎座'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '射手座'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '摩羯座'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座'
  return '双鱼座'
}

function getZodiacSymbol() {
  const symbols = {
    '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
    '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
    '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓'
  }
  return symbols[getZodiac()] || '♈'
}

function getZodiacEmoji() {
  const emojis = {
    '白羊座': '🐏', '金牛座': '🐂', '双子座': '👯', '巨蟹座': '🦀',
    '狮子座': '🦁', '处女座': '👸', '天秤座': '⚖️', '天蝎座': '🦂',
    '射手座': '🏹', '摩羯座': '🐐', '水瓶座': '🏺', '双鱼座': '🐟'
  }
  return emojis[getZodiac()] || '🐏'
}

function getZodiacDateRange() {
  const ranges = {
    '白羊座': '3.21-4.19', '金牛座': '4.20-5.20', '双子座': '5.21-6.21',
    '巨蟹座': '6.22-7.22', '狮子座': '7.23-8.22', '处女座': '8.23-9.22',
    '天秤座': '9.23-10.22', '天蝎座': '10.23-11.21', '射手座': '11.22-12.21',
    '摩羯座': '12.22-1.19', '水瓶座': '1.20-2.18', '双鱼座': '2.19-3.20'
  }
  return ranges[getZodiac()] || ''
}

function getZodiacElement() {
  const elements = {
    '白羊座': '火象', '狮子座': '火象', '射手座': '火象',
    '金牛座': '土象', '处女座': '土象', '摩羯座': '土象',
    '双子座': '风象', '天秤座': '风象', '水瓶座': '风象',
    '巨蟹座': '水象', '天蝎座': '水象', '双鱼座': '水象'
  }
  return elements[getZodiac()] || ''
}

function getZodiacHouse() {
  const houses = {
    '白羊座': '第一宫', '金牛座': '第二宫', '双子座': '第三宫',
    '巨蟹座': '第四宫', '狮子座': '第五宫', '处女座': '第六宫',
    '天秤座': '第七宫', '天蝎座': '第八宫', '射手座': '第九宫',
    '摩羯座': '第十宫', '水瓶座': '第十一宫', '双鱼座': '第十二宫'
  }
  return houses[getZodiac()] || ''
}

function getZodiacRuler() {
  const rulers = {
    '白羊座': '火星', '金牛座': '金星', '双子座': '水星',
    '巨蟹座': '月亮', '狮子座': '太阳', '处女座': '水星',
    '天秤座': '金星', '天蝎座': '冥王星', '射手座': '木星',
    '摩羯座': '土星', '水瓶座': '天王星', '双鱼座': '海王星'
  }
  return rulers[getZodiac()] || ''
}

function getChineseZodiac() {
  const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
  return animals[(lifestyle.birthYear - 4) % 12]
}

function getChineseZodiacEmoji() {
  const emojis = {
    '鼠': '🐭', '牛': '🐮', '虎': '🐯', '兔': '🐰', '龙': '🐉', '蛇': '🐍',
    '马': '🐴', '羊': '🐑', '猴': '🐵', '鸡': '🐔', '狗': '🐶', '猪': '🐷'
  }
  return emojis[getChineseZodiac()] || '🐭'
}

function getChineseZodiacYear() {
  const year = lifestyle.birthYear
  return `${year}年（${getChineseZodiac()}年）`
}

function getWuXing() {
  const elements = ['木', '火', '土', '金', '水']
  return elements[(lifestyle.birthYear - 4) % 5]
}

function getBestMatch() {
  const zodiac = getChineseZodiac()
  const matches = {
    '鼠': '龙、猴、牛', '牛': '蛇、鸡、鼠', '虎': '马、狗、猪',
    '兔': '羊、狗、猪', '龙': '鸡、鼠、猴', '蛇': '猴、鸡、牛',
    '马': '虎、羊、狗', '羊': '兔、马、猪', '猴': '蛇、鼠、龙',
    '鸡': '蛇、龙、牛', '狗': '虎、兔、马', '猪': '虎、羊、兔'
  }
  return matches[zodiac] || ''
}

function getYearFortune() {
  const elements = getWuXing()
  const fortunes = {
    '木': '事业进步，财运亨通', '火': '感情顺利，健康良好',
    '土': '贵人相助，桃花旺盛', '金': '财运不错，事业稳定',
    '水': '思维活跃，适合学习'
  }
  return fortunes[elements] || ''
}

function getLuckyNumbers() {
  const zodiac = getChineseZodiac()
  const numbers = {
    '鼠': '2、3、9', '牛': '1、4、9', '虎': '1、3、4',
    '兔': '3、4、9', '龙': '1、6、9', '蛇': '2、3、9',
    '马': '2、3、7', '羊': '3、6、9', '猴': '1、7、9',
    '鸡': '2、5、8', '狗': '3、4、9', '猪': '2、5、8'
  }
  return numbers[zodiac] || '1、3、6'
}

function selectBloodType(type) {
  selectedBloodType.value = type
}

function getBloodTypePercent(type) {
  const percents = { 'A': '28%', 'B': '24%', 'AB': '7%', 'O': '41%' }
  return percents[type] || ''
}

function getBloodTypeTraits(type) {
  const traits = {
    'A': {
      strengths: '责任心强、细心、追求完美、善于忍耐',
      weaknesses: '容易焦虑、固执、内心敏感',
      personality: 'A型血的人通常性格内向，善于思考，注重细节，有强烈的责任感和道德观念。他们做事认真负责，追求完美，但也容易因为过度追求完美而给自己施加压力。在人际关系中，A型血的人通常比较保守，不善于表达自己的情感，但他们忠诚可靠，是值得信赖的朋友和伙伴。',
      careers: '适合从事需要细心和耐心的职业，如医生、护士、会计、工程师、设计师、公务员等'
    },
    'B': {
      strengths: '积极乐观、热情开朗、创造力强、适应力好',
      weaknesses: '容易冲动、缺乏耐心、责任心较弱',
      personality: 'B型血的人通常性格外向，热情开朗，善于交际。他们思维活跃，创造力强，喜欢尝试新事物。B型血的人适应能力很强，能够快速适应不同的环境和工作。但有时候他们可能会显得有些冲动，缺乏耐心，责任心不够强。',
      careers: '适合从事需要创造力和社交能力的职业，如销售、策划、媒体、艺术创作、创业者等'
    },
    'AB': {
      strengths: '理性冷静、逻辑性强、直觉敏锐、多才多艺',
      weaknesses: '容易矛盾、优柔寡断、情绪多变',
      personality: 'AB型血的人通常兼具A型和B型的特质，他们理性冷静，善于分析问题，逻辑性强。同时他们也有直觉敏锐的一面，能够快速洞察人心。AB型血的人往往多才多艺，兴趣广泛。但有时候他们可能会显得有些矛盾，优柔寡断，情绪多变。',
      careers: '适合从事需要分析和创意能力的职业，如设计师、策划、咨询师、律师、医生、教师等'
    },
    'O': {
      strengths: '自信果断、意志坚定、领导力强、乐观积极',
      weaknesses: '自负冲动、固执己见、容易傲慢',
      personality: 'O型血的人通常性格外向，自信果断，有很强的意志力和领导能力。他们乐观积极，面对困难能够保持坚韧不拔的精神。O型血的人做事情很有目标感，善于规划和组织。但有时候他们可能会显得有些自负和固执，忽视他人的意见。',
      careers: '适合从事需要领导能力和决断力的职业，如企业家、管理者、政治家、销售、运动员等'
    }
  }
  return traits[type] || { strengths: '', weaknesses: '', personality: '', careers: '' }
}

function getBloodTypeChildResult() {
  const father = bloodTypeParent.father
  const mother = bloodTypeParent.mother
  
  const bloodTypeMap = {
    'O': { genotype: ['ii'], a: 0, b: 0, ab: 0, o: 100 },
    'A': { genotype: ['IAi', 'IAIA'], a: 75, b: 0, ab: 25, o: 25 },
    'B': { genotype: ['IBi', 'IBIB'], a: 0, b: 75, ab: 25, o: 25 },
    'AB': { genotype: ['IAIB'], a: 50, b: 50, ab: 50, o: 0 }
  }
  
  const combos = {
    'O+O': { a: 0, b: 0, ab: 0, o: 100 },
    'O+A': { a: 50, b: 0, ab: 0, o: 50 },
    'O+B': { a: 0, b: 50, ab: 0, o: 50 },
    'O+AB': { a: 50, b: 50, ab: 0, o: 0 },
    'A+A': { a: 75, b: 0, ab: 0, o: 25 },
    'A+B': { a: 25, b: 25, ab: 25, o: 25 },
    'A+AB': { a: 50, b: 25, ab: 25, o: 0 },
    'B+B': { a: 0, b: 75, ab: 0, o: 25 },
    'B+AB': { a: 25, b: 50, ab: 25, o: 0 },
    'AB+AB': { a: 25, b: 25, ab: 50, o: 0 }
  }
  
  const key = [father, mother].sort().join('+')
  const result = combos[key] || { a: 0, b: 0, ab: 0, o: 0 }
  
  return {
    'A': result.a > 0 ? result.a + '%' : '不可能',
    'B': result.b > 0 ? result.b + '%' : '不可能',
    'AB': result.ab > 0 ? result.ab + '%' : '不可能',
    'O': result.o > 0 ? result.o + '%' : '不可能'
  }
}

const bloodTypeRules = [
  { parents: 'O', mother: 'O', children: 'O' },
  { parents: 'O', mother: 'A', children: 'A、O' },
  { parents: 'O', mother: 'B', children: 'B、O' },
  { parents: 'O', mother: 'AB', children: 'A、B' },
  { parents: 'A', mother: 'A', children: 'A、O' },
  { parents: 'A', mother: 'B', children: 'A、B、AB、O' },
  { parents: 'A', mother: 'AB', children: 'A、B、AB' },
  { parents: 'B', mother: 'B', children: 'B、O' },
  { parents: 'B', mother: 'AB', children: 'A、B、AB' },
  { parents: 'AB', mother: 'AB', children: 'A、B、AB' }
]

function convertBinary() {
  const input = binary.input.trim()
  if (!input) {
    binaryResults.bin = '0'
    binaryResults.oct = '0'
    binaryResults.dec = '0'
    binaryResults.hex = '0'
    return
  }
  
  try {
    let decimal
    if (input.startsWith('0x') || input.startsWith('0X')) {
      decimal = parseInt(input, 16)
    } else if (input.startsWith('0b') || input.startsWith('0B')) {
      decimal = parseInt(input, 2)
    } else if (input.startsWith('0o') || input.startsWith('0O')) {
      decimal = parseInt(input, 8)
    } else if (/^[0-9]+$/.test(input)) {
      // 纯十进制数字，默认当十进制
      decimal = parseInt(input, 10)
    } else if (/^[0-9a-fA-F]+$/.test(input)) {
      // 包含 a-f 字母的才当十六进制
      decimal = parseInt(input, 16)
    } else {
      decimal = parseInt(input, 10)
    }
    
    if (isNaN(decimal)) return
    
    binaryResults.bin = decimal.toString(2)
    binaryResults.oct = decimal.toString(8)
    binaryResults.dec = decimal.toString(10)
    binaryResults.hex = decimal.toString(16).toUpperCase()
  } catch {
    binaryResults.bin = 'Error'
    binaryResults.oct = 'Error'
    binaryResults.dec = 'Error'
    binaryResults.hex = 'Error'
  }
}

function convertByte() {
  const { value, unit } = byte
  if (!value) {
    Object.keys(byteResults).forEach(k => byteResults[k] = 0)
    return
  }
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const factor = 1024
  const unitIndex = units.indexOf(unit)
  const bytes = value * Math.pow(factor, unitIndex)
  
  units.forEach(u => {
    byteResults[u] = (bytes / Math.pow(factor, units.indexOf(u))).toFixed(4)
  })
}

function formatByteValue(val) {
  const num = parseFloat(val)
  return num >= 1000000 ? num.toExponential(2) : num.toLocaleString()
}

function convertUnit(type) {
  const data = unit[type]
  const val = data.value || 0
  
  if (type === 'length') {
    const toMeter = {
      mm: 0.001, cm: 0.01, m: 1, km: 1000,
      in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
    }
    const meters = val * toMeter[data.from]
    const fromMeter = {
      mm: '毫米', cm: '厘米', m: '米', km: '千米',
      in: '英寸', ft: '英尺', yd: '码', mi: '英里'
    }
    unitResults.length = Object.keys(toMeter).reduce((acc, u) => {
      acc[fromMeter[u]] = (meters / toMeter[u]).toFixed(6)
      return acc
    }, {})
  } else if (type === 'weight') {
    const toGram = {
      mg: 0.001, g: 1, kg: 1000, t: 1000000,
      oz: 28.3495, lb: 453.592
    }
    const grams = val * toGram[data.from]
    const fromGram = {
      mg: '毫克', g: '克', kg: '千克', t: '吨',
      oz: '盎司', lb: '磅'
    }
    unitResults.weight = Object.keys(toGram).reduce((acc, u) => {
      acc[fromGram[u]] = (grams / toGram[u]).toFixed(6)
      return acc
    }, {})
  } else if (type === 'time') {
    const toSecond = { s: 1, ms: 0.001, min: 60, h: 3600, d: 86400 }
    const seconds = val * (toSecond[data.from] || 1)
    unitResults.time = {
      '秒 (s)': seconds.toFixed(2),
      '毫秒 (ms)': (seconds * 1000).toFixed(2),
      '分钟 (min)': (seconds / 60).toFixed(6),
      '小时 (h)': (seconds / 3600).toFixed(8),
      '天 (d)': (seconds / 86400).toFixed(10)
    }
  } else if (type === 'area') {
    const toSqMeter = {
      mm2: 0.000001, cm2: 0.0001, m2: 1, km2: 1000000,
      ha: 10000, acre: 4046.86, ft2: 0.092903, in2: 0.00064516
    }
    const sqMeters = val * toSqMeter[data.from]
    const fromSqMeter = {
      mm2: 'mm²', cm2: 'cm²', m2: 'm²', km2: 'km²',
      ha: '公顷', acre: '英亩', ft2: 'ft²', in2: 'in²'
    }
    unitResults.area = Object.keys(toSqMeter).reduce((acc, u) => {
      acc[fromSqMeter[u]] = (sqMeters / toSqMeter[u]).toFixed(6)
      return acc
    }, {})
  } else if (type === 'temp') {
    let c, f, k
    if (data.from === 'C') {
      c = val
      f = val * 9 / 5 + 32
      k = val + 273.15
    } else if (data.from === 'F') {
      c = (val - 32) * 5 / 9
      f = val
      k = c + 273.15
    } else {
      k = val
      c = val - 273.15
      f = c * 9 / 5 + 32
    }
    unitResults.temp = {
      C: c.toFixed(2),
      F: f.toFixed(2),
      K: k.toFixed(2)
    }
  }
}

function formatNumber(num) {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

convertUnit('length')
convertUnit('weight')
convertUnit('time')
convertUnit('area')
convertUnit('temp')
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>