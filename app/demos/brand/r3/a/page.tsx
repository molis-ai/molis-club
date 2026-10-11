'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { folioHomeCopy, folioStudio } from '../../../../../content/folio';
import { lineImages } from '../../../../../content/studio';
import { desk } from '../../../../../content/folio-work';
import { demo } from '../../../../../content/molis-tool';
import { GITHUB_URL } from '../../../../../content/molis-work';
import { AiWordCycle } from '../../ai-words';
import {
  CONTACT,
  COMMUNITY,
  ESSAYS,
  Header,
  InkText,
  LOGIN,
  SOLUTIONS,
  WIKI,
  ABOUT,
  contactHref,
  ending,
  footer,
  lineHref,
  lineIds,
  lineNames,
  signature,
  useStage,
  type Vars,
} from '../kit';
import { R3_A } from '../routes';
import { ToolSheet, WorkSheet } from '../sheets';
import { LeafLight } from './scenes';
import './a.css';

// A · 暖纸与画框：一本工作室画册。首屏是树影与对焦的字标，产品是一面挂着四幅图版的墙，
// 简介写成一封信，结尾回到光里。内容与 Folio 首页同一份，只换视觉、版式与动效。

type PlateId = 'work' | 'tool' | 'life' | 'story';

const paintings: Record<PlateId, { src: string; alt: string }> = {
  work: {
    src: '/images/brand-a/work-garden.webp',
    alt: '',
  },
  tool: {
    src: '/images/brand-a/tool-window.webp',
    alt: '',
  },
  life: {
    src: '/images/brand-a/life-room.webp',
    alt: '概念稿：午后的房间，一把扶手椅、摊开的书和窗外的花园。',
  },
  story: {
    src: '/images/brand-a/story-harbor.webp',
    alt: '概念画面：雾港失物招领处的门口，桌上放着一把带空白标签的钥匙。',
  },
};

const numerals = ['I', 'II', 'III', 'IV'];

const work = folioStudio.work;
const lines = Object.fromEntries(
  folioStudio.lines.map((line) => [line.id, line]),
) as Record<Exclude<PlateId, 'work'>, (typeof folioStudio.lines)[number]>;

/** 图版两侧的竖排小字：左边是所在领域，右边是阶段 */
const edges: Record<PlateId, [string, string]> = {
  work: [work.kicker, work.status[0]],
  tool: [lines.tool.area, lines.tool.status],
  life: [lines.life.area, lines.life.status],
  story: [lines.story.area, lines.story.status],
};

const notes: Record<PlateId, string> = {
  work: desk.note,
  tool: demo.note,
  life: lineImages.life.note,
  story: lineImages.story.note,
};

/** 左侧索引跟着视口中线所在的图版走 */
function usePlateIndex() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const plates = Array.from(
      ref.current?.querySelectorAll<HTMLElement>('[data-plate]') ?? [],
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset.plate));
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    plates.forEach((plate) => observer.observe(plate));
    return () => observer.disconnect();
  }, []);
  return { ref, active };
}

function PlateArt({ id, active }: { id: PlateId; active: boolean }) {
  const painting = paintings[id];
  return (
    <div className="ra-canvas">
      <img
        className="ra-painting"
        src={painting.src}
        width="1536"
        height="1024"
        alt={painting.alt}
        loading="lazy"
        decoding="async"
      />
      {id === 'work' ? <WorkSheet p="ra" active={active} /> : null}
      {id === 'tool' ? <ToolSheet p="ra" active={active} /> : null}
    </div>
  );
}

