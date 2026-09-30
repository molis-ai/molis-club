'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { ImageCurtain } from '../../../image-curtain';
import {
  Footer,
  Header,
  TypedWordmark,
  WORK,
  WordCycle,
  useEditionMotion,
  type Vars,
} from './shared';
import './edition-c.css';

// 文案、区块与顺序与日光版首页一致；这里只换视觉。

const statementLines = [
  ['技术应该回到人的尺度。'],
  ['我们做产品，', '是为了让人更从容地好奇、判断与创造。'],
];
const statement = statementLines.flat().join('');
const statementLength = Array.from(statement).length;

const products = [
  {
    id: 'work',
    index: '01',
    name: 'Molis Work',
    area: '工作',
    status: '持续开发',
    image: '/images/atelier/studio-desk.jpg',
    note: '界面示意',
    href: WORK,
    text: '做一件跨越几天、几周的复杂工作时，AI 一换会话就忘了目标和进度。Molis Work 把目标、决定、依赖和完成证据保存成共同账本，让人和不同 AI 随时接着做。',
  },
  {
    id: 'life',
    index: '02',
    name: 'Molis Life',
    area: '生活',
    status: '原型探索',
    image: '/images/atelier/reading-room.jpg',
    note: '概念示意',
    text: '账单到期、活动安排、想读的书和临时起意，常常散落在不同地方。Molis Life 在得到授权后理解你的偏好，汇总这些日常事项，并把下一步准备好。',
  },
  {
    id: 'story',
    index: '03',
    name: 'Molis Story',
    area: '沉浸式体验',
    status: '概念设计',
    image: '/images/artists/monet-pond.jpg',
    note: '概念示意',
    text: '想放松或进入一段故事时，现有内容大多只能被动观看。Molis Story 让你以自己的身份进入独立世界，通过阅读、交流、探索和行动参与其中，离开后还能继续这段经历。',
  },
];

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

const capabilities: {
  index: string;
  title: string;
  text: string;
  people: Person[];
}[] = [
  {
    index: '01',
    title: '把真正的问题看清',
    text: '我们从真实工作现场出发，把模糊的“AI 提效”拆成具体流程、关键判断和可以验证的结果。',
    people: [
      {
        image: '/images/daylight/team/zhuangshi.jpg',
        personRole: 'AI 数据产品与复杂业务设计',
        experience:
          '曾任字节、美团核心团队 AI 数据产品资深专家；参与抖音数据管理及功能建设，拥有相关软件著作权，并受邀在 DataFun、美团大学与 CSDI Summit 分享实践。',
        aside: 'Molis 创始合伙人、首席布道人。Google 搜得到的女人。',
      },
    ],
  },
  {
    index: '02',
    title: '把复杂想法落地',
    text: '从 AI Agent、企业知识库到 AI Native 应用，我们把设想做成可以使用、维护和继续生长的产品。',
    people: [
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
    ],
  },
  {
    index: '03',
    title: '带来可量化的价值',
    text: '我们不只交付原型，也和业务团队一起把产品带进真实流程，创造真正的业务指标增量。',
    people: [
      {
        image: '/images/daylight/team/xinyi.jpg',
        imagePosition: '50% 54%',
        personRole: '业务增长与客户共创',
        experience:
          '曾在美团、字节、小红书核心团队负责数据运营，对接 100+ 客户团队，参与共创月百万级业务增量，持续寻找 AI 能力真正进入业务的落点。',
        aside: 'Molis AI 下一任 CEO 候选人之一。',
      },
    ],
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
      <button type="button" aria-label={`认识这项能力背后的${personRole}`}>
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
        <small>这件事背后的人</small>
        <strong>{personRole}</strong>
        <p>{experience}</p>
        <em>{aside}</em>
      </div>
    </div>
  );
}

function WorkMock() {
  const rows = [
    ['目标', '做好第一版访谈指南', true],
    ['决定', '先从一线使用者开始访谈', true],
    ['依赖', '等待访谈名单确认', false],
    ['完成证据', '访谈提纲第二版已评审', true],
  ] as const;
  return (
    <div className="ec-mock ec-ledger" aria-hidden="true">
      <div className="ec-mock-head">
        <span>共同账本</span>
        <em>
          <i />
          会话已接上
        </em>
      </div>
      {rows.map(([label, value, done], index) => (
        <div
          className="ec-ledger-row"
          key={label}
          style={{ '--r': index } as Vars}
        >
          <small>{label}</small>
          <span>{value}</span>
          <b className={done ? 'is-done' : ''}>
            {done ? <Check size={11} /> : null}
          </b>
        </div>
      ))}
      <div className="ec-ledger-foot">
        <span>
          <i />
        </span>
        <small>3 / 4 已完成</small>
      </div>
    </div>
  );
}

