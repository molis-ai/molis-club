'use client';
import { useEffect, useRef, type CSSProperties } from 'react';
import {
  enterprise,
  type Act,
  type StationId,
} from '../../../content/site/enterprise';
import { Keep, play } from './keeps';
import { usePick } from './pick';

// 样张（D1）：合作路线改成一站一页，像翻一页 PPT。每页三样东西，排成一条线：
// 这一站是什么（开始前 · 场景诊断与试点规划，下面是从这里开始的那几个问题）→
// 你们做什么、我们做什么、一起做什么（左右两条道，一起做的横跨两道）→ 留下什么、拿去做什么（右边一张会动的成果卡）。
// 事与成果都是 5.2 / 5.3 的原句片段（content/site/enterprise.ts 的 line）。
//
// 宽屏（≥1000 宽、≥720 高）且不减少动态时，这一页钉在视口里，往下滚换下一站，像画廊在同一个位置换一幅（常驻约束「同类内容同一种看法」）；
// 底下四个点是走到第几站，点一下跳过去。其余情况（手机、矮屏、减少动态、没有 JS）四站竖着排开。
// 在「你们卡在哪」选过问题的，对应那站标「建议起点」「接着」，那个问题在站名下亮起来；「看看这条路怎么走」跳到建议起点那一站。

const { path, hook, line, questions } = enterprise;
const stationIds = Object.keys(path.stations) as StationId[];
const count = stationIds.length;
const lanes = ['you', 'we', 'both'] as const;

function ActCard({
  who,
  act,
  row,
}: {
  who: (typeof lanes)[number];
  act: Act;
  row: number;
}) {
  return (
    <li
      className="m-ent-act"
      data-who={who}
      style={{ '--row': row + 1 } as CSSProperties}
    >
      <span className="m-ent-who" data-who={who}>
        {line.who[who]}
      </span>
      <p className="m-ent-act-text">{act.text}</p>
      {act.detail ? <p className="m-ent-act-detail">{act.detail}</p> : null}
    </li>
  );
}

