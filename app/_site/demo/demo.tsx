import type { CSSProperties, ReactNode } from 'react';

// 演示画面（产品画面）的公共写法。
// 一个画面分成几「步」；画面根节点写 --s（当前第几步），里面的元素用 --at / --until 声明自己在哪几步出现，
// 显隐由样式算出来，步与步之间用过渡接上。这样同一个画面：
//   · 首页按时间推进（Reel），产品页按滚动推进（Chapters），倒回去就倒着演；
//   · 减少动态时没有过渡，直接停在每一步的结果上；没有 JS 时停在最后一步（完整的结果）。
// 画面一律标「界面示意 / 原型示意 / 概念示意」，画面里的名字、数字都是示意数据。

export type SceneProps = { step: number };

export type Scene = {
  id: string;
  /** 读屏用的一句画面说明 */
  label: string;
  /** 一共几步 */
  steps: number;
  /** 首页按时间播时，每一步从第几秒开始；最后一个数是这一段的总长 */
  times: number[];
  /** 诚实标注：界面示意、预览、开发中…… */
  note: string;
  render: (props: SceneProps) => ReactNode;
};

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** 这个元素从第 start 步出现，到第 until 步（不含）退场 */
export const at = (start: number, until?: number, delay?: number): Vars => ({
  '--at': start,
  ...(until === undefined ? null : { '--until': until }),
  ...(delay === undefined ? null : { '--d': `${delay}ms` }),
});

/** 画面的根：写当前步数；data-step 给需要按步换位置的样式（光标、高亮）用 */
export function Canvas({
  step,
  className,
  children,
  press = [],
}: {
  step: number;
  className: string;
  children: ReactNode;
  /** 光标在这几步「按下去」（一圈涟漪） */
  press?: number[];
}) {
  return (
    <div
      className={`m-sc ${className}`}
      data-step={step}
      data-press={press.includes(step) || undefined}
      style={{ '--s': step } as Vars}
    >
      {children}
    </div>
  );
}

/**
 * 一个光标：放在它要点的那个元素里（父元素需要 position: relative），
 * show 是它在哪几步出现（at(...)），从右下方滑过来；画面在 press 那一步时按下去（一圈涟漪）。
 */
export function Cursor({
  show,
  x = '55%',
  y = '50%',
}: {
  show: Vars;
  x?: string;
  y?: string;
}) {
  return (
    <span
      className="m-cursor m-v"
      aria-hidden="true"
      style={{ ...show, '--cx': x, '--cy': y } as Vars}
    >
      <svg viewBox="0 0 16 20" width="16" height="20">
        <path
          d="M1.5 1.5v14.2l3.9-3.6 2.6 6 2.4-1-2.6-5.9h5.3z"
          fill="#fff"
          stroke="#1b1a18"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <i />
    </span>
  );
}
