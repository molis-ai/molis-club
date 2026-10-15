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
            <path
              className="wd-steam"
              d="M14 2c-2 3 2 4 0 7M26 2c-2 3 2 4 0 7"
            />
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
      <svg
        className="wd-route m-v"
        data-fade=""
        style={at(2)}
        viewBox="0 0 200 80"
        aria-hidden="true"
      >
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

/** 一处铅笔画的小房子（面馆） */
function Shop() {
  return (
    <svg viewBox="0 0 40 34" aria-hidden="true">
      <path d="M4 14 20 4l16 10M8 13v17h24V13M16 30v-9h8v9" />
      <path className="wd-steam" d="M14 2c-2 3 2 4 0 7M26 2c-2 3 2 4 0 7" />
    </svg>
  );
}

/* ---------- 从一个在意的地方开始：放进去、取名字、按自己的方式布置 ---------- */
const seed: Scene = {
  id: 'world-seed',
  label:
    'Molis World 概念示意：一座还空着的小岛；把常去的面馆放进来，给它取一个名字、放进一段回忆，再按自己的方式布置一张长椅和一盏灯。',
  steps: 4,
  times: [0, 1.4, 2.8, 4.2, 6.0],
  note: '概念示意',
  render: ({ step }) => (
    <Canvas step={step} className="wd wd-seed">
      <p className="wd-title">我的世界 · 草图</p>
      <div className="wd-seed-island">
        <Island />
        <span className="wd-place wd-seed-shop m-v" data-pop="" style={at(1)}>
          <Shop />
          <b>
            <span className="m-stack">
              <span className="m-v" data-fade="" style={at(1, 2)}>
                常去的面馆
              </span>
              <span className="m-v" data-fade="" style={at(2)}>
                老陈面馆
              </span>
            </span>
          </b>
        </span>
        <span className="wd-memo m-v" style={at(2)}>
          第一次来，是个下雨天。
        </span>
        <svg
          className="wd-props m-v"
          data-fade=""
          style={at(3)}
          viewBox="0 0 80 40"
          aria-hidden="true"
        >
          <path d="M6 30h26M9 30v6M29 30v6M8 25h22" />
          <path d="M60 36V10M60 10c6 0 8 4 8 4h-16s2-4 8-4" />
          <circle className="wd-lamp" cx="60" cy="17" r="2.4" />
        </svg>
      </div>
      <p className="wd-foot m-v" style={at(3)}>
        长椅和一盏灯，按你的方式摆。
      </p>
    </Canvas>
  ),
};

/* ---------- 让生活与故事，在个人世界里相遇：连接尚未实现 ---------- */
const meet: Scene = {
  id: 'world-meet',
  label:
    'Molis World 概念示意：Life 关心真实生活中的心愿与行动，Story 提供可以进入的体验，World 让人亲手搭建、布置和重访自己的空间；三者之间的连接尚未实现，连接什么由你选择。',
  steps: 3,
  times: [0, 1.6, 3.2, 5.0],
  note: '概念示意',
  render: ({ step }) => (
    <Canvas step={step} className="wd wd-meet">
      <p className="wd-title">一个设想 · 草图</p>
      <div className="wd-nodes">
        <span className="wd-node" data-k="life">
          <b>Life</b>
          <small>真实生活中的心愿与行动</small>
        </span>
        <span className="wd-node" data-k="story">
          <b>Story</b>
          <small>可以进入的体验</small>
        </span>
        <span className="wd-node m-v" data-k="world" data-pop="" style={at(1)}>
          <b>World</b>
          <small>亲手搭建、布置和重访</small>
        </span>
        <svg
          className="wd-links m-v"
          data-fade=""
          style={at(1)}
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M22 24C36 24 40 42 50 42M78 24C64 24 60 42 50 42" />
        </svg>
      </div>
      <p className="wd-pending m-v" style={at(2)}>
        <span className="m-chip" data-tone="line">
          连接尚未实现
        </span>
        连接哪些内容、留下哪些经历、向谁分享，都由你选。
      </p>
    </Canvas>
  ),
};

export const worldScenes = { seed, noodle: noodleCase, meet };
