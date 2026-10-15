'use client';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  alongGroups,
  alongUi,
  flowOf,
  flows,
  type Flow,
} from '../../../content/site/along';
import { More, pad } from '../../_site/ui';
import { layout, narrow, pointAt, total, wide, type Size } from './river';

// 沿途（visual-storyboard 第 3 节）：一条河 + 一本索引。
// 河：54 个点从左边八个源头顺着细线流到右边七个去处；进入视口时线一条条画出来，点沿线走到去处。
// 停在一处去处上，河里只亮流到那里的线；点它，下面的索引只剩流到那里的几件。
// 索引：八组，每件一行（名字、它关心的问题、去处），点开是「现在在哪」的原文与公开仓库。
// 没有 JS：河直接是画好的样子，索引全部列出、每行照样能展开；减少动态：不画、不走，直接是结果。

type Show = 'all' | Flow;
type Mark = { kind: 'flow'; flow: Flow } | { kind: 'group'; group: number } | null;

const wideLayout = layout(wide);
const narrowLayout = layout(narrow);
const usedFlows = flows.filter((flow) => wideLayout.sinks[flow]);
const countOf = (show: Show) =>
  show === 'all' ? total : (wideLayout.sinks[show]?.count ?? 0);
const groupId = (no: string) => `along-${no.replace('.', '-')}`;
const pct = (value: number, of: number) => `${((value / of) * 100).toFixed(3)}%`;

// 整页连续编号，像图录的条目号
const numbered = alongGroups.map((group, index) => {
  const before = alongGroups
    .slice(0, index)
    .reduce((sum, previous) => sum + previous.items.length, 0);
  return {
    ...group,
    rows: group.items.map((item, at) => ({
      item,
      no: before + at + 1,
      flow: flowOf(item),
    })),
  };
});

