import type { LucideIcon } from 'lucide-react';

// Tool 页的小零件：动作的小图标、Molis 的四角取景框。不带 'use client'：屏幕画面和整页的动作条都直接用。

/** 动作的小图标：照 Molis Tool 的界面，只用中性色 */
export function Ico({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <i className="tl-ico" aria-hidden="true">
      <Icon strokeWidth={1.8} />
    </i>
  );
}

/** Molis Tool 菜单栏里的标：四个角的取景框；dot 是有事等你时角上那一点琥珀色 */
export function Mark({ dot = false }: { dot?: boolean }) {
  return (
    <svg className="tl-mark" viewBox="0 0 16 16" aria-hidden="true" data-dot={dot || undefined}>
      <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" />
      <circle cx="13.2" cy="2.8" r="2.4" />
    </svg>
  );
}
