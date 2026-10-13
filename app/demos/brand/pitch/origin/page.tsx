'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { folioHomeCopy, folioStudio } from '../../../../../content/folio';
import {
  GITHUB_URL,
  hero as workHero,
} from '../../../../../content/molis-work';
import { demo as toolDemo } from '../../../../../content/molis-tool';
import { jobs as lifeJobs } from '../../../../../content/molis-life';
import { journey as storyJourney } from '../../../../../content/molis-story';
import { AiWordCycle } from '../../ai-words';
import {
  AlsoLinks,
  COMMUNITY,
  CONTACT,
  ColophonLinks,
  Header,
  SOLUTIONS,
  contactHref,
  ending,
  footer,
  home,
  lineHref,
  lineNames,
  signature,
  withNames,
  type Vars,
} from '../_kit/kit';
import { PitchBar } from '../_kit/bar';
import { findPitch } from '../routes';
import { hero, visualNotes } from './copy';
import { Motion, SideScale, type Mark } from './chrome';
import { Ruler } from './ruler';
import { LifeDial, StoryArches, ToolCursor, WorkRelay } from './visuals';
import './origin.css';

// 零点：一把尺，一个温暖的零点——技术回到人的尺度。
// 首屏是字标与三个关键词，下面一把刻度尺，零点对齐字标左缘，鼠标靠近处的刻度被抬高。
// 工作室说明停在视口里随滚动逐字显影；四件产品各用线和点画一张示意图；
// World 是尺子之外还没量过的一段；结尾从产品走到企业合作与社区。内容与 Folio 首页同一份。

const HOME = findPitch('origin').href;

const marks: Mark[] = [
  { id: 'top', index: '00', label: '零点' },
  { id: 'studio', index: '01', label: '工作室' },
  { id: 'products', index: '02', label: '产品' },
  { id: 'world', index: '03', label: 'World' },
  { id: 'next', index: '04', label: '合作与社区' },
];

const roman = ['I', 'II', 'III', 'IV'];

function Label({
  index,
  label,
  en,
  id,
}: {
  index: string;
  label: string;
  en: string;
  /** 给了 id 就是这一段的标题 */
  id?: string;
}) {
  const Tag = id ? 'h2' : 'p';
  return (
    <Tag className="og-label" id={id} data-reveal>
      <span aria-hidden="true">{index}</span>
      <span className="og-label-rule" aria-hidden="true" />
      <span>{label}</span>
      <em lang="en">{en}</em>
    </Tag>
  );
}

/**
 * 逐字显影：每个字一个 span，--i 是它在整句里的位置（0…1），样式用所在 [data-progress] 的 --p 算浓淡。
 * marks 里的词组整体标出来。读屏读整段原文。
 */
