'use client';
import { useEffect, useRef, type RefObject } from 'react';
import { css, type Light } from './daylight';

// 一片天：渐变、太阳或月亮的光晕、夜里的星星，以及缓慢飘过的云。
// 云是一团团柔和的圆叠起来的，亮面朝上；颜色随时刻变化。进入视口才动，减少动态时静止。

type Puff = { dx: number; dy: number; r: number };
type Cloud = {
  x: number;
  y: number;
  scale: number;
  speed: number;
  puffs: Puff[];
};

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function makeClouds(seed: number, count: number): Cloud[] {
  const rand = seeded(seed);
  return Array.from({ length: count }, () => {
    const puffs: Puff[] = [];
    const n = 9 + Math.floor(rand() * 9);
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1) - 0.5;
      puffs.push({
        dx: t * 2.4 + (rand() - 0.5) * 0.3,
        dy: -Math.cos(t * Math.PI) * 0.55 * rand() - 0.1,
        r: 0.42 + Math.cos(t * Math.PI) * 0.45 + rand() * 0.2,
      });
    }
    return {
      x: rand(),
      y: 0.12 + rand() * 0.5,
      scale: 0.06 + rand() * 0.07,
      speed: 0.004 + rand() * 0.006,
      puffs,
    };
  });
}

export function Sky({
  light,
  seed = 7,
  clouds = 7,
  className = '',
}: {
  light: RefObject<Light>;
  seed?: number;
  clouds?: number;
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvas.current;
    const ctx = node?.getContext('2d');
    if (!node || !ctx) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const field = makeClouds(seed, clouds);
    const starRand = seeded(seed + 99);
    const stars = Array.from({ length: 140 }, () => ({
      x: starRand(),
      y: starRand() * 0.7,
      r: 0.4 + starRand() * 1.1,
      phase: starRand() * Math.PI * 2,
    }));
    let frame = 0;
    let visible = false;
    let last = 0;
    let time = 0;
    let width = 0;
    let height = 0;

    const size = () => {
      const rect = node.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.round(rect.width * scale));
      height = Math.max(1, Math.round(rect.height * scale));
      node.width = width;
      node.height = height;
    };

    const draw = () => {
      const l = light.current;
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, css(l.top));
      gradient.addColorStop(0.55, css(l.mid));
      gradient.addColorStop(1, css(l.low));
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 日月的光晕
      const sx = l.sunX * width;
      const sy = l.sunY * height;
      const base = Math.min(width, height);
      const glow = ctx.createRadialGradient(
        sx,
        sy,
        0,
        sx,
        sy,
        base * (l.night ? 0.35 : 0.6),
      );
      glow.addColorStop(
        0,
        l.night ? 'rgb(236 232 214 / 0.35)' : 'rgb(255 248 228 / 0.75)',
      );
      glow.addColorStop(1, 'rgb(255 248 228 / 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      ctx.beginPath();
      ctx.fillStyle = l.night
        ? 'rgb(240 236 220 / 0.92)'
        : 'rgb(255 252 240 / 0.95)';
      ctx.arc(sx, sy, base * (l.night ? 0.022 : 0.03), 0, Math.PI * 2);
      ctx.fill();

      // 星星
      if (l.stars > 0.01) {
        for (const star of stars) {
          const twinkle = 0.55 + Math.sin(time * 1.6 + star.phase) * 0.45;
          ctx.globalAlpha = l.stars * twinkle;
          ctx.fillStyle = '#f4f1e4';
          ctx.beginPath();
          ctx.arc(
            star.x * width,
            star.y * height,
            star.r * (width / 1400) * 1.4,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // 云：先画一层略暗的底，再画亮面
      const cloudColor = l.cloud;
      const underColor = [
        (cloudColor[0] * 0.78 + l.mid[0] * 0.22) | 0,
        (cloudColor[1] * 0.78 + l.mid[1] * 0.22) | 0,
        (cloudColor[2] * 0.8 + l.mid[2] * 0.2) | 0,
      ];
      for (const cloud of field) {
        const cx = (((cloud.x + time * cloud.speed) % 1.4) - 0.2) * width;
        const cy = cloud.y * height;
        const unit = cloud.scale * width;
        for (const pass of [0, 1]) {
          for (const puff of cloud.puffs) {
            const px = cx + puff.dx * unit;
            const py = cy + puff.dy * unit + (pass ? 0 : unit * 0.16);
            const r = puff.r * unit;
            const g = ctx.createRadialGradient(
              px,
              py - r * 0.2,
              r * 0.1,
              px,
              py,
              r,
            );
            const c = pass ? cloudColor : underColor;
            const alpha = pass
              ? l.night
                ? 0.35
                : 0.85
              : l.night
                ? 0.25
                : 0.55;
            g.addColorStop(
              0,
              `rgb(${c[0] | 0} ${c[1] | 0} ${c[2] | 0} / ${alpha})`,
            );
            g.addColorStop(
              0.6,
              `rgb(${c[0] | 0} ${c[1] | 0} ${c[2] | 0} / ${alpha * 0.5})`,
            );
            g.addColorStop(1, `rgb(${c[0] | 0} ${c[1] | 0} ${c[2] | 0} / 0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (now - last < 1000 / 30) return;
      const delta = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      time += delta;
      draw();
    };
    const sync = () => {
      const run = visible && !reduce && !document.hidden;
      if (run && !frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      } else if (!run && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    size();
    draw();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(node);
    const resize = new ResizeObserver(() => {
      size();
      draw();
    });
    resize.observe(node);
    // 时刻被拖动时，即使静止也要重画
    const redraw = () => draw();
    window.addEventListener('wd-light', redraw);
    document.addEventListener('visibilitychange', sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener('wd-light', redraw);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [light, seed, clouds]);

  return (
    <canvas ref={canvas} className={`wd-sky ${className}`} aria-hidden="true" />
  );
}
