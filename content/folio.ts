// Folio 官网的文案，其他品牌方向各有自己的一份。
// 首页依据 2026-10-08 一骏给出的工作室定位与愿景；Work 详情在 content/folio-work.ts。
// Life、Story 的详情页本轮不改，首页只用一句话说清方向，不写尚未开放的能力。

export type FolioProductId = 'work' | 'tool' | 'life' | 'story';

export const folioStudio = {
  /** 首屏：愿景先行，下面一句说清我们是谁 */
  title: ['把工作做轻，', '把时间还给生活。'],
  lead: 'Molis AI 是一个做 AI 产品的小团队。我们想让工作更快、更好、更舒服，把省下来的时间，留给生活、体验和创造。',
  description:
    'Molis AI 是一个围绕工作、生活和体验场景研发 AI 产品的小团队：Molis Work 是可扩展的 AI 工作平台，Molis Tool 让能力来到你选中的文字和文件旁边；同时探索结合硬件与个人 Agent 的 Molis Life，和沉浸式世界 Molis Story。',
  /** 首屏的目录：愿景的两半，各由两个产品承担 */
  how: '怎么做到？',
  groups: [
    {
      label: '现在',
      goal: '把工作做轻',
      items: [
        { id: 'work', name: 'Molis Work', hint: '可扩展的 AI 工作平台' },
        { id: 'tool', name: 'Molis Tool', hint: '能力来到选中的东西旁' },
      ],
    },
    {
      label: '接下来',
      goal: '把时间还给生活',
      items: [
        { id: 'life', name: 'Molis Life', hint: '硬件与个人 Agent' },
        { id: 'story', name: 'Molis Story', hint: '可以走进去的世界' },
      ],
    },
  ] as {
    label: string;
    goal: string;
    items: { id: FolioProductId; name: string; hint: string }[];
  }[],

  /** 首屏之后：一天里的时间，被工作的缝隙占走，又一段段还回来。画面是示意，不是统计。 */
  day: {
    kicker: '怎么做到',
    title: ['时间花在工作上，', '却不全花在工作本身。'],
    lead: '交代背景、搬运资料、来回切换、盯着 AI 有没有做完。我们先把这些缝隙收起来。',
    note: '示意',
    marks: ['早上', '中午', '傍晚', '夜里'],
    labels: {
      core: '工作本身',
      context: '重新交代背景',
      carry: '在应用间搬运',
      wait: '盯着 AI 做没做完',
      switch: '来回切换',
      check: '核对“做完了”',
      life: '自己的时间',
      lifeAfter: '生活',
      storyAfter: '体验与创造',
    },
    steps: [
      {
        id: 'work',
        name: 'Molis Work',
        title: '交代、等待和核对，交给同一套流程。',
        text: '目标、资料和工具放在一起。你直接用工具，AI 和 Agent 在需要的环节动手，做没做完可以核对。',
        more: '看看 Molis Work',
      },
      {
        id: 'tool',
        name: 'Molis Tool',
        title: '搬运和切换，留在原处解决。',
        text: '选中文字、拖入文件，合适的能力就在旁边，结果带着出处回来。',
        more: '看看 Molis Tool',
      },
      {
        id: 'life',
        name: 'Molis Life · Molis Story',
        title: '省下来的，留给生活和创造。',
        text: 'Life 探索硬件与个人 Agent，把琐事接过去；Story 做可以走进去的世界。',
        more: '看看生活与故事',
      },
    ] as {
      id: FolioProductId;
      name: string;
      title: string;
      text: string;
      more: string;
    }[],
  },

  work: {
    kicker: '现在重点推进',
    name: 'Molis Work',
    line: '一个可扩展的 AI 工作平台。你直接用工具，AI 在需要的环节动手。',
    highlights: [
      '到处有 AI，但不是到处是对话',
      '一个平台，按需加插件',
      '换一个 Agent，工作也接得上',
    ],
    status: ['v0.2.0 已开源', '0.3.0 开发中', 'macOS'],
    actions: { more: '了解 Molis Work', github: '在 GitHub 查看' },
  },

  /** 三张色纸前的过渡句 */
  linesTitle: '一件件小事做轻，时间才真的回来。',
  lines: [
    {
      id: 'tool',
      area: '工作 · 桌面',
      status: '开发中',
      line: '围绕你眼前选中的文字和文件，就近给出合适的能力。',
      value: '少一点跨应用的搬运和打断。',
      more: '了解 Molis Tool',
    },
    {
      id: 'life',
      area: '生活 · 探索中',
      status: '原型探索',
      line: '结合硬件与个人 Agent，把琐事接过去，把想做的事记住。',
      value: '让日子里多出一点属于自己的时间。',
      more: '了解 Molis Life',
    },
    {
      id: 'story',
      area: '体验 · 探索中',
      status: '开发中',
      line: '走进一个沉浸式的世界，和 AI 一起经历一段故事。',
      value: '待一会儿，再带一样东西回来。',
      more: '了解 Molis Story',
    },
  ] as {
    id: Exclude<FolioProductId, 'work'>;
    area: string;
    status: string;
    line: string;
    value: string;
    more: string;
  }[],
  enterprise:
    '从梳理业务流程、连接现有数据和工具，到用 Molis Work 试运行具体方案，我们可以和你一起找到值得做的一步。',
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
