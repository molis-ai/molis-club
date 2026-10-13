'use client';
import { Box, Callout, Face, Line, iso, pts, type P3 } from '../axo';

// Life 页的轴测图：一个傍晚的居家一角，和「它陪你做的三件事」各自的一件小物。
// 画法沿用 axo.tsx（细线、三档灰面、剖切面涂实）；杏橙只给落地灯的灯罩，窗外的太阳用淡杏色。

const W = 40;
const D = 30;
const H = 22;

/** 一盆植物：花盆加三片叶子，叶子与首页房间里的同一种画法 */
function Plant({ at, size = 3.2 }: { at: P3; size?: number }) {
  const [x, y, z] = at;
  const stem = iso([x + size / 2, y + size / 2, z + size]);
  return (
    <g>
      <Box at={at} size={[size, size, size]} />
      <g transform={`translate(${stem[0].toFixed(2)} ${stem[1].toFixed(2)})`}>
        <path
          className="e2-l"
          d="M 0 0 q -0.4 -3.6 -2.4 -6.6 M 0 0 q 0.6 -3.2 2.6 -5.4 M 0 0 q 0 -4.2 0.4 -7.8"
          pathLength={1}
        />
        <ellipse
          cx={-2.5}
          cy={-7}
          rx={1.3}
          ry={2.4}
          transform="rotate(-30 -2.5 -7)"
          className="e2-f e2-t-top"
          pathLength={1}
        />
        <ellipse
          cx={2.8}
          cy={-5.8}
          rx={1.2}
          ry={2.2}
          transform="rotate(38 2.8 -5.8)"
          className="e2-f e2-t-side"
          pathLength={1}
        />
        <ellipse
          cx={0.4}
          cy={-8.6}
          rx={1.1}
          ry={2.2}
          className="e2-f e2-t-light"
          pathLength={1}
        />
      </g>
    </g>
  );
}

/** 一本摊开的书：两页微微拱起 */
function OpenBook({
  x,
  y,
  z,
  w = 2.8,
  d = 2.4,
}: {
  x: number;
  y: number;
  z: number;
  w?: number;
  d?: number;
}) {
  const mid = y + d / 2;
  return (
    <g>
      <Face
        p={[
          [x, y, z],
          [x + w, y, z],
          [x + w, mid, z + 0.28],
          [x, mid, z + 0.28],
        ]}
      />
      <Face
        tone="light"
        p={[
          [x, mid, z + 0.28],
          [x + w, mid, z + 0.28],
          [x + w, y + d, z],
          [x, y + d, z],
        ]}
      />
      <Line
        a={[x + 0.5, y + 0.45, z + 0.06]}
        b={[x + w - 0.5, y + 0.45, z + 0.06]}
        className="e2-faint"
      />
      <Line
        a={[x + 0.5, y + 0.8, z + 0.14]}
        b={[x + w - 0.9, y + 0.8, z + 0.14]}
        className="e2-faint"
      />
    </g>
  );
}

/** 一只纸箱：封箱带横过顶面，再沿右前面垂下来 */
function Parcel({ at, size }: { at: P3; size: P3 }) {
  const [x, y, z] = at;
  const [w, d, h] = size;
  const band = y + d / 2;
  return (
    <g>
      <Box at={at} size={size} />
      <Line a={[x, band, z + h]} b={[x + w, band, z + h]} />
      <Line a={[x + w, band, z + h]} b={[x + w, band, z + h * 0.45]} />
    </g>
  );
}

/**
 * 首屏：傍晚的居家一角。左墙的门边放着待寄回的纸箱，后墙的窗外是海和低低的太阳，
 * 扶手椅旁的小几上摊着一本书，落地灯亮着。三处物件各对应「它陪你做的三件事」中的一件，
 * 点一下会切到下面对应的那件事。
 */
