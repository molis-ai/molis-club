'use client';
import { Fragment, useEffect, useRef, useState } from 'react';

// 「关于」首屏的打字机（负责人 2026-10-19：「字可以用打字机的动效来做」）。
// 主线先一个字一个字打出来，逗号、句号后停一停，再打下面那两句；光标是一道杏色细线，跟在最后一个字后面，
// 打完闪几下就收起。每个字一开始就占着位置（只是透明），打字时版面不跳；断行仍按逗号、句号分组。
// 读屏只读整句（sr-only），打出来的字不进读屏。
// 没有 JS：整句直接在。减少动态：直接是打完的样子，没有光标。水合失败时 2.4 秒后字自己出来（typewriter.css）。
// play 为 false 时先不打、字藏着（结尾那一屏等滚到了再打），onDone 在打完时回调一次。

type Line = {
  text: string;
  as: 'h1' | 'h2' | 'p';
  className: string;
  id?: string;
  lang?: string;
  /** 每个字大约多少毫秒 */
  pace: number;
};

/** 按逗号、句号分组，组内不折行（同 ui.tsx 的 Phrases） */
const phrasesOf = (text: string) =>
  text.match(/[^，。、；！？：]+[，。、；！？：]?/g) ?? [text];

/** 打完这个字以后多停一会儿 */
const restAfter = (char: string) =>
  char === '。' ? 420 : '，、；：'.includes(char) ? 260 : 0;

export function Typewriter({
  lines,
  start = 420,
  between = 520,
  play = true,
  onDone,
}: {
  lines: Line[];
  /** 进页面后多久开始打 */
  start?: number;
  /** 两行之间停多久 */
  between?: number;
  /** 什么时候开始打（默认进页面就打） */
  play?: boolean;
  /** 打完了 */
  onDone?: () => void;
}) {
  const total = lines.reduce(
    (sum, line) => sum + Array.from(line.text).length,
    0,
  );
  // 服务端与水合时是打完的样子（样式在有 JS 时先藏起来，见 typewriter.css）
  const [typed, setTyped] = useState(total);
  const [state, setState] = useState<'wait' | 'idle' | 'typing' | 'done'>(
    play ? 'idle' : 'wait',
  );
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });

  useEffect(() => {
    let frame = 0;
    if (!play) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      frame = requestAnimationFrame(() => {
        setState('done');
        done.current?.();
      });
      return () => cancelAnimationFrame(frame);
    }
    // 每个字什么时候出来：按这一行的速度，略有快慢，标点后停一停
    const times: number[] = [];
    let at = start;
    lines.forEach((line, index) => {
      if (index) at += between;
      for (const char of line.text) {
        at += line.pace * (0.7 + Math.random() * 0.6);
        times.push(at);
        at += restAfter(char);
      }
    });
    let began = 0;
    const tick = (now: number) => {
      if (!began) {
        began = now;
        setState('typing');
      }
      const elapsed = now - began;
      let count = 0;
      while (count < times.length && times[count] <= elapsed) count += 1;
      setTyped(count);
      if (count < times.length) frame = requestAnimationFrame(tick);
      else {
        setState('done');
        done.current?.();
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // 只在进页面时打一遍（换页时 template.tsx 会重新挂上；props 来自服务端，不会变）
  }, [lines, start, between, play]);

  let index = 0;
  const caretAt = Math.max(typed - 1, 0);
  const caret = (
    <i
      className="tw-caret"
      aria-hidden="true"
      data-done={state === 'done' || undefined}
    />
  );

  return (
    <div className="tw" data-state={state}>
      {lines.map((line) => {
        const Tag = line.as;
        return (
          <Tag
            key={line.text}
            className={line.className}
            id={line.id}
            lang={line.lang}
          >
            <span className="sr-only">{line.text}</span>
            <span aria-hidden="true">
              {phrasesOf(line.text).map((phrase, p) => (
                <span key={p} className="m-phrase">
                  {Array.from(phrase).map((char) => {
                    const i = index++;
                    return (
                      <Fragment key={i}>
                        {i === 0 && typed === 0 && state === 'typing'
                          ? caret
                          : null}
                        <span className="tw-c" data-on={i < typed || undefined}>
                          {char}
                        </span>
                        {i === caretAt &&
                        typed > 0 &&
                        state !== 'idle' &&
                        state !== 'wait'
                          ? caret
                          : null}
                      </Fragment>
                    );
                  })}
                </span>
              ))}
            </span>
          </Tag>
        );
      })}
    </div>
  );
}
