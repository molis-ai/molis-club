'use client';
import { Pause, Play } from 'lucide-react';
import {
  memo,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { pad } from '../ui';
import type { Scene } from './demo';

// 首页舞台的演示：按时间播几段画面，底部几条细线表示第几段，点哪条看哪段。
// 只在选中、在视口里、没暂停时播（running）；减少动态时不播，停在每段的结果上，点细线换段。
// 进度线直接改样式，不为每一帧重渲染画面；只有换步、换段时才更新。

export type Segment = { title: string; scene: Scene; tag?: string };

const Frame = memo(function Frame({
  scene,
  step,
}: {
  scene: Scene;
  step: number;
}) {
  return <>{scene.render({ step })}</>;
});

/** 进度线直接写样式：之前的段是满的，之后的段是空的，当前段按已播的时长 */
function paint(
  fills: (HTMLElement | null)[],
  segments: Segment[],
  index: number,
  ms: number,
) {
  const length = segments[index].scene.times.at(-1)! * 1000;
  fills.forEach((node, i) => {
    if (!node) return;
    const fill = i < index ? 1 : i > index ? 0 : Math.min(1, ms / length);
    node.style.setProperty('--fill', fill.toFixed(4));
  });
}

export function Reel({
  name,
  segments,
  running,
  reduced,
  paused,
  onPause,
  view = '16 / 10',
  footer,
}: {
  name: string;
  segments: Segment[];
  running: boolean;
  reduced: boolean;
  paused: boolean;
  onPause: () => void;
  view?: string;
  footer?: ReactNode;
}) {
  const [now, setNow] = useState(0);
  // 服务端与没有 JS 时停在结果上；开始播时从第一步演起
  const [step, setStep] = useState(() => segments[0].scene.steps - 1);
  // 每播完一轮、每次点细线都换一个 round，让计时从头开始
  const [round, setRound] = useState(0);
  const elapsed = useRef(0);
  const fills = useRef<(HTMLElement | null)[]>([]);
  const total = segments.length;

  useEffect(() => {
    if (!running || reduced) return;
    let frame = 0;
    let last = performance.now();
    const index = now;
    const { scene } = segments[index];
    const length = scene.times.at(-1)! * 1000;
    const tick = (time: number) => {
      elapsed.current += Math.min(100, time - last);
      last = time;
      if (elapsed.current >= length) {
        elapsed.current = 0;
        setStep(0);
        setNow((index + 1) % total);
        setRound((value) => value + 1);
        return;
      }
      const seconds = elapsed.current / 1000;
      let next = 0;
      for (let i = 0; i < scene.steps; i += 1)
        if (seconds >= scene.times[i]) next = i;
      setStep(next);
      paint(fills.current, segments, index, elapsed.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, reduced, segments, total, now, round]);

  const go = (index: number) => {
    elapsed.current = 0;
    setNow(index);
    setStep(0);
    setRound((value) => value + 1);
    paint(fills.current, segments, index, reduced ? Infinity : 0);
  };

  // 减少动态：不播，停在这一段的结果上
  const shown = reduced ? segments[now].scene.steps - 1 : step;
  const current = segments[now];
  return (
    <div className="m-reel">
      <div className="m-reel-cap" aria-live="polite">
        <span className="m-no" aria-hidden="true">
          {pad(now + 1)}
        </span>
        <p>
          {current.title}
          {current.tag ? (
            <>
              {' '}
              <span className="m-note">{current.tag}</span>
            </>
          ) : null}
        </p>
      </div>
      <figure
        className="m-reel-view"
        style={{ '--view': view } as CSSProperties}
        aria-label={`${current.scene.label}（${current.scene.note}）`}
      >
        {segments.map((segment, index) => (
          <div
            key={segment.scene.id}
            className="m-reel-scene"
            data-now={index === now || undefined}
            aria-hidden="true"
          >
            <Frame
              scene={segment.scene}
              step={index === now ? shown : segment.scene.steps - 1}
            />
          </div>
        ))}
      </figure>
      <div className="m-reel-bottom">
        <fieldset className="m-segs">
          <legend className="sr-only">{`${name} 的 ${total} 段演示`}</legend>
          {segments.map((segment, index) => (
            <button
              key={segment.scene.id}
              type="button"
              className="m-seg"
              aria-pressed={index === now}
              aria-label={`${pad(index + 1)} ${segment.title}`}
              onClick={() => go(index)}
            >
              <i>
                <b
                  ref={(node) => {
                    fills.current[index] = node;
                  }}
                  style={
                    reduced
                      ? ({ '--fill': index === now ? 1 : 0 } as CSSProperties)
                      : undefined
                  }
                />
              </i>
            </button>
          ))}
        </fieldset>
        <span className="m-reel-tools">
          <span className="m-note">{current.scene.note}</span>
          {reduced ? null : (
            <button
              type="button"
              className="m-pause"
              aria-pressed={paused}
              aria-label={paused ? '继续播放演示' : '暂停演示'}
              onClick={onPause}
            >
              {paused ? (
                <Play size={10} fill="currentColor" aria-hidden="true" />
              ) : (
                <Pause size={10} fill="currentColor" aria-hidden="true" />
              )}
            </button>
          )}
        </span>
      </div>
      {footer}
    </div>
  );
}
