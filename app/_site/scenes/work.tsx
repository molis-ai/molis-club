'use client';
import {
  BookOpen,
  CalendarDays,
  Check,
  CircleDot,
  ClipboardCheck,
  CornerDownLeft,
  FileText,
  GitPullRequest,
  Inbox,
  Lightbulb,
  ListChecks,
  ListOrdered,
  Mail,
  MessagesSquare,
  NotebookPen,
  Package,
  Play,
  Rss,
  Sparkles,
  Target,
  Terminal,
  Timer,
  Wand,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { at, Canvas, Cursor, type Scene } from '../demo/demo';
import './work.css';

// Molis Work 的演示画面：照 Molis Work 自己的窗口（Soft Workbench：珍珠灰的桌面、白纸、石墨色的动作、铜色的「在等」）。
// 演示区外面是 Work 的木色，成功是植物绿。这里是窗口零件和几段已经做好的画面；
// Work 页首屏舞台按路把它们和 work-stage.tsx 里的新画面排成每条路八段。
// 画面里的项目、人名、数字都是示意数据；每段的阶段标在 content/site/work.ts 的章节上。

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const Tick = ({ step, delay, tone }: { step: number; delay?: number; tone?: 'wait' }) => (
  <i className="m-tick" data-tone={tone} style={at(step, undefined, delay)}>
    <Check strokeWidth={3} aria-hidden="true" />
  </i>
);

/** 一段只在某几步出现、出现前不占位置的行（终端、对话、列表里新来的一条） */
export function Line({
  show,
  className = '',
  children,
}: {
  show: Vars;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`m-v wv-line ${className}`} style={show}>
      <div>{children}</div>
    </div>
  );
}

/** Molis Work 的窗口：一道窄标题栏（位置）+ 桌面上的几张纸 */
export function Win({
  step,
  className,
  place,
  icon: Icon,
  status,
  press,
  children,
}: {
  step: number;
  className: string;
  place: string;
  icon: LucideIcon;
  /** 标题栏右边：在跑的、等你的 */
  status?: ReactNode;
  press?: number[];
  children: ReactNode;
}) {
  return (
    <Canvas step={step} className={`wv ${className}`} press={press}>
      <div className="wv-win">
        <p className="wv-bar">
          <span className="wv-lights" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="wv-loc">
            <Icon aria-hidden="true" />
            {place}
          </span>
          {status ? <span className="wv-status">{status}</span> : null}
        </p>
        <div className="wv-desk">{children}</div>
      </div>
    </Canvas>
  );
}

export function Sheet({
  icon: Icon,
  title,
  sub,
  className = '',
  children,
}: {
  icon?: LucideIcon;
  title?: ReactNode;
  sub?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`wv-sheet ${className}`}>
      {title ? (
        <p className="wv-head">
          {Icon ? <Icon aria-hidden="true" /> : null}
          <b>{title}</b>
          {sub ? <span>{sub}</span> : null}
        </p>
      ) : null}
      <div className="wv-body">{children}</div>
    </section>
  );
}

/** 同一个位置上前后换几张纸（右栏从 Inbox 换到终端……） */
export const Swap = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`wv-swap ${className}`}>{children}</div>
);

export type BarItem = { label: string; icon?: LucideIcon; primary?: boolean; tag?: string };

/** 浮条：选中的东西旁边递来两三个动作；光标点在第一个上 */
export function Bar({
  show,
  items,
  land,
  cursor,
  below = false,
  compact = false,
}: {
  show: Vars;
  items: BarItem[];
  /** 放到哪里（「第 2 节」） */
  land?: string;
  cursor?: Vars;
  below?: boolean;
  /** 窄的右栏里：不带「助理」那一格 */
  compact?: boolean;
}) {
  return (
    <span className="wv-anchor" data-below={below || undefined}>
      <span className="wv-tb m-v" data-pop="" style={show}>
        {land ? <span className="wv-tb-land">→ {land}</span> : null}
        {items.map((item) => (
          <span key={item.label} data-primary={item.primary || undefined}>
            {item.icon ? <item.icon aria-hidden="true" /> : null}
            {item.label}
            {item.tag ? <small>{item.tag}</small> : null}
            {item.primary && cursor ? <Cursor show={cursor} x="58%" y="58%" /> : null}
          </span>
        ))}
        {compact ? null : (
          <span className="wv-tb-ai">
            <Sparkles aria-hidden="true" />
            助理
          </span>
        )}
      </span>
    </span>
  );
}

