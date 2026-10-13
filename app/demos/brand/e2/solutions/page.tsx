'use client';
import { Check, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { P3 } from '../axo';
import { folioCooperation as content } from '../../../../../content/folio-cooperation';
import { folioMembers } from '../../../../../content/folio-team';
import { Box, Callout, Line, iso, pts } from '../axo';
import { ABOUT, WORK, contactHref, pad } from '../routes';
import {
  Actions,
  Button,
  E2Page,
  Kicker,
  Plate,
  SectionHead,
  type Vars,
} from '../shell';
import './solutions.css';

// E2 解决方案（企业合作）：最「可信」的一页。首屏一张合作流程的轴测模型 → 01 能一起做的四件事 →
// 02 做这件事的人（只用成员个人经历，按四件事对齐）→ 03 从手边的一件事开始 → 04 合作如何开始（编号流程）→
// 结尾深色合作块。没有客户案例、客户 logo 或效果数字。
// 动效都在讲「怎么合作」：首屏一张纸沿着流程走过三站（图例可指可点）；四件事每行箭头从情况画到一起做到；
// 指到一个人，四列里他出现的地方一起亮；「执行交给 Agent」用一条小跑道演示——Agent 往前做，到关口停下等人确认；
// 合作三步随滚动一格格接上。减少动态时直接给完整画面。

/** 在台面上画一个指向 -y（流向）的小箭头 */
function Chevron({ y }: { y: number }) {
  return (
    <>
      <Line a={[5, y + 1, 1]} b={[6, y, 1]} />
      <Line a={[7, y + 1, 1]} b={[6, y, 1]} />
    </>
  );
}

/** 那张「问题」纸在每一站的位置：01 叠纸处 → 02 两块中间 → 03 盒子顶上 → 出台面继续往前 */
const tokenStops: P3[] = [
  [5.2, 30.6, 2.5],
  [5.2, 19.5, 1],
  [5.2, 5.4, 4],
  [5.2, -6, 1],
];

/** 合作方式的轴测模型：01 问题与材料 → 02 业务经验 + Agent 执行 → 03 跑通、验收，留下流程与材料 → 继续往前 */
function HandoffDrawing({ stage }: { stage: number | null }) {
  const at = iso(tokenStops[stage ?? 0]);
  // 「验收」的勾，画在 03 盒子的顶面上
  const check: P3[] = [
    [5, 5.6, 4],
    [6, 6.2, 4],
    [5.4, 3.6, 4],
  ];
  return (
    <svg
      className="esl-drawing"
      viewBox="-36 -10.5 54 38.5"
      data-draw="now"
      aria-hidden="true"
    >
      {/* 台面：一块长板，侧面是剖切面 */}
      <g className="esl-d-base">
        <Box
          at={[0, 0, 0]}
          size={[12, 40, 1]}
          top="floor"
          left="cut"
          right="cut"
        />
        {[8, 16, 24, 32].map((y) => (
          <Line key={y} a={[0, y, 1]} b={[12, y, 1]} className="e2-faint" />
        ))}
      </g>

      {/* 流向：从 01 走到 03，再出台面继续往前 */}
      <g className="esl-d-flow">
        <Line a={[6, 30, 1]} b={[6, 23, 1]} />
        <Chevron y={26} />
        <Line a={[6, 18, 1]} b={[6, 9, 1]} />
        <Chevron y={13} />
        <Line a={[6, 3, 1]} b={[6, -7, 1]} className="esl-d-onward" />
        <Chevron y={-7} />
      </g>

      {/* 03 跑通、验收：一个带勾的盒子，旁边三册留下的流程、材料与使用方法 */}
      <g className="esl-d-c">
        <Box at={[3, 3, 1]} size={[6, 6, 3]} />
        <polyline
          points={pts(check)}
          className="e2-l esl-d-check"
          pathLength={1}
        />
        {[3.4, 5.2, 7].map((y) => (
          <Box key={y} at={[9.6, y, 1]} size={[1.8, 1.2, 3.2]} />
        ))}
      </g>

      {/* 02 业务经验 ＋ Agent 执行：两块并排，流向从中间穿过 */}
      <g className="esl-d-b">
        <Box at={[1, 18, 1]} size={[4, 5, 4]} />
        <Line a={[1.8, 19, 5]} b={[4.2, 19, 5]} className="e2-faint" />
        <Line a={[1.8, 20.2, 5]} b={[3.6, 20.2, 5]} className="e2-faint" />
        <Box at={[7, 18, 1]} size={[4, 5, 4]} top="accent" />
      </g>

      {/* 01 一起说清楚：三张叠起来的纸，最上面一张写着问题 */}
      <g className="esl-d-a">
        <Box at={[3, 31, 1]} size={[6, 6, 0.5]} />
        <Box at={[3.3, 30.7, 1.5]} size={[6, 6, 0.5]} />
        <Box at={[3.6, 30.4, 2]} size={[6, 6, 0.5]} />
        <Line a={[4.4, 31.4, 2.5]} b={[8.8, 31.4, 2.5]} className="e2-text" />
        <Line a={[4.4, 32.6, 2.5]} b={[8.8, 32.6, 2.5]} className="e2-faint" />
        <Line a={[4.4, 33.8, 2.5]} b={[7.2, 33.8, 2.5]} className="e2-faint" />
      </g>

      {/* 走在流程上的那张纸 */}
      <g
        className="esl-d-token"
        style={{
          transform: `translate(${at[0].toFixed(2)}px, ${at[1].toFixed(2)}px)`,
        }}
        data-show={(stage !== null && stage < 3) || undefined}
      >
        <Box at={[0, 0, 0]} size={[1.8, 1.4, 0.3]} top="accent" />
      </g>

      <g className="esl-d-callouts">
        <Callout
          num="01"
          label="一起说清楚"
          from={[6.6, 33.4, 2.5]}
          to={[-34, 6]}
          align="left"
        />
        <Callout
          num="02"
          label="业务经验 ＋ Agent 执行"
          from={[3, 20.5, 5]}
          to={[-26, -4]}
          align="left"
        />
        <Callout
          num="03"
          label="亲手跑通、亲自验收"
          from={[6, 6, 4]}
          to={[4, -8]}
          align="left"
        />
      </g>
    </svg>
  );
}

/**
 * 首屏的流程演示：线描画完后，那张纸自己走一遍 01 → 02 → 03 → 继续往前，然后停在完整画面；
 * 指到（或用键盘聚焦）图例的某一站，画面就停在那一站。减少动态时不自动走。
 */
function useWalkthrough(stops: number) {
  const [auto, setAuto] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timers = [2300, 3900, 5500, 7100].map((ms, index) =>
      window.setTimeout(() => setAuto(index < stops ? index : null), ms),
    );
    timers.push(window.setTimeout(() => setAuto(null), 8300));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [stops]);
  return { stage: hover ?? auto, setHover };
}

