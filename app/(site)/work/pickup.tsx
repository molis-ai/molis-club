'use client';

import { useCallback, useEffect, useState } from 'react';
import { AIS, Lines, PICKUP, type Ai } from './desk';

/** 换一家 AI：换了几次（窗里读到的几行跟着亮一下）、现在是哪一家 */
export function usePickup() {
  const [ai, setAi] = useState<Ai>('OpenCode');
  const [reads, setReads] = useState(0);
  const pick = useCallback((name: Ai) => {
    setAi(name);
    setReads((n) => n + 1);
  }, []);
  const reset = useCallback(() => {
    setAi('OpenCode');
    setReads(0);
  }, []);
  return { ai, reads, read: reads ? ((reads % 2 ? 'a' : 'b') as 'a' | 'b') : undefined, pick, reset };
}

/** 发布说明里来回选两处（一长句、一行数据）：on 的时候每隔一会儿换一处，减少动态时停在第一处 */
export function useSel(on: boolean) {
  const [turns, setTurns] = useState(0);
  useEffect(() => {
    if (!on || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setTurns((n) => n + 1), 2600);
    return () => {
      clearInterval(timer);
      setTurns(0);
    };
  }, [on]);
  return on && turns % 2 ? 'b' : 'a';
}

/** 终端上方三家 AI 来回换，读到的还是同一页；「你」的名牌停在下一家上，换过一次就收起 */
export function Pickup({ on = true, ai, tried, onPick }: { on?: boolean; ai: Ai; tried: boolean; onPick: (ai: Ai) => void }) {
  const next = AIS[0] === ai ? AIS[1] : AIS[0];
  return (
    <div className="wk-term wk-pick" data-id="c1" data-on={on || undefined}>
      <p className="wk-term-h">
        <i />
        <i />
        <i />
        <span className="wk-pick-tabs">
          {AIS.map((name) => (
            <button
              key={name}
              type="button"
              className="wk-pick-tab"
              aria-pressed={name === ai}
              tabIndex={on ? 0 : -1}
              onClick={() => onPick(name)}
            >
              {name}
              {!tried && name === next ? (
                <span className="wk-pick-hand" aria-hidden="true">
                  你
                </span>
              ) : null}
            </button>
          ))}
        </span>
      </p>
      <div key={ai} aria-live="polite">
        <Lines lines={PICKUP} />
      </div>
    </div>
  );
}
