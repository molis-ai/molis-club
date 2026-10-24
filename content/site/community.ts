// 社区（/community 与 /community/methods/**）的文字。
// 原句：取自 docs/studio-intro.md 第 6 章与附录 A.1，逐字不改；一段里有几句时按句号分开放，不在句中断开。
// 沿用：出自旧社区与方法页（content/folio-community.ts、content/folio.ts 的 folioWiki），只做了很少的字面调整。
// 新写：标签、按钮、空状态、图注、演示里的示意数据——安静、具体，不新增产品事实。
// 方法与艺术家 Skill 的数据在 content/knowledge.ts、content/artists.ts，这里只放社区页自己的话。
//
// 「大家做的」只放作者明确同意展示的真实投稿（showcase），由团队手动加；一条都没有时页面只显示空状态。

/** 已核对：公开仓库 */
export const ARTIST_SKILL_REPO = 'https://github.com/molis-ai/artist-skill';
/** 已核对：公开仓库 */
export const NIUL_REPO = 'https://github.com/molis-ai/niul.ai';
/** 已核对：公开仓库；2026-09-12 发布 v0.2.0（macOS 14+，Apple Silicon 安装包在 releases 里） */
export const DROPAGENT_REPO = 'https://github.com/molis-ai/DropAgent';
export const DROPAGENT_RELEASE =
  'https://github.com/molis-ai/DropAgent/releases/latest';

/** 原句：第 6 章（标题与小节标题照底稿，不加句号） */
export const community = {
  title: [
    '试试有意思的作品，看看它们怎么做出来。',
    '带走一个方法，也留下你的新想法。',
  ],
  intro: [
    'Molis 社区从具体的作品和创造开始。',
    '你可以来体验一点新东西，为自己的想法找一种表达方式，也可以带走一份方法，继续完成自己的创作。',
    '做出新的尝试后，欢迎把作品和过程中的发现带回来。',
    '我们把自己的探索放在这里，也希望这里逐渐出现更多人的作品、视角和经验。',
  ],
  try: {
    title: '从一个可以亲手试的作品开始',
    lead: '有时，理解一个想法最直接的方式，就是亲手试一试。',
    works:
      '这里也会介绍工作室正在尝试的工具和作品：niul.ai 怎样回应等待 AI 时的分心，DropAgent 怎样把处理材料的过程收进一个轻巧的桌面入口，Artist Skill 又怎样把对艺术表达的观察整理成创作方法。',
    path: [
      '你可以先看演示，了解一个作品想解决什么，再沿着它的项目入口继续探索。',
      '有些尝试会长进产品，有些会留下可以复用的方法。',
    ],
    flower: [
      '比如“一朵好奇”：一个简单的形状，经过旋转和重复，慢慢长成一朵花。',
      '调整形状和颜色，观察画面怎样变化，再把喜欢的结果保存下来。',
      '展开它的做法，还能看到这个小实验如何从几条简单规则中产生。',
    ],
  },
  methods: {
    title: '看懂一种做法，做出自己的版本',
    question:
      '遇到喜欢的作品，我们往往还想知道：它为什么会有这样的效果，自己能不能也试着做出来？',
    answer: '社区里的“方法”，就是为这一步准备的。',
    artist: [
      '在艺术家 Skill 中，我们尝试把对光线、色彩、构图和叙事的观察，整理成可以交给 AI 使用的创作指引。',
      '你可以带着自己的主题尝试，也可以借助“构建自己的风格 Skill”，从研究喜欢的作品开始，逐步整理出自己的表达方法。',
    ],
    web: '在网页与动效里，可以观察一段文字怎样出现、一个按钮怎样回应操作、一组内容怎样展开，再带走相应的 Prompt，用到自己的页面中。',
    resources: '整理过的外部资源，则帮助你继续寻找适合的组件、交互和实现参考。',
    why: [
      '除了展示效果，我们也希望讲清楚：一种方法适合什么场景，使用时需要留意什么，相关资料来自哪里。',
      '这样，带走的内容才能成为下一次创作的起点。',
    ],
    tools: 'Skill 和 Prompt 需要带到你自己的、支持相应能力的 AI 工具中使用。',
    disclosure: '页面中的艺术风格示例是 AI 创作试样，并非艺术家原作。',
  },
  back: {
    title: '把新的尝试和真实感受带回来',
    lead: '用这里的方法做了一张图、一个网页，或者改出一种更适合自己的做法，都欢迎分享给我们。',
    work: [
      '可以是一件完成的作品，也可以是一段仍在尝试的过程。',
      '附上作品链接，讲讲你原本想做什么、改了哪些地方，或者哪个结果出乎意料，就已经很有价值。',
    ],
    showcase:
      '分享会先交给工作室。对于作者明确同意展示的作品，我们会选择其中的一些，连同创作说明一起放到社区里，让后来的人也能从中获得启发。',
    github:
      '如果你愿意进一步参与，也可以到 Artist Skill 的 GitHub 项目中补充研究资料、改进已有方法，或尝试加入新的艺术家方向。',
    feedback: [
      '还没有作品也没关系。',
      '哪里顺手、哪里卡住、哪段说明让人看不明白，都欢迎告诉我们。',
      '这些具体的使用经历，会帮助我们判断下一步应该改什么。',
    ],
    hope: '我们希望，一件作品在这里被体验之后，还能引出新的问题、新的做法，以及下一个人的创作。',
  },
  progressLabel: '当前进展',
  progress:
    '社区目前以工作室自己的作品、实验和整理过的创作方法为主，用户作品展示仍在起步阶段。后续将结合真实投稿与使用反馈，逐步丰富内容。',
  closing: '带着好奇来，带点什么走，再带点什么回来。',
};