function River({
  size,
  variant,
  mark,
  setMark,
  show,
  choose,
}: {
  size: Size;
  variant: 'wide' | 'narrow';
  mark: Mark;
  setMark: (mark: Mark) => void;
  show: Show;
  choose: (flow: Flow) => void;
}) {
  const plan = variant === 'wide' ? wideLayout : narrowLayout;
  const ref = useRef<HTMLDivElement>(null);
  const lit = (flow: Flow, group: number) =>
    mark
      ? mark.kind === 'flow'
        ? mark.flow === flow
        : mark.group === group
      : show === 'all' || show === flow;

  // 线一条条画出来，点沿线走到去处（只演一次）
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    if (still.matches) {
      root.dataset.state = 'done';
      return;
    }
    root.dataset.state = 'ready';
    const dots = Array.from(root.querySelectorAll<SVGCircleElement>('[data-dot]'));
    const timing = plan.threads.map((thread, index) => ({
      thread,
      delay: thread.group * 140 + (index % 9) * 28,
    }));
    const place = (progress: (delay: number) => number) => {
      dots.forEach((dot) => {
        const { thread, delay } = timing[Number(dot.dataset.dot)];
        const t = progress(delay);
        const at = pointAt(size, thread.y0, thread.y1, t);
        dot.setAttribute('cx', at.x.toFixed(1));
        dot.setAttribute('cy', at.y.toFixed(1));
        dot.style.opacity = t > 0 ? '1' : '0';
      });
    };
    place(() => 0);
    let frame = 0;
    const run = () => {
      root.dataset.state = 'run';
      const start = performance.now();
      const duration = 1500;
      const last = Math.max(...timing.map((row) => row.delay)) + duration;
      const tick = (now: number) => {
        const elapsed = now - start;
        place((delay) => {
          const t = Math.min(1, Math.max(0, (elapsed - delay) / duration));
          return 1 - Math.pow(1 - t, 3);
        });
        if (elapsed < last) frame = requestAnimationFrame(tick);
        else root.dataset.state = 'done';
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.25 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [plan, size]);

  const labels = variant === 'wide' ? alongUi.flow : alongUi.flowShort;
  return (
    <div
      className="m-river-box"
      data-variant={variant}
      data-marked={mark || show !== 'all' ? '' : undefined}
      ref={ref}
      style={{ aspectRatio: `${size.w} / ${size.h}` } as CSSProperties}
    >
      <svg
        className="m-river-svg"
        viewBox={`0 0 ${size.w} ${size.h}`}
        aria-hidden="true"
        focusable="false"
      >
        {plan.sources.map((band, g) => (
          <rect
            key={`s${g}`}
            className="m-river-bar"
            data-on={mark?.kind === 'group' && mark.group === g ? '' : undefined}
            x={size.from - 2}
            y={band.y0}
            width={3}
            height={band.y1 - band.y0}
            rx={1.5}
          />
        ))}
        {usedFlows.map((flow) => {
          const band = plan.sinks[flow];
          return (
            <rect
              key={flow}
              className="m-river-bar"
              data-flow={flow}
              x={size.to - 1}
              y={band.y0}
              width={3}
              height={band.y1 - band.y0}
              rx={1.5}
            />
          );
        })}
        {plan.threads.map((thread, index) => {
          const { item } = thread;
          return (
            <g
              key={item.name}
              className="m-river-thread"
              data-flow={thread.flow}
              data-dim={lit(thread.flow, thread.group) ? undefined : ''}
              style={{ '--d': `${thread.group * 140 + (index % 9) * 28}ms` } as CSSProperties}
            >
              <title>
                {`${item.name}${item.alias ? ` · ${item.alias}` : ''}：${item.ask}`}
              </title>
              <path className="m-river-line" d={thread.d} pathLength={1} />
              <path className="m-river-hit" d={thread.d} />
              {item.where.includes('app') ? (
                <circle
                  className="m-river-ring"
                  cx={size.to}
                  cy={thread.y1}
                  r={variant === 'wide' ? 6.5 : 5}
                />
              ) : null}
              <circle
                className="m-river-dot"
                data-dot={index}
                cx={size.to}
                cy={thread.y1}
                r={variant === 'wide' ? 3.6 : 2.8}
              />
            </g>
          );
        })}
      </svg>

      {/* 源头：停上去只亮这一组；点了跳到索引里这一组 */}
      {numbered.map((group, g) => {
        const band = plan.sources[g];
        return (
          <a
            key={group.no}
            className="m-river-source"
            href={`#${groupId(group.no)}`}
            style={{
              top: pct((band.y0 + band.y1) / 2, size.h),
              right: pct(size.w - size.from + 12, size.w),
            }}
            onMouseEnter={() => setMark({ kind: 'group', group: g })}
            onMouseLeave={() => setMark(null)}
            onFocus={() => setMark({ kind: 'group', group: g })}
            onBlur={() => setMark(null)}
          >
            {variant === 'wide' ? (
              <span className="m-river-no" lang="en">
                {group.no}
              </span>
            ) : null}
            <span>{group.short}</span>
            <span className="m-river-count num">{group.items.length}</span>
          </a>
        );
      })}

      {/* 去处：停上去只亮流到这里的线；点了筛下面的索引 */}
      {usedFlows.map((flow) => {
        const band = plan.sinks[flow];
        return (
          <button
            key={flow}
            type="button"
            className="m-river-sink"
            data-flow={flow}
            aria-pressed={show === flow}
            style={{
              top: pct((band.y0 + band.y1) / 2, size.h),
              left: pct(size.to + 14, size.w),
            }}
            onMouseEnter={() => setMark({ kind: 'flow', flow })}
            onMouseLeave={() => setMark(null)}
            onFocus={() => setMark({ kind: 'flow', flow })}
            onBlur={() => setMark(null)}
            onClick={() => choose(flow)}
          >
            <span>{labels[flow]}</span>
            <span className="m-river-count num">{band.count}</span>
          </button>
        );
      })}
    </div>
  );
}

export function AlongMap() {
  const [show, setShow] = useState<Show>('all');
  const [mark, setMark] = useState<Mark>(null);
  const index = useRef<HTMLDivElement>(null);
  const visible = countOf(show);
  const options = useMemo(
    () => [
      { key: 'all' as Show, label: alongUi.all, count: total },
      ...usedFlows.map((flow) => ({
        key: flow as Show,
        label: alongUi.flow[flow],
        count: countOf(flow),
      })),
    ],
    [],
  );

  // 换筛选：把索引开头带回眼前
  const pick = (next: Show, scroll = false) => {
    setShow(next);
    // 等筛过的索引排好再滚，免得滚到一半页面变短
    requestAnimationFrame(() => {
      const node = index.current;
      if (node && (scroll || node.getBoundingClientRect().top < 0))
        node.scrollIntoView({ block: 'start' });
    });
  };

  return (
    <>
      <section className="m-river m-wrap" aria-labelledby="river-title">
        <h2 className="sr-only" id="river-title">
          {alongUi.river(total)}
        </h2>
        <River
          size={wide}
          variant="wide"
          mark={mark}
          setMark={setMark}
          show={show}
          choose={(flow) => pick(flow, true)}
        />
        <River
          size={narrow}
          variant="narrow"
          mark={mark}
          setMark={setMark}
          show={show}
          choose={(flow) => pick(flow, true)}
        />
        <div className="m-river-notes">
          <p>{alongUi.riverNote}</p>
          <p>
            <span className="m-river-key" aria-hidden="true" />
            {alongUi.appMark}
          </p>
          <p>{alongUi.restNote}</p>
        </div>
      </section>

      <div className="m-along-index m-wrap" ref={index}>
        <div className="m-along-bar">
          <fieldset className="m-along-filter">
            <legend className="sr-only">{alongUi.filterLabel}</legend>
            {options.map((option) => (
              <button
                key={option.key}
                type="button"
                data-flow={option.key}
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

        {numbered.map((group) => {
          const rows = group.rows.filter(
            (row) => show === 'all' || row.flow === show,
          );
          if (!rows.length) return null;
          const id = groupId(group.no);
          return (
            <section
              key={group.no}
              className="m-along-group"
              id={id}
              aria-labelledby={`${id}-title`}
            >
              <header className="m-along-ghead">
                <p className="m-along-gmeta">
                  <span className="m-no">{group.no}</span>
                  <span className="m-along-gcount num">
                    {rows.length} {alongUi.count}
                  </span>
                </p>
                <h2 id={`${id}-title`}>{group.title}</h2>
                {/* 这一组流去了哪：一个点一件 */}
                <p className="m-along-spread" aria-hidden="true">
                  {group.rows.map((row) => (
                    <span
                      key={row.item.name}
                      className="m-along-pip"
                      data-flow={row.flow}
                      title={alongUi.flow[row.flow]}
                    />
                  ))}
                </p>
              </header>
              <ol className="m-along-list">
                {rows.map(({ item, no, flow }) => (
                  <li key={item.name} className="m-along-row">
                    <details>
                      <summary className="m-along-sum">
                        <span className="m-along-no num" aria-hidden="true">
                          {pad(no)}
                        </span>
                        <h3 className="m-along-name">
                          <span>{item.name}</span>
                          {item.alias ? (
                            <span className="m-along-alias"> · {item.alias}</span>
                          ) : null}
                        </h3>
                        <p className="m-along-ask">
                          <span className="sr-only">{alongUi.columns.ask}：</span>
                          {item.ask}
                        </p>
                        <span className="m-along-flow" data-flow={flow}>
                          {alongUi.flow[flow]}
                        </span>
                        <span className="m-along-toggle" aria-hidden="true">
                          <ChevronDown size={14} />
                        </span>
                      </summary>
                      <div className="m-along-now">
                        <p className="m-kicker">{alongUi.more}</p>
                        {item.now.length ? (
                          item.now.map((text) => <p key={text}>{text}</p>)
                        ) : (
                          <p>{alongUi.unknown}</p>
                        )}
                        {item.where.includes('app') || item.href ? (
                          <p className="m-along-meta">
                            {item.where.includes('app') ? (
                              <span className="m-along-tag">{alongUi.app}</span>
                            ) : null}
                            {item.href ? (
                              <More href={item.href} external>
                                {alongUi.repo}
                                <span className="sr-only">：{item.name}</span>
                              </More>
                            ) : null}
                          </p>
                        ) : null}
                      </div>
                    </details>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </>
  );
}
