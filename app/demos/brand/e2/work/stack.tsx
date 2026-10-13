'use client';
import type { ReactNode } from 'react';
import { platform } from '../../../../../content/folio-work';
import { Box, C, Callout, iso, pts, type P3 } from '../axo';
import type { Vars } from '../shell';

// Molis Work 的组成，画成一张分层的轴测爆炸图：最下面是本机的 Home（剖切面涂实），
// 往上是平台的四层、两盘插件（项目插件、个人插件；v0.2.0 里已有的四个顶面是杏橙）、
// 能力目录，最上面是四个调用方。滚动进入时各层从靠拢慢慢拉开（--e），减少动态时直接拉开。
// 用 axo.tsx 的 Box、Callout；面上的字用投影矩阵贴在面上。

const S = 24;
const Z = { layers: 7.4, trays: 13.4, catalog: 20.6, callers: 25.6 };
const CUBE = 3;
const PITCH = 4;

/** 顶面上的字：贴在高度 z 的水平面上，沿 x 方向写 */
function TopText({
  z,
  x,
  y,
  size,
  anchor = 'start',
  children,
}: {
  z: number;
  x: number;
  y: number;
  size: number;
  anchor?: 'start' | 'middle';
  children: ReactNode;
}) {
  return (
    <g transform={`matrix(${C} 0.5 ${-C} 0.5 0 ${-z})`}>
      <text
        x={x}
        y={y}
        fontSize={size}
        textAnchor={anchor}
        className="ew-axo-text"
      >
        {children}
      </text>
    </g>
  );
}

/** 左前方竖直面（y 为常数）上的字，沿 x 方向写；h 是基线离地的高度 */
function FrontText({
  y,
  x,
  h,
  size,
  anchor = 'start',
  light = false,
  children,
}: {
  y: number;
  x: number;
  h: number;
  size: number;
  anchor?: 'start' | 'middle';
  light?: boolean;
  children: ReactNode;
}) {
  const [ox, oy] = iso([0, y, 0]);
  return (
    <g transform={`matrix(${C} 0.5 0 1 ${ox.toFixed(3)} ${oy})`}>
      <text
        x={x}
        y={-h}
        fontSize={size}
        textAnchor={anchor}
        className={light ? 'ew-axo-text ew-axo-text-light' : 'ew-axo-text'}
      >
        {children}
      </text>
    </g>
  );
}

const level = (k: number, o: number): Vars => ({
  '--k': k,
  '--o': `${o}s`,
  '--f': `${o + 0.95}s`,
});

export function PlatformStack() {
  const released = new Set(platform.released);
  const slot: P3 = [2.5 + 4 * PITCH, 11.4 + 2 * PITCH, Z.trays + 0.62];
  const [sx, sy, sz] = slot;
  const mid: P3 = [sx + CUBE / 2, sy + CUBE / 2, sz];
  return (
    <svg
      className="ew-stack"
      viewBox="-22 -26.5 65 52"
      data-draw
      aria-hidden="true"
    >
      {/* Home：底座，数据在你的电脑上 */}
      <g className="ew-lv" style={level(0, 0.05)}>
        <Box
          at={[0, 0, 0]}
          size={[S, S, 2.4]}
          top="floor"
          left="cut"
          right="dark"
        />
        <FrontText y={S} x={1.3} h={0.72} size={1.15} light>
          {platform.base}
        </FrontText>
      </g>

      {/* 平台的四层 */}
      <g className="ew-lv" style={level(1, 0.25)}>
        {platform.layers.map((name, index) => {
          const y = index * 6;
          return (
            <g key={name}>
              <Box at={[0, y, Z.layers]} size={[S, 5.4, 1]} />
              <TopText z={Z.layers + 1} x={1.4} y={y + 3.3} size={1.45}>
                {name}
              </TopText>
            </g>
          );
        })}
      </g>

      {/* 两盘插件：项目插件按需添加，个人插件每个项目都在 */}
      <g className="ew-lv" style={level(2, 0.45)}>
        <Box at={[0, 0, Z.trays]} size={[S, 8.6, 0.6]} />
        {platform.project.map((name, index) => (
          <Box
            key={name}
            at={[
              0.5 + (index % 6) * PITCH,
              0.8 + Math.floor(index / 6) * PITCH,
              Z.trays + 0.6,
            ]}
            size={[CUBE, CUBE, 1.8]}
            top={released.has(name) ? 'accent' : 'top'}
          />
        ))}
        <Box at={[0, 9.8, Z.trays]} size={[S, 14.2, 0.6]} />
        {platform.personal.map((name, index) => (
          <Box
            key={name}
            at={[
              2.5 + (index % 5) * PITCH,
              11.4 + Math.floor(index / 5) * PITCH,
              Z.trays + 0.6,
            ]}
            size={[CUBE, CUBE, 1.2]}
            top={released.has(name) ? 'accent' : 'light'}
            left="dark"
            right="side"
          />
        ))}
        {/* 你做的插件：留一个虚线空位 */}
        <g className="ew-axo-late">
          <polygon
            className="ew-slot"
            points={pts([
              [sx, sy, sz],
              [sx + CUBE, sy, sz],
              [sx + CUBE, sy + CUBE, sz],
              [sx, sy + CUBE, sz],
            ])}
          />
          <polyline
            className="ew-slot-plus"
            points={pts([
              [mid[0] - 0.7, mid[1], sz],
              [mid[0] + 0.7, mid[1], sz],
            ])}
          />
          <polyline
            className="ew-slot-plus"
            points={pts([
              [mid[0], mid[1] - 0.7, sz],
              [mid[0], mid[1] + 0.7, sz],
            ])}
          />
        </g>
        <Callout
          num="02"
          label={platform.projectLabel}
          from={[S, 4.3, Z.trays + 0.6]}
          to={[25.5, -4]}
          align="left"
        />
        <Callout
          num="03"
          label={platform.personalLabel}
          from={[S, 20, Z.trays + 0.6]}
          to={[25.5, 9.5]}
          align="left"
        />
      </g>

      {/* 能力目录 · 一套授权 */}
      <g className="ew-lv" style={level(3, 0.65)}>
        <Box at={[0, 0, Z.catalog]} size={[S, S, 1]} left="dark" right="side" />
        <TopText z={Z.catalog + 1} x={12} y={12.7} size={1.9} anchor="middle">
          {platform.catalog}
        </TopText>
      </g>

      {/* 四个调用方，都从同一个目录调用 */}
      <g className="ew-lv" style={level(4, 0.85)}>
        {platform.callers.map((name, index) => {
          const x = index * 6.2;
          return (
            <g key={name}>
              <Box
                at={[x, 10, Z.callers]}
                size={[5.4, 0.8, 3.4]}
                top="light"
                left="top"
                right="side"
              />
              <FrontText
                y={10.8}
                x={x + 2.7}
                h={Z.callers + 1.32}
                size={0.95}
                anchor="middle"
              >
                {name}
              </FrontText>
            </g>
          );
        })}
        <Callout
          num="01"
          label={platform.callersNote}
          from={[23.6, 10.4, Z.callers + 3.4]}
          to={[25.5, -19]}
          align="left"
        />
      </g>
    </svg>
  );
}