export function HomeCorner({
  labels,
  href,
  onPick,
}: {
  labels: string[];
  href: string;
  onPick: (index: number) => void;
}) {
  const sun = iso([26.5, 0, 12.6]);
  const lamp = iso([15.5, 3.5, 15.5]);
  const knob = iso([0, 20.2, 7.2]);
  return (
    <svg
      className="el-corner"
      viewBox="-29 -24.5 66 62"
      data-draw="now"
      aria-label="居家一角的轴测图：三处物件各对应它陪你做的一件事"
    >
      <defs>
        <clipPath id="el-corner-window">
          <polygon
            points={pts([
              [20, 0, 8],
              [32, 0, 8],
              [32, 0, 18.5],
              [20, 0, 18.5],
            ])}
          />
        </clipPath>
        <radialGradient id="el-corner-glow">
          <stop offset="0" stopColor="#e2875a" stopOpacity="0.3" />
          <stop offset="1" stopColor="#e2875a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 墙与地：墙顶与楼板的切面涂实，地上是木地板的缝 */}
      <g className="el-g-shell">
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
            [W, -1.2, H],
            [-1.2, -1.2, H],
            [-1.2, D, H],
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
        {[6, 12, 18, 24].map((y) => (
          <Line key={y} a={[0, y, 0]} b={[W, y, 0]} className="e2-faint" />
        ))}
      </g>

      {/* 灯下的一小片暖光 */}
      <Face
        tone="glow"
        className="el-pool"
        p={[
          [8, 0.6, 0],
          [22, 1, 0],
          [24, 11, 0],
          [9, 13, 0],
        ]}
      />

      {/* 后墙：一幅小画和一扇窗，窗外是海和低低的太阳 */}
      <g className="el-g-wall">
        <Face
          tone="light"
          p={[
            [7.5, 0, 11],
            [12.5, 0, 11],
            [12.5, 0, 14.6],
            [7.5, 0, 14.6],
          ]}
        />
        <Face
          p={[
            [8.3, 0, 11.7],
            [11.7, 0, 11.7],
            [11.7, 0, 13.9],
            [8.3, 0, 13.9],
          ]}
        />
        <polyline
          className="e2-l"
          pathLength={1}
          points={pts([
            [8.3, 0, 12.2],
            [9.4, 0, 12.9],
            [10.2, 0, 12.5],
            [11.7, 0, 13.3],
          ])}
        />
      </g>
      <g className="el-g-window">
        <Face
          p={[
            [20, 0, 8],
            [32, 0, 8],
            [32, 0, 18.5],
            [20, 0, 18.5],
          ]}
        />
        <g clipPath="url(#el-corner-window)">
          <circle cx={sun[0]} cy={sun[1]} r={1.7} className="e2-sun" />
          <Face
            tone="light"
            p={[
              [20, 0, 8],
              [32, 0, 8],
              [32, 0, 11.6],
              [20, 0, 11.6],
            ]}
          />
          <polyline
            className="e2-l"
            pathLength={1}
            points={pts([
              [20, 0, 12.4],
              [21.4, 0, 13.4],
              [22.6, 0, 13],
              [24, 0, 13.9],
              [25.2, 0, 12.6],
              [25.8, 0, 11.6],
            ])}
          />
          {[10.6, 9.6, 8.8].map((z, index) => (
            <Line
              key={z}
              a={[22 + index * 1.4, 0, z]}
              b={[30 - index * 0.8, 0, z]}
              className="e2-faint"
            />
          ))}
        </g>
        <Line a={[26, 0, 8]} b={[26, 0, 18.5]} />
        <Box at={[19.4, 0, 7.4]} size={[13.2, 1.4, 0.6]} />
      </g>

      {/* 左墙上的门 */}
      <g className="el-g-door">
        <Face
          tone="light"
          p={[
            [0, 19, 0],
            [0, 26, 0],
            [0, 26, 14.5],
            [0, 19, 14.5],
          ]}
        />
        <Face
          tone="light"
          p={[
            [0, 19.9, 8.4],
            [0, 25.1, 8.4],
            [0, 25.1, 13.4],
            [0, 19.9, 13.4],
          ]}
        />
        <Face
          tone="light"
          p={[
            [0, 19.9, 1.2],
            [0, 25.1, 1.2],
            [0, 25.1, 7.4],
            [0, 19.9, 7.4],
          ]}
        />
        <circle cx={knob[0]} cy={knob[1]} r={0.32} className="e2-knob" />
      </g>

      {/* 落地灯：立在椅子与窗之间，灯罩是这张图里唯一的杏橙 */}
      <g className="el-g-lamp">
        <circle
          cx={lamp[0]}
          cy={lamp[1]}
          r={7.5}
          fill="url(#el-corner-glow)"
          className="el-lamp-glow"
        />
        <Box at={[14.5, 2.5, 0]} size={[2, 2, 0.4]} />
        <Line a={[15.5, 3.5, 0.4]} b={[15.5, 3.5, 15]} />
        <Face
          tone="accent"
          p={[
            [14.1, 2.1, 15],
            [16.9, 2.1, 15],
            [16.3, 2.7, 18.6],
            [14.7, 2.7, 18.6],
          ]}
        />
      </g>

      {/* 地毯与扶手椅 */}
      <g className="el-g-chair">
        <Face
          tone="light"
          p={[
            [4, 6, 0],
            [22, 6, 0],
            [22, 20, 0],
            [4, 20, 0],
          ]}
        />
        <polygon
          className="e2-l e2-faint"
          pathLength={1}
          points={pts([
            [4.9, 6.9, 0],
            [21.1, 6.9, 0],
            [21.1, 19.1, 0],
            [4.9, 19.1, 0],
          ])}
        />
        <Line a={[13.4, 8.6, 0]} b={[13.4, 8.6, 2.4]} />
        <Line a={[13.4, 15.4, 0]} b={[13.4, 15.4, 2.4]} />
        <Line a={[5.6, 15.4, 0]} b={[5.6, 15.4, 2.4]} />
        <Box at={[5, 8, 2.4]} size={[9, 8, 3]} />
        <Box at={[5, 8, 5.4]} size={[1.8, 8, 7.2]} />
        <Box at={[5, 8, 5.4]} size={[9, 1.4, 2.6]} />
        <Box at={[5, 14.6, 5.4]} size={[9, 1.4, 2.6]} />
      </g>

      {/* 03 接住好奇心：小几上摊开的书，和一杯茶 */}
      <a
        href={href}
        className="e2-spot el-spot el-spot-curious"
        aria-label={labels[2]}
        onClick={() => onPick(2)}
      >
        <Box at={[16.5, 9.5, 0]} size={[4, 4.4, 5.6]} />
        <Box at={[16.9, 9.9, 5.6]} size={[1.1, 1.1, 1.3]} />
        <OpenBook x={17.2} y={11.2} z={5.6} />
        <Callout
          num="03"
          label={labels[2]}
          from={[18.6, 12.4, 5.9]}
          to={[20, 33]}
          align="left"
        />
      </a>

      {/* 01 把琐事托付出去：门边等着寄回的纸箱 */}
      <a
        href={href}
        className="e2-spot el-spot el-spot-return"
        aria-label={labels[0]}
        onClick={() => onPick(0)}
      >
        <Parcel at={[1, 19.6, 0]} size={[4.4, 3.8, 3]} />
        <Parcel at={[1.6, 20.4, 3]} size={[2.8, 2.6, 1.6]} />
        <Callout
          num="01"
          label={labels[0]}
          from={[3, 21.7, 4.6]}
          to={[-24, 27]}
          align="left"
        />
      </a>

      {/* 02 让想做的事发生：窗外的海 */}
      <a
        href={href}
        className="e2-spot el-spot el-spot-sea"
        aria-label={labels[1]}
        onClick={() => onPick(1)}
      >
        <polygon
          className="el-hit"
          points={pts([
            [20, 0, 8],
            [32, 0, 8],
            [32, 0, 18.5],
            [20, 0, 18.5],
          ])}
        />
        <Callout
          num="02"
          label={labels[1]}
          from={[26.5, 0, 15]}
          to={[25, -14]}
          align="left"
        />
      </a>

      {/* 窗边的植物 */}
      <g className="el-g-plant">
        <Plant at={[33.6, 2.4, 0]} />
      </g>
    </svg>
  );
}

