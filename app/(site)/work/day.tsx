'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { workEnding } from '../../../content/site/work';
import { useReducedMotion, useVisible } from '../../_site/motion';
import { usePersona } from './persona';

// 一天从 9 点到 18 点：灰色的杂事变薄，空出来的时间分给三块。
// 在视口里时在「现在」和「交给工作台以后」之间慢慢来回；没有 JS、减少动态时停在「以后」。
const BEFORE: Record<string, [number, number]> = {
  c0: [0, 0.16],
  c1: [0.16, 0.14],
  c2: [0.3, 0.18],
  c3: [0.48, 0.16],
  w: [0.64, 0.36],
  u0: [1, 0],
  u1: [1, 0],
  u2: [1, 0],
};
const AFTER: Record<string, [number, number]> = {
  c0: [0, 0.03],
  c1: [0.03, 0.03],
  c2: [0.06, 0.03],
  c3: [0.09, 0.03],
  w: [0.12, 0.32],
  u0: [0.44, 0.2],
  u1: [0.64, 0.2],
  u2: [0.84, 0.16],
};
const HOURS = ['9:00', '12:00', '15:00', '18:00'];

export function Day() {
  const { persona } = usePersona();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const visible = useVisible(ref, 0.5);
  const [after, setAfter] = useState(true);

  useEffect(() => {
    if (!visible || reduced) return;
    // 先回到「现在」，再慢慢变成「以后」，停一会儿，再来一遍
    let next = false;
    let wait = 400;
    const timer = window.setInterval(() => {
      wait -= 200;
      if (wait > 0) return;
      setAfter(next);
      wait = next ? 5600 : 2800;
      next = !next;
    }, 200);
    return () => window.clearInterval(timer);
  }, [visible, reduced]);

  const { day } = workEnding;
  const blocks: [string, string, string][] = [
    ...day.chores[persona].map((label, i): [string, string, string] => [`c${i}`, 'chore', label]),
    ['w', 'work', day.work],
    ...day.uses[persona].map((label, i): [string, string, string] => [`u${i}`, `use wd-u${i}`, label]),
  ];
  const at = after ? AFTER : BEFORE;
  return (
    <figure className="wd" ref={ref} aria-label={day.label}>
      <p className="wd-when" aria-hidden="true">
        <span data-on={!after || undefined}>{day.before}</span>
        <span data-on={after || undefined}>{day.after}</span>
      </p>
      <div className="wd-bar" aria-hidden="true">
        {blocks.map(([key, kind, label]) => (
          <span
            key={key}
            className={`wd-blk wd-${kind}`}
            data-thin={at[key][1] < 0.05 || undefined}
            data-gone={at[key][1] === 0 || undefined}
            style={{ '--a': at[key][0], '--b': at[key][1] } as CSSProperties}
          >
            <span>{label}</span>
          </span>
        ))}
      </div>
      <p className="wd-hours" aria-hidden="true">
        {HOURS.map((hour) => (
          <span key={hour}>{hour}</span>
        ))}
      </p>
    </figure>
  );
}
