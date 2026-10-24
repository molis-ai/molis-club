// Molis Tool 页（specs/site-rebuild/tool-page.md 第 13 节）：首屏翻译 → 右边钉住一块 Mac 屏幕、左边的字随滚动过去
// （以前与现在 → 眼前的小事三件事对三层 → 插件，屏幕从早上走到傍晚）→ 分寸和收尾合成深色的一屏。
// 标了「原句」的取自 docs/studio-intro.md 4.2；插件、承诺与「它不是」出自 Folio 版与 molis-tool 设计纲领（待负责人确认）；
// 屏幕里的网页、笔记、报价、邮件、文件都是示例数据，界面都是示意。

import { products } from './products';

const tool = products.tool;
const [small, chain, later] = tool.sections;
/** 4.2 开头那句原句，按分号拆成三件事（拼回去一字不差） */
const [readText, getPdf, seeEvent] = tool.opening[0]
  .replace(/。$/, '')
  .split('；');

/** 一个动作的颜色：同一个动作在整页（演示和真的动作条）里永远是同一种颜色 */
export type Tone = 'apricot' | 'sky' | 'sage' | 'butter' | 'rose' | 'lilac';

/** Mac 桌面的壁纸：莫奈的伦敦，早上、午后、傍晚三张（负责人 2026-10-24 选） */
export type Wall = 'morning' | 'noon' | 'dusk';

type Chip = { label: string; tone: Tone };

/** 首屏：傍晚读一篇英文网页，划出一句 → 光标旁三个动作 → 点翻译 → 带出处的译文出现在旁边（新写，示例） */
export const desk = {
  wall: 'dusk' as Wall,
  app: '浏览器',
  menus: ['文件', '编辑', '显示', '历史记录', '书签'],
  clock: '周四 18:20',
  url: 'notes.example.com/switching-cost',
  heading: 'Why switching tasks is tiring',
  intro: 'Researchers have a name for it.',
  /** 选中的一句，按画面里的行排好 */
  select: ['Attention residue: part of your mind', 'stays on the last task'],
  rest: [' even after', 'you move on.'],
  more: 'It fades with time, but every switch adds a little more. A day of small detours leaves less room for the work in front of you.',
  /** 网页下半截：一个小标题和一段，让窗口像一页真的文章 */
  after: {
    heading: 'What helps',
    text: 'Finish small things where they start. Keep the rest within reach, so picking it up later costs less.',
  },
  actions: [
    { label: '翻译', tone: 'sky' },
    { label: '解释', tone: 'sage' },
    { label: '记下', tone: 'rose' },
  ] as Chip[],
  result: {
    label: '翻译',
    tag: 'AI',
    text: '注意力残留：一部分心思还停在上一件事上，哪怕你已经换到下一件。',
    source: 'notes.example.com · 第 2 段',
  },
  note: '界面示意 · 示例网页',
  label:
    '界面示意：在网页上选中一句英文，选区末端出现翻译、解释、记下三个动作；点翻译，带着来源的译文出现在旁边。',
  /** 首屏左下：整页都能选中（键盘、触屏用按钮代选） */
  hint: '这一页上的任意一句话，都可以选中。',
  pick: '选中上面这句',
};

/**
 * 以前与现在：两台一样的 Mac、同一张笔记，同一刻开始。左边走老路（Dock、另一个应用、菜单栏、再回来），
 * 右边原地一步；下面各记走了几步。只比路程，不演细节。
 * 钉住的屏幕从这里开始过一天：周五早上整理报价，接着是眼前的三件小事，傍晚装一个插件
 */
export const shift = {
  title: '能力来到光标旁，而不是人去找应用。',
  /** 标题里被荧光笔划过的几个字（只是强调，不改原句） */
  mark: '光标旁',
  wall: 'morning' as Wall,
  clock: '周五 08:56',
  notes: {
    app: '笔记',
    menus: ['文件', '编辑', '格式', '显示', '窗口'],
    title: '三家报价',
    meta: '10月24日 周五 08:52',
    lines: ['甲：2.40 元 × 5000', '乙：2.15 元 × 5000', '丙：2.60 元 × 3000'],
  },
  sheet: {
    app: '表格',
    menus: ['文件', '编辑', '插入', '数据'],
    title: '未命名表格',
    /** 菜单栏里要找的那个功能 */
    menu: '数据',
    items: ['排序…', '筛选', '分列…', '删除重复项'],
    pick: 2,
  },
  head: ['供应商', '单价（元）', '数量'],
  rows: [
    ['甲', '2.40', '5000'],
    ['乙', '2.15', '5000'],
    ['丙', '2.60', '3000'],
  ],
  dock: ['文件', '浏览器', '邮件', '笔记', '表格', '照片'],
  /** 老路上的四站：和下面那句原句是同一件事 */
  stops: ['打开应用', '搬运材料', '找功能', '带回来'],
  /** 两台下面记步数：老路一站一步，现在一步 */
  unit: '步',
  before: {
    label: '以前',
    /** 原句 */
    text: tool.opening[1],
  },
  after: {
    label: '现在',
    actions: [
      { label: '整理成表格', tone: 'sage' },
      { label: '复制纯文本', tone: 'rose' },
    ] as Chip[],
    stop: '一步',
    /** 原句 */
    text: tool.opening[2],
  },
  note: '界面示意 · 示例报价',
  label:
    '示意：两台一样的 Mac，同一张笔记，同时开始。左边是以前，光标从笔记跑到程序坞打开表格，把文字搬过去，到菜单栏里找「分列」，再把结果带回笔记，一共四步；右边是现在，在笔记里选中三行，光标旁点「整理成表格」，表格就在原处，一步，做完时左边还在路上。',
};

