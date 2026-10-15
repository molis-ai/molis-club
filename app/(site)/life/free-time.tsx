'use client';
import { Waves } from 'lucide-react';
import { useState } from 'react';
import { freeTime } from '../../../content/site/life';

// Life 页的标志性交互：拨动「这周空出多少时间」。两小时给近一点、半天给多走一段，
// 每次都附「为什么此刻想到」；去不去由访客点。地点、天气、路程都是示意。
// 原生的 range 滑杆：键盘方向键可用；没有 JS 时停在「半天」那一档的结果上。

export function FreeTime() {
  const [index, setIndex] = useState(3);
  const [answer, setAnswer] = useState<'go' | 'later' | null>(null);
  const plan = freeTime.plans[index];
  return (
    <div className="lf-free">
      <p className="lf-free-wish">{freeTime.wish}</p>
      <div className="lf-free-control">
        <label htmlFor="lf-free-range">{freeTime.label}</label>
        <input
          id="lf-free-range"
          type="range"
          min={0}
          max={freeTime.marks.length - 1}
          step={1}
          value={index}
          aria-valuetext={freeTime.marks[index]}
          onChange={(event) => {
            setIndex(Number(event.target.value));
            setAnswer(null);
          }}
        />
        <ol className="lf-free-marks" aria-hidden="true">
          {freeTime.marks.map((mark, i) => (
            <li key={mark} data-on={i === index || undefined}>
              {mark}
            </li>
          ))}
        </ol>
      </div>
      <div className="lf-free-plan" aria-live="polite" key={index}>
        <p className="lf-free-title">
          <Waves aria-hidden="true" />
          {plan.title}
        </p>
        <p>{plan.text}</p>
        {plan.why ? (
          <p className="lf-free-why">
            <b>{freeTime.why}</b>
            {plan.why}
          </p>
        ) : null}
        {plan.why ? (
          <div className="lf-free-answer">
            <button
              type="button"
              className="m-btn"
              aria-pressed={answer === 'go'}
              onClick={() => setAnswer('go')}
            >
              {freeTime.go}
            </button>
            <button
              type="button"
              className="m-btn m-btn-line"
              aria-pressed={answer === 'later'}
              onClick={() => setAnswer('later')}
            >
              {freeTime.later}
            </button>
          </div>
        ) : null}
        <output className="lf-free-out">
          {answer === 'go'
            ? freeTime.went
            : answer === 'later'
              ? freeTime.kept
              : ''}
        </output>
      </div>
    </div>
  );
}
