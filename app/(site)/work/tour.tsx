'use client';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronUp,
  ClipboardList,
  Code,
  Database,
  FileText,
  Folder,
  FolderCog,
  GitBranch,
  Globe,
  House,
  Image,
  Inbox,
  LayoutGrid,
  Library,
  Lightbulb,
  ListChecks,
  Lock,
  MessagesSquare,
  Package,
  Pin,
  Play,
  Plus,
  Presentation,
  Rss,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Store,
  Target,
  Terminal,
  Timer,
  User,
  Wand,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  workTour,
  type ByPersona,
  type Persona,
} from '../../../content/site/work';
import { useReducedMotion, useVisible } from '../../_site/motion';
import { pad } from '../../_site/ui';
import { usePersona, useTourTheme } from './persona';
import './tour.css';

// 产品全景：照 Molis Work 的窗口（Soft Workbench）画一整张，八段，一段讲一处。
// 窗口按 1200×760 画好，再整体缩放放进页面；手机上镜头推到每段讲的那一块。
// 每段的动作由下面一小段脚本按顺序演（光标、选中、浮条、打字），只在全景在视口里时演；
// 不在视口、减少动态时直接停在这一段的结果上。窗口里不出现内部用的 Issue。

const W = 1200;
const H = 760;
const CH_MIN = 8200;

type Rect = { x: number; y: number; w: number; h: number };
const pick = <T,>(value: T | ByPersona<T>, persona: Persona): T =>
  typeof value === 'object' && value !== null && 'dev' in (value as object)
    ? (value as ByPersona<T>)[persona]
    : (value as T);

/** 插件列表：产品里真实的分组；圆点是已发布（v0.2.0） */
const PLUGINS: [string, [LucideIcon, string, boolean?][]][][] = [
  [
    ['主线', [[Target, 'Goals', true], [Inbox, 'Inbox'], [Rss, 'Feed', true], [Terminal, 'Sessions', true]]],
    ['推进', [[Timer, 'Schedule'], [Workflow, '工作流程']]],
  ],
  [['写与做', [[FileText, 'Pages'], [ClipboardList, 'Forms'], [Database, 'Dataset'], [Presentation, 'PPT'], [Image, '图片'], [Package, '成果', true]]]],
  [
    ['个人', [[Lightbulb, '灵光'], [ListChecks, '待办'], [CalendarDays, 'Jelly'], [BookOpen, 'Cognia'], [Library, 'Shelf']]],
    ['研究 · 编码', [[Zap, '炼金术士'], [Code, 'Coding'], [GitBranch, 'Git']]],
  ],
];

const DOCS: ByPersona<{
  path: string;
  title: string;
  meta: string;
  sections: [string, string, boolean?][];
}> = {
  dev: {
    path: 'Pages · 设计',
    title: '支付设计',
    meta: '周二更新 · 你和 Claude Code 写的',
    sections: [
      ['一、回调', '回调必须幂等：同一笔订单重复通知，只记一次账。', true],
      ['二、金额', '金额统一用「分」存储和传输，界面上再换算成元。'],
      ['三、上线前', '沙箱走通三种支付方式；结算页的手机排版要人验收。'],
    ],
  },
  doc: {
    path: 'Pages · 长文',
    title: 'AI 编辑器观察',
    meta: '草稿 · 写到第三部分',
    sections: [
      ['一、补全之后', '两年前，大家比的是补全准不准、快不快。'],
      ['二、编辑器在变成什么', '模型会越来越像，体验不会。', true],
      ['三、价格与商业模式', ''],
    ],
  },
};

const SIDE: ByPersona<{
  talk: [string, string, string][];
  web: { url: string; title: string; video?: boolean };
  files: [string, string, string][];
  ideas: [string, string][];
}> = {
  dev: {
    talk: [
      ['周', '小周 · 产品', '结算页的设计稿更新了，金额改成分了。'],
      ['你', '你', '好，周四前接上。'],
    ],
    web: { url: 'docs.pay.example.com/callback', title: '回调签名说明' },
    files: [
      ['PDF', '支付平台接入文档.pdf', '2.1 MB'],
      ['IMG', '回调时序图.png', '340 KB'],
      ['TXT', 'callback.ts', '6 KB'],
    ],
    ideas: [
      ['退款是不是也要幂等？', '周二'],
      ['灰度先开 5%，看一晚上的回调成功率', '周三'],
    ],
  },
  doc: {
    talk: [
      ['编', '编辑', '周五前能交初稿吗？'],
      ['你', '你', '周五下午给你，第三部分还在写。'],
    ],
    web: { url: 'video.example.com/watch', title: '《AI 编辑器的下一步》', video: true },
    files: [
      ['PDF', 'AI 工具行业报告 Q3.pdf', '4.8 MB'],
      ['TXT', '设计师访谈记录.md', '18 KB'],
      ['IMG', '封面草图.png', '1.2 MB'],
    ],
    ideas: [
      ['写一篇：为什么大家又开始写长文', '10/09'],
      ['编辑器的定价，按「接住多少工作流」来比', '10/12'],
    ],
  },
};

