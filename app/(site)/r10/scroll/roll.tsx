'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import media from './media.json';

// 手卷的机关与几样小部件，首页（五段风景）和 Work 页（一卷工作台截图）共用。
// 宽屏、没有要求减少动态时：整段钉在视口里（sticky），纵向滚动的进度推着长卷横向移动（transform）；
// 不截获滚轮、不改滚动速度，原生滚动照常，只是把滚动进度换成长卷的位置。
// 窄屏、减少动态、没有 JS 时：同一卷纵向展开，像一幅立轴。
// 卷里每一段标 data-part：第 0 段是卷首，最后一段是卷尾。

export type MediaKey = keyof typeof media;

export const ROLL =
  '(min-width: 900px) and (prefers-reduced-motion: no-preference)';
/** 跟随缓动：画面每帧向滚动位置追近一截，滚轮一格一格地跳，长卷连续地滑 */
const FOLLOW = 0.12;

export const numerals = ['一', '二', '三', '四', '五', '六', '七', '八'];

const clamp = (n: number) => Math.min(1, Math.max(0, n));

export function useHandscroll() {
  const root = useRef<HTMLElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLOListElement>(null);
  /** 离画面中线最近的那一段（0 是卷首） */
  const [active, setActive] = useState(0);
  /** 刻度尺上每一段（不含卷首卷尾）的位置，0…1 */
  const [marks, setMarks] = useState<number[]>([]);
  /** 走到了卷尾 */
  const [ended, setEnded] = useState(false);
  const centers = useRef<number[]>([]);
  const travel = useRef(1);

  useEffect(() => {
    const section = root.current;
    const frame = view.current;
    const track = strip.current;
    if (!section || !frame || !track) return;
    const roll = matchMedia(ROLL);
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const parts = Array.from(
      track.querySelectorAll<HTMLElement>('[data-part]'),
    );
    let current = -1;
    let target = 0;
    let raf = 0;
    let last = 0;
    let shown = -1;

    // 量出长卷有多长、每一段在进度的哪个位置
    const layout = () => {
      if (roll.matches) {
        const width = track.scrollWidth;
        const windowWidth = frame.clientWidth;
        travel.current = Math.max(1, width - windowWidth);
        section.style.setProperty('--travel', `${travel.current}px`);
        centers.current = parts.map((part) => {
          const fromRight = width - (part.offsetLeft + part.offsetWidth / 2);
          return clamp((fromRight - windowWidth / 2) / travel.current);
        });
      } else {
        section.style.removeProperty('--travel');
        track.style.transform = '';
        const top = section.getBoundingClientRect().top;
        const height = section.offsetHeight || 1;
        centers.current = parts.map((part) => {
          const rect = part.getBoundingClientRect();
          return clamp((rect.top - top + rect.height / 2) / height);
        });
      }
      setMarks(centers.current.slice(1, -1));
    };

    const measure = () => {
      const rect = section.getBoundingClientRect();
      target = roll.matches
        ? clamp(-rect.top / travel.current)
        : clamp((window.innerHeight * 0.5 - rect.top) / (rect.height || 1));
    };

    const paint = (t: number) => {
      if (roll.matches)
        track.style.transform = `translate3d(${(t * travel.current).toFixed(2)}px, 0, 0)`;
      section.style.setProperty('--t', t.toFixed(4));
      let nearest = 0;
      centers.current.forEach((at, index) => {
        if (Math.abs(at - t) < Math.abs(centers.current[nearest] - t))
          nearest = index;
      });
      if (nearest !== shown) {
        shown = nearest;
        setActive(nearest);
      }
      const end = centers.current[centers.current.length - 1] ?? 1;
      if (t >= end - (roll.matches ? 0.02 : 0.06)) setEnded(true);
    };

    const step = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      const k = still.matches ? 1 : 1 - Math.pow(1 - FOLLOW, dt / 16.7);
      current =
        current < 0 || Math.abs(target - current) < 0.0002
          ? target
          : current + (target - current) * k;
      paint(current);
      if (current !== target) raf = requestAnimationFrame(step);
      else last = 0;
    };

    const request = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(step);
    };
    const relayout = () => {
      layout();
      current = -1;
      request();
    };

    relayout();
    const observer = new ResizeObserver(relayout);
    observer.observe(track);
    observer.observe(frame);
    window.addEventListener('scroll', request, { passive: true });
    roll.addEventListener('change', relayout);
    void document.fonts?.ready.then(relayout);

    // 键盘走进长卷里的链接：把那一段滚到画面中间（不让浏览器去横向卷动裁切框）
    const onFocus = (event: FocusEvent) => {
      frame.scrollLeft = 0;
      if (!roll.matches) return;
      const part = (event.target as Element).closest<HTMLElement>(
        '[data-part]',
      );
      const index = part ? parts.indexOf(part) : -1;
      if (index < 0) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top + centers.current[index] * travel.current,
        behavior: 'instant',
      });
    };
    track.addEventListener('focusin', onFocus);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('scroll', request);
      roll.removeEventListener('change', relayout);
      track.removeEventListener('focusin', onFocus);
    };
  }, []);

  /** 滚到第 index 段（页边目录用） */
  const go = (index: number) => {
    const section = root.current;
    const part =
      strip.current?.querySelectorAll<HTMLElement>('[data-part]')[index];
    if (!section || !part) return;
    if (matchMedia(ROLL).matches) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + centers.current[index] * travel.current });
    } else {
      part.scrollIntoView({ block: 'center' });
    }
  };

  return { root, view, strip, active, marks, ended, go };
}

