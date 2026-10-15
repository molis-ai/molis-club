import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Vars } from '../ui';
import './viz.css';

// 用画面讲内容的几个公共部件（specs/site-rebuild/visual-storyboard.md 第 0 节）。
// 只读令牌，不另起颜色和字号；换一套外观时这些结构照样成立。都是服务端组件，没有 JS 也完整。

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

/**
 * 已有 / 还没有：一条用块搭起来的进度——实心块是已经有的，虚线块是还没有的。
 * 不画百分比、不写「几分之几」，免得被读成进度数字；块的多少只是事情的多少。
 * 进入视口时块一块块落定（data-reveal），减少动态时直接是完整的一条。
 */
export function HaveNot({
  have,
  notYet,
  labels = { have: '已经有的', notYet: '还没有的' },
  className = '',
}: {
  have: string[];
  notYet: string[];
  labels?: { have: string; notYet: string };
  className?: string;
}) {
  return (
    <div className={`m-hn ${className}`} data-reveal>
      <p className="m-hn-legend">
        <span className="m-hn-key" data-kind="have">
          {labels.have}
        </span>
        <span className="m-hn-key" data-kind="not">
          {labels.notYet}
        </span>
      </p>
      <ul className="m-hn-blocks">
        {have.map((text, index) => (
          <li
            key={text}
            className="m-hn-block"
            data-kind="have"
            style={{ '--i': index } as Vars}
          >
            <span className="sr-only">{labels.have}：</span>
            {text}
          </li>
        ))}
        {notYet.map((text, index) => (
          <li
            key={text}
            className="m-hn-block"
            data-kind="not"
            style={{ '--i': have.length + index } as Vars}
          >
            <span className="sr-only">{labels.notYet}：</span>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
