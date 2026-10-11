'use client';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  footer,
  lineNames,
  navLabels,
  signature,
  type LineId,
} from '../../../../content/studio';
import { folioHomeCopy, folioStudio } from '../../../../content/folio';
import { folioCommunity } from '../../../../content/folio-community';
import { authClient } from '../../../../lib/auth-client';

// Folio 各页共用：路由、顶栏（含「产品」菜单）、页尾封底和页面动效。文案来自 content/studio.ts 与 content/folio.ts。

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const HOME = '/demos/brand/folio';
export const WORK = `${HOME}/work`;
export const LIFE = `${HOME}/life`;
export const TOOL = `${HOME}/tool`;
export const STORY = `${HOME}/story`;
export const CONTACT = `${HOME}/contact`;
export const SOLUTIONS = `${HOME}/solutions`;
export const COMMUNITY = '/demos/community';
export const ESSAYS = `${HOME}/essays`;
export const ABOUT = `${HOME}/about`;
export const LOGIN = `${HOME}/login`;
export const ACCOUNT = `${HOME}/account`;
export const essayHref = (slug: string) => `${HOME}/essays/${slug}`;
/** 方法（原百科）并进社区：列表是社区页的「方法」段，详情是社区下的子页 */
export const METHODS = `${COMMUNITY}#methods`;
export const methodHref = (slug: string) => `${COMMUNITY}/methods/${slug}`;
export const artistHref = (slug: string) =>
  `${COMMUNITY}/methods/artists/${slug}`;

/** 产品的顺序：首页、顶栏下拉、页尾和产品页「接着看」都按这一个顺序 */
export const lineIds: LineId[] = ['work', 'tool', 'life', 'story'];

export const lineHref: Record<LineId, string> = {
  work: WORK,
  life: LIFE,
  tool: TOOL,
  story: STORY,
};

/** 每条产品线一张色纸：Work 红、Life 黄、Tool 粉、Story 蓝 */
export const lineTone: Record<LineId, string> = {
  work: 'red',
  life: 'yellow',
  tool: 'pink',
  story: 'blue',
};

/** 每件产品的一句话：顶栏下拉和「接着看」直接读首页那一份（content/folio.ts 的 folioHomeCopy） */
export const lineLine: Record<LineId, string> = folioHomeCopy.products;

/** 联系页；topic 预选「企业合作」或预填关注哪条产品线 */
export const contactHref = (topic?: string) =>
  topic ? `${CONTACT}?topic=${topic}` : CONTACT;

