'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
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
  type Line,
} from '../../../../content/studio';
import { CoverArt, LifeArt, StoryArt, ToolArt } from './art';
import { Actions, Collage, Frame, Phrases, Status, pad } from './kit';
import {
  COMMUNITY,
  Footer,
  SiteHeader,
  WORK,
  contactHref,
  lineHref,
  useFolioMotion,
  type Vars,
} from './shared';
import './folio.css';
import './kit.css';

// 文案来自 content/studio.ts，五个方向共用；这里只换成 Folio 的剪纸杂志视觉。

const companies = [
  {
    name: '美团',
    src: '/images/daylight/company_logo/美团/美团横式色彩标识.png',
    width: 1896,
    height: 687,
    kind: 'meituan',
  },
  {
    name: '抖音集团',
    src: '/images/daylight/company_logo/douyin-group.jpg',
    width: 1749,
    height: 800,
    kind: 'douyin',
  },
  {
    name: '滴滴',
    src: '/images/daylight/company_logo/didi.jpg',
    width: 823,
    height: 800,
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
    width: 4804,
    height: 3200,
    kind: 'red',
  },
];

type Person = {
  image: string;
  imagePosition?: string;
  personRole: string;
  experience: string;
  aside: string;
  tone: string;
};

// 团队区这轮不动（第一轮 06、07 待定）：人、照片和公司标识照旧，经历收进点开的便笺
const people: Person[] = [
  {
    image: '/images/daylight/team/zhuangshi.jpg',
    personRole: 'AI 数据产品与复杂业务设计',
    experience:
      '曾任字节、美团核心团队 AI 数据产品资深专家；参与抖音数据管理及功能建设，拥有相关软件著作权，并受邀在 DataFun、美团大学与 CSDI Summit 分享实践。',
    aside: 'Molis 创始合伙人、首席布道人。Google 搜得到的女人。',
    tone: 'red',
  },
  {
    image: '/images/daylight/team/yijun.jpg',
    personRole: '系统架构、产品与技术管理',
    experience:
      '曾在美团、字节、滴滴、LinkedIn 及多家硅谷创业公司的核心研发团队负责架构与管理，长期建设和演进高复杂度核心系统。',
    aside: 'Molis AI Founder。首席 Token 官，也是一个幻想家。',
    tone: 'blue',
  },
  {
    image: '/images/daylight/team/xiejun.jpeg',
    imagePosition: '50% 48%',
    personRole: 'AI Native 与 Agent 工程',
    experience:
      '8 年美团研发经验，较早参与企业知识库、RAG、Prompt Engineering 与 Agent 实践；长期深耕数据、计算、平台架构和复杂系统工程化，目前聚焦 AI Agent、AI Coding 与 AI Native 软件架构。',
    aside: '从北京骑回南宁的工程师。叫我谢尊。',
    tone: 'sage',
  },
  {
    image: '/images/daylight/team/xinyi.jpg',
    imagePosition: '50% 54%',
    personRole: '业务增长与客户共创',
    experience:
      '曾在美团、字节、小红书核心团队负责数据运营，对接 100+ 客户团队，参与共创月百万级业务增量，持续寻找 AI 能力真正进入业务的落点。',
    aside: 'Molis AI 下一任 CEO 候选人之一。',
    tone: 'yellow',
  },
];

/** 一位成员：照片垫着色纸，悬停、键盘聚焦或点按照片时，旁边翻出写着经历的便笺 */
function PersonCard({
  index,
  image,
  imagePosition,
  personRole,
  experience,
  aside,
  tone,
}: Person & { index: number }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const noteId = `fo-person-note-${index}`;
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
    <div
      className={`fo-person fo-tone-${tone}`}
      ref={root}
      data-open={open}
      data-reveal
      style={{ '--i': index } as Vars}
    >
      <button
        type="button"
        className="fo-person-photo"
        aria-expanded={open}
        aria-controls={noteId}
        aria-label={`认识团队里负责${personRole}的成员`}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <img
          src={image}
          width="160"
          height="160"
          alt=""
          loading="lazy"
          style={{ objectPosition: imagePosition }}
        />
      </button>
      <strong>{personRole}</strong>
      <em>{aside}</em>
      <p className="fo-person-note" id={noteId}>
        {experience}
      </p>
    </div>
  );
}

function CoreProduct() {
  const shot = screenshots.goal;
  return (
    <section id="products" className="fo-core" aria-labelledby="fo-core-title">
      <div className="fo-core-copy" data-reveal>
        <span className="fo-kicker">{coreProduct.kicker}</span>
        <h2 id="fo-core-title">{coreProduct.name}</h2>
        <p className="fo-core-line">{coreProduct.line}</p>
        <ol className="fo-core-points">
          {coreProduct.highlights.map((item, index) => (
            <li key={item}>
              <span aria-hidden="true">{pad(index)}</span>
              {item}
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
              tone: 'ghost',
            },
          ]}
        />
      </div>
      <Collage note={screenshotNote} className="fo-core-collage">
        <Frame src={shot.src} w={shot.w} h={shot.h} label={shot.label} />
      </Collage>
    </section>
  );
}

