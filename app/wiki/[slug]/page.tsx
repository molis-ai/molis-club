import Link from '../../edition-link';
import { notFound } from 'next/navigation';
import {
  isResourceEntry,
  knowledge,
  relatedKnowledge,
} from '../../../content/knowledge';
import { pageMetadata, siteUrl } from '../../../lib/site';
import { EditorialPage, Trail } from '../../editorial';
import { KnowledgeLab } from '../../knowledge-lab';
import { StructuredData } from '../../structured-data';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = knowledge.find((item) => item.slug === slug);
  return entry
    ? pageMetadata(
        `${entry.name} ${entry.english} · ${isResourceEntry(entry) ? '来源与 Prompt' : '演示与 Prompt'}`,
        entry.description,
        `/wiki/${slug}`,
      )
    : { title: '条目未找到', robots: { index: false } };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = knowledge.find((item) => item.slug === slug);
  if (!entry) notFound();
  const resource = isResourceEntry(entry);
  return (
    <EditorialPage className="knowledge-detail">
      <StructuredData
        json={JSON.stringify(
          resource
            ? {
                '@context': 'https://schema.org',
                '@type': 'CreativeWork',
                '@id': `${siteUrl}/wiki/${slug}#resource`,
                name: entry.name,
                alternateName: entry.english,
                description: entry.description,
                url: `${siteUrl}/wiki/${slug}`,
                sameAs: entry.source.url,
                isPartOf: {
                  '@type': 'DefinedTermSet',
                  name: 'Molis Wikipedia',
                  url: `${siteUrl}/wiki`,
                },
              }
            : {
                '@context': 'https://schema.org',
                '@type': 'DefinedTerm',
                '@id': `${siteUrl}/wiki/${slug}#term`,
                name: entry.name,
                alternateName: entry.english,
                description: entry.description,
                url: `${siteUrl}/wiki/${slug}`,
                inDefinedTermSet: {
                  '@type': 'DefinedTermSet',
                  name: 'Molis Wikipedia',
                  url: `${siteUrl}/wiki`,
                },
              },
        )}
      />
      <Trail
        items={[
          { name: '百科', href: '/wiki' },
          { name: entry.name, href: `/wiki/${slug}` },
        ]}
      />
      <header className="knowledge-heading">
        <h1>
          {entry.name}
          <em>{entry.english}</em>
        </h1>
        <p>{entry.description}</p>
      </header>
      <KnowledgeLab entry={entry} />
      <div className="knowledge-reading" id="usage">
        <section>
          <h2>{resource ? '可以重点看什么' : '什么时候使用'}</h2>
          <p>{entry.use}</p>
        </section>
        <section>
          <h2>{resource ? '使用时留意' : '留意这些细节'}</h2>
          <p>{entry.caution}</p>
        </section>
        <aside>
          <h2>参考与整理</h2>
          <p>Molis AI 编辑整理</p>
          <a
            className="edition-link"
            href={entry.source.url}
            target="_blank"
            rel="noreferrer"
          >
            {entry.source.name}
          </a>
          <a
            className="edition-link"
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion"
            target="_blank"
            rel="noreferrer"
          >
            MDN · 减少动态偏好
          </a>
        </aside>
      </div>
      <section className="knowledge-related">
        <h2>接着探索</h2>
        <div>
          {relatedKnowledge(entry).map((item) => (
            <Link key={item.slug} href={`/wiki/${item.slug}`}>
              <span>
                {item.name}
                <em>{item.english}</em>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </EditorialPage>
  );
}
