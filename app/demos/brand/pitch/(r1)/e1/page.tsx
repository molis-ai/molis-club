'use client';
import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  LayoutGrid,
  Smile,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { folioHomeCopy, folioStudio } from '../../../../../../content/folio';
import { lineImages, navLabels } from '../../../../../../content/studio';
import { GITHUB_URL } from '../../../../../../content/molis-work';
import { demo } from '../../../../../../content/molis-tool';
import { AiWordCycle } from '../../../ai-words';
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
  type NavKey,
  type Vars,
} from '../../_kit/kit';
import { findPitch } from '../../routes';
import { PitchBar } from '../../_kit/bar';
import { CrankWork } from './crank';
import { Doodle, Mascot, Stamp } from './ink';
import './e.css';

// E · 玩心造物：一个墨线小角色和一种颜色。它从字标后面探出头，五个同伴举着牌子当导航；
// Work 是一扇带摇柄的窗，转一格走一步；另外三件事是铅笔线描上的马克笔涂鸦；最后它举着问号回来。
// 内容与 Folio 首页同一份，只换视觉、版式与动效。

const icons: Record<NavKey, LucideIcon> = {
  products: LayoutGrid,
  solutions: Wrench,
  essays: BookOpen,
  community: Users,
  team: Smile,
};
const navIcon = (key: NavKey) => {
  const Icon = icons[key];
  return <Icon size={17} strokeWidth={1.7} aria-hidden="true" />;
};

/** 举牌的同伴：和顶栏同一组去处 */
const crew: { label: string; href: string }[] = [
  { label: navLabels.products, href: '#products' },
  { label: navLabels.solutions, href: SOLUTIONS },
  { label: folioStudio.nav.essays, href: ESSAYS },
  { label: navLabels.community, href: COMMUNITY },
  { label: folioStudio.labels.team.zh, href: ABOUT },
];

type ShelfId = 'tool' | 'life' | 'story';
const shelf: Record<
  ShelfId,
  { src: string; doodle: 'cursor' | 'list' | 'door'; note: string; alt: string }
> = {
  tool: {
    src: '/images/line-tools.jpg',
    doodle: 'cursor',
    note: '插画',
    alt: '',
  },
  life: {
    src: '/images/line-engineering.jpg',
    doodle: 'list',
    note: lineImages.life.note,
    alt: '概念稿：一双手在桌上搭起几座小房子。',
  },
  story: {
    src: '/images/line-experience.jpg',
    doodle: 'door',
    note: lineImages.story.note,
    alt: '概念画面：摊开的书页里长出一片山野。',
  },
};

