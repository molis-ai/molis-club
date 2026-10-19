import { useId } from 'react';
import type { StationId } from '../../../content/site/enterprise';
import type { Vars } from '../../_site/ui';
import { at, Shadow } from './keeps';

// 合作路线每一列卡上的示意动画，演这项服务在干什么（负责人 2026-10-19：每个环节配一个动画，让人一看就知道在干嘛）。
// 一块杏色小方块是「选中的那个场景」，四列里都是它：诊断时被挑出来、圈进范围；共建时成了流程的第一格；
// 评估时拿它跑出的结果和诊断时记下的灰柱比；培训时它在团队自己的一轮里走一圈。
// 诊断那张标出两条轴（业务价值、接入成本，5.2 里梳理场景的两项依据），一看就知道是在挑值得先做的。
// 静止就是演完的样子（没有 JS、减少动态都看这一帧）；有 data-play 时从头演，data-hold 时停在第一帧等着。
// 画布 260 × 150，同 keeps.tsx 的画法：白纸、墨色细线、一点杏橙；动画在 line.css（m-s- 开头）与 enterprise.css（m-k- 开头）。

const VIEW = '0 0 260 150';
const from = (x: number, y: number, seconds: number) =>
  ({ '--fx': `${x}px`, '--fy': `${y}px`, '--d': `${seconds}s` }) as Vars;

/** 记下的灰柱：开始前与核验共用同一组高度，好比较 */
const BASE = [38, 50, 30];

/** 开始前：一堆场景散开、按价值与成本排进四格；挑出一个，圈出试点范围；旁边一张卡记下现在的表现 */
function Diagnose() {
  const shadow = useId();
  // 六个场景，最后一个是选中的那个；都从格子中间那一堆散开
  const spots = [
    [126, 42],
    [112, 60],
    [64, 104],
    [134, 104],
    [100, 118],
    [48, 46],
  ];
  return (
    <svg className="m-scene" viewBox={VIEW} aria-hidden="true">
      <Shadow id={shadow} />
      <g className="m-k-rise" style={at(0)} filter={`url(#${shadow})`}>
        <rect
          className="m-k-paper"
          x="14"
          y="12"
          width="150"
          height="126"
          rx="8"
        />
      </g>
      <path
        className="m-k-cell m-k-fade"
        style={at(0.15)}
        d="M89 22 V128 M24 75 H154"
      />
      {/* 两条轴：往上价值高，往右接入成本高 */}
      <g className="m-k-fade" style={at(0.25)}>
        <text className="m-s-axis" x="93" y="27">
          业务价值
        </text>
        <text className="m-s-axis" x="152" y="86" textAnchor="end">
          接入成本
        </text>
      </g>
      {spots.map(([x, y], index) => {
        const chosen = index === spots.length - 1;
        return (
          <rect
            key={`${x}-${y}`}
            className={chosen ? 'm-s-move m-s-heat' : 'm-s-move m-s-spot'}
            style={from(89 - x, 75 - y, 0.35 + index * 0.08)}
            x={x - 4.5}
            y={y - 4.5}
            width="9"
            height="9"
            rx="2.4"
          />
        );
      })}
      <rect
        className="m-s-scope"
        style={at(1.45)}
        x="30"
        y="30"
        width="36"
        height="32"
        rx="6"
      />
      {/* 现在的表现：三根灰柱，后面核验拿来比 */}
      <g className="m-k-rise" style={at(1.7)} filter={`url(#${shadow})`}>
        <rect
          className="m-k-paper"
          x="178"
          y="30"
          width="68"
          height="98"
          rx="7"
        />
      </g>
      <path
        className="m-k-ink m-k-draw"
        style={at(1.95)}
        pathLength={1}
        d="M190 46 H214"
      />
      {BASE.map((height, index) => (
        <rect
          key={height}
          className="m-s-grow m-s-base"
          style={at(2.05 + index * 0.12)}
          x={190 + index * 16}
          y={116 - height}
          width="10"
          height={height}
          rx="2"
        />
      ))}
    </svg>
  );
}

