'use client';
import { useLayoutEffect, useRef } from 'react';
import { desk } from '../../../../content/folio-work';
import { demo } from '../../../../content/molis-tool';
import { folioLife } from '../../../../content/folio-life';
import { folioWorld } from '../../../../content/folio-world';
import { Demo } from '../pitch/_kit/kit';
import { useBaked } from './bake';
import { type Vars } from './kit';
import { Maquette, iso } from './world/model';

// 首页五间展厅里的作品。都是对产品方向的转译，文字取自 content/，标注照旧（界面示意、示意、概念稿、概念示意）。
// Work 灯箱：插件一块块拼上，AI 在写周报那一步递上卡片、点执行、反馈带着出处落进来。
// Tool 墙面文字：一只真正在动的光标，拖选、松开、动作弹出、按下「翻译」、译文贴上墙。
// Life 双联画：一幅水彩的海边，旁边一张便笺记着「想陪妈妈去看海」，天放晴时一步步陪你走到出发。
// Story 色域画：沿用，走近时中间那道光像门缝一样亮起来。
// World 方案模型：放在展厅中央的展台上，走近时一块块升起。

/** 圆角指针，白描边 */
export function Pointer({
  className,
  size = 30,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
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

/* ---------- Room 1 · Work 灯箱 ---------- */

/**
 * 一块灯箱，里面是简化过的 Molis Work：左边插件栏随镜头推近一块块拼上（随你生长），
 * 右边是 Pages 里的一页周报。一轮 12 秒：打字 → 助理递卡 → 光标点「执行」→ 三条反馈带着出处落进来 → 提示建好待办。
 */
export function WorkLightbox() {
  return (
    <Demo p="g-h" label={desk.label} className="g-h-lb">
      <div className="g-h-lb-frame" aria-hidden="true">
        <div className="g-h-lb-screen">
          <aside className="g-h-lb-dock">
            <p className="g-h-lb-project">{desk.project}</p>
            {desk.dock.map((name, index) => (
              <span
                key={name}
                className="g-h-lb-plugin"
                data-on={name === desk.plugin || undefined}
                style={{ '--k': index } as Vars}
              >
                <i />
                {name}
              </span>
            ))}
          </aside>
          <div className="g-h-lb-page">
            <p className="g-h-lb-crumb">
              {desk.plugin} <span>/</span> {desk.goal}
            </p>
            <p className="g-h-lb-head">{desk.heading}</p>
            <p className="g-h-lb-typed">
              <span>{desk.typed}</span>
              <i />
            </p>
            <ul className="g-h-lb-fed">
              {desk.inserted.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                  <small>{desk.source}</small>
                </li>
              ))}
            </ul>
            <span className="g-h-lb-rule" />
            <span className="g-h-lb-rule g-h-lb-rule-short" />
            <div className="g-h-lb-card">
              <p className="g-h-lb-who">
                <i />
                {desk.card.who} <span>· {desk.card.context}</span>
              </p>
              <p className="g-h-lb-text">{desk.card.text}</p>
              <p className="g-h-lb-actions">
                <span className="g-h-lb-run">{desk.card.run}</span>
                <span>{desk.card.skip}</span>
              </p>
            </div>
            <span className="g-h-lb-ripple" />
            <Pointer className="g-h-lb-cursor" size={22} />
            <p className="g-h-lb-toast">
              {desk.card.done} <span>· {desk.card.undo}</span>
            </p>
          </div>
        </div>
      </div>
    </Demo>
  );
}

/* ---------- Room 2 · Tool 墙面文字 ---------- */

/**
 * 墙上一句英文，一只真正在动的光标：滑进来、按住拖过那句、松开，三个动作在光标旁弹出，
 * 光标移到「翻译」按下去（有一圈涟漪），译文卡贴上墙。一轮 10 秒。
 * 光标和动作的位置按那句话实际排出来的位置算（换字体、换屏幕宽度都对得上）。
 */
