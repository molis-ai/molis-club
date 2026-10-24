'use client';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { RotateCcw } from 'lucide-react';
import {
  appendixTools,
  communityUi,
  demos,
  works,
} from '../../../content/site/community';
import { useReducedMotion, useVisible } from '../../_site/motion';
import { artistImage, Note } from '../../_site/ui';
import {
  FlowerCanvas,
  own,
  preview,
  seed,
  update,
  useFlowerState,
} from './flower';
import { flowerColors, type Flower } from './flower-art';
import { MethodDemo } from './method-demo';
import {
  DropScene,
  DropSteps,
  NiulScene,
  PauseButton,
  samples,
  technique,
  techniques,
  timeline,
  useBeat,
} from './works';

// 作品画廊新版（负责人 2026-10-24，D2）的五扇窗：窗放大，原来右边的「怎么做」挪进窗里演示。
// 每扇窗同一个样子：上面是作品本身，下面一条窗里的说明（原句或展签挪进来）；
// 窗下一行，左边是选择，右边是标注和暂停 / 重播。
// 一朵好奇第一次看到时自己长一遍：一条线 → 重复 → 交给你，长完照样能拖、换色、下载、复制；
// Artist Skill 窗里轮播三位艺术家的试样，访客一动手就停；网页动效、niul.ai、DropAgent 沿用原来的演示。
// 没有 JS：花是默认那朵，试样停在第一张，演示停在设计好的那一拍；减少动态：花直接是长完的样子，不轮播、不播。

/** 一扇窗：作品本身 + 窗里的说明；窗下一行，左边选择，右边标注与暂停 */
function Window({
  view,
  viewRef,
  label,
  running,
  phase,
  caption,
  chips,
  meta,
  children,
}: {
  view: string;
  viewRef?: RefObject<HTMLDivElement | null>;
  /** 示意演示：整个画面读作一张图 */
  label?: string;
  running?: boolean;
  phase?: string;
  caption: ReactNode;
  chips?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <div className="m-com-win">
        <div
          ref={viewRef}
          className={`m-com-win-view ${view}`}
          role={label ? 'img' : undefined}
          aria-label={label}
          data-running={running || undefined}
          data-phase={phase}
        >
          {children}
        </div>
        <div className="m-com-win-cap">{caption}</div>
      </div>
      <div className="m-com-win-under">
        {chips}
        <span className="m-com-win-meta">{meta}</span>
      </div>
    </>
  );
}

// ---------- 一朵好奇：自己长一遍，再交给你 ----------

const t = works.flower;
const STEPS = t.steps;
const LAST = STEPS.length - 1;
/** 每一步停多久：一条线短一点，重复要等每一片转到位 */
const HOLD = [1500, 2700, 1900];
/** wait：还没长（有 JS 时先藏着）；0…2：长到第几步；null：长完了，交给访客 */
type Phase = 'wait' | number | null;

const same = (a: Pick<Flower, 'count' | 'bloom'>, b: Flower) =>
  a.count === b.count && a.bloom === b.bloom;

