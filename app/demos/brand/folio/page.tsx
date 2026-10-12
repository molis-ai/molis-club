'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GITHUB_URL, INSTALL_URL } from '../../../../content/molis-work';
import { ending, lineImages, lineNames } from '../../../../content/studio';
import { AiWordCycle } from '../ai-words';
import { CoverArt, LifeArt, Star, StoryArt } from './art';
import { Actions, Phrases, Status, Tag, pad } from './kit';
import {
  COMMUNITY,
  ESSAYS,
  Footer,
  SiteHeader,
  WORK,
  WORLD,
  SOLUTIONS,
  contactHref,
  lineHref,
  useFolioMotion,
  type Vars,
} from './shared';
import './folio.css';
import './kit.css';
import './tool/tool.css';
import './home.css';
import {
  folioHomeCopy,
  folioStudio,
  folioTool,
} from '../../../../content/folio';
import { folioWorld } from '../../../../content/folio-world';
import { WorkDesk } from './work/desk';
import { CursorDemo } from './tool/cursor-demo';

// 首页保留刊头、剪纸封面、白纸叠压与三张色纸。白纸最上面是一句工作室身份说明（P1），
// Story 之后有一个 Molis World 的入口（A1，概念设计，不单独占一屏）；结尾从产品走到企业合作与社区（P1）。
// 团队与文章由导航进入各自的独立页面。

/** 区块标题：一个英文关键词配中文小字，下面一道墨线；需要时右边放一段说明 */
function Label({
  id,
  en,
  zh,
  children,
}: {
  id: string;
  en: string;
  zh: string;
  children?: ReactNode;
}) {
  return (
    <header className="fo-label" data-reveal>
      <h2 id={id}>
        <span lang="en">{en}</span>
        <small>{zh}</small>
      </h2>
      {children ? <div className="fo-label-side">{children}</div> : null}
    </header>
  );
}

/** 正文里的产品名用英文展示字体标出来，扫一眼就能抓到 */
function withNames(text: string) {
  return text
    .split(/(Molis (?:Work|Tool|Life|Story|World))/)
    .map((part, index) =>
      index % 2 ? (
        <span key={index} className="fo-studio-name" lang="en">
          {part}
        </span>
      ) : (
        part
      ),
    );
}

/** 工作室身份说明（P1）：一张单独的白纸压在封面上；主标题说我们是谁，左栏说想遇见谁，右栏是产品 */
function Studio() {
  const { studio } = folioHomeCopy;
  return (
    <section className="fo-studio" aria-labelledby="fo-studio-title">
      <span className="fo-kicker" data-reveal>
        {`${studio.label} · ${studio.labelZh}`}
      </span>
      <h2 id="fo-studio-title" className="fo-studio-title" data-reveal>
        {studio.title}
      </h2>
      <div className="fo-studio-row" data-reveal>
        <p className="fo-studio-view">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <Star x={12} y={12} r={11} />
          </svg>
          <span>
            <Phrases text={studio.view} />
          </span>
        </p>
        <p className="fo-studio-text">{withNames(studio.text)}</p>
      </div>
    </section>
  );
}

function CoreProduct() {
  const work = folioStudio.work;
  return (
    <div id="work" className="fo-core">
      <Label id="fo-products-title" {...folioStudio.labels.products} />
      <div className="fo-core-copy" data-reveal>
        <span className="fo-kicker">
          {pad(0)} · {work.kicker}
        </span>
        <h3>
          <Link href={WORK}>{work.name}</Link>
        </h3>
        <p className="fo-core-line">{folioHomeCopy.products.work}</p>
        <small className="fo-ask">{folioHomeCopy.asks.work}</small>
        <Status items={work.status} />
        <Actions
          items={[
            { label: work.actions.more, href: WORK },
            {
              label: work.actions.github,
              href: GITHUB_URL,
              external: true,
              tone: 'ghost',
            },
          ]}
        />
      </div>
      <WorkDesk />
    </div>
  );
}

/** Tool 用首屏那段光标动画，Life、Story 沿用原版剪纸 */
function LineArt({ id }: { id: 'tool' | 'life' | 'story' }) {
  if (id === 'tool') return <CursorDemo />;
  const Art = id === 'life' ? LifeArt : StoryArt;
  return <Art note={lineImages[id].note} />;
}

