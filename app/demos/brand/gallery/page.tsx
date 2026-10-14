'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  folioHomeCopy,
  folioStudio,
  folioTool,
} from '../../../../content/folio';
import type { FolioProductId } from '../../../../content/folio';
import { folioWorld } from '../../../../content/folio-world';
import { ending, lineImages, lineNames } from '../../../../content/studio';
import { desk } from '../../../../content/folio-work';
import { demo } from '../../../../content/molis-tool';
import { GITHUB_URL, INSTALL_URL } from '../../../../content/molis-work';
import { AiWordCycle } from '../ai-words';
import { useStepper } from '../pitch/_kit/kit';
import { Btn, More, Phrases, Room, Shell, Status, Tag, type Vars } from './kit';
import { Deck, type DeckRoom } from './home-deck';
import {
  FloorPlan,
  LifeDiptych,
  StoryField,
  ToolWall,
  WorkLightbox,
  WorldPlinth,
} from './home-rooms';
import { Marquee, useLabelWalk } from './home-say';
import {
  COMMUNITY,
  ESSAYS,
  SOLUTIONS,
  WORLD,
  contactHref,
  lineHref,
} from './routes';
import './world/world.css';
import './home.css';

// 白盒子美术馆官网首页。回到第六版那种纯粹的白盒子：哑光白墙、上方一片柔光、墙上随风晃的树影，
// 没有灯具、木地板和道具。内容按 Folio 最新版：
// 首屏（大字标 + 一张展厅照片，往下走推向墙上的 A/I；再往下是同一面墙的第二幕：镜头走近展签，写着 We build not only software，跑马灯是新的定义）
// → 展厅导览（五张卡牌）→ 五间展厅（镜头推近，作品动起来，展签浮现；World 是展台上的方案模型）
// → 结尾（企业合作、社区、平面图）。原来的工作室身份说明之后放到团队页。

const work = folioStudio.work;
const lines = Object.fromEntries(
  folioStudio.lines.map((line) => [line.id, line]),
) as Record<'tool' | 'life' | 'story', (typeof folioStudio.lines)[number]>;

/** 每件作品的媒介，写在名牌、卡牌和展签上；这是展览的说法，不是产品说法 */
const media: Record<FolioProductId, string> = {
  work: '灯箱',
  tool: '墙面文字',
  life: '双联画',
  story: '色域画',
  world: '方案模型',
};

const rooms: DeckRoom[] = [
  {
    id: 'work',
    number: 1,
    name: lineNames.work,
    line: folioHomeCopy.products.work,
    meta: work.kicker,
    medium: media.work,
  },
  ...(['tool', 'life', 'story'] as const).map((id, index) => ({
    id,
    number: index + 2,
    name: lineNames[id],
    line: folioHomeCopy.products[id],
    meta: `${folioHomeCopy.areas[id]} · ${lines[id].status}`,
    medium: media[id],
  })),
  {
    id: 'world',
    number: 5,
    name: folioWorld.name,
    line: folioWorld.line,
    meta: folioWorld.status,
    medium: media.world,
    future: true,
  },
];
const roomOf = (id: FolioProductId) =>
  rooms.find((room) => room.id === id) ?? rooms[0];

/** 一间展厅：门口一块名牌，进去后镜头推向正墙，作品动起来，展签浮现 */
function Hall({
  id,
  art,
  label,
  floor,
}: {
  id: FolioProductId;
  art: ReactNode;
  label: ReactNode;
  floor?: ReactNode;
}) {
  const room = roomOf(id);
  return (
    <>
      <div className="g-h-entry" aria-hidden="true" data-reveal>
        <p className="g-h-entry-no">
          <span lang="en">Room {room.number}</span>
          <span>{room.medium}</span>
        </p>
        <p className="g-h-entry-name" lang="en">
          {room.name}
        </p>
        <p className="g-h-entry-meta">
          {room.future ? <Tag>{room.meta}</Tag> : room.meta}
        </p>
      </div>
      <article
        className={`g-h-hall g-h-hall-${id}`}
        id={id}
        data-scene="pin"
        data-room
        aria-labelledby={`g-h-${id}-title`}
      >
        <div className="g-stage">
          <Room floor={floor}>
            <div className="g-group">
              <div className="g-art">{art}</div>
              <div className="g-label">{label}</div>
            </div>
          </Room>
        </div>
      </article>
    </>
  );
}

