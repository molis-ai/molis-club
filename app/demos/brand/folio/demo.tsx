'use client';
import { Pause, Play, Sparkles } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type RefObject,
  type ReactNode,
} from 'react';
import type { Vars } from './shared';
import './demo.css';

/** Timelines only advance while visible. Manual steps stop playback; reduced motion opens the result. */
export function useDemoClock(
  count: number,
  duration = 4200,
  ref: RefObject<HTMLDivElement | null>,
) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    const syncVisibility = () => {
      setVisible(inView && !document.hidden);
    };
    const syncMotion = () => {
      setReduced(media.matches);
      if (media.matches) {
        setStep(count - 1);
        setEntered(true);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) setEntered(true);
        syncVisibility();
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    media.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    syncMotion();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, [count, ref]);
  const playing = visible && !paused && !reduced;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (step < count - 1) setStep(step + 1);
      else setStep(0);
    }, duration);
    return () => clearTimeout(timer);
  }, [playing, step, count, duration, revision]);
  return {
    step,
    paused,
    playing,
    entered,
    reduced,
    revision,
    select: (next: number) => {
      setStep(next);
      setPaused(true);
    },
    toggle: () => {
      if (step === count - 1 && paused) {
        setStep(0);
        setRevision((v) => v + 1);
      }
      setPaused((v) => !v);
    },
    replay: () => {
      setStep(0);
      setPaused(false);
      setRevision((v) => v + 1);
    },
  };
}

export function DemoPlayer({
  label,
  steps,
  note = '交互示意 · 示例数据',
  children,
  tone = 'blue',
  duration = 4200,
  className = '',
}: {
  label: string;
  steps: string[];
  note?: string;
  children: (step: number) => ReactNode;
  tone?: string;
  duration?: number;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const clock = useDemoClock(steps.length, duration, rootRef);
  return (
    <div
      ref={rootRef}
      className={`fd-player ${className}`}
      data-tone={tone}
      data-playing={clock.playing}
      data-entered={clock.entered}
      data-step={clock.step}
      style={{ '--fd-duration': `${duration}ms` } as Vars}
    >
      <figure aria-label={label}>
        <div className="fd-scene" key={clock.revision}>
          {children(clock.step)}
        </div>
        <figcaption className="fd-caption">
          {note && <span className="fd-note">{note}</span>}
          <fieldset
            className="fd-controls"
            aria-label={`${label}播放控制`}
          >
            <div className="fd-dots">
              {steps.map((name, index) => (
                <button
                  key={name}
                  type="button"
                  aria-label={`查看步骤 ${index + 1}：${name}`}
                  aria-pressed={clock.step === index}
                  onClick={() => clock.select(index)}
                  title={name}
                >
                  <i aria-hidden="true" />
                </button>
              ))}
            </div>
            {!clock.reduced && (
              <button
                type="button"
                className="fd-pause"
                onClick={clock.toggle}
                aria-label={clock.paused ? '播放演示' : '暂停演示'}
                title={clock.paused ? '播放' : '暂停'}
              >
                {clock.paused ? <Play size={12} /> : <Pause size={12} />}
              </button>
            )}
          </fieldset>
        </figcaption>
      </figure>
    </div>
  );
}

export function DemoWindow({
  title,
  children,
  className = '',
  badge,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  badge?: string;
}) {
  return (
    <div className={`fd-window ${className}`}>
      <div className="fd-window-bar">
        <span className="fd-window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{title}</span>
        {badge && <small>{badge}</small>}
      </div>
      {children}
    </div>
  );
}

export function Source({ children }: { children: ReactNode }) {
  return (
    <div className="fd-source">
      <span aria-hidden="true">↗</span>
      {children}
    </div>
  );
}

export function Output({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`fd-output ${className}`}>
      <small>
        <Sparkles size={13} />
        {label}
      </small>
      {children}
    </div>
  );
}

export function Reveal({
  show,
  children,
  className = '',
}: {
  show: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`fd-reveal ${className}`}
      data-visible={show}
      aria-hidden={!show}
    >
      {children}
    </div>
  );
}
