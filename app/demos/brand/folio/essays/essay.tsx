'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import stories from '../../../../../content/stories.json';
import {
  folioEssayAuthor,
  folioEssayLinks,
  folioStudio,
} from '../../../../../content/folio';
import { lineNames } from '../../../../../content/studio';
import { pad } from '../kit';
import {
  ABOUT,
  Footer,
  HOME,
  ESSAYS,
  SiteHeader,
  essayHref,
  lineHref,
  lineIds,
  lineLine,
  useFolioMotion,
} from '../shared';
import '../folio.css';
import './essays.css';

// Folio 的文章阅读页：刊头式开篇，正文是一张压上来的白纸，左边目录粘住；封底接着读另一篇。
// 署名链到作者的公众号；封底除了接着读，还能去看产品、认识团队、去公众号读更多。
// 《落地主义》末尾接回产品：文章里说的「找到同频的人」，在四条产品线里的样子。只用现有一句话，不新写产品声明。
const closingWorks = ['idealism'];

// 原文在 content/stories.json，按空行分段，支持小标题、引文、分隔线、编号列表与粗体、斜体。

/** 行内的 **粗体** 和 *斜体* */
function inline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .map((part, index) =>
      part.startsWith('**') ? (
        <strong key={index}>{part.slice(2, -2)}</strong>
      ) : part.startsWith('*') && part.length > 2 ? (
        <em key={index}>{part.slice(1, -1)}</em>
      ) : (
        part
      ),
    );
}

function Block({ text, id }: { text: string; id: string }) {
  if (text.startsWith('### ')) return <h3 id={id}>{text.slice(4)}</h3>;
  if (text.startsWith('## ')) return <h2 id={id}>{text.slice(3)}</h2>;
  if (text.startsWith('> '))
    return <blockquote>{inline(text.replace(/^>\s?/gm, ''))}</blockquote>;
  if (text === '---') return <hr />;
  if (/^\d+\. /.test(text))
    return (
      <ol>
        {text.split('\n').map((item) => (
          <li key={item}>{inline(item.replace(/^\d+\.\s*/, ''))}</li>
        ))}
      </ol>
    );
  return <p>{inline(text)}</p>;
}

export function Essay({ slug }: { slug: string }) {
  const rootRef = useFolioMotion();
  const { essays } = folioStudio;
  const index = essays.items.findIndex((item) => item.slug === slug);
  const item = essays.items[index];
  const story = stories.find((entry) => entry.slug === slug)!;
  const [title, subtitle] = story.title.split('：');
  const blocks = story.body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const headings = blocks.flatMap((text, at) =>
    text.startsWith('## ')
      ? [{ text: text.slice(3), id: `section-${at}` }]
      : [],
  );
  const next = essays.items[(index + 1) % essays.items.length];
  const nextStory = stories.find((entry) => entry.slug === next.slug)!;
  const [nextTitle, nextSubtitle] = nextStory.title.split('：');

  return (
    <div className="fo-site fo-essay-page" ref={rootRef}>
      <SiteHeader current="essays" />

      <main id="main">
        <header className="fo-read-opening">
          <div className="fo-read-meta">
            <span className="fo-read-number" aria-hidden="true">
              {pad(index)}
            </span>
            <Link href={ESSAYS}>
              {folioStudio.labels.essays.en} · {folioStudio.labels.essays.zh}
            </Link>
          </div>
          <h1 id="fo-read-title">
            <span className="fo-read-title">{title}</span>
            {subtitle ? (
              <span className="fo-read-subtitle">{subtitle}</span>
            ) : null}
          </h1>
          <p className="fo-read-lead">{item.description}</p>
          <p className="fo-read-byline">
            <a
              className="fo-read-author"
              href={folioEssayAuthor.href}
              target="_blank"
              rel="noreferrer"
              aria-label={essays.author + folioEssayAuthor.labelSuffix}
            >
              {essays.author}
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <span>{story.label}</span>
            <span>
              {Math.ceil(story.body.length / 500)} {essays.read}
            </span>
          </p>
        </header>

        <div className="fo-read-sheet">
          <nav className="fo-read-toc" aria-label="本篇目录">
            <span>本篇目录</span>
            <ol>
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="fo-read-body" aria-labelledby="fo-read-title">
            {blocks.map((text, at) => (
              <Block key={at} text={text} id={`section-${at}`} />
            ))}
            {closingWorks.includes(slug) && (
              <section
                className="fo-read-works"
                aria-labelledby="fo-read-works-title"
              >
                <h2 id="fo-read-works-title">这个想法，在我们的产品里</h2>
                <p>不是要证明谁更好，而是看看谁会被它认出来。</p>
                <ul>
                  {lineIds.map((id) => (
                    <li key={id}>
                      <Link href={lineHref[id]}>
                        <strong>{lineNames[id]}</strong>
                        <span>{lineLine[id]}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </div>
      </main>

      <Footer>
        <section className="fo-read-next" aria-labelledby="fo-read-next-title">
          <small>{essays.next}</small>
          <Link href={essayHref(next.slug)} className="fo-read-next-link">
            <h2 id="fo-read-next-title">
              <span className="fo-phrase">{nextTitle}</span>
              {nextSubtitle ? <small>{nextSubtitle}</small> : null}
            </h2>
            <span className="fo-read-next-go" aria-hidden="true">
              <ArrowUpRight size={26} />
            </span>
          </Link>
          <div className="fo-read-links">
            <Link href={`${HOME}#products`} className="fo-read-home">
              {folioEssayLinks.products}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <Link href={ABOUT} className="fo-read-home">
              {folioEssayLinks.team}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <a
              href={folioEssayAuthor.href}
              className="fo-read-home"
              target="_blank"
              rel="noreferrer"
            >
              {folioEssayAuthor.more}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <Link href={HOME} className="fo-read-home">
              {essays.back}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </Footer>
    </div>
  );
}
