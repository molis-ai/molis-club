'use client';
import { Moon, Pause, Play, Sun } from 'lucide-react';
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { workTour, workWeekend } from '../../../content/site/work';
import { Cue, useCue, useOnScreen, useStill } from '../../_site/cue';
import { Note, Phrases, type Vars } from '../../_site/ui';
import {
  DoneArt,
  HeroArt,
  IdeaArt,
  NodArt,
  RelayArt,
  RulesArt,
  ToolArt,
  TourArt,
} from './scenes';
import { heroScene, momentBeats, momentScenes, tourScenes, type Beat } from './scripts';

// Work 页会动的三块：首屏（一个早上，循环）、全景（七段，按时间一段段走，也能点着跳）、
// 一个周末（画廊：宽屏钉住，滚到哪个时刻换到哪个，每个时刻里再按滚动一拍一拍走；窄屏点着换，按时间演）。都只在视口里、页面在前台、没按暂停时演；
// 减少动态时停在做完的样子；没有 JS 时首屏和周末停在做完的样子，全景停在第一段。

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

export function HeroStage({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useStill();
  const shown = useOnScreen(ref);
  const [paused, setPaused] = useState(false);
  useCue(ref, heroScene, { live: shown && !paused, still });
  return (
    <figure className="wk-hero-fig m-rise" style={{ '--delay': '260ms' } as Vars}>
      <div ref={ref} className="wk-frame" aria-hidden="true">
        <HeroArt />
      </div>
      <figcaption className="wk-foot">
        <span className="sr-only">{label}</span>
        <Note>{NOTE}</Note>
        {still ? null : <Toggle stopped={paused} onToggle={() => setPaused((value) => !value)} />}
      </figcaption>
    </figure>
  );
}

/* ---------- 全景 ---------- */

/** 每一段点亮哪几块（取它们合起来的框） */
const SPOT: Record<string, string[]> = {
  win: ['[data-region="main"]'],
  dock: ['[data-region="dock"]', '[data-spot="dock"]'],
  rail: ['[data-region="rail"]'],
  float: ['[data-spot="float"]'],
  ask: ['[data-region="input"]', '[data-spot="ask"]'],
  agents: ['[data-spot="agents"]'],
  wait: ['[data-spot="wait"]'],
};

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

  // 聚光：量出这一段那几块合起来的框，灰幕在框外
  const place = useCallback(() => {
    const stage = ref.current;
    const scene = stage?.querySelector<HTMLElement>('.wk-tour-scene');
    const win = scene?.querySelector<HTMLElement>('.wk-win');
    const spot = win?.querySelector<HTMLElement>('.wk-spot');
    if (!stage || !scene || !win || !spot) return;
    const box = win.getBoundingClientRect();
    const rects = SPOT[chapter.id]
      .flatMap((selector) => Array.from(scene.querySelectorAll<HTMLElement>(selector)))
      .map((node) => node.getBoundingClientRect())
      .filter((rect) => rect.width && rect.height);
    if (!rects.length) return;
    const left = Math.min(...rects.map((rect) => rect.left)) - box.left;
    const top = Math.min(...rects.map((rect) => rect.top)) - box.top;
    const right = Math.max(...rects.map((rect) => rect.right)) - box.left;
    const bottom = Math.max(...rects.map((rect) => rect.bottom)) - box.top;
    const pad = Math.max(6, box.width * 0.006);
    spot.style.setProperty('--sx', `${left - pad}px`);
    spot.style.setProperty('--sy', `${top - pad}px`);
    spot.style.setProperty('--sw', `${right - left + pad * 2}px`);
    spot.style.setProperty('--sh', `${bottom - top + pad * 2}px`);
  }, [chapter.id]);

  useLayoutEffect(() => {
    place();
    const stage = ref.current;
    if (!stage) return;
    const observer = new ResizeObserver(place);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [place]);

  // 段落下面那道墨线：和聚光框同一个节奏滑到这一段
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
      <div className="wk-tour-top">
        {head}
        <div className="wk-tour-text" aria-live="polite">
          <h3 className="wk-tour-title" key={`t-${active}`}>
            {chapter.title}
          </h3>
          <p className="wk-tour-line" key={`l-${active}`}>
            <Phrases text={chapter.text} />
          </p>
        </div>
      </div>
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
    </div>
  );
}

/* ---------- 一个周末 ---------- */

