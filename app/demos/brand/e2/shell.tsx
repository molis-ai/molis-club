'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { folioSolutions, folioStudio } from '../../../../content/folio';
import { folioCommunity } from '../../../../content/folio-community';
import { footer, navLabels, signature } from '../../../../content/studio';
import { authClient } from '../../../../lib/auth-client';
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
  pad,
  productHref,
  productIds,
  productLine,
  productName,
  productTag,
  type ProductId,
} from './routes';
import './e2.css';

// E2 整站共用：顶栏（含「产品」下拉）、页尾、页面动效和几件基础部件。
// 视觉规则写在 e2.css 开头与 设计记录.md；各页只在自己的样式表里加本页的东西。

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export type Current =
  | ProductId
  | 'solutions'
  | 'essays'
  | 'community'
  | 'about'
  | 'contact'
  | 'account';

/* ---------- 顶栏 ---------- */

/** 「产品」下拉：五件产品按编号排成一张规格表；Esc、点外面、焦点离开都会收起 */
function ProductsMenu({ current }: { current?: ProductId }) {
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
    <div className="e2-menu" ref={root} data-open={open}>
      <button
        type="button"
        className="e2-nav-item"
        aria-expanded={open}
        aria-controls="e2-products-menu"
        aria-current={current ? 'true' : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        {navLabels.products}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div className="e2-menu-panel" id="e2-products-menu" hidden={!open}>
        {productIds.map((id, index) => (
          <Link
            key={id}
            href={productHref[id]}
            aria-current={current === id ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            <i aria-hidden="true">{pad(index)}</i>
            <strong lang="en">
              {productName[id]}
              {productTag[id] ? <Tag>{productTag[id]!}</Tag> : null}
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
      className="e2-login"
      aria-current={current ? 'page' : undefined}
    >
      {data ? folioStudio.nav.account : folioStudio.nav.login}
    </Link>
  );
}

/** 顶栏每一栏的线描小图标（原样取自第四轮 E 的顶栏） */
const glyphs: Record<string, ReactNode> = {
  products: (
    <>
      <rect x="3" y="3" width="10" height="10" rx="1.5" />
      <rect
        x="17"
        y="3"
        width="10"
        height="10"
        rx="1.5"
        className="e2-g-accent"
      />
      <rect x="3" y="17" width="10" height="10" rx="1.5" />
      <rect x="17" y="17" width="10" height="10" rx="1.5" />
    </>
  ),
  solutions: (
    <>
      <circle cx="7" cy="15" r="4" />
      <rect
        x="19"
        y="11"
        width="8"
        height="8"
        rx="1.5"
        className="e2-g-accent"
      />
      <path d="M11 15 L19 15" />
      <path d="M7 3 L7 11 M23 19 L23 27" />
    </>
  ),
  essays: (
    <>
      <path d="M15 7 C 11 5 7 5 3 6 L3 25 C 7 24 11 24 15 26 Z" />
      <path
        d="M15 7 C 19 5 23 5 27 6 L27 25 C 23 24 19 24 15 26 Z"
        className="e2-g-accent"
      />
    </>
  ),
  community: (
    <>
      <circle cx="9" cy="12" r="5" />
      <circle cx="21" cy="12" r="5" className="e2-g-accent" />
      <path d="M3 26 C 4 20 14 20 15 26 M15 26 C 16 20 26 20 27 26" />
    </>
  ),
  team: (
    <>
      <circle cx="15" cy="15" r="11" />
      <circle cx="11" cy="13" r="1.4" className="e2-g-fill" />
      <circle cx="19" cy="13" r="1.4" className="e2-g-fill" />
      <path d="M10 18 C 12 21 18 21 20 18" />
    </>
  ),
};

function Glyph({ name }: { name: string }) {
  return (
    <svg className="e2-glyph" viewBox="0 0 30 30" aria-hidden="true">
      {glyphs[name]}
    </svg>
  );
}

/**
 * 所有 E2 页面共用的顶栏（第四轮 E 的样子）：每栏一个线描图标、一个名字、底下几行等宽小字；
 * 当前栏目名字下面一道杏橙。页面往下滚过顶栏后，顶部滑下一条细的快捷栏（MiniBar），长页面也随时能跳走。
 */
export function Header({ current }: { current?: Current }) {
  const product = productIds.find((id) => id === current);
  const mark = (key: Current) => (current === key ? 'page' : undefined);
  return (
    <>
      <header className="e2-header">
        <a className="e2-skip" href="#main">
          跳到正文
        </a>
        <Link href={HOME} className="e2-logo" aria-label="Molis AI 首页">
          <img src="/images/molis-logo.png" width="36" height="36" alt="" />
          <span lang="en">
            Molis
            <br />
            AI
          </span>
        </Link>
        <nav className="e2-nav" aria-label="主导航">
          <div className="e2-nav-block">
            <Glyph name="products" />
            <Link
              className="e2-nav-title"
              href={`${HOME}#products`}
              aria-current={product ? 'true' : undefined}
            >
              {navLabels.products}
            </Link>
            <ul>
              {productIds.map((id) => (
                <li key={id}>
                  <Link
                    href={productHref[id]}
                    lang="en"
                    aria-current={current === id ? 'page' : undefined}
                  >
                    {productName[id].replace('Molis ', '')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="e2-nav-block">
            <Glyph name="solutions" />
            <Link
              className="e2-nav-title"
              href={SOLUTIONS}
              aria-current={mark('solutions')}
            >
              {navLabels.solutions}
            </Link>
            <ul aria-hidden="true">
              {folioSolutions.directions.map((direction) => (
                <li key={direction.id}>{direction.name}</li>
              ))}
            </ul>
          </div>
          <div className="e2-nav-block">
            <Glyph name="essays" />
            <Link
              className="e2-nav-title"
              href={ESSAYS}
              aria-current={mark('essays')}
            >
              {folioStudio.nav.essays}
            </Link>
          </div>
          <div className="e2-nav-block">
            <Glyph name="community" />
            <Link
              className="e2-nav-title"
              href={COMMUNITY}
              aria-current={mark('community')}
            >
              {navLabels.community}
            </Link>
            <ul aria-hidden="true">
              <li lang="en">molis.club</li>
            </ul>
          </div>
          <div className="e2-nav-block">
            <Glyph name="team" />
            <Link
              className="e2-nav-title"
              href={ABOUT}
              aria-current={mark('about')}
            >
              {folioStudio.labels.team.zh}
            </Link>
          </div>
        </nav>
        <div className="e2-header-end">
          <AccountLink current={current === 'account'} />
          <Link
            href={CONTACT}
            className="e2-cta"
            aria-current={mark('contact')}
          >
            {navLabels.contact}
          </Link>
        </div>
      </header>
      <MiniBar current={current} />
    </>
  );
}

/** 滚过顶栏后才出现的细快捷栏：Logo、产品下拉、四个栏目、聊一聊。没出现时不可聚焦 */
function MiniBar({ current }: { current?: Current }) {
  const product = productIds.find((id) => id === current);
  const links: { key: Current; href: string; label: string }[] = [
    { key: 'solutions', href: SOLUTIONS, label: navLabels.solutions },
    { key: 'essays', href: ESSAYS, label: folioStudio.nav.essays },
    { key: 'community', href: COMMUNITY, label: navLabels.community },
    { key: 'about', href: ABOUT, label: folioStudio.labels.team.zh },
  ];
  return (
    <div className="e2-minibar">
      <Link href={HOME} className="e2-mini-logo" aria-label="Molis AI 首页">
        <img src="/images/molis-logo.png" width="26" height="26" alt="" />
        <span lang="en">Molis AI</span>
      </Link>
      <nav className="e2-mini-nav" aria-label="快捷导航">
        <ProductsMenu current={product} />
        {links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className="e2-nav-item"
            aria-current={current === link.key ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Link href={CONTACT} className="e2-cta e2-mini-cta">
        {navLabels.contact}
      </Link>
    </div>
  );
}

/* ---------- 页尾 ---------- */

/** 页尾：上面放各页自己的结尾（children），下面是落款与栏目。compact 用在登录、账号、404 这类短页 */
export function Footer({
  children,
  compact = false,
}: {
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <footer className="e2-footer" data-compact={compact}>
      {children}
      <div className="e2-colophon">
        <div className="e2-colophon-lead">
          <span className="e2-colophon-brand" lang="en">
            <img
              src="/images/molis-logo.png"
              width="26"
              height="26"
              alt=""
              loading="lazy"
            />
            Molis AI
          </span>
          <p>{signature}</p>
        </div>
        <nav className="e2-colophon-links" aria-label="页尾导航">
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
        <div className="e2-colophon-base">
          <span>{footer.copyright}</span>
          <Link href={PRIVACY}>{footer.privacy}</Link>
        </div>
      </div>
    </footer>
  );
}

/* ---------- 动效 ---------- */

/**
 * 页面动效，全部写进 CSS 变量与类名，由样式决定怎么用：
 * - 根节点：加 is-ready；页面滚动离开顶部时加 is-scrolled（顶栏据此加底线）。
 * - [data-scene]：写入 --p（0–1），模式 pin（高于一屏的粘性舞台）/ pass（整段穿过视口）/
 *   enter（顶边从视口底部走到顶部）/ leave（离开首屏的程度）。带 data-steps="n" 时同时写 data-step。
 * - [data-reveal]：进入视口加 is-in。
 * 减少动态时：pin / pass / enter 直接为 1，leave 为 0，样式表再取消粘性编排。
 */
export function useE2Motion() {
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
      root.classList.toggle('is-scrolled', window.scrollY > 8);
      const header = root.querySelector<HTMLElement>('.e2-header');
      root.classList.toggle(
        'is-past',
        window.scrollY >
          (header ? header.offsetTop + header.offsetHeight : 120),
      );
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
    root
      .querySelectorAll('[data-reveal]')
      .forEach((item) => reveal.observe(item));

    return () => {
      cancelAnimationFrame(ready);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      reduce.removeEventListener('change', request);
      reveal.disconnect();
    };
  }, []);
  return ref;
}

/**
 * 按视口中线决定当前是第几项：容器上写 data-step（0…n-1），样式据此切换画面。
 * 适合「左边文字滚、右边画面换」的段落。
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
 * 整页共用的排线：轴测图的侧面用 #e2-hatch（斜线）、更暗的面与剖切面用 #e2-dense（反向密线），
 * 和首页那间线描工作室同一种画法。各页的 svg 直接引用，不用各自再定义。
 */
function HatchDefs() {
  return (
    <svg
      className="e2-defs"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id="e2-hatch"
          width="1.1"
          height="1.1"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(40)"
        >
          <rect width="1.1" height="1.1" fill="#fff" />
          <line x1="0" y1="0" x2="0" y2="1.1" className="e2-hatch-line" />
        </pattern>
        <pattern
          id="e2-dense"
          width="0.6"
          height="0.6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-40)"
        >
          <rect width="0.6" height="0.6" fill="#fff" />
          <line x1="0" y1="0" x2="0" y2="0.6" className="e2-hatch-line" />
        </pattern>
      </defs>
    </svg>
  );
}

/** 整页外壳：根节点（动效）、顶栏、正文、页尾。footer 是页尾上方本页自己的结尾 */
export function E2Page({
  current,
  className = '',
  footer: closing,
  compactFooter = false,
  children,
}: {
  current?: Current;
  className?: string;
  footer?: ReactNode;
  compactFooter?: boolean;
  children: ReactNode;
}) {
  const root = useE2Motion();
  return (
    <div className={`e2 ${className}`} ref={root}>
      <HatchDefs />
      <Header current={current} />
      <main id="main">{children}</main>
      <Footer compact={compactFooter}>{closing}</Footer>
    </div>
  );
}

/* ---------- 基础部件 ---------- */

/** 在逗号、顿号、句号、冒号后断行，避免中文标题在词中间折开 */
export function Phrases({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=[，、。：；？！])/).map((phrase, index) => (
        <span className="e2-phrase" key={index}>
          {phrase}
        </span>
      ))}
    </>
  );
}

/** 眉题：等宽小字，前面一枚杏橙小圆点 */
export function Kicker({ children }: { children: ReactNode }) {
  return <span className="e2-kicker">{children}</span>;
}

/** 规划中、概念设计、示例这些标签 */
export function Tag({ children }: { children: string }) {
  return <span className="e2-tag">{children}</span>;
}

/** 状态签：一排等宽小签，第一枚带杏橙点 */
export function Status({
  items,
  label = '当前状态',
}: {
  items: string[];
  label?: string;
}) {
  return (
    <ul className="e2-status" aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export type Action = {
  label: string;
  href: string;
  external?: boolean;
  /** ink：墨色实心（每处最多一个）；ghost：描边；light：白底，放在深色块上；text：文字链接 */
  tone?: 'ink' | 'ghost' | 'light' | 'text';
};

/** 一个按钮或文字链接；站内用 Link，站外新窗口打开并带斜箭头 */
export function Button({ label, href, external, tone = 'ink' }: Action) {
  const className = tone === 'text' ? 'e2-link' : `e2-button e2-button-${tone}`;
  const icon = external ? (
    <ArrowUpRight size={15} aria-hidden="true" />
  ) : tone === 'text' ? (
    <ArrowRight size={14} aria-hidden="true" />
  ) : (
    <ArrowRight size={15} aria-hidden="true" />
  );
  if (external)
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {label}
        {icon}
      </a>
    );
  return (
    <Link className={className} href={href}>
      {label}
      {icon}
    </Link>
  );
}

export function Actions({ items }: { items: Action[] }) {
  return (
    <div className="e2-actions">
      {items.map((item) => (
        <Button key={item.label + item.href} {...item} />
      ))}
    </div>
  );
}

/**
 * 区块标题：左边编号与眉题、大标题；右边可放导语或其他内容（layout="split"）。
 * index 是本页第几段（从 0 起），不需要编号时不传。
 */
export function SectionHead({
  id,
  index,
  kicker,
  title,
  lead,
  layout = 'stack',
  children,
}: {
  id: string;
  index?: number;
  kicker?: string;
  title: string;
  lead?: string;
  layout?: 'stack' | 'split';
  children?: ReactNode;
}) {
  return (
    <header className="e2-head" data-layout={layout} data-reveal>
      <div className="e2-head-main">
        {index !== undefined || kicker ? (
          <span className="e2-head-meta">
            {index !== undefined ? <i>{pad(index)}</i> : null}
            {kicker ? <span>{kicker}</span> : null}
          </span>
        ) : null}
        <h2 id={id}>
          <Phrases text={title} />
        </h2>
      </div>
      {lead || children ? (
        <div className="e2-head-side">
          {lead ? <p>{lead}</p> : null}
          {children}
        </div>
      ) : null}
    </header>
  );
}

/**
 * 图版：细线外框、浅灰底，下面一行「Fig. 0x — 说明」。界面示意、概念稿都放在里面，
 * note 写诚实标注（界面示意 · 示例数据 / 概念稿 / 概念画面）。
 */
export function Plate({
  fig,
  caption,
  note,
  className = '',
  label,
  children,
}: {
  fig?: string;
  caption?: string;
  note?: string;
  className?: string;
  /** 给读屏的整体说明；画面本身是装饰时不传 */
  label?: string;
  children: ReactNode;
}) {
  return (
    <figure className={`e2-plate ${className}`} aria-label={label}>
      <div className="e2-plate-body">{children}</div>
      {fig || caption || note ? (
        <figcaption>
          <span>
            {fig ? <b lang="en">{fig}</b> : null}
            {caption}
          </span>
          {note ? <em>{note}</em> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** 首页那摞牌的花色：每件产品一张牌，World 是一个圆 */
const suits: Record<ProductId, string> = {
  work: 'W',
  tool: 'T',
  life: 'L',
  story: 'S',
  world: 'O',
};

/** 产品页最后：接着看下一件，World 之后回到 Work。左边是首页牌堆里的那张牌，微微歪着，指上去时摆正 */
export function NextProduct({ current }: { current: ProductId }) {
  const at = productIds.indexOf(current);
  const nextIndex = (at + 1) % productIds.length;
  const next = productIds[nextIndex];
  return (
    <Link href={productHref[next]} className="e2-next" data-next={next}>
      <span className="e2-next-card" aria-hidden="true">
        <b lang="en">{suits[next]}</b>
        <i>{pad(nextIndex)}</i>
        <b className="e2-next-card-end" lang="en">
          {suits[next]}
        </b>
      </span>
      <span className="e2-next-meta">
        <i>{pad(nextIndex)}</i>
        {folioStudio.nextProduct}
      </span>
      <strong lang="en">
        {productName[next]}
        {productTag[next] ? <Tag>{productTag[next]!}</Tag> : null}
      </strong>
      <span className="e2-next-line">{productLine[next]}</span>
      <ArrowRight className="e2-next-arrow" size={22} aria-hidden="true" />
    </Link>
  );
}
