// 「文章」：《人的尺度》《落地主义》，正文来自 content/stories.json（原文不改）。
// 作者署名「一骏」见 content/members.ts（这里不 import 旧模块，只抄名字）。
// 列表页的标题与导语取自 docs/studio-intro.md 2.2（原句）；每篇的摘句取自文章正文（原句）。
// 标「新写」的是界面文字。

// 带 type: 'json'，这样 node --test 也能直接 import 这个模块
import stories from '../stories.json' with { type: 'json' };

export type Story = (typeof stories)[number];

export const AUTHOR = '一骏';

export const essaysPage = {
  /** 新写 */
  kicker: '文章',
  /** studio-intro 2.2 */
  title: '当越来越多想法能够被做出来，选择做什么、为什么做，反而变得更重要。',
  /** studio-intro 2.2 第一段 */
  lead: '在整理 Molis 的介绍时，一骏曾打算把仓库摊开，让作品自己说话。他在《人的尺度》里回顾过这个过程：整理到一半，发现那些记录能说明做了什么，仍然回答不了为什么做。',
};

/** 每篇一句摘句（文章正文原句），用作列表页摘要与页面描述 */
export const excerpts: Record<string, string> = {
  'human-scale':
    '在一个机器什么都做得了的时代，做新东西这件事还成立吗？理想主义还活得好好的吗？',
  idealism:
    '做一件事，先问“这件事值不值得存在”，还是先问“有没有人为它买单”——不同的次序，对应着不同的思考方式。',
};

/** 界面文字（新写） */
export const essayUi = {
  all: '全部文章',
  read: '读全文',
  next: '接着读',
  toc: '本篇目录',
  words: (n: number) => `约 ${n} 字`,
  minutes: (n: number) => `读完约 ${n} 分钟`,
  notFound: '没有这篇文章',
  /** 展厅 03「文章」开场的三个数与「为什么写」一屏 */
  facts: { essays: '文章', sections: '小节', minutes: '读完约（分钟）' },
  why: '为什么写',
};

export const essays: Story[] = stories;

export const findEssay = (slug: string) =>
  essays.find((story) => story.slug === slug);

/** 标题按第一个全角冒号分成主标题与副标题 */
export function splitTitle(title: string) {
  const at = title.indexOf('：');
  return at < 0
    ? { main: title, sub: '' }
    : { main: title.slice(0, at), sub: title.slice(at + 1) };
}

/** 正文字数（去掉 Markdown 记号与空白），按百取整；阅读时长按每分钟 500 字 */
export function essayLength(body: string) {
  const count = body
    .replace(/^(#+ |> |\d+\. |[-*] |---$)/gm, '')
    .replace(/\*/g, '')
    .replace(/\s/g, '').length;
  return {
    words: Math.round(count / 100) * 100,
    minutes: Math.ceil(count / 500),
  };
}

/** 下一篇：按列表顺序轮转 */
export function nextEssay(slug: string) {
  const index = essays.findIndex((story) => story.slug === slug);
  return essays[(index + 1) % essays.length];
}