function Scrubbed({
  text,
  marks = [],
  id,
}: {
  text: string;
  marks?: string[];
  id?: string;
}) {
  const pieces: { text: string; mark: boolean }[] = [];
  let rest = text;
  while (rest) {
    const hits = marks
      .map((mark) => ({ mark, at: rest.indexOf(mark) }))
      .filter((hit) => hit.at !== -1)
      .sort((a, b) => a.at - b.at);
    const hit = hits[0];
    if (!hit) {
      pieces.push({ text: rest, mark: false });
      break;
    }
    if (hit.at > 0) pieces.push({ text: rest.slice(0, hit.at), mark: false });
    pieces.push({ text: hit.mark, mark: true });
    rest = rest.slice(hit.at + hit.mark.length);
  }
  const total = Array.from(text).length;
  let i = 0;
  return (
    <h2 id={id} className="og-scrub">
      <span className="og-sr">{text}</span>
      <span aria-hidden="true">
        {pieces.map((piece, k) => (
          <span key={k} className={piece.mark ? 'is-mark' : undefined}>
            {Array.from(piece.text).map((ch) => {
              const at = i++ / total;
              return (
                <span
                  key={i}
                  className="og-ch"
                  style={{ '--i': at.toFixed(3) } as Vars}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </h2>
  );
}

/** 长句在逗号后分成几段，每段尽量不拆开 */
function phrases(text: string) {
  return text.split(/(?<=，)/).map((part, i) => (
    <span key={i} className="og-phrase">
      {part}
    </span>
  ));
}

/** 关键词里的「人」用杏橙标出来：尺子的零点就是人 */
function keyword(word: string) {
  const at = word.indexOf('人');
  if (at === -1) return word;
  return (
    <>
      {word.slice(0, at)}
      <em>人</em>
      {word.slice(at + 1)}
    </>
  );
}

export default function OriginHome() {
  const { studio, close } = home;
  const { work, community } = folioStudio;
  const { contact } = ending.paths;
  const lineVisuals = {
    tool: (
      <ToolCursor
        actions={toolDemo.actions}
        before={toolDemo.before}
        selection={toolDemo.selection}
        after={toolDemo.after}
        result={toolDemo.result.text}
      />
    ),
    life: <LifeDial quotes={lifeJobs.items.map((item) => item.quote)} />,
    story: <StoryArches steps={storyJourney.steps.map((step) => step.title)} />,
  };

  return (
    <>
      <div className="og" data-head="light" data-side="light">
        <Motion />
        <Header p="og" home={HOME} />
        <SideScale marks={marks} />

        <main id="main">
          {/* 00 零点：字标、A/I 词组、三个关键词，下面一把尺 */}
          <section
            id="top"
            className="og-hero"
            data-section
            aria-labelledby="og-title"
          >
            <div className="og-wrap og-hero-meta" aria-hidden="true">
              <span>{hero.index}</span>
              <span lang="en">{hero.meta}</span>
              <span>{signature}</span>
            </div>
            <div className="og-wrap og-hero-body">
              <h1
                id="og-title"
                className="og-hero-title"
                lang="en"
                aria-label="Molis AI"
              >
                <span className="og-hero-row">
                  <span>
                    Molis<em>AI</em>
                  </span>
                </span>
              </h1>
              <div className="og-hero-words">
                <AiWordCycle prefix="og" />
              </div>
              <p className="og-hero-keys">
                {folioStudio.keywords.map((word) => (
                  <span key={word}>{keyword(word)}</span>
                ))}
              </p>
            </div>
            <Ruler zeroLabel={hero.zero} />
          </section>

          {/* 01 工作室：停在视口里，身份说明随滚动逐字显影，再浮出想遇见的人与四个产品 */}
          <section
            id="studio"
            className="og-studio"
            data-section
            data-progress="sticky"
            aria-labelledby="og-studio-title"
          >
            <div className="og-studio-stage">
              <div className="og-wrap">
                <Label index="01" label={studio.labelZh} en={studio.label} />
                <Scrubbed
                  id="og-studio-title"
                  text={studio.title}
                  marks={['工作、生活与体验']}
                />
                <div className="og-studio-row">
                  <p className="og-studio-view">{phrases(studio.view)}</p>
                  <p className="og-studio-text">
                    {withNames(studio.text, 'og-name')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 02 产品：Work 一张深色大卡，Tool、Life、Story 各一张示意图 */}
          <section
            id="products"
            className="og-section og-products"
            data-section
            aria-labelledby="og-products-title"
          >
            <div className="og-wrap">
              <Label
                id="og-products-title"
                index="02"
                label={folioStudio.labels.products.zh}
                en={folioStudio.labels.products.en}
              />

              <article
                id="work"
                className="og-work"
                data-tone="dark"
                data-reveal
                aria-labelledby="og-work-title"
              >
                <div className="og-work-copy">
                  <p className="og-mono">
                    {roman[0]} · {work.kicker}
                  </p>
                  <h3 id="og-work-title">
                    <Link href={lineHref.work} lang="en">
                      {work.name}
                    </Link>
                  </h3>
                  <p className="og-work-line">{folioHomeCopy.products.work}</p>
                  <p className="og-ask">{home.asks.work}</p>
                  <ul className="og-chips" aria-label="当前状态">
                    {work.status.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="og-actions">
                    <Link className="og-button is-light" href={lineHref.work}>
                      {work.actions.more}
                      <ArrowRight
                        size={16}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </Link>
                    <a
                      className="og-text-link is-out"
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {work.actions.github}
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>
                <figure className="og-work-visual">
                  <WorkRelay agents={workHero.agents} />
                  <figcaption>
                    <span className="og-sr">
                      {`同一个目标上，${workHero.agents.join('、')} 依次接手，最后核对完成。`}
                    </span>
                    {visualNotes.work}
                  </figcaption>
                </figure>
              </article>

              <div className="og-lines">
                {folioStudio.lines.map((line, i) => (
                  <article
                    key={line.id}
                    id={line.id}
                    className={`og-line is-${line.id}`}
                    data-reveal
                    style={{ '--d': `${i * 110}ms` } as Vars}
                    aria-labelledby={`og-${line.id}-title`}
                  >
                    <figure className="og-line-visual">
                      {lineVisuals[line.id]}
                      <figcaption>{visualNotes[line.id]}</figcaption>
                    </figure>
                    <div className="og-line-meta">
                      <span className="og-mono">
                        {roman[i + 1]} · {home.areas[line.id]}
                      </span>
                      <span className="og-status">{line.status}</span>
                    </div>
                    <h3 id={`og-${line.id}-title`}>
                      <Link href={lineHref[line.id]} lang="en">
                        {lineNames[line.id]}
                      </Link>
                    </h3>
                    <p className="og-line-line">
                      {folioHomeCopy.products[line.id]}
                    </p>
                    <p className="og-ask">{home.asks[line.id]}</p>
                    {line.id === 'tool' ? (
                      <p className="og-relation">
                        {home.relation.home}
                        <span>{home.relation.phase}</span>
                      </p>
                    ) : null}
                    <Link className="og-text-link" href={lineHref[line.id]}>
                      {line.more}
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 03 World：尺子之外还没量过的一段——一句过渡，一张虚线卡 */}
          <section
            id="world"
            className="og-section og-world"
            data-section
            aria-labelledby="og-world-title"
          >
            <div className="og-wrap">
              <Label index="03" label={home.world.name} en="Concept" />
              <p className="og-world-transition" data-reveal>
                {home.world.transition}
              </p>
              <Link
                href={home.world.href}
                className="og-world-card"
                data-reveal
              >
                <span className="og-world-scale" aria-hidden="true">
                  <i />
                </span>
                <span className="og-world-status">{home.world.status}</span>
                <h3 id="og-world-title" lang="en">
                  {home.world.name}
                </h3>
                <span className="og-world-line">{home.world.line}</span>
                <span className="og-world-more">
                  {home.world.more}
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>
          </section>

          {/* 04 结尾：从产品走到企业合作与社区 */}
          <section
            id="next"
            className="og-section og-invite"
            data-section
            aria-labelledby="og-close-title"
          >
            <div className="og-wrap">
              <Label index="04" label="合作与社区" en="Next" />
              <h2 id="og-close-title" className="og-invite-title" data-reveal>
                {close.transition}
              </h2>
              <div className="og-paths">
                <div className="og-path is-dark" data-reveal>
                  <span className="og-mono">{contact.label}</span>
                  <h3>
                    {contact.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <div className="og-path-links">
                    <Link
                      className="og-button is-light"
                      href={contactHref('enterprise')}
                    >
                      {close.cooperation.contact}
                      <ArrowRight
                        size={16}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </Link>
                    <Link className="og-text-link" href={SOLUTIONS}>
                      {close.cooperation.more}
                    </Link>
                  </div>
                </div>
                <div
                  className="og-path"
                  data-reveal
                  style={{ '--d': '120ms' } as Vars}
                >
                  <span className="og-mono">{community.label}</span>
                  <h3>
                    {community.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <div className="og-path-links">
                    <Link className="og-button" href={COMMUNITY}>
                      {community.action}
                      <ArrowRight
                        size={16}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <AlsoLinks p="og" />
            </div>
          </section>
        </main>

        <footer className="og-footer" data-tone="dark">
          <div className="og-wrap og-footer-grid">
            <div className="og-footer-brand">
              <img
                src="/images/molis-logo.png"
                width="44"
                height="44"
                alt=""
                loading="lazy"
              />
              <p>{signature}</p>
            </div>
            <ColophonLinks p="og" />
          </div>
          <div className="og-wrap og-footer-base">
            <span>{footer.copyright}</span>
            <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
            <span className="og-footer-scale" aria-hidden="true" />
          </div>
        </footer>
      </div>
      <PitchBar id="origin" />
    </>
  );
}
