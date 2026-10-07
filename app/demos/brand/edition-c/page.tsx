'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ImageCurtain } from '../../../image-curtain';
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
import { Actions, Frame, Phrases, Status, pad } from './kit';
import {
  COMMUNITY,
  Footer,
  SiteHeader,
  TypedWordmark,
  WORK,
  WordCycle,
  contactHref,
  lineHref,
  useEditionMotion,
  type Vars,
} from './shared';
import './edition-c.css';
import './kit.css';

// 文案来自 content/studio.ts，五个方向共用；这里只换成 Edition C 的视觉。

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

// 团队区这轮不动（第一轮 06、07 待定），只是从能力卡里挪出来单独成排
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

function PersonNote({
  image,
  imagePosition,
  personRole,
  experience,
  aside,
}: Person) {
  return (
    <div className="ec-person">
      <button type="button" aria-label={`认识团队里负责${personRole}的成员`}>
        <img
          src={image}
          loading="lazy"
          width="120"
          height="120"
          alt=""
          style={{ objectPosition: imagePosition }}
        />
      </button>
      <div className="ec-person-note" role="tooltip">
        <small>团队成员</small>
        <strong>{personRole}</strong>
        <p>{experience}</p>
        <em>{aside}</em>
      </div>
    </div>
  );
}

function CoreProduct() {
  const shot = screenshots.goal;
  return (
    <section id="products" className="ec-core" aria-labelledby="ec-core-title">
      <div className="ec-core-copy ec-reveal">
        <span className="ec-eyebrow">{coreProduct.kicker}</span>
        <h2 id="ec-core-title">{coreProduct.name}</h2>
        <p className="ec-core-line">{coreProduct.line}</p>
        <ol className="ec-core-points">
          {coreProduct.highlights.map((item, index) => (
            <li key={item}>
              <span className="ec-core-index">{pad(index)}</span>
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
              tone: 'light',
            },
          ]}
        />
      </div>
      <figure className="ec-core-visual" data-scroll="pass">
        <img
          className="ec-core-photo"
          src="/images/atelier/studio-desk.jpg"
          width="1440"
          height="960"
          alt=""
          loading="lazy"
        />
        <div className="ec-core-window">
          <Frame src={shot.src} w={shot.w} h={shot.h} label={shot.label} />
        </div>
        <figcaption>{screenshotNote}</figcaption>
      </figure>
    </section>
  );
}

