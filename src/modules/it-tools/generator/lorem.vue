<script setup>
import { ref, computed } from 'vue'

const paragraphCount = ref(3)
const sentencesPerParagraph = ref(4)
const includeHtml = ref(false)

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
  'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'dolores',
  'quas', 'molestias', 'excepturi', 'obcaecati', 'cupiditate', 'provident',
  'similique', 'mollitia', 'animi', 'perspiciatis', 'unde', 'omnis', 'iste',
  'natus', 'error', 'voluptatem', 'accusantium', 'doloremque', 'laudantium',
]

const startWords = [
  'Lorem', 'ipsum', 'dolor', 'sit', 'amet,', 'consectetur', 'adipiscing', 'elit.',
]

function generateSentence(minWords = 8, maxWords = 15) {
  const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords
  const words = []

  if (words.length === 0 && startWords.length > 0) {
    words.push(startWords[Math.floor(Math.random() * startWords.length)])
  }

  while (words.length < wordCount) {
    const word = loremWords[Math.floor(Math.random() * loremWords.length)]
    words.push(word)
  }

  let sentence = words.join(' ')
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
  return sentence
}

function generateParagraph(sentenceCount) {
  const sentences = []
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence())
  }
  return sentences.join(' ')
}

const generatedText = computed(() => {
  const paragraphs = []
  for (let i = 0; i < paragraphCount.value; i++) {
    paragraphs.push(generateParagraph(sentencesPerParagraph.value))
  }

  if (includeHtml.value) {
    return paragraphs.map(p => `<p>${p}</p>`).join('\n')
  }
  return paragraphs.join('\n\n')
})

function copyToClipboard() {
  navigator.clipboard.writeText(generatedText.value)
}
</script>

<template>
  <div class="h-full flex flex-col overflow-auto">
    <div class="mb-4 flex flex-wrap gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">段落数量</label>
        <input
          v-model.number="paragraphCount"
          type="number"
          min="1"
          max="20"
          class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">每段句子数</label>
        <input
          v-model.number="sentencesPerParagraph"
          type="number"
          min="1"
          max="20"
          class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400"
        />
      </div>
      <div class="flex items-end">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="includeHtml" class="rounded text-blue-500" />
          <span class="text-sm text-gray-700">包含 HTML 标签</span>
        </label>
      </div>
    </div>

    <div class="flex-1 flex flex-col">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-sm font-medium text-gray-700">生成结果</h3>
        <button
          @click="copyToClipboard"
          class="px-4 py-2 bg-zinc-600 text-white text-sm rounded-lg hover:bg-zinc-700 transition-colors"
        >
          复制文本
        </button>
      </div>
      <textarea
        :value="generatedText"
        readonly
        class="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm whitespace-pre-wrap"
      />
    </div>
  </div>
</template>