/** 终端：Agent 在这里干活，终端绑着目标 */
export function Term({
  name,
  bind,
  children,
  className = '',
}: {
  name: string;
  bind: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`wv-term ${className}`}>
      <p className="wv-term-head">
        <Terminal aria-hidden="true" />
        <b>{name}</b>
        <span>{bind}</span>
      </p>
      <div className="wv-term-lines">{children}</div>
    </section>
  );
}

export const Who = ({ k, children }: { k: 'cc' | 'cx' | 'ds' | 'me' | 'ai' | 'p'; children: ReactNode }) => (
  <span className="wv-who" data-k={k}>
    {children}
  </span>
);

/* =====================================================================
   首屏：同一页，几个人在写（一个短循环）
   写代码：一页目标，Claude Code、Codex 和你写在同一条时间线上；做没做完，按要求和依据核对（v0.2.0 已有）。
   写文档：一页稿子，你写的、助理整理的都在同一页，每段带出处；选中一句，记成待办（开发中）。
   ===================================================================== */

export const heroDev: Scene = {
  id: 'work-hero-ledger-dev',
  label:
    'Molis Work 示意：一页目标「上线支付」，三条完成要求。Claude Code 交了依据，第一条打勾；周三 Codex 接着做，读到做成 1/3；Codex 提议把金额改成「分」，等你同意；沙箱走通，第二条打勾；Codex 说做完了，收尾没生效：手机排版还差你的验收。',
  steps: 5,
  times: [0, 1.8, 3.8, 6, 8, 11],
  note: '已发布 · v0.2.0 · 界面示意',
  render: ({ step }) => (
    <Win
      step={step}
      className="wv-hero wv-ledger"
      place="Goals · 支付改版"
      icon={Target}
      press={[2]}
      status={
        <span className="wv-menu" data-wait={step === 2 || step === 4 || undefined}>
          <Target aria-hidden="true" />
          <span className="m-stack">
            <span className="m-v" data-fade="" style={at(0, 2)}>2 个 Agent 在做</span>
            <span className="m-v" data-fade="" style={at(2, 3)}>1 个提议等你</span>
            <span className="m-v" data-fade="" style={at(3, 4)}>2 个 Agent 在做</span>
            <span className="m-v" data-fade="" style={at(4)}>等你验收</span>
          </span>
        </span>
      }
    >
      <Sheet>
        <p className="wv-ledger-title">
          <b>上线支付</b>
          <span className="m-stack wv-pills">
            <span className="wv-pill m-v" data-fade="" style={at(0, 3)}>进行中 · 1/3</span>
            <span className="wv-pill m-v" data-fade="" style={at(3, 4)}>进行中 · 2/3</span>
            <span className="wv-pill m-v" data-tone="wait" data-fade="" style={at(4)}>没算完 · 2/3</span>
          </span>
        </p>
        <ul className="wv-reqs wv-ledger-reqs">
          <li>
            <Tick step={0} />
            回调幂等
            <small>依据：测试 14/14 · Claude Code</small>
          </li>
          <li>
            <Tick step={3} delay={500} />
            沙箱三种支付走通
            <small className="m-v" data-fade="" style={at(3, undefined, 500)}>
              依据：沙箱 3 笔 · Codex
            </small>
          </li>
          <li data-wait={step >= 4 || undefined}>
            <Tick step={99} />
            手机排版正常
            <span className="wv-must">要你验收</span>
          </li>
        </ul>
        <div className="wv-tl wv-ledger-tl">
          <p>
            <Who k="cc">CC</Who>
            <span>
              <b>Claude Code</b>回调做完，交了依据
            </span>
            <time>周二</time>
          </p>
          <Line show={at(1)}>
            <p>
              <Who k="cx">Cx</Who>
              <span>
                <b>Codex</b>接着做：读到做成 1/3，下一步沙箱
              </span>
              <time>周三</time>
            </p>
          </Line>
          <Line show={at(2, 3)}>
            <div className="wv-ask">
              <p>
                <Who k="cx">Cx</Who>
                <b>Codex 提议：金额统一用「分」</b>
              </p>
              <p className="wv-impact">影响：结算页 · 2 处 · 等你确认</p>
              <p className="wv-btns">
                <span data-primary="">
                  同意
                  <Cursor show={at(2, 3)} x="60%" y="60%" />
                </span>
                <span>先不</span>
              </p>
            </div>
          </Line>
          <Line show={at(3)}>
            <p>
              <Who k="me">你</Who>
              <span>同意了：金额用「分」</span>
              <time>周三</time>
            </p>
          </Line>
          <Line show={at(3, undefined, 500)}>
            <p>
              <Who k="cx">Cx</Who>
              <span>
                <b>Codex</b>沙箱 3 笔成功，交了依据
              </span>
              <time>周四</time>
            </p>
          </Line>
          <Line show={at(4)}>
            <p className="wv-ledger-no">
              <Who k="cx">Cx</Who>
              <span>
                <b>Codex</b>说做完了 · 收尾没生效：手机排版还差你的验收
              </span>
            </p>
          </Line>
        </div>
      </Sheet>
    </Win>
  ),
};

