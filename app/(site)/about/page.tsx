import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { pageMetadata } from '../../../lib/site';
import { story, studio } from '../../../content/site/studio';
import {
  productIds,
  products,
  type ProductId,
} from '../../../content/site/products';
import { nav } from '../../../content/site/nav';
import {
  aboutCareLead,
  aboutName,
  aboutUi,
  trio,
} from '../../../content/site/about';
import {
  ABOUT,
  ALONG,
  COMMUNITY,
  ENTERPRISE,
  ESSAYS,
  TEAM,
  essayHref,
  productHref,
} from '../../_site/routes';
import {
  More,
  pad,
  Phrases,
  SectionHead,
  Status,
  Window,
  type Vars,
} from '../../_site/ui';
import { VideoWindow } from '../../_site/video';
import { Fold, Paragraphs } from '../../_site/viz/viz';
import { Beliefs } from './beliefs';
import { Trio } from './trio';
import './about.css';

export const metadata = pageMetadata(
  aboutUi.kicker,
  studio.standard.intro,
  ABOUT,
);

// 关于我们（visual-storyboard 第 4 节）：先给读者四个自己会在心里回答的问题，再讲来路。
// 首屏：四个问题逐行浮现，各自落到回答它的那件产品；World 更远，虚线。
// 01 从哪来：六种经历汇到 Molis；02 什么变了：越来越多想法被做出来，圈住值得做的一个；
// 03 三种媒介，同一个动作（演示）；04 六条信念：一张可点的目录；05 落到产品里 + 要求自己；
// 06 接下来去哪：一个人的一天、海岸线、World 的那个问题；最后三扇门。
// 原文段落都在，收在「展开看全文」里。不画带年份的时间线。

const HUMAN_SCALE = '《人的尺度》';

/** 「我们是谁」里对上四个问题的四件产品（World 更远，单独一行） */
const nearIds = productIds.filter((id) => id !== 'world') as Exclude<
  ProductId,
  'world'
>[];

const doors = [
  {
    href: TEAM,
    label: nav.aboutItems.team,
    line: nav.aboutLines.team,
    en: 'Team',
  },
  {
    href: ESSAYS,
    label: nav.aboutItems.essays,
    line: nav.aboutLines.essays,
    en: 'Essays',
  },
  {
    href: ALONG,
    label: nav.aboutItems.along,
    line: nav.aboutLines.along,
    en: 'Along the way',
  },
];

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

/** 「我们曾是美团的同事。」：2.1 第一段的第一句 */
const colleagues = story.origin.paragraphs[0].slice(
  0,
  story.origin.paragraphs[0].indexOf('。') + 1,
);
/** 2.2：「当越来越多想法……更重要。」 */
const [changeBig] = story.change.paragraphs[2].split(/(?<=。)/);
/** 2.3 最后一段：人的一天 */
const wholeDay = story.toLife.paragraphs[story.toLife.paragraphs.length - 1];
const [worldQuestion, ...worldRest] = story.further.paragraphs;
/** 一格一个想法；填色按打乱的次序（29 与 48 互质，走一遍不重复），不是从左到右 */
const IDEAS = 48;
const CHOSEN = 33;

