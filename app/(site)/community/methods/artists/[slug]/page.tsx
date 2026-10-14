import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { pageMetadata } from '../../../../../../lib/site';
import { artistSkills } from '../../../../../../content/artists';
import {
  ARTIST_SKILL_REPO,
  community,
  methodText,
  skillZipKb,
  works,
} from '../../../../../../content/site/community';
import {
  artistHref,
  COMMUNITY,
  contactHref,
  METHODS,
} from '../../../../../_site/routes';
import { More, Note, pad, type Vars } from '../../../../../_site/ui';
import { CopyPrompt, SkillDownload } from '../../../copy';
import '../../methods.css';

// 艺术家 Skill 详情：试样整张放在一块浅纸上（不裁、不加框），旁边是它怎样组织创作的三步和下载；
// 再讲怎样把方法带进自己的创作，给一段调用示例；最后是其他观看方式。
// 试样一律注明「AI 创作试样，非艺术家原作」。

type Props = { params: Promise<{ slug: string }> };

const find = (slug: string) => artistSkills.find((item) => item.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skill = find(slug);
  if (!skill) return { title: methodText.notFound, robots: { index: false } };
  return pageMetadata(
    `${skill.name} · ${methodText.artist.kind}`,
    `${skill.description}${skill.image ? community.methods.disclosure : ''}`,
    artistHref(skill.slug),
  );
}

export default async function ArtistSkillPage({ params }: Props) {
  const { slug } = await params;
  const skill = find(slug);
  if (!skill) notFound();
  const t = methodText.artist;
  const builder = skill.slug === 'art-style-skill-builder';
  return (
    <div className="m-mth m-mth-detail">
      <header className="m-mth-hero m-wrap m-top">
        <nav className="m-mth-trail m-rise" aria-label="位置">
          <Link href={COMMUNITY}>{methodText.trail.community}</Link>
          <span aria-hidden="true">/</span>
          <Link href={`${METHODS}?type=artists`}>
            {methodText.trail.methods}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{skill.name}</span>
        </nav>
        <div className="m-mth-head">
          <p className="m-tagline m-rise">
            <b>{t.kind}</b>
            <span>{skill.medium}</span>
            {skill.image ? <Note>{works.artist.sampleNote}</Note> : null}
          </p>
          <h1
            className="m-mth-h1 m-rise"
            style={{ '--delay': '100ms' } as Vars}
          >
            {skill.name}
            <i lang="en">{skill.english}</i>
          </h1>
          <p
            className="m-mth-lead m-rise"
            style={{ '--delay': '200ms' } as Vars}
          >
            {skill.description}
          </p>
          {builder ? (
            <p
              className="m-mth-fine m-rise"
              style={{ '--delay': '260ms' } as Vars}
            >
              {community.methods.artist[1]}
            </p>
          ) : null}
        </div>
      </header>

      <section className="m-wrap" aria-labelledby="method-title">
        <div className="m-mth-spread">
          {skill.image ? (
            <figure className="m-mth-sample">
              <div className="m-mth-sample-view">
                <img
                  src={skill.image}
                  width={skill.width}
                  height={skill.height}
                  alt={skill.imageAlt}
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="m-caption">{t.sample}</span>
                <a
                  className="m-link"
                  href={skill.image}
                  target="_blank"
                  rel="noreferrer"
                >
                  {methodText.fullImage}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </figcaption>
            </figure>
          ) : (
            <div className="m-mth-sample-cover" aria-hidden="true">
              <em lang="en">
                {t.noImage.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </em>
              <p>{t.noImage.text}</p>
            </div>
          )}
          <div className="m-mth-method">
            <h2 id="method-title">{t.method}</h2>
            <ol className="m-mth-steps">
              {skill.method.map((step, index) => (
                <li key={step.title}>
                  <span className="m-no" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <b>{step.title}</b>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <SkillDownload
              slug={skill.slug}
              kb={skillZipKb[skill.slug]}
              label={t.download}
              solid
            />
            <p className="m-mth-fine">{t.package}</p>
          </div>
        </div>
      </section>

      <section className="m-wrap m-mth-block" aria-labelledby="use-title">
        <div className="m-mth-use">
          <div className="m-mth-use-text" data-reveal>
            <h2 id="use-title">{t.howTitle}</h2>
            <p>{skill.use}</p>
            <ol className="m-mth-install">
              {t.steps.map((step, index) => (
                <li key={step}>
                  <span className="m-no" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="m-mth-fine">{community.methods.tools}</p>
            <p className="m-mth-fine">{t.note}</p>
          </div>
          <div className="m-mth-prompt" data-reveal>
            <CopyPrompt
              id="m-mth-skill-prompt"
              label={t.promptLabel}
              text={skill.prompt}
              button={t.copy}
              topic="share-artist"
            />
          </div>
        </div>
      </section>

      <section
        className="m-wrap m-mth-block m-mth-related"
        aria-labelledby="others-title"
      >
        <h2 id="others-title">{t.others}</h2>
        <ul>
          {artistSkills
            .filter((item) => item.slug !== skill.slug)
            .map((item, index) => (
              <li key={item.slug}>
                <Link href={artistHref(item.slug)}>
                  <span className="m-no" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <b>{item.name}</b>
                  <i lang="en">{item.english}</i>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </li>
            ))}
        </ul>
        <div className="m-mth-github">
          <p>{community.back.github}</p>
          <p className="m-actions">
            <More href={ARTIST_SKILL_REPO} external>
              {methodText.repo}
            </More>
            <More href={contactHref('share-artist')}>
              {methodText.shareArtist}
              {methodText.shareLink}
            </More>
          </p>
        </div>
        <p className="m-mth-back">
          <More href={`${METHODS}?type=artists`}>
            {methodText.backToMethods}
          </More>
        </p>
      </section>
    </div>
  );
}
