import { pageMetadata } from '../../../lib/site';
import { products, relations } from '../../../content/site/products';
import { freeTime, lifeGo, lifeProgress } from '../../../content/site/life';
import { ProductEnding, ProductHero } from '../../_site/product/product';
import { contactHref, productHref } from '../../_site/routes';
import { Btn, More, Note, pad } from '../../_site/ui';
import { LifeChapters } from './chapters';
import { FreeTime } from './free-time';
import '../../_site/demo/demo.css';
import '../../_site/product/product.css';
import './life.css';

const life = products.life;

export const metadata = pageMetadata(
  `${life.name} · ${life.headline}`,
  life.what + life.opening[1],
  productHref.life,
);

// Molis Life：节奏最慢、留白最多，主色海水浅蓝与沙色。给被琐事占着心、又有一直想做的事的人。
export default function LifePage() {
  return (
    <div className="m-product m-life">
      <ProductHero
        product={life}
        window={{
          name: 'life-shore',
          alt: '海边，一个孩子站在水边。',
          focus: '96% 50%',
          caption: 'A child by the water',
        }}
      />
      <LifeChapters />
      <section className="m-sig" aria-labelledby="lf-free-title">
        <header className="m-head" data-size="h2" data-reveal>
          <p className="m-head-meta">
            <span className="m-no" aria-hidden="true">
              {pad(5)}
            </span>
            <span className="m-kicker">{freeTime.kicker}</span>
          </p>
          <h2 className="m-head-title" id="lf-free-title">
            {freeTime.title}
          </h2>
          <div className="m-head-lead">
            <p className="lf-free-note">
              <Note>{freeTime.note}</Note>
            </p>
          </div>
        </header>
        <div className="m-sig-box">
          <FreeTime />
        </div>
      </section>
      <ProductEnding
        product={life}
        start={6}
        progress={{
          have: lifeProgress.have,
          notYet: lifeProgress.notYet,
          now: {
            text: lifeProgress.now,
            links: <More href={contactHref('life')}>{lifeGo.follow}</More>,
          },
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
        go={
          <>
            <Btn href={contactHref('life')}>{lifeGo.follow}</Btn>
            <More href={productHref.story}>{lifeGo.story}</More>
          </>
        }
      />
    </div>
  );
}
