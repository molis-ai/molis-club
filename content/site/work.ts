// Molis Work 页（2026-10-19 起按第五版「先讲人」：specs/work-product-page/spec.md 末节）。
// 首屏只讲口号和信念；第二屏「你的」四样和演示舞台放在一起：每一段演的是哪一样，右边就亮哪一样。
// 舞台没选路时轮演四样各一段；「如果你」写代码 / 写文档、做研究 / 管事情、跟进度，选了就演这条路的八段，按四样的顺序排。
// 每段先一行「原来」，再演 Work 怎么接，最后定格一句字幕和状态。
// 只限 Work 页：文案可以直接取自 Molis Work 仓库的产品运营文档（docs/product-operations），不必先进工作室介绍；
// 工作室介绍的原句用到哪里都一字不改（下面标了「原句」的，tests/site-copy.test.mjs 逐句核对）。
// 状态三档：已发布 · v0.2.0（源码，当时名 GoalBoard）/ 开发中 / 规划中。画面和其中的名字、数字都是示意。

export type Persona = 'dev' | 'doc' | 'ops';

export const personas: Persona[] = ['dev', 'doc', 'ops'];

/** 按路变的一段字 */
export type ByPersona<T = string> = Record<Persona, T>;

export const personaUi = {
  /** 讲完四样再按人给入口：如果你写代码 / 写文档、做研究 / 管事情、跟进度 */
  ask: '如果你',
  group: '按你的工作看演示',
  /** 路名按角色（负责人 2026-10-19 定：卡点版「做没做完 / 依据在哪 / 谁在等谁」不用） */
  label: { dev: '写代码', doc: '写文档、做研究', ops: '管事情、跟进度' } as ByPersona,
  /** 路名下的职业提示：角色墙去掉以后，各种人靠这一行认出自己 */
  roles: {
    dev: '独立开发者 · AI 重度开发者 · 技术负责人 · 测试 · 开源维护者 · 数据分析 · 技术写作',
    doc: '咨询与研究 · 投研 · 用户研究 · 内容创作 · 记者编辑 · 学术 · 教师 · 法务',
    ops: '项目经理 · 产品经理 · 创始人 · 运营市场 · 销售 · 自由职业 · 财务 · 人事',
  } as ByPersona,
};

/* ---------- 首屏 · 口号与信念 ---------- */

/** 产品运营《产品介绍》第 1 节（2026-10-19 改）：先讲信念，再讲四样「你的」，再按人讲怎么用；场景是证据，不是开头 */
export const workHero = {
  /** 负责人 2026-10-19 定的口号，原文不改写；替换原来首屏的「让工作，在人、工具与 AI 之间继续」 */
  slogan: ['Work,', 'People,', 'AI,', 'Tool,', 'get connected better than ever'],
  belief: '我们相信，每个人在工作里的价值都不一样。',
  /** 信念接着说它是什么：一段里讲完，不另起一行解释句 */
  keep: '你做过的项目、踩过的坑、慢慢养成的习惯和判断，让你成为现在的你，也让你有了自己的做事方式。Molis Work 是装在你电脑上的 AI 工作台，想帮你守住这些。',
  /** 搜索结果和分享卡片里的一句（产品介绍第 1 节的解释句） */
  what: 'Molis Work 是装在你电脑上的 AI 工作台：工具按你的做法长出来，AI 照你的规矩做事，要紧的决定留给你。',
};

/* ---------- 第二屏 · 你的四样和舞台 ---------- */

export type Keep = 'tool' | 'ai' | 'call' | 'carry';

export const keeps: Keep[] = ['tool', 'ai', 'call', 'carry'];

/**
 * 开场的四句「你的」。每句后面紧跟能演的画面：舞台里演到哪一句的证据，这里就亮哪一句；
 * 状态写最弱的那一环（最打动人的两句，证据最薄：照实标）。
 * 不说「永远和别人不一样」「你的 AI 只属于你」「完全听你的」。
 */
