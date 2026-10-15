'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { useReducedMotion } from '../../../../_site/motion';
import { clamp, ease, lerp, smooth, useFollow } from '../follow';
import media from '../media.json';

// Work 页的主角：拖动「三天」，跟着一件工作走过真实的工作台。
// 画面全是 Molis Work 开发中版本（soft-workbench，2026-09-29）的真实截图，只做裁切、放大和打光，不改内容；
// 日期、项目和文字都来自截图里的演示数据：9/15 信息流来了一篇文章，9/28 Goal 记下进展，9/29 早上接着做。
// 拖下面的时间尺、或在画面上左右拖（点一下往前走一格），镜头在同一张截图里平移、推近，
// 换到下一张截图时先退远、溶过去、再推近；一圈苔绿的光框住这一格要看的地方，其余压一层纸色。
// 松手吸到最近的一格。减少动态时没有追随的缓动，镜头直接落在每一格。

type Shot = 'onboarding-zh' | 'feed-zh' | 'goals-zh' | 'home-zh' | 'phone-zh';
type Rect = [number, number, number, number];

const W0 = 1440;
const H0 = 1000;
const FULL: Rect = [0, 0, W0, H0];
const MAXZ = 1.6;

type Stop = {
  shot: Shot;
  r: Rect;
  day: number;
  when: string;
  where: string;
  text: string;
  chapter: string;
};

export const days = ['起点', '9/15', '9/28', '9/29'];

export const stops: Stop[] = [
  {
    shot: 'onboarding-zh',
    r: [236, 186, 480, 534],
    day: 0,
    when: '起点',
    where: '首次使用',
    text: '开一个项目：带上文件、网页和聊天记录。',
    chapter: '按这段工作的需要，布置工作台',
  },
  {
    shot: 'feed-zh',
    r: [22, 484, 342, 112],
    day: 1,
    when: '9/15 21:25',
    where: 'Feed',
    text: '信息流里，来了一篇文章。',
    chapter: '按这段工作的需要，布置工作台',
  },
  {
    shot: 'feed-zh',
    r: [536, 104, 724, 280],
    day: 1,
    when: '9/15 21:25',
    where: 'Feed',
    text: '读下去：它和这个项目的 Goal 直接相关。',
    chapter: '按这段工作的需要，布置工作台',
  },
  {
    shot: 'feed-zh',
    r: [540, 476, 712, 64],
    day: 1,
    when: '9/15',
    where: 'Feed',
    text: '加入 Inbox、存为资料，还是升格为 Goal，由你定。',
    chapter: '按这段工作的需要，布置工作台',
  },
  {
    shot: 'goals-zh',
    r: [22, 132, 268, 790],
    day: 2,
    when: '9/28 10:40',
    where: 'Goals',
    text: '目标拆成一棵树：待开始、受阻、已完成。',
    chapter: '工作做到哪里，有记录，也有依据',
  },
  {
    shot: 'goals-zh',
    r: [462, 296, 794, 178],
    day: 2,
    when: '9/28 10:40',
    where: 'Goals',
    text: '下一步和完成依据，写在同一页。',
    chapter: '工作做到哪里，有记录，也有依据',
  },
  {
    shot: 'goals-zh',
    r: [468, 566, 786, 356],
    day: 2,
    when: '9/28 10:40',
    where: 'Goals',
    text: '每一次推进，都记在时间线上。',
    chapter: '工作做到哪里，有记录，也有依据',
  },
  {
    shot: 'goals-zh',
    r: [1256, 34, 164, 42],
    day: 2,
    when: '9/28',
    where: 'Goals',
    text: '终端就在一个开关之外；Codex、Claude Code 读写的是同一份 Goal。',
    chapter: '你和 AI，接着同一份内容工作',
  },
  {
    shot: 'home-zh',
    r: [140, 276, 852, 300],
    day: 3,
    when: '9/29 10:00',
    where: '项目首页',
    text: '第二天早上，从「继续这个目标」接着做。',
    chapter: '让工作，在人、工具与 AI 之间继续',
  },
  {
    shot: 'home-zh',
    r: [386, 934, 668, 58],
    day: 3,
    when: '9/29 10:00',
    where: '项目首页',
    text: '对话在底栏：让助理做点什么。',
    chapter: '你和 AI，接着同一份内容工作',
  },
  {
    shot: 'phone-zh',
    r: FULL,
    day: 3,
    when: '9/29',
    where: '手机宽度',
    text: '窄屏上，还是同一张工作台。',
    chapter: '让工作，在人、工具与 AI 之间继续',
  },
];

