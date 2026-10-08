'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GITHUB_URL } from '../../../../content/molis-work';
import {
  coreProduct,
  ending,
  lineImages,
  lines,
  linesIntro,
  team,
  type Line,
} from '../../../../content/studio';
import { CoverArt, LifeArt, StoryArt } from './art';
import { Actions, Phrases, Status, pad } from './kit';
import {
  COMMUNITY,
  Footer,
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
import { people, companies } from './team';
import { folioStudio } from '../../../../content/folio';
import { WorkDemo } from './work/demos';
import { CursorDemo } from './tool/cursor-demo';

// 保留 Claude 原版构图、叠页与成员交互；仅调整用户指定的产品说明和合作入口。

type Person = (typeof people)[number];

/** 一位成员：照片垫着色纸，悬停、键盘聚焦或点按照片时，旁边翻出写着经历的便笺 */
function PersonCard({
  index,
  image,
  imagePosition,
  personRole,
  experience,
  aside,
  tone,
}: Person & { index: number }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const noteId = `fo-person-note-${index}`;
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  return (
    <div
      className={`fo-person fo-tone-${tone}`}
      ref={root}
      data-open={open}
      data-reveal
      style={{ '--i': index } as Vars}
    >
      <button
        type="button"
        className="fo-person-photo"
        aria-expanded={open}
        aria-controls={noteId}
        aria-label={`认识团队里负责${personRole}的成员`}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <img
          src={image}
          width="160"
          height="160"
          alt=""
          loading="lazy"
          style={{ objectPosition: imagePosition }}
        />
      </button>
      <strong>{personRole}</strong>
      <em>{aside}</em>
      <p className="fo-person-note" id={noteId}>
        {experience}
      </p>
    </div>
  );
}

function CoreProduct() {
  const product = folioStudio.products[0];
  return (
    <section id="products" className="fo-core" aria-labelledby="fo-core-title">
      <div className="fo-core-copy" data-reveal>
        <span className="fo-kicker">{coreProduct.kicker}</span>
        <h2 id="fo-core-title">{coreProduct.name}</h2>
        <p className="fo-core-line">{product.line}</p>
        <ol className="fo-core-points">
          {coreProduct.highlights.map((item, index) => (
            <li key={item}>
              <span aria-hidden="true">{pad(index)}</span>
              {item}
            </li>
          ))}
        </ol>
        <Status items={coreProduct.status} />
        <Actions
          items={[
            { label: coreProduct.actions.more, href: WORK },
            {
              label: coreProduct.actions.github,
              href: GITHUB_URL,
              external: true,
              tone: 'ghost',
            },
          ]}
        />
      </div>
      <WorkDemo compact />
    </section>
  );
}

const lineArt: Record<
  Line['id'],
  (props: { note?: string }) => React.JSX.Element
> = { life: LifeArt, tool: CursorDemo, story: StoryArt };

function Lines() {
  return (
    <section id="lines" className="fo-lines" aria-labelledby="fo-lines-title">
      <header className="fo-lines-intro" data-reveal>
        <h2 id="fo-lines-title">
          <Phrases text={linesIntro.title} />
        </h2>
      </header>
      <div className="fo-stack">
        {lines.map((line, index) => {
          const Art = lineArt[line.id];
          const product = folioStudio.products.find(
            (item) => item.id === line.id,
          )!;
          return (
            <article
              key={line.id}
              className={`fo-sheet fo-sheet-${line.id}`}
              data-scene="enter"
              aria-labelledby={`fo-line-${line.id}`}
            >
              <div className="fo-sheet-inner">
                <div className="fo-sheet-copy">
                  <span className="fo-sheet-number" aria-hidden="true">
                    {pad(index)}
                  </span>
                  <div className="fo-sheet-meta">
                    <span>{line.area}</span>
                    <span>{line.status}</span>
                  </div>
                  <h3 id={`fo-line-${line.id}`}>
                    <Link href={lineHref[line.id]}>{line.name}</Link>
                  </h3>
                  <p>{product.line}</p>
                  <Link className="fo-sheet-more" href={lineHref[line.id]}>
                    {line.more}
                    <span aria-hidden="true">
                      <ArrowUpRight size={20} />
                    </span>
                  </Link>
                </div>
                {line.id === 'tool' ? (
                  <CursorDemo />
                ) : (
                  <Art note={lineImages[line.id].note} />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="about" className="fo-people" aria-labelledby="fo-people-title">
      <div className="fo-people-head" data-reveal>
        <span className="fo-kicker">{team.kicker}</span>
        <h2 id="fo-people-title">
          {team.title[0]}
          <br />
          {team.title[1]}
        </h2>
        <p>{team.text}</p>
      </div>

      <div className="fo-people-grid">
        {people.map((person, index) => (
          <PersonCard key={person.image} index={index} {...person} />
        ))}
      </div>

      <div className="fo-proof" aria-label="团队成员的职业经历">
        <p>{team.proof}</p>
        <div className="fo-logos">
          {companies.map((company) => (
            <span key={company.name} className={`fo-logo-${company.kind}`}>
              <img
                src={company.src}
                width={company.width}
                height={company.height}
                alt={company.name}
                loading="lazy"
              />
              {company.kind === 'linkedin' ? <b>LinkedIn</b> : null}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FolioDirection() {
  const rootRef = useFolioMotion();
  const { community, contact } = ending.paths;
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
          <div className="fo-masthead" aria-hidden="true" lang="en">
            {Array.from('Molis').map((letter, index) => (
              <span key={index} style={{ '--i': index } as Vars}>
                {letter}
              </span>
            ))}
            <sup>AI</sup>
          </div>
          <div className="fo-cover-art">
            <CoverArt />
          </div>
          <div className="fo-cover-copy">
            <h1 id="fo-title">
              <span className="fo-phrase">AI 工作台，</span>
              <span className="fo-phrase">和桌面小工具。</span>
            </h1>
            <p>
              我们是 Molis AI，一个做产品的团队。
              <br />让 AI 接住持续的工作、眼前的小事，也探索生活与故事。
            </p>
            <Actions
              items={[
                { label: '看看我们的产品', href: '#products' },
                { label: '认识团队', href: '#about', tone: 'ghost' },
              ]}
            />
          </div>
        </section>

        <CoreProduct />
        <Lines />
        <Team />
      </main>

      <Footer>
        <section className="fo-ending" aria-labelledby="fo-ending-title">
          <h2 id="fo-ending-title" data-reveal>
            {ending.title.slice(0, -1)}
            <span className="fo-back-mark">{mark}</span>
          </h2>
          <div className="fo-back-paths">
            <Link href={COMMUNITY} className="fo-back-path">
              <small>{community.label}</small>
              <h3>
                {community.title.map((line) => (
                  <span className="fo-phrase" key={line}>
                    {line}
                  </span>
                ))}
              </h3>
              <span>
                {community.action}
                <ArrowUpRight size={19} aria-hidden="true" />
              </span>
            </Link>
            <div className="fo-back-path fo-back-cooperation">
              <small>{contact.label}</small>
              <h3>
                {contact.title.map((line) => (
                  <span className="fo-phrase" key={line}>
                    {line}
                  </span>
                ))}
              </h3>
              <p>{folioStudio.enterprise}</p>
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
