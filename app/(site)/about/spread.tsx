'use client';
import { useRef, useState, type ReactNode } from 'react';
import {
  alongGroups,
  flowOf,
  type AlongItem,
} from '../../../content/site/along';
import { products } from '../../../content/site/products';
import type { Vars } from '../../_site/ui';
import { Glyph } from '../along-the-way/glyphs';
import { useProgress } from './progress';

// 第一章「当想法更容易变成现实」：摊开（负责人 2026-10-22 定，替换短片）。
// 材料就是这件事本身：沿途那 54 件真实的尝试，每件一个墨线小图，杏色小圆点落在这件事的「要害」上。
// 宽屏钉住一屏，纸白底，底稿 2.2 前两段一句一句出现在下方那一行，画面跟着变：
//   0 章名 → 1 仓库摊开（54 件铺满一屏，有点歪）→ 2 记录说得清做了什么、说不清为什么（圆点一起熄灭）→
//   3 做东西的方式变了（聚成八簇，浮出组名）→ 4 念头更早变成能试的东西（做成了的亮起一圈细框）→
//   5 走进更多地方（八簇向四周退开）→ 6 选择更重要（大多淡去，只留并进产品的那几件，圆点重新亮起；第三段逐字亮起）→
//   7 我们想在产品里寻找这些答案（留下的几件落到它们并进的产品名上；只写名字，去处在下一章）。
// 右上角那行「沿途的 54 件尝试」是去沿途的链接（负责人 2026-10-23）。
// 位置都在这里算好写进样式变量，换步只换 data-stage，动的是 transform，不重画 React。
// 没有 JS、窄屏、减少动态：不钉住，原句照常排下来，54 件铺成一张静止的图，留下的那几件圆点是亮的。

/** 章名、五句、题词、结尾 */
const STOPS = [0.07, 0.19, 0.31, 0.43, 0.55, 0.67, 0.86] as const;

/** 留下的几件按并进的产品分组，顺序就是最后那一行 */
const KEEP = ['work', 'tool', 'story'] as const;
type Kept = (typeof KEEP)[number];

