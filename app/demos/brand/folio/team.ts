export const companies = [
  {
    name: '美团',
    src: '/images/daylight/company_logo/美团/美团横式色彩标识.png',
    width: 1896,
    height: 687,
    kind: 'meituan',
  },
  {
    name: '抖音集团',
    src: '/images/daylight/company_logo/douyin-group.jpg',
    width: 1749,
    height: 800,
    kind: 'douyin',
  },
  {
    name: '滴滴',
    src: '/images/daylight/company_logo/didi.jpg',
    width: 823,
    height: 800,
    kind: 'didi',
  },
  {
    name: 'LinkedIn',
    src: '/images/daylight/company_logo/linkedin-svgrepo-com.svg',
    width: 382,
    height: 382,
    kind: 'linkedin',
  },
  {
    name: '小红书',
    src: '/images/daylight/company_logo/red.jpeg',
    width: 4804,
    height: 3200,
    kind: 'red',
  },
];

export type Person = {
  image: string;
  imagePosition?: string;
  personRole: string;
  experience: string;
  aside: string;
  tone: string;
};

// 保留已确认的团队资料，Folio 首页直接展示。
export const people: Person[] = [
  {
    image: '/images/daylight/team/zhuangshi.jpg',
    personRole: 'AI 数据产品与复杂业务设计',
    experience:
      '曾任字节、美团核心团队 AI 数据产品资深专家；参与抖音数据管理及功能建设，拥有相关软件著作权，并受邀在 DataFun、美团大学与 CSDI Summit 分享实践。',
    aside: 'Molis 创始合伙人、首席布道人。Google 搜得到的女人。',
    tone: 'red',
  },
  {
    image: '/images/daylight/team/yijun.jpg',
    personRole: '系统架构、产品与技术管理',
    experience:
      '曾在美团、字节、滴滴、LinkedIn 及多家硅谷创业公司的核心研发团队负责架构与管理，长期建设和演进高复杂度核心系统。',
    aside: 'Molis AI Founder。首席 Token 官，也是一个幻想家。',
    tone: 'blue',
  },
  {
    image: '/images/daylight/team/xiejun.jpeg',
    imagePosition: '50% 48%',
    personRole: 'AI Native 与 Agent 工程',
    experience:
      '8 年美团研发经验，较早参与企业知识库、RAG、Prompt Engineering 与 Agent 实践；长期深耕数据、计算、平台架构和复杂系统工程化，目前聚焦 AI Agent、AI Coding 与 AI Native 软件架构。',
    aside: '从北京骑回南宁的工程师。叫我谢尊。',
    tone: 'sage',
  },
  {
    image: '/images/daylight/team/xinyi.jpg',
    imagePosition: '50% 54%',
    personRole: '业务增长与客户共创',
    experience:
      '曾在美团、字节、小红书核心团队负责数据运营，对接 100+ 客户团队，参与共创月百万级业务增量，持续寻找 AI 能力真正进入业务的落点。',
    aside: 'Molis AI 下一任 CEO 候选人之一。',
    tone: 'yellow',
  },
];