/** 刻度尺：从右往左走，跟长卷同一个方向。长刻度是每一段的位置 */
export function Ruler({ marks }: { marks: number[] }) {
  return (
    <div className="sc-ruler" aria-hidden="true">
      <span className="sc-ticks" />
      {marks.map((at, index) => (
        <span
          key={index}
          className="sc-major"
          style={{ '--at': at } as CSSProperties}
        >
          <i>{numerals[index]}</i>
        </span>
      ))}
      <span className="sc-box" />
    </div>
  );
}

/** 卷轴的两根细杆 */
export function Rods() {
  return (
    <>
      <span className="sc-rod" data-side="left" aria-hidden="true" />
      <span className="sc-rod" data-side="right" aria-hidden="true" />
    </>
  );
}

/** 竖写里两三个字符的拉丁字母与数字横排在一格里（縦中横），长的照常侧躺 */
export function Vertical({ text }: { text: string }) {
  const parts = text.split(/((?<![A-Za-z0-9])[A-Za-z0-9]{1,3}(?![A-Za-z0-9]))/);
  return (
    <>
      {parts.map((part, index) =>
        /^[A-Za-z0-9]{1,3}$/.test(part) ? (
          <span key={index} className="sc-tcy">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** 题字：一句话分成几列（默认在逗号后断开），从右往左读；每列起笔错开一点 */
export function Inscription({
  text,
  columns,
}: {
  text?: string;
  columns?: string[];
}) {
  const list = columns ?? (text ?? '').split(/(?<=，)/);
  return (
    <>
      {list.map((column, index) => (
        <span
          key={index}
          className="sc-col"
          style={{ '--k': index } as CSSProperties}
        >
          <Vertical text={column} />
        </span>
      ))}
    </>
  );
}

export function Photo({
  name,
  alt,
  sizes,
  className,
  focus,
  eager = false,
}: {
  name: MediaKey;
  alt: string;
  sizes: string;
  className?: string;
  focus?: string;
  eager?: boolean;
}) {
  const image = media[name];
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (node?.complete && node.naturalWidth) node.dataset.ready = '';
  }, []);
  return (
    <img
      ref={ref}
      className={className}
      src={image.src}
      srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
      sizes={sizes}
      width={image.width}
      height={image.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      alt={alt}
      onLoad={(event) => {
        event.currentTarget.dataset.ready = '';
      }}
      style={{ objectPosition: focus, backgroundColor: image.avg }}
    />
  );
}

/** 卷尾的印：白文，八个字两列，从右列读起；走到卷尾时「盖」下去 */
export function Seal({ sealed }: { sealed: boolean }) {
  return (
    <span className="sc-seal" data-sealed={sealed || undefined}>
      <span className="sr-only">印：始终好奇，持续创造</span>
      <span className="sc-seal-face" aria-hidden="true">
        始终好奇持续创造
      </span>
    </span>
  );
}
