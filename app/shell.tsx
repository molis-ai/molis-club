import Link from 'next/link';
import { ArrowUpRight, Sprout } from 'lucide-react';
export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="烤个梨呀首页">
        <span className="brand-mark">
          <Sprout size={25} />
        </span>
        <span>
          烤个梨呀<small>ROAST PEAR</small>
        </span>
      </Link>
      <nav aria-label="主导航">
        <Link href="/#works">看作品</Link>
        <Link href="/#people">认识我们</Link>
        <Link href="/story/human-scale">为什么做</Link>
        <Link href="/#tools">开发工具</Link>
      </nav>
      <Link className="header-join" href="/join">
        带个想法来 <ArrowUpRight size={17} />
      </Link>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">
          烤个梨呀<span>由 Adeptify 发起</span>
        </Link>
        <p>创造是日用品，见证是必需品。</p>
      </div>
      <div className="footer-links">
        <Link href="/story/idealism">一份自白</Link>
        <Link href="/story/human-scale">我们的故事</Link>
        <a href="https://github.com/adeptify" target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight size={14} />
        </a>
      </div>
      <small>© 2026 Adeptify · 私有试用版</small>
    </footer>
  );
}
