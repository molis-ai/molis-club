'use client';
import { useSyncExternalStore } from 'react';

// 访客在这一页上做过的事：给三层里「离开以后」的接续面板读。只在当前标签页的内存里，刷新即无，不存储、不上传。

export type Done = { action: string; text: string };

let items: Done[] = [];
const listeners = new Set<() => void>();

export function remember(item: Done) {
  items = [item, ...items.filter((old) => old.text !== item.text)].slice(0, 2);
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const empty: Done[] = [];

export function useDone() {
  return useSyncExternalStore(
    subscribe,
    () => items,
    () => empty,
  );
}
