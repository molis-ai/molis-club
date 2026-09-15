'use client';
import { useEffect, useRef, type ReactNode } from 'react';

export default function StudioScene({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const preference = () => {
      if (media.matches) root.classList.remove('has-ripple');
    };
    preference();

    media.addEventListener('change', preference);
    const move = (event: PointerEvent) => {
      if (media.matches || event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        root.style.setProperty('--scene-x', `${(x - 0.5) * 14}px`);
        root.style.setProperty('--scene-y', `${(y - 0.5) * 8}px`);
        root.style.setProperty('--light-x', `${x * 100}%`);
        root.style.setProperty('--light-y', `${y * 100}%`);
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      root.style.setProperty('--scene-x', '0px');
      root.style.setProperty('--scene-y', '0px');
    };
    const click = (event: MouseEvent) => {
      if (
        media.matches ||
        (event.target instanceof Element && event.target.closest('a,button'))
      )
        return;
      const rect = root.getBoundingClientRect();
      root.style.setProperty('--ripple-x', `${event.clientX - rect.left}px`);
      root.style.setProperty('--ripple-y', `${event.clientY - rect.top}px`);
      root.classList.remove('has-ripple');
      void root.offsetWidth;
      root.classList.add('has-ripple');
      clearTimeout(timer);
      timer = setTimeout(() => root.classList.remove('has-ripple'), 1800);
    };
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', leave);
    root.addEventListener('click', click);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      media.removeEventListener('change', preference);
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      root.removeEventListener('click', click);
    };
  }, []);

  return (
    <section
      className="studio-entrance"
      ref={rootRef}
      aria-label="Molis AI 创作工作室"
    >
      <div className="entrance-illustration" aria-hidden="true">
        <img
          src="/images/molis-makers-studio.png"
          width="1536"
          height="1024"
          alt=""
          fetchPriority="high"
        />
        <div className="entrance-daylight" />
      </div>
      <div className="entrance-ripple" aria-hidden="true" />
      {children}
    </section>
  );
}
