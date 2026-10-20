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

// 书架：「我们怎样开展合作」和「为什么我们可以」共用的展开式长卷（负责人 2026-10-20：后一屏沿用前一屏的交互，看得出是接着的）。
// 四本书并排，同一种纸色的圆角书立在一道细线上，高矮略有参差；书脊从上到下是编号、短名、竖排的全名，底下一颗小圆点。
// 往下滚，整屏钉住，一本一本地打开：书脊留在左边，右边翻出一页白纸，纸顶垂下一根杏色书签带，
// 纸上一张插图（一段短片）和一行图注（编号、短名、全名、示意）。点合着的书脊，滚到它那一拍；鼠标停在插图上，片子重演。
// 还可以多一拍「片尾」（coda）：四本都看完后，书架退下去，片尾字幕在原地滚上来。
// 宽屏（≥1000 宽、≥600 高）有 JS 时才钉住；手机、矮屏、没有 JS 时几本书从上到下排开，片尾排在最后。
// 短片的动画：先停在第一帧（没有 JS 时看到的是演完的样子）；钉住时打开哪一本演哪一本，不钉住时各自进屏各演一遍。

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

export function Shelf({
  id,
  className = '',
  prefix,
  title,
  lead,
  books,
  coda,
  footer,
}: {
  /** section 的锚点 */
  id: string;
  className?: string;
  /** 每本书 li 的 id 前缀，标题的 id 也从它来 */
  prefix: string;
  title: string;
  lead: string;
  books: ShelfBook[];
  /** 最后一拍：四本都看完后滚上来的片尾 */
  coda?: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(0);
  const BOOKS = books.length;
  const BEATS = BOOKS + (coda ? 1 : 0);
  const open = Math.min(active, BOOKS - 1);
  const ending = coda !== undefined && active === BOOKS;

  // 宽屏才钉住；钉住时按滚动走到哪一拍
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const wide = matchMedia('(min-width: 1000px) and (min-height: 600px)');
    let frame = 0;
    const read = () => {
      frame = 0;
      if (!wide.matches) return;
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const pin = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      setActive(Math.min(BEATS - 1, Math.floor(pin * BEATS)));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const sync = () => {
      setLive(wide.matches);
      request();
    };
    sync();
    wide.addEventListener('change', sync);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      wide.removeEventListener('change', sync);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, [BEATS]);

  // 动画：先停在第一帧；钉住时只放打开的那一本，不钉住时各自进屏各演一遍
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const scenes = Array.from(root.querySelectorAll('.m-film'));
    for (const scene of scenes) {
      scene.setAttribute('data-play', '');
      scene.setAttribute('data-hold', '');
    }
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const leg = entry.target.closest('.m-ent-leg');
          if (
            root.hasAttribute('data-live') &&
            !leg?.hasAttribute('data-active')
          )
            continue;
          seen.unobserve(entry.target);
          entry.target.removeAttribute('data-hold');
        }
      },
      { threshold: 0.5 },
    );
    for (const scene of scenes) seen.observe(scene);
    return () => seen.disconnect();
  }, []);

  // 打开一本：那一本的动画从头演（刚钉住时那一本交给上面的进屏观察）
  const first = useRef(true);
  useEffect(() => {
    if (!live) return;
    if (first.current) {
      first.current = false;
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const scene = ref.current?.querySelector(
      `.m-ent-leg[data-index="${open}"] .m-film`,
    );
    if (!scene) return;
    if (scene.hasAttribute('data-hold')) scene.removeAttribute('data-hold');
    else play(scene);
  }, [open, live]);

  /** 点一本合着的书：滚到它那一拍的正中 */
  const go = useCallback(
    (index: number) => {
      const root = ref.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const top = window.scrollY + rect.top + ((index + 0.5) / BEATS) * span;
      const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top, behavior: still ? 'auto' : 'smooth' });
    },
    [BEATS],
  );

  const titleId = `${prefix}-title`;
  return (
    <section
      ref={ref}
      className={`m-ent-flow ${className}`}
      id={id}
      data-live={live || undefined}
      data-coda={ending || undefined}
      aria-labelledby={titleId}
      style={{ '--legs': BEATS } as Vars}
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
            const shown = !live || index === open;
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
                    {/* 竖排里的英文横躺着排，字距收回来，不散成一个个字母 */}
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
                      if (event.pointerType !== 'mouse') return;
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

        {coda ? <div className="m-ent-coda">{coda}</div> : null}
        {footer}
      </div>
    </section>
  );
}