export function FlowerWindow({ on }: { on: boolean }) {
  const now = useFlowerState();
  const flower = own(now);
  const shown = now.preview ?? flower;
  const id = useId();
  const view = useRef<HTMLDivElement>(null);
  const visible = useVisible(view, 0.5);
  const reduced = useReducedMotion();
  const [run, setRun] = useState<Phase>('wait');
  // 减少动态：不长，直接是长完的样子
  const phase = reduced ? null : run;
  const leave = useRef(0);

  useEffect(() => {
    if (reduced) seed({ count: STEPS[LAST].count, bloom: STEPS[LAST].bloom });
  }, [reduced]);
  // 轮到它、看得见时，稍等一拍开始长
  useEffect(() => {
    if (phase !== 'wait' || !on || !visible) return;
    const timer = window.setTimeout(() => setRun(0), 240);
    return () => window.clearTimeout(timer);
  }, [phase, on, visible]);
  // 一步一步：窗里摆成这一步的样子，停一会儿再走下一步
  useEffect(() => {
    if (typeof phase !== 'number') return;
    seed({ count: STEPS[phase].count, bloom: STEPS[phase].bloom });
    const timer = window.setTimeout(
      () => setRun(phase < LAST ? phase + 1 : null),
      HOLD[phase],
    );
    return () => window.clearTimeout(timer);
  }, [phase]);
  useEffect(() => () => window.clearTimeout(leave.current), []);

  const stop = () => setRun(null);
  // 指着哪一步，窗里停在那一步；移开回到访客自己调的那朵（鼠标在几步之间挪动时不在缝隙里跳回去）
  const show = (step: (typeof STEPS)[number]) => {
    window.clearTimeout(leave.current);
    preview({ ...flower, count: step.count, bloom: step.bloom });
  };
  const hide = () => {
    window.clearTimeout(leave.current);
    leave.current = window.setTimeout(() => preview(null), 140);
  };
  const use = (step: (typeof STEPS)[number]) => {
    window.clearTimeout(leave.current);
    stop();
    update({ count: step.count, bloom: step.bloom });
  };
  const current =
    typeof phase === 'number'
      ? phase
      : STEPS.findIndex((step) => same(step, shown));

  return (
    <Window
      view="m-com-win-flower"
      viewRef={view}
      phase={phase === null ? undefined : String(phase)}
      caption={
        <>
          <span className="m-com-win-steps m-com-js">
            {STEPS.map((step, index) => (
              <button
                key={step.title}
                type="button"
                data-on={index === current || undefined}
                onMouseEnter={() => show(step)}
                onMouseLeave={hide}
                onFocus={() => show(step)}
                onBlur={hide}
                onClick={() => use(step)}
              >
                {step.title}
              </button>
            ))}
          </span>
          {current >= 0 ? (
            <span className="m-com-win-text">{STEPS[current].text}</span>
          ) : (
            <span className="m-com-win-text m-caption" lang="en">
              {t.caption}
            </span>
          )}
        </>
      }
      chips={
        <fieldset className="m-com-pick m-com-js">
          <legend className="sr-only">{t.controls.color}</legend>
          {flowerColors.map((color, index) => (
            <button
              key={color.name}
              type="button"
              aria-pressed={flower.color === index}
              onClick={() => {
                stop();
                update({ color: index });
              }}
            >
              <i
                className="m-com-dot"
                style={{ '--c': color.value } as CSSProperties}
              />
              {color.name}
            </button>
          ))}
        </fieldset>
      }
      meta={
        <>
          <span className="m-com-readout" aria-hidden="true">
            {t.controls.count} <b className="num">{shown.count}</b>{' '}
            {t.controls.times}
            <span>
              {t.controls.bloom} <b className="num">{shown.bloom}%</b>
            </span>
          </span>
          {reduced ? null : (
            <button
              type="button"
              className="m-pause"
              aria-label={t.replay}
              title={t.replay}
              onClick={() => setRun(0)}
            >
              <RotateCcw size={12} aria-hidden="true" />
            </button>
          )}
        </>
      }
    >
      <FlowerCanvas
        describedBy={`${id}-keys`}
        onTouch={stop}
        grow={phase === 0 ? 'line' : 'grown'}
      />
      <p className="sr-only" id={`${id}-keys`}>
        {communityUi.keys}
      </p>
      <output className="sr-only" aria-live="polite">
        {now.touched
          ? `${flower.count} 次，展开 ${flower.bloom}%，${flowerColors[flower.color].name}`
          : ''}
      </output>
    </Window>
  );
}

// ---------- Artist Skill：三位艺术家的试样轮着换 ----------

