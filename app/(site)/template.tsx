'use client';
import type { ReactNode } from 'react';
import { LoginToast } from '../_site/login-toast';
import { useSiteMotion } from '../_site/motion';

// 每次换页都会重新挂载：正文淡入（顶栏不动），并重新找一遍这一页的滚动场景、浮现与开窗。
export default function SiteTemplate({ children }: { children: ReactNode }) {
  const ref = useSiteMotion<HTMLDivElement>();
  return (
    <div className="m-page" ref={ref}>
      {children}
      <LoginToast />
    </div>
  );
}
