'use client';
import { useState } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import { artistSkills } from '../../../../../../../../content/artists';
import { folioWiki } from '../../../../../../../../content/folio';
import { folioCommunity } from '../../../../../../../../content/folio-community';
import { artistHref, pad } from '../../../../routes';
import { E2Page, Plate } from '../../../../shell';
import { CopyPrompt, ShareAfter } from '../../../copy';
import { DetailOpening, DetailRelated } from '../../detail';

// 艺术家 Skill（社区「方法」的详情，阅读模式）：开篇一句它看什么；图版上是 AI 创作试样，旁边是它组织创作的
// 三步和下载；再讲怎样带进自己的创作、给一段调用示例。下载后提示可以把作品也发给我们一份。

export function MethodArtist({ slug }: { slug: string }) {
  const skill = artistSkills.find((item) => item.slug === slug)!;
  const t = folioWiki.artist;
  const [downloaded, setDownloaded] = useState(false);
  return (
    <E2Page
      current="community"
      className="ecd"
      footer={
        <DetailRelated
          title={t.others}
          items={artistSkills
            .filter((item) => item.slug !== slug)
            .map((item) => ({ ...item, href: artistHref(item.slug) }))}
        />
      }
    >
      <DetailOpening
        name={skill.name}
        english={skill.english}
        description={skill.description}
        tags={[skill.medium]}
      />

      <section
        className="ecd-section ecd-spread"
        aria-labelledby="ecd-method-title"
      >
        {skill.image ? (
          <Plate fig="Fig. 01" caption={t.sample} className="ecd-sample">
            <a
              href={skill.image}
              target="_blank"
              rel="noreferrer"
              aria-label="查看完整创作试样"
            >
              <img
                src={skill.image}
                width={skill.width}
                height={skill.height}
                alt={skill.imageAlt}
              />
              <ArrowUpRight
                className="ecd-sample-open"
                size={16}
                aria-hidden="true"
              />
            </a>
          </Plate>
        ) : (
          <Plate fig="Fig. 01" className="ecd-sample">
            <div className="ecd-cover" aria-hidden="true">
              <em lang="en">
                {t.noImage.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </em>
              <p>{t.noImage.text}</p>
            </div>
          </Plate>
        )}
        <div className="ecd-method">
          <h2 id="ecd-method-title">{t.method}</h2>
          <ol className="ecd-steps">
            {skill.method.map((item, index) => (
              <li key={item.title} data-reveal>
                <i aria-hidden="true">{pad(index)}</i>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
          <div className="ecd-download">
            <a
              href={`/downloads/artists/${skill.slug}.zip`}
              download
              className="e2-button e2-button-ink"
              onClick={() => setDownloaded(true)}
            >
              <Download size={15} aria-hidden="true" />
              {t.download}
            </a>
            <p className="ecd-package">
              <span>{t.package[0]}</span>
              <span>{t.package[1]}</span>
            </p>
            <output className="ecm-status">
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

      <section className="ecd-section ecd-use" aria-labelledby="ecd-use-title">
        <div className="ecd-use-copy">
          <h2 id="ecd-use-title">{t.howTitle}</h2>
          <p className="ecd-use-text">{skill.use}</p>
          <ol className="ecd-install">
            {t.steps.map((step, index) => (
              <li key={step}>
                <i aria-hidden="true">{pad(index)}</i>
                {step}
              </li>
            ))}
          </ol>
          <p className="ecd-note">{t.note}</p>
        </div>
        <div className="ecm-sheet">
          <CopyPrompt
            id="ecd-skill-prompt"
            label={t.promptLabel}
            text={skill.prompt}
            button={t.copy}
          />
        </div>
      </section>
    </E2Page>
  );
}
