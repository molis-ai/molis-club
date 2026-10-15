'use client';
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { ArrowDownToLine, RotateCcw } from 'lucide-react';
import { communityUi, works } from '../../../content/site/community';
import { CopyAction, ShareAfter } from './copy';
import {
  COUNT_RANGE,
  FLOWER_DEFAULT,
  FlowerArt,
  flowerColors,
  flowerSvg,
  flowerTitle,
  type Flower,
} from './flower-art';
import { Mascot } from './mascot';

// 「一朵好奇」：首屏那张纸上的花就是控件——在花上拖（左右改重复、上下改展开），方向键也行；
// 点一下（或回车）换一档展开；触屏上左右滑改重复。纸边四个颜料点换线色；纸角那张票根就是下载（没有 JS 也能下默认那朵）。
// 「看它怎么长出来」把花拆回一个椭圆，再一片片重复、展开。小家伙从纸后面探头，你一动它的灯亮一下、牌子换一句。
// 晾衣绳和结尾读同一朵花：访客调过的样子会一路跟着走（只在访客自己的浏览器里）。

const t = works.flower;
const ui = communityUi.hero;

type State = Flower & { touched: boolean };

let state: State = { ...FLOWER_DEFAULT, touched: false };
const server: State = state;
const listeners = new Set<() => void>();

function update(next: Partial<Flower>) {
  state = { ...state, ...next, touched: true };
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
/** 访客现在这朵花（晾衣绳、结尾的小家伙也读它） */
export function useFlower() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => server,
  );
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, Math.round(n)));
const BLOOM_STEPS = [20, 44, 62, 82, 100];

