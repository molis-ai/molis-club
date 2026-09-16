'use client';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

export function editionHref(href: string, prefix: string) {
  if (
    !prefix ||
    !/^\/(?:$|(?:community|wiki|products|solutions|perspectives|works|story|login|join|account|privacy)(?:[/?#]|$))/.test(
      href,
    )
  )
    return href;
  return href === '/' ? prefix : prefix + href;
}
export function useEditionPath() {
  const pathname = usePathname();
  const prefix =
    pathname === '/edition-c' || pathname?.startsWith('/edition-c/')
      ? '/edition-c'
      : pathname === '/atelier' || pathname?.startsWith('/atelier/')
        ? '/atelier'
        : '';
  return (href: string) => editionHref(href, prefix);
}
export default function Link(props: ComponentProps<typeof NextLink>) {
  const path = useEditionPath();
  return (
    <NextLink
      {...props}
      href={typeof props.href === 'string' ? path(props.href) : props.href}
    />
  );
}
