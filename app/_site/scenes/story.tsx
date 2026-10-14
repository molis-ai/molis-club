'use client';
import { at, Canvas, type Scene } from '../demo/demo';
import './story.css';

// Molis Story 的演示画面：全站唯一允许变深变浓的地方，但只在窗里面。
// 首页的 case（彼处）：从一个「如果」走进一本逐章展开的书，归来时写下一句话，落进「此处」。

export const elsewhereCase: Scene = {
  id: 'story-elsewhere',
  label:
    'Molis Story 界面示意：彼处从一个「如果」开始，走进一本逐章展开的书；归来时写下一句自己的话，落进「此处」带回来的东西里。',
  steps: 5,
  times: [0, 1.4, 2.9, 4.3, 5.8, 8.0],
  note: '界面示意',
  render: ({ step }) => (
    <Canvas step={step} className="st st-elsewhere">
      <div className="st-if m-v" data-fade="" style={at(0, 2)}>
        <p className="st-world">彼处 · 活一次另一个你</p>
        <p className="st-if-line">如果那年，我去了海边那所学校……</p>
      </div>
      <div className="st-book m-v" data-pop="" style={at(1, 4)}>
        <div className="st-page st-page-l">
          <small>第一章</small>
          <p>海风把校门口的旗子吹得很响。</p>
          <span className="m-ln" />
          <span className="m-ln" style={{ width: '70%' }} />
        </div>
        <div className="st-page st-page-r" data-turn={step >= 2 || undefined}>
          <div className="st-leaf-front">
            <small>第二章</small>
            <p>你开始习惯早上去码头。</p>
            <span className="m-ln" />
          </div>
          <div className="st-leaf-back">
            <small>第三章</small>
            <p>有一封信，一直没有寄出去。</p>
            <span className="m-ln" />
          </div>
        </div>
      </div>
      <div className="st-return m-v" style={at(3, 5)}>
        <small>归来 · 为这次经历写一句话</small>
        <p className="st-typed">
          <span>原来我一直想离海近一点。</span>
        </p>
      </div>
      <div className="st-here m-v" style={at(4)}>
        <p className="st-here-head">此处 · 带回来的</p>
        <ul>
          <li className="m-v" style={at(4, undefined, 260)}>
            <span>彼处</span>“原来我一直想离海近一点。”
          </li>
          <li>
            <span>袖珍博物馆</span>一本春天的纪念册
          </li>
          <li>
            <span>云海来客</span>一段还没读懂的信号
          </li>
        </ul>
      </div>
    </Canvas>
  ),
};

/* =====================================================================
   Story 页：四个世界各演一个瞬间（概念画面，整屏）
   ===================================================================== */

/** 云海来客：一来一回的信号 */
function Signal({
  bars,
  className = '',
}: {
  bars: number[];
  className?: string;
}) {
  return (
    <span className={`st-signal ${className}`} aria-hidden="true">
      {bars.map((h, i) => (
        <i key={i} style={{ '--h': h } as React.CSSProperties} />
      ))}
    </span>
  );
}

const astralo: Scene = {
  id: 'story-astralo',
  label:
    'Molis Story 概念画面（云海来客）：云海那一端有什么在闪；你发出一段信号，它回了一段不太一样的；一来一回，彼此的意思慢慢清楚了一点。',
  steps: 4,
  times: [0, 1.5, 3, 4.5, 6.5],
  note: '概念画面',
  render: ({ step }) => (
    <Canvas step={step} className="st st-moment st-astralo">
      <span className="st-glow m-v" data-fade="" style={at(0)} />
      <div className="st-talk">
        <p className="st-line st-line-you m-v" style={at(1)}>
          <small>你</small>
          <Signal bars={[3, 6, 3, 8, 3]} />
        </p>
        <p className="st-line st-line-it m-v" style={at(2)}>
          <small>它</small>
          <Signal bars={[3, 6, 2, 9, 5, 2]} />
        </p>
        <p className="st-line st-line-you m-v" style={at(3)}>
          <small>你</small>
          <Signal bars={[3, 6, 2, 9, 5, 2]} className="st-echo" />
        </p>
        <p className="st-line st-line-it m-v" style={at(3, undefined, 500)}>
          <small>它</small>
          <Signal bars={[2, 9, 5, 2, 7]} />
        </p>
      </div>
    </Canvas>
  ),
};

