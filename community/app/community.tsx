'use client';
/* Direction contract — Purpose: introduce a studio through its work and writing.
Craft: legible typography, real project status, quiet functional account entry.
Own-world: warm ivory negative space, soft ink-blue, a softly tinted illustrated maker table as the background; the original supplied Molis logo and orange accent are unchanged by explicit user instruction; the user-provided maker illustration replaces abstract light only.
Story: curiosity becomes a small thing people can live with.
First viewport: restore the original large sans/italic-serif headline and bottom actions over a quiet maker illustration.
Form: open asymmetric portfolio, typographic studies; never dashboard cards.
Finish: restrained one-time graphic reveal, clear focus, honest unavailable states. */
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, ArrowRight, Plus } from 'lucide-react';
import { works } from '../content/works';
import { productLines } from '../content/lines';
import { Header, Footer } from './shell';
const lineArtwork = {
  experience: {
    src: '/images/line-experience.jpg',
    alt: '手账、信与分岔小路，关于选择和相遇的手绘插画',
  },
  tools: {
    src: '/images/line-tools.jpg',
    alt: '小牛、日历与便签组成的轻盈桌面插画',
  },
  engineering: {
    src: '/images/line-engineering.jpg',
    alt: '双手连接纸质模块，关于协作与创造的插画',
  },
};
const solutionRoutes = {
  'content-growth': ['研究与判断', '内容创作', '反馈与复盘'],
  evrik: ['业务能力', '目标与授权', '执行与检查'],
  aether: ['指标与知识', '分析与解释', '可编辑报告'],
};
export default function Community() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="studio-hero">
          <img
            className="hero-light"
            src="/images/molis-makers-studio.png"
            width="1536"
            height="1024"
            alt=""
            fetchPriority="high"
          />
          <div className="hero-content">
            <h1>
              A curious mind.
              <br />
              <em>A human touch.</em>
            </h1>
            <div className="hero-bottom">
              <div className="hero-paths">
                <Link className="hero-explore" href="/products">
                  发现产品 <ArrowDownRight size={28} />
                </Link>
                <Link className="hero-secondary" href="/solutions">
                  为业务寻找 AI 方案 <ArrowUpRight size={16} />
                </Link>
              </div>
              <div>
                <h2>让技术，多一点人的温度。</h2>
                <p>
                  Molis AI，一个保持好奇的 AI 创作工作室。
                  <br className="desktop-break" />
                  做有感受的游戏、轻巧的工具，让 AI 融入日常与工作。
                </p>
              </div>
            </div>
          </div>
          <div className="hero-caption">
            <span>Curiosity, made tangible.</span>
            <span>MOLIS AI · INDEPENDENT STUDIO</span>
          </div>
        </section>
        <section className="product-lines section-wrap" id="works">
          <div className="section-heading">
            <h2>
              Products<span>给日常一点不同，给创造多一点可能。</span>
            </h2>
            <Link className="text-link" href="/products">
              全部产品 <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="illustrated-lines">
            {productLines.map((line) => (
              <article className="illustrated-line" key={line.id}>
                <div className="line-art-scene">
                  <Link
                    className="line-illustration"
                    href={`/products?line=${line.id}`}
                    aria-label={`浏览${line.name}`}
                  >
                    <img
                      src={lineArtwork[line.id].src}
                      alt={lineArtwork[line.id].alt}
                      width="1536"
                      height="1024"
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                  {line.projects.slice(0, 2).map((slug) => {
                    const w = works.find((work) => work.slug === slug)!;
                    return (
                      <div className="floating-product" key={slug}>
                        <Link href={`/works/${slug}`}>
                          <span>
                            {w.name}
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </span>
                          <small>{w.status}</small>
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <div className="illustrated-line-copy">
                  <Link
                    className="line-title"
                    href={`/products?line=${line.id}`}
                  >
                    <h3>{line.name}</h3>
                    <em>{line.english}</em>
                  </Link>
                  <p>{line.description}</p>
                  <details className="work-disclosure">
                    <summary>
                      <span className="disclosure-closed">
                        展开 {line.projects.length} 件作品
                      </span>
                      <span className="disclosure-open">收起作品</span>
                      <Plus size={20} aria-hidden="true" />
                    </summary>
                    <div className="work-disclosure-content">
                      {line.projects.map((slug) => {
                        const w = works.find((w) => w.slug === slug)!;
                        return (
                          <Link
                            className="disclosed-work"
                            key={slug}
                            href={`/works/${slug}`}
                          >
                            <div>
                              <h4>{w.name}</h4>
                              <ArrowUpRight size={16} />
                            </div>
                            <p>{w.title}</p>
                            <span>{w.status}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </details>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="solutions-preview section-wrap" id="solutions">
          <div className="section-heading">
            <h2>
              Solutions<span>把 AI 放进真实的业务。</span>
            </h2>
            <Link className="text-link" href="/solutions">
              探索解决方案 <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="solution-studies">
            {works
              .filter((w) => w.category === 'Solutions')
              .map((w, index) => (
                <details
                  className="solution-study"
                  key={w.slug}
                  name="home-solutions"
                  open={index === 0}
                >
                  <summary>
                    <div>
                      <h3>{w.name}</h3>
                      <span>
                        {w.slug === 'content-growth'
                          ? '内容与增长'
                          : w.slug === 'evrik'
                            ? '软件 Agent 化'
                            : '数据与洞察'}
                      </span>
                    </div>
                    <p>{w.description}</p>
                    <Plus size={23} aria-hidden="true" />
                  </summary>
                  <div className="solution-study-content">
                    <div className="solution-route">
                      <p>方案路径</p>
                      <ol>
                        {solutionRoutes[w.slug].map((step, stepIndex) => (
                          <li key={step}>
                            <span>{step}</span>
                            {stepIndex < 2 && (
                              <ArrowRight size={19} aria-hidden="true" />
                            )}
                          </li>
                        ))}
                      </ol>
                      <span>示意路径 · 实际能力以当前阶段为准</span>
                    </div>
                    <div className="solution-context">
                      <h4>{w.status}</h4>
                      <p>{w.detail}</p>
                      <Link className="text-link" href={`/works/${w.slug}`}>
                        了解 {w.name}
                        <ArrowUpRight size={17} />
                      </Link>
                    </div>
                  </div>
                </details>
              ))}
          </div>
          <p className="solution-caption">
            这些方案正在逐步验证。每个项目页都保留了当前阶段与边界。
          </p>
        </section>
        <section className="studio-about section-wrap" id="studio">
          <div>
            <h2>
              Made with AI.
              <br />
              <em>Meant for people.</em>
            </h2>
            <span className="about-signature">MOLIS AI / ADEPTIFY</span>
          </div>
          <div className="about-copy">
            <h3>
              能力不断生长，
              <br />
              人的尺度始终在场。
            </h3>
            <p>
              我们是 Adeptify 团队。Molis AI 是我们的 AI 创作工作室。
              一头替你留意 AI
              进度的牛，一次与陌生生命的相遇，一段关于“如果”的旅程。我们想做的东西，常常从一个很小、很具体的感受开始。
            </p>
            <p>
              机器可以承担更多执行。至于什么值得做、做成什么样，仍然由人来决定。
            </p>
            <Link className="text-link" href="/story/human-scale">
              读读我们的故事 <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
        <section className="journal section-wrap" id="journal">
          <div className="section-heading">
            <h2>
              作品以外<span>Notes from the studio</span>
            </h2>
            <p>一些还在生长的判断。</p>
          </div>
          <div className="journal-spread">
            <Link className="journal-entry" href="/story/idealism">
              <h3>落地主义</h3>
              <em aria-hidden="true">Ideas, into life.</em>
              <p>一种不承认自己是哲学的哲学。</p>
              <span>
                读一份自白 <ArrowUpRight size={22} />
              </span>
            </Link>
            <Link className="journal-entry" href="/story/human-scale">
              <h3>人的尺度</h3>
              <em aria-hidden="true">A human measure.</em>
              <p>理想主义在 AI 时代的生与死。</p>
              <span>
                读一个故事 <ArrowUpRight size={22} />
              </span>
            </Link>
          </div>
        </section>
        <section
          className="studio-questions section-wrap"
          aria-labelledby="questions-title"
        >
          <h2 id="questions-title">来之前，你也许想知道</h2>
          <div>
            <details>
              <summary>现在有哪些产品可以使用？</summary>
              <p>
                Jelly 已有 Mac 安装包；niul.ai、ForkLight 和 GoalBoard
                已有公开仓库。其余作品处于原型、开发或内部验证阶段，具体运行条件和进度都写在产品页。
                <Link href="/products">查看产品与当前状态</Link>
              </p>
            </details>
            <details>
              <summary>需要注册才能了解或下载作品吗？</summary>
              <p>
                站内浏览产品、阅读文章和前往公开仓库不需要注册 Molis AI
                账号。站内留言需要登录；合作联系可以直接提交。当前网站仍是受访问权限保护的私有预览。
              </p>
            </details>
            <details>
              <summary>有业务问题，可以从哪里开始合作？</summary>
              <p>
                先告诉我们你在为谁解决问题、现在怎样完成这项工作、最容易卡在哪里。我们会从具体场景讨论可行路径；方案页保留当前验证边界。
                <Link href="/join">说明你的场景</Link>
              </p>
            </details>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
