'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Vars } from '../../_site/ui';
import { useCue } from './cue';
import { HoldContext, LoopToggle, useOnScreen, useStill } from './stage';

// 首屏以后的一长段（specs/site-rebuild/tool-page.md 第 13 节）：右边一块 Mac 屏幕钉住，左边的字一段一段滚过去。
// 哪段字压过视口中线，右边就换成那一段的屏幕（只交叉淡入淡出，不位移）；换到它时从空白开始演，换走时停在原处。
// 没有自己屏幕的一段（眼前的小事的开头）沿用下一段的。
// 窄屏、矮屏、没有 JS：不钉，每段字下面跟着自己的屏幕，进入视口就演。减少动态时停在做完的样子。

export type Scene = {
  /** scripts.ts 里那一段编排的名字 */
  cue: string;
  /** 屏幕自己的类名：tl-shift、tl-case、tl-plug（tool.css 按它摆每一拍） */
  kind: string;
  /** 读屏用：画面在演什么 */
  label: string;
  /** 屏幕下面那行「示意」 */
  note: ReactNode;
  /** 画面里有访客能按的东西：不再整块对读屏隐藏，由零件自己标 */
  interactive?: boolean;
  art: ReactNode;
};

export type Stop = { id: string; text: ReactNode; scene?: Scene };

const PIN = 'screen and (min-width: 901px) and (min-height: 600px)';

/** 一块屏幕和下面那行小字；钉住时几块叠在一起，只亮当下这一块 */
function Figure({
  scene,
  on,
  active,
  paused,
  setPaused,
}: {
  scene: Scene;
  on: boolean;
  active: boolean;
  paused: boolean;
  setPaused: (value: boolean) => void;
}) {
  const box = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const still = useStill();
  const shown = useOnScreen(box);
  const [hold, setHold] = useState<string | null>(null);
  useCue(stage, scene.cue, { live: shown && !paused, still, hold, active });
  return (
    <figure ref={box} className="tl-walk-fig" data-on={on || undefined}>
      <HoldContext.Provider value={{ hold, setHold }}>
        <div
          ref={stage}
          className={`tl-mac ${scene.kind}`}
          aria-hidden={scene.interactive ? undefined : 'true'}
        >
          {scene.art}
        </div>
      </HoldContext.Provider>
      <figcaption className="tl-foot">
        <span className="sr-only">{scene.label}</span>
        <span className="tl-note">{scene.note}</span>
        {still ? null : (
          <LoopToggle
            stopped={paused || hold !== null}
            onToggle={() => {
              if (hold !== null) {
                setHold(null);
                setPaused(false);
              } else setPaused(!paused);
            }}
          />
        )}
      </figcaption>
    </figure>
  );
}

export function Walk({ stops }: { stops: Stop[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [pinned, setPinned] = useState(false);
  // 暂停是整段的：换到下一块屏幕也还停着
  const [paused, setPaused] = useState(false);
  // 每一段亮哪块屏幕：自己的，没有就用往下第一块
  const shows = stops.map((_, index) =>
    stops.findIndex((stop, later) => later >= index && stop.scene),
  );

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const media = matchMedia(PIN);
    const texts = Array.from(
      node.querySelectorAll<HTMLElement>('.tl-walk-text'),
    );
    let frame = 0;
    const read = () => {
      frame = 0;
      setPinned(media.matches);
      // 顶栏下面那块的中线：哪段字的上沿过了这条线，就是哪段
      const header =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--header',
          ),
        ) || 0;
      const line = (window.innerHeight + header) / 2;
      let found = 0;
      texts.forEach((text, index) => {
        if (text.getBoundingClientRect().top <= line) found = index;
      });
      setAt(found);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    request();
    media.addEventListener('change', request);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      media.removeEventListener('change', request);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);

  return (
    <div
      ref={root}
      className="m-wrap tl-walk"
      style={{ '--rows': stops.length } as Vars}
    >
      {stops.map((stop, index) => (
        <div key={stop.id} className="tl-walk-step">
          <div
            className="tl-walk-text"
            data-on={index === at || undefined}
            style={{ '--row': index + 1 } as Vars}
          >
            {stop.text}
          </div>
          {stop.scene ? (
            <Figure
              scene={stop.scene}
              on={shows[at] === index}
              active={!pinned || shows[at] === index}
              paused={paused}
              setPaused={setPaused}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
