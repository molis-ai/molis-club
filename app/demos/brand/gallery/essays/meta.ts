import stories from '../../../../../content/stories.json';
import { folioStudio } from '../../../../../content/folio';

// 文章的数据与页面标题：原文在 content/stories.json，目录摘要在 folioStudio.essays，和 Folio 读同一份。

/** 两位数编号：01、02 */
export const pad = (index: number) => String(index + 1).padStart(2, '0');

/** 一篇文章在目录里需要的全部信息：编号、拆开的标题与副题、摘要、篇幅 */
export function essayEntry(slug: string) {
  const { items } = folioStudio.essays;
  const index = items.findIndex((entry) => entry.slug === slug);
  const item = items[index];
  const story = stories.find((entry) => entry.slug === slug)!;
  const [title, subtitle] = story.title.split('：');
  return {
    slug,
    index,
    number: pad(index),
    item,
    story,
    title,
    subtitle,
    /** 与 Folio 相同的算法：每 500 字算一分钟 */
    minutes: Math.ceil(story.body.length / 500),
  };
}

/** 文章页的标题与描述：标题用原文标题，描述沿用目录摘要；样张不进搜索引擎 */
export function essayMetadata(slug: string) {
  const { story, item } = essayEntry(slug);
  return {
    title: { absolute: `${story.title} · Molis AI` },
    description: item.description,
    robots: { index: false, follow: false },
  };
}