export default function AboutPage() {
  const { standard } = studio;
  return (
    <div className="ab">
      {/* 首屏：四个问题 → 四件产品 */}
      <header className="ab-hero m-wrap m-top">
        <p className="m-kicker m-rise">{aboutUi.kicker}</p>
        <h1 className="ab-title m-rise" style={{ '--delay': '60ms' } as Vars}>
          <Phrases text={aboutName} />
        </h1>
        <p
          className="ab-care m-rise"
          style={{ '--delay': '140ms' } as Vars}
        >
          {aboutCareLead}
        </p>
        <ol className="ab-qa">
          {nearIds.map((id, index) => {
            const product = products[id];
            return (
              <li
                key={id}
                className="ab-qa-row m-rise"
                style={{ '--delay': `${380 + index * 260}ms` } as Vars}
              >
                <Link href={productHref[id]} className="ab-qa-link">
                  <span className="ab-qa-q">
                    {standard.questions[id]}
                    {index < nearIds.length - 1 ? '，' : '。'}
                  </span>
                  <span className="ab-qa-line" aria-hidden="true" />
                  <span className="ab-qa-a">
                    <span className="ab-qa-name" lang="en">
                      {product.name}
                    </span>
                    <Status>{product.stage}</Status>
                  </span>
                </Link>
              </li>
            );
          })}
          <li
            className="ab-qa-row ab-qa-far m-rise"
            style={{ '--delay': `${380 + nearIds.length * 260}ms` } as Vars}
          >
            <Link href={productHref.world} className="ab-qa-link">
              <span className="ab-qa-q">{aboutUi.further}</span>
              <span className="ab-qa-line" aria-hidden="true" />
              <span className="ab-qa-a">
                <span className="ab-qa-name" lang="en">
                  {products.world.name}
                </span>
                <Status concept>{products.world.stage}</Status>
              </span>
            </Link>
          </li>
        </ol>
        <div className="ab-hero-more">
          <Fold summary={aboutUi.full}>
            <p>{standard.intro}</p>
            <p>{standard.growing}</p>
            {nearIds.map((id) => (
              <p key={id}>
                {products[id].name} {standard.products[id]}
              </p>
            ))}
            <p>{standard.world}</p>
            <p>{standard.together}</p>
          </Fold>
          <p className="m-actions">
            <More href={ENTERPRISE}>{aboutUi.enterprise}</More>
            <More href={COMMUNITY}>{aboutUi.community}</More>
          </p>
        </div>
        <Window
          name="about-window"
          ratio="21 / 9"
          focus="72% 56%"
          sizes="(max-width: 900px) 100vw, 1440px"
          alt={aboutUi.heroAlt}
          caption={<span lang="en">{aboutUi.heroCaption}</span>}
          className="ab-hero-window"
        />
      </header>

      {/* 01 从哪来：六种经历汇到 Molis */}
      <section
        className="ab-sec m-wrap"
        aria-labelledby="ab-from-title"
      >
        <SectionHead
          no={pad(1)}
          kicker={aboutUi.from}
          id="ab-from-title"
          title={<Phrases text={story.origin.title} />}
        />
        <div className="ab-from" data-scene>
          <div className="ab-from-words">
            <p className="ab-from-big">{colleagues}</p>
            <p className="ab-from-line">
              <Phrases text={story.origin.positions} />
            </p>
          </div>
          <div className="ab-gather" aria-hidden="true">
            {aboutUi.fromWords.map((word, index) => (
              <span
                key={word}
                className="ab-gather-word"
                style={{ '--i': index } as Vars}
              >
                {word}
              </span>
            ))}
            <span className="ab-gather-core" lang="en">
              Molis
            </span>
          </div>
        </div>
        <div className="ab-body">
          <Fold summary={aboutUi.full}>
            <Paragraphs items={story.origin.paragraphs} />
          </Fold>
          <More href={TEAM}>{aboutUi.meetTeam}</More>
        </div>
      </section>

      {/* 02 什么变了：越来越多想法被做出来，圈住值得做的那一个 */}
      <section className="ab-sec m-wrap" aria-labelledby="ab-change-title">
        <SectionHead
          no={pad(2)}
          kicker={aboutUi.changed}
          id="ab-change-title"
          title={<Phrases text={story.change.title} />}
          lead={<p>{aboutUi.ideas}</p>}
        />
        <div className="ab-ideas" data-scene>
          <ol className="ab-ideas-grid" aria-hidden="true">
            {Array.from({ length: IDEAS }, (_, index) => (
              <li
                key={index}
                className="ab-idea"
                data-chosen={index === CHOSEN || undefined}
                style={{ '--i': (index * 29) % IDEAS } as Vars}
              />
            ))}
          </ol>
          <p className="ab-ideas-note">{aboutUi.ideasNote}</p>
        </div>
        <p className="ab-big" data-reveal>
          <Phrases text={changeBig} />
        </p>
        <div className="ab-body">
          <Fold summary={aboutUi.full}>
            {story.change.paragraphs.map((text) => (
              <p key={text}>
                <WithEssayLink text={text} />
              </p>
            ))}
          </Fold>
          <More href={essayHref('human-scale')}>{aboutUi.essay}</More>
        </div>
      </section>

      {/* 03 三种媒介，同一个动作 */}
      <section className="ab-sec m-wrap" aria-labelledby="ab-trio-title">
        <SectionHead
          no={pad(3)}
          kicker={trio.kicker}
          en
          id="ab-trio-title"
          title={<Phrases text={trio.title} />}
          lead={<p>{standard.makers}</p>}
        />
        <Trio />
      </section>

      {/* 04 我们相信什么：六句是一张目录（首页「读完整的信念」链到这里） */}
      <section
        className="ab-sec m-wrap"
        id="beliefs"
        aria-labelledby="ab-beliefs-title"
      >
        <SectionHead
          no={pad(4)}
          kicker={aboutUi.believe}
          en
          id="ab-beliefs-title"
          title={aboutUi.believeTitle}
          lead={<p>{standard.character}</p>}
        />
        <Beliefs />
      </section>

      {/* 05 落到产品里 · 要求自己 */}
      <section className="ab-sec m-wrap" aria-labelledby="ab-practice-title">
        <SectionHead
          no={pad(5)}
          kicker={aboutUi.practice}
          id="ab-practice-title"
          size="h2"
          title={<Phrases text={studio.practice.title} />}
          lead={<p>{studio.practice.lead}</p>}
        />
        <ul className="ab-practice">
          {studio.practice.rows.map((row, index) => (
            <li
              key={row.choice}
              data-reveal
              style={{ '--delay': `${index * 80}ms` } as Vars}
            >
              <p className="ab-practice-tags">
                {aboutUi.practiceTags[index].map((tag) => (
                  <span key={tag} lang="en">
                    {tag}
                  </span>
                ))}
              </p>
              <h3>{row.choice}</h3>
              <p>{row.how}</p>
            </li>
          ))}
        </ul>
        <div className="ab-demands" data-reveal>
          <h3 className="ab-demands-title">
            <span className="m-kicker">{aboutUi.demands}</span>
            <span>{studio.demands.title}</span>
          </h3>
          <ol>
            {studio.demands.items.map((item, index) => (
              <li key={item.title}>
                <span className="m-no" aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <span className="ab-demand">{item.title}</span>
              </li>
            ))}
          </ol>
          <Fold summary={aboutUi.full}>
            <p>{studio.demands.lead}</p>
            {studio.demands.items.map((item) => (
              <p key={item.title}>
                <b className="m-strong">{item.title}</b>
                {item.text}
              </p>
            ))}
          </Fold>
        </div>
      </section>

      {/* 06 接下来去哪：一个人的一天；海岸线；World 的那个问题 */}
      <section className="ab-sec m-wrap" aria-labelledby="ab-next-title">
        <SectionHead
          no={pad(6)}
          kicker={aboutUi.next}
          id="ab-next-title"
          title={<Phrases text={story.toLife.title} />}
        />
        <div className="ab-day" data-scene>
          <ol className="ab-day-bar">
            {aboutUi.day.map((part, index) => (
              <li
                key={part.label}
                className="ab-day-part"
                style={{ '--i': index } as Vars}
              >
                <span className="ab-day-label">{part.label}</span>
                <span className="ab-day-fill" aria-hidden="true" />
                <span className="ab-day-products" lang="en">
                  {part.products.map((name) => `Molis ${name}`).join(' · ')}
                </span>
              </li>
            ))}
          </ol>
          <p className="ab-day-whole">{wholeDay}</p>
        </div>
        <div className="ab-body">
          <Fold summary={aboutUi.full}>
            <Paragraphs items={story.toLife.paragraphs.slice(0, -1)} />
          </Fold>
        </div>
        <VideoWindow
          name="about-coast"
          ratio="21 / 9"
          focus="50% 62%"
          className="ab-coast"
          caption={<span lang="en">{aboutUi.coastCaption}</span>}
        />
        <div className="ab-further">
          <h3 className="ab-further-title" data-reveal>
            <Phrases text={story.further.title} />
          </h3>
          <div className="ab-further-body" data-reveal>
            <p className="ab-question">{worldQuestion}</p>
            <p className="m-actions">
              <More href={productHref.world}>
                {products.world.name}
              </More>
              <Status concept>{products.world.stage}</Status>
            </p>
            <Fold summary={aboutUi.full}>
              <Paragraphs items={worldRest} />
            </Fold>
          </div>
        </div>
      </section>

      {/* 最后三扇门：团队 · 文章 · 沿途 */}
      <section className="ab-doors m-wrap" aria-labelledby="ab-doors-title">
        <p className="m-kicker" data-reveal>
          {aboutUi.doorsLabel}
        </p>
        <h2 className="ab-doors-title" id="ab-doors-title" data-reveal>
          <Phrases text={studio.short[2]} />
        </h2>
        <ul className="ab-door-list">
          {doors.map((door, index) => (
            <li
              key={door.href}
              data-reveal
              style={{ '--delay': `${index * 80}ms` } as Vars}
            >
              <Link className="ab-door" href={door.href}>
                <span className="ab-door-en" lang="en">
                  {door.en}
                </span>
                <span className="ab-door-label">{door.label}</span>
                <span className="ab-door-line">{door.line}</span>
                <ArrowRight
                  className="ab-door-arrow"
                  size={18}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
