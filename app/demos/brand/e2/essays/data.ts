import stories from '../../../../../content/stories.json';
import { folioStudio } from '../../../../../content/folio';

// E2 文章的数据：原文在 content/stories.json，摘要与顺序沿用 folioStudio.essays。
// 列表页、阅读页和 metadata 都从这里取，标题在全角冒号处拆成主标题与副题，阅读时长按 Folio 的算法。

export const essayItems = folioStudio.essays.items;

export type EssayHeading = { text: string; id: string };

export function essayAt(slug: string) {
  const index = essayItems.findIndex((item) => item.slug === slug);
  const item = essayItems[index];
  const story = stories.find((entry) => entry.slug === slug)!;
  const [title, subtitle] = story.title.split('：');
  /** 按空行分段；以「## 」开头的是小节标题，id 用段落序号，和 Folio 一致 */
  const blocks = story.body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const headings: EssayHeading[] = blocks.flatMap((text, at) =>
    text.startsWith('## ')
      ? [{ text: text.slice(3), id: `section-${at}` }]
      : [],
  );
  return {
    index,
    item,
    story,
    title,
    subtitle,
    blocks,
    headings,
    minutes: Math.ceil(story.body.length / 500),
  };
}
