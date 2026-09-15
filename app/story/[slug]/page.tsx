import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import stories from '../../../content/stories.json';
import { pageMetadata, siteUrl } from '../../../lib/site';
import { StructuredData } from '../../structured-data';
import { EditorialPage, Trail } from '../../editorial';
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
  if (!story) return { title: '观点未找到', robots: { index: false } };
  const meta = pageMetadata(story.title, descriptions[slug], `/story/${slug}`);
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: 'article',
      authors: [`${siteUrl}/community/yijun`],
    },
  };
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
  const paragraphs = story.body
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((raw) => raw.trim());
  const headings = paragraphs.flatMap((text, index) =>
    text.startsWith('## ')
      ? [{ text: text.slice(3), id: `section-${index}` }]
      : [],
  );
  return (
    <EditorialPage className="essay-page">
      <StructuredData
        json={JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: story.title,
          description: descriptions[slug],
          url: `${siteUrl}/story/${slug}`,
          mainEntityOfPage: `${siteUrl}/story/${slug}`,
          inLanguage: 'zh-CN',
          author: {
            '@type': 'Person',
            '@id': `${siteUrl}/community/yijun#identity`,
            name: '一骏',
            url: `${siteUrl}/community/yijun`,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Molis AI',
            url: siteUrl,
          },
          articleSection: '观点',
        })}
      />
      <div className="essay-progress" aria-hidden="true" />
      <Trail
        items={[
          { name: '观点', href: '/perspectives' },
          { name: story.title, href: `/story/${slug}` },
        ]}
      />
      <header className="essay-opening">
        <h1>{story.title}</h1>
        <p>{descriptions[slug]}</p>
        <div className="essay-meta">
          <Link href="/community/yijun">一骏</Link>
          <span>{story.label}</span>
          <span>{Math.ceil(story.body.length / 500)} 分钟阅读</span>
        </div>
      </header>
      <div className="essay-layout">
        <nav className="essay-toc" aria-label="本篇目录">
          <span>本篇目录</span>
          <a href="#essay-body">从头开始</a>
          {headings.map((heading) => (
            <a href={`#${heading.id}`} key={heading.id}>
              {heading.text}
            </a>
          ))}
        </nav>
        <article className="essay-body" id="essay-body">
          {paragraphs.map((p, i) => {
            if (p.startsWith('### '))
              return (
                <h3 key={i} id={`section-${i}`}>
                  {p.slice(4)}
                </h3>
              );
            if (p.startsWith('## '))
              return (
                <h2 key={i} id={`section-${i}`}>
                  {p.slice(3)}
                </h2>
              );
            if (p.startsWith('> '))
              return (
                <blockquote key={i}>
                  {inline(p.replace(/^>\s?/gm, ''))}
                </blockquote>
              );
            if (p === '---') return <hr key={i} />;
            return <p key={i}>{inline(p)}</p>;
          })}
        </article>
      </div>
      <div className="essay-next">
        <Link
          className="edition-link"
          href={slug === 'idealism' ? '/story/human-scale' : '/story/idealism'}
        >
          {slug === 'idealism' ? '接着读：人的尺度' : '接着读：落地主义'}
          <ArrowRight size={17} />
        </Link>
      </div>
    </EditorialPage>
  );
}
