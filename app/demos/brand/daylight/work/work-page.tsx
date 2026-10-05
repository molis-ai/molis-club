'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type {
  CSSProperties,
  ComponentType,
  ReactNode,
  PointerEvent as ReactPointerEvent,
} from 'react';
import {
  ArrowUp,
  ArrowUpRight,
  Blocks,
  Bot,
  Check,
  Command,
  Cpu,
  Download,
  FileText,
  HardDrive,
  LayoutPanelTop,
  Search,
  ShieldCheck,
  Sparkles,
  Undo2,
  UserCheck,
  Workflow,
} from 'lucide-react';
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
} from '../../../../../content/molis-work';
import type {
  Point,
  Scenario,
  Status,
  Tag,
} from '../../../../../content/molis-work';
import '../daylight.css';
import './work.css';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* 标签文字来自 tagsOf()，这里只决定用哪种颜色。 */
const tagKind: Record<Tag, string> = {
  下一版: 'next',
  预览: 'preview',
  规划中: 'planned',
};

function Tags({ status }: { status?: Status }) {
  const tags = tagsOf(status);
  if (!tags.length) return null;
  return (
    <>
      {tags.map((tag) => (
        <span className={`dw-tag dw-tag-${tagKind[tag]}`} key={tag}>
          {tag}
        </span>
      ))}
    </>
  );
}

/* 标题按逗号断行，拼起来仍是原文；窄屏再按顿号分词组换行，不把词拆开。 */
const lines = (text: string) => text.split(/(?<=，)/);
const phrases = (text: string) => text.split(/(?<=[，、])/);
/* 中文逐字、英文按词拆开，窄屏换行时不会把 Agent 断开。 */
const tokens = (line: string) =>
  (line.match(/[A-Za-z]+|./gu) ?? []).map((t) => (t === ' ' ? '\u00a0' : t));
const pad2 = (n: number) => String(n).padStart(2, '0');
const index2 = (index: number) => pad2(index + 1);

const heroLines = lines(hero.title);

const entryIcons: ComponentType<{ size?: number }>[] = [
  LayoutPanelTop,
  Bot,
  Workflow,
  Command,
];

const localIcons = [HardDrive, ShieldCheck, FileText, Cpu, UserCheck];

function random(seed: number) {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
}

const branches = [
  { x: -40, y: 60, dx: 540, dy: 170, leaves: 10, seed: 5 },
  { x: 60, y: -20, dx: 330, dy: 340, leaves: 8, seed: 13 },
  { x: 240, y: 110, dx: 400, dy: -30, leaves: 7, seed: 29 },
];

