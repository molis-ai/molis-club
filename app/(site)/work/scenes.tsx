import {
  Bell,
  Braces,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Folder,
  Globe,
  House,
  Inbox,
  Library,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Monitor,
  Paperclip,
  Rss,
  Sparkles,
  Target,
  WandSparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import {
  Ai,
  Hand,
  Made,
  Ring,
  State,
  Win,
  Writes,
  type DockSpec,
  type Hue,
} from './app';

// 每一屏的画面（只有结构；怎么一拍一拍地演在 scripts.ts，样子在 work.css）。
// 约定：data-c 是编排认它的名字；data-step 是演到某一拍才出现、演完留着的；data-mid 是只在中途出现的；
// data-gone 是开头在、演完不在的。没有编排接管时（没有 JS、减少动态）就是做完的样子。
// 画面里的名字、数字、时间都是示意；界面上的字尽量照 Molis Work 现在的原文（项目建议、从本机导入角色、
// 约定今天跟进、1 项待你确认、作出决定、收尾未生效、用户已验收通过……）。

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** 底栏：当前在哪个插件，钉着的几颗 */
const dockOf = (
  label: string,
  icon: LucideIcon,
  on: number,
  extra?: DockSpec['icons'],
): DockSpec => ({
  current: { icon, label },
  icons: [
    { icon: House, on: on === 0 },
    { icon: Target, on: on === 1 },
    { icon: Inbox, on: on === 2 },
    { icon: FileText, on: on === 3 },
    ...(extra ?? []),
  ],
});

function Waiting({
  n,
  c,
  step,
  gone,
  mid,
}: {
  n: number;
  c?: string;
  step?: boolean;
  gone?: boolean;
  mid?: boolean;
}) {
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
                  <Writes c="h-2-w">
                    Codex 修好了 #12：长划线在手机上被截断
                  </Writes>
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
   全景：一整扇窗，镜头依次推近六处（推到哪里在 stages.tsx 的 CAM）
   ===================================================================== */

const PLUGINS: { icon: LucideIcon; name: string; hint: string; hue: Hue }[] = [
  { icon: Target, name: 'Goals', hint: '目标与验收', hue: 'blue' },
  { icon: FileText, name: 'Pages', hint: '文档', hue: 'cyan' },
  { icon: ListChecks, name: '待办', hint: '今天要做的', hue: 'green' },
  { icon: Inbox, name: 'Inbox', hint: '收进来的反馈', hue: 'orange' },
  { icon: Rss, name: 'Feed', hint: '关注的信息流', hue: 'yellow' },
  { icon: Lightbulb, name: '灵光', hint: '随手记一笔', hue: 'purple' },
  { icon: Braces, name: 'Coding', hint: '代码会话', hue: 'indigo' },
  { icon: Workflow, name: '工作流程', hint: '固定的几步', hue: 'mint' },
];

const AGENTS = ['Codex', 'OpenCode', 'Pi Agent', 'Grok Build', 'Cursor · MCP'];

/** 右栏 Shelf 里的一件 */
function Shelf({
  kind,
  name,
  meta,
}: {
  kind: 'img' | 'sheet' | 'doc' | 'web';
  name: string;
  meta?: string;
}) {
  return (
    <p className="wk-rail-it">
      {kind === 'web' ? (
        <Globe aria-hidden="true" />
      ) : (
        <span className="wk-file" data-kind={kind} />
      )}
      <span className="wk-rail-name">{name}</span>
      {meta ? <span className="wk-rail-meta">{meta}</span> : null}
    </p>
  );
}

/** 讨论里的一条：头像、名字、时间、一句话 */
function Msg({
  who,
  name,
  time,
  c,
  children,
}: {
  who: 'zhou' | 'ning' | 'assist' | 'codex' | 'me';
  name: string;
  time: string;
  c: string;
  children: ReactNode;
}) {
  const mark = { zhou: '周', ning: '宁', codex: 'C', me: '你' } as const;
  return (
    <div className="wk-msg" data-step data-c={c}>
      <span className="wk-av" data-who={who}>
        {who === 'assist' ? (
          <Sparkles aria-hidden="true" />
        ) : (
          <b>{mark[who]}</b>
        )}
      </span>
      <span className="wk-msg-b">
        <span className="wk-msg-n">
          {name}
          <small>{time}</small>
        </span>
        <span className="wk-msg-t">{children}</span>
      </span>
    </div>
  );
}

/** 右栏「讨论」：这个项目的群，请来测 Android 的两位朋友也在 */
function Talk() {
  return (
    <div className="wk-talk" data-mid data-c="t-talk">
      <div className="wk-talk-head">
        <p className="wk-talk-t">Android 内测</p>
        <p className="wk-talk-sub">项目讨论 · 4 位成员</p>
        <p className="wk-talk-ch">
          <span># 主群</span>
          <span data-ch-on=""># Android 内测</span>
        </p>
      </div>
      <div className="wk-talk-msgs" data-spot="talk">
        <Msg who="zhou" name="小周" time="10:02" c="t-talk-0">
          装好了。导入 2,140 条，等了快一分钟。
        </Msg>
        <Msg who="ning" name="阿宁" time="10:05" c="t-talk-1">
          能翻。手机横过来，字有点小。
        </Msg>
        <Msg who="assist" name="助理" time="10:06" c="t-talk-2">
          两条都对上了已知问题：导入慢那条补上机型；横屏和 iPad
          是同一个，并在一起了。
          <span className="wk-talk-ref">
            <FileText aria-hidden="true" />
            发布说明 · 已知问题
          </span>
        </Msg>
        <Msg who="me" name="你" time="10:08" c="t-talk-3">
          <b>@Codex</b> 横屏的字号一起看下
        </Msg>
        <Msg who="codex" name="Codex" time="10:08" c="t-talk-4">
          接了，改完把截图发回这里。
        </Msg>
      </div>
      <p className="wk-talk-in">发到 # Android 内测…</p>
    </div>
  );
}

/** 发布说明里「这一版有什么」的一行：改动、来自哪里、走到哪 */
function Change({
  title,
  from,
  spot,
  children,
}: {
  title: string;
  from: string;
  spot?: string;
  children: ReactNode;
}) {
  return (
    <div className="wk-tb-row" data-spot={spot}>
      <span>{title}</span>
      <span className="wk-tb-from">{from}</span>
      <span>{children}</span>
    </div>
  );
}

export function TourArt({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div className="wk-scene wk-tour-scene" data-theme={theme}>
      <div className="wk-cam">
        <Win
          theme={theme}
          tabs={[
            { icon: House, title: '项目首页' },
            { icon: Target, title: 'v1.1：导出到 Anki', hue: 'blue' },
            { icon: FileText, title: '发布说明', hue: 'cyan', on: true },
            { icon: Inbox, title: '反馈 · 41', hue: 'orange' },
            { icon: Braces, title: '#12 长划线截断', hue: 'indigo' },
          ]}
          dock={{
            current: { icon: FileText, label: 'Pages', c: 't-dock' },
            icons: [
              { icon: House },
              { icon: Target },
              { icon: FileText, on: true },
              { icon: ListChecks },
              { icon: Inbox },
              { icon: ClipboardCheck },
            ],
            more: '+3',
          }}
          input={
            <>
              <span data-c="t-wait" className="wk-wait-wrap">
                <Waiting n={2} />
              </span>
              <span className="wk-ph">让助理做点什么，或按 ⌘K 搜索</span>
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
                <span data-c="t-talk-tab">
                  <MessageSquare aria-hidden="true" />
                  讨论
                </span>
              </div>
              <div className="wk-rail-panes">
                <div className="wk-shelf">
                  <p className="wk-rail-h">
                    <ChevronDown aria-hidden="true" />
                    <Folder aria-hidden="true" />
                    材料 <span>4</span>
                  </p>
                  <Shelf
                    kind="img"
                    name="即刻 · 求一个划线复习工具.png"
                    meta="昨天"
                  />
                  <Shelf
                    kind="sheet"
                    name="读书划线导出（两年）.csv"
                    meta="2,140 条"
                  />
                  <Shelf kind="doc" name="旧笔记 · 间隔重复.md" />
                  <Shelf kind="doc" name="Anki 卡片模板.apkg" meta="12 KB" />
                  <p className="wk-rail-h">
                    <ChevronDown aria-hidden="true" />
                    <Globe aria-hidden="true" />
                    网页 <span>3</span>
                  </p>
                  <Shelf kind="web" name="Readwise · 导出接口说明" />
                  <Shelf kind="web" name="AnkiConnect · 文档" />
                  <Shelf kind="web" name="即刻 · 划线复习的讨论串" />
                  <p className="wk-rail-h">
                    <ChevronDown aria-hidden="true" />
                    <FileText aria-hidden="true" />
                    生成结果 <span>3</span>
                  </p>
                  <Shelf kind="doc" name="发布说明 · 第 2 版" meta="助理" />
                  <Shelf kind="doc" name="测试报告 · #12" meta="Codex" />
                  <Shelf
                    kind="sheet"
                    name="Readwise 导入 · 测试数据.csv"
                    meta="Claude Code"
                  />
                </div>
                <Talk />
              </div>
            </>
          }
        >
          <div className="wk-doc">
            <p className="wk-doc-k">
              Pages · 划线卡片
              <span>第 3 版 · 你 09:40 改过</span>
            </p>
            <p className="wk-h">v1.1 发布说明</p>
            <p className="wk-doc-chips">
              <span className="wk-chip" data-hue="blue">
                <Target aria-hidden="true" />
                v1.1：导出到 Anki
              </span>
              <span className="wk-chip">
                <Paperclip aria-hidden="true" />
                引用 3 份资料
              </span>
            </p>
            <p className="wk-doc-p">
              每天早上，三张卡片等你翻：从你两年的读书划线里挑出来，按间隔重复排好。这一版，卡片能导出到
              Anki，也能从 Readwise 一次导进来。
            </p>
            <p className="wk-doc-h2">这一版有什么</p>
            <div className="wk-tb">
              <div className="wk-tb-row wk-tb-head">
                <span>改动</span>
                <span>来自</span>
                <span>状态</span>
              </div>
              <Change title="导出到 Anki，一条划线一张卡" from="反馈 14 条">
                <State tone="done">已完成</State>
              </Change>
              <Change title="从 Readwise 一次导入" from="反馈 9 条" spot="row">
                <span className="wk-swap">
                  <span data-gone data-c="t-row-was">
                    <State tone="progress">进行中</State>
                  </span>
                  <span className="wk-by" data-step data-c="t-row-now">
                    <i>C</i>
                    Claude Code 在做
                  </span>
                </span>
              </Change>
              <Change title="长划线在手机上不再截断" from="#12 · Codex">
                <State tone="attention">等你验收</State>
              </Change>
            </div>
            <p className="wk-doc-h2">
              已知问题
              <span className="wk-doc-by">
                <Sparkles aria-hidden="true" />
                助理整理 · 来自 3 条反馈
              </span>
            </p>
            <ul className="wk-doc-ul">
              <li>
                <span className="wk-hl" data-spot="sel" data-c="t-sel">
                  Android 版下周再上，先请两位朋友帮忙测。
                </span>
                <span className="wk-ctx" data-mid data-c="t-ctx">
                  <span className="wk-ctx-chip">一句话 ×</span>
                  <span>记成待办</span>
                  <span data-c="t-give">交给助理</span>
                  <span>拆成目标步骤</span>
                  <span className="wk-ctx-more">更多</span>
                </span>
              </li>
              <li>超过 2,000 条划线时，第一次导入要等一分钟左右。</li>
              <li>iPad 横着拿时，卡片上的字偏小。</li>
            </ul>
          </div>
        </Win>

        {/* 插件：底栏胶囊往上展开的插件表 */}
        <div
          className="wk-pop wk-plugins"
          data-spot="plugins"
          data-mid
          data-c="t-plugins"
        >
          <p className="wk-pop-h">
            这个项目的插件
            <span>8 个已装</span>
          </p>
          <div className="wk-pl-grid">
            {PLUGINS.map(({ icon: Icon, name, hint, hue }) => (
              <span key={name} className="wk-pl">
                <span className="wk-pl-ic" data-hue={hue}>
                  <Icon aria-hidden="true" />
                </span>
                <span className="wk-pl-t">
                  <b>{name}</b>
                  <small>{hint}</small>
                </span>
              </span>
            ))}
          </div>
          <span className="wk-pl wk-pl-made" data-c="t-made">
            <span className="wk-pl-ic">
              <ClipboardCheck aria-hidden="true" />
            </span>
            <span className="wk-pl-t">
              <b>发布前检查台</b>
              <small>每次提交前过一遍，4 项</small>
            </span>
            <Made>你做的</Made>
          </span>
          <p className="wk-pop-foot">
            <WandSparkles aria-hidden="true" />
            插件创作工作台 · 说一句，做一个
          </p>
        </div>

        {/* 助理：选中的那句交过来，从输入框升起来的一块 */}
        <div
          className="wk-pop wk-askpanel"
          data-spot="ask"
          data-mid
          data-c="t-ask"
        >
          <p className="wk-ask-h">
            <Sparkles aria-hidden="true" />
            助理
            <span>划线卡片</span>
          </p>
          <p className="wk-ask-quote">
            Android 版下周再上，先请两位朋友帮忙测。
          </p>
          <p className="wk-ask-say">
            <Writes c="t-ask-w">
              拆成两件：周三前约两位朋友装测试版；他们的反馈收进 Inbox，标上
              Android。
            </Writes>
            <Ai n="助理" c="t-ask-ai" />
          </p>
          <p className="wk-ask-src" data-step data-c="t-ask-src">
            参考 · Inbox 里问 Android 的 6 条反馈
          </p>
          <div className="wk-opcard" data-step data-c="t-op">
            <p className="wk-opcard-k">
              <Ring tone="attention" />
              执行前需要你确认
            </p>
            <p className="wk-opcard-t">待办 · 新建 2 条</p>
            <p className="wk-opcard-li">
              <span className="wk-check-box" />
              约两位朋友测 Android 测试版
              <small>周三</small>
            </p>
            <p className="wk-opcard-li">
              <span className="wk-check-box" />
              测试反馈收进 Inbox，标上 Android
            </p>
            <p className="wk-opcard-f">
              <span className="wk-btn" data-c="t-allow">
                允许执行
              </span>
              <span className="wk-btn-line">拒绝</span>
            </p>
          </div>
        </div>

        {/* 外部 AI：你自己的终端，经 MCP 读写同一份目标 */}
        <div
          className="wk-term wk-tour-term"
          data-spot="agents"
          data-mid
          data-c="t-term"
        >
          <p className="wk-term-h">
            <i />
            <i />
            <i />
            Claude Code
            <span>~/code/highlight-cards</span>
          </p>
          <p className="wk-term-l" data-step data-c="t-term-0">
            <span className="wk-term-me">›</span> 接着做目标「v1.1：导出到
            Anki」
          </p>
          <p className="wk-term-l wk-dim" data-step data-c="t-term-1">
            读取 Molis Work · 经 MCP
          </p>
          <p className="wk-term-l wk-term-in" data-step data-c="t-term-2">
            3 条完成要求：1 条已完成，1 条等你验收
          </p>
          <p className="wk-term-l wk-term-in" data-step data-c="t-term-3">
            你周六定过：划线只存本地，不上云
          </p>
          <p className="wk-term-l" data-step data-c="t-term-4">
            <span className="wk-ok">●</span> 剩下「从 Readwise
            导入」我来接，做完把测试结果交回目标。
          </p>
          <p className="wk-agents" data-step data-c="t-agents">
            <span className="wk-agents-k">也能接</span>
            {AGENTS.map((name, index) => (
              <span key={name} style={v({ '--i': index })}>
                {name}
              </span>
            ))}
          </p>
        </div>

        {/* 等你：输入框旁的计数一点开 */}
        <div
          className="wk-pop wk-waitlist"
          data-spot="waitlist"
          data-mid
          data-c="t-waitlist"
        >
          <p className="wk-wl-h">
            等你 <span>2</span>
          </p>
          <div className="wk-wl-it">
            <Ring tone="attention" />
            <span className="wk-wl-t">
              <b>Codex 交了依据，要你验收</b>
              <small>Goals · 长划线在手机上不再截断 · 07:52</small>
            </span>
            <span className="wk-btn" data-c="t-check">
              去验收
            </span>
          </div>
          <div className="wk-wl-it">
            <Ring tone="attention" />
            <span className="wk-wl-t">
              <b>助理筛出 3 条要紧的反馈</b>
              <small>Inbox · 按你的规则「先看差评」 · 07:30</small>
            </span>
            <span className="wk-btn-line">去看</span>
          </div>
        </div>
      </div>
      <Hand />
    </div>
  );
}
