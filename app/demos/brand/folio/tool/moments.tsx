'use client';
import {
  ArrowRight,
  Bell,
  CalendarPlus,
  Check,
  FileImage,
  FileText,
  Quote,
  RotateCcw,
} from 'lucide-react';
import { moments } from '../../../../../content/molis-tool';
import { Loop } from '../loop';
import type { Vars } from '../shared';
import './moments.css';

// 一天里的六个时刻：每张卡都是「眼前的东西 → Molis Tool 动一下 → 结果回到这里」。
// 一轮 10 秒，六张错开节拍；整组共用一个暂停键。基础样式就是播完的样子。

function Poster() {
  return (
    <div className="ftm-poster">
      <span className="ftm-frame" />
      <b>12</b>
      <i>OCT</i>
      <strong>
        城市
        <br />
        设计展
      </strong>
    </div>
  );
}

function Scene({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="ftm-scene ftm-poster-scene">
        <Poster />
        <div className="ftm-draft">
          <em>
            <CalendarPlus size={13} />
            日程草稿
          </em>
          <p>
            <span className="ftm-type ftm-type-1">城市设计展</span>
          </p>
          <p>
            <span className="ftm-type ftm-type-2">周六 14:00 — 17:00</span>
          </p>
          <p>
            <span className="ftm-type ftm-type-3">河岸艺术中心</span>
          </p>
        </div>
        <span className="ftm-tag ftm-tag-late">等你确认</span>
      </div>
    );
  if (index === 1)
    return (
      <div className="ftm-scene ftm-watch">
        <div className="ftm-page">
          <small>周末工作坊 · 报名</small>
          <div className="ftm-seat">
            剩余名额
            <span className="ftm-count">
              <b className="ftm-count-old">0</b>
              <b className="ftm-count-new">3</b>
            </span>
            位<span className="ftm-region" />
          </div>
          <i />
          <i />
        </div>
        <span className="ftm-tag ftm-tag-early">只关注这一块</span>
        <p className="ftm-toast">
          <Bell size={14} />
          名额 0 → 3，有新名额了
        </p>
      </div>
    );
  if (index === 2)
    return (
      <div className="ftm-scene ftm-chat">
        <p className="ftm-bubble">
          <small>小周</small>发布页周五前改好，我来补文案。
        </p>
        <p className="ftm-bubble ftm-bubble-me">好，周五上线。</p>
        <span className="ftm-select" />
        <div className="ftm-todo">
          <Check size={16} strokeWidth={3} />
          <div>
            <strong>补齐发布页文案</strong>
            <small>小周 · 周五前</small>
          </div>
          <span>
            <Quote size={11} />
            原话
          </span>
        </div>
      </div>
    );
  if (index === 3)
    return (
      <div className="ftm-scene ftm-batch">
        {['IMG_2041.jpg', 'IMG_2042.jpg', 'IMG_2043.jpg'].map((name, n) => (
          <p key={name} className="ftm-file" style={{ '--n': n } as Vars}>
            <FileImage size={14} />
            <span className="ftm-old">{name}</span>
            <ArrowRight size={12} className="ftm-arrow" />
            <span className="ftm-new">展览-0{n + 1}.jpg</span>
          </p>
        ))}
        <p className="ftm-batch-foot">
          <span className="ftm-preview">先预览</span>
          <span className="ftm-done">
            <Check size={13} strokeWidth={3} />
            已处理 · 可还原
            <RotateCcw size={12} />
          </span>
        </p>
      </div>
    );
  if (index === 4)
    return (
      <div className="ftm-scene ftm-agent">
        <p className="ftm-menubar">
          <span className="ftm-dot" />
          Claude Code
          <span className="ftm-status">
            <small className="ftm-busy">正在做</small>
            <small className="ftm-wait">等你一下</small>
          </span>
        </p>
        <div className="ftm-mywork">
          <small>你在写自己的东西</small>
          <i />
          <i />
          <i />
        </div>
        <p className="ftm-ping">
          <Bell size={14} />
          需要你确认这一步
          <u>去看看</u>
        </p>
      </div>
    );
  return (
    <div className="ftm-scene ftm-research">
      <p className="ftm-docs">
        <span>
          <FileText size={13} />
          方案 A.pdf
        </span>
        <span>
          <FileText size={13} />
          方案 B.pdf
        </span>
      </p>
      <div className="ftm-table">
        <span>维度</span>
        <span>A</span>
        <span>B</span>
        {[
          ['部署', '本机', '托管'],
          ['适合', '个人', '协作'],
        ].map((row, n) => (
          <p key={row[0]} className="ftm-row" style={{ '--n': n } as Vars}>
            <span>{row[0]}</span>
            <strong>{row[1]}</strong>
            <strong>{row[2]}</strong>
          </p>
        ))}
      </div>
      <span className="ftm-tag ftm-tag-late">每一格都找得到出处</span>
    </div>
  );
}

export function Moments() {
  return (
    <Loop
      label="Molis Tool 一天里的六个时刻：海报变日程、盯着一个网页、讨论变待办、批量处理文件、等 Agent 干活、研究对比，各自从眼前的内容出发，给出结果。"
      note="界面示意 · 示例内容"
      className="ftm"
    >
      <ul className="ft-moment-grid">
        {moments.items.map((moment, index) => (
          <li
            key={moment.title}
            data-reveal
            style={{ '--i': index % 3, '--off': `${index * -1.6}s` } as Vars}
          >
            <div className="ftm-paper" aria-hidden="true">
              <Scene index={index} />
            </div>
            <h3>{moment.title}</h3>
            <p>{moment.text}</p>
          </li>
        ))}
      </ul>
    </Loop>
  );
}
