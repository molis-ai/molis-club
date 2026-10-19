import { ArrowDown } from 'lucide-react';
import { pageMetadata } from '../../../lib/site';
import { enterprise } from '../../../content/site/enterprise';
import { ReviewSwitch } from '../../_site/review/comparison';
import { ENTERPRISE } from '../../_site/routes';
import { mediaOf, Phrases, Window, type Vars } from '../../_site/ui';
import { Explore } from './explore';
import { People } from './people';
import { EnterpriseForm, PickProvider, Slips } from './pick';
import { Route } from './course';
import { Stages } from './stages';
import './enterprise.css';
import './line.css';

const e = enterprise;

export const metadata = pageMetadata(
  e.metaTitle,
  `${e.title}${e.intro[2]}`,
  ENTERPRISE,
);

// 企业合作（负责人 2026-10-15 定的六屏）：一张满幅照片开场，之后是纸面；每屏一句主句，不放「展开看全文」。
// ① 满幅照片：挂满小画的白色长廊，尽头一扇亮窗；一句标题、一行往下读的钩子。
// ② 你们卡在哪：五张纸条，每张一幅会动的小图；选一张，页面回一句「你们希望……」和建议起点。
// ③ 合作路线：开头一屏配图（一双手在做一件小工具）；四站一条线，宽屏钉住，点沿线走，「留在团队手里」的架子一件件摆满。
// ④ 做这件事的人：满幅的白墙转角，墙脚四张卡写团队的四项能力（不按人分）。⑤ 我们也在亲自探索：三栏，盖章「不是客户案例」。
// ⑥ 窗边的书桌与表单：选过的问题已经写在第一行。
// （路线之后原有一屏柱廊照片，负责人 2026-10-15 删去。）
// 首屏照片很亮，字用墨色，顶栏透明（data-tone="light"）。
//
// 样张（D1，?study=line；现版对照 ?study=current，默认仍是现版）：照原文的主线，不配对（负责人 2026-10-19 定）——
// 长廊 → 你们卡在哪（五张纸条只做开场，选一张只带进末尾的表单，不再放「看看这条路怎么走」）
// → 合作路线：开场第三段原句配那双手，下面一小行 5.2 开头原句；四站并排在一屏上，人人一样，
//   每面墙顶上一段示意动画演这一站在做什么（scenes.tsx），下面业务团队、Molis、一起各做什么，墙脚是留下的东西（stages.tsx）
// → 具体合作从团队眼前的问题出发（5.4 原句），聊聊 → 做这件事的人（只留小标题与经历）→ 内部探索 → 表单。
// 首屏去掉四个服务名，路线不再有横线与编号，不说「起点」，问题与站不一一对应（原文没有这层对应）。

