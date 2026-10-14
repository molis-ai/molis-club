// 首页的界面文字：去处、舞台上每段演示的说明、「我们相信」与结尾。
// 事实句子都取自 docs/studio-intro.md（标题、一句话、信念、企业合作与社区的开头句）；
// 演示说明只描述画面里演的那件事，画面一律标示意。

import type { ProductId } from './products';

export const homeProducts: Record<
  ProductId,
  { more: string; caseTitle: string; view: string; github?: string }
> = {
  work: {
    more: '了解 Molis Work',
    github: '查看开源代码',
    caseTitle: '',
    view: '16 / 9.4',
  },
  tool: {
    more: '了解 Molis Tool',
    caseTitle: '选中一段活动信息，顺手整理成日程草稿。',
    view: '16 / 9.4',
  },
  life: {
    more: '了解 Molis Life',
    caseTitle: '一个说了很久的愿望，等到了半天空闲。',
    view: '16 / 9.4',
  },
  story: {
    more: '了解 Molis Story',
    caseTitle: '从一个「如果」走进一本书，再带一句话回来。',
    view: '16 / 9.4',
  },
  world: {
    more: '看看这个构想',
    caseTitle: '常去的面馆，放进自己慢慢长大的世界。',
    view: '16 / 9.4',
  },
};

export const homeBeliefs = {
  kicker: 'What we believe',
  title: '我们相信',
  more: '读完整的信念',
};

export const homeClosing = {
  lead: '技术，回到人的尺度。',
  signature: '始终好奇，持续创造。',
  caption: 'A white room, a skylight, a garden',
  alt: '白色展厅，天窗的光落下来，尽头的大开口通向花园，地上有树影。',
  paths: [
    {
      label: '企业合作',
      text: '把 AI 用进业务，把能力留在团队。',
      link: '了解企业合作',
      href: '/enterprise',
    },
    {
      label: '社区',
      text: '试试有意思的作品，看看它们怎么做出来。带走一个方法，也留下你的新想法。',
      link: '去社区看看',
      href: '/community',
    },
    {
      label: '团队',
      text: '一群同类，一起创造。',
      link: '认识我们',
      href: '/team',
    },
  ],
  also: {
    label: '也可以',
    github: '查看 Molis Work 开源代码',
    essays: '读文章',
    along: '走走「沿途」',
  },
};
