'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type {
  CSSProperties,
  ComponentType,
  PointerEvent as ReactPointerEvent,
} from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Blocks,
  Bot,
  Check,
  Command,
  Download,
  FileText,
  HardDrive,
  LayoutPanelTop,
  Lock,
  Search,
  ShieldCheck,
  Undo2,
  Workflow,
} from 'lucide-react';
import '../daylight.css';
import './work.css';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/*
 * 页面先于下一次发版上线：v0.2.0 只含 Goals、Work、Feed、Artifacts，
 * 其余能力都标「下一版」。新版发布后把它改成 false，标签整体消失。
 */
const SHOW_NEXT_RELEASE = true;
/* 已签名并公证的 macOS 安装包发布后填入下载地址；为空时只显示「在 GitHub 查看」。 */
const MAC_DOWNLOAD_URL: string | null = null;
const GITHUB_URL = 'https://github.com/molis-ai/molis-work';

type TagKind = 'next' | 'preview' | 'soon' | 'planned';
const tagLabels: Record<TagKind, string> = {
  next: '下一版',
  preview: '预览',
  soon: '即将推出',
  planned: '规划中',
};

function Tag({ kind }: { kind: TagKind }) {
  if (kind === 'next' && !SHOW_NEXT_RELEASE) return null;
  return <span className={`dw-tag dw-tag-${kind}`}>{tagLabels[kind]}</span>;
}

function Tags({ kinds }: { kinds?: TagKind[] }) {
  if (!kinds?.length) return null;
  return (
    <>
      {kinds.map((kind) => (
        <Tag kind={kind} key={kind} />
      ))}
    </>
  );
}

const heroLines = ['让工作，', '在人、工具与 Agent 之间继续。'];
/* 中文逐字、英文按词拆开，窄屏换行时不会把 Agent 断开。 */
const tokens = (line: string) =>
  (line.match(/[A-Za-z]+|./gu) ?? []).map((t) => (t === ' ' ? '\u00a0' : t));

const pillars: { title: string; text: string; tags?: TagKind[] }[] = [
  {
    title: '目标可核对',
    text: '所有 Agent 推进同一份 Goal。重要改动由你确认，“完成”要过显式收尾。',
  },
  {
    title: '能力注册一次，到处可用',
    text: '插件的每项能力，页面、助理、工作流和外部 Agent 都能调用，权限逐个授予。',
    tags: ['next'],
  },
  {
    title: '工具可以自己做',
    text: '缺什么工具，描述出来，让 Agent 写成插件，装进你的项目。',
    tags: ['next'],
  },
];

const entries: {
  label: string;
  note?: string;
  icon: ComponentType<{ size?: number }>;
  tags?: TagKind[];
}[] = [
  { label: '页面与搜索', icon: LayoutPanelTop },
  { label: '个人助理', icon: Bot, tags: ['soon'] },
  { label: '工作流程与定时', icon: Workflow },
  { label: '外部 Agent', note: 'MCP', icon: Command },
];

type Feature = {
  id: string;
  name: string;
  title: string;
  points: string[];
  tags?: TagKind[];
  photo: string;
  size: [number, number];
  caption: string;
};

