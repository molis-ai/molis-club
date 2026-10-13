'use client';
import { Box, Callout, Face, Line, iso, pts, type P3 } from '../axo';
import type { Vars } from '../shell';

// World 页的轴测图：一块会慢慢布置起来的小岛（由首页的 WorldPip 长出来）。
// 首屏是布置好的样子，标出「你的世界」里的三样东西；示例旅程里同一块岛从空的开始，一步放进一样：
// 面馆 → 通向另一座城的门 → 同行的 Agent（规划中，虚线）→ 一起走进门里 → 带回的纪念物与小路 → 交给 Life 的一张便签。
// 画法沿用 axo.tsx；杏橙只给那道门。

const S = 20; // 岛的边长
export const islandViewBox = '-34 -12 66 38';

export type IslandNote = { num: string; label: string };

/** 竖直面 x = x0 上的一道拱门（门洞朝 +x） */
function archOnX(
  x0: number,
  cy: number,
  r: number,
  spring: number,
  steps = 12,
): P3[] {
  const out: P3[] = [[x0, cy + r, 0]];
  for (let k = 0; k <= steps; k++) {
    const t = (k * Math.PI) / steps;
    out.push([x0, cy + r * Math.cos(t), spring + r * Math.sin(t)]);
  }
  out.push([x0, cy - r, 0]);
  return out;
}

function Pawn({
  x,
  y,
  planned = false,
}: {
  x: number;
  y: number;
  planned?: boolean;
}) {
  const head = iso([x + 0.45, y + 0.45, 2.3]);
  return (
    <g className={planned ? 'ewd-pawn ewd-planned' : 'ewd-pawn'}>
      <Box at={[x, y, 0]} size={[0.9, 0.9, 1.7]} />
      <circle
        cx={head[0]}
        cy={head[1]}
        r={0.5}
        className="e2-f e2-t-top"
        pathLength={1}
      />
    </g>
  );
}

const door: P3 = [13.8, 5, 1.2];
const pawns = [
  { x: 16.2, y: 4.4 },
  { x: 16.9, y: 6.5, planned: true },
  { x: 17.9, y: 2.9, planned: true },
].map((pawn) => {
  const from = iso([pawn.x + 0.45, pawn.y + 0.45, 1]);
  const to = iso(door);
  return { ...pawn, tx: to[0] - from[0], ty: to[1] - from[1] };
});

/** 每一步的标注：编号、文字、引线起点与标注位置 */
const anchors: { from: P3; to: [number, number]; align: 'left' | 'right' }[] = [
  { from: [9, 10, 5.6], to: [-14, -6], align: 'right' }, // 面馆
  { from: [13.4, 5, 8], to: [12, -6], align: 'left' }, // 门
  { from: [16.65, 4.85, 2.6], to: [15.5, 15], align: 'left' }, // 同行
  { from: [13.8, 5, 3], to: [12, -6], align: 'left' }, // 走进门里
  { from: [11.5, 17.3, 2.9], to: [-12, 19], align: 'right' }, // 纪念物
  { from: [5.5, 13.65, 10.8], to: [-14, -6], align: 'right' }, // 便签
];

/**
 * 小岛。mode="map"：布置好的样子，三条标注对应 notes（面馆、门、纪念物）。
 * mode="journey"：step 从 -1（空岛）到 5，每一步放进一样东西，只显示当前一步的标注。
 */
