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
import { folioHomeCopy, folioStudio } from '../../../../../content/folio';
import { lineImages } from '../../../../../content/studio';
import { desk } from '../../../../../content/folio-work';
import { demo } from '../../../../../content/molis-tool';
import { GITHUB_URL } from '../../../../../content/molis-work';
import { AiWordCycle } from '../../ai-words';
import {
  ABOUT,
  COMMUNITY,
  CONTACT,
  ESSAYS,
  Header,
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
import { R4_A } from '../routes';
import { Painting } from './painting';
import './a.css';

// A · 暖纸与画框（第四轮）：画不用图片，在浏览器里一笔一笔画出来。
// 首屏是金色田野，Work 的窗口从画上升起；产品是一叠刊物——带油画报头的周报、阅读页、明信片、船票，
// 滚上来一张压一张；页底一直悬着一道弧边和 Work 的入口。内容与 Folio 首页同一份。

const work = folioStudio.work;
const lines = Object.fromEntries(
  folioStudio.lines.map((line) => [line.id, line]),
) as Record<'tool' | 'life' | 'story', (typeof folioStudio.lines)[number]>;
const toolIcons = [Languages, Lightbulb, NotebookPen];

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
    <ol className="wa-list" aria-label="四件产品">
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
                  {isWork ? work.kicker : `${line!.area} · ${line!.status}`}
                </p>
                <p className="wa-list-line">{folioHomeCopy.products[id]}</p>
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
          <span>{lines.story.area}</span>
          <span>{lines.story.status}</span>
        </div>
      </div>
      <p className="wa-sheet-note">{lineImages.story.note}</p>
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
  const question = ending.title.slice(0, -1);
  const mark = ending.title.slice(-1);

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
    <div className="wa" ref={root} data-painted={painted} data-end={atEnd}>
      <Header p="wa" home={R4_A} />

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
            </div>
          </div>
        </section>
      </main>

      <footer className="wa-end" ref={endRef}>
        <section className="wa-ending" aria-labelledby="wa-ending-title">
          <Painting scene="golden" className="wa-ending-paint" />
          <h2 id="wa-ending-title" data-reveal>
            {question}
            <span lang="en">{mark}</span>
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
                {contact.action}
              </Link>
              <Link className="wa-link" href={SOLUTIONS}>
                了解解决方案
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
              <Link className="wa-link" href={LOGIN}>
                {folioStudio.nav.login}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

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
          <nav className="wa-colophon-links" aria-label="页尾导航">
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
  );
}
