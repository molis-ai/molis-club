import { useId, type PointerEvent } from 'react';
import type { StationId } from '../../../content/site/enterprise';
import type { Vars } from '../../_site/ui';

// 架子上「留在团队手里」的四件东西：每件是一小段「做出来」的动画。
// 静止时就是做好的样子（过去的站、没有 JS、减少动态都看这一帧）；
// 卡片上有 data-play 时从头演一遍：方案一行行写出来、圈出值得先做的那一格、盖章；
// 工具里打字、按下按钮、结果一条条出来；放大镜扫过问题记录，✕ 复测后变成 ✓；一叠卡片散开，清单逐项打勾、流程逐个点亮。
// 画布 240 × 170，墨色细线、白纸、一点杏橙，纸张带一层柔和的影子。动画在 enterprise.css（m-k- 开头）。

const VIEW = '0 0 240 170';
export const at = (seconds: number) => ({ '--d': `${seconds}s` }) as Vars;

export function Shadow({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-25%" y="-20%" width="150%" height="150%">
        <feDropShadow className="m-k-shade" dx="0" dy="6" stdDeviation="7" />
      </filter>
    </defs>
  );
}

/** 一页试点方案：标题、一张「价值 × 成本」的小格子图（圈出值得先做的那一格）、几行字、一枚章 */
function Plan() {
  const shadow = useId();
  return (
    <svg className="m-keep-art" viewBox={VIEW} aria-hidden="true">
      <Shadow id={shadow} />
      <g className="m-k-rise" style={at(0)} filter={`url(#${shadow})`}>
        <path className="m-k-paper" d="M62 12 H162 L178 28 V160 H62 Z" />
      </g>
      <path
        className="m-k-fold m-k-fade"
        style={at(0.2)}
        d="M162 12 V28 H178"
      />
      <path
        className="m-k-ink m-k-draw"
        style={at(0.35)}
        pathLength={1}
        d="M76 32 H130"
      />
      <path
        className="m-k-thin m-k-draw"
        style={at(0.5)}
        pathLength={1}
        d="M76 41 H110"
      />
      <g className="m-k-fade" style={at(0.6)}>
        <rect
          className="m-k-cell"
          x="76"
          y="52"
          width="88"
          height="58"
          rx="3"
        />
        <path className="m-k-cell" d="M120 52 V110 M76 81 H164" />
      </g>
      <circle
        className="m-k-dot m-k-pop"
        style={at(0.85)}
        cx="140"
        cy="68"
        r="3"
      />
      <circle
        className="m-k-dot m-k-pop"
        style={at(0.95)}
        cx="148"
        cy="96"
        r="3"
      />
      <circle
        className="m-k-dot m-k-pop"
        style={at(1.05)}
        cx="104"
        cy="97"
        r="3"
      />
      <circle
        className="m-k-hot m-k-pop"
        style={at(1.25)}
        cx="96"
        cy="66"
        r="3.8"
      />
      <path
        className="m-k-ring m-k-draw"
        style={at(1.45)}
        pathLength={1}
        d="M96 56 a10 10 0 1 1 -0.01 0"
      />
      <path
        className="m-k-line m-k-draw"
        style={at(1.75)}
        pathLength={1}
        d="M76 124 H150"
      />
      <path
        className="m-k-line m-k-draw"
        style={at(1.9)}
        pathLength={1}
        d="M76 134 H136"
      />
      <path
        className="m-k-line m-k-draw"
        style={at(2.05)}
        pathLength={1}
        d="M76 144 H124"
      />
      <g className="m-k-stamp" style={at(2.35)}>
        <circle cx="152" cy="140" r="11" />
        <path d="M147 140 l3.5 3.6 l6.5 -7.2" />
      </g>
    </svg>
  );
}

