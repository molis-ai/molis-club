'use client';
import { Check, Pause, Play, Sparkles, Target } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { desk } from '../../../../../content/folio-work';
import { pad } from '../routes';
import { Plate, type Vars } from '../shell';
import './desk.css';

// Work 首屏的界面示意：你在 Pages 里写下一句 → Inbox 亮起 3 → 助理在旁边递上一张操作卡 →
// 点「执行」→ 三条反馈带着出处进到文里，待办多了 2 个，卡片收成「已整理 · 撤销」。没有聊天框。
// 五步由 JS 推进：进入视口才播，离开视口或切到后台就停，可以暂停，也可以点某一步停在那里看。
// 减少动态时不自动播放，直接停在最后一步（播完的样子）。

const steps = [
  { label: `在 ${desk.plugin} 写下「${desk.heading}」`, ms: 2800 },
  { label: `Inbox 亮起 ${desk.inserted.length}`, ms: 1500 },
  { label: `${desk.card.who}递来一张卡`, ms: 2700 },
  { label: `点一下「${desk.card.run}」`, ms: 1300 },
  { label: '三条反馈带着出处进来，多了 2 个待办', ms: 4300 },
];
const last = steps.length - 1;

const noop = () => () => {};
const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(callback: () => void) {
  const media = matchMedia(motionQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

/** 减少动态的偏好；服务端当作不减少 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => matchMedia(motionQuery).matches,
    () => false,
  );
}

function useDeskTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  /** 当前这一步还剩多少毫秒；暂停后接着剩下的走，进度条与它同步 */
  const left = useRef(steps[0].ms);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    const sync = () => setHidden(document.hidden);
    observer.observe(node);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  const running = mounted && !reduced && inView && !hidden && !paused;

  useEffect(() => {
    if (!running) return;
    const started = performance.now();
    let fired = false;
    const timer = window.setTimeout(() => {
      fired = true;
      const next = (step + 1) % steps.length;
      left.current = steps[next].ms;
      setStep(next);
    }, left.current);
    return () => {
      window.clearTimeout(timer);
      if (!fired)
        left.current = Math.max(
          0,
          left.current - (performance.now() - started),
        );
    };
  }, [running, step]);

  /** 点某一步：停在那一步看，再按播放从这一步接着走 */
  const go = (index: number) => {
    left.current = steps[index].ms;
    setStep(index);
    setTouched(true);
    setPaused(true);
  };

  const shown = reduced && !touched ? last : step;
  return {
    ref,
    mounted,
    reduced,
    running,
    paused,
    shown,
    go,
    toggle: () => setPaused((value) => !value),
  };
}

export function WorkDesk() {
  const { ref, mounted, reduced, running, paused, shown, go, toggle } =
    useDeskTimeline();
  return (
    <div
      ref={ref}
      className="ew-desk"
      data-ready={mounted}
      data-running={running}
    >
      <Plate
        fig="Fig. 01"
        caption={`${desk.plugin} · ${desk.assistant}`}
        note={desk.note}
        label={desk.label}
      >
        <div
          className="ew-win"
          aria-hidden="true"
          data-typing={shown === 0}
          data-inbox={shown >= 1 && shown <= 3}
          data-card={shown >= 2}
          data-press={shown === 3}
          data-done={shown === last}
        >
          <header className="ew-win-bar">
            <span className="ew-win-project">
              <i />
              {desk.project}
            </span>
            <span className="ew-win-goal">
              <Target size={12} />
              {desk.goal}
            </span>
          </header>
          <div className="ew-win-body">
            <div className="ew-doc">
              <small lang="en">{desk.plugin}</small>
              <strong>{desk.heading}</strong>
              <p
                className="ew-typed"
                style={{ '--n': Array.from(desk.typed).length } as Vars}
              >
                <span>{desk.typed}</span>
                <i className="ew-caret" />
              </p>
              <ul className="ew-insert">
                {desk.inserted.map((line, index) => (
                  <li key={line} style={{ '--i': index } as Vars}>
                    <span>“{line}”</span>
                    <em lang="en">{desk.source}</em>
                  </li>
                ))}
              </ul>
              <span className="ew-ph" />
              <span className="ew-ph ew-ph-short" />
            </div>
            <div className="ew-card">
              <div className="ew-card-head">
                <Sparkles size={13} />
                <strong>{desk.card.who}</strong>
                <span>{desk.card.context}</span>
              </div>
              <div className="ew-card-swap">
                <div className="ew-card-ask">
                  <p>{desk.card.text}</p>
                  <div className="ew-card-actions">
                    <span className="ew-run">
                      {desk.card.run}
                      <svg className="ew-pointer" viewBox="0 0 40 46">
                        <path d="M8 2 L8 34 L16 26 L22 42 L28 40 L22 24 L34 24 Z" />
                      </svg>
                    </span>
                    <span className="ew-skip">{desk.card.skip}</span>
                  </div>
                </div>
                <div className="ew-card-done">
                  <span>
                    <Check size={14} strokeWidth={2.5} />
                    {desk.card.done}
                  </span>
                  <u>{desk.card.undo}</u>
                </div>
              </div>
            </div>
          </div>
          <footer className="ew-dock">
            {desk.dock.map((name) => (
              <span
                key={name}
                className="ew-chip"
                data-active={name === desk.plugin || undefined}
              >
                {name}
                {name === 'Inbox' ? (
                  <b className="ew-badge ew-badge-inbox">3</b>
                ) : null}
                {name === '待办' ? (
                  <b className="ew-badge ew-badge-todo">+2</b>
                ) : null}
              </span>
            ))}
            <span className="ew-chip ew-chip-ai">
              <Sparkles size={12} />
              {desk.assistant}
            </span>
          </footer>
        </div>

        <div className="ew-desk-controls">
          <ol className="ew-desk-steps" aria-label="演示步骤">
            {steps.map((item, index) => (
              <li key={item.label}>
                <button
                  type="button"
                  aria-label={`${pad(index)} ${item.label}`}
                  aria-current={index === shown ? 'step' : undefined}
                  data-done={index < shown || undefined}
                  onClick={() => go(index)}
                >
                  <span className="ew-desk-bar" aria-hidden="true">
                    {index === shown ? (
                      <i style={{ '--ms': `${item.ms}ms` } as Vars} />
                    ) : null}
                  </span>
                  <span className="ew-desk-no" aria-hidden="true">
                    {pad(index)}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          {reduced ? null : (
            <button
              type="button"
              className="ew-desk-toggle"
              aria-pressed={paused}
              aria-label={paused ? '继续播放演示' : '暂停演示'}
              onClick={toggle}
            >
              {paused ? (
                <Play size={12} fill="currentColor" aria-hidden="true" />
              ) : (
                <Pause size={12} fill="currentColor" aria-hidden="true" />
              )}
            </button>
          )}
          <p className="ew-desk-now" aria-hidden="true">
            <i>{pad(shown)}</i>
            {steps[shown].label}
          </p>
        </div>
      </Plate>
    </div>
  );
}
