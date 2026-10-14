'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useSyncExternalStore } from 'react';
import {
  folioHomeCopy,
  folioStudio,
  type FolioProductId,
} from '../../../../../content/folio';
import { folioWorld } from '../../../../../content/folio-world';
import { ending, lineNames } from '../../../../../content/studio';
import { INSTALL_URL } from '../../../../../content/molis-work';
import { AiWordCycle } from '../../ai-words';
import { Btn, More, Phrases, Room, Shell, type Vars } from '../kit';
import { Deck, type DeckRoom } from '../home-deck';
import { FloorPlan } from '../home-rooms';
import { COMMUNITY, ESSAYS, SOLUTIONS, contactHref } from '../routes';
import '../home.css';
import './type-lab.css';

// 字体方向对比：在白盒子美术馆的首页里取三段（首屏、展厅导览、结尾），同一份内容换五套字体。
// 版式、颜色、展厅都不变，只换字：英文、中文、点缀（编号与图注）各用什么字体，字重和字距跟着字体调。
// 底部切换方向（数字键 1–5 也可以），选择写在地址里（?v=b），刷新或发给别人都还是同一个。

type Direction = {
  id: 'a' | 'b' | 'c' | 'd' | 'e';
  name: string;
  mood: string;
  latin: string;
  cjk: string;
  accent: string;
};

const directions: Direction[] = [
  {
    id: 'a',
    name: '现行 · 圆润',
    mood: '现在白盒子美术馆用的：圆润的无衬线，柔边斜体做点缀。',
    latin: 'Figtree',
    cjk: '苹方',
    accent: 'Fraunces 柔边斜体',
  },
  {
    id: 'b',
    name: '画册 · 衬线',
    mood: '像一本展览画册：细长、有书卷气的衬线做标题，中文标题用宋体，小字仍是无衬线。',
    latin: 'Instrument Serif',
    cjk: '思源宋体',
    accent: 'Instrument Serif 斜体',
  },
  {
    id: 'c',
    name: '手札 · 文楷',
    mood: '像艺术家的工作手札：圆头的柔边衬线配文楷，带手写的温度，五套里最暖。',
    latin: 'Fraunces 柔边正体',
    cjk: '霞鹜文楷',
    accent: 'Fraunces 柔边斜体',
  },
  {
    id: 'd',
    name: '留白 · 细几何',
    mood: '像展墙上的刻字：细而圆的几何字，字距放开，中文用细体，最轻、最透气。',
    latin: 'Jost 细体',
    cjk: '苹方细体',
    accent: 'Jost 斜体',
  },
  {
    id: 'e',
    name: '当代 · 有性格',
    mood: '像当代艺术中心：略窄、带一点手工墨坑的无衬线，有个性，但笔画是软的。',
    latin: 'Bricolage Grotesque',
    cjk: '苹方',
    accent: '同一字体的细体',
  },
];

/* ---------- 方向写在地址里 ---------- */

const EVENT = 'molis-type-lab';

function readDirection() {
  return new URLSearchParams(window.location.search).get('v');
}

function subscribe(notify: () => void) {
  window.addEventListener('popstate', notify);
  window.addEventListener(EVENT, notify);
  return () => {
    window.removeEventListener('popstate', notify);
    window.removeEventListener(EVENT, notify);
  };
}

function useDirection() {
  const saved = useSyncExternalStore(subscribe, readDirection, () => null);
  const current = directions.find((item) => item.id === saved) ?? directions[0];
  const choose = (id: Direction['id']) => {
    const url = new URL(window.location.href);
    url.searchParams.set('v', id);
    window.history.replaceState(window.history.state, '', url);
    window.dispatchEvent(new Event(EVENT));
  };
  return [current, choose] as const;
}

/* ---------- 首页的三段：内容与首页同源 ---------- */

const work = folioStudio.work;
const lines = Object.fromEntries(
  folioStudio.lines.map((line) => [line.id, line]),
) as Record<'tool' | 'life' | 'story', (typeof folioStudio.lines)[number]>;

