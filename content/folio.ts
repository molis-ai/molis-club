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
  /**
   * 【文案待改】每件产品向访客问的一句话，显示在首页各产品的一句话下面（Work 在核心产品区，其余在色纸上）。
   * 现在的四句是 2026-10-12 的草稿，只为占位，需要由负责文案的人重写。
   *
   * 为什么增加：《落地主义》（2026-10-10 公众号版）提出商业重心可能在从「兜售」滑向「适配」，
   * 即不在同一排货架前比谁更好，而是找到审美和偏好同频的人。文章是推测，官网不写成宣言，
   * 只在做法上体现：让访客先读到一个问题，认出自己，再决定要不要往下看，而不是先看功能与对比。
   * 旧版主站的每个作品有一句 question（content/works.ts），但只用在作品详情页留言区，向已经点进来的人征求反馈，
   * 并不是入口。这里借用「一句提问」的形式，把它提前到首页当入口；Folio 只有四条产品线，也没有这个字段，所以新增。
   *
   * 重写时的约束：只问访客自己的处境，不写「比别人好」类的比较；不暗示产品尚未开放的能力；
   * 句子要能对应到各产品页现有的开场文字（hero.lead）。
   */
  asks: {
    work: '上一次让 AI 做完一件事，你是怎么确认它真的做完了的？',
    tool: '为了一个很小的动作，你上一次在几个窗口之间切了几回？',
    life: '有哪件琐事，你最想随口交代一句就算数？',
    story: '你最想进去待一会儿的，会是一个什么样的世界？',
  } satisfies Record<FolioProductId, string>,
  /** 色纸上的领域签只写领域，阶段只看阶段签；folioStudio.lines 的 area 混了状态，留给其他样张 */
  areas: {
    tool: '工作 · 桌面',
    life: '生活',
    story: '体验',
  } satisfies Record<Exclude<FolioProductId, 'work'>, string>,
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
  nav: { essays: '文章', wiki: '百科', login: '登录', account: '我的账号' },
  /** 产品页封底指向下一件产品 */
  nextProduct: '接着看',

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

  /** 登录与账号页左边那页：沿用原登录页的一句英文和一句中文 */
  auth: {
    line: ['A space for', 'your curiosity.'],
    note: '有意思的相遇，从这里开始。',
  },

  /** 结尾两条去处：社区（molis.club）与合作 */
  community: {
    label: '社区 · molis.club',
    title: ['看看我们在做什么，', '和一群人一起试。'],
    action: '去社区看看',
  },
};

/**
 * 文章作者一骏的公众号主页（A10，2026-10-11 负责人给出）。微信以外的浏览器可能打不开；
 * 备用的公众号二维码要由负责人提供图片，拿到之前只放链接。
 */
export const folioEssayAuthor = {
  href: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzkzNzczNjYxMQ==#wechat_redirect',
  /** 接在作者名（folioStudio.essays.author）后面，作为链接的无障碍名称 */
  labelSuffix: '的公众号（在新窗口打开）',
  more: '去公众号读更多',
};

/** 账号页：只说登录现在能做什么，不写还不存在的用途（A11） */
export const folioAccount = {
  purpose:
    '现在登录后，可以管理账号本身；和账号有关的功能上线时，会出现在这里。',
};

