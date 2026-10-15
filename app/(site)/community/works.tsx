'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { FileText, Pause, Play } from 'lucide-react';
import { artistSkills } from '../../../content/artists';
import {
  isResourceEntry,
  knowledge,
  knowledgePrompt,
  type TechniqueEntry,
} from '../../../content/knowledge';
import {
  appendixTools,
  communityUi,
  demos,
  DROPAGENT_RELEASE,
  DROPAGENT_REPO,
  NIUL_REPO,
  skillZipKb,
  works,
} from '../../../content/site/community';
import { at, Canvas, Cursor } from '../../_site/demo/demo';
import { useReducedMotion, useVisible } from '../../_site/motion';
import {
  artistHref,
  METHODS,
  methodHref,
  productHref,
} from '../../_site/routes';
import { More, Note, pad, artistImage } from '../../_site/ui';
import { MethodDemo } from './method-demo';
import { TicketCopy, TicketLink } from './ticket';

// 工作台右边那张纸：每件作品三层——先玩（作品本身）/ 看怎么做（或「想解决什么」）/ 带走（票根）。
// Artist Skill 与网页动效「选一个，三层一起换」；niul.ai 与 DropAgent 是示意演示。
// 没有 JS 时停在第一项、演示停在完整的结果上；减少动态时演示不播，停在设计好的那一帧。

const ui = communityUi.bench;

/** 一层：左边一行小标签，右边内容 */
function Layer({
  label,
  kind,
  children,
}: {
  label: string;
  kind: 'play' | 'how' | 'take';
  children: ReactNode;
}) {
  return (
    <div className="m-com-layer" data-layer={kind}>
      <h4 className="m-com-layer-label">{label}</h4>
      <div className="m-com-layer-body">{children}</div>
    </div>
  );
}

// ---------- Artist Skill：AI 试样 / 方法三步 / 下载 ----------

const samples = artistSkills.filter((skill) => skill.image);
const builder = artistSkills.find(
  (skill) => skill.slug === 'art-style-skill-builder',
);

