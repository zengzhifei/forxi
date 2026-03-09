// 复制文本到剪贴板
export async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Failed to copy:', e);
    return false;
  }
}

// 复制组合式函数
export function useCopy() {
  return {
    copy
  };
}