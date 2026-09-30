import Link from 'next/link';

const links = [
  { href: '/demos/brand/compare', label: '预览台', id: 'compare' },
  { href: '/demos/brand/vote', label: '投票', id: 'vote' },
] as const;

export function ReviewHeader({ current }: { current: 'compare' | 'vote' }) {
  return (
    <header className="rv-header">
      <Link href="/demos/brand/compare" className="rv-brand">
        Molis AI
        <span>品牌方向评审</span>
      </Link>
      <nav aria-label="评审页面">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            aria-current={current === link.id ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function ReviewFooter() {
  return (
    <footer className="rv-footer">
      <span>Molis AI · 品牌方向评审</span>
      <span>五个方向都是探索稿，文案与产品事实一致，差别在视觉和动效。</span>
    </footer>
  );
}
