'use client';
import { Pause, Play } from 'lucide-react';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { Note } from '../../_site/ui';
import { useCue } from './cue';

// Tool 页演示的外壳（小零件在 parts.tsx，编排在 cue.ts 与 scripts.ts）。基础样式就是「做完了」的样子：
// 没有 JS、减少动态时停在结果上；动起来时由编排接管（data-run），一拍一拍地演。

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

/** 在视口里、页面在前台：画廊的六件也用它 */
export function useOnScreen(ref: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);
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
  }, [ref]);
  return inView && !hidden;
}

/** 右下角的暂停键 */
export function LoopToggle({
  stopped,
  onToggle,
}: {
  stopped: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="tl-loop-toggle"
      aria-pressed={stopped}
      aria-label={stopped ? '继续播放演示' : '暂停演示'}
      onClick={onToggle}
    >
      {stopped ? (
        <Play size={12} fill="currentColor" aria-hidden="true" />
      ) : (
        <Pause size={12} fill="currentColor" aria-hidden="true" />
      )}
    </button>
  );
}

/**
 * 循环演示：进入视口才播，离开或切到后台就停；右下角可以暂停。cue 是 scripts.ts 里那一段编排的名字。
 * interactive 的演示里有真的按钮：访客一按，循环停下，画面交给访客（hold），再按播放键接着循环。
 */
export function Loop({
  label,
  note,
  className = '',
  cue,
  interactive = false,
  children,
}: {
  label: string;
  note: string;
  className?: string;
  cue: string;
  /** 画面里有访客能按的东西：画面不再整块对读屏隐藏，由零件自己标 */
  interactive?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [hold, setHold] = useState<string | null>(null);
  const still = useStill();
  const shown = useOnScreen(ref);
  const [paused, setPaused] = useState(false);
  useCue(ref, cue, { live: shown && !paused, still, hold });

  const stopped = paused || hold !== null;
  return (
    <figure ref={ref} className={`tl-loop ${className}`}>
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
          <LoopToggle
            stopped={stopped}
            onToggle={() => {
              if (hold !== null) {
                setHold(null);
                setPaused(false);
              } else setPaused((value) => !value);
            }}
          />
        )}
      </figcaption>
    </figure>
  );
}