const ARTS = {
  idea: IdeaArt,
  rules: RulesArt,
  relay: RelayArt,
  nod: NodArt,
  tool: ToolArt,
  done: DoneArt,
};

/** 按滚动分拍的时刻：往下滚到第几拍，就先摆成上一拍、再演这一拍；刚换过来或往回滚，直接摆成那一拍的样子 */
function useBeats(
  ref: RefObject<HTMLElement | null>,
  beats: Beat[] | undefined,
  { beat, live, still, active }: { beat: number; live: boolean; still: boolean; active: boolean },
) {
  const cue = useRef<Cue | null>(null);
  const shown = useRef(-1);
  // 上一拍演完了，停在它该停的样子（光标也还在原处）：往下一拍时直接接着演，不重摆
  const settled = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !beats) return;
    const director = new Cue(node, { play: async () => {} });
    cue.current = director;
    shown.current = -1;
    settled.current = false;
    return () => {
      director.finish();
      cue.current = null;
    };
  }, [ref, beats]);

  useEffect(() => {
    const director = cue.current;
    if (!director || !beats) return;
    director.quiet = still;
    if (still || !active) {
      if (still) director.finish();
      else director.pause();
      shown.current = -1;
      settled.current = false;
      return;
    }
    const from = shown.current;
    if (beat === from) return;
    shown.current = beat;
    const next = settled.current && beat === from + 1;
    settled.current = false;
    const pose = (c: Cue, upto: number) => {
      c.unflag();
      c.stage.querySelectorAll<HTMLElement>('[data-hand]').forEach((hand) => {
        delete hand.dataset.on;
        delete hand.dataset.shape;
      });
      beats.slice(0, upto + 1).forEach((step) => step.mark?.(c));
    };
    const play = beats[beat]?.play;
    // 往下滚、没按暂停：演这一拍；往回滚、暂停着：直接摆上（CSS 过渡自己倒回去）。
    // 刚换到这个时刻时不带过渡地摆，淡入的时候已经是这一拍的样子
    if (play && live && from >= 0 && beat > from)
      director.act(async (c) => {
        if (!next) pose(c, beat - 1);
        await play(c);
        settled.current = true;
      });
    else
      director.act((c) => {
        if (from < 0) c.snap(() => pose(c, beat));
        else pose(c, beat);
        settled.current = true;
      });
  }, [beats, beat, live, still, active]);

  useEffect(() => {
    const director = cue.current;
    if (!director || shown.current < 0) return;
    if (live && active && !still) director.play();
    else director.pause();
  }, [beats, live, active, still, beat]);
}

