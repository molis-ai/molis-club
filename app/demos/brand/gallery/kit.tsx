'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronDown, X } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { footer, navLabels, signature } from '../../../../content/studio';
import { folioStudio, type FolioProductId } from '../../../../content/folio';
import { folioCommunity } from '../../../../content/folio-community';
import { authClient } from '../../../../lib/auth-client';
import { useFontChoice } from '../font-choice';
import { useLeaves } from './leaves';
import {
  ABOUT,
  ACCOUNT,
  COMMUNITY,
  CONTACT,
  ESSAYS,
  HOME,
  LOGIN,
  METHODS,
  PRIVACY,
  SOLUTIONS,
  productHref,
  productIds,
  productLine,
  productName,
  productTag,
  roomNumber,
} from './routes';
import './gallery.css';

// 白盒子美术馆官网的公共部件。样式都在 gallery.css，类名前缀 g-；各页面自己的样式用 g-页面名- 前缀。
// - Shell：顶栏、main、页尾与字体切换，所有页面都从它开始；
// - useGalleryMotion：滚动进度 --p、进入视口 is-in、鼠标微移 --mx/--my；
// - Room：CSS 三维搭的白盒子展厅（天花、侧墙、木地板、正墙），children 挂在正墙上；
// - 展签、区块标题、状态签、按钮、画框、下一间展厅这些小部件。

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export type Current =
  | FolioProductId
  | 'solutions'
  | 'essays'
  | 'community'
  | 'about'
  | 'contact'
  | 'account';

/* ---------- 字体 ---------- */

export const fonts = [
  { id: 'figtree', label: 'Figtree', note: '柔和' },
  { id: 'nunito', label: 'Nunito', note: '圆角' },
  { id: 'outfit', label: 'Outfit', note: '几何' },
] as const;
export type FontId = (typeof fonts)[number]['id'];
function useFont() {
  return useFontChoice(fonts.map((item) => item.id));
}

/** 右下角的 Aa：样张阶段用来比较三种圆润字体，平时收成一个小圆钮 */
function FontDock({
  font,
  onFont,
}: {
  font: FontId;
  onFont: (font: FontId) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="g-fontdock" data-open={open}>
      {open ? (
        <fieldset className="g-fontdock-panel">
          <legend className="sr-only">切换字体</legend>
          {fonts.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={font === item.id}
              data-font-sample={item.id}
              onClick={() => onFont(item.id)}
            >
              <strong>{item.label}</strong>
              <small>{item.note}</small>
            </button>
          ))}
        </fieldset>
      ) : null}
      <button
        type="button"
        className="g-fontdock-toggle"
        aria-expanded={open}
        aria-label={open ? '收起字体切换' : '切换字体'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={15} aria-hidden="true" /> : <span lang="en">Aa</span>}
      </button>
    </div>
  );
}

/* ---------- 顶栏 ---------- */

