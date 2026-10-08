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
  SectionHead,
  Phrases,
  ProductHero,
  pad,
} from '../kit';
import {
  Footer,
  HOME,
  SiteHeader,
  contactHref,
  useEditionMotion,
  type Vars,
} from '../shared';
import '../edition-c.css';
import '../kit.css';
import './tool.css';

// 文案来自 content/molis-tool.ts，五个方向共用。首屏是一段代码画的界面动画；
// 其余画面来自 molis-tool 的 v6 概念图板，标「概念图」。

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
    <figure className="et-demo" aria-label={demo.label}>
      <div className="et-browser" aria-hidden="true">
        <div className="et-browser-bar">
          <i />
          <i />
          <i />
          <span>{demo.url}</span>
        </div>
        <div className="et-page">
          <h3 lang="en">{demo.heading}</h3>
          <p lang="en">
            {demo.before}
            <mark>
              {demo.selection}
              <Pointer className="et-cursor et-cursor-select" />
            </mark>
            {demo.after}
          </p>
          <div className="et-pop">
            <div className="et-chips">
              <span className="et-chip-mark">
                <i />
              </span>
              {demo.actions.map((action, index) => {
                const Icon = actionIcons[index];
                return (
                  <span
                    className="et-chip"
                    key={action}
                    data-first={index === 0 || undefined}
                  >
                    <Icon size={13} />
                    {action}
                    {index === 0 ? (
                      <Pointer className="et-cursor et-cursor-click" />
                    ) : null}
                  </span>
                );
              })}
            </div>
            <div className="et-card">
              <small>{demo.result.label}</small>
              <p>{demo.result.text}</p>
              <span>
                <ArrowUpRight size={12} />
                {demo.result.source}
              </span>
            </div>
          </div>
          <span className="et-line" />
          <span className="et-line" />
          <span className="et-line" />
          <span className="et-line et-line-short" />
        </div>
      </div>
      <figcaption>{demo.note}</figcaption>
    </figure>
  );
}

export default function EditionCToolPage() {
  const siteRef = useEditionMotion();

  return (
    <div className="ec-site et-site" ref={siteRef}>
      <SiteHeader current="tool" />

      <main id="main">
        <ProductHero
          id="et-title"
          className="et-hero"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={[
            {
              label: hero.actions.follow,
              href: contactHref('tool'),
              tone: 'light',
            },
            {
              label: hero.actions.try,
              href: DROPAGENT_URL,
              external: true,
              tone: 'glass',
            },
          ]}
          visual={<CursorDemo />}
          wordmark="Molis Tool"
        />

        <section className="ep-section" aria-labelledby="et-shift-title">
          <SectionHead
            id="et-shift-title"
            kicker={shift.kicker}
            title={shift.title}
          />
          <Compare
            labels={['', shift.labels.before, shift.labels.after]}
            rows={shift.rows.map((row) => [row.aspect, row.before, row.after])}
          />
        </section>

        <section className="ep-section" aria-labelledby="et-layers-title">
          <SectionHead
            id="et-layers-title"
            kicker={layers.kicker}
            title={layers.title}
          />
          <ol className="et-layers">
            {layers.items.map((layer, index) => (
              <li
                key={layer.title}
                className="ec-reveal"
                style={{ '--r': index } as Vars}
              >
                <div className="et-board">
                  <img
                    src={layer.image.src}
                    width={layer.image.w}
                    height={layer.image.h}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <span className="ep-index">{pad(index)}</span>
                <h3>{layer.title}</h3>
                <p>{layer.text}</p>
              </li>
            ))}
          </ol>
          <p className="ep-note">{boardNote}</p>
        </section>

        <section
          className="ep-section ep-panel et-moments"
          aria-labelledby="et-moments-title"
        >
          <SectionHead
            id="et-moments-title"
            kicker={moments.kicker}
            title={moments.title}
          />
          <ul className="et-moment-grid">
            {moments.items.map((moment, index) => (
              <li
                key={moment.title}
                className="ec-reveal"
                style={{ '--r': index % 3 } as Vars}
              >
                <div className="et-moment-shot">
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
          <p className="ep-note">{boardNote}</p>
        </section>

        <section
          className="ep-section ep-band"
          aria-labelledby="et-promises-title"
        >
          <div className="ep-head ec-reveal" data-align="start">
            <span className="ec-eyebrow">{promises.kicker}</span>
            <h2 id="et-promises-title">
              <Phrases text={promises.title} />
            </h2>
          </div>
          <ol className="ep-promises">
            {promises.items.map((item, index) => (
              <li
                key={item.title}
                className="ec-reveal"
                style={{ '--r': index % 2 } as Vars}
              >
                <span className="ep-index">{pad(index)}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="ep-section" aria-labelledby="et-merged-title">
          <SectionHead
            id="et-merged-title"
            kicker={merged.kicker}
            title={merged.title}
          />
          <ul className="et-tools">
            {merged.items.map((item, index) => (
              <li
                key={item.title}
                className="ec-reveal"
                style={{ '--r': index % 3 } as Vars}
              >
                <strong>{item.title}</strong>
                {item.from ? <small>{item.from}</small> : null}
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="et-available ec-reveal">
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
          className="ep-section ep-panel et-plugins"
          aria-labelledby="et-plugins-title"
        >
          <div className="ep-split">
            <div className="ep-head ec-reveal" data-align="start">
              <span className="ec-eyebrow">{plugins.kicker}</span>
              <h2 id="et-plugins-title">
                <Phrases text={plugins.title} />
              </h2>
              <p>{plugins.text}</p>
            </div>
            <div className="et-surfaces ec-reveal" aria-hidden="true">
              <span className="et-core">{plugins.core}</span>
              {plugins.surfaces.map((surface, index) => (
                <span
                  className="et-surface"
                  key={surface}
                  style={{ '--r': index } as Vars}
                >
                  {surface}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="ep-section et-not" aria-labelledby="et-not-title">
          <h2 id="et-not-title" className="ec-eyebrow">
            {notThis.kicker}
          </h2>
          <ul>
            {notThis.items.map((item, index) => (
              <li
                key={item}
                className="ec-reveal"
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
          id="et-closing-title"
          title={closing.title}
          actions={[
            { label: closing.follow, href: contactHref('tool') },
            {
              label: closing.try,
              href: DROPAGENT_URL,
              external: true,
              tone: 'light',
            },
            { label: closing.home, href: HOME, tone: 'light' },
          ]}
        />
      </Footer>
    </div>
  );
}
