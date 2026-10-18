import { pageMetadata } from '../../../lib/site';
import { products, WORK_GITHUB } from '../../../content/site/products';
import { studio } from '../../../content/site/studio';
import {
  personas,
  workEnding,
  workGo,
  workHero,
  workNow,
  workWhy,
} from '../../../content/site/work';
import { ABOUT, contactHref, essayHref, productHref, WORK_DOWNLOAD } from '../../_site/routes';
import { Btn, More, Note, pad, Phrases, SectionHead, Status, type Vars } from '../../_site/ui';
import { Day } from './day';
import { personaBoot, PersonaRoot, RoutePick, WorkNav } from './persona';
import { Stage, StageText } from './stage';
import '../../_site/demo/demo.css';
import '../../_site/product/product.css';
import './work.css';

const work = products.work;
/** v0.2.0 那一版的源码（那时还叫 GoalBoard） */
const WORK_V020 = 'https://github.com/molis-ai/molis-work/tree/v0.2.0';

export const metadata = pageMetadata(
  `${work.name} · ${work.headline}`,
  workHero.what,
  productHref.work,
);

// Molis Work：工作室最核心的产品页。第四版「一个舞台」（specs/work-product-page/spec.md 末节）：一共三屏。
// 首屏左边是舞台（每条路八段，case 都在动画里演），右边是名字、解释句、选路和报名；
// 第二屏三句「不」和现在能拿到什么；第三屏我们为什么做它。页内顶栏只有产品名、三条路和报名。
export default function WorkPage() {
  return (
    <PersonaRoot className="m-product m-work wp" id="top">
      <script dangerouslySetInnerHTML={{ __html: personaBoot }} />
      <header className="wp-hero m-wrap m-top">
        <div className="wp-hero-copy">
          <p className="m-tagline m-rise">
            <span>{work.form}</span>
            <Status>{work.stage}</Status>
          </p>
          <h1 className="m-phero-name m-rise" lang="en">
            {work.name}
          </h1>
          <p className="m-phero-title m-rise" style={{ '--delay': '120ms' } as Vars}>
            <Phrases text={work.headline} />
          </p>
          <p className="m-phero-what m-rise" style={{ '--delay': '200ms' } as Vars}>
            {workHero.what}
          </p>
          <div className="m-rise" style={{ '--delay': '280ms' } as Vars}>
            <RoutePick />
          </div>
          <div className="wp-go m-rise" style={{ '--delay': '340ms' } as Vars}>
            <div className="m-actions">
              <Btn href={contactHref('work-trial')}>{workGo.trial}</Btn>
            </div>
            <p className="wp-go-line">{workGo.line}</p>
          </div>
        </div>
        <div className="wp-hero-stage m-rise" style={{ '--delay': '160ms' } as Vars}>
          <Stage />
          <StageText />
        </div>
      </header>
      <WorkNav />

      <section className="m-sig wp-why" id="why" aria-labelledby="why-title">
        <div className="wp-why-in">
          <div className="wp-why-not" data-reveal>
            <p className="m-head-meta">
              <span className="m-no" aria-hidden="true">
                {pad(1)}
              </span>
              <span className="m-kicker">{workWhy.kicker}</span>
            </p>
            <h2 className="wp-nots" id="why-title">
              {workWhy.nots.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className="wp-why-line">{workWhy.ai}</p>
            <p className="wp-why-line">{workWhy.data}</p>
          </div>
          <div className="wp-now" data-reveal style={{ '--delay': '90ms' } as Vars}>
            <div className="wp-now-row">
              <p className="wp-now-label" data-tone="rel">
                {workNow.have.label}
              </p>
              <p>{workNow.have.text}</p>
              <p className="wp-now-note">{workNow.have.note}</p>
            </div>
            <div className="wp-now-row">
              <p className="wp-now-label">{workNow.building.label}</p>
              <p>{workNow.building.text}</p>
              <p className="wp-now-note">{workNow.building.note}</p>
            </div>
            <div className="wp-now-row wp-first">
              <p className="wp-now-label">
                {workNow.first.label}
                <Note>{workNow.first.note}</Note>
              </p>
              {personas.map((persona) => (
                <p key={persona} data-p={persona}>
                  {workNow.first.text[persona]}
                </p>
              ))}
            </div>
            <div className="wp-now-row">
              <p className="wp-now-label" data-tone="no">
                {workNow.notFor.label}
              </p>
              <p className="wp-now-note">{workNow.notFor.text}</p>
            </div>
            <div className="wp-go">
              <div className="m-actions">
                <Btn href={contactHref('work-trial')}>{workGo.trial}</Btn>
                <More href={WORK_V020} external>
                  {workGo.source}
                </More>
              </div>
              <p className="wp-go-line">{workGo.license}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="m-sig wp-end" id="ending" aria-labelledby="ending-title">
        <SectionHead
          no={pad(2)}
          kicker={workEnding.kicker}
          title={workEnding.title}
          id="ending-title"
          size="h2"
        />
        <div className="wp-letter" data-reveal>
          {workEnding.letter.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <h3 className="wp-then" data-reveal>
          {workEnding.question}
        </h3>
        <Day />
        <div className="wp-vision" data-reveal>
          <p className="wp-vision-big">{studio.vision}</p>
          <div className="m-actions">
            <More href={essayHref('human-scale')}>{workEnding.essay}</More>
            <More href={ABOUT}>{workEnding.about}</More>
          </div>
          <p className="wp-sign">{studio.signature}</p>
        </div>
        <div className="wp-close" data-reveal>
          <p className="wp-close-line">{workEnding.closing}</p>
          <div className="m-actions">
            <Btn href={contactHref('work-trial')}>{workGo.trial}</Btn>
            <More href={WORK_GITHUB} external>
              {workGo.github}
            </More>
            <More href={WORK_DOWNLOAD}>{workGo.mac}</More>
          </div>
        </div>
      </section>
    </PersonaRoot>
  );
}
