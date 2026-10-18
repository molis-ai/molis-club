'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { footer, nav } from '../../content/site/nav';
import {
  isSoon,
  productIds,
  products,
  stageOf,
} from '../../content/site/products';
import pageDates from '../../content/site/page-dates.json';
import {
  ABOUT,
  ALONG,
  COMMUNITY,
  CONTACT,
  ENTERPRISE,
  ESSAYS,
  GITHUB,
  LOGIN,
  METHODS,
  PRIVACY,
  TEAM,
  productHref,
} from './routes';

// 顶栏与页尾。顶栏固定在上方：平时是实心的纸，滚动后下面出现一道细线；
// 首页前两屏压在画面上时透明、白字（读 [data-tone="film"]）；压在明亮的建筑照片上时透明、墨字（[data-tone="light"]）。两个下拉和窄屏菜单都用 <details>，没有 JS 也能打开；
// 有 JS 时补上点外面、按 Esc、换页时收起。
// 先不开放的产品（Life、Story、World）在下拉、菜单和页尾都留着名字，但不是链接，阶段写「探索中，敬请期待」。

const pad = (n: number) => String(n).padStart(2, '0');

const aboutLinks = [
  { href: TEAM, label: nav.aboutItems.team, line: nav.aboutLines.team },
  { href: ABOUT, label: nav.aboutItems.about, line: nav.aboutLines.about },
  { href: ESSAYS, label: nav.aboutItems.essays, line: nav.aboutLines.essays },
  { href: ALONG, label: nav.aboutItems.along, line: nav.aboutLines.along },
];

const isUnder = (path: string, href: string) =>
  href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);

function useCloseDetails(path: string) {
  const ref = useRef<HTMLElement>(null);
  // 换页时收起
  useEffect(() => {
    ref.current
      ?.querySelectorAll('details[open]')
      .forEach((node) => node.removeAttribute('open'));
  }, [path]);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const close = (except?: Element | null) =>
      root.querySelectorAll('details[open]').forEach((node) => {
        if (node !== except) node.removeAttribute('open');
      });
    const onPointer = (event: PointerEvent) => {
      const inside = (event.target as Element | null)?.closest('details');
      close(inside && root.contains(inside) ? inside : null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const open = root.querySelector<HTMLDetailsElement>('details[open]');
      if (!open) return;
      open.removeAttribute('open');
      open.querySelector('summary')?.focus();
    };
    // 键盘焦点离开下拉时收起
    const onFocus = (event: FocusEvent) => {
      const inside = (event.target as Element | null)?.closest('details');
      root.querySelectorAll('details[open]').forEach((node) => {
        if (node !== inside && !node.classList.contains('m-menu'))
          node.removeAttribute('open');
      });
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocus);
    };
  }, []);
  return ref;
}

type Tone = 'film' | 'light' | 'paper';
/** 首屏是满幅照片的页：服务端渲染时就按压在照片上画（没有 JS 时也是这个样子） */
const topTone: Record<string, Tone> = { '/': 'film', [ENTERPRISE]: 'light' };

/** 顶栏下面压着的是画面还是纸：读顶栏中线下方最近的 [data-tone] */
function useTone(path: string) {
  const [tone, setTone] = useState<Tone>(topTone[path] ?? 'paper');
  const [scrolled, setScrolled] = useState(false);
  useLayoutEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 40)
        .map((node) => node.closest('[data-tone]'))
        .find(Boolean);
      const next = under?.getAttribute('data-tone');
      setTone(next === 'film' || next === 'light' ? next : 'paper');
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    // 刷新后浏览器会恢复滚动位置，稍后再读一次
    const again = window.setTimeout(request, 150);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      window.clearTimeout(again);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, [path]);
  return { tone, scrolled };
}

