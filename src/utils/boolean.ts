// 布尔值工具函数
export function toBoolean(value: any): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return !!value;
}

export function isBoolean(value: any): boolean {
  return typeof value === 'boolean';
}

// 检查函数是否不抛出错误
export function isNotThrowing(fn: () => any): boolean {
  try {
    fn();
    return true;
  } catch {
    return false;
  }
}