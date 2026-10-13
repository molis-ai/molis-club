'use client';
import { useState } from 'react';
import { demo, shift } from '../../../../../content/molis-tool';
import { Box, Callout, Face, Line, cursor, iso, type P3 } from '../axo';
import { pad } from '../routes';
import { Plate, SectionHead, type Vars } from '../shell';

// 01 以前与现在：左边一张轴测示意——摊开的一页上选中一行，大光标立在选区末端，三个动作浮在旁边，
// 结果落回这页上；三条编号引线对应右边表格的三行（入口、内容、结果）。指到表格某一行，图上对应的标注变墨色。

const Z = 0.6; // 纸面高度
const SEL_Y = 5.4; // 选中那一行
const lines = [2.2, 3.8, SEL_Y, 7.0];

/** 立着的大光标：在 y 为常数的竖直面上，尖朝上，和首页房间里的光标同形 */
const standing = (x0: number, y: number, s: number): P3[] =>
  cursor.map(([u, v]) => [x0 + u * s, y, Z + (16 - v) * s]);

function ShiftArt({ active }: { active: number | null }) {
  const tip: P3 = [12.6, SEL_Y, Z + 8];
  const chipsAt = iso([15.6, 2.4, 10.4]);
  const state = (index: number) => ({
    'data-hot': active === index,
    'data-dim': active !== null && active !== index,
  });
  return (
    <svg
      className="et-shift-svg"
      viewBox="-23 -8.5 46 26"
      aria-hidden="true"
      data-draw
    >
      {/* 摊开的一页 */}
      <Box at={[0, 0, 0]} size={[18, 13, Z]} />
      {/* 选区：杏橙淡底 */}
      <Face
        tone="glow"
        className="et-shift-sel"
        p={[
          [3, SEL_Y - 0.6, Z],
          [12.2, SEL_Y - 0.6, Z],
          [12.2, SEL_Y + 0.6, Z],
          [3, SEL_Y + 0.6, Z],
        ]}
      />
      {lines.map((y) => (
        <Line
          key={y}
          a={[2, y, Z]}
          b={[y === SEL_Y ? 15.6 : 16, y, Z]}
          className={y === SEL_Y ? 'e2-text' : 'e2-text e2-faint'}
        />
      ))}
      {/* 结果落回这页：一张薄片 */}
      <Box at={[3, 8.1, Z]} size={[8.6, 3.2, 0.35]} right="light" left="side" />
      <Line
        a={[4.2, 9.2, Z + 0.35]}
        b={[10.2, 9.2, Z + 0.35]}
        className="e2-text"
      />
      <Line
        a={[4.2, 10.3, Z + 0.35]}
        b={[8.4, 10.3, Z + 0.35]}
        className="e2-text e2-faint"
      />
      {/* 大光标：后面一层深灰给出厚度，前面一层杏橙 */}
      <Face tone="dark" p={standing(12.6, SEL_Y - 0.9, 0.5)} />
      <Face tone="accent" p={standing(12.6, SEL_Y, 0.5)} />
      {/* 光标旁的三个动作 */}
      <g
        className="et-shift-chips"
        transform={`translate(${chipsAt[0].toFixed(2)} ${chipsAt[1].toFixed(2)})`}
      >
        {demo.actions.map((action, index) => (
          <g
            key={action}
            transform={`translate(${(index * 4.7).toFixed(2)} ${(index * 2.5).toFixed(2)})`}
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
      {/* 编号引线：对应表格三行 */}
      <g className="et-co" {...state(0)}>
        <Callout
          num="01"
          label={shift.rows[0].aspect}
          from={tip}
          to={[-6, -6.4]}
          align="right"
        />
      </g>
      <g className="et-co" {...state(1)}>
        <Callout
          num="02"
          label={shift.rows[1].aspect}
          from={[6.5, SEL_Y, Z]}
          to={[-15, 0.6]}
          align="right"
        />
      </g>
      <g className="et-co" {...state(2)}>
        <Callout
          num="03"
          label={shift.rows[2].aspect}
          from={[5, 9.7, Z + 0.35]}
          to={[-12, 13]}
          align="right"
        />
      </g>
    </svg>
  );
}

export function Shift() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section
      className="et-section et-shift"
      data-bg="white"
      aria-labelledby="et-shift-title"
    >
      <SectionHead
        id="et-shift-title"
        index={0}
        kicker={shift.kicker}
        title={shift.title}
      />
      <div className="et-shift-body">
        <div className="et-shift-art" data-reveal>
          <Plate fig="Fig. 02" caption={shift.rows[0].after} note="概念示意">
            <ShiftArt active={active} />
          </Plate>
        </div>
        <table className="et-compare" onPointerLeave={() => setActive(null)}>
          <thead>
            <tr>
              <td aria-hidden="true" />
              <th scope="col">{shift.labels.before}</th>
              <th scope="col" lang="en">
                {shift.labels.after}
              </th>
            </tr>
          </thead>
          <tbody>
            {shift.rows.map((row, index) => (
              <tr
                key={row.aspect}
                data-reveal
                data-hot={active === index}
                style={{ '--d': `${index * 90}ms` } as Vars}
                onPointerEnter={() => setActive(index)}
              >
                <th scope="row">
                  <i aria-hidden="true">{pad(index)}</i>
                  {row.aspect}
                </th>
                <td data-label={shift.labels.before}>{row.before}</td>
                <td data-label={shift.labels.after}>
                  <span className="et-hl">{row.after}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
