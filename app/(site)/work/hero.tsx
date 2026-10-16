'use client';
import { useRef, useState } from 'react';
import { personas, type Persona } from '../../../content/site/work';
import { Reel } from '../../_site/demo/reel';
import { useReducedMotion, useVisible } from '../../_site/motion';
import { workHeroScenes } from '../../_site/scenes/work';

// 首屏右边的短循环：写代码看「报错 → 交给 Codex」，写文档看「视频里一句 → 放进第 2 节」。
// 两版都在页面里，外层按读者藏掉一版；藏起来的那版不在视口里，自然不播。
function HeroReel({ persona }: { persona: Persona }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useVisible(ref, 0.3);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const scene = workHeroScenes[persona];
  return (
    <div className="wp-hero-reel" data-p={persona} ref={ref}>
      <Reel
        name="Molis Work"
        segments={[{ title: scene.label, scene }]}
        running={visible && !paused}
        reduced={reduced}
        paused={paused}
        onPause={() => setPaused((value) => !value)}
        view="16 / 10.5"
        bare
      />
    </div>
  );
}

export function HeroDemo() {
  return (
    <div className="m-phero-window wp-hero-demo m-rise">
      {personas.map((persona) => (
        <HeroReel key={persona} persona={persona} />
      ))}
    </div>
  );
}
