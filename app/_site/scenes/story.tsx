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
