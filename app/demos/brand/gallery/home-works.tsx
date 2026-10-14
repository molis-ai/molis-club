'use client';
import { desk } from '../../../../content/folio-work';
import { demo } from '../../../../content/molis-tool';
import type { FolioProductId } from '../../../../content/folio';
import { Demo, type Vars } from '../pitch/_kit/kit';
import { useBaked } from './bake';

// 首页四间展厅里的作品（来自第七版）：Work 三联版画、Tool 墙面文字、Life 水彩清单、Story 色域画，
// 以及导览缩略图和参观信息里的平面图。都是对产品方向的转译，不是产品界面。
// 带滤镜的部分（水彩底、画布）在打开页面后画成位图再挂上墙。

/**
 * Work 三联版画：三幅装在浅橡木框、宽白卡纸里的版画，底色是沙、雾、杏三种。
 * I 写下一句周报，II 助理递上一张操作卡、点「执行」，III 三条反馈带着出处落进来。
 * 一轮 12 秒，作品灯依次照亮三幅；基础样式是三幅都亮、都画完。
 */
export function Triptych({ active }: { active: boolean }) {
  return (
    <Demo p="wh" label={desk.label} active={active} className="g-triptych">
      <div className="g-tri" aria-hidden="true">
        <div className="g-panel g-panel-1">
          <div className="g-frame">
            <div className="g-passe">
              <div className="g-print">
                <div className="g-doc">
                  <p className="g-crumb">
                    {desk.project} <span>/</span> {desk.goal}
                  </p>
                  <p className="g-doc-head">{desk.heading}</p>
                  <p className="g-typed">
                    <span className="g-typed-text">{desk.typed}</span>
                    <i className="g-caret" />
                  </p>
                  <span className="g-rule" />
                  <span className="g-rule g-rule-short" />
                  <span className="g-rule g-rule-gap" />
                  <span className="g-rule" />
                  <span className="g-rule g-rule-mid" />
                </div>
              </div>
            </div>
          </div>
          <span className="g-numeral">I</span>
        </div>
        <div className="g-panel g-panel-2">
          <div className="g-frame">
            <div className="g-passe">
              <div className="g-print">
                <div className="g-doc g-doc-faint">
                  <p className="g-doc-head">{desk.heading}</p>
                  <span className="g-rule" />
                  <span className="g-rule g-rule-short" />
                </div>
                <div className="g-ask">
                  <p className="g-ask-who">
                    <i className="g-ask-dot" />
                    {desk.card.who}
                  </p>
                  <p className="g-ask-context">{desk.card.context}</p>
                  <p className="g-ask-text">{desk.card.text}</p>
                  <p className="g-ask-actions">
                    <span className="g-ask-run">{desk.card.run}</span>
                    <span>{desk.card.skip}</span>
                  </p>
                  <Pointer className="g-tap" size={16} />
                </div>
              </div>
            </div>
          </div>
          <span className="g-numeral">II</span>
        </div>
        <div className="g-panel g-panel-3">
          <div className="g-frame">
            <div className="g-passe">
              <div className="g-print">
                <div className="g-doc">
                  <p className="g-doc-head">{desk.heading}</p>
                  <p className="g-doc-line">{desk.typed}</p>
                  <ul className="g-fed">
                    {desk.inserted.map((item) => (
                      <li key={item}>
                        <span>{item}</span>
                        <small>{desk.source}</small>
                      </li>
                    ))}
                  </ul>
                  <p className="g-done">
                    {desk.card.done} <span>· {desk.card.undo}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <span className="g-numeral">III</span>
        </div>
      </div>
    </Demo>
  );
}

