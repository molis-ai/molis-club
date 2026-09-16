'use client';
import Link from '../edition-link';
import { usePathname } from 'next/navigation';
import { AccountLink } from '../account-link';
import { navItems } from '../nav-links';
export function CHeader() {
  const pathname = usePathname();
  const path = pathname?.replace('/edition-c', '').replace(/\/$/, '');
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
      <nav className="c-primary-nav" aria-label="栏目导航">
        {navItems.map((item) => (
          <Link
            key={item.href}
            className="c-top-link"
            href={item.href}
            aria-current={
              path === item.href
                ? 'page'
                : path?.startsWith(`${item.href}/`)
                  ? 'location'
                  : undefined
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="c-header-account">
        <AccountLink />
      </div>
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
