'use client';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import './loop.css';

// 纯 CSS 时间轴的演示外壳：进入视口才从头播放，离开或切到后台就停；角上一个小按钮可以暂停。
// 演示的基础样式就是播完的样子，所以减少动态时（动画被关掉）直接停在结果上。

export function Loop({
  label,
  note,
  className = '',
  children,
}: {
  label: string;
  note?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    const sync = () => setHidden(document.hidden);
    observer.observe(node);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);
  const running = inView && !hidden && !paused;
  return (
    <figure
      ref={ref}
      className={`g-com-loop ${className}`}
      data-running={running}
      aria-label={label}
    >
      {children}
      {note ? (
        <figcaption className="g-com-loop-note">{note}</figcaption>
      ) : null}
      <button
        type="button"
        className="g-com-loop-toggle"
        aria-pressed={paused}
        aria-label={paused ? '继续播放演示' : '暂停演示'}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? (
          <Play size={13} fill="currentColor" aria-hidden="true" />
        ) : (
          <Pause size={13} fill="currentColor" aria-hidden="true" />
        )}
      </button>
    </figure>
  );
}
