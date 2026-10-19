'use client';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { enterprise, type Exploration } from '../../../content/site/enterprise';
import { Note, Phrases, Status, type Vars } from '../../_site/ui';
import { play } from './keeps';

// 我们也在亲自探索：一屏之内，标题下一句——这三项都会作为 Molis Work 的原生官方插件推出（负责人 2026-10-15 定）。
// CGS、Evrik、Aether 各是一张插件卡：图标、名字、阶段，它回应的那个企业问题，一张会动的示意。
// 示意和路线架子上那四件同一种画法（白纸、柔和的影子、墨色细线、一点杏橙，零件共用 m-k-），只用这一项原文里的词：
// CGS 几张材料聚拢 → 一页研究判断划出重点 → 讨论与创作一行行写出来 → 散成几份不同平台的稿件；
// Evrik 拿到目标的 Agent 读当前情况，在权限和业务规则的虚线框里按下一项软件能力；
// Aether 指标、业务知识、分析过程汇进一份报告，报告上的依据沿虚线回查到分析过程。
// 静止就是画好的样子；卡进入视口时画一遍，鼠标停到卡上再画一遍。「已有 / 还没有」（5.4「当前阶段」的两半）
// 在宽屏上等这一遍画完才浮出来，窄屏和触屏直接写在示意下面。
// 整屏一枚「内部探索，不是客户案例」的章，和 5.4 那句「仍需要重新验证」放在页脚；示意标「示意」；不写成效，不写百分比。

const { explore } = enterprise;

const VIEW = '0 0 360 176';
const at = (seconds: number) => ({ '--d': `${seconds}s` }) as Vars;
/** 落点（静止的位置与角度）与动画开始时相对落点的偏移 */
const place = (
  x: number,
  y: number,
  r: number,
  fx: number,
  fy: number,
  fr: number,
  d: number,
) =>
  ({
    '--tx': `${x}px`,
    '--ty': `${y}px`,
    '--r': `${r}deg`,
    '--fx': `${fx}px`,
    '--fy': `${fy}px`,
    '--fr': `${fr}deg`,
    '--d': `${d}s`,
  }) as Vars;

function Art({ children }: { children: (shadow: string) => ReactNode }) {
  const id = useId();
  return (
    <svg className="m-lab-art" viewBox={VIEW} aria-hidden="true">
      <defs>
        <filter id={id} x="-25%" y="-25%" width="150%" height="160%">
          <feDropShadow className="m-k-shade" dx="0" dy="5" stdDeviation="6" />
        </filter>
      </defs>
      {children(`url(#${id})`)}
    </svg>
  );
}

