'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  HandHelping,
  Languages,
  Lightbulb,
  MousePointer2,
  NotebookPen,
} from 'lucide-react';
import {
  GITHUB_URL,
  screenshotNote,
  screenshots,
} from '../../../../content/molis-work';
import { handoff } from '../../../../content/molis-life';
import { demo } from '../../../../content/molis-tool';
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
  type Line,
} from '../../../../content/studio';
import { Actions, Closing, Status, Window } from './kit';
import {
  COMMUNITY,
  Footer,
  LeafShadow,
  MaskLines,
  Phrases,
  RiseTitle,
  SiteHeader,
  WORK,
  contactHref,
  lineHref,
  pad,
  rows,
  tokens,
  trackSpotlight,
  useDaylight,
  type Vars,
} from './shared';
import './daylight.css';
import './kit.css';

// 文案来自 content/studio.ts，五个方向共用；这里只换成 Daylight 的「一天的光」：
// 清晨的首屏，上午的核心产品与解决方案，正午的产品线，午后的团队，最后落到黄昏的邀请。

const companies = [
  {
    name: '美团',
    src: '/images/daylight/company_logo/美团/美团横式色彩标识.png',
    width: 480,
    height: 174,
    kind: 'meituan',
  },
  {
    name: '抖音集团',
    src: '/images/daylight/company_logo/douyin-group.jpg',
    width: 452,
    height: 159,
    kind: 'douyin',
  },
  {
    name: '滴滴',
    src: '/images/daylight/company_logo/didi.jpg',
    width: 461,
    height: 156,
    kind: 'didi',
  },
  {
    name: 'LinkedIn',
    src: '/images/daylight/company_logo/linkedin-svgrepo-com.svg',
    width: 382,
    height: 382,
    kind: 'linkedin',
  },
  {
    name: '小红书',
    src: '/images/daylight/company_logo/red.jpeg',
    width: 480,
    height: 320,
    kind: 'red',
  },
];

type Person = {
  image: string;
  imagePosition?: string;
  personRole: string;
  experience: string;
  aside: string;
};

// 团队区这轮不动（第一轮 06、07 待定），只是从能力章节里挪出来单独成排；经历收进点开的小便笺
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

/** 一位成员：照片、分工和一句自述常驻；经历在悬停、键盘聚焦或轻点时展开 */
function PersonCard({ person, index }: { person: Person; index: number }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLLIElement>(null);
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
  const noteId = `dl-person-note-${index}`;
  return (
    <li
      className="dl-person dl-reveal"
      ref={root}
      data-open={open}
      style={{ '--r': index } as Vars}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={noteId}
        aria-label={`认识团队里负责${person.personRole}的成员`}
        onClick={() => setOpen((value) => !value)}
      >
        <img
          src={person.image}
          loading="lazy"
          width="120"
          height="120"
          alt=""
          style={{ objectPosition: person.imagePosition }}
        />
        <i aria-hidden="true" />
      </button>
      <strong>{person.personRole}</strong>
      <em>{person.aside}</em>
      <div className="dl-person-note" id={noteId}>
        <p>{person.experience}</p>
      </div>
    </li>
  );
}

function CoreProduct() {
  const shot = screenshots.goal;
  return (
    <section id="products" className="dl-core" aria-labelledby="dl-core-title">
      <div className="dl-core-copy dl-reveal">
        <span className="dl-eyebrow">{coreProduct.kicker}</span>
        <h2 id="dl-core-title">{coreProduct.name}</h2>
        <p className="dl-core-line">{coreProduct.line}</p>
        <ol className="dl-core-points">
          {coreProduct.highlights.map((item, index) => (
            <li key={item}>
              <span>{pad(index)}</span>
              <strong>{item}</strong>
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
              tone: 'line',
            },
          ]}
        />
      </div>
      <figure className="dl-core-stage" data-scene="pass">
        <div className="dl-stage-sun" aria-hidden="true" />
        <LeafShadow className="dl-leaves dl-stage-leaves" />
        <div className="dl-core-window">
          <Window src={shot.src} w={shot.w} h={shot.h} label={shot.label} />
        </div>
        <figcaption>{screenshotNote}</figcaption>
      </figure>
    </section>
  );
}

