'use client';
import { workChapters } from '../../../content/site/work';
import { Chapters } from '../../_site/product/chapters';
import { workScenes } from '../../_site/scenes/work';

// Work 页的主线：八章、每章两到四步。画面与首页舞台共用（首页演一遍，产品页亲手做一遍）。
export function WorkChapters() {
  return (
    <Chapters
      label="Molis Work 的演示画面都是界面示意，画面里的项目、资料、人名与时间都是示意数据。"
      chapters={workChapters.map((chapter) => ({
        ...chapter,
        scene: workScenes[chapter.id],
      }))}
    />
  );
}
