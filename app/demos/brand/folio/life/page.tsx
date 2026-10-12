'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { shotLabels, shots } from '../../../../../content/molis-life';
import { folioLife } from '../../../../../content/folio-life';
import { LifeArt } from '../art';
import {
  Closing,
  Collage,
  Frame,
  NextProduct,
  ProductHero,
  SectionHead,
  Tag,
  pad,
} from '../kit';
import {
  Footer,
  HOME,
  STORY,
  SiteHeader,
  WORLD,
  contactHref,
  useFolioMotion,
  type Vars,
} from '../shared';
import '../folio.css';
import '../kit.css';
import './life.css';

// A3 重做：首屏说清 Life 是懂你、陪你的个人 Agent；往下是概念稿、三件事各走一遍（每步标示意）、
// 它怎么理解你（原型能做到哪一步写清楚）、决定权、和 Story / World 的关系；路线图各只留一行。
// 文案在 content/folio-life.ts；概念稿图片沿用共享的 content/molis-life.ts。

function Phone({ src, w, h }: { src: string; w: number; h: number }) {
  return (
    <div className="fl-phone">
      <img src={src} width={w} height={h} alt="" loading="lazy" />
    </div>
  );
}

/** 三件事：一次看一件，从一句话走到有结果；方向键可以在三件之间切换 */
function Example() {
  const { example } = folioLife;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const story = example.stories[active];
  const move = (event: KeyboardEvent, index: number) => {
    const step =
      event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next =
      (index + step + example.stories.length) % example.stories.length;
    setActive(next);
    tabs.current[next]?.focus();
  };
  return (
    <section
      id="example"
      className="fo-section fl-example"
      data-bg="paper"
      aria-labelledby="fl-example-title"
    >
      <SectionHead
        id="fl-example-title"
        kicker={example.kicker}
        title={example.title}
        lead={example.note}
        layout="split"
      />
      <div className="fl-tabs" role="tablist" aria-label={example.kicker}>
        {example.stories.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`fl-tab-${item.id}`}
            aria-selected={index === active}
            aria-controls="fl-example-panel"
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => move(event, index)}
          >
            <span className="fo-index">{pad(index)}</span>
            {item.tab}
          </button>
        ))}
      </div>
      <div
        className="fl-story"
        role="tabpanel"
        id="fl-example-panel"
        aria-labelledby={`fl-tab-${story.id}`}
        key={story.id}
      >
        <blockquote>{story.quote}</blockquote>
        <ol className="fl-steps">
          {story.steps.map((step, index) => (
            <li key={step} style={{ '--i': index } as Vars}>
              <span className="fo-index">{pad(index)}</span>
              <p>
                {step}
                <Tag>{example.stepTag}</Tag>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function FolioLifePage() {
  const rootRef = useFolioMotion();
  const { hero, understand, control, worlds, roadmap, closing } = folioLife;

  return (
    <div className="fo-site fl-site" ref={rootRef}>
      <SiteHeader current="life" />

      <main id="main">
        <ProductHero
          id="fl-title"
          className="fl-hero"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={[
            { label: hero.actions.follow, href: contactHref('life') },
            { label: hero.actions.example, href: '#example', tone: 'ghost' },
          ]}
          masthead="Life"
          art={<LifeArt />}
        />

        <section
          className="fo-section fl-screen"
          data-bg="white"
          aria-label="Molis Life 概念稿"
        >
          <Collage note={hero.shotNote}>
            <div className="fl-devices">
              <Frame
                src={shots.desktop.src}
                w={shots.desktop.w}
                h={shots.desktop.h}
                label={shotLabels.desktop}
              />
              <Phone {...shots.mobile} />
            </div>
          </Collage>
        </section>

        <Example />

        <section
          className="fo-section"
          data-bg="white"
          aria-labelledby="fl-understand-title"
        >
          <SectionHead
            id="fl-understand-title"
            kicker={understand.kicker}
            title={understand.title}
          />
          <ol className="fo-cards fl-understand">
            {understand.items.map((item, index) => (
              <li key={item.title} data-reveal style={{ '--i': index } as Vars}>
                <span className="fo-index">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
          <aside className="fl-now" data-reveal>
            <strong>
              {understand.now.title}
              <Tag>{understand.now.tag}</Tag>
            </strong>
            <p>{understand.now.text}</p>
          </aside>
        </section>

        <section
          className="fo-section"
          data-bg="navy"
          aria-labelledby="fl-control-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fl-control-title"
              kicker={control.kicker}
              title={control.title}
            />
            <ol className="fo-list">
              {control.items.map((item, index) => (
                <li key={item} data-reveal style={{ '--i': index } as Vars}>
                  <span className="fo-index">{pad(index)}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="fo-section fl-worlds"
          data-bg="yellow"
          aria-labelledby="fl-worlds-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fl-worlds-title"
              kicker={worlds.kicker}
              title={worlds.title}
            />
            <div className="fl-worlds-body" data-reveal>
              <p>{worlds.text}</p>
              <div className="fl-worlds-links">
                <Link href={STORY}>
                  {worlds.story}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
                <Link href={WORLD}>
                  {worlds.world}
                  <Tag>{worlds.worldTag}</Tag>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          className="fo-section fl-roadmap"
          data-bg="paper"
          aria-labelledby="fl-roadmap-title"
        >
          <h2 id="fl-roadmap-title" className="fo-kicker">
            {roadmap.kicker}
          </h2>
          <ul>
            {roadmap.items.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer tone="yellow">
        <Closing
          id="fl-closing-title"
          title={closing.title}
          actions={[
            { label: closing.follow, href: contactHref('life') },
            { label: closing.home, href: HOME, tone: 'light' },
          ]}
        />
        <NextProduct current="life" />
      </Footer>
    </div>
  );
}
