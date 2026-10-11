'use client';
import Link from 'next/link';
import { ChevronDown, Pause, Play } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { lineNames, navLabels } from '../../../../content/studio';
import { folioStudio } from '../../../../content/folio';
import { authClient } from '../../../../lib/auth-client';
import {
  ABOUT,
  ACCOUNT,
  COMMUNITY,
  CONTACT,
  ESSAYS,
  LOGIN,
  SOLUTIONS,
  lineHref,
  lineIds,
  lineLine,
} from '../folio/shared';
import './base.css';

// 第三轮 A / D / E 三个首页共用：顶栏（含产品菜单）、滚动驱动、逐字显影和演示外壳。
// 内容、链接与 Folio 首页同一份；视觉由各方向自己的样式表按类名前缀决定。

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export type NavKey = 'products' | 'solutions' | 'essays' | 'community' | 'team';

/** 产品下拉：四条产品线各一句话；Esc、点外面、焦点离开都会收起 */
function ProductsMenu({
  p,
  icon,
}: {
  p: string;
  icon?: (key: NavKey) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const node = root.current;
    const outside = (event: PointerEvent) => {
      if (!node?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      node?.querySelector('button')?.focus();
    };
    const leave = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (next && !node?.contains(next)) setOpen(false);
    };
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
    <div className={`${p}-menu`} ref={root} data-open={open}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${p}-products-menu`}
        onClick={() => setOpen((value) => !value)}
      >
        {icon?.('products')}
        <span>{navLabels.products}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div
        className={`${p}-menu-panel`}
        id={`${p}-products-menu`}
        hidden={!open}
      >
        {lineIds.map((id, index) => (
          <Link key={id} href={lineHref[id]} onClick={() => setOpen(false)}>
            <i aria-hidden="true">{String(index + 1).padStart(2, '0')}</i>
            <strong>{lineNames[id]}</strong>
            <small>{lineLine[id]}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 没登录时是「登录」，登录后是「我的账号」 */
function AccountLink({ className }: { className: string }) {
  const { data } = authClient.useSession();
  return (
    <Link href={data ? ACCOUNT : LOGIN} className={className}>
      {data ? folioStudio.nav.account : folioStudio.nav.login}
    </Link>
  );
}

/** 顶栏：产品 · 解决方案 · 文章 · 社区 · 团队，右边登录和聊一聊。和 Folio 同一组去处。 */
export function Header({
  p,
  home,
  icon,
}: {
  p: string;
  home: string;
  icon?: (key: NavKey) => ReactNode;
}) {
  const links: { key: NavKey; href: string; label: string }[] = [
    { key: 'solutions', href: SOLUTIONS, label: navLabels.solutions },
    { key: 'essays', href: ESSAYS, label: folioStudio.nav.essays },
    { key: 'community', href: COMMUNITY, label: navLabels.community },
    { key: 'team', href: ABOUT, label: folioStudio.labels.team.zh },
  ];
  return (
    <header className={`${p}-header`}>
      <Link href={home} className={`${p}-logo`} aria-label="Molis AI 首页">
        <img src="/images/molis-logo.png" width="34" height="34" alt="" />
        <span>Molis AI</span>
      </Link>
      <nav className={`${p}-nav`} aria-label="主导航">
        <ProductsMenu p={p} icon={icon} />
        {links.map((link) => (
          <Link key={link.key} href={link.href}>
            {icon?.(link.key)}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className={`${p}-header-end`}>
        <AccountLink className={`${p}-login`} />
        <Link href={CONTACT} className={`${p}-cta`}>
          {navLabels.contact}
        </Link>
      </div>
    </header>
  );
}

/**
 * 页面动效，全部写进 CSS 变量，由样式决定怎么用：
 * - 根节点：--page 整页滚动进度，--y 已滚动的像素；页头离开顶部时加 is-scrolled。
 * - [data-scene]：--p，模式 pin（高于一屏的粘性舞台）/ pass（整段穿过视口）/ enter（顶边从底部走到顶部）/ leave（离开首屏）。
 *   带 data-steps="n" 时同时写入 data-step（0…n-1），粘性舞台按它切换画面。
 * - [data-reveal]：进入视口加 is-in。
 * - [data-parallax]：鼠标微移写入 --mx、--my（−0.5…0.5）。
 * 减少动态时：pin / pass / enter 直接为 1，leave 为 0，样式表再取消粘性编排。
 */
export function useStage() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const ready = requestAnimationFrame(() => root.classList.add('is-ready'));
    const scenes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-scene]'),
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      root.style.setProperty('--page', (window.scrollY / max).toFixed(4));
      root.style.setProperty('--y', String(Math.round(window.scrollY)));
      root.classList.toggle('is-scrolled', window.scrollY > 12);
      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        if (rect.bottom < -vh * 0.5 || rect.top > vh * 1.5) continue;
        const mode = scene.dataset.scene;
        let p: number;
        if (reduce.matches) p = mode === 'leave' ? 0 : 1;
        else if (mode === 'leave') p = -rect.top / vh;
        else if (mode === 'pass') p = (vh - rect.top) / (vh + rect.height);
        else if (mode === 'pin') p = -rect.top / Math.max(1, rect.height - vh);
        else p = (vh - rect.top) / vh;
        p = Math.min(1, Math.max(0, p));
        scene.style.setProperty('--p', p.toFixed(4));
        const steps = Number(scene.dataset.steps);
        if (steps > 1) {
          const step = String(Math.min(steps - 1, Math.floor(p * steps)));
          if (scene.dataset.step !== step) scene.dataset.step = step;
        }
      }
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    void document.fonts?.ready.then(request);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    reduce.addEventListener('change', request);

    const panes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-parallax]'),
    );
    const pan = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || reduce.matches) return;
      const x = (event.clientX / window.innerWidth - 0.5).toFixed(3);
      const y = (event.clientY / window.innerHeight - 0.5).toFixed(3);
      for (const pane of panes) {
        pane.style.setProperty('--mx', x);
        pane.style.setProperty('--my', y);
      }
    };
    window.addEventListener('pointermove', pan, { passive: true });

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
      .forEach((item) => reveal.observe(item));

    return () => {
      cancelAnimationFrame(ready);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      window.removeEventListener('pointermove', pan);
      reduce.removeEventListener('change', request);
      reveal.disconnect();
    };
  }, []);
  return ref;
}

/**
 * 按视口中线决定当前是第几项：容器上写 data-step（0…n-1），样式据此切换画面。
 * 比用整段滚动进度平均切分更准，文字走到中线时画面才换。
 */
export function useStepper<T extends HTMLElement>(selector: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          root.dataset.step = String(
            items.indexOf(entry.target as HTMLElement),
          );
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [selector]);
  return ref;
}

/**
 * 逐字显影：每个字一个 span，带 --i；样式用所在 [data-scene] 的 --p 和 --n 算出每个字的浓淡。
 * marks 里的词组整体包一层，方便单独换字体或颜色。读屏读整段原文。
 */
export function InkText({
  text,
  marks = [],
  className,
}: {
  text: string;
  marks?: string[];
  className?: string;
}) {
  const pieces: { text: string; mark: boolean }[] = [];
  let rest = text;
  while (rest) {
    let at = -1;
    let hit = '';
    for (const mark of marks) {
      const index = rest.indexOf(mark);
      if (index !== -1 && (at === -1 || index < at)) {
        at = index;
        hit = mark;
      }
    }
    if (at === -1) {
      pieces.push({ text: rest, mark: false });
      break;
    }
    if (at > 0) pieces.push({ text: rest.slice(0, at), mark: false });
    pieces.push({ text: hit, mark: true });
    rest = rest.slice(at + hit.length);
  }
  let index = 0;
  const total = Array.from(text).length;
  return (
    <p className={className} style={{ '--n': total } as Vars}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {pieces.map((piece, pieceIndex) => {
          const chars = Array.from(piece.text).map((char) => (
            <span className="ch" key={index} style={{ '--i': index++ } as Vars}>
              {char}
            </span>
          ));
          return piece.mark ? (
            <em key={pieceIndex}>{chars}</em>
          ) : (
            <span key={pieceIndex}>{chars}</span>
          );
        })}
      </span>
    </p>
  );
}

/**
 * 演示外壳：进入视口、页面在前台、没被暂停、并且 active 时才播放（data-running）。
 * 演示的基础样式就是播完的样子，减少动态时停在结果上。
 */
export function Demo({
  p,
  label,
  note,
  active = true,
  className = '',
  children,
}: {
  p: string;
  label: string;
  note?: string;
  active?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    const sync = () => setHidden(document.hidden);
    observer.observe(node);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);
  const running = active && inView && !hidden && !paused;
  return (
    <figure
      ref={ref}
      className={`${p}-demo ${className}`}
      data-running={running}
      aria-label={label}
    >
      {children}
      {note ? (
        <figcaption className={`${p}-demo-note`}>{note}</figcaption>
      ) : null}
      <button
        type="button"
        className={`${p}-demo-toggle`}
        aria-pressed={paused}
        aria-label={paused ? '继续播放演示' : '暂停演示'}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? (
          <Play size={12} fill="currentColor" aria-hidden="true" />
        ) : (
          <Pause size={12} fill="currentColor" aria-hidden="true" />
        )}
      </button>
    </figure>
  );
}

/** 页尾栏目：和 Folio 页尾同一组 */
export {
  footer,
  signature,
  ending,
  lineNames,
} from '../../../../content/studio';
export {
  ABOUT,
  COMMUNITY,
  CONTACT,
  ESSAYS,
  LOGIN,
  SOLUTIONS,
  WIKI,
  WORK,
  contactHref,
  lineHref,
  lineIds,
} from '../folio/shared';
