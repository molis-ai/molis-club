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
import {
  Cards,
  Closing,
  Ledger,
  Phrases,
  ProductHero,
  SectionHead,
  Tag,
  pad,
} from '../kit';
import Planet from '../planet';
import {
  Footer,
  HOME,
  SiteHeader,
  contactHref,
  useReveal,
  type Vars,
} from '../shared';
import '../cosmos.css';
import '../kit.css';
import './story.css';

// 文案来自 content/molis-story.ts，五个方向共用。Story 是一颗紫色的冰晶行星；首屏是四个圆形的传送门，
// 每个门后是一个世界。生成的氛围画标「概念画面」，袖珍博物馆用仓库里 Unsplash 授权的示例照片。

/** 首屏：四个传送门，排成一道弧，各自通往一个世界 */
function Portals() {
  return (
    <figure className="cs-story-portals">
      <ul>
        {worlds.map((world, index) => (
          <li
            key={world.id}
            data-world={world.id}
            style={{ '--i': index } as Vars}
          >
            <a href={`#${world.id}`}>
              <span className="cs-story-portal">
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

/** 「此处」：一颗紫色的家园行星，四个世界的小门绕着它 */
function Here() {
  return (
    <span className="cs-story-here" aria-hidden="true">
      <Planet kind="story" className="cs-story-here-planet" />
      {worlds.map((world, index) => (
        <i key={world.id} style={{ '--i': index } as Vars}>
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

export default function CosmosStoryPage() {
  const siteRef = useReveal();

  return (
    <div className="cs-site cs-story" ref={siteRef}>
      <SiteHeader current="story" />

      <main id="main">
        <ProductHero
          id="cs-story-title"
          className="cs-story-hero"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={[
            {
              label: hero.actions.follow,
              href: contactHref('story'),
              tone: 'primary',
            },
            { label: hero.actions.worlds, href: '#worlds' },
          ]}
          visual={<Portals />}
        />

        <section className="cs-section" aria-labelledby="cs-journey-title">
          <SectionHead
            id="cs-journey-title"
            kicker={journey.kicker}
            title={journey.title}
          />
          <ol className="cs-story-journey" data-reveal>
            {journey.steps.map((step, index) => {
              const shot = journeyImages[index];
              return (
                <li key={step.title} style={{ '--i': index } as Vars}>
                  <span className="cs-story-journey-shot">
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
                  <span className="cs-index">{pad(index)}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
          <p className="cs-note">{imageNote}</p>
        </section>

        <section
          id="worlds"
          className="cs-section cs-story-worlds"
          aria-labelledby="cs-worlds-title"
        >
          <SectionHead
            id="cs-worlds-title"
            kicker={worldsIntro.kicker}
            title={worldsIntro.title}
          />
          <ol>
            {worlds.map((world, index) => (
              <li
                key={world.id}
                id={world.id}
                className="cs-story-world"
                data-world={world.id}
              >
                <figure className="cs-story-world-shot cs-reveal">
                  <span className="cs-scope-corners" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
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
                  className="cs-story-world-copy cs-reveal"
                  style={{ '--r': 1 } as Vars}
                >
                  <span className="cs-eyebrow">
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
                  <p className="cs-story-souvenir">
                    <span>{worldsIntro.souvenirLabel}</span>
                    {world.souvenir}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="cs-section" aria-labelledby="cs-different-title">
          <SectionHead
            id="cs-different-title"
            kicker={different.kicker}
            title={different.title}
          />
          <Cards items={different.items} cols={2} />
        </section>

        <section
          className="cs-section cs-band cs-story-boundaries"
          aria-labelledby="cs-boundaries-title"
        >
          <div className="cs-split">
            <div className="cs-head cs-reveal" data-align="start">
              <span className="cs-eyebrow">{boundaries.kicker}</span>
              <h2 id="cs-boundaries-title">
                <Phrases text={boundaries.title} />
              </h2>
            </div>
            <Ledger items={boundaries.items.map((title) => ({ title }))} />
          </div>
        </section>
      </main>

      <Footer>
        <Closing
          id="cs-story-closing-title"
          title={closing.title}
          actions={[
            {
              label: closing.follow,
              href: contactHref('story'),
              tone: 'primary',
            },
            { label: closing.home, href: HOME },
          ]}
        />
      </Footer>
    </div>
  );
}
