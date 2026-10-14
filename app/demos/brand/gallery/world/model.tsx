'use client';
import type { ReactNode } from 'react';

// Room 5 · World 的方案模型：一块白色底板上，左前方一条有面馆的巷子（现实里的地方），
// 右后方一片起雾的小港和灯塔（故事里的经历），中间一只放纪念物的小柜（你的世界）。
// 等轴测投影画成 SVG：纯白的纸面、两种灰的侧面，只有面馆门口一盏灯和旅程路线是杏色。

const OX = 320;
const OY = 54;

/** 等轴测投影：模型坐标 (x, y, z) → 画面坐标 */
export function iso(x: number, y: number, z = 0): [number, number] {
  return [OX + (x - y) * 0.866, OY + (x + y) * 0.5 - z];
}

const pts = (list: [number, number][]) =>
  list.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ');

/** 一个盒子：顶面、左前面、右前面 */
function Block({
  x,
  y,
  w,
  d,
  h,
  z = 10,
  className = '',
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  z?: number;
  className?: string;
}) {
  const top = pts([
    iso(x, y, z + h),
    iso(x + w, y, z + h),
    iso(x + w, y + d, z + h),
    iso(x, y + d, z + h),
  ]);
  const left = pts([
    iso(x, y + d, z + h),
    iso(x + w, y + d, z + h),
    iso(x + w, y + d, z),
    iso(x, y + d, z),
  ]);
  const right = pts([
    iso(x + w, y, z + h),
    iso(x + w, y + d, z + h),
    iso(x + w, y + d, z),
    iso(x + w, y, z),
  ]);
  return (
    <g className={`g-wpage-block ${className}`}>
      <polygon className="g-wpage-left" points={left} />
      <polygon className="g-wpage-right" points={right} />
      <polygon className="g-wpage-top" points={top} />
    </g>
  );
}

/** 旅程的六个站点（在底板顶面上），最后一站在底板外面——那是真实的街 */
export const stops: [number, number, number][] = [
  [66, 252, 10],
  [196, 146, 10],
  [236, 128, 14],
  [282, 56, 10],
  [112, 222, 10],
  [40, 336, 0],
];

function routePath() {
  const p = stops.map(([x, y, z]) => iso(x, y, z));
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 1; i < p.length; i += 1) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    // 轻轻拱起的弧线，像在模型上画出来的路线
    const cx = (x0 + x1) / 2;
    const cy = Math.min(y0, y1) - 26;
    d += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
}
export const route = routePath();

/** 模型本体；children 画在最上面（路线、站点、引线） */
export function Maquette({ children }: { children?: ReactNode }) {
  const water = pts([
    iso(176, 0, 10),
    iso(300, 0, 10),
    iso(300, 150, 10),
    iso(176, 150, 10),
  ]);
  const lane = pts([
    iso(20, 186, 10.2),
    iso(160, 186, 10.2),
    iso(160, 206, 10.2),
    iso(20, 206, 10.2),
  ]);
  return (
    <svg className="g-wpage-model" viewBox="0 0 640 420" aria-hidden="true">
      <defs>
        <linearGradient id="g-wpage-fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* 底板 */}
      <Block
        x={0}
        y={0}
        w={300}
        d={300}
        h={10}
        z={0}
        className="g-wpage-base"
      />
      {/* 雾港的水面与巷子的路面 */}
      <polygon className="g-wpage-water" points={water} />
      <polygon className="g-wpage-lane" points={lane} />
      {/* 雾港：仓库、码头、灯塔 */}
      <Block x={196} y={14} w={52} d={34} h={30} />
      <Block x={206} y={122} w={72} d={12} h={3} />
      <Block x={274} y={42} w={14} d={14} h={62} />
      <Block x={271} y={39} w={20} d={20} h={4} z={72} />
      <path
        className="g-wpage-fog"
        d={`M${iso(176, 0, 40).join(' ')} L${iso(300, 0, 40).join(' ')} L${iso(300, 150, 20).join(' ')} L${iso(176, 150, 20).join(' ')} Z`}
      />
      {/* 你的世界：中间一只放纪念物的小柜 */}
      <Block x={128} y={112} w={36} d={30} h={24} className="g-wpage-home" />
      {/* 巷子：面馆和两边的小楼 */}
      <Block x={40} y={140} w={42} d={38} h={48} />
      <Block x={100} y={136} w={30} d={40} h={30} />
      <Block x={40} y={214} w={52} d={42} h={34} className="g-wpage-shop" />
      <Block x={104} y={236} w={40} d={40} h={26} />
      {/* 面馆门口一盏灯，唯一一处亮着的暖色 */}
      <circle
        className="g-wpage-lamp"
        cx={iso(66, 256, 30)[0]}
        cy={iso(66, 256, 30)[1]}
        r="3"
      />
      {/* 小树 */}
      {[
        [170, 220, 9],
        [184, 236, 7],
        [24, 120, 8],
      ].map(([x, y, r]) => {
        const [cx, cy] = iso(x, y, 10 + r);
        return (
          <circle
            key={`${x}-${y}`}
            className="g-wpage-tree"
            cx={cx}
            cy={cy}
            r={r}
          />
        );
      })}
      {/* 第十三号钥匙牌：放在小柜旁边的一枚小牌 */}
      <polygon
        className="g-wpage-key"
        points={pts([
          iso(170, 150, 10.4),
          iso(186, 150, 10.4),
          iso(186, 158, 10.4),
          iso(170, 158, 10.4),
        ])}
      />
      {children}
    </svg>
  );
}
