// Base64 工具函数
import { Base64 } from 'js-base64';

export function encodeBase64(text: string): string {
  return Base64.encode(text);
}

export function decodeBase64(base64: string): string {
  return Base64.decode(base64);
}

export function isBase64(str: string): boolean {
  try {
    return Base64.decode(str) !== '';
  } catch {
    return false;
  }
}

// 别名函数
export const textToBase64 = encodeBase64;
export const base64ToText = decodeBase64;
export const isValidBase64 = isBase64;