/** 一起做：资料送进工具，要求排成一段流程；按一下试用，结果不对，改一处，再跑通 */
function Build() {
  const shadow = useId();
  return (
    <svg className="m-scene" viewBox={VIEW} aria-hidden="true">
      <Shadow id={shadow} />
      {/* 业务团队给的材料 */}
      <g className="m-k-rise" style={at(0)} filter={`url(#${shadow})`}>
        <g transform="rotate(-7 32 72)">
          <rect
            className="m-k-paper"
            x="12"
            y="46"
            width="40"
            height="52"
            rx="4"
          />
          <path
            className="m-k-thin"
            d="M19 58 H43 M19 67 H39 M19 76 H44 M19 85 H35"
          />
        </g>
      </g>
      <g className="m-k-rise" style={at(0.1)} filter={`url(#${shadow})`}>
        <g transform="rotate(5 40 80)">
          <rect
            className="m-k-paper"
            x="20"
            y="54"
            width="40"
            height="52"
            rx="4"
          />
          <path
            className="m-k-thin"
            d="M27 66 H51 M27 75 H47 M27 84 H52 M27 93 H43"
          />
        </g>
      </g>
      {/* 工具窗 */}
      <g className="m-k-rise" style={at(0.15)} filter={`url(#${shadow})`}>
        <rect
          className="m-k-paper"
          x="72"
          y="14"
          width="176"
          height="124"
          rx="9"
        />
      </g>
      <path className="m-k-cell" d="M72 30 H248" />
      <circle className="m-k-light" cx="84" cy="22" r="2.4" />
      <circle className="m-k-light" cx="92" cy="22" r="2.4" />
      <circle className="m-k-light" cx="100" cy="22" r="2.4" />
      {/* 材料一块块送进去 */}
      {[0, 1, 2].map((index) => (
        <rect
          key={index}
          className="m-s-feed"
          style={from(36, 2 - index * 4, 0.45 + index * 0.16)}
          x="56"
          y={64 + index * 4}
          width="6"
          height="6"
          rx="1.6"
        />
      ))}
      {/* 流程：选中的场景是第一格 */}
      <rect
        className="m-k-hot m-k-pop"
        style={at(0.7)}
        x="92"
        y="58"
        width="16"
        height="16"
        rx="4"
      />
      <path
        className="m-k-cell m-k-draw"
        style={at(0.9)}
        pathLength={1}
        d="M112 66 H140"
      />
      <path
        className="m-k-cell m-k-draw"
        style={at(1.15)}
        pathLength={1}
        d="M160 66 H188"
      />
      <path
        className="m-k-cell m-k-draw"
        style={at(1.4)}
        pathLength={1}
        d="M208 66 H218"
      />
      <g className="m-k-fade" style={at(1.05)}>
        <g className="m-s-tweak" style={at(2.75)}>
          <circle
            className="m-s-node"
            style={at(2.15)}
            cx="150"
            cy="66"
            r="8"
          />
        </g>
      </g>
      <g className="m-k-fade" style={at(1.3)}>
        <circle className="m-s-node" style={at(2.3)} cx="198" cy="66" r="8" />
      </g>
      {/* 结果：先 ✕，改过再跑是 ✓ */}
      <circle
        className="m-k-ok m-k-fade"
        style={at(1.4)}
        cx="228"
        cy="66"
        r="8"
      />
      <path
        className="m-s-x"
        style={at(2.4)}
        d="M224.5 62.5 l7 7 m0 -7 l-7 7"
      />
      <path
        className="m-k-tick m-s-ok"
        style={at(3.1)}
        d="M224.4 66 l2.6 2.7 l4.8 -5.2"
      />
      {/* 试用：按钮与指针 */}
      <g className="m-k-press" style={at(2)}>
        <circle className="m-s-run" cx="98" cy="112" r="9" />
        <path className="m-s-play" d="M95.5 107.6 V116.4 L103 112 Z" />
      </g>
      <g className="m-s-cursor" style={from(46, 26, 1.55)}>
        <path
          className="m-s-pointer"
          d="M104 117 V130 L107.6 126.6 L110.4 132.4 L112.6 131.4 L109.8 125.8 L114.6 125.8 Z"
        />
      </g>
    </svg>
  );
}

/** 核验：几件有代表性的任务逐条检查，一条不过、记下、复测通过；再拿结果和开始前的灰柱比 */
function Assess() {
  const shadow = useId();
  const rows = [40, 72, 104];
  return (
    <svg className="m-scene" viewBox={VIEW} aria-hidden="true">
      <Shadow id={shadow} />
      <g className="m-k-rise" style={at(0)} filter={`url(#${shadow})`}>
        <rect
          className="m-k-paper"
          x="14"
          y="16"
          width="112"
          height="118"
          rx="8"
        />
      </g>
      {rows.map((y, index) => (
        <g key={y} className="m-k-row" style={at(0.2 + index * 0.1)}>
          <circle className="m-k-mark" cx="32" cy={y} r="8" />
          <path className="m-k-line" d={`M48 ${y} H${[106, 96, 102][index]}`} />
        </g>
      ))}
      <path
        className="m-k-check m-k-fade"
        style={at(0.7)}
        d={`M28.4 ${rows[0]} l2.6 2.7 l4.8 -5.2`}
      />
      <path
        className="m-k-check m-k-fade"
        style={at(1.2)}
        d={`M28.4 ${rows[2]} l2.6 2.7 l4.8 -5.2`}
      />
      {/* 中间那条：先 ✕，记一笔，复测后 ✓ */}
      <path
        className="m-s-x"
        style={at(0.95)}
        d={`M28.5 ${rows[1] - 3.5} l7 7 m0 -7 l-7 7`}
      />
      <circle
        className="m-k-hot m-k-pop"
        style={at(1.3)}
        cx="112"
        cy={rows[1]}
        r="3.4"
      />
      <path
        className="m-k-tick m-s-ok"
        style={at(1.95)}
        d={`M28.4 ${rows[1]} l2.6 2.7 l4.8 -5.2`}
      />
      {/* 比一比：灰柱是开始前记下的，杏色是现在 */}
      <g className="m-k-rise" style={at(0.5)} filter={`url(#${shadow})`}>
        <rect
          className="m-k-paper"
          x="138"
          y="30"
          width="108"
          height="104"
          rx="8"
        />
      </g>
      <path
        className="m-k-ink m-k-draw"
        style={at(0.75)}
        pathLength={1}
        d="M150 46 H176"
      />
      {BASE.map((height, index) => (
        <g key={height}>
          <rect
            className="m-s-base m-k-fade"
            style={at(0.9 + index * 0.08)}
            x={152 + index * 30}
            y={122 - height}
            width="10"
            height={height}
            rx="2"
          />
          <rect
            className="m-s-grow m-s-now"
            style={at(2.2 + index * 0.14)}
            x={164 + index * 30}
            y={122 - [24, 30, 18][index]}
            width="10"
            height={[24, 30, 18][index]}
            rx="2"
          />
        </g>
      ))}
    </svg>
  );
}

