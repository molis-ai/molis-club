'use client';
import { RotateCw } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { teamUi } from '../../../content/site/team';

// 能翻面的成员卡：正面是方向与经历，背面是标「自述」的个性标签。
// 翻面用一个按钮（aria-pressed），键盘可用；藏起来的那一面同时不进读屏（visibility）。
// 没有 JS 时两面上下排开、都能读到，按钮不出现；减少动态时不做三维翻转，直接换面（样式在 team.css）。
export function FlipCard({
  id,
  name,
  front,
  back,
}: {
  id: string;
  name: string;
  front: ReactNode;
  back: ReactNode;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <article
      className="tm-card"
      id={id}
      aria-labelledby={`${id}-name`}
      data-flip
      data-flipped={flipped || undefined}
    >
      <div className="tm-inner">
        <div className="tm-face tm-front">{front}</div>
        <div className="tm-face tm-back">{back}</div>
      </div>
      <button
        type="button"
        className="tm-turn"
        aria-pressed={flipped}
        aria-label={teamUi.flip(name)}
        onClick={() => setFlipped((value) => !value)}
      >
        <RotateCw size={13} aria-hidden="true" />
        <span>{teamUi.self}</span>
      </button>
    </article>
  );
}
