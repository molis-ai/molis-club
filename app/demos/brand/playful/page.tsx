'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './playful.css';

const cowLines = [
  '嗨，我是 niul.ai 的小牛。',
  'AI 还在想……我帮你盯着。',
  '它写完了，等你来看看！',
  '都搞定啦，去喝杯水吧。',
];

type Product = {
  code: string;
  version: string;
  name: string;
  line: string;
  stage: string;
  href: string;
  icon: React.ReactNode;
};

const products: Product[] = [
  {
    code: 'MW—01',
    version: 'v0.2',
    name: 'molis work',
    line: '换一个会话，工作也接得上。',
    stage: '公开源码 · 本地优先',
    href: 'https://github.com/molis-ai/molis-work',
    icon: (
      <svg viewBox="0 0 120 120" className="pf-icon pf-icon-work">
        <circle cx="30" cy="30" r="14" />
        <rect x="46" y="46" width="28" height="28" />
        <circle className="pf-fill" cx="90" cy="90" r="14" />
        <path d="M40 40l6 6M74 74l6 6" />
      </svg>
    ),
  },
  {
    code: 'DA—01',
    version: 'v0.2',
    name: 'dropagent',
    line: '把文件放上置物架，交给 Agent 处理副本。',
    stage: '可下载 · macOS',
    href: 'https://github.com/molis-ai/DropAgent',
    icon: (
      <svg viewBox="0 0 120 120" className="pf-icon pf-icon-drop">
        <rect className="pf-fill pf-drop" x="46" y="14" width="28" height="28" />
        <path d="M18 64v30h84V64" />
        <path d="M60 50v14" />
      </svg>
    ),
  },
  {
    code: 'NL—01',
    version: '',
    name: 'niul.ai',
    line: '让一头小牛替你留意 AI 的进度。',
    stage: '公开源码',
    href: 'https://github.com/molis-ai/niul.ai',
    icon: (
      <svg viewBox="0 0 120 120" className="pf-icon pf-icon-cow">
        <path d="M26 30c0 12 8 16 14 16M94 30c0 12-8 16-14 16" />
        <rect x="30" y="40" width="60" height="58" rx="20" />
        <g className="pf-eyes">
          <circle className="pf-fill" cx="48" cy="62" r="5" />
          <circle className="pf-fill" cx="72" cy="62" r="5" />
        </g>
        <path d="M50 84h20" />
      </svg>
    ),
  },
  {
    code: 'JL—01',
    version: '',
    name: 'jelly',
    line: '日历、清单与笔记，放在同一张桌上。',
    stage: '公开源码 · macOS',
    href: 'https://github.com/molis-ai/Jelly',
    icon: (
      <svg viewBox="0 0 120 120" className="pf-icon pf-icon-jelly">
        <rect x="20" y="28" width="80" height="72" />
        <path d="M20 48h80M42 18v18M78 18v18" />
        <rect className="pf-fill pf-day" x="64" y="66" width="18" height="18" />
      </svg>
    ),
  },
  {
    code: 'ES—01',
    version: '',
    name: 'elsewhere',
    line: '走一走未曾选择的人生，再回到当下。',
    stage: '内部体验 · 尚未开放下载',
    href: '/works/elsewhere',
    icon: (
      <svg viewBox="0 0 120 120" className="pf-icon pf-icon-door">
        <circle className="pf-fill pf-sun" cx="60" cy="58" r="12" />
        <path d="M28 104V52a32 32 0 0 1 64 0v52" />
        <path className="pf-door" d="M28 104V52a32 32 0 0 1 32-32v84z" />
        <path d="M14 104h92" />
      </svg>
    ),
  },
  {
    code: 'AS—04',
    version: '×4',
    name: 'artist skill',
    line: '莫奈、达利、韦斯的创作方法，可以带走。',
    stage: '可下载的 Skill',
    href: '/wiki/artists',
    icon: (
      <svg viewBox="0 0 120 120" className="pf-icon pf-icon-brush">
        <path className="pf-wave" d="M14 92c14-18 26 8 40-8s26 6 38-10" />
        <path d="M70 58l32-40" />
        <rect
          className="pf-fill"
          x="58"
          y="52"
          width="18"
          height="22"
          transform="rotate(38 67 63)"
        />
      </svg>
    ),
  },
];

const steps = [
  {
    number: '01',
    title: '把问题问具体。',
    text: '谁遇到了困难，卡在哪一步，现在怎样解决。先听明白，再开始做。',
  },
  {
    number: '02',
    title: '带进真实生活。',
    text: '让原型进入自己的工作与日常。记下哪里有用、哪里别扭，再接着改。',
  },
  {
    number: '03',
    title: '留给后来的人。',
    text: '分享作品时，也留下方法、尝试的过程和还没解决的问题。',
  },
];

