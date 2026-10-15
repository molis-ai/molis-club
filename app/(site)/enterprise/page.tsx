import Link from 'next/link';
import { pageMetadata } from '../../../lib/site';
import { enterprise, type Member } from '../../../content/site/enterprise';
import { ENTERPRISE, TEAM } from '../../_site/routes';
import {
  More,
  Note,
  pad,
  Phrases,
  SectionHead,
  Status,
  Window,
  type Vars,
} from '../../_site/ui';
import { Fold, HaveNot, Paragraphs } from '../../_site/viz/viz';
import {
  EnterpriseForm,
  HookPicker,
  PickProvider,
  StartFrom,
} from './pick';
import { Route } from './course';
import { Symptom } from './symptoms';
import './enterprise.css';

const e = enterprise;

export const metadata = pageMetadata(
  e.metaTitle,
  `${e.title}${e.intro[2]}`,
  ENTERPRISE,
);

// 企业合作（specs/site-rebuild/visual-storyboard.md 第 1 节）：先让访客说出自己卡在哪，再给一条看得见的路。
// 首屏：标题 + 「你们卡在哪？」+ 四站小路线（选一个，亮出建议起点）；
// 01 五个问题，各一幅小图示；02 合作路线（钉住，点沿线走，架子上落下留给团队的东西）；
// 03 内部探索三张卡（已有 / 还没有，盖「不是客户案例」）；04 做这件事的人（方位图）；05 表单（带上选过的问题）。
// 原文长段落都还在，收在「展开看全文」里。

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

