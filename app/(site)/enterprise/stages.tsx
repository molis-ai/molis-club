'use client';
import { useEffect, useRef, type PointerEvent } from 'react';
import { enterprise, type StationId } from '../../../content/site/enterprise';
import { Phrases, type Vars } from '../../_site/ui';
import { play } from './keeps';
import { Scene } from './scenes';

// 我们怎样开展合作（负责人 2026-10-19：方向对了，视觉再舒服一点）：仍在一屏里，切成三部分，重点在第一部分。
// 上面一行标题（5.3 原文）与 5.2 开头那句：可以从一项具体服务开始，也可以组合——不让人以为非得四步走完。
// ① 四张并排的卡：每项服务一段示意动画演它在干什么（scenes.tsx），下面是列名（诊断、共建、评估、培训，5.2 开头那句里的词）与服务全名；
// ② 双方分别做什么：一块浅底，业务团队、一起、Molis 三行，字小一档；
// ③ 每项服务的产出：一行，字小一档。
// 角色名与「产出」只在最左边写一次，每件事前面一颗圆点：业务团队墨色、Molis 杏色、一起是墨色与杏色叠在一起。
// 四段动画进屏后从左到右接力演一遍；鼠标移到哪一列，那一列的动画重演，别的列的 ②③ 退淡一点，好顺着一列往下读。
// 静止就是演完的样子（没有 JS、减少动态都看这一帧）。窄于 1000 时两列一排、窄于 640 一列一排，角色名与「产出」写在列里。

const { path, line } = enterprise;
const stationIds = Object.keys(path.stations) as StationId[];
const roles = ['you', 'both', 'we'] as const;
type Role = (typeof roles)[number];
/** 最左边那一列：三个角色，再加一行产出 */
const rows = [...roles, 'output'] as const;

/** 这一列某个角色做的事 */
const actsOf = (id: StationId, who: Role) =>
  line.rows[id].flatMap((row) => row[who] ?? []);

/** 四段动画接力：后一段比前一段晚多久开始（毫秒） */
const STEP = 900;

/** 这一列的动画演一遍：第一次放开停在第一帧的那段，之后倒回开头重放 */
function run(station: Element) {
  const scene = station.querySelector('.m-scene');
  if (scene?.hasAttribute('data-hold')) scene.removeAttribute('data-hold');
  else play(scene);
}

/** 鼠标移到一列：这一列的动画重演（触屏不触发） */
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
    // 动画先停在第一帧（没有 JS 时看到的是演完的样子），卡进屏再演
    for (const station of stations) {
      const scene = station.querySelector('.m-scene');
      scene?.setAttribute('data-play', '');
      scene?.setAttribute('data-hold', '');
    }
    // 每张卡各自进屏各自演；同时进屏的（宽屏上四张一起）排队，一张接一张
    let free = 0;
    const seen = new IntersectionObserver(
      (entries) => {
        const now = performance.now();
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          seen.unobserve(entry.target);
          const start = Math.max(now + 200, free);
          free = start + STEP;
          const station = entry.target.closest('.m-ent-stop');
          if (station)
            timers.push(window.setTimeout(() => run(station), start - now));
        }
      },
      { threshold: 0.6 },
    );
    for (const station of stations) {
      const card = station.querySelector('.m-ent-stop-card');
      if (card) seen.observe(card);
    }
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
        {/* ② 那块浅底：铺在三行分工后面 */}
        <div className="m-ent-flow-panel" aria-hidden="true" />
        {/* 角色名与「产出」只在最左边写一次（读屏在每一列里另有） */}
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
              data-wall={id}
              data-reveal
              style={{ '--delay': `${index * 110}ms` } as Vars}
              aria-labelledby={`station-${id}-name`}
              onPointerEnter={replay}
            >
              {/* ① 卡：动画演这项服务在干什么，下面是列名与服务全名 */}
              <div className="m-ent-stop-card">
                <div className="m-ent-stop-scene">
                  <Scene id={id} />
                </div>
                <header className="m-ent-stop-head">
                  <h3 className="m-ent-stop-name" id={`station-${id}-name`}>
                    {station.word}
                  </h3>
                  <p className="m-ent-stop-service">{station.name}</p>
                </header>
              </div>

              {/* ② 双方分别做什么 */}
              {roles.map((who) => (
                <div key={who} className="m-ent-lane" data-who={who}>
                  <p className="m-ent-lane-who">
                    <i className="m-ent-mark" aria-hidden="true" />
                    <span lang={who === 'we' ? 'en' : undefined}>
                      {line.who[who]}
                    </span>
                  </p>
                  <ul className="m-ent-acts">
                    {actsOf(id, who).map((act) => (
                      <li key={act.text} className="m-ent-act">
                        <i className="m-ent-mark" aria-hidden="true" />
                        {act.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* ③ 产出 */}
              <p className="m-ent-output">
                <span className="m-ent-output-kicker">{line.output}</span>
                <span className="m-ent-output-name">
                  {station.leaves.join('、')}
                </span>
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
