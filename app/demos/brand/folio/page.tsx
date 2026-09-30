'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './folio.css';

const statement =
  '技术应该回到人的尺度。我们做产品，是为了让人更从容地好奇、判断与创造。';

type Cut = React.CSSProperties & {
  '--i': number;
  '--d': number;
  '--fx': string;
  '--fy': string;
  '--fr': string;
};

function cut(i: number, d: number, fx: number, fy: number, fr: number): Cut {
  return {
    '--i': i,
    '--d': d,
    '--fx': `${fx}px`,
    '--fy': `${fy}px`,
    '--fr': `${fr}deg`,
  };
}

function Star({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      d={`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z`}
    />
  );
}

function CoverArt() {
  return (
    <svg className="fo-cover-svg" viewBox="0 0 800 800" aria-hidden="true">
      <g className="fo-cut fo-blue" style={cut(0, 0.5, -80, 160, -8)}>
        <path d="M120 800V430a200 200 0 0 1 400 0v370Z" />
        <path
          className="fo-cut-line"
          d="M170 800V440a150 150 0 0 1 300 0v360"
        />
      </g>
      <g className="fo-cut fo-red" style={cut(1, 1, 120, -140, 14)}>
        <circle cx="560" cy="250" r="175" />
      </g>
      <g className="fo-cut fo-sage" style={cut(2, 1.6, -160, -40, -24)}>
        <path d="M30 340c90-150 270-170 350-100-70 110-240 170-350 100Z" />
        <path className="fo-cut-vein" d="M50 336c110-40 210-70 320-96" />
      </g>
      <g className="fo-cut fo-navy" style={cut(3, 0.7, 0, 180, 3)}>
        <path d="M-420 720c110-50 190 20 300-10s160-60 260-20 170 30 260-10 170-80 280-20 180 40 250-10 180-60 300-10v300H-420Z" />
      </g>
      <g className="fo-cut fo-yellow" style={cut(4, 2.2, 140, 120, 30)}>
        <path
          className="fo-mark-hook"
          d="M405 330c0-95 150-110 150-10 0 70-80 80-80 150v40"
        />
        <circle cx="475" cy="600" r="40" />
      </g>
      <g className="fo-cut fo-pink" style={cut(5, 2.8, 120, 40, 0)}>
        <circle cx="705" cy="545" r="58" />
      </g>
      <path
        className="fo-cover-line"
        d="M36 770c110-40 90-190 210-200s140 120 240 60 60-230 210-270"
        pathLength={1}
      />
      <g className="fo-cut fo-stars" style={cut(6, 3.4, 0, -60, 40)}>
        <Star x={710} y={90} r={26} />
        <Star x={300} y={140} r={16} />
        <Star x={90} y={560} r={20} />
      </g>
    </svg>
  );
}

function LedgerArt() {
  return (
    <figure
      className="fo-art fo-art-ledger"
      aria-label="Molis Work 共同账本的界面示意"
    >
      <div className="fo-ledger-back fo-ledger-back-2" aria-hidden="true" />
      <div className="fo-ledger-back" aria-hidden="true" />
      <div className="fo-ledger">
        <div className="fo-ledger-top">
          <span>Molis Work</span>
          <span className="fo-ledger-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
        <small>目标</small>
        <strong>做好第一版访谈指南</strong>
        <ul>
          {['决定', '依赖', '完成证据'].map((label, index) => (
            <li key={label} style={{ '--i': index } as React.CSSProperties}>
              <span>{label}</span>
              <i />
            </li>
          ))}
        </ul>
        <div className="fo-ledger-sessions" aria-hidden="true">
          <span>会话 A</span>
          <b />
          <span>会话 B</span>
        </div>
        <p>换一个会话，工作也接得上</p>
      </div>
      <svg className="fo-ledger-cut" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="100" />
      </svg>
      <figcaption>界面示意</figcaption>
    </figure>
  );
}

const lifeItems = ['账单到期', '活动安排', '想读的书', '临时起意'];

function LifeArt() {
  return (
    <figure
      className="fo-art fo-art-life"
      aria-label="Molis Life 的概念示意：散落的日常事项被汇总，下一步已准备好"
    >
      <svg className="fo-life-sun" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="100" />
      </svg>
      {lifeItems.map((item, index) => (
        <span
          className="fo-life-note"
          key={item}
          style={{ '--i': index } as React.CSSProperties}
        >
          {item}
        </span>
      ))}
      <span className="fo-life-next">
        <small>下一步</small>
        已经准备好
      </span>
      <figcaption>概念示意</figcaption>
    </figure>
  );
}

