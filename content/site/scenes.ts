// 演示画面里的字（从 app/_site/scenes/*.tsx 里拿出来，好放两种语言）。英文在 content/site/en/scenes.ts，形状一致。
// 画面一律是示意：画面里的项目、资料、人名、数字、时间都是示意数据，不代表已上线的功能。
// 目前收了 Work 的全部八段（首页舞台与 Work 页共用）和首页舞台上另外四件产品各一段；
// 其余产品页的画面随各页翻英文时再拿出来。

/** Molis Work：一份「行业观察报告」走三天 */
export const workScene = {
  project: '行业观察报告',
  tools: {
    files: '资料',
    feed: '信息流',
    doc: '文档',
    table: '数据表',
    deck: '汇报',
    talk: '讨论',
    calendar: '日历',
    notes: '笔记',
    todo: '待办',
  },
  personal: '个人',
  /** 首页舞台上五段的标题与阶段标注 */
  home: {
    together: '你和 AI，接着同一份内容工作。',
    relay: '助理调用几个插件，把事情接着做完。',
    grow: '工作台也可以长出你自己的工具。',
    growTag: '预览',
    talk: '一起讨论，上下文和成果都接得上。',
    talkTag: '首版已实现 · 未公开部署',
    away: '你不在的时候，助理接着干。',
    awayTag: '开发中',
  },
  scatter: {
    label:
      'Molis Work 示意：浏览器标签、聊天、文档、待办里的碎片，收拢进同一个项目。',
    note: '界面示意',
    bits: {
      tab: '3 个浏览器标签 · 行业新闻',
      chat: '聊天里的一句：「周四前给初稿」',
      doc: '报告草稿 v2.docx',
      ai: '昨天的 AI 会话',
      todo: '待办：补三家对比',
    },
    gathered: {
      feed: '信息流 · 3 个来源',
      doc: '文档 · 报告草稿',
      todo: '待办 · 补三家对比 · 周四',
      ai: '会话记录 · 接着昨天',
    },
  },
  arrange: {
    label:
      'Molis Work 示意：给项目装上资料、信息流和文档；个人的日历、笔记、待办始终都在；搜一个词，各工具里的结果一起出来。',
    note: '界面示意',
    crumb: '项目 · 布置工具',
    shelf: '为这段工作选工具',
    mine: '日历、笔记、待办是你个人的，换项目也跟着你。',
    term: '储能',
    /** 搜索结果：前半 + 搜的词（加粗）+ 后半，来自哪个工具 */
    results: [
      { before: '', after: '出货量季度数据', from: '信息流' },
      { before: '第二节 · ', after: '价格走势', from: '文档' },
      { before: '访谈笔记：', after: '客户', from: '笔记' },
    ],
  },
  together: {
    label:
      'Molis Work 示意：写到一半的方案，助理接着当前内容整理提纲，改动高亮；你点「接手」，自己改一句。',
    note: '界面示意',
    crumb: '文档 · 行业观察报告',
    title: '行业观察报告（草稿）',
    assistant: '助理',
    outlined: '按当前内容整理了提纲',
    outline: ['一、今年市场的三个变化', '二、三家公司的做法对比', '三、建议'],
    mine: '三、我们的判断：先看价格，再看渠道',
    changed: '你改了这一句',
    take: '接手',
    editing: '现在由你编辑 · 助理的改动都留着',
  },
  relay: {
    label:
      'Molis Work 示意：助理从信息流取三篇资料，在数据表里做成对比，再生成一页汇报，三样成果带着来源落进项目。',
    labelMore:
      'Molis Work 示意：信息流、数据表、汇报接力做完，再在日历上约评审、在待办里留跟进；成果都在项目里，都有来源。',
    note: '界面示意',
    crumb: '助理 · 接着做完',
    feed: ['A 公司季报', 'B 公司发布会', 'C 行业报告'],
    table: [
      ['', '价格', '渠道'],
      ['A', '↓', '线上'],
      ['B', '→', '经销'],
      ['C', '↑', '直营'],
    ],
    slide: { page: '第 2 页', title: '三家对比' },
    results: ['资料摘录 3 篇', '对比表 1 张', '汇报 1 页'],
    sourced: '来源已附',
    tableToDeck: '数据表 → 汇报',
    event: { when: '周四 15:00', what: '报告评审' },
    followUp: { when: '评审后', what: '补上 D 公司的数据' },
    proof: '五样成果都在「行业观察报告」里，每一样都能点回来源。',
  },
  grow: {
    label:
      'Molis Work 示意：你说一句需要，一个插件被做出来、过检查，装进工作台成为一块界面，助理也能用它。插件创作台还在预览。',
    note: '预览 · 界面示意',
    crumb: '插件创作台',
    tool: '评审记录表',
    fresh: '新',
    you: '你',
    ask: '做一张评审记录表：按人记意见，标出要改的地方。',
    plugin: '插件',
    checks: ['Agent 给出方案', '在沙箱里做出来', '检查与验收通过'],
    done: '已装进项目 · 助理和获授权的 Agent 也能调用它',
  },
  talk: {
    label:
      'Molis Work 示意：右侧「讨论」里，同事引用那页汇报开了一个话题；结论回到项目，谁接着做都看得到前因后果。',
    note: '界面示意',
    crumb: '汇报 · 第 2 页',
    thread: '讨论',
    /** 头像里的一个字：同事、你 */
    them: '周',
    me: '你',
    quote: '汇报 · 第 2 页「三家对比」',
    question: '价格这一列，要不要放进正式结论？',
    topic: '话题 · 价格要不要进结论',
    reply: '放，周四评审前补上 D 公司。',
    conclusion: { label: '结论', text: '价格进结论，评审前补 D 公司' },
    proof: '结论回到项目：谁接着做，都看得到这个话题和那一页。',
  },
  goal: {
    label:
      'Molis Work 示意：Goal 记着目标、进展、问题和待决定的事；换成 Codex 或 Claude Code，也读同一份记录接着做；收尾时逐条核对。',
    note: '界面示意',
    crumb: 'Goal · 周四交付报告初稿',
    aim: { term: '目标', text: '周四交付报告初稿，三家对比要有来源' },
    progress: { term: '进展', text: '第一、二节完成；第三节写了一半' },
    problem: { term: '问题', text: 'C 公司的数据口径和另两家不同' },
    open: { term: '待决定', text: '价格要不要进结论', chip: '等你' },
    agent: {
      before: '换到 ',
      name: 'Claude Code',
      after: '：读同一份记录，从第三节接着写',
    },
    checks: ['三家对比都有来源', '结论与周四的要求一致', 'C 公司口径待你确认'],
  },
  away: {
    label:
      'Molis Work 示意：你下线以后，助理按 Goal 跟进到期的事；第二天只把需要你决定的一件留在 Inbox，写明原因。主动跟进还在开发中。',
    note: '开发中 · 界面示意',
    off: '你已下线 · 22:40',
    quiet: '勿扰时段不发提醒',
    log: [
      { text: '23:10 跟进到期：C 公司更新了数据', small: '已写进第三节草稿' },
      { text: '02:30 导出失败一次', small: '已重试成功，留了记录' },
      {
        text: '07:00 D 公司昨晚发布了新版本',
        small: '要不要加进报告，需要你定',
      },
    ],
    inbox: 'Inbox · 第二天 9:00',
    waiting: '1 件等你决定',
    question: '要不要把 D 公司加进报告？',
    why: '原因：它昨晚发布了新版本，会影响第二节的结论。其余两件已处理，记录在 Goal 里。',
    yes: '加进去',
    no: '先不加',
  },
};

