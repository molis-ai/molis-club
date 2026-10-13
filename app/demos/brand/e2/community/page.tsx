'use client';
import { useState, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  GitBranch,
  MessageCircle,
} from 'lucide-react';
import { folioCommunity } from '../../../../../content/folio-community';
import { Box, Face } from '../axo';
import { ABOUT, HOME, TOOL, artistHref, contactHref, pad } from '../routes';
import {
  E2Page,
  Kicker,
  Phrases,
  Plate,
  SectionHead,
  type Vars,
} from '../shell';
import { CopyAction, ShareAfter } from './copy';
import { Toggle } from './demos';
import { MethodsSection } from './methods-section';
import { ArtistScene, CowScene, DropScene, artistStyles } from './scenes';
import './community.css';

// E2 社区：整站最「活」的一页，但仍在系统里。首屏就是一件能动手的小实验（小花），「怎么做的」折在旁边；
// 01 试一试（三张能操作的小画面）→ 02 方法（可筛可搜的目录）→ 03 大家的分享（三个口子，从轻到重）
// → 结尾 04 一起改进与团队入口。文案在 content/folio-community.ts，功能与 Folio 社区一致。

const palette = [
  { name: '群青', color: '#2d53e3' },
  { name: '朱红', color: '#bd432b' },
  { name: '松绿', color: '#306955' },
];
const experimentPrompt =
  '用 SVG 做一朵可以交互的线条花：以画面中心为原点，将一个椭圆旋转重复 24 次。增加一个从 0 到 100 的滑杆，同时改变椭圆的短轴和旋转间隔；提供三种背景色和 SVG 下载。保留清楚的控件标签、键盘操作和减少动态效果支持。不需要连接 AI 或后端。';

function FlowerLines({
  bloom,
  count = 24,
  draw = false,
}: {
  bloom: number;
  count?: number;
  draw?: boolean;
}) {
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
          pathLength={draw ? 1 : undefined}
          style={draw ? ({ '--i': i } as Vars) : undefined}
        />
      ))}
    </g>
  );
}

/** 原来的「把过程摊开」：收成小花下面的一个折叠，三步各配一张小线稿 */
function HowItsMade() {
  const { how } = folioCommunity.hero;
  return (
    <details className="ecm-how">
      <summary>
        {how.summary}
        <Toggle />
      </summary>
      <p className="ecm-how-lead">{how.lead}</p>
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
    <div className="ecm-playground">
      <figure className="e2-plate ecm-poster">
        <div className="e2-plate-body ecm-poster-art">
          <span className="ecm-poster-tag">一朵好奇</span>
          <span className="ecm-poster-tag ecm-poster-no" aria-hidden="true">
            M / 01
          </span>
          {/* oxlint-disable jsx-a11y/prefer-tag-over-role -- 内联 SVG 随滑杆改变并可导出，需要保留可访问图像语义。 */}
          <svg
            ref={drawing}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 520 470"
            role="img"
            aria-labelledby="ecm-flower-title"
            className="ecm-flower"
          >
            <title id="ecm-flower-title">{`一朵好奇，${palette[color].name}，展开程度 ${bloom}%`}</title>
            <rect width="520" height="470" fill={palette[color].color} />
            <g color="#fff7e4">
              <FlowerLines bloom={bloom} draw />
            </g>
          </svg>
          {/* oxlint-enable jsx-a11y/prefer-tag-over-role */}
        </div>
        <figcaption>
          <span>
            <b lang="en">Fig. 01</b>可以带走的小实验
          </span>
          <em>24 条线，无数种可能。</em>
        </figcaption>
      </figure>

      <div className="ecm-controls">
        <span className="ecm-hint" aria-hidden="true">
          从这里，试一下。
        </span>
        <div className="ecm-range-label">
          <label htmlFor="ecm-bloom">拖一拖，让它长成你的样子</label>
          <output htmlFor="ecm-bloom">{bloom}%</output>
        </div>
        <input
          id="ecm-bloom"
          className="ecm-range"
          type="range"
          min="0"
          max="100"
          value={bloom}
          style={{ '--v': `${bloom}%` } as Vars}
          onChange={(event) => {
            setBloom(Number(event.target.value));
            setDownloaded(false);
          }}
        />
        <div className="ecm-control-row">
          <fieldset className="ecm-swatches" aria-label="选择花朵背景色">
            {palette.map((item, index) => (
              <button
                key={item.name}
                type="button"
                aria-label={item.name}
                aria-pressed={color === index}
                style={{ '--swatch': item.color } as Vars}
                onClick={() => {
                  setColor(index);
                  setDownloaded(false);
                }}
              >
                {color === index && <Check size={12} aria-hidden="true" />}
              </button>
            ))}
            <span className="ecm-swatch-name" aria-hidden="true">
              {palette[color].name}
            </span>
          </fieldset>
          <button
            type="button"
            className="e2-button e2-button-ghost"
            onClick={save}
          >
            <ArrowDownToLine size={15} aria-hidden="true" />
            下载这朵花
          </button>
        </div>
        <output className="ecm-status ecm-download-status">
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
      <HowItsMade />
    </div>
  );
}

