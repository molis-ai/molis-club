'use client';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  GITHUB_URL,
  screenshotNote,
  screenshots,
} from '../../../../content/molis-work';
import {
  coreProduct,
  ending,
  heroActions,
  lineImages,
  lines,
  linesIntro,
  positioning,
  solutions,
  team,
  vision,
} from '../../../../content/studio';
import Galaxy from './galaxy';
import { Actions, Hud, Phrases, Scope, Shot, Status, pad } from './kit';
import Planet from './planet';
import {
  COMMUNITY,
  Footer,
  SiteHeader,
  WORK,
  contactHref,
  lineHref,
  useReveal,
  type Vars,
} from './shared';
import './cosmos.css';
import './kit.css';
import './home.css';

// 文案来自 content/studio.ts，五个方向共用；这里只换成深空观测站的视觉。

type Person = {
  image: string;
  imagePosition?: string;
  personRole: string;
  experience: string;
  aside: string;
};

// 团队区这轮不动（人、照片、公司标识都保留），只是挪到首页最后
const people: Person[] = [
  {
    image: '/images/daylight/team/zhuangshi.jpg',
    personRole: 'AI 数据产品与复杂业务设计',
    experience:
      '曾任字节、美团核心团队 AI 数据产品资深专家；参与抖音数据管理及功能建设，拥有相关软件著作权，并受邀在 DataFun、美团大学与 CSDI Summit 分享实践。',
    aside: 'Molis 创始合伙人、首席布道人。Google 搜得到的女人。',
  },
  {
    image: '/images/daylight/team/yijun.jpg',
    personRole: '系统架构、产品与技术管理',
    experience:
      '曾在美团、字节、滴滴、LinkedIn 及多家硅谷创业公司的核心研发团队负责架构与管理，长期建设和演进高复杂度核心系统。',
    aside: 'Molis AI Founder。首席 Token 官，也是一个幻想家。',
  },
  {
    image: '/images/daylight/team/xiejun.jpeg',
    imagePosition: '50% 48%',
    personRole: 'AI Native 与 Agent 工程',
    experience:
      '8 年美团研发经验，较早参与企业知识库、RAG、Prompt Engineering 与 Agent 实践；长期深耕数据、计算、平台架构和复杂系统工程化，目前聚焦 AI Agent、AI Coding 与 AI Native 软件架构。',
    aside: '从北京骑回南宁的工程师。叫我谢尊。',
  },
  {
    image: '/images/daylight/team/xinyi.jpg',
    imagePosition: '50% 54%',
    personRole: '业务增长与客户共创',
    experience:
      '曾在美团、字节、小红书核心团队负责数据运营，对接 100+ 客户团队，参与共创月百万级业务增量，持续寻找 AI 能力真正进入业务的落点。',
    aside: 'Molis AI 下一任 CEO 候选人之一。',
  },
];

const companies = [
  {
    name: '美团',
    kind: 'meituan',
    src: '/images/daylight/company_logo/美团/美团横式色彩标识.png',
    width: 1896,
    height: 687,
  },
  {
    name: '抖音集团',
    kind: 'douyin',
    src: '/images/daylight/company_logo/douyin-group.jpg',
    width: 1749,
    height: 800,
  },
  {
    name: '滴滴',
    kind: 'didi',
    src: '/images/daylight/company_logo/didi.jpg',
    width: 823,
    height: 800,
  },
  {
    name: 'LinkedIn',
    kind: 'linkedin',
    src: '/images/daylight/company_logo/linkedin-svgrepo-com.svg',
    width: 382,
    height: 382,
  },
  {
    name: '小红书',
    kind: 'red',
    src: '/images/daylight/company_logo/red.jpeg',
    width: 4804,
    height: 3200,
  },
];

