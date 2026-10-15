// 「沿途」页：docs/studio-intro.md 附录 A「那些具体的尝试」（2026-10-15 版）。
// 开头两段、八组小标题、结尾一段是原句照搬。每件一行的「它关心的问题」(ask)「现在在哪」(now)
// 取附录原句的片段：不改字、不改标点，去掉底稿里的 **加粗** 标记后能在底稿里逐字找到。
// 只有标「新写」的是界面文字。
//
// 归类（where）严格按附录原文：原文写明并入哪件产品、独立应用、Lab、停在设计里、已归档的才归类；
// 原文没写明的留空数组，页面上落进「其他」，待负责人确认（清单见本轮交付回报）。
// 链接只给公开仓库：2026-10-15 用 gh api repos/molis-ai/<名字> 只读核对过 private=false，
// 归档状态与附录一致（都未归档）。私有仓库、已归档仓库都不给链接。

export type Where = 'merged' | 'app' | 'lab' | 'design' | 'archived';

export type AlongItem = {
  name: string;
  /** 中文别名或英文名（附录里写在名字后面的那一个） */
  alias?: string;
  /** 它关心的问题：原句片段 */
  ask: string;
  /** 现在在哪：一到两段原句片段；附录里没写的留空，页面显示一道短线 */
  now: string[];
  /** 归到哪一类；空数组 = 附录没写明，落进「其他」 */
  where: Where[];
  /** where 含 merged 时，并入的是哪件产品 */
  into?: 'Work' | 'Tool' | 'Story';
  /** 公开仓库 */
  href?: string;
  /** 一句页面上的小注（新写） */
  aside?: string;
};

export type AlongGroup = {
  no: string;
  title: string;
  /** 河图源头上的短名（新写，取自组名） */
  short: string;
  items: AlongItem[];
};

/**
 * 河图的去处：每件只流到一处。按附录原文：写明并入哪件产品的流进那件产品（同时是独立应用的另加一道圈）；
 * 留在 Lab、停在设计里、已归档的各归各处；附录没写明去处的，一律「各自留着」——
 * 附录 A 最后一段说每项探索都各自留下了一点具体的东西，这一句对它们都成立，不替它们另编阶段。
 */
export type Flow = 'work' | 'tool' | 'story' | 'lab' | 'design' | 'archived' | 'rest';

export const flows: Flow[] = [
  'work',
  'tool',
  'story',
  'lab',
  'design',
  'archived',
  'rest',
];

export function flowOf(item: AlongItem): Flow {
  if (item.where.includes('merged') && item.into)
    return item.into.toLowerCase() as Flow;
  if (item.where.includes('lab')) return 'lab';
  if (item.where.includes('design')) return 'design';
  if (item.where.includes('archived')) return 'archived';
  return 'rest';
}

const GH = 'https://github.com/molis-ai';

export const along = {
  kicker: '沿途',
  /** 附录 A 标题 */
  title: '那些具体的尝试',
  /** 附录 A 开头两段 */
  intro: [
    '把 Molis 的仓库摊开，会看见许多不同的名字。它们有的围绕工作里一件难办的事，有的来自生活中的一个小需要，还有的想把一段想象变成可以亲自走进去的体验。',
    '这些探索走到了不同的地方：有些做出了独立应用，有些留下了可玩的原型，有些停在设计与研究里。沿着它们各自关心的问题，可以看见工作室更具体的一面。',
  ],
  /** 附录 A 第二段第一句：首屏的一句 */
  hook: '这些探索走到了不同的地方：有些做出了独立应用，有些留下了可玩的原型，有些停在设计与研究里。',
  /** 附录 A 最后一段 */
  outro:
    '每项探索都留下了一点具体的东西：一段实现、一种交互、一份设计，或一个尚未回答的问题。它们让“我们想做什么”有了可以看见、可以讨论，也可以继续改变的样子。',
};

