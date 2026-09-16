'use client';
import Link from '../edition-link';
import { usePathname } from 'next/navigation';
import { navItems } from '../nav-links';
import { AccountLink } from '../account-link';
export function AtelierHeader() {
  const pathname = usePathname();
  const home = pathname === '/atelier' || pathname === '/atelier/';
  return (
    <header className={`atelier-header${home ? ' on-photo' : ''}`}>
      <Link className="atelier-brand" href="/">
        Molis AI
      </Link>
      <nav className="atelier-navigation" aria-label="主导航">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              pathname?.startsWith('/atelier' + item.href) ? 'page' : undefined
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <details className="atelier-menu">
        <summary>菜单</summary>
        <nav aria-label="移动导航">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) =>
                e.currentTarget.closest('details')?.removeAttribute('open')
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </details>
      <AccountLink />
    </header>
  );
}
export function AtelierFooter() {
  return (
    <footer className="atelier-footer">
      <div className="atelier-footer-invitation">
        <h2>
          下一个想法，
          <br />
          一起做。
        </h2>
        <Link href="/join">和我们聊聊</Link>
      </div>
      <div className="atelier-footer-links">
        <Link className="atelier-brand" href="/">
          Molis AI
        </Link>
        <nav aria-label="继续浏览">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onPointerMove={(event) => {
                if (event.pointerType !== 'mouse') return;
                const r = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.setProperty(
                  '--menu-x',
                  `${event.clientX - r.left}px`,
                );
              }}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div>
          <Link href="/privacy">隐私说明</Link>
          <a
            href="https://github.com/adeptify"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
