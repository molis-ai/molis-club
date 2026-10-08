'use client';
import {
  ArrowUpRight,
  Languages,
  Lightbulb,
  MousePointer2,
  NotebookPen,
} from 'lucide-react';
import { demo } from '../../../../../content/molis-tool';
import { Cuts } from '../art';

const actionIcons = [Languages, Lightbulb, NotebookPen];

function Pointer({ className }: { className: string }) {
  return (
    <span className={className}>
      <MousePointer2 size={22} fill="currentColor" strokeWidth={1.4} />
    </span>
  );
}

/** 首屏动画：划出一句英文 → 句尾冒出三枚纸签 → 点「翻译」→ 带出处的小卡贴上来。一轮约 9 秒。 */
export function CursorDemo() {
  return (
    <figure className="ft-demo" aria-label={demo.label}>
      <Cuts />
      <div className="ft-browser" aria-hidden="true">
        <span className="fo-tape fo-tape-a" />
        <div className="ft-browser-bar">
          <i />
          <i />
          <i />
          <span>{demo.url}</span>
        </div>
        <div className="ft-page">
          <h3 lang="en">{demo.heading}</h3>
          <p lang="en">
            {demo.before}
            <mark>
              {demo.selection}
              <Pointer className="ft-cursor ft-cursor-select" />
            </mark>
            {demo.after}
          </p>
          <div className="ft-pop">
            <div className="ft-chips">
              {demo.actions.map((action, index) => {
                const Icon = actionIcons[index];
                return (
                  <span
                    className="ft-chip"
                    key={action}
                    data-first={index === 0 || undefined}
                  >
                    <Icon size={14} />
                    {action}
                    {index === 0 ? (
                      <Pointer className="ft-cursor ft-cursor-click" />
                    ) : null}
                  </span>
                );
              })}
            </div>
            <div className="ft-card">
              <small>{demo.result.label}</small>
              <p>{demo.result.text}</p>
              <span>
                <ArrowUpRight size={12} />
                {demo.result.source}
              </span>
            </div>
          </div>
          <span className="ft-line" />
          <span className="ft-line" />
          <span className="ft-line ft-line-short" />
        </div>
      </div>
      <figcaption>{demo.note}</figcaption>
    </figure>
  );
}
