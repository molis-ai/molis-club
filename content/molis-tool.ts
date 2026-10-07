// Molis Tool 产品页文案，五个品牌方向共用。依据 molis-ai/molis-tool 的设计纲领（2026-09-28）、
// 路线图（10/4）和 v6 概念图板。现在是开发版，只有临时签名，没有公开安装包；
// 页面里的界面都来自概念图板，标「概念图」。

export const DROPAGENT_URL = 'https://github.com/molis-ai/DropAgent';
export const NIULAI_URL = 'https://github.com/molis-ai/niul.ai';

export const hero = {
  kicker: 'Molis Tool · 开发中',
  title: '光标在哪里，软件就在哪里。',
  lead: 'Molis Tool 是 Mac 菜单栏里的一个工具。你选中一段文字、拖动一个文件、框住一块屏幕，它认出那是什么，在旁边给出对的一步；做完就消失。',
  status: ['开发中', 'macOS 13+', '还没有公开安装包'],
  actions: { follow: '关注进展', try: '先试试 DropAgent' },
};

/** 首屏界面动画：网页上选中一句英文 → 动作签 → 带来源的小卡 */
export const demo = {
  url: 'notes.example.com/switching-cost',
  heading: 'Why switching tasks is tiring',
  before: 'Researchers call it ',
  selection: 'attention residue: part of your mind stays on the last task',
  after: ' even after you move on.',
  actions: ['翻译', '解释', '记下'],
  result: {
    label: '翻译',
    text: '注意力残留：换到新任务后，还有一部分心思停在上一件事上。',
    source: 'notes.example.com/switching-cost · 第 2 段',
  },
  note: '界面示意',
};

export const shift = {
  kicker: '软件不必再是一个要去的地方',
  title: '能力来到光标旁，而不是人去找应用。',
  labels: { before: '以前', after: 'Molis Tool' },
  rows: [
    { aspect: '基本单位', before: '一个个应用', after: '作用于对象的动作' },
    { aspect: '入口', before: '图标、菜单、窗口', after: '光标下的对象' },
    {
      aspect: '内容',
      before: '被搬进应用',
      after: '留在原处，只取选中的范围',
    },
    {
      aspect: '结果',
      before: '留在应用里',
      after: '回到原处，或成为下一步的对象',
    },
    { aspect: '要学什么', before: '功能在哪里', after: '几乎不用学' },
  ],
};

export const layers = {
  kicker: '由近到远的三层',
  title: '离你越近，打扰越少。',
  items: [
    {
      title: '光标旁',
      text: '选区末端出现 1 到 3 个动作；算式、单位直接给答案。',
      image: { src: '/images/edition-c/tool/near-cursor.jpg', w: 866, h: 631 },
    },
    {
      title: '身旁',
      text: '需要参数或核对时，在对象旁展开一张小卡，不切走应用。',
      image: { src: '/images/edition-c/tool/beside.jpg', w: 866, h: 631 },
    },
    {
      title: '离开以后',
      text: '按 ⌥Space 叫出命令条；交给后台的事、草稿和结果都在「接续」里，回来时停在你离开的地方。',
      image: { src: '/images/edition-c/tool/resume.jpg', w: 865, h: 631 },
    },
  ],
};

