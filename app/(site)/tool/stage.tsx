'use client';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Note, type Vars } from '../../_site/ui';

// Tool 页演示的两种外壳（小零件在 parts.tsx）。演示都是纯 CSS 时间轴，基础样式就是「做完了」的样子：
// 没有 JS、减少动态时停在结果上；动起来时由 data-play 打开动画。

function useStill() {
  const [still, setStill] = useState(true);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStill(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return still;
}

/**
 * 循环演示：进入视口才播，离开或切到后台就停；右下角可以暂停。
 * 时间轴从「做完的样子」开始：首屏一载入就看到结果，再看一遍怎么做到；
 * 往下的段落用 skip 跳过开头那段停留，进入视口时从空白开始搭。
 */
export function Loop({
  label,
  note,
  className = '',
  duration,
  skip = 0,
  children,
}: {
  label: string;
  note: string;
  className?: string;
  /** 一轮多少秒 */
  duration: number;
  /** 首次播放跳过开头的几分之几（0 到 1） */
  skip?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const still = useStill();
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    const sync = () => setHidden(document.hidden);
    observer.observe(node);
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  const play = still ? undefined : inView && !hidden && !paused ? 'on' : 'off';
  return (
    <figure
      ref={ref}
      className={`tl-loop ${className}`}
      data-play={play}
      style={
        { '--dur': `${duration}s`, '--skip': `${-skip * duration}s` } as Vars
      }
    >
      <div className="tl-loop-stage" aria-hidden="true">
        {children}
      </div>
      <figcaption className="tl-loop-foot">
        <span className="sr-only">{label}</span>
        <Note>{note}</Note>
        {still ? null : (
          <button
            type="button"
            className="tl-loop-toggle"
            aria-pressed={paused}
            aria-label={paused ? '继续播放演示' : '暂停演示'}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? (
              <Play size={12} fill="currentColor" aria-hidden="true" />
            ) : (
              <Pause size={12} fill="currentColor" aria-hidden="true" />
            )}
          </button>
        )}
      </figcaption>
    </figure>
  );
}

/** 播一次的小样品：进入视口播一遍；指过去时重播（触屏上点一下也会触发） */
export function Replay({
  className = '',
  index = 0,
  children,
}: {
  className?: string;
  index?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useStill();
  const [state, setState] = useState<'wait' | 'on'>('wait');
  const [round, setRound] = useState(0);
  const last = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || still) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState('on');
        last.current = performance.now();
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [still]);

  const again = () => {
    if (still || state !== 'on') return;
    const now = performance.now();
    if (now - last.current < 1400) return;
    last.current = now;
    setRound((value) => value + 1);
  };

  return (
    <div
      ref={ref}
      className={`tl-replay ${className}`}
      data-play={still ? undefined : state}
      style={{ '--i': round ? 0 : index } as Vars}
      onPointerEnter={again}
    >
      <div key={round} className="tl-replay-in" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}
