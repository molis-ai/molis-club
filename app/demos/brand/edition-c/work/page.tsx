'use client';
import { ArrowUpRight, Download } from 'lucide-react';
import {
  Footer,
  Header,
  TypedWordmark,
  useEditionMotion,
  type Vars,
} from '../shared';
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
import { AgentsVisual, Window, featureVisuals } from './visuals';
import '../edition-c.css';
import './work.css';

// 在逗号后断行，避免中文标题在词中间折开
function Phrases({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=，)/).map((phrase) => (
        <span className="ec-phrase" key={phrase}>
          {phrase}
        </span>
      ))}
    </>
  );
}

function Badge({ tag }: { tag: Tag }) {
  return (
    <span className="ew-tag" data-tag={tag}>
      {tag}
    </span>
  );
}

function NextBadge({ show }: { show: boolean }) {
  if (!SHOW_NEXT_RELEASE || !show) return null;
  return (
    <span className="ew-tag" data-tag="下一版">
      下一版
    </span>
  );
}

function Actions({ glass = false }: { glass?: boolean }) {
  return (
    <div className="ew-actions">
      {MACOS_DOWNLOAD_URL ? (
        <a
          className={`ec-button ${glass ? 'ec-button-light' : ''}`}
          href={MACOS_DOWNLOAD_URL}
        >
          <Download size={14} aria-hidden="true" />
          下载 macOS 版
        </a>
      ) : null}
      <a
        className={`ec-button ${glass ? (MACOS_DOWNLOAD_URL ? 'ec-button-glass' : 'ec-button-light') : ''}`}
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
      >
        在 GitHub 查看
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </div>
  );
}

function Architecture() {
  return (
    <figure className="ew-arch ec-reveal">
      <ul className="ew-arch-entries">
        {architecture.entries.map((entry, index) => (
          <li key={entry.name} style={{ '--r': index } as Vars}>
            <span>
              {entry.name}
              {entry.detail ? <small>{entry.detail}</small> : null}
            </span>
            {entry.tag ? <Badge tag={entry.tag} /> : null}
          </li>
        ))}
      </ul>
      <div className="ew-arch-wires" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <i key={index} style={{ '--r': index } as Vars} />
        ))}
      </div>
      <div className="ew-arch-catalog">{architecture.catalog}</div>
      <div className="ew-arch-wires ew-arch-wires-two" aria-hidden="true">
        {[0, 1].map((index) => (
          <i key={index} style={{ '--r': index + 4 } as Vars} />
        ))}
      </div>
      <div className="ew-arch-base">
        <span>{architecture.plugins}</span>
        <span>{architecture.runtime}</span>
      </div>
      <div className="ew-arch-home">{architecture.home}</div>
      <figcaption>结构示意</figcaption>
    </figure>
  );
}

