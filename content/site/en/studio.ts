// 工作室文案的英文：译自 docs/studio-intro.md 第 1 章（2026-10-15 版），只译事实，不添新说法。
// 目前只有首页、页尾和页面描述用到的部分；标准版全文、信念正文、我们的故事随「关于我们」一起翻，
// 到时把类型换成完整的 typeof zh.studio。
import type * as zh from '../studio';

type Studio = typeof zh.studio;

export const studio: Pick<
  Studio,
  'one' | 'vision' | 'signature' | 'keywords' | 'short' | 'ware'
> & { beliefs: Pick<Studio['beliefs'][number], 'title'>[] } = {
  /** 1.1 */
  one: 'Molis AI is a studio making AI products for work, life, and experiences.',
  /** 品牌愿景与落款：推荐译法，候选见文风说明 */
  vision: 'Technology, back to human scale.',
  signature: 'Always curious, always making.',
  keywords: ['Curiosity', 'Making', 'Human scale'],

  /** 1.2 */
  short: [
    'Molis AI is a studio making AI products for work, life, and experiences. We make products we actually like using, and we hope to meet people whose taste runs close to ours.',
    'With Molis Work, we’re exploring how people and AI work together. With Molis Tool, we bring tools to whatever is in front of you. We’re also exploring Molis Life, which takes care of wishes and errands, and Molis Story, worlds you can step into that respond to you.',
    'We hope the abilities technology brings can become choices in people’s hands: to do the work well, and still have room to live, explore, and create.',
  ],
  ware: {
    title:
      'Molis AI is a studio making AI products for work, life, and experiences.',
    view: 'We make products we actually like using, and we hope to meet people whose taste runs close to ours.',
  },

  /** 1.4 的六句标题 */
  beliefs: [
    { title: 'Have a point of view, and the skill to make it real.' },
    { title: 'Ask if it’s worth doing. Then do the math, line by line.' },
    { title: 'Find our people, not shelf space.' },
    { title: 'A vision is a hypothesis, not a creed.' },
    { title: 'People make the calls. Execution can be handed off.' },
    {
      title:
        'Help more people become makers, and help their work find its first believers.',
    },
  ],
};
