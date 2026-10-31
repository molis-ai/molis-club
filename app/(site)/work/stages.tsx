'use client';
import { Pause, Play } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { workHeroStage, workTour, type TourChapterId } from '../../../content/site/work';
import { useCue, useOnScreen, useStill } from '../../_site/cue';
import { mediaOf, Note, Phrases, type Vars } from '../../_site/ui';
import { HeroArt, TourArt } from './scenes';
import { heroScene, tourScenes } from './scripts';

// Work 页会动的两块：首屏（一个早上，循环；窗口放在一块照片台面上，终端压在窗口左边）、
// 全景（六段，镜头一段段推过去，也能点着跳）；用起来的四个 case 在 cases.tsx。
// 两块合在一个钉住的一屏里（Opening）：往下滚，首屏的字退开，那扇窗推近成全景的大窗，照片台面淡成浅灰台面，推到了全景才开始演。
// 都只在视口里、页面在前台、没按暂停时演；减少动态时停在做完的样子；没有 JS 时首屏停在做完的样子，全景停在第一段。

const NOTE = '界面示意 · 示例数据';

function Toggle({ stopped, onToggle }: { stopped: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="wk-toggle"
      aria-pressed={stopped}
      aria-label={stopped ? '继续播放演示' : '暂停演示'}
      onClick={onToggle}
    >
      {stopped ? (
        <Play size={12} fill="currentColor" aria-hidden="true" />
      ) : (
        <Pause size={12} fill="currentColor" aria-hidden="true" />
      )}
    </button>
  );
}

/* ---------- 首屏推近成全景（Opening） ----------
   宽屏、不减少动态、有 JS 时，首屏（字和照片台面）和全景（标题、六段和浅灰台面）叠在同一个钉住的一屏里（work.css 的 .wk-open）。
   往下滚的进度是 useSiteMotion 写的 --pin；这里量两扇窗各自的中心和宽，算出首屏那扇窗挪到全景那扇窗要平移多少、放大几倍
   （--dx、--dy、--s），再量两块台面的位置和大小（--ax… 到 --bx…），样式按进度把窗和台面一起挪过去：
   路上先推近一点，最近的时候换成「发布说明」，再落定成全景的大窗；照片淡掉，台面落成浅灰的那块。
   全景的窗比首屏那扇还小时（很矮的宽屏），路上先多推近一截（--b）再落定，不显得是缩小。推到了（arrived）全景才开始演、首屏停下。
   其余情况不钉住（data-push 不写），两块照常上下排，arrived 一直是 true。 */

const PINNED = '(min-width: 901px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)';
/** 推近在 --pin 的 0.06–0.72 之间走完（work.css 的 --t），过了 0.74 算推到了 */
const ARRIVE = 0.74;
/** 全景的窗比首屏那扇小时，路上至少推到首屏那扇的这么大 */
const NEAREST = 1.08;

const OpeningState = createContext({ pinned: false, arrived: true });

