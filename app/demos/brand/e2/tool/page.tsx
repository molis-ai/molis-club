'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { folioTool } from '../../../../../content/folio';
import {
  closing,
  hero,
  layers,
  merged,
  moments,
  notThis,
  plugins,
  promises,
} from '../../../../../content/molis-tool';
import { COMMUNITY, HOME, WORK, contactHref, pad } from '../routes';
import {
  Actions,
  E2Page,
  Kicker,
  NextProduct,
  Phrases,
  SectionHead,
  Status,
  Tag,
  type Vars,
} from '../shell';
import { Moments } from './moments';
import { PluginStage } from './plugin';
import { LayerRelay } from './relay';
import { SelectDemo } from './select-demo';
import { Shift } from './shift';
import './tool.css';

// E2 · Molis Tool：最「轻」的一页。要让人觉得能力就在光标旁——选中，就地给出下一步，做完就消失。
// 所以没有大段滚动编排，动效都是光标与选区的小动作和「就地变化」：首屏可以自己点句子、点翻译；
// 三层是同一件事的接力；一天里的时刻点哪一行演哪一行；插件开关可以自己拨。
// 顺序与 Folio 最新版一致，只把「四个承诺」和「它不是什么」并成一段（是 / 不是），页面更短。
// 文案全部来自 content/molis-tool.ts 与 content/folio.ts 的 folioTool。

const TRY = `${COMMUNITY}#try`;
const { relation } = folioTool;

function Hero() {
  return (
    <section className="et-hero" aria-labelledby="et-title">
      <div className="et-hero-copy">
        <Kicker>{hero.kicker}</Kicker>
        <h1 id="et-title">
          <Phrases text={hero.title} />
        </h1>
        <p className="et-lead">{hero.lead}</p>
        <Status items={hero.status} />
        <Actions
          items={[
            { label: hero.actions.follow, href: contactHref('tool') },
            { label: folioTool.community.try, href: TRY, tone: 'ghost' },
          ]}
        />
      </div>
      <SelectDemo />
    </section>
  );
}

function Layers() {
  return (
    <section
      className="et-section et-layers"
      data-bg="paper"
      aria-labelledby="et-layers-title"
    >
      <SectionHead
        id="et-layers-title"
        index={1}
        kicker={layers.kicker}
        title={layers.title}
      />
      <LayerRelay />
    </section>
  );
}

function Day() {
  return (
    <section
      className="et-section et-day"
      data-bg="white"
      aria-labelledby="et-day-title"
    >
      <SectionHead
        id="et-day-title"
        index={2}
        kicker={moments.kicker}
        title={moments.title}
      />
      <Moments />
    </section>
  );
}

