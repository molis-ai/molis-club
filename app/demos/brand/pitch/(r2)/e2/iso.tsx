'use client';
import type { ReactNode } from 'react';
import { demo } from '../../../../../../content/molis-tool';
import { lineNames } from '../../../../../../content/studio';

// E 的线描工作室：等轴测投影，一间切开的房间。四件产品是房间里的四组物件，也是四个热区：
// 书桌与屏幕是 Work，立在底座上的大光标是 Tool，扶手椅、落地灯和植物是 Life，那扇透光的门是 Story。
// 全部是 SVG 线条；亮面留白，侧面排线，杏橙只给几处要紧的地方。

const C = Math.cos(Math.PI / 6);
type P3 = [number, number, number];
const iso = ([x, y, z]: P3): [number, number] => [(x - y) * C, (x + y) / 2 - z];
const pts = (list: P3[]) =>
  list
    .map(iso)
    .map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`)
    .join(' ');

function Face({
  p,
  fill = 'paper',
  className = '',
}: {
  p: P3[];
  fill?: 'paper' | 'hatch' | 'dense' | 'accent' | 'glow' | 'none';
  className?: string;
}) {
  return (
    <polygon
      points={pts(p)}
      className={`we-f we-f-${fill} ${className}`}
      pathLength={1}
    />
  );
}

/** 一个立方体：顶面、朝左前方的面、朝右前方的面 */
function Box({
  at,
  size,
  top = 'paper',
  left = 'hatch',
  right = 'paper',
}: {
  at: P3;
  size: P3;
  top?: 'paper' | 'hatch' | 'dense' | 'accent';
  left?: 'paper' | 'hatch' | 'dense' | 'accent';
  right?: 'paper' | 'hatch' | 'dense' | 'accent';
}) {
  const [x, y, z] = at;
  const [w, d, h] = size;
  return (
    <g>
      <Face
        fill={left}
        p={[
          [x, y + d, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ]}
      />
      <Face
        fill={right}
        p={[
          [x + w, y, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x + w, y, z + h],
        ]}
      />
      <Face
        fill={top}
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

function Line({ a, b, className = '' }: { a: P3; b: P3; className?: string }) {
  const [x1, y1] = iso(a);
  const [x2, y2] = iso(b);
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className={`we-l ${className}`}
      pathLength={1}
    />
  );
}

/** 悬停或聚焦时浮起的小牌子 */
function Tag({ at, children }: { at: P3; children: ReactNode }) {
  const [x, y] = iso(at);
  return (
    <g
      className="we-tag"
      transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}
      aria-hidden="true"
    >
      <rect x={-7} y={-2.6} width={14} height={3.6} rx={1.8} />
      <text x={0} y={0.25} textAnchor="middle">
        {children}
      </text>
    </g>
  );
}

const W = 44;
const D = 34;
const H = 24;

export function Room({
  hrefs,
}: {
  hrefs: Record<'work' | 'tool' | 'life' | 'story', string>;
}) {
  // 窗外的太阳与山
  const sun = iso([12, 0, 16.5]);
  // 大光标：在 y=17.5 的竖直面上，尖朝上
  const cursor: [number, number][] = [
    [0, 0],
    [0, 14],
    [3.4, 10.6],
    [5.8, 16],
    [8.2, 15],
    [5.8, 9.6],
    [10.4, 9.6],
  ];
  const arrow = (dy: number): P3[] =>
    cursor.map(([u, v]) => [8 + u * 0.62, 17.5 + dy, 5 + (16 - v) * 0.62]);
  const leaf = iso([3.2, 19.6, 4]);
  const lampGlow = iso([16, 23.5, 15.5]);
  const chipAt = iso([16.5, 17.5, 15]);
  return (
    <svg className="we-room" viewBox="-32 -28 72 70">
      <defs>
        <pattern
          id="we-hatch"
          width="1.1"
          height="1.1"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(40)"
        >
          <rect width="1.1" height="1.1" fill="#fff" />
          <line x1="0" y1="0" x2="0" y2="1.1" className="we-hatch-line" />
        </pattern>
        <pattern
          id="we-dense"
          width="0.6"
          height="0.6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-40)"
        >
          <rect width="0.6" height="0.6" fill="#fff" />
          <line x1="0" y1="0" x2="0" y2="0.6" className="we-hatch-line" />
        </pattern>
        <clipPath id="we-window">
          <polygon
            points={pts([
              [6, 0, 10],
              [18, 0, 10],
              [18, 0, 21],
              [6, 0, 21],
            ])}
          />
        </clipPath>
        <radialGradient id="we-glow">
          <stop offset="0" stopColor="#ea9260" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ea9260" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 墙与地 */}
      <g className="we-shell">
        <Face
          fill="hatch"
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
          fill="dense"
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
          p={[
            [0, 0, 0],
            [W, 0, 0],
            [W, D, 0],
            [0, D, 0],
          ]}
        />
        <Face
          fill="hatch"
          p={[
            [W, 0, 0],
            [W, D, 0],
            [W, D, -1.6],
            [W, 0, -1.6],
          ]}
        />
        <Face
          fill="dense"
          p={[
            [0, D, 0],
            [W, D, 0],
            [W, D, -1.6],
            [0, D, -1.6],
          ]}
        />
        {/* 地上的纹路 */}
        {[8, 16, 24].map((y) => (
          <Line key={y} a={[0, y, 0]} b={[W, y, 0]} className="we-faint" />
        ))}
      </g>

      {/* 窗：太阳、远山、一朵慢慢飘的云 */}
      <g className="we-window">
        <Face
          p={[
            [6, 0, 10],
            [18, 0, 10],
            [18, 0, 21],
            [6, 0, 21],
          ]}
        />
        <g clipPath="url(#we-window)">
          <circle cx={sun[0]} cy={sun[1]} r={1.6} className="we-sun" />
          <polyline
            className="we-l"
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
          <g
            transform={`translate(${iso([5, 0, 19.5])
              .map((n) => n.toFixed(2))
              .join(' ')})`}
          >
            <g className="we-cloud">
              <path
                d="M 0 0 q 0.6 -1.4 1.8 -0.8 q 0.8 -1.2 2 -0.3 q 1.2 0 1 1.1 z"
                className="we-f we-f-paper"
              />
            </g>
          </g>
        </g>
        <Line a={[12, 0, 10]} b={[12, 0, 21]} />
        <Line a={[6, 0, 15.5]} b={[18, 0, 15.5]} />
        <Box at={[5.4, 0, 9.4]} size={[13.2, 1.4, 0.6]} />
      </g>

      {/* 书架与书 */}
      <g className="we-shelf">
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
            left={index % 3 === 0 ? 'accent' : 'hatch'}
          />
        ))}
        <Box at={[36, 0.4, 16.7]} size={[2.6, 2.2, 1]} />
      </g>

      {/* Story：墙上一扇半开的门，门里透出光，光铺在地上 */}
      <a
        href={hrefs.story}
        className="we-spot we-spot-story"
        aria-label={`${lineNames.story}`}
      >
        <Face
          fill="glow"
          className="we-spill"
          p={[
            [0, 4, 0],
            [0, 11, 0],
            [13, 14, 0],
            [14, 2, 0],
          ]}
        />
        <Face
          fill="accent"
          className="we-doorway"
          p={[
            [0, 4, 0],
            [0, 11, 0],
            [0, 11, 16],
            [0, 4, 16],
          ]}
        />
        <Line a={[0, 7.5, 0]} b={[0, 7.5, 16]} className="we-ray" />
        <Face
          p={[
            [0, 11, 0],
            [5.7, 7, 0],
            [5.7, 7, 16],
            [0, 11, 16],
          ]}
        />
        <Face
          fill="hatch"
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
          r={0.35}
          className="we-knob"
        />
        <Tag at={[2, 6, 20]}>{lineNames.story}</Tag>
      </a>

      {/* Work：书桌、屏幕、键盘、杯子、椅子 */}
      <a
        href={hrefs.work}
        className="we-spot we-spot-work"
        aria-label={`${lineNames.work}`}
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
          left="paper"
          right="hatch"
        />
        {/* 屏幕上：几行字与闪烁的光标 */}
        <g className="we-screen">
          <Line a={[26, 6, 18.6]} b={[31, 6, 18.6]} className="we-text" />
          <Line
            a={[26, 6, 17.2]}
            b={[33.5, 6, 17.2]}
            className="we-text we-faint"
          />
          <Line
            a={[26, 6, 15.8]}
            b={[29.5, 6, 15.8]}
            className="we-text we-faint"
          />
          <Line a={[29.9, 6, 15.2]} b={[29.9, 6, 16.4]} className="we-caret" />
          <Face
            fill="accent"
            p={[
              [33.2, 6, 18.2],
              [34.6, 6, 18.2],
              [34.6, 6, 19.2],
              [33.2, 6, 19.2],
            ]}
          />
        </g>
        <Box at={[26, 8, 11]} size={[7, 2.4, 0.4]} top="hatch" />
        <Box at={[35, 8.2, 11]} size={[1.6, 1.6, 1.8]} />
        <path
          className="we-steam"
          d={`M ${iso([35.8, 9, 13.4]).join(' ')} q -0.8 -1.2 0 -2.2 q 0.8 -1 0 -2.2`}
          pathLength={1}
        />
        <Box at={[27.5, 14, 5]} size={[5, 5, 0.9]} />
        <Box at={[27.5, 18.4, 5.9]} size={[5, 0.8, 6]} left="hatch" />
        <Line a={[28, 14.5, 0]} b={[28, 14.5, 5]} />
        <Line a={[32, 14.5, 0]} b={[32, 14.5, 5]} />
        <Line a={[28, 18.5, 0]} b={[28, 18.5, 5]} />
        <Line a={[32, 18.5, 0]} b={[32, 18.5, 5]} />
        <Tag at={[30, 5, 24]}>{lineNames.work}</Tag>
      </a>

      {/* Tool：底座上立着的大光标，旁边浮着三个动作 */}
      <a
        href={hrefs.tool}
        className="we-spot we-spot-tool"
        aria-label={`${lineNames.tool}`}
      >
        <Box at={[7, 15.5, 0]} size={[6, 5, 4.6]} left="hatch" right="dense" />
        <Face fill="dense" p={arrow(-1.2)} />
        <Face fill="accent" className="we-arrow" p={arrow(0)} />
        <g
          className="we-chips"
          transform={`translate(${chipAt[0].toFixed(2)} ${chipAt[1].toFixed(2)})`}
        >
          {demo.actions.map((action, index) => (
            <g
              key={action}
              transform={`translate(${(index * 4.6).toFixed(2)} ${(index * 2.6).toFixed(2)})`}
            >
              <rect
                x={-2.1}
                y={-1.5}
                width={4.2}
                height={2.4}
                rx={1.2}
                className={index === 0 ? 'we-chip we-chip-on' : 'we-chip'}
              />
              <text x={0} y={0.15} textAnchor="middle" className="we-chip-text">
                {action}
              </text>
            </g>
          ))}
        </g>
        <Tag at={[10, 17.5, 22]}>{lineNames.tool}</Tag>
      </a>

      {/* Life：植物、扶手椅、小茶几上的杯子、亮着的落地灯 */}
      <a
        href={hrefs.life}
        className="we-spot we-spot-life"
        aria-label={`${lineNames.life}`}
      >
        <Box at={[1.4, 18, 0]} size={[3.6, 3.6, 4]} left="hatch" />
        <g transform={`translate(${leaf[0].toFixed(2)} ${leaf[1].toFixed(2)})`}>
          <g className="we-plant">
            <path
              className="we-l"
              d="M 0 0 q -0.4 -4 -2.6 -7.4 M 0 0 q 0.6 -3.6 2.8 -6 M 0 0 q 0 -4.6 0.4 -8.6"
              pathLength={1}
            />
            <ellipse
              cx={-2.8}
              cy={-7.8}
              rx={1.4}
              ry={2.6}
              transform="rotate(-30 -2.8 -7.8)"
              className="we-f we-f-paper"
              pathLength={1}
            />
            <ellipse
              cx={3}
              cy={-6.4}
              rx={1.3}
              ry={2.4}
              transform="rotate(38 3 -6.4)"
              className="we-f we-f-hatch"
              pathLength={1}
            />
            <ellipse
              cx={0.4}
              cy={-9.4}
              rx={1.2}
              ry={2.4}
              className="we-f we-f-paper"
              pathLength={1}
            />
          </g>
        </g>
        <circle
          cx={lampGlow[0]}
          cy={lampGlow[1]}
          r={6}
          fill="url(#we-glow)"
          className="we-lamp-glow"
        />
        <Line a={[16, 23.5, 0]} b={[16, 23.5, 14]} />
        <Face
          fill="accent"
          p={[
            [14.6, 22.1, 14],
            [17.4, 22.1, 14],
            [16.8, 22.7, 17.6],
            [15.2, 22.7, 17.6],
          ]}
        />
        <Box at={[15, 22.5, 0]} size={[2, 2, 0.4]} />
        <Box at={[4, 24, 2.6]} size={[9, 8, 3]} left="hatch" />
        <Box at={[4, 24, 5.6]} size={[1.8, 8, 7.4]} left="hatch" />
        <Box at={[4, 24, 5.6]} size={[9, 1.4, 2.8]} />
        <Box at={[4, 30.6, 5.6]} size={[9, 1.4, 2.8]} left="hatch" />
        <Box at={[18, 26, 0]} size={[4, 4, 6]} left="hatch" />
        <Box at={[19.2, 27.2, 6]} size={[1.4, 1.4, 1.4]} top="accent" />
        <path
          className="we-steam"
          d={`M ${iso([19.9, 27.9, 8]).join(' ')} q -0.7 -1 0 -2 q 0.7 -1 0 -2`}
          pathLength={1}
        />
        <Tag at={[10, 28, 20]}>{lineNames.life}</Tag>
      </a>
    </svg>
  );
}

/** 牌面上的小图：每件产品单独画一遍，复用房间里的物件 */
export function Pip({ kind }: { kind: 'work' | 'tool' | 'life' | 'story' }) {
  if (kind === 'work')
    return (
      <svg className="we-pip" viewBox="-12.6 -13 25.6 32.6" aria-hidden="true">
        <g transform="translate(-20 -6)">
          <Box at={[22, 3, 0]} size={[1, 1, 10]} />
          <Box at={[37, 10, 0]} size={[1, 1, 10]} />
          <Box at={[22, 10, 0]} size={[1, 1, 10]} />
          <Box at={[21.5, 2.5, 10]} size={[17, 9, 1]} />
          <Box at={[29, 5, 11]} size={[2, 1.6, 2]} />
          <Box
            at={[24.5, 4.8, 13]}
            size={[11, 1.2, 7.4]}
            left="paper"
            right="hatch"
          />
          <Line a={[26, 6, 18.6]} b={[31, 6, 18.6]} />
          <Line a={[26, 6, 17.2]} b={[33.5, 6, 17.2]} className="we-faint" />
          <Line a={[29.9, 6, 15.2]} b={[29.9, 6, 16.4]} className="we-caret" />
          <Box at={[35, 8.2, 11]} size={[1.6, 1.6, 1.8]} top="accent" />
        </g>
      </svg>
    );
  if (kind === 'tool') {
    const cursor: [number, number][] = [
      [0, 0],
      [0, 14],
      [3.4, 10.6],
      [5.8, 16],
      [8.2, 15],
      [5.8, 9.6],
      [10.4, 9.6],
    ];
    const arrow = (dy: number): P3[] =>
      cursor.map(([u, v]) => [8 + u * 0.62, 17.5 + dy, 5 + (16 - v) * 0.62]);
    return (
      <svg className="we-pip" viewBox="-8.2 -12 12.8 22" aria-hidden="true">
        <g transform="translate(5 -8)">
          <Box
            at={[7, 15.5, 0]}
            size={[6, 5, 4.6]}
            left="hatch"
            right="dense"
          />
          <Face fill="dense" p={arrow(-1.2)} />
          <Face fill="accent" p={arrow(0)} />
        </g>
      </svg>
    );
  }
  if (kind === 'life')
    return (
      <svg
        className="we-pip"
        viewBox="-25.4 -14.4 22.6 22.4"
        aria-hidden="true"
      >
        <g transform="translate(0 -14)">
          <Box at={[4, 24, 2.6]} size={[9, 8, 3]} left="hatch" />
          <Box at={[4, 24, 5.6]} size={[1.8, 8, 7.4]} left="hatch" />
          <Box at={[4, 24, 5.6]} size={[9, 1.4, 2.8]} />
          <Box at={[4, 30.6, 5.6]} size={[9, 1.4, 2.8]} left="hatch" />
          <Line a={[16, 23.5, 0]} b={[16, 23.5, 14]} />
          <Face
            fill="accent"
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
    <svg className="we-pip" viewBox="-13.4 -19 19.6 26.6" aria-hidden="true">
      <g transform="translate(-1 -4)">
        <Face
          fill="accent"
          p={[
            [0, 4, 0],
            [0, 11, 0],
            [0, 11, 16],
            [0, 4, 16],
          ]}
        />
        <Face
          p={[
            [0, 11, 0],
            [5.7, 7, 0],
            [5.7, 7, 16],
            [0, 11, 16],
          ]}
        />
        <Face
          fill="hatch"
          p={[
            [0, 11, 16],
            [5.7, 7, 16],
            [5.7, 6.6, 16.6],
            [0, 10.6, 16.6],
          ]}
        />
        <Face
          fill="glow"
          p={[
            [0, 4, 0],
            [0, 11, 0],
            [8, 13, 0],
            [9, 2, 0],
          ]}
        />
      </g>
    </svg>
  );
}
