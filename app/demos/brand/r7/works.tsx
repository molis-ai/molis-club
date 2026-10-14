'use client';
import type { ReactNode } from 'react';
import { desk } from '../../../../content/folio-work';
import { demo } from '../../../../content/molis-tool';
import { Demo, type Vars } from '../pitch/_kit/kit';
import { useBaked } from './bake';

// 白盒子美术馆 · 精修版的展厅与四件作品。
// 展厅仍是 CSS 三维搭的白盒子，这一版补上了材质与光：天花的柔光顶棚、浅色宽木地板、正墙上的洗墙光和作品灯、
// 一张黑色长凳给出尺度。作品：Work 三联版画、Tool 墙面文字、Life 水彩清单、Story 色域画。
// 都是对产品方向的转译，不是产品界面。带滤镜的部分（木纹、水彩底、画布）在打开页面后画成位图再挂上墙。

/** 一间白盒子展厅：children 挂在正墙上；bench 放一张长凳 */
export function Room({
  children,
  bench = false,
}: {
  children: ReactNode;
  bench?: boolean;
}) {
  return (
    <div className="wh-room" data-parallax>
      <div className="wh-cam">
        <span className="wh-plane wh-ceiling" aria-hidden="true" />
        <span className="wh-plane wh-side wh-left" aria-hidden="true" />
        <span className="wh-plane wh-side wh-right" aria-hidden="true" />
        <span className="wh-plane wh-floor" aria-hidden="true" />
        {bench ? (
          <span className="wh-bench" aria-hidden="true">
            <i className="wh-bench-shadow" />
            <i className="wh-bench-top" />
            <i className="wh-bench-front" />
          </span>
        ) : null}
        <div className="wh-wall">
          <div className="wh-hang">{children}</div>
        </div>
      </div>
      <span className="wh-grain" aria-hidden="true" />
    </div>
  );
}

