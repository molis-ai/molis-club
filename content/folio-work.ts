// Folio 的 Molis Work 详情页文案。依据 molis-ai/molis-work 仓库 docs/product-intro/v2-2026-10-08.md
// （产品介绍 V2，按 main @ 1cdb31d 核对），并按 2026-10-08 一骏对 Work 的描述突出亮点：
// 可扩展的 AI 工作平台；工具操作与 AI 的理解、判断融进工作流程；到处有 AI，但不是到处是对话。
// 状态一律以「用户现在能不能下载到」为准：公开版本仍是 v0.2.0（Goals、Work → Sessions、Feed、
// Artifacts → 成果），下一版定为 0.3.0，还没发。措辞守 PRODUCT.md：不编客户、用户数、评价和数据；
// 竞品不点名，Claude Code、Codex 只写成内置接入、配合使用。演示里的项目和反馈都是示意。

export { GITHUB_URL, INSTALL_URL, RELEASES_URL } from './molis-work';

export type Phase = 'released' | 'next' | 'preview' | 'planned';

export const phaseLabel: Record<Phase, string> = {
  released: '已发布 · v0.2.0',
  next: '开发版 · 随 0.3.0',
  preview: '预览',
  planned: '规划中',
};

export const hero = {
  kicker: 'Molis Work · 本地优先的 AI 工作平台',
  title: '让工作，在人、工具与 Agent 之间继续。',
  lead: '装在你电脑上的工作平台，一个平台，按需加插件。你直接用工具，AI 在需要的环节动手；Claude Code、Codex 这些 Agent 接着同一份工作做，做没做完可以核对。',
  agentsLabel: '内置接入',
  agents: ['Codex', 'Claude Code', 'OpenCode', 'Pi Agent', 'Grok Build'],
  agentsMore: '其他 Agent 经 MCP',
  status: ['v0.2.0 已开源', '0.3.0 开发中', 'macOS'],
  actions: { how: '看它怎么工作', github: '在 GitHub 查看' },
};

/** 首屏动画：你在 Pages 里写周报，助理带着 Inbox 里的反馈递上一张操作卡，点一下整理进来、建好待办，还能撤销。 */
export const desk = {
  project: '发布页改版',
  goal: '上线新版介绍页',
  plugin: 'Pages',
  heading: '本周进展',
  typed: '首屏文案已定稿，下周开始灰度。',
  card: {
    who: '助理',
    context: '看到你在写「本周进展」',
    text: 'Inbox 里有 3 条客户反馈和这一节有关。整理进来，再建 2 个待办？',
    run: '执行',
    skip: '先不用',
    done: '已整理，建好 2 个待办',
    undo: '撤销',
  },
  inserted: ['希望能导出 PDF', '手机上标题有点挤', '发布日期能提前吗'],
  source: 'Inbox',
  dock: ['Goals', 'Pages', 'Inbox', '待办', 'Coding'],
  assistant: '助理',
  note: '界面示意 · 示例数据',
  label:
    'Molis Work 界面示意：在 Pages 里写周报时，助理递上一张操作卡，点一下就把 Inbox 里的 3 条客户反馈整理进来，并建好 2 个待办，可以撤销。',
};

