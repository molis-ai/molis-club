import type { ComponentType } from 'react';
import {
  ArrowUp,
  AtSign,
  Blocks,
  Check,
  FileText,
  ListChecks,
  Search,
  ShieldCheck,
  Slash,
  Terminal,
  Undo2,
} from 'lucide-react';
import type { Vars } from '../shared';
import { images } from './content';

// 场景画面：目标、Feed、首次使用用真实界面截图，其余都是代码绘制的示意。

export function Window({
  src,
  label,
  priority = false,
}: {
  src: string;
  label: string;
  priority?: boolean;
}) {
  return (
    <div className="ew-window">
      <div className="ew-window-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{label}</span>
      </div>
      <img
        src={src}
        width="1440"
        height="1000"
        alt=""
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />
    </div>
  );
}

function GoalsVisual() {
  return <Window src={images.goals} label="Goals" />;
}

function FeedVisual() {
  return <Window src={images.feed} label="Feed" />;
}

function StartVisual() {
  return <Window src={images.onboarding} label="Molis Work" />;
}

function CapabilitiesVisual() {
  const rows = [
    ['查询', true],
    ['判断', true],
    ['写入', false],
  ] as const;
  return (
    <div className="ew-mock ew-cap" aria-hidden="true">
      <div className="ew-cap-callers">
        {['页面', '助理', '工作流', '外部 Agent'].map((name, index) => (
          <span className="ew-in" key={name} style={{ '--r': index } as Vars}>
            {name}
          </span>
        ))}
      </div>
      <div className="ew-card ew-in" style={{ '--r': 4 } as Vars}>
        <div className="ew-card-head">
          <Blocks size={14} />
          能力目录
        </div>
        {rows.map(([label, on], index) => (
          <div
            className="ew-cap-row ew-in"
            key={label}
            style={{ '--r': 5 + index } as Vars}
          >
            <span>{label}</span>
            <small>{on ? '已授予' : '已撤回'}</small>
            <b className={on ? 'is-on' : ''}>
              <i />
            </b>
          </div>
        ))}
      </div>
      <div className="ew-card ew-cap-queue ew-in" style={{ '--r': 8 } as Vars}>
        <div className="ew-card-head">
          <ShieldCheck size={14} />
          审查队列
        </div>
        <div className="ew-cap-task ew-in" style={{ '--r': 9 } as Vars}>
          <Terminal size={13} />
          <span>git push</span>
          <em>待你确认</em>
        </div>
        <div className="ew-cap-task ew-in" style={{ '--r': 10 } as Vars}>
          <ListChecks size={13} />
          <span>已建 2 个待办</span>
          <em className="is-undo">
            <Undo2 size={11} />
            撤销
          </em>
        </div>
      </div>
    </div>
  );
}

function AssistantVisual() {
  return (
    <div className="ew-mock ew-assist" aria-hidden="true">
      <div className="ew-card ew-assist-page ew-in">
        <div className="ew-card-head">
          <FileText size={14} />
          访谈计划
          <small>Pages</small>
        </div>
        <div className="ew-assist-body">
          <i />
          <i />
          <p>
            <mark>周五前发出访谈提纲，下周二约一次评审。</mark>
          </p>
          <i />
          <i />
        </div>
      </div>
      <div
        className="ew-card ew-assist-action ew-in"
        style={{ '--r': 6 } as Vars}
      >
        <strong>建两个待办</strong>
        <ul>
          <li>
            <b />
            发出访谈提纲
            <small>周五</small>
          </li>
          <li>
            <b />
            约访谈评审
            <small>下周二</small>
          </li>
        </ul>
        <div className="ew-assist-buttons">
          <span className="is-primary">
            <Check size={11} />
            执行
          </span>
          <span>
            <Undo2 size={11} />
            撤销
          </span>
        </div>
      </div>
      <div className="ew-card ew-assist-bar ew-in" style={{ '--r': 3 } as Vars}>
        <span className="ew-assist-chip">
          <AtSign size={11} />
          选中段落
        </span>
        <span className="ew-assist-chip">
          <Slash size={11} />
          建待办
        </span>
        <span className="ew-typing">拆成待办</span>
        <b>
          <ArrowUp size={12} />
        </b>
      </div>
    </div>
  );
}

function StudioVisual() {
  const steps = ['描述', '方案', '沙箱', '检查', '安装'];
  return (
    <div className="ew-mock ew-studio" aria-hidden="true">
      <div className="ew-card ew-studio-prompt ew-in">
        <Search size={14} />
        <span className="ew-typing">做一个整理访谈记录的插件</span>
      </div>
      <ol>
        {steps.map((step, index) => (
          <li
            className="ew-in"
            key={step}
            style={{ '--r': 2 + index * 1.4 } as Vars}
          >
            <b>
              <Check size={11} />
            </b>
            {step}
          </li>
        ))}
      </ol>
      <div
        className="ew-card ew-studio-plugin ew-in"
        style={{ '--r': 10 } as Vars}
      >
        <span>
          <Blocks size={17} />
        </span>
        <i />
        <i />
      </div>
    </div>
  );
}

function CodingVisual() {
  const columns = [
    ['计划', 3],
    ['进行中', 2],
    ['待审查', 1],
  ] as const;
  return (
    <div className="ew-mock ew-board" aria-hidden="true">
      {columns.map(([name, count], c) => (
        <div className="ew-board-col" key={name}>
          <small>{name}</small>
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className={`ew-card ew-in${c === 1 ? ' is-live' : ''}${c === 2 ? ' is-review' : ''}`}
              style={{ '--r': c * 2 + i } as Vars}
            >
              <i />
              <i />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** 按场景 id 取画面；shot 为 true 的是产品截图，其余是示意。 */
export const sceneVisuals: Record<
  string,
  { Visual: ComponentType; shot: boolean }
> = {
  relay: { Visual: GoalsVisual, shot: true },
  control: { Visual: CapabilitiesVisual, shot: false },
  assistant: { Visual: AssistantVisual, shot: false },
  feed: { Visual: FeedVisual, shot: true },
  start: { Visual: StartVisual, shot: true },
  studio: { Visual: StudioVisual, shot: false },
  coding: { Visual: CodingVisual, shot: false },
};
