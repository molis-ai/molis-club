'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { folioHomeCopy, folioStudio } from '../../../../../../content/folio';
import { lineImages } from '../../../../../../content/studio';
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
  useStepper,
  type Vars,
} from '../../_kit/kit';
import { findPitch } from '../../routes';
import { PitchBar } from '../../_kit/bar';
import { ToolSheet, WorkSheet } from '../../_kit/sheets';
import './d.css';

// D · 日光与生活：一天的光。清晨的工作台和一群人，白墙上的百叶窗影里读到工作室在做什么；
// 走近书桌看 Work 怎样干活；午后、傍晚、夜里各有一件正在做的东西；百叶窗影里再读到一句 World 的话；
// 最后灯灭了，只剩一扇暖光的窗。
// 内容与 Folio 首页同一份，只换视觉、版式与动效。照片是氛围图，不是团队纪实或用户证言。

const work = folioStudio.work;

type DayId = 'tool' | 'life' | 'story';

const day: Record<
  DayId,
  { src: string; w: number; h: number; note: string; pos: string }
> = {
  tool: {
    src: '/images/edition-c/making-study.jpg',
    w: 1536,
    h: 1024,
    note: '氛围图',
    pos: '50% 55%',
  },
  life: {
    src: '/images/atelier/reading-room.jpg',
    w: 1440,
    h: 960,
    note: lineImages.life.note,
    pos: '24% 50%',
  },
  story: {
    src: '/images/edition-c/story/homecoming.jpg',
    w: 1600,
    h: 900,
    note: lineImages.story.note,
    pos: '40% 50%',
  },
};

