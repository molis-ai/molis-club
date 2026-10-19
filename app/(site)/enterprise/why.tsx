'use client';
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { enterprise } from '../../../content/site/enterprise';
import { TEAM } from '../../_site/routes';
import { More, Phrases, type Vars } from '../../_site/ui';
import { Shadow } from './keeps';

// 为什么我们可以（负责人 2026-10-20：「以更高的标准」重做——同一段业务，四个位置看；第二版：思路对，画得太粗糙，重画）。
// 把 5.5 导语演出来：画面主角是「一段业务」，五张步骤卡排成一行流程，第四张是杏色——那个值得做的环节。
// 往下滚，整屏钉住，同一段业务换成四个位置眼里的样子；杏色那块是同一个 HTML 块，在四种样子之间变形过去：
//   业务目标——一张图表，杏色那根柱子越过目标线；产品体验——一个应用窗口，杏色那块是主按钮；
//   工程实现——四个系统用圆角折线连到中间那个服务，数据沿线流进去；使用者的处境——一个人和他一天里的几个时刻，杏色那条是他在等的那一刻。
// 每种样子是一组白卡片（细线、淡暖影子、浅色字条、线描小图标），进场时一张张浮上来、线画出来、柱子长起来。
// 上一屏那只「Molis」光标：还没钉住时是一只，钉住后分成四只、名牌是四个位置，站在画板四角；轮到谁，只留谁去指着杏色那块。
// 最后一拍：四种样子缩成四张小画排成 2×2，杏色块一起轻轻亮一下；那块杏色变成正中一枚「一段业务」小签——四个位置围着同一段业务（导语第二句）。
// 左边一列四个位置（01–04）：小标题一直在，轮到的那项展开成员经历；最后一拍收成导语第二句和成员经历里的公司。
// 「不代表固定分工、不是客户项目」那句常驻页脚。成员姓名不上（负责人未定）。
// 宽屏（≥1000 宽、≥600 高）有 JS 时才钉住；手机、矮屏、没有 JS 时四项上下排，每项一张定格的小画，字全展开。
// 减少动态：照样一拍一拍换，只是没有过渡、流动和数数。

const { why } = enterprise;
const VIEWS = why.views;
/** 0 一段业务；1–4 四个位置；5 一起看 */
const BEATS = VIEWS.length + 2;
const LAST = BEATS - 1;
/** 成员经历里出现过的公司，按第一次出现的顺序 */
const ORGS = [...new Set(VIEWS.flatMap((view) => view.orgs))];

/* ---------- 画板：900 × 600 ---------- */
const W = 900;
const H = 600;
type Box = [x: number, y: number, w: number, h: number, r: number];
/** 杏色那块在每种样子里的位置；最后一拍是正中那枚小签 */
const HOT: Box[] = [
  [544, 250, 132, 92, 14],
  [534, 230, 40, 210, 6],
  [602, 436, 140, 46, 23],
  [366, 252, 168, 96, 16],
  [458, 258, 300, 64, 24],
  [385, 280, 130, 40, 20],
];
const middle = ([x, y, w, h]: Box) => ({ x: x + w / 2, y: y + h / 2 });

/** 最后一拍：四张小画 2×2，和光标站的角一样，顺时针 */
const MINI = 0.43;
const MINI_AT = [
  { x: 45, y: 24 },
  { x: 468, y: 24 },
  { x: 468, y: 318 },
  { x: 45, y: 318 },
];
const MINI_HOT = VIEWS.map((_, i) => {
  const at = MINI_AT[i];
  const hot = middle(HOT[i + 1]);
  return { x: at.x + hot.x * MINI, y: at.y + hot.y * MINI };
});

/** 光标：四角；轮到谁，谁去指着杏色那块 */
const CORNERS = [
  { x: 36, y: 34 },
  { x: 752, y: 34 },
  { x: 752, y: 548 },
  { x: 36, y: 548 },
];
const LOOK = [
  { x: 566, y: 248 },
  { x: 706, y: 472 },
  { x: 506, y: 334 },
  { x: 716, y: 312 },
];
/** 还没钉住时：上一屏那只 Molis，停在流程下面 */
const ALONE = { x: 690, y: 384 };

