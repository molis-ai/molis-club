import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import './viz.css';

// 用画面讲内容的公共部件（specs/site-rebuild/visual-storyboard.md 第 0 节），新站目前用到「展开看全文」。
// 只读令牌，不另起颜色和字号。都是服务端组件，没有 JS 也完整。

/**
 * 展开看全文：一行摘要，点开是原文段落。原生 details，不用 JS 也能开，键盘可用；
 * 打印时一律展开（样式在 viz.css）。
 */
export function Fold({
  summary = '展开看全文',
  children,
  className = '',
}: {
  summary?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={`m-fold ${className}`}>
      <summary>
        <span>{summary}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </summary>
      <div className="m-fold-body">{children}</div>
    </details>
  );
}

/** 一组原文段落，放在 Fold 里 */
export function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </>
  );
}
