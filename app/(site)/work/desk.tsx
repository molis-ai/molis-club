import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Blocks,
  Code,
  FileText,
  Globe,
  Inbox as InboxIcon,
  ListChecks,
  PanelRight,
  Plug,
  Plus,
  Rss,
  Send,
  Sparkles,
  Target,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { workHand, workWhy } from '../../../content/site/work';

// 画面里的 Molis Work：照最新桌面端（浅色 Soft Workbench）画的一扇窗，和窗外的终端、对话。
// 窗是 1200×760 的设计尺寸，大屏整体缩放进镜头；窄屏把窗里的几块单独摆出来，按真实字号排。
// data-f 标着能被照亮的几处：大屏的镜头对准它，窄屏把它点亮。名字、时间、数字都是示意。

export const W = 1200;
export const H = 760;

export type Tone = 'idle' | 'progress' | 'attention' | 'done';

export function Ring({ tone }: { tone: Tone }) {
  return (
    <svg className="wk-ring" data-s={tone} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.2" />
      {tone === 'progress' ? <path className="wk-ring-arc" d="M8 1.8a6.2 6.2 0 0 1 6.2 6.2" /> : null}
      {tone === 'done' ? <path className="wk-ring-tick" d="M5.2 8.2l1.9 1.9 3.8-4" /> : null}
    </svg>
  );
}

/** 你、Claude Code、Codex、助理、Coding、内测的朋友小周 */
type Who = 'me' | 'cc' | 'cx' | 'ai' | 'co' | 'zh';
const MARK: Record<Who, ReactNode> = { me: '你', cc: 'CC', cx: 'Cx', ai: '助', co: <Code aria-hidden="true" />, zh: '周' };

function By({ who }: { who: Who[] }) {
  return (
    <span className="wk-by">
      {who.map((id) => (
        <i key={id} data-w={id}>
          {MARK[id]}
        </i>
      ))}
    </span>
  );
}

/** 「你」：冰蓝名牌，左上角削尖就是指针的尖 */
function You() {
  return <span className="wk-you">你</span>;
}

function Row({ tone, name, tag, state, who }: { tone: Tone; name: string; tag?: string; state: string; who?: Who[] }) {
  return (
    <div className="wk-row">
      <Ring tone={tone} />
      <span className="wk-row-name">
        {name}
        {tag ? <em>{tag}</em> : null}
      </span>
      <span className="wk-row-state" data-s={tone}>
        {state}
      </span>
      {who ? <By who={who} /> : <span className="wk-by" />}
    </div>
  );
}

/** 工作面打开的是哪一页 */
export type View = 'goal' | 'inbox' | 'code' | 'doc';
/** 右栏打开的是哪一栏 */
export type Side = 'log' | 'talk' | 'shelf';
/** 浮在窗上的一张卡：等你验收、新接上的工具、插件列表；递过来的那张在页面里 */
export type Over = 'wait' | 'help' | 'mcp' | 'dock';

/** 窗里此刻的样子 */
export type Shown = {
  view: View;
  /** 这件事走到哪：0 刚定下、1 反馈对上、2 讨论里接走、3 Coding 改完交回、4 等你验收、5 你验过 */
  step: number;
  side: Side;
  over?: Over;
  /** 发布说明：「导出很快」那句正在写还是已经写好、选中的是哪一处、截图拿起来了还是放进来了 */
  facts?: 'typing' | 'in';
  sel?: 'a' | 'b';
  shot?: 'lift' | 'in';
  /** 换一家 AI 时读到的几行亮哪一套 */
  read?: 'a' | 'b';
};

export const START: Shown = { view: 'goal', step: 0, side: 'log' };
export const LATER: Shown = { view: 'goal', step: 5, side: 'log', facts: 'in', shot: 'in' };

