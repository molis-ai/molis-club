'use client';
import {
  Check,
  CircleDot,
  Layers,
  Plus,
  ShieldCheck,
  Sparkles,
  Undo2,
} from 'lucide-react';
import { compose, control, relay } from '../../../../../content/folio-work';
import type { Vars } from '../shell';
import './scenes.css';

// Work 三个主场景的界面示意。每个场景左边三条要点，右边一张粘住的图版；
// 哪条要点走到视口中线，所在的 .ew-scene 就写上 data-step（0/1/2），画面跟着换到那一步。
// 基础样式是第三步（播完）的样子：减少动态或窄屏时直接看到结果。

function Pointer({ className }: { className: string }) {
  return (
    <svg
      className={`ew-sp ${className}`}
      viewBox="0 0 40 46"
      aria-hidden="true"
    >
      <path d="M8 2 L8 34 L16 26 L22 42 L28 40 L22 24 L34 24 Z" />
    </svg>
  );
}

/** 图版上方的小进度：01 02 03，当前那一步是墨色 */
function StepMarks() {
  return (
    <span className="ew-marks" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <i key={index}>{String(index + 1).padStart(2, '0')}</i>
      ))}
    </span>
  );
}

/** 场景 1：给项目加 Inbox，它依赖的 Feed 一起加上；个人插件在每个项目里都在 */
export function ComposeDemo() {
  return (
    <div className="ew-demo ewc" aria-hidden="true">
      <StepMarks />
      <div className="ewc-back">
        <header>
          <i />
          {compose.other}
        </header>
        <div className="ewc-dock">
          {compose.otherDock.map((name) => (
            <span key={name} className="ewc-chip">
              {name}
            </span>
          ))}
          <span className="ewc-divider" />
          {compose.personal.map((name) => (
            <span key={name} className="ewc-chip ewc-personal">
              {name}
            </span>
          ))}
        </div>
      </div>
      <div className="ewc-front">
        <header>
          <i />
          {compose.project}
          <small>项目插件 + 个人插件</small>
        </header>
        <div className="ewc-canvas">
          <span />
          <span />
          <span />
        </div>
        <p className="ewc-toast">
          <Layers size={13} />
          {compose.toast}
        </p>
        <div className="ewc-dock">
          {compose.dock.map((name) => (
            <span key={name} className="ewc-chip">
              {name}
            </span>
          ))}
          <span className="ewc-chip ewc-dep">{compose.dependency}</span>
          <span className="ewc-chip ewc-added">{compose.added}</span>
          <span className="ewc-add">
            <Plus size={13} />
          </span>
          <span className="ewc-divider" />
          {compose.personal.map((name) => (
            <span key={name} className="ewc-chip ewc-personal">
              {name}
            </span>
          ))}
          <span className="ewc-note">{compose.personalNote}</span>
        </div>
        <div className="ewc-picker">
          <small>{compose.picker}</small>
          {compose.options.map((name) => (
            <span key={name} data-pick={name === compose.added || undefined}>
              {name}
              <Plus size={12} />
              {name === compose.added ? (
                <Pointer className="ewc-pointer" />
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 场景 2：同一个 Goal，周一 Claude Code、周三 Codex、周四再换回来；周五收尾核对通过才算完成 */
export function RelayDemo() {
  return (
    <div className="ew-demo ewr" aria-hidden="true">
      <StepMarks />
      <div className="ewr-goal">
        <header>
          <small lang="en">Goal</small>
          <strong>{relay.goal}</strong>
          <span className="ewr-stamp">{relay.stamp}</span>
        </header>
        <ul className="ewr-req">
          {relay.require.map((item, index) => (
            <li key={item} style={{ '--n': index } as Vars}>
              <span className="ewr-box">
                <Check size={11} strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <ol className="ewr-log">
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
        <div className="ewr-proposal">
          <small>
            {relay.proposal.who} · {relay.proposal.tag}
          </small>
          <p>{relay.proposal.text}</p>
        </div>
        <div className="ewr-check">
          <strong>{relay.checkLabel}</strong>
          {relay.checks.map((item) => (
            <span key={item}>
              <Check size={12} strokeWidth={2.5} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 场景 3：四个调用方从同一个目录按授权调用；能撤销的直接做，推送先审查，撤权后不再写入 */
export function ControlDemo() {
  return (
    <div className="ew-demo ewk" aria-hidden="true">
      <StepMarks />
      <div className="ewk-catalog">
        <header>
          <ShieldCheck size={15} />
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
                      className="ewk-dot"
                      data-on={granted === 1 || undefined}
                      data-cell={`${row}-${col}`}
                    >
                      {row === 3 && col === 1 ? (
                        <Pointer className="ewk-pointer" />
                      ) : null}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ewk-events">
        <div className="ewk-event ewk-undo">
          <Sparkles size={13} />
          <b>{control.events.undo.who}</b>
          <span>{control.events.undo.text}</span>
          <u>
            <Undo2 size={12} />
            {control.events.undo.action}
          </u>
        </div>
        <div className="ewk-event ewk-review">
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
        <div className="ewk-event ewk-revoke">
          <CircleDot size={13} />
          <b>{control.events.revoke.who}</b>
          <span>{control.events.revoke.text}</span>
        </div>
      </div>
    </div>
  );
}
