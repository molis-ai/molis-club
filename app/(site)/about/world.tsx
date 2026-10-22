import type { ReactNode } from 'react';
import type { Vars } from '../../_site/ui';

// 第三章「从这些探索，看向更远的构想」：一张没画完的 World 格纸（负责人 2026-10-22 定第四版）。
// World 还是概念，最诚实的样子就是一张没画完的图：浅格纸、铅笔线、虚线，故意留着没画完。
// 分三层，在那扇窗里跟着字一层层画出来（day.tsx）：
//   海岸（描了两遍）和几笔海浪 → 岛上三处地方（底稿 4.5「从一个在意的地方开始」那句的原文片段），
//   常去的面馆上点着那个杏色小点，一直想去的街角还是虚线 → 右下角另一座小岛，只起了个虚线的稿。
// 不钉窗时（没有 JS、窄屏、减少动态）用 DrawingTable：进入视口一次画完。

/** 一笔：pathLength=1，样式里按 --d 依次画出来 */
const Line = ({
  d,
  delay,
  className = '',
}: {
  d: string;
  delay: number;
  className?: string;
}) => (
  <path
    className={`wd-l ${className}`}
    d={d}
    pathLength={1}
    style={{ '--d': `${delay}ms` } as Vars}
  />
);

export type Places = readonly [string, string, string];

/** 格纸上那座岛：三层（.wd-coast、.wd-places、.wd-more） */
export function IslandSketch({ places }: { places: Places }) {
  const [shop, park, corner] = places;
  return (
    <svg viewBox="0 0 480 360" aria-hidden="true" focusable="false">
      <g className="wd-coast">
        {/* 海岸：先描一遍，再描一遍 */}
        <Line
          delay={0}
          d="M118 214C104 182 126 146 162 136c24-7 34-28 64-32 36-5 54 14 82 18 36 5 64 24 62 56-2 28-26 38-40 58-16 22-48 32-80 26-28-5-46 8-74 4-30-4-48-22-58-52z"
        />
        <Line
          delay={500}
          className="wd-faint"
          d="M123 209c-12-29 9-59 41-69 26-8 35-28 64-32 35-4 53 14 79 18 34 6 59 24 58 54-2 25-25 35-38 54-16 22-46 30-76 25-27-5-46 7-73 3-28-4-45-23-55-53z"
        />
        {/* 几笔海浪 */}
        <Line
          delay={900}
          className="wd-faint"
          d="M78 148c4-3 8-3 12 0s8 3 12 0"
        />
        <Line
          delay={1000}
          className="wd-faint"
          d="M384 104c4-3 8-3 12 0s8 3 12 0"
        />
        <Line
          delay={1100}
          className="wd-faint"
          d="M92 302c4-3 8-3 12 0s8 3 12 0"
        />
      </g>
      <g className="wd-places">
        {/* 等高线：虚的 */}
        <path
          className="wd-dash"
          d="M168 200c-2-24 28-40 58-42 36-2 74 10 80 34 6 24-26 38-58 36-34-2-78-4-80-28z"
        />
        <path
          className="wd-dash"
          d="M206 196c2-14 22-20 40-18 20 2 32 12 26 24-6 10-28 12-44 10-14-2-24-6-22-16z"
        />
        {/* 一条小路，把三处地方连起来 */}
        <path
          className="wd-path"
          d="M160 228c22-6 40-20 62-26 28-8 48 10 74 2 22-7 32-22 40-34"
        />
        {/* 常去的面馆：一间小房子，杏色小点落在这里 */}
        <Line delay={100} d="M144 236v-12l9-8 9 8v12z" />
        <Line delay={200} d="M151 236v-6h4v6" />
        <circle className="wd-dot" cx="153" cy="246" r="3" />
        <Line delay={300} className="wd-lead" d="M140 244l-36 30" />
        {/* 散步经过的公园：三棵树 */}
        <Line
          delay={400}
          d="M220 198a6 6 0 1 0 12 0a6 6 0 1 0-12 0M233 193a7 7 0 1 0 14 0a7 7 0 1 0-14 0M248 198a6 6 0 1 0 12 0a6 6 0 1 0-12 0"
        />
        <Line delay={500} d="M226 204v6M240 200v10M254 204v6" />
        <Line delay={600} className="wd-lead" d="M238 184l-36-106" />
        {/* 一直想去的街角：还没去过，只是虚线 */}
        <path className="wd-dash wd-want" d="M328 178h18v-18" />
        <path className="wd-dash wd-want" d="M352 178v-20" />
        <circle className="wd-dash wd-want" cx="352" cy="155" r="3" />
        <Line delay={700} className="wd-lead" d="M356 160l44-50" />
        {/* 三处地方的名字 */}
        <text className="wd-t" x="100" y="292" textAnchor="middle">
          {shop}
        </text>
        <text className="wd-t" x="200" y="66" textAnchor="middle">
          {park}
        </text>
        <text className="wd-t" x="404" y="100" textAnchor="middle">
          {corner}
        </text>
      </g>
      <g className="wd-more">
        {/* 另一座小岛：只起了个稿 */}
        <path
          className="wd-dash"
          d="M392 262c-6-14 8-26 26-24 18 2 28 16 22 28-6 12-36 14-48-4z"
        />
      </g>
    </svg>
  );
}

/** 不钉窗时的那张格纸：进入视口一次画完，下面一行展签 */
export function DrawingTable({
  places,
  label,
}: {
  places: Places;
  label: ReactNode;
}) {
  return (
    <figure className="wd" data-reveal>
      <div className="wd-sheet">
        <IslandSketch places={places} />
      </div>
      <figcaption className="wd-label">{label}</figcaption>
    </figure>
  );
}
