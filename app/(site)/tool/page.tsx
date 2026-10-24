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
import { contactHref, productHref } from '../../_site/routes';
import type { ReactNode } from 'react';
import { Btn, More, type Vars } from '../../_site/ui';
import { Desk, TryHint } from './hero';
import { Beside, Later, Near, PlugScreen, ShiftScreen } from './scenes';
import { SelectionBar } from './selection';
import { Phase, Walk } from './walk';
import '../../_site/product/product.css';
import './tool.css';

const tool = products.tool;

export const metadata = pageMetadata(
  `${tool.name} · ${tool.headline}`,
  tool.what + tool.opening[2],
  productHref.tool,
);

// Molis Tool（specs/site-rebuild/tool-page.md 第 13 节）：首屏翻译，然后一长段——右边钉住一块 Mac 屏幕，
// 左边的字一段段滚过去（以前与现在 → 眼前的小事三件事对三层 → 插件），屏幕从周五早上走到傍晚；
// 最后分寸和收尾合成深色的一屏，不配图。整页一张纸色底，只有最后一屏是深色。
// 「选中 → 动作条 → 结果在旁边」只在首屏完整演一次，往下每块屏幕演新东西；示意统一是屏幕下面一行小字。
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
  children,
}: {
  id: string;
  title: string;
  mark?: string;
  children?: ReactNode;
}) {
  return (
    <header className="tl-head" data-reveal>
      <h2 className="tl-head-title" id={id}>
        <Marked text={title} mark={mark} />
      </h2>
      {children}
    </header>
  );
}

/** 眼前的小事里的一件：哪一层、什么时候（正在打磨的那件也写在这一行），一件事，一句怎么处理。三件同一个规格 */
function Case({
  id,
  item,
  tag,
}: {
  id: string;
  item: {
    layer: string;
    time: string;
    moment: string;
    result: string;
    tone: string;
  };
  tag?: string;
}) {
  return (
    <div className="tl-case-text" data-tone={item.tone}>
      <p className="tl-case-meta">
        <span>{item.layer}</span>
        <span>{item.time}</span>
        {tag ? <span data-tag="">{tag}</span> : null}
      </p>
      <h3 className="tl-case-title" id={id}>
        <Marked text={item.moment} />
      </h3>
      <p className="tl-case-result">{item.result}</p>
    </div>
  );
}

export default function ToolPage() {
  const { near, beside, later } = cases;
  return (
    <SelectionBar>
      <div className="m-product m-tool">
        <ProductHero product={tool} visual={<Desk />} aside={<TryHint />} />

        <section className="tl-walk-sec" aria-label="Molis Tool 怎么用">
          <Walk
            stops={[
              {
                id: 'shift',
                text: (
                  <>
                    <Head
                      id="tl-shift-title"
                      title={shift.title}
                      mark={shift.mark}
                    />
                    <div className="tl-route">
                      <p data-k="before">
                        <Phase name="was">{shift.before.label}</Phase>
                        {shift.before.text}
                      </p>
                      <p data-k="after">
                        <Phase name="now">{shift.after.label}</Phase>
                        {shift.after.text}
                      </p>
                    </div>
                  </>
                ),
                phases: ['was', 'now'],
                scene: {
                  cue: 'shift',
                  kind: 'tl-shift',
                  label: shift.label,
                  note: shift.note,
                  art: <ShiftScreen />,
                },
              },
              {
                id: 'cases',
                text: (
                  <Head
                    id="tl-cases-title"
                    title={cases.title}
                    mark={cases.mark}
                  >
                    <p className="tl-head-lead">{cases.lead}</p>
                  </Head>
                ),
              },
              {
                id: 'near',
                text: <Case id="tl-near-title" item={near} />,
                scene: {
                  cue: 'c-near',
                  kind: 'tl-case',
                  label: `${near.layer}：${near.moment}。${near.result}`,
                  note: cases.note,
                  art: <Near />,
                },
              },
              {
                id: 'beside',
                text: <Case id="tl-beside-title" item={beside} />,
                scene: {
                  cue: 'c-beside',
                  kind: 'tl-case',
                  label: `${beside.layer}：${beside.moment}。${beside.result}`,
                  note: cases.note,
                  art: <Beside />,
                },
              },
              {
                id: 'later',
                text: (
                  <Case id="tl-later-title" item={later} tag={cases.wipTag} />
                ),
                scene: {
                  cue: 'c-later',
                  kind: 'tl-case',
                  label: `${later.layer}：${later.moment}。${later.result}`,
                  note: (
                    <>
                      {cases.note}
                      <span className="tl-note-more">{cases.wip}</span>
                    </>
                  ),
                  art: <Later />,
                },
              },
              {
                id: 'plugins',
                text: (
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
                ),
                scene: {
                  cue: 'plug',
                  kind: 'tl-plug',
                  label: plugins.label,
                  note: plugins.note,
                  interactive: true,
                  art: <PlugScreen />,
                },
              },
            ]}
          />
        </section>

        <section
          className="tl-sec tl-close"
          data-wall="slate"
          aria-labelledby="tl-measure-title"
        >
          <div className="m-wrap tl-close-grid">
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
            <div
              className="tl-close-end"
              data-reveal
              style={{ '--delay': '240ms' } as Vars}
            >
              <p className="tl-close-fit">
                <Marked text={tool.fit} />
              </p>
              <div className="tl-close-go">
                <p>{toolProgress.notYet[1]}</p>
                <div className="tl-close-btns">
                  <Btn href={contactHref('tool')}>{toolGo.follow}</Btn>
                  <More href={productHref.work}>{toolGo.work}</More>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SelectionBar>
  );
}
