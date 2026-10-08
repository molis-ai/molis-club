'use client';
import {
  closing,
  control,
  devices,
  handoff,
  hero,
  jobs,
  merged,
  momentsNote,
  scenes,
  shotLabels,
  shots,
} from '../../../../../content/molis-life';
import {
  Cards,
  Closing,
  Ledger,
  Phone,
  Phrases,
  ProductHero,
  Scope,
  SectionHead,
  Shot,
  Tag,
  pad,
} from '../kit';
import Planet from '../planet';
import {
  Footer,
  HOME,
  SiteHeader,
  contactHref,
  useReveal,
  type Vars,
} from '../shared';
import '../cosmos.css';
import '../kit.css';
import './life.css';

// 文案来自 content/molis-life.ts，五个方向共用。Life 是一颗青色的宜居行星；
// 界面画面用 molis-life 的生活空间概念稿，始终标「概念稿」。

/** 首屏：一颗慢慢自转的宜居行星，一颗小月亮绕着它 */
function LifeWorld() {
  return (
    <div className="cs-life-world" aria-hidden="true">
      <span className="cs-life-atmos" />
      <Planet kind="life" className="cs-life-planet" />
      <span className="cs-life-orbit">
        <i />
      </span>
    </div>
  );
}

export default function CosmosLifePage() {
  const siteRef = useReveal();

  return (
    <div className="cs-site cs-life" ref={siteRef}>
      <SiteHeader current="life" />

      <main id="main">
        <ProductHero
          id="cs-life-title"
          className="cs-life-hero"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={[
            {
              label: hero.actions.follow,
              href: contactHref('life'),
              tone: 'primary',
            },
            { label: hero.actions.more, href: '#jobs' },
          ]}
          visual={<LifeWorld />}
        />

        <section
          className="cs-life-screen"
          data-scroll
          aria-label="Molis Life 概念稿"
        >
          <Scope caption={hero.shotNote} className="cs-life-devices">
            <Shot
              src={shots.desktop.src}
              w={shots.desktop.w}
              h={shots.desktop.h}
              label={shotLabels.desktop}
            />
            <Phone {...shots.mobile} />
          </Scope>
        </section>

        <section
          id="jobs"
          className="cs-section"
          aria-labelledby="cs-jobs-title"
        >
          <SectionHead
            id="cs-jobs-title"
            kicker={jobs.kicker}
            title={jobs.title}
          />
          <Cards items={jobs.items} />
        </section>

        <section
          className="cs-section cs-band cs-life-handoff"
          aria-labelledby="cs-handoff-title"
        >
          <div className="cs-split">
            <div className="cs-head cs-reveal" data-align="start">
              <span className="cs-eyebrow">{handoff.kicker}</span>
              <h2 id="cs-handoff-title">
                <Phrases text={handoff.title} />
              </h2>
              <p>{handoff.note}</p>
            </div>
            <div className="cs-life-handoff-body cs-reveal">
              <h3>{handoff.entriesLabel}</h3>
              <ul className="cs-life-entries">
                {handoff.entries.map((entry, index) => (
                  <li
                    key={entry.title}
                    data-planned={entry.tag ? '' : undefined}
                  >
                    <span className="cs-index">{pad(index)}</span>
                    <strong>
                      {entry.title}
                      {entry.tag ? <Tag>{entry.tag}</Tag> : null}
                    </strong>
                  </li>
                ))}
              </ul>
              <h3>{handoff.intentsLabel}</h3>
              <ul className="cs-life-intents">
                {handoff.intents.map((intent, index) => (
                  <li key={intent} style={{ '--i': index } as Vars}>
                    {intent}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="cs-section" aria-labelledby="cs-scenes-title">
          <SectionHead
            id="cs-scenes-title"
            kicker={scenes.kicker}
            title={scenes.title}
            lead={scenes.note}
          />
          <ul className="cs-life-scenes">
            {scenes.items.map((scene, index) => (
              <li
                key={scene}
                className="cs-reveal"
                style={{ '--r': index % 4 } as Vars}
              >
                <span className="cs-life-scene-star" aria-hidden="true" />
                <span className="cs-index">{pad(index)}</span>
                <strong>{scene}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="cs-section cs-band"
          aria-labelledby="cs-control-title"
        >
          <div className="cs-split">
            <div className="cs-head cs-reveal" data-align="start">
              <span className="cs-eyebrow">{control.kicker}</span>
              <h2 id="cs-control-title">
                <Phrases text={control.title} />
              </h2>
            </div>
            <Ledger items={control.items.map((title) => ({ title }))} />
          </div>
        </section>

        <section
          className="cs-section cs-life-devices-section"
          aria-labelledby="cs-devices-title"
        >
          <div className="cs-split">
            <Scope caption={momentsNote} className="cs-life-moments cs-reveal">
              <Shot
                src={shots.moments.src}
                w={shots.moments.w}
                h={shots.moments.h}
                label={shotLabels.moments}
              />
              <Phone {...shots.onboarding} />
            </Scope>
            <div className="cs-life-devices-copy">
              <div className="cs-head cs-reveal" data-align="start">
                <span className="cs-eyebrow">{devices.kicker}</span>
                <h2 id="cs-devices-title">
                  <Phrases text={devices.title} />
                </h2>
              </div>
              <ul className="cs-life-device-list">
                {devices.items.map((item, index) => (
                  <li
                    key={item.title}
                    className="cs-reveal"
                    style={{ '--r': index } as Vars}
                  >
                    <strong>
                      {item.title}
                      {item.tag ? <Tag>{item.tag}</Tag> : null}
                    </strong>
                    <p>{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="cs-section cs-life-merged"
          aria-labelledby="cs-merged-title"
        >
          <SectionHead
            id="cs-merged-title"
            kicker={merged.kicker}
            title={merged.title}
          />
          <Cards items={merged.items} />
        </section>
      </main>

      <Footer>
        <Closing
          id="cs-life-closing-title"
          title={closing.title}
          actions={[
            {
              label: closing.follow,
              href: contactHref('life'),
              tone: 'primary',
            },
            { label: closing.home, href: HOME },
          ]}
        />
      </Footer>
    </div>
  );
}
