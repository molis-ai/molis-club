'use client';
import { lifeChapters } from '../../../content/site/life';
import { Chapters } from '../../_site/product/chapters';
import { lifeScenes } from '../../_site/scenes/life';

// Life 页的主线：几周里的一件挂念和一个心愿，四章。
export function LifeChapters() {
  return (
    <Chapters
      label="Molis Life 的演示画面都是原型示意，真实模型和外部服务尚未接入，画面里的事项都是示意数据。"
      view="16 / 10.5"
      chapters={lifeChapters.map((chapter) => ({
        ...chapter,
        scene: lifeScenes[chapter.id],
      }))}
    />
  );
}