function Solutions() {
  let order = 0;
  return (
    <section
      id="solutions"
      className="dl-solutions"
      aria-labelledby="dl-solutions-title"
    >
      <div
        className="dl-statement"
        data-scene="pin"
        style={{ '--n': Array.from(solutions.title).length } as Vars}
      >
        <div className="dl-statement-sticky">
          <div className="dl-statement-sun" aria-hidden="true" />
          <LeafShadow className="dl-leaves dl-statement-leaves" />
          <span className="dl-eyebrow">{solutions.kicker}</span>
          <h2
            id="dl-solutions-title"
            className="dl-statement-text"
            aria-label={solutions.title}
          >
            {rows(solutions.title).map((phrase) => (
              <span className="dl-phrase" key={phrase} aria-hidden="true">
                {tokens(phrase).map((token, index) => (
                  <span
                    className="dl-char"
                    key={index}
                    style={{ '--i': order++ } as Vars}
                  >
                    {token}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p className="dl-statement-lede">
            <Phrases text={solutions.lede} />
          </p>
        </div>
      </div>

      <div className="dl-solutions-body">
        <ol className="dl-steps">
          {solutions.steps.map((step, index) => (
            <li
              className="dl-step dl-reveal"
              key={step}
              style={{ '--r': index } as Vars}
            >
              <span className="dl-step-index">{pad(index)}</span>
              <h3>{step}</h3>
            </li>
          ))}
        </ol>
        <div className="dl-directions dl-reveal">
          <div className="dl-directions-sun" aria-hidden="true" />
          <h3>{solutions.directionsLabel}</h3>
          <ul>
            {solutions.directions.map((direction, index) => (
              <li key={direction.title}>
                <span aria-hidden="true">{pad(index)}</span>
                <strong>{direction.title}</strong>
                <em>{direction.status}</em>
              </li>
            ))}
          </ul>
          <Actions
            items={[
              { label: solutions.action, href: contactHref('enterprise') },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- 产品线画面：照片上浮着一块示意，都标着 content 里的说法 ---------- */

const lifeIcons = [HandHelping, Lightbulb, Bookmark];

/** Life：随手交代的三种意图，浮在阅读角的照片上 */
function LifeMock() {
  return (
    <span className="dl-mock dl-mock-life" aria-hidden="true">
      {handoff.intents.map((intent, index) => {
        const Icon = lifeIcons[index];
        return (
          <span
            className="dl-mock-card"
            key={intent}
            style={{ '--r': index } as Vars}
          >
            <span className="dl-mock-icon">
              <Icon size={16} />
            </span>
            <strong>{intent}</strong>
            <i />
          </span>
        );
      })}
    </span>
  );
}

const toolIcons = [Languages, Lightbulb, NotebookPen];

/** Tool：一段选中的文字，句尾冒出三个动作 */
function ToolMock() {
  return (
    <span className="dl-mock dl-mock-tool" aria-hidden="true">
      <span className="dl-mock-page">
        <i />
        <i />
        <span className="dl-mock-select">
          <i />
          <i />
        </span>
        <i />
      </span>
      <span className="dl-mock-chips">
        <span className="dl-mock-dot">
          <i />
        </span>
        {demo.actions.map((action, index) => {
          const Icon = toolIcons[index];
          return (
            <span
              className="dl-mock-chip"
              key={action}
              style={{ '--r': index } as Vars}
            >
              <Icon size={13} />
              {action}
            </span>
          );
        })}
        <MousePointer2
          className="dl-mock-cursor"
          size={20}
          fill="currentColor"
          strokeWidth={1.4}
        />
      </span>
    </span>
  );
}

/** Story：门里慢慢展开另一个世界 */
function StoryMock() {
  const image = lineImages.story;
  return (
    <img
      className="dl-mock-world"
      src={image.src}
      width={image.w}
      height={image.h}
      alt=""
      loading="lazy"
      style={{ objectPosition: image.position }}
    />
  );
}

const lineArt: Record<
  Line['id'],
  { photo: string; w: number; h: number; Mock: ComponentType }
> = {
  life: {
    photo: '/images/atelier/reading-room.jpg',
    w: 1440,
    h: 960,
    Mock: LifeMock,
  },
  tool: {
    photo: '/images/edition-c/making-study.jpg',
    w: 1536,
    h: 1024,
    Mock: ToolMock,
  },
  story: {
    photo: '/images/atelier/threshold.jpg',
    w: 1440,
    h: 900,
    Mock: StoryMock,
  },
};

function LineCopy({ line, headingId }: { line: Line; headingId?: string }) {
  return (
    <>
      <div className="dl-product-meta">
        <span className="dl-product-area">{line.area}</span>
        <span className="dl-status">{line.status}</span>
      </div>
      <h3 id={headingId}>
        <Link href={lineHref[line.id]}>{line.name}</Link>
      </h3>
      <p>{line.line}</p>
      <Link href={lineHref[line.id]} className="dl-text-link">
        {line.more}
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </>
  );
}

function Lines() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    // is-seen 加在 className 固定的画框上，active 变化引起的重渲染不会把它抹掉
    const panels = Array.from(
      section.querySelectorAll<HTMLElement>('.dl-panel'),
    );
    const spotter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target
            .querySelector('.dl-panel-frame')
            ?.classList.add('is-seen');
          const index = panels.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    panels.forEach((panel) => spotter.observe(panel));
    return () => spotter.disconnect();
  }, []);

  return (
    <section
      id="lines"
      ref={root}
      className="dl-showcase"
      aria-labelledby="dl-lines-title"
    >
      <div className="dl-showcase-rail">
        <h2 id="dl-lines-title" className="dl-reveal">
          <MaskLines lines={rows(linesIntro.title)} />
        </h2>
        <ol className="dl-showcase-nav">
          {lines.map((line, index) => (
            <li key={line.id}>
              <a
                href={`#line-${line.id}`}
                aria-current={active === index ? 'true' : undefined}
              >
                <span>{pad(index)}</span>
                {line.name}
              </a>
            </li>
          ))}
        </ol>
        <div className="dl-showcase-copy">
          {lines.map((line, index) => (
            <div
              key={line.id}
              className={`dl-line-copy${active === index ? ' is-active' : ''}`}
            >
              <LineCopy line={line} />
            </div>
          ))}
        </div>
      </div>

      <div className="dl-showcase-panels">
        {lines.map((line, index) => {
          const { photo, w, h, Mock } = lineArt[line.id];
          return (
            <article
              key={line.id}
              id={`line-${line.id}`}
              className={`dl-panel dl-panel-${line.id}`}
              data-scene="pass"
              aria-labelledby={`dl-line-${line.id}`}
            >
              <Link
                href={lineHref[line.id]}
                className="dl-panel-frame"
                tabIndex={-1}
                aria-hidden="true"
              >
                <img
                  className="dl-panel-photo"
                  src={photo}
                  width={w}
                  height={h}
                  alt=""
                  loading="lazy"
                />
                <span className="dl-panel-shade" />
                <Mock />
                <span className="dl-panel-note">
                  <span>{pad(index)}</span>
                  {lineImages[line.id].note}
                </span>
              </Link>
              <div className="dl-panel-copy">
                <LineCopy line={line} headingId={`dl-line-${line.id}`} />
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
    <section id="about" className="dl-team" aria-labelledby="dl-team-title">
      <div className="dl-team-head">
        <div className="dl-reveal">
          <span className="dl-eyebrow">{team.kicker}</span>
          <h2 id="dl-team-title">
            <MaskLines lines={team.title} />
          </h2>
        </div>
        <p className="dl-reveal">{team.text}</p>
      </div>

      <figure className="dl-team-image dl-reveal" data-scene="pass">
        <img
          src="/images/atelier/shared-studio.jpg"
          width="1440"
          height="960"
          alt=""
          loading="lazy"
        />
      </figure>

      <ul className="dl-people">
        {people.map((person, index) => (
          <PersonCard key={person.image} person={person} index={index} />
        ))}
      </ul>

      <div className="dl-proof">
        <p>{team.proof}</p>
        <div className="dl-marquee">
          <div className="dl-marquee-track">
            {[0, 1].map((copy) => (
              <div
                className="dl-marquee-group"
                key={copy}
                aria-hidden={copy === 1 ? 'true' : undefined}
              >
                {companies.map((company) => (
                  <span
                    key={company.name}
                    className={`dl-company-logo dl-company-logo-${company.kind}`}
                  >
                    <img
                      src={company.src}
                      width={company.width}
                      height={company.height}
                      alt={copy === 0 ? company.name : ''}
                      loading="lazy"
                    />
                    {company.kind === 'linkedin' ? <b>LinkedIn</b> : null}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DaylightDirection() {
  const siteRef = useDaylight();
  const { community, contact } = ending.paths;

  return (
    <div className="dl-site" ref={siteRef}>
      <SiteHeader />

      <main id="main">
        <section
          className="dl-hero dl-hero-home"
          data-scene="exit"
          aria-labelledby="dl-title"
        >
          <div className="dl-hero-frame">
            <div className="dl-hero-open">
              <div className="dl-hero-media">
                <img
                  className="dl-hero-photo"
                  src="/images/edition-c/studio-light.jpg"
                  width="1672"
                  height="941"
                  alt=""
                  fetchPriority="high"
                />
              </div>
              <div className="dl-hero-shade" />
              <div className="dl-hero-glow" />
              <LeafShadow className="dl-leaves dl-hero-leaves" />
              <div className="dl-hero-body">
                <div className="dl-hero-copy">
                  <RiseTitle id="dl-title" text={vision} />
                  <div className="dl-hero-lower">
                    <p>{positioning}</p>
                    <Actions
                      items={[
                        {
                          label: heroActions.primary,
                          href: WORK,
                          tone: 'light',
                        },
                        {
                          label: heroActions.secondary,
                          href: '#lines',
                          tone: 'glass',
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CoreProduct />
        <Solutions />
        <Lines />
        <Team />
      </main>

      <Footer>
        <Closing id="dl-ending-title" title={[ending.title]}>
          <div className="dl-dusk-paths">
            {[
              { path: community, href: COMMUNITY },
              { path: contact, href: contactHref('enterprise') },
            ].map(({ path, href }) => (
              <Link
                key={href}
                href={href}
                className="dl-path dl-reveal"
                onPointerMove={trackSpotlight}
              >
                <small>{path.label}</small>
                <h3>
                  {path.title.map((line) => (
                    <span className="dl-phrase" key={line}>
                      {line}
                    </span>
                  ))}
                </h3>
                <span className="dl-path-action">
                  {path.action}
                  <ArrowUpRight size={19} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </Closing>
      </Footer>
    </div>
  );
}
