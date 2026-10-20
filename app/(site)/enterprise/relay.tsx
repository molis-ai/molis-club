import { useId, type ReactNode } from 'react';
import {
  enterprise,
  type ProofId,
  type View,
} from '../../../content/site/enterprise';
import {
  draw,
  fade,
  GLIDE,
  HIDE,
  open,
  Paper,
  pin,
  ping,
  pop,
  reel,
  Screen,
  shot,
  SHOW,
  walk,
  WIDE,
  type Frame,
} from './films';
import { Shadow } from './keeps';

// 「为什么我们可以」的四段接力短片（负责人 2026-10-20：用上一章动画的方式，让人眼前一亮，字不要多）。
// 一张杏色小卡——一个值得做的场景——在四段里接力跑完：业务目标那段它被找到，产品体验那段它被拆开理顺、拼成方案，
// 工程实现那段方案被做成跑起来的系统，使用者的处境那段系统到了人手里、卡住的地方一个个被抹平。
// 上场的不是人，是经历：每只光标的名牌写着一段经历（飞书「哇塞的履历」去掉人名，见 content/site/enterprise.ts 的 proofs）。
// 每段开头，上一段交出来的东西从左边飞进来（四本书从左到右打开，东西就从左边接过来）。
// 画法、光标、镜头、按脚本合成关键帧都和合作路线的短片（films.tsx）一样；静止是最后一帧。
//
// 四段分镜（秒）：
//   业务目标  0.3 数据科学进场，拉出两条轴 → 1.8 散在画板上的十几张业务信号「啪」地落成散点
//             → 3.4 数据运营进场，给其中四个点上墨（真实需求）→ 5.4 数据科学圈住右上角 → 6.4 一个点长成杏色小卡
//   产品体验  0.2 杏色小卡从左边飞进来 → 1.1 一抖散成一团缠着线的需求便签 → 1.9 AI 数据产品专家把线抽掉、便签理成三列
//             → 3.5 右边拼出一个界面线框，每拼一块，对应的便签闪一下 → 5.4 复旦中文系把歪歪扭扭的字条理直 → 7.0 核心研发架构盖一枚 ✓
//   工程实现  0.2 线框从左边滑进来 → 1.4 核心研发架构把知识库、模型、接口三块拖上网格 → 4.0 复杂系统与 Agent 用折线连起来，数据沿线流
//             → 5.8 AI Coding 打出几行代码，进度条走满 → 7.9 线框变成真的界面，右上角亮起运行的小点
//   使用者的处境 0.2 界面到了一个人手里 → 1.2 他用的时候时间线上鼓起三个包（卡住的地方）→ 3.4 数据运营把包收成三条反馈
//             → 5.4 以 AI 重构工作流把流程里两步对调、合并 → 7.2 讲师递过去一本小手册 → 8.3 三个包一个个抹平，那个人顺着走完

const { why } = enterprise;

/** 一只光标：名牌上是一段经历（大字）和它的出处（小字） */
function Actor({
  proof,
  tone = 'light',
  className,
}: {
  proof: ProofId;
  tone?: 'light' | 'deep';
  className: string;
}) {
  const { tag, sub } = why.proofs[proof] as { tag: string; sub?: string };
  return (
    <span
      className={`m-film-hand m-relay-hand ${className}`}
      data-who="we"
      data-tone={tone}
    >
      <svg className="m-film-arrow" viewBox="0 0 16 22" aria-hidden="true">
        <path d="M1.5 1.5 V17 L5.6 13.2 L8.6 20 L11.4 18.8 L8.5 12.2 H14 Z" />
      </svg>
      <span className="m-relay-tag">
        <b>{tag}</b>
        {sub ? <small>{sub}</small> : null}
      </span>
    </span>
  );
}

/** 接力的那张杏色小卡：一个点、两道字条 */
function Baton({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect
        className="m-relay-baton"
        x={x}
        y={y}
        width="96"
        height="60"
        rx="10"
      />
      <circle className="m-relay-baton-dot" cx={x + 18} cy={y + 20} r="5" />
      <rect
        className="m-relay-baton-ink"
        x={x + 30}
        y={y + 17}
        width="48"
        height="6"
        rx="3"
      />
      <rect
        className="m-relay-baton-soft"
        x={x + 14}
        y={y + 36}
        width="68"
        height="5"
        rx="2.5"
      />
    </>
  );
}

/* ================================ 业务目标：找到 ================================ */
/** 十六个业务信号落成散点的位置 */
const DOTS: [number, number][] = [
  [260, 420],
  [320, 380],
  [300, 300],
  [380, 410],
  [420, 330],
  [470, 260],
  [520, 390],
  [560, 320],
  [600, 420],
  [640, 280],
  [350, 200],
  [450, 170],
  [720, 150],
  [780, 190],
  [690, 210],
  [820, 135],
];
/** 数据运营点过的四个：真实需求（第 12 个最后长成杏色小卡） */
const REAL = [5, 9, 12, 13];

