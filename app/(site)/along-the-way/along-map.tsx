'use client';
import { ChevronDown } from 'lucide-react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  alongGroups,
  alongUi,
  flowOf,
  flows,
  type Flow,
} from '../../../content/site/along';
import { More } from '../../_site/ui';
import { Glyph } from './glyphs';
import { layout, narrow, pointAt, total, wide, type Size } from './river';
import './river.css';

// 沿途（展厅 03）：一条河 + 一本目录。
// 河：54 个点从左边八个源头顺着细线流到右边七个去处；进入视口时线一条条画出来，点沿线走到去处。
// 停在一处去处上，河里只亮流到那里的线；点它，下面的索引只剩流到那里的几件。
// 目录：八组，每组一面墙——一张图和一列展签，左右交替；每件一行（小示意图、英文名、一句话看懂、去处），
// 点开是原名、「它关心的问题」「现在在哪」的原文与公开仓库。
// 没有 JS：河直接是画好的样子，索引全部列出、每行照样能展开；减少动态：不画、不走，直接是结果。
// 带 ?flow=tool 这样的地址进来：先筛好，再把目录带到眼前（给别处直接链到某个去处用）。

type Show = 'all' | Flow;
type Mark =
  | { kind: 'flow'; flow: Flow }
  | { kind: 'group'; group: number }
  | null;

const wideLayout = layout(wide);
const narrowLayout = layout(narrow);
const usedFlows = flows.filter((flow) => wideLayout.sinks[flow]);
const countOf = (show: Show) =>
  show === 'all' ? total : (wideLayout.sinks[show]?.count ?? 0);
const groupId = (no: string) => `along-${no.replace('.', '-')}`;
const pct = (value: number, of: number) =>
  `${((value / of) * 100).toFixed(3)}%`;
const hasCjk = (text: string) => /[\u4e00-\u9fff]/.test(text);

