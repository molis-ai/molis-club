'use client';
import { useRef, useState } from 'react';
import {
  alongGroups,
  alongUi,
  type AlongItem,
  type Where,
} from '../../../content/site/along';
import { More, pad } from '../../_site/ui';

// 沿途的索引：八组、每件一行，可按「现在在哪」筛选。
// 筛选是按钮（aria-pressed），一次只按下一个；没有 JS 时筛选条不出现，全部条目照常显示。
// 附录没写明去处的条目不归类，落进「其他」；哪天都归好了类，「其他」这个按钮自己消失。
// 切换没有动画：减少动态与否，都直接停在筛选后的结果。

type Show = 'all' | Where | 'other';

const kinds: Where[] = ['merged', 'app', 'lab', 'design', 'archived'];

const matches = (item: AlongItem, show: Show) =>
  show === 'all' ||
  (show === 'other' ? item.where.length === 0 : item.where.includes(show));

const allItems = alongGroups.flatMap((group) => group.items);
const countOf = (show: Show) =>
  allItems.filter((item) => matches(item, show)).length;

const options: { key: Show; label: string; count: number }[] = [
  { key: 'all' as const, label: alongUi.all },
  ...kinds.map((key) => ({ key, label: alongUi.where[key] })),
  { key: 'other' as const, label: alongUi.other },
]
  .map((option) => ({ ...option, count: countOf(option.key) }))
  .filter((option) => option.key !== 'other' || option.count > 0);

/** 这一件归在哪：已并入 Work、独立应用…… */
function tags(item: AlongItem) {
  return item.where.map((key) =>
    key === 'merged' && item.into
      ? `${alongUi.merged} ${item.into}`
      : alongUi.where[key],
  );
}

// 整页连续编号，像图录的条目号
const groups = alongGroups.map((group, index) => {
  const before = alongGroups
    .slice(0, index)
    .reduce((sum, previous) => sum + previous.items.length, 0);
  return {
    ...group,
    items: group.items.map((item, at) => ({ item, no: before + at + 1 })),
  };
});

export function AlongIndex() {
  const [show, setShow] = useState<Show>('all');
  const visible = countOf(show);
  const root = useRef<HTMLDivElement>(null);
  // 已经往下读了一段再换筛选：把列表开头带回眼前，免得一下子落到结尾那一段
  const pick = (next: Show) => {
    setShow(next);
    const node = root.current;
    if (node && node.getBoundingClientRect().top < 0)
      node.scrollIntoView({ block: 'start' });
  };

  return (
    <div className="m-along-index m-wrap" ref={root}>
      <div className="m-along-bar">
        <fieldset className="m-along-filter">
          <legend className="sr-only">{alongUi.filterLabel}</legend>
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={show === option.key}
              onClick={() => pick(option.key)}
            >
              <span>{option.label}</span>
              <span className="num" aria-hidden="true">
                {option.count}
              </span>
            </button>
          ))}
        </fieldset>
        <p className="sr-only" aria-live="polite">
          {alongUi.showing(visible)}
        </p>
      </div>

      <div className="m-along-columns" aria-hidden="true">
        <span>{alongUi.columns.name}</span>
        <span>{alongUi.columns.ask}</span>
        <span>{alongUi.columns.now}</span>
      </div>

      {visible === 0 ? (
        <div className="m-along-empty">
          <p>{alongUi.empty}</p>
          <button type="button" className="m-link" onClick={() => pick('all')}>
            {alongUi.emptyBack}
          </button>
        </div>
      ) : null}

      {groups.map((group) => {
        const rows = group.items.filter(({ item }) => matches(item, show));
        if (!rows.length) return null;
        const id = `along-${group.no.replace('.', '-')}`;
        return (
          <section
            key={group.no}
            className="m-along-group"
            aria-labelledby={id}
          >
            <header className="m-along-ghead">
              <p className="m-along-gmeta">
                <span className="m-no">{group.no}</span>
                <span className="m-along-gcount num">
                  {rows.length} {alongUi.count}
                </span>
              </p>
              <h2 id={id}>{group.title}</h2>
            </header>
            <ol className="m-along-list">
              {rows.map(({ item, no }) => (
                <li key={item.name} className="m-along-row">
                  <span className="m-along-no num" aria-hidden="true">
                    {pad(no)}
                  </span>
                  <h3 className="m-along-name">
                    <span>{item.name}</span>
                    {item.alias ? (
                      <span className="m-along-alias"> · {item.alias}</span>
                    ) : null}
                    {item.aside ? (
                      <span className="m-along-here">{item.aside}</span>
                    ) : null}
                  </h3>
                  <p className="m-along-ask">
                    <span className="sr-only">{alongUi.columns.ask}：</span>
                    {item.ask}
                  </p>
                  <div className="m-along-now">
                    <span className="sr-only">{alongUi.columns.now}：</span>
                    {item.now.length ? (
                      item.now.map((text) => <p key={text}>{text}</p>)
                    ) : (
                      <p>
                        <span aria-hidden="true">—</span>
                        <span className="sr-only">{alongUi.unknown}</span>
                      </p>
                    )}
                    {item.where.length || item.href ? (
                      <p className="m-along-meta">
                        {tags(item).map((tag) => (
                          <span key={tag} className="m-along-tag">
                            {tag}
                          </span>
                        ))}
                        {item.href ? (
                          <More href={item.href} external>
                            {alongUi.repo}
                            <span className="sr-only">：{item.name}</span>
                          </More>
                        ) : null}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
