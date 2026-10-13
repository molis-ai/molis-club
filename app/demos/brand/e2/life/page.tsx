'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { folioLife } from '../../../../../content/folio-life';
import { folioWorld } from '../../../../../content/folio-world';
import { shotLabels, shots } from '../../../../../content/molis-life';
import { Pip, WorldPip } from '../axo';
import { HOME, STORY, WORLD, contactHref, pad, productName } from '../routes';
import {
  Actions,
  E2Page,
  Kicker,
  NextProduct,
  Phrases,
  Plate,
  SectionHead,
  Status,
  Tag,
  type Vars,
} from '../shell';
import { HomeCorner, LifeObject } from './art';
import './life.css';

// E2 · Molis Life：最「慢」的一页。居家尺度、留白多、进场慢；概念稿清楚标注，原型能做到哪一步写清楚。
// 顺序与 Folio 最新版一致：首屏 → 概念稿 → 它陪你做的三件事（每步标示意）→ 它怎么理解你（原型现在做到哪）
// → 决定权在你 → 和 Story、World 的关系 → 还在路上。文案全部来自 content/folio-life.ts 与 content/molis-life.ts。
// 首屏的居家一角里，纸箱、窗外的海、小几上的书各对应三件事中的一件，点了会切到下面那件事。

const life = folioLife;
const stories = life.example.stories;
const objects = ['return', 'sea', 'curious'] as const;

/** World 页里写好的三个产品的角色：真实生活、虚构世界、你的小世界 */
const roles = Object.fromEntries(
  folioWorld.family.items.map((item) => [item.id, item.role]),
) as Record<string, string>;

function Hero({ onPick }: { onPick: (index: number) => void }) {
  const { hero } = life;
  const tabs = stories.map((story) => story.tab);
  return (
    <section className="el-hero" aria-labelledby="el-title">
      <div className="el-hero-copy">
        <Kicker>{hero.kicker}</Kicker>
        <h1 id="el-title">
          <Phrases text={hero.title} />
        </h1>
        <p className="el-lead">{hero.lead}</p>
        <Status items={hero.status} />
        <Actions
          items={[
            { label: hero.actions.follow, href: contactHref('life') },
            { label: hero.actions.example, href: '#example', tone: 'ghost' },
          ]}
        />
      </div>
      <figure className="el-hero-art">
        <HomeCorner labels={tabs} href="#example" onPick={onPick} />
        <ul className="el-legend">
          {tabs.map((tab, index) => (
            <li key={tab}>
              <a href="#example" onClick={() => onPick(index)}>
                <i aria-hidden="true">{pad(index)}</i>
                {tab}
              </a>
            </li>
          ))}
        </ul>
        <figcaption className="el-figcaption">
          <span>
            <b lang="en">Fig. 01</b>
            居家一角 · 轴测，点物件看它陪你做的事
          </span>
          <em>概念示意</em>
        </figcaption>
      </figure>
    </section>
  );
}

/** 概念稿：电脑上的生活空间，手机压在右下角；随滚动手机比窗口多走一点，像两层纸 */
function Shots() {
  return (
    <section className="el-shots" aria-label={`${shotLabels.desktop} 概念稿`}>
      <Plate
        fig="Fig. 02"
        caption={`${shotLabels.desktop} · ${life.roadmap.items[2].title}`}
        note={life.hero.shotNote}
        className="el-shots-plate"
      >
        <div className="el-devices" data-scene="pass">
          <div className="el-window" data-reveal>
            <div className="el-window-bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span lang="en">{shotLabels.desktop}</span>
            </div>
            <img
              src={shots.desktop.src}
              width={shots.desktop.w}
              height={shots.desktop.h}
              alt=""
              loading="lazy"
            />
          </div>
          <div
            className="el-phone"
            data-reveal
            style={{ '--d': '240ms' } as Vars}
          >
            <img
              src={shots.mobile.src}
              width={shots.mobile.w}
              height={shots.mobile.h}
              alt=""
              loading="lazy"
            />
          </div>
        </div>
      </Plate>
    </section>
  );
}

