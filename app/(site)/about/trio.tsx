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
// flow（「关于」一整页用）：代码与文字的框不再按比例截住、在框里滚动，而是由内容撑高；
// 三稿叠在同一格里占位，只露出当前一稿，换步时框的高度不跳，三栏共用一行的高度（清单 D3）。
// lead（「关于」一整页用，负责人 2026-10-18）：一句话就是控件。底稿 1.3 那句「……都是同一种创造：先起稿，
// 再一遍遍修改，直到经得起真实使用。」冒号后的三个短句各是一步，点哪句停在哪步，自己演时高亮跟着走；
// 不要步骤栏、「停在这一步 / 再演一遍」和每步的小图注，只留一个「示意」；三栏按句子的顺序排：代码、颜料、文字。

type Step = 0 | 1 | 2;
type Mode = 'waiting' | 'playing' | 'resting';

/** 每一步停多久（毫秒）：修改那一步要读的东西多，停久一点 */
const HOLD: Record<Step, number> = { 0: 2600, 1: 3600, 2: 0 };

type Mark = ' ' | '-' | '+';

function CodeDraft({
  lines,
  keyPrefix,
}: {
  lines: Array<[Mark, string]>;
  keyPrefix: string;
}) {
  return (
    <code>
      {lines.map(([mark, text], index) => {
        const Line = mark === '+' ? 'ins' : mark === '-' ? 'del' : 'span';
        return (
          <Line
            key={`${keyPrefix}-${index}`}
            className="ab-line"
            data-mark={mark}
            style={{ '--i': index } as Vars}
          >
            {text}
          </Line>
        );
      })}
    </code>
  );
}

function WordsDraft({
  parts,
  keyPrefix,
}: {
  parts: Array<[Mark, string]>;
  keyPrefix: string;
}) {
  return (
    <>
      {parts.map(([mark, text], index) => {
        const Part = mark === '+' ? 'ins' : mark === '-' ? 'del' : 'span';
        return (
          <Part
            key={`${keyPrefix}-${index}`}
            data-mark={mark}
            style={{ '--i': index } as Vars}
          >
            {mark === ' ' ? <Phrases text={text} /> : text}
          </Part>
        );
      })}
    </>
  );
}

/** 把那句话拆成冒号前的引子和三步（每步的字与后面的标点）；拆不出三步就退回步骤栏 */
function sayOf(text: string) {
  const at = text.indexOf('：');
  if (at < 0) return null;
  const parts = text.slice(at + 1).match(/[^，。]+[，。]?/g) ?? [];
  if (parts.length !== 3) return null;
  return {
    head: text.slice(0, at + 1),
    steps: parts.map((part) => {
      const mark = /[，。]$/.test(part) ? part.slice(-1) : '';
      return [part.slice(0, part.length - mark.length), mark] as const;
    }),
  };
}

export function Trio({
  flow = false,
  lead,
}: {
  flow?: boolean;
  /** 用一句话推动三步（见上） */
  lead?: string;
}) {
  const say = lead ? sayOf(lead) : null;
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
  /** 每步的小图注：一句话推动时不要 */
  const caption = (captions: readonly string[]) =>
    say ? undefined : captions[shown];

  const paintCol = (
    <li className="ab-col" key="paint">
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
        caption={caption(trio.paint.captions)}
      />
    </li>
  );

  const codeCol = (
    <li className="ab-col" key="code">
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
            {flow ? (
              <div className="ab-stack">
                {trio.code.drafts.map((draft, index) => (
                  <pre
                    key={index}
                    className="ab-pre"
                    data-on={index === shown || undefined}
                    aria-hidden={index === shown ? undefined : true}
                  >
                    <CodeDraft
                      lines={draft}
                      keyPrefix={
                        index === shown ? `${shown}` : `still-${index}`
                      }
                    />
                  </pre>
                ))}
              </div>
            ) : (
              <pre className="ab-pre">
                <CodeDraft lines={code} keyPrefix={`${shown}`} />
              </pre>
            )}
            <p className="ab-result">
              <span>{trio.code.result}</span>
              <a className="ab-sample" href="#beliefs">
                {trio.code.sample}
              </a>
            </p>
          </div>
        </div>
        <figcaption>
          <span className="m-caption">{caption(trio.code.captions)}</span>
        </figcaption>
      </figure>
    </li>
  );

  const wordsCol = (
    <li className="ab-col" key="words">
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
            {flow ? (
              <div className="ab-stack">
                {trio.words.drafts.map((draft, index) => (
                  <p
                    key={index}
                    className="ab-sentence"
                    data-on={index === shown || undefined}
                    aria-hidden={index === shown ? undefined : true}
                  >
                    <WordsDraft
                      parts={draft}
                      keyPrefix={
                        index === shown ? `${shown}` : `still-${index}`
                      }
                    />
                  </p>
                ))}
              </div>
            ) : (
              <p className="ab-sentence">
                <WordsDraft parts={words} keyPrefix={`${shown}`} />
              </p>
            )}
          </div>
        </div>
        <figcaption>
          <span className="m-caption">{caption(trio.words.captions)}</span>
        </figcaption>
      </figure>
    </li>
  );

  return (
    <div
      className="ab-trio"
      ref={box}
      data-step={shown}
      data-playing={playing || undefined}
      data-flow={flow || undefined}
      data-say={say ? true : undefined}
    >
      {say ? (
        <div className="ab-say-wrap">
          <p className="ab-say">
            <Phrases text={say.head} />
            {say.steps.map(([word, mark], index) => (
              <span key={word} className="m-phrase">
                <button
                  type="button"
                  className="ab-say-step"
                  aria-pressed={shown === index}
                  onClick={() => choose(index as Step)}
                  style={{ '--hold': `${HOLD[index as Step]}ms` } as Vars}
                >
                  {word}
                  <i className="ab-step-line" aria-hidden="true" />
                </button>
                {mark}
              </span>
            ))}
          </p>
          <span className="m-note">{trio.note}</span>
        </div>
      ) : (
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
              <button
                type="button"
                className="m-link ab-trio-ctl"
                onClick={replay}
              >
                <RotateCcw size={12} aria-hidden="true" />
                {mode === 'waiting' ? trio.play : trio.replay}
              </button>
            )}
            <span className="m-note">{trio.note}</span>
          </div>
        </div>
      )}

      <ol className="ab-cols">
        {say ? [codeCol, paintCol, wordsCol] : [paintCol, codeCol, wordsCol]}
      </ol>
    </div>
  );
}
