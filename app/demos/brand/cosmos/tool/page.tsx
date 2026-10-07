'use client';
import {
  ArrowUpRight,
  Languages,
  Lightbulb,
  MousePointer2,
  NotebookPen,
} from 'lucide-react';
import {
  DROPAGENT_URL,
  boardNote,
  closing,
  demo,
  hero,
  layers,
  merged,
  moments,
  notThis,
  plugins,
  promises,
  shift,
} from '../../../../../content/molis-tool';
import {
  Closing,
  Compare,
  Ledger,
  Phrases,
  ProductHero,
  SectionHead,
  pad,
} from '../kit';
import Planet from '../planet';
import {
  Footer,
  HOME,
  SiteHeader,
  contactHref,
  useReveal,
  type Vars,
} from '../shared';
import '../cosmos.css';
import '../kit.css';
import './tool.css';

// 文案来自 content/molis-tool.ts，五个方向共用。Tool 是一颗带着探针的银蓝小卫星；
// 首屏是一段代码画的界面动画，其余画面来自 molis-tool 的 v6 概念图板，标「概念图」。

const actionIcons = [Languages, Lightbulb, NotebookPen];

function Pointer({ className }: { className: string }) {
  return (
    <span className={className}>
      <MousePointer2 size={20} fill="currentColor" strokeWidth={1.4} />
    </span>
  );
}

/** 首屏动画：选中一句英文 → 句尾出现动作签 → 点「翻译」→ 小卡带着来源出现。一轮约 9 秒。 */
function CursorDemo() {
  return (
    <figure className="cs-tool-demo" aria-label={demo.label}>
      <Planet kind="tool" className="cs-tool-moon" />
      <div className="cs-tool-window" aria-hidden="true">
        <div className="cs-tool-bar">
          <i />
          <i />
          <i />
          <span>{demo.url}</span>
        </div>
        <div className="cs-tool-page">
          <h3 lang="en">{demo.heading}</h3>
          <p lang="en">
            {demo.before}
            <mark>
              {demo.selection}
              <Pointer className="cs-tool-cursor cs-tool-cursor-select" />
            </mark>
            {demo.after}
          </p>
          <div className="cs-tool-pop">
            <div className="cs-tool-chips">
              <span className="cs-tool-chip-mark">
                <i />
              </span>
              {demo.actions.map((action, index) => {
                const Icon = actionIcons[index];
                return (
                  <span
                    className="cs-tool-chip"
                    key={action}
                    data-first={index === 0 || undefined}
                  >
                    <Icon size={13} />
                    {action}
                    {index === 0 ? (
                      <Pointer className="cs-tool-cursor cs-tool-cursor-click" />
                    ) : null}
                  </span>
                );
              })}
            </div>
            {/* 小卡和后面的正文叠在同一格里，窗口高度跟着较高的那个走 */}
            <div className="cs-tool-stack">
              <div className="cs-tool-rest">
                <span className="cs-tool-line" />
                <span className="cs-tool-line" />
                <span className="cs-tool-line" />
                <span className="cs-tool-line cs-tool-line-short" />
              </div>
              <div className="cs-tool-card">
                <small>{demo.result.label}</small>
                <p>{demo.result.text}</p>
                <span>
                  <ArrowUpRight size={12} />
                  {demo.result.source}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption>{demo.note}</figcaption>
    </figure>
  );
}