export function ToolWall() {
  const wall = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLElement>(null);
  const chip = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const box = wall.current;
    const selected = mark.current;
    const first = chip.current;
    if (!box || !selected || !first) return;
    const place = () => {
      const outer = box.getBoundingClientRect();
      // 墙在三维里被缩放过，量出来的尺寸要换回版面上的尺寸
      const scale = outer.width / box.offsetWidth || 1;
      const rects = selected.getClientRects();
      if (!rects.length) return;
      const start = rects[0];
      const end = rects[rects.length - 1];
      const sx = (start.left - outer.left) / scale;
      const sy = (start.top + start.height / 2 - outer.top) / scale;
      const ex = (end.right - outer.left) / scale;
      const ey = (end.top + end.height / 2 - outer.top) / scale;
      box.style.setProperty('--sx', `${sx.toFixed(1)}px`);
      box.style.setProperty('--sy', `${sy.toFixed(1)}px`);
      box.style.setProperty('--ex', `${ex.toFixed(1)}px`);
      box.style.setProperty('--ey', `${ey.toFixed(1)}px`);
      const c = first.getBoundingClientRect();
      box.style.setProperty(
        '--cx',
        `${((c.left + c.width * 0.45 - outer.left) / scale).toFixed(1)}px`,
      );
      box.style.setProperty(
        '--cy',
        `${((c.top + c.height * 0.6 - outer.top) / scale).toFixed(1)}px`,
      );
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(box);
    void document.fonts?.ready.then(place);
    return () => observer.disconnect();
  }, []);

  return (
    <Demo p="g-h" label={demo.label} className="g-h-tw">
      <div className="g-h-tw-wall" ref={wall} aria-hidden="true">
        <p className="g-h-tw-url">{demo.url}</p>
        <p className="g-h-tw-en" lang="en">
          {demo.before}
          <mark ref={mark}>{demo.selection}</mark>
          {demo.after}
        </p>
        <p className="g-h-tw-chips">
          {demo.actions.map((action, index) => (
            <span key={action} ref={index === 0 ? chip : undefined}>
              {action}
            </span>
          ))}
        </p>
        <div className="g-h-tw-card">
          <i className="g-h-tw-tape" />
          <small>{demo.result.label}</small>
          <p>{demo.result.text}</p>
          <small>{demo.result.source}</small>
        </div>
        <span className="g-h-tw-ripple" />
        <Pointer className="g-h-tw-cursor" size={44} />
      </div>
    </Demo>
  );
}

/* ---------- Room 3 · Life 双联画 ---------- */

const seaSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="270" viewBox="0 0 360 270">
<defs>
<filter id="w" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="6"/><feDisplacementMap in="SourceGraphic" scale="12" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="1.1"/></filter>
<filter id="s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="p" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.45 0 0 0 0 0.4 0 0 0 0 0.33 0.7 0 0 0 -0.28"/></filter>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7d4e1"/><stop offset="0.62" stop-color="#ead8cb"/><stop offset="1" stop-color="#f4dcc4"/></linearGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ea6bd"/><stop offset="1" stop-color="#b9c9d4"/></linearGradient>
<linearGradient id="sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe0cb"/><stop offset="1" stop-color="#e2cdb0"/></linearGradient>
</defs>
<rect width="360" height="270" fill="#fbf8f2"/>
<g filter="url(#w)">
<rect x="10" y="10" width="340" height="150" fill="url(#sky)"/>
<rect x="10" y="150" width="340" height="52" fill="url(#sea)"/>
<rect x="10" y="196" width="340" height="64" fill="url(#sand)"/>
</g>
<circle cx="262" cy="128" r="24" fill="#f7cfa3" opacity="0.85" filter="url(#s)"/>
<circle cx="262" cy="130" r="13" fill="#f6c592" opacity="0.9"/>
<g stroke="#fff" stroke-opacity="0.55" stroke-width="1.4" stroke-linecap="round" fill="none">
<path d="M40 166 H96 M130 172 H198 M226 162 H300 M70 184 H150 M190 188 H262"/>
</g>
<path d="M10 199 Q90 192 180 198 T350 196 L350 204 L10 204 Z" fill="#fff" opacity="0.5"/>
<g fill="#5d6574">
<circle cx="226" cy="186" r="4.2"/><path d="M220.5 191 Q226 189 231.5 191 L234 214 L218 214 Z"/>
<circle cx="241" cy="194" r="3.1"/><path d="M237 198 Q241 196.5 245 198 L246.5 214 L235.5 214 Z"/>
</g>
<path d="M231 200 Q235 203 238 201" stroke="#5d6574" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<rect width="360" height="270" filter="url(#p)" opacity="0.55"/>
</svg>`;

/**
 * 左边一幅水彩：傍晚的海边，两个小小的人。右边一张它写给你的便笺，记着你说过的话，
 * 一步步走到出发；天放晴的那一步，画上的云散开。每一步都标「示意」。一轮 16 秒。
 */
export function LifeDiptych() {
  const sea = useBaked(seaSvg, 360, 270, { scale: 2.4 });
  const { example } = folioLife;
  const story =
    example.stories.find((item) => item.id === 'sea') ?? example.stories[0];
  return (
    <Demo p="g-h" label={`Molis Life 示意：${story.quote}`} className="g-h-ld">
      <div className="g-h-ld-pair" aria-hidden="true">
        <div className="g-h-ld-painting">
          <div className="g-h-ld-window">
            <img src={sea} width="360" height="270" alt="" />
            <span className="g-h-ld-clouds" />
          </div>
        </div>
        <div className="g-h-ld-note">
          <i className="g-h-ld-pin" />
          <p className="g-h-ld-tab">{story.tab}</p>
          <p className="g-h-ld-quote">{story.quote}</p>
          <ol>
            {story.steps.map((step, index) => (
              <li key={step} style={{ '--k': index } as Vars}>
                <span>{step}</span>
                <em>{example.stepTag}</em>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Demo>
  );
}

/* ---------- Room 4 · Story 色域画 ---------- */

const fieldSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="400" viewBox="0 0 260 400">
<defs>
<filter id="b" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="0.022 0.05" numOctaves="4" seed="8" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="8" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="3"/></filter>
<filter id="h" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
<filter id="s" x="-20%" y="-300%" width="140%" height="700%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="t" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9 0.6" numOctaves="2" seed="4" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0 0 0 -0.3"/></filter>
<pattern id="l" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><path d="M0 .6H2.4M.6 0V2.4" stroke="#fff" stroke-opacity=".06" stroke-width=".5"/></pattern>
<linearGradient id="g0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f2a44"/><stop offset="1" stop-color="#221e31"/></linearGradient>
<radialGradient id="g1" cx=".5" cy=".62" r=".78"><stop offset="0" stop-color="#7684b6"/><stop offset=".66" stop-color="#56639b"/><stop offset="1" stop-color="#48538a"/></radialGradient>
<radialGradient id="g2" cx=".5" cy=".3" r=".82"><stop offset="0" stop-color="#eecb99"/><stop offset=".66" stop-color="#daa974"/><stop offset="1" stop-color="#c79563"/></radialGradient>
</defs>
<rect width="260" height="400" fill="url(#g0)"/>
<g filter="url(#h)" opacity="0.55"><rect x="18" y="20" width="224" height="212" fill="#5a67a0"/><rect x="18" y="252" width="224" height="128" fill="#c8915e"/></g>
<g filter="url(#b)">
<rect x="22" y="24" width="216" height="204" rx="3" fill="url(#g1)"/>
<rect x="38" y="44" width="184" height="160" fill="#8a99c8" opacity="0.26"/>
<rect x="22" y="256" width="216" height="120" rx="3" fill="url(#g2)"/>
<rect x="40" y="270" width="180" height="88" fill="#f6dbb0" opacity="0.3"/>
</g>
<rect x="46" y="238" width="168" height="5" fill="#f4d6a6" opacity="0.5" filter="url(#s)"/>
<rect x="62" y="239.6" width="136" height="1.6" fill="#f9e6c4" opacity="0.55" filter="url(#b)"/>
<rect width="260" height="400" fill="url(#l)"/>
<rect width="260" height="400" filter="url(#t)" opacity="0.32"/>
</svg>`;

/** 暮蓝在上、暖沙在下；走近时中间那道光像门缝一样亮起来，两块色面慢慢呼吸 */
export function StoryField() {
  const src = useBaked(fieldSvg, 260, 400, { scale: 2.4 });
  return (
    <div className="g-h-field" aria-hidden="true">
      <img src={src} width="260" height="400" alt="" />
      <span className="g-h-field-glow g-h-field-up" />
      <span className="g-h-field-glow g-h-field-low" />
      <span className="g-h-field-door" />
    </div>
  );
}

/* ---------- Room 5 · World 展台上的方案模型 ---------- */

/** 模型上三处小旗：面馆、雾港、钥匙牌 */
const flags = [
  { at: iso(64, 236, 46), text: folioWorld.map.places[0].name },
  { at: iso(282, 50, 80), text: folioWorld.map.places[1].name },
  { at: iso(178, 154, 12), text: folioWorld.map.places[2].name },
];