/** 眼前的小事：4.2 开头那句里的三件事，正好落在由近到远的三层（光标旁、身旁、离开以后），也是一天里的早上、午后、傍晚 */
export const cases = {
  /** 原句 */
  title: small.title,
  mark: '就在手边处理',
  lead: '一步能做完的，留在光标旁；要你看一眼的，在身旁展开；要等的，收进「接续」，回来再接着做。',
  /** 原句：「正在打磨」从这里来 */
  wip: chain.paragraphs[1],
  wipTag: '正在打磨',
  note: '界面示意 · 示例数据',
  near: {
    layer: '光标旁',
    /** 一天里的什么时候（屏幕的壁纸） */
    time: '早上',
    /** 原句的一截 */
    moment: readText,
    result: '一步做完，结果留在原处。',
    tone: 'butter' as Tone,
    wall: 'morning' as Wall,
    clock: '周五 09:12',
    app: '笔记',
    menus: ['文件', '编辑', '格式', '显示', '窗口'],
    list: [
      ['周会', '09:10'],
      ['三家报价', '08:52'],
      ['读书摘记', '周一'],
    ],
    title: '周会',
    meta: '10月24日 周五 09:10',
    before: '从群里转来的通知：',
    /** 格式乱掉的一句：片段之间多出来的空格，清理时收拢 */
    messy: ['会议改到', '周四', '下午三点，', '地点：', '二楼小会议室'],
    after: '记得带上季度的数字。',
    actions: [
      { label: '清理格式', tone: 'butter' },
      { label: '翻译', tone: 'sky' },
      { label: '复制纯文本', tone: 'rose' },
    ] as Chip[],
    done: '已清理 · 本机',
  },
  beside: {
    layer: '身旁',
    time: '午后',
    /** 原句的一截 */
    moment: getPdf,
    result: '在旁边挑页，另存一份，原件不动。',
    tone: 'sky' as Tone,
    wall: 'noon' as Wall,
    clock: '周五 14:30',
    app: '文件',
    menus: ['文件', '编辑', '显示', '前往', '窗口'],
    folder: '下载',
    files: [
      { name: '报价.pdf', kind: 'pdf' },
      { name: '访谈.m4a', kind: 'audio' },
      { name: '封面.png', kind: 'image' },
      { name: '合同.docx', kind: 'doc' },
    ] as { name: string; kind: 'pdf' | 'audio' | 'image' | 'doc' }[],
    actions: [
      { label: '取出几页', tone: 'sky' },
      { label: '压缩', tone: 'sage' },
    ] as Chip[],
    card: '取出几页',
    /** 报价.pdf 的六页：每页的小标题和几行字（缩略图里的样子） */
    pages: [
      ['报价单', '致：滨江社区', '2026 年 10 月'],
      ['一、印刷', '单价 2.40 元', '数量 5000 份'],
      ['二、装订', '骑马钉', '单价 0.35 元'],
      ['三、运输', '市内送货', '两个工作日'],
      ['付款方式', '预付 30%', '验收后结清'],
      ['附：纸样', '120 克哑粉', '封面 250 克'],
    ],
    picked: [1, 2, 3],
    range: '第 2–4 页 · 3 页',
    save: '另存一份',
    cancel: '取消',
    copy: '报价（第 2–4 页）.pdf',
    done: '已另存 · 原件不动',
  },
  later: {
    layer: '离开以后',
    time: '傍晚',
    /** 原句的一截 */
    moment: seeEvent,
    /** 原句 */
    result: later.title,
    tone: 'apricot' as Tone,
    wall: 'dusk' as Wall,
    clock: '周五 18:40',
    clockLater: '周五 19:05',
    app: '邮件',
    menus: ['文件', '编辑', '显示', '邮箱', '信息'],
    from: '滨江社区',
    subject: '秋日市集，这周日开市',
    to: '收件人：我',
    hello: '大家好：',
    select: '10 月 26 日（周日）下午两点',
    rest: '，秋日市集在滨江公园东门草坪开市。',
    tail: '带上自己的杯子；有手作、旧书和一支乐队。',
    actions: [
      { label: '整理成日程', tone: 'apricot' },
      { label: '翻译', tone: 'sky' },
    ] as Chip[],
    card: '日程草稿',
    fields: [
      ['标题', '秋日市集'],
      ['时间', '10/26 周日 14:00'],
      ['地点', '滨江公园东门草坪'],
    ],
    stowed: '收进接续',
    panel: '接续',
    rows: [
      {
        name: '秋日市集 · 日程草稿',
        meta: '等你确认 · 来自邮件',
        tone: 'apricot',
      },
      {
        name: '会议改到周四下午三点…',
        meta: '09:12 · 已清理 · 来自笔记',
        tone: 'butter',
      },
      {
        name: '报价（第 2–4 页）.pdf',
        meta: '14:30 · 副本 · 原件不动',
        tone: 'sky',
      },
    ] as { name: string; meta: string; tone: Tone }[],
    confirm: '确认',
    edit: '改一下',
    back: '回到你离开的地方',
    /** 访客在这一页用过动作条的话，排在最上面（只在当前标签页的内存里） */
    mine: '刚才',
    mineFrom: '来自这一页',
  },
};

