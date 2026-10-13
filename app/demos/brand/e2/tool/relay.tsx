'use client';
import { CalendarPlus, Check, Languages, Search } from 'lucide-react';
import { folioTool } from '../../../../../content/folio';
import { layers } from '../../../../../content/molis-tool';
import { pad } from '../routes';
import { DemoToggle, Pointer, on, useTimeline } from './demo';

// 02 由近到远的三层：同一场展览在三层里接力处理。上面一条标尺是「离光标的距离」，三个刻度可以点，
// 从那一层重新看；下面三格依次亮起：光标旁划出日期点「加入日程」→ 身旁框住海报、展开草稿逐项填好 →
// 离开以后按 ⌥Space 找回草稿、回到离开的地方。

// 0 静止 | 光标旁 1 划选 2 动作 3 按下 4 记下 | 身旁 5 框住 6 草稿 7 出处 | 离开以后 8 按键 9 搜索 10 找到 11 回去 | 12 收起
const STEPS = [
  700, 1000, 800, 450, 1500, 900, 1700, 1500, 800, 900, 800, 3200, 600,
] as const;
const HOLDS = [0, 4, 7, 11] as const;
const STARTS = [1, 5, 8];
const ENDS = [4, 7, 11];

export function LayerRelay() {
  const [ref, t] = useTimeline<HTMLElement>({
    durations: STEPS,
    holds: HOLDS,
    final: 11,
  });
  const { near, beside, later } = folioTool.layers;
  const s = t.step;
  const auto = t.mode === 'auto' && !t.reduce;
  const current = STARTS.findIndex(
    (from, index) => s >= from && s <= ENDS[index],
  );
  const panel = (index: number) => ({
    'data-active': current === index,
    'data-done': s > ENDS[index] && s < 12,
  });

  return (
    <figure
      ref={ref}
      className="etl"
      data-clear={s === 12}
      data-auto={auto}
      data-step={s}
      aria-label={folioTool.layers.label}
    >
      <div className="etl-rail">
        <ol>
          {layers.items.map((layer, index) => (
            <li key={layer.title} {...panel(index)}>
              <button
                type="button"
                aria-label={`从「${layer.title}」这一层开始演示`}
                onClick={() => t.go(STARTS[index])}
              >
                {pad(index)}
              </button>
            </li>
          ))}
        </ol>
        <DemoToggle timeline={t} />
      </div>

      <ol className="etl-row">
        <li className="etl-panel" {...panel(0)}>
          <div className="etl-screen" aria-hidden="true">
            <small className="etl-eyebrow">{near.eyebrow}</small>
            <p className="etl-text">
              {near.before}
              <mark data-on={on(s, 1)}>
                {near.mark}
                <Pointer className="etl-pointer-sel" />
              </mark>
              {near.after}
            </p>
            <p className="etl-chips" data-on={on(s, 2)}>
              <span data-pressed={on(s, 3)}>
                <CalendarPlus size={13} />
                {near.chips[0]}
                <Pointer className="etl-pointer-chip" />
              </span>
              <span>
                <Languages size={13} />
                {near.chips[1]}
              </span>
            </p>
            <p className="etl-done" data-on={on(s, 4)}>
              <Check size={14} strokeWidth={2.5} />
              {near.result}
              <u>{near.undo}</u>
            </p>
          </div>
          <Caption index={0} />
        </li>

        <li className="etl-panel" {...panel(1)}>
          <div className="etl-screen" aria-hidden="true">
            <small className="etl-eyebrow">{beside.eyebrow}</small>
            <div className="etl-beside">
              <div className="etl-poster">
                <span className="etl-sun" />
                <b lang="en">{beside.day}</b>
                <i lang="en">{beside.month}</i>
                <strong>
                  {beside.title[0]}
                  <br />
                  {beside.title[1]}
                </strong>
                <span className="etl-marquee" data-on={on(s, 5)}>
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="etl-card" data-on={on(s, 6)}>
                <em>
                  <CalendarPlus size={13} />
                  {beside.card}
                </em>
                <dl>
                  {beside.fields.map(([key, value], index) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>
                        <span
                          data-on={on(s, 6)}
                          style={{ transitionDelay: `${300 + index * 380}ms` }}
                        >
                          {value}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="etl-source" data-on={on(s, 7)}>
                  {beside.source}
                </p>
                <p className="etl-actions" data-on={on(s, 7)}>
                  <span>{beside.actions[0]}</span>
                  <span>{beside.actions[1]}</span>
                </p>
              </div>
            </div>
          </div>
          <Caption index={1} />
        </li>

        <li className="etl-panel" {...panel(2)}>
          <div className="etl-screen" aria-hidden="true">
            <small className="etl-eyebrow">{later.eyebrow}</small>
            <p className="etl-keys">
              {later.keys.map((key) => (
                <kbd key={key} data-on={s === 8}>
                  {key}
                </kbd>
              ))}
            </p>
            <div className="etl-bar" data-on={on(s, 9)}>
              <p className="etl-query">
                <Search size={14} />
                <span data-on={on(s, 9)}>{later.query}</span>
                <i className="etl-caret" />
              </p>
              <p className="etl-hit" data-on={on(s, 10)}>
                <CalendarPlus size={15} />
                <strong>{later.row}</strong>
                <small>{later.meta}</small>
              </p>
            </div>
            <p className="etl-done" data-on={on(s, 11)}>
              <Check size={14} strokeWidth={2.5} />
              {later.back}
            </p>
          </div>
          <Caption index={2} />
        </li>
      </ol>
      <figcaption className="et-figcap">
        <span>
          <b lang="en">Fig. 03</b>同一场展览在三层里接着处理 · 点刻度从那一层看
        </span>
        <em>{folioTool.layers.note}</em>
      </figcaption>
    </figure>
  );
}

function Caption({ index }: { index: number }) {
  const layer = layers.items[index];
  return (
    <div className="etl-caption">
      <i>{pad(index)}</i>
      <h3>{layer.title}</h3>
      <p>{layer.text}</p>
    </div>
  );
}
