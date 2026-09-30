'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Galaxy from './galaxy';
import Planet, { type PlanetKind } from './planet';
import './cosmos.css';

const statement =
  '技术应该回到人的尺度。我们做产品，是为了让人更从容地好奇、判断与创造。';

const products: {
  planet: PlanetKind;
  status: string;
  name: string;
  body: string;
  href?: string;
}[] = [
  {
    planet: 'work',
    status: '持续开发',
    name: 'Molis Work',
    body: '做一件跨越几天、几周的复杂工作时，AI 一换会话就忘了目标和进度。Molis Work 把目标、决定、依赖和完成证据保存成共同账本，让人和不同 AI 随时接着做。',
    href: '/demos/brand/cosmos/work',
  },
  {
    planet: 'life',
    status: '原型探索',
    name: 'Molis Life',
    body: '账单到期、活动安排、想读的书和临时起意，常常散落在不同地方。Molis Life 在得到授权后理解你的偏好，汇总这些日常事项，并把下一步准备好。',
  },
  {
    planet: 'story',
    status: '概念设计',
    name: 'Molis Story',
    body: '想放松或进入一段故事时，现有内容大多只能被动观看。Molis Story 让你以自己的身份进入独立世界，通过阅读、交流、探索和行动参与其中，离开后还能继续这段经历。',
  },
];

type PersonNoteProps = {
  image: string;
  imagePosition?: string;
  personRole: string;
  experience: string;
  aside: string;
};

function PersonNote({
  image,
  imagePosition,
  personRole,
  experience,
  aside,
}: PersonNoteProps) {
  return (
    <div className="cs-person">
      <button type="button" aria-label={`认识这项能力背后的${personRole}`}>
        <img
          src={image}
          width="96"
          height="96"
          alt=""
          loading="lazy"
          style={{ objectPosition: imagePosition }}
        />
      </button>
      <div className="cs-person-note" role="tooltip">
        <small>这件事背后的人</small>
        <strong>{personRole}</strong>
        <p>{experience}</p>
        <em>{aside}</em>
      </div>
    </div>
  );
}

function useReveal<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.classList.add('is-in');
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

