import Link from 'next/link';
import { ArrowUpRight, Download } from 'lucide-react';
import '../nocturne.css';
import './work.css';
import {
  GITHUB_URL,
  MAC_DOWNLOAD_URL,
  SHOW_NEXT_RELEASE,
  architecture,
  closing,
  compareIntro,
  comparisons,
  differences,
  differencesIntro,
  featureGroups,
  featuresIntro,
  hero,
  localFirst,
  moreIntro,
  moreScenarios,
  nav,
  scenarios,
  scenariosIntro,
  tagsOf,
  type Point,
  type Status,
  type Tag,
} from '../../../../../content/molis-work';
import {
  AssistantVisual,
  CapabilityVisual,
  CodingVisual,
  StudioVisual,
} from './visuals';
import { NocturneWorkMotion } from './motion';

export const metadata = {
  title: { absolute: 'Molis Work · 让工作，在人、工具与 Agent 之间继续' },
  description: hero.lead,
};

const tagKinds: Record<Tag, string> = {
  下一版: 'next',
  预览: 'preview',
  规划中: 'planned',
};

function Tags({ status }: { status?: Status }) {
  const tags = tagsOf(status);
  if (tags.length === 0) return null;
  return tags.map((tag) => (
    <span className="nw-tag" data-kind={tagKinds[tag]} key={tag}>
      {tag}
    </span>
  ));
}

// Keeps each clause of a Chinese title on one line, so titles break at
// commas and list marks rather than inside a word.
function Phrases({ text }: { text: string }) {
  return text.split(/(?<=[，；、])/).map((part, i) => (
    <span className="nw-phrase" key={i}>
      {part}
    </span>
  ));
}

function Points({ points }: { points: Point[] }) {
  return (
    <ul className="nw-points">
      {points.map((point) => (
        <li key={point.text}>
          {point.text}
          <Tags status={point.status} />
        </li>
      ))}
    </ul>
  );
}

function SectionHead({
  id,
  kicker,
  title,
  lead,
  children,
}: {
  id: string;
  kicker?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="nw-section-head" data-reveal>
      {kicker && <span className="nc-kicker">{kicker}</span>}
      <h2 id={id}>
        <Phrases text={title} />
      </h2>
      {lead && <p>{lead}</p>}
      {children}
    </div>
  );
}

function Actions() {
  return (
    <div className="nw-actions">
      {MAC_DOWNLOAD_URL && (
        <a className="nw-btn nw-btn-primary" href={MAC_DOWNLOAD_URL}>
          <Download size={17} /> 下载 macOS 版
        </a>
      )}
      <a
        className={`nw-btn ${MAC_DOWNLOAD_URL ? 'nw-btn-ghost' : 'nw-btn-primary'}`}
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
      >
        在 GitHub 查看 <ArrowUpRight size={17} />
      </a>
    </div>
  );
}

function Shot({
  src,
  alt,
  eager,
}: {
  src: string;
  alt: string;
  eager?: boolean;
}) {
  return (
    <img
      src={`/images/nocturne-work/${src}`}
      width="1440"
      height="1000"
      alt={alt}
      loading={eager ? undefined : 'lazy'}
      decoding="async"
    />
  );
}

// The h1 breaks after the first comma; the two lines join back to hero.title.
const titleBreak = hero.title.indexOf('，') + 1;
const heroLines = [
  hero.title.slice(0, titleBreak),
  hero.title.slice(titleBreak),
];

const scenarioVisuals: Record<string, React.ReactNode> = {
  relay: (
    <div className="nw-vis nw-vis-shot">
      <Shot
        src="goals-zh.jpg"
        alt="Molis Work 的 Goals 页面：左侧是目标树，右侧是当前目标的完成要求与时间线"
      />
    </div>
  ),
  control: <CapabilityVisual />,
  assistant: <AssistantVisual />,
};

const moreArt: Record<string, React.ReactNode> = {
  feed: (
    <div className="nw-card-art">
      <Shot
        src="feed-zh.jpg"
        alt="Molis Work 的 Feed 页面：来源消息列表和一条消息的详情"
      />
    </div>
  ),
  start: (
    <div className="nw-card-art">
      <Shot
        src="onboarding-zh.jpg"
        alt="Molis Work 首次使用：勾选想带入的内容来源"
      />
    </div>
  ),
  studio: (
    <div className="nw-card-art nw-card-art-vis">
      <StudioVisual />
    </div>
  ),
  coding: (
    <div className="nw-card-art nw-card-art-vis">
      <CodingVisual />
    </div>
  ),
};

// Five columns on wide screens: the four large groups each get one, and the
// three small ones (编码, 自己做, 协作) share the last.
const wallColumns = [
  ...featureGroups.slice(0, 4).map((group) => [group]),
  featureGroups.slice(4),
];

const archCaption = `上排四个入口：${architecture.entries
  .map((entry) =>
    entry.detail ? `${entry.name}（${entry.detail}）` : entry.name,
  )
  .join(
    '、',
  )}，都连到中间的${architecture.catalog}；下面是${architecture.plugins}，和${architecture.runtime}；底座是${architecture.home}。`;

