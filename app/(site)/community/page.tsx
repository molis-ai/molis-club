import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { pageMetadata } from '../../../lib/site';
import { artistSkills } from '../../../content/artists';
import { isResourceEntry, knowledge } from '../../../content/knowledge';
import {
  community,
  communityUi,
  methodText,
} from '../../../content/site/community';
import { COMMUNITY, METHODS } from '../../_site/routes';
import { mediaOf, Phrases, type Vars } from '../../_site/ui';
import { Acts } from './acts';
import { Bench } from './bench';
import { FlowerToy } from './flower';
import { Clothesline } from './line';
import { Ending } from './end';
import '../../_site/demo/demo.css';
import './methods/methods.css';
import './community.css';

export const metadata = pageMetadata(
  communityUi.kicker,
  `${community.title.join('')}${community.intro[0]}`,
  COMMUNITY,
);

// 社区（负责人 2026-10-15 定的方向）：整页就是结尾那句话——带着好奇来 → 带点什么走 → 再带点什么回来。
// ① 首屏就是玩具：纸上那朵「一朵好奇」，小家伙从纸后面探头举牌；票根就是下载。
// ② 满幅照片：围桌的人，桌上有小牛摆件和带触角的玩偶（比稿 D1）。
// ③ 工作台：四件作品，先玩 / 看怎么做 / 带走。④ 方法目录：铅笔插画 + 搜索 + 三个抽屉。
// ⑤ 满幅照片：树下挂着各自的颜色。⑥ 晾衣绳：访客自己那朵花、三张签、空夹子。
// ⑦ 结尾：画出来的沙上那道线，小家伙沿线走完，三个停靠点各写一段那句话。
// 比白房子的其它页更活泼：粗墨线、硬投影、票根、印章、举牌的小家伙（比稿 E1 的画风），但顶栏、页尾、字体不变。

const ui = communityUi;

/** 满幅照片屏：随滚动从一扇窄窗开到满幅；一句大字写在贴上去的一张纸签上 */
function Photo({
  name,
  alt,
  line,
  lead,
  caption,
  note,
  focus,
  id,
  act,
}: {
  name: 'community-table' | 'community-colors';
  alt: string;
  line: string;
  lead?: string;
  caption: string;
  note: string;
  focus: string;
  id: string;
  act: number;
}) {
  const image = mediaOf(name);
  return (
    <section
      className="m-com-photo"
      id={id}
      data-act={act}
      data-scene
      aria-label={line}
    >
      <div
        className="m-com-photo-frame"
        style={{ '--avg': image.avg, '--focus': focus } as Vars}
      >
        <img
          src={image.src}
          srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
          sizes="100vw"
          width={image.width}
          height={image.height}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="m-com-photo-label" data-reveal>
        <p className="m-com-photo-line">
          <Phrases text={line} />
        </p>
        {lead ? <p className="m-com-photo-lead">{lead}</p> : null}
      </div>
      <p className="m-com-photo-cap">
        <span lang="en">{caption}</span>
        <span>{note}</span>
      </p>
    </section>
  );
}

/** 粗墨线的画框（比稿 E1）：框先在，画面进入视口时从一道窄缝开到完整 */
function Frame({
  name,
  alt,
  ratio,
  focus,
  sizes,
  caption,
  note,
  className,
}: {
  name: 'community-blocks';
  alt: string;
  ratio: string;
  focus: string;
  sizes: string;
  caption: string;
  note?: string;
  className: string;
}) {
  const image = mediaOf(name);
  return (
    <figure className={`m-com-frame ${className}`} data-reveal>
      <div
        className="m-com-frame-img"
        style={{ '--ratio': ratio, '--avg': image.avg, '--focus': focus } as Vars}
      >
        <img
          src={image.src}
          srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
          sizes={sizes}
          width={image.width}
          height={image.height}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption>
        <span className="m-caption" lang="en">
          {caption}
        </span>
        {note ? <span className="m-caption">{note}</span> : null}
      </figcaption>
    </figure>
  );
}

/** 方法目录的三个抽屉：鼠标停上去拉开，露出里面几样的名字 */
const techniques = knowledge.filter((entry) => !isResourceEntry(entry));
const sources = knowledge.filter(isResourceEntry);
const drawers = [
  {
    type: 'artists',
    label: methodText.groups.artists,
    count: artistSkills.length,
    names: artistSkills.map((skill) => skill.name),
  },
  {
    type: 'web',
    label: methodText.groups.web,
    count: techniques.length,
    names: techniques.map((entry) => entry.name),
  },
  {
    type: 'sources',
    label: methodText.groups.sources,
    count: sources.length,
    names: sources.map((entry) => entry.name),
  },
];

