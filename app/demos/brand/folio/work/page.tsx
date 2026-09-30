'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Download,
  KeyRound,
  Search,
  ShieldCheck,
} from 'lucide-react';
import '../folio.css';
import './work.css';
import {
  GITHUB_URL,
  MAC_DOWNLOAD_URL,
  SHOW_NEXT_RELEASE,
  architecture,
  closing,
  extras,
  features,
  hero,
  localFirst,
  pillars,
  pluginWall,
  releasedPlugins,
  upcoming,
  type Stage,
} from './content';

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

const stageTone: Record<Stage, string> = {
  预览: 'preview',
  即将推出: 'soon',
  规划中: 'planned',
};

function StageTag({ stage }: { stage: Stage }) {
  return <span className={`fw-tag fw-tag-${stageTone[stage]}`}>{stage}</span>;
}

function NextTag({ show = true }: { show?: boolean }) {
  if (!SHOW_NEXT_RELEASE || !show) return null;
  return <span className="fw-tag fw-tag-next">下一版</span>;
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

function Shot({
  src,
  alt,
  width = 1440,
  height = 1000,
  eager = false,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  eager?: boolean;
}) {
  return (
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
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
        <Shot
          src="/images/demos/folio-work/home-zh.jpg"
          alt="Molis Work 项目首页：正在推进的目标、当天的事件和回到手边的内容"
          eager
        />
      </div>
      <div className="fw-hero-phone">
        <Shot
          src="/images/demos/folio-work/phone-zh.jpg"
          alt="Molis Work 在手机宽度下的界面"
          width={390}
          height={844}
          eager
        />
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
            {entry.stage ? <StageTag stage={entry.stage} /> : null}
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
            {Array.from({ length: 25 }, (_, index) => (
              <b key={index} style={{ '--i': index } as Vars} />
            ))}
          </i>
        </div>
        <div className="fw-diagram-runtime">{architecture.runtime}</div>
      </div>
      <div className="fw-diagram-base">{architecture.base}</div>
      <figcaption>示意</figcaption>
    </figure>
  );
}

function GoalsArt() {
  return (
    <figure className="fw-art fw-art-goals">
      <div className="fw-art-shot">
        <span className="fw-tape fw-tape-a" aria-hidden="true" />
        <Shot
          src="/images/demos/folio-work/goals-zh.jpg"
          alt="Goals 界面：目标树、完成要求和时间线"
        />
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
const capabilityRows = [
  ['Goals', '查询'],
  ['Pages', '写入'],
  ['Feed', '查询'],
  ['Dataset', '写入'],
];

function CapabilityArt() {
  return (
    <figure className="fw-art fw-art-cap" aria-label="能力目录的示意">
      <ul className="fw-cap-callers" aria-hidden="true">
        {callers.map((caller, index) => (
          <li key={caller} style={{ '--i': index } as Vars}>
            {caller}
          </li>
        ))}
      </ul>
      <div className="fw-cap-card" aria-hidden="true">
        <strong>能力目录</strong>
        {capabilityRows.map(([name, verb], index) => (
          <div
            className="fw-cap-row"
            key={name}
            style={{ '--i': index } as Vars}
          >
            <span>{name}</span>
            <small>{verb}</small>
            <i className={index === 3 ? 'is-off' : undefined} />
          </div>
        ))}
        <p>
          <ShieldCheck size={15} /> 每次调用留记录
        </p>
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

const runtimeInputs = ['文字', '图片', '判断', 'Agent'];

function RuntimeArt() {
  return (
    <figure className="fw-art fw-art-runtime" aria-label="AI 运行时的示意">
      <svg viewBox="0 0 600 600" aria-hidden="true">
        {runtimeInputs.map((_, index) => (
          <path
            key={index}
            className="fw-ribbon"
            style={{ '--i': index } as Vars}
            d={`M${60 + index * 160} 150C${60 + index * 160} 260 300 230 300 330`}
            pathLength={1}
          />
        ))}
        <path
          className="fw-ribbon fw-ribbon-out"
          d="M300 420V540"
          pathLength={1}
        />
      </svg>
      <ul className="fw-runtime-inputs" aria-hidden="true">
        {runtimeInputs.map((input) => (
          <li key={input}>{input}</li>
        ))}
      </ul>
      <div className="fw-runtime-gate" aria-hidden="true">
        Prologue
      </div>
      <div className="fw-runtime-key" aria-hidden="true">
        <KeyRound size={16} /> 密钥存在本机
      </div>
      <figcaption>示意</figcaption>
    </figure>
  );
}

const searchResults = [
  { source: 'Pages', before: '', after: ' 复盘草稿的第三段' },
  { source: 'Dataset', before: '', after: ' 渠道数据' },
  { source: '灵光', before: '关于 ', after: ' 的一个想法' },
];

function SearchArt() {
  return (
    <figure className="fw-art fw-art-search" aria-label="⌘K 搜索的示意">
      <div className="fw-search" aria-hidden="true">
        <div className="fw-search-input">
          <Search size={18} />
          <span className="fw-search-query">Q4</span>
          <kbd>⌘K</kbd>
        </div>
        <ul>
          {searchResults.map((result, index) => (
            <li key={result.source} style={{ '--i': index } as Vars}>
              <small>{result.source}</small>
              <span>
                {result.before}
                <mark>Q4</mark>
                {result.after}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption>示意</figcaption>
    </figure>
  );
}

const featureArt: Record<string, () => React.JSX.Element> = {
  goals: GoalsArt,
  capabilities: CapabilityArt,
  studio: StudioArt,
  coding: CodingArt,
  runtime: RuntimeArt,
  search: SearchArt,
};

function AgentsArt() {
  const sources = ['Codex', 'Claude Code', 'Cursor', 'OpenCode', 'Grok Build'];
  return (
    <div className="fw-extra-agents" aria-hidden="true">
      {sources.map((source, index) => (
        <span key={source} style={{ '--i': index } as Vars}>
          {source}
        </span>
      ))}
      <b>角色 v1</b>
    </div>
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
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          reveal.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );
    root
      .querySelectorAll('[data-reveal]')
      .forEach((item) => reveal.observe(item));

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      reveal.disconnect();
    };
  }, []);

  return (
    <div className="fo-site fw-site" ref={rootRef}>
      <header className="fo-header">
        <Link href="/demos/brand/folio" className="fo-logo">
          <img src="/images/molis-logo.png" width="36" height="36" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="fo-nav" aria-label="主导航">
          <Link href="/demos/community">社区</Link>
          <Link href="/demos/brand/folio#capabilities">关于我们</Link>
          <Link href="/join" className="fo-nav-cta">
            聊一聊
          </Link>
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
              {hero.title[0]}
              <br />
              {hero.title[1]}
            </h1>
            <p>{hero.subtitle}</p>
            <Actions />
            <small className="fw-hero-note">{hero.note}</small>
          </div>
          <HeroArt />
        </section>

        <section className="fw-pillars" aria-label="三个支柱">
          {pillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className={`fw-pillar fw-pillar-${index + 1}`}
              data-reveal
              style={{ '--i': index } as Vars}
            >
              <span className="fw-pillar-number">{index + 1}</span>
              <h2>
                {pillar.title}
                <NextTag show={pillar.next} />
              </h2>
              <p>{pillar.body}</p>
            </article>
          ))}
        </section>

        <section className="fw-arch" aria-labelledby="fw-arch-title">
          <div className="fw-arch-copy" data-reveal>
            <h2 id="fw-arch-title">
              {architecture.title}
              <NextTag />
            </h2>
            <p>{architecture.body}</p>
          </div>
          <div className="fw-arch-figure" data-reveal>
            <Diagram />
          </div>
        </section>

        <section className="fw-features" aria-label="主要功能">
          {features.map((feature, index) => {
            const Art = featureArt[feature.id];
            return (
              <article
                key={feature.id}
                id={feature.id}
                className={`fw-sheet fw-sheet-${feature.id}`}
                data-scene="enter"
                aria-labelledby={`fw-${feature.id}`}
              >
                <div className="fw-sheet-inner">
                  <div className="fw-sheet-copy">
                    <span className="fw-sheet-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="fw-sheet-label">
                      <small>{feature.label}</small>
                      {feature.stage ? (
                        <StageTag stage={feature.stage} />
                      ) : null}
                      <NextTag show={feature.next} />
                    </div>
                    <h3 id={`fw-${feature.id}`}>{feature.title}</h3>
                    <ul>
                      {feature.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <Art />
                </div>
              </article>
            );
          })}
        </section>

        <section className="fw-extras" aria-label="更多能力">
          {extras.map((extra, index) => (
            <article
              key={extra.title}
              className={`fw-extra fw-extra-${index + 1}`}
              data-reveal
              style={{ '--i': index } as Vars}
            >
              <div className="fw-extra-visual">
                {extra.image ? (
                  <figure>
                    <span className="fw-tape fw-tape-a" aria-hidden="true" />
                    <Shot src={extra.image} alt="" />
                    <figcaption>界面截图</figcaption>
                  </figure>
                ) : (
                  <figure>
                    <AgentsArt />
                    <figcaption>示意</figcaption>
                  </figure>
                )}
              </div>
              <h3>
                {extra.title}
                <NextTag show={extra.next} />
              </h3>
              <p>{extra.body}</p>
            </article>
          ))}
        </section>

        <section className="fw-wall" aria-labelledby="fw-wall-title">
          <div className="fw-wall-head" data-reveal>
            <h2 id="fw-wall-title">{pluginWall.title}</h2>
            <p>{pluginWall.subtitle}</p>
          </div>
          <div className="fw-wall-groups">
            {pluginWall.groups.map((group, groupIndex) => (
              <div
                key={group.name}
                className={`fw-wall-group fw-wall-group-${groupIndex + 1}`}
                data-reveal
              >
                <h3>{group.name}</h3>
                <ul>
                  {group.plugins.map((plugin, index) => (
                    <li key={plugin.name} style={{ '--i': index } as Vars}>
                      <strong>{plugin.name}</strong>
                      <span>{plugin.line}</span>
                      {plugin.stage || !releasedPlugins.has(plugin.name) ? (
                        <em>
                          {plugin.stage ? (
                            <StageTag stage={plugin.stage} />
                          ) : null}
                          <NextTag show={!releasedPlugins.has(plugin.name)} />
                        </em>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="fw-local" aria-labelledby="fw-local-title">
          <div className="fw-local-copy" data-reveal>
            <span className="fo-kicker">本地优先</span>
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

        <section className="fw-next" aria-labelledby="fw-next-title">
          <div className="fw-next-head" data-reveal>
            <span className="fo-kicker">接下来</span>
            <h2 id="fw-next-title">还在路上的几件事。</h2>
          </div>
          <ul className="fw-next-list">
            {upcoming.map((item, index) => (
              <li
                key={item.name}
                className={`fw-slip fw-slip-${stageTone[item.stage]}`}
                data-reveal
                style={{ '--i': index } as Vars}
              >
                <StageTag stage={item.stage} />
                <h3>{item.name}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
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
