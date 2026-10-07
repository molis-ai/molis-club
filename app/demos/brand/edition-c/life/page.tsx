'use client';
import {
  closing,
  compare,
  control,
  devices,
  handoff,
  hero,
  jobs,
  merged,
  scenes,
} from '../../../../../content/molis-life';
import {
  Closing,
  Compare,
  Frame,
  SectionHead,
  Phrases,
  ProductHero,
  Tag,
  pad,
} from '../kit';
import {
  Footer,
  HOME,
  SiteHeader,
  contactHref,
  useEditionMotion,
  type Vars,
} from '../shared';
import '../edition-c.css';
import '../kit.css';
import './life.css';

// 文案来自 content/molis-life.ts，五个方向共用；画面用 molis-life 的生活空间概念稿，始终标「概念稿」。

const shots = {
  desktop: { src: '/images/edition-c/life/desktop.jpg', w: 1600, h: 1111 },
  mobile: { src: '/images/edition-c/life/mobile.jpg', w: 640, h: 1385 },
  moments: { src: '/images/edition-c/life/moments.jpg', w: 1600, h: 1111 },
  onboarding: {
    src: '/images/edition-c/life/onboarding-mobile.jpg',
    w: 640,
    h: 1385,
  },
};

function Phone({ src, w, h }: { src: string; w: number; h: number }) {
  return (
    <div className="el-phone">
      <img src={src} width={w} height={h} alt="" loading="lazy" />
    </div>
  );
}

export default function EditionCLifePage() {
  const siteRef = useEditionMotion();

  return (
    <div className="ec-site el-site" ref={siteRef}>
      <SiteHeader current="life" />

      <main id="main">
        <ProductHero
          id="el-title"
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
          image={{ src: '/images/atelier/reading-room.jpg', w: 1440, h: 960 }}
          wordmark="Molis Life"
        />

        <section
          className="ep-screen"
          data-scroll="enter"
          aria-label="Molis Life 概念稿"
        >
          <figure>
            <div className="el-devices">
              <Frame
                src={shots.desktop.src}
                w={shots.desktop.w}
                h={shots.desktop.h}
                label="Molis Life"
              />
              <Phone {...shots.mobile} />
            </div>
            <figcaption>{hero.shotNote}</figcaption>
          </figure>
        </section>

        <section
          id="jobs"
          className="ep-section"
          aria-labelledby="el-jobs-title"
        >
          <SectionHead
            id="el-jobs-title"
            kicker={jobs.kicker}
            title={jobs.title}
          />
          <ol className="ep-cards el-jobs">
            {jobs.items.map((item, index) => (
              <li
                key={item.title}
                className="ep-card ec-reveal"
                style={{ '--r': index } as Vars}
              >
                <span className="ep-index">{pad(index)}</span>
                <blockquote>{item.quote}</blockquote>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="ep-section ep-panel el-handoff"
          aria-labelledby="el-handoff-title"
        >
          <div className="ep-split">
            <div className="ep-head ec-reveal" data-align="start">
              <span className="ec-eyebrow">{handoff.kicker}</span>
              <h2 id="el-handoff-title">
                <Phrases text={handoff.title} />
              </h2>
              <p>{handoff.note}</p>
            </div>
            <div className="el-handoff-body ec-reveal">
              <h3>{handoff.entriesLabel}</h3>
              <ul className="el-entries">
                {handoff.entries.map((entry, index) => (
                  <li key={entry.title}>
                    <span className="ep-index">{pad(index)}</span>
                    <strong>{entry.title}</strong>
                    {entry.tag ? <Tag>{entry.tag}</Tag> : null}
                  </li>
                ))}
              </ul>
              <h3>{handoff.intentsLabel}</h3>
              <ul className="el-intents">
                {handoff.intents.map((intent) => (
                  <li key={intent}>{intent}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="ep-section" aria-labelledby="el-compare-title">
          <SectionHead
            id="el-compare-title"
            kicker={compare.kicker}
            title={compare.title}
          />
          <Compare
            labels={[
              compare.labels.now,
              compare.labels.does,
              compare.labels.here,
            ]}
            rows={compare.rows.map((row) => [row.now, row.does, row.here])}
          />
        </section>

        <section className="ep-section" aria-labelledby="el-scenes-title">
          <SectionHead
            id="el-scenes-title"
            kicker={scenes.kicker}
            title={scenes.title}
            lead={scenes.note}
          />
          <ul className="el-scenes">
            {scenes.items.map((scene, index) => (
              <li
                key={scene.title}
                className="ec-reveal"
                style={{ '--r': index % 4 } as Vars}
              >
                <span className="ep-index">{pad(index)}</span>
                <strong>{scene.title}</strong>
                <p>{scene.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="ep-section ep-band"
          aria-labelledby="el-control-title"
        >
          <div className="ep-split">
            <div className="ep-head ec-reveal" data-align="start">
              <span className="ec-eyebrow">{control.kicker}</span>
              <h2 id="el-control-title">
                <Phrases text={control.title} />
              </h2>
            </div>
            <ol
              className="ep-promises el-control"
              style={{ '--cols': 1 } as Vars}
            >
              {control.items.map((item, index) => (
                <li
                  key={item}
                  className="ec-reveal"
                  style={{ '--r': index } as Vars}
                >
                  <span className="ep-index">{pad(index)}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="ep-section el-devices-section"
          aria-labelledby="el-devices-title"
        >
          <div className="ep-split">
            <figure className="el-devices el-devices-alt ec-reveal">
              <Frame
                src={shots.moments.src}
                w={shots.moments.w}
                h={shots.moments.h}
                label="片刻"
              />
              <Phone {...shots.onboarding} />
              <figcaption className="ep-caption">概念稿 · 示例生活</figcaption>
            </figure>
            <div className="el-devices-copy">
              <div className="ep-head ec-reveal" data-align="start">
                <span className="ec-eyebrow">{devices.kicker}</span>
                <h2 id="el-devices-title">
                  <Phrases text={devices.title} />
                </h2>
              </div>
              <ul className="el-device-list">
                {devices.items.map((item) => (
                  <li key={item.title} className="ec-reveal">
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

        <section className="ep-section" aria-labelledby="el-merged-title">
          <SectionHead
            id="el-merged-title"
            kicker={merged.kicker}
            title={merged.title}
          />
          <ol className="ep-cards">
            {merged.items.map((item, index) => (
              <li
                key={item.title}
                className="ep-card ec-reveal"
                style={{ '--r': index } as Vars}
              >
                <span className="ep-index">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer>
        <Closing
          id="el-closing-title"
          title={closing.title}
          actions={[
            { label: closing.follow, href: contactHref('life') },
            { label: closing.home, href: HOME, tone: 'light' },
          ]}
        />
      </Footer>
    </div>
  );
}
