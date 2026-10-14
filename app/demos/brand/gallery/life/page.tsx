'use client';
import Link from 'next/link';
import { useRef, useState, type KeyboardEvent } from 'react';
import { shotLabels, shots } from '../../../../../content/molis-life';
import { folioLife } from '../../../../../content/folio-life';
import { WatercolorList } from '../home-works';
import {
  Actions,
  Btn,
  Caption,
  Closing,
  Framed,
  More,
  NextRoom,
  Phrases,
  Plate,
  Shell,
  Status,
  Tag,
  type Vars,
} from '../kit';
import { HOME, STORY, WORLD, contactHref } from '../routes';
import '../art-r7.css';
import './life.css';

// Molis Life · Room 3 的生活小间。内容与 Folio 的 Life 页同一份、同一个顺序（A3）：
// 首屏 → 概念稿 → 它陪你做的三件事 → 它怎么理解你 → 决定权在你 → 和 Story、World 的关系 → 还在路上。
// 展览的做法：整页像一间朝南的小屋，墙上一块窗光随着往下读从早晨移到傍晚（位置、角度和色温都在变）；
// 首屏挂着首页那幅水彩清单；三件事是画轨上的三张小画，一次看一件；理解你的方式是钉在墙上的便条；
// 决定权是一块家规牌。每一步例子都标「示意」，原型做不到的标「规划中」。

