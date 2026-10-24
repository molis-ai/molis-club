'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, FileText, Pause, Play } from 'lucide-react';
import { artistSkills } from '../../../content/artists';
import {
  isResourceEntry,
  knowledge,
  knowledgePrompt,
  type TechniqueEntry,
} from '../../../content/knowledge';
import {
  appendixTools,
  community,
  demos,
  DROPAGENT_RELEASE,
  DROPAGENT_REPO,
  NIUL_REPO,
  skillZipKb,
  works,
} from '../../../content/site/community';
import { at, Canvas, Cursor } from '../../_site/demo/demo';
import { useReducedMotion, useVisible } from '../../_site/motion';
import { artistHref, methodHref } from '../../_site/routes';
import { artistImage, More, Note, pad } from '../../_site/ui';
import { CopyAction, SkillDownload } from './copy';
import { MethodDemo } from './method-demo';

// 作品画廊里后四件：每件分成「窗」（左边钉住的那一格：作品本身、示意演示）和「字」（右边：想解决什么、怎么做、带走）。
// 窗和字共用同一份选择（选了哪种观看、哪个效果、停在哪一步），由画廊管着传进来。
// 这里是改版前那版（gallery-current.tsx）的窗和字；两版共用的画面（牛、置物架）、带走的按钮和演示的节拍也在这里，
// 新版的窗在 stages.tsx。
// 想解决什么、怎么做都是第 6 章与附录 A.1 的原句；没有 JS 时停在第一项、演示停在完整的结果上；
// 减少动态时演示不播，停在设计好的那一拍。

// ---------- Artist Skill：AI 试样 / 方法三步 / 下载 ----------

export const samples = artistSkills.filter((skill) => skill.image);

export function ArtistStage({
  index,
  onPick,
}: {
  index: number;
  onPick: (index: number) => void;
}) {
  const skill = samples[index];
  const t = works.artist;
  return (
    <>
      <div className="m-com-frame m-com-sample">
        <img
          key={skill.slug}
          {...artistImage(skill.slug, skill, '(max-width: 900px) 92vw, 52vw')}
          alt={skill.imageAlt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="m-com-under">
        <fieldset className="m-com-pick m-com-js">
          <legend className="sr-only">{t.pick}</legend>
          {samples.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              aria-pressed={i === index}
              onClick={() => onPick(i)}
            >
              {item.name.split(' · ')[0]}
            </button>
          ))}
        </fieldset>
        <Note>{t.sampleNote}</Note>
      </div>
    </>
  );
}

export function ArtistText({ index }: { index: number }) {
  const skill = samples[index];
  return (
    <>
      <p className="m-com-work-lead">{community.methods.artist[0]}</p>
      <ol className="m-com-steps" aria-label={skill.name}>
        {skill.method.map((step) => (
          <li key={step.title}>
            <b>{step.title}</b>
            <span>{step.body}</span>
          </li>
        ))}
      </ol>
      <ArtistTake index={index} />
    </>
  );
}

/** 带走：下载这个 Skill，看完整方法 */
export function ArtistTake({ index }: { index: number }) {
  const skill = samples[index];
  const t = works.artist;
  return (
    <div className="m-com-take m-actions">
      <SkillDownload
        slug={skill.slug}
        kb={skillZipKb[skill.slug]}
        label={t.download}
        solid
      />
      <More href={artistHref(skill.slug)}>{t.detail}</More>
    </div>
  );
}

// ---------- 网页动效：现场演示 / 怎么做 / 复制 Prompt ----------

export const techniques = knowledge.filter(
  (entry): entry is TechniqueEntry => !isResourceEntry(entry),
);
export const technique = (slug: string) =>
  techniques.find((item) => item.slug === slug) ?? techniques[0];

