// Molis Tool 页（specs/site-rebuild/tool-page.md 第 9 节）。骨架取自 Folio 版 Tool 页：
// 首屏光标演示 → 以前与现在 → 由近到远的三层 → 眼前的小事 → 插件 → 分寸 → 收尾。
// 标题、加粗句与说明里标了「原句」的取自 docs/studio-intro.md 4.2；三层、对照、插件、承诺与「它不是」出自 Folio 版与 molis-tool 设计纲领（待负责人确认）；
// 演示里的网页、活动、报价、对话都是示例数据，界面都是示意。

import { products } from './products';

const tool = products.tool;
const [small, chain, later] = tool.sections;

/** 一个动作的颜色：同一个动作在整页（演示和真的动作条）里永远是同一种颜色 */
export type Tone = 'apricot' | 'sky' | 'sage' | 'butter' | 'rose' | 'lilac';

/** 首屏：在网页上选中一句英文 → 光标旁三个动作 → 点翻译 → 带出处的译文（Folio 版首屏，新写，示例） */
export const desk = {
  url: 'notes.example.com/switching-cost',
  heading: 'Why switching tasks is tiring',
  intro: 'Researchers have a name for it.',
  /** 选中的一句，按画面里的行排好 */
  select: ['Attention residue: part of your mind', 'stays on the last task'],
  rest: [' even after', 'you move on.'],
  actions: [
    { label: '翻译', tone: 'sky' },
    { label: '解释', tone: 'sage' },
    { label: '记下', tone: 'rose' },
  ] as { label: string; tone: Tone }[],
  result: {
    label: '翻译',
    tag: 'AI',
    text: '注意力残留：一部分心思还停在上一件事上，哪怕你已经换到下一件。',
    source: 'notes.example.com/switching-cost · 第 2 段',
  },
  note: '界面示意',
  label:
    '界面示意：在网页上选中一句英文，选区末端出现翻译、解释、记下三个动作；点翻译，带着来源的译文出现在旁边。',
  /** 首屏左下：整页都能选中（键盘、触屏用按钮代选） */
  hint: '这一页上的任意一句话，都可以选中。',
  pick: '选中上面这句',
};

/** 以前与现在：同一句乱了格式的话，老路绕四站，Molis Tool 一步 */
export const shift = {
  kicker: '软件不必再是一个要去的地方',
  title: '能力来到光标旁，而不是人去找应用。',
  /** 标题里被荧光笔划过的几个字（只是强调，不改原句） */
  mark: '光标旁',
  /** 格式乱掉的一句：片段之间多出来的空格，清理时收拢 */
  messy: ['会议改到', '周四', '下午三点，', '地点：', '二楼小会议室'],
  before: {
    label: '以前',
    steps: ['打开应用', '搬运材料', '找功能', '带回来'],
    /** 原句 */
    text: tool.opening[1],
  },
  after: {
    label: '用 Molis Tool',
    action: '清理格式',
    done: '一步，结果留在原处',
    /** 原句 */
    text: tool.opening[2],
  },
  note: '界面示意',
  label:
    '示意：同一句格式乱掉的话。以前要打开应用、搬运材料、找功能、再带回来；用 Molis Tool，选中它，光标旁点「清理格式」，结果留在原处。',
};

