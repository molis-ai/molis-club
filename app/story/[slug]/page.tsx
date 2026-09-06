import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import stories from '../../../content/stories.json';
import { Header, Footer } from '../../shell';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: stories.find((s) => s.slug === slug)?.title ?? '文章未找到' };
}
function inline(t: string) {
  return t
    .split(/(\*\*[^*]+\*\*)/g)
    .map((s, i) =>
      s.startsWith('**') ? <strong key={i}>{s.slice(2, -2)}</strong> : s,
    );
}
export default async function Story({ params }: Props) {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug);
  if (!story) notFound();
  return (
    <>
      <Header />
      <main className="reading" id="main">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} /> 回到Molis AI
        </Link>
        <h1>{story.title}</h1>
        <p className="reading-meta">
          一骏 · {story.label} · {Math.ceil(story.body.length / 500)} 分钟阅读
        </p>
        <article className="prose">
          {story.body
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((p, i) =>
              p.startsWith('### ') ? (
                <h3 key={i}>{p.slice(4)}</h3>
              ) : p.startsWith('## ') ? (
                <h2 key={i}>{p.slice(3)}</h2>
              ) : p.startsWith('> ') ? (
                <blockquote key={i}>{inline(p.slice(2))}</blockquote>
              ) : p.trim() === '---' ? (
                <hr key={i} />
              ) : (
                <p key={i}>{inline(p)}</p>
              ),
            )}
        </article>
        <div className="notes">
          <Link
            className="text-link"
            href={slug === 'idealism' ? '/story/human-scale' : '/#works'}
          >
            {slug === 'idealism'
              ? '继续读：人的尺度'
              : '看看这些判断长成了什么'}
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
