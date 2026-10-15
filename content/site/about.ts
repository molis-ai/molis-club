// 关于页的界面文字。正文全部来自 content/site/studio.ts（docs/studio-intro.md 第 1、2 章原句）；
// 这里只放两类东西：
// 1. 从原句里切出来的片段（用代码切，保证一字不差）；
// 2. 新写的界面文字：小标签、图注、去处，以及「三种媒介，同一个动作」里的示意内容（代码与文字都是示意，不是产品事实）。

import { studio } from './studio';

// ---------- 从原句里切出来的片段 ----------

const intro = studio.standard.intro;
const firstStop = intro.indexOf('。') + 1;

/** 1.3 第一句：「Molis AI 是一间做 AI 产品的工作室。」（首屏大标题） */
export const aboutName = intro.slice(0, firstStop);
/** 1.3 第二句：我们关心技术怎样进入具体的日常：……（首屏导语） */
export const aboutCare = intro.slice(firstStop);

// ---------- 新写的界面文字 ----------

export const aboutUi = {
  kicker: '关于我们',
  heroCaption: 'Someone at the window, looking out',
  heroAlt: '白色的展厅里，一整面落地窗，一个人站在窗前，远远看着窗外的树和天。',

  who: '我们是谁',
  enterprise: '企业合作',
  community: '去社区看看',

  from: '从哪来',
  meetTeam: '认识这群人',

  changed: '什么变了',
  essay: '读《人的尺度》',

  believe: 'What we believe',
  believeTitle: '我们相信什么',

  practice: '落到产品里',
  demands: '要求自己',

  next: '接下来去哪',
  coastCaption: 'Sunrise, a coastline, moving forward',

  /** 结尾三扇门：一句话沿用顶栏「关于」下拉里的说明 */
  doorsLabel: '继续走走',
};

/** 「三种媒介，同一个动作」：作画、写代码、改文字并排，地位相同，一起走过起稿 → 修改 → 完成（新写，示意） */
export const trio = {
  kicker: 'Hackers & Painters',
  title: '三种媒介，同一个动作。',
  note: '示意',
  steps: ['起稿', '修改', '完成'] as const,
  play: '演一遍',
  replay: '再演一遍',
  pause: '停在这一步',

  paint: {
    medium: '颜料',
    en: 'Paint',
    captions: [
      '先铺大的明暗，颜色晚点再说。',
      '盖掉一笔，再画一次。',
      '退后两步，放下笔。',
    ],
  },

  code: {
    medium: '代码',
    en: 'Code',
    file: 'site.css',
    captions: [
      '能用：鼠标停上去，出现下划线。',
      '换个做法：让线从左边画过去。',
      '收尾放慢一点，像东西落定。',
    ],
    /** 一段 CSS 从初稿改到更好：本站文字链接的下划线。每行：[标记, 内容]，' ' 不变，'-' 删掉，'+' 加上 */
    drafts: [
      [
        [' ', '.m-link:hover {'],
        [' ', '  text-decoration: underline;'],
        [' ', '}'],
      ],
      [
        ['+', '.m-link {'],
        ['+', '  background:'],
        ['+', '    linear-gradient(currentColor 0 0)'],
        ['+', '    0 100% / 0 1px no-repeat;'],
        ['+', '  transition: background-size 0.55s'],
        ['+', '    ease;'],
        ['+', '}'],
        [' ', '.m-link:hover {'],
        ['-', '  text-decoration: underline;'],
        ['+', '  background-size: 100% 1px;'],
        [' ', '}'],
      ],
      [
        [' ', '.m-link {'],
        [' ', '  background:'],
        [' ', '    linear-gradient(currentColor 0 0)'],
        [' ', '    0 100% / 0 1px no-repeat;'],
        [' ', '  transition: background-size 0.55s'],
        [' ', '    var(--ease);'],
        [' ', '}'],
        [' ', '.m-link:hover {'],
        [' ', '  background-size: 100% 1px;'],
        [' ', '}'],
      ],
    ] as Array<Array<[' ' | '-' | '+', string]>>,
    /** 代码下面的「效果」：一个可以悬停的文字链接 */
    result: '效果',
    sample: '读完整的信念',
  },

  words: {
    medium: '文字',
    en: 'Words',
    /** 文字那一栏左上角的稿次 */
    versions: ['第 1 稿', '改稿', '定稿'],
    captions: [
      '先写下来，哪怕说得太满。',
      '删掉说了等于没说的。',
      '剩下真正想说的那一句。',
    ],
    /** 一句话的修改痕迹：[标记, 内容]，' ' 留下，'-' 划掉，'+' 补上。定稿是品牌愿景原句。 */
    drafts: [
      [[' ', '我们致力于用领先的 AI 技术，赋能每一个人的工作与生活。']],
      [
        ['-', '我们致力于用领先的 AI '],
        [' ', '技术，'],
        ['-', '赋能每一个人的工作与生活'],
        ['+', '回到人的尺度'],
        [' ', '。'],
      ],
      [[' ', studio.vision]],
    ] as Array<Array<[' ' | '-' | '+', string]>>,
  },
};
