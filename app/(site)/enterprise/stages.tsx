'use client';
import { useEffect, useRef } from 'react';
import {
  enterprise,
  type Act,
  type StationId,
} from '../../../content/site/enterprise';
import type { Vars } from '../../_site/ui';
import { Keep, play } from './keeps';

// 样张（D1）：合作路线四站排在一屏上，像展厅里并排的四面墙（负责人 2026-10-19：四站合到一屏，路线人人一样，不配对）。
// 每面墙一站，四种墙色同「关于」的展厅：顶上站名；中间三行分工——业务团队、Molis、一起；墙脚挂着这一站留下的东西（keeps.tsx 的动画）和展签。
// 四面墙的同一行对齐（CSS subgrid）：竖着读是这一站谁做什么，横着读是同一个角色从头到尾做什么。
// 事与成果都是 5.2 / 5.3 的原句片段。最左边一列行名只给眼睛看；每面墙里自己也写着角色名，读屏按站读。
// 墙一面面从左到右浮上来，墙脚的东西跟着一件件演一遍。窄于 1000 时四面墙竖排，角色名写回每一格。

const { path, line } = enterprise;
const stationIds = Object.keys(path.stations) as StationId[];
const roles = ['you', 'we', 'both'] as const;

/** 这一站某个角色做的事：同一个角色的几件事收在一格，没有的角色不写 */
const actsOf = (id: StationId, who: (typeof roles)[number]) =>
  line.rows[id].flatMap((row) => row[who] ?? []);

export function Stages() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const timers: number[] = [];
    // 一起进入视口的几件，从左到右隔一会儿演一遍
    const seen = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target);
        shown.forEach((node, index) => {
          seen.unobserve(node);
          timers.push(window.setTimeout(() => play(node), 300 + index * 380));
        });
      },
      { threshold: 0.5 },
    );
    root
      .querySelectorAll('.m-ent-bay-art')
      .forEach((node) => seen.observe(node));
    return () => {
      seen.disconnect();
      for (const timer of timers) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="m-ent-bays-screen m-wrap">
      <div className="m-ent-bays" ref={ref}>
        {/* 行名：只给眼睛看，每面墙里自己写着角色名 */}
        <div className="m-ent-bays-legend" aria-hidden="true">
          {roles.map((who) => (
            <span
              key={who}
              data-who={who}
              lang={who === 'we' ? 'en' : undefined}
            >
              {line.who[who]}
            </span>
          ))}
          <span data-who="leaves">{line.leaves}</span>
        </div>

        {stationIds.map((id, index) => {
          const station = path.stations[id];
          const after = line.after[id];
          return (
            <article
              key={id}
              id={`station-${id}`}
              className="m-ent-bay"
              data-wall={id}
              data-reveal
              style={{ '--delay': `${index * 120}ms` } as Vars}
              aria-labelledby={`station-${id}-name`}
            >
              <header className="m-ent-bay-head">
                <p className="m-ent-bay-stop">{station.stop}</p>
                <h3 className="m-ent-bay-name" id={`station-${id}-name`}>
                  {station.name}
                </h3>
              </header>

              {roles.map((who) => {
                const acts = actsOf(id, who);
                if (!acts.length) return null;
                return (
                  <dl key={who} className="m-ent-bay-role" data-who={who}>
                    <dt lang={who === 'we' ? 'en' : undefined}>
                      {line.who[who]}
                    </dt>
                    {acts.map((act: Act) => (
                      <dd key={act.text}>
                        {act.text}
                        {act.detail ? (
                          <span className="m-ent-bay-detail">{act.detail}</span>
                        ) : null}
                      </dd>
                    ))}
                  </dl>
                );
              })}

              {/* 墙脚：留下的东西，和一张展签 */}
              <figure className="m-ent-bay-keep">
                <div className="m-ent-bay-art">
                  <Keep id={id} />
                </div>
                <figcaption className="m-ent-bay-label">
                  <span className="m-ent-bay-kicker">{line.leaves}</span>
                  <strong className="m-ent-bay-leaves">
                    {station.leaves.join('、')}
                  </strong>
                  {after ? (
                    <span className="m-ent-bay-after">{after}</span>
                  ) : null}
                  {id === 'build' ? (
                    <span className="m-ent-forms">
                      {path.forms.map((form) => (
                        <span key={form}>{form}</span>
                      ))}
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            </article>
          );
        })}
      </div>
    </div>
  );
}
