'use client';
import {
  Check,
  FileText,
  Folder,
  GitBranch,
  LockKeyhole,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DemoPlayer, Reveal } from '../demo';
import { Cuts } from '../art';
import './demos.css';

export type WorkMode =
  | 'overview'
  | 'relay'
  | 'control'
  | 'assistant'
  | 'feed'
  | 'start'
  | 'studio'
  | 'coding';
const sequences: Record<WorkMode, { title: string; steps: string[] }> = {
  overview: {
    title: '一份目标，在不同 Agent 之间继续',
    steps: ['写下目标', 'Claude Code 推进', 'Codex 接续', '核对交付'],
  },
  relay: {
    title: '换一个 Agent，仍然是同一份目标',
    steps: ['写下目标', '留下进展', '继续下一步', '留下固定版本'],
  },
  control: {
    title: '同一份能力与授权',
    steps: ['选择能力', '先审查', '调用留记录', '随时可撤权'],
  },
  assistant: {
    title: '助理就在当前内容旁边',
    steps: ['选中段落', '引用反馈', '等待你确认', '更新文稿'],
  },
  feed: {
    title: '资料进来，出处留下',
    steps: ['收到资料', '看清来源', '选出重点', '整理成文稿'],
  },
  start: {
    title: '带着已有的资料开始',
    steps: ['选择来源', '整理草稿', '采用建议', '回到项目'],
  },
  studio: {
    title: '做一个自己的插件',
    steps: ['说出需要', '确认方案', '制作与检查', '确认后安装'],
  },
  coding: {
    title: '代码会话，从断点继续',
    steps: ['写下计划', '暂停任务', '继续执行', '审查改动'],
  },
};

function GoalScene({ step }: { step: number }) {
  return (
    <div className="wd-goal-scene">
      <div className="wd-paper">
        <span className="wd-eyebrow">GOALS / 产品发布</span>
        <h4>完成产品发布页。</h4>
        <p className="wd-lead">
          目标只有一份，
          <br />
          做到哪一步，也留在这里。
        </p>
        <div className="wd-checks">
          {['清楚介绍产品', '核对手机排版', '附上交付版本'].map(
            (text, index) => (
              <div key={text} data-done={step > index}>
                <span>
                  <Check size={14} />
                </span>
                {text}
              </div>
            ),
          )}
        </div>
        <div className="wd-agents">
          <span data-active={step === 1}>
            <i>C</i>Claude Code
          </span>
          <b aria-hidden="true">→</b>
          <span data-active={step >= 2}>
            <i>O</i>Codex
          </span>
        </div>
      </div>
      <div className="wd-sticky wd-progress-note" key={step}>
        <span>
          {
            [
              '先写清楚',
              'Claude Code 留下进展',
              'Codex 从这里继续',
              '成果已核对',
            ][step]
          }
        </span>
        <strong>
          {
            [
              '做什么，怎样才算完成。',
              '页面已实现，手机排版待检查。',
              '沿用目标和已有资料，核对下一步。',
              '发布页 · v3',
            ][step]
          }
        </strong>
        {step === 3 && <Check size={24} />}
      </div>
    </div>
  );
}

function ControlScene({ step }: { step: number }) {
  return (
    <div className="wd-control-scene">
      <div className="wd-paper">
        <span className="wd-eyebrow">能力与授权</span>
        <h4>
          每一步，
          <br />
          都在你的授权内。
        </h4>
        <div className="wd-permissions">
          {['读取当前文稿', '修改项目内容', '运行外部操作'].map(
            (text, index) => (
              <div key={text}>
                <span>{text}</span>
                <strong data-allowed={index === 0 && step !== 3}>
                  {index === 0
                    ? step === 3
                      ? '已撤回'
                      : '已授权'
                    : index === 1
                      ? '先审查'
                      : '未授权'}
                </strong>
              </div>
            ),
          )}
        </div>
        <div className="wd-paper-footer">
          <LockKeyhole size={16} />
          页面、助理、Agent 共用同一套规则
        </div>
      </div>
      <div className="wd-sticky wd-permission-note" key={step}>
        <ShieldCheck size={24} />
        <strong>
          {
            [
              '只开放需要的能力',
              '修改前，先看操作卡',
              '调用过程有记录',
              '撤回后，立即生效',
            ][step]
          }
        </strong>
        <span>
          {
            [
              '授权范围由你决定',
              '由你确认，再执行',
              '谁调用了什么，可以回查',
              '已有内容仍然保留',
            ][step]
          }
        </span>
      </div>
    </div>
  );
}

function AssistantScene({ step }: { step: number }) {
  return (
    <div className="wd-assistant-scene">
      <div className="wd-paper">
        <span className="wd-eyebrow">PAGES / 发布说明</span>
        <h4>
          这次，让开始
          <br />
          变简单一点。
        </h4>
        <p className="wd-selected" data-selected={step > 0}>
          打开项目，就能看见当前目标、资料和待办。
        </p>
        <div className="wd-document-lines" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <Reveal show={step >= 3}>
          <p className="wd-written">
            <Check size={16} />
            文稿已更新 · 可以撤销
          </p>
        </Reveal>
      </div>
      <div className="wd-sticky wd-assistant-note" key={step}>
        <span>
          <Sparkles size={15} />
          就在这段内容旁边
        </span>
        <strong>
          {
            [
              '把这段写得更清楚。',
              '结合你引用的 3 条反馈。',
              '替换这段文案，由你确认。',
              '修改已留在当前文稿。',
            ][step]
          }
        </strong>
        <small>{step >= 3 ? 'Pages · 保留出处' : '@用户反馈 / 当前选区'}</small>
      </div>
    </div>
  );
}

