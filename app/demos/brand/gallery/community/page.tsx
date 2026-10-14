'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import {
  ArrowDownToLine,
  ArrowDown,
  ArrowUpRight,
  Check,
  GitBranch,
  MessageCircle,
  Plus,
} from 'lucide-react';
import { artistSkills } from '../../../../../content/artists';
import { folioCommunity } from '../../../../../content/folio-community';
import { Shell } from '../kit';
import { ABOUT, HOME, TOOL, artistHref, contactHref } from '../routes';
import './community.css';
import { CopyAction, ShareAfter } from './copy';
import { MethodsSection } from './methods-section';
import { CowScene, DropScene } from './scenes';

// 社区页五段：首屏（小花实验，「怎么做的」折在旁边）→ 01 试一试 → 02 方法（原百科）→ 03 大家的分享
// → 04 一起改进；团队与文章只留页尾前一行。文案在 content/folio-community.ts。

const styles = artistSkills.filter((skill) => skill.image).slice(0, 3);
const palette = [
  { name: '群青', color: '#2d53e3' },
  { name: '朱红', color: '#bd432b' },
  { name: '松绿', color: '#306955' },
];
const experimentPrompt =
  '用 SVG 做一朵可以交互的线条花：以画面中心为原点，将一个椭圆旋转重复 24 次。增加一个从 0 到 100 的滑杆，同时改变椭圆的短轴和旋转间隔；提供三种背景色和 SVG 下载。保留清楚的控件标签、键盘操作和减少动态效果支持。不需要连接 AI 或后端。';

const pad = (index: number) => String(index + 1).padStart(2, '0');

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