const N = stops.length;
const shots: Shot[] = [
  'onboarding-zh',
  'feed-zh',
  'goals-zh',
  'home-zh',
  'phone-zh',
];
/** 每天的第一格：正文里的词点下去跳到这里 */
export const firstOf = (shot: Shot) => stops.findIndex((s) => s.shot === shot);

/** 时间尺上的位置：同一天的格子挨着，天与天之间空出一截 */
const GAP = 0.9;
const slot = stops.map((s, i) => i + s.day * GAP);
const total = slot[N - 1];
const xOf = (p: number) => {
  if (p <= 0) return 0;
  const i = Math.min(N - 2, Math.floor(p));
  return lerp(slot[i], slot[i + 1], p - i) / total;
};
const pOf = (x: number) => {
  const v = clamp(x, 0, 1) * total;
  for (let i = 0; i < N - 1; i += 1) {
    if (v <= slot[i + 1])
      return i + (v - slot[i]) / (slot[i + 1] - slot[i]);
  }
  return N - 1;
};

const mixRect = (a: Rect, b: Rect, t: number): Rect => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
  lerp(a[3], b[3], t),
];

/** p 从 -1 开始：-1 是第一张截图的全景，0 是第一格；进入视口时从全景推近到第一格 */
function shotAt(p: number) {
  const pin = clamp(p, -1, N - 1);
  if (pin < 0) {
    const t = ease(pin + 1);
    return {
      rect: mixRect(FULL, stops[0].r, t),
      veil: t,
      a: stops[0].shot,
      b: stops[0].shot,
      mix: 0,
    };
  }
  const i = Math.min(N - 2, Math.floor(pin));
  const f = pin - i;
  const A = stops[i];
  const B = stops[i + 1];
  if (A.shot === B.shot)
    return { rect: mixRect(A.r, B.r, ease(f)), veil: 1, a: A.shot, b: B.shot, mix: 0 };
  // 换截图：先退到全景，溶过去，再推近
  const rect =
    f < 0.5 ? mixRect(A.r, FULL, ease(f * 2)) : mixRect(FULL, B.r, ease(f * 2 - 1));
  return {
    rect,
    veil: B.shot === 'phone-zh' ? (f < 0.5 ? 1 - ease(f * 2) : 0) : Math.abs(1 - 2 * f) ** 0.8,
    a: A.shot,
    b: B.shot,
    mix: smooth(0.3, 0.7, f),
  };
}

function camera(rect: Rect, w: number, h: number) {
  const [rx, ry, rw, rh] = rect;
  const s = clamp(Math.min((0.86 * W0) / rw, (0.82 * H0) / rh), 1, MAXZ);
  const cx = ((rx + rw / 2) / W0) * w;
  const cy = ((ry + rh / 2) / H0) * h;
  const tx = clamp(w / 2 - s * cx, w - s * w, 0);
  const ty = clamp(h / 2 - s * cy, h - s * h, 0);
  return {
    s,
    tx,
    ty,
    box: [
      tx + (s * rx * w) / W0,
      ty + (s * ry * h) / H0,
      (s * rw * w) / W0,
      (s * rh * h) / H0,
    ],
  };
}