/* =====================================================================
   递 · 写代码：Inbox 的报错交给 Codex，改完交给 Claude Code 复核
   ===================================================================== */

export const giveDev: Scene = {
  id: 'work-give-dev',
  label:
    'Molis Work 示意：Inbox 递来报错 #318；选中报错交给 Codex，交接包带上目标、约束和进度；Codex 的改动回到同一页，再交给 Claude Code 复核。',
  steps: 5,
  times: [0, 1.2, 2.4, 3.8, 5.2, 6.8],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win step={step} className="wv-give" place="Inbox · #318" icon={Inbox} press={[1]}>
      <Sheet icon={CircleDot} title="#318 支付回调偶发 500" sub="molis-pay" className="wv-main">
        <p className="wv-why wv-why-line">和目标「上线支付」有关</p>
        <pre className="wv-log">
          <span className="wv-log-em">POST /api/pay/callback → 500</span>
          {'\n'}
          <span className="m-hl" style={at(1)}>
            SignatureExpired: skew 312s
          </span>
          {'\n'}
          {'  at verifySign (callback.ts:42)'}
        </pre>
        <Bar
          show={at(1, 2)}
          below
          compact
          cursor={at(1, 2)}
          items={[
            { label: '交给 Codex', icon: Terminal, primary: true },
            { label: '交给 Claude Code', icon: Terminal },
            { label: '记成待办', icon: ListChecks },
          ]}
        />
        <Line show={at(2, 3)} className="wv-pack-line">
          <div className="wv-pack">
            <p className="wv-pack-head">
              <Package aria-hidden="true" />
              <b>交给 Codex</b>
              <span>已经带上</span>
            </p>
            <ul>
              {['报错原文', '目标的 3 条完成要求', '设计文档里的约束', 'Claude Code 的进度'].map(
                (item, index) => (
                  <li key={item}>
                    <Tick step={2} delay={150 + index * 180} />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </Line>
        <Line show={at(3)}>
          <div className="wv-back">
            <p>
              <Who k="cx">Cx</Who>
              <b>Codex 的改动</b>
              <span>回到这一页</span>
            </p>
            <p className="wv-back-text">验签允许 5 分钟偏差；订单号做幂等键。</p>
            <small className="wv-ok">2 个文件 · 测试 8/8 通过</small>
          </div>
        </Line>
        <Line show={at(4)}>
          <div className="wv-back">
            <p>
              <Who k="cc">CC</Who>
              <b>Claude Code 复核</b>
              <span>2 条通过，1 条建议</span>
            </p>
            <p className="wv-back-text">Safari 14 付款后跳回订单页，没覆盖到。</p>
            <small className="wv-wait">已记成待办 · 连着 #318</small>
          </div>
        </Line>
      </Sheet>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 3)}>
          <Sheet icon={Inbox} title="Inbox" sub="只放要你处理的">
            <ul className="wv-list">
              <li data-on="">
                <CircleDot aria-hidden="true" />
                <span>
                  #318 支付回调偶发 500
                  <small className="wv-why">和目标「上线支付」有关</small>
                </span>
              </li>
              <li>
                <Mail aria-hidden="true" />
                <span>
                  客户：付了款还是待支付<small>和 #318 是同一件事</small>
                </span>
              </li>
              <li>
                <GitPullRequest aria-hidden="true" />
                <span>
                  #315 依赖升级<small>在等你 review</small>
                </span>
              </li>
            </ul>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(3, 4)}>
          <Term name="Codex" bind="目标：上线支付">
            <Line show={at(3, undefined, 100)} className="wv-u">读到交接包：#318、要求、约束、进度</Line>
            <Line show={at(3, undefined, 500)}>按「回调必须幂等」来改</Line>
            <Line show={at(3, undefined, 900)} className="wv-okl">✓ 测试 8/8</Line>
          </Term>
        </div>
        <div className="m-v" data-fade="" style={at(4)}>
          <Term name="Claude Code" bind="复核">
            <Line show={at(4, undefined, 100)} className="wv-u">复核 Codex 对 #318 的改动</Line>
            <Line show={at(4, undefined, 400)} className="wv-okl">✓ 验签偏差 · ✓ 幂等键</Line>
            <Line show={at(4, undefined, 800)} className="wv-warnl">△ 没覆盖：Safari 14 跳转</Line>
          </Term>
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   递 · 写文档：视频里的一句放进第 2 节，自己的观点从旧笔记里找到依据
   ===================================================================== */

export const giveDoc: Scene = {
  id: 'work-give-doc',
  label:
    'Molis Work 示意：Inbox 说频道更新和你在写的稿子有关；灵光读出字幕，选中 12:40 的一句放进第 2 节，出处跟着；你的观点从 Obsidian 旧笔记里找到 3 条依据。',
  steps: 5,
  times: [0, 1.2, 2.4, 3.6, 5.0, 6.6],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win step={step} className="wv-give wv-give-doc" place="Pages · AI 编辑器观察" icon={FileText} press={[2]}>
      <Sheet icon={FileText} title="AI 编辑器观察" sub="草稿" className="wv-main">
        <p className="wv-sec">二、编辑器在变成什么</p>
        <p className="wv-page-text">
          <span className="m-hl" style={at(4)}>
            AI 编辑器的护城河不在模型，在工作流。
          </span>
          <sup className="wv-fn m-v" data-fade="" style={at(4, undefined, 500)}>
            [1]
          </sup>
          一位做编辑器的创始人说：
          <span className="wv-put m-v" data-fade="" style={at(3)}>
            “现在真正拉开差距的，是它能不能接住你手上的整个工作流。”
            <small className="wv-src">
              <Play aria-hidden="true" />
              视频 · 12:40
            </small>
          </span>
        </p>
        <p className="wv-sec wv-dim">三、还没写</p>
        <Line show={at(4, undefined, 700)}>
          <p className="wv-foot">[1] 2024-03 读书笔记 · 平台的粘性来自工作流</p>
        </Line>
      </Sheet>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 1)}>
          <Sheet icon={Inbox} title="Inbox" sub="只放要你处理的">
            <ul className="wv-list">
              <li data-on="">
                <Rss aria-hidden="true" />
                <span>
                  频道更新：《AI 编辑器的下一步》
                  <small className="wv-why">和你在写的《AI 编辑器观察》有关</small>
                </span>
              </li>
              <li>
                <Mail aria-hidden="true" />
                <span>
                  编辑：周五前能交初稿吗<small>在等你回复</small>
                </span>
              </li>
            </ul>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(1, 4)}>
          <Sheet icon={Lightbulb} title="灵光" sub="读出了字幕">
            <div className="wv-video" aria-hidden="true">
              <Play />
            </div>
            <div className="wv-tr">
              <time>12:40</time>
              <p>
                <span className="m-hl" style={at(2)}>
                  现在真正拉开差距的，是它能不能接住你手上的整个工作流。
                </span>
              </p>
            </div>
            <Bar
              show={at(2, 3)}
              below
              compact
              land="第 2 节"
              cursor={at(2, 3)}
              items={[
                { label: '放进去', icon: CornerDownLeft, primary: true },
                { label: '记下灵光', icon: Lightbulb },
              ]}
            />
            <div className="wv-tr">
              <time>13:15</time>
              <p className="wv-dim">模型会越来越像，体验不会。</p>
            </div>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(4)}>
          <Sheet icon={BookOpen} title="Cognia" sub="在你的资料里找到 3 条">
            <ul className="wv-notes">
              <li data-on="">
                平台的粘性来自工作流，不是功能<small>2024-03 读书笔记 · Obsidian</small>
              </li>
              <li>
                设计师为什么不肯换工具<small>2025-07 访谈 · Obsidian</small>
              </li>
              <li>
                换工具，是换掉一套习惯<small>2026-01 随记 · Obsidian</small>
              </li>
            </ul>
          </Sheet>
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   长 · 写代码：一句话做出发版清单
   ===================================================================== */

