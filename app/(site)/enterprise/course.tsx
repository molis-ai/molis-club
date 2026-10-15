'use client';
import { useEffect, useRef, type CSSProperties } from 'react';
import {
  enterprise,
  type StationId,
} from '../../../content/site/enterprise';
import { usePick } from './pick';

// 合作路线（企业合作页的标志性画面）：5.3 的三步在上，5.2 的四项服务是线上的四站，
// 每一站「留下」的东西放上路线下面那一格架子——走完，架子满了：把能力留在团队。
//
// 宽屏（≥1000 宽、≥760 高）且不减少动态时，路线钉在视口里：往下滚，点沿线走（--pin，useSiteMotion 写入），
// 走到哪站亮哪站、架子上落下哪一格。其余情况（手机、矮屏、减少动态、没有 JS）不钉住，
// 四站与整格架子都是完整的结果，手机上竖着排：第一步、第一站、第二步、第二站……
// 选过的问题在这里标出「建议起点」与「接着」。

const { path, hook } = enterprise;
const roman = ['I', 'II', 'III'];
const stationIds = Object.keys(path.stations) as StationId[];
/** 点走到最后一站时的进度；剩下一截留给架子落满后停一下 */
const END = 0.82;
const reachAt = (index: number) => (index / (stationIds.length - 1)) * END;

/** 同 ui.tsx 的 Phrases（这里是 client 文件，不把 ui.tsx 拉进来） */
function Phrases({ text }: { text: string }) {
  const parts = text.match(/[^，。、；！？：]+[，。、；！？：]?/g) ?? [text];
  return (
    <>
      {parts.map((part, index) => (
        <span key={index} className="m-phrase">
          {part}
        </span>
      ))}
    </>
  );
}

export function Route() {
  const context = usePick();
  const register = context?.register;
  const advice = context?.pick ? path.advice[context.pick] : null;
  const markOf = (id: StationId) =>
    advice?.start === id ? 'start' : advice?.next === id ? 'next' : undefined;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const wide = matchMedia('(min-width: 1000px) and (min-height: 760px)');
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const marks = Array.from(root.querySelectorAll<HTMLElement>('[data-i]'));
    let live = false;
    let step = -1;
    let frame = 0;

    const progress = () => {
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      return span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 1;
    };
    const paint = () => {
      frame = 0;
      if (!live) return;
      const pin = progress();
      const next = stationIds.filter((_, i) => pin >= reachAt(i) - 0.001)
        .length;
      if (next === step) return;
      step = next;
      root.dataset.step = String(step);
      for (const node of marks)
        node.toggleAttribute('data-ahead', Number(node.dataset.i) >= step);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const sync = () => {
      live = wide.matches && !still.matches;
      root.toggleAttribute('data-live', live);
      if (!live) {
        step = -1;
        delete root.dataset.step;
        for (const node of marks) node.removeAttribute('data-ahead');
      }
      request();
    };
    sync();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    wide.addEventListener('change', sync);
    still.addEventListener('change', sync);

    // 「看这一站」：钉住时滚到点走到这一站的位置，否则直接跳到这一站
    register?.((id) => {
      const index = stationIds.indexOf(id);
      if (!live) {
        document
          .getElementById(`station-${id}`)
          ?.scrollIntoView({ block: 'start' });
        return;
      }
      const top = root.getBoundingClientRect().top + window.scrollY;
      const span = root.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + span * (reachAt(index) + 0.03) });
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      wide.removeEventListener('change', sync);
      still.removeEventListener('change', sync);
      register?.(null);
    };
  }, [register]);

  return (
    <div
      className="m-ent-route"
      ref={ref}
      data-scene
      data-picked={advice ? '' : undefined}
    >
      <div className="m-ent-route-stick">
        <div className="m-ent-route-grid">
          {path.stages.map((stage, index) => (
            <div
              key={stage.title}
              className="m-ent-stage"
              data-stage={index}
              data-i={stationIds.indexOf(stage.stations[0])}
            >
              <span className="m-ent-roman" lang="en" aria-hidden="true">
                {roman[index]}
              </span>
              <h3 className="m-ent-stage-title">
                <Phrases text={stage.title} />
              </h3>
              <ul className="m-ent-keys">
                {stage.keys.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="m-ent-rail" aria-hidden="true">
            <span className="m-ent-rail-line" />
            <span className="m-ent-rail-fill" />
            {stationIds.map((id, index) => (
              <span
                key={id}
                className="m-ent-rail-stop"
                data-i={index}
                data-mark={markOf(id)}
                style={{ '--i': index } as CSSProperties}
              />
            ))}
            <span className="m-ent-rail-dot" />
          </div>

          {stationIds.map((id, index) => {
            const station = path.stations[id];
            const mark = markOf(id);
            return (
              <article
                key={id}
                id={`station-${id}`}
                className="m-ent-station"
                data-station={index}
                data-i={index}
                data-mark={mark}
                aria-labelledby={`station-${id}-name`}
              >
                <p className="m-ent-station-where">
                  <span className="m-ent-station-dot" aria-hidden="true" />
                  <span>{station.stop}</span>
                  {mark ? (
                    <span className="m-ent-flag">
                      {mark === 'start' ? hook.start : hook.next}
                    </span>
                  ) : null}
                </p>
                <h3 className="m-ent-station-name" id={`station-${id}-name`}>
                  {station.name}
                </h3>
                <dl className="m-ent-station-dl">
                  <div>
                    <dt>{path.labels.fit}</dt>
                    <dd>{station.fit}</dd>
                  </div>
                  <div>
                    <dt>{path.labels.does}</dt>
                    <dd>{station.does}</dd>
                  </div>
                </dl>
                {id === 'build' ? (
                  <ul className="m-ent-forms" aria-label="产品形态">
                    {path.forms.map((form) => (
                      <li
                        key={form}
                        data-hit={
                          context?.pick === 'knowledge' && form === '知识助手'
                            ? ''
                            : undefined
                        }
                      >
                        {form}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          })}

          <div className="m-ent-shelf">
            <p className="m-ent-shelf-title">{path.shelf}</p>
            <ol className="m-ent-shelf-slots">
              {stationIds.map((id, index) => (
                <li key={id} className="m-ent-slot" data-i={index}>
                  <span className="m-ent-slot-where">
                    {path.stations[id].stop}
                    {path.labels.leaves}
                  </span>
                  {path.stations[id].leaves.map((item, at) => (
                    <span
                      key={item}
                      className="m-ent-thing"
                      style={{ '--at': at } as CSSProperties}
                    >
                      {item}
                    </span>
                  ))}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