export const workYours = {
  title: '工具和 AI 围着你转，你还是你。',
  /** 没选路时那四段的总称（读屏用） */
  intro: '四样「你的」',
  stage: '界面示意 · 示例数据',
  /** 规划中的那一段（早上打开）还没有界面 */
  concept: '概念示意 · 示例数据',
  keep: {
    tool: {
      short: '你的工具',
      title: '你的工具，长成你的样子',
      text: '需要什么就装什么；缺一个顺手的，说一句，让 AI 做出来，你和你的 AI 都能用。用久了，你的工作台会和别人的不一样。',
      status: '开发中 · 预览',
    },
    ai: {
      short: '你的 AI',
      title: '你的 AI，按你的做法做事',
      text: '你的规矩和做法写一次，你用的几个 AI 都读得到；交给模型的每一段说明，你都看得见、改得了。',
      status: '项目说明已发布 · v0.2.0，其余开发中',
    },
    call: {
      short: '你说了算',
      title: '要紧的事，你说了算',
      text: 'AI 可以记录、提议、动手；放宽要求、替你验收、动你没允许的东西，得你点头。',
      status: '已发布 · v0.2.0（新界面开发中）',
    },
    carry: {
      short: '接得上',
      title: '工作接得上，换一种样子',
      text: '线索挂在事情上，不挂在某一段聊天里，换个 AI 也接得上。AI 缺信息时给你一张能填的卡片；手上选中什么，就对它做什么，结果回到原处。',
      status: '同一份记录已发布 · v0.2.0，其余开发中',
    },
  } satisfies Record<Keep, { short: string; title: string; text: string; status: string }>,
  /** 没选路时每样演哪一段：四段分属三种人 */
  picks: { tool: 'ops-tool', ai: 'dev-skill', call: 'dev-done', carry: 'doc-pick' } as Record<Keep, string>,
};

export type Chapter = {
  id: string;
  /** 章节线上的短标题 */
  title: string;
  /** 每段开头那行灰字：今天卡在哪 */
  was: string;
  /** 定格时的一句 */
  say: string;
  status: string;
  /** 这一段替四样里的哪一样作证（产品运营《killer 场景》「证明哪一句」） */
  keep: Keep;
};

const REL = '已发布 · v0.2.0（新界面开发中）';
const DEV = '开发中';
const PREVIEW = '开发中 · 预览';
const TEAM = '开发中 · 团队协作';
const PLAN = '规划中';

