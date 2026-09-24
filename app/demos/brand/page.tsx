'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Plus,
  Check,
} from 'lucide-react';
import './brand.css';

const navigation = [
  { text: '作品', href: '#work' },
  { text: '创造方式', href: '#approach' },
  { text: '场景合作', href: '#practice' },
  { text: '关于我们', href: '#about' },
];
const explorations = [
  {
    question: '让内容创作，从有依据的研究开始。',
    name: 'Content Growth',
    text: '连接研究、选题与多平台创作。先弄明白什么值得写，再把材料变成有方向的内容；取舍与发布由人决定。',
    stage: '部分能力验证',
    href: '/works/content-growth',
  },
  {
    question: '让已有的软件，与 AI 一起工作。',
    name: 'Evrik',
    text: '让已有的业务能力接入 AI 工作方式，同时尊重原有的数据、规则与权限。先从限定的真实场景验证。',
    stage: '内部技术验证',
    href: '/works/evrik',
  },
  {
    question: '让分散的信息，成为可理解的判断。',
    name: 'Aether',
    text: '探索连接指标、知识与分析报告的工作空间。先理解人怎样作出判断，再决定工具应该怎样帮助。',
    stage: '方案设计',
    href: '/works/aether',
  },
];

export default function BrandSite() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="sb-site">
      <header className="sb-header">
        <Link
          href="/demos/brand"
          className="sb-logo"
          aria-label="Molis AI 首页"
        >
          <img src="/images/molis-logo.png" width="38" height="38" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav aria-label="品牌网站导航" className="sb-navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.text}
            </Link>
          ))}
        </nav>
        <Link className="sb-contact-link" href="#contact">
          聊聊你的想法 <ArrowUpRight size={17} />
        </Link>
        <button
          className="sb-menu-button"
          type="button"
          aria-label={menu ? '收起导航' : '打开导航'}
          aria-expanded={menu}
          aria-controls="sb-mobile-menu"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X size={24} /> : <Menu size={24} />}
        </button>
        {menu && (
          <nav
            id="sb-mobile-menu"
            aria-label="手机导航"
            className="sb-mobile-menu"
          >
            {navigation.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                onClick={() => setMenu(false)}
              >
                {item.text}
              </Link>
            ))}
            <Link href="#contact" onClick={() => setMenu(false)}>
              聊聊你的想法
            </Link>
          </nav>
        )}
      </header>
      <main id="main">
        <section className="sb-hero" aria-labelledby="sb-title">
          <div className="sb-hero-heading">
            <h1 id="sb-title">
              始终好奇，
              <br className="sb-mobile-break" />
              持续创造
            </h1>
            <div className="sb-hero-bottom">
              <p>
                我们是 Molis AI，
                <br />
                一间探索人与 AI 如何共同创造的产品工作室。
              </p>
              <Link href="#work" className="sb-explore">
                看看我们在做什么 <ArrowDown size={19} />
              </Link>
            </div>
          </div>
          <figure className="sb-hero-visual">
            <img
              src="/images/demos/possibility-loop.jpg"
              alt="一张连续回环的白色曲面，映出温暖的光"
              width="1536"
              height="1024"
              fetchPriority="high"
            />
          </figure>
        </section>
        <section
          id="work"
          className="sb-work sb-section"
          aria-labelledby="sb-work-title"
        >
          <div className="sb-section-heading">
            <h2 id="sb-work-title">让想法，成为作品。</h2>
            <p>
              从工作中的具体问题，到生活里细微的感受。
              <br />
              我们做有用的产品，也给想象留一点位置。
            </p>
          </div>
          <article className="sb-featured-work">
            <figure
              className="sb-work-image sb-workspace-art"
              aria-label="Molis Work 工作记录的概念示意：目标、进展、人的判断保存在一起"
            >
              <div className="sb-workspace-window">
                <div className="sb-window-top">
                  <span>Molis Work</span>
                  <span className="sb-window-tool">↗</span>
                </div>
                <div className="sb-window-document">
                  <span className="sb-document-label">我的工作空间</span>
                  <h4>
                    把一个想法，
                    <br />
                    做成好作品。
                  </h4>
                  <div className="sb-document-task">
                    <Check size={17} />
                    <span>说清想得到的结果</span>
                  </div>
                  <div className="sb-document-task">
                    <Check size={17} />
                    <span>留下每一步的进展</span>
                  </div>
                  <div className="sb-document-task sb-task-current">
                    <span className="sb-task-circle" />
                    <span>回到最初的约定，看看结果</span>
                  </div>
                  <div className="sb-document-note">
                    昨天的发现，也是今天的起点。
                  </div>
                </div>
              </div>
              <figcaption className="sb-image-note">
                工作记录的概念示意
              </figcaption>
            </figure>
            <div className="sb-featured-copy">
              <h3>Molis Work</h3>
              <p>
                把目标、进展与依据留在一起，
                <br />
                让工作在不同的 AI 会话之间，
                <br />
                接着推进。
              </p>
              <span className="sb-stage">本地优先 · 持续开发</span>
              <Link
                href="https://github.com/molis-ai/molis-work"
                target="_blank"
                rel="noreferrer"
                className="sb-text-link"
              >
                了解产品与源码 <ArrowUpRight size={18} />
              </Link>
            </div>
          </article>
          <div className="sb-other-works">
            <article className="sb-project sb-project-cow">
              <Link
                className="sb-project-image sb-cow-image"
                href="https://github.com/molis-ai/niul.ai"
                target="_blank"
                rel="noreferrer"
                aria-label="了解 niul.ai 的公开源码"
              >
                <div className="sb-cow-shadow" />
                <img
                  src="/images/products/niulai.png"
                  alt="一只黄色的 niul.ai 桌面小牛"
                  width="192"
                  height="192"
                  loading="lazy"
                />
                <span className="sb-project-arrow">
                  <ArrowUpRight size={25} />
                </span>
              </Link>
              <div className="sb-project-title">
                <h3>niul.ai</h3>
                <span className="sb-stage">公开源码</span>
              </div>
              <p>
                让一头小牛替你留意 AI 的进度。
                <br />
                等待，也可以有一点温度。
              </p>
            </article>
            <article className="sb-project sb-project-elsewhere">
              <Link
                className="sb-project-image sb-elsewhere-image"
                href="/works/elsewhere"
                target="_blank"
                rel="noreferrer"
                aria-label="阅读 Elsewhere 项目介绍"
              >
                <img
                  src="/images/atelier/threshold.jpg"
                  alt="一扇向光打开的门，通往安静的阅读空间"
                  width="1400"
                  height="1100"
                  loading="lazy"
                />
                <span className="sb-project-arrow">
                  <ArrowUpRight size={25} />
                </span>
              </Link>
              <div className="sb-project-title">
                <h3>Elsewhere</h3>
                <span className="sb-stage">内部体验 · 尚未开放下载</span>
              </div>
              <p>
                走一走未曾选择的人生，
                <br />
                再带着一封归来信，回到当下。
              </p>
            </article>
          </div>
          <Link
            className="sb-text-link sb-all-work"
            href="/products"
            target="_blank"
            rel="noreferrer"
          >
            浏览现有作品目录 <ArrowUpRight size={18} />
          </Link>
        </section>
        <section
          id="approach"
          className="sb-approach"
          aria-labelledby="sb-approach-title"
        >
          <div className="sb-approach-inner">
            <h2 id="sb-approach-title">
              先理解人，
              <br />
              再动手创造。
            </h2>
            <div className="sb-principles">
              <article>
                <h3>把问题问具体。</h3>
                <p>
                  谁遇到了困难，卡在哪一步，现在怎样解决。先听明白，再开始做。
                </p>
              </article>
              <article>
                <h3>带到真实生活里。</h3>
                <p>
                  让原型进入自己的工作与日常。记录哪里有用、哪里别扭，再继续修改。
                </p>
              </article>
              <article>
                <h3>让后来的人接着做。</h3>
                <p>分享作品时，也留下使用方法、尝试过程和还没解决的问题。</p>
              </article>
            </div>
          </div>
        </section>
        <section
          id="practice"
          className="sb-practice sb-section"
          aria-labelledby="sb-practice-title"
        >
          <div className="sb-practice-intro">
            <h2 id="sb-practice-title">
              把产品带进
              <br />
              真实场景。
            </h2>
            <p>
              聊清你的问题和现有做法，找到值得验证的切入点。再通过一个小范围原型，一起判断产品怎样用起来。
            </p>
            <Link href="#contact" className="sb-text-link">
              聊聊你的场景 <ArrowRight size={18} />
            </Link>
          </div>
          <div className="sb-explorations">
            <p className="sb-explorations-label">我们正在探索的问题</p>
            {explorations.map((item) => (
              <details key={item.name} name="sb-explorations">
                <summary>
                  {item.question}
                  <Plus size={21} />
                </summary>
                <div className="sb-exploration-body">
                  <p>{item.text}</p>
                  <div>
                    <span>
                      {item.name} · {item.stage}
                    </span>
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`阅读 ${item.name} 的已有项目介绍`}
                    >
                      <ArrowUpRight size={19} />
                    </Link>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
        <section
          id="about"
          className="sb-about"
          aria-labelledby="sb-about-title"
        >
          <div className="sb-about-inner">
            <h2 id="sb-about-title">
              做一家
              <br />
              无限游戏的公司。
            </h2>
            <div className="sb-about-copy">
              <p>
                和愿意共同探索的人，
                <br />
                把创造持续下去。
              </p>
              <p>
                彼此信任，自主探索。用 AI
                拓展每个人的能力，共享经验与成果，一起做出值得存在的产品。
              </p>
              <Link
                href="/community#people"
                target="_blank"
                rel="noreferrer"
                className="sb-text-link"
              >
                认识一起创造的人 <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>
        <section id="contact" className="sb-contact sb-section">
          <div>
            <p>一个值得做的想法，往往始于一次交流。</p>
            <h2>你正在好奇什么？</h2>
          </div>
          <Link
            href="/join"
            target="_blank"
            rel="noreferrer"
            className="sb-contact-button"
          >
            和我们聊聊 <ArrowUpRight size={23} />
          </Link>
        </section>
      </main>
      <footer className="sb-footer">
        <Link href="/demos/brand" className="sb-footer-brand">
          Molis AI
        </Link>
        <span>始终好奇，持续创造</span>
        <div>
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
