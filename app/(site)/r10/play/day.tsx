'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import {
  productIds,
  products,
  type ProductId,
} from '../../../../content/site/products';
import { useReducedMotion } from '../../../_site/motion';
import { TONE_EVENT } from './chrome';
import { clamp, smooth, useFollow } from './follow';
import media from './media.json';

// 首页的主角：拨一天。结构仍是「左列表、右舞台」：左边五件产品，右边一扇照片窗和一把刻度尺。
// 拖太阳（或者直接在照片上左右拖），时间走到哪里，窗里的光就变到哪里：清晨的雾、午后、傍晚的暖光、夜里的蓝；
// 太阳经过哪件产品的时刻，那件产品就出现在舞台上。夜里整屏跟着暗下来，过了午夜是一段虚线的「周末」，
// World 在那里（概念）。正文里的「太阳」和尺子上的太阳同色，点它会自己走一遍一天。
// 时刻是示意；画面是负责人的品牌概念图（雾感版），每件产品各一张，不是产品界面。
// 减少动态时不自己走，停在 Work 的时刻；拖、键盘照常可用，只是没有追随的缓动。

const START = 5;
const DAY_END = 24;
const WEEKEND = 24.5;
const END = 26.2;
const span = END - START;
const frac = (t: number) => (t - START) / span;

type Photo = keyof typeof media;

const moments: Record<
  ProductId,
  { at: number; clock: string; photo: Photo; caption: string; href: string }
> = {
  work: {
    at: 9.5,
    clock: '09:30',
    photo: 'work-a',
    caption: '接着做下去',
    href: '/r10/play/work',
  },
  tool: {
    at: 13,
    clock: '13:00',
    photo: 'tool-a',
    caption: '光的刻度',
    href: '/tool',
  },
  life: {
    at: 16,
    clock: '16:00',
    photo: 'life-a',
    caption: '空出来的午后',
    href: '/life',
  },
  story: {
    at: 21.5,
    clock: '21:30',
    photo: 'story-a',
    caption: '下一页，另一片海',
    href: '/story',
  },
  world: {
    at: 25.4,
    clock: '周末',
    photo: 'world-a',
    caption: '一座尚未命名的小岛',
    href: '/world',
  },
};

/** 相邻两件产品的分界：太阳过了分界，舞台换成下一件 */
const bounds = [11.25, 14.5, 18.75, 23.9];
const activeAt = (t: number) => {
  const index = bounds.findIndex((b) => t < b);
  return index === -1 ? productIds.length - 1 : index;
};

/** 太阳高度：日出 6 点、日落 19 点 12 分；周末那段当作上午 */
function elevation(t: number) {
  if (t > DAY_END) return 0.5 * smooth(24.1, 24.9, t);
  if (t < 6 || t > 19.2) return 0;
  return Math.sin((Math.PI * (t - 6)) / 13.2);
}
/** 夜色 0…1：清晨偏蓝、入夜变深，进了周末又亮起来 */
function nightAt(t: number) {
  if (t > DAY_END) return 1 - smooth(24.05, 24.8, t);
  return Math.max(0.5 * (1 - smooth(5, 6.9, t)), smooth(18.7, 21.4, t));
}
/** 暖光：早上一点，傍晚多一点 */
const warmAt = (t: number) =>
  0.45 * Math.exp(-(((t - 7.2) / 0.9) ** 2)) +
  0.9 * Math.exp(-(((t - 18) / 1.15) ** 2));

