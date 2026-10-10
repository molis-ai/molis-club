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
import { LifeArt } from '../art';
import {
  Closing,
  Collage,
  Frame,
  NextProduct,
  ProductHero,
  SectionHead,
  Tag,
  pad,
} from '../kit';
import {
  Footer,
  HOME,
  SiteHeader,
  contactHref,
  useFolioMotion,
  type Vars,
} from '../shared';
import '../folio.css';
import '../kit.css';
import './life.css';

// 文案来自 content/molis-life.ts，五个方向共用。首屏是剪纸插画；
// 界面画面用 molis-life 的生活空间概念稿，始终标「概念稿」。

function Phone({ src, w, h }: { src: string; w: number; h: number }) {
  return (
    <div className="fl-phone">
      <img src={src} width={w} height={h} alt="" loading="lazy" />
    </div>
  );
}

export default function FolioLifePage() {
  const rootRef = useFolioMotion();

  return (
    <div className="fo-site fl-site" ref={rootRef}>
      <SiteHeader current="life" />

      <main id="main">
        <ProductHero
          id="fl-title"
          className="fl-hero"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={[
            { label: hero.actions.follow, href: contactHref('life') },
            { label: hero.actions.more, href: '#jobs', tone: 'ghost' },
          ]}
          masthead="Life"
          art={<LifeArt />}
        />

        <section
          className="fo-section fl-screen"
          data-bg="white"
          aria-label="Molis Life 概念稿"
        >
          <Collage note={hero.shotNote}>
            <div className="fl-devices">
              <Frame
                src={shots.desktop.src}
                w={shots.desktop.w}
                h={shots.desktop.h}
                label={shotLabels.desktop}
              />
              <Phone {...shots.mobile} />
            </div>
          </Collage>
        </section>

        <section
          id="jobs"
          className="fo-section"
          data-bg="paper"
          aria-labelledby="fl-jobs-title"
        >
          <SectionHead
            id="fl-jobs-title"
            kicker={jobs.kicker}
            title={jobs.title}
          />
          <ol className="fo-cards fl-jobs">
            {jobs.items.map((item, index) => (
              <li key={item.title} data-reveal style={{ '--i': index } as Vars}>
                <span className="fo-index">{pad(index)}</span>
                <blockquote>{item.quote}</blockquote>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="fo-section fl-handoff"
          data-bg="yellow"
          aria-labelledby="fl-handoff-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fl-handoff-title"
              kicker={handoff.kicker}
              title={handoff.title}
              lead={handoff.note}
            />
            <div className="fl-handoff-body" data-reveal>
              <h3>{handoff.entriesLabel}</h3>
              <ul className="fo-list">
                {handoff.entries.map((entry, index) => (
                  <li key={entry.title}>
                    <span className="fo-index">{pad(index)}</span>
                    <strong>
                      {entry.title}
                      {entry.tag ? <Tag>{entry.tag}</Tag> : null}
                    </strong>
                  </li>
                ))}
              </ul>
              <h3>{handoff.intentsLabel}</h3>
              <ul className="fo-chips">
                {handoff.intents.map((intent) => (
                  <li key={intent}>{intent}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="fo-section"
          data-bg="white"
          aria-labelledby="fl-scenes-title"
        >
          <SectionHead
            id="fl-scenes-title"
            kicker={scenes.kicker}
            title={scenes.title}
            lead={scenes.note}
            layout="split"
          />
          <ul className="fl-scenes">
            {scenes.items.map((scene, index) => (
              <li key={scene} data-reveal style={{ '--i': index % 4 } as Vars}>
                <span className="fo-index">{pad(index)}</span>
                <strong>{scene}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="fo-section"
          data-bg="navy"
          aria-labelledby="fl-control-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fl-control-title"
              kicker={control.kicker}
              title={control.title}
            />
            <ol className="fo-list">
              {control.items.map((item, index) => (
                <li key={item} data-reveal style={{ '--i': index } as Vars}>
                  <span className="fo-index">{pad(index)}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="fo-section fl-devices-section"
          data-bg="paper"
          aria-labelledby="fl-devices-title"
        >
          <div className="fo-split">
            <figure className="fl-moments" data-reveal>
              <div className="fl-devices">
                <Frame
                  src={shots.moments.src}
                  w={shots.moments.w}
                  h={shots.moments.h}
                  label={shotLabels.moments}
                />
                <Phone {...shots.onboarding} />
              </div>
              <figcaption className="fo-note">{momentsNote}</figcaption>
            </figure>
            <div className="fl-devices-copy">
              <SectionHead
                id="fl-devices-title"
                kicker={devices.kicker}
                title={devices.title}
              />
              <ul className="fo-list">
                {devices.items.map((item, index) => (
                  <li
                    key={item.title}
                    data-reveal
                    style={{ '--i': index } as Vars}
                  >
                    <span className="fo-index">{pad(index)}</span>
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
          className="fo-section"
          data-bg="white"
          aria-labelledby="fl-merged-title"
        >
          <SectionHead
            id="fl-merged-title"
            kicker={merged.kicker}
            title={merged.title}
          />
          <ol className="fo-cards">
            {merged.items.map((item, index) => (
              <li key={item.title} data-reveal style={{ '--i': index } as Vars}>
                <span className="fo-index">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer tone="yellow">
        <Closing
          id="fl-closing-title"
          title={closing.title}
          actions={[
            { label: closing.follow, href: contactHref('life') },
            { label: closing.home, href: HOME, tone: 'light' },
          ]}
        />
        <NextProduct current="life" />
      </Footer>
    </div>
  );
}
