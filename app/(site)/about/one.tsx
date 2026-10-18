import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { story, studio } from '../../../content/site/studio';
import { members, team, teamUi } from '../../../content/site/team';
import { alongGroups } from '../../../content/site/along';
import { essays, splitTitle } from '../../../content/site/essays';
import { nav } from '../../../content/site/nav';
import { aboutUi, trio } from '../../../content/site/about';
import {
  ALONG,
  COMMUNITY,
  ENTERPRISE,
  contactHref,
  essayHref,
  productHref,
} from '../../_site/routes';
import { Btn, More, Note, Phrases, type Vars } from '../../_site/ui';
import { Work } from '../../_site/exhibit/exhibit';
import { BeliefGallery } from './belief-gallery';
import { Plate } from './plate';
import { Trio } from './trio';
import './one.css';

// 「关于」一整页（清单 C1；负责人 2026-10-18 定方向、看过样张后切成默认）。顶栏「关于」直接到这里，不再有下拉；
// 旧地址 /team 跳到「我们是谁」（#people），/community/yijun 跳到一骏的名牌；文章、沿途各自留着，从这一页进去。
//
// 读起来是一篇故事（负责人 2026-10-18：「像读故事一样来读我们的故事」「成员放在最后，不想班味很重」「先讲愿景，可以先讲黑客与画家」）。
// 骨架是底稿第 2 章「我们的故事」，按负责人的顺序重排，第 1 章的愿景、做法与信念织在中间：
//   序 技术，回到人的尺度。→ 三种媒介，同一个动作（黑客与画家）→ 当想法更容易变成现实（2.2，去文章）→
//   我们相信什么（1.4）→ 从怎样工作，走向怎样生活（2.3，产品名在句子里链过去）→
//   从这些探索，看向更远的构想（2.4，World）→ 从同事，到共同创造的伙伴（2.1，去沿途；最后是八个人）→
//   尾声 找同类，不抢货架。
// 章节标题都是底稿的小标题，不加眉题与编号；「三种媒介」那一章由底稿 1.3 那句话本身开头，标题只给读屏；
// 正文是居中的一栏、左对齐，段落完整不拆；配图是段落之间的插页；只有一句的短段当作节拍，字大一点。
// 正文全部是底稿原句，从 studio.ts、team.ts、along.ts、essays.ts 读（一字不差），每段只出现一次：
// 「找同类，不抢货架。」在尾声回扣一次标题，它的正文只在信念里。
// 去处按全站链接规则（E3）：正文里的书名与产品名是行内链接；有标题和说明的卡片只留箭头；独立入口用 More。

/** 按句号、问号切句 */
const sentences = (text: string) =>
  text.match(/[^。？！]+[。？！]?/g) ?? [text];

/** 把原句里的书名、产品名换成行内链接（每个只链第一次出现），其余一字不动 */
function Linked({
  text,
  links,
}: {
  text: string;
  links: Array<[string, string]>;
}) {
  const out: ReactNode[] = [];
  const pending = [...links];
  let rest = text;
  while (pending.length) {
    let at = -1;
    let pick = -1;
    pending.forEach(([term], index) => {
      const found = rest.indexOf(term);
      if (found >= 0 && (at < 0 || found < at)) {
        at = found;
        pick = index;
      }
    });
    if (pick < 0) break;
    const [term, href] = pending.splice(pick, 1)[0];
    out.push(rest.slice(0, at));
    out.push(
      <Link key={term} className="m-inline" href={href}>
        {term}
      </Link>,
    );
    rest = rest.slice(at + term.length);
  }
  out.push(rest);
  return <>{out}</>;
}

/** 一段正文：只有一句的短段当作节拍，字大一点、墨色 */
function Para({
  text,
  links = [],
  lead = false,
}: {
  text: string;
  links?: Array<[string, string]>;
  /** 一章开头那句，也当作节拍 */
  lead?: boolean;
}) {
  const beat = lead || (sentences(text).length === 1 && text.length <= 28);
  return (
    <p className={beat ? 'ao-beat' : undefined}>
      <Linked text={text} links={links} />
    </p>
  );
}

