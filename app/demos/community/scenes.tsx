'use client';
import { useState } from 'react';
import { ArrowDown, ArrowRight, Check, FileText } from 'lucide-react';
import { Loop } from '../brand/folio/loop';

/** 状态示意由访客切换；不连接真实 Agent 会话。 */
export function CowScene() {
  const [waiting, setWaiting] = useState(true);
  return (
    <div className="fcm-work-art fcm-cow-art" data-waiting={waiting}>
      <span className="fcm-scene-circle" aria-hidden="true" />
      <div className="fcm-art-top">
        <span>niul.ai 在你的桌面上</span>
        <span>状态示意</span>
      </div>
      <div className="fcm-desktop-window">
        <div className="fcm-window-bar">
          <i />
          <i />
          <i />
          <span>正在进行的工作</span>
        </div>
        <div className="fcm-session">
          <span className="fcm-session-dot" />
          <div>
            <strong>整理调研资料</strong>
            <p>{waiting ? '正在核对来源…' : '已完成，等你检查结果'}</p>
          </div>
          {!waiting && <Check size={18} aria-hidden="true" />}
        </div>
        <div className="fcm-session">
          <span className="fcm-session-dot" />
          <div>
            <strong>准备下周的简报</strong>
            <p>正在整理初稿…</p>
          </div>
        </div>
      </div>
      <div className="fcm-cow-scene">
        <p className="fcm-cow-speech" key={String(waiting)}>
          {waiting ? '我帮你看着呢。' : '干完啦，到你了。'}
        </p>
        <img
          src="/images/products/niulai.png"
          width="192"
          height="192"
          alt="niul.ai 黄色桌面小牛"
          loading="lazy"
        />
        <span className="fcm-cow-ground" />
      </div>
      <button
        type="button"
        className="fcm-demo-switch"
        aria-pressed={!waiting}
        onClick={() => setWaiting((value) => !value)}
      >
        <span className="fcm-state-dot" />
        {waiting ? '看看 Agent 完成时' : '再看看工作中'}
        <ArrowRight size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

/** 原文件 → 副本处理 → 新结果，沿用 Folio 产品页的可暂停演示外壳。 */
export function DropScene() {
  return (
    <Loop
      label="DropAgent：把访谈记录交给本地 Agent，在副本上整理，再带回要点"
      note="流程示意 · 示例材料"
      className="fcm-work-art fcm-drop-art"
    >
      <span className="fcm-scene-circle" aria-hidden="true" />
      <div className="fcm-art-top">
        <span>DropAgent</span>
        <span>原文件保留</span>
      </div>
      <div className="fcm-source-file">
        <FileText size={30} aria-hidden="true" />
        <strong>访谈记录.md</strong>
        <span>原始材料</span>
        <i />
        <i />
        <i />
      </div>
      <div className="fcm-agent-dock">
        <ArrowDown size={26} aria-hidden="true" />
        <strong>整理成三条要点</strong>
        <span>交给本地 Agent，在副本上工作</span>
        <div className="fcm-agent-progress">
          <i />
        </div>
      </div>
      <div className="fcm-result-sheet">
        <div>
          <Check size={18} aria-hidden="true" />
          <strong>访谈要点.md</strong>
        </div>
        <p>想解决什么问题</p>
        <p>哪些地方最费力</p>
        <p>下一步需要确认什么</p>
      </div>
    </Loop>
  );
}
