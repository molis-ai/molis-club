'use client';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import {
  GITHUB_URL,
  INSTALL_URL,
  MAC_DOWNLOAD_URL,
  RELEASES_URL,
  featuresByAvailability,
  short,
} from '../../../../../content/molis-work';
import {
  Closing,
  Compare,
  Frame,
  SectionHead,
  Phrases,
  ProductHero,
  Tag,
  pad,
  type Action,
} from '../kit';
import { workShots } from '../shots';
import {
  Footer,
  SiteHeader,
  contactHref,
  useEditionMotion,
  type Vars,
} from '../shared';
import '../edition-c.css';
import '../kit.css';
import './work.css';

// 短版：只讲 v0.2.0 现在能做的事，下一版集中在「即将到来」。文案全部来自 content/molis-work.ts 的 short。

const { hero, audience, howto, highlights, start, compare, upcoming, faq } =
  short;
const features = featuresByAvailability();
const stepShots = [workShots.create, workShots.runtime, workShots.check];

const heroActions: Action[] = [
  ...(MAC_DOWNLOAD_URL
    ? [{ label: '下载 macOS 版', href: MAC_DOWNLOAD_URL, tone: 'light' as const }]
    : []),
  { label: hero.start, href: '#start', tone: MAC_DOWNLOAD_URL ? 'glass' : 'light' },
  { label: '在 GitHub 查看', href: GITHUB_URL, external: true, tone: 'glass' },
];

