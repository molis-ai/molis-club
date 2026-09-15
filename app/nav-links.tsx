'use client';
import Link from 'next/link';
import './nav-links.css';
import { usePathname } from 'next/navigation';
export const navItems = [
  { href: '/community', label: '社区' },
  { href: '/wiki', label: '百科' },
  { href: '/products', label: '产品' },
  { href: '/solutions', label: '解决方案' },
  { href: '/perspectives', label: '观点' },
];
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={
            pathname === item.href ||
            pathname?.startsWith(`${item.href}/`) ||
            (item.href === '/perspectives' && pathname?.startsWith('/story/'))
              ? 'page'
              : undefined
          }
          onClick={(event) =>
            event.currentTarget.closest('details')?.removeAttribute('open')
          }
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
