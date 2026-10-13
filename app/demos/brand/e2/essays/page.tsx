'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { folioEssayAuthor, folioStudio } from '../../../../../content/folio';
import { essayHref, pad } from '../routes';
import { E2Page, type Vars } from '../shell';
import { essayAt, essayItems } from './data';
import './essays.css';

// E2 文章目录：「我们怎么想」。一张安静的索引表——编号、标题与副题、摘要、作者与阅读时长，
// 再用一行小字列出本篇的小节，让人先看到文章是怎么展开的。整行由标题链接铺满（伪元素），
// 作者名单独链到公众号，避免链接套链接；不放重复的「阅读全文」按钮。动效只有逐行淡入。

const { essays, labels } = folioStudio;

export default function E2Essays() {
  return (
    <E2Page current="essays" className="ee" compactFooter>
      <section className="ee-index" aria-labelledby="ee-index-title">
        <header className="ee-index-head" data-reveal>
          <h1 id="ee-index-title">
            <span lang="en">{labels.essays.en}</span>
            <small>{labels.essays.zh}</small>
          </h1>
        </header>

        <div className="ee-cols" aria-hidden="true">
          <span>No.</span>
          <span>Title</span>
          <span>Summary</span>
        </div>
        <ol className="ee-list">
          {essayItems.map((item, index) => {
            const essay = essayAt(item.slug);
            return (
              <li
                key={item.slug}
                data-reveal
                style={{ '--d': `${index * 90}ms` } as Vars}
              >
                <article className="ee-row">
                  <span className="ee-row-no" aria-hidden="true">
                    {pad(index)}
                  </span>
                  <h2 className="ee-row-title">
                    <Link className="ee-row-link" href={essayHref(item.slug)}>
                      <span>{essay.title}</span>
                      {essay.subtitle ? (
                        <>
                          <span className="sr-only">：</span>
                          <small>{essay.subtitle}</small>
                        </>
                      ) : null}
                    </Link>
                  </h2>
                  <div className="ee-row-side">
                    <p className="ee-row-summary">{item.description}</p>
                    <p className="ee-row-meta">
                      <a
                        className="ee-author"
                        href={folioEssayAuthor.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={
                          essays.author + folioEssayAuthor.labelSuffix
                        }
                      >
                        {essays.author}
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                      <span>{essay.story.label}</span>
                      <span>
                        {essay.minutes} {essays.read}
                      </span>
                    </p>
                    <ol className="ee-row-sections">
                      {essay.headings.map((heading, at) => (
                        <li key={heading.id}>
                          <i aria-hidden="true">{pad(at)}</i>
                          {heading.text}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <ArrowRight
                    className="ee-row-go"
                    size={22}
                    aria-hidden="true"
                  />
                </article>
              </li>
            );
          })}
        </ol>

        <p className="ee-index-more" data-reveal>
          <a
            className="e2-link"
            href={folioEssayAuthor.href}
            target="_blank"
            rel="noreferrer"
          >
            {folioEssayAuthor.more}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </p>
      </section>
    </E2Page>
  );
}
