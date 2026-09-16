'use client';
import Link from '../edition-link';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AccountLink } from '../account-link';
import { navItems } from '../nav-links';
export function CHeader() {
  const path = usePathname()?.replace('/edition-c', '').replace(/\/$/, '');
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [path]);
  const photograph = [
    '',
    '/community',
    '/products',
    '/solutions',
    '/wiki',
  ].includes(path || '');
  return (
    <header className={`c-header${photograph ? ' c-header-photo' : ''}`}>
      <Link className="c-brand" href="/" aria-label="Molis AI 首页">
        Molis AI
      </Link>
      <Link
        className="c-top-link"
        href="/products"
        aria-current={path?.startsWith('/products') ? 'page' : undefined}
      >
        产品
      </Link>
      <Link
        className="c-top-link"
        href="/wiki"
        aria-current={path?.startsWith('/wiki') ? 'page' : undefined}
      >
        百科
      </Link>
      <details className="c-menu" ref={menu}>
        <summary>工作室</summary>
        <nav aria-label="主导航">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/join">聊聊你的想法</Link>
          <AccountLink />
        </nav>
      </details>
    </header>
  );
}
export function CFooter() {
  return (
    <footer className="c-footer">
      <div className="c-footer-top">
        <Link className="c-brand" href="/">
          Molis AI
        </Link>
        <nav aria-label="继续浏览">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="c-footer-contact">
          <p>
            下一个想法，
            <br />
            从一次交流开始。
          </p>
          <Link href="/join" className="c-button">
            和我们聊聊
          </Link>
        </div>
      </div>
      <div className="c-footer-bottom">
        <span>Molis AI © 2026</span>
        <div>
          <AccountLink />
          <Link href="/privacy">隐私说明</Link>
          <a
            href="https://github.com/adeptify"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
