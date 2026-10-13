'use client';
import { useRef, useState } from 'react';

/* 产品插画全部是示意：用线和点讲清每条产品线的一句话，不冒充界面截图。 */

const RELAY_CYCLE = 9;
const RELAY_START = 40;
const RELAY_END = 520;

/** Molis Work：一条目标线，Agent 依次接手，最后由人核对。 */
export function WorkRelay({ agents }: { agents: string[] }) {
  const step = (456 - 104) / Math.max(1, agents.length - 1);
  const placed = agents.map((label, i) => ({
    label,
    x: 104 + i * step,
    up: i % 2 === 1,
  }));
  return (
    <svg className="og-relay" viewBox="0 0 560 300" aria-hidden="true">
      <text x="40" y="58" className="og-relay-kicker">
        GOAL
      </text>
      <text x="92" y="58" className="og-relay-caption">
        一份目标 · 做成了什么 · 还差什么
      </text>
      {Array.from({ length: 49 }, (_, i) => (
        <line
          key={i}
          x1={RELAY_START + i * 10}
          x2={RELAY_START + i * 10}
          y1={i % 5 === 0 ? 166 : 162}
          y2={158}
          className="og-relay-tick"
        />
      ))}
      <line
        x1={RELAY_START}
        x2={RELAY_END}
        y1="150"
        y2="150"
        className="og-relay-rest"
      />
      <line
        x1={RELAY_START}
        x2={RELAY_END}
        y1="150"
        y2="150"
        className="og-relay-done"
      />
      {placed.map((agent) => {
        const delay =
          ((agent.x - RELAY_START) / (RELAY_END - RELAY_START)) *
          RELAY_CYCLE *
          0.9;
        return (
          <g
            key={agent.label}
            style={{ '--delay': `${delay}s` } as React.CSSProperties}
          >
            <circle cx={agent.x} cy="150" r="14" className="og-relay-pulse" />
            <circle cx={agent.x} cy="150" r="4.5" className="og-relay-node" />
            <line
              x1={agent.x}
              x2={agent.x}
              y1={agent.up ? 136 : 164}
              y2={agent.up ? 112 : 188}
              className="og-relay-stem"
            />
            <text
              x={agent.x}
              y={agent.up ? 102 : 206}
              textAnchor="middle"
              className="og-relay-label"
            >
              {agent.label}
            </text>
          </g>
        );
      })}
      <g className="og-relay-token">
        <circle cx={RELAY_START} cy="150" r="16" className="og-relay-glow" />
        <circle cx={RELAY_START} cy="150" r="6" className="og-relay-dot" />
      </g>
      <g className="og-relay-check">
        <circle cx={RELAY_END} cy="150" r="13" />
        <path d={`M${RELAY_END - 5} 150.5 l3.6 3.6 l6.4 -7.2`} />
        <text
          x={RELAY_END}
          y="116"
          textAnchor="middle"
          className="og-relay-label"
        >
          核对
        </text>
      </g>
      <text x="40" y="262" className="og-relay-caption">
        换一个 AI，工作也接得上。
      </text>
    </svg>
  );
}

