'use client';
import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { FolioProductId } from '../../../../../content/folio';
import { journey, worlds } from '../../../../../content/molis-story';
import { desk, demo, folioLife, folioWorld, sea } from './data';

// 产品主画面：用最典型的一个 case 演出这件产品的精髓。
// Tool 是这一版认可的做法（选中一句话 → 光标旁出现动作 → 翻译带着来源贴在旁边），按新风格重画；
// Work、Life、Story、World 先用现在这一版的内容占位，等产品介绍与 case 底稿定了再重做。
// 每段动画是一轮 CSS 关键帧，只在这件产品被选中、在视口里、没有暂停时播放（.is-on + data-running），
// 每次被选中都从头播。减少动态时直接停在结果上。

type StageProps = { on: boolean };

/** 圆角指针，白描边 */
function Pointer({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M7.2 4.6c-.5-.4-1.2 0-1.2.6v20.2c0 .7.8 1 1.3.6l4.9-4.4 3.6 7.6c.2.5.8.7 1.3.5l2.6-1.2c.5-.2.7-.8.5-1.3l-3.6-7.5 6.5-.4c.7 0 1-.9.5-1.4Z"
        fill="currentColor"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- Work：写周报时，助理递上一张操作卡 ---------- */

function WorkStage() {
  return (
    <div className="r8-sw" aria-hidden="true">
      <div className="r8-sw-win">
        <aside className="r8-sw-dock">
          <p className="r8-sw-project">{desk.project}</p>
          {desk.dock.map((name) => (
            <span
              key={name}
              className="r8-sw-plugin"
              data-on={name === desk.plugin || undefined}
            >
              <i />
              {name}
            </span>
          ))}
        </aside>
        <div className="r8-sw-page">
          <p className="r8-sw-crumb">
            {desk.plugin} <span>/</span> {desk.goal}
          </p>
          <p className="r8-sw-head">{desk.heading}</p>
          <p className="r8-sw-typed">
            <span>{desk.typed}</span>
          </p>
          <ul className="r8-sw-fed">
            {desk.inserted.map((item, index) => (
              <li key={item} style={{ '--k': index } as React.CSSProperties}>
                <span>{item}</span>
                <small>{desk.source}</small>
              </li>
            ))}
          </ul>
          <span className="r8-sw-rule" />
          <span className="r8-sw-rule r8-sw-rule-short" />
          <div className="r8-sw-card">
            <p className="r8-sw-who">
              <i />
              {desk.card.who} <span>· {desk.card.context}</span>
            </p>
            <p className="r8-sw-text">{desk.card.text}</p>
            <p className="r8-sw-actions">
              <span className="r8-sw-run">{desk.card.run}</span>
              <span>{desk.card.skip}</span>
            </p>
            <span className="r8-sw-ripple" />
            <Pointer className="r8-sw-cursor" />
          </div>
          <p className="r8-sw-toast">
            {desk.card.done} <span>· {desk.card.undo}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Tool：选中一句话，动作来到光标旁 ---------- */

/**
 * 网页上一句英文，一只真在动的光标：按住拖过那句、松开，三个动作在光标旁弹出，
 * 移到「翻译」按下去，译文卡带着来源贴在旁边。光标与动作的位置按那句话实际排出来的位置算。
 */
export function ToolStage({ on }: StageProps) {
  const box = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLElement>(null);
  const chips = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = box.current;
    const selected = mark.current;
    const bar = chips.current;
    if (!root || !selected || !bar) return;
    const place = () => {
      const outer = root.getBoundingClientRect();
      const rects = selected.getClientRects();
      if (!outer.width || !rects.length) return;
      const start = rects[0];
      const end = rects[rects.length - 1];
      const set = (key: string, value: number) =>
        root.style.setProperty(key, `${value.toFixed(1)}px`);
      set('--sx', start.left - outer.left + 2);
      set('--sy', start.top + start.height * 0.55 - outer.top);
      set('--ex', end.right - outer.left);
      set('--ey', end.top + end.height * 0.55 - outer.top);
      // 动作条放在选区末端下面，靠右时往回收，别出画
      const width = bar.offsetWidth;
      const left = Math.min(
        end.right - outer.left - width * 0.35,
        outer.width - width - 16,
      );
      set('--bx', Math.max(16, left));
      set('--by', end.bottom - outer.top + 12);
      const first = bar.firstElementChild as HTMLElement | null;
      if (first) {
        set(
          '--cx',
          Math.max(16, left) + first.offsetLeft + first.offsetWidth * 0.5,
        );
        set('--cy', end.bottom - outer.top + 12 + first.offsetHeight * 0.62);
      }
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(root);
    void document.fonts?.ready.then(place);
    return () => observer.disconnect();
  }, [on]);

  return (
    <div className="r8-st" ref={box} aria-hidden="true">
      <div className="r8-st-page">
        <p className="r8-st-url">{demo.url}</p>
        <p className="r8-st-h" lang="en">
          {demo.heading}
        </p>
        <p className="r8-st-p" lang="en">
          {demo.before}
          <mark ref={mark}>{demo.selection}</mark>
          {demo.after}
        </p>
      </div>
      <span className="r8-st-chips" ref={chips}>
        {demo.actions.map((action) => (
          <span key={action}>{action}</span>
        ))}
      </span>
      <div className="r8-st-card">
        <small>{demo.result.label}</small>
        <p>{demo.result.text}</p>
        <small className="r8-st-source">
          <ArrowUpRight size={11} aria-hidden="true" />
          {demo.result.source}
        </small>
      </div>
      <span className="r8-st-ripple" />
      <Pointer className="r8-st-cursor" />
    </div>
  );
}

/* ---------- Life：说过一次的心愿，在合适的时候陪你做成 ---------- */

/** 一张海边的小画：两个人站在傍晚的海边（Life 的「想陪妈妈去看海」） */
export function SeaPicture({ className = '' }: { className?: string }) {
  return (
    <div className={`r8-sl-picture ${className}`}>
      <span className="r8-sl-sky" />
      <span className="r8-sl-sun" />
      <span className="r8-sl-clouds">
        <i />
        <i />
        <i />
      </span>
      <span className="r8-sl-sea" />
      <span className="r8-sl-sand" />
      <svg className="r8-sl-people" viewBox="0 0 40 30">
        <circle cx="13" cy="7" r="3.2" />
        <path d="M8.6 12.4q4.4-2.6 8.8 0l1.6 16.6H7z" />
        <circle cx="25" cy="12.4" r="2.5" />
        <path d="M21.6 16.6q3.4-2 6.8 0l1 12.4h-8.8z" />
      </svg>
    </div>
  );
}

function LifeStage() {
  return (
    <div className="r8-sl" aria-hidden="true">
      <SeaPicture />
      <div className="r8-sl-note">
        <i className="r8-sl-pin" />
        <p className="r8-sl-tab">{sea.tab}</p>
        <p className="r8-sl-quote">{sea.quote}</p>
        <ol>
          {sea.steps.map((step, index) => (
            <li key={step} style={{ '--k': index } as React.CSSProperties}>
              <span>{step}</span>
              <em>{folioLife.example.stepTag}</em>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ---------- Story：此处 → 彼处 → 归来 ---------- */

const worldTone: Record<string, string> = {
  astralo: 'cloud',
  elsewhere: 'dawn',
  museum: 'lake',
  'fog-harbor': 'fog',
};

function StoryStage() {
  const keep = worlds.find((world) => world.id === 'fog-harbor') ?? worlds[0];
  return (
    <div className="r8-ss" aria-hidden="true">
      <div className="r8-ss-wall">
        {worlds.map((world, index) => (
          <span
            key={world.id}
            className={`r8-ss-door r8-ss-${worldTone[world.id] ?? 'dawn'}`}
            data-go={world.id === keep.id || undefined}
            style={{ '--k': index } as React.CSSProperties}
          >
            <span className="r8-ss-arch">
              <i />
              <i />
              <i />
            </span>
            <small>{world.name}</small>
          </span>
        ))}
        <span className="r8-ss-tag">
          <i />
          {keep.souvenir}
        </span>
      </div>
      <ol className="r8-ss-steps">
        {journey.steps.map((step, index) => (
          <li key={step.title} style={{ '--k': index } as React.CSSProperties}>
            <b>{step.title}</b>
            <span>{step.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- World：三样东西住进同一个慢慢长大的世界 ---------- */

/** 三处地方在小岛顶面上的位置（占岛的宽高百分比），和连起它们的小路 */
const spots = [
  { x: 26, y: 54 },
  { x: 71, y: 38 },
  { x: 54, y: 68 },
];

function WorldStage() {
  const { map } = folioWorld;
  return (
    <div className="r8-sv" aria-hidden="true">
      <p className="r8-sv-title">{map.title}</p>
      <div className="r8-sv-island">
        <svg viewBox="0 0 400 240">
          <defs>
            <linearGradient id="r8-sv-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#eef1e2" />
              <stop offset="1" stopColor="#d9e1c6" />
            </linearGradient>
            <linearGradient id="r8-sv-side" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d9c9ae" />
              <stop offset="1" stopColor="#c2ad8c" />
            </linearGradient>
          </defs>
          <ellipse className="r8-sv-shade" cx="200" cy="228" rx="118" ry="7" />
          <path
            d="M32 112c4 52 76 88 168 92s164-40 168-92z"
            fill="url(#r8-sv-side)"
          />
          <ellipse cx="200" cy="112" rx="168" ry="70" fill="url(#r8-sv-top)" />
          <ellipse
            cx="200"
            cy="104"
            rx="140"
            ry="50"
            fill="#fff"
            opacity="0.28"
          />
          <path
            className="r8-sv-route"
            d="M104 130C140 100 232 74 284 91S240 156 216 163"
          />
        </svg>
        {map.places.map((place, index) => (
          <span
            key={place.name}
            className={`r8-sv-spot r8-sv-${place.from}`}
            style={
              {
                '--k': index,
                left: `${spots[index].x}%`,
                top: `${spots[index].y}%`,
              } as React.CSSProperties
            }
          >
            <i />
            <b>{place.name}</b>
            <small>{place.kind}</small>
          </span>
        ))}
        <span className="r8-sv-sprout" />
      </div>
    </div>
  );
}

export function Stage({ id, on }: { id: FolioProductId; on: boolean }) {
  switch (id) {
    case 'work':
      return <WorkStage />;
    case 'tool':
      return <ToolStage on={on} />;
    case 'life':
      return <LifeStage />;
    case 'story':
      return <StoryStage />;
    case 'world':
      return <WorldStage />;
  }
}
