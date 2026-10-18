// Molis Story 页：页面本身就是「此处」。章节正文取自 docs/studio-intro.md 4.4（原句）；
// 四个世界的瞬间、此处清单里的条目、带回来的纪念物都是示意。

import { products } from './products';

const story = products.story;
const [here, astralo, elsewhere, museum, fog, rhythm] = story.sections;

export type WorldId = 'astralo' | 'elsewhere' | 'museum' | 'fog';

export type StoryWorld = {
  id: WorldId;
  /** 中英文对应（附录 A 首次出现时的写法） */
  en: string;
  title: string;
  paragraphs: string[];
  /** 这个瞬间每一步演什么（新写） */
  steps: string[];
  /** 带回来的纪念物（新写，示意） */
  souvenir: string;
};

export const storyWorlds: StoryWorld[] = [
  {
    id: 'astralo',
    en: 'Astralo',
    title: astralo.title,
    paragraphs: astralo.paragraphs,
    steps: [
      '云海那一端，有什么在闪。',
      '你发出一段信号。',
      '它回了一段，和你的不太一样。',
      '再来一次，彼此的意思慢慢清楚了一点。',
    ],
    souvenir: '一段带着这次交流痕迹的信号',
  },
  {
    id: 'elsewhere',
    en: 'Elsewhere',
    title: elsewhere.title,
    paragraphs: elsewhere.paragraphs,
    steps: [
      '先分清：哪些是真的经历，哪些是想象。',
      '一本书，逐章展开。',
      '读下去，也可以停一会儿。',
      '归来时，写下一句自己的话。',
    ],
    souvenir: '一句写给这次经历的话',
  },
  {
    id: 'museum',
    en: 'Pocket Museum',
    title: museum.title,
    paragraphs: museum.paragraphs,
    steps: [
      '一面空墙。',
      '挑几张照片，摆进展厅。',
      '给它们写下展签。',
      '走进自己布置的展厅。',
    ],
    souvenir: '一本离线纪念册',
  },
  {
    id: 'fog',
    en: '',
    title: fog.title,
    paragraphs: fog.paragraphs,
    steps: [
      '夜班。柜台上放着一把没有主人的伞。',
      '有人来认领，说它是自己的。',
      '交给他，还是再等等？你来选。',
      '下一夜，你的选择留下了新的事情。',
    ],
    souvenir: '第十三号钥匙牌',
  },
];

/** 此处：去过哪里、哪段旅程还没结束、带回了什么（示意数据；访客带回的纪念物会加进「带回来的」） */
export const hereList = {
  id: 'here',
  title: here.title,
  paragraphs: here.paragraphs,
  note: '示意',
  columns: {
    visited: '去过哪里',
    unfinished: '未完的旅程',
    brought: '带回来的',
  },
  visited: ['彼处 · 上周'],
  unfinished: ['雾港失物招领处 · 第二夜'],
  brought: ['一本春天的纪念册'],
  empty: '还没带回什么。',
  take: '带回「此处」',
  taken: '已经放进「此处」',
  chip: '此处',
};

export const rhythmPart = {
  title: rhythm.title,
  paragraphs: rhythm.paragraphs,
};

/** 更远的方向：摘自 4.4「当前进展与未来方向」第二段 */
export const further = {
  text: story.progress[1],
  tag: '尚未开放',
};

/** 当前进展：摘自 4.4 原句 */
export const storyProgress = {
  have: [
    'Molis Story 面向 macOS 开发，已有四个世界及共同入口、旅程保存和归来的开发实现。',
  ],
  notYet: ['真实模型服务与完整桌面体验仍需验证，尚未开放公开下载。'],
  /** 「还没有的」已写明尚未开放下载，这一栏只留关注进展的入口 */
  now: [],
};

export const storyGo = {
  follow: '关注 Molis Story 的进展',
  world: '看看 Molis World',
};
