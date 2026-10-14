'use client';
import Link from 'next/link';
import {
  boundaries,
  closing,
  different,
  hero,
  imageNote,
  journey,
  journeyImages,
  windowsNote,
  worlds,
  worldsIntro,
} from '../../../../../content/molis-story';
import { folioStory } from '../../../../../content/folio-story';
import {
  Actions,
  Btn,
  Closing,
  More,
  NextRoom,
  Phrases,
  Plate,
  Shell,
  Status,
  Tag,
  type Vars,
} from '../kit';
import { COMMUNITY, HOME, WORLD, contactHref } from '../routes';
import './story.css';

// Molis Story · Room 4 的一串门。内容与 Folio 的 Story 页同一份、同一个顺序（A4）：
// 首屏 → 此处 → 彼处 → 归来 → 四个世界 → 和谁一起去（规划中）→ 自己做一个世界（规划中）→ 一段有限的旅程 → 进门须知。
// 展览的做法：首屏一面白墙上四道拱门，门里是四个世界；四个世界各是一段滚动——朝一道门走近、穿过去，
// 门里的画面铺满视野，世界的展签浮现；走完四个世界，回到一面白墙，写着「归来」。
// 生成的氛围画标「概念画面」，袖珍博物馆是 Unsplash 示例照片；页面上不说 Story 是不是游戏。

/** Story 不限定是不是游戏，「不是游戏」一条去掉（A4） */
const differentItems = different.items.filter(
  (item) => item.title !== '不是游戏',
);

function Hero() {
  return (
    <section className="g-story-hero" aria-labelledby="g-story-title">
      <div className="g-story-hero-copy">
        <p className="g-story-kicker">
          <span className="g-soft" lang="en" aria-hidden="true">
            Room 4
          </span>
          <span>{hero.kicker}</span>
        </p>
        <h1 id="g-story-title" className="g-story-title">
          <Phrases text={hero.title} />
        </h1>
        <div className="g-story-hero-side">
          <p className="g-lead">{folioStory.hero.lead}</p>
          <p className="g-story-planned">{folioStory.hero.planned}</p>
          <Status items={hero.status} />
          <Actions>
            <Btn href={contactHref('story')}>{hero.actions.follow}</Btn>
            <More href="#worlds">{hero.actions.worlds}</More>
          </Actions>
        </div>
      </div>
      <figure className="g-story-arches">
        <ul>
          {worlds.map((world, index) => (
            <li key={world.id} style={{ '--i': index } as Vars}>
              <a href={`#${world.id}`}>
                <span className="g-story-arch">
                  <img
                    src={world.image.src}
                    width={world.image.w}
                    height={world.image.h}
                    alt=""
                    fetchPriority={index < 2 ? 'high' : undefined}
                    style={{ objectPosition: world.image.position }}
                  />
                </span>
                <small>{world.relation}</small>
                <strong>{world.name}</strong>
              </a>
            </li>
          ))}
        </ul>
        <figcaption>{windowsNote}</figcaption>
      </figure>
    </section>
  );
}

/** 此处 → 彼处 → 归来：三格排开，第一格是一面白墙上的四道小门 */
function Journey() {
  return (
    <section
      className="g-story-journey g-wrap g-section"
      aria-labelledby="g-story-journey-title"
    >
      <Plate
        id="g-story-journey-title"
        index="I"
        kicker={journey.kicker}
        title={journey.title}
      />
      <ol className="g-story-steps">
        {journey.steps.map((step, index) => {
          const shot = journeyImages[index];
          return (
            <li
              key={step.title}
              data-reveal
              style={{ '--delay': `${index * 140}ms` } as Vars}
            >
              <span className="g-story-step-shot">
                {shot ? (
                  <img
                    src={shot.src}
                    width={shot.w}
                    height={shot.h}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <span className="g-story-here" aria-hidden="true">
                    {worlds.map((world) => (
                      <i key={world.id}>
                        <img
                          src={world.image.src}
                          width={world.image.w}
                          height={world.image.h}
                          alt=""
                          loading="lazy"
                          style={{ objectPosition: world.image.position }}
                        />
                      </i>
                    ))}
                  </span>
                )}
              </span>
              <span className="g-soft" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          );
        })}
      </ol>
      <p className="g-story-note">{imageNote}</p>
      <p className="g-story-after" data-reveal>
        {folioStory.afterReturn.text}
        <Link href={WORLD}>
          {folioStory.afterReturn.link}
          <Tag>{folioStory.afterReturn.tag}</Tag>
        </Link>
      </p>
    </section>
  );
}

/**
 * 一个世界：一面白墙中间一道拱门，往下滚就朝它走近、穿过去，门里的画面铺满视野，
 * 世界的展签从右下角浮现。窄屏和减少动态时，拱门与展签上下排开。
 */