/** 目标：一件定过的事、三条完成要求 */
export function Goal({ s }: { s: Shown }) {
  const { step } = s;
  const r1: [Tone, string, Who[]?] =
    step >= 5 ? ['done', 'Agent 报告 · 测试 14/14', ['cc']] : step >= 1 ? ['progress', '在做', ['cc']] : ['idle', '待开始'];
  const r2: [Tone, string, Who[]?] = step >= 1 ? ['progress', '在做', ['cc']] : ['idle', '待开始'];
  const r3: [Tone, string, Who[]?] =
    step >= 5
      ? ['done', '你验过 · 看过截图', ['me']]
      : step === 4
        ? ['attention', '等你验收', ['co']]
        : step >= 2
          ? ['progress', 'Coding 在改', ['co']]
          : ['idle', '待验收'];
  return (
    <div className="wk-goal" data-f="goal" data-read={s.read}>
      <div className="wk-head" data-f="head">
        <p className="wk-kicker">
          <Target aria-hidden="true" />
          目标
          <span className="wk-chip">
            <Ring tone="progress" />
            {step >= 5 ? '完成要求 2/3 已满足' : '正在推进'}
          </span>
        </p>
        <h3 className="wk-title">划线卡片 v1.1：导出到 Anki</h3>
        <p className="wk-sub">周一和 Claude Code 定下</p>
      </div>

      <p className="wk-label">定过的事</p>
      <div className="wk-row wk-row-plain">
        <span className="wk-dot" />
        <span className="wk-row-name">划线只存本地，不上云</span>
        <span className="wk-row-state" />
        <By who={['me']} />
      </div>

      <div className="wk-reqs">
        <p className="wk-label">完成要求</p>
        <Row tone={r1[0]} name="导出到 Anki" state={r1[1]} who={r1[2]} />
        <Row tone={r2[0]} name="兼容旧数据" state={r2[1]} who={r2[2]} />
        <Row tone={r3[0]} name="手机排版" tag="必须由你验收" state={r3[1]} who={r3[2]} />
      </div>
    </div>
  );
}

/* ---------- 二屏：反馈、讨论、Coding、等你验收 ---------- */

const FEEDBACK: { who: string; text: string; tag: string; hot?: boolean }[] = [
  { who: '林', text: '长划线在手机上只显示一半', tag: '要紧 · 对上「手机排版」', hot: true },
  { who: 'A', text: 'iPhone 上看卡片，后半句被截掉了', tag: '要紧 · 对上「手机排版」', hot: true },
  { who: '可', text: '划线一长，手机上就看不全', tag: '要紧 · 对上「手机排版」', hot: true },
  { who: '乔', text: 'Anki 里的卡片能带上书名吗？', tag: '记成想法' },
  { who: '周', text: '能导出到 Notion 吗？', tag: '以后再看' },
  { who: 'M', text: '导出很顺，谢谢', tag: '不用回' },
];

function Note({ who, text, tag, hot }: (typeof FEEDBACK)[number]) {
  return (
    <div className="wk-ibx-row">
      <i className="wk-ava">{who}</i>
      <span className="wk-ibx-t">{text}</span>
      <em data-hot={hot || undefined}>{tag}</em>
    </div>
  );
}

/** Inbox：内测反馈进来，助理把对上要求的几条排到最上面，每条标好下一步 */
export function Inbox() {
  return (
    <div className="wk-ibx">
      <p className="wk-kicker">
        <InboxIcon aria-hidden="true" />
        Inbox
        <span className="wk-chip">
          <Ring tone="attention" />
          助理挑出 3 条要紧的
        </span>
      </p>
      <h3 className="wk-title">内测反馈</h3>
      <p className="wk-sub">这周 41 条</p>
      <div className="wk-ibx-list">
        <div className="wk-ibx-hot" data-f="inbox">
          {FEEDBACK.filter((note) => note.hot).map((note) => (
            <Note key={note.text} {...note} />
          ))}
        </div>
        {FEEDBACK.filter((note) => !note.hot).map((note) => (
          <Note key={note.text} {...note} />
        ))}
      </div>
    </div>
  );
}

/** 右栏的讨论：人和 AI 在一处说话，@ 一下就有人接 */
export function Talk() {
  const lines: { who: Who; name: string; text: ReactNode }[] = [
    { who: 'zh', name: '小周', text: '横屏看也一样，字太小了' },
    { who: 'ai', name: '助理', text: '和内测反馈里那 3 条是同一个问题，对应「手机排版」' },
    {
      who: 'me',
      name: '你',
      text: (
        <>
          <b>@Coding</b> 一起改了吧，改完给我看截图
        </>
      ),
    },
    { who: 'co', name: 'Coding', text: '接了。改完在手机宽度下点一遍，截图交回' },
  ];
  return (
    <div className="wk-talk" data-f="talk">
      {lines.map((line, index) => (
        <div key={line.name} className="wk-msg" style={{ '--i': index } as CSSProperties}>
          <By who={[line.who]} />
          <p>
            <b className="wk-msg-name">{line.name}</b>
            {line.text}
          </p>
        </div>
      ))}
    </div>
  );
}

