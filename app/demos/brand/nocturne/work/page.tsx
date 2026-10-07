'use client';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import {
  GITHUB_URL,
  INSTALL_URL,
  MAC_DOWNLOAD_URL,
  RELEASES_URL,
  featuresByAvailability,
  hero as longHero,
  screenshotNote,
  screenshots,
  short,
  tagsOf,
} from '../../../../../content/molis-work';
import { coreProduct } from '../../../../../content/studio';
import {
  Actions,
  Closing,
  Frame,
  ProductHero,
  Screen,
  SectionHead,
  Phrases,
  Tag,
  pad,
  type Action,
} from '../kit';
import {
  Footer,
  SiteHeader,
  contactHref,
  useNocturneMotion,
  type Vars,
} from '../shared';
import { WorkVisual } from '../visuals';
import '../nocturne.css';
import '../kit.css';
import './work.css';

// 短版：只讲 v0.2.0 现在能做的事，下一版集中在「即将到来」。文案全部来自 content/molis-work.ts 的 short；
// 视觉沿用夜曲长版的词汇：亮起的屏、侧栏章节、描边大号数字、片尾字幕。

const { hero, audience, howto, highlights, start, upcoming, faq } = short;
const features = featuresByAvailability();
const stepShots = [screenshots.create, screenshots.runtime, screenshots.check];

const heroActions: Action[] = [
  ...(MAC_DOWNLOAD_URL
    ? [
        {
          label: '下载 macOS 版',
          href: MAC_DOWNLOAD_URL,
          external: true,
          tone: 'primary' as const,
        },
      ]
    : []),
  {
    label: hero.start,
    href: '#start',
    tone: MAC_DOWNLOAD_URL ? 'ghost' : 'primary',
  },
  { label: coreProduct.actions.github, href: GITHUB_URL, external: true },
];

function FeatureList({
  title,
  items,
}: {
  title: string;
  items: ReturnType<typeof featuresByAvailability>['released'];
}) {
  return (
    <details className="nc-group">
      <summary>
        <span>{title}</span>
        <small>{items.length} 项</small>
        <Plus size={18} aria-hidden="true" />
      </summary>
      <ul>
        {items.map((feature) => (
          <li key={feature.name}>
            <strong>
              {feature.name}
              {feature.status === 'preview' ? (
                <Tag>{tagsOf('preview')[0]}</Tag>
              ) : null}
            </strong>
            <span>{feature.line}</span>
            <small>{feature.group}</small>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default function NocturneWorkPage() {
  const rootRef = useNocturneMotion();
  const paths = short.closing.paths;

  return (
    <div className="nc-site nc-work" ref={rootRef}>
      <div className="nc-grain" aria-hidden="true" />
      <SiteHeader current="work" />

      <main id="main">
        <ProductHero
          id="nc-work-title"
          layout="center"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={heroActions}
        />

        <section className="nc-work-screen" aria-label="Molis Work 界面">
          <Screen note={screenshotNote}>
            <Frame
              src={screenshots.goal.src}
              w={screenshots.goal.w}
              h={screenshots.goal.h}
              label={screenshots.goal.label}
            />
          </Screen>
        </section>

        <section className="nc-audience" aria-label={audience.kicker}>
          <div className="nc-audience-copy" data-reveal>
            <span className="nc-kicker">{audience.kicker}</span>
            <p>
              <Phrases text={audience.text} />
            </p>
          </div>
          <div data-reveal style={{ '--r': 1 } as Vars}>
            <WorkVisual agents={longHero.agents} />
          </div>
        </section>

        <section className="nc-section" aria-labelledby="nc-howto-title">
          <SectionHead
            id="nc-howto-title"
            kicker={howto.kicker}
            title={howto.title}
          />
          <div className="nc-chapters" data-rail data-active="0">
            <ol className="nc-rail" aria-hidden="true">
              {howto.steps.map((step, index) => (
                <li key={step.title}>{pad(index)}</li>
              ))}
            </ol>
            <ol className="nc-chapter-list">
              {howto.steps.map((step, index) => {
                const shot = stepShots[index];
                return (
                  <li
                    key={step.title}
                    className="nc-chapter"
                    data-chapter={index}
                  >
                    <div className="nc-chapter-copy" data-reveal>
                      <span className="nc-index">{pad(index)}</span>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                    <div
                      className="nc-chapter-shot"
                      data-reveal
                      style={{ '--r': 1 } as Vars}
                    >
                      <Frame
                        src={shot.src}
                        w={shot.w}
                        h={shot.h}
                        label={shot.label}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="nc-note">{screenshotNote}</p>
        </section>

        <section className="nc-section" aria-labelledby="nc-highlights-title">
          <SectionHead
            id="nc-highlights-title"
            kicker={highlights.kicker}
            title={highlights.title}
          />
          <ol className="nc-pillars">
            {highlights.items.map((item, index) => (
              <li
                key={item.title}
                className="nc-pillar"
                data-reveal
                style={{ '--r': index } as Vars}
              >
                <span className="nc-pillar-index">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="start"
          className="nc-section nc-band"
          aria-labelledby="nc-start-title"
        >
          <div className="nc-split">
            <SectionHead
              id="nc-start-title"
              kicker={start.kicker}
              title={start.title}
              align="start"
            />
            <ol className="nc-start-steps">
              {start.steps.map((step, index) => (
                <li
                  key={step.title}
                  data-reveal
                  style={{ '--r': index } as Vars}
                >
                  <span className="nc-start-index">{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                    {step.action ? (
                      <a
                        className="nc-more"
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
          className="nc-section"
          aria-labelledby="nc-upcoming-title"
        >
          <div className="nc-split">
            <SectionHead
              id="nc-upcoming-title"
              kicker={upcoming.kicker}
              title={upcoming.title}
              lead={upcoming.lead}
              align="start"
            >
              <Actions
                items={[
                  {
                    label: upcoming.action,
                    href: RELEASES_URL,
                    external: true,
                  },
                ]}
              />
            </SectionHead>
            <ul className="nc-upcoming">
              {upcoming.items.map((item, index) => (
                <li
                  key={item.title}
                  data-reveal
                  data-tagged={item.tag ? '' : undefined}
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

        <section className="nc-section" aria-labelledby="nc-features-title">
          <SectionHead
            id="nc-features-title"
            kicker={short.features.kicker}
            title={short.features.title}
          />
          <div className="nc-groups" data-reveal>
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

        <section className="nc-section nc-panel" aria-labelledby="nc-faq-title">
          <div className="nc-split">
            <SectionHead
              id="nc-faq-title"
              kicker={faq.kicker}
              title={faq.title}
              align="start"
            />
            <dl className="nc-faq">
              {faq.items.map((item, index) => (
                <div key={item.q} data-reveal style={{ '--r': index } as Vars}>
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
        <Closing id="nc-work-closing" title={short.closing.title}>
          <div className="nc-paths" data-reveal>
            <a className="nc-path" href="#start">
              <small>01</small>
              <h3>{paths.start.title}</h3>
              <span>{paths.start.text}</span>
            </a>
            <a
              className="nc-path"
              href={RELEASES_URL}
              target="_blank"
              rel="noreferrer"
            >
              <small>02</small>
              <h3>
                {paths.follow.title}
                <ArrowUpRight size={18} aria-hidden="true" />
              </h3>
              <span>{paths.follow.text}</span>
            </a>
            <Link className="nc-path" href={contactHref('enterprise')}>
              <small>03</small>
              <h3>{paths.team.title}</h3>
              <span>{paths.team.text}</span>
            </Link>
          </div>
        </Closing>
      </Footer>
    </div>
  );
}
