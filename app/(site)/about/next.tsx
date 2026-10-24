import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { story, studio } from '../../../content/site/studio';
import { team, teamUi } from '../../../content/site/team';
import { alongGroups } from '../../../content/site/along';
import { nav } from '../../../content/site/nav';
import { products } from '../../../content/site/products';
import { aboutNext } from '../../../content/site/about';
import { ALONG, COMMUNITY, ENTERPRISE, PRODUCTS } from '../../_site/routes';
import { mediaOf, Note, Phrases, type Vars } from '../../_site/ui';
import { exUi, pieces } from '../../../content/site/exhibit';
import { Crew } from './crew';
import { Day, type DayStep } from './day';
import { LifeArt, StoryArt, ToolArt, WorkArt } from './day-art';
import { HeroLight } from './hero-light';
import { Makers } from './makers';
import {
  HUMAN_SCALE,
  Linked,
  Para,
  PRODUCTS as PRODUCT_LINKS,
  sentences,
  soonFirst,
} from './prose';
import { Spread } from './spread';
import { TreeEnd } from './end';
import { Typewriter } from './typewriter';
import { DrawingTable, IslandSketch } from './world';
import './about-next.css';

// 「关于」第四版（负责人 2026-10-22：「图退后，字和作品往前」）。整站的纸白，故事感靠字的节奏、站里真实的作品、往下滑时的变化。
// 整页只有三样东西——光（首屏一张照片）、线（沿途的墨线小图、产品线描、World 的铅笔）、画（团队画册、达·芬奇）：
//   ① 首屏：白房子，叶影缓缓地动，正中「Molis AI」，右下两行画外音（hero-light.tsx、typewriter.tsx）；
//   ② 当想法更容易变成现实：摊开——沿途 54 件真实的尝试随原句一步步变化，最后只留下并进产品的几件（spread.tsx）；
//      右上角那行小字去沿途（负责人 2026-10-23）；
//   ③④ 从怎样工作，走向怎样生活 → 从这些探索，看向更远的构想：同一扇窗（day.tsx）——字往下读，窗里换成各产品的线描，
//      「一天才逐渐完整」时四件并排，接着窗变成 World 的格纸，岛跟着 2.4 的三段字一层层画出来（world.tsx）；
//   ⑤ 联创团队：一进来就是这群人，一排肖像（crew.tsx）——从这里墙变成亚麻，是人的那一厅；两篇文章挂在作者一骏的卡上；
//   ⑥ 来路：一屏，三段字各配一张若隐若现的团队画册小插画（下面的三张卡负责人 2026-10-23 拿掉）；
//      进来时三幅画像墨在纸上洇开一样从中间一张张显出来，画与画之间一道点线连起来，最后停在「脑洞共居所」旁边一个杏色小点；
//   ⑦ 《黑客与画家》：一句过渡，油画与四张手稿（makers.tsx），墙回到纸白；
//   ⑧ 结尾「树下」（负责人 2026-10-24）：回到首屏的光——叶影落在纸白的墙上，打字机打出「Same taste? Stay a while.」，
//      光标停在一行空白里（Your turn.），访客可以直接写一句带去「聊一聊」；下面是另外三张半透明的卡（end.tsx）。
// 「我们相信什么」一屏负责人 2026-10-22 删去；原句仍在 content/site/studio.ts。
// 正文都是底稿原句（studio.ts、team.ts），每句只出现一次；新写的界面文字在 content/site/about.ts 的 aboutNext。
// 锚点照旧：#change、#products、#further、#people（旧地址 /team）、#yijun 等八个人、#origin、#makers。

const tries = alongGroups.flatMap((group) => group.items).length;

/**
 * 团队画册的「若隐若现」挂法（负责人 2026-10-22 喜欢「一船脑洞」这样）：不装框，四周慢慢淡进墙里，
 * 下面一行小字是题目和媒介。来路三段各配一张小幅，结尾那张宽一点
 */
