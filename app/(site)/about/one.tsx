import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { story, studio } from '../../../content/site/studio';
import { members, team, teamUi } from '../../../content/site/team';
import { alongGroups, flowOf } from '../../../content/site/along';
import { essays, splitTitle } from '../../../content/site/essays';
import { nav } from '../../../content/site/nav';
import {
  productIds,
  products,
  type ProductId,
} from '../../../content/site/products';
import { aboutUi, trio } from '../../../content/site/about';
import {
  ALONG,
  COMMUNITY,
  ENTERPRISE,
  contactHref,
  essayHref,
  productHref,
} from '../../_site/routes';
import { Btn, More, Phrases, Status, type Vars } from '../../_site/ui';
import { Work } from '../../_site/exhibit/exhibit';
import { BeliefGallery } from './belief-gallery';
import { Plate } from './plate';
import { Trio } from './trio';
import './one.css';

// 「关于」一整页（清单 C1；负责人 2026-10-18 定方向、看过样张后切成默认）。顶栏「关于」直接到这里，不再有下拉；
// 旧地址 /team 跳到「我们是谁」（#people），/community/yijun 跳到一骏的名牌；文章、沿途各自留着，从这一页的卡片进去。
// 一条主线「技术，回到人的尺度。」，把态度、人、来路、文章、做法、信念和产品串在一页里：
// 开场 · 我们是谁 · 从哪来（去沿途）· 什么变了（去文章）· 三种媒介 · 六条信念 · 想做的事 · 找同类。
// 不再是四间展厅：没有名牌、平面图、墙色和「下一个展厅」；展品不编号，图下只留媒介与摄影者（AI 生成的图照实标出）。
// 区块之间用留白分开，不画线；内容居中陈列。
// 正文全部是底稿原句，从 studio.ts、team.ts、along.ts、essays.ts 读、用代码切（一字不差），
// 每句只出现一次：「找同类，不抢货架。」在结尾回扣一次标题，它的正文只在六条信念里。
// 新写的界面文字只有小标签、去处与几个数的说明，沿用 aboutUi、teamUi、trio 里已有的写法。
// 去处的写法按全站链接规则（E3）：有标题和说明的卡片整张是链接、只留箭头；独立入口用 More，两三个字说明去处；
// Btn 的箭头由公共部件自己加，这里不手放。

/** 按句号、问号切句 */
const sentences = (text: string) =>
  text.match(/[^。？！]+[。？！]?/g) ?? [text];

const HUMAN_SCALE = '《人的尺度》';

/** 把原句里的《人的尺度》换成去文章的链接，其余一字不动 */
function WithEssayLink({ text }: { text: string }) {
  const [before, after] = text.split(HUMAN_SCALE);
  if (after === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <Link className="m-inline" href={essayHref('human-scale')}>
        {HUMAN_SCALE}
      </Link>
      {after}
    </>
  );
}

const [fromMeituan, fromRoles, nowAtMolis] = sentences(
  story.origin.paragraphs[0],
);
const leadFirst = sentences(team.lead)[0];
const care = sentences(studio.standard.intro)[1].split('：')[0];
const findPeers = studio.beliefs[2];

const alongItems = alongGroups.flatMap((group) => group.items);
const intoProducts = alongItems.filter((item) =>
  ['work', 'tool', 'story'].includes(flowOf(item)),
).length;

const nearIds = productIds.filter((id) => id !== 'world') as Exclude<
  ProductId,
  'world'
>[];

/** 六条信念各配一张（沿用现版的配对） */
const beliefWorks = [
  { name: 'ex-dancer', focus: '50% 40%' },
  { name: 'ex-window-blinds', focus: '50% 60%' },
  { name: 'ex-field-flowers', focus: '45% 50%' },
  { name: 'ex-viewer', focus: '45% 50%' },
  { name: 'ex-field-arms', focus: '50% 45%' },
  { name: 'ex-paper-plane', focus: '35% 45%' },
] as const;

/** 四个日常问题在「能不能」前断开，不在词中间折行 */
function Question({ text }: { text: string }) {
  const at = text.indexOf('能不能');
  if (at < 1) return <>{text}</>;
  return (
    <>
      <span className="m-phrase">{text.slice(0, at)}</span>
      <span className="m-phrase">{text.slice(at)}</span>
    </>
  );
}

