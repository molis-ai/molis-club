import { community, communityUi } from '../../../content/site/community';
import { exUi } from '../../../content/site/exhibit';
import { mediaOf, type Vars } from '../../_site/ui';

// 社区首屏（负责人 2026-10-24：首屏要有存在感，D2）。两版样张，?hero=a|b 切换，默认 a。不再用椭圆的软边。
// a「满幅开窗」：标题先落在纸上，右上一扇小窗；顺着原生滚动，窗开到满屏，标题留在画面左下
//   （读 --pin，同企业合作的开窗）。画面开出来时，底下和左边浮起一层纸色的雾托住墨字。
//   没有 JS、减少动态时直接是开满的画面。顶栏压在画面上时透明墨字（画面上沿是白墙和窗外的天）。
// b「大幅插画」：不开窗。插画通栏铺满上面大半屏，下沿淡进纸里；标题放大，
//   第一行压在淡出的那一截上，第二行往右错开半步，和画面咬在一起。

export type HeroVariant = 'a' | 'b';

export function Hero({ variant }: { variant: HeroVariant }) {
  const image = mediaOf('art-window');
  const art = communityUi.art['art-window'];
  const [titleA, titleB] = community.title[0].split(/(?<=，)/);
  const picture = (
    <img
      src={image.src}
      srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
      sizes="100vw"
      width={image.width}
      height={image.height}
      alt={art.alt}
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  );
  const caption = (
    <figcaption className="m-com-art-name m-com-hero-cap">
      {art.title} · {exUi.medium.album}
    </figcaption>
  );
  const words = (
    <div className="m-com-hero-body m-wrap">
      <h1 className="m-com-title m-rise">
        <span>{titleA}</span>
        <span>{titleB}</span>
      </h1>
      <p className="m-com-sub m-rise" style={{ '--delay': '140ms' } as Vars}>
        {community.title[1]}
      </p>
    </div>
  );

  if (variant === 'b')
    return (
      <header className="m-com-hero" data-hero="b" data-tone="light">
        <figure className="m-com-hero-media" data-open>
          <div className="m-com-hero-plate">{picture}</div>
          {caption}
        </figure>
        {words}
      </header>
    );

  return (
    <header className="m-com-hero" data-hero="a" data-scene>
      <div className="m-com-hero-stick" data-tone="light">
        <figure className="m-com-hero-media">
          <div
            className="m-com-hero-window"
            style={{ '--avg': image.avg } as Vars}
          >
            {picture}
          </div>
          <div className="m-com-hero-fog" aria-hidden="true" />
          {caption}
        </figure>
        {words}
      </div>
    </header>
  );
}
