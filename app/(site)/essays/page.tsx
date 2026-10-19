import Link from 'next/link';
import { pageMetadata } from '../../../lib/site';
import {
  AUTHOR,
  essayLength,
  essays,
  essaysPage,
  essayUi,
  excerpts,
  splitTitle,
} from '../../../content/site/essays';
import { ESSAYS, essayHref } from '../../_site/routes';
import { Btn, pad, Phrases, type Vars } from '../../_site/ui';
import { Facts, roomOf, Work } from '../../_site/exhibit/exhibit';
import { parseEssay } from './markdown';
import './essays.css';

export const metadata = pageMetadata(
  essaysPage.kicker,
  essaysPage.lead,
  ESSAYS,
);

// 「文章」：开场（书架之间的窗，2.2 的那句当副题）· 为什么写（摊开的长桌，2.2 第一段的两句原句）·
// 两篇各一屏、左右交替（一张图，图下是本篇摘句；标题、副标题、篇幅、本篇目录、读全文）。每屏一个视口放得下。
// 「关于」收成一整页后（C1，负责人 2026-10-18），这里不再是展厅：没有名牌、墙色和「下一个展厅」，图不编号；
// 从「关于」页「什么变了」的卡片和页尾目录进来。

/** 两篇各配一件（展品编号接着开场两件往下数） */
const works: Record<
  string,
  { name: 'ex-hand-book' | 'ex-workbench'; focus: string }
> = {
  'human-scale': { name: 'ex-hand-book', focus: '50% 42%' },
  idealism: { name: 'ex-workbench', focus: '40% 50%' },
};

/** 按句号、问号切句 */
const sentences = (text: string) =>
  text.match(/[^。？！]+[。？！]?/g) ?? [text];

const HUMAN_SCALE = '《人的尺度》';

/** 把原句里的《人的尺度》换成去文章的链接，其余一字不动 */
function WithEssayLink({ text }: { text: string }) {
  const [before, after] = text.split(HUMAN_SCALE);
  if (after === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <Link className="m-inline" href={essayHref('human-scale')}>
        {HUMAN_SCALE}
      </Link>
      {after}
    </>
  );
}

const shelf = essays.map((story) => {
  const { headings } = parseEssay(story.body);
  return {
    story,
    ...splitTitle(story.title),
    ...essayLength(story.body),
    // 分隔线之后的附注（例如参考依据）不算小节
    headings: headings.filter((heading) => !heading.back),
  };
});

export default function EssaysPage() {
  const [hook, ...rest] = sentences(essaysPage.lead);

  return (
    <div className="ex es">
      {/* 开场：书架之间的一扇窗 */}
      <header className="ex-open m-wrap">
        <div className="ex-grid es-open">
          <div className="es-open-text">
            <h1 className="ex-h1 m-rise" style={{ '--delay': '60ms' } as Vars}>
              {roomOf('read').name}
            </h1>
            <p
              className="ex-note m-rise"
              style={{ '--delay': '120ms' } as Vars}
            >
              {essaysPage.title}
            </p>
            <div className="m-rise" style={{ '--delay': '180ms' } as Vars}>
              <Facts
                items={[
                  { label: essayUi.facts.essays, value: essays.length },
                  {
                    label: essayUi.facts.sections,
                    value: shelf.reduce(
                      (sum, item) => sum + item.headings.length,
                      0,
                    ),
                  },
                  {
                    label: essayUi.facts.minutes,
                    value: shelf.reduce((sum, item) => sum + item.minutes, 0),
                  },
                ]}
              />
            </div>
          </div>
          <Work
            name="ex-library-window"
            ratio="4 / 5"
            focus="50% 40%"
            maxH="60svh"
            sizes="(max-width: 900px) 100vw, 40vw"
            eager
            className="es-open-work"
          />
        </div>
      </header>

      {/* 为什么写：摊开的长桌 */}
      <section className="ex-screen m-wrap" aria-labelledby="es-why-title">
        <div className="ex-grid es-why">
          <Work
            name="ex-sun-table"
            ratio="4 / 5"
            focus="50% 55%"
            maxH="64svh"
            sizes="(max-width: 900px) 100vw, 36vw"
            className="es-why-work"
          />
          <div className="es-why-text" data-reveal>
            <p className="ex-kicker">{essayUi.why}</p>
            <h2 className="ex-h2" id="es-why-title">
              <Phrases text={hook} />
            </h2>
            {rest.length ? (
              <p className="ex-text es-why-rest">
                <WithEssayLink text={rest.join('')} />
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* 两篇：左右交替，一篇一屏 */}
      {shelf.map((item, index) => {
        const { story, main, sub, words, minutes, headings } = item;
        const href = essayHref(story.slug);
        const work = works[story.slug];
        const id = `es-${story.slug}`;
        return (
          <section
            key={story.slug}
            className="ex-screen m-wrap"
            aria-labelledby={id}
          >
            <div
              className="ex-grid es-piece"
              data-side={index % 2 ? 'right' : 'left'}
            >
              {work ? (
                <Work
                  name={work.name}
                  ratio="4 / 5"
                  focus={work.focus}
                  maxH="60svh"
                  sizes="(max-width: 900px) 100vw, 36vw"
                  className="es-piece-work"
                >
                  {excerpts[story.slug]}
                </Work>
              ) : null}
              <div className="es-piece-text" data-reveal>
                <p className="ex-kicker">
                  <span className="m-no">{pad(index + 1)}</span>
                  {story.label}
                </p>
                <h2 className="ex-h2 es-title" id={id}>
                  <Link href={href}>{main}</Link>
                </h2>
                {sub ? <p className="ex-note es-sub">{sub}</p> : null}
                <p className="es-byline">
                  <span>{AUTHOR}</span>
                  <span className="num">{essayUi.words(words)}</span>
                  <span className="num">{essayUi.minutes(minutes)}</span>
                </p>
                <nav className="es-toc" aria-label={`${main} · ${essayUi.toc}`}>
                  <p className="es-toc-label">{essayUi.toc}</p>
                  <ol>
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a href={`${href}#${heading.id}`}>{heading.text}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
                <div className="m-actions">
                  <Btn href={href}>{essayUi.read}</Btn>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
