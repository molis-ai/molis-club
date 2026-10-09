'use client';
import { ArrowDown } from 'lucide-react';
import { folioStudio } from '../../../../content/folio';
import { pad } from './kit';
import type { Vars } from './shared';

// 首屏之后的「怎么做到」：一天是一条剪好的纸带。滚动时，Work 收起交代、等待和核对，
// Tool 收起搬运和切换，省下的长度挪到末尾，分成生活与体验、创造。纸带长短只是示意。

type Kind = keyof typeof folioStudio.day.labels;

const segments: { kind: Kind; by?: 'work' | 'tool'; w: number }[] = [
  { kind: 'core', w: 2.3 },
  { kind: 'context', by: 'work', w: 1.5 },
  { kind: 'core', w: 1.3 },
  { kind: 'carry', by: 'tool', w: 1.5 },
  { kind: 'wait', by: 'work', w: 1.7 },
  { kind: 'switch', by: 'tool', w: 1.2 },
  { kind: 'core', w: 1.2 },
  { kind: 'check', by: 'work', w: 1.4 },
];

export function DayStory() {
  const { day } = folioStudio;
  return (
    <section
      id="how"
      className="fo-day"
      data-scene="pin"
      aria-labelledby="fo-day-title"
    >
      <div className="fo-day-stage">
        <header className="fo-day-head">
          <div>
            <span className="fo-kicker">{day.kicker}</span>
            <h2 id="fo-day-title">
              {day.title.map((line) => (
                <span className="fo-phrase" key={line}>
                  {line}
                </span>
              ))}
            </h2>
          </div>
          <p>{day.lead}</p>
        </header>

        <div className="fo-day-bar">
          <div className="fo-day-ends" aria-hidden="true">
            <span>一天开始</span>
            <span>一天结束</span>
          </div>
          <div className="fo-day-track" aria-hidden="true">
            {segments.map((segment, index) => (
              <span
                key={index}
                className="fo-seg"
                data-kind={segment.kind}
                data-by={segment.by}
                style={{ '--w': segment.w, '--i': index } as Vars}
              >
                <span>{day.labels[segment.kind]}</span>
              </span>
            ))}
            <span className="fo-seg fo-seg-own" data-kind="life">
              <span className="fo-seg-own-before">{day.labels.life}</span>
              <span className="fo-seg-own-life">
                <span>{day.labels.lifeAfter}</span>
              </span>
              <span className="fo-seg-own-story">
                <span>{day.labels.storyAfter}</span>
              </span>
            </span>
          </div>
          <small className="fo-day-note">{day.note}</small>
        </div>

        <ol className="fo-day-steps">
          {day.steps.map((step, index) => (
            <li key={step.id} data-step={index + 1}>
              <span className="fo-day-swatch" aria-hidden="true" />
              <span className="fo-index">{pad(index)}</span>
              <small>{step.name}</small>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <a href={`#${step.id}`}>
                {step.more}
                <ArrowDown size={15} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
