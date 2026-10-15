import type { CSSProperties, ReactNode } from 'react';
import type { Picture } from './media';

// 作品集里的「图版」：照片用负责人的雾感版品牌图（public/r8-materials-mist-v1），载入前铺平均色。
// 满幅照片屏：照片占满一屏，只在角上留一行图版号与图注；往下滚时照片极慢地移一点。

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export function Photo({
  image,
  alt = '',
  focus,
  sizes = '100vw',
  eager = false,
  className = '',
}: {
  image: Picture;
  alt?: string;
  focus?: string;
  sizes?: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <img
      className={`fo-photo ${className}`}
      src={image.src}
      srcSet={image.srcSet || undefined}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={focus ? { objectPosition: focus } : undefined}
    />
  );
}

/** 满幅照片屏：一张照片、一个图版号、一行图注，别的什么都没有 */
export function FullPlate({
  folio,
  plate,
  caption,
  color,
  children,
  className = '',
  label,
}: {
  /** 页边上这一屏的名字 */
  folio: string;
  plate: string;
  caption: ReactNode;
  color: string;
  children: ReactNode;
  className?: string;
  /** 给读屏的说明：照片里是什么 */
  label?: string;
}) {
  return (
    <section
      className={`fo-full ${className}`}
      data-folio={folio}
      data-tone="film"
      data-scene
      aria-label={label}
      style={{ '--avg': color } as Vars}
    >
      <div className="fo-full-media">{children}</div>
      <p className="fo-full-caption">
        <span className="fo-plate-no" lang="en">
          {plate}
        </span>
        <span className="fo-plate-text">{caption}</span>
      </p>
    </section>
  );
}
