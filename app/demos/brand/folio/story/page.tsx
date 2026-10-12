'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
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
import { Star } from '../art';
import {
  Closing,
  NextProduct,
  ProductHero,
  SectionHead,
  Tag,
  pad,
} from '../kit';
import {
  COMMUNITY,
  Footer,
  HOME,
  SiteHeader,
  WORLD,
  contactHref,
  useFolioMotion,
  type Vars,
} from '../shared';
import '../folio.css';
import '../kit.css';
import './story.css';

// 文案来自 content/molis-story.ts，五个方向共用；Folio 新增和改动的说法在 content/folio-story.ts（A4）：
// 导语加上「带上你的 Agent」，归来后可以放进 World，每个世界说明怎么玩，「和谁一起去」「自己做一个世界」
// 标规划中，去掉「不是游戏」。首屏是四扇剪纸拱窗；生成的氛围画标「概念画面」，袖珍博物馆用 Unsplash 示例照片。

/** 首屏：四扇彩纸拱窗，各自通向下面的世界 */
function Windows() {
  return (
    <figure className="fs-windows">
      <svg className="fs-stars" viewBox="0 0 1000 120" aria-hidden="true">
        <Star x={60} y={50} r={18} />
        <Star x={520} y={30} r={12} />
        <Star x={940} y={70} r={22} />
      </svg>
      <ul>
        {worlds.map((world, index) => (
          <li
            key={world.id}
            data-world={world.id}
            style={{ '--i': index } as Vars}
          >
            <a href={`#${world.id}`}>
              <span className="fs-window">
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
  );
}

/** 「此处」：四扇小窗贴在一张纸上 */
function Here() {
  return (
    <span className="fs-here" aria-hidden="true">
      {worlds.map((world) => (
        <i key={world.id} data-world={world.id}>
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
  );
}

/** 「不是游戏」一条去掉：Story 不限定是不是游戏，每个世界各自说明（A4） */
const differentItems = different.items.filter(
  (item) => item.title !== '不是游戏',
);

export default function FolioStoryPage() {
  const rootRef = useFolioMotion();
  const { company, create } = folioStory;

  return (
    <div className="fo-site fs-site" ref={rootRef}>
      <SiteHeader current="story" />

      <main id="main">
        <ProductHero
          id="fs-title"
          className="fs-hero"
          kicker={hero.kicker}
          title={hero.title}
          lead={folioStory.hero.lead}
          extra={<p className="fs-hero-planned">{folioStory.hero.planned}</p>}
          status={hero.status}
          actions={[
            { label: hero.actions.follow, href: contactHref('story') },
            { label: hero.actions.worlds, href: '#worlds', tone: 'ghost' },
          ]}
          masthead="Story"
          art={<Windows />}
        />

        <section
          className="fo-section"
          data-bg="white"
          aria-labelledby="fs-journey-title"
        >
          <SectionHead
            id="fs-journey-title"
            kicker={journey.kicker}
            title={journey.title}
          />
          <ol className="fs-journey">
            {journey.steps.map((step, index) => {
              const shot = journeyImages[index];
              return (
                <li
                  key={step.title}
                  data-reveal
                  style={{ '--i': index } as Vars}
                >
                  <span className="fs-journey-shot">
                    {shot ? (
                      <img
                        src={shot.src}
                        width={shot.w}
                        height={shot.h}
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <Here />
                    )}
                  </span>
                  <span className="fo-index">{pad(index)}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
          <p className="fo-note">{imageNote}</p>
          <p className="fs-after-return" data-reveal>
            {folioStory.afterReturn.text}
            <Link href={WORLD}>
              {folioStory.afterReturn.link}
              <Tag>{folioStory.afterReturn.tag}</Tag>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </p>
        </section>

        <section
          id="worlds"
          className="fo-section fs-worlds"
          data-bg="paper"
          aria-labelledby="fs-worlds-title"
        >
          <SectionHead
            id="fs-worlds-title"
            kicker={worldsIntro.kicker}
            title={worldsIntro.title}
            lead={folioStory.worlds.lead}
          />
          <ol>
            {worlds.map((world, index) => (
              <li
                key={world.id}
                id={world.id}
                className="fs-world"
                data-world={world.id}
              >
                <figure className="fs-world-shot" data-reveal>
                  <span>
                    <img
                      src={world.image.src}
                      width={world.image.w}
                      height={world.image.h}
                      alt=""
                      loading="lazy"
                      style={{ objectPosition: world.image.position }}
                    />
                  </span>
                  <figcaption>{world.imageNote}</figcaption>
                </figure>
                <div
                  className="fs-world-copy"
                  data-reveal
                  style={{ '--i': 1 } as Vars}
                >
                  <span className="fs-world-eyebrow">
                    <b>{pad(index)}</b>
                    {world.relation}
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
                  <p className="fs-souvenir">
                    <span>{worldsIntro.souvenirLabel}</span>
                    {world.souvenir}
                  </p>
                  <p className="fs-world-play">
                    <span>{folioStory.worlds.playLabel}</span>
                    {folioStory.worlds.play[world.id]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="fo-section fs-company"
          data-bg="white"
          aria-labelledby="fs-company-title"
        >
          <SectionHead
            id="fs-company-title"
            kicker={`${company.kicker} · ${company.tag}`}
            title={company.title}
          />
          <ol className="fo-cards fs-ways">
            {company.ways.map((way, index) => (
              <li key={way.title} data-reveal style={{ '--i': index } as Vars}>
                <span className="fo-index">{pad(index)}</span>
                <h3>
                  {way.title}
                  {index > 0 ? <Tag>{company.tag}</Tag> : null}
                </h3>
                <p>{way.text}</p>
              </li>
            ))}
          </ol>
          <ul className="fs-company-rules">
            {company.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <p className="fs-now">{company.now}</p>
        </section>

        <section
          className="fo-section fs-create"
          data-bg="pink"
          aria-labelledby="fs-create-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fs-create-title"
              kicker={`${create.kicker} · ${create.tag}`}
              title={create.title}
            />
            <div className="fs-create-body" data-reveal>
              <ol className="fo-list">
                {create.items.map((item, index) => (
                  <li key={item.title}>
                    <span className="fo-index">{pad(index)}</span>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </li>
                ))}
              </ol>
              <Link className="fs-create-link" href={`${COMMUNITY}#share`}>
                {create.share}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section
          className="fo-section"
          data-bg="paper"
          aria-labelledby="fs-different-title"
        >
          <SectionHead
            id="fs-different-title"
            kicker={folioStory.different.kicker}
            title={different.title}
          />
          <ol className="fo-cards fs-different">
            {differentItems.map((item, index) => (
              <li key={item.title} data-reveal style={{ '--i': index } as Vars}>
                <span className="fo-index">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="fo-section"
          data-bg="navy"
          aria-labelledby="fs-boundaries-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fs-boundaries-title"
              kicker={boundaries.kicker}
              title={boundaries.title}
            />
            <ol className="fo-list">
              {[folioStory.rule, ...boundaries.items].map((item, index) => (
                <li key={item} data-reveal style={{ '--i': index } as Vars}>
                  <span className="fo-index">{pad(index)}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer tone="blue">
        <Closing
          id="fs-closing-title"
          title={closing.title}
          actions={[
            { label: closing.follow, href: contactHref('story') },
            { label: closing.home, href: HOME, tone: 'light' },
          ]}
        />
        <NextProduct current="story" />
      </Footer>
    </div>
  );
}
