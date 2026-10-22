import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Tone } from '../../../content/site/tool';
import type { Vars } from '../../_site/ui';

// Tool 页演示里的小零件：选中色、逐字出现、动作图标、示意光标。
// 不带 'use client'：服务端的段落和客户端的动作条都直接用。

/**
 * 选中色：默认整段一起铺开；beam 时是单行的选区，带着 I 形光标从左拖到右
 * （拖动的那一条单独画在字后面，宽度由时间轴控制）
 */
export function Hl({
  className = '',
  beam = false,
  children,
}: {
  className?: string;
  beam?: boolean;
  children: ReactNode;
}) {
  return (
    <mark className={`tl-hl ${className}`} data-beam={beam || undefined}>
      {beam ? (
        <i className="tl-band">
          <Beam className="tl-band-beam" />
        </i>
      ) : null}
      {children}
    </mark>
  );
}

/** AI 的结果一个字一个字地出来：每个字带自己的序号，时间轴按序号错开 */
export function Stream({ text }: { text: string }) {
  return (
    <span className="tl-stream">
      {Array.from(text).map((char, index) => (
        <span key={index} style={{ '--c': index } as Vars}>
          {char}
        </span>
      ))}
    </span>
  );
}

/** 动作的小图标：一个动作一种颜色，整页一致 */
export function Ico({ icon: Icon, tone }: { icon: LucideIcon; tone: Tone }) {
  return (
    <i className="tl-ico" data-tone={tone} aria-hidden="true">
      <Icon strokeWidth={2.2} />
    </i>
  );
}

/** 示意光标：白箭头描墨边 */
export function Pointer({ className = '' }: { className?: string }) {
  return (
    <svg className={`tl-pointer ${className}`} viewBox="0 0 16 20">
      <path
        d="M1.5 1.5v14.2l3.9-3.6 2.6 6 2.4-1-2.6-5.9h5.3z"
        fill="#fff"
        stroke="#1b1a18"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 选字时的 I 形光标 */
export function Beam({ className = '' }: { className?: string }) {
  return (
    <svg className={`tl-beam ${className}`} viewBox="0 0 10 22">
      <path
        d="M2 1.5c1.6 0 2.6.5 3 1.4.4-.9 1.4-1.4 3-1.4M5 3v16M2 20.5c1.6 0 2.6-.5 3-1.4.4.9 1.4 1.4 3 1.4"
        fill="none"
        stroke="#1b1a18"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