/** 一位成员：照片、角色和一句自述常显；经历收在注记里，悬停、聚焦或轻点时展开 */
function Member({ person, index }: { person: Person; index: number }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLLIElement>(null);
  const id = useId();
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
    <li
      className="cs-member"
      ref={root}
      data-open={open}
      style={{ '--i': index } as Vars}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-note`}
        aria-labelledby={`${id}-role`}
        onClick={() => setOpen((value) => !value)}
      >
        <img
          src={person.image}
          width="120"
          height="120"
          alt=""
          loading="lazy"
          style={{ objectPosition: person.imagePosition }}
        />
      </button>
      <strong id={`${id}-role`}>{person.personRole}</strong>
      <em>{person.aside}</em>
      <p className="cs-member-note" id={`${id}-note`}>
        {person.experience}
      </p>
    </li>
  );
}

function Hero() {
  return (
    <section className="cs-hero" aria-labelledby="cs-title">
      <Hud />
      <div className="cs-hero-copy">
        <h1 id="cs-title">
          <Phrases text={vision} />
        </h1>
        <p>{positioning}</p>
        <Actions
          items={[
            { label: heroActions.primary, href: WORK, tone: 'primary' },
            { label: heroActions.secondary, href: '#lines' },
          ]}
        />
      </div>
      <span className="cs-scroll-cue" aria-hidden="true" />
    </section>
  );
}

function CoreProduct() {
  const shot = screenshots.goal;
  return (
    <section id="products" className="cs-core" aria-labelledby="cs-core-title">
      <div className="cs-core-copy cs-reveal">
        <span className="cs-eyebrow">{coreProduct.kicker}</span>
        <h2 id="cs-core-title">{coreProduct.name}</h2>
        <p className="cs-core-line">
          <Phrases text={coreProduct.line} />
        </p>
        <ol className="cs-core-points">
          {coreProduct.highlights.map((item, index) => (
            <li key={item}>
              <span className="cs-index">{pad(index)}</span>
              <strong>{item}</strong>
            </li>
          ))}
        </ol>
        <Status items={coreProduct.status} />
        <Actions
          items={[
            { label: coreProduct.actions.more, href: WORK, tone: 'primary' },
            {
              label: coreProduct.actions.github,
              href: GITHUB_URL,
              external: true,
            },
          ]}
        />
      </div>
      <div className="cs-core-visual" data-scroll>
        <Planet kind="work" className="cs-core-planet" />
        <Scope caption={screenshotNote} className="cs-core-scope">
          <Shot src={shot.src} w={shot.w} h={shot.h} label={shot.label} />
        </Scope>
      </div>
    </section>
  );
}

function Solutions() {
  return (
    <section
      id="solutions"
      className="cs-solutions"
      aria-labelledby="cs-solutions-title"
    >
      <div className="cs-solutions-head cs-reveal">
        <span className="cs-eyebrow">{solutions.kicker}</span>
        <h2 id="cs-solutions-title">
          <Phrases text={solutions.title} />
        </h2>
        <p>{solutions.lede}</p>
      </div>
      <ol className="cs-steps" data-reveal>
        <svg
          className="cs-constellation"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M40 92 L200 60 L400 84 L600 30 L800 70 L1000 22 L1160 52" />
        </svg>
        {solutions.steps.map((step, index) => (
          <li key={step} style={{ '--i': index } as Vars}>
            <span className="cs-step-index">{pad(index)}</span>
            <h3>{step}</h3>
          </li>
        ))}
      </ol>
      <div className="cs-directions cs-reveal">
        <h3>{solutions.directionsLabel}</h3>
        <ul>
          {solutions.directions.map((direction, index) => (
            <li key={direction.title}>
              <span className="cs-index">{pad(index)}</span>
              <strong>{direction.title}</strong>
              <em>{direction.status}</em>
            </li>
          ))}
        </ul>
        <Actions
          items={[
            {
              label: solutions.action,
              href: contactHref('enterprise'),
              tone: 'primary',
            },
          ]}
        />
      </div>
    </section>
  );
}

/** 三条产品线是三颗绕着同一颗恒星的行星；滚到哪一条，哪一颗就亮起来 */
function Lines() {
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="lines" className="cs-lines" aria-labelledby="cs-lines-title">
      <div className="cs-lines-intro cs-reveal">
        <h2 id="cs-lines-title">
          <Phrases text={linesIntro.title} />
        </h2>
      </div>

      <div className="cs-lines-body">
        <div className="cs-orrery" aria-hidden="true">
          <div className="cs-orrery-sun" />
          {lines.map((line, index) => (
            <div
              key={line.id}
              className={`cs-orbit cs-orbit-${index}${active === index ? ' is-active' : ''}`}
            >
              <span className="cs-orbit-carrier">
                <Planet kind={line.id} />
                <span className="cs-orbit-label">{line.name}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="cs-line-list">
          {lines.map((line, index) => {
            const image = lineImages[line.id];
            return (
              <article
                key={line.id}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                data-index={index}
                className={`cs-line${active === index ? ' is-active' : ''}`}
                aria-labelledby={`cs-line-${line.id}`}
              >
                <Planet kind={line.id} className="cs-line-planet" />
                <div className="cs-line-meta">
                  <span className="cs-index">{pad(index)}</span>
                  <span>{line.area}</span>
                  <span className="cs-line-status">{line.status}</span>
                </div>
                <h3 id={`cs-line-${line.id}`}>
                  <Link href={lineHref[line.id]}>{line.name}</Link>
                </h3>
                <p>
                  <Phrases text={line.line} />
                </p>
                <Link
                  href={lineHref[line.id]}
                  className="cs-line-plate"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    src={image.src}
                    width={image.w}
                    height={image.h}
                    alt=""
                    loading="lazy"
                    style={{ objectPosition: image.position }}
                  />
                  <span>{image.note}</span>
                </Link>
                <Link className="cs-line-more" href={lineHref[line.id]}>
                  {line.more}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="about" className="cs-team" aria-labelledby="cs-team-title">
      <div className="cs-team-intro cs-reveal">
        <span className="cs-eyebrow">{team.kicker}</span>
        <h2 id="cs-team-title">
          {team.title.map((line) => (
            <span className="cs-phrase" key={line}>
              {line}
            </span>
          ))}
        </h2>
        <p>{team.text}</p>
      </div>

      <div className="cs-crew-wrap" data-reveal>
        <svg
          className="cs-crew-line"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M150 96 L450 40 L750 112 L1050 52" />
        </svg>
        <ul className="cs-crew">
          {people.map((person, index) => (
            <Member key={person.image} person={person} index={index} />
          ))}
        </ul>
      </div>

      <div className="cs-proof" aria-label="团队成员的职业经历">
        <p>{team.proof}</p>
        <div className="cs-company-logos">
          {companies.map((company) => (
            <span
              key={company.name}
              className={`cs-company-logo cs-company-logo-${company.kind}`}
            >
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

export default function CosmosDirection() {
  const siteRef = useReveal();
  const { community, contact } = ending.paths;

  return (
    <div className="cs-site" ref={siteRef}>
      <SiteHeader />

      <main id="main">
        <div id="cs-deep" className="cs-deep">
          <Galaxy track="#cs-deep" />
          <Hero />
          <CoreProduct />
        </div>
        <Solutions />
        <Lines />
        <Team />
      </main>

      <Footer>
        <section
          className="cs-footer-invite cs-reveal"
          aria-labelledby="cs-invite-title"
        >
          <h2 id="cs-invite-title">{ending.title}</h2>
        </section>
        <div className="cs-footer-paths">
          <Link href={COMMUNITY} className="cs-footer-path">
            <Planet kind="life" className="cs-footer-path-planet" />
            <small>{community.label}</small>
            <h3>
              {community.title.map((line) => (
                <span className="cs-phrase" key={line}>
                  {line}
                </span>
              ))}
            </h3>
            <span>
              {community.action} <ArrowUpRight size={19} aria-hidden="true" />
            </span>
          </Link>
          <Link href={contactHref('enterprise')} className="cs-footer-path">
            <Planet kind="work" className="cs-footer-path-planet" />
            <small>{contact.label}</small>
            <h3>
              {contact.title.map((line) => (
                <span className="cs-phrase" key={line}>
                  {line}
                </span>
              ))}
            </h3>
            <span>
              {contact.action} <ArrowUpRight size={19} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </Footer>
    </div>
  );
}
