import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { folioCommunity } from '../../../content/folio-community';
import { COMMUNITY, HOME } from '../brand/folio/shared';
import './header.css';

// 社区顶栏：社区页和方法详情页共用。锚点写完整路径，在社区页里只是页内跳转，在详情页里回到社区对应的段。

export function CommunityHeader({ current }: { current?: 'methods' }) {
  const { nav } = folioCommunity;
  return (
    <header className="fo-header fcm-header">
      <Link href={HOME} className="fo-logo" aria-label="Molis AI 工作室首页">
        <img src="/images/molis-logo.png" width="36" height="36" alt="" />
        <span>Molis AI</span>
        <span className="fcm-community-label">{nav.label}</span>
      </Link>
      <nav className="fo-nav" aria-label="社区导航">
        {nav.items.map((item) => (
          <a
            key={item.id}
            href={`${COMMUNITY}#${item.id}`}
            aria-current={current === item.id ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <Link href={HOME} className="fcm-back-home">
        {nav.home}
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </header>
  );
}
