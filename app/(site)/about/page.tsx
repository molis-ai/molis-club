import Link from 'next/link';
import { pageMetadata } from '../../../lib/site';
import { story, studio } from '../../../content/site/studio';
import { aboutUi, trio } from '../../../content/site/about';
import { ABOUT, essayHref } from '../../_site/routes';
import { More, pad, Phrases, type Vars } from '../../_site/ui';
import { Fold } from '../../_site/viz/viz';
import {
  Facts,
  Label,
  NextRoom,
  RoomMeta,
  Work,
} from '../../_site/exhibit/exhibit';
import { BeliefWall } from './belief-wall';
import { Trio } from './trio';
import './about.css';

export const metadata = pageMetadata(
  aboutUi.title,
  studio.standard.character,
  ABOUT,
);

// 展厅 02「我们相信什么」· 主题：光（负责人 2026-10-15 定：「关于」做成一场展，这是第二间，白墙）。
// 开场（窗前的人）· 什么变了（光照进来）· 三种媒介（互动装置）· 六条信念（一面墙六件，点标题换一件）·
// 落到产品里（天窗的格子）· 我们怎样要求自己（墙上的四段字）· 下一个展厅。每屏一个视口放得下。
// 正文都是 1.3–1.6 与 2.2 的原句；《黑客与画家》那一段在展厅 01，这里不重复。

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

/** 六条信念各配一件（展品编号接着三种媒介往下数） */
const beliefWorks = [
  { name: 'ex-dancer', focus: '50% 40%' },
  { name: 'ex-window-blinds', focus: '50% 60%' },
  { name: 'ex-field-flowers', focus: '45% 50%' },
  { name: 'ex-viewer', focus: '45% 50%' },
  { name: 'ex-field-arms', focus: '50% 45%' },
  { name: 'ex-paper-plane', focus: '35% 45%' },
] as const;

export default function AboutPage() {
  const change = story.change.paragraphs;
  const [why] = change.slice(2, 3);
  const changeLast = change[change.length - 1];

  return (
    <div className="ex ab" data-room="light">
      {/* 开场：白房子里，一个人站在窗前往外看 */}
      <header className="ex-open m-wrap">
        <RoomMeta room="light" />
        <div className="ex-grid ab-open">
          <div className="ab-open-text">
            <h1 className="ex-h1 m-rise" style={{ '--delay': '60ms' } as Vars}>
              <Phrases text={aboutUi.title} />
            </h1>
            <p
              className="ex-note m-rise"
              style={{ '--delay': '120ms' } as Vars}
            >
              {studio.standard.character}
            </p>
            <div className="m-rise" style={{ '--delay': '180ms' } as Vars}>
              <Facts
                items={[
                  {
                    label: aboutUi.facts.beliefs,
                    value: studio.beliefs.length,
                  },
                  {
                    label: aboutUi.facts.practice,
                    value: studio.practice.rows.length,
                  },
                  {
                    label: aboutUi.facts.demands,
                    value: studio.demands.items.length,
                  },
                ]}
              />
            </div>
          </div>
          <Work
            name="about-window"
            no="01"
            ratio="16 / 10"
            focus="72% 56%"
            maxH="62svh"
            sizes="(max-width: 900px) 100vw, 64vw"
            eager
            className="ab-open-work"
          />
        </div>
      </header>

      {/* 什么变了：光照进来，标签上是这一节的最后一句 */}
      <section className="ex-screen m-wrap" aria-labelledby="ab-change-title">
        <div className="ex-grid ab-change">
          <Work
            name="ex-window-sun"
            no="02"
            ratio="3 / 2"
            focus="58% 40%"
            maxH="58svh"
            sizes="(max-width: 900px) 100vw, 56vw"
            className="ab-change-work"
          >
            {changeLast}
          </Work>
          <div className="ab-change-text" data-reveal>
            <p className="ex-kicker">{aboutUi.changed}</p>
            <h2 className="ex-h2" id="ab-change-title">
              <Phrases text={story.change.title} />
            </h2>
            <p className="ex-text ab-change-why">{why}</p>
            <Fold summary={aboutUi.whole}>
              {change.slice(0, 2).map((text) => (
                <p key={text} className="ex-text">
                  <WithEssayLink text={text} />
                </p>
              ))}
            </Fold>
            <div className="ab-change-more">
              <More href={essayHref('human-scale')}>{aboutUi.essay}</More>
            </div>
          </div>
        </div>
      </section>

      {/* 三种媒介，同一个动作：一件互动装置 */}
      <section className="ex-screen m-wrap" aria-labelledby="ab-trio-title">
        <div className="ex-grid ab-trio-head" data-reveal>
          <div className="ab-trio-title">
            <p className="ex-kicker" lang="en">
              {trio.kicker}
            </p>
            <h2 className="ex-h2" id="ab-trio-title">
              <Phrases text={trio.title} />
            </h2>
          </div>
          <p className="ex-label-solo ab-trio-label">
            <Label piece="trio" no="03" />
          </p>
        </div>
        <Trio />
      </section>

      {/* 六条信念：一面墙六件（首页「读完整的信念」链到这里） */}
      <section
        className="ex-screen m-wrap"
        id="beliefs"
        aria-labelledby="ab-beliefs-title"
      >
        <BeliefWall
          kicker={aboutUi.believe}
          title={aboutUi.beliefsTitle}
          titleId="ab-beliefs-title"
          items={studio.beliefs.map((belief, index) => ({
            title: belief.title,
            panel: (
              <Work
                name={beliefWorks[index].name}
                no={pad(index + 4)}
                ratio="3 / 2"
                focus={beliefWorks[index].focus}
                maxH="44svh"
                sizes="(max-width: 900px) 100vw, 56vw"
                className="ab-bw-work"
              >
                {belief.text}
              </Work>
            ),
          }))}
        />
      </section>

      {/* 这些信念怎样落到产品里：天窗的格子 */}
      <section className="ex-screen m-wrap" aria-labelledby="ab-practice-title">
        <div className="ex-grid ab-practice">
          <Work
            name="ex-skylight"
            no="10"
            ratio="4 / 5"
            focus="40% 40%"
            maxH="60svh"
            sizes="(max-width: 900px) 70vw, 30vw"
            className="ab-practice-work"
          >
            {studio.practice.lead}
          </Work>
          <div className="ab-practice-text" data-reveal>
            <p className="ex-kicker">{aboutUi.practice}</p>
            <h2 className="ex-h2" id="ab-practice-title">
              <Phrases text={studio.practice.title} />
            </h2>
            <dl className="ab-rows">
              {studio.practice.rows.map((row) => (
                <div key={row.choice}>
                  <dt>{row.choice}</dt>
                  <dd>{row.how}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 我们怎样要求自己：墙上的四段字（团队页「黑客与画家」链到这里） */}
      <section
        className="ex-screen m-wrap"
        id="demands"
        aria-labelledby="ab-demands-title"
      >
        <div className="ab-demands-head" data-reveal>
          <p className="ex-kicker">{aboutUi.demands}</p>
          <h2 className="ex-h2" id="ab-demands-title">
            <Phrases text={studio.demands.title} />
          </h2>
          <p className="ex-text">{studio.demands.lead}</p>
        </div>
        <ol className="ab-demands">
          {studio.demands.items.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              style={{ '--delay': `${index * 80}ms` } as Vars}
            >
              <span className="ex-no num" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <h3 className="ex-h2">{item.title}</h3>
              <p className="ex-text">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <NextRoom from="light" />
    </div>
  );
}
