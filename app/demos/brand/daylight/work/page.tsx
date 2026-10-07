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
import { coreProduct } from '../../../../../content/studio';
import {
  Closing,
  ProductHero,
  SectionHead,
  Stage,
  Tag,
  Window,
  type Action,
} from '../kit';
import {
  Footer,
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
import './work.css';

// 短版：只讲 v0.2.0 现在能做的事，下一版集中在「即将到来」。文案全部来自 content/molis-work.ts 的 short。
// 一天的光照旧：清晨的首屏，白天的用法与亮点，傍晚的常见问题，落到黄昏收尾。

const { hero, audience, howto, highlights, start, upcoming, faq } = short;
const features = featuresByAvailability();
const stepShots = [screenshots.create, screenshots.runtime, screenshots.check];

const heroActions: Action[] = [
  ...(MAC_DOWNLOAD_URL
    ? [
        {
          label: '下载 macOS 版',
          href: MAC_DOWNLOAD_URL,
          tone: 'light' as const,
        },
      ]
    : []),
  {
    label: hero.start,
    href: '#start',
    tone: MAC_DOWNLOAD_URL ? 'glass' : 'light',
  },
  {
    label: coreProduct.actions.github,
    href: GITHUB_URL,
    external: true,
    tone: 'glass',
  },
];

function FeatureList({
  title,
  items,
}: {
  title: string;
  items: ReturnType<typeof featuresByAvailability>['released'];
}) {
  return (
    <details className="dl-group">
      <summary>
        <span>{title}</span>
        <small>{items.length} 项</small>
        <Plus size={18} aria-hidden="true" />
      </summary>
      <ul>
        {items.map((feature) => (
          <li
            key={feature.name}
            className="dl-feature"
            onPointerMove={trackSpotlight}
          >
            <strong>
              {feature.name}
              {feature.status === 'preview' ? <Tag>预览</Tag> : null}
            </strong>
            <p>{feature.line}</p>
            <small>{feature.group}</small>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default function DaylightWorkPage() {
  const siteRef = useDaylight();
  const paths = short.closing.paths;

  return (
    <div className="dl-site dl-work" ref={siteRef}>
      <SiteHeader current="work" />

      <main id="main">
        <ProductHero
          id="dl-work-title"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={heroActions}
          image={{
            src: '/images/atelier/studio-desk.jpg',
            w: 1440,
            h: 960,
            position: '50% 64%',
          }}
        />

        <Stage label={screenshots.goal.label} caption={screenshotNote}>
          <Window
            src={screenshots.goal.src}
            w={screenshots.goal.w}
            h={screenshots.goal.h}
            label={screenshots.goal.label}
          />
        </Stage>

        <section className="dl-audience" aria-label={audience.kicker}>
          <div className="dl-reveal">
            <span className="dl-eyebrow">{audience.kicker}</span>
            <p>{audience.text}</p>
          </div>
        </section>

        <section className="dl-section" aria-labelledby="dl-howto-title">
          <SectionHead
            id="dl-howto-title"
            kicker={howto.kicker}
            title={howto.title}
          />
          <ol className="dl-pillars dl-work-steps">
            {howto.steps.map((step, index) => {
              const shot = stepShots[index];
              return (
                <li key={step.title} style={{ '--r': index } as Vars}>
                  <div className="dl-shot dl-reveal">
                    <Window
                      src={shot.src}
                      w={shot.w}
                      h={shot.h}
                      label={shot.label}
                    />
                  </div>
                  <div className="dl-pillar dl-reveal">
                    <span className="dl-index">{pad(index)}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="dl-note">{screenshotNote}</p>
        </section>

        <section className="dl-section" aria-labelledby="dl-highlights-title">
          <SectionHead
            id="dl-highlights-title"
            kicker={highlights.kicker}
            title={highlights.title}
          />
          <ol className="dl-pillars">
            {highlights.items.map((item, index) => (
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
        </section>

        <section
          id="start"
          className="dl-section"
          aria-labelledby="dl-start-title"
        >
          <div className="dl-band dl-split">
            <LeafShadow className="dl-leaves" />
            <SectionHead
              id="dl-start-title"
              kicker={start.kicker}
              title={start.title}
            />
            <ol className="dl-work-start">
              {start.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="dl-reveal"
                  style={{ '--r': index } as Vars}
                >
                  <span className="dl-work-start-index">{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                    {step.action ? (
                      <a
                        className="dl-text-link"
                        href={INSTALL_URL}
                        target="_blank"
                        rel="noreferrer"
                      >
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
          className="dl-section dl-split"
          aria-labelledby="dl-upcoming-title"
        >
          <SectionHead
            id="dl-upcoming-title"
            kicker={upcoming.kicker}
            title={upcoming.title}
            lead={upcoming.lead}
          >
            <div className="dl-actions">
              <a
                className="dl-button dl-button-line"
                href={RELEASES_URL}
                target="_blank"
                rel="noreferrer"
              >
                {upcoming.action}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </SectionHead>
          <ul className="dl-work-upcoming">
            {upcoming.items.map((item, index) => (
              <li
                key={item.title}
                className="dl-reveal"
                style={{ '--r': index % 2 } as Vars}
              >
                <span className="dl-index">{pad(index)}</span>
                <strong>
                  {item.title}
                  {item.tag ? <Tag>{item.tag}</Tag> : null}
                </strong>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="dl-section" aria-labelledby="dl-features-title">
          <SectionHead
            id="dl-features-title"
            kicker={short.features.kicker}
            title={short.features.title}
          />
          <div className="dl-groups dl-reveal">
            <FeatureList
              title={short.features.groups.released}
              items={features.released}
            />
            <FeatureList
              title={short.features.groups.next}
              items={features.next}
            />
            <FeatureList
              title={short.features.groups.planned}
              items={features.planned}
            />
          </div>
        </section>

        <section
          className="dl-evening"
          data-scene="pass"
          aria-labelledby="dl-faq-title"
        >
          <div className="dl-evening-sun" aria-hidden="true" />
          <LeafShadow className="dl-leaves" />
          <div className="dl-evening-inner dl-split">
            <SectionHead
              id="dl-faq-title"
              kicker={faq.kicker}
              title={faq.title}
            />
            <dl className="dl-work-faq">
              {faq.items.map((item, index) => (
                <div
                  key={item.q}
                  className="dl-reveal"
                  style={{ '--r': index } as Vars}
                >
                  <dt>{item.q}</dt>
                  <dd>
                    {item.a}
                    {item.team ? (
                      <>
                        {' '}
                        <Link href={contactHref('enterprise')}>
                          {faq.teamAction}
                          <ArrowUpRight size={14} aria-hidden="true" />
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

      <Footer wordmark="Molis Work">
        <Closing id="dl-work-closing" title={short.closing.title}>
          <div
            className="dl-dusk-paths dl-closing-paths"
            style={{ '--cols': 3 } as Vars}
          >
            <a
              className="dl-path dl-reveal"
              href="#start"
              onPointerMove={trackSpotlight}
            >
              <small>01</small>
              <h3>{paths.start.title}</h3>
              <p>{paths.start.text}</p>
              <span className="dl-path-action">
                <ArrowUpRight size={19} aria-hidden="true" />
              </span>
            </a>
            <a
              className="dl-path dl-reveal"
              href={RELEASES_URL}
              target="_blank"
              rel="noreferrer"
              onPointerMove={trackSpotlight}
            >
              <small>02</small>
              <h3>{paths.follow.title}</h3>
              <p>{paths.follow.text}</p>
              <span className="dl-path-action">
                <ArrowUpRight size={19} aria-hidden="true" />
              </span>
            </a>
            <Link
              className="dl-path dl-reveal"
              href={contactHref('enterprise')}
              onPointerMove={trackSpotlight}
            >
              <small>03</small>
              <h3>{paths.team.title}</h3>
              <p>{paths.team.text}</p>
              <span className="dl-path-action">
                <ArrowUpRight size={19} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </Closing>
      </Footer>
    </div>
  );
}
