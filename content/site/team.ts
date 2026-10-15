// 团队页「认识我们」＝「关于」展厅 01（主题：人）：开场 · 八个人 · 来时路 · 黑客与画家 · 想做的事 · 找同类。
// team、members 里的句子全部摘自 docs/studio-intro.md 第 7 章（2026-10-15 版），原句不改写；
// 其余几屏的原句直接读 studio.ts、along.ts，新写的界面文字（图注、小标签、几个数字的说明）都放在 teamUi。
// 顺序按第 7 章：王一骏（发起人），徐晶、赵壮实、谢俊、杨鹏飞、庄昊哲、隋欣怡、靳曲（联合创始人）。
// 「待补」「待本人补充」只是编辑占位，不上官网：这里直接不收，页面上对应的那一块不出现
// （徐晶、杨鹏飞没有个性标签；杨鹏飞只显示名字与身份）。
// 个性标签是成员的玩笑自述，不作正式职务或职业排名；页面上标「自述」，签名标「签名」。
// 不放头像：插画头像不是本人照片，团队真人照片未定。展厅里的照片来自 Unsplash，展厅末尾写明画面里的人不是团队成员。

export type MemberId =
  | 'yijun'
  | 'xujing'
  | 'zhuangshi'
  | 'xiejun'
  | 'pengfei'
  | 'haozhe'
  | 'xinyi'
  | 'jinqu';

export type Member = {
  /** 页内锚点（/team#yijun），企业合作页 5.5 也可以链过来 */
  id: MemberId;
  name: string;
  role: '发起人' | '联合创始人';
  /** 方向 */
  focus?: string;
  /** 经历 */
  experience?: string;
  /** 个性标签：第 7 章原文一整句（分号分隔），页面上按分号拆成一行一个 */
  tags?: string;
  /** 赵壮实的签名摘句（第 7 章原文） */
  motto?: string;
  /**
   * 名牌正面露出的一句：从本人的个性标签或签名里挑一句（原文片段），其余点开「经历」再看。
   * 隋欣怡（1/2）与靳曲（2/2）在网格里并排，笑点自己成立。
   */
  front?: string;
};

export const team = {
  title: '一群同类，一起创造。',
  lead: '做这些产品的，是下面这群人。我们带来各自在业务策略、数据科学、产品与工程中的经验，也带着自己的兴趣和表达方式。认真介绍擅长的事，也留下一点生活里的自己。',
};

export const members: Member[] = [
  {
    id: 'yijun',
    name: '王一骏',
    role: '发起人',
    focus: '系统架构、产品与技术管理',
    experience:
      '曾在美团、字节、滴滴、LinkedIn 及硅谷创业公司的核心研发团队负责架构与管理，拥有多年复杂系统建设与技术管理经验，也在山禾、DataFun 分享实践。',
    tags: '一个幻想家；首席吹牛官；首席心态崩盘官；首席 Token 官。',
    front: '一个幻想家',
  },
  {
    id: 'xujing',
    name: '徐晶',
    role: '联合创始人',
    focus: '业务策略、数据科学与 AI 应用',
    experience:
      '前美团、小红书、英语流利说和 Teambition 资深数据科学家。擅长从业务目标出发识别机会，将数据洞察转化为增长策略与产品方案，推动落地并取得业务结果。',
  },
  {
    id: 'zhuangshi',
    name: '赵壮实',
    role: '联合创始人',
    focus: 'AI 数据产品与复杂业务设计',
    experience:
      '复旦大学中文系，曾任字节、美团核心团队 AI 数据产品资深专家。《基于抖音数据管理及功能拓展》软著作者，关注数据产品与复杂业务设计，也在 DataFun、美团大学分享实践。',
    tags: '首席布道人；Google 可以搜到的女人（搜索：赵壮实 数据）。',
    motto: '签名摘句：「为什么不愉快接受」。',
    front: '为什么不愉快接受',
  },
  {
    id: 'xiejun',
    name: '谢俊',
    role: '联合创始人',
    focus: 'AI Native 与 Agent 工程',
    experience:
      '8 年美团研发经验，长期深耕数据、计算、平台架构与复杂系统工程化，参与企业知识库、RAG 与 Agent 实践。目前聚焦 AI Agent、AI Coding 与 AI Native 软件架构，探索大模型在复杂任务与研发自动化中的应用。',
    tags: '叫我谢尊；熬走了 10 任老板的研发；杠杆炒股第一人；美团 AI 第一人之一，因为种种原因后面不是第一人了；普通话说得最好的广西人，广西话说得最好的北漂；十年股神，三十年靓仔；辞职之后，从北京骑车回南宁的男人。',
    front: '辞职之后，从北京骑车回南宁的男人',
  },
  {
    id: 'pengfei',
    name: '杨鹏飞',
    role: '联合创始人',
    // 方向、经历与个性标签都待补；不推断职责，只显示名字与身份。
  },
  {
    id: 'haozhe',
    name: '庄昊哲',
    role: '联合创始人',
    focus: 'BI 研发',
    experience: '3 年美团 BI 研发经历，一直在探索新系统。',
    tags: '脆脆鲨；Molis AI 第一打手（打手总共 1 人）；日常写代码、健身、爬山。',
    front: 'Molis AI 第一打手（打手总共 1 人）',
  },
  {
    id: 'xinyi',
    name: '隋欣怡',
    role: '联合创始人',
    focus: '业务增长与客户共创',
    experience:
      '曾在美团、字节、小红书核心团队担任数据运营专家，对接过 100+ 客户团队。关注业务增长与客户共创，持续探索 AI 能力进入真实业务、产生实际价值的落点。',
    tags: 'Molis AI 下一任 CEO（1/2）。',
    front: 'Molis AI 下一任 CEO（1/2）',
  },
  {
    id: 'jinqu',
    name: '靳曲',
    role: '联合创始人',
    focus: '数据科学与 AI 工作流',
    experience:
      '前美团、快手、字节数据科学家。擅长以数据科学洞察业务，以 AI 重构工作流，让复杂决策更智能，让创新想法真正落地。',
    tags: 'Molis AI 下一任 CEO（2/2）；自由主义践行者；天赋型情绪价值供应商；社会时钟坚定反对派。',
    front: 'Molis AI 下一任 CEO（2/2）',
  },
];

/** 团队页上的界面文字（新写，不是底稿原句；数字都由数据算出）。展品标题、替代文字与署名在 exhibit.ts */
export const teamUi = {
  pageTitle: '认识我们',

  // ① 开场
  facts: { members: '成员', tries: '具体的尝试', products: '产品方向' },
  meet: '认识每一个人',

  // ② 八个人
  membersLabel: '成员',
  self: '自述',
  motto: '签名',
  more: '经历',
  allSelf: '全部自述',
  selfNote: '「」里是本人的自述：玩笑话，不作职务。点「经历」看完整的背景。',

  // ③ 来时路
  pathLabel: '来时路',
  groups: (n: number) => `件具体的尝试，分在 ${n} 组`,
  intoProducts: (n: number) =>
    `其中 ${n} 件，后来流进了今天的 Molis Work、Tool 与 Story。`,
  toRoom: (no: string, name: string) => `走进展厅 ${no} · ${name}`,

  // ④ 黑客与画家
  makersLabel: 'Hackers & Painters',

  // ⑤ 想做的事
  wantLabel: '想做的事',
  far: '更远一点',
  concept: '概念示意',
  enterprise: '企业合作',
  community: '去社区看看',

  // ⑥ 找同类
  endLabel: '找同类',
  chat: '聊一聊',
};
