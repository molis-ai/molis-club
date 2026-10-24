'use client';
import {
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { works } from '../../../content/site/community';
import { CopyAction, ShareAfter } from './copy';
import {
  COUNT_RANGE,
  FLOWER_DEFAULT,
  FlowerArt,
  flowerSvg,
  flowerTitle,
  type Flower,
} from './flower-art';

// 「一朵好奇」（作品画廊的第一件）：窗里那朵花就是控件（FlowerCanvas；窗在 stages.tsx）——在花上拖（左右改重复、上下改展开），方向键也行；
// 点一下（或回车）换一档展开；触屏上左右滑改重复。三步做法在窗里，指到哪一步就停在那一步的样子，移开回到访客自己调的那朵。
// 下载的 SVG、复制的提示词在右边，没有 JS 时下载的是默认那朵。

const t = works.flower;

type State = Flower & { touched: boolean; preview: Flower | null };

let state: State = { ...FLOWER_DEFAULT, touched: false, preview: null };
const server: State = state;
const listeners = new Set<() => void>();

function emit(next: State) {
  state = next;
  listeners.forEach((listener) => listener());
}
export function update(next: Partial<Flower>) {
  emit({ ...state, ...next, touched: true, preview: null });
}
export function preview(next: Flower | null) {
  emit({ ...state, preview: next });
}
/** 画廊自己摆的样子（自己长一遍时每一拍）：不算访客动过手，不播报 */
export function seed(next: Partial<Flower>) {
  emit({ ...state, ...next, preview: null });
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function useFlowerState() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => server,
  );
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, Math.round(n)));
const BLOOM_STEPS = [20, 44, 62, 82, 100];
export const own = ({ count, bloom, color }: Flower): Flower => ({
  count,
  bloom,
  color,
});

/**
 * 花本身就是控件：在花上拖（左右改重复、上下改展开）、按方向键、点一下换一档展开。两版画廊共用；
 * onTouch 在访客动手时先告诉外面（停掉开场），grow 换了就重新挂上每一片（让它们一片片转到位）。
 */
export function FlowerCanvas({
  describedBy,
  onTouch,
  grow,
}: {
  describedBy: string;
  onTouch: () => void;
  grow?: string;
}) {
  const now = useFlowerState();
  const flower = own(now);
  const shown = now.preview ?? flower;
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
    onTouch();
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
    <button
      type="button"
      className="m-com-canvas"
      aria-label={flowerTitle(flower)}
      aria-describedby={describedBy}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (drag.current = null)}
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      <FlowerArt key={grow} flower={shown} live className="m-com-flower" />
    </button>
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
