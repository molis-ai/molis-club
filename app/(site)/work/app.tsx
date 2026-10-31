import {
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  LayoutGrid,
  PanelRight,
  Plus,
  Send,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

// 画面里的 Molis Work：照最新桌面端（2026-10-24 main，Soft Workbench）画，只删不加。
// 珍珠灰的桌面上一整块白色工作面；上面一条标签（一个插件一组，组带插件的色相），
// 底下左边是插件组、中间是助理输入框、右边是右栏开关和头像。字用官网的 Jost 与苹方。
// 尺寸都按窗口宽度算（work.css 的 --u，一个窗口宽 64u），放大缩小都清楚，不靠 transform 缩放。

/** 插件的色相（Molis Work palette.ts 的 MW_PLUGINS；只用在标签组上） */
export type Hue =
  | 'gray'
  | 'blue'
  | 'cyan'
  | 'green'
  | 'mint'
  | 'yellow'
  | 'orange'
  | 'indigo'
  | 'purple';

export type TabSpec = {
  icon: LucideIcon;
  title: string;
  hue?: Hue;
  on?: boolean;
  /** 编排里认它的名字（data-c） */
  c?: string;
  /** 演到某一拍才出现、演完留着（work.css 的 data-step） */
  step?: boolean;
  /** 开头在、演完不在（data-gone） */
  gone?: boolean;
  /** 只在中途出现（data-mid） */
  mid?: boolean;
  /** 开头是当前标签，演到后面让给别的标签（编排给它 data-off） */
  wasOn?: boolean;
};

export function Tab({ icon: Icon, title, hue = 'gray', on, c, step, gone, mid, wasOn }: TabSpec) {
  return (
    <span
      className="wk-tab"
      data-hue={hue}
      data-tab-on={on || undefined}
      data-was-on={wasOn || undefined}
      data-c={c}
      data-step={step || undefined}
      data-gone={gone || undefined}
      data-mid={mid || undefined}
    >
      <Icon aria-hidden="true" />
      <span className="wk-tab-name">{title}</span>
      {on || wasOn ? <X className="wk-tab-x" aria-hidden="true" /> : null}
    </span>
  );
}

export type DockSpec = {
  /** 当前插件：名字与图标，左下角那颗胶囊 */
  current: { icon: LucideIcon; label: string; c?: string };
  /** 演到后面换到的插件（编排给 data-c="dock-cur" 打 data-on 以后换过去；做完的样子就是它） */
  next?: { icon: LucideIcon; label: string };
  icons: { icon: LucideIcon; on?: boolean; c?: string; step?: boolean }[];
  more?: string;
};

/** 底栏左边：当前插件 + 钉在 Dock 的几颗 */
export function Dock({ current, next, icons, more }: DockSpec) {
  const Current = current.icon;
  const Next = next?.icon;
  return (
    <div className="wk-dock" data-region="dock">
      {next && Next ? (
        <span className="wk-dock-cur wk-shift" data-c="dock-cur">
          <span data-was="">
            <Current aria-hidden="true" />
            <span>{current.label}</span>
          </span>
          <span data-now="">
            <Next aria-hidden="true" />
            <span>{next.label}</span>
          </span>
          <ChevronUp className="wk-dock-up" aria-hidden="true" />
        </span>
      ) : (
        <span className="wk-dock-cur" data-c={current.c}>
          <Current aria-hidden="true" />
          <span>{current.label}</span>
          <ChevronUp className="wk-dock-up" aria-hidden="true" />
        </span>
      )}
      <i className="wk-dock-sep" aria-hidden="true" />
      {icons.map(({ icon: Icon, on, c, step }, index) => (
        <span
          key={index}
          className="wk-dock-ic"
          data-dock-on={on || undefined}
          data-c={c}
          data-step={step || undefined}
        >
          <Icon aria-hidden="true" />
        </span>
      ))}
      {more ? <span className="wk-dock-more">{more}</span> : null}
    </div>
  );
}

/**
 * 一扇 Molis Work 窗口。children 是白色工作面里的东西；rail 是右栏（有它时工作面让出右边）；
 * input 是助理输入框里的东西（占位字、等你的计数、正在打的字）。
 */
export function Win({
  tabs,
  dock,
  input,
  rail,
  children,
  theme,
  className = '',
  style,
}: {
  tabs: TabSpec[];
  dock: DockSpec;
  input?: ReactNode;
  rail?: ReactNode;
  children: ReactNode;
  theme?: 'light' | 'dark';
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`wk-win ${className}`} data-theme={theme} style={style}>
      <div className="wk-top" data-region="tabs">
        <span className="wk-nav" aria-hidden="true">
          <ArrowLeft />
          <ArrowRight />
        </span>
        <span className="wk-tabs">
          {tabs.map((tab, index) => (
            <Tab key={index} {...tab} />
          ))}
        </span>
        <span className="wk-top-end" aria-hidden="true">
          <Plus />
          <LayoutGrid />
        </span>
      </div>
      <div className="wk-body" data-rail={rail ? '' : undefined}>
        <div className="wk-card" data-region="main">
          {children}
        </div>
        {rail ? (
          <div className="wk-rail" data-region="rail">
            {rail}
          </div>
        ) : null}
      </div>
      <div className="wk-bar">
        <Dock {...dock} />
        <div className="wk-input" data-region="input">
          <span className="wk-input-in">
            {input ?? <span className="wk-ph">让助理做点什么，或按 ⌘K 搜索</span>}
          </span>
          <span className="wk-input-plus" aria-hidden="true">
            <Plus />
          </span>
          <span className="wk-send" aria-hidden="true">
            <Send />
          </span>
        </div>
        <span className="wk-bar-end" aria-hidden="true">
          <span className="wk-side">
            <PanelRight />
          </span>
          <span className="wk-me">M</span>
        </span>
      </div>
    </div>
  );
}

