'use client';
import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { studio } from '../../../content/site/studio';

// 关于页的六条信念：六句加粗的大字是一张目录，点哪条，旁边展开哪条全文（手机上就在这一条下面，样式里排）。
// 用的是标签页的读法（tablist），左右 / 上下方向键可以在六条之间走。
// 没有 JS 时六段全文都在（.js 才只留一段），什么都不缺。

const pad = (n: number) => String(n).padStart(2, '0');

export function Beliefs() {
  const [on, setOn] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = studio.beliefs.length;

  const keys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step =
      event.key === 'ArrowDown' || event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + total) % total;
    setOn(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="ab-bel">
      <div className="ab-bel-list" role="tablist" aria-orientation="vertical">
        {studio.beliefs.map((belief, index) => (
          <button
            key={belief.title}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`bel-tab-${index}`}
            aria-selected={on === index}
            aria-controls={`bel-panel-${index}`}
            tabIndex={on === index ? 0 : -1}
            className="ab-bel-tab"
            style={{ '--i': index } as CSSProperties}
            onClick={() => setOn(index)}
            onKeyDown={(event) => keys(event, index)}
          >
            <span className="ab-bel-no" lang="en" aria-hidden="true">
              {pad(index + 1)}
            </span>
            <span className="ab-bel-title">{belief.title}</span>
          </button>
        ))}
      </div>
      <div className="ab-bel-panels">
        {studio.beliefs.map((belief, index) => (
          <div
            key={belief.title}
            role="tabpanel"
            id={`bel-panel-${index}`}
            aria-labelledby={`bel-tab-${index}`}
            className="ab-bel-panel"
            data-on={on === index || undefined}
            style={{ '--i': index } as CSSProperties}
          >
            <p className="ab-bel-panel-no" lang="en" aria-hidden="true">
              {pad(index + 1)}
            </p>
            <p className="ab-bel-text">{belief.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
