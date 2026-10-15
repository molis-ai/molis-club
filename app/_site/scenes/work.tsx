'use client';
import {
  BookOpen,
  CalendarDays,
  Check,
  FileText,
  Inbox,
  ListTodo,
  MessagesSquare,
  Moon,
  NotebookPen,
  Presentation,
  Puzzle,
  Quote,
  Rss,
  Search,
  SquareCode,
  Table2,
  Target,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { at, Canvas, Cursor, type Scene } from '../demo/demo';
import './work.css';

// Molis Work 的演示画面：一份「行业观察报告」走三天。像一张真的工作台：木色的侧栏、植物绿的成功与插件。
// 首页舞台用其中五段（每段约 3.5 秒），Work 页按章节用全部八段（滚到哪一步演到哪一步）。
// 画面里的项目、资料、人名、时间都是示意数据，不代表已上线的功能；各段的阶段标注见 note。
// 待负责人确认：第 4、6、8 段（多插件接力、讨论、你不在时）的文案与阶段标注是本轮新写的，
// 按 Work 仓库现状标注：讨论（群聊 + 话题）首版已实现、未公开部署、AI 暂不参与群聊；主动提醒在开发版；插件创作台为预览。

const Tick = ({ step, delay }: { step: number; delay?: number }) => (
  <i className="m-tick" style={at(step, undefined, delay)}>
    <Check strokeWidth={3} aria-hidden="true" />
  </i>
);

type Tool = { id: string; name: string; icon: LucideIcon };

const projectTools: Tool[] = [
  { id: 'files', name: '资料', icon: BookOpen },
  { id: 'feed', name: '信息流', icon: Rss },
  { id: 'doc', name: '文档', icon: FileText },
  { id: 'table', name: '数据表', icon: Table2 },
  { id: 'deck', name: '汇报', icon: Presentation },
  { id: 'talk', name: '讨论', icon: MessagesSquare },
];

const personal: Tool[] = [
  { id: 'calendar', name: '日历', icon: CalendarDays },
  { id: 'notes', name: '笔记', icon: NotebookPen },
  { id: 'todo', name: '待办', icon: ListTodo },
];

/** 工作台的外框：左边木色侧栏（项目里的工具 + 个人的日历、笔记、待办），右边是正在做的事 */
function Desk({
  step,
  name,
  active,
  tools = projectTools,
  extra,
  children,
  className = '',
  press,
}: {
  step: number;
  name: string;
  active?: string;
  tools?: Tool[];
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
  press?: number[];
}) {
  return (
    <Canvas step={step} className={`wk ${className}`} press={press}>
      <div className="m-sc-win wk-win">
        <aside className="wk-side">
          <p className="wk-project">
            <span className="m-dot" />
            行业观察报告
          </p>
          <ul>
            {tools.map((tool) => (
              <li key={tool.id} data-on={tool.id === active || undefined}>
                <tool.icon aria-hidden="true" />
                {tool.name}
              </li>
            ))}
            {extra}
          </ul>
          <p className="wk-side-label">个人</p>
          <ul className="wk-personal">
            {personal.map((tool) => (
              <li key={tool.id}>
                <tool.icon aria-hidden="true" />
                {tool.name}
              </li>
            ))}
          </ul>
        </aside>
        <div className="wk-main">
          <p className="wk-crumb">
            <span>{name}</span>
          </p>
          {children}
        </div>
      </div>
    </Canvas>
  );
}

/* ---------- 开场：散在各处的碎片，收拢进同一张工作台 ---------- */
const scatter: Scene = {
  id: 'work-scatter',
  label:
    'Molis Work 示意：浏览器标签、聊天、文档、待办里的碎片，收拢进同一个项目。',
  steps: 3,
  times: [0, 1.2, 2.4, 3.6],
  note: '界面示意',
  render: ({ step }) => (
    <Canvas step={step} className="wk wk-scatter">
      <div className="wk-bits">
        <span className="wk-bit" data-k="tab">
          <Rss aria-hidden="true" />3 个浏览器标签 · 行业新闻
        </span>
        <span className="wk-bit" data-k="chat">
          <MessagesSquare aria-hidden="true" />
          聊天里的一句：「周四前给初稿」
        </span>
        <span className="wk-bit" data-k="doc">
          <FileText aria-hidden="true" />
          报告草稿 v2.docx
        </span>
        <span className="wk-bit" data-k="ai">
          <SquareCode aria-hidden="true" />
          昨天的 AI 会话
        </span>
        <span className="wk-bit" data-k="todo">
          <ListTodo aria-hidden="true" />
          待办：补三家对比
        </span>
      </div>
      <div className="m-sc-win wk-gather m-v" data-pop="" style={at(2)}>
        <p className="wk-project">
          <span className="m-dot" />
          行业观察报告
        </p>
        <ul>
          <li>
            <Rss aria-hidden="true" />
            信息流 · 3 个来源
          </li>
          <li>
            <FileText aria-hidden="true" />
            文档 · 报告草稿
          </li>
          <li>
            <ListTodo aria-hidden="true" />
            待办 · 补三家对比 · 周四
          </li>
          <li>
            <SquareCode aria-hidden="true" />
            会话记录 · 接着昨天
          </li>
        </ul>
      </div>
    </Canvas>
  ),
};

/* ---------- 按这段工作的需要，布置工作台 ---------- */
const arrange: Scene = {
  id: 'work-arrange',
  label:
    'Molis Work 示意：给项目装上资料、信息流和文档；个人的日历、笔记、待办始终都在；搜一个词，各工具里的结果一起出来。',
  steps: 3,
  times: [0, 1.2, 2.4, 3.8],
  note: '界面示意',
  render: ({ step }) => (
    <Desk
      step={step}
      name="项目 · 布置工具"
      tools={[]}
      extra={projectTools.slice(0, 3).map((tool, index) => (
        <li
          key={tool.id}
          className="m-v"
          style={at(0, undefined, index * 140)}
          data-new={step === 0 || undefined}
        >
          <tool.icon aria-hidden="true" />
          {tool.name}
        </li>
      ))}
      className="wk-arrange"
    >
      <div className="wk-shelf m-v" data-fade="" style={at(0, 2)}>
        <p className="m-mini">为这段工作选工具</p>
        <div className="wk-shelf-grid">
          {[...projectTools.slice(0, 3), ...projectTools.slice(3)].map(
            (tool, index) => (
              <span key={tool.id} data-picked={index < 3 || undefined}>
                <tool.icon aria-hidden="true" />
                {tool.name}
                {index < 3 ? <Tick step={0} delay={index * 140} /> : null}
              </span>
            ),
          )}
        </div>
        <p className="m-mini m-v" style={at(1)}>
          日历、笔记、待办是你个人的，换项目也跟着你。
        </p>
      </div>
      <div className="wk-search m-v" data-fade="" style={at(2)}>
        <p className="wk-search-box">
          <Search aria-hidden="true" />
          储能
        </p>
        <ul>
          <li>
            <Rss aria-hidden="true" />
            <span>
              <b>储能</b>出货量季度数据
            </span>
            <small>信息流</small>
          </li>
          <li>
            <FileText aria-hidden="true" />
            <span>
              第二节 · <b>储能</b>价格走势
            </span>
            <small>文档</small>
          </li>
          <li>
            <NotebookPen aria-hidden="true" />
            <span>
              访谈笔记：<b>储能</b>客户
            </span>
            <small>笔记</small>
          </li>
        </ul>
      </div>
    </Desk>
  ),
};

/* ---------- 你和 AI，接着同一份内容工作 ---------- */
const together: Scene = {
  id: 'work-together',
  label:
    'Molis Work 示意：写到一半的方案，助理接着当前内容整理提纲，改动高亮；你点「接手」，自己改一句。',
  steps: 4,
  times: [0, 0.7, 1.7, 2.6, 3.6],
  note: '界面示意',
  render: ({ step }) => (
    <Desk
      step={step}
      name="文档 · 行业观察报告"
      active="doc"
      className="wk-together"
      press={[2]}
    >
      <div className="wk-doc">
        <p className="wk-doc-title">行业观察报告（草稿）</p>
        <span className="m-ln" style={{ width: '92%' }} />
        <span className="m-ln" style={{ width: '78%' }} />
        <p className="wk-ai m-v" style={at(1)}>
          <span className="m-chip" data-tone="accent">
            助理
          </span>
          按当前内容整理了提纲
        </p>
        <ol className="wk-outline">
          <li className="m-hl" style={at(1, undefined, 0)}>
            一、今年市场的三个变化
          </li>
          <li className="m-hl" style={at(1, undefined, 160)}>
            二、三家公司的做法对比
          </li>
          <li>
            <span className="m-stack">
              <span className="m-hl m-v" data-fade="" style={at(1, 3, 320)}>
                三、建议
              </span>
              <span className="m-v wk-mine" data-fade="" style={at(3)}>
                三、我们的判断：先看价格，再看渠道
              </span>
            </span>
            <span className="m-chip wk-you m-v" style={at(3)}>
              你改了这一句
            </span>
          </li>
        </ol>
        <p className="wk-handoff">
          <span className="wk-take" data-on={step >= 2 || undefined}>
            接手
            <Cursor show={at(2, 3)} x="60%" y="55%" />
          </span>
          <span className="m-mini m-v" style={at(2)}>
            现在由你编辑 · 助理的改动都留着
          </span>
        </p>
      </div>
    </Desk>
  ),
};

/* ---------- 助理用插件把事情做完（新写，待负责人确认） ---------- */
const relay: Scene = {
  id: 'work-relay',
  label:
    'Molis Work 示意：助理从信息流取三篇资料，在数据表里做成对比，再生成一页汇报，三样成果带着来源落进项目。',
  steps: 4,
  times: [0, 0.8, 1.7, 2.6, 3.6],
  note: '界面示意',
  render: ({ step }) => (
    <Desk step={step} name="助理 · 接着做完" className="wk-relay">
      <div className="wk-chain">
        <div className="wk-card" data-on={step === 0 || undefined}>
          <p>
            <Rss aria-hidden="true" />
            信息流
          </p>
          <ul>
            {['A 公司季报', 'B 公司发布会', 'C 行业报告'].map((item, i) => (
              <li key={item} className="m-hl" style={at(0, undefined, i * 160)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="wk-card m-v" data-pop="" style={at(1)}>
          <p>
            <Table2 aria-hidden="true" />
            数据表
          </p>
          <table>
            <tbody>
              {[
                ['', '价格', '渠道'],
                ['A', '↓', '线上'],
                ['B', '→', '经销'],
                ['C', '↑', '直营'],
              ].map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="wk-card m-v" data-pop="" style={at(2)}>
          <p>
            <Presentation aria-hidden="true" />
            汇报
          </p>
          <div className="wk-slide">
            <span>第 2 页</span>
            <b>三家对比</b>
            <i />
            <i />
          </div>
        </div>
      </div>
      <ul className="wk-results m-v" style={at(3)}>
        <li>
          <Tick step={3} />
          资料摘录 3 篇<small>来源已附</small>
        </li>
        <li>
          <Tick step={3} delay={120} />
          对比表 1 张<small>来源已附</small>
        </li>
        <li>
          <Tick step={3} delay={240} />
          汇报 1 页<small>来源已附</small>
        </li>
      </ul>
    </Desk>
  ),
};

/** Work 页上这一章更长：再约一场评审、留一条跟进 */
const relayMore: Scene = {
  ...relay,
  id: 'work-relay-more',
  label:
    'Molis Work 示意：信息流、数据表、汇报接力做完，再在日历上约评审、在待办里留跟进；成果都在项目里，都有来源。',
  steps: 4,
  render: ({ step }) => (
    <Desk step={step} name="助理 · 接着做完" className="wk-relay wk-relay-more">
      <div className="wk-chain">
        <div className="wk-card">
          <p>
            <Rss aria-hidden="true" />
            信息流
          </p>
          <ul>
            {['A 公司季报', 'B 公司发布会', 'C 行业报告'].map((item, i) => (
              <li key={item} className="m-hl" style={at(0, undefined, i * 160)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="wk-card m-v" data-pop="" style={at(1)}>
          <p>
            <Table2 aria-hidden="true" />
            数据表 → 汇报
          </p>
          <div className="wk-slide">
            <span>第 2 页</span>
            <b>三家对比</b>
            <i />
            <i />
          </div>
        </div>
        <div className="wk-card m-v" data-pop="" style={at(2)}>
          <p>
            <CalendarDays aria-hidden="true" />
            日历
          </p>
          <p className="wk-event">
            周四 15:00
            <b>报告评审</b>
          </p>
        </div>
        <div className="wk-card m-v" data-pop="" style={at(2, undefined, 200)}>
          <p>
            <ListTodo aria-hidden="true" />
            待办
          </p>
          <p className="wk-event">
            评审后
            <b>补上 D 公司的数据</b>
          </p>
        </div>
      </div>
      <p className="wk-proof m-v" style={at(3)}>
        <Tick step={3} />
        五样成果都在「行业观察报告」里，每一样都能点回来源。
      </p>
    </Desk>
  ),
};

/* ---------- 工作台也可以长出你自己的工具（预览） ---------- */
const grow: Scene = {
  id: 'work-grow',
  label:
    'Molis Work 示意：你说一句需要，一个插件被做出来、过检查，装进工作台成为一块界面，助理也能用它。插件创作台还在预览。',
  steps: 4,
  times: [0, 0.7, 1.6, 2.6, 3.6],
  note: '预览 · 界面示意',
  render: ({ step }) => (
    <Desk
      step={step}
      name="插件创作台"
      className="wk-grow"
      extra={
        <li className="m-v wk-grown" style={at(3)}>
          <Puzzle aria-hidden="true" />
          评审记录表
          <span className="m-chip" data-tone="green">
            新
          </span>
        </li>
      }
    >
      <p className="wk-ask">
        <span className="m-chip" data-tone="line">
          你
        </span>
        做一张评审记录表：按人记意见，标出要改的地方。
      </p>
      <div className="wk-build m-v" style={at(1)}>
        <p className="wk-build-head">
          <Puzzle aria-hidden="true" />
          <b>评审记录表</b>
          <span className="m-mini">插件</span>
        </p>
        <ul>
          <li>
            <Tick step={1} />
            Agent 给出方案
          </li>
          <li>
            <Tick step={2} />
            在沙箱里做出来
          </li>
          <li>
            <Tick step={2} delay={300} />
            检查与验收通过
          </li>
        </ul>
        <span className="m-bar" style={at(2)} />
      </div>
      <p className="wk-grow-done m-v" style={at(3)}>
        已装进项目 · 助理和获授权的 Agent 也能调用它
      </p>
    </Desk>
  ),
};

/* ---------- 一起讨论，上下文和成果都接得上（新写，待负责人确认） ---------- */
const talk: Scene = {
  id: 'work-talk',
  label:
    'Molis Work 示意：右侧「讨论」里，同事引用那页汇报开了一个话题；结论回到项目，谁接着做都看得到前因后果。',
  steps: 4,
  times: [0, 0.6, 1.6, 2.6, 3.6],
  note: '界面示意',
  render: ({ step }) => (
    <Desk step={step} name="汇报 · 第 2 页" active="deck" className="wk-talk">
      <div className="wk-talk-grid">
        <div className="wk-slide wk-slide-big">
          <span>第 2 页</span>
          <b>三家对比</b>
          <i />
          <i />
          <i />
        </div>
        <div className="wk-thread">
          <p className="wk-thread-head">
            <MessagesSquare aria-hidden="true" />
            讨论
          </p>
          <div className="wk-msg m-v" style={at(0)}>
            <span className="wk-face">周</span>
            <div>
              <p className="wk-quote">
                <Quote aria-hidden="true" />
                汇报 · 第 2 页「三家对比」
              </p>
              <p>价格这一列，要不要放进正式结论？</p>
            </div>
          </div>
          <p className="m-chip m-v" style={at(1)}>
            话题 · 价格要不要进结论
          </p>
          <div className="wk-msg m-v" style={at(1, undefined, 220)}>
            <span className="wk-face" data-me="">
              你
            </span>
            <p>放，周四评审前补上 D 公司。</p>
          </div>
          <p className="wk-conclusion m-v" style={at(2)}>
            <b>结论</b> 价格进结论，评审前补 D 公司
          </p>
        </div>
      </div>
      <p className="wk-proof m-v" style={at(3)}>
        <Tick step={3} />
        结论回到项目：谁接着做，都看得到这个话题和那一页。
      </p>
    </Desk>
  ),
};

/* ---------- 工作做到哪里，有记录，也有依据 ---------- */
const goal: Scene = {
  id: 'work-goal',
  label:
    'Molis Work 示意：Goal 记着目标、进展、问题和待决定的事；换成 Codex 或 Claude Code，也读同一份记录接着做；收尾时逐条核对。',
  steps: 3,
  times: [0, 1.2, 2.4, 3.8],
  note: '界面示意',
  render: ({ step }) => (
    <Desk step={step} name="Goal · 周四交付报告初稿" className="wk-goal">
      <dl className="wk-goal-list">
        <div>
          <dt>
            <Target aria-hidden="true" />
            目标
          </dt>
          <dd>周四交付报告初稿，三家对比要有来源</dd>
        </div>
        <div>
          <dt>进展</dt>
          <dd>第一、二节完成；第三节写了一半</dd>
        </div>
        <div>
          <dt>问题</dt>
          <dd>C 公司的数据口径和另两家不同</dd>
        </div>
        <div>
          <dt>待决定</dt>
          <dd>
            <span className="m-chip" data-tone="accent">
              等你
            </span>
            价格要不要进结论
          </dd>
        </div>
      </dl>
      <p className="wk-agent m-v" style={at(1, 2)}>
        <SquareCode aria-hidden="true" />
        <span>
          换到 <b>Claude Code</b>：读同一份记录，从第三节接着写
        </span>
      </p>
      <ul className="wk-check m-v" style={at(2)}>
        <li>
          <Tick step={2} />
          三家对比都有来源
        </li>
        <li>
          <Tick step={2} delay={150} />
          结论与周四的要求一致
        </li>
        <li>
          <i className="m-tick" style={at(99)} />
          C 公司口径待你确认
        </li>
      </ul>
    </Desk>
  ),
};

/* ---------- 你不在的时候，助理接着干（新写，待负责人确认；开发中） ---------- */
const away: Scene = {
  id: 'work-away',
  label:
    'Molis Work 示意：你下线以后，助理按 Goal 跟进到期的事；第二天只把需要你决定的一件留在 Inbox，写明原因。主动跟进还在开发中。',
  steps: 4,
  times: [0, 0.8, 1.7, 2.6, 3.6],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Canvas step={step} className="wk wk-away">
      <div className="m-sc-win wk-night">
        <p className="wk-off">
          <Moon aria-hidden="true" />
          你已下线 · 22:40
          <span className="m-mini">勿扰时段不发提醒</span>
        </p>
        <ol className="wk-night-log">
          <li className="m-v" style={at(1)}>
            <Tick step={1} />
            <span>
              23:10 跟进到期：C 公司更新了数据<small>已写进第三节草稿</small>
            </span>
          </li>
          <li className="m-v" style={at(1, undefined, 260)}>
            <Tick step={1} delay={260} />
            <span>
              02:30 导出失败一次<small>已重试成功，留了记录</small>
            </span>
          </li>
          <li className="m-v" style={at(2)}>
            <span className="m-tick" style={at(99)} />
            <span>
              07:00 D 公司昨晚发布了新版本
              <small>要不要加进报告，需要你定</small>
            </span>
          </li>
        </ol>
      </div>
      <div className="m-sc-win wk-inbox m-v" data-pop="" style={at(3)}>
        <p className="wk-inbox-head">
          <Inbox aria-hidden="true" />
          Inbox · 第二天 9:00
          <span className="m-chip" data-tone="accent">
            1 件等你决定
          </span>
        </p>
        <p className="wk-inbox-q">要不要把 D 公司加进报告？</p>
        <p className="m-mini">
          原因：它昨晚发布了新版本，会影响第二节的结论。其余两件已处理，记录在
          Goal 里。
        </p>
        <p className="wk-inbox-act">
          <span className="m-chip" data-tone="ink">
            加进去
          </span>
          <span className="m-chip" data-tone="line">
            先不加
          </span>
        </p>
      </div>
    </Canvas>
  ),
};

/** 首页舞台的五段（spec 第 4 节 3） */
export const workHomeSegments = [
  { title: '你和 AI，接着同一份内容工作。', scene: together },
  // 待负责人确认：新写的一段
  { title: '助理调用几个插件，把事情接着做完。', scene: relay },
  { title: '工作台也可以长出你自己的工具。', scene: grow, tag: '预览' },
  // 待负责人确认：新写的一段与阶段标注
  {
    title: '一起讨论，上下文和成果都接得上。',
    scene: talk,
    tag: '首版已实现 · 未公开部署',
  },
  // 待负责人确认：新写的一段
  { title: '你不在的时候，助理接着干。', scene: away, tag: '开发中' },
];

export const workScenes = {
  scatter,
  arrange,
  together,
  relay: relayMore,
  grow,
  talk,
  goal,
  away,
};
