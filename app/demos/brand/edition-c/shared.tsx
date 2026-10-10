'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
import { AiWordCycle } from '../ai-words';

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

// A/I 词组与 Folio 共用，见 ../ai-words.tsx。
export function WordCycle() {
  return <AiWordCycle prefix="ec" />;
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

const branches = [
  { x: -40, y: 60, dx: 540, dy: 170, leaves: 10, seed: 3 },
  { x: 40, y: -20, dx: 330, dy: 340, leaves: 8, seed: 11 },
  { x: 220, y: 120, dx: 420, dy: -40, leaves: 7, seed: 23 },
];

function random(seed: number) {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
}

/** 窗外枝叶投下的影子，三根枝条各自慢慢摇 */
export function LightLeaves({ className }: { className: string }) {
  return (
    <svg
      className={`ec-leaves ${className}`}
      viewBox="0 0 640 460"
      preserveAspectRatio="xMinYMin slice"
      aria-hidden="true"
    >
      {branches.map((branch, b) => (
        <g className={`ec-branch ec-branch-${b}`} key={b}>
          <path
            d={`M${branch.x} ${branch.y} q ${branch.dx * 0.5} ${branch.dy * 0.2} ${branch.dx} ${branch.dy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {Array.from({ length: branch.leaves }, (_, i) => {
            const t = (i + 1) / (branch.leaves + 1);
            const r = random(branch.seed + i);
            const x = branch.x + branch.dx * t;
            const y = branch.y + branch.dy * (0.4 * t * (1 - t) + t * t);
            const side = i % 2 === 0 ? 1 : -1;
            const angle =
              (Math.atan2(branch.dy, branch.dx) * 180) / Math.PI +
              side * (38 + r * 30);
            const length = 22 + r * 18;
            return (
              <ellipse
                key={i}
                cx={x + side * 6}
                cy={y + side * 10}
                rx={length}
                ry={length * 0.34}
                transform={`rotate(${angle} ${x} ${y})`}
                fill="currentColor"
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/** 照片首屏上的一层光：暖色日光慢慢呼吸，树影在墙上轻轻摇 */
export function HeroLight() {
  return (
    <div className="ec-light" aria-hidden="true">
      <span className="ec-light-sun" />
      <LightLeaves className="ec-light-leaves" />
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
      <div className="ec-footer-panel">
        <div className="ec-footer-mark ec-reveal" aria-hidden="true">
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
      </div>
    </footer>
  );
}

/**
 * 页面级动效：鼠标微移首屏照片、元素进入视口时加 is-in、
 * 带 data-scroll 的区块写入 0–1 的滚动进度 --p；
 * 顶栏离开首屏后变成磨砂纸面，往下读时收起，往回滚时出现。
 */
export function useEditionMotion() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const site = ref.current;
    if (!site) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const hero = site.querySelector<HTMLElement>('.ec-hero');
    const header = site.querySelector<HTMLElement>('.ec-header');
    const scenes = Array.from(
      site.querySelectorAll<HTMLElement>('[data-scroll]'),
    );

    let frame = 0;
    let lastY = window.scrollY;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      if (header) {
        const menuOpen = header.querySelector('[data-open="true"]');
        header.dataset.scrolled = String(y > 24);
        if (y < 160 || y < lastY - 6 || menuOpen)
          header.dataset.hidden = 'false';
        else if (y > lastY + 6) header.dataset.hidden = 'true';
        if (Math.abs(y - lastY) > 6) lastY = y;
      }
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
      .querySelectorAll('.ec-reveal, .ec-media')
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
