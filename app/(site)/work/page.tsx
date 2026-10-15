import { pageMetadata } from '../../../lib/site';
import {
  products,
  relations,
  WORK_BUILD,
  WORK_GITHUB,
} from '../../../content/site/products';
import { handoff, workGo, workProgress } from '../../../content/site/work';
import { ProductEnding, ProductHero } from '../../_site/product/product';
import { contactHref, productHref } from '../../_site/routes';
import { Btn, More, Note, pad } from '../../_site/ui';
import { WorkChapters } from './chapters';
import { Handoff } from './handoff';
import '../../_site/demo/demo.css';
import '../../_site/product/product.css';
import './work.css';

const work = products.work;

export const metadata = pageMetadata(
  `${work.name} · ${work.headline}`,
  work.what + work.opening[1],
  productHref.work,
);

// Molis Work：最「满」的一页，像一张真的工作台，主色木色与植物绿。
// 主线是一份「行业观察报告」走三天；看完知道工作能在人、工具与 AI 之间不断线地继续，现在能看开源代码。
export default function WorkPage() {
  return (
    <div className="m-product m-work">
      <ProductHero
        product={work}
        window={{
          name: 'work-studio',
          alt: '白色的工作室里，有人在窗边伏案，书架上摆着绿植。',
          focus: '97% 50%',
          caption: 'A studio by the window',
        }}
      />
      <WorkChapters />
      <section className="m-sig" aria-labelledby="hf-title">
        <header className="m-head" data-size="h2" data-reveal>
          <p className="m-head-meta">
            <span className="m-no" aria-hidden="true">
              {pad(9)}
            </span>
            <span className="m-kicker">{handoff.kicker}</span>
          </p>
          <h2 className="m-head-title" id="hf-title">
            {handoff.title}
          </h2>
          <div className="m-head-lead">
            <p>{handoff.lead}</p>
            <p className="hf-note">
              <Note>{handoff.note}</Note>
            </p>
          </div>
        </header>
        <div className="m-sig-box">
          <Handoff />
        </div>
      </section>
      <ProductEnding
        product={work}
        start={10}
        progress={{
          have: workProgress.have,
          notYet: workProgress.notYet,
          now: {
            text: workProgress.now,
            links: (
              <>
                <More href={WORK_GITHUB} external>
                  {workGo.github}
                </More>
                <More href={WORK_BUILD} external>
                  {workGo.build}
                </More>
              </>
            ),
          },
        }}
        relation={{
          title: 'Work 与 Tool',
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
            <Btn href={WORK_GITHUB} external>
              {workGo.github}
            </Btn>
            <More href={WORK_BUILD} external>
              {workGo.build}
            </More>
            <More href={contactHref('work')}>{workGo.follow}</More>
          </>
        }
      />
    </div>
  );
}