/** Folio 的百科：条目与艺术家 Skill 的内容在 content/knowledge.ts、content/artists.ts，这里只放页面上的说明文字（沿用旧版百科的文案） */
export const folioWiki = {
  kicker: 'Molis Wikipedia · 百科',
  title: '看懂一种表达，把它变成自己的能力。',
  lead: '艺术家 Skill、网页与动效、外部组件来源。每一条都可以先试一试，再把方法和 Prompt 带走，在你自己的工具里用。',
  actions: { artists: '看艺术家 Skill', entries: '试试网页与动效' },
  counts: {
    artists: '个艺术家 Skill',
    techniques: '个网页与动效',
    resources: '个组件来源',
  },
  artists: {
    kicker: '艺术家 Skill',
    title: '从一种观看世界的方式，开始创作。',
    lead: 'Skill 是交给 AI 工具的一套创作方法，包含风格选择、输入要求和检查方式。你带来题材，它帮助组织画面。',
    more: '探索创作方法',
    disclosure: '图像来自 Artist-skill 的 AI 创作试样，非艺术家原作。',
    builder: {
      text: '把原作观察、研究与成图反馈，变成可复用的创作方法。',
      more: '了解构建方法',
    },
  },
  entries: {
    kicker: '网页、动效与组件',
    title: '看懂一种表达，或带走一份组件来源。',
    lead: '动效和布局可以直接在卡片上试；组件资源是整理过的外部来源，点进去看用途、边界和 Prompt。',
    search: '试试「逐段浮现」「toast」或「tabs」',
    searchLabel: '搜索网页、动效与组件条目',
    count: '个条目',
    try: '试一试，带走 Prompt',
    empty: {
      title: '还没找到这个条目。',
      text: '换个说法，或看看已有的动效、布局与组件。',
      reset: '查看全部条目',
    },
  },
  closing: {
    title: '从看见，到做到。',
    text: '每个条目都有用途、边界和参考资料；Prompt 是起点，你的内容与判断决定最终的表达。',
    ask: '告诉我们你想了解的能力',
    community: '去社区看看',
  },
  entry: {
    back: '百科',
    use: { technique: '什么时候使用', resource: '可以重点看什么' },
    caution: { technique: '留意这些细节', resource: '使用时留意' },
    source: '参考与整理',
    editor: 'Molis AI 编辑整理',
    reduced: 'MDN · 减少动态偏好',
    related: '接着探索',
    duration: '动效时长',
    help: {
      motion: '拖动时长后点「重播」。系统开启减少动态时，直接展示最终状态。',
      layout: '用上方的控件，或在示例里滚动，看布局怎样变化。',
      resource:
        '这是外部来源，不是本站内置组件。打开官方页面看真实交互，再决定要不要带进项目。',
    },
    prompt: {
      technique: {
        title: '把这个效果，带回你的项目。',
        text: '复制后补充页面位置与实际内容，交给你本地的 AI 编程工具。',
        label: '实现 Prompt',
      },
      resource: {
        title: '把这份参考，带回你的项目。',
        text: '复制后补充要改进的控件，交给你本地的 AI 编程工具。只引入真正需要的那一个交互。',
        label: '参考 Prompt',
      },
    },
    open: '打开官方页面',
  },
  artist: {
    method: '它怎样组织创作',
    download: '下载完整 Skill',
    package: [
      '含 Skill 正文与所需参考文件。',
      '来源：Artist-skill · 本地整理版 2026.09.16',
    ],
    sample: 'Artist-skill · AI 创作试样，非艺术家原作。',
    noImage: {
      lines: ['Observe.', 'Translate.', 'Create.'],
      text: '观察，转译，再创造。',
    },
    howTitle: '把方法带进自己的创作',
    steps: [
      '下载并解压，保留 Skill 文件夹的完整结构。',
      '将文件夹安装到你的 AI 工具支持的 Skills 目录，确认它已被识别。',
      '复制调用示例，换成你的题材与要求。制作图片时，需要工具具备图像生成能力。',
    ],
    note: '调用示例用于开始新的创作，并非上方试样的原始生成提示。请按所用工具的安装方式操作。',
    promptLabel: '从这个调用示例开始',
    copy: '复制调用示例',
    others: '其他观看方式',
  },
  copy: {
    idle: '无需登录',
    done: '已复制，可以粘贴到本地工具。',
    failed: '复制未成功，文本已选中。请按 ⌘C / Ctrl+C 复制。',
    button: '复制 Prompt',
    copied: '已复制 Prompt',
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
  /**
   * 和 Molis Work 的关系（A5，10/11 决定）：Tool 可以单独用，以后也会成为 Work 的基础能力。
   * 只讲关系，用将来时并标「规划中」；不写已经打通或合并，也不写时间和范围（P10 未定）。
   */
  relation: {
    kicker: '和 Molis Work 的关系',
    now: 'Molis Tool 可以单独使用。',
    later: '以后，它也会成为 Molis Work 的基础能力。',
    phase: '规划中',
    work: '了解 Molis Work',
    /** 首页 Tool 色纸上的一行小字 */
    home: '可以单独使用，也将成为 Molis Work 的基础能力',
  },
};
