import Link from '../../edition-link';
import { notFound } from 'next/navigation';
import { knowledge } from '../../../content/knowledge';
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
        `${entry.name} ${entry.english} · 演示与 Prompt`,
        entry.description,
        `/wiki/${slug}`,
      )
    : { title: '条目未找到', robots: { index: false } };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = knowledge.find((item) => item.slug === slug);
  if (!entry) notFound();
  return (
    <EditorialPage className="knowledge-detail">
      <StructuredData
        json={JSON.stringify({
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
        })}
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
          <h2>什么时候使用</h2>
          <p>{entry.use}</p>
        </section>
        <section>
          <h2>留意这些细节</h2>
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
          {knowledge
            .filter(
              (item) =>
                item.category === entry.category && item.slug !== entry.slug,
            )
            .map((item) => (
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
