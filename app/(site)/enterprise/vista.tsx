import { enterprise } from '../../../content/site/enterprise';
import { mediaOf, type Vars } from '../../_site/ui';

// 合作路线前的一屏（负责人 2026-10-19：换图、满幅、文字再精炼，要有沉浸式的过渡感）。
// 从「你们卡在哪」的纸面往下滚，一张图像一扇窗从纸里开到满屏（读 --p），开满后钉住；
// 再往下滚（读 --pin），开场第三段原句一拍一拍浮上来：先是引子「我们和你们一起」，再是三拍，
// 新的一拍从虚到实对上焦浮上来，前一拍退半步，最后三拍一起亮着；图同时极慢地往回拉开一点，像走进这间屋子。
// 层次（负责人 2026-10-19）：三拍往右一级级错开，像一步一步往前走；每拍里要紧的词（场景、工具与流程、方法）最亮，
// 其余的字退一档；压字的暗只铺在左下，窗外的山留得最亮，前景的字、屋里的人、远处的山分出前后。
// 只用原生滚动与 useSiteMotion 写的两个进度，不另挂脚本。没有 JS 与减少动态：图开满、不推拉，整句都在。
// 顶栏压在图上时透明白字：data-tone 挂在钉住的那一屏上（它的上沿碰到顶栏时窗已经开满，裁切只剩一两像素）。

const { vista } = enterprise;
export type Plate = keyof typeof vista.plates;
export const plates = Object.keys(vista.plates) as Plate[];

/** 每一拍开始浮上来时的 --pin；引子在最前面 */
const LEAD_AT = 0.04;
const beatAt = (index: number) => 0.14 + index * 0.2;

export function Vista({ plate = 'a' }: { plate?: Plate }) {
  const image = mediaOf(`enterprise-vista-${plate}`);
  const { alt, focus } = vista.plates[plate];
  return (
    <section
      className="m-ent-vista"
      id="together"
      data-scene
      aria-labelledby="ent-vista-title"
    >
      <div className="m-ent-vista-stick" data-tone="film">
        <div
          className="m-ent-vista-media"
          style={{ '--avg': image.avg } as Vars}
        >
          <img
            src={image.src}
            srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
            sizes="100vw"
            width={image.width}
            height={image.height}
            alt={alt}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: focus }}
          />
        </div>
        <div className="m-ent-vista-body">
          <h2 className="m-ent-vista-line" id="ent-vista-title">
            <span
              className="m-ent-vista-lead"
              style={{ '--t': LEAD_AT } as Vars}
            >
              {vista.lead}
            </span>
            {vista.beats.map(([before, key, after], index) => (
              <span
                key={key}
                className="m-ent-vista-beat"
                style={
                  {
                    '--t': beatAt(index),
                    '--next':
                      index < vista.beats.length - 1 ? beatAt(index + 1) : 9,
                    '--step': index,
                  } as Vars
                }
              >
                {before}
                {/* 要紧的词和后面的尾巴不拆开：窄屏折行折在它前面 */}
                <span className="m-ent-vista-key">
                  <b>{key}</b>
                  {after}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
