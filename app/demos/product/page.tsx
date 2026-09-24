'use client';

import { useState, type KeyboardEvent } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  Code2,
  FileText,
  FolderOpen,
  Menu,
  MessageSquare,
  RotateCcw,
  Search,
  X,
  Layers3,
  Plus,
} from 'lucide-react';
import './product.css';

const repository = 'https://github.com/molis-ai/molis-work';
const navigation = [
  { label: '如何工作', href: '#workflow' },
  { label: '适合谁', href: '#scenarios' },
  { label: '产品', href: '#products' },
  { label: '开始使用', href: '#start' },
];
const stages = [
  {
    label: '说清目标',
    agent: '你与 Codex',
    day: '周一',
    title: '做一份真正好用的访谈指南',
    description:
      '给第一次做用户访谈的同学，一份能直接带进现场的提问与记录指南。',
    state: '目标已约定',
    activity: '先说清楚，怎样才算做好。',
    note: '我们要理解真实经历，而不是收集对产品的客套评价。',
    file: '访谈目标.md',
    lines: [
      '覆盖开场、追问和结束三个阶段',
      '每个问题都能带出一段真实经历',
      '经过一次试访，再由你确认交付',
    ],
  },
  {
    label: '接着推进',
    agent: 'Claude Code',
    day: '周二',
    title: '初稿有了，带着昨天的约定继续',
    description: '换到新的 AI 会话，目标、初稿和下一步仍在同一个项目里。',
    state: '正在推进',
    activity: '接上已有的工作，从试访开始。',
    note: '已读到最初的目标。接下来用一次试访，看看追问是否自然、记录是否顺手。',
    file: '访谈指南 v1.md',
    lines: [
      '已完成：整理 12 个核心问题',
      '待验证：进行一次试访',
      '下一步：记录卡住的地方，调整提纲',
    ],
  },
  {
    label: '由你判断',
    agent: '你',
    day: '周三',
    title: '做好了的部分，和依据放在一起',
    description: '试访后合并了重复问题，补上记录示例。最后一步，是你的判断。',
    state: '等待你的确认',
    activity: '结果已准备好，请对照约定看一眼。',
    note: '开场、追问与结束均有示例。试访记录里保留了问题、修改理由和仍需注意的地方。',
    file: '访谈指南 v2.md',
    lines: [
      '访谈指南 v2：三个阶段与记录示例',
      '试访记录：遇到的问题和调整依据',
      '待你确认：是否可以交给同学使用',
    ],
  },
];
const scenarios = [
  {
    tab: '把一个作品做出来',
    title: '灵感会变。\n起点不用丢。',
    text: '从第一次研究，到脚本、页面或原型。让每次探索留下的发现，成为下一次创作的材料。',
    goal: '做一个讲清楚想法的作品',
    records: [
      '最初的问题与想表达的观点',
      '研究笔记、草稿与修改理由',
      '对照目标，决定这一版能否交付',
    ],
  },
  {
    tab: '让一个项目持续向前',
    title: '隔了几天，\n也接得上。',
    text: '项目跨越许多次会话，也可能换过工具。回来看见做到哪、卡在哪，直接从下一步开始。',
    goal: '持续推进一项长期工作',
    records: [
      '共同维护的目标与范围',
      '已经完成、尚未解决的工作',
      '下一步行动和需要人的决定',
    ],
  },
];
const otherProducts = [
  {
    name: 'DropAgent',
    category: 'work',
    description: '把材料交给本地 Agent，再把结果带回手头的工作。',
    stage: 'macOS · 公开下载',
    href: 'https://github.com/molis-ai/DropAgent',
    icon: 'drop',
  },
  {
    name: 'Jelly',
    category: 'work',
    description: '让日历、清单、笔记和随手记下的灵感，待在一起。',
    stage: 'macOS · 公开源码',
    href: 'https://github.com/molis-ai/Jelly',
    icon: '/images/products/jelly.png',
  },
  {
    name: '牛来 niul.ai',
    category: 'work',
    description: '一头桌面上的牛，让 AI 会话的忙碌与等待看得见。',
    stage: 'macOS · 公开源码',
    href: 'https://github.com/molis-ai/niul.ai',
    icon: '/images/products/niulai.png',
  },
];

function tabKeys(
  event: KeyboardEvent<HTMLButtonElement>,
  index: number,
  count: number,
  choose: (index: number) => void,
) {
  let next = index;
  if (event.key === 'ArrowRight') next = (index + 1) % count;
  else if (event.key === 'ArrowLeft') next = (index - 1 + count) % count;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = count - 1;
  else return;
  event.preventDefault();
  choose(next);
  event.currentTarget.parentElement
    ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    [next]?.focus();
}

