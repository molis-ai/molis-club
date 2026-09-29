'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import './daylight.css';

const statementLines = [
  '技术应该回到人的尺度。',
  '我们做产品，是为了让人更从容地好奇、判断与创造。',
];
const statement = statementLines.join('');

const branches = [
  { x: -40, y: 60, dx: 540, dy: 170, leaves: 10, seed: 3 },
  { x: 40, y: -20, dx: 330, dy: 340, leaves: 8, seed: 11 },
  { x: 220, y: 120, dx: 420, dy: -40, leaves: 7, seed: 23 },
];

function random(seed: number) {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
}

function LeafShadow() {
  return (
    <svg
      className="dl-leaves"
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
    <div className="dl-person">
      <button type="button" aria-label={`认识这项能力背后的${personRole}`}>
        <img
          src={image}
          loading="lazy"
          width="96"
          height="96"
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

export default function DaylightDirection() {
  const heroRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const section = statementRef.current;
    if (!hero || !section) return;
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      hero.style.setProperty('--sun-x', (x * 28).toFixed(1) + 'px');
      hero.style.setProperty('--sun-y', (y * 18).toFixed(1) + 'px');
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.add('is-visible');
        observer.unobserve(section);
      },
      { threshold: 0.42 },
    );
    observer.observe(section);
    const site = hero.closest('.dl-site');
    const revealer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          revealer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    site
      ?.querySelectorAll('.dl-reveal')
      .forEach((node) => revealer.observe(node));
    site?.classList.add('is-ready');
    hero.addEventListener('pointermove', onPointer);
    return () => {
      observer.disconnect();
      revealer.disconnect();
      hero.removeEventListener('pointermove', onPointer);
    };
  }, []);

  let characterIndex = 0;

  return (
    <div className="dl-site">
      <header className="dl-header">
        <Link href="/demos/brand/daylight" className="dl-logo">
          <img src="/images/molis-logo.png" width="44" height="44" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="dl-pill" aria-label="主导航">
          <Link href="/demos/community">社区</Link>
          <a href="#capabilities">关于我们</a>
          <Link href="/join" className="dl-pill-cta">
            聊一聊
          </Link>
        </nav>
      </header>

      <main id="main">
        <section className="dl-hero" ref={heroRef} aria-labelledby="dl-title">
          <img
            className="dl-hero-photo"
            src="/images/edition-c/studio-light.jpg"
            width="1672"
            height="941"
            alt=""
            fetchPriority="high"
          />
          <div className="dl-hero-shade" />
          <LeafShadow />
          <div className="dl-hero-copy">
            <h1 id="dl-title">
              始终好奇，
              <br />
              持续创造
            </h1>
            <p>
              Molis AI 是一间产品工作室。
              <br />
              我们和 AI 一起，把好奇心做成真正帮到人的作品。
            </p>
          </div>
          <a
            className="dl-hero-card"
            href="https://github.com/molis-ai/molis-work"
            target="_blank"
            rel="noreferrer"
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
          </a>
          <a className="dl-scroll-cue" href="#products">
            <span>向下阅读</span>
            <ArrowDown size={15} aria-hidden="true" />
          </a>
        </section>

        <section
          className="dl-statement"
          ref={statementRef}
          aria-label="我们的立场"
        >
          <div className="dl-statement-stage">
            <p className="dl-sr-only">{statement}</p>
            <p aria-hidden="true">
              {statementLines.map((line) => (
                <span className="dl-statement-line" key={line}>
                  {Array.from(line, (character) => {
                    const index = characterIndex++;
                    return (
                      <span
                        key={index}
                        style={{ '--i': index } as React.CSSProperties}
                      >
                        {character}
                      </span>
                    );
                  })}
                </span>
              ))}
            </p>
          </div>
        </section>

        <section
          id="products"
          className="dl-products"
          aria-labelledby="dl-products-title"
        >
          <div className="dl-products-intro dl-reveal">
            <span>我们正在做什么</span>
            <h2 id="dl-products-title">
              <span className="dl-phrase">把复杂的事一起做好，</span>
              <span className="dl-phrase">把珍贵的时间留给生活。</span>
            </h2>
            <p>
              Molis 从工作、生活和沉浸式体验三个方向，让 AI
              接住复杂任务与日常琐事，也为人的兴趣、选择和想象留出空间。
            </p>
          </div>

          <div
            className="dl-product-list dl-reveal"
            aria-label="Molis 产品框架"
          >
            <Link href="/demos/product" className="dl-product-item">
              <div className="dl-product-meta">
                <span className="dl-product-index">01</span>
                <small className="dl-status dl-status-01">持续开发</small>
              </div>
              <div className="dl-product-body">
                <h3>Molis Work</h3>
                <p>
                  做一件跨越几天、几周的复杂工作时，AI
                  一换会话就忘了目标和进度。Molis Work
                  把目标、决定、依赖和完成证据保存成共同账本，让人和不同 AI
                  随时接着做。
                </p>
              </div>
              <span className="dl-product-link">
                查看产品 <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </Link>

            <article className="dl-product-item">
              <div className="dl-product-meta">
                <span className="dl-product-index">02</span>
                <small className="dl-status dl-status-02">原型探索</small>
              </div>
              <div className="dl-product-body">
                <h3>Molis Life</h3>
                <p>
                  账单到期、活动安排、想读的书和临时起意，常常散落在不同地方。Molis
                  Life
                  在得到授权后理解你的偏好，汇总这些日常事项，并把下一步准备好。
                </p>
              </div>
            </article>

            <article className="dl-product-item">
              <div className="dl-product-meta">
                <span className="dl-product-index">03</span>
                <small className="dl-status dl-status-03">概念设计</small>
              </div>
              <div className="dl-product-body">
                <h3>Molis Story</h3>
                <p>
                  想放松或进入一段故事时，现有内容大多只能被动观看。Molis Story
                  让你以自己的身份进入独立世界，通过阅读、交流、探索和行动参与其中，离开后还能继续这段经历。
                </p>
              </div>
            </article>
          </div>
        </section>

        <section
          id="capabilities"
          className="dl-capabilities"
          aria-labelledby="dl-capabilities-title"
        >
          <div className="dl-capabilities-intro dl-reveal">
            <span>谁在把这些事情做出来</span>
            <h2 id="dl-capabilities-title">
              <span className="dl-phrase">一群真正做过，</span>
              <span className="dl-phrase">也真正交付过的人。</span>
            </h2>
            <p>
              我们负责过大型核心系统的架构与管理，也在硅谷创业公司和国内互联网核心团队里，反复经历从
              0 到 1、从 1 到规模化。今天，我们把这些经验带进 Molis。
            </p>
          </div>

          <div className="dl-proof dl-reveal" aria-label="团队成员的职业经历">
            <p>团队成员的职业经历包括</p>
            <div className="dl-company-logos">
              <span className="dl-company-logo dl-company-logo-meituan">
                <img
                  src="/images/daylight/company_logo/美团/美团横式色彩标识.png"
                  loading="lazy"
                  width="480"
                  height="174"
                  alt="美团"
                />
              </span>
              <span className="dl-company-logo dl-company-logo-douyin">
                <img
                  src="/images/daylight/company_logo/douyin-group.jpg"
                  loading="lazy"
                  width="452"
                  height="159"
                  alt="抖音集团"
                />
              </span>
              <span className="dl-company-logo dl-company-logo-didi">
                <img
                  src="/images/daylight/company_logo/didi.jpg"
                  loading="lazy"
                  width="461"
                  height="156"
                  alt="滴滴"
                />
              </span>
              <span className="dl-company-logo dl-company-logo-linkedin">
                <img
                  src="/images/daylight/company_logo/linkedin-svgrepo-com.svg"
                  loading="lazy"
                  width="382"
                  height="382"
                  alt="LinkedIn"
                />
                <b>LinkedIn</b>
              </span>
              <span className="dl-company-logo dl-company-logo-red">
                <img
                  src="/images/daylight/company_logo/red.jpeg"
                  loading="lazy"
                  width="480"
                  height="320"
                  alt="小红书"
                />
              </span>
            </div>
          </div>

          <div className="dl-capability-list dl-reveal">
            <article className="dl-capability">
              <span className="dl-capability-index">01</span>
              <div className="dl-capability-copy">
                <h3>把真正的问题看清</h3>
                <p>
                  我们从真实工作现场出发，把模糊的“AI
                  提效”拆成具体流程、关键判断和可以验证的结果。
                </p>
              </div>
              <div className="dl-people">
                <PersonNote
                  image="/images/daylight/team/zhuangshi.jpg"
                  personRole="AI 数据产品与复杂业务设计"
                  experience="曾任字节、美团核心团队 AI 数据产品资深专家；参与抖音数据管理及功能建设，拥有相关软件著作权，并受邀在 DataFun、美团大学与 CSDI Summit 分享实践。"
                  aside="Molis 创始合伙人、首席布道人。Google 搜得到的女人。"
                />
              </div>
            </article>

            <article className="dl-capability">
              <span className="dl-capability-index">02</span>
              <div className="dl-capability-copy">
                <h3>把复杂想法落地</h3>
                <p>
                  从AI Agent、企业知识库到AI
                  Native应用，我们把设想做成可以使用、维护和继续生长的产品。
                </p>
              </div>
              <div className="dl-people">
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

            <article className="dl-capability">
              <span className="dl-capability-index">03</span>
              <div className="dl-capability-copy">
                <h3>带来可量化的价值</h3>
                <p>
                  我们不只交付原型，也和业务团队一起把产品带进真实流程，创造真正的业务指标增量。
                </p>
              </div>
              <div className="dl-people">
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

      <footer className="dl-footer">
        <div className="dl-footer-invite">
          <h2 className="dl-reveal">你正在好奇什么？</h2>
          <p>
            从一个还没想清楚的念头，到一个已经卡了很久的具体问题，都可以成为相遇的开始。
          </p>
        </div>
        <div className="dl-footer-paths dl-reveal">
          <Link href="/demos/community" className="dl-footer-path">
            <small>如果你也在创造</small>
            <h3>
              <span className="dl-phrase">来看看一群人，</span>
              <span className="dl-phrase">怎样把新的可能一起做出来。</span>
            </h3>
            <span>
              去社区看看 <ArrowUpRight size={19} />
            </span>
          </Link>
          <Link href="/join" className="dl-footer-path">
            <small>如果你来自企业或团队</small>
            <h3>
              <span className="dl-phrase">带着一个具体问题来，</span>
              <span className="dl-phrase">我们先一起把它看清。</span>
            </h3>
            <span>
              和我们聊聊 <ArrowUpRight size={19} />
            </span>
          </Link>
        </div>
        <div className="dl-footer-meta">
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