export const Studio = ({ prompt, checks, name, icon: Icon }: { prompt: string; checks: string[]; name: string; icon: LucideIcon }) => (
  <Sheet icon={Wand} title="插件创作工作台" sub="用一句话做插件">
    <p className="wv-prompt">{prompt}</p>
    <ul className="wv-checks">
      {checks.map((item, index) => (
        <li key={item}>
          <Tick step={1} delay={index * 260} />
          {item}
        </li>
      ))}
    </ul>
    <p className="wv-newtile m-v" data-pop="" style={at(1, undefined, 1200)}>
      <span>
        <Icon aria-hidden="true" />
      </span>
      <b>{name}</b>
      <small>你做的插件 · Agent 也能调用</small>
    </p>
  </Sheet>
);

export const Flow = ({ stations, when }: { stations: [LucideIcon, string][]; when: string }) => (
  <Sheet icon={Workflow} title="工作流程" sub="存成每周的">
    <ol className="wv-flow">
      {stations.map(([Icon, name], index) => (
        <li key={name} className="m-v" data-pop="" style={at(0, undefined, index * 160)}>
          <span data-mine={index === 1 || undefined}>
            <Icon aria-hidden="true" />
          </span>
          {name}
        </li>
      ))}
    </ol>
    <p className="wv-when">
      <Timer aria-hidden="true" />
      {when}
    </p>
  </Sheet>
);