/** 展签第一行：Room 编号与媒介 */
function LabelRoom({ id }: { id: FolioProductId }) {
  const room = roomOf(id);
  return (
    <p className="g-label-room" aria-hidden="true">
      <span lang="en">Room {room.number}</span>
      <span>{room.medium}</span>
    </p>
  );
}

/** 展签上的一条产品线：领域与状态、名字、一句话、去处、画面说明 */
function LineLabel({
  id,
  note,
  extra,
}: {
  id: 'tool' | 'life' | 'story';
  note: string;
  extra?: ReactNode;
}) {
  const line = lines[id];
  return (
    <>
      <LabelRoom id={id} />
      <p className="g-label-meta">
        {folioHomeCopy.areas[id]} · {line.status}
      </p>
      <h3 className="g-label-name" id={`g-h-${id}-title`}>
        <Link href={lineHref[id]} lang="en">
          {lineNames[id]}
        </Link>
      </h3>
      <p className="g-label-line">{folioHomeCopy.products[id]}</p>
      {extra}
      <div className="g-label-links">
        <More href={lineHref[id]}>{line.more}</More>
      </div>
      <p className="g-label-note">{note}</p>
    </>
  );
}

/** 结尾：从产品走到企业合作与社区；左边一张平面图，可以回到任意一间展厅 */
function Ending() {
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const close = folioHomeCopy.ending;
  return (
    <section
      className="g-h-visit"
      id="visit"
      data-room
      aria-labelledby="g-h-visit-title"
    >
      <h2 id="g-h-visit-title" className="g-h-visit-lead" data-reveal>
        <Phrases text={close.transition} />
      </h2>
      <div className="g-h-visit-cols">
        <div className="g-h-visit-col g-h-visit-plan" data-reveal>
          <small lang="en">Floor plan</small>
          <FloorPlan rooms={rooms} />
        </div>
        <div
          className="g-h-visit-col"
          data-reveal
          style={{ '--delay': '100ms' } as Vars}
        >
          <small>{contact.label}</small>
          <h3>
            {contact.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h3>
          <div className="g-label-links">
            <Btn href={contactHref('enterprise')}>
              {close.cooperation.contact}
            </Btn>
            <More href={SOLUTIONS}>{close.cooperation.more}</More>
          </div>
        </div>
        <div
          className="g-h-visit-col"
          data-reveal
          style={{ '--delay': '200ms' } as Vars}
        >
          <small>{community.label}</small>
          <h3>
            {community.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h3>
          <div className="g-label-links">
            <Btn href={COMMUNITY} tone="ghost">
              {community.action}
            </Btn>
          </div>
        </div>
      </div>
      <p className="g-h-visit-also" data-reveal>
        <span>{close.also.label}</span>
        <a href={INSTALL_URL} target="_blank" rel="noreferrer">
          {close.also.install}
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
        <Link href={ESSAYS}>
          {close.also.essays}
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}

export default function GalleryHome() {
  const guide = useStepper<HTMLElement>('[data-room]');
  const walk = useLabelWalk();

  return (
    <Shell rooms mainRef={guide}>
      {/* 首屏：大字标与一行关键词，下面一张展厅照片；往下走，照片放大成整个视野，镜头推向墙上的 A/I。
          再往下是第二幕：镜头横移、走近右边的展签（展签钉在墙上不动），展签上写着 We build not only software，下面多出一行跑马灯 */}
      <section
        ref={walk}
        className="g-h-hero"
        data-scene="pin"
        data-room
        aria-labelledby="g-h-title"
      >
        <div className="g-stage">
          <span className="g-h-mat g-h-mat-top" aria-hidden="true" />
          <span className="g-h-mat g-h-mat-left" aria-hidden="true" />
          <span className="g-h-mat g-h-mat-right" aria-hidden="true" />
          <span className="g-h-mat g-h-mat-base" aria-hidden="true" />
          <div className="g-h-masthead">
            <h1 className="g-h-title" id="g-h-title" lang="en">
              Molis AI
            </h1>
            <p className="g-h-keys">
              {folioStudio.keywords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </p>
          </div>
          <div className="g-h-view">
            <Room>
              <div className="g-group g-h-group-hero">
                <div className="g-art g-h-vinyl">
                  <AiWordCycle prefix="g-h" />
                </div>
                <div className="g-label g-h-label-hero">
                  <p className="g-h-label-not" lang="en">
                    We build <em>not only</em> software,
                  </p>
                  {/* 第二幕：展签放大，下面多出一行跑马灯 */}
                  <Marquee />
                  {/* 落款 */}
                  <p className="g-h-label-sign" lang="en">
                    Molis AI
                  </p>
                </div>
              </div>
            </Room>
          </div>
          <p className="g-h-caption" aria-hidden="true">
            <span lang="en">
              Installation view, <em>A / I</em>
            </span>
            <span lang="en">Rooms 1–5</span>
          </p>
        </div>
      </section>

      <section
        className="g-h-products"
        id="products"
        aria-labelledby="g-h-products-title"
      >
        {/* 展厅导览：五张卡牌，点一下走到那间展厅 */}
        <div className="g-h-index" data-room>
          <header className="g-h-index-head" data-reveal>
            <h2 id="g-h-products-title">
              <span lang="en">{folioStudio.labels.products.en}</span>
              <small>{folioStudio.labels.products.zh}</small>
            </h2>
            <p lang="en" aria-hidden="true">
              Rooms 1–5
            </p>
          </header>
          <Deck rooms={rooms} />
        </div>

        <Hall
          id="work"
          art={<WorkLightbox />}
          label={
            <>
              <LabelRoom id="work" />
              <p className="g-label-meta">{work.kicker}</p>
              <h3 className="g-label-name" id="g-h-work-title">
                <Link href={lineHref.work} lang="en">
                  {work.name}
                </Link>
              </h3>
              <p className="g-label-line">{folioHomeCopy.products.work}</p>
              <Status items={work.status} />
              <div className="g-label-links">
                <Btn href={lineHref.work}>{work.actions.more}</Btn>
                <More href={GITHUB_URL} external>
                  {work.actions.github}
                </More>
              </div>
              <p className="g-label-note">{desk.note}</p>
            </>
          }
        />
        <Hall
          id="tool"
          art={<ToolWall />}
          label={
            <LineLabel
              id="tool"
              note={demo.note}
              extra={
                <p className="g-h-relation">
                  {folioTool.relation.home}
                  <Tag>{folioTool.relation.phase}</Tag>
                </p>
              }
            />
          }
        />
        <Hall
          id="life"
          art={<LifeDiptych />}
          label={<LineLabel id="life" note={lineImages.life.note} />}
        />
        <Hall
          id="story"
          art={<StoryField />}
          label={<LineLabel id="story" note={lineImages.story.note} />}
        />
        <Hall
          id="world"
          floor={<WorldPlinth />}
          art={
            <p className="g-h-world-text">
              <Phrases text={folioWorld.home.transition} />
            </p>
          }
          label={
            <>
              <LabelRoom id="world" />
              <p className="g-label-meta">
                <Tag>{folioWorld.status}</Tag>
              </p>
              <h3 className="g-label-name" id="g-h-world-title">
                <Link href={WORLD} lang="en">
                  {folioWorld.name}
                </Link>
              </h3>
              <p className="g-label-line">{folioWorld.line}</p>
              <div className="g-label-links">
                <More href={WORLD}>{folioWorld.home.more}</More>
              </div>
              <p className="g-label-note">{folioWorld.map.note}</p>
            </>
          }
        />
      </section>

      {/* 结尾也算导览的一站，走到这里导览条就收起 */}
      <Ending />

      {/* 导览条：在展厅里时出现在左下角，标出第几间 */}
      <nav className="g-h-guide" aria-label="展厅导览">
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
    </Shell>
  );
}