/** CGS：材料 → 研究判断 → 讨论与创作 → 平台稿件 */
function Cgs({ w }: { w: string[] }) {
  const slips = [
    place(30, 50, -9, -26, -34, -28, 0),
    place(36, 72, 5, -34, 22, 24, 0.08),
    place(28, 94, -3, 8, 36, -18, 0.16),
  ];
  const drafts = [
    { w: 26, h: 46, style: place(286, 52, -7, 22, 14, 7, 2.35) },
    { w: 36, h: 36, style: place(304, 62, 6, 4, 6, -6, 2.45) },
    { w: 46, h: 28, style: place(294, 98, -2, 10, -24, 2, 2.55) },
  ];
  const wires = [
    { d: 'M82 86 H110', x: 110, len: 28, t: 0.55 },
    { d: 'M172 86 H198', x: 198, len: 26, t: 1.35 },
    { d: 'M262 86 H284', x: 284, len: 22, t: 2.15 },
  ];
  const labels: [number, string, number][] = [
    [52, w[0], 0.2],
    [141, w[1], 1],
    [230, w[2], 1.7],
    [316, w[3], 2.5],
  ];
  return (
    <Art>
      {(shadow) => (
        <>
          {/* 材料：三张小纸片从四处聚过来 */}
          {slips.map((style, index) => (
            <g key={index} className="m-x-place m-x-gather" style={style}>
              <rect
                className="m-x-card"
                width="40"
                height="26"
                rx="3"
                filter={shadow}
              />
              <path className="m-x-thin" d="M7 9 H30 M7 17 H24" />
            </g>
          ))}
          {wires.map((wire) => (
            <g key={wire.d}>
              <path
                className="m-x-hair m-k-draw"
                style={at(wire.t)}
                pathLength={1}
                d={wire.d}
              />
              <circle
                className="m-x-run"
                style={{ ...at(wire.t), '--fx': `${-wire.len}px` } as Vars}
                cx={wire.x}
                cy="86"
                r="2.6"
              />
            </g>
          ))}
          {/* 研究判断：一页笔记，划出一行重点，盖一个勾 */}
          <g className="m-k-rise" style={at(0.8)}>
            <rect
              className="m-x-card"
              x="114"
              y="48"
              width="54"
              height="76"
              rx="4"
              filter={shadow}
            />
          </g>
          <path className="m-x-ink m-k-fade" style={at(0.9)} d="M121 61 H147" />
          <rect
            className="m-x-mark m-x-sweep"
            style={at(1.1)}
            x="118"
            y="89"
            width="46"
            height="10"
            rx="2"
          />
          {[74, 84, 94, 104, 114].map((y, index) => (
            <path
              key={y}
              className="m-x-line m-k-fade"
              style={at(0.95 + index * 0.05)}
              d={`M122 ${y} H${[160, 152, 160, 148, 156][index]}`}
            />
          ))}
          <g className="m-k-pop" style={at(1.4)}>
            <circle className="m-x-badge" cx="165" cy="50" r="8" />
            <path className="m-x-tick" d="M161.4 50 l2.5 2.6 l4.6 -5" />
          </g>
          {/* 讨论与创作：一页底稿一行行写出来，旁边一个说话的气泡 */}
          <g className="m-k-rise" style={at(1.55)}>
            <rect
              className="m-x-card"
              x="202"
              y="46"
              width="56"
              height="80"
              rx="4"
              filter={shadow}
            />
          </g>
          <path
            className="m-x-ink m-k-fade"
            style={at(1.65)}
            d="M209 59 H232"
          />
          {[40, 36, 41, 30, 35].map((width, index) => (
            <rect
              key={index}
              className="m-x-typed m-k-type"
              style={at(1.75 + index * 0.08)}
              x="209"
              y={68 + index * 10}
              width={width}
              height="3.6"
              rx="1.8"
            />
          ))}
          <g className="m-k-pop" style={at(1.7)}>
            <path
              className="m-x-card"
              d="M248 28 h16 a10 10 0 0 1 0 20 h-12 l-6 5 v-5.4 a10 10 0 0 1 2 -19.6 z"
              filter={shadow}
            />
            {[249, 256, 263].map((cx, index) => (
              <circle
                key={cx}
                className="m-x-blink"
                style={at(1.85 + index * 0.15)}
                cx={cx}
                cy="38"
                r="1.9"
              />
            ))}
          </g>
          {/* 平台稿件：从一叠里散开成几种不同形状的稿 */}
          {drafts.map((draft, index) => (
            <g key={index} className="m-x-place m-x-gather" style={draft.style}>
              <rect
                className="m-x-card"
                width={draft.w}
                height={draft.h}
                rx="3"
                filter={shadow}
              />
              <rect
                className="m-x-tag"
                x="4"
                y="4"
                width="9"
                height="3"
                rx="1.5"
              />
              <path
                className="m-x-thin"
                d={`M4 12 H${draft.w - 6} M4 18 H${draft.w - 10}`}
              />
            </g>
          ))}
          {labels.map(([x, word, t]) => (
            <text
              key={word}
              className="m-x-text m-k-fade"
              style={at(t)}
              x={x}
              y="160"
              textAnchor="middle"
            >
              {word}
            </text>
          ))}
        </>
      )}
    </Art>
  );
}

