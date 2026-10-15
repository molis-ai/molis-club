import type { CSSProperties, ReactNode } from 'react';
import type { Picture } from '../media';
import { Photo } from '../plates';

// Work 页的图版屏：一整屏雾色的底，一束光落在中间，Molis Work 真实界面的截图（开发中版本，演示数据）像挂在那里的一幅图版。
// 截图只缩放、裁切、打光，不改里面的内容。往下滚到这一屏时，截图从雾里慢慢清楚（--p，见 app/_site/motion.ts）；
// 减少动态时一直是清楚的。

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export type Shot = {
  image: Picture;
  alt: string;
  /** 只在窄屏或宽屏出现 */
  only?: 'wide' | 'narrow';
  kind?: 'window' | 'phone';
};

function Window({ shot, delay = 0 }: { shot: Shot; delay?: number }) {
  return (
    <div
      className={`fo-window${shot.kind === 'phone' ? ' fo-window-phone' : ''}`}
      data-only={shot.only}
      style={
        {
          '--ratio': `${shot.image.width} / ${shot.image.height}`,
          '--avg': shot.image.color,
          '--delay': delay,
        } as Vars
      }
    >
      <Photo
        image={shot.image}
        alt={shot.alt}
        sizes={
          shot.kind === 'phone' ? '390px' : '(min-width: 960px) 72vw, 92vw'
        }
        className="fo-shot-img"
      />
    </div>
  );
}

export function ShotPlate({
  plate,
  caption,
  shots,
  layout = 'single',
}: {
  plate: string;
  caption: ReactNode;
  shots: Shot[];
  /** night：深一档的底，放深色模式与手机 */
  layout?: 'single' | 'pair' | 'night';
}) {
  return (
    <section
      className="fo-shot"
      data-layout={layout}
      data-folio="PLATE"
      data-tone={layout === 'night' ? 'film' : 'mist'}
      data-scene
    >
      <div className="fo-shot-set">
        {shots.map((shot, index) => (
          <Window key={shot.image.src} shot={shot} delay={index} />
        ))}
      </div>
      <p className="fo-full-caption">
        <span className="fo-plate-no" lang="en">
          {plate}
        </span>
        <span className="fo-plate-text">{caption}</span>
      </p>
    </section>
  );
}

/**
 * 局部放大：截图先整张出现，往下滚时镜头推向一处（ox、oy 是那一处的中心，占整张宽高的比例），
 * 四周暗下去、那一处亮着，像一束光打在上面。钉住的这一段读完就放开。
 */
export function ZoomPlate({
  plate,
  caption,
  detail,
  shot,
  focus,
}: {
  plate: string;
  caption: ReactNode;
  detail: ReactNode;
  shot: Shot;
  focus: { x: number; y: number; scale: number };
}) {
  return (
    <section
      className="fo-zoom"
      data-folio="PLATE"
      data-tone="mist"
      data-scene
      style={
        {
          '--ox': focus.x,
          '--oy': focus.y,
          '--zs': focus.scale,
        } as Vars
      }
    >
      <div className="fo-zoom-stage">
        <div
          className="fo-zoom-window"
          style={
            {
              '--ratio': `${shot.image.width} / ${shot.image.height}`,
              '--avg': shot.image.color,
            } as Vars
          }
        >
          <Photo
            image={shot.image}
            alt={shot.alt}
            sizes="(min-width: 960px) 80vw, 160vw"
            className="fo-shot-img"
          />
          <span className="fo-zoom-light" aria-hidden="true" />
        </div>
        <p className="fo-full-caption">
          <span className="fo-plate-no" lang="en">
            {plate}
          </span>
          <span className="fo-plate-text fo-zoom-whole">{caption}</span>
          <span className="fo-plate-text fo-zoom-detail" aria-hidden="true">
            {detail}
          </span>
        </p>
      </div>
    </section>
  );
}