function Lines() {
  return (
    <section id="lines" className="ec-lines" aria-labelledby="ec-lines-title">
      <div className="ec-lines-intro ec-reveal">
        <h2 id="ec-lines-title">
          <Phrases text={linesIntro.title} />
        </h2>
      </div>
      <div className="ec-line-cards">
        {lines.map((line, index) => {
          const image = lineImages[line.id];
          return (
            <article
              key={line.id}
              className="ec-line ec-reveal"
              style={{ '--r': index } as Vars}
              aria-labelledby={`ec-line-${line.id}`}
            >
              <Link
                href={lineHref[line.id]}
                className="ec-line-media"
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
              <div className="ec-line-body">
                <div className="ec-line-meta">
                  <span>{line.area}</span>
                  <span>{line.status}</span>
                </div>
                <h3 id={`ec-line-${line.id}`}>
                  <Link href={lineHref[line.id]}>{line.name}</Link>
                </h3>
                <p className="ec-line-line">{line.line}</p>
                <Link className="ec-line-more" href={lineHref[line.id]}>
                  {line.more}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Solutions() {
  return (
    <section
      id="solutions"
      className="ec-solutions"
      aria-labelledby="ec-solutions-title"
    >
      <div className="ec-solutions-head ec-reveal">
        <span className="ec-eyebrow">{solutions.kicker}</span>
        <h2 id="ec-solutions-title">
          <Phrases text={solutions.title} />
        </h2>
        <p>
          <Phrases text={solutions.lede} />
        </p>
      </div>
      <ol className="ec-capabilities">
        {solutions.steps.map((step, index) => (
          <li
            className="ec-capability ec-reveal"
            key={step}
            style={{ '--r': index } as Vars}
          >
            <span className="ec-capability-index">{pad(index)}</span>
            <h3>{step}</h3>
          </li>
        ))}
      </ol>
      <div className="ec-directions ec-reveal">
        <h3>{solutions.directionsLabel}</h3>
        <ul>
          {solutions.directions.map((direction) => (
            <li key={direction.title}>
              <strong>{direction.title}</strong>
              <em>{direction.status}</em>
            </li>
          ))}
        </ul>
        <Actions
          items={[{ label: solutions.action, href: contactHref('enterprise') }]}
        />
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="about" className="ec-team" aria-labelledby="ec-team-title">
      <div className="ec-split">
        <div className="ec-split-copy ec-reveal">
          <span className="ec-eyebrow">{team.kicker}</span>
          <h2 id="ec-team-title">
            {team.title[0]}
            <br />
            {team.title[1]}
          </h2>
          <p>{team.text}</p>
          <div className="ec-people">
            {people.map((person) => (
              <PersonNote key={person.image} {...person} />
            ))}
          </div>
        </div>
        <figure className="ec-split-image" data-scroll="pass">
          <img
            src="/images/atelier/shared-studio.jpg"
            width="1440"
            height="960"
            alt=""
            loading="lazy"
          />
        </figure>
      </div>
      <div className="ec-proof" aria-label="团队成员的职业经历">
        <p>{team.proof}</p>
        <div className="ec-logos">
          {companies.map((company) => (
            <span
              key={company.name}
              className={`ec-logo ec-logo-${company.kind}`}
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

export default function EditionCDirection() {
  const siteRef = useEditionMotion();
  const { community, contact } = ending.paths;

  return (
    <div className="ec-site" ref={siteRef}>
      <SiteHeader />

      <main id="main">
        <section className="ec-hero ec-hero-home" aria-labelledby="ec-title">
          <img
            className="ec-hero-photo"
            src="/images/edition-c/studio-light.jpg"
            width="1672"
            height="941"
            alt=""
            fetchPriority="high"
          />
          <div className="ec-hero-copy">
            <WordCycle />
            <h1 id="ec-title">{vision}</h1>
            <p>{positioning}</p>
            <Actions
              items={[
                { label: heroActions.primary, href: WORK, tone: 'light' },
                { label: heroActions.secondary, href: '#lines', tone: 'glass' },
              ]}
            />
          </div>
          <TypedWordmark text="MolisAI" />
        </section>

        <CoreProduct />
        <Solutions />
        <Lines />
        <Team />
      </main>

      <Footer>
        <section
          className="ec-invite ec-reveal"
          aria-labelledby="ec-invite-title"
        >
          <h2 id="ec-invite-title">{ending.title}</h2>
        </section>
        <div className="ec-paths">
          <Link href={COMMUNITY} className="ec-tile" data-image-curtain>
            <img
              src="/images/edition-c/making-study.jpg"
              width="1536"
              height="1024"
              alt=""
              loading="lazy"
            />
            <ImageCurtain />
            <div>
              <small>{community.label}</small>
              <h3>
                {community.title.map((line) => (
                  <span className="ec-phrase" key={line}>
                    {line}
                  </span>
                ))}
              </h3>
              <span className="ec-tile-action">
                {community.action}
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </div>
          </Link>
          <Link
            href={contactHref('enterprise')}
            className="ec-tile"
            data-image-curtain
          >
            <img
              src="/images/atelier/threshold.jpg"
              width="1440"
              height="900"
              alt=""
              loading="lazy"
            />
            <ImageCurtain />
            <div>
              <small>{contact.label}</small>
              <h3>
                {contact.title.map((line) => (
                  <span className="ec-phrase" key={line}>
                    {line}
                  </span>
                ))}
              </h3>
              <span className="ec-tile-action">
                {contact.action}
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </Footer>
    </div>
  );
}
