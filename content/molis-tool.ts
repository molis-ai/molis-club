// Molis Tool 产品页文案，五个品牌方向共用。依据 molis-ai/molis-tool 的设计纲领（2026-09-28）、
// 路线图（10/4）和 v6 概念图板。现在是开发版，只有临时签名，没有公开安装包；
// 页面里的界面都来自概念图板，标「概念图」。

export const DROPAGENT_URL = 'https://github.com/molis-ai/DropAgent';
export const NIULAI_URL = 'https://github.com/molis-ai/niul.ai';

export const hero = {
  kicker: 'Molis Tool · 开发中',
  title: '光标在哪里，软件就在哪里。',
  lead: 'Mac 菜单栏里的一个工具。选中、拖动、框住，它在旁边给出对的一步，做完就消失。',
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
  label:
    'Molis Tool 界面示意：选中网页上的一句英文，光标旁出现翻译、解释、记下三个动作，翻译结果带着来源出现在旁边。',
};

export const shift = {
  kicker: '软件不必再是一个要去的地方',
  title: '能力来到光标旁，而不是人去找应用。',
  labels: { before: '以前', after: 'Molis Tool' },
  rows: [
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
  ],
};

export const layers = {
  kicker: '由近到远的三层',
  title: '离你越近，打扰越少。',
  items: [
    {
      title: '光标旁',
      text: '选区末端出现 1 到 3 个动作。',
      image: { src: '/images/edition-c/tool/near-cursor.jpg', w: 866, h: 631 },
    },
    {
      title: '身旁',
      text: '需要核对时，在旁边展开一张小卡。',
      image: { src: '/images/edition-c/tool/beside.jpg', w: 866, h: 631 },
    },
    {
      title: '离开以后',
      text: '⌥Space 叫出命令条，回来时停在你离开的地方。',
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
      text: '框住海报，整理成日程草稿。',
      image: {
        src: '/images/edition-c/tool/moment-poster.jpg',
        w: 665,
        h: 718,
      },
    },
    {
      title: '盯着一个网页',
      text: '价格或名额变了再告诉你。',
      image: { src: '/images/edition-c/tool/moment-watch.jpg', w: 665, h: 712 },
    },
    {
      title: '讨论变待办',
      text: '一段群聊整理出决定和待办。',
      image: { src: '/images/edition-c/tool/moment-chat.jpg', w: 663, h: 714 },
    },
    {
      title: '批量处理',
      text: '一组文件先预览再处理，可还原。',
      image: { src: '/images/edition-c/tool/moment-batch.jpg', w: 665, h: 712 },
    },
    {
      title: '等 Agent 干活',
      text: '不用盯着，需要你时再提醒。',
      image: { src: '/images/edition-c/tool/moment-agent.jpg', w: 665, h: 714 },
    },
    {
      title: '研究对比',
      text: '几份材料对齐成一张表。',
      image: {
        src: '/images/edition-c/tool/moment-research.jpg',
        w: 665,
        h: 718,
      },
    },
  ],
};

export const promises = {
  kicker: '四个承诺',
  title: '安静，克制，有出处。',
  items: [
    {
      title: '默认安静',
      text: '没有信号就不出现。',
    },
    {
      title: '只提议，不代劳',
      text: '决定在你手里。',
    },
    { title: '结果带着出处', text: '回得到原文。' },
    {
      title: '没有 AI 也能用',
      text: '数据留在你的 Mac 上。',
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
      text: '在副本上处理，原件不动。',
    },
    {
      title: 'Agent 动态与用量',
      from: '来自牛 niul.ai',
      text: '谁在忙、谁在等你，一眼看到。',
    },
    { title: '剪贴板', text: '历史记录可选。' },
    { title: '随手记', text: '便签、提醒、归档。' },
    { title: '文字工具', text: '清理、格式化、统计。' },
    { title: '行情', text: '阈值提醒，默认不联网。' },
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
  text: '每个能力登记一次，就出现在光标旁、右键、拖放和命令条里。',
  surfaces: ['光标旁', '右键', '拖放', '命令条'],
  core: '一个能力',
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

/** 三层与「一天里的几个时刻」的画面都来自 v6 概念图板 */
export const boardNote = '概念图 · 来自 Molis Tool v6 设计图板，示例数据';