/** 圆角的指针：比系统箭头柔和，白描边让它在任何底色上都清楚 */
export function Pointer({
  className,
  size = 48,
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

/**
 * Tool 墙面文字：一句英文直接写在墙上，杏色的记号笔划过选中的那句，墙上的大指针旁出现三个动作，
 * 译文写在一张用纸胶带贴在墙上的卡片里。一轮 10 秒；基础样式是划好、贴好的样子。
 */
export function WallText({ active }: { active: boolean }) {
  return (
    <Demo p="wh" label={demo.label} active={active} className="g-walltext">
      <div className="g-wt" aria-hidden="true">
        <p className="g-wt-url">{demo.url}</p>
        <p className="g-wt-en" lang="en">
          {demo.before}
          <mark>{demo.selection}</mark>
          {demo.after}
        </p>
        <div className="g-wt-cursor">
          <Pointer size={58} />
          <p className="g-wt-chips">
            {demo.actions.map((action) => (
              <span key={action}>{action}</span>
            ))}
          </p>
        </div>
        <div className="g-wt-card">
          <i className="g-tape" />
          <small>{demo.result.label}</small>
          <p>{demo.result.text}</p>
          <small>{demo.result.source}</small>
        </div>
      </div>
    </Demo>
  );
}

/* ---------- Life 水彩清单 ---------- */

const rows = Array.from({ length: 12 }, (_, index) => 46 + index * 22);
/** 前八行是要做的事（手写的波浪线），后四行空着，花从那里长出来 */
const tasks = [118, 92, 134, 70, 104, 84, 124, 60];
const done = [0, 1, 2, 4, 5, 7];

function ruled(y: number, seed: number) {
  const wobble = (n: number) =>
    ((((seed * 31 + n * 17) % 7) - 3) * 0.16).toFixed(2);
  return `M30 ${y + Number(wobble(1))} C 110 ${y + Number(wobble(2))} 190 ${y + Number(wobble(3))} 270 ${y + Number(wobble(4))}`;
}

function scribble(y: number, length: number, seed: number) {
  let d = `M50 ${y - 6}`;
  for (let k = 0; k < Math.floor(length / 5); k += 1) {
    const amp = (k % 2 ? 1 : -1) * (2.2 + ((k * 7 + seed) % 3) * 0.7);
    d += ` q 2.5 ${amp.toFixed(1)} 5 0`;
  }
  return d;
}

const lifeBaseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360">
<defs>
<filter id="w" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="3" seed="5"/><feDisplacementMap in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="1.2"/></filter>
<filter id="e" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="3" seed="5"/><feDisplacementMap in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G"/><feMorphology operator="erode" radius="1.4"/><feGaussianBlur stdDeviation="0.8"/></filter>
<filter id="l" x="-5%" y="-50%" width="110%" height="200%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="9"/><feDisplacementMap in="SourceGraphic" scale="1.1"/></filter>
<filter id="p" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.45 0 0 0 0 0.4 0 0 0 0 0.33 0.7 0 0 0 -0.28"/></filter>
</defs>
<rect width="300" height="360" fill="#fbf8f1"/>
<g filter="url(#w)">
<ellipse cx="92" cy="70" rx="88" ry="26" fill="#dfe7ef" opacity="0.8"/>
<ellipse cx="226" cy="290" rx="80" ry="58" fill="#f5cfb2" opacity="0.62"/>
<ellipse cx="192" cy="324" rx="54" ry="22" fill="#d9e2cb" opacity="0.85"/>
</g>
<g filter="url(#e)" opacity="0.5">
<ellipse cx="226" cy="290" rx="80" ry="58" fill="none" stroke="#e9a57c" stroke-width="1.2"/>
</g>
<g filter="url(#l)" fill="none" stroke="#a7a196" stroke-width="0.6" stroke-linecap="round">
${rows.map((y, index) => `<path d="${ruled(y, index)}"/>`).join('')}
</g>
<g filter="url(#l)" fill="none" stroke="#6f6a61" stroke-width="0.85" stroke-linecap="round" stroke-linejoin="round">
${tasks.map((length, index) => `<path d="${scribble(rows[index], length, index)}"/>`).join('')}
</g>
<rect width="300" height="360" filter="url(#p)" opacity="0.6"/>
</svg>`;

const flowers = [
  {
    x: 232,
    y: 236,
    r: 11,
    tone: 'apricot',
    at: 0.66,
    stem: 'M238 360 C 240 322 228 282 232 248',
  },
  {
    x: 263,
    y: 262,
    r: 8,
    tone: 'butter',
    at: 0.72,
    stem: 'M252 360 C 254 324 264 296 263 271',
  },
  {
    x: 203,
    y: 270,
    r: 9,
    tone: 'peach',
    at: 0.77,
    stem: 'M224 360 C 222 328 206 302 203 280',
  },
  {
    x: 254,
    y: 303,
    r: 6.5,
    tone: 'blue',
    at: 0.82,
    stem: 'M246 360 C 248 340 256 320 254 310',
  },
  {
    x: 184,
    y: 312,
    r: 5.5,
    tone: 'apricot',
    at: 0.86,
    stem: 'M206 360 C 202 344 190 330 184 318',
  },
];

const leaves = [
  { x: 228, y: 304, rot: -38, at: 0.7 },
  { x: 247, y: 320, rot: 34, at: 0.75 },
  { x: 213, y: 322, rot: -28, at: 0.8 },
  { x: 236, y: 338, rot: 30, at: 0.84 },
];

/**
 * Life 水彩清单：一张装框的画纸上是铅笔横线和手写的待办，走近时一行行被勾掉、划去，
 * 空出来的几行里长出水彩小花——把琐事安顿好，让喜欢的生活发生。
 * 纸、水彩底和手写线条是位图；勾、划线和花是跟着镜头推近画出的矢量（--d），减少动态时直接是画完的样子。
 */
export function WatercolorList() {
  const base = useBaked(lifeBaseSvg, 300, 360, { scale: 2.6 });
  return (
    <div className="g-life-frame" aria-hidden="true">
      <div className="g-life-mat">
        <div className="g-life">
          <img src={base} width="300" height="360" alt="" />
          <svg className="g-life-live" viewBox="0 0 300 360">
            <g className="g-life-marks">
              {done.map((row, index) => {
                const y = rows[row];
                const at = 0.12 + index * 0.075;
                return (
                  <g key={row}>
                    <path
                      pathLength={1}
                      style={{ '--at': at.toFixed(3) } as Vars}
                      d={`M31 ${y - 7} l4 4.6 l8.5 -10.5`}
                    />
                    <path
                      className="g-life-strike"
                      pathLength={1}
                      style={{ '--at': (at + 0.03).toFixed(3) } as Vars}
                      d={`M48 ${y - 6} L${52 + tasks[row]} ${y - 6.6}`}
                    />
                  </g>
                );
              })}
            </g>
            <g className="g-life-stems">
              {flowers.map((flower) => (
                <path
                  key={flower.x}
                  pathLength={1}
                  style={{ '--at': (flower.at - 0.06).toFixed(3) } as Vars}
                  d={flower.stem}
                />
              ))}
            </g>
            {leaves.map((leaf) => (
              <g
                key={leaf.x}
                className="g-life-leaf"
                style={
                  {
                    '--at': leaf.at,
                    transformOrigin: `${leaf.x}px ${leaf.y}px`,
                  } as Vars
                }
              >
                <ellipse
                  cx={leaf.x}
                  cy={leaf.y}
                  rx="8"
                  ry="3.2"
                  transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
                />
              </g>
            ))}
            {flowers.map((flower) => (
              <g
                key={flower.x}
                className={`g-flower g-flower-${flower.tone}`}
                style={
                  {
                    '--at': flower.at,
                    transformOrigin: `${flower.x}px ${flower.y}px`,
                  } as Vars
                }
              >
                {Array.from({ length: 6 }, (_, petal) => {
                  const angle = (petal / 6) * Math.PI * 2 - Math.PI / 2;
                  const cx = flower.x + Math.cos(angle) * flower.r * 0.62;
                  const cy = flower.y + Math.sin(angle) * flower.r * 0.62;
                  return (
                    <ellipse
                      key={petal}
                      cx={cx.toFixed(2)}
                      cy={cy.toFixed(2)}
                      rx={(flower.r * 0.56).toFixed(2)}
                      ry={(flower.r * 0.38).toFixed(2)}
                      transform={`rotate(${((angle * 180) / Math.PI).toFixed(1)} ${cx.toFixed(2)} ${cy.toFixed(2)})`}
                    />
                  );
                })}
                <circle
                  className="g-flower-heart"
                  cx={flower.x}
                  cy={flower.y}
                  r={(flower.r * 0.3).toFixed(2)}
                />
              </g>
            ))}
          </svg>
          <span className="g-paper-grain" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Story 色域画 ---------- */

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
<g filter="url(#h)" opacity="0.55">
<rect x="18" y="20" width="224" height="212" fill="#5a67a0"/>
<rect x="18" y="252" width="224" height="128" fill="#c8915e"/>
</g>
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

/** Story 色域画：暮蓝在上、暖沙在下，中间一道像门缝透出的光。画布是位图，两块色面的呼吸是叠在上面的柔光 */
export function ColorField() {
  const src = useBaked(fieldSvg, 260, 400, { scale: 2.4 });
  return (
    <div className="g-field" aria-hidden="true">
      <img src={src} width="260" height="400" alt="" />
      <span className="g-field-glow g-field-glow-up" />
      <span className="g-field-glow g-field-glow-seam" />
      <span className="g-field-glow g-field-glow-low" />
    </div>
  );
}

/** 导览里的缩略图：一面小墙、一截木地板，墙上是那件作品的缩影；World 是展柜里的一件模型 */
export function Thumb({ id }: { id: FolioProductId }) {
  return (
    <span className={`g-thumb g-thumb-${id}`} aria-hidden="true">
      <span className="g-thumb-art">
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}

type PlanRoom = { id: string; number: number; name: string };

/**
 * 参观信息里的平面图：前厅 A / I，Room 1–4 一圈走下来，从 Room 4 下方离开；
 * Room 5 贴在 Room 4 右边，虚线墙、斜线底，是还在筹备的 World。每间展厅都是链接。
 */
export function FloorPlan({
  rooms,
  world,
}: {
  rooms: PlanRoom[];
  world: PlanRoom;
}) {
  const cells = [
    { x: 8, y: 8, w: 108, h: 104 },
    { x: 116, y: 8, w: 108, h: 104 },
    { x: 224, y: 8, w: 108, h: 104 },
    { x: 224, y: 112, w: 108, h: 110 },
  ];
  return (
    <nav className="g-plan" aria-label="展厅平面图">
      <svg viewBox="0 0 440 240" role="presentation">
        <defs>
          <pattern
            id="g-plan-hatch"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <path d="M0 0V7" className="g-plan-hatch-line" />
          </pattern>
        </defs>
        <rect className="g-plan-floor" x="8" y="8" width="324" height="214" />
        <a
          href={`#${world.id}`}
          aria-label={`Room ${world.number} · ${world.name}`}
        >
          <rect
            className="g-plan-room g-plan-future"
            x="332"
            y="112"
            width="100"
            height="110"
          />
          <text className="g-plan-no" x="346" y="138" lang="en">
            {world.number}
          </text>
          <text className="g-plan-name" x="346" y="208" lang="en">
            {world.name.replace('Molis ', '')}
          </text>
        </a>
        {rooms.map((room, index) => {
          const cell = cells[index];
          return (
            <a
              key={room.id}
              href={`#${room.id}`}
              aria-label={`Room ${room.number} · ${room.name}`}
            >
              <rect
                className="g-plan-room"
                x={cell.x}
                y={cell.y}
                width={cell.w}
                height={cell.h}
              />
              <text
                className="g-plan-no"
                x={cell.x + 14}
                y={cell.y + 26}
                lang="en"
              >
                {room.number}
              </text>
              <text
                className="g-plan-name"
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
          className="g-plan-lobby"
          x="116"
          y="172"
          textAnchor="middle"
          lang="en"
        >
          A / I
        </text>
        <path
          className="g-plan-route"
          d="M62 236 V150 L54 112 L62 62 L116 63 L170 60 L224 63 L278 60 L279 112 L278 160 L279 236"
        />
        <path
          className="g-plan-wall"
          d="M80 222 H262 M296 222 H332 V112 M332 8 V112 M332 8 H8 V222 H44 M8 112 H36 M72 112 H262 M296 112 H332 M116 8 V46 M116 80 V112 M224 8 V46 M224 80 V222"
        />
        <path
          className="g-plan-wall g-plan-wall-future"
          d="M332 112 H432 V222 H332"
        />
        <circle className="g-plan-here" cx="279" cy="222" r="4.5" />
      </svg>
      <p className="g-plan-legend">
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

/**
 * Room 5 · World 的展品：一只玻璃展柜里的白色纸模型，像建筑事务所的方案模型——
 * 一条巷子、一座雾里的小港、一枚钥匙牌，标「概念示意」。World 还是概念，所以它是模型，不是作品。
 */
export function Maquette({ note }: { note: string }) {
  return (
    <figure className="g-vitrine" aria-hidden="true">
      <div className="g-vitrine-case">
        <svg className="g-maquette" viewBox="0 0 360 250">
          <defs>
            <linearGradient id="g-mq-fog" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          {/* 底板 */}
          <path className="g-mq-top" d="M180 70 L340 150 L180 230 L20 150 Z" />
          <path className="g-mq-left" d="M20 150 L180 230 L180 240 L20 160 Z" />
          <path
            className="g-mq-right"
            d="M180 230 L340 150 L340 160 L180 240 Z"
          />
          {/* 水面与码头：雾港 */}
          <path
            className="g-mq-water"
            d="M232 96 L340 150 L268 186 L160 132 Z"
          />
          <path
            className="g-mq-pier-top"
            d="M250 140 L292 161 L284 165 L242 144 Z"
          />
          {/* 巷子两边的小楼：巷口的面馆 */}
          <g className="g-mq-block">
            <path className="g-mq-top" d="M78 130 L112 147 L88 159 L54 142 Z" />
            <path className="g-mq-left" d="M54 142 L88 159 L88 189 L54 172 Z" />
            <path
              className="g-mq-right"
              d="M88 159 L112 147 L112 177 L88 189 Z"
            />
          </g>
          <g className="g-mq-block">
            <path
              className="g-mq-top"
              d="M118 108 L146 122 L124 133 L96 119 Z"
            />
            <path
              className="g-mq-left"
              d="M96 119 L124 133 L124 175 L96 161 Z"
            />
            <path
              className="g-mq-right"
              d="M124 133 L146 122 L146 164 L124 175 Z"
            />
          </g>
          <g className="g-mq-block">
            <path
              className="g-mq-top"
              d="M132 160 L162 175 L140 186 L110 171 Z"
            />
            <path
              className="g-mq-left"
              d="M110 171 L140 186 L140 204 L110 189 Z"
            />
            <path
              className="g-mq-right"
              d="M140 186 L162 175 L162 193 L140 204 Z"
            />
          </g>
          {/* 面馆门口的一盏灯，唯一的杏色 */}
          <circle className="g-mq-lamp" cx="100" cy="176" r="2.4" />
          {/* 雾港的灯塔 */}
          <g className="g-mq-block">
            <path
              className="g-mq-left"
              d="M296 118 L304 122 L304 154 L296 150 Z"
            />
            <path
              className="g-mq-right"
              d="M304 122 L312 118 L312 150 L304 154 Z"
            />
            <path
              className="g-mq-top"
              d="M304 114 L312 118 L304 122 L296 118 Z"
            />
          </g>
          <path className="g-mq-fog" d="M200 100 L340 150 L340 120 L220 70 Z" />
          {/* 小树 */}
          <circle className="g-mq-tree" cx="168" cy="146" r="7" />
          <circle className="g-mq-tree" cx="182" cy="154" r="5" />
          {/* 第十三号钥匙牌：放在底板一角的一枚小牌 */}
          <g className="g-mq-key">
            <path d="M200 196 L222 207 L212 212 L190 201 Z" />
            <circle cx="198" cy="201" r="1.6" />
          </g>
        </svg>
        <span className="g-vitrine-glass" />
      </div>
      <span className="g-vitrine-plinth" />
      <figcaption>{note}</figcaption>
    </figure>
  );
}
