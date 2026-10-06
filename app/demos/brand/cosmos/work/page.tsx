'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import Galaxy from '../galaxy';
import Planet from '../planet';
import {
  GITHUB_URL,
  MAC_DOWNLOAD_URL,
  SHOW_NEXT_RELEASE,
  agentLine,
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
} from '../../../../../content/molis-work';
import { CardArt, SceneArt, type SceneVisual } from './visuals';
import '../cosmos.css';
import './work.css';

// 首屏标题在深空版里的断行；两行拼起来就是 hero.title
const heroLines = ['让工作，在人、工具', '与 Agent 之间继续。'];

const cardImages: Record<string, string> = {
  feed: '/images/cosmos/work/feed-zh.jpg',
  start: '/images/cosmos/work/onboarding-zh.jpg',
};

// 标题按逗号、顿号拆成不断开的短语，窄屏换行时落在标点后面
function Phrases({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=[，、])/).map((phrase) => (
        <span key={phrase} className="cw-phrase">
          {phrase}
        </span>
      ))}
    </>
  );
}

function Tags({ status }: { status?: Status }) {
  return (
    <>
      {tagsOf(status).map((tag) => (
        <span key={tag} className={`cw-tag cw-tag-${tag}`}>
          {tag}
        </span>
      ))}
    </>
  );
}