/**
 * 展厅地上的一座白色展台，玻璃罩里放着 World 的纸模型；走近时模型一块块升起，三面小旗竖起来。
 * 这是放在 Room 的 floor 里的三维物件：展台正面在 z=0，顶面往里，模型立在顶面中间。
 */
export function WorldPlinth() {
  return (
    <span className="g-h-plinth" aria-hidden="true">
      <i className="g-h-plinth-shadow" />
      <i className="g-h-plinth-top" />
      <i className="g-h-plinth-front">
        <b>{folioWorld.map.note}</b>
      </i>
      <span className="g-h-plinth-piece">
        <span className="g-h-vitrine">
          <Maquette>
            {flags.map((flag, index) => (
              <g
                key={flag.text}
                className="g-h-flag"
                style={{ '--k': index } as Vars}
              >
                <line
                  x1={flag.at[0]}
                  y1={flag.at[1]}
                  x2={flag.at[0]}
                  y2={flag.at[1] - 34}
                />
                <rect
                  x={flag.at[0]}
                  y={flag.at[1] - 34}
                  width={flag.text.length * 11 + 14}
                  height="17"
                  rx="3"
                />
                <text x={flag.at[0] + 7} y={flag.at[1] - 22}>
                  {flag.text}
                </text>
              </g>
            ))}
          </Maquette>
          <span className="g-h-vitrine-glass" />
        </span>
      </span>
    </span>
  );
}

/* ---------- 参观信息里的平面图 ---------- */

type PlanRoom = { id: string; number: number; name: string };

/**
 * 平面图：前厅 A / I，Room 1–4 一圈，Room 5 接在 Room 4 右边（还在筹备，斜线底）；
 * 每间展厅都是链接。
 */
export function FloorPlan({ rooms }: { rooms: PlanRoom[] }) {
  const cells = [
    { x: 8, y: 8, w: 108, h: 104 },
    { x: 116, y: 8, w: 108, h: 104 },
    { x: 224, y: 8, w: 108, h: 104 },
    { x: 224, y: 112, w: 108, h: 110 },
    { x: 332, y: 112, w: 100, h: 110 },
  ];
  return (
    <nav className="g-h-plan" aria-label="展厅平面图">
      <svg viewBox="0 0 440 240" role="presentation">
        <defs>
          <pattern
            id="g-h-plan-hatch"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <path d="M0 0V7" className="g-h-plan-hatch-line" />
          </pattern>
        </defs>
        <rect className="g-h-plan-floor" x="8" y="8" width="324" height="214" />
        {rooms.map((room, index) => {
          const cell = cells[index];
          return (
            <a
              key={room.id}
              href={`#${room.id}`}
              aria-label={`Room ${room.number} · ${room.name}`}
            >
              <rect
                className={`g-h-plan-room${index === 4 ? ' g-h-plan-future' : ''}`}
                x={cell.x}
                y={cell.y}
                width={cell.w}
                height={cell.h}
              />
              <text
                className="g-h-plan-no"
                x={cell.x + 14}
                y={cell.y + 26}
                lang="en"
              >
                {room.number}
              </text>
              <text
                className="g-h-plan-name"
                x={cell.x + 14}
                y={cell.y + cell.h - 14}
                lang="en"
              >
                {room.name.replace('Molis ', '')}
              </text>
            </a>
          );
        })}
        <text
          className="g-h-plan-lobby"
          x="116"
          y="172"
          textAnchor="middle"
          lang="en"
        >
          A / I
        </text>
        <path
          className="g-h-plan-route"
          d="M62 236 V150 L54 112 L62 62 L116 63 L170 60 L224 63 L278 60 L279 112 L278 160 L279 236"
        />
        <path
          className="g-h-plan-wall"
          d="M80 222 H262 M296 222 H332 V112 M332 8 V112 M332 8 H8 V222 H44 M8 112 H36 M72 112 H262 M296 112 H332 M116 8 V46 M116 80 V112 M224 8 V46 M224 80 V222"
        />
        <path
          className="g-h-plan-wall g-h-plan-wall-future"
          d="M332 112 H432 V222 H332"
        />
        <circle className="g-h-plan-here" cx="279" cy="222" r="4.5" />
      </svg>
      <p className="g-h-plan-legend">
        <span>入口</span>
        <span>
          <i /> 你在这里
        </span>
        <span>
          <b /> 筹备中
        </span>
      </p>
    </nav>
  );
}
