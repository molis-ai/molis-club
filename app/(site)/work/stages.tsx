'use client';
import { Moon, Pause, Play, Sun } from 'lucide-react';
import {
  useCallback,
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
  useCue(ref, heroScene, { live: shown && !paused, still });
  return (
    <figure className="wk-hero-fig m-rise" style={{ '--delay': '260ms' } as Vars}>
      <div className="wk-stage" style={{ '--avg': STAGE.avg } as Vars}>
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
        <div ref={ref} className="wk-frame" aria-hidden="true">
          <HeroArt />
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

  const next = useCallback(() => setActive((index) => (index + 1) % chapters.length), [chapters.length]);
  useCue(ref, tourScenes[chapter.id], {
    live: shown && !paused,
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
