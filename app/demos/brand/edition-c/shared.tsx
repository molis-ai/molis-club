'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  footer,
  lineNames,
  lines,
  navLabels,
  workLine,
  signature,
  type LineId,
} from '../../../../content/studio';

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const HOME = '/demos/brand/edition-c';
export const WORK = `${HOME}/work`;
export const LIFE = `${HOME}/life`;
export const TOOL = `${HOME}/tool`;
export const STORY = `${HOME}/story`;
export const CONTACT = `${HOME}/contact`;
export const COMMUNITY = '/demos/community';

export const lineHref: Record<LineId, string> = {
  work: WORK,
  life: LIFE,
  tool: TOOL,
  story: STORY,
};
const lineIds: LineId[] = ['work', 'life', 'tool', 'story'];
const lineLine: Record<LineId, string> = {
  work: workLine,
  ...(Object.fromEntries(lines.map((line) => [line.id, line.line])) as Record<
    Exclude<LineId, 'work'>,
    string
  >),
};

/** 联系页；topic 预选「企业合作」或预填关注哪条产品线 */
export const contactHref = (topic?: string) =>
  topic ? `${CONTACT}?topic=${topic}` : CONTACT;

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

/** 「产品」下拉：四条产品线各一句话，当前页高亮 */
function ProductsMenu({ current }: { current?: LineId }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      root.current?.querySelector('button')?.focus();
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  return (
    <div className="ec-menu" ref={root} data-open={open}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="ec-products-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {navLabels.products}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div className="ec-menu-panel" id="ec-products-menu" hidden={!open}>
        {lineIds.map((id) => (
          <Link
            key={id}
            href={lineHref[id]}
            aria-current={current === id ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            <strong>{lineNames[id]}</strong>
            <small>{lineLine[id]}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header({
  items,
  action,
  current,
  tone = 'photo',
}: {
  items: { label: string; href: string }[];
  action: { label: string; href: string; external?: boolean };
  /** 当前所在的产品线，菜单里高亮 */
  current?: LineId;
  /** photo：压在深色首屏上；paper：浅底页面 */
  tone?: 'photo' | 'paper';
}) {
  return (
    <header className="ec-header" data-tone={tone}>
      <Link className="ec-brand" href={HOME} aria-label="Molis AI 首页">
        Molis AI
      </Link>
      <nav className="ec-nav" aria-label="主导航">
        <ProductsMenu current={current} />
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

/** 所有 Edition C 页面共用的顶栏：产品 · 解决方案 · 社区 · 关于 · 聊一聊 */
export function SiteHeader({
  current,
  tone,
}: {
  current?: LineId;
  tone?: 'photo' | 'paper';
}) {
  return (
    <Header
      current={current}
      tone={tone}
      items={[
        { label: navLabels.solutions, href: `${HOME}#solutions` },
        { label: navLabels.community, href: COMMUNITY },
        { label: navLabels.about, href: `${HOME}#about` },
      ]}
      action={{ label: navLabels.contact, href: CONTACT }}
    />
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
        <div className="ec-footer-lead">
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
          <p>{signature}</p>
        </div>
        <nav className="ec-footer-links" aria-label="页尾导航">
          <div>
            <h2>{footer.productsLabel}</h2>
            <ul>
              {lineIds.map((id) => (
                <li key={id}>
                  <Link href={lineHref[id]}>{lineNames[id]}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{footer.studioLabel}</h2>
            <ul>
              <li>
                <Link href={`${HOME}#solutions`}>
                  {footer.studio.solutions}
                </Link>
              </li>
              <li>
                <Link href={COMMUNITY}>{footer.studio.community}</Link>
              </li>
              <li>
                <Link href={`${HOME}#about`}>{footer.studio.about}</Link>
              </li>
              <li>
                <Link href={CONTACT}>{footer.studio.contact}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>GitHub</h2>
            <ul>
              <li>
                <a href={footer.github} target="_blank" rel="noreferrer">
                  github.com/molis-ai
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="ec-footer-base">
          <span>{footer.copyright}</span>
          <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
        </div>
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