function Plates() {
  const { ref, active } = usePlateIndex();
  return (
    <section
      className="ra-plates"
      id="products"
      aria-labelledby="ra-products-title"
    >
      <header className="ra-plates-head" data-reveal>
        <h2 id="ra-products-title">
          <span lang="en">{folioStudio.labels.products.en}</span>
          <small>{folioStudio.labels.products.zh}</small>
        </h2>
      </header>

      <div className="ra-wall" ref={ref}>
        <nav className="ra-rail" aria-label="四件产品">
          <ol>
            {lineIds.map((id, index) => (
              <li key={id} data-active={active === index}>
                <a href={`#${id}`}>
                  <i lang="en">{numerals[index]}</i>
                  <span>{lineNames[id]}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="ra-plate-list">
          {lineIds.map((id, index) => {
            const isWork = id === 'work';
            const line = isWork ? null : lines[id];
            return (
              <article
                key={id}
                id={id}
                className={`ra-plate ra-plate-${id}`}
                data-plate={index}
                data-active={active === index}
                data-scene="pass"
                aria-labelledby={`ra-plate-${id}`}
              >
                <figure className="ra-frame">
                  <span className="ra-edge ra-edge-start" aria-hidden="true">
                    {edges[id][0]}
                  </span>
                  <PlateArt id={id} active={active === index} />
                  <span className="ra-edge ra-edge-end" aria-hidden="true">
                    {edges[id][1]}
                  </span>
                  <figcaption>
                    <span lang="en">Plate {numerals[index]}</span>
                    {lineNames[id]} · {notes[id]}
                  </figcaption>
                </figure>

                <div className="ra-label">
                  <span className="ra-label-num" lang="en" aria-hidden="true">
                    {numerals[index]}
                  </span>
                  <p className="ra-label-meta">
                    {isWork ? (
                      <span>{work.kicker}</span>
                    ) : (
                      <>
                        <span>{line!.area}</span>
                        <span>{line!.status}</span>
                      </>
                    )}
                  </p>
                  <h3 id={`ra-plate-${id}`}>
                    <Link href={lineHref[id]}>{lineNames[id]}</Link>
                  </h3>
                  <p className="ra-label-line">{folioHomeCopy.products[id]}</p>
                  {isWork ? (
                    <>
                      <ul className="ra-status" aria-label="当前状态">
                        {work.status.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <div className="ra-actions">
                        <Link className="ra-button" href={lineHref.work}>
                          {work.actions.more}
                        </Link>
                        <a
                          className="ra-link"
                          href={GITHUB_URL}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {work.actions.github}
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                      </div>
                    </>
                  ) : (
                    <Link className="ra-link" href={lineHref[id]}>
                      {line!.more}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function DirectionA() {
  const root = useStage();
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const question = ending.title.slice(0, -1);
  const mark = ending.title.slice(-1);

  return (
    <div className="ra" ref={root}>
      <Header p="ra" home={R3_A} />

      <main id="main">
        <section
          className="ra-hero"
          data-scene="leave"
          data-parallax
          aria-labelledby="ra-title"
        >
          <LeafLight />
          <div className="ra-hero-copy">
            <h1 className="ra-mark" id="ra-title" aria-label="Molis AI">
              <span lang="en" aria-hidden="true">
                Molis<sup>AI</sup>
              </span>
            </h1>
            <AiWordCycle prefix="ra" />
            <p className="ra-keys">
              {folioStudio.keywords.map((word, index) => (
                <span key={word}>
                  {index ? (
                    <i lang="en" aria-hidden="true">
                      &amp;
                    </i>
                  ) : null}
                  {word}
                </span>
              ))}
            </p>
          </div>
          <div className="ra-arch" aria-hidden="true">
            <img
              src="/images/brand-a/work-garden.webp"
              width="1536"
              height="1024"
              alt=""
              fetchPriority="high"
            />
          </div>
        </section>

        <Plates />

        <section
          className="ra-letter"
          data-scene="pass"
          aria-label="关于 Molis AI"
        >
          <p className="ra-letter-from" lang="en" aria-hidden="true">
            Molis AI
          </p>
          <InkText
            className="ra-letter-text"
            text={folioHomeCopy.description}
            marks={lineIds.map((id) => lineNames[id])}
          />
          <p className="ra-amps" lang="en" aria-hidden="true">
            &amp; &amp; &amp;
          </p>
        </section>
      </main>

      <footer className="ra-end">
        <section
          className="ra-ending"
          data-parallax
          aria-labelledby="ra-ending-title"
        >
          <LeafLight quiet />
          <h2 id="ra-ending-title" data-reveal>
            {question}
            <span lang="en">{mark}</span>
          </h2>
          <div className="ra-paths">
            <div className="ra-path ra-path-business" data-reveal>
              <small>{contact.label}</small>
              <h3>
                {contact.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <div className="ra-path-links">
                <Link className="ra-button" href={contactHref('enterprise')}>
                  {contact.action}
                </Link>
                <Link className="ra-link" href={SOLUTIONS}>
                  了解解决方案
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div
              className="ra-path"
              data-reveal
              style={{ '--d': '120ms' } as Vars}
            >
              <small>{community.label}</small>
              <h3>
                {community.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <div className="ra-path-links">
                <Link className="ra-button ra-button-ghost" href={COMMUNITY}>
                  {community.action}
                </Link>
                <Link className="ra-link" href={LOGIN}>
                  {folioStudio.nav.login}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="ra-colophon">
          <div className="ra-seal" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs>
                <path
                  id="ra-seal-path"
                  d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0"
                />
              </defs>
              <text>
                <textPath href="#ra-seal-path">
                  MOLIS AI · 始终好奇 · 持续创造 · MOLIS AI · 始终好奇 ·
                  持续创造 ·
                </textPath>
              </text>
            </svg>
            <img
              src="/images/molis-logo.png"
              width="44"
              height="44"
              alt=""
              loading="lazy"
            />
          </div>
          <div className="ra-colophon-lead">
            <strong>Molis AI</strong>
            <p>{signature}</p>
          </div>
          <nav className="ra-colophon-links" aria-label="页尾导航">
            <div>
              <h2>{footer.productsLabel}</h2>
              <ul>
                {lineIds.map((id) => (
                  <li key={id}>
                    <Link href={lineHref[id]}>{lineNames[id]}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>{footer.studioLabel}</h2>
              <ul>
                <li>
                  <Link href={SOLUTIONS}>{footer.studio.solutions}</Link>
                </li>
                <li>
                  <Link href={ESSAYS}>{folioStudio.nav.essays}</Link>
                </li>
                <li>
                  <Link href={WIKI}>{folioStudio.nav.wiki}</Link>
                </li>
                <li>
                  <Link href={COMMUNITY}>{footer.studio.community}</Link>
                </li>
                <li>
                  <Link href={ABOUT}>{folioStudio.labels.team.zh}</Link>
                </li>
                <li>
                  <Link href={CONTACT}>{footer.studio.contact}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2>GitHub</h2>
              <ul>
                <li>
                  <a href={footer.github} target="_blank" rel="noreferrer">
                    github.com/molis-ai
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="ra-colophon-base">
            <span>{footer.copyright}</span>
            <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
