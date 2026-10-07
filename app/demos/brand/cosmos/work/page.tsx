'use client';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import {
  GITHUB_URL,
  INSTALL_URL,
  MAC_DOWNLOAD_URL,
  RELEASES_URL,
  featuresByAvailability,
  screenshotNote,
  screenshots,
  short,
} from '../../../../../content/molis-work';
import Galaxy from '../galaxy';
import {
  Phrases,
  ProductHero,
  Scope,
  SectionHead,
  Shot,
  Tag,
  pad,
  type Action,
} from '../kit';
import {
  Footer,
  SiteHeader,
  contactHref,
  useReveal,
  type Vars,
} from '../shared';
import '../cosmos.css';
import '../kit.css';
import './work.css';

// 短版：只讲 v0.2.0 现在能做的事，下一版集中在「即将到来」。文案全部来自 content/molis-work.ts 的 short。

const { hero, audience, howto, highlights, start, upcoming, faq } = short;
const features = featuresByAvailability();
const stepShots = [screenshots.create, screenshots.runtime, screenshots.check];

const heroActions: Action[] = [
  ...(MAC_DOWNLOAD_URL
    ? [
        {
          label: '下载 macOS 版',
          href: MAC_DOWNLOAD_URL,
          tone: 'primary' as const,
        },
      ]
    : []),
  {
    label: hero.start,
    href: '#start',
    tone: MAC_DOWNLOAD_URL ? 'glass' : 'primary',
  },
  { label: '在 GitHub 查看', href: GITHUB_URL, external: true },
];

type Feature = ReturnType<typeof featuresByAvailability>['released'][number];

