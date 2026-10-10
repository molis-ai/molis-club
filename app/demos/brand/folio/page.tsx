'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GITHUB_URL } from '../../../../content/molis-work';
import { ending, lineImages, lineNames } from '../../../../content/studio';
import { AiWordCycle } from '../ai-words';
import { CoverArt, LifeArt, StoryArt } from './art';
import { Actions, Status, pad } from './kit';
import {
  COMMUNITY,
  Footer,
  LOGIN,
  SiteHeader,
  WORK,
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
import { folioHomeCopy, folioStudio } from '../../../../content/folio';
import { WorkDesk } from './work/desk';
import { CursorDemo } from './tool/cursor-demo';

// 首页保留刊头、剪纸封面、白纸叠压与三张色纸，产品之后直接接社区与合作。
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
                  <span>{line.area}</span>
                  <span>{line.status}</span>
                </div>
                <h3 id={`fo-line-${line.id}`}>
                  <Link href={lineHref[line.id]}>{lineNames[line.id]}</Link>
                </h3>
                <p>{folioHomeCopy.products[line.id]}</p>
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
    </div>
  );
}

export default function FolioDirection() {
  const rootRef = useFolioMotion();
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const mark = ending.title.slice(-1);

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

        <section id="products" aria-labelledby="fo-products-title">
          <CoreProduct />
          <Lines />
        </section>
      </main>

      <Footer>
        <section className="fo-ending" aria-labelledby="fo-ending-title">
          <h2 id="fo-ending-title" data-reveal>
            {ending.title.slice(0, -1)}
            <span className="fo-back-mark">{mark}</span>
          </h2>
          <div className="fo-back-paths">
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
                <Link href={LOGIN}>
                  {folioStudio.nav.login}{' '}
                  <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
              </div>
            </div>
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
                  了解解决方案 <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
                <Link href={contactHref('enterprise')}>
                  {contact.action} <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Footer>
    </div>
  );
}
