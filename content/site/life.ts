// Molis Life 页：几周里的一件挂念和一个心愿。章节正文取自 docs/studio-intro.md 4.3（原句）；
// 画面自己演，不再另写每一步的说明。Life 是可交互的规则原型，真实模型和外部服务尚未接入，画面都标「原型示意」。

import { products } from './products';

const life = products.life;
const [followUp, chance, curious] = life.sections;

export type LifeChapterId = 'worries' | 'refund' | 'sea' | 'curious';

export const lifeChapters: {
  id: LifeChapterId;
  kicker: string;
  title: string;
  paragraphs: string[];
}[] = [
  {
    id: 'worries',
    kicker: '第一周',
    title: life.opening[0],
    paragraphs: life.opening.slice(1),
  },
  {
    id: 'refund',
    kicker: '第二周',
    title: followUp.title,
    paragraphs: followUp.paragraphs,
  },
  {
    id: 'sea',
    kicker: '第三周',
    title: chance.title,
    paragraphs: chance.paragraphs,
  },
  {
    id: 'curious',
    kicker: '第四周',
    title: curious.title,
    paragraphs: curious.paragraphs,
  },
];

/** 标志性交互：拨动「这周空出多少时间」。新写；所有地点、天气、路程都是示意 */
export const freeTime = {
  title: '这周空出多少时间？',
  note: '原型示意 · 地点与天气为示意',
  wish: '“想陪妈妈去看海。”',
  label: '这周空出的时间',
  marks: ['一小时', '两小时', '三小时', '半天', '一整天'],
  plans: [
    {
      /** 一小时：不打扰 */
      title: '先不打扰你',
      text: '一小时有点赶，看海这件事先留着。等空闲多一点再说。',
      why: '',
    },
    {
      title: '近一点',
      text: '城东海堤走一走，回来一起吃晚饭。',
      why: '周六下午空出两小时；去城东海堤二十分钟；天气预报是晴天。',
    },
    {
      title: '近一点，慢一点',
      text: '城东海堤走一走，在堤上的小店坐一会儿。',
      why: '周六下午空出三小时；海堤不远，可以走得慢一些。',
    },
    {
      title: '多走一段',
      text: '去南湾看日落，给妈妈带一件外套。',
      why: '周六下午空出半天；南湾日落在 17:42；傍晚风大。',
    },
    {
      title: '多走一段，住一晚也行',
      text: '去南湾看日落，第二天早上再看一次海。',
      why: '这周末空出一整天；南湾有一家安静的民宿还有空房。',
    },
  ],
  go: '就这样准备',
  later: '这周先不去',
  went: '好，开始准备。去不去、准备到什么程度，随时可以改。',
  kept: '好，愿望先留着。下次有空的时候再说。',
  why: '为什么此刻想到',
};

export const lifeGo = {
  follow: '关注 Molis Life 的进展',
  story: '看看 Molis Story',
};
