'use client';
import Link from 'next/link';
import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowDownToLine, Plus } from 'lucide-react';
import { community, communityUi } from '../../../content/site/community';
import { contactHref } from '../../_site/routes';
import { useFlower } from './flower';
import { FlowerArt } from './flower-art';
import { Mascot } from './mascot';

// 结尾（负责人 2026-10-15：原来一张沙滩图配三行大字太草率）：把「沙上那道线」画出来。
// 往下滚，小家伙拖着一根小棍沿线走，身后的线跟着画出来；走过三个停靠点，各冒出一样东西，
// 那句话也一段段写在线下：访客调的那朵花（带着好奇来）、一张票根（带点什么走）、一个空画框（再带点什么回来，点了去分享）。
// 线的尽头是一枚贝壳，走到那里小家伙的灯亮一下。宽屏是一道起伏的线，窄屏是来回折的三行。
// 没有 JS、减少动态时直接是走完的样子。

type Pt = readonly [number, number];
type Layout = {
  box: Pt;
  d: string;
  stops: readonly [Pt, Pt, Pt];
  shell: Pt;
  /** 小家伙停在贝壳前多远（路径单位） */
  short: number;
  /** 没有 JS 时小家伙站的位置 */
  rest: Pt;
};

const LAYOUTS: Record<'wide' | 'tall', Layout> = {
  wide: {
    box: [1200, 420],
    d: 'M -40 210 C 60 206 130 262 220 260 C 350 257 430 148 580 146 C 730 144 790 252 900 250 C 1010 248 1090 202 1150 196',
    stops: [
      [220, 260],
      [580, 146],
      [900, 250],
    ],
    shell: [1150, 196],
    short: 84,
    rest: [1070, 222],
  },
  tall: {
    box: [360, 620],
    d: 'M -20 130 L 250 130 C 345 130 345 320 250 320 L 110 320 C 15 320 15 510 110 510 L 304 510',
    stops: [
      [120, 130],
      [210, 320],
      [170, 510],
    ],
    shell: [304, 510],
    short: 58,
    rest: [246, 510],
  },
};

const pct = ([x, y]: Pt, { box }: Layout) =>
  [`${((x / box[0]) * 100).toFixed(2)}%`, `${((y / box[1]) * 100).toFixed(2)}%`] as const;

/** 同一个点在宽、窄两种排法里的位置，交给 CSS 按断点取用 */
function place(wide: Pt, tall: Pt) {
  const [x, y] = pct(wide, LAYOUTS.wide);
  const [tx, ty] = pct(tall, LAYOUTS.tall);
  return { '--x': x, '--y': y, '--tx': tx, '--ty': ty } as CSSProperties;
}

const at = (i: 0 | 1 | 2) => place(LAYOUTS.wide.stops[i], LAYOUTS.tall.stops[i]);

/** 找路径上离某点最近的位置（0–1） */
function nearest(path: SVGPathElement, length: number, [x, y]: Pt) {
  let best = 0;
  let gap = Infinity;
  for (let i = 0; i <= 240; i++) {
    const p = path.getPointAtLength((i / 240) * length);
    const d = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (d < gap) {
      gap = d;
      best = i / 240;
    }
  }
  return best;
}

function Shell() {
  return (
    <svg viewBox="0 0 52 44" aria-hidden="true">
      <path d="M26 39 C11 39 3 28 4 18 C6 8 16 3 26 3 C36 3 46 8 48 18 C49 28 41 39 26 39 Z" />
      <path d="M26 39 L14 7 M26 39 L26 3 M26 39 L38 7 M26 39 L7 15 M26 39 L45 15" />
      <path d="M20 39 H32 V43 H20 Z" />
    </svg>
  );
}

