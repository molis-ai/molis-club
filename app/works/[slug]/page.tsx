import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { works } from '../../../content/works';
import { Header, Footer } from '../../shell';
import Notes from '../../notes';
import { pageMetadata, siteUrl } from '../../../lib/site';
import { StructuredData } from '../../structured-data';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const w = works.find((w) => w.slug === slug);
  return w
    ? pageMetadata(`${w.name} · ${w.title}`, w.description, `/works/${w.slug}`)
    : { title: '作品未找到', robots: { index: false } };
}
export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const w = works.find((w) => w.slug === slug);
  if (!w) notFound();
  return (
    <>
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
          creator: { '@type': 'Organization', name: 'Adeptify' },
          audience: { '@type': 'Audience', audienceType: w.audience },
          ...(w.url ? { sameAs: w.url } : {}),
        })}
      />
      <Header />
      <main className="detail-container" id="main">
        <Link
          className="back-link"
          href={w.category === 'Solutions' ? '/solutions' : '/products'}
        >
          <ArrowLeft size={16} />{' '}
          {w.category === 'Solutions' ? '回到 Solutions' : '回到 Products'}
        </Link>
        <section className="detail-hero">
          <div>
            <div className="detail-name">
              {w.name} <span className="status">{w.status}</span>
            </div>
            <h1>{w.title}</h1>
            <p>{w.description}</p>
            {w.url ? (
              <a
                className="button primary"
                href={w.url}
                target="_blank"
                rel="noreferrer"
              >
                {w.action}
                <ArrowUpRight size={17} />
              </a>
            ) : (
              <a className="text-link" href="#feedback">
                先和我们聊聊这个想法 <ArrowUpRight size={17} />
              </a>
            )}
          </div>
          <div className={`work-art ${w.tone}`}>
            <div className="art-top">{w.english}</div>
            <span className="work-symbol">{w.symbol}</span>
            <span className="art-bottom">{w.name} · MOLIS AI</span>
          </div>
        </section>
        <section className="detail-body">
          <div>
            <h2>适合什么场景</h2>
            <p>{w.audience}</p>
            <h2>为什么想做它</h2>
            <p>{w.why}</p>
            <h2>
              {w.category === 'Solutions' ? '当前阶段与边界' : '现在走到了哪里'}
            </h2>
            <p>{w.detail}</p>
          </div>
          <aside>
            <strong>做东西的人</strong>
            <p>Adeptify 团队</p>
            <strong>它关心的事</strong>
            <p>{w.category}</p>
            <strong>内容依据</strong>
            <p>{w.source}</p>
            <Link className="text-link" href="/story/human-scale">
              读我们的故事 <ArrowUpRight size={15} />
            </Link>
          </aside>
        </section>
        <div id="feedback">
          <Notes work={w.slug} question={w.question} />
        </div>
      </main>
      <Footer />
    </>
  );
}
