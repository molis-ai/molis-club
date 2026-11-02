// Molis Tool 页（2026-11-02 改成 Work 页第三轮的形态）：一块 Mac 屏幕从头到尾不离场，屏幕上过完周五一天（早上、午后、傍晚）。
// 四屏按读者的问题排：是什么（首屏翻译一句）→ 怎么用（4.2 开头那三件小事，做完收进「接续」，回来接着做）
// → 为什么不用我现在的（以前要换应用、搬材料；现在从你正在处理的内容开始）→ 怎么开始（一封信）。
// 标了「原句」的取自 docs/studio-intro.md 4.2（toolQuoted 由 tests/site-copy.test.mjs 逐句核对）；
// 屏幕里的网页、笔记、报价、邮件、文件、时间都是示例数据，界面都是示意。

import { products } from './products';

const tool = products.tool;
const [small, chain, later] = tool.sections;
/** 4.2 开头那句原句，按分号拆成三件事（拼回去一字不差） */
const [readText, getPdf, seeEvent] = tool.opening[0]
  .replace(/。$/, '')
  .split('；');
/** 4.2 第三段原句的两句：前一句是第三屏的标题，后一句贴在第三屏第一拍旁边 */
const [startFrom, findNext] = tool.opening[2].split(/(?<=。)/);

/** Mac 桌面的壁纸：莫奈的伦敦，早上、午后、傍晚三张（负责人 2026-10-24 选） */
export type Wall = 'morning' | 'noon' | 'dusk';

export type ToolBeatId = 'u1' | 'u2' | 'u3' | 'u4' | 'c1' | 'c2' | 'c3';

export const toolHero = {
  form: tool.form,
  stage: tool.stage,
  title: tool.headline,
  what: tool.what,
  go: '关注 Molis Tool 的进展',
  /** 首屏右边：整页都能选中（键盘、触屏用按钮代选） */
  hint: '这一页上的任意一句话，都可以选中。',
  pick: '选中上面这句',
  label:
    '界面示意：一块 Mac 屏幕。在网页上选中一句英文，选区末端出现翻译、解释、记下三个动作；点翻译，译文和出处出现在旁边。往下是同一块屏幕上的一天：清理一段文字、从 PDF 里取出几页、把活动整理成日程草稿收进「接续」，再把三行报价整理成表格、排序，最后装上一个插件。',
};

/** 怎么用：三件小事各一拍，第四拍是收进「接续」的东西回来还在 */
export const toolUse = {
  /** 原句 */
  title: small.title,
  notes: {
    u1: readText,
    u2: getPdf,
    u3: seeEvent,
    /** 原句 */
    u4: later.title,
  } satisfies Partial<Record<ToolBeatId, string>>,
  /** 原句：日程草稿还在打磨，挂在那一拍的标注下面 */
  wip: chain.paragraphs[1],
};

/** 为什么不用我现在的：以前那条路（换应用、搬材料、找功能、带回来），和现在从内容开始的三拍 */
export const toolWhy = {
  /** 原句 */
  title: startFrom,
  before: {
    label: '以前',
    /** 把三行报价变成表格，以前要走的四步（和下面那句原句是同一件事） */
    steps: [
      { app: 'sheet', text: '打开「表格」' },
      { app: 'notes', text: '复制三行，贴进表格' },
      { app: 'sheet', text: '在「数据」里找「分列…」' },
      { app: 'notes', text: '把表格贴回笔记' },
    ] as { app: 'sheet' | 'notes'; text: string }[],
    /** 原句 */
    text: tool.opening[1],
  },
  notes: {
    /** 原句 */
    c1: findNext,
    /** 原句 */
    c2: chain.title,
    /** Folio 版，出自 molis-tool 插件协议 */
    c3: '登记一次，处处可用。',
  } satisfies Partial<Record<ToolBeatId, string>>,
  /** 原句：收尾那一行 */
  coda: later.paragraphs[1],
};

/** 第三屏最后一拍：访客能亲手拨的插件开关（关上以后各处入口一起收起，做好的字幕还在） */
export const toolPlug = {
  name: '生成字幕',
  spec: '音频、视频 → 带时间的文字 · 本机',
  you: '你',
};

/** 怎么开始：一封信 */
export const toolEnd = {
  /** 原句 */
  belief: tool.fit,
  /** 原句 */
  text: tool.progress[1],
  work: '看看 Molis Work',
  ask: {
    from: '来自 Molis 团队',
    question: '还在开发中，要不要先关注进展？',
  },
  /** 原句 */
  own: small.paragraphs[1],
};

