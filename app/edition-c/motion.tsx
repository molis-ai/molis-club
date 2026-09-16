'use client';
import { useRef, useState, useEffect, type ReactNode } from 'react';
import Link from '../edition-link';
export function CMain({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || media.matches) return;
      const hero = (e.target as HTMLElement).closest<HTMLElement>('.c-hero');
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty(
        '--c-pan',
        `${((e.clientX - r.left) / r.width - 0.5) * 8}px`,
      );
    };
    const reset = () =>
      el
        .querySelector<HTMLElement>('.c-hero')
        ?.style.setProperty('--c-pan', '0px');
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
    media.addEventListener('change', reset);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', reset);
      media.removeEventListener('change', reset);
    };
  }, []);
  return (
    <main id="main" className="c-main" ref={root}>
      {children}
    </main>
  );
}
const scenes = [
  {
    name: '产品',
    title: '让工具，\n离生活近一点。',
    body: '从一个具体的小问题，开始做一件值得使用的作品。',
    image: '/images/atelier/studio-desk.jpg',
    href: '/products',
    action: '发现产品',
  },
  {
    name: '方法',
    title: '让好奇，\n成为可以用的能力。',
    body: '艺术家的观看方式，网页里的细微动效，都有可带走的方法。',
    image: '/images/edition-c/making-study.jpg',
    href: '/wiki',
    action: '翻开百科',
  },
  {
    name: '同伴',
    title: '让不同的想法，\n在这里相遇。',
    body: '从作品开始，认识创作背后的人。',
    image: '/images/atelier/shared-studio.jpg',
    href: '/community',
    action: '认识同伴',
  },
];
export function CScenes() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const scene = scenes[active];
  return (
    <section className="c-scenes">
      <div
        className="c-scene"
        role="tabpanel"
        id="c-scene-panel"
        aria-labelledby={`c-scene-tab-${active}`}
      >
        <img
          key={scene.image}
          src={scene.image}
          alt=""
          width="1440"
          height="960"
          loading="lazy"
        />
        <div className="c-scene-copy">
          <h2>{scene.title}</h2>
          <p>{scene.body}</p>
          <Link className="c-button c-button-light" href={scene.href}>
            {scene.action}
          </Link>
        </div>
      </div>
      <div
        className="c-scene-tabs"
        role="tablist"
        aria-label="工作室的三个方向"
      >
        {scenes.map((s, i) => (
          <button
            key={s.name}
            id={`c-scene-tab-${i}`}
            ref={(n) => {
              buttons.current[i] = n;
            }}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls="c-scene-panel"
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              let n = i;
              if (e.key === 'ArrowRight') n = (i + 1) % 3;
              else if (e.key === 'ArrowLeft') n = (i + 2) % 3;
              else if (e.key === 'Home') n = 0;
              else if (e.key === 'End') n = 2;
              else return;
              e.preventDefault();
              setActive(n);
              buttons.current[n]?.focus();
            }}
          >
            <span>{s.name}</span>
            <span>{s.body}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