/** 地板：六块宽木板一组，木纹与细小的纹点，偶尔一道接缝 */
const woodSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1400" viewBox="0 0 600 1400">
<defs>
<filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.2 0.0032" numOctaves="3" seed="11" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.42 0 0 0 0 0.32 0 0 0 0 0.22 1.1 0 0 0 -0.42"/></filter>
<filter id="k" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9 0.025" numOctaves="2" seed="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.3 0 0 0 0 0.24 0 0 0 0 0.18 0.9 0 0 0 -0.5"/></filter>
</defs>
<rect x="0" width="100" height="1400" fill="#ddd1bd"/><rect x="100" width="100" height="1400" fill="#d7cab3"/><rect x="200" width="100" height="1400" fill="#e0d5c2"/><rect x="300" width="100" height="1400" fill="#d4c6af"/><rect x="400" width="100" height="1400" fill="#dbcfba"/><rect x="500" width="100" height="1400" fill="#d6c9b2"/>
<rect width="600" height="1400" filter="url(#g)" opacity="0.5"/>
<rect width="600" height="1400" filter="url(#k)" opacity="0.3"/>
<g fill="#8a7b66" fill-opacity="0.45"><rect x="99.5" width="1" height="1400"/><rect x="199.5" width="1" height="1400"/><rect x="299.5" width="1" height="1400"/><rect x="399.5" width="1" height="1400"/><rect x="499.5" width="1" height="1400"/><rect x="599" width="1" height="1400"/></g>
<g fill="#8a7b66" fill-opacity="0.35"><rect x="0" y="420" width="100" height="1"/><rect x="100" y="1080" width="100" height="1"/><rect x="200" y="160" width="100" height="1"/><rect x="300" y="760" width="100" height="1"/><rect x="400" y="1260" width="100" height="1"/><rect x="500" y="540" width="100" height="1"/></g>
</svg>`;

/** 页面根节点上要挂的木地板位图；画好之前地板是样式表里的渐变木板 */
export function useWoodFloor(): Vars {
  const src = useBaked(woodSvg, 600, 1400, { scale: 1.5, fallback: 'none' });
  return src ? { '--wh-wood': `url("${src}")` } : {};
}

/**
 * Work 三联版画：三幅装在浅橡木框、宽白卡纸里的版画，底色是沙、雾、杏三种。
 * I 写下一句周报，II 助理递上一张操作卡、点「执行」，III 三条反馈带着出处落进来。
 * 一轮 12 秒，作品灯依次照亮三幅；基础样式是三幅都亮、都画完。
 */
export function Triptych({ active }: { active: boolean }) {
  return (
    <Demo p="wh" label={desk.label} active={active} className="wh-triptych">
      <div className="wh-tri" aria-hidden="true">
        <div className="wh-panel wh-panel-1">
          <div className="wh-frame">
            <div className="wh-passe">
              <div className="wh-print">
                <div className="wh-doc">
                  <p className="wh-crumb">
                    {desk.project} <span>/</span> {desk.goal}
                  </p>
                  <p className="wh-doc-head">{desk.heading}</p>
                  <p className="wh-typed">
                    <span className="wh-typed-text">{desk.typed}</span>
                    <i className="wh-caret" />
                  </p>
                  <span className="wh-rule" />
                  <span className="wh-rule wh-rule-short" />
                  <span className="wh-rule wh-rule-gap" />
                  <span className="wh-rule" />
                  <span className="wh-rule wh-rule-mid" />
                </div>
              </div>
            </div>
          </div>
          <span className="wh-numeral">I</span>
        </div>
        <div className="wh-panel wh-panel-2">
          <div className="wh-frame">
            <div className="wh-passe">
              <div className="wh-print">
                <div className="wh-doc wh-doc-faint">
                  <p className="wh-doc-head">{desk.heading}</p>
                  <span className="wh-rule" />
                  <span className="wh-rule wh-rule-short" />
                </div>
                <div className="wh-ask">
                  <p className="wh-ask-who">
                    <i className="wh-ask-dot" />
                    {desk.card.who}
                  </p>
                  <p className="wh-ask-context">{desk.card.context}</p>
                  <p className="wh-ask-text">{desk.card.text}</p>
                  <p className="wh-ask-actions">
                    <span className="wh-ask-run">{desk.card.run}</span>
                    <span>{desk.card.skip}</span>
                  </p>
                  <Pointer className="wh-tap" size={16} />
                </div>
              </div>
            </div>
          </div>
          <span className="wh-numeral">II</span>
        </div>
        <div className="wh-panel wh-panel-3">
          <div className="wh-frame">
            <div className="wh-passe">
              <div className="wh-print">
                <div className="wh-doc">
                  <p className="wh-doc-head">{desk.heading}</p>
                  <p className="wh-doc-line">{desk.typed}</p>
                  <ul className="wh-fed">
                    {desk.inserted.map((item) => (
                      <li key={item}>
                        <span>{item}</span>
                        <small>{desk.source}</small>
                      </li>
                    ))}
                  </ul>
                  <p className="wh-done">
                    {desk.card.done} <span>· {desk.card.undo}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <span className="wh-numeral">III</span>
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
    <Demo p="wh" label={demo.label} active={active} className="wh-walltext">
      <div className="wh-wt" aria-hidden="true">
        <p className="wh-wt-url">{demo.url}</p>
        <p className="wh-wt-en" lang="en">
          {demo.before}
          <mark>{demo.selection}</mark>
          {demo.after}
        </p>
        <div className="wh-wt-cursor">
          <Pointer size={58} />
          <p className="wh-wt-chips">
            {demo.actions.map((action) => (
              <span key={action}>{action}</span>
            ))}
          </p>
        </div>
        <div className="wh-wt-card">
          <i className="wh-tape" />
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
    <div className="wh-framed wh-framed-life" aria-hidden="true">
      <div className="wh-framed-mat">
        <div className="wh-life">
          <img src={base} width="300" height="360" alt="" />
          <svg className="wh-life-live" viewBox="0 0 300 360">
            <g className="wh-life-marks">
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
                      className="wh-life-strike"
                      pathLength={1}
                      style={{ '--at': (at + 0.03).toFixed(3) } as Vars}
                      d={`M48 ${y - 6} L${52 + tasks[row]} ${y - 6.6}`}
                    />
                  </g>
                );
              })}
            </g>
            <g className="wh-life-stems">
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
                className="wh-life-leaf"
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
                className={`wh-flower wh-flower-${flower.tone}`}
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
                  className="wh-flower-heart"
                  cx={flower.x}
                  cy={flower.y}
                  r={(flower.r * 0.3).toFixed(2)}
                />
              </g>
            ))}
          </svg>
          <span className="wh-paper-grain" />
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
    <div className="wh-field" aria-hidden="true">
      <img src={src} width="260" height="400" alt="" />
      <span className="wh-field-glow wh-field-glow-up" />
      <span className="wh-field-glow wh-field-glow-seam" />
      <span className="wh-field-glow wh-field-glow-low" />
    </div>
  );
}

/** 导览里的缩略图：一面小墙、一截木地板，墙上是那件作品的缩影 */
export function Thumb({ id }: { id: 'work' | 'tool' | 'life' | 'story' }) {
  return (
    <span className={`wh-thumb wh-thumb-${id}`} aria-hidden="true">
      <span className="wh-thumb-art">
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}

type PlanRoom = { id: string; number: number; name: string };

/**
 * 参观信息里的平面图：前厅 A / I，Room 1–4 一圈走下来，从 Room 4 出口离开。
 * 每间展厅是一个链接，点了回到那间展厅；杏色虚线是动线。
 */
export function FloorPlan({ rooms }: { rooms: PlanRoom[] }) {
  const cells = [
    { x: 8, y: 8, w: 108, h: 104 },
    { x: 116, y: 8, w: 108, h: 104 },
    { x: 224, y: 8, w: 108, h: 104 },
    { x: 224, y: 112, w: 108, h: 110 },
  ];
  return (
    <nav className="wh-plan" aria-label="展厅平面图">
      <svg viewBox="0 0 340 236" role="presentation">
        <rect className="wh-plan-floor" x="8" y="8" width="324" height="214" />
        {rooms.map((room, index) => {
          const cell = cells[index];
          return (
            <a
              key={room.id}
              href={`#${room.id}`}
              aria-label={`Room ${room.number} · ${room.name}`}
            >
              <rect
                className="wh-plan-room"
                x={cell.x}
                y={cell.y}
                width={cell.w}
                height={cell.h}
              />
              <text
                className="wh-plan-no"
                x={cell.x + 14}
                y={cell.y + 26}
                lang="en"
              >
                {room.number}
              </text>
              <text
                className="wh-plan-name"
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
          className="wh-plan-lobby"
          x="116"
          y="172"
          textAnchor="middle"
          lang="en"
        >
          A / I
        </text>
        <path
          className="wh-plan-route"
          d="M62 232 V150 L54 112 L62 62 L116 63 L170 60 L224 63 L278 60 L279 112 L278 167 L338 167"
        />
        <path
          className="wh-plan-wall"
          d="M80 222 H332 V184 M332 150 V8 H8 V222 H44 M8 112 H36 M72 112 H262 M296 112 H332 M116 8 V46 M116 80 V112 M224 8 V46 M224 80 V222"
        />
        <circle className="wh-plan-here" cx="332" cy="167" r="4.5" />
      </svg>
      <p className="wh-plan-legend">
        <span>入口</span>
        <span>
          <i /> 你在这里
        </span>
      </p>
    </nav>
  );
}
