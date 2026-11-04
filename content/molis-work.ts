import { WORK_LICENSE } from './site/products';

// Molis Work 产品介绍页的文案，五个品牌方向共用这一份；各方向只换视觉。
// 依据 molis-ai/molis-work 仓库 docs/product-intro/v1-2026-10-05.md（产品介绍 V1，
// 按 molis-work main @ 7ac6fc4 核对），页面顺序照其中「给官网的建议」。
// 状态一律以「用户现在能不能下载到」为准：公开版本仍是 v0.2.0。

/**
 * 页面先于下一次发版上线时为 true：v0.2.0 之外的能力都标「下一版」。
 * 新版发布后改成 false，「下一版」整体消失；「预览」「规划中」不受影响。
 */
export const SHOW_NEXT_RELEASE = true;

/**
 * 已签名、公证的 macOS 安装包地址。还没有时保持 null，
 * 页面只显示「在 GitHub 查看」，不放一个下载不到的按钮。
 */
export const MAC_DOWNLOAD_URL: string | null = null;

export const GITHUB_URL = 'https://github.com/molis-ai/molis-work';

/** released：v0.2.0 已能下载；next：在 main、随下一版；preview：在 main、标预览；planned：规划中。 */
export type Status = 'released' | 'next' | 'preview' | 'planned';
export type Tag = '下一版' | '预览' | '规划中';

/** 一项内容该挂哪些标签，已经按 SHOW_NEXT_RELEASE 处理好。 */
export function tagsOf(status: Status = 'released'): Tag[] {
  const next: Tag[] = SHOW_NEXT_RELEASE ? ['下一版'] : [];
  if (status === 'next') return next;
  if (status === 'preview') return ['预览', ...next];
  if (status === 'planned') return ['规划中'];
  return [];
}

export const nav = [
  { href: '#scenarios', label: '场景' },
  { href: '#features', label: '功能' },
  { href: '#local', label: '本地优先' },
];

export const hero = {
  kicker: 'MOLIS WORK · 本地优先的 AI 工作台',
  title: '让工作，在人、工具与 Agent 之间继续。',
  lead: '目标、资料和工具放在一处。你和 Claude Code、Codex 这些 Agent 在同一份事实上接着做，做没做完可以核对。',
  agentsLabel: '内置接入',
  agents: ['Codex', 'Claude Code', 'OpenCode', 'Pi Agent', 'Grok Build'],
  agentsMore: '其他 Agent 经 MCP',
};

/** 首屏下方那行 Agent 名单，写成一句话。 */
export const agentLine = `${hero.agentsLabel} ${hero.agents.join('、')}，${hero.agentsMore}。`;

export type Point = { text: string; status?: Status };

export type Scenario = {
  id: string;
  /** 区块导航里的短名 */
  label: string;
  title: string;
  /** 让读者认出自己的那句话 */
  problem: string;
  points: Point[];
  /** 整块的状态；只有部分是下一版时写在 points 上 */
  status: Status;
};

export const scenariosIntro = {
  kicker: '场景',
  title: '三个常见的麻烦，和它的做法。',
};

