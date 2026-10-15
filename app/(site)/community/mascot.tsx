'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import type { Vars } from '../../_site/ui';

// 社区的小家伙：比稿 E1 的原创墨线小角色（负责人 2026-10-15 选定原版）——白身子、粗墨线、头顶一盏杏橙小灯，
// 眼睛跟着鼠标、隔几秒眨一下眼。只在社区出场三次：首屏探头举牌、晾衣绳下举牌、结尾坐着拿那朵花。
// 全部是手写 SVG；减少动态时不跟、不眨、灯不闪，眼睛看向前方。装饰，不进读屏。

/* ---------- 眼睛跟随：全页一个监听，先统一读位置再统一写 ---------- */
const watchers = new Set<SVGSVGElement>();
let pointer: { x: number; y: number } | null = null;
let frame = 0;
function look() {
  frame = 0;
  if (!pointer) return;
  const items = Array.from(watchers);
  const rects = items.map((item) => item.getBoundingClientRect());
  items.forEach((item, index) => {
    const rect = rects[index];
    const dx = pointer!.x - (rect.left + rect.width / 2);
    const dy = pointer!.y - (rect.top + rect.height * 0.5);
    const distance = Math.hypot(dx, dy) || 1;
    const reach = Math.min(1, distance / 240);
    item.style.setProperty('--ex', ((dx / distance) * 3.4 * reach).toFixed(2));
    item.style.setProperty('--ey', ((dy / distance) * 3 * reach).toFixed(2));
  });
}
function onPointer(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return;
  pointer = { x: event.clientX, y: event.clientY };
  if (!frame) frame = requestAnimationFrame(look);
}
function useEyes() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || matchMedia('(prefers-reduced-motion: reduce)').matches)
      return;
    if (!watchers.size)
      window.addEventListener('pointermove', onPointer, { passive: true });
    watchers.add(node);
    return () => {
      watchers.delete(node);
      if (!watchers.size) window.removeEventListener('pointermove', onPointer);
    };
  }, []);
  return ref;
}

export type Pose = 'peek' | 'sign' | 'sit' | 'walk';

const BODY =
  'M60 23 C93 23 106 51 106 85 C106 118 88 133 60 133 C32 133 14 118 14 85 C14 51 27 23 60 23 Z';

/** 举着的小牌：字数多时牌子跟着变宽 */
function Sign({ text, x, y, tilt }: { text: string; x: number; y: number; tilt: number }) {
  const width = Math.max(96, Array.from(text).length * 20 + 36);
  return (
    <g className="m-mascot-sign" transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <rect x={-width / 2} y={-22} width={width} height={44} rx={8} />
      <text x={0} y={7}>
        {text}
      </text>
    </g>
  );
}

const arms: Record<Pose, ReactNode> = {
  // 两只手从纸沿后面伸上来（手的下半截被纸挡住）
  peek: (
    <>
      <path d="M18 104 Q9 96 8 84" />
      <path d="M102 100 Q118 86 118 62" />
    </>
  ),
  sign: (
    <>
      <path d="M16 96 Q6 104 9 116" />
      <path d="M104 92 Q117 80 117 58" />
    </>
  ),
  sit: (
    <>
      <path d="M104 98 Q112 108 106 120" />
      <path d="M16 96 Q8 92 6 80" />
    </>
  ),
  // 一只手往后拖着一根小棍，棍尖在地上画线
  walk: (
    <>
      <path d="M104 96 Q114 104 110 116" />
      <path d="M16 98 Q6 104 2 112" />
    </>
  ),
};

/**
 * pose：peek 探头（下半身由父级的纸挡住）、sign 举牌、sit 坐着、walk 拖着小棍走路（结尾画沙上的线）。
 * sign 是牌子上的字；hold 是坐着时手里拿的东西（例如访客调的那朵花的缩小版）。
 */
export function Mascot({
  pose,
  sign,
  hold,
  lit = false,
  className = '',
  style,
}: {
  pose: Pose;
  sign?: string;
  hold?: ReactNode;
  lit?: boolean;
  className?: string;
  style?: Vars;
}) {
  const ref = useEyes();
  const stick =
    pose === 'peek'
      ? { x: 118, top: -6, signY: -24 }
      : pose === 'sign'
        ? { x: 117, top: -52, signY: -70 }
        : null;
  return (
    <svg
      ref={ref}
      className={`m-mascot ${className}`}
      data-pose={pose}
      data-lit={lit || undefined}
      viewBox="-30 -100 200 250"
      overflow="visible"
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {stick && sign ? (
        <>
          <path className="m-mascot-line" d={`M${stick.x} 66 L${stick.x} ${stick.top}`} />
          <Sign text={sign} x={stick.x + 6} y={stick.signY} tilt={-5} />
        </>
      ) : null}
      <g className="m-mascot-antenna">
        <path className="m-mascot-line" d="M60 23 C60 13 63 8 69 6" />
        <circle className="m-mascot-bulb" cx="71" cy="6" r="6" />
      </g>
      {pose === 'sign' || pose === 'walk' ? (
        <g className="m-mascot-feet">
          <ellipse cx="45" cy="135" rx="10" ry="5" />
          <ellipse cx="75" cy="135" rx="10" ry="5" />
        </g>
      ) : null}
      {pose === 'sit' ? (
        <g className="m-mascot-feet">
          <ellipse cx="38" cy="134" rx="11" ry="5" transform="rotate(-14 38 134)" />
          <ellipse cx="82" cy="134" rx="11" ry="5" transform="rotate(14 82 134)" />
        </g>
      ) : null}
      {pose === 'walk' ? (
        <path className="m-mascot-line m-mascot-stick" d="M4 110 L-30 140" />
      ) : null}
      <path className="m-mascot-body" d={BODY} />
      <g className="m-mascot-line m-mascot-arms">{arms[pose]}</g>
      {pose === 'sit' && hold ? (
        <g className="m-mascot-hold">
          <path className="m-mascot-line" d="M6 82 C2 60 -2 42 -6 26" />
          <g transform="translate(-26 -14)">{hold}</g>
        </g>
      ) : null}
      <g className="m-mascot-face">
        <g className="m-mascot-eyes">
          <ellipse cx="45" cy="72" rx="5.2" ry="6.6" />
          <ellipse cx="75" cy="72" rx="5.2" ry="6.6" />
        </g>
        <ellipse className="m-mascot-blush" cx="33" cy="88" rx="7" ry="4" />
        <ellipse className="m-mascot-blush" cx="87" cy="88" rx="7" ry="4" />
        <path className="m-mascot-line" d="M54 89 Q60 95 66 89" />
      </g>
    </svg>
  );
}
