import type { CSSProperties } from 'react';
import { pageMetadata } from '../../../lib/site';
import {
  products,
  WORK_BUILD,
  WORK_GITHUB,
  WORK_RELEASES,
} from '../../../content/site/products';
import { studio } from '../../../content/site/studio';
import {
  personas,
  workCompare,
  workEnding,
  workGo,
  workIdeas,
  workStatus,
  workTour,
  workWays,
} from '../../../content/site/work';
import { ProductHero } from '../../_site/product/product';
import { ABOUT, contactHref, essayHref, productHref } from '../../_site/routes';
import { Btn, More, pad, SectionHead, Window } from '../../_site/ui';
import { WorkActs } from './acts';
import { Copy } from './copy';
import { Day } from './day';
import { HeroDemo } from './hero';
import { PersonaAsk, personaBoot, PersonaRoot, WorkNav } from './persona';
import { Tour } from './tour';
import { Ways } from './ways';
import '../../_site/demo/demo.css';
import '../../_site/product/product.css';
import './work.css';

const work = products.work;
/** v0.2.0 发布时的安装说明（那时还叫 GoalBoard） */
const WORK_V020_INSTALL =
  'https://github.com/molis-ai/molis-work/blob/v0.2.0/docs/installation.md';

export const metadata = pageMetadata(
  `${work.name} · ${work.headline}`,
  work.what + work.opening[1],
  productHref.work,
);

