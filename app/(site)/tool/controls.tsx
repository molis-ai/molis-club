'use client';
import { useRef, type ReactNode } from 'react';
import { remember } from './memory';
import { useHold } from './stage';

// 演示里访客能亲手按的两样东西：「清理格式」和插件开关。一按，循环停下，画面交给访客；
// 按下以后的样子由编排脚本里的 acts 摆（scripts.ts），这里只说访客要哪个样子。

/** 以前与现在：真的「清理格式」。乱的那句收拢成干净的一句，再按一下退回去，可以再做一遍 */
export function CleanButton({
  c,
  action,
  text,
  children,
}: {
  c: string;
  action: string;
  /** 清理好的那一句，记进「离开以后」的接续里 */
  text: string;
  children: ReactNode;
}) {
  const { hold, setHold } = useHold();
  const clean = hold === 'clean';
  return (
    <button
      type="button"
      className="tl-bar-btn tl-act"
      data-first=""
      data-c={c}
      aria-pressed={clean}
      onClick={() => {
        if (clean) return setHold('messy');
        setHold('clean');
        remember({ action, text });
      }}
    >
      {children}
    </button>
  );
}

/** 插件开关：开着时四个入口都在，关上时一起收起，做好的字幕还在 */
export function PlugSwitch({
  c,
  labelledBy,
}: {
  c: string;
  labelledBy: string;
}) {
  const { hold, setHold } = useHold();
  const ref = useRef<HTMLButtonElement>(null);
  // 还在循环时，照画面上此刻的样子来：开着就关，关着就开（没在编排时是开着的）
  const shownOn = () => {
    const stage = ref.current?.closest<HTMLElement>('[data-run]');
    return !stage || (stage.dataset.cue ?? '').split(' ').includes('on');
  };
  const on = hold ? hold === 'on' : true;
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      className="tl-toggle"
      data-c={c}
      aria-checked={on}
      aria-labelledby={labelledBy}
      onClick={() => {
        const now = hold ?? (shownOn() ? 'on' : 'off');
        setHold(now === 'on' ? 'off' : 'on');
      }}
    >
      <i />
    </button>
  );
}