const features: Feature[] = [
  {
    id: 'goals',
    name: '目标',
    title: '目标只有一份，“完成”可以核对。',
    points: [
      'Codex、Claude Code 和内置助理推进的是同一个 Goal；打开就能看到要达成什么、做完了什么、下一步是什么。',
      'Agent 可以提议，不能悄悄改掉你认可的目标；完成要核对约定、依据和阻塞。',
      '依赖画布、决定中心、绑定在 Goal 上的终端、macOS 菜单栏。',
    ],
    photo: '/images/atelier/studio-desk.jpg',
    size: [1440, 960],
    caption: '产品截图 · 演示数据',
  },
  {
    id: 'capabilities',
    name: '能力',
    title: '能力注册一次，到处可用。',
    points: [
      '插件把查询和操作登记到同一个能力目录，页面、助理、工作流和外部 Agent 都从这里调用。',
      '在 Claude Code、Codex 等客户端连上 Molis Work 的 MCP，就能在授权范围内查询、判断、写入。',
      '权限逐个授予、随时撤回；每次调用留记录，被取消或撤权的调用不再写入。',
    ],
    tags: ['next'],
    photo: '/images/atelier/shared-studio.jpg',
    size: [1440, 960],
    caption: '界面示意',
  },
  {
    id: 'studio',
    name: '插件创作台',
    title: '缺的工具，描述出来，让它长出来。',
    points: [
      '说清楚要什么，Agent 先给方案，再在沙箱里写真实代码，通过检查后装进项目。',
      '安装前经过宿主检查和无头浏览器验收；试用时的写入不碰正式数据。',
      '做好的插件自动成为能力，助理、Coding 和外部 Agent 都能调用。',
    ],
    tags: ['preview', 'next'],
    photo: '/images/atelier/makers-studio.jpg',
    size: [1672, 941],
    caption: '界面示意',
  },
  {
    id: 'coding',
    name: 'Coding',
    title: '编码 Agent，住在你的项目里。',
    points: [
      '计划与任务板、子代理并行、停下后从断点继续。',
      '多个会话可以认领任务、互相发信，等到答复再自动继续。',
      '写文件、跑命令、push、开 PR 都先经你审查。我们用它改过 Molis Work 自己的代码。',
    ],
    tags: ['next'],
    photo: '/images/edition-c/making-study.jpg',
    size: [1536, 1024],
    caption: '界面示意',
  },
  {
    id: 'runtime',
    name: 'AI 运行时',
    title: '模型只配一次，所有 AI 走同一条路。',
    points: [
      '文字、图片、判断和 Agent 都经同一个 Prologue 运行时；接 OpenAI 或 Anthropic 接口及兼容服务。',
      '密钥加密存在本机，插件只拿到引用；Agent 要改东西先进审查队列。',
      '系统和插件的提示词、角色登记在一处，可见可改。',
    ],
    tags: ['next'],
    photo: '/images/atelier/threshold.jpg',
    size: [1440, 900],
    caption: '结构示意',
  },
  {
    id: 'search',
    name: '搜索',
    title: '按一下 ⌘K，找到所有东西。',
    points: [
      '搜本项目和个人空间里所有插件的内容，包括还没打开过的；点开定位到那段文字。',
      '两个字的中文、Q4 这样的短词、中英混排都能搜；只返回你有权看的内容。',
    ],
    tags: ['next'],
    photo: '/images/atelier/reading-room.jpg',
    size: [1440, 960],
    caption: '界面示意',
  },
];

const cards: {
  title: string;
  text: string;
  tags?: TagKind[];
  image?: string;
  caption: string;
}[] = [
  {
    title: '信息进来，只把要你处理的送到面前',
    text: 'RSS、网页、YouTube、GitHub、Gmail 的内容进 Feed，需要你介入的进 Inbox，选中的材料交给 Pages 写成带来源的文稿。',
    tags: ['next'],
    image: '/images/daylight/work/feed.jpg',
    caption: 'Feed · 产品截图',
  },
  {
    title: '第一次打开，项目就有内容',
    text: '勾选来源、完成授权，AI 整理出带来源的工作总结和项目建议，确认后生成项目。',
    tags: ['next'],
    image: '/images/daylight/work/onboarding.jpg',
    caption: '首次使用 · 产品截图',
  },
  {
    title: '把你调好的 Agent 带进来',
    text: '从 Codex、Claude Code、Cursor、OpenCode、Grok Build 导入规则和 Skills，发布成固定版本的角色。',
    tags: ['next'],
    caption: '界面示意',
  },
];

const RELEASED = new Set(['Goals', 'Work', 'Feed', 'Artifacts']);

