'use client';
import { toolChapters } from '../../../content/site/tool';
import { Chapters } from '../../_site/product/chapters';
import { toolScenes } from '../../_site/scenes/tool';

// Tool 页的主线：一个下午手边冒出的几件小事，四章。
export function ToolChapters() {
  return (
    <Chapters
      label="Molis Tool 的演示画面都是界面示意，画面里的材料都是示意数据。"
      view="16 / 10"
      chapters={toolChapters.map((chapter) => ({
        ...chapter,
        scene: toolScenes[chapter.id],
      }))}
    />
  );
}
