'use client';
import { useEffect, useRef, useState } from 'react';
import { enterprise, type View } from '../../../content/site/enterprise';
import { TEAM } from '../../_site/routes';
import { More, Phrases, type Vars } from '../../_site/ui';

// 为什么我们可以（负责人 2026-10-19：原来「做这件事的人」那一屏改成这一问；字更少，用动画、文字和一点交互娓娓道来）。
// 画面是「一段业务」：一块方形分成四格，四个角各站着一个位置——业务目标、产品体验、工程实现、使用者的处境（5.5 导语原词）。
// 往下滚，整屏钉住，一拍一拍讲：
//   0 先说把 AI 用进一段业务要同时理解这四个位置（导语第一句），方块还是空的；
//   1–4 每拍一个位置：那个角投进来一道淡淡的光，它对着的那一格画出这个位置看见的东西
//       （业务目标是柱子、产品体验是界面、工程实现是连起来的系统、使用者的处境是一个人和他说的话），
//       旁边是 5.5 的小标题与成员经历；使用者那一拍数到 100+；
//   5 四格都画满，方块的边亮成杏色，收在导语第二句：让我们能从这些不同的位置共同看问题。
// 四个位置可以点：点哪个滚到哪一拍；鼠标停在（或键盘移到）一个位置上先看它那一拍，离开回到滚到的那一拍。
// 经历不代表固定分工、不是客户项目的说明常驻在页面上。
// 没有 JS：不钉住，四格画满，几拍从上到下排着。减少动态：照样一拍一拍换，只是没有过渡和数数。

const { why } = enterprise;
const BEATS = why.views.length + 2;

/** 四个位置站在方块的四个角上；顺时针，按原文顺序 */
const CORNERS: Record<View['id'], { x: number; y: number }> = {
  business: { x: 76, y: 76 },
  product: { x: 404, y: 76 },
  engineering: { x: 404, y: 404 },
  use: { x: 76, y: 404 },
};
/** 方块 140–340，中线 240；每个位置对着的那一格的左上角 */
const CELLS: Record<View['id'], { x: number; y: number }> = {
  business: { x: 140, y: 140 },
  product: { x: 240, y: 140 },
  engineering: { x: 240, y: 240 },
  use: { x: 140, y: 240 },
};
/** 光：从这个角投向那一格靠外的两条边的中点 */
const beam = (id: View['id']) => {
  const { x, y } = CORNERS[id];
  const cell = CELLS[id];
  const outX = cell.x === 140 ? 140 : 340;
  const outY = cell.y === 140 ? 140 : 340;
  return `${x},${y} ${cell.x + 50 + (outX === 140 ? 50 : -50)},${outY} ${outX},${cell.y + 50 + (outY === 140 ? 50 : -50)}`;
};