export const everywhere = {
  kicker: '亮点',
  title: ['到处有 AI，', '但不是到处是对话。'],
  lead: '平常的工作照常做：看资料、写文档、勾待办。AI 不住在一个聊天框里，它在工作流程里需要的那一环出现，理解、判断、动手，然后退回去。',
  modes: [
    { verb: '理解', text: '看得到你在哪一页、选中了哪一段，不用复制粘贴。' },
    { verb: '判断', text: '哪些事需要你介入，送进 Inbox 时写明为什么。' },
    { verb: '动手', text: '建议是点一下就执行的操作卡，改动能撤销。' },
  ],
  flow: [
    { plugin: 'Feed', task: '资料进来', you: '订阅来源' },
    {
      plugin: 'Inbox',
      task: '只留要处理的',
      ai: { verb: '判断', text: '这条要你处理：客户在问发布日期' },
    },
    {
      plugin: 'Pages',
      task: '写成周报',
      you: '直接写',
      ai: { verb: '理解', text: '读到你选中的这一段' },
    },
    {
      plugin: '待办',
      task: '拆成待办',
      ai: { verb: '动手', text: '建好 2 个待办 · 可撤销' },
    },
    {
      plugin: 'Goals',
      task: '推进目标',
      you: '收尾时确认',
      ai: { verb: '接续', text: 'Codex 读同一个 Goal 接着做' },
    },
  ] as {
    plugin: string;
    task: string;
    you?: string;
    ai?: { verb: string; text: string };
  }[],
  youLabel: '你',
  aside:
    '想聊的时候，底栏助理在任何页面都叫得出来；不需要的时候，它不挡在你和工具之间。',
  phase: 'next' as Phase,
};

export const platform = {
  kicker: '它由什么组成',
  title: ['一个平台，', '按需加插件。'],
  lead: '平台管宿主、能力目录、授权和 AI；目标、会话、信息流、文档、待办、代码这些内容，各由一个插件提供。项目里只加要用的。',
  callers: ['页面', '助理', '工作流', '外部 Agent'],
  callersNote: '都从同一个目录调用',
  catalog: '能力目录 · 一套授权',
  layers: ['常驻宿主', '工作台', 'AI 运行时', '助理 · 记忆 · 搜索'],
  base: '一个 Home，数据在你的电脑上',
  projectLabel: '项目插件 · 按需添加',
  personalLabel: '个人插件 · 每个项目都在',
  project: [
    'Goals',
    'Sessions',
    'Inbox',
    'Feed',
    'Schedule',
    '成果',
    'Coding',
    'Files',
    'Git',
    'Diff',
    'Text stats',
  ],
  personal: [
    '待办',
    'Jelly',
    '灵光',
    'Pages',
    'Forms',
    'Dataset',
    'PPT',
    '图片',
    'Cognia',
    'Shelf',
    '炼金术士',
    '工作流程',
    '插件创作台',
    '角色',
  ],
  released: ['Goals', 'Sessions', 'Feed', '成果'],
  yours: '你做的插件',
  // 数量按 molis-work main @ bca1bd19（2026-10-12）的 apps/workbench/src/builtin-plugins.ts 与 PRODUCT.md 核对：
  // 实验插件 10/10 已删除；Text stats 只在开发者模式出现，角色只在「设置 › 角色」。
  count:
    '开发版内置 25 个插件：项目插件 11 个，个人插件 14 个；标圆点的四个已在 v0.2.0 里。Text stats 只在开发者模式下出现，角色在设置里。',
  principles: [
    {
      title: '一个平台，按需加插件',
      text: '底栏、侧栏、⌘K 和设置只有一套，插件只提供内容。',
    },
    {
      title: '每样东西只有一个主人',
      text: 'Goal 归 Goals，文档归 Pages。插件之间不复制，AI 打开的总是原处的当前内容。',
    },
    {
      title: '能力只登记一次',
      text: '页面、助理、工作流和外部 Agent 从同一个目录调用，权限在一处管。',
    },
    {
      title: '数据在你的电脑上',
      text: '浏览器和 macOS App 打开的是同一个工作台；模型、密钥、预算只配一次。',
    },
  ],
};

export type Scene = {
  id: 'compose' | 'relay' | 'control';
  /** 标题按意思分行，避免在词中间折开 */
  title: string[];
  pain: string;
  points: string[];
  phase: Phase;
  phaseNote?: string;
};

export const scenesIntro = {
  kicker: '三个场景',
  title: '它在哪些时刻帮上忙。',
};

