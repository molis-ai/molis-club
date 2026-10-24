import {
  Bell,
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Folder,
  Globe,
  House,
  Inbox,
  KeyRound,
  Library,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Monitor,
  Plus,
  Rss,
  Settings,
  Sparkles,
  Target,
  Upload,
  User,
  WandSparkles,
  Workflow,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { Ai, Hand, Made, Ring, Shift, State, Win, Writes, type DockSpec } from './app';

// 每一屏的画面（只有结构；怎么一拍一拍地演在 scripts.ts，样子在 work.css）。
// 约定：data-c 是编排认它的名字；data-step 是演到某一拍才出现、演完留着的；data-mid 是只在中途出现的；
// data-gone 是开头在、演完不在的。没有编排接管时（没有 JS、减少动态）就是做完的样子。
// 画面里的名字、数字、时间都是示意；界面上的字尽量照 Molis Work 现在的原文（项目建议、从本机导入角色、
// 约定今天跟进、1 项待你确认、作出决定、收尾未生效、用户已验收通过……）。

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** 底栏：当前在哪个插件，钉着的几颗 */
const dockOf = (label: string, icon: LucideIcon, on: number, extra?: DockSpec['icons']): DockSpec => ({
  current: { icon, label },
  icons: [
    { icon: House, on: on === 0 },
    { icon: Target, on: on === 1 },
    { icon: Inbox, on: on === 2 },
    { icon: FileText, on: on === 3 },
    ...(extra ?? []),
  ],
});

function Waiting({ n, c, step, gone, mid }: { n: number; c?: string; step?: boolean; gone?: boolean; mid?: boolean }) {
  return (
    <span
      className="wk-wait"
      data-c={c}
      data-step={step || undefined}
      data-gone={gone || undefined}
      data-mid={mid || undefined}
    >
      <Bell aria-hidden="true" />
      等你 {n}
    </span>
  );
}

/* =====================================================================
   首屏：周一早上的项目首页
   ===================================================================== */

function Event({
  c,
  time,
  icon: Icon,
  title,
  meta,
  tag,
}: {
  c: string;
  time: string;
  icon: LucideIcon;
  title: ReactNode;
  meta: ReactNode;
  tag?: ReactNode;
}) {
  return (
    <div className="wk-ev" data-c={c} data-step>
      <span className="wk-ev-time">{time}</span>
      <span className="wk-ev-ic">
        <Icon aria-hidden="true" />
      </span>
      <span className="wk-ev-main">
        <span className="wk-ev-title">{title}</span>
        <span className="wk-ev-meta">{meta}</span>
      </span>
      {tag ? <span className="wk-ev-tag">{tag}</span> : null}
    </div>
  );
}

export function HeroArt() {
  const days: [string, string][] = [
    ['周五', '23'],
    ['周六', '24'],
    ['周日', '25'],
    ['周一', '26'],
    ['周二', '27'],
    ['周三', '28'],
  ];
  return (
    <div className="wk-scene wk-hero-scene">
      <Win
        tabs={[{ icon: House, title: '项目首页', on: true }]}
        dock={dockOf('项目首页', House, 0, [{ icon: ClipboardCheck }])}
        input={
          <>
            <Waiting n={2} c="h-wait" step />
            <span className="wk-ph">让助理做点什么，或按 ⌘K 搜索</span>
          </>
        }
      >
        <div className="wk-home">
          <div className="wk-home-head">
            <p className="wk-h">今天的工作</p>
            <p className="wk-sub">
              早上好 · 星期一，10月26日 · 夜里接到 41 件事 · 有 2 件等你。
            </p>
          </div>
          <div className="wk-days" aria-hidden="true">
            {days.map(([d, n], index) => (
              <span key={n} data-today={index === 3 || undefined}>
                <small>{d}</small>
                <b>{n}</b>
                {index === 3 ? <small>今天</small> : null}
              </span>
            ))}
          </div>
          <div className="wk-goalcard">
            <p className="wk-goalcard-k">
              <Target aria-hidden="true" />
              正在推进
              <State tone="progress">进行中</State>
            </p>
            <p className="wk-goalcard-t">划线卡片 v1.1</p>
            <p className="wk-goalcard-d">导出到 Anki，支持从 Readwise 导入</p>
            <p className="wk-goalcard-f">
              <span className="wk-btn">继续这个目标</span>
              <span className="wk-goalcard-n">1 / 3 个子目标已完成</span>
            </p>
          </div>
          <div className="wk-events">
            <p className="wk-events-h">
              当天的事件 <span>3</span>
            </p>
            <Event
              c="h-0"
              time="06:10"
              icon={ClipboardCheck}
              title={
                <>
                  <Writes c="h-0-w">夜里两次提交，都过了发布前检查台</Writes>
                  <Ai n="发布前检查台" c="h-0-ai" />
                </>
              }
              meta={
                <>
                  个人 · 4/4 通过 · <Made>发布前检查台</Made>
                </>
              }
            />
            <Event
              c="h-1"
              time="07:30"
              icon={Inbox}
              title={
                <>
                  <Writes c="h-1-w">41 条反馈整理好了，3 条要你看</Writes>
                  <Ai n="助理" c="h-1-ai" />
                </>
              }
              meta="个人 · 按你的规则「先看差评」筛过 · Inbox"
              tag={<State tone="attention">等你看</State>}
            />
            <Event
              c="h-2"
              time="07:52"
              icon={Target}
              title={
                <>
                  <Writes c="h-2-w">Codex 修好了 #12：长划线在手机上被截断</Writes>
                  <Ai n="Codex" c="h-2-ai" />
                </>
              }
              meta="个人 · Codex 报告 · Goals"
              tag={
                <span data-c="h-2-tag">
                  <State tone="attention">等你验收</State>
                </span>
              }
            />
          </div>
        </div>
      </Win>
      <Hand />
    </div>
  );
}

/* =====================================================================
   全景：一整扇窗，七处依次点亮
   ===================================================================== */

const PLUGINS: [LucideIcon, string][] = [
  [Target, 'Goals'],
  [FileText, 'Pages'],
  [ListChecks, '待办'],
  [Inbox, 'Inbox'],
  [Rss, 'Feed'],
  [Lightbulb, '灵光'],
  [Braces, 'Coding'],
  [Workflow, '工作流程'],
];

const AGENTS = ['Codex', 'OpenCode', 'Pi Agent', 'Grok Build', 'Cursor · MCP'];

export function TourArt({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div className="wk-scene wk-tour-scene" data-theme={theme}>
      <div className="wk-capsule" data-spot="wait-cap" data-step data-c="t-cap">
        <Ring tone="attention" />
        划线卡片 · 2 件等你
      </div>
      <Win
        theme={theme}
        overlay={<i className="wk-spot" aria-hidden="true" />}
        tabs={[
          { icon: House, title: '项目首页' },
          { icon: Target, title: '周日上线「划线卡片」', hue: 'blue' },
          { icon: FileText, title: '发布说明', hue: 'cyan', on: true },
        ]}
        dock={{
          current: { icon: FileText, label: 'Pages', c: 't-dock' },
          icons: [
            { icon: House },
            { icon: Target },
            { icon: FileText, on: true },
            { icon: ListChecks },
            { icon: ClipboardCheck },
          ],
          more: '+6',
        }}
        input={
          <>
            <span data-spot="wait" className="wk-wait-wrap">
              <Waiting n={2} c="t-wait" />
            </span>
            <span className="wk-ph" data-c="t-ph">
              让助理做点什么，或按 ⌘K 搜索
            </span>
          </>
        }
        rail={
          <>
            <div className="wk-rail-tabs">
              <span data-rail-on="">
                <Library aria-hidden="true" />
                Shelf
              </span>
              <span>
                <Lightbulb aria-hidden="true" />
                灵光
              </span>
              <span>
                <FileText aria-hidden="true" />
                资料
              </span>
              <span>
                <Globe aria-hidden="true" />
                浏览器
              </span>
              <span>
                <Monitor aria-hidden="true" />
                电脑
              </span>
              <span>
                <MessageSquare aria-hidden="true" />
                讨论
              </span>
            </div>
            <p className="wk-rail-h">
              <ChevronDown aria-hidden="true" />
              <Folder aria-hidden="true" />
              材料 <span>3</span>
            </p>
            <p className="wk-rail-it" data-c="t-shelf-0">
              <span className="wk-file" data-kind="img" />
              即刻 · 求一个划线复习工具.png
            </p>
            <p className="wk-rail-it" data-c="t-shelf-1">
              <span className="wk-file" data-kind="sheet" />
              读书划线导出（两年）.csv
            </p>
            <p className="wk-rail-it" data-c="t-shelf-2">
              <span className="wk-file" data-kind="doc" />
              旧笔记 · 间隔重复.md
            </p>
            <p className="wk-rail-h">
              <ChevronDown aria-hidden="true" />
              <FileText aria-hidden="true" />
              生成结果 <span>1</span>
            </p>
            <p className="wk-rail-it">
              <span className="wk-file" data-kind="doc" />
              发布说明 · 第 2 版
            </p>
            <span className="wk-rail-drop" data-mid data-c="t-drop">
              插入到光标处
            </span>
          </>
        }
      >
        <div className="wk-doc">
          <p className="wk-doc-k">Pages · 划线卡片</p>
          <p className="wk-h">发布说明</p>
          <p className="wk-doc-p">
            每天早上，三张卡片等你翻：从你两年的读书划线里挑出来，按间隔重复排好。
          </p>
          <p className="wk-doc-p" data-spot="float">
            <span className="wk-hl" data-c="t-sel">
              Android 版下周再上，先请两位朋友帮忙测。
            </span>
            <span className="wk-ctx" data-mid data-c="t-ctx">
              <span className="wk-ctx-chip">一句话 ×</span>
              <span data-c="t-todo">记成待办</span>
              <span>交给助理</span>
              <span>拆成目标步骤</span>
              <span className="wk-ctx-more">更多</span>
            </span>
          </p>
          <p className="wk-doc-p">划线只存在你的电脑上，不上云。</p>
          <p className="wk-doc-h2">这一版有什么</p>
          <ul className="wk-doc-ul">
            <li>每天早上 7 点，三张卡片：按间隔重复挑，翻过的会隔几天再来</li>
            <li>导入 Kindle、微信读书的划线，两年的也一次读完</li>
            <li>手机上也能翻，登录一次就好</li>
          </ul>
          <span className="wk-toast" data-mid data-c="t-toast">
            <Check aria-hidden="true" />
            已记成待办 · 来自《发布说明》
          </span>
        </div>
      </Win>

      {/* 插件：底栏胶囊往上展开的插件表 */}
      <div className="wk-pop wk-plugins" data-spot="dock" data-mid data-c="t-plugins">
        <p className="wk-pop-h">这个项目的插件</p>
        <div className="wk-plugins-grid">
          {PLUGINS.map(([Icon, name]) => (
            <span key={name}>
              <Icon aria-hidden="true" />
              {name}
            </span>
          ))}
          <span data-c="t-made" className="wk-plugins-made">
            <ClipboardCheck aria-hidden="true" />
            发布前检查台
            <Made>你做的</Made>
          </span>
        </div>
        <p className="wk-pop-foot">
          <WandSparkles aria-hidden="true" />
          插件创作工作台 · 说一句，做一个
        </p>
      </div>

      {/* 助理：从输入框升起来的一块 */}
      <div className="wk-pop wk-askpanel" data-spot="ask" data-mid data-c="t-ask">
        <div className="wk-askpanel-side">
          <p className="wk-askpanel-work">
            <State tone="attention">等你确认</State>
            <b>把反馈整理进发布说明</b>
            <small>Pages · 第 3 节</small>
          </p>
        </div>
        <div className="wk-askpanel-main">
          <p className="wk-bubble" data-me="">
            把今天这几条反馈整理进发布说明
          </p>
          <p className="wk-askpanel-say">
            <Writes c="t-ask-w">整理好了：两条写进「已知问题」，一条放进下一版。</Writes>
            <Ai n="助理" c="t-ask-ai" />
          </p>
          <div className="wk-opcard" data-step data-c="t-op">
            <p className="wk-opcard-k">
              <Ring tone="attention" />
              执行前需要你确认
            </p>
            <p className="wk-opcard-t">Pages · 插入到第 3 节「已知问题」</p>
            <p className="wk-opcard-f">
              <span className="wk-btn" data-c="t-allow">
                允许执行
              </span>
              <span className="wk-btn-line">拒绝</span>
            </p>
          </div>
        </div>
      </div>

      {/* 外部 AI：自己的终端，经 MCP 读写同一份目标 */}
      <div className="wk-term wk-tour-term" data-spot="agents" data-mid data-c="t-term">
        <p className="wk-term-h">
          <i />
          <i />
          <i />
          Claude Code
        </p>
        <p className="wk-term-l" data-step data-c="t-term-0">
          › 读一下目标「周日上线划线卡片」
        </p>
        <p className="wk-term-l" data-step data-c="t-term-1">
          <span className="wk-dim">Molis Work · 经 MCP</span> 3 条完成要求，2 条已有依据
        </p>
        <p className="wk-term-l" data-step data-c="t-term-2">
          你周六定过：划线只存本地，不上云
          <Ai n="Claude Code" c="t-term-ai" />
        </p>
        <p className="wk-agents" data-step data-c="t-agents">
          {AGENTS.map((name, index) => (
            <span key={name} style={v({ '--i': index })}>
              {name}
            </span>
          ))}
        </p>
      </div>

      {/* 等你：输入框旁的计数一点开 */}
      <div className="wk-pop wk-waitlist" data-mid data-c="t-waitlist">
        <p>
          <Ring tone="attention" />
          <b>Codex</b> 验收：长划线在手机上被截断
        </p>
        <p>
          <Ring tone="attention" />
          <b>助理</b> 看 3 条要紧的反馈
        </p>
      </div>
      <Hand />
    </div>
  );
}

/* =====================================================================
   一个周末：六个时刻
   ===================================================================== */

const GOAL = '周日上线「划线卡片」';

/** 目标页的页头：返回、状态签；右边「概览 / 终端」 */
function GoalHead({ state }: { state: ReactNode }) {
  return (
    <div className="wk-goal-head">
      <ChevronRight className="wk-goal-back" aria-hidden="true" />
      <span className="wk-goal-state">{state}</span>
      <span className="wk-seg">
        <span data-seg-on="">概览</span>
        <span>终端</span>
      </span>
    </div>
  );
}

/** ① 周五 22:10：想法丢进来，就是一个项目 */
export function IdeaArt() {
  const files: [string, string, string, number, number][] = [
    ['img', '即刻 · 求一个划线复习工具.png', 'f0', -17, 9],
    ['sheet', '读书划线导出（两年）.csv', 'f1', 6, 13],
    ['doc', '旧笔记 · 间隔重复.md', 'f2', -9, 17],
  ];
  return (
    <div className="wk-scene wk-idea">
      <Win
        tabs={[
          { icon: Plus, title: '新项目', on: true, c: 'i-tab0', gone: true },
          { icon: House, title: '划线卡片', on: true, c: 'i-tab1', step: true },
        ]}
        dock={dockOf('项目首页', House, 0)}
      >
        <div className="wk-arrive" data-gone data-c="i-arrive">
          <p className="wk-h">新项目 · 从已有资料开始</p>
          <p className="wk-sub">资料在你的电脑上读；整理时会发给你选的模型。</p>
          <div className="wk-zone" data-c="i-zone">
            <Upload aria-hidden="true" />
            把资料拖到这里
            <small>文件夹、文件、邮件、聊天记录导出</small>
          </div>
          <div className="wk-reading" data-mid data-c="i-read">
            正在读 · 已读 23 份
            <i />
          </div>
        </div>
        {files.map(([kind, name, c, x, y]) => (
          <span
            key={c}
            className="wk-chip-file"
            data-mid
            data-c={`i-${c}`}
            style={v({ '--x': x, '--y': y })}
          >
            <span className="wk-file" data-kind={kind} />
            {name}
          </span>
        ))}
        <div className="wk-prop" data-mid data-c="i-prop">
          <p className="wk-prop-h">项目建议</p>
          <p className="wk-prop-hint">根据已有材料，整理了一份项目建议。名字和摘要都可以修改。</p>
          <dl>
            <dt>名称</dt>
            <dd>划线卡片</dd>
            <dt>背景</dt>
            <dd>
              <Writes c="i-w0">有人在即刻问：有没有工具能把读书划线每天推给我。</Writes>
            </dd>
            <dt>手上有的</dt>
            <dd>
              <Writes c="i-w1">两年的划线导出，一份间隔重复的旧笔记。</Writes>
            </dd>
            <dt>下一步</dt>
            <dd>
              <Writes c="i-w2">做一个网页版：每天早上三张复习卡片。</Writes>
              <Ai n="助理" c="i-ai" />
            </dd>
          </dl>
          <p className="wk-prop-acts">
            <span className="wk-btn-line">再改改</span>
            <span className="wk-btn" data-c="i-adopt">
              采用
            </span>
          </p>
        </div>
        <div className="wk-made-proj" data-step data-c="i-proj">
          <p className="wk-h">划线卡片</p>
          <p className="wk-sub">从你的 23 份资料开始 · 刚刚</p>
          <div className="wk-tiles">
            <div style={v({ '--i': 0 })}>
              <small>
                <Target aria-hidden="true" />
                目标
              </small>
              <b>{GOAL}</b>
              <span>3 条完成要求</span>
            </div>
            <div style={v({ '--i': 1 })}>
              <small>
                <FileText aria-hidden="true" />
                文档
              </small>
              <b>划线卡片 · 工作摘要</b>
              <span>每段都标着出处</span>
            </div>
            <div style={v({ '--i': 2 })}>
              <small>
                <ListChecks aria-hidden="true" />
                待办
              </small>
              <b>3 件</b>
              <span>选卡片算法 · 画首页 · 约朋友测</span>
            </div>
            <div style={v({ '--i': 3 })}>
              <small>
                <Library aria-hidden="true" />
                资料
              </small>
              <b>23 份</b>
              <span>截图里的字、表格、笔记</span>
            </div>
          </div>
          <p className="wk-next">
            <Sparkles aria-hidden="true" />
            下一步：先定「每天挑哪三张」的算法？
            <span className="wk-btn-line">好，开始</span>
          </p>
        </div>
      </Win>
      <Hand />
    </div>
  );
}

/** ② 周六 10:00：你的规矩写一次，每个 AI 都照着做 */
export function RulesArt() {
  const rules = [
    '文案不用感叹号，像跟朋友说话。',
    '不引新依赖，能用标准库就用标准库。',
    '登录流程，上线前我要在手机上亲手点一遍。',
  ];
  return (
    <div className="wk-scene wk-rules">
      <Win
        tabs={[
          { icon: House, title: '划线卡片' },
          { icon: Settings, title: '设置 · 角色', on: true },
        ]}
        dock={dockOf('设置', Settings, -1)}
      >
        <div className="wk-set">
          <div className="wk-set-nav" aria-hidden="true">
            <small>AI</small>
            <span>
              <KeyRound />
              模型设置
            </span>
            <span>
              <MessageSquare />
              助理
            </span>
            <span data-set-on="">
              <User />
              角色
            </span>
            <span>
              <Sparkles />
              提示词
            </span>
            <small>工具与接入</small>
            <span>
              <Braces />
              AI 与执行工具
            </span>
          </div>
          <div className="wk-set-main">
            <p className="wk-h">角色</p>
            <p className="wk-sub">角色是交给 AI 的做事方式：你自己写的，以及系统和插件带来的。</p>
            <p className="wk-set-acts">
              <span className="wk-btn-line" data-c="r-import">
                <Upload aria-hidden="true" />
                从本机导入
              </span>
            </p>
            <div className="wk-role" data-step data-c="r-role">
              <p className="wk-role-h">
                我的做法 <small>v3 · 从 Claude Code 导入</small>
              </p>
              <ol>
                {rules.map((rule, index) => (
                  <li key={rule} data-c={`r-rule-${index}`}>
                    {rule}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <div className="wk-pop wk-import" data-mid data-c="r-dlg">
          <p className="wk-pop-h">从本机导入角色</p>
          <p className="wk-import-hint">
            把 Codex、Claude Code 等 Agent 已有的规则、Skills 和附件带进来，成为你的角色。原配置不会被修改。
          </p>
          <p className="wk-import-src">Claude Code · ~/.claude</p>
          {[
            ['CLAUDE.md', '规则', 'r-c0'],
            ['写文案的语气', 'Skill', 'r-c1'],
            ['发版前要做的事', 'Skill', 'r-c2'],
          ].map(([name, kind, c]) => (
            <p key={c} className="wk-import-it" data-c={c}>
              <span className="wk-box">
                <Check aria-hidden="true" />
              </span>
              {name}
              <small>{kind}</small>
            </p>
          ))}
          <p className="wk-import-acts">
            <span className="wk-btn" data-c="r-go">
              导入 3 项
            </span>
          </p>
        </div>
        <div className="wk-follow">
          <div className="wk-out" data-step data-c="r-o0" style={v({ '--i': 0 })}>
            <small>助理 · 首页文案</small>
            <p>
              <Writes c="r-o0-w">每天早上，三张卡片等你翻。</Writes>
              <Ai n="助理" c="r-o0-ai" />
            </p>
            <span className="wk-by">按：我的做法 · 第 1 条</span>
          </div>
          <div className="wk-out" data-step data-c="r-o1" style={v({ '--i': 1 })}>
            <small>Codex · 日期处理</small>
            <p>
              <Writes c="r-o1-w">改用内置的 Intl，没有加新包。</Writes>
              <Ai n="Codex" c="r-o1-ai" />
            </p>
            <span className="wk-by">按：我的做法 · 第 2 条</span>
          </div>
          <div className="wk-out" data-step data-c="r-o2" style={v({ '--i': 2 })}>
            <small>Claude Code · 完成要求</small>
            <p>
              <Writes c="r-o2-w">手机上的登录</Writes>
              <Ai n="Claude Code" c="r-o2-ai" />
              <span className="wk-tagh">需要用户验收</span>
            </p>
            <span className="wk-by">按：我的做法 · 第 3 条</span>
          </div>
        </div>
      </Win>
      <Hand />
    </div>
  );
}

/** 目标页上的几行：完成要求、待你确认、时间线 */
function GoalRows({ need, wait, extra }: { need: ReactNode; wait?: ReactNode; extra?: ReactNode }) {
  return (
    <div className="wk-goal-rows">
      <p>
        完成要求<span>{need}</span>
        <ChevronRight aria-hidden="true" />
      </p>
      {wait}
      <p>
        目标与要求
        <ChevronRight aria-hidden="true" />
      </p>
      {extra}
    </div>
  );
}

/** ③ 周六 15:20：额度用完了，换谁接着做都行 */
export function RelayArt() {
  const who: [string, string, string?][] = [
    ['Codex', '经内置接入'],
    ['OpenCode', '经内置接入'],
    ['Pi Agent', '经内置接入'],
    ['Grok Build', '经内置接入'],
    ['Cursor', '经 MCP'],
  ];
  return (
    <div className="wk-scene wk-relay">
      <Win
        tabs={[
          { icon: House, title: '划线卡片' },
          { icon: Target, title: GOAL, hue: 'blue', wasOn: true, c: 'l-tab0' },
          { icon: Braces, title: 'Coding · 接着做', hue: 'cyan', on: true, c: 'l-tab', step: true },
        ]}
        dock={{ ...dockOf('Goals', Target, 1, [{ icon: Braces, step: true, c: 'l-dock' }]), next: { icon: Braces, label: 'Coding' } }}
      >
        <div className="wk-goal" data-gone data-c="l-goal">
          <GoalHead state={<State tone="progress">正在推进</State>} />
          <p className="wk-goal-t">{GOAL}</p>
          <p className="wk-goal-d">每天早上三张复习卡片，划线只存在你的电脑上</p>
          <p className="wk-goal-go">
            <span className="wk-btn" data-c="l-go">
              接着做
              <ChevronDown aria-hidden="true" />
            </span>
            <span className="wk-dim">上一位：Claude Code · 14:52</span>
          </p>
          <GoalRows need="1/3 已满足" />
          <div className="wk-pop wk-who" data-mid data-c="l-menu">
            <p className="wk-pop-h">交给谁接着做</p>
            {who.map(([name, how], index) => (
              <p key={name} className="wk-who-it" data-c={`l-w${index}`}>
                <b>{name}</b>
                <small>{how}</small>
              </p>
            ))}
            <p className="wk-who-it wk-who-own" data-c="l-own">
              <Braces aria-hidden="true" />
              <b>在 Coding 里继续</b>
              <small>DeepSeek-V3 · 你的 Key</small>
            </p>
          </div>
        </div>
        <div className="wk-coding" data-step data-c="l-coding">
          <div className="wk-sessions" aria-hidden="true">
            <p className="wk-sessions-h">会话</p>
            <p className="wk-session" data-session-on="">
              <b>接着做每天早上的提醒</b>
              <small>Coding · DeepSeek · 刚刚</small>
            </p>
            <p className="wk-session">
              <b>首页卡片布局</b>
              <small>Claude Code · 14:52</small>
            </p>
            <p className="wk-session">
              <b>划线导入与去重</b>
              <small>Codex · 11:20</small>
            </p>
          </div>
          <div className="wk-coding-main">
          <p className="wk-coding-h">
            <Braces aria-hidden="true" />
            Coding
            <span className="wk-model">
              <KeyRound aria-hidden="true" />
              DeepSeek-V3 · 你的 Key
            </span>
          </p>
          <p className="wk-coding-read" data-step data-c="l-read">
            <Target aria-hidden="true" />
            读到了目标「{GOAL}」
          </p>
          <div className="wk-coding-say">
            <p>
              <Writes c="l-w-0">第 1、2 条完成要求已经有依据。</Writes>
            </p>
            <p>
              <Writes c="l-w-1">你上午定过：划线只存本地，不上云。</Writes>
            </p>
            <p>
              <Writes c="l-w-2">从第 3 条接着做：每天早上的提醒。</Writes>
              <Ai n="Coding · DeepSeek" c="l-ai" />
            </p>
          </div>
          <div className="wk-diff" data-step data-c="l-step">
            <p className="wk-diff-h">
              <State tone="attention">等你审查</State>
              改了 3 个文件 · 每一次写入都先经你审查
            </p>
            <p className="wk-diff-f">src/remind.ts <span>+18 −2</span></p>
            <p className="wk-diff-l" data-add="">+ const at = nextMorning(7, settings.zone)</p>
            <p className="wk-diff-l" data-add="">+ schedule(at, () =&gt; pickCards(3))</p>
            <p className="wk-diff-l" data-del="">− setInterval(check, 60_000)</p>
          </div>
          </div>
        </div>
      </Win>
      <div className="wk-term wk-relay-term" data-gone data-c="l-term">
        <p className="wk-term-h">
          <i />
          <i />
          <i />
          Claude Code
        </p>
        <p className="wk-term-l">› 接着做每天早上的提醒</p>
        <p className="wk-term-l wk-warn">本期用量已到上限，19:00 恢复</p>
      </div>
      <Hand />
    </div>
  );
}

/** ④ 周六 23:40：说好的事，改了要你点头（访客亲手选） */
export function NodArt() {
  return (
    <div className="wk-scene wk-nod">
      <Win
        tabs={[
          { icon: House, title: '划线卡片' },
          { icon: Target, title: GOAL, hue: 'blue', on: true },
        ]}
        dock={dockOf('Goals', Target, 1)}
        input={
          <>
            <Waiting n={1} c="n-wait" gone />
            <span className="wk-ph">让助理做点什么，或按 ⌘K 搜索</span>
          </>
        }
      >
        <div className="wk-goal">
          <GoalHead state={<Shift c="n-state" was={['attention', '需要你决定']} now={['progress', '正在推进']} />} />
          <p className="wk-goal-t">{GOAL}</p>
          <p className="wk-goal-d">每天早上三张复习卡片，划线只存在你的电脑上</p>
          <div className="wk-ask" data-gone data-c="n-ask">
            <p>
              Codex 想把「导出到 Anki」挪到下一版，好赶上周日上线。
            </p>
            <span className="wk-link" data-c="n-open">
              作出决定
              <ChevronRight aria-hidden="true" />
            </span>
          </div>
          <GoalRows
            need={
              <>
                <span className="wk-if" data-if="yes">2/3 已满足</span>
                <span className="wk-if" data-if="no">2/4 已满足</span>
              </>
            }
            wait={
              <p className="wk-goal-wait" data-gone data-c="n-row">
                1 项待你确认
                <ChevronRight aria-hidden="true" />
              </p>
            }
            extra={
              <div className="wk-timeline" data-step data-c="n-log">
                <p className="wk-timeline-h">
                  时间线 <span>记一笔</span>
                </p>
                <p className="wk-timeline-it">
                  <span>23:41</span>
                  <i />
                  <b className="wk-if" data-if="yes">你同意：「导出到 Anki」挪到 v1.1；约定改到第 2 版</b>
                  <b className="wk-if" data-if="no">你没同意：「导出到 Anki」留在这一版</b>
                </p>
              </div>
            }
          />
        </div>
        <div className="wk-pop wk-decide" data-mid data-c="n-form">
          <p className="wk-decide-k">决定请求 · 来自 Codex · 23:40</p>
          <p className="wk-decide-q">「导出到 Anki」挪到下一版吗？</p>
          <p className="wk-decide-why">Anki 的导出格式还要两个小时，周日上线会很赶。</p>
          <button type="button" className="wk-opt" data-c="n-yes" tabIndex={-1}>
            <b>同意</b>
            挪到 v1.1。完成要求变成 3 条，约定改到第 2 版。
          </button>
          <button type="button" className="wk-opt" data-c="n-no" tabIndex={-1}>
            <b>不同意</b>
            留在这一版。上线可能推到周一。
          </button>
        </div>
      </Win>
      <Hand />
    </div>
  );
}

/** ⑤ 周日 11:00：缺个工具，说一句就有 */
export function ToolArt() {
  const checks: [string, boolean, string?][] = [
    ['登录', true],
    ['导出', true],
    ['手机排版', false, '卡片在小屏上溢出'],
    ['隐私说明', true],
  ];
  return (
    <div className="wk-scene wk-tool">
      <Win
        tabs={[
          { icon: House, title: '项目首页', on: true, c: 'o-tab0', gone: true },
          { icon: WandSparkles, title: '插件创作工作台', hue: 'indigo', on: true, c: 'o-tab1', mid: true },
          { icon: ClipboardCheck, title: '发布前检查台', on: true, c: 'o-tab2', step: true },
        ]}
        dock={{ ...dockOf('项目首页', House, -1, [{ icon: ClipboardCheck, step: true, on: true, c: 'o-new' }]), next: { icon: ClipboardCheck, label: '发布前检查台' } }}
        input={
          <>
            <span className="wk-typed" data-c="o-typed">
              做个发布前检查台：登录、导出、手机排版、隐私说明，都过了才能发
            </span>
            <span className="wk-ph" data-c="o-ph">
              让助理做点什么，或按 ⌘K 搜索
            </span>
          </>
        }
      >
        <div className="wk-home wk-tool-home" data-gone data-c="o-home">
          <p className="wk-h">今天的工作</p>
          <p className="wk-sub">周日 · 离上线还有 7 个小时 · 有 1 件等你。</p>
          <p className="wk-todo">
            <span className="wk-check-box" />
            给首页配一张截图
          </p>
          <p className="wk-todo">
            <span className="wk-check-box" />
            约两位朋友明晚测 Android
          </p>
          <p className="wk-todo">
            <span className="wk-check-box" />
            发版前把四件事过一遍
          </p>
        </div>
        <div className="wk-builder" data-mid data-c="o-builder">
          <div className="wk-builder-side">
            <p className="wk-builder-h">一起把想法做出来</p>
            <p className="wk-bubble" data-me="">
              做个发布前检查台：登录、导出、手机排版、隐私说明，都过了才能发
            </p>
          </div>
          <div className="wk-builder-main">
            <p className="wk-builder-top">
              新插件
              <span className="wk-seg">
                <span data-seg-on="">构建</span>
                <span>试用</span>
              </span>
            </p>
            <div className="wk-plan">
              <p className="wk-plan-t">
                <Writes c="o-plan-w">发布前检查台</Writes>
                <Ai n="创作台" c="o-plan-ai" />
              </p>
              <p className="wk-plan-d" data-step data-c="o-plan-d">
                四项检查 · 结果记在本机 · 你、助理和外部 AI 用同一个操作
              </p>
              <div className="wk-plan-items" data-step data-c="o-plan-i">
                {['登录', '导出', '手机排版', '隐私说明'].map((name, index) => (
                  <span key={name} style={v({ '--i': index })}>
                    <i />
                    {name}
                  </span>
                ))}
              </div>
              <p className="wk-steps" data-step data-c="o-steps">
                <span data-c="o-s0">写代码</span>
                <span data-c="o-s1">过检查</span>
                <span data-c="o-s2">试跑</span>
              </p>
            </div>
          </div>
        </div>
        <div className="wk-made-tool" data-step data-c="o-tool">
          <p className="wk-h">
            发布前检查台 <Made>你做的 · 刚装好</Made>
          </p>
          <p className="wk-sub">划线卡片 · 每次提交前检查</p>
          <p className="wk-score">
            <span className="wk-if-pass">4 / 4 通过</span>
            <span className="wk-if-fail">3 / 4 通过</span>
          </p>
          <div className="wk-tool-grid">
            <div>
              {checks.map(([name, ok, why], index) => (
                <p key={name} className="wk-check" data-fail={ok ? undefined : ''} data-c={`o-c${index}`}>
                  <span className="wk-check-box">
                    <Check className="wk-ic-ok" aria-hidden="true" />
                    <X className="wk-ic-no" aria-hidden="true" />
                  </span>
                  {name}
                  {why ? <small>{why}</small> : null}
                </p>
              ))}
            </div>
            <div className="wk-runs">
              <p className="wk-runs-h">检查记录</p>
              <p className="wk-run" data-step data-c="o-run1">
                <span>11:31</span>
                <b>Claude Code</b>
                <i>4/4 通过</i>
              </p>
              <p className="wk-run">
                <span>11:24</span>
                <b>你</b>
                <i data-no="">3/4 · 手机排版</i>
              </p>
            </div>
          </div>
        </div>
      </Win>
      <div className="wk-term wk-tool-term" data-step data-c="o-term">
        <p className="wk-term-h">
          <i />
          <i />
          <i />
          Claude Code
        </p>
        <p className="wk-term-l" data-step data-c="o-t0">
          › 修好小屏溢出，用发布前检查台过一遍再提交
        </p>
        <p className="wk-term-l" data-step data-c="o-t1">
          <span className="wk-dim">Molis Work · 发布前检查台</span> 4/4 通过
        </p>
        <p className="wk-term-l wk-ok" data-step data-c="o-t2">
          已提交 a3f9c21
        </p>
      </div>
      <Hand />
    </div>
  );
}

/** ⑥ 周日 17:30：AI 说做完了，Work 说还差你（访客亲手验收） */
export function DoneArt() {
  const reqs: [string, string, string?][] = [
    ['每天早上三张卡片', '测试 32/32 · Claude Code 报告'],
    ['划线只存本地', 'Codex 报告'],
    ['发布前检查都通过', '发布前检查台 · 4/4'],
    ['导出到 Anki', 'Codex 报告', 'no'],
  ];
  return (
    <div className="wk-scene wk-done">
      <Win
        tabs={[
          { icon: House, title: '划线卡片' },
          { icon: Target, title: GOAL, hue: 'blue', on: true },
        ]}
        dock={dockOf('Goals', Target, 1, [{ icon: ClipboardCheck }])}
        input={
          <>
            <Waiting n={1} c="d-wait" mid />
            <span className="wk-ph">让助理做点什么，或按 ⌘K 搜索</span>
          </>
        }
      >
        <div className="wk-goal">
          <GoalHead state={<Shift c="d-state" was={['progress', '正在推进']} now={['done', '已完成']} />} />
          <p className="wk-goal-t">{GOAL}</p>
          <div className="wk-gates">
            <p className="wk-gate" data-mid data-c="d-gate">
              <Ring tone="attention" />
              收尾未生效 · 待你验收：手机上的登录
            </p>
            <p className="wk-gate wk-gate-ok" data-step data-c="d-closed">
              <Ring tone="done" />
              完成要求全部满足 · 已收尾
            </p>
          </div>
          <p className="wk-reqs-h">完成要求</p>
          <div className="wk-reqs">
            {reqs.map(([name, basis, only], index) => (
              <p key={name} className="wk-req" data-req-ok="" data-if={only} data-c={`d-r${index}`}>
                <span className="wk-check-box">
                  <Check aria-hidden="true" />
                </span>
                {name}
                <small>依据：{basis}</small>
              </p>
            ))}
            <p className="wk-req wk-req-me" data-c="d-me">
              <span className="wk-check-box">
                <Check aria-hidden="true" />
              </span>
              手机上的登录
              <span className="wk-tagh">需要用户验收</span>
              <button type="button" className="wk-okbtn" data-c="d-ok" tabIndex={-1}>
                验收通过
              </button>
              <small className="wk-req-done">用户已验收通过</small>
            </p>
          </div>
          <div className="wk-timeline wk-done-log">
            <p className="wk-timeline-h">
              时间线 <span>记一笔</span>
            </p>
            <p className="wk-timeline-it" data-step data-c="d-log0">
              <span>17:28</span>
              <i data-ai="" />
              <b>
                <span className="wk-speaker">Claude Code</span>
                请求收尾：全部做完了，测试 32/32 通过。
              </b>
            </p>
            <p className="wk-timeline-it" data-step data-c="d-log1">
              <span>17:31</span>
              <i />
              <b>你验收通过：手机上的登录</b>
            </p>
          </div>
          <p className="wk-shipped" data-step data-c="d-ship">
            <span className="wk-file" data-kind="doc" />
            <b>划线卡片 v1</b> 已固定为交付物 · 18:02 上线
          </p>
        </div>
      </Win>
      <Hand />
    </div>
  );
}
