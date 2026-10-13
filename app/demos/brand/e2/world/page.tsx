'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { folioWorld } from '../../../../../content/folio-world';
import { Pip, WorldPip } from '../axo';
import { HOME, contactHref, pad, productHref, productName } from '../routes';
import {
  Actions,
  E2Page,
  Kicker,
  NextProduct,
  Phrases,
  SectionHead,
  Status,
  Tag,
  type Vars,
} from '../shell';
import { Island } from './art';
import './world.css';

// E2 · Molis World（概念设计）：最「开放」的一页。首屏是一块布置好的小岛，标出「你的世界」里的三样东西；
// 往下 World 是什么 → 一段示例旅程（同一块岛从空的开始，随滚动一步放进一样）→ Life + Story = World
// → 分寸。没有下载、试用或注册入口，主行动是「关注进展」。文案全部来自 content/folio-world.ts。

const world = folioWorld;

/** 视口中线经过哪一步，就布置到哪一步；减少动态时直接给布置好的样子 */
function useActiveStep(count: number) {
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-i]'));
    const observer = new IntersectionObserver(
      (entries) => {
        if (reduce.matches) return;
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: '-46% 0px -46% 0px' },
    );
    const sync = () => {
      if (reduce.matches) setActive(count - 1);
    };
    sync();
    items.forEach((item) => observer.observe(item));
    reduce.addEventListener('change', sync);
    return () => {
      observer.disconnect();
      reduce.removeEventListener('change', sync);
    };
  }, [count]);
  return [ref, active] as const;
}

function Hero() {
  const { hero, map } = world;
  return (
    <section className="ewd-hero" aria-labelledby="ewd-title">
      <div className="ewd-hero-copy">
        <Kicker>{hero.kicker}</Kicker>
        <h1 id="ewd-title">
          <Phrases text={hero.title} />
        </h1>
        <p className="ewd-lead">{hero.lead}</p>
        <Status items={hero.status} />
        <Actions
          items={[
            { label: hero.actions.follow, href: contactHref('world') },
            { label: hero.actions.journey, href: '#journey', tone: 'ghost' },
          ]}
        />
      </div>
      <figure className="ewd-hero-art">
        <Island
          mode="map"
          label={`${map.note}：${map.title}里有${map.places.map((place) => place.name).join('、')}`}
          notes={map.places.map((place, index) => ({
            num: pad(index),
            label: place.name,
          }))}
        />
        <ul className="ewd-legend">
          {map.places.map((place, index) => (
            <li key={place.name}>
              <i aria-hidden="true">{pad(index)}</i>
              <small>{place.kind}</small>
              <span>{place.name}</span>
            </li>
          ))}
        </ul>
        <figcaption className="ewd-figcaption">
          <span>
            <b lang="en">Fig. 01</b>
            {map.title} · 轴测
          </span>
          <em>{map.note}</em>
        </figcaption>
      </figure>
    </section>
  );
}

