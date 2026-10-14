'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import { artistSkills } from '../../../../../../../../content/artists';
import { folioWiki } from '../../../../../../../../content/folio';
import { folioCommunity } from '../../../../../../../../content/folio-community';
import { Shell, pad } from '../../../../kit';
import { COMMUNITY, METHODS, artistHref } from '../../../../routes';
import { ShareAfter } from '../../../copy';
import { CopyPrompt } from '../../demos';
import '../../methods.css';

// 艺术家 Skill（社区「方法」的详情）：试样贴在白纸上，旁边是它组织创作的三步和下载；再讲怎样用、
// 给一段调用示例。顶栏用社区顶栏，位置是「社区 / 方法」；下载后提示可以把作品也发给我们一份。

export function MethodArtist({ slug }: { slug: string }) {
  const skill = artistSkills.find((item) => item.slug === slug)!;
  const t = folioWiki.artist;
  const [downloaded, setDownloaded] = useState(false);
  return (
    <Shell
      current="community"
      className="g-com-root g-mth-page"
      ending={<ArtistEnding slug={slug} />}
    >
      <header className="g-mth-opening">
        <nav className="g-mth-trail" aria-label="位置">
          <Link href={COMMUNITY}>{folioCommunity.detail.community}</Link>
          <span aria-hidden="true">/</span>
          <Link href={METHODS}>{folioCommunity.detail.methods}</Link>
        </nav>
        <h1>
          <span>{skill.name}</span>
          <em lang="en">{skill.english}</em>
        </h1>
        <p>{skill.description}</p>
        <ul className="g-com-status">
          <li>
            <i aria-hidden="true" />
            {skill.medium}
          </li>
        </ul>
      </header>

      <section
        className="g-com-section"
        data-bg="white"
        aria-labelledby="g-mth-method-title"
      >
        <div className="g-mth-spread">
          {skill.image ? (
            <figure className="g-mth-sample">
              <a
                href={skill.image}
                target="_blank"
                rel="noreferrer"
                aria-label="查看完整创作试样"
                className="g-com-frame"
              >
                <span className="g-com-tape" aria-hidden="true" />
                <img
                  src={skill.image}
                  width={skill.width}
                  height={skill.height}
                  alt={skill.imageAlt}
                />
              </a>
              <figcaption>{t.sample}</figcaption>
            </figure>
          ) : (
            <div className="g-mth-method-cover" aria-hidden="true">
              <em lang="en">
                {t.noImage.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </em>
              <p>{t.noImage.text}</p>
            </div>
          )}
          <div className="g-mth-method">
            <h2 id="g-mth-method-title">{t.method}</h2>
            <ol className="g-com-list">
              {skill.method.map((item, index) => (
                <li key={item.title}>
                  <span className="g-com-index">{pad(index)}</span>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>
            <a
              href={`/downloads/artists/${skill.slug}.zip`}
              download
              className="g-btn"
              onClick={() => setDownloaded(true)}
            >
              <Download size={17} aria-hidden="true" />
              {t.download}
            </a>
            <p className="g-mth-package">
              {t.package[0]}
              <br />
              {t.package[1]}
            </p>
            <output className="g-mth-after">
              {downloaded ? (
                <ShareAfter
                  text={folioCommunity.after.skill}
                  topic="share-artist"
                />
              ) : null}
            </output>
          </div>
        </div>
      </section>

      <section
        className="g-com-section"
        data-bg="paper"
        aria-labelledby="g-mth-use-title"
      >
        <div className="g-com-split">
          <div className="g-mth-use">
            <h2 id="g-mth-use-title">{t.howTitle}</h2>
            <p>{skill.use}</p>
            <ol className="g-mth-steps">
              {t.steps.map((step, index) => (
                <li key={step}>
                  <span className="g-com-index">{pad(index)}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="g-mth-note">{t.note}</p>
          </div>
          <div className="g-mth-prompt">
            <span className="g-com-tape" aria-hidden="true" />
            <CopyPrompt
              id="g-mth-skill-prompt"
              label={t.promptLabel}
              text={skill.prompt}
              button={t.copy}
            />
          </div>
        </div>
      </section>
    </Shell>
  );
}

/** 封底：接着探索同类的方法 */
function ArtistEnding({ slug }: { slug: string }) {
  const t = folioWiki.artist;
  return (
    <section className="g-mth-related" aria-labelledby="g-mth-related-title">
      <h2 id="g-mth-related-title">{t.others}</h2>
      <ul>
        {artistSkills
          .filter((item) => item.slug !== slug)
          .map((item, index) => (
            <li key={item.slug}>
              <Link href={artistHref(item.slug)}>
                <span className="g-com-index" aria-hidden="true">
                  {pad(index)}
                </span>
                <strong>{item.name}</strong>
                <em lang="en">{item.english}</em>
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}
