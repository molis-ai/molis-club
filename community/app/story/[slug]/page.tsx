import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import stories from '../../../content/stories.json';
import { Header, Footer } from '../../shell';
import { pageMetadata, siteUrl } from '../../../lib/site';
import { StructuredData } from '../../structured-data';
const descriptions: Record<string, string> = {
  idealism:
    '一骏的自白：从落地与实践出发，讨论想法、行动与自我判断。这也是 Molis AI 创作作品的起点。',
  'human-scale':
    '一骏讲述 AI 时代的理想主义与人的尺度：当机器能够承担更多执行，我们如何决定什么值得做。',
};
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug);
  return story
    ? pageMetadata(story.title, descriptions[slug], `/story/${slug}`)
    : { title: '文章未找到', robots: { index: false } };
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
      <StructuredData
        json={JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: story.title,
          description: descriptions[slug],
          url: `${siteUrl}/story/${slug}`,
          inLanguage: 'zh-CN',
          author: { '@type': 'Person', name: '一骏' },
        })}
      />
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
