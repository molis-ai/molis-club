'use client';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { folioHomeCopy, folioStudio } from '../../../../../content/folio';
import { lineImages } from '../../../../../content/studio';
import { desk } from '../../../../../content/folio-work';
import { demo } from '../../../../../content/molis-tool';
import { GITHUB_URL } from '../../../../../content/molis-work';
import { AiWordCycle } from '../../ai-words';
import {
  ABOUT,
  COMMUNITY,
  CONTACT,
  ESSAYS,
  Header,
  LOGIN,
  SOLUTIONS,
  WIKI,
  contactHref,
  ending,
  footer,
  lineHref,
  lineIds,
  lineNames,
  signature,
  useStage,
  useStepper,
  type Vars,
} from '../_kit/kit';
import {
  ColorField,
  GridDrawing,
  Room,
  Thumb,
  Triptych,
  WallText,
} from './works';
import './wc.css';
import { findPitch } from '../routes';
import { PitchBar } from '../_kit/bar';

// 白盒子美术馆：近白的墙、极少的颜色、展签式的精确文字。
// 首屏像画廊官网——大字标与一张展厅照片；往下走，照片放大成整个视野，镜头推向墙上的 A/I 词组。
// 导览列出四个展厅；每个展厅停在视口里，镜头推近，展签浮现。结尾是参观信息式的两栏去处。
// 内容与 Folio 首页同一份。

const HOME = findPitch('white').href;

const work = folioStudio.work;
const lines = Object.fromEntries(
  folioStudio.lines.map((line) => [line.id, line]),
) as Record<'tool' | 'life' | 'story', (typeof folioStudio.lines)[number]>;

const rooms = lineIds.map((id, index) => ({
  id,
  number: index + 1,
  name: lineNames[id],
  line: folioHomeCopy.products[id],
  meta: id === 'work' ? work.kicker : `${lines[id].area} · ${lines[id].status}`,
}));

/** 一个展厅：镜头推向正墙，作品居中偏左，展签在右边 */
function Hall({
  id,
  art,
  label,
}: {
  id: 'work' | 'tool' | 'life' | 'story';
  art: ReactNode;
  label: ReactNode;
}) {
  const room = rooms.find((item) => item.id === id) ?? rooms[0];
  return (
    <>
      {/* 展厅门口的一块名牌 */}
      <div className="wc-entry" aria-hidden="true" data-reveal>
        <p className="wc-entry-no" lang="en">
          Room {room.number}
        </p>
        <p className="wc-entry-name" lang="en">
          {room.name}
        </p>
        <p className="wc-entry-meta">{room.meta}</p>
      </div>
      <article
        className={`wc-hall wc-hall-${id}`}
        id={id}
        data-scene="pin"
        data-room
        aria-labelledby={`wc-${id}-title`}
      >
        <div className="wc-stage">
          <Room>
            <div className="wc-group">
              <div className="wc-art">{art}</div>
              <div className="wc-label">{label}</div>
            </div>
          </Room>
        </div>
      </article>
    </>
  );
}

/** 展签上的一条产品线：编号、领域与状态、名字、一句话、去处、画面说明 */
function LineLabel({
  id,
  note,
}: {
  id: 'tool' | 'life' | 'story';
  note: string;
}) {
  const line = lines[id];
  const number = lineIds.indexOf(id) + 1;
  return (
    <>
      <p className="wc-label-room" lang="en" aria-hidden="true">
        Room {number}
      </p>
      <p className="wc-label-meta">
        {line.area} · {line.status}
      </p>
      <h3 className="wc-label-name" id={`wc-${id}-title`}>
        <Link href={lineHref[id]} lang="en">
          {lineNames[id]}
        </Link>
      </h3>
      <p className="wc-label-line">{folioHomeCopy.products[id]}</p>
      <div className="wc-label-links">
        <Link className="wc-more" href={lineHref[id]}>
          {line.more}
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>
      <p className="wc-label-note">{note}</p>
    </>
  );
}

