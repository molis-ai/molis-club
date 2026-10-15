'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { handoff, type HandoffTarget } from '../../../../../content/site/work';
import { useReducedMotion } from '../../../../_site/motion';

// 标志性交互「把这件工作交给谁」（交互示意），作品集的写法：一行五个站位，像目录里的五栏。
// 选一个接手的人，工作卡沿着这一行滑过去，资料、进展、成果、讨论跟着它；接手方从断点继续。
// 需要判断时，卡片停一会儿再滑回「在你手里」，那句要你决定的话亮出来。减少动态时直接停在结果上。

type TargetId = HandoffTarget['id'];

export function FolioHandoff() {
  const { card, targets, labels } = handoff;
  const reduced = useReducedMotion();
  // 每选一次记一个号；滑回来的是哪一号，就只对那一次算数（重选同一个接手方时重新走一遍）
  const picks = useRef(0);
  const [pick, setPick] = useState<{ id: TargetId; n: number } | null>(null);
  const [backFrom, setBackFrom] = useState(0);
  const target = pick?.id ?? null;
  const chosen = targets.find((item) => item.id === target) ?? null;
  const back = pick !== null && backFrom === pick.n;

  useEffect(() => {
    if (!pick || !chosen?.ask) return;
    const timer = window.setTimeout(
      () => setBackFrom(pick.n),
      reduced ? 0 : 2400,
    );
    return () => window.clearTimeout(timer);
  }, [pick, chosen, reduced]);

  const choose = (id: TargetId) => {
    picks.current += 1;
    setPick({ id, n: picks.current });
  };

  // 卡片在第几栏：0 是「在你手里」，1…4 是四个接手方
  const at = !chosen || back ? 0 : targets.indexOf(chosen) + 1;

  return (
    <div
      className="fo-hf"
      data-state={!chosen ? 'idle' : back ? 'back' : 'away'}
      style={{ '--at': at } as CSSProperties}
    >
      <ol className="fo-hf-track">
        <li className="fo-hf-station" data-here={at === 0 || undefined}>
          <span className="fo-hf-name">{labels.from}</span>
        </li>
        {targets.map((item, index) => (
          <li
            key={item.id}
            className="fo-hf-station"
            data-here={at === index + 1 || undefined}
          >
            <button
              type="button"
              className="fo-hf-name"
              aria-pressed={target === item.id}
              onClick={() => choose(item.id)}
            >
              {item.name}
            </button>
            <small>{item.who}</small>
          </li>
        ))}
      </ol>
      <div className="fo-hf-rail" aria-hidden="true">
        <div className="fo-hf-card">
          <b>{card.name}</b>
          <span>{card.part}</span>
        </div>
      </div>
      <dl className="fo-hf-log" aria-live="polite">
        {chosen ? (
          <>
            <div>
              <dt>{labels.carry}</dt>
              <dd>
                {card.attachments.map((item) => (
                  <span key={item.key}>
                    {item.label} <small>{item.value}</small>
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>{labels.resume}</dt>
              <dd>{chosen.resume}</dd>
            </div>
            {chosen.ask && back ? (
              <div className="fo-hf-ask">
                <dt>{labels.back}</dt>
                <dd>{chosen.ask}</dd>
              </div>
            ) : null}
          </>
        ) : (
          <div className="fo-hf-hint">
            <dt className="sr-only">{labels.choose}</dt>
            <dd>{handoff.lead}</dd>
          </div>
        )}
      </dl>
      {chosen ? (
        <button
          type="button"
          className="fo-link fo-hf-reset"
          onClick={() => setPick(null)}
        >
          {labels.reset}
        </button>
      ) : null}
    </div>
  );
}