const pluginGroups: { name: string; plugins: [string, string][] }[] = [
  {
    name: '目标与工作',
    plugins: [
      ['Goals', '确定目标，推进工作，留下结果。'],
      ['Work', '回到你的会话，继续正在做的事。'],
      ['Inbox', '只看需要你介入的事项。'],
      ['Feed', '查看来源消息和完整流水。'],
      ['Schedule', '到点跑自己的对话任务，也叫醒其他插件的闹钟。'],
      ['Artifacts', '打开项目成果，查看保留下来的版本。'],
    ],
  },
  {
    name: '编码',
    plugins: [
      ['Coding', '围绕代码讨论、执行和审查，保留连续的任务记录。'],
      ['Files', '查看工作区文件与保留的内容。'],
      ['Git', '查看工作区的版本与变更。'],
      ['Diff', '比较固定版本，逐项阅读差异。'],
      ['Text stats', '查看材料与成果的文本统计。'],
    ],
  },
  {
    name: '写作与数据',
    plugins: [
      ['Pages', '写文档，用块和格式，保存在这台电脑。'],
      ['Form', '建问卷，预览填写，看结果。'],
      ['Dataset', '改表格，导入 CSV，留下版本。'],
      ['PPT', '写幻灯片大纲，预览并导出 JSON。'],
      ['Images', '连接生图服务，描述图片，预览并保存生成结果。'],
    ],
  },
  {
    name: '想法与知识',
    plugins: [
      ['灵光', '先记下还没想清楚的想法，再决定留下或丢掉。'],
      ['Jelly', '安排事项、写笔记、收集灵感，把想法放进每天。'],
      ['Cognia', '导入本地知识，保留来源，整理为可追溯的知识。'],
      ['Shelf', '把文件放到置物架，处理副本，原件不动。'],
      ['Alchemist', '写下方向，炼成可比较的卡，再决定做不做。'],
    ],
  },
  {
    name: '自动化与 AI',
    plugins: [
      ['Workflows', '把已有插件按顺序串成一件可以做完的事。'],
      ['Characters', '编辑角色的做事方式，发布固定版本供 AI 任务选择。'],
      ['Experiments', '同一任务，独立比较模型的判断、耗时与成本。'],
      ['插件创作台', '用自然语言设计、构建并使用自己的插件。'],
    ],
  },
];

const localPoints = [
  {
    icon: HardDrive,
    text: '所有数据在本机的 Molis Work Home，浏览器和 macOS App 打开同一个工作台。',
  },
  {
    icon: ShieldCheck,
    text: '安装不改你的项目和 Agent 配置；接入先预览，确认才写入，失败自动回滚。',
  },
  { icon: Undo2, text: '卸载只撤销它自己写入的部分，你的项目和数据保留。' },
  { icon: FileText, text: '外部内容始终当作资料，不会变成给 AI 的指令。' },
];

const upcoming: { name: string; text: string; tag: TagKind }[] = [
  {
    name: '个人助理',
    text: '在任何页面叫它，用 @ 引用内容、用 / 选能力，读 PDF 和图片；可撤销的操作直接做，该跟进的事提醒你。',
    tag: 'soon',
  },
  {
    name: '项目讨论',
    text: '项目主群和公开话题，在工作区旁边分屏打开。',
    tag: 'preview',
  },
  {
    name: '面向团队',
    text: '团队空间、成员权限与多设备同步。',
    tag: 'planned',
  },
  { name: '分享插件', text: '把你做的插件分享给别人使用。', tag: 'planned' },
];

function random(seed: number) {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
}

const branches = [
  { x: -40, y: 60, dx: 540, dy: 170, leaves: 10, seed: 5 },
  { x: 60, y: -20, dx: 330, dy: 340, leaves: 8, seed: 13 },
  { x: 240, y: 110, dx: 400, dy: -30, leaves: 7, seed: 29 },
];