function StoryArt() {
  return (
    <figure
      className="fo-art fo-art-story"
      aria-label="Molis Story 的概念示意：一个人走进一扇通往独立世界的门"
    >
      <svg viewBox="0 0 600 600" aria-hidden="true">
        <defs>
          <clipPath id="fo-door-clip">
            <path d="M190 560V290a110 110 0 0 1 220 0v270Z" />
          </clipPath>
        </defs>
        <g className="fo-story-stars">
          <Star x={90} y={110} r={18} />
          <Star x={500} y={70} r={26} />
          <Star x={540} y={260} r={12} />
          <Star x={60} y={330} r={10} />
        </g>
        <circle className="fo-story-moon" cx="470" cy="160" r="54" />
        <path
          className="fo-story-frame"
          d="M160 560V290a140 140 0 0 1 280 0v270Z"
        />
        <g clipPath="url(#fo-door-clip)">
          <rect
            className="fo-story-world"
            x="190"
            y="170"
            width="220"
            height="400"
          />
          <circle className="fo-story-world-sun" cx="300" cy="360" r="58" />
          <path
            className="fo-story-world-hill"
            d="M180 470c60-40 110-40 150-10s80 20 90 10v110H180Z"
          />
          <rect
            className="fo-story-door"
            x="190"
            y="170"
            width="220"
            height="400"
          />
        </g>
        <path className="fo-story-floor" d="M0 560h600v40H0Z" />
        <path className="fo-story-path" d="M300 560 220 600h160Z" />
        <g className="fo-story-walker">
          <circle cx="300" cy="455" r="15" />
          <path d="M282 540v-50a18 18 0 0 1 36 0v50Z" />
        </g>
      </svg>
      <figcaption>概念示意</figcaption>
    </figure>
  );
}

type PersonProps = {
  image: string;
  imagePosition?: string;
  personRole: string;
  experience: string;
  aside: string;
  tone: string;
};

function Person({
  image,
  imagePosition,
  personRole,
  experience,
  aside,
  tone,
}: PersonProps) {
  return (
    <div className={`fo-person fo-tone-${tone}`}>
      <div className="fo-person-photo">
        <span aria-hidden="true" />
        <img
          src={image}
          width="160"
          height="160"
          alt=""
          loading="lazy"
          style={{ objectPosition: imagePosition }}
        />
      </div>
      <div>
        <small>这件事背后的人</small>
        <strong>{personRole}</strong>
        <p>{experience}</p>
        <em>{aside}</em>
      </div>
    </div>
  );
}

