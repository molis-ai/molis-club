import { pageMetadata } from '../../../lib/site';
import { products, relations } from '../../../content/site/products';
import { placeTry, worldGo, worldProgress } from '../../../content/site/world';
import { ProductEnding, ProductHero } from '../../_site/product/product';
import { contactHref, productHref } from '../../_site/routes';
import { Btn, Note, pad } from '../../_site/ui';
import { WorldChapters } from './chapters';
import { PlaceIsland } from './place';
import '../../_site/demo/demo.css';
import '../../_site/product/product.css';
import './world.css';

const world = products.world;

export const metadata = pageMetadata(
  `${world.name} · ${world.headline}`,
  world.what + world.opening[0],
  productHref.world,
);

// Molis World：像一张绘图桌，铅笔线、虚线框，故意保留未完成的样子。概念页，篇幅短。
// 整页都是概念设计 / 概念示意；去处只有「关注进展」。
export default function WorldPage() {
  return (
    <div className="m-product m-world">
      <ProductHero
        product={world}
        concept
        window={{
          name: 'world-woods',
          alt: '雾气与光里的树林。',
          focus: '50% 50%',
          caption: 'Woods in mist and light',
        }}
        aside={<Note>概念设计 · 这一页的画面都是概念示意</Note>}
      />
      <WorldChapters />
      <section className="m-sig" aria-labelledby="wd-try-title">
        <header className="m-head" data-size="h2" data-reveal>
          <p className="m-head-meta">
            <span className="m-no" aria-hidden="true">
              {pad(4)}
            </span>
            <span className="m-kicker">{placeTry.kicker}</span>
          </p>
          <h2 className="m-head-title" id="wd-try-title">
            {placeTry.title}
          </h2>
          <div className="m-head-lead">
            <p className="wd-try-note">
              <Note>{placeTry.note}</Note>
            </p>
          </div>
        </header>
        <div className="m-sig-box">
          <PlaceIsland />
        </div>
      </section>
      <ProductEnding
        product={world}
        concept
        start={5}
        progress={{
          have: worldProgress.have,
          notYet: worldProgress.notYet,
          now: { text: worldProgress.now },
        }}
        relation={{
          title: 'Life、Story 与 World',
          formula: (
            <>
              <span>Life</span>
              <i>+</i>
              <span>Story</span>
              <i>=</i>
              <span>World</span>
            </>
          ),
          text: relations.lifeStoryWorld,
          tag: '未来方向 · 尚未打通',
        }}
        go={<Btn href={contactHref('world')}>{worldGo.follow}</Btn>}
      />
    </div>
  );
}
