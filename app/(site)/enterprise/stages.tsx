'use client';
import { useEffect, useRef } from 'react';
import {
  enterprise,
  type Act,
  type StationId,
} from '../../../content/site/enterprise';
import { Keep, play } from './keeps';

// 样张（D1）：合作路线，像展厅里一间一间看过去，一站一页，共四页；路线人人一样，不随选过的问题变（负责人 2026-10-19 定：照原文，不配对）。
// 每页左边一面墙（四站四种墙色，同「关于」的展厅），挂着这一站留下的东西（keeps.tsx 的动画），墙角是展签；
// 右边是站名和一张分工表：业务团队做什么、Molis 做什么、一起做什么。事与成果都是 5.2 / 5.3 的原句片段。
//
// 宽屏（≥1000 宽、≥720 高）且不减少动态时，这一段钉在视口里，往下滚翻下一页，像画廊在同一个位置换一幅（常驻约束「同类内容同一种看法」）；
// 底下四个点是走到第几站，点一下翻过去。其余情况（手机、矮屏、减少动态、没有 JS）四页竖着排开。

const { path, line } = enterprise;
const stationIds = Object.keys(path.stations) as StationId[];
const count = stationIds.length;
const roles = ['you', 'we', 'both'] as const;

/** 分工表：同一个角色的事收在一行，顺序固定是业务团队、Molis、一起；没有的角色不写 */
function Roles({ id }: { id: StationId }) {
  const rows = roles.flatMap((who) => {
    const acts = line.rows[id].flatMap((row) => row[who] ?? []);
    return acts.length ? [{ who, acts }] : [];
  });
  return (
    <dl className="m-ent-roles">
      {rows.map(({ who, acts }) => (
        <div key={who} data-who={who}>
          <dt lang={who === 'we' ? 'en' : undefined}>{line.who[who]}</dt>
          {acts.map((act: Act) => (
            <dd key={act.text}>
              {act.text}
              {act.detail ? (
                <span className="m-ent-roles-detail">{act.detail}</span>
              ) : null}
            </dd>
          ))}
        </div>
      ))}
    </dl>
  );
}

export function Stages() {
  const ref = useRef<HTMLDivElement>(null);
  const jumpTo = useRef<((index: number) => void) | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const wide = matchMedia('(min-width: 1000px) and (min-height: 720px)');
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const pages = Array.from(root.querySelectorAll<HTMLElement>('.m-ent-page'));
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
        // 刚翻到的这一站：墙上的东西从头演一遍
        if (shown && !page.hasAttribute('data-shown'))
          play(page.querySelector('.m-ent-wall-art'));
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

    // 竖排时：每面墙上的东西第一次进入视口演一遍
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
      .querySelectorAll('.m-ent-wall-art')
      .forEach((node) => seen.observe(node));

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    wide.addEventListener('change', sync);
    still.addEventListener('change', sync);

    // 翻到第几页：钉住时滚到那一页的位置，否则直接跳过去
    jumpTo.current = (index: number) => {
      if (!live) {
        pages[index]?.scrollIntoView({ block: 'start' });
        return;
      }
      const top = root.getBoundingClientRect().top + window.scrollY;
      const span = root.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + span * ((index + 0.2) / count) });
    };

    return () => {
      if (frame) cancelAnimationFrame(frame);
      seen.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      wide.removeEventListener('change', sync);
      still.removeEventListener('change', sync);
      jumpTo.current = null;
    };
  }, []);

  return (
    <div className="m-ent-line" ref={ref}>
      <div className="m-ent-line-stick">
        <div className="m-ent-stages">
          {stationIds.map((id, index) => {
            const station = path.stations[id];
            const after = line.after[id];
            return (
              <article
                key={id}
                id={`station-${id}`}
                className="m-ent-page m-ent-stage"
                data-i={index}
                data-wall={id}
                aria-labelledby={`station-${id}-name`}
              >
                <div className="m-ent-stage-body">
                  <header className="m-ent-stage-head">
                    <p className="m-ent-stage-where">{station.stop}</p>
                    <h3 className="m-ent-stage-name" id={`station-${id}-name`}>
                      {station.name}
                    </h3>
                  </header>

                  <Roles id={id} />

                  {/* 墙：留下的东西挂在正中，墙角是展签 */}
                  <figure className="m-ent-wall">
                    <div className="m-ent-wall-art">
                      <Keep id={id} />
                    </div>
                    <figcaption className="m-ent-wall-label">
                      <span className="m-ent-wall-kicker">{line.leaves}</span>
                      <strong className="m-ent-wall-name">
                        {station.leaves.join('、')}
                      </strong>
                      {after ? (
                        <span className="m-ent-wall-after">{after}</span>
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
                </div>
              </article>
            );
          })}
        </div>

        {/* 钉住时才显出：走到第几站，点一下翻过去 */}
        <nav className="m-ent-line-dots" aria-label={path.kicker}>
          {stationIds.map((id, index) => (
            <button
              key={id}
              type="button"
              className="m-ent-line-dot"
              aria-label={path.stations[id].name}
              onClick={() => jumpTo.current?.(index)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
