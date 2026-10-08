'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, BookOpen, MessageSquare, Sparkles } from 'lucide-react';
import { folioStudio } from '../../../../content/folio';
import { lineImages, team, type LineId } from '../../../../content/studio';
import { Actions, SectionHead } from './kit';
import {
  COMMUNITY,
  Footer,
  SiteHeader,
  SOLUTIONS,
  contactHref,
  lineHref,
  useFolioMotion,
  type Vars,
} from './shared';
import { people, companies } from './team';
import { WorkDemo } from './work/demos';
import { CursorDemo } from './tool/demos';
import './folio.css';
import './kit.css';
import './tool/tool.css';
import './home.css';

function ProductStage() {
  const [active, setActive] = useState<LineId>('work');
  const product = folioStudio.products.find((p) => p.id === active)!;
  return (
    <div className="fh-showcase">
      <div className="fh-showcase-decoration" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <fieldset
        className="fh-product-selector"

        aria-label="看看我们正在做的产品"
      >
        {folioStudio.products.map((p) => (
          <button
            type="button"
            key={p.id}
            aria-pressed={active === p.id}
            onClick={() => setActive(p.id)}
          >
            {p.title.replace('Molis ', '')}
            <span>{p.category}</span>
          </button>
        ))}
      </fieldset>
      <div className="fh-stage" key={active}>
        {active === 'work' ? (
          <WorkDemo compact />
        ) : active === 'tool' ? (
          <CursorDemo />
        ) : (
          <figure className="fh-concept">
            <img
              src={lineImages[active].src}
              width={lineImages[active].w}
              height={lineImages[active].h}
              alt={`${product.title} ${lineImages[active].note}`}
            />
            <figcaption>
              {lineImages[active].note} · {product.status}
            </figcaption>
          </figure>
        )}
      </div>
      <Link className="fh-stage-link" href={lineHref[active]}>
        <span>
          <strong>{product.title}</strong>
          {product.line}
        </span>
        <ArrowUpRight size={21} />
      </Link>
    </div>
  );
}

