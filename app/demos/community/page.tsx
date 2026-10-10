'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  GitBranch,
  MessageCircle,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { artistSkills } from '../../../content/artists';
import { knowledge, knowledgePrompt } from '../../../content/knowledge';
import {
  Footer,
  HOME,
  WIKI,
  artistHref,
  contactHref,
  essayHref,
} from '../brand/folio/shared';
import '../brand/folio/folio.css';
import '../brand/folio/kit.css';
import './community.css';

const stagger = knowledge.find((entry) => entry.slug === 'stagger')!;
const accordion = knowledge.find((entry) => entry.slug === 'accordion')!;
const styles = artistSkills.filter((skill) => skill.image).slice(0, 3);
const palette = [
  { name: '群青', color: '#2d53e3' },
  { name: '朱红', color: '#bd432b' },
  { name: '松绿', color: '#306955' },
];
const experimentPrompt =
  '用 SVG 做一朵可以交互的线条花：以画面中心为原点，将一个椭圆旋转重复 24 次。增加一个从 0 到 100 的滑杆，同时改变椭圆的短轴和旋转间隔；提供三种背景色和 SVG 下载。保留清楚的控件标签、键盘操作和减少动态效果支持。不需要连接 AI 或后端。';

function OutLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="fcm-text-link" href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </a>
  );
}

function FlowerLines({ bloom, count = 24 }: { bloom: number; count?: number }) {
  return (
    <g
      transform="translate(260 230) rotate(-21)"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
    >
      {Array.from({ length: count }, (_, i) => (
        <ellipse
          key={i}
          rx="181"
          ry={15 + bloom * 0.86}
          transform={`rotate(${i * (3.1 + bloom * 0.073)})`}
        />
      ))}
    </g>
  );
}

function CopyAction({
  text,
  id,
  label = '复制提示词',
}: {
  text: string;
  id: string;
  label?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual'>('idle');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('manual');
    }
  };
  return (
    <div className="fcm-copy">
      <button
        type="button"
        className="fcm-text-link"
        onClick={copy}
        aria-describedby={`${id}-status`}
      >
        {status === 'copied' ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <Copy size={16} aria-hidden="true" />
        )}
        {label}
      </button>
      <output className="fcm-copy-status" id={`${id}-status`}>
        {status === 'copied'
          ? '已复制，可以带走了。'
          : status === 'manual'
            ? '请选中下方文字，手动复制。'
            : ''}
      </output>
      {status === 'manual' && (
        <textarea
          aria-label={`${label}内容`}
          readOnly
          value={text}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
    </div>
  );
}