/** 原句：附录 A.1（底稿里的加粗记号已去掉） */
export const appendixTools = {
  niul: [
    '当几个 Agent 同时工作，等待也会占用注意力。',
    'niul.ai，牛来，把忙碌、等你、闲置和离线变成桌边看得见的角色与提醒。',
    '抬眼就能知道谁需要回应，不必反复打开窗口查看。',
    '它给工作补上的，是对进度的感知，也是一点轻松的陪伴。',
  ],
  drop: [
    '手上的东西也未必属于一个完整项目。',
    '有时只有一份 PDF、一张截图或一个网页，想处理完就把结果带走。',
    'DropAgent 为这些材料做了一个菜单栏里的置物架：放下材料，在副本上处理，再取走新结果。',
  ],
  both: 'DropAgent 和牛来都已有独立桌面应用，材料处理、Agent 动态与提醒的部分场景，也在 Molis Tool 中继续完善。',
};

/**
 * 新写：页面上的标签、按钮与说明（负责人 2026-10-22 改回白房子：首屏两句标题 + 一张团队插画；
 * 五件作品一个画廊；方法目录；带回来的一个主行动和两条次要去处；结尾那段画室）。不写引导与过渡（DESIGN.md 常驻约束）。
 */
export const communityUi = {
  kicker: '社区',
  /** 三张团队插画（负责人 2026-10-22 选定；题目沿用插画图库） */
  art: {
    'art-window': {
      title: '开窗，开始创造',
      alt: '水彩插画：敞开的大窗外是海和远山，窗台上睡着一只猫；长桌边三个人各做各的——一个在速写本上画画，一个顶着小房子的脑袋、捧着一座房子模型，一个对着笔记本电脑；桌上有向日葵、书和颜料。',
    },
    'art-book': {
      title: '翻开，另一片天地',
      alt: '水彩插画：戴眼镜的粉发女孩翻开一本大书，书页里立起一片小世界——树、房子、拱门、山和海边的自行车；一只围着青色围巾的小狐狸从书页后面探头，桌上有茶杯和明信片。',
    },
    'art-greenhouse': {
      title: '把想法种出来',
      alt: '水彩插画：围着青色围巾的小狐狸站在凳子上，给陶盆里一座玻璃小温室浇水，温室里有树屋、风车和一团发光的小球；一只橘色小猫在旁边拨弄种子，地上放着种子袋和小铲子。',
    },
  },
  /** 读屏与键盘：花本身就是一个可以调的控件 */
  keys: '在花上拖动，或用方向键：左右改重复次数，上下改展开程度；点一下换一档展开。',
  /** 作品画廊新版（2026-10-24）：窗上那行五件作品名字的读屏名 */
  rail: '五件作品',
  methods: {
    search: '搜索艺术家、效果或组件',
    searchLabel: '搜索方法目录',
    go: '搜索',
  },
  back: {
    /** 一个主行动；另外两条是次要的去处（压缩自第 6.3 节） */
    share: { title: '分享作品', topic: 'creator' },
    also: [
      { title: '说说试得怎么样', topic: 'feedback' },
      { title: '在 GitHub 一起改', href: ARTIST_SKILL_REPO },
    ],
    /** 还没有作者同意展示的投稿时：一面空墙，只写这一句 */
    empty: '作品墙还空着：这里只放作者明确同意展示的投稿。',
  },
  end: {
    pause: '暂停背景画面',
    play: '继续背景画面',
  },
  share: '也发给我们一份',
};

