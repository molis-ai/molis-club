'use client';
import { Waves } from 'lucide-react';
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
