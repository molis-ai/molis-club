// Molis AI 工作室层面的共用文案：首页、导航、页尾、四条产品线和解决方案。
// 五个品牌方向共用这一份，各方向只换视觉。依据 2026-10-06《Molis AI 官网调整方案（第二轮）》，
// 产品状态来自各产品仓库 README 与设计文档（10/1–10/6）。

export type LineId = 'work' | 'life' | 'tool' | 'story';

export const vision = '技术，回到人的尺度。';

export const positioning =
  'Molis AI 是一间产品工作室。我们做 AI 原生的产品：Molis Work 帮团队把 AI 用进真实的工作；Life、Tool、Story 把同样的想法带进生活、桌面和故事。';

/** 原来的首屏口号，改作页尾落款 */
export const signature = '始终好奇，持续创造。';

export const heroActions = {
  primary: '了解 Molis Work',
  secondary: '看看四条产品线',
};

/** 首屏「正在做」小卡 */
export const now = {
  label: '正在做',
  name: 'Molis Work',
  line: '换一个 AI，工作也接得上。',
  status: 'v0.2.0 已开源',
};

export const coreProduct = {
  kicker: '核心产品',
  name: 'Molis Work',
  line: 'AI 原生的工作台。目标、资料和 Agent 在同一处，换工具、换会话，工作都接得上，做没做完可以核对。',
  highlights: [
    {
      title: '目标只有一份',
      text: '要做成什么、做到哪、还差什么，记在一个地方，不散在聊天记录里。',
    },
    {
      title: '换一个 AI 也接得上',
      text: 'Claude Code、Codex 等 Agent 读写同一份目标，不用从头讲。',
    },
    {
      title: '完成要核对',
      text: '「做完了」要过一次收尾，核对要求和依据，不由 AI 自己说了算。',
    },
  ],
  status: ['v0.2.0', 'MIT 开源', 'macOS'],
  actions: { more: '了解 Molis Work', github: '在 GitHub 查看' },
};

export type Line = {
  id: Exclude<LineId, 'work'>;
  name: string;
  area: string;
  line: string;
  text: string;
  /** 会合进这条线的现有产品 */
  merged: { name: string; note?: string; href?: string }[];
  status: string;
  more: string;
};

export const linesIntro = {
  title: '从工作出发，也走进生活、桌面和故事。',
  lede: '同一个想法：让 AI 接住复杂和琐碎，把判断和时间留给人。',
};

export const lines: Line[] = [
  {
    id: 'life',
    name: 'Molis Life',
    area: '生活',
    line: '把琐事交代出去，把时间留给喜欢的生活。',
    text: '一个会跟进到底的生活助理。退款、账单、想陪家人去的海边，它记着，也在合适的时候提起。',
    merged: [{ name: 'Seentoo · 见过' }],
    status: '原型探索',
    more: '了解 Molis Life',
  },
  {
    id: 'tool',
    name: 'Molis Tool',
    area: '桌面',
    line: '光标在哪里，软件就在哪里。',
    text: 'Mac 菜单栏里的一个工具。选中、拖动、框住，它在旁边给出对的一步，做完就消失。',
    merged: [
      {
        name: 'DropAgent',
        note: '可下载',
        href: 'https://github.com/molis-ai/DropAgent',
      },
      {
        name: '牛 niul.ai',
        note: '公开仓库',
        href: 'https://github.com/molis-ai/niul.ai',
      },
    ],
    status: '开发中',
    more: '了解 Molis Tool',
  },
  {
    id: 'story',
    name: 'Molis Story',
    area: '故事',
    line: '走进另一个世界，经历另一种生活，然后回来。',
    text: '和陌生的生命学会彼此的语言，把心里的如果走完一次，把一段旅行布成展览。',
    merged: [
      { name: 'Astralo' },
      { name: 'Elsewhere' },
      { name: '袖珍博物馆' },
      { name: '雾港失物招领处' },
    ],
    status: '开发中',
    more: '了解 Molis Story',
  },
];