/** 名字算出来的伪随机数（0–1），服务端和浏览器一致 */
function rand(seed: string, salt: number) {
  let h = 2166136261 ^ salt;
  for (const char of seed) {
    h ^= char.codePointAt(0)!;
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const fixed = (n: number) => Number(n.toFixed(2));

type Spot = {
  item: AlongItem;
  group: number;
  keep?: Kept;
  made: boolean;
  vars: Vars;
};

/** 每件在各步的位置（单位：钉住那一屏的 1% 宽、1% 高） */
function plan() {
  const items = alongGroups.flatMap((group, g) =>
    group.items.map((item) => ({ item, group: g })),
  );
  const cols = 9;
  const rows = Math.ceil(items.length / cols);
  const cellW = 84 / cols;
  const cellH = 66 / rows;
  // 八簇：四列两行，每簇顶上对齐（组名在上，小图从组名下面往下排）
  const centers = alongGroups.map((_, g) => ({
    x: 14 + (g % 4) * 24,
    y: g < 4 ? 30 : 63,
  }));
  const inGroup = alongGroups.map(() => 0);
  const keptOf = Object.fromEntries(KEEP.map((id) => [id, 0])) as Record<
    Kept,
    number
  >;
  const keptAll = items.filter(({ item }) =>
    (KEEP as readonly string[]).includes(flowOf(item)),
  ).length;
  let keptIndex = 0;
  const spots: Spot[] = items.map(({ item, group }, index) => {
    const name = item.name;
    // 1 摊开：九列，每格里歪一点
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x1 = 8 + (col + 0.5) * cellW + (rand(name, 1) - 0.5) * cellW * 0.3;
    const y1 = 8 + (row + 0.5) * cellH + (rand(name, 2) - 0.5) * cellH * 0.16;
    const r = (rand(name, 3) - 0.5) * 10;
    // 3 聚成八簇
    const size = alongGroups[group].items.length;
    const per = Math.ceil(Math.sqrt(size * 1.3));
    const at = inGroup[group]++;
    const inRow = Math.min(per, size - Math.floor(at / per) * per);
    const cx = centers[group].x + ((at % per) - (inRow - 1) / 2) * 4.3;
    const cy = centers[group].y + Math.floor(at / per) * 7.4;
    // 5 向四周退开：横向收着点，不出屏
    const x5 = 50 + (cx - 50) * 1.07;
    const y5 = 50 + (cy - 50) * 1.14;
    const flow = flowOf(item);
    const keep = (KEEP as readonly string[]).includes(flow)
      ? (flow as Kept)
      : undefined;
    const vars: Vars = {
      '--x1': fixed(x1),
      '--y1': fixed(y1),
      '--r': `${fixed(r)}deg`,
      '--x3': fixed(cx),
      '--y3': fixed(cy),
      '--x5': fixed(x5),
      '--y5': fixed(y5),
      '--d': `${Math.round(rand(name, 4) * 380)}ms`,
    };
    if (keep) {
      // 6 留下的排成一行；7 落到并进的产品名上
      const k = keptIndex++;
      const slot = keptOf[keep]++;
      const count = items.filter(
        ({ item: other }) => flowOf(other) === keep,
      ).length;
      vars['--x6'] = fixed(50 + (k - (keptAll - 1) / 2) * 5.2);
      vars['--y6'] = 21;
      vars['--x7'] = fixed(
        30 + KEEP.indexOf(keep) * 20 + (slot - (count - 1) / 2) * 4.2,
      );
      vars['--y7'] = 57;
    }
    return {
      item,
      group,
      keep,
      made: item.where.includes('app') || item.where.includes('merged'),
      vars,
    };
  });
  const labels = centers.map((center, g) => {
    const y3 = center.y - 6.6;
    return {
      text: alongGroups[g].short,
      vars: {
        '--x3': center.x,
        '--y3': fixed(y3),
        '--x5': fixed(50 + (center.x - 50) * 1.07),
        '--y5': fixed(50 + (y3 - 50) * 1.14),
      } as Vars,
    };
  });
  return { spots, labels };
}

const { spots, labels } = plan();

export function Spread({
  title,
  lines,
  big,
  ask,
  beat,
  credit,
}: {
  title: ReactNode;
  /** 前两段的五句（原句） */
  lines: ReactNode[];
  big: string;
  ask: string;
  beat: string;
  /** 右上角那行小字：去沿途 */
  credit: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  useProgress(box, STOPS, setStage);
  const chars = Array.from(big);
  return (
    <div className="sp" ref={box} data-stage={stage}>
      <div className="sp-stage">
        <div className="sp-card">{title}</div>
        <p className="sp-credit">{credit}</p>

        <div className="sp-field" aria-hidden="true">
          <ul className="sp-groups">
            {labels.map((label) => (
              <li key={label.text} className="sp-group" style={label.vars}>
                {label.text}
              </li>
            ))}
          </ul>
          <ul className="sp-items">
            {spots.map((spot) => (
              <li
                key={spot.item.name}
                className="sp-it"
                data-keep={spot.keep}
                data-made={spot.made || undefined}
                style={spot.vars}
              >
                <span className="sp-glyph">
                  <span className="sp-frame" />
                  <Glyph name={spot.item.name} />
                </span>
                <span className="sp-name" lang="en">
                  {spot.item.en ?? spot.item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <ol className="sp-lines">
          {lines.map((line, index) => (
            <li
              key={index}
              className="sp-line"
              data-on={stage === index + 1 || undefined}
            >
              <span>{line}</span>
            </li>
          ))}
        </ol>

        <div className="sp-turn">
          <p className="sp-big">
            <span className="sr-only">{big}</span>
            <span aria-hidden="true">
              {chars.map((char, index) => (
                <span
                  key={index}
                  className="sp-c"
                  style={{ '--i': (index / chars.length).toFixed(3) } as Vars}
                >
                  {char}
                </span>
              ))}
            </span>
          </p>
          <p className="sp-ask">{ask}</p>
        </div>

        <div className="sp-end">
          <p className="sp-beat">{beat}</p>
          <ul className="sp-products">
            {KEEP.map((id) => (
              <li key={id} className="sp-product" lang="en">
                {products[id].name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