/** 每条路八段，按四样的顺序排（你的工具 → 你的 AI → 你说了算 → 接得上）；各段用哪个画面见 app/(site)/work/stage.tsx */
export const workChapters: ByPersona<Chapter[]> = {
  dev: [
    {
      id: 'dev-tool',
      title: '说一句做个清单',
      was: '原来：写个脚本，接不进日常，别的 AI 也不认。',
      say: '缺个工具，说一句；你和你的 AI 用同一个。',
      status: PREVIEW,
      keep: 'tool',
    },
    {
      id: 'dev-skill',
      title: 'Skill 带进来',
      was: '原来：同一段规则，粘进每一个 AI。',
      say: '攒下的做法写一次，助理和 Coding 都照着做。',
      status: DEV,
      keep: 'ai',
    },
    {
      id: 'dev-flow',
      title: 'issue 自动分拣',
      was: '原来：每天早上自己翻几十条通知。',
      say: 'GitHub 新 issue 按你的规则先判断是不是 bug，你看过再建成目标。',
      status: DEV,
      keep: 'ai',
    },
    {
      id: 'dev-done',
      title: '做完了吗',
      was: '原来：几家 AI 共用项目说明，可做到哪、谁验收过，散在各家的会话里。',
      say: 'Agent 说做完了，Work 说还差你。',
      status: REL,
      keep: 'call',
    },
    {
      id: 'dev-safe',
      title: '动手先问你',
      was: '原来：要么不让 AI 动手，要么全放开。',
      say: '谁能动什么，逐个授权；撤了，下一次调用就被拒。',
      status: DEV,
      keep: 'call',
    },
    {
      id: 'dev-wait',
      title: '谁在等你',
      was: '原来：几个窗口挨个去问做到哪了。',
      say: '几个 AI 各停在不同的地方，等你的事收在一处。',
      status: DEV,
      keep: 'carry',
    },
    {
      id: 'dev-give',
      title: '报错交出去',
      was: '原来：复制报错、切到另一个工具、再讲一遍背景。',
      say: '选中就交出去，背景跟着走，结果回到原处。',
      status: DEV,
      keep: 'carry',
    },
    {
      id: 'dev-team',
      title: '客户来信进群',
      was: '原来：邮件、群聊、任务各在一处，结论要手动搬成任务。',
      say: '讨论、决定和 AI 的工作，在同一处接得上。',
      status: TEAM,
      keep: 'carry',
    },
  ],
  doc: [
    {
      id: 'doc-tool',
      title: '说一句做个选题库',
      was: '原来：表格太散，专门的软件太重。',
      say: '缺个工具，说一句；你和你的 AI 用同一个。',
      status: PREVIEW,
      keep: 'tool',
    },
    {
      id: 'doc-flow',
      title: '每周一页',
      was: '原来：每周同样的读、摘、写，再做一遍。',
      say: '每周的读、摘、写，存成你的做法，下周照着跑。',
      status: DEV,
      keep: 'ai',
    },
    {
      id: 'doc-source',
      title: '依据在哪',
      was: '原来：引用在 AI 的回答里，进了交付稿就断了。',
      say: '交出去的每一份结论，都留着当时的依据。',
      status: DEV,
      keep: 'call',
    },
    {
      id: 'doc-first',
      title: '第一天',
      was: '原来：上传给对话 AI，得到一段总结，待办和文档还是空的。',
      say: '把资料丢进来，第一天就有内容。',
      status: DEV,
      keep: 'carry',
    },
    {
      id: 'doc-give',
      title: '好句子放进稿子',
      was: '原来：复制进、复制出，出处在路上丢了。',
      say: '选中就放进去，出处跟着走。',
      status: DEV,
      keep: 'carry',
    },
    {
      id: 'doc-pick',
      title: '让助理挑刺',
      was: '原来：把整段贴给 AI，再把回答粘回来。',
      say: '结果回到你正在改的地方。',
      status: DEV,
      keep: 'carry',
    },
    {
      id: 'doc-deck',
      title: '做成演示稿',
      was: '原来：稿子和演示稿各写一遍。',
      say: '一份稿子，接着做成演示稿。',
      status: DEV,
      keep: 'carry',
    },
    {
      id: 'doc-team',
      title: '群里待你决定',
      was: '原来：群里定了，再手动去改文档和待办。',
      say: '讨论、决定和 AI 的工作，在同一处接得上。',
      status: TEAM,
      keep: 'carry',
    },
  ],
  ops: [
    {
      id: 'ops-tool',
      title: '说一句做个核对器',
      was: '原来：客户每改一次清单，逐行对型号、数量和批准价。',
      say: '缺个工具，说一句；你和你的 AI 用同一个。',
      status: PREVIEW,
      keep: 'tool',
    },
    {
      id: 'ops-flow',
      title: '变更走流程',
      was: '原来：每个变更都从头判断一遍，口头答应了就算。',
      say: '客户的每个变更，按你定的那一套处理，你点头才改。',
      status: DEV,
      keep: 'ai',
    },
    {
      id: 'ops-change',
      title: '范围改了',
      was: '原来：文档改了，开发那边的 AI 还按旧的做。',
      say: '改一次，开发那边的 AI 下次读到的就是新的。',
      status: DEV,
      keep: 'ai',
    },
    {
      id: 'ops-scope',
      title: '说好的范围',
      was: '原来：翻聊天记录，找当初说好的范围。',
      say: '说好的事，改了要你点头；交没交完，你说了算。',
      status: REL,
      keep: 'call',
    },
    {
      id: 'ops-owe',
      title: '谁在等谁',
      was: '原来：抽出来的事不知道你已经记了什么，在等别人的没人盯。',
      say: 'AI 抽了 8 件事，Work 标出 3 件可能已经记过、1 件在等法务。',
      status: DEV,
      keep: 'carry',
    },
    {
      id: 'ops-meet',
      title: '明早见客户',
      was: '原来：翻邮件、翻笔记、翻待办，拼出上次聊到哪。',
      say: '明早见谁，五分钟备好。',
      status: DEV,
      keep: 'carry',
    },
    {
      id: 'ops-team',
      title: '群里待你决定',
      was: '原来：群里定了，再手动去改目标和待办。',
      say: '讨论、决定和 AI 的工作，在同一处接得上。',
      status: TEAM,
      keep: 'carry',
    },
    {
      id: 'ops-morning',
      title: '早上打开',
      was: '原来：早上自己翻一遍所有事。',
      say: '早上打开，就知道今天先做什么。',
      status: PLAN,
      keep: 'carry',
    },
  ],
};

