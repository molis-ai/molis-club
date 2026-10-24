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
import { ArrowDownToLine } from 'lucide-react';
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

// 「一朵好奇」（作品画廊的第一件）：窗里那朵花就是控件——在花上拖（左右改重复、上下改展开），方向键也行；
// 点一下（或回车）换一档展开；触屏上左右滑改重复。窗下四个颜料点换线色，旁边是现在的数。
// 右边的三步做法指到哪一步，窗里就停在那一步的样子，移开回到访客自己调的那朵（因果对得上，不另加说明）。
// 第一次看到时花一片片转到位；下载的 SVG、复制的提示词在右边，没有 JS 时下载的是默认那朵。

const t = works.flower;

type State = Flower & { touched: boolean; preview: Flower | null };

let state: State = { ...FLOWER_DEFAULT, touched: false, preview: null };
const server: State = state;
const listeners = new Set<() => void>();

function emit(next: State) {
  state = next;
  listeners.forEach((listener) => listener());
}
function update(next: Partial<Flower>) {
  emit({ ...state, ...next, touched: true, preview: null });
}
function preview(next: Flower | null) {
  emit({ ...state, preview: next });
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function useFlowerState() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => server,
  );
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, Math.round(n)));
const BLOOM_STEPS = [20, 44, 62, 82, 100];
const own = ({ count, bloom, color }: Flower): Flower => ({
  count,
  bloom,
  color,
});

/** 窗里的花：在花上拖、按方向键、点一下；窗下是颜料点和现在的数 */
export function FlowerStage() {
  const now = useFlowerState();
  const flower = own(now);
  const shown = now.preview ?? flower;
  const id = useId();
  // 第一次看到时一片片转到位（data-open 进入视口加 is-in）；动过手就不再播
  const [intro, setIntro] = useState(true);
  const drag = useRef<{
    x: number;
    y: number;
    count: number;
    bloom: number;
    moved: boolean;
    touch: boolean;
  } | null>(null);
  const dragged = useRef(false);

  const set = (next: Partial<Flower>) => {
    setIntro(false);
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
    // 按住方向键连发时读最新的那朵，不读这一帧渲染时的
    const { count, bloom } = state;
    const moves: Record<string, Partial<Flower>> = {
      ArrowRight: { count: clamp(count + step, ...COUNT_RANGE) },
      ArrowLeft: { count: clamp(count - step, ...COUNT_RANGE) },
      ArrowUp: { bloom: clamp(bloom + step * 2, 0, 100) },
      ArrowDown: { bloom: clamp(bloom - step * 2, 0, 100) },
    };
    const next = moves[event.key];
    if (!next) return;
    event.preventDefault();
    set(next);
  };

  return (
    <>
      <div
        className="m-com-frame m-com-flower-frame"
        data-open
        data-intro={intro || undefined}
      >
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
        </button>
        <span className="m-com-frame-cap m-caption" lang="en" aria-hidden="true">
          {t.caption}
        </span>
        <p className="sr-only" id={`${id}-keys`}>
          {communityUi.keys}
        </p>
      </div>
      <div className="m-com-under">
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
        <p className="m-com-readout" aria-hidden="true">
          {t.controls.count} <b className="num">{shown.count}</b>{' '}
          {t.controls.times}
          <span>
            {t.controls.bloom} <b className="num">{shown.bloom}%</b>
          </span>
        </p>
      </div>
      <output className="sr-only" aria-live="polite">
        {now.touched
          ? `${flower.count} 次，展开 ${flower.bloom}%，${flowerColors[flower.color].name}`
          : ''}
      </output>
    </>
  );
}

/** 三步做法：指到哪一步，窗里那朵就停在那一步；点一下就用这一步的样子 */
export function FlowerSteps() {
  const now = useFlowerState();
  const leave = useRef(0);
  const show = (step: (typeof t.steps)[number]) => {
    window.clearTimeout(leave.current);
    preview({ ...own(now), count: step.count, bloom: step.bloom });
  };
  const use = (step: (typeof t.steps)[number]) => {
    window.clearTimeout(leave.current);
    update({ count: step.count, bloom: step.bloom });
  };
  // 鼠标在几步之间挪动时不在缝隙里跳回去
  const hide = () => {
    window.clearTimeout(leave.current);
    leave.current = window.setTimeout(() => preview(null), 140);
  };
  useEffect(() => () => window.clearTimeout(leave.current), []);
  return (
    <ol className="m-com-steps">
      {t.steps.map((step) => (
        <li key={step.title}>
          <button
            type="button"
            onMouseEnter={() => show(step)}
            onMouseLeave={hide}
            onFocus={() => show(step)}
            onBlur={hide}
            onClick={() => use(step)}
          >
            <b>{step.title}</b>
            <span>{step.text}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

/** 带走：下载这朵花的 SVG（没有 JS 也能下默认那朵），复制做它的提示词 */
export function FlowerTake() {
  const flower = own(useFlowerState());
  const svg = flowerSvg(flower);
  const [last, setLast] = useState('');
  return (
    <div className="m-com-take">
      <div className="m-actions">
        <a
          className="m-btn"
          href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
          download={t.filename}
          onClick={() => setLast(svg)}
        >
          <ArrowDownToLine size={15} aria-hidden="true" />
          {t.download}
        </a>
        <CopyAction
          id="flower-prompt"
          text={t.prompt}
          label={t.copy}
          topic="share-flower"
        />
      </div>
      <output className="m-com-status">
        {last === svg ? (
          <ShareAfter text={t.downloaded} topic="share-flower" />
        ) : null}
      </output>
    </div>
  );
}
