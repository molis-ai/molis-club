'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  folioEssayAuthor,
  folioEssayLinks,
  folioStudio,
} from '../../../../../content/folio';
import { Actions, More, Phrases, Shell, WallLabel } from '../kit';
import { ABOUT, ESSAYS, HOME, essayHref } from '../routes';
import { essayEntry, pad } from './meta';
import './essays.css';

// 阅览室里的一篇文章：开篇是一面标题墙（大字标题、副题、摘要，旁边一块展签写作者、栏目与篇幅），
// 往下是安静的阅读模式：左边目录粘住并标出读到哪一节，正文一栏合适的行长，不加视差，也不逐段隐藏；
// 顶上一道很细的杏色线是阅读进度。原文里独立成段的几句判断按墙面文字放大（原样、不重复）。
// 封底按 Folio 的顺序（A10、P7）：接着读另一篇，然后是产品、团队、公众号、回到首页。
// 原文在 content/stories.json，按空行分段，支持小标题、引文、分隔线、编号列表与粗体、斜体。

/** 原文中独立成段、适合当墙面文字的句子；只按整段原文匹配，对不上就照常排成正文 */
const wallText: Record<string, string[]> = {
  'human-scale': [
    '人的社会价值，往后会越来越不按占有的资源计价，按你让多少人变得更能创造计价。',
    '缺的从来不是机器，是敢出题的人。',
  ],
  idealism: [
    '落地主义是一套哲学，只是它从不承认自己是哲学。',
    '于是一个很少被说破的机制浮出来：越是在刻度里赢了的人，越难离开刻度。',
    '知道那一刻，选择才算开始。',
  ],
};

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

type Section = { id: string; text: string; number: string };

function Block({
  text,
  id,
  section,
  wall,
}: {
  text: string;
  id: string;
  section?: Section;
  wall: boolean;
}) {
  if (text.startsWith('### '))
    return (
      <h3 id={id} className="g-essay-h3">
        {text.slice(4)}
      </h3>
    );
  if (text.startsWith('## '))
    return (
      <h2 id={id} className="g-essay-h2">
        {section ? (
          <span className="g-essay-h2-no g-soft" aria-hidden="true">
            {section.number}
          </span>
        ) : null}
        <span>{text.slice(3)}</span>
      </h2>
    );
  if (text.startsWith('> '))
    return (
      <blockquote className="g-essay-quote">
        {inline(text.replace(/^>\s?/gm, ''))}
      </blockquote>
    );
  if (text === '---') return <hr className="g-essay-rule" />;
  if (/^\d+\. /.test(text))
    return (
      <ol className="g-essay-ol">
        {text.split('\n').map((item) => (
          <li key={item}>{inline(item.replace(/^\d+\.\s*/, ''))}</li>
        ))}
      </ol>
    );
  return (
    <p className={wall ? 'g-essay-walltext' : 'g-essay-p'}>{inline(text)}</p>
  );
}

/** 读到哪一节：取最后一个越过视口上方三分之一的小标题；只在滚动的下一帧里更新 */
function useActiveSection() {
  const body = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const root = body.current;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll<HTMLElement>('h2[id]'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.34;
      let current: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id;
      }
      setActive(current);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    request();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);
  return [body, active] as const;
}

