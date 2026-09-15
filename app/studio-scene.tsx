'use client';
import { useEffect, useRef, type ReactNode } from 'react';

export default function StudioScene({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let x = 0;
    let y = 0;
    const draw = () => {
      frame = 0;
      if (document.hidden) return;
      const rect = root.getBoundingClientRect();
      const progress = media.matches
        ? 0
        : Math.max(
            0,
            Math.min(
              1,
              (window.innerHeight - rect.top) /
                (window.innerHeight + rect.height),
            ),
          );
      root.style.setProperty('--journey', String(progress));
      root.style.setProperty('--scene-x', `${media.matches ? 0 : x}px`);
      root.style.setProperty('--scene-y', `${media.matches ? 0 : y}px`);
    };
    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (media.matches || event.pointerType === 'touch') return;
      const rect = root.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
      y = (event.clientY / window.innerHeight - 0.5) * 10;
      schedule();
    };
    const leave = () => {
      x = 0;
      y = 0;
      schedule();
    };
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', leave);
    document.addEventListener('visibilitychange', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', leave);
      document.removeEventListener('visibilitychange', schedule);
    };
  }, []);
  return (
    <section
      className="studio-entrance"
      ref={rootRef}
      aria-label="一起创作的人"
    >
      <div className="entrance-stage">
        <div className="entrance-illustration" aria-hidden="true">
          <img
            src="/images/molis-makers-studio.png"
            width="1536"
            height="1024"
            alt=""
            loading="lazy"
          />
        </div>
        {children}
      </div>
    </section>
  );
}