function LeafShadow({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 460"
      preserveAspectRatio="xMinYMin slice"
      aria-hidden="true"
    >
      {branches.map((branch, b) => (
        <g className={`dl-branch dl-branch-${b}`} key={b}>
          <path
            d={`M${branch.x} ${branch.y} q ${branch.dx * 0.5} ${branch.dy * 0.2} ${branch.dx} ${branch.dy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {Array.from({ length: branch.leaves }, (_, i) => {
            const t = (i + 1) / (branch.leaves + 1);
            const r = random(branch.seed + i);
            const x = branch.x + branch.dx * t;
            const y = branch.y + branch.dy * (0.4 * t * (1 - t) + t * t);
            const side = i % 2 === 0 ? 1 : -1;
            const angle =
              (Math.atan2(branch.dy, branch.dx) * 180) / Math.PI +
              side * (38 + r * 30);
            const length = 22 + r * 18;
            return (
              <ellipse
                key={i}
                cx={x + side * 6}
                cy={y + side * 10}
                rx={length}
                ry={length * 0.34}
                transform={`rotate(${angle} ${x} ${y})`}
                fill="currentColor"
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

function MaskLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <span className="dl-mask" key={line}>
          <span style={{ '--d': index } as Vars}>
            <Phrases text={line} />
          </span>
        </span>
      ))}
    </>
  );
}

function Phrases({ text }: { text: string }) {
  return (
    <>
      {phrases(text).map((phrase) => (
        <span className="dl-phrase" key={phrase}>
          {phrase}
        </span>
      ))}
    </>
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
  children?: ReactNode;
}) {
  return (
    <div className="dw-head dl-reveal">
      <div className="dw-head-title">
        {kicker ? <span className="dl-eyebrow">{kicker}</span> : null}
        <h2 id={id}>
          <MaskLines lines={lines(title)} />
        </h2>
      </div>
      {lead || children ? (
        <p>
          {lead}
          {children}
        </p>
      ) : null}
    </div>
  );
}

function Points({ points }: { points: Point[] }) {
  return (
    <ul className="dw-points">
      {points.map((point) => (
        <li key={point.text}>
          {point.text}
          <Tags status={point.status} />
        </li>
      ))}
    </ul>
  );
}

function Actions({ tone }: { tone: 'light' | 'dusk' }) {
  return (
    <div className={`dw-actions dw-actions-${tone}`}>
      {MAC_DOWNLOAD_URL ? (
        <a className="dw-button dw-button-primary" href={MAC_DOWNLOAD_URL}>
          <Download size={17} aria-hidden="true" />
          下载 macOS 版
        </a>
      ) : null}
      <a
        className={`dw-button ${MAC_DOWNLOAD_URL ? 'dw-button-ghost' : 'dw-button-primary'}`}
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
      >
        在 GitHub 查看
        <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </div>
  );
}

function Window({
  src,
  width,
  height,
  label,
  className = '',
}: {
  src: string;
  width: number;
  height: number;
  label: string;
  className?: string;
}) {
  return (
    <div className={`dw-window ${className}`}>
      <div className="dw-window-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{label}</span>
      </div>
      <img src={src} width={width} height={height} alt="" loading="lazy" />
    </div>
  );
}

/* ---------- 场景画面：目标用真实截图，其余是示意 ---------- */

function GoalsVisual() {
  return (
    <Window
      className="dw-mock dw-shot"
      src="/images/daylight/work/goals.jpg"
      width={1440}
      height={1000}
      label="Goals"
    />
  );
}

function ControlVisual() {
  const rows = [
    ['查询', true],
    ['判断', true],
    ['写入', false],
  ] as const;
  return (
    <div className="dw-mock dw-cap" aria-hidden="true">
      <div className="dw-cap-callers">
        {['页面', '助理', '工作流', '外部 Agent'].map((name, index) => (
          <span key={name} style={{ '--r': index } as Vars}>
            {name}
          </span>
        ))}
      </div>
      <div className="dw-cap-card">
        <div className="dw-cap-head">
          <Blocks size={15} />
          能力目录
          <em>
            <ShieldCheck size={12} />
            审查队列
          </em>
        </div>
        {rows.map(([label, on], index) => (
          <div
            className="dw-cap-row"
            key={label}
            style={{ '--r': index } as Vars}
          >
            <span>{label}</span>
            <small>{on ? '已授予' : '已撤回'}</small>
            <b className={on ? 'is-on' : ''}>
              <i />
            </b>
          </div>
        ))}
        <div className="dw-cap-log">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="dw-cap-toast">
        <Check size={13} />
        <i />
        <span>
          <Undo2 size={12} />
          撤销
        </span>
      </div>
    </div>
  );
}

function AssistantVisual() {
  return (
    <div className="dw-mock dw-assist" aria-hidden="true">
      <div className="dw-assist-page">
        <div className="dw-assist-title">
          <FileText size={14} />
          <i />
        </div>
        <div className="dw-assist-text">
          <i />
          <span className="dw-assist-sel">
            <i />
            <i />
          </span>
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="dw-assist-card">
        <div className="dw-assist-card-head">
          <Sparkles size={14} />
          建两个待办
        </div>
        <ul>
          <li>
            <b />
            <i />
          </li>
          <li>
            <b />
            <i />
          </li>
        </ul>
        <div className="dw-assist-buttons">
          <span className="is-primary">
            <Check size={13} />
            执行
          </span>
          <span>
            <Undo2 size={13} />
            撤销
          </span>
        </div>
      </div>
      <div className="dw-assist-bar">
        <span className="dw-assist-chip">@ 选区</span>
        <span className="dw-assist-chip">/ 待办</span>
        <span className="dw-assist-caret" />
        <b>
          <ArrowUp size={14} />
        </b>
      </div>
    </div>
  );
}

function StudioVisual() {
  const steps = ['描述', '方案', '沙箱', '检查', '安装'];
  return (
    <div className="dw-mock dw-studio" aria-hidden="true">
      <div className="dw-studio-prompt">
        <Search size={14} />
        <span className="dw-studio-caret" />
      </div>
      <ol>
        {steps.map((step, index) => (
          <li key={step} style={{ '--r': index } as Vars}>
            <b>
              <Check size={12} />
            </b>
            {step}
          </li>
        ))}
      </ol>
      <div className="dw-studio-plugin">
        <span>
          <Blocks size={18} />
        </span>
        <i />
        <i />
      </div>
    </div>
  );
}

function CodingVisual() {
  const columns = [
    ['计划', 3],
    ['进行中', 2],
    ['待审查', 1],
  ] as const;
  return (
    <div className="dw-mock dw-board" aria-hidden="true">
      {columns.map(([name, count], c) => (
        <div className="dw-board-col" key={name}>
          <small>{name}</small>
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className={c === 2 ? 'is-review' : c === 1 ? 'is-live' : ''}
              style={{ '--r': c * 2 + i } as Vars}
            >
              <i />
              <i />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

const scenarioArt: Record<
  string,
  {
    Visual: ComponentType;
    photo: string;
    size: [number, number];
    caption: string;
  }
> = {
  relay: {
    Visual: GoalsVisual,
    photo: '/images/atelier/studio-desk.jpg',
    size: [1440, 960],
    caption: '产品截图 · 演示数据',
  },
  control: {
    Visual: ControlVisual,
    photo: '/images/atelier/shared-studio.jpg',
    size: [1440, 960],
    caption: '界面示意',
  },
  assistant: {
    Visual: AssistantVisual,
    photo: '/images/atelier/reading-room.jpg',
    size: [1440, 960],
    caption: '界面示意',
  },
};

const moreArt: Record<
  string,
  {
    image?: string;
    photo?: { src: string; size: [number, number] };
    Visual?: ComponentType;
    caption: string;
  }
> = {
  feed: { image: '/images/daylight/work/feed.jpg', caption: 'Feed · 产品截图' },
  start: {
    image: '/images/daylight/work/onboarding.jpg',
    caption: '首次使用 · 产品截图',
  },
  studio: {
    photo: { src: '/images/atelier/makers-studio.jpg', size: [1672, 941] },
    Visual: StudioVisual,
    caption: '插件创作台 · 界面示意',
  },
  coding: {
    photo: { src: '/images/edition-c/making-study.jpg', size: [1536, 1024] },
    Visual: CodingVisual,
    caption: 'Coding · 界面示意',
  },
};

function ScenarioCopy({
  scenario,
  index,
  inRail,
}: {
  scenario: Scenario;
  index: number;
  inRail?: boolean;
}) {
  const tags = tagsOf(scenario.status);
  return (
    <>
      {!inRail || tags.length ? (
        <div className="dw-feature-meta">
          {inRail ? null : (
            <span>
              <em>{index2(index)}</em>
              {scenario.label}
            </span>
          )}
          <Tags status={scenario.status} />
        </div>
      ) : null}
      <h3>
        <Phrases text={scenario.title} />
      </h3>
      <p className="dw-problem">{scenario.problem}</p>
      <Points points={scenario.points} />
    </>
  );
}

function trackSpotlight(event: ReactPointerEvent<HTMLElement>) {
  const target = event.currentTarget;
  const box = target.getBoundingClientRect();
  target.style.setProperty('--mx', `${event.clientX - box.left}px`);
  target.style.setProperty('--my', `${event.clientY - box.top}px`);
}

/* 功能全景按组流进多栏瀑布流：组可以跨栏接着排，组名总跟着它的第一张卡。 */
function FeatureGroup({ group }: { group: (typeof featureGroups)[number] }) {
  return (
    <div className="dw-group">
      <h3 className="dl-reveal">
        {group.name}
        <small aria-hidden="true">{pad2(group.features.length)}</small>
      </h3>
      <ul>
        {group.features.map((feature) => (
          <li
            key={feature.name}
            className="dw-plugin dl-reveal"
            onPointerMove={trackSpotlight}
          >
            <div className="dw-plugin-head">
              <strong>{feature.name}</strong>
              <span className="dw-plugin-tags">
                <Tags status={feature.status} />
              </span>
            </div>
            <p>{feature.line}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WorkPage() {
  const siteRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const site = siteRef.current;
    if (!site) return;
    const header = site.querySelector<HTMLElement>('.dl-header');
    const heroNode = site.querySelector<HTMLElement>('.dw-hero');
    const scenes = Array.from(
      site.querySelectorAll<HTMLElement>('[data-scene]'),
    );

    let frame = 0;
    let lastY = window.scrollY;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const scene of scenes) {
        const box = scene.getBoundingClientRect();
        if (box.bottom < -vh * 0.25 || box.top > vh * 1.25) continue;
        let progress =
          scene.dataset.scene === 'exit'
            ? -box.top / Math.max(1, box.height)
            : (vh - box.top) / (vh + box.height);
        progress = Math.min(1, Math.max(0, progress));
        scene.style.setProperty('--p', progress.toFixed(4));
      }
      const y = window.scrollY;
      if (header) {
        header.classList.toggle('is-solid', y > vh * 0.6);
        header.classList.toggle('is-hidden', y > vh && y > lastY + 2);
        if (y < lastY - 2) header.classList.remove('is-hidden');
      }
      lastY = y;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    /* 观察器加的类只放在 className 固定的元素上，React 重渲染时不会被抹掉。 */
    const revealer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          revealer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -14% 0px' },
    );
    site
      .querySelectorAll('.dl-reveal')
      .forEach((node) => revealer.observe(node));

    /*
     * 三个场景面板按顺序对应导航轨的三项（active 0–2）。
     * is-seen 加在 className 固定的 .dw-panel-frame 上，active 变化引起的重渲染不会把它抹掉。
     */
    const panels = Array.from(site.querySelectorAll<HTMLElement>('.dw-panel'));
    const spotter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target
            .querySelector('.dw-panel-frame')
            ?.classList.add('is-seen');
          const index = panels.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    panels.forEach((panel) => spotter.observe(panel));

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !heroNode) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      heroNode.style.setProperty('--sun-x', (x * 28).toFixed(1) + 'px');
      heroNode.style.setProperty('--sun-y', (y * 18).toFixed(1) + 'px');
    };

    site.classList.add('is-ready');
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    heroNode?.addEventListener('pointermove', onPointer);
    return () => {
      cancelAnimationFrame(frame);
      revealer.disconnect();
      spotter.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      heroNode?.removeEventListener('pointermove', onPointer);
    };
  }, []);

  const labels = compareIntro.labels;

  return (
    <div className="dl-site dw-site" ref={siteRef}>
      <header className="dl-header">
        <Link href="/demos/brand/daylight" className="dl-logo">
          <img src="/images/molis-logo.png" width="44" height="44" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="dl-pill" aria-label="页面导航">
          {nav.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
          <a
            href={MAC_DOWNLOAD_URL ?? GITHUB_URL}
            className="dl-pill-cta"
            target={MAC_DOWNLOAD_URL ? undefined : '_blank'}
            rel={MAC_DOWNLOAD_URL ? undefined : 'noreferrer'}
          >
            {MAC_DOWNLOAD_URL ? '下载 macOS 版' : '在 GitHub 查看'}
          </a>
        </nav>
      </header>

      <main id="main">
        <section
          className="dw-hero"
          data-scene="exit"
          aria-labelledby="dw-title"
        >
          <div className="dw-hero-frame">
            <div className="dw-hero-open">
              <div className="dw-hero-media">
                <img
                  src="/images/edition-c/studio-light.jpg"
                  width="1672"
                  height="941"
                  alt=""
                  fetchPriority="high"
                />
              </div>
              <div className="dw-hero-shade" />
              <div className="dl-hero-glow" />
              <LeafShadow className="dl-leaves dw-hero-leaves" />

              <div className="dw-hero-copy">
                <span className="dw-kicker">{hero.kicker}</span>
                <h1 id="dw-title" aria-label={hero.title}>
                  {heroLines.map((line, lineIndex) => (
                    <span className="dw-line" key={line} aria-hidden="true">
                      {tokens(line).map((token, index) => (
                        <span
                          key={index}
                          style={{ '--d': lineIndex * 4 + index } as Vars}
                        >
                          {token}
                        </span>
                      ))}
                    </span>
                  ))}
                </h1>
                <div className="dw-hero-lower">
                  <p>{hero.lead}</p>
                  <Actions tone="light" />
                  <p className="dl-sr-only">{agentLine}</p>
                  <div className="dw-agents" aria-hidden="true">
                    <span className="dw-agents-label">{hero.agentsLabel}</span>
                    {hero.agents.map((agent) => (
                      <span className="dw-agent" key={agent}>
                        {agent}
                      </span>
                    ))}
                    <span className="dw-agents-more">{hero.agentsMore}</span>
                  </div>
                </div>
              </div>

              <figure className="dw-hero-shot">
                <div className="dw-window">
                  <div className="dw-window-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>项目首页</span>
                  </div>
                  <picture>
                    <source
                      media="(max-width: 760px)"
                      srcSet="/images/daylight/work/phone.jpg"
                      width={390}
                      height={844}
                    />
                    <img
                      src="/images/daylight/work/home.jpg"
                      width="1440"
                      height="1000"
                      alt="Molis Work 项目首页：今天的工作、正在推进的目标和当天的事件"
                      fetchPriority="high"
                    />
                  </picture>
                </div>
                <figcaption>产品截图 · 演示数据</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 三个主场景 · 上午 */}
        <section
          id="scenarios"
          className="dw-scenarios"
          aria-labelledby="dw-scenarios-title"
        >
          <SectionHead
            id="dw-scenarios-title"
            kicker={scenariosIntro.kicker}
            title={scenariosIntro.title}
          />
          <div className="dw-features">
            <div className="dw-rail">
              <ol className="dw-rail-nav">
                {scenarios.map((scenario, index) => (
                  <li key={scenario.id}>
                    <a
                      href={`#scenario-${scenario.id}`}
                      aria-current={active === index ? 'true' : undefined}
                    >
                      <span>{index2(index)}</span>
                      {scenario.label}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="dw-rail-copy">
                {scenarios.map((scenario, index) => (
                  <div
                    key={scenario.id}
                    className={`dw-feature-copy${active === index ? ' is-active' : ''}`}
                    aria-hidden={active === index ? undefined : 'true'}
                  >
                    <ScenarioCopy scenario={scenario} index={index} inRail />
                  </div>
                ))}
              </div>
            </div>

            <div className="dw-panels">
              {scenarios.map((scenario, index) => {
                const { Visual, photo, size, caption } =
                  scenarioArt[scenario.id];
                return (
                  <article
                    key={scenario.id}
                    id={`scenario-${scenario.id}`}
                    className={`dw-panel dw-panel-${scenario.id}`}
                    data-scene="pass"
                    aria-label={scenario.label}
                  >
                    <figure className="dw-panel-frame">
                      <img
                        className="dw-panel-photo"
                        src={photo}
                        width={size[0]}
                        height={size[1]}
                        alt=""
                        loading="lazy"
                      />
                      <div className="dw-panel-shade" />
                      <Visual />
                      <figcaption>
                        <span>{index2(index)}</span>
                        {caption}
                      </figcaption>
                    </figure>
                    <div className="dw-panel-copy">
                      <ScenarioCopy scenario={scenario} index={index} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 四点不同 */}
        <section id="why" className="dw-why" aria-labelledby="dw-why-title">
          <SectionHead
            id="dw-why-title"
            kicker={differencesIntro.kicker}
            title={differencesIntro.title}
            lead={differencesIntro.lead}
          />
          <ol className="dw-pillars">
            {differences.map((difference, index) => (
              <li
                className="dw-pillar dl-reveal"
                key={difference.title}
                style={{ '--r': index % 2 } as Vars}
              >
                <div className="dw-pillar-meta">
                  <span className="dw-pillar-index">{index2(index)}</span>
                  <Tags status={difference.status} />
                </div>
                <h3>
                  <Phrases text={difference.title} />
                </h3>
                <p>{difference.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 结构图 */}
        <section className="dw-arch" aria-labelledby="dw-arch-title">
          <SectionHead id="dw-arch-title" title={architecture.title}>
            {architecture.body}
            <Tags status={architecture.status} />
          </SectionHead>

          <figure className="dw-arch-figure dl-reveal" data-scene="pass">
            <div className="dw-arch-sun" aria-hidden="true" />
            <LeafShadow className="dl-leaves dw-arch-leaves" />
            <div className="dw-arch-diagram">
              <ul className="dw-arch-entries">
                {architecture.entries.map((entry, index) => {
                  const Icon = entryIcons[index] ?? Blocks;
                  return (
                    <li
                      className="dw-node dw-node-entry"
                      key={entry.name}
                      style={{ '--r': index } as Vars}
                    >
                      <span className="dw-node-icon" aria-hidden="true">
                        <Icon size={17} />
                      </span>
                      <strong>{entry.name}</strong>
                      {entry.detail ? <small>{entry.detail}</small> : null}
                      <i className="dw-wire" aria-hidden="true" />
                    </li>
                  );
                })}
              </ul>
              <div
                className="dw-node dw-node-catalog"
                style={{ '--r': 4 } as Vars}
              >
                <Blocks size={20} aria-hidden="true" />
                <strong>{architecture.catalog}</strong>
              </div>
              <div className="dw-arch-row">
                <div
                  className="dw-node dw-node-lower"
                  style={{ '--r': 5 } as Vars}
                >
                  <i className="dw-wire dw-wire-up" aria-hidden="true" />
                  <i className="dw-wire" aria-hidden="true" />
                  <strong>{architecture.plugins}</strong>
                </div>
                <div
                  className="dw-node dw-node-lower"
                  style={{ '--r': 6 } as Vars}
                >
                  <i className="dw-wire dw-wire-up" aria-hidden="true" />
                  <i className="dw-wire" aria-hidden="true" />
                  <strong>{architecture.runtime}</strong>
                </div>
              </div>
              <div
                className="dw-node dw-node-base"
                style={{ '--r': 7 } as Vars}
              >
                <HardDrive size={18} aria-hidden="true" />
                <strong>{architecture.home}</strong>
              </div>
            </div>
            <figcaption>结构示意</figcaption>
          </figure>
        </section>

        {/* 更多场景 */}
        <section id="more" className="dw-more" aria-labelledby="dw-more-title">
          <SectionHead
            id="dw-more-title"
            kicker={moreIntro.kicker}
            title={moreIntro.title}
          />
          <div className="dw-cards">
            {moreScenarios.map((scenario, index) => {
              const { image, photo, Visual, caption } = moreArt[scenario.id];
              return (
                <article
                  className="dw-card dl-reveal"
                  key={scenario.id}
                  style={{ '--r': index % 2 } as Vars}
                  aria-labelledby={`dw-more-${scenario.id}`}
                >
                  <figure className={photo ? 'is-photo' : undefined}>
                    {image ? (
                      <img
                        className="dw-card-shot"
                        src={image}
                        width="1440"
                        height="1000"
                        alt=""
                        loading="lazy"
                      />
                    ) : null}
                    {photo ? (
                      <img
                        className="dw-card-photo"
                        src={photo.src}
                        width={photo.size[0]}
                        height={photo.size[1]}
                        alt=""
                        loading="lazy"
                      />
                    ) : null}
                    {Visual ? <Visual /> : null}
                    <figcaption>{caption}</figcaption>
                  </figure>
                  <div className="dw-card-copy">
                    <div className="dw-card-meta">
                      <span>{scenario.label}</span>
                      <Tags status={scenario.status} />
                    </div>
                    <h3 id={`dw-more-${scenario.id}`}>
                      <Phrases text={scenario.title} />
                    </h3>
                    <p className="dw-problem">{scenario.problem}</p>
                    <Points points={scenario.points} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 功能全景 */}
        <section
          id="features"
          className="dw-plugins"
          aria-labelledby="dw-features-title"
        >
          <SectionHead
            id="dw-features-title"
            kicker={featuresIntro.kicker}
            title={featuresIntro.title}
            lead={featuresIntro.lead}
          />
          <div className="dw-groups">
            {featureGroups.map((group) => (
              <FeatureGroup group={group} key={group.name} />
            ))}
          </div>
        </section>

        {/* 对比 · 午后 */}
        <section
          id="compare"
          className="dw-compare"
          aria-labelledby="dw-compare-title"
        >
          <SectionHead
            id="dw-compare-title"
            kicker={compareIntro.kicker}
            title={compareIntro.title}
            lead={compareIntro.lead}
          />
          <div className="dw-compare-table">
            <div className="dw-compare-cols" aria-hidden="true">
              <span>{labels.now}</span>
              <span>{labels.here}</span>
              <span>{labels.gap}</span>
            </div>
            {comparisons.map((row, index) => (
              <dl
                className="dw-compare-row dl-reveal"
                key={row.now}
                style={{ '--r': index } as Vars}
              >
                <div className="dw-compare-now">
                  <dt>{labels.now}</dt>
                  <dd>{row.now}</dd>
                </div>
                <div className="dw-compare-here">
                  <dt>{labels.here}</dt>
                  <dd>{row.here}</dd>
                </div>
                <div className="dw-compare-gap">
                  <dt>{labels.gap}</dt>
                  <dd>{row.gap}</dd>
                </div>
              </dl>
            ))}
          </div>
        </section>

        {/* 本地优先与边界 · 傍晚 */}
        <section
          id="local"
          className="dw-local"
          data-scene="pass"
          aria-labelledby="dw-local-title"
        >
          <div className="dw-local-sun" aria-hidden="true" />
          <div className="dw-local-inner">
            <figure className="dw-local-figure dl-reveal" data-scene="pass">
              <img
                className="dw-local-photo"
                src="/images/atelier/threshold.jpg"
                width="1440"
                height="900"
                alt=""
                loading="lazy"
              />
              <LeafShadow className="dl-leaves dw-local-leaves" />
              <Window
                className="dw-local-browser"
                src="/images/daylight/work/home.jpg"
                width={1440}
                height={1000}
                label="浏览器"
              />
              <Window
                className="dw-local-app"
                src="/images/daylight/work/home-dark.jpg"
                width={1440}
                height={1000}
                label="macOS App"
              />
              <figcaption>产品截图 · 场景示意</figcaption>
            </figure>
            <div className="dw-local-copy">
              <div className="dl-reveal">
                <span className="dl-eyebrow">{localFirst.kicker}</span>
                <h2 id="dw-local-title">
                  <MaskLines lines={lines(localFirst.title)} />
                </h2>
              </div>
              <ul>
                {localFirst.points.map((text, index) => {
                  const Icon = localIcons[index] ?? HardDrive;
                  return (
                    <li
                      className="dl-reveal"
                      key={text}
                      style={{ '--r': index } as Vars}
                    >
                      <span>
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <p>{text}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="dl-dusk dw-dusk">
        <div className="dl-dusk-glow" aria-hidden="true" />
        <div className="dw-dusk-invite dl-reveal">
          <h2>
            <MaskLines lines={closing.title} />
          </h2>
          <Actions tone="dusk" />
        </div>
        <div className="dl-wordmark dw-wordmark dl-reveal" aria-hidden="true">
          <span>Molis Work</span>
        </div>
        <div className="dl-dusk-meta">
          <Link href="/demos/brand/daylight" className="dl-footer-brand">
            <img
              src="/images/molis-logo.png"
              width="28"
              height="28"
              alt=""
              loading="lazy"
            />
            Molis AI
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
