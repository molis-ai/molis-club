'use client';
import { useEffect, useRef, type CSSProperties } from 'react';
import { enterprise, type StationId } from '../../../content/site/enterprise';
import { Keep, play, tilt, untilt } from './keeps';
import { usePick } from './pick';

// 合作路线（这一页的标志）：一条线上四站——开始前 · 一起做 · 核验 · 交接，是 5.2 的四项服务；
// 每站一句 5.3 里我们的约定。线下面是「留在团队手里」的架子：四张卡，各是一小段「做出来」的动画——
// 一页试点方案、一个能试用的小工具、一本问题记录、一叠检查清单与操作流程（keeps.tsx）。
// 走到哪站，那张卡亮起来、从头演一遍；还没走到的是虚线的空位。走完，架子摆满，那一句回来：能力，留在团队手里。
// 卡片会跟着鼠标轻轻倾斜、带一道反光；停上去重演一遍，上面的说明也换成那一站；点一下跳到那一站。
//
// 宽屏（≥1000 宽、≥720 高）且不减少动态时，路线钉在视口里：往下滚，点沿线走（--pin，useSiteMotion 写入），
// 走到哪站显出哪站、架子上落下哪一件。其余情况（手机、矮屏、减少动态、没有 JS）不钉住：
// 四站竖着排，后面是摆满的架子和那一句。在「你们卡在哪」选过问题的，对应那站标「建议起点」。

const { path, hook } = enterprise;
const stationIds = Object.keys(path.stations) as StationId[];
/** 点走到最后一站时的进度；剩下一截留给架子摆满后停一下 */
const END = 0.76;
const reachAt = (index: number) => (index / (stationIds.length - 1)) * END;
const pad = (n: number) => String(n).padStart(2, '0');