export function Stages() {
  const context = usePick();
  const register = context?.register;
  const pick = context?.pick ?? null;
  const advice = pick ? path.advice[pick] : null;
  const markOf = (id: StationId) =>
    advice?.start === id ? 'start' : advice?.next === id ? 'next' : undefined;
  const ref = useRef<HTMLDivElement>(null);
  const jumpTo = useRef<((id: StationId) => void) | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const wide = matchMedia('(min-width: 1000px) and (min-height: 720px)');
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const pages = Array.from(
      root.querySelectorAll<HTMLElement>('.m-ent-stage'),
    );
    const dots = Array.from(
      root.querySelectorAll<HTMLElement>('.m-ent-line-dot'),
    );
    let live = false;
    let step = -1;
    let frame = 0;

    const progress = () => {
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      return span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
    };
    const paint = () => {
      frame = 0;
      if (!live) return;
      const next = Math.min(count - 1, Math.floor(progress() * count));
      if (next === step) return;
      step = next;
      pages.forEach((page, index) => {
        const shown = index === step;
        // 刚翻到的这一页：成果卡从头演一遍
        if (shown && !page.hasAttribute('data-shown'))
          play(page.querySelector('.m-ent-leave-card'));
        page.toggleAttribute('data-shown', shown);
      });
      dots.forEach((dot, index) => {
        if (index === step) dot.setAttribute('aria-current', 'step');
        else dot.removeAttribute('aria-current');
      });
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const sync = () => {
      live = wide.matches && !still.matches;
      root.toggleAttribute('data-live', live);
      if (!live) {
        step = -1;
        for (const page of pages) page.removeAttribute('data-shown');
        for (const dot of dots) dot.removeAttribute('aria-current');
      }
      request();
    };
    sync();

    // 竖排时：每张成果卡第一次进入视口演一遍
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || live) continue;
          play(entry.target);
          seen.unobserve(entry.target);
        }
      },
      { threshold: 0.4 },
    );
    root
      .querySelectorAll('.m-ent-leave-card')
      .forEach((node) => seen.observe(node));

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    wide.addEventListener('change', sync);
    still.addEventListener('change', sync);

    // 「看看这条路怎么走」与底下的点：钉住时滚到翻到这一站的位置，否则直接跳到这一站
    const go = (id: StationId) => {
      const index = stationIds.indexOf(id);
      if (!live) {
        document
          .getElementById(`station-${id}`)
          ?.scrollIntoView({ block: 'start' });
        return;
      }
      const top = root.getBoundingClientRect().top + window.scrollY;
      const span = root.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + span * ((index + 0.2) / count) });
    };
    register?.(go);
    jumpTo.current = go;

    return () => {
      if (frame) cancelAnimationFrame(frame);
      seen.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      wide.removeEventListener('change', sync);
      still.removeEventListener('change', sync);
      jumpTo.current = null;
      register?.(null);
    };
  }, [register]);

  return (
    <div className="m-ent-line" ref={ref} data-picked={advice ? '' : undefined}>
      <div className="m-ent-line-stick">
        <div className="m-ent-stages">
          {stationIds.map((id, index) => {
            const station = path.stations[id];
            const mark = markOf(id);
            const asks = questions.items.filter(
              (item) => path.advice[item.id].start === id,
            );
            const after = line.after[id];
            return (
              <article
                key={id}
                id={`station-${id}`}
                className="m-ent-stage"
                data-i={index}
                data-mark={mark}
                aria-labelledby={`station-${id}-name`}
              >
                <header className="m-ent-stage-head">
                  <p className="m-ent-stage-where">
                    <span>{station.stop}</span>
                    {mark ? (
                      <span className="m-ent-flag">
                        {mark === 'start' ? hook.start : hook.next}
                      </span>
                    ) : null}
                  </p>
                  <h3 className="m-ent-stage-name" id={`station-${id}-name`}>
                    {station.name}
                  </h3>
                  {asks.length ? (
                    <ul className="m-ent-stage-asks">
                      {asks.map((item) => (
                        <li
                          key={item.id}
                          data-on={pick === item.id || undefined}
                        >
                          {item.short}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </header>

                <ul className="m-ent-acts">
                  {line.rows[id].flatMap((row, at) =>
                    lanes.flatMap((who) => {
                      const act = row[who];
                      return act ? (
                        <ActCard
                          key={`${at}-${who}`}
                          who={who}
                          act={act}
                          row={at}
                        />
                      ) : (
                        []
                      );
                    }),
                  )}
                </ul>

                <figure className="m-ent-leave">
                  <div className="m-ent-leave-card">
                    <Keep id={id} />
                  </div>
                  <figcaption className="m-ent-leave-text">
                    <span className="m-ent-who" data-who="leave">
                      {line.leaves}
                    </span>
                    <strong className="m-ent-leave-name">
                      {station.leaves.join('、')}
                    </strong>
                    {after ? (
                      <span className="m-ent-leave-after">{after}</span>
                    ) : null}
                    {id === 'build' ? (
                      <span className="m-ent-forms">
                        {path.forms.map((form) => (
                          <span
                            key={form}
                            data-hit={
                              pick === 'knowledge' && form === '知识助手'
                                ? ''
                                : undefined
                            }
                          >
                            {form}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              </article>
            );
          })}
        </div>

        {/* 钉住时才显出：走到第几站，点一下跳过去 */}
        <nav className="m-ent-line-dots" aria-label={path.title}>
          {stationIds.map((id) => (
            <button
              key={id}
              type="button"
              className="m-ent-line-dot"
              data-mark={markOf(id)}
              aria-label={`${path.stations[id].stop}：${path.stations[id].name}`}
              onClick={() => jumpTo.current?.(id)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
