'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { folioCommunity } from '../../../../../../content/folio-community';
import { COMMUNITY, METHODS, pad } from '../../routes';
import { Status } from '../../shell';
import './detail.css';

// 方法详情（条目与艺术家 Skill）共用：「社区 / 方法」位置、开篇（名字、英文名、一句定义）和页尾的接着看。
// 阅读模式：先把它是什么说清楚，再看示例与 Prompt，然后是怎么用、留意什么。

export function DetailOpening({
  name,
  english,
  description,
  tags,
}: {
  name: string;
  english: string;
  description: string;
  tags: string[];
}) {
  return (
    <header className="ecd-opening">
      <nav className="ecd-trail" aria-label="位置">
        <Link href={COMMUNITY}>{folioCommunity.detail.community}</Link>
        <span aria-hidden="true">/</span>
        <Link href={METHODS}>{folioCommunity.detail.methods}</Link>
      </nav>
      <h1>
        <span>{name}</span>
        <em lang="en">{english}</em>
      </h1>
      <div className="ecd-define">
        <p>{description}</p>
        <Status items={tags} label="分类" />
      </div>
    </header>
  );
}

export function DetailRelated({
  title,
  items,
}: {
  title: string;
  items: { slug: string; name: string; english: string; href: string }[];
}) {
  return (
    <section className="ecd-related" aria-labelledby="ecd-related-title">
      <h2 id="ecd-related-title">{title}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.slug}>
            <Link href={item.href}>
              <i aria-hidden="true">{pad(index)}</i>
              <strong>{item.name}</strong>
              <em lang="en">{item.english}</em>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 阅读段落：编号 + 小标题 + 正文 */
export function ReadingBlock({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="ecd-block" data-reveal>
      <span className="ecd-no" aria-hidden="true">
        {pad(index)}
      </span>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
