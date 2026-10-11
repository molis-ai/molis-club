'use client';
import Link from 'next/link';
import { ArrowUpRight, Check, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  folioHomeCopy,
  folioSolutions,
  folioStudio,
} from '../../../../../content/folio';
import { lineImages, navLabels } from '../../../../../content/studio';
import { desk } from '../../../../../content/folio-work';
import { GITHUB_URL } from '../../../../../content/molis-work';
import { AiWordCycle } from '../../ai-words';
import {
  ABOUT,
  COMMUNITY,
  CONTACT,
  ESSAYS,
  LOGIN,
  SOLUTIONS,
  WIKI,
  contactHref,
  ending,
  footer,
  lineHref,
  lineIds,
  lineNames,
  signature,
  useStage,
  type Vars,
} from '../../r3/kit';
import { R4_E } from '../routes';
import { Pip, Room } from './iso';
import './e.css';

// E · 玩心造物（第四轮）：一间线描的工作室。首屏是切开的房间，四件产品是房间里的四组物件，点哪件跳到哪件；
// 往下，四件产品摊成四张牌；Work 再用四格漫画讲一遍它怎么干活；结尾是很大的一句提问。
// 墨线、白纸、一种杏橙。内容与 Folio 首页同一份。

const work = folioStudio.work;
const lines = Object.fromEntries(
  folioStudio.lines.map((line) => [line.id, line]),
) as Record<'tool' | 'life' | 'story', (typeof folioStudio.lines)[number]>;
const anchors = {
  work: '#work',
  tool: '#tool',
  life: '#life',
  story: '#story',
};
const suits = { work: 'W', tool: 'T', life: 'L', story: 'S' } as const;

/** 顶栏的线描小图标 */
const glyphs: Record<string, ReactNode> = {
  products: (
    <>
      <rect x="3" y="3" width="10" height="10" rx="1.5" />
      <rect
        x="17"
        y="3"
        width="10"
        height="10"
        rx="1.5"
        className="we-g-accent"
      />
      <rect x="3" y="17" width="10" height="10" rx="1.5" />
      <rect x="17" y="17" width="10" height="10" rx="1.5" />
    </>
  ),
  solutions: (
    <>
      <circle cx="7" cy="15" r="4" />
      <rect
        x="19"
        y="11"
        width="8"
        height="8"
        rx="1.5"
        className="we-g-accent"
      />
      <path d="M11 15 L19 15" />
      <path d="M7 3 L7 11 M23 19 L23 27" />
    </>
  ),
  essays: (
    <>
      <path d="M15 7 C 11 5 7 5 3 6 L3 25 C 7 24 11 24 15 26 Z" />
      <path
        d="M15 7 C 19 5 23 5 27 6 L27 25 C 23 24 19 24 15 26 Z"
        className="we-g-accent"
      />
    </>
  ),
  community: (
    <>
      <circle cx="9" cy="12" r="5" />
      <circle cx="21" cy="12" r="5" className="we-g-accent" />
      <path d="M3 26 C 4 20 14 20 15 26 M15 26 C 16 20 26 20 27 26" />
    </>
  ),
  team: (
    <>
      <circle cx="15" cy="15" r="11" />
      <circle cx="11" cy="13" r="1.4" className="we-g-fill" />
      <circle cx="19" cy="13" r="1.4" className="we-g-fill" />
      <path d="M10 18 C 12 21 18 21 20 18" />
    </>
  ),
};

function Glyph({ name }: { name: string }) {
  return (
    <svg className="we-glyph" viewBox="0 0 30 30" aria-hidden="true">
      {glyphs[name]}
    </svg>
  );
}