export function Ending() {
  const flower = useFlower();
  const box = useRef<HTMLDivElement>(null);
  const ui = communityUi.end;
  const phrases = community.closing.match(/[^，。]+[，。]/g) ?? [community.closing];

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const walker = node.querySelector<HTMLElement>('.m-com-walker');
    const mascot = walker?.querySelector('svg');
    if (!walker || !mascot) return;
    const lines = [...node.querySelectorAll<SVGPathElement>('.m-com-end-drawn')];
    const items = [...node.querySelectorAll<HTMLElement>('[data-stop]')];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = matchMedia('(max-width: 900px)');

    let layout = LAYOUTS.wide;
    let path: SVGPathElement | null = null;
    let length = 1;
    let end = 1;
    let stopAt = [0, 0, 0];
    const setup = () => {
      const key = narrow.matches ? 'tall' : 'wide';
      layout = LAYOUTS[key];
      path = node.querySelector<SVGPathElement>(
        `[data-layout='${key}'] .m-com-end-drawn`,
      );
      if (!path) return;
      length = path.getTotalLength();
      end = (length - layout.short) / length;
      stopAt = layout.stops.map((stop) => nearest(path!, length, stop));
    };

    // 区块顶边从视口底部往上走到约 1/6 处时走完
    let cur = 0;
    let target = 0;
    let frame = 0;
    let lastX = 0;
    const read = () => {
      const top = node.getBoundingClientRect().top;
      const vh = window.innerHeight;
      target = reduce
        ? 1
        : Math.min(1, Math.max(0, (vh * 0.95 - top) / (vh * 0.78)));
    };
    const paint = () => {
      if (!path) return;
      const t = cur * end;
      const p = path.getPointAtLength(t * length);
      walker.style.left = `${(p.x / layout.box[0]) * 100}%`;
      walker.style.top = `${(p.y / layout.box[1]) * 100}%`;
      if (Math.abs(p.x - lastX) > 0.4)
        walker.dataset.dir = p.x < lastX ? 'left' : 'right';
      lastX = p.x;
      // 线画到小棍的尖上（在小家伙身后一点）
      const drawn = String(1 - Math.max(0, t - 18 / length));
      lines.forEach((line) => (line.style.strokeDashoffset = drawn));
      items.forEach((item) =>
        item.toggleAttribute(
          'data-on',
          t >= stopAt[Number(item.dataset.stop)] - 0.01,
        ),
      );
      mascot.toggleAttribute('data-lit', cur > 0.99);
    };
    const tick = () => {
      const diff = target - cur;
      const done = Math.abs(diff) < 0.0008;
      cur = done ? target : cur + diff * 0.07;
      walker.toggleAttribute('data-walking', !done && Math.abs(diff) > 0.003);
      paint();
      frame = done ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      read();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    setup();
    read();
    cur = target;
    paint();
    node.dataset.ready = '';
    window.addEventListener('scroll', kick, { passive: true });
    const resize = new ResizeObserver(() => {
      setup();
      read();
      cur = target;
      paint();
    });
    resize.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', kick);
      resize.disconnect();
    };
  }, []);

  const rest = place(LAYOUTS.wide.rest, LAYOUTS.tall.rest);
  return (
    <section className="m-com-end" id="end" aria-label={community.closing}>
      <svg
        className="m-com-end-tide"
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 0 H1440 V16 C1320 32 1200 6 1080 18 C960 30 840 8 720 20 C600 32 480 6 360 18 C240 30 120 8 0 20 Z" />
        <path
          className="m-com-end-foam"
          d="M1440 16 C1320 32 1200 6 1080 18 C960 30 840 8 720 20 C600 32 480 6 360 18 C240 30 120 8 0 20"
        />
      </svg>
      <div className="m-wrap">
        <div className="m-com-end-box" ref={box}>
          {(['wide', 'tall'] as const).map((key) => (
            <svg
              key={key}
              className="m-com-end-line"
              data-layout={key}
              viewBox={`0 0 ${LAYOUTS[key].box[0]} ${LAYOUTS[key].box[1]}`}
              aria-hidden="true"
            >
              <path className="m-com-end-ghost" d={LAYOUTS[key].d} />
              <path
                className="m-com-end-groove m-com-end-drawn"
                d={LAYOUTS[key].d}
                pathLength={1}
              />
              <path
                className="m-com-end-ink m-com-end-drawn"
                d={LAYOUTS[key].d}
                pathLength={1}
              />
            </svg>
          ))}

          <span
            className="m-com-end-shell"
            style={place(LAYOUTS.wide.shell, LAYOUTS.tall.shell)}
          >
            <Shell />
          </span>

          <div
            className="m-com-end-thing m-com-end-card"
            data-stop="0"
            style={at(0)}
            aria-hidden="true"
          >
            <FlowerArt flower={{ ...flower, count: Math.min(flower.count, 18) }} size={58} />
          </div>
          <div
            className="m-com-end-thing m-com-end-ticket"
            data-stop="1"
            style={at(1)}
            aria-hidden="true"
          >
            <span className="m-com-end-ticket-main">
              <i />
              <i />
              <i />
            </span>
            <span className="m-com-end-ticket-stub">
              <ArrowDownToLine size={16} />
            </span>
          </div>
          <Link
            className="m-com-end-thing m-com-end-frame"
            data-stop="2"
            style={at(2)}
            href={contactHref('creator')}
          >
            <Plus size={26} aria-hidden="true" />
            <span>{ui.share}</span>
          </Link>

          <p className="m-com-closing">
            {phrases.map((part, i) => (
              <span key={part} data-stop={i} style={at(i as 0 | 1 | 2)}>
                {part}
              </span>
            ))}
          </p>

          <div className="m-com-walker" style={rest} aria-hidden="true">
            <Mascot pose="walk" />
          </div>
        </div>
        <p className="m-com-progress">
          <b>{community.progressLabel}</b>
          {ui.progress}
        </p>
      </div>
    </section>
  );
}