/** 主场景：产品介绍里的场景 1、2、3 */
export const scenarios: Scenario[] = [
  {
    id: 'relay',
    label: '目标',
    title: '换了工具，工作不用从头讲。',
    problem:
      '每个 AI 工具只记得自己的会话。换工具、隔几天回来，都要重新交代背景；AI 说做完了，你没法核对。',
    points: [
      {
        text: '要达成什么、做成了什么、还差什么，记在同一个 Goal 里。Codex、Claude Code、OpenCode、Pi Agent、Grok Build 有内置接入，其他 Agent 经 MCP 读写同一份 Goal。',
      },
      {
        text: 'Agent 可以提新需求，不能悄悄改掉你认可的目标；“完成”要过显式收尾，核对当前要求、依据和阻塞。',
      },
      {
        text: '每天打开先停在项目选择页，上次的项目已预选，回车就接着做。收尾时选这次交付了什么：成果库里已有的一版，或者把文档当场固定一版。',
        status: 'next',
      },
    ],
    status: 'released',
  },
  {
    id: 'control',
    label: '权限',
    title: '放心让 AI 动手。',
    problem:
      'AI 能动哪些东西说不清；改错了撤不回；在一个入口关掉权限，另一个入口照样能写。',
    points: [
      {
        text: '所有插件的能力登记在同一个目录，页面、助理、工作流、外部 Agent 都从这里调用。权限按调用方、按每个 MCP 客户端逐一授予，外部 Agent 只看得到你授权给它的能力。',
      },
      {
        text: '写文件、跑命令、推送先进审查队列；能撤销的操作直接做，做完给你撤销。每次调用留记录，被取消或撤权的调用不会再写入任何数据。',
      },
      {
        text: '助理在侧栏浏览器里操作网页时，点击、输入逐步确认，你随时能接手；停下或关掉总开关，浏览器立刻交还给你。',
      },
    ],
    status: 'next',
  },
  {
    id: 'assistant',
    label: '助理',
    title: '一个看得见你在做什么的助理。',
    problem:
      '通用聊天助手看不到你正在做的东西，要复制粘贴；它给建议，执行还得你自己来；提醒要么没有，要么太烦。',
    points: [
      {
        text: '底栏助理在任何页面都能叫出来，知道你在看哪一页、选中了哪段。用 @ 引用内容、用 / 选能力，能读 PDF 和图片。',
      },
      {
        text: '它的建议是点一下就执行的操作卡；会跟进到期的事，也守你定的勿扰规则。',
      },
      {
        text: '记忆看得见、改得了、删得掉。复杂的事拆给子任务并行做，写代码的部分交给 Coding。',
      },
    ],
    status: 'next',
  },
];

export type Difference = { title: string; body: string; status: Status };

export const differencesIntro = {
  kicker: '四点不同',
  title: '四件事，守同一套规则。',
  lead: '单看每一项，别处都能找到近似的做法；少见的是这四件事在同一个本机工作台里，守同一套规则。',
};

export const differences: Difference[] = [
  {
    title: '一份目标，完成要核对',
    body: '内置接入 5 家编码 Agent，其他经 MCP。Agent 只能提议，不能悄悄改掉你认可的目标。多数任务工具里，标成完成是一次状态切换；在这里是一次核对。',
    status: 'released',
  },
  {
    title: '能力登记一次，四个入口同一套权限',
    body: '页面、助理、工作流、外部 MCP 客户端调用的是同一项能力，按调用方逐个授权，调用留记录，撤权或取消后不再写入。',
    status: 'next',
  },
  {
    title: '缺的工具自己做，做出来就能被 AI 用',
    body: '生成的不是孤立的网页应用，而是装进项目的插件，自动登记成能力，助理和外部 Agent 马上能调用。',
    status: 'preview',
  },
  {
    title: 'AI 怎么做事，看得见、改得了',
    body: '系统和每个插件的提示词、角色都可见可改，可以恢复默认，每次运行查得到用的是哪一版；记忆看得见、删得掉。',
    status: 'next',
  },
];

/** 第二条「能力登记一次」背后的结构 */
export const architecture = {
  title: '四个入口，一个能力目录，一个 AI 运行时。',
  body: '你在页面里操作，助理替你执行，工作流按顺序跑，外部 Agent 经 MCP 调用。它们用的是同一批插件、同一套权限、同一份记录。',
  status: 'next' as Status,
  entries: [
    { name: '页面与搜索' },
    { name: '个人助理' },
    { name: '工作流与定时' },
    { name: '外部 Agent', detail: 'MCP' },
  ],
  catalog: '统一能力目录',
  plugins: '插件：内置 26 个，加上你做的',
  runtime: 'Prologue 运行时',
  home: '一个 Home，数据存在本机',
};

export const moreIntro = {
  kicker: '更多场景',
  title: '信息、新项目、缺的工具、写代码。',
};