function Playground() {
  const [bloom, setBloom] = useState(62);
  const [color, setColor] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const drawing = useRef<SVGSVGElement>(null);
  const save = () => {
    if (!drawing.current) return;
    const data = new XMLSerializer().serializeToString(drawing.current);
    const url = URL.createObjectURL(
      new Blob([data], { type: 'image/svg+xml;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = '一朵好奇-Molis-AI.svg';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  };
  return (
    <div className="fcm-playground" data-enter>
      <div className="fcm-poster-under" aria-hidden="true" />
      <figure
        className="fcm-poster"
        style={{ '--poster-color': palette[color].color } as CSSProperties}
      >
        <figcaption>
          <span>一朵好奇</span>
          <span>可以带走的小实验</span>
        </figcaption>
        {/* oxlint-disable jsx-a11y/prefer-tag-over-role -- 内联 SVG 随滑杆改变并可导出，需要保留可访问图像语义。 */}
        <svg
          ref={drawing}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 520 470"
          role="img"
          aria-labelledby="fcm-flower-title"
          className="fcm-flower"
        >
          <title id="fcm-flower-title">{`一朵好奇，${palette[color].name}，展开程度 ${bloom}%`}</title>
          <rect width="520" height="470" fill={palette[color].color} />
          <g color="#fff7e4">
            <FlowerLines bloom={bloom} />
          </g>
        </svg>
        {/* oxlint-enable jsx-a11y/prefer-tag-over-role */}
        <div className="fcm-poster-bottom">
          <span>24 条线，无数种可能。</span>
          <span aria-hidden="true">M / 01</span>
        </div>
      </figure>
      <div className="fcm-experiment-controls">
        <div className="fcm-range-label">
          <label htmlFor="fcm-bloom">拖一拖，让它长成你的样子</label>
          <output htmlFor="fcm-bloom">{bloom}%</output>
        </div>
        <input
          id="fcm-bloom"
          type="range"
          min="0"
          max="100"
          value={bloom}
          onChange={(event) => {
            setBloom(Number(event.target.value));
            setDownloaded(false);
          }}
        />
        <div className="fcm-control-bottom">
          <fieldset className="fcm-swatches" aria-label="选择花朵背景色">
            {palette.map((item, index) => (
              <button
                key={item.name}
                type="button"
                aria-label={item.name}
                aria-pressed={color === index}
                style={{ '--swatch': item.color } as CSSProperties}
                onClick={() => {
                  setColor(index);
                  setDownloaded(false);
                }}
              >
                {color === index && <Check size={13} aria-hidden="true" />}
              </button>
            ))}
          </fieldset>
          <button type="button" className="fcm-text-link" onClick={save}>
            <ArrowDownToLine size={16} aria-hidden="true" />
            下载这朵花
          </button>
        </div>
        <output className="fcm-download-status">
          {downloaded
            ? 'SVG 已开始下载，留给你的下一次创作。'
            : '不用登录，喜欢就带走。'}
        </output>
      </div>
      <span className="fcm-poster-note" aria-hidden="true">
        从这里，试一下。
      </span>
    </div>
  );
}

function Works() {
  const [waiting, setWaiting] = useState(true);
  const [styleIndex, setStyleIndex] = useState(0);
  const artist = styles[styleIndex];
  return (
    <section
      className="fcm-section fcm-works"
      id="works"
      aria-labelledby="fcm-works-title"
    >
      <div className="fcm-section-heading">
        <div>
          <p className="fcm-eyebrow">01 / 作品正在生长</p>
          <h2 id="fcm-works-title">
            小小的东西，
            <br />
            认认真真地做。
          </h2>
        </div>
        <p>
          有的是顺手的工具，有的是好奇的实验。
          <br />
          从一个具体的念头，走到可以试一试。
        </p>
      </div>
      <div className="fcm-work-grid">
        <article className="fcm-work-card" data-enter>
          <div className="fcm-work-art fcm-cow-art" data-waiting={waiting}>
            <div className="fcm-art-top">
              <span>桌面上的一点陪伴</span>
              <span>状态示意</span>
            </div>
            <div className="fcm-cow-scene">
              <p className="fcm-cow-speech" key={String(waiting)}>
                {waiting ? '我帮你看着呢。' : '干完啦，到你了。'}
              </p>
              <img
                src="/images/products/niulai.png"
                width="192"
                height="192"
                alt="niul.ai 黄色桌面小牛"
                loading="lazy"
              />
              <span className="fcm-cow-ground" />
            </div>
            <button
              type="button"
              className="fcm-demo-switch"
              aria-pressed={!waiting}
              onClick={() => setWaiting((value) => !value)}
            >
              <span className="fcm-state-dot" />
              {waiting ? '看看 Agent 完成时' : '再看看工作中'}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
          <div className="fcm-work-copy">
            <p className="fcm-work-type">桌面工具 · 公开仓库</p>
            <h3>
              niul.ai <span>牛来</span>
            </h3>
            <h4>
              等待 AI 的时候，
              <br />
              有头牛替你留意。
            </h4>
            <p>
              从反复切窗口，到被轻轻提醒。让每个 AI
              会话的进度，变成桌面上看得见的状态。
            </p>
            <OutLink href="https://github.com/molis-ai/niul.ai">
              去 GitHub 牵头牛
            </OutLink>
          </div>
        </article>
        <article className="fcm-work-card" data-enter>
          <div className="fcm-work-art fcm-artist-art">
            <div className="fcm-art-top">
              <span>换一种看世界的方式</span>
              <span>AI 创作试样</span>
            </div>
            <div className="fcm-art-print" key={artist.slug}>
              <img
                src={artist.image}
                width={artist.width}
                height={artist.height}
                alt={artist.imageAlt}
                loading="lazy"
              />
            </div>
            <fieldset className="fcm-style-picker" aria-label="选择艺术风格">
              {styles.map((item, index) => (
                <button
                  key={item.slug}
                  type="button"
                  aria-pressed={index === styleIndex}
                  onClick={() => setStyleIndex(index)}
                >
                  {['光与色', '梦的形状', '画面秩序'][index]}
                </button>
              ))}
            </fieldset>
          </div>
          <div className="fcm-work-copy">
            <p className="fcm-work-type">创作方法 · 开源 Skill</p>
            <h3>Artist Skill</h3>
            <h4>
              借一双眼睛，
              <br />
              做出自己的作品。
            </h4>
            <p>
              把光、笔触和构图整理成可以复用的方法。带上一个主题，在自己的 AI
              工具里开始创作。
            </p>
            <OutLink href="https://github.com/molis-ai/artist-skill">
              带走艺术家 Skill
            </OutLink>
          </div>
        </article>
        <article className="fcm-work-card" data-enter>
          <div className="fcm-work-art fcm-drop-art">
            <div className="fcm-art-top">
              <span>给零散材料一个落点</span>
              <span>流程示意</span>
            </div>
            <div
              className="fcm-drop-flow"
              aria-label="在副本上处理材料，原文件保留"
            >
              <div className="fcm-drop-document">
                <FileText size={26} aria-hidden="true" />
                <span>一份材料</span>
                <i />
                <i />
                <i />
              </div>
              <div className="fcm-drop-tray">
                <ArrowDown size={20} aria-hidden="true" />
                <span>在副本上处理</span>
              </div>
              <div className="fcm-drop-result">
                <Check size={18} aria-hidden="true" />
                <span>带走新结果</span>
              </div>
            </div>
            <p className="fcm-original-kept">原来的文件，还好好地留在那里。</p>
          </div>
          <div className="fcm-work-copy">
            <p className="fcm-work-type">Mac 工具 · 公开下载</p>
            <h3>DropAgent</h3>
            <h4>
              把材料放下，
              <br />
              把结果带走。
            </h4>
            <p>
              文件、网页、文字，交给已经装好的本地
              Agent。在副本上工作，再把结果带回手头的事情。
            </p>
            <OutLink href="https://github.com/molis-ai/DropAgent">
              查看项目与安装说明
            </OutLink>
          </div>
        </article>
      </div>
      <div className="fcm-works-end">
        <p>还有一些想法，正在慢慢成形。</p>
        <Link href={`${HOME}#products`} className="fcm-text-link">
          看看 Molis 的产品
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section
      className="fcm-process"
      id="process"
      aria-labelledby="fcm-process-title"
    >
      <div className="fcm-section">
        <div className="fcm-section-heading">
          <div>
            <p className="fcm-eyebrow">02 / 把过程摊开</p>
            <h2 id="fcm-process-title">
              好看的结果背后，
              <br />
              是一些可以学会的小事。
            </h2>
          </div>
          <p>
            就从你刚才玩过的那朵花开始。
            <br />
            一个形状，加一点重复，再留一点变化。
          </p>
        </div>
        <div className="fcm-process-grid">
          {[
            {
              number: '01',
              title: '先画一条线',
              text: '一个椭圆，就足够开始。不必等一个完整的大想法。',
              count: 1,
              bloom: 44,
            },
            {
              number: '02',
              title: '试着重复它',
              text: '把它旋转、重复 24 次。复杂的形状，从简单的规则里长出来。',
              count: 24,
              bloom: 44,
            },
            {
              number: '03',
              title: '把变化交给你',
              text: '留出形状和颜色的选择。下一种可能，由动手的人决定。',
              count: 24,
              bloom: 82,
            },
          ].map((step) => (
            <article className="fcm-process-step" key={step.number} data-enter>
              <div className="fcm-process-drawing">
                <span>{step.number}</span>
                <svg viewBox="0 0 520 470" fill="none" aria-hidden="true">
                  <FlowerLines bloom={step.bloom} count={step.count} />
                </svg>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className="fcm-process-bottom">
          <p>从试出来，到讲明白，再到别人也能接着做。</p>
          <CopyAction
            id="flower-prompt"
            text={experimentPrompt}
            label="复制这个实验的提示词"
          />
        </div>
      </div>
    </section>
  );
}

function Methods() {
  const [replay, setReplay] = useState(0);
  return (
    <section
      className="fcm-section fcm-methods"
      id="methods"
      aria-labelledby="fcm-methods-title"
    >
      <div className="fcm-section-heading">
        <div>
          <p className="fcm-eyebrow">03 / 留给下一次创造</p>
          <h2 id="fcm-methods-title">
            带走一个方法，
            <br />
            做出你的版本。
          </h2>
        </div>
        <div>
          <p>
            不止看懂，也能拿来用。
            <br />
            提示词、操作思路和 Skill，都在这里。
          </p>
          <Link className="fcm-text-link" href={WIKI}>
            逛逛完整百科
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="fcm-method-grid">
        <article className="fcm-method-card" data-enter>
          <div className="fcm-method-sample fcm-stagger-sample">
            <div className="fcm-stagger-notes" key={replay}>
              {['有个念头', '动手试试', '做出来了'].map((text, index) => (
                <span key={text} style={{ '--order': index } as CSSProperties}>
                  {text}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setReplay((value) => value + 1)}
              aria-label="再试一次错落入场"
            >
              <RotateCcw size={16} aria-hidden="true" />
              再试一次
            </button>
          </div>
          <div className="fcm-method-body">
            <span className="fcm-work-type">动效 / 错落入场</span>
            <h3>让内容，依次出现。</h3>
            <p>{stagger.description}</p>
            <CopyAction id="stagger-prompt" text={knowledgePrompt(stagger)} />
            <details className="fcm-method-detail">
              <summary>
                怎么用
                <Plus size={15} aria-hidden="true" />
              </summary>
              <p>{stagger.use}</p>
              <p>{stagger.caution}</p>
              <OutLink href={stagger.source.url}>阅读原理</OutLink>
            </details>
          </div>
        </article>
        <article className="fcm-method-card" data-enter>
          <div className="fcm-method-sample fcm-fold-sample">
            <details>
              <summary>
                一个问题，从这里展开。
                <Plus size={19} aria-hidden="true" />
              </summary>
              <p>把补充信息轻轻折起，给重要的事情留出空间。</p>
            </details>
            <span>点一下，或者按 Enter。</span>
          </div>
          <div className="fcm-method-body">
            <span className="fcm-work-type">交互 / 折叠展开</span>
            <h3>复杂的信息，轻轻折起。</h3>
            <p>{accordion.description}</p>
            <CopyAction
              id="accordion-prompt"
              text={knowledgePrompt(accordion)}
            />
            <details className="fcm-method-detail">
              <summary>
                怎么用
                <Plus size={15} aria-hidden="true" />
              </summary>
              <p>{accordion.use}</p>
              <p>{accordion.caution}</p>
              <OutLink href={accordion.source.url}>阅读原理</OutLink>
            </details>
          </div>
        </article>
        <article className="fcm-method-card" data-enter>
          <div className="fcm-method-sample fcm-color-sample">
            <div aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <p>先决定，哪一刻的光。</p>
          </div>
          <div className="fcm-method-body">
            <span className="fcm-work-type">创作 / 莫奈的光与色</span>
            <h3>把一种观察，变成方法。</h3>
            <p>
              {styles[0].description}把主题交给 Skill，在自己的工具里试一幅。
            </p>
            <a
              className="fcm-text-link"
              href="/downloads/artists/monet-impressionism.zip"
              download
            >
              <ArrowDownToLine size={16} aria-hidden="true" />
              下载莫奈 Skill
            </a>
            <details className="fcm-method-detail">
              <summary>
                怎么用
                <Plus size={15} aria-hidden="true" />
              </summary>
              <p>
                解压 Skill，按其中的说明放入支持 Skill 的 AI
                工具，再给它一个你想画的主题。
              </p>
              <CopyAction id="monet-prompt" text={styles[0].prompt} />
              <Link
                className="fcm-text-link"
                href={artistHref('monet-impressionism')}
              >
                看看完整方法
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </details>
          </div>
        </article>
      </div>
    </section>
  );
}

function People() {
  return (
    <section
      className="fcm-people"
      id="people"
      aria-labelledby="fcm-people-title"
    >
      <div className="fcm-section">
        <div className="fcm-people-intro">
          <div>
            <p className="fcm-eyebrow">04 / 做东西的人，也在想事情</p>
            <h2 id="fcm-people-title">
              作品让我们
              <br />
              认识彼此。
            </h2>
          </div>
          <div className="fcm-people-note">
            <p>
              我们做产品，也分享为什么做、哪里还没想明白。关于技术与人，关于一个念头怎样真正落地。
            </p>
            <Link href={`${HOME}#about`} className="fcm-text-link">
              认识 Molis 的伙伴
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="fcm-essays">
          <Link
            href={essayHref('human-scale')}
            className="fcm-essay"
            data-enter
          >
            <span className="fcm-essay-letter" aria-hidden="true">
              人
            </span>
            <div>
              <span>一骏 / 观点</span>
              <h3>人的尺度</h3>
              <p>理想主义在 AI 时代的生与死</p>
              <span className="fcm-essay-link">
                关于机器与人，以及我们把判断留在哪里。
                <ArrowUpRight size={20} aria-hidden="true" />
              </span>
            </div>
          </Link>
          <Link href={essayHref('idealism')} className="fcm-essay" data-enter>
            <span className="fcm-essay-letter" aria-hidden="true">
              想
            </span>
            <div>
              <span>一骏 / 观点</span>
              <h3>落地主义</h3>
              <p>一种不承认自己是哲学的哲学</p>
              <span className="fcm-essay-link">
                先想清楚为什么值得，再把它做出来。
                <ArrowUpRight size={20} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function CommunityPage() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('fcm-seen');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );
    root.current
      ?.querySelectorAll('[data-enter]')
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="fo-site fcm-site" ref={root}>
      <header className="fo-header fcm-header">
        <Link href={HOME} className="fo-logo" aria-label="Molis AI 工作室首页">
          <img src="/images/molis-logo.png" width="36" height="36" alt="" />
          <span>Molis AI</span>
          <span className="fcm-community-label">社区</span>
        </Link>
        <nav className="fo-nav" aria-label="社区导航">
          <a href="#works">作品</a>
          <a href="#process">过程</a>
          <a href="#methods">方法</a>
          <a href="#join">一起做</a>
        </nav>
        <Link href={HOME} className="fcm-back-home">
          回工作室
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </header>
      <main id="main">
        <section className="fcm-hero" aria-labelledby="fcm-hero-title">
          <div className="fcm-hero-copy">
            <p className="fcm-eyebrow">
              <span />
              MOLIS AI · 创作社区
            </p>
            <h1 id="fcm-hero-title">
              好奇心，
              <br />
              值得
              <span className="fcm-title-mark">
                做出来
                <svg viewBox="0 0 360 22" aria-hidden="true">
                  <path d="M4 15 Q150 -2 350 10 M40 20 Q215 8 327 16" />
                </svg>
              </span>
              。
            </h1>
            <p className="fcm-hero-description">
              试试有意思的作品，看看它们怎么做出来。
              <br />
              带走一个方法，也留下你的新想法。
            </p>
            <div className="fcm-hero-actions">
              <a href="#works" className="fo-btn fo-btn-ink">
                从作品开始
                <ArrowDown size={17} aria-hidden="true" />
              </a>
              <a href="#methods" className="fcm-text-link">
                先带走一个方法
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
            <p className="fcm-hero-signature">
              始终好奇，持续创造。<span>Made of curiosity.</span>
            </p>
          </div>
          <Playground />
        </section>
        <div className="fcm-page-index">
          <span>看见一个念头，如何变成作品。</span>
          <nav aria-label="本页内容">
            <a href="#works">试作品</a>
            <a href="#process">看过程</a>
            <a href="#methods">带走方法</a>
            <a href="#join">一起做</a>
          </nav>
        </div>
        <Works />
        <Process />
        <Methods />
        <People />
        <section
          className="fcm-section fcm-join"
          id="join"
          aria-labelledby="fcm-join-title"
        >
          <p className="fcm-eyebrow">下一件有意思的事，也许从你开始</p>
          <h2 id="fcm-join-title">
            带着好奇来。
            <br />
            <span>带点什么走，再带点什么回来。</span>
          </h2>
          <p className="fcm-join-description">
            一个用过后的感受、一处小小的改进，
            <br />
            或者一个还没想明白的念头，都可以是开始。
          </p>
          <div className="fcm-join-grid">
            <a
              href="https://github.com/molis-ai"
              target="_blank"
              rel="noreferrer"
            >
              <GitBranch size={23} aria-hidden="true" />
              <h3>一起改一点</h3>
              <p>从公开项目开始，提一个具体问题，或贡献一处改进。</p>
              <span>
                去 GitHub 看看
                <ArrowUpRight size={18} aria-hidden="true" />
              </span>
            </a>
            <Link href={contactHref('feedback')}>
              <MessageCircle size={23} aria-hidden="true" />
              <h3>告诉我们，试得怎么样</h3>
              <p>你在做什么，哪里顺手，哪里卡住了。具体的感受最有用。</p>
              <span>
                聊聊你的体验
                <ArrowUpRight size={18} aria-hidden="true" />
              </span>
            </Link>
            <Link href={contactHref('creator')}>
              <Plus size={23} aria-hidden="true" />
              <h3>带来你的作品</h3>
              <p>已经做出来的，或刚冒出来的想法，都欢迎和我们聊聊。</p>
              <span>
                分享一个念头
                <ArrowUpRight size={18} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </section>
      </main>
      <Footer tone="blue" />
    </div>
  );
}
