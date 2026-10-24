'use client';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Note, Phrases, type Vars } from '../../_site/ui';
import { play } from './keeps';

// 书架：「我们怎样开展合作」的展开式长卷（从 stages.tsx 拆出来；「为什么我们可以」用过一版，后来改成覆盖图）。
// 四本书并排，同一种纸色的圆角书立在一道细线上，高矮略有参差；书脊从上到下是编号、短名、竖排的全名，底下一颗小圆点。
// 往下滚，整屏钉住，一本一本地打开：书脊留在左边，右边翻出一页白纸，纸顶垂下一根杏色书签带，
// 纸上一张插图（一段短片）和一行图注（编号、短名、全名、示意）。点合着的书脊，滚到它那本演完的地方。
// 宽屏（≥1000 宽、≥600 高）有 JS 时才钉住；手机、矮屏、没有 JS 时几本书从上到下排开。
// 短片（没有 JS、减少动态时停在演完的样子）：
//   钉住时跟着滚动走（负责人 2026-10-22：按时间演，正常滑过去只看得到开头）——每本书占一段滚动，
//   前一小截等书翻开，中间按滚动演完，最后一小截停在演完的样子；往回滚就倒回去。滚动进度和全站一样跟随缓动。
//   不钉住时各自进屏按时间演一遍，鼠标停在插图上重演。

export type ShelfBook = {
  id: string;
  /** 书脊上的短名 */
  word: string;
  /** 竖排在书脊下半截的全名 */
  name: string;
  film: ReactNode;
};

/** 书脊和图注上的编号：01–04 */
const number = (index: number) => String(index + 1).padStart(2, '0');

/** 一本书那段滚动里：到 OPEN 之前等书翻开（第一本已经开着，不等），到 DONE 演完，之后停在演完的样子 */
const OPEN = 0.12;
const DONE = 0.8;
/** 点书脊时滚到那一段的这个位置：刚演完 */
const LAND = 0.88;
/** 跟随缓动，和 app/_site/motion.ts 同一个数 */
const FOLLOW = 0.18;

/** 第 index 本书的短片演到几成：beat 是钉住进度乘以书的本数 */
function reach(beat: number, index: number) {
  const open = index === 0 ? 0 : OPEN;
  return Math.min(1, Math.max(0, (beat - index - open) / (DONE - open)));
}

/** 一段短片里的样式动画（films.tsx 每条轨道一段，全片同一个长度） */
const partsOf = (film: Element) =>
  (film.getAnimations?.({ subtree: true }) ?? []).filter(
    (animation): animation is CSSAnimation =>
      animation instanceof CSSAnimation,
  );

/** 去掉再加上 data-play：动画从头生成，交回样式控制（data-hold 时停在第一帧） */
function rewind(films: Element[]) {
  for (const film of films) film.removeAttribute('data-play');
  void films[0]?.getBoundingClientRect();
  for (const film of films) {
    film.setAttribute('data-play', '');
    film.setAttribute('data-hold', '');
  }
}