/** 次级场景：产品介绍里的场景 4–7 */
export const moreScenarios: Scenario[] = [
  {
    id: 'feed',
    label: '信息',
    title: '信息很多，只把要处理的送到面前。',
    problem: '来源各看各的，重要的漏掉；写的时候找不回出处。',
    points: [
      {
        text: 'RSS/Atom、网页查询、YouTube、GitHub、Gmail 的内容统一进 Feed。外部内容一律当资料，不会变成给 AI 的指令。',
      },
      {
        text: '需要你介入的送进 Inbox，并写明为什么进来；选中的材料交给 Pages 写成带来源的文稿。',
        status: 'next',
      },
    ],
    status: 'released',
  },
  {
    id: 'start',
    label: '新项目',
    title: '第一天就有内容，以后都找得到。',
    problem:
      '新工具第一天是空的，要自己搬资料、建项目；工具一多，东西散在各处。',
    points: [
      {
        text: '勾选要接入的来源并授权，AI 整理出带来源的工作总结、项目建议和待办草稿，采用后生成项目并从待办开始。',
      },
      {
        text: '之后按 ⌘K，能搜到所有插件里的内容，包括没打开过的；两个字的中文、Q4 这样的短词也能搜。',
      },
    ],
    status: 'next',
  },
  {
    id: 'studio',
    label: '插件创作台',
    title: '缺一个顺手的工具，自己做出来。',
    problem:
      '做个小工具要么得会编程；用一句话生成的网页应用又和你的资料、你的助理不相通。',
    points: [
      {
        text: '在插件创作台描述需求，Agent 先给方案，再在沙箱里写代码，过宿主检查和浏览器验收后装进项目。',
      },
      {
        text: '做好的插件自动成为能力：助理、Coding 和外部 Agent 都能调用，它也能读写 Goals、Inbox、Pages。',
      },
    ],
    status: 'preview',
  },
  {
    id: 'coding',
    label: 'Coding',
    title: '写代码的会话，住在项目里。',
    problem: '编码 Agent 的会话一断就散；几个会话各干各的，互相不知道。',
    points: [
      {
        text: '在项目里开 Coding 会话，计划、子任务、中断和审查都在同一条任务记录里，停下后从断点继续。',
      },
      {
        text: '会话之间可以认领任务、互相发信。写文件、跑命令、push、开 PR 都先经你审查。',
      },
    ],
    status: 'next',
  },
];

export type Feature = { name: string; line: string; status: Status };

export const featuresIntro = {
  kicker: '功能全景',
  title: '26 个内置插件，27 件你能做的事。',
  lead: '每个插件做好一件事，能力都登记在同一个目录里。下面按你要做的事分组。',
};