/** 每件作品的媒介：展览的说法，只作装饰标注 */
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

/** 首屏：大字标、三个关键词、一张展厅照片；这里停在第一帧，不往下推镜 */
function Hero() {
  return (
    <section
      className="g-h-hero g-tl-hero"
      aria-labelledby="g-tl-title"
      data-tl-part="首屏"
    >
      <div className="g-stage">
        <span className="g-h-mat g-h-mat-top" aria-hidden="true" />
        <span className="g-h-mat g-h-mat-left" aria-hidden="true" />
        <span className="g-h-mat g-h-mat-right" aria-hidden="true" />
        <span className="g-h-mat g-h-mat-base" aria-hidden="true" />
        <div className="g-h-masthead">
          <h1 className="g-h-title" id="g-tl-title" lang="en">
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
                <p className="g-h-label-artist" lang="en" aria-hidden="true">
                  Molis AI
                </p>
                <p className="g-label-title" lang="en" aria-hidden="true">
                  A / I
                </p>
                <p className="g-h-label-keys">
                  {folioStudio.keywords.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
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
  );
}

/** 展厅导览：五张卡牌 */
function Index() {
  return (
    <section
      className="g-h-index"
      aria-labelledby="g-tl-products"
      data-tl-part="展厅导览"
    >
      <header className="g-h-index-head" data-reveal>
        <h2 id="g-tl-products">
          <span lang="en">{folioStudio.labels.products.en}</span>
          <small>{folioStudio.labels.products.zh}</small>
        </h2>
        <p lang="en" aria-hidden="true">
          Rooms 1–5
        </p>
      </header>
      <Deck rooms={rooms} />
    </section>
  );
}

/** 结尾：一句中文大字，平面图、企业合作、社区三栏 */
function Ending() {
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const close = folioHomeCopy.ending;
  return (
    <section
      className="g-h-visit"
      aria-labelledby="g-tl-visit"
      data-tl-part="结尾"
    >
      <h2 id="g-tl-visit" className="g-h-visit-lead" data-reveal>
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

/* ---------- 切换方向 ---------- */

function Switcher({
  current,
  onChoose,
}: {
  current: Direction;
  onChoose: (id: Direction['id']) => void;
}) {
  const number = directions.indexOf(current) + 1;
  return (
    <aside className="g-tl-dock" aria-label="字体方向">
      <div className="g-tl-about" aria-live="polite">
        <p className="g-tl-about-name">
          <b lang="en">{number}</b>
          {current.name}
        </p>
        <p className="g-tl-about-mood">{current.mood}</p>
        <dl className="g-tl-about-fonts">
          <div>
            <dt>英文</dt>
            <dd>{current.latin}</dd>
          </div>
          <div>
            <dt>中文</dt>
            <dd>{current.cjk}</dd>
          </div>
          <div>
            <dt>点缀</dt>
            <dd>{current.accent}</dd>
          </div>
        </dl>
      </div>
      <fieldset className="g-tl-switch">
        <legend className="sr-only">选择字体方向</legend>
        {directions.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === current.id}
            onClick={() => onChoose(item.id)}
          >
            <span className={`g-tl-sample g-tl-sample-${item.id}`}>
              <span lang="en">Aa</span>
              <span>字</span>
            </span>
            <small>
              <span lang="en">{index + 1}</span>
              {item.name.split(' · ')[0]}
            </small>
          </button>
        ))}
      </fieldset>
    </aside>
  );
}

export default function TypeLab() {
  const [current, choose] = useDirection();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable]')) return;
      const index = Number(event.key) - 1;
      if (index >= 0 && index < directions.length) {
        choose(directions[index].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <Shell rooms className={`g-tl g-tl-${current.id}`}>
      <Hero />
      <Index />
      <Ending />
      <Switcher current={current} onChoose={choose} />
    </Shell>
  );
}
