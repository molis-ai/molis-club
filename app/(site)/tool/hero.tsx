'use client';
import { CalendarDays, Check, Eraser, Hash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { paper } from '../../../content/site/tool';
import { Note, Window } from '../../_site/ui';
import { selectNode } from './selection';

// 首屏右边：白墙天光的窗，窗角压着一张可以选中的纸。
// 进页 2.2 秒没人动，由一枚示意光标演一遍：划过时间地点 → 光标旁出现动作条 → 旁边出现日程草稿 → 一起退下，提示换成「换你来」。
// 访客一动（按下、选中、按键）就不再演。减少动态：停在草稿出现的那一帧，直到访客自己选中。没有 JS：只有纸和窗。

type Phase = 'wait' | 'select' | 'bar' | 'draft' | 'leave' | 'off';

const TIMELINE: [Phase, number][] = [
  ['select', 2200],
  ['bar', 1100],
  ['draft', 900],
  ['leave', 2800],
  ['off', 700],
];

const DONE = 'tl-demo-done';

export function PaperByWindow() {
  const [phase, setPhase] = useState<Phase>('wait');
  const stopped = useRef(false);

  useEffect(() => {
    const timers: number[] = [];
    const stop = () => {
      if (stopped.current) return;
      stopped.current = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      setPhase('off');
      document.dispatchEvent(new Event(DONE));
    };
    const onSelection = () => {
      if ((document.getSelection()?.toString().trim().length ?? 0) > 1) stop();
    };
    document.addEventListener('pointerdown', stop, { once: true });
    document.addEventListener('keydown', stop, { once: true });
    document.addEventListener('selectionchange', onSelection);

    // 减少动态：直接停在草稿出现的那一帧
    if (matchMedia('(prefers-reduced-motion: reduce)').matches)
      timers.push(window.setTimeout(() => setPhase('draft'), 0));
    else if (!document.hidden) {
      let at = 0;
      for (const [next, wait] of TIMELINE) {
        at += wait;
        timers.push(
          window.setTimeout(() => {
            if (next === 'off') stop();
            else setPhase(next);
          }, at),
        );
      }
    }
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      document.removeEventListener('pointerdown', stop);
      document.removeEventListener('keydown', stop);
      document.removeEventListener('selectionchange', onSelection);
    };
  }, []);

  return (
    <div className="tl-hero-visual m-rise" data-demo={phase}>
      <Window
        className="tl-hero-window"
        name="tool-light"
        alt="白墙上落着一道天光。"
        ratio="4 / 5"
        focus="58% 50%"
        caption="A beam of light on a white wall"
        sizes="(max-width: 900px) 100vw, 36vw"
        eager
      />
      <div className="tl-paper">
        <p className="tl-paper-head">
          <b>{paper.title}</b>
          <Note>{paper.note}</Note>
        </p>
        <p className="tl-paper-when" id="tl-paper-when">
          <span className="tl-paper-hl">{paper.when}</span>
          <span className="tl-ghost" aria-hidden="true">
            <svg viewBox="0 0 16 20" width="16" height="20">
              <path
                d="M1.5 1.5v14.2l3.9-3.6 2.6 6 2.4-1-2.6-5.9h5.3z"
                fill="#fff"
                stroke="#1b1a18"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            <span className="tl-mini">
              <span data-on="">
                <CalendarDays />
                整理成日程
                <small>AI</small>
              </span>
              <span>
                <Eraser />
                清理格式
              </span>
              <span>
                <Hash />
                数一数
              </span>
            </span>
          </span>
        </p>
        <p className="tl-paper-place">{paper.place}</p>
        <p lang="en" className="tl-paper-en">
          {paper.english}
        </p>
        <p className="tl-paper-price">{paper.prices}</p>
      </div>
      <div className="tl-draft" aria-hidden="true">
        <p className="tl-draft-head">
          <CalendarDays />
          {paper.draft.head}
          <span className="tl-tag">{paper.draft.tag}</span>
        </p>
        <dl>
          {paper.draft.rows.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="tl-draft-foot">
          <span className="tl-draft-add">
            <Check />
            {paper.draft.add}
          </span>
          <span>{paper.draft.confirm}</span>
        </p>
        <p className="tl-draft-note">{paper.draft.note}</p>
      </div>
      <p className="sr-only">{paper.label}</p>
    </div>
  );
}

/** 首屏左下：一行提示 + 「选中时间这一行」（键盘、触屏都能用）；示意演完后提示换成「换你来」 */
export function TryHint() {
  const [turn, setTurn] = useState(false);
  useEffect(() => {
    const on = () => setTurn(true);
    document.addEventListener(DONE, on);
    return () => document.removeEventListener(DONE, on);
  }, []);
  return (
    <p className="tl-hint">
      <span>{turn ? paper.turn : paper.hint}</span>
      <button
        type="button"
        className="m-link"
        onClick={(event) =>
          selectNode(
            document.querySelector<HTMLElement>('.tl-paper-hl'),
            event.detail === 0,
          )
        }
      >
        {paper.pick}
      </button>
    </p>
  );
}