function Products() {
  return (
    <section
      className="fh-products"
      id="products"
      aria-labelledby="fh-products-title"
    >
      <div className="fh-section-intro">
        <SectionHead
          id="fh-products-title"
          kicker="我们正在做的产品"
          title="持续的工作，眼前的小事。"
          lead="从一次顺手的操作，到跨越几天的工作。找到适合你的那个入口。"
          layout="split"
        />
      </div>
      <div className="fo-stack">
        {folioStudio.products.slice(0, 2).map((p, i) => (
          <article
            className={`fo-sheet fh-product fh-product-${p.id}`}
            key={p.id}
            data-scene="enter"
            aria-labelledby={`fh-${p.id}-title`}
          >
            <div className="fo-sheet-inner">
              <div className="fh-product-copy">
                <span className="fh-product-number">0{i + 1}</span>
                <small>{p.category}</small>
                <h3 id={`fh-${p.id}-title`}>{p.title}</h3>
                <p className="fh-product-line">{p.line}</p>
                <p>{p.detail}</p>
                <ul>
                  {(p.id === 'work'
                    ? ['跨 Agent 继续', '资料就地处理', '工具按需扩展']
                    : ['在原处处理', '只展开眼前需要', '结果带着出处']
                  ).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <span className="fh-stage-label">{p.status}</span>
                <Actions
                  items={[
                    {
                      label: `了解 ${p.title}`,
                      href: lineHref[p.id],
                      tone: p.id === 'work' ? 'light' : 'ink',
                    },
                  ]}
                />
              </div>
              <div className="fh-product-demo">
                {p.id === 'work' ? <WorkDemo mode="relay" /> : <CursorDemo />}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="fh-explorations" id="lines">
        {folioStudio.products.slice(2).map((p) => {
          const id = p.id as 'life' | 'story';
          const img = lineImages[id];
          return (
            <article className={`fh-exploration fh-exploration-${id}`} key={id}>
              <div data-reveal>
                <small>
                  {p.category} / {p.status}
                </small>
                <h3>{p.title}</h3>
                <p>{p.line}</p>
                <Link href={lineHref[id]}>
                  了解 {p.title} <ArrowUpRight size={17} />
                </Link>
              </div>
              <figure data-scene="enter">
                <img
                  src={img.src}
                  width={img.w}
                  height={img.h}
                  alt={`${p.title} 的${img.note}`}
                  loading="lazy"
                />
                <figcaption>{img.note} · 示例内容</figcaption>
              </figure>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Team() {
  return (
    <section
      className="fh-team fo-section"
      id="about"
      data-bg="paper"
      aria-labelledby="fh-team-title"
    >
      <SectionHead
        id="fh-team-title"
        kicker="认识做产品的人"
        title="有经验，也始终好奇。"
        lead={team.text}
        layout="split"
      />
      <div className="fh-team-grid">
        {people.map((p, i) => (
          <article
            className={`fh-person fh-person-${p.tone}`}
            key={p.image}
            data-reveal
            style={{ '--i': i % 2 } as Vars}
          >
            <div className="fh-person-image">
              <img
                src={p.image}
                width="200"
                height="200"
                alt={`负责${p.personRole}的 Molis 团队成员`}
                loading="lazy"
                style={{ objectPosition: p.imagePosition }}
              />
              <span aria-hidden="true">0{i + 1}</span>
            </div>
            <h3>{p.personRole}</h3>
            <p>{p.experience}</p>
            <em>{p.aside}</em>
          </article>
        ))}
      </div>
      <div className="fo-proof">
        <p>{team.proof}</p>
        <div className="fo-logos">
          {companies.map((c) => (
            <span key={c.name} className={`fo-logo-${c.kind}`}>
              <img
                src={c.src}
                width={c.width}
                height={c.height}
                alt={c.name}
                loading="lazy"
              />
              {c.kind === 'linkedin' && <b>LinkedIn</b>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FolioDirection() {
  const ref = useFolioMotion();
  return (
    <div className="fo-site fh-site" ref={ref}>
      <SiteHeader />
      <main id="main">
        <section
          className="fh-cover"
          data-scene="leave"
          data-parallax
          aria-labelledby="fo-title"
        >
          <div className="fh-masthead" aria-hidden="true">
            {Array.from('Molis').map((letter, i) => (
              <span key={i} style={{ '--i': i } as Vars}>
                {letter}
              </span>
            ))}
            <sup>AI</sup>
          </div>
          <div className="fh-cover-copy">
            <span className="fo-kicker">Molis AI · 产品工作室</span>
            <h1 id="fo-title">
              我们做 AI 工作台，
              <br />
              和顺手的桌面工具。
            </h1>
            <p>
              也探索生活助手与互动世界。
              <br />让 AI 接住复杂的工作、眼前的小事，
              <br className="fh-desktop-break" />
              给生活与想象留出空间。
            </p>
            <Actions
              items={[
                { label: '看看我们的产品', href: '#products' },
                { label: '认识团队', href: '#about', tone: 'ghost' },
              ]}
            />
            <div className="fh-cover-index">
              <span>01 — 工作</span>
              <span>02 — 桌面</span>
              <span>03 — 生活</span>
              <span>04 — 故事</span>
            </div>
          </div>
          <ProductStage />
        </section>
        <Products />
        <Team />
        <section
          className="fo-section fh-community"
          data-bg="white"
          aria-labelledby="fh-community-title"
        >
          <SectionHead
            id="fh-community-title"
            kicker="一起试，一起创造"
            title="产品之外，还有做它们的方法。"
          />
          <div className="fh-community-links">
            {[
              {
                title: '来社区看看',
                text: '试试作品，看看创作过程，告诉我们可以怎样更好。',
                href: COMMUNITY,
                Icon: MessageSquare,
              },
              {
                title: '带走一个方法',
                text: '网页、动效、Prompt 和艺术家 Skill，边看边试。',
                href: '/wiki',
                Icon: Sparkles,
              },
              {
                title: '读一点我们的想法',
                text: '关于想法如何落地，以及技术与人的关系。',
                href: '/perspectives',
                Icon: BookOpen,
              },
            ].map(({ title, text, href, Icon }) => (
              <Link href={href} key={href} data-reveal>
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
                <ArrowUpRight size={22} />
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer>
        <section
          className="fh-enterprise"
          aria-labelledby="fh-enterprise-title"
        >
          <div>
            <span className="fh-enterprise-kicker">如果你来自企业或团队</span>
            <h2 id="fh-enterprise-title">
              带一个具体问题来，
              <br />
              我们一起把它做清楚。
            </h2>
          </div>
          <div>
            <p>{folioStudio.enterprise}</p>
            <Actions
              items={[
                { label: '了解解决方案', href: SOLUTIONS },
                {
                  label: '和我们聊聊',
                  href: contactHref('enterprise'),
                  tone: 'light',
                },
              ]}
            />
          </div>
        </section>
      </Footer>
    </div>
  );
}