function Hero() {
  const { hero, nav } = folioCommunity;
  return (
    <section className="ecm-hero" aria-labelledby="ecm-hero-title">
      <div className="ecm-hero-copy">
        <Kicker>{hero.eyebrow}</Kicker>
        <h1 id="ecm-hero-title">
          <span className="e2-phrase">好奇心，</span>
          <span className="e2-phrase">
            值得<span className="ecm-accent">做出来</span>。
          </span>
        </h1>
        <p className="ecm-hero-text">
          <span className="e2-phrase">{hero.description[0]}</span>
          <span className="e2-phrase">{hero.description[1]}</span>
        </p>
        <div className="e2-actions">
          <a href="#try" className="e2-button e2-button-ink">
            {hero.actions.try}
            <ArrowDown size={15} aria-hidden="true" />
          </a>
          <a href="#share" className="e2-link">
            {hero.actions.share}
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
        <nav className="ecm-index" aria-label={`${nav.label}导航`}>
          <ol>
            {nav.items.map((item, index) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>
                  <i aria-hidden="true">{pad(index)}</i>
                  <span>{item.label}</span>
                  <ArrowDown size={13} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <p className="ecm-signature">
          {hero.signature.zh}
          <span lang="en">{hero.signature.en}</span>
        </p>
      </div>
      <Playground />
    </section>
  );
}

function TrySection({ index }: { index: number }) {
  const t = folioCommunity.try;
  const [styleIndex, setStyleIndex] = useState(0);
  const scenes: Record<
    string,
    { node: ReactNode; caption: string; note: string; label?: string }
  > = {
    niulai: {
      node: <CowScene />,
      caption: 'niul.ai 在你的桌面上',
      note: '状态示意',
    },
    dropagent: {
      node: <DropScene />,
      caption: 'DropAgent · 原文件保留',
      note: '流程示意 · 示例材料',
      label: 'DropAgent：把访谈记录交给本地 Agent，在副本上整理，再带回要点',
    },
    'artist-skill': {
      node: <ArtistScene index={styleIndex} onPick={setStyleIndex} />,
      caption: '一种方法，一次新的观看',
      note: 'AI 创作试样',
    },
  };
  return (
    <section
      className="ecm-section ecm-try"
      id="try"
      aria-labelledby="ecm-try-title"
    >
      <SectionHead
        id="ecm-try-title"
        index={index}
        kicker={t.kicker}
        title={t.title}
        lead={t.lead}
        layout="split"
      />
      <ul className="ecm-try-grid">
        {t.works.map((work, i) => {
          const artist = work.id === 'artist-skill';
          const scene = scenes[work.id];
          return (
            <li
              className="ecm-try-card"
              id={work.id}
              key={work.id}
              data-reveal
              style={{ '--d': `${i * 90}ms` } as Vars}
            >
              <Plate
                fig={`Fig. ${pad(i + 1)}`}
                caption={scene.caption}
                note={scene.note}
                label={scene.label}
                className="ecm-try-plate"
              >
                {scene.node}
              </Plate>
              <div className="ecm-try-copy">
                <span className="ecm-card-meta">
                  <i>{pad(i)}</i>
                  <span>{work.type}</span>
                </span>
                <h3>
                  <span lang="en">{work.name}</span>
                  {'alias' in work ? <small>{work.alias}</small> : null}
                </h3>
                <p className="ecm-try-line">{work.line}</p>
                {artist ? (
                  <Link
                    className="e2-link"
                    href={artistHref(artistStyles[styleIndex].slug)}
                  >
                    {work.link.label}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                ) : (
                  <a
                    className="e2-link"
                    href={'href' in work.link ? work.link.href : undefined}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {work.link.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
                <p className="ecm-relation">
                  {work.relation}
                  {artist ? (
                    <a href="#methods">
                      {t.toMethods}
                      <ArrowDown size={13} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={TOOL}>
                      {t.toTool}
                      <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="ecm-works-end">
        <p>{t.family}</p>
        <Link href={`${HOME}#products`} className="e2-link">
          {t.familyLink}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

/** 三个口子从轻到重：同一取景下三块高度递增的轴测体，顶面各开一道口 */
function WayBlock({ level }: { level: number }) {
  const h = [0.9, 2.6, 4.6][level];
  return (
    <svg
      className="ecm-way-art"
      viewBox="-7.6 -6.4 15.2 13.4"
      aria-hidden="true"
      data-draw
    >
      <Face
        tone="floor"
        p={[
          [-1, -1, 0],
          [7, -1, 0],
          [7, 7, 0],
          [-1, 7, 0],
        ]}
        className="e2-faint"
      />
      <Box at={[0, 0, 0]} size={[6, 6, h]} />
      <Face
        tone={level === 0 ? 'accent' : 'cut'}
        p={[
          [1.6, 2.6, h],
          [4.4, 2.6, h],
          [4.4, 3.4, h],
          [1.6, 3.4, h],
        ]}
      />
    </svg>
  );
}

function ShareSection({ index }: { index: number }) {
  const t = folioCommunity.share;
  const { showcase } = t;
  return (
    <section
      className="ecm-section ecm-share"
      id="share"
      aria-labelledby="ecm-share-title"
    >
      <header className="e2-head" data-layout="split" data-reveal>
        <div className="e2-head-main">
          <span className="e2-head-meta">
            <i>{pad(index)}</i>
            <span>{t.kicker}</span>
          </span>
          <h2 id="ecm-share-title">
            <Phrases text={t.title[0]} />
            <span className="ecm-share-second">
              <Phrases text={t.title[1]} />
            </span>
          </h2>
        </div>
        <div className="e2-head-side">
          <p>{t.lead}</p>
        </div>
      </header>
      <ol className="ecm-ways">
        {t.ways.map((way, i) => (
          <li
            key={way.title}
            data-reveal
            style={{ '--d': `${i * 110}ms` } as Vars}
          >
            <WayBlock level={i} />
            <span className="ecm-card-meta">
              <i>{pad(i)}</i>
            </span>
            <h3>{way.title}</h3>
            <p>{way.text}</p>
            {'href' in way ? (
              <a
                className="e2-link"
                href={way.href}
                target="_blank"
                rel="noreferrer"
              >
                {way.action}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            ) : 'action' in way ? (
              <Link className="e2-link" href={contactHref('creator')}>
                {way.action}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="ecm-showcase">
        <div className="ecm-showcase-head">
          <h3 id="ecm-showcase-title">{showcase.title}</h3>
          <p>{showcase.note}</p>
        </div>
        {showcase.items.length > 0 ? (
          <ul
            className="ecm-showcase-grid"
            aria-labelledby="ecm-showcase-title"
          >
            {showcase.items.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noreferrer">
                  <strong>{item.title}</strong>
                  <span>
                    {item.by}
                    {item.method ? ` · ${item.method}` : ''}
                  </span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ecm-showcase-empty">{showcase.empty}</p>
        )}
      </div>
    </section>
  );
}

/** 结尾：一起改进（GitHub 与反馈），再一行去认识做这些的人 */
function Improve({ index }: { index: number }) {
  const t = folioCommunity.improve;
  return (
    <section
      className="ecm-improve"
      id="improve"
      aria-labelledby="ecm-improve-title"
    >
      <div className="ecm-improve-head" data-reveal>
        <span className="e2-head-meta">
          <i>{pad(index)}</i>
          <span>{t.kicker}</span>
        </span>
        <h2 id="ecm-improve-title">
          <Phrases text={t.text} />
        </h2>
      </div>
      <ul className="ecm-improve-links" data-reveal>
        <li>
          <a
            href="https://github.com/molis-ai"
            target="_blank"
            rel="noreferrer"
          >
            <GitBranch size={18} strokeWidth={1.6} aria-hidden="true" />
            <span>{t.github}</span>
            <small lang="en">github.com/molis-ai</small>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </li>
        <li>
          <Link href={contactHref('feedback')}>
            <MessageCircle size={18} strokeWidth={1.6} aria-hidden="true" />
            <span>{t.feedback}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </li>
      </ul>
      <p className="ecm-people">
        <Link href={ABOUT} className="e2-link">
          {folioCommunity.people}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}

export default function E2Community() {
  return (
    <E2Page current="community" className="ecm" footer={<Improve index={3} />}>
      <Hero />
      <TrySection index={0} />
      <MethodsSection index={1} />
      <ShareSection index={2} />
    </E2Page>
  );
}