/** 有标题和说明的去处：整张是链接，只留一个箭头按钮 */
function Go({
  href,
  className = '',
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link className={`ao-go ${className}`} href={href}>
      <span className="ao-go-body">{children}</span>
      <span className="ao-go-arrow" aria-hidden="true">
        <ArrowRight size={18} />
      </span>
    </Link>
  );
}

export function AboutOne() {
  const change = story.change.paragraphs;
  return (
    <div className="ao">
      {/* 开场：主线，窗前的人 */}
      <header className="ao-open m-wrap">
        <h1 className="ao-h1 m-rise" style={{ '--delay': '60ms' } as Vars}>
          <Phrases text={studio.vision} />
        </h1>
        <p className="ao-lead m-rise" style={{ '--delay': '140ms' } as Vars}>
          <Phrases text={studio.standard.character} />
        </p>
        <Work
          name="about-window"
          ratio="16 / 9"
          focus="72% 56%"
          maxH="54svh"
          sizes="(max-width: 900px) 100vw, 1200px"
          eager
          fill
          className="ao-open-work"
        />
      </header>

      {/* 我们是谁：八个人 */}
      <section
        className="ao-sec m-wrap"
        id="people"
        aria-labelledby="ao-people-title"
      >
        <div className="ao-head" data-reveal>
          <p className="ao-kicker">{teamUi.membersLabel}</p>
          <h2 className="ao-h2" id="ao-people-title">
            <Phrases text={team.title} />
          </h2>
          <p className="ao-text">{leadFirst}</p>
        </div>
        <ol className="tm-roster ao-roster">
          {members.map((member, index) => (
            <Plate key={member.id} member={member} index={index} />
          ))}
        </ol>
        <p className="ao-fine" data-reveal>
          {teamUi.selfNote}
        </p>
      </section>

      {/* 从哪来：来时路，去沿途 */}
      <section className="ao-sec m-wrap" aria-labelledby="ao-from-title">
        <div className="ao-split">
          <div className="ao-from-pics">
            <Work
              name="team-sketchbook"
              ratio="4 / 3"
              focus="50% 55%"
              maxH="44svh"
              sizes="(max-width: 900px) 100vw, 34vw"
              className="ao-from-book"
            />
            <Work
              name="ex-car-sea"
              ratio="4 / 5"
              focus="58% 50%"
              maxH="34svh"
              sizes="(max-width: 900px) 60vw, 16vw"
              className="ao-from-sea"
              style={{ '--delay': '120ms' } as Vars}
            />
          </div>
          <div className="ao-split-text" data-reveal>
            <p className="ao-kicker">{teamUi.pathLabel}</p>
            <h2 className="ao-h2" id="ao-from-title">
              <Phrases text={fromMeituan} />
            </h2>
            <p className="ao-text">
              {fromRoles}
              {nowAtMolis}
            </p>
            <p className="ao-text">{story.origin.paragraphs[2]}</p>
            <Go href={ALONG} className="ao-go-along">
              <span className="ao-go-title">{nav.aboutItems.along}</span>
              <span className="ao-go-line">
                <span className="num">{alongItems.length}</span>{' '}
                {teamUi.groups(alongGroups.length)}
              </span>
              <span className="ao-go-line">
                {teamUi.intoProducts(intoProducts)}
              </span>
            </Go>
          </div>
        </div>
      </section>

      {/* 什么变了：光照进来，去文章 */}
      <section className="ao-sec m-wrap" aria-labelledby="ao-change-title">
        <div className="ao-split">
          <Work
            name="ex-window-sun"
            ratio="4 / 5"
            focus="58% 40%"
            maxH="66svh"
            sizes="(max-width: 900px) 100vw, 40vw"
            className="ao-change-work"
          />
          <div className="ao-split-text" data-reveal>
            <p className="ao-kicker">{aboutUi.changed}</p>
            <h2 className="ao-h2" id="ao-change-title">
              <Phrases text={story.change.title} />
            </h2>
            <p className="ao-text">
              <WithEssayLink text={change[0]} />
            </p>
            <p className="ao-text">{change[1]}</p>
            <p className="ao-text">{change[2]}</p>
            <p className="ao-keys">{change[3]}</p>
            <ul className="ao-essays">
              {essays.map((essay) => {
                const { main, sub } = splitTitle(essay.title);
                return (
                  <li key={essay.slug}>
                    <Go href={essayHref(essay.slug)}>
                      <span className="ao-go-title">《{main}》</span>
                      {sub ? <span className="ao-go-line">{sub}</span> : null}
                    </Go>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* 三种媒介，同一个动作 */}
      <section
        className="ao-sec m-wrap"
        id="makers"
        aria-labelledby="ao-trio-title"
      >
        <div className="ao-head" data-reveal>
          <p className="ao-kicker" lang="en">
            {trio.kicker}
          </p>
          <h2 className="ao-h2" id="ao-trio-title">
            <Phrases text={trio.title} />
          </h2>
          <p className="ao-text ao-head-read">{studio.standard.makers}</p>
        </div>
        <Trio flow />
      </section>

      {/* 六条信念：图停在一处，随文字换 */}
      <section
        className="ao-sec m-wrap"
        id="beliefs"
        aria-labelledby="ao-beliefs-title"
      >
        <div className="ao-head" data-reveal>
          <p className="ao-kicker" lang="en">
            {aboutUi.believe}
          </p>
          <h2 className="ao-h2" id="ao-beliefs-title">
            {aboutUi.title}
          </h2>
        </div>
        <BeliefGallery
          items={studio.beliefs.map((belief, index) => {
            const work = beliefWorks[index];
            const figure = (still: boolean) => (
              <Work
                name={work.name}
                ratio={still ? '4 / 5' : '3 / 2'}
                focus={work.focus}
                maxH={still ? '68svh' : undefined}
                sizes={still ? '38vw' : '(max-width: 900px) 100vw, 50vw'}
                fill={still}
              />
            );
            return {
              title: belief.title,
              text: belief.text,
              figure: figure(false),
              still: figure(true),
            };
          })}
        />
      </section>

      {/* 想做的事：四个日常问题对上四件产品，World 更远 */}
      <section className="ao-sec m-wrap" aria-labelledby="ao-want-title">
        <div className="ao-head" data-reveal>
          <p className="ao-kicker">{teamUi.wantLabel}</p>
          <h2 className="ao-h3" id="ao-want-title">
            <Phrases text={studio.short[2]} />
          </h2>
          <p className="ao-fine">{care}</p>
        </div>
        <ol className="ao-products">
          {nearIds.map((id, index) => (
            <li
              key={id}
              data-reveal
              style={{ '--delay': `${index * 70}ms` } as Vars}
            >
              <Go href={productHref[id]}>
                <span className="ao-go-q">
                  <Question text={studio.standard.questions[id]} />
                </span>
                <span className="ao-go-to">
                  <span className="ao-go-name" lang="en">
                    {products[id].name}
                  </span>
                  <Status>{products[id].stage}</Status>
                </span>
              </Go>
            </li>
          ))}
          <li
            data-far
            data-reveal
            style={{ '--delay': `${nearIds.length * 70}ms` } as Vars}
          >
            <Go href={productHref.world}>
              <span className="ao-go-q">{teamUi.far}</span>
              <span className="ao-go-to">
                <span className="ao-go-name" lang="en">
                  {products.world.name}
                </span>
                <Status concept>{products.world.stage}</Status>
              </span>
            </Go>
          </li>
        </ol>
        <div className="ao-together" data-reveal>
          <More href={ENTERPRISE}>{teamUi.enterprise}</More>
          <More href={COMMUNITY}>{nav.community}</More>
        </div>
      </section>

      {/* 结尾：找同类，不抢货架 */}
      <section className="ao-sec ao-end m-wrap" aria-labelledby="ao-end-title">
        <div className="ao-end-pics">
          <Work
            name="life-shore"
            ratio="4 / 5"
            focus="84% 50%"
            maxH="48svh"
            sizes="(max-width: 900px) 50vw, 24vw"
          />
          <Work
            name="ex-shore-person"
            ratio="4 / 5"
            focus="52% 50%"
            maxH="48svh"
            sizes="(max-width: 900px) 50vw, 24vw"
            style={{ '--delay': '120ms' } as Vars}
          />
        </div>
        <div className="ao-head" data-reveal>
          <h2 className="ao-h2" id="ao-end-title">
            <Phrases text={findPeers.title} />
          </h2>
          <p className="ao-text">{studio.ware.view}</p>
          <div className="ao-end-act">
            <Btn href={contactHref()}>{teamUi.chat}</Btn>
          </div>
        </div>
      </section>
    </div>
  );
}
