// 关于页「我们相信什么」＝「关于」展厅 02（主题：光）。我们是谁、从哪来、接下来去哪在展厅 01「认识我们」。
// 正文全部来自 content/site/studio.ts（docs/studio-intro.md 第 1、2 章原句）；
// 这里只放新写的界面文字：小标签、几个数的说明，以及「三种媒介，同一个动作」里的示意内容（代码与文字都是示意，不是产品事实）。
// 展品标题、替代文字与署名在 exhibit.ts。
// 例外是 title：「我们相信什么」就是底稿 1.4 的小标题。

import { studio } from './studio';

export const aboutUi = {
  kicker: '关于我们',
  /** 底稿 1.4 的小标题，当这一页的大标题 */
  title: '我们相信什么',
  /** 开场的数 */
  facts: { beliefs: '信念' },

  changed: '什么变了',
  whole: '读这一节的前两段',
  essay: '读《人的尺度》',

  believe: 'What we believe',
  beliefsTitle: '六条信念',
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