/** 功能全景：产品介绍里的功能表，分组和状态照抄 */
export const featureGroups: { name: string; features: Feature[] }[] = [
  {
    name: '目标与接力',
    features: [
      {
        name: 'Goals',
        line: '记下要达成什么、做成了什么、下一步；依赖画布看谁在等谁，决定中心集中要你拍板的事；完成要显式收尾。',
        status: 'released',
      },
      {
        name: '外部 Agent 接入',
        line: 'Codex、Claude Code、OpenCode、Pi Agent、Grok Build 内置接入，先预览再写入、失败回滚；其他 Agent 经 MCP 和统一 Skill。',
        status: 'released',
      },
      {
        name: 'Work 会话与终端',
        line: '回到各工具的会话继续做；从 Goal 打开的终端一直属于这条 Goal。',
        status: 'released',
      },
      {
        name: '成果库（原 Artifacts）',
        line: '存某一刻固定下来的版本，记得来自哪份原文的第几版；一版可以交付到 Goal、交给助理或 Coding、当工作流和插件的输入。',
        status: 'next',
      },
    ],
  },
  {
    name: 'AI 与助理',
    features: [
      {
        name: '个人助理',
        line: '任何页面从底栏叫出；理解当前页面和选区；@ 引用、/ 选能力、读 PDF 与图片；操作卡点一下执行，改动可撤销。',
        status: 'next',
      },
      {
        name: '主动提醒与勿扰',
        line: '到期跟进、失败时提醒；守勿扰、暂停、稍后，提醒不循环。',
        status: 'next',
      },
      {
        name: '记忆',
        line: '个人与项目分开记；自动记下的看得见、撤得回；设置里能看、改、停、删。',
        status: 'next',
      },
      {
        name: '分工',
        line: '把大事拆给子任务并行做，任务板上看进度，评审后补改；写代码的部分交给 Coding。',
        status: 'next',
      },
      {
        name: '角色与提示词',
        line: '系统、插件和你自己的角色、提示词都可见可改；能从 Codex、Claude Code、Cursor 等的本机配置导入规则和 Skills。',
        status: 'next',
      },
      {
        name: 'AI 运行时与模型设置',
        line: '模型、密钥、预算配一次，文字、图片、判断和 Agent 共用；兼容 OpenAI 与 Anthropic 接口；密钥加密存本机。',
        status: 'next',
      },
    ],
  },
  {
    name: '能力与连接',
    features: [
      {
        name: '统一能力目录与 MCP',
        line: '插件能力登记一次，页面、助理、工作流、外部 Agent 共用；外部 Agent 只看得到你逐项授权给它的能力，调用留记录。',
        status: 'next',
      },
      {
        name: '系统搜索 ⌘K',
        line: '搜本项目和个人空间所有插件的内容，点开定位到命中处；只返回你有权读的。',
        status: 'next',
      },
      {
        name: '侧栏',
        line: '在当前工作旁分屏打开讨论、浏览器、文件预览；助理在侧栏浏览器里操作要逐步确认，你随时接手。',
        status: 'next',
      },
      {
        name: 'Feed 来源',
        line: 'RSS/Atom、网页查询、YouTube、GitHub、Gmail，可暂停、恢复、定时拉取。',
        status: 'released',
      },
      {
        name: '更多连接与文档导入',
        line: '约 45 个服务的连接方式在目录里；从 Notion、飞书、Google Docs 导入文档；真实账号逐个验收中。',
        status: 'next',
      },
    ],
  },
  {
    name: '信息与日常',
    features: [
      {
        name: 'Inbox',
        line: '只放需要你介入的事，每条写明为什么进来、下一步是什么。',
        status: 'next',
      },
      {
        name: '打开与新建项目',
        line: '每天打开停在项目选择页、预选上次项目；新建时 AI 整理出工作总结、项目建议和待办草稿。',
        status: 'next',
      },
      {
        name: 'Schedule 定时',
        line: '到点跑你建好的对话任务，也叫醒其他插件的闹钟。',
        status: 'next',
      },
      {
        name: 'Todo',
        line: '记待办、设提醒，助理帮你整理；可以放在项目或个人空间。',
        status: 'next',
      },
      {
        name: 'Jelly、灵光',
        line: 'Jelly 安排日程、写笔记；收想法只在灵光，能导入文件、读取链接，再转成笔记或待办。',
        status: 'next',
      },
      {
        name: 'Pages、Form、Dataset、PPT、Images',
        line: '写文档、做问卷、改表格、写幻灯片大纲、生图。',
        status: 'next',
      },
      {
        name: 'Cognia、Shelf、Alchemist、Experiments、Workflows',
        line: '整理知识、处理文件副本、把方向炼成可比较的卡、比较模型、把插件串成流程。',
        status: 'next',
      },
    ],
  },
  {
    name: '编码',
    features: [
      {
        name: 'Coding、Files、Git、Diff、Text stats',
        line: '在项目里开编码会话，计划、子任务、断点继续、会话之间发信，副作用先审查。',
        status: 'next',
      },
    ],
  },
  {
    name: '自己做',
    features: [
      {
        name: '插件创作台',
        line: '描述需求，Agent 出方案、在沙箱写代码，过检查后装进项目。',
        status: 'preview',
      },
    ],
  },
  {
    name: '协作',
    features: [
      {
        name: '项目讨论',
        line: '项目主群和公开 Thread，在侧栏打开；要自行部署本地 Server，还没有文件和 @ 提醒。',
        status: 'preview',
      },
      {
        name: '团队空间与多设备同步',
        line: '成员、权限、共享项目、多设备。',
        status: 'planned',
      },
      {
        name: '分享插件',
        line: '把自己做的插件给别人用，市场上架与审核。',
        status: 'planned',
      },
    ],
  },
];

export type Comparison = { now: string; here: string; gap: string };

export const compareIntro = {
  kicker: '对比',
  title: '跟你现在的做法比一比。',
  lead: '多数人已经用几样工具拼出一套做法。按你现在的用法，说说 Molis Work 哪里不同，也写上它目前还不如人的地方。',
  labels: { now: '你现在', here: '在 Molis Work 里', gap: '目前还不如它' },
};

