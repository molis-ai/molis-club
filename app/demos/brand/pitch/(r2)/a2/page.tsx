'use client';
import Link from 'next/link';
import {
  ArrowUpRight,
  Check,
  Languages,
  Lightbulb,
  NotebookPen,
  Sparkles,
  Target,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { folioHomeCopy, folioStudio } from '../../../../../../content/folio';
import { lineImages } from '../../../../../../content/studio';
import { desk } from '../../../../../../content/folio-work';
import { demo } from '../../../../../../content/molis-tool';
import { GITHUB_URL } from '../../../../../../content/molis-work';
import { AiWordCycle } from '../../../ai-words';
import {
  AlsoLinks,
  COMMUNITY,
  CONTACT,
  ColophonLinks,
  Header,
  InkText,
  SOLUTIONS,
  contactHref,
  ending,
  footer,
  home,
  lineHref,
  lineIds,
  lineNames,
  signature,
  useStage,
  type Vars,
} from '../../_kit/kit';
import { findPitch } from '../../routes';
import { PitchBar } from '../../_kit/bar';
import { Painting } from './painting';
import './a.css';

// A · 暖纸与画框（第四轮）：画不用图片，在浏览器里一笔一笔画出来。
// 首屏是金色田野，Work 的窗口从画上升起；产品是一叠刊物——带油画报头的周报、阅读页、明信片、船票，
// 滚上来一张压一张，最后一张是还在构思的 World——一页铅笔速写；页底一直悬着一道弧边和 Work 的入口。
// 首屏之后是一页编者的话（工作室身份说明），正文随滚动逐字显影。内容与 Folio 首页同一份。

const work = folioStudio.work;
const lines = Object.fromEntries(
  folioStudio.lines.map((line) => [line.id, line]),
) as Record<'tool' | 'life' | 'story', (typeof folioStudio.lines)[number]>;
const toolIcons = [Languages, Lightbulb, NotebookPen];
const productNames = ['Molis Work', 'Molis Tool', 'Molis Life', 'Molis Story'];

/** 左边的列表跟着叠上来的那一张走：最后一张顶边过了视口 45% 的，就是当前这张 */
function useStack() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const sheets = Array.from(root.querySelectorAll<HTMLElement>('.wa-sheet'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let active = 0;
      sheets.forEach((sheet, index) => {
        if (sheet.getBoundingClientRect().top <= line) active = index;
      });
      if (root.dataset.step !== String(active))
        root.dataset.step = String(active);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);
  return ref;
}

/** 首屏升起的那扇 Work 窗口：静态的一页，完整的演示在下面的周报里 */
function WorkWindow() {
  return (
    <div className="wa-app" aria-hidden="true">
      <div className="wa-app-bar">
        <i />
        <i />
        <i />
        <span>Molis Work</span>
      </div>
      <div className="wa-app-body">
        <aside>
          {desk.dock.map((name) => (
            <span key={name} data-on={name === desk.plugin || undefined}>
              {name}
              {name === 'Inbox' ? <b>3</b> : null}
            </span>
          ))}
        </aside>
        <div className="wa-app-doc">
          <header>
            <span>
              <i />
              {desk.project}
            </span>
            <span>
              <Target size={11} />
              {desk.goal}
            </span>
          </header>
          <small>{desk.plugin}</small>
          <h4>{desk.heading}</h4>
          <p>{desk.typed}</p>
          <span className="wa-app-ghost" />
          <span className="wa-app-ghost" />
          <span className="wa-app-ghost wa-app-ghost-short" />
        </div>
        <div className="wa-app-card">
          <Sparkles size={12} />
          <strong>{desk.card.who}</strong>
          <span>{desk.card.context}</span>
        </div>
      </div>
    </div>
  );
}

function BriefList() {
  return (
    <ol className="wa-list" aria-label="产品">
      {lineIds.map((id, index) => {
        const isWork = id === 'work';
        const line = isWork ? null : lines[id];
        return (
          <li key={id}>
            <h3 id={`wa-${id}-title`}>
              <a href={`#${id}`}>
                <i lang="en">{String(index + 1).padStart(2, '0')}</i>
                <span>{lineNames[id]}</span>
              </a>
            </h3>
            <div className="wa-list-more">
              <div>
                <p className="wa-list-meta">
                  {isWork
                    ? work.kicker
                    : `${home.areas[line!.id]} · ${line!.status}`}
                </p>
                <p className="wa-list-line">{folioHomeCopy.products[id]}</p>
                <p className="wa-list-ask">{home.asks[id]}</p>
                {id === 'tool' ? (
                  <p className="wa-list-relation">
                    {home.relation.home}
                    <span>{home.relation.phase}</span>
                  </p>
                ) : null}
                {isWork ? (
                  <>
                    <ul className="wa-status" aria-label="当前状态">
                      {work.status.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="wa-list-links">
                      <Link className="wa-button" href={lineHref.work}>
                        {work.actions.more}
                      </Link>
                      <a
                        className="wa-link"
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {work.actions.github}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="wa-list-links">
                    <Link className="wa-link" href={lineHref[id]}>
                      {line!.more}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
      <li className="wa-list-world">
        <h3 id="wa-world-title">
          <a href="#world">
            <i lang="en">05</i>
            <span>{home.world.name}</span>
          </a>
        </h3>
        <div className="wa-list-more">
          <div>
            <p className="wa-list-meta">{home.world.status}</p>
            <p className="wa-list-line">{home.world.line}</p>
            <div className="wa-list-links">
              <Link className="wa-link" href={home.world.href}>
                {home.world.more}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </li>
    </ol>
  );
}

/** Work：一份带油画报头的周报。进入视口时，三条反馈带着出处落进来，助理的卡片盖上「已整理」 */
function WorkBrief() {
  return (
    <article
      className="wa-sheet wa-sheet-work"
      id="work"
      aria-labelledby="wa-work-title"
      data-reveal
    >
      <figure className="wa-mast" aria-label={desk.label}>
        <Painting scene="noon" />
        <span className="wa-mast-side wa-mast-left" aria-hidden="true">
          {desk.project}
        </span>
        <span className="wa-mast-side wa-mast-right" aria-hidden="true">
          {work.status[0]}
        </span>
        <span className="wa-mast-kicker" aria-hidden="true" lang="en">
          Molis Work · {desk.plugin}
        </span>
        <span className="wa-mast-title" aria-hidden="true">
          {desk.heading}
        </span>
      </figure>
      <div className="wa-brief-body" aria-hidden="true">
        <div className="wa-brief-main">
          <p className="wa-brief-meta">
            <Target size={12} />
            {desk.goal}
          </p>
          <p className="wa-brief-lede">{desk.typed}</p>
          <ul className="wa-brief-quotes">
            {desk.inserted.map((line, index) => (
              <li key={line} style={{ '--k': index } as Vars}>
                <span>“{line}”</span>
                <em>{desk.source}</em>
              </li>
            ))}
          </ul>
        </div>
        <aside className="wa-assist">
          <p className="wa-assist-head">
            <Sparkles size={12} />
            <strong>{desk.card.who}</strong>
            {desk.card.context}
          </p>
          <p>{desk.card.text}</p>
          <div className="wa-assist-foot">
            <span className="wa-assist-ask">
              <b>{desk.card.run}</b>
              {desk.card.skip}
            </span>
            <span className="wa-assist-done">
              <Check size={12} strokeWidth={3} />
              {desk.card.done}
              <u>{desk.card.undo}</u>
            </span>
          </div>
        </aside>
        <footer className="wa-brief-dock">
          {desk.dock.map((name) => (
            <span key={name} data-on={name === desk.plugin || undefined}>
              {name}
              {name === 'Inbox' ? <b>3</b> : null}
              {name === '待办' ? <b className="wa-plus">+2</b> : null}
            </span>
          ))}
        </footer>
      </div>
      <p className="wa-sheet-note">{desk.note}</p>
    </article>
  );
}

/** Tool：一页英文阅读，划出的一句旁边是三个动作，译文像便签一样贴上来 */
function ToolBrief() {
  return (
    <article
      className="wa-sheet wa-sheet-tool"
      id="tool"
      data-reveal
      aria-label={demo.label}
    >
      <figure className="wa-mast wa-mast-short" aria-hidden="true">
        <Painting scene="lake" />
        <span className="wa-url">{demo.url}</span>
      </figure>
      <div className="wa-read" aria-hidden="true">
        <h4 lang="en">{demo.heading}</h4>
        <p lang="en">
          {demo.before}
          <mark>{demo.selection}</mark>
          {demo.after}
        </p>
        <div className="wa-chips">
          {demo.actions.map((action, index) => {
            const Icon = toolIcons[index];
            return (
              <span key={action} data-first={index === 0 || undefined}>
                <Icon size={12} />
                {action}
              </span>
            );
          })}
        </div>
        <div className="wa-note-card">
          <small>{demo.result.label}</small>
          <p>{demo.result.text}</p>
          <span>
            <ArrowUpRight size={11} />
            {demo.result.source}
          </span>
        </div>
      </div>
      <p className="wa-sheet-note">{demo.note}</p>
    </article>
  );
}

function LifeCard() {
  return (
    <article
      className="wa-sheet wa-sheet-life"
      id="life"
      data-reveal
      aria-label={`${lineNames.life}：${folioHomeCopy.products.life}`}
    >
      <div className="wa-postcard">
        <Painting scene="dusk" />
        <span className="wa-stamp" aria-hidden="true">
          <span>{lines.life.status}</span>
        </span>
        <span className="wa-postmark" aria-hidden="true" lang="en">
          Molis Life
        </span>
        <p className="wa-postcard-line" aria-hidden="true">
          {folioHomeCopy.products.life}
        </p>
      </div>
      <p className="wa-sheet-note">{lineImages.life.note}</p>
    </article>
  );
}

function StoryCard() {
  return (
    <article
      className="wa-sheet wa-sheet-story"
      id="story"
      data-reveal
      aria-label={`${lineNames.story}：${folioHomeCopy.products.story}`}
    >
      <div className="wa-ticket">
        <div className="wa-ticket-face">
          <Painting scene="harbor" />
          <p className="wa-ticket-line" aria-hidden="true">
            {folioHomeCopy.products.story}
          </p>
        </div>
        <div className="wa-ticket-stub" aria-hidden="true">
          <small lang="en">Admit one</small>
          <strong lang="en">Molis Story</strong>
          <span>{home.areas.story}</span>
          <span>{lines.story.status}</span>
        </div>
      </div>
      <p className="wa-sheet-note">{lineImages.story.note}</p>
    </article>
  );
}

/** World：还在构思，所以是一页铅笔速写——一颗小星球，上面一间屋、一棵树、一扇门，盖着「概念设计」的章 */
function WorldCard() {
  return (
    <article
      className="wa-sheet wa-sheet-world"
      id="world"
      data-reveal
      aria-label={`${home.world.name}：${home.world.line}`}
    >
      <div className="wa-sketch">
        <svg viewBox="0 0 320 210" aria-hidden="true">
          <g className="wa-sketch-lines">
            <path
              pathLength={1}
              style={{ '--k': 0 } as Vars}
              d="M92 132 C 90 92 122 64 162 64 C 204 64 232 94 230 134 C 228 170 198 196 160 196 C 122 196 94 170 92 132 Z"
            />
            <path
              pathLength={1}
              style={{ '--k': 1 } as Vars}
              d="M40 150 C 70 172 250 128 282 104 C 300 90 270 84 236 92 M84 156 C 60 162 30 162 40 150"
            />
            <path
              pathLength={1}
              style={{ '--k': 2 } as Vars}
              d="M138 66 L138 42 L160 26 L182 42 L182 66 M152 66 L152 52 L166 52 L166 66"
            />
            <path
              pathLength={1}
              style={{ '--k': 3 } as Vars}
              d="M206 72 L206 50 M206 50 C 192 50 190 30 204 28 C 206 16 224 18 222 32 C 236 34 232 52 218 50 Z"
            />
            <path
              pathLength={1}
              style={{ '--k': 4 } as Vars}
              d="M112 108 C 124 100 136 112 148 104 M176 150 C 188 142 200 154 212 146 M130 164 C 140 158 150 168 160 162"
            />
            <path
              pathLength={1}
              style={{ '--k': 5 } as Vars}
              d="M262 40 L266 50 L276 52 L268 58 L270 68 L262 62 L254 68 L256 58 L248 52 L258 50 Z M64 70 L66 76 M60 73 L70 73"
            />
          </g>
          <circle className="wa-sketch-sun" cx="94" cy="44" r="10" />
        </svg>
        <span className="wa-sketch-stamp" aria-hidden="true">
          <span>{home.world.status}</span>
        </span>
        <p className="wa-sketch-line" aria-hidden="true">
          {home.world.transition}
        </p>
      </div>
      <p className="wa-sheet-note">{home.world.line}</p>
    </article>
  );
}

export default function DirectionA() {
  const root = useStage();
  const stack = useStack();
  const [painted, setPainted] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const endRef = useRef<HTMLElement>(null);
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const { studio, close } = home;

  // 走到结尾时，悬在页底的弧边与入口收起，不挡页尾
  useEffect(() => {
    const node = endRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setAtEnd(entry.isIntersecting),
      {
        rootMargin: '0px 0px -10% 0px',
      },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="wa" ref={root} data-painted={painted} data-end={atEnd}>
        <Header p="wa" home={findPitch('a2').href} />

        <main id="main">
          <section
            className="wa-hero"
            data-scene="leave"
            aria-labelledby="wa-title"
          >
            <Painting
              scene="morning"
              className="wa-hero-paint"
              duration={2600}
              onDone={() => setPainted(true)}
            />
            <div className="wa-hero-copy">
              <AiWordCycle prefix="wa" />
              <h1 className="wa-mark" id="wa-title" aria-label="Molis AI">
                <span aria-hidden="true" lang="en">
                  Molis<i>AI</i>
                </span>
              </h1>
              <p className="wa-keys">
                {folioStudio.keywords.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </p>
            </div>
            <div className="wa-rise">
              <WorkWindow />
            </div>
          </section>

          {/* 编者的话：工作室身份说明，像刊物开头的一页 */}
          <section
            className="wa-studio"
            data-scene="pass"
            aria-labelledby="wa-studio-title"
          >
            <p className="wa-studio-kicker" data-reveal>
              <span lang="en">{studio.label}</span>
              <i aria-hidden="true">&amp;</i>
              <span>{studio.labelZh}</span>
            </p>
            <h2 id="wa-studio-title" className="wa-studio-title" data-reveal>
              {studio.title}
            </h2>
            <div className="wa-studio-row">
              <p className="wa-studio-view" data-reveal>
                {studio.view}
              </p>
              <InkText
                className="wa-studio-text"
                text={studio.text}
                marks={productNames}
              />
            </div>
          </section>

          <section
            className="wa-brief"
            id="products"
            aria-labelledby="wa-products-title"
          >
            <header className="wa-brief-head" data-reveal>
              <h2 id="wa-products-title">
                <span lang="en">{folioStudio.labels.products.en}</span>
                <small>{folioStudio.labels.products.zh}</small>
              </h2>
            </header>
            <div className="wa-brief-grid" ref={stack} data-step="0">
              <BriefList />
              <div className="wa-pile">
                <WorkBrief />
                <ToolBrief />
                <LifeCard />
                <StoryCard />
                <WorldCard />
              </div>
            </div>
          </section>
        </main>

        <footer className="wa-end" ref={endRef}>
          <section className="wa-ending" aria-labelledby="wa-ending-title">
            <Painting scene="golden" className="wa-ending-paint" />
            <h2 id="wa-ending-title" data-reveal>
              {close.transition}
            </h2>
          </section>
          <div className="wa-letters">
            <div className="wa-letter wa-letter-business" data-reveal>
              <small>{contact.label}</small>
              <h3>
                {contact.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <div className="wa-letter-links">
                <Link
                  className="wa-button wa-button-light"
                  href={contactHref('enterprise')}
                >
                  {close.cooperation.contact}
                </Link>
                <Link className="wa-link" href={SOLUTIONS}>
                  {close.cooperation.more}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div
              className="wa-letter"
              data-reveal
              style={{ '--d': '120ms' } as Vars}
            >
              <small>{community.label}</small>
              <h3>
                {community.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <div className="wa-letter-links">
                <Link className="wa-button" href={COMMUNITY}>
                  {community.action}
                </Link>
              </div>
            </div>
          </div>
          <AlsoLinks p="wa" />

          <div className="wa-colophon">
            <div className="wa-colophon-lead">
              <span className="wa-postage" aria-hidden="true">
                <Painting scene="morning" duration={900} />
              </span>
              <div>
                <strong>Molis AI</strong>
                <p>{signature}</p>
              </div>
            </div>
            <ColophonLinks p="wa" />
            <div className="wa-colophon-base">
              <span>{footer.copyright}</span>
              <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
            </div>
          </div>
        </footer>

        <div className="wa-arc" aria-hidden="true" />
        <Link className="wa-dock" href={lineHref.work}>
          {work.actions.more}
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <PitchBar id="a2" />
    </>
  );
}