/** 三件事：一次看一件，从一句话走到有结果；方向键在三件之间切换，每一步都标「示意」 */
function Example({
  active,
  setActive,
}: {
  active: number;
  setActive: (index: number) => void;
}) {
  const { example } = life;
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const story = stories[active];
  const move = (event: KeyboardEvent, index: number) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: stories.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = (keys[event.key] + stories.length) % stories.length;
    setActive(next);
    tabs.current[next]?.focus();
  };
  return (
    <section
      id="example"
      className="el-section el-example"
      aria-labelledby="el-example-title"
    >
      <SectionHead
        id="el-example-title"
        index={0}
        kicker={example.kicker}
        title={example.title}
        lead={example.note}
        layout="split"
      />
      <div className="el-tabs" role="tablist" aria-label={example.kicker}>
        {stories.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`el-tab-${item.id}`}
            aria-selected={index === active}
            aria-controls="el-example-panel"
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => move(event, index)}
          >
            <i aria-hidden="true">{pad(index)}</i>
            {item.tab}
          </button>
        ))}
      </div>
      <div
        className="el-story"
        role="tabpanel"
        id="el-example-panel"
        aria-labelledby={`el-tab-${story.id}`}
        key={story.id}
      >
        <div className="el-story-lead">
          <Plate
            fig={`Fig. 03 · ${pad(active)}`}
            caption={story.tab}
            note="概念示意"
            className="el-object-plate"
          >
            <LifeObject kind={objects[active]} />
          </Plate>
        </div>
        {/* 先是你说的一句话，再是它接下来怎么陪你走 */}
        <div className="el-story-flow">
          <blockquote>{story.quote}</blockquote>
          <ol className="el-steps">
            {story.steps.map((step, index) => (
              <li key={step} style={{ '--i': index } as Vars}>
                <span className="el-step-no" aria-hidden="true">
                  {pad(index)}
                </span>
                <p>
                  {step}
                  <Tag>{example.stepTag}</Tag>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** 它怎么理解你：三条原则，再用一张两行的表写清楚原型现在做到哪、哪些还在规划中 */
function Understand() {
  const { understand, hero } = life;
  const { now } = understand;
  const sentences = now.text.split(/(?<=。)/).filter(Boolean);
  return (
    <section
      className="el-section el-understand"
      aria-labelledby="el-understand-title"
    >
      <SectionHead
        id="el-understand-title"
        index={1}
        kicker={understand.kicker}
        title={understand.title}
      />
      <ol className="el-principles">
        {understand.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--d': `${index * 180}ms` } as Vars}
          >
            <span className="el-step-no" aria-hidden="true">
              {pad(index)}
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
      <aside className="el-now" aria-labelledby="el-now-title" data-reveal>
        <h3 id="el-now-title">{now.title}</h3>
        {sentences.length === 2 ? (
          <dl>
            <div>
              <dt>
                <span className="el-now-dot" aria-hidden="true" />
                {hero.status[0]}
              </dt>
              <dd>{sentences[0]}</dd>
            </div>
            <div>
              <dt>
                <Tag>{now.tag}</Tag>
              </dt>
              <dd>{sentences[1]}</dd>
            </div>
          </dl>
        ) : (
          <p>
            {now.text}
            <Tag>{now.tag}</Tag>
          </p>
        )}
      </aside>
    </section>
  );
}

/**
 * 「它准备，你决定」的小演示：拿「想陪妈妈去看海」那件事当例子（示意）。
 * 点「替我准备」，卡片只走到「准备中」；点「以后再说」，卡片去「以后」，愿望还在；也可以先暂停它。
 * 卡片底下那句话直接取自上面的规矩原文。
 */
function DecideDemo() {
  const { control } = life;
  const sea = stories.find((item) => item.id === 'sea') ?? stories[1];
  const [choice, setChoice] = useState<'ask' | 'prepare' | 'later'>('ask');
  const [paused, setPaused] = useState(false);
  const col = choice === 'ask' ? 0 : choice === 'prepare' ? 1 : 2;
  const note = paused
    ? control.items[0]
    : choice === 'prepare'
      ? control.items[2]
      : choice === 'later'
        ? control.items[3]
        : sea.steps[1];
  return (
    <figure
      className="el-decide"
      data-paused={paused || undefined}
      aria-label="示意：一条建议，由你决定准备、延后或暂停"
    >
      <div className="el-decide-bar">
        <span className="el-decide-title">示意 · {sea.tab}</span>
        <button
          type="button"
          className="el-decide-pause"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          <span aria-hidden="true" />
          {paused ? '已暂停' : '暂停它'}
        </button>
      </div>
      <div className="el-decide-lanes" style={{ '--col': col } as Vars}>
        <span className="el-decide-lane" data-on={col === 0 || undefined}>
          建议
        </span>
        <span className="el-decide-lane" data-on={col === 1 || undefined}>
          准备中
        </span>
        <span className="el-decide-lane" data-on={col === 2 || undefined}>
          以后
        </span>
        <div className="el-decide-card" data-choice={choice}>
          <strong>{sea.quote}</strong>
          {choice === 'ask' ? (
            <span className="el-decide-actions">
              <button
                type="button"
                disabled={paused}
                onClick={() => setChoice('prepare')}
              >
                替我准备
              </button>
              <button
                type="button"
                disabled={paused}
                onClick={() => setChoice('later')}
              >
                以后再说
              </button>
            </span>
          ) : (
            <button
              type="button"
              className="el-decide-reset"
              onClick={() => setChoice('ask')}
            >
              重来
            </button>
          )}
        </div>
      </div>
      <figcaption aria-live="polite">{note}</figcaption>
    </figure>
  );
}

/** 决定权在你：深色的一段，五条规矩一条一条慢慢亮起来；下面一张可以动手试的小卡 */
function Control() {
  const { control } = life;
  return (
    <section
      className="el-section el-control"
      aria-labelledby="el-control-title"
    >
      <div className="el-control-grid">
        <SectionHead
          id="el-control-title"
          index={2}
          kicker={control.kicker}
          title={control.title}
        />
        <ol className="el-rules">
          {control.items.map((item, index) => (
            <li
              key={item}
              data-reveal
              style={{ '--d': `${index * 140}ms` } as Vars}
            >
              <span className="el-step-no" aria-hidden="true">
                {pad(index)}
              </span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </div>
      <DecideDemo />
    </section>
  );
}

/** 和 Story、World 的关系：三块图版排成一行，Life 在最前；World 里冒出的真实想法，虚线绕回 Life */
function Relations() {
  const { worlds } = life;
  return (
    <section
      className="el-section el-relations"
      aria-labelledby="el-worlds-title"
    >
      <div className="el-relations-grid">
        <div className="el-relations-copy">
          <SectionHead
            id="el-worlds-title"
            index={3}
            kicker={worlds.kicker}
            title={worlds.title}
          />
          <p className="el-relations-text" data-reveal>
            {worlds.text}
          </p>
        </div>
        <div className="el-rel" data-reveal>
          <div className="el-rel-row">
            <div className="el-rel-item el-rel-here">
              <span className="el-rel-art" data-draw>
                <Pip kind="life" />
              </span>
              <small>{roles.life}</small>
              <strong lang="en">{productName.life}</strong>
            </div>
            <Link href={STORY} className="el-rel-item">
              <span className="el-rel-art" data-draw>
                <Pip kind="story" />
              </span>
              <small>{roles.story}</small>
              <span className="el-rel-link">
                {worlds.story}
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
            <Link href={WORLD} className="el-rel-item el-rel-concept">
              <span className="el-rel-art" data-draw>
                <WorldPip />
              </span>
              <small>
                {roles.world}
                <Tag>{worlds.worldTag}</Tag>
              </small>
              <span className="el-rel-link">
                {worlds.world}
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          </div>
          <svg
            className="el-rel-loop"
            viewBox="0 0 300 24"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M 250 2 V 14 Q 250 22 242 22 H 58 Q 50 22 50 14 V 2" />
            <path className="el-rel-head" d="M 46 7 L 50 2 L 54 7" />
          </svg>
        </div>
      </div>
    </section>
  );
}

/** 还在路上：路线图类的内容各只留一行，排成一张规格表 */
function Roadmap() {
  const { roadmap } = life;
  return (
    <section
      className="el-section el-roadmap"
      aria-labelledby="el-roadmap-title"
    >
      <SectionHead id="el-roadmap-title" index={4} title={roadmap.kicker} />
      <ul className="el-road">
        {roadmap.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--d': `${index * 120}ms` } as Vars}
          >
            <span className="el-step-no" aria-hidden="true">
              {pad(index)}
            </span>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Closing() {
  const { closing } = life;
  return (
    <>
      <section className="el-closing" aria-labelledby="el-closing-title">
        <h2 id="el-closing-title" data-reveal>
          <Phrases text={closing.title} />
        </h2>
        <div
          className="el-closing-side"
          data-reveal
          style={{ '--d': '160ms' } as Vars}
        >
          <span className="el-closing-art" data-draw>
            <Pip kind="life" />
          </span>
          <Actions
            items={[
              { label: closing.follow, href: contactHref('life') },
              { label: closing.home, href: HOME, tone: 'ghost' },
            ]}
          />
        </div>
      </section>
      <NextProduct current="life" />
    </>
  );
}

export default function E2LifePage() {
  const [active, setActive] = useState(0);
  return (
    <E2Page current="life" className="el" footer={<Closing />}>
      <Hero onPick={setActive} />
      <Shots />
      <Example active={active} setActive={setActive} />
      <Understand />
      <Control />
      <Relations />
      <Roadmap />
    </E2Page>
  );
}
