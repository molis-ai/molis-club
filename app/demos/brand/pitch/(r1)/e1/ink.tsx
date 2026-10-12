'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import type { Vars } from '../../_kit/kit';

// E 的墨线零件：一个原创小角色（眼睛跟着鼠标、会眨眼、头顶一盏杏橙小灯）、锯齿印章、
// 进入视口时逐笔画出的马克笔涂鸦。全部是手写 SVG，不依赖图片。

/* ---------- 眼睛跟随：全站一个监听，先统一读位置再统一写，避免布局抖动 ---------- */
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
    const dy = pointer!.y - (rect.top + rect.height * 0.52);
    const distance = Math.hypot(dx, dy) || 1;
    const reach = Math.min(1, distance / 260);
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
    if (!node || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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

export type Pose = 'peek' | 'stand' | 'sign' | 'wave';

const arms: Record<Pose, ReactNode> = {
  peek: (
    <>
      <path d="M17 100 Q7 94 6 82" />
      <path d="M103 100 Q113 94 114 82" />
    </>
  ),
  stand: (
    <>
      <path d="M16 96 Q6 104 9 116" />
      <path d="M104 96 Q114 104 111 116" />
    </>
  ),
  sign: (
    <>
      <path d="M16 96 Q6 104 9 116" />
      <path d="M104 92 Q117 80 115 60" />
      <path className="re-m-stick" d="M115 66 L115 -30" />
    </>
  ),
  wave: (
    <>
      <path className="re-m-wave" d="M16 92 Q3 80 6 62" />
      <path d="M104 96 Q114 104 111 116" />
    </>
  ),
};

/** 帽子、眼镜、叶子、围巾：举牌的几位各戴一样 */
const accessories: ReactNode[] = [
  null,
  <path
    key="hat"
    className="re-m-fill-ink"
    d="M33 38 Q50 14 80 27 Q86 31 80 35 Q56 30 33 38 Z"
  />,
  <g key="glasses" className="re-m-line">
    <circle cx="45" cy="72" r="10" />
    <circle cx="75" cy="72" r="10" />
    <path d="M55 72 Q60 68 65 72" />
  </g>,
  <path
    key="leaf"
    className="re-m-fill-paper"
    d="M64 10 Q52 2 46 10 Q54 18 64 10 Z"
  />,
  <path
    key="scarf"
    className="re-m-fill-apricot"
    d="M17 104 Q60 122 103 104 L101 114 Q60 131 19 114 Z"
  />,
];

/** 小角色。pose 决定手的位置，look 时眼睛跟着鼠标 */
export function Mascot({
  pose = 'stand',
  variant = 0,
  look = true,
  className = '',
  style,
}: {
  pose?: Pose;
  variant?: number;
  look?: boolean;
  className?: string;
  style?: Vars;
}) {
  const ref = useEyes();
  return (
    <svg
      ref={look ? ref : undefined}
      className={`re-mascot ${className}`}
      data-pose={pose}
      viewBox="0 0 120 142"
      style={{ '--blink': `${(variant * -1.7).toFixed(1)}s`, ...style } as Vars}
      aria-hidden="true"
    >
      <g className="re-m-antenna">
        <path className="re-m-line" d="M60 23 C60 13 63 8 69 6" />
        <circle className="re-m-bulb" cx="71" cy="6" r="6" />
      </g>
      {pose !== 'peek' ? (
        <g className="re-m-feet">
          <ellipse cx="45" cy="135" rx="10" ry="5" />
          <ellipse cx="75" cy="135" rx="10" ry="5" />
        </g>
      ) : null}
      <path
        className="re-m-body"
        d="M60 23 C93 23 106 51 106 85 C106 118 88 133 60 133 C32 133 14 118 14 85 C14 51 27 23 60 23 Z"
      />
      <g className="re-m-line re-m-arms">{arms[pose]}</g>
      <g className="re-m-face">
        <g className="re-m-eyes">
          <ellipse cx="45" cy="72" rx="5.2" ry="6.6" />
          <ellipse cx="75" cy="72" rx="5.2" ry="6.6" />
        </g>
        <ellipse className="re-m-blush" cx="33" cy="88" rx="7" ry="4" />
        <ellipse className="re-m-blush" cx="87" cy="88" rx="7" ry="4" />
        <path className="re-m-line" d="M54 89 Q60 95 66 89" />
      </g>
      {accessories[variant % accessories.length]}
    </svg>
  );
}

/** 锯齿形的印章 */
function starburst(points: number, inner: number) {
  const out: string[] = [];
  for (let index = 0; index < points * 2; index++) {
    const radius = index % 2 ? inner : 50;
    const angle = (Math.PI * index) / points - Math.PI / 2;
    out.push(
      `${(50 + Math.cos(angle) * radius).toFixed(2)},${(50 + Math.sin(angle) * radius).toFixed(2)}`,
    );
  }
  return out.join(' ');
}
const burst = starburst(18, 43);

export function Stamp({
  children,
  tone = 'paper',
  className = '',
  style,
}: {
  children: ReactNode;
  tone?: 'paper' | 'apricot' | 'ink';
  className?: string;
  style?: Vars;
}) {
  return (
    <span className={`re-stamp ${className}`} data-tone={tone} style={style}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <polygon points={burst} />
      </svg>
      <span>{children}</span>
    </span>
  );
}

/** 马克笔涂鸦：进入视口（父级 .is-in）时逐笔画出 */
export function Doodle({ kind }: { kind: 'cursor' | 'list' | 'door' }) {
  if (kind === 'cursor')
    return (
      <svg
        className="re-doodle re-doodle-cursor"
        viewBox="0 0 120 140"
        aria-hidden="true"
      >
        <path
          className="re-d-fill"
          pathLength={1}
          d="M14 8 C13 40 14 80 15 118 C24 108 33 99 41 92 C47 106 53 119 58 131 C64 129 70 126 75 123 C69 110 63 97 57 85 C69 85 81 85 94 86 C67 60 41 34 14 8 Z"
        />
      </svg>
    );
  if (kind === 'list')
    return (
      <svg
        className="re-doodle re-doodle-list"
        viewBox="0 0 140 150"
        aria-hidden="true"
      >
        <path
          className="re-d-paper"
          pathLength={1}
          d="M18 10 C50 8 88 9 118 12 C120 52 121 96 119 140 C86 142 50 141 16 139 C15 98 16 52 18 10 Z"
        />
        <path pathLength={1} d="M34 42 L42 50 L56 32" />
        <path pathLength={1} d="M66 42 C80 41 92 42 102 42" />
        <path pathLength={1} d="M34 78 L42 86 L56 68" />
        <path pathLength={1} d="M66 78 C80 77 92 78 102 78" />
        <path pathLength={1} d="M34 114 L42 122 L56 104" />
        <path pathLength={1} d="M66 114 C76 113 84 114 90 114" />
        <path
          className="re-d-sprout"
          pathLength={1}
          d="M120 120 C126 104 128 92 126 80 M126 92 C134 84 142 84 146 88 C140 96 132 96 126 92 M125 100 C118 92 110 92 106 96 C112 104 120 104 125 100"
        />
      </svg>
    );
  return (
    <svg
      className="re-doodle re-doodle-door"
      viewBox="0 0 150 172"
      aria-hidden="true"
    >
      <path
        className="re-d-light"
        pathLength={1}
        d="M43 21 L118 21 L118 149 L43 149 Z"
      />
      <path
        pathLength={1}
        d="M41 151 C40 107 40 63 42 19 C72 17 96 17 120 19 C122 63 122 107 121 151"
      />
      <path
        className="re-d-panel"
        pathLength={1}
        d="M42 20 L13 8 C12 60 12 112 13 164 L41 150 Z"
      />
      <circle pathLength={1} cx="22" cy="88" r="3.5" />
      <path
        pathLength={1}
        d="M128 46 L141 39 M130 85 L144 85 M128 122 L141 129"
      />
    </svg>
  );
}
