'use client';
import Link from '../edition-link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AccountLink } from '../account-link';
import { navItems } from '../nav-links';
const menuGroups = [
  {
    id: 'work',
    label: '作品',
    items: [
      {
        label: '产品',
        href: '/products',
        description: '从一个小问题开始的作品。',
      },
      {
        label: '解决方案',
        href: '/solutions',
        description: '让 AI 参与具体的工作。',
      },
    ],
  },
  {
    id: 'explore',
    label: '探索',
    items: [
      {
        label: '百科',
        href: '/wiki',
        description: '网页、动效与可带走的 Prompt。',
      },
      {
        label: 'Artist Skill',
        href: '/wiki/artists',
        description: '艺术家的观看与创作方法。',
      },
      {
        label: '观点',
        href: '/perspectives',
        description: '关于 AI、产品与创作。',
      },
    ],
  },
];
function CNavigation({ path }: { path: string | undefined }) {
  const [open, setOpen] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent | FocusEvent) => {
      if (!nav.current?.contains(event.target as Node)) setOpen(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(null);
      triggers.current[open]?.focus();
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  return (
    <nav className="c-primary-nav" aria-label="栏目导航" ref={nav}>
      {menuGroups.map((group) => (
        <div className="c-nav-group" key={group.id}>
          <button
            type="button"
            className="c-nav-trigger"
            aria-expanded={open === group.id}
            aria-controls={`c-navigation-${group.id}`}
            ref={(el) => {
              triggers.current[group.id] = el;
            }}
            onClick={() =>
              setOpen((current) => (current === group.id ? null : group.id))
            }
          >
            {group.label}
          </button>
          <div
            className="c-nav-panel"
            id={`c-navigation-${group.id}`}
            hidden={open !== group.id}
          >
            {group.items.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                aria-current={path === item.href ? 'page' : undefined}
                onClick={() => setOpen(null)}
              >
                <span>{item.label}</span>
                <small>{item.description}</small>
              </Link>
            ))}
          </div>
        </div>
      ))}
      <Link
        className="c-top-link"
        href="/community"
        aria-current={path?.startsWith('/community') ? 'page' : undefined}
      >
        社区
      </Link>
    </nav>
  );
}
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
      <CNavigation key={pathname} path={path} />
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
