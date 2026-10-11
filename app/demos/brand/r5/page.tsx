'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { folioHomeCopy, folioStudio } from '../../../../content/folio';
import { lineImages } from '../../../../content/studio';
import { desk } from '../../../../content/folio-work';
import { demo } from '../../../../content/molis-tool';
import { GITHUB_URL } from '../../../../content/molis-work';
import { AiWordCycle } from '../ai-words';
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
  useStepper,
  type Vars,
} from '../r3/kit';
import { WorkSheet } from '../r3/sheets';
import { FloorPlan, NeonLife, Portal, Projection } from './exhibits';
import './x.css';

// 夜间展馆：首页是一场展览。前厅读到展名与前言，穿过入口进入四个展厅——
// 屏幕装置（Work）、投影文字（Tool）、霓虹静物（Life）、一道光门（Story）——最后在出口留下问题。
// 每个展厅随滚动开灯、看展、熄灯；鼠标是一束手电光，展厅随它轻轻转动；左下角的平面图标出你在哪里。
// 内容与 Folio 首页同一份。

const R5 = '/demos/brand/r5';

const work = folioStudio.work;
const lines = Object.fromEntries(
  folioStudio.lines.map((line) => [line.id, line]),
) as Record<'tool' | 'life' | 'story', (typeof folioStudio.lines)[number]>;

const rooms = [
  { id: 'foyer', label: '前言' },
  { id: 'work', label: '01' },
  { id: 'tool', label: '02' },
  { id: 'life', label: '03' },
  { id: 'story', label: '04' },
  { id: 'exit', label: '出口' },
];

/** 鼠标是一束手电光 */
function useTorch() {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      document.documentElement.style.setProperty('--xs-fx', `${x}px`);
      document.documentElement.style.setProperty('--xs-fy', `${y}px`);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || reduce.matches) return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.documentElement.style.removeProperty('--xs-fx');
      document.documentElement.style.removeProperty('--xs-fy');
    };
  }, []);
}

/** 一个展厅：墙、地面、聚光灯，中间一件装置，旁边是展签 */
function Hall({
  id,
  number,
  exhibit,
  label,
  className = '',
}: {
  id: string;
  number: string;
  exhibit: ReactNode;
  label: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`xs-hall xs-hall-${id} ${className}`}
      id={id}
      data-hall
      data-scene="pin"
      aria-labelledby={`xs-${id}-title`}
    >
      <div className="xs-stage">
        <div className="xs-room" data-parallax>
          <div className="xs-space">
            <span className="xs-wall" aria-hidden="true" />
            <span className="xs-floor" aria-hidden="true" />
            <span className="xs-cone" aria-hidden="true" />
            <div className="xs-exhibit">{exhibit}</div>
          </div>
        </div>
        <div className="xs-label">
          <p className="xs-label-no" lang="en" aria-hidden="true">
            Hall {number}
          </p>
          {label}
        </div>
      </div>
    </section>
  );
}

