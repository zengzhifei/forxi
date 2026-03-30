import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data.code !== 0) {
      throw new Error(data.message || '请求失败')
    }
    return data
  },
  (error) => {
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : error
  }
)

export const api = {
  // ==================== 文件预览接口 ====================

  /**
   * 在线预览文件
   * 路由：GET /api/filereview/online
   */
  async previewOnline(fileUrl) {
    const res = await apiClient.get('/filereview/online', {
      params: { url: fileUrl }
    })
    return res.data
  },

  /**
   * 本地预览文件
   * 路由：POST /api/filereview/local
   */
  async previewLocal(file) {
    const formData = new FormData()
    formData.append('file', file)

    const res = await apiClient.post('/filereview/local', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  },

  // ==================== 图片处理接口 ====================

  /**
   * 去除图片背景
   * 路由：POST /api/image/remove-background
   */
  async removeBackground(file) {
    const formData = new FormData()
    formData.append('file', file)

    const res = await apiClient.post('/image/remove-background', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  },

  /**
   * 图片抠图（背景透明）
   * 路由：POST /api/image/transparent
   */
  async imageTransparent(file) {
    const formData = new FormData()
    formData.append('file', file)

    const res = await apiClient.post('/image/transparent', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  },

  /**
   * AI智能裁剪图片
   * 路由：POST /api/image/crop
   */
  async imageCrop(file, options = {}) {
    const formData = new FormData()
    formData.append('file', file)
    if (options.x) formData.append('x', options.x)
    if (options.y) formData.append('y', options.y)
    if (options.width) formData.append('width', options.width)
    if (options.height) formData.append('height', options.height)

    const res = await apiClient.post('/image/crop', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  },

  /**
   * 生成证件照
   * 路由：POST /api/image/photo
   */
  async imagePhoto(file, options = {}) {
    const formData = new FormData()
    formData.append('file', file)
    if (options.bg_color) formData.append('bg_color', options.bg_color)
    if (options.width) formData.append('width', options.width)
    if (options.height) formData.append('height', options.height)

    const res = await apiClient.post('/image/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  },

  // ==================== AI 接口 ====================

  /**
   * 获取可用的AI模型列表
   * 路由：GET /api/ai/models
   */
  async getAiModels(task) {
    const res = await apiClient.get('/ai/models', {
      params: { task }
    })
    return res.data
  },

  /**
   * 文本生成图片
   * 路由：POST /api/ai/text2image
   */
  async text2image(options = {}) {
    const formData = new FormData()
    formData.append('prompt', options.prompt)
    formData.append('model', options.model)
    formData.append('size', options.size || '1024x1024')
    if (options.negative_prompt) {
      formData.append('negative_prompt', options.negative_prompt)
    }

    const res = await apiClient.post('/ai/text2image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 5 * 60 * 1000
    })
    return res.data
  },

  /**
   * 图生图
   * 路由：POST /api/ai/image2image
   */
  async image2image(options = {}) {
    const formData = new FormData()
    formData.append('prompt', options.prompt)
    formData.append('model', options.model)
    if (options.file) formData.append('file', options.file)
    if (options.negative_prompt) formData.append('negative_prompt', options.negative_prompt)
    if (options.size) formData.append('size', options.size)

    const res = await apiClient.post('/ai/image2image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 5 * 60 * 1000
    })
    return res.data
  },

  /**
   * 查询任务状态
   * 路由：GET /api/ai/query/task
   */
  async queryTask(taskId) {
    const res = await apiClient.get('/ai/query/task', {
      params: { taskId }
    })
    return res.data
  },

  /**
   * 流式对话
   * 路由：POST /api/ai/chat
   */
  async chat(options = {}) {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        model: options.model,
        messages: options.messages
      })
    })
    return response
  },

  // ==================== 文章接口 ====================

  /**
   * 获取文章分类列表
   * 路由：GET /api/article/categories
   */
  async getArticleCategories() {
    const res = await apiClient.get('/article/categories')
    return res.data
  },

  /**
   * 获取文章列表
   * 路由：GET /api/article/list
   * @param {Object} options - 查询参数
   * @param {number} options.page - 页码
   * @param {number} options.pageSize - 每页数量
   * @param {string} options.query - 搜索关键词
   * @param {string} options.category - 分类筛选
   * @param {number} options.id - 文章ID筛选
   */
  async getArticleList(options = {}) {
    const params = {
      page: options.page || 1,
      pageSize: options.pageSize || 10,
      query: options.query || '',
      category: options.category || ''
    }
    if (options.id) {
      params.id = options.id
    }
    const res = await apiClient.get('/article/list', { params })
    return res.data
  },

  // ==================== 文件上传接口 ====================

  /**
   * 上传文件到存储
   * 路由：POST /api/common/upload
   */
  async uploadFile(file, scene = 'avatar') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('scene', scene)

    const res = await apiClient.post('/common/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  },

  // ==================== 互动接口 ====================

  /**
   * 点赞/取消点赞
   * 路由：POST /api/interact/like
   * @param {string} targetType - 目标类型 (article/comment)
   * @param {number} targetId - 目标ID
   */
  async like(targetType, targetId) {
    const res = await apiClient.post('/interact/like', {
      target_type: targetType,
      target_id: targetId
    })
    return res.data
  },

  /**
   * 记录浏览量
   * 路由：POST /api/interact/view
   * @param {string} targetType - 目标类型 (article/comment)
   * @param {number} targetId - 目标ID
   */
  async view(targetType, targetId) {
    const res = await apiClient.post('/interact/view', {
      target_type: targetType,
      target_id: targetId
    })
    return res.data
  },

  /**
   * 获取互动统计
   * 路由：GET /api/interact/stats
   * @param {string} targetType - 目标类型
   * @param {number[]|string} targetIds - 目标ID列表，逗号分隔或数组
   */
  async getInteractStats(targetType, targetIds) {
    const ids = Array.isArray(targetIds) ? targetIds.join(',') : String(targetIds)
    const res = await apiClient.get('/interact/stats', {
      params: {
        target_type: targetType,
        target_ids: ids
      }
    })
    return res.data
  }
}

export default api
