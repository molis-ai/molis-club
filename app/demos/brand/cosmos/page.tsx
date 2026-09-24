'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, RotateCw } from 'lucide-react';
import './cosmos.css';

type Source =
  | { kind: 'photo'; src: string; ratio: number }
  | { kind: 'icon'; src: string; color: string };

const sources: Source[] = [
  { kind: 'photo', src: 'monet-pond', ratio: 1.5 },
  { kind: 'photo', src: 'studio-desk', ratio: 1.5 },
  { kind: 'icon', src: '/images/products/niulai.png', color: '#f3c77a' },
  { kind: 'photo', src: 'wes-lake', ratio: 0.667 },
  { kind: 'photo', src: 'making-study', ratio: 1.5 },
  { kind: 'photo', src: 'possibility-loop', ratio: 1.5 },
  { kind: 'icon', src: '/images/products/jelly.png', color: '#d9e2ea' },
  { kind: 'photo', src: 'dali-forest', ratio: 1.78 },
  { kind: 'photo', src: 'reading-room', ratio: 1.5 },
  { kind: 'photo', src: 'perspectives-atelier', ratio: 1 },
  { kind: 'icon', src: '/images/products/elsewhere.png', color: '#e7ddd0' },
  { kind: 'photo', src: 'threshold', ratio: 1.6 },
  { kind: 'photo', src: 'line-experience', ratio: 1.5 },
  { kind: 'photo', src: 'shared-studio', ratio: 1.5 },
  { kind: 'icon', src: '/images/molis-logo.png', color: '#f4eee8' },
  { kind: 'photo', src: 'encyclopedia-atelier', ratio: 1.5 },
  { kind: 'photo', src: 'studio-light', ratio: 1.78 },
  { kind: 'photo', src: 'line-tools', ratio: 1.5 },
  { kind: 'photo', src: 'solutions-atelier', ratio: 1.5 },
  { kind: 'photo', src: 'line-engineering', ratio: 1.5 },
];

function random(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

const tiles = Array.from({ length: 30 }, (_, i) => {
  const source = sources[i % sources.length];
  const angle = (i * 137.508 * Math.PI) / 180;
  const radius = 300 + random(i) * 420;
  const duration = 30 + random(i + 50) * 18;
  return {
    source,
    x: Math.cos(angle) * radius * 1.5,
    y: Math.sin(angle) * radius * 0.78,
    width: source.kind === 'icon' ? 104 : 128 + random(i + 7) * 76,
    tilt: (random(i + 21) - 0.5) * 16,
    duration,
    delay: -random(i + 99) * duration,
  };
});

const curiosities = [
  '怎样让 AI 的工作接得上？',
  '等待，能不能有一点温度？',
  '艺术家的方法，能不能带走？',
  '没选择的那条路，会通向哪里？',
];

const workSteps = [
  { text: '说清想得到的结果', meta: '依据：两次访谈记录' },
  { text: '整理已有的三份访谈笔记', meta: '已完成 · 附来源' },
  { text: '等你判断：问题顺序是否合适', meta: '需要你的决定' },
];

const cowStates = [
  { key: 'thinking', label: '思考中', bubble: 'AI 还在想……我帮你盯着' },
  { key: 'waiting', label: '等你确认', bubble: '它写完了，等你来看看！' },
  { key: 'done', label: '完成了', bubble: '都搞定啦，去喝杯水吧' },
];

const artists = [
  { key: 'monet', label: '莫奈', src: '/images/artists/monet-pond.jpg', w: 1440, h: 960 },
  { key: 'dali', label: '达利', src: '/images/artists/dali-forest.jpg', w: 1440, h: 810 },
  { key: 'wes', label: '韦斯', src: '/images/artists/wes-lake.jpg', w: 960, h: 1440 },
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, inView] as const;
}