function LeafShadow({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 460"
      preserveAspectRatio="xMinYMin slice"
      aria-hidden="true"
    >
      {branches.map((branch, b) => (
        <g className={`dl-branch dl-branch-${b}`} key={b}>
          <path
            d={`M${branch.x} ${branch.y} q ${branch.dx * 0.5} ${branch.dy * 0.2} ${branch.dx} ${branch.dy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {Array.from({ length: branch.leaves }, (_, i) => {
            const t = (i + 1) / (branch.leaves + 1);
            const r = random(branch.seed + i);
            const x = branch.x + branch.dx * t;
            const y = branch.y + branch.dy * (0.4 * t * (1 - t) + t * t);
            const side = i % 2 === 0 ? 1 : -1;
            const angle =
              (Math.atan2(branch.dy, branch.dx) * 180) / Math.PI +
              side * (38 + r * 30);
            const length = 22 + r * 18;
            return (
              <ellipse
                key={i}
                cx={x + side * 6}
                cy={y + side * 10}
                rx={length}
                ry={length * 0.34}
                transform={`rotate(${angle} ${x} ${y})`}
                fill="currentColor"
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

function MaskLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <span className="dl-mask" key={line}>
          <span style={{ '--d': index } as Vars}>{line}</span>
        </span>
      ))}
    </>
  );
}

function Actions({ tone }: { tone: 'light' | 'dusk' }) {
  return (
    <div className={`dw-actions dw-actions-${tone}`}>
      {MAC_DOWNLOAD_URL ? (
        <a className="dw-button dw-button-primary" href={MAC_DOWNLOAD_URL}>
          <Download size={17} aria-hidden="true" />
          下载 macOS 版
        </a>
      ) : null}
      <a
        className={`dw-button ${MAC_DOWNLOAD_URL ? 'dw-button-ghost' : 'dw-button-primary'}`}
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
      >
        在 GitHub 查看
        <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </div>
  );
}

function Window({
  src,
  width,
  height,
  label,
  priority,
  className = '',
}: {
  src: string;
  width: number;
  height: number;
  label: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`dw-window ${className}`}>
      <div className="dw-window-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{label}</span>
      </div>
      <img
        src={src}
        width={width}
        height={height}
        alt=""
        loading={priority ? undefined : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />
    </div>
  );
}

/* ---------- 六个区块的画面：除目标用真实截图外都是示意 ---------- */

function GoalsVisual() {
  return (
    <Window
      className="dw-mock dw-shot"
      src="/images/daylight/work/goals.jpg"
      width={1440}
      height={1000}
      label="Goals"
    />
  );
}

function CapabilitiesVisual() {
  const rows = [
    ['查询', true],
    ['判断', true],
    ['写入', false],
  ] as const;
  return (
    <div className="dw-mock dw-cap" aria-hidden="true">
      <div className="dw-cap-callers">
        {['页面', '助理', '工作流', '外部 Agent'].map((name, index) => (
          <span key={name} style={{ '--r': index } as Vars}>
            {name}
          </span>
        ))}
      </div>
      <div className="dw-cap-card">
        <div className="dw-cap-head">
          <Blocks size={15} />
          能力目录
        </div>
        {rows.map(([label, on], index) => (
          <div
            className="dw-cap-row"
            key={label}
            style={{ '--r': index } as Vars}
          >
            <span>{label}</span>
            <small>{on ? '已授予' : '已撤回'}</small>
            <b className={on ? 'is-on' : ''}>
              <i />
            </b>
          </div>
        ))}
        <div className="dw-cap-log">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

function StudioVisual() {
  const steps = ['描述', '方案', '沙箱', '检查', '安装'];
  return (
    <div className="dw-mock dw-studio" aria-hidden="true">
      <div className="dw-studio-prompt">
        <Search size={14} />
        <span className="dw-studio-caret" />
      </div>
      <ol>
        {steps.map((step, index) => (
          <li key={step} style={{ '--r': index } as Vars}>
            <b>
              <Check size={12} />
            </b>
            {step}
          </li>
        ))}
      </ol>
      <div className="dw-studio-plugin">
        <span>
          <Blocks size={18} />
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
    <div className="dw-mock dw-board" aria-hidden="true">
      {columns.map(([name, count], c) => (
        <div className="dw-board-col" key={name}>
          <small>{name}</small>
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className={c === 2 ? 'is-review' : c === 1 ? 'is-live' : ''}
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
    <div className="dw-mock dw-runtime" aria-hidden="true">
      <div className="dw-runtime-col">
        {['文字', '图片', '判断', 'Agent'].map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>
      <svg viewBox="0 0 100 200" preserveAspectRatio="none">
        {[25, 75, 125, 175].map((y) => (
          <path key={y} d={`M0 ${y} C 55 ${y}, 45 100, 100 100`} />
        ))}
      </svg>
      <div className="dw-runtime-core">
        <strong>Prologue</strong>
        <small>
          <Lock size={11} />
          密钥在本机
        </small>
      </div>
      <svg viewBox="0 0 100 200" preserveAspectRatio="none">
        {[50, 100, 150].map((y) => (
          <path key={y} d={`M0 100 C 55 100, 45 ${y}, 100 ${y}`} />
        ))}
      </svg>
      <div className="dw-runtime-col">
        {['OpenAI', 'Anthropic', '兼容服务'].map((name) => (
          <span key={name}>{name}</span>
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
    <div className="dw-mock dw-palette" aria-hidden="true">
      <div className="dw-palette-input">
        <Search size={16} />
        <span>Q4</span>
        <kbd>⌘K</kbd>
      </div>
      {results.map(([plugin, text], index) => (
        <div
          className="dw-palette-row"
          key={plugin}
          style={{ '--r': index } as Vars}
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

const visuals: Record<string, ComponentType> = {
  goals: GoalsVisual,
  capabilities: CapabilitiesVisual,
  studio: StudioVisual,
  coding: CodingVisual,
  runtime: RuntimeVisual,
  search: SearchVisual,
};

function FeatureCopy({ feature }: { feature: Feature }) {
  return (
    <>
      <div className="dw-feature-meta">
        <span>{feature.name}</span>
        <Tags kinds={feature.tags} />
      </div>
      <h3>
        {feature.title.split(/(?<=，)/).map((phrase) => (
          <span className="dl-phrase" key={phrase}>
            {phrase}
          </span>
        ))}
      </h3>
      <ul>
        {feature.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </>
  );
}

function ImportVisual() {
  return (
    <div className="dw-import" aria-hidden="true">
      <div className="dw-import-list">
        {['Codex', 'Claude Code', 'Cursor', 'OpenCode', 'Grok Build'].map(
          (name, index) => (
            <span key={name} style={{ '--r': index } as Vars}>
              {name}
            </span>
          ),
        )}
      </div>
      <ArrowDown className="dw-import-arrow" size={18} />
      <div className="dw-import-role">
        <Bot size={18} />
        <span>
          <i />
          <i />
        </span>
        <b>v1</b>
      </div>
    </div>
  );
}

function trackSpotlight(event: ReactPointerEvent<HTMLElement>) {
  const target = event.currentTarget;
  const box = target.getBoundingClientRect();
  target.style.setProperty('--mx', `${event.clientX - box.left}px`);
  target.style.setProperty('--my', `${event.clientY - box.top}px`);
}

export default function WorkPage() {
  const siteRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const site = siteRef.current;
    if (!site) return;
    const header = site.querySelector<HTMLElement>('.dl-header');
    const hero = site.querySelector<HTMLElement>('.dw-hero');
    const scenes = Array.from(
      site.querySelectorAll<HTMLElement>('[data-scene]'),
    );

    let frame = 0;
    let lastY = window.scrollY;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const scene of scenes) {
        const box = scene.getBoundingClientRect();
        if (box.bottom < -vh * 0.25 || box.top > vh * 1.25) continue;
        let progress =
          scene.dataset.scene === 'exit'
            ? -box.top / Math.max(1, box.height)
            : (vh - box.top) / (vh + box.height);
        progress = Math.min(1, Math.max(0, progress));
        scene.style.setProperty('--p', progress.toFixed(4));
      }
      const y = window.scrollY;
      if (header) {
        header.classList.toggle('is-solid', y > vh * 0.6);
        header.classList.toggle('is-hidden', y > vh && y > lastY + 2);
        if (y < lastY - 2) header.classList.remove('is-hidden');
      }
      lastY = y;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const revealer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          revealer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -14% 0px' },
    );
    site
      .querySelectorAll('.dl-reveal')
      .forEach((node) => revealer.observe(node));

    const panels = Array.from(site.querySelectorAll<HTMLElement>('.dw-panel'));
    const spotter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target
            .querySelector('.dw-panel-frame')
            ?.classList.add('is-seen');
          setActive(panels.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    panels.forEach((panel) => spotter.observe(panel));

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !hero) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      hero.style.setProperty('--sun-x', (x * 28).toFixed(1) + 'px');
      hero.style.setProperty('--sun-y', (y * 18).toFixed(1) + 'px');
    };

    site.classList.add('is-ready');
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    hero?.addEventListener('pointermove', onPointer);
    return () => {
      cancelAnimationFrame(frame);
      revealer.disconnect();
      spotter.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      hero?.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <div className="dl-site dw-site" ref={siteRef}>
      <header className="dl-header">
        <Link href="/demos/brand/daylight" className="dl-logo">
          <img src="/images/molis-logo.png" width="44" height="44" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="dl-pill" aria-label="页面导航">
          <a href="#features">功能</a>
          <a href="#plugins">插件</a>
          <a href="#local">本地优先</a>
          <a
            href={MAC_DOWNLOAD_URL ?? GITHUB_URL}
            className="dl-pill-cta"
            target={MAC_DOWNLOAD_URL ? undefined : '_blank'}
            rel={MAC_DOWNLOAD_URL ? undefined : 'noreferrer'}
          >
            {MAC_DOWNLOAD_URL ? '下载 macOS 版' : '在 GitHub 查看'}
          </a>
        </nav>
      </header>

      <main id="main">
        <section
          className="dw-hero"
          data-scene="exit"
          aria-labelledby="dw-title"
        >
          <div className="dw-hero-frame">
            <div className="dw-hero-open">
              <div className="dw-hero-media">
                <img
                  src="/images/edition-c/studio-light.jpg"
                  width="1672"
                  height="941"
                  alt=""
                  fetchPriority="high"
                />
              </div>
              <div className="dw-hero-shade" />
              <div className="dl-hero-glow" />
              <LeafShadow className="dl-leaves dw-hero-leaves" />

              <div className="dw-hero-copy">
                <span className="dw-kicker">
                  MOLIS WORK · 本地优先的 AI 工作台
                </span>
                <h1 id="dw-title" aria-label={heroLines.join('')}>
                  {heroLines.map((line, lineIndex) => (
                    <span className="dw-line" key={line} aria-hidden="true">
                      {tokens(line).map((token, index) => (
                        <span
                          key={index}
                          style={{ '--d': lineIndex * 4 + index } as Vars}
                        >
                          {token}
                        </span>
                      ))}
                    </span>
                  ))}
                </h1>
                <div className="dw-hero-lower">
                  <p>
                    目标、成果和能力放在同一个地方。换工具、换
                    Agent、隔几天回来，都从上次停下的地方接着做。
                  </p>
                  <Actions tone="light" />
                  <small>
                    数据在你的电脑上。内置接入 Codex、Claude Code、OpenCode、Pi
                    Agent、Grok Build。
                  </small>
                </div>
              </div>

              <figure className="dw-hero-shot">
                <div className="dw-window">
                  <div className="dw-window-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>项目首页</span>
                  </div>
                  <picture>
                    <source
                      media="(max-width: 760px)"
                      srcSet="/images/daylight/work/phone.jpg"
                      width={390}
                      height={844}
                    />
                    <img
                      src="/images/daylight/work/home.jpg"
                      width="1440"
                      height="1000"
                      alt="Molis Work 项目首页：今天的工作、正在推进的目标和当天的事件"
                      fetchPriority="high"
                    />
                  </picture>
                </div>
                <figcaption>产品截图 · 演示数据</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="dw-pillars" aria-label="三个支柱">
          <ol>
            {pillars.map((pillar, index) => (
              <li
                className="dw-pillar dl-reveal"
                key={pillar.title}
                style={{ '--r': index } as Vars}
              >
                <span className="dw-pillar-index">0{index + 1}</span>
                <h2>
                  {pillar.title}
                  <Tags kinds={pillar.tags} />
                </h2>
                <p>{pillar.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="dw-arch" aria-labelledby="dw-arch-title">
          <div className="dw-arch-head dl-reveal">
            <h2 id="dw-arch-title">
              <MaskLines
                lines={['四个入口，', '一个能力目录，', '一个 AI 运行时。']}
              />
            </h2>
            <p>
              你在页面里操作，助理替你执行，工作流按顺序跑，外部 Agent 经 MCP
              调用。它们用的是同一批插件、同一套权限、同一份记录。
              <Tag kind="next" />
            </p>
          </div>

          <figure className="dw-arch-figure dl-reveal" data-scene="pass">
            <div className="dw-arch-sun" aria-hidden="true" />
            <LeafShadow className="dl-leaves dw-arch-leaves" />
            <div className="dw-arch-diagram">
              <ul className="dw-arch-entries">
                {entries.map(({ label, note, icon: Icon, tags }, index) => (
                  <li
                    className="dw-node dw-node-entry"
                    key={label}
                    style={{ '--r': index } as Vars}
                  >
                    <span className="dw-node-icon">
                      <Icon size={17} />
                    </span>
                    <strong>{label}</strong>
                    {note ? <small>{note}</small> : null}
                    <Tags kinds={tags} />
                    <i className="dw-wire" aria-hidden="true" />
                  </li>
                ))}
              </ul>
              <div
                className="dw-node dw-node-catalog"
                style={{ '--r': 4 } as Vars}
              >
                <Blocks size={20} aria-hidden="true" />
                <strong>统一能力目录</strong>
              </div>
              <div className="dw-arch-row">
                <div
                  className="dw-node dw-node-lower"
                  style={{ '--r': 5 } as Vars}
                >
                  <i className="dw-wire dw-wire-up" aria-hidden="true" />
                  <i className="dw-wire" aria-hidden="true" />
                  <strong>插件：内置 25 个，加上你做的</strong>
                </div>
                <div
                  className="dw-node dw-node-lower"
                  style={{ '--r': 6 } as Vars}
                >
                  <i className="dw-wire dw-wire-up" aria-hidden="true" />
                  <i className="dw-wire" aria-hidden="true" />
                  <strong>Prologue 运行时</strong>
                </div>
              </div>
              <div
                className="dw-node dw-node-base"
                style={{ '--r': 7 } as Vars}
              >
                <HardDrive size={18} aria-hidden="true" />
                <strong>一个 Home，数据存在本机</strong>
              </div>
            </div>
            <figcaption>结构示意</figcaption>
          </figure>
        </section>

        <section id="features" className="dw-features" aria-label="主要功能">
          <div className="dw-rail">
            <ol className="dw-rail-nav">
              {features.map((feature, index) => (
                <li key={feature.id}>
                  <a
                    href={`#feature-${feature.id}`}
                    aria-current={active === index ? 'true' : undefined}
                  >
                    <span>0{index + 1}</span>
                    {feature.name}
                  </a>
                </li>
              ))}
            </ol>
            <div className="dw-rail-copy">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`dw-feature-copy${active === index ? ' is-active' : ''}`}
                  aria-hidden={active === index ? undefined : 'true'}
                >
                  <FeatureCopy feature={feature} />
                </div>
              ))}
            </div>
          </div>

          <div className="dw-panels">
            {features.map((feature, index) => {
              const Visual = visuals[feature.id];
              return (
                <article
                  key={feature.id}
                  id={`feature-${feature.id}`}
                  className={`dw-panel dw-panel-${feature.id}${active === index ? ' is-active' : ''}`}
                  data-scene="pass"
                  aria-label={feature.name}
                >
                  <figure className="dw-panel-frame">
                    <img
                      className="dw-panel-photo"
                      src={feature.photo}
                      width={feature.size[0]}
                      height={feature.size[1]}
                      alt=""
                      loading="lazy"
                    />
                    <div className="dw-panel-shade" />
                    <Visual />
                    <figcaption>
                      <span>0{index + 1}</span>
                      {feature.caption}
                    </figcaption>
                  </figure>
                  <div className="dw-panel-copy">
                    <FeatureCopy feature={feature} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="dw-cards" aria-label="更多能力">
          {cards.map((card, index) => (
            <article
              className="dw-card dl-reveal"
              key={card.title}
              style={{ '--r': index } as Vars}
            >
              <figure>
                {card.image ? (
                  <img
                    src={card.image}
                    width="1440"
                    height="1000"
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <ImportVisual />
                )}
                <figcaption>{card.caption}</figcaption>
              </figure>
              <div className="dw-card-copy">
                <Tags kinds={card.tags} />
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </section>

        <section
          id="plugins"
          className="dw-plugins"
          aria-labelledby="dw-plugins-title"
        >
          <div className="dw-plugins-head dl-reveal">
            <h2 id="dw-plugins-title">
              <MaskLines lines={['25 个内置插件，', '开箱即用。']} />
            </h2>
            <p>每个插件做好一件事，它们的能力都在同一个目录里。</p>
          </div>
          <div className="dw-plugin-groups">
            {pluginGroups.map((group) => (
              <div className="dw-plugin-group dl-reveal" key={group.name}>
                <h3>{group.name}</h3>
                <ul>
                  {group.plugins.map(([name, text], index) => (
                    <li
                      key={name}
                      className="dw-plugin"
                      style={{ '--r': index } as Vars}
                      onPointerMove={trackSpotlight}
                    >
                      <strong>{name}</strong>
                      <p>{text}</p>
                      <span className="dw-plugin-tags">
                        {name === '插件创作台' ? <Tag kind="preview" /> : null}
                        {RELEASED.has(name) ? null : <Tag kind="next" />}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section
          id="local"
          className="dw-local"
          aria-labelledby="dw-local-title"
        >
          <figure className="dw-local-figure dl-reveal" data-scene="pass">
            <img
              className="dw-local-photo"
              src="/images/atelier/studio-desk.jpg"
              width="1440"
              height="960"
              alt=""
              loading="lazy"
            />
            <LeafShadow className="dl-leaves dw-local-leaves" />
            <Window
              className="dw-local-browser"
              src="/images/daylight/work/home.jpg"
              width={1440}
              height={1000}
              label="浏览器"
            />
            <Window
              className="dw-local-app"
              src="/images/daylight/work/home-dark.jpg"
              width={1440}
              height={1000}
              label="macOS App"
            />
            <figcaption>产品截图 · 场景示意</figcaption>
          </figure>
          <div className="dw-local-copy">
            <h2 id="dw-local-title" className="dl-reveal">
              <MaskLines lines={['数据在你的电脑上，', '边界说得清楚。']} />
            </h2>
            <ul>
              {localPoints.map(({ icon: Icon, text }, index) => (
                <li
                  className="dl-reveal"
                  key={text}
                  style={{ '--r': index } as Vars}
                >
                  <span>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <p>{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="dw-next"
          data-scene="pass"
          aria-labelledby="dw-next-title"
        >
          <div className="dw-next-sun" aria-hidden="true" />
          <h2 id="dw-next-title" className="dl-reveal">
            <MaskLines lines={['接下来']} />
          </h2>
          <ol>
            {upcoming.map((item, index) => (
              <li
                className="dw-next-item dl-reveal"
                key={item.name}
                style={{ '--r': index } as Vars}
              >
                <Tag kind={item.tag} />
                <h3>{item.name}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="dl-dusk dw-dusk">
        <div className="dl-dusk-glow" aria-hidden="true" />
        <div className="dw-dusk-invite dl-reveal">
          <h2>
            <MaskLines
              lines={['工具可以不断长出来，', '工作不必一次次重来。']}
            />
          </h2>
          <Actions tone="dusk" />
        </div>
        <div className="dl-wordmark dw-wordmark dl-reveal" aria-hidden="true">
          <span>Molis Work</span>
        </div>
        <div className="dl-dusk-meta">
          <Link href="/demos/brand/daylight" className="dl-footer-brand">
            <img
              src="/images/molis-logo.png"
              width="28"
              height="28"
              alt=""
              loading="lazy"
            />
            Molis AI
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
