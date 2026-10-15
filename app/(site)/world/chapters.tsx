'use client';
import { worldChapters } from '../../../content/site/world';
import { Chapters } from '../../_site/product/chapters';
import { worldScenes } from '../../_site/scenes/world';

// World 页的主线：一个地方慢慢长大，三章，都画在绘图桌上。
export function WorldChapters() {
  return (
    <Chapters
      label="Molis World 的画面全部是概念示意：还没有原型，画面里的地方与旅程都是设想。"
      view="16 / 10"
      chapters={worldChapters.map((chapter) => ({
        ...chapter,
        scene: worldScenes[chapter.id],
      }))}
    />
  );
}