/** 一个能试用的小工具：输入框里打字，按下按钮，结果一条条出来 */
function Tool() {
  const shadow = useId();
  return (
    <svg className="m-keep-art" viewBox={VIEW} aria-hidden="true">
      <Shadow id={shadow} />
      <g className="m-k-rise" style={at(0)} filter={`url(#${shadow})`}>
        <rect
          className="m-k-paper"
          x="32"
          y="16"
          width="176"
          height="140"
          rx="10"
        />
      </g>
      <path className="m-k-cell" d="M32 34 H208" />
      <circle className="m-k-light" cx="45" cy="25" r="2.6" />
      <circle className="m-k-light" cx="54" cy="25" r="2.6" />
      <circle className="m-k-light" cx="63" cy="25" r="2.6" />
      <rect
        className="m-k-field"
        x="48"
        y="46"
        width="144"
        height="24"
        rx="6"
      />
      <rect
        className="m-k-type"
        style={at(0.45)}
        x="58"
        y="55"
        width="26"
        height="6"
        rx="3"
      />
      <rect
        className="m-k-type"
        style={at(0.6)}
        x="88"
        y="55"
        width="18"
        height="6"
        rx="3"
      />
      <rect
        className="m-k-type"
        style={at(0.75)}
        x="110"
        y="55"
        width="30"
        height="6"
        rx="3"
      />
      <path className="m-k-caret" d="M146 52 V64" />
      <circle className="m-k-ripple" cx="171" cy="88" r="16" />
      <g className="m-k-press" style={at(1.15)}>
        <rect
          className="m-k-button"
          x="150"
          y="80"
          width="42"
          height="16"
          rx="8"
        />
        <path
          className="m-k-arrow"
          d="M166 88 H176 M172 84.5 L176 88 L172 91.5"
        />
      </g>
      {[108, 124, 140].map((y, index) => (
        <g key={y} className="m-k-row" style={at(1.5 + index * 0.16)}>
          <circle className="m-k-ok" cx="56" cy={y} r="6" />
          <path className="m-k-tick" d={`M53.2 ${y} l2 2 l3.8 -4`} />
          <path
            className="m-k-line"
            d={`M70 ${y} H${[160, 140, 152][index]}`}
          />
        </g>
      ))}
    </svg>
  );
}

/** 一本问题记录：放大镜从上往下扫，标着 ✕ 的两条复测之后变成 ✓ */
function Log() {
  const shadow = useId();
  const rows = [48, 74, 100, 126];
  return (
    <svg className="m-keep-art" viewBox={VIEW} aria-hidden="true">
      <Shadow id={shadow} />
      <g className="m-k-rise" style={at(0)} filter={`url(#${shadow})`}>
        <rect
          className="m-k-paper"
          x="56"
          y="18"
          width="128"
          height="144"
          rx="8"
        />
      </g>
      <rect className="m-k-clip" x="98" y="10" width="44" height="14" rx="4" />
      {rows.map((y, index) => {
        const fixed = index === 1 || index === 2;
        return (
          <g key={y}>
            <path
              className="m-k-line m-k-draw"
              style={at(0.3 + index * 0.1)}
              pathLength={1}
              d={`M88 ${y} H${[166, 156, 162, 146][index]}`}
            />
            <circle className="m-k-mark" cx="72" cy={y} r="7.5" />
            {fixed ? (
              <>
                <path
                  className="m-k-bad"
                  style={at(index === 1 ? 1.05 : 1.45)}
                  d={`M68.5 ${y - 3.5} l7 7 m0 -7 l-7 7`}
                />
                <path
                  className="m-k-fix"
                  style={at(index === 1 ? 1.05 : 1.45)}
                  d={`M68.6 ${y} l2.4 2.5 l4.6 -5`}
                />
              </>
            ) : (
              <path
                className="m-k-check m-k-fade"
                style={at(0.5 + index * 0.1)}
                d={`M68.6 ${y} l2.4 2.5 l4.6 -5`}
              />
            )}
          </g>
        );
      })}
      <path
        className="m-k-thin m-k-draw"
        style={at(1.9)}
        pathLength={1}
        d="M88 146 H132"
      />
      <g className="m-k-lens">
        <circle cx="0" cy="0" r="13" />
        <path d="M9.5 9.5 L19 19" />
      </g>
    </svg>
  );
}

