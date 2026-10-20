'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  enterprise,
  type MemberId,
  type View,
} from '../../../content/site/enterprise';
import { TEAM } from '../../_site/routes';
import { More, Phrases, type Vars } from '../../_site/ui';

// 为什么我们可以（负责人 2026-10-20 第三版：沿用上一屏「从左到右一本本打开」的交互，让人知道这一屏接着上一屏；
// 重点讲为什么我们可以——把每个位置的目标、要用到的能力、团队里谁有这项能力，组合成一段会动的图）。
// 四个位置（5.5 导语原词：业务目标、产品体验、工程实现、使用者的处境）像上一屏的四本书一样并排，
// 合着时是一条窄脊：编号、竖排的位置名，底下是这个位置上的成员（姓氏小圆章）；往下滚一块一块打开。
// 打开的那一面从右往左读成一句话：要达成的（5.5 小标题）← 用到的能力 ← 团队里谁有（名字和第 7 章经历压成的一行）。
// 打开时先亮目标，能力一个个浮上来、连到目标，成员从左边进来、连到自己的能力。
// 鼠标停在一个人身上，只亮他的能力和连线；停在一项能力上，只亮有这项能力的人；每个人下面写着他还在哪些位置——能力是相通的。
// 能力是从成员自述里推断的（负责人 2026-10-20 让大胆推断，由负责人判断），见 content/site/enterprise.ts。
// 「不代表固定分工、不是客户项目」那句常驻页脚，旁边是导语第二句。
// 宽屏（≥1000 宽、≥600 高）有 JS 时才钉住；手机、矮屏、没有 JS 时四个位置上下排，每个位置里目标、能力、成员上下排，不画连线。

const { why } = enterprise;
const VIEWS = why.views;
const PANELS = VIEWS.length;
const number = (index: number) => String(index + 1).padStart(2, '0');
/** 这个位置上的成员，按第一次出现的顺序 */
const crew = (view: View) => [
  ...new Set(view.skills.flatMap((skill) => skill.who)),
];
/** 这位成员还在哪些位置 */
const elsewhere = (id: MemberId, self: number) =>
  VIEWS.filter((view, i) => i !== self && crew(view).includes(id)).map(
    (view) => view.label,
  );

type Wire = {
  d: string;
  /** 人连到能力：是谁；能力连到目标：没有 */
  who?: MemberId;
  skill: number;
  n: number;
};
type Focus = { who: MemberId } | { skill: number } | null;