/** Molis Tool 首页 case：选中一段活动信息，整理成日程草稿 */
export const toolCase = {
  label:
    'Molis Tool 界面示意：在网页上选中一段活动信息，光标旁弹出动作条，选「整理成日程」，得到一份日程草稿，加入日历前由你确认。',
  note: '界面示意',
  url: 'riverside-market.example · 活动',
  title: '秋日市集',
  /** 网页正文：前半 + 选中的一段 + 后半 */
  before: '今年的市集搬到了江边。',
  selected: '10 月 26 日（周日）14:00—17:00，滨江公园东门草坪',
  after: '，带上自己的杯子，有手作、旧书和一支乐队。',
  actions: {
    event: '整理成日程',
    translate: '翻译',
    plain: '纯文本',
    copy: '复制',
  },
  draft: '日程草稿',
  byAi: 'AI 整理',
  fields: {
    title: { term: '标题', text: '秋日市集' },
    time: { term: '时间', text: '10 月 26 日 周日 14:00—17:00' },
    place: { term: '地点', text: '滨江公园东门草坪' },
    source: { term: '来源', text: '网页里选中的这一段' },
  },
  add: '加入日历',
  confirm: '加入前由你确认',
};

/** Molis Life 首页 case：「想陪妈妈去看海」等到了半天空闲 */
export const lifeCase = {
  label:
    'Molis Life 原型示意：「想陪妈妈去看海」先留着；这周六下午空出来，它带着为什么此刻想到冒出来，给出近一点和多走一段两种准备，去不去由你决定。',
  note: '原型示意',
  wish: '“想陪妈妈去看海。”',
  kept: '先留着',
  when: '三周前留下',
  days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  free: '这周六下午，空出了半天',
  why: {
    title: '为什么此刻想到',
    text: '这周六下午空着；天气预报是晴天；去海边四十分钟。',
  },
  plans: [
    { title: '近一点', time: '两个小时', text: '城东海堤走一走，回来一起吃晚饭。' },
    { title: '多走一段', time: '半天', text: '去南湾看日落，给妈妈带一件外套。' },
  ],
  decide: '去不去、去哪一个，由你来定',
};

/** Molis Story 首页 case（彼处）：从一个「如果」走进一本书，归来时写下一句话 */
export const storyCase = {
  label:
    'Molis Story 界面示意：彼处从一个「如果」开始，走进一本逐章展开的书；归来时写下一句自己的话，落进「此处」带回来的东西里。',
  note: '界面示意',
  world: '彼处 · 活一次另一个你',
  whatIf: '如果那年，我去了海边那所学校……',
  chapters: [
    { title: '第一章', text: '海风把校门口的旗子吹得很响。' },
    { title: '第二章', text: '你开始习惯早上去码头。' },
    { title: '第三章', text: '有一封信，一直没有寄出去。' },
  ],
  back: '归来 · 为这次经历写一句话',
  line: '原来我一直想离海近一点。',
  here: '此处 · 带回来的',
  kept: [
    { world: '彼处', thing: '“原来我一直想离海近一点。”' },
    { world: '袖珍博物馆', thing: '一本春天的纪念册' },
    { world: '云海来客', thing: '一段还没读懂的信号' },
  ],
};

/** Molis World 首页 case：常去的面馆放进小岛 */
export const worldCase = {
  label:
    'Molis World 概念示意：把常去的面馆放进自己的小岛；后厨的门通向另一座城；走过那段经历，把一枚纪念物带回来，摆在面馆旁边。',
  note: '概念示意',
  title: '我的世界 · 草图',
  shop: '巷口那家面馆',
  door: '后厨的门',
  gift: '带回来的纸灯笼',
  far: '另一座城',
  farNote: '一个故事里',
  foot: '过些日子再看到它：这个周末，真的去吃一次吧。',
};
