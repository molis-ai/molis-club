'use client';
import { useEffect, useRef, useState } from 'react';
import { homeCopy } from './data';
import { useReducedMotion, useVisible } from './motion';

// 首屏到产品之间的一句话：We build Warmware / Beyond Software.
// 第一行的前缀会换：词表是白盒子美术馆时定下的那一组（Warm、Human、Curious、Creative、Calm、Playful、
// Intelligent、Efficient），再加上 Aware（A + ware，懂你）。新词进来时，后面的 ware 跟着平滑地挪到位。
// 第二行 Beyond Software 整句斜体、靠页面右侧；其中 Soft 换一种字体（Fraunces 柔边斜体），点明「软件之外」。
// 三个动作：美术馆是对焦（像光落定），公园是被风带起（像蒲公英），天空和海边是升起（像云、像水汽）。
// 鼠标停在那个词上、或点一下，轮换就停住；减少动态时停在第一个词上。

export type WareMotion = 'focus' | 'breeze' | 'rise';

export const wares = [
  'Warm',
  'Human',
  'Curious',
  'Creative',
  'Calm',
  'A',
  'Playful',
  'Intelligent',
  'Efficient',
];

const HOLD = 2400;
const OUT = 700;

function Letters({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((letter, index) => (
        <span
          key={index}
          className="r8-ware-ch"
          style={{ '--i': index } as React.CSSProperties}
        >
          {letter}
        </span>
      ))}
    </>
  );
}

export function Ware({ motion }: { motion: WareMotion }) {
  const ref = useRef<HTMLElement>(null);
  const measure = useRef<HTMLSpanElement>(null);
  const visible = useVisible(ref, 0.4);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [swap, setSwap] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [widths, setWidths] = useState<number[] | null>(null);
  const playing = visible && !reduced && !paused && !hover;

  // 量出每个词的宽度，换词时让 ware 平滑地挪过去；换字体、换屏宽都重新量
  useEffect(() => {
    const box = measure.current;
    if (!box) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      setWidths(
        Array.from(box.children).map(
          (child) => (child as HTMLElement).getBoundingClientRect().width,
        ),
      );
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const observer = new ResizeObserver(request);
    observer.observe(box);
    void document.fonts?.ready.then(request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setLeaving(index);
      setIndex((index + 1) % wares.length);
      setSwap((s) => s + 1);
    }, HOLD);
    return () => window.clearTimeout(timer);
  }, [playing, index]);

  // 旧词淡完就撤掉
  useEffect(() => {
    if (leaving === null) return;
    const timer = window.setTimeout(() => setLeaving(null), OUT + 200);
    return () => window.clearTimeout(timer);
  }, [leaving, swap]);

  const word = wares[index];
  const studio = homeCopy.studio;

  return (
    <section
      ref={ref}
      className="r8-ware"
      data-motion={motion}
      aria-labelledby="r8-ware-title"
    >
      <div className="r8-ware-inner">
        <p className="r8-ware-kicker" data-reveal>
          <span lang="en">What we make</span>
          <span>我们在做的</span>
        </p>
        <h2 id="r8-ware-title" className="r8-ware-line" lang="en">
          <span className="sr-only">
            We build {wares.map((w) => `${w.toLowerCase()}ware`).join(', ')},
            beyond software.
          </span>
          <span className="r8-ware-row" aria-hidden="true">
            <span className="r8-ware-we">We build </span>
            <button
              type="button"
              className="r8-ware-slot"
              tabIndex={-1}
              data-paused={paused || undefined}
              style={widths ? { width: widths[index] } : undefined}
              onClick={() => setPaused((value) => !value)}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setHover(true);
              }}
              onPointerLeave={() => setHover(false)}
            >
              {leaving !== null ? (
                <span
                  key={`out-${swap}`}
                  className="r8-ware-pre"
                  data-state="out"
                >
                  <Letters text={wares[leaving]} />
                </span>
              ) : null}
              <span
                key={`in-${swap}`}
                className="r8-ware-pre"
                data-state={swap === 0 ? 'still' : 'in'}
              >
                <Letters text={word} />
              </span>
            </button>
            <span className="r8-ware-tail">ware</span>
          </span>
          <span className="r8-ware-row r8-ware-row-2" aria-hidden="true">
            Beyond <span className="r8-ware-soft">Soft</span>ware
          </span>
          <span className="r8-ware-measure" ref={measure} aria-hidden="true">
            {wares.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </span>
        </h2>
        {/* 键盘可以用的暂停：平时不显示，聚焦时才出现 */}
        <button
          type="button"
          className="r8-ware-pause"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? '继续轮换 ware 前面的词' : '暂停轮换 ware 前面的词'}
        </button>
        <div className="r8-ware-about" data-reveal>
          <p className="r8-ware-studio">{studio.title}</p>
          <p className="r8-ware-view">{studio.view}</p>
        </div>
      </div>
    </section>
  );
}
