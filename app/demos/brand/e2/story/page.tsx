'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { folioStory } from '../../../../../content/folio-story';
import {
  boundaries,
  closing,
  different,
  hero,
  journey,
  journeyImages,
  windowsNote,
  worlds,
  worldsIntro,
} from '../../../../../content/molis-story';
import { Pip } from '../axo';
import { COMMUNITY, HOME, WORLD, contactHref, pad } from '../routes';
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
import { Hall, Here, Party, Threshold } from './art';
import './story.css';

// E2 · Molis Story：最「深」的一页。首屏是「此处」的厅，四道拱门里是四个世界；
// 往下「此处 → 彼处 → 归来」是一段粘性舞台，随滚动穿过一道门进入下一幅画面；每个世界的画面从一道拱门里
// 慢慢打开，旁边写清怎么玩、带回什么。顺序与 Folio 最新版一致：首屏 → 旅程（归来后可放进 World）→ 四个世界
// → 和谁一起去（规划中）→ 自己做一个世界（规划中）→ 一段有限的旅程 → 进门前先说清楚。
// 文案来自 content/molis-story.ts 与 content/folio-story.ts；生成的画面标「概念画面」，博物馆标示例照片。

const { company, create } = folioStory;
/** 「不是游戏」一条去掉：Story 不限定是不是游戏，每个世界各自说明（A4） */
const differentItems = different.items.filter(
  (item) => item.title !== '不是游戏',
);

function Hero() {
  return (
    <section className="es-hero" aria-labelledby="es-title" data-scene="leave">
      <div className="es-hero-copy">
        <Kicker>{hero.kicker}</Kicker>
        <h1 id="es-title">
          <Phrases text={hero.title} />
        </h1>
        <p className="es-lead">{folioStory.hero.lead}</p>
        <p className="es-planned">{folioStory.hero.planned}</p>
        <Status items={hero.status} />
        <Actions
          items={[
            { label: hero.actions.follow, href: contactHref('story') },
            { label: hero.actions.worlds, href: '#worlds', tone: 'ghost' },
          ]}
        />
      </div>
      <figure className="es-hero-art">
        <Hall worlds={worlds} />
        <ul className="es-legend">
          {worlds.map((world, index) => (
            <li key={world.id}>
              <a href={`#${world.id}`}>
                <i aria-hidden="true">{pad(index)}</i>
                {world.name}
              </a>
            </li>
          ))}
        </ul>
        <figcaption className="es-figcaption">
          <span>
            <b lang="en">Fig. 01</b>
            {journey.steps[0].title} · 点一道门，看门后的世界
          </span>
          <em>{windowsNote}</em>
        </figcaption>
      </figure>
    </section>
  );
}

