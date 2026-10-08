'use client';
import { useRef, useState } from 'react';
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  FileText,
  Folder,
  Languages,
  MousePointer2,
  Sparkles,
} from 'lucide-react';
import { layers, moments, plugins } from '../../../../../content/molis-tool';
import { DemoPlayer, Reveal, useDemoClock } from '../demo';
import { pad } from '../kit';
import type { Vars } from '../shared';
import './demos.css';

function DateCard({ step }: { step: number }) {
  return (
    <div className="ft-date-card">
      <span className="ft-mini-eyebrow">从海报里，读到一场展</span>
      <div className="ft-date-heading">
        <span>
          12<small>OCT</small>
        </span>
        <h4>
          城市
          <br />
          设计展
        </h4>
      </div>
      <div className="ft-writing" data-written={step >= 1}>
        <p>周六 · 14:00 — 17:00</p>
        <p>河岸艺术中心</p>
      </div>
      <Reveal show={step >= 2}>
        <span className="ft-result-tag">
          <CalendarDays size={15} />
          日程已整理，等你确认
        </span>
      </Reveal>
    </div>
  );
}

function LayerScene({ layer, step }: { layer: number; step: number }) {
  if (layer === 0)
    return (
      <div className="ft-near-sample">
        <span className="ft-mini-eyebrow">正在读一篇文章</span>
        <h4 lang="en">
          A little less
          <br />
          switching.
        </h4>
        <p lang="en">
          <mark data-written={step > 0}>Keep your attention here.</mark>
        </p>
        <MousePointer2
          className="ft-sample-cursor"
          size={25}
          fill="currentColor"
        />
        <Reveal show={step > 0}>
          <div className="ft-sample-chips">
            <span>
              <Languages size={14} />
              翻译
            </span>
            <span>
              <Sparkles size={14} />
              解释
            </span>
          </div>
        </Reveal>
        <Reveal show={step > 1}>
          <p className="ft-small-result">把注意力，留在这里。</p>
        </Reveal>
      </div>
    );
  if (layer === 1) return <DateCard step={step} />;
  return (
    <div className="ft-resume-sample">
      <span className="ft-mini-eyebrow">Molis Tool / 接续</span>
      <h4>
        还在这里，
        <br />
        随时继续。
      </h4>
      <div className="ft-saved-item">
        <CalendarDays size={28} />
        <div>
          <strong>城市设计展</strong>
          <span>刚才整理的日程草稿</span>
        </div>
      </div>
      <Reveal show={step > 0}>
        <div className="ft-writing" data-written={step > 1}>
          <p>周六 14:00 · 河岸艺术中心</p>
          <span className="ft-result-tag">
            <Check size={15} />
            带着原来的内容回来
          </span>
        </div>
      </Reveal>
    </div>
  );
}

export function LayerStory() {
  return (
    <ol className="ft-layers">
      {layers.items.map((layer, index) => (
        <li key={layer.title} data-reveal style={{ '--i': index } as Vars}>
          <DemoPlayer
            label={layer.title}
            steps={['内容在这里', '动作在身旁', '结果留下来']}
            note=""
            className="ft-miniature"
            duration={3000 + index * 250}
          >
            {(step) => <LayerScene layer={index} step={step} />}
          </DemoPlayer>
          <span className="fo-index">{pad(index)}</span>
          <h3>{layer.title}</h3>
          <p>{layer.text}</p>
        </li>
      ))}
    </ol>
  );
}