export const growDev: Scene = {
  id: 'work-grow-dev',
  label:
    'Molis Work 示意：在插件创作工作台说一句，做出「发版清单」；Claude Code 问能不能发，调用的就是它；Inbox 里选中刚合并的 PR，浮条递来「放进发版清单」；再存成每周五自己跑的流程。',
  steps: 5,
  times: [0, 1.2, 2.6, 4.0, 5.4, 7.0],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win step={step} className="wv-grow" place="支付改版" icon={Package} press={[3]}>
      <Swap className="wv-main">
        <div className="m-v" data-fade="" style={at(0, 2)}>
          <Studio
            icon={ClipboardCheck}
            name="发版清单"
            prompt="做一个发版清单：这一版完成了哪些目标、哪条还没依据，再起草发布说明。"
            checks={['Agent 先给方案', '在沙箱里写代码和测试', '通过检查和验收', '装进「支付改版」']}
          />
        </div>
        <div className="m-v" data-fade="" style={at(2)}>
          <Sheet icon={ClipboardCheck} title="发版清单" sub="你做的插件">
            <p className="wv-sub">这一版完成的目标</p>
            <ul className="wv-reqs">
              <li>
                <Tick step={2} />
                支付接口<small>沙箱 3 笔 · 14/14</small>
              </li>
              <li>
                <Tick step={2} delay={120} />
                下单页<small>测试 12/12</small>
              </li>
            </ul>
            <p className="wv-sub">还没有依据</p>
            <p className="wv-wait">手机端排版正常 · 要你验收</p>
            <p className="wv-sub">发布说明草稿</p>
            <ul className="wv-notes-plain">
              <li>新增：结算页按「分」计价</li>
              <li>修复：支付回调偶发 500</li>
              <li className="m-v wv-line wv-new" style={at(3, undefined, 600)}>
                <div>
                  修复：Safari 14 付款后跳转<small>PR #322</small>
                </div>
              </li>
            </ul>
          </Sheet>
        </div>
      </Swap>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 2)}>
          <Sheet icon={Package} title="底栏" sub="新插件钉在这里">
            <p className="wv-dock">
              {[Target, Inbox, Terminal, ListChecks].map((Icon, index) => (
                <span key={index}>
                  <Icon aria-hidden="true" />
                </span>
              ))}
              <span className="wv-dock-new m-v" data-pop="" style={at(1, undefined, 1400)}>
                <ClipboardCheck aria-hidden="true" />
              </span>
            </p>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(2, 3)}>
          <Term name="Claude Code" bind="上线支付">
            <Line show={at(2, undefined, 200)} className="wv-u">能发吗？</Line>
            <Line show={at(2, undefined, 700)}>调用「发版清单」（你做的插件）</Line>
            <Line show={at(2, undefined, 1200)} className="wv-warnl">还有 1 条没依据：手机端排版</Line>
          </Term>
        </div>
        <div className="m-v" data-fade="" style={at(3, 4)}>
          <Sheet icon={Inbox} title="Inbox">
            <ul className="wv-list">
              <li data-on="">
                <GitPullRequest aria-hidden="true" />
                <span>
                  #322 合并：修好 Safari 14 跳转<small className="wv-why">你记过这条待办</small>
                </span>
              </li>
            </ul>
            <Bar
              show={at(3)}
              below
              compact
              cursor={at(3)}
              items={[
                { label: '放进发版清单', icon: ClipboardCheck, primary: true, tag: '你做的' },
                { label: '记成待办', icon: ListChecks },
              ]}
            />
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(4)}>
          <Flow
            when="每周五 17:00"
            stations={[
              [Target, 'Goals'],
              [ClipboardCheck, '发版清单'],
              [FileText, '发布说明'],
            ]}
          />
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   长 · 写文档：一句话做出选题库
   ===================================================================== */

