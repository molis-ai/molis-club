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
  MAC_DOWNLOAD_URL,
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
  type Scenario,
  type Status,
} from '../../../../../content/molis-work';
import { images } from './content';
import { Window, sceneVisuals } from './visuals';
import '../edition-c.css';
import './work.css';

// 文案全部来自 content/molis-work.ts，五个方向共用；这里只换成 Edition C 的视觉。

// 首屏标题在「与 Agent」前断成两行，拼起来仍是 hero.title
const heroBreak = hero.title.indexOf('与');
const heroLines =
  heroBreak > 0
    ? [hero.title.slice(0, heroBreak), hero.title.slice(heroBreak)]
    : [hero.title];

// 功能全景：项目多的组排成四栏，只有一两项的小组共用最后一行
const wideGroups = featureGroups.filter((group) => group.features.length >= 4);
const bandGroups = featureGroups.filter((group) => group.features.length < 4);

// 在逗号、顿号后断行，避免中文标题在词中间折开
function Phrases({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=[，、])/).map((phrase) => (
        <span className="ec-phrase" key={phrase}>
          {phrase}
        </span>
      ))}
    </>
  );
}

const pad = (index: number) => String(index + 1).padStart(2, '0');

function Tags({ status }: { status?: Status }) {
  const tags = tagsOf(status);
  if (tags.length === 0) return null;
  return (
    <span className="ew-tags">
      {tags.map((tag) => (
        <span className="ew-tag" data-tag={tag} key={tag}>
          {tag}
        </span>
      ))}
    </span>
  );
}

function Points({ points }: { points: Point[] }) {
  return (
    <ul className="ew-points">
      {points.map((point) => (
        <li key={point.text}>
          {point.text}
          <Tags status={point.status} />
        </li>
      ))}
    </ul>
  );
}

