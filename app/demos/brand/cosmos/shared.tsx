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
import Planet from './planet';

// 深空版所有页面共用：路由、顶栏（带「产品」菜单）、页尾的地平线、进入视口的动效。

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const HOME = '/demos/brand/cosmos';
export const WORK = `${HOME}/work`;
const LIFE = `${HOME}/life`;
const TOOL = `${HOME}/tool`;
const STORY = `${HOME}/story`;
const CONTACT = `${HOME}/contact`;
export const COMMUNITY = '/demos/community';

const lineIds: LineId[] = ['work', 'life', 'tool', 'story'];
export const lineHref: Record<LineId, string> = {
  work: WORK,
  life: LIFE,
  tool: TOOL,
  story: STORY,
};
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

/** 「产品」下拉：四条产品线各是一颗星球，配一句话 */
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
    <div className="cs-menu" ref={root} data-open={open}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="cs-products-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {navLabels.products}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div className="cs-menu-panel" id="cs-products-menu" hidden={!open}>
        {lineIds.map((id, index) => (
          <Link
            key={id}
            href={lineHref[id]}
            aria-current={current === id ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            <Planet kind={id} className="cs-menu-planet" />
            <span>
              <strong>{lineNames[id]}</strong>
              <small>{lineLine[id]}</small>
            </span>
            <em aria-hidden="true">0{index + 1}</em>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 顶栏：标志 · 产品 · 解决方案 · 社区 · 关于 · 聊一聊 */
export function SiteHeader({ current }: { current?: LineId }) {
  return (
    <header className="cs-header">
      <Link href={HOME} className="cs-logo" aria-label="Molis AI 首页">
        <img src="/images/molis-logo.png" width="40" height="40" alt="" />
        <span>Molis AI</span>
      </Link>
      <nav className="cs-pill" aria-label="主导航">
        <ProductsMenu current={current} />
        <Link href={`${HOME}#solutions`}>{navLabels.solutions}</Link>
        <Link href={COMMUNITY}>{navLabels.community}</Link>
        <Link href={`${HOME}#about`}>{navLabels.about}</Link>
      </nav>
      <Link href={CONTACT} className="cs-header-cta">
        {navLabels.contact}
      </Link>
    </header>
  );
}

/** 页尾：结尾内容在上，下面是黎明从行星边缘升起，落款和栏目落在行星上 */
export function Footer({ children }: { children?: ReactNode }) {
  return (
    <footer className="cs-footer cs-starfield">
      {children ? <div className="cs-footer-top">{children}</div> : null}
      <div className="cs-footer-meta" data-reveal>
        <p className="cs-footer-signature">{signature}</p>
        <div className="cs-footer-ground">
          <div className="cs-horizon" aria-hidden="true">
            <span className="cs-horizon-dawn" />
            <Planet kind="horizon" className="cs-horizon-planet" />
          </div>
          <div className="cs-footer-grid">
            <Link href={HOME} className="cs-footer-brand">
              <img
                src="/images/molis-logo.png"
                width="32"
                height="32"
                alt=""
                loading="lazy"
              />
              Molis AI
            </Link>
            <nav className="cs-footer-links" aria-label="页尾导航">
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
          </div>
          <div className="cs-footer-base">
            <span>{footer.copyright}</span>
            <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * 页面级动效：带 cs-reveal 或 data-reveal 的元素进入视口时加 is-in（只一次），
 * 带 data-scroll 的元素写入 0–1 的进场进度 --p。
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const site = ref.current;
    if (!site) return;
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
        // 顶部从视口底部走到视口 25% 处
        const progress = (vh - box.top) / (vh * 0.75);
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
      .querySelectorAll('.cs-reveal, [data-reveal]')
      .forEach((node) => revealer.observe(node));
    site.classList.add('is-ready');
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      cancelAnimationFrame(frame);
      revealer.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);
  return ref;
}
