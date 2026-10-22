import type { ReactNode } from 'react';

// 第二章「一扇窗，一天」里四件产品的线描（负责人 2026-10-22 定第四版）。
// 和沿途的小示意图是同一套画法，只是画得大一点：细墨线、不填色、圆头圆角，每张只有一个杏色小圆点，落在这件产品的「要害」上。
// 纯装饰，读屏跳过（产品名和原句就在旁边）。

const Dot = ({ cx, cy, r = 2 }: { cx: number; cy: number; r?: number }) => (
  <circle className="da-dot" cx={cx} cy={cy} r={r} />
);

function Art({ children }: { children: ReactNode }) {
  return (
    <svg
      className="da"
      viewBox="0 0 96 72"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Molis Work：一张工作台，后面还叠着一张；最后一行写到一半，光标在那里——接着做 */
export function WorkArt() {
  return (
    <Art>
      <path d="M22 13V9.5a2 2 0 0 1 2-2h56a2 2 0 0 1 2 2V51a2 2 0 0 1-2 2h-3" />
      <rect x="14" y="13" width="63" height="46" rx="3" />
      <path d="M30 13v46" />
      <path d="M19 22h6M19 28h5M19 34h6" />
      <path d="M36 23h30M36 30h26M36 37h29" />
      <path d="M36 47h14" />
      <Dot cx={54} cy={47} />
    </Art>
  );
}

/** Molis Tool：一段字里选中了一截，上面浮出一排动作——工具来到眼前 */
export function ToolArt() {
  return (
    <Art>
      <path d="M12 34h72M12 45h20M62 45h22M12 56h50" />
      <rect x="33" y="39.5" width="27" height="11" rx="2.5" />
      <path d="M36 45h21" />
      <rect x="27" y="16" width="40" height="13" rx="6.5" />
      <path d="M44 20.5v4M54 20.5v4" />
      <Dot cx={36} cy={22.5} r={2.2} />
      <path d="M47 29l-2.5 3h5z" />
    </Art>
  );
}

/** Life：一张记着两件事的便笺，划掉了一件；后面是一片海，太阳是那个小圆点——琐事安顿好，留出看海的半天 */
export function LifeArt() {
  return (
    <Art>
      <path d="M40 44h46" />
      <path d="M40 52c3-2.4 6-2.4 9 0s6 2.4 9 0 6-2.4 9 0 6 2.4 9 0 6-2.4 9 0" />
      <path d="M48 60c3-2 6-2 9 0s6 2 9 0 6-2 9 0" />
      <Dot cx={70} cy={33} r={3.4} />
      <rect x="10" y="16" width="30" height="40" rx="2.5" />
      <path d="M15.5 26.5l2 2 3.5-4" />
      <path d="M24 27h11" />
      <rect x="15.5" y="35" width="5" height="5" rx="1" />
      <path d="M24 38h9" />
      <path d="M15.5 47h17" />
    </Art>
  );
}

/** Story：一扇拱窗，窗里是另一个夜晚的世界（一弯月亮、一颗亮着的星）；窗边冒出一个回应的气泡——走进去，再回来 */
export function StoryArt() {
  return (
    <Art>
      <path d="M30 62V32a16 16 0 0 1 32 0v30" />
      <path d="M46 16v46M30 40h32" />
      <path d="M24 62h44" />
      <path d="M40.5 33.5a5 5 0 1 1-5.6-6.4 4 4 0 0 0 5.6 6.4z" />
      <Dot cx={53} cy={28} r={1.9} />
      <path d="M56.5 33v3.6M54.7 34.8h3.6" />
      <path d="M69 20h15a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-8l-5 4v-4h-2a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z" />
      <path d="M73 26h8" />
    </Art>
  );
}
