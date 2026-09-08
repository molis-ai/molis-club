import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, ArrowDown } from 'lucide-react';
import { works } from '../../../content/works';
import { Header, Footer } from '../../shell';
import Notes from '../../notes';
import { WorkIdentity, SolutionPath } from '../../work-presentation';
import '../../inner-pages.css';
import '../../scroll-scenes.css';
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
        <section className="work-scroll-book">
          <div className="work-book-heading">
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
            <p className="work-book-cue">
              <ArrowDown size={17} /> 往下读，一页页认识它。
            </p>
          </div>
          <div className="work-paper-stack">
            <article className="work-paper work-paper-origin">
              <h2>为什么想做它</h2>
              <p>{w.why}</p>
              <div>
                <span>Adeptify 团队</span>
                <em>{w.english}</em>
              </div>
            </article>
            <article className="work-paper work-paper-audience">
              <h2>它为谁而做</h2>
              <p>{w.audience}</p>
              <div>
                <span>它关心的事</span>
                <span>{w.category}</span>
              </div>
            </article>
            <article className="work-paper work-paper-state">
              <h2>
                {w.category === 'Solutions'
                  ? '当前阶段与边界'
                  : '现在走到了哪里'}
              </h2>
              <p>{w.detail}</p>
              {w.category === 'Solutions' && <SolutionPath slug={w.slug} />}
              <div>
                <span>{w.status}</span>
                <span>{w.source}</span>
              </div>
            </article>
          </div>
        </section>
        <div className="work-book-afterword">
          <p>技术在生长，人的尺度始终在场。</p>
          <Link href="/story/human-scale">
            读我们的故事 <ArrowUpRight size={17} />
          </Link>
        </div>
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