const pct = (n: number, of: number) => `${Math.round((n / of) * 100000) / 1000}%`;
const cqw = (n: number) => `${Math.round((n / W) * 100000) / 1000}cqw`;
/** 一张张浮上来的先后 */
const at = (n: number) => ({ '--d': `${n * 0.06}s` }) as Vars;

/* ---------- 画法里的几样零件 ---------- */
/** 一张白卡片：细线、淡暖影子 */
function Card({
  shadow,
  x,
  y,
  w,
  h,
  r = 12,
  n = 0,
}: {
  shadow: string;
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  n?: number;
}) {
  return (
    <g className="m-why-in" style={at(n)} filter={`url(#${shadow})`}>
      <rect className="m-why-card" x={x} y={y} width={w} height={h} rx={r} />
    </g>
  );
}
/** 字条：深浅三档 */
function Bar({
  x,
  y,
  w,
  h = 6,
  tone = 1,
  n = 0,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  tone?: 0 | 1 | 2;
  n?: number;
}) {
  return (
    <rect
      className={`m-why-in m-why-t${tone}`}
      style={at(n)}
      x={x}
      y={y}
      width={w}
      height={h}
      rx={h / 2}
    />
  );
}
/** 杏色那块的定格版本（小画里用；会动的画板上它是 HTML 块） */
function Hot({ lens }: { lens: number }) {
  const [x, y, w, h, r] = HOT[lens];
  return (
    <g className="m-why-in" style={at(4)}>
      <rect className="m-why-hot-shape" x={x} y={y} width={w} height={h} rx={r} />
      {lens === 0 ? (
        <>
          <circle className="m-why-hot-ink" cx={x + 28} cy={y + 26} r="6" />
          <rect className="m-why-hot-ink" x={x + 42} y={y + 22.5} width="64" height="7" rx="3.5" />
          <rect className="m-why-hot-soft" x={x + 22} y={y + 48} width="96" height="6" rx="3" />
          <rect className="m-why-hot-soft" x={x + 22} y={y + 64} width="66" height="6" rx="3" />
        </>
      ) : null}
      {lens === 2 ? (
        <>
          <path className="m-why-hot-line" d={`M${x + 30} ${y + 15} l2.4 6.6 l6.6 2.4 l-6.6 2.4 l-2.4 6.6 l-2.4 -6.6 l-6.6 -2.4 l6.6 -2.4 Z`} />
          <rect className="m-why-hot-ink" x={x + 48} y={y + 20} width="64" height="6" rx="3" />
        </>
      ) : null}
      {lens === 3 ? (
        <>
          <rect className="m-why-hot-line" x={x + 24} y={y + 32} width="32" height="32" rx="7" />
          <path className="m-why-hot-line" d={`M${x + 32} ${y + 26} v6 M${x + 40} ${y + 26} v6 M${x + 48} ${y + 26} v6 M${x + 32} ${y + 64} v6 M${x + 40} ${y + 64} v6 M${x + 48} ${y + 64} v6`} />
          <rect className="m-why-hot-ink" x={x + 72} y={y + 36} width="64" height="7" rx="3.5" />
          <rect className="m-why-hot-soft" x={x + 72} y={y + 53} width="48" height="5" rx="2.5" />
        </>
      ) : null}
      {lens === 4
        ? [0, 1, 2].map((k) => (
            <circle key={k} className="m-why-hot-ink" cx={x + 34 + k * 18} cy={y + h / 2} r="5" />
          ))
        : null}
    </g>
  );
}

