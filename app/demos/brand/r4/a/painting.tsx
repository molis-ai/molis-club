'use client';
import { useEffect, useRef, useState } from 'react';
import { prepare } from './painter';
import { fallback, scenes, type SceneName } from './scenes';

/**
 * 一幅在浏览器里画出来的画。进入视口才开始画，约 2.4 秒画完；尺寸变化后立即重画成品。
 * 减少动态时直接出成品。画完之前，底下是同一组颜色的渐变。
 */
export function Painting({
  scene,
  className = '',
  duration = 2400,
  onDone,
}: {
  scene: SceneName;
  className?: string;
  duration?: number;
  onDone?: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    const node = canvas.current;
    const ctx = node?.getContext('2d');
    if (!node || !ctx) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let started = false;
    let painted = false;
    let lastSize = '';

    const paint = (animate: boolean) => {
      cancelAnimationFrame(frame);
      const rect = node.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.round(rect.width * scale);
      const height = Math.round(rect.height * scale);
      lastSize = `${width}x${height}`;
      node.width = width;
      node.height = height;
      const job = prepare(ctx, scenes[scene], width, height, scale);
      if (!animate) {
        job.step(job.total);
        painted = true;
        setDone(true);
        doneRef.current?.();
        return;
      }
      const start = performance.now();
      let drawn = 0;
      const tick = (now: number) => {
        // 前快后慢：先铺满大色块，细节慢慢落下
        const t = Math.min(1, (now - start) / duration);
        const target = Math.round(job.total * (1 - Math.pow(1 - t, 2.2)));
        job.step(target - drawn);
        drawn = target;
        if (t < 1) frame = requestAnimationFrame(tick);
        else {
          painted = true;
          setDone(true);
          doneRef.current?.();
        }
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        paint(!reduce);
      },
      { threshold: 0.12 },
    );
    observer.observe(node);

    let resizeTimer = 0;
    const resize = new ResizeObserver(() => {
      if (!started) return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const rect = node.getBoundingClientRect();
        const scale = Math.min(window.devicePixelRatio || 1, 1.5);
        const size = `${Math.round(rect.width * scale)}x${Math.round(rect.height * scale)}`;
        if (size !== lastSize && painted) paint(false);
      }, 180);
    });
    resize.observe(node);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      observer.disconnect();
      resize.disconnect();
    };
  }, [scene, duration]);

  return (
    <span
      className={`wa-painting ${className}`}
      data-done={done}
      style={{ backgroundImage: fallback[scene] }}
      aria-hidden="true"
    >
      <canvas ref={canvas} />
    </span>
  );
}