/** 三张手机截图的缩略 */
function Shots() {
  return (
    <span className="wk-shots" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <i key={index}>
          <b />
          <b />
          <b />
        </i>
      ))}
    </span>
  );
}

const RUN: [string, ReactNode?][] = [
  ['读了目标「划线卡片 v1.1」和 3 条反馈'],
  [
    '改了 export/card.css',
    <pre key="diff" className="wk-diff">
      <span data-d="-">- white-space: nowrap;</span>
      <span data-d="+">+ overflow-wrap: anywhere;</span>
      <span data-d="+">+ line-height: 1.6;</span>
    </pre>,
  ],
  ['按手机宽度打开预览，点开 3 张长划线卡片'],
  ['截图 3 张，控制台没有报错'],
];

/** Coding：自带的写代码插件，改完自己在手机宽度下点开看一遍，截图交回 */
export function Coding() {
  return (
    <div className="wk-code">
      <p className="wk-kicker">
        <Code aria-hidden="true" />
        Coding
        <span className="wk-chip">
          <Ring tone="progress" />
          本轮执行 · 手机排版
        </span>
      </p>
      <h3 className="wk-title">长划线在手机上被截断</h3>
      <div className="wk-code-f" data-f="code">
        <div className="wk-run">
          {RUN.map(([text, more], index) => (
            <div key={text} className="wk-step" style={{ '--i': index } as CSSProperties}>
              <p>
                <b>✓</b>
                {text}
              </p>
              {more}
            </div>
          ))}
          <p className="wk-run-go">
            <span className="wk-btn" data-main="">
              交回截图
            </span>
          </p>
        </div>
        <div className="wk-phone">
          <p className="wk-phone-url">
            <Globe aria-hidden="true" />
            localhost:5173 · 390 宽
          </p>
          <div className="wk-phone-card">
            <p className="wk-phone-k">正面 · 1/3</p>
            <p className="wk-phone-q">真正的阅读，是读到一半停下来，把书合上，想一想刚才那句话为什么打动你。</p>
            <p className="wk-phone-k">背面</p>
            <p className="wk-phone-a">这一张要在手机上完整显示。</p>
          </div>
          <div className="wk-phone-card">
            <p className="wk-phone-k">正面 · 2/3</p>
            <p className="wk-phone-q">合上书的那几秒，比读完一整章更值得记下来。</p>
            <i className="wk-click" />
            <span className="wk-agent">Coding</span>
          </div>
          <div className="wk-phone-card">
            <p className="wk-phone-k">正面 · 3/3</p>
            <p className="wk-phone-q">下次翻开，从停下的那一句接着读。</p>
          </div>
          <i className="wk-flash" />
        </div>
      </div>
    </div>
  );
}

/** 等你：AI 交回来的，你看过点了才算 */
export function Wait() {
  return (
    <div className="wk-pop" data-k="wait" data-f="wait">
      <p className="wk-pop-h">
        <Ring tone="attention" />
        等你 1
      </p>
      <div className="wk-wait">
        <p className="wk-wait-t">
          <By who={['co']} />
          Coding 交回 3 张截图，等你验收「手机排版」
        </p>
        <Shots />
        <p className="wk-go">
          <span className="wk-btn" data-main="">
            验收
            <You />
          </span>
          <span className="wk-btn">再改改</span>
        </p>
      </div>
    </div>
  );
}

/* ---------- 三屏：发布说明、Shelf、新接上的工具、插件 ---------- */

const MENU = {
  a: ['改短一点', '拆成要点', '换个说法'],
  b: ['核对出处', '做成图表', '和上一版比'],
};