/** 是与不是：左边四个承诺，右边它不是什么 */
function Promises() {
  return (
    <section
      className="et-section et-promises"
      data-bg="paper"
      aria-labelledby="et-promises-title"
    >
      <div className="et-promises-grid">
        <div className="et-promises-main">
          <SectionHead
            id="et-promises-title"
            index={3}
            kicker={promises.kicker}
            title={promises.title}
          />
          <ol className="et-promise-list">
            {promises.items.map((item, index) => (
              <li
                key={item.title}
                data-reveal
                style={{ '--d': `${index * 80}ms` } as Vars}
              >
                <i aria-hidden="true">{pad(index)}</i>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <section className="et-not" aria-labelledby="et-not-title">
          <h2 id="et-not-title" data-reveal>
            {notThis.kicker}
          </h2>
          <ul>
            {notThis.items.map((item, index) => (
              <li
                key={item}
                data-reveal
                style={{ '--d': `${index * 80}ms` } as Vars}
              >
                <X size={14} strokeWidth={2} aria-hidden="true" />
                <span>
                  <Phrases text={item} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

/** 合进来的工具：画成菜单栏里展开的一块面板，六件小工具都住在里面；点菜单栏上的光标图标可以收起、展开 */
function Merged() {
  const [open, setOpen] = useState(true);
  return (
    <section
      className="et-section et-merged"
      data-bg="white"
      aria-labelledby="et-merged-title"
    >
      <SectionHead
        id="et-merged-title"
        index={4}
        kicker={merged.kicker}
        title={merged.title}
      />
      <figure className="e2-plate et-menu" data-reveal data-open={open}>
        <div className="e2-plate-body et-menu-body">
          <div className="et-menubar">
            <span className="et-menubar-left" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="et-menubar-right">
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <button
                type="button"
                className="et-menubar-icon"
                aria-expanded={open}
                aria-controls="et-menu-panel"
                aria-label={open ? '收起菜单栏面板' : '展开菜单栏面板'}
                onClick={() => setOpen((value) => !value)}
              >
                <svg viewBox="0 0 40 46" aria-hidden="true">
                  <path d="M8 2 L8 34 L16 26 L22 42 L28 40 L22 24 L34 24 Z" />
                </svg>
              </button>
            </span>
          </div>
          <div className="et-menu-drop">
            <ul className="et-menu-panel" id="et-menu-panel">
              {merged.items.map((item, index) => (
                <li
                  key={item.title}
                  data-from={item.from ? true : undefined}
                  style={{ '--d': `${index * 60}ms` } as Vars}
                >
                  <i aria-hidden="true">{pad(index)}</i>
                  <h3>{item.title}</h3>
                  {item.from ? <small>{item.from}</small> : null}
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <figcaption>
          <span>
            <b lang="en">Fig. 05</b>同一个菜单栏
          </span>
          <em>界面示意</em>
        </figcaption>
      </figure>
      <p className="et-available" data-reveal>
        <span>{merged.available.label}</span>
        {merged.available.links.map((link) => (
          <a key={link.name} href={link.href} target="_blank" rel="noreferrer">
            {link.name}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        ))}
        <Link href={TRY}>
          {folioTool.community.available}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}

function Plugins() {
  return (
    <section
      className="et-section et-plugins"
      data-bg="paper"
      aria-labelledby="et-plugins-title"
    >
      <div className="et-plugins-head">
        <SectionHead
          id="et-plugins-title"
          index={5}
          kicker={plugins.kicker}
          title={plugins.title}
        />
        <ol className="et-facts">
          {folioTool.plugins.facts.map((fact, index) => (
            <li
              key={fact.title}
              data-reveal
              style={{ '--d': `${index * 80}ms` } as Vars}
            >
              <i aria-hidden="true">{pad(index)}</i>
              <h3>{fact.title}</h3>
              <p>{fact.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <PluginStage />
    </section>
  );
}

/** 和 Molis Work 的关系：现在一条实线，以后一条虚线并标「规划中」 */
function Relation() {
  return (
    <section
      className="et-section et-relation"
      data-bg="white"
      aria-labelledby="et-relation-title"
    >
      <div className="et-relation-grid">
        <div className="e2-head-main" data-reveal>
          <span className="e2-head-meta">
            <i>{pad(6)}</i>
          </span>
          <h2 id="et-relation-title" className="et-relation-title">
            {relation.kicker}
          </h2>
        </div>
        <div className="et-relation-body">
          <ol className="et-timeline">
            <li data-reveal>
              <span className="et-timeline-dot" aria-hidden="true" />
              <p>{relation.now}</p>
            </li>
            <li data-reveal data-planned style={{ '--d': '120ms' } as Vars}>
              <span className="et-timeline-dot" aria-hidden="true" />
              <p>
                {relation.later}
                <Tag>{relation.phase}</Tag>
              </p>
            </li>
          </ol>
          <Link className="e2-link" href={WORK}>
            {relation.work}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** 结尾大句按标点成组；最后一组「给出对的一步。」像被选中一样划上淡底 */
const closingPhrases = closing.title.split(/(?<=[，、。：；？！])/);

function Closing() {
  return (
    <>
      <section className="et-closing" aria-labelledby="et-closing-title">
        <h2 id="et-closing-title" data-reveal>
          {closingPhrases.map((phrase, index) => (
            <span className="e2-phrase" key={index}>
              {index === closingPhrases.length - 1 ? (
                <span className="et-hl">{phrase}</span>
              ) : (
                phrase
              )}
            </span>
          ))}
        </h2>
        <Actions
          items={[
            { label: closing.follow, href: contactHref('tool') },
            { label: folioTool.community.try, href: TRY, tone: 'ghost' },
            { label: closing.home, href: HOME, tone: 'text' },
          ]}
        />
      </section>
      <NextProduct current="tool" />
    </>
  );
}

export default function E2ToolPage() {
  return (
    <E2Page current="tool" className="et" footer={<Closing />}>
      <Hero />
      <Shift />
      <Layers />
      <Day />
      <Promises />
      <Merged />
      <Plugins />
      <Relation />
    </E2Page>
  );
}
