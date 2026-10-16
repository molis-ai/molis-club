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
import { copy } from '../../../content/site/copy';
import type { workScene } from '../../../content/site/scenes';
import { at, Canvas, Cursor, type Scene } from '../demo/demo';
import type { Segment } from '../demo/reel';
import type { Locale } from '../locale';
import './work.css';

// Molis Work 的演示画面：一份「行业观察报告」走三天。像一张真的工作台：木色的侧栏、植物绿的成功与插件。
// 首页舞台用其中五段（每段约 3.5 秒），Work 页按章节用全部八段（滚到哪一步演到哪一步）。
// 画面里的项目、资料、人名、时间都是示意数据，不代表已上线的功能；各段的阶段标注见 note。
// 画面里的字在 content/site/scenes.ts（英文在 content/site/en/scenes.ts），这里按语言各生成一套。
// 待负责人确认：第 4、6、8 段（多插件接力、讨论、你不在时）的文案与阶段标注是本轮新写的，
// 按 Work 仓库现状标注：讨论（群聊 + 话题）首版已实现、未公开部署、AI 暂不参与群聊；主动提醒在开发版；插件创作台为预览。

type Text = typeof workScene;
type ToolId = keyof Text['tools'];
type Tool = { id: ToolId; icon: LucideIcon };

const Tick = ({ step, delay }: { step: number; delay?: number }) => (
  <i className="m-tick" style={at(step, undefined, delay)}>
    <Check strokeWidth={3} aria-hidden="true" />
  </i>
);

const projectTools: Tool[] = [
  { id: 'files', icon: BookOpen },
  { id: 'feed', icon: Rss },
  { id: 'doc', icon: FileText },
  { id: 'table', icon: Table2 },
  { id: 'deck', icon: Presentation },
  { id: 'talk', icon: MessagesSquare },
];

const personal: Tool[] = [
  { id: 'calendar', icon: CalendarDays },
  { id: 'notes', icon: NotebookPen },
  { id: 'todo', icon: ListTodo },
];

const resultIcons = [Rss, FileText, NotebookPen];