/* ---------- 五种样子 ---------- */
/** 一段业务：五张步骤卡排成一行，下面一道括线 */
function Flow({ shadow, still }: { shadow: string; still?: boolean }) {
  const xs = [130, 290, 450, 610, 770];
  return (
    <>
      {xs.map((cx, i) =>
        i === 3 ? null : (
          <g key={cx}>
            <Card shadow={shadow} x={cx - 66} y={250} w={132} h={92} r={14} n={i} />
            <circle className="m-why-in m-why-t1" style={at(i + 1)} cx={cx - 38} cy={276} r="6" />
            <Bar x={cx - 24} y={272.5} w={64} h={7} tone={2} n={i + 1} />
            <Bar x={cx - 44} y={298} w={96} tone={0} n={i + 1} />
            <Bar x={cx - 44} y={314} w={66} tone={0} n={i + 1} />
          </g>
        ),
      )}
      {[210, 370, 530, 690].map((x, i) => (
        <path
          key={x}
          className="m-why-in m-why-chev"
          style={at(i + 1)}
          d={`M${x - 3} 290 l6 6 l-6 6`}
        />
      ))}
      <path className="m-why-in m-why-rule" style={at(6)} d="M64 362 V370 H836 V362" />
      {still ? <Hot lens={0} /> : null}
    </>
  );
}

/** 业务目标：一张图表，杏色那根越过目标线 */
function Chart({ shadow, still }: { shadow: string; still?: boolean }) {
  const bars = [
    { x: 242, h: 96 },
    { x: 346, h: 140 },
    { x: 450, h: 76 },
    { x: 554, h: 210 },
    { x: 658, h: 120 },
  ];
  return (
    <>
      <Card shadow={shadow} x={150} y={110} w={600} h={380} r={14} />
      <Bar x={182} y={144} w={120} h={8} tone={2} n={1} />
      <Bar x={182} y={162} w={184} tone={0} n={1} />
      <circle className="m-why-in m-why-t1" style={at(2)} cx={604} cy={150} r="4" />
      <Bar x={614} y={147} w={36} tone={0} n={2} />
      <circle className="m-why-in m-why-dot-hot" style={at(2)} cx={668} cy={150} r="4" />
      <Bar x={678} y={147} w={36} tone={0} n={2} />
      <path className="m-why-in m-why-grid" style={at(2)} d="M190 400 H710 M190 360 H710 M190 320 H710 M190 240 H710 M190 200 H710" />
      {bars.map(({ x, h }, i) =>
        i === 3 ? null : (
          <rect
            key={x}
            className="m-why-in m-why-grow m-why-bar"
            style={at(3 + i)}
            x={x - 20}
            y={440 - h}
            width="40"
            height={h}
            rx="6"
          />
        ),
      )}
      <path className="m-why-in m-why-target" style={at(5)} d="M190 280 H710" />
      <path className="m-why-in m-why-mark" style={at(9)} d="M548 220 l6 -6 l6 6" />
      <path className="m-why-in m-why-base" style={at(2)} d="M190 440 H710" />
      {bars.map(({ x }, i) => (
        <Bar key={x} x={x - 14} y={454} w={28} h={5} tone={0} n={3 + i} />
      ))}
      {still ? <Hot lens={1} /> : null}
    </>
  );
}