function Find() {
  const shadow = useId();
  const cue = {
    enter: 0.3,
    axes: 1.1,
    sort: 1.8,
    verify: 3.4,
    lasso: 5.4,
    pick: 6.4,
    wide: 7.6,
    end: 9.4,
  };
  const cut = reel('relay-find', cue.end);
  const camera = cut.track(
    [
      [0, WIDE],
      [cue.verify - 0.2, WIDE],
      [cue.verify + 0.6, shot(560, 280, 1.08)],
      [cue.lasso, shot(560, 280, 1.08)],
      [cue.pick, shot(740, 190, 1.35)],
      [cue.wide, shot(740, 190, 1.35)],
      [cue.wide + 1, WIDE],
    ],
    GLIDE,
  );
  const taps = REAL.map((_, k) => cue.verify + 0.6 + k * 0.42);
  const tapAt = (i: number) => taps[REAL.indexOf(i)];
  const scientist = cut.track(
    walk([
      [cue.enter, -160, 300],
      [cue.axes, 206, 474],
      [cue.axes + 0.6, 206, 474],
      [cue.sort + 0.5, 300, 140],
      [cue.lasso - 0.3, 300, 140],
      [cue.lasso, 860, 240],
      [cue.lasso + 0.8, 660, 112],
      [cue.wide, 660, 112],
      [cue.wide + 0.8, 560, 476],
    ]),
    GLIDE,
  );
  const ops = cut.track(
    walk([
      [cue.verify, 1100, 200],
      ...REAL.map((i, k): [number, number, number] => [
        taps[k] - 0.05,
        DOTS[i][0] + 3,
        DOTS[i][1] + 5,
      ]),
      [taps[3] + 0.4, DOTS[13][0] + 3, DOTS[13][1] + 5],
      [cue.lasso + 0.4, 760, 330],
    ]),
    GLIDE,
  );

  const art = (
    <>
      <Shadow id={shadow} />
      <path
        className={`m-relay-axis ${cut.track(draw(cue.axes, 0.5))}`}
        pathLength={1}
        d="M200 470 V84"
      />
      <path
        className={`m-relay-axis ${cut.track(draw(cue.axes + 0.2, 0.5))}`}
        pathLength={1}
        d="M200 470 H884"
      />
      <path
        className={`m-relay-axis-tip ${cut.track(fade(cue.axes + 0.6, 0.3))}`}
        d="M194 92 L200 82 L206 92 M876 464 L886 470 L876 476"
      />
      {DOTS.map(([cx, cy], i) => {
        const t = cue.sort + i * 0.06;
        const sx = 80 + ((i * 211) % 800);
        const sy = 70 + ((i * 127) % 400);
        const rot = ((i * 53) % 25) - 12;
        return (
          <g
            key={i}
            className={cut.track(
              [
                [t, `transform:translate(${sx - cx}px,${sy - cy}px)`],
                [t + 0.7, 'transform:translate(0px,0px)'],
              ],
              GLIDE,
            )}
          >
            <g
              className={`m-film-pop ${cut.track([
                [t, `opacity:1;transform:rotate(${rot}deg) scale(1)`],
                [t + 0.7, 'opacity:0;transform:rotate(0deg) scale(.3)'],
              ])}`}
            >
              <g filter={`url(#${shadow})`}>
                <rect
                  className="m-k-paper"
                  x={cx - 22}
                  y={cy - 15}
                  width="44"
                  height="30"
                  rx="5"
                />
              </g>
              <rect
                className="m-relay-t1"
                x={cx - 13}
                y={cy - 6}
                width="18"
                height="4"
                rx="2"
              />
              <rect
                className="m-relay-t0"
                x={cx - 13}
                y={cy + 2}
                width="26"
                height="4"
                rx="2"
              />
            </g>
            <circle
              className={`m-relay-dot m-film-pop ${cut.track(pop(t + 0.45, 0.3))}`}
              cx={cx}
              cy={cy}
              r="7"
            />
            {REAL.includes(i) ? (
              <circle
                className={`m-relay-dot-real m-film-pop ${cut.track(pop(tapAt(i) + 0.05, 0.25))}`}
                cx={cx}
                cy={cy}
                r="7"
              />
            ) : null}
          </g>
        );
      })}
      {REAL.map((i) => (
        <circle
          key={i}
          className={`m-film-ring m-film-pop ${cut.track(ping(tapAt(i)))}`}
          cx={DOTS[i][0]}
          cy={DOTS[i][1]}
          r="14"
        />
      ))}
      <rect
        className={`m-film-lasso m-relay-corner ${cut.track(
          [
            [cue.lasso, 'transform:scale(0)'],
            [cue.lasso + 0.8, 'transform:scale(1)'],
          ],
          GLIDE,
        )}`}
        x="660"
        y="110"
        width="200"
        height="130"
        rx="10"
      />
      <g
        className={`m-film-pop ${cut.track(pop(cue.pick, 0.5))}`}
        filter={`url(#${shadow})`}
      >
        <Baton x={712} y={120} />
      </g>
      <circle
        className={`m-film-ring m-film-pop ${cut.track(ping(cue.pick + 0.1))}`}
        cx="760"
        cy="150"
        r="40"
      />
    </>
  );
  const overlay = (
    <>
      <span
        className={`m-film-axis m-film-axis-end ${cut.track(fade(cue.axes + 0.6))}`}
        style={pin(884, 482)}
      >
        {why.axes.x}
      </span>
      <span
        className={`m-film-axis ${cut.track(fade(cue.axes + 0.6))}`}
        style={pin(212, 78)}
      >
        {why.axes.y}
      </span>
      <Actor proof="data" className={scientist} />
      <Actor proof="ops" tone="deep" className={ops} />
    </>
  );
  return <Screen cut={cut} camera={camera} art={art} overlay={overlay} />;
}