function Vignette({
  name,
  sizes,
  className = '',
}: {
  name: 'art-boat' | 'art-sun' | 'art-house';
  sizes: string;
  className?: string;
}) {
  const image = mediaOf(name);
  return (
    <figure className={`an-vignette ${className}`} data-reveal>
      <img
        src={image.src}
        srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={pieces[name].alt}
        loading="lazy"
        decoding="async"
      />
      <figcaption className="an-vignette-name">
        {pieces[name].title} · {exUi.medium.album}
      </figcaption>
    </figure>
  );
}

export function AboutNext() {
  const change = story.change.paragraphs;
  const toLife = story.toLife.paragraphs;
  const further = story.further.paragraphs;
  const firstSoon = soonFirst([...toLife, ...further]);
  const later = (text: string) => firstSoon.get(text);
  const [big, ask] = sentences(change[2]);
  const [leadFirst, ...leadRest] = sentences(team.lead);
  const para = (text: string) => (
    <Para key={text} text={text} links={PRODUCT_LINKS} later={later(text)} />
  );
  const places = aboutNext.world.places;
  const worldLabel = (
    <>
      <span lang="en">{products.world.name}</span>
      <Note>{teamUi.concept}</Note>
    </>
  );

  // ③ 一扇窗，一天：Work 与 Tool 同一段 → Life → Story
  const day: DayStep[] = [
    {
      key: 'work',
      tone: 'work',
      art: (
        <>
          <WorkArt />
          <ToolArt />
        </>
      ),
      caption: (
        <>
          <span lang="en">{products.work.name}</span>
          <span lang="en">{products.tool.name}</span>
        </>
      ),
      body: toLife.slice(0, 2).map(para),
    },
    {
      key: 'life',
      tone: 'life',
      art: <LifeArt />,
      caption: <span lang="en">{products.life.name}</span>,
      body: toLife.slice(2, 4).map(para),
    },
    {
      key: 'story',
      tone: 'story',
      art: <StoryArt />,
      caption: <span lang="en">{products.story.name}</span>,
      body: para(toLife[4]),
    },
    // 「一天才逐渐完整」：四件并排，窗顶那条线走满
    {
      key: 'day',
      tone: 'day',
      art: (
        <>
          <WorkArt />
          <ToolArt />
          <LifeArt />
          <StoryArt />
        </>
      ),
      body: (
        <p className="dy-close">
          <Phrases text={toLife[5]} />
        </p>
      ),
    },
    // ④ 2.4：窗变成 World 的格纸，岛跟着三段字一层层画出来
    {
      key: 'further',
      tone: 'world',
      fig: <DrawingTable places={places} label={worldLabel} />,
      body: (
        <>
          <h2 className="dy-ch" id="further">
            <Phrases text={story.further.title} />
          </h2>
          <p className="dy-lead">{further[0]}</p>
        </>
      ),
    },
    { key: 'world', tone: 'world', body: para(further[1]) },
    { key: 'now', tone: 'world', body: <Para text={further[2]} /> },
  ];

  // 1.2 末句按逗号分成两行，一字不动
  const doors = aboutNext.doors;
  const others = [
    { ...doors.products, href: PRODUCTS },
    { ...doors.enterprise, href: ENTERPRISE },
    { ...doors.community, href: COMMUNITY },
  ];

  return (
    <div className="an">
      {/* ① 首屏：满幅一张大图，主线用打字机打出来 */}
      <header className="an-hero" data-tone="film">
        <HeroLight />
        <div className="an-hero-body">
          {/* 字标的规格与首页首屏一致（负责人 2026-10-19）：浮上来，不打字 */}
          <h1 className="an-mark" lang="en">
            {aboutNext.hero.mark}
          </h1>
          <Typewriter
            start={1500}
            between={700}
            lines={[
              {
                // 底稿 1.1 那句「Molis AI 是一间……的工作室。」：大字 Molis AI 当主语，这里接着后半句，连起来一字不差
                text: studio.one.replace(/^Molis AI\s*/, ''),
                as: 'p',
                className: 'an-sub',
                pace: 70,
              },
              {
                text: aboutNext.hero.voice[0],
                as: 'p',
                className: 'an-voice an-voice-a',
                pace: 90,
              },
              {
                text: aboutNext.hero.voice[1],
                as: 'p',
                className: 'an-voice an-voice-b',
                pace: 60,
              },
            ]}
          />
        </div>
      </header>

      {/* ② 当想法更容易变成现实：摊开 */}
      <section className="an-ch an-ch1" aria-labelledby="change">
        <Spread
          title={
            <h2 className="sp-title" id="change">
              <Phrases text={story.change.title} />
            </h2>
          }
          lines={[...sentences(change[0]), ...sentences(change[1])].map(
            (line) => (
              <Linked key={line} text={line} links={[HUMAN_SCALE]} />
            ),
          )}
          big={big}
          ask={ask}
          beat={change[3]}
          credit={
            <Link
              className="sp-credit-link"
              href={ALONG}
              aria-label={`看${nav.aboutItems.along}`}
            >
              {aboutNext.spread.credit(tries)}
              <ArrowRight size={13} strokeWidth={1.6} aria-hidden />
            </Link>
          }
        />
      </section>

      {/* ③④ 从怎样工作，走向怎样生活 → 从这些探索，看向更远的构想：同一扇窗 */}
      <section className="an-ch an-ch2 m-wrap" aria-labelledby="products">
        <header className="an-open" data-reveal>
          <h2 className="an-open-title" id="products">
            <Phrases text={story.toLife.title} />
          </h2>
          <p className="an-open-lead">
            <Phrases text={studio.short[2]} />
          </p>
        </header>
        <Day
          steps={day}
          world={
            <div className="wd wd-live">
              <IslandSketch places={places} />
            </div>
          }
          worldCaption={worldLabel}
        />
      </section>

      {/* ⑤⑥ 人的那一厅：墙慢慢变成亚麻 */}
      <div className="an-hall">
        {/* ⑤ 联创团队：一进来就是这群人 */}
        <section
          className="an-crew m-wrap"
          id="people"
          aria-labelledby="crew-title"
        >
          <div className="cr-head" data-reveal>
            <h2 className="cr-title" id="crew-title">
              {teamUi.crew}
            </h2>
            <p className="cr-lead">
              <span className="cr-lead-first">{leadFirst}</span>
              <span className="cr-lead-rest">{leadRest.join('')}</span>
            </p>
          </div>
          <Crew />
          <p className="cr-fine">{teamUi.tagNote}</p>
        </section>

        {/* ⑥ 来路：一屏。三段字各配一张若隐若现的小插画 */}
        <section className="an-origin m-wrap" aria-labelledby="origin">
          <h2 className="og-title" id="origin" data-reveal>
            <Phrases text={story.origin.title} />
          </h2>
          <div className="og-three">
            {story.origin.paragraphs.map((text, index) => (
              <div
                key={text}
                className="og-item"
                style={{ '--delay': `${index * 160}ms` } as Vars}
              >
                <Vignette
                  name={(['art-boat', 'art-sun', 'art-house'] as const)[index]}
                  sizes="(max-width: 900px) 60vw, 260px"
                  className="og-vignette"
                />
                <p className="og-p" data-reveal>
                  {text}
                </p>
              </div>
            ))}
            {/* 来路：画与画之间两段点线，一段接一段画出来 */}
            {[0, 1].map((index) => (
              <div
                key={index}
                className={`og-road og-road-${index + 1}`}
                data-reveal
                aria-hidden="true"
                style={{ '--delay': `${700 + index * 500}ms` } as Vars}
              >
                <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M2 30Q50 2 98 30" />
                </svg>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ⑦ 《黑客与画家》：一屏，墙回到纸白 */}
      <section
        className="an-makers m-wrap"
        id="makers"
        aria-labelledby="makers-title"
      >
        <Makers />
      </section>

      {/* ⑧ 结尾「树下」：回到光里，最后轮到访客说（end.tsx） */}
      <section className="an-end" aria-labelledby="doors-title">
        <TreeEnd line={aboutNext.end.title} others={others} />
      </section>
    </div>
  );
}