/** 封底：接着读另一篇（一面亮着的标题墙），下面一行去处 */
function EssayEnd({ slug }: { slug: string }) {
  const { essays } = folioStudio;
  const { index } = essayEntry(slug);
  const next = essayEntry(essays.items[(index + 1) % essays.items.length].slug);
  return (
    <section className="g-essay-end" aria-labelledby="g-essay-next-title">
      <Link href={essayHref(next.slug)} className="g-essay-next">
        <span className="g-essay-next-top">
          <span>{essays.next}</span>
          <span className="g-soft" lang="en" aria-hidden="true">
            No. {next.number}
          </span>
        </span>
        <h2 id="g-essay-next-title" className="g-essay-next-title">
          <span className="g-essay-next-main">{next.title}</span>
          {next.subtitle ? (
            <span className="g-essay-next-sub">{next.subtitle}</span>
          ) : null}
        </h2>
        <span className="g-essay-next-go" aria-hidden="true">
          <ArrowRight size={24} />
        </span>
      </Link>
      <div className="g-essay-links">
        <Actions>
          <More href={`${HOME}#products`}>{folioEssayLinks.products}</More>
          <More href={ABOUT}>{folioEssayLinks.team}</More>
          <More href={folioEssayAuthor.href} external>
            {folioEssayAuthor.more}
          </More>
          <More href={HOME}>{essays.back}</More>
        </Actions>
      </div>
    </section>
  );
}

export function Essay({ slug }: { slug: string }) {
  const { essays, labels } = folioStudio;
  const entry = essayEntry(slug);
  const [bodyRef, active] = useActiveSection();
  const walls = new Set(wallText[slug] ?? []);
  const blocks = entry.story.body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const sections: Section[] = blocks
    .flatMap((text, at) =>
      text.startsWith('## ')
        ? [{ text: text.slice(3), id: `section-${at}` }]
        : [],
    )
    .map((section, order) => ({ ...section, number: pad(order) }));

  return (
    <Shell current="essays" ending={<EssayEnd slug={slug} />}>
      {/* 开篇：一面标题墙，墙上的大字是标题，右下角一块展签 */}
      <header className="g-essay-open">
        <div className="g-essay-titlewall">
          <p className="g-essay-open-top">
            <span
              className="g-essay-open-no g-soft"
              lang="en"
              aria-hidden="true"
            >
              No. {entry.number}
            </span>
            <Link href={ESSAYS} className="g-essay-open-back">
              {labels.essays.en} · {labels.essays.zh}
            </Link>
            <span
              className="g-essay-open-room g-soft"
              lang="en"
              aria-hidden="true"
            >
              Reading Room
            </span>
          </p>
          <h1 id="g-essay-title" className="g-essay-open-title">
            <span className="g-essay-open-main">{entry.title}</span>
            {entry.subtitle ? (
              <span className="g-essay-open-sub">{entry.subtitle}</span>
            ) : null}
          </h1>
          <div className="g-essay-open-row">
            <p className="g-essay-open-lead">
              <Phrases text={entry.item.description} />
            </p>
            <WallLabel className="g-essay-label">
              <p className="g-label-room" aria-hidden="true">
                <span lang="en">No. {entry.number}</span>
                <span lang="en">Essay</span>
              </p>
              <p className="g-label-name">
                <a
                  className="g-essay-label-author"
                  href={folioEssayAuthor.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={essays.author + folioEssayAuthor.labelSuffix}
                >
                  {essays.author}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </p>
              <p className="g-label-line g-essay-label-meta">
                <span>{entry.story.label}</span>
                <span>
                  {entry.minutes} {essays.read}
                </span>
              </p>
            </WallLabel>
          </div>
        </div>
      </header>

      {/* 阅读模式：左边目录，右边正文；整段写阅读进度 --p */}
      <div className="g-essay-sheet" data-scene="pin">
        <span className="g-essay-progress" aria-hidden="true" />
        <nav className="g-essay-toc" aria-label="本篇目录">
          <span className="g-essay-toc-label" aria-hidden="true">
            本篇目录
          </span>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={active === section.id ? 'location' : undefined}
                >
                  <i className="g-soft" aria-hidden="true">
                    {section.number}
                  </i>
                  <span>{section.text}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article
          className="g-essay-body"
          ref={bodyRef}
          aria-labelledby="g-essay-title"
        >
          {blocks.map((text, at) => (
            <Block
              key={at}
              text={text}
              id={`section-${at}`}
              section={sections.find((item) => item.id === `section-${at}`)}
              wall={walls.has(text)}
            />
          ))}
        </article>
      </div>
    </Shell>
  );
}
