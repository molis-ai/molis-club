'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';

// 三个方向共用的动效钩子。只用原生滚动：滚动进度写进 CSS 变量，由样式决定怎么用。
// 根节点：--page（整页读到哪 0…1）、is-scrolled（顶栏出现细线）、data-header（顶栏下面是影像还是纸面）。
// [data-scene]：--p（这一段从进入视口底边到离开视口顶边 0…1）。
// [data-reveal]：进入视口加 is-in，样式里做淡入上移。
// 减少动态时 --p、--page 照常写（有的场景靠它换颜色），但样式里不再做位移。
//
// 丝滑：滚动本身仍是原生的（不劫持），但写进 CSS 的进度不直接等于滚动位置，而是每帧向它追近一截
// （约 0.18，按帧时长换算，高刷新率屏幕上一样快）。鼠标滚轮一格一格地跳，画面的溶解、推镜、淡入
// 却是连续滑过去的，停下后约 0.3 秒落定。减少动态时直接等于滚动位置。

const FOLLOW = 0.18;

export function useR8Motion<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const scenes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-scene]'),
    );
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    // 每一段的当前值与目标值：[p, pin]
    const current = scenes.map(() => [-1, -1]);
    const target = scenes.map(() => [0, 0]);
    let page = -1;
    let pageTarget = 0;
    let frame = 0;
    let last = 0;

    const measure = () => {
      const vh = window.innerHeight || 1;
      const max = document.documentElement.scrollHeight - vh;
      pageTarget = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      root.classList.toggle('is-scrolled', window.scrollY > 8);
      // 顶栏下面压着的是影像（data-tone="dark"）还是纸面：决定顶栏用白字还是黑字
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 32)
        .map((node) => node.closest('[data-tone]'))
        .find(Boolean);
      root.dataset.header = under?.getAttribute('data-tone') ?? 'light';
      scenes.forEach((scene, index) => {
        const rect = scene.getBoundingClientRect();
        const total = rect.height + vh;
        target[index][0] = Math.min(1, Math.max(0, (vh - rect.top) / total));
        // 粘性段：从顶边贴住到底边离开 0…1
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
      const ease = (from: number, to: number) =>
        from < 0 || Math.abs(to - from) < 0.0004 ? to : from + (to - from) * k;
      let moving = false;
      page = ease(page, pageTarget);
      if (page !== pageTarget) moving = true;
      root.style.setProperty('--page', page.toFixed(4));
      scenes.forEach((scene, index) => {
        for (const slot of [0, 1]) {
          const next = ease(current[index][slot], target[index][slot]);
          if (next !== target[index][slot]) moving = true;
          current[index][slot] = next;
        }
        scene.style.setProperty('--p', current[index][0].toFixed(4));
        scene.style.setProperty('--pin', current[index][1].toFixed(4));
      });
      if (moving) frame = requestAnimationFrame(step);
      else last = 0;
    };

    const request = () => {
      measure();
      if (!frame) frame = requestAnimationFrame(step);
    };
    request();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);

    const reveals = root.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
    reveals.forEach((node) => observer.observe(node));

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
        inView = entry.isIntersecting;
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