/**
 * 新写：五件作品各自的展签（名称 · 形态 · 阶段）与按钮。「想解决什么」「怎么做」都直接用第 6 章与附录 A.1 的原句，
 * 作品事实只来自底稿与已核对的仓库。
 */
export const works = {
  flower: {
    name: '一朵好奇',
    form: '小实验',
    stage: '可以直接玩',
    /** 沿用 content/folio-community.ts 的「怎么做的」；count、bloom 是那一步花的样子 */
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
    copy: '复制提示词',
    download: '下载 SVG',
    filename: '一朵好奇-Molis-AI.svg',
    controls: { count: '重复', times: '次', bloom: '展开', color: '线的颜色' },
    downloaded: 'SVG 已开始下载。',
    caption: 'Curiosity, No. 01',
    /** 作品画廊新版：窗里那朵花再自己长一遍 */
    replay: '再长一遍',
    /** 交给 AI 的提示词：照着这朵花现在的做法写（新写，改自旧社区页） */
    prompt:
      '用 SVG 做一朵可以交互的线条花：以画面中心为原点，把一个椭圆旋转、重复若干次。在花上左右拖动改重复次数（1 到 36），上下拖动从 0 到 100 同时改变椭圆的短轴和旋转的总角度，方向键也能调；提供四种线条颜色和 SVG 下载。保留清楚的读屏说明和减少动态效果支持。不需要连接 AI 或后端。',
  },
  artist: {
    name: 'Artist Skill',
    form: '创作方法',
    stage: '可以下载',
    sampleNote: 'AI 创作试样 · 非艺术家原作',
    pick: '选一种观看',
    /** 作品画廊新版：窗里三张试样轮着换 */
    pause: '暂停轮播',
    play: '继续轮播',
    download: '下载这个 Skill',
    detail: '完整方法',
  },
  web: {
    name: '网页动效',
    form: '方法',
    stage: '现场演示',
    pick: '选一个效果',
    copy: '复制 Prompt',
    detail: '完整方法',
  },
  niul: {
    name: 'niul.ai',
    alias: '牛来',
    form: '独立桌面应用',
    stage: '公开仓库',
    repo: 'GitHub 仓库',
  },
  drop: {
    name: 'DropAgent',
    form: '独立桌面应用',
    stage: '已发布 0.2.0',
    download: '下载',
    system: 'macOS 14 及以上 · Apple Silicon',
    repo: 'GitHub 仓库',
  },
};

