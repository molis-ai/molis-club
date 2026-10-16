'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';

// 全站的动效钩子，从第八轮首页（r8）迁来。只用原生滚动，不劫持：滚动进度写进 CSS 变量，由样式决定怎么用。
// [data-scene]：--p（这一段从进入视口底边到离开视口顶边 0…1）、--pin（粘性段从贴住到离开 0…1）。
// [data-reveal] 与开窗 [data-open]：进入视口加 is-in，样式里做浮现、开窗。
// 跟随缓动：写进 CSS 的进度每帧向滚动位置追近一截（约 0.18，按帧时长换算），滚轮一格一格地跳，
// 画面却连续地滑过去，停下后约 0.3 秒落定。减少动态时直接等于滚动位置。

const FOLLOW = 0.18;

export function useSiteMotion<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const scenes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-scene]'),
    );
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const current = scenes.map(() => [-1, -1]);
    const target = scenes.map(() => [0, 0]);
    let frame = 0;
    let last = 0;

    const measure = () => {
      const vh = window.innerHeight || 1;
      scenes.forEach((scene, index) => {
        const rect = scene.getBoundingClientRect();
        target[index][0] = Math.min(
          1,
          Math.max(0, (vh - rect.top) / (rect.height + vh)),
        );
        const span = rect.height - vh;
        target[index][1] =
          span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      });
    };

    const step = (now: number) => {
      frame = 0;
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      const k = still.matches ? 1 : 1 - Math.pow(1 - FOLLOW, dt / 16.7);
      let moving = false;
      scenes.forEach((scene, index) => {
        for (const slot of [0, 1]) {
          const from = current[index][slot];
          const to = target[index][slot];
          const next =
            from < 0 || Math.abs(to - from) < 0.0004
              ? to
              : from + (to - from) * k;
          if (next !== to) moving = true;
          current[index][slot] = next;
        }
        scene.style.setProperty('--p', current[index][0].toFixed(4));
        scene.style.setProperty('--pin', current[index][1].toFixed(4));
      });
      if (moving) frame = requestAnimationFrame(step);
      else last = 0;
    };

    const request = () => {
      if (!scenes.length) return;
      measure();
      if (!frame) frame = requestAnimationFrame(step);
    };
    request();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
    );
    root
      .querySelectorAll<HTMLElement>('[data-reveal], [data-open]')
      .forEach((node) => observer.observe(node));

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      observer.disconnect();
    };
  }, []);
  return ref;
}

/** 是否偏好减少动态；服务端与水合时当作「是」，避免一上来就动 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return reduced;
}

/** 元素在视口里、页面也没被藏起来；循环动画只在这时候跑 */
export function useVisible<T extends Element>(
  ref: RefObject<T | null>,
  threshold = 0.15,
) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let inView = false;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio > 0;
        sync();
      },
      { threshold },
    );
    observer.observe(node);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [ref, threshold]);
  return visible;
}

/** 是否是能悬停的指针（触屏上第一次点是选中） */
export const canHover = () =>
  typeof window !== 'undefined' && matchMedia('(hover: hover)').matches;
