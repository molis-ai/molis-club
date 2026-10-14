'use client';
import { useSyncExternalStore } from 'react';

// 白盒子美术馆（第七版首页与整站官网）共用的字体选择：记在浏览器里，两边选的是同一个。
// 用 useSyncExternalStore 读本地存储，服务端渲染与水合时都是默认字体，水合后再换成记住的那一个。

const KEY = 'molis-r7-font';
const EVENT = 'molis-font-change';

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(notify: () => void) {
  window.addEventListener('storage', notify);
  window.addEventListener(EVENT, notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener(EVENT, notify);
  };
}

/** 返回当前字体与选择函数；ids 是可选的字体，第一个是默认 */
export function useFontChoice<T extends string>(ids: readonly T[]) {
  const fallback = ids[0];
  const saved = useSyncExternalStore(subscribe, read, () => null);
  const font = ids.includes(saved as T) ? (saved as T) : fallback;
  const choose = (next: T) => {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // 记不住也不影响这一次的切换
    }
    window.dispatchEvent(new Event(EVENT));
  };
  return [font, choose] as const;
}