/* ================================ 产品体验：理顺 ================================ */
function Shape() {
  const shadow = useId();
  const cue = {
    enter: 0.2,
    burst: 1.1,
    sort: 1.9,
    window: 3.5,
    ui: 3.8,
    polish: 5.4,
    stamp: 7.0,
    dim: 7.4,
    wide: 7.9,
    end: 9.6,
  };
  const cut = reel('relay-shape', cue.end);
  const camera = cut.track(
    [
      [0, WIDE],
      [cue.sort - 0.3, WIDE],
      [cue.sort + 0.6, shot(260, 270, 1.25)],
      [cue.ui - 0.3, shot(260, 270, 1.25)],
      [cue.ui + 0.5, shot(680, 270, 1.2)],
      [cue.stamp + 0.6, shot(680, 270, 1.2)],
      [cue.wide + 1, WIDE],
    ],
    GLIDE,
  );
  // 九张需求便签：先缠成一团，再理成三列
  const notes = Array.from({ length: 9 }, (_, i) => ({
    gx: 100 + (i % 3) * 96,
    gy: 150 + Math.floor(i / 3) * 62,
    tx: 170 + ((i * 97) % 260),
    ty: 140 + ((i * 61) % 260),
    rot: ((i * 37) % 30) - 15,
  }));
  const tangles: [number, number][] = [
    [0, 5],
    [1, 7],
    [2, 4],
    [3, 8],
    [6, 1],
    [4, 0],
  ];
  // 界面线框里的七块，和它们从哪张便签来
  const blocks = [
    { x: 590, y: 144, w: 180, h: 10, r: 5, kind: 'title' },
    { x: 590, y: 168, w: 280, h: 40, r: 10, kind: 'field' },
    { x: 590, y: 224, w: 134, h: 86, r: 10, kind: 'field' },
    { x: 736, y: 224, w: 134, h: 86, r: 10, kind: 'field' },
    { x: 590, y: 324, w: 280, h: 30, r: 8, kind: 'field' },
    { x: 590, y: 362, w: 220, h: 30, r: 8, kind: 'field' },
    { x: 780, y: 404, w: 90, h: 30, r: 15, kind: 'button' },
  ];
  const uiAt = (k: number) => cue.ui + k * 0.18;
  // 线框里歪歪扭扭的字条，和理直之后的样子
  const lines = [
    { x: 604, y: 244, rough: [96, 70], clean: [90, 58], rot: [-4, 3] },
    { x: 750, y: 244, rough: [88, 64], clean: [84, 52], rot: [3, -3] },
    { x: 604, y: 336, rough: [170, 0], clean: [150, 0], rot: [-2, 0] },
    { x: 604, y: 374, rough: [130, 0], clean: [112, 0], rot: [2, 0] },
  ];
  const polishAt = (k: number) => cue.polish + k * 0.3;

  const product = cut.track(
    walk([
      [cue.sort - 0.4, -160, 420],
      [cue.sort, 330, 330],
      [cue.sort + 0.8, 250, 230],
      [cue.ui - 0.2, 380, 300],
      ...blocks.map((b, k): [number, number, number] => [
        uiAt(k),
        b.x + Math.min(b.w - 10, 40),
        b.y + b.h / 2 + 4,
      ]),
      [uiAt(6) + 0.6, 420, 470],
    ]),
    GLIDE,
  );
  const writer = cut.track(
    walk([
      [cue.polish - 0.6, 1100, 300],
      ...lines.map((l, k): [number, number, number] => [
        polishAt(k),
        l.x + l.clean[0] - 6,
        l.y + 4,
      ]),
      [polishAt(3) + 0.6, 700, 478],
    ]),
    GLIDE,
  );
  const architect = cut.track(
    walk([
      [cue.stamp - 0.7, 1100, 120],
      [cue.stamp, 878, 112],
      [cue.stamp + 0.3, 878, 112],
      [cue.stamp + 1, 520, 30],
    ]),
    GLIDE,
  );

  const art = (
    <>
      <Shadow id={shadow} />
      {/* 杏色小卡从左边飞进来，一抖散开 */}
      <g
        className={`m-film-carry ${cut.track(
          [
            [
              cue.enter,
              'opacity:1;transform:translate(-350px,0px) rotate(-8deg) scale(1)',
            ],
            [
              cue.enter + 0.8,
              'opacity:1;transform:translate(0px,0px) rotate(0deg) scale(1)',
            ],
            [
              cue.burst,
              'opacity:1;transform:translate(0px,0px) rotate(0deg) scale(1)',
            ],
            [
              cue.burst + 0.25,
              'opacity:0;transform:translate(0px,0px) rotate(0deg) scale(1.2)',
            ],
          ],
          GLIDE,
        )}`}
        filter={`url(#${shadow})`}
      >
        <Baton x={190} y={220} />
      </g>
      {tangles.map(([a, b], k) => {
        const A = notes[a];
        const B = notes[b];
        return (
          <path
            key={k}
            className={`m-relay-tangle ${cut.track([
              [cue.burst + 0.3, 'opacity:0;stroke-dashoffset:1'],
              [cue.burst + 0.8, 'opacity:1;stroke-dashoffset:0'],
              [cue.sort + k * 0.1, 'opacity:1;stroke-dashoffset:0'],
              [cue.sort + k * 0.1 + 0.3, 'opacity:0;stroke-dashoffset:0'],
            ])}`}
            pathLength={1}
            d={`M${A.tx + 40} ${A.ty + 22} C${A.tx + 160} ${A.ty - 60} ${B.tx - 80} ${B.ty + 110} ${B.tx + 40} ${B.ty + 22}`}
          />
        );
      })}
      {notes.map((n, i) => (
        <g
          key={i}
          className={`m-film-carry ${cut.track(
            [
              [
                cue.burst + i * 0.03,
                `opacity:0;transform:translate(${238 - n.gx - 40}px,${250 - n.gy - 22}px) rotate(0deg) scale(.3)`,
              ],
              [
                cue.burst + 0.4 + i * 0.03,
                `opacity:1;transform:translate(${n.tx - n.gx}px,${n.ty - n.gy}px) rotate(${n.rot}deg) scale(1)`,
              ],
              [
                cue.sort + i * 0.08,
                `opacity:1;transform:translate(${n.tx - n.gx}px,${n.ty - n.gy}px) rotate(${n.rot}deg) scale(1)`,
              ],
              [
                cue.sort + i * 0.08 + 0.7,
                'opacity:1;transform:translate(0px,0px) rotate(0deg) scale(1)',
              ],
              [
                cue.dim,
                'opacity:1;transform:translate(0px,0px) rotate(0deg) scale(1)',
              ],
              [
                cue.dim + 0.5,
                'opacity:.45;transform:translate(0px,0px) rotate(0deg) scale(1)',
              ],
            ],
            GLIDE,
          )}`}
        >
          <g filter={`url(#${shadow})`}>
            <rect
              className="m-relay-note"
              x={n.gx}
              y={n.gy}
              width="80"
              height="44"
              rx="6"
            />
          </g>
          <rect
            className="m-relay-t1"
            x={n.gx + 12}
            y={n.gy + 14}
            width={30 + ((i * 13) % 26)}
            height="5"
            rx="2.5"
          />
          <rect
            className="m-relay-t0"
            x={n.gx + 12}
            y={n.gy + 26}
            width={22 + ((i * 17) % 30)}
            height="5"
            rx="2.5"
          />
          {i < blocks.length ? (
            <rect
              className={`m-relay-flash ${cut.track([
                [uiAt(i), 'opacity:0'],
                [uiAt(i) + 0.1, 'opacity:1'],
                [uiAt(i) + 0.6, 'opacity:0'],
              ])}`}
              x={n.gx - 2}
              y={n.gy - 2}
              width="84"
              height="48"
              rx="8"
            />
          ) : null}
        </g>
      ))}
      {[0, 1, 2].map((c) => (
        <rect
          key={c}
          className={`m-relay-t2 m-film-pop ${cut.track(pop(cue.sort + 0.9 + c * 0.08, 0.3))}`}
          x={100 + c * 96}
          y={128}
          width="46"
          height="6"
          rx="3"
        />
      ))}

      {/* 拼出来的界面线框 */}
      <g className={`m-film-pop ${cut.track(open(cue.window))}`}>
        <Paper
          shadow={shadow}
          x={470}
          y={90}
          width={420}
          height={360}
          rx={14}
        />
        <path className="m-k-cell" d="M470 124 H890 M570 124 V450" />
        {[490, 502, 514].map((cx) => (
          <circle key={cx} className="m-k-light" cx={cx} cy="107" r="3.5" />
        ))}
        <rect
          className="m-relay-t1"
          x="490"
          y="150"
          width="58"
          height="5"
          rx="2.5"
        />
        <rect
          className="m-relay-t0"
          x="490"
          y="170"
          width="46"
          height="5"
          rx="2.5"
        />
        <rect
          className="m-relay-t0"
          x="490"
          y="190"
          width="52"
          height="5"
          rx="2.5"
        />
      </g>
      {blocks.map((b, k) => (
        <rect
          key={k}
          className={`m-relay-block m-film-pop ${cut.track(pop(uiAt(k), 0.35))}`}
          data-kind={b.kind}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={b.r}
        />
      ))}
      {lines.map((l, k) => (
        <g key={k}>
          <g
            className={cut.track([
              [uiAt(2 + Math.min(k, 3)) + 0.2, 'opacity:0'],
              [uiAt(2 + Math.min(k, 3)) + 0.5, 'opacity:1'],
              [polishAt(k), 'opacity:1'],
              [polishAt(k) + 0.3, 'opacity:0'],
            ])}
          >
            {l.rough.map((w, j) =>
              w ? (
                <rect
                  key={j}
                  className="m-relay-t1"
                  x={l.x}
                  y={l.y + j * 16}
                  width={w}
                  height="6"
                  rx="3"
                  transform={`rotate(${l.rot[j]} ${l.x} ${l.y + j * 16})`}
                />
              ) : null,
            )}
          </g>
          <g
            className={cut.track([
              [polishAt(k), 'opacity:0;transform:translateY(3px)'],
              [polishAt(k) + 0.4, 'opacity:1;transform:none'],
            ])}
          >
            {l.clean.map((w, j) =>
              w ? (
                <rect
                  key={j}
                  className="m-relay-t2"
                  x={l.x}
                  y={l.y + j * 16}
                  width={w}
                  height="6"
                  rx="3"
                />
              ) : null,
            )}
          </g>
        </g>
      ))}
      <rect
        className={`m-relay-t-on m-film-pop ${cut.track(pop(uiAt(6) + 0.2, 0.3))}`}
        x="802"
        y="416"
        width="46"
        height="6"
        rx="3"
      />
      <g className={`m-film-pop ${cut.track(pop(cue.stamp, 0.4))}`}>
        <circle className="m-film-ok" cx="874" cy="106" r="15" />
        <path className="m-k-tick" d="M867.5 106 l4.5 4.5 l8 -9" />
      </g>
      <circle
        className={`m-film-ring m-film-pop ${cut.track(ping(cue.stamp))}`}
        cx="874"
        cy="106"
        r="22"
      />
    </>
  );
  const overlay = (
    <>
      <Actor proof="product" className={product} />
      <Actor proof="writing" tone="deep" className={writer} />
      <Actor proof="arch" className={architect} />
    </>
  );
  return <Screen cut={cut} camera={camera} art={art} overlay={overlay} />;
}

