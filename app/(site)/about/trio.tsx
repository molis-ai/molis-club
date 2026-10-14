'use client';
import { Pause, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { trio } from '../../../content/site/about';
import { useReducedMotion, useVisible } from '../../_site/motion';
import { VideoWindow } from '../../_site/video';
import { pad, Phrases, type Vars } from '../../_site/ui';

// 「三种媒介，同一个动作」：作画、写代码、改文字三栏并排，地位相同（同一个比例、同一种标签、同一行图注），
// 由同一个控件推进，一起从起稿走到修改、再到完成。
// - 第一次滚进视口时自己演一遍，停在「完成」；离开视口或页面隐藏时停在当前一步，回来接着演。
// - 点任何一步就停在那一步；「停在这一步」随时可以按；演完可以「再演一遍」。
// - 没有 JS、减少动态：直接是「完成」，不自己演（减少动态时仍可以手动点每一步看）。
// 画面一律是示意：作画是一段循环的影像（起稿时先褪成单色，像打底），代码是本站文字链接下划线的写法，文字是一句话的修改痕迹。

type Step = 0 | 1 | 2;
type Mode = 'waiting' | 'playing' | 'resting';

/** 每一步停多久（毫秒）：修改那一步要读的东西多，停久一点 */
const HOLD: Record<Step, number> = { 0: 2600, 1: 3600, 2: 0 };

export function Trio() {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const visible = useVisible(box, 0.25);
  // 服务端、没有 JS、还没演之前：都是「完成」
  const [step, setStep] = useState<Step>(2);
  const [mode, setMode] = useState<Mode>('waiting');

  const playing = mode === 'playing' && visible && !reduced;
  // 减少动态时，正在演的那一遍直接停在结果上
  const shown: Step = reduced && mode === 'playing' ? 2 : step;

  // 第一次进入视口：从起稿开始演
  useEffect(() => {
    if (mode !== 'waiting' || !visible || reduced) return;
    const timer = window.setTimeout(() => {
      setStep(0);
      setMode('playing');
    }, 450);
    return () => window.clearTimeout(timer);
  }, [mode, visible, reduced]);

  // 演到下一步；到「完成」就停下
  useEffect(() => {
    if (!playing || step === 2) return;
    const timer = window.setTimeout(() => {
      const next = (step + 1) as Step;
      setStep(next);
      if (next === 2) setMode('resting');
    }, HOLD[step]);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  const choose = (next: Step) => {
    setStep(next);
    setMode('resting');
  };
  const replay = () => {
    setStep(0);
    setMode('playing');
  };

  const code = trio.code.drafts[shown];
  const words = trio.words.drafts[shown];

  return (
    <div
      className="ab-trio"
      ref={box}
      data-step={shown}
      data-playing={playing || undefined}
    >
      <div className="ab-trio-bar">
        <fieldset className="ab-steps">
          <legend className="sr-only">{trio.title}</legend>
          {trio.steps.map((label, index) => (
            <button
              key={label}
              type="button"
              className="ab-step"
              aria-pressed={shown === index}
              onClick={() => choose(index as Step)}
              style={{ '--hold': `${HOLD[index as Step]}ms` } as Vars}
            >
              <span className="m-no" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <span>{label}</span>
              <i className="ab-step-line" aria-hidden="true" />
            </button>
          ))}
        </fieldset>
        <div className="ab-trio-end">
          {reduced ? null : mode === 'playing' ? (
            <button
              type="button"
              className="m-link ab-trio-ctl"
              onClick={() => setMode('resting')}
            >
              <Pause size={11} fill="currentColor" aria-hidden="true" />
              {trio.pause}
            </button>
          ) : (
            <button type="button" className="m-link ab-trio-ctl" onClick={replay}>
              <RotateCcw size={12} aria-hidden="true" />
              {mode === 'waiting' ? trio.play : trio.replay}
            </button>
          )}
          <span className="m-note">{trio.note}</span>
        </div>
      </div>

      <ol className="ab-cols">
        <li className="ab-col">
          <p className="ab-medium">
            <span>{trio.paint.medium}</span>
            <span className="ab-medium-en" lang="en">
              {trio.paint.en}
            </span>
          </p>
          <VideoWindow
            name="about-painting"
            ratio="4 / 5"
            focus="74% 50%"
            className="ab-paint"
            caption={trio.paint.captions[shown]}
          />
        </li>

        <li className="ab-col">
          <p className="ab-medium">
            <span>{trio.code.medium}</span>
            <span className="ab-medium-en" lang="en">
              {trio.code.en}
            </span>
          </p>
          <figure
            className="m-window ab-panel ab-code"
            data-open
            style={{ '--ratio': '4 / 5' } as Vars}
          >
            <div className="m-window-frame">
              <div className="ab-panel-in">
                <p className="ab-panel-top">
                  <span lang="en">{trio.code.file}</span>
                  <span>{trio.steps[shown]}</span>
                </p>
                <pre className="ab-pre">
                  <code>
                    {code.map(([mark, text], index) => {
                      const Line = mark === '+' ? 'ins' : mark === '-' ? 'del' : 'span';
                      return (
                        <Line
                          key={`${shown}-${index}`}
                          className="ab-line"
                          data-mark={mark}
                          style={{ '--i': index } as Vars}
                        >
                          {text}
                        </Line>
                      );
                    })}
                  </code>
                </pre>
                <p className="ab-result">
                  <span>{trio.code.result}</span>
                  <a className="ab-sample" href="#beliefs">
                    {trio.code.sample}
                  </a>
                </p>
              </div>
            </div>
            <figcaption>
              <span className="m-caption">{trio.code.captions[shown]}</span>
            </figcaption>
          </figure>
        </li>

        <li className="ab-col">
          <p className="ab-medium">
            <span>{trio.words.medium}</span>
            <span className="ab-medium-en" lang="en">
              {trio.words.en}
            </span>
          </p>
          <figure
            className="m-window ab-panel ab-words"
            data-open
            style={{ '--ratio': '4 / 5' } as Vars}
          >
            <div className="m-window-frame">
              <div className="ab-panel-in">
                <p className="ab-panel-top">
                  <span>{trio.words.versions[shown]}</span>
                  <span>{trio.steps[shown]}</span>
                </p>
                <p className="ab-sentence">
                  {words.map(([mark, text], index) => {
                    const Part = mark === '+' ? 'ins' : mark === '-' ? 'del' : 'span';
                    return (
                      <Part
                        key={`${shown}-${index}`}
                        data-mark={mark}
                        style={{ '--i': index } as Vars}
                      >
                        {mark === ' ' ? <Phrases text={text} /> : text}
                      </Part>
                    );
                  })}
                </p>
              </div>
            </div>
            <figcaption>
              <span className="m-caption">{trio.words.captions[shown]}</span>
            </figcaption>
          </figure>
        </li>
      </ol>
    </div>
  );
}
