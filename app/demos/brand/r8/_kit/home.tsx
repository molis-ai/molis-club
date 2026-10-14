'use client';
import { AiWordCycle } from '../../ai-words';
import { Page } from './chrome';
import { Closing } from './closing';
import { studio } from './data';
import type { DirectionId } from './directions';
import {
  Film,
  Footage,
  FootageToggle,
  useFootagePlaying,
  type Clip,
} from './footage';
import { Products } from './products';
import { ProductsIntro } from './intro';
import { Ware, type WareMotion } from './ware';

// 写实版首页的骨架，三个方向共用：只换三段影像、换词的动作和纸面的颜色。
// 首屏与那句话共用一卷胶片（第一段钉在视口里，读到那句话时溶进第二段）；
// 第二段（那句话的背景）都是有人在「做」东西：画室里作画、草地上画画、天空下写生、海边画海。
// 产品列表在安静的纸面上；结尾是一段明亮、有朝气的影像，大句和三张磨砂卡都在这一块画面里。

export type Reel = { hero: Clip; ware: Clip; close: Clip };

export function RealHome({
  direction,
  reel,
  motion,
  bright = false,
  productsBackdrop,
  closeTone = 'bright',
  intro = false,
}: {
  direction: DirectionId;
  reel: Reel;
  motion: WareMotion;
  /** 首屏画面很亮（例如白墙展厅）：首屏用深色字，像一张展览海报 */
  bright?: boolean;
  /** 产品列表整段的背景配图（Mix 版用）；列表放在一层磨砂的纸上 */
  productsBackdrop?: Clip;
  /** 结尾画面：bright 用深色字和白色磨砂卡，dark 用白字 */
  closeTone?: 'bright' | 'dark';
  /** 产品列表用按产品介绍第 3、4 章重写的那一份（先在美术馆的午后试） */
  intro?: boolean;
}) {
  const { playing, toggle } = useFootagePlaying();
  return (
    <Page direction={direction}>
      <Film
        first={reel.hero}
        second={reel.ware}
        playing={playing}
        bright={bright}
      >
        <section
          className="r8-hero r8-real-hero"
          data-tone={bright ? 'bright' : undefined}
          aria-labelledby="r8-title"
        >
          <div className="r8-real-copy">
            <h1 id="r8-title" className="r8-mark" lang="en">
              Molis AI
            </h1>
            <AiWordCycle prefix="r8" />
          </div>
          <div className="r8-real-foot">
            <FootageToggle playing={playing} toggle={toggle} />
            <p className="r8-keys">
              {studio.keywords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </p>
          </div>
        </section>
        <Ware motion={motion} />
      </Film>
      {intro ? (
        <ProductsIntro />
      ) : (
        <Products
          backdrop={
            productsBackdrop ? (
              <Footage clip={productsBackdrop} playing={playing} />
            ) : undefined
          }
        />
      )}
      <Closing
        tone={closeTone}
        scene={
          <>
            <Footage clip={reel.close} playing={playing} />
            <span className="r8-close-veil" aria-hidden="true" />
          </>
        }
      />
    </Page>
  );
}