export function Island({
  mode,
  step = 5,
  notes,
  label,
}: {
  mode: 'map' | 'journey';
  step?: number;
  notes: IslandNote[];
  label?: string;
}) {
  const map = mode === 'map';
  const on = (at: number) => (step >= at ? ' is-on' : '');
  const crown = iso([3.2, 18.6, 4.8]);
  const crown2 = iso([18, 15.5, 3.6]);
  const ring = iso([11.5, 16.72, 3.15]);
  const noteAt = map ? [0, 1, 4] : [0, 1, 2, 3, 4, 5];
  return (
    <svg
      className={`ewd-island ewd-island-${mode}`}
      viewBox={islandViewBox}
      data-draw={map ? 'now' : undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* 底座：顶面浅，四周的切面涂实；顶面上淡淡的模数线 */}
      <g className="ewd-g-base">
        <Box
          at={[0, 0, -1.6]}
          size={[S, S, 1.6]}
          left="cut"
          right="cut"
          top="floor"
        />
        {[5, 10, 15].map((v) => (
          <g key={v}>
            <Line a={[v, 0.4, 0]} b={[v, S - 0.4, 0]} className="e2-faint" />
            <Line a={[0.4, v, 0]} b={[S - 0.4, v, 0]} className="e2-faint" />
          </g>
        ))}
      </g>

      {/* 05 回来的小路 */}
      <g className={`ewd-el ewd-g-path${on(4)}`}>
        <Face
          tone="light"
          p={[
            [14.6, 7.6, 0],
            [16.2, 7.6, 0],
            [16.2, 14.6, 0],
            [14.6, 14.6, 0],
          ]}
        />
        <Face
          tone="light"
          p={[
            [9, 13, 0],
            [14.6, 13, 0],
            [14.6, 14.6, 0],
            [9, 14.6, 0],
          ]}
        />
      </g>

      {/* 02 门里漏出来的光；04 走进去以后光更亮一些 */}
      <g className={`ewd-el${on(1)}`}>
        <Face
          tone="glow"
          p={[
            [13.8, 3.4, 0],
            [13.8, 6.6, 0],
            [19.6, 8.4, 0],
            [19.6, 1.6, 0],
          ]}
        />
      </g>
      {map ? null : (
        <g className={`ewd-el${on(3)}`}>
          <Face
            tone="glow"
            p={[
              [13.8, 3.2, 0],
              [13.8, 6.8, 0],
              [20, 10, 0],
              [20, 0, 0],
            ]}
          />
        </g>
      )}

      {/* 02 通向另一座城的门：门洞是杏橙，里面一道白色的天际线 */}
      <g className={`ewd-el ewd-g-door${on(1)}`}>
        <Box at={[13, 2, 0]} size={[0.8, 6, 8]} />
        <Face tone="accent" p={archOnX(13.8, 5, 1.4, 4)} />
        <polyline
          className="ewd-city"
          points={pts(
            (
              [
                [6.2, 1.4],
                [5.8, 1.4],
                [5.8, 2.7],
                [5.3, 2.7],
                [5.3, 1.9],
                [4.8, 1.9],
                [4.8, 3.4],
                [4.3, 3.4],
                [4.3, 2.1],
                [3.8, 2.1],
              ] as [number, number][]
            ).map(([y, z]) => [13.8, y, z] as P3),
          )}
        />
      </g>

      {/* 01 面馆：门、窗、条纹雨棚和屋顶的招牌 */}
      <g className={`ewd-el ewd-g-shop${on(0)}`}>
        <Box at={[2, 10, 0]} size={[7, 7, 5]} />
        <Box at={[1.6, 9.6, 5]} size={[7.8, 7.8, 0.6]} />
        <Box at={[8.6, 11.2, 5.6]} size={[0.4, 4.6, 1.5]} />
        <Line a={[9, 11.9, 6.35]} b={[9, 15.1, 6.35]} className="e2-text" />
        <Face
          tone="dark"
          p={[
            [9, 13, 0],
            [9, 14.6, 0],
            [9, 14.6, 2.8],
            [9, 13, 2.8],
          ]}
        />
        {[
          [10.8, 12.2],
          [15.2, 16.4],
        ].map(([a, b]) => (
          <Face
            key={a}
            p={[
              [9, a, 1.2],
              [9, b, 1.2],
              [9, b, 2.8],
              [9, a, 2.8],
            ]}
          />
        ))}
        <Face
          p={[
            [3.5, 17, 1.6],
            [7.5, 17, 1.6],
            [7.5, 17, 3.6],
            [3.5, 17, 3.6],
          ]}
        />
        <Face
          p={[
            [9, 10.6, 4.2],
            [9, 16.6, 4.2],
            [10.6, 16.6, 3.4],
            [10.6, 10.6, 3.4],
          ]}
        />
        {[11.8, 13, 14.2, 15.4].map((y) => (
          <Line key={y} a={[9, y, 4.2]} b={[10.6, y, 3.4]} />
        ))}
        <Line a={[3.2, 18.6, 0]} b={[3.2, 18.6, 3.2]} />
        <circle
          cx={crown[0]}
          cy={crown[1]}
          r={1.7}
          className="e2-f e2-t-light"
          pathLength={1}
        />
      </g>

      {/* 03 同行（规划中，虚线）；04 一起走进门里 */}
      {map ? null : (
        <g
          className={`ewd-el ewd-g-party${on(2)}${step >= 3 ? ' is-gone' : ''}`}
        >
          {pawns.map((pawn) => (
            <g
              key={`${pawn.x}`}
              className="ewd-walk"
              style={
                {
                  '--tx': pawn.tx.toFixed(2),
                  '--ty': pawn.ty.toFixed(2),
                } as Vars
              }
            >
              <Pawn x={pawn.x} y={pawn.y} planned={pawn.planned} />
            </g>
          ))}
        </g>
      )}

      {/* 05 带回来的纪念物，放在面馆旁边；再种一棵小树 */}
      <g className={`ewd-el ewd-g-keep${on(4)}`}>
        <Box at={[10.6, 16.2, 0]} size={[1.8, 1.8, 1.6]} />
        <Box at={[11, 16.6, 1.6]} size={[1, 0.25, 1.3]} left="top" />
        <circle
          cx={ring[0]}
          cy={ring[1]}
          r={0.22}
          className="e2-l"
          pathLength={1}
        />
        <Line a={[18, 15.5, 0]} b={[18, 15.5, 2.4]} />
        <circle
          cx={crown2[0]}
          cy={crown2[1]}
          r={1.3}
          className="e2-f e2-t-light"
          pathLength={1}
        />
      </g>

      {/* 06 冒出来的真实想法：屋顶上方一张便签，交给 Life */}
      {map ? null : (
        <g className={`ewd-el ewd-g-life${on(5)}`}>
          <Line
            a={[5.5, 13.65, 5.6]}
            b={[5.5, 13.65, 8.6]}
            className="ewd-dash"
          />
          <Box at={[4.2, 13.5, 8.6]} size={[2.6, 0.3, 2.2]} left="top" />
          <Line
            a={[4.5, 13.8, 10.2]}
            b={[6.5, 13.8, 10.2]}
            className="e2-text"
          />
          <Line a={[4.5, 13.8, 9.4]} b={[6, 13.8, 9.4]} className="e2-faint" />
        </g>
      )}

      {notes.map((note, index) => {
        const anchor = anchors[noteAt[index]];
        if (!anchor) return null;
        const visible = map || step === index;
        return (
          <g
            key={note.num + note.label}
            className={`ewd-note${visible ? ' is-on' : ''}`}
          >
            <Callout num={note.num} label={note.label} {...anchor} />
          </g>
        );
      })}
    </svg>
  );
}