/* ================================ 工程实现：做出来 ================================ */
const WIRES = [
  'M370 220 H420 A12 12 0 0 1 432 232 V303 A12 12 0 0 0 444 315 H480',
  'M610 315 H638 A12 12 0 0 0 650 303 V237 A12 12 0 0 1 662 225 H690',
  'M610 145 H743 A12 12 0 0 1 755 157 V190',
];
function Build() {
  const shadow = useId();
  const grid = useId();
  const cue = {
    enter: 0.2,
    grid: 1.1,
    drag: 1.4,
    wires: 4.0,
    flow: 5.6,
    code: 5.8,
    run: 6.9,
    real: 7.9,
    wide: 8.9,
    end: 10.2,
  };
  const cut = reel('relay-build', cue.end);
  const camera = cut.track(
    [
      [0, WIDE],
      [cue.grid, WIDE],
      [cue.drag + 0.4, shot(660, 230, 1.2)],
      [cue.wires - 0.2, shot(660, 230, 1.2)],
      [cue.wires + 0.6, shot(520, 250, 1.12)],
      [cue.code - 0.2, shot(520, 250, 1.12)],
      [cue.code + 0.6, shot(670, 400, 1.3)],
      [cue.real - 0.3, shot(670, 400, 1.3)],
      [cue.real + 0.5, shot(220, 220, 1.4)],
      [cue.wide, shot(220, 220, 1.4)],
      [cue.wide + 1, WIDE],
    ],
    GLIDE,
  );
  // 三块：知识库、模型、接口；核心研发架构一块块从右边拖上网格
  const parts = [
    { x: 480, y: 110, kind: 'db' },
    { x: 690, y: 190, kind: 'chip' },
    { x: 480, y: 280, kind: 'api' },
  ];
  const dragAt = (k: number) => cue.drag + k * 0.9;
  const architect = cut.track(
    walk([
      [cue.drag - 0.3, 1010, 120],
      ...parts.flatMap((p, k): [number, number, number][] => [
        [dragAt(k), 1010, p.y + 10],
        [dragAt(k) + 0.6, p.x + 120, p.y + 10],
        ...(k < parts.length - 1
          ? ([[dragAt(k) + 0.85, 1010, parts[k + 1].y + 10]] as [
              number,
              number,
              number,
            ][])
          : []),
      ]),
      [dragAt(2) + 1.2, 640, 64],
    ]),
    GLIDE,
  );
  const systems = cut.track(
    walk([
      [cue.wires - 0.5, -160, 330],
      [cue.wires, 372, 222],
      [cue.wires + 0.5, 482, 318],
      [cue.wires + 1, 692, 228],
      [cue.wires + 1.4, 612, 148],
      [cue.wires + 1.8, 757, 192],
      [cue.flow + 0.4, 100, 372],
    ]),
    GLIDE,
  );
  const coder = cut.track(
    walk([
      [cue.code - 0.2, 600, 620],
      [cue.code + 0.4, 470, 470],
      [cue.run, 760, 462],
      [cue.run + 0.7, 880, 500],
      [cue.real, 880, 500],
      [cue.real + 0.8, 260, 452],
    ]),
    GLIDE,
  );
  const code = [180, 240, 150, 210, 120];

  const art = (
    <>
      <Shadow id={shadow} />
      <defs>
        <pattern id={grid} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" className="m-relay-grid-dot" />
        </pattern>
      </defs>
      {/* 线框从左边滑进来（还是虚线的草图） */}
      <g
        className={cut.track(
          [
            [cue.enter, 'transform:translate(-420px,0px)'],
            [cue.enter + 0.8, 'transform:translate(0px,0px)'],
          ],
          GLIDE,
        )}
      >
        <rect
          className={`m-relay-sketch ${cut.track([
            [cue.real, 'opacity:1'],
            [cue.real + 0.4, 'opacity:0'],
          ])}`}
          x="70"
          y="110"
          width="300"
          height="220"
          rx="12"
        />
        <g
          className={cut.track(fade(cue.real, 0.6))}
          filter={`url(#${shadow})`}
        >
          <rect
            className="m-k-paper"
            x="70"
            y="110"
            width="300"
            height="220"
            rx="12"
          />
        </g>
        <path className="m-k-cell" d="M70 134 H370 M140 134 V330" />
        <rect
          className="m-relay-t1"
          x="84"
          y="150"
          width="40"
          height="4"
          rx="2"
        />
        <rect
          className="m-relay-t0"
          x="84"
          y="164"
          width="34"
          height="4"
          rx="2"
        />
        <rect
          className="m-relay-t2"
          x="154"
          y="148"
          width="110"
          height="7"
          rx="3.5"
        />
        <rect
          className="m-relay-block"
          data-kind="field"
          x="154"
          y="166"
          width="200"
          height="30"
          rx="8"
        />
        <rect
          className="m-relay-block"
          data-kind="field"
          x="154"
          y="206"
          width="96"
          height="62"
          rx="8"
        />
        <rect
          className="m-relay-block"
          data-kind="field"
          x="258"
          y="206"
          width="96"
          height="62"
          rx="8"
        />
        <rect
          className="m-relay-block"
          data-kind="button"
          x="290"
          y="284"
          width="64"
          height="26"
          rx="13"
        />
        <rect
          className={`m-relay-real ${cut.track(fade(cue.real + 0.2, 0.5))}`}
          x="290"
          y="284"
          width="64"
          height="26"
          rx="13"
        />
        <circle
          className={`m-relay-live m-film-pop ${cut.track(pop(cue.real + 0.4, 0.3))}`}
          cx="352"
          cy="122"
          r="4.5"
        />
      </g>
      <circle
        className={`m-film-ring m-film-pop ${cut.track(ping(cue.real + 0.5))}`}
        cx="352"
        cy="122"
        r="12"
      />
      <circle
        className={`m-film-ring m-film-pop ${cut.track(ping(cue.real + 1.3))}`}
        cx="352"
        cy="122"
        r="12"
      />

      <rect
        className={cut.track(fade(cue.grid, 0.5))}
        x="440"
        y="80"
        width="460"
        height="300"
        rx="16"
        fill={`url(#${grid})`}
      />
      {WIRES.map((d, k) => (
        <path
          key={d}
          className={`m-relay-wire ${cut.track(draw(cue.wires + k * 0.5, 0.5))}`}
          pathLength={1}
          d={d}
        />
      ))}
      {WIRES.map((d, k) => (
        <circle
          key={`p${d}`}
          className={`m-relay-packet ${cut.track(fade(cue.flow, 0.4))}`}
          r="4"
        >
          <animateMotion
            dur="2.2s"
            begin={`${-k * 0.7}s`}
            repeatCount="indefinite"
            path={d}
          />
        </circle>
      ))}
      {parts.map((p, k) => (
        <g
          key={p.kind}
          className={cut.track(
            [
              // 拖进来之前不露头
              [
                dragAt(k) - 0.05,
                `opacity:0;transform:translate(${1010 - p.x - 120}px,0px)`,
              ],
              [
                dragAt(k),
                `opacity:1;transform:translate(${1010 - p.x - 120}px,0px)`,
              ],
              [dragAt(k) + 0.6, 'opacity:1;transform:translate(0px,0px)'],
            ],
            GLIDE,
          )}
        >
          <g filter={`url(#${shadow})`}>
            <rect
              className="m-k-paper"
              x={p.x}
              y={p.y}
              width="130"
              height="70"
              rx="12"
            />
          </g>
          <g className="m-relay-icon">
            {p.kind === 'db' ? (
              <>
                <ellipse cx={p.x + 26} cy={p.y + 24} rx="11" ry="4" />
                <path
                  d={`M${p.x + 15} ${p.y + 24} V${p.y + 44} A11 4 0 0 0 ${p.x + 37} ${p.y + 44} V${p.y + 24} M${p.x + 15} ${p.y + 34} A11 4 0 0 0 ${p.x + 37} ${p.y + 34}`}
                />
              </>
            ) : null}
            {p.kind === 'chip' ? (
              <>
                <rect x={p.x + 16} y={p.y + 24} width="22" height="22" rx="5" />
                <path
                  d={`M${p.x + 22} ${p.y + 19} v5 M${p.x + 32} ${p.y + 19} v5 M${p.x + 22} ${p.y + 46} v5 M${p.x + 32} ${p.y + 46} v5`}
                />
              </>
            ) : null}
            {p.kind === 'api' ? (
              <path
                d={`M${p.x + 24} ${p.y + 22} q-6 0 -6 6 v4 q0 3 -4 3 q4 0 4 3 v4 q0 6 6 6 M${p.x + 34} ${p.y + 22} q6 0 6 6 v4 q0 3 4 3 q-4 0 -4 3 v4 q0 6 -6 6`}
              />
            ) : null}
          </g>
          <rect
            className="m-relay-t2"
            x={p.x + 52}
            y={p.y + 26}
            width="56"
            height="6"
            rx="3"
          />
          <rect
            className="m-relay-t0"
            x={p.x + 52}
            y={p.y + 40}
            width="42"
            height="5"
            rx="2.5"
          />
        </g>
      ))}

      {/* AI Coding：一块代码，几行打出来，进度条走满 */}
      <g className={`m-film-pop ${cut.track(open(cue.code))}`}>
        <Paper
          shadow={shadow}
          x={440}
          y={400}
          width={460}
          height={112}
          rx={12}
        />
      </g>
      {code.map((w, k) => (
        <rect
          key={k}
          className={`${k % 2 ? 'm-relay-code-hot' : 'm-relay-t1'} m-relay-type ${cut.track(
            [
              [cue.code + 0.3 + k * 0.16, 'transform:scaleX(0)'],
              [cue.code + 0.3 + k * 0.16 + 0.3, 'transform:scaleX(1)'],
            ],
            'linear',
          )}`}
          x={464 + (k === 2 || k === 3 ? 18 : 0)}
          y={416 + k * 14}
          width={w}
          height="6"
          rx="3"
        />
      ))}
      <rect
        className="m-relay-track"
        x="464"
        y="494"
        width="412"
        height="4"
        rx="2"
      />
      <rect
        className={`m-relay-fill m-relay-type ${cut.track(
          [
            [cue.run, 'transform:scaleX(0)'],
            [cue.run + 0.8, 'transform:scaleX(1)'],
          ],
          GLIDE,
        )}`}
        x="464"
        y="494"
        width="412"
        height="4"
        rx="2"
      />
    </>
  );
  const overlay = (
    <>
      <Actor proof="arch" className={architect} />
      <Actor proof="systems" tone="deep" className={systems} />
      <Actor proof="coding" className={coder} />
    </>
  );
  return <Screen cut={cut} camera={camera} art={art} overlay={overlay} />;
}