function Handoff() {
  const { stage, setHover } = useWalkthrough(4);
  const legend = (index: number) => ({
    tabIndex: 0,
    'data-on': stage === index || undefined,
    onMouseEnter: () => setHover(index),
    onMouseLeave: () => setHover(null),
    onFocus: () => setHover(index),
    onBlur: () => setHover(null),
  });
  return (
    <Plate
      className="esl-handoff"
      fig="Fig. 01"
      caption="从业务问题到可运行流程，再由团队接手"
      note="合作方式示意"
      label="合作方式示意：从业务问题到可运行流程，再由团队接手"
    >
      <p className="esl-handoff-title">一件真实的工作</p>
      <div className="esl-handoff-stage" data-stage={stage ?? 'all'}>
        <HandoffDrawing stage={stage} />
      </div>
      <ol className="esl-handoff-legend">
        <li {...legend(0)}>
          <i aria-hidden="true">01</i>
          <small>一起说清楚</small>
          <strong>
            <span className="e2-phrase">要什么？</span>
            <span className="e2-phrase">怎样才算做好？</span>
          </strong>
        </li>
        <li {...legend(1)}>
          <i aria-hidden="true">02</i>
          <strong>
            <span className="e2-phrase">业务经验</span> ＋{' '}
            <span className="e2-phrase">Agent 执行</span>
          </strong>
        </li>
        <li {...legend(2)}>
          <i aria-hidden="true">03</i>
          <strong>团队亲手跑通、亲自验收</strong>
          <small>留下流程、材料与使用方法</small>
        </li>
      </ol>
      <p className="esl-handoff-note" data-on={stage === 3 || undefined}>
        交付之后，还能继续往前。
      </p>
    </Plate>
  );
}

