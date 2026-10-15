'use client';
import { useEffect, useLayoutEffect, useState } from 'react';

// 两个玩具共用的「跟手」：手指（或键盘、点按）给出目标值，显示的值每帧向目标追近一截，
// 像拖着一件有一点分量的东西。拖动时追得快（约 70 毫秒），程序挪动时追得慢、像滑过去（约 420 毫秒）。
// 显示值只交给回调（由组件改 CSS 变量），不经过 React 重渲染。减少动态时直接跳到目标。

export type Follow = {
  /** 设定目标；glide 为 true 时慢慢滑过去，给数字则按这个毫秒数追 */
  to: (value: number, glide?: boolean | number) => void;
  /** 立刻跳到某个值（没有动画） */
  jump: (value: number) => void;
  value: () => number;
  target: () => number;
};

class Engine implements Follow {
  private now: number;
  private goal: number;
  private tau = 70;
  private frame = 0;
  private last = 0;
  private draw: (value: number) => void = () => {};
  private still = false;

  constructor(initial: number) {
    this.now = initial;
    this.goal = initial;
  }

  bind(draw: (value: number) => void, still: boolean) {
    this.draw = draw;
    this.still = still;
  }

  private step = (time: number) => {
    this.frame = 0;
    const dt = this.last ? Math.min(64, time - this.last) : 16.7;
    this.last = time;
    const k = 1 - Math.exp(-dt / this.tau);
    const gap = this.goal - this.now;
    this.now = Math.abs(gap) < 0.0005 ? this.goal : this.now + gap * k;
    this.draw(this.now);
    if (this.now !== this.goal) this.frame = requestAnimationFrame(this.step);
    else this.last = 0;
  };

  to = (value: number, glide: boolean | number = false) => {
    this.goal = value;
    this.tau = typeof glide === 'number' ? glide : glide ? 420 : 70;
    if (this.still) {
      this.now = value;
      this.draw(value);
      return;
    }
    if (!this.frame) this.frame = requestAnimationFrame(this.step);
  };

  jump = (value: number) => {
    this.goal = value;
    this.now = value;
    this.draw(value);
  };

  value = () => this.now;
  target = () => this.goal;

  redraw() {
    this.draw(this.now);
  }

  stop() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.last = 0;
  }
}

export function useFollow(
  initial: number,
  onFrame: (value: number) => void,
  reduced: boolean,
): Follow {
  const [engine] = useState(() => new Engine(initial));
  useLayoutEffect(() => {
    engine.bind(onFrame, reduced);
  }, [engine, onFrame, reduced]);
  useEffect(() => {
    engine.redraw();
    return () => engine.stop();
  }, [engine]);
  return engine;
}

export const clamp = (v: number, a: number, b: number) =>
  Math.min(b, Math.max(a, v));
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
export const ease = (t: number) => t * t * (3 - 2 * t);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
