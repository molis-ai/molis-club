'use client';
import Link from 'next/link';
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { Shell } from '../kit';
import { words } from '../home-say';
import { HOME } from '../routes';
import './say-lab.css';

// 品牌一句话 · 第三轮：首屏和产品之间的一段过渡，跟着滚动走，只有一行字。
// 共同的骨架：We build 和 ware 的位置锁定；Soft 被「重新定义」掉；新的定义一个个出现（Warm……Efficient）；
// 最后落到 x‑ware，We build 退场，x‑ware 移到正中定格。区别只在 Soft 怎么被重新定义、新词怎么出现。
//   打字机、翻牌、百叶窗、跑马灯、转轮、波浪（用户点名的效果）；划改、纵深、遮盖（自己设计的）。

const defs = words.slice(1).map((word) => word.text);
const N = defs.length;

/** 时间轴（整段滚动的进度 0…1） */
const T = {
  soft0: 0.08,
  soft1: 0.24,
  open0: 0.14,
  open1: 0.26,
  w0: 0.26,
  w1: 0.84,
  x0: 0.84,
  x1: 0.9,
  end0: 0.9,
  end1: 0.98,
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeOut = (v: number) => 1 - (1 - clamp01(v)) ** 3;
const smooth = (v: number) => {
  const c = clamp01(v);
  return c * c * (3 - 2 * c);
};
/** 一串里第 i 个（共 n 个）的进度：整体 u 走完时最后一个刚好走完 */
const stagger = (u: number, i: number, n: number, spread = 0.5) =>
  clamp01((u - (n > 1 ? (i / (n - 1)) * spread : 0)) / (1 - spread));

type Phase = {
  p: number;
  /** Soft 被重新定义的进度 */
  soft: number;
  /** 第几个新词（带小数），0…N */
  word: number;
  /** x 出现的进度 */
  x: number;
  /** 收尾：We build 退场、x‑ware 移到中间 */
  end: number;
  /** 当前这一格的宽度 */
  slotW: number;
};
type Metrics = {
  L: number;
  em: number;
  lead: number;
  soft: number;
  ware: number;
  x: number;
  sep: number;
  max: number;
  widths: Record<string, number>;
};

/** 第 k 个新词自己的进度：0→1 是它在场的那一段 */
const local = (ph: Phase, k: number) => ph.word - k;
/** 现在轮到第几个词（-1 是还在 Soft，N 是 x） */
function current(ph: Phase) {
  if (ph.p < T.w0) return -1;
  if (ph.p >= T.x0) return N;
  return Math.min(N - 1, Math.floor(ph.word));
}
/** 连续的「停靠位置」：0 是 Soft，1…N 是各个词，N+1 是 x；每一格先停一会儿再走 */
function stop(p: number) {
  let u: number;
  if (p < T.open0) u = 0;
  else if (p < T.w0) u = range(p, T.open0, T.w0);
  else if (p < T.x0) u = 1 + ((p - T.w0) / (T.w1 - T.w0)) * (N - 1);
  else u = N + range(p, T.x0, T.x1);
  const base = Math.floor(u);
  return base + smooth((u - base - 0.4) / 0.6);
}

function subscribeReduce(notify: () => void) {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
}
const readReduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 这一段滚过了多少（0…1）；减少动态时直接是 1 */
function useProgress(ref: RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  const reduce = useSyncExternalStore(subscribeReduce, readReduce, () => false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const span = Math.max(1, rect.height - window.innerHeight);
      setP(Math.round(clamp01(-rect.top / span) * 1000) / 1000);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    request();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, [ref]);
  return reduce ? 1 : p;
}

/** x 加破折号：x‑ */
function XEntry() {
  return (
    <span className="g-sl-xe">
      <i>x</i>
      <b>-</b>
    </span>
  );
}

type Render = (ph: Phase, m: Metrics) => ReactNode;

/**
 * 一行字的骨架：We build、那一格、ware 都按量好的宽度绝对定位。
 * ware 的位置固定；那一格在 Soft 被重新定义时撑开到最宽的词，We build 往左让一次，之后也固定。
 * 收尾时 We build 淡出，x‑ware 一起移到正中。
 */
function Line({ p, render }: { p: number; render: Render }) {
  const box = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<Metrics | null>(null);

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const measure = () => {
      const width = (key: string) =>
        node
          .querySelector(`.g-sl-ruler [data-k="${key}"]`)
          ?.getBoundingClientRect().width ?? 0;
      const widths = Object.fromEntries(defs.map((d) => [d, width(d)]));
      setM({
        L: node.clientWidth,
        em: parseFloat(getComputedStyle(node).fontSize) || 0,
        lead: width('lead'),
        soft: width('soft'),
        ware: width('ware'),
        x: width('x'),
        sep: width('sep'),
        max: Math.max(width('soft'), width('x'), ...Object.values(widths)),
        widths,
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    void document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  const open = easeOut(range(p, T.open0, T.open1));
  const end = smooth(range(p, T.end0, T.end1));
  let content: ReactNode = null;
  let lead: CSSProperties = {};
  let group: CSSProperties = {};
  let slot: CSSProperties = {};
  let ware: CSSProperties = {};
  if (m) {
    const full = m.lead + m.max + m.ware;
    const two = full > m.L;
    const slotRight = two ? m.L - m.ware : (m.L + full) / 2 - m.ware;
    const slotW = m.soft + (m.max - m.soft) * open;
    const ph: Phase = {
      p,
      soft: range(p, T.soft0, T.soft1),
      word: ((p - T.w0) / (T.w1 - T.w0)) * N,
      x: range(p, T.x0, T.x1),
      end,
      slotW,
    };
    content = render(ph, m);
    lead = two
      ? { left: 0, bottom: '1.12em', opacity: 1 - end }
      : {
          left: slotRight - slotW - m.lead,
          opacity: 1 - end,
          filter: `blur(${(end * 6).toFixed(1)}px)`,
        };
    const shift = m.L / 2 - slotRight + (m.x - m.ware) / 2;
    group = { transform: `translateX(${(shift * end).toFixed(1)}px)` };
    slot = { left: slotRight - m.max, width: m.max };
    ware = { left: slotRight };
  }

  return (
    <div className="g-sl-line" ref={box} data-ready={m ? '' : undefined}>
      <span className="g-sl-ruler" aria-hidden="true">
        <span data-k="lead">We build </span>
        <span data-k="soft" className="g-sl-soft">
          Soft
        </span>
        <span data-k="ware">ware</span>
        {defs.map((d) => (
          <span key={d} data-k={d} className="g-sl-word">
            {d}
          </span>
        ))}
        <span data-k="x">
          <XEntry />
        </span>
        <span data-k="sep" className="g-sl-sep">
          {' · '}
        </span>
      </span>
      {m ? (
        <>
          <span className="g-sl-lead" style={lead}>
            We build{' '}
          </span>
          <span className="g-sl-group" style={group}>
            <span className="g-sl-slot" style={slot}>
              {content}
            </span>
            <span className="g-sl-ware" style={ware}>
              ware
            </span>
          </span>
        </>
      ) : null}
    </div>
  );
}

/** 一个方案：说明牌 + 一段粘在视口里的滚动 */
function Variant({
  id,
  number,
  name,
  idea,
  mine = false,
  render,
}: {
  id: string;
  number: number;
  name: string;
  idea: string;
  mine?: boolean;
  render: Render;
}) {
  const section = useRef<HTMLElement>(null);
  const p = useProgress(section);
  return (
    <>
      <header className="g-sl-plate" id={id}>
        <p className="g-sl-plate-no">
          <span lang="en">{String(number).padStart(2, '0')}</span>
          <span>{name}</span>
          {mine ? <small>自己设计</small> : null}
        </p>
        <p className="g-sl-plate-idea">{idea}</p>
      </header>
      <section
        ref={section}
        className={`g-sl-run g-sl-${id}`}
        aria-label={`方案 ${number}：${name}`}
      >
        <div className="g-sl-pin">
          <Line p={p} render={render} />
        </div>
      </section>
    </>
  );
}

/* ---------- 每个方案怎么画那一格 ---------- */

/** 逐字母的小工具：从右往左数第 r 个字母 */
function Letters({
  text,
  style,
  className = '',
}: {
  text: string;
  style: (r: number, n: number) => CSSProperties;
  className?: string;
}) {
  const letters = Array.from(text);
  return (
    <span className={`g-sl-item g-sl-letters ${className}`}>
      {letters.map((letter, i) => (
        <span key={i} style={style(letters.length - 1 - i, letters.length)}>
          {letter}
        </span>
      ))}
    </span>
  );
}

/** 01 打字机：光标停在 ware 前面，Soft 一个字母一个字母退格删掉；新词打出来、停一下、再删掉 */
function Typewriter(ph: Phase): ReactNode {
  const k = current(ph);
  let text = '';
  let kind = 'g-sl-word';
  if (k === -1) {
    const del = range(ph.p, 0.14, 0.24);
    text = 'Soft'.slice(0, 4 - Math.floor(del * 4.999));
    kind = 'g-sl-soft';
  } else if (k < N) {
    const word = defs[k];
    const t = local(ph, k);
    const typed =
      t < 0.45
        ? Math.ceil((t / 0.45) * word.length)
        : t < 0.72
          ? word.length
          : word.length -
            Math.floor(((t - 0.72) / 0.28) * word.length * 1.0001);
    text = word.slice(0, Math.max(0, typed));
  }
  const showCaret = ph.p > 0.07 && ph.end < 1;
  return (
    <span className="g-sl-item g-sl-typing">
      {k === N ? (
        ph.x > 0.25 ? (
          <XEntry />
        ) : null
      ) : (
        <span className={kind}>{text}</span>
      )}
      {showCaret ? (
        <i className="g-sl-caret" style={{ opacity: 1 - ph.end }} />
      ) : null}
    </span>
  );
}

/** 02 翻牌：每个字母绕横轴翻过去，下一张翻上来；从贴着 ware 的那个字母开始 */
function Flip(ph: Phase): ReactNode {
  const flip = (u: number, out: boolean) => (r: number, n: number) => {
    const s = easeOut(stagger(u, r, n, 0.55));
    const angle = out ? s * 90 : (1 - s) * -90;
    return {
      transform: `rotateX(${angle.toFixed(1)}deg)`,
      opacity: 1 - Math.abs(angle) / 110,
    };
  };
  const k = current(ph);
  const items: ReactNode[] = [];
  if (k === -1)
    items.push(
      <Letters
        key="soft"
        text="Soft"
        className="g-sl-soft"
        style={flip(ph.soft, true)}
      />,
    );
  if (k >= 0 && k < N) {
    const t = local(ph, k);
    items.push(
      <Letters
        key={defs[k]}
        text={defs[k]}
        className="g-sl-word"
        style={
          t < 0.5
            ? flip(range(t, 0, 0.24), false)
            : flip(range(t, 0.78, 1), true)
        }
      />,
    );
  }
  if (k === N)
    items.push(
      <span
        key="x"
        className="g-sl-item g-sl-flipx"
        style={{
          transform: `rotateX(${((1 - easeOut(ph.x)) * -90).toFixed(1)}deg)`,
        }}
      >
        <XEntry />
      </span>,
    );
  return <span className="g-sl-3d">{items}</span>;
}

/** 03 百叶窗：字被切成六条横条，像百叶一条条合上、再翻开成下一个词 */
function Blinds(ph: Phase): ReactNode {
  const bands = 6;
  const slats = (content: ReactNode, key: string, u: number, out: boolean) =>
    Array.from({ length: bands }, (_, i) => {
      const s = easeOut(stagger(u, i, bands, 0.5));
      const angle = out ? s * 90 : (1 - s) * -90;
      const top = (i / bands) * 100;
      const bottom = 100 - ((i + 1) / bands) * 100;
      return (
        <span
          key={`${key}-${i}`}
          className="g-sl-item g-sl-slat"
          style={{
            clipPath: `inset(${top.toFixed(2)}% -2% ${Math.max(0, bottom - 0.6).toFixed(2)}% -2%)`,
            transformOrigin: `50% ${(((i + 0.5) / bands) * 100).toFixed(1)}%`,
            transform: `rotateX(${angle.toFixed(1)}deg)`,
          }}
        >
          {content}
        </span>
      );
    });
  const k = current(ph);
  if (k === -1)
    return (
      <span className="g-sl-3d">
        {slats(<span className="g-sl-soft">Soft</span>, 'soft', ph.soft, true)}
      </span>
    );
  if (k < N) {
    const t = local(ph, k);
    return (
      <span className="g-sl-3d">
        {slats(
          <span className="g-sl-word">{defs[k]}</span>,
          defs[k],
          t < 0.5 ? range(t, 0, 0.26) : range(t, 0.74, 1),
          t >= 0.5,
        )}
      </span>
    );
  }
  return <span className="g-sl-3d">{slats(<XEntry />, 'x', ph.x, false)}</span>;
}

/** 04 跑马灯：Soft 之后排着一整串定义，像跑马灯一样从 ware 里面一个个钻出来往左走，每个词停一下 */
function Marquee(ph: Phase, m: Metrics): ReactNode {
  // 那一格撑开以后，左边才开始渐隐（一开始 Soft 不能被遮掉）
  const open = clamp01((ph.slotW - m.soft) / Math.max(1, m.max - m.soft));
  const mask = `linear-gradient(to right, rgb(0 0 0 / ${(1 - open).toFixed(2)}), #000 1.4em)`;
  const stream = ['Soft', ...defs, 'x'];
  const widthOf = (item: string) =>
    item === 'Soft' ? m.soft : item === 'x' ? m.x : m.widths[item];
  const rights: number[] = [];
  let x = 0;
  stream.forEach((item, i) => {
    x += widthOf(item);
    rights.push(x);
    x += i < stream.length - 1 ? m.sep : 0;
  });
  const s = stop(ph.p);
  const base = Math.min(stream.length - 1, Math.floor(s));
  const next = Math.min(stream.length - 1, base + 1);
  const offset = rights[base] + (rights[next] - rights[base]) * (s - base);
  return (
    <span
      className="g-sl-window"
      style={{ width: ph.slotW, WebkitMaskImage: mask, maskImage: mask }}
    >
      <span
        className="g-sl-stream"
        style={{ transform: `translateX(${(-offset).toFixed(1)}px)` }}
      >
        {stream.map((item, i) => (
          <span
            key={item}
            style={
              item === 'x'
                ? undefined
                : {
                    opacity: 1 - easeOut(range(ph.p, T.x0 + 0.02, T.x1 + 0.02)),
                  }
            }
          >
            {item === 'x' ? (
              <XEntry />
            ) : (
              <span className={item === 'Soft' ? 'g-sl-soft' : 'g-sl-word'}>
                {item}
              </span>
            )}
            {i < stream.length - 1 ? (
              <span className="g-sl-sep"> · </span>
            ) : null}
          </span>
        ))}
      </span>
    </span>
  );
}

/** 05 转轮：所有定义排在一个竖着的圆柱上，滚动带着它转，当前那一面贴着 ware，上下几面斜着露出来 */
function Ring(ph: Phase): ReactNode {
  const stream = ['Soft', ...defs, 'x'];
  const step = 360 / stream.length;
  const s = stop(ph.p);
  return (
    <span className="g-sl-drum">
      {stream.map((item, j) => {
        const a = (j - s) * step;
        const visible = Math.abs(a) < 88;
        const c = Math.cos((a * Math.PI) / 180);
        return (
          <span
            key={item}
            className="g-sl-item g-sl-face"
            style={{
              transform: `translateZ(-1.25em) rotateX(${(-a).toFixed(1)}deg) translateZ(1.25em)`,
              // 上下几面在 Soft 开始被重新定义时才露出来，收尾时退掉
              opacity: visible
                ? Math.max(0, c) ** 2.2 *
                  (Math.abs(a) < step / 2
                    ? 1
                    : easeOut(range(ph.p, 0.1, 0.2)) * (1 - ph.end))
                : 0,
            }}
          >
            {item === 'x' ? (
              <XEntry />
            ) : (
              <span className={item === 'Soft' ? 'g-sl-soft' : 'g-sl-word'}>
                {item}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

/** 06 波浪：旧词的字母像一道浪往上散开，新词的字母从下面一个接一个涌上来，带一点回弹 */
function Wave(ph: Phase): ReactNode {
  const rise = (u: number) => (r: number, n: number) => {
    const s = stagger(u, n - 1 - r, n, 0.6);
    const y = (1 - easeOut(s)) * 0.6 - Math.sin(s * Math.PI) * 0.12;
    return {
      transform: `translateY(${y.toFixed(3)}em)`,
      opacity: clamp01(s * 1.6),
    };
  };
  const sink = (u: number) => (r: number, n: number) => {
    const s = stagger(u, n - 1 - r, n, 0.6);
    return {
      transform: `translateY(${(-easeOut(s) * 0.55).toFixed(3)}em)`,
      opacity: 1 - s,
      filter: `blur(${(s * 6).toFixed(1)}px)`,
    };
  };
  const k = current(ph);
  if (k === -1)
    return <Letters text="Soft" className="g-sl-soft" style={sink(ph.soft)} />;
  if (k < N) {
    const t = local(ph, k);
    return (
      <Letters
        key={defs[k]}
        text={defs[k]}
        className="g-sl-word"
        style={t < 0.5 ? rise(range(t, 0, 0.3)) : sink(range(t, 0.76, 1))}
      />
    );
  }
  const s = easeOut(ph.x);
  return (
    <span
      className="g-sl-item"
      style={{
        transform: `translateY(${((1 - s) * 0.6 - Math.sin(ph.x * Math.PI) * 0.12).toFixed(3)}em)`,
        opacity: clamp01(ph.x * 1.6),
      }}
    >
      <XEntry />
    </span>
  );
}

/** 07 划改：一道细线划掉 Soft；新的定义像编辑的批注一样写在它上方，一个换一个；最后 x 落进这一行 */
function Strike(ph: Phase): ReactNode {
  const strike = easeOut(range(ph.p, 0.1, 0.22));
  const k = current(ph);
  const land = easeOut(range(ph.p, T.x0 + 0.02, T.x1));
  const notes: ReactNode[] = [];
  defs.forEach((d, i) => {
    const t = local(ph, i);
    if (t < -0.05 || t > 1.05) return;
    const enter = easeOut(range(t, 0, 0.25));
    const leave = easeOut(range(t, 0.72, 1));
    notes.push(
      <span
        key={d}
        className="g-sl-note"
        style={{
          opacity: enter * (1 - leave),
          transform: `translateY(${((1 - enter) * 0.25 - leave * 0.25).toFixed(3)}em)`,
        }}
      >
        {d}
      </span>,
    );
  });
  return (
    <>
      <span
        className="g-sl-item g-sl-soft g-sl-struck"
        style={
          {
            '--strike': strike,
            opacity: 1 - land,
          } as CSSProperties
        }
      >
        Soft
      </span>
      {notes}
      {k === N ? (
        <span
          className="g-sl-item g-sl-landing"
          style={{
            opacity: clamp01(ph.x * 3),
            transform: `translateY(${(-(1 - land) * 0.95).toFixed(3)}em) scale(${(0.42 + land * 0.58).toFixed(3)})`,
          }}
        >
          <XEntry />
        </span>
      ) : null}
    </>
  );
}

/** 08 纵深：所有定义排在 Soft 后面的纵深里；往下滚就是往前走，Soft 迎面掠过、散开，后面的词一个个走近、对焦 */
function Depth(ph: Phase): ReactNode {
  const stream = ['Soft', ...defs, 'x'];
  const camera = stop(ph.p);
  return (
    <>
      {stream.map((item, j) => {
        const d = j - camera;
        if (d > 3 || d < -1) return null;
        const style: CSSProperties =
          d >= 0
            ? {
                transform: `scale(${(1 / (1 + d * 0.6)).toFixed(3)})`,
                // 排在后面的词只在走近的那一段出现，停着时画面上只有当前这一个
                opacity: clamp01(1 - d) ** 1.4,
                filter: `blur(${(d * 8).toFixed(1)}px)`,
              }
            : {
                transform: `scale(${(1 - d * 0.9).toFixed(3)})`,
                opacity: clamp01(1 + d * 1.8),
                filter: `blur(${(-d * 12).toFixed(1)}px)`,
              };
        return (
          <span key={item} className="g-sl-item g-sl-deep" style={style}>
            {item === 'x' ? (
              <XEntry />
            ) : (
              <span className={item === 'Soft' ? 'g-sl-soft' : 'g-sl-word'}>
                {item}
              </span>
            )}
          </span>
        );
      })}
    </>
  );
}

/** 09 遮盖：一条墨色的块从 ware 那边推过来盖住 Soft；每次退开，底下已经换成一个新词；最后退开露出 x，留下一道杏色细线 */
function Redact(ph: Phase, m: Metrics): ReactNode {
  const k = current(ph);
  const widthOf = (i: number) =>
    i === -1 ? m.soft : i === N ? m.x : m.widths[defs[i]];
  const pad = m.em * 0.06;
  let bar = 0;
  let shown: ReactNode = null;
  if (k === -1) {
    // Soft 先被盖住（从右往左盖），再变成第一个词的宽度
    const cover = easeOut(range(ph.p, 0.1, 0.2));
    const morph = smooth(range(ph.p, 0.2, T.w0));
    bar = (m.soft + (widthOf(0) - m.soft) * morph) * cover;
    shown = <span className="g-sl-soft">Soft</span>;
  } else if (k < N) {
    const t = local(ph, k);
    const reveal = easeOut(range(t, 0, 0.24));
    const cover = easeOut(range(t, 0.7, 0.86));
    const morph = smooth(range(t, 0.86, 1));
    const w = widthOf(k);
    bar =
      t < 0.5 ? w * (1 - reveal) : (w + (widthOf(k + 1) - w) * morph) * cover;
    shown = <span className="g-sl-word">{defs[k]}</span>;
  } else {
    bar = m.x * (1 - easeOut(range(ph.x, 0, 0.6)));
    shown = <XEntry />;
  }
  const rule = easeOut(range(ph.p, T.x1 - 0.02, T.end0 + 0.02));
  return (
    <>
      <span className="g-sl-item">{shown}</span>
      <span
        className="g-sl-bar"
        style={{ width: bar > 0.5 ? bar + pad * 2 : 0, right: -pad }}
      />
      {k === N ? (
        <span
          className="g-sl-rule"
          style={{ width: m.x * 0.62 * rule, right: m.x * 0.38 }}
        />
      ) : null}
    </>
  );
}

export default function SayLab() {
  const list: {
    id: string;
    name: string;
    idea: string;
    mine?: boolean;
    render: Render;
  }[] = [
    {
      id: 'type',
      name: '打字机',
      idea: '光标停在 ware 前面，Soft 被一个字母一个字母退格删掉；新的词逐字打出来，停一下，再删掉，换下一个；最后打下 x，光标熄灭。像我们正在把这个词重写。',
      render: Typewriter,
    },
    {
      id: 'flip',
      name: '翻牌',
      idea: '像车站的翻牌：每个字母绕着横轴翻过去，下一张翻上来，从贴着 ware 的那个字母开始一路翻到左边。机械、利落。',
      render: Flip,
    },
    {
      id: 'blinds',
      name: '百叶窗',
      idea: '字被切成六条横条，像百叶一条条合上，再一条条翻开，变成下一个词。',
      render: Blinds,
    },
    {
      id: 'marquee',
      name: '跑马灯',
      idea: 'Soft 后面排着一整串新定义，用小圆点隔开。往下滚，这一串像跑马灯一样从 ware 里面钻出来往左走，每个词贴着 ware 停一下；走过去的词在左边慢慢淡掉。',
      render: Marquee,
    },
    {
      id: 'ring',
      name: '转轮',
      idea: '所有定义排在一个竖着的圆柱上（参考环形轮播），往下滚圆柱就转一格，当前那一面贴着 ware，上下几面斜着露出来、越往后越淡。',
      render: Ring,
    },
    {
      id: 'wave',
      name: '波浪',
      idea: '旧词的字母像一道浪往上散开，新词的字母从下面一个接一个涌上来，带一点回弹，浪从左往右推到 ware。',
      render: Wave,
    },
    {
      id: 'strike',
      name: '划改',
      mine: true,
      idea: '一道细线干脆地划掉 Soft；新的定义像编辑的批注，用斜体小字写在它上方，一个换一个；最后 x 从批注的位置落进这一行，替掉 Soft。态度最明确：我们在改写这个词。',
      render: Strike,
    },
    {
      id: 'depth',
      name: '纵深',
      mine: true,
      idea: '所有定义排在 Soft 后面的纵深里。往下滚就是往前走：Soft 迎面掠过、散开，后面的词一个个走近、对上焦，再掠过；最后停在 x。和首页展厅的推镜是同一种感觉。',
      render: Depth,
    },
    {
      id: 'redact',
      name: '遮盖',
      mine: true,
      idea: '一块墨色的条从 ware 那边推过来盖住 Soft，像文件里被涂黑的词；每次退开，底下已经换成一个新的词；最后退开露出 x，在它下面留下一道杏色细线。黑白分明，最有态度。',
      render: Redact,
    },
  ];
  return (
    <Shell compact>
      <section className="g-sl-intro" aria-labelledby="g-sl-title">
        <p className="g-sl-intro-kicker">
          <Link href={HOME}>首页</Link> / 品牌一句话 · 第三轮
        </p>
        <h1 id="g-sl-title">We build Software → x‑ware</h1>
        <p className="g-sl-intro-text">
          首屏和产品之间的一段过渡，跟着滚动走，只有一行字。We build 和 ware
          的位置锁定；Soft 被重新定义掉；新的定义一个个出现；最后 We build
          退场，x‑ware 移到正中定格。九个方案只在「Soft
          怎么被重新定义、新词怎么出现」上不同，往下滚动看。
        </p>
        <ol className="g-sl-intro-list">
          {list.map((item, i) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>
                {String(i + 1).padStart(2, '0')} {item.name}
              </a>
            </li>
          ))}
        </ol>
      </section>
      {list.map((item, i) => (
        <Variant
          key={item.id}
          id={item.id}
          number={i + 1}
          name={item.name}
          idea={item.idea}
          mine={item.mine}
          render={item.render}
        />
      ))}
      <div className="g-sl-after" aria-hidden="true">
        <span lang="en">Products</span>
      </div>
    </Shell>
  );
}
