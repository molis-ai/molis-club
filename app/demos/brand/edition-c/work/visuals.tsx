import type { ComponentType } from 'react';
import { ArrowDown, Blocks, Bot, Check, Lock, Search } from 'lucide-react';
import type { FeatureVisual } from './content';
import type { Vars } from '../shared';

// 功能区块的画面：目标用真实界面截图，其余都是代码绘制的示意。

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
  return <Window src="/images/daylight/work/goals.jpg" label="Goals" />;
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

function RuntimeVisual() {
  return (
    <div className="ew-mock ew-runtime" aria-hidden="true">
      <div className="ew-runtime-col">
        {['文字', '图片', '判断', 'Agent'].map((name, index) => (
          <span className="ew-in" key={name} style={{ '--r': index } as Vars}>
            {name}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 100 200" preserveAspectRatio="none">
        {[25, 75, 125, 175].map((y, index) => (
          <path
            key={y}
            d={`M0 ${y} C 55 ${y}, 45 100, 100 100`}
            style={{ '--r': index } as Vars}
          />
        ))}
      </svg>
      <div className="ew-runtime-core ew-in" style={{ '--r': 4 } as Vars}>
        <strong>Prologue</strong>
        <small>
          <Lock size={11} />
          密钥在本机
        </small>
      </div>
      <svg viewBox="0 0 100 200" preserveAspectRatio="none">
        {[50, 100, 150].map((y, index) => (
          <path
            key={y}
            d={`M0 100 C 55 100, 45 ${y}, 100 ${y}`}
            style={{ '--r': 5 + index } as Vars}
          />
        ))}
      </svg>
      <div className="ew-runtime-col">
        {['OpenAI', 'Anthropic', '兼容服务'].map((name, index) => (
          <span
            className="ew-in"
            key={name}
            style={{ '--r': 6 + index } as Vars}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

function SearchVisual() {
  const results = [
    ['Pages', 'Q4 复盘'],
    ['Dataset', 'Q4 预算'],
    ['Feed', 'Q4 路线图'],
  ];
  return (
    <div className="ew-mock ew-card ew-palette" aria-hidden="true">
      <div className="ew-palette-input">
        <Search size={15} />
        <span className="ew-typing ew-typing-short">Q4</span>
        <kbd>⌘K</kbd>
      </div>
      {results.map(([plugin, text], index) => (
        <div
          className="ew-palette-row ew-in"
          key={plugin}
          style={{ '--r': 2 + index } as Vars}
        >
          <small>{plugin}</small>
          <span>
            <mark>Q4</mark>
            {text.slice(2)}
          </span>
        </div>
      ))}
    </div>
  );
}

export const featureVisuals: Record<FeatureVisual, ComponentType> = {
  goals: GoalsVisual,
  capabilities: CapabilitiesVisual,
  studio: StudioVisual,
  coding: CodingVisual,
  runtime: RuntimeVisual,
  search: SearchVisual,
};

export function AgentsVisual() {
  return (
    <div className="ew-mock ew-import" aria-hidden="true">
      <div className="ew-import-list">
        {['Codex', 'Claude Code', 'Cursor', 'OpenCode', 'Grok Build'].map(
          (name, index) => (
            <span className="ew-in" key={name} style={{ '--r': index } as Vars}>
              {name}
            </span>
          ),
        )}
      </div>
      <ArrowDown className="ew-in" size={16} style={{ '--r': 5 } as Vars} />
      <div
        className="ew-card ew-import-role ew-in"
        style={{ '--r': 6 } as Vars}
      >
        <Bot size={17} />
        <span>
          <i />
          <i />
        </span>
        <b>v1</b>
      </div>
    </div>
  );
}
