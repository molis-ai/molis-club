'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// 一骏的 A/I 词组：与 /edition-c 首页同一组词、同一套打字节奏，A、I 常驻，后缀逐字打出再退格。
// Edition C 与 Folio 共用，各自用 prefix 套自己的样式（ec-ai-*、fo-ai-*）。
export const aiPhrases = [
  ['mplify', 'deas'],
  ['waken', 'magination'],
  ['dvance', 'ntuition'],
  ['ugment', 'ntelligence'],
  ['ccelerate', 'nnovation'],
  ['rtistic', 'nspiration'],
  ['rtful', 'nteractions'],
  ['daptive', 'nterfaces'],
];

export function AiWordCycle({ prefix }: { prefix: string }) {
  const root = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const previousPositions = useRef<number[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [available, setAvailable] = useState(false);
  const [reduced, setReduced] = useState(true);
  const playing = available && !reduced && !paused && !hovered && !focused;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    const sync = () => {
      setReduced(media.matches);
      if (media.matches) setActive(0);
      setAvailable(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    media.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) {
      previousPositions.current = [];
      return;
    }
    const words = Array.from(
      el.querySelectorAll<HTMLElement>(`.${prefix}-ai-row`),
    );
    const letters = Array.from(el.querySelectorAll(`.${prefix}-ai-letter`));
    const typingStarts = 450;
    const typingEnds = typingStarts + letters.length * 90;
    const erasingStarts = typingEnds + 2300;
    const duration = erasingStarts + letters.length * 45 + 200;

    const typing = letters.map((letter, index) => {
      const typedAt = typingStarts + (index + 1) * 90;
      const erasedAt = erasingStarts + (letters.length - index) * 45;
      const animation = letter.animate(
        [
          { opacity: 0, offset: 0, easing: 'steps(1, end)' },
          { opacity: 1, offset: typedAt / duration, easing: 'steps(1, end)' },
          { opacity: 0, offset: erasedAt / duration },
          { opacity: 0, offset: 1 },
        ],
        { duration, fill: 'both' },
      );
      animation.pause();
      return animation;
    });
    // 换词时只剩首字母，平滑移到新词组的位置再开始打字
    const movement = words.flatMap((word, index) => {
      const previous = previousPositions.current[index];
      if (previous === undefined) return [];
      const distance = previous - word.getBoundingClientRect().left;
      const animation = word.animate(
        [
          { transform: `translateX(${distance}px)` },
          { transform: 'translateX(0)' },
        ],
        { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      );
      animation.pause();
      return [animation];
    });
    animations.current = [...typing, ...movement];
    typing[0].onfinish = () => {
      previousPositions.current = words.map(
        (word) => word.getBoundingClientRect().left,
      );
      setActive((current) => (current + 1) % aiPhrases.length);
    };
    return () => {
      typing[0].onfinish = null;
      animations.current.forEach((animation) => animation.cancel());
      animations.current = [];
    };
  }, [active, reduced, prefix]);

  useLayoutEffect(() => {
    animations.current.forEach((animation) => {
      if (playing && animation.playState === 'paused') animation.play();
      if (!playing && animation.playState === 'running') animation.pause();
    });
  }, [playing, active, reduced]);

  return (
    <div
      className={`${prefix}-ai-headline`}
      ref={root}
      data-paused={paused}
      data-animated={!reduced}
    >
      <button
        className={`${prefix}-ai-words`}
        type="button"
        aria-label={paused ? '播放标题动画' : '暂停标题动画'}
        aria-pressed={paused}
        onClick={() => setPaused((current) => !current)}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onFocus={(event) =>
          setFocused(event.currentTarget.matches(':focus-visible'))
        }
        onBlur={() => setFocused(false)}
      >
        {['A', 'I'].map((initial, row) => (
          <span
            className={`${prefix}-ai-row`}
            key={initial}
            aria-hidden="true"
            lang="en"
          >
            <span>{initial}</span>
            <span>
              {Array.from(aiPhrases[active][row]).map((letter, index) => (
                <span className={`${prefix}-ai-letter`} key={index}>
                  {letter}
                </span>
              ))}
            </span>
          </span>
        ))}
      </button>
    </div>
  );
}
