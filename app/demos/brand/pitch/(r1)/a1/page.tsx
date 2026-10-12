'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { folioHomeCopy, folioStudio } from '../../../../../../content/folio';
import { lineImages } from '../../../../../../content/studio';
import { desk } from '../../../../../../content/folio-work';
import { demo } from '../../../../../../content/molis-tool';
import { GITHUB_URL } from '../../../../../../content/molis-work';
import { AiWordCycle } from '../../../ai-words';
import {
  AlsoLinks,
  COMMUNITY,
  CONTACT,
  ColophonLinks,
  Header,
  InkText,
  SOLUTIONS,
  contactHref,
  ending,
  footer,
  home,
  lineHref,
  lineIds,
  lineNames,
  signature,
  useStage,
  type Vars,
} from '../../_kit/kit';
import { findPitch } from '../../routes';
import { PitchBar } from '../../_kit/bar';
import { ToolSheet, WorkSheet } from '../../_kit/sheets';
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

const numerals = ['I', 'II', 'III', 'IV', 'V'];

const work = folioStudio.work;
const lines = Object.fromEntries(
  folioStudio.lines.map((line) => [line.id, line]),
) as Record<Exclude<PlateId, 'work'>, (typeof folioStudio.lines)[number]>;

/** 图版两侧的竖排小字：左边是所在领域，右边是阶段 */
const edges: Record<PlateId, [string, string]> = {
  work: [work.kicker, work.status[0]],
  tool: [home.areas.tool, lines.tool.status],
  life: [home.areas.life, lines.life.status],
  story: [home.areas.story, lines.story.status],
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
        <nav className="ra-rail" aria-label="产品">
          <ol>
            {lineIds.map((id, index) => (
              <li key={id} data-active={active === index}>
                <a href={`#${id}`}>
                  <i lang="en">{numerals[index]}</i>
                  <span>{lineNames[id]}</span>
                </a>
              </li>
            ))}
            <li data-active={active === 4}>
              <a href="#world">
                <i lang="en">{numerals[4]}</i>
                <span>{home.world.name}</span>
              </a>
            </li>
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
                        <span>{home.areas[line!.id]}</span>
                        <span>{line!.status}</span>
                      </>
                    )}
                  </p>
                  <h3 id={`ra-plate-${id}`}>
                    <Link href={lineHref[id]}>{lineNames[id]}</Link>
                  </h3>
                  <p className="ra-label-line">{folioHomeCopy.products[id]}</p>
                  <p className="ra-label-ask">{home.asks[id]}</p>
                  {id === 'tool' ? (
                    <p className="ra-label-relation">
                      {home.relation.home}
                      <span>{home.relation.phase}</span>
                    </p>
                  ) : null}
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

          {/* 第五幅：World 还没画，画框里是一张只起了铅笔稿的空白画布 */}
          <article
            id="world"
            className="ra-plate ra-plate-world"
            data-plate={4}
            data-active={active === 4}
            data-scene="pass"
            aria-labelledby="ra-plate-world"
          >
            <figure className="ra-frame">
              <span className="ra-edge ra-edge-start" aria-hidden="true">
                {home.world.status}
              </span>
              <div className="ra-canvas ra-canvas-blank">
                <svg viewBox="0 0 300 300" aria-hidden="true">
                  <g className="ra-underdrawing">
                    <path
                      pathLength={1}
                      style={{ '--k': 0 } as Vars}
                      d="M58 196 C 56 132 98 86 152 86 C 206 86 246 130 244 192"
                    />
                    <path
                      pathLength={1}
                      style={{ '--k': 1 } as Vars}
                      d="M40 200 C 100 214 200 214 262 198"
                    />
                    <path
                      pathLength={1}
                      style={{ '--k': 2 } as Vars}
                      d="M124 86 L124 62 L150 42 L176 62 L176 86 M142 86 L142 70 L158 70 L158 86"
                    />
                    <path
                      pathLength={1}
                      style={{ '--k': 3 } as Vars}
                      d="M206 108 L206 88 M206 88 C 194 88 192 70 204 68 C 206 56 222 58 220 70 C 232 72 228 88 216 88 Z"
                    />
                    <path
                      pathLength={1}
                      style={{ '--k': 4 } as Vars}
                      d="M84 160 C 110 150 132 166 156 156 C 178 148 196 162 222 154"
                    />
                    <path
                      pathLength={1}
                      style={{ '--k': 5 } as Vars}
                      d="M70 232 C 110 244 192 244 234 230 M96 256 C 130 264 172 264 206 254"
                    />
                    <circle
                      pathLength={1}
                      style={{ '--k': 6 } as Vars}
                      cx="232"
                      cy="46"
                      r="14"
                    />
                  </g>
                </svg>
              </div>
              <span className="ra-edge ra-edge-end" aria-hidden="true">
                {home.world.status}
              </span>
              <figcaption>
                <span lang="en">Plate {numerals[4]}</span>
                {home.world.name} · {home.world.status}
              </figcaption>
            </figure>
            <div className="ra-label">
              <span className="ra-label-num" lang="en" aria-hidden="true">
                {numerals[4]}
              </span>
              <p className="ra-label-meta">
                <span>{home.world.status}</span>
              </p>
              <h3 id="ra-plate-world">
                <Link href={home.world.href}>{home.world.name}</Link>
              </h3>
              <p className="ra-label-line">{home.world.line}</p>
              <p className="ra-label-ask">{home.world.transition}</p>
              <Link className="ra-link" href={home.world.href}>
                {home.world.more}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default function DirectionA() {
  const root = useStage();
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const { studio, close } = home;

  return (
    <>
      <div className="ra" ref={root}>
        <Header p="ra" home={findPitch('a1').href} />

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

          {/* 一封信：工作室身份说明，正文随滚动逐字显影 */}
          <section
            className="ra-letter"
            id="studio"
            data-scene="pass"
            aria-labelledby="ra-studio-title"
          >
            <p className="ra-letter-from">
              <span lang="en">{studio.label}</span> · {studio.labelZh}
            </p>
            <h2 id="ra-studio-title" className="ra-letter-title" data-reveal>
              {studio.title}
            </h2>
            <p className="ra-letter-view" data-reveal>
              {studio.view}
            </p>
            <InkText
              className="ra-letter-text"
              text={studio.text}
              marks={lineIds.map((id) => lineNames[id])}
            />
            <p className="ra-amps" lang="en" aria-hidden="true">
              &amp; &amp; &amp;
            </p>
          </section>

          <Plates />
        </main>

        <footer className="ra-end">
          <section
            className="ra-ending"
            data-parallax
            aria-labelledby="ra-ending-title"
          >
            <LeafLight quiet />
            <h2 id="ra-ending-title" data-reveal>
              {close.transition}
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
                    {close.cooperation.contact}
                  </Link>
                  <Link className="ra-link" href={SOLUTIONS}>
                    {close.cooperation.more}
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
                </div>
              </div>
            </div>
            <AlsoLinks p="ra" />
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
            <ColophonLinks p="ra" />
            <div className="ra-colophon-base">
              <span>{footer.copyright}</span>
              <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
            </div>
          </div>
        </footer>
      </div>
      <PitchBar id="a1" />
    </>
  );
}
