// Molis Work product page copy. Source: Alberta's copy v1 (2026-09-30).
// Public release is v0.2.0 (Goals, Work, Feed, Artifacts). Everything else is on
// trunk only, so it carries a 「下一版」 tag until the next release ships.
// At release: set NEXT_RELEASE_PENDING to false.
export const NEXT_RELEASE_PENDING = true;

// No signed, notarized macOS package exists yet. When one is published, put its
// URL here and the 「下载 macOS 版」 button appears next to 「在 GitHub 查看」.
export const MAC_DOWNLOAD_URL: string | null = null;

export const GITHUB_URL = 'https://github.com/molis-ai/molis-work';

export type TagKind = 'next' | 'preview' | 'soon' | 'planned';
export const tagLabels: Record<TagKind, string> = {
  next: '下一版',
  preview: '预览',
  soon: '即将推出',
  planned: '规划中',
};

export const hero = {
  kicker: 'MOLIS WORK · 本地优先的 AI 工作台',
  title: ['让工作，', '在人、工具与 Agent 之间继续。'],
  subtitle:
    '目标、成果和能力放在同一个地方。换工具、换 Agent、隔几天回来，都从上次停下的地方接着做。',
  note: '数据在你的电脑上。内置接入 Codex、Claude Code、OpenCode、Pi Agent、Grok Build。',
};

export const pillars: { title: string; text: string; next?: boolean }[] = [
  {
    title: '目标可核对',
    text: '所有 Agent 推进同一份 Goal。重要改动由你确认，“完成”要过显式收尾。',
  },
  {
    title: '能力注册一次，到处可用',
    text: '插件的每项能力，页面、助理、工作流和外部 Agent 都能调用，权限逐个授予。',
    next: true,
  },
  {
    title: '工具可以自己做',
    text: '缺什么工具，描述出来，让 Agent 写成插件，装进你的项目。',
    next: true,
  },
];

export const architecture = {
  title: '四个入口，一个能力目录，一个 AI 运行时。',
  text: '你在页面里操作，助理替你执行，工作流按顺序跑，外部 Agent 经 MCP 调用。它们用的是同一批插件、同一套权限、同一份记录。',
  entries: [
    { label: '页面与搜索' },
    { label: '个人助理', tag: 'soon' as TagKind },
    { label: '工作流程与定时' },
    { label: '外部 Agent' },
  ],
  core: '统一能力目录',
  lower: ['插件：内置 25 个，加上你做的', 'Prologue 运行时'],
  base: '一个 Home，数据存在本机',
};

export type Feature = {
  id: string;
  label: string;
  title: string;
  points: string[];
  tags: TagKind[];
};

export const features: Feature[] = [
  {
    id: 'goals',
    label: '目标',
    title: '目标只有一份，“完成”可以核对。',
    points: [
      'Codex、Claude Code 和内置助理推进的是同一个 Goal；打开就能看到要达成什么、做完了什么、下一步是什么。',
      'Agent 可以提议，不能悄悄改掉你认可的目标；完成要核对约定、依据和阻塞。',
      '依赖画布、决定中心、绑定在 Goal 上的终端、macOS 菜单栏。',
    ],
    tags: [],
  },
  {
    id: 'capabilities',
    label: '能力',
    title: '能力注册一次，到处可用。',
    points: [
      '插件把查询和操作登记到同一个能力目录，页面、助理、工作流和外部 Agent 都从这里调用。',
      '在 Claude Code、Codex 等客户端连上 Molis Work 的 MCP，就能在授权范围内查询、判断、写入。',
      '权限逐个授予、随时撤回；每次调用留记录，被取消或撤权的调用不再写入。',
    ],
    tags: ['next'],
  },
  {
    id: 'studio',
    label: '插件创作台',
    title: '缺的工具，描述出来，让它长出来。',
    points: [
      '说清楚要什么，Agent 先给方案，再在沙箱里写真实代码，通过检查后装进项目。',
      '安装前经过宿主检查和无头浏览器验收；试用时的写入不碰正式数据。',
      '做好的插件自动成为能力，助理、Coding 和外部 Agent 都能调用。',
    ],
    tags: ['preview', 'next'],
  },
  {
    id: 'coding',
    label: 'Coding',
    title: '编码 Agent，住在你的项目里。',
    points: [
      '计划与任务板、子代理并行、停下后从断点继续。',
      '多个会话可以认领任务、互相发信，等到答复再自动继续。',
      '写文件、跑命令、push、开 PR 都先经你审查。我们用它改过 Molis Work 自己的代码。',
    ],
    tags: ['next'],
  },
  {
    id: 'runtime',
    label: 'AI 运行时',
    title: '模型只配一次，所有 AI 走同一条路。',
    points: [
      '文字、图片、判断和 Agent 都经同一个 Prologue 运行时；接 OpenAI 或 Anthropic 接口及兼容服务。',
      '密钥加密存在本机，插件只拿到引用；Agent 要改东西先进审查队列。',
      '系统和插件的提示词、角色登记在一处，可见可改。',
    ],
    tags: ['next'],
  },
  {
    id: 'search',
    label: '搜索',
    title: '按一下 ⌘K，找到所有东西。',
    points: [
      '搜本项目和个人空间里所有插件的内容，包括还没打开过的；点开定位到那段文字。',
      '两个字的中文、Q4 这样的短词、中英混排都能搜；只返回你有权看的内容。',
    ],
    tags: ['next'],
  },
];

