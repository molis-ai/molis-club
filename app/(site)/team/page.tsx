import { pageMetadata } from '../../../lib/site';
import { members, team, teamUi, type Member } from '../../../content/site/team';
import { story } from '../../../content/site/studio';
import { ABOUT, TEAM, contactHref } from '../../_site/routes';
import { Btn, More, pad, Phrases, type Vars } from '../../_site/ui';
import { FlipCard } from './flip';
import './team.css';

export const metadata = pageMetadata(
  teamUi.pageTitle,
  `${team.title}${team.lead}`,
  TEAM,
);

// 团队：一群同类，一起创造。8 人按第 7 章的顺序；卡片正面是方向与经历，背面是标「自述」的个性标签。
// 待补的内容不出现：没有标签就没有背面，杨鹏飞只显示名字与身份。
// 头像只用团队本人的（统一裁成圆、同一档轻调色）；没有的用名字首字做字标。不用素材图里的人。

/** 个性标签按原文的分号拆成一行一个，去掉句末的句号 */
const tagsOf = (tags: string) =>
  tags
    .split('；')
    .map((tag) => tag.replace(/。$/, ''))
    .filter(Boolean);

function Avatar({ member }: { member: Member }) {
  if (member.photo)
    return (
      <span className="tm-avatar">
        <img
          src={member.photo.src}
          width={member.photo.width}
          height={member.photo.height}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>
    );
  return (
    <span className="tm-avatar tm-mark" aria-hidden="true">
      {member.name.slice(0, 1)}
    </span>
  );
}

function Front({ member, index }: { member: Member; index: number }) {
  return (
    <>
      <div className="tm-top">
        <Avatar member={member} />
        <span className="m-no" aria-hidden="true">
          {pad(index + 1)}
        </span>
      </div>
      <div className="tm-namebar">
        <h3 className="tm-name" id={`${member.id}-name`}>
          {member.name}
        </h3>
        <span className="tm-role">{member.role}</span>
      </div>
      {member.focus ? <p className="tm-focus">{member.focus}</p> : null}
      {member.experience ? (
        <p className="tm-exp">{member.experience}</p>
      ) : null}
    </>
  );
}

function Back({ member }: { member: Member }) {
  const [mottoLabel, motto] = member.motto?.split('：') ?? [];
  return (
    <>
      <p className="tm-self">
        <span className="m-kicker">{teamUi.self}</span>
        <span className="tm-self-name">{member.name}</span>
      </p>
      <ul className="tm-tags">
        {tagsOf(member.tags ?? '').map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      {motto ? (
        <p className="tm-motto">
          <span className="m-kicker">{mottoLabel}</span>
          <span className="tm-motto-text">{motto.replace(/。$/, '')}</span>
        </p>
      ) : null}
    </>
  );
}

export default function TeamPage() {
  return (
    <div className="tm">
      <header className="tm-hero m-wrap m-top">
        <p className="m-kicker" lang="en" data-reveal>
          {teamUi.kicker}
        </p>
        <h1 className="tm-title" data-reveal>
          <Phrases text={team.title} />
        </h1>
        <p
          className="tm-lead m-lead"
          data-reveal
          style={{ '--delay': '90ms' } as Vars}
        >
          {team.lead}
        </p>
      </header>

      <section className="tm-people m-wrap" aria-labelledby="tm-people-title">
        <div className="tm-people-head" data-reveal>
          <h2 id="tm-people-title" className="m-kicker">
            {teamUi.membersLabel}
            <span className="num"> {pad(members.length)}</span>
          </h2>
          <p className="tm-note">
            <span className="m-note">{teamUi.selfNote}</span>
          </p>
        </div>
        <ol className="tm-grid">
          {members.map((member, index) => (
            <li
              key={member.id}
              data-reveal
              style={{ '--delay': `${(index % 4) * 70}ms` } as Vars}
            >
              {member.tags ? (
                <FlipCard
                  id={member.id}
                  name={member.name}
                  front={<Front member={member} index={index} />}
                  back={<Back member={member} />}
                />
              ) : (
                <article
                  className="tm-card"
                  id={member.id}
                  aria-labelledby={`${member.id}-name`}
                >
                  <div className="tm-inner">
                    <div className="tm-face tm-front">
                      <Front member={member} index={index} />
                    </div>
                  </div>
                </article>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="tm-end m-wrap" aria-labelledby="tm-end-title">
        <header className="m-head" data-size="h2" data-reveal>
          <p className="m-head-meta">
            <span className="m-kicker">{teamUi.endKicker}</span>
          </p>
          <h2 className="m-head-title" id="tm-end-title">
            <Phrases text={story.origin.positions} />
          </h2>
        </header>
        <div className="tm-end-body" data-reveal>
          <p className="tm-end-text">{story.short}</p>
          <div className="m-actions">
            <Btn href={contactHref()}>{teamUi.chat}</Btn>
            <More href={ABOUT}>{teamUi.about}</More>
          </div>
        </div>
      </section>
    </div>
  );
}