/** 「产品」下拉：四条产品线各一句话，当前页高亮；Esc 和点外面都能收起 */
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
    const leave = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (next && !root.current?.contains(next)) setOpen(false);
    };
    const node = root.current;
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    node?.addEventListener('focusout', leave);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
      node?.removeEventListener('focusout', leave);
    };
  }, [open]);
  return (
    <div className="fo-menu" ref={root} data-open={open}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="fo-products-menu"
        data-current={Boolean(current)}
        onClick={() => setOpen((value) => !value)}
      >
        {navLabels.products}
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      <div className="fo-menu-panel" id="fo-products-menu" hidden={!open}>
        {lineIds.map((id, index) => (
          <Link
            key={id}
            href={lineHref[id]}
            data-tone={lineTone[id]}
            aria-current={current === id ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            <i aria-hidden="true">{String(index + 1).padStart(2, '0')}</i>
            <strong>{lineNames[id]}</strong>
            <small>{lineLine[id]}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 顶栏右边：没登录时是「登录」，登录后是「我的账号」，都留在 Folio 里 */
function AccountLink({ current }: { current: boolean }) {
  const { data } = authClient.useSession();
  return (
    <Link
      href={data ? ACCOUNT : LOGIN}
      className="fo-nav-login"
      aria-current={current ? 'page' : undefined}
    >
      {data ? folioStudio.nav.account : folioStudio.nav.login}
    </Link>
  );
}

/** 所有 Folio 页面共用的顶栏：产品 · 解决方案 · 文章 · 社区 · 关于，右边登录和聊一聊 */
export function SiteHeader({
  current,
}: {
  current?: LineId | 'solutions' | 'essays' | 'about' | 'account';
}) {
  const product = lineIds.find((id) => id === current);
  return (
    <header className="fo-header">
      <Link href={HOME} className="fo-logo" aria-label="Molis AI 首页">
        <img src="/images/molis-logo.png" width="36" height="36" alt="" />
        <span>Molis AI</span>
      </Link>
      <nav className="fo-nav" aria-label="主导航">
        <ProductsMenu current={product} />
        <Link
          href={SOLUTIONS}
          aria-current={current === 'solutions' ? 'page' : undefined}
        >
          {navLabels.solutions}
        </Link>
        <Link
          href={ESSAYS}
          aria-current={current === 'essays' ? 'page' : undefined}
        >
          {folioStudio.nav.essays}
        </Link>
        <Link href={COMMUNITY}>{navLabels.community}</Link>
        <Link
          href={ABOUT}
          aria-current={current === 'about' ? 'page' : undefined}
        >
          {folioStudio.labels.team.zh}
        </Link>
      </nav>
      <div className="fo-header-end">
        <AccountLink current={current === 'account'} />
        <Link href={CONTACT} className="fo-nav-cta">
          {navLabels.contact}
        </Link>
      </div>
    </header>
  );
}

/** 封底：上面放各页自己的结尾，下面是刊头大字、落款和栏目 */
export function Footer({
  children,
  tone = 'red',
  compact = false,
}: {
  children?: ReactNode;
  tone?: 'red' | 'yellow' | 'blue' | 'paper';
  /** 正文很短的页面（登录、账号、404）不放刊头大字，免得页尾比正文还高 */
  compact?: boolean;
}) {
  return (
    <footer className="fo-back" data-tone={tone} data-compact={compact}>
      {children}
      <div className="fo-colophon">
        <span className="fo-colophon-mark" aria-hidden="true">
          Molis
        </span>
        <div className="fo-colophon-grid">
          <div className="fo-colophon-lead">
            <span className="fo-colophon-brand">
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
          <nav className="fo-colophon-links" aria-label="页尾导航">
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
                  <Link href={SOLUTIONS}>{footer.studio.solutions}</Link>
                </li>
                <li>
                  <Link href={ESSAYS}>{folioStudio.nav.essays}</Link>
                </li>
                <li>
                  <Link href={METHODS}>{folioCommunity.nav.footerMethods}</Link>
                </li>
                <li>
                  <Link href={COMMUNITY}>{footer.studio.community}</Link>
                </li>
                <li>
                  <Link href={ABOUT}>{folioStudio.labels.team.zh}</Link>
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
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="fo-colophon-base">
          <span>{footer.copyright}</span>
          <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
        </div>
      </div>
    </footer>
  );
}

/**
 * 页面动效：加 is-ready 触发首屏剪纸入场；带 data-scene 的区块写入 0–1 的滚动进度 --p；
 * 叠起来的整页色纸写入被盖住的程度 --c；带 data-reveal 的元素进入视口时加 is-in；
 * 首屏随鼠标微移（--mx、--my）。
 */
export function useFolioMotion() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const ready = requestAnimationFrame(() => root.classList.add('is-ready'));

    const scenes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-scene]'),
    );
    const sheets = Array.from(root.querySelectorAll<HTMLElement>('.fo-sheet'));

    // 内容高过一屏的色纸不再粘住，免得下半截被下一张盖住
    const fit = () => {
      const vh = window.innerHeight;
      for (const sheet of sheets) {
        const inner = sheet.firstElementChild as HTMLElement | null;
        if (!inner) continue;
        const style = getComputedStyle(inner);
        let need = 0;
        for (const child of Array.from(inner.children)) {
          need = Math.max(need, (child as HTMLElement).offsetHeight);
        }
        need += parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        sheet.classList.toggle('is-loose', need > vh);
      }
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 2) continue;
        // leave：离开首屏的程度；pass：整段穿过视口；enter：顶部从视口底部走到顶部；
        // pin：高于一屏的区块里，粘住的画面从开始到结束的进度
        const mode = scene.dataset.scene;
        // 减少动态时直接停在拼好的样子
        const p = reduce.matches
          ? mode === 'leave'
            ? 0
            : 1
          : mode === 'leave'
            ? -rect.top / vh
            : mode === 'pass'
              ? (vh - rect.top) / (vh + rect.height)
              : mode === 'pin'
                ? -rect.top / Math.max(1, rect.height - vh)
                : (vh - rect.top) / vh;
        scene.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
      }
      sheets.forEach((sheet, index) => {
        const next = sheets[index + 1];
        if (!next) return;
        const top = next.getBoundingClientRect().top;
        const covered = reduce.matches
          ? 0
          : Math.min(1, Math.max(0, 1 - top / vh));
        sheet.style.setProperty('--c', covered.toFixed(4));
      });
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = () => {
      fit();
      request();
    };
    fit();
    update();
    void document.fonts?.ready.then(resize);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', resize);

    const cover = root.querySelector<HTMLElement>('[data-parallax]');
    const pan = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || reduce.matches || !cover) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      cover.style.setProperty('--mx', (x * 14).toFixed(2));
      cover.style.setProperty('--my', (y * 10).toFixed(2));
    };
    cover?.addEventListener('pointermove', pan);

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          reveal.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );
    root
      .querySelectorAll('[data-reveal]')
      .forEach((item) => reveal.observe(item));

    return () => {
      cancelAnimationFrame(ready);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', resize);
      cover?.removeEventListener('pointermove', pan);
      reveal.disconnect();
    };
  }, []);
  return ref;
}
