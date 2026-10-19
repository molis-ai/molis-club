import { useId, type ReactNode } from 'react';
import { enterprise, type StationId } from '../../../content/site/enterprise';
import type { Vars } from '../../_site/ui';
import { at, Shadow } from './keeps';

// 合作路线每本书打开后的那出小戏（负责人 2026-10-20：动画不只演这一环在做什么，还要演出 Molis 跟业务怎么合作）。
// 一张 720 × 300 的台面：左边站着业务团队（墨色线描的两个人），右边站着 Molis（杏色的两个人），中间是一起干活的白桌面。
// 谁出手，谁那边先轻轻一跳、亮一圈，他手里的东西飞到桌上去做事；最后两边各送一颗小圆点到桌上同一个地方——一起的那一步。
// 台面下面三行字幕对着三个位置（业务团队在左、一起在中、Molis 在右），谁出手谁的那句浮上来；三句都是 5.2 / 5.3 的原句。
// 四出戏：
//   诊断：业务团队递上一张「现在怎么做、希望变成什么」的便笺；Molis 把一堆场景按业务价值与接入成本排进四格；
//         两边的小圆点落到挑中的那一格上，虚线圈出试点范围，便笺上的「希望」连到它。
//   共建：业务团队送进两页资料；Molis 把要求搭成一段流程、一个输入框和一个按钮；
//         业务团队的指针按下试用，结果不对，Molis 的小圆点去改那一格，再跑通。
//   评估：使用者的小圆点从左到右把完整流程亲手走一遍；Molis 拿放大镜逐条查结果和来源；
//         两边把事先约定的那条标准线拉起来，实际结果的柱子长过它，盖章。
//   培训：Molis 先把规则、资料、配置、说明一张张递过去；业务团队自己走完一轮（墨色小方块绕一圈），清单逐项打勾；
//         两边各落一颗小圆点到维护卡上：出了异常，按说明，谁来接。
// 静止就是演完的样子（没有 JS、减少动态都看这一帧）；外层 .m-duet 有 data-play 时从头演，data-hold 时停在第一帧。
// 画法沿用 keeps.tsx 与 scenes 的白纸、墨色细线、一点杏橙；动画在 line.css（m-d- 与 m-s- 开头）与 enterprise.css（m-k- 开头）。

const { line } = enterprise;
const VIEW = '0 0 720 300';
/** 两边站的位置：业务团队在左四分之一的正中，Molis 在右四分之一的正中 */
const YOU = { x: 90, y: 150 };
const WE = { x: 630, y: 150 };

type Who = 'you' | 'we';
type Says = Record<'you' | 'both' | 'we', number>;

/** 从某一边飞到 (x, y)：m-s-move 从这一边的位置出发 */
const fly = (who: Who, x: number, y: number, seconds: number) => {
  const from = who === 'you' ? YOU : WE;
  return {
    '--fx': `${from.x - x}px`,
    '--fy': `${from.y - y}px`,
    '--d': `${seconds}s`,
  } as Vars;
};
/** 从某一边送过去又散掉的小火花（m-s-feed：从原地出发，飞到 --fx --fy） */
const spark = (who: Who, x: number, y: number, seconds: number) => {
  const from = who === 'you' ? YOU : WE;
  return {
    '--fx': `${x - from.x}px`,
    '--fy': `${y - from.y}px`,
    '--d': `${seconds}s`,
  } as Vars;
};

/** 一个人：头和肩，线描 */
function Person({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="-15" r="9" />
      <path d="M-16 17 C-15 0 15 0 16 17 Z" />
    </g>
  );
}

/** 站在一边的两个人：出手时轻轻一跳、亮一圈（--a1 是自己出手，--a2 是一起那一步） */
function Side({
  who,
  act,
  together,
}: {
  who: Who;
  act: number;
  together: number;
}) {
  const { x, y } = who === 'you' ? YOU : WE;
  return (
    <g
      className="m-d-side"
      data-who={who}
      style={{ '--a1': `${act}s`, '--a2': `${together}s` } as Vars}
    >
      <ellipse className="m-d-floor" cx={x} cy={y + 34} rx="42" ry="5" />
      <circle className="m-d-ring" cx={x} cy={y} r="40" />
      <g className="m-d-people">
        <Person x={x - 17} y={y - 4} />
        <Person x={x + 17} y={y + 6} />
      </g>
    </g>
  );
}

/** 一颗从某一边落到桌上的小圆点：一起那一步，两边各送一颗 */
function Meet({
  who,
  x,
  y,
  seconds,
}: {
  who: Who;
  x: number;
  y: number;
  seconds: number;
}) {
  return (
    <circle
      className="m-s-move m-d-meet"
      data-who={who}
      style={fly(who, x, y, seconds)}
      cx={x}
      cy={y}
      r="5.5"
    />
  );
}

