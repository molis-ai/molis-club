'use client';
import { useEffect, useRef, type ReactNode } from 'react';

// Only art moves; reading text and the native scroll position stay untouched.
export default function EditorialMotion({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pictures = Array.from(
      root.querySelectorAll<HTMLElement>(
        '.perspective-cover, .community-scene figure, .artist-gallery-item figure, .illustrated-note > img, .solution-opening-illustration, .artist-detail-spread > figure, .product-exhibition-main figure',
      ),
    );
    let frame = 0;
    const paint = () => {
      frame = 0;
      if (document.hidden) return;
      for (const picture of pictures) {
        const rect = picture.getBoundingClientRect();
        const visible = rect.bottom > 0 && rect.top < window.innerHeight;
        if (!visible && !media.matches) continue;
        const offset = media.matches
          ? 0
          : Math.max(
              -16,
              Math.min(
                16,
                (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.035,
              ),
            );
        picture.style.setProperty('--art-drift', `${offset}px`);
      }
    };
    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(paint);
    };
    for (const picture of pictures) picture.classList.add('flow-art');
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', schedule);
    document.addEventListener('visibilitychange', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', schedule);
      document.removeEventListener('visibilitychange', schedule);
    };
  }, []);
  return (
    <main id="main" className={className} ref={rootRef}>
      {children}
    </main>
  );
}
