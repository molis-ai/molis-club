'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { enterprise } from '../../../content/site/enterprise';
import { TEAM } from '../../_site/routes';
import { More, Phrases, type Vars } from '../../_site/ui';

// 为什么我们可以（负责人 2026-10-20：「以更高的标准」重做——同一段业务，四个位置看）。
// 把 5.5 导语演出来：画面主角是「一段业务」本身，五块东西排成一行流程，其中一块是杏色——那个值得做的环节。
// 往下滚，整屏钉住，同一组方块变成四个位置眼里的样子，杏色那块始终是同一个：
//   业务目标——长成柱子，杏色那根最高；产品体验——排进一个界面，杏色那块是主按钮；
//   工程实现——连成系统，杏色那块是中间那个服务；使用者的处境——一个人一天里的几个时刻，杏色那块是他卡住的那一刻。
// 开场接着上一屏短片：那只杏色「Molis」光标进来，分成四只，名牌是四个位置，各站一角；轮到谁，谁去看杏色那块。
// 最后一拍：四种样子缩成四张小画，各在自己那一角；四个杏色块各牵一根细线，汇到正中「一段业务」——四个位置看的是同一件事（导语第二句）。
// 左边一列四个位置（01–04）：小标题一直在，轮到的那项展开成员经历；最后一拍收成导语第二句和一行成员经历里的公司。
// 「不代表固定分工、不是客户项目」那句常驻页脚。成员姓名不上（负责人未定）。
// 宽屏（≥1000 宽、≥600 高）有 JS 时才钉住；手机、矮屏、没有 JS 时四项上下排，每项一张定格的小画，字全展开。
// 减少动态：照样一拍一拍换，只是没有过渡和数数。

const { why } = enterprise;
const VIEWS = why.views;
/** 0 一段业务；1–4 四个位置；5 一起看 */
const BEATS = VIEWS.length + 2;
const LAST = BEATS - 1;
/** 成员经历里出现过的公司，按第一次出现的顺序 */
const ORGS = [...new Set(VIEWS.flatMap((view) => view.orgs))];

/* ---------- 画面：800 × 500 ---------- */
const W = 800;
type Box = [x: number, y: number, w: number, h: number, r: number];
/** 杏色那块：五块里的第四块 */
const HOT = 3;
/** 五块东西在每种样子里的位置 */
const SHAPES: Box[][] = [
  // 一段业务：一行五步
  [0, 1, 2, 3, 4].map((i): Box => [128 + i * 120, 200, 64, 64, 14]),
  // 业务目标：柱子，杏色那根最高
  [110, 150, 90, 250, 170].map((h, i): Box => [130 + i * 120, 400 - h, 60, h, 8]),
  // 产品体验：标题、输入框、两行列表、主按钮
  [
    [212, 124, 160, 16, 8],
    [212, 160, 376, 52, 12],
    [212, 232, 376, 44, 10],
    [448, 368, 140, 44, 22],
    [212, 290, 300, 44, 10],
  ],
  // 工程实现：四个系统连着中间那个服务
  [
    [120, 90, 104, 60, 12],
    [120, 350, 104, 60, 12],
    [576, 90, 104, 60, 12],
    [340, 200, 120, 100, 18],
    [576, 350, 104, 60, 12],
  ],
  // 使用者的处境：一个人一天里的几个时刻
  [
    [240, 80, 220, 46, 23],
    [240, 142, 300, 46, 23],
    [240, 204, 190, 46, 23],
    [240, 266, 360, 64, 26],
    [240, 346, 250, 46, 23],
  ],
];
const center = ([x, y, w, h]: Box) => ({ x: x + w / 2, y: y + h / 2 });

/** 光标：四个位置各站一角；轮到谁，谁去看杏色那块 */
const CORNERS = [
  { x: 40, y: 28 },
  { x: 650, y: 28 },
  { x: 650, y: 452 },
  { x: 40, y: 452 },
];
const LOOK = [
  { x: 532, y: 160 },
  { x: 540, y: 398 },
  { x: 436, y: 282 },
  { x: 566, y: 310 },
];
/** 还没钉住时，四只叠在一起，是上一屏那只「Molis」 */
const STACK = { x: 700, y: 466 };

/** 最后一拍：四种样子缩成四张小画，各在自己那一角（和光标站的角一样，顺时针） */
const MINI = 0.44;
const MINI_AT = [
  { x: 36, y: 20 },
  { x: 412, y: 20 },
  { x: 412, y: 264 },
  { x: 36, y: 264 },
];
/** 四张小画里杏色那块的中心 */
const MEET = VIEWS.map((_, i) => {
  const at = MINI_AT[i];
  const hot = center(SHAPES[i + 1][HOT]);
  return { x: at.x + hot.x * MINI, y: at.y + hot.y * MINI };
});
/** 四根细线汇到的那一点：四张小画中间的十字缝 */
const HUB = { x: 400, y: 252 };

const unit = (n: number) => `${Math.round((n / W) * 100 * 1000) / 1000}cqw`;
const spot = ({ x, y }: { x: number; y: number }) =>
  `translate(${unit(x)}, ${unit(y)})`;

