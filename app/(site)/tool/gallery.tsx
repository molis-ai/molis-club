'use client';
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { Tone } from '../../../content/site/tool';
import type { Vars } from '../../_site/ui';
import { useCue } from './cue';
import { LoopToggle, useOnScreen, useStill } from './stage';

// 眼前的小事：像画廊那样在一个位置看完六件。左边是六件事的名字，右边一块墙板挂着当下这一件。
// 宽屏一屏放得下时整段钉住，滚到哪件换到哪件（原生滚动，倒回去也行）；点名字直接滚到那一件，再点一下重演。
// 每一件有自己的编排（scripts.ts 的 m-*）：换到它时从空白开始演，换走时停在原处淡出。
// 窄屏不钉，名字在墙板上面，点名字换。减少动态时停在做完的样子。没有 JS 时停在第一件，名字都在。

export type Piece = {
  title: string;
  tone: Tone;
  kind: 'local' | 'ai' | 'wip';
  tag: string;
  icon: ReactNode;
  /** scripts.ts 里那一段编排的名字 */
  cue: string;
  art: ReactNode;
};

/** 墙板上的一件：自己的舞台，自己的编排 */
function Art({
  piece,
  active,
  live,
  still,
  round,
}: {
  piece: Piece;
  active: boolean;
  live: boolean;
  still: boolean;
  round: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useCue(ref, piece.cue, { live, still, active, round });
  return (
    <div
      ref={ref}
      className="tl-gal-art"
      data-on={active || undefined}
      aria-hidden="true"
    >
      {piece.art}
    </div>
  );
}

const PIN = '(min-width: 901px) and (min-height: 600px)';

export function Gallery({
  label,
  head,
  foot,
  pieces,
}: {
  label: string;
  head: ReactNode;
  foot: ReactNode;
  pieces: Piece[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const still = useStill();
  const shown = useOnScreen(stage);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const [round, setRound] = useState(0);
  // 点名字滚过去的路上，不让中间几件一闪而过
  const lock = useRef<number | null>(null);
  const unlock = useRef(0);
  const count = pieces.length;

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const media = matchMedia(PIN);
    let frame = 0;
    const read = () => {
      frame = 0;
      if (!media.matches) return;
      const rect = node.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      if (span <= 0) return;
      const progress = Math.min(0.9999, Math.max(0, -rect.top / span));
      const at = Math.floor(progress * count);
      if (lock.current !== null) {
        if (at !== lock.current) return;
        lock.current = null;
      }
      setActive(at);
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
  }, [count]);

  const go = (index: number) => {
    const node = root.current;
    if (index === active) setRound((value) => value + 1);
    setActive(index);
    if (!node) return;
    // 窄屏不钉：墙在名字下面，换了以后让墙露出来
    if (!matchMedia(PIN).matches) {
      stage.current?.scrollIntoView({
        block: 'nearest',
        behavior: still ? 'auto' : 'smooth',
      });
      return;
    }
    const rect = node.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    if (span <= 0) return;
    // 到了那一件就解开；万一半路被访客自己的滚动打断，1.2 秒后也解开
    lock.current = index;
    window.clearTimeout(unlock.current);
    unlock.current = window.setTimeout(() => {
      lock.current = null;
    }, 1200);
    window.scrollTo({
      top: window.scrollY + rect.top + (span * (index + 0.5)) / count,
      behavior: still ? 'auto' : 'smooth',
    });
  };

  const onKey = (event: KeyboardEvent, index: number) => {
    const step =
      event.key === 'ArrowDown' || event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
          ? -1
          : 0;
    const to =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? count - 1
          : step
            ? (index + step + count) % count
            : -1;
    if (to < 0) return;
    event.preventDefault();
    tabs.current[to]?.focus();
    go(to);
  };

  return (
    <div ref={root} className="tl-gal" style={{ '--count': count } as Vars}>
      <div className="tl-gal-pin">
        <div className="m-wrap tl-gal-grid">
          <div className="tl-gal-text">
            {head}
            <div className="tl-gal-list" role="tablist" aria-label={label}>
              {pieces.map((piece, index) => (
                <button
                  key={piece.title}
                  ref={(node) => {
                    tabs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`tl-gal-tab-${index}`}
                  aria-selected={index === active}
                  aria-controls="tl-gal-stage"
                  tabIndex={index === active ? 0 : -1}
                  className="tl-gal-tab"
                  data-tone={piece.tone}
                  onClick={() => go(index)}
                  onKeyDown={(event) => onKey(event, index)}
                >
                  {piece.icon}
                  <span className="tl-gal-name">{piece.title}</span>
                  <small className="tl-gal-tag" data-kind={piece.kind}>
                    {piece.tag}
                  </small>
                </button>
              ))}
            </div>
          </div>
          <div className="tl-gal-show">
            <div
              ref={stage}
              id="tl-gal-stage"
              className="tl-gal-stage"
              data-open=""
              role="tabpanel"
              aria-labelledby={`tl-gal-tab-${active}`}
            >
              {pieces.map((piece, index) => (
                <Art
                  key={piece.title}
                  piece={piece}
                  active={index === active}
                  live={shown && !paused}
                  still={still}
                  round={index === active ? round : 0}
                />
              ))}
            </div>
            <div className="tl-gal-foot">
              {foot}
              {still ? null : (
                <LoopToggle
                  stopped={paused}
                  onToggle={() => setPaused((value) => !value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