/** 工作台的外框：左边木色侧栏（项目里的工具 + 个人的日历、笔记、待办），右边是正在做的事 */
function Desk({
  t,
  step,
  name,
  active,
  tools = projectTools,
  extra,
  children,
  className = '',
  press,
}: {
  t: Text;
  step: number;
  name: string;
  active?: ToolId;
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
            {t.project}
          </p>
          <ul>
            {tools.map((tool) => (
              <li key={tool.id} data-on={tool.id === active || undefined}>
                <tool.icon aria-hidden="true" />
                {t.tools[tool.id]}
              </li>
            ))}
            {extra}
          </ul>
          <p className="wk-side-label">{t.personal}</p>
          <ul className="wk-personal">
            {personal.map((tool) => (
              <li key={tool.id}>
                <tool.icon aria-hidden="true" />
                {t.tools[tool.id]}
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

/** 一张汇报页的缩略 */
function Slide({ t, big = false }: { t: Text; big?: boolean }) {
  return (
    <div className={big ? 'wk-slide wk-slide-big' : 'wk-slide'}>
      <span>{t.relay.slide.page}</span>
      <b>{t.relay.slide.title}</b>
      <i />
      <i />
      {big ? <i /> : null}
    </div>
  );
}

function buildScenes(t: Text) {
  /* ---------- 开场：散在各处的碎片，收拢进同一张工作台 ---------- */
  const scatter: Scene = {
    id: 'work-scatter',
    label: t.scatter.label,
    steps: 3,
    times: [0, 1.2, 2.4, 3.6],
    note: t.scatter.note,
    render: ({ step }) => (
      <Canvas step={step} className="wk wk-scatter">
        <div className="wk-bits">
          <span className="wk-bit" data-k="tab">
            <Rss aria-hidden="true" />
            {t.scatter.bits.tab}
          </span>
          <span className="wk-bit" data-k="chat">
            <MessagesSquare aria-hidden="true" />
            {t.scatter.bits.chat}
          </span>
          <span className="wk-bit" data-k="doc">
            <FileText aria-hidden="true" />
            {t.scatter.bits.doc}
          </span>
          <span className="wk-bit" data-k="ai">
            <SquareCode aria-hidden="true" />
            {t.scatter.bits.ai}
          </span>
          <span className="wk-bit" data-k="todo">
            <ListTodo aria-hidden="true" />
            {t.scatter.bits.todo}
          </span>
        </div>
        <div className="m-sc-win wk-gather m-v" data-pop="" style={at(2)}>
          <p className="wk-project">
            <span className="m-dot" />
            {t.project}
          </p>
          <ul>
            <li>
              <Rss aria-hidden="true" />
              {t.scatter.gathered.feed}
            </li>
            <li>
              <FileText aria-hidden="true" />
              {t.scatter.gathered.doc}
            </li>
            <li>
              <ListTodo aria-hidden="true" />
              {t.scatter.gathered.todo}
            </li>
            <li>
              <SquareCode aria-hidden="true" />
              {t.scatter.gathered.ai}
            </li>
          </ul>
        </div>
      </Canvas>
    ),
  };

  /* ---------- 按这段工作的需要，布置工作台 ---------- */
  const arrange: Scene = {
    id: 'work-arrange',
    label: t.arrange.label,
    steps: 3,
    times: [0, 1.2, 2.4, 3.8],
    note: t.arrange.note,
    render: ({ step }) => (
      <Desk
        t={t}
        step={step}
        name={t.arrange.crumb}
        tools={[]}
        extra={projectTools.slice(0, 3).map((tool, index) => (
          <li
            key={tool.id}
            className="m-v"
            style={at(0, undefined, index * 140)}
            data-new={step === 0 || undefined}
          >
            <tool.icon aria-hidden="true" />
            {t.tools[tool.id]}
          </li>
        ))}
        className="wk-arrange"
      >
        <div className="wk-shelf m-v" data-fade="" style={at(0, 2)}>
          <p className="m-mini">{t.arrange.shelf}</p>
          <div className="wk-shelf-grid">
            {projectTools.map((tool, index) => (
              <span key={tool.id} data-picked={index < 3 || undefined}>
                <tool.icon aria-hidden="true" />
                {t.tools[tool.id]}
                {index < 3 ? <Tick step={0} delay={index * 140} /> : null}
              </span>
            ))}
          </div>
          <p className="m-mini m-v" style={at(1)}>
            {t.arrange.mine}
          </p>
        </div>
        <div className="wk-search m-v" data-fade="" style={at(2)}>
          <p className="wk-search-box">
            <Search aria-hidden="true" />
            {t.arrange.term}
          </p>
          <ul>
            {t.arrange.results.map((result, index) => {
              const Icon = resultIcons[index];
              return (
                <li key={result.from}>
                  <Icon aria-hidden="true" />
                  <span>
                    {result.before}
                    <b>{t.arrange.term}</b>
                    {result.after}
                  </span>
                  <small>{result.from}</small>
                </li>
              );
            })}
          </ul>
        </div>
      </Desk>
    ),
  };

  /* ---------- 你和 AI，接着同一份内容工作 ---------- */
  const together: Scene = {
    id: 'work-together',
    label: t.together.label,
    steps: 4,
    times: [0, 0.7, 1.7, 2.6, 3.6],
    note: t.together.note,
    render: ({ step }) => (
      <Desk
        t={t}
        step={step}
        name={t.together.crumb}
        active="doc"
        className="wk-together"
        press={[2]}
      >
        <div className="wk-doc">
          <p className="wk-doc-title">{t.together.title}</p>
          <span className="m-ln" style={{ width: '92%' }} />
          <span className="m-ln" style={{ width: '78%' }} />
          <p className="wk-ai m-v" style={at(1)}>
            <span className="m-chip" data-tone="accent">
              {t.together.assistant}
            </span>
            {t.together.outlined}
          </p>
          <ol className="wk-outline">
            <li className="m-hl" style={at(1, undefined, 0)}>
              {t.together.outline[0]}
            </li>
            <li className="m-hl" style={at(1, undefined, 160)}>
              {t.together.outline[1]}
            </li>
            <li>
              <span className="m-stack">
                <span className="m-hl m-v" data-fade="" style={at(1, 3, 320)}>
                  {t.together.outline[2]}
                </span>
                <span className="m-v wk-mine" data-fade="" style={at(3)}>
                  {t.together.mine}
                </span>
              </span>
              <span className="m-chip wk-you m-v" style={at(3)}>
                {t.together.changed}
              </span>
            </li>
          </ol>
          <p className="wk-handoff">
            <span className="wk-take" data-on={step >= 2 || undefined}>
              {t.together.take}
              <Cursor show={at(2, 3)} x="60%" y="55%" />
            </span>
            <span className="m-mini m-v" style={at(2)}>
              {t.together.editing}
            </span>
          </p>
        </div>
      </Desk>
    ),
  };

  const feed = (
    <ul>
      {t.relay.feed.map((item, i) => (
        <li key={item} className="m-hl" style={at(0, undefined, i * 160)}>
          {item}
        </li>
      ))}
    </ul>
  );

  /* ---------- 助理用插件把事情做完（新写，待负责人确认） ---------- */
  const relay: Scene = {
    id: 'work-relay',
    label: t.relay.label,
    steps: 4,
    times: [0, 0.8, 1.7, 2.6, 3.6],
    note: t.relay.note,
    render: ({ step }) => (
      <Desk t={t} step={step} name={t.relay.crumb} className="wk-relay">
        <div className="wk-chain">
          <div className="wk-card" data-on={step === 0 || undefined}>
            <p>
              <Rss aria-hidden="true" />
              {t.tools.feed}
            </p>
            {feed}
          </div>
          <div className="wk-card m-v" data-pop="" style={at(1)}>
            <p>
              <Table2 aria-hidden="true" />
              {t.tools.table}
            </p>
            <table>
              <tbody>
                {t.relay.table.map((row, r) => (
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
              {t.tools.deck}
            </p>
            <Slide t={t} />
          </div>
        </div>
        <ul className="wk-results m-v" style={at(3)}>
          {t.relay.results.map((item, i) => (
            <li key={item}>
              <Tick step={3} delay={i ? i * 120 : undefined} />
              {item}
              <small>{t.relay.sourced}</small>
            </li>
          ))}
        </ul>
      </Desk>
    ),
  };

  /** Work 页上这一章更长：再约一场评审、留一条跟进 */
  const relayMore: Scene = {
    ...relay,
    id: 'work-relay-more',
    label: t.relay.labelMore,
    steps: 4,
    render: ({ step }) => (
      <Desk
        t={t}
        step={step}
        name={t.relay.crumb}
        className="wk-relay wk-relay-more"
      >
        <div className="wk-chain">
          <div className="wk-card">
            <p>
              <Rss aria-hidden="true" />
              {t.tools.feed}
            </p>
            {feed}
          </div>
          <div className="wk-card m-v" data-pop="" style={at(1)}>
            <p>
              <Table2 aria-hidden="true" />
              {t.relay.tableToDeck}
            </p>
            <Slide t={t} />
          </div>
          <div className="wk-card m-v" data-pop="" style={at(2)}>
            <p>
              <CalendarDays aria-hidden="true" />
              {t.tools.calendar}
            </p>
            <p className="wk-event">
              {t.relay.event.when}
              <b>{t.relay.event.what}</b>
            </p>
          </div>
          <div
            className="wk-card m-v"
            data-pop=""
            style={at(2, undefined, 200)}
          >
            <p>
              <ListTodo aria-hidden="true" />
              {t.tools.todo}
            </p>
            <p className="wk-event">
              {t.relay.followUp.when}
              <b>{t.relay.followUp.what}</b>
            </p>
          </div>
        </div>
        <p className="wk-proof m-v" style={at(3)}>
          <Tick step={3} />
          {t.relay.proof}
        </p>
      </Desk>
    ),
  };

  /* ---------- 工作台也可以长出你自己的工具（预览） ---------- */
  const grow: Scene = {
    id: 'work-grow',
    label: t.grow.label,
    steps: 4,
    times: [0, 0.7, 1.6, 2.6, 3.6],
    note: t.grow.note,
    render: ({ step }) => (
      <Desk
        t={t}
        step={step}
        name={t.grow.crumb}
        className="wk-grow"
        extra={
          <li className="m-v wk-grown" style={at(3)}>
            <Puzzle aria-hidden="true" />
            {t.grow.tool}
            <span className="m-chip" data-tone="green">
              {t.grow.fresh}
            </span>
          </li>
        }
      >
        <p className="wk-ask">
          <span className="m-chip" data-tone="line">
            {t.grow.you}
          </span>
          {t.grow.ask}
        </p>
        <div className="wk-build m-v" style={at(1)}>
          <p className="wk-build-head">
            <Puzzle aria-hidden="true" />
            <b>{t.grow.tool}</b>
            <span className="m-mini">{t.grow.plugin}</span>
          </p>
          <ul>
            <li>
              <Tick step={1} />
              {t.grow.checks[0]}
            </li>
            <li>
              <Tick step={2} />
              {t.grow.checks[1]}
            </li>
            <li>
              <Tick step={2} delay={300} />
              {t.grow.checks[2]}
            </li>
          </ul>
          <span className="m-bar" style={at(2)} />
        </div>
        <p className="wk-grow-done m-v" style={at(3)}>
          {t.grow.done}
        </p>
      </Desk>
    ),
  };

  /* ---------- 一起讨论，上下文和成果都接得上（新写，待负责人确认） ---------- */
  const talk: Scene = {
    id: 'work-talk',
    label: t.talk.label,
    steps: 4,
    times: [0, 0.6, 1.6, 2.6, 3.6],
    note: t.talk.note,
    render: ({ step }) => (
      <Desk
        t={t}
        step={step}
        name={t.talk.crumb}
        active="deck"
        className="wk-talk"
      >
        <div className="wk-talk-grid">
          <Slide t={t} big />
          <div className="wk-thread">
            <p className="wk-thread-head">
              <MessagesSquare aria-hidden="true" />
              {t.talk.thread}
            </p>
            <div className="wk-msg m-v" style={at(0)}>
              <span className="wk-face">{t.talk.them}</span>
              <div>
                <p className="wk-quote">
                  <Quote aria-hidden="true" />
                  {t.talk.quote}
                </p>
                <p>{t.talk.question}</p>
              </div>
            </div>
            <p className="m-chip m-v" style={at(1)}>
              {t.talk.topic}
            </p>
            <div className="wk-msg m-v" style={at(1, undefined, 220)}>
              <span className="wk-face" data-me="">
                {t.talk.me}
              </span>
              <p>{t.talk.reply}</p>
            </div>
            <p className="wk-conclusion m-v" style={at(2)}>
              <b>{t.talk.conclusion.label}</b> {t.talk.conclusion.text}
            </p>
          </div>
        </div>
        <p className="wk-proof m-v" style={at(3)}>
          <Tick step={3} />
          {t.talk.proof}
        </p>
      </Desk>
    ),
  };

  /* ---------- 工作做到哪里，有记录，也有依据 ---------- */
  const goal: Scene = {
    id: 'work-goal',
    label: t.goal.label,
    steps: 3,
    times: [0, 1.2, 2.4, 3.8],
    note: t.goal.note,
    render: ({ step }) => (
      <Desk t={t} step={step} name={t.goal.crumb} className="wk-goal">
        <dl className="wk-goal-list">
          <div>
            <dt>
              <Target aria-hidden="true" />
              {t.goal.aim.term}
            </dt>
            <dd>{t.goal.aim.text}</dd>
          </div>
          <div>
            <dt>{t.goal.progress.term}</dt>
            <dd>{t.goal.progress.text}</dd>
          </div>
          <div>
            <dt>{t.goal.problem.term}</dt>
            <dd>{t.goal.problem.text}</dd>
          </div>
          <div>
            <dt>{t.goal.open.term}</dt>
            <dd>
              <span className="m-chip" data-tone="accent">
                {t.goal.open.chip}
              </span>
              {t.goal.open.text}
            </dd>
          </div>
        </dl>
        <p className="wk-agent m-v" style={at(1, 2)}>
          <SquareCode aria-hidden="true" />
          <span>
            {t.goal.agent.before}
            <b>{t.goal.agent.name}</b>
            {t.goal.agent.after}
          </span>
        </p>
        <ul className="wk-check m-v" style={at(2)}>
          <li>
            <Tick step={2} />
            {t.goal.checks[0]}
          </li>
          <li>
            <Tick step={2} delay={150} />
            {t.goal.checks[1]}
          </li>
          <li>
            <i className="m-tick" style={at(99)} />
            {t.goal.checks[2]}
          </li>
        </ul>
      </Desk>
    ),
  };

  /* ---------- 你不在的时候，助理接着干（新写，待负责人确认；开发中） ---------- */
  const [late, failed, morning] = t.away.log;
  const away: Scene = {
    id: 'work-away',
    label: t.away.label,
    steps: 4,
    times: [0, 0.8, 1.7, 2.6, 3.6],
    note: t.away.note,
    render: ({ step }) => (
      <Canvas step={step} className="wk wk-away">
        <div className="m-sc-win wk-night">
          <p className="wk-off">
            <Moon aria-hidden="true" />
            {t.away.off}
            <span className="m-mini">{t.away.quiet}</span>
          </p>
          <ol className="wk-night-log">
            <li className="m-v" style={at(1)}>
              <Tick step={1} />
              <span>
                {late.text}
                <small>{late.small}</small>
              </span>
            </li>
            <li className="m-v" style={at(1, undefined, 260)}>
              <Tick step={1} delay={260} />
              <span>
                {failed.text}
                <small>{failed.small}</small>
              </span>
            </li>
            <li className="m-v" style={at(2)}>
              <span className="m-tick" style={at(99)} />
              <span>
                {morning.text}
                <small>{morning.small}</small>
              </span>
            </li>
          </ol>
        </div>
        <div className="m-sc-win wk-inbox m-v" data-pop="" style={at(3)}>
          <p className="wk-inbox-head">
            <Inbox aria-hidden="true" />
            {t.away.inbox}
            <span className="m-chip" data-tone="accent">
              {t.away.waiting}
            </span>
          </p>
          <p className="wk-inbox-q">{t.away.question}</p>
          <p className="m-mini">{t.away.why}</p>
          <p className="wk-inbox-act">
            <span className="m-chip" data-tone="ink">
              {t.away.yes}
            </span>
            <span className="m-chip" data-tone="line">
              {t.away.no}
            </span>
          </p>
        </div>
      </Canvas>
    ),
  };

  /** 首页舞台的五段（spec 第 4 节 3）；第 2、4、5 段是新写的，待负责人确认 */
  const home: Segment[] = [
    { title: t.home.together, scene: together },
    { title: t.home.relay, scene: relay },
    { title: t.home.grow, scene: grow, tag: t.home.growTag },
    { title: t.home.talk, scene: talk, tag: t.home.talkTag },
    { title: t.home.away, scene: away, tag: t.home.awayTag },
  ];

  return {
    home,
    scenes: {
      scatter,
      arrange,
      together,
      relay: relayMore,
      grow,
      talk,
      goal,
      away,
    },
  };
}

const built = {
  zh: buildScenes(copy.zh.scenes.workScene),
  en: buildScenes(copy.en.scenes.workScene),
} satisfies Record<Locale, ReturnType<typeof buildScenes>>;

/** 首页舞台的五段，按语言 */
export const workHomeSegmentsFor = (locale: Locale) => built[locale].home;
/** Work 页八章的画面，按语言 */
export const workScenesFor = (locale: Locale) => built[locale].scenes;

/** 中文版（旧的导出名，别的分支还在用） */
export const workHomeSegments = built.zh.home;
export const workScenes = built.zh.scenes;
