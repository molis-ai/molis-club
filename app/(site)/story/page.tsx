import { pageMetadata } from '../../../lib/site';
import { products, relations } from '../../../content/site/products';
import {
  further,
  hereList,
  rhythmPart,
  storyGo,
  storyProgress,
} from '../../../content/site/story';
import { ProductEnding, ProductHero } from '../../_site/product/product';
import { contactHref, productHref } from '../../_site/routes';
import { Btn, More, Note, pad, Phrases } from '../../_site/ui';
import { VideoWindow } from '../../_site/video';
import { HereChip, HereList, HereProvider, Worlds } from './here';
import '../../_site/demo/demo.css';
import '../../_site/product/product.css';
import './story.css';

const story = products.story;

export const metadata = pageMetadata(
  `${story.name} · ${story.headline}`,
  story.what + story.opening[1],
  productHref.story,
);

// Molis Story：全站唯一允许变深变浓的一页，但只在窗里面。页面本身就是「此处」。
// 四个世界各一扇拱窗：滚进去窗放大到整屏，换成这个世界的颜色，演一个瞬间；再滚，画面收回成窗，回到白纸。
export default function StoryPage() {
  return (
    <HereProvider>
      <div className="m-product m-story">
        <ProductHero
          product={story}
          visual={
            <VideoWindow
              name="story-sky"
              className="m-phero-window"
              ratio="4 / 5"
              focus="50% 40%"
              caption="Warm light on the clouds"
            />
          }
        />
        <section className="st-place m-wrap" aria-labelledby="st-place-title">
          <header className="m-head" data-size="h2" data-reveal>
            <p className="m-head-meta">
              <span className="m-no" aria-hidden="true">
                {pad(0)}
              </span>
              <span className="m-kicker">{hereList.kicker}</span>
            </p>
            <h2 className="m-head-title" id="st-place-title">
              <Phrases text={hereList.title} />
            </h2>
            <div className="m-head-lead">
              {hereList.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <p className="st-place-note">
                <Note>{hereList.note}</Note>
              </p>
            </div>
          </header>
          <HereList />
        </section>
        <Worlds />
        <section className="m-part m-wrap st-rhythm" aria-labelledby="st-rhythm-title">
          <header className="m-head" data-size="h2" data-reveal>
            <p className="m-head-meta">
              <span className="m-no" aria-hidden="true">
                {pad(5)}
              </span>
              <span className="m-kicker">{rhythmPart.kicker}</span>
            </p>
            <h2 className="m-head-title" id="st-rhythm-title">
              <Phrases text={rhythmPart.title} />
            </h2>
            <div className="m-head-lead">
              {rhythmPart.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </header>
          <div className="st-further" data-reveal>
            <p className="m-kicker">{further.kicker}</p>
            <p>{further.text}</p>
            <Note>{further.tag}</Note>
          </div>
        </section>
        <ProductEnding
          product={story}
          start={6}
          progress={{
            have: storyProgress.have,
            notYet: storyProgress.notYet,
            now: {
              text: storyProgress.now,
              links: <More href={contactHref('story')}>{storyGo.follow}</More>,
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
              <Btn href={contactHref('story')}>{storyGo.follow}</Btn>
              <More href={productHref.world}>{storyGo.world}</More>
            </>
          }
        />
        <HereChip />
      </div>
    </HereProvider>
  );
}
