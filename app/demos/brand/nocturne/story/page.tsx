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
import { Closing, ProductHero, SectionHead, Tag, pad } from '../kit';
import {
  Footer,
  HOME,
  SiteHeader,
  contactHref,
  useNocturneMotion,
  type Vars,
} from '../shared';
import '../nocturne.css';
import '../kit.css';
import './story.css';

// 文案来自 content/molis-story.ts，五个方向共用。首屏是暗场里的四道拱门，每道门后面是一个世界；
// 生成的氛围画标「概念画面」，袖珍博物馆用仓库里 Unsplash 授权的示例照片。

/** 首屏：四道发光的拱门，各通往一个世界 */
function Portals() {
  return (
    <figure className="nc-portals">
      <ul>
        {worlds.map((world, index) => (
          <li key={world.id} style={{ '--r': index } as Vars}>
            <a href={`#${world.id}`}>
              <span className="nc-gate">
                <img
                  src={world.image.src}
                  width={world.image.w}
                  height={world.image.h}
                  alt=""
                  fetchPriority={index < 2 ? 'high' : undefined}
                  style={{ objectPosition: world.image.position }}
                />
                {[0, 1, 2].map((mote) => (
                  <i key={mote} style={{ '--m': mote } as Vars} />
                ))}
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

/** 「此处」：四道小门并排，记得你去过哪里 */
function Here() {
  return (
    <span className="nc-here" aria-hidden="true">
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

export default function NocturneStoryPage() {
  const rootRef = useNocturneMotion();

  return (
    <div className="nc-site nc-story" ref={rootRef}>
      <div className="nc-grain" aria-hidden="true" />
      <SiteHeader current="story" />

      <main id="main">
        <ProductHero
          id="nc-story-title"
          layout="center"
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

        <section className="nc-section" aria-labelledby="nc-journey-title">
          <SectionHead
            id="nc-journey-title"
            kicker={journey.kicker}
            title={journey.title}
          />
          <ol className="nc-journey">
            {journey.steps.map((step, index) => {
              const shot = journeyImages[index];
              return (
                <li
                  key={step.title}
                  data-reveal
                  style={{ '--r': index } as Vars}
                >
                  <span className="nc-journey-shot">
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
                  <span className="nc-index">{pad(index)}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
          <p className="nc-note">{imageNote}</p>
        </section>

        <section
          id="worlds"
          className="nc-section nc-worlds"
          aria-labelledby="nc-worlds-title"
        >
          <SectionHead
            id="nc-worlds-title"
            kicker={worldsIntro.kicker}
            title={worldsIntro.title}
          />
          <ol>
            {worlds.map((world, index) => (
              <li
                key={world.id}
                id={world.id}
                className="nc-world"
                data-world={world.id}
              >
                <figure className="nc-world-shot" data-scene="view" data-reveal>
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
                  className="nc-world-copy"
                  data-reveal
                  style={{ '--r': 1 } as Vars}
                >
                  <span className="nc-kicker">
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
                  <p className="nc-souvenir">
                    <span>{worldsIntro.souvenirLabel}</span>
                    {world.souvenir}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="nc-section" aria-labelledby="nc-different-title">
          <SectionHead
            id="nc-different-title"
            kicker={different.kicker}
            title={different.title}
          />
          <ol className="nc-cards" style={{ '--cols': 2 } as Vars}>
            {different.items.map((item, index) => (
              <li
                key={item.title}
                className="nc-card"
                data-reveal
                style={{ '--r': index % 2 } as Vars}
              >
                <span className="nc-index">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="nc-section nc-band"
          aria-labelledby="nc-boundaries-title"
        >
          <div className="nc-split">
            <SectionHead
              id="nc-boundaries-title"
              kicker={boundaries.kicker}
              title={boundaries.title}
              align="start"
            />
            <ol className="nc-promises" style={{ '--cols': 1 } as Vars}>
              {boundaries.items.map((item, index) => (
                <li key={item} data-reveal style={{ '--r': index } as Vars}>
                  <span className="nc-index">{pad(index)}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer>
        <Closing
          id="nc-story-closing"
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
