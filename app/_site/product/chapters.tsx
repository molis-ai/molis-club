'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Scene } from '../demo/demo';
import { Reel } from '../demo/reel';
import { useReducedMotion, useVisible } from '../motion';
import { pad, Phrases } from '../ui';

// 产品页的主线：跟着「一件事」从头走到尾，第 4 章各节是这件事里的一个个时刻。
// 桌面：左文右图，右侧画面钉住；滚到哪一章画面换到哪一章，一章两三步，滚到哪一步演到哪一步，可以倒回。
// 手机：画面在每章文字上方，进入视口按时间播，可暂停。减少动态：没有过渡，停在每步的结果上。
// 没有 JS：每章文字上方都有一张停在最后一步的画面（同手机的排法），钉住的画面不出现。

export type Chapter = {
  id: string;
  /** 这件事走到哪儿了：「第一天 · 上午」 */
  kicker?: string;
  /** 这一章说的能力的阶段：预览、开发中…… */
  tag?: string;
  title: string;
  paragraphs: string[];
  /** 每一步画面在演什么（一句话），条数等于画面的步数 */
  steps: string[];
  scene: Scene;
};

/** 手机上：画面在文字上方，进入视口按时间播，可暂停 */
function Inline({ chapter }: { chapter: Chapter }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useVisible(ref, 0.35);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  return (
    <div className="m-ch-inline" ref={ref}>
      <Reel
        name={chapter.title}
        segments={[{ title: '', scene: chapter.scene }]}
        running={visible && !paused}
        reduced={reduced}
        paused={paused}
        onPause={() => setPaused((value) => !value)}
        bare
      />
    </div>
  );
}

export function Chapters({
  chapters,
  label,
  view = '16 / 10',
  start = 1,
}: {
  chapters: Chapter[];
  /** 读屏用：这一串画面是什么 */
  label: string;
  view?: string;
  /** 第一章的编号（主线前面还有别的编号区块时接着往下数） */
  start?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState({ chapter: 0, step: 0 });

  // 视口中线以上最后一个步骤标记，就是画面正在演的那一步（往回滚就倒着演）
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const markers = Array.from(
      node.querySelectorAll<HTMLElement>('[data-mark]'),
    );
    let frame = 0;
    const read = () => {
      frame = 0;
      const line = window.innerHeight * 0.52;
      let found = markers[0];
      for (const marker of markers) {
        if (marker.getBoundingClientRect().top <= line) found = marker;
        else break;
      }
      const chapter = Number(found.dataset.chapter);
      const step = Number(found.dataset.step);
      setAt((value) =>
        value.chapter === chapter && value.step === step
          ? value
          : { chapter, step },
      );
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    request();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);

  const current = chapters[at.chapter];
  return (
    <div
      className="m-chapters"
      ref={root}
      style={{ '--view': view } as CSSProperties}
    >
      <div className="m-chapters-text">
        {chapters.map((chapter, c) => (
          <section
            key={chapter.id}
            id={chapter.id}
            className="m-ch"
            data-now={c === at.chapter || undefined}
            aria-labelledby={`${chapter.id}-title`}
          >
            <p className="m-ch-meta">
              <span className="m-no" aria-hidden="true">
                {pad(c + start)}
              </span>
              {chapter.kicker ? (
                <span className="m-kicker">{chapter.kicker}</span>
              ) : null}
              {chapter.tag ? (
                <span className="m-note">{chapter.tag}</span>
              ) : null}
            </p>
            <Inline chapter={chapter} />
            <h2 className="m-ch-title" id={`${chapter.id}-title`}>
              <Phrases text={chapter.title} />
            </h2>
            <div className="m-ch-prose">
              {chapter.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
            <p className="sr-only">
              画面（{chapter.scene.note}）：{chapter.scene.label}
            </p>
            <ol className="m-ch-steps" aria-label="画面在演什么">
              {chapter.steps.map((text, s) => (
                <li
                  key={text}
                  data-mark=""
                  data-chapter={c}
                  data-step={s}
                  data-on={
                    (c === at.chapter && s <= at.step) || c < at.chapter
                      ? ''
                      : undefined
                  }
                >
                  <span className="m-no" aria-hidden="true">
                    {String.fromCharCode(97 + s)}
                  </span>
                  {text}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      <div className="m-chapters-stage" aria-hidden="true">
        <div className="m-stage-pin">
          <p className="m-stage-cap">
            <span className="m-no">{pad(at.chapter + start)}</span>
            <span>{current.steps[at.step]}</span>
          </p>
          <div className="m-stage-view">
            {chapters.map((chapter, c) => (
              <div
                key={chapter.id}
                className="m-reel-scene"
                data-now={c === at.chapter || undefined}
              >
                {chapter.scene.render({
                  step:
                    c === at.chapter
                      ? at.step
                      : c < at.chapter
                        ? chapter.scene.steps - 1
                        : 0,
                })}
              </div>
            ))}
          </div>
          <p className="m-stage-foot">
            <span className="m-stage-dots">
              {chapters.map((chapter, c) => (
                <i key={chapter.id} data-on={c <= at.chapter || undefined} />
              ))}
            </span>
            <span className="m-note">{current.scene.note}</span>
          </p>
        </div>
      </div>
      <p className="sr-only">{label}</p>
    </div>
  );
}
