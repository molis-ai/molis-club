import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import { pageMetadata } from '../../../lib/site';
import { artistSkills } from '../../../content/artists';
import { isResourceEntry, knowledge } from '../../../content/knowledge';
import {
  community,
  communityUi,
  methodText,
  showcase,
} from '../../../content/site/community';
import { exUi } from '../../../content/site/exhibit';
import { COMMUNITY, contactHref, METHODS } from '../../_site/routes';
import { mediaOf, Phrases, type Vars } from '../../_site/ui';
import { Ending } from './ending';
import { WorksGallery } from './gallery';
import { WorksGalleryCurrent } from './gallery-current';
import { Hero } from './hero';
import '../../_site/demo/demo.css';
import './methods/methods.css';
import './community.css';

export const metadata = pageMetadata(
  communityUi.kicker,
  `${community.title.join('')}${community.intro[0]}`,
  COMMUNITY,
);

// 社区（负责人 2026-10-22 改回白房子，D2）：近白的纸、细线、白卡片、大量留白，一屏一个重点。
// ① 首屏：两句标题，一张团队插画「开窗，开始创造」（W01-01）。2026-10-24 出两版样张（hero.tsx）：
//    ?hero=a 满幅开窗（默认）、?hero=b 大幅插画。
// ② 五件作品一个画廊：一朵好奇、Artist Skill、网页动效、niul.ai、DropAgent；窗在左边钉住，字跟着滚动换。
//    2026-10-24 新版（gallery.tsx）：题目单独一屏开场，窗放大到六成宽，右边只留名称、展签、一句原句和按钮；
//    改版前的那版留在 ?works=current 对照（gallery-current.tsx）。
// ③ 方法目录：「翻开，另一片天地」（W04-01）+ 搜索 + 三个整张是链接的去处，数量只写数字。
// ④ 再带点什么回来：「把想法种出来」（W02-01）+ 三个去处；作品墙还空着时只写一句。
// ⑤ 结尾：首页挪来的那段画室，那句话和一行当前进展（ending.tsx）。
// 方法、带回来两张插画的挂法同「关于」：不装框，四周淡进墙里。字只用第 6 章与附录 A.1 的原句，新写的只有标签和按钮。

const ui = communityUi;

/** 团队插画：不装框，四周淡进墙里（同「关于」的挂法） */
function Vignette({
  name,
  sizes,
  className,
}: {
  name: keyof typeof communityUi.art;
  sizes: string;
  className: string;
}) {
  const image = mediaOf(name);
  const art = ui.art[name];
  return (
    <figure className={`m-com-art ${className}`} data-open>
      <img
        src={image.src}
        srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={art.alt}
        loading="lazy"
        decoding="async"
      />
      <figcaption className="m-com-art-name">
        {art.title} · {exUi.medium.album}
      </figcaption>
    </figure>
  );
}

/** 方法目录的三个去处：整张是链接，名字、数量和头几样 */
const techniques = knowledge.filter((entry) => !isResourceEntry(entry));
const sources = knowledge.filter(isResourceEntry);
const shelves = [
  {
    type: 'artists',
    label: methodText.groups.artists,
    names: artistSkills.map((skill) => skill.name.split(' · ')[0]),
  },
  {
    type: 'web',
    label: methodText.groups.web,
    names: techniques.map((entry) => entry.name),
  },
  {
    type: 'sources',
    label: methodText.groups.sources,
    names: sources.map((entry) => entry.name),
  },
];

