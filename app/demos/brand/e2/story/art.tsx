'use client';
import type { CSSProperties } from 'react';
import type { World } from '../../../../../content/molis-story';
import { Box, Callout, Face, Line, iso, pts, type P3 } from '../axo';
import { pad } from '../routes';

// Story 页的轴测图：「此处」是一间安静的厅，后墙上四道拱门，门里是四个世界；左墙的小架子上放着带回来的东西。
// 门里的画面用原生 img 叠在两层 svg 之间（下层墙地、上层门洞的侧壁与标注），按门洞的形状裁切，
// 这样门洞有厚度，画面像是在墙后面。画法沿用 axo.tsx；杏橙只给架子上那枚钥匙牌。

const W = 50;
const D = 12;
const H = 22;
const T = 1.2; // 墙厚
const R = 4; // 拱的半径
const SPRING = 10; // 起拱高度
const VB = { x: -12.5, y: -25, w: 61.5, h: 58.5 };
const viewBox = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;

/** 第 i 道拱门左边的 x */
const archX = (index: number) => 3 + index * 12;

/** 竖直面 y = y0 上的一道拱门：从左下角起，沿半圆到右下角 */
function arch(a: number, y0: number, r = R, spring = SPRING, steps = 16): P3[] {
  const out: P3[] = [[a, y0, 0]];
  for (let k = 0; k <= steps; k++) {
    const t = Math.PI - (k * Math.PI) / steps;
    out.push([a + r + r * Math.cos(t), y0, spring + r * Math.sin(t)]);
  }
  out.push([a + 2 * r, y0, 0]);
  return out;
}

/** 拱顶左半边的弧（从起拱点到拱顶），用来画门洞内侧可见的那一段拱腹 */
function soffit(a: number) {
  const near: P3[] = [];
  const far: P3[] = [];
  for (let k = 0; k <= 8; k++) {
    const t = Math.PI - (k * Math.PI) / 16;
    near.push([a + R + R * Math.cos(t), 0, SPRING + R * Math.sin(t)]);
    far.push([a + R + R * Math.cos(t), -T, SPRING + R * Math.sin(t)]);
  }
  return [...near, ...far.reverse()];
}

const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

/** 门里的画面：按门洞投影后的外接框定位，再用 clip-path 裁成门洞的样子 */
function portalStyle(a: number): CSSProperties {
  const poly = arch(a, 0).map(iso);
  const xs = poly.map(([x]) => x);
  const ys = poly.map(([, y]) => y);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  return {
    left: pct((x0 - VB.x) / VB.w),
    top: pct((y0 - VB.y) / VB.h),
    width: pct((x1 - x0) / VB.w),
    height: pct((y1 - y0) / VB.h),
    clipPath: `polygon(${poly
      .map(
        ([x, y]) => `${pct((x - x0) / (x1 - x0))} ${pct((y - y0) / (y1 - y0))}`,
      )
      .join(', ')})`,
  };
}

