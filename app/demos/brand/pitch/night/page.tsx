'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { folioHomeCopy, folioStudio } from '../../../../../content/folio';
import { lineImages } from '../../../../../content/studio';
import { desk } from '../../../../../content/folio-work';
import { demo } from '../../../../../content/molis-tool';
import { GITHUB_URL } from '../../../../../content/molis-work';
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
  useStage,
  useStepper,
  type Vars,
} from '../_kit/kit';
import { WorkSheet } from '../_kit/sheets';
import {
  FloorPlan,
  LitText,
  NeonLife,
  Portal,
  Projection,
  WorldModel,
} from './exhibits';
import './x.css';
import { findPitch } from '../routes';
import { PitchBar } from '../_kit/bar';

// 夜间展馆：首页是一场展览。前厅读到展名与前言，穿过入口进入四个展厅——
// 屏幕装置（Work）、投影文字（Tool）、霓虹静物（Life）、一道光门（Story）——最后在出口留下问题。
// 每个展厅随滚动开灯、看展、熄灯；鼠标是一束手电光，展厅随它轻轻转动；左下角的平面图标出你在哪里。
// 前厅之后是一间前言厅（工作室身份说明，逐字被照亮）；第五间是还在布展的 World。内容与 Folio 首页同一份。

const HOME = findPitch('night').href;

const work = folioStudio.work;
const lines = Object.fromEntries(
  folioStudio.lines.map((line) => [line.id, line]),
) as Record<'tool' | 'life' | 'story', (typeof folioStudio.lines)[number]>;

const rooms = [
  { id: 'foyer', label: '前厅' },
  { id: 'studio', label: '前言' },
  { id: 'work', label: '01' },
  { id: 'tool', label: '02' },
  { id: 'life', label: '03' },
  { id: 'story', label: '04' },
  { id: 'world', label: '05' },
  { id: 'exit', label: '出口' },
];

const productNames = ['Molis Work', 'Molis Tool', 'Molis Life', 'Molis Story'];

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
  const { studio, close } = home;

  return (
    <>
      <div className="xs" ref={root}>
        <Header p="xs" home={HOME} />
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
              <div className="xs-door" aria-hidden="true">
                <span className="xs-door-label">
                  {studio.label} · {studio.labelZh}
                </span>
                <span className="xs-door-frame">
                  <span className="xs-door-light" />
                </span>
              </div>
            </div>
          </section>

          {/* 前言厅：工作室身份说明写在墙上，随脚步一个字一个字被照亮 */}
          <section
            className="xs-studio"
            id="studio"
            data-hall
            data-scene="pin"
            aria-labelledby="xs-studio-title"
          >
            <div className="xs-stage">
              <span className="xs-wall" aria-hidden="true" />
              <span className="xs-studio-light" aria-hidden="true" />
              <div className="xs-studio-copy">
                <p className="xs-studio-kicker">
                  <span lang="en">{studio.label}</span>
                  <span>{studio.labelZh}</span>
                </p>
                <LitText
                  as="h2"
                  id="xs-studio-title"
                  className="xs-studio-title xs-lit"
                  text={studio.title}
                />
                <div className="xs-studio-row">
                  <p className="xs-studio-view">{studio.view}</p>
                  <LitText
                    className="xs-studio-text xs-lit xs-lit-late"
                    text={studio.text}
                    marks={productNames}
                  />
                </div>
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
                <p className="xs-label-ask">{home.asks.work}</p>
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
                  {home.areas.tool} · {lines.tool.status}
                </p>
                <h3 className="xs-label-name" id="xs-tool-title">
                  <Link href={lineHref.tool} lang="en">
                    {lineNames.tool}
                  </Link>
                </h3>
                <p className="xs-label-line">{folioHomeCopy.products.tool}</p>
                <p className="xs-label-ask">{home.asks.tool}</p>
                <p className="xs-label-relation">
                  {home.relation.home}
                  <span>{home.relation.phase}</span>
                </p>
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
                  {home.areas.life} · {lines.life.status}
                </p>
                <h3 className="xs-label-name" id="xs-life-title">
                  <Link href={lineHref.life} lang="en">
                    {lineNames.life}
                  </Link>
                </h3>
                <p className="xs-label-line">{folioHomeCopy.products.life}</p>
                <p className="xs-label-ask">{home.asks.life}</p>
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
                  {home.areas.story} · {lines.story.status}
                </p>
                <h3 className="xs-label-name" id="xs-story-title">
                  <Link href={lineHref.story} lang="en">
                    {lineNames.story}
                  </Link>
                </h3>
                <p className="xs-label-line">{folioHomeCopy.products.story}</p>
                <p className="xs-label-ask">{home.asks.story}</p>
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

          {/* 第五间：World 还在布展，只有一个慢慢转的小世界模型和墙上的一句话 */}
          <Hall
            id="world"
            number="05"
            exhibit={
              <div className="xs-world-wrap">
                <WorldModel />
                <p className="xs-world-line">{home.world.transition}</p>
              </div>
            }
            label={
              <>
                <p className="xs-label-meta">{home.world.status}</p>
                <h3 className="xs-label-name" id="xs-world-title">
                  <Link href={home.world.href} lang="en">
                    {home.world.name}
                  </Link>
                </h3>
                <p className="xs-label-line">{home.world.line}</p>
                <div className="xs-links">
                  <Link className="xs-link" href={home.world.href}>
                    {home.world.more}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </>
            }
          />

          {/* 出口：从产品走到企业合作与社区，两张服务台 */}
          <section
            className="xs-exit"
            id="exit"
            data-hall
            aria-labelledby="xs-exit-title"
          >
            <span className="xs-wall" aria-hidden="true" />
            <h2 id="xs-exit-title" data-reveal>
              {close.transition}
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
                    {close.cooperation.contact}
                  </Link>
                  <Link className="xs-link" href={SOLUTIONS}>
                    {close.cooperation.more}
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
                </div>
              </div>
            </div>
            <AlsoLinks p="xs" />
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
          <ColophonLinks p="xs" />
          <div className="xs-colophon-base">
            <span>{footer.copyright}</span>
            <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
          </div>
        </footer>
      </div>
      <PitchBar id="night" />
    </>
  );
}
