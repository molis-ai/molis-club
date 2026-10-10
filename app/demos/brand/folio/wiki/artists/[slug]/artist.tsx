'use client';
import Link from 'next/link';
import { ArrowUpRight, Download } from 'lucide-react';
import { artistSkills } from '../../../../../../../content/artists';
import { folioWiki } from '../../../../../../../content/folio';
import { pad } from '../../../kit';
import {
  Footer,
  SiteHeader,
  WIKI,
  artistHref,
  useFolioMotion,
} from '../../../shared';
import { CopyPrompt } from '../../demos';
import '../../../folio.css';
import '../../../kit.css';
import '../../wiki.css';

// 艺术家 Skill：试样贴在白纸上，旁边是它组织创作的三步和下载；再讲怎样用、给一段调用示例。

export function WikiArtist({ slug }: { slug: string }) {
  const rootRef = useFolioMotion();
  const skill = artistSkills.find((item) => item.slug === slug)!;
  const t = folioWiki.artist;
  return (
    <div className="fo-site" ref={rootRef}>
      <SiteHeader />
      <main id="main">
        <header className="fw-opening">
          <nav className="fw-trail" aria-label="位置">
            <Link href={WIKI}>{folioWiki.entry.back}</Link>
            <span aria-hidden="true">/</span>
            <Link href={`${WIKI}#artists`}>{folioWiki.artists.kicker}</Link>
          </nav>
          <h1>
            <span>{skill.name}</span>
            <em lang="en">{skill.english}</em>
          </h1>
          <p>{skill.description}</p>
          <ul className="fo-status">
            <li>
              <i aria-hidden="true" />
              {skill.medium}
            </li>
          </ul>
        </header>

        <section
          className="fo-section"
          data-bg="white"
          aria-labelledby="fw-method-title"
        >
          <div className="fw-spread">
            {skill.image ? (
              <figure className="fw-sample">
                <a
                  href={skill.image}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="查看完整创作试样"
                  className="fo-frame"
                >
                  <span className="fo-tape fo-tape-a" aria-hidden="true" />
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
              <div className="fw-method-cover" aria-hidden="true">
                <em lang="en">
                  {t.noImage.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </em>
                <p>{t.noImage.text}</p>
              </div>
            )}
            <div className="fw-method">
              <h2 id="fw-method-title">{t.method}</h2>
              <ol className="fo-list">
                {skill.method.map((item, index) => (
                  <li key={item.title}>
                    <span className="fo-index">{pad(index)}</span>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </li>
                ))}
              </ol>
              <a
                href={`/downloads/artists/${skill.slug}.zip`}
                download
                className="fo-btn fo-btn-ink"
              >
                <Download size={17} aria-hidden="true" />
                {t.download}
              </a>
              <p className="fw-package">
                {t.package[0]}
                <br />
                {t.package[1]}
              </p>
            </div>
          </div>
        </section>

        <section
          className="fo-section"
          data-bg="paper"
          aria-labelledby="fw-use-title"
        >
          <div className="fo-split">
            <div className="fw-use">
              <h2 id="fw-use-title">{t.howTitle}</h2>
              <p>{skill.use}</p>
              <ol className="fw-steps">
                {t.steps.map((step, index) => (
                  <li key={step}>
                    <span className="fo-index">{pad(index)}</span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="fw-note">{t.note}</p>
            </div>
            <div className="fw-prompt">
              <span className="fo-tape fo-tape-a" aria-hidden="true" />
              <CopyPrompt
                id="fw-skill-prompt"
                label={t.promptLabel}
                text={skill.prompt}
                button={t.copy}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer tone="paper">
        <section className="fw-related" aria-labelledby="fw-related-title">
          <h2 id="fw-related-title">{t.others}</h2>
          <ul>
            {artistSkills
              .filter((item) => item.slug !== slug)
              .map((item, index) => (
                <li key={item.slug}>
                  <Link href={artistHref(item.slug)}>
                    <span className="fo-index" aria-hidden="true">
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
      </Footer>
    </div>
  );
}