/** 不点名竞品；Claude Code、Codex 写成配合使用 */
export const comparisons: Comparison[] = [
  {
    now: '用 Claude Code、Codex 这类编码 Agent 写代码',
    here: '继续用，Molis Work 接住它们：几家的会话推进同一份 Goal，换工具不丢上下文；“完成”不由 Agent 自己宣布。',
    gap: '写代码本身它们更强，Molis Work 不替代它们。',
  },
  {
    now: '用仓库里的任务清单、规格文件管 Agent',
    here: 'Goal 写给人看，有依赖画布和决定中心；调研、内容这类非代码的工作也能管；阶段走完不等于完成，要核对要求与依据。',
    gap: '更重：要装应用、跑一个常驻宿主。只想管代码任务，它们更直接。',
  },
  {
    now: '用笔记或任务工具记 AI 做到哪了',
    here: '数据在本机；所有插件共用一个能力目录和一套授权，撤权后不再写入；Agent 只能提议，不能改掉你认可的目标；缺的工具可以自己做。',
    gap: '团队、多设备、手机上用都还没有；模板和生态也少得多。',
  },
  {
    now: '把资料复制给通用 AI 助手',
    here: '助理就在你的工作台里：看得到当前页面和选区，建议是点一下就执行的操作卡，改动可撤销；记忆存本机，提示词全部可见可改。',
    gap: '模型能力取决于你配的服务；关掉应用后，定时任务和提醒不跑。',
  },
  {
    now: '用一句话生成小应用',
    here: '做出来的是装在你项目里的插件：自动成为助理和外部 Agent 能调用的能力，能读写 Goals、Inbox、Pages；装前过检查和浏览器验收。',
    gap: '还是预览，第一次就做成的不多；也还不能发布给别人用。',
  },
  {
    now: '在群聊式的协作空间里和多个 Agent 一起干活',
    here: '以 Goal 为准，而不是以聊天线程为准；完成有门禁；整个工作台和数据都在本机。',
    gap: '多人协作还早，只有预览中的项目讨论。',
  },
];

export const localFirst = {
  kicker: '本地优先与边界',
  title: '数据在你的电脑上，边界说得清楚。',
  points: [
    '所有数据在本机的 Molis Work Home，浏览器和 macOS App 打开的是同一个工作台。',
    '安装不改你的项目和 Agent 配置；接入先预览，确认才写入，失败自动回滚；卸载只撤销它自己写入的部分。',
    '外部内容始终当作资料，不会变成给 AI 的指令。',
    '本地指的是数据和执行，模型仍调用你配置的服务；关掉应用后，定时任务和提醒不跑。',
    '它不派单，也不替你分配工作；要你拍板的事，集中在决定中心等你。',
  ],
};

export const closing = {
  title: ['工具可以不断长出来，', '工作不必一次次重来。'],
};

// ---------- 短版产品页（2026-10-06 第二轮方案 B） ----------
// 只讲 v0.2.0 现在能做的事，下一版集中到「即将到来」一个区块。先在 Edition C 上用，
// 其余四个方向确认后再切过来；上面的长版导出保持不动，供它们继续使用。

export const RELEASES_URL = 'https://github.com/molis-ai/molis-work/releases';
export const INSTALL_URL =
  'https://github.com/molis-ai/molis-work/blob/v0.2.0/docs/installation.md';

