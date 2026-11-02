// 首页的界面文字：产品列表的去处，与第四屏（结尾）的过渡句和三个去处。
// 事实句子都取自 docs/studio-intro.md（2026-10-15 版）：过渡句出自第 1.4 节「找同类，不抢货架」的末句，
// 三张卡片的标题分别是第 5 章（企业合作）、第 6 章（社区）的开头句和第 7 章（团队）的标题。
// 产品列表的标题、一句话、阶段等都读 content/site/products.ts，不在这里另写。

import type { ProductId } from './products';

/** more：舞台里去产品页那颗圆形箭头的读屏名（画面上只有箭头）；github：开源代码按钮上的字 */
export const homeProducts: Record<
  ProductId,
  { more: string; github?: string }
> = {
  work: { more: '了解 Molis Work', github: '开源代码' },
  tool: { more: '了解 Molis Tool' },
  life: { more: '了解 Molis Life' },
  story: { more: '了解 Molis Story' },
  world: { more: '看看 Molis World 这个构想' },
};

export const homeClosing = {
  /** 第 1.4 节：「……让产品有自己的性格，让口味相近的人认出彼此。」按语气分两行，不改字 */
  lead: ['让口味相近的人', '认出彼此。'],
  /** 末屏的照片（Unsplash · Maxim Boldyrev，负责人 2026-10-31 挑）；替代文字是新写的界面文字 */
  photoAlt: '雾里的海面上，一个人站在桨板上，远远地划着。',
  paths: [
    {
      id: 'enterprise',
      label: '企业合作',
      /** 第 5 章开头句 */
      title: ['把 AI 用进业务，', '把能力留在团队。'],
      link: '了解企业合作',
    },
    {
      id: 'community',
      label: '社区',
      /** 第 6 章开头句的前半 */
      title: ['试试有意思的作品，', '看看它们怎么做出来。'],
      link: '去社区看看',
    },
    {
      id: 'about',
      label: '关于我们',
      /** 第 7 章标题 */
      title: ['一群同类，', '一起创造。'],
      link: '认识我们',
    },
  ],
} as const;