export function Header() {
  const path = usePathname() ?? '/';
  const ref = useCloseDetails(path);
  const { tone, scrolled } = useTone(path);
  const productCurrent = productIds.some((id) =>
    isUnder(path, productHref[id]),
  );
  const aboutCurrent = aboutLinks.some((link) => isUnder(path, link.href));
  return (
    <header
      ref={ref}
      className={`m-header${scrolled ? ' is-scrolled' : ''}`}
      data-over={tone}
    >
      <Link href="/" className="m-logo" aria-label={nav.home}>
        <img
          src="/site/molis-logo-64.png"
          srcSet="/site/molis-logo-64.png 2x, /site/molis-logo-96.png 3x"
          width="30"
          height="30"
          alt=""
        />
        <span lang="en">Molis AI</span>
      </Link>
      <nav className="m-nav" aria-label="主导航">
        <details className="m-drop" data-current={productCurrent || undefined}>
          <summary>
            {nav.products}
            <ChevronDown size={14} aria-hidden="true" />
          </summary>
          <div className="m-drop-panel m-drop-products">
            {productIds.map((id, index) => {
              const product = products[id];
              const inner = (
                <>
                  <span className="m-no" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <strong lang="en">{product.name}</strong>
                  <small>
                    <span>{product.overview}</span>
                    <span
                      className="m-status"
                      data-concept={id === 'world' || isSoon(id) || undefined}
                    >
                      {stageOf(id)}
                    </span>
                  </small>
                </>
              );
              return isSoon(id) ? (
                <div key={id} className="m-soon">
                  {inner}
                </div>
              ) : (
                <Link
                  key={id}
                  href={productHref[id]}
                  aria-current={
                    isUnder(path, productHref[id]) ? 'page' : undefined
                  }
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </details>
        <Link
          href={ENTERPRISE}
          aria-current={isUnder(path, ENTERPRISE) ? 'page' : undefined}
        >
          {nav.enterprise}
        </Link>
        <Link
          href={COMMUNITY}
          aria-current={isUnder(path, COMMUNITY) ? 'page' : undefined}
        >
          {nav.community}
        </Link>
        <details className="m-drop" data-current={aboutCurrent || undefined}>
          <summary>
            {nav.about}
            <ChevronDown size={14} aria-hidden="true" />
          </summary>
          <div className="m-drop-panel m-drop-about">
            {aboutLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isUnder(path, link.href) ? 'page' : undefined}
              >
                <strong>{link.label}</strong>
                <small>{link.line}</small>
              </Link>
            ))}
          </div>
        </details>
      </nav>
      <div className="m-head-end">
        <Link className="m-login" href={LOGIN}>
          {nav.login}
        </Link>
        <Link
          className="m-btn m-chat"
          href={CONTACT}
          aria-current={isUnder(path, CONTACT) ? 'page' : undefined}
        >
          {nav.chat}
        </Link>
        <details className="m-menu">
          <summary aria-label={nav.menu}>
            <Menu size={18} aria-hidden="true" />
          </summary>
          <div className="m-menu-sheet">
            <h2>{nav.products}</h2>
            {productIds.map((id) =>
              isSoon(id) ? (
                <p key={id} className="m-soon">
                  <span lang="en">{products[id].name}</span>
                  <small>{stageOf(id)}</small>
                </p>
              ) : (
                <Link key={id} href={productHref[id]}>
                  <span lang="en">{products[id].name}</span>
                  <small>{stageOf(id)}</small>
                </Link>
              ),
            )}
            <h2>{footer.columns.studio}</h2>
            <Link href={ENTERPRISE}>{nav.enterprise}</Link>
            <Link href={COMMUNITY}>{nav.community}</Link>
            {aboutLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href={LOGIN}>{nav.login}</Link>
            <Link className="m-btn" href={CONTACT}>
              {nav.chat}
            </Link>
            <button
              type="button"
              className="m-link m-menu-close"
              onClick={(event) =>
                event.currentTarget.closest('details')?.removeAttribute('open')
              }
            >
              <X size={14} aria-hidden="true" />
              {nav.close}
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}

/** 本页最近修改：取 content/site/page-dates.json（npm run dates 按 Git 记录生成） */
function lastModified(path: string) {
  const dates = pageDates as Record<string, string>;
  if (dates[path]) return dates[path];
  const parent = Object.keys(dates)
    .filter((key) => key.endsWith('/*') && path.startsWith(key.slice(0, -1)))
    .sort((a, b) => b.length - a.length)[0];
  return parent ? dates[parent] : dates['*'];
}

export function Footer() {
  const path = usePathname() ?? '/';
  const date = lastModified(path);
  return (
    <footer className="m-footer" data-home={path === '/' || undefined}>
      <div className="m-wrap">
        <div className="m-footer-top">
          <div className="m-footer-lead">
            <Link href="/" className="m-footer-brand" aria-label={nav.home}>
              <span className="m-footer-mark" lang="en">
                Molis AI
              </span>
            </Link>
            <p>
              <span className="m-phrase">技术，回到人的尺度。</span>
            </p>
          </div>
          <nav className="m-footer-cols" aria-label="页尾导航">
            <div>
              <h2>{footer.columns.products}</h2>
              <ul>
                {productIds.map((id) => (
                  <li key={id}>
                    {isSoon(id) ? (
                      <span className="m-soon" lang="en">
                        {products[id].name}
                      </span>
                    ) : (
                      <Link href={productHref[id]} lang="en">
                        {products[id].name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>{footer.columns.studio}</h2>
              <ul>
                <li>
                  <Link href={ENTERPRISE}>{nav.enterprise}</Link>
                </li>
                <li>
                  <Link href={COMMUNITY}>{nav.community}</Link>
                </li>
                <li>
                  <Link href={METHODS}>{footer.methods}</Link>
                </li>
                {aboutLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>{footer.columns.elsewhere}</h2>
              <ul>
                <li>
                  <Link href={CONTACT}>{nav.chat}</Link>
                </li>
                <li>
                  <Link href={LOGIN}>{nav.login}</Link>
                </li>
                <li>
                  <Link href={PRIVACY}>{footer.privacy}</Link>
                </li>
                <li>
                  <a href={GITHUB} target="_blank" rel="noreferrer">
                    {footer.github}
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="m-footer-base">
          {date ? (
            <p>
              {footer.updated}：<time dateTime={date}>{date}</time>
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
