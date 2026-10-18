// Molis World 页：一个地方慢慢长大。章节正文取自 docs/studio-intro.md 4.5（原句）；
// 整页都是概念设计 / 概念示意：没有原型、没有仓库，去处只有「关注进展」。

import { products } from './products';

const world = products.world;
const [start, links, meet] = world.sections;

export type WorldChapterId = 'seed' | 'noodle' | 'meet';

export const worldChapters: {
  id: WorldChapterId;
  kicker: string;
  title: string;
  paragraphs: string[];
  steps: string[];
}[] = [
  {
    id: 'seed',
    kicker: '一个地方',
    title: start.title,
    paragraphs: start.paragraphs,
    steps: [
      '一座还空着的小岛。',
      '把常去的面馆放进来。',
      '给它取一个名字，放进一段回忆。',
      '按自己的方式布置。',
    ],
  },
  {
    id: 'noodle',
    kicker: '一段旅程',
    title: links.title,
    paragraphs: links.paragraphs,
    steps: [
      '面馆在你的世界里。',
      '它成了一个故事的起点。',
      '后厨的门，通向另一座城。',
      '带回一件纪念物，放在面馆旁边：这个周末，真的去吃一次吧。',
    ],
  },
  {
    id: 'meet',
    kicker: '一个设想',
    title: meet.title,
    paragraphs: meet.paragraphs,
    steps: [
      'Life 关心真实生活，Story 提供可以进入的体验。',
      'World 让人亲手搭建、布置和重访。',
      '这些连接尚未实现；连接什么，由你选择。',
    ],
  },
];

/** 标志性交互：把一个地方放进小岛（概念示意；只在这一页里，不保存）。新写 */
export const placeTry = {
  kicker: '亲手试一次',
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

/** 当前进展：摘自 4.5「当前进展」原句；「已经有的」为新写 */
export const worldProgress = {
  have: ['这一页上的构想，和画在纸上的概念示意。'],
  notYet: [
    'Molis World 仍处于概念设计阶段，尚无可用原型。',
    '个人世界的具体形态、Agent 的参与方式，以及与 Life、Story 的连接，都还需要通过后续探索逐步明确。',
  ],
  now: ['现阶段可以关注进展。'],
};

export const worldGo = {
  follow: '关注 Molis World 的进展',
};
