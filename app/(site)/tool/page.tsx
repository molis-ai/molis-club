import { pageMetadata } from '../../../lib/site';
import { products } from '../../../content/site/products';
import {
  layers,
  measure,
  moments,
  plugins,
  shift,
  toolGo,
  toolProgress,
} from '../../../content/site/tool';
import { ProductHero } from '../../_site/product/product';
import { COMMUNITY, contactHref, productHref } from '../../_site/routes';
import {
  Btn,
  More,
  Note,
  Phrases,
  Status,
  Window,
  type Vars,
} from '../../_site/ui';
import { Desk, TryHint } from './hero';
import { Moments, Plugins, Relay, Shift } from './scenes';
import { SelectionBar } from './selection';
import '../../_site/product/product.css';
import './tool.css';

const tool = products.tool;

export const metadata = pageMetadata(
  `${tool.name} · ${tool.headline}`,
  tool.what + tool.opening[2],
  productHref.tool,
);

// Molis Tool（specs/site-rebuild/tool-page.md 第 9 节）：骨架取自 Folio 版 Tool 页。
// 首屏光标演示 → 以前与现在 → 由近到远的三层 → 眼前的小事 → 插件 → 分寸 → 收尾，约七屏，一屏一个重点。
// 每屏一面墙色，一个动作一种颜色（翻译天蓝、整理成日程杏橙……），演示里和整页真的动作条用同一套。
// 这一页本身就是 Tool：任意选中一段字，光标旁出现动作条。

/** 区块开头：一行小标签 + 大标题（新块不加墨线和编号） */
function Head({
  id,
  kicker,
  title,
  size,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  size?: 'h2';
  children?: React.ReactNode;
}) {
  return (
    <header className="tl-head" data-size={size} data-reveal>
      <p className="m-kicker">{kicker}</p>
      <h2 className="tl-head-title" id={id}>
        <Phrases text={title} />
      </h2>
      {children}
    </header>
  );
}

export default function ToolPage() {
  const { blocks } = toolProgress;
  return (
    <SelectionBar>
      <div className="m-product m-tool">
        <ProductHero product={tool} visual={<Desk />} aside={<TryHint />} />

        <section
          className="tl-sec"
          data-wall="white"
          aria-labelledby="tl-shift-title"
        >
          <div className="m-wrap">
            <Head
              id="tl-shift-title"
              kicker={shift.kicker}
              title={shift.title}
            />
            <Shift />
          </div>
        </section>

        <section
          className="tl-sec"
          data-wall="sky"
          aria-labelledby="tl-layers-title"
        >
          <div className="m-wrap">
            <Head
              id="tl-layers-title"
              kicker={layers.kicker}
              title={layers.title}
            />
            <Relay />
          </div>
        </section>

        <section
          className="tl-sec"
          data-wall="rose"
          aria-labelledby="tl-moments-title"
        >
          <div className="m-wrap tl-split">
            <Head
              id="tl-moments-title"
              kicker={moments.kicker}
              title={moments.title}
            >
              <p className="tl-head-lead">{moments.lead}</p>
              <p className="tl-head-foot">{moments.wip}</p>
              <Note>{moments.note}</Note>
            </Head>
            <Moments />
          </div>
        </section>

        <section
          className="tl-sec"
          data-wall="butter"
          aria-labelledby="tl-plugins-title"
        >
          <div className="m-wrap tl-split" data-side="plug">
            <Head
              id="tl-plugins-title"
              kicker={plugins.kicker}
              title={plugins.title}
            >
              <dl className="tl-facts">
                {plugins.facts.map((fact) => (
                  <div key={fact.title}>
                    <dt>{fact.title}</dt>
                    <dd>{fact.text}</dd>
                  </div>
                ))}
              </dl>
            </Head>
            <Plugins />
          </div>
        </section>

        <section
          className="tl-sec"
          data-wall="navy"
          aria-labelledby="tl-measure-title"
        >
          <div className="m-wrap tl-measure">
            <Head
              id="tl-measure-title"
              kicker={measure.kicker}
              title={measure.title}
            />
            <Window
              className="tl-measure-photo"
              name="ex-skylight"
              alt={measure.photo.alt}
              ratio="3 / 2"
              caption={measure.photo.caption}
              sizes="(max-width: 900px) 100vw, 40vw"
            />
            <div className="tl-promise">
              <div className="tl-is" data-reveal>
                <p className="m-kicker">{measure.is.label}</p>
                <dl>
                  {measure.is.items.map(([term, text]) => (
                    <div key={term}>
                      <dt>{term}</dt>
                      <dd>{text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div
                className="tl-not"
                data-reveal
                style={{ '--delay': '160ms' } as Vars}
              >
                <p className="m-kicker">{measure.not.label}</p>
                <ul>
                  {measure.not.items.map((item, index) => (
                    <li key={item} style={{ '--n': index } as Vars}>
                      <s>{item}</s>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="tl-end m-wrap" aria-labelledby="tl-end-title">
          <Head
            id="tl-end-title"
            kicker="适合这样的时刻"
            title={tool.fit}
            size="h2"
          />

          <div className="tl-end-grid">
            <div className="tl-end-progress" data-reveal>
              <p className="m-kicker">当前进展</p>
              <p className="tl-end-stage">
                <Status>{tool.stage}</Status>
              </p>
              <p className="tl-end-note">{tool.stageNote}</p>
              <div className="tl-blocks">
                <p className="tl-blocks-key">
                  <i aria-hidden="true" />
                  {toolGo.have}
                </p>
                <ul>
                  {blocks.have.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="tl-blocks-key" data-not="">
                  <i aria-hidden="true" />
                  {toolGo.notYet}
                </p>
                <ul data-not="">
                  {blocks.notYet.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <details className="tl-fold">
                <summary>{toolGo.original}</summary>
                {toolProgress.have.map((text) => (
                  <p key={text}>{text}</p>
                ))}
                <p>{toolProgress.notYet[0]}</p>
              </details>
            </div>

            <div
              className="tl-end-side"
              data-reveal
              style={{ '--delay': '120ms' } as Vars}
            >
              <div>
                <p className="m-kicker">{toolGo.relation}</p>
                <p>{toolProgress.notYet[1]}</p>
                <p className="m-actions">
                  <Note>{toolGo.relationTag}</Note>
                  <More href={productHref.work}>{toolGo.work}</More>
                </p>
              </div>
              <div>
                <p className="m-kicker">{toolGo.tryNow}</p>
                <p>
                  {toolGo.now}
                  {toolProgress.siblings}
                </p>
                <p className="m-actions">
                  <More href={`${COMMUNITY}#take`}>{toolGo.community}</More>
                </p>
              </div>
            </div>
          </div>

          <div className="tl-end-go" data-reveal>
            <Btn href={contactHref('tool')}>{toolGo.follow}</Btn>
          </div>
        </section>
      </div>
    </SelectionBar>
  );
}
