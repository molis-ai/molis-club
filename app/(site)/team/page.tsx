import { Plus } from 'lucide-react';
import { pageMetadata } from '../../../lib/site';
import { members, team, teamUi, type Member } from '../../../content/site/team';
import { story, studio } from '../../../content/site/studio';
import { alongGroups, flowOf } from '../../../content/site/along';
import { rooms } from '../../../content/site/exhibit';
import {
  productIds,
  products,
  type ProductId,
} from '../../../content/site/products';
import {
  ABOUT,
  ALONG,
  COMMUNITY,
  ENTERPRISE,
  TEAM,
  contactHref,
  productHref,
} from '../../_site/routes';
import {
  Btn,
  More,
  Note,
  pad,
  Phrases,
  Status,
  type Vars,
} from '../../_site/ui';
import { Facts, NextRoom, RoomMeta, Work } from '../../_site/exhibit/exhibit';
import './team.css';

export const metadata = pageMetadata(
  teamUi.pageTitle,
  `${team.title}${team.lead}`,
  TEAM,
);

// 展厅 01「认识我们」· 主题：人（负责人 2026-10-15 定：「关于」做成同一位作者的一场展，这是第一间，亚麻色的墙）。
// 六屏，每屏一个视口放得下：
// ① 开场：展厅名、一句策展语、三个数，一张长桌；
// ② 八个人：名牌四列两行，正面露一句本人自述，「经历」点开看全文；
// ③ 来时路：2.1 第三段两句（标题与车窗外的海那件的展签），速写本；54 件、走进展厅 03；
// ④ 黑客与画家：一面挂满的墙（借风作画的小机器 + 四张作画、工作的照片），1.3 创造者一段；
// ⑤ 想做的事：1.2 第三段，四个日常问题对上四件产品，World 更远（手作小岛标「概念示意」）；
// ⑥ 找同类：海边的孩子与站在水边的人并排，「找同类，不抢货架。」去聊一聊；然后是下一个展厅。
// 句子取自 studio.ts、team.ts 与 along.ts（用代码切，保证一字不差）；新写的界面文字在 teamUi 与 exhibit.ts。

/** 按句号、问号切句 */
const sentences = (text: string) =>
  text.match(/[^。？！]+[。？！]?/g) ?? [text];

/** 个性标签按原文的分号拆成一行一个，去掉句末的句号 */
const tagsOf = (tags: string) =>
  tags
    .split('；')
    .map((tag) => tag.replace(/。$/, ''))
    .filter(Boolean);

const [fromMeituan, fromRoles, nowAtMolis] = sentences(
  story.origin.paragraphs[0],
);
const [nowLead, nowWhat] = nowAtMolis.split('：');
const [ourPath, ourSpace] = sentences(story.origin.paragraphs[2]);
const [makersWant, makersLine, makersKeep] = sentences(studio.standard.makers);
const leadFirst = sentences(team.lead)[0];
const care = sentences(studio.standard.intro)[1].split('：')[0];
const findPeers = studio.beliefs[2];
const peersLast = sentences(findPeers.text).at(-1) ?? '';

const items = alongGroups.flatMap((group) => group.items);
const total = items.length;
const intoProducts = items.filter((item) =>
  ['work', 'tool', 'story'].includes(flowOf(item)),
).length;
const road = rooms[2];

/** 「我们关心技术怎样进入具体的日常」：四个问题对上四件产品，World 更远 */
const nearIds = productIds.filter((id) => id !== 'world') as Exclude<
  ProductId,
  'world'
>[];

