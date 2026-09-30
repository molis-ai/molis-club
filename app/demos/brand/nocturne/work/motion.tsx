'use client';
import { useEffect } from 'react';

// Scroll and pointer effects for the server-rendered page: reveals, the `--p`
// scene progress, the active chapter in the side rail, and the plugin wall
// spotlight. Everything degrades to a static page without it.
export function NocturneWorkMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.nw-page');
    if (!root) return;
    root.classList.add('is-ready');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          reveal.unobserve(entry.target);
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    );
    root
      .querySelectorAll('[data-reveal]')
      .forEach((element) => reveal.observe(element));

    const rail = root.querySelector<HTMLElement>('.nw-rail');
    const chapters = Array.from(
      root.querySelectorAll<HTMLElement>('.nw-chapter'),
    );
    const chapterObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || !rail) continue;
          rail.dataset.active = String(
            chapters.indexOf(entry.target as HTMLElement),
          );
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    chapters.forEach((chapter) => chapterObserver.observe(chapter));

    const scenes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-scene]'),
    );
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 2) continue;
        const p =
          scene.dataset.scene === 'enter'
            ? (vh - rect.top) / Math.max(1, vh * 0.9)
            : (vh - rect.top) / (vh + rect.height);
        scene.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
      }
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const wall = root.querySelector<HTMLElement>('.nw-wall');
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !wall || reduced.matches) return;
      const rect = wall.getBoundingClientRect();
      wall.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      wall.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };

    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    wall?.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      reveal.disconnect();
      chapterObserver.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      wall?.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return null;
}