/** 原来的「把过程摊开」：收成小花旁边的一个折叠 */
function HowItsMade() {
  const { how } = folioCommunity.hero;
  return (
    <details className="g-com-how">
      <summary>
        {how.summary}
        <Plus size={16} aria-hidden="true" />
      </summary>
      <p>{how.lead}</p>
      <ol>
        {how.steps.map((step, index) => (
          <li key={step.title}>
            <svg viewBox="0 0 520 470" fill="none" aria-hidden="true">
              <FlowerLines bloom={step.bloom} count={step.count} />
            </svg>
            <span>{pad(index)}</span>
            <strong>{step.title}</strong>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
      <CopyAction
        id="flower-prompt"
        text={experimentPrompt}
        label={how.copy}
        topic="share-flower"
      />
    </details>
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
    <div className="g-com-playground" data-enter>
      <div className="g-com-poster-under" aria-hidden="true" />
      <figure
        className="g-com-poster"
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
          aria-labelledby="g-com-flower-title"
          className="g-com-flower"
        >
          <title id="g-com-flower-title">{`一朵好奇，${palette[color].name}，展开程度 ${bloom}%`}</title>
          <rect width="520" height="470" fill={palette[color].color} />
          <g color="#fff7e4">
            <FlowerLines bloom={bloom} />
          </g>
        </svg>
        {/* oxlint-enable jsx-a11y/prefer-tag-over-role */}
        <div className="g-com-poster-bottom">
          <span>24 条线，无数种可能。</span>
          <span aria-hidden="true">M / 01</span>
        </div>
      </figure>
      <div className="g-com-experiment-controls">
        <div className="g-com-range-label">
          <label htmlFor="g-com-bloom">拖一拖，让它长成你的样子</label>
          <output htmlFor="g-com-bloom">{bloom}%</output>
        </div>
        <input
          id="g-com-bloom"
          type="range"
          min="0"
          max="100"
          value={bloom}
          onChange={(event) => {
            setBloom(Number(event.target.value));
            setDownloaded(false);
          }}
        />
        <div className="g-com-control-bottom">
          <fieldset className="g-com-swatches" aria-label="选择花朵背景色">
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
          <button type="button" className="g-com-text-link" onClick={save}>
            <ArrowDownToLine size={16} aria-hidden="true" />
            下载这朵花
          </button>
        </div>
        <output className="g-com-download-status">
          {downloaded ? (
            <ShareAfter
              text={folioCommunity.after.flower}
              topic="share-flower"
            />
          ) : (
            '不用登录，喜欢就带走。'
          )}
        </output>
      </div>
      <span className="g-com-poster-note" aria-hidden="true">
        从这里，试一下。
      </span>
    </div>
  );
}

/** Artist Skill 的小图：三种风格切换，看一种方法怎样换一种观看 */
function ArtistScene({
  index,
  onPick,
}: {
  index: number;
  onPick: (index: number) => void;
}) {
  const artist = styles[index];
  return (
    <div className="g-com-work-art g-com-artist-art">
      <div className="g-com-art-top">
        <span>一种方法，一次新的观看</span>
        <span>AI 创作试样</span>
      </div>
      <div className="g-com-art-print" key={artist.slug}>
        <img
          src={artist.image}
          width={artist.width}
          height={artist.height}
          alt={artist.imageAlt}
          loading="lazy"
        />
        <p>{artist.name}</p>
      </div>
      <div className="g-com-artist-method">
        <span>从这里观察</span>
        <strong>{artist.method[0].title}</strong>
      </div>
      <fieldset className="g-com-style-picker" aria-label="选择艺术风格">
        {styles.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={i === index}
            onClick={() => onPick(i)}
          >
            {['光与色', '梦的形状', '画面秩序'][i]}
          </button>
        ))}
      </fieldset>
    </div>
  );
}

function TrySection({ number }: { number: string }) {
  const t = folioCommunity.try;
  const [styleIndex, setStyleIndex] = useState(0);
  const scenes: Record<string, React.ReactNode> = {
    niulai: <CowScene />,
    dropagent: <DropScene />,
    'artist-skill': <ArtistScene index={styleIndex} onPick={setStyleIndex} />,
  };
  return (
    <section
      className="g-com-section g-com-try"
      id="try"
      aria-labelledby="g-com-try-title"
    >
      <div className="g-com-section-heading">
        <div>
          <p className="g-com-eyebrow">
            {number} / {t.kicker}
          </p>
          <h2 id="g-com-try-title">{t.title}</h2>
        </div>
        <p>{t.lead}</p>
      </div>
      <ul className="g-com-try-grid">
        {t.works.map((work) => {
          const artist = work.id === 'artist-skill';
          return (
            <li
              className="g-com-try-card"
              id={work.id}
              key={work.id}
              data-enter
            >
              {scenes[work.id]}
              <div className="g-com-try-copy">
                <p className="g-com-work-type">{work.type}</p>
                <h3>
                  {work.name}
                  {'alias' in work ? <span>{work.alias}</span> : null}
                </h3>
                <p className="g-com-try-line">{work.line}</p>
                {artist ? (
                  <Link
                    className="g-com-text-link"
                    href={artistHref(styles[styleIndex].slug)}
                  >
                    {work.link.label}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                ) : (
                  <a
                    className="g-com-text-link"
                    href={'href' in work.link ? work.link.href : undefined}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {work.link.label}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                )}
                <p className="g-com-product-relation">
                  {work.relation}
                  {artist ? (
                    <a href="#methods">
                      {t.toMethods}
                      <ArrowDown size={14} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={TOOL}>
                      {t.toTool}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="g-com-works-end">
        <p>{t.family}</p>
        <Link href={`${HOME}#products`} className="g-com-text-link">
          {t.familyLink} <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function ShareSection({ number }: { number: string }) {
  const t = folioCommunity.share;
  const { showcase } = t;
  return (
    <section
      className="g-com-section g-com-share"
      id="share"
      aria-labelledby="g-com-share-title"
    >
      <p className="g-com-eyebrow">
        {number} / {t.kicker}
      </p>
      <h2 id="g-com-share-title">
        {t.title[0]}
        <br />
        <span>{t.title[1]}</span>
      </h2>
      <p className="g-com-share-lead">{t.lead}</p>
      <ol className="g-com-share-ways">
        {t.ways.map((way, index) => (
          <li key={way.title} data-enter>
            <span className="g-com-share-number">{pad(index)}</span>
            <h3>{way.title}</h3>
            <p>{way.text}</p>
            {'href' in way ? (
              <a
                className="g-com-text-link"
                href={way.href}
                target="_blank"
                rel="noreferrer"
              >
                {way.action}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ) : 'action' in way ? (
              <Link className="g-com-text-link" href={contactHref('creator')}>
                {way.action}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="g-com-showcase" aria-labelledby="g-com-showcase-title">
        <div className="g-com-showcase-head">
          <h3 id="g-com-showcase-title">{showcase.title}</h3>
          <p>{showcase.note}</p>
        </div>
        {showcase.items.length > 0 ? (
          <ul className="g-com-showcase-grid">
            {showcase.items.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noreferrer">
                  <strong>{item.title}</strong>
                  <span>
                    {item.by}
                    {item.method ? ` · ${item.method}` : ''}
                  </span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="g-com-showcase-empty">{showcase.empty}</p>
        )}
      </div>
    </section>
  );
}

function ImproveSection({ number }: { number: string }) {
  const t = folioCommunity.improve;
  return (
    <section
      className="g-com-section g-com-improve"
      id="improve"
      aria-labelledby="g-com-improve-title"
    >
      <div>
        <p className="g-com-eyebrow">
          {number} / {t.kicker}
        </p>
        <h2 id="g-com-improve-title">{t.text}</h2>
      </div>
      <div className="g-com-improve-links">
        <a href="https://github.com/molis-ai" target="_blank" rel="noreferrer">
          <GitBranch size={20} aria-hidden="true" />
          {t.github}
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
        <Link href={contactHref('feedback')}>
          <MessageCircle size={20} aria-hidden="true" />
          {t.feedback}
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default function CommunityPage() {
  const root = useRef<HTMLDivElement>(null);
  const { hero } = folioCommunity;
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('g-com-seen');
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
    <Shell current="community" className="g-com-root">
      <div className="g-com-site" ref={root}>
        <section className="g-com-hero" aria-labelledby="g-com-hero-title">
          <div className="g-com-hero-copy">
            <p className="g-com-eyebrow">
              <span />
              {hero.eyebrow}
            </p>
            <h1 id="g-com-hero-title">
              好奇心，
              <br />
              值得
              <span className="g-com-title-mark">
                做出来
                <svg viewBox="0 0 360 22" aria-hidden="true">
                  <path d="M4 15 Q150 -2 350 10 M40 20 Q215 8 327 16" />
                </svg>
              </span>
              。
            </h1>
            <p className="g-com-hero-description">
              {hero.description[0]}
              <br />
              {hero.description[1]}
            </p>
            <div className="g-com-hero-actions">
              <a href="#try" className="g-btn">
                {hero.actions.try}
                <ArrowDown size={17} aria-hidden="true" />
              </a>
              <a href="#share" className="g-com-text-link">
                {hero.actions.share}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
            <p className="g-com-hero-signature">
              {hero.signature.zh}
              <span>{hero.signature.en}</span>
            </p>
          </div>
          <div className="g-com-hero-side">
            <Playground />
            <HowItsMade />
          </div>
        </section>
        {/* 楼层导览：社区的四段，粘在顶栏下面 */}
        <nav className="g-com-subnav" aria-label="社区导航">
          <span className="g-soft" lang="en" aria-hidden="true">
            Open studio
          </span>
          {folioCommunity.nav.items.map((item, index) => (
            <a key={item.id} href={`#${item.id}`}>
              <span aria-hidden="true">{pad(index)}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <TrySection number="01" />
        <MethodsSection number="02" />
        <ShareSection number="03" />
        <ImproveSection number="04" />
        <p className="g-com-people-line">
          <Link href={ABOUT} className="g-com-text-link">
            {folioCommunity.people}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </Shell>
  );
}
