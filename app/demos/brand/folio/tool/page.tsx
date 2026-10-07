'use client';
import {
  ArrowUpRight,
  Languages,
  Lightbulb,
  MousePointer2,
  NotebookPen,
  X,
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
import { Cuts } from '../art';
import { Closing, Phrases, ProductHero, SectionHead, pad } from '../kit';
import {
  Footer,
  HOME,
  SiteHeader,
  contactHref,
  useFolioMotion,
  type Vars,
} from '../shared';
import '../folio.css';
import '../kit.css';
import './tool.css';

// 文案来自 content/molis-tool.ts，五个方向共用。首屏是一段代码画的界面动画，压在剪纸上；
// 其余画面来自 molis-tool 的 v6 概念图板，标「概念图」。

const actionIcons = [Languages, Lightbulb, NotebookPen];

function Pointer({ className }: { className: string }) {
  return (
    <span className={className}>
      <MousePointer2 size={22} fill="currentColor" strokeWidth={1.4} />
    </span>
  );
}

/** 首屏动画：划出一句英文 → 句尾冒出三枚纸签 → 点「翻译」→ 带出处的小卡贴上来。一轮约 9 秒。 */
function CursorDemo() {
  return (
    <figure className="ft-demo" aria-label={demo.label}>
      <Cuts />
      <div className="ft-browser" aria-hidden="true">
        <span className="fo-tape fo-tape-a" />
        <div className="ft-browser-bar">
          <i />
          <i />
          <i />
          <span>{demo.url}</span>
        </div>
        <div className="ft-page">
          <h3 lang="en">{demo.heading}</h3>
          <p lang="en">
            {demo.before}
            <mark>
              {demo.selection}
              <Pointer className="ft-cursor ft-cursor-select" />
            </mark>
            {demo.after}
          </p>
          <div className="ft-pop">
            <div className="ft-chips">
              {demo.actions.map((action, index) => {
                const Icon = actionIcons[index];
                return (
                  <span
                    className="ft-chip"
                    key={action}
                    data-first={index === 0 || undefined}
                  >
                    <Icon size={14} />
                    {action}
                    {index === 0 ? (
                      <Pointer className="ft-cursor ft-cursor-click" />
                    ) : null}
                  </span>
                );
              })}
            </div>
            <div className="ft-card">
              <small>{demo.result.label}</small>
              <p>{demo.result.text}</p>
              <span>
                <ArrowUpRight size={12} />
                {demo.result.source}
              </span>
            </div>
          </div>
          <span className="ft-line" />
          <span className="ft-line" />
          <span className="ft-line ft-line-short" />
        </div>
      </div>
      <figcaption>{demo.note}</figcaption>
    </figure>
  );
}

export default function FolioToolPage() {
  const rootRef = useFolioMotion();

  return (
    <div className="fo-site ft-site" ref={rootRef}>
      <SiteHeader current="tool" />

      <main id="main">
        <ProductHero
          id="ft-title"
          className="ft-hero"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={[
            { label: hero.actions.follow, href: contactHref('tool') },
            {
              label: hero.actions.try,
              href: DROPAGENT_URL,
              external: true,
              tone: 'ghost',
            },
          ]}
          masthead="Tool"
          art={<CursorDemo />}
        />

        <section
          className="fo-section"
          data-bg="white"
          aria-labelledby="ft-shift-title"
        >
          <SectionHead
            id="ft-shift-title"
            kicker={shift.kicker}
            title={shift.title}
          />
          <table className="ft-compare">
            <thead>
              <tr>
                <td aria-hidden="true" />
                <th scope="col">{shift.labels.before}</th>
                <th scope="col">{shift.labels.after}</th>
              </tr>
            </thead>
            <tbody>
              {shift.rows.map((row, index) => (
                <tr
                  key={row.aspect}
                  data-reveal
                  style={{ '--i': index } as Vars}
                >
                  <th scope="row">{row.aspect}</th>
                  <td data-label={shift.labels.before}>{row.before}</td>
                  <td data-label={shift.labels.after}>{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section
          className="fo-section"
          data-bg="paper"
          aria-labelledby="ft-layers-title"
        >
          <SectionHead
            id="ft-layers-title"
            kicker={layers.kicker}
            title={layers.title}
          />
          <ol className="ft-layers">
            {layers.items.map((layer, index) => (
              <li
                key={layer.title}
                data-reveal
                style={{ '--i': index } as Vars}
              >
                <div className="ft-board">
                  <img
                    src={layer.image.src}
                    width={layer.image.w}
                    height={layer.image.h}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <span className="fo-index">{pad(index)}</span>
                <h3>{layer.title}</h3>
                <p>{layer.text}</p>
              </li>
            ))}
          </ol>
          <p className="fo-note">{boardNote}</p>
        </section>

        <section
          className="fo-section ft-moments"
          data-bg="pink"
          aria-labelledby="ft-moments-title"
        >
          <SectionHead
            id="ft-moments-title"
            kicker={moments.kicker}
            title={moments.title}
          />
          <ul className="ft-moment-grid">
            {moments.items.map((moment, index) => (
              <li
                key={moment.title}
                data-reveal
                style={{ '--i': index % 3 } as Vars}
              >
                <div className="ft-moment-shot">
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
          <p className="fo-note">{boardNote}</p>
        </section>

        <section
          className="fo-section"
          data-bg="navy"
          aria-labelledby="ft-promises-title"
        >
          <div className="fo-split">
            <SectionHead
              id="ft-promises-title"
              kicker={promises.kicker}
              title={promises.title}
            />
            <ol className="fo-list">
              {promises.items.map((item, index) => (
                <li
                  key={item.title}
                  data-reveal
                  style={{ '--i': index } as Vars}
                >
                  <span className="fo-index">{pad(index)}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="fo-section"
          data-bg="white"
          aria-labelledby="ft-merged-title"
        >
          <SectionHead
            id="ft-merged-title"
            kicker={merged.kicker}
            title={merged.title}
          />
          <ul className="ft-tools">
            {merged.items.map((item, index) => (
              <li
                key={item.title}
                data-reveal
                style={{ '--i': index % 3 } as Vars}
              >
                <strong>{item.title}</strong>
                {item.from ? <small>{item.from}</small> : null}
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="ft-available" data-reveal>
            {merged.available.label}
            {merged.available.links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.name}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            ))}
          </p>
        </section>

        <section
          className="fo-section ft-plugins"
          data-bg="yellow"
          aria-labelledby="ft-plugins-title"
        >
          <div className="fo-split">
            <SectionHead
              id="ft-plugins-title"
              kicker={plugins.kicker}
              title={plugins.title}
              lead={plugins.text}
            />
            <div className="ft-surfaces" data-reveal aria-hidden="true">
              <svg viewBox="0 0 400 400">
                <path d="M200 60V340M60 200H340" />
              </svg>
              <span className="ft-core">{plugins.core}</span>
              {plugins.surfaces.map((surface, index) => (
                <span
                  className="ft-surface"
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
          className="fo-section ft-not"
          data-bg="paper"
          aria-labelledby="ft-not-title"
        >
          <h2 id="ft-not-title" className="fo-kicker">
            {notThis.kicker}
          </h2>
          <ul>
            {notThis.items.map((item, index) => (
              <li key={item} data-reveal style={{ '--i': index } as Vars}>
                <span className="ft-x" aria-hidden="true">
                  <X size={20} strokeWidth={3} />
                </span>
                <span>
                  <Phrases text={item} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer>
        <Closing
          id="ft-closing-title"
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
