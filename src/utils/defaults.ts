// 默认值工具函数
export function defaults<T>(obj: T, ...defaults: Partial<T>[]): T {
  const result = { ...obj };
  for (const defaultObj of defaults) {
    for (const key in defaultObj) {
      if (result[key] === undefined) {
        result[key] = defaultObj[key];
      }
    }
  }
  return result;
}

// 错误时返回默认值
export function withDefaultOnError<T>(fn: () => T, defaultValue: T): T {
  try {
    return fn();
  } catch {
    return defaultValue;
  }
}