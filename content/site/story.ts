// Molis Story 页：页面本身就是「此处」。章节正文取自 docs/studio-intro.md 4.4（原句）；
// 四个世界的瞬间、此处清单里的条目、带回来的纪念物都是示意。瞬间由画面自己演，不再另写每一步的说明。

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
  /** 带回来的纪念物（新写，示意） */
  souvenir: string;
};

export const storyWorlds: StoryWorld[] = [
  {
    id: 'astralo',
    en: 'Astralo',
    title: astralo.title,
    paragraphs: astralo.paragraphs,
    souvenir: '一段带着这次交流痕迹的信号',
  },
  {
    id: 'elsewhere',
    en: 'Elsewhere',
    title: elsewhere.title,
    paragraphs: elsewhere.paragraphs,
    souvenir: '一句写给这次经历的话',
  },
  {
    id: 'museum',
    en: 'Pocket Museum',
    title: museum.title,
    paragraphs: museum.paragraphs,
    souvenir: '一本离线纪念册',
  },
  {
    id: 'fog',
    en: '',
    title: fog.title,
    paragraphs: fog.paragraphs,
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

/** 更远的方向：4.4「当前进展与未来方向」第二段原句（句里已写明「尚未开放」）；第一段放在页尾「当前进展」 */
export const further = story.progress[1];

export const storyGo = {
  follow: '关注 Molis Story 的进展',
  world: '看看 Molis World',
};
