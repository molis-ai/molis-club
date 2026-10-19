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
import { personaBoot, PersonaRoot, WorkNav } from './persona';
import { Yours } from './stage';
import '../../_site/demo/demo.css';
import '../../_site/product/product.css';
import './work.css';

const work = products.work;
/** v0.2.0 那一版的源码（那时还叫 GoalBoard） */
const WORK_V020 = 'https://github.com/molis-ai/molis-work/tree/v0.2.0';

export const metadata = pageMetadata(
  `${work.name} · ${workHero.slogan.join(' ')}`,
  workHero.what,
  productHref.work,
);

// Molis Work：工作室最核心的产品页。第五版「先讲人」（specs/work-product-page/spec.md 末节）：一共四屏。
// 首屏只有口号和信念；第二屏「你的」四样和舞台（case 都在动画里演），下面「如果你」按人换演示；
// 第三屏三句「不」和现在能拿到什么；第四屏我们为什么做它。页内顶栏只有产品名、三条路和报名。
export default function WorkPage() {
  return (
    <PersonaRoot className="m-product m-work wp" id="top">
      <script dangerouslySetInnerHTML={{ __html: personaBoot }} />
      <header className="wp-hero m-wrap m-top">
        <p className="m-tagline m-rise">
          <span>{work.form}</span>
          <Status>{work.stage}</Status>
        </p>
        <h1 className="wp-hero-name m-rise" lang="en">
          {work.name}
        </h1>
        <p className="wp-slogan" lang="en">
          {/* 词之间留真空格：读屏和复制出来是一句话 */}
          {workHero.slogan.flatMap((word, index) => [
            index > 0 ? ' ' : null,
            <span
              key={word}
              className="m-rise"
              style={{ '--delay': `${160 + index * 140}ms` } as Vars}
            >
              {word}
            </span>,
          ])}
        </p>
        <div className="wp-belief m-rise" style={{ '--delay': '900ms' } as Vars}>
          <p className="wp-belief-big">
            <Phrases text={workHero.belief} />
          </p>
          <p>{workHero.keep}</p>
          <div className="wp-go">
            <div className="m-actions">
              <Btn href={contactHref('work-trial')}>{workGo.trial}</Btn>
            </div>
            <p className="wp-go-line">{workGo.line}</p>
          </div>
        </div>
      </header>
      <WorkNav />

      <section className="m-sig wp-yours" id="yours" aria-labelledby="yours-title">
        <Yours />
      </section>

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