export default function CommunityPage() {
  const [titleA, titleB] = community.title[0].split(/(?<=，)/);
  return (
    <div className="m-com">
      <Acts />

      {/* ① 带着好奇来：首屏就是玩具 */}
      <header className="m-com-hero m-wrap m-top" id="come" data-act={0}>
        <div className="m-com-hero-text">
          <p className="m-com-label m-rise">
            <b>{ui.kicker}</b>
            <span>{ui.tag}</span>
          </p>
          <h1
            className="m-com-title m-rise"
            style={{ '--delay': '90ms' } as Vars}
          >
            <span>{titleA}</span>
            <span>{titleB}</span>
          </h1>
          <p
            className="m-com-sub m-rise"
            style={{ '--delay': '180ms' } as Vars}
          >
            {community.title[1]}
          </p>
        </div>
        <FlowerToy />
      </header>

      {/* ② 带点什么走：围桌的人 */}
      <Photo
        name="community-table"
        alt={ui.table.alt}
        line={ui.table.line}
        caption={ui.table.caption}
        note={ui.table.note}
        focus="50% 44%"
        id="take"
        act={1}
      />

      {/* ③ 工作台：四件作品，各自连着做法 */}
      <section
        className="m-com-bench m-wrap"
        data-act={1}
        aria-labelledby="bench-title"
      >
        <header className="m-com-head" data-reveal>
          <p className="m-com-label">
            <b>{ui.acts[1]}</b>
            <span>{ui.tag}</span>
          </p>
          <h2 id="bench-title" className="m-com-h2">
            <Phrases text={community.try.title} />
          </h2>
        </header>
        <Bench />
      </section>

      {/* ④ 方法目录：拿到积木，搭出自己的版本 */}
      <section
        className="m-com-cabinet m-wrap"
        data-act={1}
        aria-labelledby="cabinet-title"
      >
        <Frame
          name="community-blocks"
          alt={ui.methods.alt}
          ratio="3 / 2"
          focus="50% 50%"
          sizes="(max-width: 900px) 100vw, 50vw"
          caption={ui.methods.caption}
          note={ui.methods.note}
          className="m-com-cabinet-window"
        />
        <div className="m-com-cabinet-body">
          <p className="m-com-label" data-reveal>
            <b>{methodText.kicker}</b>
          </p>
          <h2 id="cabinet-title" className="m-com-h2" data-reveal>
            {ui.methods.title.map((part) => (
              <span key={part}>{part}</span>
            ))}
          </h2>
          <search>
            <form
              className="m-com-search"
              action={METHODS}
              method="get"
              data-reveal
            >
              <label className="sr-only" htmlFor="community-search">
                {ui.methods.searchLabel}
              </label>
              <Search size={18} aria-hidden="true" />
              <input
                id="community-search"
                type="search"
                name="q"
                placeholder={ui.methods.search}
                autoComplete="off"
              />
              <button type="submit">{ui.methods.go}</button>
            </form>
          </search>
          <ul className="m-com-drawers">
            {drawers.map((drawer, i) => (
              <li
                key={drawer.type}
                data-reveal
                style={{ '--delay': `${i * 90}ms` } as Vars}
              >
                <Link
                  className="m-com-drawer"
                  href={`${METHODS}?type=${drawer.type}`}
                >
                  <span className="m-com-drawer-face">
                    <b>{drawer.label}</b>
                    <span className="m-com-drawer-n num">{drawer.count}</span>
                  </span>
                  <span className="m-com-drawer-in">
                    {drawer.names.slice(0, 3).map((name) => (
                      <span key={name}>{name}</span>
                    ))}
                    <em>
                      {drawer.count > 3
                        ? `${ui.methods.more} ${drawer.count - 3} 个`
                        : ui.methods.open}
                      <ArrowRight size={12} aria-hidden="true" />
                    </em>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="m-com-fine" data-reveal>
            {community.methods.tools}
            {community.methods.disclosure}
          </p>
        </div>
      </section>

      {/* ⑤ 再带点什么回来：树下挂着各自的颜色 */}
      <Photo
        name="community-colors"
        alt={ui.back.alt}
        line={ui.back.line}
        lead={ui.back.lead}
        caption={ui.back.caption}
        note={ui.back.note}
        focus="50% 40%"
        id="back"
        act={2}
      />

      {/* ⑥ 大家做的：一根晾衣绳 */}
      <section
        className="m-com-wall m-wrap"
        data-act={2}
        aria-labelledby="wall-title"
      >
        <header className="m-com-head" data-reveal>
          <p className="m-com-label">
            <b>{ui.wall.kicker}</b>
            <span>{ui.acts[2]}</span>
          </p>
          <h2 id="wall-title" className="m-com-h2">
            {ui.wall.title}
          </h2>
          <p className="m-com-head-lead">{ui.wall.lead}</p>
        </header>
        <Clothesline />
      </section>

      {/* ⑦ 结尾：小家伙沿沙上那道线走完，那句话写在线下 */}
      <Ending />
    </div>
  );
}