/** 产品体验：一个应用窗口，杏色那块是主按钮 */
function App({ shadow, still }: { shadow: string; still?: boolean }) {
  return (
    <>
      <Card shadow={shadow} x={130} y={90} w={640} h={420} r={14} />
      <path className="m-why-in m-why-line" style={at(1)} d="M130 126 H770 M270 126 V510" />
      {[152, 166, 180].map((cx) => (
        <circle key={cx} className="m-why-in m-why-t0" style={at(1)} cx={cx} cy={108} r="4" />
      ))}
      <rect className="m-why-in m-why-t-wash" style={at(2)} x={146} y={192} width={108} height={26} rx={7} />
      <Bar x={158} y={150} w={72} tone={1} n={2} />
      <Bar x={158} y={176} w={56} tone={0} n={2} />
      <Bar x={158} y={202} w={66} tone={2} n={2} />
      <Bar x={158} y={228} w={48} tone={0} n={2} />
      <Bar x={298} y={150} w={160} h={9} tone={2} n={3} />
      <Bar x={298} y={170} w={240} tone={0} n={3} />
      <rect className="m-why-in m-why-field" style={at(4)} x={298} y={196} width={444} height={54} rx={12} />
      <Bar x={318} y={220} w={180} tone={1} n={4} />
      <path className="m-why-in m-why-caret" style={at(4)} d="M508 213 V233" />
      {[270, 346].map((y, i) => (
        <g key={y}>
          <rect className="m-why-in m-why-field" style={at(5 + i)} x={298} y={y} width={444} height={64} rx={10} />
          <rect className="m-why-in m-why-t-wash" style={at(5 + i)} x={314} y={y + 14} width={36} height={36} rx={8} />
          <Bar x={362} y={y + 20} w={160} h={7} tone={1} n={5 + i} />
          <Bar x={362} y={y + 38} w={220} h={5} tone={0} n={5 + i} />
        </g>
      ))}
      <rect className="m-why-in m-why-field" style={at(7)} x={480} y={436} width={108} height={46} rx={23} />
      <Bar x={510} y={456} w={48} tone={1} n={7} />
      {still ? <Hot lens={2} /> : null}
    </>
  );
}

/** 工程实现：四个系统用圆角折线连到中间那个服务，数据沿线流进去 */
const WIRES = [
  'M250 145 H298 A12 12 0 0 1 310 157 V273 A12 12 0 0 0 322 285 H366',
  'M650 145 H602 A12 12 0 0 0 590 157 V273 A12 12 0 0 1 578 285 H534',
  'M650 455 H602 A12 12 0 0 1 590 443 V327 A12 12 0 0 0 578 315 H534',
  'M250 455 H298 A12 12 0 0 0 310 443 V327 A12 12 0 0 1 322 315 H366',
];
function System({
  shadow,
  still,
  flow,
}: {
  shadow: string;
  still?: boolean;
  flow?: boolean;
}) {
  const nodes = [
    { x: 110, y: 110 },
    { x: 650, y: 110 },
    { x: 650, y: 420 },
    { x: 110, y: 420 },
  ];
  return (
    <>
      {WIRES.map((d, i) => (
        <path
          key={d}
          className="m-why-in m-why-draw m-why-wire"
          style={at(2 + i)}
          pathLength={1}
          d={d}
        />
      ))}
      {flow
        ? WIRES.map((d, i) => (
            <circle key={d} className="m-why-packet" r="4">
              <animateMotion
                dur="2.4s"
                begin={`${-i * 0.6}s`}
                repeatCount="indefinite"
                path={d}
              />
            </circle>
          ))
        : null}
      {nodes.map(({ x, y }, i) => (
        <g key={`${x}-${y}`}>
          <Card shadow={shadow} x={x} y={y} w={140} h={70} n={i} />
          <Bar x={x + 60} y={y + 25} w={56} tone={2} n={i + 1} />
          <Bar x={x + 60} y={y + 40} w={44} h={5} tone={0} n={i + 1} />
        </g>
      ))}
      {/* 四件东西的小图标：数据库、文档、接口、应用 */}
      <g className="m-why-in m-why-icon" style={at(2)}>
        <ellipse cx="136" cy="134" rx="12" ry="4.5" />
        <path d="M124 134 V156 A12 4.5 0 0 0 148 156 V134 M124 145 A12 4.5 0 0 0 148 145" />
      </g>
      <g className="m-why-in m-why-icon" style={at(3)}>
        <path d="M674 128 H688 L696 136 V160 H674 Z M688 128 V136 H696 M679 145 H691 M679 152 H688" />
      </g>
      <g className="m-why-in m-why-icon" style={at(4)}>
        <rect x="672" y="442" width="28" height="24" rx="4" />
        <path d="M672 449 H700" />
      </g>
      <g className="m-why-in m-why-icon" style={at(5)}>
        <path d="M134 442 q-6 0 -6 6 v4 q0 3 -4 3 q4 0 4 3 v4 q0 6 6 6 M146 442 q6 0 6 6 v4 q0 3 4 3 q-4 0 -4 3 v4 q0 6 -6 6" />
      </g>
      {still ? <Hot lens={3} /> : null}
    </>
  );
}