export const scenes: Scene[] = [
  {
    id: 'compose',
    title: ['按需拼一个', '自己的工作台。'],
    pain: '每件事一个 App，各管各的账号和数据，AI 只进得了其中一个；什么都有的大工具，又塞满用不上的东西。',
    points: [
      '在底栏的插件选择器里给项目添加或移除插件，当场生效。',
      '个人插件在每个项目里都在，日程、笔记、待办不用各建一份。',
      '一个插件离不开另一个的产出时，会一起加上。',
    ],
    phase: 'next',
  },
  {
    id: 'relay',
    title: ['换了工具，', '工作不用从头讲。'],
    pain: '每个 AI 工具只记得自己的会话。换工具、隔几天回来，都要重新交代背景；AI 说做完了，你没法核对。',
    points: [
      '要达成什么、做成了什么、还差什么，记在同一个 Goal 里。',
      '五家编码 Agent 内置接入，其他经 MCP 读写同一份 Goal。',
      'Agent 可以提新需求，不能悄悄改掉你认可的目标；“完成”要过显式收尾。',
    ],
    phase: 'released',
    phaseNote: '核心已在 v0.2.0，新界面随 0.3.0',
  },
  {
    id: 'control',
    title: ['放心让 AI 动手。'],
    pain: 'AI 能动哪些东西说不清；改错了撤不回；在一个入口关掉权限，另一个入口照样能写。',
    points: [
      '所有能力登记在同一个目录，按调用方逐一授权，每次调用留记录。',
      '写文件、跑命令、推送先进审查队列；能撤销的操作直接做，做完给你撤销。',
      '撤权或取消之后，不会再写入任何数据。',
    ],
    phase: 'next',
  },
];

/** 三个场景的演示数据，都是示意 */
export const compose = {
  project: '发布页改版',
  other: '行业观察',
  dock: ['Goals', 'Sessions', 'Coding'],
  otherDock: ['Goals', 'Feed', 'Pages'],
  personal: ['待办', 'Jelly', 'Pages'],
  personalNote: '个人插件',
  picker: '添加插件',
  options: ['Inbox', 'Schedule', '成果'],
  added: 'Inbox',
  dependency: 'Feed',
  toast: 'Inbox 要用 Feed 的产出，一起加上',
  label:
    '插件选择器示意：给「发布页改版」项目添加 Inbox，它依赖的 Feed 一起加上；待办、Jelly、Pages 这些个人插件在每个项目里都在。',
};

export const relay = {
  goal: '上线新版介绍页',
  require: ['登录页可用', '支付走通', '手机上排版正常'],
  log: [
    {
      day: '周一',
      who: 'Claude Code',
      text: '登录页完成，测试通过',
      tone: 'red',
    },
    {
      day: '周三',
      who: 'Codex',
      text: '读到同一个 Goal，接着做支付',
      tone: 'blue',
    },
    { day: '周四', who: 'Claude Code', text: '手机排版修好', tone: 'red' },
    { day: '周五', who: '你', text: '收尾核对', tone: 'ink' },
  ],
  proposal: { who: 'Codex', text: '新需求：支付页加优惠码', tag: '等你确认' },
  stamp: '完成 · 已核对',
  checkLabel: '收尾',
  checks: ['要求 3 / 3', '依据已附', '没有阻塞'],
  label:
    '同一个 Goal 的示意：周一 Claude Code、周三 Codex、周四再换回 Claude Code，各自接着做；Codex 提的新需求等你确认；周五收尾核对通过才算完成。',
};

