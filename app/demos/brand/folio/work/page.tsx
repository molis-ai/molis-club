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
import { WorkArt } from '../art';
import {
  Closing,
  Collage,
  Frame,
  Phrases,
  ProductHero,
  SectionHead,
  Tag,
  pad,
  type Action,
} from '../kit';
import {
  Footer,
  SiteHeader,
  contactHref,
  useFolioMotion,
  type Vars,
} from '../shared';
import '../folio.css';
import '../kit.css';
import './work.css';

// 短版：只讲 v0.2.0 现在能做的事，下一版集中在「即将到来」。文案全部来自 content/molis-work.ts 的 short；
// 截图是 content 里的 v0.2.0 界面截图，标「产品截图 · v0.2.0 · 演示数据」。

const { hero, audience, howto, highlights, start, upcoming, faq } = short;
const features = featuresByAvailability();
const stepShots = [screenshots.create, screenshots.runtime, screenshots.check];

const heroActions: Action[] = [
  ...(MAC_DOWNLOAD_URL
    ? [{ label: '下载 macOS 版', href: MAC_DOWNLOAD_URL }]
    : []),
  {
    label: hero.start,
    href: '#start',
    tone: MAC_DOWNLOAD_URL ? 'ghost' : 'ink',
  },
  { label: '在 GitHub 查看', href: GITHUB_URL, external: true, tone: 'ghost' },
];

function FeatureList({
  title,
  items,
  tone,
}: {
  title: string;
  items: ReturnType<typeof featuresByAvailability>['released'];
  tone: string;
}) {
  return (
    <details className="fw-group" data-tone={tone}>
      <summary>
        <span>{title}</span>
        <small>{items.length} 项</small>
        <i aria-hidden="true">
          <Plus size={18} />
        </i>
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

export default function FolioWorkPage() {
  const rootRef = useFolioMotion();
  const paths = short.closing.paths;

  return (
    <div className="fo-site fw-site" ref={rootRef}>
      <SiteHeader current="work" />

      <main id="main">
        <ProductHero
          id="fw-title"
          className="fw-hero"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={heroActions}
          masthead="Work"
          art={<WorkArt />}
        />

        <section
          className="fo-section fw-screen"
          data-bg="white"
          aria-label="Molis Work 界面"
        >
          <Collage note={screenshotNote}>
            <Frame
              src={screenshots.goal.src}
              w={screenshots.goal.w}
              h={screenshots.goal.h}
              label={screenshots.goal.label}
            />
          </Collage>
        </section>

        <section
          className="fo-section fw-audience"
          data-bg="yellow"
          aria-label={audience.kicker}
        >
          <div data-reveal>
            <span className="fo-kicker">{audience.kicker}</span>
            <p>
              <Phrases text={audience.text} />
            </p>
          </div>
        </section>

        <section
          className="fo-section"
          data-bg="paper"
          aria-labelledby="fw-howto-title"
        >
          <SectionHead
            id="fw-howto-title"
            kicker={howto.kicker}
            title={howto.title}
          />
          <ol className="fw-steps">
            {howto.steps.map((step, index) => {
              const shot = stepShots[index];
              return (
                <li
                  key={step.title}
                  data-reveal
                  style={{ '--i': index } as Vars}
                >
                  <div className="fw-step-shot">
                    <Frame
                      src={shot.src}
                      w={shot.w}
                      h={shot.h}
                      label={shot.label}
                      tape={false}
                    />
                  </div>
                  <span className="fo-index">{pad(index)}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
          <p className="fo-note">{screenshotNote}</p>
        </section>

        <section
          className="fo-section"
          data-bg="white"
          aria-labelledby="fw-highlights-title"
        >
          <SectionHead
            id="fw-highlights-title"
            kicker={highlights.kicker}
            title={highlights.title}
          />
          <ol className="fo-cards">
            {highlights.items.map((item, index) => (
              <li key={item.title} data-reveal style={{ '--i': index } as Vars}>
                <span className="fo-index">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="start"
          className="fo-section fw-start"
          data-bg="navy"
          aria-labelledby="fw-start-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fw-start-title"
              kicker={start.kicker}
              title={start.title}
            />
            <ol className="fw-start-steps">
              {start.steps.map((step, index) => (
                <li
                  key={step.title}
                  data-reveal
                  style={{ '--i': index } as Vars}
                >
                  <span className="fw-start-index" aria-hidden="true">
                    {index + 1}
                  </span>
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
          className="fo-section fw-upcoming"
          data-bg="paper"
          aria-labelledby="fw-upcoming-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fw-upcoming-title"
              kicker={upcoming.kicker}
              title={upcoming.title}
              lead={upcoming.lead}
            >
              <a
                className="fo-btn fo-btn-ink"
                href={RELEASES_URL}
                target="_blank"
                rel="noreferrer"
              >
                {upcoming.action}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </SectionHead>
            <ul className="fw-slips">
              {upcoming.items.map((item, index) => (
                <li
                  key={item.title}
                  data-reveal
                  style={{ '--i': index % 2 } as Vars}
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
          className="fo-section fw-features"
          data-bg="white"
          aria-labelledby="fw-features-title"
        >
          <SectionHead
            id="fw-features-title"
            kicker={short.features.kicker}
            title={short.features.title}
          />
          <div className="fw-groups">
            <FeatureList
              title={short.features.groups.released}
              items={features.released}
              tone="sage"
            />
            <FeatureList
              title={short.features.groups.next}
              items={features.next}
              tone="pink"
            />
            <FeatureList
              title={short.features.groups.planned}
              items={features.planned}
              tone="planned"
            />
          </div>
        </section>

        <section
          className="fo-section fw-faq"
          data-bg="paper"
          aria-labelledby="fw-faq-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fw-faq-title"
              kicker={faq.kicker}
              title={faq.title}
            />
            <dl>
              {faq.items.map((item, index) => (
                <div key={item.q} data-reveal style={{ '--i': index } as Vars}>
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
        <Closing id="fw-closing-title" title={short.closing.title}>
          <div className="fw-paths">
            <a className="fw-path" href="#start">
              <small>01</small>
              <strong>{paths.start.title}</strong>
              <span>{paths.start.text}</span>
            </a>
            <a
              className="fw-path"
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
            <Link className="fw-path" href={contactHref('enterprise')}>
              <small>03</small>
              <strong>{paths.team.title}</strong>
              <span>{paths.team.text}</span>
            </Link>
          </div>
        </Closing>
      </Footer>
    </div>
  );
}
