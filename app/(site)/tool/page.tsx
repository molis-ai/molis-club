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
import type { ReactNode } from 'react';
import { Btn, More, Note, Status, Window, type Vars } from '../../_site/ui';
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

// Molis Tool（specs/site-rebuild/tool-page.md 第 11 节）：展厅的墙。
// 首屏光标演示 → 以前与现在 → 由近到远的三层 → 眼前的小事 → 插件 → 分寸 → 收尾，一屏一个重点。
// 每屏一面安静的墙（亚麻、月白、雾、沙、石板），唯一亮的颜色是选中色；动作的颜色都压低了。
// 演示里光标是主角，带着人看：一次只动一样，选中 → 动作条 → 按下 → 结果在原处发生。
// 这一页本身就是 Tool：任意选中一段字，光标旁出现动作条；「清理格式」、插件开关访客可以亲手按。

/** 标题按标点分成不断行的几截；mark 那几个字像被选中一样铺上选中色 */
function Marked({ text, mark }: { text: string; mark?: string }) {
  const parts = text.match(/[^，。、；！？：]+[，。、；！？：]?/g) ?? [text];
  return (
    <>
      {parts.map((part, index) => {
        const at = mark ? part.indexOf(mark) : -1;
        return (
          <span key={index} className="m-phrase">
            {at < 0 || !mark ? (
              part
            ) : (
              <>
                {part.slice(0, at)}
                <mark className="tl-mark">{mark}</mark>
                {part.slice(at + mark.length)}
              </>
            )}
          </span>
        );
      })}
    </>
  );
}

/** 区块开头：一行小标签 + 大标题（新块不加墨线和编号） */
function Head({
  id,
  kicker,
  title,
  mark,
  size,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  mark?: string;
  size?: 'h2';
  children?: ReactNode;
}) {
  return (
    <header className="tl-head" data-size={size} data-reveal>
      <p className="m-kicker">{kicker}</p>
      <h2 className="tl-head-title" id={id}>
        <Marked text={title} mark={mark} />
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
          data-wall="linen"
          aria-labelledby="tl-shift-title"
        >
          <div className="m-wrap">
            <Head
              id="tl-shift-title"
              kicker={shift.kicker}
              title={shift.title}
              mark={shift.mark}
            />
            <Shift />
          </div>
        </section>

        <section
          className="tl-sec"
          data-wall="moon"
          aria-labelledby="tl-layers-title"
        >
          <div className="m-wrap">
            <Head
              id="tl-layers-title"
              kicker={layers.kicker}
              title={layers.title}
              mark={layers.mark}
            />
            <Relay />
          </div>
        </section>

        <section
          className="tl-sec tl-gal-sec"
          data-wall="mist"
          aria-labelledby="tl-moments-title"
        >
          <Moments
            head={
              <Head
                id="tl-moments-title"
                kicker={moments.kicker}
                title={moments.title}
                mark={moments.mark}
              >
                <p className="tl-head-lead">{moments.lead}</p>
              </Head>
            }
          />
        </section>

        <section
          className="tl-sec"
          data-wall="sand"
          aria-labelledby="tl-plugins-title"
        >
          <div className="m-wrap tl-split" data-side="plug">
            <Head
              id="tl-plugins-title"
              kicker={plugins.kicker}
              title={plugins.title}
              mark={plugins.mark}
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
          data-wall="slate"
          aria-labelledby="tl-measure-title"
        >
          <div className="m-wrap tl-measure">
            <Head
              id="tl-measure-title"
              kicker={measure.kicker}
              title={measure.title}
              mark={measure.mark}
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

        <section
          className="tl-sec tl-end"
          data-wall="paper"
          aria-labelledby="tl-end-title"
        >
          <div className="m-wrap">
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
                <p className="tl-end-go">
                  <Btn href={contactHref('tool')}>{toolGo.follow}</Btn>
                </p>
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
          </div>
        </section>
      </div>
    </SelectionBar>
  );
}
