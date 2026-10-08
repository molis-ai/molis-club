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
  Frame,
  Phone,
  ProductHero,
  Screen,
  SectionHead,
  Tag,
  pad,
} from '../kit';
import {
  Footer,
  HOME,
  SiteHeader,
  contactHref,
  useNocturneMotion,
  type Vars,
} from '../shared';
import { LifeVisual } from '../visuals';
import '../nocturne.css';
import '../kit.css';
import './life.css';

// 文案来自 content/molis-life.ts，五个方向共用。首屏是夜曲的轨道：三种意图绕着一颗暖色的核心；
// 界面画面用 molis-life 的生活空间概念稿，始终标「概念稿」。

export default function NocturneLifePage() {
  const rootRef = useNocturneMotion();

  return (
    <div className="nc-site nc-life" ref={rootRef}>
      <div className="nc-grain" aria-hidden="true" />
      <SiteHeader current="life" />

      <main id="main">
        <ProductHero
          id="nc-life-title"
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
          visual={<LifeVisual items={handoff.intents} />}
        />

        <section aria-label="Molis Life 概念稿">
          <Screen note={hero.shotNote}>
            <Frame
              src={shots.desktop.src}
              w={shots.desktop.w}
              h={shots.desktop.h}
              label={shotLabels.desktop}
            />
            <Phone {...shots.mobile} />
          </Screen>
        </section>

        <section
          id="jobs"
          className="nc-section"
          aria-labelledby="nc-jobs-title"
        >
          <SectionHead
            id="nc-jobs-title"
            kicker={jobs.kicker}
            title={jobs.title}
          />
          <ol className="nc-cards nc-jobs">
            {jobs.items.map((item, index) => (
              <li
                key={item.title}
                className="nc-card"
                data-reveal
                style={{ '--r': index } as Vars}
              >
                <span className="nc-index">{pad(index)}</span>
                <blockquote>{item.quote}</blockquote>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="nc-section nc-panel"
          aria-labelledby="nc-handoff-title"
        >
          <div className="nc-split">
            <SectionHead
              id="nc-handoff-title"
              kicker={handoff.kicker}
              title={handoff.title}
              lead={handoff.note}
              align="start"
            />
            <div className="nc-handoff" data-reveal>
              <h3 className="nc-label">{handoff.entriesLabel}</h3>
              <ul className="nc-entries">
                {handoff.entries.map((entry, index) => (
                  <li
                    key={entry.title}
                    data-planned={entry.tag ? '' : undefined}
                  >
                    <span className="nc-index">{pad(index)}</span>
                    <strong>
                      {entry.title}
                      {entry.tag ? <Tag>{entry.tag}</Tag> : null}
                    </strong>
                  </li>
                ))}
              </ul>
              <h3 className="nc-label">{handoff.intentsLabel}</h3>
              <ul className="nc-intents">
                {handoff.intents.map((intent) => (
                  <li key={intent}>{intent}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="nc-section" aria-labelledby="nc-scenes-title">
          <SectionHead
            id="nc-scenes-title"
            kicker={scenes.kicker}
            title={scenes.title}
            lead={scenes.note}
          />
          <ul className="nc-scenes">
            {scenes.items.map((scene, index) => (
              <li key={scene} data-reveal style={{ '--r': index % 4 } as Vars}>
                <span className="nc-index">{pad(index)}</span>
                <strong>{scene}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="nc-section nc-band"
          aria-labelledby="nc-control-title"
        >
          <div className="nc-split">
            <SectionHead
              id="nc-control-title"
              kicker={control.kicker}
              title={control.title}
              align="start"
            />
            <ol className="nc-promises" style={{ '--cols': 1 } as Vars}>
              {control.items.map((item, index) => (
                <li key={item} data-reveal style={{ '--r': index } as Vars}>
                  <span className="nc-index">{pad(index)}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="nc-section nc-devices"
          aria-labelledby="nc-devices-title"
        >
          <div className="nc-split">
            <figure className="nc-duo" data-reveal>
              <Frame
                src={shots.moments.src}
                w={shots.moments.w}
                h={shots.moments.h}
                label={shotLabels.moments}
              />
              <Phone {...shots.onboarding} />
              <figcaption className="nc-caption">{momentsNote}</figcaption>
            </figure>
            <div className="nc-devices-copy">
              <SectionHead
                id="nc-devices-title"
                kicker={devices.kicker}
                title={devices.title}
                align="start"
              />
              <ul className="nc-device-list">
                {devices.items.map((item, index) => (
                  <li
                    key={item.title}
                    data-reveal
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

        <section className="nc-section" aria-labelledby="nc-merged-title">
          <SectionHead
            id="nc-merged-title"
            kicker={merged.kicker}
            title={merged.title}
          />
          <ol className="nc-cards">
            {merged.items.map((item, index) => (
              <li
                key={item.title}
                className="nc-card"
                data-reveal
                style={{ '--r': index } as Vars}
              >
                <span className="nc-index">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer>
        <Closing
          id="nc-life-closing"
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
