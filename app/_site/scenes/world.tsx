'use client';
import { at, Canvas, type Scene } from '../demo/demo';
import './world.css';

// Molis World 的演示画面：像一张绘图桌，铅笔线、虚线框，故意保留未完成的样子。整件都是概念示意。
// 首页的 case：常去的面馆放进小岛，后厨的门通向另一座城，纪念物带回来摆在旁边。

/** 一座铅笔画的小岛（不规则的轮廓 + 一圈虚线的浅滩） */
export function Island({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`wd-island ${className}`}
      viewBox="0 0 300 180"
      aria-hidden="true"
    >
      <path
        className="wd-shoal"
        d="M24 104c-6-34 30-62 78-70 40-7 62-22 104-14 46 9 82 38 76 74-5 34-48 52-98 56-46 4-80 14-118 2-26-8-38-24-42-48z"
      />
      <path
        className="wd-land"
        d="M44 102c-3-26 26-46 64-52 32-5 52-17 86-11 36 7 64 29 60 56-4 26-40 39-80 42-36 3-62 11-92 1-22-7-36-18-38-36z"
      />
      <path className="wd-hatch" d="M70 120l18-18M84 128l22-22M100 132l20-20" />
    </svg>
  );
}

export const noodleCase: Scene = {
  id: 'world-noodle',
  label:
    'Molis World 概念示意：把常去的面馆放进自己的小岛；后厨的门通向另一座城；走过那段经历，把一枚纪念物带回来，摆在面馆旁边。',
  steps: 4,
  times: [0, 1.5, 3.1, 4.7, 7.4],
  note: '概念示意',
  render: ({ step }) => (
    <Canvas step={step} className="wd wd-noodle">
      <p className="wd-title">我的世界 · 草图</p>
      <div className="wd-home">
        <Island />
        <span className="wd-place wd-noodle-shop m-v" data-pop="" style={at(1)}>
          <svg viewBox="0 0 40 34" aria-hidden="true">
            <path d="M4 14 20 4l16 10M8 13v17h24V13M16 30v-9h8v9" />
            <path className="wd-steam" d="M14 2c-2 3 2 4 0 7M26 2c-2 3 2 4 0 7" />
          </svg>
          <b>巷口那家面馆</b>
        </span>
        <span className="wd-door m-v" data-fade="" style={at(2)}>
          后厨的门
        </span>
        <span className="wd-gift m-v" data-pop="" style={at(3)}>
          <svg viewBox="0 0 24 30" aria-hidden="true">
            <path d="M12 3v4M6 9h12l-1 15H7z" />
            <path d="M9 14h6M9 18h6" />
          </svg>
          <b>带回来的纸灯笼</b>
        </span>
      </div>
      <svg className="wd-route m-v" data-fade="" style={at(2)} viewBox="0 0 200 80" aria-hidden="true">
        <path d="M6 70C50 70 70 14 120 18s60 30 74 20" />
      </svg>
      <div className="wd-far m-v" data-fade="" style={at(2)}>
        <Island className="wd-island-far" />
        <b>另一座城</b>
        <small>一个故事里</small>
      </div>
      <p className="wd-foot m-v" style={at(3)}>
        过些日子再看到它：这个周末，真的去吃一次吧。
      </p>
    </Canvas>
  ),
};