export function WebStage({
  slug,
  onPick,
}: {
  slug: string;
  onPick: (slug: string) => void;
}) {
  const entry = technique(slug);
  return (
    <>
      <div className="m-com-frame m-com-web">
        <MethodDemo key={entry.slug} entry={entry} tour />
      </div>
      <div className="m-com-under">
        <fieldset className="m-com-pick m-com-js">
          <legend className="sr-only">{works.web.pick}</legend>
          {techniques.map((item) => (
            <button
              key={item.slug}
              type="button"
              aria-pressed={item.slug === entry.slug}
              onClick={() => onPick(item.slug)}
            >
              {item.name}
            </button>
          ))}
        </fieldset>
      </div>
    </>
  );
}

export function WebText({ slug }: { slug: string }) {
  const entry = technique(slug);
  return (
    <>
      <p className="m-com-work-lead">{community.methods.web}</p>
      <div className="m-com-work-how">
        <p className="m-com-work-term">
          <b>{entry.name}</b>
          <i lang="en">{entry.english}</i>
        </p>
        <p>{entry.description}</p>
      </div>
      <WebTake slug={slug} />
    </>
  );
}

/** 带走：复制这个效果的 Prompt，看完整方法 */
export function WebTake({ slug }: { slug: string }) {
  const entry = technique(slug);
  const t = works.web;
  return (
    <div className="m-com-take m-actions">
      <CopyAction
        id="web-prompt"
        text={knowledgePrompt(entry)}
        label={t.copy}
        topic="share-method"
        solid
      />
      <More href={methodHref(entry.slug)}>{t.detail}</More>
    </div>
  );
}

// ---------- niul.ai 与 DropAgent：示意演示 / 原句 / 项目入口 ----------

export function NiulText() {
  return (
    <>
      <p className="m-com-work-lead">{appendixTools.niul[0]}</p>
      <div className="m-com-work-how">
        <p>{appendixTools.niul[1]}</p>
        <p>{appendixTools.niul[2]}</p>
      </div>
      <NiulTake />
    </>
  );
}

/** 项目入口：GitHub 仓库 */
export function NiulTake() {
  return (
    <div className="m-com-take m-actions">
      <More href={NIUL_REPO} external>
        {works.niul.repo}
      </More>
    </div>
  );
}

export function DropText() {
  return (
    <>
      <p className="m-com-work-lead">{appendixTools.drop[0]}</p>
      <div className="m-com-work-how">
        <p>{appendixTools.drop[1]}</p>
        <p>{appendixTools.drop[2]}</p>
      </div>
      <DropTake />
      <p className="m-com-fine">{appendixTools.both}</p>
    </>
  );
}

/** 带走：下载安装包、GitHub 仓库，系统要求紧挨着下载 */
export function DropTake() {
  const t = works.drop;
  return (
    <div className="m-com-take">
      <div className="m-actions">
        <a
          className="m-btn"
          href={DROPAGENT_RELEASE}
          target="_blank"
          rel="noreferrer"
        >
          {t.download}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <More href={DROPAGENT_REPO} external>
          {t.repo}
        </More>
      </div>
      <p className="m-com-fine">{t.system}</p>
    </div>
  );
}

/** DropAgent 的三步：指着哪一步，演示就停在那一步（新版不带编号：plain） */
export function DropSteps({
  hold,
  onHold,
  plain = false,
}: {
  hold: number | null;
  onHold: (step: number | null) => void;
  plain?: boolean;
}) {
  // 鼠标在三步之间挪动时不让演示在缝隙里跳回自动播放
  const leave = useRef(0);
  const pin = (i: number) => {
    window.clearTimeout(leave.current);
    onHold(i);
  };
  const release = () => {
    window.clearTimeout(leave.current);
    leave.current = window.setTimeout(() => onHold(null), 160);
  };
  useEffect(() => () => window.clearTimeout(leave.current), []);
  return (
    <ol className="m-com-pick m-com-drop-steps m-com-js">
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
            {plain ? null : <span className="num">{pad(i + 1)}</span>}
            {step}
          </button>
        </li>
      ))}
    </ol>
  );
}

// ---------- 示意演示的节拍：轮到它、在视口里、页面没藏起来、没暂停时才播 ----------

/**
 * 几拍循环：rest 是停下来时的那一拍（没有 JS、减少动态时都停在这里）；外面指着哪一步（hold）就停在那一步。
 * 两版画廊的演示外壳共用。
 */
