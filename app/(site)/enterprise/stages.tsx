'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import {
  enterprise,
  type Act,
  type QuestionId,
  type StationId,
} from '../../../content/site/enterprise';
import { Keep, play } from './keeps';
import { usePick } from './pick';

// 样张（D1）：「你们卡在哪」和合作路线合成一段，像展厅里一间一间看过去，共五页：
// 第 1 页是五张问题纸条（cover，pick.tsx 的 Slips）；后四页各是一站——
// 顶上一条「你们卡在」：五个问题都在，这一站对应的那几个亮起来，选过的那个铺杏色，点哪个就翻到它对应的那一站；
// 左边一面墙（四站四种墙色，同「关于」的展厅），挂着这一站留下的东西（keeps.tsx 的动画），墙角是展签；
// 右边是站名和一张分工表：业务团队做什么、Molis 做什么、一起做什么。事与成果都是 5.2 / 5.3 的原句片段。
// 问题与站的对应是新写的（path.advice，负责人 2026-10-18 确认），只说对应，不说「起点」。
//
// 宽屏（≥1000 宽、≥720 高）且不减少动态时，这一段钉在视口里，往下滚翻下一页，像画廊在同一个位置换一幅（常驻约束「同类内容同一种看法」）；
// 底下五个点是走到第几页，点一下翻过去。其余情况（手机、矮屏、减少动态、没有 JS）五页竖着排开。

const { path, line, questions, hook } = enterprise;
const stationIds = Object.keys(path.stations) as StationId[];
/** 第 0 页是问题纸条，后面是四站 */
const count = stationIds.length + 1;
const roles = ['you', 'we', 'both'] as const;

/** 这个问题对应哪几站 */
const stationsOf = (id: QuestionId) =>
  [path.advice[id].start, path.advice[id].next].filter(
    (station): station is StationId => Boolean(station),
  );

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

export function Stages({ cover }: { cover: ReactNode }) {
  const context = usePick();
  const register = context?.register;
  const pick = context?.pick ?? null;
  const picked = pick ? stationsOf(pick) : [];
  const ref = useRef<HTMLDivElement>(null);
  const jumpTo = useRef<((index: number) => void) | null>(null);

  /** 点「你们卡在」里的一个问题：选定它，翻到它对应的第一站 */
  const choose = (id: QuestionId) => {
    context?.setPick(id);
    jumpTo.current?.(stationIds.indexOf(path.advice[id].start) + 1);
  };

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
    const turn = (index: number) => {
      if (!live) {
        pages[index]?.scrollIntoView({ block: 'start' });
        return;
      }
      const top = root.getBoundingClientRect().top + window.scrollY;
      const span = root.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + span * ((index + 0.2) / count) });
    };
    // 问题纸条下的「看看这条路怎么走」：翻到这一站
    register?.((id) => turn(stationIds.indexOf(id) + 1));
    jumpTo.current = turn;

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
    <div className="m-ent-line" ref={ref}>
      <div className="m-ent-line-stick">
        <div className="m-ent-stages">
          <section
            className="m-ent-page m-ent-cover"
            id="where"
            aria-labelledby="ent-where-title"
          >
            {cover}
          </section>

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
                {/* 你们卡在：五个问题都在，这一站对应的亮起来 */}
                <div className="m-ent-strip">
                  <span className="m-ent-strip-label">{line.stuck}</span>
                  <ul>
                    {questions.items.map((item) => {
                      const lit = stationsOf(item.id).includes(id);
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            data-lit={lit || undefined}
                            aria-pressed={pick === item.id}
                            onClick={() => choose(item.id)}
                          >
                            {lit ? (
                              <span className="sr-only">{line.lit}</span>
                            ) : null}
                            {item.short}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

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
                </div>
              </article>
            );
          })}
        </div>

        {/* 钉住时才显出：走到第几页，点一下翻过去；选过问题的，对应那几站是杏色 */}
        <nav className="m-ent-line-dots" aria-label={hook.ask}>
          {[hook.ask, ...stationIds.map((id) => path.stations[id].name)].map(
            (label, index) => (
              <button
                key={label}
                type="button"
                className="m-ent-line-dot"
                data-mark={
                  index > 0 && picked.includes(stationIds[index - 1])
                    ? ''
                    : undefined
                }
                aria-label={label}
                onClick={() => jumpTo.current?.(index)}
              />
            ),
          )}
        </nav>
      </div>
    </div>
  );
}
