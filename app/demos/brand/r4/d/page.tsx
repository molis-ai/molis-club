'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
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
import { ToolSheet, WorkSheet } from '../../r3/sheets';
import { R4_D } from '../routes';
import { clock, css, initialHour, lightAt, type Light } from './daylight';
import { LifeDrawing, MonsteraShadow, StoryDrawing, SunMoon } from './drawings';
import { Sky } from './sky';
import './d.css';

// D · 日光与生活（第四轮）：页面的光跟着你此刻的时间走。
// 首屏是一片真实时刻的天，字很少；产品是阳光下的几块纸面屏幕，墙上有植物的影子，横着一块块看过去；
// 结尾回到天空。底部的「一天」可以拖动，看清晨、正午和夜里的样子。内容与 Folio 首页同一份。

const work = folioStudio.work;
const lines = folioStudio.lines;

/** 产品一段：竖着滚，横着走。量出轨道比视口多出的宽度，写进 --extra */
function useTrack() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = ref.current;
    const track = section?.querySelector<HTMLElement>('.wd-track');
    if (!section || !track) return;
    const measure = () => {
      const extra = Math.max(0, track.scrollWidth - section.clientWidth);
      section.style.setProperty('--extra', `${extra}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  return ref;
}

export default function DirectionD() {
  const root = useStage();
  const track = useTrack();
  const light = useRef<Light>(lightAt(10));
  const [hour, setHour] = useState(10);
  const [live, setLive] = useState(true);
  const [ready, setReady] = useState(false);

  const [under, setUnder] = useState<'sky' | 'paper'>('sky');

  // 第一次进来：读访客当地时间（或 ?t=）；跟着时间走时，每分钟更新一次
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setHour(initialHour());
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!live) return;
    const timer = window.setInterval(() => {
      const now = new Date();
      setHour(now.getHours() + now.getMinutes() / 60);
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [live]);

  // 时刻变化：交给天空画布重画
  const l = lightAt(hour);
  useEffect(() => {
    light.current = lightAt(hour);
    window.dispatchEvent(new Event('wd-light'));
  }, [hour]);

  // 顶栏下面是天空还是白墙：天空上用天色的字，白墙上用墨色
  useEffect(() => {
    const skies = Array.from(
      document.querySelectorAll<HTMLElement>('.wd [data-sky]'),
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      const onSky = skies.some((sky) => {
        const rect = sky.getBoundingClientRect();
        return rect.top <= 36 && rect.bottom >= 36;
      });
      setUnder(onSky ? 'sky' : 'paper');
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    request();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);

  const lightVars = {
    '--sky-top': css(l.top),
    '--sky-mid': css(l.mid),
    '--sky-low': css(l.low),
    '--shade-color': css(l.shadeColor),
    '--shade': l.shadow.toFixed(3),
    '--skew': `${l.skew.toFixed(1)}deg`,
    '--sun-x': l.sunX.toFixed(3),
    '--sun-y': l.sunY.toFixed(3),
    '--alt': l.altitude.toFixed(3),
  } as Vars;

  const night = l.night;
  const { community } = folioStudio;
  const { contact } = ending.paths;
  const question = ending.title.slice(0, -1);
  const mark = ending.title.slice(-1);

  return (
    <div
      className="wd"
      ref={root}
      data-ready={ready}
      data-night={l.night}
      data-ink={l.darkInk ? 'dark' : 'light'}
      data-under={under}
      style={lightVars}
    >
      <Header p="wd" home={R4_D} />

      <main id="main">
        <div className="wd-skyfield" data-sky>
          <div className="wd-sky-stage">
            <Sky light={light} seed={7} clouds={8} />
          </div>

          <section className="wd-hero" aria-labelledby="wd-title">
            <div className="wd-hero-copy">
              <h1 className="wd-mark" id="wd-title" lang="en">
                Molis AI
              </h1>
              <AiWordCycle prefix="wd" />
              <p className="wd-keys">
                {folioStudio.keywords.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </p>
            </div>

            <div className="wd-dial">
              <label className="wd-dial-label" htmlFor="wd-hour">
                <SunMoon night={night} />
                <span aria-hidden="true">{clock(hour)}</span>
                <span className="sr-only">
                  一天中的时刻，拖动看不同时刻的光
                </span>
              </label>
              <input
                id="wd-hour"
                type="range"
                min={0}
                max={24}
                step={0.25}
                value={hour}
                aria-valuetext={clock(hour)}
                onChange={(event) => {
                  setLive(false);
                  setHour(Number(event.target.value));
                }}
                style={{ '--h': hour / 24 } as Vars}
              />
              <span className="wd-dial-ticks" aria-hidden="true">
                <i>0</i>
                <i>6</i>
                <i>12</i>
                <i>18</i>
                <i>24</i>
              </span>
              {!live ? (
                <button
                  type="button"
                  className="wd-dial-now"
                  onClick={() => {
                    setLive(true);
                    const now = new Date();
                    setHour(now.getHours() + now.getMinutes() / 60);
                  }}
                >
                  回到此刻
                </button>
              ) : null}
            </div>
          </section>

          <section className="wd-about" aria-label="关于 Molis AI">
            <p data-reveal>{folioHomeCopy.description}</p>
          </section>
        </div>

        <section
          className="wd-products"
          id="products"
          ref={track}
          data-scene="pin"
          aria-labelledby="wd-products-title"
        >
          <div className="wd-products-stage">
            <MonsteraShadow className="wd-shadow-wall" />
            <header className="wd-products-head">
              <h2 id="wd-products-title">
                <span lang="en">{folioStudio.labels.products.en}</span>
                <small>{folioStudio.labels.products.zh}</small>
              </h2>
              <span className="wd-progress" aria-hidden="true">
                <i />
              </span>
            </header>

            <div className="wd-track">
              <article
                className="wd-item wd-item-work"
                id="work"
                aria-labelledby="wd-work-title"
              >
                <div className="wd-screen">
                  <WorkSheet p="wd" active />
                  <MonsteraShadow className="wd-shadow-screen" />
                  <span className="wd-screen-note">{desk.note}</span>
                </div>
                <div className="wd-item-copy">
                  <p className="wd-item-meta">{work.kicker}</p>
                  <h3 id="wd-work-title">
                    <Link href={lineHref.work} lang="en">
                      {work.name}
                    </Link>
                  </h3>
                  <p className="wd-item-line">{folioHomeCopy.products.work}</p>
                  <ul className="wd-status" aria-label="当前状态">
                    {work.status.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="wd-item-links">
                    <Link className="wd-button" href={lineHref.work}>
                      {work.actions.more}
                    </Link>
                    <a
                      className="wd-link"
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {work.actions.github}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>

              {lines.map((line) => (
                <article
                  key={line.id}
                  className={`wd-item wd-item-${line.id}`}
                  id={line.id}
                  aria-labelledby={`wd-${line.id}-title`}
                >
                  <div className="wd-screen">
                    {line.id === 'tool' ? <ToolSheet p="wd" active /> : null}
                    {line.id === 'life' ? <LifeDrawing /> : null}
                    {line.id === 'story' ? <StoryDrawing /> : null}
                    <MonsteraShadow className="wd-shadow-screen" />
                    <span className="wd-screen-note">
                      {line.id === 'tool'
                        ? demo.note
                        : lineImages[line.id as 'life' | 'story'].note}
                    </span>
                  </div>
                  <div className="wd-item-copy">
                    <p className="wd-item-meta">
                      {line.area} · {line.status}
                    </p>
                    <h3 id={`wd-${line.id}-title`}>
                      <Link href={lineHref[line.id]} lang="en">
                        {lineNames[line.id]}
                      </Link>
                    </h3>
                    <p className="wd-item-line">
                      {folioHomeCopy.products[line.id]}
                    </p>
                    <div className="wd-item-links">
                      <Link className="wd-link" href={lineHref[line.id]}>
                        {line.more}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="wd-end">
        <section className="wd-dusk" data-sky aria-labelledby="wd-ending-title">
          <Sky light={light} seed={19} clouds={6} className="wd-sky-end" />
          <h2 id="wd-ending-title" data-reveal>
            {question}
            <span lang="en">{mark}</span>
          </h2>
          <div className="wd-paths">
            <div className="wd-path wd-path-business" data-reveal>
              <small>{contact.label}</small>
              <h3>
                {contact.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <div className="wd-item-links">
                <Link className="wd-button" href={contactHref('enterprise')}>
                  {contact.action}
                </Link>
                <Link className="wd-link" href={SOLUTIONS}>
                  了解解决方案
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div
              className="wd-path"
              data-reveal
              style={{ '--d': '120ms' } as Vars}
            >
              <small>{community.label}</small>
              <h3>
                {community.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <div className="wd-item-links">
                <Link className="wd-button wd-button-ghost" href={COMMUNITY}>
                  {community.action}
                </Link>
                <Link className="wd-link" href={LOGIN}>
                  {folioStudio.nav.login}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="wd-colophon">
          <MonsteraShadow className="wd-shadow-foot" />
          <div className="wd-colophon-lead">
            <span className="wd-colophon-brand">
              <img
                src="/images/molis-logo.png"
                width="32"
                height="32"
                alt=""
                loading="lazy"
              />
              Molis AI
            </span>
            <p>{signature}</p>
          </div>
          <nav className="wd-colophon-links" aria-label="页尾导航">
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
          <div className="wd-colophon-base">
            <span>{footer.copyright}</span>
            <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
