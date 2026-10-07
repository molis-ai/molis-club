'use client';
import {
  boundaries,
  closing,
  different,
  hero,
  journey,
  worlds,
  worldsIntro,
} from '../../../../../content/molis-story';
import { Closing, SectionHead, Phrases, ProductHero, Tag, pad } from '../kit';
import {
  Footer,
  HOME,
  SiteHeader,
  contactHref,
  useEditionMotion,
  type Vars,
} from '../shared';
import '../edition-c.css';
import '../kit.css';
import './story.css';

// 文案来自 content/molis-story.ts，五个方向共用。首屏是纸面上的四扇窗，每扇窗后面是一个世界；
// 生成的氛围画标「概念画面」，袖珍博物馆用仓库里 Unsplash 授权的示例照片。

const journeyShots = [
  null,
  { src: '/images/edition-c/story/elsewhere.jpg', w: 1600, h: 900 },
  { src: '/images/edition-c/story/homecoming.jpg', w: 1600, h: 900 },
];

/** 首屏：四扇窗，悬停时各自有一点世界里的光 */
function Windows() {
  return (
    <figure className="es-windows">
      <ul>
        {worlds.map((world, index) => (
          <li
            key={world.id}
            data-world={world.id}
            style={{ '--r': index } as Vars}
          >
            <a href={`#${world.id}`}>
              <span className="es-window">
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
      <figcaption>概念画面；袖珍博物馆为示例照片（Unsplash）</figcaption>
    </figure>
  );
}

/** 「此处」：四扇小窗缩在一页纸上 */
function Here() {
  return (
    <span className="es-here" aria-hidden="true">
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

export default function EditionCStoryPage() {
  const siteRef = useEditionMotion();

  return (
    <div className="ec-site es-site" ref={siteRef}>
      <SiteHeader current="story" tone="paper" />

      <main id="main">
        <ProductHero
          id="es-title"
          className="es-hero"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={[
            { label: hero.actions.follow, href: contactHref('story') },
            { label: hero.actions.worlds, href: '#worlds', tone: 'light' },
          ]}
          visual={<Windows />}
          wordmark="Molis Story"
        />

        <section className="ep-section" aria-labelledby="es-journey-title">
          <SectionHead
            id="es-journey-title"
            kicker={journey.kicker}
            title={journey.title}
          />
          <ol className="es-journey">
            {journey.steps.map((step, index) => {
              const shot = journeyShots[index];
              return (
                <li
                  key={step.title}
                  className="ec-reveal"
                  style={{ '--r': index } as Vars}
                >
                  <span className="es-journey-shot">
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
                  <span className="ep-index">{pad(index)}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
          <p className="ep-note">概念画面</p>
        </section>

        <section
          id="worlds"
          className="ep-section es-worlds"
          aria-labelledby="es-worlds-title"
        >
          <SectionHead
            id="es-worlds-title"
            kicker={worldsIntro.kicker}
            title={worldsIntro.title}
          />
          <ol>
            {worlds.map((world, index) => (
              <li
                key={world.id}
                id={world.id}
                className="es-world"
                data-world={world.id}
              >
                <figure className="es-world-shot ec-reveal">
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
                  className="es-world-copy ec-reveal"
                  style={{ '--r': 1 } as Vars}
                >
                  <span className="ec-eyebrow">
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
                  <p className="es-souvenir">
                    <span>{worldsIntro.souvenirLabel}</span>
                    {world.souvenir}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="ep-section" aria-labelledby="es-different-title">
          <SectionHead
            id="es-different-title"
            kicker={different.kicker}
            title={different.title}
          />
          <ol className="ep-cards es-different" style={{ '--cols': 2 } as Vars}>
            {different.items.map((item, index) => (
              <li
                key={item.title}
                className="ep-card ec-reveal"
                style={{ '--r': index % 2 } as Vars}
              >
                <span className="ep-index">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="ep-section ep-band"
          aria-labelledby="es-boundaries-title"
        >
          <div className="ep-split">
            <div className="ep-head ec-reveal" data-align="start">
              <span className="ec-eyebrow">{boundaries.kicker}</span>
              <h2 id="es-boundaries-title">
                <Phrases text={boundaries.title} />
              </h2>
            </div>
            <ol
              className="ep-promises es-boundaries"
              style={{ '--cols': 1 } as Vars}
            >
              {boundaries.items.map((item, index) => (
                <li
                  key={item}
                  className="ec-reveal"
                  style={{ '--r': index } as Vars}
                >
                  <span className="ep-index">{pad(index)}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer>
        <Closing
          id="es-closing-title"
          title={closing.title}
          actions={[
            { label: closing.follow, href: contactHref('story') },
            { label: closing.home, href: HOME, tone: 'light' },
          ]}
        />
      </Footer>
    </div>
  );
}
