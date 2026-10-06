'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  Download,
  ShieldCheck,
  Undo2,
} from 'lucide-react';
import '../folio.css';
import './work.css';
import {
  GITHUB_URL,
  MAC_DOWNLOAD_URL,
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
import { shots, type Shot as ShotData } from './content';

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

const tagTone: Record<Tag, string> = {
  下一版: 'next',
  预览: 'preview',
  规划中: 'planned',
};

const pad = (n: number) => String(n).padStart(2, '0');

/** 标题在逗号后换行；拼起来仍是 hero.title。 */
const titleCut = hero.title.indexOf('，') + 1;
const titleHead = hero.title.slice(0, titleCut);
const titleTail = hero.title.slice(titleCut);

function Tags({ status }: { status?: Status }) {
  const tags = tagsOf(status);
  if (!tags.length) return null;
  return (
    <span className="fw-tags">
      {tags.map((tag) => (
        <span key={tag} className={`fw-tag fw-tag-${tagTone[tag]}`}>
          {tag}
        </span>
      ))}
    </span>
  );
}

function Points({ points }: { points: Point[] }) {
  return (
    <ul className="fw-points">
      {points.map((point) => (
        <li key={point.text}>
          {point.text}
          <Tags status={point.status} />
        </li>
      ))}
    </ul>
  );
}

function Actions({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <div className={`fw-actions fw-actions-${tone}`}>
      {MAC_DOWNLOAD_URL ? (
        <a className="fw-btn fw-btn-primary" href={MAC_DOWNLOAD_URL}>
          <Download size={18} /> 下载 macOS 版
        </a>
      ) : null}
      <a
        className={`fw-btn ${MAC_DOWNLOAD_URL ? 'fw-btn-ghost' : 'fw-btn-primary'}`}
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
      >
        在 GitHub 查看 <ArrowUpRight size={18} />
      </a>
    </div>
  );
}

function Shot({ shot, eager = false }: { shot: ShotData; eager?: boolean }) {
  return (
    <img
      src={shot.src}
      width={shot.width}
      height={shot.height}
      alt={shot.alt}
      loading={eager ? undefined : 'lazy'}
      decoding="async"
    />
  );
}

function HeroArt() {
  return (
    <figure className="fw-hero-art">
      <svg className="fw-hero-cuts" viewBox="0 0 700 640" aria-hidden="true">
        <g className="fw-cut" style={{ '--i': 0 } as Vars}>
          <path className="fo-blue" d="M40 640V330a170 170 0 0 1 340 0v310Z" />
        </g>
        <g className="fw-cut" style={{ '--i': 1 } as Vars}>
          <circle className="fo-red" cx="590" cy="120" r="96" />
        </g>
        <g className="fw-cut" style={{ '--i': 2 } as Vars}>
          <path
            className="fo-yellow"
            d="M560 520 588 586 656 594 604 638 620 704 560 668 500 704 516 638 464 594 532 586Z"
          />
        </g>
        <path
          className="fw-hero-thread"
          d="M70 190C160 120 230 250 330 170S520 60 560 150"
          pathLength={1}
        />
      </svg>
      <div className="fw-hero-shot">
        <span className="fw-tape fw-tape-a" aria-hidden="true" />
        <span className="fw-tape fw-tape-b" aria-hidden="true" />
        <Shot shot={shots.home} eager />
      </div>
      <div className="fw-hero-phone">
        <Shot shot={shots.phone} eager />
      </div>
      <ul className="fw-hero-chips" aria-hidden="true">
        <li style={{ '--i': 0 } as Vars}>人</li>
        <li style={{ '--i': 1 } as Vars}>工具</li>
        <li style={{ '--i': 2 } as Vars}>Agent</li>
      </ul>
      <figcaption>界面截图</figcaption>
    </figure>
  );
}

function Diagram() {
  return (
    <figure
      className="fw-diagram"
      aria-label="结构示意：四个入口经统一能力目录调用插件和 Prologue 运行时，底座是本机的 Home"
    >
      <ol className="fw-diagram-entries">
        {architecture.entries.map((entry, index) => (
          <li key={entry.name} style={{ '--i': index } as Vars}>
            <span>{entry.name}</span>
            {entry.detail ? <small>{entry.detail}</small> : null}
          </li>
        ))}
      </ol>
      <div className="fw-diagram-arrows" aria-hidden="true">
        {architecture.entries.map((entry) => (
          <ArrowDown key={entry.name} size={18} />
        ))}
      </div>
      <div className="fw-diagram-catalog">{architecture.catalog}</div>
      <div className="fw-diagram-row">
        <div className="fw-diagram-plugins">
          <span>{architecture.plugins}</span>
          <i aria-hidden="true">
            {Array.from({ length: 26 }, (_, index) => (
              <b key={index} />
            ))}
          </i>
        </div>
        <div className="fw-diagram-runtime">{architecture.runtime}</div>
      </div>
      <div className="fw-diagram-base">{architecture.home}</div>
      <figcaption>示意</figcaption>
    </figure>
  );
}

function GoalsArt() {
  return (
    <figure className="fw-art fw-art-goals">
      <div className="fw-art-shot">
        <span className="fw-tape fw-tape-a" aria-hidden="true" />
        <Shot shot={shots.goals} />
      </div>
      <span className="fw-stamp" aria-hidden="true">
        <Check size={22} strokeWidth={3} />
        完成要求 1/1
      </span>
      <figcaption>界面截图</figcaption>
    </figure>
  );
}

const callers = ['页面', '助理', '工作流', '外部 Agent'];
const capabilityRows: { name: string; verb: string; state: string }[] = [
  { name: 'Goals', verb: '查询', state: 'on' },
  { name: 'Pages', verb: '写入', state: 'on' },
  { name: 'Git', verb: '推送', state: 'review' },
  { name: 'Dataset', verb: '写入', state: 'off' },
];

function CapabilityArt() {
  return (
    <figure
      className="fw-art fw-art-cap"
      aria-label="能力目录、审查队列与撤销的示意"
    >
      <ul className="fw-cap-callers" aria-hidden="true">
        {callers.map((caller, index) => (
          <li key={caller} style={{ '--i': index } as Vars}>
            {caller}
          </li>
        ))}
      </ul>
      <div className="fw-cap-card" aria-hidden="true">
        <strong>能力目录</strong>
        {capabilityRows.map((row, index) => (
          <div
            className="fw-cap-row"
            key={row.name}
            style={{ '--i': index } as Vars}
          >
            <span>{row.name}</span>
            <small>{row.verb}</small>
            {row.state === 'review' ? (
              <b className="fw-cap-review">待审查</b>
            ) : (
              <i className={row.state === 'off' ? 'is-off' : undefined} />
            )}
          </div>
        ))}
        <p>
          <ShieldCheck size={15} /> 每次调用留记录
        </p>
        <div className="fw-cap-undo">
          <span>已写入 Pages</span>
          <b>
            <Undo2 size={14} strokeWidth={2.5} /> 撤销
          </b>
        </div>
      </div>
      <figcaption>示意</figcaption>
    </figure>
  );
}

function AssistantArt() {
  return (
    <figure className="fw-art fw-art-assist" aria-label="底栏助理的示意">
      <div className="fw-assist-page" aria-hidden="true">
        <div className="fw-assist-top">
          <span>Pages</span>
          <i />
          <i />
        </div>
        <b className="fw-assist-line" />
        <b className="fw-assist-line fw-assist-line-short" />
        <p>
          <mark>周五前把访谈纪要发给设计组，下周约一次评审。</mark>
        </p>
        <b className="fw-assist-line" />
        <b className="fw-assist-line fw-assist-line-mid" />
      </div>
      <div className="fw-assist-card" aria-hidden="true">
        <strong>建两个待办</strong>
        <ul>
          <li>
            <i />
            把访谈纪要发给设计组
            <small>周五</small>
          </li>
          <li>
            <i />
            约下周评审
          </li>
        </ul>
        <div className="fw-assist-buttons">
          <span className="fw-assist-run">执行</span>
          <span className="fw-assist-undo">
            <Undo2 size={13} strokeWidth={2.5} /> 撤销
          </span>
        </div>
      </div>
      <div className="fw-assist-input" aria-hidden="true">
        <span className="fw-assist-chip">@ 选中段落</span>
        <span className="fw-assist-chip fw-assist-chip-cmd">/ 待办</span>
        <span className="fw-assist-typing">拆成待办</span>
        <b>
          <ArrowUp size={16} strokeWidth={2.5} />
        </b>
      </div>
      <figcaption>示意</figcaption>
    </figure>
  );
}

const studioSteps = ['描述', '方案', '沙箱', '检查'];

function StudioArt() {
  return (
    <figure className="fw-art fw-art-studio" aria-label="插件创作台的示意">
      <ol className="fw-studio-steps" aria-hidden="true">
        {studioSteps.map((step, index) => (
          <li key={step} style={{ '--i': index } as Vars}>
            <b>{index + 1}</b>
            {step}
          </li>
        ))}
      </ol>
      <div className="fw-studio-grid" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index} />
        ))}
        <span className="fw-studio-new">新插件</span>
      </div>
      <figcaption>示意</figcaption>
    </figure>
  );
}