/** 界面文字（新写） */
export const alongUi = {
  /** 河图 */
  river: (n: number) => `${n} 件尝试流到了哪里`,
  riverNote: '一个点是一件尝试。点一处去处，下面只看流到那里的；鼠标停在线上能看到名字。',
  restNote: '「各自留着」：附录没写它们并进哪里，每一件都各自留下了一段实现、一种交互、一份设计，或一个尚未回答的问题。',
  appMark: '带圈的点：也有独立应用',
  flow: {
    work: '流进 Molis Work',
    tool: '流进 Molis Tool',
    story: '流进 Molis Story',
    lab: '留在 Lab',
    design: '停在设计里',
    archived: '已归档',
    rest: '各自留着',
  } satisfies Record<Flow, string>,
  flowShort: {
    work: 'Work',
    tool: 'Tool',
    story: 'Story',
    lab: 'Lab',
    design: '设计里',
    archived: '归档',
    rest: '各自留着',
  } satisfies Record<Flow, string>,
  app: '也有独立应用',
  fullIntro: '展开看全文',
  more: '现在在哪',
  count: '件',
  columns: { name: '名字', ask: '它关心的问题', now: '现在在哪' },
  filterLabel: '按现在在哪筛选',
  all: '全部',
  other: '其他',
  merged: '已并入',
  where: {
    merged: '已并入 Work / Tool / Story',
    app: '独立应用',
    lab: 'Lab',
    design: '设计中',
    archived: '已归档',
  } satisfies Record<Where, string>,
  showing: (n: number) => `显示 ${n} 件`,
  empty: '这一站暂时没人下车。',
  emptyBack: '看全部',
  repo: 'GitHub',
  unknown: '没有写明',
  here: '你在这里',
  back: '关于我们',
};

