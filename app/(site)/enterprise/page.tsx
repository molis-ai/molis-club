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
import { plates, Vista, type Plate } from './vista';
import { Why } from './why';
import './enterprise.css';
import './line.css';

const e = enterprise;

export const metadata = pageMetadata(
  e.metaTitle,
  `${e.title}${e.intro[2]}`,
  ENTERPRISE,
);

// 以下六屏是旧版（/enterprise?study=current 对照用，负责人看过后删）：
// 企业合作（负责人 2026-10-15 定的六屏）：一张满幅照片开场，之后是纸面；每屏一句主句，不放「展开看全文」。
// ① 满幅照片：挂满小画的白色长廊，尽头一扇亮窗；一句标题、一行往下读的钩子。
// ② 你们卡在哪：五张纸条，每张一幅会动的小图；选一张，页面回一句「你们希望……」和建议起点。
// ③ 合作路线：开头一屏配图（一双手在做一件小工具）；四站一条线，宽屏钉住，点沿线走，「留在团队手里」的架子一件件摆满。
// ④ 做这件事的人：满幅的白墙转角，墙脚四张卡写团队的四项能力（不按人分）。⑤ 我们也在亲自探索：三栏，盖章「不是客户案例」。
// ⑥ 窗边的书桌与表单：选过的问题已经写在第一行。
// （路线之后原有一屏柱廊照片，负责人 2026-10-15 删去。）
// 首屏照片很亮，字用墨色，顶栏透明（data-tone="light"）。
//
// 企业合作默认是照原文的主线（D1，负责人 2026-10-19 通过样张后切成默认）。旧的六屏暂留对照：
// /enterprise?study=current 是旧版，/enterprise?study=line 是带比较条的新版；不带参数时没有比较条。主线：
// 长廊 → 你们卡在哪（五张纸条只做开场，选一张只带进末尾的表单；不再有「都看看」）
// → 满幅的一张图，开场第三段原句一拍一拍浮上来（vista.tsx；四张候选图在 ?plate=a|b|c|d 对照）
// → 合作路线：四站竖排成四列、业务团队 / 一起 / Molis 横排成三条道，底下是动画演出来的产出，仍在一屏（stages.tsx）
// → 为什么我们可以：四个位置一拍一拍点亮「一段业务」（why.tsx）→ 内部探索 → 表单。
// 负责人 2026-10-19 删去：「都看看」、合作路线前那双手与 5.2 开头那句、路线后 5.4 那句与「聊聊企业合作」那一屏、墙上的示意动画。
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
  searchParams: Promise<{ study?: string; plate?: string }>;
}) {
  const { study, plate } = await searchParams;
  const vistaPlate = plates.includes(plate as Plate) ? (plate as Plate) : 'a';
  const sample = study !== 'current';
  const review = study === 'line' || study === 'current';
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

          {/* 满幅的一张图，开场第三段原句一拍一拍浮上来 */}
          <Vista plate={vistaPlate} />

          {/* 合作路线：四站四列、三个角色三条道，底下是产出（stages.tsx） */}
          <Stages />

          {/* 为什么我们可以（why.tsx） */}
          <Why />
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
