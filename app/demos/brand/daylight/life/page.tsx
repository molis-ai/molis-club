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
  Closing,
  Phone,
  ProductHero,
  SectionHead,
  Stage,
  Tag,
  Window,
} from '../kit';
import {
  Footer,
  HOME,
  LeafShadow,
  SiteHeader,
  contactHref,
  pad,
  trackSpotlight,
  useDaylight,
  type Vars,
} from '../shared';
import '../daylight.css';
import '../kit.css';
import './life.css';

// 文案来自 content/molis-life.ts，五个方向共用；画面用 molis-life 的生活空间概念稿，始终标「概念稿」。
// 阅读角的清晨首屏，白天交代琐事，傍晚把已有的小产品合进来。

export default function DaylightLifePage() {
  const siteRef = useDaylight();

  return (
    <div className="dl-site dl-life" ref={siteRef}>
      <SiteHeader current="life" />

      <main id="main">
        <ProductHero
          id="dl-life-title"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={[
            {
              label: hero.actions.follow,
              href: contactHref('life'),
              tone: 'light',
            },
            { label: hero.actions.more, href: '#jobs', tone: 'glass' },
          ]}
          image={{
            src: '/images/atelier/reading-room.jpg',
            w: 1440,
            h: 960,
            position: '62% 60%',
          }}
        />

        <Stage label={shotLabels.desktop} caption={hero.shotNote}>
          <div className="dl-devices">
            <Window
              src={shots.desktop.src}
              w={shots.desktop.w}
              h={shots.desktop.h}
              label={shotLabels.desktop}
            />
            <Phone {...shots.mobile} />
          </div>
        </Stage>

        <section
          id="jobs"
          className="dl-section"
          aria-labelledby="dl-jobs-title"
        >
          <SectionHead
            id="dl-jobs-title"
            kicker={jobs.kicker}
            title={jobs.title}
          />
          <ol className="dl-pillars">
            {jobs.items.map((item, index) => (
              <li
                key={item.title}
                className="dl-pillar dl-reveal"
                style={{ '--r': index } as Vars}
              >
                <span className="dl-index">{pad(index)}</span>
                <blockquote>{item.quote}</blockquote>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="dl-section" aria-labelledby="dl-handoff-title">
          <div className="dl-band dl-split">
            <LeafShadow className="dl-leaves" />
            <SectionHead
              id="dl-handoff-title"
              kicker={handoff.kicker}
              title={handoff.title}
              lead={handoff.note}
            />
            <div className="dl-life-handoff dl-reveal">
              <h3>{handoff.entriesLabel}</h3>
              <ul className="dl-rows">
                {handoff.entries.map((entry, index) => (
                  <li key={entry.title}>
                    <span className="dl-index">{pad(index)}</span>
                    <strong>
                      {entry.title}
                      {entry.tag ? <Tag>{entry.tag}</Tag> : null}
                    </strong>
                  </li>
                ))}
              </ul>
              <h3>{handoff.intentsLabel}</h3>
              <ul className="dl-life-intents">
                {handoff.intents.map((intent) => (
                  <li key={intent}>{intent}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="dl-section" aria-labelledby="dl-scenes-title">
          <SectionHead
            id="dl-scenes-title"
            kicker={scenes.kicker}
            title={scenes.title}
            lead={scenes.note}
          />
          <ul className="dl-life-scenes">
            {scenes.items.map((scene, index) => (
              <li
                key={scene}
                className="dl-reveal"
                style={{ '--r': index % 4 } as Vars}
                onPointerMove={trackSpotlight}
              >
                <span className="dl-index">{pad(index)}</span>
                <strong>{scene}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="dl-section dl-split"
          aria-labelledby="dl-control-title"
        >
          <SectionHead
            id="dl-control-title"
            kicker={control.kicker}
            title={control.title}
          />
          <ol className="dl-rows">
            {control.items.map((item, index) => (
              <li
                key={item}
                className="dl-reveal"
                style={{ '--r': index } as Vars}
              >
                <span className="dl-index">{pad(index)}</span>
                <strong>{item}</strong>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="dl-section dl-split dl-life-devices"
          aria-labelledby="dl-devices-title"
        >
          <figure className="dl-life-moments dl-reveal" data-scene="pass">
            <div className="dl-stage-sun" aria-hidden="true" />
            <LeafShadow className="dl-leaves dl-stage-leaves" />
            <div className="dl-devices">
              <Window
                src={shots.moments.src}
                w={shots.moments.w}
                h={shots.moments.h}
                label={shotLabels.moments}
              />
              <Phone {...shots.onboarding} />
            </div>
            <figcaption>{momentsNote}</figcaption>
          </figure>
          <div>
            <SectionHead
              id="dl-devices-title"
              kicker={devices.kicker}
              title={devices.title}
              align="stack"
            />
            <ul className="dl-life-device-list">
              {devices.items.map((item, index) => (
                <li
                  key={item.title}
                  className="dl-reveal"
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
        </section>

        <section
          className="dl-evening"
          data-scene="pass"
          aria-labelledby="dl-merged-title"
        >
          <div className="dl-evening-sun" aria-hidden="true" />
          <LeafShadow className="dl-leaves" />
          <div className="dl-evening-inner">
            <SectionHead
              id="dl-merged-title"
              kicker={merged.kicker}
              title={merged.title}
            />
            <ol className="dl-pillars">
              {merged.items.map((item, index) => (
                <li
                  key={item.title}
                  className="dl-pillar dl-reveal"
                  style={{ '--r': index } as Vars}
                >
                  <span className="dl-index">{pad(index)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer wordmark="Molis Life">
        <Closing
          id="dl-life-closing"
          title={closing.title}
          actions={[
            { label: closing.follow, href: contactHref('life') },
            { label: closing.home, href: HOME, tone: 'line' },
          ]}
        />
      </Footer>
    </div>
  );
}
