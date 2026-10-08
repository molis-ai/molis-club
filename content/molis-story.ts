// Molis Story 产品页文案，五个品牌方向共用。依据 molis-ai/molis-story 的体验设计（2026-09-29）
// 和 README（10/1）。四个世界在开发版里都能走完，还没有公开下载。各世界的引句直接用
// 仓库里世界自己写的那句；生成的氛围画标「概念画面」，博物馆用仓库里 Unsplash 授权的示例照片。

export const hero = {
  kicker: 'Molis Story · 开发中',
  title: '走进另一个世界，经历另一种生活，然后回来。',
  lead: 'Mac 上的一组世界。进去待一会儿，再带一样东西回来。',
  status: ['开发中', 'macOS', '还不能下载'],
  actions: { follow: '关注进展', worlds: '看看四个世界' },
};

export const journey = {
  kicker: '此处 → 彼处 → 归来',
  title: '每一次出发，都从这里开始，也回到这里。',
  steps: [
    {
      title: '此处',
      text: '一个安静的地方，记得你去过哪里。',
    },
    {
      title: '彼处',
      text: '每扇窗后面是一个世界。',
    },
    {
      title: '归来',
      text: '世界替你保存，再放你回来。',
    },
  ],
};

export type World = {
  id: string;
  relation: string;
  name: string;
  english?: string;
  quote: string;
  text: string;
  souvenir: string;
  tag?: string;
  image: { src: string; w: number; h: number; position?: string };
  imageNote: string;
};

export const worldsIntro = {
  kicker: '四个世界',
  title: '按它和你人生的关系来分。',
  souvenirLabel: '带回',
};

export const worlds: World[] = [
  {
    id: 'astralo',
    relation: '遇见另一个生命',
    name: '云海来客',
    english: 'Astralo',
    quote: '另一端，也有谁在试着理解你。',
    text: '一条来自云层的信号，能用的词是你们一起试出来的。',
    souvenir: '一段未译的信号',
    image: { src: '/images/edition-c/story/astralo.jpg', w: 1600, h: 900 },
    imageNote: '概念画面',
  },
  {
    id: 'elsewhere',
    relation: '活一次另一个你',
    name: '彼处',
    english: 'Elsewhere',
    quote: '把一个一直留在心里的如果，认真走完一次，然后回到这里。',
    text: '讲出一个真实的岔路口，读一本只写给你的书。',
    souvenir: '补完的一句',
    image: { src: '/images/edition-c/story/departure.jpg', w: 1600, h: 900 },
    imageNote: '概念画面',
  },
  {
    id: 'museum',
    relation: '回到自己的一段时光',
    name: '袖珍博物馆',
    quote: '把一段经历里的照片与文字，变成可以走近、探索和重访的私人展览。',
    text: '自己排列展品、写下展签，然后开幕。',
    souvenir: '一本离线纪念册',
    image: { src: '/images/edition-c/story/museum-lake.jpg', w: 1200, h: 800 },
    imageNote: '示例照片 · Unsplash',
  },
  {
    id: 'fog-harbor',
    relation: '成为另一个人',
    name: '雾港失物招领处',
    quote: '有些东西，在被弄丢之前，就先送到了这里。',
    text: '雾港每晚十点起雾，失物标签上的日期都是明天。',
    souvenir: '第十三号钥匙牌',
    tag: '示例世界',
    image: {
      src: '/images/edition-c/story/fog-harbor.jpg',
      w: 1050,
      h: 900,
      position: '50% 40%',
    },
    imageNote: '概念画面',
  },
];

export const different = {
  kicker: '和游戏、和聊天有什么不同',
  title: '有限的旅程，会真正结束。',
  items: [
    {
      title: '不是游戏',
      text: '没有分数、胜负和打卡。',
    },
    {
      title: '不是无尽的聊天',
      text: '旅程会真正结束。',
    },
    {
      title: '世界有自己的时间',
      text: '它会回信、会去睡，但绝不催你。',
    },
    {
      title: '每个世界有自己的样子',
      text: '外壳只用纸与墨。',
    },
  ],
};

export const boundaries = {
  kicker: '碰到你真实生活的地方',
  title: '进门前，先说清楚。',
  items: [
    '进门前，每个世界都写清楚会用到什么。',
    '照片和文字只存在这台设备上。',
    '只有允许虚构的世界，才能带人物进入。',
  ],
};

export const closing = {
  title: '今晚想去哪里？',
  follow: '关注 Molis Story 的进展',
  home: '回到 Molis AI',
};

/** 「此处 → 彼处 → 归来」的画面：第一步用四扇小窗，后两步是概念画面 */
export const journeyImages = [
  null,
  { src: '/images/edition-c/story/elsewhere.jpg', w: 1600, h: 900 },
  { src: '/images/edition-c/story/homecoming.jpg', w: 1600, h: 900 },
];
export const imageNote = '概念画面';
export const windowsNote = '概念画面；袖珍博物馆为示例照片（Unsplash）';
