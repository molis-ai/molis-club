import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { pageMetadata } from '../../../lib/site';
import { enterprise, type Member } from '../../../content/site/enterprise';
import { ContactForm } from '../../_site/contact-form';
import { ENTERPRISE, TEAM } from '../../_site/routes';
import {
  Btn,
  More,
  Note,
  pad,
  Phrases,
  SectionHead,
  Window,
  type Vars,
} from '../../_site/ui';
import { Path } from './path';
import './enterprise.css';

const e = enterprise;

export const metadata = pageMetadata(
  e.metaTitle,
  `${e.title}${e.intro[2]}`,
  ENTERPRISE,
);

// 企业合作：全站秩序感最强的一页。一切对齐 12 栏网格，区块之间只用 1px 线分隔，编号一路数下去。
// 首屏一句话 + 一扇宽窗（长石廊，尽头一棵树）；01 五个问题；02 合作路径（5.3 三步，5.2 四项服务是路径上的四站），
// 标志性交互：选一个最像你们的问题，路径上亮出建议起点；03 内部探索（不是客户案例）；04 做这件事的人；05 表单。

function Face({ member }: { member: Member }) {
  if (member.photo)
    return (
      <span className="m-ent-face">
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
    <span className="m-ent-face m-ent-face-mark" aria-hidden="true">
      {member.name.slice(0, 1)}
    </span>
  );
}

/** 成员句以名字开头：名字加粗、链到团队页这个人的卡片 */
function MemberLine({ member }: { member: Member }) {
  const rest = member.text.startsWith(member.name)
    ? member.text.slice(member.name.length)
    : member.text;
  return (
    <li className="m-ent-member">
      <Face member={member} />
      <p>
        <Link className="m-ent-who" href={`${TEAM}#${member.id}`}>
          {member.name}
        </Link>
        {rest}
      </p>
    </li>
  );
}

export default function EnterprisePage() {
  return (
    <div className="m-ent">
      {/* 首屏 */}
      <header className="m-ent-hero m-wrap m-top">
        <p className="m-tagline" data-reveal>
          <b>{e.metaTitle}</b>
          {e.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </p>
        <h1
          className="m-ent-title"
          data-reveal
          style={{ '--delay': '80ms' } as Vars}
        >
          <Phrases text={e.title} />
        </h1>
        <div
          className="m-ent-hero-go m-actions"
          data-reveal
          style={{ '--delay': '160ms' } as Vars}
        >
          <Btn href="#talk">{e.go.talk}</Btn>
          <a className="m-link" href="#path" data-dir="down">
            {e.go.path}
            <ArrowDown size={13} aria-hidden="true" />
          </a>
        </div>
        <Window
          className="m-ent-hero-window"
          name="enterprise-colonnade"
          ratio="21 / 9"
          focus="50% 42%"
          sizes="(max-width: 1440px) 100vw, 1440px"
          eager
          alt={e.window.alt}
          caption={<span lang="en">{e.window.caption}</span>}
        />
      </header>

      <section className="m-ent-intro m-wrap" aria-label={e.metaTitle}>
        <div className="m-ent-intro-text" data-reveal>
          {e.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* 01 · 5.1 可以从这些问题开始 */}
      <section
        className="m-ent-sec m-wrap"
        id="questions"
        aria-labelledby="ent-q-title"
      >
        <SectionHead
          no="01"
          kicker={e.questions.kicker}
          title={<Phrases text={e.questions.title} />}
          id="ent-q-title"
          size="h2"
        />
        <ol className="m-ent-questions">
          {e.questions.items.map((question, index) => (
            <li key={question.id} className="m-ent-question" data-reveal>
              <span className="m-ent-qno num" lang="en" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <h3 className="m-ent-qtitle">
                <Phrases text={question.title} />
              </h3>
              <div className="m-ent-qtext">
                {question.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 02 · 5.3 合作路径，5.2 四项服务是路径上的四站 */}
      <section
        className="m-ent-sec m-wrap"
        id="path"
        aria-labelledby="ent-path-title"
      >
        <SectionHead
          no="02"
          kicker={e.path.kicker}
          title={<Phrases text={e.path.title} />}
          lead={<p>{e.path.lead}</p>}
          id="ent-path-title"
          size="h2"
        />
        <Path />
      </section>

      {/* 03 · 5.4 内部探索：不是客户案例 */}
      <section
        className="m-ent-sec m-wrap"
        id="explore"
        aria-labelledby="ent-explore-title"
      >
        <SectionHead
          no="03"
          kicker={e.explore.kicker}
          title={<Phrases text={e.explore.title} />}
          lead={e.explore.lead.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          id="ent-explore-title"
          size="h2"
        />
        <div className="m-ent-table">
          <p className="m-ent-table-head" aria-hidden="true">
            <span />
            {e.explore.head.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </p>
          <ul className="m-ent-rows">
            {e.explore.rows.map((row) => (
              <li key={row.name} className="m-ent-row" data-reveal>
                <div className="m-ent-row-name">
                  <h3 lang="en">{row.name}</h3>
                  <Note>{e.explore.tag}</Note>
                </div>
                <dl className="m-ent-row-cells">
                  <div>
                    <dt>{e.explore.head[0]}</dt>
                    <dd className="m-strong">{row.question}</dd>
                  </div>
                  <div>
                    <dt>{e.explore.head[1]}</dt>
                    <dd>{row.exploration}</dd>
                  </div>
                  <div>
                    <dt>{e.explore.head[2]}</dt>
                    <dd>
                      <span className="m-status">{row.stage}</span>
                      <span className="m-ent-row-note">{row.stageNote}</span>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
          <p className="m-ent-table-end">{e.explore.closing}</p>
        </div>
      </section>

      {/* 04 · 5.5 做这件事的人 */}
      <section
        className="m-ent-sec m-wrap"
        id="people"
        aria-labelledby="ent-people-title"
      >
        <SectionHead
          no="04"
          kicker={e.people.kicker}
          title={<Phrases text={e.people.title} />}
          lead={e.people.lead.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          id="ent-people-title"
          size="h2"
        />
        <ol className="m-ent-groups">
          {e.people.groups.map((group, index) => (
            <li key={group.title} className="m-ent-group" data-reveal>
              <span className="m-ent-qno num" lang="en" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <h3 className="m-ent-group-title">
                <Phrases text={group.title} />
              </h3>
              <ul className="m-ent-members">
                {group.members.map((member) => (
                  <MemberLine key={member.id} member={member} />
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div className="m-ent-people-end">
          <p>{e.people.note}</p>
          <More href={TEAM}>{e.people.link}</More>
        </div>
      </section>

      {/* 05 · 表单：来意固定为企业合作 */}
      <section
        className="m-ent-sec m-ent-talk m-wrap"
        id="talk"
        aria-labelledby="ent-talk-title"
      >
        <SectionHead
          no="05"
          kicker={e.talk.kicker}
          title={<Phrases text={e.talk.title} />}
          lead={<p>{e.talk.lead}</p>}
          id="ent-talk-title"
          size="h2"
        />
        <div className="m-ent-form">
          <ContactForm fixed="enterprise" titleAs="h3" idPrefix="ent" />
        </div>
      </section>
    </div>
  );
}
