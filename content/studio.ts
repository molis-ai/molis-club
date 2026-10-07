// Molis AI 工作室层面的共用文案：首页、导航、页尾、四条产品线和解决方案。
// 五个品牌方向共用这一份，各方向只换视觉。依据 2026-10-06《Molis AI 官网调整方案（第二轮）》，
// 产品状态来自各产品仓库 README 与设计文档（10/1–10/6）。

export type LineId = 'work' | 'life' | 'tool' | 'story';

export const vision = '技术，回到人的尺度。';

export const positioning = 'Molis AI 是一间 AI 原生的产品工作室。';

/** 原来的首屏口号，改作页尾落款 */
export const signature = '始终好奇，持续创造。';

export const heroActions = {
  primary: '了解 Molis Work',
  secondary: '看看产品线',
};

/** Molis Work 的一句话，产品菜单里用 */
export const workLine = '换一个 AI，工作也接得上。';

export const coreProduct = {
  kicker: '核心产品',
  name: 'Molis Work',
  line: 'AI 原生的工作台：目标、资料和 Agent 在同一处。',
  highlights: ['目标只有一份', '换一个 AI 也接得上', '完成要核对'],
  status: ['v0.2.0', 'MIT 开源', 'macOS'],
  actions: { more: '了解 Molis Work', github: '在 GitHub 查看' },
};

/** 三条产品线卡片的画面，都是概念图，按各自的说法标注 */
export const lineImages = {
  life: {
    src: '/images/edition-c/life/desktop.jpg',
    w: 1600,
    h: 1111,
    note: '概念稿',
    position: '30% 30%',
  },
  tool: {
    src: '/images/edition-c/tool/near-cursor.jpg',
    w: 866,
    h: 631,
    note: '概念图',
    position: '50% 50%',
  },
  story: {
    src: '/images/edition-c/story/departure.jpg',
    w: 1600,
    h: 900,
    note: '概念画面',
    position: '60% 50%',
  },
};

export type Line = {
  id: Exclude<LineId, 'work'>;
  name: string;
  area: string;
  line: string;
  status: string;
  more: string;
};

export const linesIntro = {
  title: '从工作出发，也走进生活、桌面和故事。',
};

export const lines: Line[] = [
  {
    id: 'life',
    name: 'Molis Life',
    area: '生活',
    line: '把琐事交代出去，把时间留给喜欢的生活。',
    status: '原型探索',
    more: '了解 Molis Life',
  },
  {
    id: 'tool',
    name: 'Molis Tool',
    area: '桌面',
    line: '光标在哪里，软件就在哪里。',
    status: '开发中',
    more: '了解 Molis Tool',
  },
  {
    id: 'story',
    name: 'Molis Story',
    area: '故事',
    line: '走进另一个世界，经历另一种生活，然后回来。',
    status: '开发中',
    more: '了解 Molis Story',
  },
];

export const solutions = {
  kicker: '和团队一起',
  title: '把 AI 用进你的业务，而不只是用进聊天框。',
  lede: '在真实的业务场景里，和你的团队一起找到 AI 原生的工作方式，再用 Molis Work 落地。',
  steps: ['把真正的问题看清', '重新设计工作方式', '落到 Molis Work 上'],
  directionsLabel: '方案方向',
  directions: [
    { title: '内容增长', status: '部分能力验证' },
    { title: '让已有软件接下目标', status: '内部技术验证' },
    { title: '从分散的数据到可解释的判断', status: '方案设计' },
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
  lede: '告诉我们你在做什么、卡在哪里，或者想关注哪条产品线。',
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
  successActions: { home: '回到 Molis AI', work: '看看 Molis Work' },
  errorFallback: '这次没能发出去，请稍后再试。',
  success: {
    title: '收到了。',
    text: '已经存进 Molis AI 的私密收件箱。目前不会自动发邮件；同一个邮箱重复提交时，保留先前那一份。',
  },
  note: '这是早期阶段的联系方式，不会自动开通任何账号或产品。',
  privacyTitle: '隐私说明',
  privacy: [
    '这张表只收你填写的称呼、邮箱、方向和内容，存在 Molis AI 团队的私密收件箱里。',
    '只用来了解你的想法并联系你，不公开展示，也不用于广告。',
    '需要修改或删除，联系时告诉我们即可。',
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