function LifeMock() {
  const items = [
    { icon: Receipt, title: '账单到期', meta: '下一步已准备好' },
    { icon: CalendarDays, title: '活动安排', meta: '已汇总到这周' },
    { icon: BookOpen, title: '想读的书', meta: '留到周末慢慢读' },
    { icon: Sparkles, title: '临时起意', meta: '先记下，稍后提醒' },
  ];
  return (
    <div className="ec-mock ec-life" aria-hidden="true">
      {items.map(({ icon: Icon, title, meta }, index) => (
        <div
          className="ec-life-card"
          key={title}
          style={{ '--r': index } as Vars}
        >
          <span>
            <Icon size={15} />
          </span>
          <strong>{title}</strong>
          <small>{meta}</small>
        </div>
      ))}
    </div>
  );
}

function StoryMock() {
  return (
    <div className="ec-mock ec-story" aria-hidden="true">
      <small>以自己的身份，进入一个独立世界</small>
      <div>
        {['阅读', '交流', '探索', '行动'].map((word, index) => (
          <span key={word} style={{ '--r': index } as Vars}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

const mocks = { work: WorkMock, life: LifeMock, story: StoryMock };

function Products() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <section id="products" className="ec-products" aria-label="Molis 产品框架">
      <p className="ec-products-lede ec-reveal">
        Molis 从工作、生活和沉浸式体验三个方向，让 AI
        接住复杂任务与日常琐事，也为人的兴趣、选择和想象留出空间。
      </p>
      {products.map((product, index) => {
        const Mock = mocks[product.id as keyof typeof mocks];
        return (
          <article
            key={product.id}
            id={`product-${product.id}`}
            className="ec-product"
            role="tabpanel"
            aria-labelledby={`ec-product-tab-${index}`}
            hidden={active !== index}
          >
            <img
              className="ec-product-photo"
              src={product.image}
              width="1440"
              height="960"
              alt=""
              loading="lazy"
            />
            <div className="ec-product-copy">
              <div className="ec-product-meta">
                <span>{product.area}</span>
                <span>{product.status}</span>
              </div>
              <h3>{product.name}</h3>
              <p>{product.text}</p>
              {product.href ? (
                <Link href={product.href} className="ec-button ec-button-light">
                  查看产品
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              ) : null}
            </div>
            <div className="ec-product-mock">
              <Mock />
            </div>
            <span className="ec-product-note">{product.note}</span>
          </article>
        );
      })}
      <div className="ec-product-tabs" role="tablist" aria-label="三个产品">
        {products.map((product, index) => (
          <button
            key={product.id}
            id={`ec-product-tab-${index}`}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={`product-${product.id}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === 'ArrowRight') next = (index + 1) % 3;
              else if (event.key === 'ArrowLeft') next = (index + 2) % 3;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = 2;
              else return;
              event.preventDefault();
              setActive(next);
              tabs.current[next]?.focus();
            }}
          >
            <small>{product.index}</small>
            <span>{product.name}</span>
            <em>{product.area}</em>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function EditionCDirection() {
  const siteRef = useEditionMotion();
  let characterIndex = 0;

  return (
    <div className="ec-site" ref={siteRef}>
      <Header
        items={[
          { label: '产品', href: '#products' },
          { label: '关于我们', href: '#capabilities' },
          { label: '社区', href: '/demos/community' },
        ]}
        action={{ label: '聊一聊', href: '/join' }}
      />

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
            <h1 id="ec-title">始终好奇，持续创造</h1>
            <p>
              Molis AI 是一间产品工作室。
              <br />
              我们和 AI 一起，把好奇心做成真正帮到人的作品。
            </p>
            <Link
              className="ec-now"
              href={WORK}
              aria-label="正在做 Molis Work：换一个会话，工作也接得上"
            >
              <span className="ec-now-label">
                <i aria-hidden="true" />
                正在做
              </span>
              <strong>Molis Work</strong>
              <span className="ec-now-text">换一个会话，工作也接得上</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <TypedWordmark text="MolisAI" />
        </section>

        <section
          id="belief"
          className="ec-statement ec-belief"
          data-scroll="enter"
          aria-label="我们的立场"
          style={{ '--n': statementLength } as Vars}
        >
          <span className="ec-eyebrow">我们的立场</span>
          <p className="ec-sr-only">{statement}</p>
          <p className="ec-belief-text" aria-hidden="true">
            {statementLines.map((line) => (
              <span className="ec-belief-line" key={line.join('')}>
                {line.map((phrase) => (
                  <span className="ec-phrase" key={phrase}>
                    {Array.from(phrase, (character) => {
                      const index = characterIndex++;
                      return (
                        <span
                          className="ec-char"
                          key={index}
                          style={{ '--i': index } as Vars}
                        >
                          {character}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </span>
            ))}
          </p>
        </section>

        <section
          className="ec-bridge"
          data-scroll="enter"
          aria-labelledby="ec-products-title"
        >
          <div className="ec-bridge-frame">
            <div className="ec-bridge-media">
              <img
                src="/images/edition-c/making-study.jpg"
                width="1536"
                height="1024"
                alt=""
                loading="lazy"
              />
            </div>
            <div className="ec-bridge-copy">
              <span className="ec-eyebrow">我们正在做什么</span>
              <h2 id="ec-products-title">
                <span className="ec-phrase">把复杂的事一起做好，</span>
                <span className="ec-phrase">把珍贵的时间留给生活。</span>
              </h2>
            </div>
          </div>
        </section>

        <Products />

        <section
          id="capabilities"
          className="ec-team"
          aria-labelledby="ec-capabilities-title"
        >
          <div className="ec-split">
            <div className="ec-split-copy ec-reveal">
              <span className="ec-eyebrow">谁在把这些事情做出来</span>
              <h2 id="ec-capabilities-title">
                一群真正做过，
                <br />
                也真正交付过的人。
              </h2>
              <p>
                我们负责过大型核心系统的架构与管理，也在硅谷创业公司和国内互联网核心团队里，反复经历从
                0 到 1、从 1 到规模化。今天，我们把这些经验带进 Molis。
              </p>
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
            <p>团队成员的职业经历包括</p>
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

          <ol className="ec-capabilities">
            {capabilities.map((capability, index) => (
              <li
                className="ec-capability ec-reveal"
                key={capability.index}
                style={{ '--r': index } as Vars}
              >
                <span className="ec-capability-index">{capability.index}</span>
                <h3>{capability.title}</h3>
                <p>{capability.text}</p>
                <div className="ec-people">
                  {capability.people.map((person) => (
                    <PersonNote key={person.image} {...person} />
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer>
        <section
          className="ec-invite ec-reveal"
          aria-labelledby="ec-invite-title"
        >
          <h2 id="ec-invite-title">你正在好奇什么？</h2>
          <p>
            从一个还没想清楚的念头，到一个已经卡了很久的具体问题，都可以成为相遇的开始。
          </p>
        </section>
        <div className="ec-paths">
          <Link href="/demos/community" className="ec-tile" data-image-curtain>
            <img
              src="/images/atelier/makers-studio.jpg"
              width="1672"
              height="941"
              alt=""
              loading="lazy"
            />
            <ImageCurtain />
            <div>
              <small>如果你也在创造</small>
              <h3>
                <span className="ec-phrase">来看看一群人，</span>
                <span className="ec-phrase">怎样把新的可能一起做出来。</span>
              </h3>
              <span className="ec-tile-action">
                去社区看看 <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </div>
          </Link>
          <Link href="/join" className="ec-tile" data-image-curtain>
            <img
              src="/images/atelier/threshold.jpg"
              width="1440"
              height="900"
              alt=""
              loading="lazy"
            />
            <ImageCurtain />
            <div>
              <small>如果你来自企业或团队</small>
              <h3>
                <span className="ec-phrase">带着一个具体问题来，</span>
                <span className="ec-phrase">我们先一起把它看清。</span>
              </h3>
              <span className="ec-tile-action">
                和我们聊聊 <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </Footer>
    </div>
  );
}
