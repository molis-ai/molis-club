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
import { Closing, ProductHero, SectionHead } from '../kit';
import {
  Footer,
  HOME,
  LeafShadow,
  SiteHeader,
  contactHref,
  pad,
  trackSpotlight,
  useDaylight,
  type Vars,
} from '../shared';
import '../daylight.css';
import '../kit.css';
import './tool.css';

// 文案来自 content/molis-tool.ts，五个方向共用。首屏是一段代码画的界面动画，浮在清晨的桌面上；
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
    <figure className="dl-demo" aria-label={demo.label}>
      <figcaption>{demo.note}</figcaption>
      <div className="dl-demo-window" aria-hidden="true">
        <div className="dl-window-bar">
          <i />
          <i />
          <i />
          <span>{demo.url}</span>
        </div>
        <div className="dl-demo-page">
          <h3 lang="en">{demo.heading}</h3>
          <p lang="en">
            {demo.before}
            <mark>
              {demo.selection}
              <Pointer className="dl-cursor dl-cursor-select" />
            </mark>
            {demo.after}
          </p>
          <div className="dl-demo-pop">
            <div className="dl-demo-chips">
              <span className="dl-demo-mark">
                <i />
              </span>
              {demo.actions.map((action, index) => {
                const Icon = actionIcons[index];
                return (
                  <span
                    className="dl-demo-chip"
                    key={action}
                    data-first={index === 0 || undefined}
                  >
                    <Icon size={13} />
                    {action}
                    {index === 0 ? (
                      <Pointer className="dl-cursor dl-cursor-click" />
                    ) : null}
                  </span>
                );
              })}
            </div>
            <div className="dl-demo-rest">
              <span className="dl-demo-line" />
              <span className="dl-demo-line" />
              <span className="dl-demo-line" />
              <span className="dl-demo-line dl-demo-line-short" />
            </div>
            <div className="dl-demo-card">
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
    </figure>
  );
}

export default function DaylightToolPage() {
  const siteRef = useDaylight();

  return (
    <div className="dl-site dl-tool" ref={siteRef}>
      <SiteHeader current="tool" />

      <main id="main">
        <ProductHero
          id="dl-tool-title"
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
          image={{
            src: '/images/edition-c/making-study.jpg',
            w: 1536,
            h: 1024,
            position: '40% 50%',
          }}
          visual={<CursorDemo />}
        />

        <section className="dl-section" aria-labelledby="dl-shift-title">
          <SectionHead
            id="dl-shift-title"
            kicker={shift.kicker}
            title={shift.title}
          />
          <div className="dl-tool-compare dl-reveal">
            <table>
              <thead>
                <tr>
                  <td aria-hidden="true" />
                  <th scope="col">{shift.labels.before}</th>
                  <th scope="col">{shift.labels.after}</th>
                </tr>
              </thead>
              <tbody>
                {shift.rows.map((row) => (
                  <tr key={row.aspect}>
                    <th scope="row">{row.aspect}</th>
                    <td data-label={shift.labels.before}>{row.before}</td>
                    <td data-label={shift.labels.after}>{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dl-section" aria-labelledby="dl-layers-title">
          <SectionHead
            id="dl-layers-title"
            kicker={layers.kicker}
            title={layers.title}
          />
          <ol className="dl-pillars dl-tool-layers">
            {layers.items.map((layer, index) => (
              <li key={layer.title} style={{ '--r': index } as Vars}>
                <div className="dl-shot dl-reveal">
                  <img
                    src={layer.image.src}
                    width={layer.image.w}
                    height={layer.image.h}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <div className="dl-pillar dl-reveal">
                  <span className="dl-index">{pad(index)}</span>
                  <h3>{layer.title}</h3>
                  <p>{layer.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="dl-note">{boardNote}</p>
        </section>

        <section className="dl-section" aria-labelledby="dl-moments-title">
          <SectionHead
            id="dl-moments-title"
            kicker={moments.kicker}
            title={moments.title}
          />
          <ul className="dl-tool-moments">
            {moments.items.map((moment, index) => (
              <li
                key={moment.title}
                className="dl-reveal"
                style={{ '--r': index % 3 } as Vars}
              >
                <div className="dl-tool-moment-shot">
                  <img
                    src={moment.image.src}
                    width={moment.image.w}
                    height={moment.image.h}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <span className="dl-index">{pad(index)}</span>
                <h3>{moment.title}</h3>
                <p>{moment.text}</p>
              </li>
            ))}
          </ul>
          <p className="dl-note">{boardNote}</p>
        </section>

        <section className="dl-section" aria-labelledby="dl-promises-title">
          <div className="dl-band dl-split">
            <LeafShadow className="dl-leaves" />
            <SectionHead
              id="dl-promises-title"
              kicker={promises.kicker}
              title={promises.title}
            />
            <ol className="dl-pillars" style={{ '--cols': 2 } as Vars}>
              {promises.items.map((item, index) => (
                <li
                  key={item.title}
                  className="dl-pillar dl-reveal"
                  style={{ '--r': index % 2 } as Vars}
                >
                  <span className="dl-index">{pad(index)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="dl-section" aria-labelledby="dl-merged-title">
          <SectionHead
            id="dl-merged-title"
            kicker={merged.kicker}
            title={merged.title}
          />
          <ul className="dl-tool-tools">
            {merged.items.map((item, index) => (
              <li
                key={item.title}
                className="dl-reveal"
                style={{ '--r': index % 3 } as Vars}
                onPointerMove={trackSpotlight}
              >
                <strong>{item.title}</strong>
                {item.from ? <small>{item.from}</small> : null}
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="dl-tool-available dl-reveal">
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
          className="dl-section dl-split dl-tool-plugins"
          aria-labelledby="dl-plugins-title"
        >
          <SectionHead
            id="dl-plugins-title"
            kicker={plugins.kicker}
            title={plugins.title}
            lead={plugins.text}
          />
          <div className="dl-tool-surfaces dl-reveal" aria-hidden="true">
            <span className="dl-tool-orbit" />
            <span className="dl-tool-core">{plugins.core}</span>
            {plugins.surfaces.map((surface, index) => (
              <span
                className="dl-tool-surface"
                key={surface}
                style={{ '--r': index } as Vars}
              >
                <span>{surface}</span>
              </span>
            ))}
          </div>
        </section>

        <section
          className="dl-evening"
          data-scene="pass"
          aria-labelledby="dl-not-title"
        >
          <div className="dl-evening-sun" aria-hidden="true" />
          <LeafShadow className="dl-leaves" />
          <div className="dl-evening-inner dl-tool-not">
            <h2 id="dl-not-title" className="dl-eyebrow">
              {notThis.kicker}
            </h2>
            <ul>
              {notThis.items.map((item, index) => (
                <li
                  key={item}
                  className="dl-reveal"
                  style={{ '--r': index } as Vars}
                >
                  <i aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer wordmark="Molis Tool">
        <Closing
          id="dl-tool-closing"
          title={closing.title}
          actions={[
            { label: closing.follow, href: contactHref('tool') },
            {
              label: closing.try,
              href: DROPAGENT_URL,
              external: true,
              tone: 'line',
            },
            { label: closing.home, href: HOME, tone: 'line' },
          ]}
        />
      </Footer>
    </div>
  );
}
