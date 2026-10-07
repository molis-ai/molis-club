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
import { Closing, Phrases, ProductHero, SectionHead, pad } from '../kit';
import {
  Footer,
  HOME,
  SiteHeader,
  contactHref,
  useNocturneMotion,
  type Vars,
} from '../shared';
import '../nocturne.css';
import '../kit.css';
import './tool.css';

// 文案来自 content/molis-tool.ts，五个方向共用。首屏是一段代码画的界面动画，
// 暗场里选区和光标发着光；其余画面来自 molis-tool 的 v6 概念图板，标「概念图」。

const actionIcons = [Languages, Lightbulb, NotebookPen];

function Pointer({ className }: { className: string }) {
  return (
    <span className={className}>
      <MousePointer2 size={20} fill="currentColor" strokeWidth={1.4} />
    </span>
  );
}

/** 首屏动画：选中一句英文 → 句尾浮出动作签 → 点「翻译」→ 小卡带着来源落下。一轮约 9 秒。 */
function CursorDemo() {
  return (
    <figure className="nc-demo" aria-label={demo.label}>
      <div className="nc-demo-window" aria-hidden="true">
        <div className="nc-demo-bar">
          <i />
          <i />
          <i />
          <span>{demo.url}</span>
        </div>
        <div className="nc-demo-page">
          <h3 lang="en">{demo.heading}</h3>
          <p lang="en">
            {demo.before}
            <mark>
              {demo.selection}
              <Pointer className="nc-cursor nc-cursor-select" />
            </mark>
            {demo.after}
          </p>
          <div className="nc-demo-pop">
            <div className="nc-demo-chips">
              {demo.actions.map((action, index) => {
                const Icon = actionIcons[index];
                return (
                  <span
                    className="nc-demo-chip"
                    key={action}
                    data-first={index === 0 || undefined}
                    style={{ '--i': index } as Vars}
                  >
                    <Icon size={13} />
                    {action}
                    {index === 0 ? (
                      <Pointer className="nc-cursor nc-cursor-click" />
                    ) : null}
                  </span>
                );
              })}
            </div>
            <div className="nc-demo-card">
              <small>{demo.result.label}</small>
              <p>{demo.result.text}</p>
              <span>
                <ArrowUpRight size={12} />
                {demo.result.source}
              </span>
            </div>
          </div>
          <span className="nc-demo-line" />
          <span className="nc-demo-line" />
          <span className="nc-demo-line" />
          <span className="nc-demo-line nc-demo-line-short" />
        </div>
      </div>
      <figcaption>{demo.note}</figcaption>
    </figure>
  );
}

export default function NocturneToolPage() {
  const rootRef = useNocturneMotion();

  return (
    <div className="nc-site nc-tool" ref={rootRef}>
      <div className="nc-grain" aria-hidden="true" />
      <SiteHeader current="tool" />

      <main id="main">
        <ProductHero
          id="nc-tool-title"
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
            {
              label: hero.actions.try,
              href: DROPAGENT_URL,
              external: true,
            },
          ]}
          visual={<CursorDemo />}
        />

        <section className="nc-section" aria-labelledby="nc-shift-title">
          <SectionHead
            id="nc-shift-title"
            kicker={shift.kicker}
            title={shift.title}
          />
          <table className="nc-compare">
            <thead>
              <tr>
                {['', shift.labels.before, shift.labels.after].map(
                  (label, index) => (
                    <th scope="col" key={index}>
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {shift.rows.map((row) => (
                <tr key={row.aspect} data-reveal>
                  <th scope="row">{row.aspect}</th>
                  <td data-label={shift.labels.before}>{row.before}</td>
                  <td data-label={shift.labels.after}>{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="nc-section" aria-labelledby="nc-layers-title">
          <SectionHead
            id="nc-layers-title"
            kicker={layers.kicker}
            title={layers.title}
          />
          <ol className="nc-layers">
            {layers.items.map((layer, index) => (
              <li
                key={layer.title}
                data-reveal
                style={{ '--r': index } as Vars}
              >
                <div className="nc-board">
                  <img
                    src={layer.image.src}
                    width={layer.image.w}
                    height={layer.image.h}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <span className="nc-index">{pad(index)}</span>
                <h3>{layer.title}</h3>
                <p>{layer.text}</p>
              </li>
            ))}
          </ol>
          <p className="nc-note">{boardNote}</p>
        </section>

        <section
          className="nc-section nc-panel"
          aria-labelledby="nc-moments-title"
        >
          <SectionHead
            id="nc-moments-title"
            kicker={moments.kicker}
            title={moments.title}
          />
          <ul className="nc-moments">
            {moments.items.map((moment, index) => (
              <li
                key={moment.title}
                data-reveal
                style={{ '--r': index % 3 } as Vars}
              >
                <div className="nc-board">
                  <img
                    src={moment.image.src}
                    width={moment.image.w}
                    height={moment.image.h}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <h3>{moment.title}</h3>
                <p>{moment.text}</p>
              </li>
            ))}
          </ul>
          <p className="nc-note">{boardNote}</p>
        </section>

        <section className="nc-section" aria-labelledby="nc-promises-title">
          <div className="nc-split">
            <SectionHead
              id="nc-promises-title"
              kicker={promises.kicker}
              title={promises.title}
              align="start"
            />
            <ol className="nc-promises">
              {promises.items.map((item, index) => (
                <li
                  key={item.title}
                  data-reveal
                  style={{ '--r': index % 2 } as Vars}
                >
                  <span className="nc-index">{pad(index)}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="nc-section nc-band"
          aria-labelledby="nc-merged-title"
        >
          <SectionHead
            id="nc-merged-title"
            kicker={merged.kicker}
            title={merged.title}
          />
          <ul className="nc-tools">
            {merged.items.map((item, index) => (
              <li
                key={item.title}
                data-reveal
                style={{ '--r': index % 3 } as Vars}
              >
                <strong>{item.title}</strong>
                {item.from ? <small>{item.from}</small> : null}
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="nc-available" data-reveal>
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

        <section className="nc-section" aria-labelledby="nc-plugins-title">
          <div className="nc-split nc-plugins">
            <div className="nc-head" data-align="start" data-reveal>
              <span className="nc-kicker">{plugins.kicker}</span>
              <h2 id="nc-plugins-title">
                <Phrases text={plugins.title} />
              </h2>
              <p>{plugins.text}</p>
            </div>
            <div className="nc-surfaces" data-reveal aria-hidden="true">
              <svg viewBox="0 0 400 400" className="nc-surface-wires">
                {[
                  [200, 60],
                  [340, 200],
                  [200, 340],
                  [60, 200],
                ].map(([x, y], index) => (
                  <g key={index}>
                    <line x1="200" y1="200" x2={x} y2={y} className="nc-wire" />
                    <line
                      x1="200"
                      y1="200"
                      x2={x}
                      y2={y}
                      className="nc-wire-flow"
                      style={{ '--i': index } as Vars}
                    />
                  </g>
                ))}
              </svg>
              <span className="nc-surface-core">{plugins.core}</span>
              {plugins.surfaces.map((surface, index) => (
                <span
                  className="nc-surface"
                  key={surface}
                  style={{ '--r': index } as Vars}
                >
                  {surface}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="nc-section nc-not" aria-labelledby="nc-not-title">
          <h2 id="nc-not-title" className="nc-kicker">
            {notThis.kicker}
          </h2>
          <ul>
            {notThis.items.map((item, index) => (
              <li key={item} data-reveal style={{ '--r': index } as Vars}>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer>
        <Closing
          id="nc-tool-closing"
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