export const moments = {
  kicker: '一天里的几个时刻',
  title: '从出现，到回来。',
  items: [
    {
      title: '海报变日程',
      text: '框住一张活动海报，时间和地点整理成日程草稿，核对后再加进日历。',
      image: {
        src: '/images/edition-c/tool/moment-poster.jpg',
        w: 665,
        h: 718,
      },
    },
    {
      title: '盯着一个网页',
      text: '框住价格或名额那一块，变了再告诉你，附上前后对比。',
      image: { src: '/images/edition-c/tool/moment-watch.jpg', w: 665, h: 712 },
    },
    {
      title: '讨论变待办',
      text: '选中一段群聊，整理出决定和待办，每条带着原话。',
      image: { src: '/images/edition-c/tool/moment-chat.jpg', w: 663, h: 714 },
    },
    {
      title: '批量处理',
      text: '一组文件先预览再处理，可以还原；常用的步骤存成快捷动作。',
      image: { src: '/images/edition-c/tool/moment-batch.jpg', w: 665, h: 712 },
    },
    {
      title: '等 Agent 干活',
      text: 'AI 跑着的时候不用盯，需要你的时候再提醒。',
      image: { src: '/images/edition-c/tool/moment-agent.jpg', w: 665, h: 714 },
    },
    {
      title: '研究对比',
      text: '几份材料按维度对齐成一张表，每一格都能回到原文。',
      image: {
        src: '/images/edition-c/tool/moment-research.jpg',
        w: 665,
        h: 718,
      },
    },
  ],
};

export const compare = {
  kicker: '和你现在用的有什么不同',
  title: '看着你选中的东西，给出对的一步。',
  labels: { now: '你现在用', does: '它的做法', here: 'Molis Tool' },
  rows: [
    {
      now: '启动器和快捷指令',
      does: '你要记住命令',
      here: '看着你选中的东西给出动作',
    },
    {
      now: '聊天窗口',
      does: '你要把内容复制过去',
      here: '在原处做，结果带着出处回来',
    },
    {
      now: '替你点按钮的 Agent',
      does: '代你行动',
      here: '只提议，对外写入先给草稿',
    },
  ],
};

export const promises = {
  kicker: '四个承诺',
  title: '安静，克制，有出处。',
  items: [
    {
      title: '默认安静',
      text: '只回应选中、停顿、拖动和快捷键，没有信号就不出现。',
    },
    {
      title: '只提议，不代劳',
      text: '推荐不会自动执行，原件和最终决定在你手里。',
    },
    { title: '结果带着出处', text: '回得到原文的页码、时间点和网址。' },
    {
      title: '没有 AI 也能用',
      text: '本机能力不联网也能用，数据留在你的 Mac 上。',
    },
  ],
};

export const merged = {
  kicker: '合进来的工具',
  title: '常用的小工具，都住进同一个菜单栏。',
  items: [
    {
      title: '置物架',
      from: '来自 DropAgent',
      text: '把文件、网页、文字放上来，在副本上处理，原件不动。',
    },
    {
      title: 'Agent 动态与用量',
      from: '来自牛 niul.ai',
      text: '同时开着好几个 AI，谁在忙、谁在等你，一眼看到。',
    },
    { title: '剪贴板', text: '单次收取，历史记录可选。' },
    { title: '随手记', text: '便签、提醒、改期、归档。' },
    { title: '文字工具', text: '清理、格式化、编码、统计。' },
    { title: '行情', text: '指数与阈值提醒，联网默认关闭。' },
  ] as { title: string; from?: string; text: string }[],
  available: {
    label: 'DropAgent 和牛的独立版现在就能用：',
    links: [
      { name: 'DropAgent', href: DROPAGENT_URL },
      { name: 'niul.ai', href: NIULAI_URL },
    ],
  },
};

export const plugins = {
  kicker: '插件就是能力',
  title: '登记一次，处处可用。',
  text: '每个能力只登记一次，就会同时出现在光标旁、右键、拖放和命令条里；停用时处处一起消失。目前有 12 个官方能力包。',
  surfaces: ['光标旁', '右键', '拖放', '命令条'],
};

export const notThis = {
  kicker: '它不是什么',
  items: [
    '不是猜你想干什么、主动打断你的助手。',
    '不是又一个聊天窗口。',
    '不是常驻录屏、记住一切的后台。',
    '不是替你点按钮、代你发送的 Agent。',
  ],
};

export const closing = {
  title: '在对的时刻、对的位置，给出对的一步。',
  follow: '关注 Molis Tool 的进展',
  try: '先试试 DropAgent',
  home: '回到 Molis AI',
};
