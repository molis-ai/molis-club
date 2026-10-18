// Molis World 页：一个地方慢慢长大。章节正文取自 docs/studio-intro.md 4.5（原句），画面自己演；
// 整页都是概念设计 / 概念示意（每幅画面各自标着）：没有原型、没有仓库，去处只有「关注进展」。

import { products } from './products';

const world = products.world;
const [start, links, meet] = world.sections;

export type WorldChapterId = 'seed' | 'noodle' | 'meet';

export const worldChapters: {
  id: WorldChapterId;
  title: string;
  paragraphs: string[];
}[] = [
  {
    id: 'seed',
    title: start.title,
    paragraphs: start.paragraphs,
  },
  {
    id: 'noodle',
    title: links.title,
    paragraphs: links.paragraphs,
  },
  {
    id: 'meet',
    title: meet.title,
    paragraphs: meet.paragraphs,
  },
];

/** 标志性交互：把一个地方放进小岛（概念示意；只在这一页里，不保存）。新写 */
export const placeTry = {
  title: '把一个地方放进小岛。',
  note: '概念示意 · 不保存',
  label: '一个你在意的地方',
  placeholder: '例如：巷口那家面馆',
  picks: ['常去的面馆', '散步经过的公园', '一直想去的街角'],
  put: '放进小岛',
  clear: '擦掉重来',
  full: '这座小岛先放这么多。擦掉一些，再放新的。',
  empty: '小岛还空着。',
  placed: (name: string) => `「${name}」已经放进小岛。`,
};

export const worldGo = {
  follow: '关注 Molis World 的进展',
};