export default function PlayfulDirection() {
  const [cow, setCow] = useState(0);

  return (
    <div className="pf-site">
      <main id="main">
        <section className="pf-hero" aria-labelledby="pf-title">
          <header className="pf-header">
            <Link href="/demos/brand/playful" className="pf-logo">
              <img src="/images/molis-logo.png" width="48" height="48" alt="" />
              <span className="pf-sr-only">Molis AI 首页</span>
            </Link>
            <nav className="pf-bar" aria-label="主导航">
              <span className="pf-bar-brand">Molis AI</span>
              <span className="pf-bar-links">
                <a href="#catalog">作品</a>
                <i>•</i>
                <a href="#how">怎么做</a>
                <i>•</i>
                <Link href="/join" target="_blank" rel="noreferrer">
                  聊聊
                </Link>
              </span>
              <Link
                href="https://github.com/molis-ai"
                target="_blank"
                rel="noreferrer"
                className="pf-bar-end"
              >
                GitHub
              </Link>
            </nav>
            <svg className="pf-star" viewBox="0 0 60 60" aria-hidden="true">
              <path d="M30 4l6 18 18-6-12 14 12 14-18-6-6 18-6-18-18 6 12-14L6 16l18 6z" />
            </svg>
          </header>

          <h1 id="pf-title" className="pf-headline">
            <span className="pf-line pf-cream">
              我们是 <em>Molis AI</em>
              <span className="pf-punct">，</span>
            </span>
            <span className="pf-line pf-apricot">
              始终好奇<span className="pf-punct">，</span>
            </span>
            <span className="pf-line pf-cream">
              持续创造<span className="pf-punct">。</span>
            </span>
          </h1>
          <a href="#catalog" className="pf-scroll">
            <span aria-hidden="true">↓</span> 往下看看我们做了什么{' '}
            <span aria-hidden="true">↓</span>
          </a>

          <div className="pf-hill" aria-hidden="true">
            <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
              <path d="M0 120C180 40 360 30 560 90s380 110 560 60 250-90 320-80V220H0z" />
            </svg>
          </div>
          <button
            type="button"
            className="pf-cow"
            onClick={() => setCow((cow + 1) % cowLines.length)}
            aria-label="点一下小牛，看看它在帮你留意什么"
          >
            <span className="pf-bubble" key={cow} aria-live="polite">
              {cowLines[cow]}
            </span>
            <img
              src="/images/products/niulai.png"
              width="192"
              height="192"
              alt=""
            />
          </button>
        </section>

        <section
          id="catalog"
          className="pf-catalog"
          aria-labelledby="pf-catalog-title"
        >
          <div className="pf-catalog-head">
            <h2 id="pf-catalog-title">作品目录</h2>
            <dl className="pf-spec">
              {products.slice(0, 3).map((product) => (
                <div key={product.code}>
                  <dt>{product.code}</dt>
                  <dd>{product.version || '—'}</dd>
                </div>
              ))}
            </dl>
            <p className="pf-micro">
              molis ai makes things for people who work and play with ai.
              curious by default. making by habit. every item below says
              exactly how far it has come.
            </p>
          </div>

          <ul className="pf-grid">
            {products.map((product) => (
              <li key={product.code}>
                <Link
                  href={product.href}
                  target="_blank"
                  rel="noreferrer"
                  className="pf-tile"
                >
                  <span className="pf-tile-top">
                    <span>{product.code}</span>
                    <span className="pf-version">{product.version}</span>
                  </span>
                  <span className="pf-tile-icon" aria-hidden="true">
                    {product.icon}
                  </span>
                  <span className="pf-tile-name">{product.name}</span>
                  <span className="pf-tile-line">{product.line}</span>
                  <span className="pf-tile-stage">{product.stage}</span>
                  <ArrowUpRight className="pf-tile-arrow" size={22} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="how" className="pf-how" aria-labelledby="pf-how-title">
          <h2 id="pf-how-title">
            我们怎么做<span>how we make</span>
          </h2>
          <ol>
            {steps.map((step) => (
              <li key={step.number}>
                <span className="pf-number">{step.number}</span>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="pf-footer">
        <h2>你正在好奇什么？</h2>
        <Link
          href="/join"
          target="_blank"
          rel="noreferrer"
          className="pf-footer-cta"
        >
          和我们聊聊 <ArrowUpRight size={22} />
        </Link>
        <div className="pf-footer-meta">
          <span>molis ai</span>
          <span>始终好奇，持续创造</span>
          <span>©2026</span>
        </div>
      </footer>
    </div>
  );
}