/** 一叠检查清单与操作流程：三张卡从一叠里散开，清单逐项打勾，流程逐个点亮 */
function Stack() {
  const shadow = useId();
  const card = (x: number, y: number, r: number) =>
    ({ '--tx': `${x}px`, '--ty': `${y}px`, '--r': `${r}deg` }) as Vars;
  return (
    <svg className="m-keep-art" viewBox={VIEW} aria-hidden="true">
      <Shadow id={shadow} />
      {/* 任务说明 */}
      <g
        className="m-k-card"
        style={card(26, 54, -7)}
        filter={`url(#${shadow})`}
      >
        <rect className="m-k-paper" width="66" height="88" rx="6" />
        <path className="m-k-ink" d="M10 15 H40" />
        <path
          className="m-k-thin"
          d="M10 28 H56 M10 38 H50 M10 48 H54 M10 58 H44 M10 68 H52"
        />
      </g>
      {/* 操作流程 */}
      <g
        className="m-k-card"
        style={card(148, 54, 7)}
        filter={`url(#${shadow})`}
      >
        <rect className="m-k-paper" width="66" height="88" rx="6" />
        <path className="m-k-cell" d="M33 25 V37 M33 51 V63" />
        {[18, 44, 70].map((cy, index) => (
          <circle
            key={cy}
            className="m-k-node"
            style={at(1.35 + index * 0.22)}
            cx="33"
            cy={cy}
            r="6.5"
          />
        ))}
      </g>
      {/* 检查清单：在最上面 */}
      <g
        className="m-k-card"
        style={card(87, 36, 0)}
        filter={`url(#${shadow})`}
      >
        <rect className="m-k-paper" width="66" height="88" rx="6" />
        {[20, 42, 64].map((y, index) => (
          <g key={y}>
            <rect
              className="m-k-box"
              x="9"
              y={y - 5}
              width="10"
              height="10"
              rx="2"
            />
            <path
              className="m-k-tick-ink m-k-draw"
              style={at(1.2 + index * 0.22)}
              pathLength={1}
              d={`M11 ${y} l2 2.2 l4 -4.6`}
            />
            <path className="m-k-line" d={`M26 ${y} H${[56, 50, 54][index]}`} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/**
 * 从头演一遍这件东西「做出来」的动画。第一次是加上 data-play；
 * 已经演过的，把卡里的每段样式动画倒回开头再放（Web Animations），比去掉再加属性更稳。
 */
export function play(node: Element | null) {
  // 卡片（HTML）和示意（SVG）都能重演
  if (!(node instanceof Element)) return;
  if (!node.hasAttribute('data-play')) {
    node.setAttribute('data-play', '');
    return;
  }
  const parts = (node.getAnimations?.({ subtree: true }) ?? []).filter(
    (animation) => animation instanceof CSSAnimation,
  );
  if (!parts.length) {
    node.removeAttribute('data-play');
    void node.getBoundingClientRect();
    node.setAttribute('data-play', '');
    return;
  }
  for (const animation of parts) {
    animation.cancel();
    animation.play();
  }
}

/** 卡片跟着鼠标倾斜，反光跟着走（只对鼠标；触屏上点一下就是重演） */
export function tilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return;
  const node = event.currentTarget;
  const box = node.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width;
  const y = (event.clientY - box.top) / box.height;
  node.style.setProperty('--ry', `${((x - 0.5) * 14).toFixed(2)}deg`);
  node.style.setProperty('--rx', `${((0.5 - y) * 10).toFixed(2)}deg`);
  node.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
  node.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
}
export function untilt(event: PointerEvent<HTMLElement>) {
  for (const name of ['--rx', '--ry', '--mx', '--my'])
    event.currentTarget.style.removeProperty(name);
}

export function Keep({ id }: { id: StationId }) {
  if (id === 'diagnose') return <Plan />;
  if (id === 'build') return <Tool />;
  if (id === 'assess') return <Log />;
  return <Stack />;
}