/** 一组功能：现在能用的星点亮着，下一版和规划中的还是空心 */
function FeatureGroup({
  title,
  items,
  kind,
}: {
  title: string;
  items: Feature[];
  kind: 'released' | 'next' | 'planned';
}) {
  return (
    <details className="cs-work-group" data-kind={kind}>
      <summary>
        <i className="cs-work-star" aria-hidden="true" />
        <span>{title}</span>
        <small>{items.length}</small>
        <Plus size={18} aria-hidden="true" />
      </summary>
      <ul>
        {items.map((feature) => (
          <li key={feature.name}>
            <i className="cs-work-star" aria-hidden="true" />
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

export default function CosmosWorkPage() {
  const siteRef = useReveal();
  const paths = short.closing.paths;

  return (
    <div className="cs-site cs-work" ref={siteRef}>
      <SiteHeader current="work" />

      <main id="main">
        <div id="cs-work-deep" className="cs-deep">
          <Galaxy track="#cs-work-deep" />
          <ProductHero
            id="cs-work-title"
            className="cs-work-hero"
            kicker={hero.kicker}
            title={hero.title}
            lead={hero.lead}
            status={hero.status}
            actions={heroActions}
            stars={false}
          />

          <section
            className="cs-work-screen"
            data-scroll
            aria-label="Molis Work 界面"
          >
            <Scope caption={screenshotNote} className="cs-work-screen-frame">
              <Shot
                src={screenshots.goal.src}
                w={screenshots.goal.w}
                h={screenshots.goal.h}
                label={screenshots.goal.label}
                priority
              />
            </Scope>
          </section>
        </div>

        <section
          className="cs-work-audience cs-reveal"
          aria-label={audience.kicker}
        >
          <span className="cs-eyebrow">{audience.kicker}</span>
          <p>{audience.text}</p>
        </section>

        <section className="cs-section" aria-labelledby="cs-howto-title">
          <SectionHead
            id="cs-howto-title"
            kicker={howto.kicker}
            title={howto.title}
          />
          <ol className="cs-work-steps" data-reveal>
            <svg
              className="cs-work-trajectory"
              viewBox="0 0 1200 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M60 20 L1140 20" />
            </svg>
            {howto.steps.map((step, index) => {
              const shot = stepShots[index];
              return (
                <li key={step.title} style={{ '--i': index } as Vars}>
                  <span className="cs-work-node" aria-hidden="true" />
                  <Shot
                    src={shot.src}
                    w={shot.w}
                    h={shot.h}
                    label={shot.label}
                  />
                  <span className="cs-index">{pad(index)}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
          <p className="cs-note">{screenshotNote}</p>
        </section>

        <section className="cs-section" aria-labelledby="cs-highlights-title">
          <SectionHead
            id="cs-highlights-title"
            kicker={highlights.kicker}
            title={highlights.title}
          />
          <div className="cs-work-pillars" data-reveal>
            <svg
              className="cs-work-pillar-line"
              viewBox="0 0 1200 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M200 20 L1000 20" />
            </svg>
            {highlights.items.map((item, index) => (
              <article
                key={item.title}
                className="cs-work-pillar"
                style={{ '--i': index } as Vars}
              >
                <span className="cs-work-pillar-star" aria-hidden="true" />
                <span className="cs-index">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="start"
          className="cs-section cs-band cs-work-start"
          aria-labelledby="cs-start-title"
        >
          <div className="cs-split">
            <div className="cs-head cs-reveal" data-align="start">
              <span className="cs-eyebrow">{start.kicker}</span>
              <h2 id="cs-start-title">
                <Phrases text={start.title} />
              </h2>
            </div>
            <ol className="cs-work-launch">
              {start.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="cs-reveal"
                  style={{ '--r': index } as Vars}
                >
                  <span className="cs-work-launch-index">{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                    {step.action ? (
                      <a href={INSTALL_URL} target="_blank" rel="noreferrer">
                        {step.action}
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="next"
          className="cs-section cs-work-upcoming"
          aria-labelledby="cs-upcoming-title"
        >
          <div className="cs-split">
            <div className="cs-head cs-reveal" data-align="start">
              <span className="cs-eyebrow">{upcoming.kicker}</span>
              <h2 id="cs-upcoming-title">
                <Phrases text={upcoming.title} />
              </h2>
              <p>{upcoming.lead}</p>
              <a
                className="cs-button"
                href={RELEASES_URL}
                target="_blank"
                rel="noreferrer"
              >
                {upcoming.action}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
            <ul className="cs-work-approach">
              {upcoming.items.map((item, index) => (
                <li
                  key={item.title}
                  className="cs-reveal"
                  style={{ '--r': index % 2 } as Vars}
                >
                  <i className="cs-work-star" aria-hidden="true" />
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
          className="cs-section cs-work-features"
          aria-labelledby="cs-features-title"
        >
          <SectionHead
            id="cs-features-title"
            kicker={short.features.kicker}
            title={short.features.title}
          />
          <div className="cs-work-groups cs-reveal">
            <FeatureGroup
              title={short.features.groups.released}
              items={features.released}
              kind="released"
            />
            <FeatureGroup
              title={short.features.groups.next}
              items={features.next}
              kind="next"
            />
            <FeatureGroup
              title={short.features.groups.planned}
              items={features.planned}
              kind="planned"
            />
          </div>
        </section>

        <section
          className="cs-section cs-work-faq"
          aria-labelledby="cs-faq-title"
        >
          <div className="cs-split">
            <div className="cs-head cs-reveal" data-align="start">
              <span className="cs-eyebrow">{faq.kicker}</span>
              <h2 id="cs-faq-title">{faq.title}</h2>
            </div>
            <dl>
              {faq.items.map((item, index) => (
                <div
                  key={item.q}
                  className="cs-reveal"
                  style={{ '--r': index } as Vars}
                >
                  <dt>
                    <span className="cs-index">{pad(index)}</span>
                    {item.q}
                  </dt>
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
        <section
          className="cs-closing cs-reveal"
          aria-labelledby="cs-work-closing-title"
        >
          <h2 id="cs-work-closing-title">
            {short.closing.title.map((line) => (
              <span className="cs-phrase" key={line}>
                {line}
              </span>
            ))}
          </h2>
        </section>
        <div className="cs-work-paths">
          <a className="cs-work-path" href="#start">
            <small>01</small>
            <strong>{paths.start.title}</strong>
            <span>{paths.start.text}</span>
          </a>
          <a
            className="cs-work-path"
            href={RELEASES_URL}
            target="_blank"
            rel="noreferrer"
          >
            <small>02</small>
            <strong>
              {paths.follow.title}
              <ArrowUpRight size={18} aria-hidden="true" />
            </strong>
            <span>{paths.follow.text}</span>
          </a>
          <Link className="cs-work-path" href={contactHref('enterprise')}>
            <small>03</small>
            <strong>{paths.team.title}</strong>
            <span>{paths.team.text}</span>
          </Link>
        </div>
      </Footer>
    </div>
  );
}
