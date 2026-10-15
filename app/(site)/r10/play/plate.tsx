import media from './media.json';

// 照片屏：一屏只有一张照片和一行竖排的小图注，不配正文（照片屏和文字屏分开）。
// bleed 铺满整屏；不铺满时是奶油纸上一扇有边距的窗。

type Photo = keyof typeof media;

export function Plate({
  photo,
  edge,
  caption,
  alt,
  bleed = false,
}: {
  photo: Photo;
  edge: string;
  caption: string;
  alt: string;
  bleed?: boolean;
}) {
  const image = media[photo] as {
    src: string;
    srcset: [string, number][];
    width: number;
    height: number;
    color: string;
  };
  return (
    <section
      className="pl-plate"
      data-bleed={bleed || undefined}
      data-tone={bleed ? 'film' : 'paper'}
      data-edge={edge}
      aria-label={alt}
    >
      <figure className="pl-plate-frame" data-reveal={bleed ? undefined : ''}>
        <img
          src={image.src}
          srcSet={image.srcset.map(([s, w]) => `${s} ${w}w`).join(', ')}
          sizes={bleed ? '100vw' : '(max-width: 900px) 100vw, 62vw'}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          alt={alt}
          style={{ background: image.color }}
        />
        <figcaption>{caption}</figcaption>
      </figure>
    </section>
  );
}