/** Evrik：Agent 拿着目标，读当前情况，在权限和业务规则里调用软件能力 */
function Evrik({ w }: { w: string[] }) {
  return (
    <Art>
      {(shadow) => (
        <>
          {/* 软件窗口 */}
          <g className="m-k-rise" style={at(0)}>
            <rect
              className="m-x-card"
              x="146"
              y="32"
              width="188"
              height="116"
              rx="7"
              filter={shadow}
            />
            <path className="m-x-hair" d="M146 46 H334" />
            {[155, 162, 169].map((cx) => (
              <circle key={cx} className="m-x-light" cx={cx} cy="39" r="2" />
            ))}
            <text className="m-x-text" data-ink="" x="158" y="64">
              {w[1]}
            </text>
            {[158, 215, 272].map((x, index) => (
              <g key={x}>
                <rect
                  className="m-x-slot"
                  x={x}
                  y="72"
                  width="50"
                  height="12"
                  rx="3"
                />
                <rect
                  className="m-x-read m-x-sweep"
                  style={at(1.3 + index * 0.12)}
                  x={x}
                  y="72"
                  width="50"
                  height="12"
                  rx="3"
                />
              </g>
            ))}
            <text className="m-x-text" data-ink="" x="158" y="105">
              {w[2]}
            </text>
            {[158, 272].map((x) => (
              <rect
                key={x}
                className="m-x-btn"
                x={x}
                y="113"
                width="50"
                height="22"
                rx="7"
              />
            ))}
          </g>
          <circle
            className="m-x-ripple"
            style={at(2.15)}
            cx="240"
            cy="124"
            r="18"
          />
          <g className="m-k-press" style={at(2.15)}>
            <rect
              className="m-x-btn m-k-node"
              style={at(2.15)}
              x="215"
              y="113"
              width="50"
              height="22"
              rx="7"
            />
          </g>
          <path
            className="m-x-tick-light m-k-draw"
            style={at(2.35)}
            pathLength={1}
            d="M234.5 124 l3.4 3.4 l7 -7.4"
          />
          {/* 权限和业务规则：一圈虚线，Agent 的调用从这里穿过时亮一下 */}
          <rect
            className="m-x-fence m-k-fade"
            style={at(0.2)}
            x="128"
            y="16"
            width="222"
            height="148"
            rx="10"
          />
          <rect
            className="m-x-fence-hot"
            style={at(1.9)}
            x="128"
            y="16"
            width="222"
            height="148"
            rx="10"
          />
          <g className="m-k-fade" style={at(0.35)}>
            <rect className="m-x-knock" x="139" y="9" width="98" height="14" />
            <path
              className="m-x-lock"
              d="M146 15.5 v-2.6 a3 3 0 0 1 6 0 v2.6 M144.5 15.5 h9 v6 h-9 z"
            />
            <text className="m-x-text" data-accent="" x="158" y="20.5">
              {w[3]}
            </text>
          </g>
          {/* 目标 → Agent */}
          <g className="m-k-pop" style={at(0.45)}>
            <rect
              className="m-x-card"
              x="32"
              y="122"
              width="52"
              height="22"
              rx="11"
              filter={shadow}
            />
            <path
              className="m-x-accent"
              d="M43 127.5 v11 M43 128 h7.5 l-2 2.8 l2 2.8 h-7.5"
            />
            <text
              className="m-x-text"
              data-ink=""
              x="65"
              y="137"
              textAnchor="middle"
            >
              {w[0]}
            </text>
          </g>
          <path
            className="m-x-hair m-k-draw"
            style={at(0.6)}
            pathLength={1}
            d="M58 122 V104"
          />
          <g className="m-k-pop" style={at(0.75)}>
            <circle className="m-x-agent" cx="58" cy="78" r="25" />
            <text
              className="m-x-text"
              data-light=""
              x="58"
              y="82"
              textAnchor="middle"
              lang="en"
            >
              Agent
            </text>
          </g>
          {/* 读当前情况 */}
          <path
            className="m-x-beam m-k-draw"
            style={at(1)}
            pathLength={1}
            d="M83 70 C108 58 132 62 156 76"
          />
          {/* 调用一项软件能力 */}
          <path
            className="m-x-call m-k-draw"
            style={at(1.6)}
            pathLength={1}
            d="M80 94 C102 152 198 162 240 135"
          />
        </>
      )}
    </Art>
  );
}

