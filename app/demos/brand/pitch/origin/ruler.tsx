'use client';
import { useEffect, useRef } from 'react';

const INK = [22, 27, 46];
const APRICOT = [233, 145, 94];

const mix = (a: number[], b: number[], t: number) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * t));

/**
 * 首屏刻度尺：零点对齐标题左缘，鼠标靠近处的刻度被“人”抬高。
 * 没有鼠标时有一个缓慢游走的点代替；减少动态时只响应真实指针。
 */
export function Ruler({ zeroLabel }: { zeroLabel: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const hero = canvas.closest('section');
    const anchor = hero?.querySelector('h1');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = matchMedia('(pointer: coarse)').matches;
    const mono =
      getComputedStyle(canvas).getPropertyValue('--font-og-mono').trim() ||
      'ui-monospace, monospace';

    let width = 0;
    let height = 0;
    let zero = 0;
    let gap = 8;
    let baseline = 0;
    let visible = true;
    let raf = 0;
    const start = performance.now();
    const pointer = { x: 0, active: false };
    const state = { x: 0, strength: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = width < 640 ? 7 : 8;
      baseline = height - 26;
      zero = anchor
        ? Math.max(12, anchor.getBoundingClientRect().left - rect.left)
        : 24;
      if (!state.x) state.x = zero + (width - zero) * 0.62;
    };

    const draw = (now: number) => {
      const t = now - start;
      let targetX: number;
      let targetStrength: number;
      if (pointer.active) {
        targetX = pointer.x;
        targetStrength = 1;
      } else if (reduce) {
        targetX = state.x;
        targetStrength = 0;
      } else {
        const span = width - zero;
        targetX =
          zero +
          span *
            (0.55 + 0.3 * Math.sin(t * 0.00021) + 0.08 * Math.sin(t * 0.00063));
        targetStrength = coarse ? 0.85 : 0.5;
      }
      const ease = pointer.active ? 0.16 : 0.04;
      state.x += (targetX - state.x) * ease;
      state.strength += (targetStrength - state.strength) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 基线
      ctx.strokeStyle = `rgba(${INK.join(',')},0.16)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, baseline + 0.5);
      ctx.lineTo(width, baseline + 0.5);
      ctx.stroke();

      const sigma = width < 640 ? 42 : 64;
      const lift = width < 640 ? 44 : 70;
      const first = -Math.floor(zero / gap);
      const last = Math.ceil((width - zero) / gap);
      ctx.font = `10px ${mono}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      let peak = 0;

      for (let i = first; i <= last; i++) {
        const x = Math.round(zero + i * gap) + 0.5;
        const major = i % 10 === 0;
        const mid = i % 5 === 0;
        const base = major ? 24 : mid ? 15 : 8;
        const d = x - state.x;
        const g = Math.exp(-(d * d) / (2 * sigma * sigma)) * state.strength;
        const idle = reduce
          ? 0
          : (Math.sin(t * 0.0011 - i * 0.16) * 0.5 + 0.5) * 2.5;
        const intro = reduce
          ? 1
          : Math.min(1, Math.max(0, (t - 200 - Math.abs(i) * 5) / 700));
        const grown = 1 - Math.pow(1 - intro, 3);
        const len = (base + g * lift + idle) * grown;
        if (Math.abs(d) < gap / 2) peak = len;

        const before = i < 0;
        const alpha = before ? 0.12 : (major ? 0.62 : 0.34) + g * 0.5;
        const color = i === 0 ? APRICOT : mix(INK, APRICOT, Math.pow(g, 1.4));
        ctx.strokeStyle = `rgba(${color.join(',')},${Math.min(1, i === 0 ? 1 : alpha) * grown})`;
        ctx.lineWidth = i === 0 ? 2 : major ? 1.2 : 1;
        ctx.beginPath();
        ctx.moveTo(x, baseline);
        ctx.lineTo(x, baseline - len);
        ctx.stroke();

        if (major && !before && grown > 0.4) {
          ctx.fillStyle = `rgba(${(i === 0 ? APRICOT : INK).join(',')},${0.5 * grown})`;
          ctx.fillText(String(i), x, baseline + 8);
        }
      }

      // 零点：一个温暖的点
      const pulse = reduce ? 0 : Math.sin(t * 0.002) * 0.5 + 0.5;
      const zeroLen = (24 + 2.5) * Math.min(1, t / 900);
      ctx.fillStyle = `rgba(${APRICOT.join(',')},${0.16 + pulse * 0.12})`;
      ctx.beginPath();
      ctx.arc(
        zero + 0.5,
        baseline - zeroLen - 12,
        9 + pulse * 3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.fillStyle = `rgb(${APRICOT.join(',')})`;
      ctx.beginPath();
      ctx.arc(zero + 0.5, baseline - zeroLen - 12, 4, 0, Math.PI * 2);
      ctx.fill();

      // 指针处的读数
      if (state.strength > 0.15 && state.x > zero + 30) {
        const value = (state.x - zero) / gap;
        const a = Math.min(1, (state.strength - 0.15) * 2);
        const y = baseline - Math.max(peak, 30) - 22;
        ctx.textBaseline = 'bottom';
        ctx.font = `11px ${mono}`;
        ctx.fillStyle = `rgba(${APRICOT.join(',')},${a})`;
        ctx.fillText(value.toFixed(1), state.x, y);
      }

      if (visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !hero) return;
      const h = hero.getBoundingClientRect();
      const c = canvas.getBoundingClientRect();
      pointer.active = event.clientY >= h.top && event.clientY <= h.bottom;
      pointer.x = event.clientX - c.left;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !was) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    const onVisibility = () => {
      const was = visible;
      visible = !document.hidden && canvas.getBoundingClientRect().bottom > 0;
      if (visible && !was) raf = requestAnimationFrame(draw);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="og-ruler">
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="og-ruler-zero">{zeroLabel}</span>
    </div>
  );
}