const numbered = alongGroups.map((group) => ({
  ...group,
  rows: group.items.map((item) => ({ item, flow: flowOf(item) })),
}));

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
  choose?: (flow: Flow) => void;
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
    const dots = Array.from(
      root.querySelectorAll<SVGCircleElement>('[data-dot]'),
    );
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
            data-on={
              mark?.kind === 'group' && mark.group === g ? '' : undefined
            }
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
              style={
                {
                  '--d': `${thread.group * 140 + (index % 9) * 28}ms`,
                } as CSSProperties
              }
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
        const hover = {
          style: {
            top: pct((band.y0 + band.y1) / 2, size.h),
            left: pct(size.to + 14, size.w),
          },
          onMouseEnter: () => setMark({ kind: 'flow', flow }),
          onMouseLeave: () => setMark(null),
          onFocus: () => setMark({ kind: 'flow', flow }),
          onBlur: () => setMark(null),
        };
        const label = (
          <>
            <span>{labels[flow]}</span>
            <span className="m-river-count num">{band.count}</span>
          </>
        );
        return (
          <button
            key={flow}
            type="button"
            className="m-river-sink"
            data-flow={flow}
            aria-pressed={show === flow}
            onClick={() => choose?.(flow)}
            {...hover}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function AlongMap({
  label,
  pics,
}: {
  label?: ReactNode;
  /** 每组的那张图（服务端排好的展品），键是组号 A.1…A.8；没有就留一块待选的底 */
  pics?: Record<string, ReactNode>;
}) {
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

  // 带 ?flow=tool 进来：进页时先筛好，再把索引带到眼前
  useEffect(() => {
    const flow = new URLSearchParams(location.search).get('flow');
    if (!flow || !(usedFlows as string[]).includes(flow)) return;
    // 等首帧画完再筛，筛完的下一帧再滚
    const frame = requestAnimationFrame(() => {
      setShow(flow as Flow);
      requestAnimationFrame(() =>
        index.current?.scrollIntoView({ block: 'start' }),
      );
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <section
        className="m-river ex-screen m-wrap"
        aria-labelledby="river-title"
      >
        <div className="ex-grid m-river-head" data-reveal>
          <div className="m-river-head-title">
            <p className="ex-kicker">{alongUi.riverKicker}</p>
            <h2 className="ex-h2" id="river-title">
              {alongUi.river(total)}
            </h2>
          </div>
          {label}
        </div>
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
        <p className="ex-kicker m-along-catalog">{alongUi.catalog(total)}</p>
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

        {/* 筛完空了的组不画；左右按画出来的顺序交替，免得筛过后两组挨着都在一边 */}
        {numbered
          .map((group) => ({
            group,
            rows: group.rows.filter(
              (row) => show === 'all' || row.flow === show,
            ),
          }))
          .filter(({ rows }) => rows.length)
          .map(({ group, rows }, g) => {
            const id = groupId(group.no);
            return (
              <section
                key={group.no}
                className="al-g"
                data-side={g % 2 ? 'right' : 'left'}
                id={id}
                aria-labelledby={`${id}-title`}
              >
                <div className="al-g-pic">
                  {pics?.[group.no] ?? (
                    <div className="al-g-wait" aria-hidden="true">
                      {group.no}
                    </div>
                  )}
                </div>
                <div className="al-g-body">
                  <header className="al-g-head">
                    <p className="al-g-meta">
                      <span className="m-no">{group.no}</span>
                      <span className="num">
                        {rows.length} {alongUi.count}
                      </span>
                      {/* 这一组流去了哪：一个点一件 */}
                      <span className="m-along-spread" aria-hidden="true">
                        {group.rows.map((row) => (
                          <span
                            key={row.item.name}
                            className="m-along-pip"
                            data-flow={row.flow}
                            title={alongUi.flow[row.flow]}
                          />
                        ))}
                      </span>
                    </p>
                    <h2 className="ex-h2" id={`${id}-title`}>
                      {group.title}
                    </h2>
                  </header>
                  <ol className="al-list">
                    {rows.map(({ item, flow }) => {
                      const original = hasCjk(item.name)
                        ? item.name
                        : item.alias && hasCjk(item.alias)
                          ? item.alias
                          : null;
                      return (
                        <li key={item.name} className="al-row" data-flow={flow}>
                          <details>
                            <summary className="al-sum">
                              <Glyph name={item.name} />
                              <span className="al-main">
                                <span className="al-line">
                                  <h3 className="al-name" lang="en">
                                    {item.en ?? item.name}
                                  </h3>
                                  {item.aside ? (
                                    <span className="m-along-here">
                                      {item.aside}
                                    </span>
                                  ) : null}
                                  <span className="al-flow" data-flow={flow}>
                                    {alongUi.flow[flow]}
                                  </span>
                                </span>
                                <span className="al-plain">{item.plain}</span>
                              </span>
                              <span className="al-toggle" aria-hidden="true">
                                <ChevronDown size={13} />
                              </span>
                            </summary>
                            <div className="al-more">
                              <dl>
                                {original ? (
                                  <div>
                                    <dt>{alongUi.original}</dt>
                                    <dd>{original}</dd>
                                  </div>
                                ) : null}
                                <div>
                                  <dt>{alongUi.columns.ask}</dt>
                                  <dd>{item.ask}</dd>
                                </div>
                                <div>
                                  <dt>{alongUi.more}</dt>
                                  <dd>
                                    {item.now.length ? (
                                      item.now.map((text) => (
                                        <p key={text}>{text}</p>
                                      ))
                                    ) : (
                                      <p>{alongUi.unknown}</p>
                                    )}
                                  </dd>
                                </div>
                              </dl>
                              {item.where.includes('app') || item.href ? (
                                <p className="m-along-meta">
                                  {item.where.includes('app') ? (
                                    <span className="m-along-tag">
                                      {alongUi.app}
                                    </span>
                                  ) : null}
                                  {item.href ? (
                                    <More href={item.href} external>
                                      {alongUi.repo}
                                      <span className="sr-only">
                                        ：{item.en ?? item.name}
                                      </span>
                                    </More>
                                  ) : null}
                                </p>
                              ) : null}
                            </div>
                          </details>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </section>
            );
          })}
      </div>
    </>
  );
}
