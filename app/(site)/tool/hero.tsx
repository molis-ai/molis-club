'use client';
import { ArrowUpRight, Languages, Lightbulb, NotebookPen } from 'lucide-react';
import { desk } from '../../../content/site/tool';
import { selectNode } from './selection';
import { Cursor, Hl, Ico, Stream } from './parts';
import { Loop } from './stage';

// 首屏右边（Folio 版首屏）：桌上一页网页，划出一句英文 → 选区末端冒出三个动作 → 点「翻译」→ 带出处的译文贴在旁边。
// 从「做完的样子」开始：一进页先看到结果，约 3 秒后退下，光标再演一遍是怎么做到的（scripts.ts 的 desk）。

const icons = [Languages, Lightbulb, NotebookPen];

export function Desk() {
  return (
    <Loop
      className="tl-desk m-rise"
      label={desk.label}
      note={desk.note}
      cue="desk"
    >
      <span className="tl-sheet tl-sheet-a" />
      <span className="tl-sheet tl-sheet-b" />
      <div className="tl-web">
        <p className="tl-web-bar">
          <i />
          <i />
          <i />
          <span>{desk.url}</span>
        </p>
        <div className="tl-web-page" lang="en">
          <p className="tl-web-h">{desk.heading}</p>
          <p className="tl-web-p">{desk.intro}</p>
          <p className="tl-web-p">
            <span className="tl-row">
              <Hl c="desk-0">{desk.select[0]}</Hl>
            </span>
            <span className="tl-row">
              <Hl c="desk-1">{desk.select[1]}</Hl>
              <span className="tl-anchor">
                <span className="tl-bar tl-desk-bar">
                  {desk.actions.map((action, index) => (
                    <span
                      key={action.label}
                      className="tl-bar-btn"
                      data-first={index === 0 || undefined}
                      data-c={index === 0 ? 'desk-btn' : undefined}
                    >
                      <Ico icon={icons[index]} tone={action.tone} />
                      {action.label}
                    </span>
                  ))}
                </span>
              </span>
              {desk.rest[0]}
            </span>
            <span className="tl-row">{desk.rest[1]}</span>
          </p>
          <span className="tl-web-line" />
          <span className="tl-web-line" />
          <span className="tl-web-line tl-web-line-short" />
        </div>
        <Cursor />
      </div>
      <div className="tl-card tl-desk-card">
        <p className="tl-card-head">
          <Ico icon={Languages} tone="sky" />
          {desk.result.label}
          <small>{desk.result.tag}</small>
        </p>
        <p className="tl-desk-out" data-c="desk-out">
          <Stream text={desk.result.text} />
        </p>
        <p className="tl-source">
          <ArrowUpRight />
          {desk.result.source}
        </p>
      </div>
    </Loop>
  );
}

/** 首屏左下：整页都能选中；按钮替不方便拖选的人选中上面那句（键盘、触屏都能用） */
export function TryHint() {
  return (
    <p className="tl-hint">
      <span>{desk.hint}</span>
      <button
        type="button"
        className="m-link"
        onClick={(event) =>
          selectNode(
            document.querySelector<HTMLElement>('.m-phero-what'),
            event.detail === 0,
          )
        }
      >
        {desk.pick}
      </button>
    </p>
  );
}