function Plate({ member, index }: { member: Member; index: number }) {
  const tags = member.tags ? tagsOf(member.tags) : [];
  const motto = member.motto?.split('：')[1]?.replace(/。$/, '');
  const fromMotto = Boolean(member.front && motto?.includes(member.front));
  const hasMore = Boolean(member.experience || tags.length || motto);
  return (
    <li
      className="tm-plate"
      id={member.id}
      data-reveal
      style={{ '--delay': `${(index % 4) * 70}ms` } as Vars}
    >
      <p className="tm-plate-top">
        <span className="ex-no num" aria-hidden="true">
          {pad(index + 1)}
        </span>
        <span className="tm-role">{member.role}</span>
      </p>
      <h3 className="tm-name">{member.name}</h3>
      {member.focus ? <p className="tm-focus">{member.focus}</p> : null}
      {member.front ? (
        <p className="tm-front">
          <span className="tm-front-tag">
            {fromMotto ? teamUi.motto : teamUi.self}
          </span>
          <span>「{member.front}」</span>
        </p>
      ) : null}
      {hasMore ? (
        <details className="tm-more">
          <summary>
            <span>{teamUi.more}</span>
            <span className="sr-only">：{member.name}</span>
            <Plus size={12} aria-hidden="true" />
          </summary>
          <div className="tm-more-body">
            {member.experience ? <p>{member.experience}</p> : null}
            {tags.length ? (
              <div className="tm-more-self">
                <p className="m-kicker">{teamUi.allSelf}</p>
                <ul>
                  {tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {motto ? (
              <p className="tm-more-motto">
                <span className="m-kicker">{teamUi.motto}</span>
                <span>{motto}</span>
              </p>
            ) : null}
          </div>
        </details>
      ) : null}
    </li>
  );
}

export default function TeamPage() {
  return (
    <div className="ex tm" data-room="people">
      {/* ① 开场：一张长桌 */}
      <header className="ex-open m-wrap">
        <RoomMeta room="people" />
        <div className="ex-grid tm-open">
          <div className="tm-open-text">
            <h1 className="ex-h1 m-rise" style={{ '--delay': '60ms' } as Vars}>
              {teamUi.pageTitle}
            </h1>
            <p
              className="ex-note m-rise"
              style={{ '--delay': '120ms' } as Vars}
            >
              <Phrases text={team.title} />
              <br />
              {leadFirst}
            </p>
            <div className="m-rise" style={{ '--delay': '180ms' } as Vars}>
              <Facts
                items={[
                  { label: teamUi.facts.members, value: members.length },
                  { label: teamUi.facts.tries, value: total },
                  { label: teamUi.facts.products, value: productIds.length },
                ]}
              />
              <a className="tm-down" href="#people">
                {teamUi.meet} ↓
              </a>
            </div>
          </div>
          <Work
            name="team-table"
            no="01"
            ratio="16 / 10"
            focus="50% 62%"
            maxH="62svh"
            sizes="(max-width: 900px) 100vw, 64vw"
            eager
            className="tm-open-work"
          />
        </div>
      </header>

      {/* ② 八个人 */}
      <section
        className="ex-screen m-wrap"
        id="people"
        aria-labelledby="tm-people-title"
      >
        <div className="tm-people-head" data-reveal>
          <p className="ex-kicker">{teamUi.membersLabel}</p>
          <h2 className="ex-h2" id="tm-people-title">
            <Phrases text={fromMeituan} />
          </h2>
          <p className="ex-text">{fromRoles}</p>
        </div>
        <ol className="tm-roster">
          {members.map((member, index) => (
            <Plate key={member.id} member={member} index={index} />
          ))}
        </ol>
        <div className="tm-people-foot" data-reveal>
          <p className="tm-now">
            <Phrases text={`${nowLead}：`} />
            <span className="tm-now-what">{nowWhat}</span>
          </p>
          <p className="tm-note">{teamUi.selfNote}</p>
        </div>
      </section>

      {/* ③ 来时路 */}
      <section className="ex-screen m-wrap" aria-labelledby="tm-path-title">
        <div className="ex-grid tm-path">
          <div className="tm-path-text" data-reveal>
            <p className="ex-kicker">{teamUi.pathLabel}</p>
            <h2 className="ex-h2" id="tm-path-title">
              <Phrases text={ourPath} />
            </h2>
            <p className="tm-count">
              <span className="tm-big num">{total}</span>
              <span className="tm-big-label">
                {teamUi.groups(alongGroups.length)}
              </span>
            </p>
            <p className="ex-text">{teamUi.intoProducts(intoProducts)}</p>
            <div className="tm-path-more">
              <More href={ALONG}>{teamUi.toRoom(road.no, road.name)}</More>
            </div>
          </div>
          <Work
            name="team-sketchbook"
            no="02"
            ratio="4 / 3"
            focus="50% 55%"
            maxH="56svh"
            sizes="(max-width: 900px) 100vw, 40vw"
            className="tm-path-book"
          />
          <Work
            name="ex-car-sea"
            no="03"
            ratio="4 / 5"
            focus="58% 50%"
            maxH="40svh"
            sizes="(max-width: 900px) 70vw, 22vw"
            className="tm-path-sea"
          >
            {ourSpace}
          </Work>
        </div>
      </section>

      {/* ④ 黑客与画家：一面挂满的墙 */}
      <section className="ex-screen m-wrap" aria-labelledby="tm-makers-title">
        <div className="ex-grid tm-makers-head" data-reveal>
          <div className="tm-makers-title">
            <p className="ex-kicker" lang="en">
              {teamUi.makersLabel}
            </p>
            <h2 className="ex-h2" id="tm-makers-title">
              <Phrases text={makersLine} />
            </h2>
          </div>
          <div className="tm-makers-lead">
            <p className="ex-text">{makersWant}</p>
            <More href={`${ABOUT}#demands`}>{studio.demands.title}</More>
          </div>
        </div>
        <div className="tm-salon">
          <Work
            name="team-wind"
            no="04"
            ratio="4 / 3"
            focus="62% 60%"
            sizes="(max-width: 900px) 100vw, 46vw"
            className="tm-salon-big"
          >
            {makersKeep}
          </Work>
          <Work
            name="ex-painter-water"
            no="05"
            ratio="4 / 3"
            focus="40% 50%"
            sizes="(max-width: 900px) 50vw, 24vw"
            style={{ '--delay': '80ms' } as Vars}
          />
          <Work
            name="ex-painter-blossom"
            no="06"
            ratio="4 / 3"
            focus="55% 50%"
            sizes="(max-width: 900px) 50vw, 24vw"
          />
          <Work
            name="ex-young-artist"
            no="07"
            ratio="4 / 3"
            focus="55% 50%"
            sizes="(max-width: 900px) 50vw, 24vw"
          />
          <Work
            name="ex-room-plants"
            no="08"
            ratio="4 / 3"
            focus="50% 50%"
            sizes="(max-width: 900px) 50vw, 24vw"
          />
        </div>
      </section>

      {/* ⑤ 想做的事 */}
      <section className="ex-screen m-wrap" aria-labelledby="tm-want-title">
        <div className="ex-grid tm-want">
          <div className="tm-want-text" data-reveal>
            <p className="ex-kicker">{teamUi.wantLabel}</p>
            <h2 className="ex-h3" id="tm-want-title">
              <Phrases text={studio.short[2]} />
            </h2>
            <p className="tm-care">{care}</p>
            <ol className="tm-qs">
              {nearIds.map((id) => (
                <li key={id} className="tm-q">
                  <p className="tm-q-text">{studio.standard.questions[id]}</p>
                  <a className="tm-q-to" href={productHref[id]}>
                    <span lang="en">{products[id].name}</span>
                    <Status>{products[id].stage}</Status>
                  </a>
                </li>
              ))}
              <li className="tm-q" data-far>
                <p className="tm-q-text">{teamUi.far}</p>
                <a className="tm-q-to" href={productHref.world}>
                  <span lang="en">{products.world.name}</span>
                  <Status concept>{products.world.stage}</Status>
                </a>
              </li>
            </ol>
            <div className="tm-together">
              <More href={ENTERPRISE}>{teamUi.enterprise}</More>
              <More href={COMMUNITY}>{teamUi.community}</More>
            </div>
          </div>
          <Work
            name="ex-desk-forest"
            no="09"
            ratio="3 / 2"
            focus="50% 60%"
            maxH="38svh"
            sizes="(max-width: 900px) 100vw, 40vw"
            className="tm-want-desk"
          />
          <Work
            name="team-island"
            no="10"
            ratio="4 / 3"
            focus="50% 60%"
            maxH="24svh"
            sizes="(max-width: 900px) 60vw, 20vw"
            note={<Note>{teamUi.concept}</Note>}
            className="tm-want-island"
          />
        </div>
      </section>

      {/* ⑥ 找同类：两张海边并排 */}
      <section className="ex-screen m-wrap" aria-labelledby="tm-end-title">
        <div className="ex-grid tm-end">
          <Work
            name="life-shore"
            no="11"
            ratio="4 / 5"
            focus="84% 50%"
            maxH="58svh"
            sizes="(max-width: 900px) 50vw, 26vw"
            className="tm-end-a"
          />
          <Work
            name="ex-shore-person"
            no="12"
            ratio="4 / 5"
            focus="52% 50%"
            maxH="58svh"
            sizes="(max-width: 900px) 50vw, 26vw"
            className="tm-end-b"
            style={{ '--delay': '120ms' } as Vars}
          />
          <div className="tm-end-text" data-reveal>
            <p className="ex-kicker">{teamUi.endLabel}</p>
            <h2 className="ex-h2" id="tm-end-title">
              <Phrases text={findPeers.title} />
            </h2>
            <p className="ex-note">{studio.ware.view}</p>
            <p className="ex-text tm-end-sub">{peersLast}</p>
            <div className="m-actions">
              <Btn href={contactHref()}>{teamUi.chat}</Btn>
            </div>
          </div>
        </div>
      </section>

      <NextRoom from="people" />
    </div>
  );
}