export default function CosmosToolPage() {
  const siteRef = useReveal();

  return (
    <div className="cs-site cs-tool" ref={siteRef}>
      <SiteHeader current="tool" />

      <main id="main">
        <ProductHero
          id="cs-tool-title"
          className="cs-tool-hero"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={[
            {
              label: hero.actions.follow,
              href: contactHref('tool'),
              tone: 'primary',
            },
            { label: hero.actions.try, href: DROPAGENT_URL, external: true },
          ]}
          visual={<CursorDemo />}
        />

        <section className="cs-section" aria-labelledby="cs-shift-title">
          <SectionHead
            id="cs-shift-title"
            kicker={shift.kicker}
            title={shift.title}
          />
          <Compare
            labels={['', shift.labels.before, shift.labels.after]}
            rows={shift.rows.map((row) => [row.aspect, row.before, row.after])}
          />
        </section>

        <section className="cs-section" aria-labelledby="cs-layers-title">
          <SectionHead
            id="cs-layers-title"
            kicker={layers.kicker}
            title={layers.title}
          />
          <ol className="cs-tool-layers">
            {layers.items.map((layer, index) => (
              <li
                key={layer.title}
                className="cs-reveal"
                style={{ '--r': index, '--rings': index + 1 } as Vars}
              >
                <span className="cs-tool-range" aria-hidden="true">
                  {Array.from({ length: index + 1 }, (_, ring) => (
                    <i key={ring} style={{ '--k': ring } as Vars} />
                  ))}
                </span>
                <div className="cs-tool-board">
                  <img
                    src={layer.image.src}
                    width={layer.image.w}
                    height={layer.image.h}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <span className="cs-index">{pad(index)}</span>
                <h3>{layer.title}</h3>
                <p>{layer.text}</p>
              </li>
            ))}
          </ol>
          <p className="cs-note">{boardNote}</p>
        </section>

        <section
          className="cs-section cs-band cs-tool-moments"
          aria-labelledby="cs-moments-title"
        >
          <SectionHead
            id="cs-moments-title"
            kicker={moments.kicker}
            title={moments.title}
          />
          <ul className="cs-tool-moment-grid">
            {moments.items.map((moment, index) => (
              <li
                key={moment.title}
                className="cs-reveal"
                style={{ '--r': index % 3 } as Vars}
              >
                <div className="cs-tool-moment-shot">
                  <img
                    src={moment.image.src}
                    width={moment.image.w}
                    height={moment.image.h}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <span className="cs-index">{pad(index)}</span>
                <h3>{moment.title}</h3>
                <p>{moment.text}</p>
              </li>
            ))}
          </ul>
          <p className="cs-note">{boardNote}</p>
        </section>

        <section
          className="cs-section cs-tool-promises"
          aria-labelledby="cs-promises-title"
        >
          <div className="cs-split">
            <div className="cs-head cs-reveal" data-align="start">
              <span className="cs-eyebrow">{promises.kicker}</span>
              <h2 id="cs-promises-title">
                <Phrases text={promises.title} />
              </h2>
            </div>
            <Ledger items={promises.items} />
          </div>
        </section>

        <section className="cs-section" aria-labelledby="cs-tools-title">
          <SectionHead
            id="cs-tools-title"
            kicker={merged.kicker}
            title={merged.title}
          />
          <ul className="cs-tool-tools">
            {merged.items.map((item, index) => (
              <li
                key={item.title}
                className="cs-reveal"
                style={{ '--r': index % 3 } as Vars}
              >
                <span className="cs-index">{pad(index)}</span>
                <strong>{item.title}</strong>
                {item.from ? <small>{item.from}</small> : null}
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="cs-tool-available cs-reveal">
            {merged.available.label}
            {merged.available.links.map((link, index) => (
              <span key={link.name}>
                {index > 0 ? ' · ' : null}
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.name}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </span>
            ))}
          </p>
        </section>

        <section
          className="cs-section cs-band cs-tool-plugins"
          aria-labelledby="cs-plugins-title"
        >
          <div className="cs-split">
            <div className="cs-head cs-reveal" data-align="start">
              <span className="cs-eyebrow">{plugins.kicker}</span>
              <h2 id="cs-plugins-title">
                <Phrases text={plugins.title} />
              </h2>
              <p>{plugins.text}</p>
            </div>
            <div className="cs-tool-orbit" data-reveal aria-hidden="true">
              <svg viewBox="0 0 100 100" className="cs-tool-orbit-lines">
                <circle cx="50" cy="50" r="38" />
                {[
                  [50, 12],
                  [88, 50],
                  [50, 88],
                  [12, 50],
                ].map(([x, y], index) => (
                  <g key={index}>
                    <line x1="50" y1="50" x2={x} y2={y} />
                    <line
                      className="cs-tool-signal"
                      x1="50"
                      y1="50"
                      x2={x}
                      y2={y}
                      style={{ '--i': index } as Vars}
                    />
                  </g>
                ))}
              </svg>
              <span className="cs-tool-core">{plugins.core}</span>
              {plugins.surfaces.map((surface, index) => (
                <span
                  className="cs-tool-surface"
                  key={surface}
                  style={{ '--i': index } as Vars}
                >
                  {surface}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          className="cs-section cs-tool-not"
          aria-labelledby="cs-not-title"
        >
          <h2 id="cs-not-title" className="cs-eyebrow">
            {notThis.kicker}
          </h2>
          <ul>
            {notThis.items.map((item, index) => (
              <li
                key={item}
                className="cs-reveal"
                style={{ '--r': index } as Vars}
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer>
        <Closing
          id="cs-tool-closing-title"
          title={closing.title}
          actions={[
            {
              label: closing.follow,
              href: contactHref('tool'),
              tone: 'primary',
            },
            { label: closing.try, href: DROPAGENT_URL, external: true },
            { label: closing.home, href: HOME },
          ]}
        />
      </Footer>
    </div>
  );
}