/* ================================ 使用者的处境：用顺 ================================ */
const BUMPS = [300, 520, 700];
function Use() {
  const shadow = useId();
  const cue = {
    enter: 0.2,
    line: 1.2,
    walk: 1.6,
    collect: 3.6,
    flow: 5.4,
    book: 7.2,
    flat: 8.3,
    wide: 9.4,
    end: 10.6,
  };
  const cut = reel('relay-use', cue.end);
  const camera = cut.track(
    [
      [0, WIDE],
      [cue.line + 0.2, WIDE],
      [cue.walk + 0.6, shot(480, 400, 1.2)],
      [cue.collect - 0.2, shot(480, 400, 1.2)],
      [cue.collect + 0.6, shot(640, 260, 1.15)],
      [cue.book - 0.3, shot(640, 260, 1.15)],
      [cue.book + 0.5, shot(400, 240, 1.25)],
      [cue.flat - 0.2, shot(400, 240, 1.25)],
      [cue.flat + 0.5, shot(480, 380, 1.15)],
      [cue.wide, shot(480, 380, 1.15)],
      [cue.wide + 1, WIDE],
    ],
    GLIDE,
  );
  const passAt = (x: number) => cue.walk + ((x - 100) / 760) * 2.2;
  const collectAt = (k: number) => cue.collect + k * 0.5;
  const chips = [560, 640, 720, 800];
  const ops = cut.track(
    walk([
      [cue.collect - 0.5, 1100, 420],
      ...BUMPS.map((x, k): [number, number, number] => [
        collectAt(k) - 0.15,
        x + 4,
        436,
      ]),
      [collectAt(2) + 0.7, 880, 170],
      [cue.flow, 880, 170],
      [cue.flow + 0.8, 180, 330],
    ]),
    GLIDE,
  );
  const flow = cut.track(
    walk([
      [cue.flow - 0.4, -160, 300],
      [cue.flow, 652, 292],
      [cue.flow + 0.6, 732, 292],
      [cue.flow + 1.1, 812, 292],
      [cue.flow + 1.5, 732, 292],
      [cue.flow + 2.2, 700, 340],
    ]),
    GLIDE,
  );
  const teacher = cut.track(
    walk([
      [cue.book - 0.1, 1010, 380],
      [cue.book + 0.7, 512, 268],
      [cue.book + 1.2, 512, 268],
      [cue.book + 1.8, 450, 330],
    ]),
    GLIDE,
  );

  const art = (
    <>
      <Shadow id={shadow} />
      {/* 跑起来的界面到了一个人手里 */}
      <g
        className={cut.track(
          [
            [cue.enter, 'transform:translate(-400px,0px)'],
            [cue.enter + 0.8, 'transform:translate(0px,0px)'],
          ],
          GLIDE,
        )}
      >
        <Paper
          shadow={shadow}
          x={80}
          y={110}
          width={260}
          height={180}
          rx={12}
        />
        <path className="m-k-cell" d="M80 132 H340 M140 132 V290" />
        <rect
          className="m-relay-t2"
          x="152"
          y="146"
          width="96"
          height="6"
          rx="3"
        />
        <rect
          className="m-relay-block"
          data-kind="field"
          x="152"
          y="162"
          width="174"
          height="26"
          rx="7"
        />
        <rect
          className="m-relay-block"
          data-kind="field"
          x="152"
          y="196"
          width="84"
          height="52"
          rx="7"
        />
        <rect
          className="m-relay-block"
          data-kind="field"
          x="242"
          y="196"
          width="84"
          height="52"
          rx="7"
        />
        <rect
          className="m-relay-real"
          x="270"
          y="258"
          width="56"
          height="22"
          rx="11"
        />
        <circle className="m-relay-live" cx="326" cy="121" r="4" />
      </g>
      <g className={`m-film-pop ${cut.track(pop(cue.enter + 0.7, 0.4))}`}>
        <circle className="m-relay-badge" cx="410" cy="200" r="36" />
        <circle className="m-relay-person" cx="410" cy="190" r="11" />
        <path
          className="m-relay-person"
          d="M389 222 C391 207 429 207 431 222"
        />
      </g>
      <g className={`m-film-pop ${cut.track(pop(cue.book + 0.9, 0.35))}`}>
        <circle className="m-relay-check" cx="437" cy="172" r="11" />
        <path className="m-relay-check-mark" d="M432 172 l3.5 3.5 l6.5 -7" />
      </g>

      {/* 时间线：用的时候鼓起三个包，最后一个个抹平 */}
      <path
        className={`m-relay-axis ${cut.track(draw(cue.line, 0.6))}`}
        pathLength={1}
        d="M100 450 H860"
      />
      <path
        className={`m-relay-smooth ${cut.track(draw(cue.flat + 0.8, 1))}`}
        pathLength={1}
        d="M100 450 H860"
      />
      {BUMPS.map((x, k) => (
        <path
          key={x}
          className={`m-relay-bump m-relay-rise ${cut.track([
            [passAt(x), 'transform:scaleY(0)'],
            [passAt(x) + 0.3, 'transform:scaleY(1)'],
            [cue.flat + k * 0.2, 'transform:scaleY(1)'],
            [cue.flat + k * 0.2 + 0.4, 'transform:scaleY(0)'],
          ])}`}
          d={`M${x - 22} 450 Q${x} 404 ${x + 22} 450`}
        />
      ))}
      <circle
        className={`m-relay-walker ${cut.track(
          [
            [cue.walk, 'opacity:0;transform:translateX(0px)'],
            [cue.walk + 0.1, 'opacity:1;transform:translateX(0px)'],
            [cue.walk + 2.2, 'opacity:1;transform:translateX(760px)'],
            [cue.walk + 2.4, 'opacity:0;transform:translateX(760px)'],
            [cue.flat + 0.6, 'opacity:0;transform:translateX(0px)'],
            [cue.flat + 0.7, 'opacity:1;transform:translateX(0px)'],
            [cue.flat + 1.9, 'opacity:1;transform:translateX(760px)'],
            [cue.flat + 2.1, 'opacity:0;transform:translateX(760px)'],
          ],
          'linear',
        )}`}
        cx="100"
        cy="450"
        r="6"
      />

      {/* 三条反馈收到右上角 */}
      {BUMPS.map((x, k) => {
        const y = 96 + k * 52;
        return (
          <g
            key={x}
            className={cut.track(
              [
                [
                  collectAt(k),
                  `opacity:0;transform:translate(${x - 560}px,${430 - y}px) scale(.3)`,
                ],
                [
                  collectAt(k) + 0.6,
                  'opacity:1;transform:translate(0px,0px) scale(1)',
                ],
              ],
              GLIDE,
            )}
          >
            <g filter={`url(#${shadow})`}>
              <rect
                className="m-k-paper"
                x="560"
                y={y}
                width="300"
                height="38"
                rx="19"
              />
            </g>
            <circle className="m-relay-dot-hot" cx="580" cy={y + 19} r="4.5" />
            <rect
              className="m-relay-t1"
              x="594"
              y={y + 16}
              width={150 + k * 30}
              height="6"
              rx="3"
            />
          </g>
        );
      })}

      {/* 流程里的四步：两步对调，再合并 */}
      {chips.map((x, k) => {
        const frames: Frame[] = [
          [cue.flow - 0.4, HIDE],
          [cue.flow - 0.1, SHOW],
        ];
        if (k === 1)
          frames.push(
            [cue.flow + 0.4, 'opacity:1;transform:translateX(0px)'],
            [cue.flow + 0.9, 'opacity:1;transform:translateX(80px)'],
          );
        if (k === 2)
          frames.push(
            [cue.flow + 0.4, 'opacity:1;transform:translateX(0px)'],
            [cue.flow + 0.9, 'opacity:1;transform:translateX(-80px)'],
          );
        if (k === 3)
          frames.push(
            [cue.flow + 1.1, 'opacity:1;transform:translateX(0px)'],
            [cue.flow + 1.5, 'opacity:0;transform:translateX(-80px)'],
          );
        return (
          <g key={x} className={`m-film-pop ${cut.track(frames, GLIDE)}`}>
            <rect
              className="m-relay-block"
              data-kind="field"
              x={x}
              y="275"
              width="70"
              height="34"
              rx="17"
            />
            <rect
              className="m-relay-t1"
              x={x + 16}
              y="289"
              width={38 - k * 4}
              height="6"
              rx="3"
            />
          </g>
        );
      })}
      <rect
        className={`m-relay-merged ${cut.track(fade(cue.flow + 1.5, 0.4))}`}
        x="640"
        y="275"
        width="70"
        height="34"
        rx="17"
      />
      <path
        className={`m-relay-axis ${cut.track(draw(cue.flow, 0.6))}`}
        pathLength={1}
        d="M630 292 H640 M710 292 H720 M790 292 H800"
      />

      {/* 讲师递过去的小手册 */}
      <g
        className={cut.track(
          [
            [cue.book, 'opacity:0;transform:translate(500px,110px)'],
            [cue.book + 0.1, 'opacity:1;transform:translate(500px,110px)'],
            [cue.book + 0.8, 'opacity:1;transform:translate(0px,0px)'],
          ],
          GLIDE,
        )}
      >
        <g filter={`url(#${shadow})`}>
          <rect
            className="m-k-paper"
            x="450"
            y="232"
            width="60"
            height="46"
            rx="8"
          />
        </g>
        <path
          className="m-relay-icon"
          d="M462 244 H480 V266 H462 Z M480 244 H498 V266 H480 M466 251 H476 M484 251 H494 M466 258 H474 M484 258 H492"
        />
      </g>
    </>
  );
  const overlay = (
    <>
      <Actor proof="ops" className={ops} />
      <Actor proof="workflow" tone="deep" className={flow} />
      <Actor proof="talks" className={teacher} />
    </>
  );
  return <Screen cut={cut} camera={camera} art={art} overlay={overlay} />;
}

export function Relay({ id }: { id: View['id'] }): ReactNode {
  if (id === 'business') return <Find />;
  if (id === 'product') return <Shape />;
  if (id === 'engineering') return <Build />;
  return <Use />;
}
