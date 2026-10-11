'use client';
import {
  ArrowUpRight,
  Check,
  Languages,
  Lightbulb,
  MousePointer2,
  NotebookPen,
  Sparkles,
  Target,
} from 'lucide-react';
import { desk } from '../../../../content/folio-work';
import { demo } from '../../../../content/molis-tool';
import { Demo, type Vars } from './kit';
import './sheets.css';

// Work、Tool 两段界面演示，A 与 D 共用同一份结构和时间轴（sheets.css 里按 data-a 驱动）；
// 皮肤由各方向按类名前缀自己写。基础样式就是播完的样子，减少动态时直接停在结果上。

function Pointer({ className, a }: { className: string; a: string }) {
  return (
    <span className={className} data-a={a} aria-hidden="true">
      <MousePointer2 size={18} fill="currentColor" strokeWidth={1.4} />
    </span>
  );
}

/**
 * Work：一轮 12 秒。在 Pages 里写下一句 → Inbox 亮起 3 → 助理递上一张操作卡 → 点「执行」→
 * 三条反馈带着出处进到文里，待办多了 2 个，卡片变成「已整理 · 撤销」。没有聊天框。
 */
export function WorkSheet({
  p,
  active,
  className = '',
}: {
  p: string;
  active: boolean;
  className?: string;
}) {
  return (
    <Demo
      p={p}
      label={desk.label}
      active={active}
      className={`r3-sheet r3-work ${p}-sheet ${p}-sheet-work ${className}`}
    >
      <div className={`${p}-win`} aria-hidden="true">
        <div className={`${p}-win-bar`}>
          <i />
          <i />
          <i />
          <span>Molis Work</span>
        </div>
        <div className={`${p}-win-body`}>
          <aside className={`${p}-dock`}>
            {desk.dock.map((name) => (
              <span key={name} data-on={name === desk.plugin || undefined}>
                {name}
                {name === 'Inbox' ? (
                  <b className={`${p}-badge`} data-a="inbox">
                    3
                  </b>
                ) : null}
                {name === '待办' ? (
                  <b className={`${p}-badge ${p}-badge-todo`} data-a="todo">
                    +2
                  </b>
                ) : null}
              </span>
            ))}
          </aside>
          <div className={`${p}-doc`}>
            <header className={`${p}-doc-head`}>
              <span className={`${p}-project`}>
                <i />
                {desk.project}
              </span>
              <span className={`${p}-goal`}>
                <Target size={11} />
                {desk.goal}
              </span>
            </header>
            <small>{desk.plugin}</small>
            <h4>{desk.heading}</h4>
            <p
              className={`${p}-typed`}
              style={{ '--n': Array.from(desk.typed).length } as Vars}
            >
              <span data-a="typed">{desk.typed}</span>
              <i className={`${p}-caret`} data-a="caret" />
            </p>
            <div className={`${p}-inserted`} data-a="open">
              <ul>
                {desk.inserted.map((line, index) => (
                  <li
                    key={line}
                    data-a="insert"
                    style={{ '--k': index } as Vars}
                  >
                    <span>“{line}”</span>
                    <em>{desk.source}</em>
                  </li>
                ))}
              </ul>
            </div>
            <span className={`${p}-ghost`} />
            <span className={`${p}-ghost ${p}-ghost-short`} />
          </div>
        </div>
      </div>
      <div className={`${p}-card`} data-a="card" aria-hidden="true">
        <div className={`${p}-card-head`}>
          <Sparkles size={12} />
          <strong>{desk.card.who}</strong>
          <span>{desk.card.context}</span>
        </div>
        <p>{desk.card.text}</p>
        <div className={`r3-card-foot ${p}-card-foot`}>
          <div className={`${p}-card-ask`} data-a="ask">
            <span className={`${p}-run`} data-a="press">
              {desk.card.run}
              <Pointer className={`${p}-pointer`} a="point" />
            </span>
            <span className={`${p}-skip`}>{desk.card.skip}</span>
          </div>
          <div className={`${p}-card-done`} data-a="done">
            <Check size={12} strokeWidth={3} />
            {desk.card.done}
            <u>{desk.card.undo}</u>
          </div>
        </div>
      </div>
    </Demo>
  );
}

const toolIcons = [Languages, Lightbulb, NotebookPen];

/** Tool：一轮 9 秒。划出一句英文 → 句尾冒出三个动作 → 点「翻译」→ 带出处的小卡贴上来。 */
export function ToolSheet({
  p,
  active,
  className = '',
}: {
  p: string;
  active: boolean;
  className?: string;
}) {
  return (
    <Demo
      p={p}
      label={demo.label}
      active={active}
      className={`r3-sheet r3-tool ${p}-sheet ${p}-sheet-tool ${className}`}
    >
      <div className={`${p}-browser`} aria-hidden="true">
        <div className={`${p}-win-bar`}>
          <i />
          <i />
          <i />
          <span>{demo.url}</span>
        </div>
        <div className={`${p}-page`}>
          <h4 lang="en">{demo.heading}</h4>
          <p lang="en">
            {demo.before}
            <mark data-a="select">{demo.selection}</mark>
            <Pointer className={`${p}-pointer-select`} a="drag" />
            {demo.after}
          </p>
          <div className={`${p}-chips`} data-a="chips">
            {demo.actions.map((action, index) => {
              const Icon = toolIcons[index];
              return (
                <span key={action} data-first={index === 0 || undefined}>
                  <Icon size={11} />
                  {action}
                  {index === 0 ? (
                    <Pointer className={`${p}-pointer-click`} a="click" />
                  ) : null}
                </span>
              );
            })}
          </div>
          <div className={`${p}-result`} data-a="result">
            <small>{demo.result.label}</small>
            <p>{demo.result.text}</p>
            <span>
              <ArrowUpRight size={10} />
              {demo.result.source}
            </span>
          </div>
          <span className={`${p}-ghost`} />
          <span className={`${p}-ghost ${p}-ghost-short`} />
        </div>
      </div>
    </Demo>
  );
}