/** 由近到远的三层：同一场秋日市集，在三层里接着处理（Folio 版「三层接力」，示例活动） */
export const layers = {
  kicker: '由近到远的三层',
  title: '离你越近，打扰越少。',
  mark: '打扰越少',
  near: {
    name: '光标旁',
    text: '选区末端出现 1 到 3 个动作。',
    eyebrow: '正在读一则活动通知',
    before: '周日 ',
    mark: '10 月 26 日下午两点',
    after: '，',
    line: '秋日市集在滨江公园东门草坪开市。',
    chips: [
      { label: '整理成日程', tone: 'apricot' },
      { label: '翻译', tone: 'sky' },
    ] as { label: string; tone: Tone }[],
    result: '已记下 · 10/26 周日 14:00',
    undo: '撤回',
  },
  beside: {
    name: '身旁',
    text: '需要核对时，在旁边展开一张小卡。',
    eyebrow: '框住一张海报',
    poster: { day: '26', month: 'OCT', title: ['秋日', '市集'] },
    card: '日程草稿',
    fields: [
      ['标题', '秋日市集'],
      ['时间', '周日 14:00—17:00'],
      ['地点', '滨江公园东门'],
    ],
    source: '来自海报的这一块',
    actions: ['确认', '改一下'],
  },
  later: {
    name: '离开以后',
    /** 原句 */
    text: later.title,
    eyebrow: '过了一会儿，在别处',
    clock: '16:30',
    panel: '接续',
    rows: [
      { name: '秋日市集 · 日程草稿', meta: '等你确认 · 来自海报' },
      { name: '已记下 · 10/26 14:00', meta: '来自活动通知' },
    ],
    back: '回到你离开的地方',
    /** 访客在这一页用过动作条的话，排在最上面（只在当前标签页的内存里） */
    mine: '刚才',
    mineFrom: '来自这一页',
  },
  note: '界面示意 · 示例活动',
  label:
    '示意：同一场秋日市集在三层里接着处理。光标旁，选中日期，点「整理成日程」，当场记下；身旁，框住海报，旁边展开一张日程草稿，逐项核对；离开以后，从菜单栏的「接续」找回草稿，回到离开的地方。',
};

/** 眼前的小事：六件，每件一张小样品（4.2 里写到的能力与正在打磨的场景） */
export const moments = {
  kicker: '一天里的几个时刻',
  /** 原句 */
  title: small.title,
  mark: '就在手边处理',
  lead: tool.opening[0],
  /** 原句：「正在打磨」三个字从这里来 */
  wip: chain.paragraphs[1],
  tags: { local: '本机', ai: 'AI', wip: '正在打磨' },
  clean: {
    title: '清理格式',
    kind: 'local',
    tone: 'butter',
    messy: ['报名截止', '周五', '晚上八点，', '名额 30 人'],
  },
  pages: {
    title: '取出 PDF 里的几页',
    kind: 'local',
    tone: 'sky',
    file: '报价.pdf',
    copy: '第 2–4 页',
    kept: '原件保留',
  },
  table: {
    title: '整理成表格，再比较',
    kind: 'local',
    tone: 'sage',
    text: ['甲：2.40 元 × 5000', '乙：2.15 元 × 5000', '丙：2.60 元 × 3000'],
    head: ['', '单价', '数量'],
    rows: [
      ['甲', '2.40', '5000'],
      ['乙', '2.15', '5000'],
      ['丙', '2.60', '3000'],
    ],
  },
  caption: {
    title: '给图片写一句说明',
    kind: 'ai',
    tone: 'rose',
    text: '白墙上，一道午后的天光。',
  },
  poster: {
    title: '海报变日程草稿',
    kind: 'wip',
    tone: 'apricot',
    fields: [
      ['时间', '周六 15:00'],
      ['地点', '老厂房 2 号馆'],
    ],
  },
  todo: {
    title: '讨论整理成待办',
    kind: 'wip',
    tone: 'lilac',
    chat: ['发布页周五前改好，我来补文案。', '好，周五上线。'],
    items: ['周五前改好发布页', '补文案'],
  },
  note: '界面示意 · 示例数据',
} as const;