export default function NocturneWorkPage() {
  return (
    <div className="nc-site nw-page">
      <NocturneWorkMotion />
      <div className="nc-grain" aria-hidden="true" />
      <header className="nc-header">
        <Link href="/demos/brand/nocturne" className="nc-logo">
          <img src="/images/molis-logo.png" width="36" height="36" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="nc-nav" aria-label="Molis Work 页面导航">
          {nav.map((item) => (
            <a href={item.href} className="nw-nav-anchor" key={item.href}>
              {item.label}
            </a>
          ))}
          <a
            href={GITHUB_URL}
            className="nc-nav-cta"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main id="main">
        {/* hero: the product appears like a lit screen in a dark room */}
        <section className="nw-hero" aria-labelledby="nw-title">
          <div className="nw-beam" aria-hidden="true" />
          <div className="nw-hero-copy">
            <span className="nc-kicker nw-rise">{hero.kicker}</span>
            <h1 id="nw-title">
              {heroLines.map((line, l) => (
                <span
                  className="nw-rise"
                  key={line}
                  style={{ '--d': l + 1 } as React.CSSProperties}
                >
                  {line}
                </span>
              ))}
            </h1>
            <p className="nw-rise" style={{ '--d': 3 } as React.CSSProperties}>
              {hero.lead}
            </p>
            <div
              className="nw-rise"
              style={{ '--d': 4 } as React.CSSProperties}
            >
              <Actions />
              <div className="nw-hero-agents">
                <small>{hero.agentsLabel}</small>
                <ul>
                  {hero.agents.map((agent) => (
                    <li key={agent}>{agent}</li>
                  ))}
                </ul>
                <small>{hero.agentsMore}</small>
              </div>
            </div>
          </div>
          <div className="nw-screen-wrap" data-scene="enter">
            <div className="nw-screen">
              <Shot
                src="home-dark-zh.jpg"
                alt="Molis Work 深色模式的项目首页：今天的工作、正在推进的目标和当天事件"
                eager
              />
            </div>
            <div className="nw-phone">
              <img
                src="/images/nocturne-work/phone-zh.jpg"
                width="390"
                height="844"
                alt="Molis Work 在手机宽度下的项目首页"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="nw-screen-floor" aria-hidden="true" />
          </div>
        </section>

        {/* three scenes, each a chapter with the side rail */}
        <section
          id="scenarios"
          className="nw-scenarios"
          aria-labelledby="nw-scenarios-title"
        >
          <SectionHead
            id="nw-scenarios-title"
            kicker={scenariosIntro.kicker}
            title={scenariosIntro.title}
          />
          <div className="nw-features">
            <ol className="nw-rail" aria-hidden="true" data-active="0">
              {scenarios.map((scenario, i) => (
                <li key={scenario.id}>
                  <span>0{i + 1}</span>
                  {scenario.label}
                </li>
              ))}
            </ol>
            <div className="nw-chapters">
              {scenarios.map((scenario, i) => (
                <article
                  className="nw-chapter"
                  id={scenario.id}
                  key={scenario.id}
                  aria-labelledby={`nw-${scenario.id}-title`}
                >
                  <div className="nw-chapter-copy" data-reveal>
                    <span className="nw-chapter-label">
                      <b>0{i + 1}</b>
                      {scenario.label}
                      <Tags status={scenario.status} />
                    </span>
                    <h3 id={`nw-${scenario.id}-title`}>
                      <Phrases text={scenario.title} />
                    </h3>
                    <p className="nw-problem">{scenario.problem}</p>
                    <Points points={scenario.points} />
                  </div>
                  <div className="nw-chapter-visual" data-reveal>
                    {scenarioVisuals[scenario.id]}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* four differences */}
        <section id="why" className="nw-why" aria-labelledby="nw-why-title">
          <SectionHead
            id="nw-why-title"
            kicker={differencesIntro.kicker}
            title={differencesIntro.title}
            lead={differencesIntro.lead}
          />
          <div className="nw-pillars">
            {differences.map((item, i) => (
              <article
                className="nw-pillar"
                key={item.title}
                data-reveal
                style={{ '--i': i } as React.CSSProperties}
              >
                <span className="nw-pillar-index" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3>
                  <Phrases text={item.title} />
                </h3>
                <p>{item.body}</p>
                <div className="nw-tags">
                  <Tags status={item.status} />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* structure diagram */}
        <section className="nw-arch-section" aria-labelledby="nw-arch-title">
          <SectionHead id="nw-arch-title" title={architecture.title}>
            <p className="nw-arch-body">{architecture.body}</p>
            <div className="nw-tags">
              <Tags status={architecture.status} />
            </div>
          </SectionHead>
          <figure className="nw-arch" data-reveal>
            <div className="nw-arch-entries">
              {architecture.entries.map((entry, i) => (
                <div
                  className="nw-arch-node"
                  key={entry.name}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <span>{entry.name}</span>
                  {entry.detail && <small>{entry.detail}</small>}
                </div>
              ))}
            </div>
            <svg
              className="nw-arch-wires"
              viewBox="0 0 1000 120"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {[125, 375, 625, 875].map((x, i) => {
                const d = `M${x} 0 C ${x} 70, 500 50, 500 120`;
                return (
                  <g key={x}>
                    <path d={d} className="nw-wire" />
                    <path
                      d={d}
                      className="nw-wire-flow"
                      style={{ '--i': i } as React.CSSProperties}
                    />
                  </g>
                );
              })}
            </svg>
            <span className="nw-arch-stem" aria-hidden="true" />
            <div className="nw-arch-core">
              <span>{architecture.catalog}</span>
            </div>
            <span className="nw-arch-stem" aria-hidden="true" />
            <div className="nw-arch-lower">
              <div className="nw-arch-block">{architecture.plugins}</div>
              <div className="nw-arch-block">{architecture.runtime}</div>
            </div>
            <div className="nw-arch-base">{architecture.home}</div>
            <figcaption className="nc-sr-only">{archCaption}</figcaption>
          </figure>
        </section>

        {/* four more scenes as cards */}
        <section id="more" className="nw-more" aria-labelledby="nw-more-title">
          <SectionHead
            id="nw-more-title"
            kicker={moreIntro.kicker}
            title={moreIntro.title}
          />
          <div className="nw-cards">
            {moreScenarios.map((scenario, i) => (
              <article
                className="nw-card"
                key={scenario.id}
                id={scenario.id}
                data-reveal
                style={{ '--i': i % 2 } as React.CSSProperties}
              >
                {moreArt[scenario.id]}
                <div className="nw-card-copy">
                  <span className="nw-chapter-label">
                    {scenario.label}
                    <Tags status={scenario.status} />
                  </span>
                  <h3>
                    <Phrases text={scenario.title} />
                  </h3>
                  <p className="nw-problem">{scenario.problem}</p>
                  <Points points={scenario.points} />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* feature wall */}
        <section
          id="features"
          className="nw-plugins"
          aria-labelledby="nw-features-title"
        >
          <SectionHead
            id="nw-features-title"
            kicker={featuresIntro.kicker}
            title={featuresIntro.title}
            lead={featuresIntro.lead}
          />
          <div className="nw-wall">
            {wallColumns.map((column) => (
              <div className="nw-wall-col" key={column[0].name}>
                {column.map((group) => (
                  <div className="nw-group" key={group.name} data-reveal>
                    <h3>{group.name}</h3>
                    <ul>
                      {group.features.map((feature) => (
                        <li
                          key={feature.name}
                          data-live={
                            (SHOW_NEXT_RELEASE &&
                              feature.status === 'released') ||
                            undefined
                          }
                        >
                          <div className="nw-feature-name">
                            <strong>{feature.name}</strong>
                            <Tags status={feature.status} />
                          </div>
                          <span>{feature.line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* comparison, set like closing credits */}
        <section
          id="compare"
          className="nw-compare"
          aria-labelledby="nw-compare-title"
        >
          <SectionHead
            id="nw-compare-title"
            kicker={compareIntro.kicker}
            title={compareIntro.title}
            lead={compareIntro.lead}
          />
          <ol className="nw-roll">
            {comparisons.map((row) => (
              <li key={row.now} data-reveal>
                <dl className="nw-credit">
                  <div className="nw-credit-now">
                    <dt>{compareIntro.labels.now}</dt>
                    <dd>{row.now}</dd>
                  </div>
                  <div className="nw-credit-here">
                    <dt>{compareIntro.labels.here}</dt>
                    <dd>{row.here}</dd>
                  </div>
                  <div className="nw-credit-gap">
                    <dt>{compareIntro.labels.gap}</dt>
                    <dd>{row.gap}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </section>

        {/* local first */}
        <section
          id="local"
          className="nw-local"
          aria-labelledby="nw-local-title"
        >
          <div className="nw-home" aria-hidden="true">
            {[0, 1, 2, 3].map((ring) => (
              <i key={ring} style={{ '--r': ring } as React.CSSProperties} />
            ))}
            <b>Home</b>
          </div>
          <div className="nw-local-copy" data-reveal>
            <span className="nc-kicker">{localFirst.kicker}</span>
            <h2 id="nw-local-title">
              <Phrases text={localFirst.title} />
            </h2>
            <ol>
              {localFirst.points.map((point, i) => (
                <li key={point}>
                  <span>0{i + 1}</span>
                  {point}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="nc-footer nw-footer" data-scene="view">
        <div className="nc-horizon" aria-hidden="true" />
        <div className="nc-footer-invite" data-reveal>
          <h2>
            {closing.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <Actions />
        </div>
        <div className="nc-footer-meta">
          <Link href="/demos/brand/nocturne">Molis AI</Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
