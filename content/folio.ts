// Folio 官网的文案，其他品牌方向各有自己的一份。
// 首页依据 2026-10-09 与一骏的讨论：不喊口号，首屏只放 A/I 词组和关键词，往下是产品、团队、文章、社区。
// 方案见 specs/folio-studio-home/spec.md；Work 详情在 content/folio-work.ts。
// Life、Story 的详情页本轮不改，首页只用一句话说清方向，不写尚未开放的能力。

export type FolioProductId = 'work' | 'tool' | 'life' | 'story';

/** 2026-10-10 首页简介：按四条产品线的实际方向重写，独立于其他样张复用的原短句。 */
export const folioHomeCopy = {
  description:
    'Molis AI 是一间围绕工作、生活与体验研发 AI 产品的工作室。用 Molis Work 探索人与 AI 共事，用 Molis Tool 把工具带到光标旁；也在探索为日常减负、发现生活新意的 Molis Life，以及可以进入、体验并归来的 Molis Story。',
  products: {
    work: '一张随你生长的 AI 工作台',
    tool: 'AI就在你的鼠标边',
    life: '把琐事安顿好，让喜欢的生活发生',
    story: '走进另一个世界，带一段经历回来',
  } satisfies Record<FolioProductId, string>,
};

export const folioStudio = {
  /** 首屏 A/I 词组下面的一行：取自落款「始终好奇，持续创造」与原版首屏、文章《人的尺度》 */
  keywords: ['好奇', '创造', '人的尺度'],
  description:
    'Molis AI 是一个围绕工作、生活和体验场景研发 AI 产品的小团队：Molis Work 是可扩展的 AI 工作平台，Molis Tool 让能力来到你选中的文字和文件旁边；同时探索结合硬件与个人 Agent 的 Molis Life，和沉浸式世界 Molis Story。',

  /** 各区块只用一个关键词作标题，不再写整句 */
  labels: {
    products: { en: 'Products', zh: '产品' },
    team: { en: 'Team', zh: '团队' },
    essays: { en: 'Essays', zh: '文章' },
  },
  nav: { essays: '文章', login: '登录' },

  work: {
    kicker: '现在重点推进',
    name: 'Molis Work',
    line: '可扩展的 AI 工作平台',
    status: ['v0.2.0 已开源', '0.3.0 开发中', 'macOS'],
    actions: { more: '了解 Molis Work', github: '在 GitHub 查看' },
  },

  lines: [
    {
      id: 'tool',
      area: '工作 · 桌面',
      status: '开发中',
      line: '能力来到你选中的东西旁边',
      more: '了解 Molis Tool',
    },
    {
      id: 'life',
      area: '生活 · 探索中',
      status: '原型探索',
      line: '硬件与个人 Agent',
      more: '了解 Molis Life',
    },
    {
      id: 'story',
      area: '体验 · 探索中',
      status: '开发中',
      line: '可以走进去的世界',
      more: '了解 Molis Story',
    },
  ] as {
    id: Exclude<FolioProductId, 'work'>;
    area: string;
    status: string;
    line: string;
    more: string;
  }[],

  /** 文章：原文在 content/stories.json，摘要沿用观点页 */
  essays: {
    author: '一骏',
    read: '分钟阅读',
    action: '阅读全文',
    next: '接着读',
    back: '回到首页',
    items: [
      {
        slug: 'human-scale',
        description: '当机器能够承担更多执行，我们如何决定什么值得做。',
      },
      {
        slug: 'idealism',
        description: '从落地与实践出发，讨论想法、行动与自我判断。',
      },
    ],
  },

  /** 结尾两条去处：社区（molis.club）与合作 */
  community: {
    label: '社区 · molis.club',
    title: ['看看我们在做什么，', '和一群人一起试。'],
    action: '去社区看看',
  },
};