/** 新写：两段演示里的示意数据（不是真实界面，也不是真实会话） */
export const demos = {
  note: '示意',
  pause: '暂停演示',
  play: '继续播放演示',
  niul: {
    label:
      'niul.ai 示意：四个 Agent 坐在桌边，分别显示忙碌、等你、闲置和离线；有一个完成了，冒出一句「到你了」。',
    agents: ['查资料', '写周报', '跑测试', '译文档'],
    states: { busy: '忙碌', waiting: '等你', idle: '闲置', offline: '离线' },
    bubble: '到你了',
  },
  drop: {
    label:
      'DropAgent 示意：一份 PDF 放进菜单栏里的置物架，在副本上处理，原件不动，再把新结果取走。',
    file: '访谈记录.pdf',
    copy: '副本',
    working: '在副本上处理…',
    done: '处理好了',
    result: '新结果',
    original: '原件 · 未改动',
    take: '取走',
    steps: ['放下材料', '在副本上处理', '取走新结果'],
    clock: '10:24',
  },
};

/** 新写 / 沿用：方法目录与详情页 */
export const methodText = {
  trail: { community: '社区', methods: '方法目录' },
  kicker: '方法目录',
  back: '社区',
  backToMethods: '方法目录',
  fullImage: '看大图',
  repo: 'Artist Skill 仓库',
  /** 新写：页面描述（元信息）里接在原句后面的一句 */
  metaTail:
    '艺术家 Skill、网页与动效、整理过的组件来源，都可以搜索、复制 Prompt 或下载 Skill。',
  filters: [
    { id: 'all', label: '全部' },
    { id: 'artists', label: '艺术家 Skill' },
    { id: 'web', label: '网页与动效' },
    { id: 'sources', label: '组件来源' },
  ],
  filtersLabel: '按类别看',
  search: '试试「莫奈」或「toast」',
  searchLabel: '搜索方法',
  searchButton: '搜索',
  count: '个方法',
  searching: '搜索',
  groups: {
    artists: '艺术家 Skill',
    web: '网页与动效',
    sources: '组件来源',
  },
  /** 沿用 folioCommunity.methods.techniqueKinds */
  kinds: { 动效百科: '动效', 网页词典: '网页', 组件资源: '组件来源' } as Record<
    string,
    string
  >,
  download: '下载 Skill',
  detail: '看方法',
  copy: '复制 Prompt',
  shareArtist: '用 Skill 做了一张图？',
  shareMethod: '用 Prompt 改了一个页面？',
  shareLink: '分享给我们',
  /** 新写：搜不到时 */
  empty: {
    title: '这个说法，还没收进来。',
    text: '换个词试试，或者先看看全部。',
    reset: '看全部方法',
  },
  // ---------- 方法详情（沿用 folioWiki.entry） ----------
  use: { technique: '什么时候用', resource: '可以重点看什么' },
  caution: { technique: '留意这些细节', resource: '使用时留意' },
  source: '参考与整理',
  editor: 'Molis AI 编辑整理',
  reduced: 'MDN · 减少动态偏好',
  related: '接着看',
  duration: '动效时长',
  replay: '重播',
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
  // ---------- 艺术家 Skill 详情（沿用 folioWiki.artist） ----------
  artist: {
    kind: '艺术家 Skill',
    method: '它怎样组织创作',
    download: '下载完整 Skill',
    package: '含 Skill 正文与所需参考文件。',
    sample: 'Artist Skill · AI 创作试样，非艺术家原作。',
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
  copyState: {
    copied: '已复制，可以带走了。',
    manual: '没复制上，文字已经选中，按 ⌘C / Ctrl+C 就好。',
    downloaded: '已开始下载。',
  },
  notFound: '没有找到这个方法',
};

/** Skill 压缩包的大小（public/downloads/artists/*.zip，2026-10-15 量过；换包时一起改） */
export const skillZipKb: Record<string, number> = {
  'monet-impressionism': 8,
  'dali-surrealism': 10,
  'wes-anderson-poster': 12,
  'art-style-skill-builder': 9,
};

export type ShowcaseItem = {
  /** 作品名，投稿人自己起的 */
  title: string;
  /** 投稿人同意公开的称呼 */
  by: string;
  /** 投稿人给的作品链接 */
  href: string;
  /** 用到的方法，例如「莫奈 · 光与色」 */
  method?: string;
  /** 投稿人自己写的一句创作说明 */
  note?: string;
};

/** 只放作者明确同意展示的真实投稿；没有就保持空 */
export const showcase: ShowcaseItem[] = [];