/** 满幅照片：铺满一屏，载入前铺平均色，极慢地推近 */
function Plate({
  name,
  alt,
  focus,
  eager = false,
}: {
  name: 'enterprise-gallery';
  alt: string;
  focus: string;
  eager?: boolean;
}) {
  const image = mediaOf(name);
  return (
    <div className="m-plate" style={{ '--avg': image.avg } as Vars}>
      <img
        src={image.src}
        srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
        sizes="100vw"
        width={image.width}
        height={image.height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        style={{ objectPosition: focus }}
      />
    </div>
  );
}

export default async function EnterprisePage({
  searchParams,
}: {
  searchParams: Promise<{ study?: string }>;
}) {
  const { study } = await searchParams;
  const sample = study === 'line';
  const review = sample || study === 'current';
  const [titleA, titleB] = e.title.split('，');

  const hero = (
    <header className="m-ent-hero" data-tone="light">
      <Plate name="enterprise-gallery" alt={e.hero.alt} focus="50% 46%" eager />
      <div className="m-ent-hero-body">
        <p className="m-tagline m-rise">
          <b>{e.hero.kicker}</b>
          {sample ? null : e.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </p>
        <h1
          className="m-ent-title m-rise"
          style={{ '--delay': '120ms' } as Vars}
        >
          <span>{titleA}，</span>
          <span>{titleB}</span>
        </h1>
      </div>
    </header>
  );

  const where = (
    <section
      className="m-ent-where m-wrap"
      id="where"
      aria-labelledby="ent-where-title"
    >
      <header className="m-ent-where-head" data-reveal>
        <h2 className="m-ent-ask" id="ent-where-title">
          {e.hook.ask}
        </h2>
      </header>
      <Slips lean={sample} />
    </section>
  );

  const talk = (
    <section
      className="m-ent-talk m-wrap"
      id="talk"
      aria-labelledby="ent-talk-title"
    >
      <Window
        className="m-ent-talk-window"
        name="enterprise-desk"
        ratio="4 / 5"
        focus="40% 62%"
        sizes="(max-width: 900px) 100vw, 40vw"
        alt={e.talk.alt}
      />
      <div className="m-ent-talk-body">
        <header className="m-ent-talk-head" data-reveal>
          <h2 className="m-ent-talk-title" id="ent-talk-title">
            {e.talk.title}
          </h2>
        </header>
        <EnterpriseForm />
      </div>
    </section>
  );

  const switcher = review ? (
    <ReviewSwitch
      label="企业合作"
      variant={sample ? 'sample' : 'current'}
      currentHref={`${ENTERPRISE}?study=current`}
      sampleHref={`${ENTERPRISE}?study=line`}
    />
  ) : null;

  if (sample)
    return (
      <div className="m-ent" data-study="line">
        <PickProvider>
          {hero}

          {/* 你们卡在哪：只做开场，选一张只带进末尾的表单 */}
          {where}

          {/* 合作路线：开场第三段原句配那双手，下面一小行 5.2 开头原句；四站并排一屏（stages.tsx） */}
          <section
            className="m-ent-path"
            id="path"
            aria-labelledby="ent-promise-title"
          >
            <header className="m-ent-path-head m-wrap">
              <div className="m-ent-path-copy" data-reveal>
                <h2 className="m-ent-path-line" id="ent-promise-title">
                  <Phrases text={e.intro[2]} />
                </h2>
                <p className="m-lead m-ent-path-lead">
                  <Phrases text={e.path.lead} />
                </p>
              </div>
              <Window
                className="m-ent-path-window"
                name="enterprise-hands"
                ratio="3 / 2"
                focus="50% 45%"
                sizes="(max-width: 900px) 100vw, 56vw"
                alt={e.path.alt}
              />
            </header>
            <Stages />
            {/* 收尾：5.4 原句，回到团队眼前的问题 */}
            <div className="m-ent-onward m-wrap" data-reveal>
              <p className="m-ent-onward-line">
                <Phrases text={e.line.from} />
              </p>
              {/* 往下到表单：页内入口（描边胶囊 + 下箭头） */}
              <a className="m-link" href="#talk" data-dir="down">
                {e.hook.talk}
                <ArrowDown size={14} aria-hidden="true" />
              </a>
            </div>
          </section>

          <People lean />
          <Explore lean />
          {talk}
        </PickProvider>
        {switcher}
      </div>
    );

  return (
    <div className="m-ent">
      <PickProvider>
        {/* ① 首屏 */}
        {hero}

        {/* ② 你们卡在哪 */}
        {where}

        {/* ③ 合作路线 */}
        <section
          className="m-ent-path"
          id="path"
          aria-labelledby="ent-path-title"
        >
          {/* 路线开头单独一屏：左边那一句，右边一双手在做一件小工具 */}
          <header className="m-ent-path-head m-wrap">
            <div className="m-ent-path-copy" data-reveal>
              <p className="m-kicker">{e.path.kicker}</p>
              <h2 className="m-ent-path-line" id="ent-path-title">
                <Phrases text={e.path.line} />
              </h2>
            </div>
            <Window
              className="m-ent-path-window"
              name="enterprise-hands"
              ratio="3 / 2"
              focus="50% 45%"
              sizes="(max-width: 900px) 100vw, 56vw"
              alt={e.path.alt}
            />
          </header>
          <Route />
        </section>

        {/* ④ 做这件事的人 */}
        <People />

        {/* ⑤ 我们也在亲自探索 */}
        <Explore />

        {/* ⑥ 聊聊：窗边的书桌，表单第一行写着选过的问题 */}
        {talk}
      </PickProvider>
      {switcher}
    </div>
  );
}