export const folioSolutions = {
  title: '把 AI 用进一段具体业务。',
  lead: '从看清问题到跑通流程。围绕你的目标、现有系统和工作方式，用 Molis Work、插件与必要的连接，把一段值得改进的工作先做起来。',
  directions: [
    {
      id: 'content',
      name: '内容增长',
      title: '从资料与判断，到值得发布的内容。',
      headline: ['让研究变成', '有依据的内容。'],
      outcomes: ['带来源的研究材料', '能回查的选题依据', '供人审阅的内容草稿'],
      problem: '研究、选题、创作散在不同工具里，做过的判断留不下来。',
      process: ['整理研究资料', '比较选题依据', '形成内容草稿', '由人审阅发布'],
      output: '带来源的研究材料、选题依据与内容草稿。',
      status: '部分能力验证',
      boundary:
        '已有研究、机会判断与部分内容创作能力。发布表现与策略迭代仍在规划，发布由人授权。',
    },
    {
      id: 'software',
      name: '已有软件接入 Agent',
      title: '让现有系统的能力，接得住一个目标。',
      headline: ['让 Agent 用上', '已有业务能力。'],
      outcomes: [
        '选定场景中的业务能力',
        '沿用已有的权限与规则',
        '可核对的执行记录',
      ],
      problem: '业务规则已经在系统里，AI 却只能在外面给建议。',
      process: [
        '明确业务目标',
        '连接已有能力',
        '沿用权限与规则',
        '核对执行结果',
      ],
      output: '在选定场景中可调用的业务能力、权限边界与执行记录。',
      status: '内部技术验证',
      boundary:
        '已在两个固定真实服务上验证关键路径。尚不支持任意软件的一键转换。',
    },
    {
      id: 'data',
      name: '数据分析与判断',
      title: '让一份报告，找得到每个结论的来处。',
      headline: ['每一个结论，', '都能找到依据。'],
      outcomes: [
        '可追溯的数据出处',
        '清楚呈现的分析过程',
        '待人确认的报告草稿',
      ],
      problem: '取数、解释指标和写报告反复搬运，结论的依据难以追溯。',
      process: [
        '确认数据与口径',
        '结合业务知识',
        '形成分析草稿',
        '核对报告依据',
      ],
      output: '带数据出处、分析过程与待确认判断的报告方案。',
      status: '方案设计',
      boundary:
        '指标接入、分析与报告是当前方案方向，尚未作为完整 BI 产品交付。',
    },
  ],
  stages: [
    {
      title: '先把问题看清',
      text: '一起看现在怎么做、卡在哪里、哪些判断必须由人完成。',
      result: '一个具体场景与清晰边界',
    },
    {
      title: '跑通最小的一段',
      text: '选择必要的资料、工具和能力，在 Molis Work 中组织一次可核对的试运行。',
      result: '一个可以查看结果的验证流程',
    },
    {
      title: '按结果继续',
      text: '对照约定的验收条件调整。确认有用之后，再决定扩大到哪些环节。',
      result: '验证记录与下一步建议',
    },
  ],
};

// Tool 详情页（Folio）新增的两段演示。首屏与其余文案仍用 content/molis-tool.ts。
// 插件一段依据 molis-ai/molis-tool docs/能力插件协议-v6.md（10/2 更新）：插件声明能力而不是界面，
// 宿主决定它出现在光标旁、右键、拖放、⌘K 等入口；结果也是对象，可以接着交给下一个能力；
// 停用时各入口一起消失，已产生的结果保留。「生成字幕 → 翻译」是协议里的例子，页面标示意。
export const folioTool = {
  layers: {
    note: '界面示意 · 示例活动',
    label:
      '同一场展览在三层里接着处理：光标旁划出日期，点「加入日程」；框住海报，旁边展开日程草稿，逐项填好；过一会儿按 ⌥Space，命令条找回草稿，回到离开的地方。',
    near: {
      eyebrow: '正在读一篇活动介绍',
      before: '周六',
      mark: '10 月 12 日下午两点',
      after: '，城市设计展在河岸艺术中心开幕。',
      chips: ['加入日程', '翻译'],
      result: '已记下 · 10/12 14:00',
      undo: '撤回',
    },
    beside: {
      eyebrow: '框住一张海报',
      day: '12',
      month: 'OCT',
      title: ['城市', '设计展'],
      card: '日程草稿',
      fields: [
        ['标题', '城市设计展'],
        ['时间', '周六 14:00 — 17:00'],
        ['地点', '河岸艺术中心'],
      ],
      source: '来自海报的这一块',
      actions: ['确认', '改一下'],
    },
    later: {
      eyebrow: '过了一会儿，在别处',
      keys: ['⌥', 'Space'],
      query: '设计展',
      row: '城市设计展 · 日程草稿',
      meta: '刚才 · 等你确认',
      back: '回到你离开的地方',
    },
  },
  plugins: {
    facts: [
      {
        title: '插件写下能做什么，不画界面',
        text: '接受什么、产出什么、在本机还是联网跑。参数面板和结果样式由 Molis Tool 统一生成。',
      },
      {
        title: '登记一次，各处都在',
        text: '光标旁、右键、拖放和 ⌘K 命令条同时出现；停用时一处生效，处处消失。',
      },
      {
        title: '结果也是对象',
        text: '生成的字幕可以直接交给翻译，两个插件不需要知道彼此；停用之后，做好的结果还在。',
      },
    ],
    name: '生成字幕',
    kind: '插件',
    spec: [
      ['接受', '音频、视频'],
      ['产出', '带时间的文字'],
      ['运行', '本机 · 不用 AI'],
    ],
    on: '已启用',
    surfaces: {
      near: { label: '光标旁', others: ['翻译'] },
      menu: { label: '右键', others: ['打开方式', '共享'] },
      drop: { label: '拖放', hint: '拖到这里' },
      bar: { label: '⌘K 命令条', query: '字幕' },
    },
    chain: ['访谈.m4a', '字幕.srt', '字幕 · 英文.srt'],
    next: '翻译',
    kept: '停用后，入口一起收起；做好的字幕还在。',
    note: '界面示意 · 协议里的例子',
    label:
      '插件示意：「生成字幕」插件只声明接受音频视频、产出带时间的文字。启用后，它同时出现在光标旁、右键、拖放和 ⌘K 命令条；生成的字幕可以直接交给已有的翻译；停用后各处入口一起消失，做好的字幕保留。',
  },
};