/** World 是什么：三件事，排得很开 */
function What() {
  const { what } = world;
  return (
    <section className="ewd-section" aria-labelledby="ewd-what-title">
      <SectionHead
        id="ewd-what-title"
        index={0}
        kicker={what.kicker}
        title={what.title}
        lead={what.lead}
        layout="split"
      />
      <ol className="ewd-what">
        {what.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--d': `${index * 120}ms` } as Vars}
          >
            <span className="ewd-big-no" aria-hidden="true">
              {pad(index)}
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 一段示例旅程：左边六步随滚动走过，右边同一块岛一步放进一样东西 */
function Journey() {
  const { journey } = world;
  const [ref, active] = useActiveStep(journey.steps.length);
  const notes = journey.steps.map((step, index) => ({
    num: pad(index),
    label: step.planned ? journey.planned : productName[step.product],
  }));
  return (
    <section
      id="journey"
      className="ewd-section ewd-journey"
      aria-labelledby="ewd-journey-title"
    >
      <SectionHead
        id="ewd-journey-title"
        index={1}
        kicker={journey.kicker}
        title={journey.title}
      />
      <div className="ewd-journey-body" data-active={active}>
        <ol className="ewd-steps" ref={ref}>
          {journey.steps.map((step, index) => (
            <li
              key={step.text}
              data-i={index}
              className={index === active ? 'is-active' : undefined}
            >
              <span className="ewd-step-meta">
                <i>{pad(index)}</i>
                <span lang="en">{productName[step.product]}</span>
              </span>
              <p>
                {step.text}
                {step.planned ? <Tag>{journey.planned}</Tag> : null}
              </p>
            </li>
          ))}
        </ol>
        <figure className="ewd-stage">
          <div className="ewd-stage-plate">
            <Island mode="journey" step={active} notes={notes} />
            <span className="ewd-stage-count" aria-hidden="true">
              {active < 0 ? '00' : pad(active)} /{' '}
              {pad(journey.steps.length - 1)}
            </span>
          </div>
          <figcaption className="ewd-figcaption">
            <span>
              <b lang="en">Fig. 02</b>
              {journey.kicker}
            </span>
            <em>{journey.note}</em>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/** Life + Story = World：三张卡片排成一道等式 */
function Family() {
  const { family } = world;
  return (
    <section
      className="ewd-section ewd-family-section"
      aria-labelledby="ewd-family-title"
    >
      <SectionHead
        id="ewd-family-title"
        index={2}
        kicker={family.kicker}
        title={family.title}
        lead={family.lead}
        layout="split"
      />
      <ul className="ewd-family">
        {family.items.map((item, index) => (
          <li
            key={item.id}
            className={item.id === 'world' ? 'ewd-family-here' : undefined}
            data-reveal
            style={{ '--d': `${index * 120}ms` } as Vars}
          >
            <span className="ewd-family-art" data-draw>
              {item.id === 'world' ? (
                <WorldPip />
              ) : (
                <Pip kind={item.id === 'life' ? 'life' : 'story'} />
              )}
            </span>
            <small>{item.role}</small>
            <h3 lang="en">{productName[item.id]}</h3>
            <p>{item.text}</p>
            <span className="ewd-family-status">{item.status}</span>
            {item.id === 'world' ? null : (
              <Link className="e2-link" href={productHref[item.id]}>
                {family.more}
                <span className="sr-only">：{productName[item.id]}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 分寸：深色的一段，六条边界排成两行 */
function Rules() {
  const { rules } = world;
  return (
    <section
      className="ewd-section ewd-rules"
      aria-labelledby="ewd-rules-title"
    >
      <SectionHead
        id="ewd-rules-title"
        index={3}
        kicker={rules.kicker}
        title={rules.title}
      />
      <ol className="ewd-rule-grid">
        {rules.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--d': `${(index % 3) * 100}ms` } as Vars}
          >
            <span className="ewd-no" aria-hidden="true">
              {pad(index)}
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Closing() {
  const { closing } = world;
  return (
    <>
      <section className="ewd-closing" aria-labelledby="ewd-closing-title">
        <h2 id="ewd-closing-title" data-reveal>
          {closing.title.map((line) => (
            <span key={line} className="e2-phrase">
              {line}
            </span>
          ))}
        </h2>
        <div
          className="ewd-closing-side"
          data-reveal
          style={{ '--d': '120ms' } as Vars}
        >
          <span className="ewd-closing-art" data-draw>
            <WorldPip />
          </span>
          <Actions
            items={[
              { label: closing.follow, href: contactHref('world') },
              { label: closing.home, href: HOME, tone: 'ghost' },
            ]}
          />
        </div>
      </section>
      <NextProduct current="world" />
    </>
  );
}

export default function E2WorldPage() {
  return (
    <E2Page current="world" className="ewd" footer={<Closing />}>
      <Hero />
      <What />
      <Journey />
      <Family />
      <Rules />
    </E2Page>
  );
}
