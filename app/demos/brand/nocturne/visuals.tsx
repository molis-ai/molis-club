'use client';
import { Check, Languages, Lightbulb, NotebookPen } from 'lucide-react';
import type { Vars } from './shared';

// 代码画的发光画面：Work 的接力线、Life 的轨道、Tool 的光标、Story 的拱门。
// 都是示意，不是产品截图；出现在产品线卡片上时带各线自己的概念标注。

function Note({ text }: { text?: string }) {
  return text ? <em className="nc-visual-note">{text}</em> : null;
}

/** 几个 Agent 的会话像三股光，汇进同一个目标 */
export function WorkVisual({ agents }: { agents: string[] }) {
  const threads = [
    'M-20 150 C 160 150, 220 300, 400 300',
    'M-20 300 C 160 300, 240 300, 400 300',
    'M-20 450 C 160 450, 220 300, 400 300',
  ];
  return (
    <div className="nc-visual nc-visual-work" aria-hidden="true">
      <svg viewBox="0 0 600 600">
        <defs>
          <linearGradient id="nc-relay" x1="0" x2="1">
            <stop offset="0" stopColor="#ffb46b" stopOpacity="0" />
            <stop offset="0.25" stopColor="#ffb46b" />
            <stop offset="1" stopColor="#ffe3c2" />
          </linearGradient>
        </defs>
        {threads.map((d, i) => (
          <g key={d}>
            <path d={d} className="nc-thread" />
            <path
              d={d}
              className="nc-thread-flow"
              style={{ '--i': i } as Vars}
            />
          </g>
        ))}
        {agents.slice(0, 3).map((agent, i) => (
          <text
            key={agent}
            x="22"
            y={[128, 282, 482][i]}
            className="nc-svg-label"
          >
            {agent}
          </text>
        ))}
        <line
          x1="400"
          y1="300"
          x2="620"
          y2="300"
          stroke="url(#nc-relay)"
          strokeWidth="2.5"
        />
        <circle cx="400" cy="300" r="26" className="nc-node-ring" />
        <circle cx="400" cy="300" r="7" className="nc-node" />
      </svg>
      <div className="nc-goal-card">
        <span className="nc-goal-head">
          <i />
          <b />
        </span>
        <span style={{ '--w': '86%' } as Vars} />
        <span style={{ '--w': '64%' } as Vars} />
        <span className="is-live" style={{ '--w': '72%' } as Vars} />
        <span className="nc-goal-check">
          <Check size={14} strokeWidth={2.4} />
        </span>
      </div>
    </div>
  );
}

/** 生活的琐事绕着一颗暖色的核心转；没有字时只是几粒光 */
export function LifeVisual({
  items,
  note,
}: {
  items?: readonly string[];
  note?: string;
}) {
  const orbiters = items ?? ['', '', '', ''];
  return (
    <div className="nc-visual nc-visual-life" aria-hidden="true">
      <div className="nc-orbits">
        {[0, 1, 2].map((ring) => (
          <div className={`nc-orbit nc-orbit-${ring}`} key={ring} />
        ))}
        <div className="nc-orbit-spin">
          {orbiters.map((item, i) => (
            <span
              className="nc-orbit-item"
              key={i}
              style={
                { '--a': `${(i * 360) / orbiters.length + 20}deg` } as Vars
              }
            >
              <b data-dot={item ? undefined : ''}>{item}</b>
            </span>
          ))}
        </div>
      </div>
      <div className="nc-sun" />
      <Note text={note} />
    </div>
  );
}

const actionIcons = [Languages, Lightbulb, NotebookPen];

/** 一页文字里亮起一段选区，光标旁浮出几个动作，再落下一张小卡 */
export function ToolVisual({
  actions,
  note,
}: {
  actions: readonly string[];
  note?: string;
}) {
  return (
    <div className="nc-visual nc-visual-tool" aria-hidden="true">
      <div className="nc-tv-page">
        {[82, 64, 0, 74, 58, 40].map((w, i) =>
          w ? (
            <span key={i} style={{ '--w': `${w}%` } as Vars} />
          ) : (
            <span key={i} className="nc-tv-line">
              <span style={{ '--w': '26%' } as Vars} />
              <span className="nc-tv-sel" />
            </span>
          ),
        )}
      </div>
      <span className="nc-tv-halo" />
      <span className="nc-tv-cursor">
        <svg viewBox="0 0 24 24" width="26" height="26">
          <path d="M4.5 3.2 19.6 10.4 12.6 12.4 9.2 19.4Z" />
        </svg>
        <i />
      </span>
      <div className="nc-tv-chips">
        {actions.map((action, i) => {
          const Icon = actionIcons[i % actionIcons.length];
          return (
            <span key={action} style={{ '--i': i } as Vars}>
              <Icon size={13} />
              {action}
            </span>
          );
        })}
      </div>
      <div className="nc-tv-card">
        <span style={{ '--w': '88%' } as Vars} />
        <span style={{ '--w': '62%' } as Vars} />
        <small />
      </div>
      <Note text={note} />
    </div>
  );
}

/** 一层层拱门后面有光，光尘往上飘 */
export function StoryVisual({ note }: { note?: string }) {
  return (
    <div className="nc-visual nc-visual-story" aria-hidden="true">
      <div className="nc-portal">
        {Array.from({ length: 7 }, (_, i) => (
          <span className="nc-arch" key={i} style={{ '--i': i } as Vars} />
        ))}
        <span className="nc-portal-light" />
        {Array.from({ length: 14 }, (_, i) => (
          <i
            className="nc-mote"
            key={i}
            style={
              {
                '--x': `${(i * 37) % 100}%`,
                '--d': `${6 + (i % 5) * 1.7}s`,
                '--delay': `${-i * 0.9}s`,
              } as Vars
            }
          />
        ))}
      </div>
      <Note text={note} />
    </div>
  );
}