/** 有标题和说明的去处：整张是链接，只留一颗圆形箭头 */
function Door({
  href,
  title,
  count,
  text,
  external = false,
}: {
  href: string;
  title: string;
  count?: number;
  text: string;
  external?: boolean;
}) {
  const body = (
    <>
      <span className="m-com-door-head">
        <b>{title}</b>
        {count === undefined ? null : <span className="num">{count}</span>}
      </span>
      <span className="m-com-door-text">{text}</span>
      <span className="m-com-door-go" aria-hidden="true">
        {external ? <ArrowUpRight size={17} /> : <ArrowRight size={17} />}
      </span>
    </>
  );
  return external ? (
    <a className="m-com-door" href={href} target="_blank" rel="noreferrer">
      {body}
    </a>
  ) : (
    <Link className="m-com-door" href={href}>
      {body}
    </Link>
  );
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ hero?: string; works?: string }>;
}) {
  const { hero, works } = await searchParams;
  return (
    <div className="m-com">
      {/* ① 首屏：两句标题，一张团队插画 */}
      <Hero variant={hero === 'b' ? 'b' : 'a'} />

      {/* ② 五件作品，一个画廊 */}
      {works === 'current' ? (
        <section className="m-com-works m-wrap" aria-labelledby="works-title">
          <WorksGalleryCurrent />
        </section>
      ) : (
        <section className="m-com-shows m-wrap" aria-labelledby="works-title">
          <WorksGallery />
        </section>
      )}

      {/* ③ 方法目录 */}
      <section
        className="m-com-methods m-com-room m-wrap"
        aria-labelledby="methods-title"
      >
        <Vignette
          name="art-book"
          sizes="(max-width: 900px) 100vw, 46vw"
          className="m-com-room-art"
        />
        <div className="m-com-room-body">
          <h2 id="methods-title" className="m-com-h2" data-reveal>
            <Phrases text={community.methods.title} />
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
              <Search size={17} aria-hidden="true" />
              <input
                id="community-search"
                type="search"
                name="q"
                placeholder={ui.methods.search}
                autoComplete="off"
              />
              <button type="submit" className="m-btn">
                {ui.methods.go}
              </button>
            </form>
          </search>
          <ul className="m-com-doors">
            {shelves.map((shelf, index) => (
              <li
                key={shelf.type}
                data-reveal
                style={{ '--delay': `${index * 90}ms` } as Vars}
              >
                <Door
                  href={`${METHODS}?type=${shelf.type}`}
                  title={shelf.label}
                  count={shelf.names.length}
                  text={`${shelf.names.slice(0, 3).join('、')}${shelf.names.length > 3 ? '……' : ''}`}
                />
              </li>
            ))}
          </ul>
          <p className="m-com-fine" data-reveal>
            {community.methods.tools}
            {community.methods.disclosure}
          </p>
        </div>
      </section>

      {/* ④ 再带点什么回来 */}
      <section
        className="m-com-back m-com-room m-wrap"
        aria-labelledby="back-title"
      >
        <div className="m-com-room-body">
          <h2 id="back-title" className="m-com-h2" data-reveal>
            <Phrases text={community.back.title} />
          </h2>
          <p className="m-com-room-lead" data-reveal>
            {community.back.lead}
          </p>
          <ul className="m-com-doors">
            {ui.back.paths.map((path, index) => (
              <li
                key={path.title}
                data-reveal
                style={{ '--delay': `${index * 90}ms` } as Vars}
              >
                <Door
                  href={path.href ?? contactHref(path.topic ?? 'creator')}
                  title={path.title}
                  text={path.text}
                  external={Boolean(path.href)}
                />
              </li>
            ))}
          </ul>
          {showcase.length ? (
            <ul className="m-com-showcase" data-reveal>
              {showcase.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noreferrer">
                    <b>{item.title}</b>
                    <span>
                      {item.by}
                      {item.method ? ` · ${item.method}` : ''}
                    </span>
                    {item.note ? <span>{item.note}</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-com-fine" data-reveal>
              {ui.back.empty}
            </p>
          )}
        </div>
        <Vignette
          name="art-greenhouse"
          sizes="(max-width: 900px) 100vw, 46vw"
          className="m-com-room-art"
        />
      </section>

      {/* ⑤ 结尾：那段画室 */}
      <Ending />
    </div>
  );
}
