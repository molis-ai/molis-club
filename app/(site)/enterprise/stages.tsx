'use client';
import { useEffect, useRef, type PointerEvent } from 'react';
import { enterprise, type StationId } from '../../../content/site/enterprise';
import type { Vars } from '../../_site/ui';
import { Keep, play } from './keeps';

// 合作路线（负责人 2026-10-19 重排细节）：四站竖着排成四列，三个角色横着排成三条道，仍在一屏里。
// 上面一条是业务团队（月白，冷），下面一条是 Molis（一层极淡的杏色，暖），「一起」夹在两条道的接缝上：
// 那一行的底色上半是月白、下半是杏色，一起做的事写在白卡上，压在接缝正中——两边各出一半。
// 角色名只在最左边写一次，每件事前面一颗圆点：业务团队墨色、Molis 杏色、一起是墨色与杏色叠在一起。
// 每件事只留主句（补充说明不再上页面）；字号拉开三档：站名大、事情中、角色与产出小。
// 「留下」改成「产出」，由动画来体现（keeps.tsx 的四件东西：试点方案、能试用的小工具、问题记录、一叠清单与流程）：
// 整屏进入视口后从左到右一站一站走：这一站的几件事依次点一下圆点，接着底下的产出从头「做出来」；鼠标移到哪一站，那一站重演。
// 静止就是做好的样子（没有 JS、减少动态都看这一帧）。窄于 1000 时四站竖着排，每站里三条道上下排、角色名写在道里。

const { path, line } = enterprise;
const stationIds = Object.keys(path.stations) as StationId[];
const roles = ['you', 'both', 'we'] as const;
type Role = (typeof roles)[number];

/** 这一站某个角色做的事；没有的角色留空 */
const actsOf = (id: StationId, who: Role) =>
  line.rows[id].flatMap((row) => row[who] ?? []);

/** 一站走多久（毫秒）：几件事点完，再演产出 */
const STEP = 1300;

/** 这一站演一遍：几件事的圆点依次点一下，同时底下的产出从头做出来 */
function run(station: Element) {
  station.removeAttribute('data-on');
  void (station as HTMLElement).offsetWidth;
  station.setAttribute('data-on', '');
  const art = station.querySelector('.m-keep-art');
  // 第一次：停在第一帧等着的那段放开；之后每次倒回开头重放
  if (art?.hasAttribute('data-hold')) art.removeAttribute('data-hold');
  else play(art);
}

/** 鼠标移到一站：这一站重演（触屏不触发） */
function replay(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  run(event.currentTarget);
}

export function Stages() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timers: number[] = [];
    const stations = Array.from(root.querySelectorAll('.m-ent-stop'));
    // 产出先停在第一帧（没有 JS 时看到的是做好的样子），进屏再一站一站走
    for (const station of stations) {
      const art = station.querySelector('.m-keep-art');
      art?.setAttribute('data-play', '');
      art?.setAttribute('data-hold', '');
    }
    // 每站各自进屏各自演；同时进屏的（宽屏上四站一起）排队，一站接一站
    let free = 0;
    const seen = new IntersectionObserver(
      (entries) => {
        const now = performance.now();
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          seen.unobserve(entry.target);
          const start = Math.max(now + 200, free);
          free = start + STEP;
          timers.push(window.setTimeout(() => run(entry.target), start - now));
        }
      },
      { threshold: 0.4 },
    );
    for (const station of stations) seen.observe(station);
    return () => {
      seen.disconnect();
      for (const timer of timers) clearTimeout(timer);
    };
  }, []);

  return (
    <section
      className="m-ent-flow m-wrap"
      id="path"
      aria-labelledby="ent-flow-title"
    >
      <h2 className="sr-only" id="ent-flow-title">
        {path.title}
      </h2>
      <div className="m-ent-flow-grid" ref={ref}>
        {/* 角色名只在最左边写一次（读屏在每站里另有角色名） */}
        <div className="m-ent-flow-who" aria-hidden="true">
          {roles.map((who) => (
            <p key={who} className="m-ent-who" data-who={who}>
              <i className="m-ent-mark" />
              <span lang={who === 'we' ? 'en' : undefined}>
                {line.who[who]}
              </span>
            </p>
          ))}
        </div>

        {stationIds.map((id, index) => {
          const station = path.stations[id];
          return (
            <article
              key={id}
              id={`station-${id}`}
              className="m-ent-stop"
              data-reveal
              style={{ '--delay': `${index * 110}ms` } as Vars}
              aria-labelledby={`station-${id}-name`}
              onPointerEnter={replay}
            >
              <header className="m-ent-stop-head">
                <h3 className="m-ent-stop-name" id={`station-${id}-name`}>
                  {station.stop}
                </h3>
                <p className="m-ent-stop-service">{station.name}</p>
              </header>

              {roles.map((who) => {
                const acts = actsOf(id, who);
                // 前面几道里已经有几件事：圆点按整站的顺序依次点
                const before = roles
                  .slice(0, roles.indexOf(who))
                  .reduce((sum, role) => sum + actsOf(id, role).length, 0);
                return (
                  <div key={who} className="m-ent-lane" data-who={who}>
                    {acts.length ? (
                      <>
                        <p className="m-ent-lane-who">
                          <i className="m-ent-mark" aria-hidden="true" />
                          <span lang={who === 'we' ? 'en' : undefined}>
                            {line.who[who]}
                          </span>
                        </p>
                        <ul className="m-ent-acts">
                          {acts.map((act, at) => (
                            <li
                              key={act.text}
                              className="m-ent-act"
                              style={{ '--k': before + at } as Vars}
                            >
                              <i className="m-ent-mark" aria-hidden="true" />
                              {act.text}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </div>
                );
              })}

              {/* 产出：动画演它被做出来，下面一小行写它是什么 */}
              <figure className="m-ent-output">
                <Keep id={id} />
                <figcaption>
                  <span className="m-ent-output-kicker">{line.output}</span>
                  <span className="m-ent-output-name">
                    {station.leaves.join('、')}
                  </span>
                </figcaption>
              </figure>
            </article>
          );
        })}
      </div>
    </section>
  );
}