export function useBeat<T extends HTMLElement>({
  steps,
  rest,
  ms,
  on,
  hold = null,
}: {
  steps: number;
  rest: number;
  ms: number;
  on: boolean;
  hold?: number | null;
}) {
  const ref = useRef<T>(null);
  const visible = useVisible(ref, 0.3);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [beat, setBeat] = useState(rest);
  const running = on && visible && !reduced && !paused && hold === null;
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
  return { ref, step, running, reduced, paused, setPaused };
}

/** 暂停 / 继续：减少动态时不出现 */
export function PauseButton({
  paused,
  onToggle,
  pause = demos.pause,
  play = demos.play,
}: {
  paused: boolean;
  onToggle: () => void;
  pause?: string;
  play?: string;
}) {
  return (
    <button
      type="button"
      className="m-pause"
      aria-pressed={paused}
      aria-label={paused ? play : pause}
      onClick={onToggle}
    >
      {paused ? (
        <Play size={10} fill="currentColor" aria-hidden="true" />
      ) : (
        <Pause size={10} fill="currentColor" aria-hidden="true" />
      )}
    </button>
  );
}

/**
 * 几拍循环的示意演示（改版前的画廊）。画面按当前拍画出来；窗下是「示意」和暂停键，before 放在它们前面。
 */
function DemoShell({
  steps,
  rest,
  ms,
  label,
  className,
  on,
  hold = null,
  before,
  children,
}: {
  steps: number;
  rest: number;
  ms: number;
  label: string;
  className: string;
  /** 画廊里轮到这一件 */
  on: boolean;
  /** 外面指着哪一步：停在那一步，不播 */
  hold?: number | null;
  before?: ReactNode;
  children: (step: number) => ReactNode;
}) {
  const { ref, step, running, reduced, paused, setPaused } = useBeat<HTMLElement>(
    { steps, rest, ms, on, hold },
  );
  return (
    <>
      <figure
        ref={ref}
        className={`m-com-frame m-com-demo ${className}`}
        data-running={running || undefined}
        aria-label={label}
      >
        <div className="m-com-demo-view" aria-hidden="true">
          {children(step)}
        </div>
      </figure>
      <div className="m-com-under">
        {before}
        <span className="m-com-demo-tools">
          <Note>{demos.note}</Note>
          {reduced ? null : (
            <PauseButton
              paused={paused}
              onToggle={() => setPaused((value) => !value)}
            />
          )}
        </span>
      </div>
    </>
  );
}

// ---------- niul.ai：桌边的四头牛，忙碌、等你、闲置、离线 ----------

type CowState = keyof typeof demos.niul.states;

/** 三拍：都在忙 → 一个做完了在等你 → 你回应了它，另一个又做完了。停在第二拍（四种状态都在） */
export const timeline: CowState[][] = [
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

/** 桌边四头牛在这一拍的样子（两版画廊共用） */
export function NiulScene({ step }: { step: number }) {
  const t = demos.niul;
  return (
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
  );
}

export function NiulStage({ on }: { on: boolean }) {
  return (
    <DemoShell
      steps={timeline.length}
      rest={1}
      ms={2600}
      on={on}
      label={demos.niul.label}
      className="m-com-niul"
    >
      {(step) => <NiulScene step={step} />}
    </DemoShell>
  );
}

// ---------- DropAgent：放下材料 → 在副本上处理 → 取走新结果 ----------

export function DropStage({
  on,
  hold,
  onHold,
}: {
  on: boolean;
  hold: number | null;
  onHold: (step: number | null) => void;
}) {
  const t = demos.drop;
  return (
    <DemoShell
      steps={3}
      rest={2}
      ms={2800}
      on={on}
      hold={hold}
      label={t.label}
      className="m-com-drop"
      before={<DropSteps hold={hold} onHold={onHold} />}
    >
      {(now) => <DropScene now={now} />}
    </DemoShell>
  );
}

/** 置物架在这一拍的样子（两版画廊共用） */
export function DropScene({ now }: { now: number }) {
  const t = demos.drop;
  return (
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
  );
}