export const alongGroups: AlongGroup[] = [
  {
    no: 'A.1',
    title: '工作里的问题，总有具体的样子',
    short: '工作里的问题',
    items: [
      {
        name: 'mage-helper',
        alias: '马哥的馊主意',
        ask: '难的是一句话该怎么说。',
        now: [
          '已经有了围绕同一件事持续跟进的桌面实现，后续打磨聚焦于收简界面、让使用过程更顺手。',
        ],
        where: [],
      },
      {
        name: 'Content Growth Studio',
        alias: 'CGS',
        ask: '难的是把一个想法写清楚。',
        now: [
          '目前已经有了创作台的实现，研究接入与发布后的学习仍在继续探索，最后的审阅与发布留给作者。',
        ],
        where: [],
      },
      {
        name: 'Jelly',
        ask: '把日程、笔记和灵感放在一起，让这些动作能够接得上。',
        now: [
          '留下了独立应用的实现，相关的日历、笔记与知识整理能力如今也在 Molis Work 中继续打磨。',
        ],
        where: ['app', 'merged'],
        into: 'Work',
        href: `${GH}/Jelly`,
      },
      {
        name: 'Cognia',
        ask: '读过的材料怎样进一步积累成自己的知识',
        now: [
          '留下了独立应用的实现，相关的日历、笔记与知识整理能力如今也在 Molis Work 中继续打磨。',
        ],
        where: ['app', 'merged'],
        into: 'Work',
      },
      {
        name: 'DropAgent',
        ask: '有时只有一份 PDF、一张截图或一个网页，想处理完就把结果带走。',
        now: [
          '已有独立桌面应用，材料处理、Agent 动态与提醒的部分场景，也在 Molis Tool 中继续完善。',
        ],
        where: ['app', 'merged'],
        into: 'Tool',
        href: `${GH}/DropAgent`,
      },
      {
        name: 'niul.ai',
        alias: '牛来',
        ask: '当几个 Agent 同时工作，等待也会占用注意力。',
        now: [
          '已有独立桌面应用，材料处理、Agent 动态与提醒的部分场景，也在 Molis Tool 中继续完善。',
        ],
        where: ['app', 'merged'],
        into: 'Tool',
        href: `${GH}/niul.ai`,
      },
    ],
  },
  {
    no: 'A.2',
    title: '做决定之前，先把事情看清楚',
    short: '做决定之前',
    items: [
      {
        name: 'Alchemist',
        alias: '炼金术士',
        ask: '值得做吗，要做到什么程度，又需要付出多少？',
        now: [
          '从独立的本地研究工作台起步，相关业务能力现已迁入 Molis Work，继续打磨研究与决策过程。',
        ],
        where: ['merged'],
        into: 'Work',
      },
      {
        name: 'Auto Research Workbench',
        ask: '一个值得考虑的创业机会，应该怎样从需求线索里被发现，经过补证、反方评审，再交到人手里？',
        now: [
          '留下了可运行的离线研究流程',
          '尚未走到真实来源上的完整验证，机会研究的质量仍需要现实材料来回答。',
        ],
        where: [],
      },
      {
        name: 'Arena',
        ask: '不同判断之间的分歧，也值得被看见。',
        now: ['目前留下的是内部原型，完整的真实模型比赛体验仍待验证。'],
        where: [],
      },
      {
        name: 'QuoteFold',
        alias: '报价齐',
        ask: '几家包装供应商的报价，单价、数量、版费和运输费各有写法。',
        now: ['做出了本机首版，现在保留在 Lab，等待更多真实使用来检验。'],
        where: ['lab'],
      },
      {
        name: 'LocaleProof',
        alias: '言检',
        ask: '变量有没有丢，价格有没有变，否定和操作后果有没有翻错？',
        now: ['做出了本机首版，现在保留在 Lab，等待更多真实使用来检验。'],
        where: ['lab'],
      },
      {
        name: 'Complai',
        ask: '面对合规准备，一份结论背后还要找得到规范、系统资料与测评证据。',
        now: ['已经形成命令行工具与配套的 Agent Skill。'],
        where: [],
      },
    ],
  },
  {
    no: 'A.3',
    title: '一段工作交出去之后',
    short: '交出去之后',
    items: [
      {
        name: 'GoalBoard',
        ask: '目标有没有丢，做到哪里了，哪些结果已经检查过，换一次会话还能不能继续？',
        now: ['Molis Work 的 GoalBoard 阶段'],
        where: ['merged'],
        into: 'Work',
        href: `${GH}/molis-work`,
      },
      {
        name: 'ForkLight',
        ask: '怎样把边界清楚的任务交给不同 Agent，在隔离工作区里执行、检验结果，再由人决定如何把成果合回来。',
        now: [],
        where: [],
        href: `${GH}/forklight`,
      },
      {
        name: 'Casebook',
        ask: '从获授权的记录和反馈里找出值得检查的摩擦，保留来源，交给团队判断是否改进。',
        now: ['留下了内部工具与联调实现，真实使用中的完整闭环尚未得到验证。'],
        where: [],
      },
      {
        name: 'Evrik',
        ask: '如果需要托付的事情，已经由一套业务软件承载呢？',
        now: [
          '已经在两个固定的真实服务上验证了部分关键路径，仍处于内部研发阶段',
        ],
        where: [],
      },
      {
        name: 'Jev Workbench',
        ask: '工单怎样归类，一份材料能否支持某个结论，这些判断会反复出现在工作里。',
        now: [
          '已有本机工作台实现，函数试跑、发布与客户端调用已有真实服务验证；各 Agent 内的完整使用体验仍需继续验证。',
        ],
        where: [],
        href: `${GH}/jev-workbench`,
      },
      {
        name: 'Prologue',
        ask: '应用怎样调用模型、执行任务和使用工具，让授权、过程与结果有清楚的边界',
        now: ['留下了 SDK'],
        where: [],
      },
      {
        name: 'Flyleaf',
        ask: '多个应用怎样共用工作环境、衔接上下文，把一件应用里的成果交给另一件。',
        now: [
          '应用交互平台的实现',
          '独立仓库已归档，这些实现与探索记录仍保留着。',
        ],
        where: ['archived'],
      },
      {
        name: 'Adeptify',
        ask: '团队 AI 协作与客户端基础能力',
        now: ['独立仓库已归档，这些实现与探索记录仍保留着。'],
        where: ['archived'],
      },
      {
        name: 'Relay',
        ask: '把邮件、消息和代码平台里的工作收进统一入口，再把进度、提问和结果送回原来的地方。',
        now: ['独立仓库已归档，这些实现与探索记录仍保留着。'],
        where: ['archived'],
      },
    ],
  },
  {
    no: 'A.4',
    title: '把目光移向工作之外',
    short: '工作之外',
    items: [
      {
        name: 'CookToday',
        alias: '今日厨房',
        ask: '家里会做哪些菜，今天几个人吃，有没有忌口，买什么才不会来回跑？',
        now: ['已经有了移动端与本地推荐实现'],
        where: [],
      },
      {
        name: 'dacapo',
        alias: '反复听',
        ask: '听一段英文访谈，往往有几句话想多听几遍，有一个词想查清楚。',
        now: ['已形成在本机生成材料、通过浏览器精听的工具实现。'],
        where: [],
      },
      {
        name: 'Seentoo',
        alias: '见过',
        ask: '让一条走过很多次的路，多出一些值得停下来看的细节。',
        now: ['手机原型'],
        where: [],
      },
    ],
  },
  {
    no: 'A.5',
    title: '有些想法，值得亲自走进去',
    short: '亲自走进去',
    items: [
      {
        name: '云海来客',
        alias: 'Astralo',
        ask: '从怎样理解一个陌生生命开始',
        now: ['如今在 Molis Story 中继续打磨。'],
        where: ['merged'],
        into: 'Story',
      },
      {
        name: '彼处',
        alias: 'Elsewhere',
        ask: '试着让人走进人生另一条岔路的想象',
        now: ['如今在 Molis Story 中继续打磨。'],
        where: ['merged'],
        into: 'Story',
      },
      {
        name: '袖珍博物馆',
        alias: 'Pocket Museum',
        ask: '把自己的经历变成可以亲手布置的展览',
        now: ['如今在 Molis Story 中继续打磨。'],
        where: ['merged'],
        into: 'Story',
      },
      {
        name: '雾港失物招领处',
        ask: '让一次夜间相遇中的选择，在下一次回来时留下回声。',
        now: ['如今在 Molis Story 中继续打磨。'],
        where: ['merged'],
        into: 'Story',
      },
      {
        name: 'Hearth',
        ask: '想把与 AI 伙伴共事变成一段可以走进去的旅程',
        now: ['仍分别处于开发与技术原型阶段，完整体验需要继续验证。'],
        where: [],
      },
      {
        name: 'Footballnia',
        ask: '一段由训练、比赛、伤病和关系共同塑造的足球人生',
        now: ['仍分别处于开发与技术原型阶段，完整体验需要继续验证。'],
        where: [],
      },
      {
        name: '众生卷',
        alias: 'Scroll of Beings',
        ask: '当讲述者改变，一件事会呈现怎样不同的面貌？',
        now: ['历史快照已保留在 Story 的归档中，作为后续重做的材料。'],
        where: ['archived'],
      },
      {
        name: 'Log In to Log Out',
        alias: '请先登录以退出',
        ask: '在最后一个工作日，从邮件、聊天和日历之间，找回自己的名字、时间与选择。',
        now: ['已经留下可玩的实现，尚未发布。'],
        where: [],
      },
      {
        name: 'Echo Well',
        alias: '回声井',
        ask: '在黑暗中发出声波，既能看清前方、击退敌人，也会暴露自己的位置。',
        now: [
          '已经做成短局可玩原型，能否让人愿意反复玩下去，仍需要玩家的真实体验来回答。',
        ],
        where: [],
      },
    ],
  },
  {
    no: 'A.6',
    title: '一个愿望，也可以成为一件作品',
    short: '愿望成作品',
    items: [
      {
        name: '午夜造物局',
        alias: 'Midnight Foundry',
        ask: '从睡前交给 AI 的一个愿望开始：做个有趣的小玩意，给人一点惊喜。',
        now: ['还留下了更多可以试玩的作品。'],
        where: [],
      },
      {
        name: '人类验证局',
        ask: '追会逃跑的勾选框，面对“千万别按”的按钮，最后领到一张带着自己操作痕迹的“人类证明”。',
        now: ['成为了这个栏目的第零期'],
        where: [],
      },
      {
        name: '一起改',
        ask: '只改一句话、一道题或一个结尾，同一个起点就可能长出另一件作品。',
        now: ['相关共创入口还在整理，这份邀请仍有需要继续完成的部分。'],
        where: [],
      },
      {
        name: 'Office Rave',
        alias: '班味打碟机',
        ask: '把键盘、提示音和拍桌声编成一段音乐，再带走唱片封面或音频。',
        now: ['已留下首版实现', '可以在本机试玩'],
        where: [],
      },
      {
        name: 'Pick One',
        ask: '把电影选哪部、衣服选哪件的纠结，变成一次带着趣味判词的候选对决。',
        now: ['已留下首版实现', '完整使用体验仍需继续验证。'],
        where: [],
      },
      {
        name: 'Collision',
        ask: '让文字、图片和网页片段放在一起，生成不同的产品概念，再由人挑选、保留或放下。',
        now: ['留下了可以运行的桌面实验，创意的质量仍需要更多真实使用来判断。'],
        where: [],
      },
      {
        name: 'DreamStudio',
        alias: '造梦 AI',
        ask: '把剧本、角色、素材和制作步骤放到节点画布上，让多个 Agent 参与影像创作。',
        now: ['画布与部分制作流程已经有了实现', '这个半成品也保留在 Lab。'],
        where: ['lab'],
      },
      {
        name: 'Artist Skill',
        ask: '从画作、电影色彩和具体作品的观察出发，把机位、光线、笔触与场面组织整理成可使用的创作方法。',
        now: ['已整理成可分别安装使用的 Skill'],
        where: [],
        href: `${GH}/artist-skill`,
      },
    ],
  },
  {
    no: 'A.7',
    title: '把方法、经验和作品交到更多人手里',
    short: '交给更多人',
    items: [
      {
        name: 'README Craft',
        ask: '让第一次看到它的人明白，这是什么，能用来做什么，又该从哪里开始。',
        now: [
          '留下了一套可以使用的 Skill，也把独立读者的反馈留作后续需要补上的验证。',
        ],
        where: [],
      },
      {
        name: 'Knowledge Graphify',
        ask: '把文章里的判断、依据和反例画成可以追溯的逻辑地图。',
        now: ['分别留下了工具或部分 Skill 的实现。'],
        where: [],
      },
      {
        name: '职场参谋',
        alias: 'Workplace Advisor',
        ask: '围绕沟通、协作与投入取舍整理思路和可用的话术',
        now: ['分别留下了工具或部分 Skill 的实现。'],
        where: [],
      },
      {
        name: 'Observer Skills',
        ask: '从提问与提示方式入手，尝试帮助人更清楚地表达需要。',
        now: ['分别留下了工具或部分 Skill 的实现。'],
        where: [],
      },
      {
        name: 'Search Evidence Layer 与 Intelligence Client',
        ask: '找到来源，取得正文，保留依据，知道哪里失败、从哪里继续。',
        now: ['留下了可以复用的基础工具。'],
        where: [],
      },
      {
        name: '共享研究库、KOL Daily 和文章库',
        ask: '保存研究线索、来源、报告与写作材料，让一次研究留下的东西，有机会被下一次工作重新拿起来。',
        now: [],
        where: [],
      },
      {
        name: 'Studio Growth 和社媒发文 Skills',
        ask: '把选题、创作、平台表达与复盘的方法留下来，整理成团队能够继续使用的工作方式。',
        now: [
          '这些内部实践，与 CGS 关心的创作问题彼此相邻，各自保留着不同阶段的尝试。',
        ],
        where: [],
      },
      {
        name: '烤个梨呀',
        alias: 'Roast Pear',
        ask: '作品与早期使用者怎样相遇',
        now: ['停在社区设计与原型阶段，后来这个仓库成为今天官网所在的仓库。'],
        where: [],
        // 新写：这个仓库就是你正在看的网站
        aside: '你在这里',
      },
    ],
  },
  {
    no: 'A.8',
    title: '还有一些问题，停在设计里',
    short: '设计里的问题',
    items: [
      {
        name: 'Aether',
        alias: '以太',
        ask: '指标、知识、查询与报告能不能放进同一个工作环境？',
        now: ['做过数据工作台设计，也搭起了界面框架，核心业务能力尚未实现。'],
        where: ['design'],
      },
      {
        name: 'Loreport',
        ask: '哪些背景是团队共同认可的，哪些推敲应该留在个人空间里？',
        now: ['为这种协作设计过共享与私有的边界'],
        where: ['design'],
      },
      {
        name: 'FactPatch',
        ask: '一次产品规则变化，可能让很多旧文档同时过时。',
        now: ['目前停在草案阶段。'],
        where: ['design'],
      },
      {
        name: 'DSH 生态监控',
        ask: '怎样整理插件的新增、更新与供给缺口',
        now: ['这些仍是等待进一步验证的方向。'],
        where: ['design'],
      },
      {
        name: '万物收藏柜',
        ask: '把遇见过的树、瓶盖、招牌和小物件，收进一个逐渐长大的个人数字展柜。',
        now: ['这些仍是等待进一步验证的方向。'],
        where: ['design'],
      },
    ],
  },
];