function Points({ points }: { points: Point[] }) {
  return (
    <ul>
      {points.map((point) => (
        <li key={point.text}>
          {point.text}
          {tagsOf(point.status).length ? (
            <>
              {' '}
              <Tags status={point.status} />
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function Actions({ className = '' }: { className?: string }) {
  return (
    <div className={`cw-actions ${className}`}>
      {MAC_DOWNLOAD_URL ? (
        <a className="cw-button cw-button-primary" href={MAC_DOWNLOAD_URL}>
          <Download size={18} aria-hidden="true" />
          下载 macOS 版
        </a>
      ) : null}
      <a
        className={`cw-button ${MAC_DOWNLOAD_URL ? '' : 'cw-button-primary'}`}
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
      >
        在 GitHub 查看
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </div>
  );
}

// 元素进入视口时加上 is-in，只触发一次
function useReveal<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.classList.add('is-in');
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

// 把元素从进入视口底部到顶部对齐的进度写成 --p（0 到 1）
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const progress = 1 - rect.top / window.innerHeight;
      node.style.setProperty(
        '--p',
        Math.min(1, Math.max(0, progress)).toFixed(4),
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return ref;
}

function Architecture() {
  const ref = useReveal<HTMLDivElement>(0.3);
  const entryX = [125, 375, 625, 875];
  return (
    <div className="cw-arch" ref={ref}>
      <svg
        className="cw-arch-lines"
        viewBox="0 0 1000 560"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {entryX.map((x, i) => (
          <g key={x}>
            <path
              className="cw-arch-path"
              d={`M${x} 64 C${x} 150 500 130 500 212`}
            />
            <path
              className="cw-arch-pulse"
              d={`M${x} 64 C${x} 150 500 130 500 212`}
              style={{ '--i': i } as React.CSSProperties}
            />
          </g>
        ))}
        {[300, 700].map((x, i) => (
          <g key={x}>
            <path
              className="cw-arch-path"
              d={`M500 300 C500 350 ${x} 340 ${x} 392`}
            />
            <path
              className="cw-arch-pulse cw-arch-pulse-down"
              d={`M500 300 C500 350 ${x} 340 ${x} 392`}
              style={{ '--i': i + 4 } as React.CSSProperties}
            />
          </g>
        ))}
      </svg>

      <ul className="cw-arch-entries">
        {architecture.entries.map((entry) => (
          <li key={entry.name}>
            <span className="cw-arch-node">
              {entry.name}
              {entry.detail ? <small>{entry.detail}</small> : null}
            </span>
          </li>
        ))}
      </ul>

      <div className="cw-arch-catalog">
        <span className="cw-arch-star" aria-hidden="true" />
        <strong>{architecture.catalog}</strong>
      </div>

      <div className="cw-arch-base">
        <span className="cw-arch-node cw-arch-node-wide">
          {architecture.plugins}
        </span>
        <span className="cw-arch-node cw-arch-node-wide">
          {architecture.runtime}
        </span>
      </div>

      <div className="cw-arch-home">
        <span className="cw-arch-home-arc" aria-hidden="true" />
        <span className="cw-arch-home-text">{architecture.home}</span>
      </div>
    </div>
  );
}

function Scenarios() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="scenarios"
      className="cw-scenarios"
      aria-labelledby="cw-scenarios-title"
    >
      <div className="cw-intro cw-scenarios-intro">
        <span className="cs-eyebrow">{scenariosIntro.kicker}</span>
        <h2 id="cw-scenarios-title">
          <Phrases text={scenariosIntro.title} />
        </h2>
      </div>
      <div className="cw-features">
        <div className="cw-features-stage" aria-hidden="true">
          <div className="cw-features-sticky">
            <ol className="cw-features-rail">
              {scenarios.map((scenario, index) => (
                <li
                  key={scenario.id}
                  className={active === index ? 'is-active' : ''}
                >
                  <span>0{index + 1}</span>
                  {scenario.label}
                </li>
              ))}
            </ol>
            <div className="cw-features-view">
              {scenarios.map((scenario, index) => (
                <div
                  key={scenario.id}
                  className={`cw-features-layer${active === index ? ' is-active' : ''}`}
                >
                  <SceneArt kind={scenario.id as SceneVisual} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cw-features-list">
          {scenarios.map((scenario, index) => (
            <article
              key={scenario.id}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              data-index={index}
              className={`cw-feature${active === index ? ' is-active' : ''}`}
            >
              <div className="cw-feature-inline">
                <SceneArt kind={scenario.id as SceneVisual} />
              </div>
              <div className="cw-feature-meta">
                <span className="cw-feature-index">0{index + 1}</span>
                <span className="cw-feature-label">{scenario.label}</span>
                <Tags status={scenario.status} />
              </div>
              <h3>
                <Phrases text={scenario.title} />
              </h3>
              <p className="cw-problem">{scenario.problem}</p>
              <Points points={scenario.points} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CosmosWorkPage() {
  const screenRef = useScrollProgress<HTMLDivElement>();
  const pillarsRef = useReveal<HTMLDivElement>(0.2);
  const compareRef = useReveal<HTMLOListElement>(0.1);
  const localRef = useReveal<HTMLElement>(0.3);
  const footerRef = useReveal<HTMLElement>(0.25);

  return (
    <div className="cs-site cw-site">
      <header className="cs-header">
        <Link href="/demos/brand/cosmos" className="cs-logo">
          <img src="/images/molis-logo.png" width="40" height="40" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="cs-pill" aria-label="Molis Work 页面导航">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="cw-nav-link">
              {item.label}
            </a>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="cs-pill-cta"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main id="main">
        <div id="cw-deep" className="cs-deep">
          <Galaxy track="#cw-deep" />

          <section className="cs-hero cw-hero" aria-labelledby="cw-title">
            <div className="cs-hud" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="cs-hero-copy cw-hero-copy">
              <span className="cs-eyebrow cw-hero-eyebrow">{hero.kicker}</span>
              <h1 id="cw-title" aria-label={hero.title}>
                <span aria-hidden="true">{heroLines[0]}</span>
                <br />
                <span aria-hidden="true">{heroLines[1]}</span>
              </h1>
              <p className="cw-hero-lead">{hero.lead}</p>
              <Actions className="cw-hero-actions" />
              <p className="cw-hero-note">{agentLine}</p>
            </div>
          </section>

          <div className="cw-screen" ref={screenRef}>
            <figure className="cw-screen-frame">
              <span className="cw-scope-corners" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              <img
                src="/images/cosmos/work/home-dark-zh.jpg"
                width="1440"
                height="1000"
                alt="Molis Work 的项目首页：今天的工作、正在推进的目标和需要处理的事件"
              />
              <figcaption>界面截图 · 演示数据</figcaption>
            </figure>
          </div>
        </div>

        <Scenarios />

        <section
          id="why"
          className="cw-section cw-pillars"
          aria-labelledby="cw-why-title"
        >
          <div className="cw-intro cw-intro-center">
            <span className="cs-eyebrow">{differencesIntro.kicker}</span>
            <h2 id="cw-why-title">
              <Phrases text={differencesIntro.title} />
            </h2>
            <p>{differencesIntro.lead}</p>
          </div>
          <div className="cw-pillar-list" ref={pillarsRef}>
            <svg
              className="cw-pillar-line"
              viewBox="0 0 1200 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M150 20 L1050 20" />
            </svg>
            {differences.map((item, index) => (
              <article
                key={item.title}
                className="cw-pillar"
                style={{ '--i': index } as React.CSSProperties}
              >
                <span className="cw-pillar-star" aria-hidden="true" />
                <span className="cw-pillar-index">0{index + 1}</span>
                <h3>
                  <Phrases text={item.title} />
                </h3>
                <p>{item.body}</p>
                <span className="cw-pillar-tags">
                  <Tags status={item.status} />
                </span>
              </article>
            ))}
          </div>
        </section>

        <section
          className="cw-section cw-architecture"
          aria-labelledby="cw-arch-title"
        >
          <div className="cw-intro cw-intro-center">
            <h2 id="cw-arch-title">
              <Phrases text={architecture.title} />
            </h2>
            <p>{architecture.body}</p>
            <Tags status={architecture.status} />
          </div>
          <Architecture />
        </section>

        <section
          id="more"
          className="cw-section"
          aria-labelledby="cw-more-title"
        >
          <div className="cw-intro">
            <span className="cs-eyebrow">{moreIntro.kicker}</span>
            <h2 id="cw-more-title">
              <Phrases text={moreIntro.title} />
            </h2>
          </div>
          <div className="cw-cards">
            {moreScenarios.map((card) => (
              <article key={card.id} className="cw-card">
                <div className="cw-card-visual">
                  {cardImages[card.id] ? (
                    <img
                      src={cardImages[card.id]}
                      width="1440"
                      height="1000"
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <CardArt kind={card.id as SceneVisual} />
                  )}
                </div>
                <div className="cw-card-copy">
                  <div className="cw-feature-meta">
                    <span className="cw-feature-label">{card.label}</span>
                    <Tags status={card.status} />
                  </div>
                  <h3>
                    <Phrases text={card.title} />
                  </h3>
                  <p className="cw-problem">{card.problem}</p>
                  <Points points={card.points} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="features"
          className="cw-section cw-plugins"
          aria-labelledby="cw-features-title"
        >
          <div className="cw-intro">
            <span className="cs-eyebrow">{featuresIntro.kicker}</span>
            <h2 id="cw-features-title">
              <Phrases text={featuresIntro.title} />
            </h2>
            <p>{featuresIntro.lead}</p>
            {SHOW_NEXT_RELEASE ? (
              <p className="cw-legend">
                <span>
                  <i className="cw-star is-released" /> v0.2.0 已公开
                </span>
                <span>
                  <i className="cw-star" /> 下一版
                </span>
              </p>
            ) : null}
          </div>
          <div className="cw-catalog">
            {featureGroups.map((group) => (
              <div key={group.name} className="cw-catalog-group">
                <h3>
                  {group.name}
                  <small>{group.features.length}</small>
                </h3>
                <ul>
                  {group.features.map((feature) => {
                    const lit =
                      feature.status === 'released' || !SHOW_NEXT_RELEASE;
                    return (
                      <li
                        key={feature.name}
                        className={lit ? 'is-released' : ''}
                      >
                        <i className="cw-star" aria-hidden="true" />
                        <strong>
                          {feature.name}
                          <Tags status={feature.status} />
                        </strong>
                        <span>{feature.line}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section
          id="compare"
          className="cw-section cw-compare"
          aria-labelledby="cw-compare-title"
        >
          <div className="cw-intro">
            <span className="cs-eyebrow">{compareIntro.kicker}</span>
            <h2 id="cw-compare-title">
              <Phrases text={compareIntro.title} />
            </h2>
            <p>{compareIntro.lead}</p>
          </div>
          <div className="cw-compare-head" aria-hidden="true">
            <span>{compareIntro.labels.now}</span>
            <span>{compareIntro.labels.here}</span>
            <span>{compareIntro.labels.gap}</span>
          </div>
          <ol className="cw-compare-list" ref={compareRef}>
            {comparisons.map((row, index) => (
              <li key={row.now} style={{ '--i': index } as React.CSSProperties}>
                <dl>
                  <div className="cw-compare-now">
                    <dt>{compareIntro.labels.now}</dt>
                    <dd>{row.now}</dd>
                  </div>
                  <div className="cw-compare-here">
                    <dt>{compareIntro.labels.here}</dt>
                    <dd>{row.here}</dd>
                  </div>
                  <div className="cw-compare-gap">
                    <dt>{compareIntro.labels.gap}</dt>
                    <dd>{row.gap}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="local"
          className="cw-section cw-local"
          ref={localRef}
          aria-labelledby="cw-local-title"
        >
          <div className="cw-local-orbit" aria-hidden="true">
            <span className="cw-local-ring" />
            <span className="cw-local-ring cw-local-ring-outer" />
            <Planet kind="life" className="cw-local-planet" />
            <span className="cw-local-probe" />
          </div>
          <div className="cw-local-copy">
            <span className="cs-eyebrow">{localFirst.kicker}</span>
            <h2 id="cw-local-title">
              <Phrases text={localFirst.title} />
            </h2>
            <ol>
              {localFirst.points.map((point, index) => (
                <li
                  key={point}
                  style={{ '--i': index } as React.CSSProperties}
                >
                  {point}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="cs-footer cw-footer" ref={footerRef}>
        <div className="cs-horizon" aria-hidden="true">
          <span className="cs-horizon-dawn" />
          <Planet kind="horizon" className="cs-horizon-planet" />
        </div>
        <div className="cs-footer-invite cw-footer-invite">
          <h2>
            {closing.title.map((line) => (
              <span key={line} className="cw-phrase">
                {line}
              </span>
            ))}
          </h2>
          <Actions className="cw-footer-actions" />
        </div>
        <div className="cs-footer-meta">
          <Link href="/demos/brand/cosmos">Molis AI</Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
