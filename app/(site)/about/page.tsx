import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { pageMetadata } from '../../../lib/site';
import { story, studio } from '../../../content/site/studio';
import {
  productIds,
  products,
  type ProductId,
} from '../../../content/site/products';
import { homeProducts } from '../../../content/site/home';
import { nav } from '../../../content/site/nav';
import {
  aboutCare,
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
import { Trio } from './trio';
import './about.css';

export const metadata = pageMetadata(
  aboutUi.kicker,
  studio.standard.intro,
  ABOUT,
);

// 关于我们：我们是谁、从哪来、什么变了、三种媒介同一个动作、六条信念、落到产品里、怎样要求自己、接下来去哪、三扇门。
// 不画带年份的时间线。《黑客与画家》不靠口号，落在细节里：作画、写代码、改文字三栏并排、地位相同；
// 信念与要求用同一套排印对待，不分「理性」和「感性」两种版式。

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

export default function AboutPage() {
  const { standard } = studio;
  const [lineWork, work, lineLife, life, experience, together] =
    story.toLife.paragraphs;
  const [question, ...further] = story.further.paragraphs;
  const change = story.change.paragraphs;
  const changeLast = change[change.length - 1];

  return (
    <div className="ab">
      {/* 首屏：白房子里，一个人站在窗前往外看 */}
      <header className="ab-hero m-wrap m-top">
        <p className="m-kicker" data-reveal>
          {aboutUi.kicker}
        </p>
        <h1 className="ab-title" data-reveal>
          <Phrases text={aboutName} />
        </h1>
        <p
          className="ab-lead m-lead"
          data-reveal
          style={{ '--delay': '90ms' } as Vars}
        >
          {aboutCare}
        </p>
        <Window
          name="about-window"
          ratio="21 / 9"
          focus="72% 56%"
          sizes="(max-width: 900px) 100vw, 1440px"
          eager
          alt={aboutUi.heroAlt}
          caption={<span lang="en">{aboutUi.heroCaption}</span>}
          className="ab-hero-window"
        />
      </header>

      {/* 01 我们是谁：四个问题，对上四件产品；World 更远 */}
      <section className="ab-sec m-wrap" aria-labelledby="ab-who-title">
        <SectionHead
          no={pad(1)}
          kicker={aboutUi.who}
          id="ab-who-title"
          title={<Phrases text={standard.growing} />}
        />
        <ol className="ab-who">
          {nearIds.map((id, index) => {
            const product = products[id];
            return (
              <li
                key={id}
                className="ab-who-row"
                data-reveal
                style={{ '--delay': `${index * 70}ms` } as Vars}
              >
                <p className="ab-q">
                  {standard.questions[id]}
                  {index < nearIds.length - 1 ? '，' : '。'}
                </p>
                <span className="ab-arrow" aria-hidden="true">
                  →
                </span>
                <div className="ab-a">
                  <p className="m-tagline">
                    <span>{product.form}</span>
                    <Status>{product.stage}</Status>
                  </p>
                  <p className="ab-a-text">
                    <span lang="en">{product.name}</span>{' '}
                    {standard.products[id]}
                  </p>
                  <More href={productHref[id]}>{homeProducts[id].more}</More>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="ab-far" data-reveal>
          <span className="ab-far-line" aria-hidden="true" />
          <div className="ab-a">
            <p className="m-tagline">
              <span>{products.world.form}</span>
              <Status concept>{products.world.stage}</Status>
            </p>
            <p className="ab-a-text">{standard.world}</p>
            <More href={productHref.world}>{homeProducts.world.more}</More>
          </div>
        </div>
        <div className="ab-together" data-reveal>
          <p>{standard.together}</p>
          <div className="m-actions">
            <More href={ENTERPRISE}>{aboutUi.enterprise}</More>
            <More href={COMMUNITY}>{aboutUi.community}</More>
          </div>
        </div>
      </section>

      {/* 02 从哪来 */}
      <section className="ab-sec m-wrap" aria-labelledby="ab-from-title">
        <SectionHead
          no={pad(2)}
          kicker={aboutUi.from}
          id="ab-from-title"
          title={<Phrases text={story.origin.title} />}
        />
        <div className="ab-body" data-reveal>
          <div className="m-prose ab-prose">
            {story.origin.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <More href={TEAM}>{aboutUi.meetTeam}</More>
        </div>
      </section>

      {/* 03 什么变了：最后一句打破网格 */}
      <section className="ab-sec m-wrap" aria-labelledby="ab-change-title">
        <SectionHead
          no={pad(3)}
          kicker={aboutUi.changed}
          id="ab-change-title"
          title={<Phrases text={story.change.title} />}
        />
        <div className="ab-body" data-reveal>
          <div className="m-prose ab-prose">
            {change.slice(0, -1).map((text) => (
              <p key={text}>
                <WithEssayLink text={text} />
              </p>
            ))}
          </div>
        </div>
        <p className="ab-big" data-reveal>
          <Phrases text={changeLast} />
        </p>
        <div className="ab-body" data-reveal>
          <More href={essayHref('human-scale')}>{aboutUi.essay}</More>
        </div>
      </section>

      {/* 04 三种媒介，同一个动作 */}
      <section className="ab-sec m-wrap" aria-labelledby="ab-trio-title">
        <SectionHead
          no={pad(4)}
          kicker={trio.kicker}
          en
          id="ab-trio-title"
          title={<Phrases text={trio.title} />}
          lead={<p>{standard.makers}</p>}
        />
        <Trio />
      </section>

      {/* 05 我们相信什么：六条信念全文（首页「读完整的信念」链到这里） */}
      <section
        className="ab-sec m-wrap"
        id="beliefs"
        aria-labelledby="ab-beliefs-title"
      >
        <SectionHead
          no={pad(5)}
          kicker={aboutUi.believe}
          en
          id="ab-beliefs-title"
          title={aboutUi.believeTitle}
          lead={<p>{standard.character}</p>}
        />
        <ol className="ab-beliefs">
          {studio.beliefs.map((belief, index) => (
            <li key={belief.title} data-reveal>
              <span className="ab-bel-no" aria-hidden="true" lang="en">
                {pad(index + 1)}
              </span>
              <h3 className="ab-bel-title">
                <Phrases text={belief.title} />
              </h3>
              <p className="ab-bel-text">{belief.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 06 这些信念怎样落到产品里 */}
      <section className="ab-sec m-wrap" aria-labelledby="ab-practice-title">
        <SectionHead
          no={pad(6)}
          kicker={aboutUi.practice}
          id="ab-practice-title"
          size="h2"
          title={<Phrases text={studio.practice.title} />}
          lead={<p>{studio.practice.lead}</p>}
        />
        <div className="ab-table-wrap" data-reveal>
          <table className="ab-table">
            <thead>
              <tr>
                {studio.practice.head.map((text) => (
                  <th key={text} scope="col">
                    {text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studio.practice.rows.map((row) => (
                <tr key={row.choice}>
                  <th scope="row">{row.choice}</th>
                  <td>{row.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 07 我们怎样要求自己 */}
      <section className="ab-sec m-wrap" aria-labelledby="ab-demands-title">
        <SectionHead
          no={pad(7)}
          kicker={aboutUi.demands}
          id="ab-demands-title"
          size="h2"
          title={<Phrases text={studio.demands.title} />}
          lead={<p>{studio.demands.lead}</p>}
        />
        <ul className="ab-demands">
          {studio.demands.items.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              style={{ '--delay': `${index * 70}ms` } as Vars}
            >
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 08 接下来去哪：工作、生活、体验三条线索；向前飞的海岸线；更远的构想 */}
      <section className="ab-sec m-wrap" aria-labelledby="ab-next-title">
        <SectionHead
          no={pad(8)}
          kicker={aboutUi.next}
          id="ab-next-title"
          title={<Phrases text={story.toLife.title} />}
        />
        <div className="ab-threads">
          <div className="ab-thread" data-reveal>
            <p className="ab-thread-line">{lineWork}</p>
            <div className="ab-thread-body">
              <p>{work}</p>
            </div>
          </div>
          <div className="ab-thread" data-reveal>
            <p className="ab-thread-line">{lineLife}</p>
            <div className="ab-thread-body">
              <p>{life}</p>
              <p>{experience}</p>
            </div>
          </div>
        </div>
        <p className="ab-whole" data-reveal>
          {together}
        </p>
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
            <p className="ab-question">{question}</p>
            <div className="m-prose">
              {further.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
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