/** 插件就是能力：登记一次，光标旁、右键、拖放、命令条同时出现（Folio 版，出自 molis-tool 插件协议，待负责人确认） */
export const plugins = {
  kicker: '插件就是能力',
  title: '登记一次，处处可用。',
  mark: '处处可用',
  facts: [
    {
      title: '插件写下能做什么，不画界面',
      text: '接受什么、产出什么、在本机还是联网跑。参数面板和结果样式由 Molis Tool 统一生成。',
    },
    {
      title: '登记一次，各处都在',
      text: '光标旁、右键、拖放和命令条同时出现；停用时一处生效，处处消失。',
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
  surfaces: {
    near: { label: '光标旁', others: ['翻译'] },
    menu: { label: '右键', others: ['打开方式', '共享'] },
    drop: { label: '拖放', hint: '拖到这里' },
    bar: { label: '命令条', query: '字幕', where: '本机' },
  },
  chain: ['访谈.m4a', '字幕.srt', '字幕 · 英文.srt'],
  next: '翻译',
  kept: '停用后，入口一起收起；做好的字幕还在。',
  note: '界面示意 · 协议里的例子',
  label:
    '示意：「生成字幕」插件只声明接受音频视频、产出带时间的文字。启用后，它同时出现在光标旁、右键、拖放和命令条；生成的字幕可以直接交给已有的翻译；停用后各处入口一起收起，做好的字幕保留。',
};

/** 分寸：工具出现多久，由你当下的需要决定 */
export const measure = {
  kicker: '分寸',
  /** 原句 */
  title: later.paragraphs[1],
  mark: '你当下的需要',
  is: {
    label: '它会',
    items: [
      ['默认安静', '没有信号就不出现。'],
      ['只提议，不代劳', '决定在你手里。'],
      ['结果带着出处', '回得到原文。'],
      /** 后一句是原句 */
      ['没有 AI 也能用', small.paragraphs[1]],
    ],
  },
  not: {
    label: '它不是',
    /** 出自 molis-tool 设计纲领「它不是什么」，待负责人确认 */
    items: [
      '猜你想干什么、主动打断你的助手。',
      '又一个聊天窗口。',
      '常驻录屏、记住一切的后台。',
      '替你点按钮、代你发送的 Agent。',
    ],
  },
  photo: {
    alt: '白墙高处一扇玻璃天窗，阳光把窗格的影子斜斜印在墙上。',
    caption: 'Light through a skylight',
  },
};

export const selectTry = {
  label: '对选中的文字可以做的事（示意）',
  actions: {
    calendar: '整理成日程',
    translate: '翻译',
    table: '整理成表格',
    clean: '清理格式',
    count: '数一数',
    plain: '复制纯文本',
  },
  local: '本机',
  ai: 'AI',
  close: '收起',
  idle: '本机的动作是真的，标 AI 的是示意。',
  results: {
    count: (n: number) => `这段有 ${n} 个字。`,
    clean: (text: string) => `清理后：${text}`,
    plain: '已复制为纯文本，格式都去掉了。',
    plainFailed: '浏览器没让复制，选中的文字还在。',
    table: (rows: number) =>
      `整理成了一张 ${rows} 行的表，可以接着比较或导出。`,
    tableEmpty: '没找到能对齐的数字，这段先不整理成表。',
    calendar: (when: string) =>
      `示意：整理出一份日程草稿（时间：${when}），加入日历前由你确认。`,
    translate:
      '示意：在 Molis Tool 里，这里会用你配置的 AI 服务翻译，结果带着来源回到原处。',
    translateSample: '示意：带上自己的杯子。有手作、旧书和一支乐队。',
  },
};

/** 当前进展：摘自 4.2「当前进展」原句 */
export const toolProgress = {
  have: [
    'Molis Tool 已有 Mac 开发版本，以及文字、文件、PDF、表格等本机处理能力。',
  ],
  notYet: [
    '跨应用交互、真实 AI 和系统服务仍在整合与验证，尚未公开提供安装包。',
    '它按独立产品推进，也计划成为 Molis Work 的基础能力，具体接入范围与时间尚未确定。',
  ],
  /** 「已有 / 还没有」块：上面两句原句拆成的词 */
  blocks: {
    have: ['Mac 开发版本', '文字、文件、PDF、表格等本机处理能力'],
    notYet: ['跨应用交互', '真实 AI', '系统服务', '公开安装包'],
  },
  /** 附录 A 原句 */
  siblings:
    'DropAgent 和牛来都已有独立桌面应用，材料处理、Agent 动态与提醒的部分场景，也在 Molis Tool 中继续完善。',
};

export const toolGo = {
  follow: '关注 Molis Tool 的进展',
  work: '看看 Molis Work',
  community: '先在社区试试 DropAgent 和牛来',
  /** 新写 */
  now: 'Molis Tool 现在还不能下载。',
  have: '已经有的',
  notYet: '还没有的',
  original: '展开看原文',
  relation: '和 Molis Work',
  relationTag: '计划中 · 范围与时间未定',
  tryNow: '现在怎么体验',
};
