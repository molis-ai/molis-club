'use client';
import { Pause, Play } from 'lucide-react';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Note, type Vars } from '../../_site/ui';

// Tool 页演示的两种外壳（小零件在 parts.tsx）。演示都是纯 CSS 时间轴，基础样式就是「做完了」的样子：
// 没有 JS、减少动态时停在结果上；动起来时由 data-play 打开动画。

export function useStill() {
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

/** 访客亲手接过演示：hold 是停下来的那个样子（例如 'clean'、'off'），null 是照常循环 */
type Hold = { hold: string | null; setHold: (value: string | null) => void };
const HoldContext = createContext<Hold>({ hold: null, setHold: () => {} });
export const useHold = () => useContext(HoldContext);

/**
 * 循环演示：进入视口才播，离开或切到后台就停；右下角可以暂停。
 * interactive 的演示里有真的按钮：访客一按，循环停下，画面交给访客（data-hold），再按播放键接着循环。
 * 时间轴从「做完的样子」开始：首屏一载入就看到结果，再看一遍怎么做到；
 * 往下的段落用 skip 跳过开头那段停留，进入视口时从空白开始搭。
 */
export function Loop({
  label,
  note,
  className = '',
  duration,
  skip = 0,
  interactive = false,
  children,
}: {
  label: string;
  note: string;
  className?: string;
  /** 一轮多少秒 */
  duration: number;
  /** 首次播放跳过开头的几分之几（0 到 1） */
  skip?: number;
  /** 画面里有访客能按的东西：画面不再整块对读屏隐藏，由零件自己标 */
  interactive?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [hold, setHold] = useState<string | null>(null);
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

  const play =
    still || hold ? undefined : inView && !hidden && !paused ? 'on' : 'off';
  const stopped = paused || hold !== null;
  return (
    <figure
      ref={ref}
      className={`tl-loop ${className}`}
      data-play={play}
      data-hold={hold ?? undefined}
      style={
        { '--dur': `${duration}s`, '--skip': `${-skip * duration}s` } as Vars
      }
    >
      <HoldContext.Provider value={{ hold, setHold }}>
        <div
          className="tl-loop-stage"
          aria-hidden={interactive ? undefined : 'true'}
        >
          {children}
        </div>
      </HoldContext.Provider>
      <figcaption className="tl-loop-foot">
        <span className="sr-only">{label}</span>
        <Note>{note}</Note>
        {still ? null : (
          <button
            type="button"
            className="tl-loop-toggle"
            aria-pressed={stopped}
            aria-label={stopped ? '继续播放演示' : '暂停演示'}
            onClick={() => {
              if (hold !== null) {
                setHold(null);
                setPaused(false);
              } else setPaused((value) => !value);
            }}
          >
            {stopped ? (
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