// Every card touches plugins beyond v0.2.0 (Inbox, Pages, onboarding, Characters).
export const cards = [
  {
    title: '信息进来，只把要你处理的送到面前',
    text: 'RSS、网页、YouTube、GitHub、Gmail 的内容进 Feed，需要你介入的进 Inbox，选中的材料交给 Pages 写成带来源的文稿。',
  },
  {
    title: '第一次打开，项目就有内容',
    text: '勾选来源、完成授权，AI 整理出带来源的工作总结和项目建议，确认后生成项目。',
  },
  {
    title: '把你调好的 Agent 带进来',
    text: '从 Codex、Claude Code、Cursor、OpenCode、Grok Build 导入规则和 Skills，发布成固定版本的角色。',
  },
];

// One-liners come from the copy doc's second tab (taken from in-product descriptions).
export const RELEASED_PLUGINS = new Set(['Goals', 'Work', 'Feed', 'Artifacts']);

export const pluginWall = {
  title: '25 个内置插件，开箱即用。',
  subtitle: '每个插件做好一件事，它们的能力都在同一个目录里。',
  groups: [
    {
      name: '目标与工作',
      plugins: [
        ['Goals', '确定目标，推进工作，留下结果。'],
        ['Work', '回到你的会话，继续正在做的事。'],
        ['Inbox', '只看需要你介入的事项。'],
        ['Feed', '查看来源消息和完整流水。'],
        ['Schedule', '到点跑自己的对话任务，也叫醒其他插件的闹钟。'],
        ['Artifacts', '打开项目成果，查看保留下来的版本。'],
      ],
    },
    {
      name: '编码',
      plugins: [
        ['Coding', '围绕代码讨论、执行和审查，保留连续的任务记录。'],
        ['Files', '查看工作区文件与保留的内容。'],
        ['Git', '查看工作区的版本与变更。'],
        ['Diff', '比较固定版本，逐项阅读差异。'],
        ['Text stats', '查看材料与成果的文本统计。'],
      ],
    },
    {
      name: '写作与数据',
      plugins: [
        ['Pages', '写文档，用块和格式，保存在这台电脑。'],
        ['Form', '建问卷，预览填写，看结果。'],
        ['Dataset', '改表格，导入 CSV，留下版本。'],
        ['PPT', '写幻灯片大纲，预览并导出 JSON。'],
        ['Images', '连接生图服务，描述图片，预览并保存生成结果。'],
      ],
    },
    {
      name: '想法与知识',
      plugins: [
        ['灵光', '先记下还没想清楚的想法，再决定留下或丢掉。'],
        ['Jelly', '安排事项、写笔记、收集灵感，把想法放进每天。'],
        ['Cognia', '导入本地知识，保留来源，整理为可追溯的知识。'],
        ['Shelf', '把文件放到置物架，处理副本，原件不动。'],
        ['Alchemist', '写下方向，炼成可比较的卡，再决定做不做。'],
      ],
    },
    {
      name: '自动化与 AI',
      plugins: [
        ['Workflows', '把已有插件按顺序串成一件可以做完的事。'],
        ['Characters', '编辑角色的做事方式，发布固定版本供 AI 任务选择。'],
        ['Experiments', '同一任务，独立比较模型的判断、耗时与成本。'],
        ['插件创作台', '用自然语言设计、构建并使用自己的插件。'],
      ],
    },
  ] as { name: string; plugins: [string, string][] }[],
};

export const localFirst = {
  title: '数据在你的电脑上，边界说得清楚。',
  points: [
    '所有数据在本机的 Molis Work Home，浏览器和 macOS App 打开同一个工作台。',
    '安装不改你的项目和 Agent 配置；接入先预览，确认才写入，失败自动回滚。',
    '卸载只撤销它自己写入的部分，你的项目和数据保留。',
    '外部内容始终当作资料，不会变成给 AI 的指令。',
  ],
};

export const upcoming: { name: string; text: string; tag: TagKind }[] = [
  {
    name: '个人助理',
    text: '在任何页面叫它，用 @ 引用内容、用 / 选能力，读 PDF 和图片；可撤销的操作直接做，该跟进的事提醒你。',
    tag: 'soon',
  },
  {
    name: '项目讨论',
    text: '项目主群和公开话题，在工作区旁边分屏打开。',
    tag: 'preview',
  },
  {
    name: '面向团队',
    text: '团队空间、成员权限与多设备同步。',
    tag: 'planned',
  },
  {
    name: '分享插件',
    text: '把你做的插件分享给别人使用。',
    tag: 'planned',
  },
];

export const closing = {
  title: ['工具可以不断长出来，', '工作不必一次次重来。'],
};
