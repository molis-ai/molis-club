import { aboutNext, painters } from '../../../content/site/about';
import { studio } from '../../../content/site/studio';
import { pieces } from '../../../content/site/exhibit';
import { Label } from '../../_site/exhibit/exhibit';
import { mediaOf, Phrases, type Vars } from '../../_site/ui';
import { MakersPainting } from './makers-painting';

// 《黑客与画家》一屏（负责人 2026-10-20 定版式；10-22 加开头一句过渡，四张手稿跟着底稿 1.3 那句）：
// 上面一行：左边是负责人写的那句「我们希望带着《黑客与画家》里说的那种匠人精神去创造。」，右边一句收尾「没人细看的地方，也一样认真。」；
// 下面左边是书里写到的那幅画和典故（makers-painting.tsx），右边先是 1.3 那句（书名上面说过了，从「写代码」读起），
// 下面四张「达·芬奇手稿」：产品设计、写代码、拍视频、写故事（负责人 2026-10-20 生成），像四张纸摊在桌上，各歪一点。
// 看到时一张接一张落到桌上，先是淡淡的底稿，再一遍遍描深，最后才是定稿的颜色——正好是那句话说的「先起稿，再一遍遍修改」。
// 停在一张上，那张摆正、抬起来一点。写故事那张右上角的杜松，和画里她身后的杜松是同一种植物。

type Craft = {
  name: Parameters<typeof mediaOf>[0] & Parameters<typeof Label>[0]['piece'];
  /** 摊在桌上歪的角度 */
  tilt: string;
};

/** 四张手稿，顺序同 aboutNext.makers.crafts */
const crafts: Craft[] = [
  { name: 'sketch-design', tilt: '-1.4deg' },
  { name: 'sketch-code', tilt: '1deg' },
  { name: 'sketch-film', tilt: '0.8deg' },
  { name: 'sketch-story', tilt: '-0.9deg' },
];

export function Makers() {
  const sentence = studio.standard.makers;
  // 「像《黑客与画家》里那样，」之后的部分；冒号前后分两档颜色
  const say = sentence.slice(sentence.indexOf('，') + 1);
  const cut = say.indexOf('：') + 1;
  return (
    <div className="mk">
      <div className="mk-head">
        <h2 className="mk-title" id="makers-title">
          <Phrases text={aboutNext.makers.lead} />
        </h2>
        <p className="mk-line">
          <Phrases text={painters.line} />
        </p>
      </div>

      <div className="mk-body">
        <MakersPainting />
        <div className="mk-right">
          <p className="mk-say">
            <Phrases text={say.slice(0, cut)} />
            <span className="mk-say-tail">
              <Phrases text={say.slice(cut)} />
            </span>
          </p>
          <ul className="mk-crafts" data-reveal>
            {crafts.map(({ name, tilt }, index) => {
              const image = mediaOf(name);
              return (
                <li
                  key={name}
                  className="mk-sheet"
                  style={
                    {
                      '--i': index,
                      '--tilt': tilt,
                      '--avg': image.avg,
                    } as Vars
                  }
                >
                  <figure className="mk-craft">
                    <span className="mk-paper">
                      <img
                        src={image.src}
                        srcSet={image.srcset
                          .map(([src, w]) => `${src} ${w}w`)
                          .join(', ')}
                        sizes="(max-width: 900px) 50vw, 26vw"
                        width={image.width}
                        height={image.height}
                        alt={pieces[name].alt}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <figcaption className="mk-craft-name">
                      {aboutNext.makers.crafts[index]}
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
          <p className="mk-crafts-label">
            <Label piece="sketch-design" />
          </p>
        </div>
      </div>
    </div>
  );
}
