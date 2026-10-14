import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUp, ArrowUpRight } from 'lucide-react';
import { pageMetadata } from '../../../lib/site';
import { artistSkills } from '../../../content/artists';
import { isResourceEntry, knowledge } from '../../../content/knowledge';
import {
  appendixTools,
  ARTIST_SKILL_REPO,
  community,
  communityUi,
  DROPAGENT_RELEASE,
  DROPAGENT_REPO,
  methodText,
  NIUL_REPO,
  showcase,
  works,
} from '../../../content/site/community';
import {
  COMMUNITY,
  contactHref,
  GITHUB,
  METHODS,
  productHref,
} from '../../_site/routes';
import {
  Btn,
  More,
  pad,
  Phrases,
  SectionHead,
  Status,
  Window,
  type Vars,
} from '../../_site/ui';
import { FlowerArt } from './flower-art';
import { FlowerMirror, FlowerPlay, FlowerTake } from './flower';
import { Col } from './parts';
import { ArtistCols, DropDemo, NiulDemo, WebCols } from './works';
import '../../_site/demo/demo.css';
import './methods/methods.css';
import './community.css';

export const metadata = pageMetadata(
  communityUi.kicker,
  `${community.title.join('')}${community.intro[0]}`,
  COMMUNITY,
);

// 社区（作品带着做法）：首屏左边沙上那道线，右边可以直接玩的「一朵好奇」。
// 01 每件作品一行三栏「先玩 / 看怎么做 / 带走」；02 方法目录（完整的在子页）；
// 03 带回来：三种方式、「大家做的」（只放本人同意展示的真实投稿，没有就空着）、GitHub 一起改；
// 结尾一句当前进展，和「带着好奇来，带点什么走，再带点什么回来。」
// 这一页的大胆决定：最后那句话不守网格，像沙上那道线一样一级一级往右下走。

const cols = communityUi.cols;

const counts = {
  artists: artistSkills.length,
  web: knowledge.filter((entry) => !isResourceEntry(entry)).length,
  sources: knowledge.filter(isResourceEntry).length,
};

/** 一件作品一行：左两栏编号，右边展签、名字、一句；下面三栏 */
function WorkRow({
  no,
  id,
  name,
  alias,
  form,
  stage,
  lead,
  children,
}: {
  no: number;
  id: string;
  name: string;
  alias?: string;
  form: string;
  stage: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <li className="m-com-work" id={id} aria-labelledby={`${id}-name`}>
      <header className="m-com-work-head" data-reveal>
        <span className="m-no m-com-work-no" aria-hidden="true">
          {pad(no)}
        </span>
        <div className="m-com-work-title">
          <p className="m-tagline">
            <span>{form}</span>
            <Status>{stage}</Status>
          </p>
          <h3 id={`${id}-name`}>
            <span lang={/^[A-Za-z0-9 .-]+$/.test(name) ? 'en' : undefined}>
              {name}
            </span>
            {alias ? <small>{alias}</small> : null}
          </h3>
          <p className="m-com-work-lead">
            <Phrases text={lead} />
          </p>
        </div>
      </header>
      <div className="m-com-cols">{children}</div>
    </li>
  );
}

