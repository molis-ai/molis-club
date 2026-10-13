'use client';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// Tool 页几段界面示意共用的「时间轴」：把一段小演示拆成几步，按步推进。
// - 进入视口才走，离开视口或页面切到后台就停；角上有暂停 / 播放。
// - 访客自己动手（点句子、点动作、拨开关、选时刻）时转为手动：只走到下一个停靠点就停下等人。
// - 减少动态时：一开始就停在最后一步（结果），不自动播放；手动操作直接跳到停靠点。
// 画面里每个部件用 data-on 表示「这一步时已经出现」，样式只管两种状态之间的过渡。

export type Timeline = {
  step: number;
  mode: 'auto' | 'manual';
  paused: boolean;
  running: boolean;
  reduce: boolean;
  /** 访客操作：跳到某一步，然后自动走到下一个停靠点 */
  go: (step: number) => void;
  play: () => void;
  pause: () => void;
};

export function useTimeline<T extends HTMLElement>({
  durations,
  holds,
  final,
  start = final,
}: {
  /** 每一步停留多久（毫秒），最后一步走完回到第 0 步 */
  durations: readonly number[];
  /** 手动时停下等人的步 */
  holds: readonly number[];
  /** 结果那一步：减少动态时直接停在这里 */
  final: number;
  /** 服务端先画哪一步；首屏用 0，视口外的演示用结果，免得没脚本时是空的 */
  start?: number;
}) {
  const ref = useRef<T>(null);
  const [step, setStep] = useState(start);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (first: boolean) => {
      setReduce(media.matches);
      if (media.matches) {
        setMode('manual');
        setStep(final);
      } else if (first) {
        setStep(0);
      } else {
        setMode('auto');
      }
    };
    apply(true);
    const change = () => apply(false);
    media.addEventListener('change', change);

    const node = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    if (node) observer.observe(node);
    const sync = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', sync);
    return () => {
      media.removeEventListener('change', change);
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [final]);

  const running = mode === 'auto' && !paused && !reduce && inView && !hidden;
  const waiting = mode === 'manual' && holds.includes(step);
  const advancing = running || (mode === 'manual' && !waiting && !hidden);

  useEffect(() => {
    if (!advancing) return;
    const id = window.setTimeout(
      () => setStep((value) => (value + 1) % durations.length),
      durations[step],
    );
    return () => window.clearTimeout(id);
  }, [advancing, step, durations]);

  const go = useCallback(
    (target: number) => {
      setMode('manual');
      if (reduce) {
        const next = holds.find((hold) => hold >= target);
        setStep(next ?? final);
      } else setStep(target);
    },
    [reduce, holds, final],
  );
  const play = useCallback(() => {
    setMode('auto');
    setPaused(false);
  }, []);
  const pause = useCallback(() => setPaused(true), []);

  const timeline: Timeline = {
    step,
    mode,
    paused,
    running,
    reduce,
    go,
    play,
    pause,
  };
  return [ref, timeline] as const;
}

/** 演示角上的小按钮：自动播放时是「暂停」，暂停或手动时是「播放」；减少动态时不出现 */
export function DemoToggle({ timeline }: { timeline: Timeline }) {
  if (timeline.reduce) return null;
  const playing = timeline.mode === 'auto' && !timeline.paused;
  return (
    <button
      type="button"
      className="et-ctl"
      aria-label={playing ? '暂停演示' : '继续播放演示'}
      onClick={playing ? timeline.pause : timeline.play}
    >
      {playing ? (
        <Pause size={11} fill="currentColor" aria-hidden="true" />
      ) : (
        <Play size={11} fill="currentColor" aria-hidden="true" />
      )}
      <span aria-hidden="true">{playing ? '暂停' : '播放'}</span>
    </button>
  );
}

/** 手动时回到开头的小按钮 */
export function DemoReset({ onReset }: { onReset: () => void }) {
  return (
    <button
      type="button"
      className="et-ctl"
      aria-label="重新开始演示"
      onClick={onReset}
    >
      <RotateCcw size={11} aria-hidden="true" />
      <span aria-hidden="true">重来</span>
    </button>
  );
}

/** 示意里的鼠标指针：白底墨线的箭头，尖端在左上角（与首页 Work 四步里的指针同形） */
export function Pointer({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`et-pointer ${className}`}
      viewBox="0 0 40 46"
      aria-hidden="true"
    >
      <path d="M8 2 L8 34 L16 26 L22 42 L28 40 L22 24 L34 24 Z" />
    </svg>
  );
}

/** 「这一步时已经出现」：data-on 的值 */
export const on = (step: number, from: number, to = Infinity) =>
  step >= from && step <= to;
