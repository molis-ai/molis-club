'use client';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useProgress } from './progress';

// 《黑客与画家》钉住一屏，跟着滚动讲三拍（负责人 2026-10-23 选提案 B，同日嫌六拍太长，缩成三拍）：
//   0 开头那句，画从赭红的底稿色慢慢上色，展签挂在右栏底下 →
//   1 推近她身后的杜松，典故一段话，指纹那句晚一点浮出，杜松和天空交界的地方亮起一个杏色小圈 →
//   2 画退开，「没人细看的地方，也一样认真。」当标题，下面 1.3 后半句，四张手稿一张张落下。
// 只换 data-stage，样式里排位置；画的推近由这里的 stage 带（makers-painting.tsx 读 MakersStage）。
// 宽屏、有 JS、不减少动态才钉住；其余照原来一屏的版式，画自己按时间上色、推近。

const STOPS = [0.3, 0.68] as const;
const PIN = '(min-width: 901px) and (prefers-reduced-motion: no-preference)';

export const MakersStage = createContext<{ pinned: boolean; stage: number }>({
  pinned: false,
  stage: 0,
});

export const useMakersStage = () => useContext(MakersStage);

export function MakersPin({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [pinned, setPinned] = useState(false);
  useProgress(box, STOPS, setStage);
  useEffect(() => {
    const media = matchMedia(PIN);
    const sync = () => setPinned(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return (
    <MakersStage.Provider value={{ pinned, stage }}>
      <div className="mk" ref={box} data-stage={stage}>
        <div className="mk-stage">{children}</div>
      </div>
    </MakersStage.Provider>
  );
}
