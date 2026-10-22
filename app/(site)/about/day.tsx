'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

// 第二、三章（负责人 2026-10-22 定第四版；10-22 晚把两章接成同一扇窗，免得中间「卡一下」）：
// 左边一列字往下读（底稿 2.3、2.4），右边一扇窗停在原位，读到哪里窗里就换成什么：
//   Work 与 Tool → Life → Story（只在窗里面变深，DESIGN.md）→「一天才逐渐完整」时四件并排、窗顶那条线走满 →
//   2.4 开始，窗变成 World 的格纸：先描出海岸 → 读到 World 那段，岛上标出三处地方 → 读到「眼下……」，右下角起了另一座岛的稿。
// 窗顶一道细线上有个杏色小点，跟着这一天从左往右走；不写「清晨」「入夜」，一天自己就出来了。
// 没有 JS、窄屏、减少动态：不钉窗，每一步的图排在自己那段字的上面（格纸只在第三章开头放一次，画好的样子）。

export type DayStep = {
  key: string;
  /** 窗的颜色：哪件产品的；day 是四件放在一起，world 是 World 的格纸 */
  tone: 'work' | 'life' | 'story' | 'day' | 'world';
  /** 窗里的画（world 几步共用 world 那张，不用写） */
  art?: ReactNode;
  /** 不钉窗时排在这段字上面的图，默认就是 art */
  fig?: ReactNode;
  /** 窗下的一行字 */
  caption?: ReactNode;
  body: ReactNode;
};

export function Day({
  steps,
  world,
  worldCaption,
}: {
  steps: DayStep[];
  /** World 的格纸：一张画，读到哪一段就多画出一层 */
  world: ReactNode;
  worldCaption: ReactNode;
}) {
  const [on, setOn] = useState(0);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            setOn(Number((entry.target as HTMLElement).dataset.index));
      },
      { rootMargin: '-46% 0px -46% 0px' },
    );
    for (const node of nodes.current) if (node) watch.observe(node);
    return () => watch.disconnect();
  }, []);
  const tone = steps[on].tone;
  const firstWorld = steps.findIndex((step) => step.tone === 'world');
  return (
    <div className="dy">
      <div className="dy-steps">
        {steps.map((step, index) => {
          const fig = step.fig ?? step.art;
          return (
            <div
              key={step.key}
              className="dy-step"
              data-index={index}
              data-tone={step.tone}
              data-on={index === on || undefined}
              ref={(node) => {
                nodes.current[index] = node;
              }}
            >
              {fig ? (
                <figure
                  className="dy-fig"
                  data-tone={step.tone}
                  aria-hidden={step.tone === 'world' ? undefined : true}
                >
                  {step.tone === 'world' ? (
                    fig
                  ) : (
                    <>
                      <span className="dy-arts">{fig}</span>
                      {step.caption ? (
                        <figcaption className="dy-cap">
                          {step.caption}
                        </figcaption>
                      ) : null}
                    </>
                  )}
                </figure>
              ) : null}
              <div className="dy-body">{step.body}</div>
            </div>
          );
        })}
      </div>
      <div className="dy-win" aria-hidden="true">
        <div
          className="dy-pane"
          data-tone={tone}
          data-step={on}
          data-wstep={tone === 'world' ? on - firstWorld : undefined}
        >
          <span className="dy-sky">
            <i className="dy-sun" />
          </span>
          {steps.map((step, index) =>
            step.art ? (
              <figure
                key={step.key}
                className="dy-shot"
                data-on={index === on || undefined}
              >
                <span className="dy-arts">{step.art}</span>
                {step.caption ? (
                  <figcaption className="dy-cap">{step.caption}</figcaption>
                ) : null}
              </figure>
            ) : null,
          )}
          <figure className="dy-world" data-on={tone === 'world' || undefined}>
            {world}
            <figcaption className="dy-cap">{worldCaption}</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
