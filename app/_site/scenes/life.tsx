'use client';
import { BookOpen, Check, Leaf, Music, PenLine, Waves } from 'lucide-react';
import { at, Canvas, type Scene } from '../demo/demo';
import './life.css';

// Molis Life 的演示画面：节奏最慢、留白最多，主色是海水浅蓝与沙色。
// 首页的 case：「想陪妈妈去看海」先留着；空出半天，它带着「为什么此刻想到」冒出来，
// 给近一点 / 多走一段两种准备，去不去由你定。Life 还在原型探索，真实模型和外部服务尚未接入，所以标「原型示意」。

const days = ['一', '二', '三', '四', '五', '六', '日'];

export const seaCase: Scene = {
  id: 'life-sea',
  label:
    'Molis Life 原型示意：「想陪妈妈去看海」先留着；这周六下午空出来，它带着为什么此刻想到冒出来，给出近一点和多走一段两种准备，去不去由你决定。',
  steps: 4,
  times: [0, 1.6, 3.2, 4.9, 7.8],
  note: '原型示意',
  render: ({ step }) => (
    <Canvas step={step} className="lf lf-sea">
      <div className="lf-wish" data-up={step >= 2 || undefined}>
        <p className="lf-quote">“想陪妈妈去看海。”</p>
        <p className="lf-meta">
          <span className="m-chip" data-tone="line">
            先留着
          </span>
          <span className="m-mini">三周前留下</span>
        </p>
      </div>
      <div className="lf-week m-v" style={at(1, 3)}>
        {days.map((day, index) => (
          <span key={day} data-free={index === 5 || undefined}>
            <small>周{day}</small>
            <i />
            <i data-pm="" />
          </span>
        ))}
        <p className="m-mini">这周六下午，空出了半天</p>
      </div>
      <p className="lf-why m-v" style={at(2)}>
        <b>为什么此刻想到</b>
        这周六下午空着；天气预报是晴天；去海边四十分钟。
      </p>
      <div className="lf-plans">
        <div className="lf-plan m-v" style={at(3)}>
          <p>
            <b>近一点</b>
            <span className="m-mini">两个小时</span>
          </p>
          <p>城东海堤走一走，回来一起吃晚饭。</p>
        </div>
        <div className="lf-plan m-v" style={at(3, undefined, 180)}>
          <p>
            <b>多走一段</b>
            <span className="m-mini">半天</span>
          </p>
          <p>去南湾看日落，给妈妈带一件外套。</p>
        </div>
      </div>
      <p className="lf-decide m-v" style={at(3, undefined, 360)}>
        <Waves aria-hidden="true" />
        去不去、去哪一个，由你来定
      </p>
    </Canvas>
  ),
};

/* ---------- 开场：一直留在心里的几件事 ---------- */
const worries: Scene = {
  id: 'life-worries',
  label:
    'Molis Life 原型示意：一笔还没退回来的款、一件快到期的事、一个说过很久的愿望，先轻轻放在这里。',
  steps: 3,
  times: [0, 1.4, 2.8, 4.6],
  note: '原型示意',
  render: ({ step }) => (
    <Canvas step={step} className="lf lf-worries">
      <ul className="lf-notes">
        <li className="m-v" style={at(0)}>
          <small>挂念</small>
          <p>那笔退货的钱，还没退回来。</p>
          <span className="m-mini">十天前申请</span>
        </li>
        <li className="m-v" style={at(1)}>
          <small>快到期</small>
          <p>护照下个月到期。</p>
          <span className="m-mini">还有 34 天</span>
        </li>
        <li className="m-v" style={at(2)}>
          <small>心愿</small>
          <p>想陪妈妈去看海。</p>
          <span className="m-mini">说了很久</span>
        </li>
      </ul>
    </Canvas>
  ),
};

/* ---------- 让挂念的事情，有清楚的下文 ---------- */
const stages = [
  { label: '申请已提交', proof: '依据：申请记录 10/03' },
  { label: '对方已受理', proof: '依据：商家回复 10/05' },
  { label: '退货已签收', proof: '依据：物流签收 10/09' },
  { label: '钱已到账', proof: '' },
];

const refund: Scene = {
  id: 'life-refund',
  label:
    'Molis Life 原型示意：一件退换货的四个阶段分开记着，有依据的阶段才亮起；钱还没到账，就照实说还没到账，并提示哪里需要自己看一眼。',
  steps: 4,
  times: [0, 1.2, 2.4, 3.6, 5.4],
  note: '原型示意 · 服务未接入',
  render: ({ step }) => (
    <Canvas step={step} className="lf lf-refund">
      <p className="lf-refund-title">
        退货 · 一双不合脚的鞋
        <span className="m-mini">同一件事，持续整理进展</span>
      </p>
      <ol className="lf-stages">
        {stages.map((stage, index) => (
          <li
            key={stage.label}
            data-lit={(stage.proof && step >= index) || undefined}
            data-wait={(!stage.proof && step >= index) || undefined}
          >
            <i className="lf-stage-dot">
              {stage.proof ? <Check aria-hidden="true" /> : null}
            </i>
            <b>{stage.label}</b>
            <small className="m-v" style={at(index)}>
              {stage.proof || '还没有到账的依据'}
            </small>
          </li>
        ))}
      </ol>
      <p className="lf-refund-next m-v" style={at(3)}>
        已经过了商家说的五个工作日。要不要帮你写一句催问？
        <span className="m-chip" data-tone="line">
          需要你处理
        </span>
      </p>
    </Canvas>
  ),
};

/* ---------- 给好奇心留一个位置 ---------- */
const curious: Scene = {
  id: 'life-curious',
  label:
    'Molis Life 原型示意：散步时看见的植物、一本想读的书、一段让人停下来的音乐都可以留下，各自选替我处理、一起想想或先留着；它对你的理解，你可以改。',
  steps: 3,
  times: [0, 1.5, 3.0, 4.8],
  note: '原型示意',
  render: ({ step }) => (
    <Canvas step={step} className="lf lf-curious">
      <ul className="lf-keep">
        {[
          { icon: Leaf, text: '路边那棵开白花的树', pick: 1 },
          { icon: BookOpen, text: '一本想读的书', pick: 2 },
          { icon: Music, text: '咖啡店里那段大提琴', pick: 0 },
        ].map((item, index) => (
          <li
            key={item.text}
            className="m-v"
            style={at(0, undefined, index * 160)}
          >
            <item.icon aria-hidden="true" />
            <span>{item.text}</span>
            <span className="lf-choices">
              {['替我处理', '一起想想', '先留着'].map((choice, c) => (
                <em
                  key={choice}
                  data-on={(step >= 1 && c === item.pick) || undefined}
                >
                  {choice}
                </em>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <div className="lf-me m-v" style={at(1)}>
        <p className="lf-me-head">它对你的理解</p>
        <ul>
          <li>喜欢安静、靠水的地方</li>
          <li className="lf-edit" data-edited={step >= 2 || undefined}>
            周末想多睡一会儿
          </li>
          <li className="m-v" style={at(2, undefined, 400)}>
            <PenLine aria-hidden="true" />
            周末早上其实想出门走走
          </li>
        </ul>
      </div>
    </Canvas>
  ),
};

export const lifeScenes = { worries, refund, sea: seaCase, curious };
