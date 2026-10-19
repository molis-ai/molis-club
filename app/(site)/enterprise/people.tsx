'use client';
import { useRef, type PointerEvent } from 'react';
import { enterprise } from '../../../content/site/enterprise';
import { TEAM } from '../../_site/routes';
import { mediaOf, More, Phrases, type Vars } from '../../_site/ui';
import { tilt, untilt } from './keeps';

// 做这件事的人：一屏满幅的白墙转角（品牌图库 C5），天窗的光斜斜落下来；不按人分，只写团队。
// 左上是标题与 5.5 导语；墙脚一排四张半透明的卡，按 FDE 的常见流程排：
// 诊断 → 方案 → 构建 → 核验与交接。每张写这一步做什么、几个能力点，卡底是与这一步相关的团队经历背书。
// 个人介绍留给团队页。
// 只在旧版（?study=current）里用；主线改成「为什么我们可以」（why.tsx）。
// 鼠标在墙前移动，照片跟着轻轻错开一点（像站在墙前换了个角度）；停在卡上，卡浮起、跟着鼠标倾斜，
// 顶边亮一道杏橙，能力点依次亮起来。窄屏上照片收成上方一条，四张卡竖着排（手机左右滑）。

const { people } = enterprise;
const pad = (n: number) => String(n).padStart(2, '0');

export function People() {
  const image = mediaOf('tool-light');
  const frame = useRef(0);

  /** 照片跟着鼠标错开一点：只对鼠标，每帧最多写一次 */
  const drift = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    const node = event.currentTarget;
    const box = node.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width - 0.5) * 2;
    const y = ((event.clientY - box.top) / box.height - 0.5) * 2;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      node.style.setProperty('--px', x.toFixed(3));
      node.style.setProperty('--py', y.toFixed(3));
    });
  };

  return (
    <section
      className="m-ent-people"
      id="people"
      aria-labelledby="ent-people-title"
      onPointerMove={drift}
    >
      <div
        className="m-ent-people-photo"
        style={{ '--avg': image.avg } as Vars}
      >
        <img
          src={image.src}
          srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
          sizes="100vw"
          width={image.width}
          height={image.height}
          alt={people.alt}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="m-ent-people-body m-wrap">
        <header className="m-ent-people-head" data-reveal>
          <p className="m-kicker">{people.kicker}</p>
          <h2 className="m-ent-people-title" id="ent-people-title">
            <Phrases text={people.title} />
          </h2>
          <p className="m-ent-people-lead">{people.lead}</p>
        </header>

        <ol className="m-ent-caps" data-reveal>
          {people.abilities.map((ability, index) => {
            return (
              <li
                key={ability.title}
                className="m-cap"
                style={{ '--i': index } as Vars}
                onPointerMove={tilt}
                onPointerLeave={untilt}
              >
                <p className="m-cap-stage">
                  <span aria-hidden="true">{pad(index + 1)}</span>
                  {ability.stage}
                </p>
                <h3 className="m-cap-title">{ability.label}</h3>
                <p className="m-cap-does">{ability.does}</p>
                <ul className="m-cap-points">
                  {ability.points.map((point, at) => (
                    <li key={point} style={{ '--j': at } as Vars}>
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="m-cap-record">
                  <span>{people.recordLabel}</span>
                  {ability.record}
                </p>
              </li>
            );
          })}
        </ol>

        <footer className="m-ent-people-end">
          <p>{people.note}</p>
          <More href={TEAM}>{people.link}</More>
        </footer>
      </div>
    </section>
  );
}