function Moment({
  id,
  label,
  active,
  live,
  still,
  round,
  beat,
  pinned,
}: {
  id: keyof typeof ARTS;
  label: string;
  active: boolean;
  live: boolean;
  still: boolean;
  round: number;
  beat: number;
  pinned: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const beats = pinned ? momentBeats[id] : undefined;
  useCue(ref, beats ? undefined : momentScenes[id], { live, still, active, round });
  useBeats(ref, beats, { beat, live, still, active });
  const Art = ARTS[id];
  return (
    <div className="wk-moment" data-on={active || undefined}>
      <div ref={ref} className="wk-frame" aria-hidden="true">
        <Art />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

const PIN = '(min-width: 901px) and (min-height: 620px)';

// 钉住时每一拍占多长的滚动（单位 svh），大约四分之一屏；一个时刻几拍就几段
const BEAT_SPAN = 26;
const SPANS = workWeekend.moments.map((moment) => momentBeats[moment.id].length * BEAT_SPAN);
const STARTS = SPANS.map((_, index) => SPANS.slice(0, index).reduce((sum, span) => sum + span, 0));
const TOTAL = SPANS.reduce((sum, span) => sum + span, 0);

export function Weekend({ head }: { head: ReactNode }) {
  const { moments } = workWeekend;
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const still = useStill();
  const shown = useOnScreen(stage);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const [beat, setBeat] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [round, setRound] = useState(0);
  const lock = useRef<number | null>(null);
  const unlock = useRef(0);
  const count = moments.length;

  // 宽屏钉住：滚过的距离一个时刻一个时刻地换，分拍的时刻里再一拍一拍地走（原生滚动，倒回去也行）
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const media = matchMedia(PIN);
    let frame = 0;
    const read = () => {
      frame = 0;
      setPinned(media.matches);
      if (!media.matches) return;
      const rect = node.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      if (span <= 0) return;
      const at = Math.min(0.9999, Math.max(0, -rect.top / span)) * TOTAL;
      const index = STARTS.findLastIndex((start) => start <= at);
      if (lock.current !== null) {
        if (index !== lock.current) return;
        lock.current = null;
      }
      setActive(index);
      setBeat(Math.min(momentBeats[moments[index].id].length - 1, Math.floor((at - STARTS[index]) / BEAT_SPAN)));
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
      window.clearTimeout(unlock.current);
    };
  }, [moments]);

  // 左栏总高不随时刻变：当下这一行的说明比最长的那段短多少，列表底下就补多少，换时刻时左栏不上下跳
  useLayoutEffect(() => {
    const node = list.current;
    if (!node) return;
    const fit = () => {
      const lines = Array.from(node.querySelectorAll<HTMLElement>('.wk-gal-more')).map(
        (more) => more.scrollHeight - parseFloat(getComputedStyle(more).paddingTop),
      );
      node.style.setProperty('--rest', `${Math.max(...lines) - (lines[active] ?? 0)}px`);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  const go = (index: number) => {
    const node = root.current;
    if (index === active) setRound((value) => value + 1);
    setActive(index);
    setBeat(0);
    if (!node) return;
    if (!matchMedia(PIN).matches) {
      stage.current?.scrollIntoView({ block: 'nearest', behavior: still ? 'auto' : 'smooth' });
      return;
    }
    const rect = node.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    if (span <= 0) return;
    lock.current = index;
    window.clearTimeout(unlock.current);
    unlock.current = window.setTimeout(() => {
      lock.current = null;
    }, 1200);
    // 落在这个时刻的第 0 拍，从头往下滚
    window.scrollTo({
      top: window.scrollY + rect.top + (span * (STARTS[index] + BEAT_SPAN / 2)) / TOTAL,
      behavior: still ? 'auto' : 'smooth',
    });
  };

  const onKey = (event: KeyboardEvent, index: number) => {
    const step = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0;
    const to = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : step ? (index + step + count) % count : -1;
    if (to < 0) return;
    event.preventDefault();
    tabs.current[to]?.focus();
    go(to);
  };

  return (
    <div ref={root} className="wk-gal" style={{ '--span': TOTAL } as Vars}>
      <div className="wk-gal-pin">
        <div className="m-wrap wk-gal-grid">
          <div className="wk-gal-text">
            {head}
            <div ref={list} className="wk-gal-list" role="tablist" aria-label={workWeekend.label}>
              {moments.map((moment, index) => (
                <Fragment key={moment.id}>
                  {index === 0 || moments[index - 1].day !== moment.day ? (
                    <span className="wk-gal-day" data-done={index <= active || undefined} aria-hidden="true">
                      {moment.day}
                    </span>
                  ) : null}
                  <button
                    ref={(node) => {
                      tabs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`wk-gal-tab-${index}`}
                    aria-selected={index === active}
                    aria-controls="wk-gal-stage"
                    tabIndex={index === active ? 0 : -1}
                    className="wk-gal-tab"
                    data-done={index < active || undefined}
                    onClick={() => go(index)}
                    onKeyDown={(event) => onKey(event, index)}
                  >
                    <span className="wk-gal-when">
                      <span className="sr-only">{moment.day} </span>
                      {moment.time}
                    </span>
                    <span className="wk-gal-name">
                      <Phrases text={moment.title} />
                    </span>
                    <span className="wk-gal-more">
                      <Phrases text={moment.text} />
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="wk-gal-show">
            <div
              ref={stage}
              id="wk-gal-stage"
              className="wk-gal-stage"
              role="tabpanel"
              aria-labelledby={`wk-gal-tab-${active}`}
            >
              {moments.map((moment, index) => (
                <Moment
                  key={moment.id}
                  id={moment.id}
                  label={moment.label}
                  active={index === active}
                  live={shown && !paused}
                  still={still}
                  round={index === active ? round : 0}
                  beat={index === active ? beat : 0}
                  pinned={pinned}
                />
              ))}
            </div>
            <div className="wk-foot">
              <Note>{NOTE}</Note>
              {still ? null : <Toggle stopped={paused} onToggle={() => setPaused((value) => !value)} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
