'use client';
import {
  Archive,
  Check,
  Circle,
  Code2,
  FileText,
  Folder,
  Inbox,
  Layers,
  LockKeyhole,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { DemoPlayer, DemoWindow, Output, Reveal, Source } from '../demo';
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
const sequences: Record<
  WorkMode,
  { title: string; steps: string[]; plugin: string }
> = {
  overview: {
    title: '产品发布 / 工作台',
    steps: ['资料进来', '助理整理', 'Agent 接着做', '留下交付版本'],
    plugin: 'Pages',
  },
  relay: {
    title: '产品发布 / Goals',
    steps: ['同一个目标', '留下进展', '换 Agent 继续', '核对交付版本'],
    plugin: 'Goals',
  },
  control: {
    title: '项目设置 / 能力与授权',
    steps: ['逐项授权', '先审查', '调用有记录', '撤权即生效'],
    plugin: '能力',
  },
  assistant: {
    title: '产品发布 / Pages',
    steps: ['选中当前段落', '引用反馈', '确认操作卡', '文稿与待办更新'],
    plugin: 'Pages',
  },
  feed: {
    title: '产品发布 / Feed',
    steps: ['来源汇入', '需要你介入', '整理成文稿', '保留出处'],
    plugin: 'Feed',
  },
  start: {
    title: 'Molis Work / 新建项目',
    steps: ['选择来源', '整理草稿', '采用建议', '随时找回'],
    plugin: '项目',
  },
  studio: {
    title: '项目 / 插件创作台',
    steps: ['描述需求', '查看方案', '制作与验证', '装进工作台'],
    plugin: '插件',
  },
  coding: {
    title: '产品发布 / Coding',
    steps: ['计划与任务', '暂停在这里', '从断点继续', '审查改动'],
    plugin: 'Coding',
  },
};

function Dock({ plugin }: { plugin: string }) {
  return (
    <div className="wd-dock" aria-label="工作台底栏示意">
      <span>
        <Folder size={14} />
        项目
      </span>
      {[
        ['Goals', Layers],
        ['Pages', FileText],
        ['Feed', Inbox],
        ['Coding', Code2],
      ].map(([name, Icon]) => {
        const Glyph = Icon as typeof Layers;
        return (
          <span key={String(name)} data-active={plugin === name}>
            <Glyph size={14} />
            {String(name)}
          </span>
        );
      })}
      <span className="wd-dock-assistant">
        <Sparkles size={14} />
        助理
      </span>
    </div>
  );
}

function WorkPaper({
  children,
  title = '产品发布说明',
  eyebrow = 'PAGES / 文稿',
  className = '',
}: {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <div className={`wd-paper ${className}`}>
      <small className="wd-eyebrow">{eyebrow}</small>
      <h4>{title}</h4>
      {children}
    </div>
  );
}

function Activity({
  step,
  overview = false,
}: {
  step: number;
  overview?: boolean;
}) {
  return (
    <div className="wd-activity">
      <small>
        <Sparkles size={13} />
        {step === 3 ? '成果库' : '工作接续'}
      </small>
      <div className="wd-activity-line">
        <span className="wd-avatar">C</span>
        <div>
          <strong>Claude Code</strong>
          <p>发布页已实现，手机排版待核对。</p>
        </div>
      </div>
      <Reveal show={step >= 2}>
        <div className="wd-activity-line">
          <span className="wd-avatar wd-avatar-dark">O</span>
          <div>
            <strong>Codex</strong>
            <p>从同一份目标继续检查。</p>
          </div>
        </div>
      </Reveal>
      <Reveal show={step >= 3}>
        <div className="wd-artifact">
          <Archive size={22} />
          <div>
            <strong>{overview ? '发布说明' : '发布验收记录'} · v3</strong>
            <small>已关联到目标 · 固定版本</small>
          </div>
          <Check size={15} />
        </div>
        <p className="wd-small-note">
          原文之后继续修改，这次交付的版本仍然可查。
        </p>
      </Reveal>
    </div>
  );
}

function Overview({ step }: { step: number }) {
  return (
    <div className="wd-overview">
      <WorkPaper>
        <div className="wd-doc-sources">
          <span>
            <FileText size={11} />
            需求笔记
          </span>
          <span>
            <MessageSquare size={11} />
            用户反馈
          </span>
        </div>
        <h5>这次，我们把开始变简单。</h5>
        <p>打开项目，就能看到当前目标、待办和需要你决定的事。</p>
        <div className="wd-generated" data-written={step >= 1}>
          <h5>更新亮点</h5>
          <p>资料与工具在同一处。助理理解当前内容，工作可以跨会话继续。</p>
          <ul>
            <li>
              <Check size={12} />
              保留每一次重要决定
            </li>
            <li>
              <Check size={12} />
              交付物对应固定版本
            </li>
          </ul>
        </div>
        <Source>整理自需求笔记与 3 条反馈</Source>
      </WorkPaper>
      <div className="wd-side">
        {step < 2 ? (
          <div className="wd-assistant">
            <small>
              <Sparkles size={14} />
              个人助理
            </small>
            <p className="wd-user-prompt">根据这些资料，补齐发布说明。</p>
            <Reveal show={step >= 1}>
              <Output label="文稿已整理">
                <p>已补上更新亮点，来源留在文稿里。</p>
                <span className="fd-stamp">
                  <Check size={12} />
                  Pages · 已更新
                </span>
              </Output>
            </Reveal>
          </div>
        ) : (
          <Activity step={step} overview />
        )}
      </div>
    </div>
  );
}

function Relay({ step }: { step: number }) {
  return (
    <div className="wd-overview">
      <WorkPaper title="完成产品发布页" eyebrow="GOALS / 目标">
        <span className="wd-goal-state">
          {step === 3 ? '完成要求已核对' : '进行中'}
        </span>
        <p>做成一个在电脑和手机上都能清楚介绍产品的页面。</p>
        <h5>完成要求</h5>
        <ul className="wd-requirements">
          {[
            '产品文案与当前版本一致',
            '电脑与手机均可阅读',
            '附上审查记录与交付物',
          ].map((s, i) => (
            <li key={s}>
              {step > i || step === 3 ? (
                <Check size={14} />
              ) : (
                <Circle size={13} />
              )}
              {s}
            </li>
          ))}
        </ul>
        <div className="wd-next">
          <small>下一步</small>
          <p>
            {step < 2
              ? '核对手机布局，并补上检查依据。'
              : step === 2
                ? 'Codex 读取目标、已有进展和待核对项。'
                : '用户确认交付版本，显式收尾。'}
          </p>
        </div>
      </WorkPaper>
      <div className="wd-side">
        <Activity step={step} />
      </div>
    </div>
  );
}

function Control({ step }: { step: number }) {
  return (
    <div className="wd-control">
      <div className="wd-permissions">
        <small className="wd-eyebrow">调用方 / Codex</small>
        <h4>它可以做哪些事，由你决定。</h4>
        {[
          ['读取项目资料', true],
          ['更新发布说明', step < 3],
          ['推送代码', false],
        ].map(([name, allowed]) => (
          <div className="wd-permission" key={String(name)}>
            <FileText size={15} />
            <span>{String(name)}</span>
            <small data-allowed={allowed}>
              {allowed ? '已授权' : '未授权'}
            </small>
          </div>
        ))}
        <p className="wd-small-note">
          每个 MCP 客户端单独授权，只能发现已获授权的能力。
        </p>
      </div>
      <div className="wd-review" key={step}>
        <Output
          label={['统一能力目录', '需要你审查', '调用记录', '授权已撤回'][step]}
        >
          {step === 0 ? (
            <>
              <ShieldCheck size={32} />
              <p>页面、助理、工作流和外部 Agent 共用同一套能力与授权。</p>
            </>
          ) : step === 1 ? (
            <>
              <p>修改发布说明.md</p>
              <div className="wd-diff">
                <span>+ 补充手机布局的验收要求</span>
                <span>+ 关联本次交付版本</span>
              </div>
              <span className="ft-demo-action">由你确认后执行</span>
            </>
          ) : step === 2 ? (
            <>
              <Check size={28} />
              <p>Pages 更新完成。</p>
              <Source>调用方 Codex · 结果与时间已记录</Source>
            </>
          ) : (
            <>
              <LockKeyhole size={27} />
              <p>Codex 已无法继续调用“更新发布说明”。</p>
              <Source>已取消或撤权的调用不再写入</Source>
            </>
          )}
        </Output>
      </div>
    </div>
  );
}

function Assistant({ step }: { step: number }) {
  return (
    <div className="wd-overview">
      <WorkPaper title="本周产品进展" eyebrow="PAGES / 当前页面">
        <h5>发布准备</h5>
        <p>
          <mark>本周整理了三条用户反馈，需要补进发布计划。</mark>
        </p>
        <div className="wd-generated" data-written={step === 3}>
          <h5>来自用户的反馈</h5>
          <p>先明确产品用途，再让演示展现操作和结果。手机上也需要完整阅读。</p>
          <Source>Inbox · 3 条已引用的反馈</Source>
        </div>
      </WorkPaper>
      <div className="wd-side wd-assistant">
        <small>
          <Sparkles size={14} />
          知道你正在看什么
        </small>
        <p className="wd-user-prompt">把 @反馈 整理进这一段，再建两个待办。</p>
        <Reveal show={step >= 1}>
          <div className="wd-reference">已引用当前选区 + 3 条反馈</div>
        </Reveal>
        <Reveal show={step >= 2}>
          <Output label={step === 3 ? '已采用这些操作' : '建议执行的操作'}>
            <ul className="wd-requirements">
              <li>
                <Check size={13} />
                更新当前文稿
              </li>
              <li>
                <Check size={13} />
                补充产品介绍
              </li>
              <li>
                <Check size={13} />
                核对手机排版
              </li>
            </ul>
            <span className="fd-stamp">
              {step === 3 ? '已更新 · 可撤销' : '由你点击后执行'}
            </span>
          </Output>
        </Reveal>
      </div>
    </div>
  );
}

function Feed({ step }: { step: number }) {
  return (
    <div className="wd-feed">
      <div className="wd-feed-list">
        <small className="wd-eyebrow">所有来源 / FEED</small>
        {[
          ['RSS', '一份新的行业研究'],
          ['GitHub', '项目发布了新版本'],
          ['Gmail', '需要回复的一条反馈'],
        ].map(([source, title], i) => (
          <div key={source} data-active={i === 2}>
            <span>{source}</span>
            <strong>{title}</strong>
            <small>
              {i === 2 && step > 0 ? '需要你 · 已进入 Inbox' : '已收取'}
            </small>
          </div>
        ))}
      </div>
      <div className="wd-feed-result">
        <Output
          label={step < 2 ? 'Inbox · 需要你介入' : 'Pages · 带来源的文稿'}
        >
          {step < 2 ? (
            <>
              <h5>为什么来到这里？</h5>
              <p>
                {step === 0
                  ? '重要信息和其他资料一起进入 Feed。'
                  : '这条反馈需要确认发布时间，下一步是核对安排并回复。'}
              </p>
            </>
          ) : (
            <>
              <h5>产品反馈摘要</h5>
              <p>
                用户希望了解发布时间与新版能力的范围，建议在介绍中写明当前阶段。
              </p>
              <Source>反馈邮件 · 原始来源保留</Source>
            </>
          )}
        </Output>
        <Reveal show={step === 3}>
          <div className="wd-reference">
            <Check size={14} />
            写文稿时，仍然找得到原始资料。
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Arrival({ step }: { step: number }) {
  return (
    <div className="wd-arrival">
      <div>
        <small className="wd-eyebrow">开始一份新的工作</small>
        <h4>
          {step === 3 ? '想起一个词，就能找回来。' : '先带入你手边的资料。'}
        </h4>
        {step === 3 ? (
          <div className="wd-search">
            <Search size={18} />
            <strong>Q4</strong>
            <kbd>⌘ K</kbd>
          </div>
        ) : (
          <div className="wd-source-list">
            {['项目资料', '已授权的邮件来源', '关注的 GitHub 仓库'].map((t) => (
              <span key={t}>
                <Check size={13} />
                {t}
              </span>
            ))}
          </div>
        )}
        <p className="wd-small-note">先选来源并授权，建议由你决定是否采用。</p>
      </div>
      <Reveal show={step >= 1}>
        <Output
          label={
            step === 3
              ? '搜索结果 · 项目与个人空间'
              : step === 2
                ? '已采用 · 从待办开始'
                : '为你整理的项目草稿'
          }
        >
          <h5>Q4 产品发布</h5>
          <ul className="wd-requirements">
            <li>
              <Check size={13} />
              整理发布说明
            </li>
            <li>
              <Check size={13} />
              核对新版可用范围
            </li>
          </ul>
          <Source>工作总结与待办均保留来源</Source>
        </Output>
      </Reveal>
    </div>
  );
}

function Studio({ step }: { step: number }) {
  return (
    <div className="wd-studio">
      <div className="wd-studio-prompt">
        <small className="wd-eyebrow">插件创作台 / 预览</small>
        <h4>“做一个账单到期提醒。”</h4>
        <p>记录金额与日期，到期时提醒我。</p>
        <div className="wd-build-steps">
          {['确认方案', '沙箱制作', '检查与浏览器验收', '确认安装'].map(
            (t, i) => (
              <span key={t} data-done={i <= step}>
                {i < step ? <Check size={12} /> : <Circle size={12} />}
                {t}
              </span>
            ),
          )}
        </div>
      </div>
      <Reveal show={step >= 1}>
        <Output
          label={
            step === 3
              ? '已装入项目 · 新能力可用'
              : step === 2
                ? '正在验证'
                : '先看方案'
          }
        >
          <div className="wd-made-plugin">
            <CalendarIcon />
            <h5>账单提醒</h5>
            <p>日期、金额、提醒时间</p>
          </div>
          <Source>
            {step === 3
              ? '助理与外部 Agent 可在授权后调用'
              : '验证通过、用户确认后才安装'}
          </Source>
        </Output>
      </Reveal>
    </div>
  );
}

function CalendarIcon() {
  return (
    <div className="wd-calendar-icon">
      <small>OCT</small>
      <strong>15</strong>
    </div>
  );
}

function Coding({ step }: { step: number }) {
  return (
    <div className="wd-coding">
      <div className="wd-code-head">
        <Terminal size={16} />
        <strong>修好手机导航</strong>
        <span>{['计划中', '已暂停', '继续执行', '等待审查'][step]}</span>
      </div>
      <div className="wd-code-body">
        <div>
          <small className="wd-eyebrow">同一条任务记录</small>
          <ul className="wd-requirements">
            <li>
              <Check size={13} />
              找到导航换行的原因
            </li>
            <li>
              {step >= 2 ? <Check size={13} /> : <Circle size={13} />}
              调整窄屏布局
            </li>
            <li>
              <Circle size={13} />
              审查改动后提交
            </li>
          </ul>
          <p className="wd-small-note">计划、任务与中断位置都留下来。</p>
        </div>
        <div className="wd-terminal">
          <span>navigation.css</span>
          <pre>
            {step < 2
              ? '任务已保存\n下一步：调整窄屏布局\n\n可以从这里继续。'
              : '@media (max-width: 640px) {\n  .navigation {\n    flex-wrap: wrap;\n    gap: 12px;\n  }\n}'}
          </pre>
          {step === 3 && (
            <span className="wd-code-review">
              修改文件、命令与推送先经你审查
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const scenes = {
  overview: Overview,
  relay: Relay,
  control: Control,
  assistant: Assistant,
  feed: Feed,
  start: Arrival,
  studio: Studio,
  coding: Coding,
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
      className={`wd-demo ${compact ? 'wd-compact' : ''}`}
      note={
        mode === 'relay'
          ? '界面示意 · 新界面与交付版本未发布'
          : '新版界面示意 · 未发布 · 示例数据'
      }
    >
      {(step) => (
        <DemoWindow
          title={scene.title}
          badge={mode === 'studio' ? '预览' : 'Molis Work'}
        >
          <div className="wd-surface">
            <Scene step={step} />
            <Dock plugin={scene.plugin} />
          </div>
        </DemoWindow>
      )}
    </DemoPlayer>
  );
}
