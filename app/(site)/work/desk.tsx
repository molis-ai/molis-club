import { ArrowLeft, ArrowRight, FileText, PanelRight, Plus, Send, Target } from 'lucide-react';
import type { CSSProperties } from 'react';
import { workWhy } from '../../../content/site/work';

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

type Who = 'me' | 'cc' | 'cx';
const MARK: Record<Who, string> = { me: '你', cc: 'CC', cx: 'Cx' };

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

/** 窗里此刻的样子：哪个标签页、Codex 接手没有、过了几天没有、换一家 AI 时读到的几行亮哪一套 */
export type Shown = {
  tab: 'goal' | 'doc';
  codex: boolean;
  later: boolean;
  read?: 'a' | 'b';
};

/** 目标：一件定过的事、三条完成要求 */
export function Goal({ s }: { s: Shown }) {
  const r1: [Tone, string] = s.later ? ['done', 'Agent 报告 · 测试 14/14'] : s.codex ? ['progress', '在做'] : ['idle', '待开始'];
  const r2: [Tone, string] = s.codex ? ['progress', '在做'] : ['idle', '待开始'];
  const r3: [Tone, string] = s.later ? ['done', '你验过 · 真机看过'] : ['idle', '待验收'];
  return (
    <div className="wk-goal" data-f="goal" data-read={s.read}>
      <div className="wk-head" data-f="head">
        <p className="wk-kicker">
          <Target aria-hidden="true" />
          目标
          <span className="wk-chip">
            <Ring tone="progress" />
            {s.later ? '完成要求 2/3 已满足' : '正在推进'}
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
        <Row tone={r1[0]} name="导出到 Anki" state={r1[1]} who={s.codex ? ['cx'] : undefined} />
        <Row tone={r2[0]} name="兼容旧数据" state={r2[1]} who={s.codex ? ['cx'] : undefined} />
        <Row tone={r3[0]} name="手机排版" tag="必须由你验收" state={r3[1]} who={s.later ? ['me'] : undefined} />
      </div>
    </div>
  );
}

/** 页面：在评论里叫 AI，它给出改法，换不换由你点 */
export function Doc() {
  return (
    <div className="wk-doc">
      <p className="wk-kicker">
        <FileText aria-hidden="true" />
        页面
      </p>
      <h3 className="wk-title">v1.1 发布说明</h3>
      <p className="wk-p">这一版可以把划线一键导出到 Anki：卡片正面是原文，背面是你的批注。</p>
      <div className="wk-doc-f" data-f="doc">
        <p className="wk-p">
          <mark>长划线会按句子自动拆成几张卡，每张不超过 200 字，拆开以后仍按原来的顺序排好，复习时一张接一张出现。</mark>
        </p>
        <div className="wk-thread">
          <p>
            <By who={['me']} />
            @助理 这段太长，能短一点吗？
          </p>
          <p>
            <span className="wk-by">
              <i data-w="ai">助</i>
            </span>
            可以改成：「长划线会自动拆成几张卡，顺序不变。」
          </p>
          <p className="wk-thread-go">
            <span className="wk-btn" data-main="">
              换上
            </span>
            <span className="wk-btn">不用</span>
          </p>
        </div>
      </div>
      <p className="wk-p wk-p-mute">导出以后，在 Anki 里改过的卡片不会被下一次导出覆盖。</p>
    </div>
  );
}

/** 右栏：这件事的记录，谁在哪天做了什么 */
export function Rail({ s }: { s: Shown }) {
  const records: { day: string; who: Who[]; text: string; f?: string }[] = [
    { day: '周一', who: ['me', 'cc'], text: '定下 3 条要求' },
    ...(s.codex ? [{ day: '周二', who: ['cx'] as Who[], text: '读了这一页，接着做导出', f: 'rec2' }] : []),
    ...(s.later
      ? [
          { day: '周三', who: ['cx'] as Who[], text: '导出做完，改了 export/ 下 4 个文件', f: 'wed' },
          { day: '周三', who: ['me'] as Who[], text: '真机看过手机排版，记下验收', f: 'wed' },
        ]
      : []),
  ];
  return (
    <div className="wk-rail">
      <p className="wk-rail-h">记录</p>
      {records.map((record, index) => (
        <div key={record.text} className="wk-rec" data-f={record.f} style={{ '--i': index } as CSSProperties}>
          <span className="wk-rec-day">{record.day}</span>
          <By who={record.who} />
          <span className="wk-rec-t">{record.text}</span>
        </div>
      ))}
    </div>
  );
}

/** 整扇窗：顶上标签页，中间工作面和记录，底下输入条 */
export function Window({ s }: { s: Shown }) {
  return (
    <>
      <div className="wk-top">
        <span className="wk-nav" aria-hidden="true">
          <ArrowLeft />
          <ArrowRight />
        </span>
        <span className="wk-tab" data-on={s.tab === 'goal' || undefined}>
          <Target aria-hidden="true" />
          划线卡片
        </span>
        <span className="wk-tab" data-on={s.tab === 'doc' || undefined}>
          <FileText aria-hidden="true" />
          发布说明
        </span>
        <Plus className="wk-top-plus" aria-hidden="true" />
      </div>

      <div className="wk-body">
        <div className="wk-card">
          <div className="wk-pane" data-on={s.tab === 'goal' || undefined}>
            <Goal s={s} />
          </div>
          <div className="wk-pane" data-on={s.tab === 'doc' || undefined}>
            <Doc />
          </div>
        </div>
        <Rail s={s} />
      </div>

      <div className="wk-bar">
        <span className="wk-dock">
          <Target aria-hidden="true" />
          目标
        </span>
        <span className="wk-input">
          让助理做点什么，或按 ⌘K 搜索
          <Send aria-hidden="true" />
        </span>
        <PanelRight className="wk-bar-ic" aria-hidden="true" />
        <span className="wk-me">M</span>
      </div>
    </>
  );
}

/* ---------- 窗外：你自己的终端、新开的对话 ---------- */

export type TermId = 'u1' | 'u2';

const TERM: Record<TermId, { name: string; lines: [string, string][] }> = {
  u1: {
    name: 'Claude Code',
    lines: [
      ['›', '把划线卡片 v1.1 要做到什么，记进 Molis'],
      ['✓', '建好目标「划线卡片 v1.1」· 3 条要求'],
    ],
  },
  u2: {
    name: 'Codex',
    lines: [
      ['›', '接着做划线卡片'],
      ['', '读了 Molis 里的目标：3 条要求、1 件定过的事'],
      ['✓', '开始做「导出到 Anki」'],
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

/** 三屏能上手的那一处：换一家 AI 接着做，终端换了，读到的还是这一页 */
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