/** 选中的一处：字底下一层选区色，右边是助理按这一处给的几样 */
function Sel({ k, on, children }: { k: 'a' | 'b'; on: boolean; children: ReactNode }) {
  return (
    <div className="wk-sel" data-on={on || undefined}>
      <p className="wk-p">
        <span className="wk-sel-t">{children}</span>
        {on ? (
          <i className="wk-at">
            <You />
          </i>
        ) : null}
      </p>
      {on ? (
        <span className="wk-float">
          <Sparkles aria-hidden="true" />
          {MENU[k].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </span>
      ) : null}
    </div>
  );
}

/** 干着活，助理把要用的递过来 */
function Help() {
  return (
    <div className="wk-help" data-f="help">
      <p className="wk-help-h">
        <By who={['ai']} />
        助理
      </p>
      <p>内测记录里有一条：2,140 条划线一次导完，用了 58 秒。要放进这句吗？</p>
      <p className="wk-go">
        <span className="wk-btn" data-main="">
          放进去
        </span>
        <span className="wk-btn">不用</span>
      </p>
    </div>
  );
}

/** 页面：写发布说明。正写着，助理递来一条数据；选一句和选一行，助理给的不一样；截图从 Shelf 拿过来放下 */
export function Doc({ s }: { s: Shown }) {
  const help = s.over === 'help';
  return (
    <div className="wk-doc">
      <p className="wk-kicker">
        <FileText aria-hidden="true" />
        页面
      </p>
      <h3 className="wk-title">v1.1 发布说明</h3>
      <p className="wk-p">这一版可以把划线一键导出到 Anki：卡片正面是原文，背面是你的批注。</p>
      <div className="wk-sels" data-f="pick" data-sel={s.sel}>
        <Sel k="a" on={s.sel === 'a'}>
          长划线会按句子自动拆成几张卡，每张不超过 200 字，拆开以后仍按原来的顺序排好，复习时一张接一张出现。
        </Sel>
        {s.facts === 'typing' ? (
          <p className="wk-p">
            导出很快，
            <i className="wk-caret" />
          </p>
        ) : null}
        {help ? <Help /> : null}
        {s.facts === 'in' ? (
          <Sel k="b" on={s.sel === 'b'}>
            导出很快：内测时 2,140 条划线一次导完，用了 58 秒。
          </Sel>
        ) : null}
      </div>
      {s.shot ? (
        <figure className="wk-slot" data-s={s.shot} data-f={s.shot === 'lift' ? 'shelf' : undefined}>
          <Shots />
          <figcaption>手机上的长划线卡片</figcaption>
        </figure>
      ) : null}
      <p className="wk-p wk-p-mute">导出以后，在 Anki 里改过的卡片不会被下一次导出覆盖。</p>
    </div>
  );
}

/** 右栏的 Shelf：AI 做出来的东西都放这儿，拿起来放到哪页都行 */
export function Shelf({ s }: { s: Shown }) {
  const lift = s.shot === 'lift';
  return (
    <div className="wk-shelf">
      <div className="wk-shelf-item" data-lift={lift || undefined} data-f="shelf">
        <Shots />
        <span className="wk-shelf-t">
          <b>手机截图 · 3 张</b>
          <small>来自 Coding</small>
        </span>
        {lift ? <You /> : null}
      </div>
      {[
        ['doc', '内测反馈摘要', '来自 助理'],
        ['chart', '导出用时 · 图表', '来自 助理'],
        ['pdf', 'v1.0 说明.pdf', '你放的'],
      ].map(([kind, name, from]) => (
        <div key={name} className="wk-shelf-item">
          <i className="wk-thumb" data-k={kind} />
          <span className="wk-shelf-t">
            <b>{name}</b>
            <small>{from}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

/** 新接上的工具：授权一过，助理就在手边说它现在能做什么 */
export function NewTool() {
  return (
    <div className="wk-pop" data-k="mcp" data-f="mcp">
      <p className="wk-pop-h">
        <Plug aria-hidden="true" />
        新接上 AnkiConnect
        <em>MCP</em>
      </p>
      <p className="wk-new-t">
        <By who={['ai']} />
        现在能把这一版的卡片直接导进你的 Anki，不用先导出文件。
      </p>
      <p className="wk-go">
        <span className="wk-btn" data-main="">
          试一下
        </span>
        <span className="wk-btn">以后再说</span>
      </p>
    </div>
  );
}

const PLUGINS: [LucideIcon, string, string?][] = [
  [Target, '目标'],
  [InboxIcon, 'Inbox'],
  [Rss, 'Feed'],
  [Code, 'Coding'],
  [Archive, 'Shelf'],
  [FileText, 'Pages'],
  [Workflow, '工作流程'],
  [ListChecks, '发布前检查台', '你做的'],
  [Plug, 'AnkiConnect', '刚接上'],
];

/** 插件：装了哪些、哪个是你自己做的；缺的说一句就做一个 */
export function Plugins() {
  return (
    <div className="wk-pop" data-k="dock" data-f="grow">
      <p className="wk-pop-h">插件 · 已装 {PLUGINS.length} 个</p>
      <div className="wk-plug">
        {PLUGINS.map(([Icon, name, tag]) => (
          <p key={name} data-tag={tag ? '' : undefined}>
            <Icon aria-hidden="true" />
            {name}
            {tag ? <em>{tag}</em> : null}
          </p>
        ))}
      </div>
      <div className="wk-make">
        <p className="wk-make-h">
          <Sparkles aria-hidden="true" />
          插件创作工作台
        </p>
        <p className="wk-make-say">
          每周五，把内测反馈整理成一页
          <i className="wk-caret" />
        </p>
        <p className="wk-go">
          <span className="wk-btn" data-main="">
            做一个
          </span>
        </p>
      </div>
    </div>
  );
}

/* ---------- 右栏、整扇窗 ---------- */

/** 右栏的记录：这件事谁在哪天做了什么 */
function Log({ s }: { s: Shown }) {
  const records: { day: string; who: Who[]; text: string; f?: string; on: boolean }[] = [
    { day: '周一', who: ['me', 'cc'], text: '定下 3 条要求', on: true },
    { day: '周二', who: ['ai'], text: '3 条内测反馈对上「手机排版」', on: s.step >= 1 },
    { day: '周二', who: ['co'], text: '改了 export/card.css，交回 3 张截图', f: 'fix', on: s.step >= 3 },
    { day: '周二', who: ['me'], text: '看过截图，验收手机排版', f: 'fix', on: s.step >= 5 },
    { day: '周三', who: ['cc'], text: '导出做完，测试 14/14', on: s.step >= 5 },
  ];
  return records
    .filter((record) => record.on)
    .map((record) => (
      <div key={record.text} className="wk-rec" data-f={record.f}>
        <span className="wk-rec-day">{record.day}</span>
        <By who={record.who} />
        <span className="wk-rec-t">{record.text}</span>
      </div>
    ));
}

const SIDES: [Side, string][] = [
  ['log', '记录'],
  ['talk', '讨论'],
  ['shelf', 'Shelf'],
];

/** 右栏：记录、讨论、Shelf 三栏，一次开一栏 */
export function Rail({ s }: { s: Shown }) {
  return (
    <div className="wk-rail">
      <p className="wk-rail-h">
        {SIDES.map(([id, name]) => (
          <span key={id} data-on={s.side === id || undefined}>
            {name}
          </span>
        ))}
      </p>
      <div className="wk-side" data-on={s.side === 'log' || undefined}>
        <Log s={s} />
      </div>
      <div className="wk-side" data-on={s.side === 'talk' || undefined}>
        <Talk />
      </div>
      <div className="wk-side" data-on={s.side === 'shelf' || undefined}>
        <Shelf s={s} />
      </div>
    </div>
  );
}

const TABS: [View, LucideIcon, string][] = [
  ['goal', Target, '划线卡片'],
  ['inbox', InboxIcon, '内测反馈'],
  ['code', Code, 'Coding'],
  ['doc', FileText, '发布说明'],
];

/** 整扇窗：顶上标签页，中间工作面和右栏，底下输入条；浮着的几张卡按这一拍出来 */
export function Window({ s }: { s: Shown }) {
  return (
    <>
      <div className="wk-top">
        <span className="wk-nav" aria-hidden="true">
          <ArrowLeft />
          <ArrowRight />
        </span>
        {TABS.map(([id, Icon, name]) => (
          <span key={id} className="wk-tab" data-on={s.view === id || undefined}>
            <Icon aria-hidden="true" />
            {name}
          </span>
        ))}
        <Plus className="wk-top-plus" aria-hidden="true" />
      </div>

      <div className="wk-body">
        <div className="wk-card">
          <div className="wk-pane" data-on={s.view === 'goal' || undefined}>
            <Goal s={s} />
          </div>
          <div className="wk-pane" data-on={s.view === 'inbox' || undefined}>
            <Inbox />
          </div>
          <div className="wk-pane" data-on={s.view === 'code' || undefined}>
            <Coding />
          </div>
          <div className="wk-pane" data-on={s.view === 'doc' || undefined}>
            <Doc s={s} />
          </div>
        </div>
        <Rail s={s} />
      </div>

      <div className="wk-bar">
        <span className="wk-dock" data-on={s.over === 'dock' || undefined}>
          <Blocks aria-hidden="true" />
          插件
        </span>
        <span className="wk-input">
          让助理做点什么，或按 ⌘K 搜索
          <Send aria-hidden="true" />
        </span>
        <span className="wk-wait-chip" data-on={s.step === 4 || undefined}>
          <Ring tone="attention" />
          等你 1
        </span>
        <PanelRight className="wk-bar-ic" aria-hidden="true" />
        <span className="wk-me">M</span>
      </div>

      <div className="wk-over" data-on={s.over === 'wait' || undefined}>
        <Wait />
      </div>
      <div className="wk-over" data-on={s.over === 'mcp' || undefined}>
        <NewTool />
      </div>
      <div className="wk-over" data-on={s.over === 'dock' || undefined}>
        <Plugins />
      </div>
    </>
  );
}

/* ---------- 窗外：你自己的终端、新开的对话、几个插件里的助理 ---------- */

export type TermId = 'u1';

const TERM: Record<TermId, { name: string; lines: [string, string][] }> = {
  u1: {
    name: 'Claude Code',
    lines: [
      ['›', '把划线卡片 v1.1 要做到什么，记进 Molis'],
      ['✓', '建好目标「划线卡片 v1.1」· 3 条要求'],
    ],
  },
};

export function Lines({ lines }: { lines: [string, string][] }) {
  return lines.map(([mark, text], index) => (
    <p key={text} className="wk-term-l" data-ok={mark === '✓' || undefined} style={{ '--i': index } as CSSProperties}>
      <b>{mark}</b>
      {text}
    </p>
  ));
}

export function Term({ id, on = true }: { id: TermId; on?: boolean }) {
  const term = TERM[id];
  return (
    <div className="wk-term" data-id={id} data-on={on || undefined} aria-hidden="true">
      <p className="wk-term-h">
        <i />
        <i />
        <i />
        {term.name}
      </p>
      <Lines lines={term.lines} />
    </div>
  );
}

/** 四屏能上手的那一处：换一家 AI 接着做，终端换了，读到的还是这一页 */
export const AIS = ['Claude Code', 'Codex', 'OpenCode'] as const;
export type Ai = (typeof AIS)[number];

export const PICKUP: [string, string][] = [
  ['›', '接着做划线卡片'],
  ['', '读了 Molis 里的目标「划线卡片 v1.1」'],
  ['', '定过的事：划线只存本地，不上云'],
  ['', '做到哪：导出做完，兼容旧数据在做'],
  ['', '手机排版你验过了，不再动'],
  ['✓', '接着做「兼容旧数据」'],
];

/** 新开的对话：同一件事要从头讲一遍，AI 还要再问 */
export function Chat({ on = true }: { on?: boolean }) {
  return (
    <div className="wk-chat" data-on={on || undefined}>
      <div className="wk-chat-card" aria-hidden="true">
        <p className="wk-chat-h">新对话</p>
        <p className="wk-chat-me">
          接着做划线卡片的导出。先说一下：划线只存本地，不上云；要求有三条，导出已经做完，兼容旧数据还在做，手机排版我验过了，别再动。上回改的是
          export/ 下面那几个文件……
        </p>
        <p className="wk-chat-ai">
          <i>✦</i>
          好的。「兼容旧数据」要做到哪一步？手机排版是在哪台手机上验的？
        </p>
      </div>
      <p className="wk-chat-note">{workWhy.chat}</p>
    </div>
  );
}

const KINDS: { icon: LucideIcon; name: string; item: string; say: string }[] = [
  { icon: Rss, name: 'Feed', item: '一篇讲 Anki 卡片模板的文章', say: '值得收：和「导出到 Anki」有关' },
  { icon: InboxIcon, name: 'Inbox', item: '长划线在手机上只显示一半', say: '对上「手机排版」，交给 Coding' },
  { icon: Workflow, name: '工作流程 · 发布前', item: 'v1.1 准备发布', say: '先拦下：「兼容旧数据」还没做完' },
];

/** 同一个助理，在不同插件里判断的事不一样 */
export function Kinds({ on = true }: { on?: boolean }) {
  return (
    <div className="wk-kinds" data-on={on || undefined}>
      <div className="wk-kinds-list" aria-hidden="true">
        {KINDS.map(({ icon: Icon, name, item, say }, index) => (
          <div key={name} className="wk-kind" style={{ '--i': index } as CSSProperties}>
            <p className="wk-kind-h">
              <Icon aria-hidden="true" />
              {name}
            </p>
            <p className="wk-kind-item">{item}</p>
            <p className="wk-kind-say">
              <Sparkles aria-hidden="true" />
              {say}
            </p>
          </div>
        ))}
      </div>
      <p className="wk-chat-note">{workHand.notes.kinds}</p>
    </div>
  );
}
