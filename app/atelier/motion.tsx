'use client';
import { useEffect, useRef, type ReactNode } from 'react';
export function Photo({
  src,
  alt = '',
  priority = false,
  className = '',
}: {
  src: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <img
      className={`atelier-photo ${className}`}
      src={src}
      alt={alt}
      width={src.endsWith('/makers-studio.jpg') ? 1672 : 1440}
      height={
        src.endsWith('/makers-studio.jpg')
          ? 941
          : src.endsWith('/threshold.jpg')
            ? 900
            : 960
      }
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
    />
  );
}
export default function AtelierMotion({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const pictures = Array.from(
      element.querySelectorAll<HTMLElement>('[data-photo-motion]'),
    );
    let frame = 0;
    const paint = () => {
      frame = 0;
      for (const picture of pictures) {
        const r = picture.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        picture.style.setProperty(
          '--photo-shift',
          media.matches
            ? '0px'
            : `${Math.max(-18, Math.min(18, (r.top + r.height / 2 - innerHeight / 2) * 0.03))}px`,
        );
      }
    };
    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(paint);
    };
    const hero = element.querySelector<HTMLElement>('.atelier-room-hero');
    const move = (event: PointerEvent) => {
      if (media.matches || event.pointerType !== 'mouse' || !hero) return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty(
        '--light-x',
        `${((event.clientX - r.left) / r.width) * 100}%`,
      );
      hero.style.setProperty(
        '--light-y',
        `${((event.clientY - r.top) / r.height) * 100}%`,
      );
      hero.style.setProperty(
        '--pointer-x',
        `${((event.clientX - r.left) / r.width - 0.5) * 7}px`,
      );
    };
    const leave = () => hero?.style.setProperty('--pointer-x', '0px');
    hero?.addEventListener('pointermove', move);
    hero?.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      hero?.removeEventListener('pointermove', move);
      hero?.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', schedule);
    };
  }, []);
  return (
    <main id="main" className={`atelier-main ${className}`} ref={root}>
      {children}
    </main>
  );
}