/** 「产品」下拉：五间展厅平铺，World 带「概念设计」签；Esc、点外面、焦点离开都会收起 */
function ProductsMenu({ current }: { current?: FolioProductId }) {
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
    <div className="g-menu" ref={root} data-open={open}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="g-products-menu"
        data-current={Boolean(current)}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{navLabels.products}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div className="g-menu-panel" id="g-products-menu" hidden={!open}>
        {productIds.map((id) => (
          <Link
            key={id}
            href={productHref[id]}
            aria-current={current === id ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            <i aria-hidden="true">{roomNumber(id)}</i>
            <strong lang="en">
              {productName[id]}
              {productTag[id] ? (
                <span className="g-menu-tag">{productTag[id]}</span>
              ) : null}
            </strong>
            <small>{productLine[id]}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 没登录时是「登录」，登录后是「我的账号」 */
function AccountLink({ current }: { current: boolean }) {
  const { data } = authClient.useSession();
  return (
    <Link
      href={data ? ACCOUNT : LOGIN}
      className="g-login"
      aria-current={current ? 'page' : undefined}
    >
      {data ? folioStudio.nav.account : folioStudio.nav.login}
    </Link>
  );
}

/** 顶栏：产品 · 解决方案 · 文章 · 社区 · 团队，右边登录和聊一聊。和 Folio 同一组去处 */
export function Header({ current }: { current?: Current }) {
  const product = productIds.find((id) => id === current);
  const links: { key: Current; href: string; label: string }[] = [
    { key: 'solutions', href: SOLUTIONS, label: navLabels.solutions },
    { key: 'essays', href: ESSAYS, label: folioStudio.nav.essays },
    { key: 'community', href: COMMUNITY, label: navLabels.community },
    { key: 'about', href: ABOUT, label: folioStudio.labels.team.zh },
  ];
  return (
    <header className="g-header">
      <Link href={HOME} className="g-logo" aria-label="Molis AI 首页">
        <img src="/images/molis-logo.png" width="34" height="34" alt="" />
        <span>Molis AI</span>
      </Link>
      <nav className="g-nav" aria-label="主导航">
        <ProductsMenu current={product} />
        {links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            aria-current={current === link.key ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="g-header-end">
        <AccountLink current={current === 'account'} />
        <Link
          href={CONTACT}
          className="g-cta"
          aria-current={current === 'contact' ? 'page' : undefined}
        >
          {navLabels.contact}
        </Link>
      </div>
    </header>
  );
}

/* ---------- 页尾 ---------- */

/** 页尾：上面放各页自己的结尾，下面是落款、栏目和一行浅灰的大字标 */
export function Footer({
  children,
  compact = false,
}: {
  children?: ReactNode;
  /** 正文很短的页面（登录、账号、404）不放大字标，免得页尾比正文还高 */
  compact?: boolean;
}) {
  return (
    <footer className="g-footer" data-compact={compact}>
      {children}
      <div className="g-colophon">
        <div className="g-colophon-lead">
          <span className="g-colophon-brand">
            <img
              src="/images/molis-logo.png"
              width="30"
              height="30"
              alt=""
              loading="lazy"
            />
            Molis AI
          </span>
          <p>{signature}</p>
        </div>
        <nav className="g-colophon-links" aria-label="页尾导航">
          <div>
            <h2>{footer.productsLabel}</h2>
            <ul>
              {productIds.map((id) => (
                <li key={id}>
                  <Link href={productHref[id]}>{productName[id]}</Link>
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
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="g-colophon-base">
          <span>{footer.copyright}</span>
          <Link href={PRIVACY}>{footer.privacy}</Link>
        </div>
        {compact ? null : (
          <p className="g-colophon-mark" aria-hidden="true" lang="en">
            Molis AI
          </p>
        )}
      </div>
    </footer>
  );
}

/* ---------- 页面外壳 ---------- */

/**
 * 所有页面的外壳。rooms：页面上有白盒子展厅时打开，墙上的树影画成位图挂上；
 * mainRef、mainClassName 给需要在 main 上写状态的页面（例如首页的展厅导览）。
 */
export function Shell({
  current,
  children,
  ending,
  compact = false,
  rooms = false,
  className = '',
  mainRef,
  mainClassName,
}: {
  current?: Current;
  children: ReactNode;
  ending?: ReactNode;
  compact?: boolean;
  rooms?: boolean;
  className?: string;
  mainRef?: Ref<HTMLElement>;
  mainClassName?: string;
}) {
  const root = useGalleryMotion();
  const leaves = useLeaves(rooms);
  const [font, chooseFont] = useFont();
  return (
    <div
      className={`g ${className}`}
      ref={root}
      data-font={font}
      style={leaves as CSSProperties}
    >
      <Header current={current} />
      <main
        id="main"
        ref={mainRef}
        className={mainClassName}
        data-step={mainRef ? '0' : undefined}
      >
        {children}
      </main>
      <Footer compact={compact}>{ending}</Footer>
      <FontDock font={font} onFont={chooseFont} />
    </div>
  );
}

/**
 * 页面动效，全部写进 CSS 变量，由样式决定怎么用：
 * - 根节点：--page 整页滚动进度；离开顶部时加 is-scrolled；第一帧之后加 is-ready。
 * - [data-scene]：--p，模式 pin（高于一屏的粘性舞台）/ pass（整段穿过视口）/ enter（顶边从底部走到顶部）/ leave（离开首屏）。
 *   带 data-steps="n" 时同时写入 data-step（0…n-1）。
 * - [data-reveal]：进入视口加 is-in。
 * - [data-parallax]：鼠标微移写入 --mx、--my（−0.5…0.5）。
 * 减少动态时：pin / pass / enter 直接为 1，leave 为 0，样式表再取消粘性编排。
 */
export function useGalleryMotion() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const ready = requestAnimationFrame(() => root.classList.add('is-ready'));
    let scenes = Array.from(root.querySelectorAll<HTMLElement>('[data-scene]'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      root.style.setProperty('--page', (window.scrollY / max).toFixed(4));
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

    const pan = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || reduce.matches) return;
      const x = (event.clientX / window.innerWidth - 0.5).toFixed(3);
      const y = (event.clientY / window.innerHeight - 0.5).toFixed(3);
      for (const pane of root.querySelectorAll<HTMLElement>(
        '[data-parallax]',
      )) {
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
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    const watch = () => {
      scenes = Array.from(root.querySelectorAll<HTMLElement>('[data-scene]'));
      root
        .querySelectorAll('[data-reveal]:not(.is-in)')
        .forEach((item) => reveal.observe(item));
      request();
    };
    watch();
    // 页面里后来才出现的内容（切换、展开）也要接上
    const mutations = new MutationObserver(watch);
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(ready);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      window.removeEventListener('pointermove', pan);
      reduce.removeEventListener('change', request);
      reveal.disconnect();
      mutations.disconnect();
    };
  }, []);
  return ref;
}

/* ---------- 白盒子展厅 ---------- */

/** 墙上那组作品最多占正墙的宽、高比例：四周总留一圈白 */
const WALL_FILL = { width: 0.84, height: 0.76 };

/**
 * 让墙上那组作品始终完整落在正墙里。字号和比例按几档屏幕宽度写在样式里，
 * 但墙的实际宽高还取决于窗口比例；这里按排出来的大小再算一个缩小系数 --auto（不超过 1）。
 * 作品和墙在同一个平面上，两者的比例不受推镜影响，所以推镜过程中不用重算。窄屏是平墙，不需要。
 */
function useFitWall(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const node = ref.current;
    const wall = node?.querySelector<HTMLElement>('.g-wall');
    const hang = node?.querySelector<HTMLElement>('.g-hang');
    if (!node || !wall || !hang) return;
    const narrow = matchMedia('(max-width: 900px)');
    let frame = 0;
    const fit = () => {
      frame = 0;
      const group = hang.firstElementChild;
      if (!group || narrow.matches) {
        hang.style.removeProperty('--auto');
        return;
      }
      const current = Number(hang.style.getPropertyValue('--auto')) || 1;
      const outer = wall.getBoundingClientRect();
      const inner = group.getBoundingClientRect();
      if (!outer.width || !inner.width) return;
      const next = Math.min(
        1,
        (WALL_FILL.width * outer.width * current) / inner.width,
        (WALL_FILL.height * outer.height * current) / inner.height,
      );
      if (Math.abs(next - current) > 0.004)
        hang.style.setProperty('--auto', next.toFixed(3));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(fit);
    };
    request();
    const observer = new ResizeObserver(request);
    observer.observe(node);
    if (hang.firstElementChild) observer.observe(hang.firstElementChild);
    void document.fonts?.ready.then(request);
    narrow.addEventListener('change', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      narrow.removeEventListener('change', request);
    };
  }, [ref]);
}

/**
 * 一间白盒子展厅：children 挂在正墙上，floor 放在展厅地上（展台之类，需要自己摆三维位置）。
 * 墙上有一片从上方落下的柔光，叠两层随风晃动的树影。推镜的程度 --d（0…1）由使用它的区块写；
 * className 给各页调比例。
 */
export function Room({
  children,
  floor,
  className = '',
}: {
  children?: ReactNode;
  floor?: ReactNode;
  className?: string;
}) {
  const room = useRef<HTMLDivElement>(null);
  useFitWall(room);
  return (
    <div className={`g-room ${className}`} ref={room} data-parallax>
      <div className="g-cam">
        <span className="g-plane g-ceiling" aria-hidden="true" />
        <span className="g-plane g-side g-left" aria-hidden="true">
          <i className="g-dapple g-dapple-side" />
        </span>
        <span className="g-plane g-side g-right" aria-hidden="true" />
        <span className="g-plane g-floor" aria-hidden="true">
          <i className="g-dapple g-dapple-floor" />
        </span>
        {floor}
        <div className="g-wall">
          <span className="g-dapple g-dapple-far" aria-hidden="true" />
          <span className="g-dapple g-dapple-near" aria-hidden="true" />
          <div className="g-hang">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** 一块独立的白墙（不是三维展厅）：同样的柔光和树影，给大字、整面的说明用 */
export function Wall({
  children,
  className = '',
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`g-flatwall ${className}`}>
      <span className="g-dapple g-dapple-far" aria-hidden="true" />
      <span className="g-dapple g-dapple-near" aria-hidden="true" />
      {children}
    </div>
  );
}

/* ---------- 小部件 ---------- */

/** 在逗号、顿号、句号后断行，避免中文标题在词中间折开 */
export function Phrases({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=[，、。：；？！])/).map((phrase, index) => (
        <span className="g-phrase" key={index}>
          {phrase}
        </span>
      ))}
    </>
  );
}

/** 诚实标注：规划中、概念设计、示意、示例数据……虚线描边，和真实状态区分开 */
export function Tag({
  children,
  tone = 'plan',
}: {
  children: ReactNode;
  /** plan：规划中、概念、示意（虚线）；live：真实可用的状态（实心小点） */
  tone?: 'plan' | 'live';
}) {
  return (
    <span className="g-tag" data-tone={tone}>
      {children}
    </span>
  );
}

/** 一排状态签：第一枚带一个杏色小点 */
export function Status({
  items,
  label = '当前状态',
}: {
  items: string[];
  label?: string;
}) {
  return (
    <ul className="g-status" aria-label={label}>
      {items.map((item, index) => (
        <li key={item}>
          {index === 0 ? <i aria-hidden="true" /> : null}
          {item}
        </li>
      ))}
    </ul>
  );
}

/** 圆角按钮：ink 实心、ghost 描边；external 新窗口打开 */
export function Btn({
  href,
  children,
  tone = 'ink',
  external = false,
  className = '',
}: {
  href: string;
  children: ReactNode;
  tone?: 'ink' | 'ghost' | 'light';
  external?: boolean;
  className?: string;
}) {
  const cls = `g-btn g-btn-${tone} ${className}`;
  return external ? (
    <a className={cls} href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  ) : (
    <Link className={cls} href={href}>
      {children}
    </Link>
  );
}

/** 细下划线的文字链接，右边一个小箭头 */
export function More({
  href,
  children,
  external = false,
  className = '',
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const cls = `g-more ${className}`;
  return external ? (
    <a className={cls} href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight size={13} aria-hidden="true" />
    </a>
  ) : (
    <Link className={cls} href={href}>
      {children}
      <ArrowUpRight size={13} aria-hidden="true" />
    </Link>
  );
}

/** 一排按钮或链接 */
export function Actions({ children }: { children: ReactNode }) {
  return <div className="g-actions">{children}</div>;
}

/**
 * 区块标题，像展厅门口的名牌：上面一道墨线，左边柔边斜体的编号（Room 1、01……），右边一行小字，
 * 下面是大标题；side 放在标题右边（一段说明或一个链接）。
 */
export function Plate({
  id,
  index,
  kicker,
  title,
  side,
  as: Heading = 'h2',
  className = '',
}: {
  id?: string;
  index?: string;
  kicker?: ReactNode;
  title: ReactNode;
  side?: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  return (
    <header className={`g-plate ${className}`} data-reveal>
      {index || kicker ? (
        <p className="g-plate-top">
          {index ? (
            <span className="g-soft" lang="en">
              {index}
            </span>
          ) : (
            <span />
          )}
          {kicker ? <span>{kicker}</span> : null}
        </p>
      ) : null}
      <div className="g-plate-row">
        <Heading id={id} className="g-plate-title">
          {title}
        </Heading>
        {side ? <div className="g-plate-side">{side}</div> : null}
      </div>
    </header>
  );
}

/** 展签：一块略带圆角的小白牌，里面的行用 g-label-* 类名 */
export function WallLabel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`g-label ${className}`}>{children}</div>;
}

/** 画框：oak 浅橡木、white 白漆、black 黑铝；mat 加一圈宽白卡纸 */
export function Framed({
  children,
  tone = 'oak',
  mat = true,
  className = '',
}: {
  children: ReactNode;
  tone?: 'oak' | 'white' | 'black';
  mat?: boolean;
  className?: string;
}) {
  return (
    <div className={`g-framed ${className}`} data-tone={tone}>
      {mat ? (
        <div className="g-framed-mat">
          <div className="g-framed-window">{children}</div>
        </div>
      ) : (
        <div className="g-framed-window">{children}</div>
      )}
    </div>
  );
}

/** 作品下面的一行图注：柔边斜体的标题，后面跟一句说明 */
export function Caption({
  title,
  children,
}: {
  title?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <p className="g-caption">
      {title ? <em lang="en">{title}</em> : null}
      {children ? <span>{children}</span> : null}
    </p>
  );
}

/** 产品页的封底：下一间展厅。Work → Tool → Life → Story → World → Work */
export function NextRoom({ current }: { current: FolioProductId }) {
  const next =
    productIds[(productIds.indexOf(current) + 1) % productIds.length];
  return (
    <Link className="g-next" href={productHref[next]}>
      <span className="g-next-door" aria-hidden="true">
        <i />
      </span>
      <span className="g-next-copy">
        <small>
          {folioStudio.nextProduct}
          <span className="g-soft" lang="en">
            Room {roomNumber(next)}
          </span>
          {productTag[next] ? <Tag>{productTag[next]}</Tag> : null}
        </small>
        <strong lang="en">{productName[next]}</strong>
        <span>{productLine[next]}</span>
      </span>
      <ArrowRight className="g-next-go" size={22} aria-hidden="true" />
    </Link>
  );
}

/** 产品页的结尾：墙上写一句大字，下面是去处；放在 Shell 的 ending 里，后面通常跟 NextRoom */
export function Closing({
  id,
  title,
  children,
}: {
  id: string;
  title: string | string[];
  children?: ReactNode;
}) {
  return (
    <section className="g-closing" aria-labelledby={id}>
      <h2 id={id} className="g-closing-title" data-reveal>
        {Array.isArray(title) ? (
          title.map((line) => (
            <span className="g-phrase" key={line}>
              {line}
            </span>
          ))
        ) : (
          <Phrases text={title} />
        )}
      </h2>
      {children ? (
        <div className="g-closing-body" data-reveal>
          {children}
        </div>
      ) : null}
    </section>
  );
}

/** 两位编号：0 → 01 */
export const pad = (index: number) => String(index + 1).padStart(2, '0');
