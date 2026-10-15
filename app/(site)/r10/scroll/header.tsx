'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { footer, nav } from '../../../../content/site/nav';
import { productIds, products } from '../../../../content/site/products';
import {
  ABOUT,
  ALONG,
  COMMUNITY,
  CONTACT,
  ENTERPRISE,
  ESSAYS,
  LOGIN,
  TEAM,
  productHref,
} from '../../../_site/routes';
import { SCROLL_HOME, SCROLL_WORK } from './routes';

// 「一卷手卷」视觉稿的顶栏：从 app/_site/chrome.tsx 的 Header 复制过来改的，公共顶栏不动。
// 改了三处：字标与导航换成 Norm 那种小号大写、大字距；右上角加「中 / EN」切换的样子（机制另有 session 在做，
// 这里只占位）；Logo 与产品里的 Work 指向这一版自己的首页和 Work 页，评审时不会跳出这一版。

const pad = (n: number) => String(n).padStart(2, '0');

const aboutLinks = [
  { href: ABOUT, label: nav.aboutItems.about, line: nav.aboutLines.about },
  { href: TEAM, label: nav.aboutItems.team, line: nav.aboutLines.team },
  { href: ESSAYS, label: nav.aboutItems.essays, line: nav.aboutLines.essays },
  { href: ALONG, label: nav.aboutItems.along, line: nav.aboutLines.along },
];

const hrefOf = (id: (typeof productIds)[number]) =>
  id === 'work' ? SCROLL_WORK : productHref[id];

const isUnder = (path: string, href: string) =>
  path === href || path.startsWith(`${href}/`);

function useCloseDetails(path: string) {
  const ref = useRef<HTMLElement>(null);
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

/** 顶栏下面压着的是画面还是纸：读顶栏中线下方最近的 [data-tone] */
function useTone(path: string) {
  const [tone, setTone] = useState<'film' | 'paper'>(
    path === SCROLL_HOME ? 'film' : 'paper',
  );
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
      setTone(under?.getAttribute('data-tone') === 'film' ? 'film' : 'paper');
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
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

/** 中 / EN：只做出样子。EN 暂不可点，悬停说明在做 */
function LangSwitch() {
  return (
    <div className="sc-lang">
      <button type="button" aria-pressed="true" aria-label="中文">
        中
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        aria-pressed="false"
        aria-disabled="true"
        title="英文版在做"
        aria-label="English（英文版在做）"
        lang="en"
      >
        EN
      </button>
    </div>
  );
}

export function ScrollHeader() {
  const path = usePathname() ?? SCROLL_HOME;
  const ref = useCloseDetails(path);
  const { tone, scrolled } = useTone(path);
  const productCurrent = productIds.some((id) => isUnder(path, hrefOf(id)));
  return (
    <header
      ref={ref}
      className={`m-header sc-header${scrolled ? ' is-scrolled' : ''}`}
      data-over={tone}
    >
      <Link href={SCROLL_HOME} className="m-logo" aria-label={nav.home}>
        <img
          src="/site/molis-logo-64.png"
          srcSet="/site/molis-logo-64.png 2x, /site/molis-logo-96.png 3x"
          width="22"
          height="22"
          alt=""
        />
        <span lang="en">Molis AI</span>
      </Link>
      <nav className="m-nav" aria-label="主导航">
        <details className="m-drop" data-current={productCurrent || undefined}>
          <summary>
            {nav.products}
            <ChevronDown size={12} aria-hidden="true" />
          </summary>
          <div className="m-drop-panel m-drop-products">
            {productIds.map((id, index) => {
              const product = products[id];
              return (
                <Link
                  key={id}
                  href={hrefOf(id)}
                  aria-current={isUnder(path, hrefOf(id)) ? 'page' : undefined}
                >
                  <span className="m-no" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <strong lang="en">{product.name}</strong>
                  <small>
                    <span>{product.overview}</span>
                    <span
                      className="m-status"
                      data-concept={id === 'world' || undefined}
                    >
                      {product.stage}
                    </span>
                  </small>
                </Link>
              );
            })}
          </div>
        </details>
        <Link href={ENTERPRISE}>{nav.enterprise}</Link>
        <Link href={COMMUNITY}>{nav.community}</Link>
        <details className="m-drop">
          <summary>
            {nav.about}
            <ChevronDown size={12} aria-hidden="true" />
          </summary>
          <div className="m-drop-panel m-drop-about">
            {aboutLinks.map((link) => (
              <Link key={link.href} href={link.href}>
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
        <Link className="sc-chat" href={CONTACT}>
          {nav.chat}
        </Link>
        <LangSwitch />
        <details className="m-menu">
          <summary aria-label={nav.menu}>
            <Menu size={18} aria-hidden="true" />
          </summary>
          <div className="m-menu-sheet">
            <h2>{nav.products}</h2>
            {productIds.map((id) => (
              <Link key={id} href={hrefOf(id)}>
                <span lang="en">{products[id].name}</span>
                <small>{products[id].stage}</small>
              </Link>
            ))}
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
