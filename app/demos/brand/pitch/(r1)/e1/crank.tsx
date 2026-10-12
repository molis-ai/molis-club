'use client';
import { Check, Sparkles, Target } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { desk } from '../../../../../../content/folio-work';
import type { Vars } from '../../_kit/kit';

// E 的 Work：一扇手绘窗口，侧面有个摇柄。转一格，Work 往下走一步——
// 写下本周进展 → Inbox 亮起、助理递卡 → 点「执行」→ 三条反馈带着出处进来，多了 2 个待办。
// 没人碰时自己慢慢转；拖动、点按或方向键接管之后就不再自动。减少动态时停在最后一步。

const steps = [
  `在 ${desk.plugin} 写下「${desk.heading}」`,
  `Inbox 亮起 3，${desk.card.who}递来一张卡`,
  `点一下「${desk.card.run}」`,
  `三条反馈带着出处进来，多了 2 个待办`,
];

export function CrankWork() {
  const [step, setStep] = useState(0);
  const [angle, setAngle] = useState(0);
  const [touched, setTouched] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const crank = useRef<SVGSVGElement>(null);
  const drag = useRef<{ last: number; spin: number } | null>(null);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReduced(media.matches);
      if (media.matches) setStep(steps.length - 1);
    };
    sync();
    media.addEventListener('change', sync);
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      media.removeEventListener('change', sync);
      observer.disconnect();
    };
  }, []);

  // 没人碰的时候，摇柄自己慢慢转
  useEffect(() => {
    if (touched || reduced || !inView) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setStep((value) => (value + 1) % steps.length);
      setAngle((value) => value + 90);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [touched, reduced, inView]);

  const go = (delta: number) => {
    setTouched(true);
    setStep((value) => (value + delta + steps.length) % steps.length);
    setAngle((value) => value + delta * 90);
  };

  const center = () => {
    const rect = crank.current!.getBoundingClientRect();
    return { x: rect.left + rect.width * 0.32, y: rect.top + rect.height / 2 };
  };
  const onDown = (event: PointerEvent<SVGSVGElement>) => {
    const c = center();
    drag.current = {
      last: Math.atan2(event.clientY - c.y, event.clientX - c.x),
      spin: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    if (root.current) root.current.dataset.dragging = 'true';
    setTouched(true);
  };
  const onMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const c = center();
    const now = Math.atan2(event.clientY - c.y, event.clientX - c.x);
    let delta = now - drag.current.last;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    drag.current.last = now;
    drag.current.spin += (delta * 180) / Math.PI;
    setAngle((value) => value + (delta * 180) / Math.PI);
    if (Math.abs(drag.current.spin) >= 90) {
      const turn = Math.sign(drag.current.spin);
      drag.current.spin -= turn * 90;
      setStep((value) => (value + turn + steps.length) % steps.length);
    }
  };
  const onUp = () => {
    // 松手时摇柄落到最近的一格；几乎没转就当作点了一下
    if (drag.current && Math.abs(drag.current.spin) < 8) go(1);
    else setAngle((value) => Math.round(value / 90) * 90);
    drag.current = null;
    if (root.current) delete root.current.dataset.dragging;
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      go(1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      go(-1);
    }
  };

  return (
    <div
      className="re-crankwork"
      ref={root}
      data-step={step}
      data-touched={touched}
    >
      <div className="re-machine">
        <figure className="re-window" aria-label={desk.label}>
          <div className="re-window-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>Molis Work</span>
          </div>
          <div className="re-window-body" aria-hidden="true">
            <aside className="re-window-dock">
              {desk.dock.map((name) => (
                <span key={name} data-on={name === desk.plugin || undefined}>
                  {name}
                  {name === 'Inbox' ? (
                    <b className="re-badge-inbox">3</b>
                  ) : null}
                  {name === '待办' ? <b className="re-badge-todo">+2</b> : null}
                </span>
              ))}
            </aside>
            <div className="re-window-doc">
              <header>
                <span className="re-window-project">
                  <i />
                  {desk.project}
                </span>
                <span className="re-window-goal">
                  <Target size={11} />
                  {desk.goal}
                </span>
              </header>
              <small>{desk.plugin}</small>
              <h4>{desk.heading}</h4>
              <p
                className="re-window-typed"
                style={{ '--n': Array.from(desk.typed).length } as Vars}
              >
                <span>{desk.typed}</span>
              </p>
              <ul className="re-window-inserted">
                {desk.inserted.map((line, index) => (
                  <li key={line} style={{ '--k': index } as Vars}>
                    <span>“{line}”</span>
                    <em>{desk.source}</em>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="re-window-card" aria-hidden="true">
            <div className="re-window-card-head">
              <Sparkles size={12} />
              <strong>{desk.card.who}</strong>
              <span>{desk.card.context}</span>
            </div>
            <p>{desk.card.text}</p>
            <div className="re-window-card-foot">
              <span className="re-window-ask">
                <b>{desk.card.run}</b>
                <span>{desk.card.skip}</span>
              </span>
              <span className="re-window-done">
                <Check size={12} strokeWidth={3} />
                {desk.card.done}
                <u>{desk.card.undo}</u>
              </span>
            </div>
          </div>
          <figcaption>{desk.note}</figcaption>
        </figure>

        <button
          type="button"
          className="re-crank"
          aria-label={`转动摇柄，下一步。现在是第 ${step + 1} 步，共 ${steps.length} 步`}
          onKeyDown={onKey}
          onClick={(event) => {
            // 指针操作由下面的 SVG 处理；这里只接键盘的 Enter / 空格
            if (event.detail === 0) go(1);
          }}
        >
          <svg
            ref={crank}
            viewBox="0 0 150 120"
            aria-hidden="true"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <path className="re-crank-axle" d="M0 52 L36 52 L36 68 L0 68" />
            <circle className="re-crank-base" cx="48" cy="60" r="20" />
            <g
              className="re-crank-arm"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <path d="M48 60 L104 60" />
              <circle className="re-crank-knob" cx="110" cy="60" r="14" />
            </g>
            <circle className="re-crank-hub" cx="48" cy="60" r="6" />
          </svg>
        </button>
        <span className="re-crank-hint" aria-hidden="true">
          转一转
          <svg viewBox="0 0 60 40">
            <path d="M4 8 C20 2 40 6 50 26 M42 22 L50 28 L54 18" />
          </svg>
        </span>
      </div>

      <ol className="re-steps">
        {steps.map((text, index) => (
          <li key={text} data-on={index === step || undefined}>
            <button
              type="button"
              onClick={() => {
                setTouched(true);
                setAngle((value) => value + (index - step) * 90);
                setStep(index);
              }}
              aria-current={index === step ? 'step' : undefined}
            >
              <b>{index + 1}</b>
              {text}
            </button>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        {touched ? `第 ${step + 1} 步：${steps[step]}` : ''}
      </p>
    </div>
  );
}
