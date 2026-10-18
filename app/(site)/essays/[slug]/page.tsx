import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata, siteUrl } from '../../../../lib/site';
import {
  AUTHOR,
  essayLength,
  essayUi,
  excerpts,
  findEssay,
  nextEssay,
  splitTitle,
} from '../../../../content/site/essays';
import { ESSAYS, essayHref } from '../../../_site/routes';
import { More, type Vars } from '../../../_site/ui';
import { RoomMeta } from '../../../_site/exhibit/exhibit';
import { EssayBlocks, parseEssay } from '../markdown';
import { ReadingProgress } from '../progress';
import '../essays.css';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = findEssay(slug);
  if (!story) return { title: essayUi.notFound, robots: { index: false } };
  const meta = pageMetadata(
    story.title,
    excerpts[slug] ?? story.title,
    essayHref(slug),
  );
  return {
    ...meta,
    authors: [{ name: AUTHOR }],
    openGraph: { ...meta.openGraph, type: 'article', authors: [AUTHOR] },
  };
}

function Title({ title, as: Tag }: { title: string; as: 'h1' | 'span' }) {
  const { main, sub } = splitTitle(title);
  return (
    <Tag className="m-essay-title">
      <span className="m-essay-main">{main}</span>
      {sub ? (
        <>
          <span className="sr-only">：</span>
          <span className="m-essay-sub">{sub}</span>
        </>
      ) : null}
    </Tag>
  );
}

// 文章页：阅读版式。约 35 个汉字一行（阅读栏 40rem、--t-read 字号）、行距 2；
// 左两栏是本篇目录（宽屏时贴着走），顶栏下一条细细的阅读进度线；没有配图、没有视差。
// 仍在展厅 03「文章」里：同一面月白的墙、同一块名牌，标题用展厅的字阶（负责人 2026-10-16 定）。
// 打印时只留标题与正文（署名跟着标题），链接后面写出地址。
export default async function EssayPage({ params }: Props) {
  const { slug } = await params;
  const story = findEssay(slug);
  if (!story) notFound();
  const { blocks, headings } = parseEssay(story.body);
  const { words, minutes } = essayLength(story.body);
  const next = nextEssay(slug);
  const url = `${siteUrl}${essayHref(slug)}`;
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: excerpts[slug],
    url,
    mainEntityOfPage: url,
    inLanguage: 'zh-CN',
    author: { '@type': 'Person', name: AUTHOR },
    publisher: { '@type': 'Organization', name: 'Molis AI', url: siteUrl },
  };

  return (
    <article className="m-essay ex" data-room="read">
      <script
        type="application/ld+json"
        // oxlint-disable-next-line react/no-danger -- 本站自己的静态数据，转义了 <
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured).replace(/</g, '\\u003c'),
        }}
      />
      <ReadingProgress target="essay-body" toc="essay-toc" />

      <header className="m-wrap m-top m-essay-head">
        <RoomMeta room="read" />
        <p className="m-essay-kicker m-rise m-noprint">
          <Link className="m-essay-back" href={ESSAYS}>
            {essayUi.all}
          </Link>
          <span className="m-kicker">{story.label}</span>
        </p>
        <div className="m-rise" style={{ '--delay': '80ms' } as Vars}>
          <Title title={story.title} as="h1" />
        </div>
        <p
          className="m-essay-byline m-rise"
          style={{ '--delay': '160ms' } as Vars}
        >
          <span>{AUTHOR}</span>
          <span className="num m-noprint">{essayUi.words(words)}</span>
          <span className="num m-noprint">{essayUi.minutes(minutes)}</span>
        </p>
      </header>

      <div className="m-wrap m-essay-layout">
        {headings.length ? (
          <nav
            id="essay-toc"
            className="m-essay-toc m-noprint"
            aria-label={essayUi.toc}
          >
            <p className="m-kicker">{essayUi.toc}</p>
            <ol>
              {headings.map((heading) => (
                <li key={heading.id} data-back={heading.back || undefined}>
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div id="essay-body" className="m-essay-body">
          <EssayBlocks blocks={blocks} />
        </div>
      </div>

      {next && next.slug !== slug ? (
        <footer className="m-wrap m-essay-end m-noprint">
          <div className="m-essay-next">
            <Link className="m-essay-nextlink" href={essayHref(next.slug)}>
              <Title title={next.title} as="span" />
            </Link>
            <p className="m-essay-excerpt">{excerpts[next.slug]}</p>
            <More href={ESSAYS}>{essayUi.all}</More>
          </div>
        </footer>
      ) : null}
    </article>
  );
}
