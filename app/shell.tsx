import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { AccountLink } from './account-link';
export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="molis-club首页">
        <img src="/images/molis-logo.png" alt="" width="64" height="64" />
        <span className="wordmark">molis-club</span>
      </Link>
      <nav aria-label="主导航">
        <Link href="/products">Products</Link>
        <Link href="/solutions">Solutions</Link>
        <Link className="secondary-nav" href="/#studio">
          Studio
        </Link>
        <Link className="secondary-nav" href="/#journal">
          Journal
        </Link>
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
        molis-club
      </Link>
      <div className="footer-bottom">
        <span>molis-club · A community for makers</span>
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
