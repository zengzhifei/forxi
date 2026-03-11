export const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 20,
  description: '8-20位，至少包含大写字母、小写字母、数字、特殊符号其中三种以上'
}

export function validatePassword(password) {
  if (!password) {
    return { valid: false, message: '请输入密码' }
  }
  
  if (password.length < PASSWORD_RULES.minLength || password.length > PASSWORD_RULES.maxLength) {
    return { valid: false, message: `密码长度需在${PASSWORD_RULES.minLength}-${PASSWORD_RULES.maxLength}位之间` }
  }
  
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`@]/.test(password)
  
  const types = [hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length
  
  if (types < 3) {
    return { valid: false, message: '至少包含大写字母、小写字母、数字、特殊符号其中三种以上' }
  }
  
  return { valid: true, message: '' }
}

export function getPasswordStrength(password) {
  if (!password) return { level: 0, text: '', color: '' }
  
  let score = 0
  
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`@]/.test(password)) score++
  
  if (score <= 2) return { level: 1, text: '弱', color: 'bg-red-500' }
  if (score <= 4) return { level: 2, text: '中等', color: 'bg-yellow-500' }
  if (score <= 5) return { level: 3, text: '强', color: 'bg-green-500' }
  return { level: 4, text: '非常强', color: 'bg-green-600' }
}
