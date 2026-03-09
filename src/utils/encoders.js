/**
 * 编码器工具函数
 * 提供各种编码和解码功能
 */

/**
 * Base64编码函数
 * @param {string} str - 需要编码的字符串
 * @returns {string} - 编码后的Base64字符串
 */
export const base64Encode = (str) => {
  if (typeof btoa !== 'undefined') {
    return btoa(unescape(encodeURIComponent(str)))
  } else {
    try {
      return Buffer.from(str).toString('base64')
    } catch (e) {
      console.error('Base64 encoding not supported')
      return str
    }
  }
}

/**
 * Base64解码函数
 * @param {string} str - 需要解码的Base64字符串
 * @returns {string} - 解码后的原始字符串
 */
export const base64Decode = (str) => {
  if (typeof atob !== 'undefined') {
    return decodeURIComponent(escape(atob(str)))
  } else {
    try {
      return Buffer.from(str, 'base64').toString()
    } catch (e) {
      console.error('Base64 decoding not supported')
      return str
    }
  }
}
