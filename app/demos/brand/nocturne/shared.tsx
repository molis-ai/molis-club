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
  signature,
  workLine,
  type LineId,
} from '../../../../content/studio';

// 夜曲各页共用：路由、顶栏（含「产品」菜单）、页尾地平线、滚动分幕动效。

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const HOME = '/demos/brand/nocturne';
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

/** 「产品」下拉：四条产品线各一句话，当前页亮一盏灯 */
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
    <div className="nc-menu" ref={root} data-open={open}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="nc-products-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {navLabels.products}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div className="nc-menu-panel" id="nc-products-menu" hidden={!open}>
        {lineIds.map((id, index) => (
          <Link
            key={id}
            href={lineHref[id]}
            aria-current={current === id ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <strong>{lineNames[id]}</strong>
            <small>{lineLine[id]}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 浮在画面上的两枚胶囊：左边品牌，右边栏目 */
export function SiteHeader({ current }: { current?: LineId }) {
  return (
    <header className="nc-header">
      <Link href={HOME} className="nc-logo" aria-label="Molis AI 首页">
        <img src="/images/molis-logo.png" width="36" height="36" alt="" />
        <span>Molis AI</span>
      </Link>
      <nav className="nc-nav" aria-label="主导航">
        <ProductsMenu current={current} />
        <Link href={`${HOME}#solutions`}>{navLabels.solutions}</Link>
        <Link href={COMMUNITY}>{navLabels.community}</Link>
        <Link href={`${HOME}#about`}>{navLabels.about}</Link>
        <Link href={CONTACT} className="nc-nav-cta">
          {navLabels.contact}
        </Link>
      </nav>
    </header>
  );
}

/** 页尾：地平线随滚动升起；产品页把结尾放在 children 里 */
export function Footer({ children }: { children?: ReactNode }) {
  return (
    <footer className="nc-footer" data-scene="view">
      {children}
      <div className="nc-colophon">
        <div className="nc-horizon" aria-hidden="true" />
        <div className="nc-colophon-lead">
          <span className="nc-colophon-brand">
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
        <nav className="nc-colophon-links" aria-label="页尾导航">
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
        <div className="nc-colophon-base">
          <span>{footer.copyright}</span>
          <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
        </div>
      </div>
    </footer>
  );
}

/**
 * 分幕动效：data-reveal 进入视口时显影；data-scene 写入 0–1 的进度 --p
 * （exit：首屏离场；pin：吸顶长幕；enter：从视口底部升起；view：整段穿过视口）；
 * 带 data-steps 的长幕按进度切换 data-active；data-rail 里的章节决定侧栏高亮。
 */
export function useNocturneMotion() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.classList.add('is-ready');
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
        const mode = scene.dataset.scene;
        let p: number;
        if (mode === 'pin') p = -rect.top / Math.max(1, rect.height - vh);
        else if (mode === 'exit') p = -rect.top / Math.max(1, rect.height);
        else if (mode === 'enter') p = (vh - rect.top) / Math.max(1, vh * 0.9);
        else p = (vh - rect.top) / (vh + rect.height);
        p = Math.min(1, Math.max(0, p));
        scene.style.setProperty('--p', p.toFixed(4));
        const steps = Number(scene.dataset.steps);
        if (steps) {
          const active = String(Math.min(steps - 1, Math.floor(p * steps)));
          if (scene.dataset.active !== active) scene.dataset.active = active;
        }
      }
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          reveal.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    );
    root
      .querySelectorAll('[data-reveal]')
      .forEach((element) => reveal.observe(element));

    // 章节进入视口中线时，侧栏跟着亮
    const chapters = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const chapter = entry.target as HTMLElement;
          const rail = chapter.closest<HTMLElement>('[data-rail]');
          if (rail) rail.dataset.active = chapter.dataset.chapter ?? '0';
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    root
      .querySelectorAll('[data-chapter]')
      .forEach((element) => chapters.observe(element));

    // 键盘移到长幕里还没亮起的一幕时，把页面滚到那一幕
    const follow = (event: FocusEvent) => {
      const step = (event.target as HTMLElement).closest<HTMLElement>(
        '[data-step]',
      );
      const scene = step?.closest<HTMLElement>('[data-steps]');
      if (!step || !scene) return;
      const span = scene.offsetHeight - window.innerHeight;
      if (span <= 0) return;
      const steps = Number(scene.dataset.steps);
      const index = Number(step.dataset.step);
      const top = scene.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (span * (index + 0.5)) / steps });
    };

    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    root.addEventListener('focusin', follow);
    return () => {
      cancelAnimationFrame(raf);
      reveal.disconnect();
      chapters.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      root.removeEventListener('focusin', follow);
    };
  }, []);
  return ref;
}