/** 「看它怎么长出来」：一个椭圆 → 一片片重复到现在的次数 → 展开到现在的程度，约 2.4 秒 */
function useGrow(target: Flower) {
  const [shown, setShown] = useState<Flower | null>(null);
  const raf = useRef(0);
  const play = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const s = (now - start) / 1000;
      if (s < 0.5) setShown({ ...target, count: 1, bloom: 20 });
      else if (s < 1.6)
        setShown({
          ...target,
          count: Math.max(1, Math.round(((s - 0.5) / 1.1) * target.count)),
          bloom: 20,
        });
      else if (s < 2.4)
        setShown({
          ...target,
          bloom: Math.round(20 + ((s - 1.6) / 0.8) * (target.bloom - 20)),
        });
      else {
        setShown(null);
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { shown, play, growing: shown !== null };
}

/** 纸角的票根：下载这朵花的 SVG；点了票根沿虚线撕下 */
function FlowerTicket({
  flower,
  onTake,
}: {
  flower: Flower;
  onTake: () => void;
}) {
  const svg = flowerSvg(flower);
  const [last, setLast] = useState('');
  const [torn, setTorn] = useState(0);
  return (
    <div className="m-com-hero-ticket">
      <a
        className="m-com-ticket"
        data-torn={torn || undefined}
        key={torn}
        href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
        download={t.filename}
        onClick={() => {
          setLast(svg);
          setTorn((n) => n + 1);
          onTake();
        }}
      >
        <span className="m-com-ticket-main">
          <b>{ui.ticket}</b>
          <small>{ui.ticketMeta}</small>
        </span>
        <span className="m-com-ticket-stub" aria-hidden="true">
          <ArrowDownToLine size={18} />
          <i lang="en">No.01</i>
        </span>
      </a>
      <output className="m-com-status">
        {last === svg ? (
          <ShareAfter text={t.downloaded} topic="share-flower" />
        ) : null}
      </output>
    </div>
  );
}

export function FlowerToy() {
  const flower = useFlower();
  const id = useId();
  const [intro, setIntro] = useState(true);
  const [mood, setMood] = useState<'idle' | 'play' | 'took'>('idle');
  const [lit, setLit] = useState(0);
  const drag = useRef<{
    x: number;
    y: number;
    count: number;
    bloom: number;
    moved: boolean;
    touch: boolean;
  } | null>(null);
  const dragged = useRef(false);
  const grow = useGrow(flower);
  const shown = grow.shown ?? flower;

  // 小家伙的灯：你一动就亮一下
  useEffect(() => {
    if (!lit) return;
    const timer = window.setTimeout(() => setLit(0), 700);
    return () => window.clearTimeout(timer);
  }, [lit]);

  const set = (next: Partial<Flower>) => {
    setIntro(false);
    setMood((now) => (now === 'idle' ? 'play' : now));
    setLit((n) => n + 1);
    update(next);
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      count: flower.count,
      bloom: flower.bloom,
      moved: false,
      touch: event.pointerType !== 'mouse',
    };
  };
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = event.clientX - d.x;
    const dy = event.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    d.moved = true;
    set({
      count: clamp(d.count + dx / 9, COUNT_RANGE[0], COUNT_RANGE[1]),
      // 触屏上竖着滑交给页面滚动，只改重复
      bloom: d.touch ? d.bloom : clamp(d.bloom - dy / 3, 0, 100),
    });
  };
  const onPointerUp = () => {
    dragged.current = drag.current?.moved ?? false;
    drag.current = null;
  };
  // 点一下（鼠标、触屏、回车或空格）：换一档展开；拖完松手那一下不算
  const onClick = () => {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    const next =
      BLOOM_STEPS.find((step) => step > flower.bloom) ?? BLOOM_STEPS[0];
    set({ bloom: next });
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 5 : 1;
    const moves: Record<string, Partial<Flower>> = {
      ArrowRight: { count: clamp(flower.count + step, ...COUNT_RANGE) },
      ArrowLeft: { count: clamp(flower.count - step, ...COUNT_RANGE) },
      ArrowUp: { bloom: clamp(flower.bloom + step * 2, 0, 100) },
      ArrowDown: { bloom: clamp(flower.bloom - step * 2, 0, 100) },
    };
    const next = moves[event.key];
    if (!next) return;
    event.preventDefault();
    set(next);
  };

  const sign =
    mood === 'took' ? '带走啦' : mood === 'play' ? '好看！' : ui.sign;

  return (
    <div className="m-com-toy" id="flower">
      <div className="m-com-peek" aria-hidden="true">
        <Mascot pose="peek" sign={sign} lit={lit > 0} />
      </div>
      <svg
        className="m-com-scribble"
        viewBox="0 0 120 200"
        aria-hidden="true"
      >
        <path pathLength={1} d="M6 10 C50 4 92 30 96 80 C99 120 84 150 70 182" />
        <path pathLength={1} d="M58 171 L70 184 L83 173" />
      </svg>
      <figure className="m-com-paper" data-intro={intro || undefined}>
        <button
          type="button"
          className="m-com-canvas"
          aria-label={flowerTitle(flower)}
          aria-describedby={`${id}-keys`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
          onKeyDown={onKeyDown}
          onClick={onClick}
        >
          <FlowerArt flower={shown} live className="m-com-flower" />
          <span className="m-com-paper-cap m-caption" lang="en" aria-hidden="true">
            {t.caption}
            <span className="num">{`${shown.count} × ${shown.bloom}%`}</span>
          </span>
          <span className="m-com-hint m-com-js" aria-hidden="true">
            <span data-pointer="fine">
              {ui.hintX} <b className="num">{flower.count}</b> 次
              <br />
              {ui.hintY} <b className="num">{flower.bloom}%</b>
            </span>
            <span data-pointer="coarse">
              左右滑 · 重复 <b className="num">{flower.count}</b> 次
              <br />
              点一下 · 展开 <b className="num">{flower.bloom}%</b>
            </span>
          </span>
        </button>
        <p className="sr-only" id={`${id}-keys`}>
          {ui.keys}
        </p>
        <fieldset className="m-com-paints m-com-js">
          <legend className="sr-only">{t.controls.color}</legend>
          {flowerColors.map((color, index) => (
            <button
              key={color.name}
              type="button"
              aria-pressed={flower.color === index}
              aria-label={color.name}
              title={color.name}
              style={{ '--c': color.value } as CSSProperties}
              onClick={() => set({ color: index })}
            />
          ))}
        </fieldset>
        <FlowerTicket flower={flower} onTake={() => setMood('took')} />
      </figure>
      <div className="m-com-paper-foot">
        <div className="m-com-paper-acts m-com-js">
          <button
            type="button"
            className="m-link m-com-act"
            onClick={grow.play}
            onMouseEnter={grow.growing ? undefined : grow.play}
            aria-describedby={`${id}-grow`}
          >
            {ui.grow}
            <RotateCcw size={13} aria-hidden="true" />
          </button>
          <span className="sr-only" id={`${id}-grow`}>
            {ui.growing}
          </span>
          <CopyAction
            id="flower-prompt"
            text={t.prompt}
            label={t.copy}
            topic="share-flower"
          />
        </div>
      </div>
      <p className="m-com-nojs m-com-status">{t.nojs}</p>
      <output className="sr-only" aria-live="polite">
        {flower.touched
          ? `${flower.count} 次，展开 ${flower.bloom}%，${flowerColors[flower.color].name}`
          : ''}
      </output>
    </div>
  );
}