export default function Exhibition() {
  const root = useStage();
  const plan = useStepper<HTMLElement>('[data-hall]');
  useTorch();
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const question = ending.title.slice(0, -1);
  const mark = ending.title.slice(-1);

  return (
    <div className="xs" ref={root}>
      <Header p="xs" home={R5} />
      <span className="xs-torch" aria-hidden="true" />

      <main id="main" ref={plan} data-step="0">
        {/* 前厅：展名墙、前言，往前走进入口 */}
        <section
          className="xs-foyer"
          id="foyer"
          data-hall
          data-scene="pin"
          aria-labelledby="xs-title"
        >
          <div className="xs-stage">
            <span className="xs-wall" aria-hidden="true" />
            <span className="xs-sweep" aria-hidden="true" />
            <div className="xs-foyer-copy">
              <h1 className="xs-title" id="xs-title" aria-label="Molis AI">
                <span aria-hidden="true" lang="en">
                  Molis <em>AI</em>
                </span>
              </h1>
              <AiWordCycle prefix="xs" />
              <p className="xs-keys">
                {folioStudio.keywords.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </p>
            </div>
            <aside className="xs-preface" aria-label="前言">
              <p className="xs-preface-head" aria-hidden="true">
                前言
              </p>
              <p>{folioHomeCopy.description}</p>
            </aside>
            <div className="xs-door" aria-hidden="true">
              <span className="xs-door-label">Hall 01 · Molis Work</span>
              <span className="xs-door-frame">
                <span className="xs-door-light" />
              </span>
            </div>
          </div>
        </section>

        <Hall
          id="work"
          number="01"
          exhibit={
            <div className="xs-screen">
              <WorkSheet p="xs" active />
            </div>
          }
          label={
            <>
              <h2 className="xs-section" id="xs-products-title">
                <span lang="en">{folioStudio.labels.products.en}</span>
                <small>{folioStudio.labels.products.zh}</small>
              </h2>
              <p className="xs-label-meta">{work.kicker}</p>
              <h3 className="xs-label-name" id="xs-work-title">
                <Link href={lineHref.work} lang="en">
                  {work.name}
                </Link>
              </h3>
              <p className="xs-label-line">{folioHomeCopy.products.work}</p>
              <ul className="xs-status" aria-label="当前状态">
                {work.status.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="xs-links">
                <Link className="xs-button" href={lineHref.work}>
                  {work.actions.more}
                </Link>
                <a
                  className="xs-link"
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  {work.actions.github}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
              <p className="xs-note">{desk.note}</p>
            </>
          }
        />

        <Hall
          id="tool"
          number="02"
          exhibit={<Projection active />}
          label={
            <>
              <p className="xs-label-meta">
                {lines.tool.area} · {lines.tool.status}
              </p>
              <h3 className="xs-label-name" id="xs-tool-title">
                <Link href={lineHref.tool} lang="en">
                  {lineNames.tool}
                </Link>
              </h3>
              <p className="xs-label-line">{folioHomeCopy.products.tool}</p>
              <div className="xs-links">
                <Link className="xs-link" href={lineHref.tool}>
                  {lines.tool.more}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <p className="xs-note">{demo.note}</p>
            </>
          }
        />

        <Hall
          id="life"
          number="03"
          exhibit={
            <div className="xs-neon-wrap" data-reveal>
              <NeonLife />
            </div>
          }
          label={
            <>
              <p className="xs-label-meta">
                {lines.life.area} · {lines.life.status}
              </p>
              <h3 className="xs-label-name" id="xs-life-title">
                <Link href={lineHref.life} lang="en">
                  {lineNames.life}
                </Link>
              </h3>
              <p className="xs-label-line">{folioHomeCopy.products.life}</p>
              <div className="xs-links">
                <Link className="xs-link" href={lineHref.life}>
                  {lines.life.more}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <p className="xs-note">{lineImages.life.note}</p>
            </>
          }
        />

        <Hall
          id="story"
          number="04"
          exhibit={<Portal />}
          label={
            <>
              <p className="xs-label-meta">
                {lines.story.area} · {lines.story.status}
              </p>
              <h3 className="xs-label-name" id="xs-story-title">
                <Link href={lineHref.story} lang="en">
                  {lineNames.story}
                </Link>
              </h3>
              <p className="xs-label-line">{folioHomeCopy.products.story}</p>
              <div className="xs-links">
                <Link className="xs-link" href={lineHref.story}>
                  {lines.story.more}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <p className="xs-note">{lineImages.story.note}</p>
            </>
          }
        />

        {/* 出口：留下一个问题，两张服务台 */}
        <section
          className="xs-exit"
          id="exit"
          data-hall
          aria-labelledby="xs-exit-title"
        >
          <span className="xs-wall" aria-hidden="true" />
          <h2 id="xs-exit-title" data-reveal>
            {question}
            <span lang="en">{mark}</span>
          </h2>
          <div className="xs-desks">
            <div className="xs-desk xs-desk-business" data-reveal>
              <small>{contact.label}</small>
              <h3>
                {contact.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <div className="xs-links">
                <Link className="xs-button" href={contactHref('enterprise')}>
                  {contact.action}
                </Link>
                <Link className="xs-link" href={SOLUTIONS}>
                  了解解决方案
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div
              className="xs-desk"
              data-reveal
              style={{ '--d': '140ms' } as Vars}
            >
              <small>{community.label}</small>
              <h3>
                {community.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <div className="xs-links">
                <Link className="xs-button xs-button-ghost" href={COMMUNITY}>
                  {community.action}
                </Link>
                <Link className="xs-link" href={LOGIN}>
                  {folioStudio.nav.login}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <FloorPlan rooms={rooms} />
      </main>

      <footer className="xs-colophon">
        <div className="xs-colophon-lead">
          <span className="xs-colophon-brand">
            <img
              src="/images/molis-logo.png"
              width="30"
              height="30"
              alt=""
              loading="lazy"
            />
            Molis AI
          </span>
          <p>{signature}</p>
        </div>
        <nav className="xs-colophon-links" aria-label="页尾导航">
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
        <div className="xs-colophon-base">
          <span>{footer.copyright}</span>
          <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
        </div>
      </footer>
    </div>
  );
}