/** 使用者的处境：一个人，和他一天里的几个时刻；杏色那条是他在等的那一刻 */
function Person({ shadow, still }: { shadow: string; still?: boolean }) {
  const rows = [
    { y: 150, w: 210 },
    { y: 218, w: 260 },
    { y: 290, w: 300 },
    { y: 366, w: 180 },
    { y: 432, w: 236 },
  ];
  return (
    <>
      <Card shadow={shadow} x={110} y={150} w={220} h={300} r={16} />
      <circle className="m-why-in m-why-t-wash" style={at(1)} cx={220} cy={226} r={36} />
      <g className="m-why-in m-why-icon" style={at(1)}>
        <circle cx="220" cy="218" r="11" />
        <path d="M200 246 C202 233 238 233 240 246" />
      </g>
      <Bar x={172} y={284} w={96} h={8} tone={2} n={2} />
      <Bar x={160} y={304} w={120} tone={0} n={2} />
      <rect className="m-why-in m-why-t-wash" style={at(3)} x={146} y={330} width={60} height={22} rx={11} />
      <rect className="m-why-in m-why-t-wash" style={at(3)} x={214} y={330} width={80} height={22} rx={11} />
      <rect className="m-why-in m-why-t-wash" style={at(3)} x={146} y={360} width={92} height={22} rx={11} />
      <path className="m-why-in m-why-line" style={at(2)} d="M392 128 V470" />
      {rows.map(({ y, w }, i) => (
        <g key={y}>
          <circle
            className={`m-why-in ${i === 2 ? 'm-why-dot-hot' : 'm-why-node'}`}
            style={at(3 + i)}
            cx={392}
            cy={y}
            r="5"
          />
          <Bar x={408} y={y - 3} w={30} h={6} tone={0} n={3 + i} />
          {i === 2 ? null : (
            <>
              <rect className="m-why-in m-why-field" style={at(3 + i)} x={458} y={y - 22} width={w} height={44} rx={22} />
              <Bar x={480} y={y - 3} w={w * 0.5} tone={1} n={3 + i} />
            </>
          )}
        </g>
      ))}
      {still ? <Hot lens={4} /> : null}
    </>
  );
}

function Scene({
  lens,
  shadow,
  still,
  flow,
}: {
  lens: number;
  shadow: string;
  still?: boolean;
  flow?: boolean;
}) {
  if (lens === 0) return <Flow shadow={shadow} still={still} />;
  if (lens === 1) return <Chart shadow={shadow} still={still} />;
  if (lens === 2) return <App shadow={shadow} still={still} />;
  if (lens === 3) return <System shadow={shadow} still={still} flow={flow} />;
  return <Person shadow={shadow} still={still} />;
}

/** 一张定格的小画（窄屏上每项一张） */
function Thumb({ lens }: { lens: number }) {
  const shadow = useId();
  return (
    <svg className="m-why-thumb" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <Shadow id={shadow} />
      <g className="m-why-scene" data-on="">
        <Scene lens={lens} shadow={shadow} still />
      </g>
    </svg>
  );
}

/** 数到目标数：第一次显出来时从 0 数上去；减少动态时直接是结果 */
function Count({ value, active }: { value: number; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || !active || done.current) return;
    done.current = true;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1000);
      node.textContent = String(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    node.textContent = '0';
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      node.textContent = String(value);
    };
  }, [active, value]);
  return <span ref={ref}>{value}</span>;
}