export default function EnterprisePage() {
  return (
    <PickProvider>
      <div className="m-ent">
        {/* 首屏：一句话 + 你们卡在哪 */}
        <header className="m-ent-hero m-wrap m-top">
          <div className="m-ent-hero-copy">
            <p className="m-tagline m-rise">
              <b>{e.metaTitle}</b>
              {e.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </p>
            <h1
              className="m-ent-title m-rise"
              style={{ '--delay': '80ms' } as Vars}
            >
              <Phrases text={e.title} />
            </h1>
            <ol
              className="m-ent-steps m-rise"
              style={{ '--delay': '160ms' } as Vars}
            >
              {e.steps.map((step, index) => (
                <li key={step} style={{ '--i': index } as Vars}>
                  {step}
                </li>
              ))}
            </ol>
            <Fold summary={e.hook.fullIntro} className="m-ent-hero-fold">
              <Paragraphs items={e.intro} />
            </Fold>
          </div>
          <div
            className="m-ent-hero-hook m-rise"
            style={{ '--delay': '240ms' } as Vars}
          >
            <HookPicker />
          </div>
          <Window
            className="m-ent-hero-window"
            name="enterprise-colonnade"
            ratio="21 / 9"
            focus="50% 42%"
            sizes="(max-width: 1440px) 100vw, 1440px"
            alt={e.window.alt}
            caption={<span lang="en">{e.window.caption}</span>}
          />
        </header>

        {/* 01 · 5.1 五个问题，各一幅小图示 */}
        <section
          className="m-ent-sec m-wrap"
          id="questions"
          aria-labelledby="ent-q-title"
        >
          <SectionHead
            no="01"
            kicker={e.questions.kicker}
            title={<Phrases text={e.questions.title} />}
            lead={<p>{e.questions.lead}</p>}
            id="ent-q-title"
            size="h2"
          />
          <ol className="m-ent-cases">
            {e.questions.items.map((question, index) => (
              <li
                key={question.id}
                id={`q-${question.id}`}
                className="m-ent-case"
                data-reveal
                style={{ '--delay': `${index * 70}ms` } as Vars}
              >
                <Symptom id={question.id} words={question.words} />
                <span className="m-ent-case-no num" lang="en" aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <h3 className="m-ent-case-title">
                  <Phrases text={question.title} />
                </h3>
                <p className="m-ent-case-line">{question.line}</p>
                <div className="m-ent-case-end">
                  <StartFrom id={question.id} />
                </div>
                <Fold summary={e.questions.more}>
                  <Paragraphs items={question.paragraphs} />
                </Fold>
              </li>
            ))}
          </ol>
        </section>

        {/* 02 · 合作路线：5.3 三步在上，5.2 四项服务是线上四站，架子上落下留给团队的东西 */}
        <section
          className="m-ent-sec m-ent-path m-wrap"
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
          <Route />
          <div className="m-ent-path-folds">
            <Fold summary={e.path.fullStages}>
              {e.path.stages.map((stage) => (
                <div key={stage.title} className="m-ent-fold-part">
                  <p className="m-strong">{stage.title}</p>
                  <Paragraphs items={stage.paragraphs} />
                </div>
              ))}
            </Fold>
            <Fold summary={e.path.fullStations}>
              {Object.values(e.path.stations).map((station) => (
                <div key={station.id} className="m-ent-fold-part">
                  <p className="m-strong">{station.name}</p>
                  <Paragraphs items={station.paragraphs} />
                </div>
              ))}
            </Fold>
          </div>
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
            lead={
              <>
                <p>{e.explore.lead}</p>
                <p>{e.explore.caveat}</p>
              </>
            }
            id="ent-explore-title"
            size="h2"
          />
          <ul className="m-ent-labs">
            {e.explore.rows.map((row, index) => (
              <li
                key={row.name}
                className="m-ent-lab"
                data-reveal
                style={{ '--delay': `${index * 80}ms` } as Vars}
              >
                <div className="m-ent-lab-head">
                  <h3 lang="en">{row.name}</h3>
                  <Note>{e.explore.tag}</Note>
                </div>
                <p className="m-ent-lab-ask">
                  <span className="m-kicker">{e.explore.asks}</span>
                  <span>{row.question}</span>
                </p>
                <p className="m-ent-lab-line">{row.line}</p>
                <p className="m-ent-lab-stage">
                  <Status>{row.stage}</Status>
                </p>
                <HaveNot
                  have={row.have}
                  notYet={row.notYet}
                  labels={{ have: e.explore.have, notYet: row.notYetLabel }}
                />
                <Fold>
                  <Paragraphs items={row.paragraphs} />
                </Fold>
              </li>
            ))}
          </ul>
          <p className="m-ent-labs-end">{e.explore.closing}</p>
        </section>

        {/* 04 · 5.5 做这件事的人：四个方位围着同一件事 */}
        <section
          className="m-ent-sec m-wrap"
          id="people"
          aria-labelledby="ent-people-title"
        >
          <SectionHead
            no="04"
            kicker={e.people.kicker}
            title={<Phrases text={e.people.title} />}
            lead={<p>{e.people.lead}</p>}
            id="ent-people-title"
            size="h2"
          />
          <div className="m-ent-compass" data-reveal>
            <p className="m-ent-compass-center" aria-hidden="true">
              <span>{e.people.center}</span>
            </p>
            <ol className="m-ent-compass-groups">
              {e.people.groups.map((group, index) => (
                <li
                  key={group.title}
                  className="m-ent-quad"
                  data-at={index}
                  style={{ '--i': index } as Vars}
                >
                  <h3 className="m-ent-quad-title">
                    <Phrases text={group.title} />
                  </h3>
                  <ul className="m-ent-quad-people">
                    {group.members.map((member) => (
                      <li key={member.id} className="m-ent-person">
                        <Face member={member} />
                        <p>
                          <Link
                            className="m-ent-who"
                            href={`${TEAM}#${member.id}`}
                          >
                            {member.name}
                          </Link>
                          <span>{member.text}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
          <div className="m-ent-people-end">
            <p>{e.people.note}</p>
            <More href={TEAM}>{e.people.link}</More>
          </div>
        </section>

        {/* 05 · 表单：来意固定为企业合作，带上首屏选过的问题 */}
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
            <EnterpriseForm />
          </div>
        </section>
      </div>
    </PickProvider>
  );
}
