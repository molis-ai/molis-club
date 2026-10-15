import { ChevronDown } from 'lucide-react';
import { pageMetadata } from '../../../lib/site';
import {
  companies,
  members,
  origin,
  team,
  teamUi,
  type Member,
} from '../../../content/site/team';
import { story } from '../../../content/site/studio';
import { ABOUT, TEAM, contactHref } from '../../_site/routes';
import { Btn, More, pad, Phrases, type Vars } from '../../_site/ui';
import { Fold } from '../../_site/viz/viz';
import { Guess, OpenFromHash } from './guess';
import './team.css';

export const metadata = pageMetadata(
  teamUi.pageTitle,
  `${team.title}${team.lead}`,
  TEAM,
);

// 团队（visual-storyboard 第 2 节）：先给一个记得住的画面，再让人读履历。
// 首屏：标题 + 「这句是谁写的？」猜成员自述；
// 来路：一行一个人、一列一家公司的点阵，往下滚，所有点滑进最后一列 Molis——「这些不同的经验聚在 Molis」；
// 八个人：一行一个名牌（名字、身份、方向），点开是经历与自述；结尾一句「从不同的位置出发」。
// 没有本人照片，不放头像，不用素材里的人；待补的内容不出现。

/** 个性标签按原文的分号拆开，去掉句末的句号 */
const tagsOf = (tags: string) =>
  tags
    .split('；')
    .map((tag) => tag.replace(/。$/, ''))
    .filter(Boolean);

const MOLIS = companies.length;

function Origin() {
  return (
    <section
      className="tm-origin"
      data-scene
      aria-labelledby="tm-origin-title"
    >
      <div className="tm-origin-stick m-wrap">
        <p className="tm-origin-meta">
          <span className="m-no" aria-hidden="true">
            01
          </span>
          <span className="m-kicker">{origin.kicker}</span>
        </p>
        <h2 className="tm-origin-words" id="tm-origin-title">
          <span className="tm-origin-before">{origin.before}</span>
          <span className="tm-origin-after">
            <Phrases text={origin.after} />
          </span>
        </h2>
        <div className="tm-matrix" style={{ '--n': MOLIS + 1 } as Vars}>
          <p className="tm-matrix-head" aria-hidden="true">
            <span className="tm-matrix-corner" />
            <span className="tm-matrix-cols">
              {companies.map((company, col) => (
                <span
                  key={company}
                  className="tm-col"
                  style={{ '--col': col } as Vars}
                >
                  {company}
                </span>
              ))}
              <span
                className="tm-col tm-col-molis"
                lang="en"
                style={{ '--col': MOLIS } as Vars}
              >
                {origin.molis}
              </span>
            </span>
          </p>
          <ul className="tm-matrix-rows">
            {members.map((member, row) => {
              const past = member.past ?? [];
              return (
                <li
                  key={member.id}
                  className="tm-mrow"
                  style={{ '--r': row } as Vars}
                >
                  <span className="tm-mrow-name" aria-hidden="true">
                    {member.name}
                  </span>
                  <span className="sr-only">
                    {origin.label(member.name, past)}
                  </span>
                  <span className="tm-mrow-track" aria-hidden="true">
                    {past.map((company) => (
                      <span
                        key={`ring-${company}`}
                        className="tm-ring"
                        style={
                          { '--col': companies.indexOf(company) } as Vars
                        }
                      />
                    ))}
                    {past.map((company) => (
                      <span
                        key={`dot-${company}`}
                        className="tm-dot"
                        style={
                          { '--col': companies.indexOf(company) } as Vars
                        }
                      />
                    ))}
                    {past.length ? null : (
                      <span
                        className="tm-dot tm-dot-here"
                        style={{ '--col': MOLIS } as Vars}
                      />
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="tm-origin-note">{origin.note}</p>
      </div>
    </section>
  );
}

function Row({ member, index }: { member: Member; index: number }) {
  const [mottoLabel, motto] = member.motto?.split('：') ?? [];
  const head = (
    <>
      <span className="tm-row-no m-no" aria-hidden="true">
        {pad(index + 1)}
      </span>
      <span className="tm-row-name">
        <span className="tm-name">{member.name}</span>
        <span className="tm-role">{member.role}</span>
      </span>
      {member.focus ? (
        <span className="tm-row-focus">{member.focus}</span>
      ) : null}
    </>
  );
  // 资料待补的成员：只有名字与身份，不展开
  if (!member.experience)
    return (
      <li className="tm-row" id={member.id}>
        <div className="tm-row-head">
          <h3 className="tm-row-line">{head}</h3>
        </div>
      </li>
    );
  return (
    <li className="tm-row" id={member.id}>
      <details>
        <summary className="tm-row-head">
          <h3 className="tm-row-line">{head}</h3>
          <span className="tm-row-toggle">
            <span className="sr-only">{teamUi.more}</span>
            <ChevronDown size={16} aria-hidden="true" />
          </span>
        </summary>
        <div className="tm-row-body">
          <div className="tm-row-exp">
            <p className="m-kicker">{teamUi.experience}</p>
            <p>{member.experience}</p>
          </div>
          {member.tags ? (
            <div className="tm-row-self">
              <p className="m-kicker">{teamUi.self}</p>
              <ul className="tm-tags">
                {tagsOf(member.tags).map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              {motto ? (
                <p className="tm-motto">
                  <span className="m-kicker">{mottoLabel}</span>
                  <span>{motto.replace(/。$/, '')}</span>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </details>
    </li>
  );
}

export default function TeamPage() {
  return (
    <div className="tm">
      <OpenFromHash />
      <header className="tm-hero m-wrap m-top">
        <div className="tm-hero-copy">
          <p className="m-kicker m-rise" lang="en">
            {teamUi.kicker}
          </p>
          <h1 className="tm-title m-rise" style={{ '--delay': '80ms' } as Vars}>
            <Phrases text={team.title} />
          </h1>
          <p
            className="tm-lead m-lead m-rise"
            style={{ '--delay': '160ms' } as Vars}
          >
            {team.lead}
          </p>
        </div>
        <div
          className="tm-hero-guess m-rise"
          style={{ '--delay': '240ms' } as Vars}
        >
          <Guess />
        </div>
      </header>

      <Origin />

      <section className="tm-people m-wrap" aria-labelledby="tm-people-title">
        <header className="m-head" data-size="h2" data-reveal>
          <p className="m-head-meta">
            <span className="m-no" aria-hidden="true">
              02
            </span>
            <span className="m-kicker">{teamUi.pageTitle}</span>
          </p>
          <h2 className="m-head-title" id="tm-people-title">
            {teamUi.membersLabel}
          </h2>
        </header>
        <ol className="tm-rows">
          {members.map((member, index) => (
            <Row key={member.id} member={member} index={index} />
          ))}
        </ol>
      </section>

      <section className="tm-end m-wrap" aria-labelledby="tm-end-title">
        <p className="m-kicker" data-reveal>
          {teamUi.endKicker}
        </p>
        <h2 className="tm-end-title" id="tm-end-title" data-reveal>
          <Phrases text={story.origin.positions} />
        </h2>
        <div className="tm-end-body" data-reveal>
          <Fold summary={teamUi.shortFold}>
            <p>{story.short}</p>
          </Fold>
          <div className="m-actions">
            <Btn href={contactHref()}>{teamUi.chat}</Btn>
            <More href={ABOUT}>{teamUi.about}</More>
          </div>
        </div>
      </section>
    </div>
  );
}