export function Thread() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLSpanElement>(null);
  const layers = useRef<Partial<Record<Shot, HTMLElement | null>>>({});
  const ruler = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const size = useRef({ w: 1, h: 1 });
  const [at, setAt] = useState(0);
  const [touched, setTouched] = useState(false);
  const swipe = useRef<{ id: number; x: number; p: number; moved: boolean } | null>(
    null,
  );
  const scrub = useRef<number | null>(null);

  const draw = useCallback((p: number) => {
    const { w, h } = size.current;
    const view = shotAt(p);
    const c = camera(view.rect, w, h);
    if (cam.current)
      cam.current.style.transform = `translate3d(${c.tx.toFixed(2)}px, ${c.ty.toFixed(2)}px, 0) scale(${c.s.toFixed(4)})`;
    const node = spot.current;
    if (node) {
      const pad = 6;
      node.style.transform = `translate3d(${(c.box[0] - pad).toFixed(1)}px, ${(c.box[1] - pad).toFixed(1)}px, 0)`;
      node.style.width = `${(c.box[2] + pad * 2).toFixed(1)}px`;
      node.style.height = `${(c.box[3] + pad * 2).toFixed(1)}px`;
      node.style.opacity = view.veil.toFixed(3);
    }
    for (const shot of shots) {
      const layer = layers.current[shot];
      if (!layer) continue;
      const o = shot === view.a ? 1 : shot === view.b ? view.mix : 0;
      layer.style.opacity = o.toFixed(3);
      layer.style.visibility = o > 0 ? 'visible' : 'hidden';
    }
    const x = xOf(p);
    root.current?.style.setProperty('--tx', x.toFixed(4));
    const index = clamp(Math.round(p), 0, N - 1);
    setAt((current) => (current === index ? current : index));
    knob.current?.setAttribute('aria-valuenow', String(index + 1));
    knob.current?.setAttribute(
      'aria-valuetext',
      `${stops[index].when}，${stops[index].where}：${stops[index].text}`,
    );
  }, []);

  const follow = useFollow(-1, draw, reduced);

  // 量画面大小；变了就按当前位置重画
  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.contentRect;
      size.current = { w: box.width, h: box.height };
      draw(follow.value());
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [draw, follow]);

  // 第一次进入视口：从全景推近到第一格
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (reduced) {
      follow.jump(0);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        window.setTimeout(() => {
          if (follow.target() < 0) follow.to(0, 900);
        }, 500);
      },
      { threshold: 0.55 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, follow]);

  const playing = useRef(0);
  const [auto, setAuto] = useState(false);
  const stopPlay = () => {
    playing.current += 1;
    setAuto(false);
  };

  const go = (index: number, glide: boolean | number = true) => {
    setTouched(true);
    stopPlay();
    follow.to(clamp(index, 0, N - 1), glide);
  };

  /** 点正文里的「三天」：从头自己走一遍，每格停一会儿；再点停下 */
  const playAll = async () => {
    if (auto) {
      stopPlay();
      return;
    }
    setTouched(true);
    const token = ++playing.current;
    setAuto(true);
    const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
    let from = Math.round(follow.target());
    if (from >= N - 1) from = -1;
    for (let index = from + 1; index < N; index += 1) {
      if (playing.current !== token) return;
      follow.to(index, reduced ? false : 700);
      await wait(reduced ? 1800 : 2300);
    }
    if (playing.current === token) setAuto(false);
  };

  // 时间尺：按住哪里到哪里
  const pAtRuler = (clientX: number) => {
    const rect = ruler.current?.getBoundingClientRect();
    if (!rect) return 0;
    return pOf((clientX - rect.left) / rect.width);
  };
  const rulerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    setTouched(true);
    stopPlay();
    scrub.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    follow.to(pAtRuler(event.clientX));
  };
  const rulerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (scrub.current !== event.pointerId) return;
    follow.to(pAtRuler(event.clientX));
  };
  const rulerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (scrub.current !== event.pointerId) return;
    scrub.current = null;
    go(Math.round(follow.target()));
  };

  // 画面：左右拖，像推着一卷胶片；点一下往前走一格
  const frameDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    setTouched(true);
    stopPlay();
    swipe.current = {
      id: event.pointerId,
      x: event.clientX,
      p: Math.max(0, follow.target()),
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const frameMove = (event: PointerEvent<HTMLDivElement>) => {
    const s = swipe.current;
    if (!s || s.id !== event.pointerId) return;
    const dx = event.clientX - s.x;
    if (Math.abs(dx) > 4) s.moved = true;
    if (!s.moved) return;
    follow.to(clamp(s.p - dx / (size.current.w * 0.3), 0, N - 1));
  };
  const frameUp = (event: PointerEvent<HTMLDivElement>) => {
    const s = swipe.current;
    if (!s || s.id !== event.pointerId) return;
    swipe.current = null;
    if (!s.moved) {
      go(Math.round(s.p) + 1 > N - 1 ? 0 : Math.round(s.p) + 1);
      return;
    }
    const dx = event.clientX - s.x;
    let next = Math.round(follow.target());
    if (next === Math.round(s.p) && Math.abs(dx) > 28)
      next += dx < 0 ? 1 : -1;
    go(next);
  };

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = Math.round(follow.target());
    const map: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowUp: current + 1,
      ArrowLeft: current - 1,
      ArrowDown: current - 1,
      Home: 0,
      End: N - 1,
    };
    if (!(event.key in map)) return;
    event.preventDefault();
    go(map[event.key]);
  };

  return (
    <div className="pl-thread" ref={root} style={{ '--tx': 0 } as CSSProperties}>
      <header className="pl-thread-head">
        <p className="pl-cap" lang="en">
          Three days <span aria-hidden="true">·</span> One piece of work
        </p>
        <h2 className="pl-thread-line" id="pl-thread-title">
          拖动
          <button
            type="button"
            className="pl-key"
            data-c="moss"
            aria-pressed={auto}
            onClick={playAll}
            title={auto ? '停下' : '自己走一遍'}
          >
            三天
          </button>
          ，<span className="pl-nb">跟着一件工作走。</span>
        </h2>
        <p className="pl-thread-sub">
          从
          <button type="button" className="pl-key" data-c="moss" onClick={() => go(firstOf('feed-zh'))}>
            Feed
          </button>
          里的一篇文章，到
          <button type="button" className="pl-key" data-c="moss" onClick={() => go(firstOf('goals-zh'))}>
            Goals
          </button>
          里的一页记录，再到第二天早上的
          <button type="button" className="pl-key" data-c="moss" onClick={() => go(firstOf('home-zh'))}>
            项目首页
          </button>
          。
        </p>
      </header>
      <div className="pl-say-work" aria-live="polite">
        {stops.map((stop, index) => (
          <div
            key={index}
            className="pl-stop"
            data-on={index === at || undefined}
            aria-hidden={index !== at}
          >
            <p className="pl-stop-when" lang="en">
              {stop.when}
            </p>
            <p className="pl-cap">{stop.where}</p>
            <p className="pl-stop-text">{stop.text}</p>
            <p className="pl-stop-chapter">{stop.chapter}</p>
          </div>
        ))}
        <p className="pl-stop-count" lang="en">
          {String(at + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
        </p>
      </div>

      <div className="pl-bench">
        <div
          className="pl-frame"
          ref={frame}
          onPointerDown={frameDown}
          onPointerMove={frameMove}
          onPointerUp={frameUp}
          onPointerCancel={frameUp}
        >
          <div className="pl-cam" ref={cam}>
            {shots
              .filter((shot) => shot !== 'phone-zh')
              .map((shot, index) => {
                const image = media[shot];
                return (
                  <img
                    key={shot}
                    ref={(node) => {
                      layers.current[shot] = node;
                    }}
                    className="pl-shot"
                    src={image.src}
                    width={image.width}
                    height={image.height}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                    alt=""
                    style={{ opacity: index === 0 ? 1 : 0 }}
                  />
                );
              })}
          </div>
          <div
            className="pl-phone"
            ref={(node) => {
              layers.current['phone-zh'] = node;
            }}
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <img
              src={media['phone-zh'].src}
              width={media['phone-zh'].width}
              height={media['phone-zh'].height}
              loading="lazy"
              decoding="async"
              draggable={false}
              alt=""
            />
          </div>
          <span className="pl-spot" ref={spot} aria-hidden="true" />
          <span className="pl-frame-hint" data-gone={touched || undefined} aria-hidden="true">
            ← 拖，或点一下 →
          </span>
        </div>

        <div
          className="pl-days"
          ref={ruler}
          onPointerDown={rulerDown}
          onPointerMove={rulerMove}
          onPointerUp={rulerUp}
          onPointerCancel={rulerUp}
        >
          <span className="pl-days-line" aria-hidden="true" />
          <span className="pl-days-fill" aria-hidden="true" />
          {stops.map((stop, index) => (
            <span
              key={index}
              className="pl-days-tick"
              data-on={index === at || undefined}
              data-past={index < at || undefined}
              style={{ left: `${(slot[index] / total) * 100}%` }}
              aria-hidden="true"
            />
          ))}
          {days.map((day, d) => {
            const list = stops
              .map((stop, index) => ({ stop, index }))
              .filter(({ stop }) => stop.day === d);
            const from = slot[list[0].index] / total;
            const to = slot[list.at(-1)!.index] / total;
            return (
              <span
                key={day}
                className="pl-days-label"
                data-on={stops[at].day === d || undefined}
                style={{ left: `${((from + to) / 2) * 100}%` }}
                lang="en"
                aria-hidden="true"
              >
                {day}
              </span>
            );
          })}
          <div
            ref={knob}
            className="pl-knob"
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- 自定义拖动的把手，键盘照 slider 的约定操作
            role="slider"
            tabIndex={0}
            aria-label="跟着这件工作走：第几格"
            aria-valuemin={1}
            aria-valuemax={N}
            aria-valuenow={1}
            onKeyDown={onKey}
          />
        </div>
        <p className="pl-honest">
          <span className="pl-tag">开发中版本截图</span>
          Molis Work 现在的工作台（2026-09-29），只做裁切、放大和打光；日期、项目与文字来自演示数据。
        </p>
      </div>
    </div>
  );
}