export function ArtistWindow({
  index,
  onPick,
  on,
}: {
  index: number;
  onPick: (index: number) => void;
  on: boolean;
}) {
  const skill = samples[index];
  const a = works.artist;
  const view = useRef<HTMLDivElement>(null);
  const visible = useVisible(view, 0.4);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const running = on && visible && !reduced && !paused;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => onPick((index + 1) % samples.length),
      4800,
    );
    return () => window.clearTimeout(timer);
  }, [running, index, onPick]);
  return (
    <Window
      view="m-com-sample"
      viewRef={view}
      running={running}
      caption={
        <>
          <span className="m-com-win-term">
            <b>{skill.name}</b>
            <i lang="en">{skill.english}</i>
          </span>
          <span className="m-com-win-text">{skill.description}</span>
        </>
      }
      chips={
        <fieldset className="m-com-pick m-com-js">
          <legend className="sr-only">{a.pick}</legend>
          {samples.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              aria-pressed={i === index}
              onClick={() => {
                setPaused(true);
                onPick(i);
              }}
            >
              {item.name.split(' · ')[0]}
            </button>
          ))}
        </fieldset>
      }
      meta={
        <>
          <Note>{a.sampleNote}</Note>
          {reduced ? null : (
            <PauseButton
              paused={paused}
              onToggle={() => setPaused((value) => !value)}
              pause={a.pause}
              play={a.play}
            />
          )}
        </>
      }
    >
      <img
        key={skill.slug}
        {...artistImage(skill.slug, skill, '(max-width: 900px) 92vw, 56vw')}
        alt={skill.imageAlt}
        data-tall={(skill.height ?? 0) > (skill.width ?? 0) || undefined}
        loading="lazy"
        decoding="async"
      />
    </Window>
  );
}

// ---------- 网页动效：方法目录里的现场演示 ----------

export function WebWindow({
  slug,
  onPick,
}: {
  slug: string;
  onPick: (slug: string) => void;
}) {
  const entry = technique(slug);
  return (
    <Window
      view="m-com-web"
      caption={
        <>
          <span className="m-com-win-term">
            <b>{entry.name}</b>
            <i lang="en">{entry.english}</i>
          </span>
          <span className="m-com-win-text">{entry.description}</span>
        </>
      }
      chips={
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
      }
    >
      <MethodDemo key={entry.slug} entry={entry} tour />
    </Window>
  );
}

// ---------- niul.ai 与 DropAgent：示意演示，原句挪进窗里 ----------

/** 示意演示的一扇窗：窗下右边是「示意」和暂停 */
function DemoWindow({
  view,
  label,
  steps,
  rest,
  ms,
  on,
  hold = null,
  caption,
  chips,
  children,
}: {
  view: string;
  label: string;
  steps: number;
  rest: number;
  ms: number;
  on: boolean;
  hold?: number | null;
  caption: ReactNode;
  chips?: ReactNode;
  children: (step: number) => ReactNode;
}) {
  const { ref, step, running, reduced, paused, setPaused } =
    useBeat<HTMLDivElement>({ steps, rest, ms, on, hold });
  return (
    <Window
      view={`m-com-demo ${view}`}
      viewRef={ref}
      label={label}
      running={running}
      caption={caption}
      chips={chips}
      meta={
        <>
          <Note>{demos.note}</Note>
          {reduced ? null : (
            <PauseButton
              paused={paused}
              onToggle={() => setPaused((value) => !value)}
            />
          )}
        </>
      }
    >
      <div className="m-com-demo-view" aria-hidden="true">
        {children(step)}
      </div>
    </Window>
  );
}

export function NiulWindow({ on }: { on: boolean }) {
  return (
    <DemoWindow
      view="m-com-niul"
      label={demos.niul.label}
      steps={timeline.length}
      rest={1}
      ms={2600}
      on={on}
      caption={
        <span className="m-com-win-text">
          {appendixTools.niul[1]}
          {appendixTools.niul[2]}
        </span>
      }
    >
      {(step) => <NiulScene step={step} />}
    </DemoWindow>
  );
}

export function DropWindow({
  on,
  hold,
  onHold,
}: {
  on: boolean;
  hold: number | null;
  onHold: (step: number | null) => void;
}) {
  return (
    <DemoWindow
      view="m-com-drop"
      label={demos.drop.label}
      steps={3}
      rest={2}
      ms={2800}
      on={on}
      hold={hold}
      caption={
        <span className="m-com-win-text">
          {appendixTools.drop[1]}
          {appendixTools.drop[2]}
        </span>
      }
      chips={<DropSteps hold={hold} onHold={onHold} />}
    >
      {(now) => <DropScene now={now} />}
    </DemoWindow>
  );
}
