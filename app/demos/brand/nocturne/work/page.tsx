import Link from 'next/link';
import { ArrowUpRight, Download } from 'lucide-react';
import '../nocturne.css';
import './work.css';
import {
  GITHUB_URL,
  MAC_DOWNLOAD_URL,
  NEXT_RELEASE_PENDING,
  RELEASED_PLUGINS,
  architecture,
  cards,
  closing,
  features,
  hero,
  localFirst,
  pillars,
  pluginWall,
  tagLabels,
  upcoming,
  type TagKind,
} from './content';
import {
  AgentImportVisual,
  CapabilityVisual,
  CodingVisual,
  RuntimeVisual,
  SearchVisual,
  StudioVisual,
} from './visuals';
import { NocturneWorkMotion } from './motion';

export const metadata = {
  title: { absolute: 'Molis Work · 让工作，在人、工具与 Agent 之间继续' },
  description: hero.subtitle,
};

function Tag({ kind }: { kind: TagKind }) {
  if (kind === 'next' && !NEXT_RELEASE_PENDING) return null;
  return (
    <span className="nw-tag" data-kind={kind}>
      {tagLabels[kind]}
    </span>
  );
}

// Keeps each clause of a Chinese title on one line, so titles break at commas.
function Phrases({ text }: { text: string }) {
  const parts = text.split(/(?<=[，；])/);
  return parts.map((part) => (
    <span className="nw-phrase" key={part}>
      {part}
    </span>
  ));
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

const chapterVisuals: Record<string, React.ReactNode> = {
  goals: (
    <div className="nw-vis nw-vis-shot">
      <Shot
        src="goals-zh.jpg"
        alt="Molis Work 的 Goals 页面：左侧是目标树，右侧是当前目标的完成要求与时间线"
      />
    </div>
  ),
  capabilities: <CapabilityVisual />,
  studio: <StudioVisual />,
  coding: <CodingVisual />,
  runtime: <RuntimeVisual />,
  search: <SearchVisual />,
};

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
          <a href="#features" className="nw-nav-anchor">
            功能
          </a>
          <a href="#plugins" className="nw-nav-anchor">
            插件
          </a>
          <a href="#local" className="nw-nav-anchor">
            本地优先
          </a>
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
              {hero.title.map((line, l) => (
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
              {hero.subtitle}
            </p>
            <div
              className="nw-rise"
              style={{ '--d': 4 } as React.CSSProperties}
            >
              <Actions />
              <small className="nw-hero-note">{hero.note}</small>
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

        {/* three pillars */}
        <section className="nw-pillars" aria-label="三个支柱">
          {pillars.map((pillar, i) => (
            <article
              className="nw-pillar"
              key={pillar.title}
              data-reveal
              style={{ '--i': i } as React.CSSProperties}
            >
              <span className="nw-pillar-index">0{i + 1}</span>
              <h2>
                <Phrases text={pillar.title} />
              </h2>
              <p>{pillar.text}</p>
              {pillar.next && <Tag kind="next" />}
            </article>
          ))}
        </section>

        {/* structure diagram */}
        <section className="nw-arch-section" aria-labelledby="nw-arch-title">
          <div className="nw-section-head" data-reveal>
            <h2 id="nw-arch-title">
              <Phrases text={architecture.title} />
            </h2>
            <p>{architecture.text}</p>
            <Tag kind="next" />
          </div>
          <figure className="nw-arch" data-reveal>
            <div className="nw-arch-entries">
              {architecture.entries.map((entry, i) => (
                <div
                  className="nw-arch-node"
                  key={entry.label}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <span>{entry.label}</span>
                  {entry.tag && <Tag kind={entry.tag} />}
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
              <span>{architecture.core}</span>
            </div>
            <span className="nw-arch-stem" aria-hidden="true" />
            <div className="nw-arch-lower">
              {architecture.lower.map((label) => (
                <div className="nw-arch-block" key={label}>
                  {label}
                </div>
              ))}
            </div>
            <div className="nw-arch-base">{architecture.base}</div>
            <figcaption className="nc-sr-only">
              上排四个入口：页面与搜索、个人助理、工作流程与定时、外部
              Agent，都连到中间的统一能力目录；能力目录下面是插件和 Prologue
              运行时，底座是本机的 Home。
            </figcaption>
          </figure>
        </section>

        {/* six feature chapters */}
        <section id="features" className="nw-features" aria-label="主要功能">
          <ol className="nw-rail" aria-hidden="true" data-active="0">
            {features.map((feature, i) => (
              <li key={feature.id}>
                <span>0{i + 1}</span>
                {feature.label}
              </li>
            ))}
          </ol>
          <div className="nw-chapters">
            {features.map((feature, i) => (
              <article
                className="nw-chapter"
                id={feature.id}
                key={feature.id}
                aria-labelledby={`nw-${feature.id}-title`}
              >
                <div className="nw-chapter-copy" data-reveal>
                  <span className="nw-chapter-label">
                    <b>0{i + 1}</b>
                    {feature.label}
                    {feature.tags.map((tag) => (
                      <Tag kind={tag} key={tag} />
                    ))}
                  </span>
                  <h3 id={`nw-${feature.id}-title`}>
                    <Phrases text={feature.title} />
                  </h3>
                  <ul>
                    {feature.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="nw-chapter-visual" data-reveal>
                  {chapterVisuals[feature.id]}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* three secondary cards */}
        <section className="nw-cards" aria-label="更多功能">
          {cards.map((card, i) => (
            <article
              className="nw-card"
              key={card.title}
              data-reveal
              style={{ '--i': i } as React.CSSProperties}
            >
              {i === 0 && (
                <div className="nw-card-art">
                  <Shot
                    src="feed-zh.jpg"
                    alt="Molis Work 的 Feed 页面：来源消息列表和一条消息的详情"
                  />
                </div>
              )}
              {i === 1 && (
                <div className="nw-card-art">
                  <Shot
                    src="onboarding-zh.jpg"
                    alt="Molis Work 首次使用：勾选想带入的内容来源"
                  />
                </div>
              )}
              {i === 2 && <AgentImportVisual />}
              <div className="nw-card-copy">
                <Tag kind="next" />
                <h3>
                  <Phrases text={card.title} />
                </h3>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </section>

        {/* plugin wall */}
        <section
          id="plugins"
          className="nw-plugins"
          aria-labelledby="nw-plugins-title"
        >
          <div className="nw-section-head" data-reveal>
            <h2 id="nw-plugins-title">
              <Phrases text={pluginWall.title} />
            </h2>
            <p>{pluginWall.subtitle}</p>
          </div>
          <div className="nw-wall">
            {pluginWall.groups.map((group) => (
              <div className="nw-group" key={group.name} data-reveal>
                <h3>{group.name}</h3>
                <ul>
                  {group.plugins.map(([name, text]) => (
                    <li
                      key={name}
                      data-live={RELEASED_PLUGINS.has(name) || undefined}
                    >
                      <strong>
                        {name}
                        {name === '插件创作台' && <Tag kind="preview" />}
                        {!RELEASED_PLUGINS.has(name) && <Tag kind="next" />}
                      </strong>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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

        {/* upcoming */}
        <section className="nw-next" aria-labelledby="nw-next-title">
          <h2 id="nw-next-title" data-reveal>
            接下来
          </h2>
          <ul>
            {upcoming.map((item) => (
              <li key={item.name} data-reveal>
                <strong>{item.name}</strong>
                <p>{item.text}</p>
                <Tag kind={item.tag} />
              </li>
            ))}
          </ul>
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