/** 此处 → 彼处 → 归来：左边三步，右边一块粘性舞台，滚动时穿过一道拱门走进下一幅画面 */
function Journey() {
  const shots = journeyImages;
  return (
    <section
      className="es-section es-journey"
      aria-labelledby="es-journey-title"
    >
      <SectionHead
        id="es-journey-title"
        index={0}
        kicker={journey.kicker}
        title={journey.title}
      />
      <div className="es-pass" data-scene="pin" data-steps="3">
        <div className="es-pass-sticky">
          <ol className="es-pass-steps">
            {journey.steps.map((step, index) => {
              const shot = shots[index];
              return (
                <li key={step.title} data-i={index}>
                  <span className="es-no" aria-hidden="true">
                    {pad(index)}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <span className="es-pass-thumb">
                    {shot ? (
                      <img
                        src={shot.src}
                        width={shot.w}
                        height={shot.h}
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <Here worlds={worlds} />
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
          <Plate
            fig="Fig. 02"
            caption={journey.kicker}
            note={windowsNote}
            className="es-stage-plate"
          >
            <div className="es-stage" aria-hidden="true">
              <div className="es-layer es-layer-0">
                <Here worlds={worlds} />
              </div>
              {shots.map((shot, index) =>
                shot ? (
                  <div key={shot.src} className={`es-layer es-layer-${index}`}>
                    <img
                      src={shot.src}
                      width={shot.w}
                      height={shot.h}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                ) : null,
              )}
              <ol className="es-stage-steps">
                {journey.steps.map((step, index) => (
                  <li key={step.title} data-i={index}>
                    <i>{pad(index)}</i>
                    {step.title}
                  </li>
                ))}
              </ol>
            </div>
          </Plate>
        </div>
      </div>
      <p className="es-after" data-reveal>
        <span>{folioStory.afterReturn.text}</span>
        <Link href={WORLD} className="e2-link">
          {folioStory.afterReturn.link}
          <Tag>{folioStory.afterReturn.tag}</Tag>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}

/** 四个世界：画面从一道拱门里随滚动打开；右边写清它和你人生的关系、怎么玩、带回什么 */
function Worlds() {
  return (
    <section
      id="worlds"
      className="es-section es-worlds"
      aria-labelledby="es-worlds-title"
    >
      <SectionHead
        id="es-worlds-title"
        index={1}
        kicker={worldsIntro.kicker}
        title={worldsIntro.title}
        lead={folioStory.worlds.lead}
        layout="split"
      />
      <ol className="es-world-list">
        {worlds.map((world, index) => (
          <li key={world.id} id={world.id} className="es-world">
            <div className="es-world-art" data-scene="enter">
              <Plate
                fig={`Fig. ${String(index + 3).padStart(2, '0')}`}
                caption={world.name}
                note={world.imageNote}
              >
                <img
                  src={world.image.src}
                  width={world.image.w}
                  height={world.image.h}
                  alt=""
                  loading="lazy"
                  style={{ objectPosition: world.image.position }}
                />
              </Plate>
            </div>
            <div className="es-world-copy" data-reveal>
              <span className="es-world-meta">
                <i>{pad(index)}</i>
                <span>{world.relation}</span>
              </span>
              <h3>
                {world.name}
                {world.english ? (
                  <small lang="en">{world.english}</small>
                ) : null}
                {world.tag ? <Tag>{world.tag}</Tag> : null}
              </h3>
              <blockquote>{world.quote}</blockquote>
              <p>{world.text}</p>
              <dl className="es-world-spec">
                <div>
                  <dt>{folioStory.worlds.playLabel}</dt>
                  <dd>{folioStory.worlds.play[world.id]}</dd>
                </div>
                <div>
                  <dt>{worldsIntro.souvenirLabel}</dt>
                  <dd>{world.souvenir}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 和谁一起去（规划中）：三种同行方式，Agent 用虚线画；规矩里第一条把 Agent 的几种状态排成一行 */
/**
 * Agent 的状态一眼看得清：进入视口后，状态签按一次典型的过程亮一遍——提议 → 执行中 → 暂停 → 执行中 →
 * 等你确认（停得久一点）→ 结果；走完停在「结果」，可以重播。离开视口暂停；减少动态时直接停在「结果」。
 */
function AgentStates({ states }: { states: string[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const order = ['提议', '执行中', '暂停', '执行中', '等你确认', '结果']
    .map((name) => states.indexOf(name))
    .filter((index) => index >= 0);
  const holds = [900, 1200, 900, 900, 1700, 0];
  const [step, setStep] = useState(-1);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && !document.hidden),
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || step >= order.length - 1) return;
    const timer = window.setTimeout(
      () => setStep((value) => value + 1),
      step < 0 ? 300 : holds[step],
    );
    return () => window.clearTimeout(timer);
  });
  const active = step < 0 ? -1 : order[step];
  return (
    <span
      className="es-states"
      ref={ref}
      aria-hidden="true"
      data-playing={step >= 0 || undefined}
    >
      {states.map((state, index) => (
        <span
          key={state}
          data-on={active === index || undefined}
          data-wait={
            active === index && state === '等你确认' ? true : undefined
          }
        >
          {state}
        </span>
      ))}
      {step >= order.length - 1 ? (
        <button
          type="button"
          tabIndex={-1}
          className="es-states-replay"
          onClick={() => setStep(-1)}
        >
          重播
        </button>
      ) : null}
    </span>
  );
}

function Company() {
  const [first, ...rest] = company.rules;
  const states = first.split('：')[1];
  return (
    <section
      className="es-section es-company"
      aria-labelledby="es-company-title"
    >
      <SectionHead
        id="es-company-title"
        index={2}
        kicker={`${company.kicker} · ${company.tag}`}
        title={company.title}
      />
      <ol className="es-ways">
        {company.ways.map((way, index) => (
          <li
            key={way.title}
            data-reveal
            style={{ '--d': `${index * 100}ms` } as Vars}
          >
            <span className="es-way-art">
              <Party kind={index as 0 | 1 | 2} />
            </span>
            <span className="es-no" aria-hidden="true">
              {pad(index)}
            </span>
            <h3>
              {way.title}
              {index > 0 ? <Tag>{company.tag}</Tag> : null}
            </h3>
            <p>{way.text}</p>
          </li>
        ))}
      </ol>
      <div className="es-company-foot">
        <ol className="es-company-rules">
          <li data-reveal>
            <span className="es-no" aria-hidden="true">
              {pad(0)}
            </span>
            <div>
              <p>{first}</p>
              {states ? (
                <AgentStates states={states.replace(/。$/, '').split('、')} />
              ) : null}
            </div>
          </li>
          {rest.map((rule, index) => (
            <li key={rule} data-reveal>
              <span className="es-no" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <p>{rule}</p>
            </li>
          ))}
        </ol>
        <p className="es-now" data-reveal>
          {company.now}
        </p>
      </div>
    </section>
  );
}

/** 自己做一个世界（规划中） */
function Create() {
  return (
    <section className="es-section es-create" aria-labelledby="es-create-title">
      <div className="es-split">
        <SectionHead
          id="es-create-title"
          index={3}
          kicker={`${create.kicker} · ${create.tag}`}
          title={create.title}
        />
        <div className="es-create-body" data-reveal>
          <ol className="es-list">
            {create.items.map((item, index) => (
              <li key={item.title}>
                <span className="es-no" aria-hidden="true">
                  {pad(index)}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
          <Link className="e2-link" href={`${COMMUNITY}#share`}>
            {create.share}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** 一段有限的旅程 */
function Different() {
  return (
    <section
      className="es-section es-different"
      aria-labelledby="es-different-title"
    >
      <SectionHead
        id="es-different-title"
        index={4}
        kicker={folioStory.different.kicker}
        title={different.title}
      />
      <ol className="es-cards">
        {differentItems.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--d': `${index * 100}ms` } as Vars}
          >
            <span className="es-no" aria-hidden="true">
              {pad(index)}
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 进门前，先说清楚：深色的一段，左边一道亮着的拱门，右边每个世界都守的规矩 */
function Boundaries() {
  return (
    <section className="es-section es-bounds" aria-labelledby="es-bounds-title">
      <div className="es-split">
        <div className="es-bounds-head">
          <SectionHead
            id="es-bounds-title"
            index={5}
            kicker={boundaries.kicker}
            title={boundaries.title}
          />
          <span className="es-bounds-art" data-reveal>
            <Threshold />
          </span>
        </div>
        <ol className="es-list es-bounds-list">
          {[folioStory.rule, ...boundaries.items].map((item, index) => (
            <li
              key={item}
              data-reveal
              style={{ '--d': `${index * 100}ms` } as Vars}
            >
              <span className="es-no" aria-hidden="true">
                {pad(index)}
              </span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <>
      <section className="es-closing" aria-labelledby="es-closing-title">
        <h2 id="es-closing-title" data-reveal>
          <Phrases text={closing.title} />
        </h2>
        <div
          className="es-closing-side"
          data-reveal
          style={{ '--d': '120ms' } as Vars}
        >
          <span className="es-closing-art" data-draw>
            <Pip kind="story" />
          </span>
          <Actions
            items={[
              { label: closing.follow, href: contactHref('story') },
              { label: closing.home, href: HOME, tone: 'ghost' },
            ]}
          />
        </div>
      </section>
      <NextProduct current="story" />
    </>
  );
}

export default function E2StoryPage() {
  return (
    <E2Page current="story" className="es" footer={<Closing />}>
      <Hero />
      <Journey />
      <Worlds />
      <Company />
      <Create />
      <Different />
      <Boundaries />
    </E2Page>
  );
}
