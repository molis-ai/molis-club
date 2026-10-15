import type { QuestionId } from '../../../content/site/enterprise';
import type { Vars } from '../../_site/ui';

// 「你们卡在哪」五张纸条上的小图：线描，墨色细线、白色的面、一点杏橙，画在一块浅色的底上；
// 只用这一问原文里的词，画的是卡住的样子。鼠标停上去或选中（data-on）时，图会动一下，演出我们会怎么帮：
// 五个环节落进「价值 × 成本」的图里、满出来的一天交出去一件、三块拼图拼上、演示变成真的一步步完成、方法传给每个人。
// 纯样式动画（enterprise.css）：纸条进入视口才演，演几轮就停；没有 JS、减少动态时是静止的一帧。
// 图是装饰，读屏跳过，意思在纸条上的字和下面的回应里。坐标都在 212 × 124 的画布里。

const VIEW = '0 0 212 124';
const px = (n: number) => `${n}px`;

/** 「不确定从哪投入」：候选排在图的上方；选中后落进图里（只是示意，不代表真实判断）。第三个（运营）落在值得先做的那一角 */
const spots: { x0: number; x1: number; y1: number; best?: boolean }[] = [
  { x0: 34, x1: 86, y1: 74 },
  { x0: 70, x1: 150, y1: 58 },
  { x0: 106, x1: 50, y1: 50, best: true },
  { x0: 142, x1: 116, y1: 92 },
  { x0: 178, x1: 168, y1: 88 },
];

/** 「资料经验拼不起来」：三块拼图（各宽 48、高 52，凸起与凹口互相咬合） */
const pieces = [
  'M0 0 H48 V18 C55 18 57 21 57 26 C57 31 55 34 48 34 V52 H0 Z',
  'M48 0 H96 V18 C103 18 105 21 105 26 C105 31 103 34 96 34 V52 H48 V34 C55 34 57 31 57 26 C57 21 55 18 48 18 Z',
  'M96 0 H144 V52 H96 V34 C103 34 105 31 105 26 C105 21 103 18 96 18 Z',
];
/** 拼图散开时各自的位置与角度 */
const scatter = [
  { dx: -10, dy: 8, r: -9 },
  { dx: 0, dy: -12, r: 6 },
  { dx: 10, dy: 12, r: 10 },
];
/** 每块拼图上的小图标：对话、文档、一个人 */
const icons = [
  'M16 12 h16 a3 3 0 0 1 3 3 v7 a3 3 0 0 1 -3 3 h-9 l-4 4 v-4 h-3 a3 3 0 0 1 -3 -3 v-7 a3 3 0 0 1 3 -3 Z',
  'M66 10 h9 l5 5 v14 h-14 Z M75 10 v5 h5 M69 20 h8 M69 24 h6',
  'M124 17 m-4.5 0 a4.5 4.5 0 1 0 9 0 a4.5 4.5 0 1 0 -9 0 M116 31 c0 -6 4 -8.5 8 -8.5 s8 2.5 8 8.5',
];
const labelX = [24, 72, 121];

