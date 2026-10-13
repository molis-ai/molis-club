'use client';
import Link from 'next/link';
import { ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { folioHomeCopy, folioStudio } from '../../../../content/folio';
import { desk } from '../../../../content/folio-work';
import { GITHUB_URL } from '../../../../content/molis-work';
import { ending, lineImages, lineNames } from '../../../../content/studio';
import { AiWordCycle } from '../ai-words';
import { Pip, Room } from './home-room';
import {
  COMMUNITY,
  LOGIN,
  SOLUTIONS,
  WORK,
  contactHref,
  productHref,
} from './routes';
import { E2Page, type Vars } from './shell';
import './home.css';

// E2 首页：原样沿用第四轮 E（r4/e，现为比稿 E · 二稿）的设计——线描工作室首屏、四张牌、Work 四格漫画、很大的一句提问。
// 字体换成整站的圆润字体；链接都指向 E2 自己的页面；顶栏与页尾用整站共用的那一份。

const lineIds = ['work', 'tool', 'life', 'story'] as const;
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
                  href={productHref[id]}
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
          <Link className="we-button" href={WORK}>
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

/** 结尾：一句很大的提问，两个大方块，各带一个竖排入口 */
function Ending() {
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const question = ending.title.slice(0, -1);
  const mark = ending.title.slice(-1);
  return (
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
  );
}

export default function E2Home() {
  return (
    <E2Page className="we" footer={<Ending />}>
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
    </E2Page>
  );
}
