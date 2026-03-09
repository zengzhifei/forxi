import { computed, ref } from 'vue'

// 可刷新的计算属性
export function computedRefreshable<T>(factory: () => T) {
  const refresh = ref(0)
  const computedValue = computed(() => {
    refresh.value // 依赖于 refresh
    return factory()
  })
  
  return {
    value: computedValue,
    refresh: () => {
      refresh.value++
    }
  }
}