/** 「三件事」里每件事配的一件小物：纸箱、窗外的海、小几上的书和植物 */
export function LifeObject({ kind }: { kind: 'return' | 'sea' | 'curious' }) {
  if (kind === 'return')
    return (
      <svg className="el-object" viewBox="-11 -9 23 18" aria-hidden="true">
        <Box
          at={[0, 0, -1]}
          size={[13, 10, 1]}
          left="cut"
          right="cut"
          top="floor"
        />
        <Parcel at={[2.4, 2.6, 0]} size={[6, 5, 3.8]} />
        <Face
          tone="top"
          p={[
            [8.4, 3.2, 0.8],
            [8.4, 4.6, 0.8],
            [8.4, 4.6, 1.9],
            [8.4, 3.2, 1.9],
          ]}
        />
        <Parcel at={[3.2, 3.3, 3.8]} size={[3.6, 3.2, 2.2]} />
        <Face
          tone="accent"
          p={[
            [6.8, 3.7, 4.3],
            [6.8, 4.7, 4.3],
            [6.8, 4.7, 5.2],
            [6.8, 3.7, 5.2],
          ]}
        />
      </svg>
    );
  if (kind === 'sea') {
    const sun = iso([8.6, 1.2, 7.3]);
    return (
      <svg className="el-object" viewBox="-6 -12 23 20" aria-hidden="true">
        <defs>
          <clipPath id="el-object-sea">
            <polygon
              points={pts([
                [3, 1.2, 3.6],
                [11, 1.2, 3.6],
                [11, 1.2, 10],
                [3, 1.2, 10],
              ])}
            />
          </clipPath>
        </defs>
        <Box
          at={[0, 1.2, -1]}
          size={[14, 6, 1]}
          left="cut"
          right="cut"
          top="floor"
        />
        <Box at={[0, 0, 0]} size={[14, 1.2, 12]} />
        <Face
          p={[
            [3, 1.2, 3.6],
            [11, 1.2, 3.6],
            [11, 1.2, 10],
            [3, 1.2, 10],
          ]}
        />
        <g clipPath="url(#el-object-sea)">
          <circle cx={sun[0]} cy={sun[1]} r={1.3} className="e2-sun" />
          <Face
            tone="light"
            p={[
              [3, 1.2, 3.6],
              [11, 1.2, 3.6],
              [11, 1.2, 6.6],
              [3, 1.2, 6.6],
            ]}
          />
          {[5.6, 4.6].map((z, index) => (
            <Line
              key={z}
              a={[4.4 + index, 1.2, z]}
              b={[10 - index, 1.2, z]}
              className="e2-faint"
            />
          ))}
        </g>
        <Line a={[7, 1.2, 3.6]} b={[7, 1.2, 10]} />
        <Box at={[2.6, 1.2, 3.1]} size={[8.8, 1, 0.5]} />
      </svg>
    );
  }
  return (
    <svg className="el-object" viewBox="-10 -12 21 21" aria-hidden="true">
      <Box
        at={[0, 0, -1]}
        size={[12, 11, 1]}
        left="cut"
        right="cut"
        top="floor"
      />
      <Plant at={[1, 1, 0]} size={2.6} />
      <Box at={[5, 3, 0]} size={[5, 5, 4.6]} />
      <Box at={[5.5, 3.5, 4.6]} size={[1.1, 1.1, 1.3]} />
      <OpenBook x={6.4} y={4.8} z={4.6} w={3} d={2.6} />
      <Face
        tone="accent"
        p={[
          [8.2, 6.1, 4.88],
          [8.6, 6.1, 4.88],
          [8.6, 8, 4.6],
          [8.6, 8, 3.4],
          [8.2, 8, 3.4],
          [8.2, 8, 4.6],
        ]}
      />
    </svg>
  );
}