function Solutions() {
  return (
    <section
      id="solutions"
      className="fo-solutions"
      aria-labelledby="fo-solutions-title"
    >
      <header className="fo-head" data-layout="split" data-reveal>
        <div>
          <span className="fo-kicker">{solutions.kicker}</span>
          <h2 id="fo-solutions-title">
            <Phrases text={solutions.title} />
          </h2>
        </div>
        <div className="fo-head-side">
          <p>{solutions.lede}</p>
        </div>
      </header>
      <ol className="fo-steps">
        {solutions.steps.map((step, index) => (
          <li key={step} data-reveal style={{ '--i': index } as Vars}>
            <span className="fo-num" aria-hidden="true">
              {index + 1}
            </span>
            <h3>{step}</h3>
          </li>
        ))}
      </ol>
      <div className="fo-directions" data-reveal>
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
            {
              label: solutions.action,
              href: contactHref('enterprise'),
              tone: 'light',
            },
          ]}
        />
      </div>
    </section>
  );
}

const lineArt: Record<
  Line['id'],
  (props: { note?: string }) => React.JSX.Element
> = { life: LifeArt, tool: ToolArt, story: StoryArt };

function Lines() {
  return (
    <section id="lines" className="fo-lines" aria-labelledby="fo-lines-title">
      <header className="fo-lines-intro" data-reveal>
        <h2 id="fo-lines-title">
          <Phrases text={linesIntro.title} />
        </h2>
      </header>
      <div className="fo-stack">
        {lines.map((line, index) => {
          const Art = lineArt[line.id];
          return (
            <article
              key={line.id}
              className={`fo-sheet fo-sheet-${line.id}`}
              data-scene="enter"
              aria-labelledby={`fo-line-${line.id}`}
            >
              <div className="fo-sheet-inner">
                <div className="fo-sheet-copy">
                  <span className="fo-sheet-number" aria-hidden="true">
                    {pad(index)}
                  </span>
                  <div className="fo-sheet-meta">
                    <span>{line.area}</span>
                    <span>{line.status}</span>
                  </div>
                  <h3 id={`fo-line-${line.id}`}>
                    <Link href={lineHref[line.id]}>{line.name}</Link>
                  </h3>
                  <p>{line.line}</p>
                  <Link className="fo-sheet-more" href={lineHref[line.id]}>
                    {line.more}
                    <span aria-hidden="true">
                      <ArrowUpRight size={20} />
                    </span>
                  </Link>
                </div>
                <Art note={lineImages[line.id].note} />
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
    <section id="about" className="fo-people" aria-labelledby="fo-people-title">
      <div className="fo-people-head" data-reveal>
        <span className="fo-kicker">{team.kicker}</span>
        <h2 id="fo-people-title">
          {team.title[0]}
          <br />
          {team.title[1]}
        </h2>
        <p>{team.text}</p>
      </div>

      <div className="fo-people-grid">
        {people.map((person, index) => (
          <PersonCard key={person.image} index={index} {...person} />
        ))}
      </div>

      <div className="fo-proof" aria-label="团队成员的职业经历">
        <p>{team.proof}</p>
        <div className="fo-logos">
          {companies.map((company) => (
            <span key={company.name} className={`fo-logo-${company.kind}`}>
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

export default function FolioDirection() {
  const rootRef = useFolioMotion();
  const { community, contact } = ending.paths;
  const mark = ending.title.slice(-1);

  return (
    <div className="fo-site" ref={rootRef}>
      <SiteHeader />

      <main id="main">
        <section
          className="fo-cover"
          data-scene="leave"
          data-parallax
          aria-labelledby="fo-title"
        >
          <div className="fo-masthead" aria-hidden="true" lang="en">
            {Array.from('Molis').map((letter, index) => (
              <span key={index} style={{ '--i': index } as Vars}>
                {letter}
              </span>
            ))}
            <sup>AI</sup>
          </div>
          <div className="fo-cover-art">
            <CoverArt />
          </div>
          <div className="fo-cover-copy">
            <h1 id="fo-title">
              <Phrases text={vision} />
            </h1>
            <p>{positioning}</p>
            <Actions
              items={[
                { label: heroActions.primary, href: WORK },
                { label: heroActions.secondary, href: '#lines', tone: 'ghost' },
              ]}
            />
          </div>
        </section>

        <CoreProduct />
        <Solutions />
        <Lines />
        <Team />
      </main>

      <Footer>
        <section className="fo-ending" aria-labelledby="fo-ending-title">
          <h2 id="fo-ending-title" data-reveal>
            {ending.title.slice(0, -1)}
            <span className="fo-back-mark">{mark}</span>
          </h2>
          <div className="fo-back-paths">
            <Link href={COMMUNITY} className="fo-back-path">
              <small>{community.label}</small>
              <h3>
                {community.title.map((line) => (
                  <span className="fo-phrase" key={line}>
                    {line}
                  </span>
                ))}
              </h3>
              <span>
                {community.action}
                <ArrowUpRight size={19} aria-hidden="true" />
              </span>
            </Link>
            <Link href={contactHref('enterprise')} className="fo-back-path">
              <small>{contact.label}</small>
              <h3>
                {contact.title.map((line) => (
                  <span className="fo-phrase" key={line}>
                    {line}
                  </span>
                ))}
              </h3>
              <span>
                {contact.action}
                <ArrowUpRight size={19} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </section>
      </Footer>
    </div>
  );
}