// Molis Work：工作室最核心的产品页（目标与完成要求见 specs/work-product-page/spec.md）。
// 两种读者各看各的例子（写代码 / 写文档、管事情）；能用画面演的不写字。
// 首屏 → 产品全景（窗口八段）→ 三件事 → 四幕（递、接、长、一起干）→ 想怎么干 → 对比 → 现状 → 那人做什么。
export default function WorkPage() {
  return (
    <PersonaRoot className="m-product m-work wp" id="top">
      <script dangerouslySetInnerHTML={{ __html: personaBoot }} />
      <ProductHero product={work} visual={<HeroDemo />} aside={<PersonaAsk />} />
      <WorkNav />

      <section className="m-sig wp-tour" id="tour" aria-labelledby="tour-title">
        <SectionHead
          no={pad(1)}
          kicker={workTour.kicker}
          title={workTour.title}
          id="tour-title"
          size="h2"
        />
        <Tour />
      </section>

      <section className="m-wrap wp-ideas" aria-label="三件事">
        {workIdeas.map((idea, index) => (
          <a
            key={idea.id}
            className="wp-idea"
            href={`#${idea.id}`}
            data-k={idea.id}
            data-reveal
            style={{ '--delay': `${index * 90}ms` } as CSSProperties}
          >
            <span className="wp-idea-art" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="wp-idea-mark">{idea.mark}</span>
            <span className="wp-idea-line">{idea.line}</span>
          </a>
        ))}
      </section>

      <WorkActs />

      <section className="m-sig" id="ways" aria-labelledby="ways-title">
        <SectionHead
          no={pad(6)}
          kicker={workWays.kicker}
          title={workWays.title}
          id="ways-title"
          size="h2"
        />
        <Ways />
      </section>

      <section className="m-sig" id="compare" aria-labelledby="compare-title">
        <SectionHead
          no={pad(7)}
          kicker={workCompare.kicker}
          title={workCompare.title}
          id="compare-title"
          size="h2"
        />
        {personas.map((persona) => (
          <div key={persona} className="wp-compare" data-p={persona} data-reveal>
            <table>
              <thead>
                <tr>
                  {workCompare.head.map((head) => (
                    <th key={head} scope="col">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workCompare.rows[persona].map((row) => (
                  <tr key={row.way}>
                    <th scope="row">
                      {row.way}
                      <small>{row.note}</small>
                    </th>
                    {row.cells.map((cell, index) => (
                      <td key={cell} data-h={workCompare.head[index + 1]}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="wp-us">
                  <th scope="row">{workCompare.us}</th>
                  {workCompare.usCells[persona].map((cell, index) => (
                    <td key={cell} data-h={workCompare.head[index + 1]}>
                      {cell}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <p className="wp-gap">{workCompare.gap[persona]}</p>
          </div>
        ))}
      </section>

      <section className="m-sig" id="now" aria-labelledby="now-title">
        <SectionHead
          no={pad(8)}
          kicker={workStatus.kicker}
          title={
            <>
              {personas.map((persona) => (
                <span key={persona} data-p={persona}>
                  {workStatus.title[persona]}
                </span>
              ))}
            </>
          }
          id="now-title"
          size="h2"
        />
        <div className="wp-now">
          <div className="wp-now-col" data-reveal>
            <p className="wp-now-label" data-tone="rel">
              {workStatus.released.label}
            </p>
            <ul>
              {workStatus.released.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="wp-now-note">{workStatus.released.note}</p>
            <div className="m-actions">
              <More href={WORK_RELEASES} external>
                发布记录
              </More>
            </div>
          </div>
          <div className="wp-now-col" data-reveal style={{ '--delay': '90ms' } as CSSProperties}>
            <p className="wp-now-label">{workStatus.developing.label}</p>
            <ul>
              {workStatus.developing.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="wp-now-start" data-p="dev" data-reveal style={{ '--delay': '180ms' } as CSSProperties}>
            <h3>{workStatus.start.title}</h3>
            <ol>
              {workStatus.start.steps.map((step) => (
                <li key={step.title}>
                  <b>{step.title}</b>
                  {step.hint ? <span>{step.hint}</span> : null}
                  {step.code ? (
                    <div className="wp-code">
                      <pre>{step.code}</pre>
                      <Copy text={step.code} />
                    </div>
                  ) : null}
                  {step.say ? (
                    <div className="wp-code wp-say">
                      <p>{step.say}</p>
                      <Copy text={step.say} />
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
            <p className="wp-now-note">{workStatus.start.note}</p>
            <div className="m-actions">
              <More href={WORK_V020_INSTALL} external>
                完整安装说明
              </More>
            </div>
          </div>
          <div className="wp-now-start" data-p="doc" data-reveal style={{ '--delay': '180ms' } as CSSProperties}>
            <h3>{workStatus.follow.title}</h3>
            <p>{workStatus.follow.text}</p>
            <div className="m-actions">
              <Btn href={contactHref('work')}>{workGo.follow}</Btn>
            </div>
            <p className="wp-now-note">{workStatus.follow.friend}</p>
          </div>
        </div>
        <ul className="wp-bounds" data-reveal>
          {workStatus.bounds.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="m-sig wp-end" id="ending" aria-labelledby="ending-title">
        <SectionHead
          no={pad(9)}
          kicker={workEnding.kicker}
          title={workEnding.title}
          id="ending-title"
          size="h2"
        />
        <Day />
        <div className="wp-uses">
          {workEnding.uses.map((use, index) => (
            <article
              key={use.title}
              className="wp-use"
              data-k={`u${index}`}
              data-reveal
              style={{ '--delay': `${index * 90}ms` } as CSSProperties}
            >
              <h3>{use.title}</h3>
              {personas.map((persona) => (
                <p key={persona} className="wp-use-eg" data-p={persona}>
                  {use.eg[persona]}
                </p>
              ))}
            </article>
          ))}
        </div>
        <div className="wp-vision">
          <Window
            name="ex-shore-person"
            alt="白色的沙滩上，一个人面朝大海站着。"
            ratio="21 / 9"
            sizes="(max-width: 900px) 100vw, 90vw"
            caption="Time, given back"
            className="wp-vision-window"
          />
          <div className="wp-vision-text" data-reveal>
            <p className="m-kicker">{workEnding.why}</p>
            <p className="wp-vision-big">{studio.vision}</p>
            <div className="m-actions">
              <More href={essayHref('human-scale')}>{workEnding.essay}</More>
              <More href={ABOUT}>{workEnding.about}</More>
            </div>
            <p className="wp-sign">{studio.signature}</p>
          </div>
        </div>
        <div className="wp-close" data-reveal>
          <p className="wp-close-line">{workEnding.closing}</p>
          <div className="m-actions" data-p="dev">
            <Btn href={WORK_GITHUB} external>
              {workGo.github}
            </Btn>
            <More href={WORK_BUILD} external>
              {workGo.build}
            </More>
            <More href={contactHref('work')}>{workGo.follow}</More>
          </div>
          <div className="m-actions" data-p="doc">
            <Btn href={contactHref('work')}>{workGo.follow}</Btn>
            <More href={WORK_GITHUB} external>
              {workGo.github}
            </More>
          </div>
        </div>
      </section>
    </PersonaRoot>
  );
}