export default function DirectionE() {
  const root = useStage();
  const work = folioStudio.work;
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const question = ending.title.slice(0, -1);
  const mark = ending.title.slice(-1);

  return (
    <>
      <div className="re" ref={root}>
        <Header p="re" home={findPitch('e1').href} icon={navIcon} />

        <main id="main">
          <section className="re-hero" data-parallax aria-labelledby="re-title">
            <span className="re-sun" aria-hidden="true" />
            <div className="re-mark-wrap">
              <Mascot pose="peek" className="re-peeker" />
              <h1 className="re-mark" id="re-title" aria-label="Molis AI">
                <span aria-hidden="true" lang="en">
                  {Array.from('Molis').map((letter, index) => (
                    <span key={index} style={{ '--i': index } as Vars}>
                      {letter}
                    </span>
                  ))}
                  <sup>AI</sup>
                </span>
              </h1>
            </div>
            <AiWordCycle prefix="re" />
            <p className="re-keys">
              {folioStudio.keywords.map((word, index) => (
                <Stamp
                  key={word}
                  tone={index === 1 ? 'apricot' : 'paper'}
                  className={`re-key re-key-${index}`}
                  style={{ '--i': index } as Vars}
                >
                  {word}
                </Stamp>
              ))}
            </p>
            <Link className="re-vertical" href={lineHref.work}>
              <span>{work.actions.more}</span>
              <svg viewBox="0 0 40 60" aria-hidden="true">
                <path d="M30 2 L30 46 L6 46 M14 36 L4 46 L14 56" />
              </svg>
            </Link>

            <nav className="re-crew" aria-label="举牌的同伴">
              {crew.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="re-crew-member"
                  style={{ '--i': index } as Vars}
                >
                  <span className="re-sign">{item.label}</span>
                  <Mascot pose="sign" variant={index} />
                </Link>
              ))}
            </nav>
          </section>

          <section
            className="re-products"
            id="products"
            aria-labelledby="re-products-title"
          >
            <h2 className="re-section-title" id="re-products-title">
              <span lang="en">{folioStudio.labels.products.en}</span>
              <small>{folioStudio.labels.products.zh}</small>
            </h2>

            <article
              className="re-work"
              id="work"
              aria-labelledby="re-work-title"
            >
              <div className="re-work-copy" data-reveal>
                <Stamp tone="ink" className="re-work-badge">
                  {work.kicker}
                </Stamp>
                <h3 id="re-work-title">
                  <Link href={lineHref.work} lang="en">
                    {work.name}
                    <span className="re-dot">.</span>
                  </Link>
                </h3>
                <p className="re-work-line">{folioHomeCopy.products.work}</p>
                <ul className="re-status" aria-label="当前状态">
                  {work.status.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="re-actions">
                  <Link className="re-button" href={lineHref.work}>
                    {work.actions.more}
                  </Link>
                  <a
                    className="re-link"
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {work.actions.github}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>
              <CrankWork />
            </article>

            <div className="re-shelf">
              {folioStudio.lines.map((line, index) => {
                const item = shelf[line.id];
                return (
                  <article
                    key={line.id}
                    id={line.id}
                    className={`re-thing re-thing-${line.id}`}
                    aria-labelledby={`re-${line.id}-title`}
                  >
                    <figure className="re-sticker" data-reveal>
                      <img
                        src={item.src}
                        width="1536"
                        height="1024"
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                      />
                      <Doodle kind={item.doodle} />
                      {line.id === 'tool' ? (
                        <span className="re-chips" aria-hidden="true">
                          {demo.actions.map((chip) => (
                            <i key={chip}>{chip}</i>
                          ))}
                        </span>
                      ) : null}
                      {line.id === 'story' ? (
                        <Mascot pose="wave" variant={3} className="re-cameo" />
                      ) : null}
                      <figcaption>{item.note}</figcaption>
                    </figure>
                    <div
                      className="re-thing-copy"
                      data-reveal
                      style={{ '--d': '120ms' } as Vars}
                    >
                      <Stamp
                        tone={index === 0 ? 'apricot' : 'paper'}
                        className="re-thing-num"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </Stamp>
                      <p className="re-thing-meta">
                        <span>{line.area}</span>
                        <span>{line.status}</span>
                      </p>
                      <h3 id={`re-${line.id}-title`}>
                        <Link href={lineHref[line.id]} lang="en">
                          {lineNames[line.id]}
                          <span className="re-dot">.</span>
                        </Link>
                      </h3>
                      <p className="re-thing-line">
                        {folioHomeCopy.products[line.id]}
                      </p>
                      <Link className="re-link" href={lineHref[line.id]}>
                        {line.more}
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>

        <footer className="re-end">
          <section className="re-ending" aria-labelledby="re-ending-title">
            <div className="re-ending-head" data-reveal>
              <Mascot pose="sign" variant={0} className="re-asker" />
              <span className="re-ask-sign" aria-hidden="true">
                ？
              </span>
              <h2 id="re-ending-title">
                {question}
                <span lang="en">{mark}</span>
              </h2>
            </div>
            <div className="re-tickets">
              <div className="re-ticket re-ticket-business" data-reveal>
                <div className="re-ticket-main">
                  <small>{contact.label}</small>
                  <h3>
                    {contact.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <div className="re-ticket-links">
                    <Link
                      className="re-button re-button-ink"
                      href={contactHref('enterprise')}
                    >
                      {contact.action}
                    </Link>
                    <Link className="re-link" href={SOLUTIONS}>
                      了解解决方案
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
                <span className="re-ticket-stub" aria-hidden="true">
                  <b lang="en">No.01</b>
                </span>
              </div>
              <div
                className="re-ticket"
                data-reveal
                style={{ '--d': '140ms' } as Vars}
              >
                <div className="re-ticket-main">
                  <small>{community.label}</small>
                  <h3>
                    {community.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <div className="re-ticket-links">
                    <Link className="re-button" href={COMMUNITY}>
                      {community.action}
                    </Link>
                    <Link className="re-link" href={LOGIN}>
                      {folioStudio.nav.login}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
                <span className="re-ticket-stub" aria-hidden="true">
                  <b lang="en">No.02</b>
                </span>
              </div>
            </div>
          </section>

          <div className="re-colophon">
            <div className="re-colophon-lead">
              <span className="re-colophon-brand">
                <img
                  src="/images/molis-logo.png"
                  width="34"
                  height="34"
                  alt=""
                  loading="lazy"
                />
                Molis AI
              </span>
              <p>{signature}</p>
            </div>
            <nav className="re-colophon-links" aria-label="页尾导航">
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
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
            <Mascot
              pose="stand"
              variant={4}
              className="re-sitter"
              look={false}
            />
            <div className="re-colophon-base">
              <span>{footer.copyright}</span>
              <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
            </div>
          </div>
        </footer>
      </div>
      <PitchBar id="e1" />
    </>
  );
}
