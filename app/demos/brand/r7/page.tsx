'use client';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { folioHomeCopy, folioStudio } from '../../../../content/folio';
import { lineImages } from '../../../../content/studio';
import { desk } from '../../../../content/folio-work';
import { demo } from '../../../../content/molis-tool';
import { GITHUB_URL } from '../../../../content/molis-work';
import { AiWordCycle } from '../ai-words';
import { useFontChoice } from '../font-choice';
import {
  ABOUT,
  COMMUNITY,
  CONTACT,
  ESSAYS,
  Header,
  LOGIN,
  SOLUTIONS,
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
} from '../pitch/_kit/kit';
import { WIKI } from '../folio/shared';
import {
  ColorField,
  FloorPlan,
  Room,
  Thumb,
  Triptych,
  WallText,
  WatercolorList,
  useWoodFloor,
} from './works';
import './wh.css';

// 白盒子美术馆 · 精修版（第七版）。结构与第六版相同，便于逐段对照：
// 首屏是画廊官网的大字标与一张展厅照片，往下走照片放大成整个视野；导览列出四个展厅；
// 每个展厅停在视口里，镜头推近，展签浮现；结尾是参观信息与平面图。
// 这一版打磨的是质感：更圆润的字体、展厅的材质与光、四件作品各自的画面。内容与 Folio 首页同一份。

const R7 = '/demos/brand/r7';

const work = folioStudio.work;
const lines = Object.fromEntries(
  folioStudio.lines.map((line) => [line.id, line]),
) as Record<'tool' | 'life' | 'story', (typeof folioStudio.lines)[number]>;

/** 每件作品的媒介，写在展签的第一行，是展览的说法，不是产品说法 */
const media = {
  work: '三联版画',
  tool: '墙面文字',
  life: '水彩清单',
  story: '色域画',
} as const;

const rooms = lineIds.map((id, index) => ({
  id,
  number: index + 1,
  name: lineNames[id],
  line: folioHomeCopy.products[id],
  meta: id === 'work' ? work.kicker : `${lines[id].area} · ${lines[id].status}`,
}));

/** 右下角的对照面板可以换的三种圆润字体 */
const fonts = [
  { id: 'figtree', label: 'Figtree' },
  { id: 'nunito', label: 'Nunito' },
  { id: 'outfit', label: 'Outfit' },
] as const;
type FontId = (typeof fonts)[number]['id'];

/** 一个展厅：镜头推向正墙，作品居中偏左，展签在右边 */
function Hall({
  id,
  art,
  label,
  bench = false,
}: {
  id: 'work' | 'tool' | 'life' | 'story';
  art: ReactNode;
  label: ReactNode;
  bench?: boolean;
}) {
  const room = rooms.find((item) => item.id === id) ?? rooms[0];
  return (
    <>
      {/* 展厅门口的一块名牌 */}
      <div className="wh-entry" aria-hidden="true" data-reveal>
        <p className="wh-entry-no">
          <span lang="en">Room {room.number}</span>
          <span>{media[id]}</span>
        </p>
        <p className="wh-entry-name" lang="en">
          {room.name}
        </p>
        <p className="wh-entry-meta">{room.meta}</p>
      </div>
      <article
        className={`wh-hall wh-hall-${id}`}
        id={id}
        data-scene="pin"
        data-room
        aria-labelledby={`wh-${id}-title`}
      >
        <div className="wh-stage">
          <Room bench={bench}>
            <div className="wh-group">
              <div className="wh-art">{art}</div>
              <div className="wh-label">{label}</div>
            </div>
          </Room>
        </div>
      </article>
    </>
  );
}