export const short = {
  hero: {
    kicker: 'Molis Work · v0.2.0',
    title: '换一个 AI，工作也接得上。',
    lead: 'AI 原生的工作台：目标、资料和 Agent 在同一处，做没做完可以核对。',
    status: ['开发中', 'macOS'],
    start: '三步开始',
  },
  audience: {
    kicker: '给谁用',
    text: '先给同时用好几个 AI 编码工具的开发者：今天用 Claude Code，明天换 Codex。',
  },
  howto: {
    kicker: '看它怎么用',
    title: '一个目标，换着 AI 做完。',
    steps: [
      {
        title: '建一个目标',
        text: '写下要做成什么、怎样算完成。',
      },
      {
        title: '换着 AI 接着做',
        text: '今天用 Claude Code，明天换 Codex，从同一个目标继续。',
      },
      {
        title: '收尾时核对',
        text: '对照要求和依据，确认真的做完了。',
      },
    ],
  },
  highlights: {
    kicker: '三个亮点',
    title: '目标、接力、核对。',
    items: [
      {
        title: '目标只有一份',
        text: '要做成什么、做到哪、还差什么，都记在同一个目标里。',
      },
      {
        title: '换一个 AI 也接得上',
        text: '内置接入 Codex、Claude Code 等 Agent，其他 Agent 通过 MCP 读写同一份目标。',
      },
      {
        title: '完成要核对',
        text: '收尾时核对要求和依据，Agent 不能悄悄改掉你认可的目标。',
      },
    ],
  },
  start: {
    kicker: '三步开始',
    title: '今天就能用起来。',
    steps: [
      {
        title: '安装',
        text: '目前支持 macOS，用 Node.js 24+ 和 pnpm 从源码安装。',
        action: '看安装步骤',
      },
      {
        title: '建第一个目标',
        text: '先写一句要做成什么。',
      },
      {
        title: '接上你的 Agent',
        text: '新开一个 Claude Code 或 Codex 会话，接着做。',
      },
    ],
  },
  upcoming: {
    kicker: '即将到来',
    title: '下一版会带来的。',
    lead: '已经在开发，随下一版提供。',
    items: [
      {
        title: '个人助理',
        text: '在任何页面叫出来。',
      },
      {
        title: '放心让 AI 动手',
        text: '权限一处管，能撤销。',
      },
      {
        title: '信息到行动',
        text: 'Feed 里的事送进收件箱。',
      },
      {
        title: '写代码的会话住在项目里',
        text: '断了从断点继续。',
      },
      {
        title: '插件创作台',
        text: '描述需求，Agent 做出插件。',
        tag: '预览',
      },
      {
        title: '团队空间与多设备同步',
        text: '成员、权限、共享项目。',
        tag: '规划中',
      },
    ] as { title: string; text: string; tag?: string }[],
    action: '关注下一版',
  },
  features: {
    kicker: '全部功能',
    title: '每一项，现在在哪一步。',
    groups: { released: '现在能用', next: '下一版', planned: '规划中' },
  },
  faq: {
    kicker: '常见问题',
    title: '你可能想先知道的。',
    teamAction: '聊聊解决方案',
    items: [
      { q: '可以怎样使用 Molis Work？', a: WORK_LICENSE.terms },
      { q: '支持什么系统？', a: '目前只支持 macOS。' },
      { q: '数据存在哪？', a: '在你自己的电脑上。' },
      {
        q: '团队能一起用吗？',
        a: '团队空间还在规划。想让团队用起来，可以找我们聊解决方案。',
        team: true,
      },
    ] as { q: string; a: string; team?: boolean }[],
  },
  closing: {
    title: ['让工作，在人、', '工具与 Agent 之间继续。'],
    paths: {
      start: {
        title: '开始使用',
        text: 'macOS · 三步接上你的 Agent',
      },
      follow: {
        title: '关注下一版',
        text: '在 GitHub 订阅，发版时收到提醒',
      },
      team: {
        title: '和团队一起用',
        text: '带一个业务场景来，一起落地',
      },
    },
  },
};

/** 「全部功能」清单：按用户现在能不能用到分三组，预览项随下一版一起 */
export function featuresByAvailability() {
  const all = featureGroups.flatMap((group) =>
    group.features.map((feature) => ({ ...feature, group: group.name })),
  );
  return {
    released: all.filter((feature) => feature.status === 'released'),
    next: all.filter(
      (feature) => feature.status === 'next' || feature.status === 'preview',
    ),
    planned: all.filter((feature) => feature.status === 'planned'),
  };
}

/** v0.2.0 界面截图：本机按 v0.2.0 源码跑演示项目截取，裁掉了左侧项目栏（那里还写着旧名和本机用户名）。 */
export const screenshots = {
  goal: {
    src: '/images/edition-c/work/goal.jpg',
    w: 1600,
    h: 1302,
    label: 'Molis Work',
  },
  create: {
    src: '/images/edition-c/work/create.jpg',
    w: 1600,
    h: 1302,
    label: '目标与完成要求',
  },
  runtime: {
    src: '/images/edition-c/work/runtime.jpg',
    w: 1600,
    h: 1274,
    label: '接入 Agent',
  },
  check: {
    src: '/images/edition-c/work/check.jpg',
    w: 1600,
    h: 1302,
    label: '收尾核对',
  },
};
export const screenshotNote = '产品截图 · v0.2.0 · 演示数据';