/** 顶栏：每一栏一个线描图标、一个名字、底下几行小字 */
function MegaHeader() {
  return (
    <header className="we-header">
      <Link href={R4_E} className="we-logo" aria-label="Molis AI 首页">
        <img src="/images/molis-logo.png" width="36" height="36" alt="" />
        <span lang="en">
          Molis
          <br />
          AI
        </span>
      </Link>
      <nav className="we-nav" aria-label="主导航">
        <div className="we-nav-block">
          <Glyph name="products" />
          <a className="we-nav-title" href="#products">
            {navLabels.products}
          </a>
          <ul>
            {lineIds.map((id) => (
              <li key={id}>
                <Link href={lineHref[id]} lang="en">
                  {lineNames[id].replace('Molis ', '')}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="we-nav-block">
          <Glyph name="solutions" />
          <Link className="we-nav-title" href={SOLUTIONS}>
            {navLabels.solutions}
          </Link>
          <ul aria-hidden="true">
            {folioSolutions.directions.map((direction) => (
              <li key={direction.id}>{direction.name}</li>
            ))}
          </ul>
        </div>
        <div className="we-nav-block">
          <Glyph name="essays" />
          <Link className="we-nav-title" href={ESSAYS}>
            {folioStudio.nav.essays}
          </Link>
        </div>
        <div className="we-nav-block">
          <Glyph name="community" />
          <Link className="we-nav-title" href={COMMUNITY}>
            {navLabels.community}
          </Link>
          <ul aria-hidden="true">
            <li lang="en">molis.club</li>
          </ul>
        </div>
        <div className="we-nav-block">
          <Glyph name="team" />
          <Link className="we-nav-title" href={ABOUT}>
            {folioStudio.labels.team.zh}
          </Link>
        </div>
      </nav>
      <div className="we-header-end">
        <Link href={LOGIN} className="we-login">
          {folioStudio.nav.login}
        </Link>
        <Link href={CONTACT} className="we-cta">
          {navLabels.contact}
        </Link>
      </div>
    </header>
  );
}

/** 四张牌：开始叠成一摞，滚动时摊开 */
function Deck() {
  return (
    <section
      className="we-deck"
      id="products"
      data-scene="pin"
      aria-labelledby="we-products-title"
    >
      <div className="we-deck-stage">
        <h2 className="we-deck-title" id="we-products-title">
          <span lang="en">{folioStudio.labels.products.en}</span>
          <small>{folioStudio.labels.products.zh}</small>
        </h2>
        <ul className="we-cards">
          {lineIds.map((id, index) => {
            const isWork = id === 'work';
            const meta = isWork
              ? work.kicker
              : `${lines[id].area} · ${lines[id].status}`;
            return (
              <li
                key={id}
                id={id}
                className={`we-card we-card-${id}`}
                style={{ '--i': index } as Vars}
              >
                <Link
                  href={lineHref[id]}
                  aria-labelledby={`we-${id}-name`}
                  aria-describedby={`we-${id}-line`}
                >
                  <span className="we-index" aria-hidden="true">
                    <b lang="en">{suits[id]}</b>
                    <i>{String(index + 1).padStart(2, '0')}</i>
                  </span>
                  <span className="we-index we-index-end" aria-hidden="true">
                    <b lang="en">{suits[id]}</b>
                    <i>{String(index + 1).padStart(2, '0')}</i>
                  </span>
                  <span className="we-card-art">
                    <Pip kind={id} />
                  </span>
                  {id === 'life' || id === 'story' ? (
                    <span className="we-card-note">{lineImages[id].note}</span>
                  ) : null}
                  <span className="we-card-meta">{meta}</span>
                  <strong id={`we-${id}-name`} lang="en">
                    {lineNames[id]}
                  </strong>
                  <span className="we-card-line" id={`we-${id}-line`}>
                    {folioHomeCopy.products[id]}
                  </span>
                  <span className="we-card-go" aria-hidden="true">
                    {isWork ? work.actions.more : lines[id].more}
                    <ArrowUpRight size={13} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Work 的四格漫画：写下一句 → 叮，助理递卡 → 咔哒，执行 → 反馈带着出处进来 */
function Comic() {
  return (
    <section className="we-comic" aria-labelledby="we-comic-title">
      <header className="we-comic-head" data-reveal>
        <span className="we-badge">{work.kicker}</span>
        <h2 id="we-comic-title" lang="en">
          {work.name}
        </h2>
        <p>{folioHomeCopy.products.work}</p>
        <ul className="we-status" aria-label="当前状态">
          {work.status.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </header>

      <ol className="we-panels" aria-label={desk.label}>
        <li className="we-panel" data-reveal style={{ '--d': '0ms' } as Vars}>
          <span className="we-caption">
            在 {desk.plugin} 写下「{desk.heading}」
          </span>
          <div className="we-panel-art" aria-hidden="true">
            <div className="we-sheetlet">
              <small>
                {desk.project} · {desk.goal}
              </small>
              <strong>{desk.heading}</strong>
              <p>
                {desk.typed}
                <i className="we-type-caret" />
              </p>
            </div>
          </div>
        </li>
        <li className="we-panel" data-reveal style={{ '--d': '160ms' } as Vars}>
          <span className="we-caption">
            Inbox 亮起 3，{desk.card.who}递来一张卡
          </span>
          <div className="we-panel-art" aria-hidden="true">
            <span className="we-burst">
              <span>叮</span>
            </span>
            <span className="we-inbox">
              Inbox <b>3</b>
            </span>
            <div className="we-bubble">
              <small>
                <Sparkles size={11} /> {desk.card.who} · {desk.card.context}
              </small>
              <p>{desk.card.text}</p>
            </div>
          </div>
        </li>
        <li className="we-panel" data-reveal style={{ '--d': '320ms' } as Vars}>
          <span className="we-caption">点一下「{desk.card.run}」</span>
          <div className="we-panel-art" aria-hidden="true">
            <span className="we-big-button">{desk.card.run}</span>
            <svg className="we-hand" viewBox="0 0 40 46">
              <path d="M8 2 L8 34 L16 26 L22 42 L28 40 L22 24 L34 24 Z" />
            </svg>
            <span className="we-burst we-burst-click">
              <span>咔</span>
            </span>
          </div>
        </li>
        <li className="we-panel" data-reveal style={{ '--d': '480ms' } as Vars}>
          <span className="we-caption">
            三条反馈带着出处进来，多了 2 个待办
          </span>
          <div className="we-panel-art" aria-hidden="true">
            <ul className="we-quotes">
              {desk.inserted.map((line) => (
                <li key={line}>
                  <span>“{line}”</span>
                  <em>{desk.source}</em>
                </li>
              ))}
            </ul>
            <span className="we-done">
              <Check size={13} strokeWidth={3} />
              {desk.card.done}
            </span>
            <span className="we-plus">+2</span>
          </div>
        </li>
      </ol>
      <div className="we-comic-foot">
        <p className="we-note">{desk.note}</p>
        <div className="we-actions">
          <Link className="we-button" href={lineHref.work}>
            {work.actions.more}
          </Link>
          <a
            className="we-link"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            {work.actions.github}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default function DirectionE() {
  const root = useStage();
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const question = ending.title.slice(0, -1);
  const mark = ending.title.slice(-1);

  return (
    <div className="we" ref={root}>
      <MegaHeader />

      <main id="main">
        <section className="we-hero" aria-labelledby="we-title">
          <div className="we-hero-copy">
            <h1 className="we-mark" id="we-title" aria-label="Molis AI">
              <span aria-hidden="true" lang="en">
                <span>MOLIS</span>
                <span>AI</span>
              </span>
            </h1>
            <div className="we-spec">
              <span className="we-spec-label" aria-hidden="true">
                A/I
              </span>
              <AiWordCycle prefix="we" />
            </div>
            <ol className="we-keys">
              {folioStudio.keywords.map((word, index) => (
                <li key={word}>
                  <i aria-hidden="true">{String(index + 1).padStart(2, '0')}</i>
                  <span>{word}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="we-hero-room">
            <Room hrefs={anchors} />
            <p className="we-hint" aria-hidden="true">
              点一点房间里的物件
            </p>
          </div>
        </section>

        <Deck />
        <Comic />
      </main>

      <footer className="we-end">
        <section className="we-ending" aria-labelledby="we-ending-title">
          <span className="we-moon" aria-hidden="true" />
          <h2 id="we-ending-title" data-reveal>
            {question.slice(0, 5)}
            <br />
            {question.slice(5)}
            <span lang="en">{mark}</span>
          </h2>
          <div className="we-blocks">
            <div className="we-block we-block-business" data-reveal>
              <small>{contact.label}</small>
              <h3>
                {contact.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <Link className="we-link" href={SOLUTIONS}>
                了解解决方案
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
              <Link className="we-vertical" href={contactHref('enterprise')}>
                <span>{contact.action}</span>
                <svg viewBox="0 0 40 60" aria-hidden="true">
                  <path d="M30 2 L30 46 L6 46 M14 36 L4 46 L14 56" />
                </svg>
              </Link>
            </div>
            <div
              className="we-block"
              data-reveal
              style={{ '--d': '140ms' } as Vars}
            >
              <small>{community.label}</small>
              <h3>
                {community.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <Link className="we-link" href={LOGIN}>
                {folioStudio.nav.login}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
              <Link className="we-vertical" href={COMMUNITY}>
                <span>{community.action}</span>
                <svg viewBox="0 0 40 60" aria-hidden="true">
                  <path d="M30 2 L30 46 L6 46 M14 36 L4 46 L14 56" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <div className="we-colophon">
          <div className="we-colophon-lead">
            <span className="we-colophon-brand" lang="en">
              Molis AI
            </span>
            <p>{signature}</p>
          </div>
          <nav className="we-colophon-links" aria-label="页尾导航">
            <div>
              <h2>{footer.productsLabel}</h2>
              <ul>
                {lineIds.map((id) => (
                  <li key={id}>
                    <Link href={lineHref[id]}>{lineNames[id]}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>{footer.studioLabel}</h2>
              <ul>
                <li>
                  <Link href={SOLUTIONS}>{footer.studio.solutions}</Link>
                </li>
                <li>
                  <Link href={ESSAYS}>{folioStudio.nav.essays}</Link>
                </li>
                <li>
                  <Link href={WIKI}>{folioStudio.nav.wiki}</Link>
                </li>
                <li>
                  <Link href={COMMUNITY}>{footer.studio.community}</Link>
                </li>
                <li>
                  <Link href={ABOUT}>{folioStudio.labels.team.zh}</Link>
                </li>
                <li>
                  <Link href={CONTACT}>{footer.studio.contact}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2>GitHub</h2>
              <ul>
                <li>
                  <a href={footer.github} target="_blank" rel="noreferrer">
                    github.com/molis-ai
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="we-colophon-base">
            <span>{footer.copyright}</span>
            <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
