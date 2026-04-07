<template>
  <div v-if="meta && meta.total > 0" class="flex items-center justify-center gap-2 mt-6">
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage <= 1"
      class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      上一页
    </button>

    <div class="flex items-center gap-1">
      <button
        v-for="pageNum in visiblePages"
        :key="pageNum"
        @click="goToPage(pageNum)"
        class="min-w-[36px] h-8 text-sm rounded-lg flex items-center justify-center transition-colors"
        :class="pageNum === currentPage
          ? 'bg-zinc-800 text-white'
          : pageNum === '...'
            ? 'text-gray-400 cursor-default'
            : 'border border-gray-200 text-gray-500 hover:bg-gray-50'"
        :disabled="pageNum === '...'"
      >
        {{ pageNum }}
      </button>
    </div>

    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage >= totalPages"
      class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      下一页
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  meta: {
    type: Object,
    default: () => ({ page: 1, page_size: 10, total: 0, total_pages: 1 })
  }
})

const emit = defineEmits(['page-change'])

const currentPage = computed(() => props.meta.page || 1)
const pageSize = computed(() => props.meta.page_size || 10)
const total = computed(() => props.meta.total || 0)
const totalPages = computed(() => props.meta.total_pages || Math.ceil(total.value / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const totalP = totalPages.value
  const current = currentPage.value

  if (totalP <= 7) {
    for (let i = 1; i <= totalP; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (current > 3) {
      pages.push('...')
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(totalP - 1, current + 1)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (current < totalP - 2) {
      pages.push('...')
    }

    if (!pages.includes(totalP)) {
      pages.push(totalP)
    }
  }

  return pages
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value || page === '...') {
    return
  }
  emit('page-change', page)
}
</script>
