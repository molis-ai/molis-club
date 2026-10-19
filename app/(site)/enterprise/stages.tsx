'use client';
import { useEffect, useRef, type PointerEvent } from 'react';
import { enterprise, type StationId } from '../../../content/site/enterprise';
import { Phrases, type Vars } from '../../_site/ui';
import { Keep, play } from './keeps';

// 我们怎样开展合作（负责人 2026-10-19 重排细节，又从用户视角复看过一遍）：仍在一屏里。
// 上面一行标题（5.3 原文）与 5.2 开头那句：可以从一项具体服务开始，也可以组合——不让人以为非得四步走完。
// 四项服务各是一张竖着的白卡，列名是那句里的四个词：诊断、共建、评估、培训，下面一小行是服务全名。
// 卡里三条道：业务团队（淡淡的月白）、一起（白，夹在两条道中间）、Molis（淡淡的杏色），卡底是这项服务的产出。
// 角色名与「产出」只在最左边写一次，每件事前面一颗圆点：业务团队墨色、Molis 杏色、一起是墨色与杏色叠在一起。
// 底色压淡、卡与卡之间留缝，眼睛先竖着读一项服务，再横着比三个角色。
// 产出由动画演出来（keeps.tsx 的四件东西：试点方案、能试用的小工具、问题记录、一叠清单与流程）：
// 每张卡进入视口后，几件事的圆点依次点一下，接着卡底的产出从头「做出来」；宽屏上四张卡一张接一张，鼠标移到哪张，那张重演。
// 静止就是做好的样子（没有 JS、减少动态都看这一帧）。窄于 1000 时两张一排、窄于 640 一张一排，角色名与「产出」写在卡里。

const { path, line } = enterprise;
const stationIds = Object.keys(path.stations) as StationId[];
const roles = ['you', 'both', 'we'] as const;
/** 最左边那一列：三个角色，再加一行产出 */
const rows = [...roles, 'output'] as const;
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
      <header className="m-ent-flow-head" data-reveal>
        <h2 className="m-ent-flow-title" id="ent-flow-title">
          {path.title}
        </h2>
        <p className="m-ent-flow-lead">
          <Phrases text={path.lead} />
        </p>
      </header>
      <div className="m-ent-flow-grid" ref={ref}>
        {/* 角色名与「产出」只在最左边写一次（读屏在每张卡里另有） */}
        <div className="m-ent-flow-who" aria-hidden="true">
          {rows.map((row) => (
            <p key={row} className="m-ent-who" data-who={row}>
              {row === 'output' ? null : <i className="m-ent-mark" />}
              <span lang={row === 'we' ? 'en' : undefined}>
                {row === 'output' ? line.output : line.who[row]}
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
                  {station.word}
                </h3>
                <p className="m-ent-stop-service">{station.name}</p>
              </header>

              {roles.map((who) => {
                const acts = actsOf(id, who);
                // 前面几道里已经有几件事：圆点按整张卡的顺序依次点
                const before = roles
                  .slice(0, roles.indexOf(who))
                  .reduce((sum, role) => sum + actsOf(id, role).length, 0);
                return (
                  <div key={who} className="m-ent-lane" data-who={who}>
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
