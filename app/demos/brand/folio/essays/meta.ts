import stories from '../../../../../content/stories.json';
import { folioStudio } from '../../../../../content/folio';

/** 文章页的标题与描述：标题用原文标题，描述沿用目录摘要 */
export function essayMetadata(slug: string) {
  const story = stories.find((entry) => entry.slug === slug)!;
  const item = folioStudio.essays.items.find((entry) => entry.slug === slug)!;
  return {
    title: { absolute: `${story.title} · Molis AI` },
    description: item.description,
  };
}