/** 打开的那一面：要达成的 ← 用到的能力 ← 团队里谁有 */
function Graph({ view, index }: { view: View; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [wires, setWires] = useState<Wire[]>([]);
  const [focus, setFocus] = useState<Focus>(null);
  const people = crew(view);

  // 量出每张卡在图里的位置（offset 不算动画里的位移），画连线
  const measure = useCallback(() => {
    const root = ref.current;
    if (!root) return;
    const at = (node: Element | null) => {
      if (!(node instanceof HTMLElement)) return null;
      return {
        left: node.offsetLeft,
        right: node.offsetLeft + node.offsetWidth,
        y: node.offsetTop + node.offsetHeight / 2,
      };
    };
    const goal = at(root.querySelector('[data-goal]'));
    if (!goal) return;
    const curve = (x1: number, y1: number, x2: number, y2: number) => {
      const mid = (x1 + x2) / 2;
      return `M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
    };
    const next: Wire[] = [];
    let n = 0;
    /** 同一个点上进出的几根线，上下错开 */
    const fan = (k: number, count: number) => (k - (count - 1) / 2) * 7;
    const out = new Map<MemberId, number>();
    const outCount = (who: MemberId) =>
      view.skills.filter((skill) => skill.who.includes(who)).length;
    view.skills.forEach((skill, i) => {
      const chip = at(root.querySelector(`[data-skill="${i}"]`));
      if (!chip) return;
      const spread = (i - (view.skills.length - 1) / 2) * 10;
      next.push({
        d: curve(chip.right, chip.y, goal.left, goal.y + spread),
        skill: i,
        n: i,
      });
      skill.who.forEach((who, k) => {
        const person = at(root.querySelector(`[data-person="${who}"]`));
        if (!person) return;
        const from = out.get(who) ?? 0;
        out.set(who, from + 1);
        next.push({
          d: curve(
            person.right,
            person.y + fan(from, outCount(who)),
            chip.left,
            chip.y + fan(k, skill.who.length) * 0.6,
          ),
          who,
          skill: i,
          n: n++,
        });
      });
    });
    setWires(next);
    setSize({ w: root.offsetWidth, h: root.offsetHeight });
  }, [view]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    measure();
    const watch = new ResizeObserver(measure);
    watch.observe(root);
    return () => watch.disconnect();
  }, [measure]);

  const skillLit = (i: number) =>
    !focus ||
    ('skill' in focus
      ? focus.skill === i
      : view.skills[i].who.includes(focus.who));
  const personLit = (id: MemberId) =>
    !focus ||
    ('who' in focus
      ? focus.who === id
      : view.skills[focus.skill].who.includes(id));
  const wireLit = (wire: Wire) => {
    if (!focus) return true;
    if ('skill' in focus) return wire.skill === focus.skill;
    return wire.who
      ? wire.who === focus.who
      : view.skills[wire.skill].who.includes(focus.who);
  };
  const dim = (lit: boolean) => (lit ? undefined : '');

  return (
    <div
      ref={ref}
      className="m-why-graph"
      data-focus={focus ? '' : undefined}
      onPointerLeave={() => setFocus(null)}
    >
      {size.w ? (
        <svg
          className="m-why-wires"
          viewBox={`0 0 ${size.w} ${size.h}`}
          width={size.w}
          height={size.h}
          aria-hidden="true"
        >
          {wires.map((wire) => (
            <path
              key={`${wire.who ?? 'goal'}-${wire.skill}`}
              className="m-why-wire"
              data-to={wire.who ? 'skill' : 'goal'}
              data-dim={dim(wireLit(wire))}
              style={{ '--n': wire.n } as Vars}
              pathLength={1}
              d={wire.d}
            />
          ))}
        </svg>
      ) : null}

      {/* 团队里谁有 */}
      <div className="m-why-col" data-col="who">
        <p className="m-why-col-head">{why.columns.who}</p>
        <ul className="m-why-people">
          {people.map((id, n) => {
            const member = why.members[id];
            const also = elsewhere(id, index);
            return (
              <li key={id}>
                <button
                  type="button"
                  className="m-why-person"
                  data-person={id}
                  data-dim={dim(personLit(id))}
                  style={{ '--n': n } as Vars}
                  aria-pressed={
                    focus !== null && 'who' in focus && focus.who === id
                  }
                  onPointerEnter={() => setFocus({ who: id })}
                  onFocus={() => setFocus({ who: id })}
                  onBlur={() => setFocus(null)}
                >
                  <span className="m-why-seal" aria-hidden="true">
                    {member.name.slice(0, 1)}
                  </span>
                  <span className="m-why-person-text">
                    <span className="m-why-person-top">
                      <b>{member.name}</b>
                      {also.length ? (
                        <span className="m-why-also">
                          也在
                          {also.map((label) => (
                            <i key={label}>{label}</i>
                          ))}
                        </span>
                      ) : null}
                    </span>
                    <span className="m-why-brief">{member.brief}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 用到的能力 */}
      <div className="m-why-col" data-col="skills">
        <p className="m-why-col-head">{why.columns.skills}</p>
        <ul className="m-why-skills">
          {view.skills.map((skill, i) => (
            <li key={skill.name}>
              <button
                type="button"
                className="m-why-skill"
                data-skill={i}
                data-dim={dim(skillLit(i))}
                style={{ '--n': i } as Vars}
                aria-pressed={
                  focus !== null && 'skill' in focus && focus.skill === i
                }
                onPointerEnter={() => setFocus({ skill: i })}
                onFocus={() => setFocus({ skill: i })}
                onBlur={() => setFocus(null)}
              >
                {skill.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 要达成的 */}
      <div className="m-why-col" data-col="goal">
        <p className="m-why-col-head">{why.columns.goal}</p>
        <div className="m-why-goal" data-goal="">
          <p className="m-why-goal-label">{view.label}</p>
          <h3 className="m-why-goal-title" id={`why-${view.id}`}>
            <Phrases text={view.title} />
          </h3>
        </div>
      </div>
    </div>
  );
}

export function Why() {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(0);

  // 宽屏才钉住；钉住时按滚动走到哪一块
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const wide = matchMedia('(min-width: 1000px) and (min-height: 600px)');
    let frame = 0;
    const read = () => {
      frame = 0;
      if (!wide.matches) return;
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const pin = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      setActive(Math.min(PANELS - 1, Math.floor(pin * PANELS)));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const sync = () => {
      setLive(wide.matches);
      request();
    };
    sync();
    wide.addEventListener('change', sync);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      wide.removeEventListener('change', sync);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);

  /** 点一块合着的：滚到它那一拍的正中 */
  const go = useCallback((index: number) => {
    const root = ref.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    const top = window.scrollY + rect.top + ((index + 0.5) / PANELS) * span;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: still ? 'auto' : 'smooth' });
  }, []);

  return (
    <section
      ref={ref}
      className="m-ent-why"
      id="people"
      data-live={live || undefined}
      aria-labelledby="ent-why-title"
      style={{ '--panels': PANELS } as Vars}
    >
      <div className="m-ent-why-stick m-wrap">
        <header className="m-ent-why-head">
          <h2 className="m-ent-why-title" id="ent-why-title">
            {why.title}
          </h2>
          <p className="m-ent-why-need">
            <Phrases text={why.need} />
          </p>
        </header>

        <ol className="m-why-shelf">
          {VIEWS.map((view, index) => {
            const open = !live || index === active;
            return (
              <li
                key={view.id}
                className="m-why-panel"
                data-index={index}
                data-active={open || undefined}
                aria-labelledby={`why-${view.id}`}
              >
                {/* 窄脊：编号、位置名，底下是这个位置上的成员 */}
                <button
                  type="button"
                  className="m-why-spine"
                  tabIndex={live && !open ? 0 : -1}
                  aria-hidden={!live || open}
                  aria-label={`${view.label}：${view.title}`}
                  onClick={() => go(index)}
                >
                  <span className="m-why-spine-no">{number(index)}</span>
                  <span className="m-why-spine-word">{view.label}</span>
                  <span className="m-why-spine-crew">
                    {crew(view).map((id) => (
                      <i key={id}>{why.members[id].name.slice(0, 1)}</i>
                    ))}
                  </span>
                </button>

                <div className="m-why-page">
                  <Graph view={view} index={index} />
                </div>
              </li>
            );
          })}
        </ol>

        <footer className="m-ent-why-end">
          <div>
            <p className="m-ent-why-close">
              <Phrases text={why.close} />
            </p>
            <p className="m-ent-why-note">{why.note}</p>
          </div>
          <More href={TEAM}>{why.link}</More>
        </footer>
      </div>
    </section>
  );
}