export default function CommunityPage() {
  const t = community;
  const ui = communityUi;
  const flower = works.flower;
  return (
    <div className="m-com">
      {/* 首屏：左边沙上一道线，右边一朵可以直接玩的花 */}
      <header className="m-com-hero m-wrap m-top">
        <Window
          name="community-line"
          className="m-com-hero-window"
          ratio="4 / 5"
          focus="68% 58%"
          sizes="(max-width: 900px) 100vw, 40vw"
          alt={ui.heroAlt}
          caption={<span lang="en">{ui.heroCaption}</span>}
          eager
        />
        <div className="m-com-hero-head">
          <p className="m-tagline m-rise">
            <b>{ui.kicker}</b>
            {ui.heroTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>
          <h1
            className="m-com-title m-rise"
            style={{ '--delay': '100ms' } as Vars}
          >
            {t.title.map((line) => (
              <span key={line} className="m-com-title-line">
                <Phrases text={line} />
              </span>
            ))}
          </h1>
          <p
            className="m-com-hero-lead m-rise"
            style={{ '--delay': '200ms' } as Vars}
          >
            {t.intro[0]}
          </p>
        </div>
        <FlowerPlay />
      </header>

      <div className="m-com-intro m-wrap">
        <div className="m-com-intro-text" data-reveal>
          <p>
            {t.intro[1]}
            {t.intro[2]}
          </p>
          <p>{t.intro[3]}</p>
        </div>
      </div>

      {/* 01 作品，连同做法 */}
      <section
        className="m-section m-wrap"
        id="works"
        aria-labelledby="works-title"
      >
        <SectionHead
          no={pad(1)}
          kicker={ui.worksKicker}
          title={<Phrases text={t.try.title} />}
          id="works-title"
          lead={
            <div className="m-prose">
              <p>{t.try.lead}</p>
              <p>{t.try.works}</p>
              <p>{t.try.path.join('')}</p>
            </div>
          }
        />
        <ol className="m-com-works">
          <WorkRow
            no={1}
            id="work-flower"
            name={flower.name}
            form={flower.form}
            stage={flower.stage}
            lead={t.try.flower[0]}
          >
            <Col label={cols.play} kind="play">
              <p className="m-com-col-text">{t.try.flower[1]}</p>
              <FlowerMirror />
            </Col>
            <Col label={cols.how} kind="how">
              <p className="m-com-col-text">{t.try.flower[2]}</p>
              <ol className="m-com-rules">
                {flower.steps.map((step, i) => (
                  <li key={step.title}>
                    <FlowerArt
                      flower={{
                        count: step.count,
                        bloom: step.bloom,
                        color: 0,
                      }}
                      className="m-com-rule-art"
                    />
                    <span className="m-no" aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                    <b>{step.title}</b>
                    <p>{step.text}</p>
                  </li>
                ))}
              </ol>
            </Col>
            <Col label={cols.take} kind="take">
              <FlowerTake />
              <details className="m-com-peek">
                <summary>{flower.peek}</summary>
                <p>{flower.prompt}</p>
              </details>
              <More href={contactHref('share-flower')}>{flower.share}</More>
            </Col>
          </WorkRow>

          <WorkRow
            no={2}
            id="work-artist"
            name={works.artist.name}
            form={works.artist.form}
            stage={works.artist.stage}
            lead={t.methods.artist[0]}
          >
            <ArtistCols />
          </WorkRow>

          <WorkRow
            no={3}
            id="work-web"
            name={works.web.name}
            form={works.web.form}
            stage={works.web.stage}
            lead={t.methods.web}
          >
            <WebCols />
          </WorkRow>

          <WorkRow
            no={4}
            id="work-niul"
            name={works.niul.name}
            alias={works.niul.alias}
            form={works.niul.form}
            stage={works.niul.stage}
            lead={appendixTools.niul[0]}
          >
            <Col label={cols.demo} kind="play">
              <NiulDemo />
            </Col>
            <Col label={cols.why} kind="how">
              <div className="m-com-why">
                {appendixTools.niul.slice(1).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </Col>
            <Col label={cols.go} kind="take">
              <div className="m-com-take">
                <Btn href={NIUL_REPO} external>
                  {works.niul.repo}
                </Btn>
              </div>
            </Col>
          </WorkRow>

          <WorkRow
            no={5}
            id="work-drop"
            name={works.drop.name}
            form={works.drop.form}
            stage={works.drop.stage}
            lead={appendixTools.drop[0]}
          >
            <Col label={cols.demo} kind="play">
              <DropDemo />
            </Col>
            <Col label={cols.why} kind="how">
              <div className="m-com-why">
                {appendixTools.drop.slice(1).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </Col>
            <Col label={cols.go} kind="take">
              <div className="m-com-take">
                <Btn href={DROPAGENT_RELEASE} external>
                  {works.drop.download}
                </Btn>
                <p className="m-com-fine num">{works.drop.system}</p>
                <More href={DROPAGENT_REPO} external>
                  {works.drop.repo}
                </More>
                <div className="m-com-take-more">
                  <p>{appendixTools.both}</p>
                  <More href={productHref.tool}>{works.drop.tool}</More>
                </div>
              </div>
            </Col>
          </WorkRow>
        </ol>
      </section>

      {/* 02 方法目录：这里只放入口和三个大数字，完整目录在子页 */}
      <section
        className="m-section m-wrap m-com-methods"
        id="methods"
        aria-labelledby="methods-title"
      >
        <SectionHead
          no={pad(2)}
          kicker={ui.methodsKicker}
          title={<Phrases text={t.methods.question} />}
          id="methods-title"
          size="h2"
          lead={<p>{t.methods.answer}</p>}
        />
        <ul className="m-com-counts">
          {(
            [
              [
                'artists',
                methodText.groups.artists,
                counts.artists,
                t.methods.artist[0],
              ],
              ['web', methodText.groups.web, counts.web, t.methods.web],
              [
                'sources',
                methodText.groups.sources,
                counts.sources,
                t.methods.resources,
              ],
            ] as const
          ).map(([type, label, count, text], i) => (
            <li
              key={type}
              data-reveal
              style={{ '--delay': `${i * 90}ms` } as Vars}
            >
              <Link href={`${METHODS}?type=${type}`} className="m-com-count">
                <span className="m-com-count-n num">{count}</span>
                <span className="m-com-count-label">
                  {label}
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
              <p>{text}</p>
            </li>
          ))}
        </ul>
        <div className="m-com-methods-foot" data-reveal>
          <div className="m-prose">
            <p>{t.methods.why.join('')}</p>
            <p>
              {t.methods.tools}
              {t.methods.disclosure}
            </p>
          </div>
          <div className="m-actions">
            <Btn href={METHODS}>{ui.methodsOpen}</Btn>
          </div>
        </div>
      </section>

      {/* 03 带回来 */}
      <section
        className="m-section m-wrap m-com-back"
        id="back"
        aria-labelledby="back-title"
      >
        <SectionHead
          no={pad(3)}
          kicker={ui.backKicker}
          title={<Phrases text={t.back.title} />}
          id="back-title"
          lead={<p>{t.back.lead}</p>}
        />
        <Window
          name="community-sketch"
          className="m-com-back-window"
          ratio="21 / 9"
          focus="50% 64%"
          sizes="(max-width: 900px) 100vw, 1440px"
          alt={ui.sketchAlt}
          caption={<span lang="en">{ui.sketchCaption}</span>}
        />
        <ol className="m-com-ways">
          <li data-reveal>
            <span className="m-no" aria-hidden="true">
              {pad(1)}
            </span>
            <h3>{ui.ways[0].title}</h3>
            <p>{ui.ways[0].text}</p>
            <a className="m-link" href="#flower" data-dir="down">
              {ui.ways[0].link}
              <ArrowUp size={13} aria-hidden="true" />
            </a>
          </li>
          <li data-reveal style={{ '--delay': '90ms' } as Vars}>
            <span className="m-no" aria-hidden="true">
              {pad(2)}
            </span>
            <h3>{ui.ways[1].title}</h3>
            <p>{t.back.work.join('')}</p>
            <More href={contactHref('creator')}>{ui.ways[1].link}</More>
          </li>
          <li data-reveal style={{ '--delay': '180ms' } as Vars}>
            <span className="m-no" aria-hidden="true">
              {pad(3)}
            </span>
            <h3>{ui.ways[2].title}</h3>
            <p>{t.back.feedback.join('')}</p>
            <More href={contactHref('feedback')}>{ui.ways[2].link}</More>
          </li>
        </ol>

        <div className="m-com-wall" aria-labelledby="wall-title">
          <div className="m-com-wall-head" data-reveal>
            <h3 id="wall-title">{ui.wallTitle}</h3>
            <p>{t.back.showcase}</p>
          </div>
          {showcase.length > 0 ? (
            <ul className="m-com-wall-grid">
              {showcase.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noreferrer">
                    <b>{item.title}</b>
                    <span>
                      {item.by}
                      {item.method ? ` · ${item.method}` : ''}
                    </span>
                    {item.note ? <p>{item.note}</p> : null}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="m-com-wall-empty" data-reveal>
              <div className="m-com-wall-slots" aria-hidden="true">
                {Array.from({ length: 6 }, (_, i) => (
                  <i key={i} />
                ))}
              </div>
              <div className="m-com-wall-note">
                <p className="m-com-wall-empty-title">{ui.wallEmpty}</p>
                <p>{ui.wallEmptyNote}</p>
                <More href={contactHref('creator')}>{ui.wallFirst}</More>
              </div>
            </div>
          )}
        </div>

        <div className="m-com-github" data-reveal>
          <h3>{ui.githubTitle}</h3>
          <p>{t.back.github}</p>
          <p className="m-actions">
            <More href={ARTIST_SKILL_REPO} external>
              {ui.githubRepo}
            </More>
            <More href={GITHUB} external>
              {ui.githubOrg}
            </More>
          </p>
        </div>
      </section>

      {/* 结尾：一句当前进展；最后那句话像沙上的线，一级一级往右下走 */}
      <section className="m-com-end m-wrap" aria-labelledby="progress-title">
        <p className="m-com-hope" data-reveal>
          <Phrases text={t.back.hope} />
        </p>
        <div className="m-com-progress" data-reveal>
          <h2 id="progress-title" className="m-kicker">
            {t.progressLabel}
          </h2>
          <p>{t.progress}</p>
        </div>
        <p className="m-com-closing">
          {t.closing.match(/[^，。]+[，。]/g)?.map((part, i) => (
            <span
              key={part}
              data-reveal
              style={{ '--i': i, '--delay': `${i * 160}ms` } as Vars}
            >
              {part}
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}
