'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  isResourceEntry,
  knowledge,
  relatedKnowledge,
} from '../../../../../../../content/knowledge';
import { folioWiki } from '../../../../../../../content/folio';
import { folioCommunity } from '../../../../../../../content/folio-community';
import { Shell, pad } from '../../../kit';
import { COMMUNITY, METHODS, methodHref } from '../../../routes';
import { FwLab } from '../demos';
import '../methods.css';

// 方法条目（原百科条目，现属社区）：开篇写清它是什么；白纸上是示例和 Prompt；再讲什么时候用、留意什么；
// 封底接着探索同类条目。顶栏用社区顶栏，位置是「社区 / 方法」。

export function MethodEntry({ slug }: { slug: string }) {
  const entry = knowledge.find((item) => item.slug === slug)!;
  const resource = isResourceEntry(entry);
  const kind = resource ? 'resource' : 'technique';
  const t = folioWiki.entry;
  return (
    <Shell
      current="community"
      className="g-com-root g-mth-page"
      ending={<EntryEnding slug={slug} />}
    >
      <header className="g-mth-opening">
        <nav className="g-mth-trail" aria-label="位置">
          <Link href={COMMUNITY}>{folioCommunity.detail.community}</Link>
          <span aria-hidden="true">/</span>
          <Link href={METHODS}>{folioCommunity.detail.methods}</Link>
        </nav>
        <h1>
          <span>{entry.name}</span>
          <em lang="en">{entry.english}</em>
        </h1>
        <p>{entry.description}</p>
      </header>

      <section
        className="g-com-section"
        data-bg="white"
        aria-label={resource ? `${entry.name}的来源` : `${entry.name}的示例`}
      >
        <FwLab entry={entry} />
      </section>

      <section
        id="usage"
        className="g-com-section"
        data-bg="paper"
        aria-label="用法与边界"
      >
        <div className="g-mth-reading">
          <section>
            <h2>{t.use[kind]}</h2>
            <p>{entry.use}</p>
          </section>
          <section>
            <h2>{t.caution[kind]}</h2>
            <p>{entry.caution}</p>
          </section>
          <aside>
            <h2>{t.source}</h2>
            <p>{t.editor}</p>
            <a href={entry.source.url} target="_blank" rel="noreferrer">
              {entry.source.name}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion"
              target="_blank"
              rel="noreferrer"
            >
              {t.reduced}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </section>
    </Shell>
  );
}

/** 封底：接着探索同类的方法 */
function EntryEnding({ slug }: { slug: string }) {
  const entry = knowledge.find((item) => item.slug === slug)!;
  const t = folioWiki.entry;
  return (
    <section className="g-mth-related" aria-labelledby="g-mth-related-title">
      <h2 id="g-mth-related-title">{t.related}</h2>
      <ul>
        {relatedKnowledge(entry).map((item, index) => (
          <li key={item.slug}>
            <Link href={methodHref(item.slug)}>
              <span className="g-com-index" aria-hidden="true">
                {pad(index)}
              </span>
              <strong>{item.name}</strong>
              <em lang="en">{item.english}</em>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