export function Symptom({
  id,
  words,
  axes,
}: {
  id: QuestionId;
  words: string[];
  axes?: string[];
}) {
  if (id === 'where')
    return (
      <svg className="m-sym m-sym-where" viewBox={VIEW} aria-hidden="true">
        {/* 点阵：图的底纹 */}
        <g className="m-sym-grid">
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 11 }, (_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={42 + col * 16}
                cy={44 + row * 14}
                r="0.9"
              />
            )),
          )}
        </g>
        {/* 值得先做的那一角：价值高、成本低 */}
        <rect
          className="m-sym-sweet"
          x="29"
          y="37"
          width="70"
          height="30"
          rx="6"
        />
        <path className="m-sym-axis" d="M28 34 V104 H204" />
        <path
          className="m-sym-axis"
          d="M25 38 L28 33 L31 38 M199 101 L204 104 L199 107"
        />
        {axes ? (
          <>
            <text
              className="m-sym-note"
              x="0"
              y="0"
              transform="translate(17 104) rotate(-90)"
            >
              {axes[0]}
            </text>
            <text className="m-sym-note" x="204" y="119" textAnchor="end">
              {axes[1]}
            </text>
          </>
        ) : null}
        {words.map((word, index) => {
          const spot = spots[index];
          return (
            <g
              key={word}
              className="m-sym-pt"
              data-best={spot.best || undefined}
              style={
                {
                  '--i': index,
                  '--x0': px(spot.x0),
                  '--y0': px(17),
                  '--x1': px(spot.x1),
                  '--y1': px(spot.y1),
                } as Vars
              }
            >
              <g className="m-sym-bob">
                <circle className="m-sym-ring" r="9" />
                <circle className="m-sym-dot" r="4.2" />
                <text className="m-sym-word" x="8" y="3.6">
                  {word}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    );

  if (id === 'busy')
    // 一天的格子塞了四件事，最后一件从底线滑出去；选中时，第二件交出去，剩下的刚好放下
    return (
      <svg className="m-sym m-sym-busy" viewBox={VIEW} aria-hidden="true">
        {['9', '12', '15', '18'].map((hour, index) => (
          <text
            key={hour}
            className="m-sym-note"
            x="34"
            y={23 + index * 25}
            textAnchor="end"
          >
            {hour}
          </text>
        ))}
        <rect
          className="m-sym-day"
          x="40"
          y="8"
          width="78"
          height="92"
          rx="7"
        />
        {/* 一天的底线压在格子下面：滑出去的那一件盖住它 */}
        <path className="m-sym-edge" d="M34 100 H124" />
        {/* 交出去的那一件落在这里 */}
        <g className="m-sym-tray">
          <rect x="132" y="34" width="74" height="30" rx="7" />
          <path d="M169 20 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z" />
        </g>
        {words.map((word, index) => (
          <g
            key={word}
            className="m-sym-task"
            data-i={index}
            style={{ '--i': index, '--y': px(13 + index * 26) } as Vars}
          >
            <rect width="66" height="22" rx="5" />
            <text x="33" y="14.6" textAnchor="middle">
              {word}
            </text>
          </g>
        ))}
      </svg>
    );

  if (id === 'knowledge')
    // 三块拼图散在各处，拼不起来；选中时咬合成一整块
    return (
      <svg className="m-sym m-sym-bits" viewBox={VIEW} aria-hidden="true">
        <g transform="translate(23 28) scale(1.15)">
          {pieces.map((d, index) => (
            <g
              key={d}
              className="m-sym-piece"
              style={
                {
                  '--i': index,
                  '--dx': px(scatter[index].dx),
                  '--dy': px(scatter[index].dy),
                  '--r': `${scatter[index].r}deg`,
                } as Vars
              }
            >
              <path className="m-sym-piece-face" d={d} />
              <path className="m-sym-piece-icon" d={icons[index]} />
              <text x={labelX[index]} y="44" textAnchor="middle">
                {words[index]}
              </text>
            </g>
          ))}
        </g>
      </svg>
    );

  if (id === 'product')
    // 标着「演示」的虚线窗口：说出了需求，回音一直在「输入中」；选中时窗口变成实线，后续步骤一件件完成
    return (
      <svg className="m-sym m-sym-demo" viewBox={VIEW} aria-hidden="true">
        <rect
          className="m-sym-win"
          x="20"
          y="10"
          width="172"
          height="102"
          rx="9"
        />
        <path className="m-sym-bar" d="M20 26 H192" />
        <circle className="m-sym-light" cx="31" cy="18" r="2" />
        <circle className="m-sym-light" cx="39" cy="18" r="2" />
        <circle className="m-sym-light" cx="47" cy="18" r="2" />
        <g className="m-sym-tag">
          <rect x="146" y="3" width="38" height="15" rx="7.5" />
          <text x="165" y="13.6" textAnchor="middle">
            {words[0]}
          </text>
        </g>
        <g className="m-sym-say">
          <rect x="94" y="34" width="86" height="22" rx="11" />
          <text x="137" y="48.6" textAnchor="middle">
            {words[1]}
          </text>
        </g>
        <g className="m-sym-wait">
          <rect x="32" y="64" width="46" height="20" rx="10" />
          {[45, 55, 65].map((cx, index) => (
            <circle
              key={cx}
              cx={cx}
              cy="74"
              r="2.2"
              style={{ '--i': index } as Vars}
            />
          ))}
        </g>
        {[64, 80, 96].map((y, index) => (
          <g key={y} className="m-sym-step" style={{ '--i': index } as Vars}>
            <circle cx="38" cy={y} r="5.5" />
            <path className="m-sym-tick" d={`M35.4 ${y} l1.9 1.9 l3.4 -3.6`} />
            <path
              className="m-sym-line"
              d={`M51 ${y} H${[136, 116, 126][index]}`}
            />
          </g>
        ))}
      </svg>
    );

  // 一排人里只有一个亮着，方法在他那里；选中时从他往两边一个个亮起来
  return (
    <svg className="m-sym m-sym-team" viewBox={VIEW} aria-hidden="true">
      <circle className="m-sym-glow" cx="80" cy="76" r="11" />
      <g className="m-sym-tip">
        <rect x="63" y="34" width="34" height="16" rx="8" />
        <text x="80" y="45.4" textAnchor="middle">
          {words[0]}
        </text>
        <path d="M80 50 V60" />
      </g>
      {Array.from({ length: 7 }, (_, index) => {
        const x = 28 + index * 26;
        return (
          <g
            key={index}
            className="m-sym-person"
            data-lit={index === 2 || undefined}
            style={{ '--i': Math.abs(index - 2) } as Vars}
          >
            <circle cx={x} cy="76" r="6.5" />
            <path
              d={`M${x - 10} 104 V96 C${x - 10} 87 ${x + 10} 87 ${x + 10} 96 V104 Z`}
            />
          </g>
        );
      })}
      <path className="m-sym-floor" d="M14 104 H198" />
    </svg>
  );
}
