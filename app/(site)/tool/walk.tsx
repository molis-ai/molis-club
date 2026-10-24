'use client';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Vars } from '../../_site/ui';
import { useCue } from './cue';
import { HoldContext, LoopToggle, useOnScreen, useStill } from './stage';

// 首屏以后的一长段（specs/site-rebuild/tool-page.md 第 13 节）：右边一块 Mac 屏幕钉住，左边的字一段一段滚过去。
// 哪段字压过视口中线，右边就换成那一段的屏幕（只交叉淡入淡出，不位移）；换到它时从空白开始演，换走时停在原处。
// 没有自己屏幕的一段（眼前的小事的开头）沿用下一段的。
// 分拍的一段（以前与现在）：钉住时每拍占一屏，字停着不动，滚过一屏换演下一拍；字里的「以前」「现在」也能点，点了滚到那一拍。
// 窄屏、矮屏、没有 JS：不钉，每段字下面跟着自己的屏幕，进入视口就演；分拍的一段连着演，点了哪拍就只演哪拍。
// 减少动态时停在做完的样子，也不分拍。

export type Scene = {
  /** scripts.ts 里那一段编排的名字 */
  cue: string;
  /** 屏幕自己的类名：tl-shift、tl-case、tl-plug（tool.css 按它摆每一拍） */
  kind: string;
  /** 读屏用：画面在演什么 */
  label: string;
  /** 屏幕下面那行「示意」 */
  note: ReactNode;
  /** 画面里有访客能按的东西：不再整块对读屏隐藏，由零件自己标 */
  interactive?: boolean;
  art: ReactNode;
};

export type Stop = {
  id: string;
  text: ReactNode;
  scene?: Scene;
  /** 分几拍：scripts.ts 里每拍一段「名字-拍」；不分拍时演「名字」那一整段 */
  phases?: string[];
};

const PIN = 'screen and (min-width: 901px) and (min-height: 600px)';

/** 字里那几拍的名字：当下是哪拍，点了去哪拍 */
const PhaseContext = createContext<{
  phase: string | null;
  go: (phase: string) => void;
} | null>(null);

