// 名单来自用户指定飞书文档 Hukxwktpfi3rRLkAUvrcBxm1ncf，revision 449。
// 保留已确认的前两位顺序。空简介保持空白；共同的美团经历由用户本轮确认。
export type FolioMember = {
  name: string;
  image?: string;
  imagePosition?: string;
  personRole?: string;
  experience?: string;
  aside?: string;
  tone: string;
};

export const folioMembers: FolioMember[] = [
  {
    name: '王一骏',
    image: '/images/daylight/team/yijun.jpg',
    personRole: '系统架构、产品与技术管理',
    experience:
      'Molis AI 创始人。曾在美团、字节、滴滴、LinkedIn 及硅谷创业公司的核心研发团队负责架构与管理，也在山禾与 DataFun 分享实践。',
    aside: '首席 Token 官。一个幻想家。',
    tone: 'blue',
  },
  {
    name: '赵壮实',
    image: '/images/daylight/team/zhuangshi.jpg',
    personRole: 'AI 数据产品与复杂业务设计',
    experience:
      'Molis 创始合伙人。复旦大学中文系，曾任字节、美团核心团队 AI 数据产品资深专家。参与抖音数据管理及功能建设，并在 DataFun、美团大学与 CSDI Summit 分享实践。',
    aside: '首席布道人。Google 搜得到的女人。',
    tone: 'red',
  },
  { name: '尹凯', tone: 'sage' },
  { name: '杨鹏飞', tone: 'yellow' },
  {
    name: '庄昊哲',
    personRole: '研发',
    experience: '3 年美团研发经验，一直在熟悉新系统的路上。',
    aside: 'Molis AI 第一打手。也喜欢运动。',
    tone: 'blue',
  },
  { name: '徐晶', tone: 'red' },
  {
    name: '谢俊',
    image: '/images/daylight/team/xiejun.jpeg',
    imagePosition: '50% 48%',
    personRole: 'AI Native 与 Agent 工程',
    experience:
      '8 年美团研发经验，参与企业知识库、RAG 与 Agent 实践。长期深耕数据、计算、平台架构和复杂系统工程化，目前聚焦 AI Agent、AI Coding 与 AI Native 软件架构。',
    aside: '从北京骑回南宁的工程师。叫我谢尊。',
    tone: 'sage',
  },
  {
    name: '隋欣怡',
    image: '/images/daylight/team/xinyi.jpg',
    imagePosition: '50% 54%',
    personRole: '业务增长与客户共创',
    experience:
      '曾在美团、字节、小红书核心团队负责数据运营，对接客户团队，持续寻找 AI 能力真正进入业务的落点。',
    aside: 'Molis AI 下一任 CEO 候选人之一。',
    tone: 'yellow',
  },
  { name: '靳曲', aside: 'Molis AI 下一任 CEO 候选人之一。', tone: 'blue' },
];

export const folioTeam = {
  title: '从同事，到一起做东西的人。',
  intro:
    '我们曾是美团的同事。现在，把各自走过的路、做过的产品和一直没放下的好奇心，带进 Molis。',
  practices: [
    {
      title: '把不同的经验放在一起',
      text: '产品、数据、研发、架构与业务运营。看同一个问题时，我们会从不同的位置出发，再一起把它做具体。',
    },
    {
      title: '从一件能做好的小事开始',
      text: '做产品，也和业务团队一起拆解问题。先说清楚要什么、怎么判断做对，再做出能亲手试一试的东西。',
    },
    {
      title: '给好奇心留一个位置',
      text: '工作台之外，也做桌面上的小工具，探索生活与故事。一个幻想、一趟骑行、一次动手，都可以成为新的起点。',
    },
  ],
};