/** 每种样子的陪衬：一条线、一扇窗、几根连线、一个人 */
function Decor({ lens }: { lens: number }) {
  if (lens === 0)
    return <path className="m-why-d-line" d="M160 232 H640" />;
  if (lens === 1)
    return (
      <>
        <path className="m-why-d-grid" d="M100 320 H700 M100 240 H700 M100 160 H700" />
        <path className="m-why-d-base" d="M100 400 H700" />
      </>
    );
  if (lens === 2)
    return (
      <>
        <rect className="m-why-d-window" x="180" y="60" width="440" height="380" rx="16" />
        <path className="m-why-d-line" d="M180 100 H620" />
        {[204, 220, 236].map((cx) => (
          <circle key={cx} className="m-why-d-light" cx={cx} cy="80" r="4" />
        ))}
      </>
    );
  if (lens === 3)
    return (
      <path
        className="m-why-d-line"
        d="M172 120 L400 250 M172 380 L400 250 M628 120 L400 250 M628 380 L400 250"
      />
    );
  return (
    <>
      <circle className="m-why-d-ink" cx="156" cy="216" r="24" />
      <path className="m-why-d-ink" d="M112 300 C114 258 198 258 200 300" />
    </>
  );
}

/** 方块里的一行字（只是一道浅色的线） */
const lined = (lens: number, i: number) =>
  (lens === 2 && i > 0) || lens === 3 || (lens === 4 && i !== HOT);

/** 一种样子定格成一张小画（最后一拍的四张、窄屏上每项一张） */
function Scene({ lens }: { lens: number }) {
  return (
    <g className="m-why-scene">
      <Decor lens={lens} />
      {SHAPES[lens].map(([x, y, w, h, r], i) => (
        <g key={i}>
          <rect
            className="m-why-b"
            data-lens={lens}
            data-hot={i === HOT || undefined}
            data-head={(lens === 2 && i === 0) || undefined}
            x={x}
            y={y}
            width={w}
            height={h}
            rx={r}
          />
          {lined(lens, i) ? (
            <rect
              className="m-why-b-line"
              data-hot={i === HOT || undefined}
              x={x + w * 0.12}
              y={y + h / 2 - 3}
              width={w * 0.4}
              height="6"
              rx="3"
            />
          ) : null}
          {lens === 4 && i === HOT
            ? [0, 1, 2].map((k) => (
                <circle
                  key={k}
                  className="m-why-b-dot"
                  cx={x + 34 + k * 18}
                  cy={y + h / 2}
                  r="4.5"
                />
              ))
            : null}
        </g>
      ))}
    </g>
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

  /** 方块此刻是哪种样子：最后一拍停在使用者那一种上淡出 */
  const lens = beat <= 0 ? 0 : Math.min(beat, VIEWS.length);
  const whole = beat === LAST;
  const hand = (i: number) => {
    if (beat < 0) return STACK;
    if (whole) return { x: MEET[i].x + 6, y: MEET[i].y + 8 };
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
                <svg
                  className="m-why-thumb"
                  viewBox="0 0 800 500"
                  aria-hidden="true"
                >
                  <Scene lens={i + 1} />
                </svg>
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
          <div
            className="m-why-stage"
            data-lens={whole ? 'all' : lens}
            data-beat={beat}
          >
            <svg className="m-why-art" viewBox="0 0 800 500" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((at) => (
                <g
                  key={at}
                  className="m-why-decor"
                  data-on={(!whole && lens === at) || undefined}
                >
                  <Decor lens={at} />
                </g>
              ))}
              {VIEWS.map((view, i) => {
                const at = MINI_AT[i];
                return (
                  <g
                    key={view.id}
                    transform={`translate(${at.x} ${at.y}) scale(${MINI})`}
                  >
                    <g
                      className="m-why-mini"
                      data-on={whole || undefined}
                      style={{ '--i': i } as Vars}
                    >
                      <rect
                        className="m-why-mini-frame"
                        width="800"
                        height="500"
                        rx="50"
                      />
                      <Scene lens={i + 1} />
                    </g>
                  </g>
                );
              })}
              {MEET.map((at, i) => (
                <path
                  key={i}
                  className="m-why-thread"
                  data-on={whole || undefined}
                  style={{ '--i': i } as Vars}
                  pathLength={1}
                  d={`M${at.x} ${at.y} L${HUB.x} ${HUB.y}`}
                />
              ))}
            </svg>

            {/* 五块东西：同一组，换样子 */}
            {SHAPES[0].map((_, i) => {
              const [x, y, w, h, r] = SHAPES[lens][i];
              return (
                <i
                  key={i}
                  className="m-why-block"
                  data-hot={i === HOT || undefined}
                  data-head={(lens === 2 && i === 0) || undefined}
                  data-lined={lined(lens, i) || undefined}
                  style={
                    {
                      '--i': i,
                      left: `${(x / W) * 100}%`,
                      top: `${(y / 500) * 100}%`,
                      width: `${(w / W) * 100}%`,
                      height: `${(h / 500) * 100}%`,
                      borderRadius: unit(r),
                    } as CSSProperties
                  }
                >
                  <b className="m-why-block-line" />
                  {i === HOT ? (
                    <b className="m-why-block-dots">
                      <b />
                      <b />
                      <b />
                    </b>
                  ) : null}
                </i>
              );
            })}
            <p className="m-why-caption" aria-hidden="true">
              {why.center}
            </p>

            {/* 四只光标：上一屏那只 Molis 分成四个位置 */}
            {VIEWS.map((view, i) => (
              <button
                key={view.id}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                className="m-film-hand m-why-hand"
                data-who="we"
                data-on={beat === i + 1 || whole || undefined}
                style={
                  {
                    '--i': i,
                    transform: spot(hand(i)),
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
            ))}
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
