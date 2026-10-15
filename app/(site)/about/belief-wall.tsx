'use client';
import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { pad, Phrases } from '../../_site/ui';

// 六条信念：一面墙六件。左边是六条标题（标签页），右边挂着选中那条的一件展品，展签上是这一条的全文。
// 六件都在服务端渲染好，没选中的藏起来（没有 JS 时全部露出，见 about.css）；上下方向键在标题间移动。

export function BeliefWall({
  kicker,
  title,
  titleId,
  items,
}: {
  kicker: string;
  title: string;
  titleId: string;
  items: Array<{ title: string; panel: ReactNode }>;
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();

  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const next =
      event.key === 'ArrowDown' || event.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="ex-grid ab-bw">
      <div className="ab-bw-side" data-reveal>
        <p className="ex-kicker" lang="en">
          {kicker}
        </p>
        <h2 className="ex-h2" id={titleId}>
          {title}
        </h2>
        <div
          className="ab-bw-list"
          role="tablist"
          aria-labelledby={titleId}
          aria-orientation="vertical"
        >
          {items.map((item, index) => (
            <button
              key={item.title}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={index === active}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => move(event, index)}
            >
              <span className="ab-bw-no num" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <span className="ab-bw-title">
                <Phrases text={item.title} />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="ab-bw-stage">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="ab-bw-panel"
            role="tabpanel"
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            hidden={index !== active}
          >
            {item.panel}
          </div>
        ))}
      </div>
    </div>
  );
}
