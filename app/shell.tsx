import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { AccountLink } from './account-link';
import NavLinks from './nav-links';
export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Molis AI 首页">
        <img src="/images/molis-logo.png" alt="" width="64" height="64" />
        <span className="wordmark">Molis AI</span>
      </Link>
      <nav aria-label="主导航">
        <div className="nav-inline">
          <NavLinks />
        </div>
        <details className="nav-menu">
          <summary>
            <span>菜单</span>
            <Plus size={18} aria-hidden="true" />
          </summary>
          <div className="nav-menu-panel">
            <NavLinks />
          </div>
        </details>
      </nav>
      <AccountLink />
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <p>
          保持好奇。
          <br />
          让想法成为作品。
        </p>
        <Link className="text-link" href="/join">
          从一个想法开始 <ArrowUpRight size={20} />
        </Link>
      </div>
      <Link className="footer-wordmark" href="/">
        Molis AI
      </Link>
      <div className="footer-bottom">
        <span>Molis AI · A community for makers</span>
        <div>
          <Link href="/privacy">隐私说明</Link>
          <a
            href="https://github.com/adeptify"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
