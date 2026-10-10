'use client';
import Link from 'next/link';
import { Footer, HOME, SiteHeader, useFolioMotion, type Vars } from './shared';
import './folio.css';
import './kit.css';
import './missing.css';

// Folio 的 404：刊头大字换成 404，中间的 0 和 Molis 的 o 一样斜着、染成杏橙
export default function FolioNotFound() {
  const rootRef = useFolioMotion();
  return (
    <div className="fo-site" ref={rootRef}>
      <SiteHeader />
      <main id="main" className="fm-missing">
        <div className="fo-hero-mast fm-mast" aria-hidden="true" lang="en">
          {Array.from('404').map((digit, index) => (
            <span key={index} style={{ '--i': index } as Vars}>
              {digit}
            </span>
          ))}
        </div>
        <h1>这里还没长出东西。</h1>
        <p>这个页面不存在，或者已经换了地方。</p>
        <div className="fo-actions">
          <Link className="fo-btn fo-btn-ink" href={HOME}>
            回到首页
          </Link>
          <Link className="fo-btn fo-btn-ghost" href={`${HOME}#products`}>
            看看我们的产品
          </Link>
        </div>
      </main>
      <Footer tone="paper" compact />
    </div>
  );
}
