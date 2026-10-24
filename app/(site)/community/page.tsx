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
import { artistImage, mediaOf, Phrases, type Vars } from '../../_site/ui';
import { Ending } from './ending';
import { WorksGallery } from './gallery';
import { Hero } from './hero';
import '../../_site/demo/demo.css';
import './methods/methods.css';
import './community.css';

export const metadata = pageMetadata(
  communityUi.kicker,
  `${community.title.join('')}${community.intro[0]}`,
  COMMUNITY,
);

// 社区（负责人 2026-10-22 改回白房子，2026-10-24 定稿首屏与作品区，D2）：近白的纸、细线、白卡片，一屏一个重点。
// 宽窄交替：① 通栏 → ② 题目窄屏、画廊宽屏 → ③ 满幅浅底 → ④ 窄屏 → ⑤ 满幅画面。三张插画三种挂法。
// ① 首屏「大幅插画」（hero.tsx）：「开窗，开始创造」（W01-01）通栏铺满上面大半屏，下沿淡进纸里，两句标题压在上面。
// ② 五件作品一个画廊（gallery.tsx）：一朵好奇、Artist Skill、网页动效、niul.ai、DropAgent；
//    题目单独一屏开场，之后左边一扇大窗钉住，右边每件一屏，「怎么做」在窗里演示。
// ③ 方法目录：满幅的浅底上，「翻开，另一片天地」（W04-01）像一张卡纸托着的版画挂在题目旁边；
//    搜索 + 三张整张是链接的卡片，卡片的画面就是里面的东西（艺术家试样、几个动效小样、几个组件来源的名字）。
// ④ 再带点什么回来：窄屏。「把想法种出来」（W02-01）是一扇小拱窗；一个主行动「分享作品」，另外两条是描边的次要去处；
//    作品墙还空着时是一面空墙和一句话，不放假作品。
// ⑤ 结尾：首页挪来的那段画室，从纸面像一扇窗打开（ending.tsx）。
// 字只用第 6 章与附录 A.1 的原句，新写的只有标签和按钮。

const ui = communityUi;

/** 团队插画（方法目录、带回来）：同一份图，挂法由 className 定 */
function Plate({
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
      <span className="m-com-art-pic">
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
      </span>
      <figcaption className="m-com-art-name">
        {art.title} · {exUi.medium.album}
      </figcaption>
    </figure>
  );
}

/** 方法目录的三张卡片：画面就是里面的东西 */
const samples = artistSkills.filter((skill) => skill.image);
const techniques = knowledge.filter((entry) => !isResourceEntry(entry));
const sources = knowledge.filter(isResourceEntry);

/** 网页与动效的三个小样：纯 CSS 画的缩略，进入视口时动一遍；没有 JS、减少动态时是完成的样子 */
const minis = ['stagger', 'underline', 'accordion'] as const;
function Mini({ slug }: { slug: (typeof minis)[number] }) {
  const name = techniques.find((entry) => entry.slug === slug)?.name;
  return (
    <span className="m-com-mini" data-mini={slug}>
      <span className="m-com-mini-pic">
        {slug === 'stagger' ? (
          <>
            <i />
            <i />
            <i />
          </>
        ) : null}
        {slug === 'underline' ? <b>Aa</b> : null}
        {slug === 'accordion' ? (
          <>
            <i data-open />
            <i />
            <i />
          </>
        ) : null}
      </span>
      <span className="m-com-mini-name">{name}</span>
    </span>
  );
}

const shelves = [
  {
    type: 'artists',
    count: artistSkills.length,
    picture: (
      <span className="m-com-thumbs">
        {samples.map((skill) => (
          <img
            key={skill.slug}
            {...artistImage(skill.slug, skill, '(max-width: 900px) 30vw, 12vw')}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ))}
      </span>
    ),
  },
  {
    type: 'web',
    count: techniques.length,
    picture: (
      <span className="m-com-minis">
        {minis.map((slug) => (
          <Mini key={slug} slug={slug} />
        ))}
      </span>
    ),
  },
  {
    type: 'sources',
    count: sources.length,
    picture: (
      <span className="m-com-names" lang="en">
        {sources.slice(0, 5).map((entry) => (
          <span key={entry.slug}>{entry.name}</span>
        ))}
        <span aria-hidden="true">…</span>
      </span>
    ),
  },
] as const;

export default function CommunityPage() {
  const share = ui.back.share;
  return (
    <div className="m-com">
      {/* ① 首屏：两句标题，一张团队插画 */}
      <Hero />

      {/* ② 五件作品，一个画廊 */}
      <section className="m-com-shows m-wrap" aria-labelledby="works-title">
        <WorksGallery />
      </section>

      {/* ③ 方法目录 */}
      <section className="m-com-methods" aria-labelledby="methods-title">
        <div className="m-com-methods-in m-wrap">
          <div className="m-com-methods-head">
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
          </div>
          <Plate
            name="art-book"
            sizes="(max-width: 900px) 80vw, 26vw"
            className="m-com-plate"
          />
          <ul className="m-com-cats">
            {shelves.map((shelf, index) => (
              <li
                key={shelf.type}
                data-reveal
                style={{ '--delay': `${index * 90}ms` } as Vars}
              >
                <Link
                  className="m-com-cat"
                  href={`${METHODS}?type=${shelf.type}`}
                  data-cat={shelf.type}
                >
                  <span className="m-com-cat-pic" aria-hidden="true">
                    {shelf.picture}
                  </span>
                  <span className="m-com-cat-foot">
                    <b>{methodText.groups[shelf.type]}</b>
                    <span className="num">{shelf.count}</span>
                    <span className="m-com-cat-go" aria-hidden="true">
                      <ArrowRight size={17} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="m-com-fine m-com-methods-fine" data-reveal>
            {community.methods.tools}
            {community.methods.disclosure}
          </p>
        </div>
      </section>

      {/* ④ 再带点什么回来 */}
      <section className="m-com-back m-wrap" aria-labelledby="back-title">
        <div className="m-com-back-in">
          <Plate
            name="art-greenhouse"
            sizes="(max-width: 900px) 34vw, 16vw"
            className="m-com-arch"
          />
          <div className="m-com-back-body">
            <h2 id="back-title" className="m-com-h2" data-reveal>
              {community.back.title.split(/(?<=尝试)/).map((part) => (
                <span key={part}>{part}</span>
              ))}
            </h2>
            <p className="m-com-back-lead" data-reveal>
              {community.back.lead}
            </p>
            <div className="m-com-back-acts" data-reveal>
              <Link
                className="m-btn"
                href={contactHref(share.topic)}
                data-dir="right"
              >
                {share.title}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              {ui.back.also.map((path) =>
                'href' in path ? (
                  <a
                    key={path.title}
                    className="m-link"
                    href={path.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {path.title}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    key={path.title}
                    className="m-link"
                    href={contactHref(path.topic)}
                    data-dir="right"
                  >
                    {path.title}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
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
          /* 作品墙还空着：几只空画框挂在墙上，只写一句只放作者同意展示的投稿 */
          <div className="m-com-wall" data-reveal>
            <span className="m-com-wall-frames" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <p className="m-com-fine">{ui.back.empty}</p>
          </div>
        )}
      </section>

      {/* ⑤ 结尾：那段画室 */}
      <Ending />
    </div>
  );
}
