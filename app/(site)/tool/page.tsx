import { pageMetadata } from '../../../lib/site';
import { products, relations } from '../../../content/site/products';
import { selectTry, toolGo, toolProgress } from '../../../content/site/tool';
import { ProductEnding, ProductHero } from '../../_site/product/product';
import { contactHref, productHref } from '../../_site/routes';
import { Btn, More, Note, pad } from '../../_site/ui';
import { ToolChapters } from './chapters';
import { SelectionBar, SelectSample } from './selection';
import '../../_site/demo/demo.css';
import '../../_site/product/product.css';
import './tool.css';

const tool = products.tool;

export const metadata = pageMetadata(
  `${tool.name} · ${tool.headline}`,
  tool.what + tool.opening[2],
  productHref.tool,
);

// Molis Tool：最空、最短的一页，几乎全白，一道光。给手上已有材料的 Mac 用户。
// 主线是一个下午手边冒出的几件小事；整页任意选中一句话，动作条出现在光标旁（结果为示意）。
export default function ToolPage() {
  return (
    <SelectionBar>
      <div className="m-product m-tool">
        <ProductHero
          product={tool}
          window={{
            name: 'tool-light',
            alt: '白墙上落着一道天光。',
            focus: '50% 50%',
            caption: 'A beam of light on a white wall',
          }}
          aside={<Note>选中这一页的任意一句话试试</Note>}
        />
        <ToolChapters />
        <section className="m-sig" aria-labelledby="tl-try-title">
          <header className="m-head" data-size="h2" data-reveal>
            <p className="m-head-meta">
              <span className="m-no" aria-hidden="true">
                {pad(5)}
              </span>
              <span className="m-kicker">{selectTry.kicker}</span>
            </p>
            <h2 className="m-head-title" id="tl-try-title">
              {selectTry.title}
            </h2>
            <div className="m-head-lead">
              <p>{selectTry.lead}</p>
              <p className="tl-try-note">
                <Note>{selectTry.note}</Note>
              </p>
            </div>
          </header>
          <div className="m-sig-box">
            <SelectSample />
          </div>
        </section>
        <ProductEnding
          product={tool}
          start={6}
          progress={{
            have: toolProgress.have,
            notYet: toolProgress.notYet,
            now: {
              text: toolProgress.now,
              links: <More href={contactHref('tool')}>{toolGo.follow}</More>,
            },
          }}
          relation={{
            title: 'Tool 与 Work',
            formula: (
              <>
                <span>Tool</span>
                <i>→</i>
                <span>Work</span>
              </>
            ),
            text: relations.workTool,
            tag: '计划中 · 范围与时间未定',
          }}
          go={
            <>
              <Btn href={contactHref('tool')}>{toolGo.follow}</Btn>
              <More href={productHref.work}>{toolGo.work}</More>
            </>
          }
        />
      </div>
    </SelectionBar>
  );
}
