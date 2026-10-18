'use client';
import {
  BookOpen,
  CalendarClock,
  Calculator,
  Check,
  CircleDot,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  History,
  House,
  Inbox,
  KeyRound,
  ListChecks,
  Mail,
  MessagesSquare,
  NotebookPen,
  Presentation,
  Quote,
  Rss,
  Settings,
  Sparkles,
  Sun,
  Target,
  UserRound,
  Wand,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { at, Cursor, type Scene } from '../demo/demo';
import {
  Bar,
  Line,
  Sheet,
  Studio,
  Swap,
  Term,
  Tick,
  Who,
  Win,
  type Vars,
} from './work';
import './work-stage.css';

// Work 页首屏舞台的新画面：每条路八段里，work.tsx 没有的那些。
// 同一扇 Molis Work 窗口，菜单栏、主区、右栏、浮条、底栏的位置不变，换的只是打开的插件；
// 某一处第一次用到时，那里先亮一个小标签（Pin）。字段名、按钮名、状态文案尽量用 Molis Work 界面里的原文
// （工作流程那几段照 plugins/native/workflows 的文案），界面上没有的是示意。画面里的名字、数字都是示例数据。

/** 某一处第一次用到时亮的小标签：「菜单栏：谁在等你」「底栏 · 工作流程」 */
function Pin({
  show,
  place,
  children,
}: {
  show: Vars;
  place: CSSProperties;
  children: ReactNode;
}) {
  return (
    <span className="ws-pin m-v" data-pop="" style={{ ...show, ...place }}>
      {children}
    </span>
  );
}

/** 一个字一个字打出来 */
function Typed({
  text,
  step,
  start = 0,
  every = 70,
}: {
  text: string;
  step: number;
  start?: number;
  every?: number;
}) {
  return (
    <span className="ws-typed">
      {Array.from(text).map((char, index) => (
        <span
          key={index}
          className="m-v"
          data-fade=""
          style={at(step, undefined, start + index * every)}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

/** 底栏：项目里的插件排一排，亮着的那个是这一段要打开的 */
function Dock({
  icons,
  on,
  cursor,
}: {
  icons: LucideIcon[];
  on?: number;
  cursor?: Vars;
}) {
  return (
    <p className="ws-dock">
      {icons.map((Icon, index) => (
        <span key={index} data-on={index === on || undefined}>
          <Icon aria-hidden="true" />
          {index === on && cursor ? (
            <Cursor show={cursor} x="55%" y="55%" />
          ) : null}
        </span>
      ))}
      <span className="ws-dock-ask">
        <Sparkles aria-hidden="true" />
        对助理说…
      </span>
    </p>
  );
}

/** 助理：输入框上方的对话 */
function Assistant({
  title = '助理',
  sub,
  children,
}: {
  title?: string;
  sub?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="wv-chat wv-asst">
      <p className="wv-chat-head">
        <Sparkles aria-hidden="true" />
        <b>{title}</b>
        {sub ? <small>{sub}</small> : null}
      </p>
      <div className="wv-msgs">{children}</div>
    </section>
  );
}

/* =====================================================================
   写代码 2 · 谁在等你：菜单栏「等你 · 2」，展开是几个 AI 各停在哪；答一张提问卡，它接着做
   ===================================================================== */

export const devWait: Scene = {
  id: 'work-dev-wait',
  label:
    'Molis Work 示意：菜单栏写着「等你 · 2」；展开是四个 AI 各自停在哪：Claude Code 和 OpenCode 在做，Codex 等你决定，助理问了一个问题；点开助理的问题，在提问卡上选「两份都要」，不用打字，它接着写；菜单栏变成「等你 · 1」。',
  steps: 4,
  times: [0, 1.4, 3.0, 5.0, 7.4],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="ws-two"
      place="Goals · 上线支付"
      icon={Target}
      press={[2]}
      status={
        <span className="wv-menu" data-wait="">
          <Target aria-hidden="true" />
          <span className="m-stack">
            <span className="m-v" data-fade="" style={at(0, 3)}>
              等你 · 2
            </span>
            <span className="m-v" data-fade="" style={at(3)}>
              等你 · 1
            </span>
          </span>
        </span>
      }
    >
      <Pin show={at(0, 1)} place={{ top: '2.9em', right: '1.2em' }}>
        菜单栏：谁在等你
      </Pin>
      <Sheet icon={Target} title="上线支付" sub="目标" className="wv-main">
        <ul className="wv-reqs wv-reqs-big">
          <li>
            <Tick step={0} />
            <span>
              回调幂等<small>依据：测试 14/14 · Claude Code</small>
            </span>
          </li>
          <li>
            <Tick step={99} />
            <span>
              沙箱三种支付走通<small>Codex 在做</small>
            </span>
          </li>
          <li>
            <Tick step={99} />
            <span>
              手机排版正常<small>要你验收</small>
            </span>
          </li>
        </ul>
        <div className="wv-tl">
          <p>
            <Who k="cx">Cx</Who>
            <span>Codex 提议：金额统一用「分」· 等你决定</span>
          </p>
          <p>
            <Who k="cc">CC</Who>
            <span>Claude Code 在做结算页</span>
          </p>
          <p>
            <Who k="ds">OC</Who>
            <span>OpenCode 在写接口文档</span>
          </p>
        </div>
      </Sheet>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 2)}>
          <Sheet icon={FolderOpen} title="Shelf" sub="手边的材料">
            <ul className="wv-list">
              <li>
                <FileText aria-hidden="true" />
                <span>
                  支付接口说明.pdf<small>上周存的</small>
                </span>
              </li>
              <li>
                <FileText aria-hidden="true" />
                <span>
                  结算页设计稿 v2<small>小周发的</small>
                </span>
              </li>
            </ul>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(2)}>
          <Assistant sub="在写发布说明">
            <p className="wv-me">把这一版的发布说明写出来。</p>
            <div className="ws-askcard" data-answered={step >= 3 || undefined}>
              <p className="ws-askcard-q">
                <b>发布说明写给谁看？</b>
                <small>助理问你 · 选一个就行</small>
              </p>
              <p className="ws-opts">
                <span data-out={step >= 3 || undefined}>用户看的</span>
                <span data-out={step >= 3 || undefined}>团队内部</span>
                <span data-picked={step >= 3 || undefined}>
                  两份都要
                  <Cursor show={at(2, 3)} x="60%" y="60%" />
                </span>
              </p>
            </div>
            <Line show={at(3, undefined, 300)}>
              <p className="wv-ai">
                好，两份接着写：用户版讲变化，内部版带上改动的目标和依据。
              </p>
            </Line>
          </Assistant>
        </div>
      </Swap>
      <div className="ws-drop m-v" data-pop="" style={at(1, 2)}>
        <p className="ws-drop-head">
          <b>上线支付</b>
          <span>4 个 AI</span>
        </p>
        <ul>
          <li data-wait="">
            <Who k="cx">Cx</Who>
            <span>
              Codex<small>需要你决定：金额统一用「分」</small>
            </span>
          </li>
          <li data-wait="" data-on={step >= 1 || undefined}>
            <Who k="ai">
              <Sparkles aria-hidden="true" />
            </Who>
            <span>
              助理<small>问你一个问题</small>
            </span>
            <Cursor show={at(1, 2)} x="70%" y="55%" />
          </li>
          <li>
            <Who k="cc">CC</Who>
            <span>
              Claude Code<small>在做结算页</small>
            </span>
          </li>
          <li>
            <Who k="ds">OC</Who>
            <span>
              OpenCode<small>在写接口文档</small>
            </span>
          </li>
        </ul>
      </div>
    </Win>
  ),
};

/* =====================================================================
   工作流程（三条路各一版）：新建流程 → 拖上插件 → 定每一段的交接 → 开始一次 → 沿链走完
   镜头照第二轮设计方案 4.2 节；字段名、状态照 Molis Work 工作流程插件的界面文案
   ===================================================================== */

type Station = { name: string; icon: LucideIcon; action?: string };
type Mode = '模板转换' | 'AI 整理后' | '人看完后' | '判断后';
const MODES: Mode[] = ['模板转换', 'AI 整理后', '人看完后', '判断后'];
type Handoff = { mode: Mode; detail: ReactNode };

type FlowSpec = {
  id: string;
  label: string;
  name: string;
  /** 「可以加入的插件」那一排，前两个会被拖上链 */
  palette: [LucideIcon, string][];
  stations: [Station, Station, Station];
  links: [Handoff, Handoff];
  /** 开始一次：从第一站的哪条内容开始（第一条是选中的） */
  pick: [string, string][];
  /** 第一段走过去时的两行状态 */
  run: [string, string];
  /** 第二段：停下来等人，或判断后交过去 */
  stop: ReactNode;
  /** 最后一行 */
  done: ReactNode;
};

/** 交接方式的四个选项，选中的那个亮 */
function Modes({ mode }: { mode: Mode }) {
  return (
    <p className="ws-modes">
      {MODES.map((item) => (
        <span key={item} data-on={item === mode || undefined}>
          {item}
        </span>
      ))}
    </p>
  );
}

function flowScene(spec: FlowSpec): Scene {
  const [s1, s2, s3] = spec.stations;
  const [l1, l2] = spec.links;
  const StationBox = ({
    station,
    show,
    done,
    delay,
    n,
  }: {
    station: Station;
    show: Vars;
    done: boolean;
    delay?: number;
    n: number;
  }) => (
    <li
      className="ws-station m-v"
      data-pop=""
      data-done={done || undefined}
      style={{ ...show, '--dd': `${delay ?? 0}ms` } as Vars}
    >
      <span>
        <station.icon aria-hidden="true" />
      </span>
      <b>{station.name}</b>
      <small>
        {station.action ? `动作 · ${station.action}` : `第 ${n} 站`}
      </small>
    </li>
  );
  return {
    id: spec.id,
    label: spec.label,
    steps: 8,
    times: [0, 2.6, 4.2, 5.8, 9.0, 11.6, 13.8, 16.6, 21],
    note: '开发中 · 界面示意',
    render: ({ step }) => (
      <Win
        step={step}
        className="ws-flow"
        place={`工作流程 · ${spec.name}`}
        icon={Workflow}
        press={[0, 3, 5, 7]}
        status={
          <span className="wv-menu" data-wait={step === 7 || undefined}>
            <Workflow aria-hidden="true" />
            <span className="m-stack">
              <span className="m-v" data-fade="" style={at(0, 6)}>
                新的流程
              </span>
              <span
                className="m-v"
                data-fade=""
                style={at(6, 7)}
              >{`第 2/3 步 · ${s2.name}`}</span>
              <span
                className="m-v"
                data-fade=""
                style={at(7)}
              >{`第 3/3 步 · ${s3.name}`}</span>
            </span>
          </span>
        }
      >
        <Pin show={at(0, 1)} place={{ bottom: '3.6em', left: '1.2em' }}>
          底栏 · 工作流程
        </Pin>
        <Sheet
          icon={Workflow}
          title="新建流程"
          sub="插件是站，两站之间是衔接"
          className="ws-flow-sheet"
        >
          <p className="ws-flow-name">
            <small>流程名称</small>
            <Typed text={spec.name} step={0} start={700} />
            <span
              className="ws-flow-go m-v"
              data-fade=""
              data-pressed={step >= 5 || undefined}
              style={at(4)}
            >
              开始一次
              <Cursor show={at(5, 6)} x="60%" y="60%" />
            </span>
          </p>
          <ol className="ws-chain">
            <li className="ws-empty m-v" data-fade="" style={at(0, 1)}>
              还没有站 · 也可以把下面的插件拖到这里
            </li>
            <StationBox station={s1} show={at(1)} done={step >= 6} n={1} />
            <li
              className="ws-link m-v"
              data-fade=""
              data-set={step >= 3 || undefined}
              style={at(2)}
            >
              <span className="ws-link-line">
                <i className="ws-dot" data-go={step >= 6 || undefined} />
              </span>
              <small className="m-stack">
                <span className="m-v" data-fade="" style={at(2, 3)}>
                  未接上
                </span>
                <span className="m-v" data-fade="" style={at(3)}>
                  {l1.mode}
                </span>
              </small>
              <Cursor show={at(3, 4)} x="50%" y="40%" />
            </li>
            <StationBox station={s2} show={at(2)} done={step >= 7} n={2} />
            <li className="ws-link m-v" data-fade="" data-set="" style={at(4)}>
              <span className="ws-link-line">
                <i
                  className="ws-dot"
                  data-go={step >= 7 || undefined}
                  style={{ '--dd': '900ms' } as Vars}
                />
              </span>
              <small>{l2.mode}</small>
            </li>
            <StationBox
              station={s3}
              show={at(4)}
              done={step >= 7}
              delay={1800}
              n={3}
            />
          </ol>
          <Swap className="ws-flow-panel">
            <div className="m-v" data-fade="" style={at(0, 1)}>
              <p className="ws-flow-hint">
                把已有插件按顺序串起来，定好上一步的结果怎样交给下一步。每走一次都会留下这一次自己的内容。
              </p>
            </div>
            <div className="m-v" data-fade="" style={at(1, 3)}>
              <p className="ws-flow-sub">
                <b>可以加入的插件</b>
                <small>拖到链上，或点一下加到末尾</small>
              </p>
              <p className="ws-palette">
                {spec.palette.map(([Icon, name], index) => (
                  <span
                    key={name}
                    data-used={
                      (index === 0 && step >= 1) ||
                      (index === 1 && step >= 2) ||
                      undefined
                    }
                  >
                    <Icon aria-hidden="true" />
                    {name}
                    {index === 0 ? (
                      <Cursor show={at(1, 2)} x="50%" y="55%" />
                    ) : null}
                    {index === 1 ? (
                      <Cursor show={at(2, 3)} x="50%" y="55%" />
                    ) : null}
                  </span>
                ))}
              </p>
            </div>
            <div className="m-v" data-fade="" style={at(3, 4)}>
              <p className="ws-flow-sub">
                <b>这一段的交接</b>
                <small>{`${s1.name} → ${s2.name}`}</small>
                <span
                  className="ws-saved m-v"
                  data-fade=""
                  style={at(3, undefined, 2200)}
                >
                  <Check aria-hidden="true" />
                  已保存
                </span>
              </p>
              <Modes mode={l1.mode} />
              {l1.detail}
            </div>
            <div className="m-v" data-fade="" style={at(4, 5)}>
              <p className="ws-flow-sub">
                <b>这一段的交接</b>
                <small>{`${s2.name} → ${s3.name}`}</small>
                <span
                  className="ws-saved m-v"
                  data-fade=""
                  style={at(4, undefined, 1400)}
                >
                  <Check aria-hidden="true" />
                  已保存
                </span>
              </p>
              <Modes mode={l2.mode} />
              {l2.detail}
            </div>
            <div className="m-v" data-fade="" style={at(5, 6)}>
              <p className="ws-flow-sub">
                <b>先选这一次从哪条内容开始</b>
                <small>{`这一次从 ${s1.name} 里的一条内容开始。每一次的内容互不相串。`}</small>
              </p>
              <ul className="wv-list ws-pick">
                {spec.pick.slice(0, 2).map(([title, from], index) => (
                  <li key={title} data-on={index === 0 || undefined}>
                    <s1.icon aria-hidden="true" />
                    <span>
                      {title}
                      <small>{from}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="m-v" data-fade="" style={at(6, 7)}>
              <ul className="ws-runlog">
                <li className="m-v" data-fade="" style={at(6)}>
                  <i className="ws-spin" />
                  {spec.run[0]}
                </li>
                <li className="m-v" data-fade="" style={at(6, undefined, 1300)}>
                  <Check aria-hidden="true" />
                  {spec.run[1]}
                </li>
              </ul>
            </div>
            <div className="m-v" data-fade="" style={at(7)}>
              {spec.stop}
              <Line show={at(7, undefined, 2000)}>
                <p className="ws-flow-done">{spec.done}</p>
              </Line>
            </div>
          </Swap>
        </Sheet>
        <Dock
          icons={[Target, Inbox, FileText, ListChecks, Workflow]}
          on={4}
          cursor={at(0, 1)}
        />
      </Win>
    ),
  };
}

/** 停在「人看完后」那一站：看内容并交给下一站，点「交过去」 */
function Review({
  to,
  title,
  body,
}: {
  to: string;
  title: string;
  body: string;
}) {
  return (
    <div className="ws-review">
      <p className="ws-flow-sub">
        <b>{`看内容并交给 ${to}`}</b>
        <small>看完再决定交不交、交什么。</small>
      </p>
      <div className="ws-review-row">
        <div className="ws-review-doc">
          <b>{title}</b>
          <small>{body}</small>
        </div>
        <p className="wv-btns">
          <span data-primary="">
            交过去
            <Cursor show={at(7)} x="60%" y="60%" />
          </span>
          <span>先不交</span>
        </p>
      </div>
    </div>
  );
}

export const devFlow = flowScene({
  id: 'work-dev-flow',
  label:
    'Molis Work 示意：底栏打开工作流程，新建「每天分拣新 issue」；把 Feed、Inbox 拖上链，中间一段先是「未接上」；交接选「判断后」，用判断规则「是不是 bug」，结果是 bug 才交过去；再接「新建目标」，交接选「人看完后」；开始一次，从 Feed 里选 #342；判断为 bug，交给了 Inbox；停在「看内容并交给 Goals」，点交过去，这一次走完，Goals 里多了一个目标。',
  name: '每天分拣新 issue',
  palette: [
    [Rss, 'Feed'],
    [Inbox, 'Inbox'],
    [FileText, 'Pages'],
    [ListChecks, '待办'],
    [Target, 'Goals'],
  ],
  stations: [
    { name: 'Feed', icon: Rss },
    { name: 'Inbox', icon: Inbox },
    { name: 'Goals', icon: Target, action: '新建目标' },
  ],
  links: [
    {
      mode: '判断后',
      detail: (
        <div className="ws-rule">
          <p>
            <small>判断规则</small>
            <b>是不是 bug</b>
            <small>结果是这些时交过去</small>
            <span className="ws-chk" data-on="">
              是 bug
            </span>
            <span className="ws-chk">不是</span>
          </p>
        </div>
      ),
    },
    {
      mode: '人看完后',
      detail: (
        <p className="ws-flow-note">
          走到这里时会停下来，人看完上一步的内容，改好要交的标题和正文，再决定交不交。
        </p>
      ),
    },
  ],
  pick: [
    ['#342 导出 CSV 时崩溃', 'GitHub 通知 · 10 分钟前'],
    ['#341 README 里有个错字', 'GitHub 通知 · 1 小时前'],
    ['#340 想要深色模式', 'GitHub 通知 · 昨天'],
  ],
  run: ['正在判断…', '判断为「是 bug」，交给了 Inbox'],
  stop: (
    <Review
      to="Goals"
      title="修好导出 CSV 崩溃"
      body="来自 #342 · 复现步骤 3 条 · 附原 issue 链接"
    />
  ),
  done: (
    <>
      这是最后一站，这一次已经走完。
      <span className="wv-ok">Goals 里多了：修好导出 CSV 崩溃</span>
    </>
  ),
});

export const docFlow = flowScene({
  id: 'work-doc-flow',
  label:
    'Molis Work 示意：底栏打开工作流程，新建「每周读报告，写成一页」；把 Feed、Pages 拖上链，中间一段先是「未接上」；交接选「AI 整理后」，写好要整理成什么；再接待办，交接选「人看完后」；开始一次，从 Feed 里选一份报告；AI 整理好，交给了 Pages；停在「看内容并交给 待办」，点交过去，这一次走完。',
  name: '每周读报告，写成一页',
  palette: [
    [Rss, 'Feed'],
    [FileText, 'Pages'],
    [Inbox, 'Inbox'],
    [ListChecks, '待办'],
    [Presentation, '演示稿'],
  ],
  stations: [
    { name: 'Feed', icon: Rss },
    { name: 'Pages', icon: FileText },
    { name: '待办', icon: ListChecks, action: '新建待办' },
  ],
  links: [
    {
      mode: 'AI 整理后',
      detail: (
        <div className="ws-rule">
          <p>
            <small>要整理成什么</small>
          </p>
          <p className="ws-ask-text">
            <Typed
              text="整理成一页：先写一句结论，再分成背景、要点和待确认的问题，保留原文链接。"
              step={3}
              start={500}
              every={28}
            />
          </p>
        </div>
      ),
    },
    {
      mode: '人看完后',
      detail: (
        <p className="ws-flow-note">
          走到这里时会停下来，人看完上一步的内容，改好要交的标题和正文，再决定交不交。
        </p>
      ),
    },
  ],
  pick: [
    ['《内容平台年度报告》', 'Feed · 行业订阅 · 今天'],
    ['《AI 编辑器季度观察》', 'Feed · 行业订阅 · 周二'],
    ['周三的行业简报', 'Feed · 邮件 · 周三'],
  ],
  run: ['AI 正在整理…', '已交给 Pages：一页，结论在最前，原文链接在文末'],
  stop: (
    <Review
      to="待办"
      title="跟进：和编辑对一下第三节的数据"
      body="来自这一页的「待确认的问题」· 来源写着这次流程"
    />
  ),
  done: (
    <>
      这是最后一站，这一次已经走完。
      <span className="wv-ok">待办里多了一条，来源写着这一页</span>
    </>
  ),
});

export const opsFlow = flowScene({
  id: 'work-ops-flow',
  label:
    'Molis Work 示意：底栏打开工作流程，新建「客户变更」；把 Inbox、Pages 拖上链，中间一段先是「未接上」；交接选「AI 整理后」，把来信拆成几条；再接 Goals 的「提议改约定」，交接选「判断后」，超出约定范围才交过去；开始一次，从 Inbox 里选王总的来信；AI 拆成 3 条，交给 Pages；判断为超出范围，Goals 里多了一项待你确认，你点了同意，约定才改。',
  name: '客户变更',
  palette: [
    [Inbox, 'Inbox'],
    [FileText, 'Pages'],
    [Rss, 'Feed'],
    [ListChecks, '待办'],
    [Target, 'Goals'],
  ],
  stations: [
    { name: 'Inbox', icon: Inbox },
    { name: 'Pages', icon: FileText },
    { name: 'Goals', icon: Target, action: '提议改约定' },
  ],
  links: [
    {
      mode: 'AI 整理后',
      detail: (
        <div className="ws-rule">
          <p>
            <small>要整理成什么</small>
          </p>
          <p className="ws-ask-text">
            <Typed
              text="拆成几条：每条写清改什么、为什么、谁提的，保留原邮件。"
              step={3}
              start={500}
              every={34}
            />
          </p>
        </div>
      ),
    },
    {
      mode: '判断后',
      detail: (
        <div className="ws-rule">
          <p>
            <small>判断规则</small>
            <b>超没超出约定范围</b>
            <small>结果是这些时交过去</small>
            <span className="ws-chk" data-on="">
              超出范围
            </span>
            <span className="ws-chk">在范围内</span>
          </p>
        </div>
      ),
    },
  ],
  pick: [
    ['王总：移动端也要一起做', 'Inbox · 客户邮件 · 今天'],
    ['李经理：报表改成按周出', 'Inbox · 客户邮件 · 周四'],
    ['发票抬头要改一下', 'Inbox · 客户邮件 · 周三'],
  ],
  run: ['AI 正在整理…', '已交给 Pages：拆成 3 条变更'],
  stop: (
    <div className="ws-review">
      <p className="ws-flow-sub">
        <b>判断为「超出范围」，交给了 Goals</b>
        <small>另外 2 条在范围内，判断记在这一步。</small>
      </p>
      <div className="ws-review-row">
        <div className="ws-review-doc" data-wait="">
          <b>官网改版 · 1 项待你确认</b>
          <small>提议改约定：加上移动端适配 · 工期多 2 周</small>
        </div>
        <p className="wv-btns">
          <span data-primary="">
            同意
            <Cursor show={at(7)} x="60%" y="60%" />
          </span>
          <span>先不</span>
        </p>
      </div>
    </div>
  ),
  done: (
    <>
      你点了同意，约定才改。
      <span className="wv-ok">新增一条要求 · 原因：王总 10 月 16 日来信</span>
    </>
  ),
});

/* =====================================================================
   写代码 6 · Skill 带进来：从本机导入，勾三个，发布成角色；助理照着写
   ===================================================================== */

const skills: [string, string, boolean][] = [
  ['发版前检查', 'release-check', true],
  ['写变更说明', 'changelog', true],
  ['代码评审要点', 'review', true],
  ['数据库迁移', 'db-migrate', false],
  ['前端组件规范', 'ui-kit', false],
];

export const devSkill: Scene = {
  id: 'work-dev-skill',
  label:
    'Molis Work 示意：设置里「从本机导入」，列出 Claude Code 里的五个 Skill；勾三个，发布成角色「发版助手」；在助理的输入框选这个角色，让它写更新说明，它按「写变更说明」的格式写；Coding 也能选用这个角色。',
  steps: 4,
  times: [0, 1.4, 2.9, 4.6, 7.0],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="ws-two"
      place="设置 · 角色"
      icon={Settings}
      press={[2]}
    >
      <Pin show={at(0, 2)} place={{ top: '2.9em', left: '1.2em' }}>
        设置 · 角色
      </Pin>
      <Sheet
        icon={FolderOpen}
        title="从本机导入"
        sub="Claude Code 的规则与 Skills"
        className="wv-main"
      >
        <ul className="ws-checklist ws-tight">
          {skills.map(([name, file, picked], index) => (
            <li
              key={file}
              data-on={(picked && step >= 1) || undefined}
              style={{ '--dd': `${index * 220}ms` } as Vars}
            >
              <i className="ws-box">
                <Check strokeWidth={3} aria-hidden="true" />
              </i>
              <span>
                {name}
                <small>{`~/.claude/skills/${file}`}</small>
              </span>
            </li>
          ))}
        </ul>
        <p className="wv-btns">
          <span data-primary="" data-done={step >= 3 || undefined}>
            <span className="m-stack">
              <span className="m-v" data-fade="" style={at(0, 3)}>
                发布成角色
              </span>
              <span className="m-v" data-fade="" style={at(3)}>
                已发布：发版助手 · v1
              </span>
            </span>
            <Cursor show={at(2, 3)} x="60%" y="60%" />
          </span>
        </p>
      </Sheet>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 3)}>
          <Sheet icon={UserRound} title="角色" sub="你的 AI 做事方式">
            <ul className="wv-list">
              <li>
                <UserRound aria-hidden="true" />
                <span>
                  默认<small>没有额外做法</small>
                </span>
              </li>
              <li
                className="m-v"
                data-fade=""
                style={at(2, undefined, 900)}
                data-on=""
              >
                <UserRound aria-hidden="true" />
                <span>
                  发版助手 · v1
                  <small>3 个 Skill · 固定版本 · 助理和 Coding 都能选用</small>
                </span>
              </li>
            </ul>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(3)}>
          <Assistant sub={<span className="ws-role">角色：发版助手</span>}>
            <p className="wv-me">写这一版的更新说明。</p>
            <Line show={at(3, undefined, 500)}>
              <p className="wv-tool">
                <BookOpen aria-hidden="true" />
                照「写变更说明」
              </p>
            </Line>
            <Line show={at(3, undefined, 1000)}>
              <p className="wv-ai">
                新增 2 条、修复 3 条；破坏性改动单列一节，按你们的格式。
              </p>
            </Line>
          </Assistant>
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   写代码 8 · 动手先问你：外部 AI 逐项授权；撤掉一项，下一次调用被拒；助理写文件先给你看
   ===================================================================== */

export const devSafe: Scene = {
  id: 'work-dev-safe',
  label:
    'Molis Work 示意：设置里外部 AI 的授权，一项一项勾着；撤掉 Codex 的「记进展和依据」，Codex 下一次记进展就被拒；助理要写一个文件，先把内容给你看，你点放行才写。',
  steps: 4,
  times: [0, 1.4, 3.0, 4.8, 7.2],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="ws-two"
      place="设置 · 外部 AI 的授权"
      icon={KeyRound}
      press={[1, 3]}
    >
      <Sheet
        icon={KeyRound}
        title="外部 AI 的授权"
        sub="谁能动什么，一项一项给"
        className="wv-main"
      >
        {[
          {
            who: 'cc' as const,
            short: 'CC',
            name: 'Claude Code',
            rows: [
              ['读目标和要求', true],
              ['记进展和依据', true],
              ['提议改约定', true],
            ] as [string, boolean][],
          },
          {
            who: 'cx' as const,
            short: 'Cx',
            name: 'Codex',
            rows: [
              ['读目标和要求', true],
              ['记进展和依据', true],
              ['提议改约定', false],
            ] as [string, boolean][],
          },
        ].map((agent) => (
          <div key={agent.name} className="ws-grant">
            <p className="ws-grant-head">
              <Who k={agent.who}>{agent.short}</Who>
              <b>{agent.name}</b>
            </p>
            <ul>
              {agent.rows.map(([name, on]) => {
                const revoked = agent.who === 'cx' && name === '记进展和依据';
                return (
                  <li key={name}>
                    <span>{name}</span>
                    <i
                      className="ws-toggle"
                      data-on={(on && !(revoked && step >= 1)) || undefined}
                    >
                      {revoked ? (
                        <Cursor show={at(1, 2)} x="60%" y="60%" />
                      ) : null}
                    </i>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <Line show={at(1, undefined, 700)}>
          <p className="wv-wait">已撤回：Codex 不能再记进展和依据</p>
        </Line>
      </Sheet>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 3)}>
          <Term name="Codex" bind="目标：上线支付">
            <Line show={at(0)} className="wv-u">
              跑沙箱支付
            </Line>
            <Line show={at(0, undefined, 300)} className="wv-okl">
              ✓ 沙箱 3 笔
            </Line>
            <Line show={at(2)} className="wv-u">
              记一笔进展：沙箱 3 笔，交依据
            </Line>
            <Line show={at(2, undefined, 500)} className="wv-warnl">
              ✗ 被拒：没有「记进展和依据」的授权
            </Line>
          </Term>
        </div>
        <div className="m-v" data-fade="" style={at(3)}>
          <Assistant>
            <p className="wv-me">把发布说明存成文件。</p>
            <div className="ws-askcard">
              <p className="ws-askcard-q">
                <b>要写入：docs/release-notes.md</b>
                <small>助理先把内容给你看</small>
              </p>
              <p className="ws-filepeek">
                ## 0.3.1
                <br />- 新增：结算页按「分」计价
                <br />- 修复：支付回调偶发 500
              </p>
              <p className="wv-btns">
                <span data-primary="">
                  放行
                  <Cursor show={at(3)} x="60%" y="60%" />
                </span>
                <span>先不</span>
              </p>
            </div>
            <Line show={at(3, undefined, 1300)}>
              <p className="wv-ok">已写入 · 可以撤销</p>
            </Line>
          </Assistant>
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   写文档 1 · 依据在哪：Inbox 本周六条（各写着哪条规则送来的）→ 勾四条整理成一页，文末是本期采用材料
   → 存一版交出去 → 一周后被问，打开那一版，点开当时的原文
   ===================================================================== */

const inboxWeek: [string, string, boolean][] = [
  ['A 公司发布会实录', '规则：提到你跟踪的 5 家公司', true],
  ['行业协会季度数据', '规则：订阅 · 行业数据', true],
  ['客户访谈纪要 10/14', '规则：客户文件夹里新增', true],
  ['B 公司招聘页变了', '规则：网页查询 · B 公司', true],
  ['一篇转载的评论', '规则：提到你跟踪的公司', false],
  ['投资人来信', '规则：来自重要联系人', false],
];

const used: [string, string][] = [
  ['A 公司发布会实录', '视频 · 10/12'],
  ['行业协会季度数据', 'PDF · 第 3 版'],
  ['客户访谈纪要', '笔记 · 10/14'],
  ['B 公司招聘页', '网页 · 10/15 存档'],
];

export const docSource: Scene = {
  id: 'work-doc-source',
  label:
    'Molis Work 示意：Inbox 本周 6 条，每条写着是哪条规则送来的；勾 4 条整理成一页，文末列出本期采用的材料，带来源和版本；存一版交给客户；一周后客户问为什么写 B 公司企业版暂缓，打开交出去的那一版，点开当时用的访谈纪要原文。',
  steps: 5,
  times: [0, 1.6, 3.4, 5.4, 7.6, 10.6],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="ws-two"
      place="Pages · 竞品周报 第 12 期"
      icon={FileText}
      press={[1, 4]}
      status={
        <span className="wv-menu">
          <span className="m-stack">
            <span className="m-v" data-fade="" style={at(0, 4)}>
              本周
            </span>
            <span className="m-v" data-fade="" style={at(4)}>
              一周以后
            </span>
          </span>
        </span>
      }
    >
      <Pin show={at(0, 1)} place={{ top: '2.9em', right: '1.2em' }}>
        Inbox：写着为什么进来
      </Pin>
      <Swap className="wv-main">
        <div className="m-v" data-fade="" style={at(0, 2)}>
          <Sheet icon={Inbox} title="Inbox" sub="本周 6 条 · 只放要你处理的">
            <ul className="ws-checklist ws-tight">
              {inboxWeek.map(([title, rule, picked], index) => (
                <li
                  key={title}
                  data-on={(picked && step >= 1) || undefined}
                  style={{ '--dd': `${index * 160}ms` } as Vars}
                >
                  <i className="ws-box">
                    <Check strokeWidth={3} aria-hidden="true" />
                  </i>
                  <span>
                    {title}
                    <small className="wv-why">{rule}</small>
                  </span>
                </li>
              ))}
            </ul>
            <Bar
              show={at(1, 2)}
              compact
              cursor={at(1, 2)}
              items={[
                { label: '整理成一页', icon: FileText, primary: true },
                { label: '记成待办', icon: ListChecks },
              ]}
            />
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(2)}>
          <Sheet
            icon={FileText}
            title="竞品周报 第 12 期"
            sub={
              <span className="m-stack">
                <span className="m-v" data-fade="" style={at(2, 3)}>
                  草稿
                </span>
                <span className="m-v" data-fade="" style={at(3)}>
                  v3 · 已交给客户
                </span>
              </span>
            }
          >
            <p className="wv-page-text">
              <b>结论：</b>
              <span className="m-hl" style={at(4)}>
                B 公司的企业版今年暂缓
              </span>
              <sup className="wv-fn">[3]</sup>，A 公司转向按席位收费
              <sup className="wv-fn">[1]</sup>。
            </p>
            <p className="wv-page-text wv-dim">
              行业整体增速放缓到 12%<sup className="wv-fn">[2]</sup>
              ，招聘重心转到销售<sup className="wv-fn">[4]</sup>。
            </p>
            <div className="ws-used">
              <p className="wv-sub">本期采用材料</p>
              <ol>
                {used.map(([name, ver], index) => (
                  <li
                    key={name}
                    data-on={(index === 2 && step >= 4) || undefined}
                  >
                    <span>{`[${index + 1}] ${name}`}</span>
                    <small>{ver}</small>
                    {index === 2 ? (
                      <Cursor show={at(4)} x="40%" y="55%" />
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </Sheet>
        </div>
      </Swap>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 2)}>
          <Sheet icon={Rss} title="送进 Inbox 的规则" sub="你定的">
            <ul className="wv-notes-plain">
              <li>提到你跟踪的 5 家公司</li>
              <li>订阅 · 行业数据</li>
              <li>客户文件夹里新增</li>
              <li>网页查询 · B 公司</li>
              <li>来自重要联系人</li>
            </ul>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(2, 3)}>
          <Sheet icon={FileText} title="整理成一页" sub="用勾的 4 条">
            <ul className="wv-notes-plain">
              {used.map(([name]) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <Line show={at(2, undefined, 300)}>
              <p className="wv-ok">已写成一页 · 文末列出用了哪几条</p>
            </Line>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(3, 4)}>
          <Sheet icon={History} title="存一版" sub="交出去的就是这一版">
            <ul className="wv-list">
              <li data-on="">
                <History aria-hidden="true" />
                <span>
                  v3 · 交给客户<small>10 月 16 日 · 用了 4 份材料</small>
                </span>
              </li>
              <li>
                <History aria-hidden="true" />
                <span>
                  v2<small>10 月 15 日</small>
                </span>
              </li>
            </ul>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(4)}>
          <Sheet icon={Mail} title="客户来信" sub="10 月 23 日">
            <p className="wv-page-text">
              「周报里说 B 公司企业版暂缓，这个判断从哪来的？」
            </p>
            <Line show={at(4, undefined, 900)}>
              <div className="ws-origin">
                <p className="wv-sub">[3] 客户访谈纪要 · 10/14 · 当时那一版</p>
                <p>
                  <Quote aria-hidden="true" />
                  企业版先放一放，等明年一季度的预算。
                </p>
              </div>
            </Line>
          </Sheet>
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   写文档 2 · 第一天：拖进资料文件夹、聊天记录、最近 7 天邮件 → 已读 23 份 → 项目建议四段 → 落进各自的插件
   ===================================================================== */

export const docFirst: Scene = {
  id: 'work-doc-first',
  label:
    'Molis Work 示意：新建项目「秋季用户调研」时，拖进资料文件夹、聊天记录导出和最近 7 天的邮件；读完 23 份，写出项目建议四段；你删了一条、改了一条；工作摘要、来源文稿和待办草稿落进各自的插件。',
  steps: 4,
  times: [0, 1.8, 3.6, 5.6, 8.2],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="ws-two"
      place="新建项目 · 秋季用户调研"
      icon={FolderOpen}
      press={[2, 3]}
    >
      <Swap className="wv-main">
        <div className="m-v" data-fade="" style={at(0, 2)}>
          <Sheet
            icon={FolderOpen}
            title="带入材料新建"
            sub="文件、网页、聊天记录、邮件"
          >
            <div className="ws-drop-zone">
              {[
                [FolderOpen, '资料文件夹', '14 份'],
                [MessagesSquare, '聊天记录导出', '1 份'],
                [Mail, '最近 7 天的邮件', '8 封'],
              ].map(([Icon, name, n], index) => {
                const I = Icon as LucideIcon;
                return (
                  <p
                    key={name as string}
                    className="ws-file m-v"
                    data-pop=""
                    style={at(0, undefined, 400 + index * 450)}
                  >
                    <I aria-hidden="true" />
                    <b>{name as string}</b>
                    <small>{n as string}</small>
                  </p>
                );
              })}
            </div>
            <Line show={at(1)}>
              <p className="ws-read">
                <i className="m-bar" style={at(1)} />
                <span>已读 23 份</span>
              </p>
            </Line>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(2)}>
          <Sheet
            icon={Sparkles}
            title="项目建议"
            sub="读完 23 份写的，删改都行"
          >
            <dl className="ws-brief">
              <dt>要做成什么</dt>
              <dd>弄清 30 位老用户为什么续费变少，11 月中给结论。</dd>
              <dt>已经知道的</dt>
              <dd>续费掉在第二年；客服记录里「价格」出现 41 次。</dd>
              <dt>还缺的</dt>
              <dd>
                <span className="ws-strike" data-on={step >= 2 || undefined}>
                  竞品价格表
                </span>
                <span
                  className="ws-edited m-v"
                  data-fade=""
                  style={at(2, undefined, 900)}
                >
                  访谈名单：先约 12 位
                </span>
              </dd>
              <dt>第一周</dt>
              <dd>定访谈提纲，约人，整理已有的客服记录。</dd>
            </dl>
            <p className="wv-btns">
              <span data-primary="" data-done={step >= 3 || undefined}>
                开始
                <Cursor show={at(2, 3)} x="60%" y="60%" />
              </span>
            </p>
          </Sheet>
        </div>
      </Swap>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 3)}>
          <Sheet icon={FolderOpen} title="材料" sub="原件留着">
            <ul className="wv-notes-plain">
              <li>访谈提纲草稿.docx</li>
              <li>客服记录 9 月.xlsx</li>
              <li>群聊：续费讨论.txt</li>
              <li>邮件：老用户回访 ×8</li>
            </ul>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(3)}>
          <Sheet icon={Check} title="第一天就有" sub="落在各自的插件里">
            <ul className="ws-landed">
              <li className="m-v" data-pop="" style={at(3, undefined, 200)}>
                <FileText aria-hidden="true" />
                <span>
                  工作摘要<small>Pages · 一页</small>
                </span>
              </li>
              <li className="m-v" data-pop="" style={at(3, undefined, 600)}>
                <BookOpen aria-hidden="true" />
                <span>
                  来源文稿<small>23 份 · 能点回原件</small>
                </span>
              </li>
              <li className="m-v" data-pop="" style={at(3, undefined, 1000)}>
                <ListChecks aria-hidden="true" />
                <span>
                  待办草稿<small>6 条 · 第一周的</small>
                </span>
              </li>
            </ul>
          </Sheet>
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   写文档 4 · 让助理挑刺：选中一段 → 浮条「提反例」→ 三条 → 删两条，留下的插在这段后面
   ===================================================================== */

const counters: [string, string][] = [
  ['重度用户更愿意按量付，订阅反而嫌贵', '2025 开发者调查 · 第 4 节'],
  ['企业采购看席位，不看个人订阅', '你的访谈笔记 · 9/28'],
  ['开源编辑器配自带模型，正在吃掉入门档', '行业周报 · 10/11'],
];

export const docPick: Scene = {
  id: 'work-doc-pick',
  label:
    'Molis Work 示意：在稿子里选中一段，浮条里点「提反例」；助理给出三条，各带出处；你删掉两条，留下的一条插在这段后面，出处跟着。',
  steps: 4,
  times: [0, 1.4, 3.0, 4.8, 7.2],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="ws-two"
      place="Pages · AI 编辑器观察"
      icon={FileText}
      press={[1]}
    >
      <Pin show={at(0, 2)} place={{ bottom: '1.2em', right: '1.2em' }}>
        助理
      </Pin>
      <Sheet
        icon={FileText}
        title="AI 编辑器观察"
        sub="草稿"
        className="wv-main"
      >
        <p className="wv-sec">三、怎么收费</p>
        <p className="wv-page-text">
          <span className="m-hl" style={at(1)}>
            订阅制会是 AI 编辑器的主流收费方式：六家里有四家按月订阅。
          </span>
        </p>
        <Bar
          show={at(1, 2)}
          below
          compact
          cursor={at(1, 2)}
          items={[
            { label: '提反例', icon: Sparkles, primary: true },
            { label: '找依据', icon: BookOpen },
            { label: '改写', icon: Wand },
          ]}
        />
        <Line show={at(3, undefined, 700)}>
          <p className="ws-insert">
            <b>反例：</b>
            {counters[1][0]}。
            <small className="wv-src">
              <NotebookPen aria-hidden="true" />
              {counters[1][1]}
            </small>
          </p>
        </Line>
        <p className="wv-page-text wv-dim">
          差别不在价格，在每档能接住多少工作流。
        </p>
      </Sheet>
      <div className="wv-side">
        <Assistant sub="对着选中的这段">
          <Line show={at(0, 2)}>
            <p className="wv-dim">选中稿子里的一段，就对着那一段说。</p>
          </Line>
          <Line show={at(2)}>
            <p className="wv-me">提反例</p>
          </Line>
          <div className="m-v" data-fade="" style={at(2, undefined, 400)}>
            <ol className="ws-counters">
              {counters.map(([text, from], index) => (
                <li
                  key={text}
                  data-out={(index !== 1 && step >= 3) || undefined}
                >
                  <span>{text}</span>
                  <small>{from}</small>
                </li>
              ))}
            </ol>
          </div>
        </Assistant>
      </div>
    </Win>
  ),
};

/* =====================================================================
   写文档 8 · 做成演示稿：对助理说「做成 5 页给周会」→ 一页页出来 → 导出 PPTX
   ===================================================================== */

const slides = [
  '这周看到的',
  '三个变化',
  '谁在动',
  '我们怎么应对',
  '要定的两件事',
];

export const docDeck: Scene = {
  id: 'work-doc-deck',
  label:
    'Molis Work 示意：对助理说「做成 5 页给周会」；演示稿一页页出来，每页的标题取自稿子的小节；导出 PPTX。',
  steps: 4,
  times: [0, 1.4, 3.2, 5.2, 7.2],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="ws-two"
      place="演示稿 · 周会"
      icon={Presentation}
      press={[3]}
    >
      <Swap className="wv-main">
        <div className="m-v" data-fade="" style={at(0, 2)}>
          <Sheet icon={FileText} title="竞品周报 第 12 期" sub="Pages">
            <p className="wv-sec">一、这周看到的</p>
            <p className="wv-page-text wv-dim">
              A 公司转向按席位收费；B 公司企业版暂缓……
            </p>
            <p className="wv-sec">二、三个变化</p>
            <p className="wv-page-text wv-dim">收费、渠道、招聘……</p>
            <p className="wv-sec">三、我们怎么应对</p>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(2)}>
          <Sheet icon={Presentation} title="周会 · 5 页" sub="演示稿">
            <ol className="ws-slides">
              {slides.map((title, index) => (
                <li
                  key={title}
                  className="m-v"
                  data-pop=""
                  style={at(2, undefined, index * 260)}
                >
                  <small>{index + 1}</small>
                  <b>{title}</b>
                  <i className="m-ln" />
                  <i className="m-ln" />
                </li>
              ))}
            </ol>
            <p className="wv-btns">
              <span data-primary="" data-done={step >= 3 || undefined}>
                导出 PPTX
                <Cursor show={at(3)} x="60%" y="60%" />
              </span>
            </p>
            <Line show={at(3, undefined, 800)}>
              <p className="wv-ok">已导出：周会.pptx</p>
            </Line>
          </Sheet>
        </div>
      </Swap>
      <div className="wv-side">
        <Assistant>
          <Line show={at(1)}>
            <p className="wv-me">做成 5 页给周会。</p>
          </Line>
          <Line show={at(1, undefined, 600)}>
            <p className="wv-tool">
              <Presentation aria-hidden="true" />
              演示稿 · 5 页
            </p>
          </Line>
          <Line show={at(2, undefined, 1400)}>
            <p className="wv-ai">
              按稿子的小节排了 5 页，最后一页是要周会定的两件事。
            </p>
          </Line>
        </Assistant>
      </div>
    </Win>
  ),
};

/* =====================================================================
   管事情 1 · 谁在等谁：纪要 2000 字 → 8 件分四栏，每条带原话 → 3 件可能已经记过 → 「下周三」= 10 月 28 日
   → 到了那天，首页提醒，助理起草催办，你自己发
   ===================================================================== */

const owe: { col: string; n: number; items: [string, string, boolean?][] }[] = [
  {
    col: '我答应的',
    n: 3,
    items: [
      ['周五前发报价', '「这个我周五给你」', true],
      ['补上移动端排期', '「我回去排一下」'],
    ],
  },
  {
    col: '在等别人的',
    n: 2,
    items: [
      ['法务回复合同', '「法务下周三回」'],
      ['设计稿第二版', '「小林月底给」', true],
    ],
  },
  { col: '要定的', n: 1, items: [['移动端放不放二期', '「这个得你拍板」']] },
  { col: '记一下', n: 2, items: [['王总下月出差', '「11 月不在」', true]] },
];

export const opsOwe: Scene = {
  id: 'work-ops-owe',
  label:
    'Molis Work 示意：一份 2000 字的周会纪要，整理出 8 件事，分成我答应的、在等别人的、要定的、记一下四栏，每条下面是原话；3 件标出「可能已经记过」；「下周三」换成了 10 月 28 日；到了那天，首页提醒「法务回复合同 · 约定今天跟进」，助理起草了催办，你自己发。',
  steps: 5,
  times: [0, 1.6, 3.4, 5.2, 7.4, 10.6],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="ws-owe"
      place="待办 · 周会纪要 10/22"
      icon={ListChecks}
      press={[4]}
      status={
        <span className="wv-menu" data-wait={step >= 4 || undefined}>
          <span className="m-stack">
            <span className="m-v" data-fade="" style={at(0, 4)}>
              10 月 22 日
            </span>
            <span className="m-v" data-fade="" style={at(4)}>
              10 月 28 日 · 今天
            </span>
          </span>
        </span>
      }
    >
      <Swap className="ws-owe-main">
        <div className="m-v" data-fade="" style={at(0, 1)}>
          <Sheet icon={FileText} title="周会纪要" sub="2,000 字 · 粘进来的">
            <p className="wv-page-text wv-dim">
              王总：移动端这个得你拍板……我这边周五给你报价……法务那边说下周三回……小林说设计稿月底给……11
              月王总不在……
            </p>
            <p className="ws-lines" aria-hidden="true">
              {[92, 80, 96, 70, 88, 60].map((w) => (
                <i key={w} className="m-ln" style={{ width: `${w}%` }} />
              ))}
            </p>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(1, 4)}>
          <Sheet icon={ListChecks} title="整理出 8 件" sub="每条下面是原话">
            <div className="ws-board">
              {owe.map((col) => (
                <section key={col.col}>
                  <p className="wv-sub">{`${col.col} · ${col.n}`}</p>
                  {col.items.map(([title, quote, seen]) => (
                    <div
                      key={title}
                      className="ws-card"
                      data-seen={(seen && step >= 2) || undefined}
                    >
                      <b>
                        {title === '法务回复合同' ? (
                          <>
                            法务回复合同
                            <span className="m-stack ws-date">
                              <span
                                className="m-v"
                                data-fade=""
                                style={at(1, 3)}
                              >
                                下周三
                              </span>
                              <span className="m-v" data-fade="" style={at(3)}>
                                10 月 28 日
                              </span>
                            </span>
                          </>
                        ) : (
                          title
                        )}
                      </b>
                      <small>{quote}</small>
                      {seen ? (
                        <span
                          className="ws-seen m-v"
                          data-fade=""
                          style={at(2)}
                        >
                          可能已经记过
                        </span>
                      ) : null}
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(4)}>
          <Sheet icon={House} title="首页" sub="10 月 28 日">
            <div className="wv-ask">
              <p>
                <CalendarClock aria-hidden="true" />
                <b>法务回复合同 · 约定今天跟进</b>
              </p>
              <p className="wv-impact">来自周会纪要 10/22 ·「法务下周三回」</p>
            </div>
            <Line show={at(4, undefined, 700)}>
              <div className="wv-back">
                <p>
                  <Who k="ai">
                    <Sparkles aria-hidden="true" />
                  </Who>
                  <b>助理起草的催办</b>
                  <span>你看过再发</span>
                </p>
                <p className="wv-back-text">
                  张律师您好，上周三说本周回复合同修改意见，想确认一下今天能否收到？
                </p>
                <p className="wv-btns">
                  <span data-primary="">
                    复制去发
                    <Cursor show={at(4, undefined, 900)} x="60%" y="60%" />
                  </span>
                  <span>改一改</span>
                </p>
              </div>
            </Line>
          </Sheet>
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   管事情 2 · 说好的范围：客户问「不是说好包含移动端吗」→ 当时那一版约定和决定记录 → 你同意加范围 → 旧验收作废
   ===================================================================== */

export const opsScope: Scene = {
  id: 'work-ops-scope',
  label:
    'Molis Work 示意：客户来信「不是说好包含移动端吗」；打开目标「官网改版」当时那一版约定和决定记录：9 月 3 日定了移动端放二期；你同意这次加上，新增一条要求、写明原因；之前的验收作废，按新约定重新验。',
  steps: 5,
  times: [0, 1.4, 3.0, 4.8, 6.6, 9.0],
  note: '已发布 · v0.2.0 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="ws-two"
      place="Goals · 官网改版"
      icon={Target}
      press={[1, 3]}
    >
      <Sheet
        icon={Target}
        title="官网改版"
        sub={
          <span className="m-stack">
            <span className="m-v" data-fade="" style={at(0, 3)}>
              约定 v2 · 9 月 3 日
            </span>
            <span className="m-v" data-fade="" style={at(3)}>
              约定 v3 · 今天
            </span>
          </span>
        }
        className="wv-main"
      >
        <ul className="wv-reqs wv-reqs-big">
          <li>
            <Tick step={0} />
            <span>
              桌面端 6 个页面<small>验收：你 · 10/12</small>
            </span>
          </li>
          <li data-wait={step >= 4 || undefined}>
            <span className="m-stack ws-tick-swap">
              <span className="m-v" data-fade="" style={at(0, 4)}>
                <Tick step={0} />
              </span>
              <span className="m-v" data-fade="" style={at(4)}>
                <Tick step={99} tone="wait" />
              </span>
            </span>
            <span>
              上线前全站检查
              <small className="m-stack">
                <span className="m-v" data-fade="" style={at(0, 4)}>
                  验收：你 · 10/14
                </span>
                <span className="m-v wv-wait" data-fade="" style={at(4)}>
                  验收作废 · 约定改了，按新约定重新验
                </span>
              </small>
            </span>
          </li>
          <li className="ws-scope-line">
            <span className="m-stack">
              <span className="m-v" data-fade="" style={at(0, 3)}>
                <span className="m-hl" style={at(1)}>
                  不含移动端适配（放二期）
                </span>
              </span>
              <span className="m-v" data-fade="" style={at(3)}>
                <Tick step={99} />
                移动端适配
                <small>新增 · 原因：王总 10/16 来信，同意延期 2 周</small>
              </span>
            </span>
          </li>
        </ul>
        <Line show={at(1)}>
          <div className="wv-back">
            <p>
              <History aria-hidden="true" />
              <b>决定记录 · 9 月 3 日</b>
              <span>当时那一版</span>
            </p>
            <p className="wv-back-text">移动端放二期。王总在评审会上同意。</p>
          </div>
        </Line>
      </Sheet>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 2)}>
          <Sheet icon={Mail} title="Inbox" sub="只放要你处理的">
            <ul className="wv-list">
              <li data-on="">
                <Mail aria-hidden="true" />
                <span>
                  王总：不是说好包含移动端吗？
                  <small className="wv-why">和目标「官网改版」的范围有关</small>
                </span>
              </li>
            </ul>
            <p className="wv-btns">
              <span data-primary="">
                看当时的约定
                <Cursor show={at(1, 2)} x="60%" y="60%" />
              </span>
            </p>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(2)}>
          <div className="wv-ask ws-side-ask">
            <p>
              <Who k="me">你</Who>
              <b>改约定：加上移动端适配</b>
            </p>
            <p className="wv-impact">影响：工期多 2 周 · 之前的验收要重新做</p>
            <p className="wv-btns">
              <span data-primary="" data-done={step >= 3 || undefined}>
                确认改
                <Cursor show={at(2, 3)} x="60%" y="60%" />
              </span>
              <span>先不</span>
            </p>
            <Line show={at(3, undefined, 400)}>
              <p className="wv-ok">已记进决定记录 · 你，今天</p>
            </Line>
          </div>
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   管事情 3 · 明早见客户：对助理说「明早见王总」→ 一页：上次答应的三件、最近两封来信、一个没结的问题，每条能点回原处
   ===================================================================== */

export const opsMeet: Scene = {
  id: 'work-ops-meet',
  label:
    'Molis Work 示意：对助理说「明早见王总，帮我备一下」；它从邮件、待办和目标里找出来，写成一页：上次答应的三件、最近两封来信、一个没结的问题，每条都能点回原处。',
  steps: 4,
  times: [0, 1.4, 3.0, 5.0, 7.6],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="ws-two"
      place="Pages · 明早见王总"
      icon={FileText}
      press={[3]}
    >
      <Sheet
        icon={FileText}
        title="明早见王总"
        sub="10 月 23 日 9:30"
        className="wv-main"
      >
        <Swap>
          <div className="m-v" data-fade="" style={at(1, 2)}>
            <p className="ws-lines" aria-hidden="true">
              {[88, 64, 92, 50].map((w) => (
                <i key={w} className="m-ln" style={{ width: `${w}%` }} />
              ))}
            </p>
          </div>
          <div className="m-v" data-fade="" style={at(2)}>
            <div className="ws-prep">
              <p className="wv-sub">上次答应的</p>
              <ul className="wv-reqs">
                <li>
                  <Tick step={2} delay={200} />
                  报价发了<small>邮件 · 10/16</small>
                </li>
                <li>
                  <Tick step={2} delay={400} />
                  移动端加进范围<small>目标 · 官网改版</small>
                </li>
                <li>
                  <Tick step={99} tone="wait" />
                  设计稿第二版
                  <small className="wv-wait">还没到 · 小林月底给</small>
                </li>
              </ul>
              <p className="wv-sub">最近两封来信</p>
              <ul className="wv-notes-plain">
                <li>
                  想在双十一前上线首页<small>邮件 · 10/20</small>
                </li>
                <li data-on={step >= 3 || undefined} className="ws-src-row">
                  发票抬头要改<small>邮件 · 10/21</small>
                  <Cursor show={at(3)} x="40%" y="60%" />
                </li>
              </ul>
              <p className="wv-sub">没结的</p>
              <p className="wv-wait">二期要不要做小程序：上次说「回去想想」</p>
            </div>
          </div>
        </Swap>
      </Sheet>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 3)}>
          <Assistant>
            <p className="wv-me">明早见王总，帮我备一下。</p>
            <Line show={at(1)}>
              <p className="wv-tool">
                <Mail aria-hidden="true" />
                邮件 · 5 封
              </p>
            </Line>
            <Line show={at(1, undefined, 300)}>
              <p className="wv-tool">
                <ListChecks aria-hidden="true" />
                待办 · 3 条
              </p>
            </Line>
            <Line show={at(1, undefined, 600)}>
              <p className="wv-tool">
                <Target aria-hidden="true" />
                目标 · 官网改版
              </p>
            </Line>
            <Line show={at(2, undefined, 300)}>
              <p className="wv-ai">写成一页了，每条都能点回原处。</p>
            </Line>
          </Assistant>
        </div>
        <div className="m-v" data-fade="" style={at(3)}>
          <Sheet icon={Mail} title="王总 · 10 月 21 日" sub="原邮件">
            <p className="wv-page-text">
              另外，
              <span className="m-hl" style={at(3)}>
                发票抬头改成新公司名
              </span>
              ，之前那张作废。
            </p>
          </Sheet>
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   管事情 6 · 说一句做个核对器：插件创作工作台 → 试跑 → 装上 → 客户第二版清单拖进来，对不上的三行先标出来
   ===================================================================== */

const quote: [string, string, string, string?][] = [
  ['X200 主机', '40 台', '¥3,200'],
  ['X300 主机', '20 台', '¥4,100', '型号：上一版是 X200'],
  ['显示器 27 寸', '60 台', '¥1,350', '数量：上一版 40 台'],
  ['安装服务', '1 项', '¥6,000', '单价低于批准价 ¥8,000'],
];

export const opsTool: Scene = {
  id: 'work-ops-tool',
  label:
    'Molis Work 示意：在插件创作工作台说一句，做出「报价前核对器」；试跑通过，你点头装上，底栏多一个图标；把客户的第二版清单拖进来，型号、数量、单价对不上的三行先标出来。',
  steps: 5,
  times: [0, 1.2, 2.8, 4.4, 6.0, 8.2],
  note: '开发中 · 预览 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="wv-grow"
      place="客户 · 华东门店"
      icon={Calculator}
      press={[2]}
    >
      <Swap className="wv-main">
        <div className="m-v" data-fade="" style={at(0, 3)}>
          <Studio
            icon={Calculator}
            name="报价前核对器"
            prompt="做一个报价前核对器：客户的新清单和上一版、批准价逐行对，型号、数量、单价对不上的先标出来。"
            checks={['Agent 先给方案', '在沙箱里写代码和试跑', '通过检查']}
          />
        </div>
        <div className="m-v" data-fade="" style={at(3)}>
          <Sheet icon={Calculator} title="报价前核对器" sub="你做的插件">
            <p className="ws-file ws-file-in m-v" data-pop="" style={at(3)}>
              <FileSpreadsheet aria-hidden="true" />
              <b>客户清单 第二版.xlsx</b>
              <small>对比：第一版 · 批准价表</small>
            </p>
            <table className="wv-table ws-quote">
              <thead>
                <tr>
                  <th>项目</th>
                  <th>数量</th>
                  <th>单价</th>
                </tr>
              </thead>
              <tbody>
                {quote.map(([item, n, price, flag], index) => (
                  <tr
                    key={item}
                    data-flag={(flag && step >= 4) || undefined}
                    style={{ '--dd': `${index * 250}ms` } as Vars}
                  >
                    <td>
                      {item}
                      {flag ? (
                        <small
                          className="m-v"
                          data-fade=""
                          style={at(4, undefined, index * 250)}
                        >
                          {flag}
                        </small>
                      ) : null}
                    </td>
                    <td>{n}</td>
                    <td>{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Sheet>
        </div>
      </Swap>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 3)}>
          <Sheet icon={Wand} title="底栏" sub="新插件钉在这里">
            <p className="wv-dock">
              {[Target, Inbox, FileText, ListChecks].map((Icon, index) => (
                <span key={index}>
                  <Icon aria-hidden="true" />
                </span>
              ))}
              <span
                className="wv-dock-new m-v"
                data-pop=""
                style={at(2, undefined, 700)}
              >
                <Calculator aria-hidden="true" />
              </span>
            </p>
            <Line show={at(2)}>
              <div className="wv-ask">
                <p>
                  <Wand aria-hidden="true" />
                  <b>试跑通过，装进「华东门店」？</b>
                </p>
                <p className="wv-btns">
                  <span data-primary="">
                    装上
                    <Cursor show={at(2, 3)} x="60%" y="60%" />
                  </span>
                  <span>再改改</span>
                </p>
              </div>
            </Line>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(3)}>
          <Assistant>
            <p className="wv-me">第二版报价能发吗？</p>
            <Line show={at(4)}>
              <p className="wv-tool">
                <Calculator aria-hidden="true" />
                报价前核对器 · 你做的
              </p>
            </Line>
            <Line show={at(4, undefined, 900)}>
              <p className="wv-ai">
                先别发：3 行对不上，安装服务低于批准价，要你点头。
              </p>
            </Line>
          </Assistant>
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   管事情 7 · 范围改了：评审会砍掉一条 → 你在目标上改约定 → 开发那边的 Agent 下次读到的就是新的
   ===================================================================== */

export const opsChange: Scene = {
  id: 'work-ops-change',
  label:
    'Molis Work 示意：评审会上砍掉「家庭共享」；你在目标「会员订阅上线」上改约定，写明原因；开发那边的 Claude Code 下一次读目标，读到的就是新的一版，跳过了家庭共享的活。',
  steps: 4,
  times: [0, 1.4, 3.0, 4.8, 7.2],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="ws-two"
      place="Goals · 会员订阅上线"
      icon={Target}
      press={[1, 2]}
    >
      <Sheet
        icon={Target}
        title="会员订阅上线"
        sub={
          <span className="m-stack">
            <span className="m-v" data-fade="" style={at(0, 2)}>
              约定 v2
            </span>
            <span className="m-v" data-fade="" style={at(2)}>
              约定 v3 · 你，今天
            </span>
          </span>
        }
        className="wv-main"
      >
        <ul className="wv-reqs wv-reqs-big">
          <li>
            <Tick step={99} />
            <span>
              月付、年付两档<small>Claude Code 在做</small>
            </span>
          </li>
          <li>
            <Tick step={99} />
            <span>
              老用户下月起按新价<small>阿哲在做</small>
            </span>
          </li>
          <li className="ws-cut" data-on={step >= 2 || undefined}>
            <Tick step={99} />
            <span>
              家庭共享
              <small className="m-stack">
                <span className="m-v" data-fade="" style={at(0, 2)}>
                  还没开始
                </span>
                <span className="m-v wv-wait" data-fade="" style={at(2)}>
                  移出范围 · 原因：评审会 10/16 决定放到下个版本
                </span>
              </small>
            </span>
            <Cursor show={at(1, 2)} x="40%" y="50%" />
          </li>
        </ul>
        <Bar
          show={at(1, 2)}
          below
          compact
          items={[
            { label: '改约定', icon: Target, primary: true },
            { label: '记成待办', icon: ListChecks },
          ]}
        />
      </Sheet>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 3)}>
          <Sheet icon={MessagesSquare} title="评审会纪要" sub="10 月 16 日">
            <p className="wv-page-text">
              <span className="m-hl" style={at(0)}>
                家庭共享这次不做
              </span>
              ，放到下个版本；月付年付照常。
            </p>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(3)}>
          <Term name="Claude Code" bind="开发那边 · 会员订阅上线">
            <Line show={at(3, undefined, 100)} className="wv-u">
              读目标：会员订阅上线
            </Line>
            <Line show={at(3, undefined, 600)}>
              读到约定 v3：家庭共享已移出
            </Line>
            <Line show={at(3, undefined, 1100)} className="wv-okl">
              ✓ 跳过家庭共享，接着做年付
            </Line>
          </Term>
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   管事情 8 · 早上打开（规划中）：首页一页简报，三个选项，点一个，助理接着做
   ===================================================================== */

export const opsMorning: Scene = {
  id: 'work-ops-morning',
  label:
    'Molis Work 概念示意（规划中）：早上打开，首页一页简报：昨天三个目标，一个完成、一个等你验收、一个卡在客户回复；底下三个选项，点一个，助理接着做。',
  steps: 3,
  times: [0, 1.6, 3.8, 6.6],
  note: '规划中 · 概念示意',
  render: ({ step }) => (
    <Win step={step} className="ws-one" place="首页" icon={House} press={[2]}>
      <Sheet icon={Sun} title="早上好" sub="10 月 26 日 周一">
        <ul className="ws-brief-list">
          <li className="m-v" data-fade="" style={at(0, undefined, 200)}>
            <Tick step={0} />
            <b>年会物料</b>
            <span>完成了 · 交给了行政</span>
          </li>
          <li
            className="m-v"
            data-fade=""
            style={at(0, undefined, 500)}
            data-wait=""
          >
            <Tick step={99} tone="wait" />
            <b>会员订阅上线</b>
            <span className="wv-wait">等你验收：年付流程</span>
          </li>
          <li className="m-v" data-fade="" style={at(0, undefined, 800)}>
            <CircleDot aria-hidden="true" />
            <b>官网改版</b>
            <span>卡在客户回复：移动端设计稿，已经 3 天</span>
          </li>
        </ul>
        <div className="m-v" data-fade="" style={at(1)}>
          <p className="wv-sub">今天先做哪件？</p>
          <p className="ws-opts ws-opts-wide">
            <span data-picked={step >= 2 || undefined}>
              先验收年付流程
              <Cursor show={at(1, 2)} x="60%" y="60%" />
            </span>
            <span data-out={step >= 2 || undefined}>催一下王总</span>
            <span data-out={step >= 2 || undefined}>排今天的会</span>
          </p>
        </div>
        <Line show={at(2, undefined, 300)}>
          <p className="wv-ledger-landed">
            <Sparkles aria-hidden="true" />
            <span>助理接着做：打开年付流程的验收清单，三条依据放在一起</span>
          </p>
        </Line>
      </Sheet>
    </Win>
  ),
};
