'use client';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Languages,
  Lightbulb,
  Lock,
  NotebookPen,
} from 'lucide-react';
import { desk } from '../../../content/site/tool';
import { Menus, Screen, Win } from './mac';
import { selectNode } from './selection';
import { Cursor, Hl, Ico, Stream } from './parts';
import { Loop } from './stage';

// 首屏右边：傍晚的 Mac 上开着一页英文网页，划出一句 → 选区末端冒出三个动作 → 点「翻译」→ 带出处的译文出现在旁边。
// 从「做完的样子」开始：一进页先看到结果，约 3 秒后退下，光标再演一遍是怎么做到的（scripts.ts 的 desk）。
// 这一屏把「选中 → 动作条 → 结果在旁边」完整演一次，后面几屏不再重复。

const icons = [Languages, Lightbulb, NotebookPen];

export function Desk() {
  return (
    <Loop
      className="tl-desk m-rise"
      label={desk.label}
      note={desk.note}
      cue="desk"
    >
      <Screen
        className="tl-s-desk"
        wall={desk.wall}
        app={desk.app}
        menus={<Menus items={desk.menus} />}
        clock={desk.clock}
        sizes="(max-width: 900px) 100vw, 58vw"
        eager
      >
        <Win
          className="tl-browser"
          title={
            <>
              <Lock />
              {desk.url}
            </>
          }
          tools={
            <span className="tl-browser-nav">
              <ChevronLeft />
              <ChevronRight />
            </span>
          }
        >
          <div className="tl-page" lang="en">
            <p className="tl-page-h">{desk.heading}</p>
            <p className="tl-page-p">{desk.intro}</p>
            <p className="tl-page-p">
              <span className="tl-row">
                <Hl c="desk-0">{desk.select[0]}</Hl>
              </span>
              <span className="tl-row">
                <Hl c="desk-1">{desk.select[1]}</Hl>
                <span className="tl-anchor">
                  <span className="tl-bar">
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
            <p className="tl-page-p">{desk.more}</p>
            <p className="tl-page-h2">{desk.after.heading}</p>
            <p className="tl-page-p">{desk.after.text}</p>
          </div>
        </Win>
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
        <Cursor />
      </Screen>
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
