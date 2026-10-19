'use client';
import { useEffect, useRef, type PointerEvent } from 'react';
import {
  enterprise,
  type Act,
  type StationId,
} from '../../../content/site/enterprise';
import type { Vars } from '../../_site/ui';
import { play } from './keeps';
import { Scene } from './scenes';

// 样张（D1）：合作路线四站排在一屏上，像展厅里并排的四面墙（负责人 2026-10-19：四站合到一屏，路线人人一样，不配对）。
// 每面墙一站，四种墙色同「关于」的展厅：顶上一段示意动画演这一站在做什么（scenes.tsx），
// 下面大字是这一站在路上的位置（开始前、一起做、核验、交接），小字是服务名；
// 再往下照原文的主语写分工——业务团队、Molis、一起，没有的不写，各墙按自己的长短排，不对齐留空；墙脚是这一站留下的东西。
// 事与成果都是 5.2 / 5.3 的原句片段。四段动画进屏后从左到右接力演一遍；鼠标移到哪面墙，那面墙重演。窄于 1000 时四面墙竖排。

const { path, line } = enterprise;
const stationIds = Object.keys(path.stations) as StationId[];
const roles = ['you', 'we', 'both'] as const;

/** 这一站某个角色做的事：同一个角色的几件事收在一组，没有的角色不写 */
const actsOf = (id: StationId, who: (typeof roles)[number]) =>
  line.rows[id].flatMap((row) => row[who] ?? []);

/** 鼠标移到墙上：这面墙的动画重演（触屏不触发） */
function replay(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return;
  const scene = event.currentTarget.querySelector('.m-scene');
  if (scene && !scene.hasAttribute('data-hold')) play(scene);
}

export function Stages() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const timers: number[] = [];
    const scenes = root.querySelectorAll('.m-scene');
    // 先停在第一帧（没有 JS 时看到的是演完的样子），进屏再接力演
    for (const scene of scenes) {
      scene.setAttribute('data-play', '');
      scene.setAttribute('data-hold', '');
    }
    const seen = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target);
        shown.forEach((node, index) => {
          seen.unobserve(node);
          timers.push(
            window.setTimeout(
              () => node.removeAttribute('data-hold'),
              250 + index * 900,
            ),
          );
        });
      },
      { threshold: 0.6 },
    );
    for (const scene of scenes) seen.observe(scene);
    return () => {
      seen.disconnect();
      for (const timer of timers) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="m-ent-bays-screen m-wrap">
      <div className="m-ent-bays" ref={ref}>
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
              onPointerEnter={replay}
            >
              <div className="m-ent-bay-scene">
                <Scene id={id} />
              </div>

              <header className="m-ent-bay-head">
                <p className="m-ent-bay-stop">{station.stop}</p>
                <h3 className="m-ent-bay-name" id={`station-${id}-name`}>
                  {station.name}
                </h3>
              </header>

              <div className="m-ent-bay-roles">
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
                            <span className="m-ent-bay-detail">
                              {act.detail}
                            </span>
                          ) : null}
                        </dd>
                      ))}
                    </dl>
                  );
                })}
              </div>

              {/* 墙脚：这一站留下的东西 */}
              <p className="m-ent-bay-keep">
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
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
