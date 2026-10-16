'use client';
import { workActs } from '../../../content/site/work';
import { Chapters } from '../../_site/product/chapters';
import { workActScenes } from '../../_site/scenes/work';
import { usePersona } from './persona';

// 四幕：递、接、长、一起干。桌面左文右图、画面钉住，滚到哪一步演到哪一步；手机上画面在文字上方。
// 两种读者各一套案例；换读者时整组重新挂上，从第一幕开始。
export function WorkActs() {
  const { persona } = usePersona();
  return (
    <Chapters
      key={persona}
      start={2}
      view="16 / 9.2"
      label="Molis Work 的演示画面都是界面示意，画面里的项目、人名、数字都是示意数据。"
      chapters={workActs[persona].map((act) => ({
        id: act.id,
        kicker: act.kicker,
        tag: act.tag,
        title: act.title,
        paragraphs: [act.lead],
        steps: act.steps,
        scene: workActScenes[persona][act.id],
      }))}
    />
  );
}
