'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { folioWorld } from '../../../../../content/folio-world';
import {
  Closing,
  NextProduct,
  ProductHero,
  SectionHead,
  Tag,
  pad,
} from '../kit';
import {
  Footer,
  HOME,
  SiteHeader,
  contactHref,
  productHref,
  productName,
  productTone,
  useFolioMotion,
  type Vars,
} from '../shared';
import { WorldSheet } from './art';
import '../folio.css';
import '../kit.css';
import './world.css';

// Molis World（概念设计）：首屏一句话讲清是什么，往下是它能做什么、一段示例旅程、
// 和 Life、Story 的关系、以及不会变的分寸。文案在 content/folio-world.ts；没有下载、试用或注册入口。

export default function FolioWorldPage() {
  const rootRef = useFolioMotion();
  const { hero, what, journey, family, rules, closing } = folioWorld;

  return (
    <div className="fo-site fwd-site" ref={rootRef}>
      <SiteHeader current="world" />

      <main id="main">
        <ProductHero
          id="fwd-title"
          className="fwd-hero"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          status={hero.status}
          actions={[
            { label: hero.actions.follow, href: contactHref('world') },
            { label: hero.actions.journey, href: '#journey', tone: 'ghost' },
          ]}
          masthead="World"
          art={<WorldSheet />}
        />

        <section
          className="fo-section"
          data-bg="white"
          aria-labelledby="fwd-what-title"
        >
          <SectionHead
            id="fwd-what-title"
            kicker={what.kicker}
            title={what.title}
            lead={what.lead}
            layout="split"
          />
          <ol className="fo-cards fwd-what">
            {what.items.map((item, index) => (
              <li key={item.title} data-reveal style={{ '--i': index } as Vars}>
                <span className="fo-index">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="journey"
          className="fo-section fwd-journey"
          data-bg="paper"
          aria-labelledby="fwd-journey-title"
        >
          <SectionHead
            id="fwd-journey-title"
            kicker={journey.kicker}
            title={journey.title}
          />
          <ol className="fwd-steps">
            {journey.steps.map((step, index) => (
              <li
                key={step.text}
                data-reveal
                data-tone={productTone[step.product]}
                style={{ '--i': index } as Vars}
              >
                <span className="fo-index">{pad(index)}</span>
                <span className="fwd-product">{productName[step.product]}</span>
                <p>
                  {step.text}
                  {step.planned ? <Tag>{journey.planned}</Tag> : null}
                </p>
              </li>
            ))}
          </ol>
          <p className="fo-note">{journey.note}</p>
        </section>

        <section
          className="fo-section fwd-family"
          data-bg="sage"
          aria-labelledby="fwd-family-title"
        >
          <SectionHead
            id="fwd-family-title"
            kicker={family.kicker}
            title={family.title}
            lead={family.lead}
            layout="split"
          />
          <ul className="fwd-family-cards">
            {family.items.map((item, index) => (
              <li
                key={item.id}
                data-reveal
                data-tone={productTone[item.id]}
                style={{ '--i': index } as Vars}
              >
                <small>{item.role}</small>
                <h3 lang="en">{productName[item.id]}</h3>
                <p>{item.text}</p>
                <span className="fwd-status">{item.status}</span>
                {item.id === 'world' ? null : (
                  <Link href={productHref[item.id]}>
                    {family.more}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section
          className="fo-section"
          data-bg="navy"
          aria-labelledby="fwd-rules-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fwd-rules-title"
              kicker={rules.kicker}
              title={rules.title}
            />
            <ol className="fo-list">
              {rules.items.map((item, index) => (
                <li
                  key={item.title}
                  data-reveal
                  style={{ '--i': index } as Vars}
                >
                  <span className="fo-index">{pad(index)}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer tone="paper">
        <Closing
          id="fwd-closing-title"
          title={closing.title}
          actions={[
            { label: closing.follow, href: contactHref('world') },
            { label: closing.home, href: HOME, tone: 'ghost' },
          ]}
        />
        <NextProduct current="world" />
      </Footer>
    </div>
  );
}
