// Molis World 页（Folio）的文案。依据 specs/folio-studio-home/optimization-plan.md 的 A2 与附录 C
// （10/11 负责人提供的讨论稿要点）。World 是概念：没有原型和仓库，状态一律写「概念设计」，
// 不放下载、试用、注册入口，主行动是「关注进展」。「Life + Story = World」现在对外讲，但不写成已经打通。
// 页面上的例子都是「概念示意」或「示例旅程」。视觉风格还在探索（P13），先用 Folio 的纸与胶带。

import type { FolioProductId } from './folio';

export const folioWorld = {
  name: 'Molis World',
  /** 一句话（已定），也用在首页入口、顶栏下拉和「接着看」 */
  line: '现实和故事，都住进你慢慢长大的世界',
  status: '概念设计',
  description:
    'Molis World 是一个持续生长的个人空间：把喜欢的地点、伙伴、经历和作品放在一起，连接真实生活与虚构故事。目前是概念设计。',

  hero: {
    kicker: 'Molis World · 概念设计',
    /** 首屏标题（已定） */
    title: '现实里的地方，故事里的经历，都住进你慢慢长大的世界。',
    lead: '一个属于你的小世界：常去的面馆、走过的一段故事、带回来的纪念物，都可以放进来，按你的方式慢慢布置。',
    status: ['概念设计', '还没有可用版本', '页面里的例子都是概念示意'],
    actions: { follow: '关注进展', journey: '看一段示例旅程' },
  },

  /** 首屏右边的一张纸：三样东西住在同一个世界里（概念示意，不是界面） */
  map: {
    note: '概念示意',
    title: '你的世界',
    places: [
      { kind: '现实里的地方', name: '巷口那家面馆', from: 'life' },
      { kind: '故事里的经历', name: '雾港的一夜', from: 'story' },
      { kind: '带回来的东西', name: '第十三号钥匙牌', from: 'world' },
    ] as { kind: string; name: string; from: FolioProductId }[],
  },

  what: {
    kicker: 'World 是什么',
    title: '一个只属于你、会慢慢长大的小世界。',
    lead: '它连接真实生活和虚构故事，是一个持续生长的个人空间。不连别的产品，也能自己开始。',
    items: [
      {
        title: '放进你在意的地方',
        text: '常去的面馆、散步的公园、某个街角，手工加进来就行。',
      },
      {
        title: '按你的方式布置',
        text: '怎么摆、叫什么、留下哪些回忆，你说了算。',
      },
      {
        title: '随时回来接着改',
        text: '它不催你。隔一阵子回来，它还在原处，等你接着布置。',
      },
    ],
  },

  journey: {
    kicker: '一段示例旅程',
    title: '从一家面馆开始，走进故事，再把回忆带回来。',
    note: '示例旅程 · 概念示意',
    steps: [
      {
        product: 'world',
        text: '把常去的那家面馆，放进你的世界。',
      },
      {
        product: 'story',
        text: '以它为灵感，走进一个故事：面馆后厨的门，通向另一座城。',
      },
      {
        product: 'story',
        text: '带上你的 Agent，或者一支队伍，一起出发。',
        planned: true,
      },
      {
        product: 'story',
        text: '在故事里，一起把这件事完成。',
      },
      {
        product: 'world',
        text: '纪念物和回忆，带回你的世界，放在面馆旁边。',
      },
      {
        product: 'life',
        text: '冒出一个真实的想法：这周末真的去吃一次。交给 Life 准备。',
      },
    ] as { product: FolioProductId; text: string; planned?: boolean }[],
    planned: '规划中',
  },

  family: {
    kicker: '三个产品的关系',
    title: 'Life + Story = World',
    lead: '三个产品各自独立。连接它们的，是你选择共享的数据和同一个身份。',
    items: [
      {
        id: 'life',
        role: '真实生活',
        text: '懂你、陪你的个人 Agent，处理现实里的信息、计划和行动。',
        status: '原型探索 · 还不能下载',
      },
      {
        id: 'story',
        role: '虚构世界',
        text: '走进另一个世界，经历另一种生活，然后回来。',
        status: '开发中 · 四个世界在开发版里能走完 · 还不能下载',
      },
      {
        id: 'world',
        role: '你的小世界',
        text: '现实里的地方和故事里的经历，都放在这里，慢慢长大。',
        status: '概念设计 · 还没有可用版本',
      },
    ] as { id: FolioProductId; role: string; text: string; status: string }[],
    more: '去看看',
  },

  rules: {
    kicker: '分寸',
    title: '世界可以慢慢长大，有些边界不会变。',
    items: [
      {
        title: '现实归现实',
        text: '剧情不会改写你真实的订单、营业时间或记录。',
      },
      {
        title: '分享不等于公开',
        text: '分享一段经历，不会带出你的订单、地址或行踪。',
      },
      {
        title: 'Agent 在做什么，看得见',
        text: '提议、执行中、等你确认、暂停、结果，每一步都清楚。',
      },
      {
        title: '托付有边界',
        text: '交给 Agent 的事，先说好范围、时间和能做的动作。',
      },
      {
        title: '离开、暂停、结束，是三件事',
        text: '离开页面不等于暂停 Agent，暂停也不等于结束这段旅程。',
      },
      {
        title: '作品分版本',
        text: '草稿、试玩、发布分开；改一个新版本，不会打断别人正在玩的。',
      },
    ],
  },

  /** 首页 Story 之后的入口（A1）：不单独占一屏；过渡句是暂用，等 P2 定稿 */
  home: {
    transition: '生活里有陪伴，故事里有远方，你的世界是归处。',
    more: '了解 Molis World',
  },

  closing: {
    title: ['它还是一个概念，', '想看它慢慢长出来吗？'],
    follow: '关注 Molis World 的进展',
    home: '回到首页',
  },
};
