'use client';
import {
  Check,
  CircleDot,
  Layers,
  MousePointer2,
  Plus,
  ShieldCheck,
  Sparkles,
  Undo2,
} from 'lucide-react';
import { compose, control, relay } from '../../../../../content/folio-work';
import { Loop } from '../loop';
import type { Vars } from '../shared';
import './scenes.css';

// Work 三个主场景的演示，各讲一件事，都是 12 秒一轮的 CSS 时间轴。
// 基础样式是播完的样子：减少动态时直接看到结果。

function Pointer({ className }: { className: string }) {
  return (
    <span className={`fws-pointer ${className}`} aria-hidden="true">
      <MousePointer2 size={22} fill="currentColor" strokeWidth={1.4} />
    </span>
  );
}

/** 场景 1：给项目加 Inbox，它依赖的 Feed 一起加上；个人插件在每个项目里都在 */
export function ComposeDemo() {
  return (
    <Loop
      label={compose.label}
      note="界面示意 · 示例项目"
      className="fws fws-compose"
    >
      <div className="fwc-back" aria-hidden="true">
        <header>
          <i />
          {compose.other}
        </header>
        <div className="fwc-dock">
          {compose.otherDock.map((name) => (
            <span key={name} className="fwc-chip">
              {name}
            </span>
          ))}
          <span className="fwc-divider" />
          {compose.personal.map((name) => (
            <span key={name} className="fwc-chip fwc-personal">
              {name}
            </span>
          ))}
        </div>
      </div>
      <div className="fwc-front" aria-hidden="true">
        <span className="fo-tape fo-tape-a" />
        <header>
          <i />
          {compose.project}
          <small>项目插件 + 个人插件</small>
        </header>
        <div className="fwc-canvas">
          <span />
          <span />
          <span />
        </div>
        <div className="fwc-picker">
          <small>{compose.picker}</small>
          {compose.options.map((name) => (
            <span key={name} data-pick={name === compose.added || undefined}>
              {name}
              <Plus size={13} />
              {name === compose.added ? (
                <Pointer className="fwc-pointer-pick" />
              ) : null}
            </span>
          ))}
        </div>
        <p className="fwc-toast">
          <Layers size={14} />
          {compose.toast}
        </p>
        <div className="fwc-dock">
          {compose.dock.map((name) => (
            <span key={name} className="fwc-chip">
              {name}
            </span>
          ))}
          <span className="fwc-chip fwc-new fwc-new-a">
            {compose.dependency}
          </span>
          <span className="fwc-chip fwc-new fwc-new-b">{compose.added}</span>
          <span className="fwc-add">
            <Plus size={14} />
            <Pointer className="fwc-pointer-add" />
          </span>
          <span className="fwc-divider" />
          {compose.personal.map((name) => (
            <span key={name} className="fwc-chip fwc-personal">
              {name}
            </span>
          ))}
        </div>
        <span className="fwc-personal-note">{compose.personalNote}</span>
      </div>
    </Loop>
  );
}

/** 场景 2：同一个 Goal，周一 Claude Code、周三 Codex、周四再换回来；周五收尾核对通过才算完成 */
export function RelayDemo() {
  return (
    <Loop
      label={relay.label}
      note="界面示意 · 示例目标"
      className="fws fws-relay"
    >
      <div className="fwr-goal" aria-hidden="true">
        <span className="fo-tape fo-tape-a" />
        <header>
          <small>Goal</small>
          <h4>{relay.goal}</h4>
          <span className="fwr-stamp">{relay.stamp}</span>
        </header>
        <ul className="fwr-req">
          {relay.require.map((item, index) => (
            <li key={item} style={{ '--n': index } as Vars}>
              <span className="fwr-box">
                <Check size={13} strokeWidth={3.5} />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <ol className="fwr-log">
          {relay.log.map((entry, index) => (
            <li
              key={entry.day + entry.who}
              data-tone={entry.tone}
              style={{ '--n': index } as Vars}
            >
              <small>{entry.day}</small>
              <b>{entry.who}</b>
              <span>{entry.text}</span>
            </li>
          ))}
        </ol>
        <div className="fwr-check">
          <strong>{relay.checkLabel}</strong>
          {relay.checks.map((item) => (
            <span key={item}>
              <Check size={13} strokeWidth={3} />
              {item}
            </span>
          ))}
        </div>
        <div className="fwr-proposal">
          <small>
            {relay.proposal.who} · {relay.proposal.tag}
          </small>
          <p>{relay.proposal.text}</p>
        </div>
      </div>
    </Loop>
  );
}

/** 场景 3：四个调用方从同一个目录按授权调用；能撤销的直接做，推送先审查，撤权后不再写入 */
export function ControlDemo() {
  return (
    <Loop
      label={control.label}
      note="界面示意 · 示例授权"
      className="fws fws-control"
    >
      <div className="fwk-catalog" aria-hidden="true">
        <span className="fo-tape fo-tape-a" />
        <header>
          <ShieldCheck size={16} />
          {control.catalog}
        </header>
        <table>
          <thead>
            <tr>
              <th>调用方</th>
              {control.abilities.map((ability) => (
                <th key={ability}>{ability}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {control.callers.map((caller, row) => (
              <tr key={caller}>
                <th>{caller}</th>
                {control.grants[row].map((granted, col) => (
                  <td key={col}>
                    <span
                      className="fwk-dot"
                      data-on={granted === 1 || undefined}
                      data-cell={`${row}-${col}`}
                    >
                      {row === 3 && col === 1 ? (
                        <Pointer className="fwk-pointer" />
                      ) : null}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="fwk-events" aria-hidden="true">
        <div className="fwk-event fwk-event-undo">
          <Sparkles size={14} />
          <b>{control.events.undo.who}</b>
          <span>{control.events.undo.text}</span>
          <u>
            <Undo2 size={12} />
            {control.events.undo.action}
          </u>
        </div>
        <div className="fwk-event fwk-event-review">
          <small>{control.events.review.label}</small>
          <p>
            <b>{control.events.review.who}</b>
            {control.events.review.text}
          </p>
          <span>
            {control.events.review.actions.map((action) => (
              <i key={action}>{action}</i>
            ))}
          </span>
        </div>
        <div className="fwk-event fwk-event-revoke">
          <CircleDot size={14} />
          <b>{control.events.revoke.who}</b>
          <span>{control.events.revoke.text}</span>
        </div>
      </div>
    </Loop>
  );
}