/** 屏幕里的东西：都是示例数据 */
export const toolDesk = {
  foot: '界面示意 · 示例数据',
  wip: '正在打磨',
  apps: {
    browser: '浏览器',
    notes: '笔记',
    finder: '文件',
    mail: '邮件',
  },
  menus: {
    browser: ['文件', '编辑', '显示', '历史记录', '书签'],
    notes: ['文件', '编辑', '格式', '显示', '窗口'],
    finder: ['文件', '编辑', '显示', '前往', '窗口'],
    mail: ['文件', '编辑', '显示', '邮箱', '信息'],
  },
  /** 首屏：早上读一篇英文网页，划出一句，翻译出现在旁边 */
  page: {
    url: 'notes.example.com/switching-cost',
    heading: 'Why switching tasks is tiring',
    intro: 'Researchers have a name for it.',
    select: 'Attention residue: part of your mind stays on the last task',
    rest: ' even after you move on.',
    more: 'It fades with time, but every switch adds a little more. A day of small detours leaves less room for the work in front of you.',
    heading2: 'What helps',
    text2:
      'Finish small things where they start. Keep the rest within reach, so picking it up later costs less.',
    chips: ['翻译', '解释', '记下'],
    card: '翻译',
    result: '注意力残留：一部分心思还停在上一件事上，哪怕你已经换到下一件。',
    source: 'notes.example.com · 第 2 段',
    copy: '复制',
  },
  notes: {
    list: [
      ['周会', '09:10'],
      ['三家报价', '08:52'],
      ['读书摘记', '周一'],
    ],
    meet: {
      title: '周会',
      meta: '10月23日 周五 09:10',
      before: '从群里转来的通知：',
      /** 格式乱掉的一句：片段之间多出来的空格，清理时收拢 */
      messy: ['会议改到', '周四', '下午三点，', '地点：', '二楼小会议室'],
      after: '记得带上季度的数字。',
      chips: ['清理格式', '翻译', '复制纯文本'],
      done: '已清理 · 本机',
    },
    quote: {
      title: '三家报价',
      meta: '10月23日 周五 08:52',
      lines: ['甲：2.40 元 × 5000', '乙：2.15 元 × 5000', '丙：2.60 元 × 3000'],
      chips: ['整理成表格', '复制纯文本'],
      head: ['供应商', '单价（元）', '数量'],
      rows: [
        ['甲', '2.40', '5000'],
        ['乙', '2.15', '5000'],
        ['丙', '2.60', '3000'],
      ],
      /** 排序以后每一行挪几格（按单价从低到高：乙、甲、丙） */
      moves: [1, -1, 0],
      next: ['按单价排序', '导出 CSV'],
      done: '已排序 · 本机',
    },
  },
  finder: {
    folder: '下载',
    files: [
      { name: '报价.pdf', kind: 'PDF' },
      { name: '封面.png', kind: 'PNG' },
      { name: '合同.docx', kind: 'DOCX' },
      { name: '访谈.m4a', kind: 'M4A' },
    ],
    pdf: {
      chips: ['取出几页', '压缩'],
      card: '取出几页',
      /** 报价.pdf 的六页：每页一个小标题（缩略图里的样子） */
      pages: ['报价单', '一、印刷', '二、装订', '三、运输', '付款方式', '附：纸样'],
      picked: [1, 2, 3],
      range: '第 2–4 页 · 3 页',
      cancel: '取消',
      save: '另存一份',
      copy: '报价（第 2–4 页）.pdf',
      done: '已另存 · 原件不动',
    },
    srt: '访谈.srt',
    audioChips: ['转换格式'],
  },
  mail: {
    from: '滨江社区',
    subject: '秋日市集，这周日开市',
    to: '收件人：我',
    hello: '大家好：',
    select: '10 月 25 日（周日）下午两点',
    rest: '，秋日市集在滨江公园东门草坪开市。',
    tail: '带上自己的杯子；有手作、旧书和一支乐队。',
    chips: ['整理成日程', '翻译'],
    card: '日程草稿',
    fields: [
      ['标题', '秋日市集'],
      ['时间', '10/25 周日 14:00'],
      ['地点', '滨江公园东门草坪'],
    ],
    cancel: '取消',
    stow: '收进接续',
  },
  later: {
    title: '接续',
    tabs: ['全部', '需要你', '进行中', '可取', '草稿', '材料'],
    rows: [
      { name: '秋日市集 · 日程草稿', meta: '来自邮件 · 18:40', state: '等你确认' },
      { name: '会议改到周四下午三点…', meta: '来自笔记 · 09:12', state: '已清理' },
      { name: '报价（第 2–4 页）.pdf', meta: '来自文件 · 14:30', state: '副本' },
    ],
    confirm: '确认',
    edit: '改一下',
    /** 访客在这一页用过动作条的话，排在最上面（只在当前标签页的内存里） */
    mine: '刚才',
    mineFrom: '来自这一页',
  },
  /** ⌥⌘空格 叫出的命令条 */
  command: {
    keys: '⌥⌘ Space',
    query: '字幕',
    hit: '访谈.m4a → 带时间的文字',
    where: '本机',
  },
};

/** 页面上用到的 4.2 原句（tests/site-copy.test.mjs 逐句核对） */
export const toolQuoted = [
  toolHero.title,
  toolHero.what,
  readText,
  getPdf,
  seeEvent,
  toolUse.title,
  toolUse.notes.u4,
  toolUse.wip,
  toolWhy.title,
  toolWhy.before.text,
  toolWhy.notes.c1,
  toolWhy.notes.c2,
  toolWhy.coda,
  toolEnd.belief,
  toolEnd.text,
  toolEnd.own,
];

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

/** 当前进展：摘自 4.2「当前进展」原句。页面上只用最后一句（收尾那封信）；「已有 / 还没有」负责人 2026-10-24 拿掉了 */
export const toolProgress = {
  have: [
    'Molis Tool 已有 Mac 开发版本，以及文字、文件、PDF、表格等本机处理能力。',
  ],
  notYet: [
    '跨应用交互、真实 AI 和系统服务仍在整合与验证，尚未公开提供安装包。',
    '它按独立产品推进，也计划成为 Molis Work 的基础能力，具体接入范围与时间尚未确定。',
  ],
};