function MomentScene({ kind, step }: { kind: number; step: number }) {
  if (kind === 0) return <DateCard step={step} />;
  if (kind === 1)
    return (
      <div className="ft-watch-sample">
        <span className="ft-mini-eyebrow">周末工作坊 / 剩余名额</span>
        <div className="ft-ticket-number" key={step === 2 ? 'open' : 'waiting'}>
          {step === 2 ? '3' : '0'}
          <span>位</span>
        </div>
        <p>有名额时，再告诉我。</p>
        <Reveal show={step > 0}>
          <span className="ft-result-tag">
            <Bell size={15} />
            {step === 2 ? '0 → 3 · 有新名额了' : '只关注这一块区域'}
          </span>
        </Reveal>
      </div>
    );
  if (kind === 2)
    return (
      <div className="ft-chat-sample">
        <span className="ft-mini-eyebrow">从一段讨论，到下一步</span>
        <blockquote>
          “发布页周五前改好，
          <br />
          我来补文案。”<small>小周 · 项目讨论</small>
        </blockquote>
        <Reveal show={step > 0}>
          <div className="ft-handwritten">
            <Check size={18} />
            <div>
              补齐发布页文案<span>小周 · 周五前</span>
            </div>
          </div>
        </Reveal>
        <Reveal show={step > 1}>
          <p className="ft-sample-source">待办带着原话回来 ↗</p>
        </Reveal>
      </div>
    );
  if (kind === 3)
    return (
      <div className="ft-files-sample">
        <span className="ft-mini-eyebrow">把文件放到这里</span>
        <div className="ft-file-icons">
          <FileText size={42} strokeWidth={1.2} />
          <Folder size={48} strokeWidth={1.2} />
        </div>
        <div className="ft-file-name" data-written={step > 0}>
          {step > 0 ? '2026-10-研究笔记.pdf' : '未命名副本 (3).pdf'}
        </div>
        <Reveal show={step > 0}>
          <p>先看看，改完是什么样。</p>
        </Reveal>
        <Reveal show={step > 1}>
          <span className="ft-result-tag">
            <Check size={15} />
            处理完成 · 原件保留
          </span>
        </Reveal>
      </div>
    );
  if (kind === 4)
    return (
      <div className="ft-agent-sample">
        <span className="ft-mini-eyebrow">Agent 在做事，你继续自己的事</span>
        <h4>
          把注意力，
          <br />
          留给眼前。
        </h4>
        <div className="ft-pencil-lines" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <Reveal show={step === 2}>
          <div className="ft-agent-message">
            <Sparkles size={19} />
            <div>
              Claude Code<span>需要你确认这一步</span>
            </div>
          </div>
        </Reveal>
      </div>
    );
  return (
    <div className="ft-research-sample">
      <span className="ft-mini-eyebrow">两份材料，放在一起看</span>
      <h4>比较，也有依据。</h4>
      <div className="ft-compare-mini">
        <span>维度</span>
        <span>方案 A</span>
        <span>方案 B</span>
        <span>部署</span>
        <strong>本机</strong>
        <strong>托管</strong>
        <span>适合</span>
        <strong>个人</strong>
        <strong>协作</strong>
      </div>
      <Reveal show={step > 0}>
        <p className="ft-sample-source">研究笔记.pdf · 第 4 页 ↗</p>
      </Reveal>
      <Reveal show={step > 1}>
        <span className="ft-result-tag">
          <Check size={15} />
          每个结论，找得到出处
        </span>
      </Reveal>
    </div>
  );
}

export function ToolMoments() {
  return (
    <ul className="ft-moment-grid">
      {moments.items.map((moment, index) => (
        <li key={moment.title} data-reveal style={{ '--i': index % 3 } as Vars}>
          <DemoPlayer
            label={moment.title}
            steps={['眼前的内容', '正在整理', '结果回到这里']}
            note=""
            className="ft-miniature ft-moment-miniature"
            tone="pink"
            duration={3300 + index * 120}
          >
            {(step) => <MomentScene kind={index} step={step} />}
          </DemoPlayer>
          <h3>{moment.title}</h3>
          <p>{moment.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function PluginDemo() {
  const [enabled, setEnabled] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const clock = useDemoClock(4, 3500, ref);
  return (
    <div className="ft-plugin-live" ref={ref} data-enabled={enabled}>
      <div className="ft-plugin-setting">
        <span className="ft-plugin-icon">
          <Sparkles size={26} />
        </span>
        <div>
          <strong>文字工具</strong>
          <small>一份插件，同一种能力</small>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="在演示中启用文字工具"
          onClick={() => setEnabled((value) => !value)}
        >
          <span />
        </button>
      </div>
      <fieldset className="ft-plugin-ports" aria-label="切换能力入口">
        {plugins.surfaces.map((surface, index) => (
          <button
            key={surface}
            type="button"
            aria-pressed={clock.step === index}
            onClick={() => clock.select(index)}
          >
            {surface}
            <i aria-hidden="true" />
          </button>
        ))}
      </fieldset>
      <div className="ft-plugin-paper" key={clock.step}>
        <span className="ft-mini-eyebrow">
          {
            ['选中的文字', '选区右键', '拖入的文字', '命令条里的选区'][
              clock.step
            ]
          }
        </span>
        <p className="ft-plugin-original">
          把好奇心，　　做成作品。
          <br />
          从一个　具体问题开始。
        </p>
        <div className="ft-plugin-ability" data-enabled={enabled}>
          <Sparkles size={17} />
          <strong>清理文字</strong>
          <span>本机处理</span>
        </div>
        <div className="ft-plugin-result">
          <span>
            {enabled
              ? '同一项能力，给出同一个结果'
              : '停用后，上次的结果仍然保留'}
          </span>
          <p>
            把好奇心，做成作品。
            <br />
            从一个具体问题开始。
          </p>
          <small>
            原文保留 <ArrowUpRight size={13} />
          </small>
        </div>
      </div>
      <p className="ft-plugin-explain" aria-live="polite">
        {enabled
          ? '换一个入口，能力不必重做。'
          : '各入口已撤下这项能力，已有结果不会消失。'}
      </p>
    </div>
  );
}