const boardColumns = [
  { name: '计划', cards: 2 },
  { name: '进行中', cards: 2 },
  { name: '待审查', cards: 1 },
];

function CodingArt() {
  return (
    <figure className="fw-art fw-art-coding" aria-label="Coding 任务板的示意">
      <div className="fw-board" aria-hidden="true">
        {boardColumns.map((column, columnIndex) => (
          <div key={column.name} className="fw-board-col">
            <small>{column.name}</small>
            {Array.from({ length: column.cards }, (_, index) => (
              <span
                key={index}
                style={{ '--i': columnIndex * 2 + index } as Vars}
              >
                <i />
                <i />
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="fw-agents" aria-hidden="true">
        <span>会话 A</span>
        <b />
        <span>会话 B</span>
      </div>
      <span className="fw-review" aria-hidden="true">
        先经你审查
      </span>
      <figcaption>示意</figcaption>
    </figure>
  );
}

function LocalArt() {
  return (
    <figure className="fw-local-art" aria-label="本机数据边界的示意">
      <svg viewBox="0 0 520 440" aria-hidden="true">
        <rect
          className="fw-local-boundary"
          x="20"
          y="20"
          width="480"
          height="400"
          rx="36"
          pathLength={1}
        />
        <path className="fo-navy" d="M120 330V190l140-90 140 90v140Z" />
        <rect
          className="fo-yellow"
          x="226"
          y="250"
          width="68"
          height="80"
          rx="34"
        />
        <circle className="fo-red" cx="400" cy="110" r="44" />
        <path className="fw-local-ground" d="M60 330h400" />
      </svg>
      <span className="fw-local-label">Molis Work Home</span>
      <figcaption>示意</figcaption>
    </figure>
  );
}

const scenarioArt: Record<string, () => React.JSX.Element> = {
  relay: GoalsArt,
  control: CapabilityArt,
  assistant: AssistantArt,
};

function ShotCard({ shot }: { shot: ShotData }) {
  return (
    <figure className="fw-card-shot">
      <div className="fw-card-frame">
        <span className="fw-tape fw-tape-a" aria-hidden="true" />
        <Shot shot={shot} />
      </div>
      <figcaption>界面截图</figcaption>
    </figure>
  );
}

const moreVisual: Record<string, () => React.JSX.Element> = {
  feed: () => <ShotCard shot={shots.feed} />,
  start: () => <ShotCard shot={shots.onboarding} />,
  studio: StudioArt,
  coding: CodingArt,
};

export default function FolioWorkPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    requestAnimationFrame(() => root.classList.add('is-ready'));

    const scenes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-scene]'),
    );
    const sheets = Array.from(root.querySelectorAll<HTMLElement>('.fw-sheet'));

    // 内容高过一屏的页不再粘住，免得下半截被下一张盖住。
    const fit = () => {
      const vh = window.innerHeight;
      for (const sheet of sheets) {
        const inner = sheet.firstElementChild as HTMLElement | null;
        if (!inner) continue;
        const style = getComputedStyle(inner);
        let need = 0;
        for (const child of Array.from(inner.children)) {
          need = Math.max(need, (child as HTMLElement).offsetHeight);
        }
        need += parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        sheet.classList.toggle('is-loose', need > vh);
      }
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 2) continue;
        const p =
          scene.dataset.scene === 'leave'
            ? -rect.top / vh
            : (vh - rect.top) / vh;
        scene.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
      }
      sheets.forEach((sheet, index) => {
        const next = sheets[index + 1];
        if (!next) return;
        const top = next.getBoundingClientRect().top;
        const covered = Math.min(1, Math.max(0, 1 - top / vh));
        sheet.style.setProperty('--c', covered.toFixed(4));
      });
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = () => {
      fit();
      request();
    };
    fit();
    update();
    void document.fonts?.ready.then(resize);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', resize);

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          reveal.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );
    root
      .querySelectorAll('[data-reveal]')
      .forEach((item) => reveal.observe(item));

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', resize);
      reveal.disconnect();
    };
  }, []);

  const { labels } = compareIntro;

  return (
    <div className="fo-site fw-site" ref={rootRef}>
      <header className="fo-header">
        <Link href="/demos/brand/folio" className="fo-logo">
          <img src="/images/molis-logo.png" width="36" height="36" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="fo-nav fw-nav" aria-label="Molis Work 页面导航">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          {MAC_DOWNLOAD_URL ? (
            <a href={MAC_DOWNLOAD_URL} className="fo-nav-cta">
              下载<span className="fw-nav-long"> macOS 版</span>
            </a>
          ) : (
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="fo-nav-cta"
            >
              GitHub
            </a>
          )}
        </nav>
      </header>

      <main id="main">
        <section
          className="fw-hero"
          data-scene="leave"
          aria-labelledby="fw-title"
        >
          <div className="fw-masthead" aria-hidden="true">
            {Array.from('Work').map((letter, index) => (
              <span key={index} style={{ '--i': index } as Vars}>
                {letter}
              </span>
            ))}
          </div>
          <div className="fw-hero-copy">
            <span className="fo-kicker">{hero.kicker}</span>
            <h1 id="fw-title">
              {titleHead}
              <br />
              {titleTail}
            </h1>
            <p>{hero.lead}</p>
            <Actions />
            <div className="fw-hero-agents">
              <small>{hero.agentsLabel}</small>
              <ul>
                {hero.agents.map((agent, index) => (
                  <li key={agent} style={{ '--i': index } as Vars}>
                    {agent}
                  </li>
                ))}
              </ul>
              <span className="fw-hero-more">{hero.agentsMore}</span>
            </div>
          </div>
          <HeroArt />
        </section>

        <section
          id="scenarios"
          className="fw-scenarios"
          aria-labelledby="fw-scenarios-title"
        >
          <header className="fw-section-head" data-reveal>
            <span className="fo-kicker">{scenariosIntro.kicker}</span>
            <h2 id="fw-scenarios-title">{scenariosIntro.title}</h2>
          </header>
          <div className="fw-stack">
            {scenarios.map((scenario, index) => {
              const Art = scenarioArt[scenario.id];
              return (
                <article
                  key={scenario.id}
                  className={`fw-sheet fw-sheet-${scenario.id}`}
                  data-scene="enter"
                  aria-labelledby={`fw-${scenario.id}`}
                >
                  <div className="fw-sheet-inner">
                    <div className="fw-sheet-copy">
                      <span className="fw-sheet-number">{pad(index + 1)}</span>
                      <div className="fw-sheet-label">
                        <small>{scenario.label}</small>
                        <Tags status={scenario.status} />
                      </div>
                      <h3 id={`fw-${scenario.id}`}>{scenario.title}</h3>
                      <p className="fw-problem">{scenario.problem}</p>
                      <Points points={scenario.points} />
                    </div>
                    <Art />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="why" className="fw-why" aria-labelledby="fw-why-title">
          <header className="fw-section-head fw-split-head" data-reveal>
            <div>
              <span className="fo-kicker">{differencesIntro.kicker}</span>
              <h2 id="fw-why-title">{differencesIntro.title}</h2>
            </div>
            <p>{differencesIntro.lead}</p>
          </header>
          <ol className="fw-pillars">
            {differences.map((difference, index) => (
              <li
                key={difference.title}
                className={`fw-pillar fw-pillar-${index + 1}`}
                data-reveal
                style={{ '--i': index } as Vars}
              >
                <div className="fw-pillar-top">
                  <span className="fw-pillar-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <Tags status={difference.status} />
                </div>
                <h3>{difference.title}</h3>
                <p>{difference.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="fw-arch" aria-labelledby="fw-arch-title">
          <div className="fw-arch-copy" data-reveal>
            <h2 id="fw-arch-title">{architecture.title}</h2>
            <Tags status={architecture.status} />
            <p>{architecture.body}</p>
          </div>
          <div className="fw-arch-figure" data-reveal>
            <Diagram />
          </div>
        </section>

        <section id="more" className="fw-more" aria-labelledby="fw-more-title">
          <header className="fw-section-head" data-reveal>
            <span className="fo-kicker">{moreIntro.kicker}</span>
            <h2 id="fw-more-title">{moreIntro.title}</h2>
          </header>
          <div className="fw-cards">
            {moreScenarios.map((scenario, index) => {
              const Visual = moreVisual[scenario.id];
              return (
                <article
                  key={scenario.id}
                  className={`fw-card fw-card-${scenario.id}`}
                  data-reveal
                  style={{ '--i': index } as Vars}
                  aria-labelledby={`fw-${scenario.id}`}
                >
                  <div className="fw-card-visual" data-scene="enter">
                    <Visual />
                  </div>
                  <div className="fw-card-label">
                    <small>{scenario.label}</small>
                    <Tags status={scenario.status} />
                  </div>
                  <h3 id={`fw-${scenario.id}`}>{scenario.title}</h3>
                  <p className="fw-problem">{scenario.problem}</p>
                  <Points points={scenario.points} />
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="features"
          className="fw-wall"
          aria-labelledby="fw-wall-title"
        >
          <header className="fw-section-head fw-split-head" data-reveal>
            <div>
              <span className="fo-kicker">{featuresIntro.kicker}</span>
              <h2 id="fw-wall-title">{featuresIntro.title}</h2>
            </div>
            <p>{featuresIntro.lead}</p>
          </header>
          <div className="fw-wall-groups">
            {featureGroups.map((group, groupIndex) => (
              <div
                key={group.name}
                className={`fw-wall-group fw-wall-group-${groupIndex + 1}`}
              >
                <h3>
                  <span aria-hidden="true">{pad(groupIndex + 1)}</span>
                  {group.name}
                </h3>
                <ul>
                  {group.features.map((feature) => (
                    <li
                      key={feature.name}
                      className={
                        feature.status === 'planned' ? 'is-planned' : undefined
                      }
                    >
                      <strong>{feature.name}</strong>
                      <span>{feature.line}</span>
                      <Tags status={feature.status} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section
          id="compare"
          className="fw-compare"
          aria-labelledby="fw-compare-title"
        >
          <header className="fw-section-head fw-split-head" data-reveal>
            <div>
              <span className="fo-kicker">{compareIntro.kicker}</span>
              <h2 id="fw-compare-title">{compareIntro.title}</h2>
            </div>
            <p>{compareIntro.lead}</p>
          </header>
          <div className="fw-compare-table">
            <div className="fw-compare-cols" aria-hidden="true">
              <span />
              <div>
                <span>{labels.now}</span>
                <span>{labels.here}</span>
                <span>{labels.gap}</span>
              </div>
            </div>
            <ol className="fw-compare-rows">
              {comparisons.map((row, index) => (
                <li
                  key={row.now}
                  className="fw-compare-row"
                  data-reveal
                  style={{ '--i': index } as Vars}
                >
                  <span className="fw-compare-num" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <dl>
                    <div className="fw-compare-now">
                      <dt>{labels.now}</dt>
                      <dd>{row.now}</dd>
                    </div>
                    <div className="fw-compare-here">
                      <dt>{labels.here}</dt>
                      <dd>{row.here}</dd>
                    </div>
                    <div className="fw-compare-gap">
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
          className="fw-local"
          aria-labelledby="fw-local-title"
        >
          <div className="fw-local-copy" data-reveal>
            <span className="fo-kicker">{localFirst.kicker}</span>
            <h2 id="fw-local-title">{localFirst.title}</h2>
            <ol>
              {localFirst.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ol>
          </div>
          <div data-reveal>
            <LocalArt />
          </div>
        </section>
      </main>

      <footer className="fo-back fw-back">
        <div className="fw-back-head">
          <h2>
            {closing.title[0]}
            <br />
            {closing.title[1]}
          </h2>
          <Actions tone="dark" />
        </div>
        <div className="fo-colophon">
          <span className="fo-colophon-mark">Work</span>
          <div>
            <span>Molis AI</span>
            <Link href={GITHUB_URL} target="_blank" rel="noreferrer">
              GitHub
            </Link>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
