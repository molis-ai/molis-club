// Molis Tool 页：最轻的一页（specs/site-rebuild/tool-page.md）。
// 首屏是窗前一张可以选中的纸；往下是「一面白墙」：一个下午五站，每站一件放大的样品，选中色像那道光铺过去；
// 最后一屏收尾。标题与加粗句取自 docs/studio-intro.md 4.2（原句）；样品里的材料、提示与示意结果是新写。
// 纸上的活动、报价、照片说明都是示例数据。

import { products } from './products';

const tool = products.tool;
const [small, chain, later] = tool.sections;

/** 首屏：窗前那张纸。三种内容，选哪段出哪种动作（新写，示例） */
export const paper = {
  note: '示例',
  title: '秋日市集',
  when: '10 月 26 日（周日）14:00—17:00',
  place: '滨江公园东门草坪',
  english: 'Bring your own cup. Handmade goods, old books and a band.',
  prices: '摊位：手作 80 元，旧书 50 元，饮品 120 元',
  hint: '选中右边纸上的任意一段试试。',
  /** 键盘与触屏：一键选中时间这一行 */
  pick: '选中时间这一行',
  turn: '换你来：选中这一页上的任意一句话。',
  draft: {
    head: '日程草稿',
    tag: 'AI 整理',
    rows: [
      ['标题', '秋日市集'],
      ['时间', '10 月 26 日 周日 14:00—17:00'],
      ['地点', '滨江公园东门草坪'],
      ['来源', '纸上选中的这一段'],
    ],
    add: '加入日历',
    confirm: '加入前由你确认',
    note: '界面示意 · 正在打磨的场景',
  },
  label:
    '示意：在纸上选中时间地点这一行，光标旁出现动作条，第一个是「整理成日程」，旁边出现一份日程草稿，加入日历前由你确认。',
};

/** 一面白墙：一个下午的五站。时间是叙事用的，画面与材料都是示意 */
export const wall = {
  title: '一个下午，手边冒出的几件小事',
  note: '界面示意 · 示例数据',
  oldWay: {
    time: '下午 2:10',
    title: tool.opening[1],
    line: 'Molis Tool 从你正在处理的内容开始。',
    /** 格式乱掉的一句：词与词之间多出来的空格，清理时收拢 */
    messy: ['会议改到', '周四', '下午三点', '，地点：', '二楼小会议室'],
    stepsLabel: '老路',
    steps: ['打开应用', '搬运材料', '找功能', '带回来'],
    action: '清理格式',
    done: '一步，结果留在原处',
  },
  small: {
    time: '下午 2:40',
    title: small.title,
    line: small.paragraphs[1],
    pdf: {
      name: '报价.pdf',
      pages: 6,
      copy: '报价 · 第 2–4 页',
      kept: '原件保留',
      action: '取出这几页',
    },
    photo: {
      action: '写一句说明',
      caption: '白墙上，一道午后的天光。',
    },
  },
  chain: {
    time: '下午 3:15',
    title: chain.title,
    line: '从文档中提取的文字，可以继续整理；处理后的表格，可以继续比较或导出。',
    more: chain.paragraphs[1],
    /** 从第 2–4 页取出的文字（示例） */
    text: [
      '甲：单价 2.40 元，5000 个',
      '乙：单价 2.15 元，5000 个',
      '丙：单价 2.60 元，3000 个',
    ],
    from: '报价.pdf 第 2–4 页',
    toTable: '整理成表格',
    table: {
      head: ['', '单价（元）', '数量'],
      rows: [
        ['甲', '2.40', '5000'],
        ['乙', '2.15', '5000'],
        ['丙', '2.60', '3000'],
      ],
    },
    out: ['比较三家', '导出 CSV'],
  },
  later: {
    time: '下午 4:30',
    title: later.title,
    line: '材料、草稿和处理结果留在“接续”里，回来时仍能找到，并回看它们来自哪里。',
    clock: '16:30',
    panel: '接续',
    items: [
      {
        kind: '结果',
        name: '三家报价对比',
        from: '来自 报价.pdf 第 2–4 页（原件保留）',
      },
      {
        kind: '草稿',
        name: '秋日市集 · 日程草稿',
        from: '来自 一则活动通知里选中的一段',
      },
      { kind: '结果', name: '照片说明', from: '来自 一张照片' },
    ],
    /** 访客在这一页做过的事（只在当前标签页的内存里） */
    mine: '刚才',
    mineFrom: '来自 这一页上你选中的一段',
  },
  end: {
    title: later.paragraphs[1],
    kicker: '它不是',
    /** 出自 molis-tool 设计纲领「它不是什么」，待负责人确认 */
    not: [
      '猜你想干什么、主动打断你的助手。',
      '又一个聊天窗口。',
      '常驻录屏、记住一切的后台。',
      '替你点按钮、代你发送的 Agent。',
    ],
  },
};

/** 整页的动作条：选中的内容不同，第一个动作不同（新写） */
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