const topics: [string, string, string, number][] = [
  ['AI 编辑器观察', '视频', '●●●', 0],
  ['为什么大家又开始写长文', '灵光', '●●○', 0],
  ['独立开发者的定价', 'Newsletter', '●●○', 0],
];

export const growDoc: Scene = {
  id: 'work-grow-doc',
  label:
    'Molis Work 示意：说一句做出「选题库」；Inbox 里一条读者留言，浮条递来「放进选题库」；存成每周日把最热的五个排进下周的流程；Claude 桌面版也问得到它。',
  steps: 5,
  times: [0, 1.2, 2.6, 4.0, 5.4, 7.0],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win step={step} className="wv-grow wv-grow-doc" place="写作" icon={NotebookPen} press={[2]}>
      <Swap className="wv-main">
        <div className="m-v" data-fade="" style={at(0, 2)}>
          <Studio
            icon={NotebookPen}
            name="选题库"
            prompt="做一个选题库：记选题、来源、热度和状态。"
            checks={['Agent 先给方案', '在沙箱里写代码和测试', '通过检查和验收', '装进「写作」']}
          />
        </div>
        <div className="m-v" data-fade="" style={at(2)}>
          <Sheet icon={NotebookPen} title="选题库" sub="你做的插件">
            <table className="wv-table">
              <thead>
                <tr>
                  <th>选题</th>
                  <th>来源</th>
                  <th>热度</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr className="m-v wv-new-row" data-fade="" style={at(2, undefined, 900)}>
                  <td>几家 AI 编辑器横评</td>
                  <td>读者留言</td>
                  <td className="wv-heat">●●●</td>
                  <td aria-label="状态">
                    <span className="m-stack">
                      <span className="m-v" data-fade="" style={at(2, 3)}>没写</span>
                      <span className="m-v wv-on" data-fade="" style={at(3)}>排进下周</span>
                    </span>
                  </td>
                </tr>
                {topics.map(([name, from, heat]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{from}</td>
                    <td className="wv-heat">{heat}</td>
                    <td>{name === 'AI 编辑器观察' ? <span className="wv-on">在写</span> : '没写'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Sheet>
        </div>
      </Swap>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 2)}>
          <Sheet icon={NotebookPen} title="底栏" sub="新插件钉在这里">
            <p className="wv-dock">
              {[FileText, Inbox, Lightbulb, CalendarDays].map((Icon, index) => (
                <span key={index}>
                  <Icon aria-hidden="true" />
                </span>
              ))}
              <span className="wv-dock-new m-v" data-pop="" style={at(1, undefined, 1400)}>
                <NotebookPen aria-hidden="true" />
              </span>
            </p>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(2, 3)}>
          <Sheet icon={Inbox} title="Inbox">
            <ul className="wv-list">
              <li data-on="">
                <MessagesSquare aria-hidden="true" />
                <span>
                  读者留言：想看几家 AI 编辑器横评<small className="wv-why">可以记成选题</small>
                </span>
              </li>
            </ul>
            <Bar
              show={at(2)}
              below
              compact
              cursor={at(2)}
              items={[
                { label: '放进选题库', icon: NotebookPen, primary: true, tag: '你做的' },
                { label: '记下灵光', icon: Lightbulb },
              ]}
            />
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(3, 4)}>
          <Flow
            when="每周日 20:00"
            stations={[
              [NotebookPen, '选题库'],
              [ListOrdered, '挑最热的 5 个'],
              [CalendarDays, 'Jelly · 下周'],
            ]}
          />
        </div>
        <div className="m-v" data-fade="" style={at(4)}>
          <section className="wv-chat">
            <p className="wv-chat-head">
              <span className="wv-lights" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <b>Claude</b>桌面版
            </p>
            <div className="wv-msgs">
              <p className="wv-me">选题库里哪些还没写？</p>
              <p className="wv-tool">
                <NotebookPen aria-hidden="true" />
                选题库 · 你做的插件
              </p>
              <p className="wv-ai">还有 3 个，最热的是「几家 AI 编辑器横评」，已排进下周一。</p>
            </div>
          </section>
        </div>
      </Swap>
    </Win>
  ),
};