function clockOf(t: number) {
  if (t > DAY_END + 0.15) return '周末';
  const minutes = Math.round((Math.min(t, DAY_END) * 60) / 5) * 5;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const pad = (n: number) => String(n).padStart(2, '0');
// 24 点不写：虚线的「周末」从午夜开始，写上会和它挤在一起
const hours = [6, 9, 12, 15, 18, 21];
const ARC = 64;
const arcPath = (() => {
  const points: string[] = [];
  for (let t = 6; t <= 19.2001; t += 0.2) {
    points.push(
      `${(frac(t) * 1000).toFixed(1)},${(100 - elevation(t) * ARC).toFixed(1)}`,
    );
  }
  return `M${points.join(' L')}`;
})();

export function Day() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<number[]>([0]);
  const [touched, setTouched] = useState(false);
  const [playing, setPlaying] = useState(false);
  const night = useRef(false);
  const play = useRef(0);
  const intent = useRef(0);
  const drag = useRef<{ id: number; x: number; y: number; on: boolean } | null>(
    null,
  );

  const draw = useCallback((t: number) => {
    const node = root.current;
    if (!node) return;
    const e = elevation(t);
    const n = nightAt(t);
    const style = node.style;
    style.setProperty('--x', frac(t).toFixed(4));
    style.setProperty('--lift', (e * ARC).toFixed(1));
    style.setProperty('--night', n.toFixed(3));
    style.setProperty('--warm', warmAt(t).toFixed(3));
    bounds.forEach((b, i) =>
      style.setProperty(`--w${i + 1}`, smooth(b - 0.9, b + 0.9, t).toFixed(3)),
    );
    const moon = e < 0.03 && t < WEEKEND;
    node.dataset.moon = moon ? 'true' : 'false';
    const dark = n > 0.5;
    if (dark !== night.current) {
      night.current = dark;
      node.dataset.tone = dark ? 'film' : 'paper';
      window.dispatchEvent(new Event(TONE_EVENT));
    }
    const text = clockOf(t);
    if (clock.current && clock.current.textContent !== text)
      clock.current.textContent = text;
    const index = activeAt(t);
    setActive((current) => (current === index ? current : index));
    // 走过的时刻留一个实心点
    setSeen((list) => (list.includes(index) ? list : [...list, index]));
    const slider = handle.current;
    if (slider) {
      slider.setAttribute('aria-valuenow', t.toFixed(2));
      slider.setAttribute(
        'aria-valuetext',
        `${text}，${products[productIds[index]].name}`,
      );
    }
  }, []);

  const follow = useFollow(5.6, draw, reduced);

  const stopPlay = useCallback(() => {
    play.current += 1;
    setPlaying(false);
  }, []);

  // 第一次进入视口：太阳自己升起来，停在 Work 的时刻；减少动态时直接停在那里
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (reduced) {
      follow.jump(moments.work.at);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        if (!drag.current) follow.to(moments.work.at, 1100);
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, follow]);

  useEffect(() => () => window.clearTimeout(intent.current), []);

  const touch = () => {
    setTouched(true);
    stopPlay();
  };

  const timeAt = (clientX: number) => {
    const rect = track.current?.getBoundingClientRect();
    if (!rect) return follow.target();
    return START + clamp((clientX - rect.left) / rect.width, 0, 1) * span;
  };

  // 鼠标按下就开始拨；手指要先明显地横着动一下才算拨（竖着划是在滚页面，太阳不动），
  // 手指只点一下不动，就走到下一件产品的时刻。
  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const mouse = event.pointerType === 'mouse';
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      on: mouse,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // 合成事件没有真的指针，抓不住也照常拨
    }
    if (mouse) {
      touch();
      follow.to(timeAt(event.clientX));
    }
  };
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d?.id !== event.pointerId) return;
    if (!d.on) {
      const dx = Math.abs(event.clientX - d.x);
      const dy = Math.abs(event.clientY - d.y);
      if (dx < 6 || dx < dy) return;
      d.on = true;
      touch();
    }
    follow.to(timeAt(event.clientX));
  };
  const onUp = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d?.id !== event.pointerId) return;
    drag.current = null;
    if (!d.on) {
      // 手指点一下：下一件产品；被浏览器拿去滚动（pointercancel）就什么都不做
      if (event.type === 'pointerup') {
        touch();
        const t = follow.target();
        const next = productIds.map((id) => moments[id].at).find((at) => at > t + 0.05);
        follow.to(next ?? moments.work.at, true);
      }
      return;
    }
    // 松手时，离某件产品的时刻很近就吸过去
    const t = follow.target();
    const near = productIds
      .map((id) => moments[id].at)
      .find((at) => Math.abs(at - t) < 1.1);
    if (near !== undefined) follow.to(near, true);
    else if (t > DAY_END && t < WEEKEND) follow.to(WEEKEND, true);
  };

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const t = follow.target();
    const ats = productIds.map((id) => moments[id].at);
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = t + 0.25;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = t - 0.25;
    if (event.key === 'PageUp') next = ats.find((at) => at > t + 0.01) ?? END;
    if (event.key === 'PageDown')
      next = [...ats].reverse().find((at) => at < t - 0.01) ?? START;
    if (event.key === 'Home') next = START;
    if (event.key === 'End') next = END;
    if (next === null) return;
    event.preventDefault();
    touch();
    follow.to(clamp(next, START, END), event.key.startsWith('Arrow') ? false : true);
  };

  /** 点正文里的「太阳」：从现在的时刻起，自己走完一天，每个时刻停一下 */
  const playDay = async () => {
    if (playing) {
      stopPlay();
      return;
    }
    setTouched(true);
    const token = ++play.current;
    setPlaying(true);
    const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
    let from = follow.target();
    if (from >= moments.world.at - 0.05) {
      follow.to(5.4, 500);
      await wait(900);
      from = 5.4;
    }
    for (const id of productIds) {
      const at = moments[id].at;
      if (at <= from + 0.05) continue;
      if (play.current !== token) return;
      follow.to(at, reduced ? false : 900);
      await wait(reduced ? 1600 : 2600);
    }
    if (play.current === token) setPlaying(false);
  };

  const pick = (index: number, glide = true) => {
    touch();
    follow.to(moments[productIds[index]].at, glide);
  };

  return (
    <section
      ref={root}
      id="day"
      className="pl-day"
      data-tone="paper"
      data-edge="One day"
      data-moon="true"
      aria-labelledby="pl-day-title"
      style={{ '--x': frac(5.6), '--night': 0.4 } as CSSProperties}
    >
      <div className="pl-day-grid">
        <header className="pl-day-head">
          <p className="pl-cap" lang="en">
            One day <span aria-hidden="true">·</span> Products
          </p>
          <h2 id="pl-day-title" className="pl-day-line">
            拖动
            <button
              type="button"
              className="pl-key"
              data-c="sun"
              aria-pressed={playing}
              onClick={playDay}
              title={playing ? '停下' : '让太阳自己走一遍'}
            >
              太阳
            </button>
            ，过完一天。
          </h2>
          <p className="pl-day-sub">
            五件产品，各在一天里的某个时刻出现。
            <span className="pl-tag">时刻与画面为示意</span>
          </p>
        </header>

        <ol className="pl-list" aria-label="五件产品">
          {productIds.map((id, index) => {
            const product = products[id];
            const moment = moments[id];
            return (
              <li key={id}>
                <Link
                  href={moment.href}
                  className="pl-row"
                  data-active={index === active || undefined}
                  data-seen={seen.includes(index) || undefined}
                  aria-current={index === active ? 'true' : undefined}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== 'mouse') return;
                    window.clearTimeout(intent.current);
                    intent.current = window.setTimeout(() => pick(index), 140);
                  }}
                  onPointerLeave={() => window.clearTimeout(intent.current)}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(':focus-visible'))
                      pick(index);
                  }}
                  onClick={(event) => {
                    if (index === active) return;
                    if (!matchMedia('(hover: hover)').matches) {
                      event.preventDefault();
                      pick(index);
                    }
                  }}
                >
                  <span className="pl-row-time" lang="en">
                    {moment.clock}
                  </span>
                  <span className="pl-row-name" lang="en">
                    {product.name.replace('Molis ', '')}
                  </span>
                  <span
                    className="pl-dot"
                    data-concept={id === 'world' || undefined}
                    aria-hidden="true"
                  />
                  <span className="pl-row-stage">{product.stage}</span>
                </Link>
              </li>
            );
          })}
        </ol>
        <p className="pl-count" lang="en" aria-live="polite">
          {pad(seen.length)} / {pad(productIds.length)}
        </p>

        <div className="pl-stage">
          <p className="pl-clock" ref={clock} lang="en" aria-hidden="true">
            05:35
          </p>
          <div
            className="pl-touch"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <figure className="pl-window">
              {productIds.map((id, index) => {
                const image = media[moments[id].photo] as {
                  src: string;
                  srcset: [string, number][];
                  width: number;
                  height: number;
                  color: string;
                };
                return (
                  <img
                    key={id}
                    className="pl-window-img"
                    style={
                      {
                        '--k': index === 0 ? 1 : `var(--w${index})`,
                        background: image.color,
                      } as CSSProperties
                    }
                    data-first={index === 0 || undefined}
                    src={image.src}
                    srcSet={image.srcset.map(([s, w]) => `${s} ${w}w`).join(', ')}
                    sizes="(max-width: 900px) 100vw, 62vw"
                    width={image.width}
                    height={image.height}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    alt=""
                    draggable={false}
                  />
                );
              })}
              <span className="pl-light pl-light-warm" aria-hidden="true" />
              <span className="pl-light pl-light-night" aria-hidden="true" />
              <span className="pl-light pl-light-lamp" aria-hidden="true" />
              <figcaption className="pl-window-cap">
                {productIds.map((id, index) => (
                  <span key={id} data-on={index === active || undefined}>
                    {moments[id].caption}
                  </span>
                ))}
              </figcaption>
            </figure>

            <div className="pl-ruler" ref={track}>
              <svg
                className="pl-ruler-svg"
                viewBox="0 0 1000 120"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path className="pl-arc" d={arcPath} />
                <line
                  className="pl-base"
                  x1="0"
                  y1="100"
                  x2={frac(DAY_END) * 1000}
                  y2="100"
                />
                <line
                  className="pl-base pl-base-dash"
                  x1={frac(WEEKEND) * 1000}
                  y1="100"
                  x2="1000"
                  y2="100"
                />
              </svg>
              {hours.map((h) => (
                <span
                  key={h}
                  className="pl-hour"
                  data-h={h}
                  lang="en"
                  style={{ left: `${frac(h) * 100}%` }}
                  aria-hidden="true"
                >
                  {pad(h)}
                </span>
              ))}
              <span
                className="pl-hour pl-hour-weekend"
                style={{ left: `${frac((WEEKEND + END) / 2) * 100}%` }}
                aria-hidden="true"
              >
                周末<span className="pl-hour-note"> · 概念</span>
              </span>
              {productIds.map((id, index) => (
                <span
                  key={id}
                  className="pl-mark"
                  data-on={index === active || undefined}
                  data-seen={seen.includes(index) || undefined}
                  style={{ left: `${frac(moments[id].at) * 100}%` }}
                  aria-hidden="true"
                />
              ))}
              <div
                ref={handle}
                className="pl-sun"
                // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- 太阳沿一条弧线移动，原生 range 画不出来；键盘照 slider 的约定操作
                role="slider"
                tabIndex={0}
                aria-label="一天里的时间"
                aria-valuemin={START}
                aria-valuemax={END}
                aria-valuenow={5.6}
                onKeyDown={onKey}
              >
                <span className="pl-sun-disc" />
              </div>
              <span className="pl-hint" data-gone={touched || undefined} aria-hidden="true">
                ← 拖 →
              </span>
            </div>
          </div>

          <div className="pl-says">
            {productIds.map((id, index) => {
              const product = products[id];
              return (
                <article
                  key={id}
                  className="pl-say"
                  data-on={index === active || undefined}
                  inert={index !== active}
                  aria-label={product.name}
                >
                  <h3 className="pl-say-fit">{product.fit}</h3>
                  <p className="pl-say-meta">
                    <strong lang="en">{product.name}</strong>
                    <span className="pl-dot" data-concept={id === 'world' || undefined} />
                    <span>{product.stage}</span>
                    <span className="pl-say-what">{product.overview}</span>
                    <Link className="pl-more" href={moments[id].href}>
                      {id === 'world' ? '看看这个构想' : `了解 ${product.name}`}
                      <span aria-hidden="true"> →</span>
                    </Link>
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