export default function CosmosDirection() {
  const [dark, setDark] = useState(false);
  const [question, setQuestion] = useState(0);
  const [session, setSession] = useState(1);
  const [cow, setCow] = useState(0);
  const [cowAuto, setCowAuto] = useState(true);
  const [artist, setArtist] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const [workRef, workIn] = useInView<HTMLDivElement>();
  const [cowRef, cowIn] = useInView<HTMLDivElement>();

  useEffect(() => {
    const timer = window.setInterval(
      () => setQuestion((value) => (value + 1) % curiosities.length),
      3400,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!cowAuto || !cowIn) return;
    const timer = window.setInterval(
      () => setCow((value) => (value + 1) % cowStates.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, [cowAuto, cowIn]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      hero.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      hero.style.setProperty('--rx', (y * -7).toFixed(2) + 'deg');
    };
    const observer = new IntersectionObserver(([entry]) =>
      hero.classList.toggle('cs-paused', !entry.isIntersecting),
    );
    observer.observe(hero);
    hero.addEventListener('pointermove', onPointer);
    return () => {
      observer.disconnect();
      hero.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <div className={dark ? 'cs-site cs-dark' : 'cs-site'}>
      <header className="cs-header">
        <Link href="/demos/brand/cosmos" className="cs-logo">
          <img src="/images/molis-logo.png" width="32" height="32" alt="" />
          <span>Molis AI</span>
        </Link>
        <p className="cs-wonder" aria-label="我们正在好奇的问题">
          <span className="cs-wonder-label">正在好奇</span>
          <span className="cs-wonder-text" key={question}>
            {curiosities[question]}
          </span>
        </p>
        <nav className="cs-actions" aria-label="主导航">
          <a href="#work">作品</a>
          <Link
            href="/join"
            target="_blank"
            rel="noreferrer"
            className="cs-button cs-button-dark"
          >
            聊聊
          </Link>
        </nav>
      </header>

      <main id="main">
        <section className="cs-hero" ref={heroRef} aria-labelledby="cs-title">
          <div className="cs-stage" aria-hidden="true">
            {tiles.map((tile, index) => (
              <span
                key={index}
                className={`cs-tile cs-tile-${tile.source.kind}`}
                style={
                  {
                    '--x': `${tile.x.toFixed(0)}px`,
                    '--y': `${tile.y.toFixed(0)}px`,
                    '--w': `${tile.width.toFixed(0)}px`,
                    '--t': `${tile.tilt.toFixed(1)}deg`,
                    '--d': `${tile.duration.toFixed(1)}s`,
                    '--delay': `${tile.delay.toFixed(1)}s`,
                    '--c':
                      tile.source.kind === 'icon' ? tile.source.color : undefined,
                    aspectRatio:
                      tile.source.kind === 'photo' ? tile.source.ratio : 1,
                  } as React.CSSProperties
                }
              >
                {tile.source.kind === 'photo' ? (
                  <img
                    src={`/images/demos/cosmos/${tile.source.src}.jpg`}
                    alt=""
                    loading={index < 12 ? 'eager' : 'lazy'}
                  />
                ) : (
                  <img src={tile.source.src} alt="" />
                )}
              </span>
            ))}
          </div>
          <div className="cs-hero-copy">
            <p className="cs-wordmark">MOLIS AI</p>
            <h1 id="cs-title">
              始终好奇<span className="cs-punct">，</span>
              <br />
              持续创造
            </h1>
            <div className="cs-hero-actions">
              <a href="#work" className="cs-button cs-button-dark">
                看看作品
              </a>
              <Link
                href="/join"
                target="_blank"
                rel="noreferrer"
                className="cs-button cs-button-light"
              >
                和我们聊聊
              </Link>
            </div>
          </div>
          <fieldset className="cs-theme">
            <legend className="cs-sr-only">页面明暗</legend>
            <button
              type="button"
              aria-pressed={!dark}
              onClick={() => setDark(false)}
            >
              亮
            </button>
            <button
              type="button"
              aria-pressed={dark}
              onClick={() => setDark(true)}
            >
              暗
            </button>
          </fieldset>
          <a href="#work" className="cs-scroll">
            往下看看
          </a>
        </section>

        <section id="work" className="cs-intro" aria-labelledby="cs-intro-title">
          <h2 id="cs-intro-title">每一件作品，都从一个好奇开始。</h2>
          <p>
            Molis AI 是一间产品工作室。我们和 AI 一起，把问题问具体，把原型带进真实生活，再把方法留给后来的人。
          </p>
        </section>

        <section className="cs-chapter" aria-labelledby="cs-work-title">
          <h2 id="cs-work-title">换一个会话，工作也接得上。</h2>
          <div
            className={workIn ? 'cs-panel cs-panel-sage is-in' : 'cs-panel cs-panel-sage'}
            ref={workRef}
          >
            <div className="cs-work">
              <div className="cs-sessions" aria-hidden="true">
                {[1, 2, 3].map((value) => (
                  <span key={value} className={value === session ? 'is-on' : ''}>
                    会话 {value}
                  </span>
                ))}
              </div>
              <div className="cs-work-card" key={session}>
                <p className="cs-work-kicker">Molis Work · 项目记录</p>
                <p className="cs-work-goal">做好第一版用户访谈指南</p>
                <ol>
                  {workSteps.map((step, index) => (
                    <li
                      key={step.text}
                      className={index < 2 ? 'is-done' : 'is-now'}
                      style={{ '--i': index } as React.CSSProperties}
                    >
                      <span>{step.text}</span>
                      <small>{step.meta}</small>
                    </li>
                  ))}
                </ol>
                <p className="cs-work-foot" aria-live="polite">
                  {session === 1
                    ? '这是会话 1 留下的记录。'
                    : `会话 ${session} 读到了同一份记录：目标、进展和依据都在。`}
                </p>
              </div>
              <button
                type="button"
                className="cs-pill-button"
                onClick={() => setSession((session % 3) + 1)}
              >
                <RotateCw size={16} /> 换一个会话
              </button>
            </div>
            <span className="cs-panel-note">交互示意，不是真实用户数据</span>
          </div>
          <p className="cs-caption">
            <strong>Molis Work</strong> · 公开源码，本地优先，持续开发
            <Link
              href="https://github.com/molis-ai/molis-work"
              target="_blank"
              rel="noreferrer"
            >
              了解更多 <ArrowUpRight size={15} />
            </Link>
          </p>
        </section>

        <section className="cs-chapter" aria-labelledby="cs-cow-title">
          <h2 id="cs-cow-title">让一头小牛，替你留意 AI 的进度。</h2>
          <div className="cs-panel cs-panel-blue" ref={cowRef}>
            <div className={`cs-cow cs-cow-${cowStates[cow].key}`}>
              <span className="cs-cow-bubble" key={cow}>
                {cowStates[cow].bubble}
              </span>
              <img
                src="/images/products/niulai.png"
                width="192"
                height="192"
                alt="niul.ai 的黄色小牛"
                loading="lazy"
              />
            </div>
            <fieldset className="cs-segment">
              <legend className="cs-sr-only">AI 会话状态</legend>
              {cowStates.map((state, index) => (
                <button
                  key={state.key}
                  type="button"
                  aria-pressed={cow === index}
                  onClick={() => {
                    setCowAuto(false);
                    setCow(index);
                  }}
                >
                  {state.label}
                </button>
              ))}
            </fieldset>
          </div>
          <p className="cs-caption">
            <strong>niul.ai</strong> · 公开源码
            <Link
              href="https://github.com/molis-ai/niul.ai"
              target="_blank"
              rel="noreferrer"
            >
              了解更多 <ArrowUpRight size={15} />
            </Link>
          </p>
        </section>

        <section className="cs-chapter" aria-labelledby="cs-art-title">
          <h2 id="cs-art-title">把艺术家的方法，留给后来的人。</h2>
          <div className="cs-panel cs-panel-slate">
            <div className="cs-art">
              {artists.map((item, index) => (
                <img
                  key={item.key}
                  src={item.src}
                  width={item.w}
                  height={item.h}
                  alt={`${item.label}风格的 AI 创作试样`}
                  loading="lazy"
                  className={artist === index ? 'is-on' : ''}
                />
              ))}
            </div>
            <fieldset className="cs-segment">
              <legend className="cs-sr-only">选择艺术家风格</legend>
              {artists.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={artist === index}
                  onClick={() => setArtist(index)}
                >
                  {item.label}
                </button>
              ))}
            </fieldset>
            <span className="cs-panel-note">AI 创作试样，非艺术家原作</span>
          </div>
          <p className="cs-caption">
            <strong>Artist Skill</strong> · 4 个可下载的 Skill
            <Link href="/wiki/artists" target="_blank" rel="noreferrer">
              去百科看看 <ArrowUpRight size={15} />
            </Link>
          </p>
        </section>

        <section className="cs-end" aria-labelledby="cs-end-title">
          <h2 id="cs-end-title">和我们一起，保持好奇。</h2>
          <Link
            href="/join"
            target="_blank"
            rel="noreferrer"
            className="cs-button cs-button-dark cs-button-large"
          >
            聊聊你的想法
          </Link>
        </section>
      </main>

      <footer className="cs-footer">
        <span>Molis AI · 始终好奇，持续创造</span>
        <Link href="https://github.com/molis-ai" target="_blank" rel="noreferrer">
          GitHub
        </Link>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