function FeatureList({
  title,
  items,
  open = false,
}: {
  title: string;
  items: ReturnType<typeof featuresByAvailability>['released'];
  open?: boolean;
}) {
  return (
    <details className="ew-group" open={open}>
      <summary>
        <span>{title}</span>
        <small>{items.length} 项</small>
        <Plus size={16} aria-hidden="true" />
      </summary>
      <ul>
        {items.map((feature) => (
          <li key={feature.name}>
            <strong>
              {feature.name}
              {feature.status === 'preview' ? <Tag>预览</Tag> : null}
            </strong>
            <span>{feature.line}</span>
            <small>{feature.group}</small>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default function EditionCWorkPage() {
  const siteRef = useEditionMotion();
  const paths = short.closing.paths;

  return (
    <div className="ec-site ew-site" ref={siteRef}>
      <SiteHeader current="work" />

      <main id="main">
        <ProductHero
          id="ew-title"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={heroActions}
          image={{ src: '/images/atelier/studio-desk.jpg', w: 1440, h: 960 }}
          wordmark="Molis Work"
        />

        <section
          className="ep-screen"
          data-scroll="enter"
          aria-label="Molis Work 界面"
        >
          <figure>
            <Frame
              src={workShots.goal.src}
              w={workShots.goal.w}
              h={workShots.goal.h}
              label={workShots.goal.label}
            />
            <figcaption>产品截图 · v0.2.0 · 演示数据</figcaption>
          </figure>
        </section>

        <section className="ew-audience ec-reveal" aria-label={audience.kicker}>
          <span className="ec-eyebrow">{audience.kicker}</span>
          <p>{audience.text}</p>
        </section>

        <section className="ep-section" aria-labelledby="ew-howto-title">
          <SectionHead id="ew-howto-title" kicker={howto.kicker} title={howto.title} />
          <ol className="ew-steps">
            {howto.steps.map((step, index) => {
              const shot = stepShots[index];
              return (
                <li
                  key={step.title}
                  className="ew-step ec-reveal"
                  style={{ '--r': index } as Vars}
                >
                  <div className="ew-step-shot">
                    <Frame src={shot.src} w={shot.w} h={shot.h} label={shot.label} />
                  </div>
                  <span className="ep-index">{pad(index)}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
          <p className="ep-note">产品截图 · v0.2.0 · 演示数据。完整的操作录屏还在制作。</p>
        </section>

        <section className="ep-section" aria-labelledby="ew-highlights-title">
          <SectionHead
            id="ew-highlights-title"
            kicker={highlights.kicker}
            title={highlights.title}
          />
          <ol className="ep-cards">
            {highlights.items.map((item, index) => (
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
          <p className="ep-note">{highlights.note}</p>
        </section>

        <section
          id="start"
          className="ep-section ep-band ew-start"
          aria-labelledby="ew-start-title"
        >
          <div className="ep-split">
            <div className="ep-head ec-reveal" data-align="start">
              <span className="ec-eyebrow">{start.kicker}</span>
              <h2 id="ew-start-title">
                <Phrases text={start.title} />
              </h2>
            </div>
            <ol className="ew-start-steps">
              {start.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="ec-reveal"
                  style={{ '--r': index } as Vars}
                >
                  <span className="ew-start-index">{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                    {step.action ? (
                      <a href={INSTALL_URL} target="_blank" rel="noreferrer">
                        {step.action}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ep-section" aria-labelledby="ew-compare-title">
          <SectionHead id="ew-compare-title" kicker={compare.kicker} title={compare.title} />
          <Compare
            labels={[compare.labels.now, compare.labels.pain, compare.labels.here]}
            rows={compare.rows.map((row) => [row.now, row.pain, row.here])}
          />
        </section>

        <section
          id="next"
          className="ep-section ep-panel ew-upcoming"
          aria-labelledby="ew-upcoming-title"
        >
          <div className="ep-split">
            <div className="ep-head ec-reveal" data-align="start">
              <span className="ec-eyebrow">{upcoming.kicker}</span>
              <h2 id="ew-upcoming-title">
                <Phrases text={upcoming.title} />
              </h2>
              <p>{upcoming.lead}</p>
              <a
                className="ec-button"
                href={RELEASES_URL}
                target="_blank"
                rel="noreferrer"
              >
                {upcoming.action}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
            <ul className="ew-upcoming-list">
              {upcoming.items.map((item, index) => (
                <li
                  key={item.title}
                  className="ec-reveal"
                  style={{ '--r': index % 2 } as Vars}
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
          className="ep-section ew-features"
          aria-labelledby="ew-features-title"
        >
          <SectionHead
            id="ew-features-title"
            kicker={short.features.kicker}
            title={short.features.title}
          />
          <div className="ew-groups">
            <FeatureList
              title={short.features.groups.released}
              items={features.released}
              open
            />
            <FeatureList title={short.features.groups.next} items={features.next} />
            <FeatureList
              title={short.features.groups.planned}
              items={features.planned}
            />
          </div>
        </section>

        <section className="ep-section ew-faq" aria-labelledby="ew-faq-title">
          <div className="ep-split">
            <div className="ep-head ec-reveal" data-align="start">
              <span className="ec-eyebrow">{faq.kicker}</span>
              <h2 id="ew-faq-title">{faq.title}</h2>
            </div>
            <dl>
              {faq.items.map((item) => (
                <div key={item.q} className="ec-reveal">
                  <dt>{item.q}</dt>
                  <dd>
                    {item.a}
                    {item.team ? (
                      <>
                        {' '}
                        <Link href={contactHref('enterprise')}>
                          {faq.teamAction}
                        </Link>
                      </>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <Footer>
        <Closing id="ew-closing-title" title={short.closing.title} />
        <div className="ew-paths">
          <a className="ew-path" href="#start">
            <small>01</small>
            <strong>{paths.start.title}</strong>
            <span>{paths.start.text}</span>
          </a>
          <a
            className="ew-path"
            href={RELEASES_URL}
            target="_blank"
            rel="noreferrer"
          >
            <small>02</small>
            <strong>
              {paths.follow.title}
              <ArrowUpRight size={16} aria-hidden="true" />
            </strong>
            <span>{paths.follow.text}</span>
          </a>
          <Link className="ew-path" href={contactHref('enterprise')}>
            <small>03</small>
            <strong>{paths.team.title}</strong>
            <span>{paths.team.text}</span>
          </Link>
        </div>
      </Footer>
    </div>
  );
}
