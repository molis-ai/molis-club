// Molis Life 产品页文案，五个品牌方向共用。依据 molis-ai/molis-life 的产品设计（2026-09-27）
// 与生活空间概念稿。Life 现在是本地原型，真实模型和外部服务都没接通：状态条始终可见，
// 接入类的能力标「规划中」，页面里的例子都是示意。

export const hero = {
  kicker: 'Molis Life · 原型探索中',
  title: '把琐事交代出去，把时间留给喜欢的生活。',
  lead: '你随口交代一句、分享一张截图，Molis Life 接住、记着，在合适的时候提醒、建议，陪你把想做的事做成。',
  status: ['原型探索', '还不能下载', '页面里的例子都是示意'],
  actions: { follow: '关注进展', more: '看看它怎么帮你' },
  shotNote: '概念稿 · 示例生活，服务未接入',
};

export const jobs = {
  kicker: '它替你接住的三件事',
  title: '琐事有人跟进，想做的事有人记得。',
  items: [
    {
      title: '把琐事托付出去',
      quote: '「这件衣服要退，帮我跟进。」',
      text: '申请、寄出、退款，一路更新在同一件事上。没有拿到回执，就不会说钱已经到账。',
    },
    {
      title: '让想做的事发生',
      quote: '「想陪妈妈去看海。」',
      text: '等日历空出来、天气也好，它会告诉你「为什么现在想到」，给两三个照顾到她体力和预算的方案。',
    },
    {
      title: '接住好奇心',
      quote: '一张椅子的照片、一页书、路边一株植物。',
      text: '可以只存下，也可以问「我为什么喜欢它」，再找一个小小的尝试。',
    },
  ],
};

export const handoff = {
  kicker: '怎么交代给它',
  title: '说一句，或者分享一下。',
  entriesLabel: '四个入口',
  entries: [
    { title: '随口说一句' },
    { title: '分享截图和文件' },
    { title: '从常用的聊天软件发给它', tag: '规划中' },
    { title: '授权邮箱、日历等来源', tag: '规划中' },
  ] as { title: string; tag?: string }[],
  intentsLabel: '三种意图',
  intents: ['替我处理', '一起想想', '先留着'],
  note: '存下来的东西不会自动变成任务，也不会自动拿去做推荐。',
};

export const compare = {
  kicker: '和你现在用的有什么不同',
  title: '不只是记下，是跟进到有结果。',
  labels: { now: '你现在用', does: '它做到哪', here: 'Molis Life' },
  rows: [
    {
      now: '待办和日历',
      does: '记下事情，到点提醒',
      here: '跟进到有结果，每一步更新在同一件事上',
    },
    {
      now: '聊天助手',
      does: '等你开口，聊完就忘',
      here: '条件变了会先想到，并说明为什么是现在',
    },
    {
      now: '推荐和信息流',
      does: '让你多看、多买',
      here: '不制造需要，也不把生活变成绩效',
    },
  ],
};

export const scenes = {
  kicker: '生活的八个场景',
  title: '场景由插件组成，你选开哪些。',
  note: '这是方向，不是首发清单。',
  items: [
    { title: '个人事务', text: '退换货、缴费、续订、证件' },
    { title: '家与日常', text: '食物、整理、维修' },
    { title: '身体与节奏', text: '活动、睡眠、休息' },
    { title: '家人和关系', text: '陪伴、礼物、照护' },
    { title: '出行与探索', text: '通勤、短途、周末去哪' },
    { title: '兴趣与品味', text: '阅读、音乐、影像、穿搭' },
    { title: '好奇与学习', text: '临时的疑问、想学的手艺' },
    { title: '人生阶段', text: '搬家、养宠、育儿、退休' },
  ],
};

export const control = {
  kicker: '决定权在你',
  title: '它准备，你决定。',
  items: [
    '关注一个场景，不等于授权你的账号。',
    '接受一个建议，只进入准备：不会自动付款、预约，也不会替你给别人发消息。',
    '「以后再说」只是延后，愿望还在。',
    '没有打卡，没有评分。安静时段和主动程度，由你来定。',
  ],
};

export const devices = {
  kicker: '手机和电脑',
  title: '出门看一眼，坐下来慢慢想。',
  items: [
    { title: '手机', text: '拍下来、说一句、出门时看一眼。' },
    { title: '电脑', text: '慢慢比较方案、整理来源、管理场景。' },
    {
      title: '两端接着做',
      text: '同一件事，在手机和电脑上接着做。',
      tag: '规划中',
    },
  ] as { title: string; text: string; tag?: string }[],
};

export const merged = {
  kicker: '会合进来的',
  title: '已有的小产品，会变成 Life 的场景。',
  items: [
    {
      title: 'Seentoo · 见过 → 散步与看见',
      text: '一张可以忽略的散步邀请。出门走走，写下看见的东西，留给自己回看。',
    },
    {
      title: '首批场景插件',
      text: '事务跟进、新体验、账单、当地活动、重要日子、阅读、音乐、购物。',
    },
    {
      title: '和 Molis Work 同一套插件思路',
      text: '新的生活场景可以一块块长出来。',
    },
  ],
};

export const closing = {
  title: '日子慢一点，喜欢的事多一点。',
  follow: '关注 Molis Life 的进展',
  home: '回到 Molis AI',
};