function Lines() {
  return (
    <div className="fo-lines">
      <div className="fo-stack">
        {folioStudio.lines.map((line, index) => (
          <article
            key={line.id}
            id={line.id}
            className={`fo-sheet fo-sheet-${line.id}`}
            data-scene="enter"
            aria-labelledby={`fo-line-${line.id}`}
          >
            <div className="fo-sheet-inner">
              <div className="fo-sheet-copy">
                <span className="fo-sheet-number" aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <div className="fo-sheet-meta">
                  <span>{folioHomeCopy.areas[line.id]}</span>
                  <span>{line.status}</span>
                </div>
                <h3 id={`fo-line-${line.id}`}>
                  <Link href={lineHref[line.id]}>{lineNames[line.id]}</Link>
                </h3>
                <p>{folioHomeCopy.products[line.id]}</p>
                <small className="fo-ask">{folioHomeCopy.asks[line.id]}</small>
                {line.id === 'tool' ? (
                  <small className="fo-sheet-note">
                    {folioTool.relation.home}
                    <Tag>{folioTool.relation.phase}</Tag>
                  </small>
                ) : null}
                <Link className="fo-sheet-more" href={lineHref[line.id]}>
                  {line.more}
                  <span aria-hidden="true">
                    <ArrowUpRight size={20} />
                  </span>
                </Link>
              </div>
              <LineArt id={line.id} />
            </div>
          </article>
        ))}
      </div>
      <WorldEntry />
    </div>
  );
}

/** Story 之后的 World 入口：一句过渡，一张小卡；World 还是概念，不单独占一屏 */
function WorldEntry() {
  return (
    <div id="world" className="fo-world-entry">
      <p className="fo-world-transition" data-reveal>
        <Phrases text={folioWorld.home.transition} />
      </p>
      <Link href={WORLD} className="fo-world-card" data-reveal>
        <span className="fo-world-status">{folioWorld.status}</span>
        <strong lang="en">{folioWorld.name}</strong>
        <span className="fo-world-line">{folioWorld.line}</span>
        <span className="fo-world-more">
          {folioWorld.home.more}
          <ArrowUpRight size={18} aria-hidden="true" />
        </span>
      </Link>
    </div>
  );
}

export default function FolioDirection() {
  const rootRef = useFolioMotion();
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const close = folioHomeCopy.ending;

  return (
    <div className="fo-site" ref={rootRef}>
      <SiteHeader />

      <main id="main">
        <section
          className="fo-cover"
          data-scene="leave"
          data-parallax
          aria-labelledby="fo-title"
        >
          <h1
            className="fo-masthead"
            id="fo-title"
            aria-label="Molis AI"
            lang="en"
          >
            {Array.from('Molis').map((letter, index) => (
              <span key={index} style={{ '--i': index } as Vars}>
                {letter}
              </span>
            ))}
            <sup>AI</sup>
          </h1>
          <div className="fo-cover-art">
            <CoverArt />
          </div>
          <div className="fo-cover-copy">
            <AiWordCycle prefix="fo" />
            <p className="fo-cover-keys">
              {folioStudio.keywords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </p>
          </div>
        </section>

        <Studio />

        <section id="products" aria-labelledby="fo-products-title">
          <CoreProduct />
          <Lines />
        </section>
      </main>

      <Footer>
        <section className="fo-ending" aria-labelledby="fo-ending-title">
          <h2 id="fo-ending-title" className="fo-ending-lead" data-reveal>
            <Phrases text={close.transition} />
          </h2>
          <div className="fo-back-paths fo-back-business-first">
            <div className="fo-back-path fo-back-cooperation">
              <small>{contact.label}</small>
              <h3>
                {contact.title.map((line) => (
                  <span className="fo-phrase" key={line}>
                    {line}
                  </span>
                ))}
              </h3>
              <div className="fo-back-links">
                <Link href={SOLUTIONS}>
                  {close.cooperation.more}{' '}
                  <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
                <Link
                  className="fo-cooperation-cta"
                  href={contactHref('enterprise')}
                >
                  {close.cooperation.contact}{' '}
                  <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="fo-back-path">
              <small>{community.label}</small>
              <h3>
                {community.title.map((line) => (
                  <span className="fo-phrase" key={line}>
                    {line}
                  </span>
                ))}
              </h3>
              <div className="fo-back-links">
                <Link href={COMMUNITY}>
                  {community.action}{' '}
                  <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
          <p className="fo-ending-also">
            <span>{close.also.label}</span>
            <a href={INSTALL_URL} target="_blank" rel="noreferrer">
              {close.also.install}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <Link href={ESSAYS}>
              {close.also.essays}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </p>
        </section>
      </Footer>
    </div>
  );
}
