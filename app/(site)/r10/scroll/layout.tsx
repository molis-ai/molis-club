import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ScrollHeader } from './header';
import './scroll.css';

// 第十轮视觉稿 C「一卷手卷」：首页（/r10/scroll）与 Work 页（/r10/scroll/work）。
// 底调照 Norm Architects：奶油纸、页边竖排小字、雾调照片、照片屏和文字屏分开。
// 外面一层仍是 app/(site)/layout.tsx（公共顶栏、页尾）；公共顶栏在 scroll.css 里藏起来，换成这一版自己的顶栏。
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ScrollLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sc">
      <ScrollHeader />
      {children}
      {/* 印的边：一点点不齐，像真的盖在纸上 */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        style={{ position: 'absolute' }}
      >
        <filter id="sc-rough">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="7"
          />
          <feDisplacementMap in="SourceGraphic" scale="1.5" />
        </filter>
      </svg>
    </div>
  );
}
