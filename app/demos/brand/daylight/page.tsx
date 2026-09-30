'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  Receipt,
  Sparkles,
} from 'lucide-react';
import './daylight.css';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

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
    tone: 'live',
    image: '/images/atelier/studio-desk.jpg',
    note: '界面示意',
    href: '/demos/brand/daylight/work',
    text: '做一件跨越几天、几周的复杂工作时，AI 一换会话就忘了目标和进度。Molis Work 把目标、决定、依赖和完成证据保存成共同账本，让人和不同 AI 随时接着做。',
  },
  {
    id: 'life',
    index: '02',
    name: 'Molis Life',
    area: '生活',
    status: '原型探索',
    tone: 'warm',
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
    tone: 'quiet',
    image: '/images/atelier/threshold.jpg',
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

const branches = [
  { x: -40, y: 60, dx: 540, dy: 170, leaves: 10, seed: 3 },
  { x: 40, y: -20, dx: 330, dy: 340, leaves: 8, seed: 11 },
  { x: 220, y: 120, dx: 420, dy: -40, leaves: 7, seed: 23 },
];

function random(seed: number) {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
}

function LeafShadow({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 460"
      preserveAspectRatio="xMinYMin slice"
      aria-hidden="true"
    >
      {branches.map((branch, b) => (
        <g className={`dl-branch dl-branch-${b}`} key={b}>
          <path
            d={`M${branch.x} ${branch.y} q ${branch.dx * 0.5} ${branch.dy * 0.2} ${branch.dx} ${branch.dy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {Array.from({ length: branch.leaves }, (_, i) => {
            const t = (i + 1) / (branch.leaves + 1);
            const r = random(branch.seed + i);
            const x = branch.x + branch.dx * t;
            const y = branch.y + branch.dy * (0.2 * 2 * t * (1 - t) + t * t);
            const side = i % 2 === 0 ? 1 : -1;
            const angle =
              (Math.atan2(branch.dy, branch.dx) * 180) / Math.PI +
              side * (38 + r * 30);
            const length = 22 + r * 18;
            return (
              <ellipse
                key={i}
                cx={x + side * 6}
                cy={y + side * 10}
                rx={length}
                ry={length * 0.34}
                transform={`rotate(${angle} ${x} ${y})`}
                fill="currentColor"
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

function MaskLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <span className="dl-mask" key={line}>
          <span style={{ '--d': index } as Vars}>{line}</span>
        </span>
      ))}
    </>
  );
}

function PersonNote({
  image,
  imagePosition,
  personRole,
  experience,
  aside,
}: Person) {
  return (
    <div className="dl-person">
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
      <div className="dl-person-note" role="tooltip">
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
    <div className="dl-mock dl-ledger" aria-hidden="true">
      <div className="dl-ledger-head">
        <span>共同账本</span>
        <em>
          <i />
          会话已接上
        </em>
      </div>
      {rows.map(([label, value, done], index) => (
        <div
          className="dl-ledger-row"
          key={label}
          style={{ '--r': index } as Vars}
        >
          <small>{label}</small>
          <span>{value}</span>
          <b className={done ? 'is-done' : ''}>
            {done ? <Check size={12} /> : null}
          </b>
        </div>
      ))}
      <div className="dl-ledger-foot">
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
    <div className="dl-mock dl-life" aria-hidden="true">
      {items.map(({ icon: Icon, title, meta }, index) => (
        <div
          className="dl-life-card"
          key={title}
          style={{ '--r': index } as Vars}
        >
          <span>
            <Icon size={16} />
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
    <>
      <img
        className="dl-story-world"
        src="/images/artists/monet-pond.jpg"
        width="1440"
        height="960"
        alt=""
        loading="lazy"
      />
      <div className="dl-mock dl-story" aria-hidden="true">
        <small>以自己的身份，进入一个独立世界</small>
        <div>
          {['阅读', '交流', '探索', '行动'].map((word, index) => (
            <span key={word} style={{ '--r': index } as Vars}>
              {word}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

const mocks = { work: WorkMock, life: LifeMock, story: StoryMock };

function ProductCopy({ product }: { product: (typeof products)[number] }) {
  return (
    <>
      <div className="dl-product-meta">
        <span className="dl-product-area">{product.area}</span>
        <span className={`dl-status dl-status-${product.tone}`}>
          {product.status}
        </span>
      </div>
      <h3>{product.name}</h3>
      <p>{product.text}</p>
      {product.href ? (
        <Link href={product.href} className="dl-text-link">
          查看产品 <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      ) : null}
    </>
  );
}

function trackSpotlight(event: ReactPointerEvent<HTMLElement>) {
  const target = event.currentTarget;
  const box = target.getBoundingClientRect();
  target.style.setProperty('--mx', `${event.clientX - box.left}px`);
  target.style.setProperty('--my', `${event.clientY - box.top}px`);
}

export default function DaylightDirection() {
  const siteRef = useRef<HTMLDivElement>(null);
  const [activeProduct, setActiveProduct] = useState(0);

  useEffect(() => {
    const site = siteRef.current;
    if (!site) return;
    const header = site.querySelector<HTMLElement>('.dl-header');
    const hero = site.querySelector<HTMLElement>('.dl-hero');
    const scenes = Array.from(
      site.querySelectorAll<HTMLElement>('[data-scene]'),
    );

    let frame = 0;
    let lastY = window.scrollY;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const scene of scenes) {
        const box = scene.getBoundingClientRect();
        if (box.bottom < -vh * 0.25 || box.top > vh * 1.25) continue;
        const mode = scene.dataset.scene;
        let progress =
          mode === 'pin'
            ? -box.top / Math.max(1, box.height - vh)
            : mode === 'exit'
              ? -box.top / Math.max(1, box.height)
              : (vh - box.top) / (vh + box.height);
        progress = Math.min(1, Math.max(0, progress));
        scene.style.setProperty('--p', progress.toFixed(4));
      }
      const y = window.scrollY;
      if (header) {
        header.classList.toggle('is-solid', y > vh * 0.6);
        header.classList.toggle('is-hidden', y > vh && y > lastY + 2);
        if (y < lastY - 2) header.classList.remove('is-hidden');
      }
      lastY = y;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const revealer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          revealer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -14% 0px' },
    );
    site
      .querySelectorAll('.dl-reveal')
      .forEach((node) => revealer.observe(node));

    const panels = Array.from(site.querySelectorAll<HTMLElement>('.dl-panel'));
    const spotter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target
            .querySelector('.dl-panel-frame')
            ?.classList.add('is-seen');
          setActiveProduct(panels.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    panels.forEach((panel) => spotter.observe(panel));

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !hero) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      hero.style.setProperty('--sun-x', (x * 28).toFixed(1) + 'px');
      hero.style.setProperty('--sun-y', (y * 18).toFixed(1) + 'px');
    };

    site.classList.add('is-ready');
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    hero?.addEventListener('pointermove', onPointer);
    return () => {
      cancelAnimationFrame(frame);
      revealer.disconnect();
      spotter.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      hero?.removeEventListener('pointermove', onPointer);
    };
  }, []);

  let characterIndex = 0;

  return (
    <div className="dl-site" ref={siteRef}>
      <header className="dl-header">
        <Link href="/demos/brand/daylight" className="dl-logo">
          <img src="/images/molis-logo.png" width="44" height="44" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="dl-pill" aria-label="主导航">
          <a href="#products">产品</a>
          <a href="#capabilities">关于我们</a>
          <Link href="/demos/community">社区</Link>
          <Link href="/join" className="dl-pill-cta">
            聊一聊
          </Link>
        </nav>
      </header>

      <main id="main">
        <section
          className="dl-hero"
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
              <div className="dl-hero-copy">
                <h1 id="dl-title" aria-label="始终好奇，持续创造">
                  {['始终好奇，', '持续创造'].map((line, lineIndex) => (
                    <span className="dl-line" key={line} aria-hidden="true">
                      {Array.from(line, (character, index) => (
                        <span
                          key={index}
                          style={{ '--d': lineIndex * 4 + index } as Vars}
                        >
                          {character}
                        </span>
                      ))}
                    </span>
                  ))}
                </h1>
                <p>
                  Molis AI 是一间产品工作室。
                  <br />
                  我们和 AI 一起，把好奇心做成真正帮到人的作品。
                </p>
              </div>
              <Link
                className="dl-hero-card"
                href="/demos/brand/daylight/work"
                aria-label="正在做 Molis Work：换一个会话，工作也接得上"
              >
                <span className="dl-hero-card-screen" aria-hidden="true">
                  <span>目标</span>
                  <strong>做好第一版访谈指南</strong>
                  <i />
                  <i />
                  <i className="dl-current" />
                </span>
                <span className="dl-hero-card-text">
                  <small>
                    <i className="dl-live" aria-hidden="true" />
                    正在做
                  </small>
                  <strong>Molis Work</strong>
                  <span>换一个会话，工作也接得上</span>
                </span>
                <ArrowUpRight
                  className="dl-hero-card-arrow"
                  size={18}
                  aria-hidden="true"
                />
              </Link>
              <a className="dl-scroll-cue" href="#belief">
                <span>向下阅读</span>
                <ArrowDown size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section
          id="belief"
          className="dl-statement"
          data-scene="pin"
          aria-label="我们的立场"
          style={{ '--n': statementLength } as Vars}
        >
          <div className="dl-statement-sticky">
            <div className="dl-statement-sun" aria-hidden="true" />
            <LeafShadow className="dl-leaves dl-statement-leaves" />
            <span className="dl-eyebrow">我们的立场</span>
            <p className="dl-sr-only">{statement}</p>
            <p className="dl-statement-text" aria-hidden="true">
              {statementLines.map((line) => (
                <span className="dl-statement-line" key={line.join('')}>
                  {line.map((phrase) => (
                    <span className="dl-phrase" key={phrase}>
                      {Array.from(phrase, (character) => {
                        const index = characterIndex++;
                        return (
                          <span
                            className="dl-char"
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
          </div>
        </section>

        <section
          className="dl-bridge"
          data-scene="pin"
          aria-labelledby="dl-products-title"
        >
          <div className="dl-bridge-sticky">
            <span
              className="dl-bridge-word dl-bridge-word-a"
              aria-hidden="true"
            >
              始终好奇
            </span>
            <span
              className="dl-bridge-word dl-bridge-word-b"
              aria-hidden="true"
            >
              持续创造
            </span>
            <div className="dl-bridge-frame">
              <img
                src="/images/edition-c/making-study.jpg"
                width="1536"
                height="1024"
                alt=""
                loading="lazy"
              />
              <div className="dl-bridge-shade" />
              <div className="dl-bridge-copy">
                <span className="dl-eyebrow dl-eyebrow-light">
                  我们正在做什么
                </span>
                <h2 id="dl-products-title">
                  <span className="dl-phrase">把复杂的事一起做好，</span>
                  <span className="dl-phrase">把珍贵的时间留给生活。</span>
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section
          id="products"
          className="dl-showcase"
          aria-label="Molis 产品框架"
        >
          <div className="dl-showcase-rail">
            <p className="dl-showcase-lede">
              Molis 从工作、生活和沉浸式体验三个方向，让 AI
              接住复杂任务与日常琐事，也为人的兴趣、选择和想象留出空间。
            </p>
            <ol className="dl-showcase-nav">
              {products.map((product, index) => (
                <li key={product.id}>
                  <a
                    href={`#product-${product.id}`}
                    aria-current={activeProduct === index ? 'true' : undefined}
                  >
                    <span>{product.index}</span>
                    {product.name}
                  </a>
                </li>
              ))}
            </ol>
            <div className="dl-showcase-copy">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`dl-product-copy${activeProduct === index ? ' is-active' : ''}`}
                >
                  <ProductCopy product={product} />
                </div>
              ))}
            </div>
          </div>

          <div className="dl-showcase-panels">
            {products.map((product, index) => {
              const Mock = mocks[product.id as keyof typeof mocks];
              return (
                <article
                  key={product.id}
                  id={`product-${product.id}`}
                  className={`dl-panel dl-panel-${product.id}${activeProduct === index ? ' is-active' : ''}`}
                  data-scene="pass"
                  aria-labelledby={`dl-product-${product.id}`}
                >
                  <figure className="dl-panel-frame">
                    <img
                      className="dl-panel-photo"
                      src={product.image}
                      width="1440"
                      height="960"
                      alt=""
                      loading="lazy"
                    />
                    <div className="dl-panel-shade" />
                    <Mock />
                    <figcaption>
                      <span>{product.index}</span>
                      {product.note}
                    </figcaption>
                  </figure>
                  <div
                    className="dl-panel-copy"
                    id={`dl-product-${product.id}`}
                  >
                    <ProductCopy product={product} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="capabilities"
          className="dl-team"
          aria-labelledby="dl-capabilities-title"
        >
          <div className="dl-team-head">
            <div className="dl-reveal">
              <span className="dl-eyebrow">谁在把这些事情做出来</span>
              <h2 id="dl-capabilities-title">
                <MaskLines lines={['一群真正做过，', '也真正交付过的人。']} />
              </h2>
            </div>
            <p className="dl-reveal">
              我们负责过大型核心系统的架构与管理，也在硅谷创业公司和国内互联网核心团队里，反复经历从
              0 到 1、从 1 到规模化。今天，我们把这些经验带进 Molis。
            </p>
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

          <div className="dl-proof" aria-label="团队成员的职业经历">
            <p>团队成员的职业经历包括</p>
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

          <ol className="dl-capability-list">
            {capabilities.map((capability) => (
              <li className="dl-capability dl-reveal" key={capability.index}>
                <span className="dl-capability-index">{capability.index}</span>
                <h3>{capability.title}</h3>
                <p>{capability.text}</p>
                <div className="dl-people">
                  {capability.people.map((person) => (
                    <PersonNote key={person.image} {...person} />
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="dl-dusk">
        <div className="dl-dusk-glow" aria-hidden="true" />
        <div className="dl-dusk-invite dl-reveal">
          <h2>
            <MaskLines lines={['你正在好奇什么？']} />
          </h2>
          <p>
            从一个还没想清楚的念头，到一个已经卡了很久的具体问题，都可以成为相遇的开始。
          </p>
        </div>
        <div className="dl-dusk-paths">
          <Link
            href="/demos/community"
            className="dl-path dl-reveal"
            onPointerMove={trackSpotlight}
          >
            <small>如果你也在创造</small>
            <h3>
              <span className="dl-phrase">来看看一群人，</span>
              <span className="dl-phrase">怎样把新的可能一起做出来。</span>
            </h3>
            <span className="dl-path-action">
              去社区看看 <ArrowUpRight size={19} aria-hidden="true" />
            </span>
          </Link>
          <Link
            href="/join"
            className="dl-path dl-reveal"
            onPointerMove={trackSpotlight}
          >
            <small>如果你来自企业或团队</small>
            <h3>
              <span className="dl-phrase">带着一个具体问题来，</span>
              <span className="dl-phrase">我们先一起把它看清。</span>
            </h3>
            <span className="dl-path-action">
              和我们聊聊 <ArrowUpRight size={19} aria-hidden="true" />
            </span>
          </Link>
        </div>
        <div className="dl-wordmark dl-reveal" aria-hidden="true">
          <span>Molis AI</span>
        </div>
        <div className="dl-dusk-meta">
          <span className="dl-footer-brand">
            <img
              src="/images/molis-logo.png"
              width="28"
              height="28"
              alt=""
              loading="lazy"
            />
            Molis AI
          </span>
          <Link
            href="https://github.com/molis-ai"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Link>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