/* =====================================================================
   一起干 · 写代码：客户邮件 → 助理判断 → 群里 → 目标 → Codex → 验收（开发中）
   ===================================================================== */

export const teamDev: Scene = {
  id: 'work-team-dev',
  label:
    'Molis Work 示意（开发中）：客户邮件经信息流进 Inbox，项目助理按规则判断为高优先，发到项目群 @ 你和产品；讨论成一个目标，你同意；你的 Codex 接手，进展和依据回到群里，产品验收。',
  steps: 5,
  times: [0, 1.2, 2.4, 3.8, 5.2, 6.8],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win step={step} className="wv-team" place="支付改版" icon={MessagesSquare} press={[3, 4]}>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 3)}>
          <Sheet icon={Inbox} title="Inbox" sub="只放要你处理的">
            <ul className="wv-feed" data-judged={step >= 1 || undefined}>
              <li data-hot="">
                <Mail aria-hidden="true" />
                <span>
                  3 个店员在微信里都付不了款<small>客户邮件 · 经信息流</small>
                </span>
              </li>
              <li>
                <Mail aria-hidden="true" />
                <span>
                  下个月想加开两家门店<small>客户邮件 · 经信息流</small>
                </span>
              </li>
              <li data-hot="">
                <CircleDot aria-hidden="true" />
                <span>
                  iOS 微信内置浏览器回调失败<small>GitHub #331</small>
                </span>
              </li>
            </ul>
            <p className="wv-judge m-v" data-pop="" style={at(1)}>
              <Sparkles aria-hidden="true" />
              <b>高优先：付不了款，和 #331 是同一件事</b>
              <small>规则：涉及付款、客户在等</small>
            </p>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(3)}>
          <Sheet icon={Target} title="修好微信里的支付" sub="目标">
            <p className="m-stack wv-pills">
              <span className="wv-pill m-v" data-fade="" style={at(3, 4)}>进行中 · Codex 在做</span>
              <span className="wv-pill m-v" data-tone="done" data-fade="" style={at(4, undefined, 1400)}>完成</span>
            </p>
            <ul className="wv-reqs">
              <li>
                <Tick step={4} delay={300} />
                微信内置浏览器里能付款
              </li>
              <li>
                <Tick step={4} delay={700} />
                客户门店的订单补上
              </li>
              <li>
                <Tick step={4} delay={1300} />
                真机走一遍<span className="wv-must">小周验收</span>
              </li>
            </ul>
          </Sheet>
        </div>
      </Swap>
      <Sheet icon={MessagesSquare} title="# 支付失败" sub="项目群" className="wv-thread">
        <div className="wv-msgs wv-msgs-end">
          <Line show={at(2)}>
            <div className="wv-post">
              <Who k="ai">
                <Sparkles aria-hidden="true" />
              </Who>
              <div>
                <p>
                  <span className="wv-at">@你</span> <span className="wv-at">@小周</span> 高优先：客户门店付不了款
                </p>
                <p className="wv-quote">客户邮件「店员付不了款」· GitHub #331</p>
                <p className="wv-tool">
                  <Target aria-hidden="true" />
                  有关目标：上线支付
                </p>
              </div>
            </div>
          </Line>
          <Line show={at(3)}>
            <div className="wv-post">
              <Who k="p">周</Who>
              <p>先修微信内置浏览器。</p>
            </div>
          </Line>
          <Line show={at(3, undefined, 400)}>
            <div className="wv-post">
              <Who k="ai">
                <Sparkles aria-hidden="true" />
              </Who>
              <div>
                <p>提成一个目标？三条完成要求已写好。</p>
                <p className="wv-btns">
                  <span data-primary="" data-done={step >= 4 || undefined}>
                    同意，建目标
                    <Cursor show={at(3, 4)} x="62%" y="60%" />
                  </span>
                </p>
              </div>
            </div>
          </Line>
          <Line show={at(4, undefined, 200)}>
            <div className="wv-post">
              <Who k="cx">Cx</Who>
              <p className="wv-codeline">✓ 回调改走 https · 16/16　✓ 补单 12/12</p>
            </div>
          </Line>
          <Line show={at(4, undefined, 1100)}>
            <div className="wv-post">
              <Who k="p">周</Who>
              <p>
                录屏看了，验收通过<Tick step={4} delay={1300} />
              </p>
            </div>
          </Line>
        </div>
      </Sheet>
    </Win>
  ),
};

