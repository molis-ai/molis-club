// Folio 社区页（/demos/community）与方法详情页的文案。依据 specs/folio-studio-home/optimization-plan.md
// 的 A6（百科并入社区，改叫「方法」）与 A7（社区减负，加入分享入口）。
// 页面五段：首屏（小花实验）→ 试一试 → 方法 → 大家的分享 → 一起改进；团队与文章只留一行入口。
// 「大家做的」只放真实投稿且本人同意展示的内容，由团队手动更新这里的 showcase.items；没有投稿时只显示空状态。
// 话题标签与投稿渠道（P11）未定：不写标签，也不写不存在的群或频道。

export type CommunityShowcaseItem = {
  /** 作品名称，投稿人自己起的 */
  title: string;
  /** 投稿人同意公开的称呼 */
  by: string;
  /** 投稿人给的作品链接 */
  href: string;
  /** 用到的方法，例如「莫奈的光与色 Skill」 */
  method?: string;
};

export const folioCommunity = {
  nav: {
    label: '社区',
    items: [
      { id: 'try', label: '试一试' },
      { id: 'methods', label: '方法' },
      { id: 'share', label: '分享' },
      { id: 'improve', label: '一起改进' },
    ],
    home: '回工作室',
    /** Folio 页尾「工作室」一栏里指到方法段的一项 */
    footerMethods: '社区 · 方法',
  },

  hero: {
    eyebrow: 'MOLIS AI · 创作社区',
    description: [
      '试试有意思的作品，看看它们怎么做出来。',
      '带走一个方法，也留下你的新想法。',
    ],
    actions: { try: '试试看', share: '分享你做的' },
    signature: { zh: '始终好奇，持续创造。', en: 'Made of curiosity.' },
    /** 小花旁边的「怎么做的」，原来的「把过程摊开」一段收在这里 */
    how: {
      summary: '怎么做的',
      lead: '一个形状，加一点重复，再留一点变化。',
      steps: [
        {
          title: '先画一条线',
          text: '一个椭圆，就足够开始。',
          count: 1,
          bloom: 44,
        },
        {
          title: '试着重复它',
          text: '旋转、重复 24 次，复杂的形状从简单的规则里长出来。',
          count: 24,
          bloom: 44,
        },
        {
          title: '把变化交给你',
          text: '留出形状和颜色的选择，下一种可能由动手的人决定。',
          count: 24,
          bloom: 82,
        },
      ],
      copy: '复制这个实验的提示词',
    },
  },

  try: {
    kicker: '试一试',
    title: '从一个念头，到你手边的一件东西。',
    lead: '可以接触的工具、作品和实验。有些会长进产品，有些成为下一次创造的方法。',
    works: [
      {
        id: 'niulai',
        type: '桌面工具 · 公开仓库',
        name: 'niul.ai',
        alias: '牛来',
        line: '等待 AI 的时候，有头牛替你留意。',
        link: {
          label: '去 GitHub 牵头牛',
          href: 'https://github.com/molis-ai/niul.ai',
        },
        relation: '独立的小工具，也在走向 Molis Tool。',
      },
      {
        id: 'dropagent',
        type: 'Mac 工具 · 公开下载',
        name: 'DropAgent',
        line: '把材料放下，把结果带走。',
        link: {
          label: '查看项目与安装说明',
          href: 'https://github.com/molis-ai/DropAgent',
        },
        relation: '拖放处理的能力，正在走向 Molis Tool。',
      },
      {
        id: 'artist-skill',
        type: '创作方法 · 开源 Skill',
        name: 'Artist Skill',
        line: '借一双眼睛，做出自己的作品。',
        link: { label: '看方法，带走 Skill' },
        relation: '从作品里拆出的创作方法，都收在下面的「方法」里。',
      },
    ],
    toTool: '看看 Molis Tool',
    toMethods: '去「方法」看看',
    family: 'Work、Tool、Life、Story，是我们持续建设的产品方向。',
    familyLink: '认识 Molis 的产品家族',
  },

  methods: {
    kicker: '方法',
    title: '看懂一种表达，把它变成自己的能力。',
    lead: '社区里试出来的方法收在这里：艺术家 Skill、网页与动效、整理过的组件来源。先在卡片上试一试，再把 Skill 或 Prompt 带回自己的工具。',
    filters: ['全部', '艺术家 Skill', '网页与动效', '组件来源'] as const,
    filtersLabel: '方法分类',
    search: '试试「莫奈」「逐段浮现」或「tabs」',
    searchLabel: '搜索方法',
    count: '个方法',
    /** 默认露出的六张精选：三位艺术家 Skill，加错落入场、折叠展开和一个布局条目 */
    picks: [
      'monet-impressionism',
      'dali-surrealism',
      'wes-anderson-poster',
      'stagger',
      'accordion',
      'asymmetric-grid',
    ],
    more: '查看全部方法',
    less: '只看精选',
    artist: { kind: '艺术家 Skill', download: '下载 Skill', detail: '看方法' },
    technique: { copy: '复制 Prompt', detail: '看完整方法' },
    techniqueKinds: { 动效百科: '动效', 网页词典: '网页' } as Record<
      string,
      string
    >,
    resources: {
      count: '个组件来源',
      note: '编辑整理的外部来源，点进去看用途、边界和 Prompt。',
    },
    disclosure: '艺术家图像来自 Artist-skill 的 AI 创作试样，非艺术家原作。',
    empty: {
      title: '还没找到这个方法。',
      text: '换个说法，或看看已有的 Skill、动效与组件来源。',
      reset: '查看全部方法',
    },
  },

  /** 方法详情页的位置与回去的路 */
  detail: { community: '社区', methods: '方法' },

  /** 下载或复制成功后的一句提示，带一个投稿入口 */
  after: {
    flower: 'SVG 已开始下载，留给你的下一次创作。',
    skill: 'Skill 已开始下载。',
    copied: '已复制，可以带走了。',
    send: '也发给我们一份',
  },
  /** 每张卡上的小入口 */
  shareEntry: '做了一个？分享给我们',

  share: {
    kicker: '大家的分享',
    title: ['带着好奇来。', '带点什么走，再带点什么回来。'],
    lead: '用这里的东西做出了什么，就发出来给大家看看。三个口子，从轻到重。',
    ways: [
      {
        title: '做完就能分享',
        text: '下载小花或 Skill、复制 Prompt 之后，提示里会多一句「也发给我们一份」。',
      },
      {
        title: '做了一个？分享给我们',
        text: '每张方法卡下面都有这个入口。点进去，表单替你写好了开头，贴上作品链接就行。',
        action: '投稿给我们',
      },
      {
        title: '开发者，在 GitHub 一起做',
        text: '给 Artist Skill 加一位艺术家，或者提一个具体的问题和改进。',
        action: '去 Artist Skill 仓库',
        href: 'https://github.com/molis-ai/artist-skill',
      },
    ],
    showcase: {
      title: '大家做的',
      note: '只放真实投稿，并且投稿人勾选了「同意展示」。由团队手动挑选更新，不是论坛。',
      empty: '第一批分享会放在这里。',
      items: [] as CommunityShowcaseItem[],
    },
  },

  improve: {
    kicker: '一起改进',
    text: '用得顺不顺手、哪里卡住了，都想知道。',
    github: '去 GitHub 看看',
    feedback: '告诉我们试得怎么样',
  },

  people: '认识做这些的人',
};