export default function WhiteCube() {
  const root = useStage();
  const guide = useStepper<HTMLElement>('[data-room]');
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const question = ending.title.slice(0, -1);
  const mark = ending.title.slice(-1);

  return (
    <>
      <div className="wc" ref={root}>
        <Header p="wc" home={HOME} />

        <main id="main" ref={guide} data-step="0">
          {/* 首屏：大字标、简介，下面一张展厅照片；往下走，照片放大成整个视野 */}
          <section
            className="wc-hero"
            data-scene="pin"
            data-room
            aria-labelledby="wc-title"
          >
            <div className="wc-stage">
              <span className="wc-mat wc-mat-top" aria-hidden="true" />
              <span className="wc-mat wc-mat-left" aria-hidden="true" />
              <span className="wc-mat wc-mat-right" aria-hidden="true" />
              <span className="wc-mat wc-mat-base" aria-hidden="true" />
              <div className="wc-masthead">
                <h1 className="wc-title" id="wc-title" lang="en">
                  Molis AI
                </h1>
                <div className="wc-intro">
                  <p>{folioHomeCopy.description}</p>
                  <a className="wc-enter" href="#products">
                    看看我们在做什么
                    <ArrowDown size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="wc-frame">
                <Room>
                  <div className="wc-group wc-group-hero">
                    <div className="wc-art wc-vinyl">
                      <AiWordCycle prefix="wc" />
                    </div>
                    <div className="wc-label wc-label-hero">
                      <p
                        className="wc-label-artist"
                        lang="en"
                        aria-hidden="true"
                      >
                        Molis AI
                      </p>
                      <p
                        className="wc-label-title"
                        lang="en"
                        aria-hidden="true"
                      >
                        A / I
                      </p>
                      <p className="wc-keys">
                        {folioStudio.keywords.map((word) => (
                          <span key={word}>{word}</span>
                        ))}
                      </p>
                    </div>
                  </div>
                </Room>
              </div>
            </div>
          </section>

          <section
            className="wc-products"
            id="products"
            aria-labelledby="wc-products-title"
          >
            {/* 导览：四个展厅一目了然，点一下走过去 */}
            <div className="wc-index" data-room>
              <header className="wc-index-head" data-reveal>
                <h2 id="wc-products-title">
                  <span lang="en">{folioStudio.labels.products.en}</span>
                  <small>{folioStudio.labels.products.zh}</small>
                </h2>
                <p lang="en" aria-hidden="true">
                  Rooms 1–4
                </p>
              </header>
              <ol className="wc-rooms">
                {rooms.map((room) => (
                  <li
                    key={room.id}
                    data-reveal
                    style={{ '--delay': `${room.number * 70}ms` } as Vars}
                  >
                    <a href={`#${room.id}`}>
                      <span className="wc-rooms-no" aria-hidden="true">
                        {room.number}
                      </span>
                      <Thumb id={room.id} />
                      <strong lang="en">{room.name}</strong>
                      <span className="wc-rooms-line">{room.line}</span>
                      <small>{room.meta}</small>
                      <ArrowDown
                        className="wc-rooms-go"
                        size={16}
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <Hall
              id="work"
              art={<Triptych active />}
              label={
                <>
                  <p className="wc-label-room" lang="en" aria-hidden="true">
                    Room 1
                  </p>
                  <p className="wc-label-meta">{work.kicker}</p>
                  <h3 className="wc-label-name" id="wc-work-title">
                    <Link href={lineHref.work} lang="en">
                      {work.name}
                    </Link>
                  </h3>
                  <p className="wc-label-line">{folioHomeCopy.products.work}</p>
                  <ul className="wc-status" aria-label="当前状态">
                    {work.status.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="wc-label-links">
                    <Link className="wc-button" href={lineHref.work}>
                      {work.actions.more}
                    </Link>
                    <a
                      className="wc-more"
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {work.actions.github}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  </div>
                  <p className="wc-label-note">{desk.note}</p>
                </>
              }
            />
            <Hall
              id="tool"
              art={<WallText active />}
              label={<LineLabel id="tool" note={demo.note} />}
            />
            <Hall
              id="life"
              art={<GridDrawing />}
              label={<LineLabel id="life" note={lineImages.life.note} />}
            />
            <Hall
              id="story"
              art={<ColorField />}
              label={<LineLabel id="story" note={lineImages.story.note} />}
            />
          </section>

          {/* 参观信息：一个问题，两条去处 */}
          <section
            className="wc-visit"
            id="visit"
            data-room
            aria-labelledby="wc-visit-title"
          >
            <h2 id="wc-visit-title" data-reveal>
              {question}
              <span lang="en">{mark}</span>
            </h2>
            <div className="wc-visit-cols">
              <div className="wc-visit-col" data-reveal>
                <small>{contact.label}</small>
                <h3>
                  {contact.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <div className="wc-label-links">
                  <Link className="wc-button" href={contactHref('enterprise')}>
                    {contact.action}
                  </Link>
                  <Link className="wc-more" href={SOLUTIONS}>
                    了解解决方案
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div
                className="wc-visit-col"
                data-reveal
                style={{ '--delay': '120ms' } as Vars}
              >
                <small>{community.label}</small>
                <h3>
                  {community.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <div className="wc-label-links">
                  <Link className="wc-button wc-button-ghost" href={COMMUNITY}>
                    {community.action}
                  </Link>
                  <Link className="wc-more" href={LOGIN}>
                    {folioStudio.nav.login}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 导览条：在展厅里时出现在左下角，标出第几间 */}
          <nav className="wc-guide" aria-label="展厅导览">
            <span lang="en" aria-hidden="true">
              Room
            </span>
            <ol>
              {rooms.map((room) => (
                <li key={room.id}>
                  <a
                    href={`#${room.id}`}
                    aria-label={`${room.number} · ${room.name}`}
                  >
                    {room.number}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </main>

        <footer className="wc-colophon">
          <div className="wc-colophon-lead">
            <span className="wc-colophon-brand">
              <img
                src="/images/molis-logo.png"
                width="30"
                height="30"
                alt=""
                loading="lazy"
              />
              Molis AI
            </span>
            <p>{signature}</p>
          </div>
          <nav className="wc-colophon-links" aria-label="页尾导航">
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
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="wc-colophon-base">
            <span>{footer.copyright}</span>
            <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
          </div>
        </footer>
      </div>
      <PitchBar id="white" />
    </>
  );
}