const C = 150;
const point = (hour: number, r: number) => {
  const a = ((hour / 24) * 360 - 90) * (Math.PI / 180);
  return [C + r * Math.cos(a), C + r * Math.sin(a)].map((v) => +v.toFixed(2));
};
const arc = (from: number, to: number, r: number) => {
  const [x1, y1] = point(from, r);
  const [x2, y2] = point(to, r);
  const large = (to - from) / 24 > 0.5 ? 1 : 0;
  return `M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

/** Molis Life：一天的刻度盘，琐事被交代出去，傍晚留给喜欢的生活。 */
export function LifeDial({ quotes }: { quotes: string[] }) {
  return (
    <div className="og-dial">
      <svg viewBox="0 0 300 300" aria-hidden="true">
        {Array.from({ length: 96 }, (_, i) => {
          const hour = i / 4;
          const major = i % 4 === 0;
          const [x1, y1] = point(hour, major ? 112 : 117);
          const [x2, y2] = point(hour, 124);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className={major ? 'og-dial-major' : 'og-dial-minor'}
            />
          );
        })}
        {[0, 6, 12, 18].map((h) => {
          const [x, y] = point(h, 138);
          return (
            <text
              key={h}
              x={x}
              y={y + 3.5}
              textAnchor="middle"
              className="og-dial-hour"
            >
              {String(h).padStart(2, '0')}
            </text>
          );
        })}
        <path d={arc(8, 17, 96)} className="og-dial-day" />
        <path d={arc(18, 23, 96)} className="og-dial-life" pathLength={1} />
        {[9.5, 12.5, 15.5].map((hour, i) => (
          <g
            key={hour}
            transform={`rotate(${(hour / 24) * 360 - 90} ${C} ${C})`}
            style={{ '--delay': `${i * 1.4}s` } as React.CSSProperties}
          >
            <circle cx={C + 96} cy={C} r="4" className="og-dial-task" />
          </g>
        ))}
        <g className="og-dial-hand">
          <line x1={C} y1={C} x2={C} y2={C - 84} />
          <circle cx={C} cy={C} r="3.5" />
        </g>
      </svg>
      <ul className="og-dial-quotes" aria-label="可以交代给它的事（示意）">
        {quotes.map((quote, i) => (
          <li key={quote} style={{ '--i': i } as React.CSSProperties}>
            {quote}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Molis Tool：选中一句话，动作出现在光标旁。鼠标移进来时，它跟着你的光标走。 */
export function ToolCursor({
  actions,
  before,
  selection,
  after,
  result,
}: {
  actions: string[];
  before: string;
  selection: string;
  after: string;
  result: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--x', `${event.clientX - r.left}px`);
    ref.current.style.setProperty('--y', `${event.clientY - r.top}px`);
    if (!live) setLive(true);
  };

  return (
    <div
      ref={ref}
      className={`og-tool${live ? ' is-live' : ''}`}
      onPointerMove={onMove}
      onPointerLeave={() => setLive(false)}
      aria-hidden="true"
    >
      <div className="og-tool-page">
        <span className="og-tool-bar" style={{ width: '46%' }} />
        <span className="og-tool-bar" style={{ width: '88%' }} />
        <p>
          {before}
          <mark>{selection}</mark>
          {after}
        </p>
        <span className="og-tool-bar" style={{ width: '72%' }} />
        <span className="og-tool-bar" style={{ width: '80%' }} />
        <span className="og-tool-bar" style={{ width: '38%' }} />
      </div>
      <div className="og-tool-float">
        <svg
          className="og-tool-cursor"
          viewBox="0 0 16 22"
          width="16"
          height="22"
        >
          <path d="M1 1 L1 17 L5.2 13.2 L8 20 L10.6 18.9 L7.8 12.3 L13.5 12.3 Z" />
        </svg>
        <div className="og-tool-chips">
          {actions.map((action, i) => (
            <span key={action} style={{ '--i': i } as React.CSSProperties}>
              {action}
            </span>
          ))}
        </div>
        <div className="og-tool-result">{result}</div>
      </div>
    </div>
  );
}

const ARCHES = [1, 0.8, 0.62, 0.46, 0.32];
const archPath = (s: number) => {
  const w = 150 * s;
  const h = 210 * s;
  const x = 150 - w / 2;
  const bottom = 250 - (1 - s) * 70;
  const r = w / 2;
  return `M${x} ${bottom} V${bottom - h + r} A${r} ${r} 0 0 1 ${x + w} ${bottom - h + r} V${bottom}`;
};

/** Molis Story：一扇扇窗通向彼处，走进去，再带一样东西回来。 */
export function StoryArches({ steps }: { steps: string[] }) {
  return (
    <div className="og-arches">
      <svg viewBox="0 0 300 290" aria-hidden="true">
        <defs>
          <radialGradient id="og-elsewhere" cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor="#f4b88d" />
            <stop offset="100%" stopColor="#e9915e" stopOpacity="0.15" />
          </radialGradient>
        </defs>
        <path
          d={archPath(0.32)}
          className="og-arch-far"
          fill="url(#og-elsewhere)"
        />
        {ARCHES.map((s, i) => (
          <path
            key={s}
            d={archPath(s)}
            className="og-arch"
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
        <line
          x1="20"
          x2="280"
          y1="250.5"
          y2="250.5"
          className="og-arch-ground"
        />
        <g className="og-arch-walker">
          <circle cx="150" cy="268" r="6" />
        </g>
      </svg>
      <ol className="og-arches-steps">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