/** 一个元素在钉住那一层里的位置和大小（offset 不算 transform，推到一半量也准） */
function boxIn(node: HTMLElement, layer: HTMLElement) {
  let x = 0;
  let y = 0;
  let at: HTMLElement | null = node;
  while (at && at !== layer) {
    x += at.offsetLeft;
    y += at.offsetTop;
    at = at.offsetParent as HTMLElement | null;
  }
  const w = node.offsetWidth;
  const h = node.offsetHeight;
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

export function Opening({ hero, tour }: { hero: ReactNode; tour: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ pinned: false, arrived: true });

  useEffect(() => {
    const root = ref.current;
    const layer = root?.querySelector<HTMLElement>('.wk-open-pin');
    const from = root?.querySelector<HTMLElement>('.wk-stage-win');
    const to = root?.querySelector<HTMLElement>('.wk-tour-frame');
    const plates = [root?.querySelector<HTMLElement>('.wk-stage'), root?.querySelector<HTMLElement>('.wk-tour-plate')];
    if (!root || !layer || !from || !to || !plates[0] || !plates[1]) return;
    const query = matchMedia(PINNED);
    let frame = 0;
    let push = false;

    const measure = () => {
      push = query.matches;
      root.toggleAttribute('data-push', push);
      if (!push) return;
      const a = boxIn(from, layer);
      const b = boxIn(to, layer);
      const ratio = b.w / (a.w || 1);
      root.style.setProperty('--dx', `${b.cx - a.cx}`);
      root.style.setProperty('--dy', `${b.cy - a.cy}`);
      root.style.setProperty('--s', `${ratio}`);
      // 中段（--e = 0.5）的大小 = 两头的平均 + --b；全景的窗更大时不绕，一路放大
      root.style.setProperty('--b', `${ratio >= 1 ? 0 : Math.max(0, NEAREST - (1 + ratio) / 2)}`);
      plates.forEach((plate, index) => {
        const box = boxIn(plate!, layer);
        const name = index ? 'b' : 'a';
        root.style.setProperty(`--${name}x`, `${box.x}`);
        root.style.setProperty(`--${name}y`, `${box.y}`);
        root.style.setProperty(`--${name}w`, `${box.w}`);
        root.style.setProperty(`--${name}h`, `${box.h}`);
      });
    };
    const update = () => {
      frame = 0;
      const pinned = push;
      let arrived = true;
      if (pinned) {
        const rect = root.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        arrived = span > 0 && -rect.top / span >= ARRIVE;
      }
      setState((now) => (now.pinned === pinned && now.arrived === arrived ? now : { pinned, arrived }));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const change = () => {
      measure();
      request();
    };

    change();
    // 两扇窗、两块台面的位置会跟着别的东西变（标题换行、字体载入），所以连它们所在的整块一起看
    const observer = new ResizeObserver(change);
    for (const node of [layer, to, to.parentElement, from.parentElement, ...plates]) if (node) observer.observe(node);
    void document.fonts?.ready.then(change);
    query.addEventListener('change', change);
    window.addEventListener('scroll', request, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      query.removeEventListener('change', change);
      window.removeEventListener('scroll', request);
    };
  }, []);

  return (
    <OpeningState.Provider value={state}>
      <div ref={ref} className="wk-open" data-scene data-arrived={state.arrived || undefined}>
        <div className="wk-open-pin">
          <i className="wk-open-plate" aria-hidden="true" />
          <div className="wk-open-hero m-wrap">{hero}</div>
          <section className="wk-open-tour wk-tour-sec" aria-label={workTour.kicker}>
            <div className="m-wrap">{tour}</div>
          </section>
        </div>
      </div>
    </OpeningState.Provider>
  );
}

/* ---------- 首屏 ---------- */

const STAGE = mediaOf('work-stage');

/**
 * 你自己终端里的 Codex（它交回来的，就是窗口里那条「修好了 #12」），压在窗口左边。
 * 和窗口同一个尺寸单位（窗宽的 1/64）；跟着首屏的编排走，但不进编排：样式看窗口里哪几条事件已经出现。
 */
function HeroTerm() {
  const { term } = workHeroStage;
  return (
    <div className="wk-scene wk-aside wk-term" aria-hidden="true">
      <p className="wk-term-h">
        <i />
        <i />
        <i />
        {term.title}
      </p>
      {term.lines.map((line, index) => (
        <p key={index} className={line.ok ? 'wk-term-l wk-ok' : 'wk-term-l'} data-l={index}>
          {line.dim ? <span className="wk-dim">{line.dim} </span> : null}
          {line.ok ? `✓ ${line.text}` : line.text}
        </p>
      ))}
    </div>
  );
}

export function HeroStage({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useStill();
  const shown = useOnScreen(ref);
  const [paused, setPaused] = useState(false);
  const { pinned, arrived } = useContext(OpeningState);
  useCue(ref, heroScene, { live: shown && !paused && !(pinned && arrived), still });
  return (
    <figure className="wk-stage wk-plate m-rise" style={{ '--avg': STAGE.avg, '--delay': '260ms' } as Vars}>
      <div className="wk-stage-photo">
        <img
          className="wk-stage-img"
          src={STAGE.src}
          srcSet={STAGE.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
          sizes="(max-width: 900px) 100vw, min(100vw - 40px, 1480px)"
          width={STAGE.width}
          height={STAGE.height}
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <div className="wk-stage-set">
        <div className="wk-stage-win">
          <div ref={ref} className="wk-frame" aria-hidden="true">
            <HeroArt />
          </div>
          <HeroTerm />
        </div>
        <figcaption className="wk-foot">
          <span className="sr-only">
            {label}
            {workHeroStage.label}
          </span>
          <Note>{NOTE}</Note>
          {still ? null : <Toggle stopped={paused} onToggle={() => setPaused((value) => !value)} />}
        </figcaption>
      </div>
    </figure>
  );
}

/* ---------- 全景 ---------- */

/** 每一段镜头推到哪几块（取它们合起来的框）；空的就是整扇窗 */
const CAM: Record<TourChapterId, string[]> = {
  project: [],
  plugins: ['[data-region="dock"]', '[data-spot="plugins"]'],
  ask: ['[data-spot="sel"]', '[data-spot="ask"]'],
  agents: ['[data-spot="row"]', '[data-spot="agents"]'],
  talk: ['[data-c="t-talk-tab"]', '[data-spot="talk"]'],
  wait: ['[data-region="input"]', '[data-spot="waitlist"]'],
};

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

export function Tour({ head }: { head: ReactNode }) {
  const { chapters } = workTour;
  const ref = useRef<HTMLDivElement>(null);
  const still = useStill();
  const shown = useOnScreen(ref, 0.45);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const [round, setRound] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const chapter = chapters[active];
  // 首屏那扇窗还没推过来时不演：推到了才从第一段开始
  const { arrived } = useContext(OpeningState);

  const next = useCallback(() => setActive((index) => (index + 1) % chapters.length), [chapters.length]);
  useCue(ref, tourScenes[chapter.id], {
    live: shown && !paused && arrived,
    still,
    round,
    onEnd: still ? undefined : next,
  });

  // 镜头：量出这一段那几块合起来的框，推近到它（宽屏最多 1.5 倍，窄屏 2.2 倍），窗口始终铺满画框。
  // 光标在镜头外面一层，不跟着放大，量到的位置就是看到的位置
  const aim = useCallback(() => {
    const cam = ref.current?.querySelector<HTMLElement>('.wk-cam');
    if (!cam) return;
    const width = cam.offsetWidth;
    const height = cam.offsetHeight;
    const box = cam.getBoundingClientRect();
    const now = box.width / width || 1;
    const rects = CAM[chapter.id]
      .flatMap((selector) => Array.from(cam.querySelectorAll<HTMLElement>(selector)))
      .map((node) => node.getBoundingClientRect())
      .filter((rect) => rect.width && rect.height);
    if (!rects.length) {
      cam.style.transform = '';
      return;
    }
    const left = (Math.min(...rects.map((rect) => rect.left)) - box.left) / now;
    const top = (Math.min(...rects.map((rect) => rect.top)) - box.top) / now;
    const right = (Math.max(...rects.map((rect) => rect.right)) - box.left) / now;
    const bottom = (Math.max(...rects.map((rect) => rect.bottom)) - box.top) / now;
    const most = width < 560 ? 2.2 : 1.5;
    const zoom = clamp(Math.min((width * 0.88) / (right - left), (height * 0.88) / (bottom - top)), 1, most);
    const x = clamp(width / 2 - (zoom * (left + right)) / 2, width - zoom * width, 0);
    const y = clamp(height / 2 - (zoom * (top + bottom)) / 2, height - zoom * height, 0);
    cam.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
  }, [chapter.id]);

  useLayoutEffect(() => {
    aim();
    const stage = ref.current;
    if (!stage) return;
    const observer = new ResizeObserver(aim);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [aim]);

  const go = (index: number) => {
    if (index === active) setRound((value) => value + 1);
    setActive(index);
  };

  const onKey = (event: KeyboardEvent, index: number) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const to = (index + step + chapters.length) % chapters.length;
    tabs.current[to]?.focus();
    go(to);
  };

  return (
    <div className="wk-tour">
      {head}
      <div className="wk-tour-side">
        <div className="wk-tour-tabs" role="tablist" aria-labelledby="wk-tour-title">
          {chapters.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`wk-tour-tab-${index}`}
              aria-selected={index === active}
              aria-controls="wk-tour-stage"
              tabIndex={index === active ? 0 : -1}
              className="wk-tour-tab"
              onClick={() => go(index)}
              onKeyDown={(event) => onKey(event, index)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="wk-tour-cap" aria-live="polite">
          <p key={active}>
            <span className="wk-tour-cap-t">{chapter.title}</span>
            <Phrases text={chapter.text} />
          </p>
        </div>
      </div>
      <figure className="wk-tour-plate wk-plate">
        <div className="wk-tour-set">
          <div
            ref={ref}
            className="wk-frame wk-tour-frame"
            data-focus={chapter.id}
            role="tabpanel"
            id="wk-tour-stage"
            aria-labelledby={`wk-tour-tab-${active}`}
          >
            <div aria-hidden="true">
              <TourArt theme={theme} />
            </div>
            <p className="sr-only">{workTour.label}</p>
          </div>
          <figcaption className="wk-foot">
            <Note>{NOTE}</Note>
            <fieldset className="wk-theme">
              <legend className="sr-only">{workTour.theme.label}</legend>
              {(['light', 'dark'] as const).map((value) => (
                <button key={value} type="button" aria-pressed={theme === value} onClick={() => setTheme(value)}>
                  {workTour.theme[value]}
                </button>
              ))}
            </fieldset>
            {still ? null : <Toggle stopped={paused} onToggle={() => setPaused((value) => !value)} />}
          </figcaption>
        </div>
      </figure>
    </div>
  );
}
