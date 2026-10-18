// Molis Life 页：几周里的一件挂念和一个心愿。章节正文取自 docs/studio-intro.md 4.3（原句）；
// 每一步的一句话说明画面在演什么。Life 是可交互的规则原型，真实模型和外部服务尚未接入，画面都标「原型示意」。

import { products } from './products';

const life = products.life;
const [followUp, chance, curious] = life.sections;

export type LifeChapterId = 'worries' | 'refund' | 'sea' | 'curious';

export const lifeChapters: {
  id: LifeChapterId;
  kicker: string;
  title: string;
  paragraphs: string[];
  steps: string[];
}[] = [
  {
    id: 'worries',
    kicker: '第一周',
    title: life.opening[0],
    paragraphs: life.opening.slice(1),
    steps: ['一笔还没退回来的款。', '一件快到期的事。', '一个说了很久的愿望。'],
  },
  {
    id: 'refund',
    kicker: '第二周',
    title: followUp.title,
    paragraphs: followUp.paragraphs,
    steps: [
      '申请已提交：有申请记录，才亮。',
      '对方已受理：有商家回复，才亮。',
      '退货已签收：有物流签收，才亮。',
      '钱还没到账，就照实说没到账；哪里要你自己处理，写清楚。',
    ],
  },
  {
    id: 'sea',
    kicker: '第三周',
    title: chance.title,
    paragraphs: chance.paragraphs,
    steps: [
      '「想陪妈妈去看海。」先留着。',
      '这周六下午，空出了半天。',
      '它说明为什么此刻想到这件事。',
      '近一点，或者多走一段；去不去由你定。',
    ],
  },
  {
    id: 'curious',
    kicker: '第四周',
    title: curious.title,
    paragraphs: curious.paragraphs,
    steps: [
      '看见的植物、想读的书、一段音乐，都可以留下。',
      '各自选：替我处理、一起想想，或者先留着。',
      '它对你的理解，你可以改。',
    ],
  },
];

/** 标志性交互：拨动「这周空出多少时间」。新写；所有地点、天气、路程都是示意 */
export const freeTime = {
  kicker: '亲手试一次',
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

/** 当前进展：摘自 4.3「当前进展」原句 */
export const lifeProgress = {
  have: [
    'Molis Life 处于原型探索阶段。已有可交互的本地 Web 原型，可以保存生活内容、明确偏好、查看有限规则生成的建议，并进行本地准备、延后、暂停和回看。',
  ],
  notYet: [
    '真实模型、外部服务、后台跟进与跨设备同步尚未接入。',
    '退换货的持续跟进、结合真实日历与天气寻找机会，以及更长期的理解与陪伴，仍需要继续做出来。',
  ],
  now: ['当前尚未开放公开下载。'],
};

export const lifeGo = {
  follow: '关注 Molis Life 的进展',
  story: '看看 Molis Story',
};
