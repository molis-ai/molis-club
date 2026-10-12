'use client';
import { MousePointer2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { desk } from '../../../../../content/folio-work';
import { demo } from '../../../../../content/molis-tool';
import { Demo, type Vars } from '../_kit/kit';

// 白盒子美术馆的展厅与四件作品。展厅是一间用 CSS 三维搭出来的白盒子（天花、两面侧墙、地面、正墙），
// 镜头随滚动往正墙推近；作品和展签挂在正墙上，跟着墙一起被看清。
// 作品：Work 三联画、Tool 墙面文字、Life 格线画、Story 色域画。都是对产品方向的转译，不是产品界面。

/** 一间白盒子展厅：children 挂在正墙上 */
export function Room({ children }: { children: ReactNode }) {
  return (
    <div className="wc-room" data-parallax>
      <div className="wc-cam">
        <span className="wc-plane wc-ceiling" aria-hidden="true" />
        <span className="wc-plane wc-side wc-left" aria-hidden="true" />
        <span className="wc-plane wc-side wc-right" aria-hidden="true" />
        <span className="wc-plane wc-floor" aria-hidden="true" />
        <div className="wc-wall">
          <div className="wc-hang">{children}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Work 三联画：I 写下一句周报，II 助理递上一张操作卡、点「执行」，III 三条反馈带着出处落进来。
 * 三幅依次被灯照亮，一轮 12 秒；基础样式是三幅都亮、都画完。
 */
export function Triptych({ active }: { active: boolean }) {
  return (
    <Demo p="wc" label={desk.label} active={active} className="wc-triptych">
      <div className="wc-tri" aria-hidden="true">
        <div className="wc-panel wc-panel-1">
          <div className="wc-print">
            <p className="wc-crumb">
              {desk.project} <span>/</span> {desk.goal}
            </p>
            <p className="wc-print-head">{desk.heading}</p>
            <p className="wc-typed">
              <span className="wc-typed-text">{desk.typed}</span>
              <i className="wc-caret" />
            </p>
            <span className="wc-rule" />
            <span className="wc-rule wc-rule-short" />
            <span className="wc-rule wc-rule-gap" />
            <span className="wc-rule" />
            <span className="wc-rule wc-rule-short" />
            <span className="wc-rule wc-rule-gap" />
            <span className="wc-rule wc-rule-mid" />
          </div>
          <span className="wc-numeral">I</span>
        </div>
        <div className="wc-panel wc-panel-2">
          <div className="wc-print">
            <span className="wc-rule" />
            <span className="wc-rule wc-rule-short" />
            <div className="wc-ask">
              <p className="wc-ask-who">
                {desk.card.who} <span>· {desk.card.context}</span>
              </p>
              <p className="wc-ask-text">{desk.card.text}</p>
              <p className="wc-ask-actions">
                <span className="wc-ask-run">{desk.card.run}</span>
                <span>{desk.card.skip}</span>
              </p>
              <span className="wc-tap">
                <MousePointer2
                  size={15}
                  fill="currentColor"
                  strokeWidth={1.2}
                />
              </span>
            </div>
          </div>
          <span className="wc-numeral">II</span>
        </div>
        <div className="wc-panel wc-panel-3">
          <div className="wc-print">
            <p className="wc-print-head">{desk.heading}</p>
            <p className="wc-print-line">{desk.typed}</p>
            <ul className="wc-fed">
              {desk.inserted.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                  <small>{desk.source}</small>
                </li>
              ))}
            </ul>
            <p className="wc-done">
              {desk.card.done} <span>· {desk.card.undo}</span>
            </p>
          </div>
          <span className="wc-numeral">III</span>
        </div>
      </div>
    </Demo>
  );
}

/**
 * Tool 墙面文字：一句英文直接写在墙上，铅笔线划过选中的那句，墙上的大光标旁边出现三个动作，
 * 译文写在一张钉在墙上的小卡片里。一轮 10 秒；基础样式是划好、钉好的样子。
 */
export function WallText({ active }: { active: boolean }) {
  return (
    <Demo p="wc" label={demo.label} active={active} className="wc-walltext">
      <div className="wc-wt" aria-hidden="true">
        <p className="wc-wt-url">{demo.url}</p>
        <p className="wc-wt-en" lang="en">
          {demo.before}
          <mark>{demo.selection}</mark>
          {demo.after}
        </p>
        <div className="wc-wt-cursor">
          <MousePointer2 size={56} fill="currentColor" strokeWidth={0.6} />
          <p className="wc-wt-chips">
            {demo.actions.map((action) => (
              <span key={action}>{action}</span>
            ))}
          </p>
        </div>
        <div className="wc-wt-card">
          <i className="wc-pin" />
          <small>{demo.result.label}</small>
          <p>{demo.result.text}</p>
          <small>{demo.result.source}</small>
        </div>
      </div>
    </Demo>
  );
}

/** 一道铅笔横线：两端略有起伏，像手画的 */
function pencil(y: number, seed: number) {
  const wobble = (n: number) => (((seed * 31 + n * 17) % 7) - 3) * 0.18;
  return `M44 ${y + wobble(1)} C 140 ${y + wobble(2)} 260 ${y + wobble(3)} 356 ${y + wobble(4)}`;
}

const rows = Array.from({ length: 13 }, (_, index) => 52 + index * 24);
const ticks = [0, 1, 2, 4, 5, 7];

/**
 * Life 格线画：一张近乎空白的画布上画满铅笔横线，走近时一行行被勾掉，右下角长出几朵小花。
 * 勾与花随镜头推近画出（--d），减少动态时直接是画完的样子。
 */
export function GridDrawing() {
  return (
    <svg className="wc-grid" viewBox="0 0 400 400" aria-hidden="true">
      <rect className="wc-grid-ground" width="400" height="400" />
      <rect className="wc-grid-band" y="118" width="400" height="74" />
      <rect
        className="wc-grid-band wc-grid-band-2"
        y="262"
        width="400"
        height="58"
      />
      <g className="wc-grid-lines">
        {rows.map((y, index) => (
          <path key={y} d={pencil(y, index)} />
        ))}
      </g>
      <g className="wc-grid-ticks">
        {ticks.map((row, index) => {
          const y = rows[row];
          return (
            <path
              key={row}
              pathLength={1}
              style={{ '--at': (0.14 + index * 0.085).toFixed(3) } as Vars}
              d={`M50 ${y - 7} L55 ${y - 2} L66 ${y - 14}`}
            />
          );
        })}
      </g>
      <g className="wc-grid-flowers">
        <path
          pathLength={1}
          style={{ '--at': 0.66 } as Vars}
          d="M318 364 C 316 344 322 330 318 312 M330 364 C 334 350 340 342 344 330 M306 364 C 304 356 298 350 292 344"
        />
        {[
          { x: 318, y: 306, r: 7, at: 0.72 },
          { x: 346, y: 325, r: 5.5, at: 0.78 },
          { x: 289, y: 340, r: 4.5, at: 0.84 },
        ].map((flower) => (
          <g
            key={flower.x}
            className="wc-flower"
            style={
              {
                '--at': flower.at,
                transformOrigin: `${flower.x}px ${flower.y}px`,
              } as Vars
            }
          >
            {Array.from({ length: 5 }, (_, petal) => {
              const angle = (petal / 5) * Math.PI * 2 - Math.PI / 2;
              return (
                <circle
                  key={petal}
                  cx={(flower.x + Math.cos(angle) * flower.r).toFixed(2)}
                  cy={(flower.y + Math.sin(angle) * flower.r).toFixed(2)}
                  r={(flower.r * 0.62).toFixed(2)}
                />
              );
            })}
            <circle
              className="wc-flower-heart"
              cx={flower.x}
              cy={flower.y}
              r={(flower.r * 0.42).toFixed(2)}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Story 色域画：竖长的画布像一道门，暮蓝在上、暖沙在下，两块柔边的色面慢慢呼吸 */
export function ColorField() {
  return (
    <div className="wc-field" aria-hidden="true">
      <span className="wc-field-upper" />
      <span className="wc-field-seam" />
      <span className="wc-field-lower" />
    </div>
  );
}

/** 导览里的缩略图：四件作品各一个极小的样子 */
export function Thumb({ id }: { id: 'work' | 'tool' | 'life' | 'story' }) {
  return (
    <span className={`wc-thumb wc-thumb-${id}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