/** 展签的第一行：Room 编号与媒介 */
function LabelRoom({ id }: { id: 'work' | 'tool' | 'life' | 'story' }) {
  return (
    <p className="wh-label-room" aria-hidden="true">
      <span lang="en">Room {lineIds.indexOf(id) + 1}</span>
      <span>{media[id]}</span>
    </p>
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
  return (
    <>
      <LabelRoom id={id} />
      <p className="wh-label-meta">
        {line.area} · {line.status}
      </p>
      <h3 className="wh-label-name" id={`wh-${id}-title`}>
        <Link href={lineHref[id]} lang="en">
          {lineNames[id]}
        </Link>
      </h3>
      <p className="wh-label-line">{folioHomeCopy.products[id]}</p>
      <div className="wh-label-links">
        <Link className="wh-more" href={lineHref[id]}>
          {line.more}
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>
      <p className="wh-label-note">{note}</p>
    </>
  );
}

/** 对照面板：换字体、回到第六版。只在样张里出现 */
function Review({
  font,
  onFont,
}: {
  font: FontId;
  onFont: (font: FontId) => void;
}) {
  return (
    <fieldset className="wh-review">
      <legend className="sr-only">样张对照</legend>
      <span className="wh-review-label">字体</span>
      <div className="wh-review-seg">
        {fonts.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={font === item.id}
            data-font-sample={item.id}
            onClick={() => onFont(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <Link className="wh-review-link" href="/demos/brand/r6">
        对照第六版
        <ArrowUpRight size={12} aria-hidden="true" />
      </Link>
      <Link className="wh-review-link" href="/demos/brand/gallery">
        看完整官网
        <ArrowUpRight size={12} aria-hidden="true" />
      </Link>
    </fieldset>
  );
}

export default function WhiteCubeRefined() {
  const root = useStage();
  const guide = useStepper<HTMLElement>('[data-room]');
  const wood = useWoodFloor();
  const [font, chooseFont] = useFontChoice(fonts.map((item) => item.id));
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const question = ending.title.slice(0, -1);
  const mark = ending.title.slice(-1);

  return (
    <div className="wh" ref={root} data-font={font} style={wood}>
      <Header p="wh" home={R7} />

      <main id="main" ref={guide} data-step="0">
        {/* 首屏：大字标、简介，下面一张展厅照片；往下走，照片放大成整个视野 */}
        <section
          className="wh-hero"
          data-scene="pin"
          data-room
          aria-labelledby="wh-title"
        >
          <div className="wh-stage">
            <span className="wh-mat wh-mat-top" aria-hidden="true" />
            <span className="wh-mat wh-mat-left" aria-hidden="true" />
            <span className="wh-mat wh-mat-right" aria-hidden="true" />
            <span className="wh-mat wh-mat-base" aria-hidden="true" />
            <div className="wh-masthead">
              <h1 className="wh-title" id="wh-title" lang="en">
                Molis AI
              </h1>
              <div className="wh-intro">
                <p>{folioHomeCopy.description}</p>
                <a className="wh-enter" href="#products">
                  看看我们在做什么
                  <ArrowDown size={14} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="wh-frame-view">
              <Room bench>
                <div className="wh-group wh-group-hero">
                  <div className="wh-art wh-vinyl">
                    <AiWordCycle prefix="wh" />
                  </div>
                  <div className="wh-label wh-label-hero">
                    <p className="wh-label-artist" lang="en" aria-hidden="true">
                      Molis AI
                    </p>
                    <p className="wh-label-title" lang="en" aria-hidden="true">
                      A / I
                    </p>
                    <p className="wh-keys">
                      {folioStudio.keywords.map((word) => (
                        <span key={word}>{word}</span>
                      ))}
                    </p>
                  </div>
                </div>
              </Room>
            </div>
            <p className="wh-caption" aria-hidden="true">
              <span lang="en">
                Installation view, <em>A / I</em>
              </span>
              <span lang="en">Rooms 1–4</span>
            </p>
          </div>
        </section>

        <section
          className="wh-products"
          id="products"
          aria-labelledby="wh-products-title"
        >
          {/* 导览：四个展厅一目了然，点一下走过去 */}
          <div className="wh-index" data-room>
            <header className="wh-index-head" data-reveal>
              <h2 id="wh-products-title">
                <span lang="en">{folioStudio.labels.products.en}</span>
                <small>{folioStudio.labels.products.zh}</small>
              </h2>
              <p lang="en" aria-hidden="true">
                Rooms 1–4
              </p>
            </header>
            <ol className="wh-rooms">
              {rooms.map((room) => (
                <li
                  key={room.id}
                  data-reveal
                  style={{ '--delay': `${room.number * 70}ms` } as Vars}
                >
                  <a href={`#${room.id}`}>
                    <span className="wh-rooms-no" aria-hidden="true">
                      {room.number}
                    </span>
                    <Thumb id={room.id} />
                    <strong lang="en">{room.name}</strong>
                    <span className="wh-rooms-line">{room.line}</span>
                    <small>{room.meta}</small>
                    <ArrowDown
                      className="wh-rooms-go"
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
                <LabelRoom id="work" />
                <p className="wh-label-meta">{work.kicker}</p>
                <h3 className="wh-label-name" id="wh-work-title">
                  <Link href={lineHref.work} lang="en">
                    {work.name}
                  </Link>
                </h3>
                <p className="wh-label-line">{folioHomeCopy.products.work}</p>
                <ul className="wh-status" aria-label="当前状态">
                  {work.status.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="wh-label-links">
                  <Link className="wh-button" href={lineHref.work}>
                    {work.actions.more}
                  </Link>
                  <a
                    className="wh-more"
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {work.actions.github}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </div>
                <p className="wh-label-note">{desk.note}</p>
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
            art={<WatercolorList />}
            label={<LineLabel id="life" note={lineImages.life.note} />}
          />
          <Hall
            id="story"
            bench
            art={<ColorField />}
            label={<LineLabel id="story" note={lineImages.story.note} />}
          />
        </section>

        {/* 参观信息：一个问题，一张平面图，两条去处 */}
        <section
          className="wh-visit"
          id="visit"
          data-room
          aria-labelledby="wh-visit-title"
        >
          <h2 id="wh-visit-title" data-reveal>
            {question}
            <span lang="en">{mark}</span>
          </h2>
          <div className="wh-visit-cols">
            <div className="wh-visit-col wh-visit-plan" data-reveal>
              <small lang="en">Floor plan</small>
              <FloorPlan rooms={rooms} />
            </div>
            <div
              className="wh-visit-col"
              data-reveal
              style={{ '--delay': '100ms' } as Vars}
            >
              <small>{contact.label}</small>
              <h3>
                {contact.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <div className="wh-label-links">
                <Link className="wh-button" href={contactHref('enterprise')}>
                  {contact.action}
                </Link>
                <Link className="wh-more" href={SOLUTIONS}>
                  了解解决方案
                  <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div
              className="wh-visit-col"
              data-reveal
              style={{ '--delay': '200ms' } as Vars}
            >
              <small>{community.label}</small>
              <h3>
                {community.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <div className="wh-label-links">
                <Link className="wh-button wh-button-ghost" href={COMMUNITY}>
                  {community.action}
                </Link>
                <Link className="wh-more" href={LOGIN}>
                  {folioStudio.nav.login}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 导览条：在展厅里时出现在左下角，标出第几间 */}
        <nav className="wh-guide" aria-label="展厅导览">
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

      <footer className="wh-colophon">
        <div className="wh-colophon-lead">
          <span className="wh-colophon-brand">
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
        <nav className="wh-colophon-links" aria-label="页尾导航">
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
        <div className="wh-colophon-base">
          <span>{footer.copyright}</span>
          <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
        </div>
      </footer>

      <Review font={font} onFont={chooseFont} />
    </div>
  );
}
