import { community, communityUi } from '../../../content/site/community';
import { exUi } from '../../../content/site/exhibit';
import { mediaOf } from '../../_site/ui';
import type { Vars } from '../../_site/ui';

// 社区首屏「大幅插画」（负责人 2026-10-24 定 b，D2）：不开窗，不用椭圆软边。
// 插画通栏铺满上面大半屏，上沿给顶栏留一层淡雾，下沿淡进纸里；标题放大，
// 第一行压在淡出的那一截上，第二行往右错开半步，和画面咬在一起。

export function Hero() {
  const image = mediaOf('art-window');
  const art = communityUi.art['art-window'];
  const [titleA, titleB] = community.title[0].split(/(?<=，)/);
  return (
    <header className="m-com-hero" data-tone="light">
      <figure className="m-com-hero-media" data-open>
        <div className="m-com-hero-plate">
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
        </div>
        <figcaption className="m-com-art-name m-com-hero-cap">
          {art.title} · {exUi.medium.album}
        </figcaption>
      </figure>
      <div className="m-com-hero-body m-wrap">
        <h1 className="m-com-title m-rise">
          <span>{titleA}</span>
          <span>{titleB}</span>
        </h1>
        <p className="m-com-sub m-rise" style={{ '--delay': '140ms' } as Vars}>
          {community.title[1]}
        </p>
      </div>
    </header>
  );
}
