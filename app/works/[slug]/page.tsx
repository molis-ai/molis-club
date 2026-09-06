import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { works } from '../../../content/works';
import { Header, Footer } from '../../shell';
import Notes from '../../notes';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const w = works.find((w) => w.slug === slug);
  return { title: w?.name ?? '作品未找到', description: w?.description };
}
export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const w = works.find((w) => w.slug === slug);
  if (!w) notFound();
  return (
    <>
      <Header />
      <main className="detail-container" id="main">
        <Link className="back-link" href="/#works">
          <ArrowLeft size={16} /> 回到作品现场
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
            <span className="art-bottom">{w.name} · ADEPTIFY</span>
          </div>
        </section>
        <section className="detail-body">
          <div>
            <h2>为什么想做它</h2>
            <p>{w.why}</p>
            <h2>现在走到了哪里</h2>
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
