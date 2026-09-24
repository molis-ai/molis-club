'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './daylight.css';

const statement =
  '技术应该回到人的尺度。我们做产品，是为了让人更从容地好奇、判断与创造。';

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

export default function DaylightDirection() {
  const heroRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const section = statementRef.current;
    if (!hero || !section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = section.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -box.top / travel));
      section.style.setProperty('--p', progress.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      hero.style.setProperty('--sun-x', (x * 28).toFixed(1) + 'px');
      hero.style.setProperty('--sun-y', (y * 18).toFixed(1) + 'px');
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    hero.addEventListener('pointermove', onPointer);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      hero.removeEventListener('pointermove', onPointer);
    };
  }, []);

  const characters = Array.from(statement);

  return (
    <div className="dl-site">
      <header className="dl-header">
        <Link href="/demos/brand/daylight" className="dl-logo">
          <img src="/images/molis-logo.png" width="44" height="44" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="dl-pill" aria-label="主导航">
          <a href="#work">作品</a>
          <a href="#letter">关于我们</a>
          <Link
            href="/join"
            target="_blank"
            rel="noreferrer"
            className="dl-pill-cta"
          >
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
            href="#work"
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
              <small>正在做</small>
              <strong>Molis Work</strong>
              <span>换一个会话，工作也接得上</span>
            </span>
          </a>
        </section>

        <section
          className="dl-statement"
          ref={statementRef}
          aria-label="我们的立场"
          style={{ '--n': characters.length } as React.CSSProperties}
        >
          <div className="dl-statement-stage">
            <p className="dl-sr-only">{statement}</p>
            <p aria-hidden="true">
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

        <section id="work" className="dl-work" aria-labelledby="dl-work-title">
          <div className="dl-work-heading">
            <h2 id="dl-work-title">我们正在做的</h2>
            <p>
              从工作中的具体问题，到生活里细微的感受。每件作品都标明它现在走到了哪一步。
            </p>
          </div>

          <article className="dl-feature">
            <div className="dl-feature-copy">
              <span className="dl-stage">公开源码 · 本地优先</span>
              <h3>Molis Work</h3>
              <p>
                把目标、进展与依据留在同一处。换一个 AI
                会话，工作也能接着推进；需要你判断的事，会等你来决定。
              </p>
              <Link
                href="https://github.com/molis-ai/molis-work"
                target="_blank"
                rel="noreferrer"
                className="dl-link"
              >
                了解 Molis Work <ArrowUpRight size={18} />
              </Link>
            </div>
            <figure className="dl-paper" aria-label="Molis Work 工作记录示意">
              <LeafShadow />
              <div className="dl-paper-sheet">
                <div className="dl-paper-top">
                  <span>Molis Work</span>
                  <span>周四 · 上午</span>
                </div>
                <p className="dl-paper-label">目标</p>
                <p className="dl-paper-goal">做好第一版用户访谈指南</p>
                <ol>
                  <li className="dl-done">
                    <span>说清想得到的结果</span>
                    <time>周一</time>
                  </li>
                  <li className="dl-done">
                    <span>整理已有的三份访谈笔记</span>
                    <time>周二</time>
                  </li>
                  <li className="dl-now">
                    <span>等你判断：问题的顺序是否合适</span>
                    <time>现在</time>
                  </li>
                </ol>
                <p className="dl-paper-note">
                  昨天的发现，也是今天的起点。
                </p>
              </div>
              <figcaption>工作记录示意，不是真实用户数据</figcaption>
            </figure>
          </article>

          <div className="dl-pair">
            <article className="dl-card dl-card-cow">
              <Link
                href="https://github.com/molis-ai/niul.ai"
                target="_blank"
                rel="noreferrer"
                className="dl-card-image"
                aria-label="niul.ai 公开源码"
              >
                <LeafShadow />
                <img
                  src="/images/products/niulai.png"
                  width="192"
                  height="192"
                  alt="niul.ai 的黄色小牛"
                  loading="lazy"
                />
              </Link>
              <span className="dl-stage">公开源码</span>
              <h3>niul.ai</h3>
              <p>让一头小牛替你留意 AI 的进度。等待，也可以有一点温度。</p>
            </article>
            <article className="dl-card">
              <Link
                href="/works/elsewhere"
                target="_blank"
                rel="noreferrer"
                className="dl-card-image dl-card-photo"
                aria-label="阅读 Elsewhere 的介绍"
              >
                <img
                  src="/images/atelier/threshold.jpg"
                  width="1440"
                  height="900"
                  alt=""
                  loading="lazy"
                />
              </Link>
              <span className="dl-stage">内部体验 · 尚未开放下载</span>
              <h3>Elsewhere</h3>
              <p>走一走未曾选择的人生，再带着一封归来信，回到当下。</p>
            </article>
          </div>
        </section>

        <section
          id="letter"
          className="dl-letter"
          aria-labelledby="dl-letter-title"
        >
          <h2 id="dl-letter-title">做一家无限游戏的公司</h2>
          <p>
            我们不追求一次分出胜负，而是希望和愿意共同探索的人，把创造持续下去。
          </p>
          <p>
            所以我们先把问题问具体：谁遇到了困难，卡在哪一步，现在怎样解决。再让原型进入自己的工作与日常，记录哪里有用、哪里别扭。
          </p>
          <p>
            分享作品时，我们也留下方法、尝试的过程和还没解决的问题，让后来的人可以接着做。
          </p>
          <p className="dl-sign">始终好奇，持续创造。— Molis AI</p>
        </section>
      </main>

      <footer className="dl-footer">
        <div className="dl-footer-invite">
          <h2>你正在好奇什么？</h2>
          <Link
            href="/join"
            target="_blank"
            rel="noreferrer"
            className="dl-footer-cta"
          >
            和我们聊聊 <ArrowUpRight size={20} />
          </Link>
        </div>
        <div className="dl-footer-meta">
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