/** 首屏：此处。四道拱门各通向一个世界，点门跳到下面那个世界 */
export function Hall({ worlds }: { worlds: World[] }) {
  const tag = iso([0.05, 8.7, 11.2]);
  return (
    <div className="es-hall">
      <svg
        className="es-hall-back"
        viewBox={viewBox}
        data-draw="now"
        aria-hidden="true"
      >
        <g className="es-g-shell">
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
              [W, -T, H],
              [-T, -T, H],
              [-T, D, H],
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
          <Line a={[0, 0, 18.4]} b={[W, 0, 18.4]} className="e2-faint" />
          {[4, 8].map((y) => (
            <Line key={y} a={[0, y, 0]} b={[W, y, 0]} className="e2-faint" />
          ))}
        </g>
        {/* 每道门洞：门里先是深色（画面没加载时也看得出是门），门前的地上铺一片光 */}
        <g className="es-g-arches">
          {worlds.map((world, index) => {
            const a = archX(index);
            return (
              <g key={world.id}>
                <Face
                  tone="glow"
                  className="es-spill"
                  p={[
                    [a + 0.4, 0, 0],
                    [a + 2 * R - 0.4, 0, 0],
                    [a + 2 * R + 2.6, D - 1, 0],
                    [a - 1.4, D - 1, 0],
                  ]}
                />
                <Face tone="cut" p={arch(a, 0)} />
              </g>
            );
          })}
        </g>
        {/* 左墙的小架子：带回来的东西 */}
        <g className="es-g-shelf">
          <Box at={[0, 2.4, 9]} size={[2.2, 7.4, 0.4]} />
          <Box at={[0.4, 2.9, 9.4]} size={[1.3, 1.3, 1.1]} />
          <Line a={[1.05, 3.55, 10.5]} b={[1.05, 3.55, 12.2]} />
          <Box at={[0.5, 4.9, 9.4]} size={[1.2, 0.5, 1.9]} left="dark" />
          <Box at={[0.6, 5.5, 9.4]} size={[1.1, 0.45, 1.6]} />
          <Box at={[0.3, 6.6, 9.4]} size={[1.6, 1.6, 0.5]} top="light" />
          <Face
            tone="accent"
            p={[
              [0.05, 8.2, 10.4],
              [0.05, 9.2, 10.4],
              [0.05, 9.2, 11.6],
              [0.05, 8.2, 11.6],
            ]}
          />
          <circle
            cx={tag[0]}
            cy={tag[1] - 0.95}
            r={0.3}
            className="e2-l"
            pathLength={1}
          />
        </g>
      </svg>

      {worlds.map((world, index) => (
        <span
          key={world.id}
          className="es-portal"
          data-world={world.id}
          style={portalStyle(archX(index))}
        >
          <img
            src={world.image.src}
            width={world.image.w}
            height={world.image.h}
            alt=""
            fetchPriority={index < 2 ? 'high' : undefined}
            style={{ objectPosition: world.image.position }}
          />
        </span>
      ))}

      <svg
        className="es-hall-top"
        viewBox={viewBox}
        aria-label="此处的轴测图：后墙上四道拱门，各通向一个世界"
      >
        {worlds.map((world, index) => {
          const a = archX(index);
          const crest = iso([a + R, 0, SPRING + R]);
          return (
            <g key={world.id}>
              <g className="es-jamb" aria-hidden="true">
                <Face
                  tone="side"
                  p={[
                    [a, 0, 0],
                    [a, -T, 0],
                    [a, -T, SPRING],
                    [a, 0, SPRING],
                  ]}
                />
                <Face tone="dark" p={soffit(a)} />
                <polygon className="es-arch-line" points={pts(arch(a, 0))} />
              </g>
              <a
                href={`#${world.id}`}
                className="e2-spot es-spot"
                data-world={world.id}
                aria-label={world.name}
              >
                <polygon className="es-hit" points={pts(arch(a, 0))} />
                <Callout
                  num={pad(index)}
                  label={world.name}
                  from={[a + R, 0, SPRING + R]}
                  to={[crest[0], (a + R) / 2 - 26.5]}
                  align="left"
                />
              </a>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** 「此处」的小样：四道拱窗并排，旅程第一步与静态版用 */
export function Here({ worlds }: { worlds: World[] }) {
  return (
    <span className="es-here" aria-hidden="true">
      {worlds.map((world) => (
        <i key={world.id}>
          <img
            src={world.image.src}
            width={world.image.w}
            height={world.image.h}
            alt=""
            loading="lazy"
            style={{ objectPosition: world.image.position }}
          />
        </i>
      ))}
    </span>
  );
}

function Pawn({
  x,
  y,
  agent = false,
}: {
  x: number;
  y: number;
  agent?: boolean;
}) {
  const head = iso([x + 0.5, y + 0.5, 2.5]);
  return (
    <g className={agent ? 'es-pawn es-pawn-agent' : 'es-pawn'}>
      <Box at={[x, y, 0]} size={[1, 1, 1.8]} />
      <circle
        cx={head[0]}
        cy={head[1]}
        r={0.55}
        className={`e2-f ${agent ? 'e2-t-accent' : 'e2-t-top'}`}
        pathLength={1}
      />
    </g>
  );
}

const parties: { x: number; y: number; agent?: boolean }[][] = [
  [{ x: 5.4, y: 5 }],
  [
    { x: 4.4, y: 5.2 },
    { x: 7, y: 4.6, agent: true },
  ],
  [
    { x: 6.8, y: 3.4, agent: true },
    { x: 4, y: 5.4 },
    { x: 8.4, y: 5.6, agent: true },
    { x: 6, y: 7, agent: true },
  ],
];

/** 和谁一起去：一道拱门前，一个人、你和你的 Agent、或一支队伍。Agent 用虚线画（规划中），头是杏橙 */
export function Party({ kind }: { kind: 0 | 1 | 2 }) {
  return (
    <svg className="es-party" viewBox="-9 -10 21 22.5" aria-hidden="true">
      <Box
        at={[0, 1, -0.8]}
        size={[12, 9, 0.8]}
        left="cut"
        right="cut"
        top="floor"
      />
      <Box at={[0, 0, 0]} size={[12, 1, 8.4]} />
      <Face
        tone="glow"
        p={[
          [4.2, 1, 0],
          [7.8, 1, 0],
          [9.6, 9, 0],
          [3, 9, 0],
        ]}
      />
      <Face tone="cut" p={arch(4, 1, 2, 3.6)} />
      {parties[kind].map((pawn) => (
        <Pawn key={`${pawn.x}-${pawn.y}`} {...pawn} />
      ))}
    </svg>
  );
}

/** 进门之前：一道拱门的立面，门里是光；放在深色的「边界」一段 */
export function Threshold() {
  const a = 2;
  return (
    <svg className="es-threshold" viewBox="-8 -14 19.5 25.5" aria-hidden="true">
      <Box
        at={[0, 1, -0.6]}
        size={[12, 7, 0.6]}
        left="cut"
        right="cut"
        top="floor"
      />
      <Box at={[0, 0, 0]} size={[12, 1, 13]} />
      <Face tone="accent" p={arch(a + 1, 1, 3, 6.4)} />
      <Face
        tone="glow"
        className="es-threshold-spill"
        p={[
          [a + 1.2, 1, 0],
          [a + 6.8, 1, 0],
          [a + 9.5, 7, 0],
          [a - 0.8, 7, 0],
        ]}
      />
      <Line a={[a + 4, 1, 0]} b={[a + 4, 1, 9.4]} className="e2-ray" />
    </svg>
  );
}