export default function EditionCWorkPage() {
  const siteRef = useEditionMotion();

  return (
    <div className="ec-site ew-site" ref={siteRef}>
      <Header
        items={[
          { label: '功能', href: '#features' },
          { label: '插件', href: '#plugins' },
        ]}
        action={{ label: 'GitHub', href: GITHUB_URL, external: true }}
      />

      <main id="main">
        <section className="ec-hero ew-hero" aria-labelledby="ew-title">
          <img
            className="ec-hero-photo"
            src="/images/atelier/studio-desk.jpg"
            width="1440"
            height="960"
            alt=""
            fetchPriority="high"
          />
          <div className="ec-hero-copy ew-hero-copy">
            <span className="ew-hero-eyebrow">{hero.eyebrow}</span>
            <h1 id="ew-title">
              {hero.title.map((line, index) => (
                <span
                  className="ew-hero-line"
                  key={line}
                  style={{ '--r': index } as Vars}
                >
                  {line}
                </span>
              ))}
            </h1>
            <p>{hero.lead}</p>
            <Actions glass />
            <small className="ew-hero-note">{hero.note}</small>
          </div>
          <TypedWordmark text="Molis Work" />
        </section>

        <section
          className="ew-screen"
          data-scroll="enter"
          aria-label="Molis Work 界面"
        >
          <figure>
            <Window src="/images/daylight/work/home.jpg" label="Molis Work" />
            <figcaption>产品截图 · 演示数据</figcaption>
          </figure>
        </section>

        <section className="ew-pillars" aria-label="三个支柱">
          {pillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className="ew-pillar ec-reveal"
              style={{ '--r': index } as Vars}
            >
              <div className="ew-feature-meta">
                <span className="ew-index">0{index + 1}</span>
                <NextBadge show={pillar.next} />
              </div>
              <h2>{pillar.title}</h2>
              <p>{pillar.body}</p>
            </article>
          ))}
        </section>

        <section
          className="ec-statement ew-architecture"
          aria-labelledby="ew-arch-title"
        >
          <div className="ew-intro ec-reveal">
            <h2 id="ew-arch-title">
              <Phrases text={architecture.title} />
            </h2>
            <p>{architecture.body}</p>
            <NextBadge show />
          </div>
          <Architecture />
        </section>

        <section id="features" className="ew-features" aria-label="主要功能">
          {features.map((feature, index) => {
            const Visual = featureVisuals[feature.visual];
            return (
              <article
                key={feature.visual}
                className="ew-feature"
                aria-labelledby={`ew-feature-${feature.visual}`}
              >
                <figure className="ew-feature-visual ec-reveal">
                  <Visual />
                  <figcaption>
                    {feature.visual === 'goals'
                      ? '产品截图 · 演示数据'
                      : '界面示意'}
                  </figcaption>
                </figure>
                <div className="ew-feature-copy ec-reveal">
                  <div className="ew-feature-meta">
                    <span className="ew-index">0{index + 1}</span>
                    <span>{feature.label}</span>
                    {feature.tag ? <Badge tag={feature.tag} /> : null}
                    <NextBadge show={feature.next} />
                  </div>
                  <h3 id={`ew-feature-${feature.visual}`}>
                    <Phrases text={feature.title} />
                  </h3>
                  <ul>
                    {feature.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </section>

        <section className="ew-cards" aria-label="更多能力">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className="ew-more ec-reveal"
              style={{ '--r': index } as Vars}
            >
              <figure className="ew-more-visual">
                {card.image ? (
                  <Window src={card.image} label="Molis Work" />
                ) : (
                  <AgentsVisual />
                )}
                <figcaption>
                  {card.image ? '产品截图 · 演示数据' : '示意'}
                </figcaption>
              </figure>
              <div className="ew-more-copy">
                <NextBadge show={card.next} />
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            </article>
          ))}
        </section>

        <section
          id="plugins"
          className="ew-plugins"
          aria-labelledby="ew-plugins-title"
        >
          <div className="ew-plugins-intro ec-reveal">
            <span className="ec-eyebrow">插件</span>
            <h2 id="ew-plugins-title">
              <Phrases text={pluginWall.title} />
            </h2>
            <p>{pluginWall.lead}</p>
            {SHOW_NEXT_RELEASE ? (
              <p className="ew-legend">
                <span>
                  <i className="is-released" /> v0.2.0 已公开
                </span>
                <span>
                  <i /> 下一版
                </span>
              </p>
            ) : null}
          </div>
          <div className="ew-plugin-groups">
            {pluginGroups.map((group, index) => (
              <div
                key={group.name}
                className="ew-plugin-group ec-reveal"
                style={{ '--r': index } as Vars}
              >
                <h3>
                  {group.name}
                  <small>{group.plugins.length}</small>
                </h3>
                <ul>
                  {group.plugins.map((plugin) => (
                    <li key={plugin.name}>
                      <i
                        className={
                          plugin.released || !SHOW_NEXT_RELEASE
                            ? 'is-released'
                            : ''
                        }
                        aria-hidden="true"
                      />
                      <strong>
                        {plugin.name}
                        {plugin.tag ? <Badge tag={plugin.tag} /> : null}
                        {SHOW_NEXT_RELEASE && !plugin.released ? (
                          <span className="ec-sr-only">（下一版）</span>
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

        <section className="ew-local" aria-labelledby="ew-local-title">
          <figure className="ew-local-visual" data-scroll="pass">
            <img
              className="ew-local-photo"
              src="/images/atelier/reading-room.jpg"
              width="1440"
              height="960"
              alt=""
              loading="lazy"
            />
            <div className="ew-local-window">
              <Window
                src="/images/daylight/work/home.jpg"
                label="Molis Work Home"
              />
            </div>
            <figcaption>产品截图 · 场景示意</figcaption>
          </figure>
          <div className="ew-local-copy ec-reveal">
            <span className="ec-eyebrow">本地优先</span>
            <h2 id="ew-local-title">
              <Phrases text={localFirst.title} />
            </h2>
            <ol>
              {localFirst.points.map((point, index) => (
                <li key={point}>
                  <span className="ew-index">0{index + 1}</span>
                  {point}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ew-upcoming" aria-labelledby="ew-upcoming-title">
          <div className="ew-upcoming-head ec-reveal">
            <span className="ec-eyebrow">接下来</span>
            <h2 id="ew-upcoming-title">还在路上的几件事。</h2>
          </div>
          <ol className="ew-upcoming-list">
            {upcoming.map((item, index) => (
              <li
                key={item.name}
                className="ec-reveal"
                style={{ '--r': index } as Vars}
              >
                <Badge tag={item.tag} />
                <h3>{item.name}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer>
        <section
          className="ec-invite ew-closing ec-reveal"
          aria-labelledby="ew-closing-title"
        >
          <h2 id="ew-closing-title">
            {closing.title[0]}
            <br />
            {closing.title[1]}
          </h2>
          <Actions />
        </section>
      </Footer>
    </div>
  );
}