export default function ProductDemo() {
  const [menu, setMenu] = useState(false);
  const [stage, setStage] = useState(0);
  const [decision, setDecision] = useState<'pending' | 'accepted' | 'revise'>(
    'pending',
  );
  const [fileOpen, setFileOpen] = useState(false);
  const [scenario, setScenario] = useState(0);
  const [filter, setFilter] = useState('all');
  const current = stages[stage];
  const selectedScenario = scenarios[scenario];
  const chooseStage = (next: number) => {
    setStage(next);
    setFileOpen(false);
    setDecision('pending');
  };
  const reset = () => {
    chooseStage(0);
    setDecision('pending');
  };

  return (
    <div className="sp-site">
      <header className="sp-header">
        <a href="#main" className="sp-logo" aria-label="Molis Work 首页">
          <img src="/images/molis-logo.png" width="31" height="31" alt="" />
          <span>
            Molis <b>Work</b>
          </span>
        </a>
        <nav className="sp-navigation" aria-label="产品导航">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="sp-header-source"
          href={repository}
          target="_blank"
          rel="noreferrer"
        >
          GitHub <ArrowUpRight size={15} />
        </a>
        <button
          className="sp-menu-button"
          type="button"
          aria-label={menu ? '收起导航' : '打开导航'}
          aria-expanded={menu}
          aria-controls="sp-mobile-menu"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X size={21} /> : <Menu size={21} />}
        </button>
        {menu && (
          <nav
            className="sp-mobile-menu"
            id="sp-mobile-menu"
            aria-label="移动产品导航"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenu(false)}
              >
                {item.label}
                <ChevronRight size={16} />
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="main">
        <section className="sp-hero" aria-labelledby="sp-title">
          <div className="sp-hero-copy">
            <h1 id="sp-title">
              换一个 AI，
              <br className="sp-title-break" />
              工作接着来。
            </h1>
            <p>
              目标、进展和重要判断，留在同一个地方。
              <br className="sp-desktop-break" />
              让每一次对话，都从已经做过的事开始。
            </p>
            <a className="sp-button" href="#workflow">
              看看它如何工作 <ArrowDown size={16} />
            </a>
          </div>

          <div className="sp-workflow" id="workflow">
            <div className="sp-window">
              <div className="sp-window-bar">
                <div className="sp-window-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <span>
                  <Layers3 size={14} /> Molis Work
                </span>
                <small>工作流程示意</small>
              </div>
              <div className="sp-workspace">
                <aside className="sp-sidebar" aria-label="示例项目">
                  <div className="sp-space-name">
                    我的工作空间 <ChevronDown size={13} />
                  </div>
                  <div className="sp-side-muted">
                    <Search size={14} /> 查找
                  </div>
                  <div className="sp-side-muted">
                    <MessageSquare size={14} /> 工作记录
                  </div>
                  <div className="sp-sidebar-label">项目</div>
                  <div className="sp-project-selected">
                    <FolderOpen size={14} /> 用户访谈指南
                  </div>
                  <div className="sp-side-tree">
                    {stages.map((item, i) => (
                      <span
                        key={item.label}
                        className={stage === i ? 'sp-is-current' : ''}
                      >
                        {i < stage || decision === 'accepted' ? (
                          <Check size={12} />
                        ) : (
                          <Circle size={10} />
                        )}
                        {item.label}
                      </span>
                    ))}
                  </div>
                  <div className="sp-sidebar-bottom">
                    <span className="sp-person">我</span>
                    <span>自己的项目，自己的节奏</span>
                  </div>
                </aside>
                <div
                  className="sp-document"
                  role="tabpanel"
                  id="sp-flow-panel"
                  aria-labelledby={`sp-flow-tab-${stage}`}
                  tabIndex={0}
                >
                  <div className="sp-document-location">
                    <span>用户访谈指南</span>
                    <ChevronRight size={12} />
                    <span>{current.label}</span>
                  </div>
                  <div className="sp-document-body" key={stage}>
                    <div className="sp-document-state">
                      <i />
                      {stage === 2 && decision === 'accepted'
                        ? '已由你确认'
                        : stage === 2 && decision === 'revise'
                          ? '需要继续调整'
                          : current.state}
                    </div>
                    <h2>{current.title}</h2>
                    <p className="sp-document-description">
                      {current.description}
                    </p>
                    <div className="sp-checklist">
                      {current.lines.map((line, i) => (
                        <div key={line}>
                          <span
                            className={
                              i < stage || decision === 'accepted'
                                ? 'sp-checked'
                                : ''
                            }
                          >
                            {i < stage || decision === 'accepted' ? (
                              <Check size={12} />
                            ) : null}
                          </span>
                          <p>
                            {stage === 2 && i === 2 && decision === 'accepted'
                              ? '已由你确认：可以交给同学使用'
                              : line}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="sp-file"
                      aria-expanded={fileOpen}
                      aria-controls="sp-file-preview"
                      onClick={() => setFileOpen(!fileOpen)}
                    >
                      <span className="sp-file-icon">
                        <FileText size={19} />
                      </span>
                      <span>
                        {current.file}
                        <small>点击看看这份示例材料</small>
                      </span>
                      <ChevronDown
                        size={15}
                        className={fileOpen ? 'sp-rotated' : ''}
                      />
                    </button>
                    {fileOpen && (
                      <div className="sp-file-preview" id="sp-file-preview">
                        <strong>
                          {stage === 0
                            ? '这次访谈，想弄清楚什么？'
                            : '从一段真实经历开始'}
                        </strong>
                        <p>
                          {stage === 0
                            ? '了解受访者最近一次完成这项工作的过程：做了什么、哪里不顺、怎样处理。完成后，用一次试访检查提问和记录方式。'
                            : '“能讲讲你最近一次遇到这个情况吗？”先听对方完整讲述，再追问当时的选择、困难与实际做法。记录事实，也留下仍不确定的地方。'}
                        </p>
                      </div>
                    )}
                    <div className="sp-flow-action">
                      {stage < 2 ? (
                        <button
                          type="button"
                          onClick={() => chooseStage(stage + 1)}
                        >
                          {stage === 0
                            ? '带着目标，继续下一步'
                            : '看看结果与依据'}
                          <ArrowRight size={15} />
                        </button>
                      ) : decision === 'pending' ? (
                        <div className="sp-decision-buttons">
                          <button
                            type="button"
                            onClick={() => setDecision('accepted')}
                          >
                            <Check size={15} />
                            确认这份指南
                          </button>
                          <button
                            type="button"
                            className="sp-revise-button"
                            onClick={() => setDecision('revise')}
                          >
                            还需要调整
                          </button>
                        </div>
                      ) : (
                        <output className="sp-decision-result">
                          <Check size={16} />
                          <span>
                            {decision === 'accepted'
                              ? '你的确认已记在这个示例里。'
                              : '已记下：先调整，再回来确认。'}
                          </span>
                          <button
                            type="button"
                            onClick={reset}
                            aria-label="重新体验工作流程"
                          >
                            <RotateCcw size={14} />
                          </button>
                        </output>
                      )}
                    </div>
                  </div>
                </div>
                <aside className="sp-activity" aria-label="示例工作记录">
                  <h3>工作留有线索</h3>
                  <div className="sp-activity-entry">
                    <span className="sp-activity-point" />
                    <small>
                      {current.day} · {current.agent}
                    </small>
                    <h4>{current.activity}</h4>
                    <p>{current.note}</p>
                  </div>
                  <div className="sp-persistent-note">
                    <span>
                      <FileText size={14} /> 始终带着的约定
                    </span>
                    <p>
                      做一份能直接使用的指南。
                      <br />
                      用一次试访检验。
                      <br />
                      最后由人确认。
                    </p>
                  </div>
                </aside>
              </div>
            </div>
            <div
              className="sp-flow-tabs"
              role="tablist"
              aria-label="体验三个工作阶段"
            >
              {stages.map((item, i) => (
                <button
                  key={item.label}
                  id={`sp-flow-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={stage === i}
                  aria-controls="sp-flow-panel"
                  tabIndex={stage === i ? 0 : -1}
                  onClick={() => chooseStage(i)}
                  onKeyDown={(event) => tabKeys(event, i, 3, chooseStage)}
                >
                  <span>{i + 1}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <p className="sp-workflow-caption">
              试着走完这三个阶段。这里使用示例内容，不连接真实
              AI，也不保存你的数据。
            </p>
          </div>
        </section>

        <section
          className="sp-continuity sp-section"
          aria-labelledby="sp-continuity-title"
        >
          <div className="sp-section-intro">
            <h2 id="sp-continuity-title">
              工具可以换。
              <br />
              工作的来龙去脉，留下来。
            </h2>
            <p>
              Molis Work 从一份共同的工作记录开始。
              <br />
              把目标、过程与依据交还给正在做事的人。
            </p>
          </div>
          <div className="sp-principles">
            <article>
              <span className="sp-principle-mark">
                <Circle size={25} />
                <i />
              </span>
              <h3>知道要去哪里</h3>
              <p>
                把想要的结果与完成标准说清楚。后来的每一步，都有一个可以对照的起点。
              </p>
            </article>
            <article>
              <span className="sp-principle-mark">
                <Layers3 size={26} />
              </span>
              <h3>接得上已经做过的事</h3>
              <p>
                留下进展、材料和卡住的地方。换一次会话，仍能看见这项工作到了哪里。
              </p>
            </article>
            <article>
              <span className="sp-principle-mark">
                <Check size={28} />
              </span>
              <h3>重要判断由你来做</h3>
              <p>
                结果与依据放在一起。哪些已经满足，哪些还要继续，由你看过再决定。
              </p>
            </article>
          </div>
        </section>

        <section
          className="sp-scenarios"
          id="scenarios"
          aria-labelledby="sp-scenarios-title"
        >
          <div className="sp-section">
            <h2 id="sp-scenarios-title">
              为那些需要
              <br className="sp-mobile-break" />
              持续推进的事。
            </h2>
            <div
              className="sp-scenario-tabs"
              role="tablist"
              aria-label="选择使用场景"
            >
              {scenarios.map((item, i) => (
                <button
                  key={item.tab}
                  type="button"
                  role="tab"
                  id={`sp-scenario-tab-${i}`}
                  aria-controls="sp-scenario-panel"
                  aria-selected={scenario === i}
                  tabIndex={scenario === i ? 0 : -1}
                  onClick={() => setScenario(i)}
                  onKeyDown={(event) => tabKeys(event, i, 2, setScenario)}
                >
                  {item.tab}
                </button>
              ))}
            </div>
            <div
              className="sp-scenario-content"
              id="sp-scenario-panel"
              role="tabpanel"
              aria-labelledby={`sp-scenario-tab-${scenario}`}
              tabIndex={0}
            >
              <div className="sp-scenario-copy">
                <h3>
                  {selectedScenario.title.split('\n').map((line, i) => (
                    <span key={line}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </h3>
                <p>{selectedScenario.text}</p>
              </div>
              <div className="sp-scenario-record">
                <div className="sp-record-top">
                  <FolderOpen size={18} />
                  <span>{selectedScenario.goal}</span>
                </div>
                <div className="sp-record-lines">
                  {selectedScenario.records.map((item, i) => (
                    <div key={item}>
                      <span>
                        {i === 0 ? (
                          <Circle size={11} />
                        ) : i === 1 ? (
                          <FileText size={13} />
                        ) : (
                          <Check size={13} />
                        )}
                      </span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
                <small>从创作到工程，先把一项真实工作接起来。</small>
              </div>
            </div>
          </div>
        </section>

        <section
          className="sp-products sp-section"
          id="products"
          aria-labelledby="sp-products-title"
        >
          <div className="sp-products-intro">
            <h2 id="sp-products-title">
              大一点的工作台。
              <br />
              小一点的日常帮手。
            </h2>
            <p>
              我们认真对待工作，
              <br />
              也给好奇心留一点地方。
            </p>
          </div>
          <div className="sp-product-filters" aria-label="筛选产品">
            {[
              ['all', '全部产品'],
              ['work', '工作与工具'],
              ['play', '体验与探索'],
            ].map(([id, label]) => (
              <button
                type="button"
                key={id}
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ))}
            {filter !== 'all' && (
              <button
                type="button"
                className="sp-clear"
                onClick={() => setFilter('all')}
                aria-label="清除产品筛选"
              >
                <X size={13} />
                清除
              </button>
            )}
          </div>
          <div className="sp-product-directory" aria-live="polite">
            {filter !== 'play' && (
              <>
                <a
                  className="sp-product-row sp-product-featured"
                  href="#workflow"
                >
                  <img
                    src="/images/molis-logo.png"
                    width="48"
                    height="48"
                    alt=""
                  />
                  <div className="sp-product-copy">
                    <h3>Molis Work</h3>
                    <p>人和不同 AI 共用一份目标、进展与完成依据。</p>
                  </div>
                  <span className="sp-product-stage">本地优先 · 持续开发</span>
                  <span className="sp-product-action">
                    了解工作方式
                    <ArrowUpRight size={17} />
                  </span>
                </a>
                {otherProducts.map((product) => (
                  <a
                    className="sp-product-row"
                    key={product.name}
                    href={product.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {product.icon === 'drop' ? (
                      <span className="sp-drop-icon">
                        <ArrowDown size={23} />
                        <i />
                      </span>
                    ) : (
                      <img src={product.icon} width="48" height="48" alt="" />
                    )}
                    <div className="sp-product-copy">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </div>
                    <span className="sp-product-stage">{product.stage}</span>
                    <span className="sp-product-action">
                      GitHub
                      <ArrowUpRight size={17} />
                    </span>
                  </a>
                ))}
              </>
            )}
            {filter !== 'work' && (
              <details className="sp-elsewhere">
                <summary className="sp-product-row">
                  <img
                    src="/images/products/elsewhere.png"
                    width="48"
                    height="48"
                    alt=""
                  />
                  <div className="sp-product-copy">
                    <h3>Elsewhere</h3>
                    <p>把心里的如果走完，然后回来。</p>
                  </div>
                  <span className="sp-product-stage">
                    内部候选 · 未开放下载
                  </span>
                  <span className="sp-product-action">
                    关于这段旅程
                    <Plus size={17} />
                  </span>
                </summary>
                <div className="sp-elsewhere-reading">
                  <p>
                    一段有限的旅程，一条可能的人生，一封归来信。通过访谈、可以修改的事实镜和互动叙事，认真回看一次选择，再回到正在过的生活。
                  </p>
                  <p>
                    目前已有内部 macOS
                    发布候选，尚未开放下载。我们关心的不只是如何开始，也包括怎样好好结束。
                  </p>
                </div>
              </details>
            )}
          </div>
        </section>

        <section
          className="sp-start"
          id="start"
          aria-labelledby="sp-start-title"
        >
          <div className="sp-section sp-start-layout">
            <div className="sp-start-copy">
              <span className="sp-open-mark">
                <Code2 size={22} />
              </span>
              <h2 id="sp-start-title">
                从你手头
                <br />
                的一件事开始。
              </h2>
              <p>
                从公开仓库了解 Molis Work，
                <br />
                带着一个真实项目，试着把工作接起来。
              </p>
              <a
                className="sp-button"
                href={repository}
                target="_blank"
                rel="noreferrer"
              >
                查看仓库与上手说明
                <ArrowUpRight size={17} />
              </a>
              <a
                className="sp-source-link"
                href="https://github.com/orgs/molis-ai/repositories"
                target="_blank"
                rel="noreferrer"
              >
                看看我们开放的其他项目
              </a>
            </div>
            <div className="sp-faq" aria-label="开始前，你可能想了解">
              <details open>
                <summary>
                  现在可以怎样使用？
                  <Plus size={18} />
                </summary>
                <p>
                  目前从公开仓库了解安装与本地启动方式，可在桌面、浏览器或 AI
                  工具中访问目标记录。具体环境要求与接入方式，以仓库当前说明为准。
                </p>
              </details>
              <details>
                <summary>
                  要换掉正在用的 AI 吗？
                  <Plus size={18} />
                </summary>
                <p>
                  不需要。Molis Work
                  保存共同的目标与工作记录，执行留在已经使用的工具里。它不会替你托管模型，也不会凭空接管其他
                  AI 会话。
                </p>
              </details>
              <details>
                <summary>
                  现在支持团队一起工作吗？
                  <Plus size={18} />
                </summary>
                <p>
                  当前重点是个人与本地工作。团队云端协作、身份与同步、团队助理仍在探索，尚未作为可用能力上线。
                </p>
                <p>
                  我们的长期方向是 Work OS：让人的判断、AI
                  的执行与团队的工作持续连接。先把真实工作做顺，再逐步走向它。
                </p>
              </details>
              <details>
                <summary>
                  上面的演示是真实产品吗？
                  <Plus size={18} />
                </summary>
                <p>
                  这是用来解释工作方式的交互示意，使用虚构的访谈指南项目，不调用真实
                  AI，也不保存数据。实际产品界面与能力，以公开仓库为准。
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>
      <footer className="sp-footer">
        <a className="sp-footer-brand" href="#main">
          <img src="/images/molis-logo.png" width="27" height="27" alt="" />
          Molis AI
        </a>
        <span>始终好奇，持续创造</span>
        <a href={repository} target="_blank" rel="noreferrer">
          在 GitHub 一起把它做好
          <ArrowUpRight size={14} />
        </a>
        <small>© 2026 Molis AI</small>
      </footer>
    </div>
  );
}