function Hero() {
  return (
    <section id="cooperation" className="esl-hero" aria-labelledby="esl-title">
      <div className="esl-hero-copy">
        <Kicker>和 Molis 一起做</Kicker>
        <h1 id="esl-title">
          {content.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="esl-lead">{content.lead}</p>
        <Actions
          items={[
            { label: '聊聊你的业务问题', href: contactHref('enterprise') },
            { label: '看看我们怎么做', href: '#directions', tone: 'ghost' },
          ]}
        />
      </div>
      <Handoff />
    </section>
  );
}

/** 01 能一起做的四件事：每件一行，情况 → 怎么做 → 一起做到 */
function Services() {
  return (
    <section
      id="directions"
      className="esl-section"
      data-tone="white"
      aria-labelledby="esl-directions-title"
    >
      <SectionHead
        id="esl-directions-title"
        index={0}
        kicker="我们能一起做的事"
        title="从业务问题，到团队自己的能力。"
        lead="我们采用贴近业务现场的共建方式（FDE）。和实际使用的人一起，把目标、材料、执行和检查，一步步接起来。"
        layout="split"
      />
      <ol className="esl-services">
        {content.services.map((service, index) => (
          <li
            key={service.id}
            className="esl-service"
            data-reveal
            data-flow
            style={{ '--d': `${index * 60}ms` } as Vars}
          >
            <span className="esl-no" aria-hidden="true">
              {pad(index)}
            </span>
            <div className="esl-service-head">
              <h3>{service.title}</h3>
              <p>{service.situation}</p>
            </div>
            <p className="esl-service-action">{service.action}</p>
            <div className="esl-service-result">
              <small>一起做到</small>
              <p>{service.result}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 02 做这件事的人：按四件事排成四列，每列只写成员过去的个人经历 */
function People() {
  const { people } = content;
  const [person, setPerson] = useState<string | null>(null);
  const list = useRef<HTMLOListElement>(null);
  // 指到哪个人：在整张列表上听一次，按最近的 [data-name] 找人
  useEffect(() => {
    const node = list.current;
    if (!node) return;
    const over = (event: PointerEvent) => {
      const item = (event.target as HTMLElement).closest<HTMLElement>(
        '[data-name]',
      );
      setPerson(item?.dataset.name ?? null);
    };
    const leave = () => setPerson(null);
    node.addEventListener('pointerover', over);
    node.addEventListener('pointerleave', leave);
    return () => {
      node.removeEventListener('pointerover', over);
      node.removeEventListener('pointerleave', leave);
    };
  }, []);
  return (
    <section
      id="people"
      className="esl-section esl-people"
      aria-labelledby="esl-people-title"
    >
      <SectionHead
        id="esl-people-title"
        index={1}
        kicker={people.kicker}
        title={people.title}
        lead={people.lead}
        layout="split"
      />
      <ol className="esl-evidence" ref={list} data-person={person ?? undefined}>
        {people.steps.map((step, order) => {
          const at = content.services.findIndex(
            (item) => item.id === step.service,
          );
          const service = content.services[at];
          return (
            <li
              key={step.service}
              data-reveal
              style={{ '--d': `${order * 60}ms` } as Vars}
            >
              <span className="esl-no" aria-hidden="true">
                {pad(at)}
              </span>
              <h3>{service.title}</h3>
              <ul>
                {step.evidence.map((item) => {
                  const member = folioMembers.find(
                    (person) => person.name === item.name,
                  );
                  return (
                    <li
                      key={item.name}
                      data-name={item.name}
                      data-match={person === item.name || undefined}
                    >
                      {member?.image ? (
                        <img
                          src={member.image}
                          width="40"
                          height="40"
                          alt=""
                          loading="lazy"
                          style={{ objectPosition: member.imagePosition }}
                        />
                      ) : (
                        <span className="esl-avatar" aria-hidden="true">
                          {item.name.slice(-2)}
                        </span>
                      )}
                      <div>
                        <strong>{item.name}</strong>
                        <p>{item.quotes.join('，')}。</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
      <Actions items={[{ label: people.team, href: ABOUT, tone: 'ghost' }]} />
    </section>
  );
}

/** 「执行交给 Agent」那条跑道上的关口：原文里列出的几类决定 */
const gates = ['付款', '发布', '报价', '权限', '重要决定'];

/**
 * 一条小跑道：Agent 的那颗点往前做事，走到每个关口停下，等人确认（✓）再走。
 * 进入视口才开始，走完停在全部确认的样子，可以重播；离开视口、页面隐藏时暂停；减少动态时直接是走完的样子。
 */
/** 访客是否要求减少动态（随系统设置变化） */
function useReducedMotion() {
  return useSyncExternalStore(
    (notify) => {
      const media = matchMedia('(prefers-reduced-motion: reduce)');
      media.addEventListener('change', notify);
      return () => media.removeEventListener('change', notify);
    },
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}

function GateLane() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [played, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const total = gates.length * 2;
  const step = reduced ? total : played;
  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting && !document.hidden),
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);
  useEffect(() => {
    if (!running || step >= total) return;
    const timer = window.setTimeout(
      () => setStep((value) => value + 1),
      step < 0 ? 400 : step % 2 ? 650 : 900,
    );
    return () => window.clearTimeout(timer);
  }, [running, step, total]);
  // 偶数步 2k：点停在第 k+1 个关口前面等确认；奇数步 2k+1：关口打勾，点越过关口
  const gap = gates.length + 0.6;
  const index = Math.floor(Math.max(step, 0) / 2);
  const position =
    step < 0
      ? 0
      : step >= total
        ? gap
        : step % 2 === 0
          ? index + 1 - 0.34
          : index + 1 + 0.22;
  return (
    <div className="esl-lane" ref={ref} aria-hidden="true">
      <div className="esl-lane-labels">
        <span>Agent 执行</span>
        <span>人来确认</span>
      </div>
      <div
        className="esl-lane-track"
        style={{ '--at': position / gap } as Vars}
      >
        <span className="esl-lane-fill" />
        <span
          className="esl-lane-dot"
          data-wait={(step >= 0 && step < total && step % 2 === 0) || undefined}
        />
        {gates.map((gate, index) => {
          const done = step >= index * 2 + 1;
          const waiting = step === index * 2;
          return (
            <span
              key={gate}
              className="esl-gate"
              style={{ '--g': (index + 1) / gap } as Vars}
              data-done={done || undefined}
              data-wait={waiting || undefined}
            >
              <i>{done ? <Check size={11} strokeWidth={3} /> : null}</i>
              <small>{gate}</small>
            </span>
          );
        })}
      </div>
      <div className="esl-lane-foot">
        <em>示意</em>
        {step >= total && !reduced ? (
          <button
            type="button"
            className="esl-lane-replay"
            tabIndex={-1}
            onClick={() => setStep(-1)}
          >
            <RotateCcw size={12} /> 重播
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** 03 从手边的一件事开始：三类任务、人与 Agent 的分工、和 Molis Work 的关系 */
function Start() {
  return (
    <section
      className="esl-section"
      data-tone="white"
      aria-labelledby="esl-start-title"
    >
      <SectionHead
        id="esl-start-title"
        index={2}
        kicker="从你手边的一件事开始"
        title="先挑一个结果能检查的问题。"
        lead="可以从这些任务类型开始讨论，再用你们的实际材料确认范围。"
        layout="split"
      />
      <ol className="esl-starts">
        {content.startingPoints.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--d': `${index * 60}ms` } as Vars}
          >
            <span className="esl-no" aria-hidden="true">
              {pad(index)}
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
      <aside className="esl-principle" data-reveal>
        <div>
          <strong>执行交给 Agent，关键判断留给人。</strong>
          <p>
            付款、发布、报价、权限与重要业务决定，由你们确认。我们一起约定可执行的范围、检查的方法，以及出错时谁来接手。
          </p>
        </div>
        <GateLane />
      </aside>
      <div className="esl-product-note" data-reveal>
        <p>
          从现有工具和业务流程出发，选择合适的实现方式。我们也在把人与 Agent
          共事的方法做进 Molis Work。
        </p>
        <Button label="看看我们的工作台" href={WORK} tone="text" />
      </div>
    </section>
  );
}

/** 04 合作如何开始：三步编号流程，排在一条线上 */
function Begin() {
  return (
    <section
      className="esl-section esl-begin"
      aria-labelledby="esl-begin-title"
    >
      <SectionHead
        id="esl-begin-title"
        index={3}
        kicker="合作如何开始"
        title="合作，从一次具体的交谈开始。"
      />
      <ol className="esl-stages" data-scene="enter" data-steps="3">
        {content.stages.map((stage, index) => (
          <li
            key={stage.title}
            data-reveal
            style={{ '--d': `${index * 80}ms` } as Vars}
          >
            <span className="esl-stage-no" aria-hidden="true">
              {pad(index)}
            </span>
            <h3>{stage.title}</h3>
            <p>{stage.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Closing() {
  return (
    <section className="esl-closing" aria-labelledby="esl-closing-title">
      <div className="esl-closing-block" data-reveal>
        <h2 id="esl-closing-title">
          <span>你们的下一段工作，</span>
          <span>我们一起看看。</span>
        </h2>
        <div className="esl-closing-side">
          <p>带上现在的做法、遇到的困难，或者一份还不够满意的结果。</p>
          <Actions
            items={[
              {
                label: '聊聊企业合作',
                href: contactHref('enterprise'),
                tone: 'light',
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

export default function E2SolutionsPage() {
  return (
    <E2Page current="solutions" className="esl" footer={<Closing />}>
      <Hero />
      <Services />
      <People />
      <Start />
      <Begin />
    </E2Page>
  );
}