export const control = {
  catalog: '能力目录',
  callers: ['页面', '助理', '工作流', 'Codex · MCP'],
  abilities: ['读文档', '改文档', '推送'],
  /** 每个调用方被授权的能力：1 有，0 没有 */
  grants: [
    [1, 1, 0],
    [1, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  events: {
    undo: { who: '助理', text: '建好 2 个待办', action: '撤销' },
    review: {
      who: 'Codex',
      text: '想推送 3 个提交',
      label: '审查队列',
      actions: ['批准', '拒绝'],
    },
    revoke: { who: 'Codex', text: '改文档 · 已撤权，不再写入' },
  },
  label:
    '能力目录示意：页面、助理、工作流和 Codex 从同一个目录按授权调用；助理建的待办可以撤销，Codex 的推送先进审查队列，撤掉 Codex 改文档的权限后它不再写入。',
};

export const differences = {
  kicker: '五点不同',
  title: '单看每一项都不新，少见的是它们守同一套规则。',
  items: [
    {
      title: '能力登记一次，四个入口守同一套权限',
      text: '页面、助理、工作流、外部 MCP 客户端调用的是同一项能力。谁在调用由宿主认定，Agent 不能自称是你。',
    },
    {
      title: '每样东西一个主人，AI 用的是原处的内容',
      text: '插件之间不复制、不改对方的内容，交东西交的是固定下来的一版。',
    },
    {
      title: '缺的工具自己做，做出来就能被 AI 用',
      text: '生成的不是孤立的网页应用，而是装进项目的插件，助理和外部 Agent 马上能调用。',
      phase: 'preview' as Phase,
    },
    {
      title: '一份目标，所有 Agent 共用，“完成”要核对',
      text: '多数任务工具里，标成完成是一次状态切换；在这里是一次核对。',
      phase: 'released' as Phase,
    },
    {
      title: 'AI 怎么做事，你看得见、改得了',
      text: '系统和每个插件的提示词、角色都可见可改，可以恢复默认；记忆看得见、删得掉。',
    },
  ] as { title: string; text: string; phase?: Phase }[],
};

export const more = {
  kicker: '更多场景',
  title: '从一条消息，到一段代码。',
  /** 状态说一次：卡片上只标已发布和预览这两种例外 */
  lead: '没有标注的能力都在开发版里，随 0.3.0 一起发布。',
  items: [
    {
      title: '一个看得见你在做什么的助理',
      pain: '通用聊天助手看不到你正在做的东西，要复制粘贴；它给建议，执行还得你自己来。',
      text: '底栏助理知道你在看哪一页、选中了哪段；用 @ 引用内容、用 / 选能力；会跟进到期的事，也守你定的勿扰。',
      phase: 'next' as Phase,
    },
    {
      title: '信息很多，只把要处理的送到面前',
      pain: '来源各看各的，重要的漏掉；写的时候找不回出处。',
      text: 'RSS、网页、YouTube、GitHub、Gmail 统一进 Feed；需要你介入的进 Inbox 并写明原因。外部内容一律当资料，不会变成给 AI 的指令。',
      phase: 'released' as Phase,
      phaseNote: 'Feed 已发布，Inbox 随 0.3.0',
    },
    {
      title: '第一天就有内容，以后都找得到',
      pain: '新工具第一天是空的；工具一多，东西散在各处。',
      text: '勾选来源并授权，AI 整理出带来源的工作总结、项目建议和待办草稿；之后按 ⌘K 搜所有插件，两个字的中文也搜得到。',
      phase: 'next' as Phase,
    },
    {
      title: '缺一个顺手的工具，自己做出来',
      pain: '做个小工具得会编程；一句话生成的网页应用，又和你的资料、你的助理不相通。',
      text: '在插件创作台描述需求，Agent 先给方案，再在沙箱里写代码，过检查和浏览器验收后装进项目。',
      phase: 'preview' as Phase,
    },
    {
      title: '写代码的会话，住在项目里',
      pain: '编码 Agent 的会话一断就散；几个会话各干各的，互相不知道。',
      text: '计划、子任务、中断和审查在同一条任务记录里，停下后从断点继续；写文件、跑命令、开 PR 先经你审查。',
      phase: 'next' as Phase,
    },
  ] as {
    title: string;
    pain: string;
    text: string;
    phase: Phase;
    phaseNote?: string;
  }[],
};

export const compare = {
  kicker: '和你现在的做法比',
  title: '不替换你顺手的工具，把它们接起来。',
  labels: { now: '如果你现在', here: '在 Molis Work 里', gap: '目前还不如它' },
  rows: [
    {
      now: '用 Claude Code、Codex 写代码',
      here: '继续用。几家的会话推进同一份 Goal，换工具不丢上下文。',
      gap: '写代码本身它们更强，我们不和它们比这个。',
    },
    {
      now: '用仓库里的任务清单管 Agent',
      here: 'Goal 写给人看；调研、内容这类非代码的工作也放得进来。',
      gap: '更重：要装应用、跑一个常驻宿主。',
    },
    {
      now: '用笔记或任务工具记 AI 做到哪了',
      here: '数据在本机；所有插件共用一个能力目录和一套授权。',
      gap: '团队、多设备、手机都还没有，模板也少。',
    },
    {
      now: '把资料复制给通用 AI 助手',
      here: '助理在工作台里，看得到当前页面，建议点一下就执行。',
      gap: '模型能力取决于你配的服务；关掉应用，提醒不跑。',
    },
  ],
};

export const bounds = {
  kicker: '本地优先与边界',
  title: '数据在你的电脑上，边界写清楚。',
  items: [
    '一个 Home、一个常驻宿主；浏览器和 macOS App 打开的是同一个工作台。',
    '本地指数据和执行，模型仍调用你配置的服务，兼容 OpenAI 与 Anthropic 接口。',
    '外部内容一律当资料，不会变成给 AI 的指令。',
    '它不派单，也不替你分配工作；要你拍板的事集中在决定中心。',
    '目前只有 macOS；关掉应用后，定时任务和提醒不跑。',
  ],
};

/** 现在能用什么：原来的「功能全景」27 项按「能不能下载到」收成三栏白话，状态与产品介绍 V2 一致 */
export const access = {
  kicker: '现在能用什么',
  title: '先用开源版，或者等下一版。',
  now: {
    label: '现在 · v0.2.0',
    title: '开源版本',
    items: [
      '目标与核对（Goals）：完成要显式收尾',
      '回到各个工具继续的会话（Sessions）',
      '信息源汇总（Feed）：RSS、网页、YouTube、GitHub、Gmail',
      '把某一版成果固定下来（基础版）',
      '五家 Agent 内置接入，先预览再写入',
    ],
    text: 'MIT 开源，在 macOS 上从源码安装。',
    install: '看安装步骤',
    github: '在 GitHub 查看',
  },
  next: {
    label: '下一版 · 0.3.0',
    title: '完整的平台与插件',
    items: [
      '看得见当前页面的助理，建议点一下就执行',
      '只放需要你介入的事的 Inbox，写明为什么',
      '⌘K 搜所有插件里的内容',
      '成果记得来自哪份原文的哪一版，原文改了也看得出',
      '编码会话、文件与 Git，副作用先经你审查',
      '待办、文档、表格、幻灯片大纲等个人插件',
    ],
    text: '日期还没定。v0.2.0 的数据不能直接带到新版本，接入的 Agent 也要重新接。',
    follow: '关注下一版',
    releases: '看发布记录',
  },
  later: {
    label: '以后',
    title: '还在路上',
    /** 第三项可选：链到站内哪个产品页 */
    items: [
      ['插件创作台：描述需求，Agent 在沙箱里做出插件', 'preview'],
      ['项目讨论：主群与公开 Thread，要自行部署本地 Server', 'preview'],
      // 10/11 决定 Tool 以后成为 Work 的基础能力；并入的时间和范围未定（P10），只写方向
      ['光标旁的能力（来自 Molis Tool）', 'planned', 'tool'],
      ['团队空间与多设备同步', 'planned'],
      ['第三方插件与分享', 'planned'],
      ['Windows、Linux，自动更新与定时备份', 'planned'],
    ] as [string, Phase, 'tool'?][],
  },
};

export const closing = {
  title: ['工具可以不断长出来，', '工作不必一次次重来。'],
  solutions: '了解企业合作',
  home: '回到 Molis AI',
};
