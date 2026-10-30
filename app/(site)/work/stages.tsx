'use client';
import { Moon, Pause, Play, Sun } from 'lucide-react';
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
import { Ring } from './app';
import { HeroArt, TourArt } from './scenes';
import { heroScene, tourScenes } from './scripts';

// Work 页会动的两块：首屏（一个早上，循环；窗口落在一块舞台上，窗外是菜单栏的「等你」和你的终端）、
// 全景（六段，镜头一段段推过去，也能点着跳）；用起来的四个 case 在 cases.tsx。
// 两块合在一个钉住的一屏里（Opening）：往下滚，首屏那扇窗推近成全景的大窗，推到了全景才开始演。
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
   宽屏、不减少动态、有 JS 时，舞台和全景叠在同一个钉住的一屏里（work.css 的 .wk-open）。
   往下滚的进度是 useSiteMotion 写的 --pin；这里只量两扇窗各自的中心和宽，算出首屏那扇窗挪到全景那扇窗要平移多少、放大几倍
   （--dx、--dy、--s），样式按进度把两扇窗摆到同一处：路上先推近一点，最近的时候换成「发布说明」，再落定成全景的大窗。
   钉住时全景排得紧（标题和说明一行、段落条一行），窗口一般比首屏那扇大：一路放大到底，停在那么大接着演。
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
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState({ pinned: false, arrived: true });

  useEffect(() => {
    const root = ref.current;
    const layer = root?.querySelector<HTMLElement>('.wk-open-pin');
    const from = root?.querySelector<HTMLElement>('.wk-stage-win');
    const to = root?.querySelector<HTMLElement>('.wk-tour-frame');
    if (!root || !layer || !from || !to) return;
    const query = matchMedia(PINNED);
    let frame = 0;
    let push = false;

    const measure = () => {
      const a = boxIn(from, layer);
      const b = boxIn(to, layer);
      const ratio = b.w / (a.w || 1);
      push = query.matches;
      root.toggleAttribute('data-push', push);
      if (!push) return;
      root.style.setProperty('--dx', `${b.cx - a.cx}`);
      root.style.setProperty('--dy', `${b.cy - a.cy}`);
      root.style.setProperty('--s', `${ratio}`);
      // 中段（--e = 0.5）的大小 = 两头的平均 + --b；全景的窗更大时不绕，一路放大
      root.style.setProperty('--b', `${ratio >= 1 ? 0 : Math.max(0, NEAREST - (1 + ratio) / 2)}`);
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
    // 两扇窗的位置会跟着别的东西变（全景标题换行、字体载入），所以连它们所在的整块一起看
    const observer = new ResizeObserver(change);
    for (const node of [layer, to, to.parentElement, from.parentElement]) if (node) observer.observe(node);
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
      <section
        ref={ref}
        className="wk-open"
        data-scene
        data-arrived={state.arrived || undefined}
        aria-labelledby="wk-tour-title"
      >
        <div className="wk-open-pin">
          <div className="wk-open-hero m-wrap">{hero}</div>
          <div className="wk-open-tour wk-tour-sec">
            <div className="m-wrap">{tour}</div>
          </div>
        </div>
      </section>
    </OpeningState.Provider>
  );
}

/* ---------- 首屏 ---------- */

const STAGE = mediaOf('work-stage');

/**
 * 窗口外面的两样：菜单栏里的「等你」胶囊，和你自己终端里的 Codex（它交回来的，就是窗口里那条「修好了 #12」）。
 * 和窗口同一个尺寸单位（work.css 的 --w）；跟着首屏的编排走，但不进编排：样式看窗口里哪几条事件已经出现。
 */
function HeroAside() {
  const { wait, term } = workHeroStage;
  return (
    <div className="wk-scene wk-aside" aria-hidden="true">
      <p className="wk-capsule">
        <Ring tone="attention" />
        {wait}
      </p>
      <div className="wk-term">
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
    <figure className="wk-hero-fig m-rise" style={{ '--delay': '260ms' } as Vars}>
      <div className="wk-stage" style={{ '--avg': STAGE.avg } as Vars}>
        <div className="wk-stage-photo">
          <img
            className="wk-stage-img"
            src={STAGE.src}
            srcSet={STAGE.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
            sizes="(max-width: 900px) 100vw, min(92vw, 1328px)"
            width={STAGE.width}
            height={STAGE.height}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <div className="wk-stage-win">
          <div ref={ref} className="wk-frame" aria-hidden="true">
            <HeroArt />
          </div>
        </div>
        <HeroAside />
      </div>
      <figcaption className="wk-foot">
        <span className="sr-only">
          {label}
          {workHeroStage.label}
        </span>
        <Note>{NOTE}</Note>
        {still ? null : <Toggle stopped={paused} onToggle={() => setPaused((value) => !value)} />}
      </figcaption>
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
  const row = useRef<HTMLDivElement>(null);
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

  // 段落下面那道墨线：和镜头同一个节奏滑到这一段
  useLayoutEffect(() => {
    const list = row.current;
    const tab = tabs.current[active];
    if (!list || !tab) return;
    const set = () => {
      list.style.setProperty('--ix', `${tab.offsetLeft}px`);
      list.style.setProperty('--iy', `${tab.offsetTop + tab.offsetHeight}px`);
      list.style.setProperty('--iw', `${tab.offsetWidth}px`);
    };
    set();
    const observer = new ResizeObserver(set);
    observer.observe(list);
    return () => observer.disconnect();
  }, [active]);

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
      <div className="wk-tour-under">
        <div ref={row} className="wk-tour-tabs" role="tablist" aria-label={workTour.kicker}>
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
          <i className="wk-tour-ind" aria-hidden="true" />
        </div>
        <div className="wk-tour-tools">
          <Note>{NOTE}</Note>
          <fieldset className="wk-theme">
            <legend className="sr-only">{workTour.theme.label}</legend>
            {(['light', 'dark'] as const).map((value) => {
              const Icon = value === 'light' ? Sun : Moon;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={theme === value}
                  aria-label={workTour.theme[value]}
                  title={workTour.theme[value]}
                  onClick={() => setTheme(value)}
                >
                  <Icon aria-hidden="true" />
                </button>
              );
            })}
          </fieldset>
          {still ? null : <Toggle stopped={paused} onToggle={() => setPaused((value) => !value)} />}
        </div>
      </div>
      <div className="wk-tour-cap" aria-live="polite">
        <p key={active}>
          <span className="wk-tour-cap-t">{chapter.title}</span>
          <Phrases text={chapter.text} />
        </p>
      </div>
    </div>
  );
}
