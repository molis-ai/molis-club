import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { works } from '../../../content/works';
import { Header, Footer } from '../../shell';
import Notes from '../../notes';
import { WorkIdentity, SolutionPath } from '../../work-presentation';
import '../../inner-pages.css';
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
      <main
        className={`work-page inner-width${w.category === 'Solutions' ? ' work-page-solution' : ''}`}
        id="main"
      >
        <Link
          className="back-link"
          href={w.category === 'Solutions' ? '/solutions' : '/products'}
        >
          <ArrowLeft size={16} />{' '}
          {w.category === 'Solutions' ? '全部解决方案' : '全部作品'}
        </Link>
        <section className="work-opening">
          <div className="work-opening-main">
            <WorkIdentity work={w} />
            <h1>{w.title}</h1>
            <p>{w.description}</p>
            <div className="work-opening-actions">
              {w.url ? (
                <a
                  className="inner-action"
                  href={w.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {w.action}
                  <ArrowUpRight size={18} />
                </a>
              ) : (
                <a className="inner-action" href="#feedback">
                  聊聊这个想法 <ArrowUpRight size={18} />
                </a>
              )}
              <span>{w.status}</span>
            </div>
          </div>
          <aside className="work-origin">
            <h2>为什么想做它</h2>
            <p>{w.why}</p>
            <div>
              <span>Adeptify 团队</span>
              <em>{w.english}</em>
            </div>
          </aside>
        </section>
        {w.category === 'Solutions' && (
          <section className="work-approach" aria-label="方案的示意路径">
            <SolutionPath slug={w.slug} />
          </section>
        )}
        <section className="work-reading-grid">
          <div className="work-context">
            <section>
              <h2>它为谁而做</h2>
              <p>{w.audience}</p>
            </section>
            <section>
              <h2>
                {w.category === 'Solutions'
                  ? '当前阶段与边界'
                  : '现在走到了哪里'}
              </h2>
              <p>{w.detail}</p>
            </section>
          </div>
          <aside className="work-facts">
            <h2>关于这件作品</h2>
            <dl>
              <div>
                <dt>创作者</dt>
                <dd>Adeptify 团队</dd>
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
            <Link className="text-link" href="/story/human-scale">
              读我们的故事 <ArrowUpRight size={16} />
            </Link>
          </aside>
        </section>
        <section
          className="work-conversation"
          id="feedback"
          aria-label="关于作品的讨论"
        >
          <div className="work-conversation-intro">
            <em>Still becoming.</em>
            <p>
              作品还在生长。
              <br />
              你的感受，也是下一步的线索。
            </p>
          </div>
          <Notes key={w.slug} work={w.slug} question={w.question} />
        </section>
        <div className="work-return">
          <Link href={w.category === 'Solutions' ? '/solutions' : '/products'}>
            <ArrowLeft size={17} />
            继续逛逛{w.category === 'Solutions' ? '解决方案' : '其他作品'}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