const FLOAT: ByPersona<[LucideIcon, string][]> = {
  dev: [[ListChecks, '记成待办'], [Terminal, '交给 Codex'], [Target, '加进完成要求']],
  doc: [[Lightbulb, '记下灵光'], [BookOpen, '在我的资料里找依据'], [ListChecks, '拆成提纲']],
};
const FLOAT_DONE: ByPersona = {
  dev: '已记进待办 · 带着这句原话',
  doc: '已记进灵光 · 出处：《AI 编辑器观察》',
};
const ASK: ByPersona<{ q: string; a: string; uses: [LucideIcon, string][] }> = {
  dev: {
    q: '「上线支付」还差什么？',
    a: '还差 2 条：沙箱支付还没有依据；手机端排版要你验收。Claude Code 周四提交过收尾，因为这两条没算完。',
    uses: [[Target, '目标 · 上线支付'], [Terminal, '会话 · Claude Code']],
  },
  doc: {
    q: '第三部分还缺什么资料？',
    a: '还缺几家编辑器的定价。你的 Dataset「AI 工具定价」里有 6 家，读者留言里也有人问过。',
    uses: [[Database, 'Dataset · AI 工具定价'], [Inbox, 'Inbox · 读者留言']],
  },
};
const FIND: ByPersona<{ q: string; rows: [string, LucideIcon, string, string][] }> = {
  dev: {
    q: '支付',
    rows: [
      ['目标', Target, '上线支付', 'Goals'],
      ['文档', FileText, '支付设计', 'Pages'],
      ['会话', Terminal, 'Codex · #318 支付回调', 'Sessions'],
      ['信息流', Rss, '支付平台更新了回调签名说明', 'Feed'],
    ],
  },
  doc: {
    q: '编辑器',
    rows: [
      ['文档', FileText, 'AI 编辑器观察', 'Pages'],
      ['灵光', Lightbulb, '编辑器的定价，按工作流来比', '灵光'],
      ['资料', BookOpen, '3 条笔记提到编辑器', 'Cognia'],
      ['表格', Database, 'AI 工具定价 · 6 家', 'Dataset'],
    ],
  },
};