const HUMAN_SCALE: [string, string] = [
  '《人的尺度》',
  essayHref('human-scale'),
];
const PRODUCTS: Array<[string, string]> = [
  ['Molis Work', productHref.work],
  ['Molis Tool', productHref.tool],
  ['Life', productHref.life],
  ['Story', productHref.story],
];

const leadFirst = sentences(team.lead)[0];
const findPeers = studio.beliefs[2];
const tries = alongGroups.flatMap((group) => group.items).length;

/** 六条信念各配一张（沿用现版的配对） */
const beliefWorks = [
  { name: 'ex-dancer', focus: '50% 40%' },
  { name: 'ex-window-blinds', focus: '50% 60%' },
  { name: 'ex-field-flowers', focus: '45% 50%' },
  { name: 'ex-viewer', focus: '45% 50%' },
  { name: 'ex-field-arms', focus: '50% 45%' },
  { name: 'ex-paper-plane', focus: '35% 45%' },
] as const;

/** 有标题和说明的去处：整张是链接，只留一个箭头按钮 */
function Go({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="ao-go" href={href}>
      <span className="ao-go-body">{children}</span>
      <span className="ao-go-arrow" aria-hidden="true">
        <ArrowRight size={18} />
      </span>
    </Link>
  );
}

/** 一章：底稿的小标题，下面是正文与插页 */
function Chapter({
  id,
  title,
  quiet = false,
  children,
}: {
  id: string;
  title: string;
  /** 标题只给读屏（这一章由一句话本身开头） */
  quiet?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="ao-ch m-wrap" id={id} aria-labelledby={`${id}-title`}>
      <h2
        className={quiet ? 'sr-only' : 'ao-ch-title'}
        id={`${id}-title`}
        data-reveal={quiet ? undefined : true}
      >
        <Phrases text={title} />
      </h2>
      {children}
    </section>
  );
}

