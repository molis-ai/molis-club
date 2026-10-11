'use client';
import { Languages, Lightbulb, NotebookPen } from 'lucide-react';
import type { CSSProperties } from 'react';
import { demo } from '../../../../content/molis-tool';
import { Demo } from '../r3/kit';

// 夜间展馆的四件装置之外的三件：Tool 的投影文字、Life 的霓虹静物、Story 的一道光门；以及展厅平面图。
// Work 的屏幕装置直接用第三轮的演示时间轴（../r3/sheets），换成暗厅里的发光皮肤。

type Vars = CSSProperties & Record<`--${string}`, string | number>;
const icons = [Languages, Lightbulb, NotebookPen];

/** Tool：一句英文投在墙上，一道光划过它，旁边浮出三个动作，译文慢慢显出来。一轮 10 秒。 */
export function Projection({ active }: { active: boolean }) {
  return (
    <Demo p="xs" label={demo.label} active={active} className="xs-projection">
      <div className="xs-proj" aria-hidden="true">
        <p className="xs-proj-url">{demo.url}</p>
        <p className="xs-proj-en" lang="en">
          {demo.before}
          <mark className="xs-anim">{demo.selection}</mark>
          {demo.after}
        </p>
        <div className="xs-proj-chips xs-anim">
          {demo.actions.map((action, index) => {
            const Icon = icons[index];
            return (
              <span key={action} data-first={index === 0 || undefined}>
                <Icon size={14} strokeWidth={1.5} />
                {action}
              </span>
            );
          })}
        </div>
        <p className="xs-proj-zh xs-anim">{demo.result.text}</p>
        <p className="xs-proj-src xs-anim">{demo.result.source}</p>
      </div>
    </Demo>
  );
}

/** Life：霓虹线条的静物——扶手椅、落地灯、小茶几上一杯热茶。进场时逐笔亮起。 */
export function NeonLife() {
  return (
    <svg className="xs-neon" viewBox="0 0 520 360" aria-hidden="true">
      <defs>
        <filter id="xs-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g className="xs-neon-lines" filter="url(#xs-glow)">
        {/* 扶手椅 */}
        <path
          pathLength={1}
          style={{ '--k': 0 } as Vars}
          d="M70 300 L70 190 C 70 150 96 132 130 132 L210 132 C 244 132 270 150 270 190 L270 300"
        />
        <path
          pathLength={1}
          style={{ '--k': 1 } as Vars}
          d="M54 300 L54 226 C 54 206 66 196 84 196 L84 262 L256 262 L256 196 C 274 196 286 206 286 226 L286 300"
        />
        <path
          pathLength={1}
          style={{ '--k': 2 } as Vars}
          d="M84 240 L256 240 M70 300 L70 322 M270 300 L270 322 M54 300 L286 300"
        />
        {/* 落地灯 */}
        <path
          pathLength={1}
          style={{ '--k': 3 } as Vars}
          d="M346 322 L346 120 C 346 96 360 84 382 84"
        />
        <path
          pathLength={1}
          className="xs-neon-warm"
          style={{ '--k': 4 } as Vars}
          d="M364 84 L402 84 L418 124 L348 124 Z"
        />
        <path
          pathLength={1}
          style={{ '--k': 5 } as Vars}
          d="M326 322 L366 322"
        />
        {/* 小茶几与杯子 */}
        <path
          pathLength={1}
          style={{ '--k': 6 } as Vars}
          d="M396 238 L492 238 M406 238 L406 322 M482 238 L482 322"
        />
        <path
          pathLength={1}
          className="xs-neon-warm"
          style={{ '--k': 7 } as Vars}
          d="M430 210 L430 228 C 430 236 436 238 444 238 C 452 238 458 236 458 228 L458 210 Z M458 216 C 470 214 470 230 458 228"
        />
        <path
          pathLength={1}
          className="xs-neon-steam"
          style={{ '--k': 8 } as Vars}
          d="M438 200 C 430 188 446 182 438 168 M450 200 C 442 188 458 182 450 168"
        />
      </g>
      <ellipse className="xs-neon-pool" cx="383" cy="330" rx="120" ry="12" />
    </svg>
  );
}

/** Story：一道发光的门，门里起雾，光粒慢慢飘出来 */
export function Portal() {
  return (
    <div className="xs-portal" aria-hidden="true">
      <div className="xs-portal-door">
        <span className="xs-portal-haze" />
        <span className="xs-portal-horizon" />
        {Array.from({ length: 26 }, (_, index) => (
          <i
            key={index}
            style={
              {
                '--x': `${((index * 37) % 100).toFixed(0)}%`,
                '--d': `${((index * 0.61) % 7).toFixed(2)}s`,
                '--s': `${(0.6 + ((index * 13) % 10) / 10).toFixed(2)}`,
              } as Vars
            }
          />
        ))}
      </div>
      <span className="xs-portal-spill" />
    </div>
  );
}

/** 展厅平面图：前言、四个展厅、出口；当前所在的那一间亮着 */
export function FloorPlan({
  rooms,
}: {
  rooms: { id: string; label: string }[];
}) {
  return (
    <nav className="xs-plan" aria-label="展厅平面图">
      <ol>
        {rooms.map((room, index) => (
          <li key={room.id} style={{ '--i': index } as Vars}>
            <a href={`#${room.id}`}>
              <span className="xs-plan-cell" aria-hidden="true" />
              <span className="xs-plan-label">{room.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
