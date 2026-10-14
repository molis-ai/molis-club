'use client';
import { useEffect, useRef } from 'react';

// 首屏墙上那件作品的第二幕：镜头横移、走近墙右边的展签，展签上写着 We build not only software,
// 下面多出一行跑马灯，是我们给 ware 的新定语：Warm ware · Human ware · …，都流向最右端固定的 x‑ware（x 不被定义）。
// 展签始终钉在墙上，动的是镜头；这里量出「走到展签前」要横移多少、往前走多少，写进首屏的 CSS 变量。

export type Word = { text: string };

/** 新的定义：从愿景（技术回到人的尺度）和落款（始终好奇，持续创造）里来；第一个 Soft 是原句里的那个 */
export const words: Word[] = [
  'Soft',
  'Warm',
  'Human',
  'Curious',
  'Creative',
  'Calm',
  'Playful',
  'Intelligent',
  'Efficient',
].map((text) => ({ text }));
const defs = words.slice(1).map((word) => word.text);

/** 一圈：Warm ware · Human ware · … · （x‑ware 不在圈里，它固定在这一行的最右端） */
function Loop() {
  return (
    <span className="g-h-mq-run">
      {defs.map((d) => (
        <span key={d} className="g-h-mq-item">
          <b>{d}</b> ware<i className="g-h-mq-dot">·</i>
        </span>
      ))}
    </span>
  );
}

/**
 * 跑马灯：这一串定义从左往右流，在最右端固定不动的 x‑ware 前面渐隐，像都汇进了 x。
 * 两圈首尾相接，16 秒走完一圈；读屏读一遍完整的列表。
 */
export function Marquee() {
  return (
    <p className="g-h-mq" lang="en">
      <span className="sr-only">
        {defs.map((d) => `${d} ware`).join(', ')}, x-ware.
      </span>
      <span className="g-h-mq-window" aria-hidden="true">
        <span className="g-h-mq-track">
          <Loop />
          <Loop />
        </span>
      </span>
      <span className="g-h-mq-end" aria-hidden="true">
        <em>x</em>-ware
      </span>
    </p>
  );
}

/**
 * 量出镜头走到展签前的位移：--walk-x、--walk-y（横移，让展签落在透视中心）和 --walk-z（再往前走多少，
 * 让展签约占视野宽度的 46%）。展签和墙在同一个平面上，两者的差除以投影比例就是镜头坐标里的距离，
 * 所以什么时候量都一样。窄屏是平墙、减少动态时不走，这三个值清掉。
 */
export function useLabelWalk() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const hero = ref.current;
    const room = hero?.querySelector<HTMLElement>('.g-room');
    const wall = hero?.querySelector<HTMLElement>('.g-wall');
    const label = hero?.querySelector<HTMLElement>('.g-h-label-hero');
    if (!hero || !room || !wall || !label) return;
    const still = matchMedia(
      '(max-width: 900px), (prefers-reduced-motion: reduce)',
    );
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (still.matches) {
        for (const key of ['--walk-x', '--walk-y', '--walk-z'])
          hero.style.removeProperty(key);
        return;
      }
      const w = wall.getBoundingClientRect();
      const l = label.getBoundingClientRect();
      if (!w.width || !wall.offsetWidth || !l.width) return;
      const scale = w.width / wall.offsetWidth;
      const dx = (l.left + l.width / 2 - (w.left + w.width / 2)) / scale;
      const dy = (l.top + l.height / 2 - (w.top + w.height / 2)) / scale;
      const css = getComputedStyle(room);
      const P = parseFloat(css.getPropertyValue('--P')) || 1100;
      const D = parseFloat(css.getPropertyValue('--D')) || 1500;
      const T = parseFloat(css.getPropertyValue('--T')) || 1050;
      // 推到底时墙在 -D + T；要让展签占视野约 46%，墙得走到 P - P / 目标比例
      const target = Math.min(room.clientWidth * 0.46, 760) / (l.width / scale);
      const z = Math.min(P - P / target, P * 0.7);
      hero.style.setProperty('--walk-x', `${(-dx).toFixed(1)}px`);
      // 透视中心在视野 46% 的高度，比正中高一点
      hero.style.setProperty(
        '--walk-y',
        `${(-0.04 * room.clientHeight - dy).toFixed(1)}px`,
      );
      hero.style.setProperty(
        '--walk-z',
        `${Math.max(0, z - (T - D)).toFixed(1)}px`,
      );
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(request);
    observer.observe(room);
    observer.observe(label);
    still.addEventListener('change', request);
    void document.fonts?.ready.then(request);
    request();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      still.removeEventListener('change', request);
    };
  }, []);
  return ref;
}