export const solutions = {
  kicker: '和团队一起',
  title: '把 AI 用进你的业务，而不只是用进聊天框。',
  lede: '在一个个真实的业务场景里，我们和你的团队一起找到适合它的 AI 原生工作方式，再用 Molis Work 把它落地、持续运转。',
  steps: [
    {
      title: '把真正的问题看清',
      text: '从工作现场出发，把模糊的「AI 提效」拆成具体流程、关键判断和可以验证的结果。',
    },
    {
      title: '重新设计工作方式',
      text: '哪些交给 Agent，哪些留给人，在哪里核对，写成团队能执行的方式。',
    },
    {
      title: '落到 Molis Work 上',
      text: '用 Molis Work 和插件把这套方式变成每天在用的工具，和团队一起看它带来的变化。',
    },
  ],
  directionsLabel: '方案方向',
  directions: [
    {
      title: '内容增长',
      text: '从研究、机会判断到多平台创作和复盘，最终发布由人授权。',
      status: '部分能力验证',
    },
    {
      title: '让已有软件接下目标',
      text: '保留原有业务、权限与数据规则，让软件能接受目标、执行任务。',
      status: '内部技术验证',
    },
    {
      title: '从分散的数据到可解释的判断',
      text: '在多个系统之间取数、解释指标，交付讲得清依据的报告。',
      status: '方案设计',
    },
  ],
  action: '带一个具体问题来聊',
};

export const team = {
  kicker: '谁在把这些事情做出来',
  title: ['一群真正做过，', '也真正交付过的人。'],
  text: '我们负责过大型核心系统的架构与管理，也在硅谷创业公司和国内互联网核心团队里，反复经历从 0 到 1、从 1 到规模化。今天，我们把这些经验带进 Molis。',
  proof: '团队成员的职业经历包括',
};

export const ending = {
  title: '你正在好奇什么？',
  lede: '一个还没想清楚的念头，或一个卡了很久的问题，都可以从这里开始。',
  paths: {
    community: {
      label: '如果你也在创造',
      title: ['看看我们在做什么，', '和一群人一起试。'],
      action: '去社区看看',
    },
    contact: {
      label: '如果你来自企业或团队',
      title: ['带一个具体问题来，', '我们先一起把它看清。'],
      action: '和我们聊聊',
    },
  },
};

/** 导航与页尾的栏目名；链接由各风格按自己的路由填 */
export const navLabels = {
  products: '产品',
  solutions: '解决方案',
  community: '社区',
  about: '关于',
  contact: '聊一聊',
};

export const lineNames: Record<LineId, string> = {
  work: 'Molis Work',
  life: 'Molis Life',
  tool: 'Molis Tool',
  story: 'Molis Story',
};

export const footer = {
  productsLabel: '产品',
  studioLabel: '工作室',
  studio: {
    solutions: '解决方案',
    community: '社区',
    about: '关于',
    contact: '联系我们',
  },
  github: 'https://github.com/molis-ai',
  copyright: '© 2026 Molis AI',
  privacy: '隐私说明',
};

/** 联系页：表单仍写进现有的申请收件箱（/api/join），多了「企业合作」这一类 */
export const contact = {
  kicker: '联系我们',
  title: ['有个想法，', '或一个具体问题？'],
  lede: '告诉我们你在做什么、卡在哪里，或者想关注哪条产品线。我们会从这里开始认识你。',
  roles: ['企业合作', '早期体验者', '创造者', '开发者'] as const,
  roleLabel: '想聊的方向',
  fields: {
    name: '怎么称呼你',
    email: '联系邮箱',
    idea: '想聊什么',
    ideaPlaceholder: '一个具体的业务问题、一个没想完的念头，都可以。',
  },
  consent: '同意 Molis AI 用这些信息联系我。邮箱和内容不会公开展示。',
  submit: '发给我们',
  sending: '正在发送…',
  success: {
    title: '收到了。',
    text: '你的信息已经存进 Molis AI 的私密收件箱，我们会从这里开始认识你。目前不会自动发送邮件；如果这个邮箱之前提交过，我们保留的是先前那一份。',
  },
  note: '这是早期阶段的联系方式，不会自动开通任何账号或产品。',
  privacyTitle: '隐私说明',
  privacy: [
    '这张表只收你填写的称呼、邮箱、方向和内容，保存在 Molis AI 团队的私密收件箱里。',
    '它们只用来了解你的想法并联系你，不会公开展示，也不会用于广告。',
    '需要修改或删除，在我们联系你时告诉我们即可。',
  ],
  /** ?topic= 预填：企业合作，或关注某条产品线的进展 */
  topics: {
    enterprise: { role: '企业合作', idea: '' },
    work: { role: '早期体验者', idea: '想关注 Molis Work 的下一版。' },
    life: { role: '早期体验者', idea: '想关注 Molis Life 的进展。' },
    tool: { role: '早期体验者', idea: '想关注 Molis Tool 的进展。' },
    story: { role: '早期体验者', idea: '想关注 Molis Story 的进展。' },
  } as Record<string, { role: string; idea: string }>,
};