function FeedScene({ step }: { step: number }) {
  return (
    <div className="wd-paper wd-feed-paper">
      <span className="wd-eyebrow">FEED / 今天收到的资料</span>
      <h4>
        有用的信息，
        <br />
        带着来处。
      </h4>
      <div className="wd-feed-rows">
        {[
          ['网页', '一篇产品研究'],
          ['GitHub', '项目版本更新'],
          ['邮件', '3 条用户反馈'],
        ].map(([source, text], index) => (
          <div key={source} data-arrived={step >= index}>
            <span>{source}</span>
            <strong>{text}</strong>
            <Check size={16} />
          </div>
        ))}
      </div>
      <Reveal show={step >= 3}>
        <div className="wd-inline-result">
          <FileText size={22} />
          <div>
            产品研究摘要<small>Pages · 3 份引用资料</small>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function ArrivalScene({ step }: { step: number }) {
  return (
    <div className="wd-paper wd-arrival-paper">
      <span className="wd-eyebrow">从已有的资料开始</span>
      <h4>
        第一天，
        <br />
        就有内容。
      </h4>
      <div className="wd-source-tags">
        <span>项目笔记</span>
        <span>邮件</span>
        <span>GitHub</span>
      </div>
      <div className="wd-arrival-project" data-arrived={step > 0}>
        <Folder size={32} />
        <strong>秋季产品发布</strong>
        <p>
          {step >= 2 ? '已采用建议 · 从待办开始' : '项目与待办草稿 · 等你采用'}
        </p>
      </div>
      <Reveal show={step >= 3}>
        <div className="wd-search-note">
          <Search size={16} />
          <span>秋季发布</span>
          <kbd>⌘ K</kbd>
        </div>
      </Reveal>
    </div>
  );
}

function StudioScene({ step }: { step: number }) {
  return (
    <div className="wd-studio-scene">
      <div className="wd-paper">
        <span className="wd-eyebrow">插件创作台 / 预览</span>
        <h4>
          “做一个
          <br />
          账单提醒。”
        </h4>
        <p className="wd-lead">
          金额、日期，
          <br />
          和一个合适的提醒。
        </p>
        <div className="wd-build-list">
          {['看方案', '制作与检查', '确认后装进项目'].map((text, index) => (
            <div key={text} data-done={step > index}>
              <Check size={15} />
              {text}
            </div>
          ))}
        </div>
      </div>
      <div className="wd-sticky wd-made-tool" data-arrived={step > 0}>
        <span>账单提醒</span>
        <strong>
          15<small>OCT</small>
        </strong>
        <p>{step === 3 ? '已安装 · 助理也能调用' : '制作预览 · 待你确认'}</p>
      </div>
    </div>
  );
}

function CodingScene({ step }: { step: number }) {
  return (
    <div className="wd-paper wd-coding-paper">
      <span className="wd-eyebrow">CODING / 同一条任务记录</span>
      <h4>
        停在这里，
        <br />
        也从这里继续。
      </h4>
      <div className="wd-code-task">
        <GitBranch size={19} />
        <strong>修好手机导航</strong>
        <span>{['计划中', '已暂停', '继续执行', '待审查'][step]}</span>
      </div>
      <pre>
        {step < 2
          ? '找到导航换行的原因\n下一步：调整窄屏布局\n\n计划和进展已保存。'
          : '@media (max-width: 640px) {\n  .navigation {\n    flex-wrap: wrap;\n  }\n}'}
      </pre>
      <div className="wd-paper-footer">
        <MessageSquare size={16} />
        {step === 3
          ? '写文件、运行命令和提交，先经你审查'
          : '计划、任务、中断位置都留下来'}
      </div>
    </div>
  );
}

const scenes = {
  overview: GoalScene,
  relay: GoalScene,
  control: ControlScene,
  assistant: AssistantScene,
  feed: FeedScene,
  start: ArrivalScene,
  studio: StudioScene,
  coding: CodingScene,
};
export function WorkDemo({
  mode = 'overview',
  compact = false,
}: {
  mode?: WorkMode;
  compact?: boolean;
}) {
  const scene = sequences[mode];
  const Scene = scenes[mode];
  return (
    <DemoPlayer
      label={`Molis Work：${scene.title}`}
      steps={scene.steps}
      tone="red"
      className={`wd-demo wd-${mode} ${compact ? 'wd-compact' : ''}`}
      note="新版能力示意 · 开发中"
      duration={3000}
    >
      {(step) => (
        <div className="wd-collage">
          <Cuts />
          <Scene step={step} />
        </div>
      )}
    </DemoPlayer>
  );
}
