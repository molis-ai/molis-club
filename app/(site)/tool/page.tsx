import { pageMetadata } from '../../../lib/site';
import { products } from '../../../content/site/products';
import {
  cases,
  measure,
  plugins,
  shift,
  toolGo,
  toolProgress,
} from '../../../content/site/tool';
import { ProductHero } from '../../_site/product/product';
import { COMMUNITY, contactHref, productHref } from '../../_site/routes';
import type { ReactNode } from 'react';
import { Btn, mediaOf, More, Status, type Vars } from '../../_site/ui';
import { Desk, TryHint } from './hero';
import { Cases, Plugins, Shift } from './scenes';
import { SelectionBar } from './selection';
import '../../_site/product/product.css';
import './tool.css';

const tool = products.tool;

export const metadata = pageMetadata(
  `${tool.name} · ${tool.headline}`,
  tool.what + tool.opening[2],
  productHref.tool,
);

// Molis Tool（specs/site-rebuild/tool-page.md 第 12 节）：六屏，每屏一块 Mac 屏幕当主角。
// 首屏翻译 → 以前与现在（只比路程）→ 眼前的小事（三件事对三层，早午晚三张莫奈）→ 插件 → 分寸 → 收尾。
// 整页一张纸色底，只有「分寸」是深色；每屏只有标题、一句话、最多三条要点；示意统一是屏幕下面一行小字。
// 「选中 → 动作条 → 结果在旁边」只在首屏完整演一次，往下每屏演新东西。
// 这一页本身就是 Tool：任意选中一段字，光标旁出现动作条；插件开关访客可以亲手拨。

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

/** 区块开头：标题，下面至多一句话或三条要点（标题已经说清，不加眉题） */
function Head({
  id,
  title,
  mark,
  size,
  children,
}: {
  id: string;
  title: string;
  mark?: string;
  size?: 'h2';
  children?: ReactNode;
}) {
  return (
    <header className="tl-head" data-size={size} data-reveal>
      <h2 className="tl-head-title" id={id}>
        <Marked text={title} mark={mark} />
      </h2>
      {children}
    </header>
  );
}

export default function ToolPage() {
  const { blocks } = toolProgress;
  const photo = mediaOf('ex-skylight');
  return (
    <SelectionBar>
      <div className="m-product m-tool">
        <ProductHero product={tool} visual={<Desk />} aside={<TryHint />} />

        <section className="tl-sec" aria-labelledby="tl-shift-title">
          <div className="m-wrap">
            <Head id="tl-shift-title" title={shift.title} mark={shift.mark} />
            <Shift />
          </div>
        </section>

        <section className="tl-sec tl-gal-sec" aria-labelledby="tl-cases-title">
          <Cases
            head={
              <Head id="tl-cases-title" title={cases.title} mark={cases.mark}>
                <p className="tl-head-lead">{cases.lead}</p>
              </Head>
            }
          />
        </section>

        <section className="tl-sec" aria-labelledby="tl-plugins-title">
          <div className="m-wrap tl-plug-grid">
            <Head
              id="tl-plugins-title"
              title={plugins.title}
              mark={plugins.mark}
            >
              <p className="tl-head-lead">{plugins.lead}</p>
              <ul className="tl-points">
                {plugins.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </Head>
            <Plugins />
          </div>
        </section>

        <section
          className="tl-sec tl-measure"
          data-wall="slate"
          aria-labelledby="tl-measure-title"
        >
          <figure className="tl-measure-photo">
            <img
              src={photo.src}
              srcSet={photo.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
              sizes="(max-width: 900px) 100vw, 50vw"
              width={photo.width}
              height={photo.height}
              alt={measure.photo.alt}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="tl-measure-text">
            <Head
              id="tl-measure-title"
              title={measure.title}
              mark={measure.mark}
            />
            <div className="tl-promise">
              <div className="tl-is" data-reveal>
                <h3>{measure.is.label}</h3>
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
                <h3>{measure.not.label}</h3>
                <ul>
                  {measure.not.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="tl-sec tl-end" aria-labelledby="tl-end-title">
          <div className="m-wrap tl-end-grid">
            <div className="tl-end-main" data-reveal>
              <Head id="tl-end-title" title={tool.fit} size="h2" />
              <p className="tl-end-stage">
                <Status>{tool.stage}</Status>
                <span>{tool.stageNote}</span>
              </p>
              <p className="tl-end-go">
                <Btn href={contactHref('tool')}>{toolGo.follow}</Btn>
              </p>
            </div>
            <div
              className="tl-end-lists"
              data-reveal
              style={{ '--delay': '120ms' } as Vars}
            >
              <div>
                <h3>{toolGo.have}</h3>
                <ul>
                  {blocks.have.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div data-not="">
                <h3>{toolGo.notYet}</h3>
                <ul>
                  {blocks.notYet.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="m-wrap tl-end-more" data-reveal>
            <p>
              {toolProgress.notYet[1]}
              <More href={productHref.work}>{toolGo.work}</More>
            </p>
            <p>
              {toolGo.now}
              {toolProgress.siblings}
              <More href={`${COMMUNITY}#take`}>{toolGo.community}</More>
            </p>
            <details className="tl-fold">
              <summary>{toolGo.original}</summary>
              {toolProgress.have.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <p>{toolProgress.notYet[0]}</p>
            </details>
          </div>
        </section>
      </div>
    </SelectionBar>
  );
}