export function AboutOne() {
  const change = story.change.paragraphs;
  const toLife = story.toLife.paragraphs;
  const further = story.further.paragraphs;
  return (
    <div className="ao">
      {/* 序：主线，窗前的人 */}
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

      {/* 黑客与画家：底稿 1.3 那一句就是控件，三个短句推动下面三扇窗（负责人 2026-10-18 定的句子） */}
      <Chapter id="makers" title={trio.title} quiet>
        <div className="ao-wide ao-makers">
          <Trio flow lead={studio.standard.makers} />
        </div>
      </Chapter>

      {/* 2.2 当想法更容易变成现实：光照进来，去文章 */}
      <Chapter id="change" title={story.change.title}>
        <div className="ao-prose" data-reveal>
          <Para text={change[0]} links={[HUMAN_SCALE]} />
          <Para text={change[1]} />
        </div>
        <Work
          name="ex-window-sun"
          ratio="3 / 2"
          focus="58% 40%"
          maxH="62svh"
          sizes="(max-width: 900px) 100vw, 960px"
          fill
          className="ao-fig"
        />
        <div className="ao-prose" data-reveal>
          <Para text={change[2]} />
          <Para text={change[3]} />
        </div>
        <ul className="ao-prose ao-essays" data-reveal>
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
      </Chapter>

      {/* 1.4 我们相信什么：图停在一处，随文字换 */}
      <Chapter id="beliefs" title={aboutUi.title}>
        <div className="ao-wide">
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
        </div>
      </Chapter>

      {/* 2.3 从怎样工作，走向怎样生活：产品的来历，产品名在句子里 */}
      <Chapter id="products" title={story.toLife.title}>
        <div className="ao-prose" data-reveal>
          <Para text={studio.short[2]} lead />
          {toLife.slice(0, 2).map((text) => (
            <Para key={text} text={text} links={PRODUCTS} />
          ))}
        </div>
        <Work
          name="ex-desk-forest"
          ratio="3 / 2"
          focus="50% 60%"
          maxH="58svh"
          sizes="(max-width: 900px) 100vw, 960px"
          fill
          className="ao-fig"
        />
        <div className="ao-prose" data-reveal>
          {toLife.slice(2).map((text) => (
            <Para key={text} text={text} links={PRODUCTS} />
          ))}
        </div>
      </Chapter>

      {/* 2.4 从这些探索，看向更远的构想：World，小岛（概念示意） */}
      <Chapter id="further" title={story.further.title}>
        <div className="ao-prose" data-reveal>
          <Para text={further[0]} />
          <Para
            text={further[1]}
            links={[['Molis World', productHref.world]]}
          />
        </div>
        <Work
          name="team-island"
          ratio="16 / 9"
          focus="50% 60%"
          maxH="52svh"
          sizes="(max-width: 900px) 100vw, 960px"
          note={<Note>{teamUi.concept}</Note>}
          fill
          className="ao-fig"
        />
        <div className="ao-prose" data-reveal>
          <Para text={further[2]} />
        </div>
      </Chapter>

      {/* 2.1 从同事，到共同创造的伙伴：来路、沿途，最后是八个人 */}
      <Chapter id="origin" title={story.origin.title}>
        <div className="ao-prose" data-reveal>
          {story.origin.paragraphs.map((text) => (
            <Para key={text} text={text} />
          ))}
        </div>
        <div className="ao-fig ao-fig-pair">
          <Work
            name="team-sketchbook"
            ratio="4 / 3"
            focus="50% 55%"
            maxH="44svh"
            sizes="(max-width: 900px) 60vw, 34vw"
          />
          <Work
            name="ex-car-sea"
            ratio="4 / 5"
            focus="58% 50%"
            maxH="34svh"
            sizes="(max-width: 900px) 40vw, 16vw"
            style={{ '--delay': '120ms' } as Vars}
          />
        </div>
        <div className="ao-prose" data-reveal>
          <Go href={ALONG}>
            <span className="ao-go-title">{nav.aboutItems.along}</span>
            <span className="ao-go-line">
              <span className="num">{tries}</span>{' '}
              {teamUi.groups(alongGroups.length)}
            </span>
          </Go>
        </div>

        <div className="ao-people" id="people">
          <div className="ao-people-head" data-reveal>
            <h3 className="ao-people-title">
              <Phrases text={team.title} />
            </h3>
            <p>{leadFirst}</p>
          </div>
          <ol className="tm-roster ao-roster">
            {members.map((member, index) => (
              <Plate key={member.id} member={member} index={index} />
            ))}
          </ol>
          <p className="ao-fine" data-reveal>
            {teamUi.selfNote}
          </p>
        </div>
      </Chapter>

      {/* 尾声：找同类，不抢货架 */}
      <section className="ao-end m-wrap" aria-labelledby="ao-end-title">
        <div className="ao-end-pics">
          <Work
            name="life-shore"
            ratio="4 / 5"
            focus="84% 50%"
            maxH="40svh"
            sizes="(max-width: 900px) 50vw, 20vw"
          />
          <Work
            name="ex-shore-person"
            ratio="4 / 5"
            focus="52% 50%"
            maxH="40svh"
            sizes="(max-width: 900px) 50vw, 20vw"
            style={{ '--delay': '120ms' } as Vars}
          />
        </div>
        <div className="ao-end-text" data-reveal>
          <h2 className="ao-ch-title" id="ao-end-title">
            <Phrases text={findPeers.title} />
          </h2>
          <p className="ao-beat">
            <Phrases text={studio.ware.view} />
          </p>
          <p>{studio.standard.together}</p>
          <div className="ao-end-act">
            <Btn href={contactHref()}>{teamUi.chat}</Btn>
            <More href={ENTERPRISE}>{teamUi.enterprise}</More>
            <More href={COMMUNITY}>{nav.community}</More>
          </div>
        </div>
      </section>
    </div>
  );
}