/** 台面与字幕：桌面在中间，两边的人，下面三行字幕 */
function Stage({
  id,
  says,
  acts,
  children,
}: {
  id: StationId;
  says: Says;
  /** 两边各自出手的时刻 */
  acts: Record<Who, number>;
  children: (shadow: string) => ReactNode;
}) {
  const shadow = useId();
  const rows = line.rows[id];
  return (
    <div className="m-duet">
      <svg className="m-scene m-duet-art" viewBox={VIEW} aria-hidden="true">
        <Shadow id={shadow} />
        <g filter={`url(#${shadow})`}>
          <rect
            className="m-k-paper"
            x="190"
            y="28"
            width="340"
            height="244"
            rx="14"
          />
        </g>
        <Side who="you" act={acts.you} together={says.both} />
        <Side who="we" act={acts.we} together={says.both} />
        {children(shadow)}
      </svg>
      <div className="m-duet-says">
        {(['you', 'both', 'we'] as const).map((who) => (
          <p
            key={who}
            className="m-duet-say"
            data-who={who}
            style={{ '--d': `${says[who]}s` } as Vars}
          >
            <span className="m-duet-who" lang={who === 'we' ? 'en' : undefined}>
              {line.who[who]}
            </span>
            {/* 按词组排，只在词组之间折行 */}
            <span className="m-duet-text">
              {rows[who].map((group) => (
                <span key={group} className="m-phrase">
                  {group}
                </span>
              ))}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

/** 诊断 */
function Diagnose() {
  // 六个场景从 Molis 那边飞进四格，最后一个是挑中的那个
  const spots = [
    [466, 90],
    [492, 120],
    [392, 206],
    [482, 214],
    [412, 234],
    [392, 92],
  ];
  return (
    <Stage
      id="diagnose"
      acts={{ you: 0.3, we: 1.9 }}
      says={{ you: 0.45, we: 2.05, both: 3.9 }}
    >
      {(shadow) => (
        <>
          {/* 业务团队：一张便笺——现在的三步，一个箭头，一个虚线的「希望」 */}
          <g className="m-s-move" style={fly('you', 272, 104, 0.5)}>
            <g filter={`url(#${shadow})`}>
              <rect
                className="m-k-paper"
                x="204"
                y="58"
                width="136"
                height="92"
                rx="9"
              />
            </g>
            <path className="m-k-cell" d="M230 94 H244 M258 94 H272" />
            {[224, 252, 280].map((cx) => (
              <circle key={cx} className="m-d-dot" cx={cx} cy="94" r="5" />
            ))}
            <path
              className="m-k-ink"
              d="M290 94 H308 M303 89 L308 94 L303 99"
            />
            <path className="m-k-thin" d="M218 124 H306 M218 134 H280" />
          </g>
          <circle
            className="m-d-wish m-k-pop"
            style={at(1.3)}
            cx="320"
            cy="94"
            r="8"
          />

          {/* Molis：四格与两条轴，场景一个个落进去 */}
          <path
            className="m-k-cell m-k-draw"
            style={at(2.15)}
            pathLength={1}
            d="M438 56 V250 M362 153 H514"
          />
          <g className="m-k-fade" style={at(2.3)}>
            <text className="m-s-axis" x="442" y="68">
              业务价值
            </text>
            <text className="m-s-axis" x="512" y="170" textAnchor="end">
              接入成本
            </text>
          </g>
          {spots.map(([x, y], index) => {
            const chosen = index === spots.length - 1;
            return (
              <rect
                key={`${x}-${y}`}
                className={
                  chosen ? 'm-s-move m-s-heat m-d-chosen' : 'm-s-move m-s-spot'
                }
                style={fly('we', x, y, 2.35 + index * 0.1)}
                x={x - 6}
                y={y - 6}
                width="12"
                height="12"
                rx="3"
              />
            );
          })}

          {/* 一起：两边的小圆点落到挑中的那一格，虚线圈出试点范围，「希望」连过去 */}
          <Meet who="you" x={378} y={74} seconds={3.85} />
          <Meet who="we" x={406} y={110} seconds={3.85} />
          <rect
            className="m-s-scope"
            style={at(4.35)}
            x="378"
            y="78"
            width="28"
            height="28"
            rx="6"
          />
          <path
            className="m-d-link m-k-fade"
            style={at(4.6)}
            d="M328 94 C350 94 360 92 378 92"
          />
        </>
      )}
    </Stage>
  );
}

/** 共建 */
function Build() {
  return (
    <Stage
      id="build"
      acts={{ you: 0.3, we: 1.9 }}
      says={{ you: 0.45, we: 2.05, both: 3.85 }}
    >
      {(shadow) => (
        <>
          {/* 桌面是一个工具窗 */}
          <path className="m-k-cell" d="M190 52 H530" />
          {[206, 216, 226].map((cx) => (
            <circle key={cx} className="m-k-light" cx={cx} cy="40" r="3" />
          ))}

          {/* 业务团队：两页资料送进来 */}
          <g className="m-s-move" style={fly('you', 240, 112, 0.5)}>
            <g filter={`url(#${shadow})`}>
              <g transform="rotate(-6 233 109)">
                <rect
                  className="m-k-paper"
                  x="206"
                  y="74"
                  width="54"
                  height="70"
                  rx="5"
                />
                <path
                  className="m-k-thin"
                  d="M215 88 H249 M215 98 H243 M215 108 H250 M215 118 H236"
                />
              </g>
              <g transform="rotate(5 245 121)">
                <rect
                  className="m-k-paper"
                  x="218"
                  y="86"
                  width="54"
                  height="70"
                  rx="5"
                />
                <path
                  className="m-k-thin"
                  d="M227 100 H261 M227 110 H255 M227 120 H262 M227 130 H248"
                />
              </g>
            </g>
          </g>

          {/* Molis：三点火花飞进来，搭成一段流程、一个输入框和一个按钮 */}
          {[298, 352, 404].map((x, index) => (
            <rect
              key={x}
              className="m-s-feed"
              style={spark('we', x, 112, 2.0 + index * 0.12)}
              x={WE.x - 3}
              y={WE.y - 3}
              width="6"
              height="6"
              rx="1.6"
            />
          ))}
          <rect
            className="m-k-hot m-k-pop"
            style={at(2.6)}
            x="288"
            y="102"
            width="20"
            height="20"
            rx="5"
          />
          <path
            className="m-k-cell m-k-draw"
            style={at(2.7)}
            pathLength={1}
            d="M312 112 H340"
          />
          <g className="m-k-fade" style={at(2.8)}>
            <g className="m-s-tweak" style={at(5.05)}>
              <circle
                className="m-s-node"
                style={at(2.8)}
                cx="352"
                cy="112"
                r="10"
              />
            </g>
          </g>
          <path
            className="m-k-cell m-k-draw"
            style={at(2.9)}
            pathLength={1}
            d="M364 112 H392"
          />
          <circle
            className="m-s-node m-k-fade"
            style={at(3.0)}
            cx="404"
            cy="112"
            r="10"
          />
          <path
            className="m-k-cell m-k-draw"
            style={at(3.1)}
            pathLength={1}
            d="M416 112 H444"
          />
          <circle
            className="m-k-ok m-k-fade"
            style={at(3.2)}
            cx="456"
            cy="112"
            r="10"
          />
          <rect
            className="m-k-field m-k-fade"
            style={at(3.2)}
            x="288"
            y="170"
            width="170"
            height="28"
            rx="7"
          />
          {[
            [300, 30, 3.35],
            [334, 22, 3.45],
            [360, 34, 3.55],
          ].map(([x, width, seconds]) => (
            <rect
              key={x}
              className="m-k-type"
              style={at(seconds)}
              x={x}
              y="181"
              width={width}
              height="6"
              rx="3"
            />
          ))}

          {/* 一起：业务团队的指针按下试用，结果不对；Molis 的小圆点去改那一格，再跑通 */}
          <g className="m-k-fade" style={at(3.45)}>
            <g className="m-k-press" style={at(4.35)}>
              <circle className="m-s-run" cx="490" cy="184" r="14" />
              <path className="m-s-play" d="M486.5 177.5 V190.5 L497 184 Z" />
            </g>
          </g>
          <g className="m-s-move" style={fly('you', 497, 196, 3.85)}>
            <path
              className="m-s-pointer"
              d="M494 190 V206 L498.4 201.8 L501.8 208.8 L504.6 207.6 L501.2 200.8 L507 200.8 Z"
            />
          </g>
          <path
            className="m-s-x"
            style={at(4.55)}
            d="M451.5 107.5 l9 9 m0 -9 l-9 9"
          />
          <Meet who="we" x={352} y={94} seconds={4.75} />
          <path
            className="m-k-tick m-s-ok"
            style={at(5.6)}
            d="M451.6 112 l3 3 l5.6 -6"
          />
        </>
      )}
    </Stage>
  );
}

/** 评估 */
function Assess() {
  const nodes = [222, 314, 406, 498];
  return (
    <Stage
      id="assess"
      acts={{ you: 0.3, we: 2.45 }}
      says={{ you: 0.45, we: 2.6, both: 3.9 }}
    >
      {(shadow) => (
        <>
          {/* 业务团队：使用者的小圆点从左到右把完整流程亲手走一遍 */}
          <path className="m-k-cell" d="M222 66 H498" />
          {nodes.map((cx, index) => (
            <g key={cx}>
              <circle className="m-k-mark" cx={cx} cy="66" r="10" />
              <path
                className="m-k-check m-k-fade"
                style={at([1.05, 1.5, 1.95, 2.4][index])}
                d={`M${cx - 4} 66 l2.8 2.9 l5.2 -5.6`}
              />
            </g>
          ))}
          <g className="m-s-move" style={fly('you', 222, 66, 0.5)}>
            <g className="m-d-run" style={at(1.0)}>
              <circle
                className="m-d-meet"
                data-who="you"
                cx="222"
                cy="66"
                r="5.5"
              />
            </g>
          </g>

          {/* Molis：一张查验单，放大镜逐条查结果和来源 */}
          <g className="m-k-rise" style={at(2.6)} filter={`url(#${shadow})`}>
            <rect
              className="m-k-paper"
              x="206"
              y="104"
              width="146"
              height="150"
              rx="10"
            />
          </g>
          {[136, 178, 220].map((y, index) => (
            <g key={y} className="m-k-row" style={at(2.75 + index * 0.1)}>
              <circle className="m-k-mark" cx="226" cy={y} r="9" />
              <path
                className="m-k-line"
                d={`M244 ${y} H${[300, 290, 296][index]}`}
              />
              {/* 来源：一小节链环 */}
              <rect
                className="m-d-source"
                x="310"
                y={y - 5}
                width="20"
                height="10"
                rx="5"
              />
            </g>
          ))}
          {[136, 178, 220].map((y, index) => (
            <path
              key={y}
              className="m-k-check m-k-fade"
              style={at(3.05 + index * 0.3)}
              d={`M222 ${y} l2.8 2.9 l5.2 -5.6`}
            />
          ))}
          <g className="m-s-move" style={fly('we', 334, 128, 2.7)}>
            <g className="m-d-scan" style={at(3.0)}>
              <g className="m-d-lens">
                <circle cx="334" cy="128" r="12" />
                <path d="M342.5 136.5 L351 145" />
              </g>
            </g>
          </g>

          {/* 一起：两边把事先约定的标准线拉起来，实际结果的柱子长过它，盖章 */}
          <g className="m-k-rise" style={at(3.9)} filter={`url(#${shadow})`}>
            <rect
              className="m-k-paper"
              x="368"
              y="104"
              width="146"
              height="150"
              rx="10"
            />
          </g>
          <Meet who="you" x={382} y={190} seconds={4.05} />
          <Meet who="we" x={500} y={190} seconds={4.05} />
          <path
            className="m-d-standard m-k-fade"
            style={at(4.45)}
            d="M382 190 H500"
          />
          {[
            [394, 64],
            [430, 76],
            [466, 58],
          ].map(([x, height], index) => (
            <rect
              key={x}
              className="m-s-grow m-s-now"
              style={at(4.75 + index * 0.14)}
              x={x}
              y={240 - height}
              width="18"
              height={height}
              rx="3"
            />
          ))}
          <g className="m-k-stamp" style={at(5.35)}>
            <circle cx="494" cy="128" r="12" />
            <path d="M488.6 128 l3.6 3.7 l6.6 -7.3" />
          </g>
        </>
      )}
    </Stage>
  );
}

/** 培训 */
function Train() {
  // 一轮五步：选择任务、交代目标、准备材料、安排执行、检查结果
  const center = { x: 440, y: 126 };
  const steps = [0, 72, 144, 216, 288].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return [center.x + 44 * Math.sin(rad), center.y - 44 * Math.cos(rad)];
  });
  /** 一张卡从 Molis 那边飞到 (x, y) 起的位置 */
  const card = (x: number, y: number, seconds: number) =>
    fly('we', x + 26, y + 33, seconds);
  return (
    <Stage
      id="train"
      acts={{ we: 0.3, you: 1.95 }}
      says={{ we: 0.45, you: 2.1, both: 4.3 }}
    >
      {(shadow) => (
        <>
          {/* Molis：规则、资料、配置、说明一张张递过去 */}
          <g className="m-s-move" style={card(204, 58, 0.5)}>
            <g filter={`url(#${shadow})`} transform="rotate(-6 230 91)">
              <rect
                className="m-k-paper"
                x="204"
                y="58"
                width="52"
                height="66"
                rx="5"
              />
              <path className="m-k-ink" d="M212 70 H234" />
              <path
                className="m-k-thin"
                d="M212 82 H248 M212 92 H242 M212 102 H246 M212 112 H236"
              />
            </g>
          </g>
          <g className="m-s-move" style={card(232, 66, 0.65)}>
            <g filter={`url(#${shadow})`}>
              <rect
                className="m-k-paper"
                x="232"
                y="66"
                width="52"
                height="66"
                rx="5"
              />
              {/* 配置：两个开关 */}
              {[84, 104].map((y, index) => (
                <g key={y}>
                  <rect
                    className="m-d-switch"
                    data-on={index === 0 || undefined}
                    x="242"
                    y={y - 6}
                    width="22"
                    height="12"
                    rx="6"
                  />
                  <circle
                    className="m-d-knob"
                    cx={index === 0 ? 258 : 248}
                    cy={y}
                    r="4"
                  />
                </g>
              ))}
              <path className="m-k-thin" d="M242 120 H274" />
            </g>
          </g>
          <g className="m-s-move" style={card(260, 74, 0.8)}>
            <g filter={`url(#${shadow})`} transform="rotate(5 286 107)">
              <rect
                className="m-k-paper"
                x="260"
                y="74"
                width="52"
                height="66"
                rx="5"
              />
              {[90, 106, 122].map((y, index) => (
                <g key={y}>
                  <rect
                    className="m-k-box"
                    x="268"
                    y={y - 4.5}
                    width="9"
                    height="9"
                    rx="2"
                  />
                  <path
                    className="m-k-tick-ink m-k-draw"
                    style={at(2.6 + index * 0.45)}
                    pathLength={1}
                    d={`M269.8 ${y} l1.8 2 l3.6 -4.2`}
                  />
                  <path
                    className="m-k-thin"
                    d={`M282 ${y} H${[304, 300, 303][index]}`}
                  />
                </g>
              ))}
            </g>
          </g>

          {/* 业务团队：自己走完一轮，墨色小方块绕一圈，每过一步点亮一步 */}
          <g className="m-k-fade" style={at(2.05)}>
            <circle className="m-k-cell" cx={center.x} cy={center.y} r="44" />
            {steps.map(([x, y], index) => (
              <circle
                key={index}
                className="m-s-node"
                style={at(2.45 + index * 0.36)}
                cx={x.toFixed(1)}
                cy={y.toFixed(1)}
                r="5"
              />
            ))}
          </g>
          <g
            className="m-s-orbit"
            style={
              {
                '--d': '2.3s',
                '--ox': `${center.x}px`,
                '--oy': `${center.y}px`,
              } as Vars
            }
          >
            <rect
              className="m-d-team m-k-pop"
              style={at(2.15)}
              x={center.x - 6}
              y={center.y - 50}
              width="12"
              height="12"
              rx="3"
            />
          </g>
          <g className="m-k-stamp" style={at(4.1)}>
            <circle cx={center.x} cy={center.y} r="13" />
            <path d={`M${center.x - 5.6} ${center.y} l3.8 3.9 l7 -7.7`} />
          </g>

          {/* 一起：维护卡——出了异常，按说明，两边各落一颗小圆点：谁来接 */}
          <g className="m-k-rise" style={at(4.3)} filter={`url(#${shadow})`}>
            <rect
              className="m-k-paper"
              x="226"
              y="206"
              width="268"
              height="48"
              rx="10"
            />
          </g>
          <g className="m-k-fade" style={at(4.45)}>
            <path
              className="m-d-alert"
              d="M252 220 L262 238 H242 Z M252 227 V232"
            />
            <path
              className="m-k-ink"
              d="M274 230 H298 M293 225 L298 230 L293 235"
            />
            <path className="m-k-thin" d="M310 224 H360 M310 236 H350" />
          </g>
          <Meet who="you" x={392} y={230} seconds={4.55} />
          <Meet who="we" x={410} y={230} seconds={4.55} />
          <circle
            className="m-k-ok m-k-fade"
            style={at(5.05)}
            cx="462"
            cy="230"
            r="10"
          />
          <path
            className="m-k-tick m-k-fade"
            style={at(5.15)}
            d="M457.6 230 l3 3 l5.6 -6"
          />
        </>
      )}
    </Stage>
  );
}

export function Duet({ id }: { id: StationId }) {
  if (id === 'diagnose') return <Diagnose />;
  if (id === 'build') return <Build />;
  if (id === 'assess') return <Assess />;
  return <Train />;
}
