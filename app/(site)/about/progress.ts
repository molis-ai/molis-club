'use client';
import { useEffect, type RefObject } from 'react';

// 「关于」几章钉住的故事共用：一段钉住的区块走了多少（0–1）写进它自己的 --p，样式里用 calc 跟着走，不重画 React；
// 跨过 stops 里的某个点时回调一次（只在变化时），用来换整段的字。只读滚动位置，不劫持滚动。

export function useProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  stops: readonly number[] = [],
  onStage?: (stage: number) => void,
) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    let last = -1;
    const read = () => {
      frame = 0;
      const box = node.getBoundingClientRect();
      const span = box.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -box.top / span)) : 1;
      node.style.setProperty('--p', p.toFixed(4));
      if (onStage) {
        const stage = stops.filter((stop) => p >= stop).length;
        if (stage !== last) {
          last = stage;
          onStage(stage);
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [ref, stops, onStage]);
}