/** 百叶窗投下的光影：两层斜条缓慢漂移，光从窗外来 */
function Blinds({ className = '' }: { className?: string }) {
  return (
    <span className={`rd-blinds ${className}`} aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

export default function DirectionD() {
  const root = useStage();
  const dayRef = useStepper<HTMLDivElement>('.rd-day-item');
  const lines = folioStudio.lines;
  const { community } = folioStudio;
  const { contact } = ending.paths;

  return (
    <>
      <div className="rd" ref={root}>
        <Header p="rd" home={findPitch('d1').href} />

        <main id="main">
          {/* 清晨：先在白墙上读到字，一群人围着桌子的照片从下方的画框扩成满屏 */}
          <section
            className="rd-hero"
            data-scene="pin"
            aria-labelledby="rd-title"
          >
            <div className="rd-hero-stage">
              <Blinds className="rd-blinds-wall" />
              <div className="rd-hero-copy">
                <h1 className="rd-mark" id="rd-title" lang="en">
                  Molis AI
                </h1>
                <AiWordCycle prefix="rd" />
                <p className="rd-keys">
                  {folioStudio.keywords.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </p>
              </div>
              <div className="rd-hero-photo">
                <img
                  src="/images/atelier/makers-studio.jpg"
                  width="1672"
                  height="941"
                  alt=""
                  fetchPriority="high"
                />
                <Blinds />
                <span className="rd-sun" aria-hidden="true" />
              </div>
              <Link className="rd-hero-card" href={lineHref.work}>
                <span className="rd-hero-thumb" aria-hidden="true">
                  <img
                    src="/images/edition-c/studio-light.jpg"
                    width="1672"
                    height="941"
                    alt=""
                  />
                  <Blinds className="rd-blinds-small" />
                </span>
                <span className="rd-hero-card-text">
                  <small>{work.kicker}</small>
                  <strong>{work.name}</strong>
                  <em>{work.status[0]}</em>
                </span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <p className="rd-photo-note" aria-hidden="true">
                氛围图
              </p>
            </div>
          </section>

          {/* 白墙与百叶窗影：工作室身份说明逐字亮起 */}
          <section
            className="rd-manifesto"
            id="studio"
            data-scene="pin"
            aria-labelledby="rd-studio-title"
          >
            <div className="rd-manifesto-stage">
              <Blinds />
              <div className="rd-manifesto-copy">
                <p className="rd-manifesto-kicker">
                  <span lang="en">{home.studio.label}</span>
                  <span>{home.studio.labelZh}</span>
                </p>
                <InkText
                  as="h2"
                  id="rd-studio-title"
                  className="rd-manifesto-text"
                  text={home.studio.title}
                />
                <div className="rd-manifesto-row">
                  <p className="rd-manifesto-view">{home.studio.view}</p>
                  <InkText
                    className="rd-manifesto-more"
                    text={home.studio.text}
                    marks={lineIds.map((id) => lineNames[id])}
                  />
                </div>
              </div>
            </div>
          </section>

          <section
            className="rd-products"
            id="products"
            aria-labelledby="rd-products-title"
          >
            <h2 className="rd-eyebrow" id="rd-products-title">
              <span lang="en">{folioStudio.labels.products.en}</span>
              <small>{folioStudio.labels.products.zh}</small>
            </h2>

            {/* 上午：走近书桌，Work 从桌上升起来 */}
            <article
              className="rd-work"
              id="work"
              data-scene="pin"
              aria-labelledby="rd-work-title"
            >
              <div className="rd-work-stage">
                <div className="rd-work-photo" aria-hidden="true">
                  <img
                    src="/images/atelier/studio-desk.jpg"
                    width="1440"
                    height="960"
                    alt=""
                    loading="lazy"
                  />
                  <Blinds />
                </div>
                <div className="rd-work-copy">
                  <span className="rd-kicker">{work.kicker}</span>
                  <h3 id="rd-work-title">
                    <Link href={lineHref.work} lang="en">
                      {work.name}
                    </Link>
                  </h3>
                  <p className="rd-work-line">{folioHomeCopy.products.work}</p>
                  <p className="rd-ask">{home.asks.work}</p>
                  <ul className="rd-status" aria-label="当前状态">
                    {work.status.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="rd-actions">
                    <Link className="rd-button" href={lineHref.work}>
                      {work.actions.more}
                    </Link>
                    <a
                      className="rd-link"
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {work.actions.github}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <WorkSheet p="rd" active />
                <p className="rd-photo-note" aria-hidden="true">
                  氛围图 · 界面示意
                </p>
              </div>
            </article>

            {/* 午后、傍晚、夜里：照片换着时间，中间像一块只放三件事的屏幕 */}
            <div className="rd-day" ref={dayRef} aria-label="还在做的三件事">
              <div className="rd-day-stage" aria-hidden="true">
                {lines.map((line, index) => (
                  <figure
                    key={line.id}
                    className="rd-day-photo"
                    style={{ '--i': index } as Vars}
                  >
                    <img
                      src={day[line.id].src}
                      width={day[line.id].w}
                      height={day[line.id].h}
                      alt=""
                      loading="lazy"
                      style={{ objectPosition: day[line.id].pos }}
                    />
                    <figcaption>{day[line.id].note}</figcaption>
                  </figure>
                ))}
                <span className="rd-day-shade" />
                <div className="rd-device">
                  <ol style={{ '--n': lines.length } as Vars}>
                    {lines.map((line, index) => (
                      <li key={line.id} style={{ '--i': index } as Vars}>
                        {lineNames[line.id]}
                      </li>
                    ))}
                  </ol>
                  <span className="rd-device-dots">
                    {lines.map((line) => (
                      <i key={line.id} />
                    ))}
                  </span>
                </div>
              </div>

              {lines.map((line) => (
                <article
                  key={line.id}
                  className={`rd-day-item rd-day-${line.id}`}
                  id={line.id}
                  aria-labelledby={`rd-${line.id}-title`}
                >
                  <div className="rd-day-copy" data-reveal>
                    <p className="rd-day-meta">
                      <span>{home.areas[line.id]}</span>
                      <span>{line.status}</span>
                    </p>
                    <h3 id={`rd-${line.id}-title`}>
                      <Link href={lineHref[line.id]} lang="en">
                        {lineNames[line.id]}
                      </Link>
                    </h3>
                    <p className="rd-day-line">
                      {folioHomeCopy.products[line.id]}
                    </p>
                    <p className="rd-ask rd-ask-light">{home.asks[line.id]}</p>
                    {line.id === 'tool' ? (
                      <p className="rd-relation">
                        {home.relation.home}
                        <span>{home.relation.phase}</span>
                      </p>
                    ) : null}
                    <Link
                      className="rd-link rd-link-light"
                      href={lineHref[line.id]}
                    >
                      {line.more}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                    {line.id === 'tool' ? <ToolSheet p="rd" active /> : null}
                  </div>
                </article>
              ))}
            </div>

            {/* World：夜深以后，白墙上的百叶窗影里浮出一句话，旁边一张小卡 */}
            <div
              className="rd-world"
              id="world"
              data-scene="pass"
              aria-labelledby="rd-world-title"
            >
              <Blinds />
              <InkText className="rd-world-text" text={home.world.transition} />
              <Link
                className="rd-hero-card rd-world-card"
                href={home.world.href}
              >
                <span className="rd-world-glyph" aria-hidden="true">
                  <i />
                </span>
                <span className="rd-hero-card-text">
                  <small>{home.world.status}</small>
                  <strong id="rd-world-title">{home.world.name}</strong>
                  <em>{home.world.line}</em>
                </span>
                <span className="rd-world-more">
                  {home.world.more}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </Link>
            </div>
          </section>
        </main>

        <footer className="rd-end">
          {/* 灯灭了：琥珀色铺满，再暗下去，只剩一扇暖光的窗 */}
          <section
            className="rd-ending"
            data-scene="pin"
            aria-labelledby="rd-ending-title"
          >
            <div className="rd-ending-stage">
              <span className="rd-window" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              <h2 id="rd-ending-title">{home.close.transition}</h2>
            </div>
          </section>

          <section className="rd-paths" aria-label="两条去处">
            <div className="rd-path rd-path-business" data-reveal>
              <small>{contact.label}</small>
              <h3>
                {contact.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <div className="rd-path-links">
                <Link className="rd-button" href={contactHref('enterprise')}>
                  {home.close.cooperation.contact}
                </Link>
                <Link className="rd-link rd-link-light" href={SOLUTIONS}>
                  {home.close.cooperation.more}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div
              className="rd-path"
              data-reveal
              style={{ '--d': '140ms' } as Vars}
            >
              <small>{community.label}</small>
              <h3>
                {community.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <div className="rd-path-links">
                <Link className="rd-button rd-button-ghost" href={COMMUNITY}>
                  {community.action}
                </Link>
              </div>
            </div>
            <AlsoLinks p="rd" />
          </section>

          <div className="rd-colophon">
            <div className="rd-colophon-lead">
              <span className="rd-colophon-brand">
                <img
                  src="/images/molis-logo.png"
                  width="32"
                  height="32"
                  alt=""
                  loading="lazy"
                />
                Molis AI
              </span>
              <p>{signature}</p>
            </div>
            <ColophonLinks p="rd" />
            <div className="rd-colophon-base">
              <span>{footer.copyright}</span>
              <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
            </div>
          </div>
        </footer>
      </div>
      <PitchBar id="d1" />
    </>
  );
}