/** Aether：指标、业务知识、分析过程汇进一份报告，依据可以回查 */
function Aether({ w }: { w: string[] }) {
  const ys = [22, 70, 118];
  const icons = [
    // 指标：一条小折线
    <path key="a" className="m-x-accent" d="M80 42 l5 -5 l4 3 l7 -8" />,
    // 业务知识：一本打开的书
    <path
      key="b"
      className="m-x-icon"
      d="M80 80 h6 a2.5 2.5 0 0 1 2.5 2.5 v9 a2.5 2.5 0 0 0 -2.5 -2.5 h-6 z M88.5 82.5 a2.5 2.5 0 0 1 2.5 -2.5 h6 v9 h-6 a2.5 2.5 0 0 0 -2.5 2.5"
    />,
    // 分析过程：几步连成一串
    <g key="c">
      <path className="m-x-icon" d="M81 133 H96" />
      {[81, 88.5, 96].map((cx) => (
        <circle key={cx} className="m-x-step" cx={cx} cy="133" r="2.2" />
      ))}
    </g>,
  ];
  return (
    <Art>
      {(shadow) => (
        <>
          {ys.map((y, index) => (
            <g key={y} className="m-k-rise" style={at(index * 0.08)}>
              <rect
                className="m-x-card"
                x="12"
                y={y}
                width="94"
                height="30"
                rx="7"
                filter={shadow}
              />
              <text className="m-x-text" data-ink="" x="23" y={y + 19}>
                {w[index]}
              </text>
              {icons[index]}
            </g>
          ))}
          {[
            'M106 37 C148 37 148 85 186 85',
            'M106 85 H186',
            'M106 133 C148 133 148 85 186 85',
          ].map((d, index) => (
            <path
              key={d}
              className="m-x-hair m-k-draw"
              style={at(0.4 + index * 0.1)}
              pathLength={1}
              d={d}
            />
          ))}
          {/* 报告 */}
          <g className="m-k-rise" style={at(0.7)}>
            <rect
              className="m-x-report"
              x="190"
              y="14"
              width="158"
              height="146"
              rx="8"
              filter={shadow}
            />
            <text className="m-x-text" data-strong="" x="204" y="37">
              {w[3]}
            </text>
            <path className="m-x-hair" d="M204 90 H268" />
          </g>
          <circle
            className="m-x-dot m-k-pop"
            style={at(0.95)}
            cx="190"
            cy="85"
            r="3.2"
          />
          {[16, 26, 20, 34, 28].map((h, index) => (
            <rect
              key={index}
              className="m-x-bar m-x-grow"
              data-hot={index === 4 || undefined}
              style={at(1.05 + index * 0.07)}
              x={206 + index * 12}
              y={90 - h}
              width="7"
              height={h}
              rx="1.5"
            />
          ))}
          {[126, 102].map((width, index) => (
            <rect
              key={width}
              className="m-x-typed m-k-type"
              style={at(1.45 + index * 0.1)}
              x="204"
              y={102 + index * 10}
              width={width}
              height="3.6"
              rx="1.8"
            />
          ))}
          <g className="m-k-fade" style={at(1.7)}>
            <text className="m-x-text" data-accent="" x="204" y="139">
              {w[4]}
            </text>
            <path className="m-x-cite" d="M204 144 H270" />
          </g>
          {/* 依据回查：从报告上的那一行沿虚线回到分析过程 */}
          <path
            className="m-x-back m-k-draw"
            style={at(1.9)}
            pathLength={1}
            d="M206 150 C184 174 132 174 109 142"
          />
          <path
            className="m-x-accent m-k-fade"
            style={at(2.5)}
            d="M108.5 149 L108 141.5 L115 144.5"
          />
          <rect
            className="m-x-glow m-k-pop"
            style={at(2.55)}
            x="8.5"
            y="114.5"
            width="101"
            height="37"
            rx="9.5"
          />
        </>
      )}
    </Art>
  );
}

