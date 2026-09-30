'use client';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const HOME = '/demos/brand/edition-c';
export const WORK = '/demos/brand/edition-c/work';

// 与 /edition-c 首页同一组词、同一套打字节奏：A、I 常驻，后缀逐字打出再退格。
const phrases = [
  ['mplify', 'deas'],
  ['waken', 'magination'],
  ['dvance', 'ntuition'],
  ['ugment', 'ntelligence'],
  ['ccelerate', 'nnovation'],
  ['rtistic', 'nspiration'],
  ['rtful', 'nteractions'],
  ['daptive', 'nterfaces'],
];

export function WordCycle() {
  const root = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const previousPositions = useRef<number[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [available, setAvailable] = useState(false);
  const [reduced, setReduced] = useState(true);
  const playing = available && !reduced && !paused && !hovered && !focused;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    const sync = () => {
      setReduced(media.matches);
      if (media.matches) setActive(0);
      setAvailable(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    media.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) {
      previousPositions.current = [];
      return;
    }
    const words = Array.from(el.querySelectorAll<HTMLElement>('.ec-ai-row'));
    const letters = Array.from(el.querySelectorAll('.ec-ai-letter'));
    const typingStarts = 450;
    const typingEnds = typingStarts + letters.length * 90;
    const erasingStarts = typingEnds + 2300;
    const duration = erasingStarts + letters.length * 45 + 200;

    const typing = letters.map((letter, index) => {
      const typedAt = typingStarts + (index + 1) * 90;
      const erasedAt = erasingStarts + (letters.length - index) * 45;
      const animation = letter.animate(
        [
          { opacity: 0, offset: 0, easing: 'steps(1, end)' },
          { opacity: 1, offset: typedAt / duration, easing: 'steps(1, end)' },
          { opacity: 0, offset: erasedAt / duration },
          { opacity: 0, offset: 1 },
        ],
        { duration, fill: 'both' },
      );
      animation.pause();
      return animation;
    });
    // 换词时只剩首字母，平滑移到新词组的位置再开始打字
    const movement = words.flatMap((word, index) => {
      const previous = previousPositions.current[index];
      if (previous === undefined) return [];
      const distance = previous - word.getBoundingClientRect().left;
      const animation = word.animate(
        [
          { transform: `translateX(${distance}px)` },
          { transform: 'translateX(0)' },
        ],
        { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      );
      animation.pause();
      return [animation];
    });
    animations.current = [...typing, ...movement];
    typing[0].onfinish = () => {
      previousPositions.current = words.map(
        (word) => word.getBoundingClientRect().left,
      );
      setActive((current) => (current + 1) % phrases.length);
    };
    return () => {
      typing[0].onfinish = null;
      animations.current.forEach((animation) => animation.cancel());
      animations.current = [];
    };
  }, [active, reduced]);

  useLayoutEffect(() => {
    animations.current.forEach((animation) => {
      if (playing && animation.playState === 'paused') animation.play();
      if (!playing && animation.playState === 'running') animation.pause();
    });
  }, [playing, active, reduced]);

  return (
    <div
      className="ec-ai-headline"
      ref={root}
      data-paused={paused}
      data-animated={!reduced}
    >
      <button
        className="ec-ai-words"
        type="button"
        aria-label={paused ? '播放标题动画' : '暂停标题动画'}
        aria-pressed={paused}
        onClick={() => setPaused((current) => !current)}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onFocus={(event) =>
          setFocused(event.currentTarget.matches(':focus-visible'))
        }
        onBlur={() => setFocused(false)}
      >
        {['A', 'I'].map((initial, row) => (
          <span
            className="ec-ai-row"
            key={initial}
            aria-hidden="true"
            lang="en"
          >
            <span>{initial}</span>
            <span>
              {Array.from(phrases[active][row]).map((letter, index) => (
                <span className="ec-ai-letter" key={index}>
                  {letter}
                </span>
              ))}
            </span>
          </span>
        ))}
      </button>
    </div>
  );
}

/** 首屏底部的打字机大字标，最后一个字母打完后出现置底光标。 */
export function TypedWordmark({ text }: { text: string }) {
  return (
    <div className="ec-wordmark" aria-hidden="true">
      <span
        className="ec-wordmark-text"
        style={{ '--caret': `${250 + text.length * 170 + 60}ms` } as Vars}
      >
        {Array.from(text).map((letter, index) => (
          <span
            className="ec-wordmark-letter"
            key={index}
            style={{ animationDelay: `${250 + index * 170}ms` }}
          >
            {letter === ' ' ? ' ' : letter}
          </span>
        ))}
      </span>
    </div>
  );
}

export function Header({
  items,
  action,
}: {
  items: { label: string; href: string }[];
  action: { label: string; href: string; external?: boolean };
}) {
  return (
    <header className="ec-header">
      <Link className="ec-brand" href={HOME} aria-label="Molis AI 首页">
        Molis AI
      </Link>
      <nav className="ec-nav" aria-label="主导航">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      {action.external ? (
        <a
          className="ec-header-action"
          href={action.href}
          target="_blank"
          rel="noreferrer"
        >
          {action.label}
        </a>
      ) : (
        <Link className="ec-header-action" href={action.href}>
          {action.label}
        </Link>
      )}
    </header>
  );
}

export function Footer({ children }: { children?: ReactNode }) {
  return (
    <footer className="ec-footer">
      {children}
      <div className="ec-footer-mark" aria-hidden="true">
        Molis AI
      </div>
      <div className="ec-footer-meta">
        <span className="ec-footer-brand">
          <img
            src="/images/molis-logo.png"
            width="28"
            height="28"
            alt=""
            loading="lazy"
          />
          Molis AI
        </span>
        <a href="https://github.com/molis-ai" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <span>© 2026</span>
      </div>
    </footer>
  );
}

/**
 * 页面级动效：鼠标微移首屏照片、元素进入视口时加 is-in、
 * 带 data-scroll 的区块写入 0–1 的滚动进度 --p。
 */
export function useEditionMotion() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const site = ref.current;
    if (!site) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const hero = site.querySelector<HTMLElement>('.ec-hero');
    const scenes = Array.from(
      site.querySelectorAll<HTMLElement>('[data-scroll]'),
    );

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const scene of scenes) {
        const box = scene.getBoundingClientRect();
        if (box.bottom < -vh * 0.5 || box.top > vh * 1.5) continue;
        // enter：顶部从视口底部走到视口 25% 处；pass：整段穿过视口
        const progress =
          scene.dataset.scroll === 'pass'
            ? (vh - box.top) / (vh + box.height)
            : (vh - box.top) / (vh * 0.75);
        scene.style.setProperty(
          '--p',
          Math.min(1, Math.max(0, progress)).toFixed(4),
        );
      }
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const revealer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          revealer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    site
      .querySelectorAll('.ec-reveal')
      .forEach((node) => revealer.observe(node));

    const pan = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || media.matches || !hero) return;
      const box = hero.getBoundingClientRect();
      hero.style.setProperty(
        '--pan',
        `${((event.clientX - box.left) / box.width - 0.5) * 8}px`,
      );
    };
    const reset = () => hero?.style.setProperty('--pan', '0px');

    site.classList.add('is-ready');
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    hero?.addEventListener('pointermove', pan);
    hero?.addEventListener('pointerleave', reset);
    return () => {
      cancelAnimationFrame(frame);
      revealer.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      hero?.removeEventListener('pointermove', pan);
      hero?.removeEventListener('pointerleave', reset);
    };
  }, []);
  return ref;
}