/* ---------- 第三屏 · 它不做什么、现在、怎么试 ---------- */

export const workWhy = {
  kicker: '为什么是它',
  /** 产品运营《推广与用户运营》第 1 节的三句「不」：和开场是一回事的两面，开场说守住什么，这里说不做什么 */
  nots: [
    '不把你的工作锁在某一家 AI 里。',
    '不把「AI 说做完了」当成做完了。',
    '不替你派单，也不替你点头。',
  ],
  ai: '你用的 AI 都接在这里：Claude Code、Codex、OpenCode、Pi Agent、Grok Build 内置接入，其他经 MCP。',
  data: '数据在你的电脑上，模型你来选：DeepSeek、通义千问、Kimi、GLM、MiniMax、Anthropic、OpenAI 等，费用直接付给模型商；用模型和联网时，相关内容会发给你选的服务。',
};

export const workNow = {
  have: {
    label: '今天就有',
    note: '已发布 · v0.2.0（源码，当时名 GoalBoard）',
    text: '目标与要求、本人验收、决定请求、五家 AI 接入、本机存储。',
  },
  building: {
    label: '开发中',
    note: '新版 0.3.0，还没有公开安装包',
    text: '新工作台、二十多个插件、流程、插件创作台（预览）、项目讨论。',
  },
  /** 产品运营《推广与用户运营》第 4 节：第一次把它变成你的（比「装好了」更早的留存信号） */
  first: {
    label: '第一次把它变成你的',
    note: '新版开发中 · 示意',
    text: {
      dev: '把你攒的 CLAUDE.md 和 Skills 导进来，存成你自己的角色。',
      doc: '把「每周读报告、写一页」的做法存成流程，下周照着跑。',
      ops: '把一个客户的范围写成约定，标出哪几条必须你亲自验收。',
    } as ByPersona,
  },
  notFor: {
    label: '暂时不适合',
    text: '全员实时一起改同一份的团队；只想要一个聊天窗口；要在手机上随时处理；只用 Windows。',
  },
};

export const workGo = {
  /** 负责人 2026-10-18 定：要招首批试用；去联系页，预填一句 */
  trial: '报名首批试用',
  source: '看 v0.2.0 源码',
  github: '查看源码',
  /** 去下载页（还没有安装包：那一页留报名的口子和常见问题） */
  mac: '在 Mac 上用',
  /** 首屏按钮下那一行；Work 的 main 从 2026-10-17 起不再是 MIT 许可，不写「开源（MIT）」 */
  line: 'macOS · 新版安装包在准备 · v0.2.0 源码公开',
  license: 'macOS · 许可以仓库 LICENSE 为准',
};

/* ---------- 第四屏 · 我们为什么做它 ---------- */

/**
 * 缘起与三句原句（docs/studio-intro.md 4.1 与第 4 章，逐句核对），
 * 然后问「事情都顺了，那人做什么？」，用一天的时间条回答（杂事变薄，空出来的时间留给更难的问题、新东西和生活）。
 */
