'use client';
import { demo } from '../../../../content/molis-tool';
import { lineNames } from '../../../../content/studio';

// E2 整站的轴测图工具：等轴测投影的面、盒子、线与编号引线，加上首页的工作室与产品小图。
// 画法统一：细线、三档灰面（顶面最亮，右前面次之，左前面最暗）、剖切面涂实、杏橙只给要紧的一处。
// 各页画自己的图时只用这里的 Face / Box / Line / Callout，样式在 e2.css 的「轴测图」一节。

export const C = Math.cos(Math.PI / 6);
export type P3 = [number, number, number];
export type Tone =
  | 'top'
  | 'light'
  | 'side'
  | 'dark'
  | 'cut'
  | 'floor'
  | 'accent'
  | 'glow';
export type Spot = 'work' | 'tool' | 'life' | 'story';

export const iso = ([x, y, z]: P3): [number, number] => [
  (x - y) * C,
  (x + y) / 2 - z,
];
export const pts = (list: P3[]) =>
  list
    .map(iso)
    .map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`)
    .join(' ');

export function Face({
  p,
  tone = 'top',
  className = '',
}: {
  p: P3[];
  tone?: Tone;
  className?: string;
}) {
  return (
    <polygon
      points={pts(p)}
      className={`e2-f e2-t-${tone} ${className}`}
      pathLength={1}
    />
  );
}

/** 一个立方体：顶面最亮，朝右前方的面次之，朝左前方的面最暗 */
export function Box({
  at,
  size,
  top = 'top',
  left = 'side',
  right = 'light',
}: {
  at: P3;
  size: P3;
  top?: Tone;
  left?: Tone;
  right?: Tone;
}) {
  const [x, y, z] = at;
  const [w, d, h] = size;
  return (
    <g>
      <Face
        tone={left}
        p={[
          [x, y + d, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ]}
      />
      <Face
        tone={right}
        p={[
          [x + w, y, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x + w, y, z + h],
        ]}
      />
      <Face
        tone={top}
        p={[
          [x, y, z + h],
          [x + w, y, z + h],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ]}
      />
    </g>
  );
}

export function Line({
  a,
  b,
  className = '',
}: {
  a: P3;
  b: P3;
  className?: string;
}) {
  const [x1, y1] = iso(a);
  const [x2, y2] = iso(b);
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className={`e2-l ${className}`}
      pathLength={1}
    />
  );
}

/**
 * 编号引线：从物件上的一点拉一条直线到 to（屏幕坐标），末端是「01 名字」式的标注框。
 * align 决定标注框在线端的左边还是右边。字用等宽体，宽度按字数估算。
 */
export function Callout({
  num,
  label,
  from,
  to,
  align,
}: {
  num?: string;
  label: string;
  from: P3;
  to: [number, number];
  align: 'left' | 'right';
}) {
  const [x1, y1] = iso(from);
  const [x2, y2] = to;
  const chars =
    (num ? num.length + 1 : 0) +
    Array.from(label).reduce(
      // 中文按两个等宽字算
      (sum, char) => sum + (char.charCodeAt(0) > 0x2e80 ? 1.7 : 1),
      0,
    );
  const width = chars * 0.62 + 1.5;
  const left = align === 'left' ? x2 : x2 - width;
  return (
    <g className="e2-callout" aria-hidden="true">
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="e2-leader" />
      <circle cx={x1} cy={y1} r={0.34} className="e2-anchor" />
      <rect
        x={left}
        y={y2 - 1.05}
        width={width}
        height={2.1}
        rx={0.2}
        className="e2-callout-box"
      />
      <text x={left + 0.75} y={y2 + 0.36} className="e2-callout-text">
        {num ? <tspan className="e2-callout-num">{num}</tspan> : null}
        <tspan dx={num ? 0.62 : 0}>{label}</tspan>
      </text>
    </g>
  );
}

const W = 44;
const D = 34;
const H = 24;

/** 大光标：在 y=17.5 的竖直面上，尖朝上 */
export const cursor: [number, number][] = [
  [0, 0],
  [0, 14],
  [3.4, 10.6],
  [5.8, 16],
  [8.2, 15],
  [5.8, 9.6],
  [10.4, 9.6],
];
export const arrow = (dy: number): P3[] =>
  cursor.map(([u, v]) => [8 + u * 0.62, 17.5 + dy, 5 + (16 - v) * 0.62]);

export function Room({ hrefs }: { hrefs: Record<Spot, string> }) {
  const sun = iso([12, 0, 16.5]);
  const leaf = iso([3.2, 19.6, 4]);
  const lampGlow = iso([16, 23.5, 15.5]);
  const chipAt = iso([16.5, 17.5, 15]);
  return (
    <svg
      className="e2-room"
      viewBox="-32 -28 74 70"
      aria-label="工作室轴测图，四件产品各在一处"
    >
      <defs>
        <clipPath id="e2-room-window">
          <polygon
            points={pts([
              [6, 0, 10],
              [18, 0, 10],
              [18, 0, 21],
              [6, 0, 21],
            ])}
          />
        </clipPath>
        <radialGradient id="e2-room-glow">
          <stop offset="0" stopColor="#e2875a" stopOpacity="0.32" />
          <stop offset="1" stopColor="#e2875a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 墙与地：墙顶与楼板的切面涂实 */}
      <g className="e2-shell">
        <Face
          tone="side"
          p={[
            [0, 0, 0],
            [0, D, 0],
            [0, D, H],
            [0, 0, H],
          ]}
        />
        <Face
          p={[
            [0, 0, 0],
            [W, 0, 0],
            [W, 0, H],
            [0, 0, H],
          ]}
        />
        <Face
          tone="cut"
          p={[
            [0, 0, H],
            [W, 0, H],
            [W, -1.4, H],
            [-1.4, -1.4, H],
            [-1.4, D, H],
            [0, D, H],
          ]}
        />
        <Face
          tone="floor"
          p={[
            [0, 0, 0],
            [W, 0, 0],
            [W, D, 0],
            [0, D, 0],
          ]}
        />
        <Face
          tone="cut"
          p={[
            [W, 0, 0],
            [W, D, 0],
            [W, D, -1.6],
            [W, 0, -1.6],
          ]}
        />
        <Face
          tone="cut"
          p={[
            [0, D, 0],
            [W, D, 0],
            [W, D, -1.6],
            [0, D, -1.6],
          ]}
        />
        {/* 地面的模数线 */}
        {[8, 16, 24].map((y) => (
          <Line key={y} a={[0, y, 0]} b={[W, y, 0]} className="e2-faint" />
        ))}
        {[11, 22, 33].map((x) => (
          <Line key={x} a={[x, 0, 0]} b={[x, D, 0]} className="e2-faint" />
        ))}
      </g>

      {/* 窗：太阳与远山 */}
      <g className="e2-window">
        <Face
          p={[
            [6, 0, 10],
            [18, 0, 10],
            [18, 0, 21],
            [6, 0, 21],
          ]}
        />
        <g clipPath="url(#e2-room-window)">
          <circle cx={sun[0]} cy={sun[1]} r={1.6} className="e2-sun" />
          <polyline
            className="e2-l"
            pathLength={1}
            points={pts([
              [6, 0, 12.5],
              [8, 0, 13.6],
              [10, 0, 13],
              [12.5, 0, 14.4],
              [15, 0, 13.2],
              [18, 0, 13.9],
            ])}
            fill="none"
          />
        </g>
        <Line a={[12, 0, 10]} b={[12, 0, 21]} />
        <Line a={[6, 0, 15.5]} b={[18, 0, 15.5]} />
        <Box at={[5.4, 0, 9.4]} size={[13.2, 1.4, 0.6]} />
      </g>

      {/* 书架与书 */}
      <g className="e2-shelf">
        <Box at={[24, 0, 16]} size={[15, 3, 0.7]} />
        {[
          [24.6, 3.4],
          [26, 4.6],
          [27.3, 3.8],
          [28.6, 4.2],
          [31.6, 3],
          [33, 4.8],
          [34.4, 3.6],
        ].map(([x, h], index) => (
          <Box
            key={index}
            at={[x, 0.4, 16.7]}
            size={[1.1, 2.2, h]}
            left={index % 3 === 0 ? 'dark' : 'side'}
          />
        ))}
        <Box at={[36, 0.4, 16.7]} size={[2.6, 2.2, 1]} />
      </g>

      {/* Story：墙上一扇半开的门，门里透出光，光铺在地上 */}
      <a
        href={hrefs.story}
        className="e2-spot e2-spot-story"
        aria-label={lineNames.story}
      >
        <Face
          tone="glow"
          className="e2-spill"
          p={[
            [0, 4, 0],
            [0, 11, 0],
            [13, 14, 0],
            [14, 2, 0],
          ]}
        />
        <Face
          tone="accent"
          className="e2-doorway"
          p={[
            [0, 4, 0],
            [0, 11, 0],
            [0, 11, 16],
            [0, 4, 16],
          ]}
        />
        <Line a={[0, 7.5, 0]} b={[0, 7.5, 16]} className="e2-ray" />
        <Face
          tone="light"
          p={[
            [0, 11, 0],
            [5.7, 7, 0],
            [5.7, 7, 16],
            [0, 11, 16],
          ]}
        />
        <Face
          tone="side"
          p={[
            [0, 11, 16],
            [5.7, 7, 16],
            [5.7, 6.6, 16.6],
            [0, 10.6, 16.6],
          ]}
        />
        <circle
          cx={iso([4.6, 7.8, 8])[0]}
          cy={iso([4.6, 7.8, 8])[1]}
          r={0.3}
          className="e2-knob"
        />
        <Callout
          num="04"
          label={lineNames.story}
          from={[0, 7.5, 16]}
          to={[-12.5, -21.5]}
          align="right"
        />
      </a>

      {/* Work：书桌、屏幕、键盘、杯子、椅子 */}
      <a
        href={hrefs.work}
        className="e2-spot e2-spot-work"
        aria-label={lineNames.work}
      >
        <Box at={[22, 3, 0]} size={[1, 1, 10]} />
        <Box at={[37, 3, 0]} size={[1, 1, 10]} />
        <Box at={[22, 10, 0]} size={[1, 1, 10]} />
        <Box at={[37, 10, 0]} size={[1, 1, 10]} />
        <Box at={[21.5, 2.5, 10]} size={[17, 9, 1]} />
        <Box at={[29, 5, 11]} size={[2, 1.6, 2]} />
        <Box
          at={[24.5, 4.8, 13]}
          size={[11, 1.2, 7.4]}
          left="top"
          right="side"
        />
        {/* 屏幕上：几行字与闪烁的光标 */}
        <g className="e2-screen">
          <Line a={[26, 6, 18.6]} b={[31, 6, 18.6]} className="e2-text" />
          <Line
            a={[26, 6, 17.2]}
            b={[33.5, 6, 17.2]}
            className="e2-text e2-faint"
          />
          <Line
            a={[26, 6, 15.8]}
            b={[29.5, 6, 15.8]}
            className="e2-text e2-faint"
          />
          <Line a={[29.9, 6, 15.2]} b={[29.9, 6, 16.4]} className="e2-caret" />
          <Face
            tone="accent"
            p={[
              [33.2, 6, 18.2],
              [34.6, 6, 18.2],
              [34.6, 6, 19.2],
              [33.2, 6, 19.2],
            ]}
          />
        </g>
        <Box at={[26, 8, 11]} size={[7, 2.4, 0.4]} top="light" />
        <Box at={[35, 8.2, 11]} size={[1.6, 1.6, 1.8]} />
        <Box at={[27.5, 14, 5]} size={[5, 5, 0.9]} />
        <Box at={[27.5, 18.4, 5.9]} size={[5, 0.8, 6]} />
        <Line a={[28, 14.5, 0]} b={[28, 14.5, 5]} />
        <Line a={[32, 14.5, 0]} b={[32, 14.5, 5]} />
        <Line a={[28, 18.5, 0]} b={[28, 18.5, 5]} />
        <Line a={[32, 18.5, 0]} b={[32, 18.5, 5]} />
        <Callout
          num="01"
          label={lineNames.work}
          from={[24.5, 4.8, 20.4]}
          to={[17.06, -18]}
          align="left"
        />
      </a>

      {/* Tool：底座上立着的大光标，旁边浮着三个动作 */}
      <a
        href={hrefs.tool}
        className="e2-spot e2-spot-tool"
        aria-label={lineNames.tool}
      >
        <Box at={[7, 15.5, 0]} size={[6, 5, 4.6]} />
        <Face tone="dark" p={arrow(-1.2)} />
        <Face tone="accent" className="e2-arrow" p={arrow(0)} />
        <g
          className="e2-chips"
          transform={`translate(${chipAt[0].toFixed(2)} ${chipAt[1].toFixed(2)})`}
        >
          {demo.actions.map((action, index) => (
            <g
              key={action}
              transform={`translate(${(index * 4.6).toFixed(2)} ${(index * 2.6).toFixed(2)})`}
            >
              <rect
                x={-2.1}
                y={-1.3}
                width={4.2}
                height={2.2}
                rx={0.4}
                className={index === 0 ? 'e2-chip e2-chip-on' : 'e2-chip'}
              />
              <text x={0} y={0.22} textAnchor="middle" className="e2-chip-text">
                {action}
              </text>
            </g>
          ))}
        </g>
        <Callout
          num="02"
          label={lineNames.tool}
          from={[8, 17.5, 14.92]}
          to={[-17, -18]}
          align="right"
        />
      </a>

      {/* Life：植物、扶手椅、小茶几上的杯子、亮着的落地灯 */}
      <a
        href={hrefs.life}
        className="e2-spot e2-spot-life"
        aria-label={lineNames.life}
      >
        <Box at={[1.4, 18, 0]} size={[3.6, 3.6, 4]} />
        <g transform={`translate(${leaf[0].toFixed(2)} ${leaf[1].toFixed(2)})`}>
          <path
            className="e2-l"
            d="M 0 0 q -0.4 -4 -2.6 -7.4 M 0 0 q 0.6 -3.6 2.8 -6 M 0 0 q 0 -4.6 0.4 -8.6"
            pathLength={1}
          />
          <ellipse
            cx={-2.8}
            cy={-7.8}
            rx={1.4}
            ry={2.6}
            transform="rotate(-30 -2.8 -7.8)"
            className="e2-f e2-t-top"
            pathLength={1}
          />
          <ellipse
            cx={3}
            cy={-6.4}
            rx={1.3}
            ry={2.4}
            transform="rotate(38 3 -6.4)"
            className="e2-f e2-t-side"
            pathLength={1}
          />
          <ellipse
            cx={0.4}
            cy={-9.4}
            rx={1.2}
            ry={2.4}
            className="e2-f e2-t-light"
            pathLength={1}
          />
        </g>
        <circle
          cx={lampGlow[0]}
          cy={lampGlow[1]}
          r={6}
          fill="url(#e2-room-glow)"
          className="e2-lamp-glow"
        />
        <Line a={[16, 23.5, 0]} b={[16, 23.5, 14]} />
        <Face
          tone="accent"
          p={[
            [14.6, 22.1, 14],
            [17.4, 22.1, 14],
            [16.8, 22.7, 17.6],
            [15.2, 22.7, 17.6],
          ]}
        />
        <Box at={[15, 22.5, 0]} size={[2, 2, 0.4]} />
        <Box at={[4, 24, 2.6]} size={[9, 8, 3]} />
        <Box at={[4, 24, 5.6]} size={[1.8, 8, 7.4]} />
        <Box at={[4, 24, 5.6]} size={[9, 1.4, 2.8]} />
        <Box at={[4, 30.6, 5.6]} size={[9, 1.4, 2.8]} />
        <Box at={[18, 26, 0]} size={[4, 4, 6]} />
        <Box at={[19.2, 27.2, 6]} size={[1.4, 1.4, 1.4]} />
        <Callout
          num="03"
          label={lineNames.life}
          from={[4.9, 28, 13]}
          to={[-21.5, -15]}
          align="right"
        />
      </a>
    </svg>
  );
}

/** 产品栏里的小图：每件产品单独画一遍，复用房间里的物件 */
export function Pip({ kind }: { kind: Spot }) {
  if (kind === 'work')
    return (
      <svg className="e2-pip" viewBox="-12.6 -13 25.6 32.6" aria-hidden="true">
        <g transform="translate(-20 -6)">
          <Box at={[22, 3, 0]} size={[1, 1, 10]} />
          <Box at={[37, 10, 0]} size={[1, 1, 10]} />
          <Box at={[22, 10, 0]} size={[1, 1, 10]} />
          <Box at={[21.5, 2.5, 10]} size={[17, 9, 1]} />
          <Box at={[29, 5, 11]} size={[2, 1.6, 2]} />
          <Box
            at={[24.5, 4.8, 13]}
            size={[11, 1.2, 7.4]}
            left="top"
            right="side"
          />
          <Line a={[26, 6, 18.6]} b={[31, 6, 18.6]} />
          <Line a={[26, 6, 17.2]} b={[33.5, 6, 17.2]} className="e2-faint" />
          <Line a={[29.9, 6, 15.2]} b={[29.9, 6, 16.4]} className="e2-caret" />
          <Face
            tone="accent"
            p={[
              [33.2, 6, 18.2],
              [34.6, 6, 18.2],
              [34.6, 6, 19.2],
              [33.2, 6, 19.2],
            ]}
          />
        </g>
      </svg>
    );
  if (kind === 'tool')
    return (
      <svg className="e2-pip" viewBox="-8.2 -12 12.8 22" aria-hidden="true">
        <g transform="translate(5 -8)">
          <Box at={[7, 15.5, 0]} size={[6, 5, 4.6]} />
          <Face tone="dark" p={arrow(-1.2)} />
          <Face tone="accent" p={arrow(0)} />
        </g>
      </svg>
    );
  if (kind === 'life')
    return (
      <svg
        className="e2-pip"
        viewBox="-25.4 -14.4 22.6 22.4"
        aria-hidden="true"
      >
        <g transform="translate(0 -14)">
          <Box at={[4, 24, 2.6]} size={[9, 8, 3]} />
          <Box at={[4, 24, 5.6]} size={[1.8, 8, 7.4]} />
          <Box at={[4, 24, 5.6]} size={[9, 1.4, 2.8]} />
          <Box at={[4, 30.6, 5.6]} size={[9, 1.4, 2.8]} />
          <Line a={[16, 23.5, 0]} b={[16, 23.5, 14]} />
          <Face
            tone="accent"
            p={[
              [14.6, 22.1, 14],
              [17.4, 22.1, 14],
              [16.8, 22.7, 17.6],
              [15.2, 22.7, 17.6],
            ]}
          />
          <Box at={[15, 22.5, 0]} size={[2, 2, 0.4]} />
        </g>
      </svg>
    );
  return (
    <svg className="e2-pip" viewBox="-13.4 -19 19.6 26.6" aria-hidden="true">
      <g transform="translate(-1 -4)">
        <Face
          tone="glow"
          p={[
            [0, 4, 0],
            [0, 11, 0],
            [8, 13, 0],
            [9, 2, 0],
          ]}
        />
        <Face
          tone="accent"
          p={[
            [0, 4, 0],
            [0, 11, 0],
            [0, 11, 16],
            [0, 4, 16],
          ]}
        />
        <Face
          tone="light"
          p={[
            [0, 11, 0],
            [5.7, 7, 0],
            [5.7, 7, 16],
            [0, 11, 16],
          ]}
        />
        <Face
          tone="side"
          p={[
            [0, 11, 16],
            [5.7, 7, 16],
            [5.7, 6.6, 16.6],
            [0, 10.6, 16.6],
          ]}
        />
      </g>
    </svg>
  );
}

/** World 的小图：一块底座上的小屋、门前一条小路、一棵树和一件带回来的小物件——一个慢慢布置起来的小世界（概念示意） */
export function WorldPip() {
  const crown = iso([3.5, 11.5, 6.6]);
  return (
    <svg className="e2-pip" viewBox="-14.5 -11 28 22" aria-hidden="true">
      <Box at={[0, 0, 0]} size={[15, 15, 1.6]} left="side" right="light" />
      {[5, 10].map((y) => (
        <Line
          key={y}
          a={[0.6, y, 1.6]}
          b={[14.4, y, 1.6]}
          className="e2-faint"
        />
      ))}
      {/* 门前的小路 */}
      <Face
        tone="floor"
        p={[
          [7, 3.9, 1.6],
          [15, 3.9, 1.6],
          [15, 5.1, 1.6],
          [7, 5.1, 1.6],
        ]}
      />
      {/* 小屋 */}
      <Box at={[2, 2, 1.6]} size={[5, 5, 3.6]} />
      <Face
        tone="side"
        p={[
          [2, 2, 5.2],
          [7, 2, 5.2],
          [7, 4.5, 7.6],
          [2, 4.5, 7.6],
        ]}
      />
      <Face
        tone="dark"
        p={[
          [2, 4.5, 7.6],
          [7, 4.5, 7.6],
          [7, 7, 5.2],
          [2, 7, 5.2],
        ]}
      />
      <Face
        tone="light"
        p={[
          [7, 2, 5.2],
          [7, 7, 5.2],
          [7, 4.5, 7.6],
        ]}
      />
      <Face
        tone="accent"
        p={[
          [7, 3.9, 1.6],
          [7, 5.1, 1.6],
          [7, 5.1, 4],
          [7, 3.9, 4],
        ]}
      />
      {/* 树 */}
      <Line a={[3.5, 11.5, 1.6]} b={[3.5, 11.5, 5]} />
      <circle
        cx={crown[0]}
        cy={crown[1]}
        r={2}
        className="e2-f e2-t-light"
        pathLength={1}
      />
      {/* 带回来的小物件 */}
      <Box at={[10, 9.5, 1.6]} size={[2.2, 1.4, 1.2]} top="light" />
    </svg>
  );
}