function Sketch({ row }: { row: Exploration }) {
  if (row.name === 'CGS') return <Cgs w={row.words} />;
  if (row.name === 'Evrik') return <Evrik w={row.words} />;
  return <Aether w={row.words} />;
}

export function Explore({ lean = false }: { lean?: boolean }) {
  const list = useRef<HTMLUListElement>(null);

  // 卡进入视口时，各自的示意画一遍（只一次）；减少动态时直接是画好的样子
  useEffect(() => {
    const node = list.current;
    if (!node) return;
    const arts = [...node.querySelectorAll('.m-lab-art')];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (const art of arts) art.setAttribute('data-play', '');
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          play(entry.target);
        }
      },
      { threshold: 0.5 },
    );
    for (const art of arts) observer.observe(art);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="m-ent-explore m-wrap"
      id="explore"
      aria-labelledby="ent-explore-title"
    >
      <header className="m-ent-explore-head" data-reveal>
        {/* 样张（D1，lean）：页脚的章已写「内部探索」，眉题不再重复 */}
        {lean ? null : <p className="m-kicker">{explore.kicker}</p>}
        <h2 className="m-ent-explore-title" id="ent-explore-title">
          <Phrases text={explore.title} />
        </h2>
        <p className="m-ent-explore-plugin">
          <span className="m-ent-plug" aria-hidden="true" />
          {explore.plugin}
        </p>
      </header>
      <ul className="m-ent-labs" ref={list}>
        {explore.rows.map((row, index) => (
          <li
            key={row.name}
            className="m-ent-lab"
            data-reveal
            style={{ '--delay': `${index * 90}ms` } as Vars}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'mouse') return;
              const art = event.currentTarget.querySelector('.m-lab-art');
              // 还没进视口画过的，交给进入视口那一遍
              if (art?.hasAttribute('data-play')) play(art);
            }}
          >
            <div className="m-ent-lab-top">
              <span className="m-ent-lab-icon" aria-hidden="true" lang="en">
                {row.name[0]}
              </span>
              <h3 className="m-ent-lab-name" lang="en">
                {row.name}
              </h3>
              <Status>{row.stage}</Status>
            </div>
            <p className="m-ent-lab-q">
              <span className="sr-only">{explore.asks}：</span>
              {row.question}
            </p>
            {/* 宽屏上「已有 / 还没有」压在示意上，停到卡上、示意重画完才浮出来；窄屏和触屏直接排在示意下面 */}
            <div className="m-ent-lab-stage">
              <figure className="m-ent-lab-figure">
                <Sketch row={row} />
                <figcaption>
                  <Note>{explore.sketch}</Note>
                </figcaption>
              </figure>
              <dl className="m-ent-hn">
                <div data-kind="have">
                  <dt>{explore.have}</dt>
                  {row.have.map((text, at) => (
                    <dd key={text} style={{ '--i': at } as Vars}>
                      {text}
                    </dd>
                  ))}
                </div>
                <div data-kind="not">
                  <dt>{row.notYetLabel}</dt>
                  {row.notYet.map((text, at) => (
                    <dd
                      key={text}
                      style={{ '--i': row.have.length + at } as Vars}
                    >
                      {text}
                    </dd>
                  ))}
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ul>
      <p className="m-ent-explore-foot">
        <span className="m-ent-stamp">{explore.tag}</span>
        {explore.caveat}
      </p>
    </section>
  );
}
