'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  isResourceEntry,
  knowledge,
  relatedKnowledge,
  resourceGroupLabels,
} from '../../../../../../content/knowledge';
import { folioWiki } from '../../../../../../content/folio';
import { pad } from '../../kit';
import {
  Footer,
  SiteHeader,
  WIKI,
  useFolioMotion,
  wikiHref,
} from '../../shared';
import { FwLab } from '../demos';
import '../../folio.css';
import '../../kit.css';
import '../wiki.css';

// 百科条目：开篇写清它是什么；白纸上是示例和 Prompt；再讲什么时候用、留意什么；封底接着探索同类条目。

export function WikiEntry({ slug }: { slug: string }) {
  const rootRef = useFolioMotion();
  const entry = knowledge.find((item) => item.slug === slug)!;
  const resource = isResourceEntry(entry);
  const kind = resource ? 'resource' : 'technique';
  const t = folioWiki.entry;
  return (
    <div className="fo-site" ref={rootRef}>
      <SiteHeader />
      <main id="main">
        <header className="fw-opening">
          <nav className="fw-trail" aria-label="位置">
            <Link href={WIKI}>{t.back}</Link>
            <span aria-hidden="true">/</span>
            <Link href={`${WIKI}#entries`}>
              {resource
                ? resourceGroupLabels[entry.group].title
                : entry.category}
            </Link>
          </nav>
          <h1>
            <span>{entry.name}</span>
            <em lang="en">{entry.english}</em>
          </h1>
          <p>{entry.description}</p>
        </header>

        <section
          className="fo-section"
          data-bg="white"
          aria-label={resource ? `${entry.name}的来源` : `${entry.name}的示例`}
        >
          <FwLab entry={entry} />
        </section>

        <section
          id="usage"
          className="fo-section"
          data-bg="paper"
          aria-label="用法与边界"
        >
          <div className="fw-reading">
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
      </main>

      <Footer tone="paper">
        <section className="fw-related" aria-labelledby="fw-related-title">
          <h2 id="fw-related-title">{t.related}</h2>
          <ul>
            {relatedKnowledge(entry).map((item, index) => (
              <li key={item.slug}>
                <Link href={wikiHref(item.slug)}>
                  <span className="fo-index" aria-hidden="true">
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
      </Footer>
    </div>
  );
}