export default function FolioDirection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    requestAnimationFrame(() => root.classList.add('is-ready'));

    const scenes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-scene]'),
    );
    const sheets = Array.from(root.querySelectorAll<HTMLElement>('.fo-sheet'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 2) continue;
        const mode = scene.dataset.scene;
        let p: number;
        if (mode === 'enter') {
          p = (vh - rect.top) / vh;
        } else if (mode === 'leave') {
          p = -rect.top / vh;
        } else {
          p = -rect.top / Math.max(1, rect.height - vh);
        }
        scene.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
      }
      sheets.forEach((sheet, index) => {
        const next = sheets[index + 1];
        if (!next) return;
        const top = next.getBoundingClientRect().top;
        const covered = Math.min(1, Math.max(0, 1 - top / vh));
        sheet.style.setProperty('--c', covered.toFixed(4));
      });
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);

    const cover = root.querySelector<HTMLElement>('.fo-cover');
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || reduce.matches || !cover) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      cover.style.setProperty('--mx', (x * 14).toFixed(2));
      cover.style.setProperty('--my', (y * 10).toFixed(2));
    };
    cover?.addEventListener('pointermove', onPointer);

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          reveal.unobserve(entry.target);
        }
      },
      { threshold: 0.25 },
    );
    root
      .querySelectorAll('[data-reveal]')
      .forEach((item) => reveal.observe(item));

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      cover?.removeEventListener('pointermove', onPointer);
      reveal.disconnect();
    };
  }, []);

  const characters = Array.from(statement);

  return (
    <div className="fo-site" ref={rootRef}>
      <header className="fo-header">
        <Link href="/demos/brand/folio" className="fo-logo">
          <img src="/images/molis-logo.png" width="36" height="36" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="fo-nav" aria-label="主导航">
          <Link href="/demos/community">社区</Link>
          <a href="#capabilities">关于我们</a>
          <Link href="/join" className="fo-nav-cta">
            聊一聊
          </Link>
        </nav>
      </header>

      <main id="main">
        <section
          className="fo-cover"
          data-scene="leave"
          aria-labelledby="fo-title"
        >
          <div className="fo-masthead" aria-hidden="true">
            {Array.from('Molis').map((letter, index) => (
              <span key={index} style={{ '--i': index } as React.CSSProperties}>
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
              始终好奇，
              <br />
              持续创造
            </h1>
            <p>
              Molis AI 是一间产品工作室。
              <br />
              我们和 AI 一起，把好奇心做成真正帮到人的作品。
            </p>
            <Link className="fo-coverline" href="/demos/brand/folio/work">
              <small>正在做</small>
              <strong>Molis Work</strong>
              <span>
                换一个会话，工作也接得上 <ArrowUpRight size={16} />
              </span>
            </Link>
          </div>
        </section>

        <section
          className="fo-letter"
          data-scene="track"
          aria-label="我们的立场"
        >
          <div className="fo-letter-stage">
            <p className="fo-sr-only">{statement}</p>
            <p className="fo-letter-text" aria-hidden="true">
              {characters.map((character, index) => (
                <span
                  key={index}
                  className={index >= 6 && index <= 9 ? 'is-mark' : undefined}
                  style={{ '--i': index } as React.CSSProperties}
                >
                  {character}
                </span>
              ))}
            </p>
          </div>
        </section>

        <section
          id="products"
          className="fo-features"
          aria-labelledby="fo-features-title"
        >
          <div className="fo-features-intro" data-reveal>
            <span className="fo-kicker">我们正在做什么</span>
            <h2 id="fo-features-title">
              把复杂的事一起做好，
              <br />
              把珍贵的时间留给生活。
            </h2>
            <p>
              Molis 从工作、生活和沉浸式体验三个方向，让 AI
              接住复杂任务与日常琐事，也为人的兴趣、选择和想象留出空间。
            </p>
          </div>

          <div className="fo-stack">
            <article className="fo-sheet fo-sheet-work" data-scene="enter">
              <div className="fo-sheet-inner">
                <Link href="/demos/brand/folio/work" className="fo-sheet-copy">
                  <span className="fo-sheet-number">01</span>
                  <small>持续开发</small>
                  <h3>Molis Work</h3>
                  <p>
                    做一件跨越几天、几周的复杂工作时，AI
                    一换会话就忘了目标和进度。Molis Work
                    把目标、决定、依赖和完成证据保存成共同账本，让人和不同 AI
                    随时接着做。
                  </p>
                  <span className="fo-sheet-more" aria-hidden="true">
                    <ArrowUpRight size={22} />
                  </span>
                </Link>
                <LedgerArt />
              </div>
            </article>

            <article className="fo-sheet fo-sheet-life" data-scene="enter">
              <div className="fo-sheet-inner">
                <div className="fo-sheet-copy">
                  <span className="fo-sheet-number">02</span>
                  <small>原型探索</small>
                  <h3>Molis Life</h3>
                  <p>
                    账单到期、活动安排、想读的书和临时起意，常常散落在不同地方。Molis
                    Life
                    在得到授权后理解你的偏好，汇总这些日常事项，并把下一步准备好。
                  </p>
                </div>
                <LifeArt />
              </div>
            </article>

            <article className="fo-sheet fo-sheet-story" data-scene="enter">
              <div className="fo-sheet-inner">
                <div className="fo-sheet-copy">
                  <span className="fo-sheet-number">03</span>
                  <small>概念设计</small>
                  <h3>Molis Story</h3>
                  <p>
                    想放松或进入一段故事时，现有内容大多只能被动观看。Molis
                    Story
                    让你以自己的身份进入独立世界，通过阅读、交流、探索和行动参与其中，离开后还能继续这段经历。
                  </p>
                </div>
                <StoryArt />
              </div>
            </article>
          </div>
        </section>

        <section
          id="capabilities"
          className="fo-people"
          aria-labelledby="fo-people-title"
        >
          <div className="fo-people-head" data-reveal>
            <span className="fo-kicker">谁在把这些事情做出来</span>
            <h2 id="fo-people-title">
              一群真正做过，
              <br />
              也真正交付过的人。
            </h2>
            <p>
              我们负责过大型核心系统的架构与管理，也在硅谷创业公司和国内互联网核心团队里，反复经历从
              0 到 1、从 1 到规模化。今天，我们把这些经验带进 Molis。
            </p>
          </div>

          <div className="fo-proof" aria-label="团队成员的职业经历">
            <p>团队成员的职业经历包括</p>
            <div className="fo-logos">
              <span className="fo-logo-meituan">
                <img
                  src="/images/daylight/company_logo/美团/美团横式色彩标识.png"
                  width="1896"
                  height="687"
                  alt="美团"
                  loading="lazy"
                />
              </span>
              <span className="fo-logo-douyin">
                <img
                  src="/images/daylight/company_logo/douyin-group.jpg"
                  width="1749"
                  height="800"
                  alt="抖音集团"
                  loading="lazy"
                />
              </span>
              <span className="fo-logo-didi">
                <img
                  src="/images/daylight/company_logo/didi.jpg"
                  width="823"
                  height="800"
                  alt="滴滴"
                  loading="lazy"
                />
              </span>
              <span className="fo-logo-linkedin">
                <img
                  src="/images/daylight/company_logo/linkedin-svgrepo-com.svg"
                  width="382"
                  height="382"
                  alt="LinkedIn"
                  loading="lazy"
                />
                <b>LinkedIn</b>
              </span>
              <span className="fo-logo-red">
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

          <div className="fo-chapters">
            <article className="fo-chapter" data-reveal>
              <div className="fo-chapter-copy">
                <span className="fo-chapter-index">01</span>
                <h3>把真正的问题看清</h3>
                <p>
                  我们从真实工作现场出发，把模糊的“AI
                  提效”拆成具体流程、关键判断和可以验证的结果。
                </p>
              </div>
              <div className="fo-chapter-people">
                <Person
                  tone="red"
                  image="/images/daylight/team/zhuangshi.jpg"
                  personRole="AI 数据产品与复杂业务设计"
                  experience="曾任字节、美团核心团队 AI 数据产品资深专家；参与抖音数据管理及功能建设，拥有相关软件著作权，并受邀在 DataFun、美团大学与 CSDI Summit 分享实践。"
                  aside="Molis 创始合伙人、首席布道人。Google 搜得到的女人。"
                />
              </div>
            </article>

            <article className="fo-chapter" data-reveal>
              <div className="fo-chapter-copy">
                <span className="fo-chapter-index">02</span>
                <h3>把复杂想法落地</h3>
                <p>
                  从AI Agent、企业知识库到AI
                  Native应用，我们把设想做成可以使用、维护和继续生长的产品。
                </p>
              </div>
              <div className="fo-chapter-people">
                <Person
                  tone="blue"
                  image="/images/daylight/team/yijun.jpg"
                  personRole="系统架构、产品与技术管理"
                  experience="曾在美团、字节、滴滴、LinkedIn 及多家硅谷创业公司的核心研发团队负责架构与管理，长期建设和演进高复杂度核心系统。"
                  aside="Molis AI Founder。首席 Token 官，也是一个幻想家。"
                />
                <Person
                  tone="sage"
                  image="/images/daylight/team/xiejun.jpeg"
                  imagePosition="50% 48%"
                  personRole="AI Native 与 Agent 工程"
                  experience="8 年美团研发经验，较早参与企业知识库、RAG、Prompt Engineering 与 Agent 实践；长期深耕数据、计算、平台架构和复杂系统工程化，目前聚焦 AI Agent、AI Coding 与 AI Native 软件架构。"
                  aside="从北京骑回南宁的工程师。叫我谢尊。"
                />
              </div>
            </article>

            <article className="fo-chapter" data-reveal>
              <div className="fo-chapter-copy">
                <span className="fo-chapter-index">03</span>
                <h3>带来可量化的价值</h3>
                <p>
                  我们不只交付原型，也和业务团队一起把产品带进真实流程，创造真正的业务指标增量。
                </p>
              </div>
              <div className="fo-chapter-people">
                <Person
                  tone="yellow"
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

      <footer className="fo-back">
        <div className="fo-back-head">
          <h2>
            你正在好奇
            <br />
            什么<span className="fo-back-mark">？</span>
          </h2>
          <p>
            从一个还没想清楚的念头，到一个已经卡了很久的具体问题，都可以成为相遇的开始。
          </p>
        </div>
        <div className="fo-back-paths">
          <Link href="/demos/community" className="fo-back-path">
            <small>如果你也在创造</small>
            <h3>来看看一群人，怎样把新的可能一起做出来。</h3>
            <span>
              去社区看看 <ArrowUpRight size={19} />
            </span>
          </Link>
          <Link href="/join" className="fo-back-path">
            <small>如果你来自企业或团队</small>
            <h3>带着一个具体问题来，我们先一起把它看清。</h3>
            <span>
              和我们聊聊 <ArrowUpRight size={19} />
            </span>
          </Link>
        </div>
        <div className="fo-colophon">
          <span className="fo-colophon-mark">Molis</span>
          <div>
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
        </div>
      </footer>
    </div>
  );
}