function Window({ persona, theme }: { persona: Persona; theme: 'light' | 'dark' }) {
  const doc = DOCS[persona];
  const side = SIDE[persona];
  return (
    <div className="wt-win" data-theme={theme}>
      <div className="wt-tbar">
        <span className="wt-lights">
          <i />
          <i />
          <i />
        </span>
        <span className="wt-hist">
          <ArrowLeft />
          <ArrowRight />
        </span>
        <div className="wt-tabs">
          <span className="wt-loc">
            <FileText />
            Pages
          </span>
          <span className="wt-tab" data-k="doc" data-cur="">
            <FileText />
            {doc.title}
          </span>
          <span className="wt-tab">
            {persona === 'dev' ? <Terminal /> : <Lightbulb />}
            {persona === 'dev' ? 'Codex · #318' : '灵光 · 选题'}
          </span>
          <span className="wt-tab">
            <Inbox />
            Inbox · 3
          </span>
          <span className="wt-tab wt-tab-new" data-k="new">
            <Target />
            {persona === 'dev' ? '上线支付' : '写完长文'}
          </span>
          <span className="wt-plus" data-k="plus">
            <Plus />
          </span>
        </div>
        <span className="wt-stat">
          <span>
            <i className="wt-spin" />
            后台任务 · 2
          </span>
          <span className="wt-bell">
            <Bell />1<i />
          </span>
        </span>
      </div>

      <section className="wt-sheet wt-main">
        <div className="wt-view" data-v="doc" data-on="">
          <p className="wt-path">{doc.path}</p>
          <h3 className="wt-title">{doc.title}</h3>
          <p className="wt-meta">{doc.meta}</p>
          {doc.sections.map(([head, text, sel]) => (
            <div key={head} className="wt-sec">
              <h4>{head}</h4>
              {text ? (
                <p>
                  {sel ? <span className="wt-sel" data-k="sel">{text}</span> : text}
                  {persona === 'doc' && sel ? <span className="wt-src">视频 · 12:40</span> : null}
                </p>
              ) : (
                <p className="wt-write">
                  <span className="wt-ph" data-k="ph">（还没写）</span>
                  <span data-k="typed" />
                  <span className="wt-src wt-later" data-k="src1">Dataset · AI 工具定价</span>
                  <span className="wt-src wt-later" data-k="src2">读者留言</span>
                </p>
              )}
            </div>
          ))}
        </div>
        {persona === 'dev' ? (
          <div className="wt-view" data-v="goal">
            <p className="wt-path">Goals · 支付改版</p>
            <h3 className="wt-title">上线支付</h3>
            <p className="wt-meta">
              进行中 · 完成要求 <b data-k="count">1/3</b>
            </p>
            <ul className="wt-reqs">
              <li data-done="">
                <i>
                  <Check />
                </i>
                <span>
                  回调幂等<small>依据：重放 20 次只记一笔 · Codex</small>
                </span>
              </li>
              <li data-k="rq2">
                <i>
                  <Check />
                </i>
                <span>
                  沙箱支付走通
                  <small>
                    <span className="wt-before">还没有依据</span>
                    <span className="wt-after">依据：沙箱 3 笔成功 · 测试 14/14 · Claude Code</span>
                  </small>
                </span>
              </li>
              <li>
                <i>
                  <Check />
                </i>
                <span>
                  手机端排版正常<em>要你验收</em>
                  <small>还没有依据</small>
                </span>
              </li>
            </ul>
          </div>
        ) : null}
      </section>

      <section className="wt-sheet wt-side">
        <div className="wt-stabs" data-k="stabs">
          {(
            [
              ['talk', MessagesSquare, '讨论'],
              ['web', Globe, '浏览器'],
              ['file', Folder, '文件'],
              ['idea', Lightbulb, '灵光'],
            ] as [string, LucideIcon, string][]
          ).map(([id, Icon, label]) => (
            <span key={id} className="wt-stab" data-st={id} data-cur={id === 'talk' || undefined}>
              <Icon />
              <em>{label}</em>
            </span>
          ))}
          <span className="wt-stab wt-termtab" data-st="term">
            <Terminal />
            <em>Claude Code</em>
          </span>
        </div>
        <div className="wt-pane" data-sp="talk" data-on="">
          {side.talk.map(([mono, who, text]) => (
            <p key={text} className="wt-chat">
              <span data-me={mono === '你' || undefined}>{mono}</span>
              <span>
                <b>{who}</b>
                {text}
              </span>
            </p>
          ))}
        </div>
        <div className="wt-pane" data-sp="web">
          <p className="wt-url">
            <Lock />
            {side.web.url}
          </p>
          {side.web.video ? (
            <p className="wt-vid">
              <Play />
            </p>
          ) : null}
          <p className="wt-webh">{side.web.title}</p>
          <p className="wt-bars">
            <i />
            <i style={{ width: '84%' }} />
            <i style={{ width: '70%' }} />
            <i style={{ width: '62%' }} />
          </p>
        </div>
        <div className="wt-pane" data-sp="file">
          {side.files.map(([kind, name, size]) => (
            <p key={name} className="wt-file">
              <span>{kind}</span>
              {name}
              <small>{size}</small>
            </p>
          ))}
        </div>
        <div className="wt-pane" data-sp="idea">
          {side.ideas.map(([text, when]) => (
            <p key={text} className="wt-idea">
              {text}
              <small>{when} · 记在灵光</small>
            </p>
          ))}
        </div>
        <div className="wt-pane wt-term" data-sp="term">
          <p className="wt-term-head">
            <b>Claude Code</b>
            <span>目标：上线支付</span>
          </p>
          <div className="wt-term-lines">
            <p className="wt-later wt-u" data-k="t1">接着做支付</p>
            <p className="wt-later" data-k="t2">读到目标「上线支付」：1/3，下一步沙箱支付</p>
            <p className="wt-later" data-k="t3">跑沙箱：微信、支付宝、银行卡……</p>
            <p className="wt-later wt-ok" data-k="t4">✓ 3 笔成功 · 测试 14/14</p>
            <p className="wt-later" data-k="t5">依据已写回目标</p>
          </div>
        </div>
      </section>

      <div className="wt-bar">
        <div className="wt-tray" data-k="left">
          <span className="wt-switch" data-k="switch">
            <LayoutGrid />
            Pages
            <ChevronUp />
          </span>
          {[House, Target, Inbox].map((Icon, index) => (
            <span key={index} className="wt-dk">
              <Icon />
            </span>
          ))}
          <span className="wt-dk" data-cur="">
            <FileText />
          </span>
          <span className="wt-dk">
            <Terminal />
          </span>
          <span className="wt-dk wt-later" data-k="pinned">
            <ListChecks />
          </span>
        </div>
        <div className="wt-comp" data-k="comp">
          <Sparkles />
          <span data-k="comp-text" />
          <kbd data-k="kbd">⌘K</kbd>
        </div>
        <div className="wt-tray" data-k="right">
          {[Library, Lightbulb, MessagesSquare].map((Icon, index) => (
            <span key={index} className="wt-dk">
              <Icon />
            </span>
          ))}
          <span className="wt-mono" data-k="mono" data-hue={persona}>
            {persona === 'dev' ? '支' : '写'}
          </span>
        </div>
      </div>

      {/* 浮在上面的：聚光、标签、菜单、浮条、回答、搜索、提示、光标 */}
      <div className="wt-spot" data-k="spot" />
      <span className="wt-label" data-k="l1" style={{ left: 360, top: 560 }}>
        正在做的
      </span>
      <span className="wt-label" data-k="l2" style={{ left: 980, top: 560 }}>
        参考
      </span>
      <span className="wt-label" data-k="l3" style={{ left: 500, top: 626 }}>
        插件 · 助理 · 项目
      </span>

      <div className="wt-pop wt-switcher" data-k="switcher">
        <div className="wt-sw-head">
          <span className="wt-sw-search">
            <Search />
            搜索插件和内容<kbd>⌘K</kbd>
          </span>
          <span className="wt-sw-btn">
            <Store />
            插件市场
          </span>
          <span className="wt-sw-btn">
            <Wand />
            插件创作工作台
          </span>
        </div>
        <div className="wt-sw-cols">
          {PLUGINS.map((col, c) => (
            <div key={c}>
              {col.map(([group, rows]) => (
                <div key={group}>
                  <p className="wt-sw-g">{group}</p>
                  {rows.map(([Icon, name, rel]) => (
                    <p
                      key={name}
                      className="wt-sw-row"
                      data-cur={name === 'Pages' || undefined}
                      data-k={name === '待办' ? 'todo-row' : undefined}
                    >
                      <Icon />
                      {name}
                      {rel ? <i className="wt-rel" /> : null}
                      {name === '待办' ? (
                        <span className="wt-pinb" data-k="pinb">
                          <Pin />
                        </span>
                      ) : null}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="wt-sw-foot">
          <i className="wt-rel" />
          已发布（v0.2.0），其余开发中
        </p>
      </div>

      <div className="wt-pop wt-proj" data-k="proj">
        {(
          [
            ['支', '支付改版', 'dev'],
            ['写', '写作', 'doc'],
            ['个', '个人空间', ''],
          ] as [string, string, string][]
        ).map(([mono, name, owner]) => (
          <p key={name} className="wt-pm" data-k={owner && owner !== persona ? 'pm-other' : undefined}>
            <span className="wt-pm-m" data-hue={owner || 'me'}>
              {mono}
            </span>
            {name}
            {owner === persona ? <Check className="wt-pm-ok" /> : null}
          </p>
        ))}
        <i className="wt-pm-sep" />
        {(
          [
            [FolderCog, '管理项目'],
            [SlidersHorizontal, '项目设置'],
          ] as [LucideIcon, string][]
        ).map(([Icon, name]) => (
          <p key={name} className="wt-pm">
            <Icon />
            {name}
          </p>
        ))}
        <i className="wt-pm-sep" />
        {(
          [
            [User, '你'],
            [ShieldCheck, '能力'],
            [Settings, '设置'],
          ] as [LucideIcon, string][]
        ).map(([Icon, name]) => (
          <p key={name} className="wt-pm">
            <Icon />
            {name}
          </p>
        ))}
      </div>

      <div className="wt-ctb" data-k="ctb">
        {FLOAT[persona].map(([Icon, label], index) => (
          <span key={label} data-primary={index === 0 || undefined} data-k={index === 0 ? 'ctb1' : undefined}>
            <Icon />
            {label}
          </span>
        ))}
        <span className="wt-ctb-ai">
          <Sparkles />
          助理
        </span>
      </div>

      <div className="wt-pop wt-answer" data-k="answer">
        <p className="wt-ans-q">
          问：<b>{ASK[persona].q}</b>
        </p>
        <p className="wt-ans-a">{ASK[persona].a}</p>
        <p className="wt-ans-uses">
          {ASK[persona].uses.map(([Icon, label]) => (
            <span key={label}>
              <Icon />
              {label}
            </span>
          ))}
        </p>
      </div>

      <div className="wt-pop wt-find" data-k="find">
        <p className="wt-find-in">
          <Search />
          <span data-k="find-q" />
        </p>
        {FIND[persona].rows.map(([group, Icon, title, from], index) => (
          <div key={title}>
            <p className="wt-find-g">{group}</p>
            <p className="wt-find-row wt-later" data-k={`fr${index}`} data-first={index === 0 || undefined}>
              <Icon />
              {title}
              <small>{from}</small>
            </p>
          </div>
        ))}
      </div>

      <p className="wt-toast" data-k="toast">
        <Check />
        {FLOAT_DONE[persona]}
      </p>
      <span className="wt-cursor" data-k="cursor">
        <svg viewBox="0 0 16 20" width="22" height="27">
          <path
            d="M1.5 1.5v14.2l3.9-3.6 2.6 6 2.4-1-2.6-5.9h5.3z"
            fill="#fff"
            stroke="#1b1a18"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

export function Tour() {
  const { persona } = usePersona();
  const reduced = useReducedMotion();
  const view = useRef<HTMLElement>(null);
  const visible = useVisible(view, 0.3);
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);
  const { theme, set: chooseTheme } = useTourTheme();
  const [run, setRun] = useState(0);
  const focusRef = useRef<{ rect: Rect; narrow?: Rect }>({ rect: { x: 0, y: 0, w: W, h: H } });
  const scaleRef = useRef(1);


  // 镜头：宽屏整窗放进来；手机上推到这一段讲的那一块
  const layout = () => {
    const vp = view.current;
    const win = vp?.querySelector<HTMLElement>('.wt-win');
    if (!vp || !win) return;
    const width = vp.clientWidth;
    if (width < 40) return;
    const narrow = width < 720;
    const height = narrow ? Math.round(width * 1.02) : Math.round((H * width) / W);
    vp.style.height = `${height}px`;
    const rect = narrow ? (focusRef.current.narrow ?? focusRef.current.rect) : { x: 0, y: 0, w: W, h: H };
    const gap = narrow ? 12 : 0;
    const s = narrow
      ? Math.min(width / (rect.w + gap * 2), height / (rect.h + gap * 2), 0.92)
      : width / W;
    let tx = width / 2 - (rect.x + rect.w / 2) * s;
    let ty = height / 2 - (rect.y + rect.h / 2) * s;
    tx = W * s <= width ? (width - W * s) / 2 : Math.min(0, Math.max(width - W * s, tx));
    ty = H * s <= height ? (height - H * s) / 2 : Math.min(0, Math.max(height - H * s, ty));
    scaleRef.current = s;
    win.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    // 手机上整窗缩得很小时，三处标签反向放大到看得清（约 11px），并挪到各自区域的中间
    win.toggleAttribute('data-narrow', narrow);
    win.style.setProperty('--lab', String(Math.max(1, Math.min(2.6, 11 / (15 * s)))));
  };
  useEffect(() => {
    const vp = view.current;
    if (!vp) return;
    const observer = new ResizeObserver(() => layout());
    observer.observe(vp);
    layout();
    return () => observer.disconnect();
  }, []);

  // 演这一段
  useEffect(() => {
    const vp = view.current;
    const win = vp?.querySelector<HTMLElement>('.wt-win');
    if (!vp || !win) return;
    let alive = true;
    const instant = reduced || !visible;
    const ok = () => alive;
    const $ = (k: string) => win.querySelector<HTMLElement>(`[data-k="${k}"]`)!;
    const sleep = (ms: number) => new Promise<void>((done) => setTimeout(done, instant ? 0 : ms));
    win.classList.toggle('wt-jump', instant);

    const cursor = $('cursor');
    let at = { x: 600, y: 420 };
    const place = (x: number, y: number, ms: number) => {
      cursor.style.transitionDuration = `${instant ? 0 : ms}ms`;
      cursor.style.transform = `translate(${x - 3}px, ${y - 2}px)`;
      at = { x, y };
    };
    /** 元素在窗口里的位置（窗口坐标，不受缩放影响） */
    const box = (el: Element, last = false): Rect => {
      const w = win.getBoundingClientRect();
      const list = el.getClientRects();
      const r = list.length ? list[last ? list.length - 1 : 0] : el.getBoundingClientRect();
      const s = scaleRef.current;
      return { x: (r.left - w.left) / s, y: (r.top - w.top) / s, w: r.width / s, h: r.height / s };
    };
    const lrect = (...els: HTMLElement[]): Rect => {
      const rs = els.map((el) => {
        let x = 0;
        let y = 0;
        let node: HTMLElement | null = el;
        while (node && node !== win) {
          x += node.offsetLeft;
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        return { x, y, w: el.offsetWidth, h: el.offsetHeight };
      });
      const x0 = Math.min(...rs.map((r) => r.x)) - 6;
      const y0 = Math.min(...rs.map((r) => r.y)) - 6;
      const x1 = Math.max(...rs.map((r) => r.x + r.w)) + 6;
      const y1 = Math.max(...rs.map((r) => r.y + r.h)) + 6;
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    };
    const moveTo = async (el: Element, fx = 0.5, fy = 0.55) => {
      if (!instant) cursor.dataset.on = '';
      const r = box(el);
      const x = r.x + r.w * fx;
      const y = r.y + r.h * fy;
      const ms = Math.min(800, Math.max(320, Math.hypot(x - at.x, y - at.y) * 0.9));
      place(x, y, ms);
      await sleep(ms + 60);
    };
    const click = async () => {
      if (instant) return;
      cursor.dataset.down = '';
      const ring = document.createElement('i');
      ring.className = 'wt-ring';
      ring.style.left = `${at.x}px`;
      ring.style.top = `${at.y}px`;
      win.appendChild(ring);
      window.setTimeout(() => ring.remove(), 600);
      await sleep(150);
      delete cursor.dataset.down;
      await sleep(140);
    };
    const focus = async (rect: Rect, spot = true, narrow?: Rect) => {
      focusRef.current = { rect, narrow };
      const sp = $('spot');
      Object.assign(sp.style, {
        left: `${rect.x - 6}px`,
        top: `${rect.y - 6}px`,
        width: `${rect.w + 12}px`,
        height: `${rect.h + 12}px`,
      });
      sp.toggleAttribute('data-on', spot);
      layout();
      await sleep(720);
    };
    const type = async (el: HTMLElement, text: string, ms = 45) => {
      if (instant) {
        el.textContent = text;
        return;
      }
      for (let i = 1; i <= text.length; i += 1) {
        if (!ok()) return;
        el.textContent = text.slice(0, i);
        await sleep(ms);
      }
    };
    const on = (k: string, value = true) => $(k).toggleAttribute('data-on', value);
    const side = (name: string) => {
      win.querySelectorAll<HTMLElement>('.wt-stab').forEach((t) => t.toggleAttribute('data-cur', t.dataset.st === name));
      win.querySelectorAll<HTMLElement>('.wt-pane').forEach((p) => p.toggleAttribute('data-on', p.dataset.sp === name));
    };
    const main = (name: string) =>
      win.querySelectorAll<HTMLElement>('.wt-view').forEach((v) => v.toggleAttribute('data-on', v.dataset.v === name));
    const comp = (text: string, typing = false) => {
      $('comp-text').textContent = text;
      $('comp').toggleAttribute('data-typing', typing);
    };

    const reset = () => {
      win.querySelectorAll('.wt-ring').forEach((n) => n.remove());
      win.querySelectorAll<HTMLElement>('[data-on]').forEach((n) => {
        if (!n.classList.contains('wt-view') && !n.classList.contains('wt-pane')) n.removeAttribute('data-on');
      });
      win.querySelectorAll<HTMLElement>('[data-sel], [data-hover]').forEach((n) => {
        n.removeAttribute('data-sel');
        n.removeAttribute('data-hover');
      });
      main('doc');
      side('talk');
      win.querySelectorAll<HTMLElement>('.wt-tab').forEach((t) => t.toggleAttribute('data-cur', t.dataset.k === 'doc'));
      comp('让助理做点什么，或按 ⌘K 搜索');
      $('find-q').textContent = '';
      const typed = win.querySelector<HTMLElement>('[data-k="typed"]');
      if (typed) typed.textContent = '';
      $('stabs').removeAttribute('data-compact');
      place(600, 420, 0);
      delete cursor.dataset.on;
      focusRef.current = { rect: { x: 0, y: 0, w: W, h: H } };
    };

    const chapters: (() => Promise<void>)[] = [
      // 1 一个窗口：三处各挂一个标签
      async () => {
        await focus({ x: 0, y: 0, w: W, h: H }, false);
        for (const k of ['l1', 'l2', 'l3']) {
          if (!ok()) return;
          on(k);
          await sleep(900);
        }
      },
      // 2 项目与标签：开一个新标签；右下角切项目
      async () => {
        await focus({ x: 0, y: 0, w: 760, h: 46 }, true, { x: 120, y: 0, w: 640, h: 300 });
        if (!ok()) return;
        await moveTo($('plus'));
        if (!ok()) return;
        await click();
        on('new');
        win.querySelectorAll<HTMLElement>('.wt-tab').forEach((t) => t.toggleAttribute('data-cur', t.dataset.k === 'new'));
        await sleep(1100);
        if (!ok()) return;
        await focus({ x: 950, y: 380, w: 250, h: 380 });
        if (!ok()) return;
        await moveTo($('mono'));
        if (!ok()) return;
        await click();
        on('mono');
        on('proj');
        await sleep(500);
        if (!ok()) return;
        const other = win.querySelector<HTMLElement>('[data-k="pm-other"]');
        if (other) {
          await moveTo(other, 0.4);
          other.toggleAttribute('data-hover', true);
        }
      },
      // 3 插件：打开插件列表，把「待办」钉到底栏
      async () => {
        await focus({ x: 6, y: 236, w: 640, h: 518 });
        if (!ok()) return;
        await moveTo($('switch'));
        if (!ok()) return;
        await click();
        on('switch');
        on('switcher');
        await sleep(900);
        if (!ok()) return;
        await moveTo($('todo-row'), 0.3);
        if (!ok()) return;
        on('todo-row');
        await sleep(400);
        if (!ok()) return;
        await moveTo($('pinb'));
        if (!ok()) return;
        await click();
        on('pinb');
        on('pinned');
      },
      // 4 右栏：浏览器、文件、灵光
      async () => {
        await focus({ x: 840, y: 36, w: 352, h: 654 });
        for (const name of ['web', 'file', 'idea']) {
          if (!ok()) return;
          const tab = win.querySelector<HTMLElement>(`.wt-stab[data-st="${name}"]`)!;
          await moveTo(tab);
          if (!ok()) return;
          await click();
          side(name);
          await sleep(1000);
        }
      },
      // 5 浮条：选中一句，两三个动作递来；点第一个
      async () => {
        const sel = $('sel');
        const para = lrect(sel.parentElement as HTMLElement);
        await focus(
          { x: 40, y: para.y - 64, w: 760, h: para.h + 112 },
          true,
          { x: 40, y: para.y - 64, w: 470, h: para.h + 112 },
        );
        if (!ok()) return;
        const a = box(sel);
        const b = box(sel, true);
        await moveTo(sel, 0, 0.6);
        if (!ok()) return;
        sel.toggleAttribute('data-sel', true);
        place(b.x + b.w, b.y + b.h * 0.6, 640);
        await sleep(700);
        if (!ok()) return;
        const ctb = $('ctb');
        ctb.style.left = `${Math.max(20, Math.min(800 - ctb.offsetWidth, a.x))}px`;
        ctb.style.top = `${a.y - ctb.offsetHeight - 10}px`;
        on('ctb');
        await sleep(1000);
        if (!ok()) return;
        await moveTo($('ctb1'));
        if (!ok()) return;
        await click();
        // 停在这一刻：浮条还在，结果已经落下
        on('toast');
      },
      // 6 助理：在底下问一句，回答浮在输入框上方
      async () => {
        const c = lrect($('comp'));
        await focus(c);
        if (!ok()) return;
        await moveTo($('comp'), 0.3);
        if (!ok()) return;
        await click();
        comp('', true);
        await type($('comp-text'), ASK[persona].q);
        if (!ok()) return;
        await sleep(400);
        if (!ok()) return;
        comp('让助理做点什么，或按 ⌘K 搜索');
        const answer = $('answer');
        Object.assign(answer.style, { left: `${c.x + 6}px`, width: `${c.w - 12}px` });
        on('answer');
        await sleep(50);
        await focus(lrect(answer, $('comp')));
      },
      // 7 写代码：终端绑着目标，依据写回目标页；写文档：让助理接着写，带着出处
      async () => {
        if (persona === 'dev') {
          await focus({ x: 8, y: 36, w: 1184, h: 654 });
          if (!ok()) return;
          main('goal');
          $('stabs').setAttribute('data-compact', '');
          side('term');
          for (const k of ['t1', 't2', 't3', 't4', 't5']) {
            await sleep(k === 't4' ? 1000 : 700);
            if (!ok()) return;
            on(k);
          }
          on('rq2');
          $('count').textContent = '2/3';
        } else {
          await focus({ x: 8, y: 36, w: 880, h: 724 }, false);
          if (!ok()) return;
          await moveTo($('comp'), 0.3);
          if (!ok()) return;
          await click();
          comp('', true);
          await type($('comp-text'), '接着写第三部分，用上定价表');
          if (!ok()) return;
          await sleep(300);
          comp('让助理做点什么，或按 ⌘K 搜索');
          on('ph');
          await type($('typed'), '六家里有四家按月订阅；差别不在价格，在每档能接住多少工作流。', 34);
          if (!ok()) return;
          on('src1');
          await sleep(200);
          on('src2');
          await sleep(500);
          if (!ok()) return;
          // 停在这一刻：刚写进来的一段和它用到的资料亮着
          const sec = $('typed').closest<HTMLElement>('.wt-sec');
          if (sec) await focus(lrect(sec), true, lrect(sec));
        }
      },
      // 8 ⌘K 和后台：搜一个词，各插件的结果一起出来；右上角看在跑的和等你的
      async () => {
        await focus({ x: 280, y: 0, w: 920, h: 420 }, true, { x: 300, y: 40, w: 600, h: 380 });
        if (!ok()) return;
        on('kbd');
        await sleep(300);
        if (!ok()) return;
        on('kbd', false);
        on('find');
        await type($('find-q'), FIND[persona].q, 160);
        for (let i = 0; i < FIND[persona].rows.length; i += 1) {
          await sleep(160);
          if (!ok()) return;
          on(`fr${i}`);
        }
        await sleep(1200);
        if (!ok()) return;
        // 搜索结果留着；再把右上角「在跑的、等你的」一起点亮
        win.querySelector('.wt-stat')?.toggleAttribute('data-on', true);
        await focus({ x: 290, y: 2, w: 904, h: 420 }, true, { x: 300, y: 40, w: 600, h: 380 });
      },
    ];

    let timer = 0;
    void (async () => {
      reset();
      const t0 = performance.now();
      await chapters[current]();
      if (!ok()) return;
      win.classList.remove('wt-jump');
      delete cursor.dataset.on;
      if (instant || !auto) return;
      const rest = Math.max(2200, CH_MIN - (performance.now() - t0));
      timer = window.setTimeout(() => {
        if (alive) setCurrent((value) => (value + 1) % workTour.chapters.length);
      }, rest);
    })();
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [current, persona, visible, auto, reduced, run]);

  const chapter = workTour.chapters[current];
  const status = pick(chapter.status, persona);
  return (
    <div className="wt" style={{ '--dur': `${CH_MIN}ms` } as CSSProperties}>
      <div className="wt-tools">
        <ol className="wt-chapters" aria-label="产品全景的八段">
          {workTour.chapters.map((item, index) => (
            <li key={index}>
              <button
                type="button"
                aria-current={index === current ? 'step' : undefined}
                data-run={(index === current && auto && visible && !reduced) || undefined}
                data-key={run}
                onClick={() => {
                  setCurrent(index);
                  setRun((value) => value + 1);
                }}
              >
                <span className="m-no">{pad(index + 1)}</span>
                {pick(item.name, persona)}
              </button>
            </li>
          ))}
        </ol>
        <div className="wt-controls">
          <fieldset className="wt-seg">
            <legend className="sr-only">窗口配色</legend>
            {(['light', 'dark'] as const).map((id) => (
              <button key={id} type="button" aria-pressed={theme === id} onClick={() => chooseTheme(id)}>
                {workTour.theme[id]}
              </button>
            ))}
          </fieldset>
          {reduced ? null : (
            <button
              type="button"
              className="wt-auto"
              aria-pressed={auto}
              onClick={() => {
                setAuto((value) => !value);
                setRun((value) => value + 1);
              }}
            >
              <i aria-hidden="true" />
              {auto ? workTour.play.on : workTour.play.off}
            </button>
          )}
        </div>
      </div>
      <figure
        className="wt-stage"
        ref={view}
        aria-label={`Molis Work 窗口示意，第 ${current + 1} 段：${pick(chapter.title, persona)}${pick(chapter.text, persona)}`}
      >
        <Window persona={persona} theme={theme} />
      </figure>
      <div className="wt-cap" aria-live="polite">
        <p className="wt-cap-k">
          <span className="m-no">{pad(current + 1)}</span>
          <span className="m-note">{status === 'rel' ? '已发布 · v0.2.0' : '开发中'}</span>
          <span className="wt-demo">{workTour.note}</span>
        </p>
        <h3>{pick(chapter.title, persona)}</h3>
        <p>{pick(chapter.text, persona)}</p>
      </div>
    </div>
  );
}