export function ArtistStage() {
  const [index, setIndex] = useState(0);
  const skill = samples[index];
  const t = works.artist;
  return (
    <>
      <Layer label={ui.play} kind="play">
        <figure className="m-com-sample">
          <div className="m-com-sample-view">
            <img
              key={skill.slug}
              {...artistImage(skill.slug, skill, '(max-width: 900px) 90vw, 420px')}
              alt={skill.imageAlt}
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption>
            <fieldset className="m-com-pick m-com-js">
              <legend className="sr-only">{t.pick}</legend>
              {samples.map((item, i) => (
                <button
                  key={item.slug}
                  type="button"
                  aria-pressed={i === index}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => setIndex(i)}
                >
                  {item.name.split(' · ')[1] ?? item.name}
                </button>
              ))}
            </fieldset>
            <Note>{t.sampleNote}</Note>
          </figcaption>
        </figure>
      </Layer>
      <Layer label={ui.how} kind="how">
        <ol className="m-com-steps">
          {skill.method.map((step, i) => (
            <li key={step.title}>
              <span className="m-no" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <b>{step.title}</b>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </Layer>
      <Layer label={ui.take} kind="take">
        <TicketLink
          href={`/downloads/artists/${skill.slug}.zip`}
          download
          title={t.download}
          meta={`${skill.name} · zip ${skillZipKb[skill.slug] ?? ''} KB`}
          no="No.02"
          done={'已开始下载。'}
          topic="share-artist"
        />
        <p className="m-com-take-links">
          <More href={artistHref(skill.slug)}>{ui.detail}</More>
          {builder ? (
            <a
              className="m-link"
              href={`/downloads/artists/${builder.slug}.zip`}
              download
            >
              {t.builderDownload}
            </a>
          ) : null}
        </p>
      </Layer>
    </>
  );
}

// ---------- 网页动效：现场演示 / 怎么做 / 复制 Prompt ----------

const techniques = knowledge.filter(
  (entry): entry is TechniqueEntry => !isResourceEntry(entry),
);

export function WebStage() {
  const [slug, setSlug] = useState(techniques[0].slug);
  const entry = techniques.find((item) => item.slug === slug) ?? techniques[0];
  const t = works.web;
  return (
    <>
      <Layer label={ui.play} kind="play">
        <fieldset className="m-com-pick m-com-js">
          <legend className="sr-only">{t.pick}</legend>
          {techniques.map((item) => (
            <button
              key={item.slug}
              type="button"
              aria-pressed={item.slug === entry.slug}
              onMouseEnter={() => setSlug(item.slug)}
              onClick={() => setSlug(item.slug)}
            >
              {item.name}
            </button>
          ))}
        </fieldset>
        <MethodDemo key={entry.slug} entry={entry} tour />
      </Layer>
      <Layer label={ui.how} kind="how">
        <p className="m-com-how-lead">
          <b>{entry.name}</b>
          <i lang="en">{entry.english}</i>
        </p>
        <p className="m-com-how-text">{entry.description}</p>
        <p className="m-com-how-text">
          <span className="m-com-how-key">{t.use}</span>
          {entry.use}
        </p>
      </Layer>
      <Layer label={ui.take} kind="take">
        <TicketCopy
          text={knowledgePrompt(entry)}
          title={t.copy}
          meta={t.copyMeta}
          no="No.03"
          topic="share-method"
        />
        <p className="m-com-take-links">
          <More href={methodHref(entry.slug)}>{ui.detail}</More>
          <More href={`${METHODS}?type=web`}>{t.all}</More>
        </p>
      </Layer>
    </>
  );
}

// ---------- niul.ai 与 DropAgent：演示 / 想解决什么 / 项目入口 ----------

export function NiulStage() {
  const t = works.niul;
  return (
    <>
      <Layer label={ui.play} kind="play">
        <NiulDemo />
      </Layer>
      <Layer label={ui.why} kind="how">
        <p className="m-com-why-big">{t.lead}</p>
        <p className="m-com-how-text">{appendixTools.niul[3]}</p>
      </Layer>
      <Layer label={ui.go} kind="take">
        <TicketLink
          href={NIUL_REPO}
          external
          title={t.repo}
          meta={t.repoMeta}
          no="No.04"
        />
        <p className="m-com-take-links">
          <More href={productHref.tool}>{works.drop.tool}</More>
        </p>
        <p className="m-com-fine">{ui.tool}</p>
      </Layer>
    </>
  );
}

export function DropStage() {
  const t = works.drop;
  const [hold, setHold] = useState<number | null>(null);
  // 鼠标在三步之间挪动时不让演示在缝隙里跳回自动播放
  const leave = useRef(0);
  const pin = (i: number) => {
    window.clearTimeout(leave.current);
    setHold(i);
  };
  const release = () => {
    window.clearTimeout(leave.current);
    leave.current = window.setTimeout(() => setHold(null), 160);
  };
  useEffect(() => () => window.clearTimeout(leave.current), []);
  return (
    <>
      <Layer label={ui.play} kind="play">
        <DropDemo hold={hold} />
      </Layer>
      <Layer label={ui.why} kind="how">
        <p className="m-com-why-big">{appendixTools.drop[0]}</p>
        <ol className="m-com-drop-steps">
          {demos.drop.steps.map((step, i) => (
            <li key={step}>
              <button
                type="button"
                aria-pressed={hold === i}
                onMouseEnter={() => pin(i)}
                onFocus={() => pin(i)}
                onMouseLeave={release}
                onBlur={release}
              >
                <span className="m-no">{pad(i + 1)}</span>
                {step}
              </button>
            </li>
          ))}
        </ol>
      </Layer>
      <Layer label={ui.go} kind="take">
        <TicketLink
          href={DROPAGENT_RELEASE}
          external
          title={t.download}
          meta={t.system}
          no="No.05"
        />
        <p className="m-com-take-links">
          <More href={DROPAGENT_REPO} external>
            {t.repo}
          </More>
          <More href={productHref.tool}>{t.tool}</More>
        </p>
        <p className="m-com-fine">{ui.tool}</p>
      </Layer>
    </>
  );
}

// ---------- 示意演示的外壳：在视口里、页面没藏起来、没暂停时才播 ----------

/**
 * 几拍循环的示意演示。rest 是停下来时的那一拍（没有 JS、减少动态时都停在这里），
 * 画面和底部说明按当前拍画出来。
 */
function DemoShell({
  steps,
  rest,
  ms,
  label,
  className,
  hold = null,
  foot,
  children,
}: {
  steps: number;
  rest: number;
  ms: number;
  label: string;
  className: string;
  /** 外面指着哪一步：停在那一步，不播 */
  hold?: number | null;
  foot?: (step: number) => ReactNode;
  children: (step: number) => ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const visible = useVisible(ref, 0.3);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [beat, setBeat] = useState(rest);
  const running = visible && !reduced && !paused && hold === null;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setBeat((value) => (value + 1) % steps),
      ms,
    );
    return () => window.clearInterval(id);
  }, [running, steps, ms]);
  // 减少动态：不播，停在设计好的那一拍
  const step = hold ?? (reduced ? rest : beat);
  return (
    <figure
      ref={ref}
      className={`m-com-demo ${className}`}
      data-running={running || undefined}
      aria-label={label}
    >
      <div className="m-com-demo-view" aria-hidden="true">
        {children(step)}
      </div>
      <figcaption className="m-com-demo-foot">
        {foot ? foot(step) : null}
        <span className="m-com-demo-tools">
          <Note>{demos.note}</Note>
          {reduced ? null : (
            <button
              type="button"
              className="m-pause"
              aria-pressed={paused}
              aria-label={paused ? demos.play : demos.pause}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? (
                <Play size={10} fill="currentColor" aria-hidden="true" />
              ) : (
                <Pause size={10} fill="currentColor" aria-hidden="true" />
              )}
            </button>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

// ---------- niul.ai：桌边的四头牛，忙碌、等你、闲置、离线 ----------

type CowState = keyof typeof demos.niul.states;

/** 三拍：都在忙 → 一个做完了在等你 → 你回应了它，另一个又做完了。停在第二拍（四种状态都在） */
const timeline: CowState[][] = [
  ['busy', 'busy', 'idle', 'offline'],
  ['waiting', 'busy', 'idle', 'offline'],
  ['busy', 'waiting', 'idle', 'offline'],
];

function Cow() {
  return (
    <svg viewBox="0 0 64 64" className="m-com-cow">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 19.5C19.5 17 18 12.5 19.5 8" />
        <path d="M41 19.5C44.5 17 46 12.5 44.5 8" />
        <path d="M18.5 26.5C14 25.5 10 26.5 8 29.5c3.6 2 8 2 11-.4" />
        <path d="M45.5 26.5C50 25.5 54 26.5 56 29.5c-3.6 2-8 2-11-.4" />
        <rect x="17" y="17" width="30" height="30" rx="14" />
        <ellipse
          className="m-com-cow-muzzle"
          cx="32"
          cy="45"
          rx="11.5"
          ry="7.5"
        />
        <path d="M28 45h.01M36 45h.01" strokeWidth="2" />
        <g className="m-com-cow-open">
          <path d="M26 31h.01M38 31h.01" strokeWidth="2.8" />
        </g>
        <g className="m-com-cow-shut">
          <path d="M23.8 31.2q2.2 1.6 4.4 0M35.8 31.2q2.2 1.6 4.4 0" />
        </g>
      </g>
    </svg>
  );
}

export function NiulDemo() {
  const t = demos.niul;
  return (
    <DemoShell
      steps={timeline.length}
      rest={1}
      ms={2600}
      label={t.label}
      className="m-com-niul"
    >
      {(step) => (
        <ul className="m-com-cows">
          {t.agents.map((name, i) => {
            const state = timeline[step][i];
            return (
              <li key={name} data-state={state}>
                <span className="m-com-bubble">
                  <i />
                  {t.bubble}
                </span>
                <span className="m-com-busy">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="m-com-zz" lang="en">
                  z<small>z</small>
                </span>
                <span className="m-com-seat">
                  <Cow />
                </span>
                <span className="m-com-cow-name">{name}</span>
                <span className="m-com-cow-state">{t.states[state]}</span>
              </li>
            );
          })}
        </ul>
      )}
    </DemoShell>
  );
}

// ---------- DropAgent：放下材料 → 在副本上处理 → 取走新结果 ----------

export function DropDemo({ hold = null }: { hold?: number | null }) {
  const t = demos.drop;
  return (
    <DemoShell
      steps={3}
      rest={2}
      ms={2800}
      hold={hold}
      label={t.label}
      className="m-com-drop"
    >
      {(now) => (
        <Canvas step={now} className="m-com-drop-sc" press={[0]}>
          <div className="m-com-bar">
            <span className="m-com-bar-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="m-com-tray" data-on={now > 0 || undefined}>
              <svg viewBox="0 0 20 16">
                <path
                  d="M2 9.5h4.5l1.5 2.5h4l1.5-2.5H18M2 9.5 4.5 3h11L18 9.5V14H2z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="num">{t.clock}</span>
          </div>
          {/* 原件一直在桌面上，不被改动；第一拍拖一个影子到菜单栏的置物架 */}
          <div className="m-com-desk-file">
            <FileText aria-hidden="true" />
            <span>{t.file}</span>
            <span className="m-chip m-v" data-tone="line" style={at(1)}>
              {t.original}
            </span>
            <Cursor show={at(0, 1)} x="64%" y="34%" />
          </div>
          <div className="m-com-ghost m-v" style={at(0, 1, 500)}>
            <FileText aria-hidden="true" />
          </div>
          <div className="m-com-shelf m-v" data-pop style={at(1)}>
            <div className="m-com-shelf-row">
              <FileText aria-hidden="true" />
              <span className="m-com-shelf-name">
                {t.file}
                <span className="m-chip" data-tone="line">
                  {t.copy}
                </span>
              </span>
              <span className="m-com-shelf-work">
                <span className="m-stack m-mini">
                  <span className="m-v" data-fade style={at(1, 2)}>
                    {t.working}
                  </span>
                  <span className="m-v" data-fade style={at(2)}>
                    {t.done}
                  </span>
                </span>
                <span className="m-bar" style={at(1)} />
              </span>
            </div>
            <div className="m-com-shelf-row m-v" style={at(2, undefined, 150)}>
              <span className="m-tick" style={at(2)}>
                <svg viewBox="0 0 12 12">
                  <path
                    d="m2.5 6.2 2.3 2.3 4.7-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              <span className="m-com-shelf-name">
                {t.result} · {t.file.replace('.pdf', '')}
              </span>
              <span className="m-chip" data-tone="ink">
                {t.take}
              </span>
            </div>
          </div>
        </Canvas>
      )}
    </DemoShell>
  );
}