function WorldDoor({
  world,
  index,
}: {
  world: (typeof worlds)[number];
  index: number;
}) {
  return (
    <li
      id={world.id}
      className="g-story-world"
      data-world={world.id}
      data-scene="pin"
      aria-labelledby={`g-story-world-${world.id}`}
    >
      <div className="g-story-world-stage">
        <div className="g-story-world-wall" aria-hidden="true" />
        <div className="g-story-door" aria-hidden="true">
          <img
            src={world.image.src}
            width={world.image.w}
            height={world.image.h}
            alt=""
            loading="lazy"
            style={{ objectPosition: world.image.position }}
          />
        </div>
        <div className="g-story-world-label">
          <p className="g-story-world-eyebrow">
            <span className="g-soft">{index + 1}</span>
            {world.relation}
          </p>
          <h3 id={`g-story-world-${world.id}`}>
            {world.name}
            {world.english ? <small lang="en">{world.english}</small> : null}
            {world.tag ? <Tag>{world.tag}</Tag> : null}
          </h3>
          <blockquote>{world.quote}</blockquote>
          <p>{world.text}</p>
          <dl>
            <div>
              <dt>{worldsIntro.souvenirLabel}</dt>
              <dd>{world.souvenir}</dd>
            </div>
            <div>
              <dt>{folioStory.worlds.playLabel}</dt>
              <dd>{folioStory.worlds.play[world.id]}</dd>
            </div>
          </dl>
          <p className="g-story-world-note">{world.imageNote}</p>
        </div>
      </div>
    </li>
  );
}

function Worlds() {
  return (
    <section
      id="worlds"
      className="g-story-worlds"
      aria-labelledby="g-story-worlds-title"
    >
      <div className="g-wrap g-story-worlds-head">
        <Plate
          id="g-story-worlds-title"
          index="II"
          kicker={worldsIntro.kicker}
          title={worldsIntro.title}
          side={<p>{folioStory.worlds.lead}</p>}
        />
      </div>
      <ol className="g-story-world-list">
        {worlds.map((world, index) => (
          <WorldDoor key={world.id} world={world} index={index} />
        ))}
      </ol>
      {/* 走完四个世界，回到白墙 */}
      <div className="g-story-return" data-reveal>
        <p className="g-soft" lang="en" aria-hidden="true">
          Homecoming
        </p>
        <p className="g-story-return-title">{journey.steps[2].title}</p>
        <p className="g-story-return-text">{journey.steps[2].text}</p>
      </div>
    </section>
  );
}

/** 和谁一起去 · 规划中：三种同行，都还是虚线；开发版里已有的一小步写在实线卡上 */
function Company() {
  const { company } = folioStory;
  return (
    <section
      className="g-story-company g-wrap g-section"
      aria-labelledby="g-story-company-title"
    >
      <Plate
        id="g-story-company-title"
        index="III"
        kicker={
          <>
            {company.kicker}
            <Tag>{company.tag}</Tag>
          </>
        }
        title={company.title}
      />
      <ol className="g-story-ways">
        {company.ways.map((way, index) => (
          <li
            key={way.title}
            data-reveal
            data-planned={index > 0 || undefined}
            style={{ '--delay': `${index * 110}ms` } as Vars}
          >
            <span className="g-story-figures" aria-hidden="true" data-n={index}>
              <i />
              <i />
              <i />
            </span>
            <h3>
              {way.title}
              {index > 0 ? <Tag>{company.tag}</Tag> : null}
            </h3>
            <p>{way.text}</p>
          </li>
        ))}
      </ol>
      <ul className="g-story-company-rules">
        {company.rules.map((rule) => (
          <li key={rule} data-reveal>
            {rule}
          </li>
        ))}
      </ul>
      <p className="g-story-now" data-reveal>
        {company.now}
      </p>
    </section>
  );
}

/** 自己做一个世界 · 规划中：一道还没砌好的虚线门 */
function Create() {
  const { create } = folioStory;
  return (
    <section
      className="g-story-create g-wrap g-section"
      aria-labelledby="g-story-create-title"
    >
      <div className="g-story-create-door" aria-hidden="true" data-reveal>
        <span />
      </div>
      <div className="g-story-create-body">
        <Plate
          id="g-story-create-title"
          index="IV"
          kicker={
            <>
              {create.kicker}
              <Tag>{create.tag}</Tag>
            </>
          }
          title={create.title}
        />
        <ol className="g-story-create-list" data-reveal>
          {create.items.map((item, index) => (
            <li key={item.title}>
              <span className="g-soft" aria-hidden="true">
                {index + 1}
              </span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
        <More href={`${COMMUNITY}#share`}>{create.share}</More>
      </div>
    </section>
  );
}

/** 一段有限的旅程 + 进门须知：三句写在墙上的话，和一块门边的牌子 */
function Rules() {
  return (
    <section className="g-story-rules g-wrap g-section">
      <Plate
        id="g-story-different-title"
        index="V"
        kicker={folioStory.different.kicker}
        title={different.title}
      />
      <ol
        className="g-story-different"
        aria-labelledby="g-story-different-title"
      >
        {differentItems.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--delay': `${index * 110}ms` } as Vars}
          >
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
      <div className="g-story-sign" aria-labelledby="g-story-boundaries-title">
        <div className="g-story-sign-head" data-reveal>
          <p className="g-kicker">{boundaries.kicker}</p>
          <h2 id="g-story-boundaries-title">{boundaries.title}</h2>
        </div>
        <ol className="g-story-sign-card" data-reveal>
          {[folioStory.rule, ...boundaries.items].map((item, index) => (
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

function Ending() {
  return (
    <>
      <Closing id="g-story-closing-title" title={closing.title}>
        <Actions>
          <Btn href={contactHref('story')}>{closing.follow}</Btn>
          <More href={HOME}>{closing.home}</More>
        </Actions>
      </Closing>
      <div className="g-next-wrap">
        <NextRoom current="story" />
      </div>
    </>
  );
}

export default function GalleryStory() {
  return (
    <Shell current="story" className="g-story-page" ending={<Ending />}>
      <Hero />
      <Journey />
      <Worlds />
      <Company />
      <Create />
      <Rules />
    </Shell>
  );
}
