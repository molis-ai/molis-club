import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Work } from '../content/works';
import { siteUrl } from '../lib/site';
import { Header, Footer } from './shell';
import { StructuredData } from './structured-data';
import { WorkIdentity } from './work-presentation';
import EditorialMotion from './editorial-motion';
import './editorial.css';

export function EditorialPage({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <Header />
      <EditorialMotion className={`edition ${className}`}>
        {children}
      </EditorialMotion>
      <Footer />
    </>
  );
}
export function Opening({
  title,
  english,
  children,
}: {
  title: string;
  english: string;
  children: ReactNode;
}) {
  return (
    <header className="edition-opening">
      <h1>
        {title}
        <em>{english}</em>
      </h1>
      <div className="edition-intro">{children}</div>
    </header>
  );
}
export function Trail({ items }: { items: { name: string; href: string }[] }) {
  return (
    <>
      <nav className="edition-trail" aria-label="面包屑">
        <Link href="/">首页</Link>
        {items.map((item, i) => (
          <span key={item.href}>
            <span aria-hidden="true">/</span>
            {i === items.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.href}>{item.name}</Link>
            )}
          </span>
        ))}
      </nav>
      <StructuredData
        json={JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [{ name: '首页', href: '/' }, ...items].map(
            (item, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: item.name,
              item: `${siteUrl}${item.href}`,
            }),
          ),
        })}
      />
    </>
  );
}
export function CollectionData({
  name,
  path,
  items,
}: {
  name: string;
  path: string;
  items: { name: string; path: string; description?: string }[];
}) {
  return (
    <StructuredData
      json={JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name,
        url: `${siteUrl}${path}`,
        inLanguage: 'zh-CN',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            url: `${siteUrl}${item.path}`,
            ...(item.description ? { description: item.description } : {}),
          })),
        },
      })}
    />
  );
}
export function WorkRow({
  work,
  author = false,
}: {
  work: Work;
  author?: boolean;
}) {
  return (
    <article className="edition-work" data-work={work.slug}>
      <Link className="edition-work-link" href={`/works/${work.slug}`}>
        <WorkIdentity work={work} />
        <h3>{work.title}</h3>
        <span className="edition-work-foot">
          <span>{work.status}</span>
        </span>
      </Link>
      {author && (
        <Link className="edition-author" href="/community/adeptify">
          Adeptify <ArrowRight size={14} />
        </Link>
      )}
    </article>
  );
}
export function Invitation({
  title = '带着一个想法来。',
  text = '分享你正在做的作品，或聊聊你想解决的那个问题。',
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="edition-invitation">
      <h2>{title}</h2>
      <div>
        <p>{text}</p>
        <Link className="edition-link" href="/join">
          和我们聊聊
        </Link>
      </div>
    </section>
  );
}
