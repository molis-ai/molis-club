import Link from 'next/link';
import { pageMetadata } from '../../../lib/site';
import { story, studio } from '../../../content/site/studio';
import { aboutUi, trio } from '../../../content/site/about';
import { nav } from '../../../content/site/nav';
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
import { ReviewSwitch } from '../../_site/review/comparison';
import { BeliefWall } from './belief-wall';
import { AboutOne } from './one';
import { Trio } from './trio';
import './about.css';

type Props = { searchParams: Promise<{ study?: string }> };

/** 样张的标题是「关于」（一页里不止信念）；现版照旧是「我们相信什么」 */
export async function generateMetadata({ searchParams }: Props) {
  const { study } = await searchParams;
  return pageMetadata(
    study === 'one' ? nav.about : aboutUi.title,
    studio.standard.character,
    ABOUT,
  );
}

// 展厅 02「我们相信什么」· 主题：光（负责人 2026-10-15 定：「关于」做成一场展，这是第二间，白墙）。
// 开场（窗前的人）· 什么变了（光照进来）· 三种媒介（互动装置）· 六条信念（一面墙六件，点标题换一件）·
// 下一个展厅。每屏一个视口放得下。「落到产品里」「我们怎样要求自己」两段按负责人 2026-10-18 的要求删去，
// 原句仍留在 content/site/studio.ts。
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

// 一页式样张（C1）：/about?study=one；/about?study=current 是带比较条的现版。不带参数时照旧是现版，不出现比较条。
export default async function AboutPage({ searchParams }: Props) {
  const { study } = await searchParams;
  const one = study === 'one';
  return (
    <>
      {one ? <AboutOne /> : <AboutCurrent />}
      {one || study === 'current' ? (
        <ReviewSwitch
          label={nav.about}
          variant={one ? 'sample' : 'current'}
          currentHref={`${ABOUT}?study=current`}
          sampleHref={`${ABOUT}?study=one`}
        />
      ) : null}
    </>
  );
}

function AboutCurrent() {
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

      <NextRoom from="light" />
    </div>
  );
}