const elsewhereWorld: Scene = {
  id: 'story-elsewhere-world',
  label:
    'Molis Story 概念画面（彼处）：先分清真实经历与想象，再走进一本逐章展开的书；读下去，也可以停一会儿；归来时写下一句自己的话。',
  steps: 4,
  times: [0, 1.5, 3, 4.5, 6.5],
  note: '概念画面',
  render: ({ step }) => (
    <Canvas step={step} className="st st-moment st-elsewhere-w">
      <div className="st-border m-v" data-fade="" style={at(0, 1)}>
        <p>
          <small>真实</small>那年我留在了北方。
        </p>
        <p>
          <small>如果</small>我去了海边那所学校。
        </p>
      </div>
      <div className="st-book st-book-w m-v" data-pop="" style={at(1, 3)}>
        <div className="st-page st-page-l">
          <small>第一章</small>
          <p>海风把校门口的旗子吹得很响。</p>
        </div>
        <div className="st-page st-page-r" data-turn={step >= 2 || undefined}>
          <div className="st-leaf-front">
            <small>第二章</small>
            <p>你开始习惯早上去码头。</p>
          </div>
          <div className="st-leaf-back">
            <small>第三章</small>
            <p>有一封信，一直没有寄出去。</p>
          </div>
        </div>
      </div>
      <div className="st-return m-v" style={at(3)}>
        <small>归来 · 为这次经历写一句话</small>
        <p className="st-typed">
          <span>原来我一直想离海近一点。</span>
        </p>
      </div>
    </Canvas>
  ),
};

const museum: Scene = {
  id: 'story-museum',
  label:
    'Molis Story 概念画面（袖珍博物馆）：一面空墙；挑几张照片摆进展厅，给它们写下展签，再走进自己布置的展厅。',
  steps: 4,
  times: [0, 1.5, 3, 4.5, 6.5],
  note: '概念画面',
  render: ({ step }) => (
    <Canvas step={step} className="st st-moment st-museum">
      <div className="st-wall">
        {[
          { tone: '#c9b28a', w: 20, h: 26, x: 18, y: 26 },
          { tone: '#8fa3a8', w: 26, h: 18, x: 44, y: 22 },
          { tone: '#b98f78', w: 16, h: 22, x: 76, y: 30 },
        ].map((photo, i) => (
          <span
            key={i}
            className="st-photo m-v"
            data-pop=""
            style={
              {
                ...at(1, undefined, i * 220),
                '--tone': photo.tone,
                left: `${photo.x}%`,
                top: `${photo.y}%`,
                width: `${photo.w}%`,
                height: `${photo.h}%`,
              } as React.CSSProperties
            }
          />
        ))}
        <p className="st-label m-v" style={at(2)}>
          <b>春天，外婆家的院子</b>
          <span>2019 · 三张照片 · 一个下午</span>
        </p>
        <span className="st-floor" />
      </div>
      <p className="st-enter m-v" style={at(3)}>
        走进自己布置的展厅，也可以留成一本离线纪念册。
      </p>
    </Canvas>
  ),
};

const fog: Scene = {
  id: 'story-fog',
  label:
    'Molis Story 概念画面（雾港失物招领处）：夜班的柜台上放着一把没有主人的伞；有人来认领，交给他还是再等等，由你来选；下一夜，你的选择留下了新的事情。',
  steps: 4,
  times: [0, 1.5, 3, 4.5, 6.5],
  note: '概念画面',
  render: ({ step }) => (
    <Canvas step={step} className="st st-moment st-fog">
      <p className="st-night">
        <span className="m-stack">
          <span className="m-v" data-fade="" style={at(0, 3)}>
            第一夜 · 23:40
          </span>
          <span className="m-v" data-fade="" style={at(3)}>
            第二夜 · 22:15
          </span>
        </span>
      </p>
      <div className="st-counter">
        <span className="st-item m-v" style={at(0)}>
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <path d="M4 20a16 16 0 0 1 32 0zM20 20v12a3 3 0 0 0 6 0" />
          </svg>
          一把没有主人的伞
        </span>
        <p className="st-visitor m-v" style={at(1, 3)}>
          「这是我的。昨天落在码头了。」
        </p>
        <p className="st-choices m-v" style={at(2, 3)}>
          <span>交给他</span>
          <span>再等等</span>
        </p>
        <p className="st-after m-v" style={at(3)}>
          柜台上多了一封信：「伞的主人来过，说谢谢你等了等。」
        </p>
      </div>
    </Canvas>
  ),
};

export const worldMoments = {
  astralo,
  elsewhere: elsewhereWorld,
  museum,
  fog,
};
