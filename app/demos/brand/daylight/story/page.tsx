'use client';
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
import { Closing, ProductHero, SectionHead, Tag } from '../kit';
import {
  Footer,
  HOME,
  LeafShadow,
  SiteHeader,
  contactHref,
  pad,
  useDaylight,
  type Vars,
} from '../shared';
import '../daylight.css';
import '../kit.css';
import './story.css';

// 文案来自 content/molis-story.ts，五个方向共用。首屏是晒着太阳的灰泥墙上开了四扇拱窗，
// 每扇窗后面是一个世界；生成的氛围画标「概念画面」，袖珍博物馆用仓库里 Unsplash 授权的示例照片。

/** 首屏：墙上的四扇拱窗，悬停时窗里的光漫到墙上 */
function Windows() {
  return (
    <figure className="dl-windows">
      <ul>
        {worlds.map((world, index) => (
          <li
            key={world.id}
            data-world={world.id}
            style={{ '--r': index } as Vars}
          >
            <a href={`#${world.id}`}>
              <span className="dl-arch">
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

/** 「此处」：四扇小窗开在一面纸色的墙上 */
function Here() {
  return (
    <span className="dl-here" aria-hidden="true">
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
  );
}

export default function DaylightStoryPage() {
  const siteRef = useDaylight();

  return (
    <div className="dl-site dl-story" ref={siteRef}>
      <SiteHeader current="story" />

      <main id="main">
        <ProductHero
          id="dl-story-title"
          className="dl-hero-wall"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={[
            { label: hero.actions.follow, href: contactHref('story') },
            { label: hero.actions.worlds, href: '#worlds', tone: 'line' },
          ]}
          visual={<Windows />}
        />

        <section className="dl-section" aria-labelledby="dl-journey-title">
          <SectionHead
            id="dl-journey-title"
            kicker={journey.kicker}
            title={journey.title}
          />
          <ol className="dl-pillars dl-story-journey">
            {journey.steps.map((step, index) => {
              const shot = journeyImages[index];
              return (
                <li key={step.title} style={{ '--r': index } as Vars}>
                  <div className="dl-story-journey-shot dl-reveal">
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
                  </div>
                  <div className="dl-pillar dl-reveal">
                    <span className="dl-index">{pad(index)}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="dl-note">{imageNote}</p>
        </section>

        <section
          id="worlds"
          className="dl-section"
          aria-labelledby="dl-worlds-title"
        >
          <SectionHead
            id="dl-worlds-title"
            kicker={worldsIntro.kicker}
            title={worldsIntro.title}
          />
          <ol className="dl-story-worlds">
            {worlds.map((world, index) => (
              <li
                key={world.id}
                id={world.id}
                className="dl-story-world"
                data-world={world.id}
              >
                <figure
                  className="dl-story-world-shot dl-reveal"
                  data-scene="pass"
                >
                  <img
                    src={world.image.src}
                    width={world.image.w}
                    height={world.image.h}
                    alt=""
                    loading="lazy"
                    style={{ objectPosition: world.image.position }}
                  />
                  <figcaption>{world.imageNote}</figcaption>
                </figure>
                <div
                  className="dl-story-world-copy dl-reveal"
                  style={{ '--r': 1 } as Vars}
                >
                  <span className="dl-eyebrow">
                    {pad(index)} · {world.relation}
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
                  <p className="dl-story-souvenir">
                    <span>{worldsIntro.souvenirLabel}</span>
                    {world.souvenir}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="dl-section" aria-labelledby="dl-different-title">
          <SectionHead
            id="dl-different-title"
            kicker={different.kicker}
            title={different.title}
          />
          <ol className="dl-pillars" style={{ '--cols': 4 } as Vars}>
            {different.items.map((item, index) => (
              <li
                key={item.title}
                className="dl-pillar dl-reveal"
                style={{ '--r': index } as Vars}
              >
                <span className="dl-index">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="dl-evening"
          data-scene="pass"
          aria-labelledby="dl-boundaries-title"
        >
          <div className="dl-evening-sun" aria-hidden="true" />
          <LeafShadow className="dl-leaves" />
          <div className="dl-evening-inner dl-split">
            <SectionHead
              id="dl-boundaries-title"
              kicker={boundaries.kicker}
              title={boundaries.title}
            />
            <ol className="dl-rows">
              {boundaries.items.map((item, index) => (
                <li
                  key={item}
                  className="dl-reveal"
                  style={{ '--r': index } as Vars}
                >
                  <span className="dl-index">{pad(index)}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer wordmark="Molis Story">
        <Closing
          id="dl-story-closing"
          title={closing.title}
          actions={[
            { label: closing.follow, href: contactHref('story') },
            { label: closing.home, href: HOME, tone: 'line' },
          ]}
        />
      </Footer>
    </div>
  );
}
