import { pageMetadata } from '../../../lib/site';
import { products } from '../../../content/site/products';
import { toolGo, toolProgress } from '../../../content/site/tool';
import { ProductHero } from '../../_site/product/product';
import { COMMUNITY, contactHref, productHref } from '../../_site/routes';
import { Btn, More, Note, Phrases, Status } from '../../_site/ui';
import { PaperByWindow, TryHint } from './hero';
import { SelectionBar } from './selection';
import { Wall } from './wall';
import '../../_site/product/product.css';
import './tool.css';

const tool = products.tool;

export const metadata = pageMetadata(
  `${tool.name} · ${tool.headline}`,
  tool.what + tool.opening[2],
  productHref.tool,
);

// Molis Tool：最轻、最短的一页（specs/site-rebuild/tool-page.md）。这一页本身就是 Tool：
// 不画任何应用窗口，整页任意选中一段字，光标旁出现动作条，选的东西不同、第一个动作不同。
// 首屏是窗前一张纸；往下是一面白墙，一个下午的几件小事挂在墙上；最后一屏收尾。
export default function ToolPage() {
  const { blocks } = toolProgress;
  return (
    <SelectionBar>
      <div className="m-product m-tool">
        <ProductHero
          product={tool}
          visual={<PaperByWindow />}
          aside={<TryHint />}
        />

        <Wall />

        <section className="tl-end m-wrap" aria-labelledby="tl-end-title">
          <header className="m-head" data-size="h2" data-reveal>
            <p className="m-head-meta">
              <span className="m-no" aria-hidden="true">
                02
              </span>
              <span className="m-kicker">适合这样的时刻</span>
            </p>
            <h2 className="m-head-title" id="tl-end-title">
              <Phrases text={tool.fit} />
            </h2>
          </header>

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
              style={{ '--delay': '120ms' } as React.CSSProperties}
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