/** 交接：任务说明、检查清单、操作流程交到团队手里；团队自己走完一轮，逐项检查 */
function Train() {
  const shadow = useId();
  const card = (x: number, y: number, r: number, seconds: number) =>
    ({
      '--tx': `${x}px`,
      '--ty': `${y}px`,
      '--r': `${r}deg`,
      '--d': `${seconds}s`,
    }) as Vars;
  // 一轮五步：选择任务、交代目标、准备材料、安排执行、检查结果
  const steps = [0, 72, 144, 216, 288].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return [200 + 34 * Math.sin(rad), 75 - 34 * Math.cos(rad)];
  });
  return (
    <svg className="m-scene" viewBox={VIEW} aria-hidden="true">
      <Shadow id={shadow} />
      {/* 任务说明 */}
      <g
        className="m-s-card"
        style={card(14, 50, -7, 0.1)}
        filter={`url(#${shadow})`}
      >
        <rect className="m-k-paper" width="50" height="64" rx="5" />
        <path className="m-k-ink" d="M8 12 H28" />
        <path
          className="m-k-thin"
          d="M8 24 H42 M8 33 H37 M8 42 H40 M8 51 H31"
        />
      </g>
      {/* 操作流程 */}
      <g
        className="m-s-card"
        style={card(92, 50, 7, 0.3)}
        filter={`url(#${shadow})`}
      >
        <rect className="m-k-paper" width="50" height="64" rx="5" />
        <path className="m-k-cell" d="M25 19 V27 M25 37 V45" />
        {[14, 32, 50].map((cy) => (
          <circle key={cy} className="m-s-dot" cx="25" cy={cy} r="5" />
        ))}
      </g>
      {/* 检查清单：在最上面，团队一项项打勾 */}
      <g
        className="m-s-card"
        style={card(53, 34, 0, 0.5)}
        filter={`url(#${shadow})`}
      >
        <rect className="m-k-paper" width="50" height="64" rx="5" />
        {[14, 31, 48].map((y, index) => (
          <g key={y}>
            <rect
              className="m-k-box"
              x="7"
              y={y - 4.5}
              width="9"
              height="9"
              rx="2"
            />
            <path
              className="m-k-tick-ink m-k-draw"
              style={at(1.75 + index * 0.4)}
              pathLength={1}
              d={`M8.8 ${y} l1.8 2 l3.6 -4.2`}
            />
            <path className="m-k-thin" d={`M22 ${y} H${[42, 38, 41][index]}`} />
          </g>
        ))}
      </g>
      {/* 团队自己的一轮：五步一圈，杏色小方块走一圈，每过一步点亮一步 */}
      <g className="m-k-fade" style={at(0.7)}>
        <circle className="m-k-cell" cx="200" cy="75" r="34" />
        {steps.map(([x, y], index) => (
          <circle
            key={index}
            className="m-s-node"
            style={at(1.3 + index * 0.34)}
            cx={x.toFixed(1)}
            cy={y.toFixed(1)}
            r="4.5"
          />
        ))}
      </g>
      <g className="m-s-orbit" style={at(1.3)}>
        <rect
          className="m-k-hot m-k-pop"
          style={at(1.1)}
          x="194"
          y="35"
          width="12"
          height="12"
          rx="3"
        />
      </g>
      <g className="m-k-stamp" style={at(3.1)}>
        <circle cx="200" cy="75" r="12" />
        <path d="M194.6 75 l3.6 3.7 l6.6 -7.3" />
      </g>
    </svg>
  );
}

export function Scene({ id }: { id: StationId }) {
  if (id === 'diagnose') return <Diagnose />;
  if (id === 'build') return <Build />;
  if (id === 'assess') return <Assess />;
  return <Train />;
}