export const workEnding = {
  kicker: '我们为什么做它',
  /** 原句 */
  title: '一开始，我们只是想做一个让自己团队用得更顺的工具。',
  /** 原句 */
  letter: [
    '我们希望这种协作是连续的：你能看见 AI 动了什么，也能随时亲自接手；需要你判断的事情，会清楚地交回你手里。',
    '想要什么、为什么做、什么结果值得接受，这些重要判断留在人手里。',
    '团队协作依赖服务端，正在开发；我们团队接下来就用 Molis Work 一起工作。',
  ],
  question: '事情都顺了，那人做什么？',
  day: {
    chores: {
      dev: ['贴背景给 AI', '写交接', '追 Agent 进度', '整理发布说明'],
      doc: ['整理周报', '追进度', '找资料出处', '贴背景给 AI'],
      ops: ['整理纪要', '追谁欠什么', '翻聊天找范围', '贴背景给 AI'],
    } as ByPersona<string[]>,
    work: '手上的活',
    uses: {
      dev: ['啃架构问题', '做个新东西', '早点下班'],
      doc: ['想透一个难题', '写那篇长文', '早点下班'],
      ops: ['想清楚下一步', '见该见的人', '早点下班'],
    } as ByPersona<string[]>,
    before: '现在',
    after: '交给工作台以后',
    label: '示意：一天从 9 点到 18 点，杂事变薄，空出来的时间留给更难的问题、新东西和生活。',
  },
  essay: '读《人的尺度》',
  about: '认识我们',
  closing: '工具可以不断长出来，工作不必一次次重来。',
};

/* ---------- 下载页 /work/download ---------- */

/**
 * 在 Mac 上用：还没到给人下载的时候，这一页只留一个口子。
 * 新版 0.3.0 已合进 Work 的 main，GitHub 上是发布草稿（未签名公证），不对外分发；不列任何内部包，不写「免费」。
 * Work 的 main 从 2026-10-17 起用 Molis AI Cooperation Source License 1.0，不写「开源（MIT）」，许可以仓库 LICENSE 为准。
 * 带「原句」注释的回答摘自 docs/studio-intro.md，字句不改。
 */
export const workDownload = {
  kicker: 'Molis Work · 下载',
  title: '在 Mac 上用 Molis Work',
  /** 原句 */
  lead: '正在开发的新版尚未提供正式安装包。',
  meta: 'macOS · 源码公开 · 许可以仓库 LICENSE 为准',
  next: {
    label: '开发中',
    title: '新版工作台 0.3.0',
    text: '新版安装包还在准备。能下载的时候，会放在这里。',
    go: '报名首批试用',
    note: '在联系页留下联系方式。这不是自动订阅，我们看到后会回复你。',
  },
  code: { text: '想先看看代码', link: '源码仓库' },
  faq: {
    title: '常见问题',
    items: [
      {
        q: '它和聊天 AI、在线文档有什么不同？',
        a: [
          '它不是又一个聊天 AI：助理能读写你的目标、文档和待办，把结果放回原处。',
          '它也不是全员一起改同一份的在线文档：重心是一个人（和接下来的小团队）带着几个 AI，把一段工作做完。',
        ],
      },
      {
        q: '数据存在哪里？用哪家的模型？',
        /** 原句 */
        a: ['工作数据保存在本机，使用 AI 时会调用你配置的模型服务。'],
      },
      {
        q: '能和同事一起用吗？',
        /** 原句 */
        a: ['Molis Work 正在开发中，源码公开，目前以个人在本机使用为主。', '团队协作依赖服务端，正在开发；我们团队接下来就用 Molis Work 一起工作。'],
      },
      {
        q: '旧版的数据能带过来吗？',
        a: ['新版 0.3.0 打不开 v0.2.0（当时名 GoalBoard）的数据，目前也没有升级工具。'],
      },
    ],
  },
  back: '回到 Molis Work',
};
