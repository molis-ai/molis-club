'use client';
import { ArrowUpRight, Languages, Lightbulb, NotebookPen } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { demo } from '../../../../../content/molis-tool';
import { DemoReset, DemoToggle, Pointer, on, useTimeline } from './demo';

// 首屏的界面示意：选中一句英文 → 选区末端冒出三个动作 → 点「翻译」→ 结果就在选区下面展开，带着出处。
// 自动播放时有一枚示意指针；访客点句子、点「翻译」就接手，指针退场，换成访客自己的光标。
// 本例只有「翻译」的结果（content/molis-tool.ts 的 demo），所以只有它能点；另外两个动作只作展示。

// 0 未选 → 1 划选 → 2 动作出现 → 3 按下翻译 → 4 结果 → 5 收起
const STEPS = [900, 1100, 1000, 450, 3800, 600] as const;
const HOLDS = [0, 2, 4] as const;
const icons = [Languages, Lightbulb, NotebookPen];

type Geo = {
  start: [number, number];
  end: [number, number];
  chip: [number, number];
  pop: [number, number];
  card: { left: number; top: number; width: number };
  height: number;
};

/** 下面三步小图例：现在走到哪一步 */
const legendState = (index: number, step: number) => {
  const phase =
    step === 4 ? 2 : step === 2 || step === 3 ? 1 : step === 1 ? 0 : -1;
  if (phase < 0) return 'idle';
  return index === phase ? 'now' : index < phase ? 'done' : 'idle';
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export function SelectDemo() {
  const [figure, t] = useTimeline<HTMLElement>({
    durations: STEPS,
    holds: HOLDS,
    final: 4,
    start: 0,
  });
  const page = useRef<HTMLDivElement>(null);
  const startMark = useRef<HTMLSpanElement>(null);
  const endMark = useRef<HTMLSpanElement>(null);
  const chips = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);

  // 量出选区两端、动作条和结果卡的位置；字体加载完、窗口变宽变窄时重量
  useEffect(() => {
    const root = page.current;
    if (!root) return;
    const measure = () => {
      const s = startMark.current;
      const e = endMark.current;
      const c = chips.current;
      const f = first.current;
      const k = card.current;
      if (!s || !e || !c || !f || !k) return;
      const box = root.getBoundingClientRect();
      const sr = s.getBoundingClientRect();
      const er = e.getBoundingClientRect();
      const cr = c.getBoundingClientRect();
      const fr = f.getBoundingClientRect();
      const gap = 14;
      const width = box.width;
      const popLeft = clamp(
        er.left - box.left - 12,
        gap,
        width - cr.width - gap,
      );
      const popTop = er.bottom - box.top + 10;
      const cardWidth = Math.min(340, width - gap * 2);
      const cardLeft = clamp(popLeft, gap, width - cardWidth - gap) - popLeft;
      const cardTop = cr.height + 10;
      setGeo({
        start: [sr.left - box.left - 3, sr.top - box.top + sr.height * 0.55],
        end: [er.left - box.left, er.top - box.top + er.height * 0.55],
        chip: [
          popLeft + fr.left - cr.left + fr.width * 0.6,
          popTop + fr.top - cr.top + fr.height * 0.62,
        ],
        pop: [popLeft, popTop],
        card: { left: cardLeft, top: cardTop, width: cardWidth },
        height: popTop + cardTop + k.offsetHeight + gap + 4,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    void document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  const { step, mode } = t;
  const selected = on(step, 1, 4);
  const chipsOn = on(step, 2, 4);
  const pressed = on(step, 3, 4);
  const result = step === 4;
  const auto = mode === 'auto' && !t.reduce;

  const pointerAt = step >= 3 ? geo?.chip : step >= 1 ? geo?.end : geo?.start;
  const pointerOn = auto && geo !== null && step <= 4;

  const toggleSelect = () => t.go(step >= 1 && step <= 4 ? 0 : 2);
  // 点页面空白处：选区和动作一起收起（做完就消失）
  const clear = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    if (step !== 0) t.go(0);
  };

  return (
    <figure
      ref={figure}
      className="et-select"
      aria-label={demo.label}
      data-mode={mode}
      data-step={step}
    >
      <div className="et-select-stage">
        <div className="et-window">
          <div className="et-window-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>{demo.url}</span>
          </div>
          {/* 点空白处收起选区是鼠标的便利；键盘可以再按一次句子取消选中 */}
          {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            ref={page}
            className="et-page"
            style={geo ? { minHeight: geo.height } : undefined}
            data-ready={geo !== null}
            onClick={clear}
          >
            <p className="et-page-title" lang="en">
              {demo.heading}
            </p>
            <p className="et-page-text" lang="en">
              {demo.before}
              <button
                type="button"
                className="et-sel"
                data-on={selected}
                aria-pressed={selected}
                onClick={toggleSelect}
              >
                <span
                  ref={startMark}
                  className="et-anchor"
                  aria-hidden="true"
                />
                {demo.selection}
                <span ref={endMark} className="et-anchor" aria-hidden="true" />
              </button>
              {demo.after}
            </p>
            <span className="et-ghost" aria-hidden="true" />
            <span className="et-ghost" aria-hidden="true" />
            <span className="et-ghost et-ghost-short" aria-hidden="true" />

            <div
              className="et-pop"
              style={geo ? { left: geo.pop[0], top: geo.pop[1] } : undefined}
            >
              <div
                ref={chips}
                className="et-chips"
                data-on={chipsOn}
                aria-hidden={!chipsOn}
              >
                {demo.actions.map((action, index) => {
                  const Icon = icons[index];
                  return index === 0 ? (
                    <button
                      key={action}
                      ref={first}
                      type="button"
                      className="et-chip"
                      data-pressed={pressed}
                      tabIndex={chipsOn ? 0 : -1}
                      onClick={() => t.go(4)}
                    >
                      <Icon size={14} aria-hidden="true" />
                      {action}
                    </button>
                  ) : (
                    <span key={action} className="et-chip" data-static>
                      <Icon size={14} aria-hidden="true" />
                      {action}
                    </span>
                  );
                })}
              </div>
              <div
                ref={card}
                className="et-card"
                data-on={result}
                aria-hidden={!result}
                style={
                  geo
                    ? {
                        left: geo.card.left,
                        top: geo.card.top,
                        width: geo.card.width,
                      }
                    : undefined
                }
              >
                <small>{demo.result.label}</small>
                <p>{demo.result.text}</p>
                <span lang="en">
                  <ArrowUpRight size={12} aria-hidden="true" />
                  {demo.result.source}
                </span>
              </div>
            </div>

            <span
              className="et-hero-pointer"
              data-on={pointerOn}
              data-step={step}
              style={
                pointerAt
                  ? {
                      transform: `translate(${pointerAt[0].toFixed(1)}px, ${pointerAt[1].toFixed(1)}px)`,
                    }
                  : undefined
              }
            >
              <Pointer className={pressed && step === 3 ? 'is-down' : ''} />
            </span>
          </div>
        </div>

        <div className="et-select-foot">
          <ol className="et-legend" aria-hidden="true">
            {(['选中', '动作', '结果'] as const).map((label, index) => (
              <li key={label} data-state={legendState(index, step)}>
                <i>0{index + 1}</i>
                {label}
              </li>
            ))}
          </ol>
          <div className="et-ctls">
            {mode === 'manual' && step !== 0 ? (
              <DemoReset onReset={() => t.go(0)} />
            ) : null}
            <DemoToggle timeline={t} />
          </div>
        </div>
      </div>
      <figcaption className="et-figcap">
        <span>
          <b lang="en">Fig. 01</b>选中一句，光标旁给出动作 · 点句子可以自己试
        </span>
        <em>{demo.note}</em>
      </figcaption>
    </figure>
  );
}