/** 「以前」「现在」这样的小标题：能换拍时是一个按钮，否则只是字 */
export function Phase({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  const context = useContext(PhaseContext);
  if (!context) return <b>{children}</b>;
  return (
    <button
      type="button"
      className="tl-phase"
      aria-pressed={context.phase === name}
      onClick={() => context.go(name)}
    >
      {children}
    </button>
  );
}

/** 顶栏下面那一屏：多高，中线在哪（顶栏高 --header 定在站点外壳 .m 上，从这一段读） */
function view(node: HTMLElement) {
  const header =
    parseFloat(getComputedStyle(node).getPropertyValue('--header')) || 0;
  return {
    line: (window.innerHeight + header) / 2,
    screen: window.innerHeight - header,
  };
}

const sum = (list: number[]) => list.reduce((total, n) => total + n, 0);

/** 一块屏幕和下面那行小字；钉住时几块叠在一起，只亮当下这一块 */
function Figure({
  scene,
  cue,
  round,
  on,
  active,
  paused,
  setPaused,
}: {
  scene: Scene;
  /** 这会儿演哪段编排：分拍时是当下那一拍 */
  cue: string;
  round: number;
  on: boolean;
  active: boolean;
  paused: boolean;
  setPaused: (value: boolean) => void;
}) {
  const box = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const still = useStill();
  const shown = useOnScreen(box);
  const [hold, setHold] = useState<string | null>(null);
  useCue(stage, cue, {
    live: shown && !paused,
    still,
    hold,
    active,
    round,
  });
  return (
    <figure ref={box} className="tl-walk-fig" data-on={on || undefined}>
      <HoldContext.Provider value={{ hold, setHold }}>
        <div
          ref={stage}
          className={`tl-mac ${scene.kind}`}
          aria-hidden={scene.interactive ? undefined : 'true'}
        >
          {scene.art}
        </div>
      </HoldContext.Provider>
      <figcaption className="tl-foot">
        <span className="sr-only">{scene.label}</span>
        <span className="tl-note">{scene.note}</span>
        {still ? null : (
          <LoopToggle
            stopped={paused || hold !== null}
            onToggle={() => {
              if (hold !== null) {
                setHold(null);
                setPaused(false);
              } else setPaused(!paused);
            }}
          />
        )}
      </figcaption>
    </figure>
  );
}

export function Walk({ stops }: { stops: Stop[] }) {
  const root = useRef<HTMLDivElement>(null);
  const still = useStill();
  const [at, setAt] = useState(0);
  const [pinned, setPinned] = useState(false);
  // 钉住时，每段滚到了第几拍（不分拍的段落总是 0）
  const [parts, setParts] = useState<number[]>([]);
  // 不钉时访客点的那一拍；没点过就整段连着演
  const [picked, setPicked] = useState<{ id: string; phase: string } | null>(
    null,
  );
  // 点了正在演的那一拍：从头再演
  const [round, setRound] = useState(0);
  // 暂停是整段的：换到下一块屏幕也还停着
  const [paused, setPaused] = useState(false);
  // 每一段亮哪块屏幕：自己的，没有就用往下第一块
  const shows = stops.map((_, index) =>
    stops.findIndex((stop, later) => later >= index && stop.scene),
  );
  // 钉住时每段占几屏、从第几行开始
  const spans = stops.map((stop) =>
    stop.phases && !still ? stop.phases.length : 1,
  );
  const rows = spans.map((_, index) => 1 + sum(spans.slice(0, index)));

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const media = matchMedia(PIN);
    const texts = Array.from(
      node.querySelectorAll<HTMLElement>('.tl-walk-text'),
    );
    let frame = 0;
    const read = () => {
      frame = 0;
      setPinned(media.matches);
      // 顶栏下面那块的中线：哪段字的上沿过了这条线，就是哪段；分拍的一段过线以后每滚一屏换一拍
      const { line, screen } = view(node);
      let found = 0;
      const next = texts.map((text, index) => {
        const past = line - text.getBoundingClientRect().top;
        if (past >= 0) found = index;
        const span = Number(text.dataset.span ?? 1);
        return Math.min(span - 1, Math.max(0, Math.floor(past / screen)));
      });
      setAt(found);
      setParts((prev) =>
        next.length === prev.length &&
        next.every((part, index) => part === prev[index])
          ? prev
          : next,
      );
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    request();
    media.addEventListener('change', request);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      media.removeEventListener('change', request);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, [still]);

  /** 点了字里的「以前」「现在」：钉住时滚到那一拍那一屏的正中；不钉时就地换演那一拍 */
  const go = (index: number, phase: string) => {
    const stop = stops[index];
    const node = root.current;
    const text = node?.querySelectorAll<HTMLElement>('.tl-walk-text')[index];
    setPaused(false);
    if (!pinned || !node || !text) {
      setPicked({ id: stop.id, phase });
      setRound((value) => value + 1);
      return;
    }
    const part = stop.phases?.indexOf(phase) ?? 0;
    if (part === parts[index]) setRound((value) => value + 1);
    const { line, screen } = view(node);
    window.scrollBy({
      top: text.getBoundingClientRect().top - (line - (part + 0.5) * screen),
      behavior: 'smooth',
    });
  };

  return (
    <div
      ref={root}
      className="m-wrap tl-walk"
      style={{ '--rows': sum(spans) } as Vars}
    >
      {stops.map((stop, index) => {
        const phase =
          stop.phases && !still
            ? pinned
              ? stop.phases[parts[index] ?? 0]
              : picked?.id === stop.id
                ? picked.phase
                : null
            : null;
        return (
          <div key={stop.id} className="tl-walk-step">
            <PhaseContext.Provider
              value={
                stop.phases && !still
                  ? { phase, go: (name) => go(index, name) }
                  : null
              }
            >
              <div
                className="tl-walk-text"
                data-on={index === at || undefined}
                data-span={spans[index] > 1 ? spans[index] : undefined}
                data-phase={phase ?? undefined}
                style={{ '--row': rows[index], '--span': spans[index] } as Vars}
              >
                {/* 分拍的一段一开始就包好：水合以后再包会把标题换成新节点，浮现就接不上了 */}
                {stop.phases ? (
                  <div className="tl-walk-hold">{stop.text}</div>
                ) : (
                  stop.text
                )}
              </div>
            </PhaseContext.Provider>
            {stop.scene ? (
              <Figure
                scene={stop.scene}
                cue={phase ? `${stop.scene.cue}-${phase}` : stop.scene.cue}
                round={stop.phases ? round : 0}
                on={shows[at] === index}
                active={!pinned || shows[at] === index}
                paused={paused}
                setPaused={setPaused}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