export function Why() {
  const ref = useRef<HTMLElement>(null);
  const shadow = useId();
  const [live, setLive] = useState(false);
  /** -1：还没钉住；0–5：第几拍 */
  const [beat, setBeat] = useState(LAST);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const wide = matchMedia('(min-width: 1000px) and (min-height: 600px)');
    let frame = 0;
    const read = () => {
      frame = 0;
      if (!wide.matches) return;
      const rect = root.getBoundingClientRect();
      if (rect.top > 1) {
        setBeat(-1);
        return;
      }
      const span = rect.height - window.innerHeight;
      const pin = span > 0 ? Math.min(1, -rect.top / span) : 1;
      setBeat(Math.min(LAST, Math.floor(pin * BEATS)));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const sync = () => {
      setLive(wide.matches);
      if (!wide.matches) setBeat(LAST);
      request();
    };
    sync();
    wide.addEventListener('change', sync);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      wide.removeEventListener('change', sync);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);

  /** 滚到第几拍的正中 */
  const go = (to: number) => {
    const root = ref.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    const top = window.scrollY + rect.top + ((to + 0.5) / BEATS) * span;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: still ? 'auto' : 'smooth' });
  };

  /** 画板此刻是哪种样子：-1、0 是一段业务；5 是一起看 */
  const lens = beat <= 0 ? 0 : beat;
  const whole = beat === LAST;
  const [hx, hy, hw, hh, hr] = HOT[lens];
  const hand = (i: number) => {
    if (beat < 0) return ALONE;
    if (whole) return { x: MINI_HOT[i].x + 8, y: MINI_HOT[i].y + 10 };
    if (beat === i + 1) return LOOK[i];
    return CORNERS[i];
  };

  return (
    <section
      ref={ref}
      className="m-ent-why"
      id="people"
      data-live={live || undefined}
      aria-labelledby="ent-why-title"
      style={{ '--beats': BEATS } as Vars}
    >
      <div className="m-ent-why-stick m-wrap">
        <header className="m-ent-why-head">
          <h2 className="m-ent-why-title" id="ent-why-title">
            {why.title}
          </h2>
          <p className="m-ent-why-need">
            <Phrases text={why.need} />
          </p>
        </header>

        {/* 左边：四个位置；轮到的那项展开成员经历 */}
        <div className="m-why-side">
          <ol className="m-why-rail">
            {VIEWS.map((view, i) => (
              <li
                key={view.id}
                className="m-why-item"
                data-on={beat === i + 1 || undefined}
              >
                <button
                  type="button"
                  className="m-why-item-head"
                  disabled={!live}
                  aria-current={beat === i + 1 || undefined}
                  onClick={() => go(i + 1)}
                >
                  <span className="m-why-no" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="m-why-label">{view.label}</span>
                </button>
                <Thumb lens={i + 1} />
                <h3 className="m-why-cap">
                  <Phrases text={view.title} />
                </h3>
                <div className="m-why-proof">
                  <div>
                    <p className="m-why-record">{why.record}</p>
                    <p className="m-why-orgs">
                      {view.orgs.map((org) => (
                        <span key={org}>{org}</span>
                      ))}
                    </p>
                    <p className="m-why-craft">
                      {view.craft}
                      {view.count ? (
                        <span className="m-why-count">
                          <b className="num" lang="en">
                            <Count
                              value={view.count.value}
                              active={!live || beat === i + 1}
                            />
                            {view.count.suffix}
                          </b>
                          {view.count.unit}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* 最后一拍：导语第二句，和成员经历里出现过的公司 */}
          <div className="m-why-close" data-on={whole || undefined}>
            <p className="m-why-close-say">
              <Phrases text={why.close} />
            </p>
            <p className="m-why-record">{why.record}</p>
            <p className="m-why-orgs m-why-all">
              {ORGS.map((org) => (
                <span key={org}>{org}</span>
              ))}
            </p>
          </div>
        </div>

        {/* 右边：同一段业务，四种样子 */}
        <figure className="m-why-figure" aria-label={why.need}>
          <div className="m-why-stage" data-lens={lens} data-beat={beat}>
            <svg className="m-why-art" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
              <Shadow id={shadow} />
              {[0, 1, 2, 3, 4].map((at) => (
                <g
                  key={at}
                  className="m-why-scene"
                  data-on={lens === at || undefined}
                >
                  <Scene lens={at} shadow={shadow} flow={at === 3} />
                </g>
              ))}
              {VIEWS.map((view, i) => {
                const spot = MINI_AT[i];
                const hot = middle(HOT[i + 1]);
                return (
                  <g
                    key={view.id}
                    transform={`translate(${spot.x} ${spot.y}) scale(${MINI})`}
                  >
                    <g
                      className="m-why-mini"
                      data-on={whole || undefined}
                      style={{ '--i': i } as Vars}
                    >
                      <rect className="m-why-mini-frame" width={W} height={H} rx="40" />
                      <g className="m-why-scene" data-on="">
                        <Scene lens={i + 1} shadow={shadow} still />
                      </g>
                      <circle
                        className="m-why-pulse"
                        cx={hot.x}
                        cy={hot.y}
                        r="46"
                      />
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* 杏色那块：同一块，在几种样子之间变形；最后一拍成正中那枚「一段业务」 */}
            <div
              className="m-why-hot"
              style={{
                left: pct(hx, W),
                top: pct(hy, H),
                width: pct(hw, W),
                height: pct(hh, H),
                borderRadius: cqw(hr),
              }}
            >
              <span className="m-why-hot-v" data-v="0">
                <i className="m-why-hot-dot" />
                <i className="m-why-hot-bars">
                  <b />
                  <b />
                  <b />
                </i>
              </span>
              <span className="m-why-hot-v" data-v="2">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 1 l1.8 5.2 l5.2 1.8 l-5.2 1.8 l-1.8 5.2 l-1.8 -5.2 l-5.2 -1.8 l5.2 -1.8 Z" />
                </svg>
                <b />
              </span>
              <span className="m-why-hot-v" data-v="3">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="5" y="5" width="14" height="14" rx="3" />
                  <path d="M9 1.5 v3.5 M15 1.5 v3.5 M9 19 v3.5 M15 19 v3.5 M1.5 9 h3.5 M1.5 15 h3.5 M19 9 h3.5 M19 15 h3.5" />
                </svg>
                <i className="m-why-hot-bars">
                  <b />
                  <b />
                </i>
              </span>
              <span className="m-why-hot-v" data-v="4">
                <b />
                <b />
                <b />
              </span>
              <span className="m-why-hot-v" data-v="5" aria-hidden="true">
                {why.center}
              </span>
            </div>
            <p className="m-why-caption" aria-hidden="true">
              {why.center}
            </p>

            {/* 四只光标：上一屏那只 Molis 分成四个位置 */}
            {VIEWS.map((view, i) => {
              const { x, y } = hand(i);
              return (
                <button
                  key={view.id}
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="m-film-hand m-why-hand"
                  data-who="we"
                  data-on={
                    beat === 0 || beat === i + 1 || whole || (beat < 0 && i === 0) || undefined
                  }
                  style={
                    {
                      '--i': i,
                      transform: `translate(${cqw(x)}, ${cqw(y)})`,
                    } as CSSProperties
                  }
                  onClick={() => go(i + 1)}
                >
                  <svg className="m-film-arrow" viewBox="0 0 16 22">
                    <path d="M1.5 1.5 V17 L5.6 13.2 L8.6 20 L11.4 18.8 L8.5 12.2 H14 Z" />
                  </svg>
                  <span className="m-film-tag">
                    <span className="m-why-tag-molis" lang="en">
                      Molis
                    </span>
                    <span className="m-why-tag-view">{view.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </figure>

        <footer className="m-ent-why-end">
          <p>{why.note}</p>
          <More href={TEAM}>{why.link}</More>
        </footer>
      </div>
    </section>
  );
}