export function Shelf({
  id,
  className = '',
  prefix,
  title,
  lead,
  books,
}: {
  /** section 的锚点 */
  id: string;
  className?: string;
  /** 每本书 li 的 id 前缀，标题的 id 也从它来 */
  prefix: string;
  title: string;
  lead: string;
  books: ShelfBook[];
}) {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(0);
  const BOOKS = books.length;

  // 宽屏才钉住：滚到哪一本打开哪一本，短片跟着滚动演；不钉住时短片各自进屏按时间演
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const wide = matchMedia('(min-width: 1000px) and (min-height: 600px)');
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const films = Array.from(root.querySelectorAll('.m-film'));
    /** 钉住时每段短片的动画、片长（毫秒）和上次定在哪一毫秒；不钉住时为空 */
    let reels: { parts: CSSAnimation[]; length: number; at: number }[] = [];
    let watch: IntersectionObserver | undefined;
    let target = 0;
    let current = -1;
    let frame = 0;
    let last = 0;

    const step = (now: number) => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      target = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      const k = still.matches ? 1 : 1 - Math.pow(1 - FOLLOW, dt / 16.7);
      current =
        current < 0 || Math.abs(target - current) < 0.0004
          ? target
          : current + (target - current) * k;
      const beat = current * BOOKS;
      setActive(Math.min(BOOKS - 1, Math.floor(beat)));
      reels.forEach((reel, index) => {
        const at = Math.round(reach(beat, index) * reel.length);
        if (at === reel.at) return;
        reel.at = at;
        for (const part of reel.parts) part.currentTime = at;
      });
      if (current !== target) frame = requestAnimationFrame(step);
      else last = 0;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    // 宽窄或减少动态变了，重新安排短片：钉住时由滚动定格，不钉住时等进屏再演
    const arrange = () => {
      const pinned = wide.matches;
      setLive(pinned);
      watch?.disconnect();
      watch = undefined;
      reels = [];
      if (still.matches) {
        for (const film of films) film.removeAttribute('data-play');
      } else {
        rewind(films);
        if (pinned && 'getAnimations' in Element.prototype) {
          reels = films.map((film) => {
            const parts = partsOf(film);
            for (const part of parts) part.pause();
            const timing = parts[0]?.effect?.getComputedTiming();
            return { parts, length: Number(timing?.duration) || 0, at: -1 };
          });
        } else {
          const seen = new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                seen.unobserve(entry.target);
                entry.target.removeAttribute('data-hold');
              }
            },
            { threshold: 0.5 },
          );
          for (const film of films) seen.observe(film);
          watch = seen;
        }
      }
      request();
    };

    arrange();
    // 钉住后整节变高，量一次
    const resized = new ResizeObserver(request);
    resized.observe(root);
    wide.addEventListener('change', arrange);
    still.addEventListener('change', arrange);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      watch?.disconnect();
      resized.disconnect();
      wide.removeEventListener('change', arrange);
      still.removeEventListener('change', arrange);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, [BOOKS]);

  /** 点一本合着的书：滚到它刚演完的地方 */
  const go = useCallback(
    (index: number) => {
      const root = ref.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const top = window.scrollY + rect.top + ((index + LAND) / BOOKS) * span;
      const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top, behavior: still ? 'auto' : 'smooth' });
    },
    [BOOKS],
  );

  const titleId = `${prefix}-title`;
  return (
    <section
      ref={ref}
      className={`m-ent-flow ${className}`}
      id={id}
      data-live={live || undefined}
      aria-labelledby={titleId}
      style={{ '--legs': BOOKS } as Vars}
    >
      <div className="m-ent-flow-stick m-wrap">
        <header className="m-ent-flow-head">
          <h2 className="m-ent-flow-title" id={titleId}>
            {title}
          </h2>
          <p className="m-ent-flow-lead">
            <Phrases text={lead} />
          </p>
        </header>

        <ol className="m-ent-legs">
          {books.map((book, index) => {
            const shown = !live || index === active;
            return (
              <li
                key={book.id}
                id={`${prefix}-${book.id}`}
                className="m-ent-leg"
                data-index={index}
                data-active={shown || undefined}
                aria-labelledby={`${prefix}-${book.id}-name`}
              >
                {/* 书脊：编号、短名、全名；合着的书点一下打开 */}
                <button
                  type="button"
                  className="m-ent-leg-spine"
                  tabIndex={live && !shown ? 0 : -1}
                  aria-hidden={!live || shown}
                  aria-label={`${book.word}：${book.name}`}
                  onClick={() => go(index)}
                >
                  <span className="m-ent-leg-no">{number(index)}</span>
                  <span className="m-ent-leg-spine-word">{book.word}</span>
                  <span className="m-ent-leg-spine-name">
                    {/* 竖排里的英文单独包一层：立着排，字距另算（line.css） */}
                    {book.name.split(/([A-Za-z]+)/).map((part, i) =>
                      i % 2 ? (
                        <span key={i} className="m-ent-leg-latin">
                          {part}
                        </span>
                      ) : (
                        part
                      ),
                    )}
                  </span>
                </button>

                {/* 翻开的那一页：一张插图（短片）和一行图注；图注在源码里排在前面，宽屏上显示在插图下面 */}
                <div className="m-ent-leg-body">
                  <div
                    className="m-ent-leg-stage"
                    onPointerEnter={(event) => {
                      // 钉住时片子跟着滚动走，往回滚就是重演
                      if (live || event.pointerType !== 'mouse') return;
                      if (
                        matchMedia('(prefers-reduced-motion: reduce)').matches
                      )
                        return;
                      const film = event.currentTarget.querySelector('.m-film');
                      if (film && !film.hasAttribute('data-hold')) play(film);
                    }}
                  >
                    <header className="m-ent-leg-head">
                      <span className="m-ent-leg-no" aria-hidden="true">
                        {number(index)}
                      </span>
                      <h3
                        className="m-ent-leg-word"
                        id={`${prefix}-${book.id}-name`}
                      >
                        {book.word}
                      </h3>
                      <p className="m-ent-leg-name">{book.name}</p>
                      <span className="m-ent-leg-note">
                        <Note>示意</Note>
                      </span>
                    </header>
                    {book.film}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