/** 每一格里画的东西：100 × 100 的小画，墨色细线、一点杏橙；pathLength=1 的线可以画出来 */
function Sketch({ id }: { id: View['id'] }) {
  if (id === 'business')
    return (
      <>
        <path className="m-why-ink m-why-draw" pathLength={1} d="M18 80 H82" />
        <rect
          className="m-why-bar"
          x="24"
          y="58"
          width="11"
          height="22"
          rx="2"
          style={{ '--j': 0 } as Vars}
        />
        <rect
          className="m-why-bar"
          x="44"
          y="44"
          width="11"
          height="36"
          rx="2"
          style={{ '--j': 1 } as Vars}
        />
        <rect
          className="m-why-bar m-why-hot"
          x="64"
          y="26"
          width="11"
          height="54"
          rx="2"
          style={{ '--j': 2 } as Vars}
        />
      </>
    );
  if (id === 'product')
    return (
      <>
        <rect
          className="m-why-ink m-why-draw"
          pathLength={1}
          x="16"
          y="20"
          width="68"
          height="60"
          rx="7"
        />
        <path className="m-why-thin m-why-draw" pathLength={1} d="M16 33 H84" />
        <path
          className="m-why-thin m-why-draw"
          pathLength={1}
          d="M28 47 H64 M28 57 H54"
        />
        <rect
          className="m-why-pop m-why-hot"
          x="54"
          y="65"
          width="22"
          height="8"
          rx="4"
        />
      </>
    );
  if (id === 'engineering')
    return (
      <>
        <path
          className="m-why-thin m-why-draw"
          pathLength={1}
          d="M38 31 H62 M30 40 L44 62 M70 40 L56 62"
        />
        <rect
          className="m-why-ink m-why-pop"
          x="20"
          y="22"
          width="18"
          height="18"
          rx="4"
        />
        <rect
          className="m-why-ink m-why-pop"
          x="62"
          y="22"
          width="18"
          height="18"
          rx="4"
          style={{ '--j': 1 } as Vars}
        />
        <rect
          className="m-why-pop m-why-hot"
          x="41"
          y="62"
          width="18"
          height="18"
          rx="4"
          style={{ '--j': 2 } as Vars}
        />
      </>
    );
  return (
    <>
      <circle
        className="m-why-ink m-why-draw"
        pathLength={1}
        cx="38"
        cy="44"
        r="10"
      />
      <path
        className="m-why-ink m-why-draw"
        pathLength={1}
        d="M20 82 C22 64 54 64 56 82"
      />
      <path
        className="m-why-ink m-why-draw"
        pathLength={1}
        d="M58 22 H84 a5 5 0 0 1 5 5 V40 a5 5 0 0 1 -5 5 H68 L62 51 V45 H58 a5 5 0 0 1 -5 -5 V27 a5 5 0 0 1 5 -5 Z"
      />
      <circle className="m-why-pop m-why-hot" cx="71" cy="33.5" r="3.4" />
    </>
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
      const t = Math.min(1, (now - start) / 1200);
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
  const [step, setStep] = useState(0);
  const [peek, setPeek] = useState<number | null>(null);
  const shown = live ? (peek ?? step) : null;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    setLive(true);
    let frame = 0;
    const read = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const pin = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 1;
      setStep(Math.min(BEATS - 1, Math.floor(pin * BEATS)));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);

  /** 滚到第几拍的正中 */
  const go = (beat: number) => {
    const root = ref.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    const top = window.scrollY + rect.top + ((beat + 0.5) / BEATS) * span;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: still ? 'auto' : 'smooth' });
  };

  // 画面上点亮到第几个位置：没有 JS 时全亮
  const lit =
    shown === null ? why.views.length : Math.min(shown, why.views.length);
  const whole = shown === null || shown >= why.views.length + 1;

  return (
    <section
      ref={ref}
      className="m-ent-why"
      id="people"
      data-live={live || undefined}
      data-whole={whole || undefined}
      aria-labelledby="ent-why-title"
      style={{ '--beats': BEATS } as Vars}
    >
      <div className="m-ent-why-stick m-wrap">
        <div className="m-ent-why-text">
          <h2 className="m-ent-why-title" id="ent-why-title">
            {why.title}
          </h2>

          <div className="m-ent-why-beats">
            <p
              className="m-ent-why-beat m-ent-why-say"
              data-shown={shown === 0 || undefined}
            >
              <Phrases text={why.need} />
            </p>
            {why.views.map((view, index) => (
              <div
                key={view.id}
                className="m-ent-why-beat"
                data-shown={shown === index + 1 || undefined}
              >
                <p className="m-ent-why-label">{view.label}</p>
                <h3 className="m-ent-why-cap">
                  <Phrases text={view.title} />
                </h3>
                <div className="m-ent-why-proof">
                  {view.count ? (
                    <p className="m-ent-why-count">
                      <b className="num" lang="en">
                        <Count
                          value={view.count.value}
                          active={shown === index + 1}
                        />
                        {view.count.suffix}
                      </b>
                      <span className="m-ent-why-unit">{view.count.unit}</span>
                    </p>
                  ) : null}
                  <p className="m-ent-why-orgs">
                    <span className="m-ent-why-record">{why.record}</span>
                    <span className="m-ent-why-names">
                      {view.orgs.map((org) => (
                        <span key={org}>{org}</span>
                      ))}
                    </span>
                    <span className="m-ent-why-craft">{view.craft}</span>
                  </p>
                </div>
              </div>
            ))}
            <p
              className="m-ent-why-beat m-ent-why-say"
              data-shown={shown === BEATS - 1 || undefined}
            >
              <Phrases text={why.close} />
            </p>
          </div>
        </div>

        <figure className="m-ent-why-figure" aria-label={why.need}>
          <div className="m-ent-why-art">
            <svg viewBox="0 0 480 480" aria-hidden="true">
              {why.views.map((view, index) => (
                <polygon
                  key={view.id}
                  className="m-why-beam"
                  data-lit={index < lit || undefined}
                  data-current={shown === index + 1 || undefined}
                  points={beam(view.id)}
                />
              ))}
              <rect
                className="m-why-tile"
                x="140"
                y="140"
                width="200"
                height="200"
                rx="18"
              />
              <path className="m-why-cross" d="M240 148 V332 M148 240 H332" />
              {why.views.map((view, index) => {
                const cell = CELLS[view.id];
                return (
                  <g
                    key={view.id}
                    className="m-why-cell"
                    data-lit={index < lit || undefined}
                    transform={`translate(${cell.x} ${cell.y})`}
                  >
                    <Sketch id={view.id} />
                  </g>
                );
              })}
              <rect
                className="m-why-edge"
                x="140"
                y="140"
                width="200"
                height="200"
                rx="18"
                pathLength={1}
              />
            </svg>
            <p className="m-ent-why-center" aria-hidden="true">
              {why.center}
            </p>
            {why.views.map((view, index) => {
              const { x, y } = CORNERS[view.id];
              return (
                <button
                  key={view.id}
                  type="button"
                  className="m-ent-why-view"
                  data-at={y < 240 ? 'top' : 'bottom'}
                  data-lit={index < lit || undefined}
                  data-current={shown === index + 1 || undefined}
                  aria-pressed={shown === index + 1}
                  style={
                    {
                      '--x': `${(x / 480) * 100}%`,
                      '--y': `${(y / 480) * 100}%`,
                    } as Vars
                  }
                  disabled={!live}
                  onClick={() => go(index + 1)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') setPeek(index + 1);
                  }}
                  onPointerLeave={() => setPeek(null)}
                  onFocus={() => setPeek(index + 1)}
                  onBlur={() => setPeek(null)}
                >
                  <i className="m-ent-why-dot" aria-hidden="true" />
                  <span>{view.label}</span>
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