export default function CosmosDirection() {
  const statementRef = useRef<HTMLElement>(null);
  const productRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const capabilitiesRef = useReveal<HTMLDivElement>(0.2);
  const footerRef = useReveal<HTMLElement>(0.25);

  useEffect(() => {
    const section = statementRef.current;
    if (!section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, span)));
      section.style.setProperty('--p', progress.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const nodes = productRefs.current.filter(Boolean) as HTMLElement[];
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

  // keep punctuation on the same line as the character before it
  const characters = Array.from(statement).reduce<string[]>((list, char) => {
    if ('，。、'.includes(char) && list.length) list[list.length - 1] += char;
    else list.push(char);
    return list;
  }, []);

  return (
    <div className="cs-site">
      <header className="cs-header">
        <Link href="/demos/brand/cosmos" className="cs-logo">
          <img src="/images/molis-logo.png" width="40" height="40" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="cs-pill" aria-label="主导航">
          <Link href="/demos/community">社区</Link>
          <a href="#capabilities">关于我们</a>
          <Link href="/join" className="cs-pill-cta">
            聊一聊
          </Link>
        </nav>
      </header>

      <main id="main">
        <div id="cs-deep" className="cs-deep">
          <Galaxy track="#cs-deep" />

          <section className="cs-hero" aria-labelledby="cs-title">
            <div className="cs-hud" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="cs-hero-copy">
              <h1 id="cs-title">
                <span>始终好奇，</span>
                <br />
                <span>持续创造</span>
              </h1>
              <p>
                Molis AI 是一间产品工作室。
                <br />
                我们和 AI 一起，把好奇心做成真正帮到人的作品。
              </p>
            </div>
            <Link
              className="cs-hero-card"
              href="/demos/brand/cosmos/work"
              aria-label="正在做 Molis Work：换一个会话，工作也接得上"
            >
              <span className="cs-hero-card-screen" aria-hidden="true">
                <span className="cs-hero-card-top">
                  <span>目标</span>
                  <em>示意</em>
                </span>
                <strong>做好第一版访谈指南</strong>
                <i />
                <i />
                <i className="cs-current" />
              </span>
              <span className="cs-hero-card-text">
                <small>正在做</small>
                <strong>Molis Work</strong>
                <span>换一个会话，工作也接得上</span>
              </span>
            </Link>
            <span className="cs-scroll-cue" aria-hidden="true" />
          </section>

          <section
            className="cs-statement"
            ref={statementRef}
            aria-label="我们的立场"
          >
            <div className="cs-statement-stage">
              <p className="cs-sr-only">{statement}</p>
              <p aria-hidden="true" style={{ '--n': characters.length } as React.CSSProperties}>
                {characters.map((character, index) => (
                  <span
                    key={index}
                    style={{ '--i': index } as React.CSSProperties}
                  >
                    {character}
                  </span>
                ))}
              </p>
            </div>
          </section>
        </div>

        <section
          id="products"
          className="cs-products"
          aria-labelledby="cs-products-title"
        >
          <div className="cs-products-intro">
            <span className="cs-eyebrow">我们正在做什么</span>
            <h2 id="cs-products-title">
              把复杂的事一起做好，把珍贵的时间留给生活。
            </h2>
            <p>
              Molis 从工作、生活和沉浸式体验三个方向，让 AI
              接住复杂任务与日常琐事，也为人的兴趣、选择和想象留出空间。
            </p>
          </div>

          <div className="cs-products-body">
            <div className="cs-orrery" data-active={active} aria-hidden="true">
              <div className="cs-orrery-sun" />
              {products.map((product, index) => (
                <div
                  key={product.name}
                  className={`cs-orbit cs-orbit-${index}${active === index ? ' is-active' : ''}`}
                >
                  <span className="cs-orbit-carrier">
                    <Planet kind={product.planet} />
                    <span className="cs-orbit-label">{product.name}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="cs-product-list" aria-label="Molis 产品框架">
              {products.map((product, index) => {
                const inner = (
                  <>
                    <Planet kind={product.planet} className="cs-product-planet" />
                    <span className="cs-product-index">
                      0{index + 1}
                      <i />
                    </span>
                    <div>
                      <small>{product.status}</small>
                      <h3>{product.name}</h3>
                      <p>{product.body}</p>
                      {product.href ? (
                        <ArrowUpRight
                          className="cs-product-arrow"
                          size={22}
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>
                  </>
                );
                const props = {
                  ref: (node: HTMLElement | null) => {
                    productRefs.current[index] = node;
                  },
                  'data-index': index,
                  className: `cs-product-item${active === index ? ' is-active' : ''}`,
                };
                return product.href ? (
                  <Link key={product.name} href={product.href} {...props}>
                    {inner}
                  </Link>
                ) : (
                  <article key={product.name} {...props}>
                    {inner}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="capabilities"
          className="cs-capabilities"
          aria-labelledby="cs-capabilities-title"
        >
          <div className="cs-capabilities-intro">
            <span className="cs-eyebrow">谁在把这些事情做出来</span>
            <h2 id="cs-capabilities-title">
              一群真正做过，也真正交付过的人。
            </h2>
            <p>
              我们负责过大型核心系统的架构与管理，也在硅谷创业公司和国内互联网核心团队里，反复经历从
              0 到 1、从 1 到规模化。今天，我们把这些经验带进 Molis。
            </p>
          </div>

          <div className="cs-proof" aria-label="团队成员的职业经历">
            <p>团队成员的职业经历包括</p>
            <div className="cs-company-logos">
              <span className="cs-company-logo cs-company-logo-meituan">
                <img
                  src="/images/daylight/company_logo/美团/美团横式色彩标识.png"
                  width="1896"
                  height="687"
                  alt="美团"
                  loading="lazy"
                />
              </span>
              <span className="cs-company-logo cs-company-logo-douyin">
                <img
                  src="/images/daylight/company_logo/douyin-group.jpg"
                  width="1749"
                  height="800"
                  alt="抖音集团"
                  loading="lazy"
                />
              </span>
              <span className="cs-company-logo cs-company-logo-didi">
                <img
                  src="/images/daylight/company_logo/didi.jpg"
                  width="823"
                  height="800"
                  alt="滴滴"
                  loading="lazy"
                />
              </span>
              <span className="cs-company-logo cs-company-logo-linkedin">
                <img
                  src="/images/daylight/company_logo/linkedin-svgrepo-com.svg"
                  width="382"
                  height="382"
                  alt="LinkedIn"
                  loading="lazy"
                />
                <b>LinkedIn</b>
              </span>
              <span className="cs-company-logo cs-company-logo-red">
                <img
                  src="/images/daylight/company_logo/red.jpeg"
                  width="4804"
                  height="3200"
                  alt="小红书"
                  loading="lazy"
                />
              </span>
            </div>
          </div>

          <div className="cs-capability-list" ref={capabilitiesRef}>
            <svg
              className="cs-constellation"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M40 70 L260 30 L440 88 L640 40 L820 96 L1040 26 L1160 64" />
            </svg>
            <article className="cs-capability">
              <span className="cs-capability-index">01</span>
              <div className="cs-capability-copy">
                <h3>把真正的问题看清</h3>
                <p>
                  我们从真实工作现场出发，把模糊的“AI
                  提效”拆成具体流程、关键判断和可以验证的结果。
                </p>
              </div>
              <div className="cs-people">
                <PersonNote
                  image="/images/daylight/team/zhuangshi.jpg"
                  personRole="AI 数据产品与复杂业务设计"
                  experience="曾任字节、美团核心团队 AI 数据产品资深专家；参与抖音数据管理及功能建设，拥有相关软件著作权，并受邀在 DataFun、美团大学与 CSDI Summit 分享实践。"
                  aside="Molis 创始合伙人、首席布道人。Google 搜得到的女人。"
                />
              </div>
            </article>

            <article className="cs-capability">
              <span className="cs-capability-index">02</span>
              <div className="cs-capability-copy">
                <h3>把复杂想法落地</h3>
                <p>
                  从AI Agent、企业知识库到AI
                  Native应用，我们把设想做成可以使用、维护和继续生长的产品。
                </p>
              </div>
              <div className="cs-people">
                <PersonNote
                  image="/images/daylight/team/yijun.jpg"
                  personRole="系统架构、产品与技术管理"
                  experience="曾在美团、字节、滴滴、LinkedIn 及多家硅谷创业公司的核心研发团队负责架构与管理，长期建设和演进高复杂度核心系统。"
                  aside="Molis AI Founder。首席 Token 官，也是一个幻想家。"
                />
                <PersonNote
                  image="/images/daylight/team/xiejun.jpeg"
                  imagePosition="50% 48%"
                  personRole="AI Native 与 Agent 工程"
                  experience="8 年美团研发经验，较早参与企业知识库、RAG、Prompt Engineering 与 Agent 实践；长期深耕数据、计算、平台架构和复杂系统工程化，目前聚焦 AI Agent、AI Coding 与 AI Native 软件架构。"
                  aside="从北京骑回南宁的工程师。叫我谢尊。"
                />
              </div>
            </article>

            <article className="cs-capability">
              <span className="cs-capability-index">03</span>
              <div className="cs-capability-copy">
                <h3>带来可量化的价值</h3>
                <p>
                  我们不只交付原型，也和业务团队一起把产品带进真实流程，创造真正的业务指标增量。
                </p>
              </div>
              <div className="cs-people">
                <PersonNote
                  image="/images/daylight/team/xinyi.jpg"
                  imagePosition="50% 54%"
                  personRole="业务增长与客户共创"
                  experience="曾在美团、字节、小红书核心团队负责数据运营，对接 100+ 客户团队，参与共创月百万级业务增量，持续寻找 AI 能力真正进入业务的落点。"
                  aside="Molis AI 下一任 CEO 候选人之一。"
                />
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="cs-footer" ref={footerRef}>
        <div className="cs-horizon" aria-hidden="true">
          <span className="cs-horizon-dawn" />
          <Planet kind="horizon" className="cs-horizon-planet" />
        </div>
        <div className="cs-footer-invite">
          <h2>你正在好奇什么？</h2>
          <p>
            从一个还没想清楚的念头，到一个已经卡了很久的具体问题，都可以成为相遇的开始。
          </p>
        </div>
        <div className="cs-footer-paths">
          <Link href="/demos/community" className="cs-footer-path">
            <small>如果你也在创造</small>
            <h3>来看看一群人，怎样把新的可能一起做出来。</h3>
            <span>
              去社区看看 <ArrowUpRight size={19} />
            </span>
          </Link>
          <Link href="/join" className="cs-footer-path">
            <small>如果你来自企业或团队</small>
            <h3>带着一个具体问题来，我们先一起把它看清。</h3>
            <span>
              和我们聊聊 <ArrowUpRight size={19} />
            </span>
          </Link>
        </div>
        <div className="cs-footer-meta">
          <span>Molis AI</span>
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