/** 插件就是能力：开关一开，光标旁、右键、拖放、命令条同时出现（Folio 版，出自 molis-tool 插件协议，待负责人确认） */
export const plugins = {
  title: '登记一次，处处可用。',
  mark: '处处可用',
  lead: '插件只写下能做什么：接受什么、产出什么、在本机还是联网跑。入口和界面，由 Molis Tool 统一生成。',
  points: [
    '一处开关，光标旁、右键、拖放和命令条同时生效。',
    '生成的结果也是材料，可以直接交给下一个能力。',
    '停用以后，入口一起收起；做好的结果还在。',
  ],
  wall: 'dusk' as Wall,
  clock: '周五 19:20',
  app: 'Molis Tool',
  menus: ['文件', '编辑', '窗口'],
  name: '生成字幕',
  tone: 'lilac' as Tone,
  settings: '插件',
  list: [
    {
      name: '生成字幕',
      spec: '音频、视频 → 带时间的文字 · 本机',
      tone: 'lilac',
    },
    { name: '翻译', spec: '文字 → 文字 · AI', tone: 'sky' },
    { name: '清理格式', spec: '文字 → 文字 · 本机', tone: 'butter' },
  ] as { name: string; spec: string; tone: Tone }[],
  folder: '下载',
  /** 文件夹列表的表头和每个文件的大小（示例数据） */
  columns: ['名称', '大小'],
  files: [
    ['访谈.m4a', '18.4 MB'],
    ['封面.png', '2.1 MB'],
    ['发布会.mov', '312 MB'],
  ],
  made: ['访谈.srt', '12 KB'],
  surfaces: ['光标旁', '右键', '拖放', '命令条'],
  near: ['转换格式'],
  menu: ['打开', '打开方式'],
  drop: '拖到这里',
  query: '字幕',
  where: '本机',
  note: '界面示意 · 协议里的例子',
  label:
    '示意：「生成字幕」插件只声明接受音频视频、产出带时间的文字。打开开关，它同时出现在光标旁、右键菜单、拖放和命令条；点一下生成访谈.srt；关上开关，各处入口一起收起，做好的字幕还在。',
};

/** 分寸：工具出现多久，由你当下的需要决定 */
export const measure = {
  /** 原句 */
  title: later.paragraphs[1],
  mark: '你当下的需要',
  is: {
    label: '它会',
    items: [
      ['默认安静', '没有信号就不出现。'],
      ['只提议，不代劳', '决定在你手里。'],
      /** 后一句是原句 */
      ['没有 AI 也能用', small.paragraphs[1]],
    ],
  },
  not: {
    label: '它不是',
    /** 出自 molis-tool 设计纲领「它不是什么」，待负责人确认 */
    items: [
      '猜你想干什么、主动打断你的助手。',
      '常驻录屏、记住一切的后台。',
      '替你点按钮、代你发送的 Agent。',
    ],
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

/** 当前进展：摘自 4.2「当前进展」原句。页面上只用最后一句（收尾那屏）；「已有 / 还没有」负责人 2026-10-24 拿掉了 */
export const toolProgress = {
  have: [
    'Molis Tool 已有 Mac 开发版本，以及文字、文件、PDF、表格等本机处理能力。',
  ],
  notYet: [
    '跨应用交互、真实 AI 和系统服务仍在整合与验证，尚未公开提供安装包。',
    '它按独立产品推进，也计划成为 Molis Work 的基础能力，具体接入范围与时间尚未确定。',
  ],
};

export const toolGo = {
  follow: '关注 Molis Tool 的进展',
  work: '看看 Molis Work',
};
