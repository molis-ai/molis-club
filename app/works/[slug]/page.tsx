import Link from '../../edition-link';
import { notFound } from 'next/navigation';
import { works } from '../../../content/works';
import Notes from '../../notes';
import { WorkIdentity, SolutionPath } from '../../work-presentation';
import { pageMetadata, siteUrl } from '../../../lib/site';
import { StructuredData } from '../../structured-data';
import { EditorialPage, Trail } from '../../editorial';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const w = works.find((work) => work.slug === slug);
  return w
    ? pageMetadata(`${w.name} · ${w.title}`, w.description, `/works/${w.slug}`)
    : { title: '作品未找到', robots: { index: false } };
}
export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const w = works.find((work) => work.slug === slug);
  if (!w) notFound();
  const isSolution = w.category === 'Solutions';
  return (
    <EditorialPage className="work-detail-page">
      <StructuredData
        json={JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: w.name,
          headline: w.title,
          description: w.description,
          url: `${siteUrl}/works/${w.slug}`,
          creativeWorkStatus: w.status,
          inLanguage: 'zh-CN',
          creator: {
            '@type': 'Organization',
            '@id': `${siteUrl}/community/adeptify#identity`,
            name: 'Adeptify',
            url: `${siteUrl}/community/adeptify`,
          },
          audience: { '@type': 'Audience', audienceType: w.audience },
          ...(w.url ? { sameAs: w.url } : {}),
        })}
      />
      <Trail
        items={[
          {
            name: isSolution ? '解决方案' : '产品',
            href: isSolution ? '/solutions' : '/products',
          },
          { name: w.name, href: `/works/${w.slug}` },
        ]}
      />
      <section className="work-detail-opening">
        <div>
          <WorkIdentity work={w} />
          <h1>{w.title}</h1>
          <p className="work-summary">{w.description}</p>
          <div className="work-detail-actions">
            {w.url ? (
              <a
                className="edition-button"
                href={w.url}
                target="_blank"
                rel="noreferrer"
              >
                {w.action}
              </a>
            ) : (
              <a className="edition-button" href="#feedback">
                聊聊这个想法
              </a>
            )}
            <span>{w.status}</span>
          </div>
        </div>
        <aside className="work-detail-origin">
          <h2>为什么想做它</h2>
          <p>{w.why}</p>
          <Link className="edition-link" href="/community/adeptify">
            Adeptify 团队
          </Link>
          <em>{w.english}</em>
        </aside>
      </section>
      {isSolution && <SolutionPath slug={w.slug} />}
      <section className="work-detail-reading">
        <div>
          <section>
            <h2>它为谁而做</h2>
            <p>{w.audience}</p>
          </section>
          <section>
            <h2>{isSolution ? '当前阶段与边界' : '现在可以做什么'}</h2>
            <p>{w.detail}</p>
          </section>
        </div>
        <aside>
          <h2>关于这件作品</h2>
          <dl>
            <div>
              <dt>创作者</dt>
              <dd>
                <Link href="/community/adeptify">Adeptify 团队</Link>
              </dd>
            </div>
            <div>
              <dt>关心的事</dt>
              <dd>{w.category}</dd>
            </div>
            <div>
              <dt>当前阶段</dt>
              <dd>{w.status}</dd>
            </div>
            <div>
              <dt>内容依据</dt>
              <dd>{w.source}</dd>
            </div>
          </dl>
        </aside>
      </section>
      <section
        className="work-detail-feedback"
        id="feedback"
        aria-label="关于作品的讨论"
      >
        <div>
          <em>Still becoming.</em>
          <p>
            作品还在生长。
            <br />
            你的感受，也是下一步的线索。
          </p>
        </div>
        <Notes key={w.slug} work={w.slug} question={w.question} />
      </section>
      <section className="edition-closing">
        <Link
          className="edition-link"
          href={isSolution ? '/solutions' : '/products'}
        >
          继续发现{isSolution ? '解决方案' : '其他产品'}
        </Link>
        <Link className="edition-link" href="/community">
          回到社区
        </Link>
      </section>
    </EditorialPage>
  );
}