/* =====================================================================
   一起干 · 写文档、管事情：一个决定，牵动的事都跟上（开发中）
   ===================================================================== */

export const teamDoc: Scene = {
  id: 'work-team-doc',
  label:
    'Molis Work 示意（开发中）：开发的 Agent 在目标上提了「待你决定」：两种定价各自的代价；项目助理发到群里 @ 你和运营；你点了 B；受影响的两个目标标出要改什么，开发的 Agent 接着做，运营多了一条待办。',
  steps: 4,
  times: [0, 1.3, 2.6, 4.2, 6.0],
  note: '开发中 · 界面示意',
  render: ({ step }) => (
    <Win step={step} className="wv-team" place="会员订阅" icon={MessagesSquare} press={[2]}>
      <Swap className="wv-side">
        <div className="m-v" data-fade="" style={at(0, 3)}>
          <Sheet icon={Target} title="会员订阅上线" sub="目标">
            <div className="wv-decide" data-settled={step >= 2 || undefined}>
              <p className="wv-decide-head">
                <Who k="cc">CC</Who>
                <b>待你决定：老用户怎么定价</b>
              </p>
              <p className="wv-choice" data-out={step >= 2 || undefined}>
                <i>A</i>
                <span>
                  老用户保留原价<small>两套计费，多做一周</small>
                </span>
              </p>
              <p className="wv-choice" data-picked={step >= 2 || undefined}>
                <i>B</i>
                <span>
                  统一新价，老用户下月起<small>影响 1,200 位老用户</small>
                </span>
              </p>
              <Line show={at(2, undefined, 600)}>
                <p className="wv-ok">已定：B · 你，周四 · 记在目标上</p>
              </Line>
            </div>
          </Sheet>
        </div>
        <div className="m-v" data-fade="" style={at(3)}>
          <Sheet icon={Target} title="受影响的" sub="跟着改">
            <ul className="wv-affect">
              <li>
                <b>订阅结算</b>
                <span className="wv-wait">要改：老用户下月起按新价</span>
                <span className="wv-codeline">阿哲的 Claude Code：读到新约定，接着做 ✓</span>
              </li>
              <li>
                <b>价格页</b>
                <span className="wv-wait">要改：加一段老用户说明</span>
              </li>
              <li>
                <b>待办 · 小林</b>
                <span>通知老用户：下月起按新价</span>
              </li>
            </ul>
          </Sheet>
        </div>
      </Swap>
      <Sheet icon={MessagesSquare} title="# 订阅定价" sub="项目群" className="wv-thread">
        <div className="wv-msgs wv-msgs-end">
          <Line show={at(1)}>
            <div className="wv-post">
              <Who k="ai">
                <Sparkles aria-hidden="true" />
              </Who>
              <div>
                <p>
                  <span className="wv-at">@你</span> <span className="wv-at">@小林</span> 订阅卡在定价：A 要多做一周，B 影响老用户
                </p>
                <p className="wv-tool">
                  <Target aria-hidden="true" />
                  会员订阅上线 · 待你决定
                </p>
              </div>
            </div>
          </Line>
          <Line show={at(2)}>
            <div className="wv-post">
              <Who k="p">林</Who>
              <p>B 我能接住，提前一个月通知。</p>
            </div>
          </Line>
          <Line show={at(2, undefined, 300)}>
            <div className="wv-post">
              <Who k="me">你</Who>
              <div>
                <p>那就 B。</p>
                <p className="wv-btns">
                  <span data-dim={step >= 2 || undefined}>选 A</span>
                  <span data-primary="">
                    选 B
                    <Cursor show={at(2, 3)} x="60%" y="60%" />
                  </span>
                </p>
              </div>
            </div>
          </Line>
          <Line show={at(3, undefined, 300)}>
            <div className="wv-post">
              <Who k="ai">
                <Sparkles aria-hidden="true" />
              </Who>
              <p>已记在目标上；受影响的 2 个目标和 1 条待办都更新了。</p>
            </div>
          </Line>
        </div>
      </Sheet>
    </Win>
  ),
};
