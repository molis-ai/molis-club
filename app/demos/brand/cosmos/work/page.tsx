'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import Galaxy from '../galaxy';
import Planet from '../planet';
import {
  GITHUB_URL,
  MACOS_DOWNLOAD_URL,
  SHOW_NEXT_RELEASE,
  architecture,
  cards,
  closing,
  features,
  hero,
  localFirst,
  pillars,
  pluginGroups,
  pluginWall,
  upcoming,
  type Tag,
} from './content';
import { AgentsArt, FeatureArt } from './visuals';
import '../cosmos.css';
import './work.css';

function Badge({ tag }: { tag: Tag }) {
  return <span className={`cw-tag cw-tag-${tag}`}>{tag}</span>;
}

function NextBadge({ show }: { show: boolean }) {
  if (!SHOW_NEXT_RELEASE || !show) return null;
  return <span className="cw-tag cw-tag-next">下一版</span>;
}

function Actions({ className = '' }: { className?: string }) {
  return (
    <div className={`cw-actions ${className}`}>
      {MACOS_DOWNLOAD_URL ? (
        <a className="cw-button cw-button-primary" href={MACOS_DOWNLOAD_URL}>
          <Download size={18} aria-hidden="true" />
          下载 macOS 版
        </a>
      ) : null}
      <a
        className={`cw-button ${MACOS_DOWNLOAD_URL ? '' : 'cw-button-primary'}`}
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
            <path className="cw-arch-path" d={`M${x} 64 C${x} 150 500 130 500 212`} />
            <path
              className="cw-arch-pulse"
              d={`M${x} 64 C${x} 150 500 130 500 212`}
              style={{ '--i': i } as React.CSSProperties}
            />
          </g>
        ))}
        {[300, 700].map((x, i) => (
          <g key={x}>
            <path className="cw-arch-path" d={`M500 300 C500 350 ${x} 340 ${x} 392`} />
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
            {entry.tag ? <Badge tag={entry.tag} /> : null}
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

function Features() {
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
      id="features"
      className="cw-features"
      aria-label="Molis Work 的六个主要功能"
    >
      <div className="cw-features-stage" aria-hidden="true">
        <div className="cw-features-sticky">
          <ol className="cw-features-rail">
            {features.map((feature, index) => (
              <li
                key={feature.label}
                className={active === index ? 'is-active' : ''}
              >
                <span>0{index + 1}</span>
                {feature.label}
              </li>
            ))}
          </ol>
          <div className="cw-features-view">
            {features.map((feature, index) => (
              <div
                key={feature.visual}
                className={`cw-features-layer${active === index ? ' is-active' : ''}`}
              >
                <FeatureArt kind={feature.visual} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cw-features-list">
        {features.map((feature, index) => (
          <article
            key={feature.label}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            data-index={index}
            className={`cw-feature${active === index ? ' is-active' : ''}`}
          >
            <div className="cw-feature-inline">
              <FeatureArt kind={feature.visual} />
            </div>
            <div className="cw-feature-meta">
              <span className="cw-feature-index">0{index + 1}</span>
              <span className="cw-feature-label">{feature.label}</span>
              {feature.tag ? <Badge tag={feature.tag} /> : null}
              <NextBadge show={feature.next} />
            </div>
            <h3>{feature.title}</h3>
            <ul>
              {feature.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function CosmosWorkPage() {
  const screenRef = useScrollProgress<HTMLDivElement>();
  const pillarsRef = useReveal<HTMLDivElement>(0.3);
  const localRef = useReveal<HTMLElement>(0.3);
  const upcomingRef = useReveal<HTMLOListElement>(0.25);
  const footerRef = useReveal<HTMLElement>(0.25);

  return (
    <div className="cs-site cw-site">
      <header className="cs-header">
        <Link href="/demos/brand/cosmos" className="cs-logo">
          <img src="/images/molis-logo.png" width="40" height="40" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="cs-pill" aria-label="Molis Work 页面导航">
          <a href="#features">功能</a>
          <a href="#plugins">插件</a>
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
              <span className="cs-eyebrow cw-hero-eyebrow">{hero.eyebrow}</span>
              <h1 id="cw-title">
                <span>{hero.title[0]}</span>
                <br />
                <span>{hero.title[1]}</span>
              </h1>
              <p className="cw-hero-lead">{hero.lead}</p>
              <Actions className="cw-hero-actions" />
              <p className="cw-hero-note">{hero.note}</p>
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

        <section className="cw-pillars" aria-label="三个支柱">
          <div className="cw-pillar-list" ref={pillarsRef}>
            <svg
              className="cw-pillar-line"
              viewBox="0 0 1200 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M200 20 L600 20 L1000 20" />
            </svg>
            {pillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className="cw-pillar"
                style={{ '--i': index } as React.CSSProperties}
              >
                <span className="cw-pillar-star" aria-hidden="true" />
                <h2>{pillar.title}</h2>
                <p>{pillar.body}</p>
                <NextBadge show={pillar.next} />
              </article>
            ))}
          </div>
        </section>

        <section
          className="cw-section cw-architecture"
          aria-labelledby="cw-arch-title"
        >
          <div className="cw-intro cw-intro-center">
            <h2 id="cw-arch-title">{architecture.title}</h2>
            <p>{architecture.body}</p>
            <NextBadge show />
          </div>
          <Architecture />
        </section>

        <Features />

        <section className="cw-section cw-cards" aria-label="更多能力">
          {cards.map((card) => (
            <article key={card.title} className="cw-card">
              <div className="cw-card-visual">
                {card.image ? (
                  <img
                    src={card.image}
                    width="1440"
                    height="1000"
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <AgentsArt />
                )}
              </div>
              <div className="cw-card-copy">
                <NextBadge show={card.next} />
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            </article>
          ))}
        </section>

        <section
          id="plugins"
          className="cw-section cw-plugins"
          aria-labelledby="cw-plugins-title"
        >
          <div className="cw-intro">
            <span className="cs-eyebrow">插件</span>
            <h2 id="cw-plugins-title">{pluginWall.title}</h2>
            <p>{pluginWall.lead}</p>
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
          <div className="cw-plugin-map">
            {pluginGroups.map((group) => (
              <div key={group.name} className="cw-plugin-group">
                <h3>
                  {group.name}
                  <small>{group.plugins.length}</small>
                </h3>
                <ul>
                  {group.plugins.map((plugin) => (
                    <li
                      key={plugin.name}
                      className={
                        plugin.released || !SHOW_NEXT_RELEASE
                          ? 'is-released'
                          : ''
                      }
                    >
                      <i className="cw-star" aria-hidden="true" />
                      <strong>
                        {plugin.name}
                        {plugin.tag ? <Badge tag={plugin.tag} /> : null}
                        {SHOW_NEXT_RELEASE && !plugin.released ? (
                          <span className="cs-sr-only">（下一版）</span>
                        ) : null}
                      </strong>
                      <span>{plugin.line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section
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
            <span className="cs-eyebrow">本地优先</span>
            <h2 id="cw-local-title">{localFirst.title}</h2>
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

        <section
          className="cw-section cw-upcoming"
          aria-labelledby="cw-upcoming-title"
        >
          <div className="cw-intro">
            <span className="cs-eyebrow">接下来</span>
            <h2 id="cw-upcoming-title">还在路上的几件事。</h2>
          </div>
          <ol className="cw-trajectory" ref={upcomingRef}>
            {upcoming.map((item, index) => (
              <li key={item.name} style={{ '--i': index } as React.CSSProperties}>
                <span className="cw-trajectory-body" aria-hidden="true" />
                <Badge tag={item.tag} />
                <h3>{item.name}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="cs-footer cw-footer" ref={footerRef}>
        <div className="cs-horizon" aria-hidden="true">
          <span className="cs-horizon-dawn" />
          <Planet kind="horizon" className="cs-horizon-planet" />
        </div>
        <div className="cs-footer-invite cw-footer-invite">
          <h2>
            {closing.title[0]}
            <br />
            {closing.title[1]}
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