/** 窗光：一扇四格窗投在墙上的光，跟着整页的阅读进度（--page）从左上走到右下，由冷转暖 */
function Daylight() {
  return (
    <div className="g-life-sun" aria-hidden="true">
      <span className="g-life-sun-patch">
        <i />
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

function Hero() {
  const { hero } = folioLife;
  return (
    <section className="g-life-hero" aria-labelledby="g-life-title">
      <div className="g-life-hero-copy">
        <p className="g-life-kicker">
          <span className="g-soft" lang="en" aria-hidden="true">
            Room 3
          </span>
          <span>{hero.kicker}</span>
        </p>
        <h1 id="g-life-title" className="g-life-title">
          <Phrases text={hero.title} />
        </h1>
        <p className="g-lead">{hero.lead}</p>
        <Status items={hero.status} />
        <Actions>
          <Btn href={contactHref('life')}>{hero.actions.follow}</Btn>
          <More href="#example">{hero.actions.example}</More>
        </Actions>
      </div>
      <figure className="g-life-hero-art">
        <div className="g-life-hero-wall">
          <WatercolorList />
        </div>
        <Caption title="Room 3">水彩清单 · 概念稿</Caption>
      </figure>
    </section>
  );
}

/** 概念稿：一大一小两件，电脑上的一页挂在墙上，手机那张立在一旁的小台子上 */
function Screens() {
  const { hero } = folioLife;
  return (
    <section className="g-life-screens g-wrap" aria-label="Molis Life 概念稿">
      <div className="g-life-screens-row" data-reveal>
        <figure className="g-life-desktop">
          <Framed tone="white">
            <img
              src={shots.desktop.src}
              width={shots.desktop.w}
              height={shots.desktop.h}
              alt=""
              loading="lazy"
            />
          </Framed>
          <Caption title={shotLabels.desktop} />
        </figure>
        <figure className="g-life-phone">
          <div className="g-life-phone-body">
            <img
              src={shots.mobile.src}
              width={shots.mobile.w}
              height={shots.mobile.h}
              alt=""
              loading="lazy"
            />
          </div>
          <span className="g-life-plinth" />
        </figure>
      </div>
      <p className="g-life-shotnote">{hero.shotNote}</p>
    </section>
  );
}

/** 它陪你做的三件事：画轨上挂着三张小画，一次看一件；方向键可以在三件之间切换 */
function Example() {
  const { example } = folioLife;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const story = example.stories[active];
  const move = (event: KeyboardEvent, index: number) => {
    const step =
      event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next =
      (index + step + example.stories.length) % example.stories.length;
    setActive(next);
    tabs.current[next]?.focus();
  };
  return (
    <section
      id="example"
      className="g-life-example g-wrap g-section"
      aria-labelledby="g-life-example-title"
    >
      <Plate
        id="g-life-example-title"
        index="I"
        kicker={example.kicker}
        title={example.title}
        side={<p>{example.note}</p>}
      />
      <div className="g-life-rail" role="tablist" aria-label={example.kicker}>
        {example.stories.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`g-life-tab-${item.id}`}
            aria-selected={index === active}
            aria-controls="g-life-example-panel"
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => move(event, index)}
            data-k={index}
          >
            <span className="g-life-wire" aria-hidden="true" />
            <span className="g-life-mini" aria-hidden="true">
              <i />
            </span>
            <span className="g-life-tab-label">
              <span className="g-soft">{index + 1}</span>
              {item.tab}
            </span>
          </button>
        ))}
      </div>
      <div
        className="g-life-story"
        role="tabpanel"
        id="g-life-example-panel"
        aria-labelledby={`g-life-tab-${story.id}`}
        key={story.id}
        data-k={active}
      >
        <blockquote>{story.quote}</blockquote>
        <ol className="g-life-steps">
          {story.steps.map((step, index) => (
            <li key={step} style={{ '--i': index } as Vars}>
              <span className="g-soft" aria-hidden="true">
                {index + 1}
              </span>
              <p>
                {step}
                <Tag>{example.stepTag}</Tag>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 它怎么理解你：三张钉在墙上的便条，原型现在能做到哪一步写在一张虚线卡上 */
function Understand() {
  const { understand } = folioLife;
  return (
    <section
      className="g-life-understand g-wrap g-section"
      aria-labelledby="g-life-understand-title"
    >
      <Plate
        id="g-life-understand-title"
        index="II"
        kicker={understand.kicker}
        title={understand.title}
      />
      <ol className="g-life-notes">
        {understand.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--delay': `${index * 120}ms`, '--k': index } as Vars}
          >
            <i className="g-life-pin" aria-hidden="true" />
            <span className="g-soft" aria-hidden="true">
              {index + 1}
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
      <aside className="g-life-now" data-reveal>
        <strong>
          {understand.now.title}
          <Tag>{understand.now.tag}</Tag>
        </strong>
        <p>{understand.now.text}</p>
      </aside>
    </section>
  );
}

/** 决定权在你：一块挂在门边的家规牌 */
function Control() {
  const { control } = folioLife;
  return (
    <section
      className="g-life-control g-wrap g-section"
      aria-labelledby="g-life-control-title"
    >
      <div className="g-life-control-head" data-reveal>
        <p className="g-life-control-kicker">
          <span className="g-soft">III</span>
          <span>{control.kicker}</span>
        </p>
        <h2 id="g-life-control-title">{control.title}</h2>
      </div>
      <div className="g-life-rules" data-reveal>
        <ol>
          {control.items.map((item, index) => (
            <li key={item}>
              <span className="g-soft" aria-hidden="true">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 和 Story、World 的关系：三扇门，Life 在中间亮着，两边通向 Story 与 World */
function Worlds() {
  const { worlds } = folioLife;
  return (
    <section
      className="g-life-worlds g-wrap g-section"
      aria-labelledby="g-life-worlds-title"
    >
      <Plate
        id="g-life-worlds-title"
        index="IV"
        kicker={worlds.kicker}
        title={worlds.title}
        side={<p>{worlds.text}</p>}
      />
      <div className="g-life-doors" data-reveal>
        <Link className="g-life-door" href={STORY} data-to="story">
          <span className="g-life-door-frame" aria-hidden="true">
            <i />
          </span>
          <span className="g-life-door-label">{worlds.story}</span>
        </Link>
        <span className="g-life-door g-life-door-here" aria-hidden="true">
          <span className="g-life-door-frame">
            <i />
          </span>
          <span className="g-life-door-label" lang="en">
            Molis Life
          </span>
        </span>
        <Link className="g-life-door" href={WORLD} data-to="world">
          <span className="g-life-door-frame" aria-hidden="true">
            <i />
          </span>
          <span className="g-life-door-label">
            {worlds.world}
            <Tag>{worlds.worldTag}</Tag>
          </span>
        </Link>
      </div>
    </section>
  );
}

/** 还在路上：四行，像贴在墙上的一张计划表 */
function Roadmap() {
  const { roadmap } = folioLife;
  return (
    <section
      className="g-life-roadmap g-wrap g-section"
      aria-labelledby="g-life-roadmap-title"
    >
      <h2 id="g-life-roadmap-title" className="g-kicker">
        {roadmap.kicker}
      </h2>
      <ul>
        {roadmap.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--delay': `${index * 90}ms` } as Vars}
          >
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Ending() {
  const { closing } = folioLife;
  return (
    <>
      <Closing id="g-life-closing-title" title={closing.title}>
        <Actions>
          <Btn href={contactHref('life')}>{closing.follow}</Btn>
          <More href={HOME}>{closing.home}</More>
        </Actions>
      </Closing>
      <div className="g-next-wrap">
        <NextRoom current="life" />
      </div>
    </>
  );
}

export default function GalleryLife() {
  return (
    <Shell current="life" className="g-life-page" ending={<Ending />}>
      <Daylight />
      <Hero />
      <Screens />
      <Example />
      <Understand />
      <Control />
      <Worlds />
      <Roadmap />
    </Shell>
  );
}