export type Tone = 'idle' | 'progress' | 'attention' | 'hold' | 'blocked' | 'done';

/** 状态环：进行中是半圈的弧，完成里面一个勾，其余是一圈细线（Molis Work 的 state-ring） */
export function Ring({ tone }: { tone: Tone }) {
  return (
    <svg className="wk-ring" data-tone={tone} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.2" />
      {tone === 'progress' ? <path className="wk-ring-arc" d="M8 1.8a6.2 6.2 0 0 1 6.2 6.2" /> : null}
      {tone === 'done' ? <path className="wk-ring-tick" d="M5.2 8.2l1.9 1.9 3.8-4" /> : null}
    </svg>
  );
}

/** 状态签：环 + 字，色调随状态 */
export function State({ tone, children, c, step }: { tone: Tone; children: ReactNode; c?: string; step?: boolean }) {
  return (
    <span className="wk-state" data-tone={tone} data-c={c} data-step={step || undefined}>
      <Ring tone={tone} />
      {children}
    </span>
  );
}

/** AI 在写：插入光标 + 灰名牌，跟在它正在写的那行字后面；写完就收起 */
export function Ai({ n, c }: { n: string; c: string }) {
  return <i className="wk-ai" data-n={n} data-c={c} aria-hidden="true" />;
}

/** 一段 AI 写出来的字：演的时候从左往右显出来（data-on 以后） */
export function Writes({ c, children }: { c: string; children: ReactNode }) {
  return (
    <span className="wk-w" data-c={c}>
      {children}
    </span>
  );
}

/** 你：一枚冰蓝的「你」字名牌，左上角削尖就是指针的尖；由编排移动（cue.ts 的 data-hand） */
export function Hand({ name }: { name?: string }) {
  return (
    <div className="wk-hand" data-hand={name ?? ''} aria-hidden="true">
      <div className="wk-hand-in">
        <span className="wk-hand-name">你</span>
      </div>
    </div>
  );
}

/** 你自己做的插件：一块小方标，表示不是内置的（示意） */
export function Made({ children }: { children: ReactNode }) {
  return <span className="wk-made">{children}</span>;
}
