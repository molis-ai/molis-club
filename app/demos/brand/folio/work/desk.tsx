'use client';
import { Check, MousePointer2, Sparkles, Target } from 'lucide-react';
import { desk } from '../../../../../content/folio-work';
import { Cuts } from '../art';
import { Loop } from '../loop';
import './desk.css';

/**
 * Work 首屏动画，一轮 12 秒：你在 Pages 里写下一句 → Inbox 亮起 3 → 助理在旁边递上一张操作卡 →
 * 点「执行」→ 三条反馈带着出处进到文里，待办多了 2 个，卡片收成「已整理 · 撤销」。没有聊天框。
 */
export function WorkDesk() {
  return (
    <Loop label={desk.label} note={desk.note} className="fw-desk">
      <Cuts />
      <div className="fw-sheet" aria-hidden="true">
        <span className="fo-tape fo-tape-a" />
        <header className="fw-sheet-bar">
          <span className="fw-project">
            <i />
            {desk.project}
          </span>
          <span className="fw-goal">
            <Target size={13} />
            {desk.goal}
          </span>
        </header>
        <div className="fw-sheet-body">
          <article className="fw-doc">
            <small>{desk.plugin}</small>
            <h3>{desk.heading}</h3>
            <p className="fw-typed">
              <span>{desk.typed}</span>
              <i className="fw-caret" />
            </p>
            <ul className="fw-insert">
              {desk.inserted.map((line) => (
                <li key={line}>
                  <span>“{line}”</span>
                  <em>{desk.source}</em>
                </li>
              ))}
            </ul>
            <span className="fw-line" />
            <span className="fw-line fw-line-short" />
          </article>
          <div className="fw-card">
            <div className="fw-card-head">
              <Sparkles size={14} />
              <strong>{desk.card.who}</strong>
              <span>{desk.card.context}</span>
            </div>
            <p>{desk.card.text}</p>
            <div className="fw-card-ask">
              <span className="fw-run">
                {desk.card.run}
                <span className="fw-pointer">
                  <MousePointer2
                    size={22}
                    fill="currentColor"
                    strokeWidth={1.4}
                  />
                </span>
              </span>
              <span className="fw-skip">{desk.card.skip}</span>
            </div>
            <div className="fw-card-done">
              <Check size={15} strokeWidth={3} />
              {desk.card.done}
              <u>{desk.card.undo}</u>
            </div>
          </div>
        </div>
        <footer className="fw-dock">
          {desk.dock.map((name) => (
            <span
              key={name}
              className="fw-chip"
              data-active={name === desk.plugin || undefined}
            >
              {name}
              {name === 'Inbox' ? <b className="fw-badge-inbox">3</b> : null}
              {name === '待办' ? <b className="fw-badge-todo">+2</b> : null}
            </span>
          ))}
          <span className="fw-chip fw-chip-ai">
            <Sparkles size={13} />
            {desk.assistant}
          </span>
        </footer>
      </div>
    </Loop>
  );
}
