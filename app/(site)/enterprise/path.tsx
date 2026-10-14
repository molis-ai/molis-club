'use client';
import { ArrowDown } from 'lucide-react';
import { useState } from 'react';
import {
  enterprise,
  type Advice,
  type QuestionId,
  type StationId,
} from '../../../content/site/enterprise';

// 企业合作页的标志性交互：选一个最像你们的问题，合作路径上亮出建议的起点（有的还亮出「接着」的一站）。
// 路径是 5.3 的三步，5.2 的四项服务是路径上的四站；每站写适合谁 / 做什么 / 留下什么。
// 默认（以及没有 JS 时）什么都不选：四站都完整可读，选问题的那一排在没有 JS 时藏起来。
// 只换颜色与描边，不做位移；减少动态时连颜色过渡也去掉，直接停在结果上。

const { path, questions } = enterprise;
const roman = ['I', 'II', 'III'];
const pad = (n: number) => String(n).padStart(2, '0');

/** 同 ui.tsx 的 Phrases：中文长句按标点分组，组内不折行（这里是 client 文件，不把 ui.tsx 拉进来） */
function Phrases({ text }: { text: string }) {
  const parts = text.match(/[^，。、；！？：]+[，。、；！？：]?/g) ?? [text];
  return (
    <>
      {parts.map((part, index) => (
        <span key={index} className="m-phrase">
          {part}
        </span>
      ))}
    </>
  );
}

/** 起点那一站的「留下什么」里点亮一个词（资料经验拼不起来 → 知识助手） */
function Leaves({ text, term }: { text: string; term?: string }) {
  const at = term ? text.indexOf(term) : -1;
  if (!term || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="m-ent-term">{term}</mark>
      {text.slice(at + term.length)}
    </>
  );
}

export function Path() {
  const [pick, setPick] = useState<QuestionId | null>(null);
  const advice: Advice | null = pick ? path.advice[pick] : null;
  const markOf = (id: StationId) =>
    advice?.start === id ? 'start' : advice?.next === id ? 'next' : undefined;

  return (
    <div className="m-ent-path" data-picked={pick ? '' : undefined}>
      <div className="m-ent-pick">
        <fieldset className="m-ent-pick-set">
          <legend className="m-ent-pick-legend">
            <span>{path.pick.legend}</span>
            <span className="m-note">{path.pick.note}</span>
          </legend>
          <div className="m-ent-pick-list">
            {questions.items.map((question, index) => (
              <label key={question.id} className="m-ent-pick-item">
                <input
                  type="radio"
                  name="ent-question"
                  value={question.id}
                  checked={pick === question.id}
                  onChange={() => setPick(question.id)}
                />
                <span>
                  <span className="m-ent-pick-no num" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  {question.short}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="m-ent-advice">
          <div aria-live="polite" aria-atomic="true">
            {advice ? (
              <p className="m-ent-advice-line">
                <span className="m-ent-advice-label">{path.pick.start}</span>
                <b>{path.stations[advice.start].name}</b>
                {advice.next ? (
                  <>
                    <span className="m-ent-advice-label">{path.pick.next}</span>
                    <b>{path.stations[advice.next].name}</b>
                  </>
                ) : null}
                <span className="m-ent-advice-why">
                  {advice.reason}
                  {path.pick.caveat}
                </span>
              </p>
            ) : (
              <p className="m-ent-advice-idle">{path.pick.idle}</p>
            )}
          </div>
          {advice ? (
            <p className="m-actions">
              <a
                className="m-link"
                href={`#station-${advice.start}`}
                data-dir="down"
              >
                {path.pick.jump}
                <ArrowDown size={13} aria-hidden="true" />
              </a>
              <button
                type="button"
                className="m-link"
                onClick={() => setPick(null)}
              >
                {path.pick.reset}
              </button>
            </p>
          ) : null}
        </div>
      </div>

      <ol className="m-ent-stages">
        {path.stages.map((stage, index) => (
          <li
            key={stage.title}
            className="m-ent-stage"
            data-span={stage.stations.length}
          >
            <div className="m-ent-stage-head">
              <span className="m-ent-roman" lang="en" aria-hidden="true">
                {roman[index]}
              </span>
              <h3 className="m-ent-stage-title">
                <Phrases text={stage.title} />
              </h3>
              <div className="m-ent-stage-text">
                {stage.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <ul className="m-ent-stops">
              {stage.stations.map((id) => {
                const station = path.stations[id];
                const mark = markOf(id);
                return (
                  <li
                    key={id}
                    id={`station-${id}`}
                    className="m-ent-stop"
                    data-mark={mark}
                  >
                    <p className="m-ent-rail">
                      <span className="m-ent-stop-name">{station.stop}</span>
                      {mark ? (
                        <span className="m-ent-flag">
                          {mark === 'start' ? path.pick.start : path.pick.next}
                        </span>
                      ) : null}
                    </p>
                    <div className="m-ent-card">
                      <h4 className="m-ent-service">{station.name}</h4>
                      <dl className="m-ent-dl">
                        <div>
                          <dt>{path.labels.fit}</dt>
                          <dd>{station.fit}</dd>
                        </div>
                        <div>
                          <dt>{path.labels.does}</dt>
                          <dd>{station.does}</dd>
                        </div>
                        <div>
                          <dt>{path.labels.leaves}</dt>
                          <dd>
                            <Leaves
                              text={station.leaves}
                              term={
                                mark === 'start' ? advice?.term : undefined
                              }
                            />
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
