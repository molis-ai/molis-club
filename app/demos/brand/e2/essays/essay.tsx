'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  folioEssayAuthor,
  folioEssayLinks,
  folioStudio,
} from '../../../../../content/folio';
import { ABOUT, ESSAYS, HOME, essayHref, pad } from '../routes';
import { E2Page } from '../shell';
import { essayAt, essayItems } from './data';
import './essays.css';

// E2 文章阅读页：阅读优先。开篇左边一条等宽小字的页边（编号与回到目录），右边标题、摘要与署名；
// 正文一栏约 37em、17–18px、行高 1.9，宽屏时左边目录粘住并标出读到哪一节，顶栏下方一条 2px 的阅读进度。
// 几乎没有动效：不做视差、不做逐段淡入，只有开篇进场时轻轻淡入一次。
// 原文在 content/stories.json，按空行分段，支持小标题、引文、分隔线、编号列表与粗体、斜体（解析同 Folio）。
// 结尾：接着读下一篇，再给产品、团队、作者公众号与回到首页四条去处。

const { essays, labels } = folioStudio;

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

function Block({
  text,
  id,
  number,
}: {
  text: string;
  id: string;
  /** 小节标题的两位编号，和目录对应 */
  number?: string;
}) {
  if (text.startsWith('### ')) return <h3 id={id}>{text.slice(4)}</h3>;
  if (text.startsWith('## '))
    return (
      <h2 id={id}>
        {number ? (
          <span className="ee-h-no" aria-hidden="true">
            {number}
          </span>
        ) : null}
        {text.slice(3)}
      </h2>
    );
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

/**
 * 读到哪里：正文容器上读出进度写进 --read（0–1），并返回当前小节的序号。
 * 起点是正文顶边碰到顶栏底边，终点是正文底边到达视口底部；当前小节是最后一个越过视口上部四分之一的标题。
 */
function useReading() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const body = bodyRef.current;
    const bar = barRef.current;
    if (!body || !bar) return;
    const heads = Array.from(body.querySelectorAll<HTMLElement>('h2[id]'));
    const header = document.querySelector<HTMLElement>('.e2-header');
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const top = Math.max(0, header?.getBoundingClientRect().bottom ?? 0);
      const rect = body.getBoundingClientRect();
      const span = Math.max(1, rect.height - (vh - top));
      const read = Math.min(1, Math.max(0, (top - rect.top) / span));
      bar.style.setProperty('--read', read.toFixed(4));
      bar.dataset.on = String(read > 0);
      const line = top + (vh - top) * 0.25;
      let current = -1;
      heads.forEach((head, index) => {
        if (head.getBoundingClientRect().top <= line) current = index;
      });
      setActive(current);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    void document.fonts?.ready.then(request);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);
  return { bodyRef, barRef, active };
}

/** 结尾：接着读下一篇（最后一篇之后回到第一篇），再给四条去处 */
function Ending({ slug }: { slug: string }) {
  const at = essayItems.findIndex((item) => item.slug === slug);
  const nextIndex = (at + 1) % essayItems.length;
  const next = essayAt(essayItems[nextIndex].slug);
  const links: {
    label: string;
    href: string;
    external?: boolean;
  }[] = [
    { label: folioEssayLinks.products, href: `${HOME}#products` },
    { label: folioEssayLinks.team, href: ABOUT },
    {
      label: folioEssayAuthor.more,
      href: folioEssayAuthor.href,
      external: true,
    },
    { label: essays.back, href: HOME },
  ];
  return (
    <section className="ee-end" aria-labelledby="ee-next-title">
      <Link href={essayHref(next.item.slug)} className="ee-next">
        <span className="ee-next-meta">
          <i aria-hidden="true">{pad(nextIndex)}</i>
          <span>{essays.next}</span>
        </span>
        <h2 id="ee-next-title">
          <span>{next.title}</span>
          {next.subtitle ? (
            <>
              <span className="sr-only">：</span>
              <small>{next.subtitle}</small>
            </>
          ) : null}
        </h2>
        <span className="ee-next-lead">{next.item.description}</span>
        <ArrowRight className="ee-next-arrow" size={24} aria-hidden="true" />
      </Link>
      <ul className="ee-links">
        {links.map((link, index) => {
          const body = (
            <>
              <i aria-hidden="true">{pad(index)}</i>
              <span>{link.label}</span>
              {link.external ? (
                <ArrowUpRight size={16} aria-hidden="true" />
              ) : (
                <ArrowRight size={16} aria-hidden="true" />
              )}
            </>
          );
          return (
            <li key={link.href}>
              {link.external ? (
                <a href={link.href} target="_blank" rel="noreferrer">
                  {body}
                </a>
              ) : (
                <Link href={link.href}>{body}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Essay({ slug }: { slug: string }) {
  const { index, item, story, title, subtitle, blocks, headings, minutes } =
    essayAt(slug);
  const { bodyRef, barRef, active } = useReading();
  const numberOf = new Map(
    headings.map((heading, at) => [heading.id, pad(at)]),
  );

  return (
    <E2Page current="essays" className="ee" footer={<Ending slug={slug} />}>
      <div className="ee-progress" ref={barRef} aria-hidden="true" />
      <article className="ee-article" aria-labelledby="ee-title">
        <header className="ee-open">
          <div className="ee-open-rail">
            <span className="ee-open-no">
              <span lang="en">No.</span> {pad(index)}
            </span>
            <Link href={ESSAYS} className="ee-crumb">
              <span lang="en">{labels.essays.en}</span> · {labels.essays.zh}
            </Link>
          </div>
          <div className="ee-open-main">
            <h1 id="ee-title">
              <span className="ee-title">{title}</span>
              {subtitle ? (
                <>
                  <span className="sr-only">：</span>
                  <span className="ee-subtitle">{subtitle}</span>
                </>
              ) : null}
            </h1>
            <p className="ee-lead">{item.description}</p>
            <p className="ee-byline">
              <a
                className="ee-author"
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
                {minutes} {essays.read}
              </span>
            </p>
          </div>
        </header>

        <div className="ee-sheet">
          <nav className="ee-toc" aria-label="本篇目录">
            <span className="ee-toc-label" aria-hidden="true">
              本篇目录
            </span>
            <ol>
              {headings.map((heading, at) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    aria-current={active === at ? 'true' : undefined}
                  >
                    <i aria-hidden="true">{pad(at)}</i>
                    <span>{heading.text}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="ee-body" ref={bodyRef}>
            {blocks.map((text, at) => (
              <Block
                key={at}
                text={text}
                id={`section-${at}`}
                number={numberOf.get(`section-${at}`)}
              />
            ))}
          </div>
        </div>
      </article>
    </E2Page>
  );
}
