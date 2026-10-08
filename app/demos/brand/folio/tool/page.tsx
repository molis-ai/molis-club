'use client';
import { ArrowUpRight, X } from 'lucide-react';
import {
  DROPAGENT_URL,
  closing,
  hero,
  layers,
  merged,
  moments,
  notThis,
  plugins,
  promises,
  shift,
} from '../../../../../content/molis-tool';
import { CursorDemo } from './cursor-demo';
import { LayerStory, ToolMoments, PluginDemo } from './demos';
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

// 首屏沿用 Claude 原版。只替换三层、使用场景的截图和插件能力示意。

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
          <LayerStory />
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
          <ToolMoments />
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
            <PluginDemo />
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
