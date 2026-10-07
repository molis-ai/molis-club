// Molis Story 产品页文案，五个品牌方向共用。依据 molis-ai/molis-story 的体验设计（2026-09-29）
// 和 README（10/1）。四个世界在开发版里都能走完，还没有公开下载。各世界的引句直接用
// 仓库里世界自己写的那句；生成的氛围画标「概念画面」，博物馆用仓库里 Unsplash 授权的示例照片。

export const hero = {
  kicker: 'Molis Story · 开发中',
  title: '走进另一个世界，经历另一种生活，然后回来。',
  lead: 'Molis Story 是 Mac 上的一组世界。每个世界有自己的画面、规则和时间；你可以进去待一会儿，再带一样东西回来。',
  status: ['开发中', 'macOS', '还不能下载'],
  actions: { follow: '关注进展', worlds: '看看四个世界' },
};

export const journey = {
  kicker: '此处 → 彼处 → 归来',
  title: '每一次出发，都从这里开始，也回到这里。',
  steps: [
    {
      title: '此处',
      text: '一个安静的地方。现在几点、有什么在等你、去过哪里、带回了什么。',
    },
    {
      title: '彼处',
      text: '每扇窗后面是一个世界。进去之后它占满画面，只留一个「归来」。',
    },
    {
      title: '归来',
      text: '世界先替你保存，再放你回来。你看到停在哪里、那边记得什么、带回了什么。',
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
    text: '一条来自气态巨行星云层的信号接上了你。没有译文，能用的词是你们一起试出来的；告别再回来，它会引用你们真正说过的话。',
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
    text: '讲出一个真实的岔路口，核对哪些是事实，划定虚构能走多远，再读一本只写给你的书。它不预测，也不比较两条路的高下。',
    souvenir: '补完的一句',
    image: { src: '/images/edition-c/story/departure.jpg', w: 1600, h: 900 },
    imageNote: '概念画面',
  },
  {
    id: 'museum',
    relation: '回到自己的一段时光',
    name: '袖珍博物馆',
    quote: '把一段经历里的照片与文字，变成可以走近、探索和重访的私人展览。',
    text: '自己排列展品、写下展签，然后开幕；可以慢慢走近每一件，也可以关灯看影院。',
    souvenir: '一本离线纪念册',
    image: { src: '/images/edition-c/story/museum-lake.jpg', w: 1200, h: 800 },
    imageNote: '示例照片 · Unsplash',
  },
  {
    id: 'fog-harbor',
    relation: '成为另一个人',
    name: '雾港失物招领处',
    quote: '有些东西，在被弄丢之前，就先送到了这里。',
    text: '雾港每晚十点起雾，这里收下的失物，标签上的日期都是明天。以你自己，或一位你设定的人物接下夜班。',
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
      text: '没有分数、胜负、成就和连续打卡，也没有「回答正确」。',
    },
    {
      title: '不是无尽的聊天',
      text: '有限的旅程会真正结束，离开也是体验的一部分。',
    },
    {
      title: '世界有自己的时间',
      text: '它会回信、会去睡、展厅会熄灯；但绝不催你，不回来也不会失去什么。',
    },
    {
      title: '每个世界有自己的样子',
      text: '外壳只用纸与墨，把颜色和声音留给世界。',
    },
  ],
};

export const boundaries = {
  kicker: '碰到你真实生活的地方',
  title: '进门前，先说清楚。',
  items: [
    '进门前，每个世界都写清楚它会用到什么、存在哪里、AI 能看到什么。',
    '你的照片和文字只存在这台设备上，可以逐段忘掉。',
    '只有允许虚构的世界，才能带一位人物进入。',
  ],
};

export const closing = {
  title: '今晚想去哪里？',
  follow: '关注 Molis Story 的进展',
  home: '回到 Molis AI',
};
