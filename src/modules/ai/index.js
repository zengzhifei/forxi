import Text2Image from './text2image.vue'
import Image2Image from './image2image.vue'
import Chat from './chat.vue'

export const tools = {
  'text2image': { component: Text2Image, name: '文生图', description: '输入文字描述，AI 为你生成精美图片', category: 'image', icon: '🎨' },
  'image2image': { component: Image2Image, name: '图生图', description: '上传图片并描述变化，AI 帮你改造图片', category: 'image', icon: '🖼️' },
  'chat': { component: Chat, name: 'AI 对话', description: '智能对话，解答你的问题', category: 'chat', icon: '💬' }
}

export const categories = [
  {
    name: 'AI 绘画',
    key: 'image',
    tools: [
      { id: 'text2image', ...tools.text2image },
      { id: 'image2image', ...tools.image2image }
    ]
  },
  {
    name: 'AI 对话',
    key: 'chat',
    tools: [
      { id: 'chat', ...tools.chat }
    ]
  }
]

export { Text2Image, Image2Image, Chat }