function Actions({ glass = false }: { glass?: boolean }) {
  return (
    <div className="ew-actions">
      {MAC_DOWNLOAD_URL ? (
        <a
          className={`ec-button ${glass ? 'ec-button-light' : ''}`}
          href={MAC_DOWNLOAD_URL}
        >
          <Download size={14} aria-hidden="true" />
          下载 macOS 版
        </a>
      ) : null}
      <a
        className={`ec-button ${glass ? (MAC_DOWNLOAD_URL ? 'ec-button-glass' : 'ec-button-light') : ''}`}
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

function SectionHead({
  id,
  kicker,
  title,
  lead,
}: {
  id: string;
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="ew-head ec-reveal">
      <span className="ec-eyebrow">{kicker}</span>
      <h2 id={id}>
        <Phrases text={title} />
      </h2>
      {lead ? <p>{lead}</p> : null}
    </div>
  );
}

function SceneVisual({ id, className }: { id: string; className: string }) {
  const { Visual, shot } = sceneVisuals[id];
  return (
    <figure className={className}>
      <Visual />
      <figcaption>{shot ? '产品截图 · 演示数据' : '界面示意'}</figcaption>
    </figure>
  );
}

function ScenarioPanel({
  scenario,
  index,
}: {
  scenario: Scenario;
  index: number;
}) {
  const titleId = `ew-scene-${scenario.id}`;
  return (
    <article className="ew-feature" aria-labelledby={titleId}>
      <SceneVisual id={scenario.id} className="ew-feature-visual ec-reveal" />
      <div className="ew-feature-copy ec-reveal">
        <div className="ew-feature-meta">
          <span className="ew-index">{pad(index)}</span>
          <span>{scenario.label}</span>
          <Tags status={scenario.status} />
        </div>
        <h3 id={titleId}>
          <Phrases text={scenario.title} />
        </h3>
        <p className="ew-problem">{scenario.problem}</p>
        <Points points={scenario.points} />
      </div>
    </article>
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

function FeatureGroup({
  group,
  index,
}: {
  group: (typeof featureGroups)[number];
  index: number;
}) {
  const count = group.features.length;
  return (
    <div
      className="ew-feature-group ec-reveal"
      data-wide={count > 1 ? '' : undefined}
      style={{ '--r': index, '--n': count } as Vars}
    >
      <h3>
        {group.name}
        <small>{count}</small>
      </h3>
      <ul>
        {group.features.map((feature) => (
          <li key={feature.name}>
            <strong>
              {feature.name}
              <Tags status={feature.status} />
            </strong>
            <span>{feature.line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EditionCWorkPage() {
  const siteRef = useEditionMotion();
  const { labels } = compareIntro;

  return (
    <div className="ec-site ew-site" ref={siteRef}>
      <Header
        items={nav}
        action={{ label: 'GitHub', href: GITHUB_URL, external: true }}
      />

      <main id="main">
        <section className="ec-hero ew-hero" aria-labelledby="ew-title">
          <img
            className="ec-hero-photo"
            src={images.hero}
            width="1440"
            height="960"
            alt=""
            fetchPriority="high"
          />
          <div className="ec-hero-copy ew-hero-copy">
            <span className="ew-hero-eyebrow">{hero.kicker}</span>
            <h1 id="ew-title">
              {heroLines.map((line, index) => (
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
            <p className="ew-hero-agents">
              <span>{hero.agentsLabel}</span>
              {agentLine.slice(hero.agentsLabel.length)}
            </p>
          </div>
          <TypedWordmark text="Molis Work" />
        </section>

        <section
          className="ew-screen"
          data-scroll="enter"
          aria-label="Molis Work 界面"
        >
          <figure>
            <Window src={images.home} label="Molis Work" />
            <figcaption>产品截图 · 演示数据</figcaption>
          </figure>
        </section>

        <section
          id="scenarios"
          className="ew-scenarios"
          aria-labelledby="ew-scenarios-title"
        >
          <SectionHead
            id="ew-scenarios-title"
            kicker={scenariosIntro.kicker}
            title={scenariosIntro.title}
          />
          <div className="ew-features">
            {scenarios.map((scenario, index) => (
              <ScenarioPanel
                key={scenario.id}
                scenario={scenario}
                index={index}
              />
            ))}
          </div>
        </section>

        <section id="why" className="ew-why" aria-labelledby="ew-why-title">
          <SectionHead
            id="ew-why-title"
            kicker={differencesIntro.kicker}
            title={differencesIntro.title}
            lead={differencesIntro.lead}
          />
          <ol className="ew-pillars">
            {differences.map((item, index) => (
              <li
                key={item.title}
                className="ew-pillar ec-reveal"
                style={{ '--r': index } as Vars}
              >
                <div className="ew-feature-meta">
                  <span className="ew-index">{pad(index)}</span>
                  <Tags status={item.status} />
                </div>
                <h3>
                  <Phrases text={item.title} />
                </h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
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
            <Tags status={architecture.status} />
          </div>
          <Architecture />
        </section>

        <section
          id="more"
          className="ew-more-section"
          aria-labelledby="ew-more-title"
        >
          <SectionHead
            id="ew-more-title"
            kicker={moreIntro.kicker}
            title={moreIntro.title}
          />
          <div className="ew-cards">
            {moreScenarios.map((scenario, index) => (
              <article
                key={scenario.id}
                className="ew-more ec-reveal"
                style={{ '--r': index % 2 } as Vars}
                aria-labelledby={`ew-more-${scenario.id}`}
              >
                <SceneVisual id={scenario.id} className="ew-more-visual" />
                <div className="ew-more-copy">
                  <div className="ew-feature-meta">
                    <span>{scenario.label}</span>
                    <Tags status={scenario.status} />
                  </div>
                  <h3 id={`ew-more-${scenario.id}`}>
                    <Phrases text={scenario.title} />
                  </h3>
                  <p className="ew-problem">{scenario.problem}</p>
                  <Points points={scenario.points} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="features"
          className="ew-plugins"
          aria-labelledby="ew-features-title"
        >
          <div className="ew-plugins-intro ec-reveal">
            <span className="ec-eyebrow">{featuresIntro.kicker}</span>
            <h2 id="ew-features-title">
              <Phrases text={featuresIntro.title} />
            </h2>
            <p>{featuresIntro.lead}</p>
          </div>
          <div className="ew-feature-groups">
            {wideGroups.map((group, index) => (
              <FeatureGroup key={group.name} group={group} index={index} />
            ))}
          </div>
          <div
            className="ew-feature-band"
            style={
              {
                '--band': bandGroups
                  .map((group) => `minmax(0, ${group.features.length}fr)`)
                  .join(' '),
              } as Vars
            }
          >
            {bandGroups.map((group, index) => (
              <FeatureGroup key={group.name} group={group} index={index} />
            ))}
          </div>
        </section>

        <section
          id="compare"
          className="ew-compare"
          aria-labelledby="ew-compare-title"
        >
          <div className="ew-compare-intro ec-reveal">
            <div>
              <span className="ec-eyebrow">{compareIntro.kicker}</span>
              <h2 id="ew-compare-title">
                <Phrases text={compareIntro.title} />
              </h2>
            </div>
            <p>{compareIntro.lead}</p>
          </div>
          <div className="ew-compare-sheet">
            <div className="ew-compare-head" aria-hidden="true">
              <span />
              <div>
                <span>{labels.now}</span>
                <span>{labels.here}</span>
                <span>{labels.gap}</span>
              </div>
            </div>
            <ol className="ew-compare-rows">
              {comparisons.map((row, index) => (
                <li
                  key={row.now}
                  className="ec-reveal"
                  style={{ '--r': index % 3 } as Vars}
                >
                  <span className="ew-index" aria-hidden="true">
                    {pad(index)}
                  </span>
                  <dl>
                    <div className="ew-compare-now">
                      <dt>{labels.now}</dt>
                      <dd>{row.now}</dd>
                    </div>
                    <div className="ew-compare-here">
                      <dt>{labels.here}</dt>
                      <dd>{row.here}</dd>
                    </div>
                    <div className="ew-compare-gap">
                      <dt>{labels.gap}</dt>
                      <dd>{row.gap}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="local"
          className="ew-local"
          aria-labelledby="ew-local-title"
        >
          <figure className="ew-local-visual" data-scroll="pass">
            <img
              className="ew-local-photo"
              src={images.local}
              width="1440"
              height="960"
              alt=""
              loading="lazy"
            />
            <div className="ew-local-window">
              <Window src={images.home} label="Molis Work Home" />
            </div>
            <figcaption>产品截图 · 场景示意</figcaption>
          </figure>
          <div className="ew-local-copy ec-reveal">
            <span className="ec-eyebrow">{localFirst.kicker}</span>
            <h2 id="ew-local-title">
              <Phrases text={localFirst.title} />
            </h2>
            <ol>
              {localFirst.points.map((point, index) => (
                <li key={point}>
                  <span className="ew-index">{pad(index)}</span>
                  {point}
                </li>
              ))}
            </ol>
          </div>
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
