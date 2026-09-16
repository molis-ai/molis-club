'use client';
import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  type ReactNode,
} from 'react';
import Link from '../edition-link';
const headlinePhrases = [
  ['mplify', 'deas'],
  ['waken', 'magination'],
  ['dvance', 'ntuition'],
  ['ugment', 'ntelligence'],
  ['ccelerate', 'nnovation'],
  ['rtistic', 'nspiration'],
  ['rtful', 'nteractions'],
  ['daptive', 'nterfaces'],
];
export function CWordCycle() {
  const heading = useRef<HTMLHeadingElement>(null);
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
    const el = heading.current;
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
    const el = heading.current;
    if (!el || reduced) {
      previousPositions.current = [];
      return;
    }
    const words = Array.from(el.querySelectorAll<HTMLElement>('.c-ai-row'));
    const letters = Array.from(el.querySelectorAll('.c-ai-letter'));
    const typingStarts = 450;
    const typingEnds = typingStarts + letters.length * 90;
    const erasingStarts = typingEnds + 2300;
    const duration = erasingStarts + letters.length * 45 + 200;

    // One timeline, in reading order: finish the A word before typing the I word.
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
    // Only the initials are visible while the next phrase settles into place.
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
      setActive((current) => (current + 1) % headlinePhrases.length);
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
    <h1
      className="c-ai-headline"
      ref={heading}
      data-paused={paused}
      data-animated={!reduced}
      aria-label="Amplify Ideas — Molis AI 创作工作室"
    >
      <button
        className="c-ai-words"
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
          <span className="c-ai-row" key={initial} aria-hidden="true" lang="en">
            <span className="c-ai-initial">{initial}</span>
            <span className="c-ai-tail">
              {Array.from(headlinePhrases[active][row]).map((letter, index) => (
                <span className="c-ai-letter" key={index}>
                  {letter}
                </span>
              ))}
            </span>
          </span>
        ))}
      </button>
    </h1>
  );
}
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