export function Route() {
  const context = usePick();
  const register = context?.register;
  const advice = context?.pick ? path.advice[context.pick] : null;
  const markOf = (id: StationId) =>
    advice?.start === id ? 'start' : advice?.next === id ? 'next' : undefined;
  const ref = useRef<HTMLDivElement>(null);
  /** 点架子上的卡：跳到那一站（效果里填上，钉住与否走法不同） */
  const jumpTo = useRef<((id: StationId) => void) | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const wide = matchMedia('(min-width: 1000px) and (min-height: 720px)');
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const marks = Array.from(root.querySelectorAll<HTMLElement>('[data-i]'));
    let live = false;
    let step = -1;
    let done = false;
    let frame = 0;
    /** 鼠标停在架子上哪张卡：站点那一格先显出那一站（离开架子回到滚动走到的那一站） */
    let peek: number | null = null;

    const show = () => {
      const shown = live ? (peek ?? (done ? -1 : step - 1)) : -1;
      root.toggleAttribute('data-peek', live && peek !== null);
      for (const node of marks)
        node.toggleAttribute('data-shown', Number(node.dataset.i) === shown);
    };

    const progress = () => {
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      return span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 1;
    };
    const paint = () => {
      frame = 0;
      if (!live) return;
      const pin = progress();
      const next = Math.max(
        1,
        stationIds.filter((_, i) => pin >= reachAt(i) - 0.001).length,
      );
      const end = pin >= END + 0.08;
      if (next === step && end === done) return;
      step = next;
      done = end;
      root.dataset.step = String(step);
      root.toggleAttribute('data-done', done);
      for (const node of marks) {
        const index = Number(node.dataset.i);
        const current = index === step - 1 && !done;
        // 刚走到的这一站：架子上那张卡从头演一遍
        if (current && !node.hasAttribute('data-current'))
          play(node.querySelector('.m-keep'));
        node.toggleAttribute('data-ahead', index >= step);
        node.toggleAttribute('data-current', current);
      }
      show();
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const sync = () => {
      live = wide.matches && !still.matches;
      root.toggleAttribute('data-live', live);
      if (!live) {
        step = -1;
        done = false;
        delete root.dataset.step;
        root.removeAttribute('data-done');
        peek = null;
        for (const node of marks) {
          node.removeAttribute('data-ahead');
          node.removeAttribute('data-current');
        }
        show();
      }
      request();
    };
    sync();
    // 不钉住时：每张卡第一次进入视口演一遍
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
    root.querySelectorAll('.m-keep').forEach((node) => seen.observe(node));

    // 停在（或用键盘移到）架子上的一张卡：上面换成那一站的说明；离开架子就回来
    const keeps = Array.from(root.querySelectorAll<HTMLElement>('.m-keep'));
    const shelf = root.querySelector<HTMLElement>('.m-ent-shelf-slots');
    const enter = (event: Event) => {
      const slot = (event.currentTarget as HTMLElement).closest<HTMLElement>(
        '[data-i]',
      );
      if (!live || !slot) return;
      peek = Number(slot.dataset.i);
      show();
    };
    const leave = () => {
      if (peek === null) return;
      peek = null;
      show();
    };
    for (const keep of keeps) {
      keep.addEventListener('pointerenter', enter);
      keep.addEventListener('focus', enter);
      keep.addEventListener('blur', leave);
    }
    shelf?.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    wide.addEventListener('change', sync);
    still.addEventListener('change', sync);

    // 「看看这条路怎么走」与点架子上的卡：钉住时滚到点走到这一站的位置，否则直接跳到这一站
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
      window.scrollTo({ top: top + span * (reachAt(index) + 0.02) });
    };
    register?.(go);
    jumpTo.current = go;

    return () => {
      if (frame) cancelAnimationFrame(frame);
      seen.disconnect();
      for (const keep of keeps) {
        keep.removeEventListener('pointerenter', enter);
        keep.removeEventListener('focus', enter);
        keep.removeEventListener('blur', leave);
      }
      shelf?.removeEventListener('pointerleave', leave);
      jumpTo.current = null;
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
        <div className="m-ent-rail" aria-hidden="true">
          <span className="m-ent-rail-line" />
          <span className="m-ent-rail-fill" />
          <span className="m-ent-rail-dot" />
          {stationIds.map((id, index) => {
            const mark = markOf(id);
            return (
              <span
                key={id}
                className="m-ent-rail-stop"
                data-i={index}
                data-mark={mark}
                style={{ '--i': index } as CSSProperties}
              >
                <span className="m-ent-rail-where">
                  {path.stations[id].stop}
                </span>
                {mark ? (
                  <span className="m-ent-flag">
                    {mark === 'start' ? hook.start : hook.next}
                  </span>
                ) : null}
              </span>
            );
          })}
        </div>

        <div className="m-ent-stations">
          {stationIds.map((id, index) => {
            const station = path.stations[id];
            const mark = markOf(id);
            return (
              <article
                key={id}
                id={`station-${id}`}
                className="m-ent-station"
                data-i={index}
                data-mark={mark}
                aria-labelledby={`station-${id}-name`}
              >
                <div className="m-ent-station-head">
                  <p className="m-ent-station-where">
                    <span className="num" lang="en">
                      {pad(index + 1)}
                    </span>
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
                </div>
                <div className="m-ent-station-body">
                  <dl className="m-ent-station-dl">
                    <div>
                      <dt>{path.labels.fit}</dt>
                      <dd>{station.fit}</dd>
                    </div>
                    <div>
                      <dt>{path.labels.does}</dt>
                      <dd>
                        {station.does}
                        {id === 'build' ? (
                          <span className="m-ent-forms">
                            {path.forms.map((form) => (
                              <span
                                key={form}
                                data-hit={
                                  context?.pick === 'knowledge' &&
                                  form === '知识助手'
                                    ? ''
                                    : undefined
                                }
                              >
                                {form}
                              </span>
                            ))}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                    <div data-kind="promise">
                      <dt>{path.promiseLabel}</dt>
                      <dd>{station.promise}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>

        <div className="m-ent-shelf">
          <p className="m-ent-shelf-title">{path.shelf}</p>
          <ol className="m-ent-shelf-slots">
            {stationIds.map((id, index) => (
              <li
                key={id}
                className="m-ent-slot"
                data-i={index}
                style={{ '--i': index } as CSSProperties}
              >
                <button
                  type="button"
                  className="m-keep"
                  aria-label={`${path.stations[id].stop}：${path.stations[id].leaves.join('、')}`}
                  onPointerEnter={(event) => play(event.currentTarget)}
                  onPointerMove={tilt}
                  onPointerLeave={untilt}
                  onClick={() => jumpTo.current?.(id)}
                >
                  <Keep id={id} />
                  <span className="m-keep-name">
                    {path.stations[id].leaves.join(' · ')}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        {/* 钉住时压在站点那一格上，架子摆满才出现；竖排时在架子后面 */}
        <p className="m-ent-route-end">{path.end}</p>
      </div>
    </div>
  );
}
